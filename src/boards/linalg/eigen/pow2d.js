/* 图 特3 · 反复作用与主特征方向
   同一个矩阵连乘 n 次，就是同一个变换连做 n 次。把每个向量按长度归一后画在单位圆上，
   会看到无论初始方向取在哪，点都被一步步拉向主特征方向——两个特征值的比值决定了拉拢的快慢。
   长度序列 |x_k| 逐项比值趋近主特征值的绝对值，这是幂迭代求特征值方法的几何来源。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const PRE = [
  { nm: '① 拉向主方向', A: [[1.6, .6], [.6, 1.2]] },
  { nm: '② 两个都在收缩', A: [[.75, .3], [.3, .5]] },
  { nm: '③ 主特征值为负', A: [[-1.2, .3], [.3, -.7]] },
];

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { k: 0, x: { x: .6, y: 1 } };
  const m = B.isoFit(-2.8, 2.8, -2.2, 2.2, [46, 62, 400, 314], 0);
  const cE = B.chipM('特征值'), cV = B.chipM('主方向'), cG = B.chipM('当前夹角'), cJ = B.chipM('判读');
  const SP = (x, y) => V(m.px(x), m.py(y));

  const eig = A => {
    const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const disc = tr * tr - 4 * det;
    if (disc < 0) return { none: true, tr, det };
    const sq = Math.sqrt(disc);
    const l1 = (tr + sq) / 2, l2 = (tr - sq) / 2;
    const v = l => {
      let x = A[0][1], y = l - A[0][0];
      if (Math.hypot(x, y) < 1e-9) { x = l - A[1][1]; y = A[1][0]; }
      if (Math.hypot(x, y) < 1e-9) return Math.abs(l - A[0][0]) < 1e-9 ? [1, 0] : [0, 1];
      const n = Math.hypot(x, y); return [x / n, y / n];
    };
    return { tr, det, l1, l2, v1: v(l1), v2: v(l2) };
  };

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, grid: true, labs: true });
    const A = PRE[st.k].A;
    const E = eig(A);
    const ap = (p) => [A[0][0] * p.x + A[0][1] * p.y, A[1][0] * p.x + A[1][1] * p.y];

    // 单位圆
    let d = '';
    for (let i = 0; i <= 120; i++) {
      const t = i / 120 * Math.PI * 2;
      const q = SP(Math.cos(t), Math.sin(t));
      d += `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    }
    B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#5c6a80', 'stroke-width': 1.1, 'stroke-dasharray': '5 4', 'stroke-opacity': .6 }, B.dyn));

    if (!E.none) {
      [[E.v1, '#ffd166'], [E.v2, '#c084fc']].forEach(([v, col]) => {
        const k = 2.7;
        B.seg(SP(v[0] * k, v[1] * k), SP(-v[0] * k, -v[1] * k), { stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '7 5', 'stroke-opacity': .8 });
      });
    }

    // 迭代：归一后落在单位圆上
    const N = 9;
    let p = { x: st.x.x, y: st.x.y };
    const pts = [];
    for (let k = 0; k <= N; k++) {
      const n = Math.hypot(p.x, p.y);
      pts.push({ k, u: n < 1e-12 ? null : { x: p.x / n, y: p.y / n }, len: n });
      const [nx, ny] = ap(p);
      p = { x: nx, y: ny };
    }

    const O = SP(0, 0);
    // 相邻两步之间的圆弧连线：把方向的变化画成弧
    for (let k = 1; k <= N; k++) {
      const a = pts[k - 1].u, b = pts[k].u;
      if (!a || !b) continue;
      let s = '';
      for (let i = 0; i <= 20; i++) {
        const tt = i / 20;
        let x = a.x + (b.x - a.x) * tt, y = a.y + (b.y - a.y) * tt;
        const nn = Math.hypot(x, y) || 1;
        const q = SP(x / nn, y / nn);
        s += `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
      }
      B.dyn.appendChild(mk('path', { d: s, fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-opacity': .5 }, B.dyn));
    }
    pts.forEach(o => {
      if (!o.u) return;
      const col = o.k === 0 ? '#ff9e4a' : o.k === N ? '#4ade80' : '#67e8f9';
      B.dot(SP(o.u.x, o.u.y), o.k === 0 || o.k === N ? 5.5 : 3.4, { fill: col, 'fill-opacity': o.k === 0 || o.k === N ? 1 : .8 });
    });
    const last = pts[N].u || { x: 1, y: 0 };
    B.arrow(O, SP(last.x, last.y), { stroke: '#4ade80', 'stroke-width': 2, head: 10, wide: 5 });
    if (pts[0].u) B.arrow(O, SP(pts[0].u.x, pts[0].u.y), { stroke: '#ff9e4a', 'stroke-width': 2, head: 10, wide: 5 });
    B.dot(O, 3, { fill: '#aebdd2' });

    // 主特征方向上的参照长度
    if (!E.none) {
      B.tex(SP(E.v1[0], E.v1[1]), '$v_1$', { size: 12.5, anchor: 'mid', color: '#ffd166' });
      B.tex(SP(E.v2[0], E.v2[1]), '$v_2$', { size: 12.5, anchor: 'mid', color: '#c084fc' });
    }

    const gap = (() => {
      if (E.none || !last) return NaN;
      const co = Math.abs(last.x * E.v1[0] + last.y * E.v1[1]);
      return Math.acos(Math.min(1, co)) * 180 / Math.PI;
    })();

    // 右栏
    const X = 512;
    B.textM(V(X, 70), `$A=\\begin{bmatrix}${fmt(A[0][0], 2)}&${fmt(A[0][1], 2)}\\\\${fmt(A[1][0], 2)}&${fmt(A[1][1], 2)}\\end{bmatrix}$`, { 'font-size': 13, fill: '#aebdd2', 'text-anchor': 'start' });
    if (E.none) {
      B.textM(V(X, 128), '没有实特征值', { 'font-size': 13, 'fill': '#ff7b8a', 'text-anchor': 'start' });
      B.textM(V(X, 158), '每个方向都被反复转动，', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(X, 178), '归一后绕圆周跑来跑去', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    } else {
      B.textM(V(X, 116), `$\\lambda_1=${fmt(E.l1, 3)}$`, { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });
      B.textM(V(X, 142), `$\\lambda_2=${fmt(E.l2, 3)}$`, { 'font-size': 13, fill: '#c084fc', 'text-anchor': 'start' });
      B.textM(V(X, 168), `$\\left|\\lambda_2/\\lambda_1\\right|=${fmt(Math.abs(E.l1) < 1e-9 ? 0 : Math.abs(E.l2 / E.l1), 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(X, 202), `九步后与 $v_1$ 相差 ${fmt(gap, 1)}$^\\circ$`, { 'font-size': 12, fill: '#4ade80', 'text-anchor': 'start' });
      B.textM(V(X, 226), '这个比值越小，拉拢越快', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    }
    // 长度序列
    B.textM(V(X, 262), '长度序列（取对数前的原值）', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    pts.forEach((o, i) => {
      if (i % 2) return;
      const yy = 288 + Math.floor(i / 2) * 26;
      B.textM(V(X, yy), `$|x_{${o.k}}|=${o.len < 1e4 ? fmt(o.len, 3) : o.len.toExponential(2)}$`, { 'font-size': 11.5, fill: '#67e8f9', 'text-anchor': 'start' });
    });

    cE(E.none ? '无实特征值' : `$(${fmt(E.l1, 2)},\\ ${fmt(E.l2, 2)})$`, E.none ? 'warn' : '');
    cV(E.none ? '—' : `$(${fmt(E.v1[0], 2)},\\ ${fmt(E.v1[1], 2)})$`);
    cG(E.none ? '—' : `$${fmt(gap, 1)}^\\circ$`);
    cJ(E.none ? '矩阵相当于旋转：方向永远转下去，没有稳定的极限方向'
      : Math.abs(E.l1) < Math.abs(E.l2) ? '主特征值取绝对值较大者：反复作用后被它主导'
        : Math.abs(E.l1) > 1 ? '比值小于 1：方向被一步步拉向主特征方向，长度每步乘约 |λ₁|'
          : '两个特征值的绝对值都小于 1：方向同样趋近主特征方向，长度同步缩短');
  };

  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.x.x), m.py(st.x.y)),
    set: p => {
      const x = (p.x - m.px(0)) / m.s, y = (m.py(0) - p.y) / m.s;
      const n = Math.hypot(x, y);
      if (n < .12) return;
      st.x = { x, y };
    },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.k = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('反复作用后方向只剩主特征方向：│λ₂/λ₁│ 越小，靠拢得越快');
  B.render();
  return B;
}
