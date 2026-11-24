import { V, mk } from '../../../lib/board.js';
import { createConicLab, plotInk as ink } from '../../../lib/conic-diagram.js';
import { lineStyle } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const board = createConicLab(root, 680, 390);
  const scale = 58;
  const pos = (x, y) => V(170 + scale*x, 195 - scale*y);
  let gap = 2, x = .5, y = 2;
  const slider = board.slider('定值 k', 0, 3, .1, gap, k => example(k));
  function example(k) {
    gap = k;
    slider.sync(k);
    x = k === 2 ? .5 : Math.max(0,(2-k)/2);
    y = k === 2 ? 2 : k > 2 ? Math.sqrt(k*k-4) : 0;
    board.render();
  }
  for (const k of [0,1,2,3]) board.btn('k = '+k, () => example(k));
  board.btn('回到焦点', () => { x = 2; y = 0; board.render(); });
  board.handle({get: () => pos(x,y), set: p => {
    x = Math.round((p.x-170)/scale*20)/20;
    y = Math.round((195-p.y)/scale*20)/20;
  }, color: ink.rose});
  const shape = board.chip('解集'), distances = board.chip('到焦点 − 到直线'), verdict = board.chip('检验');
  board.renderFn = () => {
    const P = pos(x,y), F = pos(2,0), Q = pos(0,y);
    board.seg(pos(-2.6,0),pos(8.5,0),lineStyle(ink.axis,1));
    board.seg(pos(0,-3),pos(0,3),lineStyle(ink.guide,2));
    board.text(pos(-.55,2.85),'x = 0');
    // On each half-plane x is quadratic in y. Clip the y interval
    // before drawing each arc so squaring cannot introduce a reflected branch.
    function arc(slope, xmin, xmax) {
      const offset = gap*gap-4;
      const ends = [slope*xmin+offset, slope*xmax+offset];
      const lo = Math.sqrt(Math.max(0,Math.min(...ends)));
      const hi = Math.sqrt(Math.min(3.25**2,Math.max(...ends)));
      if (!(hi > lo)) return;
      const abscissa = t => (t*t-offset)/slope;
      for (const sign of [-1,1]) {
        const start = pos(abscissa(lo),sign*lo), end = pos(abscissa(hi),sign*hi);
        const control = pos((lo*hi-offset)/slope,sign*(lo+hi)/2);
        mk('path',{d:'M '+start.x+' '+start.y+' Q '+control.x+' '+control.y+' '+end.x+' '+end.y,
          fill:'none', ...lineStyle(ink.teal,3)},board.dyn);
      }
    }
    arc(4+2*gap,0,8.55);
    if (gap > 2) arc(4-2*gap,-2.75,0);
    if (gap === 2) {
      board.seg(pos(0,0),pos(-2.65,0),lineStyle(ink.teal,5));
      board.arrow(pos(-2,0),pos(-2.75,0),{line:false,head:14,wide:6,fill:ink.teal});
    }
    board.seg(Q,P,lineStyle(ink.blue,1.6,'4 5'));
    board.seg(F,P,lineStyle(ink.amber,2,'8 5'));
    board.dot(Q,3.5,{fill:ink.blue});
    board.dot(F,4.5,{fill:ink.teal});
    board.text(pos(2,-.43),'F(2,0)');
    board.text(V(P.x,P.y-12),'P');
    const focusDistance = Math.hypot(x-2,y), diff = focusDistance-Math.abs(x);
    shape(gap < 2 ? '抛物线' : gap === 2 ? '抛物线及向左的闭射线' : '上下两支，每支由两段抛物线弧拼成');
    distances(focusDistance.toFixed(3)+' − '+Math.abs(x).toFixed(3)+' = '+diff.toFixed(3));
    const matches = Math.abs(diff-gap)<1e-9;
    verdict(matches ? 'P 满足原方程' : 'P 不满足原方程', matches ? 'ok' : '');
  };
  board.render();
  return board;
}
