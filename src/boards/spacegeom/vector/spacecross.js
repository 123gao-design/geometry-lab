/* 图 向3 · 空间向量的向量积机
   a 沿 x 轴、b 由夹角 θ 与方位 φ 给出，c = a×b 垂直于 a、b 张成的平面，模等于平行四边形的面积。
   板内画平行四边形（半透明）、两条直角标记（c⊥a、c⊥b）与一条从 b 到 a 的高线，
   右栏并列面积式 |a×b| = |a||b|sinθ 与坐标式。
   版面：三维图区整幅，右端 700 起放式子。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, add3, mul3, sub3, unit3, len3, makeCam, Scene, arrow3, arc3, rightMark3, orbit } from '../../../lib/solid3d.js';

const L = 3.0;

export function createBoard(root) {
  const W = 880, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 250, s: 72 });
  const st = { la: 2.2, lb: 1.9, th: 62, ph: 0 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cS = B.chipM('面积'), cC = B.chipM('向量积 c'), cT = B.chipM('夹角'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.3), to, { stroke: col, w: 1, op: 0.65 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.4, op: 0.7 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, len = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / len * 14, dy: dy / len * 14 + 4, size: 13, fill: col });
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const th = st.th * Math.PI / 180, ph = st.ph * Math.PI / 180;
    const a = v3(st.la, 0, 0);
    const b = v3(st.lb * Math.cos(th), st.lb * Math.sin(th) * Math.cos(ph), st.lb * Math.sin(th) * Math.sin(ph));
    const c = v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    const area = len3(c);

    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');

    // 平行四边形 O, a, a+b, b
    cs.poly([v3(0, 0, 0), a, add3(a, b), b], { fill: '#4ade80', op: 0.14, stroke: '#4ade80', w: 1.4, lineOp: 0.65, dash: '5 4' });
    const da = arrow3(cs, v3(0, 0, 0), a, { stroke: '#ffd166', w: 2.4 });
    const db = arrow3(cs, v3(0, 0, 0), b, { stroke: '#5cadff', w: 2.4 });
    cs.label(a, 'a', { dx: da.ux * 19, dy: da.uy * 19 + 5, size: 15, fill: '#ffd166' });
    cs.label(b, 'b', { dx: db.ux * 19, dy: db.uy * 19 + 5, size: 15, fill: '#5cadff' });

    // c：方向给单位向量，长度画成 1.7 便于观察，真实模写在徽章里
    const tip = mul3(unit3(c), 1.75);
    if (area > 1e-6) {
      const dc = arrow3(cs, v3(0, 0, 0), tip, { stroke: '#c084fc', w: 2.6 });
      cs.label(tip, 'c', { dx: dc.ux * 19, dy: dc.uy * 19 + 5, size: 15, fill: '#c084fc' });
      rightMark3(cs, v3(0, 0, 0), a, tip, 0.2, { stroke: '#c084fc' });
      rightMark3(cs, v3(0, 0, 0), b, tip, 0.2, { stroke: '#c084fc' });
      // 从 b 的末端向 a 所在直线作高（平行四边形的高的长度 = |b|sinθ）
      const foot = mul3(unit3(a), st.lb * Math.cos(th));
      cs.line(b, foot, { stroke: '#ff9e4a', w: 1.2, op: 0.9, dash: '4 4' });
      rightMark3(cs, foot, v3(0, 0, 0), b, 0.15, { stroke: '#ff9e4a' });
    }
    arc3(cs, v3(0, 0, 0), a, b, 0.55, { stroke: '#ff9e4a', w: 1.6 });

    cS(`$=${fz(area)}$`);
    cC(`$(${fz(c.x)},\\ ${fz(c.y)},\\ ${fz(c.z)})$`);
    cT(`$=${fmt(st.th, 0)}^{\\circ}$`);
    const h = st.lb * Math.sin(th);
    if (area < 0.05) cJ('两向量共线：平行四边形压成一条线，向量积为零向量', 'warn');
    else cJ(`高 = |b|sinθ = ${fz(h)}：底乘高正是 |a×b|`, 'ok');
    cs.flush();
  };

  const presets = [
    { la: 2.2, lb: 1.9, th: 62, ph: 0, nm: '① 一般位置' },
    { la: 2.2, lb: 1.9, th: 90, ph: 0, nm: '② 直角' },
    { la: 2.2, lb: 1.9, th: 0, ph: 0, nm: '③ 共线' },
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
  B.hint('拖动画面：紫色 c 与 a、b 各成直角，模就是绿色平行四边形的面积');
  apply(presets[0], 0);
  return B;
}
