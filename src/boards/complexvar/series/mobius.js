/* 图 级4 · 保角映射机
   左图 z 平面：以原点为心的同心圆与过原点的射线，两族曲线处处正交；
   点 z 可拖，两枚小箭头是圆与射线的切线方向。
   右图 w 平面：这些曲线在映射 w=f(z) 下的像——夹角在像里是否照样是直角，就是保角的含义。
   三个预设：① w=z²（原点处导数为零，角度加倍）② w=e^z（导数处处非零）
             ③ w=(z−1)/(z+1)（分式线性变换，圆仍映成圆）。 */
import { Board, V, fmt, mk, TAU, angDiff } from '../../../lib/board.js';

const P = [
  { n: '① $w=z^2$', crit: [[0, 0]], sing: [],
    f: (x, y) => [x * x - y * y, 2 * x * y],
    v: '原点处 $f\'(0)=0$，两条线的夹角被放大一倍；别处仍然是直角' },
  { n: '② $w=e^z$', crit: [], sing: [],
    f: (x, y) => { const e = Math.exp(x); return [e * Math.cos(y), e * Math.sin(y)]; },
    v: '$f\'=e^z$ 处处非零：圆映成圆、射线映成射线，夹角原样保留' },
  { n: '③ $w=\\dfrac{z-1}{z+1}$', crit: [], sing: [[-1, 0]],
    f: (x, y) => { const d = (x + 1) * (x + 1) + y * y || 1e-9; return [(x * x - 1 + y * y) / d, 2 * y / d]; },
    v: '分式线性变换把圆映成圆或直线，处处保角；$z=-1$ 是它的极点' },
];

const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1] || 1e-12; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, z: [0.8, 0.5] };
  const mL = B.isoFit(-2.4, 2.4, -2.0, 2.0, [26, 16, 340, 392], 22);
  const mR = B.isoFit(-3.6, 3.6, -2.8, 2.8, [402, 16, 396, 392], 20);
  const cW = B.chipM('$f(z)$'), cD = B.chipM('$f\'(z)$'), cA = B.chipM('原像夹角'), cB = B.chipM('像夹角'), cJ = B.chipM('判读');
  const RS = [0.7, 1.3], ANG = [0, 45, 90, 135, 180, 225, 270, 315];

  // 把一条 z 平面曲线（点列）映到 w 平面并画出来；越界或经过极点就断开
  function drawImage(S, pts, color, dash) {
    let d = '', on = false;
    for (const p of pts) {
      const w = S.f(p[0], p[1]);
      if (!isFinite(w[0]) || !isFinite(w[1]) || Math.hypot(w[0], w[1]) > 60) { on = false; continue; }
      d += (on ? 'L' : 'M') + mR.px(w[0]).toFixed(1) + ' ' + mR.py(w[1]).toFixed(1) + ' ';
      on = true;
    }
    if (d) B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: color, 'stroke-width': 1.9, ...(dash ? { 'stroke-dasharray': dash } : {}) }, B.dyn));
  }

  B.renderFn = () => {
    const S = P[st.k];
    B.grid({ ...mL, sx: 1, sy: 1, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });
    B.grid({ ...mR, sx: 1, sy: 1, lx: 1, ly: 1, axLab: 'u', ayLab: 'v' });

    // 左图：同心圆 + 射线
    const O = V(mL.px(0), mL.py(0));
    for (const r of RS) {
      B.dyn.appendChild(mk('circle', { cx: O.x, cy: O.y, r: r * mL.s, fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-opacity': 0.8 }, B.dyn));
      drawImage(S, Array.from({ length: 181 }, (_, i) => [r * Math.cos(i / 180 * TAU), r * Math.sin(i / 180 * TAU)]), '#67e8f9');
    }
    for (const ad of ANG) {
      const a = ad * Math.PI / 180;
      const e = V(mL.px(2.15 * Math.cos(a)), mL.py(2.15 * Math.sin(a)));
      B.seg(O, e, { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-opacity': 0.55 });
      drawImage(S, Array.from({ length: 61 }, (_, i) => [0.06 * i * Math.cos(a), 0.06 * i * Math.sin(a)]), '#ffd166', '5 4');
    }
    for (const [sx, sy] of S.sing) {
      const sp = V(mL.px(sx), mL.py(sy));
      B.dot(sp, 4.5, { fill: '#ff6b6b', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(sp.x + 8, sp.y - 9), '$' + (sx === -1 ? '-1' : '0') + '$', { size: 11.5, color: '#ff6b6b', w: 34 });
    }
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), '$z$ 平面：同心圆与射线', { size: 12, color: '#93a1b5', w: 200 });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 14), '$w$ 平面：像曲线', { size: 12, color: '#93a1b5', w: 170 });

    // 点 z、切线方向与它的像
    const z = st.z, h = 8e-4;
    const fz = S.f(z[0], z[1]);
    const fp = cdiv(csub(S.f(z[0] + h, z[1]), S.f(z[0] - h, z[1])), [2 * h, 0]);
    const rz = Math.hypot(z[0], z[1]) || 1e-9;
    const rad = [z[0] / rz, z[1] / rz];          // 沿射线方向
    const tan = [-rad[1], rad[0]];               // 圆的切线方向（逆时针）
    const Z = V(mL.px(z[0]), mL.py(z[1]));
    B.dot(Z, 6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(Z.x + 13, Z.y - 10), '$z$', { size: 13, color: '#ff9e4a', w: 24 });
    const U = 46 / mL.s;
    B.arrow(Z, V(mL.px(z[0] + rad[0] * U), mL.py(z[1] + rad[1] * U)), { stroke: '#ffd166', 'stroke-width': 2, head: 10, wide: 4.5 });
    B.arrow(Z, V(mL.px(z[0] + tan[0] * U), mL.py(z[1] + tan[1] * U)), { stroke: '#67e8f9', 'stroke-width': 2, head: 10, wide: 4.5 });

    const Wp = V(mR.px(fz[0]), mR.py(fz[1]));
    const mag = Math.hypot(fp[0], fp[1]);
    B.dot(Wp, 6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(Wp.x + 13, Wp.y - 10), '$w$', { size: 13, color: '#ff9e4a', w: 26 });
    const a0 = cmul(fp, rad), a1 = cmul(fp, tan);
    const n0 = Math.hypot(a0[0], a0[1]), n1 = Math.hypot(a1[0], a1[1]);
    const ok = mag > 1e-6 && n0 > 1e-9 && n1 > 1e-9;
    if (ok) {
      const V0 = 46 / mR.s;
      const p0 = V(mR.px(fz[0] + a0[0] / n0 * V0), mR.py(fz[1] + a0[1] / n0 * V0));
      const p1 = V(mR.px(fz[0] + a1[0] / n1 * V0), mR.py(fz[1] + a1[1] / n1 * V0));
      B.arrow(Wp, p0, { stroke: '#ffd166', 'stroke-width': 2, head: 10, wide: 4.5 });
      B.arrow(Wp, p1, { stroke: '#67e8f9', 'stroke-width': 2, head: 10, wide: 4.5 });
    }
    // 原像的夹角恒为 90°（圆与射线正交）；像的夹角由两支像向量算
    let angImg = NaN;
    if (ok) {
      const d0 = Math.atan2(a0[1], a0[0]), d1 = Math.atan2(a1[1], a1[0]);
      angImg = Math.abs(angDiff(d0, d1)) * 180 / Math.PI;
      if (angImg > 90) angImg = 180 - angImg;
    }

    cW(`$${fmt(fz[0], 3)}${fz[1] < 0 ? '-' : '+'}${fmt(Math.abs(fz[1]), 3)}i$`, '');
    cD(`$${fmt(mag, 2)}$`, mag < 1e-6 ? 'warn' : '');
    cA('$90.0^\\circ$', '');
    cB(isFinite(angImg) ? `$${fmt(angImg, 1)}^\\circ$` : '—', isFinite(angImg) && Math.abs(angImg - 90) < 0.5 ? 'ok' : 'warn');
    cJ(mag < 1e-6 ? '导数为零：夹角不再保持' : '导数非零：两条线的夹角原样保留', mag < 1e-6 ? 'bad' : 'good');
    B.hintM(S.v);
  };

  B.handle({
    get: () => V(mL.px(st.z[0]), mL.py(st.z[1])),
    set: p => { st.z = [(p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s]; },
    clamp: p => {
      let x = Math.max(mL.px(-2.2), Math.min(mL.px(2.2), p.x)), y = Math.max(mL.py(1.8), Math.min(mL.py(-1.8), p.y));
      let xx = (x - mL.px(0)) / mL.s, yy = (mL.py(0) - y) / mL.s;
      if (st.k === 2) {                      // 分式线性变换：避开极点 z=−1
        const d = Math.hypot(xx + 1, yy);
        if (d < 0.22) { const s = 0.22 / (d || 1e-9); xx = -1 + (xx + 1) * s; yy = yy * s; }
        x = mL.px(xx); y = mL.py(yy);
      }
      return V(x, y);
    },
    color: '#ff9e4a', r: 8,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.render();
  return B;
}
