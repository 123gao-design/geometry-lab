/* 图 定4 · 反常积分机：把界限推到无穷，或把奇点挪到眼前
   ① 无穷限：∫_1^B x^(−p)dx，B 一步步推远，看这块面积有没有上限；
   ② 瑕积分：∫_ε^1 x^(−p)dx，ε 一步步贴近 0，看面积会不会爆掉。
   两条判据都得看 p 与 1 的大小。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, p: 1.6, t: 4 };
  const cA = B.chipM('截止值'), cI = B.chipM('极限值'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const p = st.p, inf = st.k === 0;
    const f = x => Math.pow(x, -p);
    const m = inf
      ? B.mapFit(0.8, 8.2, -0.15, 2.6, [46, 58, 564, 300], 14)
      : B.mapFit(-0.06, 1.1, -0.15, 2.6, [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: inf ? [1, 2, 3, 4, 5, 6, 7, 8] : [0.2, 0.4, 0.6, 0.8, 1], yt: [1, 2] });

    const lo = inf ? 1 : st.t, hi = inf ? st.t : 1;
    // 面积填充
    let d = `M${m.px(lo)} ${m.py(0)} `;
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const x = lo + (hi - lo) * i / N;
      d += `L${m.px(x).toFixed(1)} ${m.py(Math.min(f(x), 2.6)).toFixed(1)} `;
    }
    d += `L${m.px(hi)} ${m.py(0)} Z`;
    mk('path', { d, fill: '#4ade80', 'fill-opacity': .18, stroke: 'none' }, B.dyn);
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: inf ? 1 : 0.06, x1: inf ? 8 : 1, pad: 2 });
    B.seg(V(m.px(st.t), m.py(0)), V(m.px(st.t), m.py(Math.min(f(st.t), 2.6))), { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
    B.tex(V(m.px(st.t) + 6, m.py(0) - 8), inf ? `$B=${fmt(st.t, 2)}$` : `$\\varepsilon=${fmt(st.t, 2)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });

    const cut = Math.abs(p - 1) < 1e-9
      ? (inf ? Math.log(st.t) : -Math.log(st.t))
      : (inf ? (1 - Math.pow(st.t, 1 - p)) / (p - 1) : (Math.pow(st.t, 1 - p) - 1) / (1 - p));
    const conv = inf ? p > 1 : p < 1;
    const lim = Math.abs(p - 1) < 1e-9 ? Infinity : (inf ? 1 / (p - 1) : 1 / (1 - p));

    B.textM(V(636, 84), inf ? '无穷限：把上限推到 ∞' : '瑕积分：把下限压到 0', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    const limTxt = inf ? '_1^{B}' : '_{\\varepsilon}^{1}';
    B.tex(V(636, 122), `$\\int ${limTxt} x^{-p}\\,\\mathrm{d}x$`, { size: 12, color: '#4ade80', anchor: 'start' });
    B.tex(V(636, 164), `$p=${fmt(p, 2)}$，${inf ? '上' : '下'}限 $=${fmt(st.t, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.tex(V(636, 204), `$=${fmt(cut, 4)}$`, { size: 12.5, color: '#ffd166', anchor: 'start' });
    B.tex(V(636, 254), conv ? `$\\to ${fmt(lim, 4)}$（收敛）` : '$\\to \\infty$（发散）', { size: 13, color: conv ? '#4ade80' : '#ff9e4a', anchor: 'start' });
    B.textM(V(636, 300), inf ? 'p>1 收敛，p≤1 发散' : 'p<1 收敛，p≥1 发散', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cA(`$=${fmt(cut, 4)}$`);
    cI(conv ? `$=${fmt(lim, 4)}$` : '发散');
    if (conv) cJ(inf ? '$p>1$：尾巴够瘦，面积有上限，把上限推远只是逼近它' : '$p<1$：奇点旁够矮，面积有上限，把下限压近只是逼近它', 'ok');
    else cJ(inf ? '$p\\le1$：尾巴不够瘦，上限一推面积就跟着长' : '$p\\ge1$：奇点旁太高，下限一压面积就爆');
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const bts = ['① $\\int_1^{\\infty}$', '② $\\int_0^1$'].map((t, i) => B.btnM(t, () => {
    st.k = i; st.t = i === 0 ? 4 : 0.4;
    sB.sync(st.t); sE.sync(st.t);
    show(sB, i === 0); show(sE, i === 1);
    bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('p =', 0.3, 2.5, 0.01, st.p, v => { st.p = v; B.render(); }, 'p');
  const sB = B.slider('B =', 1.6, 7.5, 0.05, st.t, v => { st.t = v; B.render(); }, 'B');
  const sE = B.slider('ε =', 0.05, 0.9, 0.01, st.t, v => { st.t = v; B.render(); }, 'e');
  show(sE, false);
  B.hintM('先把 $p$ 拖到 1 的两侧试试：指数差一点，面积就有上限与无上限之分');
  B.render();
  return B;
}
