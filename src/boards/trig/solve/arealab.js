/* 图 Z3 面积与范围机，双模式：
   模式一 夹角扫掠 —— S=½ab·sinγ 的直译：底 b 平放、杆 a 绕 C 扫角 γ，高 h=a·sinγ 由右侧量线读出；
     底×高的矩形（面积 2S）垫在图后，γ=90° 时 S 取到 ½ab。右栏画 S(γ) 的半周期驼峰，并把 S 与上界之比做成一根条。
   模式二 同弦同角对比 —— 固定弦 a 与圆周角 α，外接圆唯一（R=a/2sinα，Z1 的结论）；
     A 沿大弧滑动，S 与 b+c 同时在等腰（b=c）处达到最大。右栏两条归一曲线峰顶对齐在 t=½。
   坐标：模式一 C=(0,0)、A=(b,0)、B=(a·cosγ, a·sinγ)，S=40 px/单位；
     模式二圆心 O=(0,0)、B、C 对称沉底（y=−R·cosα）、A=R·(sin u, cos u)，动态比例尺 188/R px。
   **刻度数字一律自己排、不走 B.grid 的自动刻度**：γ 轴写 π/4、π/2、3π/4、π，纵轴取整到干净小数 ——
   早先直接把 sx=π/4 交给 grid，标签成了 0.785398163397 这种长尾，四个挤在 264px 的轴下成一团（用户报的 bug）。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { mode: 0, a: 4, b: 5, deg: 60, aldeg: 40, t: 0.5, labs: true };
  const S1 = 40, C1 = V(262, 380), O2 = V(258, 226), R2 = 188;
  const PR = [532, 12, 312, 486];
  const X1 = x => C1.x + S1 * x, Y1 = y => C1.y - S1 * y;
  const cS = B.chipM('面积 S'), cH = B.chipM('高与周长'), cTop = B.chipM('达到最大判读'), cMax = B.chipM('理论上界');
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
  for (const s2 of [alSl, tSl]) rowOf(s2).style.display = 'none';

  /* —— 版面小工具 —— */
  const angArc = (p, r, a0, a1, at) => {
    const n = 30, pts = [];
    for (let i = 0; i <= n; i++) {
      const tt = a0 + (a1 - a0) * i / n;
      pts.push(`${(p.x + r * Math.cos(tt)).toFixed(1)},${(p.y - r * Math.sin(tt)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  // 板内字号由 --bd-fs 统一钉住，单写 B.text 的 font-size 不生效：量与注释一律走 B.textM（p 是基线）
  const lab = (p, s, col, size, anchor) => {
    if (st.labs) B.textM(p, s, { 'font-size': size || 12, fill: col || '#fff', 'text-anchor': anchor || 'middle' });
  };
  const vlab = (p, s, anchor) => {
    if (st.labs) B.tex(V(p.x, p.y - 14 * 0.4), `$${s}$`, { size: 14, color: '#fff', anchor: anchor || 'mid', w: 48 });
  };
  // 线段外法向：取背离重心的一侧，推 d 像素（边标沿这里排，不会被边线穿过）
  const outOf = (P, Q, away, d) => {
    let nx = -(Q.y - P.y), ny = Q.x - P.x;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl; ny /= nl;
    const mx = (P.x + Q.x) / 2, my = (P.y + Q.y) / 2;
    if (nx * (mx - away.x) + ny * (my - away.y) < 0) { nx = -nx; ny = -ny; }
    return V(mx + nx * d, my + ny * d);
  };
  const niceStep = (max, n = 4) => {
    const raw = max / n, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = raw / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  };
  const clean = v => String(Math.round(v * 1e6) / 1e6);
  const ticksUpTo = (step, max) => {
    const o = [];
    for (let v = step; v <= max + step * 1e-6; v += step) o.push(v);
    return o;
  };
  /* 右栏图表：网格与两条轴交给 B.grid（不带刻度数字），数字与轴字母在这里排。
     横刻度用调用方给的函数排版（γ 轴写 π 的分数），纵刻度取干净小数。 */
  const chartFrame = (m, o) => {
    B.grid({ ...m, sx: o.gx, sy: o.gy, grid: true, labs: false });
    if (!st.labs) return;
    const ay = m.py(0);
    for (const v of o.xt) B.textM(V(m.px(v), ay + 16), o.xlab(v), { 'font-size': 11, fill: '#93a1b5', 'text-anchor': 'middle' });
    for (const v of o.yt) B.textM(V(m.px(m.X0) - 7, m.py(v) + 4), clean(v), { 'font-size': 11, fill: '#93a1b5', 'text-anchor': 'end' });
    B.textM(V(m.px(m.X1) - 6, ay - 10), o.xletter, { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'end' });
    if (o.yletter) B.textM(V(m.px(m.X0) + 13, m.py(m.Y1) + 3), o.yletter, { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'start' });
  };
  /* 右栏下半：分段横线 + 两列读数 + 「占上界」条 */
  const TX = PR[0] + 14, TW = PR[2] - 28;
  const rule = (ry, op) => mk('line', {
    x1: TX, y1: ry, x2: TX + TW, y2: ry,
    stroke: `rgba(147,161,181,${op || .22})`, 'stroke-width': 1,
  }, B.dyn);
  const row = (ry, name, val, col) => {
    B.textM(V(TX, ry), name, { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
    B.textM(V(TX + TW, ry), val, { 'font-size': 14, fill: col || '#fff', 'text-anchor': 'end' });
  };
  const ratioBar = (ratio, cap, col) => {
    row(462, cap, fmt(ratio * 100, 0) + '%', col);
    mk('rect', { x: TX, y: 468, width: TW, height: 8, rx: 4, fill: 'rgba(147,161,181,.13)' }, B.dyn);
    const w2 = Math.max(0, Math.min(1, ratio)) * TW;
    mk('rect', { x: TX, y: 468, width: w2, height: 8, rx: 4, fill: col, 'fill-opacity': .9 }, B.dyn);
    mk('line', { x1: TX + w2, y1: 465, x2: TX + w2, y2: 479, stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round' }, B.dyn);
  };
  // 模式二几何：给定 u 求全部读数
  const m2geom = () => {
    const a = st.a, al = st.aldeg * Math.PI / 180, R = a / (2 * Math.sin(al)), d = R * Math.cos(al);
    const u = (2 * st.t - 1) * (Math.PI - al) * 0.96;
    const A = V(R * Math.sin(u), R * Math.cos(u)), Bc = V(-a / 2, -d), Cc = V(a / 2, -d);
    const h = A.y + d;
    const bLen = 2 * R * Math.sin(Math.abs(u - (Math.PI - al)) / 2), cLen = 2 * R * Math.sin(Math.abs(u + Math.PI - al) / 2);
    return { a, al, R, d, u, A, Bc, Cc, h, bLen, cLen, S: a * h / 2, p: bLen + cLen };
  };

  B.renderFn = () => {
    // 左栏顶部一句交代玩法（只给模式一：模式二的上方是圆周与滑动弧，再压一行字会顶到弧顶）
    if (st.mode === 0) {
      B.textM(V(30, 36), '底 b 平放，边 a 绕 C 扫角 γ；虚线矩形即底 × 高', { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'start' });
    }
    if (st.mode === 0) {
      const a = st.a, b = st.b, g = st.deg * Math.PI / 180;
      const A = V(b, 0), Bm = V(a * Math.cos(g), a * Math.sin(g));
      const Cp = V(X1(0), Y1(0)), Ap = V(X1(b), Y1(0)), Bp = V(X1(Bm.x), Y1(Bm.y)), Dp = V(X1(Bm.x), Y1(0));
      const h = a * Math.sin(g), Sm = a * b * Math.sin(g) / 2, Scap = a * b / 2;
      const y0 = Y1(0), w = Ap.x - Cp.x, ht = y0 - Bp.y;
      const ct = V((Cp.x + Ap.x + Bp.x) / 3, (y0 + y0 + Bp.y) / 3);

      /* —— 图：底×高矩形垫后，三角形压上 —— */
      mk('rect', { x: Cp.x, y: Bp.y, width: w, height: ht, rx: 8, fill: 'rgba(255,209,102,.045)', stroke: 'rgba(255,209,102,.22)', 'stroke-dasharray': '6 5' }, B.dyn);
      B.seg(V(Math.min(Cp.x - 16, Bp.x - 16), y0), V(Math.max(Ap.x + 16, Bp.x + 16), y0), { stroke: 'rgba(147,161,181,.45)', 'stroke-width': 1 });
      mk('polygon', { points: `${Cp.x},${Cp.y} ${Ap.x},${Ap.y} ${Bp.x},${Bp.y}`, fill: 'rgba(255,209,102,.10)', stroke: 'none' }, B.dyn);
      B.seg(Cp, Ap, { stroke: '#5cadff', 'stroke-width': 2.4 });
      B.seg(Cp, Bp, { stroke: '#67e8f9', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
      B.seg(Ap, Bp, { stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-linecap': 'round' });
      B.seg(Dp, Bp, { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });

      /* —— 两把量线：底 b 挂在基线下方，高 h 挂在矩形右沿 —— */
      const yd = y0 + 26;
      B.seg(V(Cp.x, yd), V(Ap.x, yd), { stroke: '#5cadff', 'stroke-width': 1.4 });
      B.seg(V(Cp.x, yd - 5), V(Cp.x, yd + 5), { stroke: '#5cadff', 'stroke-width': 1.4 });
      B.seg(V(Ap.x, yd - 5), V(Ap.x, yd + 5), { stroke: '#5cadff', 'stroke-width': 1.4 });
      lab(V((Cp.x + Ap.x) / 2, yd + 18), `底 b=${fmt(b, 2)}`, '#5cadff');
      const xd = Math.max(Ap.x, Bp.x) + 14;   // 高量线挂在整幅图最右沿之外：既不被斜边穿过，也压不到 A 的字母
      B.seg(V(xd, y0), V(xd, Bp.y), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
      B.seg(V(xd - 5, y0), V(xd + 5, y0), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
      B.seg(V(xd - 5, Bp.y), V(xd + 5, Bp.y), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
      lab(V(xd, Bp.y - 10), `高 h=a·sinγ=${fmt(h, 2)}`, '#ff9e4a', 12, 'end');

      /* —— 角、顶点与边标 —— */
      angArc(Cp, 34, 0, g, { stroke: '#67e8f9', 'stroke-width': 1.4 });
      lab(V(Cp.x + 30, y0 + 20), '$\\gamma$', '#67e8f9', 12);
      vlab(V(Cp.x - 12, y0 + 16), 'C'); vlab(V(Ap.x + 6, y0 + 16), 'A'); vlab(V(Bp.x - 12, Bp.y + 4), 'B', 'end');
      lab(outOf(Cp, Bp, ct, 17), `边 a=${fmt(a, 2)}`, '#67e8f9');
      lab(V(ct.x, ct.y + 4), `$S=${fmt(Sm, 2)}$`, '#ffd166', 13);

      /* —— 右栏：S(γ) 驼峰 —— */
      B.textM(V(TX, 36), '面积随夹角变化', { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'start' });
      rule(48);
      const ymax1 = Scap * 1.14;
      const m1 = { px: v => 556 + v * 264 / Math.PI, py: v => 318 - v * 244 / ymax1, X0: 0, X1: Math.PI, Y0: 0, Y1: ymax1 };
      const gy1 = niceStep(Scap);
      const K4 = ['', '$\\frac{\\pi}{4}$', '$\\frac{\\pi}{2}$', '$\\frac{3\\pi}{4}$', '$\\pi$'];
      chartFrame(m1, {
        gx: Math.PI / 4, gy: gy1,
        xt: [Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI],
        xlab: v => K4[Math.round(v / (Math.PI / 4))],
        yt: ticksUpTo(gy1, Scap),
        xletter: '$\\gamma$', yletter: '$S$',
      });
      B.plot(v => a * b * Math.sin(v) / 2, m1, { stroke: '#5cadff', 'stroke-width': 2.2 });
      B.seg(V(m1.px(Math.PI / 2), m1.py(0)), V(m1.px(Math.PI / 2), m1.py(Scap)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
      lab(V(m1.px(Math.PI / 2), m1.py(Scap) - 9), '峰：γ=90°', '#ffd166', 12);
      B.seg(V(m1.px(g), m1.py(0)), V(m1.px(g), m1.py(Sm)), { stroke: '#67e8f9', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
      B.seg(V(m1.px(0), m1.py(Sm)), V(m1.px(g), m1.py(Sm)), { stroke: '#67e8f9', 'stroke-width': 1, 'stroke-dasharray': '2 4', 'stroke-opacity': .8 });
      B.dot(V(m1.px(g), m1.py(Sm)), 4.5, { fill: '#ffd166' });

      rule(364);
      row(386, '面积 $S=\\frac12\\,b\\,h$', fmt(Sm, 2), '#ffd166');
      row(410, '高 $h=a\\sin\\gamma$', fmt(h, 2), '#ff9e4a');
      row(434, '$\\sin\\gamma$（S 占上界的比）', fmt(Math.sin(g), 3), '#67e8f9');
      rule(448);
      ratioBar(Math.sin(g), 'S 占上界 ½ab 的比例', '#ffd166');

      /* —— 徽章 —— */
      const at90 = Math.abs(st.deg - 90) < 0.5;
      cS(`$S=\\frac12 ab\\sin\\gamma=${fmt(Sm, 2)}$`, 'ok');
      cH(`高 $h=a\\sin\\gamma=${fmt(h, 2)}$，底 $b=${fmt(b, 2)}$`, '');
      if (at90) cTop(`γ=90°：sinγ=1 达到最大，S=½ab=${fmt(Scap, 2)}`, 'ok');
      else cTop(`γ=${st.deg}° 的 sinγ=${fmt(Math.sin(g), 3)} —— 距峰还差 ${fmt((1 - Math.sin(g)) * 100, 0)}%`, '');
      cMax(`$S\\le\\frac12 ab=${fmt(Scap, 2)}$（等号 γ=90°）`, '');
    } else {
      const g2 = m2geom();
      const s2 = R2 / g2.R, X2 = x => O2.x + s2 * x, Y2 = y => O2.y - s2 * y;
      const Ap = V(X2(g2.A.x), Y2(g2.A.y)), Bp = V(X2(g2.Bc.x), Y2(g2.Bc.y)), Cp = V(X2(g2.Cc.x), Y2(g2.Cc.y)), Op = V(O2.x, O2.y);
      const cy = Y2(-g2.d), ct = V((Ap.x + Bp.x + Cp.x) / 3, (Ap.y + Bp.y + Cp.y) / 3);
      const uL = -(Math.PI - g2.al), uR = Math.PI - g2.al;

      /* —— 图：圆、滑动弧、三角形 —— */
      mk('circle', { cx: Op.x, cy: Op.y, r: R2, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.2, 'stroke-opacity': .5 }, B.dyn);
      angArc(Op, R2 + 12, Math.PI / 2 - uR * 0.92, Math.PI / 2 - uL * 0.92, { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '5 6', 'stroke-opacity': .55 });
      mk('polygon', { points: `${Op.x},${Op.y - R2 - 12} ${Op.x - 6},${Op.y - R2 - 3} ${Op.x - 6},${Op.y - R2 - 21}`, fill: '#c084fc', stroke: 'none' }, B.dyn);
      lab(V(Op.x - 18, Op.y - R2 - 14), 'A 沿大弧滑动', '#c084fc', 11, 'end');
      mk('polygon', { points: `${Ap.x},${Ap.y} ${Bp.x},${Bp.y} ${Cp.x},${Cp.y}`, fill: 'rgba(255,209,102,.10)', stroke: 'none' }, B.dyn);
      B.seg(Bp, Cp, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
      B.seg(Ap, Bp, { stroke: '#67e8f9', 'stroke-width': 2 });
      B.seg(Ap, Cp, { stroke: '#5cadff', 'stroke-width': 2 });
      B.seg(V(Ap.x, Ap.y), V(Ap.x, cy), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
      B.seg(Op, Ap, { stroke: 'rgba(147,161,181,.5)', 'stroke-width': 1, 'stroke-dasharray': '3 5' });

      /* —— 角 α 与边标 —— */
      const a1 = Math.atan2(-(Bp.y - Ap.y), Bp.x - Ap.x), a2 = Math.atan2(-(Cp.y - Ap.y), Cp.x - Ap.x);
      angArc(Ap, 28, a1, a2, { stroke: '#ffd166', 'stroke-width': 1.3 });
      let tb = Math.atan2(Cp.y - Ap.y, Cp.x - Ap.x);
      let dt = Math.atan2(Bp.y - Ap.y, Bp.x - Ap.x) - tb;
      while (dt > Math.PI) dt -= 2 * Math.PI;
      while (dt < -Math.PI) dt += 2 * Math.PI;
      tb += dt / 2;
      lab(V(Ap.x + 40 * Math.cos(tb), Ap.y + 40 * Math.sin(tb)), '$\\alpha$', '#ffd166', 12);   // 角很窄，只写字母；数值进右栏读数
      lab(outOf(Ap, Bp, ct, 16), `边 c=${fmt(g2.cLen, 2)}`, '#67e8f9');
      lab(outOf(Ap, Cp, ct, 16), `边 b=${fmt(g2.bLen, 2)}`, '#5cadff');
      lab(V((Bp.x + Cp.x) / 2, cy + 18), `定弦 a=${fmt(g2.a, 2)}`, '#ff9e4a');
      lab(V(Op.x + 10, Op.y + 20), `R=${fmt(g2.R, 2)}`, '#93a1b5', 11, 'start');
      lab(V(Op.x, Op.y - R2 + 18), '等腰', '#ffd166', 11);
      vlab(V(Bp.x - 12, Bp.y + 16), 'B'); vlab(V(Cp.x + 12, Cp.y + 16), 'C'); vlab(V(Ap.x + 13, Ap.y - 12), 'A');
      B.dot(V(Op.x, Op.y - R2), 3, { fill: '#ffd166' });
      lab(V(ct.x, ct.y + 4), `$S=${fmt(g2.S, 2)}$`, '#ffd166', 13);

      /* —— 右栏：两条归一曲线峰顶对齐 —— */
      B.textM(V(TX, 36), '面积与周长随弧位变化（各自归一）', { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'start' });
      rule(48);
      const m2 = { px: v => 556 + v * 264, py: v => 318 - v * 244 / 1.14, X0: 0, X1: 1, Y0: 0, Y1: 1.14 };
      chartFrame(m2, {
        gx: 0.25, gy: 0.25,
        xt: [0.25, 0.5, 0.75, 1], xlab: v => clean(v),
        yt: [0.25, 0.5, 0.75, 1],
        xletter: '$t$', yletter: '',
      });
      const uAt = t => uL + (uR - uL) * t;
      const fS = A2 => g2.a * (g2.R * Math.cos(A2) + g2.d) / 2;
      const fP = A2 => 4 * g2.R * Math.cos(g2.al / 2) * Math.cos(A2 / 2);
      const Sm2 = fS(0), Pm2 = fP(0), N2 = 100;
      const dS = [], pP = [];
      for (let i = 0; i <= N2; i++) {
        const u = uAt(i / N2), px = m2.px(i / N2).toFixed(1);
        dS.push((i ? 'L' : 'M') + px + ' ' + m2.py(fS(u) / Sm2).toFixed(1));
        pP.push(`${px},${m2.py(fP(u) / Pm2).toFixed(1)}`);
      }
      mk('path', { d: dS.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn);
      mk('polyline', { points: pP.join(' '), fill: 'none', stroke: '#c084fc', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, B.dyn);
      B.seg(V(m2.px(0.5), m2.py(0)), V(m2.px(0.5), m2.py(1)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
      lab(V(m2.px(0.5), m2.py(1) - 9), 't=½ 等腰', '#ffd166', 12);
      B.dot(V(m2.px(st.t), m2.py(fS(g2.u) / Sm2)), 4.5, { fill: '#ffd166' });
      B.dot(V(m2.px(st.t), m2.py(fP(g2.u) / Pm2)), 4, { fill: '#c084fc' });
      // 图例：两枚色段 + 名字（读数与下面两行同名同色）
      {
        const items = [['#ffd166', 'S', 0], ['#c084fc', 'b+c', 1]];
        const xs = [560, 700];
        items.forEach(([col, nm], i) => {
          mk('line', { x1: xs[i], y1: 348, x2: xs[i] + 14, y2: 348, stroke: col, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, B.dyn);
          B.textM(V(xs[i] + 20, 352), nm + '（归一）', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
        });
      }

      rule(364);
      row(386, '面积 $S=\\frac12\\,a\\,h$', fmt(g2.S, 2), '#ffd166');
      row(410, '$b+c$（峰值 ' + fmt(Pm2, 2) + '）', fmt(g2.p, 2), '#c084fc');
      row(434, '对角 α ／ 弧位 t', `${Math.round(st.aldeg)}° ／ ${fmt(st.t, 2)}`, '#93a1b5');
      rule(448);
      ratioBar(g2.S / Sm2, 'S 占峰值 R²sinα(1+cosα) 的比例', '#ffd166');

      const iso = Math.abs(g2.bLen - g2.cLen) < 0.02;
      cS(`$S=\\frac12 a\\cdot h=${fmt(g2.S, 2)}$`, 'ok');
      cH(`$b+c=${fmt(g2.p, 2)}$（等腰时 ${fmt(Pm2, 2)} 达到最大）`, '');
      cTop(iso ? '等腰 b=c：S 与 b+c 同时达到最大' : `非等腰：|b−c|=${fmt(Math.abs(g2.bLen - g2.cLen), 2)}`, iso ? 'ok' : '');
      cMax(`$S\\le R^2\\sin\\alpha(1+\\cos\\alpha)=${fmt(Sm2, 2)}$，$b+c\\le4R\\cos\\tfrac\\alpha2=${fmt(Pm2, 2)}$`, '');
    }

    /* —— 左栏底部：公式的现场代入（两种模式共用一处收束） —— */
    B.seg(V(30, 440), V(508, 440), { stroke: 'rgba(147,161,181,.22)', 'stroke-width': 1 });
    if (st.mode === 0) {
      const a = st.a, b = st.b, g = st.deg * Math.PI / 180;
      B.tex(V(269, 464), `$S=\\frac12\\,b\\,h=\\frac12\\times${fmt(b, 2)}\\times${fmt(a * Math.sin(g), 2)}=${fmt(a * b * Math.sin(g) / 2, 2)}$`, { size: 13, color: '#ffd166', anchor: 'mid', w: 440 });
    } else {
      const g2 = m2geom();
      B.tex(V(269, 464), `$S=\\frac12\\,a\\,h=\\frac12\\times${fmt(g2.a, 2)}\\times${fmt(g2.h, 2)}=${fmt(g2.S, 2)}$`, { size: 13, color: '#ffd166', anchor: 'mid', w: 440 });
    }
  };
  B.render();
  B.hintM('模式一拖 $\\gamma$：矩形 b×h 是 2S，γ=90° 时 S 达到 ½ab；模式二拖弧位 t —— S 与 b+c 同在等腰处最大');
  return B;
}
