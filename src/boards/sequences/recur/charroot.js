/* 图 递4 · 特征根法机
   二阶线性齐次递推 a_{n+2} = p a_{n+1} + q a_n。猜 a_n = r^n 代入，得特征方程 r² − pr − q = 0。
   两个根各给一个等比解，任何线性组合仍是解；常数由 a₁、a₂ 定出。
   左：蓝点是从递推逐项算出的 a_n，绿点是 C₁r₁ⁿ、紫点是 C₂r₂ⁿ —— 绿 + 紫 = 蓝。
   右：从「猜解 → 代入 → 特征方程 → 叠加 → 定系数」的推导链。
   局部坐标：图区 rect=[56,58,470,300]，右栏 x∈[552,840]。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { p: 1, q: 1, a1: 1, a2: 1, grid: true, labs: true };
  const PRE = [
    { nm: '① 斐波那契', p: 1, q: 1, a1: 1, a2: 1 },
    { nm: '② 两不等根', p: 1, q: 2, a1: 1, a2: 3 },
    { nm: '③ 重根', p: 4, q: -4, a1: 1, a2: 4 },
  ];
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };

  const model = () => {
    const { p, q, a1, a2 } = st;
    const seq = [a1, a2];
    for (let k = 3; k <= 8; k++) seq.push(p * seq[k - 2] + q * seq[k - 3]);
    const disc = p * p + 4 * q;
    if (disc > 1e-9) {
      const r1 = (p + Math.sqrt(disc)) / 2, r2 = (p - Math.sqrt(disc)) / 2;
      const C1 = (a2 - a1 * r2) / (r1 * (r1 - r2));
      const C2 = (a1 * r1 - a2) / (r2 * (r1 - r2));
      return { kind: 'distinct', seq, r1, r2, C1, C2 };
    }
    if (disc < -1e-9) {
      const al = p / 2, be = Math.sqrt(-disc) / 2, rho = Math.hypot(al, be), th = Math.atan2(be, al);
      const c1 = Math.cos(th), s1 = Math.sin(th), c2 = Math.cos(2 * th), s2 = Math.sin(2 * th);
      const det = rho ** 3 * (c1 * s2 - s1 * c2);
      const A = (a1 * rho * rho * s2 - rho * s1 * a2) / det;
      const Bc = (rho * c1 * a2 - rho * rho * c2 * a1) / det;
      return { kind: 'complex', seq, al, be, rho, th, A, B: Bc };
    }
    const r = p / 2;
    if (Math.abs(r) < 1e-9) return { kind: 'degenerate', seq };
    return { kind: 'repeat', seq, r, C1: 2 * a1 / r - a2 / (r * r), C2: a2 / (r * r) - a1 / r };
  };
  const cR = B.chipM('递推式'), cE = B.chipM('特征方程'), cRt = B.chipM('两根'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const md = model(), seq = md.seq;
    const comp1 = [], comp2 = [];
    if (md.kind === 'distinct') for (let n = 1; n <= 8; n++) { comp1.push(md.C1 * md.r1 ** n); comp2.push(md.C2 * md.r2 ** n); }
    if (md.kind === 'repeat') for (let n = 1; n <= 8; n++) { comp1.push(md.C1 * md.r ** n); comp2.push(md.C2 * n * md.r ** n); }
    const env = [];
    if (md.kind === 'complex') { const amp = Math.hypot(md.A, md.B); for (let n = 1; n <= 8; n++) { env.push(amp * md.rho ** n); } }
    const pool = [...seq, 0, ...comp1, ...comp2, ...env, ...env.map(v => -v)];
    const lo = Math.min(...pool), hi = Math.max(...pool);
    const pad = (hi - lo) * .08 || 1;
    const m = B.mapFit(0.4, 8.6, lo - pad, hi + pad, [56, 58, 470, 300], 0);
    const step = nice((hi - lo + 2 * pad) / 5);
    B.grid({ ...m, sx: 1, sy: step, lx: 1, ly: step, xt: [1, 2, 3, 4, 5, 6, 7, 8], axLab: 'n', ayLab: 'a', grid: st.grid, labs: st.labs });
    // 分量点与连线
    if (md.kind === 'distinct' || md.kind === 'repeat') {
      for (let n = 1; n <= 8; n++) {
        B.seg(V(m.px(n), m.py(comp1[n - 1])), V(m.px(n), m.py(seq[n - 1])), { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '3 4', 'stroke-opacity': .8 });
        B.dot(V(m.px(n), m.py(comp1[n - 1])), 3.4, { fill: '#4ade80', 'stroke': '#0a0d14', 'stroke-width': .8 });
        B.dot(V(m.px(n), m.py(comp2[n - 1])), 3.4, { fill: '#c084fc', 'stroke': '#0a0d14', 'stroke-width': .8 });
      }
    }
    if (md.kind === 'complex') for (let n = 1; n <= 8; n++) {
      B.dot(V(m.px(n), m.py(env[n - 1])), 3, { fill: 'none', stroke: '#c084fc', 'stroke-width': 1.2 });
      B.dot(V(m.px(n), m.py(-env[n - 1])), 3, { fill: 'none', stroke: '#c084fc', 'stroke-width': 1.2 });
    }
    // 实际项
    for (let n = 1; n <= 8; n++) B.dot(V(m.px(n), m.py(seq[n - 1])), 4.6, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.1 });
    // 图例
    B.tex(V(56, 392), '蓝：$a_n$', { size: 11.5, anchor: 'start', color: '#5cadff', w: 90 });
    if (md.kind === 'complex') B.tex(V(150, 392), '紫圈：$\\pm\\rho^n\\sqrt{A^2+B^2}$', { size: 11.5, anchor: 'start', color: '#c084fc', w: 250 });
    else {
      B.tex(V(150, 392), '绿：$C_1r_1^n$', { size: 11.5, anchor: 'start', color: '#4ade80', w: 120 });
      B.tex(V(272, 392), '紫：$C_2r_2^n$', { size: 11.5, anchor: 'start', color: '#c084fc', w: 130 });
      B.tex(V(396, 392), '紫虚线：两分量相加', { size: 11, anchor: 'start', color: '#93a1b5', w: 240 });
    }
    // 标题
    B.tex(V(56, 30), '特征根法：把 $r^n$ 代进去，递推式变成一元二次方程', { size: 14, anchor: 'start', w: 770 });
    // 右侧推导链
    const L = (y, s, o = {}) => B.tex(V(552, y), s, { size: o.size || 12.5, anchor: 'start', w: 288, color: o.color });
    L(78, '设 $a_n=r^n$，代入递推式');
    L(106, '$r^{n+2}=pr^{n+1}+qr^{n}$');
    L(132, '约去 $r^n$（$r\\ne0$）');
    L(160, '$r^2-pr-q=0$', { color: '#ffd166', size: 13.5 });
    if (md.kind === 'distinct') {
      L(196, `$r_1=${fmt(md.r1, 3)}$`);
      L(222, `$r_2=${fmt(md.r2, 3)}$`);
      L(258, '两个根各给一个等比解，');
      L(284, '叠加仍是解：$a_n=C_1r_1^n+C_2r_2^n$', { size: 12 });
      L(316, '由 $a_1,a_2$ 定出常数');
      L(344, `$C_1=${fmt(md.C1, 3)},\\ \\ C_2=${fmt(md.C2, 3)}$`, { size: 12 });
    } else if (md.kind === 'repeat') {
      L(196, `$r_1=r_2=r=${fmt(md.r, 3)}$`);
      L(222, '重根时 $r^n$ 只有一个解，', { size: 12 });
      L(248, '第二解用 $n r^n$ 补上', { size: 12 });
      L(280, '$a_n=(C_1+C_2n)r^n$', { size: 12.5 });
      L(316, '由 $a_1,a_2$ 定出常数');
      L(344, `$C_1=${fmt(md.C1, 3)},\\ \\ C_2=${fmt(md.C2, 3)}$`, { size: 12 });
    } else if (md.kind === 'complex') {
      L(196, `$r=${fmt(md.al, 3)}\\pm${fmt(md.be, 3)}i$`);
      L(222, `$\\rho=${fmt(md.rho, 3)},\\ \\theta=${fmt(md.th, 3)}$`, { size: 12 });
      L(258, '共轭复根给出一对摆动解', { size: 12 });
      L(284, '$a_n=\\rho^n(A\\cos n\\theta+B\\sin n\\theta)$', { size: 11.5 });
      L(316, '由 $a_1,a_2$ 定出常数');
      L(344, `$A=${fmt(md.A, 3)},\\ \\ B=${fmt(md.B, 3)}$`, { size: 12 });
    } else {
      L(196, '$r=0$：递推退化为 $a_{n+2}=0$', { size: 12 });
      L(230, '从第 3 项起全部为 0', { size: 12 });
    }
    // 徽章
    const cf = (v, first) => {   // 系数：省略 1
      const mag = Math.abs(v) === 1 ? '' : `${Math.abs(v)}`;
      if (first) return `${v < 0 ? '-' : ''}${mag}`;
      return v < 0 ? `-${mag}` : `+${mag}`;
    };
    const cn = (v, first) => (first ? `${v}` : v < 0 ? `-${-v}` : `+${v}`);   // 常数项：保留 1
    const parts = [];
    if (st.p !== 0) parts.push(`${cf(st.p, true)}a_{n+1}`);
    if (st.q !== 0) parts.push(`${cf(st.q, parts.length === 0)}a_n`);
    cR(`$a_{n+2}=${parts.join('') || '0'}$`);
    const eqs = [];
    if (st.p !== 0) eqs.push(`${cf(-st.p, true)}r`);
    if (st.q !== 0) eqs.push(cn(-st.q, eqs.length === 0));
    cE(`$r^2${eqs.join('')}=0$`);
    if (md.kind === 'distinct') cRt(`$r_1=${fmt(md.r1, 3)},\\ r_2=${fmt(md.r2, 3)}$`);
    else if (md.kind === 'repeat') cRt(`$r_1=r_2=${fmt(md.r, 3)}$`);
    else if (md.kind === 'complex') cRt(`$r=${fmt(md.al, 3)}\\pm${fmt(md.be, 3)}i$`);
    else cRt('$r=0$');
    cJ(md.kind === 'distinct' ? '两个等比分量叠加；$|r_1|>|r_2|$ 时大根主导'
      : md.kind === 'repeat' ? '重根：$nr^n$ 补成第二个解' : md.kind === 'complex' ? '共轭复根：在两条指数包络之间摆动' : '退化情形');
  };

  const slP = B.slider('p =', -2, 4, 1, 1, v => { st.p = v; B.render(); }, 'p');
  const slQ = B.slider('q =', -2, 3, 1, 1, v => { st.q = v; B.render(); }, 'q');
  const sl1 = B.slider('a₁ =', -3, 6, 1, 1, v => { st.a1 = v; B.render(); }, 'a1');
  const sl2 = B.slider('a₂ =', -3, 8, 1, 1, v => { st.a2 = v; B.render(); }, 'a2');
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.p = p.p; st.q = p.q; st.a1 = p.a1; st.a2 = p.a2;
    slP.sync(st.p); slQ.sync(st.q); sl1.sync(st.a1); sl2.sync(st.a2);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拨 p、q：根变号、重根、复根，数列的走向也随之改变');
  B.render();
  return B;
}
