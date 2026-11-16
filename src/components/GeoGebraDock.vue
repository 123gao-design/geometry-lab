<template>
  <button v-if="showFab" class="ggb-fab" :class="{ on: open }" type="button"
    :style="{ right: fabR + 'px', bottom: fabB + 'px' }"
    :title="open ? '收起画板' : '打开 GeoGebra 画板：右侧占一半，边看讲解边动手（按钮可拖动）'"
    @pointerdown="onFabDown" @click="onFabClick">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.6" />
      <path d="M5.2 15.8C8.6 6.4 15.2 6.2 18.8 13.4" fill="none" stroke="currentColor" stroke-width="1.7"
        stroke-linecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  </button>

  <aside v-if="open" class="ggb-dock" :class="side" role="dialog" aria-label="GeoGebra 画板">
    <div class="dock-head">
      <strong>GeoGebra 画板</strong>
      <span v-if="tip" class="dock-tip">{{ tip }}</span>
      <span class="dock-sp" />
      <button v-if="hasOutlet" class="dock-btn" type="button" @click="prime">取当前参数</button>
      <router-link class="dock-btn" :to="fullUrl">整页 ↗</router-link>
      <button class="dock-btn" type="button" @click="close">收起</button>
    </div>
    <div class="dock-body">
      <GeoGebraApp v-if="mounted" ref="ggb" :key="mountKey" :app-name="appName" :commands="cmds" fill
        :pane-ratio="0.2" @ready="onReady" />
    </div>
  </aside>
</template>

<script setup>
// 右侧圆形按钮 + 半屏画板：讲解页里随手点开，内容让出右半边，GeoGebra 贴在右边。
// 当前页面若有画板登记了出口（B.ggbOutlet），点开时把那条命令序列带进小窗。
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import GeoGebraApp from './GeoGebraApp.vue';
import { getActiveOutlet, outletCommands } from '../lib/ggb.js';

const props = defineProps({
  open: { type: Boolean, default: false },
  side: { type: String, default: 'right' },   // right | left —— 设置页里可换
});
const emit = defineEmits(['update:open']);
const route = useRoute();

const ggb = ref();
const mountKey = ref(0);      // 换档（平面 ↔ 三维）时重挂载
const appName = ref('classic');
const mounted = ref(false);
const cmds = ref([]);         // 只在挂载时作为初始命令；已有实例走 reset + 重放
const lastCmds = ref([]);
const tip = ref('');
const hasOutlet = ref(false);   // 当前页有没有画板登记出口（没有就把「取当前参数」藏起来）

const showFab = computed(() => !String(route.path || '').startsWith('/playground'));

const fullUrl = computed(() => {
  const q = { mode: appName.value === '3d' ? '3d' : 'graphing' };
  if (lastCmds.value.length) q.cmds = JSON.stringify(lastCmds.value);
  return { path: '/playground', query: q };
});

function prime() {
  const o = getActiveOutlet();
  const got = outletCommands();
  lastCmds.value = got.cmds;
  hasOutlet.value = !!o;
  const want = got.mode === '3d' ? '3d' : 'classic';
  tip.value = got.cmds.length ? `带上本章当前参数 ${got.cmds.length} 条` : o ? '' : '空白板';
  if (!mounted.value || want !== appName.value) {
    appName.value = want;
    cmds.value = got.cmds.slice();
    mountKey.value++;
    mounted.value = true;
    return;
  }
  // 实例已在：清掉上一页留下的对象，再按当前命令重放
  const g = ggb.value;
  if (g && got.cmds.length) {
    g.reset();
    got.cmds.forEach(c => g.eval(c));
  }
}

function toggle() {
  const next = !props.open;
  if (next) prime();
  emit('update:open', next);
}

/* 圆形按钮可拖动：按住拖到任意角落，位置存本地；位移不足 5px 仍按点击处理 */
const FAB = 54;
const fabR = ref(20);
const fabB = ref(88);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi));
let drag = null;
let suppress = false;

function clampFab() {
  if (typeof window === 'undefined') return;
  fabR.value = clamp(fabR.value, 8, window.innerWidth - FAB - 8);
  fabB.value = clamp(fabB.value, 8, window.innerHeight - FAB - 8);
}
function loadFab() {
  try {
    const o = JSON.parse(localStorage.getItem('gl-fab') || 'null');
    if (o && typeof o.r === 'number' && typeof o.b === 'number') { fabR.value = o.r; fabB.value = o.b; }
  } catch (e) { /* 隐私模式忽略 */ }
  clampFab();
}
function onFabDown(e) {
  if (e.button && e.button !== 0) return;
  drag = { x: e.clientX, y: e.clientY, r: fabR.value, b: fabB.value, moved: false };
  if (e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} }
  window.addEventListener('pointermove', onFabMove);
  window.addEventListener('pointerup', onFabUp);
}
function onFabMove(e) {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
  if (!drag.moved) return;
  fabR.value = clamp(drag.r - dx, 8, window.innerWidth - FAB - 8);
  fabB.value = clamp(drag.b - dy, 8, window.innerHeight - FAB - 8);
}
function onFabUp() {
  window.removeEventListener('pointermove', onFabMove);
  window.removeEventListener('pointerup', onFabUp);
  if (drag && drag.moved) {
    suppress = true;
    try { localStorage.setItem('gl-fab', JSON.stringify({ r: fabR.value, b: fabB.value })); } catch (e) { /* 忽略 */ }
    setTimeout(() => { suppress = false; }, 0);
  }
  drag = null;
}
function onFabClick() {
  if (suppress) { suppress = false; return; }
  toggle();
}

function close() { emit('update:open', false); }

function onReady() { /* 钩子留给后续扩展 */ }

// 换页时收起，免得遮住新页面；下次点开再按新页面重新带命令
watch(() => route.path, () => { if (props.open) emit('update:open', false); });

// Esc 收起小窗；焦点在小窗里时放行，交给 GeoGebra 自己取消当前作图
function onKey(e) {
  if (e.key !== 'Escape' || !props.open) return;
  const t = e.target;
  if (t && t.closest && t.closest('.ggb-dock')) return;
  emit('update:open', false);
}
onMounted(() => {
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', clampFab);
  loadFab();
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', clampFab);
});
</script>

<style scoped>
.ggb-fab {
  position: fixed; right: 20px; bottom: 88px; z-index: 96;
  width: 54px; height: 54px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--blue, #5cadff); color: #fff; border: none; cursor: grab;
  touch-action: none; user-select: none;
  box-shadow: 0 8px 22px rgba(0, 0, 0, .28);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.ggb-fab:active { cursor: grabbing; }
.ggb-fab svg { width: 26px; height: 26px; }
.ggb-fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 26px rgba(0, 0, 0, .34); }
.ggb-fab.on { background: var(--mut, #8fa3bd); }

.ggb-dock {
  position: fixed; top: 46px; right: 0; bottom: 0; z-index: 95;
  width: var(--dock-w, 50vw); max-width: 100vw;
  display: flex; flex-direction: column;
  background: var(--bg, #0b0f17); border-left: 1px solid var(--line, #26303f);
  box-shadow: -18px 0 40px rgba(0, 0, 0, .22);
}
.ggb-dock.left {
  left: 0; right: auto; border-left: none; border-right: 1px solid var(--line, #26303f);
  box-shadow: 18px 0 40px rgba(0, 0, 0, .22);
}
.dock-head {
  display: flex; align-items: center; gap: 10px; flex: none;
  padding: 8px 12px; border-bottom: 1px solid var(--line, #26303f);
}
.dock-head strong { font-size: 13.5px; color: var(--ink, #e6edf7); letter-spacing: .3px; }
.dock-tip { font-size: 12px; color: var(--mut, #8fa3bd); }
.dock-sp { flex: 1; }
.dock-btn {
  font: inherit; font-size: 12.5px; color: var(--mut, #8fa3bd); text-decoration: none;
  background: transparent; border: 1px solid var(--line, #26303f); border-radius: 99px;
  padding: 3px 11px; cursor: pointer; white-space: nowrap;
}
.dock-btn:hover { color: var(--ink, #e6edf7); border-color: var(--mut, #8fa3bd); }
.dock-body { flex: 1; min-height: 0; padding: 8px; }

@media print { .ggb-fab, .ggb-dock { display: none !important; } }
@media (max-width: 900px) {
  .ggb-dock { width: 100vw; }
  .ggb-fab.on { display: none; }   /* 小窗已满屏，按钮收起来免得压住画板工具栏 */
}
</style>
