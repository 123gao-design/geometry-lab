/* 图 误1 · 误差与有效数字
   真值取 π、√2、√7 之一，四舍五入（或直接截断）到小数点后 k 位得到近似值 x。
   数轴上这一段被放大成「末位的 1 个单位」：金色带是允许限 ±0.5 个末位单位，橙线是真值。
   真值落在金带以内，保留的每一位都可靠；跌出金带，末位就不可靠，有效数字比保留的位数少一位。 */
import { Board, V, mk } from '../../../lib/board.js';

const PRE = [
  { n: 'π', t: '\\pi', v: Math.PI, dec: '3.1415926535' },
  { n: '√2', t: '\\sqrt2', v: Math.SQRT2, dec: '1.4142135623' },
  { n: '√7', t: '\\sqrt7', v: Math.sqrt(7), dec: '2.6457513110' },
];

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { p: 0, k: 4, mode: 0 };
  const cE = B.chipM('绝对误差'), cR = B.chipM('相对误差'), cN = B.chipM('有效数字'), cJ = B.chipM('判读');

  const XA = 66, XB = 556, AY = 214, BW = 486;
  const sci = v => {
    if (!(v > 0)) return '0';
    const e = Math.floor(Math.log10(v));
    const m = v / Math.pow(10, e);
    return `${m.toFixed(2)}\\times10^{${e}}`;
  };

  B.renderFn = () => {
    const P = PRE[st.p], TRUE = P.v, k = st.k, u = Math.pow(10, -k);
    const q = TRUE / u;
    const xe = (st.mode === 0 ? Math.round(q) : Math.floor(q)) * u;
    const err = Math.abs(TRUE - xe), rel = err / TRUE;
    const E = Math.floor(Math.log10(Math.abs(xe)));
    let n = Math.floor(E + 1 - Math.log10(Math.max(2 * err, 1e-15)));
    const str = xe.toFixed(k);
    const sig = (str.replace('.', '').replace(/^0+/, '') || '0').length;
    n = Math.max(1, Math.min(n, sig));

    // 两行标题：真值的小数展开、近似值与取位方式
    B.textM(V(XA, 76), `真值 $${P.t}=${P.dec}\\ldots$`, { 'font-size': 14, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(XA, 110), `近似值 $x^*=${str}$　${st.mode === 0 ? '四舍五入' : '直接截断'}到小数点后 $${k}$ 位，末位单位 $10^{-${k}}$`,
      { 'font-size': 14, fill: '#ffd166', 'text-anchor': 'start' });

    // 放大后的数轴：视野 xe ± 1.6u
    const xa = xe - 1.6 * u, xb = xe + 1.6 * u;
    const px = x => XA + (x - xa) / (xb - xa) * (XB - XA);

    // 允许限带 ±0.5u
    B.dyn.appendChild(mk('rect', {
      x: px(xe - 0.5 * u), y: AY - 28, width: px(xe + 0.5 * u) - px(xe - 0.5 * u), height: 56,
      fill: '#ffd166', 'fill-opacity': .14, stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 3',
    }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: XA - 14, y1: AY, x2: XB + 14, y2: AY, stroke: '#aebdd2', 'stroke-width': 1.3 }, B.dyn));

    // 三个刻度：xe−u、xe、xe+u
    [-1, 0, 1].forEach(t => {
      const x = xe + t * u;
      B.dyn.appendChild(mk('line', { x1: px(x), y1: AY, x2: px(x), y2: AY + 6, stroke: '#aebdd2', 'stroke-width': 1 }, B.dyn));
      B.textM(V(px(x), AY + 24), `$${x.toFixed(k + 1)}$`, { 'font-size': 11.5, fill: '#8fa3bd' });
    });

    // 误差段（近似值 → 真值）与真值竖线
    B.dyn.appendChild(mk('line', {
      x1: px(xe), y1: AY - 12, x2: px(TRUE), y2: AY - 12,
      stroke: '#ff7b8a', 'stroke-width': 4.5, 'stroke-linecap': 'round',
    }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: px(TRUE), y1: AY - 46, x2: px(TRUE), y2: AY + 10, stroke: '#ff9e4a', 'stroke-width': 1.8 }, B.dyn));
    B.dot(V(px(xe), AY), 6.5, { fill: '#5cadff' });
    B.textM(V(px(TRUE), AY - 56), `真值 $${P.t}$`, { 'font-size': 12.5, fill: '#ff9e4a' });
    B.textM(V(px(xe), AY + 50), '$x^*$', { 'font-size': 12.5, fill: '#5cadff' });

    // 误差条 vs 允许限：都以「末位 1 个单位」为满格
    const by1 = 296, by2 = 340;
    B.textM(V(XA, by1 - 9), `误差 $|x^*-x|$ 占末位的 $${(err / u * 100).toFixed(1)}\\%$`, { 'font-size': 12.5, fill: '#ff7b8a', 'text-anchor': 'start' });
    B.dyn.appendChild(mk('rect', { x: XA, y: by1, width: BW, height: 16, rx: 4, fill: '#22314a', stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
    B.dyn.appendChild(mk('rect', { x: XA, y: by1, width: Math.min(err / u, 1) * BW, height: 16, rx: 4, fill: '#ff7b8a', 'fill-opacity': .78 }, B.dyn));

    B.textM(V(XA, by2 - 9), '允许限 $\\tfrac12$ 个末位单位', { 'font-size': 12.5, fill: '#ffd166', 'text-anchor': 'start' });
    B.dyn.appendChild(mk('rect', { x: XA, y: by2, width: BW, height: 16, rx: 4, fill: '#22314a', stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
    B.dyn.appendChild(mk('rect', { x: XA, y: by2, width: BW / 2, height: 16, rx: 4, fill: '#ffd166', 'fill-opacity': .35, stroke: '#ffd166', 'stroke-width': 1.2 }, B.dyn));

    // 右栏小表
    B.textM(V(608, 150), '末位单位', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(608, 178), `$10^{-${k}}$`, { 'font-size': 17, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(608, 222), '允许误差', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(608, 250), `$\\tfrac12\\times10^{-${k}}$`, { 'font-size': 17, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(608, 296), '实际误差', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(608, 324), `$${sci(err)}$`, { 'font-size': 15, fill: '#ff7b8a', 'text-anchor': 'start' });

    const ok = err <= 0.5 * u * (1 + 1e-12);
    cE(`$${sci(err)}$`);
    cR(`$${(rel * 100).toFixed(4)}\\%$`);
    cN(`$${n}$ 位`);
    cJ(ok
      ? '真值落在金色半格以内，末位可靠，保留的每一位都是有效数字'
      : '真值跌出金色半格，末位不可靠，有效数字要比保留的位数少一位');
  };

  const pre = [], cm = [];
  const mark = () => {
    pre.forEach((b, i) => b.classList.toggle('on', st.p === i));
    cm.forEach((b, i) => b.classList.toggle('on', st.mode === i));
  };
  PRE.forEach((p, i) => pre.push(B.btn(p.n, () => { st.p = i; mark(); B.render(); })));
  ['四舍五入', '直接截断'].forEach((t, i) => cm.push(B.btn(t, () => { st.mode = i; mark(); B.render(); })));
  mark();

  B.slider('小数位 k', 0, 6, 1, st.k, v => { st.k = v; B.render(); }, 'k');

  B.hint('k 取大一些：末位单位变小，真值可能跌出金色半格，末位就不算数了');
  B.render();
  return B;
}
