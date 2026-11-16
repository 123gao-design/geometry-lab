/* 图 整2 · 最大公约数与欧几里得算法机
   长 a、宽 b 的矩形反复用正方形去铺：先沿长边排满边长为 b 的正方形，
   余下的一条窄矩形再沿它的短边排……排到不剩空隙时，最后一块正方形的边长就是 gcd(a,b)。
   右栏同步列出每一步的带余除法，并给出裴蜀系数 x、y 使 ax + by = gcd。 */
import { Board, V, mk } from '../../../lib/board.js';

const COL = ['#ffd166', '#5cadff', '#c084fc', '#67e8f9', '#4ade80', '#ff9e4a'];

function euclid(a, b) {
  const steps = [];
  let x = a, y = b;
  while (y > 0) {
    const q = Math.floor(x / y), r = x - q * y;
    steps.push({ x, y, q, r });
    x = y; y = r;
  }
  return { g: x, steps };
}
function bezout(a, b) {
  if (b === 0) return { g: a, x: 1, y: 0 };
  const t = bezout(b, a % b);
  return { g: t.g, x: t.y, y: t.x - Math.floor(a / b) * t.y };
}
// 矩形被正方形铺满时的摆法：每次沿当前较长的一边排满正方形
function tilt(a, b) {
  const out = [];
  let x = 0, y = 0, w = a, h = b, k = 0;
  for (let guard = 0; guard < 200 && w > 1e-9 && h > 1e-9; guard++) {
    if (w >= h) {
      const n = Math.floor(w / h + 1e-9);
      for (let i = 0; i < n; i++) out.push({ x: x + i * h, y, s: h, k });
      x += n * h; w -= n * h;
    } else {
      const n = Math.floor(h / w + 1e-9);
      for (let i = 0; i < n; i++) out.push({ x, y: y + i * w, s: w, k });
      y += n * w; h -= n * w;
    }
    k++;
  }
  return out;
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 30, b: 18 };

  const cG = B.chipM('最大公约数'), cS = B.chipM('步数'), cB = B.chipM('裴蜀等式');

  B.renderFn = () => {
    const a = Math.max(st.a, 1), b = Math.max(st.b, 1);
    const { g, steps } = euclid(a, b);
    const bz = bezout(a, b);
    const s = Math.min(440 / a, 288 / b);
    const X0 = 52, Y0 = 58;

    B.dyn.appendChild(mk('rect', { x: X0, y: Y0, width: a * s, height: b * s, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 1.6 }, B.dyn));
    tilt(a, b).forEach(q => {
      const c = COL[q.k % COL.length];
      B.dyn.appendChild(mk('rect', { x: X0 + q.x * s, y: Y0 + q.y * s, width: q.s * s, height: q.s * s, fill: c, 'fill-opacity': .16, stroke: c, 'stroke-width': 1.4 }, B.dyn));
    });
    // 边长标注
    B.tex(V(X0 + a * s / 2, Y0 - 12), `$a=${a}$`, { size: 13, color: '#93a1b5', w: 80, anchor: 'mid' });
    B.tex(V(X0 - 14, Y0 + b * s / 2), `$b=${b}$`, { size: 13, color: '#93a1b5', w: 40, anchor: 'end' });
    B.tex(V(X0 + a * s / 2, Y0 + b * s + 30), `最后一块正方形的边长就是 $\\gcd=${g}$`, { size: 13, color: '#4ade80', w: 300, anchor: 'mid' });

    // 右栏：辗转相除的每一步
    const RX = 560;
    B.tex(V(RX, 62), '辗转相除', { size: 14, color: '#ffd166', w: 120 });
    steps.slice(0, 7).forEach((t, i) => {
      B.tex(V(RX, 96 + i * 30), `$${t.x}=${t.q}\\times ${t.y}+${t.r}$`, { size: 13.5, color: i === steps.length - 1 ? '#4ade80' : '#aebdd2', w: 250 });
    });
    if (steps.length > 7) B.tex(V(RX, 96 + 7 * 30), `…… 共 ${steps.length} 步`, { size: 12.5, color: '#93a1b5', w: 220 });
    B.tex(V(RX, 96 + Math.min(steps.length, 7) * 30 + 30), `$\\gcd(${a},${b})=${g}$`, { size: 16, color: '#4ade80', w: 250 });
    B.tex(V(RX, 96 + Math.min(steps.length, 7) * 30 + 64), `$${a}\\times(${bz.x})+${b}\\times(${bz.y})=${g}$`, { size: 14, color: '#c084fc', w: 260 });

    cG(`$\\gcd(${a},${b})=${g}$`, '');
    cS(`${steps.length} 步`, '');
    cB(`$${a}\\cdot(${bz.x})+${b}\\cdot(${bz.y})=${g}$`, '');
  };

  B.slider('长边 a', 8, 40, 1, st.a, s => { st.a = Math.round(s); B.render(); });
  B.slider('宽边 b', 4, 26, 1, st.b, s => { st.b = Math.round(s); B.render(); });
  B.hintM('用正方形铺满矩形：铺到不剩空隙时，最后一块的边长就是最大公约数');
  B.render();
  return B;
}
