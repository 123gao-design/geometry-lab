/* 图 恒2 · 近似计算与整除性
   把 (1+a)^n 按二项式定理展开：前两项 1+na，从第三项起每一项都带 a²。
   a 很小时，后面的项小到可以舍去，得到近似值 1+na+C(n,2)a²；
   a 是整数时，舍去的部分恰好是 a² 的整数倍，于是 (1+a)^n 与 1+na 相差 a² 的倍数。
   画布把各项画成柱，保留的部分金色、其余淡蓝，柱高按平方根压缩（除以往上最高的那一根）。
   a 取小数时余项贴着轴线，右上方另开一格把它们单独放大，读数写成科学记数法。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, n: 5, a: 2 };
  const cF = B.chipM('截断式'), cV = B.chipM('数值'), cJ = B.chipM('判读');

  const CN = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };
  const sciTex = v => {
    if (!(v > 0)) return '0';
    const e = Math.floor(Math.log10(v)), m = v / 10 ** e;
    return `${m.toFixed(1)}\\times10^{${e}}`;
  };
  /* 柱顶读数：量级平常写普通数，过大或过小改写科学记数法（公式段交给 KaTeX） */
  const showVal = (px, y, v, color, size) => {
    if (!(v > 0)) return;
    if (v >= 1e5 || v < 1e-3) B.textM(V(px, y), `$${sciTex(v)}$`, { 'font-size': size, fill: color });
    else B.text(V(px, y), `${v >= 1 ? Math.round(v) : +v.toFixed(4)}`, { fill: color, 'font-size': size });
  };

  B.renderFn = () => {
    const { n, a } = st;
    const x = st.mode === 0 ? a / 100 : a;
    const terms = Array.from({ length: n + 1 }, (_, k) => CN(n, k) * x ** k);
    const top = Math.max(...terms);
    const base = 300;
    // 整除档没有右上的放大格，柱子可以画得更高，把画框用满
    const hiMax = st.mode === 0 ? 170 : 230, sc = v => hiMax * Math.sqrt(Math.max(v, 0) / top);
    const pitch = 660 / (n + 1), bw = Math.min(56, pitch * .62);
    const x0 = 410 - (n + 1) * pitch / 2 + pitch / 2;
    const keep = st.mode === 0 ? 3 : 2;
    const fs = n >= 10 ? 9.5 : 10.5;
    // 余项放大格的位置先定下来：近似档里舍去的柱子贴着轴线，读数挪进这一格
    const ins0 = Math.max(310, Math.round(x0 + keep * pitch + 26));
    const insetOn = st.mode === 0 && n >= keep && 792 - ins0 >= 120;

    for (let k = 0; k <= n; k++) {
      const px = x0 + k * pitch, h = Math.max(2, sc(terms[k])), on = k < keep;
      B.dyn.appendChild(mk('rect', {
        x: px - bw / 2, y: base - h, width: bw, height: h, rx: 4,
        fill: on ? '#ffd166' : '#5cadff', 'fill-opacity': on ? .6 : .14,
        stroke: on ? '#ffd166' : '#3f5f8f', 'stroke-width': on ? 1.4 : 1,
      }, B.dyn));
      // 近似档里舍去的柱子只有两三像素，读数挪进放大格；格子放不下时退回主图直接标
      // 整除档各项都很大，n 大时隔一根标一次，免得读数挤成一串
      const show = st.mode === 1
        ? (n < 9 || k % 2 === 0 || k === n)
        : (on || !insetOn);
      if (show) showVal(px, base - h - 9, terms[k], on ? '#ffd166' : '#8fa3bd', fs);
      B.text(V(px, base + 18), `${k}`, { fill: '#8fa3bd', 'font-size': 11.5 });
    }
    B.dyn.appendChild(mk('line', { x1: 60, y1: base, x2: 760, y2: base, stroke: '#5c6a80', 'stroke-width': 1.2 }, B.dyn));
    B.text(V(410, 340), '横轴是 a 的次数 k，柱高按平方根压缩', { fill: '#8fa3bd', 'font-size': 12 });

    // 金色柱与后面各项之间的分界
    if (keep <= n) {
      const dx = x0 + (keep - .5) * pitch;
      B.dyn.appendChild(mk('line', {
        x1: dx, y1: 168, x2: dx, y2: base - 2,
        stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '4 5', 'stroke-opacity': .55,
      }, B.dyn));
      B.textM(V(dx, 158), st.mode === 0 ? '余项' : '含 $a^{2}$', { 'font-size': 10.5, fill: '#ffd166' });
    }

    // 余项放大格：单独定高，把贴着轴线的几根柱拉开
    if (insetOn) {
      const ix0 = ins0, ix1 = 792, iy0 = 44, iy1 = 204;
      B.dyn.appendChild(mk('rect', {
        x: ix0, y: iy0, width: ix1 - ix0, height: iy1 - iy0, rx: 11,
        fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 1,
      }, B.dyn));
      B.text(V((ix0 + ix1) / 2, iy0 + 16), `余项放大：第 ${keep + 1} 项起`, { fill: '#8fa3bd', 'font-size': 11.5 });
      const tail = terms.slice(keep), nb = tail.length, mt = Math.max(...tail);
      const span = ix1 - ix0 - 28, pi = nb <= 4 ? span / nb : Math.min(40, span / nb);
      const bi = Math.min(22, pi * .58);
      const c0 = (ix0 + ix1) / 2 - (nb - 1) * pi / 2, bY = iy1 - 24, hi = 64;
      B.dyn.appendChild(mk('line', {
        x1: ix0 + 12, y1: bY, x2: ix1 - 12, y2: bY, stroke: '#3f5f8f', 'stroke-width': 1,
      }, B.dyn));
      // 首尾两项必标，最大的一项位置不挤时也标出来，其余留给柱高比较
      const im = tail.indexOf(mt), marks = new Set([0, nb - 1]);
      if (im >= 2 && nb - 1 - im >= 2) marks.add(im);
      tail.forEach((v, i) => {
        const px = c0 + i * pi, h = 5 + hi * Math.sqrt(v / mt);
        B.dyn.appendChild(mk('rect', {
          x: px - bi / 2, y: bY - h, width: bi, height: h, rx: 3,
          fill: '#5cadff', 'fill-opacity': .22, stroke: '#3f5f8f', 'stroke-width': 1,
        }, B.dyn));
        B.text(V(px, bY + 13), `${keep + i}`, { fill: '#8fa3bd', 'font-size': 10.5 });
        if (marks.has(i)) showVal(px, bY - h - 9, v, '#67e8f9', 10.5);
      });
    }

    const total = terms.reduce((s, v) => s + v, 0);
    if (st.mode === 0) {
      const approx = terms[0] + terms[1] + (n >= 2 ? terms[2] : 0);
      const err = total - approx, rel = err / total;
      cF(`$1+${n}x+${CN(n, 2)}x^{2}=${approx.toFixed(4)}$`);
      cV(`$(1+x)^{${n}}=${total.toFixed(6)}$`);
      cJ(rel < 1e-3
        ? `x=${a / 100} 时舍去第 3 项以后的部分，误差约 $${sciTex(err)}$，取到二次项已经够用`
        : rel < 2e-2
          ? `舍去的部分合计约 $${sciTex(err)}$，前两位小数还靠得住，再要精确就得带上三次项`
          : `余项合计约 $${sciTex(err)}$，占真值的 ${(rel * 100).toFixed(0)}%，此时不宜舍去——a 取大了近似就失效`);
    } else {
      let q = 0;
      for (let k = 2; k <= n; k++) q += CN(n, k) * a ** (k - 2);
      cF(`$1+${n}a=1+${n * a}$`);
      cV(`$${Math.round(total)}=${1 + n * a}+${a}^{2}\\times${q}$`);
      cJ(`第三项起每项都含 a²，a=${a} 时舍去部分是 ${a}²×${q}，除以 ${a}² 余 1`);
    }
  };

  B.slider('指数 n', 2, 12, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.slider('参数 a', 1, 6, 1, st.a, v => { st.a = v; B.render(); }, 'a');

  const btns = [
    ['① 近似计算（a 取小数）', 0], ['② 整除性（a 取整数）', 1],
  ].map(([nm, md], i) => B.btn(nm, () => {
    st.mode = md;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('前两项之外全带 a²：a 小就舍得掉，a 是整数就是 a² 的倍数');
  B.render();
  return B;
}
