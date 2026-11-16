/* 图 和3 · 并项奇偶机
   a_k=(−1)^{k+1}k：正项画在基线上方（蓝），负项画在下方（橙）。相邻两项括成一对，
   每对的和都是 (2j−1)−2j=−1。n 为偶数时 S_n=−n/2；n 为奇数时多出一个正项。
   局部坐标：柱区 x∈[90,650]，基线 y=260，柱高上限 110。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { n: 6 };
  const PRE = [{ nm: '① n=6', n: 6 }, { nm: '② n=7', n: 7 }];
  const cA = B.chipM('通项'), cP = B.chipM('并项'), cS = B.chipM('前 n 项和');

  B.renderFn = () => {
    const n = st.n;
    const X0 = 90, BW = 560, cw = BW / n, yB = 260;
    const HH = 110, sc = HH / n;
    const v = k => (k % 2 ? k : -k);
    const S = n % 2 ? (n + 1) / 2 : -n / 2;
    B.seg(V(X0, yB), V(X0 + BW, yB), { stroke: '#2b4260', 'stroke-width': 1.4 });
    for (let k = 1; k <= n; k++) {
      const x = X0 + (k - 1) * cw + cw * .22, w = cw * .56, val = v(k);
      const h = Math.abs(val) * sc;
      mk('rect', { x, y: val > 0 ? yB - h : yB, width: w, height: h,
        fill: val > 0 ? '#5cadff' : '#ff9e4a', 'fill-opacity': .34,
        stroke: val > 0 ? '#5cadff' : '#ff9e4a', 'stroke-width': 1.1 }, B.dyn);
      B.text(V(x + w / 2, val > 0 ? yB - h - 12 : yB + h + 16), String(val),
        { 'font-size': 10.5, fill: val > 0 ? '#5cadff' : '#ff9e4a' });
      B.text(V(x + w / 2, yB + 26), String(k), { 'font-size': 11, fill: '#93a1b5' });
    }
    // 成对的括号
    for (let j = 1; 2 * j <= n; j++) {
      const x1 = X0 + (2 * j - 2) * cw + cw * .22, x2 = X0 + (2 * j - 1) * cw + cw * .78;
      const yb2 = yB + 44;
      mk('polyline', { points: `${x1},${yb2} ${x1},${yb2 + 12} ${x2},${yb2 + 12} ${x2},${yb2}`,
        fill: 'none', stroke: '#4ade80', 'stroke-width': 1.4 }, B.dyn);
      B.text(V((x1 + x2) / 2, yb2 + 28), '−1', { 'font-size': 11, fill: '#4ade80' });
    }
    if (n % 2)
      B.tex(V(X0 + (n - 1) * cw + cw * .5, yB + 60), '多出 $+n$', { size: 11, anchor: 'mid', color: '#ffd166', w: 80 });
    // 结论
    B.tex(V(X0, 392), n % 2
      ? `$S_{${n}}=-\\dfrac{${n - 1}}{2}+${n}=\\dfrac{${n + 1}}{2}=${fmt(S, 1)}$`
      : `$S_{${n}}=-\\dfrac{${n}}{2}=${fmt(S, 1)}$`,
      { size: 14, anchor: 'start', color: '#ffd166', w: 520 });
    // 标题
    B.tex(V(60, 30), '正负交替的数列：相邻两项括成一对，每对的和都是 $-1$', { size: 14, anchor: 'start', w: 760 });
    // 右栏
    const XR = 688;
    B.seg(V(XR - 16, 76), V(XR - 16, 380), { stroke: '#2b4260', 'stroke-width': 1 });
    B.tex(V(XR, 104), '$a_k=(-1)^{k+1}k$', { size: 12, anchor: 'start', w: 160 });
    B.text(V(XR, 144), '两两并项', { 'font-size': 12, fill: '#93a1b5' });
    B.tex(V(XR, 178), '$(2j-1)-2j=-1$', { size: 12, anchor: 'start', w: 160 });
    B.text(V(XR, 218), n % 2 ? 'n 为奇数：首尾多一项' : 'n 为偶数：正好配完', { 'font-size': 11.5, fill: '#93a1b5' });
    B.tex(V(XR, 254), n % 2 ? '$S_n=-\\dfrac{n-1}{2}+n$' : '$S_n=-\\dfrac{n}{2}$', { size: 12.5, anchor: 'start', w: 160 });
    B.tex(V(XR, 300), n % 2 ? '$=\\dfrac{n+1}{2}$' : '$S_n=-\\dfrac{n}{2}$', { size: 12.5, anchor: 'start', color: '#ffd166', w: 160 });
    // 徽章
    cA('$a_k=(-1)^{k+1}k$');
    cP('$(2j-1)-2j=-1$');
    cS(n % 2 ? `$S_{${n}}=\\dfrac{${n + 1}}{2}=${fmt(S, 1)}$` : `$S_{${n}}=-\\dfrac{${n}}{2}=${fmt(S, 1)}$`);
  };

  B.slider('n =', 2, 10, 1, 6, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.n = p.n;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('正负成对抵掉，每对剩 −1；n 为奇数时最末一个正项没有配对');
  B.render();
  return B;
}
