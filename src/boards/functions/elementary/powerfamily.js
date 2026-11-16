/* 图 E3 · 幂函数曲线族：y=x^α —— 单栏全景（用户拍板：撤掉右侧放大部分，每条 α 曲线一个身份色）。
   预设 α = 2、3、½、⅓、−1（⅓ 用 cbrt 才有左支）；滑块 α 以 1/12 步进连续变形。
   规则：整指数（或 ⅓）负半轴才开得出支，其余只在 x>0 —— 负底数开偶次方无定义是首要限制。
   α<0 双渐近线 x=0、y=0；全族恒过 (1,1)：交点左 α 大者低、交点右 α 大者高。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  const GHOSTS = [-2, -1, -0.5, 1 / 3, 0.5, 1, 2, 3];
  // α 身份色（用户拍板：不同 α 不同颜色；均为 COLOR 表内语义色号）
  const AC = [[-2, '#c084fc'], [-1, '#ff7b8a'], [-0.5, '#67e8f9'], [1 / 3, '#ff9e4a'],
    [0.5, '#ffd166'], [1, '#93a1b5'], [2, '#5cadff'], [3, '#4ade80']];
  const aColor = a => (AC.find(([v]) => Math.abs(v - a) < 1e-9) || [0, '#5cadff'])[1];
  const PRESETS = [
    { a: 2, name: '$\\alpha=2$' }, { a: 3, name: '$\\alpha=3$' },
    { a: 0.5, name: '$\\alpha=\\dfrac{1}{2}$' }, { a: 1 / 3, name: '$\\alpha=\\dfrac{1}{3}$' },
    { a: -1, name: '$\\alpha=-1$' },
  ];
  const M = B.isoFit(-4.2, 4.2, -4.2, 4.2);
  const st = { a: 2, grid: true, labs: true, asym: true, ghosts: true };
  const isKey = a => Math.abs(a - 1 / 3) < 1e-9;                 // ⅓ 特批（cbrt 左支）
  const f = (x, a) => x > 0 ? Math.pow(x, a)
    : x < 0 ? (Number.isInteger(a) ? Math.pow(x, a) : isKey(a) ? Math.cbrt(x) : NaN)
      : (a > 0 ? 0 : NaN);
  const dom = a => (a === 0 ? 'x\\ne 0' : (Number.isInteger(a) || isKey(a)) ? (a < 0 ? 'x\\ne 0' : '\\mathbb{R}') : 'x>0');
  const cA = B.chipM('当前 α'), cD = B.chipM('定义域'), cM = B.chipM('单调'), cV = B.chipM('定点与次序');

  B.renderFn = () => {
    const a = st.a;
    const atex = Number.isInteger(a) ? String(a) : isKey(a) ? '\\dfrac{1}{3}' : fmt(a, 2);
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && a < 0) B.asym(M, [{ v: 0 }, { h: 0 }]);
    if (st.ghosts) for (const g of GHOSTS) {
      if (Math.abs(g - a) < 1e-9) continue;                     // 当前 α 的曲线由主角担当
      B.plot(x => f(x, g), M, { anchors: [0, 1], n: 240, stroke: aColor(g), 'stroke-width': 1.2, 'stroke-opacity': .3 });
    }
    B.plot(x => f(x, a), M, { anchors: [0, 1], n: 240, stroke: aColor(a), 'stroke-width': 2.6 });
    // 曲线族交汇点 (1,1) + 原点支
    B.dot(V(M.px(1), M.py(1)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    if (a > 0 && M.X0 < 0 && M.X1 > 0) B.dot(V(M.px(0), M.py(0)), 3.5, { fill: '#93a1b5' });
    if (a === 0) B.dot(V(M.px(0), M.py(1)), 4, { fill: '#0a0d14', stroke: '#93a1b5', 'stroke-width': 1.6 }); // x=0 挖去
    B.tex(V(14, 18), `$y=x^{${atex}}$ —— 拖 α 看曲线族变形`, { size: 13, color: '#93a1b5', anchor: 'start', w: 300 });
    // 徽章
    const nm = a > 1 ? '抛物线型（α>1）：越走越陡' : a === 1 ? '直线：45° 均速' : a > 0 ? '根式型（0<α<1）：越走越缓，起步陡' : a === 0 ? '常数：y=1（x≠0）—— 幂家族的扁成员' : '双曲线型（α<0）：x 越大越贴近 0';
    cA(`$\\alpha=${atex}$ —— ${nm}`, a < 0 ? '' : 'ok');
    cD(`$D=${dom(a)}$${Number.isInteger(a) || isKey(a) ? '' : ' —— 负底数开不出偶次方：左半轴无定义'}`, '');
    cM(a > 0 ? `在 $(0,+\\infty)$ 上增` : a === 0 ? '常数函数不具有单调性' : `在 $(0,+\\infty)$ 上减 —— 双曲线型`, a > 0 ? 'ok' : a === 0 ? 'warn' : 'warn');
    cV(`恒过 $(1,1)$${a > 0 ? '，且过 $(0,0)$' : ''}；交点左 α 大者低、交点右 α 大者高 —— $(1,1)$ 是全族的交汇点`, '');
  };

  const btns = PRESETS.map((P, i) => B.btnM(P.name, () => {
    st.a = P.a; slA.sync(P.a);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const slA = B.slider('α', -3, 3, 1 / 12, 2, v => {
    st.a = v;
    btns.forEach((b, j) => b.classList.toggle('on', Math.abs(PRESETS[j].a - v) < 1e-9));
    B.render();
  });
  B.graphToggles(st);
  B.toggleBtn('曲线族', true, on => { st.ghosts = on; B.render(); });
  B.hintM('每条 $\\alpha$ 一色：全族恒过金点 $(1,1)$，交点左 $\\alpha$ 大者低、交点右 $\\alpha$ 大者高 —— 拖 α 看身份变色');
  B.render();
  return B;
}
