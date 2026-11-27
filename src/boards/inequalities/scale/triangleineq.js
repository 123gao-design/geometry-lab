/* 图 放1 · 三角不等式机：|a+b| ≤ |a| + |b| 的两幅面貌
   数轴模式：从 0 到 a，再从 a 到 a+b，两段路长分别为 |a| 与 |b|。
   向量模式：u 固定沿 x 轴长 3（金色），v 可转可伸缩（蓝色）。u、v 首尾相接成折线 O→U→W，
             和向量 u+v（绿色）闭合三角形：|u|+|v| 不短于第三边 |u+v| —— 等号当 θ=0° 同向（取上界）；
             反向 θ=180° 时折线拉直贴线，|u+v| 跌到 | |u|−|v| |（取下界）。
   局部坐标约定：数轴主轴 v=250，px=70+30·(u+12)（u∈[−12,12]）；向量模式原点 O=(240,240)，
   每单位 46px（py=240−y·46，y 向上），u=(3,0)。 */
import { InequalityBoard } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 420;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, a: 5, b: 3, len: 3, ang: 50, labs: true };
  const cA = B.readout('第一段'), cB = B.readout('第二段', 'gold'), cAB = B.readout('直达', 'mint'), cJ = B.chipM('判读');

  B.renderFn = () => {
    for (const slider of [sA, sB]) slider.closest('.slider').style.display = st.mode === 0 ? '' : 'none';
    for (const slider of [sL, sT]) slider.closest('.slider').style.display = st.mode === 1 ? '' : 'none';
    if (st.mode === 0) {
      /* ---------- 数轴模式 ---------- */
      const a = st.a, b = st.b, sA = a + b;
      const px = v => 70 + 30 * (v + 12);
      B.arrow(V(px(-12), 250), V(px(12) + 20, 250), { stroke: '#8fa3bd', 'stroke-width': 1.6, head: 9, wide: 4.5 });
      for (let t = -12; t <= 12; t += 2) {
        B.seg(V(px(t), 250), V(px(t), 243.5), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
        B.text(V(px(t), 270), String(t), { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
      }
      if (st.labs) {
        const band = (from, to, y, col, lab) => {
          const x1 = px(from), x2 = px(to);
          const xa = Math.min(x1, x2), xb = Math.max(x1, x2);
          B.seg(V(xa, y), V(xb, y), { stroke: col, 'stroke-width': 4 });
          B.tex(V(xa + (xb - xa) / 2, y - 15), lab, { size: 12.5, anchor: 'mid', color: col });
        };
        band(0, a, 214, '#5cadff', '$|a|$');
        band(0, sA, 250, '#ffd166', '$|a+b|$');
        band(a, sA, 288, '#ff7b8a', '$|b|$');
        B.text(V(px(0), 210), '0', { 'font-size': 11.5, fill: '#5c6a80', 'text-anchor': 'middle' });
        B.mark(V(px(0), 250), '#5c6a80');
        B.mark(V(px(a), 214), '#5cadff');
        B.mark(V(px(sA), 250), '#ffd166');
      }
      B.tex(V(430, 38), `$a=${f1(a)}$，$b=${f1(b)}$　「折返」 $|a|+|b|$ 与「直达」 $|a+b|$`, { size: 15, anchor: 'mid' });
      cA(`$|a|=${f1(Math.abs(a))}$`);
      cB(`$|b|=${f1(Math.abs(b))}$`);
      cAB(`$|a+b|=${f1(Math.abs(sA))}$`);
      const sa = Math.abs(a), sb = Math.abs(b);
      if (Math.abs(a) < 1e-9 || Math.abs(b) < 1e-9)
        cJ(`有一数为 $0$：$|a+b|$ 退化为另一段长，平凡取等`);
      else if (a * b >= 0)
        cJ(`$a,b$ 同号：$|a+b|=|a|+|b|=${f1(sa + sb)}$ —— 两段同向不折返，取等`, 'ok');
      else
        cJ(`$a,b$ 异号：$|a|+|b|=|a+b|+2\\min\\{|a|,|b|\\}$ —— 折返多出的长等于两倍短段（$2\\cdot${f1(Math.min(sa, sb))}$）`);
    } else {
      /* ---------- 向量模式 ---------- */
      const L = st.len, th = st.ang * Math.PI / 180;
      const S = 43;
      const endX = 3 + L * Math.cos(th);
      const centerX = (Math.min(0, endX) + Math.max(3, endX)) / 2;
      const O = V(430 - centerX * S, 220 + L * Math.sin(th) * S / 2);
      const U = V(O.x + 3 * S, O.y);
      const W = V(O.x + (3 + L * Math.cos(th)) * S, O.y - L * Math.sin(th) * S);
      const dd = Math.sqrt((3 + L * Math.cos(th)) ** 2 + (L * Math.sin(th)) ** 2);
      // 三边先画、箭头后补（B.arrow line:false）：θ→0° 时绿线和向量压在金/蓝线段上，箭头须浮在其上
      B.seg(O, U, { stroke: '#ffd166', 'stroke-width': 3.2 });
      B.seg(U, W, { stroke: '#5cadff', 'stroke-width': 3.2 });
      B.seg(O, W, { stroke: '#4ade80', 'stroke-width': 3 });
      B.arrow(O, U, { fill: '#ffd166', head: 13, wide: 6, line: false });
      B.mark(O, '#93a1b5'); B.mark(U, '#ffd166'); B.mark(W, '#4ade80');
      B.arrow(U, W, { fill: '#5cadff', head: 13, wide: 6, line: false });
      if (st.labs) {
        B.seg(U, V(U.x + 40, U.y), { stroke: '#93a1b5', 'stroke-dasharray': '3 4' });
        B.tex(V((O.x + U.x) / 2, (O.y + U.y) / 2 - 18), '$|\\vec u|=3$', { size: 13, anchor: 'mid', color: '#ffd166' });
        B.tex(V((U.x + W.x) / 2, (U.y + W.y) / 2 - 16), `$|\\vec v|=${f1(L)}$`, { size: 13, anchor: 'mid', color: '#5cadff' });
        if (st.ang > 0 && st.ang < 180) B.tex(V((O.x + W.x) / 2, (O.y + W.y) / 2 - 16), `$|\\vec u+\\vec v|=${f1(dd)}$`, { size: 13, anchor: 'mid', color: '#4ade80' });
        // 夹角弧 θ（从 x 轴正向转到 v 方向）
        const AP = [];
        for (let i = 0; i < 14; i++) { const t = th * i / 13; AP.push(`${U.x + 34 * Math.cos(t)},${U.y - 34 * Math.sin(t)}`); }
        mk('polyline', { points: AP.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.2 }, B.dyn);
        B.textM(V(U.x + 46, U.y - 26), `$\\theta=${f1(st.ang)}^\\circ$`, { 'font-size': 12.5, fill: '#67e8f9', 'text-anchor': 'middle' });
        B.text(V(O.x - 8, O.y + 12), 'O', { 'font-size': 14, fill: '#93a1b5', 'text-anchor': 'middle' });
        B.text(V(U.x + 6, U.y - 8), 'U', { 'font-size': 14, fill: '#93a1b5', 'text-anchor': 'start' });
        B.text(V(W.x + 6, W.y - 6), 'W', { 'font-size': 14, fill: '#93a1b5', 'text-anchor': 'start' });
      }
      B.tex(V(430, 36), `$|\\vec u|=3$，$|\\vec v|=${f1(L)}$，夹角 $θ=${f1(st.ang)}^{\\circ}$`, { size: 15, anchor: 'mid' });
      cA('$|\\vec u|=3$');
      cB(`$|\\vec v|=${f1(L)}$`);
      cAB(`$|\\vec u+\\vec v|=${f1(dd)}$`);
      const hi = 3 + L, lo = Math.abs(3 - L);
      if (Math.abs(dd - hi) < 2e-9)
        cJ(`同向：$|\\vec u+\\vec v|=|\\vec u|+|\\vec v|=${f1(hi)}$ 达到上界 —— 取等`, 'ok');
      else if (Math.abs(dd - lo) < 2e-9)
        cJ(`反向：$|\\vec u+\\vec v|=\\big||\\vec u|-|\\vec v|\\big|=${f1(lo)}$ 达到下界 —— 反向同样是取等`, 'ok');
      else
        cJ(`$θ=${f1(st.ang)}\\,^\\circ$：$\\big||\\vec u|-|\\vec v|\\big|=${f1(lo)}$ $\\le |\\vec u+\\vec v|=${f1(dd)}$ $\\le |\\vec u|+|\\vec v|=${f1(hi)}$ —— 中间取值`);
    }
  };

  B.choiceRow('选择模式', ['数轴', '向量'].map(name => ({ name })), () => st.mode, i => {
    st.mode = i; B.render();
  });
  const PRE = [
    { name: '同号', formula: '$a=5,\\ b=3$', values: { mode: 0, a: 5, b: 3 } },
    { name: '异号', formula: '$a=-5,\\ b=3$', values: { mode: 0, a: -5, b: 3 } },
    { name: '同向', values: { mode: 1, len: 3, ang: 0 } },
    { name: '反向', values: { mode: 1, len: 3, ang: 180 } },
  ];
  B.examples('选择例题', PRE, st, P => {
    st.mode = P.mode;
    if (P.mode === 0) { st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); }
    else { st.len = P.len; st.ang = P.ang; sL.sync(P.len); sT.sync(P.ang); }
    B.render();
  });
  B.graphToggles(st, ['labs']);

  const sA = B.slider('a =', -6, 6, .1, 5, v => { st.a = v; B.render(); }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', -6, 6, .1, 3, v => { st.b = v; B.render(); }, undefined, n => `$b=${n}$`);
  const sL = B.slider('v 长 =', .5, 5, .1, 3, v => { st.len = v; B.render(); }, undefined, n => `$|\\vec v|=${n}$`);
  const sT = B.slider('θ° =', 0, 180, 5, 50, v => { st.ang = v; B.render(); }, undefined, n => `$\\theta=${n}^{\\circ}$`);

  B.render();
  return B;
}
