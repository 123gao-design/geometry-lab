/* ================= SVG 画板引擎 + 主题系统 ================= */
import katex from 'katex';
import { THEMES, themeOf, currentTheme, isLight, applyTheme, initTheme, mountThemeButton, animEnabled, setAnim, initAnim, onThemeChange } from './theme.js';
import { V, extSeg, fmt } from './math.js';
import { openGGB, setActiveOutlet, clearActiveOutlet } from './ggb.js';
import { recordBoard } from './record.js';
import { readLabels, writeLabels, defaultBoard } from './labelstore.js';
export * from './math.js'; // 画板模块统一从 board.js 导入数学工具
// 主题与光影的实现已挪到 theme.js（首屏不该为它拖整个引擎），这里转出去，老路子的 import 照旧可用
export { THEMES, themeOf, currentTheme, isLight, applyTheme, initTheme, mountThemeButton, animEnabled, setAnim, initAnim, onThemeChange } from './theme.js';

const SVGNS = 'http://www.w3.org/2000/svg';

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
function paint(c) {
  const m = COLOR[c];
  if (!m) return c;
  return document.documentElement.classList.contains('light') ? m[1] : m[0];
}

export function mk(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) {
    let v = attrs[k];
    if (k === 'fill' || k === 'stroke') v = paint(v);
    k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
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
/* 画板缩放范围：1 = 原样；下限 0.4（画面缩到四成、四周自然留白），上限 6 */
const ZMIN = 0.4, ZMAX = 6;
const clampR = (v, a, b) => Math.max(Math.min(a, b), Math.min(Math.max(a, b), v)); // 两端大小颠倒也成立

/* 每块板可自选的底色：同一亮/暗家族里的几档，选「蓝调」后切主题会自动换成另一家族的同名档，
   墨色与语义色（COLOR 表）仍按亮/暗家族走，文字始终读得清 */
const TINTS = [
  { n: '纯净', dark: '#05070b', light: '#ffffff' },
  { n: '蓝调', dark: '#0a1428', light: '#eef4fb' },
  { n: '绿调', dark: '#08160f', light: '#eef8f1' },
  { n: '紫调', dark: '#130b26', light: '#f4f0fb' },
  { n: '暖调', dark: '#17110a', light: '#fbf5e9' },
];
/* 自定义底色用：按相对亮度挑墨色（深底配浅字、浅底配深字），文字始终读得清 */
const INK_LIGHT = '#e8eef7', INK_DARK = '#20293a';
const lumOf = c => {
  const m = /^#([0-9a-f]{6})$/i.exec(c || '');
  if (!m) return null;
  const n = parseInt(m[1], 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
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
  }
  try { history.replaceState(null, '', path + (parts.length ? '?' + parts.join('&') : '')); } catch (_) { /* 受限环境忽略 */ }
}

/* ---------- 画板 ---------- */
export class Board {
  /**
   * @param root  HTML 容器元素（.board）
   * @param w,h   画板逻辑尺寸（viewBox）
   */
  constructor(root, w, h) {
    this.w = w; this.h = h;
    this.handles = []; this.renderFn = null; this._rafs = [];
    this.root = root;
    this.svg = mk('svg', { viewBox: `0 0 ${w} ${h}`, style: `aspect-ratio:${w}/${h}` });
    root.appendChild(this.svg);
    const defs = mk('defs', {}, this.svg), uid = 'clip' + (Board.n = (Board.n || 0) + 1);
    mk('clipPath', { id: uid }, defs).appendChild(mk('rect', { x: 0, y: 0, width: w, height: h }));
    this.uid = uid;
    this.dyn = mk('g', { 'clip-path': `url(#${uid})` }, this.svg); // 动态重绘层
    this.hd = mk('g', {}, this.svg);                              // 把手层（不裁剪）
    this.ctrl = hEl('div', { class: 'ctrl' }); root.appendChild(this.ctrl);
    this.chipRow = hEl('div', { class: 'ctrl chips', style: 'border-top:none;padding-top:0' });
    root.appendChild(this.chipRow);
    // 实验参数进 URL：滑块注册表 + 命名空间（默认 b1/b2…，BoardMount 的 id 属性可覆盖）+ 挂载时的页面路径
    this.sliders = []; this._keys = new Set();
    this.qid = 'b' + (BOARDS.length + 1);
    this.pagePath = nowHash().split('?')[0];
    // 画板操作条：默认悬浮画板右上角，hover 才现身（CSS 见 global.css .dlbar / .dl）。
    // 缩放（＋/－）、半屏/全屏、PNG 与视频由引擎自带；GeoGebra 出口（ggbOutlet）也挂进这一条。
    // 设置页可以把这一条搬到板的上方（靠左 / 靠右），落位由 _placeBar() 管
    this.dlBar = hEl('div', { class: 'dlbar' });
    root.appendChild(this.dlBar);
    this._barPos = barPosPref();
    this._placeBar();
    // 缩放状态：viewBox 当相机（条内靠 CSS order 排在最左：＋ － ｜ ◧ ⛶ ｜ GeoGebra ｜ 视频 ｜ ▤ 底色 ｜ Aa 底注 ｜ PNG）
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
    const half = hEl('button', { class: 'dl fs', title: '半屏展示这一块画板（再点一次复原）' });
    half.textContent = '◧ 半屏';
    half.addEventListener('click', () => this.setFloat('half'));
    this.dlBar.appendChild(half);
    this._fsHalf = half;
    const full = hEl('button', { class: 'dl fs', title: '全屏展示这一块画板（Esc 或再点一次复原）' });
    full.textContent = '⛶ 全屏';
    full.addEventListener('click', () => this.setFloat('full'));
    this.dlBar.appendChild(full);
    this._fsFull = full;
    this._bindFloatKeys();
    const dl = hEl('button', { class: 'dl png', title: '导出当前画板为 PNG 图片' });
    dl.textContent = '⤓ PNG';
    dl.addEventListener('click', () => this.exportPNG());
    this.dlBar.appendChild(dl);
    const vb = hEl('button', { class: 'dl vid', title: '把画板上的动画录成视频：点一次开始，再点一次结束并下载' });
    vb.textContent = '● 视频'; // 用文字符号不是 ⏺（U+23FA 带 emoji 表现，会按彩色 emoji 字形渲染，比别的钮高一块）
    vb.addEventListener('click', () => this.exportVideo());
    this.dlBar.appendChild(vb);
    this._vidBtn = vb;
    // 画板底色：只改这一块板（同一亮/暗家族里的几档 + 调色板自选色，切主题时自动换成对应家族的那一档）
    this._tint = -1;
    this._bgCol = '';
    this._inkCol = '';
    this._custom = ''; // 调色板自选的底色（-2 号档）
    this._tintBtn = hEl('button', { class: 'dl tint', title: '画板底色：只改这一块板；预设随亮/暗主题给对应色，调色板可选任意颜色' });
    this._tintBtn.textContent = '▤ 底色';
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
    const host = r.parentElement;
    // 父容器是 flex / grid 时不多塞一个格子（会顶乱两栏排布）：退回板内顶部一条，样式照旧是 .out
    let flow = true;
    try {
      const dv = host && host.ownerDocument && host.ownerDocument.defaultView;
      flow = !dv || !/flex|grid/.test(dv.getComputedStyle(host).display || '');
    } catch (_) { flow = true; }
    const want = out && !this._floatMode && flow && host ? host : r;
    const cur = bar.parentElement || bar.parent; // 无头测试的 mock 只记 parent
    if (cur === want) return;
    if (want === host) host.insertBefore(bar, r);
    else if (out) want.insertBefore(bar, want.firstChild || null); // 板内档也要排在最前：非 flex 容器靠 DOM 序
    else want.appendChild(bar);
  }
  /** 包装 rAF：销毁时统一取消，防止离开页面后动画继续运行 */
  raf(fn) { const id = requestAnimationFrame(fn); this._rafs.push(id); return id; }
  cancelRaf() { this._rafs.forEach(id => cancelAnimationFrame(id)); this._rafs = []; }
  destroy() {
    this._applyFloat(''); // 浮着的板被卸掉：先收回常态并解开页面滚动锁
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
    this.root.innerHTML = '';
    const i = BOARDS.indexOf(this);
    if (i >= 0) BOARDS.splice(i, 1);
  }
  px(ev) { // 指针事件 → 画板坐标（按当前 viewBox 映射：缩放后光标下的图形仍对准光标）
    const r = this.svg.getBoundingClientRect(), v = this._vb;
    let w = r.width, h = r.height, ox = 0, oy = 0;
    // 半屏 / 全屏时 svg 被拉满容器、内容按 preserveAspectRatio 等比居中，两侧或上下会留边；
    // 平时容器宽高比就是 viewBox 宽高比，这一段是恒等变换（无头测试按 800×450 量，也走原口径）。
    if (this._floatMode && w && h) {
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
  _syncVB() {
    const v = this._vb;
    this.svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.h}`);
    if (this._zbOut) this._zbOut.disabled = this._z <= ZMIN + 1e-3; // 已到 0.4 倍时「－」不可点
    if (this._zbIn) this._zbIn.disabled = this._z >= ZMAX - 1e-3;
    // 三维板的 cursor 归 orbit() 管（grab / grabbing），这里别覆盖
    if (this.svg.style && !this.orbitCam) this.svg.style.cursor = Math.abs(this._z - 1) > 1e-3 ? 'grab' : '';
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
    svg.addEventListener('dblclick', ev => { if (!isHnd(ev.target)) this.zoomTo(1); });
  }
  /* ---------- 半屏 / 全屏 ----------
     把这一块板 root 改成 fixed 浮层（CSS 见 global.css .bd-float/.bd-half/.bd-full），
     同一时刻只浮一块：另开一块时先上一块自动收回；Esc 或再点一次同一颗钮复原。 */
  setFloat(mode) { this._applyFloat(this._floatMode === mode ? '' : mode); }
  _applyFloat(m) {
    if (OPEN_FLOAT && OPEN_FLOAT !== this) OPEN_FLOAT._applyFloat(''); // 收回上一位
    this._floatMode = m || '';
    const r = this.root;
    if (r && r.classList) {
      r.classList.toggle('bd-float', !!this._floatMode);
      r.classList.toggle('bd-half', this._floatMode === 'half');
      r.classList.toggle('bd-full', this._floatMode === 'full');
    }
    if (this._floatMode) OPEN_FLOAT = this;
    else if (OPEN_FLOAT === this) OPEN_FLOAT = null;
    // 全屏时锁住页面滚动，免得滚轮带着底下的正文跑；半屏不锁（还看得见页面）
    const lock = !!(OPEN_FLOAT && OPEN_FLOAT._floatMode === 'full');
    if (document.documentElement && document.documentElement.classList) document.documentElement.classList.toggle('bd-lock', lock);
    if (this._fsHalf) this._fsHalf.classList.toggle('on', this._floatMode === 'half');
    if (this._fsFull) this._fsFull.classList.toggle('on', this._floatMode === 'full');
    this._placeBar(); // 浮起来时把条收回板内，复原后送回板外（设置成板内悬浮时不动）
  }
  _bindFloatKeys() {
    if (!document.addEventListener) return;
    const onKey = e => { if (e && e.key === 'Escape' && this._floatMode) this._applyFloat(''); };
    document.addEventListener('keydown', onKey);
    this._offKey = () => document.removeEventListener && document.removeEventListener('keydown', onKey);
  }
  /* ---------- 底色：同一亮暗家族里的几档 + 调色板自选 ---------- */
  _buildTintPop() {
    const pop = hEl('div', { class: 'tint-pop', style: 'display:none' }, this.root);
    const t = hEl('div', { class: 'tint-t' }, pop);
    t.textContent = '画板底色（只改这一块）';
    const row = hEl('div', { class: 'tint-row' }, pop);
    const sws = [];
    const add = (name, bg, idx) => {
      const b = hEl('button', { class: 'tint-sw' + (idx < 0 ? ' theme' : ''), title: name });
      if (bg) b.style.cssText = 'background:' + bg;
      b.textContent = idx < 0 ? '沿用主题' : '';
      b.addEventListener('click', () => { this.setTint(idx); this._tintClose(); });
      row.appendChild(b); sws.push(b);
    };
    add('沿用页面主题的底色', '', -1);
    TINTS.forEach((x, i) => add(x.n + '（' + (isLight() ? x.light : x.dark) + '）', isLight() ? x.light : x.dark, i));
    // 调色板：任意底色；文字墨色按底色亮度自动换（深底配浅字、浅底配深字）
    const crow = hEl('div', { class: 'tint-row tint-custom' }, pop);
    const pick = hEl('label', { class: 'tint-pick', title: '调色板：自选任意底色，文字自动换成深/浅墨色' }, crow);
    const inp = hEl('input', { type: 'color' }, pick);
    inp.value = this._custom || (isLight() ? '#f4f1e8' : '#0a0d14');
    inp.setAttribute && inp.setAttribute('value', inp.value);
    const pl = hEl('span', {}, pick); pl.textContent = '自定义';
    inp.addEventListener('input', () => {
      this._custom = inp.value || '';
      this._tint = -2;
      this._syncTintSw();
      this.syncTint();
    });
    // 已选过自定义色、后来切回预设：再点一次取色器就恢复自定义（同色不出 input 事件，靠这一条兜底）
    inp.addEventListener('click', () => {
      if (!this._custom) return;
      this._tint = -2;
      this._syncTintSw();
      this.syncTint();
    });
    this._tintPick = inp;
    this._tintPickLab = pick;
    this._tintPop = pop;
    this._tintSws = sws; // [0] 是「沿用主题」，k 对应 TINTS[k−1]
    this._tintOpen = false;
    this._tintOpenPop = () => { this._syncTintSw(); this._tintOpen = true; pop.style.display = 'flex'; };
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
  setTint(i) { this._tint = i; this._syncTintSw(); this.syncTint(); }
  _syncTintSw() {
    if (!this._tintSws) return;
    const light = isLight();
    this._tintSws.forEach((b, k) => {
      if (k > 0) b.style.cssText = 'background:' + (light ? TINTS[k - 1].light : TINTS[k - 1].dark);
      b.classList.toggle('on', k - 1 === this._tint);
    });
    if (this._tintPick) {
      if (this._custom) this._tintPick.value = this._custom;
      if (this._tintPickLab && this._tintPickLab.classList) this._tintPickLab.classList.toggle('on', this._tint === -2);
    }
  }
  /** 把当前底色写到 --bd-bg：.board 背景与 svg 文字的底色光晕都读它；
   *  调色板自选色再按亮度写 --bd-ink（svg 文字与 KaTeX 公式的墨色），深底浅字、浅底深字。
   *  没选就交还主题色。切主题时 render() 会再调一次，预设档自动换成另一家族的同名档。 */
  syncTint() {
    const col = this._tint === -2 ? (this._custom || '')
      : this._tint >= 0 ? (isLight() ? TINTS[this._tint].light : TINTS[this._tint].dark) : '';
    const l = col && this._tint === -2 ? lumOf(col) : null;
    const ink = l == null ? '' : (l < .42 ? INK_LIGHT : INK_DARK);
    if (col === this._bgCol && ink === this._inkCol) return;
    this._bgCol = col; this._inkCol = ink;
    const st = this.root && this.root.style;
    if (!st || !st.setProperty) return; // 无头 mock 的 style 是普通对象
    if (col) st.setProperty('--bd-bg', col);
    else if (st.removeProperty) st.removeProperty('--bd-bg');
    if (ink) st.setProperty('--bd-ink', ink);
    else if (st.removeProperty) st.removeProperty('--bd-ink');
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
      if (svg.style && !this.orbitCam) svg.style.cursor = this._z == null || Math.abs(this._z - 1) > 1e-3 ? 'grab' : '';
      this._lblSave(); // 拖动结束后落盘（设置里「记住板内文字位置」开着时才写）
    };
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('dblclick', ev => { // 双击已挪过的标签：回到原位（没挪过的留给画板双击复原缩放）
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
  refreshLabels() { this._lblLoad(); this.render(); }
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
  seg(p1, p2, at) { return mk('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, ...at }, this.dyn); }
  inf(p1, p2, at) { const [a, b] = extSeg(p1, p2); return this.seg(a, b, at); }
  dot(p, r, at) { return mk('circle', { cx: p.x, cy: p.y, r, ...at }, this.dyn); }
  text(p, s, at = {}) { return mk('text', { x: p.x, y: p.y, 'text-anchor': 'middle', text: s, ...at }, this.dyn); }
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
  toggleBtn(label, init, fn) {
    const b = hEl('button', { class: 'btn' }); b.textContent = label;
    let on = init; const sync = () => b.classList.toggle('on', on); sync();
    b.addEventListener('click', () => { on = !on; sync(); fn(on); }); this.ctrl.appendChild(b);
    return { set(v) { on = v; sync(); fn(on); } };
  }
  /** 公式版开关按钮：label 里 '$…$' 段走 KaTeX 混排（含根号/上标的预设名用它）；
   *  先写 textContent 再写 innerHTML（源串镜像，同 chipM/btnM） */
  toggleBtnM(label, init, fn) {
    const b = hEl('button', { class: 'btn' }); b.textContent = label; b.innerHTML = texMix(label);
    let on = init; const sync = () => b.classList.toggle('on', on); sync();
    b.addEventListener('click', () => { on = !on; sync(); fn(on); }); this.ctrl.appendChild(b);
    return { set(v) { on = v; sync(); fn(on); } };
  }
  slider(label, min, max, step, val, fn, key) {
    const w = hEl('label', { class: 'slider' });
    const s = hEl('input', { type: 'range', min, max, step, value: val }); w.appendChild(s);
    const t = hEl('span', {}, w); t.textContent = `${label} ${fmt(val, 1)}`;
    // URL 键：默认取标签首个拉丁/希腊字母（θ→th 等），无字母则 p1/p2；同板冲突加序号；第 7 参可显式指定
    const base = () => key || sliderKey(label, this.sliders.length);
    let k = base();
    for (let n = 2; this._keys.has(k); n++) k = base() + n;
    this._keys.add(k);
    this.sliders.push({ s, key: k, min, max });
    s.addEventListener('input', () => {
      t.textContent = `${label} ${fmt(+s.value, 1)}`;
      fn(+s.value);
      scheduleQuerySync(); // 防抖后把整页滑块状态写进 hash query
    });
    // 程序化同步滑块 UI 与标签：不触发 fn、不把值读回（range 的 value 可能被浏览器按 step 整化）
    s.sync = v => { s.value = v; t.textContent = `${label} ${fmt(+v, 1)}`; };
    this.ctrl.appendChild(w); return s;
  }
  chip(label) { // 返回 update(text, cls)
    const c = hEl('span', { class: 'chip' });
    const lab = hEl('b', {}, c); const val = hEl('span', {}, c);
    lab.textContent = label + ' ';
    this.chipRow.appendChild(c);
    return (t, cls = '') => { val.textContent = t; c.className = 'chip ' + cls; };
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
    return (t, cls = '') => { val.textContent = t; val.innerHTML = texMix(t); c.className = 'chip ' + cls; };
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
    t.textContent = text; t.style.display = text && this._foot ? '' : 'none';
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
    const gAt = { stroke: '#2b3b53', 'stroke-width': .8, 'stroke-opacity': .5 };
    if (m.grid !== false) {
      for (let x = Math.ceil(m.X0 / gx) * gx; x <= m.X1 + 1e-9; x += gx)
        this.seg(V(m.px(x), m.py(m.Y0)), V(m.px(x), m.py(m.Y1)), gAt);
      for (let y = Math.ceil(m.Y0 / gy) * gy; y <= m.Y1 + 1e-9; y += gy)
        this.seg(V(m.px(m.X0), m.py(y)), V(m.px(m.X1), m.py(y)), gAt);
    }
    const aAt = { stroke: '#8fa3bd', 'stroke-width': 1.8 };
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
    st.textContent = 'text{fill:' + ink + ';font-size:12px;paint-order:stroke;stroke:' + bg
      + ';stroke-width:3px;stroke-linejoin:round;'
      + "font-family:-apple-system,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif}"
      + (this._inkCol ? '.bd-tex-ink{color:' + ink + ' !important}' : '');
    clone.insertBefore(mk('rect', { x: 0, y: 0, width: this.w, height: this.h, fill: bg }), clone.firstChild);
    clone.insertBefore(st, clone.firstChild);
    if (clone.querySelector('foreignObject')) st.textContent += await katexCss();
    return new XMLSerializer().serializeToString(clone);
  }
  /** 导出当前画面为 PNG（默认 2× 分辨率）→ 下载。 */
  async exportPNG(scale = 2) {
    const xml = await this._svgXML();
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = this.w * scale; c.height = this.h * scale;
      const ctx = c.getContext('2d');
      ctx.scale(scale, scale); ctx.drawImage(img, 0, 0);
      const name = (nowHash().replace(/^#\/?/, '').replace(/[/?&=]/g, '-') || 'board') + '-' + this.uid.replace('clip', '') + '.png';
      const a = hEl('a', { download: name });
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
    if (hit) this.render(); // 个别滑块回调不重渲染，兜底再画一次
  }
  handle(st) { // st:{get,set,drag,color,r,label,lo,clamp,thin}
    const r = st.r || 7;
    const c = mk('circle', { class: 'hnd', r, fill: st.color || '#fff', stroke: '#fff', 'stroke-width': 2 }, this.hd);
    if (st.thin) c.setAttribute('fill-opacity', .55);
    const lbl = st.label ? mk('text', { class: 'hndlbl', 'font-size': 13, 'font-weight': 700 }, this.hd) : null;
    this.handles.push({ c, lbl, st });
    c.addEventListener('pointerdown', ev => {
      ev.preventDefault(); c.setPointerCapture(ev.pointerId); c.classList.add('drag');
      const move = e2 => {
        let p = this.px(e2);
        if (st.clamp) p = st.clamp(p);
        else { p.x = Math.max(14, Math.min(this.w - 14, p.x)); p.y = Math.max(14, Math.min(this.h - 14, p.y)); }
        st.set(p); this.sync(); st.drag && st.drag(); this.render();
      };
      const up = () => { c.classList.remove('drag'); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); };
      c.addEventListener('pointermove', move); c.addEventListener('pointerup', up);
    });
    return c;
  }
  sync() {
    for (const { c, lbl, st } of this.handles) {
      const p = st.get();
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
      if (lbl) { lbl.setAttribute('x', p.x + (st.lo ? st.lo[0] : 9)); lbl.setAttribute('y', p.y + (st.lo ? st.lo[1] : -9)); lbl.textContent = st.label; }
    }
  }
  render() { this.syncTint(); this._lblSyncId(); if (this.renderFn) { this.clear(); this.renderFn(); this.sync(); this._applyLblOffsets(); } }
}
