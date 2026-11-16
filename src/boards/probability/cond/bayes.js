/* 图 独2 · 全概率公式与贝叶斯公式
   两个来源 A₁、A₂ 把 Ω 分成两块，各自以条件概率产生事件 B。
   P(B) 由两条路径相加（全概率），P(A₁|B) 则反过来，用 P(B) 作分母把先验改写成后验。
   右侧两根竖条比较 A₁ 的先验与后验，滑动三个概率看它如何被 B 的证据推向两边。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { p1: .6, q1: .8, q2: .3 };
  const cT = B.chipM('全概率'), cB2 = B.chipM('后验'), cJ = B.chipM('判读');

  const edge = (S, E, p, c) => B.dyn.appendChild(mk('line', {
    x1: S.x, y1: S.y, x2: E.x, y2: E.y, stroke: c, 'stroke-width': 1.2 + 4 * p, 'stroke-opacity': .85,
  }, B.dyn));

  B.renderFn = () => {
    const { p1, q1, q2 } = st;
    const p2 = 1 - p1, pB = p1 * q1 + p2 * q2;
    const post = p1 * q1 / pB;

    const R = V(70, 200), N1 = V(288, 118), N2 = V(288, 282);
    const L = [V(536, 62), V(536, 172), V(536, 228), V(536, 338)];

    edge(R, N1, p1, '#5cadff');
    edge(R, N2, p2, '#ff9e4a');
    edge(N1, L[0], q1, '#5cadff');
    edge(N1, L[1], 1 - q1, '#5cadff');
    edge(N2, L[2], q2, '#ff9e4a');
    edge(N2, L[3], 1 - q2, '#ff9e4a');

    [[R, 5, '#aebdd2'], [N1, 5, '#5cadff'], [N2, 5, '#ff9e4a']].forEach(([p, r, c]) => B.dot(p, r, { fill: c }));
    [0, 2].forEach(i => B.dot(L[i], 6, { fill: '#ffd166' }));
    [1, 3].forEach(i => B.dot(L[i], 5, { fill: '#3f5f8f' }));

    B.textM(V(R.x - 8, R.y - 18), 'Ω', { 'font-size': 12, fill: '#aebdd2', anchor: 'end' });
    B.textM(V(N1.x + 24, N1.y - 12), 'A_1', { 'font-size': 13, fill: '#5cadff' });
    B.textM(V(N2.x + 24, N2.y - 12), 'A_2', { 'font-size': 13, fill: '#ff9e4a' });
    ['B', '\\overline{B}', 'B', '\\overline{B}'].forEach((s, i) => B.textM(V(L[i].x + 26, L[i].y + 4), `$${s}$`, {
      'font-size': 12.5, fill: i % 2 === 0 ? '#ffd166' : '#8fa3bd',
    }));

    B.textM(V(176, 128), `$P(A_1)=${p1}$`, { 'font-size': 12, fill: '#5cadff' });
    B.textM(V(176, 292), `$P(A_2)=${p2.toFixed(2)}$`, { 'font-size': 12, fill: '#ff9e4a' });
    B.textM(V(406, 76), `$P(B\\mid A_1)=${q1}$`, { 'font-size': 12, fill: '#5cadff' });
    B.textM(V(406, 158), `$P(\\overline{B}\\mid A_1)=${(1 - q1).toFixed(2)}$`, { 'font-size': 12, fill: '#8fa3bd' });
    B.textM(V(406, 252), `$P(B\\mid A_2)=${q2}$`, { 'font-size': 12, fill: '#ff9e4a' });
    B.textM(V(406, 334), `$P(\\overline{B}\\mid A_2)=${(1 - q2).toFixed(2)}$`, { 'font-size': 12, fill: '#8fa3bd' });

    // 右侧：先验与后验两根竖条
    const BX = 640, BW = 58, BY = 340, MH = 210;
    B.text(V(BX - 12, 74), 'B 出现之前与之后', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });
    [['先验', p1, '#ffd166', BX], ['后验', post, '#c084fc', BX + 96]].forEach(([nm, v, c, x]) => {
      B.dyn.appendChild(mk('line', { x1: x - 8, y1: BY, x2: x + BW + 8, y2: BY, stroke: '#5c6a80', 'stroke-width': 1.2 }, B.dyn));
      B.dyn.appendChild(mk('rect', {
        x, y: BY - Math.max(2, MH * v), width: BW, height: Math.max(2, MH * v), rx: 5,
        fill: c, 'fill-opacity': .45, stroke: c, 'stroke-width': 1.3,
      }, B.dyn));
      B.text(V(x + BW / 2, BY - Math.max(2, MH * v) - 8), `${v.toFixed(3)}`, { fill: c, 'font-size': 11.5 });
      B.text(V(x + BW / 2, BY + 16), nm, { fill: '#8fa3bd', 'font-size': 11.5 });
    });
    B.textM(V(BX + 77, BY + 38), '$A_1$ 的概率', { 'font-size': 11, fill: '#8fa3bd' });

    cT(`$P(B)=${p1}\\times${q1}+${p2.toFixed(2)}\\times${q2}=${pB.toFixed(4)}$`);
    cB2(`$P(A_1\\mid B)=\\dfrac{${p1}\\times${q1}}{${pB.toFixed(4)}}=${post.toFixed(4)}$`);
    cJ(Math.abs(post - p1) < .02
      ? 'B 几乎不改变 A₁ 的可能性，两条路径给出 B 的机会相当'
      : post > p1 ? 'B 出现后 A₁ 的可能性变大，证据把判断推向 A₁'
        : 'B 出现后 A₁ 的可能性变小，证据把判断推向 A₂');
  };

  B.slider('先验 P(A1)', .1, .9, .05, st.p1, v => { st.p1 = v; B.render(); }, 'pa1');
  B.slider('条件 P(B|A1)', .1, .9, .05, st.q1, v => { st.q1 = v; B.render(); }, 'q1');
  B.slider('条件 P(B|A2)', .1, .9, .05, st.q2, v => { st.q2 = v; B.render(); }, 'q2');

  B.hint('全概率沿树枝相加，贝叶斯把它当分母，倒着算回 A₁');
  B.render();
  return B;
}
