// 本地目录读写：用 File System Access API 让用户挑一个文件夹，句柄存 IndexedDB（句柄不能进 localStorage）。
// 浏览器不支持时（Firefox/Safari）fsSupported()===false，调用方退回「浏览器内保存 + 下载文件」。
const DB = 'gl-fs';
const ST = 'dirs';

export const fsSupported = () =>
  typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';

function openDB() {
  return new Promise((res, rej) => {
    if (typeof indexedDB === 'undefined') { rej(new Error('浏览器不支持 IndexedDB')); return; }
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(ST)) r.result.createObjectStore(ST); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function tx(mode, fn) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const t = db.transaction(ST, mode);
    const req = fn(t.objectStore(ST));
    t.oncomplete = () => res(req && req.result);
    t.onerror = () => rej(t.error);
  });
}

export const getHandle = kind => tx('readonly', s => s.get(kind));
export const dropHandle = kind => tx('readwrite', s => s.delete(kind));

/** 弹目录选择器；返回文件夹名。用户取消时抛 AbortError，调用方吞掉即可。 */
export async function pickDir(kind) {
  if (!fsSupported()) throw new Error('这个浏览器不支持选择文件夹');
  const h = await window.showDirectoryPicker({ id: 'gl-' + kind, mode: 'readwrite' });
  await tx('readwrite', s => s.put(h, kind));
  return h.name;
}

/** 句柄可能因刷新失效，用之前问一次权限（必须在用户点击的回调里调，才能弹授权框）。 */
export async function ensurePerm(handle) {
  if (!handle) return false;
  const q = handle.queryPermission ? await handle.queryPermission({ mode: 'readwrite' }) : 'granted';
  if (q === 'granted') return true;
  if (!handle.requestPermission) return false;
  return (await handle.requestPermission({ mode: 'readwrite' })) === 'granted';
}

/** 往 kind 目录写一个文本文件；返回「目录名/文件名」。 */
export async function writeInto(kind, name, text) {
  const h = await getHandle(kind);
  if (!h) throw new Error('还没有选保存目录');
  if (!(await ensurePerm(h))) throw new Error('没有目录写入权限');
  const fh = await h.getFileHandle(name, { create: true });
  const w = await fh.createWritable();
  await w.write(text);
  await w.close();
  return h.name + '/' + name;
}

/** 后台自动写文件用：只写权限已经授予的目录，绝不在用户手势之外弹授权框。
 *  返回「目录名/文件名」；没目录、没权限都静默返回 null。 */
export async function writeIfGranted(kind, name, text) {
  try {
    const h = await getHandle(kind);
    if (!h) return null;
    const q = h.queryPermission ? await h.queryPermission({ mode: 'readwrite' }) : 'granted';
    if (q !== 'granted') return null;
    const fh = await h.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(text);
    await w.close();
    return h.name + '/' + name;
  } catch (e) {
    return null;
  }
}

/** 删掉 kind 目录里的一个文件（笔记改标题后收走旧的那份用）；本来就没有也算删过。 */
export async function removeFrom(kind, name) {
  const h = await getHandle(kind);
  if (!h || !(await ensurePerm(h))) return false;
  try { await h.removeEntry(name); return true; } catch (_) { return false; }
}

/** 列出目录里的文件名（笔记页用来提示同名覆盖）。 */
export async function listInto(kind) {
  const h = await getHandle(kind);
  if (!h || !(await ensurePerm(h))) return [];
  const out = [];
  for await (const [name] of h.entries()) out.push(name);
  return out;
}

/** 浏览器内兜底：下载一个文本文件。 */
export function downloadText(name, text, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
