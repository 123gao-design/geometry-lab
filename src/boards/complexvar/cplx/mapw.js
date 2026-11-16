/* 图 复2 · 复变函数与映射机
   左图 z 平面上铺一张方格网，右图是同一张网在 w=f(z) 下的像：竖直族（蓝）与水平族（绿）各走各的。
   拖左图的点 z，右图的像 w 同步走，两图用同一条比例尺，可以直接看出哪里被拉伸、哪里被压扁。
   三个预设：① w=iz+1（整体旋转 90° 再平移 —— 方格还是方格）；
             ② w=z²（第一象限折成半平面，直线族弯成抛物线）；
             ③ w=1/z（方格弯成过原点的圆族，原点附近被翻到无穷远）。 */
import { Board, V, fmt } from '../../../lib/board.js';

const P = [
  { n: '① $w=iz+1$', f: (x, y) => [-y + 1, x], v: '旋转 $90^\\circ$ 再平移：方格网整体转过去，形状与大小都没变' },
  { n: '② $w=z^2$', f: (x, y) => [x * x - y * y, 2 * x * y], v: '两条直线族都弯成抛物线；实轴上 $z$ 与 $-z$ 落到同一点，映射因此不是一一的' },
  { n: '③ $w=\\dfrac1z$', f: (x, y) => { const r2 = x * x + y * y || 1e-9; return [x / r2, -y / r2]; }, v: '竖线与横线各自映成过原点的圆族；$z$ 越大，$w$ 离原点越近' },
];

const cn = (a, b, n = 3) => {
  const A = Math.abs(a) < 5e-4 ? 0 : a, B = Math.abs(b) < 5e-4 ? 0 : b;
  const bs = Math.abs(B) === 1 ? '' : fmt(Math.abs(B), n);
  if (B === 0) return fmt(A, n);
  if (A === 0) return (B < 0 ? '-' : '') + bs + 'i';
  return fmt(A, n) + (B < 0 ? '-' : '+') + bs + 'i';
};

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, z: V(1.2, 0.8) };
  const mL = B.isoFit(-2.4, 2.4, -2.05, 2.05, [24, 14, 372, 398], 24);
  const mR = B.isoFit(-2.4, 2.4, -2.05, 2.05, [426, 14, 370, 398], 24);
  const cZ = B.chipM('z'), cW = B.chipM('w'), cMod = B.chipM('模'), cArg = B.chipM('辐角');

  const GX = '#5cadff', GY = '#4ade80';   // 竖线族蓝、横线族绿

  // 一张网格在映射下的像：按 0.08 采样，靠近奇点时抬笔
  function grid(m, f, fade) {
    for (let c = -2; c <= 2 + 1e-9; c += 0.5) {
      const at = { stroke: GX, 'stroke-width': 1.5, 'stroke-opacity': fade, fill: 'none' };
      let d = '', pen = false;
      for (let t = -2; t <= 2 + 1e-9; t += 0.06) {
        const [u, v] = f(c, t);
        if (!isFinite(u) || !isFinite(v) || Math.abs(u) > 20 || Math.abs(v) > 20) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + m.px(u).toFixed(1) + ' ' + m.py(v).toFixed(1) + ' ';
        pen = true;
      }
      B.dyn.appendChild(mkPath(d, at));
    }
    for (let c = -2; c <= 2 + 1e-9; c += 0.5) {
      const at = { stroke: GY, 'stroke-width': 1.5, 'stroke-opacity': fade, fill: 'none' };
      let d = '', pen = false;
      for (let t = -2; t <= 2 + 1e-9; t += 0.06) {
        const [u, v] = f(t, c);
        if (!isFinite(u) || !isFinite(v) || Math.abs(u) > 20 || Math.abs(v) > 20) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + m.px(u).toFixed(1) + ' ' + m.py(v).toFixed(1) + ' ';
        pen = true;
      }
      B.dyn.appendChild(mkPath(d, at));
    }
  }
  function mkPath(d, at) {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    Object.entries(at).forEach(([k, v]) => p.setAttribute(k, v));
    return p;
  }

  B.renderFn = () => {
    const S = P[st.k], z = st.z;
    const [u, v] = S.f(z.x, z.y);
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });
    B.grid({ ...mR, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'u', ayLab: 'v' });
    grid(mL, S.f, .28);
    grid(mR, S.f, .8);

    // 两图的点与对应虚线
    const Z = V(mL.px(z.x), mL.py(z.y));
    B.dot(Z, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(Z.x + 18, Z.y - 12), '$z$', { size: 13, color: '#ffd166', w: 28 });
    const Wp = V(mR.px(u), mR.py(v));
    const inView = u > mR.X0 && u < mR.X1 && v > mR.Y0 && v < mR.Y1;
    if (inView) {
      B.dot(Wp, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
      B.tex(V(Wp.x + 18, Wp.y - 12), '$w$', { size: 13, color: '#ffd166', w: 28 });
    }
    B.tex(V(mL.px(mL.X0) + 6, mR.py(mR.Y1) + 12), '$z$ 平面', { size: 12.5, color: '#93a1b5', w: 90 });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 12), '$w$ 平面', { size: 12.5, color: '#93a1b5', w: 90 });

    cZ(`$z=${cn(z.x, z.y)}$`, '');
    cW(`$w=${cn(u, v)}$`, '');
    cMod(`$|w|=${fmt(Math.hypot(u, v), 3)}$`, '');
    cArg(`$\\arg w=${fmt(Math.atan2(v, u) * 180 / Math.PI, 1)}^\\circ$`, '');
    B.hintM(S.v);
  };

  B.handle({
    get: () => V(mL.px(st.z.x), mL.py(st.z.y)),
    set: p => { st.z = V((p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s); },
    clamp: p => {
      let q = V(Math.max(mL.px(mL.X0) + 8, Math.min(mL.px(mL.X1) - 8, p.x)), Math.max(mL.py(mL.Y1) + 8, Math.min(mL.py(mL.Y0) - 8, p.y)));
      if (st.k === 2) { // 倒数映射：别让点贴着原点走丢
        const c = V(mL.px(0), mL.py(0)), dx = q.x - c.x, dy = q.y - c.y, L = Math.hypot(dx, dy), r0 = 0.42 * mL.s;
        if (L < r0) q = V(c.x + dx / (L || 1) * r0, c.y + dy / (L || 1) * r0);
      }
      return q;
    },
    color: '#ffd166', r: 8,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.render();
  return B;
}
