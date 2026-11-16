/* 图 型3 · 用特征值给圆锥曲线分类
   左栏是 (λ₁, λ₂) 平面：两个特征值各自取正取负，把平面分成四块。
   右栏是对应那条曲线 λ₁x'² + λ₂y'² = 1 的样子。拖动左栏的点，
   曲线在椭圆、双曲线、空集之间切换；点落到坐标轴上时，二次型退化。
   分类只依赖两个数的符号，这就是「二次型标准形」的全部内容。 */
import { Board, V, mk, fmt, marchSegs } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { l1: 1.6, l2: .7 };
  const m1 = B.isoFit(-2.3, 2.3, -2.3, 2.3, [30, 52, 300, 300], 0);
  const m2 = B.isoFit(-2.7, 2.7, -2.7, 2.7, [420, 52, 300, 300], 0);
  const cE = B.chipM('特征值'), cD = B.chipM('行列式与迹'), cT = B.chipM('曲线类型'), cJ = B.chipM('判读');
  const th = 25 * Math.PI / 180;
  const v1 = [Math.cos(th), Math.sin(th)], v2 = [-Math.sin(th), Math.cos(th)];
  const sp2 = (x, y) => V(m2.px(x), m2.py(y));

  const kindOf = () => {
    const eps = 1e-6;
    if (Math.abs(st.l1 * st.l2) < eps) return st.l1 + st.l2 > eps ? 'degen2' : 'empty';
    if (st.l1 * st.l2 > 0) return st.l1 + st.l2 > 0 ? 'ellipse' : 'empty';
    return 'hyperbola';
  };

  B.renderFn = () => {
    // 左栏：(λ₁, λ₂) 平面
    B.grid({ ...m1, sx: 1, sy: 1, grid: true, labs: true, axLab: 'λ₁', ayLab: 'λ₂' });
    const region = (x0, y0, x1, y1, col, op) => {
      const pts = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
        .map(([x, y]) => `${m1.px(x).toFixed(1)},${m1.py(y).toFixed(1)}`).join(' ');
      B.dyn.appendChild(mk('polygon', { points: pts, fill: col, 'fill-opacity': op, stroke: 'none' }, B.dyn));
    };
    region(.06, .06, 2.25, 2.25, '#5cadff', .09);
    region(-2.25, .06, -.06, 2.25, '#4ade80', .075);
    region(.06, -2.25, 2.25, -.06, '#4ade80', .075);
    region(-2.25, -2.25, -.06, -.06, '#ff7b8a', .085);
    B.text(V(m1.px(1.25), m1.py(1.35)), '椭圆', { fill: '#5cadff', 'font-size': 12.5, 'text-anchor': 'middle' });
    B.text(V(m1.px(-1.2), m1.py(1.35)), '双曲线', { fill: '#4ade80', 'font-size': 12.5, 'text-anchor': 'middle' });
    B.text(V(m1.px(1.2), m1.py(-1.35)), '双曲线', { fill: '#4ade80', 'font-size': 12.5, 'text-anchor': 'middle' });
    B.text(V(m1.px(-1.2), m1.py(-1.35)), '空集', { fill: '#ff7b8a', 'font-size': 12.5, 'text-anchor': 'middle' });
    B.text(V(m1.px(.95), m1.py(-.18)), '退化', { fill: '#8fa3bd', 'font-size': 10.5, 'text-anchor': 'middle' });

    // 当前点
    const P = V(m1.px(st.l1), m1.py(st.l2));
    B.dot(P, 6.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(P.x + 12, P.y - 6), '$P$', { size: 12.5, anchor: 'start', color: '#ffd166' });

    // 右栏：对应曲线
    B.grid({ ...m2, sx: 1, sy: 1, grid: true, labs: true });
    const kind = kindOf();
    const f = (x, y) => {
      const c1 = x * v1[0] + y * v1[1], c2 = x * v2[0] + y * v2[1];
      return st.l1 * c1 * c1 + st.l2 * c2 * c2 - 1;
    };
    const segs = marchSegs(f, -2.7, -2.7, 2.7, 2.7, 120, 120);
    let d = '';
    segs.forEach(([p, q]) => {
      d += `M${m2.px(p.x).toFixed(1)},${m2.py(p.y).toFixed(1)}L${m2.px(q.x).toFixed(1)},${m2.py(q.y).toFixed(1)}`;
    });
    if (d) B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.3, 'stroke-linecap': 'round' }, B.dyn));

    // 两条轴
    [[v1, '#ffd166'], [v2, '#c084fc']].forEach(([v, col]) => {
      B.seg(sp2(v[0] * 2.6, v[1] * 2.6), sp2(-v[0] * 2.6, -v[1] * 2.6), { stroke: col, 'stroke-width': 1.2, 'stroke-dasharray': '6 5', 'stroke-opacity': .55 });
    });
    B.dot(sp2(0, 0), 3.2, { fill: '#aebdd2' });
    if (kind === 'empty') B.textM(V(m2.px(0) - 62, m2.py(1.55)), '没有实数曲线', { 'font-size': 13, fill: '#ff7b8a' });

    // 下方说明
    const name = { ellipse: '椭圆', hyperbola: '双曲线', degen2: '两条平行直线', empty: '空集' }[kind];
    B.textM(V(30, 388), `$\\lambda_1\\lambda_2=${fmt(st.l1 * st.l2, 2)}$，$\\lambda_1+\\lambda_2=${fmt(st.l1 + st.l2, 2)}$`, { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(30, 410), kind === 'ellipse' ? '乘积为正、和为正：两项都取正号，等号右边才凑得出来'
      : kind === 'hyperbola' ? '乘积为负：一项为正一项为负，沿一条轴放大、沿另一条轴翻转'
        : kind === 'degen2' ? '有一个特征值为零：二次型只含一个方向，等值线退成一对平行线'
          : '两项都取负（或全零）：左边非正，永远等不到正的常数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(420, 388), '判断顺序：先看乘积', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(420, 410), '正 → 椭圆或空集，再看和；负 → 双曲线', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    cE(`$(${fmt(st.l1, 2)},\\ ${fmt(st.l2, 2)})$`);
    cD(`$${fmt(st.l1 * st.l2, 2)},\\ ${fmt(st.l1 + st.l2, 2)}$`);
    cT(name, kind === 'ellipse' || kind === 'hyperbola' ? 'ok' : 'warn');
    cJ(kind === 'ellipse' ? '两个 λ 同正：正定二次型，等值线闭合成椭圆'
      : kind === 'hyperbola' ? '两个 λ 异号：不定，等值线是两支，沿负号那条轴张开'
        : kind === 'degen2' ? '零特征值：降维，二次型只在一条方向上变化'
          : '负定或零型：左边取不到正值，方程没有实数解');
  };

  B.handle({
    color: '#ffd166', r: 7,
    get: () => V(m1.px(st.l1), m1.py(st.l2)),
    set: p => {
      let x = (p.x - m1.px(0)) / m1.s, y = (m1.py(0) - p.y) / m1.s;
      x = Math.max(-2.15, Math.min(2.15, x));
      y = Math.max(-2.15, Math.min(2.15, y));
      st.l1 = Math.abs(x) < .18 ? 0 : x;
      st.l2 = Math.abs(y) < .18 ? 0 : y;
    },
  });

  const PRE = [
    { nm: '① 椭圆', v: [1.6, .7] },
    { nm: '② 双曲线', v: [1.4, -.9] },
    { nm: '③ 空集', v: [-1.2, -1.5] },
    { nm: '④ 退化', v: [1.5, 0] },
  ];
  const pre = PRE.map((p, i) => B.btnM(p.nm, () => {
    st.l1 = p.v[0]; st.l2 = p.v[1];
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }));

  B.hint('拖动左栏的点：两个特征值的符号一改，曲线的类型就换');
  B.render();
  return B;
}
