<template>
  <div class="plab">
    <div ref="stageEl" class="stage">
      <div ref="hostEl" class="stage-body">
        <canvas ref="cvEl"></canvas>
      </div>

      <div class="tbar">
        <router-link class="tb-back" :to="DEMO_PART">← 演示实验</router-link>
        <b class="tb-t">{{ meta ? meta.title : '—' }}</b>
        <span v-if="meta" class="tb-d">{{ meta.dim === '3d' ? '三维 · three.js' : '二维' }}</span>
      </div>

      <div v-if="meta && introOn" class="intro">
        <button type="button" class="in-x" title="隐藏实验简介" @click="toggleIntro">×</button>
        <p class="in-t">{{ meta.blurb }}</p>
      </div>

      <div v-if="rows.length" class="hud">
        <div v-for="r in rows" :key="r[0]" class="hud-r">
          <em>{{ r[0] }}</em><span>{{ r[1] }}</span>
        </div>
      </div>

      <div v-if="howOpen && meta && meta.method" class="how">
        <div class="how-h">
          <b>原理与公式</b>
          <button type="button" title="收起" @click="howOpen = false">×</button>
        </div>
        <p class="how-m">{{ meta.method.model }}</p>
        <ul class="how-s">
          <li v-for="(s, i) in meta.method.flow" :key="i">{{ s }}</li>
        </ul>
        <div class="how-f">
          <Katex v-for="(f, i) in meta.method.formulas" :key="i" :tex="f" display />
        </div>
      </div>

      <div class="panel" :class="{ shut: panelShut }">
        <button class="p-toggle" type="button" @click="panelShut = !panelShut">
          {{ panelShut ? '参数 ▸' : '参数 ▾' }}
        </button>
        <div v-if="!panelShut && meta" class="p-body">
          <label v-for="q in meta.params" :key="q.k" class="prm">
            <span class="prm-l">{{ q.label }}</span>
            <input type="range" :min="q.min" :max="q.max" :step="q.step" v-model.number="pv[q.k]" />
            <span class="prm-v">{{ showVal(q) }}</span>
          </label>
        </div>
      </div>

      <div class="acts">
        <span v-if="is2d" class="zoom">
          <button type="button" class="z" title="缩小" @click="zoomStep(1 / 1.3)">－</button>
          <button type="button" class="z z-v" :title="'当前 ' + zoomPct + '%，点击复原视野'" @click="viewReset">{{ zoomPct }}%</button>
          <button type="button" class="z" title="放大" @click="zoomStep(1.3)">＋</button>
        </span>
        <button v-if="is2d" type="button" class="an" :class="{ on: infoOn }" @click="toggleInfo">
          {{ infoOn ? '分析 · 常显' : '分析 · 悬停' }}
        </button>
        <button v-if="is2d" type="button" class="an" :class="{ on: holdOn }" title="指针停到物体上时把实验定格" @click="toggleHold">
          悬停定格
        </button>
        <label class="sld" :title="'播放速度 ' + speedText + '×，双击回到 1×'">
          <span>速度</span>
          <input
            type="range" min="0.1" max="3" step="0.05"
            :value="speed" @input="onSpeed" @dblclick="resetSpeed"
          />
          <b>{{ speedText }}×</b>
        </label>
        <label class="sld" :title="'物体大小 ' + objText + '，双击回到 100%'">
          <span>物体</span>
          <input
            type="range" min="0.5" max="1.8" step="0.05"
            :value="objScaleVal" @input="onObjScale" @dblclick="resetObjScale"
          />
          <b>{{ objText }}</b>
        </label>
        <button type="button" class="an" :class="{ on: introOn }" title="实验简介：顶部中间的说明框，点了收起" @click="toggleIntro">简介</button>
        <button type="button" class="an" :class="{ on: howOpen }" @click="howOpen = !howOpen">原理</button>
        <button type="button" @click="togglePause">{{ paused ? '▶ 继续' : '⏸ 暂停' }}</button>
        <button type="button" @click="resetAll">↺ 重置</button>
        <router-link v-if="prevTo" class="act" :to="prevTo">‹ 上一个</router-link>
        <router-link v-if="nextTo" class="act" :to="nextTo">下一个 ›</router-link>
      </div>

      <div v-if="loading" class="veil">
        <span class="spin" />
        正在装载物理引擎
      </div>
      <div v-else-if="error" class="veil err">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { EXPERIMENTS, findExp } from '../physics/index.js';
import { DEMO_PART } from '../physics/plan.js';
import { readPal, VIEW, resetView } from '../physics/gfx.js';
import { getRapier2D, getRapier3D } from '../lib/physics/rapier.js';
import { PREFS, setPref } from '../lib/settings.js';
import Katex from '../components/Katex.vue';

const route = useRoute();
const stageEl = ref(null);
const hostEl = ref(null);
const cvEl = ref(null);

const rows = ref([]);
const pv = reactive({});
const paused = ref(false);
const panelShut = ref(false);
const loading = ref(true);
const error = ref('');

const meta = computed(() => findExp(route.params.id));
const is2d = computed(() => !meta.value || meta.value.dim !== '3d');
const zoomPct = ref(100);

/* 受力分析：默认只在鼠标停到物体上时画，开关一按就常显。偏好存进 gl-prefs。 */
const infoOn = computed(() => PREFS.physInfo === 'on');
const toggleInfo = () => setPref('physInfo', infoOn.value ? 'off' : 'on');
const howOpen = ref(false);

/* 播放速度、物体大小与悬停定格同属「看得清」这一组：前两项各一根滑块，
   值直接写进 gl-prefs，外壳每帧现读，拖动即刻生效 */
const speed = computed(() => {
  const v = Number(PREFS.physSpeed);
  return Number.isFinite(v) && v > 0 ? v : 1;
});
const speedText = computed(() => speed.value.toFixed(2).replace(/\.?0+$/, ''));
const onSpeed = e => setPref('physSpeed', Number(e.target.value));
const resetSpeed = () => setPref('physSpeed', 1);

const objScaleVal = computed(() => {
  const v = Number(PREFS.physScale);
  return Number.isFinite(v) && v > 0 ? v : 1;
});
const objText = computed(() => Math.round(objScaleVal.value * 100) + '%');
const onObjScale = e => setPref('physScale', Number(e.target.value));
const resetObjScale = () => setPref('physScale', 1);

const holdOn = computed(() => PREFS.physHold === 'on');
const toggleHold = () => setPref('physHold', holdOn.value ? 'off' : 'on');

/* 实验简介：顶部中间单独一个框，右下「简介」与框角的 × 都能收放，状态存进 gl-prefs */
const introOn = computed(() => PREFS.physIntro !== 'off');
const toggleIntro = () => setPref('physIntro', introOn.value ? 'off' : 'on');

// 指针位置交给实验模块自己判「停到没停到物体上」：模块只拿到 CSS 像素，
// 世界坐标由各自的 camera2d 换算（缩放、平移都算在内）
const ptr = { x: 0, y: 0, in: false };
const ui = {
  get x() { return ptr.x; },
  get y() { return ptr.y; },
  get in() { return ptr.in; },
  get always() { return PREFS.physInfo === 'on'; },
  get hold() { return PREFS.physHold === 'on'; },
  get scale() { return objScaleVal.value; },
};
const at = computed(() => EXPERIMENTS.findIndex(e => e.id === route.params.id));
const prevTo = computed(() => (at.value > 0 ? '/physics/' + EXPERIMENTS[at.value - 1].id : ''));
const nextTo = computed(() =>
  at.value >= 0 && at.value < EXPERIMENTS.length - 1 ? '/physics/' + EXPERIMENTS[at.value + 1].id : ''
);

const showVal = q => {
  const v = Number(pv[q.k]);
  const s = String(q.step);
  const dec = s.includes('.') ? s.split('.')[1].length : 0;
  return v.toFixed(dec) + (q.unit ? ' ' + q.unit : '');
};

/** 把 pv 重置成这个实验的默认值（进页与换实验各来一次） */
function seed() {
  for (const k of Object.keys(pv)) delete pv[k];
  const m = meta.value;
  if (m) for (const q of m.params) pv[q.k] = q.value;
}
seed();

/* ---------- 画布尺寸 ---------- */
let size = { w: 0, h: 0, dpr: 1 };
const resizers = new Set();
let ctx2d = null;

function fit() {
  const cv = cvEl.value;
  const host = hostEl.value;
  if (!cv || !host) return;
  const w = host.clientWidth;
  const h = host.clientHeight;
  if (!w || !h) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  size = { w, h, dpr };
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  cv.style.width = w + 'px';
  cv.style.height = h + 'px';
  ctx2d = cv.getContext('2d');
  ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  resizers.forEach(fn => fn(w, h));
}

/* ---------- 缩放与平移 ---------- */
/* 视野写在 gfx.js 的 VIEW 里，各实验的相机都叠这一层，绘制代码不用管缩放。
   三维档有自己的一套（转视角 + 拉近），这里整套让开。 */
const ZMIN = 0.3, ZMAX = 8;

/** 以屏幕点 (cx, cy) 为锚点缩放：锚点下的世界点保持不动 */
function applyZoom(f, cx, cy) {
  const { w, h } = size;
  const z0 = VIEW.z;
  const z1 = Math.min(ZMAX, Math.max(ZMIN, z0 * f));
  if (!w || !h || Math.abs(z1 - z0) < 1e-4) return;
  const k = z1 / z0;
  VIEW.x = cx - w / 2 - k * (cx - w / 2 - VIEW.x);
  VIEW.y = cy - h / 2 - k * (cy - h / 2 - VIEW.y);
  VIEW.z = z1;
  zoomPct.value = Math.round(z1 * 100);
}

function zoomStep(f) { applyZoom(f, size.w / 2, size.h / 2); }

function viewReset() {
  resetView();
  zoomPct.value = 100;
}

// 三维档的双击归三个实验自己（复原视角），这里只接二维的；
// 面板上的双击（速度 / 物体大小滑块回默认）不跟着复原视野
const onDbl = e => {
  if (e && e.target && e.target.closest && e.target.closest('.tbar, .hud, .intro, .panel, .acts, .how')) return;
  if (is2d.value) viewReset();
};

let pan = null;

function onWheel(e) {
  if (!is2d.value) return;
  e.preventDefault();
  const r = hostEl.value.getBoundingClientRect();
  applyZoom(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top);
}

function onDown(e) {
  if (!is2d.value || e.button !== 0) return;
  if (e.target && e.target.closest && e.target.closest('.tbar, .hud, .intro, .panel, .acts, .how')) return;
  pan = { id: e.pointerId, x: e.clientX, y: e.clientY, vx: VIEW.x, vy: VIEW.y };
  hostEl.value.setPointerCapture && hostEl.value.setPointerCapture(e.pointerId);
  hostEl.value.classList.add('grab');
}

function onMove(e) {
  if (hostEl.value) {
    const r = hostEl.value.getBoundingClientRect();
    ptr.x = e.clientX - r.left;
    ptr.y = e.clientY - r.top;
    ptr.in = true;
  }
  if (!pan || e.pointerId !== pan.id) return;
  VIEW.x = pan.vx + (e.clientX - pan.x);
  VIEW.y = pan.vy + (e.clientY - pan.y);
}

function onLeave() { ptr.in = false; }

function onUp(e) {
  if (!pan || (e && e.pointerId !== pan.id)) return;
  pan = null;
  if (hostEl.value) hostEl.value.classList.remove('grab');
}

/* ---------- 实验实例 ---------- */
let api = null;
let seq = 0;
let pendingRows = null;

function stageApi(canvas) {
  return {
    canvas,
    ctx: ctx2d,
    host: hostEl.value,
    params: pv,
    pal: readPal(),
    ui,
    get w() { return size.w; },
    get h() { return size.h; },
    get dpr() { return size.dpr; },
    readout(list) { pendingRows = list; },
    get2D: getRapier2D,
    get3D: getRapier3D,
    onResize(fn) {
      resizers.add(fn);
      return () => resizers.delete(fn);
    },
    hide2D() { canvas.style.visibility = 'hidden'; },
  };
}

function stop() {
  if (api) {
    try { api.dispose && api.dispose(); } catch (e) { /* 已经坏掉就跳过 */ }
    api = null;
  }
  resizers.clear();
  pendingRows = null;
  rows.value = [];
}

async function boot() {
  const mine = ++seq;
  stop();
  loading.value = true;
  error.value = '';

  const m = meta.value;
  if (!m) {
    loading.value = false;
    error.value = '没有找到这个实验';
    return;
  }

  seed();
  viewReset();
  paused.value = false;
  howOpen.value = false;
  await nextTick();
  const cv = cvEl.value;
  if (!cv) return;
  cv.style.visibility = '';
  fit();

  try {
    const mod = await m.load();
    if (mine !== seq) return;
    const inst = await mod.create(stageApi(cv));
    if (mine !== seq) {
      inst.dispose && inst.dispose();
      return;
    }
    api = inst;
    loading.value = false;
    lastT = 0;
  } catch (e) {
    if (mine !== seq) return;
    loading.value = false;
    error.value = '这个实验没能启动：' + (e && e.message ? e.message : String(e));
  }
}

function resetAll() {
  if (api && api.reset) api.reset();
  pendingRows = null;
  rows.value = [];
}
function togglePause() {
  paused.value = !paused.value;
  lastT = 0;
}

/* ---------- 主循环 ---------- */
let raf = 0;
let lastT = 0;
let lastFlush = 0;

function tick(now) {
  raf = requestAnimationFrame(tick);
  const dt = lastT ? Math.min((now - lastT) / 1000, 0.05) : 1 / 60;
  lastT = now;

  if (api && !loading.value && !error.value) {
    // 暂停时只传 0：各实验见 dt=0 就只重画、不步进，所以缩放手感和转视角照样跟手
    try {
      api.frame(paused.value ? 0 : dt * speed.value);
    } catch (e) {
      error.value = '运行出错：' + (e && e.message ? e.message : String(e));
      return;
    }
    if (pendingRows && now - lastFlush > 110) {
      rows.value = pendingRows;
      pendingRows = null;
      lastFlush = now;
    }
  }
}

/* ---------- 生命周期 ---------- */
let ro = null;

function onKey(e) {
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (e.code === 'Space') {
    e.preventDefault();
    togglePause();
  }
}

onMounted(async () => {
  await nextTick();
  fit();
  boot();
  raf = requestAnimationFrame(tick);
  ro = new ResizeObserver(fit);
  if (hostEl.value) ro.observe(hostEl.value);
  window.addEventListener('keydown', onKey);

  const host = hostEl.value;
  if (host) {
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerup', onUp);
    host.addEventListener('pointercancel', onUp);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('wheel', onWheel, { passive: false });
    host.addEventListener('dblclick', onDbl);
  }
  // 画板按 100vw 铺满，纵向滚动条那点宽度会让页面横着滚，铺满期间先按住
  document.body.classList.add('plab-full');
});

watch(() => route.params.id, () => { if (route.name === 'physics-lab') boot(); });

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener('keydown', onKey);
  if (ro) ro.disconnect();
  const host = hostEl.value;
  if (host) {
    host.removeEventListener('pointerdown', onDown);
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerup', onUp);
    host.removeEventListener('pointercancel', onUp);
    host.removeEventListener('pointerleave', onLeave);
    host.removeEventListener('wheel', onWheel);
    host.removeEventListener('dblclick', onDbl);
  }
  document.body.classList.remove('plab-full');
  pan = null;
  seq++;
  stop();
});
</script>

<style scoped>
.plab {
  /* 破开 main 的 1720px 居中与左右内边距，画板按视口整幅铺开；
     贴顶端那 46px 是粘性顶栏（global.css 的 .topnav），底下再接 8px */
  width: 100vw;
  margin: 8px calc(50% - 50vw) 10px;
}

.stage {
  position: relative;
  height: calc(100dvh - 64px);
  min-height: 420px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
  background:
    radial-gradient(120% 90% at 22% 0%, color-mix(in srgb, var(--blue) 10%, transparent), transparent 62%),
    radial-gradient(90% 80% at 90% 100%, color-mix(in srgb, var(--purple) 8%, transparent), transparent 60%),
    color-mix(in srgb, var(--bg2) 92%, var(--card));
  box-shadow: 0 24px 60px -34px rgba(0, 0, 0, .6), inset 0 1px 0 rgba(255, 255, 255, .04);
}

.stage-body { position: absolute; inset: 0; cursor: grab; touch-action: none; }
.stage-body.grab { cursor: grabbing; }
/* 实验模块会自己往 host 里挂 canvas（三维用），:deep 才管得到它——scoped 选择器只认模板里的元素，
   漏了这层三维画布会退回默认 300×150，还给二维画布挡着按不到 */
.stage-body :deep(canvas) { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

/* 顶部标题条 */
.tbar {
  position: absolute;
  top: 12px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  border-radius: 99px;
  border: 1px solid var(--line);
  /* 不做毛玻璃：模糊会把下面画的东西糊成一片色斑，看着像「挡住了又看不清」 */
  background: color-mix(in srgb, var(--card) 95%, transparent);
  box-shadow: 0 6px 18px -12px rgba(0, 0, 0, .55);
}
.tb-back {
  font-size: 13px;
  color: var(--mut);
  text-decoration: none;
  transition: color .15s ease;
}
.tb-back:hover { color: var(--blue); }
.tb-t { font-size: 15px; letter-spacing: .3px; }
.tb-d {
  font-size: 12.2px;
  color: var(--faint);
  padding-left: 9px;
  border-left: 1px solid var(--line);
}

/* 读数 */
.hud {
  position: absolute;
  top: 12px;
  right: 14px;
  min-width: 196px;
  padding: 9px 13px;
  border-radius: 13px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 94%, transparent);
  box-shadow: 0 6px 18px -12px rgba(0, 0, 0, .55);
  font-size: 13.4px;
  font-variant-numeric: tabular-nums;
}
.hud-r {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 2px 0;
}
.hud-r em { font-style: normal; color: var(--faint); }
.hud-r span { color: var(--ink); font-weight: 600; }

/* 参数面板 */
.panel {
  position: absolute;
  /* 左边 72px 让开全站的浮钮条（FloatRail 在 x 16..60 那一竖条） */
  left: 72px;
  bottom: 14px;
  width: 268px;
  max-width: calc(100% - 86px);
  padding: 9px 13px 11px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 94%, transparent);
  box-shadow: 0 12px 30px -20px rgba(0, 0, 0, .6);
}
.panel.shut { width: auto; padding: 5px 9px; }
.p-toggle {
  font: inherit;
  font-size: 12.6px;
  color: var(--mut);
  background: none;
  border: 0;
  padding: 2px 2px 6px;
  cursor: pointer;
}
.p-toggle:hover { color: var(--blue); }
.p-body { display: flex; flex-direction: column; gap: 5px; }
.prm { display: grid; grid-template-columns: 1fr; gap: 1px; }
.prm-l { font-size: 12.6px; color: var(--mut); }
.prm-v { font-size: 12.6px; color: var(--blue); font-variant-numeric: tabular-nums; }
.prm input[type='range'] {
  width: 100%;
  height: 4px;
  margin: 2px 0;
  appearance: none;
  border-radius: 99px;
  background: color-mix(in srgb, var(--blue) 22%, var(--line));
  outline: none;
}
.prm input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--blue);
  border: 2px solid var(--card);
  box-shadow: 0 1px 4px rgba(0, 0, 0, .4);
  cursor: pointer;
}
.prm input[type='range']::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border: 2px solid var(--card);
  border-radius: 50%;
  background: var(--blue);
  cursor: pointer;
}

/* 动作按钮 */
.acts {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-width: calc(100% - 370px);
}
.acts button,
.acts .act {
  font: inherit;
  font-size: 13.2px;
  padding: 6px 13px;
  border-radius: 99px;
  cursor: pointer;
  text-decoration: none;
  color: var(--mut);
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 94%, transparent);
  transition: color .15s ease, border-color .15s ease;
}
.acts button:hover,
.acts .act:hover { color: var(--blue); border-color: var(--blue); }

/* 速度与物体大小：两根常驻滑块，读数写在右端，双击回默认 */
.sld {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 12px 3px 11px;
  border-radius: 99px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 94%, transparent);
  color: var(--mut);
  cursor: default;
  user-select: none;
}
.sld > span { font-size: 12.4px; color: var(--faint); }
.sld > b {
  min-width: 40px;
  text-align: right;
  font-size: 12.6px;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.sld input[type='range'] {
  width: 92px;
  height: 4px;
  margin: 0;
  appearance: none;
  border-radius: 99px;
  background: color-mix(in srgb, var(--blue) 22%, var(--line));
  outline: none;
  cursor: pointer;
}
.sld input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--blue);
  border: 2px solid var(--card);
  box-shadow: 0 1px 4px rgba(0, 0, 0, .4);
  cursor: pointer;
}
.sld input[type='range']::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border: 2px solid var(--card);
  border-radius: 50%;
  background: var(--blue);
  cursor: pointer;
}

/* 分析 / 原理两个开关：开着的时候描蓝边 */
.acts button.an.on {
  color: var(--blue);
  border-color: color-mix(in srgb, var(--blue) 55%, var(--line));
  background: color-mix(in srgb, var(--blue) 12%, var(--card));
}

/* 原理与公式：挂在右侧读数下面，内容多就在面板里滚 */
.how {
  position: absolute;
  right: 14px;
  top: 172px;
  width: min(360px, calc(100% - 150px));
  max-height: calc(100% - 250px);
  overflow: auto;
  padding: 10px 14px 12px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 96%, transparent);
  box-shadow: 0 12px 30px -20px rgba(0, 0, 0, .6);
  font-size: 13.2px;
  line-height: 1.75;
  color: var(--mut);
}
.how-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.how-h b { font-size: 14px; color: var(--ink); font-weight: 600; }
.how-h button {
  font: inherit;
  font-size: 16px;
  line-height: 1;
  color: var(--faint);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0 2px;
}
.how-h button:hover { color: var(--blue); }
.how-m { margin: 8px 0 6px; }
.how-s { margin: 0 0 8px; padding-left: 16px; }
.how-s li { margin: 4px 0; }
.how-f {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px dashed var(--line);
  padding-top: 6px;
  overflow-x: auto;
}
.how-f :deep(.katex-display) { margin: 5px 0; }
.how-f :deep(.katex) { font-size: .95em; color: var(--ink); }

/* 缩放：三枚连成一串，倍率那枚点一下复原 */
.zoom {
  display: inline-flex;
  align-items: stretch;
  border: 1px solid var(--line);
  border-radius: 99px;
  overflow: hidden;
  background: color-mix(in srgb, var(--card) 94%, transparent);
}
.acts .zoom button.z {
  border: 0;
  border-radius: 0;
  background: none;
  padding: 6px 9px;
  font-variant-numeric: tabular-nums;
}
.acts .zoom .z-v { min-width: 50px; color: var(--ink); }
.acts .zoom button.z + button.z { border-left: 1px solid var(--line); }
.acts .zoom button.z:hover { color: var(--blue); background: color-mix(in srgb, var(--blue) 10%, transparent); }

/* 说明与遮罩 */
/* 实验简介：顶部正中单独一块，夹在左上标题条与右上读数之间；
   宽度按两侧让开后的余量取（≤1180px 时改落到标题条下方靠左，见末尾的媒体查询） */
.intro {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: min(440px, calc(100% - 720px));
  padding: 8px 30px 8px 14px;
  border-radius: 13px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 94%, transparent);
  box-shadow: 0 6px 18px -12px rgba(0, 0, 0, .55);
}
.in-t {
  margin: 0;
  font-size: 12.8px;
  line-height: 1.7;
  text-align: center;
  color: var(--mut);
}
.in-x {
  position: absolute;
  top: 3px;
  right: 4px;
  font: inherit;
  font-size: 15px;
  line-height: 1;
  padding: 1px 5px;
  color: var(--faint);
  background: none;
  border: 0;
  cursor: pointer;
}
.in-x:hover { color: var(--blue); }

.veil {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 13.5px;
  color: var(--mut);
  /* 装载期间板里还没有东西，直接盖住板底色，不留模糊层 */
  background: color-mix(in srgb, var(--bg2) 94%, var(--card));
}
.veil.err { color: var(--pink); }
.spin {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--blue) 30%, transparent);
  border-top-color: var(--blue);
  animation: sp .8s linear infinite;
}
@keyframes sp { to { transform: rotate(360deg); } }

/* 顶部中间排不下时，简介框落到标题条下面靠左，右侧仍给读数留出来 */
@media (max-width: 1180px) {
  .intro { top: 54px; left: 14px; transform: none; width: min(420px, calc(100% - 260px)); }
}

@media (max-width: 860px) {
  .stage { height: calc(100dvh - 76px); }
  .panel { width: 216px; }
  .hud { min-width: 150px; font-size: 12.4px; }
  .acts { max-width: calc(100% - 300px); }
  .sld { padding: 3px 9px 3px 8px; gap: 6px; }
  .sld input[type='range'] { width: 66px; }
  .sld > span { display: none; }
  .intro { width: calc(100% - 210px); }
  .how { top: 150px; width: calc(100% - 28px); max-height: calc(100% - 210px); }
}
@media (prefers-reduced-motion: reduce) {
  .spin { animation: none; }
}
</style>
