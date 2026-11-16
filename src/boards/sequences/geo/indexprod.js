/* 图 比2 · 下标积机
   等比数列中若 m+n=p+q，则 a_m·a_n=a_p·a_q。取以 c 为中心的两对：(c−1,c+1) 与 (c−2,c+2)，
   两对下标和同为 2c，项积同为 a_c²。上栏画各项，下栏画三根等高的乘积条。
   局部坐标：上栏 rect=[84,58,660,150]，下栏 rect=[130,250,600,130]。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 450;
  const B = new Board(root, W, H);
  const st = { a1: 2, q: 2, c: 6, grid: true, labs: true };
  const PRE = [{ nm: '① q=2', a1: 2, q: 2 }, { nm: '② q=0.5', a1: 16, q: 0.5 }];
  const val = k => st.a1 * st.q ** (k - 1);
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const cSub = B.chipM('下标和'), cProd = B.chipM('项积'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const c = st.c, ac = val(c);
    const all = Array.from({ length: 10 }, (_, i) => val(i + 1));
    const lo = Math.min(...all, 0), hi = Math.max(...all);
    const m = B.mapFit(-0.4, 11.4, lo - (hi - lo) * .1, hi + (hi - lo) * .1, [84, 58, 660, 150], 0);
    const step = nice((hi - lo) / 4);
    B.grid({ ...m, sx: 1, sy: step, lx: 1, ly: step, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      axLab: 'n', ayLab: 'a', grid: st.grid, labs: st.labs });
    B.seg(V(m.px(c), m.py(lo)), V(m.px(c), m.py(hi)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 5', 'stroke-opacity': .8 });
    for (let k = 1; k <= 10; k++) B.dot(V(m.px(k), m.py(val(k))), 3.6, { fill: '#5cadff', 'fill-opacity': .5 });
    const pair = (k, col, lab) => {
      B.dot(V(m.px(k), m.py(val(k))), 5, { fill: col, stroke: '#0a0d14', 'stroke-width': 1.1 });
      B.tex(V(m.px(k), m.py(val(k)) - 16), lab, { size: 10.5, anchor: 'mid', color: col, w: 80 });
    };
    pair(c - 1, '#5cadff', `$a_{${c - 1}}$`); pair(c + 1, '#5cadff', `$a_{${c + 1}}$`);
    pair(c - 2, '#ff9e4a', `$a_{${c - 2}}$`); pair(c + 2, '#ff9e4a', `$a_{${c + 2}}$`);
    B.dot(V(m.px(c), m.py(ac)), 5.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(m.px(c), m.py(ac) - 16), `$a_{${c}}$`, { size: 11, anchor: 'mid', color: '#ffd166', w: 80 });
    // 下栏：三根等高乘积条
    const P1 = val(c - 1) * val(c + 1), P2 = val(c - 2) * val(c + 2), Pc = ac * ac;
    const top = Math.max(P1, P2, Pc);
    const rect = [130, 250, 600, 130], yB = rect[1] + rect[3];
    const bw = 120, gap = 60;
    const xs = [rect[0] + 55, rect[0] + 55 + bw + gap, rect[0] + 55 + 2 * (bw + gap)];
    const bars = [
      { x: xs[0], v: P1, col: '#5cadff', lab: `$a_{${c - 1}}\\cdot a_{${c + 1}}$` },
      { x: xs[1], v: P2, col: '#ff9e4a', lab: `$a_{${c - 2}}\\cdot a_{${c + 2}}$` },
      { x: xs[2], v: Pc, col: '#ffd166', lab: `$a_{${c}}^2$` },
    ];
    for (const b of bars) {
      const h = (rect[3] - 26) * b.v / top;
      mk('rect', { x: b.x, y: yB - h, width: bw, height: h, fill: b.col, 'fill-opacity': .3,
        stroke: b.col, 'stroke-width': 1.2 }, B.dyn);
      B.tex(V(b.x + bw / 2, yB - h - 14), `$${fmt(b.v, 0)}$`, { size: 12, anchor: 'mid', color: b.col, w: 130 });
      B.tex(V(b.x + bw / 2, yB + 18), b.lab, { size: 11.5, anchor: 'mid', color: b.col, w: 200 });
    }
    // 等高线
    B.seg(V(rect[0], yB - (rect[3] - 26)), V(rect[0] + rect[2], yB - (rect[3] - 26)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '6 5' });
    B.tex(V(rect[0], 240), '三组乘积等高：下标和相等，项积也相等', { size: 13, anchor: 'start', color: '#93a1b5', w: 620 });
    // 徽章
    cSub(`$${c - 2}+${c + 2}=${c - 1}+${c + 1}=${2 * c}$`);
    cProd(`$a_{${c - 2}}a_{${c + 2}}=a_{${c - 1}}a_{${c + 1}}=a_{${c}}^2=${fmt(Pc, 0)}$`);
    cJ(st.q > 1 ? '$q>1$：乘积随下标居中而增大' : '$0<q<1$：乘积随下标居中而减小');
  };

  const slA = B.slider('首项 a₁', 1, 4, 1, 2, v => { st.a1 = v; B.render(); });
  const slQ = B.slider('公比 q', 0.5, 2, 0.5, 2, v => { st.q = v; B.render(); });
  B.slider('中心 c', 3, 8, 1, 6, v => { st.c = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.q = p.q;
    slA.sync(st.a1); slQ.sync(st.q);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('换中心 c：两对项各换位置，三根乘积条始终等高');
  B.render();
  return B;
}
