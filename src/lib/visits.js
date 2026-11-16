// 页面访问缓存（面包屑）：记下最近打开过的页面，给左上角的圆形按钮做跳转用。
// 只存路由路径，标题一律回到 modnav 的模块大纲里查——章名改了不用迁移旧档。
// 条数取 PREFS.visitCap（设置页可选 5 / 8 / 12 / 20，硬上限 MAX_VISITS）。
import { reactive } from 'vue';
import { PREFS } from './settings.js';
import { MODULES } from './modnav.js';
import { HIGHER_TITLE } from './higherplan.js';

const KEY = 'gl-visits';
export const MAX_VISITS = 20;

export const VISITS = reactive({ list: [] }); // [{ path, ts }]，最近的在前

const PAGE_TITLES = {
  '/': '首页',
  '/cheatsheet': '定理速查',
  '/playground': '自由画板',
  '/playground/about': '画板说明',
  '/playground/guide': '画板指南',
  '/notes': '笔记',
  '/settings': '设置',
  '/games': '数字游戏',
  '/games/2048': '2048',
  '/games/sudoku': '数独',
};

export function visitCap() {
  const n = parseInt(PREFS.visitCap, 10);
  const k = Number.isFinite(n) ? n : 8;
  return Math.max(1, Math.min(MAX_VISITS, k));
}

/** 组名形如「一　集合的语言」，面包屑里去掉前面的汉字序号 */
function groupName(t) {
  return String(t || '').replace(/^[一二三四五六七八九十]+[\s　]+/, '');
}

/** 路由路径 → 面包屑各段（模块 / 子专题 / 章节），查不到就给个兜底 */
export function infoOf(path) {
  const seg = String(path || '').split('/').filter(Boolean);
  const mod = seg.length ? MODULES[seg[0]] : null;
  if (mod) {
    const group = mod.groups.find(g => g.items.some(it => it.path === path));
    const item = group && group.items.find(it => it.path === path);
    if (item) {
      const no = String(group.items.indexOf(item) + 1).padStart(2, '0');
      return {
        mod: mod.t,
        group: groupName(group.t),
        title: item.t,
        no,
        modulePath: '/' + seg[0],
        kind: 'chapter',
      };
    }
    return { mod: mod.t, group: '', title: mod.t, no: '', modulePath: '/' + seg[0], kind: 'module' };
  }
  const planned = HIGHER_TITLE[path];
  return {
    // 高等数学的模块页只有大纲，还没进 modnav：标题从 higherplan 里取，副行标「高等数学」
    mod: planned ? '高等数学' : '',
    group: '',
    title: PAGE_TITLES[path] || planned || String(path || '未命名页面'),
    no: '',
    modulePath: '',
    kind: (PAGE_TITLES[path] || planned) ? 'page' : 'other',
  };
}

export function trimVisits() {
  const cap = visitCap();
  if (VISITS.list.length > cap) VISITS.list.splice(cap);
}

/** 记一次访问：同一路径只留最近一条 */
export function recordVisit(path) {
  if (!path) return;
  const i = VISITS.list.findIndex(v => v.path === path);
  if (i >= 0) VISITS.list.splice(i, 1);
  VISITS.list.unshift({ path, ts: Date.now() });
  trimVisits();
  persist();
}

export function clearVisits() {
  VISITS.list.splice(0);
  persist();
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(VISITS.list)); } catch (e) { /* 存不下不打断浏览 */ }
}

try {
  const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (Array.isArray(raw)) {
    VISITS.list = raw
      .filter(v => v && typeof v.path === 'string' && v.path)
      .map(v => ({ path: v.path, ts: Number(v.ts) || Date.now() }));
    trimVisits();
  }
} catch (e) { /* 脏档丢弃 */ }
