import { hEl, texMix } from '../../../lib/board.js';

export function presetRow(controls, label, presets, select) {
  const row = hEl('div', { class: 'fn-preset-row', role: 'group', 'aria-label': label }, controls);
  row.style.setProperty('--preset-count', presets.length);
  let selected = 0;
  function setSelected(index) {
    if (index === selected) return;
    selected = index;
    btns.forEach((button, i) => {
      button.classList.toggle('on', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
  }
  const btns = presets.map((p, i) => {
    const btn = hEl('button', { type: 'button', class: 'btn', 'aria-pressed': String(i === 0) }, row);
    const number = '①②③④⑤⑥⑦'[i] ?? String(i + 1);
    const name = hEl('span', { class: 'preset-name' }, btn);
    if (p.name.includes('$')) name.innerHTML = number + ' ' + texMix(p.name);
    else name.textContent = number + ' ' + p.name;
    const short = hEl('span', { class: 'preset-short' }, btn);
    hEl('span', { class: 'preset-index' }, short).textContent = number + ' ';
    const compact = p.short ?? p.name;
    if (compact.includes('$')) hEl('span', {}, short).innerHTML = texMix(compact);
    else short.append(compact);
    if (p.formula) hEl('span', { class: 'preset-formula' }, btn).innerHTML = texMix(p.formula);
    btn.classList.toggle('on', i === 0);
    btn.addEventListener('click', () => {
      setSelected(i);
      select(i);
    });
    return btn;
  });
  return setSelected;
}

// 数值预设与手动滑块、逐帧动画共用同一份状态。
export function parameterRow(board, label, presets, state, sliders) {
  const select = presetRow(board.ctrl, label, presets, i => {
    for (const [key, value] of Object.entries(presets[i].values)) {
      state[key] = value;
      sliders[key].sync(value);
    }
    board.render();
  });
  return () => select(presets.findIndex(p =>
    Object.entries(p.values).every(([key, value]) => state[key] === value)));
}
