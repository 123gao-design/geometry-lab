/* 图 次2 · 穿根机：高次与分式不等式 —— 符号表与穿根曲线
   把 P(x) 分解成一次因子之积（分式先移项通分、分母零点除外），下方符号表逐因子给符号
   （绿正红负），最末一行是 P(x) 的穿根曲线：从最右端（最高次系数为正 → 正号）向左穿行 ——
   奇重根穿过数轴（变号）、偶重根碰到数轴折回（不变号）。
   上方是 y=P(x) 的图象（分式含竖直渐近线），根为金色空心点、分母零点为红色空心点。
   局部坐标约定：上面板由 B.isoFit(-5.5,5.5,-2.2,2.2, rect=[10,10,840,232], pad=18) 生成；
   符号表行与其共用 m.px，行中心 274+i·24、积行 274+n·24+14。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 450;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const PRE = [
    { tex: '(x+2)(x-1)(x-3)', factors: [{ r: -2, m: 1 }, { r: 1, m: 1 }, { r: 3, m: 1 }] },
    { tex: '(x+2)^2(x-1)(x-3)', factors: [{ r: -2, m: 2 }, { r: 1, m: 1 }, { r: 3, m: 1 }] },
    { tex: '(x+3)(x+1)(x-2)(x-4)', factors: [{ r: -3, m: 1 }, { r: -1, m: 1 }, { r: 2, m: 1 }, { r: 4, m: 1 }] },
    { tex: '\\frac{x-1}{x+2}', factors: [{ r: -2, m: 1, den: true }, { r: 1, m: 1 }], frac: true },
  ];
  const st = { i: 0, dir: '>', grid: true, labs: true, asym: true };
  const cF = B.chipM('因子'), cS = B.chipM('解集'), cR = B.chipM('规律');

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
    const m = B.isoFit(-5.5, 5.5, -2.2, 2.2, [10, 10, 840, 232], 18);
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    const denRoots = P.factors.filter(f => f.den).map(f => f.r);
    if (P.frac && st.asym) B.asym(m, denRoots.map(v => ({ v })));
    const ys = P.factors.map(f => f.r);
    const y0 = m.py(0);
    // 曲线 y=P(x)：锚点含全部根，渐近线两侧断笔，|y|>40 截断
    const anchors = [m.X0, ...ys.slice().sort((u, v) => u - v), m.X1];
    const S = [];
    for (let i = 0; i < anchors.length - 1; i++) {
      const p = anchors[i], q = anchors[i + 1];
      S.push(p);
      const n = Math.max(2, Math.ceil((q - p) / .04));
      for (let k = 1; k < n; k++) S.push(p + (q - p) * k / n);
    }
    S.push(m.X1);
    let run = [];
    const flushRun = () => {
      if (run.length > 1) mk('polyline', { points: run.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
      run = [];
    };
    for (const x of S) {
      if (denRoots.some(b => Math.abs(x - b) < .05)) { flushRun(); continue; }
      const y = Pval(P, x);
      if (!isFinite(y) || Math.abs(y) > 40) { flushRun(); continue; }
      run.push(`${m.px(x)},${m.py(y)}`);
    }
    flushRun();
    // 根：分子根金色空心、分母零点红色空心
    for (const f of P.factors) {
      if (f.r < m.X0 - .1 || f.r > m.X1 + .1) continue;
      const col = f.den ? '#ff7b8a' : '#ffd166';
      B.dot(V(m.px(f.r), y0), 6, { fill: '#0a0d14', stroke: col, 'stroke-width': 2 });
      B.tex(V(m.px(f.r), y0 + 34), `$x=${f1(f.r)}$`, { size: 11.5, anchor: 'mid', color: col });
    }
    // 符号表：逐因子一行，绿正红负
    const xl = m.px(m.X0) + 52, xr = m.px(m.X1) - 4;
    B.text(V(xl - 10, 254), '符号表', { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'end' });
    B.text(V(xr, 254), '绿 = 正、红 = 负 · 红标签 = 分母因子（其零点除外）', { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'end' });
    P.factors.forEach((f, i) => {
      const cy = 274 + i * 24;
      B.tex(V(xl - 8, cy + 5), fTex(f), { size: 12, anchor: 'end', color: f.den ? '#ff7b8a' : '#93a1b5' });
      const gp = Math.max(xl, Math.min(xr, m.px(f.r)));
      if (gp > xl) mk('rect', { x: xl, y: cy - 5, width: gp - xl, height: 10, fill: '#ff7b8a', 'fill-opacity': .4 }, B.dyn);
      if (xr > gp) mk('rect', { x: gp, y: cy - 5, width: xr - gp, height: 10, fill: '#4ade80', 'fill-opacity': .4 }, B.dyn);
      mk('rect', { x: gp - .8, y: cy - 8, width: 1.6, height: 16, fill: '#93a1b5' }, B.dyn);
    });
    // 积行：P(x) 色带 + 穿根曲线 + 区域符号
    const cy = 274 + P.factors.length * 24 + 14;
    B.tex(V(xl - 8, cy + 5), '$P(x)$', { size: 12.5, anchor: 'end', color: '#ffd166' });
    B.seg(V(xl, cy), V(xr, cy), { stroke: '#3f5f8f', 'stroke-width': 1 });
    let s0 = null, cur = null;
    const flushP = r => {
      if (s0 !== null && r - s0 > .5)
        mk('rect', { x: s0, y: cy - 5, width: r - s0, height: 10, fill: cur > 0 ? '#4ade80' : '#ff7b8a', 'fill-opacity': .4 }, B.dyn);
      s0 = null;
    };
    for (let x = m.X0; x <= m.X1 + 1e-9; x += .04) {
      if (denRoots.some(b => Math.abs(x - b) < .05)) { flushP(m.px(x)); s0 = null; continue; }
      const v = Pval(P, x), sg = v > 0 ? 1 : -1;
      if (s0 === null) { s0 = m.px(x); cur = sg; }
      else if (sg !== cur) { flushP(m.px(x)); s0 = m.px(x); cur = sg; }
    }
    flushP(xr);
    const A = 15;
    let sg = -1;  // SVG 纵坐标向下：-1 = 上方 = 正号
    let pts = [[xr, cy + sg * A]];
    for (const f of P.factors.slice().sort((u, v) => v.r - u.r)) {
      const xp = m.px(f.r);
      if (f.m % 2 === 1) { pts.push([xp, cy + sg * A]); sg = -sg; pts.push([xp, cy + sg * A]); }
      else { pts.push([xp + 5, cy + sg * A]); pts.push([xp, cy]); pts.push([xp - 5, cy + sg * A]); }
    }
    pts.push([xl, cy + sg * A]);
    mk('polyline', { points: pts.map(p => p.join(',')).join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2 }, B.dyn);
    const edges = [m.X0 - 1e3, ...ys.slice().sort((u, v) => u - v), m.X1 + 1e3];
    for (let i = 0; i < edges.length - 1; i++) {
      const mid = (edges[i] + edges[i + 1]) / 2;
      if (mid < m.X0 || mid > m.X1) continue;
      const v = Pval(P, mid);
      if (!isFinite(v)) continue;
      B.text(V(m.px(mid), cy + (v > 0 ? -22 : 30)), v > 0 ? '+' : '−', { 'font-size': 13, fill: v > 0 ? '#4ade80' : '#ff7b8a', 'text-anchor': 'middle' });
    }
    // 徽章
    cF(`$${P.tex}${st.dir}0$ —— ${P.factors.length} 个一次因子${P.frac ? '，其中分母零点除外' : ''}`);
    const want = st.dir === '>' ? 1 : -1;
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
    cR('最高次系数为正：从最右端正号起笔向左穿行 —— 奇重根穿过（变号）、偶重根碰回（不变号）；分式先移项通分、分母零点除外');
  };

  const preBtns = PRE.map((P, i) => B.btnM(`$${P.tex}>0$`, () => {
    st.i = i; preBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const dirBtns = ['$P(x)>0$', '$P(x)<0$'].map((n, i) => B.btnM(n, () => {
    st.dir = i === 0 ? '>' : '<'; dirBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.graphToggles(st);

  B.hint('从最右端正号起笔向左穿行：奇重根穿过变号、偶重根碰回不变号；分式先化乘积');
  B.render();
  return B;
}
