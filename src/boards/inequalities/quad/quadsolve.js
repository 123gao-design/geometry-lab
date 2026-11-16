/* 图 次1 · 二次解集机：三个二次 —— 函数、方程、不等式
   抛物线 y=ax²+bx+c 与 x 轴的位置关系（Δ 三态）决定不等式 ax²+bx+c>0 的解集：
   金色带压在 x 轴上即解集；根按不等号严格与否画空心（不可取）或实心（可取）。
   拖 a、b、c 任一滑块，Δ、根、解集带、判读同步更新；a=0 时退化为一次式（徽章提示）。
   局部坐标约定：等比例坐标由 B.isoFit(-6,6,-8,8) 生成（m.px/m.py）；
   曲线采样含根与顶点锚点，|y|>50 截断。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 1, b: -1, c: -2, dir: '>', grid: true, labs: true };
  const DIRS = ['>', '\\ge', '<', '\\le'];
  const cD = B.chipM('判别式'), cS = B.chipM('解集'), cR = B.chipM('判读');

  const rootsOf = () => {
    const { a, b, c } = st;
    if (Math.abs(a) < 1e-9) return { deg: 'lin' };
    const d = b * b - 4 * a * c;
    if (d > 0.02) { const s = Math.sqrt(d); return { deg: 'quad', d, r1: (-b - s) / (2 * a), r2: (-b + s) / (2 * a) }; }
    if (d >= -0.02) return { deg: 'quad', d, r1: -b / (2 * a), r2: -b / (2 * a) };
    return { deg: 'quad', d };
  };

  B.renderFn = () => {
    const M = B.isoFit(-6, 6, -8, 8);
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    const { a, b, c } = st;
    const R = rootsOf();
    const f = x => a * x * x + b * x + c;
    const gt = st.dir === '>' || st.dir === '\\ge', strict = st.dir === '>' || st.dir === '<';
    const cfs = `${f1(a)}x^2${b >= 0 ? '+' : ''}${f1(b)}x${c >= 0 ? '+' : ''}${f1(c)}`;
    B.tex(V(430, 46), `$f(x)=${cfs}$，解 $f(x)${st.dir}0$`, { size: 16, anchor: 'mid' });
    B.text(V(430, 74), '金带 = 解集；空心点 = 严格不等号下不可取的根；青点 = 顶点', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 曲线（锚点：根、顶点、视野端点；|y| 截断防出界）
    const anchors = new Set([M.X0, M.X1]);
    const hv = -b / (2 * a), hk = c - b * b / (4 * a);
    if (R.deg === 'quad') { anchors.add(R.r1); anchors.add(R.r2); if (Math.abs(hv) < 60) anchors.add(hv); }
    const xs = [...anchors].map(v => Math.round(v * 100) / 100).sort((u, v) => u - v);
    const S = [];
    for (let i = 0; i < xs.length - 1; i++) {
      const p = xs[i], q = xs[i + 1];
      S.push(p);
      const n = Math.max(3, Math.ceil((q - p) / .08));
      for (let k = 1; k < n; k++) S.push(p + (q - p) * k / n);
    }
    S.push(xs[xs.length - 1]);
    const pts = S.map(x => { let y = f(x); if (y > 50) y = 50; if (y < -50) y = -50; return `${M.px(x)},${M.py(y)}`; });
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    // 解集带（压在 x 轴上，数值扫描）
    const y0 = M.py(0);
    const lo = Math.max(M.X0, -30), hi = Math.min(M.X1, 30);
    const hold = x => { const v = f(x); return st.dir === '>' ? v > 1e-9 : st.dir === '\\ge' ? v >= -1e-9 : st.dir === '<' ? v < -1e-9 : v <= 1e-9; };
    let s0 = null;
    const flush = r => {
      if (s0 !== null) {
        const L = Math.max(M.px(s0), M.px(lo)), Rr = Math.min(M.px(r), M.px(hi));
        if (Rr - L > .5) mk('rect', { x: L, y: y0 - 6, width: Rr - L, height: 12, fill: '#ffd166', 'fill-opacity': .45 }, B.dyn);
      }
      s0 = null;
    };
    for (let x = lo; x <= hi + 1e-9; x += .05) { if (hold(x)) { if (s0 === null) s0 = x; } else flush(x); }
    flush(hi);
    // 根与顶点
    if (R.deg === 'quad' && R.r1 !== undefined) {
      const mark = (r, lab) => {
        if (r < M.X0 - .1 || r > M.X1 + .1) return;
        B.dot(V(M.px(r), y0), 6, strict ? { fill: '#0a0d14', stroke: '#ffd166', 'stroke-width': 2 } : { fill: '#ffd166' });
        B.tex(V(M.px(r), y0 + 34), lab, { size: 12.5, anchor: 'mid', color: '#ffd166' });
      };
      if (Math.abs(R.r1 - R.r2) < 1e-9) mark(R.r1, '$x_{1,2}$');
      else { mark(R.r1, '$x_1$'); mark(R.r2, '$x_2$'); }
      if (Math.abs(hv) < 60 && Math.abs(hk) < 45) B.dot(V(M.px(hv), M.py(hk)), 5, { fill: '#67e8f9' });
    }
    // 徽章
    const RN = '$\\mathbb{R}$', EM = '$\\varnothing$';
    let sol = '';
    if (R.deg === 'lin') {
      cD('$a=0$：已退化 —— 不是二次式，按一次不等式处理', 'warn');
      if (Math.abs(b) < 1e-9) {
        sol = gt ? (c > 1e-9 || (Math.abs(c) < 1e-9 && !strict) ? RN : EM)
                 : (c < -1e-9 || (Math.abs(c) < 1e-9 && !strict) ? RN : EM);
      } else {
        const r0 = -c / b;
        sol = (b > 0) === gt ? `$x${strict ? '>' : '\\ge'}${f1(r0)}$` : `$x${strict ? '<' : '\\le'}${f1(r0)}$`;
      }
    } else {
      const dShow = Math.abs(R.d) < .02 ? 0 : R.d;
      cD(R.r1 === undefined ? `$\\Delta=b^2-4ac=${f1(dShow)}<0$ —— 无实根，抛物线与 x 轴不相交`
        : Math.abs(R.r1 - R.r2) < 1e-9 ? `$\\Delta=b^2-4ac=${f1(dShow)}$ —— 重根 $x_1=x_2=${f1(R.r1)}$`
        : `$\\Delta=b^2-4ac=${f1(dShow)}>0$ —— 两根 $x_1=${f1(R.r1)}$，$x_2=${f1(R.r2)}$`);
      const up = a > 0;
      if (R.r1 === undefined) sol = gt === up ? RN : EM;
      else if (Math.abs(R.r1 - R.r2) < 1e-9) {
        const r = R.r1;
        sol = gt === up ? (strict ? `$x\\ne ${f1(r)}$` : RN) : (strict ? EM : `$x=${f1(r)}$`);
      } else {
        const lo2 = Math.min(R.r1, R.r2), hi2 = Math.max(R.r1, R.r2);
        const outside = `$x${strict ? '<' : '\\le'}${f1(lo2)}$ 或 $x${strict ? '>' : '\\ge'}${f1(hi2)}$`;
        const inside = `$${f1(lo2)}${strict ? '<' : '\\le'}x${strict ? '<' : '\\le'}${f1(hi2)}$`;
        sol = gt === up ? outside : inside;
      }
    }
    cS(sol);
    let rt;
    if (R.deg === 'lin') rt = 'a=0：二次项消失 —— 图象是直线，解集由一次式的符号直接给出';
    else {
      const up = a > 0, open = up ? '向上' : '向下';
      if (R.r1 === undefined) rt = `开口${open}、无实根 —— 抛物线整条悬在 x 轴${up ? '上' : '下'}方：解集只有 $\\mathbb{R}$ 与 $\\varnothing$ 两态，由不等号方向选定`;
      else if (Math.abs(R.r1 - R.r2) < 1e-9) rt = `开口${open}、重根 —— 抛物线与 x 轴相切：解集退化为一点、除一点外的全体、或空集`;
      else rt = `开口${open}、两根 $x_1=${f1(Math.min(R.r1, R.r2))}$、$x_2=${f1(Math.max(R.r1, R.r2))}$ —— 不等号与开口配合：${gt === up ? '解集取两根之外（根外）' : '解集夹在两根之间（根内）'}，端点开闭由严格性决定；顶点 $(${f1(hv)},${f1(hk)})$`;
    }
    cR(rt);
  };

  const sA = B.slider('a =', -3, 3, .1, 1, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', -5, 5, .1, -1, v => { st.b = v; B.render(); });
  const sC = B.slider('c =', -6, 6, .1, -2, v => { st.c = v; B.render(); });
  const dirBtns = DIRS.map((d, i) => B.btnM(`$f(x)${d}0$`, () => {
    st.dir = d; dirBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const PRE = [
    { a: 1, b: -1, c: -2, n: '① $x^2-x-2$（Δ>0）' },
    { a: 1, b: -2, c: 1, n: '② $x^2-2x+1$（Δ=0）' },
    { a: 1, b: 1, c: 1, n: '③ $x^2+x+1$（Δ<0）' },
    { a: -1, b: 0, c: 4, n: '④ $-x^2+4$（开口向下）' },
  ];
  PRE.forEach((P, i) => B.btnM(P.n, () => {
    st.a = P.a; st.b = P.b; st.c = P.c;
    sA.sync(P.a); sB.sync(P.b); sC.sync(P.c); B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖 a、b、c 看 Δ 三态：金带即解集、空心点不可取；开口定「根外」还是「根内」');
  B.render();
  return B;
}
