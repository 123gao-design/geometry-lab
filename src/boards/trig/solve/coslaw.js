/* 图 Z2 余弦定理投影分解机：c² = a² + b² − 2ab·cosγ 的几何直译 ——
   把角 γ 顶点 C 摆在原点、b 沿 +x、a 仰角 γ，则对边 AB 恰是直角三角形的斜边：
   水平分量 |b−a·cosγ|、竖直分量 a·sinγ，勾股一勾即得 c²；展开合并后 −2ab·cosγ 就是「修正项」——
   锐角负修正（c²<a²+b²）、直角零修正（勾股）、钝角正修正（c²>a²+b²）。
   右栏两根横条对比 a²+b² 与 c²，缺口宽度即修正项。坐标：C=(0,0)，s=33 px/单位。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { a: 4, b: 5, deg: 60, proj: true, labs: true };
  const S = 33, C0 = V(230, 300);
  const PR = [532, 12, 312, 486];
  const X = x => C0.x + S * x, Y = y => C0.y - S * y;
  const cFix = B.chipM('修正项'), cLaw = B.chipM('$c^2$ 核验'), cCmp = B.chipM('锐直钝判读'), cInv = B.chipM('反演 γ');
  const aSl = B.slider('边 a', 2, 7, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  const bSl = B.slider('边 b', 2, 7, 0.05, st.b, v => { st.b = v; B.render(); }, 'b');
  const gSl = B.slider('夹角 γ°', 20, 160, 5, st.deg, v => { st.deg = v; B.render(); }, 'g');
  const pre = (a, b, d) => () => { st.a = a; st.b = b; st.deg = d; aSl.sync(a); bSl.sync(b); gSl.sync(d); B.render(); };
  B.btnM('① 勾股 $\\gamma=90^\\circ$', pre(4, 5, 90));
  B.btnM('② 锐角 $\\gamma=60^\\circ$', pre(4, 5, 60));
  B.btnM('③ 钝角 $\\gamma=120^\\circ$', pre(4, 5, 120));
  B.toggleBtn('投影分解', true, v => { st.proj = v; B.render(); });
  B.graphToggles(st, ['labs']);

  const angArc = (p, r, a0, a1, at) => {
    const n = 26, pts = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + (a1 - a0) * i / n;
      pts.push(`${(p.x + r * Math.cos(t)).toFixed(1)},${(p.y - r * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  const lab = (p, s, col) => { if (st.labs) B.text(p, s, { 'font-size': 12, fill: col || '#e8eef7', 'text-anchor': 'middle' }); };

  B.renderFn = () => {
    const a = st.a, b = st.b, g = st.deg * Math.PI / 180;
    const A = V(b, 0), Bm = V(a * Math.cos(g), a * Math.sin(g));
    const Cp = V(X(0), Y(0)), Ap = V(X(A.x), Y(0)), Bp = V(X(Bm.x), Y(Bm.y)), Dp = V(X(Bm.x), Y(0));
    const c = Math.hypot(b - a * Math.cos(g), a * Math.sin(g));
    B.seg(V(X(-7), Y(0)), V(X(7.5), Y(0)), { stroke: '#22314a', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    mk('polygon', { points: `${Cp.x},${Cp.y} ${Ap.x},${Ap.y} ${Bp.x},${Bp.y}`, fill: 'rgba(92,173,255,.05)', stroke: 'none' }, B.dyn);
    B.seg(Cp, Ap, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.seg(Cp, Bp, { stroke: '#67e8f9', 'stroke-width': 2.2 });
    B.seg(Ap, Bp, { stroke: '#ffd166', 'stroke-width': 2.4 });
    angArc(Cp, 30, 0, g, { stroke: '#67e8f9', 'stroke-width': 1.4 });
    lab(V(C0.x + 42 * Math.cos(g / 2), C0.y - 42 * Math.sin(g / 2)), `γ=${st.deg}°`, '#67e8f9');
    if (st.proj) {
      B.seg(Cp, Dp, { stroke: '#c084fc', 'stroke-width': 2 });
      B.seg(Dp, Bp, { stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
      B.seg(V(Dp.x - 7, Dp.y), V(Dp.x - 7, Dp.y - 7), { stroke: '#93a1b5', 'stroke-width': 1.2 });
      B.seg(V(Dp.x - 7, Dp.y - 7), V(Dp.x, Dp.y - 7), { stroke: '#93a1b5', 'stroke-width': 1.2 });
      lab(V((Cp.x + Dp.x) / 2, Dp.y + 16), `a·cosγ=${fmt(a * Math.cos(g), 2)}`, '#c084fc');
      lab(V(Dp.x + (Dp.x < Ap.x ? 10 : -10), (Dp.y + Bp.y) / 2), `a·sinγ=${fmt(a * Math.sin(g), 2)}`, '#ff9e4a');
      lab(V((Ap.x + Dp.x) / 2, Ap.y - 10), `|b−a·cosγ|=${fmt(Math.abs(b - a * Math.cos(g)), 2)}`, '#ffd166');
    }
    lab(V(Ap.x + 12, Ap.y + 16), 'A'); lab(V(Cp.x - 12, Cp.y + 16), 'C'); lab(V(Bp.x, Bp.y - 12), 'B');
    lab(V(Cp.x + (Ap.x - Cp.x) / 2, Cp.y + 34), `b=${fmt(b, 2)}`, '#5cadff');
    lab(V(Cp.x + (Bp.x - Cp.x) / 2 - 26, Cp.y - (Bp.y - Cp.y) / 2), `a=${fmt(a, 2)}`, '#67e8f9');
    lab(V(Ap.x + (Bp.x - Ap.x) / 2 + 14, Ap.y - (Bp.y - Ap.y) / 2 - 10), `c=${fmt(c, 2)}`, '#ffd166');
    B.tex(V(PR[0] + PR[2] / 2, 40), '三项分解与对比条', { size: 14, color: '#93a1b5', anchor: 'mid', w: 240 });
    const a2b2 = a * a + b * b, c2 = c * c, fix = a2b2 - c2;
    const mx2 = Math.max(a2b2, c2) * 1.06, bx = PR[0] + 14, bw2 = PR[2] - 60;
    for (const [nm, v2, col, yy] of [['a²+b²', a2b2, '#5cadff', 90], ['c²', c2, '#ffd166', 150]]) {
      mk('rect', { x: bx, y: yy, width: bw2 * v2 / mx2, height: 26, fill: col, 'fill-opacity': .75, stroke: 'none' }, B.dyn);
      B.tex(V(bx + bw2 * v2 / mx2 + 10, yy + 13), `$${nm}=${fmt(v2, 1)}$`, { size: 13, anchor: 'start', w: 90 });
    }
    const wFix = bw2 * Math.abs(fix) / mx2, xA = bx + bw2 * (fix > 0 ? c2 : a2b2) / mx2;
    B.seg(V(xA, 118), V(xA + Math.max(wFix, 3), 118), { stroke: '#ff9e4a', 'stroke-width': 2 });
    B.seg(V(xA, 112), V(xA, 124), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
    B.seg(V(xA + Math.max(wFix, 3), 112), V(xA + Math.max(wFix, 3), 124), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
    B.tex(V(bx + bw2 / 2, 200), '$c^2=(b-a\\cos\\gamma)^2+(a\\sin\\gamma)^2$', { size: 13, anchor: 'mid', w: 300 });
    B.tex(V(bx + bw2 / 2, 240), '$=a^2+b^2-2ab\\cos\\gamma$', { size: 15, color: '#ffd166', anchor: 'mid', w: 300 });
    B.tex(V(bx + bw2 / 2, 285), 'c² 实测 ' + fmt(c2, 2), { size: 13, anchor: 'mid', w: 300 });
    B.tex(V(bx + bw2 / 2, 322), '理论 a²+b²−2ab·cosγ = ' + fmt(a2b2 - 2 * a * b * Math.cos(g), 2), { size: 12, color: '#93a1b5', anchor: 'mid', w: 300 });
    B.tex(V(bx + bw2 / 2, 370), '$\\gamma=\\arccos\\tfrac{a^2+b^2-c^2}{2ab}$', { size: 14, color: '#c084fc', anchor: 'mid', w: 300 });
    B.tex(V(bx + bw2 / 2, 410), '= ' + fmt(st.deg, 0) + '°（与滑块对上）', { size: 12, color: '#93a1b5', anchor: 'mid', w: 300 });
    const fx = -2 * a * b * Math.cos(g);
    cFix('$-2ab\\cos\\gamma=' + fmt(fx, 2) + '$ ' + (Math.abs(fx) < 0.02 ? '零修正 → 勾股' : fx < 0 ? '负修正，c² 变小' : '正修正，c² 变大'), '');
    cLaw('实测 ' + fmt(c2, 2) + ' vs 理论 ' + fmt(a2b2 - 2 * a * b * Math.cos(g), 2), Math.abs(c2 - (a2b2 - 2 * a * b * Math.cos(g))) < 0.02 ? 'ok' : 'warn');
    cCmp(st.deg < 90 ? 'γ=' + st.deg + '° 锐角 → c²=' + fmt(c2, 1) + ' < a²+b²=' + fmt(a2b2, 1) : st.deg === 90 ? 'γ=90° 直角 → c²=a²+b²=' + fmt(c2, 1) + '：勾股是特例' : 'γ=' + st.deg + '° 钝角 → c²=' + fmt(c2, 1) + ' > a²+b²=' + fmt(a2b2, 1), '');
    const inv = Math.acos(Math.max(-1, Math.min(1, (a * a + b * b - c * c) / (2 * a * b)))) * 180 / Math.PI;
    cInv('反演 γ=' + fmt(inv, 1) + '°' + (Math.abs(inv - st.deg) < 0.6 ? ' —— 与滑块完全重合（H1 的结论）' : ''), Math.abs(inv - st.deg) < 0.6 ? 'ok' : 'warn');
  };
  B.render();
  B.hintM('拖 $\\gamma$ 从锐到钝：紫色投影 $a\\cdot\\cos\\gamma$ 掉头反向，修正项 $-2ab\\cdot\\cos\\gamma$ 从负过零变正；右栏缺口宽即修正项');
  return B;
}
