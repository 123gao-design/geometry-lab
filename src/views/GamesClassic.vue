<template>
  <div class="games">
    <div class="chapter-head">
      <h1>2048 与数独</h1>
      <p class="sub">两张老桌游，规则没改。2048 用方向键或滑屏拼数字，数独按行、列、九宫格把 1 到 9 填满。都在本机跑，成绩只记在这台浏览器里。</p>
    </div>
    <GameTabs />

    <div class="gm-grid">
      <!-- 2048 -->
      <section class="gm-card gm-blue">
        <div class="gm-head">
          <h3>2048</h3>
          <span class="gm-meta">方向键 / WASD / 滑屏</span>
        </div>
        <p class="gm-tip">相同的两块撞在一起就合成一块。点一下棋盘再用方向键，手机上直接滑。拼出 2048 之后还能接着玩。</p>
        <div class="t2-wrap">
          <div ref="b2El" class="t2-board" tabindex="0" aria-label="2048 棋盘"
            @click="b2El && b2El.focus()"
            @keydown="onKey2048" @touchstart.passive="t2Start" @touchend.passive="t2End">
            <div v-for="(v, i) in g2.board" :key="i" class="t2-cell"
              :class="v ? (v > 2048 ? 'big' : 'v' + v) : 'v0'">{{ v || '' }}</div>
          </div>
          <div class="t2-side">
            <div class="t2-stat"><b>{{ g2.score }}</b><span>得分</span></div>
            <div class="t2-stat"><b>{{ g2.best }}</b><span>最高</span></div>
            <div class="gm-line">
              <button class="btn" type="button" :disabled="!g2.hist.length" @click="undo2048">撤销</button>
              <button class="btn pri" type="button" @click="new2048">新一局</button>
            </div>
            <p v-if="g2.over" class="gm-msg bad">棋盘满了，没有可走的步。</p>
            <p v-else-if="g2.won" class="gm-msg ok">拼出 2048 了。</p>
          </div>
        </div>
        <p class="gm-note">最高分存在本机，换浏览器就没了。</p>
      </section>

      <!-- 数独 -->
      <section class="gm-card gm-green">
        <div class="gm-head">
          <h3>数独</h3>
          <span class="gm-meta">9 × 9 · 每行每列每宫 1–9</span>
        </div>
        <p class="gm-tip">点一个空格，再按数字键或下面的数字盘。红字是和同行、同列或同宫撞了；填完点「检查」对一遍答案。</p>
        <div class="sd-wrap">
          <div ref="sdEl" class="sd-board" tabindex="0" aria-label="数独棋盘" @keydown="onKeySd">
            <button v-for="(v, i) in sd.cells" :key="i" type="button" class="sd-cell"
              :class="{ given: sd.given[i], sel: sd.sel === i, bad: sd.wrong.includes(i),
                        conflict: conflicts.has(i), b3r: i % 9 === 2 || i % 9 === 5,
                        b3b: Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5 }"
              @click="sd.sel = i">{{ v || '' }}</button>
          </div>
          <div class="sd-side">
            <div class="sd-stat"><b>{{ sdTime }}</b><span>用时</span></div>
            <div class="sd-stat"><b>{{ remaining }}</b><span>空格</span></div>
            <div class="gm-line">
              <button class="btn" type="button" :class="{ on: sd.diff === 'easy' }" @click="setDiff('easy')">简单</button>
              <button class="btn" type="button" :class="{ on: sd.diff === 'normal' }" @click="setDiff('normal')">普通</button>
              <button class="btn" type="button" :class="{ on: sd.diff === 'hard' }" @click="setDiff('hard')">较难</button>
            </div>
            <div class="gm-line">
              <button class="btn pri" type="button" @click="newSudoku">新题</button>
              <button class="btn" type="button" @click="checkSudoku">检查</button>
              <button class="btn" type="button" @click="hintSudoku">提示</button>
            </div>
            <div class="sd-pad">
              <button v-for="n in 9" :key="n" type="button" class="btn" @click="putDigit(n)">{{ n }}</button>
              <button type="button" class="btn" @click="putDigit(0)">擦</button>
            </div>
            <p v-if="sd.msg" class="gm-msg" :class="sd.msgType">{{ sd.msg }}</p>
          </div>
        </div>
        <p class="gm-note">每道题都是现出的，保证只有一个解。</p>
      </section>
    </div>
  </div>
</template>

<script setup>
// 2048 与数独：两张卡各管自己的键盘与计时。
// 2048 用「取行 → 去零 → 相邻合并 → 补零 → 写回」的套路，四方向共用一段逻辑；
// 数独先回溯填满一张完整解，再逐个挖洞并用「解的个数 = 1」筛，保证题目唯一解。
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import GameTabs from '../components/GameTabs.vue';

/* ---------- 2048 ---------- */
const b2El = ref(null);
const g2 = reactive({ board: new Array(16).fill(0), score: 0, best: 0, won: false, over: false, hist: [] });
try { g2.best = Number(localStorage.getItem('gl-2048-best')) || 0; } catch (e) { g2.best = 0; }

function addTile() {
  const empty = [];
  for (let i = 0; i < 16; i++) if (!g2.board[i]) empty.push(i);
  if (!empty.length) return;
  g2.board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
}
function new2048() {
  g2.board = new Array(16).fill(0);
  g2.score = 0;
  g2.won = false;
  g2.over = false;
  g2.hist = [];
  addTile();
  addTile();
}
function undo2048() {
  const last = g2.hist.pop();
  if (!last) return;
  g2.board = last.board;
  g2.score = last.score;
  g2.over = false;
}
function lineIndexes(dir, line) {
  const out = [];
  for (let k = 0; k < 4; k++) {
    if (dir === 'left') out.push(line * 4 + k);
    else if (dir === 'right') out.push(line * 4 + (3 - k));
    else if (dir === 'up') out.push(k * 4 + line);
    else out.push((3 - k) * 4 + line);
  }
  return out;
}
function canMove() {
  for (let i = 0; i < 16; i++) {
    if (!g2.board[i]) return true;
    const r = Math.floor(i / 4);
    const c = i % 4;
    if (c < 3 && g2.board[i] === g2.board[i + 1]) return true;
    if (r < 3 && g2.board[i] === g2.board[i + 4]) return true;
  }
  return false;
}
function move2048(dir) {
  const before = g2.board.slice();
  const out = new Array(16).fill(0);
  let gained = 0;
  for (let line = 0; line < 4; line++) {
    const idx = lineIndexes(dir, line);
    const vals = idx.map(i => g2.board[i]).filter(v => v);
    const merged = [];
    for (let k = 0; k < vals.length; k++) {
      if (k + 1 < vals.length && vals[k] === vals[k + 1]) {
        merged.push(vals[k] * 2);
        gained += vals[k] * 2;
        k++;
      } else {
        merged.push(vals[k]);
      }
    }
    while (merged.length < 4) merged.push(0);
    merged.forEach((v, k) => { out[idx[k]] = v; });
  }
  if (out.every((v, i) => v === before[i])) return;
  g2.hist.push({ board: before, score: g2.score });
  if (g2.hist.length > 8) g2.hist.shift();
  g2.board = out;
  g2.score += gained;
  if (g2.score > g2.best) {
    g2.best = g2.score;
    try { localStorage.setItem('gl-2048-best', String(g2.best)); } catch (e) { /* 无痕模式 */ }
  }
  addTile();
  if (!g2.won && g2.board.some(v => v >= 2048)) g2.won = true;
  if (!canMove()) g2.over = true;
}
function onKey2048(e) {
  const map = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
  };
  const dir = map[e.key];
  if (!dir) return;
  e.preventDefault();
  move2048(dir);
}
let t2s = null;
function t2Start(e) {
  const t = e.changedTouches && e.changedTouches[0];
  if (t) t2s = { x: t.clientX, y: t.clientY };
}
function t2End(e) {
  if (!t2s) return;
  const t = e.changedTouches && e.changedTouches[0];
  if (!t) { t2s = null; return; }
  const dx = t.clientX - t2s.x;
  const dy = t.clientY - t2s.y;
  t2s = null;
  if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) move2048(dx > 0 ? 'right' : 'left');
  else move2048(dy > 0 ? 'down' : 'up');
}
new2048();

/* ---------- 数独 ---------- */
const sdEl = ref(null);
const sd = reactive({
  cells: new Array(81).fill(0),
  given: new Array(81).fill(false),
  sol: new Array(81).fill(0),
  sel: -1,
  wrong: [],
  msg: '',
  msgType: '',
  diff: 'normal',
});
const sdSec = ref(0);
let sdTimer = null;
let sdT0 = 0;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function canPlace(g, i, v) {
  const r = Math.floor(i / 9);
  const c = i % 9;
  for (let k = 0; k < 9; k++) {
    if (g[r * 9 + k] === v) return false;
    if (g[k * 9 + c] === v) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) if (g[(br + dr) * 9 + bc + dc] === v) return false;
  }
  return true;
}
function fillGrid(g) {
  let idx = -1;
  for (let i = 0; i < 81; i++) if (!g[i]) { idx = i; break; }
  if (idx < 0) return true;
  for (const v of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (!canPlace(g, idx, v)) continue;
    g[idx] = v;
    if (fillGrid(g)) return true;
    g[idx] = 0;
  }
  return false;
}
// 只数到 limit 就停：挖洞时只要知道「是不是唯一解」
function countSol(g, limit) {
  let idx = -1;
  for (let i = 0; i < 81; i++) if (!g[i]) { idx = i; break; }
  if (idx < 0) return 1;
  let n = 0;
  for (let v = 1; v <= 9; v++) {
    if (!canPlace(g, idx, v)) continue;
    g[idx] = v;
    n += countSol(g, limit - n);
    g[idx] = 0;
    if (n >= limit) break;
  }
  return n;
}
function makeSudoku(target) {
  const sol = new Array(81).fill(0);
  fillGrid(sol);
  const puz = sol.slice();
  const order = shuffle(Array.from({ length: 81 }, (_, i) => i));
  const t0 = Date.now();
  let given = 81;
  for (const i of order) {
    if (given <= target) break;
    if (Date.now() - t0 > 700) break;   // 慢机器上宁可比目标多留几个数，也别卡住页面
    const back = puz[i];
    puz[i] = 0;
    if (countSol(puz.slice(), 2) !== 1) puz[i] = back;
    else given--;
  }
  return { sol, puz };
}
function stopSdTimer() {
  if (sdTimer) { clearInterval(sdTimer); sdTimer = null; }
}
function startSdTimer() {
  if (sdTimer) return;
  sdT0 = Date.now() - sdSec.value * 1000;
  sdTimer = setInterval(() => { sdSec.value = Math.floor((Date.now() - sdT0) / 1000); }, 250);
}
const TARGET = { easy: 46, normal: 36, hard: 30 };
function newSudoku() {
  stopSdTimer();
  sdSec.value = 0;
  const { sol, puz } = makeSudoku(TARGET[sd.diff] || 36);
  sd.sol = sol;
  sd.cells = puz.slice();
  sd.given = puz.map(v => v !== 0);
  sd.sel = -1;
  sd.wrong = [];
  sd.msg = '';
  sd.msgType = '';
}
function setDiff(d) {
  if (sd.diff === d) return;
  sd.diff = d;
  newSudoku();
}
const remaining = computed(() => sd.cells.filter(v => !v).length);
const sdTime = computed(() => {
  const m = Math.floor(sdSec.value / 60);
  const s = sdSec.value % 60;
  return m + ':' + String(s).padStart(2, '0');
});
const conflicts = computed(() => {
  const bad = new Set();
  const groups = [];
  for (let r = 0; r < 9; r++) groups.push(Array.from({ length: 9 }, (_, k) => r * 9 + k));
  for (let c = 0; c < 9; c++) groups.push(Array.from({ length: 9 }, (_, k) => k * 9 + c));
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const g = [];
      for (let dr = 0; dr < 3; dr++) for (let dc = 0; dc < 3; dc++) g.push((br * 3 + dr) * 9 + bc * 3 + dc);
      groups.push(g);
    }
  }
  for (const g of groups) {
    const seen = {};
    for (const i of g) {
      const v = sd.cells[i];
      if (!v) continue;
      if (!seen[v]) seen[v] = [];
      seen[v].push(i);
    }
    for (const v in seen) if (seen[v].length > 1) seen[v].forEach(i => bad.add(i));
  }
  return bad;
});
function putDigit(n) {
  const i = sd.sel;
  if (i < 0 || sd.given[i]) { sd.msg = '先点一个空格。'; sd.msgType = 'bad'; return; }
  sd.cells[i] = n;
  sd.wrong = sd.wrong.filter(x => x !== i);
  sd.msg = '';
  sd.msgType = '';
  startSdTimer();
  if (sd.cells.every((v, k) => v === sd.sol[k])) {
    stopSdTimer();
    sd.msg = '做完了，用时 ' + sdTime.value + '。';
    sd.msgType = 'ok';
    sd.sel = -1;
  }
  if (sdEl.value) sdEl.value.focus();
}
function onKeySd(e) {
  const k = e.key;
  if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
    e.preventDefault();
    let i = sd.sel < 0 ? 0 : sd.sel;
    const r = Math.floor(i / 9);
    const c = i % 9;
    if (k === 'ArrowLeft') i = r * 9 + Math.max(0, c - 1);
    else if (k === 'ArrowRight') i = r * 9 + Math.min(8, c + 1);
    else if (k === 'ArrowUp') i = Math.max(0, r - 1) * 9 + c;
    else i = Math.min(8, r + 1) * 9 + c;
    sd.sel = i;
    return;
  }
  if (/^[1-9]$/.test(k)) { e.preventDefault(); putDigit(Number(k)); return; }
  if (k === 'Backspace' || k === 'Delete' || k === '0') { e.preventDefault(); putDigit(0); }
}
function checkSudoku() {
  const bad = [];
  for (let i = 0; i < 81; i++) if (sd.cells[i] && sd.cells[i] !== sd.sol[i]) bad.push(i);
  sd.wrong = bad;
  if (!bad.length) {
    sd.msg = sd.cells.every(v => v) ? '全部正确。' : '目前填的都对，接着填。';
    sd.msgType = 'ok';
  } else {
    sd.msg = '红底的 ' + bad.length + ' 格填错了。';
    sd.msgType = 'bad';
  }
}
function hintSudoku() {
  const empty = [];
  for (let i = 0; i < 81; i++) if (!sd.cells[i] || sd.cells[i] !== sd.sol[i]) empty.push(i);
  if (!empty.length) { sd.msg = '已经填满了。'; sd.msgType = 'ok'; return; }
  const i = empty[Math.floor(Math.random() * empty.length)];
  sd.cells[i] = sd.sol[i];
  sd.wrong = sd.wrong.filter(x => x !== i);
  sd.sel = i;
  startSdTimer();
  sd.msg = '这一格是 ' + sd.sol[i] + '。';
  sd.msgType = '';
  if (sd.cells.every((v, k) => v === sd.sol[k])) {
    stopSdTimer();
    sd.msg = '做完了，用时 ' + sdTime.value + '。';
    sd.msgType = 'ok';
  }
  if (sdEl.value) sdEl.value.focus();
}
newSudoku();

onBeforeUnmount(stopSdTimer);
</script>

<style scoped>
.games { padding-bottom: 30px; }
.gm-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(430px, 1fr));
  gap: 18px; margin-top: 18px; align-items: stretch;
}
.gm-card {
  display: flex; flex-direction: column;
  border: 1px solid var(--line); border-top: 3px solid var(--line);
  border-radius: 16px; background: var(--card); padding: 18px 20px 20px;
}
.gm-blue { border-top-color: var(--blue); }
.gm-green { border-top-color: var(--green); }
.gm-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.gm-head h3 { margin: 0; font-size: 18px; font-weight: 600; }
.gm-meta { color: var(--faint); font-size: 12px; }
.gm-tip { color: var(--mut); font-size: 13px; line-height: 1.7; margin: 6px 0 12px; min-height: 44px; }
.gm-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; }
.gm-msg { font-size: 12.5px; margin: 8px 0 0; line-height: 1.6; }
.gm-msg.ok { color: var(--green); }
.gm-msg.bad { color: var(--pink); }
.gm-note { color: var(--faint); font-size: 11.5px; margin: 10px 0 0; line-height: 1.6; margin-top: auto; }
.gm-sp { flex: 1; }

/* 2048 */
.t2-wrap { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
.t2-board {
  flex: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
  width: 264px; padding: 7px; border-radius: 12px;
  background: var(--bg2); border: 1px solid var(--line); outline: none;
  cursor: pointer; touch-action: none;
}
.t2-board:focus-visible { border-color: var(--blue); }
.t2-cell {
  aspect-ratio: 1; border-radius: 7px; display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; font-variant-numeric: tabular-nums;
  background: var(--line); color: transparent; user-select: none;
  transition: background .12s ease, color .12s ease;
}
.t2-cell.v2 { background: #eee4da; color: #776e65; }
.t2-cell.v4 { background: #ede0c8; color: #776e65; }
.t2-cell.v8 { background: #f2b179; color: #fff; }
.t2-cell.v16 { background: #f59563; color: #fff; }
.t2-cell.v32 { background: #f67c5f; color: #fff; }
.t2-cell.v64 { background: #f65e3b; color: #fff; }
.t2-cell.v128 { background: #edcf72; color: #fff; font-size: 17px; }
.t2-cell.v256 { background: #edcc61; color: #fff; font-size: 17px; }
.t2-cell.v512 { background: #edc850; color: #fff; font-size: 17px; }
.t2-cell.v1024 { background: #edc53f; color: #fff; font-size: 15px; }
.t2-cell.v2048 { background: #edc22e; color: #fff; font-size: 15px; }
.t2-cell.big { background: #3c3a32; color: #f9f6f2; font-size: 15px; }
.t2-side { flex: 1; min-width: 140px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.t2-stat, .sd-stat { display: flex; align-items: baseline; gap: 6px; color: var(--faint); font-size: 12px; }
.t2-stat b, .sd-stat b { font-size: 20px; color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.t2-side .gm-line { margin-top: 6px; }

/* 数独 */
.sd-wrap { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
.sd-board {
  flex: none; display: grid; grid-template-columns: repeat(9, 1fr);
  width: 300px; border: 2px solid var(--mut); border-radius: 10px;
  overflow: hidden; background: var(--card); outline: none;
}
.sd-board:focus-visible { border-color: var(--blue); }
.sd-cell {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font: inherit; font-size: 15px; color: var(--blue); font-weight: 500;
  background: transparent; border: none; cursor: pointer; padding: 0;
  border-right: 1px solid var(--line); border-bottom: 1px solid var(--line);
  font-variant-numeric: tabular-nums; transition: background .1s ease;
}
.sd-cell:nth-child(9n) { border-right: none; }
.sd-cell:nth-child(n + 73) { border-bottom: none; }
.sd-cell.b3r { border-right: 2px solid var(--mut); }
.sd-cell.b3b { border-bottom: 2px solid var(--mut); }
.sd-cell.given { color: var(--ink); font-weight: 600; }
.sd-cell.sel { background: color-mix(in srgb, var(--blue) 22%, transparent); }
.sd-cell.conflict { color: var(--pink); }
.sd-cell.bad { background: color-mix(in srgb, var(--pink) 55%, transparent); color: #fff; }
.sd-side { flex: 1; min-width: 170px; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.sd-pad { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 8px; width: 100%; }
.sd-pad .btn { padding: 4px 0; font-size: 13px; }

@media (max-width: 520px) {
  .gm-grid { grid-template-columns: 1fr; }
  .t2-board { width: 100%; max-width: 280px; }
  .sd-board { width: 100%; max-width: 320px; }
  .t2-side, .sd-side { min-width: 100%; }
}
</style>
