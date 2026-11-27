import { hEl, mk } from './board.js';

// 整板与 PNG 复用一份底纹。外层画板可随控件换行改变比例，星点随之铺开。
export function paperHalo(board) {
  const width = board.w;
  const id = board.uid + '-paper-halo';
  const defs = board.svg.querySelector('defs');
  const gradient = mk('radialGradient', { id, cx: '.42', cy: '.48', r: '.77' }, defs);
  const stops = [[0, 1], [.16, .94], [.28, .77], [.35, .79], [.49, .54],
    [.56, .56], [.72, .27], [.79, .28], [.94, .06], [1, 0]]
    .map(([offset, opacity]) => mk('stop', { offset, 'stop-opacity': opacity }, gradient));

  const pattern = mk('symbol', { id: id + '-sheet', viewBox: `0 0 ${width} ${board.h}`,
    preserveAspectRatio: 'none' }, defs);
  const field = mk('rect', { width, height: board.h, fill: `url(#${id})` }, pattern);
  const stars = mk('g', {}, pattern);
  for (const [x, y, r] of [[.06, .10, .64], [.16, .21, .8], [.33, .08, .55], [.60, .16, .7],
    [.82, .09, .85], [.94, .23, .55], [.09, .54, .65], [.96, .62, .8], [.14, .86, .7],
    [.36, .92, .6], [.71, .88, .85], [.88, .94, .55]]) {
    mk('circle', { cx: width * x, cy: board.h * y, r }, stars);
  }

  const backdrop = hEl('div', { class: 'diagram-backdrop', 'aria-hidden': 'true' }, board.root);
  const sheet = { href: '#' + id + '-sheet', width: '100%', height: '100%' };
  mk('use', sheet, mk('svg', {}, backdrop));
  // 页面只画整板背景；独立 SVG 没有页面样式，导出时这份引用铺满主图。
  const exportLayer = mk('use', { ...sheet, class: 'diagram-export-halo', 'pointer-events': 'none' });
  board.svg.insertBefore(exportLayer, board.dyn);
  let previous;
  board.syncPaperHalo = () => {
    const ink = board.diagramColors;
    if (ink === previous) return;
    previous = ink;
    const light = board._famLight ?? document.documentElement.classList.contains('light');
    for (const stop of stops) stop.setAttribute('stop-color', ink.accent);
    field.setAttribute('opacity', light ? .13 : .26);
    stars.setAttribute('fill', ink.ink);
    stars.setAttribute('opacity', light ? .24 : .40);
  };
  return exportLayer;
}
