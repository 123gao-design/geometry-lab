/* 图 极2 · 极坐标与直角坐标互化
   把极点放在原点、极轴与 x 轴正半轴重合，两种坐标就落在同一张平面上。
   互化公式：x=ρcosθ，y=ρsinθ；反过来 ρ²=x²+y²，tanθ=y/x（x≠0）。
   图中金色一支是 OP，横纵虚线是 P 到两轴的投影，橙色弧是极角。
   拖动 P：极坐标、直角坐标与两式逐项读数同时改。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { x: 1, y: 1.5, grid: true, labs: true };
  const PRE = [
    { nm: '① 第一象限', x: 1, y: 1.5 },
    { nm: '② 第二象限', x: -1.5, y: 1.5 },
    { nm: '③ 第三象限', x: -1.5, y: -1 },
    { nm: '④ 第四象限', x: 2, y: -1.5 },
  ];
  const m = B.isoFit(-4.4, 4.4, -3.3, 3.3, [44, 30, 780, 390], 10);
  const cP = B.chipM('极坐标'), cC = B.chipM('直角坐标'), cF = B.chipM('互化'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const P = V(m.px(st.x), m.py(st.y));
    const r = Math.hypot(st.x, st.y);
    let d = Math.atan2(st.y, st.x) * 180 / Math.PI;
    if (d < 0) d += 360;
    const deg = r < 1e-9 ? 0 : Math.round(d) % 360;
    const th = deg * Math.PI / 180;

    // 极坐标参考：极轴、同心圆与等分射线
    if (st.grid) {
      for (let rr = 1; rr <= 3; rr++) {
        const N = 64;
        for (let i = 0; i < N; i++) {
          const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
          B.seg(V(O.x + rr * m.s * Math.cos(a1), O.y - rr * m.s * Math.sin(a1)),
            V(O.x + rr * m.s * Math.cos(a2), O.y - rr * m.s * Math.sin(a2)),
            { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .16 });
        }
      }
      for (let a = 30; a < 360; a += 30) {
        const rad = a * Math.PI / 180;
        B.seg(O, V(O.x + 4.2 * m.s * Math.cos(rad), O.y - 4.2 * m.s * Math.sin(rad)),
          { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .12 });
      }
    }
    // 到两轴的投影
    B.seg(P, V(m.px(st.x), m.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .75 });
    B.seg(P, V(m.px(0), m.py(st.y)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .75 });
    // 极角弧
    if (r > 1e-9 && deg > 0.5) {
      // 弧半径取定值：P 滑动时只改张角，弧不长不短
      const ar = 46, K = 34;
      for (let i = 0; i < K; i++) {
        const a1 = th * i / K, a2 = th * (i + 1) / K;
        B.seg(V(O.x + ar * Math.cos(a1), O.y - ar * Math.sin(a1)),
          V(O.x + ar * Math.cos(a2), O.y - ar * Math.sin(a2)),
          { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-opacity': .9 });
      }
      const am = th / 2;
      B.tex(V(O.x + (ar + 20) * Math.cos(am), O.y - (ar + 20) * Math.sin(am)),
        `$\\theta=${deg}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 90 });
    }
    // 向量 OP
    if (r > 1e-9) B.arrow(O, P, { stroke: '#ffd166', 'stroke-width': 2.6, head: 13, wide: 6 });
    B.dot(O, 3.6, { fill: '#12161f' });
    B.dot(P, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(P.x + 10, P.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });

    // 徽章
    cP(`$(\\rho,\\theta)=(${fmt(r, 2)},\\ ${deg}^\\circ)$`);
    cC(`$(x,y)=(${fmt(st.x, 2)},\\ ${fmt(st.y, 2)})$`);
    cF(`$x=\\rho\\cos\\theta=${fmt(r, 2)}\\times${fz(Math.cos(th))}=${fz(st.x)},\\quad y=\\rho\\sin\\theta=${fmt(r, 2)}\\times${fz(Math.sin(th))}=${fz(st.y)}$`);
    cJ(r < 1e-9 ? '原点即极点：ρ=0，θ 可取任意角'
      : st.x > 0 && st.y > 0 ? '第一象限：x>0、y>0，θ=arctan(y/x) 直接得到'
        : st.x < 0 && st.y > 0 ? '第二象限：x<0、y>0，θ=180°−arctan(|y|/|x|)'
          : st.x < 0 && st.y < 0 ? '第三象限：x<0、y<0，θ=180°+arctan(|y|/|x|)'
            : st.x > 0 && st.y < 0 ? '第四象限：x>0、y<0，θ=360°−arctan(|y|/|x|)'
              : st.y > 0 ? 'x=0、y>0：θ=90°，tanθ 无意义'
                : st.y < 0 ? 'x=0、y<0：θ=270°，tanθ 无意义'
                  : st.x > 0 ? 'y=0、x>0：θ=0°，点在极轴上' : 'y=0、x<0：θ=180°，点在极轴反向延长线上');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#ffd166', r: 7,
    get: () => V(m.px(st.x), m.py(st.y)),
    set: p => { st.x = cl((p.x - m.px(0)) / m.s); st.y = cl((m.py(0) - p.y) / m.s); },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.x = p.x; st.y = p.y;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动 P：极坐标与直角坐标同时改，横纵虚线就是余弦与正弦两条投影');
  B.render();
  return B;
}
