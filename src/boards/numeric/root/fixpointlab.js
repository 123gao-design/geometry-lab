/* 图 迭3 · 不动点迭代与压缩映射
   把递推 xₙ₊₁=φ(xₙ) 画成蛛网：竖着走到曲线、横着走到 y=x，如此反复。
   φ 的斜率绝对值小于 1，每走一步到不动点的距离就缩短为原来的 |φ′| 倍；大于 1 则越走越远。
   这里取 φ(x)=ax+(1−a)·2，不动点恒为 2，拖动 a 就能看收敛、摆动收敛、发散三种样子。 */
import { Board, V, mk } from '../../../lib/board.js';

const R = 2;
const phi = (x, a) => a * x + (1 - a) * R;

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { a: .5, x0: .4 };
  const cX = B.chipM('迭代值 $x_n$'), cP = B.chipM('下一步 $x_{n+1}$'), cK = B.chipM('斜率 $\\varphi\'$'), cJ = B.chipM('判读');

  const m = B.isoFit(-0.4, 4.0, -0.4, 4.0, [80, 52, 330, 330], 0);

  B.renderFn = () => {
    const { a } = st;
    B.grid({ ...m, sx: .5, sy: .5, lx: 1, ly: 1 });

    // y=x 与曲线
    B.dyn.appendChild(mk('line', { x1: m.px(m.X0), y1: m.py(m.X0), x2: m.px(m.X1), y2: m.py(m.X1), stroke: '#8fa3bd', 'stroke-width': 1.3, 'stroke-dasharray': '6 4' }, B.dyn));
    B.plot(x => phi(x, a), m, { stroke: '#5cadff', 'stroke-width': 2.2 });

    // 蛛网
    let x = st.x0;
    const pts = [`${m.px(x)},${m.py(x)}`];
    for (let i = 0; i < 8; i++) {
      const y = phi(x, a);
      if (!isFinite(y) || Math.abs(y) > 40) break;
      pts.push(`${m.px(x)},${m.py(y)}`);
      pts.push(`${m.px(y)},${m.py(y)}`);
      x = y;
    }
    if (pts.length > 1) {
      B.dyn.appendChild(mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.7, 'stroke-opacity': .9 }, B.dyn));
    }

    // 不动点
    B.dot(V(m.px(R), m.py(R)), 6, { fill: '#ff7b8a' });

    // 起点
    B.dot(V(m.px(st.x0), m.py(st.x0)), 4, { fill: '#67e8f9' });

    B.textM(V(m.px(m.X1) - 8, m.py(m.X1) - 8), '$y=x$', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });
    B.textM(V(566, 56), `$\\varphi(x)=${a.toFixed(2)}x${(1 - a) >= 0 ? '+' : '-'}${Math.abs((1 - a) * R).toFixed(2)}$`, { 'font-size': 14, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(566, 84), '红点是曲线与 $y=x$ 的交点', { 'font-size': 11.5, fill: '#ff7b8a', 'text-anchor': 'start' });

    // 右栏：前几步的值
    B.textM(V(566, 122), '迭代序列', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    let v = st.x0;
    for (let i = 0; i < 7; i++) {
      B.textM(V(566, 150 + i * 24), `$x_{${i}}=${Math.abs(v) > 1e4 ? v.toExponential(1) : v.toFixed(4)}$`, { 'font-size': 11.5, fill: i === 0 ? '#67e8f9' : '#aebdd2', 'text-anchor': 'start' });
      v = phi(v, a);
    }
    B.textM(V(566, 330), `$|\\varphi'|=|a|=${Math.abs(a).toFixed(2)}$`, { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });

    const y1 = phi(st.x0, a);
    cX(`$${st.x0.toFixed(3)}$`);
    cP(`$${y1.toFixed(3)}$`);
    cK(`$${Math.abs(a).toFixed(2)}$`);
    cJ(Math.abs(a) < .999 ? (a < 0 ? '斜率为负：点在不动点两侧来回跳，摆动的幅度一次比一次小'
      : '斜率在 0 与 1 之间：点顺着同侧一路挤向不动点，越挤越慢')
      : Math.abs(a) > 1.001 ? '斜率绝对值超过 1：每走一步都离不动点更远，蛛网向外散开'
        : '斜率正好等于 −1：点在两个位置之间来回打转，既不靠近也不远离');
  };

  const pre = [];
  const mark = () => pre.forEach((b, i) => b.classList.toggle('on', Math.abs(st.a - [.5, -.5, -1, 1.5][i]) < 1e-9));
  [['收敛 a=0.5', .5], ['摆动 a=−0.5', -.5], ['周期 a=−1', -1], ['发散 a=1.5', 1.5]].forEach(([t, v]) => {
    pre.push(B.btn(t, () => { st.a = v; mark(); B.render(); }));
  });
  mark();

  B.slider('斜率 a', -1.5, 1.5, 0.05, st.a, v => { st.a = v; mark(); B.render(); }, 'a');
  B.handle({
    color: '#67e8f9', r: 7, label: 'x₀',
    get: () => V(m.px(st.x0), m.py(st.x0)),
    set: p => {
      const u = m.px(1) - m.px(0);
      st.x0 = Math.min(Math.max((p.x - m.px(0)) / u, 0.05), 4.3);
    },
  });

  B.hint('把 |a| 推过 1，蛛网从向内收变成向外张；a 取负值则在不动点两侧来回摆');
  B.render();
  return B;
}
