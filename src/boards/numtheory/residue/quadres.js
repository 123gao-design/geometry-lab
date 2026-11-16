/* 图 剩1 · 二次剩余与欧拉判别式机
   模素数 p 下，把 1..p−1 逐个列开：能写成 x² 的数值标金，标灰的是非剩余。
   每一格底部写上它的平方根 x 与 p−x——剩余恰有两根，非剩余一根也没有。
   下方用滑块选一个 a，直接读方程 x²≡a 的解与欧拉判别式 a^{(p−1)/2} mod p。
   两个滑块：素数 p（七档）、a。 */
import { Board, V, mk } from '../../../lib/board.js';

const PR = [7, 11, 13, 17, 19, 23];
const pw = (b, e, m) => { let r = 1 % m; b %= m; while (e > 0) { if (e & 1) r = r * b % m; b = b * b % m; e >>= 1; } return r; };

export function createBoard(root) {
  const W = 840, H = 470;
  const B = new Board(root, W, H);
  const st = { pi: 0, a: 2 };

  const cN = B.chipM('二次剩余个数'), cE = B.chipM('欧拉判别式'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const p = PR[st.pi];
    const n = p - 1;
    const a = Math.min(st.a, p - 1);
    const roots = [];
    for (let v = 1; v < p; v++) {
      const rs = [];
      for (let x = 1; x < p; x++) if (x * x % p === v) rs.push(x);
      roots.push([v, rs]);
    }
    const sols = (roots.find(r => r[0] === a) || [0, []])[1];
    const eul = pw(a, n / 2, p);
    const cnt = roots.filter(r => r[1].length > 0).length;

    // 数值表：每格一个 v，金=剩余、灰=非剩余
    const cw = Math.min(44, 700 / n), ch = 58, X0 = 60, Y0 = 64;
    roots.forEach(([v, rs], i) => {
      const x = X0 + i * cw, y = Y0;
      const hit = v === a;
      const gold = rs.length > 0;
      B.dyn.appendChild(mk('rect', {
        x, y, width: cw - 4, height: ch, rx: 6,
        fill: gold ? '#ffd166' : '#8fa3bd', 'fill-opacity': hit ? .3 : (gold ? .14 : .05),
        stroke: hit ? '#ff9e4a' : (gold ? '#ffd166' : '#8fa3bd'),
        'stroke-opacity': hit ? 1 : (gold ? .85 : .28), 'stroke-width': hit ? 2.2 : 1.2,
      }, B.dyn));
      B.tex(V(x + (cw - 4) / 2, y + 20), `$${v}$`, { size: 15, color: gold ? '#ffd166' : '#93a1b5', w: 40, anchor: 'mid' });
      B.tex(V(x + (cw - 4) / 2, y + 42), rs.length ? rs.join(',') : '无根', { size: 10.5, color: gold ? '#aebdd2' : '#93a1b5', w: cw + 6, anchor: 'mid' });
    });
    B.tex(V(46, Y0 + 22), '$v$', { size: 14, color: '#93a1b5', w: 30, anchor: 'end' });
    B.tex(V(46, Y0 + 44), '根 $x$', { size: 10.5, color: '#93a1b5', w: 44, anchor: 'end' });
    B.tex(V(X0, Y0 + ch + 26), `模 $${p}$：金色 ${cnt} 个是二次剩余，灰色 ${n - cnt} 个不是`, { size: 13, color: '#aebdd2', w: 620 });

    // 当前 a 的方程与判别式
    const BY = 208;
    B.dyn.appendChild(mk('rect', { x: 60, y: BY, width: 720, height: 128, rx: 10, fill: '#8fa3bd', 'fill-opacity': .05, stroke: '#8fa3bd', 'stroke-opacity': .28, 'stroke-width': 1 }, B.dyn));
    B.tex(V(84, BY + 26), `$x^2\\equiv${a}\\ (\\mathrm{mod}\\ ${p})$`, { size: 16, color: '#ff9e4a', w: 300 });
    B.tex(V(84, BY + 62), sols.length ? `解：$${sols.map(v => `x\\equiv${v}`).join('\\ \\text{or}\\ ')}\\ (\\mathrm{mod}\\ ${p})$` : '解：无解', { size: 15, color: sols.length ? '#4ade80' : '#ff7b8a', w: 420 });
    B.tex(V(84, BY + 98), `$a^{\\frac{p-1}{2}}=${a}^{${n / 2}}\\equiv${eul}\\ (\\mathrm{mod}\\ ${p})$`, { size: 14.5, color: eul === 1 ? '#ffd166' : '#c084fc', w: 420 });
    B.tex(V(540, BY + 26), '欧拉判别式', { size: 13, color: '#93a1b5', w: 200 });
    B.tex(V(540, BY + 58), eul === 1 ? '$\\equiv1$：$a$ 是二次剩余' : '$\\equiv-1$：$a$ 不是二次剩余', { size: 13, color: eul === 1 ? '#ffd166' : '#c084fc', w: 240 });
    B.tex(V(540, BY + 92), sols.length === 2 ? '两根为 $x$ 与 $p-x$' : '非剩余没有平方根', { size: 12.5, color: '#93a1b5', w: 240 });

    B.tex(V(W / 2, 430), '每格下面写的是它的平方根：剩余恰有两个，非剩余一个也没有；平方根的个数非零即二', { size: 12.5, color: '#93a1b5', w: 760, anchor: 'mid' });

    cN(`$${cnt}=\\dfrac{${p}-1}{2}$`, '');
    cE(`$${eul}$`, eul === 1 ? 'ok' : 'warn');
    cJ(sols.length ? `两根 ${sols.join('、')}` : '非二次剩余', sols.length ? 'ok' : 'warn');
  };

  B.slider('素数 p', 0, 5, 1, st.pi, s => { st.pi = Math.round(s); B.render(); });
  B.slider('a', 1, 22, 1, st.a, s => { st.a = Math.round(s); B.render(); });
  B.hintM('把 $a$ 调到某格上：该格描金边，下方立即给出它的两个平方根或「无解」');
  B.render();
  return B;
}
