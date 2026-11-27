import { hEl, mk, texMix, V, fmt } from '../../../lib/board.js';

// 弧位两端稍离弦端，保证画板上的三角形始终非退化。曲线与动点共用这个参数。
export const arcAngle = (t, alpha) => (2 * t - 1) * (Math.PI - alpha) * .96;

function tickStep(max) {
  const raw = max / 4, power = 10 ** Math.floor(Math.log10(raw));
  return power * [1, 2, 2.5, 5, 10].find(n => n * power >= raw);
}

export function areaChart(board) {
  const panel = board.proof;
  const heading = hEl('h4', {}, panel);
  const svg = mk('svg', { viewBox: '0 0 320 224', role: 'img', class: 'area-chart' }, panel);
  const key = hEl('div', { class: 'area-chart-key', 'aria-label': '曲线图例' }, panel);
  const values = hEl('dl', { class: 'area-chart-values' }, panel);
  const ratio = hEl('div', { class: 'area-ratio' }, panel);
  const ratioLabel = hEl('div', {}, ratio);
  const fill = hEl('i', {}, hEl('div', { class: 'area-ratio-track' }, ratio));

  return ({ title, xMax, yMax, xTicks, xLabel, yLabel, at, curves, peakLabel, fields, share, labs }) => {
    heading.textContent = title;
    svg.setAttribute('aria-label', title);
    svg.replaceChildren();
    const colors = board.diagramColors;
    const left = 30, right = 296, top = 29, bottom = 198;
    const px = x => left + (right - left) * x / xMax;
    const py = y => bottom - (bottom - top) * y / yMax;
    function label(x, y, tex, anchor = 'mid', tone = 'guide') {
      if (labs) board.tex(V(x, y), '$' + tex + '$', { root: svg, w: 72, size: 12, color: colors[tone], anchor });
    }
    function line(x1, y1, x2, y2, tone, dash) {
      mk('line', { x1, y1, x2, y2, stroke: colors[tone], 'stroke-width': 1, 'stroke-dasharray': dash || 'none' }, svg);
    }
    for (const [x, tex] of xTicks) {
      line(px(x), py(yMax), px(x), py(0), 'axis');
      label(px(x), bottom + 15, tex);
    }
    const step = tickStep(yMax);
    for (let y = step; y <= yMax + 1e-8; y += step) {
      line(px(0), py(y), px(xMax), py(y), 'axis');
      label(px(0) - 5, py(y), String(Number(y.toFixed(4))), 'end');
    }
    const xTip = right + 11, yTip = top - 12;
    line(left, bottom, xTip, bottom, 'guide');
    line(left, bottom, left, yTip, 'guide');
    mk('path', { d: 'M' + xTip + ' ' + bottom + 'l-7 -3v6z', fill: colors.guide }, svg);
    mk('path', { d: 'M' + left + ' ' + yTip + 'l-3 7h6z', fill: colors.guide }, svg);
    label(left - 5, bottom + 13, '0', 'end');
    label(xTip, bottom - 12, xLabel);
    if (yLabel) label(left + 12, yTip, yLabel);
    label(px(xMax / 2), top - 14, peakLabel, 'mid', 'gold');
    line(px(xMax / 2), py(yMax), px(xMax / 2), py(0), 'gold', '4 4');
    line(px(at), py(curves[0].fn(at)), px(at), py(0), 'mint', '3 4');
    const points = [];
    for (const { fn, tone, dashed } of curves) {
      const path = Array.from({ length: 101 }, (_, i) => {
        const x = xMax * i / 100;
        return px(x).toFixed(2) + ',' + py(fn(x)).toFixed(2);
      });
      mk('polyline', { points: path.join(' '), fill: 'none', stroke: colors[tone],
        'stroke-width': 2, 'stroke-dasharray': dashed ? '5 4' : 'none' }, svg);
      points.push({ y: py(fn(at)), tone });
    }
    points.forEach(({ y, tone }, i) => {
      if (i && Math.abs(y - points[0].y) < .5) return;
      for (const [r, opacity] of [[6.5, .15], [4.6, .27], [3, 1]])
        mk('circle', { cx: px(at), cy: y, r, fill: colors[tone], opacity }, svg);
    });
    key.replaceChildren();
    for (const { name, tone, dashed } of curves) {
      const item = hEl('span', {}, key);
      item.style.color = colors[tone];
      item.innerHTML = texMix(name);
      if (dashed) item.className = 'dashed';
    }
    values.replaceChildren();
    for (const [name, value, tone] of fields) {
      const cell = hEl('div', {}, values);
      const dt = hEl('dt', {}, cell);
      dt.style.color = colors[tone];
      dt.innerHTML = texMix(name);
      hEl('dd', {}, cell).innerHTML = texMix('$' + value + '$');
    }
    ratioLabel.innerHTML = texMix('面积占上界 $' + fmt(share * 100, 1) + '\\%$');
    fill.style.width = Math.min(100, Math.max(0, share * 100)) + '%';
  };
}
