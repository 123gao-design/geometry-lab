/* 图 概2a · 频率的稳定性
   一枚正面概率为 p 的硬币投 n 次，前 n 次里正面出现的比例画出频率折线。
   次数少时折线大幅上下摆动，次数增多后挤在 p 附近 —— 频率稳定于概率，这是用频率估计概率的依据。
   投掷序列由固定种子的伪随机数生成，同一个 n 每次看到的结果相同。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { p: .5, n: 200 };
  const cN = B.chipM('试验次数'), cF = B.chipM('正面频率'), cJ = B.chipM('判读');

  // 固定种子的伪随机序列：改变 p 或 n 只是换阈值、换长度，同一次投掷的读数不跳
  let seed = 20241110;
  const rnd = () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const U = Array.from({ length: 1200 }, rnd);

  const X0 = 110, X1 = 770, Y0 = 300, Y1 = 100;   // 图区：次数 1..n、频率 0..1
  const px = k => X0 + (X1 - X0) * (k - 1) / Math.max(1, st.n - 1);
  const py = f => Y0 - (Y0 - Y1) * f;

  B.renderFn = () => {
    const { p, n } = st;
    const hit = k => U[k - 1] < p;
    const heads = U.slice(0, n).filter(u => u < p).length;
    const f = heads / n;

    // 图区坐标与网格
    [0, .25, .5, .75, 1].forEach(v => {
      B.dyn.appendChild(mk('line', {
        x1: X0, y1: py(v), x2: X1, y2: py(v), stroke: '#3f5f8f', 'stroke-width': v === 0 ? 1.2 : 1,
        'stroke-opacity': v === 0 ? 1 : .45,
      }, B.dyn));
      B.text(V(X0 - 12, py(v) + 4), `${v}`, { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'end' });
    });
    B.text(V(X0 - 12, Y1 - 16), '频率', { fill: '#8fa3bd', 'font-size': 11.5, 'text-anchor': 'end' });
    B.text(V(X1, Y0 + 22), '投掷次数', { fill: '#8fa3bd', 'font-size': 11.5, 'text-anchor': 'end' });

    // 目标概率与 2 倍标准差的范围
    B.dyn.appendChild(mk('line', {
      x1: X0, y1: py(p), x2: X1, y2: py(p), stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5',
    }, B.dyn));
    B.text(V(X0 + 6, py(p) - 8), `p=${p}`, { fill: '#ffd166', 'font-size': 11.5, 'text-anchor': 'start' });

    // 最近 48 次的结果条：金为正面、蓝为反面
    const m = Math.min(48, n);
    for (let i = 0; i < m; i++) {
      const k = n - m + i + 1;
      B.dyn.appendChild(mk('rect', {
        x: X0 + i * 13, y: 56, width: 11, height: 12, rx: 2.5,
        fill: hit(k) ? '#ffd166' : '#5cadff', 'fill-opacity': hit(k) ? .85 : .45,
      }, B.dyn));
    }
    B.text(V(X0, 44), '最近若干次的结果（金为正面）', { fill: '#8fa3bd', 'font-size': 11.5, 'text-anchor': 'start' });

    // 频率折线
    const step = Math.max(1, Math.floor(n / 400));
    let d = '';
    for (let k = 1; k <= n; k += step) {
      const cnt = U.slice(0, k).filter(u => u < p).length;
      d += `${k === 1 ? 'M' : 'L'} ${px(k).toFixed(1)} ${py(cnt / k).toFixed(1)} `;
    }
    d += `L ${px(n).toFixed(1)} ${py(f).toFixed(1)}`;
    B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.8 }, B.dyn));
    B.dot(V(px(n), py(f)), 4.5, { fill: '#ff7b8a' });

    const sd = Math.sqrt(p * (1 - p) / n), gap = Math.abs(f - p);
    cN(`$n=${n}$，正面 ${heads} 次`);
    cF(`$\\dfrac{${heads}}{${n}}\\approx${f.toFixed(3)}$`);
    cJ(gap <= 2 * sd
      ? `与 p 相差 ${gap.toFixed(3)}，在 2 倍标准差 ${(2 * sd).toFixed(3)} 之内，频率稳定在概率附近`
      : `与 p 相差 ${gap.toFixed(3)}，超出 2 倍标准差 ${(2 * sd).toFixed(3)}，次数少时折线还会大幅摆动`);
  };

  B.slider('正面概率 p', .1, .9, .05, st.p, v => { st.p = v; B.render(); }, 'p');
  B.slider('试验次数 n', 5, 1200, 5, st.n, v => { st.n = v; B.render(); }, 'n');

  B.hint('次数少时折线上下乱跳，次数一多就贴住 p 那条虚线');
  B.render();
  return B;
}
