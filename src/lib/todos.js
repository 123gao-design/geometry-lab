/* 日历待办的仓库：localStorage 'gl-todos'。
   一条记录 = { id, date:'YYYY-MM-DD', text, done, at }
     date  本地日期键（不含时区，跨月跨年按本机日历算）
     at    创建时间戳，同一天内按它排序
   与 notes.js 同一套思路：只用本机存储、写失败不吞错（记进 TODO_SAVE 让页面提示）、
   多标签页靠 storage 事件重读。整份备份 / 导入是纯 JSON，换了域名或换机器都能搬。 */

import { reactive } from 'vue';

const KEY = 'gl-todos';
export const MAX_ITEMS = 5000;
export const MAX_TEXT = 200;

export const TODOS = reactive({ v: 1, items: [] });
// 存档状态：ok=false 时 err 是给人看的一句话（配额满 / 浏览器禁写）
export const TODO_SAVE = reactive({ ok: true, err: '', at: 0 });

const pad2 = n => String(n).padStart(2, '0');
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const todayKey = () => dateKey(new Date());
/** 'YYYY-MM-DD' → 本地零点的 Date（不要用 new Date('2026-11-18')，那是按 UTC 解析的） */
export function fromKey(k) {
  const [y, m, d] = String(k || '').split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}
/** 某天所在月份的键 'YYYY-MM'，用来统计本月未完成数 */
export const monthOf = k => String(k || '').slice(0, 7);
export const monthKey = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** 把读到的原始 JSON 规整成能用的形状：坏条目直接丢掉，不整份报错 */
function normalize(raw) {
  const list = raw && Array.isArray(raw.items) ? raw.items : [];
  const out = [];
  const seen = new Set();
  for (const it of list) {
    if (!it || typeof it !== 'object') continue;
    const date = String(it.date || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const text = String(it.text == null ? '' : it.text).slice(0, MAX_TEXT).trim();
    if (!text) continue;
    let id = String(it.id || '') || uid();
    if (seen.has(id)) id = uid();
    seen.add(id);
    out.push({ id, date, text, done: !!it.done, at: Number(it.at) || Date.now() });
    if (out.length >= MAX_ITEMS) break;
  }
  out.sort((a, b) => a.at - b.at);
  return out;
}

export function loadTodos() {
  try {
    const raw = localStorage.getItem(KEY);
    TODOS.items = raw ? normalize(JSON.parse(raw)) : [];
    TODO_SAVE.ok = true;
    TODO_SAVE.err = '';
  } catch (_) {
    TODOS.items = [];
  }
  return TODOS.items;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, items: TODOS.items }));
    TODO_SAVE.ok = true;
    TODO_SAVE.err = '';
    TODO_SAVE.at = Date.now();
  } catch (e) {
    TODO_SAVE.ok = false;
    TODO_SAVE.err = e && e.name === 'QuotaExceededError'
      ? '本机存储已满，这条没存进去——先备份再清理旧条目'
      : '浏览器不允许写本机存储，刷新后会丢，请先备份';
  }
}

/* ---------- 读 ---------- */
/** 某一天的全部待办（按创建先后） */
export function byDate(k) {
  return TODOS.items.filter(t => t.date === k);
}
/** 某一天的 { total, done }，日历格子上的圆点用它 */
export function countsFor(k) {
  let total = 0, done = 0;
  for (const t of TODOS.items) {
    if (t.date !== k) continue;
    total++;
    if (t.done) done++;
  }
  return { total, done };
}
export const undoneTotal = () => TODOS.items.reduce((n, t) => n + (t.done ? 0 : 1), 0);
export const undoneInMonth = mk => TODOS.items.reduce((n, t) => n + (!t.done && monthOf(t.date) === mk ? 1 : 0), 0);
/** 有未完成任务的最近若干天，给侧栏「接下来」用 */
export function upcoming(fromKeyStr = todayKey(), n = 6) {
  const map = new Map();
  for (const t of TODOS.items) {
    if (t.done || t.date < fromKeyStr) continue;
    map.set(t.date, (map.get(t.date) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(0, n).map(([k, v]) => ({ date: k, n: v }));
}

/* ---------- 写 ---------- */
export function addTodo(date, text) {
  const s = String(text || '').trim().slice(0, MAX_TEXT);
  if (!s || TODOS.items.length >= MAX_ITEMS) return null;
  const it = { id: uid(), date, text: s, done: false, at: Date.now() };
  TODOS.items.push(it);
  persist();
  return it;
}
export function toggleTodo(id) {
  const t = TODOS.items.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  persist();
}
export function setTodoText(id, text) {
  const t = TODOS.items.find(x => x.id === id);
  const s = String(text || '').trim().slice(0, MAX_TEXT);
  if (!t || !s || t.text === s) return;
  t.text = s;
  persist();
}
export function setTodoDate(id, date) {
  const t = TODOS.items.find(x => x.id === id);
  if (!t || t.date === date) return;
  t.date = date;
  persist();
}
export function removeTodo(id) {
  const i = TODOS.items.findIndex(x => x.id === id);
  if (i < 0) return;
  TODOS.items.splice(i, 1);
  persist();
}
/** 清掉某一天已完成的；不传日期就是全站 */
export function clearDone(date) {
  const keep = TODOS.items.filter(t => !(t.done && (!date || t.date === date)));
  if (keep.length === TODOS.items.length) return 0;
  const n = TODOS.items.length - keep.length;
  TODOS.items = keep;
  persist();
  return n;
}

/* ---------- 备份 ---------- */
export function exportTodos() {
  return JSON.stringify({ app: 'geometry-lab', kind: 'todos', v: 1, at: new Date().toISOString(), items: TODOS.items }, null, 2);
}
/** 按 id 合并：同 id 以文件为准，新 id 追加。返回 {added, updated} */
export function importTodos(text) {
  const raw = JSON.parse(text);
  const list = normalize(raw);
  if (!list.length) throw new Error('这份文件里没有可用的待办');
  const at = new Map(TODOS.items.map(t => [t.id, t]));
  let added = 0, updated = 0;
  for (const it of list) {
    if (at.has(it.id)) { Object.assign(at.get(it.id), it); updated++; }
    else { TODOS.items.push(it); added++; }
  }
  TODOS.items.sort((a, b) => a.at - b.at);
  persist();
  return { added, updated };
}

/* 模块加载即读一次（FloatRail 要靠它显示今天还剩几项），并挂上跨标签页同步。
   监听只挂一次；热更新重复求值模块时用全局标记挡住重复注册。 */
loadTodos();
if (typeof window !== 'undefined' && !window.__glTodosBound) {
  window.__glTodosBound = true;
  window.addEventListener('storage', e => {
    if (e.key === KEY) loadTodos();
  });
}
