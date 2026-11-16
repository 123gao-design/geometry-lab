<template>
  <canvas ref="cv" class="bg-poly" :class="'bg-poly-' + pos" aria-hidden="true"></canvas>
</template>

<script setup>
// 旋转线框多面体：法线朝外的二十面体 + 内嵌反向自转的正八面体。
// 与 BgMotion 是两套东西：那边是逐帧累积的拖尾（不清屏），这边每帧整幅重画（清屏），
// 所以放在单独一块画布上，互不干扰。位置由 PREFS.bgSolidPos 选：右下角 / 左侧留白 / 右侧留白。
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({ pos: { type: String, default: 'br' } });

const PHI = (1 + Math.sqrt(5)) / 2;
const D = 4.2;            // 相机距离（外接球半径记为 1），给一点透视，近大远小才立体
const YAW_SPEED = 0.26;   // 每秒自转角，慢到像悬浮而不是转陀螺
const PITCH0 = 0.42;      // 基准俯角，另叠一点缓慢点头与每次刷新都不同的随机翻滚

const cv = ref(null);

let ctx = null;
let raf = 0;
let W = 0;
let H = 0;
let t = 0;
let last = 0;
let tick = 0;

// 外层多面体的随机姿态：每次加载都从不同的朝向与翻滚方向起手，
// 同一个页面刷新两次看到的转动也不重样
let yaw0 = 0;
let roll0 = 0;
let rollV = 0;
let ph = 0;

function seedAngles() {
  yaw0 = Math.random() * Math.PI * 2;
  roll0 = Math.random() * Math.PI * 2;
  rollV = (Math.random() - 0.5) * 0.16;   // 每秒 ±0.08 rad 的翻滚，正反随机
  ph = Math.random() * Math.PI * 2;
}

const unit = v => {
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / n, v[1] / n, v[2] / n];
};

const ICO = [
  [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
  [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1],
].map(unit);
const OCT = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(unit);

// 顶点等距的棱：二十面体相邻顶点距 ≈1.051、正八面体棱长 √2≈1.414
function edgesOf(vs, lo, hi) {
  const out = [];
  for (let i = 0; i < vs.length; i++) {
    for (let j = i + 1; j < vs.length; j++) {
      const d = Math.hypot(vs[i][0] - vs[j][0], vs[i][1] - vs[j][1], vs[i][2] - vs[j][2]);
      if (d > lo && d < hi) out.push([i, j]);
    }
  }
  return out;
}
const ICO_EDGES = edgesOf(ICO, 1.0, 1.1);
const OCT_EDGES = edgesOf(OCT, 1.0, 1.5);

const isLight = () => document.documentElement.classList.contains('light');
const still = () => document.documentElement.classList.contains('no-anim');
const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

function resize() {
  const el = cv.value;
  if (!el || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = el.clientWidth || 0;
  const h = el.clientHeight || 0;
  if (!w || !h) return;
  const pw = Math.max(1, Math.round(w * dpr));
  const ph = Math.max(1, Math.round(h * dpr));
  if (w === W && h === H && el.width === pw && el.height === ph) return;
  W = w;
  H = h;
  el.width = pw;
  el.height = ph;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// 摆位：右下角是一块固定尺寸的正方形，交给 CSS 的 clamp；左右两档则量 main 的边距——
// main 居中且 max-width 1720，两侧留白就是空档，画布只占这条带，图形再按带宽收，
// 整颗多面体才不会伸到正文底下被盖掉一截。留白太窄（1920 及以下的屏几乎没有）就整层收起。
const MIN_BAND = 200;

function measure() {
  const el = cv.value;
  if (!el || !ctx) return;
  if (props.pos === 'br') {
    el.style.display = '';
    el.style.width = '';
    resize();
    return;
  }
  const main = document.querySelector('main');
  const r = main && main.getBoundingClientRect ? main.getBoundingClientRect() : null;
  const band = !r ? 0 : Math.max(0, Math.round(props.pos === 'right' ? window.innerWidth - r.right : r.left));
  // 聊天窗/画板窗让位时 main 会加内边距，不影响 margin，留白宽度不变；
  // 这里每秒重测一次，是为了应对主题切换、抽屉展开等会改版面的操作
  if (band < MIN_BAND) {
    el.style.display = 'none';
    W = 0;
    H = 0;
    return;
  }
  el.style.display = '';
  el.style.width = band + 'px';
  resize();
}

watch(() => props.pos, () => {
  W = 0;
  H = 0;
  measure();
});

// 一颗多面体：先绕 y 轴自转、再俯仰、最后在屏幕平面里翻滚，按透视投到屏幕，
// 再把棱从远到近描一遍
function wire(cx, cy, R, vs, edges, yaw, pitch, roll, dim, light) {
  const cyw = Math.cos(yaw);
  const syw = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const pts = vs.map(v => {
    const x1 = v[0] * cyw + v[2] * syw;
    const z1 = -v[0] * syw + v[2] * cyw;
    const y2 = v[1] * cp - z1 * sp;
    const z2 = v[1] * sp + z1 * cp;
    const xr = x1 * cr - y2 * sr;
    const yr = x1 * sr + y2 * cr;
    const f = D / (D - z2);          // z2 ∈ [-1,1] → 0.81…1.31
    return { x: cx + xr * R * f, y: cy - yr * R * f, z: z2 };
  });

  const list = edges.map(([i, j]) => ({ a: pts[i], b: pts[j], z: (pts[i].z + pts[j].z) / 2 }));
  list.sort((m, n) => m.z - n.z);

  // 线宽与点半径跟着图形大小走：大屏上不显得细如发丝，小屏上不糊成一片
  const sw = Math.min(1.7, Math.max(0.7, R / 150));

  ctx.lineCap = 'round';
  for (let e = 0; e < list.length; e++) {
    const { a, b, z } = list[e];
    const k = (z + 1) / 2;           // 0 远 → 1 近
    const h = Math.round(206 + 48 * (0.5 + 0.5 * Math.sin(t * 0.22 + e * 0.9)));
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    // 外晕：宽而极淡，深色主题上用加色叠出一点辉光
    ctx.lineWidth = (2.4 + 5.6 * k) * dim * sw;
    ctx.strokeStyle = light
      ? 'hsla(' + h + ',60%,52%,' + (0.018 + 0.040 * k) * dim + ')'
      : 'hsla(' + h + ',88%,62%,' + (0.025 + 0.055 * k) * dim + ')';
    ctx.stroke();
    // 芯线：细，近的亮
    ctx.lineWidth = (0.7 + 1.3 * k) * sw;
    ctx.strokeStyle = light
      ? 'hsla(' + h + ',62%,46%,' + (0.10 + 0.22 * k) * dim + ')'
      : 'hsla(' + h + ',86%,72%,' + (0.15 + 0.33 * k) * dim + ')';
    ctx.stroke();
  }

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const k = (p.z + 1) / 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, (1.0 + 1.5 * k) * dim * sw, 0, Math.PI * 2);
    ctx.fillStyle = light
      ? 'hsla(218,55%,46%,' + (0.14 + 0.26 * k) * dim + ')'
      : 'hsla(210,90%,80%,' + (0.22 + 0.40 * k) * dim + ')';
    ctx.fill();
  }
}

function frame(now) {
  raf = 0;
  if (!ctx) return;
  // 🎨 里关掉「背景光影」时本层已被 CSS 藏起来；这里让 rAF 继续空转，重新打开就能接上
  if (still()) {
    raf = requestAnimationFrame(frame);
    return;
  }
  const dt = last ? Math.min(0.06, (now - last) / 1000) : 0.016;
  last = now;
  t += dt;
  paint();
  // 版面偶尔会自己变（主题、抽屉、聊天窗让位），每秒重测一次留白宽度
  if (++tick % 90 === 0) measure();
  raf = requestAnimationFrame(frame);
}

function paint() {
  if (!ctx || !W || !H) return;
  const light = isLight();
  ctx.clearRect(0, 0, W, H);
  // 深色下整组线用加色混合，交叠处自然发亮；浅色底上加色会漂白，仍走正常混合
  ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';

  const cx = W / 2;
  const corner = props.pos === 'br';
  const cy = H * (corner ? 0.5 : 0.46) + Math.sin(t * 0.32) * 6;
  // 半径跟着画布走：角上那块是正方形，取 0.30·min(W,H)；留白档要保证投影后的最外缘
  // （f 最大 1.31）仍留在带内，所以按带宽乘 0.36
  const R = corner ? Math.min(W, H) * 0.30 : Math.min(W * 0.36, H * 0.30);

  // 背后一小团冷光，让多面体像是悬在雾里
  if (!light) {
    const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 2.0);
    g.addColorStop(0, 'hsla(222,88%,58%,0.055)');
    g.addColorStop(1, 'hsla(250,88%,58%,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 2.0, 0, Math.PI * 2);
    ctx.fill();
  }

  wire(cx, cy, R, ICO, ICO_EDGES,
    yaw0 + t * YAW_SPEED,
    PITCH0 + 0.20 * Math.sin(t * 0.05 + ph),
    roll0 + t * rollV + 0.12 * Math.sin(t * 0.037 + ph),
    1, light);
  wire(cx, cy, R * 0.46, OCT, OCT_EDGES, -t * YAW_SPEED * 1.5, 0.3 - 0.18 * Math.sin(t * 0.09), 0, 0.85, light);

  ctx.globalCompositeOperation = 'source-over';
}

function onResize() {
  measure();
  if (reduced()) paint();
}

function onVisibility() {
  if (document.hidden) {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  } else if (!raf && !reduced()) {
    last = 0;
    raf = requestAnimationFrame(frame);
  }
}

onMounted(() => {
  const el = cv.value;
  ctx = el && el.getContext ? el.getContext('2d') : null;
  if (!ctx) return;
  seedAngles();
  measure();
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  if (reduced()) paint();
  else raf = requestAnimationFrame(frame);
});

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVisibility);
});
</script>
