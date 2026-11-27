/* 图 次2 · 穿根机：高次与分式不等式 —— 符号表与穿根曲线
   把 P(x) 分解成一次因子之积（分式先移项通分、分母零点除外），下方符号表逐因子给符号
   （绿正红负），最末一行是 P(x) 的穿根曲线：从最右端（最高次系数为正 → 正号）向左穿行 ——
   奇重根穿过数轴（变号）、偶重根碰到数轴折回（不变号）。
   函数图和符号表共用横坐标，每个预设按峰谷高度独立设置纵轴刻度。 */
import { InequalityBoard } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 526;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const PRE = [
    { tex: '(x+2)(x-1)(x-3)', view: [-2.9, 3.9, -22, 20], yStep: 5, factors: [{ r: -2, m: 1 }, { r: 1, m: 1 }, { r: 3, m: 1 }] },
    { tex: '(x+2)^2(x-1)(x-3)', view: [-3.2, 3.55, -25, 48], yStep: 10, factors: [{ r: -2, m: 2 }, { r: 1, m: 1 }, { r: 3, m: 1 }] },
    { tex: '(x+3)(x+1)(x-2)(x-4)', view: [-3.45, 4.45, -34, 50], yStep: 10, factors: [{ r: -3, m: 1 }, { r: -1, m: 1 }, { r: 2, m: 1 }, { r: 4, m: 1 }] },
    { tex: '\\frac{x-1}{x+2}', view: [-7, 5, -6, 8], yStep: 2, factors: [{ r: -2, m: 1, den: true }, { r: 1, m: 1 }], frac: true },
  ];
  const st = { i: 0, dir: '>', grid: true, labs: true, asym: true };
  const cF = B.readout('因子'), cS = B.readout('解集', 'mint'), cR = B.chipM('规律');

  const Pval = (P, x) => {
    let v = 1;
    for (const f of P.factors) {
      const t = x - f.r;
      v *= f.den ? 1 / Math.pow(t, f.m) : Math.pow(t, f.m);
    }
    return v;
  };
  const xTerm = r => (r < 0 ? `x+${f1(-r)}` : r > 0 ? `x-${f1(r)}` : 'x');
  const fTex = f => `$${f.m > 1 ? `(${xTerm(f.r)})^{${f.m}}` : xTerm(f.r)}$`;

  B.renderFn = () => {
    const P = PRE[st.i];
    const left = 94, right = W - 30;
    const m = B.mapFit(...P.view, [left, 27, right - left, 264], 0);
    const roots = P.factors.map(f => f.r);
    const denRoots = P.factors.filter(f => f.den).map(f => f.r);
    B.grid({ ...m, sx: 1, sy: P.yStep, xt: roots.filter(x => !denRoots.includes(x)), grid: st.grid, labs: st.labs });
    if (P.frac && st.asym) B.asym(m, [{ v: -2 }, { h: 1 }]);
    const f = x => Pval(P, x);
    const branches = [m.X0, ...denRoots, m.X1];
    for (let i = 1; i < branches.length; i++) {
      B.plot(f, m, { x0: branches[i - 1], x1: branches[i], anchors: roots, n: 560,
        stroke: '#5cadff', 'stroke-width': 2.5 });
    }
    // 端部箭头沿曲线的割线方向，提示函数在取景范围以外继续延伸。
    const tip = (x, from) => B.arrow(V(m.px(from), m.py(f(from))), V(m.px(x), m.py(f(x))),
      { fill: '#5cadff', line: false, head: 9, wide: 3.6 });
    tip(m.X0, m.X0 + .03);
    tip(m.X1, m.X1 - .03);
    if (P.frac) {
      for (const y of [m.Y0, m.Y1]) {
        const x = -2 - 3 / (y - 1);
        tip(x, x + Math.sign(x + 2) * .02);
      }
    }
    for (const x of roots) {
      if (!denRoots.includes(x)) B.mark(V(m.px(x), m.py(0)), '#5cadff');
      B.seg(V(m.px(x), 300), V(m.px(x), 418 + (P.factors.length - 3) * 24),
        { stroke: '#93a1b5', 'stroke-opacity': .35, 'stroke-dasharray': '3 5' });
    }
    const xl = left, xr = right;
    if (st.labs) B.tex(V(xl - 10, 310), '因子', { anchor: 'end', size: 13 });
    B.note('正号', '#4ade80'); B.note('负号', '#ff7b8a');
    P.factors.forEach((f, i) => {
      const cy = 340 + i * 24;
      B.tex(V(xl - 8, cy + 5), fTex(f), { size: 12, anchor: 'end', color: f.den ? '#ff7b8a' : '#93a1b5' });
      const gp = Math.max(xl, Math.min(xr, m.px(f.r)));
      if (gp > xl) mk('rect', { x: xl, y: cy - 5, width: gp - xl, height: 10, fill: f.m % 2 ? '#ff7b8a' : '#4ade80', 'fill-opacity': .4 }, B.dyn);
      if (xr > gp) mk('rect', { x: gp, y: cy - 5, width: xr - gp, height: 10, fill: '#4ade80', 'fill-opacity': .4 }, B.dyn);
      mk('rect', { x: gp - .8, y: cy - 8, width: 1.6, height: 16, fill: '#93a1b5' }, B.dyn);
    });
    // 积行：P(x) 色带 + 穿根曲线 + 区域符号
    const cy = 340 + P.factors.length * 24 + 14;
    B.tex(V(xl - 8, cy + 5), '$P(x)$', { size: 12.5, anchor: 'end', color: '#ffd166' });
    B.seg(V(xl, cy), V(xr, cy), { stroke: '#3f5f8f', 'stroke-width': 1 });
    const cuts = [xl, ...roots.map(m.px).filter(x => x > xl && x < xr).sort((a, b) => a - b), xr];
    const want = st.dir === '>' ? 1 : -1;
    for (let i = 1; i < cuts.length; i++) {
      const left = cuts[i - 1], right = cuts[i];
      const sample = (0.5 * (left + right) - m.px(0)) / m.s;
      const sign = Math.sign(Pval(P, sample));
      const color = sign > 0 ? '#4ade80' : '#ff7b8a';
      mk('rect', { x: left, y: cy - 5, width: right - left, height: 10, fill: color,
        'fill-opacity': sign === want ? .55 : .14 }, B.dyn);
      if (st.labs) B.tex(V((left + right) / 2, cy + 34), sign > 0 ? '$+$' : '$-$',
        { size: 14, color, anchor: 'mid', w: 28 });
    }
    const A = 15;
    let sg = -1;  // SVG 纵坐标向下：-1 = 上方 = 正号
    const pts = [[xr, cy + sg * A]];
    for (const f of P.factors.slice().sort((u, v) => v.r - u.r)) {
      const xp = m.px(f.r);
      if (f.m % 2 === 1) { pts.push([xp, cy + sg * A]); sg = -sg; pts.push([xp, cy + sg * A]); }
      else { pts.push([xp + 5, cy + sg * A]); pts.push([xp, cy]); pts.push([xp - 5, cy + sg * A]); }
    }
    pts.push([xl, cy + sg * A]);
    mk('polyline', { points: pts.map(p => p.join(',')).join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2 }, B.dyn);
    for (const factor of P.factors) {
      B.dot(V(m.px(factor.r), cy), 4, { fill: B.diagramColors.paper, stroke: factor.den ? '#ff7b8a' : '#ffd166', 'stroke-width': 1.6 });
    }
    const edges = [m.X0 - 1e3, ...roots.slice().sort((u, v) => u - v), m.X1 + 1e3];
    // 徽章
    cF(`$${P.tex}${st.dir}0$ —— ${P.factors.length} 个一次因子${P.frac ? '，其中分母零点除外' : ''}`);
    const pieces = [];
    for (let i = 0; i < edges.length - 1; i++) {
      const mid = (edges[i] + edges[i + 1]) / 2;
      if ((Pval(P, mid) > 0 ? 1 : -1) === want) {
        const l = edges[i], r = edges[i + 1];
        if (l <= -1e3) pieces.push(`$x<${f1(r)}$`);
        else if (r >= 1e3) pieces.push(`$x>${f1(l)}$`);
        else pieces.push(`$${f1(l)}<x<${f1(r)}$`);
      }
    }
    let sol = pieces.length ? pieces.join(' 或 ') : '$\\varnothing$';
    if (P.frac) sol += `（$x\\ne ${f1(denRoots[0])}$：分母零点除外）`;
    cS(sol);
    cR(P.frac ? '先移项通分，从右端正号向左逐段判号，排除分母零点。'
      : '最高次系数为正，从右端正号向左推：奇重根变号，偶重根同号。');
  };

  B.choiceRow('选择函数', PRE.map((p, i) => ({
    name: ['三单根', '含重根', '四单根', '分式'][i], formula: `$P(x)=${p.tex}$`,
  })), () => st.i, i => { st.i = i; B.render(); });
  B.choiceRow('选择符号', [{ name: '正值', formula: '$P(x)>0$' }, { name: '负值', formula: '$P(x)<0$' }],
    () => st.dir === '>' ? 0 : 1, i => { st.dir = i === 0 ? '>' : '<'; B.render(); });
  B.graphToggles(st);

  B.render();
  return B;
}
