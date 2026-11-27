import { V,mk } from '../../../lib/board.js';
import { InequalityBoard } from '../inequality-board.js';
import { plotInk as ink } from '../../../lib/conic-diagram.js';
import { lineStyle } from '../../../lib/projective/diagram.js';

export function createBoard(root){
  const B=new InequalityBoard(root,600,400, 'info'), s=40;
  const pos=(x,y)=>V(270+s*x,220-s*y);
  const O=pos(0,0), H=pos(12/13,18/13);
  let t=.72;
  const current=()=>pos(12/13+3*t,18/13-2*t);
  const slider=B.slider('沿直线的参数',-1,1,.01,t,v=>{t=v;B.render();}, undefined, n=>`$t=${n}$`);
  const set=v=>{t=Math.max(-1,Math.min(1,v));slider.sync(t);B.render();};
  B.handle({get:current,set:p=>set(((p.x-H.x)*3+(p.y-H.y)*2)/(13*s)),color:ink.amber});
  B.btn('回到垂足',()=>set(0));
  const distance=B.readout('当前距离平方'), minimum=B.readout('最小值', 'gold');
  B.renderFn=()=>{
    B.seg(pos(-6,0),pos(7.5,0),lineStyle(ink.axis,1));
    B.seg(pos(0,-4),pos(0,5),lineStyle(ink.axis,1));
    mk('circle',{cx:O.x,cy:O.y,r:s*Math.hypot(12/13+3*t,18/13-2*t),fill:'none',...lineStyle(ink.teal,1.8,'5 4')},B.dyn);
    B.seg(pos(-5,16/3),pos(7.5,-3),lineStyle(ink.blue,2.4));
    B.seg(O,current(),lineStyle(ink.amber,2.4));
    B.seg(O,H,lineStyle(ink.teal,1.7,'5 4'));
    for(const [p,name] of [[O,'O'],[H,'H']]){
      B.mark(p, ink.teal);B.text(V(p.x-13,p.y-9),t === 0 && name === 'H' ? 'H = P' : name);
    }
    if (t !== 0) B.text(V(current().x+14,current().y+17),'P');
    distance(`$OP^2= ${(36/13+13*t*t).toFixed(3)}$`);minimum('$36/13$', t === 0 ? 'ok' : '');
  };
  B.render();return B;
}
