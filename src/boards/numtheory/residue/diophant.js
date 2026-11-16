/* 图 剩3 · 二元一次不定方程机
   方程 ax+by=c 的整数解落在一条直线上，能不能落到格点上由 gcd(a,b) 决定。
   d=gcd(a,b) 整除 c 时，格点沿直线等距排开，步长 (b/d, −a/d)，两端各有一个方向；
   d 不整除 c 时直线上一个格点也没有。
   三个滑块：系数 a、b、右端 c。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };

export function createBoard(root) {
  const W = 840, H = 470;
  const B = new Board(root, W, H);
  const st = { a: 4, b: 6, c: 14 };

  const cD = B.chipM('$\\gcd(a,b)$'), cS = B.chipM('特解'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const { a, b, c } = st;
    const d = gcd(a, b);
    const solvable = c % d === 0;

    const m = B.isoFit(-1, 13, -1, 13, [56, 56, 460, 356]);
    B.grid({ ...m, sx: 1, sy: 1, lx: 2, ly: 2 });

    // 直线 ax+by=c 在视野内的可见段
    B.plot(x => (c - a * x) / b, m, { stroke: '#5cadff', 'stroke-width': 2.2 });

    // 格点解
    const pts = [];
    for (let x = -2; x <= 14; x++) {
      const num = c - a * x;
      if (num % b !== 0) continue;
      const y = num / b;
      if (y < -2 || y > 14) continue;
      pts.push([x, y]);
    }
    pts.forEach(([x, y]) => B.dot(V(m.px(x), m.py(y)), 5.4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 }));

    // 一组特解：先找非负解，找不到就退回任意整数解
    let base = pts.find(([x, y]) => x >= 0 && y >= 0) || pts[pts.length - 1] || null;

    const RX = 566;
    B.tex(V(RX, 62), `$${a}x+${b}y=${c}$`, { size: 17, color: '#5cadff', w: 260 });
    B.tex(V(RX, 104), `$d=\\gcd(${a},${b})=${d}$`, { size: 14, color: '#aebdd2', w: 240 });
    B.tex(V(RX, 140), solvable ? `$${d}\\mid${c}$，有整数解` : `$${d}\\nmid${c}$，无整数解`, { size: 14, color: solvable ? '#4ade80' : '#ff7b8a', w: 260 });
    if (solvable && base) {
      B.tex(V(RX, 186), `特解 $(x_0,y_0)=(${base[0]},${base[1]})$`, { size: 14, color: '#ffd166', w: 280 });
      B.tex(V(RX, 226), '通解：', { size: 13, color: '#93a1b5', w: 200 });
      B.tex(V(RX, 258), `$${fmt(base[0], 0)}+\\dfrac{${b}}{${d}}t$`, { size: 13.5, color: '#aebdd2', w: 260 });
      B.tex(V(RX, 286), `$y=${base[1]}-\\dfrac{${a}}{${d}}t$`, { size: 13.5, color: '#aebdd2', w: 260 });
      B.tex(V(RX, 318), `$t\\in\\mathbb{Z}$，步长 $(${b / d},${-a / d})$`, { size: 12.5, color: '#93a1b5', w: 280 });
      B.tex(V(RX, 358), `视野内 ${pts.length} 个格点`, { size: 12.5, color: '#ffd166', w: 240 });
    } else {
      B.tex(V(RX, 186), '直线穿过整张网格，却不经过任何一个格点', { size: 12.5, color: '#93a1b5', w: 280 });
      B.tex(V(RX, 220), `$a x+b y$ 的整数值只能是 $d$ 的倍数`, { size: 12.5, color: '#93a1b5', w: 280 });
    }
    B.tex(V(RX, 400), '裴蜀等式：$ax+by$ 取遍 $d$ 的全部倍数', { size: 12, color: '#93a1b5', w: 290 });

    B.tex(V(W / 2, 444), '蓝色是方程的实直线，金点是它的整数解；能落到格点上的条件就是 $\\gcd(a,b)\\mid c$', { size: 12.5, color: '#93a1b5', w: 760, anchor: 'mid' });

    cD(`$${d}$`, '');
    cS(solvable && base ? `$(${base[0]},${base[1]})$` : '无', solvable ? 'ok' : 'warn');
    cJ(solvable ? `${pts.length} 个格点` : '无整数解', solvable ? 'ok' : 'warn');
  };

  B.slider('系数 a', 1, 6, 1, st.a, s => { st.a = Math.round(s); B.render(); });
  B.slider('系数 b', 1, 6, 1, st.b, s => { st.b = Math.round(s); B.render(); });
  B.slider('右端 c', 1, 30, 1, st.c, s => { st.c = Math.round(s); B.render(); });
  B.hintM('把 $a$、$b$ 改成有公因子的组合：直线照旧，格点却只出现在 $c$ 也含这个因子的时候');
  B.render();
  return B;
}
