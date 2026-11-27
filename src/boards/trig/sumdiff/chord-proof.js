import { fmt, hEl, texMix } from '../../../lib/board.js';
import { angleTex, unitCoordinates } from '../trig-board.js';
import './chord-proof.css';
import proofCSS from './chord-proof.css?inline';

const STEPS = [
  {
    title: '两点距离公式',
    detail: '把弦的长度写成横、纵坐标之差。',
    formulas: [
      '$P(\\cos\\alpha,\\sin\\alpha)$，$Q(\\cos\\beta,\\sin\\beta)$',
      '$d^2=(\\cos\\alpha-\\cos\\beta)^2$',
      '$\\phantom{d^2={}}+(\\sin\\alpha-\\sin\\beta)^2$',
      '$\\phantom{d^2}{}=2-2(\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta)$',
    ],
  },
  {
    title: '余弦定理',
    detail: '两条半径都是单位长，$\\theta$ 是它们的夹角。',
    formulas: [
      '$\\cos\\theta=\\cos(\\alpha-\\beta)$',
      '$d^2=1^2+1^2-2\\cos(\\alpha-\\beta)$',
      '$\\phantom{d^2}{}=2-2\\cos(\\alpha-\\beta)$',
    ],
  },
  {
    title: '比较同一根弦',
    detail: '两种表达式给出同一根弦的长度。等式两边同减 $2$，再同除 $-2$。',
    formulas: [
      '$2-2(\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta)$',
      '$=2-2\\cos(\\alpha-\\beta)$',
    ],
  },
];

function line(parent, className, source, tag = 'div') {
  const element = hEl(tag, { class: className }, parent);
  element.innerHTML = texMix(source);
  return element;
}

function write(element, source) {
  if (element.dataset.source === source) return;
  element.dataset.source = source;
  element.innerHTML = texMix(source);
}

export class ChordProof {
  constructor(board) {
    this.step = 0;
    this.el = hEl('section', { class: 'chord-proof', 'aria-label': '弦长推导' });
    board.proof = this.el;
    board.proofCSS = proofCSS;
    board.root.insertBefore(this.el, board.chipRow);
    board.chipRow.hidden = true;

    const note = hEl('div', { class: 'chord-proof-note' }, this.el);
    this.panels = STEPS.map(({ title, detail, formulas }) => {
      const panel = hEl('div', { class: 'chord-proof-page' }, note);
      line(panel, 'chord-proof-title', title, 'strong');
      line(panel, 'chord-proof-detail', detail, 'p');
      for (const formula of formulas) line(panel, 'chord-proof-equation', formula);
      return panel;
    });
    this.measurements = this.panels.map(panel => line(panel, 'chord-proof-measurement', ''));
    const result = hEl('div', { class: 'chord-proof-result' }, this.el);
    line(result, '', '$\\cos(\\alpha-\\beta)=$');
    line(result, '', '$\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$');

    const row = hEl('div', { class: 'chord-proof-steps', role: 'group', 'aria-label': '推导步骤' }, this.el);
    this.buttons = STEPS.map(({ title }, i) => {
      const button = hEl('button', { type: 'button' }, row);
      button.textContent = title;
      button.addEventListener('click', () => { this.select(i); board.render(); });
      return button;
    });
    this.tan = line(this.el, 'chord-proof-tan', '');
    this.select(0);
  }

  select(index) {
    this.step = index;
    this.panels.forEach((panel, i) => panel.setAttribute('aria-hidden', String(index !== i)));
    this.buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
  }

  update(a, b, theta) {
    const P = unitCoordinates(a), Q = unitCoordinates(b);
    const dot = P.x * Q.x + P.y * Q.y;
    const cos = Math.cos(a - b);
    const fromCoordinates = Math.hypot(P.x - Q.x, P.y - Q.y);
    const fromCosineLaw = 2 * Math.abs(Math.sin(theta / 2));
    write(this.measurements[0], '$d\\approx ' + fmt(fromCoordinates, 3) + '$');
    write(this.measurements[1], '$\\theta=' + angleTex(theta) + '\\;\\mathrm{rad}$　$d\\approx ' + fmt(fromCosineLaw, 3) + '$');
    write(this.measurements[2], '等式左右两边约为 $' + fmt(cos, 3) + '$ 和 $' + fmt(dot, 3) + '$。');

    const sum = unitCoordinates(a + b);
    this.tan.classList.toggle('warn', sum.x === 0 || P.x === 0 || Q.x === 0);
    if (sum.x === 0) write(this.tan, '$\\tan(\\alpha+\\beta)$ 无定义。');
    else if (P.x === 0 || Q.x === 0) write(this.tan, '分式展开要求 $\\tan\\alpha$、$\\tan\\beta$ 有定义。');
    else write(this.tan, '$\\tan(\\alpha+\\beta)\\approx ' + fmt(sum.y / sum.x, 3) + '$');
  }
}
