/* 图 用1 · 增长与折损机
   本金 P、年利率 r，逐年画余额柱：复利 B_k=P(1+r)^k、单利 B_k=P(1+kr)、折损 B_k=P(1−r)^k。
   三种模式的递推式只差一个运算：乘 (1+r)、加 Pr、乘 (1−r)。
   局部坐标：柱区 x∈[70,640]，基线 y=380。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { P: 5000, r: 5, n: 6, mode: 0 };
  const PRE = ['① 复利', '② 单利', '③ 折损'];
  const series = m => {
    const a = [];
    for (let k = 1; k <= st.n; k++) {
      if (m === 0) a.push(st.P * (1 + st.r / 100) ** k);
      else if (m === 1) a.push(st.P * (1 + k * st.r / 100));
      else a.push(st.P * (1 - st.r / 100) ** k);
    }
    return a;
  };
  const cRec = B.chipM('递推式'), cN = B.chipM('第 n 年'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const n = st.n, P = st.P, r = st.r / 100, mode = st.mode;
    const cur = series(mode), cmp = mode === 0 ? series(1) : mode === 1 ? series(0) : null;
    const top = Math.max(...cur, ...(cmp || []), P * 1.05);
    const X0 = 70, BW = 570, cw = BW / n, yB = 380, HH = 300;
    const sc = HH / top;
    B.seg(V(X0, yB), V(X0 + BW, yB), { stroke: '#2b4260', 'stroke-width': 1.4 });
    const col = mode === 2 ? '#ff9e4a' : '#5cadff';
    for (let k = 1; k <= n; k++) {
      const x = X0 + (k - 1) * cw + cw * .16, w = cw * .68, h = cur[k - 1] * sc;
      mk('rect', { x, y: yB - h, width: w, height: h, fill: col, 'fill-opacity': .32,
        stroke: col, 'stroke-width': 1.1 }, B.dyn);
      B.text(V(x + w / 2, yB + 18), String(k), { 'font-size': 11.5, fill: '#93a1b5' });
    }
    // 对照曲线
    if (cmp) {
      for (let k = 2; k <= n; k++)
        B.seg(V(X0 + (k - 1.5) * cw, yB - cmp[k - 2] * sc), V(X0 + (k - .5) * cw, yB - cmp[k - 1] * sc),
          { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' });
      B.tex(V(X0 + (n - .5) * cw + 8, yB - cmp[n - 1] * sc), `$${fmt(cmp[n - 1], 0)}$`,
        { size: 11, anchor: 'start', color: '#ffd166', w: 80 });
    }
    B.tex(V(X0 + (n - .5) * cw, yB - cur[n - 1] * sc - 14), `$${fmt(cur[n - 1], 0)}$`,
      { size: 11.5, anchor: 'mid', color: col, w: 90 });
    // 图例
    B.text(V(X0, yB + 44), mode === 0 ? '蓝柱：复利　金虚线：单利' : mode === 1 ? '蓝柱：单利　金虚线：复利' : '蓝柱：折损后的余额',
      { 'font-size': 12, fill: '#93a1b5' });
    // 右栏
    const XR = 664;
    B.seg(V(XR - 18, 76), V(XR - 18, yB), { stroke: '#2b4260', 'stroke-width': 1 });
    B.text(V(XR, 96), '逐年余额的递推', { 'font-size': 12.5, fill: '#93a1b5' });
    B.tex(V(XR, 134), mode === 0 ? '$B_k=B_{k-1}(1+r)$' : mode === 1 ? '$B_k=B_{k-1}+Pr$' : '$B_k=B_{k-1}(1-r)$',
      { size: 13, anchor: 'start', w: 180 });
    B.tex(V(XR, 176), mode === 0 ? '$=P(1+r)^{k}$' : mode === 1 ? '$=P(1+kr)$' : '$=P(1-r)^{k}$',
      { size: 13, anchor: 'start', color: col, w: 180 });
    B.text(V(XR, 218), `第 ${n} 年余额`, { 'font-size': 12, fill: '#93a1b5' });
    B.tex(V(XR, 250), `$${fmt(cur[n - 1], 0)}$`, { size: 14, anchor: 'start', color: '#ffd166', w: 180 });
    B.text(V(XR, 292), mode === 1 ? `累计利息 ${fmt(P * r * n, 0)}` : `与本金之差 ${fmt(cur[n - 1] - P, 0)}`,
      { 'font-size': 12, fill: '#93a1b5' });
    B.text(V(XR, 322), mode === 2 ? '折损：每年乘 (1−r)' : '增长：每年乘 (1+r) 或加 Pr', { 'font-size': 11.5, fill: '#93a1b5' });
    // 标题
    B.tex(V(60, 30), '存钱、贷款、折旧：逐年余额都是一个等比（或等差）数列', { size: 14, anchor: 'start', w: 760 });
    // 徽章
    cRec(mode === 0 ? '$B_k=B_{k-1}(1+r)$' : mode === 1 ? '$B_k=B_{k-1}+Pr$' : '$B_k=B_{k-1}(1-r)$');
    cN(`$B_{${n}}=${fmt(cur[n - 1], 0)}$`);
    cJ(mode === 2 ? `每年少 $${fmt(st.P * st.r / 100, 0)}$ 上下`
      : mode === 1 ? `总利息 $${fmt(P * r * n, 0)}$`
        : `比单利多 $${fmt(cur[n - 1] - P * (1 + r * n), 0)}$`);
  };

  const slP = B.slider('本金 P', 1000, 10000, 1000, 5000, v => { st.P = v; B.render(); });
  const slR = B.slider('年利率 %', 1, 10, 1, 5, v => { st.r = v; B.render(); });
  B.slider('年数 n', 1, 10, 1, 6, v => { st.n = v; B.render(); });
  const btns = PRE.map((nm, i) => B.btn(nm, () => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('三种模式只差一步运算：乘 (1+r)、加 Pr、乘 (1−r)');
  B.render();
  return B;
}
