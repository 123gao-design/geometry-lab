import { StudyBoard } from '../study-board.js';
import { fmt, hEl, mk, texMix } from '../../lib/board.js';
import '../info-readings.css';

// 特殊角用 π 的有理倍数，连续拖动时用弧度近似值。
export function angleTex(a) {
  const k = Math.round(a * 180 / Math.PI);
  if (Math.abs(a - k * Math.PI / 180) > 1e-7) return fmt(a, 3);
  if (!k) return '0';
  let d = 180;
  while (Math.abs(k) % d || 180 % d) d--;
  const num = Math.abs(k) / d, den = 180 / d;
  return (k < 0 ? '-' : '') + (num === 1 ? '' : num) + '\\pi' + (den === 1 ? '' : '/' + den);
}

export function unitCoordinates(a) {
  const quarter = Math.round(a / (Math.PI / 2));
  // 用轴线角本身判零，靠近轴线时仍然显示有限的倒数。
  const onAxis = Math.abs(a - quarter * Math.PI / 2) <= Number.EPSILON * Math.max(1, Math.abs(a));
  const x = onAxis && quarter % 2 !== 0 ? 0 : Math.cos(a);
  const y = onAxis && quarter % 2 === 0 ? 0 : Math.sin(a);
  return { x, y, onAxis };
}

export function piTick(v) {
  const k = Math.round(v / (Math.PI / 2));
  if (k === 0) return '0';
  const n = Math.abs(k), s = k % 2 ? (n === 1 ? 'π/2' : n + 'π/2') : (n === 2 ? 'π' : (n / 2) + 'π');
  return (k < 0 ? '-' : '') + s;
}

export class TrigBoard extends StudyBoard {
  constructor(root, width, height) {
    super(root, width, height);
    root.classList.add('trig-board');
    this.legendFont = getComputedStyle(root).getPropertyValue('--font-song').trim();
  }

  angleRow(degrees, current, apply, showDegrees = false) {
    const radians = degrees.map(d => d * Math.PI / 180);
    const items = radians.map((a, i) => ({ name: showDegrees ? `$${degrees[i]}^\\circ$` : `$${angleTex(a)}$` }));
    this.choiceRow('选择角度', items, () => radians.findIndex(a => Math.abs(a - current()) < 1e-8),
      i => apply(radians[i], i));
  }
}

// 图例独占圆角框底部的空间，坐标映射仍以原绘图区为准。
export class TrigLegendBoard extends TrigBoard {
  constructor(root, width, plotHeight, legendHeight = 52) {
    super(root, width, plotHeight + legendHeight);
    this.plotRect = [0, 0, width, plotHeight];
    this.chipRow.dataset.readingStyle = 'info';
    const legend = mk('foreignObject', {
      x: 20, y: plotHeight, width: width - 40, height: legendHeight - 8,
      'pointer-events': 'none', class: 'trig-legend',
    }, this.svg);
    this.legendRow = hEl('div', {
      role: 'group', 'aria-label': '图例',
      style: 'display:flex;align-content:flex-start;align-items:center;justify-content:center;flex-wrap:wrap;gap:2px 12px;line-height:1.3',
    }, legend);
    this.legendRow.style.fontFamily = this.legendFont;
    this._notesRow.hidden = true;
  }

  readout(label, tone) {
    if (!this.readingGroup) this.groupReadings('公式与读数');
    return super.readout(label, tone);
  }

  note(text, color, lineStyle = 'solid') {
    this._notes.push({ text, color: this.drawingColors[color] || color, lineStyle });
  }

  renderNotes() {
    this.legendRow.style.fontSize = Math.min(21, Math.max(12, .75 * this.labelFontSize())) + 'px';
    const html = this._notes.map(({ text, color, lineStyle }) =>
      `<span style="white-space:nowrap;color:${color}"><i aria-hidden="true" style="display:inline-block;width:.85em;margin-right:.35em;vertical-align:.25em;border-top:2px ${lineStyle} currentColor"></i>${texMix(text)}</span>`
    ).join('');
    if (html !== this._notesHtml) {
      this.legendRow.innerHTML = html;
      this._notesHtml = html;
    }
  }
}
