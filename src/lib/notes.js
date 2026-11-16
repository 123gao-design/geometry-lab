// 笔记：存 localStorage['gl-notes']。正文是原文（md 或 tex），渲染交给 mdmini / KaTeX，
// 目录里能写文件时另存一份到用户选的文件夹（见 fsdir.js）。
//
// 2026-11-12 起做成 wiki 结构：笔记可以归到文件夹里，章节页随手记的笔记另带
// path / page（来自哪一页），在侧栏里单列成「随页笔记」一组。旧档（只有 list/cur）自动迁移。
//
// 2026-11-16 补的三件事——localStorage 并不结实：配额满了会静默失败，清站点数据就全没，
// 两个标签页同时开还会互相盖：
//   ① 写失败说出来。SAVE 记下成败与时刻，笔记页上有一条状态，不再「以为存上了」；
//   ② 别的标签页动过存档就挂个提示，由用户决定要不要按存档重读，不悄悄刷新；
//   ③ 选过笔记文件夹以后，停手一会儿自动把改过的那几篇写成 .md / .tex，不再只靠按钮；
//      另给整份 JSON 的备份与导入，换机器也能带走。
import { reactive } from 'vue';
import { PREFS } from './settings.js';
import { fsSupported, getHandle, ensurePerm, writeInto, removeFrom, downloadText } from './fsdir.js';

const KEY = 'gl-notes';
const KIND = 'note';   // 与设置页「笔记保存目录」同一个句柄（fsdir.js 的 pickDir('note')）

export const NOTES = reactive({
  folders: [], // [{ id, name }]
  list: [],    // [{ id, title, format:'md'|'tex', content, ts, folder, path, page, file }]
  cur: '',
});

/** 本地存档的实况，给界面看：ok=false 时 err 里是原因，at 是最后一次写成功的时刻 */
export const SAVE = reactive({ ok: true, at: 0, err: '', other: false });

/** 自动落文件的实况：where 是「目录名/文件名」，err 是没写成的说法 */
export const FILESAVE = reactive({ where: '', at: 0, err: '' });

// 等会儿要写进文件夹的那几篇（按 id 记），以及那一轮的定时器
const pending = new Set();
let ftimer = null;

const str = v => String(v == null ? '' : v);

export function loadNotes() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw) return;
    const folders = Array.isArray(raw.folders) ? raw.folders : [];
    NOTES.folders = folders
      .filter(f => f && f.id)
      .map(f => ({ id: String(f.id), name: str(f.name || '未命名文件夹') }));
    const ids = new Set(NOTES.folders.map(f => f.id));
    const list = Array.isArray(raw.list) ? raw.list : [];
    NOTES.list = list.filter(n => n && n.id).map(n => ({
      id: String(n.id),
      title: str(n.title || '未命名笔记'),
      format: n.format === 'tex' ? 'tex' : 'md',
      content: str(n.content),
      ts: Number(n.ts) || Date.now(),
      folder: ids.has(str(n.folder)) ? str(n.folder) : '',
      path: str(n.path),
      page: str(n.page),
      file: str(n.file),   // 上次写进文件夹用的文件名，标题改了要拿它收走旧文件
    }));
    NOTES.cur = NOTES.list.some(n => n.id === raw.cur) ? raw.cur : (NOTES.list[0] ? NOTES.list[0].id : '');
  } catch (e) { /* 脏档丢弃 */ }
}

let timer = null;
export function persistNotes(now = false) {
  clearTimeout(timer);
  const write = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        v: 2, folders: NOTES.folders, list: NOTES.list, cur: NOTES.cur,
      }));
      SAVE.ok = true;
      SAVE.err = '';
      SAVE.at = Date.now();
    } catch (e) {
      // 配额满、隐私模式禁写都会抛：不吭声的话用户会当它存上了。编辑本身不受影响，照旧能继续打字
      SAVE.ok = false;
      SAVE.err = e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        ? '浏览器本地空间已满，这篇没存进去'
        : '浏览器不给写本地存档，这篇没存进去';
    }
  };
  if (now) write(); else timer = setTimeout(write, 300);
}

// 另一个标签页写了同一个键：不悄悄覆盖，也不悄悄刷新，先把这事挂到界面上，由用户点一下重读
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (ev) => {
    if (ev.key === KEY || ev.key === null) SAVE.other = true;
  });
}

/** 丢掉内存里的这份、按本地存档重读（「另一个标签页改过」时点的那一下） */
export function reloadNotes() {
  NOTES.folders = [];
  NOTES.list = [];
  NOTES.cur = '';
  loadNotes();
  SAVE.other = false;
}

export function getNote(id = NOTES.cur) {
  return NOTES.list.find(n => n.id === id) || null;
}

export function createNote(format = 'md', opts = {}) {
  const id = 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const n = {
    id,
    title: opts.title || '未命名笔记',
    format: format === 'tex' ? 'tex' : 'md',
    content: opts.content != null ? str(opts.content) : (format === 'tex' ? '\\section{新笔记}\n\n' : '# 新笔记\n\n'),
    ts: Date.now(),
    folder: str(opts.folder),
    path: str(opts.path),
    page: str(opts.page),
    file: '',
  };
  NOTES.list.unshift(n);
  NOTES.cur = id;
  persistNotes(true);
  queueFileWrite(id);
  return n;
}

export function updateNote(id, patch) {
  const n = getNote(id);
  if (!n) return;
  Object.assign(n, patch);
  n.ts = Date.now();
  persistNotes();
  queueFileWrite(id);
}

export function removeNote(id) {
  const i = NOTES.list.findIndex(n => n.id === id);
  if (i < 0) return;
  pending.delete(id);   // 删掉的别再往文件夹里写
  NOTES.list.splice(i, 1);
  if (NOTES.cur === id) NOTES.cur = NOTES.list[0] ? NOTES.list[0].id : '';
  persistNotes(true);
}

/* ---------- 自动写到文件夹 ---------- */
/* 停手 1.6 秒就把改过的那几篇写进用户选的目录。设置里关掉、浏览器不给文件夹权限、
   或者压根没选目录时，这里什么都不做——浏览器内的存档是另一条路，不受影响。 */

function queueFileWrite(id) {
  if (!id || PREFS.noteAuto === 'off' || !fsSupported()) return;
  pending.add(id);
  clearTimeout(ftimer);
  ftimer = setTimeout(() => { flushFiles(); }, 1600);
}

/** 把攒着的几篇一次写掉（切走页面、离开笔记页时调） */
export async function flushFiles() {
  if (!pending.size) return;
  const ids = [...pending];
  pending.clear();
  for (const id of ids) {
    if (getNote(id)) await flushFile(id);   // 中途被删掉的跳过
  }
}

/**
 * 把一篇写进文件夹，返回「目录名/文件名」；没选目录就返回 ''。
 * 目录权限得在用户点过的回调里才问得下来（ensurePerm），自动保存时问不到就当作这次没成，
 * 界面上留一句话，用户点一下「存到文件夹」就续上了。
 */
export async function flushFile(id = NOTES.cur) {
  const n = getNote(id);
  if (!n || !fsSupported()) return '';
  try {
    const h = await getHandle(KIND);
    if (!h) { FILESAVE.where = ''; FILESAVE.err = ''; return ''; }
    if (!(await ensurePerm(h))) {
      FILESAVE.err = '文件夹权限过期了，点一下「存到文件夹」续上';
      return '';
    }
    const name = fileName(n);
    await writeInto(KIND, name, n.content);
    // 标题改过：新文件已经写好，按上次的名字把旧的那份收走，别在目录里留两份
    if (n.file && n.file !== name) {
      try { await removeFrom(KIND, n.file); } catch (_) { /* 收不走就留着 */ }
    }
    if (n.file !== name) { n.file = name; persistNotes(true); }
    FILESAVE.where = h.name + '/' + name;
    FILESAVE.at = Date.now();
    FILESAVE.err = '';
    return FILESAVE.where;
  } catch (e) {
    FILESAVE.err = '写文件没成：' + ((e && (e.message || e)) || '原因不明');
    return '';
  }
}

// 切走页面 / 切到后台：把攒着的写掉。浏览器一般会给这几毫秒写完，剩下的下次打开还在本地存档里
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      persistNotes(true);
      flushFiles();
    }
  });
}

/* ---------- 整份备份 ---------- */

/** 全部笔记打成一个对象（导出与导入都用这个形状） */
export function backupOf() {
  return { app: 'geometry-lab-notes', v: 2, at: Date.now(), folders: NOTES.folders, list: NOTES.list, cur: NOTES.cur };
}

/** 导出整份 JSON 备份，返回文件名 */
export function exportAll() {
  const d = new Date();
  const p2 = v => String(v).padStart(2, '0');
  const name = `笔记备份-${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.json`;
  downloadText(name, JSON.stringify(backupOf(), null, 2), 'application/json;charset=utf-8');
  return name;
}

/** 导入备份：按 id 合并，同一个 id 以文件里的为准；返回 { added, updated } 让界面报个数 */
export function importAll(text) {
  let raw = null;
  try { raw = JSON.parse(String(text || '')); } catch (e) { throw new Error('这不是一个 JSON 文件'); }
  if (!raw || !Array.isArray(raw.list)) throw new Error('里面没有笔记列表，可能不是这里导出的备份');
  // 文件夹先合并：笔记的 folder 指向它，缺了新笔记会掉进未分类
  const have = new Set(NOTES.folders.map(f => f.id));
  for (const f of (Array.isArray(raw.folders) ? raw.folders : [])) {
    if (!f || !f.id || have.has(String(f.id))) continue;
    NOTES.folders.push({ id: String(f.id), name: str(f.name || '未命名文件夹') });
    have.add(String(f.id));
  }
  const byId = new Map(NOTES.list.map(n => [n.id, n]));
  let added = 0;
  let updated = 0;
  for (const r of raw.list) {
    if (!r || !r.id) continue;
    const one = {
      id: String(r.id),
      title: str(r.title || '未命名笔记'),
      format: r.format === 'tex' ? 'tex' : 'md',
      content: str(r.content),
      ts: Number(r.ts) || Date.now(),
      folder: have.has(str(r.folder)) ? str(r.folder) : '',
      path: str(r.path),
      page: str(r.page),
      // 备份里的 file 是那台机器上写过的文件名，到这边不算数：清空，免得下次改名去删本机同名的另一份
      file: '',
    };
    const old = byId.get(one.id);
    if (old) { Object.assign(old, one); updated++; }
    else { NOTES.list.push(one); byId.set(one.id, one); added++; }
  }
  if (!NOTES.cur && NOTES.list.length) NOTES.cur = NOTES.list[0].id;
  persistNotes(true);
  return { added, updated };
}

/* ---------- 文件夹 ---------- */

export function getFolder(id) {
  return NOTES.folders.find(f => f.id === id) || null;
}

export function createFolder(name) {
  const t = str(name).trim();
  if (!t) return null;
  const dup = NOTES.folders.find(f => f.name === t);
  if (dup) return dup;
  const f = { id: 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4), name: t.slice(0, 24) };
  NOTES.folders.push(f);
  persistNotes(true);
  return f;
}

export function renameFolder(id, name) {
  const f = getFolder(id);
  const t = str(name).trim();
  if (!f || !t) return;
  f.name = t.slice(0, 24);
  persistNotes(true);
}

export function removeFolder(id) {
  const i = NOTES.folders.findIndex(f => f.id === id);
  if (i < 0) return;
  NOTES.folders.splice(i, 1);
  NOTES.list.forEach(n => { if (n.folder === id) n.folder = ''; });
  persistNotes(true);
}

export function moveNote(id, folder) {
  const n = getNote(id);
  if (!n) return;
  n.folder = getFolder(folder) ? folder : '';
  persistNotes(true);
}

/** 某一组的笔记，新的在前 */
export function notesIn(folder) {
  return NOTES.list.filter(n => (n.folder || '') === folder).sort((a, b) => b.ts - a.ts);
}

/** 从具体页面记的笔记（带 path），统一收在「随页笔记」组里 */
export function pageNotes() {
  return NOTES.list.filter(n => n.path).sort((a, b) => b.ts - a.ts);
}

/** 某一页的笔记 */
export function notesOfPage(path) {
  return NOTES.list.filter(n => n.path && n.path === path).sort((a, b) => b.ts - a.ts);
}

/** 文件名：去掉路径分隔符与 Windows 保留字符 */
export function fileName(note) {
  const base = String(note.title || '未命名笔记').replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim().slice(0, 60) || '未命名笔记';
  return base + (note.format === 'tex' ? '.tex' : '.md');
}

loadNotes();
