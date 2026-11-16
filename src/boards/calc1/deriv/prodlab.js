/* 图 微2a · 乘积法则机：把 (ab) 看成矩形面积
   边长 a、b 各伸长 Δa=Δb=t，面积增量是三块：右条 b·t、上条 a·t、角上 t²。
   于是 Δ(ab)=a·t+b·t+t²，同除 t 得 a+b+t；t→0 时角上那块先消失，只剩 a+b。
   版面：左方块图 40..400 × 90..400，右栏公式 440 起；a、b、t 三枚滑块。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 2.4, b: 1.8, t: 0.5 };
  const cA = B.chipM('矩形面积'), cI = B.chipM('面积增量'), cQ = B.chipM('差商'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const { a, b, t } = st;
    const s = 62, ox = 84, oy = 390;
    const X = u => ox + u * s, Y = v => oy - v * s;

    // 四块：原矩形 ab、右条 b·t、上条 a·t、角上 t²
    mk('rect', { x: X(0), y: Y(b), width: a * s, height: b * s, fill: '#5cadff', 'fill-opacity': .32, stroke: '#5cadff', 'stroke-width': 1.4 }, B.dyn);
    mk('rect', { x: X(a), y: Y(b), width: t * s, height: b * s, fill: '#ffd166', 'fill-opacity': .38, stroke: '#ffd166', 'stroke-width': 1.2 }, B.dyn);
    mk('rect', { x: X(0), y: Y(b + t), width: a * s, height: t * s, fill: '#4ade80', 'fill-opacity': .34, stroke: '#4ade80', 'stroke-width': 1.2 }, B.dyn);
    mk('rect', { x: X(a), y: Y(b + t), width: t * s, height: t * s, fill: '#c084fc', 'fill-opacity': .42, stroke: '#c084fc', 'stroke-width': 1.2 }, B.dyn);

    // 尺寸标注
    B.seg(V(X(0), Y(0)), V(X(a + t), Y(0)), { stroke: '#93a1b5', 'stroke-width': 1 });
    B.tex(V(X(a / 2), Y(0) + 20), `$a=${fmt(a, 2)}$`, { size: 12, anchor: 'mid', color: '#5cadff' });
    B.tex(V(X(a + t / 2), Y(0) + 20), `$t$`, { size: 12, anchor: 'mid', color: '#a06226' });
    B.seg(V(X(0) - 8, Y(0)), V(X(0) - 8, Y(b + t)), { stroke: '#93a1b5', 'stroke-width': 1 });
    B.tex(V(X(0) - 16, Y(b / 2)), `$b=${fmt(b, 2)}$`, { size: 12, anchor: 'end', color: '#5cadff' });
    B.tex(V(X(0) - 16, Y(b + t / 2)), `$t$`, { size: 12, anchor: 'end', color: '#4ade80' });

    // 块名
    B.tex(V(X(a / 2), Y(b / 2) + 4), '$ab$', { size: 15, color: '#5cadff' });
    if (t > 0.22) {
      B.tex(V(X(a + t / 2), Y(b / 2)), '$bt$', { size: 12.5, color: '#ffd166' });
      B.tex(V(X(a / 2), Y(b + t / 2)), '$at$', { size: 12.5, color: '#4ade80' });
      B.tex(V(X(a + t / 2), Y(b + t / 2)), '$t^2$', { size: 11, color: '#c084fc' });
    }

    // 右栏
    B.tex(V(440, 96), '$\\Delta(ab)=a\\,t+b\\,t+t^2$', { size: 13.5, color: '#aebdd2', anchor: 'start' });
    B.textM(V(440, 132), '三块分别来自：右边一竖条、上边一横条、角上的小方块', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$ab$', fmt(a * b, 4), '#5cadff'],
      ['$bt$', fmt(b * t, 4), '#ffd166'],
      ['$at$', fmt(a * t, 4), '#4ade80'],
      ['$t^2$', fmt(t * t, 4), '#c084fc'],
      ['$\\Delta(ab)$', fmt(b * t + a * t + t * t, 4), '#aebdd2'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(442, 172 + i * 30), r[0], { size: 12.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 172 + i * 30), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(442, 344), '$\\dfrac{\\Delta(ab)}{t}=a+b+t\\ \\xrightarrow{\\ t\\to0\\ }\\ a+b$', { size: 13, color: '#ffd166', anchor: 'start' });

    cA(`$=${fmt(a, 2)}\\times${fmt(b, 2)}=${fmt(a * b, 4)}$`);
    cI(`$=${fmt(a * b + b * t + a * t + t * t - a * b, 4)}$`);
    cQ(`$=${fmt(a + b + t, 4)}$`);
    if (t < 0.12) cJ('$t^2$ 那块先瘦成一条线，剩下的 $a+b+t$ 只剩 $a+b$：乘积的导数', 'ok');
    else cJ(`把 $t$ 拖小：紫色角块按 $t^2$ 缩，比另外两块都退得快，差商收向 $a+b=${fmt(a + b, 2)}$`);
  };

  B.slider('a =', 1, 4, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  B.slider('b =', 1, 3, 0.05, st.b, v => { st.b = v; B.render(); }, 'b');
  B.slider('Δa = Δb =', 0.05, 0.6, 0.01, st.t, v => { st.t = v; B.render(); }, 't');
  B.hintM('把三条边长都当成变量：面积增量三块分开数，$t\\to0$ 时只有线性两块留下');
  B.render();
  return B;
}
