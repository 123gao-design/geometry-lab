/* 图 性2 · 大小比较机：作差比零与作商比一
   两种比较法：作差看 a−b 与 0 —— 对一切实数成立，永远可靠；作商看 a/b 与 1 ——
   须两数同号：同正时商大于 1 即 a>b；同负时结论相反（商大于 1 反而 a<b）；
   异号时不须比较（正数恒大于负数），b=0 时作商失效。
   局部坐标约定：u∈[0,860] 向右、v∈[0,340] 向下；px(v)=70+60(v+6)，数轴 v=214。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 340;
  const B = new Board(root, W, H);
  const px = v => 70 + 60 * (v + 6);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, a: 2, b: 1 };
  const cV = B.chipM('读数'), cS = B.chipM('符号'), cJ = B.chipM('判定');

  B.renderFn = () => {
    const { a, b } = st;
    const d = a - b, q = Math.abs(b) < 1e-9 ? null : a / b;
    const same = a * b > 1e-9 ? (a > 0 ? '同正' : '同负') : a * b < -1e-9 ? '异号' : '含零';
    B.tex(V(430, 46), `$a=${f1(a)},\\quad b=${f1(b)}$`, { size: 16, anchor: 'mid' });
    B.text(V(430, 76), st.mode === 0 ? '作差法：看 a−b 与 0 的大小 —— 对一切实数成立'
      : '作商法：看 a/b 与 1 的大小 —— 须两数同号', { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 数轴
    B.seg(V(px(-6.4), 214), V(px(6.4) + 12, 214), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `${px(6.4) + 20},214 ${px(6.4) + 10},209.5 ${px(6.4) + 10},218.5`, fill: '#8fa3bd' }, B.dyn);
    for (let t = -6; t <= 6; t++) {
      B.seg(V(px(t), 214), V(px(t), 207), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
      B.text(V(px(t), 234), String(t), { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
    }
    B.dot(V(px(a), 214), 6, { fill: '#ffd166' });
    B.tex(V(px(a), 190), '$a$', { size: 13, anchor: 'mid', color: '#ffd166' });
    B.dot(V(px(b), 214), 6, { fill: '#5cadff' });
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
      B.dot(V(px(1), 214), 5, { fill: '#0a0d14', stroke: '#ffd166', 'stroke-width': 2 });
      if (q !== null && Math.abs(q) <= 6) {
        B.dot(V(px(q), 176), 5.5, { fill: '#67e8f9' });
        B.tex(V(px(q), 158), `$a/b=${f1(q)}$`, { size: 13, anchor: 'mid', color: '#67e8f9' });
      }
      B.tex(V(430, 150), q === null ? '$a/b$：b=0，除数无意义' : `$a/b=${f1(q)}$ —— 与 $1$ 比`, { size: 15, anchor: 'mid', color: '#67e8f9' });
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
    else if (same === '异号') { jt = '异号：正数恒大于负数，不须比较 —— 商为负，与 1 比大小给不出结论'; }
    else if (same === '含零') { jt = '含零：直接由符号判定（0 与正数、负数的大小关系显然）'; }
    else if (same === '同负') {
      jt = q > 1 + 1e-9 ? `同负陷阱：$a/b>1$ 反而 $a<b$ —— 两数同负时，结论与商的大小相反`
         : q < 1 - 1e-9 ? `同负：$a/b<1$ ⟹ $a>b$ —— 结论与商的大小相反` : 'a = b';
      jc = q > 1 + 1e-9 ? 'warn' : '';
    } else {
      jt = q > 1 + 1e-9 ? `同正：$a/b>1\\ \\Rightarrow\\ a>b$ —— 作商法适用`
         : q < 1 - 1e-9 ? `同正：$a/b<1\\ \\Rightarrow\\ a<b$` : 'a = b';
      jc = 'ok';
    }
    cJ(jt, jc);
  };

  const modeBtns = ['作差比零', '作商比一'].map((n, i) => B.btnM(n, () => {
    st.mode = i; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const sA = B.slider('a =', -4, 4, .1, 2, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', -4, 4, .1, 1, v => { st.b = v; B.render(); });
  const PRE = [
    { a: 2, b: 1, n: '① a=2, b=1（同正）' },
    { a: -3, b: -2, n: '② a=−3, b=−2（同负）' },
    { a: 3, b: -1, n: '③ a=3, b=−1（异号）' },
  ];
  PRE.forEach(P => B.btn(P.n, () => { st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render(); }));

  B.hint('作差与 0 比、作商与 1 比；预设② 看同负陷阱 —— 商大于 1 结论反而反转');
  B.render();
  return B;
}
