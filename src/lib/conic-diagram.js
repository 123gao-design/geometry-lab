import { Board, mk } from './board.js';

const LIGHT = { ink: '#202d3a', blue: '#2b598c', gold: '#8a5529', mint: '#316763', pink: '#794e69', guide: '#56677a', orange: '#a05434', green: '#356c4c', violet: '#66528b' };
const DARK = { ink: '#e8edf5', blue: '#95b9e5', gold: '#d5a77f', mint: '#8ebfb7', pink: '#cba5be', guide: '#a0aec2', orange: '#e3a183', green: '#9bc5a5', violet: '#b8a9db' };
const rgb = hex => hex.slice(1).match(/../g).map(channel => parseInt(channel, 16));
function luminance(channels) {
  const [r, g, b] = channels.map(v => {
    const s = v / 255;
    return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
  });
  return .2126 * r + .7152 * g + .0722 * b;
}

function setPalette(B, background) {
  const bgChannels = rgb(background), bg = luminance(bgChannels);
  // 在纯黑与纯白的对比度相等处切换墨色，对自定义的中灰纸面也适用。
  const light = bg >= Math.sqrt(1.05 * .05) - .05;
  const palette = light ? LIGHT : DARK;
  const contrast = color => {
    const fg = luminance(color);
    return (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
  };
  const figure = B.root.closest('.conic-figure');
  const colors = { paper: background };
  for (const [key, color] of Object.entries(palette)) {
    const min = key === 'ink' || key === 'guide' ? 4.5 : 3.6;
    const channels = rgb(color), limit = light ? 0 : 255;
    let candidate = channels;
    for (let step = 1; contrast(candidate) < min && step <= 16; step++) {
      candidate = channels.map(v => Math.round(v + (limit - v) * step / 16));
    }
    colors[key] = '#' + candidate.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const blend = (color, weight) => '#' + rgb(color).map((v, i) =>
    Math.round(v * weight + bgChannels[i] * (1 - weight)).toString(16).padStart(2, '0')).join('');
  const wash = (color, alpha) => 'rgba(' + rgb(color).join(',') + ',' + alpha + ')';
  Object.assign(colors, {
    axis: blend(colors.guide, .34), rule: blend(colors.guide, .63),
    soft: wash(colors.blue, .055), tealWash: wash(colors.mint, .06),
    goldWash: wash(colors.gold, .09), ghost: wash(colors.guide, .39),
    pulse: wash(colors.gold, .23), pulseCore: wash(colors.gold, .58),
  });
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
export const plotInk = {
  ink: tone('ink'), blue: tone('blue'), teal: tone('mint'), amber: tone('gold'),
  copper: tone('orange'), green: tone('green'), rose: tone('pink'), violet: tone('violet'),
  guide: tone('guide'), axis: tone('axis'), rule: tone('rule'), paper: tone('paper'),
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
