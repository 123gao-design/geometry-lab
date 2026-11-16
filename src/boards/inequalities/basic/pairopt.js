/* 图 基2 · 配对最值机：和定积最大、积定和最小
   一正（a,b>0）、二定（和或积固定）、三相等（a=b 时取到）三条件逐条对照：
   模式一「和定」：给定 a+b=s，目标 y=ab=a(s−a) 是一条开口向下的抛物线，顶点在 a=s/2，
                积有上界 (s/2)²；模式二「积定」：给定 ab=p，目标 y=a+b=a+p/a 是对勾曲线，
                谷底在 a=√p，和有下界 2√p。金色/绿色横虚线分别是上界与下界，与曲线相切处即取等。
   局部坐标约定：曲线横轴 a∈[0,s]（模式一）/ [0.05,6.2]（模式二），纵轴目标值；
   px/py 为线性像素映射（px 填满横向 70..830，py 落在 90..400 内，逐帧按 s/p 重算，函数图不要求等单位）。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, s: 10, p: 16, a: 3, grid: true, labs: true };
  const cD = B.chipM('定值'), cT = B.chipM('目标'), cE = B.chipM('极值'), cJ = B.chipM('判读');
  const niceStep = span => { const raw = span / 8, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; };

  B.renderFn = () => {
    const { mode, s, p } = st;
    const x0 = mode === 0 ? 0 : .05;
    let x1, ymax, a1, b, zf, target, ext;
    if (mode === 0) {
      x1 = s;
      a1 = Math.max(.05, Math.min(st.a, s - .05));
      b = s - a1;
      zf = x => x * (s - x);
      ymax = Math.max(s * s / 4 * 1.15, 3);
      target = s / 2;
      ext = target * target;
    } else {
      x1 = 6.2;
      a1 = Math.max(.05, Math.min(st.a, 6));
      b = p / a1;
      zf = x => x + p / x;
      target = Math.sqrt(p);
      ext = 2 * target;
      ymax = Math.max(ext * 1.4, zf(x1) * 1.1, 6);
    }
    const m = {
      px: x => 70 + (x - x0) / (x1 - x0) * 760,
      py: y => 400 - y / ymax * 310,
      X0: x0, X1: x1, Y0: 0, Y1: ymax,
      sx: niceStep(x1 - x0), sy: niceStep(ymax), lx: niceStep(x1 - x0), ly: niceStep(ymax),
      axLab: '$a$', ayLab: mode === 0 ? '$ab$' : '$a+b$',
      grid: st.grid, labs: st.labs,
    };
    B.grid(m);
    B.tex(V(430, 42), mode === 0 ? `$a+b=${f1(s)}$（和定）　$y=a\\,b=a(s-a)$` : `$a\\,b=${f1(p)}$（积定）　$y=a+b=a+\\tfrac{p}{a}$`, { size: 16, anchor: 'mid' });
    B.text(V(430, 70), '拖 a 探点沿曲线走动；黄金点 = 取等位置（a=b）。横虚线即上界/下界 —— 与曲线相切处才取到', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 曲线与可行域（模式一：积在抛物线下方可行，填充后下方）
    const anchors = new Set([x0, x1]);
    anchors.add(mode === 0 ? target : Math.min(target, x1));
    const xs = [...anchors].map(v => Math.round(v * 100) / 100).sort((u, w) => u - w);
    const S = [];
    for (let i = 0; i < xs.length - 1; i++) {
      const p0 = xs[i], q0 = xs[i + 1];
      S.push(p0);
      const n = Math.max(3, Math.ceil((q0 - p0) / .04));
      for (let k = 1; k < n; k++) S.push(p0 + (q0 - p0) * k / n);
    }
    S.push(xs[xs.length - 1]);
    const pts = S.map(x => { let y = zf(x); if (y > ymax * 3) y = ymax * 3; return `${m.px(x)},${m.py(y)}`; });
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: mode === 0 ? '#5cadff' : '#c084fc', 'stroke-width': 2.2 }, B.dyn);
    if (mode === 0) {
      for (let x = x0; x <= x1; x += .04) {
        const z = zf(x);
        mk('rect', { x: m.px(x), y: m.py(z), width: Math.max(1, m.px(x + .04) - m.px(x)), height: Math.max(0, m.py(0) - m.py(z)), fill: '#ffd166', 'fill-opacity': .12 }, B.dyn);
      }
    }
    // 上/下界横虚线
    if (st.labs) {
      if (mode === 0) B.seg(V(m.px(0), m.py(ext)), V(m.px(x1) + 8, m.py(ext)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 4' });
      else B.seg(V(m.px(x0), m.py(ext)), V(m.px(x1) + 8, m.py(ext)), { stroke: '#4ade80', 'stroke-width': 1.4, 'stroke-dasharray': '6 4' });
    }
    // 取等点与当前探点
    if (st.labs) {
      const tv = mode === 0 ? target : Math.min(target, x1);
      B.seg(V(m.px(tv), m.py(0)), V(m.px(tv), m.py(zf(tv))), { stroke: mode === 0 ? '#ffd166' : '#4ade80', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
      B.dot(V(m.px(tv), m.py(zf(tv))), 5.5, { fill: mode === 0 ? '#ffd166' : '#4ade80' });
      B.tex(V(m.px(tv), m.py(zf(tv)) - 14), mode === 0 ? '$a=b=\\tfrac{s}{2}$' : '$a=b=\\sqrt{p}$', { size: 12.5, anchor: 'mid', color: mode === 0 ? '#ffd166' : '#4ade80' });
      B.dot(V(m.px(a1), m.py(zf(a1))), 5, { fill: '#67e8f9' });
      B.seg(V(m.px(a1), m.py(0)), V(m.px(a1), m.py(zf(a1))), { stroke: '#67e8f9', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      B.tex(V(86, 416), `当前 $a=${f1(a1)}$，$b=${f1(b)}$`, { size: 13, anchor: 'start', color: '#67e8f9' });
      if (mode === 1) {
        B.seg(V(m.px(x0), m.py(0)), V(m.px(x0), m.py(ymax) - 10), { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
        B.tex(V(m.px(x0) - 6, m.py(ymax * .92)), '$a=0$', { size: 12.5, anchor: 'end', color: '#c084fc' });
      }
    }
    // 徽章
    cD(mode === 0 ? `$a+b=${f1(s)}$（和定，二定）` : `$a\\,b=${f1(p)}$（积定，二定）`);
    cT(mode === 0 ? `$ab=a(s-a)=${f1(a1 * b)}$` : `$a+b=a+\\tfrac{p}{a}=${f1(a1 + b)}$`);
    cE(mode === 0 ? `$ab\\le\\left(\\tfrac{s}{2}\\right)^2=${f1(ext)}$（上界）` : `$a+b\\ge 2\\sqrt{p}=${f1(ext)}$（下界）`);
    if (Math.abs(a1 - target) < .01) cJ(`一正（a,b>0）✓；二定 ✓；三相等：$a=b=${f1(target)}$——${mode === 0 ? '积取最大' : '和取最小'}`, 'ok');
    else if (st.a <= .05 + 1e-9 || st.a >= (mode === 0 ? s - .05 - 1e-9 : 6)) cJ(`a=${f1(st.a)} 超出可取范围，已夹回 $a=${f1(a1)}$ —— 一正限定了取值区间`, 'warn');
    else cJ(`一正 ✓；二定 ✓；三相等未满足：距 $a=${f1(target)}$ 还差 $${f1(Math.abs(a1 - target))}$ —— ${mode === 0 ? '积还小于上界' : '和还大于下界'}`);
  };

  const modeBtns = ['和定积最大', '积定和最小'].map((n, i) => B.btnM(n, () => {
    st.mode = i; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const PRE = [
    { mode: 0, s: 10, a: 3, n: '① $x+y=10$' },
    { mode: 0, s: 6, a: 2, n: '② $x+y=6$' },
    { mode: 1, p: 16, a: 4, n: '③ $xy=16$' },
    { mode: 1, p: 1, a: .6, n: '④ $x+\\tfrac1x$' },
  ];
  PRE.forEach(P => B.btnM(P.n, () => {
    st.mode = P.mode; if (P.mode === 0) st.s = P.s; else st.p = P.p; st.a = P.a;
    sA.sync(P.a); sS.sync(st.s); sP.sync(st.p);
    modeBtns.forEach((b, j) => b.classList.toggle('on', j === st.mode));
    B.render();
  }, { on: false }));
  B.graphToggles(st, ['grid', 'labs']);

  const sA = B.slider('a =', 0.1, 6, .1, 3, v => { st.a = v; B.render(); });
  const sS = B.slider('s =', 2, 10, .1, 10, v => { st.s = v; B.render(); });
  const sP = B.slider('p =', 1, 36, .5, 16, v => { st.p = v; B.render(); });

  B.hint('一正二定三相等：和定看抛物线顶点、积定看对勾谷底 —— 两处都是 a=b');
  B.render();
  return B;
}