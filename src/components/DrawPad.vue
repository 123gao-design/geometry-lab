<template>
  <button v-if="showFab" class="draw-fab" :class="{ on: open && mode !== 'full', hide: open && mode === 'full' }" type="button"
    :style="{ right: fabR + 'px', bottom: fabB + 'px' }"
    :title="open ? '收起画布' : '画布：半屏或整屏随手写画（按钮可拖动）'"
    @pointerdown="onFabDown" @click="onFabClick">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20l1.1-4.1L16.3 4.7a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L9.1 19.9 4 20z"
        fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
      <path d="M14.4 6.6l3.2 3.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  </button>

  <aside v-if="open" class="drawpad" :class="mode === 'full' ? 'full' : side" role="dialog" aria-label="画布">
    <div class="dp-head">
      <strong>画布</strong>
      <div class="dp-pages" title="画布分页：一页一张，竖着摞在一起，上下滑动就换页">
        <button class="dp-pg" type="button" :disabled="pageNum <= 1" title="上一页（往上滑）" @click="goPage(pageNum - 1)">‹</button>
        <span class="dp-pgn">第{{ pageNum }}/{{ pageCount }}页</span>
        <button class="dp-pg" type="button" :disabled="pageNum >= pageCount" title="下一页（往下滑）" @click="goPage(pageNum + 1)">›</button>
        <button class="dp-pg add" type="button" title="在最后再加一页：新页就在下面，往下滑就到" @click="addPage">＋</button>
        <button class="dp-pg del" type="button" :class="{ ask: delArmed }" :disabled="pageCount <= 1"
          :title="pageCount <= 1 ? '至少留一页' : (delArmed ? '再点一次：连这一页画的墨迹一起删掉' : '删掉这一页（这一页画的墨迹一起删）')"
          @click="deletePage">{{ delArmed ? '删?' : '－' }}</button>
      </div>
      <span class="dp-sp" />
      <button ref="paperBtnEl" class="dp-btn" type="button" :class="{ on: paperOpen }" title="纸面：底色与网格"
        @click="paperOpen = !paperOpen">▦ 纸面</button>
      <button class="dp-btn" type="button" title="把这一页（含批注）存成 PNG 图片" @click="savePng">⤓ 保存</button>
      <button class="dp-btn" type="button" :class="{ on: mode === 'side' }" title="半屏：正文让出一半，边看讲解边画"
        @click="setMode('side')">◧ 半屏</button>
      <button class="dp-btn" type="button" :class="{ on: mode === 'full' }" title="整屏：整块屏幕都是画布"
        @click="setMode('full')">⛶ 整屏</button>
      <button v-if="mode === 'side'" class="dp-btn" type="button" title="换到另一边" @click="flip">⇄ 换边</button>
      <button class="dp-btn" type="button" @click="close">收起</button>
    </div>
    <div ref="paperEl" v-if="paperOpen" class="dp-paper">
      <div class="dp-pt">底色</div>
      <div class="dp-sws">
        <button v-for="c in PAPER_COLORS" :key="c.v || 'auto'" class="dp-sw" :class="{ on: paper.c === c.v }"
          type="button" :title="c.t" :style="c.v ? { background: c.v } : {}" @click="setPaperColor(c.v)">
          <span v-if="!c.v" class="dp-sw-auto" aria-hidden="true">A</span>
        </button>
      </div>
      <div class="dp-pt">网格</div>
      <div class="dp-grids">
        <button v-for="g in PAPER_GRIDS" :key="g.v" class="dp-g" :class="{ on: paper.g === g.v }" type="button"
          @click="setPaperGrid(g.v)">{{ g.t }}</button>
      </div>
    </div>
    <div ref="hostEl" class="dp-body" @scroll.passive="onScroll">
      <div ref="dockEl" class="dp-dock" />
    </div>
    <!-- 半屏底边这一条：只为放一枚「＋ 新页」——画到最下面不用再爬回顶上去加页，也只占 34px -->
    <div v-if="mode !== 'full'" class="dp-foot">
      <button class="dp-add" type="button" title="在最后再加一页：新页就在下面，往下滑就到" @click="addPage">＋ 新页</button>
    </div>
  </aside>
</template>

<script setup>
// 画布：顶栏「✏ 画布」（整屏）与右下铅笔钮（半屏/整屏）开出来的独立画布。
// 画布本身复用画板引擎（Board），进来就开批注模式，工具条、形状吸附、选区、调色板都跟站内画板同一套；
// 存档单独挂在 '/pad' 这一页上，不跟当前路由走，换章节不会串墨迹。
// 半屏贴哪边（PREFS.canvasSide）在设置页里选。
// 分页：一页一块画板，竖着摞在 .dp-body 这个滚动区里——「＋」在最后加一页，滚轮上下滑就到，不再是翻页式的替换。
// 半屏、整屏都把页铺满滚动区（四周只留一圈边距），底边那条 34px 的窄带里另放一枚「＋ 新页」。
// 工具条只有一条：哪一页是当前页，就把那一页画板上的批注条搬到 .dp-dock 里，
// 那条槽用 position:sticky 钉在滚动区顶上，页怎么滑它都不动；换页时把上一条还回它自己那块板（藏起来），再把新的搬进来。
// 第 n 页的墨迹存 '/pad/n' + qid 'padn'（第 1 页仍是老的 '/pad' + 'pad'，老画的东西不会丢）；
// 纸面（底色 + 网格）各页共用，存 gl-pad-paper。画板按需挂：滑到哪一页才建哪一块，笔的设置翻页时带过去。
// 整屏时页框铺满滚动区（只留一圈边距），页的逻辑尺寸跟着页框比例往右 / 往下加（Board.setWorld），墨迹坐标不动。
// 页码条上 `－` 删当前页：点两下确认（3 秒内再点），墨迹按页序号前移一位，删完整套重搭。
import { computed, onBeforeUnmount, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Board } from '../lib/board.js';
import { loadInk, saveInk, clearInk } from '../lib/ink.js';

const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: 'side' },     // side | full
  side: { type: String, default: 'right' },    // right | left
});
const emit = defineEmits(['update:open', 'update:mode', 'update:side']);
const route = useRoute();

const hostEl = ref(null);
const dockEl = ref(null);   // 顶上那条公共工具条的槽（sticky，页滑它不动）
const paperEl = ref(null);
const paperBtnEl = ref(null);
const sheets = [];          // 每页一格：{ wrap, el, board }，index = 页码 - 1
let curBoard = null;        // 当前这一页的画板（存 PNG、带笔设置用）
let dockBar = null;         // 现在搬进槽里的那条批注条（换页时还回原来那块板）
let inkState = null;        // 手上这支笔：工具 / 颜色 / 粗细 / 线型 / 笔种，翻页时带过去
const GAP = 18;             // 页间距（缝里放「第 n 页」小字）；整屏时上下也各留这么多，正好一圈边距
let pageBox = { w: 1000, h: 700 };   // 页的逻辑尺寸（viewBox）：跟着页框比例走，整屏时才铺得满

const showFab = computed(() => !String(route.path || '').startsWith('/playground'));

/* ---- 分页：页数存 gl-pad-pages，当前页存 gl-pad-page ---- */
const pageCount = ref(1);
const pageNum = ref(1);
try {
  const n = +localStorage.getItem('gl-pad-pages');
  if (n >= 1 && n <= 60) pageCount.value = Math.floor(n);
  const p = +localStorage.getItem('gl-pad-page');
  if (p >= 1 && p <= pageCount.value) pageNum.value = Math.floor(p);
} catch (e) { /* 隐私模式：当一页用 */ }
function savePages() {
  try {
    localStorage.setItem('gl-pad-pages', String(pageCount.value));
    localStorage.setItem('gl-pad-page', String(pageNum.value));
  } catch (e) { /* 忽略 */ }
}

/* ---- 纸面：底色 + 网格（各页共用） ---- */
const PAPER_COLORS = [
  { v: '', t: '跟随主题' },
  { v: '#0b0f17', t: '深空' }, { v: '#121a26', t: '墨蓝' }, { v: '#1b2330', t: '石板' },
  { v: '#fdfcf8', t: '纸白' }, { v: '#f4f1e8', t: '米色' }, { v: '#e9eff6', t: '霜蓝' },
];
const PAPER_GRIDS = [
  { v: 'none', t: '无' }, { v: 'square', t: '方格' }, { v: 'dots', t: '点阵' }, { v: 'lines', t: '横线' },
];
const paperOpen = ref(false);
const paper = ref({ c: '', g: 'none' });
try {
  const o = JSON.parse(localStorage.getItem('gl-pad-paper') || 'null');
  if (o && typeof o === 'object') paper.value = { c: o.c || '', g: o.g || 'none' };
} catch (e) { /* 忽略 */ }
function savePaper() {
  try { localStorage.setItem('gl-pad-paper', JSON.stringify(paper.value)); } catch (e) { /* 忽略 */ }
}
function applyPaper() {
  for (const s of sheets) if (s.board) s.board.setPaper(paper.value);
}
function setPaperColor(c) {
  paper.value = { ...paper.value, c };
  savePaper();
  applyPaper();
}
function setPaperGrid(g) {
  paper.value = { ...paper.value, g };
  savePaper();
  applyPaper();
}

/* ---- 工具条：只有一条，钉在顶上；换页只换「槽里放谁的条」 ---- */
/** 把这一块板的批注条搬进顶上的槽：原来那条先还回它自己那块板（板上另有规则把它藏起来） */
function attachBar(b) {
  const dock = dockEl.value;
  if (!dock || !b || !b.inkBarEl) return;
  const bar = b.inkBarEl();
  if (!bar || bar === dockBar) return;
  if (dockBar) {
    const home = dockBar.__bdRoot;
    if (home && home.isConnected) { try { home.appendChild(dockBar); } catch (e) { /* 忽略 */ } }
    else if (dockBar.parentNode === dock) dock.removeChild(dockBar);
  }
  dock.appendChild(bar);
  dockBar = bar;
}

/* ---- 页：一页一格，`＋` 往末尾加，滑到哪页建哪块板（墨迹本来就按页落盘，晚建也不丢） ---- */
function sheetOf(n) { return sheets[n - 1] || null; }

/** 每页的尺寸：半屏整屏都是铺满滚动区，四周只留一圈边距（`.dp-body` 左右各 10px 内边距，上下各一个 GAP；
 *  半屏底下另有 34px 的 `.dp-foot` 放「＋ 新页」，那块不在滚动区里，这里量不到）。
 *  页框比例变了，页的逻辑尺寸（viewBox）也跟着变——世界守住 1000×700 这块标准页，
 *  宽了就往右加宽、高了就往下加高（只加不减），墨迹坐标不动，所以画过的东西不会被裁掉；
 *  这样网格、底色、能落笔的地方都铺满整块页框，两侧不留黑边。 */
function layoutSheets() {
  const host = hostEl.value;
  if (!host || !sheets.length || !host.clientWidth) return;
  const cw = Math.max(120, host.clientWidth - 20);      // 左右各 10px 内边距
  const ch = Math.max(120, host.clientHeight);
  const W = Math.floor(cw), H = Math.floor(Math.max(80, ch - 2 * GAP)); // 向下取整：一页加两层页距正好塞满一屏
  const ar = W / H;
  pageBox = ar >= 1000 / 700 ? { w: Math.round(700 * ar), h: 700 } : { w: 1000, h: Math.round(1000 / ar) };
  for (const s of sheets) {
    s.wrap.style.width = W + 'px';
    s.wrap.style.height = H + 'px';
    if (s.board && s.board.setWorld) { try { s.board.setWorld(pageBox.w, pageBox.h); } catch (e) { /* 忽略 */ } }
  }
}

function addSheet(n) {
  const host = hostEl.value;
  if (!host) return null;
  const wrap = document.createElement('div');
  wrap.className = 'dp-sheet';
  const lbl = document.createElement('div');
  lbl.className = 'dp-pglbl';
  lbl.textContent = '第 ' + n + ' 页';
  wrap.appendChild(lbl);
  host.appendChild(wrap);
  const s = { wrap, el: null, board: null };
  sheets.push(s);
  // 在哪一页上动鼠标/手指，哪一页就是「当前页」（头部页码、保存 PNG、笔的设置都跟着它）。
  // 走捕获阶段：要在画板 svg 的批注 pointerdown 之前把「手上这支笔」交接过去，第一笔就用对颜色粗细
  wrap.addEventListener('pointerdown', () => {
    if (pageNum.value !== n) { pageNum.value = n; savePages(); }
    mountBoard(n);
    setAct(n);
  }, true);
  return s;
}

function mountBoard(n) {
  const s = sheetOf(n);
  if (!s || s.board) return s ? s.board : null;
  const el = document.createElement('div');
  el.className = 'board pad-board';
  s.wrap.appendChild(el);
  s.el = el;
  // saveBase：保存 PNG 时文件名用它（'画布-日期-时刻.png'），不跟当前路由地址走
  const b = new Board(el, pageBox.w, pageBox.h, {
    page: n === 1 ? '/pad' : '/pad/' + n,
    qid: n === 1 ? 'pad' : 'pad' + n,
    fit: true,
    saveBase: n === 1 ? '画布' : '画布-第' + n + '页',
    inkPad: true,     // 批注条里多一枚「图形」：直接放矩形、抛物线这些常用图形
    inkFold: true,    // 批注条可收成一枚钮，点画布空白处自动收回
  });
  b.setInk(true);     // 进来就是批注模式：不必先点一次「✎ 批注」
  b.setPaper(paper.value);
  if (inkState) b.setInkState(inkState);
  // 工具条是「这一块的」：搬去顶上那条槽以后，换页时靠它认路还回来
  const bar = b.inkBarEl && b.inkBarEl();
  if (bar) bar.__bdRoot = el;
  s.board = b;
  return b;
}

/** 拆掉所有页：先逐页销毁画板、摘掉页框，再把槽里那条也清掉（host 里还住着槽，不能一把 innerHTML 清空） */
function clearSheets() {
  for (const s of sheets) {
    if (s.board) { try { s.board.destroy(); } catch (e) { /* 已卸 */ } s.board = null; }
    if (s.wrap && s.wrap.parentNode) s.wrap.parentNode.removeChild(s.wrap);
  }
  sheets.length = 0;
  curBoard = null;
  dockBar = null;
  if (dockEl.value) dockEl.value.textContent = '';
}

/** 当前页连同前后各一页先挂上：半屏能同时看见两页，下一页没挂就是一块空底 */
function ensureNear(n) {
  for (let k = n - 1; k <= n + 1; k++) if (k >= 1 && k <= sheets.length) mountBoard(k);
}

/** 翻到这一页：顶上的工具条换成这一页的；再把手上这支笔（工具 / 颜色 / 粗细 / 线型 / 笔种）交接给它 */
function setAct(n) {
  const b = sheetOf(n) && sheetOf(n).board;
  if (!b) return;
  attachBar(b);
  if (b === curBoard) return;
  if (curBoard) { try { inkState = curBoard.inkState(); } catch (e) { /* 忽略 */ } }
  if (inkState) { try { b.setInkState(inkState); } catch (e) { /* 忽略 */ } }
  curBoard = b;
}

function scrollToPage(n, smooth) {
  const host = hostEl.value, s = sheetOf(n);
  if (!host || !s) return;
  // 滚到位时页顶离滚动区顶正好一个 GAP（整屏就是那圈上边距，半屏时缝里放「第 n 页」小字）
  const top = Math.max(0, s.wrap.offsetTop - GAP);
  try {
    if (smooth) host.scrollTo({ top, behavior: 'smooth' });
    else host.scrollTo(0, top);
  } catch (e) { host.scrollTop = top; }
}

/** 滚动时判「现在看的是第几页」：看滚动区的正中间落在哪一页里（取最近的一页）。
 *  不能拿「离顶最近的那一格」——半屏时最后一页滚不到顶，会被判成上一页 */
function syncPage() {
  const host = hostEl.value;
  if (!host || !sheets.length) return;
  const hr = host.getBoundingClientRect();
  const mid = hr.top + hr.height / 2;
  let best = 1, bd = Infinity;
  for (let i = 0; i < sheets.length; i++) {
    const r = sheets[i].wrap.getBoundingClientRect();
    const d = (r.top <= mid && mid <= r.bottom) ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
    if (d < bd) { bd = d; best = i + 1; }
  }
  ensureNear(best);
  setAct(best);
  if (best !== pageNum.value) { pageNum.value = best; savePages(); delArmed.value = false; }   // 滑到别页：删页那声「再点一次」作废
}
let scrollRaf = 0;
function onScroll() {
  if (scrollRaf) return;
  const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (f => setTimeout(f, 16));
  scrollRaf = raf(() => { scrollRaf = 0; syncPage(); });
}

function mount() {
  const host = hostEl.value;
  if (!host) return;
  clearSheets();
  const n = Math.min(Math.max(1, pageNum.value), pageCount.value);
  pageNum.value = n;
  for (let i = 1; i <= pageCount.value; i++) addSheet(i);
  layoutSheets();
  ensureNear(n);
  setAct(n);
  scrollToPage(n, false);   // 上次看到哪一页，这次就停在哪一页
  sizeWatcher();
}
function unmount() {
  if (ro) { ro.disconnect(); ro = null; }
  clearSheets();
}
/* 画布这块的尺寸变了（半屏 ↔ 整屏、拖窗口）：页的尺寸是算出来的，得重算再对位回当前页 */
let ro = null;
function onSizeChange() {
  if (!props.open || !sheets.length) return;
  layoutSheets();
  ensureNear(pageNum.value);
  scrollToPage(pageNum.value, false);
}
function sizeWatcher() {
  if (!hostEl.value || typeof ResizeObserver !== 'function') return;
  if (!ro) ro = new ResizeObserver(onSizeChange);
  ro.observe(hostEl.value);
}
function goPage(n) {
  if (n < 1 || n > pageCount.value) return;
  paperOpen.value = false;
  delArmed.value = false;
  ensureNear(n);
  setAct(n);
  pageNum.value = n;
  savePages();
  scrollToPage(n, true);
}
function addPage() {
  if (pageCount.value >= 60) return;
  delArmed.value = false;
  pageCount.value += 1;
  const n = pageCount.value;
  addSheet(n);
  layoutSheets();
  ensureNear(n);
  setAct(n);
  pageNum.value = n;
  savePages();
  nextTick(() => scrollToPage(n, true));   // 新页就在下面，滑下去接着写（等布局落定再对位）
}

/* ---- 删页：点一下只是「问一句」（3 秒内再点才真删），避免误删掉画了半天的东西 ---- */
const delArmed = ref(false);
let delT = 0;
const inkKeys = n => (n === 1 ? { page: '/pad', qid: 'pad' } : { page: '/pad/' + n, qid: 'pad' + n });
/** 页数变了整套重搭：页框与画板全按新序号重建（墨迹刚从存档里挪好，重搭正好读到新键） */
function rebuild() {
  clearSheets();
  for (let i = 1; i <= pageCount.value; i++) addSheet(i);
  layoutSheets();
  ensureNear(pageNum.value);
  setAct(pageNum.value);
  nextTick(() => scrollToPage(pageNum.value, false));
}
function deletePage() {
  const n = pageNum.value, old = pageCount.value;
  if (old <= 1) return;
  if (!delArmed.value) {
    delArmed.value = true;
    clearTimeout(delT);
    delT = setTimeout(() => { delArmed.value = false; delT = 0; }, 3000);
    return;
  }
  clearTimeout(delT); delT = 0; delArmed.value = false;
  // 墨迹存档是按页序号挂的：删掉第 n 页，后面每页各往前挪一位（第 1 页仍是老键 '/pad' + 'pad'）
  const k0 = inkKeys(n);
  clearInk(k0.page, k0.qid);
  for (let k = n + 1; k <= old; k++) {
    const a = inkKeys(k), b = inkKeys(k - 1);
    const st = loadInk(a.page, a.qid);
    if (!st.length) { clearInk(a.page, a.qid); continue; }
    // 存不下（配额满）就整段停手、旧键原样留着：宁可序号对不上，也别把画的东西弄丢。
    // 不能只跳过这一格往下走——下一格正好要写回它，那份保底的旧墨迹会被盖掉
    if (!saveInk(b.page, b.qid, st)) break;
    clearInk(a.page, a.qid);
  }
  pageCount.value = old - 1;
  pageNum.value = Math.min(n, pageCount.value);
  savePages();
  rebuild();
}
function savePng() {
  const b = curBoard || (sheetOf(pageNum.value) || {}).board;
  if (!b) return;
  const p = b.exportPNG();
  if (p && p.catch) p.catch(() => { /* 导出失败就什么也不做 */ });
}

watch(() => props.open, async v => {
  paperOpen.value = false;
  delArmed.value = false;
  clearTimeout(delT); delT = 0;
  if (v) { await nextTick(); mount(); }
  else unmount();
});

function setMode(m) { if (m !== props.mode) emit('update:mode', m); }
function flip() { emit('update:side', props.side === 'left' ? 'right' : 'left'); }
function close() { emit('update:open', false); }

/* 圆钮可拖动：跟 GeoGebra 小窗那枚同一套做法，位置另存 gl-fab-draw */
const FAB = 54;
const fabR = ref(20);
const fabB = ref(216);
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
    const o = JSON.parse(localStorage.getItem('gl-fab-draw') || 'null');
    if (o && typeof o.r === 'number' && typeof o.b === 'number') { fabR.value = o.r; fabB.value = o.b; }
    else alignWithDocks();
  } catch (e) { /* 隐私模式忽略 */ }
  clampFab();
}
// 没拖过这枚按钮时，跟「画板」「计算器」两枚排在同一竖线上、正好落在计算器上方一格：
// 计算器拖过就跟计算器走，否则跟画板那枚（计算器自己也是按这个顺序对齐的）
function alignWithDocks() {
  try {
    const gap = FAB + 10;
    const c = JSON.parse(localStorage.getItem('gl-calc-fab') || 'null');
    if (c && typeof c.r === 'number' && typeof c.b === 'number') { fabR.value = c.r; fabB.value = c.b + gap; return; }
    const b = JSON.parse(localStorage.getItem('gl-fab') || 'null');
    if (b && typeof b.r === 'number' && typeof b.b === 'number') { fabR.value = b.r; fabB.value = b.b + gap * 2; }
  } catch (e) { /* 忽略 */ }
}
function onFabDown(e) {
  if (e.button && e.button !== 0) return;
  drag = { x: e.clientX, y: e.clientY, r: fabR.value, b: fabB.value, moved: false };
  if (e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* 忽略 */ } }
  window.addEventListener('pointermove', onFabMove);
  window.addEventListener('pointerup', onFabUp);
}
function onFabMove(e) {
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
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
    try { localStorage.setItem('gl-fab-draw', JSON.stringify({ r: fabR.value, b: fabB.value })); } catch (e) { /* 忽略 */ }
    setTimeout(() => { suppress = false; }, 0);
  }
  drag = null;
}
function onFabClick() {
  if (suppress) { suppress = false; return; }
  emit('update:open', !props.open);
}

// 换页收起（画过的都落盘了，下次点开还在）；Esc 收起
watch(() => route.path, () => { if (props.open) close(); });
function onKey(e) {
  if (e.key !== 'Escape' || !props.open) return;
  close();
}
/* ---- 截图贴进来：画布开着时 Ctrl+V 直接把剪贴板里的图贴到当前页 ---- */
function pasteImage(e) {
  if (!props.open) return;
  const t = e.target;
  if (t && t.closest && t.closest('textarea, input, [contenteditable="true"]')) return;   // 正在打字就让人家粘贴文字
  const items = (e.clipboardData && e.clipboardData.items) || [];
  for (const it of items) {
    if (it.kind !== 'file' || !/^image\//.test(it.type || '')) continue;
    const file = it.getAsFile && it.getAsFile();
    if (!file) continue;
    e.preventDefault();
    const b = curBoard || (sheetOf(pageNum.value) || {}).board;
    if (b && b.ingestImage) b.ingestImage(file);
    return;
  }
}
/* ---- 画板 → 画布：站内每块画板操作条上的「→ 画布」都走这里（画布没开着就先打开） ---- */
function boardToPad(src) {
  if (!src) return;
  const run = tries => {
    const b = curBoard || (sheetOf(pageNum.value) || {}).board;
    if (b && typeof b.importFrom === 'function') { if (pageNum.value && !curBoard) setAct(pageNum.value); b.importFrom(src); return; }
    if (tries > 0) setTimeout(() => run(tries - 1), 70);
  };
  if (props.open) { nextTick(() => run(6)); return; }
  emit('update:open', true);
  setTimeout(() => run(14), 60);            // 等 mount() 把页与画板搭好
}
/* ---- 图片 → 画布：canvas 画的板（物理演示）搬不了矢量节点，交给演示外壳贴一张 JPEG 过来，
        和截图 / 粘贴走同一个 ingestImage（长边缩到 1600、JPEG 0.9 这两步在引擎里做） ---- */
function imageToPad(dataUrl, name) {
  if (!dataUrl) return;
  const run = tries => {
    const b = curBoard || (sheetOf(pageNum.value) || {}).board;
    if (b && typeof b.ingestImage === 'function') {
      if (pageNum.value && !curBoard) setAct(pageNum.value);
      fetch(dataUrl)
        .then(r => r.blob())
        .then(bl => {
          const f = new File([bl], (name || '演示') + '.jpg', { type: bl.type || 'image/jpeg' });
          b.ingestImage(f);
        })
        .catch(() => {});
      return;
    }
    if (tries > 0) setTimeout(() => run(tries - 1), 70);
  };
  if (props.open) { nextTick(() => run(6)); return; }
  emit('update:open', true);
  setTimeout(() => run(14), 60);
}
window.addEventListener('paste', pasteImage);
if (typeof window !== 'undefined') window.__glBoardToPad = boardToPad;
if (typeof window !== 'undefined') window.__glImageToPad = imageToPad;
// 纸面面板：点面板与「▦ 纸面」钮以外的地方收起
function onDocDown(e) {
  if (!paperOpen.value) return;
  const t = e && e.target;
  if (t && ((paperEl.value && paperEl.value.contains(t)) || (paperBtnEl.value && paperBtnEl.value.contains(t)))) return;
  paperOpen.value = false;
}
// 窗口尺寸变了：半屏 50vw ↔ 整屏、拖窗口都走这里（画布自己的尺寸另由 ResizeObserver 盯）
function onResize() {
  clampFab();
  onSizeChange();
}
window.addEventListener('keydown', onKey);
window.addEventListener('resize', onResize);
document.addEventListener('pointerdown', onDocDown, true);
loadFab();

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('paste', pasteImage);
  if (window.__glBoardToPad === boardToPad) window.__glBoardToPad = null;
  if (window.__glImageToPad === imageToPad) window.__glImageToPad = null;
  document.removeEventListener('pointerdown', onDocDown, true);
  window.removeEventListener('pointermove', onFabMove);
  window.removeEventListener('pointerup', onFabUp);
  clearTimeout(delT); delT = 0;
  unmount();
});
</script>

<style scoped>
.draw-fab {
  position: fixed; right: 20px; bottom: 216px; z-index: 96;
  width: 54px; height: 54px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--blue, #5cadff); color: #fff; border: none; cursor: grab;
  touch-action: none; user-select: none;
  box-shadow: 0 8px 22px rgba(0, 0, 0, .28);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.draw-fab:active { cursor: grabbing; }
.draw-fab svg { width: 26px; height: 26px; }
.draw-fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 26px rgba(0, 0, 0, .34); }
.draw-fab.on { background: var(--mut, #8fa3bd); }
/* 整屏模式：画布铺满，圆钮会挡住右下角画布，收起来（顶部还有「收起」） */
.draw-fab.hide { display: none; }

.drawpad {
  position: fixed; top: 46px; right: 0; bottom: 0; z-index: 95;
  width: var(--dock-w, 50vw); max-width: 100vw;
  display: flex; flex-direction: column;
  background: var(--bg, #0b0f17); border-left: 1px solid var(--line, #26303f);
  box-shadow: -18px 0 40px rgba(0, 0, 0, .22);
}
.drawpad.left {
  left: 0; right: auto; border-left: none; border-right: 1px solid var(--line, #26303f);
  box-shadow: 18px 0 40px rgba(0, 0, 0, .22);
}
.drawpad.full { left: 0; right: 0; width: auto; border: none; }

.dp-head {
  display: flex; align-items: center; gap: 8px; flex: none;
  padding: 9px 14px; border-bottom: 1px solid var(--line, #26303f);
}
.dp-head strong { font-size: 14.5px; color: var(--ink, #e6edf7); letter-spacing: .3px; }
.dp-sp { flex: 1; }
.dp-btn {
  font: inherit; font-size: 13px; color: var(--mut, #8fa3bd); text-decoration: none;
  background: transparent; border: 1px solid var(--line, #26303f); border-radius: 99px;
  padding: 5px 14px; cursor: pointer; white-space: nowrap;
}
.dp-btn:hover { color: var(--ink, #e6edf7); border-color: var(--mut, #8fa3bd); }
.dp-btn.on { color: var(--blue, #5cadff); border-color: var(--blue, #5cadff); }

/* 分页：‹ 页码 › ＋（每页墨迹各存各的） */
.dp-pages { display: flex; align-items: center; gap: 2px; padding-left: 7px; margin-left: 1px;
  border-left: 1px solid var(--line, #26303f); }
.dp-pg { font: inherit; font-size: 13px; line-height: 1; color: var(--mut, #8fa3bd); background: transparent;
  border: 1px solid transparent; border-radius: 7px; min-width: 24px; height: 24px; padding: 0 4px; cursor: pointer; }
.dp-pg:hover:not(:disabled) { color: var(--ink, #e6edf7); border-color: var(--line, #26303f); }
.dp-pg:disabled { opacity: .3; cursor: default; }
.dp-pg.add { color: var(--blue, #5cadff); font-size: 15px; }
.dp-pg.del { margin-left: 2px; }
.dp-pg.del.ask { color: var(--red, #ff7b8a); border-color: var(--red, #ff7b8a); font-size: 11.5px; min-width: 30px; }
.dp-pgn { font-size: 12px; color: var(--mut, #8fa3bd); min-width: 34px; text-align: center; font-variant-numeric: tabular-nums; }

/* 纸面面板：底色一排 + 网格四档 */
.dp-paper { position: absolute; top: 42px; right: 14px; z-index: 9; display: flex; flex-direction: column; gap: 7px;
  padding: 10px 12px; min-width: 232px; border: 1px solid var(--line, #26303f); border-radius: 12px;
  background: var(--card, #141b26); box-shadow: 0 16px 40px rgba(0, 0, 0, .34); }
.dp-pt { font-size: 11.5px; color: var(--mut, #8fa3bd); letter-spacing: .5px; }
.dp-sws { display: flex; gap: 7px; flex-wrap: wrap; }
.dp-sw { width: 24px; height: 24px; border-radius: 50%; padding: 0; border: 1px solid var(--line, #26303f);
  background: var(--bg2, #1a2330); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.dp-sw:hover { border-color: var(--blue, #5cadff); }
.dp-sw.on { outline: 2px solid var(--blue, #5cadff); outline-offset: 2px; }
.dp-sw-auto { font-size: 11px; color: var(--mut, #8fa3bd); line-height: 1; }
.dp-grids { display: flex; gap: 6px; }
.dp-g { font: inherit; font-size: 12px; color: var(--mut, #8fa3bd); background: transparent;
  border: 1px solid var(--line, #26303f); border-radius: 7px; padding: 4px 10px; cursor: pointer; }
.dp-g:hover { color: var(--ink, #e6edf7); border-color: var(--mut, #8fa3bd); }
.dp-g.on { color: var(--blue, #5cadff); border-color: var(--blue, #5cadff); }

/* 多页画布：一页一块板，竖着摞在这个滚动区里；滚轮上下滑就是换页，「＋」在末尾续一页。
   每页的宽高由 layoutSheets() 现算写在内联样式上：半屏整屏都是铺满滚动区（左右 10px、上下各一个 GAP），
   页框比例交给页的逻辑尺寸去对（1000×700 的那块标准页只加不减），四周不会留黑边 */
.dp-body { flex: 1; min-height: 0; position: relative; overflow-y: auto; overflow-x: hidden;
  overscroll-behavior: contain; padding: 0 10px; scrollbar-width: thin; }
.dp-body :deep(.dp-sheet) { position: relative; margin: 18px auto 0; display: flex; justify-content: center; }
/* 末尾垫一格，最后一页也能滚到「上下各一圈边距」的位置 */
.dp-body::after { content: ''; display: block; height: 18px; }

/* 半屏底边那条 34px 的窄带：只放一枚小「＋ 新页」——画到最下面不用再爬回顶上去加页。
   整屏不留这条（整屏屏幕大，页底边距本来就只有 18px，顶上也已经有 ＋） */
.dp-foot { flex: none; height: 34px; display: flex; align-items: center; justify-content: center; }
.dp-add { font: inherit; font-size: 12px; line-height: 1; color: var(--mut, #8fa3bd); background: transparent;
  border: 1px dashed var(--line, #26303f); border-radius: 99px; padding: 5px 12px; cursor: pointer;
  transition: color .16s ease, border-color .16s ease, border-style .16s ease; }
.dp-add:hover { color: var(--blue, #5cadff); border-color: var(--blue, #5cadff); border-style: solid; }
.dp-body :deep(.dp-sheet > .board) { position: relative; display: flex; width: 100%; height: 100%; min-width: 0; }
.dp-body :deep(.board > svg) { width: 100%; height: 100%; }
.dp-body :deep(.dp-pglbl) { position: absolute; top: -16px; left: 0; padding: 0 2px;
  font-size: 11px; line-height: 15px; letter-spacing: .4px; color: var(--mut, #8fa3bd);
  pointer-events: none; user-select: none; }
/* 画布上用不到站内画板那条操作条和空控件行（缩放仍可用 Ctrl+滚轮），收起来把地方让给画布 */
.dp-body :deep(.dlbar), .dp-body :deep(.ctrl) { display: none; }

/* ---- 画布上的批注工具条：高度压到 34px（跟站内画板一个调子），动作钮只留图标，
        半屏那一档再把参数钮上的字也藏掉，一整条保证排在一行；屏幕实在窄才折行 ---- */
.dp-body :deep(.inkbar) { padding: 5px 6px; gap: 4px; border-radius: 12px; max-width: calc(100% - 16px); }
.dp-body :deep(.inkbar .ink-t) { width: 36px; height: 34px; border-radius: 9px; }
.dp-body :deep(.inkbar .ink-t svg) { width: 21px; height: 21px; }
.dp-body :deep(.inkbar .ink-gb) { height: 34px; padding: 0 11px; font-size: 12.5px; border-radius: 9px; gap: 6px; }
.dp-body :deep(.inkbar .ink-glbl) { font-size: 12.5px; }
.dp-body :deep(.inkbar .ink-gic) { width: 17px; height: 17px; flex: none; }
.dp-body :deep(.inkbar .ink-o) { padding: 7px 10px; font-size: 12.5px; }
.dp-body :deep(.inkbar .ink-act) { width: 36px; height: 34px; padding: 0; font-size: 15px; border-radius: 9px; }
.dp-body :deep(.inkbar .ink-albl) { display: none; }        /* 动作钮只留图标：名字在 title 里 */
.dp-body :deep(.inkbar .ink-act.ask) { width: auto; padding: 0 10px; }
.dp-body :deep(.inkbar .ink-act.ask .ink-albl) { display: inline; font-size: 12px; margin-left: 4px; }
.dp-body :deep(.inkbar .ink-fold) { width: 28px; height: 34px; }
.dp-body :deep(.inkbar .ink-pin) { width: 28px; height: 34px; }
.dp-body :deep(.inkbar .ink-sep) { height: 20px; }
.dp-body :deep(.inkbar .ink-mode) { height: 34px; padding: 0 9px; font-size: 12.5px; border-radius: 9px; }
.dp-body :deep(.inkbar .ink-mode svg) { width: 16px; height: 16px; }
.dp-body :deep(.inkbar .ink-sw) { width: 30px; height: 30px; }
.dp-body :deep(.inkbar .ink-pal-sw) { width: 30px; height: 30px; }
.dp-body :deep(.inkbar .ink-pal-grid) { gap: 8px; }
.dp-body :deep(.inkbar .ink-pop-col) { min-width: 290px; }
.dp-body :deep(.inkbar .ink-pick) { width: 30px; height: 30px; }
.dp-body :deep(.inkbar .ink-pal-txt) { font-size: 13px; padding: 7px 10px; }
/* 参数面板横向排（线型 / 笔型 / 图形 / 填充）：画布上放宽一点，一行放得下四个 */
.dp-body :deep(.inkbar .ink-pop.ink-pop-grid) { max-width: 340px; gap: 6px; }
.dp-body :deep(.inkbar .ink-pop-fill) { max-width: 300px; }
.dp-body :deep(.inkbar .ink-ofill .ink-fsw) { width: 24px; height: 24px; }
.dp-body :deep(.inkbar .ink-fpick) { width: 30px; height: 30px; }
.dp-body :deep(.inkbar .ink-winp) { width: 64px; font-size: 13px; padding: 4px 8px; }
/* 半屏：参数钮上的字收掉，只留「粗细那道杠 / 色点 / 线型 / 笔尖 / 图形 / 填充」这几个记号（名字在 title 里） */
.drawpad.side .dp-body :deep(.inkbar .ink-glbl) { display: none; }
.drawpad.side .dp-body :deep(.inkbar .ink-gb) { padding: 0 8px; }
/* 半屏又多了文字 / 多边形 / 向量 / 填充四件，整条挤到七百来像素：再收一圈，尽量留在一行 */
.drawpad.side .dp-body :deep(.inkbar) { gap: 3px; padding: 4px 5px; }
.drawpad.side .dp-body :deep(.inkbar .ink-t) { width: 30px; height: 32px; }
.drawpad.side .dp-body :deep(.inkbar .ink-mode) { height: 32px; padding: 0 6px; font-size: 11.5px; gap: 3px; }
.drawpad.side .dp-body :deep(.inkbar .ink-t svg) { width: 19px; height: 19px; }
.drawpad.side .dp-body :deep(.inkbar .ink-gb) { padding: 0 6px; height: 32px; }
.drawpad.side .dp-body :deep(.inkbar .ink-act) { width: 30px; height: 32px; }
.drawpad.side .dp-body :deep(.inkbar .ink-fold) { width: 24px; height: 32px; }
.drawpad.side .dp-body :deep(.inkbar .ink-pin) { width: 24px; height: 32px; }

/* 顶上那条公共工具条：sticky 的槽，高度为 0、不占版面，页从它下面滑过去，条一直钉在面上。
   槽只负责「停放」——条还是各页自己那块板造出来的那个元素，按钮事件、调色板、收起状态全部照旧 */
.dp-dock { position: sticky; top: 0; z-index: 8; height: 0; display: flex; justify-content: center; align-items: flex-start;
  pointer-events: none; }
.dp-dock :deep(.inkbar) { position: relative; left: auto; top: auto; transform: none; display: flex;
  margin-top: 6px; pointer-events: auto; }
/* 没轮到的那几页：自己的条藏起来（整个画布只有顶上这一条） */
.dp-body :deep(.dp-sheet .inkbar) { display: none; }
/* 第一页的「第 n 页」小字正好在顶上这条工具条底下，留一半露一半更难看，干脆不写（头部还有「第1/N页」） */
.dp-body :deep(.dp-dock + .dp-sheet .dp-pglbl) { display: none; }

@media print { .draw-fab, .drawpad { display: none !important; } }
@media (max-width: 900px) {
  .drawpad { width: 100vw; }
  .draw-fab.on { display: none; }
}
</style>
