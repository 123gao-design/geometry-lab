/* 图 D6 · 焦点三角形：S = b²·tan(θ/2)（椭圆）/ S = b²·cot(θ/2)（双曲线），θ 为 P 处张角 */
import { Board, mk, V, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 480;
  const B = new Board(root, W, H);
  const st = {
    mode: 'e', cx: 400, cy: 240,
    E: { a: 172, c: 98, t: 1.15 },   // 椭圆参数
    H: { a: 80, c: 150, t: 0.6, s: 1 }, // 双曲线参数
  };
  const isE = () => st.mode === 'e';
  const cur = () => isE() ? st.E : st.H;
  const bOf = () => isE() ? Math.sqrt(cur().a ** 2 - cur().c ** 2) : Math.sqrt(cur().c ** 2 - cur().a ** 2);
  const pt = () => {
    const { a, t } = cur(), b = bOf();
    return isE() ? V(st.cx + a * Math.cos(t), st.cy + b * Math.sin(t))
      : V(st.cx + cur().s * a / Math.cos(t), st.cy + b * Math.tan(t));
  };
  const F1 = () => V(st.cx - cur().c, st.cy), F2 = () => V(st.cx + cur().c, st.cy);

  const cTh = B.chipM('$\\theta=\\angle F_1PF_2$'), cS = B.chip('S 实测'), cF = B.chip('公式值'), cErr = B.chip('相对误差');

  const clampCA = () => {
    const P = cur();
    if (isE()) { if (P.c > P.a - 20) P.c = P.a - 20; }
    else if (P.c < P.a + 25) P.c = P.a + 25;
  };
  const syncSliders = () => {
    if (+sA.value !== cur().a) { sA.value = cur().a; sA.dispatchEvent(new Event('input')); }
    if (+sC.value !== cur().c) { sC.value = cur().c; sC.dispatchEvent(new Event('input')); }
  };
  const sA = B.slider('a', 60, 200, 1, st.E.a, v => { cur().a = v; clampCA(); syncSliders(); B.render(); });
  const sC = B.slider('c', 40, 220, 1, st.E.c, v => { cur().c = v; clampCA(); syncSliders(); B.render(); });
  B.toggleBtn('双曲线模式', false, on => {
    st.mode = on ? 'h' : 'e';
    syncSliders(); B.render();
  });

  const drawCurve = at => {
    const { a } = cur(), b = bOf(), pts = [];
    if (isE()) {
      for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.035)
        pts.push(`${(st.cx + a * Math.cos(t)).toFixed(1)},${(st.cy + b * Math.sin(t)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
    } else {
      for (const dir of [V(a, b), V(a, -b)])
        B.inf(V(st.cx, st.cy), V(st.cx + dir.x, st.cy + dir.y), { stroke: '#3a4a63', 'stroke-width': 1.2, 'stroke-dasharray': '6 6' });
      for (const s of [1, -1]) {
        const q = [];
        for (let t = -1.32; t <= 1.32 + 1e-9; t += 0.03)
          q.push(`${(st.cx + s * a / Math.cos(t)).toFixed(1)},${(st.cy + b * Math.tan(t)).toFixed(1)}`);
        mk('polyline', { points: q.join(' '), fill: 'none', ...at }, B.dyn);
      }
    }
  };

  // P 处的张角弧与 θ 标记
  const arcAt = (P, f1, f2) => {
    const a1 = Math.atan2(f1.y - P.y, f1.x - P.x), a2 = Math.atan2(f2.y - P.y, f2.x - P.x);
    let d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const r = 24, pts = [];
    for (let i = 0; i <= 16; i++) { const a = a1 + d * i / 16; pts.push(`${P.x + r * Math.cos(a)},${P.y + r * Math.sin(a)}`); }
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.8 }, B.dyn);
    const am = a1 + d / 2;
    B.text(V(P.x + (r + 17) * Math.cos(am), P.y + (r + 17) * Math.sin(am) + 4), 'θ', { fill: '#ffd166', 'font-size': 14, 'font-weight': 700 });
  };

  B.renderFn = () => {
    const { c } = cur(), b = bOf(), f1 = F1(), f2 = F2(), P = pt();
    B.seg(V(24, st.cy), V(W - 24, st.cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(st.cx, 18), V(st.cx, H - 18), { stroke: '#22314a', 'stroke-width': 1.5 });
    drawCurve({ stroke: '#67e8f9', 'stroke-width': 2.4 });
    // 焦点三角形
    mk('polygon', { points: `${P.x},${P.y} ${f1.x},${f1.y} ${f2.x},${f2.y}`, fill: 'rgba(92,173,255,.05)', stroke: 'none' }, B.dyn);
    B.seg(f1, f2, { stroke: '#5c6a80', 'stroke-width': 2 });
    B.seg(f1, P, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.seg(P, f2, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
    for (const [f, nm] of [[f1, 'F₁'], [f2, 'F₂']]) {
      B.dot(f, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(f.x, f.y + 20), nm, { fill: '#ffd166', 'font-size': 13, 'font-weight': 700 });
    }
    B.dot(P, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 14), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    arcAt(P, f1, f2);
    // 测量与公式对照
    const r1 = dist(P, f1), r2 = dist(P, f2);
    const cosT = (r1 * r1 + r2 * r2 - 4 * c * c) / (2 * r1 * r2);
    const th = Math.acos(Math.max(-1, Math.min(1, cosT)));
    const S = 0.5 * r1 * r2 * Math.sin(th);
    const formula = isE() ? b * b * Math.tan(th / 2) : b * b / Math.tan(th / 2);
    cTh(`${fmt(th * 180 / Math.PI, 1)}°`);
    cS(`½·r₁·r₂·sinθ = ${fmt(S, 1)}`);
    cF(`b²·${isE() ? 'tan' : 'cot'}(θ/2) = ${fmt(formula, 1)}`);
    cErr(fmt(Math.abs(S - formula) / Math.max(S, 1e-9) * 100, 3) + '%', Math.abs(S - formula) / Math.max(S, 1e-9) < 0.005 ? 'ok' : 'warn');
    B.hint(isE()
      ? '拖动 P：三角形胖瘦在变，面积却永远等于 b²·tan(θ/2) —— 推导见下文余弦定理那两行'
      : '双曲线版本：S = b²·cot(θ/2)。把 P 拖向远处：θ → 渐近线夹角的一半关系，面积随之膨胀');
  };

  B.handle({
    get: pt,
    set: p => {
      const P = cur(), b = bOf();
      if (isE()) P.t = Math.atan2((p.y - st.cy) / b, (p.x - st.cx) / P.a);
      else {
        P.s = p.x >= st.cx ? 1 : -1;
        P.t = Math.max(-1.3, Math.min(1.3, Math.atan((p.y - st.cy) / b)));
      }
    },
    color: '#67e8f9', r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
