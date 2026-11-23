/* 图 R1 · 零点对照仪：零点 = 使 f(c)=0 的数 c —— 数、式、图三种身份说的是同一个数
   ① 整根好认（x²−2x−3）；② 无理根拖不上（x³−3x+1 —— 逼出 R3 二分 / R4 牛顿）；
   ③ 1/x 无零点（渐近线只相望不相交）；④ x² 二重零点（触轴不穿轴，两侧同号）。
   曲线按 f 的符号分色（绿正红负）—— 颜色交界的穿轴处就是零点；二重零点不分色，R2 的坑在此提前出现。
   图象规范：B.isoFit 等单位取景；公式一律 B.tex/btnM/chipM（tex 段内禁中文）；
   网格 / 轴标注 / 渐近线三开关；零点为必采锚点（曲线精确踩到金点上）。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  // zeros：零点（必采锚点）；asy 渐近线；sInit/ur：探针初始档位与滑块范围；zTag 零点清单附注
  const PRESETS = [
    { name: '① $x^2-2x-3$', eq: '$f(x)=x^2-2x-3$ —— 拖探针，找让 f 归零的数',
      f: x => x * x - 2 * x - 3, d: () => true, box: [-3.5, 4.5, -5.4, 5.4],
      zeros: [-1, 3], asy: [], sInit: 2, ur: [-3.3, 4.3], zTag: '',
      note: '整根 $-1$、$3$ 好认 —— 数、式、图三语言一读就对上', noteCls: 'ok' },
    { name: '② $x^3-3x+1$', eq: '$f(x)=x^3-3x+1$ —— 三个根全是无理数',
      f: x => x * x * x - 3 * x + 1, d: () => true, box: [-2.5, 2.5, -3.6, 3.6],
      zeros: [-1.8794, 0.3473, 1.5321], asy: [], sInit: 1.2, ur: [-2.3, 2.3], zTag: '',
      note: '无理根：探针只能靠近、笔算开不出 —— R3 二分法、R4 牛顿法为此而来', noteCls: 'ok' },
    { name: '③ $\\dfrac{1}{x}$', eq: '$f(x)=\\dfrac{1}{x}$ —— 定义域里挑不出 f(c)=0',
      f: x => 1 / x, d: x => Math.abs(x) > 1e-6, box: [-3, 3, -4, 4],
      zeros: [], asy: [{ v: 0 }, { h: 0 }], sInit: 1.5, ur: [-2.8, 2.8], zTag: '',
      note: '无零点：图象与 x 轴只渐近相望，永不相交 —— f(c)=0 与「贴近」是两回事', noteCls: 'warn' },
    { name: '④ $x^2$', eq: '$f(x)=x^2$ —— 二重零点：触轴不穿轴',
      f: x => x * x, d: () => true, box: [-3, 3, -1, 4.6],
      zeros: [0], asy: [], sInit: 1.5, ur: [-2.8, 2.8], zTag: '（二重）',
      note: '二重零点 $0$：触轴不穿轴、两侧同色 —— $f(a)f(b)<0$ 这关它过不了（R2 的易错点）', noteCls: 'warn' },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, x: 2, grid: true, labs: true, asym: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cZ = B.chipM('零点清单'), cF = B.chipM('数值语言'), cE = B.chipM('方程语言'), cG = B.chipM('图象语言'), cV = B.chipM('判定');
  /** y 的探针读数：真零显示 0；小值用三位有效数字，防止近零时被申成 0.00 的假精确 */
  const fmtY = y => Math.abs(y) < 1e-12 ? '0' : (Math.abs(y) < 0.05 ? y.toPrecision(2) : fmt(y, 2));

  /** 按符号分色画曲线：sg=+1 绿（f>0）、−1 红（f<0）—— 零点是颜色交界处；零点为必采锚点（分段在金点上汇合） */
  function plot(sg, at) {
    const M = MAPS[st.p], P = PRESETS[st.p];
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.04) xs.push(x);
    for (const z of P.zeros) if (z > M.X0 && z < M.X1) xs.push(z);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      if (P.d(x)) {
        const y = P.f(x);
        if (Math.sign(y) === sg && y > M.Y0 && y < M.Y1) {
          d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue;
        }
      }
      pen = false;
    }
    mk('path', { d, fill: 'none', ...at }, B.dyn);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy.length) B.asym(M, P.asy);
    B.note(P.eq, '#93a1b5');
    plot(1, { stroke: '#4ade80', 'stroke-width': 2.2 });
    plot(-1, { stroke: '#ff7b8a', 'stroke-width': 2.2 });
    for (const z of P.zeros) B.dot(V(px(z), py(0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    // 探针（橙）：竖虚线 + 曲线上的点（定义域外免谈）
    const x = st.x, ok = P.d(x), y = ok ? P.f(x) : 0;
    if (ok) {
      B.seg(V(px(x), py(Y0)), V(px(x), py(Y1)), { stroke: '#3f5f8f', 'stroke-dasharray': '4 6', 'stroke-opacity': .5 });
      if (y > Y0 && y < Y1) {
        // 探针靠近零点时标注该零点（否则 dx=x−z 会把 0.007 附近的近零点显示成 (0.007, 0.00) 这种假精确）
        const near = P.zeros.find(z => Math.abs(x - z) < 0.02);
        const t = near != null
          ? (Math.abs(near - Math.round(near)) < 1e-9 ? `($${fmt(near, 0)}$, 0)` : `(≈ $${fmt(near, 2)}$, 0)`)
          : `($${fmt(x, 2)}$, ${fmtY(y)})`;
        B.dot(V(px(x), py(y)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
        B.note(t, '#ff9e4a');
      }
    }
    // 三语言读数：命中（离某零点 < 0.07）则同时点亮；整根用 =，无理根只能 ≈
    let hit = null;
    if (ok) for (const z of P.zeros) if (Math.abs(x - z) < 0.07) { hit = z; break; }
    const isInt = hit != null && Math.abs(hit - Math.round(hit)) < 1e-9;
    const zs = P.zeros.map(z => (Math.abs(z - Math.round(z)) < 1e-9 ? `$${fmt(z, 0)}$` : `$\\approx ${fmt(z, 2)}$`)).join('、');
    cZ(P.zeros.length ? `零点：${zs}${P.zTag}` : '无零点', P.zeros.length ? '' : 'warn');
    if (!ok) {
      cF('x=0：f 无定义 —— 定义域外的点没有零点身份', 'warn');
      cE('这个候选根本不在方程的讨论范围里', 'warn');
      cG('没有图象，交点语言不适用', 'warn');
    } else if (P.zeros.length === 0) {
      cF(`$f(${fmt(x, 2)})=${fmt(y, 2)}\\ne 0$`, 'warn');
      cE('方程 $f(x)=0$ 无实根', 'warn');
      cG('图象与 x 轴无交点', 'warn');
    } else if (hit != null) {
      cF(isInt ? `$f(${fmt(hit, 0)})=0$ ✓` : `$f(${fmt(hit, 2)})\\approx 0$（真根是无理数）`, 'ok');
      cE(`$x${isInt ? '=' : '\\approx '}${isInt ? fmt(hit, 0) : fmt(hit, 2)}$ 是方程 $f(x)=0$ 的根 ✓`, 'ok');
      cG(`交点 ($${isInt ? fmt(hit, 0) : '\\approx ' + fmt(hit, 2)}$, 0) 的横坐标 ✓`, 'ok');
    } else {
      cF(`$f(${fmt(x, 2)})=${fmtY(y)}\\ne 0$`, '');
      cE('探针处 $f(x)\\ne 0$ —— 不是根', '');
      cG(`($${fmt(x, 2)}$, ${fmtY(y)}) 不在 x 轴上`, '');
    }
    cV(!ok ? '零点判定的前提：c 必须在定义域内（先审定义域，见 C3）'
      : P.zeros.length === 0 || hit != null ? P.note
      : '拖「探针 x」到金点附近 —— 三语言同时点亮；曲线穿轴处（颜色交界）就是零点',
      !ok || P.zeros.length === 0 ? P.noteCls : hit != null ? P.noteCls : '');
  };

  const slX = B.slider('探针 x', -3.3, 4.3, 0.01, 2, v => { st.x = v; B.render(); });
  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    slX.setAttribute('min', p.ur[0]); slX.setAttribute('max', p.ur[1]);
    if (st.x < p.ur[0] || st.x > p.ur[1]) { slX.sync(p.sInit); st.x = p.sInit; }
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st);
  B.hint("比较穿过横轴和只接触横轴的零点。");
  B.render();
  return B;
}
