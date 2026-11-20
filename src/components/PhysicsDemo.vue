<template>
  <div
    class="pd-wrap"
    :class="{ 'pd-half': floatMode === 'half', 'pd-full': floatMode === 'full', 'bar-out': !barIn }"
    :style="[paperStyle, gridStyle]"
  >
    <figure class="pdemo">
      <!-- 操作条：设置页「操作条位置」选左 / 右时排在演示框上方，不压图形；选板内或浮层时收回板内。
           两份按钮是有意镜像的（位置跟着偏好换，DOM 不能跟着搬），改一处要同步另一处。 -->
      <div
        v-if="!barIn"
        class="dlbar out"
        :class="barPos === 'right' ? 'out-r' : 'out-l'"
        @pointerdown.stop
        @dblclick.stop
      >
        <button type="button" class="dl zoom" :disabled="view.z <= 0.4001" title="缩小" @click="zoomBy(1 / 1.4)">－</button>
        <button type="button" class="dl zoom" title="复原视野（也可双击画面）" @click="resetView">{{ view.z.toFixed(1) }}×</button>
        <button type="button" class="dl zoom" :disabled="view.z >= 5.999" title="放大" @click="zoomBy(1.4)">＋</button>
        <button type="button" class="dl fs" :class="{ on: floatMode === 'half' }" title="半屏" @click="setFloat('half')">◧ 半屏</button>
        <button type="button" class="dl fs" :class="{ on: floatMode === 'full' }" title="全屏" @click="setFloat('full')">⛶ 全屏</button>
        <button type="button" class="dl ink" :class="{ on: inkOn }" title="批注" @click="setInk(!inkOn)">✎ 批注</button>
        <button type="button" class="dl toPad" title="把当前画面贴到画布" @click="toPad">→ 画布</button>
        <PhysicsPaperPicker />
        <button ref="tintBtn" type="button" class="dl" :class="{ on: tintOpen }" title="底色" @click.stop="toggleTint">▤ 底色</button>
        <button type="button" class="dl png" title="导出 PNG" @click="exportPNG">⤓ PNG</button>
      </div>

      <div class="pd-bar">
        <span class="pd-title">{{ def.title }}</span>
        <em v-if="view.z !== 1" class="pd-z">{{ view.z.toFixed(2) }}×</em>
      </div>

      <div
        ref="host"
        class="pd-stage"
        :class="{ 'ink-on': inkOn, panning, rot: canRot, rotating, 'over-lbl': overLbl, 'drag-lbl': !!lblDrag, 'pd-tall': !!def.tall, 'grid-off': gridHidden }"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
        @pointerleave="overLbl = false"
        @dblclick="onDbl"
      >
        <div class="pd-tint" :style="tint ? { background: tint } : null" />
        <canvas ref="cv" />
        <canvas ref="inkCv" class="pd-ink" />

        <div v-if="barIn" class="dlbar" @pointerdown.stop @dblclick.stop>
          <button type="button" class="dl zoom" :disabled="view.z <= 0.4001" title="缩小" @click="zoomBy(1 / 1.4)">－</button>
          <button type="button" class="dl zoom" title="复原视野（也可双击画面）" @click="resetView">{{ view.z.toFixed(1) }}×</button>
          <button type="button" class="dl zoom" :disabled="view.z >= 5.999" title="放大" @click="zoomBy(1.4)">＋</button>
          <button type="button" class="dl fs" :class="{ on: floatMode === 'half' }" title="半屏" @click="setFloat('half')">◧ 半屏</button>
          <button type="button" class="dl fs" :class="{ on: floatMode === 'full' }" title="全屏" @click="setFloat('full')">⛶ 全屏</button>
          <button type="button" class="dl ink" :class="{ on: inkOn }" title="批注" @click="setInk(!inkOn)">✎ 批注</button>
          <button type="button" class="dl toPad" title="把当前画面贴到画布" @click="toPad">→ 画布</button>
          <PhysicsPaperPicker />
          <button ref="tintBtn" type="button" class="dl" :class="{ on: tintOpen }" title="底色" @click.stop="toggleTint">▤ 底色</button>
          <button type="button" class="dl png" title="导出 PNG" @click="exportPNG">⤓ PNG</button>
        </div>

        <div v-if="inkOn" class="inkbar" @pointerdown.stop @dblclick.stop>
          <button type="button" class="ink-t" :class="{ on: tool === 'pen' }" title="画笔" @click="tool = 'pen'">✎</button>
          <button type="button" class="ink-t" :class="{ on: tool === 'eraser' }" title="橡皮（整笔擦）" @click="tool = 'eraser'">⌫</button>
          <span class="ink-sep" />
          <button
            v-for="c in INK_COLORS"
            :key="c"
            type="button"
            class="ink-t"
            :class="{ on: inkColor === c }"
            :title="c"
            @click="pickColor(c)"
          >
            <i class="ink-cdot" :style="{ background: c }" />
          </button>
          <span class="ink-sep" />
          <button type="button" class="ink-gb" title="切换粗细" @click="cycleWidth">
            <i class="ink-wbar" :style="{ height: inkWidth + 'px', width: '16px' }" />
            <span class="ink-glbl">{{ inkWidth }}</span>
          </button>
          <span class="ink-sep" />
          <button type="button" class="dl" :disabled="!strokeCount" title="撤销上一笔" @click="undo">↶</button>
          <button type="button" class="dl" title="清空批注" @click="clearInk">清空</button>
          <button type="button" class="dl" title="退出批注" @click="setInk(false)">完成</button>
        </div>

        <div v-if="!ready" class="pd-veil">正在准备演示…</div>
      </div>

      <!-- 读数条：贴着画面下沿，一条横线隔开；时间、位移、速度这些量随时对得上图里的那一帧 -->
      <div class="pd-read">
        <span v-for="r in rows" :key="r[0]" class="pd-r">
          <em>{{ r[0] }}</em><i>{{ r[1] }}</i>
        </span>
      </div>

      <figcaption v-if="def.hint" class="pd-hint">{{ def.hint }}</figcaption>
    </figure>

    <!-- 播放与参数单独一块，放在演示框外面：框里只留画面 -->
    <div class="pd-panel">
      <div class="pd-play">
        <button type="button" @click="paused = !paused">{{ paused ? '继续' : '暂停' }}</button>
        <button type="button" @click="restart">重置</button>
        <label class="pd-spd" title="播放速度倍数（0.1× 到 3×，双击回 1×）" @dblclick="speed = 1">
          <span>速度</span>
          <input v-model.number="speed" type="range" min="0.1" max="3" step="0.05" />
          <b>{{ spdTxt }}</b>
        </label>
      </div>

      <!-- 模式：一台演示讲几种情形时点着切换（自由落体 / 竖直上抛 / 一起看），
           参数滑块可以声明只管哪几档，切过去就把没用的那几根收起来 -->
      <div v-if="(def.modes || []).length" class="pd-modes" role="group" :aria-label="def.title">
        <button
          v-for="m in def.modes"
          :key="m.k"
          type="button"
          :class="{ on: pv[modeKey] === m.k }"
          @click="pickMode(m.k)"
        >{{ m.label }}</button>
      </div>

      <div v-if="shownParams.length" class="pd-sliders">
        <label v-for="q in shownParams" :key="q.k">
          <span class="pd-lab">{{ q.label }}</span>
          <input type="range" :min="q.min" :max="q.max" :step="q.step" v-model.number="pv[q.k]" />
          <b>{{ showVal(q) }}</b>
        </label>
      </div>
    </div>

    <!-- 底色面板挂到 body：板是 overflow:hidden，挂在板里会被裁掉；
         位置按「▤ 底色」钮的屏幕位置现算，点空白 / Esc 都收回 -->
    <Teleport to="body">
      <div
        v-if="tintOpen"
        ref="tintPop"
        class="tint-pop"
        :style="tintPos"
        @pointerdown.stop
        @click.stop
        @dblclick.stop
      >
        <div class="tint-t">画面底色</div>
        <div class="tint-row">
          <button type="button" class="tint-sw theme" :class="{ on: !tint }" @click="setTint('')">沿用主题</button>
          <button
            v-for="t in TINTS"
            :key="t.n"
            type="button"
            class="tint-sw"
            :class="{ on: tint === t.c }"
            :style="{ background: t.c }"
            :title="t.n"
            @click="setTint(t.c)"
          />
        </div>
        <div class="tint-row tint-custom">
          <label class="tint-pick" :class="{ on: !!customTint }">
            <input type="color" :value="customTint || '#3a6ea5'" @input="onCustomTint" />
            自定义
          </label>
        </div>
      </div>
    </Teleport>
  </div>
</template>


<script setup>
import { computed, reactive, ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue';
import { readPal, LBL, lblBegin, lblAt, inkCtx, setInkStyle, gridBegin, gridUsed } from '../physics/gfx.js';
import { paperVars } from '../lib/papers.js';
import { PREFS, setPref } from '../lib/settings.js';
import PhysicsPaperPicker from './PhysicsPaperPicker.vue';

const props = defineProps({
  def: { type: Object, required: true },
});

const host = ref(null);
const cv = ref(null);
const inkCv = ref(null);
const ready = ref(false);
const paused = ref(false);
const rows = ref([]);

/* 操作条位置与数学画板共用一项偏好（设置页「画板 · 操作条位置」）；
   半屏 / 全屏时板是浮层，条收回板内，跟 board.js 的 _placeBar 同一套规矩。 */
const barPos = computed(() => PREFS.dlPos || 'left');
const barIn = computed(() => barPos.value === 'in' || !!floatMode.value);

/* 纸面配色：操作条上的「▦ 纸面」与设置页共用 PREFS.physPaper。
   预设档把整套 --pb-*（纸面、渐变、方格、墨色、语义色）以内联变量挂在根上；
   跟随主题时不挂，沿用下面两块 CSS 里的默认令牌（深色家族深板岩、浅色家族暖米） */
const paperStyle = computed(() => paperVars(PREFS.physPaper));

/* 换纸面不重建演示：等内联变量落进 DOM，再把 host 上的那套令牌重新读进 pal。
   演示模块都拿着 st.pal 的引用逐帧取值，原地刷一遍颜色就跟着换。
   （三维演示的材质是建实例时定的色，换纸面后不跟着变，属已知边界） */
watch(() => PREFS.physPaper, async () => {
  await nextTick();
  if (stRef && host.value) Object.assign(stRef.pal, readPal(host.value));
});

/* 字号与线条粗细：三个倍率灌进 gfx.js 的 INK，下一帧画出来就是新的，
   不用重搭演示（各演示每帧才去读字号、每处 lineWidth 都过包装过的 ctx） */
function syncInk() {
  setInkStyle({ font: PREFS.physFont, lw: PREFS.physLineW, axis: PREFS.physAxisW });
}
syncInk();
watch(() => [PREFS.physFont, PREFS.physLineW, PREFS.physAxisW], syncInk);

/* 背景方格：自动档在演示画了坐标网格的那些帧里收起（axes.js 的 panel 记账），
   否则 28px 的纸纹和坐标刻度两套网格叠在一起互相咬 */
const gridHidden = ref(false);
function syncGrid() {
  const want = PREFS.physGrid === 'off'
    || (PREFS.physGrid === 'auto' && gridUsed());
  if (want !== gridHidden.value) gridHidden.value = want;
}
watch(() => PREFS.physGrid, syncGrid);

/* 播放倍率：与实验页共用 PREFS.physSpeed（0.1×–3×），乘在每帧步长上 */
const speed = ref(Number(PREFS.physSpeed) || 1);
const spdTxt = computed(() => (Math.round(speed.value * 100) / 100) + '×');
watch(speed, v => setPref('physSpeed', Math.min(3, Math.max(0.1, Number(v) || 1))));

const pv = reactive({});
for (const q of props.def.params || []) pv[q.k] = q.value;

/* 模式（可选）：def.modes = [{ k, label }, …]，值落在 pv[def.modeKey || 'mode'] 上。
   演示模块自己拿这个值分支，参数快照里也带上它，切档就从头重放。
   参数项可写 q.modes: ['up', 'both'] 声明只管哪几档，不在档内的滑块先收起来。 */
const modeKey = computed(() => props.def.modeKey || 'mode');
if ((props.def.modes || []).length) pv[modeKey.value] = props.def.modes[0].k;
const shownParams = computed(() => {
  const list = props.def.params || [];
  if (!(props.def.modes || []).length) return list;
  const cur = pv[modeKey.value];
  return list.filter(q => !q.modes || q.modes.includes(cur));
});
function pickMode(k) {
  if (pv[modeKey.value] === k) return;
  pv[modeKey.value] = k;
  restart();
}

/* 板内标签可拖动（与数学画板同一条习惯）：标注重叠时按住挪开，双击复原。
   偏移按「演示名#本帧第几个标签」记账，记在本机 gl-plbl 里，刷新后还在。 */
const demoKey = computed(() => props.def.id || props.def.title || 'demo');
const overLbl = ref(false);
const lblDrag = ref(null);
const LBL_STORE = 'gl-plbl';

function lblPage() {
  try { return (location.hash || '').split('?')[0] || '/'; } catch (e) { return '/'; }
}

function lblRead() {
  try { return JSON.parse(localStorage.getItem(LBL_STORE) || '{}') || {}; } catch (e) { return {}; }
}

function lblLoad() {
  const mine = (lblRead()[lblPage()] || {})[demoKey.value] || {};
  for (const k of Object.keys(LBL.off)) delete LBL.off[k];
  for (const k of Object.keys(mine)) LBL.off[demoKey.value + '#' + k] = mine[k];
}

function lblSave() {
  const all = lblRead();
  const page = all[lblPage()] || (all[lblPage()] = {});
  const pre = demoKey.value + '#';
  const box = {};
  for (const k of Object.keys(LBL.off)) if (k.startsWith(pre)) box[k.slice(pre.length)] = LBL.off[k];
  page[demoKey.value] = box;
  try { localStorage.setItem(LBL_STORE, JSON.stringify(all)); } catch (e) { /* 写不进就算了 */ }
}

let api = null;
let ctx = null;
let raf = 0;
let last = 0;
let seq = 0;
let ro = null;
let stRef = null;   // 当前演示的 st：换纸面时把新的 pal 原地刷回去，不重建演示
let pending = null;
let lastFlush = 0;

const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

/* ── 视野：与数学画板的缩放 / 平移同一套口径 ──────────────────────────────
   只改画布的变换，图形与读数都不动；暂停时照样能放大细看、拖到别处。
   倍率夹在 0.4–6，和 board.js 的 zoom 上下限一致。 */
const view = reactive({ z: 1, x: 0, y: 0 });
const ZMIN = 0.4;
const ZMAX = 6;

/* 纸纹跟着视野一起缩放平移：否则一放大，纸面方格原地不动、画出来的坐标图各走各的 */
const gridStyle = computed(() => ({
  '--pb-gz': view.z,
  '--pb-gx': view.x + 'px',
  '--pb-gy': view.y + 'px',
}));

function clampPan() {
  const h = host.value;
  if (!h) return;
  const w = h.clientWidth, hh = h.clientHeight;
  const lo = (span, z) => Math.min(0, span - span * z);
  const hi = (span, z) => Math.max(0, span - span * z);
  view.x = Math.min(Math.max(view.x, lo(w, view.z)), hi(w, view.z));
  view.y = Math.min(Math.max(view.y, lo(hh, view.z)), hi(hh, view.z));
}

function zoomBy(f, cx, cy) {
  const h = host.value;
  if (!h) return;
  const w = h.clientWidth, hh = h.clientHeight;
  const ax = cx == null ? w / 2 : cx;
  const ay = cy == null ? hh / 2 : cy;
  const z2 = Math.min(ZMAX, Math.max(ZMIN, view.z * f));
  if (Math.abs(z2 - view.z) < 1e-6) return;
  view.x = ax - ((ax - view.x) * z2) / view.z;
  view.y = ay - ((ay - view.y) * z2) / view.z;
  view.z = z2;
  clampPan();
}

function resetView() {
  view.z = 1;
  view.x = 0;
  view.y = 0;
}

// 不带修饰键的滚轮照旧滚页面；Ctrl / ⌘ + 滚轮在指针处缩放
function onWheel(e) {
  if (!(e.ctrlKey || e.metaKey) || !host.value) return;
  e.preventDefault();
  const r = host.value.getBoundingClientRect();
  zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
}

/* ── 底色：叠在主题底纹之上的一层色片，导出时同样铺上去 ── */
const TINTS = [
  { n: '蓝调', c: 'rgba(92, 173, 255, 0.14)' },
  { n: '青调', c: 'rgba(116, 226, 245, 0.13)' },
  { n: '绿调', c: 'rgba(95, 221, 144, 0.12)' },
  { n: '紫调', c: 'rgba(185, 147, 255, 0.14)' },
  { n: '暖调', c: 'rgba(255, 158, 74, 0.13)' },
];
const tint = ref('');
const customTint = ref('');
const tintOpen = ref(false);

function setTint(c) {
  tint.value = c;
  if (!c) customTint.value = '';
}

function onCustomTint(e) {
  const v = e.target.value || '#3a6ea5';
  customTint.value = v;
  const n = parseInt(v.slice(1), 16);
  tint.value = `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.22)`;
}

/* 面板挂 body（板是 overflow:hidden，挂在板里会被裁），按按钮的屏幕位置现算；
   下方放不下就翻到按钮上面，右边越界就往左收。两根镜像的「▤ 底色」同时只有一根在渲染 */
const tintBtn = ref(null);
const tintPop = ref(null);
const tintPos = ref({ left: '0px', top: '0px' });

function toggleTint() {
  tintOpen.value = !tintOpen.value;
}

async function placeTint() {
  await nextTick();
  const b = Array.isArray(tintBtn.value) ? tintBtn.value[0] : tintBtn.value;
  if (!b || !tintOpen.value) return;
  const r = b.getBoundingClientRect();
  const el = tintPop.value;
  const w = el ? el.offsetWidth : 200;
  const h = el ? el.offsetHeight : 150;
  const vw = window.innerWidth || 1024;
  const vh = window.innerHeight || 768;
  const left = Math.min(Math.max(8, r.right - w), Math.max(8, vw - w - 8));
  let top = r.bottom + 8;
  if (top + h > vh - 8) top = Math.max(8, r.top - h - 8);
  tintPos.value = { left: left + 'px', top: top + 'px' };
}

watch(tintOpen, open => {
  if (open) placeTint();
});

// 点空白 / Esc / 窗口缩放都收起；pointerdown 捕获阶段监听，按钮自己先 stop 掉
function onTintDoc(e) {
  if (!tintOpen.value) return;
  const b = Array.isArray(tintBtn.value) ? tintBtn.value[0] : tintBtn.value;
  if (tintPop.value && tintPop.value.contains(e.target)) return;
  if (b && b.contains && b.contains(e.target)) return;
  tintOpen.value = false;
}
function onTintResize() {
  if (tintOpen.value) placeTint();
}

/* 导出与「→ 画布」用的底色：跟着画板的纸面色走，导出的 PNG 与屏幕上看到的一致；
   没声明 --pb-paper 时退回主题底色（口径同早先那版）。 */
function bgCol() {
  try {
    const h = host.value;
    const pb = h ? (getComputedStyle(h).getPropertyValue('--pb-paper') || '').trim() : '';
    if (/^(#|rgb|hsl)/.test(pb)) return pb;
    const v = (getComputedStyle(document.documentElement).getPropertyValue('--bg2') || '').trim();
    if (/^(#|rgb|hsl)/.test(v)) return v;
  } catch (e) { /* 忽略 */ }
  return document.documentElement.classList.contains('light') ? '#fbf6ea' : '#10161f';
}

/* ── 半屏 / 全屏：整块演示变成 fixed 浮层，Esc 退出 ── */
const floatMode = ref('');

function setFloat(m) {
  floatMode.value = floatMode.value === m ? '' : m;
  document.documentElement.classList.toggle('bd-lock', floatMode.value === 'full');
  nextTick(() => { fit(); });
}

/* ── 批注：第二块画布，笔画存「图形坐标」，缩放平移后仍贴在原处 ── */
const INK_COLORS = ['#ff5a6e', '#ffd166', '#4ade80', '#5cadff', '#a78bfa'];
const inkOn = ref(false);
const tool = ref('pen');
const inkColor = ref(INK_COLORS[0]);
const inkWidth = ref(2.6);
const strokeCount = ref(0);
let strokes = [];
const panning = ref(false);
/* 演示给了 api.orbit 就说明这一档是三维图，按住画面改成转视角（缩放仍走 Ctrl + 滚轮） */
const canRot = ref(false);
const rotating = ref(false);
let orbDrag = null;
let pan = null;
let drawing = null;
let erasing = false;

function setInk(on) {
  inkOn.value = on;
  if (!on) {
    pan = null;
    panning.value = false;
    orbDrag = null;
    rotating.value = false;
    drawing = null;
    erasing = false;
  }
}

function pickColor(c) {
  inkColor.value = c;
  tool.value = 'pen';
}

function cycleWidth() {
  const seqs = [1.6, 2.6, 4.2, 6];
  const i = seqs.indexOf(inkWidth.value);
  inkWidth.value = seqs[(i + 1) % seqs.length];
}

function drawInk() {
  const k = inkCv.value;
  if (!k) return;
  const g = k.getContext('2d');
  const d = dpr();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, k.width, k.height);
  g.setTransform(d * view.z, 0, 0, d * view.z, d * view.x, d * view.y);
  g.lineCap = 'round';
  g.lineJoin = 'round';
  for (const s of strokes) paintStroke(g, s);
}

function paintStroke(g, s) {
  if (!s.pts.length) return;
  g.strokeStyle = s.c;
  g.fillStyle = s.c;
  g.lineWidth = s.w;
  if (s.pts.length === 1) {
    g.beginPath();
    g.arc(s.pts[0][0], s.pts[0][1], s.w / 2, 0, Math.PI * 2);
    g.fill();
    return;
  }
  g.beginPath();
  g.moveTo(s.pts[0][0], s.pts[0][1]);
  for (let i = 1; i < s.pts.length; i++) g.lineTo(s.pts[i][0], s.pts[i][1]);
  g.stroke();
}

function undo() {
  if (!strokes.length) return;
  strokes.pop();
  strokeCount.value = strokes.length;
  drawInk();
}

function clearInk() {
  strokes = [];
  strokeCount.value = 0;
  drawInk();
}

/* 指针位置换算到图形坐标：屏幕 → 去平移 → 去缩放 */
function local(e) {
  const r = host.value.getBoundingClientRect();
  const px = e.clientX - r.left;
  const py = e.clientY - r.top;
  return { px, py, x: (px - view.x) / view.z, y: (py - view.y) / view.z };
}

// 点到线段的距离：橡皮擦漏掉两个采样点之间的那一段会显得「擦不动」
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const L = dx * dx + dy * dy;
  let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
  t = Math.max(0, Math.min(1, t));
  const qx = ax + t * dx, qy = ay + t * dy;
  return Math.hypot(px - qx, py - qy);
}

function eraseAt(x, y) {
  const r = Math.max(6, 14 / view.z);
  let hit = false;
  const keep = [];
  for (const s of strokes) {
    let on = false;
    if (s.pts.length === 1) on = Math.hypot(s.pts[0][0] - x, s.pts[0][1] - y) <= r;
    for (let i = 1; i < s.pts.length && !on; i++) {
      on = segDist(x, y, s.pts[i - 1][0], s.pts[i - 1][1], s.pts[i][0], s.pts[i][1]) <= r;
    }
    if (on) hit = true;
    else keep.push(s);
  }
  if (hit) {
    strokes = keep;
    strokeCount.value = strokes.length;
    drawInk();
  }
}

/* 这一档现在能不能转视角：演示给了 orbit、且（若声明了 active）正处在三维那一档 */
function orbitOn() {
  return !!(api && api.orbit && (!api.orbit.active || api.orbit.active()));
}

function onDown(e) {
  if (e.button !== 0 || !host.value) return;
  host.value.setPointerCapture?.(e.pointerId);
  if (inkOn.value) {
    e.preventDefault();
    const p = local(e);
    if (tool.value === 'eraser') {
      erasing = true;
      eraseAt(p.x, p.y);
      return;
    }
    const s = { c: inkColor.value, w: inkWidth.value, pts: [[p.x, p.y]] };
    strokes.push(s);
    strokeCount.value = strokes.length;
    drawing = s;
    drawInk();
    return;
  }
  if (grabLabel(e)) {
    e.preventDefault();
    return;
  }
  if (orbitOn()) {
    e.preventDefault();
    orbDrag = { x: e.clientX, y: e.clientY };
    rotating.value = true;
    return;
  }
  pan = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
  panning.value = true;
}

/* 按在标签上先判标签：命中了就拖它，没命中才是拖画面 */
function grabLabel(e) {
  const p = local(e);
  const hit = lblAt(p.x, p.y);
  if (!hit) return false;
  const o = LBL.off[hit.key] || [0, 0];
  lblDrag.value = { key: hit.key, x: p.x, y: p.y, o0: [o[0], o[1]] };
  return true;
}

function onMove(e) {
  if (lblDrag.value) {
    const p = local(e);
    const d = lblDrag.value;
    LBL.off[d.key] = [d.o0[0] + (p.x - d.x), d.o0[1] + (p.y - d.y)];
    return;
  }
  if (orbDrag) {
    overLbl.value = false;
    api.orbit.drag(e.clientX - orbDrag.x, e.clientY - orbDrag.y);
    orbDrag.x = e.clientX;
    orbDrag.y = e.clientY;
    return;
  }
  if (pan) {
    overLbl.value = false;
    view.x = pan.vx + (e.clientX - pan.x);
    view.y = pan.vy + (e.clientY - pan.y);
    clampPan();
    return;
  }
  if (erasing) {
    const p = local(e);
    eraseAt(p.x, p.y);
    return;
  }
  if (!drawing) {
    // 停在标签上换成移动光标，提示这一处可以按着挪
    const p = local(e);
    overLbl.value = !!lblAt(p.x, p.y);
    return;
  }
  const p = local(e);
  const q = drawing.pts[drawing.pts.length - 1];
  drawing.pts.push([p.x, p.y]);
  // 增量落笔：只画新的一段，不整层重绘
  const k = inkCv.value;
  if (!k) return;
  const g = k.getContext('2d');
  const d = dpr();
  g.setTransform(d * view.z, 0, 0, d * view.z, d * view.x, d * view.y);
  g.strokeStyle = drawing.c;
  g.lineWidth = drawing.w;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.beginPath();
  g.moveTo(q[0], q[1]);
  g.lineTo(p.x, p.y);
  g.stroke();
}

function onUp() {
  if (lblDrag.value) {
    lblDrag.value = null;
    lblSave();
  }
  pan = null;
  panning.value = false;
  orbDrag = null;
  rotating.value = false;
  drawing = null;
  erasing = false;
}

/* 双击：点在标签上回原位（没挪过的就是普通双击），其余处复原视野与视角 */
function onDbl(e) {
  if (inkOn.value || !host.value) return;
  const p = local(e);
  const hit = lblAt(p.x, p.y);
  if (hit && LBL.off[hit.key]) {
    delete LBL.off[hit.key];
    lblSave();
    return;
  }
  if (api && api.orbit && api.orbit.reset) api.orbit.reset();
  resetView();
}

// 视野一变，墨迹层按新变换整层重画
watch(() => [view.z, view.x, view.y], () => drawInk());

/* ── 合成：底色 + 底色片 + 演示画面 + 批注，2 倍分辨率 ── */
function compose() {
  const h = host.value, c = cv.value;
  if (!h || !c) return null;
  const w = h.clientWidth, hh = h.clientHeight;
  const S = 2;
  const out = document.createElement('canvas');
  out.width = Math.round(w * S);
  out.height = Math.round(hh * S);
  const g = out.getContext('2d');
  g.fillStyle = bgCol();
  g.fillRect(0, 0, out.width, out.height);
  if (tint.value) {
    g.fillStyle = tint.value;
    g.fillRect(0, 0, out.width, out.height);
  }
  g.drawImage(c, 0, 0, out.width, out.height);
  if (inkCv.value) g.drawImage(inkCv.value, 0, 0, out.width, out.height);
  return out;
}

/* 导出 PNG */
function exportPNG() {
  const out = compose();
  if (!out) return;
  out.toBlob(b => {
    if (!b) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = (props.def.title || '演示') + '.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
}

/* → 画布：演示是 canvas，搬不了矢量节点，改贴一张长边 1600 以内的 JPEG，
   交给 DrawPad 的 window.__glImageToPad（内部走 Board.ingestImage，与截图 / 粘贴同一条路）。 */
function toPad() {
  const out = compose();
  const push = typeof window !== 'undefined' ? window.__glImageToPad : null;
  if (!out) return;
  if (!push) return;
  push(out.toDataURL('image/jpeg', 0.92), props.def.title || '演示');
}

/* ── 演示本体（与实验页同一套约定） ── */
function fit() {
  const c = cv.value;
  const h = host.value;
  if (!c || !h) return;
  const w = Math.max(240, Math.round(h.clientWidth));
  const hh = Math.max(200, Math.round(h.clientHeight));
  const d = dpr();
  c.width = Math.round(w * d);
  c.height = Math.round(hh * d);
  ctx = inkCtx(c.getContext('2d'));
  const k = inkCv.value;
  if (k) {
    k.width = c.width;
    k.height = c.height;
  }
  drawInk();
}

function stage() {
  return {
    canvas: cv.value,
    ctx,
    host: host.value,
    params: pv,
    pal: readPal(host.value),
    readout(list) { pending = list; },
    get w() { return host.value ? host.value.clientWidth : 0; },
    get h() { return host.value ? host.value.clientHeight : 0; },
    get dpr() { return dpr(); },
  };
}

function tick(now) {
  raf = requestAnimationFrame(tick);
  if (!api || !ctx || !cv.value) return;
  const t = now / 1000;
  const dt = last ? Math.min(1 / 30, Math.max(0, t - last)) : 0;
  last = t;
  // 整幅清掉再换到「视野」变换：各演示自己的 clearRect 只清它那块，
  // 缩小到 0.4 倍时清不到画框边缘，不先清整幅就会留下上一帧的残影
  const d = dpr();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.value.width, cv.value.height);
  ctx.setTransform(d * view.z, 0, 0, d * view.z, d * view.x, d * view.y);
  lblBegin(demoKey.value);
  gridBegin(); // 这一帧画了坐标网格没有：画完 syncGrid() 据此收放纸面方格
  canRot.value = orbitOn(); // 分档的演示（如安培力的三维视角）在这里换光标
  api.frame(paused.value ? 0 : dt * speed.value);
  syncGrid();
  if (pending && now - lastFlush > 110) {
    rows.value = pending;
    pending = null;
    lastFlush = now;
  }
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  lblBegin(''); // 停机后别再替这台演示登记标签（实验页的 label 也走同一个口子）
  orbDrag = null;
  rotating.value = false;
  canRot.value = false;
  if (api) {
    try { api.dispose && api.dispose(); } catch (e) { /* 演示退出失败不影响页面 */ }
    api = null;
  }
  stRef = null;
}

function restart() {
  if (api && api.reset) api.reset();
  paused.value = false;
  last = 0;
}

async function boot() {
  const mine = ++seq;
  stop();
  ready.value = false;
  pending = null;
  rows.value = [];
  fit();
  const mod = await props.def.load();
  if (mine !== seq) return;
  const st = stage();
  stRef = st;
  const inst = await mod.create(st);
  if (mine !== seq) {
    try { inst.dispose && inst.dispose(); } catch (e) { /* 忽略 */ }
    return;
  }
  api = inst;
  ready.value = true;
  last = 0;
  lblLoad();
  raf = requestAnimationFrame(tick);
}

function showVal(q) {
  const v = Math.round(Number(pv[q.k]) * 100) / 100;
  return (q.unit ? v + ' ' + q.unit : String(v));
}

function onKey(e) {
  if (e.key !== 'Escape') return;
  if (tintOpen.value) tintOpen.value = false;
  else if (floatMode.value) setFloat(floatMode.value);
  else if (inkOn.value) setInk(false);
}

onMounted(() => {
  boot();
  ro = new ResizeObserver(() => {
    fit();
    if (api && api.resize) api.resize();
  });
  ro.observe(host.value);
  host.value.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', onTintDoc, true);
  window.addEventListener('resize', onTintResize);
});

onBeforeUnmount(() => {
  seq += 1;
  stop();
  if (ro) ro.disconnect();
  ro = null;
  host.value?.removeEventListener('wheel', onWheel);
  window.removeEventListener('keydown', onKey);
  document.removeEventListener('pointerdown', onTintDoc, true);
  window.removeEventListener('resize', onTintResize);
  document.documentElement.classList.remove('bd-lock');
});
</script>

<style scoped>
/* ── 纸面皮肤（2026-11-20 照样例 1 / 2 做的一版） ─────────────────────────
   画布是透明的：底色、极淡方格与一道细框都画在 .pd-stage 上，各个演示模块
   一行代码都不用改，就整块换成了「一张实验纸」的样子。
   这八枚 --pb-* 同时被 gfx.js 的 readPal(host) 读进 pal（paper / grid / rule /
   ink / indigo / sienna / graphite / alert），演示想画纸色、或要同一套双色强调时取它即可。
   深色家族是一方深板岩纸，浅色家族（html.light，六套浅色共用）是一张暖米色的纸。 */
.pd-wrap {
  position: relative;
  --pb-paper: #10161f;
  --pb-grid: rgba(198, 216, 244, .055);
  --pb-rule: rgba(214, 226, 246, .17);
  --pb-ink: #e8eef7;
  --pb-indigo: #8db4e8;
  --pb-sienna: #d9976a;
  --pb-graphite: #7d8aa0;
  --pb-alert: #e08585;
}
:global(html.light) .pd-wrap {
  --pb-paper: #fbf6ea;
  --pb-grid: rgba(122, 96, 54, .085);
  --pb-rule: rgba(122, 96, 54, .26);
  --pb-ink: #2b303a;
  --pb-indigo: #3d6ea8;
  --pb-sienna: #a75f35;
  --pb-graphite: #6f7683;
  --pb-alert: #b4514f;
}
/* 纸面预设不再用类名：src/lib/papers.js 把整套令牌以 --pb-* 内联变量挂在根上，
   操作条「▦ 纸面」与设置页写同一个 PREFS.physPaper。上面两块 CSS 只剩「跟随主题」的默认值 */

.pdemo {
  margin: 18px 0 22px;
  border: 1px solid var(--pb-rule);
  border-radius: 14px;
  background: var(--pb-paper);
  overflow: hidden;
}

/* 操作条在板外：框上让出一条给按钮，框本身取消 overflow（条要伸到框上方），圆角改由里层自己收口 */
.pd-wrap.bar-out { padding-top: 40px; }
.pd-wrap.bar-out .pdemo { margin-top: 6px; overflow: visible; }
.pd-wrap.bar-out .pd-bar { border-radius: 13px 13px 0 0; }
.pd-wrap.bar-out .pd-hint { border-radius: 0 0 13px 13px; }
.pd-wrap.bar-out .dlbar.out {
  position: absolute; top: 0; left: 0; right: 0;
  justify-content: flex-start;
}
.pd-wrap.bar-out .dlbar.out.out-r { justify-content: flex-end; }

/* 半屏 / 全屏：与数学画板的 .bd-half / .bd-full 同一套摆法（右侧半屏、居中整屏，Esc 退出）。
   浮层浮的是整个外壳，参数面板与图注跟着进来；此时操作条收回板内（barIn）。 */
.pd-wrap.pd-half {
  position: fixed; z-index: 100;
  right: 16px; left: auto; top: 58px; bottom: 16px;
  width: min(56vw, 940px);
  margin: 0; padding: 12px;
  display: flex; flex-direction: column; gap: 10px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 0 0 100vmax rgba(6, 9, 14, .42), 0 26px 70px rgba(0, 0, 0, .45);
}
.pd-wrap.pd-full {
  position: fixed; z-index: 100;
  left: 50%; top: 50%; right: auto; bottom: auto;
  transform: translate(-50%, -50%);
  width: min(94vw, 1680px); height: min(90vh, 1040px);
  margin: 0; padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 0 0 100vmax rgba(6, 9, 14, .42), 0 26px 70px rgba(0, 0, 0, .45);
}
.pd-wrap.pd-half .pdemo,
.pd-wrap.pd-full .pdemo {
  flex: 1 1 auto; min-height: 0; margin: 0;
  display: flex; flex-direction: column;
}
.pd-wrap.pd-half .pd-bar,
.pd-wrap.pd-full .pd-bar { flex: none; }
.pd-wrap.pd-half .pd-stage,
.pd-wrap.pd-full .pd-stage { flex: 1 1 auto; min-height: 0; aspect-ratio: auto; max-height: none; }
.pd-wrap.pd-half .pd-read,
.pd-wrap.pd-full .pd-read { flex: none; max-height: 24%; overflow: auto; }
.pd-wrap.pd-half .pd-panel,
.pd-wrap.pd-full .pd-panel { flex: 0 0 auto; max-height: 40%; overflow: auto; margin: 0; }
.pd-wrap.pd-half .pd-hint,
.pd-wrap.pd-full .pd-hint { flex: none; max-height: 20%; overflow: auto; }
@media (max-width: 900px) {
  .pd-wrap.pd-half { left: 10px; right: 10px; width: auto; }
  .pd-wrap.pd-full { width: 96vw; height: 92vh; }
}

.pd-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 9px 14px;
  border-bottom: 1px solid var(--pb-rule);
  background: transparent;
}
/* 标题走衬线：纸面上的一行小标题，跟正文的无衬线拉开一档 */
.pd-title {
  font-family: Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif;
  font-size: 14px; font-weight: 600; color: var(--pb-ink);
  letter-spacing: .015em;
}
.pd-z {
  margin-left: 8px; font-style: normal; font-size: 11.5px; font-weight: 400;
  color: var(--pb-graphite); font-variant-numeric: tabular-nums;
}

.pd-stage {
  position: relative;
  isolation: isolate;               /* 让底色片与画布自成一层，不跟页面上的浮层抢 z 序 */
  width: 100%;
  aspect-ratio: 1.85 / 1;
  min-height: 340px;
  max-height: 580px;
  overflow: hidden;
  touch-action: none;
  cursor: grab;
  background-color: var(--pb-paper);
  /* 三层：横方格、竖方格、纸面渐变（--pb-skin）。主题档没有渐变，第三层退成 none。
     方格边长与相位跟着视野（--pb-gz / --pb-gx / --pb-gy，由 .pd-wrap 的行内变量给出），
     缩放平移时纸纹和画出来的图一起动，不会像两套网格各走各的 */
  background-image:
    linear-gradient(to right, var(--pb-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--pb-grid) 1px, transparent 1px),
    var(--pb-skin, none);
  background-size:
    calc(28px * var(--pb-gz, 1)) calc(28px * var(--pb-gz, 1)),
    calc(28px * var(--pb-gz, 1)) calc(28px * var(--pb-gz, 1)),
    auto;
  background-repeat: repeat, repeat, no-repeat;
  background-position:
    calc(-1px + var(--pb-gx, 0px)) calc(-1px + var(--pb-gy, 0px)),
    calc(-1px + var(--pb-gx, 0px)) calc(-1px + var(--pb-gy, 0px)),
    center;
}
/* 背景方格收起（「隐藏」档，或「自动」档里这一帧画了坐标网格）。
   只掐掉前两层渐变，不动 --pb-grid 令牌——pal.grid 还要供各模块自己画网格 */
.pd-stage.grid-off {
  background-image: none, none, var(--pb-skin, none);
}
.pd-stage.panning { cursor: grabbing; }
/* 三维档：按住拖动转视角，光标给成抓取的手 */
.pd-stage.rot { cursor: grab; }
.pd-stage.rot.rotating { cursor: grabbing; }
.pd-stage.pd-tall { aspect-ratio: 1.5 / 1; min-height: 420px; max-height: 720px; }
.pd-stage.ink-on { cursor: crosshair; }
.pd-stage.over-lbl { cursor: move; }
.pd-stage.drag-lbl { cursor: grabbing; }
.pd-tint { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.pd-stage canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  display: block;
  z-index: 1;
}
.pd-ink { pointer-events: none; }
.pd-veil {
  position: absolute; inset: 0; z-index: 2;
  display: grid; place-items: center;
  font-size: 13px; color: var(--faint);
}

/* 操作条在演示画面上同样是 hover 现身（全局那条只认 .board:hover，这里要自己接一下） */
.pd-stage .dlbar { z-index: 8; }
.pd-stage:hover .dl,
.pd-stage:focus-within .dl { opacity: 1; }
/* 悬停色跟着纸面走：暗色主题下选了浅纸时，主题的浅墨色压在白底上会看不见 */
.pd-stage .dl:hover { color: var(--pb-ink, var(--ink)); border-color: var(--pb-blue, var(--blue)); }
/* 「→ 画布」排在 PNG 之前（PNG 由全局 .dlbar .png 定在 order:2） */
.dlbar .toPad { order: 1; }

/* 底色面板：演示不在 .board 里，全局那套 .tint-* 未必命中，这里给全。
   面板 Teleport 到 body，位置由 placeTint() 按按钮的屏幕位置现算——
   板是 overflow:hidden，挂在板里会被裁掉，也压不住浮层以外的内容 */
.tint-pop {
  position: fixed; z-index: 220;
  /* 全局 .tint-pop 是给数学板写的绝对定位（top/right 都写死了），这里全部让位给内联坐标 */
  top: auto; right: auto; bottom: auto;
  min-width: 190px; max-width: 232px;
  display: flex; flex-direction: column; gap: 9px;
  padding: 10px 12px 11px;
  font-size: 12px; color: var(--mut);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, .28);
}
.tint-t { font-size: 11.5px; letter-spacing: .02em; color: var(--faint); }
.tint-row { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }
.tint-sw {
  width: 26px; height: 26px; padding: 0;
  border: 1px solid var(--line); border-radius: 8px;
  background: transparent; cursor: pointer;
  transition: border-color .13s ease, box-shadow .13s ease;
}
.tint-sw:hover { border-color: var(--blue); }
.tint-sw.on { border-color: var(--blue); box-shadow: 0 0 0 2px color-mix(in srgb, var(--blue) 30%, transparent); }
.tint-sw.theme {
  width: auto; height: 26px; padding: 0 11px;
  border-radius: 99px; white-space: nowrap;
  font: inherit; font-size: 11.8px; color: var(--mut);
}
.tint-pick {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 3px 10px 3px 5px;
  border: 1px solid var(--line); border-radius: 99px;
  font-size: 11.8px; color: var(--mut); cursor: pointer;
}
.tint-pick.on { border-color: var(--blue); }
.tint-pick input[type='color'] {
  width: 20px; height: 20px; padding: 0;
  border: none; background: none; cursor: pointer;
}

/* 批注工具条：全局 .inkbar 只在 .board.ink-on 下显形，这里自己立起来 */
.inkbar {
  position: absolute; left: 8px; top: 8px; z-index: 9;
  display: flex; flex-wrap: wrap; align-items: center; gap: 4px;
  padding: 4px 6px;
  background: color-mix(in srgb, var(--card) 94%, transparent);
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .22);
}
/* .dl 默认是绝对定位（板里那套按钮都在 .dlbar 内），工具条里要按行排 */
.inkbar .dl { position: static; opacity: 1; }
.inkbar .dl:disabled { opacity: .35; cursor: default; }

.ink-t {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 28px; padding: 0;
  font-size: 13px; line-height: 1; color: var(--mut);
  background: transparent; border: 1px solid transparent; border-radius: 8px;
  cursor: pointer; transition: color .13s ease, border-color .13s ease, background .13s ease;
}
.ink-t:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 8%, transparent); }
.ink-t.on {
  color: var(--blue); border-color: var(--blue);
  background: color-mix(in srgb, var(--blue) 10%, transparent);
}
.ink-cdot { display: block; width: 12px; height: 12px; border-radius: 50%; }
.ink-sep { width: 1px; height: 18px; margin: 0 3px; background: var(--line); }
.ink-gb {
  display: inline-flex; align-items: center; gap: 5px;
  height: 28px; padding: 0 8px;
  color: var(--mut); background: transparent;
  border: 1px solid var(--line); border-radius: 8px; cursor: pointer;
}
.ink-gb:hover { color: var(--ink); border-color: var(--blue); }
.ink-wbar { display: block; border-radius: 99px; background: currentColor; }
.ink-glbl { font-size: 11px; font-variant-numeric: tabular-nums; }

/* 播放与参数：演示框外面单独一块，框里只留画面。
   这块是「控件」不是「纸面」，配色走主题的卡片 / 描边 / 强调色，跟纸面的暖调分开 */
.pd-panel {
  display: flex; flex-wrap: wrap; align-items: flex-start; gap: 10px 22px;
  margin: 0 0 22px;
  padding: 11px 14px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: color-mix(in srgb, var(--card) 62%, transparent);
}
.pd-play {
  flex: 0 0 auto;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.pd-play button {
  font: inherit; font-size: 12.6px; line-height: 1;
  padding: 6px 13px; border-radius: 99px; cursor: pointer;
  color: var(--mut); background: transparent;
  border: 1px solid var(--line);
  transition: color .13s ease, border-color .13s ease, background .13s ease;
}
.pd-play button:hover { color: var(--blue); border-color: var(--blue); }
.pd-spd {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12.4px; color: var(--mut); cursor: ew-resize;
}
.pd-spd input[type='range'] { width: 96px; height: 16px; margin: 0; accent-color: var(--blue); }
.pd-spd b {
  font-size: 12.2px; font-weight: 600; color: var(--ink);
  font-variant-numeric: tabular-nums; min-width: 38px;
}

.pd-modes {
  flex: 0 0 auto;
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.pd-modes button {
  font: inherit; font-size: 12.6px; line-height: 1;
  padding: 6px 13px; border-radius: 99px; cursor: pointer;
  color: var(--mut); background: transparent;
  border: 1px solid var(--line);
  transition: color .13s ease, border-color .13s ease, background .13s ease;
}
.pd-modes button:hover { color: var(--blue); border-color: var(--blue); }
.pd-modes button.on {
  color: var(--blue); border-color: var(--blue);
  background: color-mix(in srgb, var(--blue) 13%, transparent);
}

.pd-sliders {
  flex: 1 1 320px; min-width: 0;
  display: flex; flex-direction: column; gap: 7px;
}
.pd-sliders label {
  display: grid; grid-template-columns: 108px minmax(0, 1fr) 72px;
  align-items: center; gap: 10px;
  font-size: 12.6px; color: var(--mut);
}
.pd-lab { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pd-sliders input[type='range'] {
  width: 100%; height: 16px; margin: 0;
  accent-color: var(--blue);
}
.pd-sliders b {
  font-size: 12.2px; font-weight: 600; text-align: right;
  color: var(--ink); font-variant-numeric: tabular-nums;
  font-family: 'KaTeX_Main', 'Latin Modern Math', 'Times New Roman', serif;
}

/* 读数条：贴在画面下沿，一条横线隔开；数值与图里那一帧同步，扫一眼就对得上 */
.pd-read {
  display: flex; flex-wrap: wrap; gap: 6px 18px;
  padding: 9px 14px 10px;
  border-top: 1px solid var(--pb-rule);
  background: transparent;
}
.pd-r { display: inline-flex; align-items: baseline; gap: 6px; font-size: 12.4px; }
.pd-r em { color: var(--pb-graphite); font-style: normal; }
.pd-r i {
  font-style: normal; color: var(--pb-ink); font-weight: 600;
  font-variant-numeric: tabular-nums;
  /* 读数与画布里的标签同一副字（gfx.js 的 label 走 KaTeX 字族） */
  font-family: 'KaTeX_Main', 'Latin Modern Math', 'Times New Roman', serif;
}

.pd-hint {
  padding: 9px 14px 12px;
  font-size: 12.6px; line-height: 1.8; color: var(--pb-graphite);
  border-top: 1px dashed var(--pb-rule);
}

@media (max-width: 720px) {
  .pd-wrap.pd-half .pd-stage,
  .pd-wrap.pd-full .pd-stage { height: auto; }
  .pd-stage { aspect-ratio: auto; height: 320px; }
  .pd-sliders label { grid-template-columns: 92px minmax(0, 1fr) 66px; }
  .pd-panel { gap: 9px 14px; }
}

@media print {
  .dlbar, .tint-pop, .inkbar { display: none; }
}
</style>
