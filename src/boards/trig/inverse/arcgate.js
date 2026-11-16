/* 图 H1 主值区间机：左栏母函数全波 —— 水平线 y=t 相交得到「同高多角」（多值，不配反函数）；
   裁出单调主值窗（窗内恰一点）后，右栏画出它关于 y=x 翻折的像 = 反函数曲线。
   三模式 btnM 切 arcsin/arccos/arctan；探针 t 现场读 f⁻¹(t) 并正向核验，|t|>1 现场排除。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { fn: 0, t: 0.6, ghost: true, grid: true, labs: true };
  const MD = [
    { lab: '$\\arcsin$', inv: '\\arcsin', f: Math.sin, g: Math.asin, fTex: '\\sin', w0: -Math.PI / 2, w1: Math.PI / 2, dom: 1,
      X: [-2.72, 2.72], Y: [-1.55, 1.55], iX: [-1.6, 1.6], iY: [-2.32, 2.32],
      xL: [[-Math.PI / 2, '-π/2'], [Math.PI / 2, 'π/2']], yL: [[-1, '-1'], [1, '1']],
      ixL: [[-1, '-1'], [1, '1']], iyL: [[-Math.PI / 2, '-π/2'], [Math.PI / 2, 'π/2']],
      win: '$[-\\pi/2,\\ \\pi/2]$', domTex: '$[-1,\\ 1]$', mono: '单调升' },
    { lab: '$\\arccos$', inv: '\\arccos', f: Math.cos, g: Math.acos, fTex: '\\cos', w0: 0, w1: Math.PI, dom: 1,
      X: [-1.36, Math.PI + 1.36], Y: [-1.55, 1.55], iX: [-1.6, 1.6], iY: [-0.75, Math.PI + 0.75],
      xL: [[Math.PI / 2, 'π/2'], [Math.PI, 'π']], yL: [[-1, '-1'], [1, '1']],
      ixL: [[-1, '-1'], [1, '1']], iyL: [[Math.PI / 2, 'π/2'], [Math.PI, 'π']],
      win: '$[0,\\ \\pi]$', domTex: '$[-1,\\ 1]$', mono: '单调降' },
    { lab: '$\\arctan$', inv: '\\arctan', f: Math.tan, g: Math.atan, fTex: '\\tan', w0: -Math.PI / 2, w1: Math.PI / 2, dom: Infinity,
      X: [-Math.PI - 1.15, Math.PI + 1.15], Y: [-3.15, 3.15], iX: [-3.4, 3.4], iY: [-Math.PI / 2 - 0.45, Math.PI / 2 + 0.45],
      xL: [[-Math.PI, '-π'], [-Math.PI / 2, '-π/2'], [Math.PI / 2, 'π/2'], [Math.PI, 'π']], yL: [[-2, '-2'], [-1, '-1'], [1, '1'], [2, '2']],
      ixL: [[-2, '-2'], [-1, '-1'], [1, '1'], [2, '2']], iyL: [[-Math.PI / 2, '-π/2'], [Math.PI / 2, 'π/2']],
      win: '$(-\\pi/2,\\ \\pi/2)$', domTex: '$\\mathbb{R}$', mono: '单调升' },
  ];
  const PL = [16, 14, 392, 470], PR = [452, 14, 392, 470];
  const mBtns = MD.map((md, i) => B.btnM(md.lab, () => { st.fn = i; mBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  const sT = B.slider('探针 t', -2.5, 2.5, 0.01, st.t, v => { st.t = v; B.render(); });
  B.toggleBtn('母波', true, v => { st.ghost = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  const cWin = B.chipM('主值区间'), cDom = B.chipM('定义域'), cVal = B.chipM('f⁻¹(t)'), cBack = B.chipM('正向核验'), cJ = B.chipM('交点判读');

  const poly = (ptsPx, at) => mk('polyline', { points: ptsPx.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '), fill: 'none', ...at }, B.dyn);
  const xTick = (m, arr) => { if (st.labs) for (const [v, s] of arr) B.text(V(m.px(v), m.py(0) + 15), s, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' }); };
  const yTick = (m, arr) => { if (st.labs) for (const [v, s] of arr) B.text(V(m.px(0) - 9, m.py(v) + 4), s, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'end' }); };
  const sam = (xa, xb, anchors, n = 260) => {
    const xs = [...(anchors || [])];
    for (let i = 0; i <= n; i++) xs.push(xa + (xb - xa) * i / n);
    xs.sort((a, b) => a - b);
    return xs;
  };
  // tan 断笔成支：按分支采样，出视野即断段（与 reciplab/tangap 相同）
  const drawTan = (m, at) => {
    for (let k = -2; k <= 2; k++) {
      const lo = Math.max(m.X0, k * Math.PI - Math.PI / 2 + 0.015), hi = Math.min(m.X1, k * Math.PI + Math.PI / 2 - 0.015);
      if (lo >= hi) continue;
      let seg = [];
      const n = 150;
      for (let i = 0; i <= n; i++) {
        const x = lo + (hi - lo) * i / n, y = Math.tan(x);
        if (!isFinite(y) || Math.abs(y) > m.Y1 + 0.3) { if (seg.length > 1) poly(seg.map(([a, b]) => [m.px(a), m.py(b)]), at); seg = []; continue; }
        seg.push([x, y]);
      }
      if (seg.length > 1) poly(seg.map(([a, b]) => [m.px(a), m.py(b)]), at);
    }
  };
  // 左栏水平线 y=t 与全波的交点（多值证据）：线性扫样 + 极值/窗沿锚点；tan 断口两侧双大跳不算交点
  const hitsOf = (m, md, t) => {
    const xs = [];
    const step = (m.X1 - m.X0) / 700;
    for (let x = m.X0; x <= m.X1 + 1e-9; x += step) xs.push(x);
    xs.push(m.X1);
    if (md.f === Math.sin) for (let k = -1; k <= 1; k++) xs.push(k * Math.PI + Math.PI / 2);
    if (md.f === Math.cos) for (let k = -1; k <= 1; k++) xs.push(k * Math.PI);
    xs.push(md.w0, md.w1);
    xs.sort((a, b) => a - b);
    const hits = [];
    for (let i = 1; i < xs.length; i++) {
      const x0 = xs[i - 1], x1 = xs[i];
      if (x1 - x0 > step * 3) continue;
      const y0 = md.f(x0), y1 = md.f(x1);
      if (!isFinite(y0) || !isFinite(y1) || Math.abs(y0) > 40 || Math.abs(y1) > 40) continue;
      if (Math.abs(y0) > 4 && Math.abs(y1) > 4 && y0 * y1 < 0) continue;   // tan 跨断口的大跳
      const d0 = y0 - t, d1 = y1 - t;
      if (Math.abs(d0) < 1e-9) hits.push(x0);
      else if (d0 * d1 < 0) hits.push(x0 + (x1 - x0) * d0 / (d0 - d1));
    }
    hits.sort((a, b) => a - b);
    const out = [];
    for (const h of hits) if (!out.length || h - out[out.length - 1] > 1e-6) out.push(h);
    return out;
  };

  B.renderFn = () => {
    const md = MD[st.fn], t = st.t;
    const inDom = md.dom === Infinity || Math.abs(t) <= md.dom + 1e-9;
    const m1 = B.isoFit(md.X[0], md.X[1], md.Y[0], md.Y[1], PL);
    const m2 = B.isoFit(md.iX[0], md.iX[1], md.iY[0], md.iY[1], PR);
    B.grid({ ...m1, sx: Math.PI / 4, sy: 1, xt: [], yt: [], grid: st.grid, labs: st.labs, ayLab: 'y' });
    B.grid({ ...m2, sx: 0.5, sy: Math.PI / 4, xt: [], yt: [], grid: st.grid, labs: st.labs });
    xTick(m1, md.xL); yTick(m1, md.yL); xTick(m2, md.ixL); yTick(m2, md.iyL);
    // 面板标题
    B.tex(V(PL[0] + 8, 34), `$y=${md.fTex} x$ 全波`, { size: 14, color: '#93a1b5', anchor: 'start', w: 220 });
    B.tex(V(PR[0] + 8, 34), `$y=${md.inv} x$`, { size: 14, color: '#5cadff', anchor: 'start', w: 220 });
    // 主值窗：金色淡带 + 虚沿（arctan 的窗沿即渐近线）
    mk('rect', { x: m1.px(md.w0), y: PL[1] + 6, width: m1.px(md.w1) - m1.px(md.w0), height: PL[3] - 12,
      fill: 'rgba(255,158,74,.07)', stroke: 'none' }, B.dyn);
    for (const w of [md.w0, md.w1]) {
      B.seg(V(m1.px(w), PL[1] + 6), V(m1.px(w), PL[1] + PL[3] - 6), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '6 5' });
    }
    B.tex(V((m1.px(md.w0) + m1.px(md.w1)) / 2, 52), `主值窗 ${md.win}`, { size: 13, color: '#ffd166', anchor: 'mid', w: 240 });
    if (md.f === Math.tan) B.asym(m1, [{ v: -Math.PI / 2, t: 'x=−π/2' }, { v: Math.PI / 2, t: 'x=π/2' }]);
    // 左栏曲线：母波灰虚（窗外部分）+ 窗内蓝实主值段
    if (st.ghost) {
      if (md.f === Math.tan) drawTan(m1, { stroke: '#93a1b5', 'stroke-width': 1.3, 'stroke-dasharray': '5 5', 'stroke-opacity': .5 });
      else poly(sam(m1.X0, m1.X1, [md.w0, md.w1]).map(x => [m1.px(x), m1.py(md.f(x))]), { stroke: '#93a1b5', 'stroke-width': 1.3, 'stroke-dasharray': '5 5', 'stroke-opacity': .5 });
    }
    if (md.f === Math.tan) drawTan(m1, { stroke: '#5cadff', 'stroke-width': 2.4, 'stroke-opacity': .45 });
    else poly(sam(md.w0, md.w1).map(x => [m1.px(x), m1.py(md.f(x))]), { stroke: '#5cadff', 'stroke-width': 2.4 });
    // 左栏水平探针线 + 交点：窗内金点（主值）、窗外空心点（被裁掉的同高角）
    if (t > m1.Y0 && t < m1.Y1) B.seg(V(m1.px(m1.X0), m1.py(t)), V(m1.px(m1.X1), m1.py(t)), { stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
    const hits = hitsOf(m1, md, t);
    for (const h of hits) {
      const inW = h >= md.w0 - 1e-6 && h <= md.w1 + 1e-6;
      if (inW) B.dot(V(m1.px(h), m1.py(t)), 4.5, { fill: '#ffd166' });
      else B.dot(V(m1.px(h), m1.py(t)), 4, { fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.5 });
    }
    // 右栏：y=x 折缝 + 反函数曲线 + 定义域/值域色带 + 探针读点
    const s0 = Math.max(m2.X0, m2.Y0), s1 = Math.min(m2.X1, m2.Y1);
    B.seg(V(m2.px(s0), m2.py(s0)), V(m2.px(s1), m2.py(s1)), { stroke: '#ffd166', 'stroke-width': 1.3, 'stroke-dasharray': '7 6', 'stroke-opacity': .75 });
    B.text(V(m2.px(s1) - 10, m2.py(s1) - 12), 'y=x', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'end', 'font-style': 'italic' });
    if (md.dom === Infinity) B.asym(m2, [{ h: -Math.PI / 2, t: 'y=−π/2' }, { h: Math.PI / 2, t: 'y=π/2' }]);
    const doms = md.dom === Infinity ? [m2.X0, m2.X1] : [-md.dom, md.dom];
    mk('rect', { x: m2.px(doms[0]), y: m2.py(0) + 4, width: m2.px(doms[1]) - m2.px(doms[0]), height: 6, fill: '#5cadff', 'fill-opacity': .2, stroke: 'none' }, B.dyn);
    mk('rect', { x: m2.px(0) - 10, y: m2.py(md.w1), width: 6, height: m2.py(md.w0) - m2.py(md.w1), fill: '#ffd166', 'fill-opacity': .2, stroke: 'none' }, B.dyn);
    const iv = md.dom === Infinity ? [m2.X0, m2.X1] : [-md.dom, md.dom];
    poly(sam(iv[0], iv[1], [iv[0], iv[1], 0]).map(x => [m2.px(x), m2.py(md.g(x))]), { stroke: '#5cadff', 'stroke-width': 2.4 });
    if (inDom && t > m2.X0 && t < m2.X1) {
      const v = md.g(t);
      B.seg(V(m2.px(t), m2.py(m2.Y0)), V(m2.px(t), m2.py(m2.Y1)), { stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
      B.seg(V(m2.px(0), m2.py(v)), V(m2.px(t), m2.py(v)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
      B.dot(V(m2.px(t), m2.py(v)), 4.5, { fill: '#5cadff' });
    }
    // chips
    cWin(`${md.win} ${md.mono}段`, 'ok');
    cDom(inDom || md.dom === Infinity ? `${md.domTex}${md.dom === Infinity ? '（全体实数）' : ' —— 探针 t 在域内'}` : `${md.domTex} —— 探针 |t|>1 已在域外`, inDom || md.dom === Infinity ? '' : 'warn');
    if (inDom) {
      const v = md.g(t);
      cVal(`$${md.inv}(${fmt(t, 2)})=${fmt(v, 3)}$`, 'ok');
      const back = md.f(v);
      cBack(`$${md.fTex}(${fmt(v, 3)})=${fmt(back, 3)}=t$`, Math.abs(back - t) < 1e-9 ? 'ok' : 'warn');
    } else {
      cVal('探针 |t|>1 —— 超出范围', 'warn');
      cBack('域外无法核验', 'warn');
    }
    const n = hits.length;
    if (!inDom) cJ(`y=t 与全波无交点 —— t 在定义域外，f⁻¹(t) 排除`, 'warn');
    else if (n <= 1) cJ(`全波 y=t 只交 ${n} 点，主值即窗内金点 $x^*=${fmt(md.g(t), 3)}$`, 'ok');
    else cJ(`全波 y=t 交 ${n} 点（同高多角）→ 裁窗后恰 1 点：主值 $f^{-1}(t)=${fmt(md.g(t), 3)}$`, 'ok');
  };
  B.render();
  B.hint('左：水平线 y=t 相交得到「同高多角」—— 多值，不配反函数；右：裁出的单调段关于 y=x 翻折 —— 单值才有反函数');
  return B;
}
