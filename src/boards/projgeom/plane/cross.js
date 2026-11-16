import { Board, V } from '../../../lib/board.js';

/* 交比机：四个共线点的交比在分式线性变换下不变。
   上排拖动 A、B、C、D 的坐标，下排是它们在同一条射影变换下的像；两边徽章始终相等。 */
const TR = [
  { n: '平移 x+2', f: x => x + 2 },
  { n: '倒数 1/x', f: x => 1 / x },
  { n: '分式 (2x+1)/(x+2)', f: x => (2 * x + 1) / (x + 2) },
];
const CR = (a, b, c, d) => ((c - a) / (c - b)) / ((d - a) / (d - b));

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { a: .12, b: .38, c: .62, d: .88, t: 0 };
  const cU = B.chipM('交比 $(A,B;C,D)$');
  const cV = B.chipM('变换后');
  const cT = B.chipM('变换');

  B.renderFn = () => {
    const { a, b, c, d } = st;
    const tr = TR[st.t];
    const img = [a, b, c, d].map(tr.f);
    const im0 = Math.min(...img), im1 = Math.max(...img);
    const X = u => 120 + u * 580;
    const Y = u => 120 + (u - im0) / (im1 - im0 || 1) * 580;
    B.tex(V(410, 30), '四个共线点与它们在同一射影变换下的像', { size: 16, anchor: 'mid', w: 520 });
    B.seg(V(80, 170), V(740, 170), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    B.seg(V(80, 330), V(740, 330), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    B.text(V(60, 174), '原像', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });
    B.text(V(60, 334), '像', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });
    const NAMES = ['A', 'B', 'C', 'D'], COL = ['#5cadff', '#67e8f9', '#4ade80', '#ffd166'];
    [a, b, c, d].forEach((u, i) => {
      const x = X(u);
      B.dot(V(x, 170), 6, { fill: COL[i], stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.textM(V(x, 196), `$${NAMES[i]}=${u.toFixed(2)}$`, { 'font-size': 11, fill: COL[i] });
      const x2 = Y(img[i]);
      B.dot(V(x2, 330), 6, { fill: COL[i], stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.textM(V(x2, 356), `$${img[i].toFixed(2)}$`, { 'font-size': 11, fill: COL[i] });
    });
    const cr1 = CR(a, b, c, d), cr2 = CR(img[0], img[1], img[2], img[3]);
    B.textM(V(410, 404), `$(A,B;C,D)=\\dfrac{(c-a)/(c-b)}{(d-a)/(d-b)}=${cr1.toFixed(4)}$`, { 'font-size': 14, fill: '#8fa3bd' });
    cU(`$${cr1.toFixed(4)}$`);
    cV(`$${cr2.toFixed(4)}$`);
    cT(tr.n);
  };

  B.slider('A 的坐标', 0, .2, .01, st.a, v => { st.a = v; B.render(); });
  B.slider('B 的坐标', .25, .45, .01, st.b, v => { st.b = v; B.render(); });
  B.slider('C 的坐标', .55, .75, .01, st.c, v => { st.c = v; B.render(); });
  B.slider('D 的坐标', .8, 1, .01, st.d, v => { st.d = v; B.render(); });
  TR.forEach((t, i) => B.btn(t.n, () => { st.t = i; B.render(); }));
  B.hintM('交比是射影几何的「长度」：换什么射影变换，这个比值都不动');
  B.render();
  return B;
}
