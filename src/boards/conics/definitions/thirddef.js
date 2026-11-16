/* 图 D5 · 第三定义：k(PA)·k(PB) = −b²/a²（椭圆）/ +b²/a²（双曲线），A、B 为 x 轴上的两顶点 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 480;
  const B = new Board(root, W, H);
  const st = { mode: 'e', cx: 400, cy: 244, a: 170, b: 105, t: 0.85, s: 1 };

  const isE = () => st.mode === 'e';
  const ptE = t => V(st.cx + st.a * Math.cos(t), st.cy + st.b * Math.sin(t));
  const ptH = (s, t) => V(st.cx + s * st.a / Math.cos(t), st.cy + st.b * Math.tan(t));
  const pt = () => isE() ? ptE(st.t) : ptH(st.s, st.t);

  const cK1 = B.chip('k(PA)'), cK2 = B.chip('k(PB)'), cProd = B.chipM('$k_1\\cdot k_2$');
  const sA = B.slider('a', 90, 200, 1, st.a, v => { st.a = v; B.render(); });
  const sB = B.slider('b', 50, 160, 1, st.b, v => { st.b = v; B.render(); });
  B.toggleBtn('双曲线模式', false, on => {
    st.mode = on ? 'h' : 'e';
    if (on) { st.a = 95; st.b = 110; } else { st.a = 170; st.b = 105; }
    sA.value = st.a; sA.dispatchEvent(new Event('input'));
    sB.value = st.b; sB.dispatchEvent(new Event('input'));
  });

  const drawCurve = at => {
    if (isE()) {
      const pts = [];
      for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.035) { const p = ptE(t); pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`); }
      mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
    } else for (const s of [1, -1]) {
      const pts = [];
      for (let t = -1.32; t <= 1.32 + 1e-9; t += 0.03) { const p = ptH(s, t); pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`); }
      mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
    }
  };

  B.renderFn = () => {
    const { cx, cy, a, b } = st, P = pt(), pA = V(cx - a, cy), pB = V(cx + a, cy);
    // 轴
    B.seg(V(24, cy), V(W - 24, cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(cx, 18), V(cx, H - 18), { stroke: '#22314a', 'stroke-width': 1.5 });
    if (!isE()) for (const dir of [V(a, b), V(a, -b)]) // 双曲线渐近线
      B.inf(V(cx, cy), V(cx + dir.x, cy + dir.y), { stroke: '#3a4a63', 'stroke-width': 1.2, 'stroke-dasharray': '6 6' });
    drawCurve({ stroke: '#67e8f9', 'stroke-width': 2.6 });
    // 两定点 A、B（x 轴上的顶点）
    for (const [p, nm] of [[pA, 'A(−a, 0)'], [pB, 'B(a, 0)']]) {
      B.dot(p, 6, { fill: '#fff', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(p.x, p.y + 20), nm, { fill: '#93a1b5', 'font-size': 12 });
    }
    // 两条斜率线
    B.seg(P, pA, { stroke: '#4ade80', 'stroke-width': 2.4 });
    B.seg(P, pB, { stroke: '#c084fc', 'stroke-width': 2.4 });
    B.dot(P, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 14), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    // 斜率读数（P 逼近 A 或 B 时一条斜率趋于无穷 → 退化提示）
    const dx1 = P.x - pA.x, dx2 = P.x - pB.x;
    if (Math.abs(dx1) < 3 || Math.abs(dx2) < 3) {
      cK1('—'); cK2('—'); cProd('P 与顶点重合：斜率不存在（退化情形）', 'warn');
    } else {
      const k1 = (P.y - cy) / dx1, k2 = (P.y - cy) / dx2, prod = k1 * k2;
      const target = (isE() ? -1 : 1) * b * b / (a * a);
      const m1 = V((P.x + pA.x) / 2, (P.y + pA.y) / 2), m2 = V((P.x + pB.x) / 2, (P.y + pB.y) / 2);
      B.textM(V(m1.x - 10, m1.y - 10), `$k_1=${fmt(k1, 2)}$`, { fill: '#4ade80', 'font-size': 12, 'text-anchor': 'end' });
      B.textM(V(m2.x + 10, m2.y - 10), `$k_2=${fmt(k2, 2)}$`, { fill: '#c084fc', 'font-size': 12, 'text-anchor': 'start' });
      cK1(fmt(k1, 3)); cK2(fmt(k2, 3));
      cProd(`${fmt(prod, 3)}　vs　${isE() ? '−' : '+'}b²/a² = ${fmt(target, 3)}`, Math.abs(prod - target) < 0.02 ? 'ok' : 'warn');
    }
    B.hint(isE()
      ? '拖动 P：绿紫两线斜率之积恒为 −b²/a²（= e²−1）。圆是它的特例：乘积恰好 −1'
      : '拖动 P（可换支）：斜率之积恒为 +b²/a² —— 与椭圆只差一个符号');
  };

  B.handle({
    get: pt,
    set: p => {
      if (isE()) st.t = Math.atan2((p.y - st.cy) / st.b, (p.x - st.cx) / st.a);
      else {
        st.s = p.x >= st.cx ? 1 : -1;
        st.t = Math.max(-1.3, Math.min(1.3, Math.atan((p.y - st.cy) / st.b)));
      }
    },
    color: '#67e8f9', r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
