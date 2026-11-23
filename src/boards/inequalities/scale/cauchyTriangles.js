import { mk, V } from '../../../lib/board.js';
import { createConicLab, plotInk as ink } from '../../../lib/conic-diagram.js';
import { lineStyle } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const board = createConicLab(root, 580, 350);
  const a = 3, b = 1.5, scale = 63;
  let c = 1.3, d = 3.2;
  let ox = 290, oy = 228, dragFz = null;
  const pos = (x, y) => V(ox + scale * x, oy - scale * y);
  // 每次重绘先按当前 c、d 的包围盒把图形摆回画板中央，底边下方留一点字距。
  const layout = () => {
    if (dragFz) { ox = dragFz.ox; oy = dragFz.oy; return; }
    ox = 290 - (a - d) / 2 * scale;
    oy = 175 + Math.max(b, c) / 2 * scale + 6;
  };
  layout();
  const sliderC = board.slider('c', .5, 4, .1, c, n => { c = n; board.render(); });
  const sliderD = board.slider('d', .5, 4, .1, d, n => { d = n; board.render(); });
  function setLengths(height, width) {
    const snap = n => Math.max(.5, Math.min(4, Math.round(n * 10) / 10));
    c = snap(height); d = snap(width);
    sliderC.sync(c); sliderD.sync(d); board.render();
  }
  const hB = board.handle({ get: () => pos(-d, c), set: p => setLengths((oy - p.y) / scale, (ox - p.x) / scale), color: ink.amber });
  // 拖动期间冻结取景：居中随 c、d 变会让指针与把手对不上，松手再摆回中央。
  const stopDrag = () => { if (!dragFz) return; dragFz = null; board.render(); };
  hB.addEventListener('pointerdown', () => { dragFz = { ox, oy }; });
  hB.addEventListener('pointerup', stopDrag);
  hB.addEventListener('pointercancel', stopDrag);
  board.btn('让两条斜边垂直', () => setLengths(2, 1));
  board.btn('复位', () => setLengths(1.3, 3.2));
  const area = board.chip('两倍三角形面积'), bound = board.chip('斜边长度之积');
  board.renderFn = () => {
    layout();
    const origin = pos(0, 0), A = pos(a, b), U = pos(a, 0);
    const B = pos(-d, c), Vfoot = pos(-d, 0);
    function triangle(points, color) {
      mk('polygon', { points: points.map(p => p.x + ',' + p.y).join(' '), fill: color,
        'fill-opacity': .12, ...lineStyle(color, 2) }, board.dyn);
    }
    triangle([origin,U,A], ink.blue);
    triangle([origin,Vfoot,B], ink.amber);
    triangle([origin,A,B], ink.teal);
    for (const [foot, direction] of [[U,-1],[Vfoot,1]]) {
      const corner = V(foot.x+direction*9,foot.y-9);
      board.seg(V(corner.x,foot.y),corner,lineStyle(ink.guide,1.2));
      board.seg(corner,V(foot.x,corner.y),lineStyle(ink.guide,1.2));
    }
    const factor = (b*c-a*d)/(a*a+b*b);
    const H = pos(factor*a, factor*b);
    board.seg(origin,H,lineStyle(ink.guide,1,'4 4'));
    board.seg(B,H,lineStyle(ink.teal,2,'4 4'));
    board.dot(H,3,{fill:ink.teal});
    const equal = Math.abs(b*c-a*d)<1e-10;
    if (!equal) board.text(V(H.x,H.y+18),'H');
    board.text(V(origin.x,origin.y+25),equal ? 'O = H' : 'O');
    board.text(V(A.x+14,A.y-5),'A'); board.text(V(B.x-12,B.y-10),'B');
    board.text(pos(a/2,-.34),'a'); board.text(pos(a+.24,b/2),'b');
    board.text(pos(-d/2,-.34),'d'); board.text(pos(-d-.24,c/2),'c');
    area((a*c+b*d).toFixed(2));
    bound((Math.hypot(a,b)*Math.hypot(c,d)).toFixed(2)+(equal ? ' · 取等' : ''));
  };
  board.render();
  return board;
}
