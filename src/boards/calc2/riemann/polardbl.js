/* 图 重3 · 极坐标下的二重积分机
   圆形区域用极坐标写最省事：面积元不是 dr dθ，而是 r dr dθ —— 离极点越远，
   同一段 dθ 扫过的弧越长。橙色小格是 (r,θ) 附近的一块，两条边长分别是 Δr 与 rΔθ。
   三个预设：① 圆 r≤2cosθ　② 半圆环　③ 心形线 r≤1+cosθ。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const P = [
  { n: '① $r\\le2\\cos\\theta$', rmax: t => 2 * Math.cos(t), t0: -Math.PI / 2, t1: Math.PI / 2, area: Math.PI },
  { n: '② $1\\le r\\le2$，$0\\le\\theta\\le\\pi$', rmax: () => 2, rmin: () => 1, t0: 0, t1: Math.PI, area: 1.5 * Math.PI },
  { n: '③ $r\\le1+\\cos\\theta$', rmax: t => 1 + Math.cos(t), t0: 0, t1: 2 * Math.PI, area: 1.5 * Math.PI },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, r: 1.15, th: 35 };
  const cR = B.chipM('$r$'), cXY = B.chipM('直角坐标'), cA = B.chipM('小格面积'), cJ = B.chipM('判读');
  const m = B.isoFit(-2.15, 2.15, -2.15, 2.15, [46, 20, 400, 366], 16);

  const polar = (r, t) => V(m.px(r * Math.cos(t)), m.py(r * Math.sin(t)));
  const cellPts = (r0, t0, dr, dt) => {
    const pts = [];
    for (let i = 0; i <= 10; i++) pts.push(polar(r0 + dr, t0 + dt * i / 10));
    for (let i = 0; i <= 10; i++) pts.push(polar(r0, t0 + dt * (1 - i / 10)));
    return pts;
  };

  B.renderFn = () => {
    const S = P[st.k];
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });

    // 极坐标网格
    for (const r of [0.5, 1, 1.5, 2, 2.5]) {
      const pts = [];
      for (let i = 0; i <= 96; i++) pts.push(polar(r, i / 96 * Math.PI * 2));
      for (let i = 1; i < pts.length; i++) B.seg(pts[i - 1], pts[i], { stroke: '#3f5f8f', 'stroke-width': .9, 'stroke-opacity': .55 });
    }
    for (let k = 0; k < 12; k++) {
      const t = k / 12 * Math.PI * 2;
      B.seg(polar(0, t), polar(2.6, t), { stroke: '#3f5f8f', 'stroke-width': .9, 'stroke-opacity': .45 });
    }

    // 区域
    const outer = [];
    for (let i = 0; i <= 120; i++) { const t = S.t0 + (S.t1 - S.t0) * i / 120; outer.push(polar(S.rmax(t), t)); }
    if (S.rmin) {
      const inner = [];
      for (let i = 120; i >= 0; i--) { const t = S.t0 + (S.t1 - S.t0) * i / 120; inner.push(polar(S.rmin(t), t)); }
      B.dyn.appendChild(mk('polygon', { points: [...outer, ...inner].map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: '#5cadff', 'fill-opacity': .13, stroke: 'none' }, null));
      for (let i = 1; i < outer.length; i++) B.seg(outer[i - 1], outer[i], { stroke: '#5cadff', 'stroke-width': 2 });
      for (let i = 1; i < inner.length; i++) B.seg(inner[i - 1], inner[i], { stroke: '#5cadff', 'stroke-width': 2 });
    } else {
      B.dyn.appendChild(mk('polygon', { points: outer.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: '#5cadff', 'fill-opacity': .13, stroke: 'none' }, null));
      for (let i = 1; i < outer.length; i++) B.seg(outer[i - 1], outer[i], { stroke: '#5cadff', 'stroke-width': 2 });
    }

    // 橙色小格与动点
    const th = st.th * Math.PI / 180, dr = 0.26, dt = 0.26;
    const cps = cellPts(st.r, th, dr, dt);
    B.dyn.appendChild(mk('polygon', { points: cps.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: '#ff9e4a', 'fill-opacity': .4, stroke: '#ff9e4a', 'stroke-width': 1.4 }, null));
    const P0 = polar(st.r, th);
    B.dot(P0, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.seg(polar(0, th), P0, { stroke: '#ffd166', 'stroke-width': 1.3, 'stroke-opacity': .8 });
    B.tex(polar(0.55 * st.r, th), '$r$', { size: 12, color: '#ffd166', w: 24 });

    const area = (st.r + dr) ** 2 * dt / 2 - st.r ** 2 * dt / 2;
    cR(`$${fmt(st.r, 2)}$，$\\theta=${fmt(st.th, 0)}^\\circ$`);
    cXY(`$(${fmt(st.r * Math.cos(th), 2)},\\ ${fmt(st.r * Math.sin(th), 2)})$`);
    cA(`$${fmt(area, 3)}$`);
    cJ(`面积元 $d\\sigma=r\\,dr\\,d\\theta$；整块区域的面积等于 $\\iint_D r\\,dr\\,d\\theta=${fmt(S.area, 3)}$`, 'ok');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('半径 r', 0.2, 2.4, 0.02, st.r, v => { st.r = v; B.render(); }, 'r');
  B.slider('极角 θ', 0, 360, 5, st.th, v => { st.th = v; B.render(); }, 'th');
  B.hintM('拖 r：橙色小格沿半径外移，弧边长 $r\\,\\Delta\\theta$ 跟着变长；面积元里的那个 $r$ 就是这一项');
  B.render();
  return B;
}
