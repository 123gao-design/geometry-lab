/* 图 S3 · 奇偶折叠机：把 x>0 的半张图「折」过去 —— 偶函数沿 y 轴翻折、奇函数绕原点旋转 180°
   折叠滑块 t 从 0 到 1：右半曲线连续翻转（金），折毕与左半（蓝）完全重合 ⇔ f(−x)=f(x)（偶）或 f(−x)=−f(x)（奇）。
   五个预设：① x²（偶）② x³（奇）③ 1/x（奇·带渐近线）④ √x（定义域不对称，前提不满足）⑤ x²+x（对称却非奇非偶）。
   图象规范：B.isoFit 等单位取景；网格 / 轴标注 / 渐近线 三开关可隐藏；特殊点灰点标注。 */
import { mk, V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { functionPicker } from '../concept/function-picker.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 650, H = 410;
  const B = new FunctionBoard(root, W, H, 'parity');

  // box 取景框；mode 'ref' 沿 y 轴翻折（偶）/ 'rot' 绕原点旋转（奇）；marks 特殊点；asy 渐近线；ver 判定文案
  const PRESETS = [
    { name: '$x^2$', f: x => x * x, d: () => true, box: [-3.2, 3.2, -0.8, 9.2], probe: [0.1, 3], mode: 'ref',
      marks: [[0, 0]], asy: [], ver: '偶函数，$f(-x)=(-x)^2=f(x)$。', cls: 'ok' },
    { name: '$x^3$', f: x => x * x * x, d: () => true, box: [-1.8, 1.8, -4.4, 4.4], probe: [0.1, 1.6], mode: 'rot',
      marks: [[0, 0]], asy: [], ver: '奇函数，$f(-x)=(-x)^3=-f(x)$。', cls: 'ok' },
    { name: '$\\dfrac{1}{x}$', f: x => 1 / x, d: x => Math.abs(x) > 1e-6, box: [-3.2, 3.2, -3.4, 3.4], probe: [0.3, 3.2], mode: 'rot',
      marks: [], asy: [{ v: 0 }, { h: 0 }], ver: '奇函数，当 $x\\ne 0$ 时，$f(-x)=-1/x=-f(x)$。', cls: 'ok' },
    { name: '$\\sqrt{x}$', f: x => Math.sqrt(x), d: x => x >= 0, box: [-4.2, 4.2, -1, 3], probe: [0.1, 4], mode: 'ref',
      marks: [[0, 0]], asy: [], ver: '定义域 $[0,+\\infty)$ 不关于原点对称，非奇非偶。', cls: 'warn' },
    { name: '$x^2+x$', f: x => x * x + x, d: () => true, box: [-2.8, 2.8, -0.8, 6.4], probe: [0.1, 2], mode: 'ref',
      marks: [[-0.5, -0.25]], asy: [], ver: '非奇非偶。$f(-1)=0$，而 $f(1)=2$。', cls: 'warn' },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, t: 0, x0: 1.2, grid: true, labs: true, asym: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cF = B.readout('$f(x_0)$'), cM = B.readout('$f(-x_0)$', 'gold');
  const cT = B.chipM('变换'), cImage = B.readout('像点', 'mint'), cV = B.chipM('判定');
  const number = v => Number(v.toFixed(3));
  function reading(x, y) {
    const v = number(y);
    return `$f(${x})${Math.abs(y - v) < 1e-10 ? '=' : '\\approx '}${v}$`;
  }

  B.handle({
    get: () => V(px(st.x0), py(PRESETS[st.p].f(st.x0))),
    set: point => {
      const m = MAPS[st.p], [lo, hi] = PRESETS[st.p].probe;
      const x = Math.round((point.x - m.px(0)) / m.s * 100) / 100;
      st.x0 = Math.max(lo, Math.min(hi, x));
    },
    color: '#ffd166', label: 'x₀', lo: [9, -9],
  });

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy.length) B.asym(M, P.asy);
    B.plot(P.f, M, { dom: P.d, anchors: [0, ...P.marks.map(([x]) => x)], step: .025,
      stroke: B.diagramColors.blue, 'stroke-width': 2.2 });
    const rotate = P.mode === 'rot';
    const angle = Math.PI * st.t;
    const cos = Math.cos(angle), sin = st.t === 1 ? 0 : Math.sin(angle);
    const transform = (x, y) => rotate
      ? V(cos * x - sin * y, sin * x + cos * y)
      : V(cos * x, y);

    let path = '', pen = false;
    for (let u = 0; u <= X1; u += .025) {
      if (!P.d(u)) { pen = false; continue; }
      const point = transform(u, P.f(u));
      if (point.y < Y0 || point.y > Y1 || point.x < X0 || point.x > X1) { pen = false; continue; }
      path += (pen ? 'L' : 'M') + px(point.x).toFixed(1) + ' ' + py(point.y).toFixed(1) + ' ';
      pen = true;
    }
    mk('path', { d: path, fill: 'none', stroke: B.diagramColors.gold, 'stroke-width': 2.4 }, B.dyn);
    // 折痕标记：偶 = y 轴加金虚线（折缝），奇 = 原点金圈（转轴）
    if (P.mode === 'ref') B.seg(V(px(0), py(Y0)), V(px(0), py(Y1)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '5 6', 'stroke-opacity': .5 });
    else B.dot(V(px(0), py(0)), 5, { fill: 'none', stroke: '#ffd166', 'stroke-width': 2 });
    // 特殊点（顶点/零点/最低点）：折叠的锚点
    for (const [mx, my] of P.marks) B.dot(V(px(mx), py(my)), 3.5, { fill: '#93a1b5' });
    // 把手 x₀ 及其折叠像：连线显示「这一个点折到哪」
    const y0 = P.f(st.x0);
    const image = transform(st.x0, y0);
    if (st.t > 0) {
      B.seg(V(px(st.x0), py(y0)), V(px(image.x), py(image.y)), { stroke: B.diagramColors.mint, 'stroke-dasharray': '4 4', 'stroke-opacity': .7 });
      glowDot(B, V(px(image.x), py(image.y)), B.diagramColors.mint, 8, 3.5);
    }
    const other = -st.x0;
    cF(reading(st.x0, y0));
    cM(P.d(other) ? reading(other, P.f(other)) : `$f(${other})$ 无定义`, P.d(other) ? '' : 'warn');
    cT(rotate ? `$\\theta=${number(180 * st.t)}^\\circ$` : `关于 $y$ 轴翻折，$t=${st.t}$`);
    cImage(`$(${number(image.x)}, ${number(image.y)})$`);
    if (st.t === 1) cV(P.ver, P.cls);
    else cV(rotate ? '旋转到 $180^\\circ$，比较 $f(-x)$ 与 $-f(x)$。' : '翻折到 $t=1$，比较 $f(-x)$ 与 $f(x)$。');
  };

  const sl = B.slider('变换进度', 0, 1, 0.01, 0, v => { st.t = v; B.render(); });
  const [, , asym] = B.graphToggles(st);
  asym.button.hidden = true;
  functionPicker(root, PRESETS.map(p => p.name), i => {
    st.p = i; st.t = 0; sl.sync(0);
    const [lo, hi] = PRESETS[i].probe;
    st.x0 = Math.max(lo, Math.min(hi, st.x0));
    asym.button.hidden = !PRESETS[i].asy.length;
    B.render();
  });
  B.render();
  return B;
}
