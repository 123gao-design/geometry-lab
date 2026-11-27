import { hEl, texMix } from '../../../lib/board.js';

export function functionPicker(root, labels, select) {
  root.classList.add('fn-picker-board', 'fn-simple-picker');
  const picker = hEl('div', { class: 'pair-picker', role: 'group', 'aria-label': '选择函数' }, root);
  const list = hEl('div', { class: 'pair-list' }, picker);
  const buttons = labels.map((label, i) => {
    const button = hEl('button', { type: 'button', class: 'pair-choice', 'aria-pressed': String(i === 0) }, list);
    hEl('span', { class: 'pair-number' }, button).textContent = String.fromCodePoint(0x2460 + i);
    hEl('span', {}, button).innerHTML = texMix(label);
    button.addEventListener('click', () => {
      buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
      select(i);
    });
    return button;
  });
}
