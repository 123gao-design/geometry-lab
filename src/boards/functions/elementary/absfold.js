/* 图 E8 · 绝对值折叠机：|f(x)|、f(|x|)、|f(|x|)| 三种嵌套 —— 一台板看清三种折叠（S3 折叠机方法的再利用）。
   折叠滑块 t 从 0 到 1 连续变形：|f| 把 x 轴下方的部分先压平再翻上（折缝 = x 轴）；
   f(|x|) 把左半逐列改绘成右半的镜像（右半不动，折缝 = y 轴）；|f(|x|)| 两道一起折。
   两句结论：|f| 零点不多不少（|f(x)|=0 ⟺ f(x)=0），f(|x|) 必偶（右半的复制）。
   预设：① x²−2x（下沉抛物线：|f| 翻出 W）② (x−1)²（右移抛物线：|f| 不动、f(|x|) 翻出 W）
        ③ x−1（直线：两个变换给出同一个 V —— 巧合在此出现）④ e^x−2（指数情形：E4 回收）。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  const PRESETS = [
    { name: '① $x^2-2x$', f: x => x * x - 2 * x, box: [-2.6, 4.4, -1.6, 5.2] },
    { name: '② $(x-1)^2$', f: x => (x - 1) * (x - 1), box: [-2.4, 4.2, -0.9, 5.2] },
    { name: '③ $x-1$', f: x => x - 1, box: [-3.4, 4.2, -3.2, 3.2] },
    { name: '④ $e^x-2$', f: x => Math.exp(x) - 2, box: [-3.2, 4.2, -2.6, 5.2] },
  ];
  // 模式：morph(x, t) 返回折叠中间态 [x_eff, y_eff]；t=1 即成品
  const MODES = [
    { name: '原图 $f$', morph: (x, t, f) => [x, f(x)], crease: [],
      ver: '原图：蓝线 —— 上排三种折叠都以它为原图' },
    { name: '$|f|$', morph: (x, t, f) => { const y = f(x); return [x, y >= 0 ? y : (1 - 2 * t) * y]; }, crease: ['x'],
      ver: 'x 轴下方翻上来：值域下界抬到 0，零点一个不多一个不少（|f|=0 ⟺ f=0）' },
    { name: '$f(|x|)$', morph: (x, t, f) => { const y0 = f(x), y1 = f(-x); return [x, x >= 0 ? y0 : y0 + (y1 - y0) * t]; }, crease: ['y'],
      ver: '右半原样、左半镜像：图象必偶（S5 的 y 轴对称现成例），零点可能翻倍' },
    { name: '$|f(|x|)|$', morph: (x, t, f) => { const y0 = f(x), y1 = f(-x); const base = x >= 0 ? y0 : y0 + (y1 - y0) * t; return [x, base >= 0 ? base : (1 - 2 * t) * base]; }, crease: ['x', 'y'],
      ver: '先沿 y 轴折拢（里层管定义域）、再沿 x 轴翻上（外层管值域）—— 两道折缝一起出' },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, m: 1, t: 0, grid: true, labs: true };
  const M0 = () => MAPS[st.p];
  const cM = B.chipM('模式'), cZ = B.chipM('零点核验'), cS = B.chipM('对称性'), cV = B.chipM('判词');

  /** 零点扫描（R2 流程加一档）：变号二分 + 贴轴 |g|<1e-7 + 谷值贴 0（从上）+ 极大值点贴 0（从下，如 x²−2|x| 在 x=0 触轴），去重 1e-3 */
  function zerosOf(g, X0, X1) {
    const N = 700, h = (X1 - X0) / N, zs = [];
    const xs = []; for (let i = 0; i <= N; i++) xs.push(X0 + i * h);
    const vs = xs.map(g);
    for (let i = 1; i < N; i++) {
      const v = vs[i], pv = vs[i - 1], nv = vs[i + 1];
      if (!isFinite(v) || !isFinite(pv) || !isFinite(nv)) continue;
      if (Math.abs(v) < 1e-7) { zs.push(xs[i]); continue; }
      if (pv * v < 0) {
        let a = xs[i - 1], b = xs[i];
        for (let k = 0; k < 40; k++) { const md = (a + b) / 2; (g(a) * g(md) <= 0) ? b = md : a = md; }
        zs.push((a + b) / 2);
      } else if (v > 0 && v < 0.02 && v < pv && v < nv) zs.push(xs[i]);   // 谷底从上贴轴
      else if (v < 0 && v > -0.02 && v > pv && v > nv) zs.push(xs[i]);     // 极大值点从下触轴
    }
    return zs.filter((z, i) => i === 0 || Math.abs(z - zs[i - 1]) > 1e-3);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = M0(), mode = MODES[st.m];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    // 原稿（蓝）
    let db = '', pen = false;
    for (let x = X0; x <= X1 + 0.001; x += 0.03) {
      const y = P.f(x);
      if (y > Y0 && y < Y1) { db += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d: db, fill: 'none', stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .6 }, B.dyn);
    // 折缝（金虚线）：x 轴 / y 轴
    for (const c of mode.crease)
      if (c === 'x') B.seg(V(M.px(X0), M.py(0)), V(M.px(X1), M.py(0)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 6', 'stroke-opacity': .55 });
      else B.seg(V(M.px(0), M.py(Y0)), V(M.px(0), M.py(Y1)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 6', 'stroke-opacity': .55 });
    // 折叠曲线（金）：morph 中间态
    let dg = '', peng = false;
    for (let x = X0; x <= X1 + 0.001; x += 0.02) {
      const [xe, ye] = mode.morph(x, st.t, P.f);
      if (isFinite(ye) && ye > Y0 && ye < Y1) { dg += (peng ? 'L' : 'M') + M.px(xe).toFixed(1) + ' ' + M.py(ye).toFixed(1) + ' '; peng = true; continue; }
      peng = false;
    }
    mk('path', { d: dg, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.4 }, B.dyn);
    B.note(`${PRESETS[st.p].name} 的 ${mode.name}`, '#93a1b5');
    // 徽章：核验都用「折毕成品」算（t 无关）
    const g1 = x => mode.morph(x, 1, P.f)[1];
    const z0 = zerosOf(P.f, X0, X1), z1 = zerosOf(g1, X0, X1);
    for (const z of z1) if (z > X0 && z < X1 && Math.abs(g1(z)) < 1e-6)
      B.dot(V(M.px(z), M.py(0)), 4.5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.3 });
    cM(`${mode.name}`, '');
    const extra = st.m === 1 ? ' —— |f| 的零点不多不少' : st.m === 2 ? ' —— 右半零点翻印到左半，可能翻倍' : st.m === 3 ? ' —— 两层折叠的零点分布' : '';
    cZ(`原 ${z0.length} 个 → 折后 ${z1.length} 个${extra}`, '');
    let even = true;
    for (let u = 0.1; u <= Math.min(X1, 4); u += 0.15) if (Math.abs(g1(u) - g1(-u)) > 1e-9) { even = false; break; }
    if (st.m >= 2) cS('f(|x|) 系：必偶 —— 右半的复制，S5 的 y 轴对称', even ? 'ok' : 'warn');
    else cS(even ? '这个原图本来就是偶函数（f(|x|)=f）' : '|f| 只动值域不动对称性 —— 该不对称还不对称', '');
    cV(mode.ver, st.m === 0 ? '' : 'ok');
  };

  const pbtns = PRESETS.map((P, i) => B.btnM(P.name, () => {
    st.p = i;
    pbtns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const mbtns = MODES.map((Mo, i) => B.btnM(Mo.name, () => {
    st.m = i;
    mbtns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 1 }));
  B.slider('折叠 t', 0, 1, 0.01, 0, v => { st.t = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint("用进度滑块区分横轴翻折和纵轴镜像。");
  B.render();
  return B;
}
