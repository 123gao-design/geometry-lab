/* 图 方5 · 特征根机：二阶常系数齐次方程的形状全看两个根
   以 y''+py'+qy=0、y(0)=1、y'(0)=0 为例，随 p、q 拖动看三种情形：
   两个实根（单减或先升后降）、重根（临界，最快贴到零）、一对共轭复根（来回振荡）。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { p: 1.0, q: 1.0 };
  const cR = B.chipM('特征根'), cT = B.chipM('类型'), cJ = B.chipM('判读');

  const sol = (x, l1, l2, kind) => {
    if (kind === 0) return (l2 * Math.exp(l1 * x) - l1 * Math.exp(l2 * x)) / (l2 - l1);
    if (kind === 1) return (1 - l1 * x) * Math.exp(l1 * x);
    const a = l1, b = l2;
    return Math.exp(a * x) * (Math.cos(b * x) - (a / b) * Math.sin(b * x));
  };

  B.renderFn = () => {
    const p = st.p, q = st.q, D = p * p - 4 * q;
    const m = B.mapFit(-0.15, 9, -1.6, 1.6, [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 2, ly: 1, xt: [2, 4, 6, 8], yt: [-1, 1] });
    let kind, l1, l2, txt, tname;
    if (D > 1e-9) {
      kind = 0; l1 = (-p + Math.sqrt(D)) / 2; l2 = (-p - Math.sqrt(D)) / 2;
      txt = `$\\lambda_{1,2}=${fmt(l1, 2)},\\ ${fmt(l2, 2)}$`; tname = '两个不等实根';
    } else if (D > -1e-9) {
      kind = 1; l1 = l2 = -p / 2;
      txt = `$\\lambda_1=\\lambda_2=${fmt(l1, 2)}$`; tname = '重根（临界）';
    } else {
      kind = 2; l1 = -p / 2; l2 = Math.sqrt(-D) / 2;
      txt = `$\\lambda=${fmt(l1, 2)}\\pm${fmt(l2, 2)}\\mathrm{i}$`; tname = '一对共轭复根';
    }
    B.plot(x => sol(x, l1, l2, kind), m, { stroke: '#5cadff', 'stroke-width': 2.4, pad: 4 });
    B.tex(V(636, 84), '特征方程', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 120), `$\\lambda^2+${fmt(p, 1)}\\lambda+${fmt(q, 1)}=0$`, { size: 12, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 162), txt, { size: 12.5, color: '#c084fc', anchor: 'start', w: 240 });
    B.tex(V(636, 204), `$\\Delta=${fmt(D, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.textM(V(636, 246), tname, { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
    B.textM(V(636, 288), kind === 2 ? '实部为负时振荡并衰减' : '两根都负时单调贴向零', { 'font-size': 11.5, fill: '#6b7c93', 'text-anchor': 'start' });

    cR(txt);
    cT(tname);
    if (kind === 2) cJ('复根：解里带 $\\sin$ 与 $\\cos$，图像来回振荡；实部负则振幅按指数缩');
    else if (kind === 1) cJ('重根：两个根本该相同的两支合成一支，图像贴着零却始终不穿过');
    else cJ('两个负实根：解是两个衰减指数相加，不会振荡 —— 过阻尼的样子');
  };

  B.slider('p =', -1, 4, 0.02, st.p, v => { st.p = v; B.render(); }, 'p');
  B.slider('q =', -2, 5, 0.02, st.q, v => { st.q = v; B.render(); }, 'q');
  B.hintM('拖 $p$、$q$：判别式过零那一刻，图像从单调衰减变成振荡 —— 这就是临界阻尼');
  B.render();
  return B;
}
