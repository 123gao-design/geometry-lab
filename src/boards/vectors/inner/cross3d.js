/* 图 积4b · 向量积的几何意义（三维）
   平面内两支向量 a、b 张成平行四边形，a×b 垂直于这两支向量所在的平面，
   指向由右手定则给出；模 |a×b| = |a||b|sinθ 正是平行四边形的面积。
   拖动 a、b 的端点：两支共线时 a×b 缩为零向量，转向反过来时箭头翻到平面另一侧。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, view, arrow3, rightMark3, arc3, add3, mul3, unit3 } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 250, s: 98, cz: 0.6, yaw: 0.85, pitch: 0.42 });
  const st = { ax: 1.3, ay: 0.3, bx: 0.3, by: 1.35 };
  const PRE = [
    { nm: '① 一般位置', a: [1.3, 0.3], b: [0.3, 1.35] },
    { nm: '② 互相垂直', a: [1.3, 0], b: [0, 1.3] },
    { nm: '③ 共线', a: [1.2, 0.6], b: [0.8, 0.4] },
  ];
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('向量积'), cB = B.chipM('面积'), cC = B.chipM('夹角'), cD = B.chipM('判读');

  const O = v3(0, 0, 0);
  const av = () => v3(st.ax, st.ay, 0);
  const bv = () => v3(st.bx, st.by, 0);

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const a = av(), b = bv();
    const det = st.ax * st.by - st.ay * st.bx;       // a×b 的 z 分量
    const c = v3(0, 0, det);
    const area = Math.abs(det);
    const la = Math.hypot(st.ax, st.ay), lb = Math.hypot(st.bx, st.by);
    const sin = la > 1e-9 && lb > 1e-9 ? Math.min(1, area / (la * lb)) : 0;
    const ang = Math.asin(sin) * 180 / Math.PI;

    // 平面 α：一块淡色底板，给平行四边形一个落处
    cs.poly([v3(-2, -2, 0), v3(2, -2, 0), v3(2, 2, 0), v3(-2, 2, 0)],
      { fill: '#5cadff', op: 0.05, stroke: '#5cadff', w: 1.1, lineOp: 0.3 });

    // 平行四边形
    if (area > 1e-6) {
      cs.poly([O, a, add3(a, b), b], { fill: '#5cadff', op: 0.17, stroke: '#5cadff', w: 1.2, lineOp: 0.6 });
    } else {
      cs.line(O, a, { stroke: '#ffd166', w: 2.2, op: 0.8 });
    }

    // 两支向量
    arrow3(cs, O, a, { stroke: '#5cadff', w: 2.4, op: 1 });
    arrow3(cs, O, b, { stroke: '#ff9e4a', w: 2.4, op: 1 });
    cs.label(a, 'a', { dx: 12, dy: 6, size: 14, fill: '#5cadff' });
    cs.label(b, 'b', { dx: 12, dy: -6, size: 14, fill: '#ff9e4a' });
    cs.label(O, 'O', { dx: -13, dy: 14, size: 13, fill: '#8fa3bd' });

    // 夹角 θ
    if (!(la < 1e-9 || lb < 1e-9) && area > 1e-6) {
      arc3(cs, O, a, b, 0.5, { stroke: '#67e8f9', w: 1.6, op: .95 });
      const md = unit3(add3(unit3(a), unit3(b)));
      cs.label(mul3(md, 0.68), 'θ', { dx: 0, dy: 0, size: 13, fill: '#67e8f9' });
    }

    // 向量积：垂直于 a、b 所在平面，符号决定朝上还是朝下
    let cLab = null;
    if (area > 0.04) {
      arrow3(cs, O, c, { stroke: '#ffd166', w: 2.8, op: 1 });
      rightMark3(cs, O, c, a, 0.2, { stroke: '#ffd166', w: 1.4, op: .9 });
      rightMark3(cs, O, c, b, 0.2, { stroke: '#ffd166', w: 1.4, op: .9 });
      const qc = view(c, cam);
      cLab = { x: qc.x + 17, y: qc.y + (det > 0 ? -8 : 20) };
    }

    cA(`$\\vec a\\times\\vec b=(0,\\ 0,\\ ${fz(det)})$`);
    cB(`$|\\vec a||\\vec b|\\sin\\theta=${fz(la)}\\times${fz(lb)}\\times${fz(sin)}=${fz(area)}$`);
    cC(`$\\theta=${fz(ang)}^\\circ$`);
    cD(la < 1e-9 || lb < 1e-9 ? '含零向量：向量积为零向量'
      : area < 0.02 ? 'a 与 b 共线：向量积缩成零向量，平行四边形退化'
        : det > 0 ? 'a 逆时针转向 b：a×b 朝上，模等于平行四边形面积'
          : 'a 顺时针转向 b：a×b 朝下，模仍等于平行四边形面积');
    cs.flush();
    // 公式标签排在 flush 之后，压在全部三维图元之上
    if (cLab) B.tex(cLab, '$\\vec a\\times\\vec b$', { size: 13.5, anchor: 'start', color: '#ffd166', w: 78 });
  };

  // a、b 的端点限制在水平面 z=0 内拖动：用 view 推出的两个屏幕基向量反解 Δx、Δy
  const dragEnd = (key) => p => {
    const cur = key === 'a' ? av() : bv();
    const q = view(cur, cam);
    const sa = Math.sin(cam.yaw), ca = Math.cos(cam.yaw), sb = Math.sin(cam.pitch);
    const ex = { x: -cam.s * sa, y: cam.s * ca * sb };
    const ey = { x: cam.s * ca, y: cam.s * sa * sb };
    const det = ex.x * ey.y - ey.x * ex.y;
    if (Math.abs(det) < 1e-6) return;
    const du = p.x - q.x, dv = p.y - q.y;
    let x = cur.x + (du * ey.y - dv * ey.x) / det;
    let y = cur.y + (ex.x * dv - ex.y * du) / det;
    const L = Math.hypot(x, y);
    if (L < 1e-6) return;
    const k = Math.min(1.4, Math.max(0.55, L)) / L;
    x *= k; y *= k;
    if (key === 'a') { st.ax = x; st.ay = y; } else { st.bx = x; st.by = y; }
  };
  B.handle({ color: '#5cadff', r: 7, get: () => { const q = view(av(), cam); return { x: q.x, y: q.y }; }, set: dragEnd('a') });
  B.handle({ color: '#ff9e4a', r: 7, get: () => { const q = view(bv(), cam); return { x: q.x, y: q.y }; }, set: dragEnd('b') });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.ax, st.ay] = p.a; [st.bx, st.by] = p.b;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.btn('重置视角', () => { cam.yaw = 0.85; cam.pitch = 0.42; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动 a、b 的端点：a×b 垂直于两支向量，模即平行四边形面积');
  B.render();
  return B;
}
