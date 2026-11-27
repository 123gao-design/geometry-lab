import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board');

  // abc(v)：系数（随参数变）；pn 参数名；ur/v0 滑块档位；box 取景
  const PRESETS = [
    { name: '顶点滑动', short: '动顶点', formula: '$(x-t)^2-\\tfrac14$',
      abc: v => [1, -2 * v, v * v - 0.25], pn: 't', ur: [-1.5, 4.5], v0: -0.8,
      f: (x, v) => (x - v) * (x - v) - 0.25, box: [-2, 5.2, -1.1, 5] },
    { name: '轴过端点', short: '轴过端点', formula: '$x^2-2x+c$',
      abc: v => [1, -2, v], pn: 'c', ur: [-1.5, 4], v0: 3.2,
      f: (x, v) => x * x - 2 * x + v, box: [-1.8, 4.5, -2.8, 4.2] },
    { name: '开口向下', short: '向下', formula: '$-(x-t)^2+1$',
      abc: v => [-1, 2 * v, 1 - v * v], pn: 't', ur: [-1.5, 4.5], v0: 0.2,
      f: (x, v) => -(x - v) * (x - v) + 1, box: [-2, 5.2, -3.2, 1.8] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, v: -0.8, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cP = B.readout('参数'), cT = B.readout('判别式与轴', 'gold'), cV = B.chipM('判定'), cK = B.readout('端点符号', 'mint');

  const EZ = 1e-9;
  /** 分类两根相对开区间 (1,3) 的位置 */
  function classify(r1, r2, real) {
    if (!real) return ['判别式为负，无实根', 'warn'];
    if (Math.abs(r1 - r2) < EZ && Math.abs(r1 - 1) < EZ) return ['重根在左端点 $x=1$', 'warn'];
    if (Math.abs(r1 - 1) < EZ || Math.abs(r1 - 3) < EZ || Math.abs(r2 - 1) < EZ || Math.abs(r2 - 3) < EZ)
      return ['至少一根在开区间端点上', 'warn'];
    if (r2 < 1) return ['两根都小于 $1$', ''];
    if (r1 > 3) return ['两根都大于 $3$', ''];
    if (r1 < 1 && r2 > 3) return ['$1$ 和 $3$ 都在两根之间', ''];
    if (r1 < 1) return ['左根在区间外，右根在区间内', 'ok'];
    if (r2 > 3) return ['左根在区间内，右根在区间外', 'ok'];
    return ['两根都在开区间 $(1,3)$ 内', 'ok'];
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const [a, b, c] = P.abc(st.v);
    const D = b * b - 4 * a * c;
    const real = D >= -1e-12;
    const vx = -b / (2 * a), vy = P.f(vx, st.v);
    const f1 = P.f(1, st.v), f3 = P.f(3, st.v);
    let r1 = null, r2 = null;
    if (real) {
      const s = Math.sqrt(Math.max(D, 0));
      r1 = Math.min((-b - s) / (2 * a), (-b + s) / (2 * a));
      r2 = Math.max((-b - s) / (2 * a), (-b + s) / (2 * a));
    }
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.note('$f(x)=' + P.formula.slice(1), '#5cadff');
    B.note('参照区间 $(1,3)$', '#4ade80');
    // 参照区间 (1,3)：绿带 + 两端虚线
    mk('rect', { x: px(1), y: py(M.Y1), width: px(3) - px(1), height: py(M.Y0) - py(M.Y1), fill: '#4ade80', 'fill-opacity': .06 }, B.dyn);
    B.seg(V(px(1), py(0)), V(px(3), py(0)), { stroke: '#4ade80', 'stroke-width': 5, 'stroke-opacity': .55, 'stroke-linecap': 'butt' });
    for (const k of [1, 3]) B.seg(V(px(k), py(M.Y0)), V(px(k), py(M.Y1)), { stroke: '#4ade80', 'stroke-width': 1.2, 'stroke-dasharray': '5 6', 'stroke-opacity': .5 });
    for (const k of [1, 3]) {
      B.dot(V(px(k), py(0)), 6, { fill: B.diagramColors.paper, stroke: B.diagramColors.green, 'stroke-width': 1.5 });
    }
    // 抛物线（蓝）：两根 / 顶点 / 参照区间端点为必采锚点
    B.plot(x => P.f(x, st.v), M, { anchors: real ? [r1, r2, vx, 1, 3] : [vx, 1, 3],
      stroke: B.diagramColors.blue, 'stroke-width': 2.3 });
    const roots = real ? (Math.abs(D) < EZ ? [r1] : [r1, r2]) : [];
    const marks = roots.map(r => [V(px(r), py(0)), B.diagramColors.gold]);
    B.glowPoints([...marks, [V(px(vx), py(vy)), B.diagramColors.violet]]);
    B.note('顶点', '#c084fc');
    if (roots.length === 1) B.note(`重根 $r_1=r_2=${fmt(r1, 2)}$`, '#ffd166');
    if (roots.length === 2) B.note(`$r_1\\approx${fmt(r1, 2)}$，$r_2\\approx${fmt(r2, 2)}$`, '#ffd166');
    // 徽章
    const [txt, cls] = classify(real ? r1 : 0, real ? r2 : 0, real);
    const af1 = a * f1, af3 = a * f3;
    cP(`$${P.pn}=${fmt(st.v, 2)}$`, '');
    cT(`$\\Delta=${fmt(D, 2)}$，对称轴 $x=${fmt(vx, 2)}$`, '');
    cV(txt, cls);
    const signAt = (k, value) => `$a f(${k})${Math.abs(value) < EZ ? '=0' : value < 0 ? '<0' : '>0'}$`;
    cK(`${signAt(1, af1)}，${signAt(3, af3)}`, real ? '' : 'warn');
  };

  const slV = B.slider('参数', -1.5, 4.5, .05, st.v, v => { st.v = v; B.render(); },
    undefined, v => `参数 $${v}$`);
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择根分布例题', PRESETS, i => {
    const P = PRESETS[i];
    st.p = i; st.v = P.v0;
    [slV.min, slV.max] = P.ur;
    slV.sync(P.v0);
    B.render();
  });
  B.render();
  return B;
}
