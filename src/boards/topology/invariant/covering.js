/* 图 不3 · 覆叠空间：把基圆摊成直线
   模式一：实数轴按 x↦e^{2πix} 缠到圆周上。直线上每隔整数的那些点
   全落到圆周上同一点；基圆上取一小段，它上面正好摊着一串一样的小段。
   模式二：圆周到圆周的二次覆叠 z↦z²，基圆上一点恰好两个原像，
   相隔半圈——局部一样是「均匀摊开」，只是重数变成 2。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { t: .18, double: false };

  const cD = B.chipM('覆叠度'), cP = B.chipM('原像');

  const LX0 = 84, LX1 = 452, yL = 236;
  const linePx = x => LX0 + (x + 1.5) * ((LX1 - LX0) / 5);
  const CR = 118, CC = V(644, 236);
  const circP = a => V(CC.x + CR * Math.cos(a), CC.y + CR * Math.sin(a));

  B.renderFn = () => {
    if (!st.double) {
      // 实数轴
      B.seg(V(LX0 - 18, yL), V(LX1 + 18, yL), { stroke: '#2b3b53', 'stroke-width': 2 });
      for (let k = -1; k <= 4; k++) {
        const x = linePx(k), x2 = linePx(k + .5);
        B.seg(V(x, yL - 7), V(x, yL + 7), { stroke: '#5c6a80', 'stroke-width': 1.5 });
        B.text(V(x, yL + 24), String(k), { fill: '#5c6a80', 'font-size': 11, 'text-anchor': 'middle' });
        B.seg(V(x2, yL - 4), V(x2, yL + 4), { stroke: '#2b3b53', 'stroke-width': 1.2 });
      }
      B.tex(V(LX1 - 30, yL - 40), '$\\mathbb{R}$', { size: 15, color: '#8fa3bd', w: 40 });

      const phi = 2 * Math.PI * st.t;
      const base = circP(phi);
      // 直线上的整点平移：全是基点的原像
      for (let k = -1; k <= 4; k++) {
        const x = st.t + k;
        if (x < -1.5 || x > 3.5) continue;
        const p = V(linePx(x), yL);
        B.dot(p, 5, { fill: '#ff9e4a', stroke: '#12161f', 'stroke-width': 1.3 });
      }
      // 圆周与基点
      mk('circle', { cx: CC.x, cy: CC.y, r: CR, fill: '#5cadff', 'fill-opacity': .06, stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
      B.dot(base, 6, { fill: '#ffd166', stroke: '#12161f', 'stroke-width': 1.5 });
      // 均匀覆叠邻域：圆周上一小段与其原像
      const h = .16;
      mk('path', {
        d: `M ${circP(phi - h).x} ${circP(phi - h).y} A ${CR} ${CR} 0 0 1 ${circP(phi + h).x} ${circP(phi + h).y}`,
        fill: 'none', stroke: '#4ade80', 'stroke-width': 6, 'stroke-opacity': .75,
      }, B.dyn);
      B.seg(V(LX0, yL + 40), V(LX1, yL + 40), { stroke: '#4ade80', 'stroke-width': 1.5, 'stroke-opacity': .5 });
      // 虚连线：每个原像都落到同一点
      for (let k = -1; k <= 4; k++) {
        const x = st.t + k;
        if (x < -1.5 || x > 3.5) continue;
        B.seg(V(linePx(x), yL - 8), V(base.x, base.y - 10), { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '3 6', 'stroke-opacity': .45 });
      }
      B.tex(V((LX1 + CC.x - CR) / 2, 96), '$x\\mapsto e^{2\\pi i x}$', { size: 13, color: '#8fa3bd', anchor: 'mid', w: 180 });
      B.tex(V(W / 2, H - 86), '直线的每一点都贴着圆周；基圆取一小段，原像是一串互不相交的同款小段', { size: 12.5, color: '#8fa3bd', w: 620, anchor: 'mid' });
      cD('无限', 'ok'); cP('每隔一个整数一个', 'ok');
    } else {
      // 圆周到圆周的二次覆叠
      const DL = V(258, 236), DR = V(600, 236), R2 = 116;
      mk('circle', { cx: DL.x, cy: DL.y, r: R2, fill: '#5cadff', 'fill-opacity': .06, stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
      mk('circle', { cx: DR.x, cy: DR.y, r: R2, fill: '#ff9e4a', 'fill-opacity': .06, stroke: '#ff9e4a', 'stroke-width': 2 }, B.dyn);
      B.text(V(DL.x, DL.y + R2 + 26), '定义域 $S^1$', { fill: '#5cadff', 'font-size': 12, 'text-anchor': 'middle' });
      B.text(V(DR.x, DR.y + R2 + 26), '基圆 $S^1$', { fill: '#ff9e4a', 'font-size': 12, 'text-anchor': 'middle' });

      const phi = 2 * Math.PI * st.t;
      const q1 = phi / 2, q2 = phi / 2 + Math.PI;
      const b = V(DR.x + R2 * Math.cos(phi), DR.y + R2 * Math.sin(phi));
      B.dot(b, 6, { fill: '#ffd166', stroke: '#12161f', 'stroke-width': 1.5 });
      const p1 = V(DL.x + R2 * Math.cos(q1), DL.y + R2 * Math.sin(q1));
      const p2 = V(DL.x + R2 * Math.cos(q2), DL.y + R2 * Math.sin(q2));
      B.dot(p1, 6, { fill: '#4ade80', stroke: '#12161f', 'stroke-width': 1.5 });
      B.dot(p2, 6, { fill: '#4ade80', stroke: '#12161f', 'stroke-width': 1.5 });
      B.seg(p1, b, { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '4 6', 'stroke-opacity': .5 });
      B.seg(p2, b, { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '4 6', 'stroke-opacity': .5 });
      B.tex(V((DL.x + DR.x) / 2, 92), '$z\\mapsto z^2$：角度翻倍', { size: 13, color: '#8fa3bd', anchor: 'mid', w: 220 });
      B.tex(V(W / 2, H - 86), '基圆上一点，定义域里恰好两个原像，隔半圈；两个邻域各自均匀地摊上去', { size: 12.5, color: '#8fa3bd', w: 640, anchor: 'mid' });
      cD('$2$', 'ok'); cP('两个', 'ok');
    }
  };

  B.slider('基圆上的位置', 0, 1, .01, st.t, v => { st.t = v; B.render(); });
  B.toggleBtn('二次覆叠', false, v => { st.double = v; B.render(); });
  B.hintM('先沿直线把点拖过整数：每过一个整数就回到圆周上同一点；再切到二次覆叠，原像变成两个');
  B.render();
  return B;
}
