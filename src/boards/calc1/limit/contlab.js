/* 图 极4 · 连续与间断分类机
   五个预设各给一个 x₀ 处的接缝：连续、可去间断、跳跃间断、无穷间断、振荡间断。
   绿点从左侧、紫点从右侧同时逼近 x₀（δ 滑块控制距离），右栏逐项读左极限、右极限与 f(x₀)：
   三者相等且都有限 → 连续；左右极限相等而 f(x₀) 另给 → 可去；左右极限不等 → 跳跃；
   趋于无穷 → 无穷；在两条水平线之间来回摆 → 振荡。空心圈表示曲线在该点缺席，实心点是 f(x₀)。
   版面：左图 46..646 × 58..358，右栏 660 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const X0 = 1;
const P = [
  {
    n: '① 连续', kind: '连续', col: '#5cadff',
    view: [-0.6, 2.4, -0.3, 3.4],
    parts: [{ f: x => x * x / 2 + 1, col: '#5cadff' }],
    limL: 1.5, limR: 1.5, fv: 1.5,
    why: ['左右极限与函数值都为 $1.5$', '曲线在 $x_0$ 处接上'],
  },
  {
    n: '② 可去', kind: '可去间断', col: '#5cadff',
    view: [-0.6, 2.4, -0.3, 3.4],
    parts: [{ f: x => x + 1, col: '#5cadff' }],
    limL: 2, limR: 2, fv: 3,
    why: ['左右极限都是 $2$，而 $f(1)=3$', '补上或改掉这一个值即可连续'],
  },
  {
    n: '③ 跳跃', kind: '跳跃间断', col: '#ff9e4a',
    view: [-0.6, 2.4, -0.3, 6],
    parts: [
      { f: x => x + 1, col: '#5cadff', dom: x => x < X0 },
      { f: x => x + 3, col: '#ff9e4a', dom: x => x > X0 },
    ],
    limL: 2, limR: 4, fv: 2.5,
    why: ['左极限 $2$、右极限 $4$，两侧不等', '双侧极限不存在，落差为 $2$'],
  },
  {
    n: '④ 无穷', kind: '无穷间断', col: '#ff7b8a',
    view: [-0.6, 2.4, -0.6, 6],
    parts: [
      { f: x => 1 / ((x - 1) * (x - 1)), col: '#5cadff', dom: x => x < X0 },
      { f: x => 1 / ((x - 1) * (x - 1)), col: '#ff9e4a', dom: x => x > X0 },
    ],
    limL: null, limR: null, fv: null, asym: true,
    why: ['两侧都趋于 $+\\infty$', '极限不是有限数，$f(1)$ 也无定义'],
  },
  {
    n: '⑤ 振荡', kind: '振荡间断', col: '#c084fc',
    view: [-0.6, 2.4, -1.4, 1.4],
    osc: true, parts: [],
    limL: null, limR: null, fv: null,
    why: ['越靠近 $x_0$，曲线在 $-1$ 与 $1$', '之间摆动得越快，不趋于任何值'],
  },
];

export function createBoard(root) {
  const W = 860, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, d: 0.35 };
  const c1 = B.chipM('左极限'), c2 = B.chipM('右极限'), c3 = B.chipM('函数值'), cT = B.chipM('类型');
  const lim = v => (v === null ? '+\\infty' : fmt(v, 2));

  B.renderFn = () => {
    const S = P[st.k], m = B.mapFit(...S.view, [46, 58, 600, 300], 18);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });

    // x₀ 的参考竖线
    B.seg(V(m.px(X0), m.py(m.Y0)), V(m.px(X0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
    B.tex(V(m.px(X0), m.py(m.Y0) - 8), '$x_0=1$', { size: 12, anchor: 'mid', color: '#93a1b5' });

    if (S.osc) {
      // 振荡支：越靠 x₀ 采样越密，才画得出被压扁的那一截
      const branch = (sign, col) => {
        let d = '', t = 0.9, first = true;
        while (t > 0.0022) {
          const x = X0 + sign * t, y = Math.sin(sign / t);
          const X = m.px(x), Y = m.py(y);
          d += (first ? 'M' : 'L') + X.toFixed(1) + ' ' + Y.toFixed(1) + ' ';
          first = false; t *= 0.94;
        }
        mk('path', { d, fill: 'none', stroke: col, 'stroke-width': 1.8 }, B.dyn);
      };
      branch(-1, '#5cadff');
      branch(1, '#ff9e4a');
      mk('rect', { x: m.px(m.X0), y: m.py(1), width: m.px(m.X1) - m.px(m.X0), height: m.py(-1) - m.py(1), fill: '#c084fc', 'fill-opacity': .07 }, B.dyn);
      B.seg(V(m.px(m.X0), m.py(1)), V(m.px(m.X1), m.py(1)), { stroke: '#c084fc', 'stroke-width': 1, 'stroke-dasharray': '5 4', 'stroke-opacity': .6 });
      B.seg(V(m.px(m.X0), m.py(-1)), V(m.px(m.X1), m.py(-1)), { stroke: '#c084fc', 'stroke-width': 1, 'stroke-dasharray': '5 4', 'stroke-opacity': .6 });
    } else {
      for (const q of S.parts) B.plot(q.f, m, { dom: q.dom, stroke: q.col, 'stroke-width': 2.2 });
    }

    if (S.asym) B.asym(m, [{ v: X0 }]);

    // 两侧逼近点
    const d = st.d, xl = X0 - d, xr = X0 + d;
    const yl = Math.sin(-1 / d), yr = Math.sin(1 / d);
    const near = (x, y, col, lab) => {
      const Y = m.py(y);
      if (Y < m.py(m.Y1) - 40 || Y > m.py(m.Y0) + 40) return;
      B.seg(V(m.px(x), Y), V(m.px(x), m.py(0)), { stroke: col, 'stroke-width': 1.1, 'stroke-dasharray': '4 3', 'stroke-opacity': .8 });
      B.dot(V(m.px(x), Y), 5.4, { fill: col, stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(m.px(x), m.py(m.Y0) + 30), lab, { size: 11, anchor: 'mid', color: col });
    };
    const fL = S.osc ? yl : S.parts[0].f(xl);
    const fR = S.osc ? yr : (S.parts[1] || S.parts[0]).f(xr);
    near(xl, fL, '#4ade80', '$f(1^-)$');
    near(xr, fR, '#c084fc', '$f(1^+)$');

    // 接缝：空心圈是曲线缺席的位置，实心点是函数值
    if (S.kind === '连续') {
      B.dot(V(m.px(X0), m.py(S.fv)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    } else if (S.kind === '可去间断') {
      B.dot(V(m.px(X0), m.py(S.limL)), 5, { fill: '#0a0d14', stroke: '#5cadff', 'stroke-width': 2 });
      B.dot(V(m.px(X0), m.py(S.fv)), 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(m.px(X0) + 11, m.py(S.fv) + 4), '$f(1)$', { size: 11.5, anchor: 'start', color: '#ffd166' });
    } else if (S.kind === '跳跃间断') {
      B.dot(V(m.px(X0), m.py(S.limL)), 5, { fill: '#0a0d14', stroke: '#5cadff', 'stroke-width': 2 });
      B.dot(V(m.px(X0), m.py(S.limR)), 5, { fill: '#0a0d14', stroke: '#ff9e4a', 'stroke-width': 2 });
      B.dot(V(m.px(X0), m.py(S.fv)), 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(m.px(X0) + 11, m.py(S.fv) - 6), '$f(1)$', { size: 11.5, anchor: 'start', color: '#ffd166' });
    }

    // 右栏：四项读数 + 判读
    B.textM(V(664, 84), '在 $x_0=1$ 处逐项对照', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['左极限', S.osc ? '摆动' : lim(S.limL), '#4ade80'],
      ['右极限', S.osc ? '摆动' : lim(S.limR), '#c084fc'],
      ['$f(1)$', S.fv === null ? '无定义' : fmt(S.fv, 2), '#ffd166'],
    ];
    rows.forEach((r, i) => {
      B.textM(V(668, 118 + i * 28), r[0], { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
      B.textM(V(812, 118 + i * 28), r[1], { 'font-size': 12.5, fill: r[2], 'text-anchor': 'end' });
    });
    B.textM(V(668, 216), '类型', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
    B.textM(V(812, 216), S.kind, { 'font-size': 13, fill: S.col, 'text-anchor': 'end' });
    S.why.forEach((ln, i) => B.tex(V(668, 252 + i * 24), ln, { size: 12, color: '#aebdd2', anchor: 'start', w: 186 }));

    c1(S.osc ? `$f(${fmt(xl, 2)})=${fmt(yl, 2)}$ 摆动` : `$f(${fmt(xl, 2)})=${fmt(fL, 2)}\\to${lim(S.limL)}$`);
    c2(S.osc ? `$f(${fmt(xr, 2)})=${fmt(yr, 2)}$ 摆动` : `$f(${fmt(xr, 2)})=${fmt(fR, 2)}\\to${lim(S.limR)}$`);
    c3(S.fv === null ? '不存在' : `$f(1)=${fmt(S.fv, 2)}$`);
    cT(S.kind, S.kind === '连续' ? 'ok' : 'warn');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('离 x₀ 的距离 δ', 0.02, 0.8, 0.01, st.d, v => { st.d = v; B.render(); }, 'd');

  B.hintM('五个接缝逐一看：左右极限是否相等、是否有限，再与 $f(x_0)$ 对照，间断就被分成四类');
  B.render();
  return B;
}
