import { Board, mk } from './board.js';
import { paperOf } from './papers.js';
import { currentTheme } from './theme.js';

const LIGHT = { ink: '#202d3a', blue: '#2b598c', gold: '#8a5529', mint: '#316763', pink: '#794e69', guide: '#56677a', orange: '#a05434', green: '#356c4c', violet: '#66528b', red: '#a12a38' };
const DARK = { ink: '#e8edf5', blue: '#95b9e5', gold: '#d5a77f', mint: '#8ebfb7', pink: '#cba5be', guide: '#a0aec2', orange: '#e3a183', green: '#9bc5a5', violet: '#b8a9db', red: '#ff8894' };
const rgb = hex => hex.slice(1).match(/../g).map(channel => parseInt(channel, 16));
function luminance(channels) {
  const [r, g, b] = channels.map(v => {
    const s = v / 255;
    return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
  });
  return .2126 * r + .7152 * g + .0722 * b;
}

/* 配色方案：画板跟随「纸面预设」或「整站主题」两套来源。
   主题档：暗夜与纸面这两套默认主题保持原来的 LIGHT / DARK 色板与强调色不变；
   其余六套主题改用页面自己的语义色（--blue / --pink / --green / --purple / --cyan），
   墨色、辅助灰与警示红仍按纸面明暗取基础色板。
   纸面预设档直接用 papers.js 里为该档配好的 indigo / blue / green / purple / pink / cyan 与 graphite / alert，
   于是一档纸面就是一套配色，而不只是换一张底。
   强调色（光晕、关注点外的柔光）：主题档沿用原来的三条规则（暮夜紫、暖沙橙、其余蓝），
   预设纸面按暖沙橙、薄荷与林深绿、樱粉粉、紫夜紫、墨蓝青，其余蓝。 */
const HUE_VARS = { blue: '--blue', pink: '--pink', green: '--green', violet: '--purple', mint: '--cyan' };
// 键名是色板里的键（mint 即青、violet 即紫），取值时直接查 colors
const ACCENT_BY_THEME = { dusk: 'violet', sand: 'orange' };
const ACCENT_VAR_BY_THEME = { dusk: '--purple', sand: '--orange' };
const ACCENT_BY_PAPER = {
  paper: 'blue', slate: 'blue', abyss: 'mint', sand: 'orange',
  mint: 'green', sakura: 'pink', forest: 'green', plum: 'violet',
};
const DEFAULT_THEMES = ['dark', 'light'];
const HEX = /^#[0-9a-f]{6}$/i;
function cssColor(name) {
  try {
    if (typeof getComputedStyle !== 'function') return '';
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return HEX.test(v) ? v : '';
  } catch (_) { return ''; }
}

export function setPalette(B, background, scheme) {
  const bgChannels = rgb(background), bg = luminance(bgChannels);
  // 在纯黑与纯白的对比度相等处切换墨色，对自定义的中灰纸面也适用。
  const light = bg >= Math.sqrt(1.05 * .05) - .05;
  const palette = { ...(light ? LIGHT : DARK) };
  let accentKey = 'blue';
  let accentVar = '';
  const byPaper = scheme && scheme !== 'theme' && scheme !== 'custom';
  if (byPaper) {
    const p = paperOf(scheme);
    if (p && p.blue) {
      Object.assign(palette, {
        ink: p.ink, guide: p.graphite, red: p.alert,
        blue: p.blue, mint: p.cyan, pink: p.pink, green: p.green, violet: p.purple,
        gold: p.orange, orange: p.sienna,
      });
    }
    accentKey = ACCENT_BY_PAPER[scheme] || 'blue';
  } else if (!scheme || scheme === 'theme') {
    const theme = currentTheme();
    if (!DEFAULT_THEMES.includes(theme)) {
      // 非默认主题：直接读页面主题的语义色；读不到（无头环境）就留在基础色板
      for (const [key, name] of Object.entries(HUE_VARS)) {
        const c = cssColor(name);
        if (c) palette[key] = c;
      }
    }
    accentKey = ACCENT_BY_THEME[theme] || 'blue';
    accentVar = cssColor(ACCENT_VAR_BY_THEME[theme] || '--blue');
  }
  const contrast = color => {
    const fg = luminance(rgb(color));
    return (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
  };
  const figure = B.root.closest('.conic-figure');
  const colors = { paper: background };
  for (const [key, color] of Object.entries(palette)) {
    const min = ['ink', 'guide', 'red'].includes(key) ? 4.5 : 3.6;
    let candidate = rgb(color), limit = light ? 0 : 255;
    for (let step = 1; contrast('#' + candidate.map(v => v.toString(16).padStart(2, '0')).join('')) < min && step <= 16; step++) {
      candidate = rgb(color).map(v => Math.round(v + (limit - v) * step / 16));
    }
    colors[key] = '#' + candidate.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  colors.accent = accentVar || colors[accentKey] || colors.blue;
  const blend = (color, weight) => '#' + rgb(color).map((v, i) =>
    Math.round(v * weight + bgChannels[i] * (1 - weight)).toString(16).padStart(2, '0')).join('');
  const wash = (color, alpha) => 'rgba(' + rgb(color).join(',') + ',' + alpha + ')';
  Object.assign(colors, {
    axis: blend(colors.guide, .34), rule: blend(colors.guide, .63),
    soft: wash(colors.blue, .055), tealWash: wash(colors.mint, .06),
    goldWash: wash(colors.gold, .09), ghost: wash(colors.guide, .39),
    pulse: wash(colors.gold, .23), pulseCore: wash(colors.gold, .58),
  });
  B.diagramColors = colors; // SVG 图元与 CSS 控件共用本次纸面已经校正过的实色。
  for (const [key, value] of Object.entries(colors)) {
    const name = '--pj-' + key;
    B.root.style.setProperty(name, value);
    // 导出会克隆 SVG，画面本身也要携带当前纸面的色值。
    B.svg.style.setProperty(name, value);
    if (key === 'ink') B.svg.style.setProperty('--bd-svg-ink', value);
    figure?.style.setProperty(name, value);
  }
}

class DiagramBoard extends Board {
  handle(options) {
    const handle = super.handle({ ...options, r: options.thin ? 3.5 : 4.6 });
    handle.setAttribute('stroke', 'none');
    return handle;
  }
}

export function createDiagram(root, width, height, label) {
  root.classList.add('conic-board');
  const B = new DiagramBoard(root, width, height, { onAppearanceChange: setPalette });
  B.svg.setAttribute('role', 'group');
  B.svg.setAttribute('aria-label', label);
  return B;
}

const tone = name => 'var(--pj-' + name + ')';
const GLOW_CACHE = new Map();
/* 把 plotInk 的 'var(--pj-x)' 读成当前纸面下的实色：柔光要绝对稳定，不能再走一次
   fill 属性里的 var（部分环境解析不了，整圈会黑掉）。按「色号 + 底色 + 主题」缓存。 */
function concreteInk(B, color) {
  const s = String(color).trim();
  const m = /^var\(\s*(--[\w-]+)\s*\)$/.exec(s);
  if (!m) return s;
  const key = s + '|' + (B._bgCol || '') + '|' + currentTheme();
  const hit = GLOW_CACHE.get(key);
  if (hit) return hit;
  let v = '';
  try { v = getComputedStyle(B.root).getPropertyValue(m[1]).trim(); } catch (_) { /* 无头环境 */ }
  const out = /^#[0-9a-f]{6}$/i.test(v) || /^rgba?\(/i.test(v) ? v : '#d5a77f';
  GLOW_CACHE.set(key, out);
  return out;
}

/** 选中点的柔光：多层半透明同心圆，由外向内叠出渐隐。
 *  不用 <radialGradient> —— 渐变或 URL 一旦解析失败会退回黑色，看着像「黑光」；
 *  这里先把语义色读成实色，再画六层圆，颜色稳定、换主题 / 纸面也跟着变。
 *  color 传语义色（plotInk.*）；core 非 0 时顺带画实心芯。 */
export function glowDot(B, p, color, r = 18, core = 0) {
  const c = concreteInk(B, color);
  for (const [f, op] of [[1, .07], [.9, .1], [.8, .13], [.7, .17], [.6, .22], [.5, .28]]) {
    B.dot(p, r * f, { fill: c, 'fill-opacity': op, 'pointer-events': 'none' });
  }
  if (core) B.dot(p, core, { fill: c });
}
export const plotInk = {
  ink: tone('ink'), blue: tone('blue'), teal: tone('mint'), amber: tone('gold'), gold: tone('gold'),
  copper: tone('orange'), green: tone('green'), rose: tone('pink'), violet: tone('violet'),
  guide: tone('guide'), axis: tone('axis'), rule: tone('rule'), paper: tone('paper'), accent: tone('accent'),
  soft: tone('soft'), tealWash: tone('tealWash'), goldWash: tone('goldWash'),
  ghost: tone('ghost'), pulse: tone('pulse'), pulseCore: tone('pulseCore'),
};

class ConicLabBoard extends DiagramBoard {
  hintM(text) {
    super.hintM(text);
    this._hintMDiv.style.color = plotInk.guide;
  }

  dot(point, radius, attrs = {}) {
    const outline = attrs.stroke === plotInk.ink ? { stroke: plotInk.paper, 'stroke-width': 1.25 } : {};
    return super.dot(point, Math.min(radius, 4.8), { ...attrs, ...outline });
  }
}

export function createConicLab(root, width, height) {
  root.classList.add('conic-board', 'conic-instrument');
  const board = new ConicLabBoard(root, width, height, { onAppearanceChange: setPalette, preciseSliders: true });
  const title = root.closest('.conic-figure')?.querySelector('.conic-heading strong')?.textContent;
  board.svg.setAttribute('role', 'group');
  if (title) board.svg.setAttribute('aria-label', title);
  return board;
}

// 在局部小窗画图时，长直线和轨迹都裁剪在各自的数据区域。
export function plotWindow(board, { x, y, width, height }, label) {
  const id = board.uid + '-' + label;
  const clip = mk('clipPath', { id }, board.svg.querySelector('defs'));
  mk('rect', { x, y, width, height }, clip);
  return draw => {
    mk('rect', { x, y, width, height, rx: 5, fill: plotInk.soft, stroke: plotInk.axis }, board.dyn);
    const group = board.dyn;
    board.dyn = mk('g', { 'clip-path': 'url(#' + id + ')' }, group);
    try { draw(); } finally { board.dyn = group; }
  };
}
