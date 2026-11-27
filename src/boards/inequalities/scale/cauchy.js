import { mk, V } from '../../../lib/board.js';
import { InequalityBoard } from '../inequality-board.js';
import { plotInk as ink } from '../../../lib/conic-diagram.js';
import { lineStyle } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = new InequalityBoard(root, 640, 360);
  const values = [2, 1, 1, 2.5];
  const sliders = values.map((v,i) => B.slider('abcd'[i]+' =',-5,5,.1,v,n => { values[i]=n; B.render(); }, undefined, n => `$${'abcd'[i]}=${n}$`));
  const presets = [
    { name: '一般例', values: [2, 1, 1, 2.5] }, { name: '正交', values: [1, 2, -4, 2] },
    { name: '同向', values: [1, 2, 2, 4] }, { name: '反向', values: [1, 2, -2, -4] },
    { name: '平行坐标轴', short: '沿轴', values: [0, 2, 3, 4] }, { name: '零向量', values: [0, 0, 3, 4] },
  ];
  B.choiceRow('选择向量', presets, () => presets.findIndex(p => p.values.every((v, i) => v === values[i])), i => {
    presets[i].values.forEach((v, j) => { values[j] = v; sliders[j].sync(v); });
    B.render();
  });
  const st = {grid:true,labs:true};
  B.graphToggles(st,['grid','labs']);
  const product=B.readout('模长乘积的平方'), inner=B.readout('内积平方', 'gold'), gap=B.readout('面积平方', 'mint');
  B.renderFn=()=>{
    const [a,b,c,d]=values, norm=a*a+b*b, dot=a*c+b*d, det=a*d-b*c;
    const hx=norm ? a*dot/norm : 0, hy=norm ? b*dot/norm : 0;
    const xs=[0,a,c,a+c,hx], ys=[0,b,d,b+d,hy];
    const xmin=Math.min(...xs), xmax=Math.max(...xs), ymin=Math.min(...ys), ymax=Math.max(...ys);
    const scale=Math.min(66,510/Math.max(1,xmax-xmin),250/Math.max(1,ymax-ymin));
    const px=x=>320+(x-(xmin+xmax)/2)*scale, py=y=>180-(y-(ymin+ymax)/2)*scale;
    const pos=(x,y)=>V(px(x),py(y)), O=pos(0,0), U=pos(a,b), W=pos(c,d), H=pos(hx,hy);
    B.grid({px,py,X0:xmin-2,X1:xmax+2,Y0:ymin-2,Y1:ymax+2,sx:1,sy:1,lx:2,ly:2,grid:st.grid,labs:false});
    mk('polygon',{points:[O,U,pos(a+c,b+d),W].map(p=>p.x+','+p.y).join(' '),fill:ink.tealWash,...lineStyle(ink.teal,1.5,'5 4')},B.dyn);
    if(norm){
      B.seg(O,H,lineStyle(ink.teal,5));
      B.seg(W,H,lineStyle(ink.teal,1.7,'4 4'));
      B.mark(H, ink.teal);
      if(st.labs) B.text(V(H.x-12,H.y+19),'H');
    }
    for(const [p,color,name,dy] of [[U,ink.blue,'u',-14],[W,ink.amber,'v',19]]){
      if(p.x!==O.x || p.y!==O.y){
        B.mark(p, color);
        B.seg(O,p,lineStyle(color,2.4));
        B.arrow(O,p,{fill:color,head:12,wide:5,line:false});
        if(st.labs) B.text(V(p.x+12,p.y+dy),name);
      }
    }
    B.mark(O, ink.ink);
    if(st.labs) B.text(V(O.x-12,O.y+16),'O');
    product(`$${(norm*(c*c+d*d)).toFixed(2)}$`); inner(`$${(dot*dot).toFixed(2)}$`);
    gap(`$${(det*det).toFixed(2)}$`, Math.abs(det)<1e-10 ? 'ok' : '');
  };
  B.render(); return B;
}
