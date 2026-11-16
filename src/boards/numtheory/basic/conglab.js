/* 图 整3 · 同余机
   模 m 的表盘上有 m 个刻度，数字 a、b 各自落在自己的刻度上。
   两枚指针落在一起，就说明 a ≡ b (mod m)，也就是 a − b 是 m 的整数倍。
   三个滑块：模 m（3..12）、a（0..60）、b（0..60）。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { m: 7, a: 47, b: 26 };
  const CX = 268, CY = 238, R = 150;

  const cRa = B.chipM('$a\\bmod m$'), cRb = B.chipM('$b\\bmod m$'), cD = B.chipM('$a-b$'), cJ = B.chipM('判读');
  const ang = (k, m) => -Math.PI / 2 - k * Math.PI * 2 / m;
  const at = (k, m, r = R) => V(CX + r * Math.cos(ang(k, m)), CY + r * Math.sin(ang(k, m)));

  B.renderFn = () => {
    const { m, a, b } = st;
    const ra = ((a % m) + m) % m, rb = ((b % m) + m) % m;
    const eq = ra === rb;

    B.dyn.appendChild(mk('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 1.5, 'stroke-dasharray': '5 6' }, B.dyn));
    for (let k = 0; k < m; k++) {
      const p1 = at(k, m, R - 6), p2 = at(k, m, R + 8);
      B.seg(p1, p2, { stroke: '#93a1b5', 'stroke-width': 1.4, 'stroke-opacity': .75 });
      const pl = at(k, m, R + 24);
      B.tex(pl, `$${k}$`, { size: 12.5, color: '#aebdd2', w: 26, anchor: 'mid' });
    }
    // 刻度 0 单独标出
    B.tex(at(0, m, R + 44), '模 $m$ 的余数', { size: 11.5, color: '#93a1b5', w: 100, anchor: 'mid' });

    // a、b 的指针：落点相同时错开半径，两根都看得见
    const pa = at(ra, m), pb = at(rb, m, eq ? R - 26 : R);
    B.seg(V(CX, CY), pa, { stroke: '#ffd166', 'stroke-width': 2.2 });
    B.seg(V(CX, CY), pb, { stroke: '#c084fc', 'stroke-width': 2.2, 'stroke-opacity': .9 });
    B.dot(pa, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.dot(pb, 6, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.dot(V(CX, CY), 4, { fill: '#93a1b5' });
    B.tex(V(CX + 12, CY - 10), `$a=${a}$`, { size: 13, color: '#ffd166', w: 70 });
    B.tex(V(CX + 12, CY + 18), `$b=${b}$`, { size: 13, color: '#c084fc', w: 70 });

    if (eq) {
      B.tex(V(CX, CY + R + 66), '两根指针落在同一刻度', { size: 13.5, color: '#4ade80', w: 260, anchor: 'mid' });
    }

    // 右栏：带余除法与差
    const qa = Math.floor(a / m), qb = Math.floor(b / m);
    const RX = 540;
    B.tex(V(RX, 76), `$${a}=${m}\\times ${qa}+${ra}$`, { size: 15, color: '#ffd166', w: 250 });
    B.tex(V(RX, 112), `$${b}=${m}\\times ${qb}+${rb}$`, { size: 15, color: '#c084fc', w: 250 });
    B.tex(V(RX, 160), `$a-b=${a - b}$`, { size: 15, color: '#aebdd2', w: 200 });
    B.tex(V(RX, 196), `$\\dfrac{a-b}{m}=${((a - b) / m).toFixed(3)}$`, { size: 14, color: '#aebdd2', w: 200 });
    B.tex(V(RX, 254), eq ? `$${a}\\equiv ${b}\\ (\\mathrm{mod}\\ ${m})$` : `$${a}\\not\\equiv ${b}\\ (\\mathrm{mod}\\ ${m})$`,
      { size: 16, color: eq ? '#4ade80' : '#ff7b8a', w: 260 });
    B.tex(V(RX, 292), eq ? '$a-b$ 是 $m$ 的整数倍' : `$a-b=${a - b}$ 不是 ${m} 的整数倍`, { size: 13, color: eq ? '#4ade80' : '#ff7b8a', w: 240 });

    B.tex(V(W / 2, 424), '同余只看余数：a 与 b 相差整数个 m，就在同一个刻度上', { size: 12.5, color: '#93a1b5', w: 620, anchor: 'mid' });

    cRa(`$a\\bmod m=${ra}$`, '');
    cRb(`$b\\bmod m=${rb}$`, '');
    cD(`$a-b=${a - b}$`, '');
    cJ(eq ? `同余` : `不同余`, eq ? 'ok' : '');
  };

  B.slider('模 m', 3, 12, 1, st.m, s => { st.m = Math.round(s); B.render(); });
  B.slider('数 a', 0, 60, 1, st.a, s => { st.a = Math.round(s); B.render(); });
  B.slider('数 b', 0, 60, 1, st.b, s => { st.b = Math.round(s); B.render(); });
  B.hintM('两枚指针落在同一刻度即 $a\\equiv b\\ (\\mathrm{mod}\\ m)$，此时 $a-b$ 是 $m$ 的整数倍');
  B.render();
  return B;
}
