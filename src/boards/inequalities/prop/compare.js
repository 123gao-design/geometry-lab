/* 图 性2 · 大小比较机：作差比零与作商比一
   两种比较法：作差看 a−b 与 0 —— 对一切实数成立，永远可靠；作商看 a/b 与 1 ——
   判定方向取决于分母 b 的符号。
   异号时不须比较（正数恒大于负数），b=0 时作商失效。
   局部坐标约定：u∈[0,860] 向右、v∈[0,340] 向下；px(v)=70+60(v+6)，数轴 v=214。 */
import { InequalityBoard } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 340;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, a: 2, b: 1 };
  const cV = B.readout('读数'), cS = B.readout('符号', 'gold'), cJ = B.chipM('判定');

  B.renderFn = () => {
    const { a, b } = st;
    const d = a - b, q = Math.abs(b) < 1e-9 ? null : a / b;
    const same = a * b > 1e-9 ? (a > 0 ? '同正' : '同负') : a * b < -1e-9 ? '异号' : '含零';
    const step = st.mode === 1 && q !== null ? Math.max(1, Math.ceil(Math.abs(q) / 6)) : 1;
    const px = v => W / 2 + 60 * v / step;
    B.arrow(V(45, 214), V(W - 45, 214), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    for (let t = -6 * step; t <= 6 * step; t += step) {
      B.seg(V(px(t), 214), V(px(t), 207), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
      B.text(V(px(t), 234), String(t), { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
    }
    B.mark(V(px(a), 214), '#ffd166');
    B.tex(V(px(a), 190), '$a$', { size: 13, anchor: 'mid', color: '#ffd166' });
    B.mark(V(px(b), 214), '#5cadff');
    B.tex(V(px(b), 256), '$b$', { size: 13, anchor: 'mid', color: '#5cadff' });
    if (st.mode === 0) {
      // 有向线段 b→a：颜色即差的符号
      const col = Math.abs(d) < 1e-9 ? '#93a1b5' : d > 0 ? '#4ade80' : '#ff7b8a';
      if (Math.abs(d) > .02) {
        const [l, r] = [Math.min(a, b), Math.max(a, b)];
        B.seg(V(px(l), 176), V(px(r), 176), { stroke: col, 'stroke-width': 2.4 });
        const tip = d > 0 ? r : l, sgn = d > 0 ? 1 : -1;
        mk('polygon', { points: `${px(tip) + sgn * 9},176 ${px(tip) - sgn * 1},171.5 ${px(tip) - sgn * 1},180.5`, fill: col }, B.dyn);
      }
      B.tex(V(430, 150), `$a-b=${f1(d)}$ —— 与 $0$ 比`, { size: 15, anchor: 'mid', color: col });
    } else {
      // 商落在数轴上与 1 比；1 处金环
      B.seg(V(px(1), 166), V(px(1), 214), { stroke: '#ffd166', 'stroke-dasharray': '3 3' });
      B.tex(V(px(1), 145), '$1$', { size: 13, anchor: 'mid', color: '#ffd166' });
      if (q !== null) {
        B.mark(V(px(q), 176), '#67e8f9');
        B.tex(V(px(q), 116), `$a/b=${f1(q)}$`, { size: 13, anchor: 'mid', color: '#67e8f9' });
      }
    }
    // 徽章
    cV(st.mode === 0 ? `$a-b=${f1(d)}$：${d > 1e-9 ? '大于 0' : d < -1e-9 ? '小于 0' : '等于 0'}`
                     : (q === null ? 'b = 0：作商失效' : `$a/b=${f1(q)}$：${q > 1 + 1e-9 ? '大于 1' : q < 1 - 1e-9 ? '小于 1' : '等于 1'}`));
    cS(`${same}（$a${a >= 0 ? '\\ge' : '<'}0$，$b${b >= 0 ? '\\ge' : '<'}0$）`);
    let jt, jc = '';
    if (st.mode === 0) {
      jt = d > 1e-9 ? `$a-b>0\\ \\Rightarrow\\ a>b$ —— 作差法对一切实数成立`
         : d < -1e-9 ? `$a-b<0\\ \\Rightarrow\\ a<b$` : `$a-b=0\\ \\Rightarrow\\ a=b$`;
      jc = 'ok';
    } else if (q === null) { jt = 'b = 0：除数为零，作商法在此失效 —— 改用作差法'; jc = 'warn'; }
    else {
      const cmp = Math.abs(q - 1) < 1e-9 ? '=' : q > 1 ? '>' : '<';
      const result = a === b ? '=' : a > b ? '>' : '<';
      jt = `$b${b > 0 ? '>' : '<'}0$，由 $a/b${cmp}1$ 得 $a${result}b$。`;
      jc = b > 0 ? 'ok' : 'warn';
    }
    cJ(jt, jc);
  };

  B.choiceRow('选择模式', ['作差比零', '作商比一'].map(name => ({ name })), () => st.mode, i => {
    st.mode = i; B.render();
  });
  const sA = B.slider('a =', -4, 4, .1, 2, v => { st.a = v; B.render(); }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', -4, 4, .1, 1, v => { st.b = v; B.render(); }, undefined, n => `$b=${n}$`);
  const PRE = [
    { name: '同正', formula: '$a=2,\\ b=1$', values: { a: 2, b: 1 } },
    { name: '同负', formula: '$a=-3,\\ b=-2$', values: { a: -3, b: -2 } },
    { name: '异号', formula: '$a=3,\\ b=-1$', values: { a: 3, b: -1 } },
  ];
  B.examples('选择例题', PRE, st, P => {
    st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render();
  });

  B.render();
  return B;
}
