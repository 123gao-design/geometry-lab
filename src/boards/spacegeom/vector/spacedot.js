/* 图 向2 · 空间向量的数量积机
   a 沿 x 轴，b 由「与 a 的夹角 θ」与「绕 a 的方位角 φ」两个滑块给出：
   b = |b|(cosθ, sinθcosφ, sinθsinφ)。橙色弧标夹角，紫色虚线是 b 在 a 方向上的投影，
   垂足 Q 处画直角。数量积两种算法并列：|a||b|cosθ 与 x₁x₂+y₁y₂+z₁z₂。
   版面：三维图区整幅，右端 700 起放三行式子。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, add3, mul3, unit3, makeCam, Scene, arrow3, arc3, rightMark3, orbit } from '../../../lib/solid3d.js';

const L = 3.0;

export function createBoard(root) {
  const W = 880, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 250, s: 74 });
  const st = { la: 2.2, lb: 2.0, th: 55, ph: 0 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cD = B.chipM('数量积'), cC = B.chipM('余弦'), cP = B.chipM('投影'), cJ = B.chipM('判读');
  const vecOf = () => {
    const th = st.th * Math.PI / 180, ph = st.ph * Math.PI / 180;
    return {
      a: v3(st.la, 0, 0),
      b: v3(st.lb * Math.cos(th), st.lb * Math.sin(th) * Math.cos(ph), st.lb * Math.sin(th) * Math.sin(ph)),
      th, ph,
    };
  };

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.3), to, { stroke: col, w: 1, op: 0.7 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.5, op: 0.75 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, len = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / len * 14, dy: dy / len * 14 + 4, size: 13, fill: col });
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const { a, b, th } = vecOf();
    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');

    const da = arrow3(cs, v3(0, 0, 0), a, { stroke: '#ffd166', w: 2.6 });
    const db = arrow3(cs, v3(0, 0, 0), b, { stroke: '#5cadff', w: 2.6 });
    cs.label(a, 'a', { dx: da.ux * 20, dy: da.uy * 20 + 5, size: 15, fill: '#ffd166' });
    cs.label(b, 'b', { dx: db.ux * 20, dy: db.uy * 20 + 5, size: 15, fill: '#5cadff' });

    // b 在 a 方向上的投影：垂足 Q = (|b|cosθ, 0, 0)
    const Q = v3(st.lb * Math.cos(th), 0, 0);
    cs.line(b, Q, { stroke: '#c084fc', w: 1.2, op: 0.9, dash: '4 4' });
    rightMark3(cs, Q, v3(0, 0, 0), b, 0.16, { stroke: '#c084fc' });
    cs.dot(Q, 3.6, { fill: '#c084fc' });
    cs.line(v3(0, 0, 0), Q, { stroke: '#c084fc', w: 3.4, op: 0.55 });

    arc3(cs, v3(0, 0, 0), a, b, 0.62, { stroke: '#ff9e4a', w: 1.8 });
    const bis = unit3(add3(unit3(a), unit3(b)));
    cs.label(mul3(bis, 0.92), 'θ', { dx: 0, dy: 5, size: 14, fill: '#ff9e4a' });

    const dot = a.x * b.x + a.y * b.y + a.z * b.z;
    const cs2 = Math.cos(th);
    const proj = st.lb * Math.cos(th);
    cD(`$=${fz(dot)}$`);
    cC(`$\\cos\\theta=${fz(cs2)}$`);
    cP(`$|b|\\cos\\theta=${fz(proj)}$`);
    if (Math.abs(cs2) < 0.04) cJ('夹角为直角：数量积为零，投影缩成一个点', 'ok');
    else if (cs2 < 0) cJ('夹角为钝角：投影落在反方向上，数量积取负', 'warn');
    else cJ('夹角为锐角：投影与 a 同向，数量积为正', 'ok');
    cs.flush();
  };

  const presets = [
    { la: 2.2, lb: 2.0, th: 55, ph: 0, nm: '① 锐角' },
    { la: 2.2, lb: 2.0, th: 90, ph: 0, nm: '② 直角' },
    { la: 2.2, lb: 2.0, th: 128, ph: 40, nm: '③ 钝角' },
  ];
  let sA, sB, sT, sP;
  const btns = presets.map((p, i) => B.btn(p.nm, () => apply(p, i), { on: i === 0 }));
  const apply = (p, i) => {
    Object.assign(st, { la: p.la, lb: p.lb, th: p.th, ph: p.ph });
    if (sA) sA.sync(p.la);
    if (sB) sB.sync(p.lb);
    if (sT) sT.sync(p.th);
    if (sP) sP.sync(p.ph);
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    B.render();
  };
  sA = B.slider('|a|', 0.8, 2.8, 0.05, st.la, v => { st.la = v; B.render(); }, 'la');
  sB = B.slider('|b|', 0.8, 2.8, 0.05, st.lb, v => { st.lb = v; B.render(); }, 'lb');
  sT = B.slider('夹角 θ°', 0, 180, 1, st.th, v => { st.th = v; B.render(); }, 'th');
  sP = B.slider('方位 φ°', 0, 330, 5, st.ph, v => { st.ph = v; B.render(); }, 'ph');

  orbit(B, cam, () => B.render());
  B.hint('θ 推到 90°：紫色投影缩成一点、数量积归零');
  apply(presets[0], 0);
  return B;
}
