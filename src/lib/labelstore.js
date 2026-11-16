/* ================= 板内文字位置存档 =================
   两层：① 默认档——站点目录 public/ 下的 JSON（默认 lbl-default.json），每次打开站点先读它，
   部署到新机器即带一套初始位置；② 本机档——localStorage 'gl-lbl'，记用户自己拖过的位移，
   同「页面 → 画板 → 标签」以本机档覆盖默认档。
   坐标是各标签相对自然位置的位移（不是绝对坐标），所以文字随参数换位置后照样对得上。
   board.js 负责读写，设置页负责开关、更新默认档、导出 / 导入 / 清除本机档。 */
export const LBL_KEY = 'gl-lbl';

let DEFAULTS = {}; // 默认档（从 JSON 读进来的整份对象）

export function readLabels() {
  try { return JSON.parse(localStorage.getItem(LBL_KEY) || '{}') || {}; } catch (_) { return {}; }
}

export function writeLabels(o) {
  try { localStorage.setItem(LBL_KEY, JSON.stringify(o || {})); return true; } catch (_) { return false; }
}

export function clearLabels() {
  try { localStorage.removeItem(LBL_KEY); return true; } catch (_) { return false; }
}

/** 默认档路径 → 实际取文件的地址（相对站点根目录，构建产物放到 dist 根） */
export function defaultUrl(p) {
  let rel = String(p || '').trim().replace(/\\/g, '/').replace(/^\.?\//, '').replace(/^public\//, '');
  if (!rel || rel.includes('..') || !/\.json$/i.test(rel)) rel = 'lbl-default.json';
  let base = './';
  try { base = import.meta.env.BASE_URL || './'; } catch (_) { base = './'; }
  return base + rel;
}

/** 启动时读默认档；读不到（构建后没放文件、file:// 打开、网络错）就按空档走，不影响页面 */
export async function loadDefaultLabels(url) {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) return false;
    const data = await r.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    DEFAULTS = data;
    return true;
  } catch (_) { return false; }
}

export function setDefaultLabels(o) {
  DEFAULTS = o && typeof o === 'object' && !Array.isArray(o) ? o : {};
}

export function defaultsSnapshot() { return DEFAULTS; }

/** 某块板的默认位移：{ 键: {dx,dy} } */
export function defaultBoard(page, qid) {
  const out = {};
  const p = DEFAULTS && DEFAULTS[page] && DEFAULTS[page][qid];
  if (!p || typeof p !== 'object') return out;
  for (const k in p) {
    const v = p[k];
    if (Array.isArray(v) && v.length === 2) out[k] = { dx: +v[0] || 0, dy: +v[1] || 0 };
  }
  return out;
}

/** 两层合成：默认档打底，本机档按「页 → 板 → 键」逐层覆盖 */
export function effectiveLabels() {
  const out = {};
  const put = (src, base) => {
    if (!src || typeof src !== 'object') return;
    for (const page in src) {
      const ps = src[page];
      if (!ps || typeof ps !== 'object') continue;
      const pd = base[page] || (base[page] = {});
      for (const qid in ps) {
        const qs = ps[qid];
        if (!qs || typeof qs !== 'object') continue;
        const qd = pd[qid] || (pd[qid] = {});
        for (const k in qs) if (Array.isArray(qs[k]) && qs[k].length === 2) qd[k] = qs[k];
      }
    }
  };
  put(DEFAULTS, out);
  put(readLabels(), out);
  return out;
}

/** 存档里有记录的画板块数（按「页面 + 板号」算，设置页拿来报数） */
export function countBoards(store) {
  const s = store || readLabels();
  let n = 0;
  for (const page in s) {
    const p = s[page];
    if (p && typeof p === 'object') n += Object.keys(p).length;
  }
  return n;
}

/** 把导入的存档并进本机：同页同板同标签以导入的为准，其余原样保留 */
export function mergeLabels(cur, incoming) {
  const out = cur && typeof cur === 'object' ? cur : {};
  if (!incoming || typeof incoming !== 'object') return out;
  for (const page in incoming) {
    const src = incoming[page];
    if (!src || typeof src !== 'object') continue;
    const dst = out[page] || (out[page] = {});
    for (const qid in src) {
      const q = src[qid];
      if (!q || typeof q !== 'object') continue;
      const tgt = dst[qid] || (dst[qid] = {});
      for (const k in q) if (Array.isArray(q[k]) && q[k].length === 2) tgt[k] = q[k];
    }
  }
  return out;
}
