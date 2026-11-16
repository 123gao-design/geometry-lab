/* 图 复1 · 复数的几何表示机
   复平面里拖一个点 z：金线段是模 |z|，橙弧是辐角 arg z（从正实轴逆时针量），
   z 向两条轴作虚线投影读实部与虚部；紫点是共轭 z̄（关于实轴镜像），
   青点是 iz —— 从 z 直接转 90°，模不变、辐角加 π/2。
   三个预设：① 1+i（第一象限、arg 45°）② -1+√3 i（第二象限、arg 120°）③ -2i（负虚轴、arg -90°）。 */
import { Board, V, fmt, mk, arcPts } from '../../../lib/board.js';

const P = [
  { n: '① $z=1+i$', z: [1, 1] },
  { n: '② $z=-1+\\sqrt3\\,i$', z: [-1, Math.sqrt(3)] },
  { n: '③ $z=-2i$', z: [0, -2] },
];

// a+bi 的写法：系数为 0 的项省掉，系数为 ±1 时只留 i
const cn = (a, b, n = 3) => {
  const A = Math.abs(a) < 5e-4 ? 0 : a, B = Math.abs(b) < 5e-4 ? 0 : b;
  const bs = Math.abs(B) === 1 ? '' : fmt(Math.abs(B), n);
  if (B === 0) return fmt(A, n);
  if (A === 0) return (B < 0 ? '-' : '') + bs + 'i';
  return fmt(A, n) + (B < 0 ? '-' : '+') + bs + 'i';
};
const deg = (t, n = 1) => fmt(t * 180 / Math.PI, n) + '^\\circ';

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, z: V(1, 1) };
  const m = B.isoFit(-2.7, 2.7, -2.15, 2.15, [60, 16, 700, 396], 26);
  const cMod = B.chipM('模'), cArg = B.chipM('辐角'), cTri = B.chipM('三角式'), cCon = B.chipM('共轭'), cI = B.chipM('乘 $i$');

  B.renderFn = () => {
    const z = st.z, x = z.x, y = z.y;
    const r = Math.hypot(x, y), th = Math.atan2(y, x);
    B.grid({ ...m, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'Re', ayLab: 'Im' });

    const O = V(m.px(0), m.py(0)), Z = V(m.px(x), m.py(y));
    const C = V(m.px(x), m.py(-y));            // 共轭
    const IZ = V(m.px(-y), m.py(x));           // 乘 i：逆时针转 90°

    // 投影虚线：实部与虚部
    const dash = { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '3 5', 'stroke-opacity': .8 };
    B.seg(Z, V(Z.x, m.py(0)), dash);
    B.seg(Z, V(m.px(0), Z.y), dash);

    // 模：原点到 z 的金色线段
    B.seg(O, Z, { stroke: '#ffd166', 'stroke-width': 2.4 });
    B.tex(V((O.x + Z.x) / 2 - 18, (O.y + Z.y) / 2 - 12), '$|z|$', { size: 13, color: '#ffd166', w: 40, anchor: 'mid' });

    // 辐角弧（屏幕纵轴向下，数学正角取负号）
    if (r > 1e-6) {
      B.dyn.appendChild(mk('path', { d: arcPts(O, 0, -Math.max(0.02, th), 46, 26), fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2 }, B.dyn));
      const ha = th / 2;
      B.tex(V(O.x + 78 * Math.cos(ha), O.y - 78 * Math.sin(ha)), '$\\theta$', { size: 14, color: '#ff9e4a', w: 26, anchor: 'mid' });
    }

    // 共轭：关于实轴的镜像 + 竖向虚线
    B.seg(V(Z.x, m.py(0)), C, { stroke: '#c084fc', 'stroke-width': 1, 'stroke-dasharray': '2 2', 'stroke-opacity': .7 });
    B.dot(C, 5.5, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.4 });
    if (r > 1e-6) B.tex(V(C.x + 16, C.y + 4), '$\\bar z$', { size: 13, color: '#c084fc', w: 30 });

    // 乘 i：再转 90°
    B.seg(O, IZ, { stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-dasharray': '6 5', 'stroke-opacity': .9 });
    B.dot(IZ, 5, { fill: '#67e8f9', stroke: '#0a0d14', 'stroke-width': 1.2 });
    if (r > 1e-6) B.tex(V(IZ.x - 16, IZ.y - 8), '$iz$', { size: 13, color: '#67e8f9', w: 34, anchor: 'end' });
    if (r > 1e-6) B.dyn.appendChild(mk('path', { d: arcPts(O, -th, -th - Math.PI / 2, 30, 18), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-opacity': .8 }, B.dyn));

    // z 本体
    B.dot(Z, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(Z.x + 18, Z.y - 12), '$z$', { size: 14, color: '#ffd166', w: 30 });

    cMod(`$|z|=${fmt(r, 3)}$`, '');
    cArg(`$\\arg z=${deg(th)}$`, '');
    cTri(`$z=${fmt(r, 3)}(\\cos${deg(th)}+i\\sin${deg(th)})$`, '');
    cCon(`$\\bar z=${cn(x, -y)}$`, '');
    cI(`$iz=${cn(-y, x)}$`, '');
  };

  // 拖点：限制在视野内
  B.handle({
    get: () => V(m.px(st.z.x), m.py(st.z.y)),
    set: p => { st.z = V((p.x - m.px(0)) / m.s, (m.py(0) - p.y) / m.s); },
    clamp: p => V(Math.max(m.px(m.X0) + 8, Math.min(m.px(m.X1) - 8, p.x)), Math.max(m.py(m.Y1) + 8, Math.min(m.py(m.Y0) - 8, p.y))),
    color: '#ffd166', r: 8,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i; st.z = V(p.z[0], p.z[1]);
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.sync(); B.render();
  }, { on: i === 0 }));

  B.hintM('拖金色点 $z$：金线段是模，橙弧是辐角；紫点是共轭 $\\bar z$，青点是 $iz$ —— 只转 $90^\\circ$，模不变');
  B.render();
  return B;
}
