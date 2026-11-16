import { Board, V } from '../../../lib/board.js';

/* 康托集：从单位线段起，每一步挖去每段中间三分之一。
   逐层平铺：第 l 行画第 l 层的剩段，红色虚线标出这一层新挖掉的中段，层数一多就看出总长趋于零。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 3 };
  const cN = B.chipM('层数 $n$');
  const cC = B.chipM('区间数 $2^n$');
  const cL = B.chipM('总长 $(2/3)^n$');
  const cD = B.chipM('维数');

  function levelIntervals(n) {
    let a = [[0, 1]];
    for (let l = 0; l < n; l++) {
      const b = [];
      for (const [x, y] of a) { const d = (y - x) / 3; b.push([x, x + d], [y - d, y]); }
      a = b;
    }
    return a;
  }

  B.renderFn = () => {
    const n = st.n, X = u => 100 + u * 620;
    B.tex(V(410, 34), '每一步挖去每段中间的三分之一', { size: 16, anchor: 'mid', w: 460 });
    for (let l = 0; l <= n; l++) {
      const y = 100 + l * 48;
      const cur = levelIntervals(l);
      B.text(V(88, y + 4), `第 ${l} 层`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });
      for (const [a, b] of cur) B.seg(V(X(a), y), V(X(b), y), { stroke: '#5cadff', 'stroke-width': l === n ? 5 : 3, 'stroke-linecap': 'butt' });
      if (l > 0) {
        for (const [a, b] of levelIntervals(l - 1)) {
          const d = (b - a) / 3;
          B.seg(V(X(a + d), y), V(X(b - d), y), { stroke: '#ff7b8a', 'stroke-width': 2, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
        }
      }
      B.text(V(740, y + 4), `${Math.pow(2, l)} 段`, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'start' });
    }
    B.text(V(410, 410), '区间数每层乘 2，长度每层乘 2/3 —— 层数越多，留下的点越多、总长越短', { 'font-size': 12, fill: '#8fa3bd' });
    cN(`${n}`);
    cC(`${Math.pow(2, n)}`);
    cL(`$${Math.pow(2 / 3, n).toFixed(3)}$`);
    cD('$0.631$');
  };

  B.slider('层数 n', 0, 5, 1, st.n, v => { st.n = v; B.render(); });
  B.hintM('极限集总长 $\\to 0$，点数却与整个区间一样多 —— 长度量不出它的大小');
  B.render();
  return B;
}
