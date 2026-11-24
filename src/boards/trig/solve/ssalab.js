/* 图 Z1 SSA 铰链机：正弦定理 a/sinα = b/sinβ = c/sinγ = 2R，与「解的个数」同时呈现。
   已知 c=AB（底边）、角 α（在 A）、对边 a=BC —— 以 B 为圆心、a 为半径画圆，
   与角 A 的另一边（射线）交出几个点，三角形就有几解：a 与垂距 h=c·sinα 比大小定无解/一解/两解。
   右栏把每条「边 ÷ 对角正弦」以分数形式列成学术三线表：行底淡色按解分带、比值一列全同，表下一道金色结论带收束 —— 正弦定理即「条条对得上」。
   坐标：A=(0,0)、B=(c,0)，α 自 +x 轴逆时针；s=26 px/单位。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { c: 6, deg: 40, a: 4.2, circ: true, labs: true };
  const S = 26, A0 = V(84, 268);
  const PL = [16, 12, 500, 486], PR = [510, 12, 334, 486];
  const X = x => A0.x + S * x, Y = y => A0.y - S * y;
  const cN = B.chipM('解的个数'), cH = B.chipM('垂距');
  const cSl = B.slider('底边 c', 3, 8, 0.05, st.c, v => { st.c = v; B.render(); }, 'c');
  const aSl = B.slider('角 α°', 15, 165, 5, st.deg, v => { st.deg = v; B.render(); }, 'ag');
  const dSl = B.slider('对边 a', 0.5, 8.5, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  const pre = (c, d, a) => () => { st.c = c; st.deg = d; st.a = a; cSl.sync(c); aSl.sync(d); dSl.sync(a); B.render(); };
  B.btn('① 切线直角', pre(6, 40, 6 * Math.sin(40 * Math.PI / 180) + 0)); // 设 a=h 需避开 0.05 步长 → 板内直接算
  B.btn('② 两解陷阱', pre(6, 40, 4.5));
  B.btnM('③ $a\\ge c$ 一解', pre(6, 40, 6.3));
  B.btn('④ 钝角一解', pre(6, 110, 6.3));   // 钝角 SSA：须 a>c 才有解（5.9<c 时交点全在反向延长线 → 无解）
  B.toggleBtn('外接圆', true, v => { st.circ = v; B.render(); });
  B.graphToggles(st, ['labs']);

  // 圆裁剪成可见折线段（防溢出左栏跑进右栏的三线表）
  const clipCircle = (cx, cy, r, rect, at) => {
    const n = 220, runs = [];
    let cur = [];
    for (let i = 0; i <= n; i++) {
      const th = TAU * i / n, p = V(cx + r * Math.cos(th), cy + r * Math.sin(th));
      const ok = p.x >= rect[0] - 2 && p.x <= rect[0] + rect[2] + 2 && p.y >= rect[1] - 2 && p.y <= rect[1] + rect[3] + 2;
      if (ok) cur.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      if ((!ok || i === n) && cur.length > 1) { runs.push(cur); cur = []; } else if (!ok) cur = [];
    }
    if (cur.length > 1) runs.push(cur);
    for (const pts of runs) mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  const angArc = (p, r, a0, a1, at) => {  // 角弧：a0→a1 弧度（数学方向，y 向上）
    const n = 26, pts = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + (a1 - a0) * i / n;
      pts.push(`${(p.x + r * Math.cos(t)).toFixed(1)},${(p.y - r * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  const tri = (P, Q, R, fill) => mk('polygon', { points: `${P.x},${P.y} ${Q.x},${Q.y} ${R.x},${R.y}`, fill, stroke: 'none' }, B.dyn);
  const angOf = (P, V1, V2) => Math.acos(Math.max(-1, Math.min(1, ((V1.x - P.x) * (V2.x - P.x) + (V1.y - P.y) * (V2.y - P.y)) / (Math.hypot(V1.x - P.x, V1.y - P.y) * Math.hypot(V2.x - P.x, V2.y - P.y))))) * 180 / Math.PI;
  // 板内字号由设置页的全局倍率统一钉住（global.css 的 svg text 读 --bd-fs），单条标签再写 font-size 不生效。
  // 所以分层换一种做法：顶点字母走 B.tex 显式排 14px，量与注释仍用 B.text 跟全局 12px；
  // B.tex 的 p 是垂直中心，按「基线 − 0.4×字号」换回原来的基线坐标，版面不动。
  const lab = (p, s, col, big) => {
    if (!st.labs) return;
    if (big) B.tex(V(p.x, p.y - 14 * 0.4), `$${s}$`, { size: 14, color: col || '#fff', anchor: 'mid', w: 48 });
    else B.text(V(p.x, p.y), s, { fill: col || '#fff', 'text-anchor': 'middle' });
  };

  B.renderFn = () => {
    const al = st.deg * Math.PI / 180, c = st.c, a = st.a;
    const h = c * Math.sin(al);                       // B 到射线的垂距
    const dir = V(Math.cos(al), Math.sin(al));
    // 解：t = c·cosα ± √(a²−h²)（先算出来，h 的标注与右栏都要用）
    const disc = a * a - h * h;
    const sols = [];
    if (disc >= -1e-9) {
      const sq = Math.sqrt(Math.max(0, disc)), tP = c * Math.cos(al) + sq, tM = c * Math.cos(al) - sq;
      if (tM > 1e-6) sols.push({ t: tM, near: true });
      if (tP > 1e-6 && (tM <= 1e-6 || tP - tM > 1e-6)) sols.push({ t: tP, near: false });
    }
    const Ap = V(X(0), Y(0)), Bp = V(X(c), Y(0));
    const rayEnd = V(X(dir.x * 14), Y(dir.y * 14));
    // 底边 AB + 延长虚线；A、B 各落一枚蓝点（与 C、D 同一套「点 = 图上的关键位置」）
    B.seg(Ap, Bp, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.dot(Ap, 3.2, { fill: '#5cadff' });
    B.dot(Bp, 3.2, { fill: '#5cadff' });
    B.seg(V(X(0), Y(0)), V(X(-0.4), Y(0)), { stroke: '#3f5f8f', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
    // 射线（角的另一边）：只是角的载体，压细一档、略透明，不与三角形的两条边抢粗细
    B.seg(V(X(0), Y(0)), rayEnd, { stroke: '#67e8f9', 'stroke-width': 1.5, 'stroke-opacity': .85 });
    angArc(Ap, 30, 0, al, { stroke: '#67e8f9', 'stroke-width': 1.4 });
    // 角标贴着弧写，字小一档才不至于被弧线穿成两截
    lab(V(X(30 * Math.cos(al / 2) / S), Y(30 * Math.sin(al / 2) / S)), `α=${st.deg}°`, '#67e8f9');
    // 以 B 为圆心 a 为半径的圆
    clipCircle(Bp.x, Bp.y, a * S, PL, { stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-opacity': .55 });
    // 垂线 BD + 垂足 D：垂足在射线上的参数是 t_D = c·cosα（B 在射线上的投影），
    // h = c·sinα 是垂线段的长度，不是垂足的位置 —— 以前按 t=h 取点，画出来的是斜边，自然不垂直。
    // α 为钝角时 t_D<0，垂足落到射线的反向延长线上，补一段细虚线把这根线接上
    const tD = c * Math.cos(al), D = V(tD * dir.x, tD * dir.y), Dp = V(X(D.x), Y(D.y));
    if (tD < -0.05) B.seg(V(X(0), Y(0)), Dp, { stroke: '#67e8f9', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .4 });
    B.seg(Bp, Dp, { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
    B.dot(Dp, 3, { fill: '#ffd166' });
    // 垂足直角记号：一条小折线夹住「射线」与「BD」，声明这一笔是垂直而不是随手一条斜线
    {
      const dl = Math.hypot(Bp.x - Dp.x, Bp.y - Dp.y) || 1;
      const vx = (Bp.x - Dp.x) / dl, vy = (Bp.y - Dp.y) / dl;   // D → B
      const ux = dir.x, uy = -dir.y;                            // 射线方向（画布 y 向下）
      const mm = 8, x1 = Dp.x + ux * mm, y1 = Dp.y + uy * mm;
      mk('polyline', {
        points: `${x1.toFixed(1)},${y1.toFixed(1)} ${(x1 + vx * mm).toFixed(1)},${(y1 + vy * mm).toFixed(1)} ${(Dp.x + vx * mm).toFixed(1)},${(Dp.y + vy * mm).toFixed(1)}`,
        fill: 'none', stroke: '#ffd166', 'stroke-width': 1, 'stroke-opacity': .65,
      }, B.dyn);
    }
    // 垂距只写字母 h（数值交给第一个徽章）：取 BD 中点、朝远离三角形的一侧推 15px——
    // 原来把 h=… 钉在垂足右下，两解时近解 C₁ 就在垂足旁，两行字直接叠在一起
    {
      const mB = V((Bp.x + Dp.x) / 2, (Bp.y + Dp.y) / 2);
      let nx = -(Dp.y - Bp.y), ny = Dp.x - Bp.x;
      const nl = Math.hypot(nx, ny) || 1;
      nx /= nl; ny /= nl;
      const farC = sols.length ? sols[sols.length - 1] : null;
      const gx = farC ? (Ap.x + Bp.x + X(farC.t * dir.x)) / 3 : (Ap.x + Bp.x) / 2;
      const gy = farC ? (Ap.y + Bp.y + Y(farC.t * dir.y)) / 3 : Ap.y;
      if (nx * (gx - mB.x) + ny * (gy - mB.y) > 0) { nx = -nx; ny = -ny; }
      lab(V(mB.x + nx * 15, mB.y + ny * 15), 'h', '#ffd166');
    }
    // 外接圆（穿过 A、B 与远解 C₂）
    if (st.circ && sols.length) {
      const far = sols[sols.length - 1], C = V(far.t * dir.x, far.t * dir.y);
      const oy = (far.t * far.t - c * C.x) / (2 * C.y), O = V(X(c / 2), Y(oy));
      const Rpx = Math.hypot(O.x - Ap.x, O.y - Ap.y);
      clipCircle(O.x, O.y, Rpx, PL, { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '4 5', 'stroke-opacity': .5 });
      // 半径数值已经由右栏的 2R 竖线交代；板上只标出这是外接圆。
      // 原来把 R=… 写在圆心旁，正好压在近解 C₁ 的标签与射线上；把标签放在圆心下方 0.55R 处，
      // 整块落在外接圆内部、又避开紫圆下沿（紫圆在圆心正下方还有一段），初始态两条圆轨都不穿字
      lab(V(O.x, Math.min(474, O.y + Rpx * 0.55)), '外接圆', '#ff9e4a');
    }
    // 逐解画三角形：近解金、远解橙
    sols.forEach((s2, i) => {
      const C = V(s2.t * dir.x, s2.t * dir.y), Cp = V(X(C.x), Y(C.y));
      const col = i === 0 && sols.length === 2 ? '#ffd166' : '#ff9e4a';
      tri(Ap, Bp, Cp, s2.near ? 'rgba(255,209,102,.05)' : 'rgba(255,158,74,.05)');
      B.seg(Bp, Cp, { stroke: col, 'stroke-width': 2.2 });
      B.seg(Ap, Cp, { stroke: col, 'stroke-width': 1.6 });
      B.dot(Cp, 4.5, { fill: col });
      angArc(Cp, 22, Math.atan2(-(Ap.y - Cp.y), Ap.x - Cp.x), Math.atan2(-(Bp.y - Cp.y), Bp.x - Cp.x), { stroke: col, 'stroke-width': 1.3 });
      // 标签沿「B → C」方向推到紫圆外：C 本身落在以 B 为圆心的紫圆上，紧贴着写会压在圆轨与
      // h 的虚线上。只写 C₁ / C₂（γ 的数值交给徽章与右栏）—— 远解那一点的左右夹着射线与外接圆，
      // 两者只张开十几度，宽标签根本塞不进这条缝；短标签才放得下。两解按远近编号，一解写 C。
      const rd = Math.hypot(Cp.x - Bp.x, Cp.y - Bp.y) || 1;
      const lx = Math.max(PL[0] + 38, Math.min(PL[0] + PL[2] - 42, Cp.x + (Cp.x - Bp.x) / rd * 26));
      const ly = Math.max(22, Math.min(486, Cp.y + (Cp.y - Bp.y) / rd * 26 + 4));
      lab(V(lx, ly), sols.length > 1 ? `C_{${i + 1}}` : 'C', col, true);
    });
    lab(V(Ap.x - 12, Ap.y + 16), 'A', '#fff', true); lab(V(Bp.x + 10, Bp.y + 16), 'B', '#fff', true);
    if (st.labs) B.text(V(Ap.x + 34, Ap.y + 16), `c=${fmt(c, 2)}`, { fill: '#5cadff' });
    // 右栏：学术三线表 —— 每行一条「边 ÷ 对角正弦」，右列写比值；相邻同解的两行共用一条淡色带，
    // 比值一列从上到下完全相同，一眼读出「换边换角换解，比值不变」
    const sinAl = Math.sin(al);
    const ref = a / sinAl;                            // 与 2R 恒等，只用来核对表格
    const rows = [];                                  // { tex, v, col, tint }
    if (sols.length) rows.push({ tex: '$\\frac{a}{\\sin\\alpha}$', v: ref, col: '#5cadff', tint: 'rgba(92,173,255,.12)' });
    for (let i = 0; i < sols.length; i++) {
      const s2 = sols[i], C = V(s2.t * dir.x, s2.t * dir.y);
      const gA = angOf(V(X(C.x), Y(C.y)), Ap, Bp) * Math.PI / 180;
      const col = sols.length > 1 ? (i === 0 ? '#ffd166' : '#ff9e4a') : '#ff9e4a';
      const tint = col === '#ffd166' ? 'rgba(255,209,102,.12)' : 'rgba(255,158,74,.12)';
      const sub = sols.length > 1 ? `_{${i + 1}}` : '';
      rows.push({ tex: `$\\frac{b${sub}}{\\sin\\beta${sub}}$`, v: s2.t / Math.sin(Math.PI - al - gA), col, tint });
      rows.push({ tex: `$\\frac{c}{\\sin\\gamma${sub}}$`, v: c / Math.sin(gA), col, tint });
    }
    const mid = PR[0] + PR[2] / 2;
    // 右栏构图：学术三线表（顶/头/底三条横线，无竖线无外框），行底淡色按解走、相邻同解两行并成一条色带；
    // 表下一道金色结论带收住「比值 = 2R」，再一行色标解释颜色含义。整块以 y=255 居中，
    // 让右栏成一块与左边三角形等重的「板」，而不是贴着上沿的一堆字
    if (rows.length) {
      const TX = PR[0] + 14, TW = PR[2] - 28;          // 表 524..830
      // 两列各给一条中心线：式子与比值都排在各自的中心上，长短不齐的行也落在同一条轴上
      const cT1 = TX + TW * 0.32, cT2 = TX + TW * 0.80;
      const HH = 26, RH = 40, BH = 46, n = rows.length;   // 15px 的分数式约 30px 高，行距 40 才留得开上下边
      const blockH = 16 + 10 + HH + n * RH + 20 + BH + 18 + 14;
      const top = 255 - blockH / 2;
      const hTop = top + 26, bodyTop = hTop + HH, bot = bodyTop + n * RH;
      const bandTop = bot + 20, bandBot = bandTop + BH;
      // 小标题（无大写英文、无编号，只一句陈述），跟着表走、居中压在表上方
      B.textM(V(mid, top + 8), '正弦定理：三条边与各自对角正弦的比值', { 'font-size': 13, fill: '#93a1b5' });
      // 行底色带：相邻同色行合并成一段，段与段之间留 1px 缝（靠上面那条细线分开）
      {
        let i0 = 0;
        for (let j = 1; j <= n; j++) {
          if (j === n || rows[j].tint !== rows[i0].tint) {
            const y0 = bodyTop + i0 * RH + 1, y1 = bodyTop + j * RH - 1;
            mk('rect', { x: TX, y: y0, width: TW, height: y1 - y0, rx: 4, fill: rows[i0].tint }, B.dyn);
            i0 = j;
          }
        }
      }
      // 三线：顶线重、表头下细、底线重（书刊三线表规矩）
      mk('line', { x1: TX, y1: hTop, x2: TX + TW, y2: hTop, stroke: 'rgba(147,161,181,.42)', 'stroke-width': 1.2 }, B.dyn);
      mk('line', { x1: TX, y1: hTop + HH, x2: TX + TW, y2: hTop + HH, stroke: 'rgba(147,161,181,.28)', 'stroke-width': .9 }, B.dyn);
      mk('line', { x1: TX, y1: bot, x2: TX + TW, y2: bot, stroke: 'rgba(147,161,181,.42)', 'stroke-width': 1.2 }, B.dyn);
      // 表头：左列式名、右列数值，都蹲在各自那条中心线上、与数据行同一基线
      B.textM(V(cT1, hTop + HH / 2 + 4), '边 ÷ 对角正弦', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'middle' });
      B.textM(V(cT2, hTop + HH / 2 + 4), '比值', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'middle' });
      // 行：式子走 KaTeX、比值走纯数字，两者各在自己那列居中；行距 40 给 15px 的分数式留出上下边
      rows.forEach((r2, i) => {
        const cy = bodyTop + i * RH + RH / 2;
        B.tex(V(cT1, cy), r2.tex, { size: 15, anchor: 'mid', w: 180, color: r2.col });
        B.textM(V(cT2, cy + 5.6), fmt(r2.v, 2), { 'font-size': 14, fill: r2.col, 'text-anchor': 'middle' });
      });
      // 结论带：淡金底 + 金边，一句公式收束（与表里同一种分数写法）
      mk('rect', { x: TX, y: bandTop, width: TW, height: BH, rx: 8, fill: 'rgba(255,209,102,.10)', stroke: 'rgba(255,209,102,.30)' }, B.dyn);
      B.tex(V(mid, bandTop + BH / 2), '$\\frac{a}{\\sin\\alpha}=\\frac{b}{\\sin\\beta}=\\frac{c}{\\sin\\gamma}=2R$', { size: 16, color: '#ffd166', anchor: 'mid', w: 290 });
      // 色标：三种颜色各一枚小横段 + 一句说明
      {
        const items = sols.length > 1
          ? [['#5cadff', '已知边 a'], ['#ffd166', '近解 C₁'], ['#ff9e4a', '远解 C₂']]
          : [['#5cadff', '已知边 a'], ['#ff9e4a', '解 C']];
        const wOf = s => [...s].reduce((w, ch) => w + (/[一-鿿]/.test(ch) ? 12 : 7), 0);
        const gap = 12, segW = 14;
        let total = 0;
        items.forEach(([, s], i) => { total += segW + 4 + wOf(s) + (i ? gap : 0); });
        let x = mid - total / 2;
        const ly = bandBot + 18 + 6;
        items.forEach(([col, s]) => {
          mk('line', { x1: x, y1: ly - 4, x2: x + segW, y2: ly - 4, stroke: col, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, B.dyn);
          B.textM(V(x + segW + 4, ly), s, { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
          x += segW + 4 + wOf(s) + gap;
        });
      }
    } else {
      B.tex(V(mid, 240), '无三角形，没有比值可列', { size: 15, color: '#ffd166', anchor: 'mid', w: 280 });
      B.textM(V(mid, 272), '紫圆与射线不相交 —— 对边 a 比垂距 h 还短', { 'font-size': 12, fill: '#93a1b5' });
    }
    // chips
    if (!sols.length) cN(a < h - 1e-9 ? `无解：$a=${fmt(a, 2)} < h=${fmt(h, 2)}$ —— 圆与射线不相交` : `无解（α 为钝角）：交点全落在反向延长线（t<0 排除）—— 钝角须 a>c 才有解`, 'warn');
    else if (sols.length === 1 && Math.abs(a - h) < 0.04) cN(`恰一解（切线）：a=h=${fmt(h, 2)} —— 直角三角形`, 'ok');
    else if (sols.length === 2) cN(`两解！${fmt(a, 2)} 介于 h=${fmt(h, 2)} 与 c=${fmt(c, 2)} 之间 —— 近解 $C_1$、远解 $C_2$ 都列出`, '');
    else cN(`恰一解（${st.deg > 90 ? 'α 为钝角' : '$a\\ge c$'}）：圆只交射线一次`, '');
    cH(`$h=c\\sin\\alpha=${fmt(c, 2)}\\times${fmt(Math.sin(al), 3)}=${fmt(h, 2)}$ 对边 $a=${fmt(a, 2)}$ ${a < h - 1e-9 ? '< h 无解' : a > h + 1e-9 ? '> h 有解' : '= h 相切'}`, a < h - 1e-9 ? 'warn' : '');
  };
  B.render();
  B.hint('拖 a 与 α：紫圆与射线交几点，三角形就有几解；右栏表里每行「边 ÷ 对角正弦」的比值全同');
  return B;
}
