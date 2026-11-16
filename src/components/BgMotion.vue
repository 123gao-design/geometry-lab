<template>
  <canvas ref="cv" class="bg-motion" aria-hidden="true"></canvas>
</template>

<script setup>
// 背景动态层：整屏 fixed 画布，画在内容之下（z-index:-1），只做装饰、不接收指针。
// 场景取自 lib/chaos.js；PREFS.bgScene 为 glow 时这里不画，交给 App.vue 的 .bg-fx 柔光。
// 「✨ 背景光影」的 html.no-anim 与系统的 prefers-reduced-motion 都会让本层让路。
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { PREFS } from '../lib/settings.js';
import { CHAOS_IDS, SCENES } from '../lib/chaos.js';

const TAU = Math.PI * 2;
const BUCKETS = 12;
const PITCH = 0.34;          // 3D 视角俯角（弧度）
const YAW_SPEED = 0.05;      // 每秒环绕角速度，慢到像空气在转
const SPEED = 0.3;           // 时间流速（乘在 scene.steps 上），越小越慢
const HUE_SPAN = 44;         // 整幅画只用这么宽的色相带，色相中心缓慢漂移

const cv = ref(null);

// 线条颜色与浓度（设置页「背景动画」段）：PREFS.bgInk 为 'auto' 时用原来的冷蓝色带，
// 否则按自定义色的色相重新配色；PREFS.bgAlpha 是透明度倍数（1 为标准）。
// 两者都只改下一帧的描线参数，不重播种粒子——拖滑块时画面不会重来一遍。
let inkH = null;   // 自定义色的色相（null = 默认冷蓝族）
let inkS = 0;      // 自定义色的饱和度 0–1

function parseInk() {
  inkH = null;
  inkS = 0;
  const v = PREFS.bgInk;
  if (typeof v !== 'string' || v[0] !== '#' || v.length !== 7) return;
  const n = parseInt(v.slice(1), 16);
  if (!Number.isFinite(n)) return;
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  if (!mx || !d) { inkH = 205; inkS = 0; return; }   // 灰 / 黑：色相无意义，按中性冷灰走，别除零
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  inkH = (h + 360) % 360;
  inkS = d / mx;
}

// 浓度倍数：夹在 0.3–2.5，读不到就按标准 1
function gain() {
  const n = Number(PREFS.bgAlpha);
  return Number.isFinite(n) ? Math.min(2.5, Math.max(0.3, n)) : 1;
}

let ctx = null;
let raf = 0;
let W = 0;
let H = 0;
let t = 0;
let last = 0;
let stepAcc = 0;
let scene = null;
let parts = [];
// 自动取景（场景声明 autofit 时）：种子粒子的落点包络，投影时把这块包络拉到视口四边。
// 离散映射的吸引子常比「公式理论范围」窄得多，按固定除数归一就只剩中间一块；
// 先量一遍真实包络再映射，无论映射张到哪里都铺满整幅。
let fit = null;

const nrm = { u: 0, v: 0, w: 0 };
const proj = { x: 0, y: 0 };

const rnd = () => Math.random();
const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const isLight = () => document.documentElement.classList.contains('light');
const still = () => document.documentElement.classList.contains('no-anim');

function currentId() {
  if (PREFS.bgMotionOn !== 'on') return '';
  return CHAOS_IDS.includes(PREFS.bgScene) ? PREFS.bgScene : '';
}

function resize() {
  const el = cv.value;
  if (!el || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = el.clientWidth || window.innerWidth || 1280;
  const h = el.clientHeight || window.innerHeight || 800;
  const pw = Math.max(1, Math.round(w * dpr));
  const ph = Math.max(1, Math.round(h * dpr));
  // 尺寸没变就不重播种（手机地址栏收放会连着抛 resize）
  if (w === W && h === H && el.width === pw && el.height === ph) return;
  W = w;
  H = h;
  el.width = pw;
  el.height = ph;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seed();
}

// 每个粒子先空转若干步，落到吸引子上再开始画，第一帧就有形状。
// 少数初值可能把显式欧拉推飞（艾泽瓦的 z³ 项最敏感），这时返回 null 让调用方换个种子。
function warm(s) {
  for (let k = 0; k < 240; k++) {
    scene.step(s, 0);
    for (let j = 0; j < s.length; j++) {
      if (!Number.isFinite(s[j]) || Math.abs(s[j]) > 1e4) return null;
    }
  }
  return s;
}

function fresh() {
  return warm(scene.spawn(rnd)) || scene.spawn(rnd);
}

// 场景声明了 life 的（目前只有 NS），粒子活到头就换个位置重新出生。
// 示踪粒子在数值流里跑久了会自己聚成一条条堆、边上留下空洞，隔一阵换一批能把密度摊匀，
// 免得画面上出现「挤成一团的黑线」和「一大片空白」。
function lifeOf() {
  const L = scene.life;
  return L ? L[0] + rnd() * (L[1] - L[0]) : 0;
}

function seed() {
  if (!scene) return;
  const raw = ((W * H) / 1400) * (scene.weight || 1);
  const n = Math.round(Math.min(3600, Math.max(520, raw)));
  parts = [];
  for (let i = 0; i < n; i++) {
    parts.push({
      s: fresh(),
      hue: (rnd() - 0.5) * HUE_SPAN,
      life: lifeOf(),
      px: 0,
      py: 0,
      ok: false,
      // 滑行档（离散映射）用：本段起点 x0/y0、目标 tx/ty、单位方向 ux/uy、全长 len、已走 td、速度 spd
      x0: 0,
      y0: 0,
      tx: 0,
      ty: 0,
      ux: 0,
      uy: 0,
      len: 0,
      td: 0,
      spd: 0,
    });
  }
  fit = fitOf();
}

// 量一遍种子粒子的 u/v 包络（吸引子实际占的地方），供 project 换算成整幅画面
function fitOf() {
  if (!scene || !scene.autofit) return null;
  let u0 = Infinity;
  let u1 = -Infinity;
  let v0 = Infinity;
  let v1 = -Infinity;
  for (let i = 0; i < parts.length; i++) {
    scene.norm(parts[i].s, nrm);
    if (!Number.isFinite(nrm.u) || !Number.isFinite(nrm.v)) continue;
    if (nrm.u < u0) u0 = nrm.u;
    if (nrm.u > u1) u1 = nrm.u;
    if (nrm.v < v0) v0 = nrm.v;
    if (nrm.v > v1) v1 = nrm.v;
  }
  if (!(u1 > u0) || !(v1 > v0)) return null;
  return { cu: (u0 + u1) / 2, cv: (v0 + v1) / 2, hu: (u1 - u0) / 2, hv: (v1 - v0) / 2 };
}

function project(yaw) {
  const R = Math.min(W, H) * 0.46;
  if (scene.flat) {
    // 自动取景档：把吸引子的实际包络拉到视口四边（x/y 各吃各的比例，与 wide 档同一口径）
    if (fit) {
      proj.x = W / 2 + ((nrm.u - fit.cu) / fit.hu) * (W * 0.52);
      proj.y = H / 2 - ((nrm.v - fit.cv) / fit.hv) * (H * 0.52);
      return;
    }
    const rx = scene.wide ? W * 0.56 : R;
    const ry = scene.wide ? H * 0.56 : R;
    proj.x = W / 2 + nrm.u * rx;
    proj.y = H / 2 - nrm.v * ry;
    return;
  }
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const X = nrm.u * cy + nrm.v * sy;
  const Z = -nrm.u * sy + nrm.v * cy;
  const cp = Math.cos(PITCH);
  const sp = Math.sin(PITCH);
  const Y = nrm.w * cp - Z * sp;
  proj.x = W / 2 + X * R;
  proj.y = H / 2 - Y * R;
}

// 滑行档的落点：走一步映射、投影，记下这条弦的起点 / 方向 / 长度 / 速度。
// 速度按像素定（70–140 px/s），每条弦快慢随机才像气流；跑飞就换个种子、这一帧不连线
function aim(p, yaw) {
  scene.step(p.s, t);
  scene.norm(p.s, nrm);
  if (!Number.isFinite(nrm.u) || !Number.isFinite(nrm.v) || !Number.isFinite(nrm.w) ||
      Math.abs(nrm.u) > 3 || Math.abs(nrm.v) > 3 || Math.abs(nrm.w) > 3) {
    p.s = fresh();
    p.ok = false;
    return false;
  }
  project(yaw);
  p.tx = proj.x;
  p.ty = proj.y;
  p.x0 = p.px;
  p.y0 = p.py;
  const dx = p.tx - p.x0;
  const dy = p.ty - p.y0;
  const len = Math.sqrt(dx * dx + dy * dy);
  p.len = len;
  p.td = 0;
  if (len < 0.5) {
    p.ux = 0;
    p.uy = 0;
    p.spd = 0;
  } else {
    p.ux = dx / len;
    p.uy = dy / len;
    // 速度按像素走，不按「一弦多久走完」：弦有长有短，定速才不会被长弦拉成一道闪电
    p.spd = 70 + rnd() * 70;
  }
  return true;
}

function draw(now) {
  raf = 0;
  if (!ctx || !scene) return;
  if (still()) {
    raf = requestAnimationFrame(draw);
    return;
  }
  const dt = last ? Math.min(0.06, (now - last) / 1000) : 0.016;
  last = now;
  t += dt;

  const light = isLight();

  // 旧轨迹退成雾气：destination-out 每帧轻擦一层；雾场景擦得更慢，丝缕才连得起来
  const fade = scene.fog ? 0.034 : (light ? 0.055 : 0.058);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,' + fade + ')';
  ctx.fillRect(0, 0, W, H);

  // 时间流速按累计步数走整数步，慢到像气体在漂
  stepAcc += scene.steps * SPEED;
  const nStep = Math.floor(stepAcc);
  stepAcc -= nStep;

  // 自定义色只接管色相与饱和度：深浅仍按「烟 / 细线」「深色 / 浅色主题」分层，
  // 默认档保持原来那条 205° 附近、±26° 漂移的冷蓝色带
  const fog = !!scene.fog;
  const g = gain();
  const hue0 = inkH == null ? 205 : inkH;
  const drift = inkH == null ? 26 : 12;
  const base = hue0 + drift * Math.sin(t * 0.06);
  const satSmoke = inkH == null ? (light ? 62 : (fog ? 72 : 76)) : Math.round(Math.min(90, 34 + inkS * 62));
  const satFine = inkH == null ? (light ? 68 : 88) : Math.round(Math.min(96, 46 + inkS * 52));
  const yaw = t * YAW_SPEED;
  const jump2 = Math.pow(0.06 * Math.min(W, H), 2);   // 超过这个位移就当作瞬移，不连线
  const glide = !!scene.glide;
  const segs = [];
  for (let b = 0; b < BUCKETS; b++) segs.push([]);

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    // 换寿：换个位置重新出生，这一帧不连线
    if (p.life > 0) {
      p.life -= dt;
      if (p.life <= 0) {
        p.s = scene.spawn(rnd);
        p.life = lifeOf();
        p.ok = false;
        continue;
      }
    }
    if (glide) {
      // 离散映射改走「滑行」：每到一个落点再走一步映射、抽下一弦，途中按 spd 匀速前进，
      // 每帧只连相邻两帧（最多几十像素）——看上去是光点沿直线流过去，不是凭空闪一下
      if (!p.ok) {
        // 起步：先站在第一个落点上，再抽下一个落点当目标
        if (!aim(p, yaw)) continue;
        p.px = p.tx;
        p.py = p.ty;
        if (!aim(p, yaw)) continue;
        p.ok = true;
        continue;
      }
      p.td += p.spd * dt;
      if (!(p.spd > 0) || p.td >= p.len) {
        // 到站：落在目标上，立刻换下一弦（这一帧不补线段，方向在这里转）
        p.px = p.tx;
        p.py = p.ty;
        aim(p, yaw);
        continue;
      }
      const nx = p.x0 + p.ux * p.td;
      const ny = p.y0 + p.uy * p.td;
      const h = ((base + p.hue) % 360 + 360) % 360;
      segs[Math.floor(h / (360 / BUCKETS)) % BUCKETS].push(p.px, p.py, nx, ny);
      p.px = nx;
      p.py = ny;
      continue;
    }
    for (let k = 0; k < nStep; k++) scene.step(p.s, t);
    scene.norm(p.s, nrm);
    if (!Number.isFinite(nrm.u) || !Number.isFinite(nrm.v) || !Number.isFinite(nrm.w) ||
        Math.abs(nrm.u) > 3 || Math.abs(nrm.v) > 3 || Math.abs(nrm.w) > 3) {
      p.s = fresh();
      p.life = lifeOf();
      p.ok = false;
      continue;
    }
    project(yaw);
    const dx = proj.x - p.px;
    const dy = proj.y - p.py;
    const d2 = dx * dx + dy * dy;
    // 出框回绕、映射级跳变会让这一帧与上一帧隔着大半屏，断笔，否则拉出一条长直线
    if (p.ok && d2 > 0.04 && d2 < jump2) {
      const h = ((base + p.hue) % 360 + 360) % 360;
      const b = Math.floor(h / (360 / BUCKETS)) % BUCKETS;
      segs[b].push(p.px, p.py, proj.x, proj.y);
    }
    p.px = proj.x;
    p.py = proj.y;
    p.ok = true;
  }

  // 一层粗而极淡的烟，一层细的线。
  // 烟用 source-over 铺底色（颜色本身就够饱和，密处叠到饱和是个干净的蓝，不发黑）；
  // 细线在深色主题上用 lighter 加色，重叠的段落自己提亮，越密越亮而不是越密越暗。
  // 2026-11-16 用户「线条太淡，看不清」，两层透明度都往上提了一档（线条约翻倍）。
  ctx.globalCompositeOperation = 'source-over';
  for (let b = 0; b < BUCKETS; b++) {
    const arr = segs[b];
    if (!arr.length) continue;
    const h = Math.round((b + 0.5) * (360 / BUCKETS));
    ctx.beginPath();
    for (let j = 0; j < arr.length; j += 4) {
      ctx.moveTo(arr[j], arr[j + 1]);
      ctx.lineTo(arr[j + 2], arr[j + 3]);
    }
    ctx.lineWidth = fog ? 10 : 4.5;
    // 透明度 = 基准值 × 设置页的浓度倍数（写法保留三位小数，免得拼出 0.09750000000000001）
    ctx.strokeStyle = light
      ? 'hsla(' + h + ',' + satSmoke + '%,56%,' + (0.040 * g).toFixed(3) + ')'
      : (fog ? 'hsla(' + h + ',' + satSmoke + '%,72%,' + (0.052 * g).toFixed(3) + ')'
        : 'hsla(' + h + ',' + satSmoke + '%,66%,' + (0.075 * g).toFixed(3) + ')');
    ctx.stroke();
  }

  ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';
  for (let b = 0; b < BUCKETS; b++) {
    const arr = segs[b];
    if (!arr.length) continue;
    const h = Math.round((b + 0.5) * (360 / BUCKETS));
    ctx.beginPath();
    for (let j = 0; j < arr.length; j += 4) {
      ctx.moveTo(arr[j], arr[j + 1]);
      ctx.lineTo(arr[j + 2], arr[j + 3]);
    }
    ctx.lineWidth = fog ? 1.6 : 1.1;
    ctx.strokeStyle = light
      ? 'hsla(' + h + ',' + satFine + '%,44%,' + (0.095 * g).toFixed(3) + ')'
      : 'hsla(' + h + ',' + satFine + '%,70%,' + (0.130 * g).toFixed(3) + ')';
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';

  raf = requestAnimationFrame(draw);
}

// 减少动态效果时只铺一帧静态星尘，不再逐帧推进
function drawStatic() {
  if (!ctx || !scene) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.value.width, cv.value.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const light = isLight();
  const g = gain();
  // 星尘的饱和度也跟自定义色走，不然切了颜色只剩色相、看着还是灰蓝
  const sat = inkH == null ? (light ? 30 : 34) : Math.round(Math.min(80, 24 + inkS * 50));
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i % 3) continue;
    scene.norm(p.s, nrm);
    project(0);
    const h = Math.round((inkH == null ? 212 : inkH) + p.hue);
    ctx.fillStyle = light
      ? 'hsla(' + h + ',' + sat + '%,46%,' + (0.45 * g).toFixed(3) + ')'
      : 'hsla(' + h + ',' + sat + '%,80%,' + (0.5 * g).toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 1.3, 0, TAU);
    ctx.fill();
  }
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  if (ctx && cv.value) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.value.width, cv.value.height);
  }
}

function start() {
  stop();
  if (!ctx) return;
  const id = currentId();
  scene = id ? SCENES[id] : null;
  if (!scene) return;
  parseInk();
  W = 0;
  H = 0;          // 清掉尺寸缓存，逼 resize 重新播种（切场景时旧粒子不能接着用）
  resize();
  t = 0;
  last = 0;
  stepAcc = 0;
  if (reduced()) drawStatic();
  else raf = requestAnimationFrame(draw);
}

function onResize() {
  if (!scene) return;
  resize();
  if (reduced()) drawStatic();
}

// 切到别的前台标签就停 loop；回来接着画，不重播种（否则每次切回都从头散开一遍）
function onVisibility() {
  if (document.hidden) {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  } else if (!raf && scene && !reduced()) {
    last = 0;
    raf = requestAnimationFrame(draw);
  }
}

onMounted(() => {
  const el = cv.value;
  ctx = el && el.getContext ? el.getContext('2d') : null;
  if (!ctx) return;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  start();
});

watch(() => [PREFS.bgScene, PREFS.bgMotionOn], () => start());
// 颜色与浓度只改描线参数，不重播种：滑块拖起来画面是渐变的，不会整个重来
watch(() => [PREFS.bgInk, PREFS.bgAlpha], () => {
  parseInk();
  if (reduced()) drawStatic();
});

onBeforeUnmount(() => {
  stop();
  window.removeEventListener('resize', onResize);
  document.removeEventListener('visibilitychange', onVisibility);
  scene = null;
  parts = [];
});
</script>
