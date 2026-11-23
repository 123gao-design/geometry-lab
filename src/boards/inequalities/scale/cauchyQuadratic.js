import { V,mk } from '../../../lib/board.js';
import { createConicLab,plotInk as ink } from '../../../lib/conic-diagram.js';
import { lineStyle } from '../../../lib/projective/diagram.js';

export function createBoard(root){
  const B=createConicLab(root,600,320);
  let h=1.2,t=-.5;
  const height=B.slider('垂直分量 h',-2,2,.1,h,v=>{h=v; B.render();});
  const parameter=B.slider('参数 t',-1,3,.05,t,v=>{t=v; B.render();});
  B.btn('取最低点',()=>{t=1; parameter.sync(t); B.render();});
  B.btn('令向量共线',()=>{h=0; height.sync(h); B.render();});
  const read=B.chip('当前平方和'), minimum=B.chip('最小值');
  const pos=(x,y)=>V(180+115*x,285-30*y);
  B.renderFn=()=>{
    const q=x=>(x-1)**2+h*h;
    B.seg(pos(-1.3,0),pos(3.4,0),lineStyle(ink.rule)); B.seg(pos(0,0),pos(0,8.8),lineStyle(ink.rule));
    B.text(pos(3.4,-.6),'t'); B.text(pos(0,9),'q(t)');
    const points=Array.from({length:101},(_,i)=>{const x=-1+i/25,p=pos(x,q(x));return p.x+','+p.y;});
    mk('polyline',{points:points.join(' '),fill:'none',...lineStyle(ink.blue,2.6)},B.dyn);
    B.seg(pos(1,0),pos(1,h*h),lineStyle(ink.teal,2,'4 4'));
    B.text(pos(1,-.6),'1'); B.dot(pos(1,h*h),4,{fill:ink.teal});
    B.dot(pos(t,q(t)),4.5,{fill:ink.amber});
    read(q(t).toFixed(3)); minimum((h*h).toFixed(2)+(h===0?' · 接触横轴':''));
  };
  B.render(); return B;
}
