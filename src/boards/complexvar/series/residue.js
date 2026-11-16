/* 图 级3 · 留数定理机
   左图 z 平面：金色圆路（圆心 c 可拖、半径 ρ 可调），红点是函数的奇点——
   圈内的亮红并标出留数，圈外的灰掉。右栏四个读数：
   圈内留数之和、2πi 乘留数和、沿圆路数值积分的结果，三者的差。
   三个预设：① 1/(z²+1) ② 1/(z(z−2)) ③ z/(z²+1)。 */
import { Board, V, fmt, mk, TAU } from '../../../lib/board.js';

const P = [
  { n: '① $\\dfrac1{z^2+1}$',
    poles: [[0, 1], [0, -1]], res: [[-0, -0.5], [0, 0.5]],
    f: (x, y) => { const a = 1 + x * x - y * y, b = 2 * x * y, d = a * a + b * b || 1e-12; return [a / d, -b / d]; },
    v: '两个奇点的留数一正一负，同时圈住就相互抵消，积分归零' },
  { n: '② $\\dfrac1{z(z-2)}$',
    poles: [[0, 0], [2, 0]], res: [[-0.5, 0], [0.5, 0]],
    f: (x, y) => { const a = x * (x - 2) - y * y, b = 2 * x * y - 2 * y, d = a * a + b * b || 1e-12; return [a / d, -b / d]; },
    v: '圆只圈住 $z=0$：留数和是 $-\\dfrac12$，积分就是 $-\\pi i$；把半径拉过 $z=2$，两份又抵消' },
  { n: '③ $\\dfrac{z}{z^2+1}$',
    poles: [[0, 1], [0, -1]], res: [[0.5, 0], [0.5, 0]],
    f: (x, y) => { const a = 1 + x * x - y * y, b = 2 * x * y, d = a * a + b * b || 1e-12; return [(x * a + y * b) / d, (y * a - x * b) / d]; },
    v: '两个留数都是 $\\dfrac12$，圈住两个就相加，积分等于 $2\\pi i$' },
];

const cn = (a, b, n = 3) => {
  const A = Math.abs(a) < 5e-4 ? 0 : a, B = Math.abs(b) < 5e-4 ? 0 : b;
  const bs = Math.abs(B) === 1 ? '' : fmt(Math.abs(B), n);
  if (B === 0) return fmt(A, n);
  if (A === 0) return (B < 0 ? '-' : '') + bs + 'i';
  return fmt(A, n) + (B < 0 ? '-' : '+') + bs + 'i';
};

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, R: 1.2, c: [0, 0] };
  const mL = B.isoFit(-3.0, 3.0, -2.2, 2.2, [26, 16, 340, 392], 22);
  const cP = B.chipM('圈内奇点'), cS = B.chipM('留数和'), cT = B.chipM('$2\\pi i\\sum$'), cN = B.chipM('数值积分'), cJ = B.chipM('判读');
  const N = 480;

  function contour(F) {
    const R = st.R, x0 = st.c[0], y0 = st.c[1], h = TAU / N;
    let re = 0, im = 0;
    for (let i = 0; i < N; i++) {
      const b = (i + 1) / N * TAU, a = b - h / 2, p = b - h;
      const xa = x0 + R * Math.cos(a), ya = y0 + R * Math.sin(a);
      const dx = x0 + R * Math.cos(b) - (x0 + R * Math.cos(p)), dy = y0 + R * Math.sin(b) - (y0 + R * Math.sin(p));
      const fv = F(xa, ya);
      re += fv[0] * dx - fv[1] * dy;
      im += fv[0] * dy + fv[1] * dx;
    }
    return [re, im];
  }

  B.renderFn = () => {
    const S = P[st.k];
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    const C = V(mL.px(st.c[0]), mL.py(st.c[1])), rr = st.R * mL.s;
    B.dyn.appendChild(mk('circle', { cx: C.x, cy: C.y, r: rr, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn));
    const tip = V(C.x + rr * Math.cos(-0.35), C.y + rr * Math.sin(-0.35));
    B.arrow(V(tip.x + 14, tip.y - 6), tip, { stroke: '#ffd166', 'stroke-width': 2.2 });
    B.tex(V(C.x + 12, C.y + 18), '$C$', { size: 12.5, color: '#ffd166', w: 24 });

    let sr = 0, si = 0, names = [];
    S.poles.forEach((p, i) => {
      const dd = Math.hypot(p[0] - st.c[0], p[1] - st.c[1]);
      const inside = dd < st.R - 1e-9;
      const sp = V(mL.px(p[0]), mL.py(p[1]));
      B.dot(sp, inside ? 5.5 : 4, { fill: inside ? '#ff6b6b' : '#5a6474', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(sp.x + 8, sp.y - 11), `$z_${i + 1}$`, { size: 11.5, color: inside ? '#ff6b6b' : '#5a6474', w: 30 });
      if (inside) {
        sr += S.res[i][0]; si += S.res[i][1];
        names.push(`$z_${i + 1}$`);
        B.tex(V(sp.x + 22, sp.y + 8), `$\\mathrm{Res}=${cn(S.res[i][0], S.res[i][1], 2)}$`, { size: 11, color: '#ff9e4a', w: 150 });
      }
    });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), '$z$ 平面：圆路与它圈住的奇点', { size: 12, color: '#93a1b5', w: 250 });

    // 右栏：留数和与积分值
    const iv = contour(S.f);
    const th = [-2 * Math.PI * si, 2 * Math.PI * sr];
    const L = 430, T = 60, Wd = 350;
    const rows = [
      ['圈内奇点', names.length ? names.join('，') + `（${names.length} 个）` : '无', '#93a1b5'],
      ['留数之和', `$${cn(sr, si)}$`, '#ff9e4a'],
      ['$2\\pi i\\sum\\mathrm{Res}$', `$${cn(th[0], th[1])}$`, '#ffd166'],
      ['沿圆路积分', `$${cn(iv[0], iv[1])}$`, '#67e8f9'],
      ['两者之差', `$${fmt(Math.hypot(iv[0] - th[0], iv[1] - th[1]), 3)}$`, '#93a1b5'],
    ];
    rows.forEach((r, i) => {
      const y = T + i * 52;
      B.dyn.appendChild(mk('rect', { x: L, y: y - 18, width: Wd, height: 40, rx: 9, fill: '#93a1b5', 'fill-opacity': 0.08 }, B.dyn));
      B.tex(V(L + 14, y + 2), r[0], { size: 12.5, color: '#93a1b5', w: 140 });
      B.tex(V(L + 170, y + 2), r[1], { size: 13.5, color: r[2], w: 170 });
    });
    B.tex(V(L + 2, T - 34), '留数定理：$\\displaystyle\\oint_C f\\,dz=2\\pi i\\sum\\mathrm{Res}$', { size: 12.5, color: '#93a1b5', w: 340 });

    cP(names.length ? names.join('，') + `（${names.length} 个）` : '无', names.length ? '' : 'warn');
    cS(`$${cn(sr, si)}$`, '');
    cT(`$${cn(th[0], th[1])}$`, '');
    cN(`$${cn(iv[0], iv[1])}$`, 'ok');
    cJ(names.length ? '圈内有奇点：积分等于留数之和乘 $2\\pi i$' : '圈内没有奇点：积分为 $0$', names.length ? 'good' : 'warn');
    B.hintM(S.v);
  };

  B.handle({
    get: () => V(mL.px(st.c[0]), mL.py(st.c[1])),
    set: p => { st.c = [(p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s]; },
    clamp: p => V(Math.max(mL.px(-2.8), Math.min(mL.px(2.8), p.x)), Math.max(mL.py(2.0), Math.min(mL.py(-2.0), p.y))),
    color: '#ffd166', r: 7,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('半径 ρ', 0.4, 3.2, 0.05, st.R, v => { st.R = v; B.render(); }, 'R');

  B.render();
  return B;
}
