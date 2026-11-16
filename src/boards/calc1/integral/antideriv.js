/* 图 积1 · 原函数族机：同一族曲线只差一个常数
   蓝线是 f，橙色一族是各个原函数 F+C（C 由滑块给，其余几条淡着作陪衬）。
   在 x₀ 处画一族里每条曲线的切线：斜率全都等于 f(x₀)，所以曲线形状相同、上下平移。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  { t: '① $f=2x$', f: x => 2 * x, F: x => x * x, fname: '2x', name: 'x^2+C', xr: [-2.4, 2.4], yr: [-3.4, 5.6] },
  { t: '② $f=\\cos x$', f: Math.cos, F: Math.sin, fname: '\\cos x', name: '\\sin x+C', xr: [-0.6, 6.4], yr: [-2.6, 2.6] },
  { t: '③ $f=1/x$', f: x => 1 / x, F: x => Math.log(x), fname: '1/x', name: '\\ln x+C', xr: [0.12, 3.4], yr: [-1.8, 2.4] },
  { t: '④ $f=\\mathrm{e}^x$', f: Math.exp, F: Math.exp, fname: '\\mathrm{e}^x', name: '\\mathrm{e}^x+C', xr: [-1.4, 2.1], yr: [-1.4, 5.4] },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, C: 0, x0: 1.0 };
  const cF = B.chipM('原函数'), cD = B.chipM('导数'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], C = st.C, x0 = st.x0;
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 2, ly: 2 });
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.2, anchors: [x0] });

    // 陪衬的几条原函数，让「一族」看得出来
    [-2, -1, 1, 2].forEach(dc => B.plot(x => S.F(x) + C + dc, m,
      { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-opacity': .22 }));
    B.plot(x => S.F(x) + C, m, { stroke: '#ff9e4a', 'stroke-width': 2.4, anchors: [x0] });

    const y0 = S.F(x0) + C, k = S.f(x0);
    const px0 = m.px(x0), py0 = m.py(y0);
    B.dot(V(px0, py0), 5.4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    // 切线：斜率正是 f(x₀)
    const half = 0.55;
    B.seg(V(m.px(x0 - half), m.py(y0 - k * half)), V(m.px(x0 + half), m.py(y0 + k * half)),
      { stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-dasharray': '7 4' });
    B.tex(V(px0 - 12, py0 + 20), `$F(x_0)+C$`, { size: 12, anchor: 'end', color: '#ffd166' });
    B.tex(V(m.px(x0) + 10, m.py(S.f(x0)) - 10), `$f(x_0)$`, { size: 12, anchor: 'start', color: '#5cadff' });
    B.dot(V(m.px(x0), m.py(S.f(x0))), 4.4, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.2 });
    // 同一竖线上的间隔就是常数差：只在看得见的时候标
    const gap = Math.min(2, Math.max(0.6, (S.yr[1] - S.yr[0]) * 0.18));
    B.seg(V(m.px(x0) - 16, m.py(y0 + 0.35)), V(m.px(x0) - 16, m.py(y0 + 0.35 + gap)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
    B.tex(V(m.px(x0) - 24, m.py(y0 + 0.35 + gap / 2) + 4), `$C$`, { size: 11.5, anchor: 'end', color: '#93a1b5' });

    B.textM(V(636, 84), '求导与求原函数互为逆运算', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), `$f(x)=${S.fname}$`, { size: 13, color: '#5cadff', anchor: 'start' });
    B.tex(V(636, 160), `$F(x)=${S.name}$`, { size: 13, color: '#ff9e4a', anchor: 'start' });
    B.tex(V(636, 200), `$F'(x)=f(x)$`, { size: 12.5, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 236), `$\\int f(x)\\,\\mathrm{d}x=F(x)+C$`, { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 286), `$x_0=${fmt(x0, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.tex(V(636, 316), `$\\varphi(x_0)=${fmt(y0, 3)}$`, { size: 12, color: '#ff9e4a', anchor: 'start' });
    B.tex(V(636, 346), `$f(x_0)=${fmt(k, 3)}$`, { size: 12, color: '#5cadff', anchor: 'start' });

    cF(`$=${fmt(y0, 3)}$`);
    cD(`$=${fmt(k, 3)}$`);
    cJ('蓝色的高度就是橙线的斜率：原函数族形状一致，只差一个常数 $C$');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('C =', -3, 3, 0.05, st.C, v => { st.C = v; B.render(); }, 'C');
  B.slider('x₀ =', 0.3, 2.8, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.hintM('拖动 $C$：整族曲线一起上下平移，切线斜率不变 —— 原函数有无数个，就差这个常数');
  B.render();
  return B;
}
