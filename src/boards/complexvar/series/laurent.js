/* 图 级2 · 洛朗级数与孤立奇点机
   左图 z 平面：金色环带是洛朗级数能展开的区域 r<|z|<R，红点是孤立奇点，点 z 可拖并读出 f(z)。
   右图是洛朗系数 a_n 的条形图：n<0 的金色条是主部（负幂项），n≥0 的青色条是解析部分。
   三个预设：① 1/(z(1−z)) 一阶极点；② e^(1/z) 本性奇点；③ sin z / z 可去奇点。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const P = [
  { n: '① $\\dfrac1{z(1-z)}$', ri: 0, ro: 1,
    sing: [[0, 0], [1, 0]], type: '一阶极点', thin: '$0<|z|<1$',
    a: n => (n >= -1 ? 1 : 0),
    part: '$\\dfrac1z$', cnt: '$1$ 项',
    f: (x, y) => { const a = 1 - x, b = -y, cr = x * a - y * b, ci = x * b + y * a, d = cr * cr + ci * ci || 1e-12; return [cr / d, -ci / d]; },
    v: '主部只有一项 $\\dfrac1z$：极点阶数等于主部的最高负幂次数' },
  { n: '② $e^{1/z}$', ri: 0, ro: Infinity,
    sing: [[0, 0]], type: '本性奇点', thin: '$0<|z|<\\infty$',
    a: n => (n <= 0 ? 1 / fact(-n) : 0),
    part: '$\\dfrac1z+\\dfrac1{2z^2}+\\cdots$', cnt: '无穷多',
    f: (x, y) => { const r2 = x * x + y * y || 1e-12, u = x / r2, w = -y / r2, e = Math.exp(u); return [e * Math.cos(w), e * Math.sin(w)]; },
    v: '负幂项没有尽头：点 $z$ 越靠近原点，取值越没有定数' },
  { n: '③ $\\dfrac{\\sin z}{z}$', ri: 0, ro: Infinity,
    sing: [[0, 0]], type: '可去奇点', thin: '$0<|z|<\\infty$',
    a: n => (n < 0 ? 0 : (n % 2 ? 0 : ((n / 2) % 2 ? -1 : 1) / fact(n + 1))),
    part: '无', cnt: '$0$ 项',
    f: (x, y) => { const sr = Math.sin(x) * Math.cosh(y), si = Math.cos(x) * Math.sinh(y), d = x * x + y * y || 1e-12; return [(sr * x + si * y) / d, (si * x - sr * y) / d]; },
    v: '没有负幂项，奇点可以补一个函数值消掉：主部为零就是可去' },
];

function fact(k) { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; }

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
  const st = { k: 0, z: [0.5, 0.35] };
  const mL = B.isoFit(-2.5, 2.5, -2.1, 2.1, [26, 16, 340, 392], 22);
  const cT = B.chipM('奇点类型'), cP = B.chipM('主部'), cN = B.chipM('负幂项'), cF = B.chipM('$f(z)$'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = P[st.k];
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });
    const O = V(mL.px(0), mL.py(0));

    // 环带：外圆 + 内圆，evenodd 挖空
    if (S.ro < Infinity) {
      const Ro = S.ro * mL.s;
      let d = `M ${O.x - Ro} ${O.y} A ${Ro} ${Ro} 0 1 0 ${O.x + Ro} ${O.y} A ${Ro} ${Ro} 0 1 0 ${O.x - Ro} ${O.y} Z`;
      const Ri = S.ri * mL.s;
      if (Ri > 0.5) d += ` M ${O.x - Ri} ${O.y} A ${Ri} ${Ri} 0 1 1 ${O.x + Ri} ${O.y} A ${Ri} ${Ri} 0 1 1 ${O.x - Ri} ${O.y} Z`;
      B.dyn.appendChild(mk('path', { d, fill: '#ffd166', 'fill-opacity': 0.12, 'fill-rule': 'evenodd', stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' }, B.dyn));
      B.tex(V(O.x + Ro - 46, O.y - Ro + 14), '$R$', { size: 12, color: '#ffd166', w: 20 });
    } else {
      B.dyn.appendChild(mk('rect', { x: mL.px(-2.4), y: mL.py(2.0), width: 4.8 * mL.s, height: 4.0 * mL.s, fill: '#ffd166', 'fill-opacity': 0.08, stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' }, B.dyn));
    }
    for (const [sx, sy] of S.sing) {
      const sp = V(mL.px(sx), mL.py(sy));
      B.dot(sp, 4.5, { fill: '#ff6b6b', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(sp.x + 8, sp.y - 9), '$' + cn(sx, sy, 1) + '$', { size: 11.5, color: '#ff6b6b', w: 46 });
    }
    const Z = V(mL.px(st.z[0]), mL.py(st.z[1]));
    B.dot(Z, 6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(Z.x + 13, Z.y - 10), '$z$', { size: 13, color: '#ff9e4a', w: 24 });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), '$z$ 平面：展开区域 ' + S.thin, { size: 12, color: '#93a1b5', w: 250 });

    // 右图：洛朗系数条形图
    const NL = -4, NR = 6, n = NR - NL + 1;
    const x0 = 424, x1 = 790, yb = 336, yt = 56;
    B.seg(V(x0 - 8, yb), V(x1 + 6, yb), { stroke: '#93a1b5', 'stroke-width': 1.6 });
    B.seg(V(x0 - 8, yb), V(x0 - 8, yt - 10), { stroke: '#93a1b5', 'stroke-width': 1.6 });
    B.tex(V(x0 - 8, yt - 22), '$|a_n|$', { size: 12, color: '#93a1b5', w: 40 });
    const bw = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      const k = NL + i;
      const av = Math.abs(S.a(k));
      const hh = av <= 1e-9 ? 0 : Math.max(6, (Math.log10(av) + 4) / 4 * (yb - yt));
      const cx = x0 + bw * (i + 0.5);
      if (hh > 0) {
        B.dyn.appendChild(mk('rect', { x: cx - bw * 0.32, y: yb - hh, width: bw * 0.64, height: hh, fill: k < 0 ? '#ffd166' : '#67e8f9', 'fill-opacity': 0.85, rx: 3 }, B.dyn));
        B.tex(V(cx, yb - hh - 11), '$' + (av >= 0.01 ? fmt(av, 2) : '…') + '$', { size: 10.5, color: k < 0 ? '#ffd166' : '#67e8f9', w: 44 });
      } else {
        B.dot(V(cx, yb - 3), 2.2, { fill: '#5a6474', stroke: 'none' });
      }
      if (k % 2 === 0) B.tex(V(cx, yb + 15), '$' + (k < 0 ? '-' + (-k) : '' + k) + '$', { size: 11, color: '#93a1b5', w: 40 });
    }
    B.tex(V(x0 + 4, yb + 34), '负幂（主部）', { size: 11.5, color: '#ffd166', w: 100 });
    B.tex(V(x1 - 92, yb + 34), '非负幂（解析部分）', { size: 11.5, color: '#67e8f9', w: 130 });
    B.tex(V(x0 + 4, yt - 40), '洛朗系数 $a_n$（纵轴为对数刻度）', { size: 12, color: '#93a1b5', w: 300 });

    const fz = S.f(st.z[0], st.z[1]);
    cT(S.type, S.k === 2 ? 'good' : S.k === 1 ? 'warn' : '');
    cP(S.part, '');
    cN(S.cnt, '');
    cF(`$${cn(fz[0], fz[1])}$`, '');
    cJ(st.k === 0 ? '主部有一项，极点阶为 $1$' : st.k === 1 ? '负幂项无限多，本性奇点' : '主部为零，补上函数值就解析', st.k === 2 ? 'good' : 'warn');
    B.hintM(S.v);
  };

  B.handle({
    get: () => V(mL.px(st.z[0]), mL.py(st.z[1])),
    set: p => { st.z = [(p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s]; },
    clamp: p => V(Math.max(mL.px(-2.3), Math.min(mL.px(2.3), p.x)), Math.max(mL.py(1.9), Math.min(mL.py(-1.9), p.y))),
    color: '#ff9e4a', r: 8,
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
