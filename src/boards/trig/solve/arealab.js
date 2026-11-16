/* 图 Z3 面积范围机，双模式：
   模式一 夹角扫掠 —— S=½ab·sinγ 的直译：底 b 平放、杆 a 绕 C 扫角 γ，高 h=a·sinγ 现场记录；
     sinγ≤1 → S≤½ab，γ=90° 达到最大；右栏画出 S(γ) 的半周期驼峰，探针实时落点。
   模式二 同弦同角对比 —— 固定弦 a 与圆周角 α → 外接圆唯一（R=a/2sinα，Z1 的结论）；
     A 沿大弧滑动，同弦同角的情形全部出现：S 与 b+c 两条读数同时在等腰（b=c）处达到最大 ——
     经典「已知一边一对角，求面积/周长范围」的图形版。右栏两条归一曲线双峰同顶。
   坐标：模式一 C=(0,0)、A=(b,0)、B=(a·cosγ, a·sinγ)，s=33；模式二圆心 O=(0,0)、
     B、C 对称沉底（d=R·cosα）、A=R·(sin u, cos u)，动态比例尺 190/R px。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { mode: 0, a: 4, b: 5, deg: 60, aldeg: 40, t: 0.5, labs: true };
  const S1 = 33, C1 = V(230, 300), O2 = V(250, 252);
  const PR = [532, 12, 312, 486];
  const X1 = x => C1.x + S1 * x, Y1 = y => C1.y - S1 * y;
  const cS = B.chipM('面积 S'), cH = B.chipM('高'), cTop = B.chipM('达到最大判读'), cMax = B.chipM('理论上界');
  const aSl = B.slider('边 a', 2, 6, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  const bSl = B.slider('边 b', 2, 6, 0.05, st.b, v => { st.b = v; B.render(); }, 'b');
  const gSl = B.slider('夹角 γ°', 10, 170, 5, st.deg, v => { st.deg = v; B.render(); }, 'g');
  const alSl = B.slider('角 α°', 20, 80, 5, st.aldeg, v => { st.aldeg = v; B.render(); }, 'ag');
  const tSl = B.slider('弧位 t', 0, 1, 0.01, st.t, v => { st.t = v; B.render(); }, 't');
  const rowOf = s => s.parent || s.parentElement;
  const mBtns = [
    B.btnM('$\\frac12 ab\\sin\\gamma$ 夹角扫掠', () => setMode(0), { on: true }),
    B.btnM('同弦同角对比', () => setMode(1)),
  ];
  const pre = fn => () => { fn(); B.render(); };
  B.btnM('① $\\gamma=90^\\circ$ 达到最大', pre(() => { setMode(0); st.deg = 90; gSl.sync(90); }));
  B.btn('② 同弦等腰时最大', pre(() => { setMode(1); st.t = 0.5; tSl.sync(0.5); }));
  B.btn('③ 偏到边上', pre(() => { setMode(1); st.t = 0.06; tSl.sync(0.06); }));
  B.graphToggles(st, ['labs']);
  function setMode(m) {
    st.mode = m;
    mBtns.forEach((b2, i) => b2.classList.toggle('on', i === m));
    for (const s2 of m === 0 ? [alSl, tSl] : [bSl, gSl]) rowOf(s2).style.display = 'none';
    for (const s2 of m === 0 ? [bSl, gSl] : [alSl, tSl]) rowOf(s2).style.display = '';
    B.render();
  }
  for (const s2 of [alSl, tSl]) rowOf(s2).style.display = 'none';   // 初始模式一（renderFn 尚未就位，只藏行不渲染）

  const angArc = (p, r, a0, a1, at) => {
    const n = 26, pts = [];
    for (let i = 0; i <= n; i++) {
      const tt = a0 + (a1 - a0) * i / n;
      pts.push(`${(p.x + r * Math.cos(tt)).toFixed(1)},${(p.y - r * Math.sin(tt)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  const lab = (p, s, col) => { if (st.labs) B.text(p, s, { 'font-size': 12, fill: col || '#e8eef7', 'text-anchor': 'middle' }); };
  const poly = (ptsPx, at) => mk('polyline', { points: ptsPx.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: 'none', ...at }, B.dyn);
  // 模式二几何：给定 u 求全部读数
  const m2geom = () => {
    const a = st.a, al = st.aldeg * Math.PI / 180, R = a / (2 * Math.sin(al)), d = R * Math.cos(al);
    const u = (2 * st.t - 1) * (Math.PI - al) * 0.96;
    const A = V(R * Math.sin(u), R * Math.cos(u)), Bc = V(-a / 2, -d), Cc = V(a / 2, -d);
    const h = A.y + d;
    const bLen = 2 * R * Math.sin(Math.abs(u - (Math.PI - al)) / 2), cLen = 2 * R * Math.sin(Math.abs(u + Math.PI - al) / 2);   // 弦端：C 在 u_C=+(π−α)、B 在 u_B=−(π−α)
    return { a, al, R, d, u, A, Bc, Cc, h, bLen, cLen, S: a * h / 2, p: bLen + cLen };
  };

  B.renderFn = () => {
    if (st.mode === 0) {
      const a = st.a, b = st.b, g = st.deg * Math.PI / 180;
      const A = V(b, 0), Bm = V(a * Math.cos(g), a * Math.sin(g));
      const Cp = V(X1(0), Y1(0)), Ap = V(X1(b), Y1(0)), Bp = V(X1(Bm.x), Y1(Bm.y)), Dp = V(X1(Bm.x), Y1(0));
      const h = a * Math.sin(g), Sm = a * b * Math.sin(g) / 2, Scap = a * b / 2;
      B.seg(V(X1(-0.4), Y1(0)), V(X1(b + 1.2), Y1(0)), { stroke: '#22314a', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
      mk('polygon', { points: `${Cp.x},${Cp.y} ${Ap.x},${Ap.y} ${Bp.x},${Bp.y}`, fill: 'rgba(255,209,102,.08)', stroke: 'none' }, B.dyn);
      B.seg(Cp, Ap, { stroke: '#5cadff', 'stroke-width': 2.4 });
      B.seg(Cp, Bp, { stroke: '#67e8f9', 'stroke-width': 2.2 });
      B.seg(Ap, Bp, { stroke: '#ffd166', 'stroke-width': 1.8 });
      B.seg(Dp, Bp, { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });
      angArc(Cp, 30, 0, g, { stroke: '#67e8f9', 'stroke-width': 1.4 });
      lab(V(C1.x + 42 * Math.cos(g / 2), C1.y - 42 * Math.sin(g / 2)), `γ=${st.deg}°`, '#67e8f9');
      lab(V(Cp.x - 12, Cp.y + 16), 'C'); lab(V(Ap.x + 10, Ap.y + 16), 'A'); lab(V(Bp.x, Bp.y - 12), 'B');
      lab(V((Cp.x + Ap.x) / 2, Cp.y + 34), `b=${fmt(b, 2)}`, '#5cadff');
      lab(V(Cp.x + (Bp.x - Cp.x) / 2 - 24, Cp.y - (Bp.y - Cp.y) / 2), `a=${fmt(a, 2)}`, '#67e8f9');
      lab(V(Dp.x + (Dp.x < Ap.x ? 10 : -10), (Dp.y + Bp.y) / 2), `h=a·sinγ=${fmt(h, 2)}`, '#ff9e4a');
      // 右栏：S(γ) 半周期驼峰（各向异性取景：横 γ 纵 S）
      const Smx = Scap * 1.18, m = { px: v => PR[0] + 24 + v * (PR[2] - 48) / Math.PI, py: v => PR[1] + 432 - v * 340 / Smx, X0: 0, X1: Math.PI, Y0: 0, Y1: Smx };
      B.grid({ ...m, sx: Math.PI / 4, sy: Scap / 4, grid: true, labs: st.labs, axLab: 'γ', ayLab: 'S' });
      poly(Array.from({ length: 91 }, (_, i) => { const v = Math.PI * i / 90; return V(m.px(v), m.py(a * b * Math.sin(v) / 2)); }), { stroke: '#5cadff', 'stroke-width': 2.2 });
      B.seg(V(m.px(Math.PI / 2), m.py(0)), V(m.px(Math.PI / 2), m.py(Scap)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
      B.tex(V(m.px(Math.PI / 2), m.py(Scap) - 14), 'γ=90° 达到最大', { size: 12, color: '#ffd166', anchor: 'mid', w: 120 });
      B.seg(V(m.px(g), m.py(0)), V(m.px(g), m.py(Sm)), { stroke: '#67e8f9', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
      B.dot(V(m.px(g), m.py(Sm)), 4.5, { fill: '#ffd166' });
      B.tex(V(m.px(g) + 4, m.py(Sm) - 12), fmt(Sm, 2), { size: 12, color: '#ffd166', anchor: 'start', w: 80 });
      cS('$S=\\frac12 ab\\sin\\gamma=' + fmt(Sm, 2) + '$', 'ok');
      cH('高 $\\frac12 b\\cdot h=\\frac12\\times' + fmt(b, 2) + '\\times' + fmt(h, 2) + '=' + fmt(Sm, 2) + '$', 'ok');
      if (st.deg === 90) cTop('γ=90°：sinγ=1 达到最大，S=½ab=' + fmt(Scap, 2), 'ok');
      else cTop('γ=' + st.deg + '° ' + (st.deg < 90 ? '升坡' : '降坡') + '：sinγ=' + fmt(Math.sin(g), 3) + '，距达到最大 ' + fmt((1 - Math.sin(g)) * 100, 0) + '%', '');
      cMax('$S\\le\\frac12 ab=' + fmt(Scap, 2) + '$（等号 γ=90°）', '');
    } else {
      const g2 = m2geom();
      const s2 = 190 / g2.R, X2 = x => O2.x + s2 * x, Y2 = y => O2.y - s2 * y;
      const Ap = V(X2(g2.A.x), Y2(g2.A.y)), Bp = V(X2(g2.Bc.x), Y2(g2.Bc.y)), Cp = V(X2(g2.Cc.x), Y2(g2.Cc.y)), Op = V(O2.x, O2.y);
      mk('circle', { cx: Op.x, cy: Op.y, r: 190, fill: 'none', stroke: '#22314a', 'stroke-width': 1.4, 'stroke-opacity': .8 }, B.dyn);
      mk('polygon', { points: `${Ap.x},${Ap.y} ${Bp.x},${Bp.y} ${Cp.x},${Cp.y}`, fill: 'rgba(255,209,102,.08)', stroke: 'none' }, B.dyn);
      B.seg(Bp, Cp, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
      B.seg(Ap, Bp, { stroke: '#67e8f9', 'stroke-width': 2 });
      B.seg(Ap, Cp, { stroke: '#5cadff', 'stroke-width': 2 });
      B.seg(Ap, V(Ap.x, Bp.y), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
      angArc(Ap, 26, Math.atan2(-(Bp.y - Ap.y), Bp.x - Ap.x), Math.atan2(-(Cp.y - Ap.y), Cp.x - Ap.x), { stroke: '#ffd166', 'stroke-width': 1.3 });
      lab(V(Ap.x + (Bp.x - Ap.x) / 2 - 8, Ap.y + (Bp.y - Ap.y) / 2), `c=${fmt(g2.cLen, 2)}`, '#67e8f9');
      lab(V(Ap.x + (Cp.x - Ap.x) / 2 + 8, Ap.y + (Cp.y - Ap.y) / 2), `b=${fmt(g2.bLen, 2)}`, '#5cadff');
      lab(V((Bp.x + Cp.x) / 2, Bp.y + 18), `a=${fmt(g2.a, 2)}`, '#ff9e4a');
      lab(V(Ap.x, Ap.y - 14), `α=${st.aldeg}°`, '#ffd166');
      lab(V(Bp.x - 12, Bp.y + 16), 'B'); lab(V(Cp.x + 12, Cp.y + 16), 'C'); lab(V(Ap.x + 12, Ap.y - 12), 'A');
      lab(V(Op.x + 12, Op.y - 12), `R=${fmt(g2.R, 2)}`, '#93a1b5');
      // 右栏：S 与 b+c 归一双峰同顶
      const uL = -(Math.PI - g2.al) * 0.97, uH = (Math.PI - g2.al) * 0.97, N2 = 90;
      const fS = u => { const A = g2.R * Math.cos(u); return g2.a * (A + g2.d) / 2; };
      const fP = u => 4 * g2.R * Math.cos(g2.al / 2) * Math.cos(u / 2);
      const Sm2 = fS(0), Pm2 = fP(0);
      const m = { px: v => PR[0] + 24 + v * (PR[2] - 48), py: v => PR[1] + 432 - v * 340 / 1.15, X0: 0, X1: 1, Y0: 0, Y1: 1.15 };
      B.grid({ ...m, sx: 0.25, sy: 0.25, grid: true, labs: st.labs, axLab: 't', ayLab: '' });
      poly(Array.from({ length: N2 + 1 }, (_, i) => { const u = uL + (uH - uL) * i / N2; return V(m.px(i / N2), m.py(fS(u) / Sm2)); }), { stroke: '#5cadff', 'stroke-width': 2.2 });
      poly(Array.from({ length: N2 + 1 }, (_, i) => { const u = uL + (uH - uL) * i / N2; return V(m.px(i / N2), m.py(fP(u) / Pm2)); }), { stroke: '#67e8f9', 'stroke-width': 2, 'stroke-dasharray': '6 4' });
      B.seg(V(m.px(0.5), m.py(0)), V(m.px(0.5), m.py(1)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
      B.tex(V(m.px(0.5), m.py(1) - 12), 't=½ 等腰 b=c', { size: 12, color: '#ffd166', anchor: 'mid', w: 150 });
      B.dot(V(m.px(st.t), m.py(fS(g2.u) / Sm2)), 4.5, { fill: '#ffd166' });
      B.dot(V(m.px(st.t), m.py(fP(g2.u) / Pm2)), 4, { fill: '#67e8f9' });
      B.tex(V(PR[0] + 24, PR[1] + 460), '蓝 S/Sm · 青 (b+c)/(b+c)m', { size: 12, color: '#93a1b5', anchor: 'start', w: 260 });
      const iso = Math.abs(g2.bLen - g2.cLen) < 0.02;
      const isoTxt = iso ? '等腰 b=c：两者同时达到最大' : '非等腰：|b−c|=' + fmt(Math.abs(g2.bLen - g2.cLen), 2);
      const isoCls = iso ? 'ok' : '';
      cS('$S=\\frac12 a\\cdot h=' + fmt(g2.S, 2) + '$', 'ok');
      cH('b+c=' + fmt(g2.p, 2) + '（等腰时 ' + fmt(Pm2, 2) + ' 达到最大）', '');
      cTop(isoTxt, isoCls);
      cMax('$S\\le R^2\\sin\\alpha(1+\\cos\\alpha)=' + fmt(Sm2, 2) + '$，$b+c\\le4R\\cos\\tfrac\\alpha2=' + fmt(Pm2, 2) + '$', '');
    }
  };
  B.render();
  B.hintM('模式一拖 $\\gamma$ 看 S 达到最大；模式二固定 a 与 $\\alpha$ 拖弧位 t —— S 与 b+c 两读数都在等腰处达到最大');
  return B;
}
