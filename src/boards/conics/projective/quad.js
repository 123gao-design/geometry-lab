/* 图 3 · 完全四点形：成批生成调和点列的射影方法（带自适应视野） */
import { Board, mk, V, add, sub, mul, dist, interLL, crOn, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 520;
  const B = new Board(root, W, H);
  // 世界坐标（用户拖动的自由坐标系）→ 像素坐标的自适应视图
  const st = { A: V(140, 150), B: V(380, 120), C: V(660, 180), D: V(430, 440), sel: 'AB', ticking: false };
  const view = { s: 1, cx: W / 2, cy: H / 2 }; // 当前视图
  const tgt = { s: 1, cx: W / 2, cy: H / 2 }; // 目标视图
  const w2p = p => V(W / 2 + (p.x - view.cx) * view.s, H / 2 + (p.y - view.cy) * view.s);
  const p2w = p => V((p.x - W / 2) / view.s + view.cx, (p.y - H / 2) / view.s + view.cy);
  const wc = p => { // 像素 → 世界（限制范围，防止把手丢失）
    const w = p2w(p);
    w.x = Math.max(-800, Math.min(1600, w.x)); w.y = Math.max(-800, Math.min(1320, w.y));
    return w;
  };

  for (const k of ['A', 'B', 'C', 'D'])
    B.handle({ get: () => w2p(st[k]), set: p => { st[k] = wc(p); }, color: '#fff', r: 7, label: k, lo: [10, -11] });

  const chip1 = B.chip('交叉比'), chip2 = B.chip('状态');
  const edgeBtns = {};
  const setSel = k => { st.sel = k; for (const e in edgeBtns) edgeBtns[e].classList.toggle('on', e === k); B.render(); };
  for (const [k, lab] of [['AB', '高亮 AB 边'], ['AC', '高亮 AC 边'], ['AD', '高亮 AD 边'], ['off', '关闭高亮']])
    edgeBtns[k] = B.btn(lab, () => setSel(k));
  edgeBtns[st.sel].classList.add('on');

  const diagonalPts = () => ({ // 世界坐标下的三个对角点
    P1: interLL(st.A, st.B, st.C, st.D),
    P2: interLL(st.A, st.C, st.B, st.D),
    P3: interLL(st.A, st.D, st.B, st.C),
  });

  function fitTarget(keyPts) {
    // 四顶点始终全额参与；其余点超出「引力半径」（2.6 × 四点形半径）时按方向截断 ——
    // 否则一个趋于无穷远的对角点会把视野拽走、把整个四点形推出画布。
    // 被截断的真点若落在画布外，由边缘徽章指示方向。
    const quad = [st.A, st.B, st.C, st.D];
    const cen = V(quad.reduce((s, p) => s + p.x, 0) / 4, quad.reduce((s, p) => s + p.y, 0) / 4);
    const KR = Math.max(80, ...quad.map(p => dist(cen, p))) * 2.6;
    const xs = [], ys = [];
    for (const p of keyPts) {
      if (!p || !isFinite(p.x) || !isFinite(p.y)) continue;
      const d = dist(cen, p);
      const q = d > KR ? add(cen, mul(sub(p, cen), KR / d)) : p; // 半径截断，方向不变
      xs.push(q.x); ys.push(q.y);
    }
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const bw = Math.max(120, x1 - x0), bh = Math.max(120, y1 - y0);
    tgt.s = Math.max(0.18, Math.min((W - 70) / bw, (H - 70) / bh, 1)); // 只缩不放
    tgt.cx = (x0 + x1) / 2; tgt.cy = (y0 + y1) / 2;
  }
  function ensureTick() { // 视图向目标平滑收敛（首帧走 rAF，避免渲染过程中重入 render）
    if (st.ticking) return;
    st.ticking = true;
    const step = () => {
      let moved = false;
      for (const k of ['s', 'cx', 'cy']) {
        const d = tgt[k] - view[k], th = k === 's' ? 0.002 : 0.4;
        if (Math.abs(d) > th) { view[k] += d * 0.16; moved = true; }
        else view[k] = tgt[k];
      }
      B.render();
      if (moved) B.raf(step); else st.ticking = false;
    };
    B.raf(step);
  }
  function edgeBadge(px, label, color) { // 出画布的点的边缘徽章
    const c = V(Math.max(26, Math.min(W - 26, px.x)), Math.max(26, Math.min(H - 26, px.y)));
    B.seg(V(W / 2, H / 2), c, { stroke: color, 'stroke-width': 1, 'stroke-dasharray': '3 5', opacity: .45 });
    B.dot(c, 6, { fill: color, stroke: '#fff', 'stroke-width': 1.5, opacity: .95 });
    B.text(V(c.x, c.y + (c.y < H / 2 ? 20 : -14)), label + ' →∞方向', { fill: color, 'font-size': 11.5, 'font-weight': 700 });
  }

  B.renderFn = () => {
    const { A, B: Q, C, D } = st;
    const { P1, P2, P3 } = diagonalPts();
    const SEL = st.sel !== 'off' ? { AB: [A, Q, 'A', 'B', '₁', P1], AC: [A, C, 'A', 'C', '₂', P2], AD: [A, D, 'A', 'D', '₃', P3] }[st.sel] : null;
    const S = SEL && P1 && P2 && P3 ? interLL(P2, P3, SEL[0], SEL[1]) : null;

    // 自适应视野：四顶点 + 三对角点 +（选中边的）S 全部纳入
    fitTarget([A, Q, C, D, P1, P2, P3, S]);
    ensureTick();

    // 六条边
    const edges = { AB: [A, Q], AC: [A, C], AD: [A, D], BC: [Q, C], BD: [Q, D], CD: [C, D] };
    for (const k in edges) B.inf(w2p(edges[k][0]), w2p(edges[k][1]), { stroke: '#2e3d57', 'stroke-width': 1.4 });

    const missing = [P1, P2, P3].filter(p => !p).length;
    if (missing) { chip2('有对角点在无穷远（某对对边平行）—— 稍微拖动顶点即可', 'warn'); chip1('—'); }
    else chip2('三个对角点 P₁、P₂、P₃（对角三角形，橙色）', 'ok');

    // 对角三角形
    if (P1 && P2 && P3) {
      mk('polygon', { points: [P1, P2, P3].map(p => { const q = w2p(p); return `${q.x},${q.y}`; }).join(' '),
        fill: 'rgba(255,158,74,.07)', stroke: 'rgba(255,158,74,.5)', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, B.dyn);
      const showP = (p, sub) => {
        const q = w2p(p);
        const outside = q.x < 6 || q.x > W - 6 || q.y < 6 || q.y > H - 6;
        if (outside) { edgeBadge(q, 'P' + sub, '#ff9e4a'); return; }
        B.dot(q, 6.5, { fill: '#ff9e4a', stroke: '#fff', 'stroke-width': 2 });
        B.text(V(q.x + 10, q.y - 13), 'P' + sub, { fill: '#ff9e4a', 'font-size': 13, 'font-weight': 700 });
      };
      showP(P1, '₁'); showP(P2, '₂'); showP(P3, '₃');
    }
    // 选中边的调和展示
    if (SEL && P1 && P2 && P3) {
      const [e1, e2, n1, n2, sub, P] = SEL;
      B.inf(w2p(e1), w2p(e2), { stroke: '#5cadff', 'stroke-width': 2.6 });
      B.inf(w2p(P2), w2p(P3), { stroke: '#4ade80', 'stroke-width': 1.4, 'stroke-dasharray': '7 5' });
      if (S) {
        const qs = w2p(S);
        if (qs.x > 6 && qs.x < W - 6 && qs.y > 6 && qs.y < H - 6) {
          B.dot(qs, 7, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
          B.text(V(qs.x + 10, qs.y - 13), 'S' + sub, { fill: '#ffd166', 'font-size': 13, 'font-weight': 700 });
        }
        const cr = crOn(e1, e2, P, S); // 交叉比在平移/缩放下不变，直接用世界坐标
        chip1(`(${n1},${n2};P${sub},S${sub}) = ${fmt(cr, 4)}`, Math.abs(cr + 1) < 0.01 ? 'ok' : 'warn');
      } else chip1('S 在无穷远 —— P 点趋向该边中点', 'warn');
      // 对角点本体（选中者加亮）
      const qP = w2p(P);
      if (qP.x > 6 && qP.x < W - 6 && qP.y > 6 && qP.y < H - 6) {
        B.dot(qP, 7, { fill: '#ff9e4a', stroke: '#fff', 'stroke-width': 2 });
        B.text(V(qP.x + 10, qP.y - 13), 'P' + sub, { fill: '#ff9e4a', 'font-size': 13, 'font-weight': 700 });
      }
    } else chip1('（高亮已关闭）');
    B.hint('拖动四个白色顶点 —— 视图自动缩放，保证 P₁ P₂ P₃ 与对角三角形始终完整可见');
  };
  B.render();
  return B;
}
