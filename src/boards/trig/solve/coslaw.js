/* 图 Z2 余弦定理投影分解机：c² = a² + b² − 2ab·cosγ 的几何直译 ——
   把角 γ 顶点 C 摆在原点、b 沿 +x、a 仰角 γ，则对边 AB 恰是直角三角形的斜边：
   水平分量 |b−a·cosγ|、竖直分量 a·sinγ，勾股一勾即得 c²；展开合并后 −2ab·cosγ 就是「修正项」——
   锐角负修正（c²<a²+b²）、直角零修正（勾股）、钝角正修正（c²>a²+b²）。
   左栏版式：基准线做成带刻度与箭头的量轴；投影 a·cosγ 走一条紫色有向尺寸线（钝角时箭头掉头），
   水平直角边 |b−a·cosγ| 走绿色端标尺寸线，高 a·sinγ 走橙色虚线；三项读数沉到底部一行色标。
   右栏是一条按横线分段的读数板：链条式推导 → 金色结论带 → 两根对比条与缺口花括号 → 实测核对 →
   arccos 反演 → 锐直钝三态指示。坐标：C=(0,0)，S=33 px/单位。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { a: 4, b: 5, deg: 60, proj: true, labs: true };
  const S = 33, C0 = V(248, 322);
  const PR = [532, 12, 312, 486];
  const X = x => C0.x + S * x, Y = y => C0.y - S * y;
  const cFix = B.chipM('修正项'), cInv = B.chipM('反演 γ');
  const aSl = B.slider('边 a', 2, 7, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  const bSl = B.slider('边 b', 2, 7, 0.05, st.b, v => { st.b = v; B.render(); }, 'b');
  const gSl = B.slider('夹角 γ°', 20, 160, 5, st.deg, v => { st.deg = v; B.render(); }, 'g');
  const pre = (a, b, d) => () => { st.a = a; st.b = b; st.deg = d; aSl.sync(a); bSl.sync(b); gSl.sync(d); B.render(); };
  B.btnM('① 勾股 $\\gamma=90^\\circ$', pre(4, 5, 90));
  B.btnM('② 锐角 $\\gamma=60^\\circ$', pre(4, 5, 60));
  B.btnM('③ 钝角 $\\gamma=120^\\circ$', pre(4, 5, 120));
  B.toggleBtn('投影分解', true, v => { st.proj = v; B.render(); });
  B.graphToggles(st, ['labs']);

  const angArc = (p, r, a0, a1, at) => {
    const n = 26, pts = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + (a1 - a0) * i / n;
      pts.push(`${(p.x + r * Math.cos(t)).toFixed(1)},${(p.y - r * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  // 板内字号由设置页的全局倍率统一钉住（global.css 的 svg text 读 --bd-fs），单条 B.text 再写 font-size 不生效；
  // 所以按两条路排：顶点字母走 B.tex 显式 14px（p 换算成垂直中心），量与注释走 B.textM（p 仍按基线给）。
  const vlab = (p, s) => {
    if (st.labs) B.tex(V(p.x, p.y - 14 * 0.4), `$${s}$`, { size: 14, color: '#fff', anchor: 'mid', w: 48 });
  };
  const lab = (p, s, col) => {
    if (st.labs) B.textM(p, s, { 'font-size': 12, fill: col || '#fff', 'text-anchor': 'middle' });
  };
  // 线段外法向：取背离重心的一侧，推 d 像素
  const outOf = (P, Q, away, d) => {
    let nx = -(Q.y - P.y), ny = Q.x - P.x;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl; ny /= nl;
    const mx = (P.x + Q.x) / 2, my = (P.y + Q.y) / 2;
    if (nx * (mx - away.x) + ny * (my - away.y) < 0) { nx = -nx; ny = -ny; }
    return V(mx + nx * d, my + ny * d);
  };

  B.renderFn = () => {
    const a = st.a, b = st.b, g = st.deg * Math.PI / 180;
    const cs = Math.cos(g), sn = Math.sin(g);
    const A = V(b, 0), Bm = V(a * cs, a * sn);
    const Cp = V(X(0), Y(0)), Ap = V(X(A.x), Y(0)), Bp = V(X(Bm.x), Y(Bm.y)), Dp = V(X(Bm.x), Y(0));
    const c = Math.hypot(b - a * cs, a * sn);
    const a2b2 = a * a + b * b, c2 = c * c, fix = a2b2 - c2;   // fix = 2ab·cosγ；修正项 −2ab·cosγ 是它的反号
    const ct = V((Cp.x + Ap.x + Bp.x) / 3, (Cp.y + Ap.y + Bp.y) / 3);
    const y0 = Y(0), l1 = y0 + 30, l2 = y0 + 54;              // 基准线与两条尺寸线的 y

    /* —— 左栏：底边量轴 —— */
    B.seg(V(X(-7), y0), V(X(7.9), y0), { stroke: 'rgba(147,161,181,.45)', 'stroke-width': 1 });
    for (let k = -7; k <= 7; k++) {
      if (!k) continue;
      B.seg(V(X(k), y0), V(X(k), y0 + (k % 2 ? 3.5 : 5.5)), { stroke: 'rgba(147,161,181,.33)', 'stroke-width': 1 });
    }
    mk('polygon', {
      points: `${X(7.9)},${y0} ${X(7.9) - 9},${y0 - 3.2} ${X(7.9) - 9},${y0 + 3.2}`,
      fill: 'rgba(147,161,181,.55)', stroke: 'none',
    }, B.dyn);

    /* —— 左栏：两块淡色面（整三角形 + 勾股用的直角三角形） —— */
    mk('polygon', { points: `${Cp.x},${Cp.y} ${Ap.x},${Ap.y} ${Bp.x},${Bp.y}`, fill: 'rgba(92,173,255,.05)', stroke: 'none' }, B.dyn);
    if (st.proj) {
      mk('polygon', { points: `${Dp.x},${Dp.y} ${Bp.x},${Bp.y} ${Ap.x},${Ap.y}`, fill: 'rgba(74,222,128,.06)', stroke: 'none' }, B.dyn);
    }

    /* —— 左栏：三条边（斜边压一层柔光） —— */
    B.seg(Cp, Ap, { stroke: '#5cadff', 'stroke-width': 2.6 });
    B.seg(Cp, Bp, { stroke: '#67e8f9', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
    B.seg(Ap, Bp, { stroke: 'rgba(255,209,102,.16)', 'stroke-width': 10, 'stroke-linecap': 'round' });
    B.seg(Ap, Bp, { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-linecap': 'round' });

    /* —— 左栏：角弧与 γ（标签落在顶点下侧，外侧留给尺寸线） —— */
    angArc(Cp, 34, 0, g, { stroke: '#67e8f9', 'stroke-width': 1.4 });
    lab(V(Cp.x + 30, Cp.y + 18), '$\\gamma$', '#67e8f9');

    /* —— 左栏：投影分解的尺寸线 —— */
    if (st.proj) {
      const faint = { stroke: 'rgba(147,161,181,.42)', 'stroke-width': 1, 'stroke-dasharray': '2 3' };
      B.seg(V(Cp.x, y0 + 7), V(Cp.x, l1 + 4), faint);
      B.seg(V(Dp.x, y0 + 7), V(Dp.x, l2 + 5), faint);
      B.seg(V(Ap.x, y0 + 7), V(Ap.x, l2 + 5), faint);
      // 紫：有向投影 C→D；钝角时箭头朝左，正是「掉头」
      const dx = Dp.x - Cp.x;
      if (Math.abs(dx) > 8) {
        if (Math.abs(dx) > 30) B.arrow(V(Cp.x, l1), V(Dp.x, l1), { stroke: '#c084fc', 'stroke-width': 2, head: 9, wide: 4.5 });
        else {
          B.seg(V(Cp.x, l1), V(Dp.x, l1), { stroke: '#c084fc', 'stroke-width': 2 });
          B.dot(V(Dp.x, l1), 2.6, { fill: '#c084fc' });
        }
      }
      // 绿：水平直角边 D→A，两端带端标
      B.seg(V(Dp.x, l2), V(Ap.x, l2), { stroke: '#4ade80', 'stroke-width': 1.8 });
      B.seg(V(Dp.x, l2 - 5), V(Dp.x, l2 + 5), { stroke: '#4ade80', 'stroke-width': 1.8 });
      B.seg(V(Ap.x, l2 - 5), V(Ap.x, l2 + 5), { stroke: '#4ade80', 'stroke-width': 1.8 });
      // 橙：高 a·sinγ 与垂足直角记号
      B.seg(Dp, Bp, { stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
      const ux = Ap.x >= Dp.x ? 1 : -1, mm = 9;
      mk('polyline', {
        points: `${Dp.x + ux * mm},${Dp.y} ${Dp.x + ux * mm},${Dp.y - mm} ${Dp.x},${Dp.y - mm}`,
        fill: 'none', stroke: 'rgba(147,161,181,.75)', 'stroke-width': 1.2,
      }, B.dyn);
    }

    /* —— 左栏：顶点、垂足与边标（b 走三角形内侧，a / c 沿外法向） —— */
    B.dot(Cp, 2.8, { fill: '#93a1b5' });
    B.dot(Ap, 2.8, { fill: '#93a1b5' });
    mk('circle', { cx: Bp.x, cy: Bp.y, r: 9, fill: 'rgba(255,209,102,.16)', stroke: 'none' }, B.dyn);
    B.dot(Bp, 4.2, { fill: '#ffd166' });
    if (st.proj) B.dot(Dp, 2.6, { fill: '#ff9e4a' });
    vlab(V(Ap.x + 14, Ap.y + 16), 'A');
    vlab(V(Cp.x - 13, Cp.y + 16), 'C');
    vlab(V(Bp.x, Bp.y - 14), 'B');
    lab(V((Cp.x + Ap.x) / 2, Cp.y - 12), '$b$', '#5cadff');
    lab(outOf(Cp, Bp, ct, 16), '$a$', '#67e8f9');
    lab(outOf(Ap, Bp, ct, 16), `$c=${fmt(c, 2)}$`, '#ffd166');

    /* —— 左栏底部：三项分解的色标读数（颜色与图上尺寸线一一对应） —— */
    if (st.proj) {
      B.seg(V(30, 436), V(508, 436), { stroke: 'rgba(147,161,181,.22)', 'stroke-width': 1 });
      const items = [
        ['#c084fc', `$a\\cos\\gamma=${fmt(a * cs, 2)}$`],
        ['#ff9e4a', `$a\\sin\\gamma=${fmt(a * sn, 2)}$`],
        ['#4ade80', `$|b-a\\cos\\gamma|=${fmt(Math.abs(b - a * cs), 2)}$`],
      ];
      items.forEach(([col, s], i) => {
        const x0 = 42 + i * 152;
        B.seg(V(x0, 458), V(x0 + 14, 458), { stroke: col, 'stroke-width': 2.4, 'stroke-linecap': 'round' });
        B.textM(V(x0 + 20, 462), s, { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
      });
    }

    /* —— 右栏：一条按横线分段的读数板 —— */
    const TX = PR[0] + 14, TW = PR[2] - 28, mid = TX + TW / 2;
    const mx2 = Math.max(a2b2, c2) * 1.08;
    const rule = (ry, op) => mk('line', {
      x1: TX, y1: ry, x2: TX + TW, y2: ry,
      stroke: `rgba(147,161,181,${op || .22})`, 'stroke-width': 1,
    }, B.dyn);

    B.textM(V(TX, 38), '投影分解与修正项', { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'start' });
    rule(52);
    B.tex(V(TX, 76), '$c^2=(b-a\\cos\\gamma)^2+(a\\sin\\gamma)^2$', { size: 13, anchor: 'start', w: TW });
    mk('rect', { x: TX, y: 94, width: TW, height: 46, rx: 8, fill: 'rgba(255,209,102,.10)', stroke: 'rgba(255,209,102,.30)' }, B.dyn);
    B.tex(V(mid, 117), '$c^2=a^2+b^2-2ab\\cos\\gamma$', { size: 16, color: '#ffd166', anchor: 'mid', w: TW - 16 });
    rule(156);

    // 两根对比条：同一把尺子，右端读数右对齐在 TX+TW；右端之差用一条淡橙竖带直接罩出来
    // （不画引线：上条那根引线要穿过下一条的读数，1px 虚线压在数字上比不画更难认）
    const e1 = TX + TW * a2b2 / mx2, e2 = TX + TW * c2 / mx2;
    const xa = Math.min(e1, e2), xb = Math.max(e1, e2), gap = xb - xa;
    if (gap > 2) mk('rect', { x: xa, y: 183, width: gap, height: 58, rx: 3, fill: 'rgba(255,158,74,.12)', stroke: 'none' }, B.dyn);
    [[`$a^2+b^2$`, a2b2, '#5cadff', 186], [`$c^2$`, c2, '#ffd166', 230]].forEach(([nm, v2, col, ty]) => {
      B.textM(V(TX, ty - 9), nm, { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'start' });
      B.textM(V(TX + TW, ty - 9), fmt(v2, 2), { 'font-size': 13, fill: col, 'text-anchor': 'end' });
      mk('rect', { x: TX, y: ty, width: TW, height: 8, rx: 4, fill: 'rgba(147,161,181,.13)' }, B.dyn);
      const w2 = TW * v2 / mx2;
      mk('rect', { x: TX, y: ty, width: w2, height: 8, rx: 4, fill: col, 'fill-opacity': .9 }, B.dyn);
      mk('line', { x1: TX + w2, y1: ty - 3, x2: TX + w2, y2: ty + 11, stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round' }, B.dyn);
    });

    // 缺口尺寸线：挂在两根条下面，两端与竖带的边对齐
    if (gap > 2) {
      B.seg(V(xa, 256), V(xb, 256), { stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-linecap': 'round' });
      B.seg(V(xa, 250), V(xa, 262), { stroke: '#ff9e4a', 'stroke-width': 1.6 });
      B.seg(V(xb, 250), V(xb, 262), { stroke: '#ff9e4a', 'stroke-width': 1.6 });
      const cx2 = Math.max(TX + 78, Math.min(TX + TW - 78, (xa + xb) / 2));
      B.textM(V(cx2, 280), `缺口 $|2ab\\cos\\gamma|=${fmt(Math.abs(fix), 2)}$`, { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'middle', w: 170 });
    } else {
      B.textM(V(mid, 280), '零修正：两条一样长', { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'middle', w: 150 });
    }
    rule(296);

    // 两条读数的交叉核对（c² 由 hypot 实测、右列由 a²+b²−2ab·cosγ 现算）
    B.textM(V(TX, 322), '$c^2$ 实测', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
    B.textM(V(TX + TW, 322), fmt(c2, 2), { 'font-size': 14, fill: '#fff', 'text-anchor': 'end' });
    B.textM(V(TX, 348), '$a^2+b^2-2ab\\cos\\gamma$', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
    B.textM(V(TX + TW, 348), fmt(a2b2 - 2 * a * b * cs, 2), { 'font-size': 14, fill: '#fff', 'text-anchor': 'end' });
    rule(364);

    // arccos 反演：三边代回角
    const inv = Math.acos(Math.max(-1, Math.min(1, (a * a + b * b - c * c) / (2 * a * b)))) * 180 / Math.PI;
    B.tex(V(mid, 392), '$\\gamma=\\arccos\\frac{a^2+b^2-c^2}{2ab}$', { size: 14, color: '#c084fc', anchor: 'mid', w: TW - 16 });
    B.tex(V(mid, 428), `$=${fmt(inv, 1)}^\\circ$，与滑块对上`, { size: 12, color: '#93a1b5', anchor: 'mid', w: TW });

    // 底部三态指示：当前那一档转金
    rule(442, .18);
    const act = st.deg < 89.5 ? 0 : st.deg > 90.5 ? 2 : 1;   // 不写 === 90：滑块回传若是字符串，严格相等会判错档
    [['锐角', '负修正'], ['直角', '零修正'], ['钝角', '正修正']].forEach((pair, i) => {
      const cx3 = TX + TW * (i + .5) / 3, on = i === act;
      B.textM(V(cx3, 464), pair[0], { 'font-size': 12, fill: on ? '#ffd166' : '#93a1b5', 'text-anchor': 'middle' });
      B.textM(V(cx3, 481), pair[1], { 'font-size': 12, fill: on ? '#ffd166' : '#93a1b5', 'text-anchor': 'middle' });
      if (i) B.seg(V(TX + TW * i / 3, 452), V(TX + TW * i / 3, 486), { stroke: 'rgba(147,161,181,.18)', 'stroke-width': 1 });
    });

    /* —— 徽章 —— */
    const cor = -fix;                                   // 修正项 −2ab·cosγ
    cFix(`修正项 $-2ab\\cos\\gamma=${fmt(cor, 2)}$，` + (Math.abs(fix) < 0.02 ? '零修正，勾股成立' : cor < 0 ? '负修正，c² 变小' : '正修正，c² 变大'),
      Math.abs(fix) < 0.02 ? 'ok' : '');
    cInv(`反演 $\\gamma=${fmt(inv, 1)}^\\circ$` + (Math.abs(inv - st.deg) < 0.6 ? ' —— 与滑块完全重合' : ''),
      Math.abs(inv - st.deg) < 0.6 ? 'ok' : 'warn');
  };
  B.render();
  B.hintM('拖 $\\gamma$ 从锐到钝：紫箭头掉头，两条直角边一长一短；右栏两根横条的缺口即修正项');
  return B;
}
