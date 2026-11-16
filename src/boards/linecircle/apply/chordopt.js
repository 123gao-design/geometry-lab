/* 图 综2b · 过定点的弦长最值
   圆 O 半径为 r，P 是圆内一定点，过 P 的直线与圆交于 A、B。
   弦长 |AB|=2√(r²−d²)，d 是圆心到直线的距离：d 最大（直线垂直于 OP）时弦最短，
   d=0（直线过圆心）时弦最长，等于直径。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { r: 2, px: 1, py: 0.8, th: 0, grid: true, labs: true };
  const m = B.isoFit(-5.2, 5.2, -3, 3, [44, 28, 760, 392], 10);
  const cD = B.chipM('弦心距'), cC = B.chipM('弦长'), cX = B.chipM('最值'), cR = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const P2 = (x, y) => V(m.px(x), m.py(y));
  const circle = (r, color) => {
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(P2(r * Math.cos(a1), r * Math.sin(a1)), P2(r * Math.cos(a2), r * Math.sin(a2)),
        { stroke: color, 'stroke-width': 2.3, 'stroke-opacity': .95 });
    }
  };
  const data = () => {
    const th = st.th * Math.PI / 180;
    const ux = Math.cos(th), uy = Math.sin(th);
    const c = st.px * ux + st.py * uy;
    const disc = st.r * st.r - st.px * st.px - st.py * st.py + c * c;
    if (disc <= 0) return { ok: false };
    const h = Math.sqrt(disc);
    const A = V(st.px + (c + h) * ux, st.py + (c + h) * uy);
    const Bq = V(st.px + (c - h) * ux, st.py + (c - h) * uy);
    const d = Math.abs(-st.px * uy + st.py * ux);
    return { ok: true, A, B: Bq, d, len: 2 * h };
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    circle(st.r, '#ffd166');
    B.dot(P2(0, 0), 4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(P2(0, 0).x + 5, P2(0, 0).y - 9), 'O', { 'font-size': 12.5, 'font-weight': 700, fill: '#ffd166' });
    const Pp = P2(st.px, st.py);
    const q = data();
    if (!q.ok) {
      cD('—'); cC('直线与圆没有公共点'); cX('—'); cR('把 P 拖回圆内', 'warn');
      B.dot(Pp, 5.5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1 });
      return;
    }
    const { A, B: Bq, d, len } = q;
    B.seg(P2(A.x, A.y), P2(Bq.x, Bq.y), { stroke: '#ff9e4a', 'stroke-width': 3.2, 'stroke-opacity': .95 });
    B.dot(P2(A.x, A.y), 4.5, { fill: '#ff9e4a' });
    B.dot(P2(Bq.x, Bq.y), 4.5, { fill: '#ff9e4a' });
    B.text(V(P2(A.x, A.y).x + 12, P2(A.x, A.y).y + 4), 'A', { 'font-size': 12.5, 'font-weight': 700, fill: '#ff9e4a' });
    B.text(V(P2(Bq.x, Bq.y).x - 12, P2(Bq.x, Bq.y).y + 4), 'B', { 'font-size': 12.5, 'font-weight': 700, fill: '#ff9e4a' });

    // 垂足 H 与弦心距 OH
    const th = st.th * Math.PI / 180, ux = Math.cos(th), uy = Math.sin(th);
    const t = -(st.px * ux + st.py * uy);
    const H = V(st.px + t * ux, st.py + t * uy);
    B.seg(P2(0, 0), P2(H.x, H.y), { stroke: '#5cadff', 'stroke-width': 2, 'stroke-dasharray': '5 4', 'stroke-opacity': .95 });
    B.dot(P2(H.x, H.y), 4, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    const Hp = P2(H.x, H.y), Op = P2(0, 0);
    const u1x = Op.x - Hp.x, u1y = Op.y - Hp.y, L1 = Math.hypot(u1x, u1y) || 1;
    const u2x = Pp.x - Hp.x, u2y = Pp.y - Hp.y, L2 = Math.hypot(u2x, u2y) || 1;
    const s = 9;
    const k1 = V(Hp.x + s * u1x / L1, Hp.y + s * u1y / L1), k2 = V(Hp.x + s * u2x / L2, Hp.y + s * u2y / L2);
    B.seg(k1, V(k1.x + k2.x - Hp.x, k1.y + k2.y - Hp.y), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-opacity': .95 });
    B.seg(k2, V(k1.x + k2.x - Hp.x, k1.y + k2.y - Hp.y), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-opacity': .95 });

    B.dot(Pp, 5.5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(Pp.x + 11, Pp.y - 9), 'P', { 'font-size': 12.5, 'font-weight': 700, fill: '#7ee787' });

    const op = Math.hypot(st.px, st.py);
    cD(`$OH=d=${fz(d)}$`);
    cC(`$|AB|=2\\sqrt{r^2-d^2}=${fz(len)}$`);
    cX(`最短 $${fz(2 * Math.sqrt(Math.max(0, st.r * st.r - op * op)))}$，最长 $${fz(2 * st.r)}$`);
    if (Math.abs(d - op) < .04) cR('直线垂直于 OP，弦心距取到最大，弦最短', 'ok');
    else if (d < .04) cR('直线过圆心，弦心距为 0，弦最长即直径', 'ok');
    else cR(`弦心距 ${fz(d)} 界于 0 与 ${fz(op)} 之间，弦长随之变化`);
  };

  const shortTh = () => {
    const a = Math.atan2(st.py, st.px) * 180 / Math.PI + 90;
    return ((a % 180) + 180) % 180;
  };
  const longTh = () => ((Math.atan2(st.py, st.px) * 180 / Math.PI % 180) + 180) % 180;
  const PRE = [
    { nm: '① 一般', v: [2, 1, 0.8, 0] },
    { nm: '② 最短弦', v: [2, 1, 0.8, null] },
    { nm: '③ 最长弦', v: [2, 1, 0.8, null] },
  ];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.r, st.px, st.py] = o.v;
    st.th = i === 1 ? shortTh() : i === 2 ? longTh() : 0;
    sR.sync(st.r); sT.sync(st.th);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.handle({
    color: '#7ee787', r: 7, label: 'P', lo: [9, -9],
    get: () => P2(st.px, st.py),
    set: p => {
      let x = (p.x - m.px(0)) / m.s, y = (m.py(0) - p.y) / m.s;
      const L = Math.hypot(x, y), lim = Math.max(0, st.r - .35);
      if (L > lim) { x = lim * x / L; y = lim * y / L; }
      st.px = x; st.py = y;
    },
  });

  const sR = B.slider('半径 r', 1, 2.6, 0.1, st.r, v => {
    st.r = v;
    const L = Math.hypot(st.px, st.py), lim = Math.max(0, v - .35);
    if (L > lim) { st.px = lim * st.px / (L || 1); st.py = lim * st.py / (L || 1); }
    B.render();
  }, 'r');
  const sT = B.slider('方向角 θ', 0, 180, 1, st.th, v => { st.th = v; B.render(); }, 'th');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 P 换定点、拖 θ 转直线：蓝色弦心距最长时弦最短');
  B.render();
  return B;
}
