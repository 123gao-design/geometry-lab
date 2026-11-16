/* 图 方6 · 微分方程建模机：三档各配一条曲线与一组参数
   ① 指数增长与衰减 N'=kN；② 简谐振动 x''+ω²x=0；③ RL 电路 I'+(R/L)I=E/L。
   滑块给每档自己的参数，右栏列出解与两个读数。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, a: 0.6, t: 2.0 };
  const cV = B.chipM('参数'), cF = B.chipM('函数值'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const m = B.mapFit(-0.2, 10, -2.2, 4.6, [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 2, ly: 1, xt: [2, 4, 6, 8], yt: [-2, 2, 4] });
    let fn, solTxt, paramTxt, note, val;
    if (st.k === 0) {
      const k = st.a;
      fn = t => Math.exp(k * t);
      val = Math.exp(k * st.t);
      solTxt = '$N=N_0\\mathrm{e}^{kt},\\ N_0=1$';
      paramTxt = `$k=${fmt(k, 2)}$`;
      note = k > 0 ? 'k>0：每一步都按当前数量成比例增长' : 'k<0：按当前数量成比例衰减，永远到不了零';
    } else if (st.k === 1) {
      const w = st.a + 0.2;
      fn = t => Math.cos(w * t);
      val = Math.cos(w * st.t);
      solTxt = '$x=\\cos\\omega t$';
      paramTxt = `$\\omega=${fmt(w, 2)}$`;
      note = '振幅不衰减：方程里没有阻尼项，能量守恒';
    } else {
      const a = st.a + 0.2;
      fn = t => 3 * (1 - Math.exp(-a * t));
      val = 3 * (1 - Math.exp(-a * st.t));
      solTxt = '$I=\\dfrac{E}{R}\\left(1-\\mathrm{e}^{-Rt/L}\\right),\\ E/R=3$';
      paramTxt = `$R/L=${fmt(a, 2)}$`;
      note = '开关合上瞬间电流为零，随后按指数逼近稳态 E/R';
    }
    B.plot(fn, m, { stroke: '#5cadff', 'stroke-width': 2.4, anchors: [st.t], pad: 6 });
    B.dot(V(m.px(st.t), m.py(val)), 5.3, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.seg(V(m.px(st.t), m.py(0)), V(m.px(st.t), m.py(val)), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    B.tex(V(m.px(st.t) + 8, m.py(val) - 12), `$${fmt(val, 3)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });

    B.textM(V(636, 84), ['指数增长与衰减', '简谐振动', 'RL 电路的暂态'][st.k], { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 122), solTxt, { size: 11.5, color: '#aebdd2', anchor: 'start', w: 240 });
    B.tex(V(636, 170), paramTxt, { size: 12.5, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 212), `$t=${fmt(st.t, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.textM(V(636, 254), note, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start', w: 210 });

    cV(paramTxt);
    cF(`$=${fmt(val, 3)}$`);
    cJ(st.k === 0 ? '拖 $t$ 与 $k$：曲线的高低与陡缓各管一件事，增长率是相对量' :
      st.k === 1 ? '拖 $\\omega$：曲线只是挤密或拉疏，振幅始终是一' :
      '拖 $R/L$：比值越大，电流爬升越慢，但最终都停在 $E/R$');
  };

  const bts = ['① 增长与衰减', '② 简谐振动', '③ RL 电路'].map((t, i) => B.btnM(t, () => {
    st.k = i; st.a = i === 0 ? 0.6 : i === 1 ? 1.2 : 0.8;
    bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('k / ω / R/L =', -1.2, 2.4, 0.01, st.a, v => { st.a = v; B.render(); }, 'a');
  B.slider('t =', 0.2, 9, 0.01, st.t, v => { st.t = v; B.render(); }, 't');
  B.hintM('三档方程各管一类现象，解的形状由方程的系数定，参数只是把它们拧紧或拧松');
  B.render();
  return B;
}
