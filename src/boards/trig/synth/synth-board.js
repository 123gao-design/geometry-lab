import { LegendProofBoard } from '../proof-board.js';
import { angleTex } from '../trig-board.js';
import { hEl, texMix, V, TAU } from '../../../lib/board.js';
import '../unit/angle-readings.css';
import '../solve/theorem-frames.css';
import '../../light-readings.css';
import './synth.css';
import frameCSS from '../solve/theorem-frames.css?inline';
import lightCSS from '../../light-readings.css?inline';
import infoCSS from '../../info-readings.css?inline';
import panelCSS from './synth.css?inline';

export class SynthBoard extends LegendProofBoard {
  constructor(root, label) {
    super(root, 640, 352, 44);
    root.classList.add('trig-side-board', 'trig-theorem-board', 'trig-compact-choices', 'synth-board');
    this.proof = hEl('aside', { class: 'trig-theorem-panel synth-panel', 'aria-label': label });
    root.insertBefore(this.proof, this.chipRow);
    this.exportCheckHeight = 152;
    this.exportSize = { plotWidth: this.w, width: 882, height: this.h + this.exportCheckHeight };
    this.proofCSS = frameCSS + lightCSS + infoCSS + panelCSS;
    this.groupReadings('公式与数值');
  }

  reading(heading, lines, tone = 'blue') {
    const card = hEl('section', { 'data-reading-style': 'light', 'data-tone': tone }, this.proof);
    hEl('h4', {}, card).innerHTML = texMix(heading);
    for (const line of lines) hEl('p', {}, card).innerHTML = texMix(line);
    return card;
  }

  axes(xMax, yMin, yMax, yStep, tickPosition = 'bottom') {
    const tide = xMax !== TAU;
    const m = { ...this.mapFit(0, xMax, yMin, yMax, this.plotRect, 42), X0: 0, X1: xMax, Y0: yMin, Y1: yMax };
    const xStep = tide ? 4 : Math.PI / 2;
    this.grid({ ...m, labs: false, sx: xStep, sy: yStep });
    const tick = (x, y, value, anchor = 'mid') => this.tex(V(x, y), '$' + value + '$', { w: 74, size: 14, anchor, color: this.diagramColors.guide });
    const nearAxis = tickPosition !== 'bottom';
    const tickY = nearAxis ? m.py(0) + (tickPosition === 'above' ? -13 : 13) : m.py(yMin) + 16;
    for (let x = 0; x <= xMax; x += xStep) {
      if (nearAxis && x === 0) tick(m.px(0) - 6, tickY, 0, 'end');
      else tick(m.px(x), tickY, tide ? x : angleTex(x));
    }
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      if (y !== 0) tick(m.px(0) - (nearAxis ? 6 : 18), m.py(y), y, nearAxis ? 'end' : 'mid');
    }
    if (nearAxis) tick(m.px(xMax) + 12, m.py(0), 'x', 'start');
    else tick(m.px(xMax) + (tide ? 19 : 12), m.py(0) - 12, tide ? 't/\\mathrm h' : 'x');
    tick(m.px(0) + 8, m.py(yMax) - 14, tide ? 'd/\\mathrm m' : 'y');
    return m;
  }
}
