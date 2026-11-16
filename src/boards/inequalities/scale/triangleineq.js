/* 图 放1 · 三角不等式机：|a+b| ≤ |a| + |b| 的两幅面貌
   数轴模式：a、b 是从 0 出发的两段位移。从 0 到 a、从 0 到 b 的「折返」路长 |a|+|b|，
             不免绕回原点再出发；直达 a+b 只需 |a+b|。折返不短于直达，等号当 a、b 同号
             （两段首尾相连不折返）。异号时多走的部分恰是两倍短段：|a|+|b| = |a+b| + 2·min(|a|,|b|)。
   向量模式：u 固定沿 x 轴长 3（金色），v 可转可伸缩（蓝色）。u、v 首尾相接成折线 O→U→W，
             和向量 u+v（绿色）闭合三角形：|u|+|v| 不短于第三边 |u+v| —— 等号当 θ=0° 同向（取上界）；
             反向 θ=180° 时折线拉直贴线，|u+v| 跌到 | |u|−|v| |（取下界）。
   局部坐标约定：数轴主轴 v=250，px=70+30·(u+12)（u∈[−12,12]）；向量模式原点 O=(240,240)，
   每单位 46px（py=240−y·46，y 向上），u=(3,0)。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 420;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, a: 5, b: 3, len: 3, ang: 50, labs: true };
  const cA = B.chipM('|a|'), cB = B.chipM('|b|'), cAB = B.chipM('|a+b|'), cJ = B.chipM('判读');

  B.renderFn = () => {
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
        band(0, b, 288, '#ff7b8a', '$|b|$');
        B.text(V(px(0), 210), '0', { 'font-size': 11.5, fill: '#5c6a80', 'text-anchor': 'middle' });
        B.dot(V(px(0), 250), 5, { fill: '#5c6a80' });
      }
      B.tex(V(430, 38), `$a=${f1(a)}$，$b=${f1(b)}$　「折返」 $|a|+|b|$ 与「直达」 $|a+b|$`, { size: 15, anchor: 'mid' });
      B.text(V(430, 66), '从 0 先到 a、再回 0、再到 b 是折返路；同号时两段同向连成一条直线段，折返与直达重合', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
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
      const O = V(240, 240), S = 46;
      const U = V(240 + 3 * S, 240);
      const W = V(240 + (3 + L * Math.cos(th)) * S, 240 - L * Math.sin(th) * S);
      const dd = Math.sqrt((3 + L * Math.cos(th)) ** 2 + (L * Math.sin(th)) ** 2);
      // 三边先画、箭头后补（B.arrow line:false）：θ→0° 时绿线和向量压在金/蓝线段上，箭头须浮在其上
      B.seg(O, U, { stroke: '#ffd166', 'stroke-width': 3.2 });
      B.seg(U, W, { stroke: '#5cadff', 'stroke-width': 3.2 });
      B.seg(O, W, { stroke: '#4ade80', 'stroke-width': 3 });
      B.arrow(O, U, { fill: '#ffd166', head: 13, wide: 6, line: false });
      B.arrow(U, W, { fill: '#5cadff', head: 13, wide: 6, line: false });
      if (st.labs) {
        B.tex(V((O.x + U.x) / 2, (O.y + U.y) / 2 - 18), '$|\\vec u|=3$', { size: 13, anchor: 'mid', color: '#ffd166' });
        B.tex(V((U.x + W.x) / 2, (U.y + W.y) / 2 - 16), `$|\\vec v|=${f1(L)}$`, { size: 13, anchor: 'mid', color: '#5cadff' });
        B.tex(V((O.x + W.x) / 2, (O.y + W.y) / 2 - 16), `$|\\vec u+\\vec v|=${f1(dd)}$`, { size: 13, anchor: 'mid', color: '#4ade80' });
        // 夹角弧 θ（从 x 轴正向转到 v 方向）
        const AP = [];
        for (let i = 0; i < 14; i++) { const t = th * i / 13; AP.push(`${O.x + 34 * Math.cos(t)},${O.y - 34 * Math.sin(t)}`); }
        mk('polyline', { points: AP.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.2 }, B.dyn);
        B.textM(V(O.x + 46, O.y - 26), `$\\theta=${f1(st.ang)}^\\circ$`, { 'font-size': 12.5, fill: '#67e8f9', 'text-anchor': 'middle' });
        B.text(V(O.x - 8, O.y + 12), 'O', { 'font-size': 14, fill: '#93a1b5', 'text-anchor': 'middle' });
        B.text(V(U.x + 6, U.y - 8), 'U', { 'font-size': 14, fill: '#93a1b5', 'text-anchor': 'start' });
        B.text(V(W.x + 6, W.y - 6), 'W', { 'font-size': 14, fill: '#93a1b5', 'text-anchor': 'start' });
      }
      B.tex(V(430, 36), `$|\\vec u|=3$，$|\\vec v|=${f1(L)}$，夹角 $θ=${f1(st.ang)}^{\\circ}$`, { size: 15, anchor: 'mid' });
      B.text(V(430, 64), '折线 O→U→W 的长度不短于直线段 O→W：三角形两边之和不小于第三边', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
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

  const modeBtns = ['数轴', '向量'].map((n, i) => B.btnM(n, () => {
    st.mode = i; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const PRE = [
    { mode: 0, a: 5, b: 3, n: '① 同号取等' },
    { mode: 0, a: -5, b: 3, n: '② 异号折返' },
    { mode: 1, len: 3, ang: 0, n: '③ 同向取上界' },
    { mode: 1, len: 3, ang: 180, n: '④ 反向取下界' },
  ];
  PRE.forEach(P => B.btnM(P.n, () => {
    st.mode = P.mode;
    if (P.mode === 0) { st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); }
    else { st.len = P.len; st.ang = P.ang; sL.sync(P.len); sT.sync(P.ang); }
    modeBtns.forEach((b, j) => b.classList.toggle('on', j === st.mode));
    B.render();
  }, { on: false }));
  B.graphToggles(st, ['labs']);

  const sA = B.slider('a =', -6, 6, .1, 5, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', -6, 6, .1, 3, v => { st.b = v; B.render(); });
  const sL = B.slider('v 长 =', .5, 5, .1, 3, v => { st.len = v; B.render(); });
  const sT = B.slider('θ° =', 0, 180, 5, 50, v => { st.ang = v; B.render(); });

  B.hintM('数轴看折返与直达；向量看三角形 —— $\\theta=0^\\circ$ 取上界、$\\theta=180^\\circ$ 取下界');
  B.render();
  return B;
}