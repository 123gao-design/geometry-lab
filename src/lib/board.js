/* ================= SVG 画板引擎 + 主题系统 ================= */
import katex from 'katex';
import { watch } from 'vue';
import { THEMES, themeOf, currentTheme, isLight, applyTheme, initTheme, mountThemeButton, animEnabled, setAnim, initAnim, onThemeChange } from './theme.js';
import { V, extSeg, fmt } from './math.js';
import { openGGB, setActiveOutlet, clearActiveOutlet } from './ggb.js';
import { recordBoard } from './record.js';
import { readLabels, writeLabels, defaultBoard } from './labelstore.js';
import { loadInk, saveInk, nearPolyline, recognizeShape, pointInPolygon, bboxOf } from './ink.js';
import { setBoardContextProvider } from './boardctx.js';
import { PREFS, setPref } from './settings.js';
/* 板面纸色的八档预设与物理画板共用一张表（lib/papers.js，纯数据、没有依赖） */
import { PAPERS as PAPER_SET } from './papers.js';
export * from './math.js'; // 画板模块统一从 board.js 导入数学工具
// 主题与光影的实现已挪到 theme.js（首屏不该为它拖整个引擎），这里转出去，老路子的 import 照旧可用
export { THEMES, themeOf, currentTheme, isLight, applyTheme, initTheme, mountThemeButton, animEnabled, setAnim, initAnim, onThemeChange } from './theme.js';

const SVGNS = 'http://www.w3.org/2000/svg';

/* 橡皮的鼠标样式：自己画一枚斜橡皮，热点在笔尖（7,21）。浏览器自带的十字看不出「这会儿是在擦」 */
const ERASER_CURSOR = (() => {
  const body = 'M10.6 20.5 5.6 15.5a1.8 1.8 0 0 1 0-2.5l7.2-7.2a1.8 1.8 0 0 1 2.5 0l5 5a1.8 1.8 0 0 1 0 2.5l-7 7h-2.7z';
  const seam = 'M8.6 12.6l5.4 5.4';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">'
    + '<g fill="none" stroke="#fff" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + body + '"/><path d="' + seam + '"/></g>'
    + '<g fill="none" stroke="#2b3a4f" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="' + body + '"/><path d="' + seam + '"/></g>'
    + '</svg>';
  return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '") 7 21, cell';
})();

/** 语义色 → 当前主题色映射表（[暗, 亮]，亮色为学术纸面风） */
export const COLOR = {
  '#5cadff': ['#5cadff', '#2166b0'], '#4ade80': ['#4ade80', '#1e8a4c'],
  '#ff9e4a': ['#ff9e4a', '#d4761c'], '#ffd166': ['#ffd166', '#b8860b'],
  '#ff7b8a': ['#ff7b8a', '#c94055'], '#c084fc': ['#c084fc', '#7d55c4'],
  '#67e8f9': ['#67e8f9', '#12808f'], '#fff': ['#ffffff', '#232a35'],
  '#0a0d14': ['#0a0d14', '#fdfcf8'], '#3f5f8f': ['#3f5f8f', '#5a7fae'],
  // 极点 / 原点的实心点：浅色主题画黑、暗色主题画浅，两种底色上都看得清
  '#12161f': ['#e8eefc', '#12161f'],
  '#22314a': ['#22314a', '#ded8ca'], '#2e3d57': ['#2e3d57', '#d5cfc2'],
  '#3a4a63': ['#3a4a63', '#ccc5b6'], '#2c3b53': ['#2c3b53', '#c8c1b1'],
  '#1f2a3a': ['#1f2a3a', '#d8d2c2'], '#2b4260': ['#2b4260', '#9db4c9'],
  '#2b6f7f': ['#2b6f7f', '#4f7f8c'], '#5c6a80': ['#5c6a80', '#6e7887'],
  '#93a1b5': ['#93a1b5', '#5f6b7a'], '#8fa3bd': ['#8fa3bd', '#6e7887'],
  '#aebdd2': ['#aebdd2', '#4d5766'], '#7a5a30': ['#7a5a30', '#a08250'],
  '#8a6a3a': ['#8a6a3a', '#a08250'], '#a06226': ['#a06226', '#b08642'],
  'rgba(92,173,255,.05)': ['rgba(92,173,255,.05)', 'rgba(33,102,176,.07)'],
  'rgba(255,158,74,.07)': ['rgba(255,158,74,.07)', 'rgba(212,118,28,.09)'],
  'rgba(255,158,74,.5)': ['rgba(255,158,74,.5)', 'rgba(176,134,66,.55)'],
  'rgba(103,232,249,.045)': ['rgba(103,232,249,.045)', 'rgba(18,128,143,.06)'],
  'rgba(139,163,189,.05)': ['rgba(139,163,189,.05)', 'rgba(77,87,102,.05)'],
  'rgba(139,163,189,.35)': ['rgba(139,163,189,.35)', 'rgba(77,87,102,.45)'],
  'rgba(255,209,102,.55)': ['rgba(255,209,102,.55)', 'rgba(184,134,11,.45)'],
};
/* 板面自选了纸色时，语义色的亮/暗家族未必跟页面主题是一家（浅色主题下也能选深纸）：
   render() 期间把这一块板要用的家族放到 FAM_LIGHT 上，null 表示跟页面主题走，画完再交还 */
let FAM_LIGHT = null;
function paint(c) {
  const m = COLOR[c];
  if (!m) return c;
  const light = FAM_LIGHT == null ? document.documentElement.classList.contains('light') : FAM_LIGHT;
  return light ? m[1] : m[0];
}

/* 线条粗细倍率：所有经 mk() 画的元素统一乘 PREFS.boardLineW（默认 1，原样）。
   设成 1.0 之外的档时，500 多处硬编码的 stroke-width 不用逐个改；
   attrs.__lw === 'abs' 的那一笔不吃倍率（坐标轴线宽是绝对值，勾股线号一类也照此办）。
   批注墨迹、选区块、把手这些自己 setAttribute 的地方不走这里，粗细仍按笔宽走。 */
export function mk(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  const absW = attrs.__lw === 'abs';
  for (const k in attrs) {
    if (k === '__lw') continue;
    let v = attrs[k];
    if (k === 'fill' || k === 'stroke') v = paint(v);
    if (k === 'stroke-width' && !absW) {
      const n = parseFloat(v);
      if (isFinite(n) && n > 0 && PREFS.boardLineW !== 1) v = Math.round(n * PREFS.boardLineW * 100) / 100;
    }
    // text: 一律过 fillRuns —— 数字 / 字母 / 公式排成 KaTeX 字族，汉字仍走系统字体（见 mathRuns）
    k === 'text' ? fillRuns(e, v) : e.setAttribute(k, v);
  }
  if (parent) parent.appendChild(e);
  return e;
}

export function hEl(tag, attrs = {}, parent) { // HTML 控件（按钮/滑块/徽章）
  const e = document.createElement(tag);
  for (const k in attrs) { k === 'style' ? (e.style.cssText = attrs[k]) : e.setAttribute(k, attrs[k]); }
  if (parent) parent.appendChild(e);
  return e;
}

/* 批注用到的小工具：坐标取一位小数、两条线段是否相交（框选时判横穿而过的一笔） */
const r1 = v => Math.round(v * 10) / 10;
function xCross(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
function segCross(a, b, c, d) {
  const d1 = xCross(c, d, a), d2 = xCross(c, d, b), d3 = xCross(a, b, c), d4 = xCross(a, b, d);
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
}
/** 线段 a→b 与 c→d 的交点参数 t（沿 a→b，落在 (0,1) 内才认；平行 / 不相交返回 -1）。剪选套索用 */
function segT(a, b, c, d) {
  const rx = b.x - a.x, ry = b.y - a.y, sx = d.x - c.x, sy = d.y - c.y;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-9) return -1;
  const t = ((c.x - a.x) * sy - (c.y - a.y) * sx) / den;
  const u = ((c.x - a.x) * ry - (c.y - a.y) * rx) / den;
  return t > 0 && t < 1 && u >= 0 && u <= 1 ? t : -1;
}

/* ---------- KaTeX 公式混排（按钮 / 徽章 / 画板公式统一走这里） ----------
   字符串里 '$…$' 段落交 KaTeX 渲染（√、上标、分数、±、≠ 等无需再用普通字符拼合），其余按纯文本（HTML 转义）；
   无 '$' 的字符串原样返回 —— btnM/chipM 可无脑替换 btn/chip。tex 内不能出现中文（SFC 坑，中文放 $ 外面）。 */
const TEX_CACHE = new Map();
// 先解开历史遗留的 HTML 实体（视图数据串里有 'a&gt;0' 一类），再按纯文本转义 —— 双保险：raw 与已编码两种写法都渲染正确
const esc = t => String(t).replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[e])).replace(/&/g, '&amp;').replace(/</g, '&lt;');
export function texMix(s) {
  if (!s.includes('$')) return esc(s);
  if (TEX_CACHE.has(s)) return TEX_CACHE.get(s);
  let html = '';
  s.split('$').forEach((seg, i) => { html += i % 2 ? katex.renderToString(seg, { throwOnError: false }) : esc(seg); });
  if (TEX_CACHE.size > 600) TEX_CACHE.clear();   // 扫描动画每帧变数：达到最大防泄漏
  TEX_CACHE.set(s, html);
  return html;
}
/** 当前主题的正文墨色（画板内 foreignObject 公式用：CSS 变量在导出克隆里解析不了，须落成具体色） */
export function inkCol() { return document.documentElement.classList.contains('light') ? '#20293a' : '#e8eef7'; }

/* ---------- 板内文字走 KaTeX 的字族（与物理画板同一套口径） ----------
   数学画板上的数字、拉丁字母、希腊字母与运算符一律排成 KaTeX 的字形：数字、运算符与单位
   用 KaTeX_Main 正体，变量字母与希腊字母用 KaTeX_Math 斜体，sin / cos / ln 这类函数名与
   常数排正体；汉字与中文标点 KaTeX 字族没有字形，仍走系统无衬线。上下标（₂ ² 与 _{…} ^{…}）
   排成真正的小一号小字、压低 0.2 字高 / 抬高 0.36 字高，与正文里的 KaTeX 公式是一路样子。
   整条字符串先切成「字族 + 上下标档」相同的连续几段，B.text 再逐段落成 tspan。 */
const K_SANS = "-apple-system,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif";
const K_MAIN = "'KaTeX_Main','Latin Modern Math','Times New Roman',serif";
const K_MATH = "'KaTeX_Math','KaTeX_Main','Times New Roman',serif";
const HAS_CJK = /[⺀-鿿豈-﫿＀-￯]/;
const GREEK_RE = /[Ͱ-Ͽ]/;
const LATIN_RE = /[A-Za-z]/;
/* 可以交给 KaTeX 字族的符号：四则、比较、括号、逗号句点、单位与常用数学记号。
   不在表里的字符（汉字、①、⊗、emoji 一类）一律退回系统字体，免得缺字形画成方框 */
const MATH_PUNCT = /[0-9+\-=<>≤≥≈≠±×÷·⋅()\[\]{}|.,:;!?%°′″/√∞∈∉⊂⊆∪∩→←↔⇒⇔∠△⊥∥−]/;
const WS_RE = /\s/;

/* 上下标：Unicode 的 ₀ ₁ ² 与 ^{…} / _{…} 标记都展开成 { c, lv }（−1 下标 / 0 常规 / 1 上标） */
const SUB_MAP = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '₊': '+', '₋': '−', '₌': '=', '₍': '(', '₎': ')', 'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x',
};
const SUP_MAP = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '−', '⁼': '=', '⁽': '(', '⁾': ')', 'ⁿ': 'n',
};
/* 排正体的函数名与常数；别的一串字母按 LaTeX 的规矩拆成一个个斜体变量（gt² 是 g·t 的平方） */
const UP_WORDS = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos', 'arctan',
  'sinh', 'cosh', 'tanh', 'ln', 'log', 'lg', 'exp', 'lim', 'max', 'min', 'det', 'const',
]);
function scriptTokens(text) {
  const out = [];
  for (let k = 0; k < text.length; k++) {
    const ch = text[k];
    if ((ch === '^' || ch === '_') && k + 1 < text.length) {
      const lv = ch === '^' ? 1 : -1;
      if (text[k + 1] === '{') {
        const end = text.indexOf('}', k + 2);
        if (end > k + 1) {
          for (const c of text.slice(k + 2, end)) out.push({ c, lv });
          k = end;
          continue;
        }
      } else if (!WS_RE.test(text[k + 1])) {
        out.push({ c: text[k + 1], lv }); k += 1; continue;
      }
    }
    if (SUB_MAP[ch]) { out.push({ c: SUB_MAP[ch], lv: -1 }); continue; }
    if (SUP_MAP[ch]) { out.push({ c: SUP_MAP[ch], lv: 1 }); continue; }
    out.push({ c: ch, lv: 0 });
  }
  return out;
}
/* 一个字符归哪一族：汉字 / 中文标点 → 系统无衬线；空格跟着前一段走；
   字母 → 函数名与常数正体、其余按斜体变量（希腊字母一律按变量）；数字与运算符 → 数学正体 */
function classify(toks) {
  const kinds = new Array(toks.length);
  for (let k = 0; k < toks.length; k++) {
    const c = toks[k].c;
    if (WS_RE.test(c)) { kinds[k] = k > 0 ? kinds[k - 1] : 'math'; continue; }
    if (HAS_CJK.test(c)) { kinds[k] = 'cjk'; continue; }
    /* 希腊字母按变量排斜体；数字、运算符与单位排 KaTeX_Main 正体（KaTeX_Math 里没有数字字形，
       早先一并归成 var 只能靠字体回退，正体字其实来自链上的 KaTeX_Main）；其余怪字符退回系统字体 */
    if (!LATIN_RE.test(c)) { kinds[k] = GREEK_RE.test(c) ? 'var' : MATH_PUNCT.test(c) ? 'math' : 'cjk'; continue; }
    let a = k, b = k;
    while (a > 0 && LATIN_RE.test(toks[a - 1].c)) a--;
    while (b < toks.length - 1 && LATIN_RE.test(toks[b + 1].c)) b++;
    let word = '';
    for (let j = a; j <= b; j++) word += toks[j].c;
    kinds[k] = UP_WORDS.has(word.toLowerCase()) ? 'math' : 'var';
  }
  return kinds;
}
const K_FAM = { cjk: K_SANS, var: K_MATH, math: K_MAIN };
/* 切段：返回 [{ s, fam, size, dy }]；整条都是汉字时返回 null（不必落 tspan，保持原来的纯文本）。
   size / dy 一律是像素，按板内实际字号 base（12 × 字号倍率）现算 */
function mathRuns(text, base) {
  const toks = scriptTokens(text);
  const kinds = classify(toks);
  const out = [];
  for (let k = 0; k < toks.length; k++) {
    const tk = toks[k], kind = kinds[k];
    const size = tk.lv ? Math.round(base * 0.7 * 100) / 100 : base;
    const dy = tk.lv > 0 ? -base * 0.36 : tk.lv < 0 ? base * 0.2 : 0;
    const last = out[out.length - 1];
    if (last && last.kind === kind && last.lv === tk.lv) last.s += tk.c;
    else out.push({ kind, lv: tk.lv, s: tk.c, fam: K_FAM[kind], size, dy });
  }
  if (out.every(r => r.kind === 'cjk' && !r.lv)) return null;
  return out;
}
/* 板内字号：global.css 的 svg text 规则读 --bd-fs（默认 12px），这里按倍率写进板根 */
const boardFontPx = () => Math.round(12 * (PREFS.boardFont || 1) * 100) / 100;

/* 切段结果缓存：动画板每帧重画，同一条标签会反复切（键里带字号，换倍率自然失效） */
const _runCache = new Map();
function mathRunsCached(text, base) {
  const key = base + '|' + text;
  let r = _runCache.get(key);
  if (r === undefined) {
    r = mathRuns(text, base);
    if (_runCache.size > 4000) _runCache.clear();
    _runCache.set(key, r);
  }
  return r;
}
/* 把一串文字落进 <text>：按切段结果逐段写 tspan（字族 + 字号 + 上下标位移）。
   整条都是汉字（或空串）时不开 tspan，直接 textContent —— 与原来的画法一模一样。
   注意 tspan 的 font-size 必须写成像素：svg text 的 CSS 规则把字号钉在 --bd-fs，
   而上下标的 dy 用的是像素差量，若字号走 em 就会把位移一起缩放、上下标贴不住基线。 */
function fillRuns(el, s, base) {
  const str = s == null ? '' : String(s);
  const runs = mathRunsCached(str, base || boardFontPx());
  if (!runs) { el.textContent = str; return el; }
  el.textContent = '';
  let cur = 0;
  for (const r of runs) {
    const t = mk('tspan', { 'font-family': r.fam, 'font-size': r.size }, el);
    const d = r.dy - cur;
    if (d) t.setAttribute('dy', Math.round(d * 100) / 100);
    cur = r.dy;
    t.textContent = r.s;
  }
  return el;
}

/* ---------- 批注调色板：颜色解析 + 「最近用过」缓存 ----------
   调色板里既能点色卡、用系统取色器，也能手输 #rgb / #rrggbb / rgb() / rgba() / hsl() / hsla()，
   一律先规整成 #rrggbb 再存（SVG 的 stroke 属性只认这一种写法最省心）。用过的颜色记在 localStorage，
   最多 12 个，几个画板共用一份；上一次选的颜色另外记着，重开页面还是它。 */
const INKCOL_KEY = 'gl-ink-colors';
const INKCOL_LAST = 'gl-ink-color';
const HEX6 = /^#[0-9a-f]{6}$/i;
function inkRecent() {
  try {
    const a = JSON.parse(localStorage.getItem(INKCOL_KEY) || '[]');
    return Array.isArray(a) ? a.filter(v => typeof v === 'string' && HEX6.test(v)).slice(0, 12) : [];
  } catch (_) { return []; }
}
function inkRemember(c) {
  try {
    localStorage.setItem(INKCOL_LAST, c);
    const a = inkRecent().filter(v => v.toLowerCase() !== c.toLowerCase());
    a.unshift(c);
    localStorage.setItem(INKCOL_KEY, JSON.stringify(a.slice(0, 12)));
  } catch (_) { /* 隐私模式忽略 */ }
}
function inkLastColor() {
  try { const v = localStorage.getItem(INKCOL_LAST) || ''; return HEX6.test(v) ? v : ''; } catch (_) { return ''; }
}
const hx2 = n => ('0' + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2);
/** 把各种写法统一成 #rrggbb；认不出返回 null */
export function parseInkColor(s) {
  const str = String(s == null ? '' : s).trim().toLowerCase();
  if (!str) return null;
  if (/^#[0-9a-f]{3}$/.test(str)) return '#' + str[1] + str[1] + str[2] + str[2] + str[3] + str[3];
  if (HEX6.test(str)) return str;
  let m = str.match(/^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/);
  if (m) {
    const ch = x => (x.indexOf('%') >= 0 ? parseFloat(x) * 2.55 : parseFloat(x));
    return '#' + hx2(ch(m[1])) + hx2(ch(m[2])) + hx2(ch(m[3]));
  }
  m = str.match(/^hsla?\(\s*(-?[\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/);
  if (m) {
    const h = (((parseFloat(m[1]) % 360) + 360) % 360) / 360;
    const sat = parseFloat(m[2]) / 100, l = parseFloat(m[3]) / 100;
    const a = sat * Math.min(l, 1 - l);
    const f = n => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
    return '#' + hx2(f(0) * 255) + hx2(f(8) * 255) + hx2(f(4) * 255);
  }
  return null;
}

/* ---------- 导出用的 KaTeX 样式（PNG 与视频共用，只取一次） ----------
   B.tex 的公式是 foreignObject 里的 KaTeX HTML，脱离页面 CSS 会散架：注入 KaTeX 样式表，
   并把常用字体转成 base64 @font-face 追加（同名族覆盖相对路径的 url(fonts/…)；拿不到字体则退化为衬线体，排版结构不丢）。
   katex 资源走动态 import（?raw/?url 查询串在 Node 无头测试里解析不了 —— 测试从不导出，catch 掉即可）。
   逐帧录视频时每帧都要拼这段样式，所以必须缓存：字体 base64 动辄上百 KB，每帧重取会直接拖垮帧率。 */
let KATEX_CSS = null;
async function katexCss() {
  if (KATEX_CSS !== null) return KATEX_CSS;
  try {
    const css = await import('katex/dist/katex.min.css?raw');
    let extra = css.default;
    try {
      const { default: cssUrl } = await import('katex/dist/katex.min.css?url');
      // 常用字体 → data URI（族名/字重与 katex.min.css 里的声明对齐，靠「后定义覆盖」生效）
      const FONTS = [['KaTeX_Main-Regular', 'KaTeX_Main', ''], ['KaTeX_Main-Bold', 'KaTeX_Main', 'font-weight:bold'],
        ['KaTeX_Math-Italic', 'KaTeX_Math', 'font-style:italic'], ['KaTeX_AMS-Regular', 'KaTeX_AMS', ''],
        ['KaTeX_Size1-Regular', 'KaTeX_Size1', ''], ['KaTeX_Size2-Regular', 'KaTeX_Size2', ''], ['KaTeX_Size4-Regular', 'KaTeX_Size4', '']];
      for (const [file, fam, desc] of FONTS) {
        const res = await fetch(new URL('fonts/' + file + '.woff2', cssUrl));
        if (!res.ok) continue;
        const bytes = new Uint8Array(await res.arrayBuffer());
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
        extra += "@font-face{font-family:'" + fam + "';" + desc + "src:url(data:font/woff2;base64," + btoa(bin) + ") format('woff2')}";
      }
    } catch (_) { /* 字体取不到（file:// 等）：公式退化为衬线体 */
    }
    KATEX_CSS = extra;
  } catch (_) { /* 无头/受限环境：跳过公式样式注入 */
    KATEX_CSS = '';
  }
  return KATEX_CSS;
}

/* ---------- 主题 ----------
   八套主题的色表、切换与 🎨 选单都在 lib/theme.js —— 首屏只要主题，不该为此把画板引擎
   和 katex 一起拖进入口包。这里只留一处接线：换主题后让所有活着的板重画一遍。 */
export const BOARDS = [];
onThemeChange(() => BOARDS.forEach(b => b.render()));
/* 设置页「数学画板纸面」改了：全部板改回跟着这一项走（板内「▤ 外观」里单独点过的也就此交还），
   再整板重画一遍。没有这一条，改设置只会影响此后新建的板 */
watch(() => PREFS.boardPaper, () => {
  for (const b of BOARDS) b._tintUser = false;
  restyleAll();
});
/* 字号 / 线宽 / 轴宽改动后所有板都得重画一遍。滑块一次拖动会连发 input，
   攒到下一帧只重画一次，免得一页几块板一帧画几十遍 */
let _restyleQueued = false;
function restyleAll() {
  if (_restyleQueued) return;
  _restyleQueued = true;
  const run = () => {
    _restyleQueued = false;
    for (const b of BOARDS) { try { b.render(); } catch (_) { /* 某块板画崩不牵连其余 */ } }
  };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
  else setTimeout(run, 16);
}
/* 画板缩放范围：1 = 原样；下限 0.4（画面缩到四成、四周自然留白），上限 6 */
const ZMIN = 0.4, ZMAX = 6;
const clampR = (v, a, b) => Math.max(Math.min(a, b), Math.min(Math.max(a, b), v)); // 两端大小颠倒也成立

/* 每块板可自选的纸面：用 lib/papers.js 里那一张表（与物理画板共用，主题那一档在面板里另算）。
   每档带着自己的底色、墨色与亮/暗家族——浅纸配深墨、深纸配浅墨，深纸的语义色改取 COLOR 表里
   暗色家族那一列，所以浅色主题下选了「深板岩」，图形与读数照样压得住。整站主题仍归顶栏 🎨，
   这里只改这一块板。 */
const LIGHT_PAPERS = { paper: 1, sand: 1, mint: 1, sakura: 1 };
const TINTS = ['paper', 'sand', 'mint', 'sakura', 'slate', 'abyss', 'forest', 'plum'].map(id => {
  const p = PAPER_SET.find(x => x.id === id) || {};
  const sw = p.sw || ['#ffffff', '#dddddd'];
  return {
    id, n: p.t || id, c: p.paper || sw[0], ink: p.ink || '',
    light: !!LIGHT_PAPERS[id],
    sw0: sw[0], sw1: sw[1],
    skin: p.skin || '',   // 纸面的斜向渐变（物理板当 --pb-skin 用，数学板当 --bd-skin），小样照它画
  };
});
/* 小样直接就是这一档的纸面本身（与板上的渐变逐字一致），没有渐变的档退回双色各半 */
const tintChip = x => x.skin || ('linear-gradient(140deg,' + x.sw0 + ' 0%,' + x.sw0 + ' 46%,'
  + x.sw1 + ' 54%,' + x.sw1 + ' 100%)');
/* 设置页的纸面档位（PREFS.boardPaper）→ _tint 的下标：'theme' 即 −1（交还主题色），
   其余按 TINTS 里的档名列名对号；认不出的档也退回 −1，绝不落到一块白纸上 */
const TINT_INDEX = {};
TINTS.forEach((x, i) => { TINT_INDEX['$' + x.id] = i; });
function paperTint(id) {
  const i = TINT_INDEX['$' + (id || 'theme')];
  return i == null ? -1 : i;
}
/* 面板格子只放「 · 」前半截，全名进 title（与物理画板同一个口径） */
const tintName = n => String(n).split(' · ')[0];
/* 自定义底色用：按相对亮度挑墨色（深底配浅字、浅底配深字），文字始终读得清 */
const INK_LIGHT = '#e8eef7', INK_DARK = '#20293a';
const lumOf = c => {
  const m = /^#([0-9a-f]{6})$/i.exec(c || '');
  if (!m) return null;
  const n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
/* 纸面渐变在导出 PNG / 录视频时要用 SVG 的写法重来一遍：把 CSS 的
   linear-gradient(<角>deg, #hex <位>%, …) 换成过中心、盖满单位框的一条渐变线
   （角度按 CSS 的规矩量：0deg 朝上、顺时针；单位向量 u = (sinθ, −cosθ)，
  线长取 |sinθ| + |cosθ|，这是 CSS 自己在方框上的算法）。解析不出就退回纯色。 */
function skinGrad(skin) {
  const m = /^linear-gradient\(\s*(-?[\d.]+)deg\s*,\s*(.+)\)$/i.exec(String(skin || '').trim());
  if (!m) return null;
  const parts = [];
  let buf = '', dep = 0;
  for (const ch of m[2]) {
    if (ch === '(') dep++;
    else if (ch === ')') dep--;
    if (ch === ',' && dep === 0) { parts.push(buf); buf = ''; } else buf += ch;
  }
  if (buf.trim()) parts.push(buf);
  const stops = [];
  for (const raw of parts) {
    const t = raw.trim().match(/^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))\s*([\d.]+%)?$/);
    if (t) stops.push({ c: t[1], o: t[2] ? parseFloat(t[2]) / 100 : null });
  }
  if (stops.length < 2) return null;
  stops.forEach((s, i) => { if (s.o == null) s.o = i / (stops.length - 1); });
  const a = (parseFloat(m[1]) * Math.PI) / 180;
  const sx = Math.sin(a), cy = Math.cos(a), L = Math.abs(sx) + Math.abs(cy);
  return {
    x1: 0.5 - (sx * L) / 2, y1: 0.5 + (cy * L) / 2,
    x2: 0.5 + (sx * L) / 2, y2: 0.5 - (cy * L) / 2,
    stops,
  };
}
let OPEN_FLOAT = null; // 同一时刻只允许一块板浮起（半屏 / 全屏互斥，另开一块就把上一块收回）

/* ---------- 实验参数进 URL（#/conics/def4?b1.e=1.4） ----------
   滑块一动（用户拖动或程序化 dispatch），防抖 300ms 后把整页所有滑块状态写进 hash query；
   replaceState 不触发路由（无导航、无过渡动画），刷新或分享链接即可还原实验现场。
   画板命名空间默认 b1/b2…（按挂载顺序），BoardMount 传 id 属性可换成可读名。 */
const GREEK_KEY = { θ: 'th', ρ: 'r', ψ: 'ps', φ: 'ph', λ: 'la', π: 'pi', α: 'al', β: 'be', γ: 'ga', ω: 'om' };
function sliderKey(label, idx) {
  const g = label.match(/[θρψφλαβγω]/);
  if (g) return GREEK_KEY[g[0]];
  const m = label.match(/[A-Za-z][A-Za-z0-9]*/); // 首个拉丁字母：'离心率 e'→e、'k = b/a'→k、't（时间）'→t
  if (m) return m[0];
  return 'p' + (idx + 1); // '直线倾角°' 这类无字母标签退化成 p1/p2…
}
let qTimer = null;
export function scheduleQuerySync() { clearTimeout(qTimer); qTimer = setTimeout(writeQuery, 300); }
function nowHash() { try { return location.hash || ''; } catch (_) { return ''; } } // 无浏览器测试环境安全取值

/** 复制文本：优先异步剪贴板；file:// 或没权限时退回临时 textarea + execCommand，仍失败交回 false */
function copyText(text, done) {
  const back = ok => { try { done(!!ok); } catch (_) { /* 回调里出错不影响复制本身 */ } };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => back(true), () => back(legacyCopy(text)));
      return;
    }
  } catch (_) { /* 落到下面 */ }
  back(legacyCopy(text));
}
function legacyCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;left:-1000px;opacity:0';
    (document.body || document.documentElement).appendChild(ta);
    if (ta.select) ta.select();
    const ok = document.execCommand ? document.execCommand('copy') : false;
    ta.parentNode && ta.parentNode.removeChild(ta);
    return !!ok;
  } catch (_) { return false; }
}
/* 文字拖动的落盘开关：设置页「记住板内文字位置」存进 gl-prefs，默认开。
   这里直接读 localStorage，画板不依赖设置模块；改完设置后新开的画板按新值走。 */
function lblPinOn() {
  try {
    const p = JSON.parse(localStorage.getItem('gl-prefs') || 'null');
    return !p || p.lblPin !== 'off'; // 没存过偏好时按默认开
  } catch (_) { return true; }
}
/** 操作条位置偏好（设置页 gl-prefs 的 dlPos）：'left' 默认板上方靠左，'right' 板上方靠右，'in' 悬浮板内右上 */
function barPosPref() {
  try {
    const p = JSON.parse(localStorage.getItem('gl-prefs') || 'null');
    const v = p && p.dlPos;
    return v === 'right' || v === 'in' ? v : 'left';
  } catch (_) { return 'left'; }
}
function writeQuery() {
  const [path] = nowHash().split('?');
  const parts = [];
  for (const b of BOARDS) {
    if (b.pagePath !== path) continue; // 防抖窗口内换了页：旧页画板不再写入
    for (const { s, key } of b.sliders) parts.push(b.qid + '.' + key + '=' + encodeURIComponent(s.value));
    for (const { key, get } of b.toggles || []) parts.push(b.qid + '.' + key + '=' + get());
    if (b.camGet) {                       // 三维视角：yaw,pitch 都留三位小数，够还原来着
      const c = b.camGet();
      if (c && isFinite(c.yaw) && isFinite(c.pitch)) parts.push(b.qid + '.cam=' + c.yaw.toFixed(3) + ',' + c.pitch.toFixed(3));
    }
  }
  try { history.replaceState(null, '', path + (parts.length ? '?' + parts.join('&') : '')); } catch (_) { /* 受限环境忽略 */ }
}

/* ---------- 画板 ---------- */
export class Board {
  /**
   * @param root  HTML 容器元素（.board）
   * @param w,h   画板逻辑尺寸（viewBox）
   * @param opt   可选：{ page, qid, fit, saveBase } —— 画布（DrawPad）挂在固定页上，批注存档不随路由走；
   *              fit=true 表示 svg 被拉满容器（宽高比不一定对得上），px() 按等比留边换算指针坐标
   */
  constructor(root, w, h, opt) {
    this.w = w; this.h = h;
    this._pxFit = !!(opt && opt.fit);
    this.handles = []; this.renderFn = null; this._rafs = [];
    this.root = root;
    this._onAppearanceChange = opt?.onAppearanceChange;
    this._preciseSliders = opt?.preciseSliders ?? false;
    this.svg = mk('svg', { viewBox: `0 0 ${w} ${h}`, style: `aspect-ratio:${w}/${h}` });
    root.appendChild(this.svg);
    const defs = mk('defs', {}, this.svg), uid = 'clip' + (Board.n = (Board.n || 0) + 1);
    // 裁剪框留着引用：画布整屏时会改逻辑尺寸（setWorld），这一块要跟着变大
    this._clipRect = mk('rect', { x: 0, y: 0, width: w, height: h });
    mk('clipPath', { id: uid }, defs).appendChild(this._clipRect);
    this.uid = uid;
    this.dyn = mk('g', { 'clip-path': `url(#${uid})` }, this.svg); // 动态重绘层
    this.hd = mk('g', {}, this.svg);                              // 把手层（不裁剪）
    this.ctrl = hEl('div', { class: 'ctrl' }); root.appendChild(this.ctrl);
    this.chipRow = hEl('div', { class: 'ctrl chips', style: 'border-top:none;padding-top:0' });
    root.appendChild(this.chipRow);
    // 实验参数进 URL：滑块注册表 + 命名空间（默认 b1/b2…，BoardMount 的 id 属性可覆盖）+ 挂载时的页面路径
    this.sliders = []; this._keys = new Set();
    // 开关按钮（toggleBtn）与三维视角也进 URL：t1/t2… 记状态，cam=yaw,pitch 记视角
    this.toggles = [];
    this._camChanged = () => scheduleQuerySync();
    this.camGet = null; this.camSet = null;
    this.qid = (opt && opt.qid) || 'b' + (BOARDS.length + 1);
    this.pagePath = (opt && opt.page) || nowHash().split('?')[0];
    this._saveBase = (opt && opt.saveBase) || '';   // 导出 PNG 的文件名前缀（画布用「画布」；空则按路由地址起名）
    this._inkPad = !!(opt && opt.inkPad);           // 画布：批注条里多一枚「图形」，可插入常用图形
    this._inkFold = !!(opt && opt.inkFold);         // 画布：批注条可收成一枚钮（点空白处自动收回）
    // 画板操作条：默认悬浮画板右上角，hover 才现身（CSS 见 global.css .dlbar / .dl）。
    // 缩放（＋/－）、半屏/全屏、PNG 与视频由引擎自带；GeoGebra 出口（ggbOutlet）也挂进这一条。
    // 设置页可以把这一条搬到板的上方（靠左 / 靠右），落位由 _placeBar() 管
    this.dlBar = hEl('div', { class: 'dlbar' });
    root.appendChild(this.dlBar);
    this._barPos = barPosPref();
    this._placeBar();
    // 缩放状态：viewBox 当相机（条内靠 CSS order 排在最左：＋ － ｜ ◧ ⛶ ｜ GeoGebra ｜ 视频 ｜ ▤ 外观 ｜ Aa 底注 ｜ PNG）
    this._vb = { x: 0, y: 0, w, h };
    this._z = 1;
    this.orbitCam = false; // 三维板由 orbit() 置 true：整块 svg 的拖拽已被转视角借走
    const zin = hEl('button', { class: 'dl zoom', title: '放大画面（Ctrl+滚轮同效，双击画面复原）' });
    zin.textContent = '＋';
    zin.addEventListener('click', () => this.zoom(1.4));
    this.dlBar.appendChild(zin);
    this._zbIn = zin;
    const zout = hEl('button', { class: 'dl zoom', title: '缩小画面（最小 0.4 倍，Ctrl+滚轮同效，双击画面复原）' });
    zout.textContent = '－';
    zout.addEventListener('click', () => this.zoom(1 / 1.4));
    this.dlBar.appendChild(zout);
    this._zbOut = zout;
    this._bindZoom();
    // 半屏 / 全屏：把这一块板浮起来看，同时只浮一块（Esc 或再点一次复原）
    this._floatMode = '';
    const half = hEl('button', { class: 'dl fs', title: '半屏展示这一块画板（再点一次复原）', 'aria-pressed': 'false' });
    half.textContent = '◧ 半屏';
    half.addEventListener('click', () => this.setFloat('half'));
    this.dlBar.appendChild(half);
    this._fsHalf = half;
    const full = hEl('button', { class: 'dl fs', title: '全屏展示这一块画板（Esc 或再点一次复原）', 'aria-pressed': 'false' });
    full.textContent = '⛶ 全屏';
    full.addEventListener('click', () => this.setFloat('full'));
    this.dlBar.appendChild(full);
    this._fsFull = full;
    this._bindFloatKeys();
    // 搬到画布：把这一块板的内容整片搬进画布（画布没开着就顺手打开），搬过去逐块可拖可删
    const toPad = hEl('button', { class: 'dl topad', title: '把这块画板的内容搬到画布上：搬过去能单独拖、单独删，文字还能双击改' });
    toPad.textContent = '→ 画布';
    toPad.addEventListener('click', () => {
      const f = typeof window !== 'undefined' ? window.__glBoardToPad : null;
      if (typeof f === 'function') f(this);
    });
    this.dlBar.appendChild(toPad);
    const dl = hEl('button', { class: 'dl png', title: '导出当前画板为 PNG 图片' });
    dl.textContent = '⤓ PNG';
    dl.addEventListener('click', () => this.exportPNG());
    this.dlBar.appendChild(dl);
    const vb = hEl('button', { class: 'dl vid', title: '把画板上的动画录成视频：点一次开始，再点一次结束并下载' });
    vb.textContent = '● 视频'; // 用文字符号不是 ⏺（U+23FA 带 emoji 表现，会按彩色 emoji 字形渲染，比别的钮高一块）
    vb.addEventListener('click', () => this.exportVideo());
    this.dlBar.appendChild(vb);
    this._vidBtn = vb;
    // 分享这一现场：先把当前滑块 / 开关 / 视角立刻写进 hash（不等 300ms 防抖），再把整条链接复制走
    const share = hEl('button', { class: 'dl share', title: '复制当前实验状态的链接：滑块、开关、三维视角都带上' });
    share.textContent = '🔗 分享';
    share.addEventListener('click', () => {
      writeQuery();
      copyText(typeof location !== 'undefined' ? location.href : '', ok => {
        share.textContent = ok ? '✓ 已复制' : '✗ 复制失败';
        setTimeout(() => { share.textContent = '🔗 分享'; }, 1600);
      });
    });
    this.dlBar.appendChild(share);
    // 画板外观：这块板的纸面 + 纸格 + 字号 / 线宽 / 轴宽（面板见 _buildTintPop）
    // 初始纸面读设置页那一项（默认 'theme' = 交还主题色，随整站主题变）；
    // _tintUser 记「这块板在「▤ 外观」里被单独点过」，点过就压住设置页，设置页一改又交还（见下面的 watch）
    this._tint = paperTint(PREFS.boardPaper);
    this._tintUser = false;
    // 板根上若还挂着上一块板留下的内联纸色（路由复用、HMR 时可能见到），先洗掉：
    // syncTint 的早退守卫只比字段、不清 DOM，漏掉这一步就会一直白着
    try {
      const st = this.root && this.root.style;
      if (st && st.removeProperty) {
        st.removeProperty('--bd-bg');
        st.removeProperty('--bd-ink');
        st.removeProperty('--bd-skin');
      }
    } catch (_) { /* 无头 mock 没有 style */ }
    this._bgCol = '';
    this._skinCol = ''; // 预设纸面的斜向渐变（--bd-skin），跟随主题 / 自定义色时为纯色
    this._inkCol = '';
    this._famLight = null; // 纸面自带亮/暗家族（null = 跟页面主题），paint() 认它
    this._custom = ''; // 调色板自选的底色（-2 号档）
    this._tintBtn = hEl('button', { class: 'dl tint', title: '画板外观：这块板的纸面（底色与墨色）、背景纸格与字号 / 线宽 / 轴宽' });
    this._tintBtn.textContent = '▤ 外观';
    this._tintBtn.addEventListener('click', e => {
      if (e && e.stopPropagation) e.stopPropagation(); // 别让 document 的收起监听顺手关掉刚开的面板
      if (!this._tintPop) return;
      if (this._tintOpen) this._tintClose(); else this._tintOpenPop();
    });
    this.dlBar.appendChild(this._tintBtn);
    this._buildTintPop();
    // 底部文字开关：板内提示行与图注（.cap）一起收起，讲图时腾出版面
    this._foot = true;
    this._footBtn = hEl('button', { class: 'dl foot', title: '隐藏 / 显示画板内部的底部说明文字' });
    this._footBtn.textContent = 'Aa 底注';
    this._footBtn.addEventListener('click', () => this.toggleFoot());
    this.dlBar.appendChild(this._footBtn);
    // 板内文字可拖动：偏移按「层 + 标签序号」记在 _lblOff，重绘后重新落到新元素上；
    // 是否落盘看设置页「记住板内文字位置」（默认开）：开着每次拖动结束自动更新本机存档，刷新后仍在
    this._lblOff = new Map();
    this._lblDef = new Map(); // 默认档（public/ 下的 JSON）给这块板的偏移
    this._lblDrag = null;
    this._lblPinned = lblPinOn();
    this._lblLoad();
    this._bindLabelDrag();
    // 批注（手绘墨迹）：墨迹层挂在 dyn 之上、把手之下；「✎ 批注」按钮与工具条都在这一层
    this._initInk();
    this._syncVB();
    BOARDS.push(this);
  }
  /** 操作条落位：'in' 留在板内悬浮右上；'left'/'right' 搬进板的父容器、排在板前，成为板上方靠左/靠右的一条。
   *  半屏/全屏时板本身是 fixed 浮层，外面没有位置，条先搬回板内当顶部工具条（CSS 用 order:-1 提到最上）。 */
  _placeBar() {
    const bar = this.dlBar, r = this.root;
    if (!bar || !r) return;
    const pos = this._barPos || 'in';
    const out = pos === 'left' || pos === 'right';
    if (bar.classList) {
      bar.classList.toggle('out', out);
      bar.classList.toggle('out-l', pos === 'left');
      bar.classList.toggle('out-r', pos === 'right');
    }
    // 卡片框（.conic-figure）里的板：条再往上提一层，排到卡片外面——卡片边框只圈住画面与图注，
    // 工具条不占卡片内的版面，也就不被那道框框住（照集合那几章的样子）
    const fig = r.closest ? r.closest('.conic-figure') : null;
    const frame = fig && fig.parentElement ? fig : null;
    const host = frame ? frame.parentElement : r.parentElement;
    // 父容器是 flex / grid 时不多塞一个格子（会顶乱两栏排布）：退回板内顶部一条，样式照旧是 .out
    let flow = true;
    try {
      const dv = host && host.ownerDocument && host.ownerDocument.defaultView;
      flow = !dv || !/flex|grid/.test(dv.getComputedStyle(host).display || '');
    } catch (_) { flow = true; }
    // 提层出来时给条挂个标记类：卡片自带 24px 上边距，不抵消的话条与卡片之间会空出一大截
    if (bar.classList) bar.classList.toggle('out-fig', out && !this._floatMode && flow && !!frame);
    const want = out && !this._floatMode && flow && host ? host : r;
    const cur = bar.parentElement || bar.parent; // 无头测试的 mock 只记 parent
    if (cur === want) return;
    if (want === host) host.insertBefore(bar, frame || r);
    else if (out) want.insertBefore(bar, want.firstChild || null); // 板内档也要排在最前：非 flex 容器靠 DOM 序
    else want.appendChild(bar);
  }
  /** 包装 rAF：销毁时统一取消，防止离开页面后动画继续运行 */
  raf(fn) { const id = requestAnimationFrame(fn); this._rafs.push(id); return id; }
  cancelRaf() { this._rafs.forEach(id => cancelAnimationFrame(id)); this._rafs = []; }
  destroy() {
    this._applyFloat(''); // 浮着的板被卸掉：先收回常态并解开页面滚动锁
    this._inkStopSnap();
    if (this._inkToastT) { clearTimeout(this._inkToastT); this._inkToastT = 0; }
    if (this._inkSaveT) { clearTimeout(this._inkSaveT); this._inkSaveT = 0; }
    if (this._offInkPalDoc) { this._offInkPalDoc(); this._offInkPalDoc = null; }
    if (this._offInkKey) { this._offInkKey(); this._offInkKey = null; }
    if (this._offTintDoc) { this._offTintDoc(); this._offTintDoc = null; }
    if (this._offKey) { this._offKey(); this._offKey = null; }
    clearActiveOutlet(this);
    // WebGL 曲面层（gl3d）：先还显存再清 DOM，否则切几页就把上下文用光
    if (this._glDispose) { this._glDispose(); this._glDispose = null; }
    this.cancelRaf();
    // 录到一半就离开页面：先把已录到的部分停掉并下载，别让 MediaRecorder 悬空
    if (this._rec) {
      try { this._rec.stop(); } catch (_) { /* 已停 */ }
      this._rec = null;
    }
    // 条可能挂在板外（板上方靠左/靠右），innerHTML 清不到它，先单独摘掉
    if (this.dlBar && this.dlBar.parentElement) this.dlBar.parentElement.removeChild(this.dlBar);
    // 板根上的纸色与字号变量一并交还：宿主元素若被复用，下一块板不该继承这一块的纸面
    try {
      const st = this.root && this.root.style;
      if (st && st.removeProperty) {
        st.removeProperty('--bd-bg');
        st.removeProperty('--bd-ink');
        st.removeProperty('--bd-skin');
        st.removeProperty('--bd-fs');
      }
    } catch (_) { /* 无头 mock 没有 style */ }
    this.root.innerHTML = '';
    const i = BOARDS.indexOf(this);
    if (i >= 0) BOARDS.splice(i, 1);
  }
  px(ev) { // 指针事件 → 画板坐标（按当前 viewBox 映射：缩放后光标下的图形仍对准光标）
    const r = this.svg.getBoundingClientRect(), v = this._vb;
    let w = r.width, h = r.height, ox = 0, oy = 0;
    // 半屏 / 全屏以及画布（DrawPad，opt.fit）会把 svg 拉满容器，内容按 preserveAspectRatio 等比居中，两侧或上下留边；
    // 平时容器宽高比就是 viewBox 宽高比（无头测试按 800×450 量，走原口径）。
    if ((this._floatMode || this._pxFit) && w && h) {
      const ar = v.w / v.h;
      if (w / h > ar) { const cw = h * ar; ox = (w - cw) / 2; w = cw; }
      else { const ch = w / ar; oy = (h - ch) / 2; h = ch; }
    }
    return V(v.x + (ev.clientX - r.left - ox) / (w || 1) * v.w, v.y + (ev.clientY - r.top - oy) / (h || 1) * v.h);
  }
  /* ---------- 缩放：把 viewBox 当相机 ----------
     只改 viewBox、不动任何图形：线段、文字、KaTeX 公式随框一起放大缩小，各板的绘制代码一行不用改；
     指针坐标走 px() 按新 viewBox 映射，所以缩放后拖把手照样跟手。 */
  zoomTo(z, ax, ay) { // z 倍数（1 = 原样，[0.4, 6]）；ax/ay 为画板坐标里保持不动的锚点，缺省取视图中心
    const nz = Math.max(ZMIN, Math.min(ZMAX, +z || 1));
    const o = this._vb;
    const cx = ax == null ? o.x + o.w / 2 : ax, cy = ay == null ? o.y + o.h / 2 : ay;
    const nw = this.w / nz, nh = this.h / nz;
    const rx = o.w ? Math.max(0, Math.min(1, (cx - o.x) / o.w)) : .5;   // 锚点在旧视图里的相对位置
    const ry = o.h ? Math.max(0, Math.min(1, (cy - o.y) / o.h)) : .5;
    this._vb = {                                                       // 新视图让锚点落在同一相对位置
      x: clampR(cx - rx * nw, 0, this.w - nw),   // 缩到 1 倍以下时视图比画框大，x/y 取负值让画面居中
      y: clampR(cy - ry * nh, 0, this.h - nh),
      w: nw, h: nh,
    };
    this._z = nz;
    this._syncVB();
    return nz;
  }
  zoom(f = 1.25, ax, ay) { return this.zoomTo(this._z * (f || 1), ax, ay); }
  /** 改逻辑尺寸（画布整屏时页框比例跟着屏幕走）：viewBox、dyn 的裁剪框、纸面网格一起换，
   *  缩放回到 1 倍。图形与墨迹的坐标不动——多出来的地方就是空白页边；调用方保证「只加不减」，
   *  已经画下的东西就不会被重新裁掉。 */
  setWorld(w, h) {
    w = Math.round(w); h = Math.round(h);
    if (!(w > 0 && h > 0) || (w === this.w && h === this.h)) return;
    this.w = w; this.h = h;
    if (this._clipRect) { this._clipRect.setAttribute('width', w); this._clipRect.setAttribute('height', h); }
    this._vb = { x: 0, y: 0, w, h };
    this._z = 1;
    if (this.svg && this.svg.style && this.svg.style.setProperty) this.svg.style.setProperty('aspect-ratio', w + '/' + h);
    this._paperDraw();   // 网格按新的 w/h 重铺，整屏铺满时格线不断在中间
    this.render();
    this._syncVB();
  }
  _syncVB() {
    const v = this._vb;
    this.svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    if (this._zbOut) this._zbOut.disabled = this._z <= ZMIN + 1e-3; // 已到 0.4 倍时「－」不可点
    if (this._zbIn) this._zbIn.disabled = this._z >= ZMAX - 1e-3;
    // 三维板的 cursor 归 orbit() 管（grab / grabbing）；批注模式按当前工具给样式，缩放时也别被复原
    if (this.svg.style && !this.orbitCam) this.svg.style.cursor = this._inkOn ? this._inkCursor() : (Math.abs(this._z - 1) > 1e-3 ? 'grab' : '');
  }
  /** 缩放交互：Ctrl/⌘ + 滚轮在指针处放大缩小（不带修饰键的滚轮照旧滚页面）；放大后按住画面拖动平移；双击复原。
   *  按下点落在把手上时不接管，拖把手与拖动平移互不抢事件。 */
  _bindZoom() {
    const svg = this.svg;
    const isHnd = tg => !!(tg && tg.classList && (tg.classList.contains('hnd') || tg.classList.contains('hndlbl')));
    svg.addEventListener('wheel', ev => {
      if (!(ev.ctrlKey || ev.metaKey)) return;
      if (ev.preventDefault) ev.preventDefault(); // 拦掉浏览器的页面缩放
      const p = this.px(ev);
      this.zoom(ev.deltaY < 0 ? 1.2 : 1 / 1.2, p.x, p.y);
    }, { passive: false });
    let drag = null;
    svg.addEventListener('pointerdown', ev => {
      // 三维板已把 svg 的拖拽借去转视角；没缩放时也不抢，免得干扰把手
      if (this.orbitCam || Math.abs(this._z - 1) <= 1e-3 || isHnd(ev.target)) return;
      if (ev.button != null && ev.button !== 0 && ev.button !== 1) return;
      drag = { x: ev.clientX, y: ev.clientY };
      if (svg.setPointerCapture && ev.pointerId != null) { try { svg.setPointerCapture(ev.pointerId); } catch (_) { /* 无指针捕获的环境跳过 */ } }
      if (ev.preventDefault) ev.preventDefault(); // 别让浏览器顺手拖选 foreignObject 里的公式文字
      if (svg.style) svg.style.cursor = 'grabbing';
    });
    svg.addEventListener('pointermove', ev => {
      if (!drag) return;
      // 位移换算成画板坐标再平移：半屏/全屏时 svg 两侧可能留边，用 px() 的正逆映射才跟手
      const p0 = this.px({ clientX: drag.x, clientY: drag.y }), p1 = this.px(ev), v = this._vb;
      drag = { x: ev.clientX, y: ev.clientY };
      v.x = clampR(v.x - (p1.x - p0.x), 0, this.w - v.w);
      v.y = clampR(v.y - (p1.y - p0.y), 0, this.h - v.h);
      this._syncVB();
    });
    const up = () => { if (!drag) return; drag = null; this._syncVB(); };
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('pointerleave', up);
    svg.addEventListener('dblclick', ev => { if (this._inkOn) return; if (!isHnd(ev.target)) this.zoomTo(1); });
  }
  /* ---------- 半屏 / 全屏 ----------
     把这一块板 root 改成 fixed 浮层（CSS 见 global.css .bd-float/.bd-half/.bd-full），
     同一时刻只浮一块：另开一块时先上一块自动收回；Esc 或再点一次同一颗钮复原。 */
  setFloat(mode) { this._applyFloat(this._floatMode === mode ? '' : mode); }
  _applyFloat(m) {
    if (m === this._floatMode) return;
    if (m && OPEN_FLOAT && OPEN_FLOAT !== this) OPEN_FLOAT._applyFloat('');
    const r = this.root;
    const bar = this.dlBar;
    const focus = bar.contains?.(document.activeElement) ? document.activeElement : null;
    if (m && !this._floatMode) {
      // 入场动画会让正文形成独立层，挡住浮层顶部或改变 fixed 的坐标基准。
      r.closest?.('main.page-in')?.classList.remove('page-in');
      this._reserveFloatSpace();
    }
    this._floatMode = m;
    if (r && r.classList) {
      r.classList.toggle('bd-float', !!this._floatMode);
      r.classList.toggle('bd-half', this._floatMode === 'half');
      r.classList.toggle('bd-full', this._floatMode === 'full');
    }
    if (this._floatMode) OPEN_FLOAT = this;
    else if (OPEN_FLOAT === this) OPEN_FLOAT = null;
    // 全屏时锁住页面滚动，免得滚轮带着底下的正文跑；半屏不锁（还看得见页面）
    const lock = !!(OPEN_FLOAT && OPEN_FLOAT._floatMode === 'full');
    const page = document.documentElement;
    if (lock && !page.classList.contains('bd-lock')) {
      page.style.setProperty?.('--bd-scrollbar-width', (window.innerWidth - page.clientWidth) + 'px');
    }
    page.classList.toggle('bd-lock', lock);
    if (!lock) page.style.removeProperty?.('--bd-scrollbar-width');
    for (const [mode, button] of [['half', this._fsHalf], ['full', this._fsFull]]) {
      const active = m === mode;
      button.classList.toggle('on', active);
      button.setAttribute('aria-pressed', String(active));
    }
    this._placeBar();
    if (m) {
      // 窄屏的操作条可换行，浮层菜单要从实际底边开始。
      const measure = () => r.style.setProperty?.('--bd-bar-height', bar.offsetHeight + 'px');
      measure();
      if (!this._floatBarObserver && typeof ResizeObserver !== 'undefined') {
        this._floatBarObserver = new ResizeObserver(measure);
        this._floatBarObserver.observe(bar);
      }
    } else {
      this._floatBarObserver?.disconnect();
      this._floatBarObserver = null;
      r.style.removeProperty?.('--bd-bar-height');
      this._floatSpaces?.forEach(space => space.remove());
      this._floatSpaces = null;
    }
    if (focus && document.activeElement !== focus) focus.focus({ preventScroll: true });
  }
  _reserveFloatSpace() {
    const r = this.root;
    const bar = this.dlBar;
    const nodes = bar.parentElement === r ? [r] : [r, bar];
    this._floatSpaces = [];
    for (const node of nodes) {
      if (!node.parentElement) continue;
      const { width, height } = node.getBoundingClientRect();
      const className = node === bar ? `bd-float-space ${bar.className}` : 'bd-float-space';
      const space = hEl('div', { class: className, 'aria-hidden': 'true', style: `width:${width}px;height:${height}px` });
      node.parentElement.insertBefore(space, node);
      this._floatSpaces.push(space);
    }
  }
  _bindFloatKeys() {
    if (!document.addEventListener) return;
    const onKey = e => { if (e && e.key === 'Escape' && this._floatMode) this._applyFloat(''); };
    document.addEventListener('keydown', onKey);
    this._offKey = () => document.removeEventListener && document.removeEventListener('keydown', onKey);
  }
  /* ---------- 外观：纸面 + 纸格 + 字号 / 线宽 / 轴宽 ----------
     纸面用 lib/papers.js 那张共用表（八档纸色 + 跟随主题）：只改这一块板的底色、墨色
     与语义色的亮/暗家族，页面本身的配色不动（整站换肤仍是顶栏 🎨）。纸格与三项倍率
     跟设置页「画板」共用同一套 PREFS。 */
  _buildTintPop() {
    const pop = hEl('div', { class: 'tint-pop', style: 'display:none' }, this.root);
    const t = hEl('div', { class: 'tint-t' }, pop);
    t.textContent = '画板纸面';
    /* 纸面一格：小样 + 名字（照物理画板那枚「▦ 纸面」的排法，九格三列） */
    const row = hEl('div', { class: 'tint-row tint-papers' }, pop);
    const sws = [];
    const add = (name, label, bg, idx) => {
      const b = hEl('button', { class: 'tint-pp' + (idx < 0 ? ' theme' : ''), title: name + '（只改这一块板）' });
      const ch = hEl('i', { class: 'tint-chip' }, b);
      if (bg) ch.style.background = bg;
      b._chip = ch;
      const s = hEl('span', { class: 'tint-pn' }, b);
      s.textContent = label;
      b.addEventListener('click', () => { this.setTint(idx); this._tintClose(); });
      row.appendChild(b); sws.push(b);
    };
    add('跟随页面主题的纸色与墨色', '跟随主题', '', -1);
    TINTS.forEach((x, i) => add(x.n + ' · ' + (x.light ? '浅纸深字' : '深纸浅字'),
      tintName(x.n), tintChip(x), i));
    // 调色板：任意底色；墨色与语义色的家族按底色亮度自动换（深底配浅字、浅底配深字）
    const crow = hEl('div', { class: 'tint-row tint-custom' }, pop);
    const pick = hEl('label', { class: 'tint-pick', title: '调色板：自选任意底色，文字自动换成深/浅墨色' }, crow);
    const inp = hEl('input', { type: 'color' }, pick);
    inp.value = this._custom || (isLight() ? '#f4f1e8' : '#0a0d14');
    inp.setAttribute && inp.setAttribute('value', inp.value);
    const pl = hEl('span', {}, pick); pl.textContent = '自定义';
    inp.addEventListener('input', () => {
      this._tintUser = true;
      this._custom = inp.value || '';
      this._tint = -2;
      this._syncTintSw();
      this.syncTint();
    });
    // 已选过自定义色、后来切回预设：再点一次取色器就恢复自定义（同色不出 input 事件，靠这一条兜底）
    inp.addEventListener('click', () => {
      if (!this._custom) return;
      this._tintUser = true;
      this._tint = -2;
      this._syncTintSw();
      this.syncTint();
    });
    this._tintPick = inp;
    this._tintPickLab = pick;
    // 纸格：与设置页「数学画板背景网格」是同一项（PREFS.boardGrid），这里只是就近的入口。
    // 不动 setPaper（那是画布显式定的纸面），只重铺那些跟着全局档走的板。
    const grow = hEl('div', { class: 'tint-row tint-grid' }, pop);
    hEl('span', { class: 'tint-gl' }, grow).textContent = '纸格';
    const gbs = [];
    for (const [v, txt, tip] of [['off', '不画', '不铺背景纸格'], ['auto', '自动', '板上有坐标网格时自动收起'],
      ['square', '方格', '铺一层方格纸纹'], ['dots', '点阵', '铺一层点阵纸纹'], ['lines', '横线', '铺一层横线纸纹']]) {
      const b = hEl('button', { class: 'tint-gb' + (PREFS.boardGrid === v ? ' on' : ''), title: tip }, grow);
      b.textContent = txt;
      b.addEventListener('click', () => {
        setPref('boardGrid', v);
        gbs.forEach(x => x.classList.toggle('on', x === b));
        BOARDS.forEach(bd => { bd._paperKey = ''; bd._paperDraw(); });
      });
      gbs.push(b);
    }
    this._tintGbs = gbs;
    // 字号 / 线宽 / 轴宽：与设置页「画板」同一套 PREFS，这里只是就近的入口。
    // 倍率改的是 mk() 与 B.grid 的绘制参数，必须整板重画，restyleAll() 攒到下一帧画一遍
    const sbox = hEl('div', { class: 'tint-slbox' }, pop);
    const sls = [];
    const mkSl = (label, key, min, max, tip) => {
      const row = hEl('div', { class: 'tint-row tint-sl', title: tip }, sbox);
      hEl('span', { class: 'tint-gl' }, row).textContent = label;
      const inp = hEl('input', { type: 'range', min, max, step: 0.05 }, row);
      inp.value = PREFS[key];
      if (inp.setAttribute) inp.setAttribute('value', inp.value);
      const sv = hEl('span', { class: 'tint-sv' }, row);
      const show = v => { sv.textContent = (+v).toFixed(2) + '×'; };
      show(PREFS[key]);
      inp.addEventListener('input', () => {
        const v = +inp.value;
        if (!isFinite(v)) return;
        setPref(key, v);
        show(v);
        restyleAll();
      });
      sls.push({ inp, key, show });
    };
    mkSl('字号', 'boardFont', 0.8, 1.6, '板内字号倍率：数字、字母、公式与汉字一起放大');
    mkSl('线宽', 'boardLineW', 0.6, 2.5, '网格、曲线、连线与图形的线宽倍率；批注笔迹不跟这项');
    mkSl('轴宽', 'boardAxisW', 0.6, 3, '坐标轴线宽（绝对宽度，不与线宽叠乘）');
    // 底注：纸面只改这一块，其余三项与设置页同一套值（照物理画板面板底下那句）
    const f = hEl('div', { class: 'tint-f' }, pop);
    f.textContent = '纸面只改这一块板；纸格与三项倍率与设置页「画板」是同一项';
    this._tintSls = sls;
    this._tintPop = pop;
    this._tintSws = sws; // [0] 是「跟随主题」，k 对应 TINTS[k−1]
    this._tintOpen = false;
    this._tintOpenPop = () => {
      this._syncTintSw();
      if (this._tintGbs) this._tintGbs.forEach((x, k) => x.classList.toggle('on',
        ['off', 'auto', 'square', 'dots', 'lines'][k] === PREFS.boardGrid));
      // 设置页里可能刚改过：开面板时按当前 PREFS 刷一次滑块
      if (this._tintSls) this._tintSls.forEach(s => { s.inp.value = PREFS[s.key]; s.show(PREFS[s.key]); });
      this._tintOpen = true; pop.style.display = 'flex';
    };
    this._tintClose = () => { this._tintOpen = false; pop.style.display = 'none'; };
    const onDoc = e => { // 点面板以外的地方就收起（开合状态记在 _tintOpen，不看内联 display）
      if (!this._tintOpen) return;
      const p = e && e.target;
      if (p && p !== this._tintBtn && !(pop.contains && pop.contains(p))) this._tintClose();
    };
    if (document.addEventListener) {
      document.addEventListener('click', onDoc);
      this._offTintDoc = () => document.removeEventListener && document.removeEventListener('click', onDoc);
    }
    this._syncTintSw();
  }
  setTint(i) { this._tintUser = true; this._tint = i; this._syncTintSw(); this.syncTint(); }
  /* ---------- 画布纸面：底色 + 网格 ----------
     cfg = { c: '#rrggbb' | '', g: 'none' | 'square' | 'dots' | 'lines' }
     底色复用板底色那套（--bd-bg + 深/浅墨），网格画成 svg 最底下的一层 g.bd-paper：
     跟着 viewBox 缩放、平移，导出 PNG 时也一起带走。 */
  setPaper(cfg) {
    const c = (cfg && cfg.c) || '';
    const g = (cfg && cfg.g) || 'none';
    this._paper = { c, g };
    this._paperSet = true;   // 画布显式选的纸面压过设置页的全局档
    this._tintUser = true;
    if (c) { this._custom = c; this._tint = -2; } else { this._tint = -1; }
    this.syncTint();
    this._paperDraw();
    return this._paper;
  }
  /** 纸格最终画什么：显式 setPaper 过的板（画布）听它，其余跟着设置页「画板背景网格」——
   *  off 不画；auto 板上有坐标网格（B.grid）时收起，免得两套网格打架；其余按所选样式。 */
  _paperStyle() {
    if (this._paperSet) return (this._paper && this._paper.g) || 'none';
    const m = PREFS.boardGrid || 'off';
    if (m === 'off') return 'none';
    if (m === 'auto') return this._gridMarked ? 'none' : 'square';
    return m;
  }
  _paperDraw() {
    if (!this.svg || !this.svg.insertBefore) return;
    if (!this._paperEl) this._paperEl = mk('g', { class: 'bd-paper' });
    const g = this._paperEl;
    if (g.parentNode !== this.svg) this.svg.insertBefore(g, this.svg.firstChild || null);
    const style = this._paperStyle();
    const p = this._paper || {};
    const bg = p.c || this._bgCol || (isLight() ? '#fdfcf8' : '#0b0f17');
    // 动画板每帧走一次 render()，这里每个 rAF 都会被调到；样式、底色、尺寸都没变就不重铺
    const key = style + '|' + bg + '|' + this.w + '|' + this.h;
    if (key === this._paperKey) return;
    this._paperKey = key;
    if (g.innerHTML !== undefined) g.innerHTML = '';
    if (style === 'none') return;
    const W = this.w, H = this.h, step = 50;
    const light = (lumOf(bg) == null ? !isLight() : lumOf(bg) > 0.42);
    const col = light ? 'rgba(35,60,90,.17)' : 'rgba(190,210,235,.15)';
    const add = (tag, at) => { const e = mk(tag, at, g); e.setAttribute('stroke', col); e.setAttribute('fill', 'none'); return e; };
    if (style === 'lines') {
      for (let y = step; y < H; y += step) add('line', { x1: 0, y1: y, x2: W, y2: y });
    } else if (style === 'dots') {
      for (let y = step; y < H; y += step) {
        for (let x = step; x < W; x += step) {
          const e = mk('circle', { cx: x, cy: y, r: 1.5 }, g);
          e.setAttribute('fill', col);
        }
      }
    } else {
      for (let x = step; x < W; x += step) add('line', { x1: x, y1: 0, x2: x, y2: H });
      for (let y = step; y < H; y += step) add('line', { x1: 0, y1: y, x2: W, y2: y });
    }
  }
  _syncTintSw() {
    if (!this._tintSws) return;
    this._tintSws.forEach((b, k) => {
      if (b._chip && k > 0 && TINTS[k - 1]) b._chip.style.background = tintChip(TINTS[k - 1]);
      b.classList.toggle('on', k - 1 === this._tint);
    });
    if (this._tintPick) {
      if (this._custom) this._tintPick.value = this._custom;
      if (this._tintPickLab && this._tintPickLab.classList) this._tintPickLab.classList.toggle('on', this._tint === -2);
    }
  }
  /** 把当前纸面写到板根：--bd-bg 是底色（.board 背景与 svg 文字的底色光晕都读它），
   *  --bd-skin 是预设纸面的斜向渐变（.board 的 background-image 读它，压在底色之上；
   *  物理板同一档写的是 --pb-skin），--bd-ink 是墨色（svg 文字与 KaTeX 公式同读），
   *  _famLight 交给 paint() 决定语义色取哪一家族。
   *  跟随主题时三者都交还主题；自定义色按相对亮度定墨色与家族（深底浅字、浅底深字）。
   *  切主题时 render() 会再调一次：跟随主题的板跟着换，自选纸面的板不动。 */
  syncTint() {
    // 设置页「数学画板纸面」是全局默认档：这块板没被「▤ 外观」单独点过、也不是画布显式定过纸面的，
    // 每次进来都按 PREFS.boardPaper 现算一遍。切主题时 render() 会再调一次，跟随主题的板因此一直跟着换
    if (!this._tintUser && !this._paperSet) this._tint = paperTint(PREFS.boardPaper);
    const p = this._tint >= 0 ? (TINTS[this._tint] || null) : null;
    const col = p ? p.c : this._tint === -2 ? (this._custom || '') : '';
    const skin = p ? (p.skin || '') : '';   // 预设纸面带斜向渐变，跟随主题 / 自定义色是纯色
    let fam = p ? p.light : null;
    let ink = p ? (p.ink || (fam ? INK_DARK : INK_LIGHT)) : '';
    if (this._tint === -2 && col) {
      const l = lumOf(col);
      if (l != null) { fam = l > .42; ink = fam ? INK_DARK : INK_LIGHT; }
    }
    if (this._onAppearanceChange) {
      const theme = themeOf(currentTheme());
      const background = col || theme.board;
      if (background !== this._appearanceBg) {
        this._appearanceBg = background;
        this._onAppearanceChange(this, background);
      }
    }
    if (col === this._bgCol && ink === this._inkCol && fam === this._famLight && skin === this._skinCol) {
      // 早退只比字段、不比 DOM：板根被复用或换了实例时（路由复用、HMR 交接、画布页换纸），
      // 上一块板写下的内联纸色还挂在这个元素上，而字段已经是「跟随主题」的空值——守卫判相等，
      // 自此再没人来清，深色主题下这块板就一直白着。所以早退这一趟按实际值核一遍。
      this._tintPut('--bd-bg', col);
      this._tintPut('--bd-ink', ink);
      this._tintPut('--bd-skin', skin);
      return;
    }
    this._bgCol = col; this._inkCol = ink; this._famLight = fam; this._skinCol = skin;
    const st = this.root && this.root.style;
    if (!st || !st.setProperty) return; // 无头 mock 的 style 是普通对象
    if (col) st.setProperty('--bd-bg', col);
    else if (st.removeProperty) st.removeProperty('--bd-bg');
    if (ink) st.setProperty('--bd-ink', ink);
    else if (st.removeProperty) st.removeProperty('--bd-ink');
    if (skin) st.setProperty('--bd-skin', skin);
    else if (st.removeProperty) st.removeProperty('--bd-skin');
    // 底色的明暗决定纸格线色，换了底色就重铺一次（没变则不进来）
    this._paperKey = '';
    this._paperDraw();
  }
  /* 把一项内联纸色校正到「应该是」的值：该有、板上却没有或不一样就补写，不该有就洗掉，
     已经对就什么都不动。动画板每帧都会走 syncTint 的早退这趟，这里只读内联样式、值对时不写，
     不触发布局。 */
  _tintPut(name, want) {
    const st = this.root && this.root.style;
    if (!st || !st.getPropertyValue || !st.removeProperty) return; // 无头 mock 的 style 是普通对象
    const has = st.getPropertyValue(name);
    if (want) { if (has !== want && st.setProperty) st.setProperty(name, want); }
    else if (has) st.removeProperty(name);
  }
  /* ---------- 底部文字开关：只收画板内部的提示行（hint / hintM），板框外的图注不动 ---------- */
  toggleFoot() {
    this._foot = !this._foot;
    if (this._footBtn) this._footBtn.classList.toggle('on', !this._foot);
    if (this._hint) this._hint.style.display = this._hintT && this._foot ? '' : 'none';
    if (this._hintM) this._hintM.style.display = this._hintMT && this._foot ? '' : 'none';
  }
  /* ---------- 板内文字拖动：注释偶尔叠在一起，手动挪开比改版面快 ----------
     认整块 svg 里的 <text> 与 <foreignObject> —— dyn 层随重绘换元素的标签、顶层的 hint / hintM 提示行都算；
     把手层的标签不参与（hd 是 dyn 的兄弟层）。偏移按「层 + 同类序号」认人，记的是相对自然位置的位移，
     所以文字随参数换位置、换内容，重画后挪开的距离照样带着走；每次重绘后 _applyLblOffsets 重新落到新元素上。
     监听器挂在 svg 的捕获阶段：先于拖动平移与三维转视角拿到按下，空白处照旧放过；
     双击一枚挪过的标签即复原，没挪过的双击仍交给画板复原缩放。 */
  _bindLabelDrag() {
    const svg = this.svg;
    if (!svg.addEventListener) return;
    const P = e => e.parentNode || e.parent;
    // WebGL 画布层（gl3d 的 foreignObject）不是文字：它铺满整块板，当成标签会有两个后果——
    // 压在曲面上按下时事件被它吃掉、转不了视角，而且整个曲面会被拖着走
    const isGL = e => !!(e.classList && e.classList.contains('gl-fo'));
    const isLbl = e => !isGL(e)
      && (e.tagName === 'text' || e.tagName === 'foreignObject' || e.tagName === 'foreignobject');
    const inHd = t => { for (let e = t; e && e !== svg; e = P(e)) if (e === this.hd) return true; return false; };
    const pick = t => {
      if (inHd(t)) return null; // 把手层（圆点、手柄标签）不参与
      for (let e = t; e && e !== svg; e = P(e)) if (isLbl(e)) return e;
      return null;
    };
    const CAP = { capture: true }; // 捕获阶段先手：抢在 svg 的拖动平移 / 三维转视角之前吃掉按下
    svg.addEventListener('pointerdown', ev => {
      if (this._inkOn) return;      // 批注模式：按下归墨迹层，标签不参与拖动
      if (ev.button != null && ev.button !== 0) return;
      const el = pick(ev.target);
      if (!el) return;
      this._lblSyncId(); // 板号若被 BoardMount 换过，先按新板号读回偏移
      const k = this._lblKey(el);
      const o = this._lblOff.get(k) || { dx: 0, dy: 0 };
      const bx = el.__lbx != null ? el.__lbx : (+(el.getAttribute('x') || 0) || 0);
      const by = el.__lby != null ? el.__lby : (+(el.getAttribute('y') || 0) || 0);
      el.__lbk = k; el.__lbx = bx; el.__lby = by;
      this._lblDrag = { el, k, bx, by, o0: { dx: o.dx || 0, dy: o.dy || 0 }, p0: this.px(ev) };
      if (el.setPointerCapture && ev.pointerId != null) { try { el.setPointerCapture(ev.pointerId); } catch (_) { /* 无指针捕获的环境跳过 */ } }
      if (ev.stopPropagation) ev.stopPropagation(); // 别让 svg 的拖动平移 / 转视角接手
      if (ev.preventDefault) ev.preventDefault();
      if (svg.style) svg.style.cursor = 'grabbing';
    }, CAP);
    svg.addEventListener('pointermove', ev => {
      const d = this._lblDrag;
      if (!d) return;
      const p = this.px(ev);
      const dx = d.o0.dx + p.x - d.p0.x, dy = d.o0.dy + p.y - d.p0.y;
      d.el.setAttribute('x', d.bx + dx);
      d.el.setAttribute('y', d.by + dy);
      this._lblOff.set(d.k, { dx, dy });
    });
    const up = () => {
      if (!this._lblDrag) return;
      this._lblDrag = null;
      // 批注模式下松手要回到当前工具的样式，别把十字 / 橡皮换回 grab
      if (this._inkOn) { this._inkApplyCursor(); return; }
      if (svg.style && !this.orbitCam) svg.style.cursor = this._z == null || Math.abs(this._z - 1) > 1e-3 ? 'grab' : '';
      this._lblSave(); // 拖动结束后落盘（设置里「记住板内文字位置」开着时才写）
    };
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('dblclick', ev => { // 双击已挪过的标签：回到原位（没挪过的留给画板双击复原缩放）
      if (this._inkOn) return;    // 批注模式连点两下不该动标签
      const el = pick(ev.target);
      if (!el) return;
      this._lblSyncId(); // 板号若被 BoardMount 换过，先按新板号读回偏移
      const k = this._lblKey(el);
      const cur = this._lblOff.get(k);
      if (!cur) return;
      const d = this._lblDef && this._lblDef.get(k);
      const defX = d ? d.dx : 0, defY = d ? d.dy : 0;
      // 已经落在默认档（或自然位置）上：把双击让给画板复原缩放
      if (Math.abs((cur.dx || 0) - defX) < 1e-6 && Math.abs((cur.dy || 0) - defY) < 1e-6) return;
      if (d) this._lblOff.set(k, { dx: d.dx, dy: d.dy }); else this._lblOff.delete(k);
      this._lblSave();
      const o = this._lblOff.get(k) || { dx: 0, dy: 0 };
      const bx = el.__lbx != null ? el.__lbx : (+(el.getAttribute('x') || 0) || 0);
      const by = el.__lby != null ? el.__lby : (+(el.getAttribute('y') || 0) || 0);
      el.setAttribute('x', bx + (o.dx || 0));
      el.setAttribute('y', by + (o.dy || 0));
      if (ev.stopPropagation) ev.stopPropagation();
      if (ev.preventDefault) ev.preventDefault();
    }, CAP);
  }
  /* ---------- 文字位置存档：按「层 + 同标签序号」认人 ----------
     dyn 每次重绘都换新元素，只能按它在 dyn 里同类标签中的序号认；顶层 hint / hintM 直接挂在 svg 上，
     按 svg 直接子元素里的同类序号认。偏移记成「相对自然位置的位移」，所以位置随参数变的文字，
     重画后挪开的距离照样带着走。
     两层：默认档（站点 public/ 下的 JSON，启动时载入）打底，本机存档（localStorage 'gl-lbl'）覆盖它；
     设置里「记住板内文字位置」只关本机档的读写，默认档始终生效。 */
  _lblLoad() {
    this._lblQid = this.qid; // 记下这份偏移属于哪个板号（BoardMount 可能随后把 qid 换成可读名）
    this._lblOff.clear();
    this._lblDef = new Map();
    const page = this.pagePath || '/';
    const defs = defaultBoard(page, this.qid);
    for (const k in defs) { this._lblDef.set(k, defs[k]); this._lblOff.set(k, defs[k]); }
    if (!this._lblPinned) return;
    let q = {};
    try { q = (readLabels()[page] || {})[this.qid] || {}; } catch (_) { q = {}; }
    for (const k in q) {
      const v = q[k];
      if (v && v.length === 2) this._lblOff.set(k, { dx: +v[0] || 0, dy: +v[1] || 0 });
    }
  }
  /** BoardMount 在构造后才会把 qid 换成 id 属性：板号变了就按新板号重读一次存档 */
  _lblSyncId() {
    if (this._lblQid !== this.qid) this._lblLoad();
  }
  /** 给 BoardMount 用：板号改成可读名后按新板号重读文字偏移，并重画一次落到画面上 */
  refreshLabels() { this._lblLoad(); this._inkSyncId(); this.render(); }
  _lblSave(force) {
    if (!force && !this._lblPinned) return;
    if (!force) this._lblSyncId(); // 板号换过就先按板号读回，免得把上一块板的偏移写到新板名下
    const store = readLabels();
    const page = this.pagePath || '/';
    const pageObj = store[page] || {};
    const q = {};
    this._lblOff.forEach((o, k) => {
      const dx = Math.round((o.dx || 0) * 10) / 10, dy = Math.round((o.dy || 0) * 10) / 10;
      const d = this._lblDef && this._lblDef.get(k);
      if (d) { // 与默认档一致就不必在本机再记一份（拖回自然位置时要记 [0,0]，好盖住默认档）
        const ex = Math.round((d.dx || 0) * 10) / 10, ey = Math.round((d.dy || 0) * 10) / 10;
        if (dx === ex && dy === ey) return;
        q[k] = [dx, dy];
      } else if (dx || dy) q[k] = [dx, dy];
    });
    if (Object.keys(q).length) pageObj[this.qid] = q; else delete pageObj[this.qid];
    if (Object.keys(pageObj).length) store[page] = pageObj; else delete store[page];
    writeLabels(store);
  }
  _lblKey(el) {
    const tag = el.tagName;
    const dyn = this.dyn;
    const P = e => e.parentNode || e.parent;
    let inDyn = false;
    for (let e = el; e && e !== this.svg; e = P(e)) if (e === dyn) { inDyn = true; break; }
    // dyn 层按「同类标签里的序号」认：一次取 text + foreignObject 的文档序，正是 _applyLblOffsets 计数的那一份
    if (inDyn && dyn.querySelectorAll) {
      const all = dyn.querySelectorAll('text, foreignObject');
      let n = 0;
      for (let i = 0; i < all.length; i++) {
        if (all[i] === el) return 'd:' + tag + '#' + n;
        if (all[i].tagName === tag) n++;
      }
      return 'd:' + tag + '#' + n;
    }
    const kids = this.svg.childNodes || [];
    const isGL = c => c.classList && c.classList.contains('gl-fo');  // WebGL 画布层不是文字，别算进标签
    let n = 0;
    for (let i = 0; i < kids.length; i++) {
      const c = kids[i];
      if (c === el) break;
      if (c.tagName === tag && !isGL(c)) n++;
    }
    return 't:' + tag + '#' + n;
  }
  _applyLblOffsets() {
    const off = this._lblOff;
    if (!off || !off.size) return;
    const apply = (el, k) => {
      if (el.__lbx == null) { // 自然位置只记一次：顶层提示行不重绘，反复套偏移才不会叠出去
        el.__lbx = +(el.getAttribute('x') || 0) || 0;
        el.__lby = +(el.getAttribute('y') || 0) || 0;
      }
      const o = off.get(k);
      if (o) { el.setAttribute('x', el.__lbx + o.dx); el.setAttribute('y', el.__lby + o.dy); }
    };
    const dyn = this.dyn;
    if (dyn && dyn.querySelectorAll) {
      const els = dyn.querySelectorAll('text, foreignObject');
      let ti = 0, fi = 0;
      for (let i = 0; i < els.length; i++) {
        const el = els[i], tag = el.tagName;
        const k = (tag === 'foreignObject' || tag === 'foreignobject') ? 'd:' + tag + '#' + fi++ : 'd:' + tag + '#' + ti++;
        apply(el, k);
      }
    }
    // 顶层（hint / hintM）不随 clear 清掉，位置也要照顾到
    const kids = this.svg.childNodes || [];
    let ti = 0, fi = 0;
    for (let i = 0; i < kids.length; i++) {
      const el = kids[i], tag = el.tagName;
      if (tag !== 'text' && tag !== 'foreignObject' && tag !== 'foreignobject') continue;
      if (el.classList && el.classList.contains('gl-fo')) continue;   // WebGL 画布层不参与标签偏移
      const k = (tag === 'foreignObject' || tag === 'foreignobject') ? 't:' + tag + '#' + fi++ : 't:' + tag + '#' + ti++;
      apply(el, k);
    }
  }
  /* ---------- 批注（手绘墨迹） ----------
     一条墨迹 = { c: 颜色, w: 粗（板单位）, pts: [{x,y}] }，坐标存板坐标，缩放、平移之后仍贴在原处。
     墨迹层 .bd-ink 单独挂在 dyn 之上、把手之下：render() 只清 dyn，批注不会被重画冲掉；
     平时整层 pointer-events:none，批注模式在 svg 捕获阶段先手接管按下——标签拖动、拖动平移、三维转视角
     各自都有 _inkOn 守卫让路。落盘走 lib/ink.js（Douglas–Peucker 抽稀 + 0.1 量化），按「页面 + 板号」分槽。 */
  _initInk() {
    this.inkLayer = mk('g', { class: 'bd-ink' }, this.svg);
    this._inkSelLayer = mk('g', { class: 'bd-ink-sel' }, this.svg);   // 选框预览 / 选区高亮
    if (this.svg.insertBefore) {
      this.svg.insertBefore(this.inkLayer, this.hd || null);           // 压在图形之上、把手之下
      this.svg.insertBefore(this._inkSelLayer, this.hd || null);
    }
    if (this.inkLayer.style) this.inkLayer.style.pointerEvents = 'none'; // 命中一律走坐标计算，不让墨迹当事件目标
    if (this._inkSelLayer.style) this._inkSelLayer.style.pointerEvents = 'none';
    this._inkOn = false;
    this._inkTool = 'pen';          // pen | eraser | rect | lasso
    this._inkColor = inkLastColor() || '#ff5a6e';   // 上次选的颜色重开页面还留着
    this._inkWidth = 3.2;
    this._inkKind = 'pen';          // pen 钢笔 | pencil 铅笔 | brush 毛笔
    this._inkDash = 'solid';        // solid | dash | dot
    this._inkPalOpen = false;       // 调色板是否展开
    this._inkMin = false;           // 工具条是否收成一枚钮（只有画布会收）
    this._inkTap = null;            // 画布：本次按下的时间/落点（抬手判「点空白」用）
    this._inkStrokes = []; this._inkStrokeEls = [];   // 笔与笔对应的 SVG 元素（拖动时整片加 transform）
    this._inkCur = null; this._inkEl = null; this._inkErasing = false;
    this._inkTmpEls = []; this._inkPrevEls = [];      // 绘制中的临时笔画、选框预览
    this._inkSnapTimer = 0;                          // 停笔片刻的轨迹识别
    this._inkSel = null; this._inkSelDrag = null; this._inkDrag = null;  // 选区 { idx, bbox } 与进行中的选框/移动
    this._inkUndoStack = []; this._inkEraseTook = false; this._inkRecolorSnapAt = 0;  // 回退快照栈
    this._inkQid = this.qid;
    this._inkBtn = hEl('button', { class: 'dl ink', title: '批注：在画板上手写、画线与圈重点（再点一次退出）' });
    this._inkBtn.textContent = '✎ 批注';
    this._inkBtn.addEventListener('click', () => this.setInk());
    this.dlBar.appendChild(this._inkBtn);
    this._buildInkBar();
    this._bindInk();
    this._inkLoad();
  }
  /** 板内左上的批注工具条。工具（笔/橡皮/框选/套索）排一行；粗细 / 颜色 / 虚实 / 笔种四类参数
   *  各收成一枚按钮，点开才展开选项——按钮少、排得下，画布那边还能整条放大（CSS .pad-board 一族）。
   *  只在批注模式现身（CSS .ink-on）。 */
  _buildInkBar() {
    const bar = this._inkBar = hEl('div', { class: 'inkbar' });
    this.root.appendChild(bar);
    this._inkPops = [];
    const sep = () => bar.appendChild(hEl('span', { class: 'ink-sep' }));
    const ico = d => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';

    /* 工具：图标走内联 SVG，橡皮、套索这些字符图标认不出来 */
    const tool = (d, title) => {
      const b = hEl('button', { class: 'ink-t', title }, bar);
      b.innerHTML = ico(d);
      return b;
    };
    this._inkPen = tool('<path d="M4 20l1.1-4.1L16.3 4.7a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L9.1 19.9 4 20z"/><path d="M14.4 6.6l3.2 3.2"/>', '画笔：写字、画线、圈重点');
    this._inkSelT = tool('<path d="M6 3.4 18.9 12l-5.9 1.6 2.6 6.3-2.5 1-2.6-6.4L6 18z"/>', '选择：点一下选中一个元素，拖走、Delete 删掉；Ctrl / ⌘ + 点加选、减选；选中后右下角的小方块可以缩放');
    this._inkEraser = tool('<path d="M9.6 18.5 5 13.9a1.6 1.6 0 0 1 0-2.3l6.6-6.6a1.6 1.6 0 0 1 2.3 0l4.5 4.5a1.6 1.6 0 0 1 0 2.3l-6.5 6.5H9.6z"/><path d="M7.8 11.9l4.8 4.8"/><path d="M5 20.5h14"/>', '橡皮：点中哪一条就整条擦掉（按住拖动连续擦）；已经有选区时点一下橡皮，直接把选区里那一块擦掉');
    this._inkRect = tool('<rect x="4" y="5" width="16" height="14" rx="2" stroke-dasharray="3.6 2.6"/>', '框选：拉一个矩形，圈中的笔画可以拖走、删除或缩放；选好后点橡皮可直接擦掉');
    this._inkLasso = tool('<ellipse cx="12" cy="10.2" rx="7.6" ry="5.6" stroke-dasharray="3.2 2.4"/><path d="M9.4 15.3c-.5 1.9-1.6 2.9-3.2 3.2"/>', '套索：随手画一个圈，圈中的笔画可以拖走、删除或缩放；选好后点橡皮可直接擦掉。旁边的「剪选 / 整条」切换按形状选还是整条选');
    const tools = [[this._inkPen, 'pen'], [this._inkSelT, 'sel'], [this._inkEraser, 'eraser'], [this._inkRect, 'rect'], [this._inkLasso, 'lasso']];
    // 画布才有的三件：文字、多边形、向量——讲解页的板上批注用不到，不占位置
    if (this._inkPad) {
      this._inkTxtT = tool('<path d="M5.6 5.4h12.8"/><path d="M12 5.4v13.2"/>', '文字：点一下画布就能打字；再点已有的字（或双击它）可以改');
      this._inkPolyT = tool('<path d="M12 3.4 20 9.2l-3 9.4H7L4 9.2z"/>', '多边形：一下一下点出顶点，点回起点（或双击）收口；换工具时凑够三个顶点也算画好');
      this._inkVecT = tool('<path d="M4 19 18.2 6.4"/><path d="M12.8 6.1l5.8-.5-.4 5.8"/>', '向量：拖一条带箭头的线；两个向量同起点时自动补出虚线平行四边形');
      tools.push([this._inkTxtT, 'text'], [this._inkPolyT, 'poly'], [this._inkVecT, 'vec']);
    }
    for (const [el, t] of tools) {
      el.addEventListener('click', () => {
        this._inkPolyClose(); this._inkTextStop(true);
        // 选好了再点橡皮：直接擦掉选区里这一块（框选 / 套索之后最顺手的下一步），
        // 擦完橡皮继续拿着，想再手工擦两笔也不用重新点一次
        if (t === 'eraser' && this._inkSel && this._inkSel.idx.length) {
          const n = this._inkSel.idx.length;
          this._inkTool = 'eraser';
          this._inkDeleteSel();
          this._inkTipSay('已擦掉选中的 ' + n + ' 样');
          return;
        }
        this._inkTool = t;
        this._inkClearSel();
        this._inkSyncTools();
      });
    }
    // 套索方式：剪选（圈到哪段选哪段）/ 整条选，工具栏上直接切，设置页同一项
    const sm = this._inkSelModeBtn = hEl('button', { class: 'ink-mode' }, bar);
    sm.innerHTML = ico('<circle cx="6" cy="17.6" r="2.6"/><circle cx="18" cy="17.6" r="2.6"/><path d="M8.1 15.4 16.6 4.2"/><path d="M15.9 15.4 7.4 4.2"/>') + '<span class="ink-mode-lbl">剪选</span>';
    this._inkSelModeLbl = sm.querySelector('.ink-mode-lbl');
    sm.addEventListener('click', e => {
      if (e && e.stopPropagation) e.stopPropagation();
      setPref('inkSelMode', PREFS.inkSelMode === 'cut' ? 'whole' : 'cut');
      this._inkSyncTools();
      this._inkTipSay(PREFS.inkSelMode === 'cut'
        ? '套索：按形状剪选，圈到哪段选哪段（跨界处剪开）'
        : '套索：整条选，碰到哪条就整条选中');
    });
    sep();

    /* 四类参数：一枚按钮 + 一个弹出面板（同一时刻只开一个） */
    const group = title => {
      const g = hEl('span', { class: 'ink-g' }, bar);
      const b = hEl('button', { class: 'ink-gb', title }, g);
      const pop = hEl('div', { class: 'ink-pop' }, g);
      b.addEventListener('click', e => { if (e && e.stopPropagation) e.stopPropagation(); this._inkPopToggle(g); });
      g.__btn = b; g.__pop = pop;
      this._inkPops.push(g);
      return g;
    };
    // 选项按钮：icon（可空）+ 名字，名字另存 __name 供按钮上显示当前值
    const opt = (par, d, name, title) => {
      const b = hEl('button', { class: 'ink-o', title: title || name }, par);
      b.innerHTML = (d || '') + '<span>' + name + '</span>';
      b.__name = name;
      return b;
    };

    /* 粗细：按钮上那道短杠的粗细就是当前笔宽；面板里另可自己填一个数 */
    const gw = this._inkWGrp = group('粗细：细 / 中 / 粗，也可以自己填；选中图形后改的是所选图形的线宽');
    gw.__pop.classList.add('ink-pop-grid');
    gw.__btn.innerHTML = '<i class="ink-wbar"></i><span class="ink-glbl">中</span>';
    this._inkWBar = gw.__btn.querySelector('i');
    this._inkWLbl = gw.__btn.querySelector('span');
    this._inkWs = [['细', 2], ['中', 3.2], ['粗', 5.5]].map(([name, w]) => {
      const b = opt(gw.__pop, '<i class="ink-wbar" style="height:' + Math.round(w * 1.6) + 'px"></i>', name, '笔画粗细：' + name);
      b.__w = w;
      b.addEventListener('click', () => { this._inkWidth = w; this._inkApplyWidth(w); this._inkSyncTools(); this._inkPopClose(); });
      return b;
    });
    const wRow = hEl('div', { class: 'ink-wrow' }, gw.__pop);
    hEl('span', { class: 'ink-pal-t' }, wRow).textContent = '自定';
    const wIn = this._inkWIn = hEl('input', {
      class: 'ink-winp', type: 'number', min: '0.6', max: '24', step: '0.2',
      value: String(this._inkWidth), title: '自己填笔宽（0.6–24，回车生效）',
    }, wRow);
    const applyW = () => {
      const v = Math.max(0.6, Math.min(24, +wIn.value || 0));
      if (!(v > 0)) return;
      this._inkWidth = Math.round(v * 10) / 10;
      wIn.value = String(this._inkWidth);
      this._inkApplyWidth(this._inkWidth);
      this._inkSyncTools();
    };
    wIn.addEventListener('change', applyW);
    wIn.addEventListener('keydown', e => { if (e.key === 'Enter') { if (e.preventDefault) e.preventDefault(); applyW(); } });

    /* 颜色：常用色 + 最近用过 + 取色器 + 手输 rgb/hex */
    const gc = this._inkCG = group('颜色：常用色、最近用过的颜色、取色器，或手输 #5cadff / rgb(92,173,255)');
    gc.__pop.classList.add('ink-pop-col');
    gc.__btn.innerHTML = '<i class="ink-cdot"></i><span class="ink-glbl">颜色</span>';
    this._inkCDot = gc.__btn.querySelector('i');
    this._inkPal = gc.__pop;
    this._inkPalOpen = false;
    hEl('div', { class: 'ink-pal-t' }, gc.__pop).textContent = '常用';
    const swRow = hEl('div', { class: 'ink-pal-grid' }, gc.__pop);
    const SW = [['#ff5a6e', '红'], ['#ffd166', '黄'], ['#4ade80', '绿'], ['#5cadff', '蓝'], [null, '墨色（跟随主题）']];
    this._inkSws = SW.map(([c, name]) => {
      const b = hEl('button', { class: 'ink-sw' + (c ? '' : ' ink-auto'), title: name }, swRow);
      if (c) b.style.background = c;
      b.addEventListener('click', () => {
        // 有选区时这一下是「给选中的东西换颜色」，别顺手把工具切回画笔、把选区丢掉
        if (!(this._inkSel && this._inkSel.idx.length)) this._inkTool = 'pen';
        this._inkSetColor(c || (this._inkCol || inkCol()));
      });
      b.__c = c;
      return b;
    });
    hEl('div', { class: 'ink-pal-t' }, gc.__pop).textContent = '最近用过';
    this._inkPalGrid = hEl('div', { class: 'ink-pal-grid' }, gc.__pop);
    const cRow = hEl('div', { class: 'ink-pal-row' }, gc.__pop);
    this._inkPick = hEl('input', { class: 'ink-pick', type: 'color', title: '系统取色器' }, cRow);
    this._inkPick.addEventListener('input', () => this._inkSetColor(this._inkPick.value));
    this._inkTxt = hEl('input', { class: 'ink-pal-txt', type: 'text', placeholder: '#5cadff 或 rgb(92,173,255)', spellcheck: 'false' }, cRow);
    const apply = () => {
      const text = this._inkTxt.value;
      if (this._inkSetColor(text)) { this._inkTxt.classList.remove('bad'); this._inkTxt.value = this._inkColor; }
      else if (text.trim()) { this._inkTxt.classList.add('bad'); }   // 认不出就描红，原值留着让人改
    };
    this._inkTxt.addEventListener('keydown', e => { if (e.key === 'Enter' && e.preventDefault) { e.preventDefault(); apply(); } });
    this._inkTxt.addEventListener('change', apply);
    hEl('div', { class: 'ink-pal-tip' }, gc.__pop).textContent = '支持 #rgb、#rrggbb、rgb()、rgba()、hsl()，回车应用。';
    this._inkPalRepaint();

    /* 虚实 */
    const gd = this._inkDG = group('线型：实线 / 虚线 / 点线 / 线点 / 长短线；选中图形后改的是所选图形的线型');
    gd.__pop.classList.add('ink-pop-grid');
    gd.__btn.innerHTML = '<i class="ink-dbar"></i><span class="ink-glbl">实线</span>';
    this._inkDBar = gd.__btn.querySelector('i');
    this._inkDLbl = gd.__btn.querySelector('span');
    this._inkDs = [['solid', '实线'], ['dash', '虚线'], ['dot', '点线'], ['dashdot', '线点'], ['longdash', '长短线']].map(([d, name]) => {
      const b = opt(gd.__pop, '<i class="ink-dbar ink-d-' + d + '"></i>', name, '线型：' + name);
      b.__d = d;
      b.addEventListener('click', () => { this._inkDash = d; this._inkApplyDash(d); this._inkSyncTools(); this._inkPopClose(); });
      return b;
    });

    /* 笔种：多一支荧光笔——本色宽画、半透明，压在字上还看得见后面的字 */
    const gk = this._inkKG = group('笔种：铅笔 / 钢笔 / 毛笔 / 荧光笔');
    gk.__pop.classList.add('ink-pop-grid');
    gk.__btn.innerHTML = '<svg class="ink-gic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3.2 6.4 15.5 12 20.6l5.6-5.1z"/><path d="M12 14.4v6.2"/></svg><span class="ink-glbl">钢笔</span>';
    this._inkKLbl = gk.__btn.querySelector('span');
    this._inkKs = [['pencil', '铅笔', '铅笔：细一点、带点透明，像石墨'], ['pen', '钢笔', '钢笔：等宽实线'],
      ['brush', '毛笔', '毛笔：两头细、中间粗'], ['marker', '荧光笔', '荧光笔：画得宽、半透明，压在字上做标记']].map(([k, name, title]) => {
      const b = opt(gk.__pop, '', name, title);
      b.__k = k;
      b.addEventListener('click', () => { this._inkKind = k; this._inkSyncTools(); this._inkPopClose(); });
      return b;
    });

    /* 图形：画布上直接放一枚常用图形（用当前颜色 / 粗细 / 线型），摆在画面正中 */
    if (this._inkPad) {
      const gs = this._inkSg = group('图形：插入常用图形，摆在画面中央，用当前颜色和粗细');
      gs.__pop.classList.add('ink-pop-grid');
      gs.__btn.innerHTML = '<svg class="ink-gic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3.2" y="9" width="9.6" height="9.6" rx="1.4"/><path d="M11 9 16.4 3.4 21.8 9z"/></svg><span class="ink-glbl">图形</span>';
      const shapes = [['line', '直线'], ['arrow', '箭头'], ['rect', '矩形'], ['circle', '圆'], ['ellipse', '椭圆'],
        ['tri', '三角形'], ['penta', '正五边形'], ['star', '五角星'], ['para', '抛物线'], ['hyper', '双曲线'], ['sin', '正弦线']];
      this._inkShps = shapes.map(([k, name]) => {
        const b = opt(gs.__pop, '', name, '插入' + name);
        b.__k = k;
        b.addEventListener('click', () => { this._inkPopClose(); this._inkInsertShape(k); });
        return b;
      });
    }

    /* 填充：形状内部上色。一排圆圈选色（不写汉字，颜色自己就是名字），末尾一格自选任意颜色；
       选好颜色后插的图形自动带上，已经有选区的话直接把所选图形改成这个填充 */
    if (this._inkPad) {
      const gf = this._inkFg = group('填充：图形内部上色（选中图形后点圆圈改颜色，最后一个彩虹圈自选颜色）');
      gf.__pop.classList.add('ink-pop-grid', 'ink-pop-fill');
      gf.__btn.innerHTML = '<i class="ink-fdot"></i><span class="ink-glbl">填充</span>';
      this._inkFDot = gf.__btn.querySelector('i');
      const FL = [[null, '无填充（空心）'], ['rgba(92,173,255,0.22)', '蓝'], ['rgba(255,90,110,0.20)', '红'],
        ['rgba(74,222,128,0.20)', '绿'], ['rgba(255,209,102,0.24)', '黄'], ['rgba(255,255,255,0.55)', '白']];
      this._inkFills = FL.map(([f, name]) => {
        const b = hEl('button', { class: 'ink-o ink-ofill' + (f ? '' : ' ink-ofnone'), title: '填充：' + name }, gf.__pop);
        const sw = hEl('i', { class: 'ink-fsw' + (f ? '' : ' none') }, b);
        if (f) sw.setAttribute('style', 'background:' + f);
        b.__f = f;
        b.addEventListener('click', () => { this._inkFill = f; this._inkApplyFill(); this._inkSyncTools(); this._inkPopClose(); });
        return b;
      });
      // 自选：原生取色器做成一枚彩虹圈，取到的颜色按 28% 透明度当填充
      const fp = this._inkFPick = hEl('input', {
        class: 'ink-fpick', type: 'color', value: '#5cadff', title: '自选填充色',
      }, gf.__pop);
      const hexRgba = (hex, a) => {
        const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
        if (!m) return null;
        const n = parseInt(m[1], 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
      };
      fp.addEventListener('input', () => {
        const c = hexRgba(fp.value, 0.28);
        if (!c) return;
        this._inkFill = c;
        this._inkApplyFill();
        this._inkSyncTools();
      });
      fp.addEventListener('change', () => { if (this._inkPopClose) this._inkPopClose(); });
    }

    /* 方向：把选中的图形左右 / 上下翻转，或转 ±90°（先框选或套索选中）。
       手写笔画、图形、多边形直接换算点位；图片与矢量块记翻转 / 旋转标记，渲染时在自身框里换算 */
    const gt = this._inkTG = group('方向：拖选区上方的圆钮可任意角度旋转（Shift 按 15° 吸）；直线 / 向量可直接拖端点；下面四个钮做翻转和转 90°');
    gt.__pop.classList.add('ink-pop-grid');
    gt.__btn.innerHTML = '<svg class="ink-gic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M9 6 12 3l3 3"/><path d="M9 18l3 3 3-3"/><path d="M3 12h18"/><path d="M6 9 3 12l3 3"/><path d="M18 9l3 3-3 3"/></svg><span class="ink-glbl">方向</span>';
    const TDIR = [['flipH', '左右翻转', '左右翻转：镜像调头'], ['flipV', '上下翻转', '上下翻转：上下颠倒'],
      ['rot90', '转 90°', '顺时针转 90°'], ['rot270', '回转 90°', '逆时针转 90°']];
    this._inkTdirs = TDIR.map(([k, name, title]) => {
      const b = opt(gt.__pop, '', name, title);
      b.__k = k;
      b.addEventListener('click', () => { this._inkPopClose(); this._inkTransformSel(k); });
      return b;
    });

    sep();
    /* 动作：图标 + 名字。站内画板上名字照常显示；画布的按钮更紧凑，CSS 只留图标（名字进 title） */
    const act = (icon, label, title) => {
      const b = hEl('button', { class: 'dl ink-act', title }, bar);
      b.innerHTML = '<span class="ink-aic" aria-hidden="true">' + icon + '</span><span class="ink-albl">' + label + '</span>';
      b.__lbl = b.querySelector('.ink-albl');
      return b;
    };
    // 撤销：回退整步操作（画、擦、拖、缩放、换色、填充、剪选…），Ctrl+Z 同效
    const undo = this._inkUndoBtn = act('↶', '撤销', '撤销（Ctrl+Z）：回退上一步');
    undo.addEventListener('click', () => this._inkUndoStep());
    this._inkDel = act('⌫', '删除所选', '把选中的笔画整片删掉（先框选或套索）');
    this._inkDel.addEventListener('click', () => this._inkDeleteSel());
    this._inkClr = act('✕', '清空', '清空这块画布上的全部批注（点两次确认）');
    let timer = 0;
    this._inkClr.addEventListener('click', () => {
      const lbl = this._inkClr.__lbl;
      if (!this._inkClr.classList.contains('ask')) {   // 第一下只是亮一下问一声，免得手滑清光
        this._inkClr.classList.add('ask'); if (lbl) lbl.textContent = '确认清空？';
        clearTimeout(timer);
        timer = setTimeout(() => { this._inkClr.classList.remove('ask'); if (lbl) lbl.textContent = '清空'; }, 2600);
        return;
      }
      clearTimeout(timer);
      this._inkClr.classList.remove('ask'); if (lbl) lbl.textContent = '清空';
      this._inkClearSel();
      if (this._inkStrokes.length) this._inkSnapshot();
      this._inkStrokes = []; this._inkRender(); this._inkSave();
    });
    // 保存：整块画板（图形 + 批注）一起导出 —— 站在讲解页的板上批注时，导出的就是那张板书
    const save = act('⤓', '保存', '把整块画板（图形 + 批注）存成 PNG 图片');
    save.addEventListener('click', () => { const p = this.exportPNG(); if (p && p.catch) p.catch(() => { /* 导出失败不吵人 */ }); });
    // 截图：选一块屏幕区域拍下来，直接贴进画布（也可以对着截图按 Ctrl+V 粘进来）
    if (this._inkPad) {
      const shot = this._inkShotBtn = act('▣', '截图', '截取屏幕一块贴到画布上；截图在剪贴板里也可以直接 Ctrl+V');
      shot.addEventListener('click', () => this._inkShot());
      // 本页截图：不用选屏幕，直接把这一页（图形 + 批注 + 纸面）拍成图片贴上来
      const self = this._inkSelfBtn = act('▤', '本页', '把这一页画板截成图片贴到画布上（含图形与批注）');
      self.addEventListener('click', () => this._inkShotSelf());
    }

    /* 收起：只有画布有。收成一枚按钮贴在工具条那一侧，点空白处自动收回去。
       挨着它还挂一枚图钉：常驻 = 点画布空白不再收回，再点恢复自动收回（存进设置，设置页也有同一项） */
    if (this._inkFold) {
      const pin = this._inkPinBtn = hEl('button', { class: 'ink-pin', title: '工具条自动收回：点画布空白收成一个小钮（点一下改常驻）' }, bar);
      pin.innerHTML = ico('<path d="M8.2 3.4h7.6"/><path d="M10 3.4v6.2l-3.1 3.1v1.8h10.2v-1.8L14 9.6V3.4"/><path d="M12 14.5v6.2"/>');
      pin.addEventListener('click', e => {
        if (e && e.stopPropagation) e.stopPropagation();
        setPref('inkBar', PREFS.inkBar === 'pin' ? 'auto' : 'pin');
        this._inkSyncTools();
        this._inkTipSay(PREFS.inkBar === 'pin' ? '工具条已常驻：点画布空白不再收回' : '工具条改回自动收回：点画布空白收成一个小钮');
      });
      const f = this._inkFoldBtn = hEl('button', { class: 'ink-fold', title: '收起工具条（点画布空白处也会自动收起）' }, bar);
      f.innerHTML = ico('<path d="M13.5 5.5 7.5 12l6 6.5"/>');
      f.addEventListener('click', e => { if (e && e.stopPropagation) e.stopPropagation(); this._inkFoldTo(!this._inkMin); });
    }

    /* 点别处收起面板：监听 pointerdown（先于重排）——点色块会重建「最近用过」，
       等 click 再判时目标节点已经从 DOM 上摘下来了，contain 认不出，面板会被误收 */
    const onDoc = e => {
      const t = e && e.target;
      if (!t) return;
      for (const g of this._inkPops) if (g.contains && g.contains(t)) return;
      this._inkPopClose();
    };
    if (document.addEventListener) {
      document.addEventListener('pointerdown', onDoc, true);
      this._offInkPalDoc = () => document.removeEventListener && document.removeEventListener('pointerdown', onDoc, true);
    }

    this._inkSyncTools();
  }
  _inkSyncTools() {
    if (this._inkPen) this._inkPen.classList.toggle('on', this._inkTool === 'pen');
    if (this._inkSelT) this._inkSelT.classList.toggle('on', this._inkTool === 'sel');
    if (this._inkEraser) this._inkEraser.classList.toggle('on', this._inkTool === 'eraser');
    if (this._inkRect) this._inkRect.classList.toggle('on', this._inkTool === 'rect');
    if (this._inkLasso) this._inkLasso.classList.toggle('on', this._inkTool === 'lasso');
    if (this._inkTxtT) this._inkTxtT.classList.toggle('on', this._inkTool === 'text');
    if (this._inkPolyT) this._inkPolyT.classList.toggle('on', this._inkTool === 'poly');
    if (this._inkVecT) this._inkVecT.classList.toggle('on', this._inkTool === 'vec');
    const auto = this._inkCol || inkCol();
    (this._inkSws || []).forEach(b => {
      const c = b.__c || auto;
      // 有选区时点色块是给选中的东西换色，这时也把该色块点亮
      const painting = this._inkTool === 'pen' || (this._inkSel && this._inkSel.idx.length);
      b.classList.toggle('on', !!painting && c === this._inkColor);
    });
    // 四枚参数按钮上写着当前值（粗细那道杠的粗细也跟着笔宽走）
    const pick = (arr, k, v) => (arr || []).find(b => b[k] === v) || (arr || []).find(b => typeof v === 'number' && Math.abs(b[k] - v) < 1e-6) || {};
    if (this._inkWLbl) this._inkWLbl.textContent = pick(this._inkWs, '__w', this._inkWidth).__name || '粗细';
    if (this._inkWBar) this._inkWBar.style.height = Math.max(2, Math.round(this._inkWidth * 1.6)) + 'px';
    // 自定笔宽的输入框：正在里面打字就别去改它的值
    if (this._inkWIn) {
      const ae = typeof document !== 'undefined' ? document.activeElement : null;
      if (ae !== this._inkWIn) this._inkWIn.value = String(Math.round(this._inkWidth * 10) / 10);
    }
    if (this._inkCDot) this._inkCDot.style.background = this._inkColor;
    if (this._inkDLbl) this._inkDLbl.textContent = ({ solid: '实线', dash: '虚线', dot: '点线', dashdot: '线点', longdash: '长短线' })[this._inkDash] || '线型';
    if (this._inkDBar) this._inkDBar.style.borderTopStyle = this._inkDash === 'solid' ? 'solid' : this._inkDash === 'dash' ? 'dashed' : 'dotted';
    if (this._inkKLbl) this._inkKLbl.textContent = pick(this._inkKs, '__k', this._inkKind).__name || '笔种';
    if (this._inkPick && /^#[0-9a-f]{6}$/i.test(this._inkColor || '')) this._inkPick.value = this._inkColor;
    (this._inkWs || []).forEach(b => b.classList.toggle('on', Math.abs(b.__w - this._inkWidth) < 1e-6));
    (this._inkDs || []).forEach(b => b.classList.toggle('on', b.__d === this._inkDash));
    (this._inkKs || []).forEach(b => b.classList.toggle('on', b.__k === this._inkKind));
    if (this._inkFDot) this._inkFDot.style.background = this._inkFill || 'transparent';
    (this._inkFills || []).forEach(b => b.classList.toggle('on', (b.__f || null) === (this._inkFill || null)));
    if (this._inkDel) this._inkDel.classList.toggle('hide', !(this._inkSel && this._inkSel.idx.length));
    // 图钉（常驻 / 自动收回）：状态以设置里的 inkBar 为准，设置页改了这里跟着亮
    if (this._inkPinBtn) {
      const pin = PREFS.inkBar === 'pin';
      this._inkPinBtn.classList.toggle('on', pin);
      this._inkPinBtn.title = pin ? '工具条常驻中：点画布空白不会收回（点一下恢复自动收回）' : '工具条自动收回：点画布空白收成一个小钮（点一下改常驻）';
      if (this._inkFoldBtn) {
        this._inkFoldBtn.title = this._inkMin ? '展开工具条'
          : (pin ? '收起工具条（常驻中，点空白不会自动收）' : '收起工具条（点画布空白处也会自动收起）');
      }
    }
    // 套索方式（剪选 / 整条）：跟设置页的 inkSelMode 同一项
    if (this._inkSelModeBtn) {
      const cut = PREFS.inkSelMode === 'cut';
      this._inkSelModeBtn.classList.toggle('on', cut);
      if (this._inkSelModeLbl) this._inkSelModeLbl.textContent = cut ? '剪选' : '整条';
      this._inkSelModeBtn.title = cut
        ? '套索：按形状剪选——圈到哪段选哪段，跨界的笔画在边界处剪开（点一下切成「整条选」）'
        : '套索：整条选——碰到哪条就整条选中（点一下切成「按形状剪选」）';
    }
    this._inkUndoSync();
    this._inkApplyCursor();
  }
  /* ---------- 鼠标样式：跟着当前工具与悬停位置换 ---------- */
  /** 当前工具的基本样式：选择是箭头、文字是文本光标、橡皮自己画一枚，其余一律十字准星 */
  _inkCursor() {
    const t = this._inkTool;
    if (t === 'sel') return 'default';
    if (t === 'text') return 'text';
    if (t === 'eraser') return ERASER_CURSOR;
    return 'crosshair';
  }
  _inkApplyCursor() {
    if (!this.svg || !this.svg.style || !this._inkOn || this.orbitCam) return;
    const c = this._inkCursor();
    if (this.svg.style.cursor !== c) this.svg.style.cursor = c;
  }
  /** 悬停再细分：右下把手是斜向缩放，选区里是「能拖走」，文字上是文本光标 */
  _inkHoverCursor(p) {
    if (!this.svg || !this.svg.style || !this._inkOn || this.orbitCam) return;
    const t = this._inkTool;
    let c = this._inkCursor();
    if (this._inkRotHit(p)) c = 'grab';
    else if (this._inkEndHit(p)) c = 'pointer';
    else if (this._inkHandleHit(p)) c = 'nwse-resize';
    else if ((t === 'sel' || t === 'rect' || t === 'lasso') && this._inkSel && this._inkInSel(p)) c = 'move';
    else if (t === 'text' && this._inkTextAt(p) >= 0) c = 'text';
    if (this.svg.style.cursor !== c) this.svg.style.cursor = c;
  }
  /* ---------- 批注参数面板：四枚按钮各挂一块，同一时刻只开一块 ---------- */
  _inkPopToggle(g) {
    const open = g.classList.contains('open');
    this._inkPopClose();
    if (open) return;
    g.classList.add('open');
    if (g === this._inkCG) { this._inkPalOpen = true; this._inkPalRepaint(); }   // 每次展开都照最新的缓存重排
  }
  _inkPopClose() {
    for (const g of this._inkPops || []) g.classList.remove('open');
    this._inkPalOpen = false;
  }
  /** 调色板（颜色那块面板）的开关：外部只有 setInk 会调，留着这两名字免得改动面太大 */
  _inkPalToggle() { if (this._inkCG) this._inkPopToggle(this._inkCG); }
  _inkPalClose() { this._inkPopClose(); }
  /** 重排「最近用过」的色块 */
  _inkPalRepaint() {
    const g = this._inkPalGrid;
    if (!g) return;
    if (g.innerHTML !== undefined) g.innerHTML = '';
    const list = inkRecent();
    for (const c of list) {
      const b = hEl('button', { class: 'ink-pal-sw', title: c }, g);
      b.setAttribute('style', 'background:' + c);   // 走 style 属性：一个色块一个底色，别互相串
      b.addEventListener('click', () => this._inkSetColor(c));
    }
    if (!list.length) {
      const e = hEl('span', { class: 'ink-pal-empty' }, g);
      e.textContent = '选过的颜色会留在这里';
    }
  }
  /** 取用一色：规整成 #rrggbb、记进「最近用过」、同步各处控件的选中态。
   *  有选区时这一下同时给选中元素的边框换色（图片没有边框，跳过） */
  _inkSetColor(c) {
    const hex = parseInkColor(c);
    if (!hex) return false;
    this._inkColor = hex;
    inkRemember(hex);
    if (this._inkPick) this._inkPick.value = hex;
    if (this._inkTxt) { this._inkTxt.value = hex; this._inkTxt.classList.remove('bad'); }
    this._inkSyncTools();
    if (this._inkPalOpen) this._inkPalRepaint();   // 面板开着才重排；关着等下次展开再说
    if (this._inkSel && this._inkSel.idx.length) this._inkRecolorSel(hex);
    return true;
  }
  /** 给选中元素的边框（线色 / 文字色）换成 hex；填充色不动。返回改了几条。
   *  取色器拖一下会连着触发几十次：1.2 秒内的连续换色合并成一步撤销 */
  _inkRecolorSel(hex) {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length) return 0;
    let n = 0;
    for (const i of sel.idx) {
      const s = this._inkStrokes[i];
      if (!s || s.t === 'img' || s.c === hex) continue;   // 图片没有线色；本来是这色就不记
      n++;
    }
    if (!n) return 0;
    const now = Date.now();
    if (!this._inkRecolorSnapAt || now - this._inkRecolorSnapAt > 1200) this._inkSnapshot();
    this._inkRecolorSnapAt = now;
    n = 0;
    for (const i of sel.idx) {
      const s = this._inkStrokes[i];
      if (!s || s.t === 'img') continue;
      s.c = hex; n++;
    }
    this._inkRender();
    this._inkSaveSoon();
    return n;
  }
  /** 换粗细 / 换线型这类连续点的操作：1.2 秒内的同一类改动合并成一步撤销 */
  _inkSelPropSnap(kind) {
    const key = '_ink' + kind + 'SnapAt';
    const now = Date.now();
    if (!this[key] || now - this[key] > 1200) this._inkSnapshot();
    this[key] = now;
  }
  /** 有选区时把选中元素的线宽改成 w（图片、文字没有线条粗细，跳过）。返回改了几条 */
  _inkApplyWidth(w) {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length) return 0;
    let n = 0;
    for (const i of sel.idx) {
      const s = this._inkStrokes[i];
      if (!s || s.t === 'img' || s.t === 'txt' || s.w === w) continue;
      n++;
    }
    if (!n) return 0;
    this._inkSelPropSnap('Width');
    for (const i of sel.idx) {
      const s = this._inkStrokes[i];
      if (!s || s.t === 'img' || s.t === 'txt') continue;
      s.w = w;
    }
    this._inkRender();
    this._inkSaveSoon();
    return n;
  }
  /** 有选区时把选中元素的线型改成 d（solid / dash / dot / dashdot / longdash） */
  _inkApplyDash(d) {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length) return 0;
    let n = 0;
    for (const i of sel.idx) {
      const s = this._inkStrokes[i];
      if (!s || s.t === 'img' || s.t === 'txt' || (s.dash || 'solid') === d) continue;
      n++;
    }
    if (!n) return 0;
    this._inkSelPropSnap('Dash');
    for (const i of sel.idx) {
      const s = this._inkStrokes[i];
      if (!s || s.t === 'img' || s.t === 'txt') continue;
      s.dash = d;
    }
    this._inkRender();
    this._inkSaveSoon();
    return n;
  }
  /** 图片 / 矢量块在自身框里翻转、旋转：按当前框现算 transform，拖动、缩放都还贴得住 */
  _inkBoxTf(s, x, y, w, h) {
    const cx = x + w / 2, cy = y + h / 2, t = [];
    if (s.fx) t.push('translate(' + Math.round(cx * 2 * 100) / 100 + ' 0) scale(-1 1)');
    if (s.fy) t.push('translate(0 ' + Math.round(cy * 2 * 100) / 100 + ') scale(1 -1)');
    if (s.rot) t.push('rotate(' + (Math.round(s.rot * 100) / 100) + ' ' + Math.round(cx * 100) / 100 + ' ' + Math.round(cy * 100) / 100 + ')');
    return t.join(' ');
  }
  /** 图片 / 矢量块「没转之前」的内容尺寸。pts 那两点给的是轴对齐的紧包围盒：
   *  转过 90° 的老存档没存 cw/ch，按宽高对调推回来；自由旋转过的一定存了 cw/ch。 */
  _inkContentDims(s, w, h) {
    if (s.cw && s.ch) return [s.cw, s.ch];
    if (s.rot && Math.abs(s.rot % 180) === 90) return [h, w];
    return [w, h];
  }
  /** 把选中的图形换方向：左右翻转 / 上下翻转 / 转 ±90°。
   *  手写笔画、图形、多边形的点位直接绕选区中心换算（落进存档里，拖动缩放照常）；
   *  图片 / 矢量块只翻不裁，翻转与旋转记成标记，渲染时在自身框里换算。 */
  _inkTransformSel(mode) {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length) { this._inkTipSay('先框选或套索选中图形，再调方向'); return 0; }
    if (mode === 'flipH' || mode === 'flipV' || mode === 'rot90' || mode === 'rot270') {
      const b = sel.bbox, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
      const cw = mode === 'rot90';
      const tx = p => {
        if (mode === 'flipH') return { x: 2 * cx - p.x, y: p.y };
        if (mode === 'flipV') return { x: p.x, y: 2 * cy - p.y };
        // 屏幕 y 朝下：顺时针 = (dx,dy) → (-dy,dx)，逆时针反过来
        return cw ? { x: cx - (p.y - cy), y: cy + (p.x - cx) }
                  : { x: cx + (p.y - cy), y: cy - (p.x - cx) };
      };
      this._inkSnapshot();
      for (const i of sel.idx) {
        const s = this._inkStrokes[i];
        if (!s || !s.pts || !s.pts.length) continue;
        if (s.t === 'img' || s.t === 'svg' || s.t === 'txt') {
          if (mode === 'flipH') { if (s.t !== 'txt') s.fx = !s.fx; }
          else if (mode === 'flipV') { if (s.t !== 'txt') s.fy = !s.fy; }
          else {   // 转 90°：图片 / 矢量块宽高对调，框绕「转过去以后的中心」重摆；文字整行绕自身框中心转
            if (s.t !== 'txt') {
              // 内容尺寸先存下来（老存档按对调推），之后自由旋转全靠它画回原形
              const [cw0, ch0] = this._inkContentDims(s, Math.abs(s.pts[1].x - s.pts[0].x), Math.abs(s.pts[1].y - s.pts[0].y));
              s.cw = cw0; s.ch = ch0;
            }
            s.rot = (((s.rot || 0) + (cw ? 90 : 270)) % 360 + 360) % 360;
          }
          if (mode === 'rot90' || mode === 'rot270') {
            const a = s.pts[0], q = s.pts[1];
            const ic = { x: (a.x + q.x) / 2, y: (a.y + q.y) / 2 };
            const nc = tx(ic);
            if (s.t === 'txt') {
              // 文字只是整行绕框心转：框尺寸不变，换个新中心（重排时 _inkMeasureTexts 会按这个角再量）
              const hw = Math.abs(q.x - a.x) / 2, hh = Math.abs(q.y - a.y) / 2;
              s.pts = [{ x: nc.x - hw, y: nc.y - hh }, { x: nc.x + hw, y: nc.y + hh }];
            } else {
              const nw = Math.abs(q.y - a.y), nh = Math.abs(q.x - a.x);   // 转过来宽高对调
              s.pts = [{ x: nc.x - nw / 2, y: nc.y - nh / 2 }, { x: nc.x + nw / 2, y: nc.y + nh / 2 }];
            }
          } else {
            s.pts = s.pts.map(tx);
          }
          continue;
        }
        s.pts = s.pts.map(tx);
        if (s.ctr) s.ctr = tx(s.ctr);
      }
      // 选区框跟着走：套索框按同一套换算；外接框按新点位重量
      if (sel.poly) sel.poly = sel.poly.map(tx);
      const all = [];
      for (const i of sel.idx) { const s = this._inkStrokes[i]; if (s && s.pts) all.push(...s.pts); }
      if (all.length) sel.bbox = bboxOf(all);
      this._inkRender(); this._inkSave();
      const NAME = { flipH: '已左右翻转', flipV: '已上下翻转', rot90: '已顺时针转 90°', rot270: '已逆时针转 90°' };
      this._inkTipSay(NAME[mode] || '已换方向');
      return sel.idx.length;
    }
    return 0;
  }
  /** 进出批注模式（操作条上的「✎ 批注」与外部调用都走这里）；退出时落一次盘 */
  setInk(on) {
    const v = on == null ? !this._inkOn : !!on;
    if (v === this._inkOn) return;
    this._inkOn = v;
    this._inkCur = null; this._inkErasing = false;
    this._inkStopSnap();
    this._inkSelDrag = null; this._inkDrag = null;
    this._inkRot = null; this._inkEnd = null;
    this._inkPolyCancel();
    this._inkTextStop(true);
    this._inkResize = null;
    this._inkPrevClear();
    this._inkPalClose();
    if (this._inkSel) { this._inkSel = null; this._inkSelRender(); }
    // 进出模式时若还有没抬笔的临时笔画，先把它摘掉（不落盘，免得画出半截线条）
    this._inkTmpClear();
    if (this.root && this.root.classList) this.root.classList.toggle('ink-on', v);
    this._inkSyncTools();
    if (this._inkBtn) {
      this._inkBtn.classList.toggle('on', v);
      this._inkBtn.textContent = v ? '✎ 批注中' : '✎ 批注';
    }
    if (this.svg && this.svg.style) {
      if (v) this.svg.style.cursor = this._inkCursor();
      else if (this.orbitCam) this.svg.style.cursor = 'grab';   // 三维板的 cursor 归 orbit()
      else this._syncVB();
    }
    if (!v) this._inkSave();
  }
  /** 批注工具的当前设置（工具 / 颜色 / 粗细 / 线型 / 笔种）。
   *  画布分页时每一页各是一块板，翻页靠它把「手上这支笔」带过去，别让换一页又变回默认色。 */
  inkState() {
    return {
      tool: this._inkTool, color: this._inkColor, width: this._inkWidth, kind: this._inkKind, dash: this._inkDash,
      fill: this._inkFill || null, min: !!this._inkMin,   // min：工具条收起没有，换页也得跟着走，不然一滑页就自己弹开
    };
  }
  /** 批注工具条那个元素（画布把它搬到顶上那条公共的位置上，翻页时换一条进去） */
  inkBarEl() { return this._inkBar || null; }
  setInkState(st) {
    if (!st) return;
    if (st.tool) this._inkTool = st.tool;
    if (st.color) this._inkColor = st.color;
    if (st.width) this._inkWidth = st.width;
    if (st.kind) this._inkKind = st.kind;
    if (st.dash) this._inkDash = st.dash;
    if (st.fill !== undefined) this._inkFill = st.fill || null;
    // 收起的工具条跟着笔一起交接（只认有展开钮的板，站内画板没有这一件）
    if (st.min !== undefined && this._inkFold) this._inkFoldTo(!!st.min);
    if (this._inkPick && /^#[0-9a-f]{6}$/i.test(this._inkColor || '')) this._inkPick.value = this._inkColor;
    if (this._inkTxt && /^#[0-9a-f]{6}$/i.test(this._inkColor || '')) this._inkTxt.value = this._inkColor;
    this._inkSyncTools();
  }
  _bindInk() {
    const svg = this.svg;
    if (!svg.addEventListener) return;
    svg.addEventListener('pointerdown', ev => {
      if (!this._inkOn) return;
      if (ev.button != null && ev.button !== 0) return;
      this._inkSyncId();
      const p = this.px(ev), tool = this._inkTool;
      this._inkTap = { t: Date.now(), x: p.x, y: p.y };   // 画布：抬手时判「是不是点了一下空白」（收工具条用）
      if (this._inkTextIn) this._inkTextStop(true);       // 点别处先把手上的文字落下来
      const eh = this._inkEndHit(p);
      if (this._inkRotHit(p)) {                           // 选区上方的圆钮：任意角度旋转
        this._inkRotStart(p);
      } else if (eh) {                                    // 直线 / 向量的端点：拖着改方向
        this._inkEndDragStart(eh);
      } else if (this._inkHandleHit(p)) {                 // 图片 / 矢量块右下角的小方块：按住缩放
        this._inkResizeStart(p);
      } else if (tool === 'sel') {
        // 选择：点到谁选谁；Ctrl / ⌘ + 点加选、减选；按在已有的选区里就是整片拖走；点空白取消选择
        const mod = !!(ev.ctrlKey || ev.metaKey);
        if (mod) {
          const hit = this._inkHitTop(p);
          if (hit >= 0) this._inkToggleSel(hit);   // 加选 / 减选：不开始拖动，方便连着点好几个
        } else if (this._inkSel && this._inkInSel(p)) this._inkStartDrag(p);
        else {
          const hit = this._inkHitTop(p);
          if (hit >= 0) { this._inkSetSel([hit]); this._inkStartDrag(p); }
          else this._inkClearSel();
        }
      } else if (tool === 'eraser') {
        this._inkErasing = true;
        this._inkEraseTook = false;     // 一次拖动擦掉的东西合成一步撤销
        this._inkEraseAt(p);
      } else if (tool === 'text') {
        const ti = this._inkTextAt(p);
        if (ti >= 0) this._inkTextStart(ti); else this._inkNewText(p);
      } else if (tool === 'poly') {
        this._inkPolyDown(p);
      } else if (tool === 'rect' || tool === 'lasso') {
        const mod = !!(ev.ctrlKey || ev.metaKey);
        const chit = mod ? this._inkHitTop(p) : -1;
        if (mod) {
          if (chit >= 0) this._inkToggleSel(chit);     // Ctrl 点选：在选区上加减一条，不重开框
        } else if (this._inkSel && this._inkInSel(p)) this._inkStartDrag(p);   // 按在选区里：整片拖走
        else {
          this._inkClearSel();
          this._inkSelDrag = { tool, pts: [p] };
          this._inkSelPreview(this._inkSelDrag);
        }
      } else {
        this._inkClearSel();
        const s = { c: this._inkColor, w: this._inkWidth, pts: [p], kind: this._inkKind, dash: this._inkDash };
        if (tool === 'vec') { s.t = 'vec'; s.kind = 'pen'; s.dash = 'solid'; }   // 向量：实线箭头，不认形状
        this._inkCur = s;
        this._inkTmpEls = this._inkDrawStroke(s, this.inkLayer);
        if (tool !== 'vec') this._inkSnapSoon();
      }
      if (svg.setPointerCapture && ev.pointerId != null) { try { svg.setPointerCapture(ev.pointerId); } catch (_) { /* 无指针捕获的环境跳过 */ } }
      if (ev.stopPropagation) ev.stopPropagation(); // 拖动平移 / 三维转视角 / 把手都让路
      if (ev.preventDefault) ev.preventDefault();
    }, { capture: true });
    svg.addEventListener('pointermove', ev => {
      if (!this._inkOn) return;
      const p = this.px(ev);
      // 悬停样式：没在拖 / 没在画的时候才更新（拖动、落笔过程中的样式由各分支自己保持）
      if (!this._inkResize && !this._inkDrag && !this._inkErasing && !this._inkSelDrag && !this._inkCur && !this._inkPoly && !this._inkRot && !this._inkEnd) {
        this._inkHoverCursor(p);
      }
      if (this._inkRot) { this._inkRotTo(p, ev.shiftKey); return; }
      if (this._inkEnd) { this._inkEndDragTo(p, ev.shiftKey); return; }
      if (this._inkResize) { this._inkResizeTo(p, ev.shiftKey); return; }
      if (this._inkDrag) { this._inkMoveTo(p); return; }
      if (this._inkErasing) { this._inkEraseAt(p); return; }
      if (this._inkPoly && this._inkPoly.pts.length) { this._inkPolyPreview(p); return; }   // 多边形：预览还没落下的那条边
      if (this._inkSelDrag) {                                   // 框选 / 套索：拉预览
        const d = this._inkSelDrag, pts = d.pts, l = pts[pts.length - 1];
        if (d.tool === 'rect') pts[1] = p;
        else if (!l || Math.abs(p.x - l.x) + Math.abs(p.y - l.y) >= 1.2) pts.push(p);
        this._inkSelPreview(d);
        return;
      }
      const s = this._inkCur;
      if (!s) return;
      if (s.snapped) return;                                    // 已吸附成规整图形，不再随手指走形
      const l = s.pts[s.pts.length - 1];
      if (l && Math.abs(p.x - l.x) + Math.abs(p.y - l.y) < 0.8) return; // 手抖过滤：太近的点不记
      s.pts.push(p);
      this._inkTmpRender(s);
      this._inkSnapSoon();                                      // 停手就判形状
    });
    const up = ev => {
      const tap = this._inkTap; this._inkTap = null;
      // 画布：只点了一下（没拖笔）就当作点空白，把工具条收回；真在画东西时不收，免得手一落笔条就没了。
      // 设置里选了「常驻」（inkBar = 'pin'）就不收，条一直留在原位
      if (tap && this._inkFold && !this._inkMin && PREFS.inkBar !== 'pin' && Date.now() - tap.t < 400 && this._inkTool !== 'poly' && this._inkTool !== 'text') {
        let moved = false;
        if (ev && ev.clientX != null) { try { const q = this.px(ev); moved = Math.hypot(q.x - tap.x, q.y - tap.y) > 6; } catch (_) { moved = true; } }
        if (!moved) this._inkFoldTo(true);
      }
      if (this._inkRot) { this._inkRotEnd(); return; }
      if (this._inkEnd) { this._inkEndDragEnd(); return; }
      if (this._inkResize) { this._inkResizeEnd(); return; }
      if (this._inkDrag) { this._inkMoveEnd(); return; }
      if (this._inkErasing) { this._inkErasing = false; return; }
      if (this._inkSelDrag) { this._inkEndSel(); return; }
      const s = this._inkCur;
      if (!s) return;
      this._inkStopSnap();
      this._inkCur = null;
      if (!s.snapped && s.t !== 'vec') this._inkTrySnap(s);      // 抬笔再试一次：快速一笔也能判
      this._inkTmpClear();
      if (s.t === 'vec' && s.pts.length > 1) s.pts = [s.pts[0], s.pts[s.pts.length - 1]];   // 向量只留起点与终点
      if (s.pts.length) { this._inkSnapshot(); this._inkStrokes.push(s); this._inkRender(); this._inkSave(); }
    };
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    // 双击：改字；多边形就地收口（两下都落在同一个顶点上，收口时会把重复的那个去掉）。
    // 拿笔画的时候不抢双击——那两下会先落下两个点，改字走「文字」工具点一下更干净
    svg.addEventListener('dblclick', ev => {
      if (!this._inkOn) return;
      const p = this.px(ev);
      if (this._inkTool === 'poly' && this._inkPoly && this._inkPoly.pts.length >= 2) { this._inkPolyClose(); return; }
      if (this._inkTool === 'pen' || this._inkTool === 'vec') return;
      this._inkTextStop(true);      // 手上还开着的那行先落下来：它可能是空字，splice 会把下标挪位
      const i = this._inkTextAt(p);
      if (i >= 0) { if (ev.preventDefault) ev.preventDefault(); this._inkTextStart(i); }
    });
    // Delete / Backspace：有选区就删掉所选（输入框、文本域里打字时不抢）
    if (typeof document !== 'undefined' && document.addEventListener) {
      const onKey = e => {
        if (!this._inkOn) return;
        const t = e.target;
        const inField = !!(t && ((t.tagName && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || t.isContentEditable));
        // Ctrl/⌘+Z：回退一步（正在输入框里打字时让给浏览器自己的撤销）
        if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey) && !e.shiftKey && !inField) {
          if (e.preventDefault) e.preventDefault();
          this._inkUndoStep();
          return;
        }
        if (!this._inkSel || !this._inkSel.idx.length) return;
        if (e.key !== 'Delete' && e.key !== 'Backspace') return;
        if (inField) return;
        if (e.preventDefault) e.preventDefault();
        this._inkDeleteSel();
      };
      document.addEventListener('keydown', onKey);
      this._offInkKey = () => document.removeEventListener('keydown', onKey);
    }
    // 不挂 pointerleave：指针捕获期间越过工具条时它会误收笔，一条线被截成两段；pointerup 由捕获保证送到
  }
  /** 停手 0.42 秒就判一次形状（还没抬笔也能吸附） */
  _inkSnapSoon() {
    this._inkStopSnap();
    this._inkSnapTimer = setTimeout(() => {
      this._inkSnapTimer = 0;
      const s = this._inkCur;
      if (!s || s.snapped) return;
      if (this._inkTrySnap(s)) this._inkTmpRender(s);
    }, 420);
  }
  _inkStopSnap() { if (this._inkSnapTimer) { clearTimeout(this._inkSnapTimer); this._inkSnapTimer = 0; } }
  /** 认得出直线/圆/椭圆就替换成规整图形，认不出原样留着 */
  _inkTrySnap(s) {
    const r = recognizeShape(s.pts || []);
    if (!r) return false;
    s.pts = r.pts;
    s.snap = r.shape;
    if (r.shape === 'circle' || r.shape === 'ellipse') s.cl = 1;   // 手画圆收成整圆后也算闭合，可以填色
    if (r.ctr) s.ctr = r.ctr; else delete s.ctr;
    s.snapped = true;
    this._inkFlash(r.shape);
    return true;
  }
  _inkFlash(shape) {
    const NAME = { line: '直线', circle: '圆', ellipse: '椭圆', parabola: '抛物线', hyperbola: '双曲线' };
    this._inkTipSay('已吸附：' + (NAME[shape] || '图形'));
  }
  /** 一句短提示（吸附成功 / 插入图形 / 截图结果…）：贴在**这块画板**下方正中，1.8 秒自隐。
   *  不写进工具条（会把条撑宽、收起时还挂着它），也不挂到页面中间（离用户正在看的地方太远）；
   *  设置页「操作提示」选「不提示」就整项静音 */
  _inkTipSay(text) {
    if (!text || PREFS.inkTip === 'off') return;
    const host = this.root || (typeof document !== 'undefined' ? document.body : null);
    if (!host || !host.appendChild) return;
    let el = this._inkToastEl;
    if (!el || !el.isConnected || el.parentNode !== host) {
      el = this._inkToastEl = document.createElement('div');
      el.className = 'ink-toast';
      host.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('on');
    clearTimeout(this._inkToastT);
    this._inkToastT = setTimeout(() => { if (el.classList) el.classList.remove('on'); }, 1800);
  }
  /** 换色 / 换填充这种连续拖动会频繁重画的落盘：攒一小会儿再写，别把 localStorage 写爆 */
  _inkSaveSoon() {
    if (this._inkSaveT) clearTimeout(this._inkSaveT);
    this._inkSaveT = setTimeout(() => { this._inkSaveT = 0; this._inkSave(); }, 320);
  }
  /* ---------- 撤销 / 回退：每次动手前拍一张笔画快照 ---------- */
  /** 拍快照压进撤销栈。点位深拷贝（要能回退拖动 / 缩放），图片的 dataURL、文字串这些大字串按引用共享，不复制 */
  _inkSnapshot() {
    if (!this._inkUndoStack) this._inkUndoStack = [];
    const st = this._inkStrokes.map(s => {
      const c = { ...s };
      if (s.pts) c.pts = s.pts.map(q => ({ x: q.x, y: q.y }));
      if (s.ctr) c.ctr = { x: s.ctr.x, y: s.ctr.y };
      if (s.ob) c.ob = { ...s.ob };
      return c;
    });
    this._inkUndoStack.push(st);
    if (this._inkUndoStack.length > 60) this._inkUndoStack.shift();
    this._inkUndoSync();
    return st;
  }
  /** 某一步其实没改动内容：把刚拍的快照撤掉，别在撤销栈里留空步 */
  _inkDropSnap(snap) {
    const stack = this._inkUndoStack || [];
    if (snap && stack[stack.length - 1] === snap) { stack.pop(); this._inkUndoSync(); }
  }
  _inkUndoStep() {
    const stack = this._inkUndoStack || [];
    if (!stack.length) { this._inkTipSay('没有可回退的操作了'); return false; }
    this._inkTextStop(true);
    this._inkPolyCancel();
    // 手上还有没抬笔的手势（拖 / 缩放 / 框选 / 落笔）一律先放下，免得撤销后元素表对不上
    this._inkDrag = null; this._inkResize = null; this._inkSelDrag = null;
    this._inkRot = null; this._inkEnd = null;
    this._inkErasing = false; this._inkCur = null; this._inkTmpClear(); this._inkPrevClear();
    this._inkClearSel();
    this._inkStrokes = stack.pop();
    this._inkRecolorSnapAt = 0; this._inkWidthSnapAt = 0; this._inkDashSnapAt = 0;
    this._inkRender(); this._inkSave(); this._inkUndoSync();
    this._inkTipSay('已回退一步');
    return true;
  }
  /** 撤销按钮的状态：有快照才亮，title 里报还能退几步 */
  _inkUndoSync() {
    const b = this._inkUndoBtn;
    if (!b) return;
    const n = (this._inkUndoStack || []).length;
    b.classList.toggle('off', !n);
    b.title = n ? '撤销（Ctrl+Z）：回退上一步，还能回退 ' + n + ' 步' : '撤销（Ctrl+Z）：还没有可回退的操作';
  }
  /** 工具条收起 / 展开（只有画布会用到）：收起来只留一枚小钮，点画布空白处自动收。
   *  箭头方向跟着位置走：钉在顶上朝上收，贴着左/右边就朝左/右收（画布换页时这个状态会跟着传过去）。 */
  _inkFoldTo(v) {
    this._inkMin = !!v;
    const bar = this._inkBar;
    if (bar && bar.classList) {
      bar.classList.toggle('min', this._inkMin);
      // 条贴着哪一面：停在上面的公共槽里一律朝上；在板里/侧边就按它的横向位置定左中右
      let dir = 'u';
      try {
        const par = bar.parentNode;
        const docked = !!(par && par.classList && par.classList.contains('dp-dock'));
        if (!docked) {
          const host = (par && par.getBoundingClientRect) ? par : this.root;
          const br = bar.getBoundingClientRect(), hr = host.getBoundingClientRect();
          const rel = hr.width ? ((br.left + br.right) / 2 - hr.left) / hr.width : 0.5;
          dir = rel < 0.36 ? 'l' : rel > 0.64 ? 'r' : 'u';
        }
      } catch (_) { /* 无测量环境：按朝上 */ }
      bar.classList.remove('fold-l', 'fold-r', 'fold-u');
      bar.classList.add('fold-' + dir);
    }
    if (this._inkMin) this._inkPopClose();
    if (this._inkFoldBtn) this._inkFoldBtn.title = this._inkMin ? '展开工具条'
      : (PREFS.inkBar === 'pin' ? '收起工具条（常驻中，点空白不会自动收）' : '收起工具条（点画布空白处也会自动收起）');
  }
  /** 往画面中央插一枚常用图形（用当前颜色 / 粗细 / 线型 / 笔种）。坐标取当前视野中心，缩放后也摆得正 */
  _inkInsertShape(kind) {
    if (!this.inkLayer) return;
    const vb = this._vb || { x: 0, y: 0, w: this.w, h: this.h };
    const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2;
    const S = Math.min(this.w, this.h) * 0.30;
    const P = (x, y) => ({ x: cx + x, y: cy + y });
    const seg = (x0, y0, x1, y1, m = 24) => {
      const o = [];
      for (let i = 0; i <= m; i++) o.push(P(x0 + (x1 - x0) * i / m, y0 + (y1 - y0) * i / m));
      return o;
    };
    const ring = (ra, rb, m = 72) => {
      const o = [];
      for (let i = 0; i <= m; i++) { const t = i / m * Math.PI * 2; o.push(P(ra * Math.cos(t), rb * Math.sin(t))); }
      return o;
    };
    let made = [];
    const CLOSED = { rect: 1, circle: 1, ellipse: 1, tri: 1, penta: 1, star: 1 };   // 这几个能填色，也真的闭口
    if (kind === 'line') made = [{ pts: seg(-S, 0, S, 0, 2) }];
    else if (kind === 'arrow') {
      const hd = S * 0.24;
      made = [{ pts: seg(-S, 0, S, 0, 2) }, { pts: [P(S - hd, -hd * 0.8), P(S, 0), P(S - hd, hd * 0.8)], ang: 1 }];
    } else if (kind === 'rect') {
      made = [{ pts: [P(-S, -S * 0.68), P(S, -S * 0.68), P(S, S * 0.68), P(-S, S * 0.68), P(-S, -S * 0.68)], ang: 1 }];
    } else if (kind === 'circle') {
      made = [{ pts: ring(S * 0.72, S * 0.72), ctr: P(0, 0) }];
    } else if (kind === 'ellipse') {
      made = [{ pts: ring(S, S * 0.62), ctr: P(0, 0) }];
    } else if (kind === 'tri') {
      const o = [];
      for (let i = 0; i <= 3; i++) { const t = -Math.PI / 2 + i * Math.PI * 2 / 3; o.push(P(S * 0.9 * Math.cos(t), S * 0.9 * Math.sin(t))); }
      made = [{ pts: o, ang: 1 }];
    } else if (kind === 'penta') {
      const o = [];
      for (let i = 0; i <= 5; i++) { const t = -Math.PI / 2 + i * Math.PI * 2 / 5; o.push(P(S * 0.9 * Math.cos(t), S * 0.9 * Math.sin(t))); }
      made = [{ pts: o, ang: 1 }];
    } else if (kind === 'star') {
      const o = [];
      for (let i = 0; i <= 10; i++) {
        const t = -Math.PI / 2 + i * Math.PI / 5;
        const r = i % 2 ? S * 0.94 * 0.382 : S * 0.94;   // 内圈取外圈的 1/φ²：五角星的标准比例
        o.push(P(r * Math.cos(t), r * Math.sin(t)));
      }
      made = [{ pts: o, ang: 1 }];
    } else if (kind === 'para') {
      const o = [], k = 0.95 / S;
      for (let i = 0; i <= 64; i++) { const x = -S + 2 * S * i / 64; o.push(P(x, k * x * x - S * 0.5)); }
      made = [{ pts: o }];
    } else if (kind === 'hyper') {
      const a = S * 0.42, b = S * 0.62, t1 = Math.asinh(S * 0.78 / b);
      for (const sgn of [-1, 1]) {
        const o = [];
        for (let i = 0; i <= 40; i++) { const t = -t1 + 2 * t1 * i / 40; o.push(P(sgn * a * Math.cosh(t), b * Math.sinh(t))); }
        made.push({ pts: o });
      }
    } else if (kind === 'sin') {
      const o = [];
      for (let i = 0; i <= 64; i++) { const x = -S + 2 * S * i / 64; o.push(P(x, S * 0.42 * Math.sin(Math.PI * x / S))); }
      made = [{ pts: o }];
    }
    if (!made.length) return;
    this._inkSnapshot();
    for (const st of made) {
      const s = { c: this._inkColor, w: this._inkWidth, pts: st.pts, kind: this._inkKind, dash: this._inkDash };
      if (st.ctr) s.ctr = st.ctr;
      if (st.ang) s.ang = 1;     // 直边图形走折线：二次贝塞尔会把三角形、五角星的尖磨圆
      if (CLOSED[kind]) { s.cl = 1; if (this._inkFill) s.fill = this._inkFill; }
      this._inkStrokes.push(s);
    }
    this._inkClearSel();
    this._inkRender(); this._inkSave();
    const NAME = { line: '直线', arrow: '箭头', rect: '矩形', circle: '圆', ellipse: '椭圆', tri: '三角形', penta: '正五边形', star: '五角星', para: '抛物线', hyper: '双曲线', sin: '正弦线' };
    this._inkTipSay('已插入' + (NAME[kind] || '图形'));
  }
  /* ---------- 画布三件：文字 / 多边形 / 向量（只有画布开着这几件工具） ---------- */
  /** 选中的图形换填充色；没有选区就只是给「之后插的图形」定个颜色 */
  _inkApplyFill() {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length) return;
    const ids = sel.idx.filter(i => {
      const s = this._inkStrokes[i];
      return s && (s.cl || s.t === 'poly');                 // 不闭合的线上色只会糊一块，不干
    });
    if (!ids.length) { this._inkTipSay('先框选一个闭合图形，再选填充色'); return; }
    const snap = this._inkSnapshot();
    let n = 0;
    for (const i of ids) {
      const s = this._inkStrokes[i];
      if (!s) continue;
      if (this._inkFill) s.fill = this._inkFill; else delete s.fill;
      n++;
    }
    if (!n) { this._inkDropSnap(snap); return; }
    this._inkRender(); this._inkSave();
    this._inkTipSay(this._inkFill ? '已给 ' + n + ' 个图形上色' : '已去掉填充');
  }
  /** 点到哪条文字上（双击改字用）；后画的在上，从顶往下找 */
  _inkTextAt(p) {
    for (let i = this._inkStrokes.length - 1; i >= 0; i--) {
      const s = this._inkStrokes[i];
      if (!s || s.t !== 'txt' || !s.pts || s.pts.length < 2) continue;
      const a = s.pts[0], b = s.pts[1];
      const pad = 6, fs = s.fs || 22;
      const x0 = Math.min(a.x, b.x) - pad, x1 = Math.max(a.x, b.x) + pad;
      const y0 = Math.min(a.y, b.y) - pad, y1 = Math.max(a.y, b.y) + fs * 0.5 + pad;   // 空行 / 单字宽度量不准，往下多给半行
      if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1) return i;
    }
    return -1;
  }
  _inkNewText(p) {
    this._inkTextStop(true);        // 上一行先落下来（空字会被 splice 掉，下标会挪）
    const fs = Math.max(14, Math.round(Math.min(this.w, this.h) * 0.030));
    const s = { t: 'txt', c: this._inkColor, w: this._inkWidth, tx: '', fs,
      pts: [{ x: p.x, y: p.y }, { x: p.x + fs * 2, y: p.y + fs * 1.4 }] };
    this._inkNewSnap = this._inkSnapshot();   // 撤销时把整行字一起收回去；没写内容的话这步会被撤掉
    this._inkStrokes.push(s);
    this._inkRender();
    this._inkTextStart(this._inkStrokes.length - 1, true);
  }
  /** 就地改字：浮一个输入框在原来那行字上，字号按当前缩放换算，看着大小一致。
   *  回车落字、Shift+回车换行、Esc 取消；点别处（失焦）也算落字。 */
  _inkTextStart(i, isNew) {
    this._inkTextStop(true);        // 上一行字先落下来，再开新的
    const s = this._inkStrokes[i], svg = this.svg;
    if (!s || s.t !== 'txt' || !svg || !document.body) return;
    if (!isNew) this._inkNewSnap = null;   // 改旧字不认新建那一步的快照
    const sr = svg.getBoundingClientRect();
    const vb = this._vb || { x: 0, y: 0, w: this.w, h: this.h };
    const kx = sr.width / Math.max(1, vb.w), ky = sr.height / Math.max(1, vb.h);
    const p = s.pts[0];
    const fsPx = Math.max(11, (s.fs || 22) * ky);
    const inp = document.createElement('textarea');
    inp.className = 'ink-text-in';
    inp.value = s.tx || '';
    inp.spellcheck = false;
    const bw = s.pts[1] ? Math.abs(s.pts[1].x - p.x) : 200;
    inp.setAttribute('style',
      'position:fixed;z-index:200;left:' + Math.round(sr.left + (p.x - vb.x) * kx) + 'px;top:' + Math.round(sr.top + (p.y - vb.y) * ky) + 'px;' +
      'font-size:' + fsPx + 'px;line-height:1.35;color:' + (s.c || '#e8eef7') + ';' +
      'width:' + Math.max(150, Math.min(560, bw * kx + fsPx * 2)) + 'px;');
    this._inkTextIn = inp;
    this._inkTextIdx = i;
    // 落字 / 取消都走这里：先把输入框摘掉，再改笔画（空字就连笔画一起删掉）
    const apply = ok => {
      if (inp.__done) return;
      inp.__done = true;
      const v = inp.value;
      if (inp.parentNode) inp.parentNode.removeChild(inp);
      this._inkTextIn = null;
      this._inkTextIdx = -1;
      this._inkTextCommit = null;
      const st = this._inkStrokes[i];
      if (!st) return;
      const t = ok ? String(v).replace(/\s+$/, '') : (st.tx || '');
      const kill = !t || !t.trim() || (!ok && isNew);
      if (kill) {                          // 空字 = 不要了（新建时点开又没写也一样）
        // 新建那一步的快照只为了「写了字」能整体撤回；没写成内容就把它撤掉，别留空步
        if (isNew) this._inkDropSnap(this._inkNewSnap);
        else if ((st.tx || '').trim()) this._inkSnapshot();   // 原有的字被清空
        this._inkStrokes.splice(i, 1);
        this._inkSel = null;
        this._inkRender();
        this._inkSave();
        return;
      }
      if (t === (st.tx || '')) {                       // 内容没变：不留空步
        if (isNew) this._inkDropSnap(this._inkNewSnap);
        return;
      }
      if (!isNew) this._inkSnapshot();                 // 新建的快照在 _inkNewText 里已经拍过
      st.tx = t;
      this._inkRender(); this._inkSave();
    };
    this._inkTextCommit = apply;
    inp.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); apply(false); }
      else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); apply(true); }
    });
    inp.addEventListener('blur', () => apply(true));
    document.body.appendChild(inp);
    setTimeout(() => { try { inp.focus(); inp.select(); } catch (_) { /* 忽略 */ } }, 0);
  }
  /** 收起输入框：commit=true 先把这行字落下来（点别处、换工具都算写完了），false 丢掉这次改动 */
  _inkTextStop(commit) {
    const inp = this._inkTextIn;
    if (!inp) return;
    const f = this._inkTextCommit;
    this._inkTextIn = null;
    this._inkTextIdx = -1;
    this._inkTextCommit = null;
    inp.__done = true;
    if (inp.parentNode) inp.parentNode.removeChild(inp);
    if (commit && typeof f === 'function') { inp.__done = false; f(true); }
  }
  /** 文字量出实际包围盒，选区框与双击命中才有得靠（每次重画顺带更新） */
  _inkMeasureTexts() {
    this._inkStrokes.forEach((s, i) => {
      if (!s || s.t !== 'txt') return;
      const els = this._inkStrokeEls[i], el = els && els[0];
      if (!el || !el.getBBox) return;
      const a = s.pts && s.pts[0];
      if (!a) return;
      try {
        const b = el.getBBox();
        s.pts = [{ x: a.x, y: a.y }, { x: a.x + Math.max(8, b.width), y: a.y + Math.max(8, b.height) }];
      } catch (_) { /* 还没排版好就下次再说 */ }
    });
  }
  /* 多边形：一下一下点顶点，点回起点 / 双击收口 */
  _inkPolyTmpClear() {
    for (const el of this._inkPolyTmp || []) if (el.parentNode) el.parentNode.removeChild(el);
    this._inkPolyTmp = [];
  }
  _inkPolyDown(p) {
    const st = this._inkPoly || (this._inkPoly = { pts: [] });
    if (st.pts.length >= 3) {
      const a = st.pts[0];
      const lim = Math.max(9, Math.min(this.w, this.h) * 0.018);
      if (Math.hypot(p.x - a.x, p.y - a.y) <= lim) { this._inkPolyClose(); return; }
    }
    st.pts.push({ x: p.x, y: p.y });
    if (st.pts.length === 1) this._inkTipSay('点下一个顶点；回到起点或双击收口');
    this._inkPolyPreview(null);
  }
  _inkPolyPreview(p) {
    if (!this.inkLayer) return;
    this._inkPolyTmpClear();
    const st = this._inkPoly;
    if (!st || !st.pts.length) return;
    const out = this._inkPolyTmp = [];
    const pts = p ? st.pts.concat([{ x: p.x, y: p.y }]) : st.pts.slice();
    if (pts.length > 1) {
      const el = mk('path', {}, this.inkLayer);
      el.setAttribute('d', this._inkD(pts, false));
      this._inkStyle(el, { c: this._inkColor, w: this._inkWidth, dash: 'dash' }, 1);
      out.push(el);
    }
    const rr = Math.max(2.4, this._inkWidth * 0.9);
    st.pts.forEach((q, i) => {     // 落下的顶点点个小点儿，回点起点时对得准
      const c = mk('circle', { cx: q.x, cy: q.y, r: i === 0 ? rr * 1.6 : rr }, this.inkLayer);
      c.setAttribute('fill', i === 0 ? this._inkColor : '#5cadff');
      c.setAttribute('fill-opacity', i === 0 ? '1' : '0.75');
      out.push(c);
    });
  }
  _inkPolyClose() {
    const st = this._inkPoly;
    this._inkPolyTmpClear();
    this._inkPoly = null;
    if (!st || st.pts.length < 3) { this._inkRender(); return; }
    const pts = st.pts.slice();
    const lim = Math.max(4, this._inkWidth * 1.6);
    while (pts.length > 3) {       // 双击收口时最后那一下点出的重影去掉
      const a = pts[pts.length - 1], b = pts[pts.length - 2];
      if (Math.hypot(a.x - b.x, a.y - b.y) > lim) break;
      pts.pop();
    }
    const s = { t: 'poly', c: this._inkColor, w: this._inkWidth, dash: this._inkDash, cl: 1, ang: 1, pts };
    if (this._inkFill) s.fill = this._inkFill;
    this._inkSnapshot();
    this._inkStrokes.push(s);
    this._inkRender(); this._inkSave();
    this._inkTipSay('多边形画好了：框选它就能拖、能上色');
  }
  _inkPolyCancel() { this._inkPolyTmpClear(); this._inkPoly = null; }
  /** 向量补平行四边形：同起点的两条向量，落点各自连到第四个顶点（虚线），动一条另一条也跟着动 */
  _inkPairRender() {
    if (!this.inkLayer) return;
    let g = this._inkPairG;
    if (!g || !g.parentNode) g = this._inkPairG = mk('g', { class: 'ink-pairs' }, this.inkLayer);
    if (g.innerHTML !== undefined) g.innerHTML = '';
    const vs = [];
    this._inkStrokes.forEach(s => { if (s && s.t === 'vec' && s.pts && s.pts.length >= 2) vs.push(s); });
    if (vs.length < 2) return;
    const TOL = Math.max(9, Math.min(this.w, this.h) * 0.022);   // 起点差这么点儿就算同一个起点（手画对不齐）
    const ends = vs.map(s => ({ s, o: s.pts[0], e: s.pts[s.pts.length - 1] }));
    const seen = new Set();
    for (let i = 0; i < ends.length; i++) {
      for (let j = i + 1; j < ends.length; j++) {
        const A = ends[i], B = ends[j];
        if (Math.hypot(A.o.x - B.o.x, A.o.y - B.o.y) > TOL) continue;
        const ux = A.e.x - A.o.x, uy = A.e.y - A.o.y, vx = B.e.x - B.o.x, vy = B.e.y - B.o.y;
        const la = Math.hypot(ux, uy), lb = Math.hypot(vx, vy);
        if (la < 10 || lb < 10) continue;
        if (Math.abs(ux * vy - uy * vx) < la * lb * 0.1) continue;   // 共线：补出来是条扁线，不补
        const key = [A.e, B.e].map(q => Math.round(q.x / 2) + ',' + Math.round(q.y / 2)).sort().join('|');
        if (seen.has(key)) continue;
        seen.add(key);
        const D = { x: A.e.x + vx, y: A.e.y + vy };
        const col = B.s.c || A.s.c || this._inkColor;
        const w = Math.max(1.1, Math.min(+A.s.w || 3, +B.s.w || 3) * 0.75);
        for (const [p, q] of [[A.e, D], [B.e, D]]) {
          const el = mk('line', { x1: p.x, y1: p.y, x2: q.x, y2: q.y }, g);
          el.setAttribute('stroke', col);
          el.setAttribute('stroke-width', Math.round(w * 100) / 100);
          el.setAttribute('stroke-dasharray', (w * 3).toFixed(1) + ' ' + (w * 2.2).toFixed(1));
          el.setAttribute('stroke-opacity', '0.7');
          el.setAttribute('stroke-linecap', 'round');
          el.setAttribute('fill', 'none');
        }
      }
    }
  }
  /* 选区右下角的小方块：单选图片 / 矢量块时按那个框缩放，多选（框选、套索、选择工具）时整片等比缩放 */
  _inkResizable() {
    const sel = this._inkSel;
    if (!sel || sel.idx.length !== 1) return -1;
    const s = this._inkStrokes[sel.idx[0]];
    if (!s || !(s.t === 'img' || s.t === 'svg') || !s.pts || s.pts.length < 2) return -1;
    return sel.idx[0];
  }
  /** 选区有东西就有把手（图片 / 矢量块 / 多选都能拉） */
  _inkHandlePos() {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length || !sel.bbox) return null;
    const b = sel.bbox;
    return { x: b.x1 + 5, y: b.y1 + 5 };
  }
  _inkHandleHit(p) {
    const h = this._inkHandlePos();
    if (!h) return false;
    const lim = Math.max(10, Math.min(this.w, this.h) * 0.02);
    return Math.hypot(p.x - h.x, p.y - h.y) <= lim;
  }
  /* ---------- 任意角度旋转：选区上方那个圆钮 / 直线、向量的端点 ---------- */
  /** 旋转钮摆在选区框上边中点外侧 */
  _inkRotPos() {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length || !sel.bbox) return null;
    const b = sel.bbox;
    return { x: (b.x0 + b.x1) / 2, y: b.y0 - 22 };
  }
  _inkRotHit(p) {
    const h = this._inkRotPos();
    if (!h) return false;
    const lim = Math.max(10, Math.min(this.w, this.h) * 0.02);
    return Math.hypot(p.x - h.x, p.y - h.y) <= lim;
  }
  _inkRotStart(p) {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length) return;
    const b = sel.bbox, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    this._inkRot = {
      cx, cy,
      a0: Math.atan2(p.y - cy, p.x - cx),
      deg: 0,
      idx: sel.idx.slice(),
      // 每个元素当前挂着的 transform（图片的翻转 / 旧旋转都在里头），拖动时接在这后面
      base: sel.idx.map(i => (this._inkStrokeEls[i] || []).map(el => (el.getAttribute && el.getAttribute('transform')) || '')),
      bbox0: { x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 },
      poly0: sel.poly ? sel.poly.map(q => ({ x: q.x, y: q.y })) : null,
    };
  }
  _inkRotTo(p, shift) {
    const r = this._inkRot;
    if (!r) return;
    let a = Math.atan2(p.y - r.cy, p.x - r.cx) - r.a0;
    if (shift) a = Math.round(a / (Math.PI / 12)) * (Math.PI / 12);   // 按住 Shift 按 15° 吸
    r.deg = a * 180 / Math.PI;
    const tr = 'rotate(' + (Math.round(r.deg * 100) / 100) + ' ' + r.cx + ' ' + r.cy + ')';
    r.idx.forEach((i, k) => {
      const els = this._inkStrokeEls[i] || [];
      els.forEach((el, j) => {
        if (!el || !el.setAttribute) return;
        el.setAttribute('transform', (tr + ' ' + (r.base[k][j] || '')).trim());
      });
    });
    // 选区框按转过去的四角现算：拖动过程中框就贴着内容一起转，不会甩在后面
    const b = r.bbox0, rad = r.deg * Math.PI / 180, ca = Math.cos(rad), sa = Math.sin(rad);
    const rt = q => ({ x: r.cx + (q.x - r.cx) * ca - (q.y - r.cy) * sa, y: r.cy + (q.x - r.cx) * sa + (q.y - r.cy) * ca });
    if (this._inkSel) {
      const c4 = [{ x: b.x0, y: b.y0 }, { x: b.x1, y: b.y0 }, { x: b.x1, y: b.y1 }, { x: b.x0, y: b.y1 }].map(rt);
      this._inkSel.bbox = bboxOf(c4);
      if (r.poly0) this._inkSel.poly = r.poly0.map(rt);
    }
    this._inkSelRender();
  }
  _inkRotEnd() {
    const r = this._inkRot;
    this._inkRot = null;
    if (!r) return;
    if (Math.abs(r.deg) < 0.4) { this._inkRender(); return; }   // 只是点了一下
    this._inkSnapshot();
    const rad = r.deg * Math.PI / 180, ca = Math.cos(rad), sa = Math.sin(rad);
    const rt = q => ({ x: r.cx + (q.x - r.cx) * ca - (q.y - r.cy) * sa, y: r.cy + (q.x - r.cx) * sa + (q.y - r.cy) * ca });
    for (const i of r.idx) {
      const s = this._inkStrokes[i];
      if (!s || !s.pts || !s.pts.length) continue;
      if (s.t === 'img' || s.t === 'svg' || s.t === 'txt') {
        const a0 = s.pts[0], b0 = s.pts[s.pts.length - 1];
        const ic = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 };
        if (s.t === 'txt') {
          // 文字：框尺寸不动，框心绕选区中心转过去，转角记在 rot 上（渲染时绕自身框心转）
          const hw = Math.abs(b0.x - a0.x) / 2, hh = Math.abs(b0.y - a0.y) / 2;
          const nc = rt(ic);
          s.pts = [{ x: nc.x - hw, y: nc.y - hh }, { x: nc.x + hw, y: nc.y + hh }];
        } else {
          // 内容尺寸记下来；pts 换成转过去之后的紧包围盒（轴对齐），选框、命中都照着它来
          const [cw, ch] = this._inkContentDims(s, Math.abs(b0.x - a0.x) || 1, Math.abs(b0.y - a0.y) || 1);
          s.cw = cw; s.ch = ch;
          const nc = rt(ic);
          const hw = Math.abs(cw * ca) + Math.abs(ch * sa), hh = Math.abs(cw * sa) + Math.abs(ch * ca);
          s.pts = [{ x: nc.x - hw / 2, y: nc.y - hh / 2 }, { x: nc.x + hw / 2, y: nc.y + hh / 2 }];
        }
        s.rot = (((s.rot || 0) + r.deg) % 360 + 360) % 360;
        continue;
      }
      s.pts = s.pts.map(rt);
      if (s.ctr) s.ctr = rt(s.ctr);
    }
    if (this._inkSel) {
      if (r.poly0) this._inkSel.poly = r.poly0.map(rt);
      const all = [];
      for (const i of r.idx) { const s = this._inkStrokes[i]; if (s && s.pts) all.push(...s.pts); }
      if (all.length) this._inkSel.bbox = bboxOf(all);
    }
    this._inkRender(); this._inkSave();
    this._inkTipSay('已旋转 ' + Math.round(r.deg) + '°（按住 Shift 按 15° 吸）');
  }
  /* 直线 / 向量：选中后直接拖端点，方向、长短随手改（按 Shift 按 15° 吸） */
  _inkEndHit(p) {
    const sel = this._inkSel;
    if (!sel || sel.idx.length !== 1) return null;
    const i = sel.idx[0], s = this._inkStrokes[i];
    if (!s || !s.pts || s.pts.length !== 2) return null;
    if (s.t === 'img' || s.t === 'svg' || s.t === 'txt') return null;
    const lim = Math.max(10, Math.min(this.w, this.h) * 0.02);
    for (const k of [0, 1]) {
      if (Math.hypot(p.x - s.pts[k].x, p.y - s.pts[k].y) <= lim) return { i, k };
    }
    return null;
  }
  _inkEndDragStart(hit) {
    this._inkEnd = { i: hit.i, k: hit.k, took: false };
  }
  _inkEndDragTo(p, shift) {
    const d = this._inkEnd;
    if (!d) return;
    const s = this._inkStrokes[d.i];
    if (!s || !s.pts || s.pts.length !== 2) { this._inkEnd = null; return; }
    if (!d.took) { this._inkSnapshot(); d.took = true; }   // 真动了才记一步撤销
    const o = s.pts[1 - d.k];
    let q2 = { x: p.x, y: p.y };
    if (shift) {
      const a = Math.atan2(p.y - o.y, p.x - o.x);
      const sn = Math.round(a / (Math.PI / 12)) * (Math.PI / 12);
      const L = Math.hypot(p.x - o.x, p.y - o.y);
      q2 = { x: o.x + Math.cos(sn) * L, y: o.y + Math.sin(sn) * L };
    }
    s.pts[d.k] = q2;
    if (this._inkSel) this._inkSel.bbox = bboxOf(s.pts);
    this._inkRender();
  }
  _inkEndDragEnd() {
    const d = this._inkEnd;
    this._inkEnd = null;
    if (!d || !d.took) return;   // 只是点了一下端点
    this._inkSave();
    const s = this._inkStrokes[d.i];
    if (s && s.pts && s.pts.length === 2) {
      const deg = Math.atan2(s.pts[1].y - s.pts[0].y, s.pts[1].x - s.pts[0].x) * 180 / Math.PI;
      this._inkTipSay('方向已调，倾角 ' + Math.round(deg) + '°');
    }
  }
  _inkResizeStart(p) {
    const sel = this._inkSel;
    if (!sel || !sel.idx.length) return;
    const i = this._inkResizable();
    if (i >= 0) {
      const s = this._inkStrokes[i], a = s.pts[0], b = s.pts[1];
      const w0 = Math.max(1, Math.abs(b.x - a.x)), h0 = Math.max(1, Math.abs(b.y - a.y));
      const [cw0, ch0] = this._inkContentDims(s, w0, h0);   // 转过的东西缩放时内容尺寸按同一比例跟着走
      this._inkResize = {
        i, p0: p,
        a: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) },
        b: { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) },
        cw0, ch0,
      };
      return;
    }
    // 多选：以选区左上角为锚点等比缩放，拖右下角那个把手
    const b = sel.bbox;
    this._inkResize = {
      kind: 'sel', p0: p, idx: sel.idx.slice(),
      a: { x: b.x0, y: b.y0 }, b: { x: b.x1, y: b.y1 },
      // 原始点位拍个快照：拖动过程中按比例现算，抬笔再落回 pts，来回拉也不会越缩越小
      snap: sel.idx.map(k => {
        const s = this._inkStrokes[k];
        return {
          i: k,
          pts: (s.pts || []).map(q => ({ x: q.x, y: q.y })),
          ctr: s.ctr ? { x: s.ctr.x, y: s.ctr.y } : null,
          fs: s.fs || 0,
          cw: s.cw || 0, ch: s.ch || 0,
        };
      }),
      // 剪选的套索框也拍一份：拖动时按同一套比例现算，松手后框仍贴着内容
      poly0: sel.poly ? sel.poly.map(q => ({ x: q.x, y: q.y })) : null,
      kx: 1, ky: 1,
    };
  }
  _inkResizeTo(p, shift) {
    const r = this._inkResize;
    if (!r) return;
    const w0 = Math.max(1, r.b.x - r.a.x), h0 = Math.max(1, r.b.y - r.a.y);
    let w = Math.max(24, r.b.x + (p.x - r.p0.x) - r.a.x);
    let h = Math.max(18, r.b.y + (p.y - r.p0.y) - r.a.y);
    if (!shift) {              // 默认等比：截图、搬来的板书别被拉扁；按住 Shift 才自由拉伸
      const k = Math.max(w / w0, h / h0);
      w = w0 * k; h = h0 * k;
    }
    const b = { x: r.a.x + w, y: r.a.y + h };
    if (r.kind === 'sel') {
      // 多选：元素整片套一个以左上角为心的缩放，抬笔再写回点位
      r.kx = w0 > 0 ? w / w0 : 1; r.ky = h0 > 0 ? h / h0 : 1;
      const tr = `translate(${r.a.x} ${r.a.y}) scale(${r.kx} ${r.ky}) translate(${-r.a.x} ${-r.a.y})`;
      for (const sk of r.snap) {
        const els = this._inkStrokeEls[sk.i] || [];
        for (const el of els) if (el && el.setAttribute) el.setAttribute('transform', tr);
      }
      if (this._inkSel) {
        this._inkSel.bbox = { x0: r.a.x, y0: r.a.y, x1: b.x, y1: b.y };
        // 剪选的套索框从快照按当前比例现算，预览时框就跟着内容一起缩放
        if (r.poly0) {
          this._inkSel.poly = r.poly0.map(q => ({
            x: r.a.x + (q.x - r.a.x) * r.kx,
            y: r.a.y + (q.y - r.a.y) * r.ky,
          }));
        }
      }
      this._inkSelRender();
      return;
    }
    const s = this._inkStrokes[r.i];
    if (!s) return;
    s.pts = [{ x: r.a.x, y: r.a.y }, b];
    // 文字以外按内容尺寸现算：转过的图 / 矢量块跟着框缩放，内容尺寸同一比例缩放
    if ((s.t === 'img' || s.t === 'svg') && r.cw0) {
      s.cw = Math.max(1, r.cw0 * (w / w0));
      s.ch = Math.max(1, r.ch0 * (h / h0));
    }
    const els = this._inkStrokeEls[r.i] || [];
    if (s.t === 'img' && els[0]) {
      const [cw, ch] = this._inkContentDims(s, w, h);
      const bx = r.a.x + w / 2 - cw / 2, by = r.a.y + h / 2 - ch / 2;
      els[0].setAttribute('x', bx); els[0].setAttribute('y', by);
      els[0].setAttribute('width', cw); els[0].setAttribute('height', ch);
      els[0].setAttribute('transform', this._inkBoxTf(s, bx, by, cw, ch));   // 翻过 / 转过的图跟着新框走
    } else if (s.t === 'svg' && els[0] && els[0].firstChild) {
      const [cw, ch] = this._inkContentDims(s, w, h);
      const bx = r.a.x + w / 2 - cw / 2, by = r.a.y + h / 2 - ch / 2;
      els[0].setAttribute('transform', this._inkBoxTf(s, bx, by, cw, ch));
      this._inkSvgFit(els[0].firstChild, s.ob, { x: bx, y: by }, { x: bx + cw, y: by + ch });
    }
    if (this._inkSel) this._inkSel.bbox = { x0: r.a.x, y0: r.a.y, x1: b.x, y1: b.y };
    this._inkSelRender();
  }
  _inkSvgFit(inner, ob, a, b) {
    const o = ob || { x: 0, y: 0, w: 1, h: 1 };
    const kx = Math.abs(b.x - a.x) / Math.max(1e-6, o.w), ky = Math.abs(b.y - a.y) / Math.max(1e-6, o.h);
    inner.setAttribute('transform', 'translate(' + Math.min(a.x, b.x) + ' ' + Math.min(a.y, b.y) + ') scale(' + kx + ' ' + ky + ') translate(' + (-o.x) + ' ' + (-o.y) + ')');
  }
  _inkResizeEnd() {
    const r = this._inkResize;
    if (!r) return;
    this._inkResize = null;
    if (r.kind === 'sel') {                        // 多选的缩放烘进点位（元素上的 transform 随重画清掉）
      const kx = r.kx, ky = r.ky;
      if (Math.abs(kx - 1) > 1e-4 || Math.abs(ky - 1) > 1e-4) {
        const ax = r.a.x, ay = r.a.y;
        this._inkSnapshot();
        for (const sk of r.snap) {
          const s = this._inkStrokes[sk.i];
          if (!s) continue;
          s.pts = sk.pts.map(q => ({ x: ax + (q.x - ax) * kx, y: ay + (q.y - ay) * ky }));
          if (sk.ctr) s.ctr = { x: ax + (sk.ctr.x - ax) * kx, y: ay + (sk.ctr.y - ay) * ky };
          if (sk.fs) s.fs = Math.max(6, Math.round(sk.fs * Math.sqrt(kx * ky) * 100) / 100);
          if (sk.cw) { s.cw = Math.max(1, sk.cw * kx); s.ch = Math.max(1, sk.ch * ky); }
        }
        // 套索框在 _inkResizeTo 里已按同一套比例跟着缩放过，这里不再重复换算
      }
    }
    this._inkRender(); this._inkSave();
  }
  /* ---------- 截图 / 贴图 ---------- */
  /** 屏幕截图：浏览器先让人挑一块屏幕 / 窗口 / 标签页，拍一帧贴进画布 */
  _inkShot() {
    const md = navigator.mediaDevices;
    if (!md || !md.getDisplayMedia) { this._inkTipSay('这个浏览器不给截屏：截好图直接 Ctrl+V 粘进来'); return; }
    this._inkTipSay('挑一块屏幕或窗口，拍一帧贴到画布上');
    md.getDisplayMedia({ video: true, audio: false }).then(st => {
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.srcObject = st;
      const stop = () => { try { st.getTracks().forEach(t => t.stop()); } catch (_) { /* 忽略 */ } };
      const grab = () => {
        const w = v.videoWidth || 1280, h = v.videoHeight || 720;
        const cv = document.createElement('canvas');
        const k = Math.min(1, 1600 / Math.max(w, h));         // 截屏存整张能把本地存档撑爆，先缩到长边 1600
        cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
        try { cv.getContext('2d').drawImage(v, 0, 0, cv.width, cv.height); } catch (_) { /* 画不出来就贴张空的 */ }
        stop();
        this._inkAddImage(cv.toDataURL('image/jpeg', 0.9), cv.width, cv.height);
      };
      v.addEventListener('loadedmetadata', () => {
        const p = v.play && v.play();
        if (p && p.catch) p.catch(() => { /* 自动播放被拦就等下一帧 */ });
        setTimeout(grab, 260);
      });
      v.addEventListener('error', () => { stop(); this._inkTipSay('没截到：换一块屏幕再试'); });
    }).catch(() => this._inkTipSay('截图已取消'));
  }
  /** 本页截图：不用挑屏幕，直接把这一页画板（图形 + 批注 + 纸面）拍成图片贴进画布 */
  async _inkShotSelf() {
    this._inkTipSay('正在把这一页拍成图片…');
    try {
      const d = await this.snapshotDataURL(2);
      if (!d || !d.url) throw new Error('empty');
      this._inkAddImage(d.url, d.w, d.h);
    } catch (_) {
      this._inkTipSay('这一页没拍成：可以先用「⤓ 保存」导出 PNG');
    }
  }
  /** 把这一页画板渲染成 dataURL（「本页截图」用）：长边压到 1600 以内，存 JPEG 省配额 */
  async snapshotDataURL(scale = 2) {
    const xml = await this._svgXML();
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('load'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    });
    const maxSide = 1600;
    const k = Math.max(0.2, Math.min(scale || 1, maxSide / Math.max(this.w, this.h)));
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(this.w * k));
    cv.height = Math.max(1, Math.round(this.h * k));
    const ctx = cv.getContext('2d');
    try { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); } catch (_) { /* 无 2d 上下文 */ }
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    return { url: cv.toDataURL('image/jpeg', 0.9), w: cv.width, h: cv.height };
  }
  /** 贴一张图：按当前视野的七成摆正中，选中它（右下角出现缩放用的小方块） */
  _inkAddImage(url, iw, ih) {
    if (!url) return null;
    const vb = this._vb || { x: 0, y: 0, w: this.w, h: this.h };
    const k = Math.min(vb.w * 0.72 / Math.max(1, iw), vb.h * 0.72 / Math.max(1, ih));
    const w = Math.max(60, iw * k), h = Math.max(40, ih * k);
    const x = vb.x + (vb.w - w) / 2, y = vb.y + (vb.h - h) / 2;
    const s = { t: 'img', src: url, c: this._inkColor, w: this._inkWidth, pts: [{ x, y }, { x: x + w, y: y + h }] };
    this._inkSnapshot();
    this._inkStrokes.push(s);
    this._inkTool = 'rect';         // 换成框选：贴完就能直接拖着摆位置
    this._inkRender();
    const ok = this._inkSave();
    this._inkSetSel([this._inkStrokes.length - 1]);
    this._inkTipSay(ok ? '已贴到画布：拖着摆位置，右下角小方块缩放（按住 Shift 自由拉伸）'
      : '图太大，本机存档放不下：这一张刷新后会没，先导出 PNG 留着');
    return s;
  }
  /** 剪贴板 / 文件来的图（PNG/JPG/WebP）：长边缩到 1600 以内再存 */
  ingestImage(file) {
    const type = (file && file.type) || '';
    if (!file || !/^image\//.test(type) || /svg/.test(type)) return Promise.resolve(false);
    return new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => res(null);
      fr.readAsDataURL(file);
    }).then(url => {
      if (!url) return false;
      return this._inkScaleImage(url).then(d => {
        if (!d) return false;
        this._inkAddImage(d.url, d.w, d.h);
        return true;
      });
    });
  }
  _inkScaleImage(url) {
    return new Promise(res => {
      const im = new Image();
      im.onload = () => {
        const w = im.naturalWidth || 0, h = im.naturalHeight || 0;
        if (!w || !h) { res({ url, w: 800, h: 600 }); return; }
        const k = Math.min(1, 1600 / Math.max(w, h));
        if (k >= 1) { res({ url, w, h }); return; }       // 本来就不大：原样留着，透明通道也保住
        const cv = document.createElement('canvas');
        cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
        try {
          const cx = cv.getContext('2d');
          cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height);   // JPEG 没有透明通道，先垫白
          cx.drawImage(im, 0, 0, cv.width, cv.height);
          res({ url: cv.toDataURL('image/jpeg', 0.9), w: cv.width, h: cv.height });
        } catch (_) { res({ url, w, h }); }
      };
      im.onerror = () => res(null);
      im.src = url;
    });
  }
  /* ---------- 把一整块画板搬到批注层（画布上的「搬到画布」） ---------- */
  /** 源板 dyn 里的每个顶层节点各自成一条元素：搬过来能单独拖、单独删；
   *  <text> 还原成可编辑的文字，其余（含 KaTeX 公式）原样保留矢量标记。返回搬进来几条。 */
  importFrom(src) {
    if (!src || !src.svg || !src.dyn || !this.svg) return 0;
    const ss = src.svg;
    let sm;
    try { sm = ss.getScreenCTM(); } catch (_) { return 0; }
    if (!sm) return 0;
    const invS = sm.inverse();
    const spt = (x, y) => { const q = ss.createSVGPoint(); q.x = x; q.y = y; return q; };
    // 屏幕矩形 → 源板的用户坐标（缩放、浮层留边全在这一个矩阵里）
    const boxS = r => {
      const a = spt(r.left, r.top).matrixTransform(invS), b = spt(r.left + r.width, r.top + r.height).matrixTransform(invS);
      return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
    };
    const made = [];
    // 箭头、渐变、裁剪这些藏在源板的 <defs> 里：目标板的 defs 没有同名 id 就抄一份过来，
    // 否则搬过来的箭头会变成秃线、渐变会整片变黑
    try {
      const sd = ss.querySelector('defs'), td = this.svg.querySelector('defs');
      if (sd && td) {
        for (const d of Array.from(sd.children)) {
          const id = d.getAttribute && d.getAttribute('id');
          const tag = (d.tagName || '').toLowerCase();
          if (!id || !/^(marker|lineargradient|radialgradient|filter|pattern)$/.test(tag)) continue;
          try { if (td.querySelector('#' + id)) continue; } catch (_) { continue; }
          td.appendChild(d.cloneNode(true));
        }
      }
    } catch (_) { /* 抄不了就算了，主体照样能搬 */ }
    const MAXN = 400;                 // 点数多得离谱的板书（几百个点）不全拆，多了反而没法看
    // 源板当前视野（用户坐标）。B.inf 这类「无限长」辅助线往两头各撑 4000 个单位，
    // 量出来的外接框有几千宽——不夹到视野里，整片板书会被缩成指甲盖大（「交叉比与调和点列」就这么栽过）
    const sv = src._vb || { x: 0, y: 0, w: src.w || 800, h: src.h || 470 };
    const svp = 24;
    const clip = { x0: sv.x - svp, y0: sv.y - svp, x1: sv.x + sv.w + svp, y1: sv.y + sv.h + svp };
    const addNode = (n, isHd) => {
      if (made.length >= MAXN) return;
      const tag = (n.tagName || '').toLowerCase();
      if (n.getAttribute && n.getAttribute('display') === 'none') return;
      if (n.getAttribute && n.getAttribute('clip-path') === 'url(#__none)') return;
      if (tag === 'defs' || tag === 'style' || tag === 'clippath') return;
      // <g> 拆开搬：里头每一样都能单独拖。带 transform 的组不拆（拆了祖先那个变换就没处放了）；
      // 子节点太多、拆了也拖不过来，整组当一个搬
      if (tag === 'g' && !n.getAttribute('transform') && n.children && n.children.length) {
        const kids = Array.from(n.children).filter(k => (k.tagName || '').toLowerCase() !== 'defs');
        if (kids.length && made.length + kids.length <= MAXN) { for (const k of kids) addNode(k, isHd); return; }
      }
      let r;
      try { r = n.getBoundingClientRect(); } catch (_) { return; }
      if (!r) return;
      // 横线、竖线、坐标轴、网格线都是零厚度的矩形：先撑到 2px 再量。不撑的话
      // 下面「宽高都近 0」那一条会把它们当空节点丢掉——用户报过「坐标轴横线之类没搬过去」
      let rl = r.left, rt = r.top, rw = r.width, rh = r.height;
      if (!(rw > 0.2) && !(rh > 0.2)) return;
      if (rw < 2) { rl -= (2 - rw) / 2; rw = 2; }
      if (rh < 2) { rt -= (2 - rh) / 2; rh = 2; }
      let sb = boxS({ left: rl, top: rt, width: rw, height: rh });
      if (!(sb.w > 1e-4) && !(sb.h > 1e-4)) return;
      // 夹到源板视野：屏幕上看不见的那截不参与测框，摆到画布上仍按同一比例画，只是落到视野外
      const cx0 = Math.max(sb.x, clip.x0), cy0 = Math.max(sb.y, clip.y0);
      const cx1 = Math.min(sb.x + sb.w, clip.x1), cy1 = Math.min(sb.y + sb.h, clip.y1);
      if (!(cx1 - cx0 > 0.5) && !(cy1 - cy0 > 0.5)) return;   // 整件都在板外：本来也看不见
      sb = { x: cx0, y: cy0, w: Math.max(0.5, cx1 - cx0), h: Math.max(0.5, cy1 - cy0) };
      if (tag === 'text') {
        const fsS = parseFloat(n.getAttribute('font-size') || '') || 16;
        let c = n.getAttribute('fill') || (n.style && n.style.fill) || '';
        // 把手标签这类没写 fill 的文字：取当前主题算出来的色，别搬过来变成一片灰白
        if (!c) { try { if (typeof getComputedStyle === 'function') c = (getComputedStyle(n).fill || ''); } catch (_) { /* 拿不到就用默认 */ } }
        made.push({
          t: 'txt', c: !c || c === 'none' ? '#e8eef7' : c, w: 3,
          tx: (n.textContent || '').trim() || '文字',
          fs: Math.max(9, fsS),
          pts: [{ x: sb.x, y: sb.y }, { x: sb.x + sb.w, y: sb.y + sb.h }],
        });
      } else {
        // 把手圆点搬过来当静态矢量块：类别名去掉，免得在画布上还带抓手的悬停 / 光标行为
        let html = n.outerHTML || '';
        if (isHd) html = html.replace(/\sclass="hnd[^"]*"/g, '');
        made.push({ t: 'svg', mk: html, ob: sb, w: 3, c: '#8fa3bd',
          pts: [{ x: sb.x, y: sb.y }, { x: sb.x + sb.w, y: sb.y + sb.h }] });
      }
    };
    for (const n of Array.from(src.dyn.childNodes)) if (n.nodeType === 1) addNode(n);
    // 把手层（B.handle 的圆点与文字标签）本来不裁剪、也不在 dyn 里，之前整个漏掉 ——
    // 「交叉比与调和点列」搬过去后 A B C D 全没了就是这个。搬成静态矢量块 / 文字，别指望还能拖
    for (const n of Array.from((src.hd && src.hd.childNodes) || [])) if (n.nodeType === 1) addNode(n, true);
    // 源板上手写的那层也一起搬（墨迹坐标本来就是板坐标，和上面的框同一套单位）
    for (const s of (src._inkStrokes || [])) {
      if (!s || !s.pts || !s.pts.length) continue;
      const c2 = { c: s.c, w: s.w, pts: s.pts.map(q => ({ x: q.x, y: q.y })), kind: s.kind || 'pen', dash: s.dash || 'solid' };
      if (s.ctr) c2.ctr = { x: s.ctr.x, y: s.ctr.y };
      if (s.fill) c2.fill = s.fill;
      if (s.cl) c2.cl = 1;
      if (s.fx) c2.fx = 1;
      if (s.fy) c2.fy = 1;
      if (s.rot) c2.rot = s.rot;
      if (s.cw) { c2.cw = s.cw; c2.ch = s.ch; }
      if (s.ang) c2.ang = 1;
      if (s.t) {
        c2.t = s.t;
        if (s.tx != null) c2.tx = s.tx;
        if (s.fs) c2.fs = s.fs;
        if (s.src) c2.src = s.src;
        if (s.mk) c2.mk = s.mk;
        if (s.ob) c2.ob = s.ob;     // 矢量块的原包围盒：映射靠 pts 那个框，原盒照用
      }
      made.push(c2);
    }
    if (!made.length) return 0;
    // 整片按本页视野重排：量出内容外接框，等比缩到视野的九成（最多原大），再摆到正中。
    // 不能照屏幕坐标搬——源板在屏幕上的位置和画布这块地方不是一回事，半屏时一半会落到画布外
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const m of made) {
      for (const q of m.pts) { if (q.x < x0) x0 = q.x; if (q.x > x1) x1 = q.x; if (q.y < y0) y0 = q.y; if (q.y > y1) y1 = q.y; }
    }
    if (!isFinite(x0)) return 0;
    const vb = this._vb || { x: 0, y: 0, w: this.w, h: this.h };
    const bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
    const fit = Math.min(1, (vb.w * 0.92) / bw, (vb.h * 0.92) / bh);
    const ax = vb.x + vb.w / 2, ay = vb.y + vb.h / 2;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    for (const m of made) {
      m.pts = m.pts.map(q => ({ x: ax + (q.x - cx) * fit, y: ay + (q.y - cy) * fit }));
      if (m.ctr) m.ctr = { x: ax + (m.ctr.x - cx) * fit, y: ay + (m.ctr.y - cy) * fit };
      if (m.fs) m.fs = Math.max(6, Math.round(m.fs * fit * 100) / 100);
      if (m.w) m.w = Math.max(1, m.w * fit);
    }
    this._inkClearSel();
    this._inkSnapshot();
    this._inkStrokes.push(...made);
    this._inkRender(); this._inkSave();
    this._inkTipSay('画板内容已搬到画布：框选 / 套索可选可缩，文字双击可改');
    return made.length;
  }
  /** 橡皮命中一条：图片 / 文字 / 矢量块按包围盒整个算，多边形连填色内部一起算 */
  _inkStrokeHit(s, p) {
    const lim = Math.max(6, (+s.w || 3) / 2 + 4);
    if (s.t && s.t !== 'poly' && s.t !== 'vec') {
      const a = s.pts && s.pts[0], b = s.pts && s.pts[1];
      if (!a || !b) return false;
      return p.x >= Math.min(a.x, b.x) - 2 && p.x <= Math.max(a.x, b.x) + 2 &&
        p.y >= Math.min(a.y, b.y) - 2 && p.y <= Math.max(a.y, b.y) + 2;
    }
    if (s.t === 'poly' && s.fill && pointInPolygon(p, s.pts)) return true;
    if (s.cl && s.pts && s.pts.length > 2) return nearPolyline(p, s.pts.concat([s.pts[0]]), lim);
    return nearPolyline(p, s.pts, lim);
  }
  /** 最上面那一条（选择工具点选、橡皮共用同一套命中） */
  _inkHitTop(p) {
    for (let i = this._inkStrokes.length - 1; i >= 0; i--) {
      if (this._inkStrokeHit(this._inkStrokes[i], p)) return i;
    }
    return -1;
  }
  _inkEraseAt(p) {
    for (let i = this._inkStrokes.length - 1; i >= 0; i--) {   // 后画的在上，从最上面一条开始找
      const s = this._inkStrokes[i];
      if (this._inkStrokeHit(s, p)) {
        if (!this._inkEraseTook) { this._inkSnapshot(); this._inkEraseTook = true; }  // 第一次真擦到才记快照
        this._inkClearSel();
        this._inkStrokes.splice(i, 1);
        this._inkRender(); this._inkSave();
        return true;
      }
    }
    return false;
  }
  /* ---------- 选区：框选 / 套索 / 拖动 / 删除 ---------- */
  _inkInSel(p) {
    if (!this._inkSel) return false;
    // 剪选出来的选区框是条不规则折线：点在折线里才算「按在选区上」，
    // 别让外接框里那些空角落也把新套索吞成拖动
    const poly = this._inkSel.poly;
    if (poly && poly.length >= 3) return pointInPolygon(p, poly);
    const b = this._inkSel.bbox, pad = 6;
    return p.x >= b.x0 - pad && p.x <= b.x1 + pad && p.y >= b.y0 - pad && p.y <= b.y1 + pad;
  }
  _inkStartDrag(p) {
    const idx = this._inkSel ? this._inkSel.idx.slice() : [];
    if (!idx.length) return;
    this._inkDrag = { p0: p, p, idx, els: idx.map(i => this._inkStrokeEls[i] || []) };
  }
  _inkMoveTo(p) {
    const d = this._inkDrag;
    if (!d) return;
    d.p = p;
    const dx = p.x - d.p0.x, dy = p.y - d.p0.y;
    for (const arr of d.els) for (const el of arr) if (el && el.setAttribute) el.setAttribute('transform', `translate(${dx} ${dy})`);
    if (this._inkPairG && this._inkPairG.innerHTML !== undefined) this._inkPairG.innerHTML = '';   // 平行四边形先收起来，松手重算
    this._inkSelRender(dx, dy);
  }
  _inkMoveEnd() {
    const d = this._inkDrag;
    this._inkDrag = null;
    if (!d) return;
    const dx = d.p.x - d.p0.x, dy = d.p.y - d.p0.y;
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) { this._inkSelRender(); return; }  // 只是点了一下
    this._inkSnapshot();
    for (const i of d.idx) {
      const s = this._inkStrokes[i];
      if (!s) continue;
      for (const pt of s.pts) { pt.x += dx; pt.y += dy; }
      if (s.ctr) { s.ctr.x += dx; s.ctr.y += dy; }
    }
    if (this._inkSel) {
      const b = this._inkSel.bbox;
      this._inkSel.bbox = { x0: b.x0 + dx, y0: b.y0 + dy, x1: b.x1 + dx, y1: b.y1 + dy };
      // 剪选的套索框换算成实际位置，跟着内容一起挪（否则松手后框会跳回原处）
      if (this._inkSel.poly) this._inkSel.poly = this._inkSel.poly.map(q => ({ x: q.x + dx, y: q.y + dy }));
    }
    this._inkRender(); this._inkSave();
  }
  _inkDeleteSel() {
    if (!this._inkSel || !this._inkSel.idx.length) return;
    this._inkSnapshot();
    const set = new Set(this._inkSel.idx);
    this._inkStrokes = this._inkStrokes.filter((_, i) => !set.has(i));
    this._inkSel = null;
    this._inkRender(); this._inkSyncTools(); this._inkSave();
  }
  _inkEndSel() {
    const d = this._inkSelDrag;
    this._inkSelDrag = null;
    this._inkPrevClear();
    if (!d) return;
    // 套索 + 「按形状剪选」（设置默认）：圈到哪一段就只选那一段，
    // 跨过边界的笔画在边界处剪开——外面剩下的留在板上，不算选中
    if (d.tool === 'lasso' && d.pts.length >= 3 && PREFS.inkSelMode === 'cut') {
      const poly = d.pts.map(q => ({ x: q.x, y: q.y }));
      const snap = this._inkSnapshot();          // 剪开会改笔画本身，能整体回退
      const r = this._inkCutByPoly(poly);
      if (!r.changed) this._inkDropSnap(snap);   // 没剪到东西：别留空步
      if (r.changed) this._inkRender();
      if (r.idx.length) {
        this._inkSetSel(r.idx, poly);
        if (r.changed) this._inkSave();
      } else this._inkClearSel();
      return;
    }
    let idx = [];
    if (d.tool === 'rect' && d.pts[1]) idx = this._inkSelectRect(d.pts[0], d.pts[1]);
    else if (d.tool === 'lasso' && d.pts.length >= 3) idx = this._inkSelectLasso(d.pts);
    if (idx.length) this._inkSetSel(idx); else this._inkClearSel();
  }
  /** 按套索形状剪选：返回新选中的下标，以及笔画数组有没有被改过（剪断过）。
   *  图片 / 文字 / 矢量块 / 多边形这些「一整件」的不剪，落进圈里的整件选中；
   *  手写笔画（含吸附成的直线圆）按边界剪开，圈里的那几段各自成一条。 */
  _inkCutByPoly(poly) {
    const next = [];
    const picked = [];
    let changed = false;
    const pb = bboxOf(poly);
    for (const s of this._inkStrokes) {
      if (!s || !s.pts || s.pts.length < 2) { next.push(s); continue; }
      const atomic = !!(s.t && s.t !== 'path');
      if (atomic) {
        const ab = bboxOf(s.pts);
        const hit = s.pts.some(p => pointInPolygon(p, poly)) ||
          pointInPolygon({ x: (ab.x0 + ab.x1) / 2, y: (ab.y0 + ab.y1) / 2 }, poly);
        next.push(s);
        if (hit) picked.push(next.length - 1);
        continue;
      }
      // 外接框和套索都不挨着：跳过（省得每条笔画都去逐点判内外）
      const b = bboxOf(s.pts);
      if (b.x1 < pb.x0 || b.x0 > pb.x1 || b.y1 < pb.y0 || b.y0 > pb.y1) { next.push(s); continue; }
      // 闭合图形连「回到起点」那一段也算上：整条都在圈里就不剪
      const loop = s.cl && s.pts.length > 2 ? s.pts.concat([s.pts[0]]) : s.pts;
      if (loop.every(p => pointInPolygon(p, poly)) && !this._inkCrossPoly(loop, poly)) {
        next.push(s); picked.push(next.length - 1); continue;
      }
      const cut = this._splitByPoly(loop, poly);
      if (!cut.inside.length) { next.push(s); continue; }   // 没圈进来：原样留着
      for (const part of cut.outside) next.push(this._inkPiece(s, part));      // 外面的部分留在板上
      for (const part of cut.inside) {                                          // 圈进来的各自成一条
        next.push(this._inkPiece(s, part));
        picked.push(next.length - 1);
      }
      changed = true;
    }
    if (changed) { this._inkStrokes = next; this._inkSel = null; }
    return { idx: picked, changed };
  }
  /** 笔画有没有穿过套索边界（顶点全在里面、边却拱出去的情况） */
  _inkCrossPoly(pts, poly) {
    for (let i = 1; i < pts.length; i++) {
      for (let k = 0; k < poly.length; k++) {
        if (segCross(pts[i - 1], pts[i], poly[k], poly[(k + 1) % poly.length])) return true;
      }
    }
    return false;
  }
  /** 一条折线按多边形剪开：返回圈里 / 圈外的各段（每段是点数组） */
  _splitByPoly(pts, poly) {
    const inside = [], outside = [];
    if (!pts || pts.length < 2) return { inside, outside };
    const at = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    let cur = null, curIn = false;
    const flush = () => { if (cur && cur.length >= 2) (curIn ? inside : outside).push(cur); cur = null; };
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const ts = [0, 1];
      for (let k = 0; k < poly.length; k++) {
        const t = segT(a, b, poly[k], poly[(k + 1) % poly.length]);
        if (t > 0 && t < 1) ts.push(t);
      }
      ts.sort((x, y) => x - y);
      for (let j = 1; j < ts.length; j++) {
        const t0 = ts[j - 1], t1 = ts[j];
        if (t1 - t0 < 1e-9) continue;
        const p0 = at(a, b, t0), p1 = at(a, b, t1);
        const pin = pointInPolygon(at(a, b, (t0 + t1) / 2), poly);
        if (!cur) { cur = [p0]; curIn = pin; }
        else if (pin !== curIn) { cur.push(p0); flush(); cur = [p0]; curIn = pin; }
        cur.push(p1);
      }
    }
    flush();
    return { inside, outside };
  }
  /** 剪选派生的一段：闭合 / 填充 / 吸附标记 / 顶点标记都不带过去，只剩线与笔 */
  _inkPiece(s, pts) {
    const p = { c: s.c, w: s.w, pts: pts.map(q => ({ x: q.x, y: q.y })), kind: s.kind || 'pen', dash: s.dash || 'solid' };
    if (s.ang) p.ang = 1;   // 直边图形剪下来还是直边
    return p;
  }
  _inkSelectRect(a, b) {
    const x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x);
    const y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
    const out = [];
    this._inkStrokes.forEach((s, i) => { if (this._inkHitRect(s.pts, x0, y0, x1, y1)) out.push(i); });
    return out;
  }
  _inkHitRect(pts, x0, y0, x1, y1) {
    const inside = p => p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1;
    for (const p of pts) if (inside(p)) return true;
    const c = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
    for (let i = 1; i < pts.length; i++) {                     // 只是横穿而过、顶点都在框外的长笔画也要算
      for (let k = 0; k < 4; k++) if (segCross(pts[i - 1], pts[i], c[k], c[(k + 1) % 4])) return true;
    }
    return false;
  }
  _inkSelectLasso(poly) {
    const out = [];
    this._inkStrokes.forEach((s, i) => {
      if (s.pts.some(p => pointInPolygon(p, poly))) { out.push(i); return; }
      const b = bboxOf(s.pts);
      if (pointInPolygon({ x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 }, poly)) out.push(i);
    });
    return out;
  }
  _inkSetSel(idx, poly) {
    const pts = [];
    for (const i of idx) pts.push(...this._inkStrokes[i].pts);
    this._inkSel = { idx, bbox: bboxOf(pts) };
    // 套索剪选：框就用套索那条不规则的边，别再用外接矩形冒充
    if (poly && poly.length >= 3) this._inkSel.poly = poly.map(q => ({ x: q.x, y: q.y }));
    this._inkSelRender();
    this._inkSyncTools();
  }
  /** Ctrl / ⌘ + 点：把一条图形加进选区或从选区里拿掉。减到空了就当取消选择 */
  _inkToggleSel(i) {
    if (!this._inkStrokes[i]) return;
    const idx = this._inkSel ? this._inkSel.idx.slice() : [];
    const at = idx.indexOf(i);
    if (at >= 0) idx.splice(at, 1); else idx.push(i);
    if (!idx.length) { this._inkClearSel(); return; }
    idx.sort((a, b) => a - b);
    this._inkSetSel(idx);          // 套索框不再保留：拼出来的选区按外接框走
    if (!this._inkCtrlTipped) {
      this._inkCtrlTipped = true;
      this._inkTipSay('Ctrl 点选可加选 / 减选，空白处点一下取消');
    }
  }
  _inkClearSel() {
    this._inkRot = null; this._inkEnd = null;
    if (!this._inkSel && !this._inkPrevEls.length) { this._inkSyncTools(); return; }
    this._inkSel = null;
    this._inkPrevClear();
    this._inkSelRender();
    this._inkSyncTools();
  }
  /** 选区预览：框选画虚线矩形，套索画闭合折线 */
  _inkSelPreview(d) {
    this._inkPrevClear();
    const P = this._inkSelLayer || this.inkLayer;
    if (d.tool === 'rect' && d.pts[1]) {
      const a = d.pts[0], b = d.pts[1];
      const el = mk('rect', {}, P);
      el.setAttribute('x', Math.min(a.x, b.x)); el.setAttribute('y', Math.min(a.y, b.y));
      el.setAttribute('width', Math.abs(b.x - a.x)); el.setAttribute('height', Math.abs(b.y - a.y));
      this._inkSelStyle(el);
      this._inkPrevEls.push(el);
    } else if (d.tool === 'lasso' && d.pts.length > 1) {
      let dd = '';
      for (let i = 0; i < d.pts.length; i++) dd += (i ? 'L' : 'M') + r1(d.pts[i].x) + ' ' + r1(d.pts[i].y);
      const el = mk('path', {}, P);
      el.setAttribute('d', dd + 'Z');
      this._inkSelStyle(el);
      this._inkPrevEls.push(el);
    }
  }
  _inkPrevClear() {
    for (const el of this._inkPrevEls || []) if (el.parentNode) el.parentNode.removeChild(el);
    this._inkPrevEls = [];
  }
  _inkSelStyle(el) {
    el.setAttribute('fill', 'rgba(92,173,255,0.10)');
    el.setAttribute('stroke', '#5cadff');
    el.setAttribute('stroke-width', '1.6');
    el.setAttribute('stroke-dasharray', '6 5');
    if (el.style) el.style.pointerEvents = 'none';
  }
  /** 选区高亮框（dx/dy 是拖动中的临时位移） */
  _inkSelRender(dx, dy) {
    const L = this._inkSelLayer;
    if (!L) return;
    L.innerHTML = ''; this._inkPrevEls = [];
    if (!this._inkSel) return;
    const b = this._inkSel.bbox, ox = dx || 0, oy = dy || 0, pad = 5;
    const poly = this._inkSel.poly;
    if (poly && poly.length >= 3) {
      // 套索剪选：框画成套索本身那条不规则的折线
      let dd = '';
      for (let i = 0; i <= poly.length; i++) {
        const q = poly[i % poly.length];
        dd += (i ? 'L' : 'M') + r1(q.x + ox) + ' ' + r1(q.y + oy);
      }
      const pe = mk('path', {}, L);
      pe.setAttribute('d', dd + 'Z');
      this._inkSelStyle(pe);
    } else {
      const el = mk('rect', {}, L);
      el.setAttribute('x', b.x0 - pad + ox); el.setAttribute('y', b.y0 - pad + oy);
      el.setAttribute('width', Math.max(1, b.x1 - b.x0 + pad * 2)); el.setAttribute('height', Math.max(1, b.y1 - b.y0 + pad * 2));
      el.setAttribute('rx', 4);
      this._inkSelStyle(el);
    }
    // 右下角挂个小方块：单选图片 / 矢量块按框缩放，多选（框选、套索、选择工具选出来的）整片等比缩放
    if (this._inkSel && this._inkSel.idx.length) {
      const hd = mk('rect', {}, L);
      const s2 = Math.max(8, Math.min(this.w, this.h) * 0.016);
      hd.setAttribute('x', b.x1 + 5 + ox - s2 / 2); hd.setAttribute('y', b.y1 + 5 + oy - s2 / 2);
      hd.setAttribute('width', s2); hd.setAttribute('height', s2);
      hd.setAttribute('rx', 2);
      hd.setAttribute('fill', '#5cadff');
      hd.setAttribute('stroke', '#fff');
      hd.setAttribute('stroke-width', '1.4');
      if (hd.style) hd.style.pointerEvents = 'none';
      // 上边中点外侧的圆钮：按住任意角度旋转（Shift 按 15° 吸）
      const rh = this._inkRotPos();
      if (rh) {
        const rr = Math.max(7, Math.min(this.w, this.h) * 0.014);
        const rc = mk('circle', { cx: rh.x + ox, cy: rh.y + oy, r: rr }, L);
        rc.setAttribute('fill', '#5cadff');
        rc.setAttribute('stroke', '#fff');
        rc.setAttribute('stroke-width', '1.4');
        if (rc.style) rc.style.pointerEvents = 'none';
        // 圈里画一道带箭头的弧，看着就是「转」
        const r2 = rr * 0.52, a1 = -60 * Math.PI / 180, a2 = 210 * Math.PI / 180;
        const p1 = { x: rh.x + ox + r2 * Math.cos(a1), y: rh.y + oy + r2 * Math.sin(a1) };
        const p2 = { x: rh.x + ox + r2 * Math.cos(a2), y: rh.y + oy + r2 * Math.sin(a2) };
        const ga = mk('path', { d: 'M' + r1(p1.x) + ' ' + r1(p1.y) + 'A' + r1(r2) + ' ' + r1(r2) + ' 0 1 1 ' + r1(p2.x) + ' ' + r1(p2.y) }, L);
        ga.setAttribute('fill', 'none'); ga.setAttribute('stroke', '#fff'); ga.setAttribute('stroke-width', '1.5');
        ga.setAttribute('stroke-linecap', 'round');
        if (ga.style) ga.style.pointerEvents = 'none';
        const ar = mk('path', { d: 'M' + r1(p2.x - r2 * 0.5) + ' ' + r1(p2.y - r2 * 0.42) + 'L' + r1(p2.x) + ' ' + r1(p2.y) + 'L' + r1(p2.x + r2 * 0.5) + ' ' + r1(p2.y - r2 * 0.42) }, L);
        ar.setAttribute('fill', 'none'); ar.setAttribute('stroke', '#fff'); ar.setAttribute('stroke-width', '1.5');
        ar.setAttribute('stroke-linecap', 'round'); ar.setAttribute('stroke-linejoin', 'round');
        if (ar.style) ar.style.pointerEvents = 'none';
      }
      // 单选一条直线 / 向量：两个端点各挂一枚小圆钮，拖着直接改方向
      const sel = this._inkSel;
      if (sel.idx.length === 1) {
        const st = this._inkStrokes[sel.idx[0]];
        if (st && st.pts && st.pts.length === 2 && st.t !== 'img' && st.t !== 'svg' && st.t !== 'txt') {
          const er = Math.max(5, Math.min(this.w, this.h) * 0.011);
          for (const q of st.pts) {
            const ec = mk('circle', { cx: q.x + ox, cy: q.y + oy, r: er }, L);
            ec.setAttribute('fill', '#fff');
            ec.setAttribute('stroke', '#5cadff');
            ec.setAttribute('stroke-width', '2');
            if (ec.style) ec.style.pointerEvents = 'none';
          }
        }
      }
    }
  }
  /* ---------- 墨迹绘制 ---------- */
  /** 墨迹 → 路径数据：中间点走二次贝塞尔，手写线条不出折角；铅笔走折线。单点给一个小点 */
  _inkD(pts, smooth = true, close = false) {
    const n = pts.length;
    if (!n) return '';
    const r = v => Math.round(v * 10) / 10;
    const Z = close ? 'Z' : '';
    if (n === 1) return `M${r(pts[0].x)} ${r(pts[0].y)}l0.01 0`;
    if (n === 2 || !smooth) {
      let d = `M${r(pts[0].x)} ${r(pts[0].y)}`;
      for (let i = 1; i < n; i++) d += `L${r(pts[i].x)} ${r(pts[i].y)}`;
      return d + Z;
    }
    let d = `M${r(pts[0].x)} ${r(pts[0].y)}`;
    for (let i = 1; i < n - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
      d += `Q${r(pts[i].x)} ${r(pts[i].y)} ${r(mx)} ${r(my)}`;
    }
    const e = pts[n - 1];
    return d + `L${r(e.x)} ${r(e.y)}` + Z;
  }
  _inkStyle(el, s, mul) {
    const w = Math.max(0.6, (+s.w || 3) * (mul || 1));
    el.setAttribute('stroke', s.c);    // 直接写属性：批注颜色不随主题换色
    el.setAttribute('stroke-width', Math.round(w * 100) / 100);
    el.setAttribute('fill', s.fill || 'none');   // 闭合图形可以填色，其余照旧空心
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    if (s.dash === 'dash') el.setAttribute('stroke-dasharray', `${(w * 2.6).toFixed(2)} ${(w * 1.8).toFixed(2)}`);
    else if (s.dash === 'dot') el.setAttribute('stroke-dasharray', `0.01 ${(w * 1.9).toFixed(2)}`);
    else if (s.dash === 'dashdot') el.setAttribute('stroke-dasharray', `${(w * 2.8).toFixed(2)} ${(w * 1.5).toFixed(2)} 0.01 ${(w * 1.5).toFixed(2)}`);   // 线点
    else if (s.dash === 'longdash') el.setAttribute('stroke-dasharray', `${(w * 6).toFixed(2)} ${(w * 1.7).toFixed(2)}`);   // 长短线（长划短线交替）
    if (s.kind === 'pencil') el.setAttribute('stroke-opacity', '0.72');
    // 荧光笔：画得宽、压得淡；方头才像笔刷扫过去的一道。multiply 让叠到字上时字还透得出来
    else if (s.kind === 'marker') {
      el.setAttribute('stroke-opacity', '0.34');
      el.setAttribute('stroke-linecap', 'butt');
      if (el.style && el.style.setProperty) el.style.setProperty('mix-blend-mode', 'multiply');
    }
  }
  /** 毛笔：整条切成若干小段，中间粗两头细 */
  _inkBrush(s, P) {
    const pts = s.pts, n = pts.length, out = [];
    const segs = Math.min(40, Math.max(2, n - 1));
    for (let k = 0; k < segs; k++) {
      const i0 = Math.floor(k * (n - 1) / segs), i1 = Math.floor((k + 1) * (n - 1) / segs);
      if (i1 <= i0) continue;
      const t = (k + 0.5) / segs;
      const mul = 0.42 + 1.15 * Math.pow(Math.sin(Math.PI * t), 0.65);
      const el = mk('path', {}, P);
      el.setAttribute('d', this._inkD(pts.slice(i0, i1 + 1), true));
      this._inkStyle(el, s, mul);
      out.push(el);
    }
    return out;
  }
  /** 一条墨迹 → 若干 SVG 元素（毛笔分段、圆/椭圆另画中心点；图片 / 文字 / 多边形 / 向量 / 搬来的矢量块各走各的） */
  _inkDrawStroke(s, parent) {
    const P = parent || this.inkLayer, out = [];
    if (!s) return out;
    if (s.t === 'img') return this._inkDrawImage(s, P);
    if (s.t === 'txt') return this._inkDrawText(s, P);
    if (s.t === 'svg') return this._inkDrawSvg(s, P);
    if (s.t === 'vec') return this._inkDrawVec(s, P);
    if (!s.pts || !s.pts.length) return out;
    if (s.kind === 'brush' && !s.ang && s.pts.length >= 4) out.push(...this._inkBrush(s, P));
    else {
      const el = mk('path', {}, P);
      // 直边图形（矩形 / 三角形 / 五边形 / 五角星 / 多边形 / 箭头）走折线，别让贝塞尔把尖角磨圆
      el.setAttribute('d', this._inkD(s.pts, s.kind !== 'pencil' && !s.ang, !!s.cl));
      this._inkStyle(el, s, s.kind === 'pencil' ? 0.8 : s.kind === 'marker' ? 3.4 : 1);
      out.push(el);
    }
    if (s.ctr) {
      const c = mk('circle', { cx: s.ctr.x, cy: s.ctr.y, r: Math.max(2.2, (+s.w || 3) * 0.85) }, P);
      c.setAttribute('fill', s.c);
      out.push(c);
    }
    return out;
  }
  /** 图片：两点定框。preserveAspectRatio=none 让拉伸跟着框走（缩放时框本身保持比例） */
  _inkDrawImage(s, P) {
    if (!s.src || !s.pts || s.pts.length < 2) return [];
    const a = s.pts[0], b = s.pts[1];
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    const w = Math.max(1, Math.abs(b.x - a.x)), h = Math.max(1, Math.abs(b.y - a.y));
    // pts 是转过以后的紧包围盒：底图按没转之前的内容尺寸居中画，再绕中心翻 / 转
    const [cw, ch] = this._inkContentDims(s, w, h);
    const bx = x + w / 2 - cw / 2, by = y + h / 2 - ch / 2;
    const el = mk('image', {
      x: bx, y: by, width: cw, height: ch,
      preserveAspectRatio: 'none',
    }, P);
    const tf = this._inkBoxTf(s, bx, by, cw, ch);
    if (tf) el.setAttribute('transform', tf);
    el.setAttribute('href', s.src);
    if (el.setAttributeNS) { try { el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', s.src); } catch (_) { /* 老环境 */ } }
    return [el];
  }
  /** 文字：左上角定点，行高 1.35；多行用 tspan 一层层往下排 */
  _inkDrawText(s, P) {
    const lines = String(s.tx == null ? '' : s.tx).split('\n');
    const a = (s.pts && s.pts[0]) || { x: 0, y: 0 };
    const fs = +s.fs || 22;
    const el = mk('text', { x: a.x, y: a.y }, P);
    el.setAttribute('font-size', fs);
    el.setAttribute('fill', s.c || '#e8eef7');
    el.setAttribute('dominant-baseline', 'hanging');
    el.setAttribute('xml:space', 'preserve');
    if (s.rot) {                        // 转过 90° 的文字：整行绕自身框中心转
      const q = (s.pts && s.pts[1]) || { x: a.x + fs * 2, y: a.y + fs * 1.4 };
      const cx = (a.x + q.x) / 2, cy = (a.y + q.y) / 2;
      el.setAttribute('transform', 'rotate(' + (s.rot % 360) + ' ' + Math.round(cx * 100) / 100 + ' ' + Math.round(cy * 100) / 100 + ')');
    }
    lines.forEach((ln, i) => {
      const t = mk('tspan', { x: a.x, dy: i ? Math.round(fs * 1.35 * 100) / 100 : 0 }, el);
      t.textContent = ln || ' ';
    });
    return [el];
  }
  /** 从画板搬来的矢量块：外层 g 不带 transform（拖动时整片搬走），内层按原包围盒拉到现在这个框里 */
  _inkDrawSvg(s, P) {
    if (!s.mk || !s.pts || s.pts.length < 2) return [];
    const a = s.pts[0], b = s.pts[1];
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    const w = Math.max(1, Math.abs(b.x - a.x)), h = Math.max(1, Math.abs(b.y - a.y));
    const outer = mk('g', {}, P);
    // 跟图片一样：pts 是转过以后的紧包围盒，内容按 cw/ch 居中铺好再整体翻 / 转
    const [cw, ch] = this._inkContentDims(s, w, h);
    const bx = x + w / 2 - cw / 2, by = y + h / 2 - ch / 2;
    const tf = this._inkBoxTf(s, bx, by, cw, ch);
    if (tf) outer.setAttribute('transform', tf);
    const inner = mk('g', {}, outer);
    this._inkSvgFit(inner, s.ob, { x: bx, y: by }, { x: bx + cw, y: by + ch });
    try { if (inner.innerHTML !== undefined) inner.innerHTML = s.mk; } catch (_) { /* 老环境 */ }
    return [outer];
  }
  /** 向量：线 + 箭头，只认首尾两点 */
  _inkDrawVec(s, P) {
    if (!s.pts || s.pts.length < 2) return [];
    const a = s.pts[0], b = s.pts[s.pts.length - 1];
    const out = [];
    const ln = mk('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y }, P);
    this._inkStyle(ln, s, 1);
    out.push(ln);
    const L = Math.hypot(b.x - a.x, b.y - a.y);
    if (L > 3) {
      const w = Math.max(0.6, +s.w || 3);
      const hd = Math.min(L * 0.3, Math.max(9, w * 4.2));
      const ang = Math.atan2(b.y - a.y, b.x - a.x), sp = 0.42;
      const p1 = { x: b.x - hd * Math.cos(ang - sp), y: b.y - hd * Math.sin(ang - sp) };
      const p2 = { x: b.x - hd * Math.cos(ang + sp), y: b.y - hd * Math.sin(ang + sp) };
      const ar = mk('path', { d: `M${b.x} ${b.y}L${p1.x} ${p1.y}L${p2.x} ${p2.y}Z` }, P);
      ar.setAttribute('fill', s.c);
      ar.setAttribute('stroke', s.c);
      ar.setAttribute('stroke-width', Math.max(0.5, w * 0.35));
      ar.setAttribute('stroke-linejoin', 'round');
      out.push(ar);
    }
    return out;
  }
  _inkTmpRender(s) {
    this._inkTmpClear();
    this._inkTmpEls = this._inkDrawStroke(s, this.inkLayer);
  }
  _inkTmpClear() {
    for (const el of this._inkTmpEls || []) if (el.parentNode) el.parentNode.removeChild(el);
    this._inkTmpEls = [];
  }
  _inkRender() {
    if (!this.inkLayer) return;
    this.inkLayer.innerHTML = '';
    this._inkStrokeEls = [];
    this._inkPairG = null;
    for (const s of this._inkStrokes) this._inkStrokeEls.push(this._inkDrawStroke(s));
    this._inkMeasureTexts();   // 文字的实际宽高量一次，选区框 / 双击命中都靠它
    this._inkPairRender();     // 同起点的向量补平行四边形（画在最上层，但不占笔画）
    this._inkSelRender();
  }
  _inkLoad() {
    this._inkQid = this.qid;
    this._inkStopSnap();
    this._inkSel = null; this._inkSelDrag = null; this._inkDrag = null; this._inkPrevEls = [];
    this._inkUndoStack = []; this._inkEraseTook = false; this._inkRecolorSnapAt = 0;   // 换页 / 换板：撤销栈跟着清
    this._inkStrokes = loadInk(this.pagePath || '/', this.qid);
    this._inkRender();
    this._inkSyncTools();
  }
  _inkSyncId() { if (this._inkQid !== this.qid) this._inkLoad(); }
  _inkSave() {
    this._inkSyncId();
    const ok = saveInk(this.pagePath || '/', this.qid, this._inkStrokes);
    if (this._inkBtn) {
      if (!ok) {
        this._inkBtn.title = '批注没能存下：本机存储写满（清掉些批注，或换允许本地存储的浏览方式）';
        this._inkBtn.classList.add('bad');
      } else if (this._inkBtn.classList.contains('bad')) {
        this._inkBtn.title = '批注：在画板上手写、画线与圈重点（再点一次退出）';
        this._inkBtn.classList.remove('bad');
      }
    }
    return ok;
  }
  seg(p1, p2, at) { return mk('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, ...at }, this.dyn); }
  inf(p1, p2, at) { const [a, b] = extSeg(p1, p2); return this.seg(a, b, at); }
  dot(p, r, at) { return mk('circle', { cx: p.x, cy: p.y, r, ...at }, this.dyn); }
  /** 板内文字：数字、拉丁 / 希腊字母、运算符一律排成 KaTeX 的字族（变量斜体、函数名与数字正体），
   *  汉字仍走系统无衬线；'₂' '²' 与 '_{…}' '^{…}' 排成真正的上下标。返回 <text> 元素。 */
  text(p, s, at = {}) {
    const el = mk('text', { x: p.x, y: p.y, 'text-anchor': 'middle', ...at });
    this.dyn.appendChild(el);
    return fillRuns(el, s);
  }
  /** B.text 的公式版：s 里 '$…$' 段走 KaTeX 混排；定位沿 B.text 语义 —— p 为文字基线、默认水平居中，
   *  at 沿用 B.text 的键（'font-size'、fill、'text-anchor'、'font-weight'）。宽度按字符自动预算（可 at.w 覆盖）。 */
  textM(p, s, at = {}) {
    const size = at['font-size'] || 12;
    const anchor = at['text-anchor'] === 'start' ? 'start' : at['text-anchor'] === 'end' ? 'end' : 'mid';
    const wide = [...String(s)].reduce((a, ch) => a + (ch.charCodeAt(0) > 0x2e00 ? 1 : .6), 0);
    return this.tex(V(p.x, p.y - size * .4), s, { size, anchor, color: at.fill, w: at.w || Math.max(60, Math.round(wide * size * 1.3 + 20)),
      bold: at['font-weight'] === 700 || at['font-weight'] === 'bold' });
  }
  /** 画板内嵌公式（foreignObject + KaTeX）：s 支持 '$公式$' 混排，公式段由 KaTeX 排版（根号带上横线、上标真上标）。
   *  o = { size=15, color(语义色号，默认当前墨色), anchor='start'|'mid'|'end', w=340 }；p 为公式的垂直中心点。 */
  tex(p, s, o = {}) {
    const size = o.size || 15, w = o.w || 340, hp = size * 2.4;
    const fo = mk('foreignObject', {
      x: o.anchor === 'mid' ? p.x - w / 2 : o.anchor === 'end' ? p.x - w : p.x,
      y: p.y - hp / 2, width: w, height: hp, style: 'overflow:visible',
    }, o.root || this.dyn); // o.root：换宿主层（hintM 走 this.svg —— 顶层常驻，clear 不清除）
    const d = hEl('div', { class: 'bd-tex' + (o.color ? '' : ' bd-tex-ink'), style: `font-size:${size}px;line-height:${hp}px;white-space:nowrap;`
      + (o.bold ? 'font-weight:700;' : '')
      + `color:${o.color ? paint(o.color) : inkCol()};`
      + `font-family:-apple-system,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;`
      + `text-align:${o.anchor === 'mid' ? 'center' : o.anchor === 'end' ? 'right' : 'left'};` }, fo);
    d.innerHTML = texMix(s);
    return fo;
  }
  clear() { this.dyn.innerHTML = ''; }
  btn(label, fn, opts = {}) {
    const b = hEl('button', { class: 'btn' + (opts.pri ? ' pri' : '') + (opts.on ? ' on' : '') });
    b.textContent = label; b.addEventListener('click', fn); this.ctrl.appendChild(b);
    return b;
  }
  /** 公式版按钮：label 支持 '$公式$' 混排（'① $f(x)=\\sqrt{x}$'）—— 预设名一律用它，中文留在 $ 外；
   *  $ 标签先写 textContent 再写 innerHTML（源串镜像，同 chipM）：真实 DOM 后者覆盖前者，零视觉差异 */
  btnM(label, fn, opts = {}) {
    const b = hEl('button', { class: 'btn' + (opts.pri ? ' pri' : '') + (opts.on ? ' on' : '') });
    b.textContent = label; b.innerHTML = texMix(label); b.addEventListener('click', fn); this.ctrl.appendChild(b);
    return b;
  }
  toggleBtn(label, init, fn) { return this._toggle(label, init, fn, false); }
  /** 公式版开关按钮：label 里 '$…$' 段走 KaTeX 混排（含根号/上标的预设名用它）；
   *  先写 textContent 再写 innerHTML（源串镜像，同 chipM/btnM） */
  toggleBtnM(label, init, fn) { return this._toggle(label, init, fn, true); }
  /** 开关按钮的公共实现：状态同时登记进 this.toggles，分享链接才能把「开/关」一起带过去 */
  _toggle(label, init, fn, math) {
    const b = hEl('button', { class: 'btn' });
    b.textContent = label;
    if (math) b.innerHTML = texMix(label);
    let on = init;
    const sync = () => {
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    };
    sync();
    const set = v => { on = !!v; sync(); fn(on); };
    b.addEventListener('click', () => { set(!on); scheduleQuerySync(); }); this.ctrl.appendChild(b);
    const key = 't' + (this.toggles.length + 1);
    this.toggles.push({ key, label, get: () => (on ? 1 : 0), set });
    return { set, button: b };
  }
  slider(label, min, max, step, val, fn, key) {
    const digits = this._preciseSliders ? Math.max(1, String(step).split('.')[1]?.length ?? 0) : 1;
    const w = hEl('label', { class: 'slider' });
    const s = hEl('input', { type: 'range', min, max, step, value: val }); w.appendChild(s);
    const t = hEl('span', {}, w); t.textContent = `${label} ${fmt(val, digits)}`;
    // URL 键：默认取标签首个拉丁/希腊字母（θ→th 等），无字母则 p1/p2；同板冲突加序号；第 7 参可显式指定
    const base = () => key || sliderKey(label, this.sliders.length);
    let k = base();
    for (let n = 2; this._keys.has(k); n++) k = base() + n;
    this._keys.add(k);
    this.sliders.push({ s, key: k, min, max, label });
    s.addEventListener('input', () => {
      t.textContent = `${label} ${fmt(+s.value, digits)}`;
      fn(+s.value);
      scheduleQuerySync(); // 防抖后把整页滑块状态写进 hash query
    });
    // 程序化同步滑块 UI 与标签：不触发 fn、不把值读回（range 的 value 可能被浏览器按 step 整化）
    s.sync = v => { s.value = v; t.textContent = `${label} ${fmt(+v, digits)}`; };
    this.ctrl.appendChild(w); return s;
  }
  chip(label) { // 返回 update(text, cls)
    const c = hEl('span', { class: 'chip' });
    const lab = hEl('b', {}, c); const val = hEl('span', {}, c);
    lab.textContent = label + ' ';
    this.chipRow.appendChild(c);
    const rec = this._chipRec(label);
    return (t, cls = '') => { rec.text = String(t); val.textContent = t; c.className = 'chip ' + cls; };
  }
  /** 徽章的登记：AI 助手要看得见这一刻的读数（「测得 e ≈ 1.0003」比「e 是个滑块」有用得多） */
  _chipRec(label) {
    if (!this.chips) this.chips = [];
    const rec = { label, text: '' };
    this.chips.push(rec);
    return rec;
  }
  /** 公式版徽章：update 的 text 同样支持 '$公式$' 混排（有缓存，拖动每帧刷新也不卡） */
  chipM(label) {
    const c = hEl('span', { class: 'chip' });
    const lab = hEl('b', {}, c); const val = hEl('span', {}, c);
    // 公式标签走 KaTeX 混排；纯文本标签仍走 textContent —— 无头测试按「textContent 前缀」查徽章，勿一并改
    // $ 标签/值先写 textContent 再写 innerHTML：真实 DOM 后者覆盖前者（零视觉差异），无头 mock 的 textContent 是
    // 普通属性、得以保留为「源串镜像」——测试按源串查标签与断言值，不必解析 KaTeX 内部 HTML（2026-11-09 测试同步）
    if (label.includes('$')) { lab.textContent = label + ' '; lab.innerHTML = texMix(label) + ' '; }
    else lab.textContent = label + ' ';
    this.chipRow.appendChild(c);
    const rec = this._chipRec(label);
    return (t, cls = '') => {
      rec.text = String(t);
      val.textContent = t; val.innerHTML = texMix(t); c.className = 'chip ' + cls;
    };
  }
  /** 「在 GeoGebra 中验证」出口：getCmds() 返回命令数组，点击后带着当前参数打开 /playground。
   *  mode 取 'graphing' 或 '3d'；按钮复用 .dl 的定位与主题配色，挂进右上角导出条（CSS order 排在最左）。 */
  ggbOutlet(getCmds, mode = 'graphing') {
    if (this._ggb) return;
    const b = hEl('button', { class: 'dl ggb-open', title: '把当前图形带到 GeoGebra 里自己动手' });
    b.textContent = '↗ GeoGebra';
    b.addEventListener('click', () => openGGB(getCmds(), mode));
    (this.dlBar || this.root).appendChild(b);
    this._ggb = b;
    // 右侧圆形按钮靠这个登记表取「当前这块板」的命令，点开就带着参数进小窗
    setActiveOutlet({ getCmds, mode, board: this });
  }
  hint(text) { // 画板内提示条（顶层，clear 不清除）；底注开关收起时一并隐藏
    let t = this._hint;
    if (!t) { t = mk('text', { x: this.w / 2, y: this.h - 10, 'text-anchor': 'middle', fill: '#ffd166', 'font-size': 14 }, this.svg); this._hint = t; }
    this._hintT = text || '';
    fillRuns(t, text); t.style.display = text && this._foot ? '' : 'none';
  }
  /** hint 的公式版：text 里 '$…$' 段走 KaTeX 混排（同 hint 顶层常驻、空串隐藏）；宽度一行预算同 hint（字号 14） */
  hintM(text) {
    let fo = this._hintM;
    if (!fo) {
      const hp = 14 * 2.4; // 与 hint 同一水平线：hint 基线在 h−10，字形中心约 h−15.5
      fo = mk('foreignObject', { x: 0, y: this.h - 15.5 - hp / 2, width: this.w, height: hp, style: 'overflow:visible' }, this.svg);
      const d = hEl('div', { style: `font-size:14px;line-height:${hp}px;white-space:nowrap;text-align:center;`
        + `color:${paint('#ffd166')};`
        + `font-family:-apple-system,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;` }, fo);
      this._hintM = fo; this._hintMDiv = d;
    }
    this._hintMT = text || '';
    this._hintMDiv.innerHTML = texMix(text || '');
    fo.style.display = text && this._foot ? '' : 'none';
  }
  /** 函数图象板标配：淡实线网格 + 实线坐标轴（带箭头与轴字母）+ 刻度数字。
   *  m = { px, py, X0, X1, Y0, Y1,          视野与数学→像素映射（B.isoFit 生成：x/y 等单位长、吃满画框）
   *        sx, sy, lx, ly, xt, yt,          网格步长（默认 1）/ 刻度数字步长（默认取网格步长）/ 显式刻度数组
   *        axLab, ayLab,                    轴字母（默认 'x' / 'y'；双面板可传 'y′' 区分）
   *        grid, labs }                     开关（默认 true）：网格线可隐藏；轴字母+刻度数字可整体隐藏
   *  画在 dyn 层，随后画的曲线、色带自然盖在其上；轴色 '#8fa3bd'、网格 '#2b3b53' 实线低透明度、刻度 '#5c6a80'。 */
  grid(m) {
    const gx = m.sx || 1, gy = m.sy || 1;
    this._gridMarked = true;   // 板上有坐标网格 → 背景纸格在「自动」档让路（免得两套网格打架）
    const gAt = { stroke: '#2b3b53', 'stroke-width': .8, 'stroke-opacity': .5 };
    if (m.grid !== false) {
      for (let x = Math.ceil(m.X0 / gx) * gx; x <= m.X1 + 1e-9; x += gx)
        this.seg(V(m.px(x), m.py(m.Y0)), V(m.px(x), m.py(m.Y1)), gAt);
      for (let y = Math.ceil(m.Y0 / gy) * gy; y <= m.Y1 + 1e-9; y += gy)
        this.seg(V(m.px(m.X0), m.py(y)), V(m.px(m.X1), m.py(y)), gAt);
    }
    // 轴宽是**绝对**的（含箭头与轴字母那一笔画），只跟坐标轴线宽倍率走，不再叠线条倍率
    const aAt = { stroke: '#8fa3bd', 'stroke-width': Math.round(1.8 * PREFS.boardAxisW * 100) / 100, __lw: 'abs' };
    const tAt = { 'font-size': 11, fill: '#5c6a80' };
    const inX = m.Y0 <= 0 && m.Y1 >= 0, inY = m.X0 <= 0 && m.X1 >= 0;
    if (inX) { // x 轴：右端箭头 + 字母
      this.seg(V(m.px(m.X0), m.py(0)), V(m.px(m.X1), m.py(0)), aAt);
      mk('polygon', { points: `${m.px(m.X1)},${m.py(0)} ${m.px(m.X1) - 9},${m.py(0) - 4.5} ${m.px(m.X1) - 9},${m.py(0) + 4.5}`, fill: '#8fa3bd' }, this.dyn);
      if (m.labs !== false) this.text(V(m.px(m.X1) - 9, m.py(0) - 10), m.axLab ?? 'x', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    }
    if (inY) { // y 轴：上端箭头 + 字母
      this.seg(V(m.px(0), m.py(m.Y0)), V(m.px(0), m.py(m.Y1)), aAt);
      mk('polygon', { points: `${m.px(0)},${m.py(m.Y1)} ${m.px(0) - 4.5},${m.py(m.Y1) + 9} ${m.px(0) + 4.5},${m.py(m.Y1) + 9}`, fill: '#8fa3bd' }, this.dyn);
      if (m.labs !== false) this.text(V(m.px(0) + 11, m.py(m.Y1) + 15), m.ayLab ?? 'y', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    }
    // 刻度数字：显式数组优先，否则按 lx/ly 步长自取；跳过 0
    const lx = m.lx ?? gx, ly = m.ly ?? gy;
    const xt = m.xt ? m.xt.filter(t => Math.abs(t) > 1e-9) : (() => { const a = []; for (let x = Math.ceil(m.X0 / lx) * lx; x <= m.X1 + 1e-9; x += lx) if (Math.abs(x) > 1e-9) a.push(x); return a; })();
    const yt = m.yt ? m.yt.filter(t => Math.abs(t) > 1e-9) : (() => { const a = []; for (let y = Math.ceil(m.Y0 / ly) * ly; y <= m.Y1 + 1e-9; y += ly) if (Math.abs(y) > 1e-9) a.push(y); return a; })();
    const labY = inX ? m.py(0) + 15 : m.py(m.Y1) + 18;
    const labX = inY ? m.px(0) - 9 : m.px(m.X0) + 8;
    // 刻度数字：浮点累加（x += lx）会拖出 0.6500000000000001 之类长尾，统一清洗为干净小数
    const tickTxt = t => String(Number(t.toPrecision(12)));
    if (m.labs !== false) {
      for (const t of xt) this.text(V(m.px(t), labY), tickTxt(t), tAt);
      for (const t of yt) this.text(V(labX, m.py(t) + 4), tickTxt(t), { ...tAt, 'text-anchor': 'end' });
    }
  }
  /** 等单位取景：要求完整看到 x∈[xa,xb]、y∈[ya,yb]，取 s = min(横/纵容纳能力) 像素每单位 ——
   *  x 与 y 单位长度严格相同（真实比例：45° 就是斜率 1、圆就是圆），非约束方向自然留白，原点不必在画框中央。
   *  rect = [x0,y0,w,h] 指定映射落在画框的哪块像素区（左右双面板各传各的），默认整框；pad 为四周留白。
   *  返回 { px, py, X0, X1, Y0, Y1, s } —— X0..Y1 即该像素区边缘的数学坐标，直接喂给 B.grid / B.asym。 */
  isoFit(xa, xb, ya, yb, rect, pad = 30) {
    const [x0, y0, w, h] = rect || [0, 0, this.w, this.h];
    const s = Math.min((w - 2 * pad) / (xb - xa), (h - 2 * pad) / (yb - ya));
    const cx = (xa + xb) / 2, cy = (ya + yb) / 2;
    return { px: x => x0 + w / 2 + (x - cx) * s, py: y => y0 + h / 2 - (y - cy) * s,
      X0: cx - w / 2 / s, X1: cx + w / 2 / s, Y0: cy - h / 2 / s, Y1: cy + h / 2 / s, s };
  }
  /** 非等单位取景（x/y 各用各的比例尺）：签名、返回值与 isoFit 完全一致，唯一区别是不取 s = min ——
   *  量纲不同的数据图（邮资/个税、指数 y 走 10 个单位、对勾 y 方向量级大）用它，横纵向各自吃满。
   *  pad 默认 24（收编自 hookproof/expgrow/tangentineq 三份逐字相同的局部拷贝）。 */
  mapFit(xa, xb, ya, yb, rect, pad = 24) {
    const [x0, y0, w, h] = rect || [0, 0, this.w, this.h];
    const sx = (w - 2 * pad) / (xb - xa), sy = (h - 2 * pad) / (yb - ya);
    const cx = (xa + xb) / 2, cy = (ya + yb) / 2;
    return { px: x => x0 + w / 2 + (x - cx) * sx, py: y => y0 + h / 2 - (y - cy) * sy,
      X0: cx - w / 2 / sx, X1: cx + w / 2 / sx, Y0: cy - h / 2 / sy, Y1: cy + h / 2 / sy, s: sx };
  }
  /** 显函数曲线采样绘制（「网格 + 锚点」采样规范的引擎化，收编各板手写的 plot 闭包）：
   *  fn: x → y；m: grid/isoFit 的映射对象 {px,py,X0,X1,Y0,Y1}。
   *  o 保留键：anchors —— 必采锚点数组（顶点/端点/挖点边缘/接榫点，与网格并样排序，域外与 NaN 自动丢弃）；
   *    dom —— x => bool 保留判据，false 处抬笔（定义域断开，或只画单调段之类的过滤）；
   *    x0 / x1 —— 采样区间覆写，默认 m.X0/m.X1（对数域左端截断、左右两支各画各的）；
   *    step 或 n —— 单位步长或段数（默认 n = 240）；pad —— y 视野外扩（默认 0，出视野或 NaN 抬笔）。
   *  其余键原样作为 path 属性（stroke、stroke-width…）。返回 path 元素（B.dyn 层）。 */
  plot(fn, m, o = {}) {
    const { dom, anchors, x0, x1, step, n, pad, ...at } = o;
    const a0 = x0 ?? m.X0, a1 = x1 ?? m.X1, dx = step || (a1 - a0) / (n || 240), pd = pad || 0;
    const xs = [];
    for (let x = a0; x <= a1 + dx * 1e-3; x += dx) xs.push(x);
    if (a1 - xs[xs.length - 1] > dx * 1e-6) xs.push(a1);
    for (const a of (anchors || [])) if (isFinite(a) && a > a0 && a < a1) xs.push(a);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      if (!dom || dom(x)) {
        const y = fn(x);
        if (y > m.Y0 - pd && y < m.Y1 + pd) { d += (pen ? 'L' : 'M') + m.px(x).toFixed(1) + ' ' + m.py(y).toFixed(1) + ' '; pen = true; continue; }
      }
      pen = false;
    }
    return mk('path', { d, fill: 'none', ...at }, this.dyn);
  }
  /** 探针三件套（图象规范 ⑪：探针点向 x 轴、y 轴各作一条投影垂线直读坐标，不画斜切线——2026-11-06 用户指定）：
   *  p 探针点（数学坐标 V(x,y)）、m 映射对象。o = { color 垂线色（默认金）、dotColor 点色（默认橙）、
   *    r 点半径（默认 5.5）、halo 点描边色（默认深底色）}；其余键透传给两条垂线
   *    （可覆写 stroke-width / stroke-opacity / stroke-dasharray）。返回探针点元素。 */
  probe(p, m, o = {}) {
    const { color = '#ffd166', dotColor = '#ff9e4a', r = 5.5, halo = '#0a0d14', ...at } = o;
    const P = V(m.px(p.x), m.py(p.y));
    const dash = { stroke: color, 'stroke-width': 1.2, 'stroke-dasharray': '3 5', 'stroke-opacity': .65, ...at };
    this.seg(V(P.x, P.y), V(P.x, m.py(0)), dash);
    this.seg(V(P.x, P.y), V(m.px(0), P.y), dash);
    return this.dot(P, r, { fill: dotColor, stroke: halo, 'stroke-width': 1.5 });
  }
  /** 带箭头的有向线段（向量与方向标注的统一画法，2026-11-09 收编 cauchy/triangleineq 手写箭头）：
   *  按 p→q 方向在终点 q 落一枚实心三角箭头。o = { head=13 箭头长、wide=6 箭头半宽、
   *    line=true 连带画线段（端点自动缩进箭头身内，同色下视觉无差）、...其余键作线段属性 }；
   *  箭头填色取 fill ?? stroke。返回箭头 polygon（B.dyn 层）。
   *  箭头须压在别的线段上时（共线向量、和向量折线）传 line:false —— 各板自画线段后补箭头，z 序自排。 */
  arrow(p, q, o = {}) {
    const { head = 13, wide = 6, line = true, ...at } = o;
    const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L, tx = -uy, ty = ux;
    if (line) this.seg(p, V(q.x - ux * head * .6, q.y - uy * head * .6), at);
    return mk('polygon', { points: `${q.x},${q.y} ${q.x - head * ux + wide * tx},${q.y - head * uy + wide * ty} ${q.x - head * ux - wide * tx},${q.y - head * uy - wide * ty}`, fill: at.fill || at.stroke || '#5cadff' }, this.dyn);
  }
  /** 图象开关工厂（规范 ⑦：网格 / 轴标注 / 渐近线一律做成可隐藏开关）——收编各板三连写 toggleBtn：
   *  st 板状态对象（键直接读写 st[k]）；keys 开哪些、按什么顺序（默认 ['grid','labs','asym']），
   *  元素即 st 的键名（tangap/reciplab 历史上用 asy，也认）；初值读 st[k]（缺省 true）。
   *  文案固定：grid=网格 / labs=标注 / asym|asy=渐近线。返回所建按钮数组（顺序 = keys 顺序）。 */
  graphToggles(st, keys) {
    const LABEL = { grid: '网格', labs: '标注', asym: '渐近线', asy: '渐近线' };
    return (keys || ['grid', 'labs', 'asym']).map(k =>
      this.toggleBtn(LABEL[k], st[k] ?? true, on => { st[k] = on; this.render(); }));
  }
  /** 渐近线（画满视野的虚线，由各板的「渐近线」开关统一隐藏）：list 元素 {v:数} 竖直 x=v / {h:数} 水平 y=h，
   *  自动标注 x=… / y=…；换文案传 t。颜色 '#c084fc' 紫，与曲线、坐标轴都拉得开。 */
  asym(m, list) {
    const at = { stroke: '#c084fc', 'stroke-width': 1.3, 'stroke-dasharray': '7 6', 'stroke-opacity': .8 };
    for (const a of list) {
      if (a.v != null) {
        this.seg(V(m.px(a.v), m.py(m.Y0)), V(m.px(a.v), m.py(m.Y1)), at);
        this.text(V(m.px(a.v) + 7, m.py(m.Y1) + 15), a.t ?? `x=${a.v}`, { 'font-size': 11, fill: '#c084fc', 'text-anchor': 'start' });
      } else {
        this.seg(V(m.px(m.X0), m.py(a.h)), V(m.px(m.X1), m.py(a.h)), at);
        this.text(V(m.px(m.X1) - 8, m.py(a.h) - 7), a.t ?? `y=${a.h}`, { 'font-size': 11, fill: '#c084fc', 'text-anchor': 'end' });
      }
    }
  }
  /** 当前画面的独立 SVG 串：克隆 → 注入底色与文字样式（脱离页面 CSS 也能原样渲染）。
   *  导出 PNG 与逐帧录视频共用这一份。注意：global.css 的 svg text 规则（统一 ink 色 + 底色描边光晕）
   *  优先级高于元素的 fill/font-size 属性，所以注入的样式表要原样复刻这条规则，导出的图才与页面显示一致。 */
  async _svgXML() {
    const th = themeOf(currentTheme());
    const bg = this._bgCol || th.board;   // 画板自选底色优先，没选就取主题表里的 .board 底色（= var(--bg2)）
    const ink = this._inkCol || th.ink;   // 调色板自选底色会带自己的墨色（深底浅字 / 浅底深字），导出与屏幕一致
    const clone = this.svg.cloneNode(true);
    clone.setAttribute('width', this.w);
    clone.setAttribute('height', this.h);
    // WebGL 曲面层（gl3d）：克隆里的 foreignObject 只有一块空画布，画布像素不进 SVG 串，
    // 换成一枚 <image>；不给就整块摘掉，导出的图不会多出一个空框
    if (this._glSnapshot) {
      const fo = clone.querySelector('foreignObject.gl-fo');
      if (fo) {
        const url = this._glSnapshot();
        if (url) clone.replaceChild(mk('image', { x: 0, y: 0, width: this.w, height: this.h, href: url }), fo);
        else clone.removeChild(fo);
      }
    }
    const st = mk('style', {}, clone);
    // 注入的规则必须与 global.css 那条逐字对齐（页面 CSS 的优先级高于呈现属性），
    // 只有字号改成 --bd-fs 的真实像素值：导出的图不读页面的 --bd-fs 变量
    st.textContent = 'text{fill:var(--bd-svg-ink,' + ink + ');font-size:' + boardFontPx() + 'px;paint-order:stroke;stroke:' + bg
      + ';stroke-width:3px;stroke-linejoin:round;'
      + "font-family:-apple-system,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif}"
      + (this._inkCol ? '.bd-tex-ink{color:' + ink + ' !important}' : '');
    // 预设纸面的斜向渐变：导出的 SVG 里没有 CSS，这里换成一枚 linearGradient 让底图照旧有渐变
    const gd = this._skinCol ? skinGrad(this._skinCol) : null;
    if (gd) {
      const lg = mk('linearGradient', {
        id: 'bd-skin', x1: gd.x1.toFixed(4), y1: gd.y1.toFixed(4),
        x2: gd.x2.toFixed(4), y2: gd.y2.toFixed(4),
      }, mk('defs', {}, clone));
      for (const s of gd.stops) mk('stop', { offset: String(+s.o.toFixed(4)), 'stop-color': s.c }, lg);
    }
    clone.insertBefore(mk('rect', {
      x: 0, y: 0, width: this.w, height: this.h, fill: gd ? 'url(#bd-skin)' : bg,
    }), clone.firstChild);
    clone.insertBefore(st, clone.firstChild);
    // 公式（foreignObject）与 KaTeX 字族的 tspan 都要把字体内联进去，否则导出图退回系统字体
    if (clone.querySelector('foreignObject, tspan')) st.textContent += await katexCss();
    return new XMLSerializer().serializeToString(clone);
  }
  /** 导出当前画面为 PNG（默认 2× 分辨率）→ 下载。name 不给时按 _saveBase 或当前路由起名。 */
  async exportPNG(scale = 2, name) {
    const xml = await this._svgXML();
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = this.w * scale; c.height = this.h * scale;
      const ctx = c.getContext('2d');
      ctx.scale(scale, scale); ctx.drawImage(img, 0, 0);
      const d = new Date(), p2 = n => String(n).padStart(2, '0');
      const stamp = d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + '-' + p2(d.getHours()) + p2(d.getMinutes());
      const fn = name || (this._saveBase ? this._saveBase + '-' + stamp + '.png'
        : (nowHash().replace(/^#\/?/, '').replace(/[/?&=]/g, '-') || 'board') + '-' + this.uid.replace('clip', '') + '.png');
      const a = hEl('a', { download: fn });
      a.href = c.toDataURL('image/png'); a.click();
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  }
  /** 录制画板动画 → 视频文件（优先 MP4/H.264，浏览器不支持就退 WebM）。
   *  点一次开始（按钮转成计时），再点一次结束并下载；录的是板上正在发生的一切（滑块、预设、自动播放），
   *  帧时间戳取墙钟，所以时长与真实播放一致；单段上限 60 秒，到点自动停并下载。 */
  exportVideo(opts = {}) {
    if (this._rec) { this._rec.stop(); this._rec = null; return; }
    const btn = this._vidBtn;
    // 会话号：上一段录制的 onstop 迟到时不能把新一段的按钮状态改回去
    const sid = (this._recSid = (this._recSid || 0) + 1);
    const set = (t, on) => {
      if (!btn || this._recSid !== sid) return;
      btn.textContent = t;
      btn.classList.toggle('on', !!on);
    };
    this._rec = recordBoard(this, {
      ...opts,
      onState: s => {
        if (s.start) set('■ 0:00', true);
        else if (s.tick != null) set('■ ' + Math.floor(s.tick / 60) + ':' + String(s.tick % 60).padStart(2, '0'), true);
        else if (s.done || s.error) {
          set('● 视频', false);
          if (this._recSid === sid) this._rec = null;
          if (btn && s.error && this._recSid === sid) btn.title = s.error;
        }
      },
    });
  }
  /** 挂载时从 location.hash 的 query 恢复滑块状态（BoardMount 调用）：#/conics/def4?b1.e=1.4 → 滑块 e=1.4。
   *  URL 值产自 step 网格，dispatch 走既有 input 回调读回时不会漂移；越界值夹回 [min,max]。 */
  applyQuery() {
    const q = nowHash().split('?')[1];
    if (!q) return;
    const map = new URLSearchParams(q);
    let hit = false;
    for (const { s, key, min, max } of this.sliders) {
      const v = map.get(this.qid + '.' + key);
      if (v != null && v !== '' && isFinite(+v)) {
        s.value = Math.max(min, Math.min(max, +v));
        s.dispatchEvent(new Event('input')); // 既有 input 回调：状态更新 + 重渲染一次到位
        hit = true;
      }
    }
    for (const t of this.toggles || []) {   // 开关状态：t.set 会重画，不必再兜底
      const v = map.get(this.qid + '.' + t.key);
      if (v != null && v !== '' && isFinite(+v)) { t.set(+v ? 1 : 0); hit = true; }
    }
    const cv = map.get(this.qid + '.cam');
    if (cv && this.camSet) {
      const [y, p] = cv.split(',').map(Number);
      if (isFinite(y) && isFinite(p)) { this.camSet({ yaw: y, pitch: p }); hit = true; }
    }
    if (hit) this.render(); // 个别滑块回调不重渲染，兜底再画一次
  }
  handle(st) { // st:{get,set,drag,color,r,label,lo,clamp,thin}
    const r = st.r || 7;
    const c = mk('circle', { class: 'hnd', r, fill: st.color || '#fff', stroke: '#fff', 'stroke-width': 2,
      tabindex: 0, 'aria-label': st.label ? `可移动点 ${st.label}` : '可移动点',
      'aria-description': '用方向键移动，按住 Shift 加大步长' }, this.hd);
    if (st.thin) c.setAttribute('fill-opacity', .55);
    const lbl = st.label ? mk('text', { class: 'hndlbl', 'font-size': 13, 'font-weight': 700 }, this.hd) : null;
    this.handles.push({ c, lbl, st });
    const moveTo = p => {
      if (st.clamp) p = st.clamp(p);
      else { p.x = Math.max(14, Math.min(this.w - 14, p.x)); p.y = Math.max(14, Math.min(this.h - 14, p.y)); }
      st.set(p); this.sync(); st.drag && st.drag(); this.render();
    };
    c.addEventListener('keydown', ev => {
      if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
      const dx = Number(ev.key === 'ArrowRight') - Number(ev.key === 'ArrowLeft');
      const dy = Number(ev.key === 'ArrowDown') - Number(ev.key === 'ArrowUp');
      if (!dx && !dy) return;
      ev.preventDefault();
      ev.stopPropagation();
      if (this._inkOn) return;
      const p = st.get(), step = ev.shiftKey ? 20 : 5;
      moveTo(V(p.x + dx * step, p.y + dy * step));
    });
    c.addEventListener('pointerdown', ev => {
      ev.preventDefault(); c.setPointerCapture(ev.pointerId); c.classList.add('drag');
      const move = e2 => moveTo(this.px(e2));
      const up = () => {
        c.classList.remove('drag');
        c.removeEventListener('pointermove', move);
        c.removeEventListener('pointerup', up);
        c.removeEventListener('pointercancel', up);
      };
      c.addEventListener('pointermove', move); c.addEventListener('pointerup', up);
      c.addEventListener('pointercancel', up);
    });
    return c;
  }
  sync() {
    for (const { c, lbl, st } of this.handles) {
      const p = st.get();
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
      if (lbl) { lbl.setAttribute('x', p.x + (st.lo ? st.lo[0] : 9)); lbl.setAttribute('y', p.y + (st.lo ? st.lo[1] : -9)); fillRuns(lbl, st.label); }
    }
  }
  render() {
    this.syncTint();
    // 字号倍率写进板根：global.css 的 svg text 规则读 --bd-fs（缺省 12px，旧板原样）
    const st = this.root && this.root.style;
    if (st && st.setProperty) st.setProperty('--bd-fs', boardFontPx() + 'px');
    this._lblSyncId();
    if (this.renderFn) {
      // 纸面自带的亮/暗家族：这一块板画图期间语义色按它取，画完交还（别的板各用各的）
      const prevFam = FAM_LIGHT;
      FAM_LIGHT = this._famLight == null ? null : this._famLight;
      try {
        this.clear();
        this._gridMarked = false;   // 本次重画有没有坐标网格，等 B.grid 自己举手
        this.renderFn();
        this.sync();
        this._applyLblOffsets();
        this._paperDraw();          // 纸格在网格标记定下来之后再铺（「自动」档要看它）
      } finally {
        FAM_LIGHT = prevFam;
      }
    }
  }
}

/* ---------- 给 AI 助手的画板快照 ----------
   助手窗（ChatDock）常驻首屏，不能反过来 import 本文件；所以由这里把取值函数登记进 boardctx.js。
   只报这一页的板，最多三块：滑块现值、亮着的开关、徽章读数（「测得 e ≈ 1.0003」比「e 是个滑块」有用）、三维视角。 */
setBoardContextProvider(() => {
  const path = nowHash().split('?')[0];
  const rows = [];
  for (const b of BOARDS) {
    if (b.pagePath !== path) continue;
    const bits = [];
    for (const c of b.chips || []) if (c.text) bits.push(c.label + ' ' + c.text);
    for (const s of b.sliders || []) bits.push(s.label + ' = ' + s.s.value);
    for (const t of b.toggles || []) if (t.get()) bits.push(t.label + '：开');
    if (b.camGet) {
      const c = b.camGet();
      if (c && isFinite(c.yaw) && isFinite(c.pitch)) bits.push('三维视角 yaw ' + c.yaw.toFixed(2) + '、pitch ' + c.pitch.toFixed(2));
    }
    if (bits.length) rows.push(b.qid + '：' + bits.join('；'));
  }
  return rows.slice(0, 3).join('\n');
});
