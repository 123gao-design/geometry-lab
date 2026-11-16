/* 图 微3a · 复合函数求导机（链式法则）
   左图：z=f(u,v)=u²v 的等值线与路径 u=t、v=t²；P 处的蓝箭头是梯度 (f_u,f_v)，
   橙箭头是路径切向 (u′,v′)，绿色是梯度在切向上的投影。右图：z(t)=t⁴ 的曲线与切线。
   两者对读：dz/dt = f_u·u′ + f_v·v′ 正是把两个偏导按路径方向配比后相加。 */
import { Board, V, fmt } from '../../../lib/board.js';
import { heat, isocurves } from '../../../lib/field2d.js';

const F = (u, v) => u * u * v;
const U = t => t, Vv = t => t * t;

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { t: 0.8 };
  const cFu = B.chipM('$f_u$'), cFv = B.chipM('$f_v$'), cUp = B.chipM("$u'$"), cVp = B.chipM("$v'$"), cZ = B.chipM('$z\'(t)$');
  const mL = B.isoFit(-0.25, 1.5, -0.25, 1.55, [26, 26, 438, 330], 18);
  const mR = B.mapFit(0, 1.3, 0, 1.75, [512, 64, 288, 288], 22);

  B.renderFn = () => {
    const t = st.t;
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5, axLab: 'u', ayLab: 'v' });
    heat(B, F, mL, { scale: 2.4 });
    isocurves(B, F, mL, [0.25, 0.6, 1.1, 1.8, 2.7], { stroke: '#93a1b5', w: 1.1, op: .5 });

    // 路径 (u,v)=(t,t²) 与当前点
    const path = [];
    for (let s = 0; s <= 1.22; s += 0.03) path.push(V(mL.px(U(s)), mL.py(Vv(s))));
    for (let i = 1; i < path.length; i++) B.seg(path[i - 1], path[i], { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    const u0 = U(t), v0 = Vv(t);
    const p0 = V(mL.px(u0), mL.py(v0));
    B.dot(p0, 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });

    // 梯度、切向与投影
    const fu = 2 * u0 * v0, fv = u0 * u0;
    const su = 1, sv = 2 * t;
    const len = Math.hypot(fu, fv) || 1, sl = Math.hypot(su, sv) || 1;
    const gTip = V(mL.px(u0 + fu / len * 0.42), mL.py(v0 + fv / len * 0.42));
    const sTip = V(mL.px(u0 + su / sl * 0.85), mL.py(v0 + sv / sl * 0.85));
    B.arrow(p0, gTip, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.arrow(p0, sTip, { stroke: '#ff9e4a', 'stroke-width': 2.2 });
    const proj = (fu * su / sl + fv * sv / sl) / len;
    const q = V(mL.px(u0 + fu / len * 0.42 * proj), mL.py(v0 + fv / len * 0.42 * proj));
    B.seg(p0, q, { stroke: '#4ade80', 'stroke-width': 3.4, 'stroke-opacity': .9 });

    B.tex(V(mL.px(0.02), mL.py(1.5) - 12), '梯度 $(f_u,f_v)$ 与切向 $(u\',v\')$', { size: 12, color: '#93a1b5', w: 300 });

    // 右图 z(t) 与切线
    B.grid({ ...mR, sx: 0.25, sy: 0.25, lx: 0.5, ly: 0.5, axLab: 't', ayLab: 'z' });
    B.plot(s => s ** 4, mR, { stroke: '#ffd166', 'stroke-width': 2.4, x0: 0.01, x1: 1.22, n: 120 });
    const z0 = t ** 4, k = 4 * t ** 3;
    B.seg(V(mR.px(t - 0.35), mR.py(z0 - 0.35 * k)), V(mR.px(t + 0.35), mR.py(z0 + 0.35 * k)), { stroke: '#4ade80', 'stroke-width': 2, 'stroke-opacity': .9 });
    B.dot(V(mR.px(t), mR.py(z0)), 4.8, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(mR.px(0.35), mR.py(1.55)), '$z(t)=t^4$', { size: 12, color: '#ffd166', w: 130 });

    cFu(`$${fmt(fu, 3)}$`);
    cFv(`$${fmt(fv, 3)}$`);
    cUp(`$${fmt(1, 1)}$`);
    cVp(`$${fmt(2 * t, 2)}$`);
    cZ(`$${fmt(k, 3)}$`);
  };

  B.slider('参数 t', 0.15, 1.15, 0.01, st.t, v => { st.t = v; B.render(); }, 't');
  B.hintM('拖 $t$：蓝色梯度的绿投影就是右图切线的斜率，$z\'(t)=f_uu\'+f_vv\'$');
  B.render();
  return B;
}
