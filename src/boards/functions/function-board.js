import { Board, hEl, mk, texMix } from '../../lib/board.js';

import { glowDot, setPalette } from '../../lib/conic-diagram.js';
import { paperHalo } from '../../lib/diagram-paper.js';

const SHAPES = 'circle, ellipse, line, path, polygon, polyline, rect';
const OFFSETS = [[0, 0], [0, -17], [0, 17], [-19, 0], [19, 0], [0, -30], [0, 30]];
const HORIZONTAL_TICKS = [[0, 0], [0, -17], [0, 17]];
const VERTICAL_TICKS = [[0, 0], [-18, 0], [18, 0]];
// 章节用同一组色号表达曲线、符号和参考线，屏幕与导出都使用当前纸面的实色。
const TONES = {
  '#5cadff': 'blue', '#4ade80': 'green', '#ff9e4a': 'orange', '#ffd166': 'gold',
  '#ff7b8a': 'red', '#c084fc': 'violet', '#67e8f9': 'mint', '#0a0d14': 'paper',
  '#93a1b5': 'guide', '#5c6a80': 'guide', '#8fa3bd': 'guide', '#3f5f8f': 'rule',
  '#3a4a63': 'axis', '#2e3d57': 'axis', '#2b3b53': 'axis', 'rgba(92,173,255,.05)': 'soft',
};
function functionPalette(board, background, scheme) {
  setPalette(board, background, scheme);
  board.drawingColors = Object.fromEntries(Object.entries(TONES).map(([code, key]) => [code, board.diagramColors[key]]));
}

const bounds = (box, pad = 0) => ({
  left: box.x - pad, right: box.x + box.width + pad,
  top: box.y - pad, bottom: box.y + box.height + pad,
});
const overlaps = (a, b) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

function shapeSegments(node, pad) {
  const length = node.getTotalLength();
  const steps = Math.max(1, Math.min(600, Math.ceil(length / 6)));
  const segments = [];
  let from = node.getPointAtLength(0);
  for (let i = 1; i <= steps; i++) {
    const to = node.getPointAtLength(length * i / steps);
    segments.push(bounds({
      x: Math.min(from.x, to.x), y: Math.min(from.y, to.y),
      width: Math.abs(to.x - from.x), height: Math.abs(to.y - from.y),
    }, pad + 1));
    from = to;
  }
  return segments;
}

function obstacle(node) {
  const pad = Math.max(1, Number(node.getAttribute('stroke-width')) / 2);
  const area = bounds(node.getBBox(), pad + (node.classList.contains('hnd') ? 4 : 1));
  const fill = node.getAttribute('fill');
  const solid = fill && fill !== 'none' && fill !== 'transparent';
  let segments;
  return label => {
    if (!overlaps(area, label)) return false;
    if (solid || typeof node.getTotalLength !== 'function') return true;
    segments ??= shapeSegments(node, pad);
    return segments.some(segment => overlaps(segment, label));
  };
}

export class PlotBoard extends Board {
  constructor(root, w, h, layout = 'stack') {
    super(root, w, h, { preciseSliders: true, onAppearanceChange: functionPalette });
    root.classList.add('fn-board');
    root.dataset.layout = layout;
    paperHalo(this);
    mk('rect', { x: 7, y: 7, width: w - 14, height: h - 14, rx: 16, fill: 'none',
      stroke: 'var(--pj-accent)', 'stroke-width': 1.2, 'stroke-opacity': .62,
      'stroke-dasharray': '7 6', 'pointer-events': 'none' }, this.svg);
    this._notes = [];
    this._labels = [];
    this._notesRow = document.createElement('div');
    this._notesRow.className = 'fn-board-notes';
    root.insertBefore(this._notesRow, this.ctrl);
    this._hint = document.createElement('p');
    this._hint.className = 'fn-board-guide';
    root.appendChild(this._hint);
    if (typeof ResizeObserver !== 'undefined') {
      let width;
      this._plotResize = new ResizeObserver(([entry]) => {
        const next = entry.contentRect.width;
        if (next === width) return;
        width = next;
        if (next > 0) {
          this._minLabelSize = Math.min(30, Math.max(12, 11 * w / next));
          this.svg.style.setProperty('--fn-label-size', this._minLabelSize + 'px');
          this.render();
        }
      });
      this._plotResize.observe(this.svg);
    }
    document.fonts?.ready.then(() => {
      if (this.svg.isConnected) this.render();
    });
  }

  groupReadings(label) {
    this.chipRow.classList.add('fn-chapter-readings');
    this.readingGroup = hEl('div', {
      class: 'fn-reading-group', role: 'group', 'aria-label': label,
    }, this.chipRow);
  }

  readout(label, tone) {
    const update = super.readout(label, tone);
    this.readingGroup?.appendChild(update.el);
    return update;
  }

  labelFontSize() { return Math.max(super.labelFontSize(), this._minLabelSize || 0); }

  handle(options) {
    const point = super.handle({ ...options, r: 4 });
    point.setAttribute('stroke', 'transparent');
    point.setAttribute('stroke-width', '18');
    return point;
  }

  // 按讲解优先级绘点。把手自带光晕，落在同一位置的标记共用一个光芯。
  glowPoints(points) {
    const drawn = this.handles.filter(({ c }) => c.style.display !== 'none').map(({ st }) => st.get());
    for (const [point, color] of points) {
      if (point.x < 0 || point.y < 0 || point.x > this.w || point.y > this.h) continue;
      if (drawn.some(p => Math.hypot(p.x - point.x, p.y - point.y) < 1)) continue;
      glowDot(this, point, color, 8, 3.5);
      drawn.push(point);
    }
  }

  destroy() {
    this._plotResize?.disconnect();
    super.destroy();
  }

  note(text, color) {
    if (text) this._notes.push({ text, tone: TONES[color] ?? 'neutral' });
  }

  hint(text) {
    this._hintT = text;
    this._hint.innerHTML = texMix(text);
    this._hint.style.display = text && this._foot ? '' : 'none';
  }

  hintM(text) {
    this.hint(text);
  }

  grid(mapping) {
    const before = this.dyn.children.length;
    this._drawingGrid = true;
    super.grid(mapping);
    this._drawingGrid = false;
    for (const element of Array.from(this.dyn.children).slice(before)) {
      if (element.getAttribute('stroke-opacity') === '0.5') element.setAttribute('data-fn-grid', '');
    }
  }

  text(point, value, attributes = {}) {
    const node = super.text(point, value, attributes);
    const anchor = attributes['text-anchor'];
    const ticks = anchor === 'start' || anchor === 'end' ? VERTICAL_TICKS : HORIZONTAL_TICKS;
    this._labels.push({ node, offsets: this._drawingGrid ? ticks : OFFSETS });
    if (attributes.fill) node.style.fill = node.getAttribute('fill');
    return node;
  }

  _applyLblOffsets() {
    // 刻度和点名由布局计算，旧版长标注的序号偏移不能套用到它们。
  }

  render() {
    this._notes.length = 0;
    this._labels.length = 0;
    super.render();
    this.syncPaperHalo();
    this._layoutPlotLabels();
    for (const { c, st } of this.handles) {
      const color = this.drawingColors[st.color] || st.color || this.diagramColors.gold;
      c.setAttribute('fill', color);
      if (c.style.display !== 'none') glowDot(this, st.get(), color, 9);
    }
    this.renderNotes();
  }

  renderNotes() {
    const html = this._notes.map(({ text, tone }) =>
      `<span class="fn-board-note" data-tone="${tone}" style="--tone:var(--pj-${tone},var(--pj-guide))">${texMix(text)}</span>`).join('');
    if (html !== this._notesHtml) {
      this._notesRow.innerHTML = html;
      this._notesRow.hidden = !html;
      this._notesHtml = html;
    }
  }

  _layoutPlotLabels() {
    const handles = this.handles.filter(handle => handle.lbl);
    const labels = [...handles.map(({ lbl: node }) => ({ node, offsets: OFFSETS })), ...this._labels];
    if (!labels.length || typeof labels[0].node.getBBox !== 'function') return;
    for (const { node } of labels) node.removeAttribute('visibility');
    const shapes = [...this.dyn.querySelectorAll(SHAPES), ...this.handles.map(handle => handle.c)];
    const obstacles = shapes.filter(node => !node.hasAttribute('data-fn-grid')).map(obstacle);
    const placements = labels.map(({ node, offsets }) => ({
      node, offsets, box: node.getBBox(),
      x: Number(node.getAttribute('x')), y: Number(node.getAttribute('y')),
    }));
    const occupied = [];
    for (const { node, box, offsets, x, y } of placements) {
      const fit = offsets.find(([dx, dy]) => {
        const position = bounds({ x: box.x + dx, y: box.y + dy, width: box.width, height: box.height }, 2);
        if (position.left < 9 || position.right > this.w - 9 ||
            position.top < 9 || position.bottom > this.h - 9) return false;
        if (occupied.some(other => overlaps(other, position)) || obstacles.some(blocked => blocked(position))) return false;
        occupied.push(position);
        return true;
      });
      if (!fit) {
        node.setAttribute('visibility', 'hidden');
        continue;
      }
      node.setAttribute('x', x + fit[0]);
      node.setAttribute('y', y + fit[1]);
    }
  }
}

// 函数章节把读数收在一组，判读仍用原来的徽章。两组一起随原读数栏定位。
export class FunctionBoard extends PlotBoard {
  constructor(root, w, h, layout) {
    super(root, w, h, layout);
    this.groupReadings('函数读数');
  }
}
