/* 图 T1 · 切线实验台：拖动 P，切线/法线/梯度实时可算（判别式法 / 导数法 / 偏导法 / 极线公式四种求法同一答案）
   局部坐标（以曲线中心/顶点为原点）：
   椭圆  u²/a²+v²/b²=1   切线方向 (−a²v, b²u)   梯度 ∇F=(2u₀/a², 2v₀/b²)   切线 u·u₀/a²+v·v₀/b²=1
   双曲线 u²/a²−v²/b²=1   切线方向 ( a²v, b²u)   梯度 ∇F=(2u₀/a², −2v₀/b²)  切线 u·u₀/a²−v·v₀/b²=1
   抛物线 v²=2pu          切线方向 ( v₀, p)      梯度 ∇F=(−2p, 2v₀)        切线 v·v₀=p(u+u₀) */
import { mk, V, add, mul, norm, dist, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 800, H = 480;
  const B = createConicLab(root, W, H);
  const st = { mode: 'e', cx: 400, cy: 250, a: 180, b: 112, p: 150, vx: 240, t: 0.8, s: 1, u: 120, normal: false, grad: false };

  const isE = () => st.mode === 'e', isH = () => st.mode === 'h', isP = () => st.mode === 'p';
  const P = () => {
    if (isE()) return V(st.cx + st.a * Math.cos(st.t), st.cy + st.b * Math.sin(st.t));
    if (isH()) return V(st.cx + st.s * st.a / Math.cos(st.t), st.cy + st.b * Math.tan(st.t));
    return V(st.vx + st.u * st.u / (2 * st.p), st.cy + st.u);
  };

  const cEq = B.chip('切线方程（局部坐标）'), cK = B.chip('切线斜率 k'), cR = B.chip('焦半径'), cG = B.chip('梯度 ∇F(P)');

  const sA = B.slider('a', 90, 200, 1, st.a, v => { st.a = v; B.render(); });
  const sB = B.slider('b', 50, 160, 1, st.b, v => { st.b = v; B.render(); });
  const sP = B.slider('焦参数 p', 90, 200, 1, st.p, v => { st.p = v; B.render(); });
  const syncSliders = () => {
    sA.parentElement.style.display = isP() ? 'none' : '';
    sB.parentElement.style.display = isP() ? 'none' : '';
    sP.parentElement.style.display = isP() ? '' : 'none';
  };
  const btns = {};
  const setMode = m => {
    st.mode = m;
    if (m === 'e') { st.a = 180; st.b = 112; }
    if (m === 'h') { st.a = 95; st.b = 115; }
    if (isP()) st.p = 150;
    for (const k in btns) btns[k].classList.toggle('on', k === m);
    sA.value = st.a; sA.dispatchEvent(new Event('input'));
    sB.value = st.b; sB.dispatchEvent(new Event('input'));
    sP.value = st.p; sP.dispatchEvent(new Event('input'));
    syncSliders(); B.render();
  };
  for (const [k, lab] of [['e', '椭圆'], ['h', '双曲线'], ['p', '抛物线']])
    btns[k] = B.btn(lab, () => setMode(k));
  btns.e.classList.add('on');
  syncSliders();
  B.toggleBtn('显示法线', false, on => { st.normal = on; B.render(); });
  B.toggleBtn('显示梯度 ∇F', false, on => { st.grad = on; B.render(); });

  B.renderFn = () => {
    const p = P(), u0 = p.x - (isP() ? st.vx : st.cx), v0 = p.y - st.cy;
    // 轴
    B.seg(V(20, st.cy), V(W - 20, st.cy), { stroke: plotInk.axis, 'stroke-width': 1.5 });
    B.seg(V(isP() ? st.vx : st.cx, 16), V(isP() ? st.vx : st.cx, H - 16), { stroke: plotInk.axis, 'stroke-width': 1.5 });
    // 曲线
    if (isE()) {
      const pts = [];
      for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
        pts.push(`${(st.cx + st.a * Math.cos(t)).toFixed(1)},${(st.cy + st.b * Math.sin(t)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
      const c = Math.sqrt(st.a * st.a - st.b * st.b);
      for (const [f, nm] of [[V(st.cx - c, st.cy), 'F₁'], [V(st.cx + c, st.cy), 'F₂']]) {
        B.dot(f, 5.5, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.8 });
        B.text(V(f.x, f.y + 19), nm, { fill: plotInk.amber, 'font-size': 12, 'font-weight': 700 });
      }
      cR(`c=√(a²−b²)=${fmt(c, 1)}`);
    } else if (isH()) {
      for (const dir of [V(st.a, st.b), V(st.a, -st.b)])
        B.inf(V(st.cx, st.cy), V(st.cx + dir.x, st.cy + dir.y), { stroke: plotInk.rule, 'stroke-width': 1.2, 'stroke-dasharray': '6 6' });
      for (const s of [1, -1]) {
        const pts = [];
        for (let t = -1.35; t <= 1.35 + 1e-9; t += 0.03)
          pts.push(`${(st.cx + s * st.a / Math.cos(t)).toFixed(1)},${(st.cy + st.b * Math.tan(t)).toFixed(1)}`);
        mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
      }
      const c = Math.sqrt(st.a * st.a + st.b * st.b);
      for (const [f, nm] of [[V(st.cx - c, st.cy), 'F₁'], [V(st.cx + c, st.cy), 'F₂']]) {
        B.dot(f, 5.5, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.8 });
        B.text(V(f.x, f.y + 19), nm, { fill: plotInk.amber, 'font-size': 12, 'font-weight': 700 });
      }
      cR(`c=√(a²+b²)=${fmt(c, 1)}`);
    } else {
      const pts = [];
      for (let u = -220; u <= 220; u += 4) pts.push(`${(st.vx + u * u / (2 * st.p)).toFixed(1)},${(st.cy + u).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
      const f = V(st.vx + st.p / 2, st.cy), lx = st.vx - st.p / 2;
      B.seg(V(lx, 16), V(lx, H - 16), { stroke: plotInk.teal, 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
      B.dot(f, 5.5, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.8 });
      B.text(V(f.x, f.y + 19), 'F', { fill: plotInk.amber, 'font-size': 12.5, 'font-weight': 700 });
      cR(`p = ${fmt(st.p, 0)}，F = (${fmt(st.p / 2, 0)}, 0)`);
    }
    // 切线 / 法线（方向由模式决定，见文件头）
    const d = isE() ? V(-st.a * st.a * v0, st.b * st.b * u0)
      : isH() ? V(st.a * st.a * v0, st.b * st.b * u0)
        : V(v0, st.p);
    B.inf(p, add(p, d), { stroke: plotInk.ink, 'stroke-width': 2 });
    if (st.normal) {
      const n = isE() ? V(st.b * st.b * u0, st.a * st.a * v0)
        : isH() ? V(st.b * st.b * u0, -st.a * st.a * v0)
          : V(st.p, -v0);
      B.inf(p, add(p, n), { stroke: plotInk.violet, 'stroke-width': 1.6, 'stroke-dasharray': '7 6' });
      B.text(V(p.x + 30, p.y - 26), '法线', { fill: plotInk.violet, 'font-size': 11.5 });
    }
    // 梯度 ∇F（等值线的法向）：F_x·(x−x₀) + F_y·(y−y₀) = 0 —— 切线方程的"线性化"来源
    if (st.grad) {
      const g = isE() ? V(2 * u0 / (st.a * st.a), 2 * v0 / (st.b * st.b))
        : isH() ? V(2 * u0 / (st.a * st.a), -2 * v0 / (st.b * st.b))
          : V(-2 * st.p, 2 * v0);
      const L = Math.hypot(g.x, g.y) || 1, n = V(g.x / L, g.y / L), tip = add(p, mul(n, 62));
      B.seg(p, tip, { stroke: plotInk.amber, 'stroke-width': 2.4 });
      const ha = Math.atan2(n.y, n.x);
      for (const da of [2.6, -2.6])
        B.seg(tip, add(tip, mul(V(Math.cos(ha + da), Math.sin(ha + da)), 11)), { stroke: plotInk.amber, 'stroke-width': 2.2 });
      B.text(V(tip.x + n.x * 14, tip.y + n.y * 14 + 4), '∇F', { fill: plotInk.amber, 'font-size': 12.5, 'font-weight': 700 });
      const sy = isH() ? '−' : '+';
      if (isP()) cG(`(−2p, 2y₀) = (${fmt(-2 * st.p, 1)}, ${fmt(2 * v0, 1)})`, 'ok');
      else cG(`(2x₀/a², ${sy}2y₀/b²) = (${fmt(g.x, 4)}, ${fmt(g.y, 4)})`, 'ok');
    } else cG('打开「梯度 ∇F」开关');
    B.text(V(p.x + 26, p.y - 10), '切线', { fill: plotInk.ink, 'font-size': 11.5 });
    B.dot(p, 6.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 2 });
    // 读数
    if (isE()) cEq(`${fmt(u0 / (st.a * st.a), 3)}·x + ${fmt(v0 / (st.b * st.b), 3)}·y = 1`, 'ok');
    else if (isH()) cEq(`${fmt(u0 / (st.a * st.a), 3)}·x − ${fmt(v0 / (st.b * st.b), 3)}·y = 1`, 'ok');
    else cEq(`${fmt(v0, 1)}·y = ${fmt(st.p, 0)}·(x + ${fmt(u0, 1)})`, 'ok');
    cK(Math.abs(d.x) < 1e-6 ? '∞（竖直切线，切点在顶点）' : fmt(d.y / d.x, 3));
    B.hint(st.grad
      ? '金色箭头是 ∇F —— 切线方向 (dx,dy) 恒满足 F_x·dx + F_y·dy = 0，所以切线 ⟂ 梯度；一行推导就把切线方程和极线公式都造出来了'
      : isP()
        ? '拖动 P：切线永远平分"焦点线 PF 与轴的平行线"的夹角 —— 这是下一讲抛物线聚光的全部原因'
        : '拖动 P：切线平分两焦半径夹角的外角（椭圆）/ 内角（双曲线）—— 切线的倾斜里写好了光学性质');
  };

  B.handle({
    get: P,
    set: q => {
      if (isE()) st.t = Math.atan2((q.y - st.cy) / st.b, (q.x - st.cx) / st.a);
      else if (isH()) {
        st.s = q.x >= st.cx ? 1 : -1;
        st.t = Math.max(-1.3, Math.min(1.3, Math.atan((q.y - st.cy) / st.b)));
      } else st.u = Math.max(-220, Math.min(220, q.y - st.cy));
    },
    color: plotInk.teal, r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
