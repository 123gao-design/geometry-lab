/* 图 分1 · 随机变量与分布列
   袋里有三种颜色的球，摸出一球，把颜色编号成 1、2、3 —— 这就是一个离散型随机变量。
   三个滑块改各色球数，右侧柱高按「该色球数 ÷ 总球数」实时改写，柱高之和恒为 1。
   分布列的两个要件（每个概率非负、全部加起来等于 1）在这里是自动满足的。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { n1: 3, n2: 3, n3: 3 };
  const c1 = B.chipM('P(X=1)'), c2 = B.chipM('P(X=2)'), c3 = B.chipM('P(X=3)'), cJ = B.chipM('判读');

  const COL = ['#ff7b8a', '#5cadff', '#ffd166'];
  const f3 = v => v.toFixed(3);

  B.renderFn = () => {
    const ns = [st.n1, st.n2, st.n3];
    const N = ns[0] + ns[1] + ns[2];

    // 左：袋子里的球
    B.dyn.appendChild(mk('rect', {
      x: 62, y: 62, width: 292, height: 232, rx: 16,
      fill: 'rgba(139,163,189,.05)', stroke: '#3f5f8f', 'stroke-width': 1.2,
    }, B.dyn));
    B.text(V(86, 88), '袋中有红、蓝、金三种球', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });

    let idx = 0;
    ns.forEach((n, g) => {
      for (let i = 0; i < n; i++) {
        const col = idx % 6, row = Math.floor(idx / 6);
        B.dot(V(92 + col * 45, 128 + row * 38), 12, { fill: COL[g], 'fill-opacity': .75 });
        idx++;
      }
    });
    B.text(V(208, 314), `共 ${N} 个球，摸到每个球的机会相同`, { fill: '#8fa3bd', 'font-size': 11.5 });

    // 右：分布列柱图
    const X0 = 430, BW = 66, GAP = 40, YB = 330, HT = 200;
    const ps = ns.map(n => n / N);
    const scale = HT / Math.max(...ps, .02);
    B.text(V(X0 + 90, 88), 'X 的分布列', { fill: '#8fa3bd', 'font-size': 12.5 });
    B.dyn.appendChild(mk('line', { x1: X0, y1: YB, x2: X0 + 3 * (BW + GAP), y2: YB, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));
    ps.forEach((p, i) => {
      const x = X0 + i * (BW + GAP);
      const h = Math.max(2, p * scale);
      B.dyn.appendChild(mk('rect', {
        x, y: YB - h, width: BW, height: h, rx: 5,
        fill: COL[i], 'fill-opacity': .55, stroke: COL[i], 'stroke-width': 1.6,
      }, B.dyn));
      B.textM(V(x + BW / 2, YB - h - 16), `$${f3(p)}$`, { 'font-size': 12.5, fill: COL[i] });
      B.textM(V(x + BW / 2, YB + 20), `$${i + 1}$`, { 'font-size': 13, fill: '#aebdd2' });
    });
    B.text(V(X0 + 1.5 * (BW + GAP), YB + 40), 'X 取值为球的颜色编号', { fill: '#5c6a80', 'font-size': 10.5 });

    const sum = ps[0] + ps[1] + ps[2];
    B.textM(V(X0 + 1.5 * (BW + GAP), YB + 66), `$p_1+p_2+p_3=${f3(sum)}$`, { 'font-size': 12.5, fill: '#67e8f9' });

    c1(`$\\dfrac{${ns[0]}}{${N}}=${f3(ps[0])}$`);
    c2(`$\\dfrac{${ns[1]}}{${N}}=${f3(ps[1])}$`);
    c3(`$\\dfrac{${ns[2]}}{${N}}=${f3(ps[2])}$`);

    const mx = Math.max(...ps), mn = Math.min(...ps);
    cJ(mx - mn < .02
      ? '三种球一样多，三个概率相等，分布列是均匀的'
      : mx > .7 ? `颜色 ${ps.indexOf(mx) + 1} 的球占了大半，摸到它的机会远大于其余两种`
        : `颜色 ${ps.indexOf(mx) + 1} 的球最多，对应的概率最大；三个概率始终非负且和为 1`);
  };

  B.slider('红球 n1', 1, 9, 1, st.n1, v => { st.n1 = v; B.render(); }, 'n1');
  B.slider('蓝球 n2', 1, 9, 1, st.n2, v => { st.n2 = v; B.render(); }, 'n2');
  B.slider('金球 n3', 1, 9, 1, st.n3, v => { st.n3 = v; B.render(); }, 'n3');

  B.hint('每个概率都在 0 与 1 之间，三个加起来正好是 1');
  B.render();
  return B;
}
