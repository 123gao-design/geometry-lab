/* 图 次1 · 二次解集机：函数、方程与不等式
   抛物线 y=ax²+bx+c 与 x 轴的位置关系（Δ 三态）决定不等式 ax²+bx+c>0 的解集：
   金色带压在 x 轴上即解集；根按不等号严格与否画空心（不可取）或实心（可取）。
   拖 a、b、c 任一滑块，Δ、根、解集带、判读同步更新；a=0 时退化为一次式（徽章提示）。
   局部坐标约定：等比例坐标由 B.isoFit(-6,6,-8,8) 生成（m.px/m.py）；
   曲线采样含根与顶点锚点，|y|>50 截断。 */
import { InequalityBoard } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 1, b: -1, c: -2, dir: '>', grid: true, labs: true };
  const DIRS = ['>', '\\ge', '<', '\\le'];
  const cD = B.readout('判别式'), cS = B.readout('解集', 'mint'), cR = B.chipM('判读');

  const rootsOf = () => {
    const { a, b, c } = st;
    if (Math.abs(a) < 1e-9) return { deg: 'lin' };
    const d = b * b - 4 * a * c;
    if (d > 1e-9) { const s = Math.sqrt(d); return { deg: 'quad', d, r1: (-b - s) / (2 * a), r2: (-b + s) / (2 * a) }; }
    if (d >= -1e-9) return { deg: 'quad', d, r1: -b / (2 * a), r2: -b / (2 * a) };
    return { deg: 'quad', d };
  };

  B.renderFn = () => {
    const M = B.isoFit(-6, 6, -8, 8);
    B.grid({ ...M, grid: st.grid, labs: st.labs, lx: 2, ly: 2 });
    const { a, b, c } = st;
    const R = rootsOf();
    const f = x => a * x * x + b * x + c;
    const gt = st.dir === '>' || st.dir === '\\ge', strict = st.dir === '>' || st.dir === '<';
    const terms = [[a, 'x^2'], [b, 'x'], [c, '']].filter(([k]) => k !== 0);
    const cfs = terms.map(([k, power], i) => {
      const sign = k < 0 ? '-' : i ? '+' : '';
      const magnitude = power && Math.abs(k) === 1 ? '' : f1(Math.abs(k));
      return sign + magnitude + power;
    }).join('') || '0';
    B.note(`$f(x)=${cfs}$`, '#5cadff');
    const vertex = R.deg === 'quad' ? -b / (2 * a) : null;
    const rootList = R.r1 !== undefined ? [R.r1, R.r2] : R.deg === 'lin' && b !== 0 ? [-c / b] : [];
    const roots = [...new Set(rootList)].sort((x,y) => x-y);
    B.plot(f, M, { anchors: [...roots, ...(vertex === null ? [] : [vertex])], stroke: '#5cadff', 'stroke-width': 2.2 });
    const y0 = M.py(0);
    const edges = [M.X0, ...roots.filter(x => x > M.X0 && x < M.X1), M.X1];
    for (let i = 1; i < edges.length; i++) {
      const left = edges[i-1], right = edges[i], mid = f((left + right) / 2);
      if (mid === 0 ? !strict : (mid > 0) === gt) {
        mk('rect', { x: M.px(left), y: y0 - 5, width: M.px(right)-M.px(left), height: 10, fill: '#ffd166', 'fill-opacity': .42 }, B.dyn);
      }
    }
    roots.forEach(x => {
      if (x < M.X0 || x > M.X1) return;
      const point = V(M.px(x), y0);
      if (strict) B.dot(point, 4.5, { fill: B.diagramColors.paper, stroke: '#ffd166', 'stroke-width': 1.8 });
      else B.mark(point, '#ffd166');
    });
    const hv = vertex, hk = vertex === null ? null : f(vertex);
    if (vertex !== null && roots.length !== 1) B.mark(V(M.px(hv), M.py(hk)), '#67e8f9');
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
      const dShow = Math.abs(R.d) < 1e-9 ? 0 : R.d;
      cD(R.r1 === undefined ? `$\\Delta=b^2-4ac=${f1(dShow)}<0$ —— 无实根，抛物线与 x 轴不相交`
        : Math.abs(R.r1 - R.r2) < 1e-9 ? `$\\Delta=b^2-4ac=${f1(dShow)}$ —— 重根 $x_1=x_2=${f1(R.r1)}$`
        : `$\\Delta=b^2-4ac=${f1(dShow)}>0$ —— 两根 $x_1=${f1(roots[0])}$，$x_2=${f1(roots[1])}$`);
      const up = a > 0;
      if (R.r1 === undefined) sol = gt === up ? RN : EM;
      else if (Math.abs(R.r1 - R.r2) < 1e-9) {
        const r = R.r1;
        sol = gt === up ? (strict ? `$x\\ne ${f1(r)}$` : RN) : (strict ? EM : `$x=${f1(r)}$`);
      } else {
        const lo2 = Math.min(R.r1, R.r2), hi2 = Math.max(R.r1, R.r2);
        const outside = `$x${strict ? '<' : '\\le'}${f1(lo2)}$ 或 $x${strict ? '>' : '\\ge'}${f1(hi2)}$`;
        const inside = `$${f1(lo2)}${strict ? '<' : '\\le'} x${strict ? '<' : '\\le'}${f1(hi2)}$`;
        sol = gt === up ? outside : inside;
      }
    }
    cS(sol);
    let rt;
    if (R.deg === 'lin') rt = b === 0 ? '只需检验常数项是否满足不等式。' : '二次项为零，按一次不等式求解。';
    else {
      const up = a > 0, open = up ? '向上' : '向下';
      if (roots.length === 0) rt = `抛物线全在横轴${up ? '上' : '下'}方，函数值恒${up ? '正' : '负'}。`;
      else if (roots.length === 1) rt = `重根处取零，其余函数值均为${up ? '正' : '负'}；本题${strict ? '排除' : '包含'}重根。`;
      else rt = `开口${open}，取两根${gt === up ? '之外' : '之间'}，${strict ? '不含' : '包含'}端点。顶点为 $(${f1(hv)},${f1(hk)})$。`;
    }
    cR(rt);
  };

  const sA = B.slider('a =', -3, 3, .1, 1, v => { st.a = v; B.render(); }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', -5, 5, .1, -1, v => { st.b = v; B.render(); }, undefined, n => `$b=${n}$`);
  const sC = B.slider('c =', -6, 6, .1, -2, v => { st.c = v; B.render(); }, undefined, n => `$c=${n}$`);
  B.choiceRow('选择模式', DIRS.map((d, i) => ({ name: ['正值','非负','负值','非正'][i], formula: `$f(x)${d}0$` })), () => DIRS.indexOf(st.dir), i => {
    st.dir = DIRS[i]; B.render();
  });
  const PRE = [
    { name: '两根', formula: '$x^2-x-2$', values: { a: 1, b: -1, c: -2 } },
    { name: '重根', formula: '$x^2-2x+1$', values: { a: 1, b: -2, c: 1 } },
    { name: '无实根', formula: '$x^2+x+1$', values: { a: 1, b: 1, c: 1 } },
    { name: '向下开口', formula: '$-x^2+4$', values: { a: -1, b: 0, c: 4 } },
  ];
  B.examples('选择例题', PRE, st, P => {
    st.a = P.a; st.b = P.b; st.c = P.c;
    sA.sync(P.a); sB.sync(P.b); sC.sync(P.c); B.render();
  });
  B.graphToggles(st, ['grid', 'labs']);

  B.render();
  return B;
}
