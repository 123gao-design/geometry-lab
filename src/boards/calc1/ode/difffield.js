/* 图 方1 · 方向场机：每一点画一小段切线，解就是顺着这些短段走出来的曲线
   三组预设：y'=y（解是指数）、y'=−x/y（解是圆）、y'=x−y（解全部汇向一条直线 y=x−1）。
   起点 (x₀,y₀) 由两个滑块给，用四阶龙格-库塔往左右各走一段。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = [
  { t: "① $y'=y$", f: () => 0, g: (x, y) => y, xr: [-2.4, 2.4], yr: [-2.4, 3.4], xt: [-2, 2], yt: [-2, 2] },
  { t: "② $y'=-x/y$", f: () => 0, g: (x, y) => (Math.abs(y) < 1e-3 ? 0 : -x / y), xr: [-3, 3], yr: [-3, 3], xt: [-2, 2], yt: [-2, 2] },
  { t: "③ $y'=x-y$", f: () => 0, g: (x, y) => x - y, xr: [-2.4, 3.4], yr: [-2.4, 3.4], xt: [-2, 0, 2], yt: [-2, 2] },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x0: -0.6, y0: 1.4 };
  const cS = B.chipM('方向'), cC = B.chipM('过点'), cJ = B.chipM('判读');

  // 四阶龙格-库塔，dir=+1 向右、−1 向左
  const trace = (g, x0, y0, dir, xr, yr) => {
    const pts = [[x0, y0]];
    let x = x0, y = y0, h = dir * 0.02;
    for (let i = 0; i < 260; i++) {
      const k1 = g(x, y), k2 = g(x + h / 2, y + h * k1 / 2);
      const k3 = g(x + h / 2, y + h * k2 / 2), k4 = g(x + h, y + h * k3);
      y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += h;
      if (!isFinite(y) || y < yr[0] - 1 || y > yr[1] + 1 || x < xr[0] - .5 || x > xr[1] + .5) break;
      pts.push([x, y]);
    }
    return pts;
  };

  B.renderFn = () => {
    const S = F[st.k], g = S.g;
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    // 方向场：每个格点一小段，斜率按 y' 画
    for (let x = Math.ceil(S.xr[0]); x <= S.xr[1]; x += 0.5) {
      for (let y = Math.ceil(S.yr[0]); y <= S.yr[1]; y += 0.5) {
        const k = g(x, y);
        if (!isFinite(k)) continue;
        const L = 12, dx = L / Math.sqrt(1 + k * k), dy = k * dx;
        B.seg(V(m.px(x) - dx, m.py(y) + dy), V(m.px(x) + dx, m.py(y) - dy), { stroke: '#4a5a70', 'stroke-width': 1.1 });
      }
    }
    // 从起点向两侧各走一条
    const path = pts => {
      if (pts.length < 2) return '';
      return pts.map((p, i) => (i ? 'L' : 'M') + m.px(p[0]).toFixed(1) + ' ' + m.py(p[1]).toFixed(1) + ' ').join('');
    };
    const right = trace(g, st.x0, st.y0, 1, S.xr, S.yr), left = trace(g, st.x0, st.y0, -1, S.xr, S.yr);
    mk('path', { d: path(left.reverse().concat(right)), fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.dot(V(m.px(st.x0), m.py(st.y0)), 5.4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(m.px(st.x0) + 8, m.py(st.y0) - 12), `$(${fmt(st.x0, 2)},${fmt(st.y0, 2)})$`, { size: 11, anchor: 'start', color: '#ffd166' });

    const k = g(st.x0, st.y0);
    B.textM(V(636, 84), '每一点的斜率由方程给出', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), `$y'=f(x,y)$`, { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 164), `$f(${fmt(st.x0, 2)},${fmt(st.y0, 2)})=${fmt(k, 3)}$`, { size: 12, color: '#5cadff', anchor: 'start' });
    B.textM(V(636, 206), '一条解曲线 = 处处与短段相切的曲线', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 248), `$y(x_0)=${fmt(st.y0, 2)}$`, { size: 12, color: '#ffd166', anchor: 'start' });
    B.textM(V(636, 290), st.k === 2 ? '所有解都汇向直线 y=x−1' : st.k === 1 ? '解是绕原点的一族圆' : '解是指数曲线', { 'font-size': 11.5, fill: '#6b7c93', 'text-anchor': 'start' });

    cS(`$=${fmt(k, 3)}$`);
    cC(`$(${fmt(st.x0, 2)},${fmt(st.y0, 2)})$`);
    cJ('拖动起点：曲线换一条，但它仍然处处与方向场的短段相切 —— 通解就是这一整族曲线');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('x₀ =', -2, 2.4, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.slider('y₀ =', -2, 3, 0.01, st.y0, v => { st.y0 = v; B.render(); }, 'y0');
  B.hintM('方向场给出每一点的走向，过起点顺着走出来的那条曲线就是特解');
  B.render();
  return B;
}
