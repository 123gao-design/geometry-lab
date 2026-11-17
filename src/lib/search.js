/* 全站搜索：模块 / 子专题 / 章节（取自 modnav 的 MODULES）+ 定理速查 376 条（cheatindex.js）。
   两份数据都按需加载——第一次按 Ctrl+K 才取（速查那份约 117 kB，gzip 约 30 kB），首屏不背。
   匹配规则：标题完全/前缀/包含 > 速查原题 > 标签（J1 这类）> 子专题名 > 模块名 > 正文 > 公式源码；
   中文不切词，问句里随手敲的「余弦定理」直接按子串命中。 */

let INDEX = null;
let BUILDING = null;

export function loadIndex() {
  if (INDEX) return Promise.resolve(INDEX);
  if (!BUILDING) {
    BUILDING = Promise.all([import('./modnav.js'), import('./cheatindex.js')])
      .then(([nav, cheat]) => { INDEX = build(nav.MODULES, cheat.CHEAT_INDEX); return INDEX; })
      .catch(e => { BUILDING = null; throw e; });
  }
  return BUILDING;
}

export function indexReady() { return !!INDEX; }

const ROMAN = /^[一二三四五六七八九十]+　/;

function build(MODULES, CHEAT) {
  const rows = [];
  const byPath = new Map();
  for (const [mod, m] of Object.entries(MODULES || {})) {
    rows.push({ k: '模块', t: m.t, s: '', to: '/' + mod, d: '' });
    for (const g of m.groups || []) {
      const gname = String(g.t || '').replace(ROMAN, '');
      if (g.items && g.items[0]) rows.push({ k: '子专题', t: gname, s: m.t, to: g.items[0].path, d: '' });
      for (const it of g.items || []) {
        const row = { k: '章节', t: it.t, s: m.t, g: gname, to: it.path, d: '' };
        byPath.set(it.path, row);
        rows.push(row);
      }
    }
  }
  // 速查条目并进对应章节：章节名照旧用 nav 里的，速查的标题/正文/公式一起当检索语料
  for (const c of CHEAT || []) {
    const hit = byPath.get(c.to);
    if (hit) {
      hit.alt = c.t;
      hit.tag = c.tag;
      hit.d = c.d;
      hit.tex = c.tex;
    } else {
      rows.push({ k: '速查', t: c.t, s: c.sec, to: c.to, d: c.d, tex: c.tex, tag: c.tag });
    }
  }
  return rows;
}

/* 缩写式匹配：查询的字符按顺序出现在标题里就算沾边（「集运」→「集合的运算」） */
function subseq(text, q) {
  let i = 0;
  for (const ch of text) { if (ch === q[i]) i++; if (i === q.length) return true; }
  return q.length > 1 && i === q.length;
}

function scoreOf(it, q) {
  const t = (it.t || '').toLowerCase();
  if (t === q) return 120;
  if (t.startsWith(q)) return 100;
  if (t.includes(q)) return 80;
  if (it.alt && it.alt.toLowerCase().includes(q)) return 72;
  if (it.tag && it.tag.toLowerCase() === q) return 68;
  if (it.g && it.g.toLowerCase().includes(q)) return 42;
  if (it.s && it.s.toLowerCase().includes(q)) return 34;
  if (it.d && it.d.toLowerCase().includes(q)) return 28;
  if (it.tex && it.tex.some(x => x.toLowerCase().includes(q))) return 22;
  if (subseq(t, q)) return 12;
  return 0;
}

/** 多词按「全部命中」处理：每个词都要在某处找到，分数相加；返回前 n 条。 */
export function search(q, n = 14) {
  const raw = String(q || '').trim().toLowerCase();
  if (!raw || !INDEX) return [];
  const terms = raw.split(/\s+/).filter(Boolean);
  const hits = [];
  for (const it of INDEX) {
    let sum = 0, ok = true;
    for (const term of terms) {
      const s = scoreOf(it, term);
      if (!s) { ok = false; break; }
      sum += s;
    }
    if (ok) hits.push({ it, s: sum });
  }
  hits.sort((a, b) => b.s - a.s);
  return hits.slice(0, n).map(x => x.it);
}
