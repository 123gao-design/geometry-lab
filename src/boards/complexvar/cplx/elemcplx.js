/* 图 复3 · 初等复变函数机
   左图 z 平面，右图 w 平面，同一张网格过一遍初等函数：
   ① w=e^z：横带 −π<Im z<π 映到割开的 w 平面。竖线 x=c 映成半径 e^c 的圆（蓝），
     横线 y=c 映成从原点出发、张角 c 的射线（橙）。带的宽度是 2π，所以 e^z 的周期是 2πi。
   ② w=Log z：反过来把 z 平面卷成宽度 2π 的横带，对数因此多值 —— k 滑块换一个分支，
     像整体沿虚轴挪 2π，形状不变。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

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
  const st = { k: 0, z: V(0.5, 0.5), br: 0 };
  const mL = B.isoFit(-1.9, 1.9, -3.45, 3.45, [22, 14, 330, 398], 18);
  const mR = B.isoFit(-4.6, 4.6, -4.6, 4.6, [392, 14, 410, 398], 20);
  const mL2 = B.isoFit(-3.4, 3.4, -3.4, 3.4, [22, 14, 330, 398], 18);
  const mR2 = B.isoFit(-2.4, 2.4, -7.2, 7.2, [392, 14, 410, 398], 18);
  const cZ = B.chipM('z'), cW = B.chipM('w'), cR = B.chipM('模'), cT = B.chipM('辐角');

  const BL = '#5cadff', GR = '#4ade80', OR = '#ff9e4a';

  const path = (d, at) => {
    const p = mk('path', { d, fill: 'none', ...at }, B.dyn);
    return p;
  };

  // ① w=e^z：带的竖线 → 圆，带的横线 → 射线
  function expMap() {
    B.grid({ ...mL, sx: 0.5, sy: Math.PI / 4, lx: 1, ly: 1, yt: [], axLab: 'x', ayLab: 'y' });
    B.grid({ ...mR, sx: 1, sy: 1, lx: 1, ly: 1, axLab: 'u', ayLab: 'v' });
    // y 轴的刻度按 π 写，grid 只会印十进制，这里手写
    for (const [v, s] of [[Math.PI / 2, '$\\frac{\\pi}{2}$'], [Math.PI, '$\\pi$'], [-Math.PI / 2, '$-\\frac{\\pi}{2}$'], [-Math.PI, '$-\\pi$']])
      B.tex(V(mL.px(0) - 18, mL.py(v) + 4), s, { size: 11, color: '#5c6a80', w: 40, anchor: 'end' });
    // 竖线 x=c：圆
    for (let c = -1.5; c <= 1.5 + 1e-9; c += 0.5) {
      B.seg(V(mL.px(c), mL.py(-3.14)), V(mL.px(c), mL.py(3.14)), { stroke: BL, 'stroke-width': 1.6, 'stroke-opacity': .75 });
      const R = Math.exp(c), d = [];
      for (let t = 0; t <= 6.2832; t += 0.05) d.push(`${mR.px(R * Math.cos(t)).toFixed(1)} ${mR.py(R * Math.sin(t)).toFixed(1)}`);
      path('M' + d.join('L') + 'Z', { stroke: BL, 'stroke-width': 1.6, 'stroke-opacity': .8 });
      B.tex(V(mR.px(R * Math.cos(0.6)) + 3, mR.py(R * Math.sin(0.6))), `$${fmt(R, 2)}$`, { size: 10.5, color: BL, w: 34 });
    }
    // 横线 y=c：射线
    for (let t = -3.14; t <= 3.14 + 1e-9; t += Math.PI / 4) {
      B.seg(V(mL.px(-1.9), mL.py(t)), V(mL.px(1.9), mL.py(t)), { stroke: OR, 'stroke-width': 1.6, 'stroke-opacity': .7 });
      const L = Math.exp(1.55);
      B.seg(V(mR.px(0), mR.py(0)), V(mR.px(L * Math.cos(t)), mR.py(L * Math.sin(t))), { stroke: OR, 'stroke-width': 1.5, 'stroke-opacity': .75 });
    }
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 13), '每个圆是一条竖线的像，每条射线是一条横线的像', { size: 11.5, color: '#93a1b5', w: 330 });
  }

  // ② w=Log z：z 平面过一遍对数，卷成带宽 2π 的横带
  function logMap() {
    B.grid({ ...mL2, grid: false, sx: 1, sy: 1, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });
    B.grid({ ...mR2, grid: false, sx: 1, sy: Math.PI, lx: 1, ly: 1, yt: [], axLab: 'u', ayLab: 'v' });
    for (const [v, s] of [[Math.PI, '$\\pi$'], [2 * Math.PI, '$2\\pi$'], [-Math.PI, '$-\\pi$'], [-2 * Math.PI, '$-2\\pi$']])
      B.tex(V(mR2.px(0) - 18, mR2.py(v) + 4), s, { size: 11, color: '#5c6a80', w: 44, anchor: 'end' });
    const f = (x, y) => {
      const r = Math.hypot(x, y);
      if (r < 1e-6) return null;
      return [Math.log(r), Math.atan2(y, x) + 2 * Math.PI * st.br];
    };
    for (let c = -3; c <= 3 + 1e-9; c += 0.5) {
      B.seg(V(mL2.px(c), mL2.py(-3.4)), V(mL2.px(c), mL2.py(3.4)), { stroke: BL, 'stroke-width': 1.4, 'stroke-opacity': .62 });
      B.seg(V(mL2.px(-3.4), mL2.py(c)), V(mL2.px(3.4), mL2.py(c)), { stroke: GR, 'stroke-width': 1.4, 'stroke-opacity': .55 });
      // 竖线的像
      let d = '', pen = false;
      for (let t = -3.4; t <= 3.4 + 1e-9; t += 0.05) {
        const q = f(c, t);
        if (!q) { pen = false; continue; }
        const [u, v] = q;
        if (Math.abs(v) > mR2.Y1 + 2) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + mR2.px(u).toFixed(1) + ' ' + mR2.py(v).toFixed(1) + ' ';
        pen = true;
      }
      path(d, { stroke: BL, 'stroke-width': 1.5, 'stroke-opacity': .8 });
      // 横线的像
      d = ''; pen = false;
      for (let t = -3.4; t <= 3.4 + 1e-9; t += 0.05) {
        const q = f(t, c);
        if (!q) { pen = false; continue; }
        const [u, v] = q;
        if (Math.abs(v) > mR2.Y1 + 2) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + mR2.px(u).toFixed(1) + ' ' + mR2.py(v).toFixed(1) + ' ';
        pen = true;
      }
      path(d, { stroke: GR, 'stroke-width': 1.5, 'stroke-opacity': .72 });
    }
    // 分支的分界：带的上、下两条边
    B.seg(V(mR2.px(mR2.X0), mR2.py(Math.PI + 2 * Math.PI * st.br)), V(mR2.px(mR2.X1), mR2.py(Math.PI + 2 * Math.PI * st.br)), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-dasharray': '6 5', 'stroke-opacity': .85 });
    B.seg(V(mR2.px(mR2.X0), mR2.py(-Math.PI + 2 * Math.PI * st.br)), V(mR2.px(mR2.X1), mR2.py(-Math.PI + 2 * Math.PI * st.br)), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-dasharray': '6 5', 'stroke-opacity': .85 });
    B.tex(V(mR2.px(mR2.X0) + 6, mR2.py(mR2.Y1) + 13), '一根横带就是一个分支，相邻两带差 $2\\pi i$', { size: 11.5, color: '#93a1b5', w: 330 });
    return f;
  }

  B.renderFn = () => {
    const z = st.z;
    let f;
    if (st.k === 0) { expMap(); f = (x, y) => [Math.exp(x) * Math.cos(y), Math.exp(x) * Math.sin(y)]; }
    else f = logMap();
    const q = f(z.x, z.y) || [0, 0];
    const m = st.k === 0 ? mL : mL2, mr = st.k === 0 ? mR : mR2;

    const Z = V(m.px(z.x), m.py(z.y));
    B.dot(Z, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(Z.x + 16, Z.y - 10), '$z$', { size: 13, color: '#ffd166', w: 26 });
    const Wp = V(mr.px(q[0]), mr.py(q[1]));
    if (q[0] > mr.X0 && q[0] < mr.X1 && q[1] > mr.Y0 && q[1] < mr.Y1) {
      B.dot(Wp, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
      B.tex(V(Wp.x + 16, Wp.y - 10), '$w$', { size: 13, color: '#ffd166', w: 26 });
    }
    B.tex(V(m.px(m.X0) + 6, mr.py(mr.Y1) + 13), '$z$ 平面', { size: 12.5, color: '#93a1b5', w: 70 });
    B.tex(V(mr.px(mr.X0) + 6, mr.py(mr.Y1) + 13), '$w$ 平面', { size: 12.5, color: '#93a1b5', w: 70 });

    cZ(`$z=${cn(z.x, z.y)}$`, '');
    cW(`$w=${cn(q[0], q[1])}$`, '');
    cR(st.k === 0 ? `$|e^z|=e^x=${fmt(Math.exp(z.x), 3)}$` : `$|z|=${fmt(Math.hypot(z.x, z.y), 3)}$`, '');
    cT(st.k === 0 ? `$\\arg e^z=y=${fmt(z.y, 3)}$` : `$\\arg z+2\\pi k=${fmt(Math.atan2(z.y, z.x) + 2 * Math.PI * st.br, 3)}$`, '');
    B.hintM(st.k === 0
      ? '拖 $z$：向右走 $|e^z|$ 变大，向上走辐角变大；$y$ 每加 $2\\pi$ 回到同一点 —— 周期 $2\\pi i$'
      : '换 $k$：同一个 $z$ 得无穷多个对数，相邻两个差 $2\\pi i$；主值取 $-\\pi<\\arg z\\le\\pi$ 那一支');
  };

  B.handle({
    get: () => { const m = st.k === 0 ? mL : mL2; return V(m.px(st.z.x), m.py(st.z.y)); },
    set: p => { const m = st.k === 0 ? mL : mL2; st.z = V((p.x - m.px(0)) / m.s, (m.py(0) - p.y) / m.s); },
    clamp: p => {
      const m = st.k === 0 ? mL : mL2;
      let q = V(Math.max(m.px(m.X0) + 8, Math.min(m.px(m.X1) - 8, p.x)), Math.max(m.py(m.Y1) + 8, Math.min(m.py(m.Y0) - 8, p.y)));
      if (st.k === 1) { // 对数在原点无定义：绕开
        const c = V(m.px(0), m.py(0)), dx = q.x - c.x, dy = q.y - c.y, L = Math.hypot(dx, dy), r0 = 0.3 * m.s;
        if (L < r0) q = V(c.x + dx / (L || 1) * r0, c.y + dy / (L || 1) * r0);
      }
      return q;
    },
    color: '#ffd166', r: 8,
    drag: () => B.render(),
  });

  const bts = ['① $w=e^z$', '② $w=\\operatorname{Log}z$'].map((lab, i) => B.btnM(lab, () => {
    st.k = i;
    st.z = i === 0 ? V(0.5, 0.5) : V(1, 1);
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    if (sK) (sK.parentNode || sK.parent).style.display = i === 0 ? 'none' : '';
    B.sync(); B.render();
  }, { on: i === 0 }));
  const sK = B.slider('分支 k', -1, 1, 1, st.br, v => { st.br = v; B.render(); }, 'k');
  (sK.parentNode || sK.parent).style.display = 'none';

  B.render();
  return B;
}
