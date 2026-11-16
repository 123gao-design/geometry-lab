/* 图 概2b · 几何概型
   ① 长度型：在线段 [0,6] 上随机取一点，落在 [a,b] 内的概率是长度之比 (b−a)/6。
   ② 面积型：在正方形内随机撒点，落在圆内的概率是面积之比 πr²/边长²。
   两种情形都撒同一批固定随机点，用它们的频率去逼近比值 —— 几何概型的概率只与测度有关。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, a: 1.4, b: 3.8, r: 88 };
  const cP = B.chipM('概率'), cF = B.chipM('频率'), cJ = B.chipM('判读');

  let seed = 7717;
  const rnd = () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const U = Array.from({ length: 480 }, rnd);

  const X0 = 110, X1 = 710, SEG = 6;          // 线段 [0,6] 的两个端点
  const ux = u => X0 + (X1 - X0) * u / SEG;
  const SQ = { x: 260, y: 46, s: 280 };
  const CEN = V(SQ.x + SQ.s / 2, SQ.y + SQ.s / 2);

  const hide = (el, on) => { const w = el.parentNode || el.parent; if (w) w.style.display = on ? '' : 'none'; };

  B.renderFn = () => {
    const a = Math.min(st.a, st.b - .2), b = Math.max(st.b, st.a + .2);

    if (st.mode === 0) {
      B.dyn.appendChild(mk('line', {
        x1: X0, y1: 240, x2: X1, y2: 240, stroke: '#aebdd2', 'stroke-width': 2.4,
      }, B.dyn));
      for (let k = 0; k <= SEG; k++) {
        B.dyn.appendChild(mk('line', {
          x1: ux(k), y1: 234, x2: ux(k), y2: 246, stroke: '#8fa3bd', 'stroke-width': 1.2,
        }, B.dyn));
        B.text(V(ux(k), 264), `${k}`, { fill: '#8fa3bd', 'font-size': 11.5 });
      }
      B.dyn.appendChild(mk('rect', {
        x: ux(a), y: 228, width: ux(b) - ux(a), height: 24, rx: 4,
        fill: '#ffd166', 'fill-opacity': .3, stroke: '#ffd166', 'stroke-width': 1.2,
      }, B.dyn));
      B.text(V(ux(a), 220), `${a.toFixed(1)}`, { fill: '#ffd166', 'font-size': 11.5 });
      B.text(V(ux(b), 220), `${b.toFixed(1)}`, { fill: '#ffd166', 'font-size': 11.5 });

      let cnt = 0;
      U.forEach(u => {
        const ins = u >= a && u <= b;
        if (ins) cnt++;
        B.dot(V(ux(u), 300 + (u * 37 % 1) * 18), 2.6, {
          fill: ins ? '#ffd166' : '#8fa3bd', 'fill-opacity': ins ? .95 : .3,
        });
      });
      B.text(V((X0 + X1) / 2, 340), `撒 ${U.length} 个点，落进 [a,b] 的有 ${cnt} 个`, { fill: '#8fa3bd', 'font-size': 12 });

      const pr = (b - a) / SEG;
      cP(`$\\dfrac{${b.toFixed(1)}-${a.toFixed(1)}}{6}\\approx${pr.toFixed(3)}$`);
      cF(`$\\dfrac{${cnt}}{${U.length}}=${(cnt / U.length).toFixed(3)}$`);
      cJ(`概率只由长度之比定，与点落在哪一段无关；撒的点越多，频率越贴近 ${pr.toFixed(3)}`);
    } else {
      B.dyn.appendChild(mk('rect', {
        x: SQ.x, y: SQ.y, width: SQ.s, height: SQ.s, rx: 8,
        fill: 'rgba(139,163,189,.05)', stroke: '#3f5f8f', 'stroke-width': 1.2,
      }, B.dyn));
      B.dyn.appendChild(mk('circle', {
        cx: CEN.x, cy: CEN.y, r: st.r, fill: 'rgba(92,173,255,.05)', stroke: '#5cadff', 'stroke-width': 1.8,
      }, B.dyn));

      let cnt = 0;
      for (let i = 0; i + 1 < U.length; i += 2) {
        const p = V(SQ.x + U[i] * SQ.s, SQ.y + U[i + 1] * SQ.s);
        const ins = Math.hypot(p.x - CEN.x, p.y - CEN.y) <= st.r;
        if (ins) cnt++;
        B.dot(p, 2.6, { fill: ins ? '#ffd166' : '#8fa3bd', 'fill-opacity': ins ? .95 : .3 });
      }
      const nm = Math.floor(U.length / 2);
      B.text(V(CEN.x, SQ.y + SQ.s + 26), `撒 ${nm} 个点，落进圆内的有 ${cnt} 个`, { fill: '#8fa3bd', 'font-size': 12 });

      const pr = Math.PI * st.r * st.r / (SQ.s * SQ.s);
      cP(`$\\dfrac{\\pi\\cdot${st.r}^{2}}{${SQ.s}^{2}}\\approx${pr.toFixed(3)}$`);
      cF(`$\\dfrac{${cnt}}{${nm}}=${(cnt / nm).toFixed(3)}$`);
      cJ(`圆半径 ${st.r} 时面积之比约 ${pr.toFixed(3)}；改成方框外的形状也一样，只要区域能算出面积`);
    }
  };

  const sa = B.slider('左端 a', 0, 5.4, .2, st.a, v => { st.a = v; B.render(); }, 'a');
  const sb = B.slider('右端 b', .6, 6, .2, st.b, v => { st.b = v; B.render(); }, 'b');
  const sr = B.slider('半径 r', 20, 130, 2, st.r, v => { st.r = v; B.render(); }, 'r');

  const btns = [['① 长度型', 0], ['② 面积型', 1]].map(([nm, md], i) => B.btn(nm, () => {
    st.mode = md;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    hide(sa, md === 0); hide(sb, md === 0); hide(sr, md === 1);
    B.render();
  }, { on: i === 0 }));
  hide(sr, true);

  B.hint('概率就是长度比或面积比，撒点的频率只是把它量出来');
  B.render();
  return B;
}
