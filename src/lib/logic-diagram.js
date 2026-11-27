import { mk, V } from './board.js';
import { createDiagram, glowDot } from './conic-diagram.js';

import { paperHalo } from './diagram-paper.js';

const width = 520;
const frameInset = 8;
const start = 64, step = 34;
export const axisX = x => start + (x + 6) * step;

export function logicDiagram(root, name, height, description) {
  root.classList.add('atlas-board', 'logic-board', name);
  const board = createDiagram(root, width, height, description);
  // 半屏、全屏时 SVG 可能上下或左右留白，按实际绘图比例对齐下方读数。
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      const scale = Math.min(box.width / width, box.height / height);
      if (scale > 0) board.chipRow.style.width = (width - 2 * frameInset) * scale + 'px';
    });
    observer.observe(board.svg);
    const destroy = board.destroy.bind(board);
    board.destroy = () => { observer.disconnect(); destroy(); };
  }
  const halo = paperHalo(board);
  board.setAppearanceBackground(['光晕', '细网格'], grid => {
    root.dataset.texture = grid ? 'grid' : 'halo';
    halo.setAttribute('display', grid ? 'none' : 'inline');
  });
  return board;
}

export function frame(board) {
  board.syncPaperHalo();
  mk('rect', { x: frameInset, y: frameInset, width: width - 2 * frameInset, height: board.h - 2 * frameInset, rx: 16, fill: 'none',
    stroke: board.diagramColors.accent, 'stroke-opacity': .65, 'stroke-width': 1.1, 'stroke-dasharray': '7 6' }, board.dyn);
}

export function label(board, x, y, text, size = 13, color = board.diagramColors.ink) {
  board.tex(V(x, y), text, { size, color, anchor: 'mid', w: Math.min(2 * Math.min(x, width - x), text.length * size + 24) });
}

export function wash(board) {
  const light = board._famLight ?? document.documentElement.classList.contains('light');
  return light ? .11 : .21;
}

// 只在精确分界点处分段；每个开区间内的谓词值恒定，端点另行绘制。
export function bands(board, y, boundaries, colorAt) {
  const ink = board.diagramColors;
  const cuts = [-6, ...boundaries, 6];
  board.seg(V(axisX(-6), y), V(axisX(6), y), { stroke: ink.axis, 'stroke-dasharray': '2 4' });
  for (let i = 1; i < cuts.length; i++) {
    const left = axisX(cuts[i - 1]), right = axisX(cuts[i]);
    const color = colorAt((cuts[i - 1] + cuts[i]) / 2);
    if (!color) continue;
    mk('rect', { x: left, y: y - 6, width: right - left, height: 12, fill: color, 'fill-opacity': wash(board) }, board.dyn);
    board.seg(V(left, y), V(right, y), { stroke: color, 'stroke-width': 2,
      'stroke-dasharray': color === ink.red ? '3 3' : 'none' });
  }
}

export function axisProbe(board, x, y, top) {
  const ink = board.diagramColors;
  board.seg(V(axisX(-6) - 8, y), V(axisX(6) + 13, y), { stroke: ink.rule, 'stroke-width': 1.1 });
  mk('path', { d: `M${axisX(6) + 9} ${y - 3}l5 3-5 3`, stroke: ink.rule, fill: 'none' }, board.dyn);
  for (let t = -6; t <= 6; t++) {
    board.seg(V(axisX(t), y), V(axisX(t), y + (t % 2 ? 3 : 6)), { stroke: ink.rule });
    if (t % 2 === 0) label(board, axisX(t), y + 18, String(t), 14, ink.guide);
  }
  board.seg(V(axisX(x), top), V(axisX(x), y - 5), { stroke: ink.gold, 'stroke-dasharray': '3 4', 'stroke-width': 1.2 });
  glowDot(board, V(axisX(x), y), ink.gold, 10, 3.5);
  label(board, axisX(x), y + 39, `$x=${x}$`, 14, ink.gold);
}

export function probeHandle(board, state, y) {
  const handle = board.handle({
    get: () => V(axisX(state.v), y), color: 'transparent',
    set: p => { state.v = Math.round(((p.x - start) / step - 6) * 20) / 20; },
    clamp: p => V(Math.max(axisX(-6), Math.min(axisX(6), p.x)), y),
  });
  // 扩大透明命中面，屏幕上仍只显示小实心芯。
  handle.setAttribute('r', '16');
  handle.setAttribute('aria-label', '拖动数轴探针 x');
}
