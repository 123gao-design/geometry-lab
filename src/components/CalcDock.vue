<template>
  <div class="calc-dock">
    <button class="calc-fab" type="button" :class="{ on: open }"
      :style="{ right: fabR + 'px', bottom: fabB + 'px' }"
      :title="open ? '收起计算器' : '计算器：点开即用，按钮和窗口都能拖'"
      @pointerdown="fabDown" @click="fabClick">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="2.8" width="16" height="18.4" rx="3" fill="none" stroke="currentColor" stroke-width="1.6" />
        <rect x="6.6" y="5.4" width="10.8" height="3.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.3" />
        <circle cx="7.9" cy="12.4" r="1" fill="currentColor" /><circle cx="12" cy="12.4" r="1" fill="currentColor" />
        <circle cx="16.1" cy="12.4" r="1" fill="currentColor" /><circle cx="7.9" cy="16.2" r="1" fill="currentColor" />
        <circle cx="12" cy="16.2" r="1" fill="currentColor" /><circle cx="16.1" cy="16.2" r="1" fill="currentColor" />
      </svg>
    </button>

    <aside v-if="open" class="calc-win" :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
      role="dialog" aria-label="计算器">
      <div class="cw-head" @pointerdown="winDown">
        <strong>计算器</strong>
        <button class="cw-chip" type="button" :class="{ on: deg }" title="角度制 / 弧度制"
          @pointerdown.stop @click="deg = !deg">{{ deg ? 'DEG' : 'RAD' }}</button>
        <button class="cw-chip" type="button" :class="{ on: histOpen }" title="最近算过的式子"
          @pointerdown.stop @click="histOpen = !histOpen">历史</button>
        <span class="cw-sp" />
        <button class="cw-x" type="button" title="收起" @pointerdown.stop @click="open = false">×</button>
      </div>

      <div class="cw-body">
        <div class="cw-mem">
          <button type="button" @click="memClear">MC</button>
          <button type="button" @click="memRecall">MR</button>
          <button type="button" @click="memAdd(1)">M+</button>
          <button type="button" @click="memAdd(-1)">M−</button>
          <span class="cw-memv">M {{ fmt(mem) }}</span>
        </div>

        <div class="cw-display">
          <div class="cw-expr">{{ expr || '0' }}</div>
          <div class="cw-out" :class="{ bad: !!msg }">{{ msg || outText }}</div>
        </div>

        <div class="cw-pad">
          <button v-for="(k, i) in pad" :key="i" type="button" class="cw-key" :class="k.cls"
            @click="press(k)">{{ k.l }}</button>
        </div>

        <div v-if="histOpen" class="cw-hist">
          <p v-if="!hist.length" class="cw-empty">算过的式子会留在这里，点一条把结果取回来。</p>
          <button v-for="(h, i) in hist" :key="i" type="button" class="cw-hrow" @click="reuse(h)">
            <span class="cw-hexpr">{{ h.expr }}</span>
            <b>{{ h.text }}</b>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
// 右侧可拖动的小计算器：圆钮与窗口各自记位置（gl-calc-fab / gl-calc-pos）。
// 求值走 lib/calc.js 的手写解析，不用 eval；支持括号、幂、阶乘、百分号、
// 三角与对数、π e Ans、记忆键与历史。
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { evaluate, fmt } from '../lib/calc.js';

const open = ref(false);
const deg = ref(true);
const histOpen = ref(false);
const expr = ref('');
const msg = ref('');
const justEq = ref(false);
const ans = ref(0);
const mem = ref(0);
const resText = ref('0');
const hist = ref([]);

function zeroPad() {
  return [
    { l: '(', v: '(' }, { l: ')', v: ')' }, { l: '⌫', a: 'back', cls: 'fn' },
    { l: 'C', a: 'clear', cls: 'warn' }, { l: 'e', v: 'e', cls: 'fn' },
    { l: 'sin', v: 'sin(', cls: 'fn' }, { l: 'cos', v: 'cos(', cls: 'fn' },
    { l: 'tan', v: 'tan(', cls: 'fn' }, { l: 'ln', v: 'ln(', cls: 'fn' },
    { l: 'log', v: 'log(', cls: 'fn' },
    { l: '√', v: '√(', cls: 'fn' }, { l: 'x²', v: '^2', cls: 'fn' },
    { l: 'xʸ', v: '^', cls: 'fn' }, { l: '1/x', v: '^(-1)', cls: 'fn' },
    { l: '!', v: '!', cls: 'fn' },
    { l: '7', v: '7' }, { l: '8', v: '8' }, { l: '9', v: '9' },
    { l: '÷', v: '÷', cls: 'op' }, { l: '%', v: '%', cls: 'fn' },
    { l: '4', v: '4' }, { l: '5', v: '5' }, { l: '6', v: '6' },
    { l: '×', v: '×', cls: 'op' }, { l: '±', a: 'neg', cls: 'fn' },
    { l: '1', v: '1' }, { l: '2', v: '2' }, { l: '3', v: '3' },
    { l: '−', v: '−', cls: 'op' }, { l: 'Ans', v: 'Ans', cls: 'fn' },
    { l: '0', v: '0' }, { l: '.', v: '.' }, { l: 'π', v: 'π', cls: 'fn' },
    { l: '+', v: '+', cls: 'op' }, { l: '=', a: 'eq', cls: 'eq' },
  ];
}
const pad = zeroPad();

const live = computed(() => {
  const s = expr.value.trim();
  if (!s) return { ok: false, text: '', raw: 0 };
  try {
    const v = evaluate(s, { deg: deg.value, ans: ans.value });
    return { ok: true, text: fmt(v), raw: v };
  } catch (e) {
    return { ok: false, text: '', raw: 0 };
  }
});

const outText = computed(() => {
  if (live.value.ok) return live.value.text;
  return resText.value;
});

function ins(v) {
  const head = v[0] || '';
  if (justEq.value && (/[0-9.√π(]/.test(head) || /[A-Za-z]/.test(head))) expr.value = '';
  justEq.value = false;
  msg.value = '';
  if (expr.value.length > 90) return;
  expr.value += v;
}

function back() {
  msg.value = '';
  justEq.value = false;
  expr.value = expr.value.slice(0, -1);
}

function clearAll() {
  expr.value = '';
  msg.value = '';
  justEq.value = false;
  resText.value = '0';
}

function toggleNeg() {
  msg.value = '';
  const m = /(\d+\.?\d*)$/.exec(expr.value);
  if (!m) { expr.value += '−'; return; }
  const before = expr.value.slice(0, m.index);
  if (before.endsWith('−') && (before.length === 1 || /[+×÷^(]$/.test(before.slice(0, -1)))) {
    expr.value = before.slice(0, -1) + m[1];
  } else {
    expr.value = before + '−' + m[1];
  }
}

function compute() {
  const src = expr.value.trim();
  if (!src) return;
  try {
    const v = evaluate(src, { deg: deg.value, ans: ans.value });
    const text = fmt(v);
    ans.value = v;
    resText.value = text;
    hist.value.unshift({ expr: src, text, val: v });
    if (hist.value.length > 24) hist.value.pop();
    msg.value = '';
    justEq.value = true;
  } catch (e) {
    msg.value = e.message;
    justEq.value = false;
  }
}

function press(k) {
  if (k.a === 'back') return back();
  if (k.a === 'clear') return clearAll();
  if (k.a === 'neg') return toggleNeg();
  if (k.a === 'eq') return compute();
  return ins(k.v);
}

function curValue() {
  if (live.value.ok) return live.value.raw;
  return Number(resText.value) || 0;
}
function memClear() { mem.value = 0; }
function memRecall() { ins(fmt(mem.value)); }
function memAdd(sign) { mem.value = Number((mem.value + sign * curValue()).toPrecision(12)); }
function reuse(h) {
  expr.value = h.text;
  justEq.value = true;
  msg.value = '';
}

/* 键盘：面板开着就接管数字与四则，回车算、退格删、Esc 收 */
function onKey(e) {
  if (!open.value) return;
  if (e.defaultPrevented) return;   // 页面里已经接管的按键（数独棋盘等）不再抢
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  const k = e.key;
  if (/^[0-9]$/.test(k)) { e.preventDefault(); ins(k); return; }
  const map = { '*': '×', '/': '÷', '-': '−', '+': '+', '^': '^', '(': '(', ')': ')', '.': '.', '%': '%', '!': '!' };
  if (map[k]) { e.preventDefault(); ins(map[k]); return; }
  if (k === 'Enter' || k === '=') { e.preventDefault(); compute(); return; }
  if (k === 'Backspace') { e.preventDefault(); back(); return; }
  if (k === 'Escape') { e.preventDefault(); open.value = false; }
}

/* 圆钮拖动：位移不足 5px 仍按点击处理 */
const FAB = 54;
const fabR = ref(20);
const fabB = ref(152);
const pos = reactive({ x: 60, y: 70 });
let loadedPos = false;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), Math.max(lo, hi));

function clampFab() {
  if (typeof window === 'undefined') return;
  fabR.value = clamp(fabR.value, 8, window.innerWidth - FAB - 8);
  fabB.value = clamp(fabB.value, 8, window.innerHeight - FAB - 8);
}
function clampWin() {
  if (typeof window === 'undefined') return;
  pos.x = clamp(pos.x, 8, window.innerWidth - 150);
  pos.y = clamp(pos.y, 46, window.innerHeight - 90);
}
function loadPos() {
  try {
    const f = JSON.parse(localStorage.getItem('gl-calc-fab') || 'null');
    if (f && typeof f.r === 'number' && typeof f.b === 'number') { fabR.value = f.r; fabB.value = f.b; }
    else alignWithBoardFab();
    const p = JSON.parse(localStorage.getItem('gl-calc-pos') || 'null');
    if (p && typeof p.x === 'number' && typeof p.y === 'number') { pos.x = p.x; pos.y = p.y; loadedPos = true; }
  } catch (e) { /* 隐私模式忽略 */ }
  clampFab();
  clampWin();
}
// 没拖过计算器时，默认跟画板圆钮排成一列：同一条竖线，正好落在它正上方
function alignWithBoardFab() {
  try {
    const b = JSON.parse(localStorage.getItem('gl-fab') || 'null');
    if (b && typeof b.r === 'number' && typeof b.b === 'number') {
      fabR.value = b.r;
      fabB.value = b.b + FAB + 10;
    }
  } catch (e) { /* 忽略 */ }
}

let fdrag = null;
let fsuppress = false;
function fabDown(e) {
  if (e.button && e.button !== 0) return;
  fdrag = { x: e.clientX, y: e.clientY, r: fabR.value, b: fabB.value, moved: false };
  if (e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} }
  window.addEventListener('pointermove', fabMove);
  window.addEventListener('pointerup', fabUp);
}
function fabMove(e) {
  if (!fdrag) return;
  const dx = e.clientX - fdrag.x;
  const dy = e.clientY - fdrag.y;
  if (!fdrag.moved && Math.abs(dx) + Math.abs(dy) > 5) fdrag.moved = true;
  if (!fdrag.moved) return;
  fabR.value = clamp(fdrag.r - dx, 8, window.innerWidth - FAB - 8);
  fabB.value = clamp(fdrag.b - dy, 8, window.innerHeight - FAB - 8);
}
function fabUp() {
  window.removeEventListener('pointermove', fabMove);
  window.removeEventListener('pointerup', fabUp);
  if (fdrag && fdrag.moved) {
    fsuppress = true;
    try { localStorage.setItem('gl-calc-fab', JSON.stringify({ r: fabR.value, b: fabB.value })); } catch (e) { /* 忽略 */ }
    setTimeout(() => { fsuppress = false; }, 0);
  }
  fdrag = null;
}
function fabClick() {
  if (fsuppress) { fsuppress = false; return; }
  const next = !open.value;
  if (next && !loadedPos) {
    // 第一次打开：落在右侧偏上，随后用户拖到哪记到哪
    pos.x = clamp(window.innerWidth - 360, 8, window.innerWidth - 150);
    pos.y = 70;
    loadedPos = true;
  }
  open.value = next;
}

/* 窗口拖动：只认标题栏空白处，不动按钮 */
let wdrag = null;
function winDown(e) {
  if (e.button && e.button !== 0) return;
  if (e.target && e.target.closest && e.target.closest('button')) return;
  wdrag = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  window.addEventListener('pointermove', winMove);
  window.addEventListener('pointerup', winUp);
}
function winMove(e) {
  if (!wdrag) return;
  pos.x = clamp(wdrag.px + e.clientX - wdrag.x, 8, window.innerWidth - 150);
  pos.y = clamp(wdrag.py + e.clientY - wdrag.y, 46, window.innerHeight - 90);
}
function winUp() {
  window.removeEventListener('pointermove', winMove);
  window.removeEventListener('pointerup', winUp);
  if (wdrag) {
    try { localStorage.setItem('gl-calc-pos', JSON.stringify({ x: pos.x, y: pos.y })); } catch (e) { /* 忽略 */ }
  }
  wdrag = null;
}

onMounted(() => {
  loadPos();
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);
});
function onResize() { clampFab(); clampWin(); }
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('pointermove', fabMove);
  window.removeEventListener('pointerup', fabUp);
  window.removeEventListener('pointermove', winMove);
  window.removeEventListener('pointerup', winUp);
});
</script>

<style scoped>
.calc-fab {
  position: fixed; right: 20px; bottom: 152px; z-index: 96;
  width: 54px; height: 54px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--purple, #c084fc); color: #fff; border: none; cursor: grab;
  touch-action: none; user-select: none;
  box-shadow: 0 8px 22px rgba(0, 0, 0, .28);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.calc-fab:active { cursor: grabbing; }
.calc-fab svg { width: 26px; height: 26px; }
.calc-fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 26px rgba(0, 0, 0, .34); }
.calc-fab.on { background: var(--mut, #8fa3bd); }

.calc-win {
  position: fixed; z-index: 97; width: 328px;
  display: flex; flex-direction: column; max-height: calc(100vh - 100px);
  background: var(--card, #111826); border: 1px solid var(--line, #26303f);
  border-radius: 14px; box-shadow: 0 18px 44px rgba(0, 0, 0, .34);
  overflow: hidden;
}
.cw-head {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-bottom: 1px solid var(--line, #26303f);
  cursor: grab; user-select: none; touch-action: none;
}
.cw-head:active { cursor: grabbing; }
.cw-head strong { font-size: 13.5px; color: var(--ink, #e8eef7); letter-spacing: .3px; }
.cw-sp { flex: 1; }
.cw-chip {
  font: inherit; font-size: 11.5px; color: var(--mut, #8fa3bd); background: transparent;
  border: 1px solid var(--line, #26303f); border-radius: 99px; padding: 2px 9px; cursor: pointer;
}
.cw-chip.on { color: #fff; background: var(--purple, #c084fc); border-color: var(--purple, #c084fc); }
.cw-x {
  font: inherit; font-size: 17px; line-height: 1; color: var(--mut, #8fa3bd);
  background: transparent; border: none; cursor: pointer; padding: 0 4px;
}
.cw-x:hover { color: var(--ink, #e8eef7); }

.cw-body { padding: 8px 10px 10px; overflow-y: auto; }
.cw-mem { display: flex; align-items: center; gap: 4px; height: 22px; }
.cw-mem button {
  font: inherit; font-size: 11px; color: var(--faint, #6b7a90); background: transparent;
  border: none; cursor: pointer; padding: 0 5px; border-radius: 5px;
}
.cw-mem button:hover { color: var(--ink, #e8eef7); background: var(--bg2, #0a0d14); }
.cw-memv { margin-left: auto; font-size: 11px; color: var(--faint, #6b7a90); font-variant-numeric: tabular-nums; }

.cw-display {
  margin: 4px 0 8px; padding: 8px 10px; min-height: 64px;
  background: var(--bg2, #0a0d14); border: 1px solid var(--line, #26303f); border-radius: 10px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.cw-expr {
  font-size: 12.5px; color: var(--faint, #6b7a90); line-height: 1.4;
  white-space: nowrap; overflow-x: auto; scrollbar-width: none; min-height: 18px;
}
.cw-expr::-webkit-scrollbar { display: none; }
.cw-out {
  font-size: 26px; font-weight: 600; color: var(--ink, #e8eef7); line-height: 1.2;
  text-align: right; font-variant-numeric: tabular-nums;
  white-space: nowrap; overflow-x: auto; scrollbar-width: none;
}
.cw-out::-webkit-scrollbar { display: none; }
.cw-out.bad { font-size: 12px; font-weight: 400; color: var(--pink, #ff7b8a); white-space: normal; }

.cw-pad { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
.cw-key {
  height: 36px; border-radius: 9px; cursor: pointer;
  font: inherit; font-size: 14px; color: var(--ink, #e8eef7);
  background: var(--bg2, #0a0d14); border: 1px solid var(--line, #26303f);
  transition: background .12s ease, border-color .12s ease, color .12s ease;
}
.cw-key:hover { border-color: var(--mut, #8fa3bd); }
.cw-key.fn { font-size: 12.5px; color: var(--mut, #8fa3bd); }
.cw-key.fn:hover { color: var(--ink, #e8eef7); }
.cw-key.op { color: var(--blue, #5cadff); font-size: 16px; }
.cw-key.op:hover { background: color-mix(in srgb, var(--blue) 12%, transparent); border-color: var(--blue); }
.cw-key.warn { color: var(--pink, #ff7b8a); }
.cw-key.eq { background: var(--purple, #c084fc); border-color: var(--purple, #c084fc); color: #fff; font-size: 17px; }
.cw-key.eq:hover { filter: brightness(1.08); }

.cw-hist {
  margin-top: 8px; max-height: 148px; overflow: auto;
  border-top: 1px dashed var(--line, #26303f); padding-top: 6px;
}
.cw-empty { margin: 4px 2px; font-size: 11.5px; color: var(--faint, #6b7a90); line-height: 1.6; }
.cw-hrow {
  display: flex; align-items: baseline; gap: 8px; width: 100%;
  font: inherit; text-align: left; cursor: pointer;
  background: transparent; border: none; border-radius: 6px; padding: 4px 6px; color: var(--mut, #8fa3bd);
}
.cw-hrow:hover { background: var(--bg2, #0a0d14); }
.cw-hexpr { flex: 1; font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cw-hrow b { font-size: 12px; color: var(--ink, #e8eef7); font-variant-numeric: tabular-nums; }

@media (max-width: 520px) {
  .calc-win { width: min(328px, calc(100vw - 16px)); }
}
@media print { .calc-fab, .calc-win { display: none !important; } }
</style>
