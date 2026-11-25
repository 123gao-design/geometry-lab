<template>
  <div class="games">
    <div class="chapter-head">
      <h1>数字游戏</h1>
      <p class="sub">24 点、数字华容道、60 秒速算、猜数字。四个小游戏都在本机运行，不联网；成绩只记在这台浏览器里。2048 和数独在旁边的页签里。</p>
    </div>
    <GameTabs />

    <div class="gm-grid">
      <!-- 24 点 -->
      <section class="gm-card gm-blue">
        <div class="gm-head">
          <h3>24 点</h3>
          <span class="gm-meta">四则运算 · 每个数用一次</span>
        </div>
        <p class="gm-tip">用下面四个数各一次，通过加、减、乘、除和括号算出 24。</p>
        <div class="g24-nums">
          <span v-for="(n, i) in g24.nums" :key="i" class="g24-num">{{ n }}</span>
        </div>
        <div class="gm-line">
          <input v-model="g24.expr" class="gm-input" type="text" spellcheck="false"
            placeholder="例如 (3+3)×(8−4)，回车提交" @keydown.enter="check24" />
          <button class="btn" type="button" @click="check24">检查</button>
        </div>
        <div class="gm-line">
          <button class="btn" type="button" @click="new24">换一组</button>
          <button class="btn" type="button" @click="g24.showSol = !g24.showSol">{{ g24.showSol ? '收起答案' : '看答案' }}</button>
          <span class="gm-sp" />
          <span class="gm-count">已解 {{ g24.done }} 组</span>
        </div>
        <p v-if="g24.msg" class="gm-msg" :class="g24.msgType">{{ g24.msg }}</p>
        <p v-if="g24.showSol" class="gm-sol">参考答案：{{ g24.solution }}</p>
        <p class="gm-note">乘号写 × 或 *，除号写 ÷ 或 /；中间结果按分数精确计算。</p>
      </section>

      <!-- 数字华容道 -->
      <section class="gm-card gm-green">
        <div class="gm-head">
          <h3>数字华容道</h3>
          <span class="gm-meta">滑动拼图</span>
        </div>
        <p class="gm-tip">点空格旁边的数字，把它滑进空格。把 1 到 {{ puz.size * puz.size - 1 }} 按顺序排好，空格留在右下角。</p>
        <div class="pz-wrap">
          <div class="pz-board" :style="{ '--n': puz.size }">
            <button v-for="(v, i) in puz.board" :key="i" class="pz-tile"
              :class="{ blank: v === 0, home: v === i + 1 }" type="button"
              :disabled="v === 0" @click="slide(i)">{{ v === 0 ? '' : v }}</button>
          </div>
          <div class="pz-side">
            <div class="pz-stat"><b>{{ puz.moves }}</b><span>步</span></div>
            <div class="pz-stat"><b>{{ timeText }}</b><span>用时</span></div>
            <div class="gm-line">
              <button class="btn" :class="{ on: puz.size === 3 }" type="button" @click="setSize(3)">3 × 3</button>
              <button class="btn" :class="{ on: puz.size === 4 }" type="button" @click="setSize(4)">4 × 4</button>
            </div>
            <button class="btn pri" type="button" @click="newPuzzle(puz.size)">重新打乱</button>
            <p v-if="puz.won" class="gm-msg ok">排好了，用了 {{ puz.moves }} 步、{{ timeText }}。</p>
          </div>
        </div>
        <p class="gm-note">打乱只走合法步，所以每一局都拼得回去。</p>
      </section>

      <!-- 60 秒速算 -->
      <section class="gm-card gm-orange">
        <div class="gm-head">
          <h3>60 秒速算</h3>
          <span class="gm-meta">四则口算 · 回车提交</span>
        </div>
        <p class="gm-tip">60 秒里做尽量多的题，加减乘除随机出。答完一题马上出下一题，回车提交。</p>
        <div class="rs-top">
          <span class="rs-clock" :class="{ hot: rushHot }">{{ rush.left }} 秒</span>
          <span class="rs-stat">答对 <b>{{ rush.right }}</b></span>
          <span class="rs-stat">答错 <b>{{ rush.wrong }}</b></span>
          <span class="gm-sp" />
          <span class="rs-best">最好 {{ rush.best }}</span>
        </div>
        <div v-if="rush.on" class="rs-q">
          <span class="rs-expr">{{ rush.q }}</span>
          <span class="rs-eq">=</span>
          <input ref="rushInput" v-model="rush.input" class="gm-input rs-input" type="text" inputmode="numeric"
            spellcheck="false" placeholder="答案" @keydown.enter="submitRush" />
        </div>
        <p v-else-if="rush.started" class="rs-idle">时间到，答对 {{ rush.right }} 题，答错 {{ rush.wrong }} 题。</p>
        <p v-else class="rs-idle">点下面的按钮开始，计时结束自动收卷。</p>
        <div class="gm-line">
          <button class="btn pri" type="button" @click="startRush">{{ rush.on ? '重新开始' : '开始 60 秒' }}</button>
          <span v-if="rush.fb" class="gm-msg" :class="rush.fbType">{{ rush.fb }}</span>
        </div>
        <p class="gm-note">题目和答案都是整数，答完一题立刻换下一题。</p>
      </section>

      <!-- 猜数字 -->
      <section class="gm-card gm-purple">
        <div class="gm-head">
          <h3>猜数字</h3>
          <span class="gm-meta">四位数 · A 位置对 / B 数字对</span>
        </div>
        <p class="gm-tip">四位互不相同的数字。每次提交后给出 A 和 B：A 表示数字与位置都对，B 表示数字对但位置不对。</p>
        <div class="gm-line">
          <input v-model="gs.input" class="gm-input gs-input" type="text" inputmode="numeric" maxlength="4"
            spellcheck="false" placeholder="四位数字" @keydown.enter="checkGuess" />
          <button class="btn" type="button" @click="checkGuess">提交</button>
          <button class="btn" type="button" @click="newGuess">换一局</button>
        </div>
        <p v-if="gs.msg" class="gm-msg" :class="gs.won ? 'ok' : 'bad'">{{ gs.msg }}</p>
        <ol v-if="gs.tries.length" class="gs-list">
          <li v-for="(t, i) in gs.tries" :key="t.s + '-' + i">
            <span class="gs-n">{{ gs.tries.length - i }}</span>
            <span class="gs-d">{{ t.s }}</span>
            <span class="gs-ab">{{ t.a }}A{{ t.b }}B</span>
          </li>
        </ol>
        <p v-else class="gs-empty">还没有记录。先猜一组。</p>
        <p class="gm-note">四位数里没有 0 打头，也没有重复数字。</p>
      </section>
    </div>
  </div>
</template>

<script setup>
// 数字游戏页：四个互不依赖的小游戏，全部在组件内完成状态管理与判定。
// 24 点用整数对（分子/分母）做精确运算，避免 1/3 之类的浮点误差；
// 华容道只用合法移动打乱，保证一定可解；速算最好成绩存 localStorage。
import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue';
import GameTabs from '../components/GameTabs.vue';

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/* ---------- 24 点 ---------- */
const g24 = reactive({ nums: [], expr: '', msg: '', msgType: '', solution: '', showSol: false, solved: false, done: 0 });

// 把 n/d 约分；d 为负时把负号移到分子，便于比较
function mk(n, d, e) {
  if (d === 0) return null;
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d) || 1;
  return { n: n / g, d: d / g, e };
}

// 穷举四个数的所有配对与运算，找到一个等于 24 的表达式就返回
function step24(list) {
  if (list.length === 1) {
    const x = list[0];
    return x.n === 24 * x.d ? x.e : '';
  }
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      const rest = list.filter((_, k) => k !== i && k !== j);
      const cand = [
        mk(a.n * b.d + b.n * a.d, a.d * b.d, `(${a.e} + ${b.e})`),
        mk(a.n * b.d - b.n * a.d, a.d * b.d, `(${a.e} − ${b.e})`),
        mk(b.n * a.d - a.n * b.d, a.d * b.d, `(${b.e} − ${a.e})`),
        mk(a.n * b.n, a.d * b.d, `(${a.e} × ${b.e})`),
        b.n === 0 ? null : mk(a.n * b.d, a.d * b.n, `(${a.e} ÷ ${b.e})`),
        a.n === 0 ? null : mk(b.n * a.d, b.d * a.n, `(${b.e} ÷ ${a.e})`),
      ];
      for (const c of cand) {
        if (!c) continue;
        const r = step24(rest.concat(c));
        if (r) return r;
      }
    }
  }
  return '';
}

function solve24(nums) {
  const s = step24(nums.map(v => ({ n: v, d: 1, e: String(v) })));
  // 表达式树最外层总带一对括号，去掉这一对更好读；只去一层，别把两个子表达式各自的括号也拆掉
  if (!s.startsWith('(') || !s.endsWith(')')) return s;
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') {
      depth--;
      if (depth === 0) return i === s.length - 1 ? s.slice(1, -1) : s;
    }
  }
  return s;
}

function new24() {
  // 随机四张牌不一定算得出 24，先试若干组；都不行就用 3、3、8、8 这组固定牌
  let nums = [3, 3, 8, 8];
  let solution = '8 ÷ (3 − 8 ÷ 3)';
  for (let k = 0; k < 80; k++) {
    const cand = Array.from({ length: 4 }, () => rnd(1, 13));
    const s = solve24(cand);
    if (s) { nums = cand; solution = s; break; }
  }
  g24.nums = nums;
  g24.solution = solution;
  g24.expr = '';
  g24.msg = '';
  g24.msgType = '';
  g24.showSol = false;
  g24.solved = false;
}

// 递归下降解析玩家算式；used 收集算式里出现的整数，用来核对四个数是否各用一次
function eval24(src, used) {
  const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    .replace(/（/g, '(').replace(/）/g, ')').replace(/\s+/g, '');
  if (!/^[0-9+\-*/()]+$/.test(s)) throw new Error('只能用数字、加、减、乘、除和括号。');
  let i = 0;
  function number() {
    const st = i;
    while (i < s.length && s[i] >= '0' && s[i] <= '9') i++;
    if (st === i) throw new Error('这里缺一个数。');
    const v = Number(s.slice(st, i));
    used.push(v);
    return { n: v, d: 1 };
  }
  function primary() {
    if (s[i] === '(') {
      i++;
      const v = expr();
      if (s[i] !== ')') throw new Error('括号没有配对。');
      i++;
      return v;
    }
    return number();
  }
  function unary() {
    if (s[i] === '-') { i++; const v = unary(); return { n: -v.n, d: v.d }; }
    if (s[i] === '+') { i++; return unary(); }
    return primary();
  }
  function term() {
    let a = unary();
    while (s[i] === '*' || s[i] === '/') {
      const op = s[i++];
      const b = unary();
      if (op === '*') a = { n: a.n * b.n, d: a.d * b.d };
      else {
        if (b.n === 0) throw new Error('不能除以 0。');
        a = { n: a.n * b.d, d: a.d * b.n };
      }
    }
    return a;
  }
  function expr() {
    let a = term();
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++];
      const b = term();
      if (op === '+') a = { n: a.n * b.d + b.n * a.d, d: a.d * b.d };
      else a = { n: a.n * b.d - b.n * a.d, d: a.d * b.d };
    }
    return a;
  }
  const v = expr();
  if (i < s.length) throw new Error(`多出来的字符：${s[i]}`);
  return v;
}

function norm24(v) {
  if (v.d === 0) throw new Error('不能除以 0。');
  let n = v.n;
  let d = v.d;
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d) || 1;
  return { n: n / g, d: d / g };
}

function check24() {
  const src = g24.expr.trim();
  if (!src) { g24.msg = '先写一个算式。'; g24.msgType = 'bad'; return; }
  if (g24.solved) { g24.msg = '这组已经算对了，点「换一组」继续。'; g24.msgType = 'ok'; return; }
  const used = [];
  try {
    const v = eval24(src, used);
    const want = g24.nums.slice().sort((a, b) => a - b).join(' ');
    const got = used.slice().sort((a, b) => a - b).join(' ');
    if (want !== got) throw new Error('四个数都要用上，每个只用一次。');
    const r = norm24(v);
    if (r.n !== 24 * r.d) {
      g24.msg = `这个算式的结果是 ${r.d === 1 ? r.n : r.n + '/' + r.d}，不是 24。`;
      g24.msgType = 'bad';
      return;
    }
    g24.msg = '算对了。';
    g24.msgType = 'ok';
    g24.solved = true;
    g24.done++;
  } catch (e) {
    g24.msg = e.message;
    g24.msgType = 'bad';
  }
}

/* ---------- 数字华容道 ---------- */
const puz = reactive({ size: 4, board: [], blank: 0, moves: 0, t0: 0, sec: 0, won: false });
let pzTimer = null;

function pzNeighbors(idx, n) {
  const r = Math.floor(idx / n);
  const c = idx % n;
  const out = [];
  if (r > 0) out.push(idx - n);
  if (r < n - 1) out.push(idx + n);
  if (c > 0) out.push(idx - 1);
  if (c < n - 1) out.push(idx + 1);
  return out;
}

// 从排好的局面出发随机走合法步，走出来的局面必然可解
function pzShuffle(n) {
  const total = n * n;
  const arr = Array.from({ length: total }, (_, i) => (i + 1) % total);
  let blank = total - 1;
  let prev = -1;
  for (let k = 0; k < total * total * 12; k++) {
    const nb = pzNeighbors(blank, n).filter(x => x !== prev);
    const pick = nb[Math.floor(Math.random() * nb.length)];
    [arr[blank], arr[pick]] = [arr[pick], arr[blank]];
    prev = blank;
    blank = pick;
  }
  return { arr, blank };
}

function newPuzzle(n = puz.size) {
  stopClock();
  puz.size = n;
  let s = pzShuffle(n);
  while (s.arr.every((v, i) => (i === s.arr.length - 1 ? v === 0 : v === i + 1))) s = pzShuffle(n);
  puz.board = s.arr;
  puz.blank = s.blank;
  puz.moves = 0;
  puz.sec = 0;
  puz.won = false;
}

function setSize(n) {
  if (n !== puz.size) newPuzzle(n);
}

function slide(i) {
  if (puz.won) return;
  if (!pzNeighbors(puz.blank, puz.size).includes(i)) return;
  const b = puz.blank;
  [puz.board[b], puz.board[i]] = [puz.board[i], puz.board[b]];
  puz.blank = i;
  puz.moves++;
  if (!pzTimer) startClock();
  const total = puz.size * puz.size;
  if (puz.board.every((v, k) => (k === total - 1 ? v === 0 : v === k + 1))) {
    puz.won = true;
    stopClock();
  }
}

function startClock() {
  puz.t0 = Date.now();
  puz.sec = 0;
  pzTimer = setInterval(() => { puz.sec = Math.floor((Date.now() - puz.t0) / 1000); }, 250);
}

function stopClock() {
  if (pzTimer) { clearInterval(pzTimer); pzTimer = null; }
}

const timeText = computed(() => {
  const m = Math.floor(puz.sec / 60);
  const s = puz.sec % 60;
  return m + ':' + String(s).padStart(2, '0');
});

/* ---------- 60 秒速算 ---------- */
const rushInput = ref(null);
const rush = reactive({ on: false, started: false, left: 60, q: '', ans: 0, input: '', right: 0, wrong: 0, fb: '', fbType: '', best: 0 });
let rushTimer = null;
try { rush.best = Number(localStorage.getItem('gl-rush-best')) || 0; } catch (e) { rush.best = 0; }

const rushHot = computed(() => rush.on && rush.left <= 10);

function qNew() {
  const kind = rnd(0, 3);
  let a;
  let b;
  let ans;
  let text;
  if (kind === 0) {
    a = rnd(12, 89);
    b = rnd(12, 89);
    ans = a + b;
    text = a + ' + ' + b;
  } else if (kind === 1) {
    a = rnd(31, 99);
    b = rnd(11, a - 10);
    ans = a - b;
    text = a + ' − ' + b;
  } else if (kind === 2) {
    a = rnd(3, 12);
    b = rnd(4, 19);
    ans = a * b;
    text = a + ' × ' + b;
  } else {
    b = rnd(3, 12);
    ans = rnd(3, 12);
    a = b * ans;
    text = a + ' ÷ ' + b;
  }
  rush.q = text;
  rush.ans = ans;
}

function startRush() {
  stopRush();
  rush.on = true;
  rush.started = true;
  rush.left = 60;
  rush.right = 0;
  rush.wrong = 0;
  rush.input = '';
  rush.fb = '';
  rush.fbType = '';
  qNew();
  nextTick(() => rushInput.value && rushInput.value.focus());
  rushTimer = setInterval(() => {
    rush.left--;
    if (rush.left <= 0) endRush();
  }, 1000);
}

function stopRush() {
  if (rushTimer) { clearInterval(rushTimer); rushTimer = null; }
}

function endRush() {
  stopRush();
  rush.on = false;
  rush.left = 0;
  if (rush.right > rush.best) {
    rush.best = rush.right;
    try { localStorage.setItem('gl-rush-best', String(rush.best)); } catch (e) { /* 无痕模式 */ }
  }
}

function submitRush() {
  if (!rush.on) return;
  const t = rush.input.trim();
  const v = Number(t);
  if (!t || !Number.isFinite(v)) { rush.fb = '先填一个数。'; rush.fbType = 'bad'; return; }
  if (v === rush.ans) {
    rush.right++;
    rush.fb = '对。';
    rush.fbType = 'ok';
  } else {
    rush.wrong++;
    rush.fb = '上一题是 ' + rush.ans + '。';
    rush.fbType = 'bad';
  }
  rush.input = '';
  qNew();
  nextTick(() => rushInput.value && rushInput.value.focus());
}

/* ---------- 猜数字 ---------- */
const gs = reactive({ secret: '', input: '', tries: [], msg: '', won: false });

function newGuess() {
  const first = rnd(1, 9);
  const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== first);
  const rest = [];
  while (rest.length < 3) rest.push(pool.splice(rnd(0, pool.length - 1), 1)[0]);
  gs.secret = String(first) + rest.join('');
  gs.input = '';
  gs.tries = [];
  gs.msg = '';
  gs.won = false;
}

function checkGuess() {
  if (gs.won) { gs.msg = '这一局已经猜中了，点「换一局」再来。'; return; }
  const s = gs.input.trim();
  if (!/^\d{4}$/.test(s)) { gs.msg = '要填四位数字。'; return; }
  if (new Set(s).size !== 4) { gs.msg = '四位数字不能重复。'; return; }
  let a = 0;
  let b = 0;
  for (let i = 0; i < 4; i++) {
    if (s[i] === gs.secret[i]) a++;
    else if (gs.secret.includes(s[i])) b++;
  }
  gs.tries.unshift({ s, a, b });
  gs.input = '';
  if (a === 4) {
    gs.won = true;
    gs.msg = '第 ' + gs.tries.length + ' 次猜中，答案就是 ' + gs.secret + '。';
  } else {
    gs.msg = '';
  }
}

/* ---------- 初始化与清理 ---------- */
new24();
newPuzzle(4);
newGuess();

onBeforeUnmount(() => {
  stopClock();
  stopRush();
});
</script>

<style scoped>
.games { padding-bottom: 30px; }
.gm-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
  gap: 18px; margin-top: 18px; align-items: stretch;
}
.gm-card {
  display: flex; flex-direction: column;
  border: 1px solid var(--line); border-top: 3px solid var(--line);
  border-radius: 16px; background: var(--card); padding: 18px 20px 20px;
}
.gm-blue { border-top-color: var(--blue); }
.gm-green { border-top-color: var(--green); }
.gm-orange { border-top-color: var(--orange); }
.gm-purple { border-top-color: var(--purple); }
.gm-head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.gm-head h3 { margin: 0; font-size: 18px; font-weight: 600; }
.gm-meta { color: var(--faint); font-size: 12px; }
.gm-tip { color: var(--mut); font-size: 13px; line-height: 1.7; margin: 6px 0 12px; min-height: 44px; }
.gm-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.gm-input {
  flex: 1; min-width: 0; font: inherit; font-size: 14px; color: var(--ink);
  background: var(--bg2); border: 1px solid var(--line); border-radius: 9px;
  padding: 7px 11px; outline: none;
}
.gm-input:focus { border-color: var(--blue); }
.gm-sp { flex: 1; }
.gm-count { color: var(--faint); font-size: 12px; }
.gm-msg { font-size: 12.5px; margin: 8px 0 0; line-height: 1.6; }
.gm-msg.ok { color: var(--green); }
.gm-msg.bad { color: var(--pink); }
.gm-sol { color: var(--mut); font-size: 12.5px; margin: 6px 0 0; }
.gm-note { color: var(--faint); font-size: 11.5px; margin: 10px 0 0; margin-top: auto; line-height: 1.6; }

/* 24 点 */
.g24-nums { display: flex; gap: 8px; flex-wrap: wrap; }
.g24-num {
  width: 48px; height: 48px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif); font-size: 22px; font-weight: 600;
  color: var(--ink); background: var(--bg2); border: 1px solid var(--line);
}

/* 数字华容道 */
.pz-wrap { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
.pz-board {
  flex: none; display: grid; grid-template-columns: repeat(var(--n, 4), 1fr); gap: 5px;
  width: 250px; padding: 6px; background: var(--bg2); border: 1px solid var(--line); border-radius: 12px;
}
.pz-tile {
  aspect-ratio: 1; border-radius: 7px; border: 1px solid var(--line); background: var(--card);
  color: var(--ink); font: inherit; font-size: 16px; font-weight: 600; cursor: pointer;
  transition: background .12s ease, border-color .12s ease, color .12s ease;
}
.pz-tile:hover:not(:disabled) { border-color: var(--green); background: color-mix(in srgb, var(--green) 10%, var(--card)); }
.pz-tile.blank { background: transparent; border-style: dashed; border-color: var(--line); cursor: default; }
.pz-tile.home { color: var(--green); border-color: color-mix(in srgb, var(--green) 45%, transparent); }
.pz-side { flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 9px; align-items: flex-start; }
.pz-stat { display: flex; align-items: baseline; gap: 6px; color: var(--faint); font-size: 12px; }
.pz-stat b { font-size: 20px; color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }

/* 60 秒速算 */
.rs-top { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
.rs-clock { font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
.rs-clock.hot { color: var(--pink); }
.rs-stat { color: var(--mut); font-size: 13px; }
.rs-stat b { color: var(--ink); font-variant-numeric: tabular-nums; }
.rs-best { color: var(--faint); font-size: 12px; }
.rs-q { display: flex; align-items: center; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
.rs-expr { font-size: 30px; font-weight: 600; letter-spacing: 1px; font-variant-numeric: tabular-nums; }
.rs-eq { color: var(--faint); font-size: 24px; }
.rs-input { flex: none; width: 120px; font-size: 20px; text-align: center; }
.rs-idle { color: var(--mut); font-size: 13px; margin: 14px 0 0; line-height: 1.7; }

/* 猜数字 */
.gs-input { flex: none; width: 140px; font-size: 17px; letter-spacing: 6px; text-align: center; font-variant-numeric: tabular-nums; }
.gs-list { list-style: none; padding: 0; margin: 12px 0 0; max-height: 210px; overflow: auto; }
.gs-list li { display: flex; align-items: center; gap: 10px; padding: 5px 0; border-bottom: 1px dashed var(--line); font-size: 13.5px; }
.gs-list li:last-child { border-bottom: none; }
.gs-n { width: 24px; color: var(--faint); font-size: 12px; text-align: right; }
.gs-d { font-family: var(--font-mono); letter-spacing: 3px; color: var(--ink); }
.gs-ab { margin-left: auto; color: var(--purple); font-weight: 600; }
.gs-empty { color: var(--faint); font-size: 12.5px; margin: 12px 0 0; }

@media (max-width: 520px) {
  .gm-grid { grid-template-columns: 1fr; }
  .pz-board { width: 100%; max-width: 270px; }
  .rs-expr { font-size: 24px; }
}
</style>
