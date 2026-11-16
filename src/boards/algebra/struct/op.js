import { Board, V, mk } from '../../../lib/board.js';

/* 二元运算表：集合 {0,…,n−1} 上的模 n 加法 / 乘法 / 减法。
   逐条核验封闭、结合、幺元、逆元，把「半群」「幺半群」「群」的差别摆在同一张表上。 */
const MODES = ['模 n 加法', '模 n 乘法', '模 n 减法'];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 4, m: 0 };
  const cA = B.chipM('封闭');
  const cB = B.chipM('结合律');
  const cE = B.chipM('幺元');
  const cI = B.chipM('逆元');
  const op = (a, b) => st.m === 0 ? (a + b) % st.n : st.m === 1 ? (a * b) % st.n : ((a - b) % st.n + st.n) % st.n;

  const analyse = () => {
    const n = st.n, els = [...Array(n).keys()];
    let e = null;
    for (const x of els) if (els.every(y => op(x, y) === y && op(y, x) === y)) { e = x; break; }
    let wit = null;
    outer: for (const a of els) for (const b of els) for (const c of els)
      if (op(op(a, b), c) !== op(a, op(b, c))) { wit = [a, b, c]; break outer; }
    const inv = e === null ? false : els.every(x => els.some(y => op(x, y) === e && op(y, x) === e));
    return { e, wit, inv };
  };

  B.renderFn = () => {
    const n = st.n, els = [...Array(n).keys()];
    const cell = Math.min(58, 330 / n), x0 = 96, y0 = 96;
    const { e, wit, inv } = analyse();
    B.textM(V(410, 30), `集合 $\\{0,1,\\dots,${n - 1}\\}$ 上的${MODES[st.m]}`, { 'font-size': 15, fill: '#8fa3bd' });
    B.text(V(x0 - 20, y0 - 26), '∘', { 'font-size': 14, fill: '#67e8f9' });
    els.forEach((a, i) => {
      B.text(V(x0 + i * cell + cell / 2, y0 - 22), `${a}`, { 'font-size': 13, fill: '#67e8f9', 'text-anchor': 'middle' });
      B.text(V(x0 - 26, y0 + i * cell + cell / 2 + 5), `${a}`, { 'font-size': 13, fill: '#67e8f9', 'text-anchor': 'middle' });
    });
    els.forEach((a, i) => els.forEach((b, j) => {
      const v = op(a, b), x = x0 + j * cell, y = y0 + i * cell;
      const isE = e !== null && v === e;
      const isW = wit && ((wit[0] === i && wit[1] === j));
      mk('rect', {
        x, y, width: cell - 2, height: cell - 2, rx: 5,
        fill: isW ? 'rgba(255,158,74,.22)' : isE ? 'rgba(255,209,102,.16)' : 'rgba(92,173,255,.07)',
        stroke: isW ? '#ff9e4a' : isE ? 'rgba(255,209,102,.8)' : 'rgba(92,173,255,.22)', 'stroke-width': 1.2,
      }, B.dyn);
      B.text(V(x + cell / 2 - 1, y + cell / 2 + 5), `${v}`, { 'font-size': 14, fill: isE ? '#ffd166' : '#c9d7ea', 'text-anchor': 'middle' });
    }));
    B.text(V(x0, y0 + n * cell + 28), '金色格 = 结果等于幺元；橙色框 = 结合律失效的一组输入', { 'font-size': 12, fill: '#8fa3bd' });

    const rx = 470;
    B.tex(V(rx, 100), '封闭：任意两格都有值，运算不越界', { size: 13, color: '#4ade80', w: 320 });
    B.tex(V(rx, 150), wit === null ? '结合律：(a∘b)∘c = a∘(b∘c) 全部成立' : '结合律失效：(a∘b)∘c ≠ a∘(b∘c)', { size: 13, color: wit === null ? '#4ade80' : '#ff7b8a', w: 320 });
    if (wit) {
      const [a, b, c] = wit;
      B.tex(V(rx + 10, 180), `反例 a=${a}, b=${b}, c=${c}`, { size: 12, color: '#ff9e4a', w: 300 });
      B.tex(V(rx + 10, 206), `左 = ${op(op(a, b), c)}，右 = ${op(a, op(b, c))}`, { size: 12, color: '#ff9e4a', w: 300 });
    }
    B.tex(V(rx, 258), e === null ? '幺元：不存在' : `幺元：e = ${e}`, { size: 13, color: e === null ? '#ff7b8a' : '#4ade80', w: 320 });
    B.tex(V(rx, 300), inv ? '逆元：每个元素都有逆元' : '逆元：有元素没有逆元', { size: 13, color: inv ? '#4ade80' : '#ff7b8a', w: 320 });
    const isGroup = wit === null && e !== null && inv;
    B.tex(V(rx, 356), isGroup ? '四条全满足：这是一个群' : wit === null && e !== null ? '结合、有幺元、逆元不全：幺半群' : '只有封闭与结合：半群', { size: 14, color: isGroup ? '#ffd166' : '#c084fc', w: 320 });

    cA('✓');
    cB(wit === null ? '✓' : '✗');
    cE(e === null ? '无' : `${e}`);
    cI(inv ? '✓' : '✗');
  };

  MODES.forEach((name, i) => B.btn(name, () => { st.m = i; B.render(); }));
  B.slider('元素个数 n', 3, 6, 1, st.n, v => { st.n = v; B.render(); });
  B.hint('换一种运算或换一个 n，逐条看哪个条件先断');
  B.render();
  return B;
}
