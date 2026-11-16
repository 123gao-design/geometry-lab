/* 图 归2 · 归纳证明机
   递推 a_{n+1}=a_n/(1+3a_n)，a_1=1。逐项算前几项得 1, 1/4, 1/7, 1/10, …，
   猜测 a_n=1/(3n−2)。左栏把「递推算得」与「公式算得」并排，右栏做归纳步骤：
   假设 a_k=1/(3k−2)，代入递推式化简得 a_{k+1}=1/(3k+1)，正是 n=k+1 时的公式。
   局部坐标：表格 x∈[60,430]，右栏 x∈[470,850]。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const st = { k: 2 };
  const val = n => 1 / (3 * n - 2);
  const cR = B.chipM('递推式'), cG = B.chipM('猜测'), cS = B.chipM('归纳步骤');

  B.renderFn = () => {
    const k = st.k;
    // 左栏：逐项表
    const rows = [];
    let a = 1;
    for (let n = 1; n <= 6; n++) {
      rows.push({
        n, a,
        guess: val(n),
        hit: Math.abs(a - val(n)) < 1e-12,
      });
      a = a / (1 + 3 * a);
    }
    B.text(V(60, 66), '逐项算，再与公式对照', { 'font-size': 12.5, fill: '#93a1b5' });
    B.text(V(60, 100), 'n', { 'font-size': 11.5, fill: '#93a1b5' });
    B.tex(V(120, 100), '递推算得', { size: 11.5, anchor: 'start', color: '#5cadff', w: 120 });
    B.tex(V(300, 100), '公式 $\\dfrac{1}{3n-2}$', { size: 11.5, anchor: 'start', color: '#ffd166', w: 140 });
    B.seg(V(60, 114), V(430, 114), { stroke: '#2b4260', 'stroke-width': 1 });
    rows.forEach((r, i) => {
      const y = 142 + i * 36, sel = r.n === k || r.n === k + 1;
      if (sel) mk('rect', { x: 54, y: y - 17, width: 380, height: 32, rx: 6, fill: '#ffd166', 'fill-opacity': .1 }, B.dyn);
      B.text(V(66, y), String(r.n), { 'font-size': 12.5, fill: sel ? '#ffd166' : '#93a1b5' });
      B.tex(V(120, y), `$${fmt(r.a, 4)}$`, { size: 12, anchor: 'start', color: '#5cadff', w: 110 });
      B.tex(V(300, y), `$${fmt(r.guess, 4)}$`, { size: 12, anchor: 'start', color: '#ffd166', w: 130 });
    });
    B.text(V(60, 380), '六项全部对上，可以下猜测：', { 'font-size': 12, fill: '#93a1b5' });
    B.tex(V(60, 406), '$a_n=\\dfrac{1}{3n-2}$', { size: 14, anchor: 'start', color: '#ffd166', w: 300 });
    // 右栏：归纳步骤
    const XR = 480;
    B.seg(V(XR - 24, 60), V(XR - 24, 400), { stroke: '#2b4260', 'stroke-width': 1 });
    B.text(V(XR, 66), '归纳步骤：由 P(k) 推出 P(k+1)', { 'font-size': 12.5, fill: '#93a1b5' });
    B.tex(V(XR, 106), `假设 $a_{${k}}=\\dfrac{1}{${3 * k - 2}}$`, { size: 12.5, anchor: 'start', color: '#e8eefc', w: 350 });
    B.tex(V(XR, 146), '$a_{k+1}=\\dfrac{a_k}{1+3a_k}$', { size: 13, anchor: 'start', w: 350 });
    B.tex(V(XR, 190), `$=\\dfrac{\\dfrac{1}{${3 * k - 2}}}{1+\\dfrac{3}{${3 * k - 2}}}$`, { size: 13, anchor: 'start', w: 350 });
    B.tex(V(XR, 250), `$=\\dfrac{1}{${3 * k + 1}}$`, { size: 14, anchor: 'start', color: '#5cadff', w: 350 });
    B.tex(V(XR, 300), `$=\\dfrac{1}{3(k+1)-2}$`, { size: 14, anchor: 'start', color: '#4ade80', w: 350 });
    B.text(V(XR, 344), '正是 n=k+1 时的公式，递推这一步成立。', { 'font-size': 11.5, fill: '#93a1b5' });
    B.text(V(XR, 376), '起点：', { 'font-size': 11.5, fill: '#93a1b5' });
    B.tex(V(XR + 44, 376), '$a_1=1=\\dfrac{1}{3\\times1-2}$', { size: 12.5, anchor: 'start', color: '#ffd166', w: 260 });
    // 标题
    B.tex(V(60, 32), '先算几项猜出公式，再用两步把它坐实', { size: 14, anchor: 'start', w: 760 });
    // 徽章
    cR('$a_{n+1}=\\dfrac{a_n}{1+3a_n},\\ a_1=1$');
    cG('$a_n=\\dfrac{1}{3n-2}$');
    cS(`$a_{${k}}\\Rightarrow a_{${k + 1}}$：分母从 ${3 * k - 2} 变到 ${3 * k + 1}`);
  };

  B.slider('归纳到 k =', 1, 5, 1, 2, v => { st.k = v; B.render(); });

  B.hint('右边一整栏只做一件事：把 aₖ 的式子代入递推式，化简到 aₖ₊₁ 的公式');
  B.render();
  return B;
}
