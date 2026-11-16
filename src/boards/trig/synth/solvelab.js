/* 图 K1 方程解机：sin x = t / cos x = t / tan x = t 的图象直译与通解对照表。
   左栏窗 [0,2π]：母波 + 金色水平线 y=t，交点即特解（金点 x₁、x₂…）；
   sin 两支解族（对称轴 π/2）、cos 两支（关于 y 轴镜像 ±α）、tan 一支周期 π。
   |t|>1 超出范围（H1 的结论）、|t|=1 切线重根；右栏特解表（π/12 约分）+ 通解两条通解表达式。
   坐标：x∈[0,2π]，y 域 sin/cos ±1.7、tan ±4.6，各向异性手写 px/py 喂 B.grid。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { mode: 0, t: 0.5, tt: 1 };
  const PL = [16, 12, 500, 486], PR = [532, 12, 312, 486];
  const cN = B.chipM('解数判读'), cV = B.chipM('特解回代'), cG = B.chipM('通解集');
  const tS = B.slider('值 t', -1, 1, 0.05, st.t, v => { st.t = v; B.render(); }, 't');
  const tT = B.slider('值 t', -4, 4, 0.1, st.tt, v => { st.tt = v; B.render(); }, 'T');
  const rowOf = s => s.parent || s.parentElement;
  const mBtns = [
    B.btnM('$\\sin x=t$', () => setMode(0), { on: true }),
    B.btnM('$\\cos x=t$', () => setMode(1)),
    B.btnM('$\\tan x=t$', () => setMode(2)),
  ];
  const pre = fn => () => { fn(); B.render(); };
  B.btn('① sin x=½', pre(() => { setMode(0); st.t = 0.5; tS.sync(0.5); }));
  B.btn('② 重根 sin x=1', pre(() => { setMode(0); st.t = 1; tS.sync(1); }));
  B.btn('③ cos x=−½', pre(() => { setMode(1); st.t = -0.5; tS.sync(-0.5); }));
  B.btn('④ tan x=1', pre(() => { setMode(2); st.tt = 1; tT.sync(1); }));
  function setMode(m) {
    st.mode = m;
    mBtns.forEach((b2, i) => b2.classList.toggle('on', i === m));
    rowOf(m === 2 ? tS : tT).style.display = 'none';
    rowOf(m === 2 ? tT : tS).style.display = '';
    B.render();
  }
  rowOf(tT).style.display = 'none';   // 初始 sin 模式（renderFn 未就位，只藏行不渲染）
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const piStr = x => {                 // π/12 步约分（sector radStr 先例），非整倍退化小数
    const n = Math.round(x * 12 / Math.PI);
    if (Math.abs(x) < 0.006) return '0';
    if (Math.abs(x - n * Math.PI / 12) < 0.006) {
      const s = n < 0 ? '-' : '', m = Math.abs(n), g = gcd(m, 12);
      if (m === 12) return s + '\\pi';
      return g === 1 ? `${s}\\frac{${m}\\pi}{12}` : (m / g === 1 ? `${s}\\frac{\\pi}{${12 / g}}` : `${s}\\frac{${m / g}\\pi}{${12 / g}}`);
    }
    return fmt(x, 2);
  };
  const solsOf = () => {               // 特解解析生成（比扫描稳）：两支候选 + mod 2π + 排序去重
    const out = [];
    if (st.mode < 2) {
      if (Math.abs(st.t) > 1 + 1e-9) return out;
      const tc = Math.max(-1, Math.min(1, st.t));
      const a = st.mode === 0 ? Math.asin(tc) : Math.acos(tc);
      (st.mode === 0 ? [a, Math.PI - a] : [a, -a]).forEach(x => out.push(((x % TAU) + TAU) % TAU));
    } else for (let k = 0; k < 3; k++) out.push((((Math.atan(st.tt) + k * Math.PI) % TAU) + TAU) % TAU);
    out.sort((p, q) => p - q);
    return out.filter((x, i) => i === 0 || x - out[i - 1] > 1e-6);
  };

  B.renderFn = () => {
    const tv = st.mode === 2 ? st.tt : st.t;
    const f = st.mode === 0 ? Math.sin : st.mode === 1 ? Math.cos : Math.tan;
    const yMax = st.mode === 2 ? 4.6 : 1.7;
    const bad = st.mode < 2 && Math.abs(st.t) > 1 + 1e-9;
    const sols = solsOf();
    const m = { px: v => PL[0] + 24 + v * (PL[2] - 48) / TAU, py: v => PL[1] + 240 - v * 200 / yMax, X0: 0, X1: TAU, Y0: -yMax, Y1: yMax };
    B.grid({ ...m, sx: Math.PI / 2, sy: st.mode === 2 ? 2 : 0.5, grid: true, labs: true, axLab: 'x', ayLab: 'y', xt: [] });
    for (let i = 0; i <= 4; i++)      // π 刻度自绘（B.grid 印不了 π —— reciplab 坑）
      B.text(V(m.px(i * Math.PI / 2), PL[1] + 458), ['0', 'π/2', 'π', '3π/2', '2π'][i], { 'font-size': 11, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 母波（sin/cos 锚点并进采样；tan 断笔成支 —— tangap 先例）
    const col = ['#5cadff', '#67e8f9', '#c084fc'][st.mode];
    if (st.mode < 2) {
      const xs = Array.from({ length: 121 }, (_, i) => TAU * i / 120).concat([0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, TAU]).sort((p, q) => p - q);
      mk('polyline', { points: xs.map(x => `${m.px(x).toFixed(1)},${m.py(f(x)).toFixed(1)}`).join(' '), fill: 'none', stroke: col, 'stroke-width': 2.2 }, B.dyn);
    } else for (let k = 0; k <= 2; k++) {
      const x0 = Math.max(0, k * Math.PI - Math.PI / 2 + 0.02), x1 = Math.min(TAU, k * Math.PI + Math.PI / 2 - 0.02);
      if (x1 <= x0) continue;
      const xs = Array.from({ length: 61 }, (_, i) => x0 + (x1 - x0) * i / 60);
      mk('polyline', { points: xs.map(x => `${m.px(x).toFixed(1)},${m.py(Math.tan(x)).toFixed(1)}`).join(' '), fill: 'none', stroke: col, 'stroke-width': 2 }, B.dyn);
    }
    // 水平线 y=t（界外画 ±1 排除虚线）
    if (bad) {
      B.seg(V(m.px(0), m.py(1)), V(m.px(TAU), m.py(1)), { stroke: '#ff6b6b', 'stroke-width': 1, 'stroke-dasharray': '2 4' });
      B.seg(V(m.px(0), m.py(-1)), V(m.px(TAU), m.py(-1)), { stroke: '#ff6b6b', 'stroke-width': 1, 'stroke-dasharray': '2 4' });
    } else B.seg(V(m.px(0), m.py(tv)), V(m.px(TAU), m.py(tv)), { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' });
    // 特解金点
    sols.forEach((x, i) => {
      B.dot(V(m.px(x), m.py(tv)), 4.5, { fill: '#ffd166' });
      B.tex(V(m.px(x), m.py(tv) + (tv > 0 ? -14 : 20)), `$x_{${i + 1}}$`, { size: 12, color: '#ffd166', anchor: 'mid', w: 40 });
    });
    // 右栏：特解列表
    B.tex(V(PR[0] + PR[2] / 2, 34), '特解列表（窗 [0,2π)）', { size: 13, color: '#93a1b5', anchor: 'mid', w: 280 });
    sols.forEach((x, i) => {
      B.tex(V(PR[0] + 26, 68 + i * 32), `$x_{${i + 1}}=${piStr(x)}$（${fmt(x * 180 / Math.PI, 0)}°）`, { size: 15, color: '#e8eef7', anchor: 'start', w: 280 });
    });
    const y0 = 68 + Math.max(sols.length, 1) * 32 + 26;
    B.tex(V(PR[0] + PR[2] / 2, y0), '通解族', { size: 13, color: '#93a1b5', anchor: 'mid', w: 200 });
    const aTxt = st.mode === 2 ? Math.atan(st.tt) : st.mode === 0 ? Math.asin(Math.max(-1, Math.min(1, st.t))) : Math.acos(Math.max(-1, Math.min(1, st.t)));
    if (bad) B.tex(V(PR[0] + PR[2] / 2, y0 + 34), '通解集为空 —— 值域外没有解', { size: 14, color: '#ff6b6b', anchor: 'mid', w: 280 });
    else if (st.mode === 0) {
      B.tex(V(PR[0] + PR[2] / 2, y0 + 30), `$x=\\alpha+2k\\pi$ 或 $x=\\pi-\\alpha+2k\\pi$`, { size: 14, color: '#ffd166', anchor: 'mid', w: 300 });
      B.tex(V(PR[0] + PR[2] / 2, y0 + 58), `$\\alpha=\\arcsin ${fmt(st.t, 2)}=${piStr(aTxt)}$`, { size: 14, color: '#67e8f9', anchor: 'mid', w: 280 });
    } else if (st.mode === 1) {
      B.tex(V(PR[0] + PR[2] / 2, y0 + 30), `$x=\\pm\\alpha+2k\\pi$`, { size: 15, color: '#ffd166', anchor: 'mid', w: 280 });
      B.tex(V(PR[0] + PR[2] / 2, y0 + 58), `$\\alpha=\\arccos ${fmt(st.t, 2)}=${piStr(aTxt)}$`, { size: 14, color: '#67e8f9', anchor: 'mid', w: 280 });
    } else {
      B.tex(V(PR[0] + PR[2] / 2, y0 + 30), `$x=\\alpha+k\\pi$`, { size: 15, color: '#ffd166', anchor: 'mid', w: 280 });
      B.tex(V(PR[0] + PR[2] / 2, y0 + 58), `$\\alpha=\\arctan ${fmt(st.tt, 2)}=${piStr(aTxt)}$`, { size: 14, color: '#67e8f9', anchor: 'mid', w: 280 });
    }
    if (!bad) B.tex(V(PR[0] + PR[2] / 2, y0 + 96), `k 为整数 —— 每支解族 = 特解 + ${st.mode === 2 ? 'π·k' : '2π·k'}`, { size: 12, color: '#93a1b5', anchor: 'mid', w: 300 });
    // chips
    if (bad) cN('无解：|t|>1 超出范围（H1 的结论）', 'warn');
    else if (sols.length === 1) cN('恰一解（切线重根）：峰谷触线，两支并一', 'ok');
    else cN(`窗内 ${sols.length} 解，各对应一支解族（周期 ${st.mode === 2 ? 'π' : '2π'}）`, '');
    const okV = sols.length > 0 && Math.abs(f(sols[0]) - tv) < 0.01;
    cV(okV ? `$f(x_1)=${fmt(f(sols[0]), 2)}=t$ 特解回代完全重合` : '无特解可回代', okV ? 'ok' : 'warn');
    if (bad) cG('通解集为空', 'warn');
    else if (st.mode === 0) cG('两支：$\\alpha+2k\\pi$ 与 $\\pi-\\alpha+2k\\pi$', '');
    else if (st.mode === 1) cG('两支：$\\pm\\alpha+2k\\pi$（关于 y 轴镜像）', '');
    else cG('一支：$\\alpha+k\\pi$ 周期 π 通吃', '');
  };
  B.render();
  B.hint('水平线 y=t 与曲线相交，交点即特解；右栏两条通解表达式 = 特解 + 周期·k，一支不漏');
  return B;
}
