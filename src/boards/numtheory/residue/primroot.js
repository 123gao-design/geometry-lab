/* 图 剩2 · 原根与指数机
   模素数 p 的表盘上，从一个底数 g 出发反复乘 g：1, g, g², …
   g 是原根时这条轨道恰好走遍 1..p−1 的全部 p−1 个格，指数 k 与余数一一对应；
   不是原根时轨道提前闭合，只剩一个真子群。
   两个滑块：素数 p（四档）、底数 g。 */
import { Board, V, mk } from '../../../lib/board.js';

const PR = [7, 11, 13, 17];

function phi(n) {
  let r = n, x = n;
  for (let p = 2; p * p <= x; p++) if (x % p === 0) { while (x % p === 0) x /= p; r = r / p * (p - 1); }
  if (x > 1) r = r / x * (x - 1);
  return r;
}

export function createBoard(root) {
  const W = 840, H = 470;
  const B = new Board(root, W, H);
  const st = { pi: 0, g: 3 };
  const CX = 250, CY = 240, R = 148;

  const cOrd = B.chipM('阶'), cNum = B.chipM('原根个数'), cJ = B.chipM('判读');
  const ang = (v, p) => -Math.PI / 2 - (v % p) * Math.PI * 2 / p;
  const at = (v, p, r = R) => V(CX + r * Math.cos(ang(v, p)), CY + r * Math.sin(ang(v, p)));

  B.renderFn = () => {
    const p = PR[st.pi];
    const g = Math.min(st.g, p - 1);

    // 轨道：1 → g → g² → …，直到回到 1
    const seq = [1 % p];
    let v = 1 % p;
    for (let k = 1; k <= p; k++) {
      v = v * g % p;
      if (v === seq[0]) break;
      seq.push(v);
    }
    const order = seq.length;
    const primitive = order === p - 1;
    // 原根个数 = φ(p−1)
    let gcnt = 0;
    for (let u = 2; u < p; u++) {
      let w = 1 % p, ord = -1;
      for (let k = 1; k <= p - 1; k++) { w = w * u % p; if (w === 1) { ord = k; break; } }
      if (ord === p - 1) gcnt++;
    }

    B.dyn.appendChild(mk('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 1.4, 'stroke-dasharray': '5 6' }, B.dyn));
    for (let k = 0; k < p; k++) {
      B.seg(at(k, p, R - 6), at(k, p, R + 8), { stroke: '#93a1b5', 'stroke-width': 1.2, 'stroke-opacity': .65 });
      B.tex(at(k, p, R + 23), `$${k}$`, { size: 12, color: '#aebdd2', w: 24, anchor: 'mid' });
    }
    // 轨道连线与落点
    for (let i = 1; i < seq.length; i++) B.seg(at(seq[i - 1], p), at(seq[i], p), { stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-opacity': .6 });
    seq.forEach(vv => {
      const pt = at(vv, p);
      const gold = vv === 1;
      B.dot(pt, gold ? 6.5 : 5, { fill: gold ? '#ffd166' : '#67e8f9', stroke: '#0a0d14', 'stroke-width': 1.3 });
    });
    B.tex(V(CX, CY + R + 46), primitive ? '一条轨道走遍全部 ' + (p - 1) + ' 个非零余数' : '轨道提前闭合，只覆盖 ' + seq.length + ' 个余数', { size: 13, color: primitive ? '#4ade80' : '#ff9e4a', w: 340, anchor: 'mid' });

    const RX = 512;
    B.tex(V(RX, 58), `$p=${p},\\ g=${g}$`, { size: 15, color: '#ffd166', w: 220 });
    B.tex(V(RX, 96), `阶 $\\operatorname{ord}=${order}$`, { size: 14.5, color: primitive ? '#4ade80' : '#ff9e4a', w: 240 });
    B.tex(V(RX, 132), `$p-1=${p - 1}$`, { size: 14, color: '#aebdd2', w: 200 });
    B.tex(V(RX, 168), primitive ? '$g$ 是模 $p$ 的原根' : '$g$ 不是原根', { size: 14.5, color: primitive ? '#4ade80' : '#ff7b8a', w: 260 });
    B.tex(V(RX, 210), `原根个数 $\\varphi(${p - 1})=${gcnt}$`, { size: 13.5, color: '#c084fc', w: 280 });
    B.tex(V(RX, 250), '指数表 $g^{k}\\equiv$', { size: 13, color: '#93a1b5', w: 240 });
    const tbl = seq.slice(0, Math.min(8, seq.length)).map((vv, i) => `${i}\\!\\to\\!${vv}`).join(',\\ ');
    B.tex(V(RX, 282), `$${tbl}$`, { size: 12.5, color: '#aebdd2', w: 300 });
    B.tex(V(RX, 320), '原根存在时，每个非零余数都可写作', { size: 12, color: '#93a1b5', w: 300 });
    B.tex(V(RX, 344), '$g^{k}$，指数 $k$ 称为它的指标', { size: 12, color: '#93a1b5', w: 300 });

    B.tex(V(W / 2, 434), '原根把乘法变成指数上的加法：$g^{i}g^{j}=g^{i+j}$，指标对 $p-1$ 取模', { size: 12.5, color: '#93a1b5', w: 740, anchor: 'mid' });

    cOrd(`$${order}$`, primitive ? 'ok' : 'warn');
    cNum(`$\\varphi(${p - 1})=${gcnt}$`, '');
    cJ(primitive ? '原根' : `阶 $${order}\\mid${p - 1}$`, primitive ? 'ok' : '');
  };

  B.slider('素数 p', 0, 3, 1, st.pi, s => { st.pi = Math.round(s); B.render(); });
  B.slider('底数 g', 2, 16, 1, st.g, s => { st.g = Math.round(s); B.render(); });
  B.hintM('逐步换 $g$：只有原根才能让青色轨道一次走遍表盘上的全部非零余数');
  B.render();
  return B;
}
