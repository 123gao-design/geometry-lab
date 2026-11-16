import { Board, V, mk } from '../../../lib/board.js';

/* 科赫曲线：每段三等分，中间一段折成等边三角形的两条边。
   曲线模式从单位线段长起；雪花模式把三条科赫曲线首尾接成闭曲线（顶点按顺时针排，折角朝外）。 */
function kochSeg(a, b, sign) {
  const dx = (b.x - a.x) / 3, dy = (b.y - a.y) / 3;
  const c = Math.cos(Math.PI / 3), s = sign * Math.sin(Math.PI / 3);
  const p1 = V(a.x + dx, a.y + dy), p3 = V(a.x + 2 * dx, a.y + 2 * dy);
  const p2 = V(p1.x + dx * c - dy * s, p1.y + dx * s + dy * c);
  return [p1, p2, p3, b];
}
function buildKoch(pts, n, sign) {
  let cur = pts;
  for (let l = 0; l < n; l++) {
    const out = [cur[0]];
    for (let i = 0; i < cur.length - 1; i++) out.push(...kochSeg(cur[i], cur[i + 1], sign));
    cur = out;
  }
  return cur;
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 2, snow: false };
  const cE = B.chipM('段数');
  const cL = B.chipM('总长');
  const cD = B.chipM('维数');

  B.renderFn = () => {
    const n = st.n;
    let pts;
    if (st.snow) {
      const A = V(-.5, 0), Bv = V(0, Math.sqrt(3) / 2), C = V(.5, 0);
      pts = buildKoch([A, Bv, C, A], n, 1);
    } else {
      pts = buildKoch([V(0, 0), V(1, 0)], n, 1);
    }
    let xm = Infinity, xM = -Infinity, ym = Infinity, yM = -Infinity;
    for (const p of pts) { xm = Math.min(xm, p.x); xM = Math.max(xM, p.x); ym = Math.min(ym, p.y); yM = Math.max(yM, p.y); }
    const pad = 28, availW = 620, availH = 320;
    const s = Math.min((availW - 2 * pad) / (xM - xm), (availH - 2 * pad) / (yM - ym));
    const cx = (xm + xM) / 2, cy = (ym + yM) / 2;
    const px = x => 110 + availW / 2 + (x - cx) * s, py = y => 60 + availH / 2 - (y - cy) * s;

    B.tex(V(410, 30), st.snow ? '雪花：三条科赫曲线闭合成环' : '曲线：单位线段逐层折角', { size: 16, anchor: 'mid', w: 460 });
    if (st.snow) {
      let d = '';
      pts.forEach((p, i) => { d += (i ? 'L' : 'M') + px(p.x) + ' ' + py(p.y) + ' '; });
      mk('path', { d, fill: 'rgba(92,173,255,.10)', stroke: '#5cadff', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, B.dyn);
    } else {
      for (let i = 0; i < pts.length - 1; i++) {
        B.seg(V(px(pts[i].x), py(pts[i].y)), V(px(pts[i + 1].x), py(pts[i + 1].y)), { stroke: '#5cadff', 'stroke-width': 2, 'stroke-linejoin': 'round' });
      }
    }
    const segs = Math.pow(4, n) * (st.snow ? 3 : 1);
    const len = Math.pow(4 / 3, n) * (st.snow ? 3 : 1);
    B.text(V(410, 412), st.snow ? `边长 1 的正三角起折，第 ${n} 层共 ${segs} 段，总长 ${len.toFixed(3)}`
      : `单位线段起折，第 ${n} 层共 ${segs} 段，总长 ${len.toFixed(3)}`, { 'font-size': 12, fill: '#8fa3bd' });
    cE(`${segs}`);
    cL(`$${len.toFixed(3)}$`);
    cD('$1.262$');
  };

  B.toggleBtn('闭合雪花', false, on => { st.snow = on; B.render(); });
  B.slider('层数 n', 0, 4, 1, st.n, v => { st.n = v; B.render(); });
  B.hintM('每层长度乘 $4/3$：层数一多总长趋于无穷，围出的面积却有限');
  B.render();
  return B;
}
