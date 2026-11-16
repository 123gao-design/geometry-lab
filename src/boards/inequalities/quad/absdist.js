/* 图 次3 · 绝对值距离机：|ax+b| 与 c —— 双轴换元与距离读法
   上轴是 t=ax+b（换元），下轴是 x，两轴共用刻度：|t|<c 即 t 落在 (−c, c) 内，
   反解回 x 轴得到以 m=−b/a 为中心、半宽 c/|a| 的距离带 —— |x−m|<c/|a|。
   紫虚线把 t 带两端与 x 轴端点连起来，展示换元映射；金色带为解集（或其补）。
   c<0 时两模式分别给出 ∅ 与 ℝ；a=0 时左边退化为常数。
   局部坐标约定：u∈[0,860] 向右、v∈[0,400] 向下；px(v)=70+60(v+6)，上轴 v=110、下轴 v=300。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 400;
  const B = new Board(root, W, H);
  const px = v => 70 + 60 * (v + 6);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: '<', a: 1, b: -1, c: 2 };
  const cT = B.chipM('换元'), cG = B.chipM('距离'), cS = B.chipM('解集');

  const axis = (v0, lab) => {
    B.seg(V(px(-6.4), v0), V(px(6.4) + 12, v0), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `${px(6.4) + 20},${v0} ${px(6.4) + 10},${v0 - 4.5} ${px(6.4) + 10},${v0 + 4.5}`, fill: '#8fa3bd' }, B.dyn);
    for (let t = -6; t <= 6; t++) {
      B.seg(V(px(t), v0), V(px(t), v0 - 7), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
      B.text(V(px(t), v0 + 20), String(t), { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
    }
    B.tex(V(px(-6.4) - 8, v0 - 12), lab, { size: 13, anchor: 'end', color: '#93a1b5' });
  };
  const bandV = (l, r, v0) => {
    const L = Math.max(px(l), px(-6)), R = Math.min(px(r), px(6));
    if (R - L > 1) mk('rect', { x: L, y: v0 - 6, width: R - L, height: 12, fill: '#ffd166', 'fill-opacity': .45 }, B.dyn);
  };
  const absTerm = m => (m >= 0 ? `|x-${f1(m)}|` : `|x+${f1(-m)}|`);

  B.renderFn = () => {
    const { a, b, c } = st;
    const lt = st.mode === '<';
    const a0 = Math.abs(a) < 1e-9, cpos = c > 1e-9, czero = Math.abs(c) < 1e-9, cneg = c < -1e-9;
    const m = a0 ? null : -b / a;
    let lo = null, hi = null;
    if (!a0 && cpos) {
      const u = (-c - b) / a, v = (c - b) / a;
      lo = Math.min(u, v); hi = Math.max(u, v);
    }
    const at = a === 1 ? '' : a === -1 ? '-' : f1(a);
    const bt = Math.abs(b) < 1e-9 ? '' : (b > 0 ? '+' : '') + f1(b);
    B.tex(V(430, 44), `$|${at}x${bt}|${lt ? '<' : '>'}${f1(c)}$`, { size: 17, anchor: 'mid' });
    B.text(V(430, 74), lt ? '换元 t=ax+b：|t|<c ⟺ −c<t<c，再反解 x'
                          : '换元 t=ax+b：|t|>c ⟺ t<−c 或 t>c，再反解 x', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    axis(110, '$t=ax+b$');
    axis(300, '$x$');
    // 上轴：t 带
    if (lt) { if (cpos) bandV(-c, c, 110); }
    else if (cpos) { bandV(-6, -c, 110); bandV(c, 6, 110); }
    else if (cneg) bandV(-6, 6, 110);
    else { bandV(-6, 0, 110); bandV(0, 6, 110); }
    if (cpos || czero) for (const t of (czero ? [0] : [-c, c]))
      B.dot(V(px(t), 110), 6, { fill: '#0a0d14', stroke: '#ffd166', 'stroke-width': 2 });
    // 下轴：x 带与端点、中心 m、换元连线
    if (!a0 && cpos) {
      if (lt) bandV(lo, hi, 300);
      else { bandV(-6, lo, 300); bandV(hi, 6, 300); }
      const tlo = a > 0 ? -c : c, thi = a > 0 ? c : -c;
      const conn = (x, t) => {
        if (Math.abs(x) > 6 || Math.abs(t) > 6) return;
        B.seg(V(px(x), 300), V(px(t), 110), { stroke: '#c084fc', 'stroke-width': 1.1, 'stroke-dasharray': '4 4' });
      };
      conn(lo, tlo); conn(hi, thi);
      for (const e of [lo, hi]) if (Math.abs(e) <= 6) {
        B.dot(V(px(e), 300), 6, { fill: '#0a0d14', stroke: '#ffd166', 'stroke-width': 2 });
        B.tex(V(px(e), 338), `$x_{${e === lo ? 1 : 2}}$`, { size: 12, anchor: 'mid', color: '#ffd166' });
      }
      if (Math.abs(m) <= 6) {
        B.dot(V(px(m), 300), 5.5, { fill: '#5cadff' });
        B.tex(V(px(m), 278), `$m=${f1(m)}$`, { size: 12, anchor: 'mid', color: '#5cadff' });
      }
    }
    // 徽章
    cT(lt ? `$|t|<${f1(c)}$ 即 $${f1(-c)}<t<${f1(c)}$，反解得 x 带` : `$|t|>${f1(c)}$ 即 $t<${f1(-c)}$ 或 $t>${f1(c)}$，反解得带外两段`);
    if (a0) cG('a=0：左边不含 x —— 是常数与 c 的直接比较，不存在距离带');
    else if (!cpos) cG('c≤0：距离带的半宽非正 —— 解集退化为 ∅ 或 ℝ（见解集徽章）', 'warn');
    else cG(`$|ax+b|=|a|\\,|x-m|$，$m=${f1(m)}$ —— 即到 m 的距离${lt ? '小于' : '大于'} $c/|a|=${f1(c / Math.abs(a))}$`);
    let sol, sc = '';
    if (cneg) { sol = lt ? '$\\varnothing$ —— 绝对值非负，恒不小于负数' : '$\\mathbb{R}$ —— 绝对值非负，恒大于负数'; sc = lt ? 'warn' : 'ok'; }
    else if (czero) {
      sol = lt ? '$\\varnothing$ —— |t|<0 无解'
               : (a0 ? (Math.abs(b) > 1e-9 ? '$\\mathbb{R}$' : '$\\varnothing$') : `$x\\ne ${f1(m)}$`);
    }
    else if (a0) {
      const vb = Math.abs(b);
      if (lt) { sol = vb < c ? '$\\mathbb{R}$ —— 常数 |b|<c 恒成立' : '$\\varnothing$ —— 常数 |b|≥c 恒不成立'; sc = vb < c ? 'ok' : 'warn'; }
      else { sol = vb > c ? '$\\mathbb{R}$ —— 常数 |b|>c 恒成立' : '$\\varnothing$ —— 常数 |b|≤c 恒不成立'; sc = vb > c ? 'ok' : 'warn'; }
    } else {
      const hw = f1(c / Math.abs(a));
      sol = lt ? `$${f1(lo)}<x<${f1(hi)}$ —— 即 $${absTerm(m)}<${hw}$`
               : `$x<${f1(lo)}$ 或 $x>${f1(hi)}$ —— 即 $${absTerm(m)}>${hw}$`;
      sc = 'ok';
    }
    cS(sol, sc);
  };

  const modeBtns = ['$|ax+b|<c$', '$|ax+b|>c$'].map((n, i) => B.btnM(n, () => {
    st.mode = i === 0 ? '<' : '>'; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const sA = B.slider('a =', -3, 3, .1, 1, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', -4, 4, .1, -1, v => { st.b = v; B.render(); });
  const sC = B.slider('c =', -3, 3, .1, 2, v => { st.c = v; B.render(); });
  const PRE = [
    { a: 1, b: -1, c: 2, mode: '<', n: '① $|x-1|<2$' },
    { a: 2, b: -1, c: 3, mode: '<', n: '② $|2x-1|<3$' },
    { a: -1, b: 2, c: 1, mode: '>', n: '③ $|-x+2|>1$' },
  ];
  PRE.forEach(P => B.btnM(P.n, () => {
    st.a = P.a; st.b = P.b; st.c = P.c; st.mode = P.mode;
    sA.sync(P.a); sB.sync(P.b); sC.sync(P.c);
    modeBtns.forEach((b, j) => b.classList.toggle('on', (P.mode === '<') === (j === 0)));
    B.render();
  }));

  B.hintM('c 扫过零：小于负数恒无解、大于负数恒成立；$a\\ne\\pm1$ 时半宽按 $c/|a|$ 缩放');
  B.render();
  return B;
}
