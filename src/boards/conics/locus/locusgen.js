/* 图 P2 · 交轨法轨迹机：过 A(−a,0) 与 B(a,0) 的两直线斜率满足 k₁·k₂ = K（定值）
   K = −b²/a² → 椭圆；K = +b²/a² → 双曲线（平行的瞬间恰是渐近方向！）；K = −1 → 圆（Thales）
   拖动蓝线（或按「生成轨迹」），交点 P 的轨迹自动画出 —— D5 第三定义的构造版 */
import { Board, mk, V, add, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const Cy = 240, aa = 170;
  const A = V(430 - aa, Cy), Bp = V(430 + aa, Cy);
  const st = { mode: 'e', th: -0.65, run: false, sw: -1.5, pts: [] };
  const MODES = {
    e: { K: -(112 * 112) / (aa * aa), b: 112, lab: '椭圆 k₁k₂ = −b²/a²' },
    h: { K: (120 * 120) / (aa * aa), b: 120, lab: '双曲线 k₁k₂ = +b²/a²' },
    c: { K: -1, b: aa, lab: '圆 k₁k₂ = −1（Thales）' },
  };
  const tg = () => MODES[st.mode].K;
  const k1 = () => Math.tan(st.th);

  const cM = B.chip('模式'), cK1 = B.chip('k₁（过 A）'), cK2 = B.chip('k₂（过 B）'), cProd = B.chip('k₁·k₂ vs 目标');
  const btns = {};
  const setMode = m => {
    st.mode = m; st.pts = [];
    for (const k in btns) btns[k].classList.toggle('on', k === m);
    B.render();
  };
  for (const [k, lab] of [['e', '椭圆'], ['h', '双曲线'], ['c', '圆']])
    btns[k] = B.btn(lab, () => setMode(k));
  btns.e.classList.add('on');
  B.toggleBtn('▶ 生成轨迹', false, on => {
    st.run = on;
    if (on) { st.pts = []; st.sw = -1.5; }
  });

  const interP = () => {
    const k = k1(), K = tg();
    if (Math.abs(k) < 0.004) return null;                 // k₁=0：k₂ 无穷，交点贴着 B，跳过
    const k2v = K / k;
    if (Math.abs(k2v - k) < 1e-3) return null;             // 平行：交点在无穷远（双曲线渐近方向）
    const s = (Bp.x - A.x) * k2v / (k2v - k);             // 直线1参数：P = A + s·(1, k₁)
    return V(A.x + s, A.y + s * k);
  };

  B.renderFn = () => {
    const K = tg(), b = MODES[st.mode].b;
    // 轴
    B.seg(V(20, Cy), V(W - 20, Cy), { stroke: '#22314a', 'stroke-width': 1.3 });
    B.seg(V(430, 20), V(430, H - 20), { stroke: '#22314a', 'stroke-width': 1 });
    // 参考曲线（虚，验证轨迹用）
    const ref = [];
    if (st.mode === 'c') { for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.04) ref.push(`${(430 + aa * Math.cos(t)).toFixed(1)},${(Cy + aa * Math.sin(t)).toFixed(1)}`); }
    else {
      for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.04)
        ref.push(`${(430 + aa * Math.cos(t)).toFixed(1)},${(Cy + b * Math.sin(t)).toFixed(1)}`);
    }
    if (st.mode !== 'h')
      mk('polyline', { points: ref.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.2, 'stroke-dasharray': '6 6', opacity: 0.5 }, B.dyn);
    else
      for (const s of [1, -1]) {
        const pts = [];
        for (let t = -1.35; t <= 1.35 + 1e-9; t += 0.03)
          pts.push(`${(430 + s * aa / Math.cos(t)).toFixed(1)},${(Cy + b * Math.tan(t)).toFixed(1)}`);
        mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.2, 'stroke-dasharray': '6 6', opacity: 0.5 }, B.dyn);
      }
    // A、B
    for (const [pt, nm] of [[A, 'A(−a, 0)'], [Bp, 'B(a, 0)']]) {
      B.dot(pt, 5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 1.6 });
      B.text(V(pt.x, pt.y + 21), nm, { fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700 });
    }
    // 两条联动直线
    const k = k1(), k2v = Math.abs(k) < 0.004 ? 1e4 : K / k;
    B.inf(A, add(A, V(1, k)), { stroke: '#5cadff', 'stroke-width': 1.8 });
    B.inf(Bp, add(Bp, V(1, k2v)), { stroke: '#ff9e4a', 'stroke-width': 1.8 });
    // 交点与轨迹
    const p = interP();
    if (p) {
      if (st.run) {
        st.sw += 0.011;
        if (st.sw > 1.5) st.sw = -1.5;
        st.th = st.sw;
      }
      const last = st.pts[st.pts.length - 1];
      if (!last || dist(last, p) < 120) st.pts.push(p);
      if (st.pts.length > 2400) st.pts.shift();
      // 轨迹（分段画，跳变处断笔）
      const segs = []; let cur = [];
      for (const q of st.pts) {
        if (cur.length && dist(cur[cur.length - 1], q) > 90) { segs.push(cur); cur = []; }
        cur.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
      }
      if (cur.length) segs.push(cur);
      for (const sgm of segs) if (sgm.length > 1)
        mk('polyline', { points: sgm.join(' '), fill: 'none', stroke: 'rgba(255,209,102,.55)', 'stroke-width': 3.5 }, B.dyn);
      B.dot(p, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(p.x + 14, p.y - 8), 'P', { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
    }
    // 读数
    cM(MODES[st.mode].lab + `，目标 K = ${fmt(K, 3)}`);
    cK1(fmt(k, 3));
    cK2(Math.abs(k) < 0.004 ? '∞（竖直）' : fmt(k2v, 3));
    const prod = Math.abs(k) < 0.004 ? K : k * k2v;
    cProd(`${fmt(prod, 3)} vs ${fmt(K, 3)}`, Math.abs(prod - K) < 1e-6 ? 'ok' : 'warn');
    B.hint(st.mode === 'h'
      ? '双曲线模式：留意 k₁ 越过 ±b/a 时两线短暂平行 —— 那两个方向正是渐近线方向，P 从一支跳到另一支'
      : '拖动蓝线：橙线被"斜率乘积定值"拽住，交点 P 扫出整条曲线 —— 交轨法让第三定义的每一点都能被亲手构造出来');
  };

  const step = () => { if (st.run) B.render(); B.raf(step); };
  B.handle({
    get: () => add(A, V(135 * Math.cos(st.th), 135 * Math.sin(st.th))),
    set: q => {
      st.th = Math.atan2(q.y - A.y, q.x - A.x);
      st.pts = [];   // 手动拖动时只看当前交点
      B.render();
    },
    color: '#5cadff', r: 7, label: '拖我', lo: [9, -11],
  });

  B.render();
  B.raf(step);
  return B;
}
