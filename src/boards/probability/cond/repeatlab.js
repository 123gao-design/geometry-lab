/* 图 独3 · 相互独立与独立重复试验
   ① 两人各自射击、互不影响：单位正方形被两条切线分成四格，面积就是「都中、只中一人、都不中」的概率，
      恰是各自概率相乘 —— 独立的意思就是面积可以拆。
   ② 同一件事重复 n 次：每次不中的机会都是 1−p，n 次全不中是 (1−p)^n，至少中一次是它的对立事件。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, p1: .7, p2: .5, p: .3, n: 5 };
  const cA = B.chipM('所求概率'), cU = B.chipM('对立事件'), cJ = B.chipM('判读');

  const hide = (el, on) => { const w = el.parentNode || el.parent; if (w) w.style.display = on ? '' : 'none'; };

  B.renderFn = () => {
    const { p1, p2 } = st;
    if (st.mode === 0) {
      const X = 150, Y = 60, S = 260;
      const xc = X + S * p1, yc = Y + S * (1 - p2);
      const cell = (x, y, w, h, c, op) => B.dyn.appendChild(mk('rect', { x, y, width: w, height: h, fill: c, 'fill-opacity': op, stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
      cell(X, Y, xc - X, yc - Y, '#5cadff', .18);
      cell(xc, Y, X + S - xc, yc - Y, '#c084fc', .18);
      cell(X, yc, xc - X, Y + S - yc, '#3f5f8f', .1);
      cell(xc, yc, X + S - xc, Y + S - yc, '#ff9e4a', .18);
      B.dyn.appendChild(mk('rect', { x: X, y: Y, width: S, height: S, fill: 'none', stroke: '#aebdd2', 'stroke-width': 1.6 }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: xc, y1: Y, x2: xc, y2: Y + S, stroke: '#aebdd2', 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: X, y1: yc, x2: X + S, y2: yc, stroke: '#aebdd2', 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, B.dyn));

      B.text(V(X - 14, Y + 16), '甲中', { fill: '#5cadff', 'font-size': 12, 'text-anchor': 'end' });
      B.text(V(X - 14, Y + S - 8), '甲不中', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'end' });
      B.text(V(X + 22, Y + S + 20), '乙中', { fill: '#5cadff', 'font-size': 12, 'text-anchor': 'start' });
      B.text(V(X + S - 10, Y + S + 20), '乙不中', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'end' });
      B.textM(V((X + xc) / 2, Y + 26), `$p_1p_2=${(p1 * p2).toFixed(3)}$`, { 'font-size': 11.5, fill: '#8fa3bd' });
      B.textM(V((xc + X + S) / 2, Y + 26), `$p_1(1-p_2)=${(p1 * (1 - p2)).toFixed(3)}$`, { 'font-size': 11.5, fill: '#8fa3bd' });
      B.text(V(X + S + 22, Y + 30), '四格的面积', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });
      B.text(V(X + S + 22, Y + 52), '就是四种结果', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });
      B.text(V(X + S + 22, Y + 74), '各自的概率', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });
      B.textM(V(X + S + 60, Y + 120), `$P(A)=${p1}$`, { 'font-size': 12, fill: '#5cadff' });
      B.textM(V(X + S + 60, Y + 148), `$P(B)=${p2}$`, { 'font-size': 12, fill: '#5cadff' });

      cA(`$p_1p_2=${p1}\\times${p2}=${(p1 * p2).toFixed(3)}$`);
      cU(`$1-(1-p_1)(1-p_2)=1-${((1 - p1) * (1 - p2)).toFixed(3)}=${(1 - (1 - p1) * (1 - p2)).toFixed(3)}$`);
      cJ(`甲、乙互不影响，同时命中的机会就是两个概率之积；至少一人命中要用对立事件算，比逐项相加省事`);
    } else {
      const { n } = st, p = st.p;
      const X0 = 120, X1 = 760, Y0 = 300, Y1 = 96, NM = 20;
      const px = k => X0 + (X1 - X0) * k / NM, py = v => Y0 - (Y0 - Y1) * v;
      [0, .25, .5, .75, 1].forEach(v => {
        B.dyn.appendChild(mk('line', {
          x1: X0, y1: py(v), x2: X1, y2: py(v), stroke: '#3f5f8f', 'stroke-width': v === 0 ? 1.2 : 1, 'stroke-opacity': v === 0 ? 1 : .4,
        }, B.dyn));
        B.text(V(X0 - 12, py(v) + 4), `${v}`, { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'end' });
      });
      B.text(V(X0 - 12, Y1 - 16), '概率', { fill: '#8fa3bd', 'font-size': 11.5, 'text-anchor': 'end' });
      B.text(V(X1, Y0 + 22), '重复次数 n', { fill: '#8fa3bd', 'font-size': 11.5, 'text-anchor': 'end' });

      const up = [], dn = [];
      for (let k = 0; k <= NM; k++) {
        up.push(`${k ? 'L' : 'M'} ${px(k).toFixed(1)} ${py(1 - (1 - p) ** k).toFixed(1)}`);
        dn.push(`${k ? 'L' : 'M'} ${px(k).toFixed(1)} ${py((1 - p) ** k).toFixed(1)}`);
      }
      B.dyn.appendChild(mk('path', { d: up.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2 }, B.dyn));
      B.dyn.appendChild(mk('path', { d: dn.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 2 }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: px(n), y1: Y1 - 10, x2: px(n), y2: Y0, stroke: '#ff7b8a', 'stroke-width': 1, 'stroke-dasharray': '4 4' }, B.dyn));
      B.dot(V(px(n), py(1 - (1 - p) ** n)), 5, { fill: '#ffd166' });
      B.dot(V(px(n), py((1 - p) ** n)), 5, { fill: '#5cadff' });
      B.textM(V(X1 - 60, Y1 + 6), '至少一次', { 'font-size': 12, fill: '#ffd166' });
      B.textM(V(X1 - 60, Y0 - 26), '全不中', { 'font-size': 12, fill: '#5cadff' });

      const pd = (1 - p) ** n, pa = 1 - pd;
      cA(`$(1-p)^{${n}}=${(1 - p).toFixed(2)}^{${n}}=${pd.toFixed(4)}$`);
      cU(`$1-(1-p)^{${n}}=${pa.toFixed(4)}$`);
      cJ(pa > .9 ? `重复 ${n} 次后几乎必然出现，至少一次的机会已到 ${(pa * 100).toFixed(1)}%`
        : n <= 3 ? `次数还少，至少一次只有 ${(pa * 100).toFixed(1)}%，与单次概率 ${p} 相差不大`
          : `每加一次，全不中的机会乘以 ${(1 - p).toFixed(2)}，至少一次的机会就往上抬一截`);
    }
  };

  const s1 = B.slider('甲的概率 p1', .1, .9, .05, st.p1, v => { st.p1 = v; B.render(); }, 'p1');
  const s2 = B.slider('乙的概率 p2', .1, .9, .05, st.p2, v => { st.p2 = v; B.render(); }, 'p2');
  const sp = B.slider('单次概率 p', .1, .9, .05, st.p, v => { st.p = v; B.render(); }, 'p');
  const sn = B.slider('重复次数 n', 1, 20, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  const btns = [['① 两件独立事件', 0], ['② 同一件事做 n 次', 1]].map(([nm, md], i) => B.btn(nm, () => {
    st.mode = md;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    hide(s1, md === 0); hide(s2, md === 0); hide(sp, md === 1); hide(sn, md === 1);
    B.render();
  }, { on: i === 0 }));
  hide(sp, true); hide(sn, true);

  B.hint('独立就把概率相乘；重复 n 次该用对立事件，1 减去全不中');
  B.render();
  return B;
}
