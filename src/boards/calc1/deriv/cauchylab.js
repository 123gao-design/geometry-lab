/* 图 微4b · 柯西中值定理机：参数曲线上的弦与切线
   把 x=g(t)、y=f(t) 看成平面上的一条参数曲线，t 从 a 走到 b 时点从 A 走到 B。
   弦 AB 的斜率是 [f(b)-f(a)]/[g(b)-g(a)]，曲线在 t 处的切线斜率是 f'(t)/g'(t)。
   柯西中值定理说：区间内至少有一个 t*，两率之比等于弦斜率。
   版面：坐标系 46..600 × 58..382，右栏 620 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

// 取 g(t)=t²、f(t)=t³，t∈[1,3]：弦斜率 26/8，切线斜率 3t/2，t*=13/6
const g = t => t * t, f = t => t * t * t;
const dg = t => 2 * t, df = t => 3 * t * t;
const A = 1, E = 3;

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const cK = B.chipM('弦斜率'), cT = B.chipM('切线斜率'), cE = B.chipM('差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const m = B.mapFit(-0.4, 11.2, -1.2, 34, [46, 58, 554, 300], 12);
    B.grid({ ...m, sx: 1, sy: 4, lx: 2, ly: 8, xt: [2, 4, 6, 8, 10], yt: [8, 16, 24, 32], axLab: 'x=g(t)', ayLab: 'y=f(t)' });

    // 参数曲线
    let d = '';
    for (let i = 0; i <= 240; i++) {
      const t = 0.35 + (3.25 - 0.35) * i / 240;
      d += (i ? 'L' : 'M') + m.px(g(t)).toFixed(2) + ' ' + m.py(f(t)).toFixed(2);
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);

    const xa = g(A), ya = f(A), xb = g(E), yb = f(E);
    const k = (yb - ya) / (xb - xa);
    const ts = k / 1.5;              // 切线斜率 3t/2，令其等于 k
    const xt = g(ts), yt = f(ts);

    // 弦 AB
    B.seg(V(m.px(xa), m.py(ya)), V(m.px(xb), m.py(yb)), { stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-dasharray': '8 5' });
    B.dot(V(m.px(xa), m.py(ya)), 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(V(m.px(xb), m.py(yb)), 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(m.px(xa) + 10, m.py(ya) - 8), '$t=1$', { size: 11.5, anchor: 'start', color: '#ffd166' });
    B.tex(V(m.px(xb) + 10, m.py(yb) + 6), '$t=3$', { size: 11.5, anchor: 'start', color: '#ffd166' });

    // t* 处的切线：方向 (g', f')，按视野截断
    const dy = df(ts), dx = dg(ts), kk = dy / dx;
    let ax = m.X0, bx = m.X1;
    const xA = xt + (m.Y0 - yt) / kk, xB = xt + (m.Y1 - yt) / kk;
    ax = Math.max(ax, Math.min(xA, xB)); bx = Math.min(bx, Math.max(xA, xB));
    B.seg(V(m.px(ax), m.py(yt + kk * (ax - xt))), V(m.px(bx), m.py(yt + kk * (bx - xt))),
      { stroke: '#ff9e4a', 'stroke-width': 1.9 });

    const TP = V(m.px(xt), m.py(yt));
    B.dot(TP, 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.seg(TP, V(TP.x, m.py(0)), { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .75 });
    B.seg(TP, V(m.px(0), TP.y), { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .75 });
    B.tex(V(TP.x + 8, TP.y - 12), `$t^*=${fmt(ts, 2)}$`, { size: 12, anchor: 'start', color: '#ff9e4a' });
    B.tex(V(m.px(xt), m.py(0) + 18), `$x=${fmt(xt, 2)}$`, { size: 11, anchor: 'mid', color: '#93a1b5' });
    B.tex(V(m.px(0) - 8, TP.y), `$y=${fmt(yt, 2)}$`, { size: 11, anchor: 'end', color: '#93a1b5' });

    // 右栏
    B.textM(V(624, 86), '把参数曲线看成一条轨道', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$g(b)-g(a)$', fmt(xb - xa, 4), '#93a1b5'],
      ['$f(b)-f(a)$', fmt(yb - ya, 4), '#93a1b5'],
      ['弦斜率', fmt(k, 4), '#ffd166'],
      ['$g\'(t^*)$', fmt(dx, 4), '#93a1b5'],
      ['$f\'(t^*)$', fmt(dy, 4), '#93a1b5'],
      ['切线斜率', fmt(kk, 4), '#ff9e4a'],
      ['差', fmt(kk - k, 4), '#4ade80'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(624, 122 + i * 30), r[0], { size: 12.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 122 + i * 30), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(624, 344), '$\\dfrac{f\'(t^*)}{g\'(t^*)}=\\dfrac{f(b)-f(a)}{g(b)-g(a)}$', { size: 12.5, color: '#aebdd2', anchor: 'start' });

    cK(`$=\\dfrac{${fmt(yb - ya, 2)}}{${fmt(xb - xa, 2)}}=${fmt(k, 4)}$`);
    cT(`$=\\dfrac{${fmt(dy, 3)}}{${fmt(dx, 3)}}=${fmt(kk, 4)}$`);
    cE(`$=${fmt(kk - k, 4)}$`);
    cJ('两率之比等于弦斜率：$t$ 沿曲线走到 $t^*$ 时，切线方向与两端连线一致', 'ok');
  };

  B.hintM('参数曲线上的 $t$ 走一遍：切线方向与弦 $AB$ 相同的时刻，一定出现在区间内部');
  B.render();
  return B;
}
