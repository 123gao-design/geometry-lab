<template>
  <div class="games">
    <div class="chapter-head">
      <h1>2048</h1>
      <p class="sub">相同的两块撞在一起就合成一块，目标是把 2048 拼出来。棋盘可以选 4×4、5×5 或 6×6；点一下棋盘再用方向键，手机上直接滑。拼出 2048 之后还能接着玩。</p>
    </div>
    <GameTabs />

    <section class="gm-card gm-blue">
      <div class="gm-head">
        <h3>{{ g2.n }} × {{ g2.n }}</h3>
        <span class="gm-meta">方向键 / WASD / 滑屏</span>
      </div>
      <p class="gm-tip">每次有效移动后会随机冒出一块新数字，九成是 2，一成是 4。合出来的数累加进得分。</p>
      <div class="t2-wrap">
        <div ref="b2El" class="t2-board" tabindex="0" aria-label="2048 棋盘" :style="boardStyle"
          @click="b2El && b2El.focus()"
          @keydown="onKey2048" @touchstart.passive="t2Start" @touchend.passive="t2End">
          <div v-for="(v, i) in g2.board" :key="i" class="t2-cell"
            :class="v ? (v > 2048 ? 'big' : 'v' + v) : 'v0'">{{ v || '' }}</div>
        </div>
        <div class="t2-side">
          <div class="t2-stat"><b>{{ g2.score }}</b><span>得分</span></div>
          <div class="t2-stat"><b>{{ g2.best }}</b><span>最高</span></div>
          <p class="t2-label">棋盘大小</p>
          <div class="gm-line t2-sizes">
            <button v-for="s in SIZES" :key="s" class="btn" type="button"
              :class="{ on: g2.n === s }" @click="setSize(s)">{{ s }} × {{ s }}</button>
          </div>
          <div class="gm-line">
            <button class="btn" type="button" :disabled="!g2.hist.length" @click="undo2048">撤销</button>
            <button class="btn pri" type="button" @click="new2048">新一局</button>
          </div>
          <p v-if="g2.over" class="gm-msg bad">棋盘满了，没有可走的步。</p>
          <p v-else-if="g2.won" class="gm-msg ok">拼出 2048 了。</p>
        </div>
      </div>
      <p class="gm-note">最高分按棋盘大小分开记，换尺寸不会串；换尺寸会重开一局。</p>
    </section>
  </div>
</template>

<script setup>
// 2048 单页：棋盘边长在 4 / 5 / 6 之间切，合并算法按边长参数化，四方向共用一段逻辑。
// 取行顺序 → 去掉空格 → 相邻相同的合并一次 → 补回空格 → 写回原序。最高分按边长分开存。
import { computed, reactive, ref } from 'vue';
import GameTabs from '../components/GameTabs.vue';

const SIZES = [4, 5, 6];
const g2 = reactive({
  n: 4,
  board: new Array(16).fill(0),
  score: 0,
  best: 0,
  won: false,
  over: false,
  hist: [],
});

// 4×4 沿用早先的键名，免得老成绩一夜清零
function bestKey(n) { return n === 4 ? 'gl-2048-best' : 'gl-2048-best-' + n; }
function readBest(n) {
  try { return Number(localStorage.getItem(bestKey(n))) || 0; } catch (e) { return 0; }
}

function addTile() {
  const total = g2.n * g2.n;
  const empty = [];
  for (let i = 0; i < total; i++) if (!g2.board[i]) empty.push(i);
  if (!empty.length) return;
  g2.board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
}

function new2048() {
  g2.board = new Array(g2.n * g2.n).fill(0);
  g2.score = 0;
  g2.won = false;
  g2.over = false;
  g2.hist = [];
  addTile();
  addTile();
}

function setSize(n) {
  if (g2.n === n) return;
  g2.n = n;
  g2.best = readBest(n);
  new2048();
}

function undo2048() {
  const last = g2.hist.pop();
  if (!last) return;
  g2.board = last.board;
  g2.score = last.score;
  g2.over = false;
}

// 一条线上从「贴边那一头」数起的格子下标：四个方向只在这里分叉
function lineIndexes(dir, line) {
  const n = g2.n;
  const out = [];
  for (let k = 0; k < n; k++) {
    if (dir === 'left') out.push(line * n + k);
    else if (dir === 'right') out.push(line * n + (n - 1 - k));
    else if (dir === 'up') out.push(k * n + line);
    else out.push((n - 1 - k) * n + line);
  }
  return out;
}

function canMove() {
  const n = g2.n;
  for (let i = 0; i < n * n; i++) {
    if (!g2.board[i]) return true;
    const r = Math.floor(i / n);
    const c = i % n;
    if (c < n - 1 && g2.board[i] === g2.board[i + 1]) return true;
    if (r < n - 1 && g2.board[i] === g2.board[i + n]) return true;
  }
  return false;
}

function move2048(dir) {
  const n = g2.n;
  const before = g2.board.slice();
  const out = new Array(n * n).fill(0);
  let gained = 0;
  for (let line = 0; line < n; line++) {
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
    while (merged.length < n) merged.push(0);
    merged.forEach((v, k) => { out[idx[k]] = v; });
  }
  if (out.every((v, i) => v === before[i])) return;
  g2.hist.push({ board: before, score: g2.score });
  if (g2.hist.length > 8) g2.hist.shift();
  g2.board = out;
  g2.score += gained;
  if (g2.score > g2.best) {
    g2.best = g2.score;
    try { localStorage.setItem(bestKey(g2.n), String(g2.best)); } catch (e) { /* 无痕模式 */ }
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

const b2El = ref(null);
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

// 边长越大格子越小：宽度与字号一起缩，格子始终是正方形
const boardStyle = computed(() => {
  const n = g2.n;
  return {
    '--n': n,
    '--fs': n === 4 ? '24px' : n === 5 ? '19px' : '16px',
    width: (n === 4 ? 288 : n === 5 ? 320 : 352) + 'px',
  };
});

g2.best = readBest(g2.n);
new2048();
</script>

<style scoped>
.games { padding-bottom: 30px; }
.gm-card {
  display: flex; flex-direction: column;
  border: 1px solid var(--line); border-top: 3px solid var(--line);
  border-radius: 16px; background: var(--card); padding: 18px 20px 20px;
  margin-top: 18px;
}
.gm-blue { border-top-color: var(--blue); }
.gm-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.gm-head h3 { margin: 0; font-size: 18px; font-weight: 600; font-variant-numeric: tabular-nums; }
.gm-meta { color: var(--faint); font-size: 12px; }
.gm-tip { color: var(--mut); font-size: 13px; line-height: 1.7; margin: 6px 0 12px; }
.gm-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.gm-msg { font-size: 12.5px; margin: 8px 0 0; line-height: 1.6; }
.gm-msg.ok { color: var(--green); }
.gm-msg.bad { color: var(--pink); }
.gm-note { color: var(--faint); font-size: 11.5px; margin: 10px 0 0; line-height: 1.6; margin-top: auto; }

.t2-wrap { display: flex; gap: 22px; align-items: flex-start; flex-wrap: wrap; }
.t2-board {
  flex: none; display: grid; grid-template-columns: repeat(var(--n, 4), 1fr); gap: 6px;
  max-width: 100%; padding: 8px; border-radius: 12px;
  background: var(--bg2); border: 1px solid var(--line); outline: none;
  cursor: pointer; touch-action: none;
}
.t2-board:focus-visible { border-color: var(--blue); }
.t2-cell {
  aspect-ratio: 1; border-radius: 7px; display: flex; align-items: center; justify-content: center;
  font-size: var(--fs, 24px); font-weight: 700; font-variant-numeric: tabular-nums;
  background: var(--line); color: transparent; user-select: none;
  transition: background .12s ease, color .12s ease;
}
.t2-cell.v2 { background: #eee4da; color: #776e65; }
.t2-cell.v4 { background: #ede0c8; color: #776e65; }
.t2-cell.v8 { background: #f2b179; color: #fff; }
.t2-cell.v16 { background: #f59563; color: #fff; }
.t2-cell.v32 { background: #f67c5f; color: #fff; }
.t2-cell.v64 { background: #f65e3b; color: #fff; }
.t2-cell.v128 { background: #edcf72; color: #fff; }
.t2-cell.v256 { background: #edcc61; color: #fff; }
.t2-cell.v512 { background: #edc850; color: #fff; }
.t2-cell.v1024 { background: #edc53f; color: #fff; }
.t2-cell.v2048 { background: #edc22e; color: #fff; }
.t2-cell.big { background: #3c3a32; color: #f9f6f2; }
.t2-cell.v128, .t2-cell.v256, .t2-cell.v512 { font-size: calc(var(--fs, 24px) * .84); }
.t2-cell.v1024, .t2-cell.v2048, .t2-cell.big { font-size: calc(var(--fs, 24px) * .7); }

.t2-side { flex: 1; min-width: 190px; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.t2-stat { display: flex; align-items: baseline; gap: 6px; color: var(--faint); font-size: 12px; }
.t2-stat b { font-size: 22px; color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.t2-label { margin: 10px 0 0; color: var(--faint); font-size: 12px; }
.t2-sizes .btn { padding: 4px 12px; font-size: 13px; font-variant-numeric: tabular-nums; }
.t2-side .gm-line { margin-top: 6px; }

@media (max-width: 520px) {
  .t2-board { width: 100% !important; }
  .t2-side { min-width: 100%; }
}
</style>
