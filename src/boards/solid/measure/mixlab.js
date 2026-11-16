/* 图 积3 · 组合体与外接球内切球机
   三档：① 正方体挖去内切球 ② 长方体的外接球 ③ 正四面体的内切球与外接球。
   组合体按「大体积减小体积、外表面加内表面」合并；球半径由棱或面对称性给出。
   各面按面分色、半透明，球用正交投影下的正圆加三条大圆表示，拖动画面可旋转视角。 */
import { Board } from '../../../lib/board.js';
import { v3, add3, mul3, makeCam, Scene, circle3, orbit, FACE_COLORS } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 214, s: 95 });
  const st = { mode: 0, a: 2.0, b: 1.6, c: 1.2, t: 2.0 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('体积 V'), cB = B.chipM('表面积 S'), cC = B.chipM('外接球 R'), cD = B.chipM('内切球 r');

  /* 正交投影下球的外轮廓正好是半径 R·s 的圆，再补三条大圆显出立体感 */
  const ball = (cs, R, col, op) => {
    const o = v3(0, 0, 0);
    cs.dot(o, R * cam.s, { fill: col, op, stroke: col, w: 1.2 });
    cs.path(circle3(o, v3(1, 0, 0), v3(0, 1, 0), R), { stroke: col, w: 1.0, op: 0.45 });
    cs.path(circle3(o, v3(0, 1, 0), v3(0, 0, 1), R), { stroke: col, w: 1.0, op: 0.45 });
    cs.path(circle3(o, v3(0, 0, 1), v3(1, 0, 0), R), { stroke: col, w: 1.0, op: 0.45 });
  };

  /* 长方体：八个顶点、六个面 */
  const boxOf = (ax, by, cz) => {
    const vs = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) vs.push(v3(sx * ax, sy * by, sz * cz));
    // 索引按 (x,y,z) 三位二进制排：bit2 管 x、bit1 管 y、bit0 管 z
    const fs = [
      [0, 4, 6, 2], [1, 5, 7, 3],   // z 下、上
      [0, 1, 5, 4], [2, 3, 7, 6],   // y 下、上
      [0, 1, 3, 2], [4, 5, 7, 6],   // x 下、上
    ];
    return { vs, fs };
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0;

    if (st.mode === 1) {
      const { vs, fs } = boxOf(st.a / 2, st.b / 2, st.c / 2);
      const R = Math.hypot(st.a, st.b, st.c) / 2;
      ball(cs, R, '#5cadff', 0.07);
      fs.forEach((f, i) => {
        const col = FACE_COLORS[i % FACE_COLORS.length];
        cs.poly(f.map(ix => vs[ix]), { fill: col, op: 0.12, stroke: col, w: 1.1, lineOp: 0.5 });
      });
      cs.line(vs[0], vs[7], { stroke: '#ffd166', w: 1.8, op: 0.95 });
      cs.label(mul3(add3(vs[0], vs[7]), 0.5), 'd', { dx: 0, dy: 16, size: 13, fill: '#ffd166' });
      cA(`$${fz(st.a * st.b * st.c)}$`);
      cB(`$${fz(2 * (st.a * st.b + st.b * st.c + st.c * st.a))}$`);
      cC(`$${fz(R)}$`);
      cD('—');
    } else if (st.mode === 2) {
      const k = st.t / (2 * Math.SQRT2);
      const vs = [v3(k, k, k), v3(k, -k, -k), v3(-k, k, -k), v3(-k, -k, k)];
      const fs = [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]];
      const R = Math.sqrt(3) * k, r = k / Math.sqrt(3);
      ball(cs, R, '#5cadff', 0.06);
      ball(cs, r, '#ff9e4a', 0.1);
      fs.forEach((f, i) => {
        const col = FACE_COLORS[i % FACE_COLORS.length];
        cs.poly(f.map(ix => vs[ix]), { fill: col, op: 0.16, stroke: col, w: 1.2, lineOp: 0.55 });
      });
      cs.dot(v3(0, 0, 0), 3.4, { fill: '#fff' });
      cs.line(v3(0, 0, 0), vs[0], { stroke: '#5cadff', w: 1.2, op: 0.85, dash: '6 5' });
      cA(`$${fz(Math.SQRT2 * st.t ** 3 / 12)}$`);
      cB(`$${fz(Math.sqrt(3) * st.t ** 2)}$`);
      cC(`$${fz(R)}$`);
      cD(`$${fz(r)}$`);
    } else {
      const h = st.a / 2;
      const { vs, fs } = boxOf(h, h, h);
      ball(cs, h, '#ff9e4a', 0.1);
      fs.forEach((f, i) => {
        const col = FACE_COLORS[i % FACE_COLORS.length];
        cs.poly(f.map(ix => vs[ix]), { fill: col, op: 0.11, stroke: col, w: 1.1, lineOp: 0.45 });
      });
      cA(`$${fz(st.a ** 3 * (1 - Math.PI / 6))}$`);
      cB(`$${fz(6 * st.a * st.a + Math.PI * st.a * st.a)}$`);
      cC(`$${fz(Math.sqrt(3) * st.a / 2)}$`);
      cD(`$${fz(h)}$`);
    }

    cs.flush();
  };

  const btns = ['① 正方体挖球', '② 长方体外接球', '③ 正四面体两球'].map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  let sA, sB, sC, sH, sT;
  const par = e => e && (e.parentNode || e.parent);
  const show = (el, on) => { if (par(el)) par(el).style.display = on ? '' : 'none'; };
  const setMode = i => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    show(sA, i === 0);
    show(sB, i === 1);
    show(sC, i === 1);
    show(sH, i === 1);
    show(sT, i === 2);
    B.render();
  };
  sA = B.slider('棱长 a', 1.2, 2.6, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  sB = B.slider('长 a', 1.4, 3.0, 0.05, st.a, v => { st.a = v; B.render(); }, 'a2');
  sC = B.slider('宽 b', 1.0, 2.4, 0.05, st.b, v => { st.b = v; B.render(); }, 'b');
  sH = B.slider('高 c', 0.6, 2.0, 0.05, st.c, v => { st.c = v; B.render(); }, 'c');
  sT = B.slider('棱长 a', 1.4, 3.2, 0.05, st.t, v => { st.t = v; B.render(); }, 't');
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，球与面、棱的切接关系看得清楚');
  setMode(0);
  return B;
}
