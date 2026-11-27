import { LegendProofBoard } from '../proof-board.js';
import { hEl, mk, V, fmt } from '../../../lib/board.js';
import { arcAngle, areaChart } from './area-chart.js';
import '../unit/angle-readings.css';
import './theorem-frames.css';
import './arealab.css';
import frameCSS from './theorem-frames.css?inline';
import panelCSS from './arealab.css?inline';
import infoCSS from '../../info-readings.css?inline';

export function createBoard(root) {
  const B = new LegendProofBoard(root, 512, 412, 44);
  root.classList.add('trig-side-board', 'trig-theorem-board', 'trig-compact-choices', 'area-board');
  B.proof = hEl('section', { class: 'trig-theorem-panel area-panel', 'aria-label': '面积曲线与读数' });
  root.insertBefore(B.proof, B.chipRow);
  B.exportCheckHeight = 80;
  B.exportSize = { width: 1024, plotWidth: B.w * 1.25, height: B.h * 1.25 + B.exportCheckHeight };
  B.proofCSS = frameCSS + panelCSS + infoCSS;
  const chart = areaChart(B);
  const cTop = B.chipM('取等条件');
  const check = hEl('div', { class: 'fn-reading-group', 'data-reading-style': 'info' }, B.proof);
  check.appendChild(cTop.el);
  const cMax = B.chipM('理论上界');
  const st = { mode: 0, a: 4, b: 5, deg: 60, aldeg: 40, t: 0.5, labs: true };
  const O2 = V(256, 186), R2 = 148;
  const aSl = B.slider('边 a', 2, 6, 0.05, st.a, v => { st.a = v; B.render(); }, 'a', n => `边 $a=${n}$`);
  const bSl = B.slider('边 b', 2, 6, 0.05, st.b, v => { st.b = v; B.render(); }, 'b', n => `边 $b=${n}$`);
  const gSl = B.slider('夹角 γ°', 10, 170, 5, st.deg, v => { st.deg = v; B.render(); }, 'g', n => `夹角 $\\gamma=${n}^\\circ$`);
  const alSl = B.slider('角 α°', 20, 80, 5, st.aldeg, v => { st.aldeg = v; B.render(); }, 'ag', n => `角 $\\alpha=${n}^\\circ$`);
  const tSl = B.slider('弧位 t', 0, 1, 0.01, st.t, v => { st.t = v; B.render(); }, 't', n => `弧位 $t=${n}$`);
  const rowOf = s => s.parent || s.parentElement;
  B.choiceRow('选择模式', ['$\\frac12 ab\\sin\\gamma$ 夹角扫掠', '同弦同角对比'].map(name => ({ name })), () => st.mode, setMode);
  const examples = [
    { name: '面积最大 $\\gamma=90^\\circ$', values: { mode: 0, deg: 90 } },
    { name: '同弦等腰', values: { mode: 1, t: 0.5 } },
    { name: '偏向端点', values: { mode: 1, t: 0.06 } },
  ];
  B.examples('选择例题', examples, st, values => {
    Object.assign(st, values); gSl.sync(st.deg); tSl.sync(st.t); setMode(st.mode);
  });
  B.graphToggles(st, ['labs']);
  function setMode(m) {
    st.mode = m;
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
    if (st.labs) B.textM(p, s, { 'font-size': size || 12, fill: col || B.diagramColors.ink, 'text-anchor': anchor || 'middle' });
  };
  const vlab = (p, s, anchor) => {
    if (st.labs) B.tex(V(p.x, p.y - 14 * 0.4), `$${s}$`, { size: 14, color: B.diagramColors.ink, anchor: anchor || 'mid', w: 48 });
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
  // 模式二几何：给定 u 求全部读数
  const m2geom = () => {
    const a = st.a, al = st.aldeg * Math.PI / 180, R = a / (2 * Math.sin(al)), d = R * Math.cos(al);
    const u = arcAngle(st.t, al);
    const A = V(R * Math.sin(u), R * Math.cos(u)), Bc = V(-a / 2, -d), Cc = V(a / 2, -d);
    const h = A.y + d;
    const bLen = 2 * R * Math.sin(Math.abs(u - (Math.PI - al)) / 2), cLen = 2 * R * Math.sin(Math.abs(u + Math.PI - al) / 2);
    return { a, al, R, d, u, A, Bc, Cc, h, bLen, cLen, S: a * h / 2, p: bLen + cLen };
  };

  B.renderFn = () => {
    if (st.mode === 0) {
      const a = st.a, b = st.b, g = st.deg * Math.PI / 180;
      const Bm = V(a * Math.cos(g), a * Math.sin(g));
      const scale = Math.min(430 / (a + b), 220 / a);
      const originX = (B.w - scale * (Math.min(0, Bm.x) + Math.max(b, Bm.x))) / 2;
      const X1 = x => originX + scale * x, Y1 = y => 292 - scale * y;
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
      lab(V((Cp.x + Ap.x) / 2, yd + 18), `底 $b=${fmt(b, 2)}$`, '#5cadff');
      const xd = Math.max(Ap.x, Bp.x) + 14;   // 高量线挂在整幅图最右沿之外：既不被斜边穿过，也压不到 A 的字母
      B.seg(V(xd, y0), V(xd, Bp.y), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
      B.seg(V(xd - 5, y0), V(xd + 5, y0), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
      B.seg(V(xd - 5, Bp.y), V(xd + 5, Bp.y), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
      lab(V(xd, Bp.y - 10), `高 $h=a\\sin\\gamma=${fmt(h, 2)}$`, '#ff9e4a', 12, 'end');

      /* —— 角、顶点与边标 —— */
      angArc(Cp, 34, 0, g, { stroke: '#67e8f9', 'stroke-width': 1.4 });
      lab(V(Cp.x + 30, y0 + 20), '$\\gamma$', '#67e8f9', 12);
      vlab(V(Cp.x - 12, y0 + 16), 'C'); vlab(V(Ap.x + 6, y0 + 16), 'A'); vlab(V(Bp.x - 12, Bp.y + 4), 'B', 'end');
      lab(outOf(Cp, Bp, ct, 14), '$a$', '#67e8f9');
      B.mark(Bp, '#67e8f9');
      B.note('底 $b$', '#5cadff');
      B.note('转动边 $a=' + fmt(a, 2) + '$', '#67e8f9');
      B.note('高 $h$', '#ff9e4a', 'dashed');
      chart({
        title: '面积随夹角变化', labs: st.labs,
        xMax: Math.PI, yMax: Scap, at: g, xLabel: '\\gamma', yLabel: 'S', peakLabel: '\\gamma=90^\\circ',
        xTicks: [[Math.PI / 4, '\\pi/4'], [Math.PI / 2, '\\pi/2'], [3 * Math.PI / 4, '3\\pi/4'], [Math.PI, '\\pi']],
        curves: [{ name: '$S(\\gamma)$', tone: 'blue', fn: x => Scap * Math.sin(x) }],
        fields: [['面积 $S$', fmt(Sm, 2), 'gold'], ['高 $h$', fmt(h, 2), 'orange'], ['$\\sin\\gamma$', fmt(Math.sin(g), 3), 'mint']],
        share: Sm / Scap,
      });
      const at90 = st.deg === 90;
      if (at90) cTop(`$\\gamma=90^\\circ$ 时 $\\sin\\gamma=1$，面积达到 $\\tfrac12 ab=${fmt(Scap, 2)}$。`, 'ok');
      else cTop(`$\\gamma=${st.deg}^\\circ$ 时 $\\sin\\gamma\\approx${fmt(Math.sin(g), 3)}$，面积比上界小约 $${fmt((1 - Math.sin(g)) * 100, 0)}\\%$。`, '');
      cMax(`$S\\le\\frac12 ab=${fmt(Scap, 2)}$（$\\gamma=90^\\circ$ 时取等）`, '');
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
      lab(V(Op.x - 18, Op.y - R2 - 14), '$A$ 沿大弧滑动', '#c084fc', 11, 'end');
      mk('polygon', { points: `${Ap.x},${Ap.y} ${Bp.x},${Bp.y} ${Cp.x},${Cp.y}`, fill: 'rgba(255,209,102,.10)', stroke: 'none' }, B.dyn);
      B.seg(Bp, Cp, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
      B.seg(Ap, Bp, { stroke: '#67e8f9', 'stroke-width': 2 });
      B.seg(Ap, Cp, { stroke: '#5cadff', 'stroke-width': 2 });
      B.seg(V(Ap.x, Ap.y), V(Ap.x, cy), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
      B.seg(Op, Ap, { stroke: '#93a1b5', 'stroke-opacity': .6, 'stroke-width': 1, 'stroke-dasharray': '3 5' });

      /* —— 角 α 与边标 —— */
      const a1 = Math.atan2(-(Bp.y - Ap.y), Bp.x - Ap.x), a2 = Math.atan2(-(Cp.y - Ap.y), Cp.x - Ap.x);
      angArc(Ap, 28, a1, a1 + Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1)), { stroke: '#ffd166', 'stroke-width': 1.3 });
      let tb = Math.atan2(Cp.y - Ap.y, Cp.x - Ap.x);
      let dt = Math.atan2(Bp.y - Ap.y, Bp.x - Ap.x) - tb;
      while (dt > Math.PI) dt -= 2 * Math.PI;
      while (dt < -Math.PI) dt += 2 * Math.PI;
      tb += dt / 2;
      lab(V(Ap.x + 40 * Math.cos(tb), Ap.y + 40 * Math.sin(tb)), '$\\alpha$', '#ffd166', 12);   // 角很窄，只写字母；数值进右栏读数
      lab(outOf(Ap, Bp, ct, 14), '$c$', '#67e8f9');
      lab(outOf(Ap, Cp, ct, 14), '$b$', '#5cadff');
      lab(V((Bp.x + Cp.x) / 2, cy + 18), `定弦 $a=${fmt(g2.a, 2)}$`, '#ff9e4a');
      vlab(V(Bp.x - 12, Bp.y + 16), 'B'); vlab(V(Cp.x + 12, Cp.y + 16), 'C'); vlab(V(Ap.x + 13, Ap.y - 12), 'A');
      B.mark(Ap, '#67e8f9');
      B.mark(V(Op.x, Op.y - R2), '#ffd166');

      const Sm2 = g2.a * (g2.R + g2.d) / 2;
      const Pm2 = 4 * g2.R * Math.cos(g2.al / 2);
      B.note('定弦 $a$', '#ff9e4a');
      B.note('边 $b\\approx' + fmt(g2.bLen, 2) + '$', '#5cadff');
      B.note('边 $c\\approx' + fmt(g2.cLen, 2) + '$', '#67e8f9');
      B.note('$R\\approx' + fmt(g2.R, 2) + '$', '#93a1b5', 'dashed');
      chart({
        title: '面积与两边之和随弧位变化', labs: st.labs,
        xMax: 1, yMax: 1, at: st.t, xLabel: 't', yLabel: '', peakLabel: 't=1/2',
        xTicks: [[.25, '0.25'], [.5, '0.5'], [.75, '0.75'], [1, '1']],
        curves: [
          { name: '$S/S_{\\max}$', tone: 'gold', fn: t => (g2.R * Math.cos(arcAngle(t, g2.al)) + g2.d) / (g2.R + g2.d) },
          { name: '$(b+c)/(b+c)_{\\max}$', tone: 'violet', dashed: true, fn: t => Math.cos(arcAngle(t, g2.al) / 2) },
        ],
        fields: [['面积 $S$', fmt(g2.S, 2), 'gold'], ['两边之和 $b+c$', fmt(g2.p, 2), 'violet'],
          ['对角 $\\alpha$', fmt(st.aldeg, 0) + '^\\circ', 'orange'], ['弧位 $t$', fmt(st.t, 2), 'mint']],
        share: g2.S / Sm2,
      });
      const iso = Math.abs(st.t - .5) < 1e-9;
      cTop(iso ? '$b=c$，面积与两边之和同时最大。' : `两边长度之差为 $|b-c|\\approx${fmt(Math.abs(g2.bLen - g2.cLen), 2)}$。`, iso ? 'ok' : '');
      cMax(`$S\\le R^2\\sin\\alpha(1+\\cos\\alpha)=${fmt(Sm2, 2)}$，$b+c\\le4R\\cos\\tfrac\\alpha2=${fmt(Pm2, 2)}$`, '');
    }

    /* —— 左栏底部：公式的现场代入（两种模式共用一处收束） —— */
    const base = st.mode === 0 ? st.b : st.a;
    const height = st.mode === 0 ? st.a * Math.sin(st.deg * Math.PI / 180) : m2geom().h;
    const baseSymbol = st.mode === 0 ? 'b' : 'a';
    B.tex(V(256, 383), '$S=\\tfrac12 ' + baseSymbol + 'h\\approx\\tfrac12\\times' + fmt(base, 2)
      + '\\times' + fmt(height, 3) + '\\approx' + fmt(base * height / 2, 2) + '$',
      { size: 14, color: '#ffd166', anchor: 'mid', w: 470 });
  };
  B.render();
  B.hintM('拖动夹角 $\\gamma$，比较三角形与虚线矩形的面积。切换到同弦模式后，滑动弧位 $t$，观察两条曲线何时同时到达峰顶。');
  return B;
}
