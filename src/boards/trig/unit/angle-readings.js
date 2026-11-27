import { fmt, hEl } from '../../../lib/board.js';
import { angleTex } from '../trig-board.js';
import './angle-readings.css';

export function angleReadings(board, title, description) {
  board.root.classList.add('trig-side-board');
  const panel = hEl('section', { class: 'unit-readings', 'aria-label': description });
  board.root.insertBefore(panel, board.chipRow);
  const values = hEl('div', { class: 'unit-function-values' }, panel);

  function field(label, tone) {
    const update = board.chipM(label);
    update.el.style.setProperty('--reading-color', `var(--pj-${tone})`);
    values.appendChild(update.el);
    return update;
  }

  function number(label, tone) {
    const update = field(label, tone);
    return value => {
      update.el.toggleAttribute('data-compact', Number.isFinite(value) && Math.abs(value) >= 100);
      if (!Number.isFinite(value)) { update('无定义', 'warn'); return; }
      update(`$${numberTex(value)}$`);
    };
  }

  function addAngle(label, tone) {
    const current = board.chipM(label);
    if (tone) current.el.style.setProperty('--reading-color', `var(--pj-${tone})`);
    panel.insertBefore(current.el, values);
    return a => current(`$${fmt(a * 180 / Math.PI, 1)}^\\circ$ $${angleTex(a)}\\,\\mathrm{rad}$`);
  }
  return { angle: addAngle(title), addAngle, field, number };
}

export function numberTex(value) {
  if (Math.abs(value) < 1e4) return fmt(value, 3);
  const [factor, power] = value.toExponential(2).split('e');
  return `${factor}\\times10^{${Number(power)}}`;
}
