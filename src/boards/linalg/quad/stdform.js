/* 图 型2 · 转轴化标准形
   交叉项 bxy 的存在意味着两条轴不在坐标轴上。转过一个角度 θ 之后，交叉项消失，
   方程变成 λ₁x'² + λ₂y'² = 1，半轴由 1/√λ 给出。
   这个角度就是二次型矩阵的特征方向与 x 轴的夹角——对角化在坐标层面上的样子。 */
import { Board, V, mk, fmt, marchSegs } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { a: 1, b: 1.2, c: 1.4 };
  const PRE = [
    { nm: '① 斜椭圆', v: [1, 1.2, 1.4] },
    { nm: '② 斜双曲线', v: [1, 1, -1] },
    { nm: '③ 轴已对齐', v: [2, 0, .5] },
    { nm: '④ 圆', v: [1, 0, 1] },
  ];
  const m = B.isoFit(-3.1, 3.1, -2.6, 2.6, [36, 40, 460, 386], 0);
  const cQ = B.chipM('转轴角'), cS = B.chipM('标准形'), cA = B.chipM('半轴'), cJ = B.chipM('判读');
  const SP = (x, y) => V(m.px(x), m.py(y));

  const form = (x, y) => st.a * x * x + st.b * x * y + st.c * y * y - 1;

  const eig = () => {
    const tr = st.a + st.c;
    const disc = (st.a - st.c) * (st.a - st.c) + st.b * st.b;
    const sq = Math.sqrt(disc);
    const l1 = (tr + sq) / 2, l2 = (tr - sq) / 2;
    const v = l => {
      let x = st.b / 2, y = l - st.a;
      if (Math.hypot(x, y) < 1e-9) { x = l - st.c; y = st.b / 2; }
      if (Math.hypot(x, y) < 1e-9) return Math.abs(l - st.a) < 1e-9 ? [1, 0] : [0, 1];
      const n = Math.hypot(x, y); return [x / n, y / n];
    };
    let v1 = v(l1);
    if (v1[0] < -1e-9 || (Math.abs(v1[0]) < 1e-9 && v1[1] < 0)) v1 = [-v1[0], -v1[1]];
    const v2 = [-v1[1], v1[0]];
    return { tr, l1, l2, v1, v2, th: Math.atan2(v1[1], v1[0]) };
  };

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, grid: true, labs: true });
    const E = eig();
    const circum = Math.abs(st.a - st.c) < 1e-6 && Math.abs(st.b) < 1e-6;

    // 曲线
    const segs = marchSegs(form, -3.1, -2.6, 3.1, 2.6, 132, 110);
    let d = '';
    segs.forEach(([p, q]) => {
      d += `M${m.px(p.x).toFixed(1)},${m.py(p.y).toFixed(1)}L${m.px(q.x).toFixed(1)},${m.py(q.y).toFixed(1)}`;
    });
    if (d) B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.3, 'stroke-linecap': 'round' }, B.dyn));

    // 新坐标轴：x' 沿特征方向 v1，y' 沿 v2
    const O = SP(0, 0);
    const off = (v, L) => SP(v[0] * L, v[1] * L);
    B.arrow(O, off(E.v1, 2.7), { stroke: '#ffd166', 'stroke-width': 1.9, head: 10, wide: 5 });
    B.arrow(O, off(E.v2, 2.7), { stroke: '#67e8f9', 'stroke-width': 1.9, head: 10, wide: 5 });
    B.tex(off(E.v1, 2.86), `$x'$`, { size: 13, anchor: 'mid', color: '#ffd166' });
    B.tex(off(E.v2, 2.86), `$y'$`, { size: 13, anchor: 'mid', color: '#67e8f9' });

    // 半轴端点
    if (E.l1 > 1e-6) {
      const t = 1 / Math.sqrt(E.l1);
      B.dot(SP(E.v1[0] * t, E.v1[1] * t), 4.6, { fill: '#ffd166' });
      B.dot(SP(-E.v1[0] * t, -E.v1[1] * t), 4.6, { fill: '#ffd166' });
    }
    if (E.l2 > 1e-6) {
      const t = 1 / Math.sqrt(E.l2);
      B.dot(SP(E.v2[0] * t, E.v2[1] * t), 4.6, { fill: '#67e8f9' });
      B.dot(SP(-E.v2[0] * t, -E.v2[1] * t), 4.6, { fill: '#67e8f9' });
    }
    B.dot(O, 3.2, { fill: '#aebdd2' });

    // 转轴角弧
    const rr = 46;
    let arc = '';
    const th = E.th;
    for (let i = 0; i <= 24; i++) {
      const t = th * i / 24;
      const p = V(O.x + rr * Math.cos(t), O.y - rr * Math.sin(t));
      arc += `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    if (Math.abs(th) > .02) B.dyn.appendChild(mk('path', { d: arc, fill: 'none', stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-opacity': .9 }, B.dyn));

    // 右栏
    const X = 528;
    const deg = th * 180 / Math.PI;
    B.textM(V(X, 66), `$\\theta=${fmt(deg, 1)}^\\circ$`, { 'font-size': 15, fill: '#ff9e4a', 'text-anchor': 'start' });
    B.textM(V(X, 92), `$\\tan 2\\theta=\\dfrac{b}{a-c}=${fmt(Math.abs(st.a - st.c) < 1e-6 ? 0 : st.b / (st.a - st.c), 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 128), `$\\lambda_1=${fmt(E.l1, 2)}$`, { 'font-size': 12.5, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 150), `$\\lambda_2=${fmt(E.l2, 2)}$`, { 'font-size': 12.5, fill: '#67e8f9', 'text-anchor': 'start' });
    B.textM(V(X, 186), `$\\lambda_1x'^2+\\lambda_2y'^2=1$`, { 'font-size': 13, fill: '#aebdd2', 'text-anchor': 'start' });

    if (E.l1 > 1e-6 && E.l2 > 1e-6) {
      const A1 = 1 / Math.sqrt(E.l1), B1 = 1 / Math.sqrt(E.l2);
      B.textM(V(X, 218), `$\\dfrac{x'^2}{${fmt(A1 * A1, 2)}}+\\dfrac{y'^2}{${fmt(B1 * B1, 2)}}=1$`, { 'font-size': 12.5, fill: '#5cadff', 'text-anchor': 'start' });
      B.textM(V(X, 258), `半轴 $${fmt(A1, 2)}$ 与 $${fmt(B1, 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    } else if (E.l1 * E.l2 < -1e-9) {
      const pos = E.l1 > 0 ? E.l1 : E.l2;
      const neg = E.l1 > 0 ? E.l2 : E.l1;
      B.textM(V(X, 218), `$\\dfrac{x'^2}{${fmt(1 / pos, 2)}}-\\dfrac{y'^2}{${fmt(1 / Math.abs(neg), 2)}}=1$`, { 'font-size': 12.5, fill: '#4ade80', 'text-anchor': 'start' });
      B.textM(V(X, 258), `实半轴 $${fmt(1 / Math.sqrt(pos), 2)}$，虚半轴 $${fmt(1 / Math.sqrt(Math.abs(neg)), 2)}$`, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    } else {
      B.textM(V(X, 218), '出现零特征值：标准形缺一项', { 'font-size': 12, fill: '#ff7b8a', 'text-anchor': 'start' });
    }

    B.textM(V(X, 300), circum ? '两轴等长：圆没有唯一的转轴角' : `转轴把交叉项 ${fmt(st.b, 1)}$xy$ 消掉`, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 322), '新轴就是两条特征方向', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cQ(circum ? '不确定' : `$${fmt(deg, 1)}^\\circ$`);
    cS(`$\\lambda_1x'^2+\\lambda_2y'^2=1$`);
    cA(E.l1 > 1e-6 && E.l2 > 1e-6 ? `$${fmt(1 / Math.sqrt(E.l1), 2)},\\ ${fmt(1 / Math.sqrt(E.l2), 2)}$` : '—');
    cJ(circum ? '两特征值相等：任何方向都合格，标准形已经是 x²+y²=1/λ'
      : Math.abs(deg) < .5 ? '原本就没有交叉项：两条轴已对齐坐标轴，θ=0'
        : E.l1 * E.l2 < 0 ? '异号：标准形是双曲线，一条实轴一条虚轴'
          : '同号：转过 θ 后交叉项消失，剩下的两项各自管一条轴');
  };

  const pre = PRE.map((p, i) => B.btnM(p.nm, () => {
    [st.a, st.b, st.c] = p.v;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    sliders.forEach((s, j) => s.sync(p.v[j]));
    B.render();
  }));

  const sliders = [
    B.slider('a', -2, 2, .1, st.a, v => { st.a = v; B.render(); }, 'a'),
    B.slider('b', -2, 2, .1, st.b, v => { st.b = v; B.render(); }, 'b'),
    B.slider('c', -2, 2, .1, st.c, v => { st.c = v; B.render(); }, 'c'),
  ];

  B.hint('金色 x′ 轴就是 λ₁ 的特征方向：转过去，交叉项消失');
  B.render();
  return B;
}
