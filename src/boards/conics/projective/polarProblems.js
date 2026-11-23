import { mk } from '../../../lib/board.js';
import { createConicLab, plotInk as ink } from '../../../lib/conic-diagram.js';
import { drawLine, lineStyle, mark, toCanvas, toLocal, visible } from '../../../lib/projective/diagram.js';

const screen = (frame, x, y) => toCanvas(frame, [x, y, 1]);
const limit = (x, max) => Math.max(-max, Math.min(max, x));

function ellipseProblem(root, fromChord) {
  const B = createConicLab(root, 640, 380);
  const f = { cx: 246, cy: 190, a: 68, b: 68 };
  const pos = (x, y) => screen(f, x, y);
  const line = (coeff, color, width, dash) => drawLine(B, f, coeff, lineStyle(color, width, dash));
  const max = fromChord ? .36 : 2.45;
  let value = fromChord ? -.22 : 1.55;
  const slider = B.slider(fromChord ? '割线斜率' : 'P 的纵坐标', -max, max, .01, value, v => { value = v; B.render(); });
  const set = v => { value = limit(v, max); slider.sync(value); B.render(); };
  B.handle({ get: () => fromChord ? pos(-1, -5 * value) : pos(1, value),
    set: p => { const y = toLocal(f, p)[1]; set(fromChord ? -y / 5 : y); }, color: ink.rose });
  B.btn(fromChord ? '水平割线' : 'P 在椭圆上', () => set(fromChord ? 0 : Math.sqrt(3) / 2));
  B.btn('复位', () => set(fromChord ? -.22 : 1.55));
  const status = B.chip(fromChord ? '切线交点' : '切点弦');
  B.renderFn = () => {
    line([0, 1, 0], ink.axis, 1);
    line([1, 0, -1], ink.guide, 1.4, '4 5');
    mk('ellipse', { cx: f.cx, cy: f.cy, rx: 2*f.a, ry: f.b, fill: ink.soft, ...lineStyle(ink.blue, 2.3) }, B.dyn);
    if (fromChord) {
      for (const sign of [-1, 1]) {
        const end = pos(1, sign * Math.sqrt(3)/2);
        B.seg(end, pos(1, sign * 2.68), lineStyle(ink.rose, 3));
        B.dot(end, 4.5, {fill: ink.paper, stroke: ink.rose, 'stroke-width': 1.7});
      }
    }
    // 在单位圆坐标 (x/2,y) 中，弦方程为 u X + v Y = c。
    const [u,v,c] = fromChord ? [-2*value, 1, -4*value] : [.5, value, 1];
    const n = u*u + v*v, disc = n-c*c;
    mark(B, pos(4,0), 'Q', ink.amber, 12, 18);
    if (c !== 0 && (!fromChord || disc >= -1e-10)) {
      const p = pos(2*u/c, v/c);
      if (visible(B,p)) mark(B, p, 'P', ink.rose);
    }
    if (disc < -1e-10) {
      if (fromChord) line([u/2,v,-c], ink.amber, 2.4);
      status(fromChord ? '直线与椭圆相离，无实弦' : 'P 在椭圆内，无实切点');
      return;
    }
    const d = Math.sqrt(Math.max(0,disc));
    line([u/2,v,-c], ink.amber, 2.4);
    for (const sign of (d < 1e-7 ? [1] : [1,-1])) {
      const x = 2*(c*u-sign*v*d)/n, y = (c*v+sign*u*d)/n;
      line([x/4,y,-1], ink.teal, 1.8, '7 4');
      mark(B, pos(x,y), d < 1e-7 ? 'A = B = P' : sign === 1 ? 'A' : 'B', ink.teal, -14, 17);
    }
    if (fromChord) status(c === 0 ? '两切线平行，无有限交点' : 'P = (1, '+(v/c).toFixed(2)+')'+(visible(B,pos(1,v/c)) ? '' : ' · 视窗外'));
    else status(d < 1e-7 ? '两切点重合，极线为切线' : 'AB 恒过 Q(4, 0)');
  };
  B.render();
  return B;
}

export const createFixed = root => ellipseProblem(root, false);
export const createLocus = root => ellipseProblem(root, true);

export function createFocalChord(root) {
  const B = createConicLab(root, 620, 400);
  const f = { cx: 220, cy: 200, a: 49, b: 49 };
  const pos = (x,y) => screen(f,x,y);
  let k = .8;
  const slider = B.slider('P 的纵坐标', -1.4, 1.4, .01, k, v => { k = v; B.render(); });
  const set = v => { k = limit(v,1.4); slider.sync(k); B.render(); };
  B.handle({get: () => pos(-1,k), set: p => set(toLocal(f,p)[1]), color: ink.rose});
  B.btn('通径', () => set(0));
  B.btn('复位', () => set(.8));
  const result = B.chip('切线夹角');
  B.renderFn = () => {
    drawLine(B,f,[0,1,0],lineStyle(ink.axis,1));
    drawLine(B,f,[1,0,1],lineStyle(ink.rose,1.6,'4 5'),'准线');
    const start = pos(4.2**2/4,-4.2), end = pos(4.2**2/4,4.2), control = pos(-(4.2**2)/4,0);
    mk('path',{d:'M '+start.x+' '+start.y+' Q '+control.x+' '+control.y+' '+end.x+' '+end.y, fill:'none', ...lineStyle(ink.blue,2.5)},B.dyn);
    const roots = [1,-1].map(sign => (k+sign*Math.hypot(k,2))/2);
    drawLine(B,f,[2,-k,-2],lineStyle(ink.amber,2.4));
    const directions = roots.map((s,i) => {
      drawLine(B,f,[1,-s,s*s],lineStyle(ink.teal,1.8,'7 4'));
      mark(B,pos(s*s,2*s),i ? 'B' : 'A',ink.teal,14, i ? -12 : 16);
      const length = Math.hypot(s,1);
      return [Math.abs(s)/length,Math.sign(s)/length];
    });
    const [u,v] = directions;
    const corner = (a,b) => pos(-1+.26*(a*u[0]+b*v[0]),k+.26*(a*u[1]+b*v[1]));
    B.seg(corner(1,0),corner(1,1),lineStyle(ink.teal,1.5));
    B.seg(corner(1,1),corner(0,1),lineStyle(ink.teal,1.5));
    mark(B,pos(1,0),'F',ink.amber,12,18);
    mark(B,pos(-1,k),'P',ink.rose,-15,-10);
    result('90°');
  };
  B.render();
  return B;
}
