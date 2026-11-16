/* 图 V3 · 极值最值判定机：f′=0 找驻点、两侧变号定极值、闭区间把端点并入候选点集。
   曲线按 f′ 符号染色（S2 复用：绿=增、红=减）；驻点变号→金点，驻点不变号→红空圈排除；
   区间 [p,q] 虚线围栏，候选点 = 极值点 ∪ 端点，逐个比较得最大最小。整框 isoFit 等单位。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  const PRESETS = [
    { name: '① $f=x^3-3x$', f: x => x * x * x - 3 * x, fp: x => 3 * x * x - 3, crits: [-1, 1], xa: -2.6, xb: 2.6, ya: -4.4, yb: 4.4 },
    { name: '② $f=x^3$：驻点不变号', f: x => x * x * x, fp: x => 3 * x * x, crits: [0], xa: -1.9, xb: 1.9, ya: -7.4, yb: 7.4 },
    { name: '③ $f=x^4-2x^2$：三驻点', f: x => x * x * x * x - 2 * x * x, fp: x => 4 * x * x * x - 4 * x, crits: [-1, 0, 1], xa: -2.2, xb: 2.2, ya: -1.6, yb: 2.6 },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(P.xa, P.xb, P.ya, P.yb));
  const st = { p: 0, a: -1.8, b: 1.8, grid: true, labs: true };

  const cC = B.chipM('驻点核验'), cE = B.chipM('极值判读'), cM = B.chipM('区间最值'), cS = B.chipM('一句记法');

  /** 按符号分段染色画 f；驻点必采锚点 —— 两段在驻点精确接榫 */
  function plotSign(P, M, sg, at) {
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.03) xs.push(x);
    for (const c of P.crits) if (c > M.X0 && c < M.X1) xs.push(c);
    xs.sort((m, n) => m - n);
    let d = '', pen = false;
    for (const x of xs) {
      if (Math.sign(P.fp(x)) === sg) {
        const y = P.f(x);
        if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
      }
      pen = false;
    }
    mk('path', { d, fill: 'none', ...at }, B.dyn);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    plotSign(P, M, 1, { stroke: '#4ade80', 'stroke-width': 2.2 });
    plotSign(P, M, -1, { stroke: '#ff7b8a', 'stroke-width': 2.2 });

    // 驻点分类：两侧 fp 符号变号→极值（金实心），同号→非极值（红空圈）
    const exts = [];
    for (const c of P.crits) {
      const sl = Math.sign(P.fp(c - 0.02)), sr = Math.sign(P.fp(c + 0.02));
      const y = P.f(c);
      const kind = sl === sr ? 'flat' : sl > 0 ? 'max' : 'min';
      exts.push({ x: c, y, kind });
      if (c > M.X0 && c < M.X1 && y > M.Y0 && y < M.Y1) {
        if (kind === 'flat') B.dot(V(M.px(c), M.py(y)), 5.5, { fill: '#0a0d14', stroke: '#ff7b8a', 'stroke-width': 2 });
        else B.dot(V(M.px(c), M.py(y)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
      }
    }
    // 区间围栏 + 端点（实心=闭，规范⑧）
    for (const e of [st.a, st.b]) {
      B.seg(V(M.px(e), 0), V(M.px(e), H), { stroke: '#3f5f8f', 'stroke-dasharray': '4 5', 'stroke-opacity': .85 });
      const y = P.f(e);
      if (y > M.Y0 && y < M.Y1) B.dot(V(M.px(e), M.py(y)), 5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.4 });
    }
    // 候选点比较：极值点（在区间内）+ 两端点
    const cand = exts.filter(e => e.kind !== 'flat' && e.x >= st.a - 1e-9 && e.x <= st.b + 1e-9).map(e => [e.x, e.y]);
    cand.push([st.a, P.f(st.a)], [st.b, P.f(st.b)]);
    let mx = cand[0], mn = cand[0];
    for (const c of cand) { if (c[1] > mx[1]) mx = c; if (c[1] < mn[1]) mn = c; }

    // 徽章
    cC(`$f'=0$ 解得：${P.crits.map(c => `$x=${fmt(c, 2)}$`).join('、')} —— 驻点是候选，变号才作数`, '');
    const flat = exts.find(e => e.kind === 'flat');
    if (flat) {
      cE(`$x=${fmt(flat.x, 2)}$ 两侧 $f'$ 同号（${Math.sign(P.fp(flat.x - 0.02)) > 0 ? '都是正' : '都是负'}）：驻点不是极值 —— 判据是变号，不是清零`, 'warn');
    } else {
      cE(exts.map(e => `$x=${fmt(e.x, 2)}$ ${e.kind === 'max' ? '左增右减→极大' : '左减右增→极小'} $f=${fmt(e.y, 2)}$`).join('；'), 'ok');
    }
    cM(`区间 $[${fmt(st.a, 2)},\\ ${fmt(st.b, 2)}]$：候选 ${cand.length} 个（极值点+端点）—— 最大 ${fmt(mx[1], 2)}（$x=${fmt(mx[0], 2)}$），最小 ${fmt(mn[1], 2)}（$x=${fmt(mn[0], 2)}$）`, 'ok');
    cS('极值=驻点两侧变号；最值=候选点比较 —— 端点不入极值候选、必入最值候选', '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    const lo = +(p.xa + 0.15).toFixed(2), hi = +(p.xb - 0.15).toFixed(2);
    st.a = Math.max(lo, Math.min(-0.05, st.a)); st.b = Math.max(0.05, Math.min(hi, st.b));
    slP.setAttribute('min', lo); slP.sync(st.a);
    slQ.setAttribute('max', hi); slQ.sync(st.b);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const slP = B.slider('区间左端 p', -2.45, -0.05, 0.05, -1.8, v2 => { st.a = v2; B.render(); });
  const slQ = B.slider('区间右端 q', 0.05, 2.45, 0.05, 1.8, v2 => { st.b = v2; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('找极值看驻点两侧变号；找最值把端点也请进候选 —— 金点出极值，灰点端点完结');
  B.render();
  return B;
}
