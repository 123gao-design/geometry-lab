/* 图 数3 · 协方差与相关系数
   一对随机变量的 140 组取值撒在平面上，滑块控制它们一起变化的倾向。
   落在第一、三象限（同号）的点是金色，落在第二、四象限（异号）的点是蓝色；
   协方差就是「横竖偏离之积」的平均，同号多于异号时为正。相关系数把协方差除以两个标准差，收进 [−1,1]。 */
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
  const st = { r: .6 };
  const cC = B.chipM('协方差'), cR = B.chipM('相关系数'), cJ = B.chipM('判读');

  // 固定的标准正态样本对：x 用一份种子，z 用另一份，r 改变时样本本身不变
  const rnd = mulberry32(20261110);
  const gauss = () => {
    const u = Math.max(rnd(), 1e-9), v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const zx = [], zz = [];
  for (let i = 0; i < 140; i++) { zx.push(gauss()); zz.push(gauss()); }

  const f3 = v => v.toFixed(3);

  B.renderFn = () => {
    const r = st.r;
    const pts = zx.map((x, i) => [x, r * x + Math.sqrt(1 - r * r) * zz[i]]);
    const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
    const my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    const cov = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0) / pts.length;
    const sx = Math.sqrt(pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0) / pts.length);
    const sy = Math.sqrt(pts.reduce((a, p) => a + (p[1] - my) ** 2, 0) / pts.length);
    const rho = cov / (sx * sy);

    const s = 42, CX = 322, CY = 236;
    const px = x => CX + x * s, py = y => CY - y * s;

    // 网格
    B.dyn.appendChild(mk('rect', { x: 92, y: 46, width: 470, height: 344, rx: 10, fill: 'rgba(139,163,189,.04)', stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
    for (let k = -3; k <= 3; k++) {
      B.dyn.appendChild(mk('line', { x1: px(k), y1: 60, x2: px(k), y2: 376, stroke: '#3f5f8f', 'stroke-width': 1, 'stroke-opacity': .5 }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: 104, y1: py(k), x2: 550, y2: py(k), stroke: '#3f5f8f', 'stroke-width': 1, 'stroke-opacity': .5 }, B.dyn));
    }
    // 均值十字线
    B.dyn.appendChild(mk('line', { x1: px(mx), y1: 60, x2: px(mx), y2: 376, stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: 104, y1: py(my), x2: 550, y2: py(my), stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, B.dyn));

    pts.forEach(([x, y]) => {
      const pos = (x - mx) * (y - my) >= 0;
      B.dot(V(px(x), py(y)), 3.6, { fill: pos ? '#ffd166' : '#5cadff', 'fill-opacity': .8 });
    });

    B.textM(V(px(mx) + 8, 70), `$\\bar x=${f3(mx)}$`, { 'font-size': 11, fill: '#67e8f9', 'text-anchor': 'start' });
    B.textM(V(120, py(my) - 8), `$\\bar y=${f3(my)}$`, { 'font-size': 11, fill: '#67e8f9', 'text-anchor': 'start' });
    B.text(V(592, 306), '金色：第一、三象限', { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'start' });
    B.text(V(592, 328), '贡献为正', { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'start' });
    B.text(V(592, 356), '蓝色：第二、四象限', { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'start' });
    B.text(V(592, 378), '贡献为负', { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'start' });

    // 右侧读数条
    const bars = [['协方差', cov, '#ffd166'], ['相关系数', rho, '#c084fc']];
    bars.forEach(([nm, v, c], i) => {
      const y = 110 + i * 96;
      B.textM(V(616, y), `$${nm === '协方差' ? '\\operatorname{cov}(X,Y)' : '\\rho(X,Y)'}=${f3(v)}$`, { 'font-size': 12.5, fill: c, 'text-anchor': 'start' });
      B.dyn.appendChild(mk('line', { x1: 616, y1: y + 16, x2: 616 + 150, y2: y + 16, stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: 616 + 75, y1: y + 10, x2: 616 + 75, y2: y + 22, stroke: '#8fa3bd', 'stroke-width': 1 }, B.dyn));
      B.dyn.appendChild(mk('circle', { cx: 616 + 75 + Math.max(-1, Math.min(1, v)) * 72, cy: y + 16, r: 5, fill: c, 'fill-opacity': .9 }, B.dyn));
    });

    cC(`$\\dfrac{1}{n}\\sum(x_i-\\bar x)(y_i-\\bar y)=${f3(cov)}$`);
    cR(`$\\dfrac{${f3(cov)}}{${f3(sx)}\\times${f3(sy)}}=${f3(rho)}$`);
    cJ(rho > .85 ? '两变量几乎落在一条上升的直线上，正相关很强'
      : rho > .3 ? '同号的点明显多于异号的点，两变量同向变化的倾向较强'
        : rho < -.85 ? '两变量几乎落在一条下降的直线上，负相关很强'
          : rho < -.3 ? '异号的点明显多于同号的点，两变量反向变化的倾向较强'
            : '同号与异号的点大致相当，两个变量几乎不相关');
  };

  B.slider('相关参数 ρ', -.9, .9, .05, st.r, v => { st.r = v; B.render(); }, 'rho');

  B.hint('同号的点多则协方差为正；相关系数把大小归一，只留下方向与强弱');
  B.render();
  return B;
}
