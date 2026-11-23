import { Board, texMix } from '../../lib/board.js';

const SHAPES = 'circle, ellipse, line, path, polygon, polyline, rect';
const OFFSETS = [[0, 0], [0, -17], [0, 17], [-19, 0], [19, 0], [0, -30], [0, 30]];
const HORIZONTAL_TICKS = [[0, 0], [0, -17], [0, 17]];
const VERTICAL_TICKS = [[0, 0], [-18, 0], [18, 0]];
const TONES = {
  '#5cadff': 'blue', '#4ade80': 'green', '#ff9e4a': 'orange',
  '#ffd166': 'yellow', '#ff7b8a': 'red', '#c084fc': 'purple', '#67e8f9': 'cyan',
};

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

export class FunctionBoard extends Board {
  constructor(root, w, h) {
    super(root, w, h);
    root.classList.add('fn-board');
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
        if (next > 0) this.render();
      });
      this._plotResize.observe(this.svg);
    }
    document.fonts?.ready.then(() => {
      if (this.svg.isConnected) this.render();
    });
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
    return node;
  }

  _applyLblOffsets() {
    // 刻度和点名由布局计算，旧版长标注的序号偏移不能套用到它们。
  }

  render() {
    this._notes.length = 0;
    this._labels.length = 0;
    super.render();
    this._layoutPlotLabels();
    const html = this._notes.map(({ text, tone }) =>
      `<span class="fn-board-note" data-tone="${tone}">${texMix(text)}</span>`).join('');
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
        if (position.left < 3 || position.right > this.w - 3 ||
            position.top < 3 || position.bottom > this.h - 3) return false;
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
