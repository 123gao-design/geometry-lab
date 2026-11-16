import { Board, V, mk } from '../../../lib/board.js';

/* 环与域：Z_n 的乘法表。非零元之间乘出 0 就是零因子，说明只能停在环；
   n 为素数时每个非零元都可逆，乘法也有逆元，才升格为域。 */
function gcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a; }

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 6 };
  const cS = B.chipM('结构');
  const cZ = B.chipM('零因子');
  const cU = B.chipM('可逆元');

  B.renderFn = () => {
    const n = st.n, els = [...Array(n).keys()];
    const cell = Math.min(42, 330 / n), x0 = 84, y0 = 104;
    const isPrime = els.slice(2).every(d => n % d !== 0);
    const zeroDiv = els.filter(x => x > 0 && els.some(y => y > 0 && (x * y) % n === 0));
    const units = els.filter(x => x > 0 && gcd(x, n) === 1);
    B.textM(V(410, 30), `模 ${n} 乘法的运算表：先看加法，再看乘法`, { 'font-size': 15, fill: '#8fa3bd' });

    els.forEach((a, i) => {
      B.text(V(x0 + i * cell + cell / 2, y0 - 22), `${a}`, { 'font-size': 12, fill: '#67e8f9', 'text-anchor': 'middle' });
      B.text(V(x0 - 22, y0 + i * cell + cell / 2 + 4), `${a}`, { 'font-size': 12, fill: '#67e8f9', 'text-anchor': 'middle' });
    });
    els.forEach((a, i) => els.forEach((b, j) => {
      const v = (a * b) % n, x = x0 + j * cell, y = y0 + i * cell;
      const z = a > 0 && b > 0 && v === 0;
      const u = a > 0 && b > 0 && v === 1;
      mk('rect', {
        x, y, width: cell - 2, height: cell - 2, rx: 4,
        fill: z ? 'rgba(255,123,138,.25)' : u ? 'rgba(74,222,128,.20)' : a === 0 || b === 0 ? 'rgba(143,163,189,.10)' : 'rgba(92,173,255,.07)',
        stroke: z ? '#ff7b8a' : u ? 'rgba(74,222,128,.7)' : 'rgba(92,173,255,.20)', 'stroke-width': 1.1,
      }, B.dyn);
      B.text(V(x + cell / 2 - 1, y + cell / 2 + 4), `${v}`, { 'font-size': 12, fill: z ? '#ff7b8a' : u ? '#4ade80' : '#c9d7ea', 'text-anchor': 'middle' });
    }));
    B.text(V(x0, y0 + n * cell + 26), '红格 = 两个非零元乘出 0（零因子）；绿格 = 乘出 1（互逆）', { 'font-size': 12, fill: '#8fa3bd' });

    const rx = 470;
    B.tex(V(rx, 92), '(Z_n, +) 是交换群：0 为幺元，−a 为逆元', { size: 13, color: '#4ade80', w: 330 });
    B.tex(V(rx, 132), '(Z_n, +, ×) 是交换环：分配律把两个运算接起来', { size: 13, color: '#4ade80', w: 330 });
    B.tex(V(rx, 182), isPrime ? '每个非零元都可逆：乘法也有逆元' : `非零元不都可逆：${zeroDiv.join('、')} 是零因子`, { size: 13, color: isPrime ? '#4ade80' : '#ff7b8a', w: 330 });
    B.tex(V(rx, 232), isPrime ? `${n} 是素数，Z_${n} 是域` : `${n} 是合数，Z_${n} 只是环，不是域`, { size: 14, color: isPrime ? '#ffd166' : '#c084fc', w: 330 });
    B.tex(V(rx, 288), `可逆元共 ${units.length} 个：${units.join('、')}`, { size: 12, color: '#8fa3bd', w: 330 });
    B.tex(V(rx, 330), '层级：群 ⊂ 环 ⊂ 域（后一层多一个运算的逆元）', { size: 12, color: '#8fa3bd', w: 330 });
    const tip = isPrime ? '非零元全体在乘法下成群' : `${zeroDiv.length} 个零因子使约分失效，方程可能多解`;
    B.tex(V(rx, 386), tip, { size: 12, color: isPrime ? '#4ade80' : '#ff9e4a', w: 330 });

    cS(isPrime ? `域 $\\mathbb{F}_{${n}}$` : `环 $\\mathbb{Z}_{${n}}$`);
    cZ(zeroDiv.length === 0 ? '无' : `${zeroDiv.length} 个`);
    cU(`${units.length} 个`);
  };

  B.slider('模数 n', 4, 12, 1, st.n, v => { st.n = v; B.render(); });
  B.hint('把 n 从合数换到素数，红格全部消失，环升格为域');
  B.render();
  return B;
}
