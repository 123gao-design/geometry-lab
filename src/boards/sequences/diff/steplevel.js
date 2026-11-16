/* 图 等3b · 台阶削平机
   每一项画成一列竖条，高度 a_k；金色矩形高取平均高度 m=(a_1+a_n)/2。
   a_k 在 m 上方的部分（绿）与对称项 n+1−k 在 m 下方的不足（红）等量 —— 台阶关于矩形中心中心对称，
   削平后正好填满矩形，面积 n·m 就是 S_n。与倒序相加是两个方向：一个拼列，一个削平。
   局部坐标：柱区 x∈[60,660]、基线 y=400。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { a1: 1, d: 1, n: 6, k: 2 };
  const PRE = [
    { nm: '① 从 1 起', a1: 1, d: 1 },
    { nm: '② 公差 2', a1: 2, d: 2 },
    { nm: '③ 大首项', a1: 5, d: 1 },
  ];
  const val = k => st.a1 + (k - 1) * st.d;
  const cM = B.chipM('平均高度'), cA = B.chipM('矩形面积'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const n = st.n, k = Math.min(st.k, st.n), a1 = st.a1, an = val(n);
    const m = (a1 + an) / 2, S = n * m;
    const X0 = 60, BW = 600, yB = 400, yT = 70;
    const top = Math.max(a1, an);
    const sc = (yB - yT) / (top * 1.1);
    const cw = BW / n, bw = cw * 0.8;
    // 金色矩形：宽 n、高 m
    mk('rect', { x: X0, y: yB - m * sc, width: BW, height: m * sc, fill: 'none',
      stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-dasharray': '7 5' }, B.dyn);
    // 每一列：整条柱 + 高出部分（绿）/ 不足部分（红）
    for (let i = 1; i <= n; i++) {
      const x = X0 + (i - 1) * cw + (cw - bw) / 2, v = val(i);
      const sel = i === k || i === n + 1 - k;
      mk('rect', { x, y: yB - v * sc, width: bw, height: v * sc, fill: '#5cadff', 'fill-opacity': .26,
        stroke: sel ? '#ffd166' : '#5cadff', 'stroke-width': sel ? 2.2 : 1.1 }, B.dyn);
      if (v > m)
        mk('rect', { x, y: yB - v * sc, width: bw, height: (v - m) * sc, fill: '#4ade80', 'fill-opacity': .6,
          stroke: '#4ade80', 'stroke-width': 1 }, B.dyn);
      else if (v < m)
        mk('rect', { x, y: yB - m * sc, width: bw, height: (m - v) * sc, fill: '#ff7b8a', 'fill-opacity': .45,
          stroke: '#ff7b8a', 'stroke-width': 1 }, B.dyn);
      B.text(V(x + bw / 2, yB + 20), String(i), { 'font-size': 12, fill: sel ? '#ffd166' : '#93a1b5', 'font-weight': sel ? 700 : 400 });
    }
    // 选中一对的高度与读数
    for (const i of [k, n + 1 - k]) {
      const x = X0 + (i - 1) * cw + (cw - bw) / 2, v = val(i);
      B.tex(V(x + bw / 2, yB - v * sc - 14), `$${fmt(v, 0)}$`,
        { size: 11.5, anchor: 'mid', color: v > m ? '#4ade80' : v < m ? '#ff7b8a' : '#ffd166', w: 60 });
    }
    // 中心点与对称提示
    B.dot(V(X0 + BW / 2, yB - m * sc), 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    // 平均高度线
    B.seg(V(X0, yB - m * sc), V(X0 + BW, yB - m * sc), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '2 4' });
    // 右侧读数
    B.seg(V(672, 70), V(672, 400), { stroke: '#2b4260', 'stroke-width': 1 });
    B.tex(V(682, 128), '平均高度', { size: 12, anchor: 'start', color: '#93a1b5', w: 160 });
    B.tex(V(682, 160), `$m=\\dfrac{a_1+a_n}{2}=${fmt(m, 1)}$`, { size: 13, anchor: 'start', w: 165 });
    B.tex(V(682, 218), '矩形面积', { size: 12, anchor: 'start', color: '#93a1b5', w: 160 });
    B.tex(V(682, 250), `$n\\cdot m=${n}\\times${fmt(m, 1)}=${fmt(S, 1)}$`, { size: 13, anchor: 'start', w: 165 });
    B.tex(V(682, 308), '台阶面积', { size: 12, anchor: 'start', color: '#93a1b5', w: 160 });
    B.tex(V(682, 340), `$S_n=a_1+\\dots+a_n=${fmt(S, 1)}$`, { size: 12.5, anchor: 'start', w: 165 });
    // 标题
    B.tex(V(60, 30), '台阶被平均高度线削平：高出的绿块正好填进红色的缺口', { size: 14, anchor: 'start', w: 600 });
    // 徽章
    cM(`$\\dfrac{a_1+a_n}{2}=${fmt(m, 1)}$`);
    cA(`$n\\cdot m=${fmt(S, 1)}$`);
    cJ(`第 ${k} 项与第 ${n + 1 - k} 项关于 $m$ 对称：${fmt(val(k), 0)} 与 ${fmt(val(n + 1 - k), 0)} 的平均是 ${fmt(m, 1)}`);
  };

  const slA = B.slider('首项 a₁', 1, 8, 1, 1, v => { st.a1 = v; B.render(); });
  const slD = B.slider('公差 d', 0, 2, 1, 1, v => { st.d = v; B.render(); });
  const slK = B.slider('第 k 列', 1, 6, 1, 2, v => { st.k = v; B.render(); });
  const slN = B.slider('n =', 2, 10, 1, 6, v => {
    st.n = v; st.k = Math.min(st.k, v);
    slK.setAttribute('max', v); slK.sync(st.k);
    B.render();
  });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.d = p.d;
    slA.sync(st.a1); slD.sync(st.d);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('拖 d 与 n：绿块面积始终等于红块面积，台阶总能削成矩形');
  B.render();
  return B;
}
