/* 图 统1b · 频率分布直方图
   100 个成绩按组距分组，矩形的高取「频率 ÷ 组距」，于是每块矩形的面积就是该组的频率，全部面积之和为 1。
   组距改变时矩形重新划分，轮廓不变；金色折线连接各矩形顶端，橙色线与紫色线分别给出平均数与中位数。 */
import { Board, V, mk } from '../../../lib/board.js';

const mulberry32 = a => () => {
  a |= 0; a = a + 0x6D2B79F5 | 0;
  let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { k: 6 };
  const cW = B.chipM('组距'), cA = B.chipM('面积之和'), cM = B.chipM('平均数与中位数'), cJ = B.chipM('判读');

  // 固定的一组 100 个成绩
  const data = (() => {
    const rnd = mulberry32(20261110), out = [];
    for (let i = 0; i < 100; i++) {
      const u = Math.max(rnd(), 1e-9), v = rnd();
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      out.push(Math.min(99.5, Math.max(40.5, 72 + 11 * z)));
    }
    return out;
  })();
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const median = (sorted[49] + sorted[50]) / 2;

  const X0 = 96, X1 = 760, YB = 330, YT = 84, yMax = .05;
  const px = x => X0 + (x - 40) / 60 * (X1 - X0);
  const py = h => YB - h / yMax * (YB - YT);

  B.renderFn = () => {
    const k = st.k, w = 60 / k;
    const cnt = new Array(k).fill(0);
    data.forEach(v => { cnt[Math.min(k - 1, Math.floor((v - 40) / w))]++; });
    const hs = cnt.map(c => (c / 100) / w);

    B.dyn.appendChild(mk('rect', { x: X0, y: YT, width: X1 - X0, height: YB - YT, fill: 'rgba(139,163,189,.04)', stroke: 'none' }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: X0, y1: YB, x2: X1 + 16, y2: YB, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: X0, y1: YB, x2: X0, y2: YT - 10, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));
    B.text(V(X1 + 22, YB + 4), '成绩', { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'start' });
    B.text(V(X0 - 8, YT - 22), '频率/组距', { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'start' });
    for (let t = 0; t <= .05 + 1e-9; t += .01) {
      B.dyn.appendChild(mk('line', { x1: X0 - 5, y1: py(t), x2: X0, y2: py(t), stroke: '#aebdd2', 'stroke-width': 1 }, B.dyn));
      B.textM(V(X0 - 10, py(t) + 3), `$${t.toFixed(2)}$`, { 'font-size': 9.5, fill: '#5c6a80', 'text-anchor': 'end' });
    }
    for (let x = 40; x <= 100; x += 10) {
      B.dyn.appendChild(mk('line', { x1: px(x), y1: YB, x2: px(x), y2: YB + 5, stroke: '#aebdd2', 'stroke-width': 1 }, B.dyn));
      B.textM(V(px(x), YB + 18), `$${x}$`, { 'font-size': 10.5, fill: '#8fa3bd' });
    }

    // 矩形
    hs.forEach((h, i) => {
      if (cnt[i] === 0) return;
      B.dyn.appendChild(mk('rect', {
        x: px(40 + i * w) + 1.5, y: py(h), width: px(40 + (i + 1) * w) - px(40 + i * w) - 3, height: YB - py(h),
        fill: '#5cadff', 'fill-opacity': .32, stroke: '#5cadff', 'stroke-width': 1.3,
      }, B.dyn));
    });
    // 频率折线：两端落在横轴上
    const pts = hs.map((h, i) => `${px(40 + (i + .5) * w)},${py(h)}`);
    B.dyn.appendChild(mk('polyline', { points: `${px(40)},${YB} ${pts.join(' ')} ${px(100)},${YB}`, fill: 'none', stroke: '#ffd166', 'stroke-width': 1.8 }, B.dyn));

    // 平均数与中位数
    [[mean, '#ff9e4a', '平均数'], [median, '#c084fc', '中位数']].forEach(([v, c], i) => {
      B.dyn.appendChild(mk('line', { x1: px(v), y1: YT + 6, x2: px(v), y2: YB, stroke: c, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, B.dyn));
      B.textM(V(px(v), YT + (i ? 0 : -12)), `$${v.toFixed(1)}$`, { 'font-size': 11, fill: c });
    });

    const area = cnt.reduce((a, c, i) => a + (c / 100), 0);
    cW(`$\\Delta=${w.toFixed(1)}$`);
    cA(`$${area.toFixed(2)}$`);
    cM(`$\\bar x=${mean.toFixed(1)}$，中位数 ${median.toFixed(1)}`);
    cJ(st.k <= 6 ? '组距较大时只看得出大致形态，要更细的细节就把组距调小'
      : '组距变小后矩形更细，轮廓逐渐清晰，但每组的样本变少，起伏也更明显');
  };

  B.slider('组数 k', 5, 12, 1, st.k, v => { st.k = v; B.render(); }, 'k');

  B.hint('每块矩形的面积等于该组的频率，所有面积之和恒为 1');
  B.render();
  return B;
}
