/* 图 向4 · 混合积与平行六面体机
   底面由 a（沿 x 轴）与 b（在 xOy 平面内、与 a 成 φ 角）张成，第三条棱 c 由倾角 θ 与高 h 给出。
   三向量张成的平行六面体画成六个半透明面，体积 = 底面积 × 高 = |(a×b)·c|；
   把 θ 推到 90°，c 落进底面，混合积为零、体积塌成零——三向量共面。
   版面：三维图区整幅，右端 700 起放式子。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, add3, mul3, makeCam, Scene, arrow3, orbit } from '../../../lib/solid3d.js';

const L = 3.0;

export function createBoard(root) {
  const W = 880, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 250, s: 68 });
  const st = { lb: 1.9, ph: 62, h: 1.8, th: 18, la: 2.2 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cM = B.chipM('混合积'), cV = B.chipM('体积'), cB = B.chipM('底面积'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.3), to, { stroke: col, w: 1, op: 0.6 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.3, op: 0.65 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, len = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / len * 14, dy: dy / len * 14 + 4, size: 13, fill: col });
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const ph = st.ph * Math.PI / 180, th = st.th * Math.PI / 180;
    const a = v3(st.la, 0, 0);
    const b = v3(st.lb * Math.cos(ph), st.lb * Math.sin(ph), 0);
    const c = v3(st.h * Math.sin(th), 0, st.h * Math.cos(th));

    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');

    const O = v3(0, 0, 0);
    const P = [O, a, add3(a, b), b];
    const Q = P.map(p => add3(p, c));
    const faces = [
      [P[0], P[1], P[2], P[3]],
      [Q[0], Q[1], Q[2], Q[3]],
      [P[0], P[1], Q[1], Q[0]],
      [P[1], P[2], Q[2], Q[1]],
      [P[2], P[3], Q[3], Q[2]],
      [P[3], P[0], Q[0], Q[3]],
    ];
    const cols = ['#5cadff', '#4ade80', '#ffd166', '#c084fc', '#ff9e4a', '#67e8f9'];
    faces.forEach((f, i) => cs.poly(f, { fill: cols[i], op: 0.1, stroke: cols[i], w: 1.2, lineOp: 0.55 }));

    const da = arrow3(cs, O, a, { stroke: '#ffd166', w: 2.4 });
    const db = arrow3(cs, O, b, { stroke: '#5cadff', w: 2.4 });
    const dc = arrow3(cs, O, c, { stroke: '#c084fc', w: 2.4 });
    cs.label(a, 'a', { dx: da.ux * 19, dy: da.uy * 19 + 5, size: 15, fill: '#ffd166' });
    cs.label(b, 'b', { dx: db.ux * 19, dy: db.uy * 19 + 5, size: 15, fill: '#5cadff' });
    cs.label(c, 'c', { dx: dc.ux * 19, dy: dc.uy * 19 + 5, size: 15, fill: '#c084fc' });
    cs.label(O, 'O', { dx: -13, dy: 14, size: 13, fill: '#8fa3bd' });

    const ab = v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    const mixed = ab.x * c.x + ab.y * c.y + ab.z * c.z;
    const baseArea = Math.hypot(ab.x, ab.y, ab.z);
    const vol = Math.abs(mixed);

    cM(`$=${fz(mixed)}$`);
    cV(`$=${fz(vol)}$`);
    cB(`$=${fz(baseArea)}$`);
    if (Math.abs(mixed) < 0.04) cJ('c 落进底面：三向量共面，平行六面体压成一个平面', 'warn');
    else cJ(mixed > 0 ? 'c 与 a×b 同侧：混合积为正，体积取它的绝对值' : 'c 与 a×b 在底面两侧：混合积为负，体积仍取绝对值', 'ok');
    cs.flush();
  };

  const presets = [
    { lb: 1.9, ph: 62, h: 1.8, th: 18, nm: '① 一般六面体' },
    { lb: 1.9, ph: 90, h: 2.0, th: 0, nm: '② 斜棱柱' },
    { lb: 1.9, ph: 62, h: 1.8, th: 90, nm: '③ 共面' },
  ];
  let sB, sP, sH, sT;
  const btns = presets.map((p, i) => B.btn(p.nm, () => apply(p, i), { on: i === 0 }));
  const apply = (p, i) => {
    Object.assign(st, { lb: p.lb, ph: p.ph, h: p.h, th: p.th });
    if (sB) sB.sync(p.lb);
    if (sP) sP.sync(p.ph);
    if (sH) sH.sync(p.h);
    if (sT) sT.sync(p.th);
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    B.render();
  };
  sB = B.slider('底面边 b', 1.0, 2.6, 0.05, st.lb, v => { st.lb = v; B.render(); }, 'lb');
  sP = B.slider('底面夹角 φ°', 25, 150, 1, st.ph, v => { st.ph = v; B.render(); }, 'ph');
  sH = B.slider('棱长 |c|', 0.6, 2.6, 0.05, st.h, v => { st.h = v; B.render(); }, 'hc');
  sT = B.slider('c 的倾角 θ°', 0, 90, 1, st.th, v => { st.th = v; B.render(); }, 'th');

  orbit(B, cam, () => B.render());
  B.hint('把 θ 推到 90°，体积与混合积一起归零');
  apply(presets[0], 0);
  return B;
}
