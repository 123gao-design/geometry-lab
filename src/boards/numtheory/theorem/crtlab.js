/* 图 定4 · 中国剩余定理机
   同余组 x ≡ a (mod m₁)、x ≡ b (mod m₂) 把 x 同时投影到两条刻度线上。
   m₁、m₂ 互素时，m₁×m₂ 个「(余数, 余数)」组合各对应唯一的 x（0 ≤ x < m₁m₂），
   交错表的每一格都能填满；不互素时有些格子空着，整体解回到一条模 lcm 的类。
   三个滑块：m₁、m₂（3..6）、x（0..35）。 */
import { Board, V, mk } from '../../../lib/board.js';

const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { m1: 3, m2: 5, x: 7 };

  const c1 = B.chipM('$x\\bmod m_1$'), c2 = B.chipM('$x\\bmod m_2$'), cJ = B.chipM('判读');
  const CW = 66, CH = 38, X0 = 72;

  B.renderFn = () => {
    const { m1, m2 } = st;
    const M = m1 * m2;
    const x = ((st.x % M) + M) % M;
    const r1 = x % m1, r2 = x % m2;
    const cop = gcd(m1, m2) === 1;

    // 两条刻度线
    const line = (y, m, hit, color, label) => {
      B.tex(V(X0 - 16, y + 14), label, { size: 12.5, color: '#93a1b5', w: 40, anchor: 'end' });
      for (let k = 0; k < m; k++) {
        const cx = X0 + k * CW;
        const on = k === hit;
        B.dyn.appendChild(mk('rect', { x: cx, y, width: CW - 6, height: 28, rx: 5, fill: color, 'fill-opacity': on ? .22 : .05, stroke: color, 'stroke-opacity': on ? .95 : .3, 'stroke-width': on ? 1.6 : 1 }, B.dyn));
        B.tex(V(cx + (CW - 6) / 2, y + 14), `$${k}$`, { size: 12.5, color: on ? color : '#93a1b5', w: 26, anchor: 'mid' });
      }
    };
    line(64, m1, r1, '#ffd166', '$m_1$');
    line(114, m2, r2, '#c084fc', '$m_2$');

    // 交错表：行是 r₂，列是 r₁，格内写唯一的 x
    const GX = X0, GY = 188, cellW = 62, cellH = 34;
    B.tex(V(GX + m1 * cellW / 2, GY - 14), '$x\\bmod m_1$', { size: 12, color: '#ffd166', w: 140, anchor: 'mid' });
    B.tex(V(GX - 18, GY + m2 * cellH / 2), '$x\\bmod m_2$', { size: 12, color: '#c084fc', w: 60, anchor: 'end' });
    const first = new Map();
    for (let v = 0; v < M; v++) {
      const key = (v % m1) + ',' + (v % m2);
      if (!first.has(key)) first.set(key, v);
    }
    for (let j = 0; j < m2; j++) for (let i = 0; i < m1; i++) {
      const cx = GX + i * cellW, cy = GY + j * cellH;
      const val = first.get(i + ',' + j);
      const on = i === r1 && j === r2;
      B.dyn.appendChild(mk('rect', {
        x: cx, y: cy, width: cellW - 5, height: cellH - 5, rx: 5,
        fill: on ? '#ff9e4a' : '#8fa3bd', 'fill-opacity': on ? .28 : .05,
        stroke: on ? '#ff9e4a' : '#8fa3bd', 'stroke-opacity': on ? 1 : .25, 'stroke-width': on ? 1.8 : 1,
      }, B.dyn));
      B.tex(V(cx + (cellW - 5) / 2, cy + (cellH - 5) / 2), val === undefined ? '—' : `$${val}$`, { size: 12, color: on ? '#ff9e4a' : (val === undefined ? '#93a1b5' : '#aebdd2'), w: 30, anchor: 'mid' });
    }

    const RX = 500;
    B.tex(V(RX, 62), `$x=${x}$`, { size: 17, color: '#ff9e4a', w: 200 });
    B.tex(V(RX, 100), `$x\\equiv${r1}\\ (\\mathrm{mod}\\ ${m1})$`, { size: 14.5, color: '#ffd166', w: 240 });
    B.tex(V(RX, 134), `$x\\equiv${r2}\\ (\\mathrm{mod}\\ ${m2})$`, { size: 14.5, color: '#c084fc', w: 240 });
    B.tex(V(RX, 178), cop ? `$${m1}\\cdot${m2}=${M}$ 个组合，各有一解` : `$\\gcd(${m1},${m2})=${gcd(m1, m2)}>1$`, { size: 13, color: cop ? '#4ade80' : '#ff7b8a', w: 280 });
    B.tex(V(RX, 214), cop ? `$x$ 在模 $${M}$ 内唯一` : `整体周期是 $\\operatorname{lcm}=${M / gcd(m1, m2)}$`, { size: 13, color: '#aebdd2', w: 280 });
    B.tex(V(RX, 258), '格内数字：取得这对余数的最小非负 $x$', { size: 12, color: '#93a1b5', w: 290 });

    B.tex(V(W / 2, 420), '两把刻度尺并行，交错的每一格都对应唯一一个 $x$；互素时全满，不互素时留空', { size: 12.5, color: '#93a1b5', w: 720, anchor: 'mid' });

    c1(`$${r1}$`, '');
    c2(`$${r2}$`, '');
    cJ(cop ? '模数互素，组合唯一' : '模数不互素，解不唯一', cop ? 'ok' : 'warn');
  };

  B.slider('模 m₁', 3, 6, 1, st.m1, s => { st.m1 = Math.round(s); B.render(); });
  B.slider('模 m₂', 3, 6, 1, st.m2, s => { st.m2 = Math.round(s); B.render(); });
  B.slider('x', 0, 35, 1, st.x, s => { st.x = Math.round(s); B.render(); });
  B.hintM('拖动 $x$：两条刻度线上的落点一起走，交错表里对应的一格始终只有它一个');
  B.render();
  return B;
}
