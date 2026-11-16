/* 图 D4b · 三曲线同屏对比：同一极坐标法则 r = ed/(1+e·cosθ)，同一条扫描线，三种离心率同时作画 */
import { Board, mk, V, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const CY = 215, PW = 260, GAP = 20;
  const panels = [
    { e: 0.55, d: 80, name: '椭圆', note: 'e = 0.55 < 1' },
    { e: 1, d: 80, name: '抛物线', note: 'e = 1' },
    { e: 2.2, d: 64, name: '双曲线', note: 'e = 2.2 > 1' },
  ];
  const st = { theta: 0, playing: false };

  // 每个面板：独立裁切窗 + 焦点/准线位置
  const defs = B.svg.querySelector('defs');
  panels.forEach((pn, i) => {
    pn.x0 = 20 + i * (PW + GAP);
    pn.F = V(pn.x0 + 130, CY);
    pn.lx = pn.F.x + pn.d;
    pn.uid = `triclip${i}_${Board.n || 0}`;
    const cp = mk('clipPath', { id: pn.uid }, defs);
    mk('rect', { x: pn.x0, y: 14, width: PW, height: H - 28 }, cp);
  });

  // 预计算两支曲线采样（按 θ 升序分段），扫描时截取 θ ≤ theta 的前缀
  for (const pn of panels) {
    pn.paths = [[], []];
    for (const side of [0, 1]) {
      let seg = [];
      for (let t = 0; t <= 2 * Math.PI + 1e-9; t += 0.004) {
        const c = Math.cos(t), s = Math.sin(t);
        let r = null;
        if (side === 0) { const d0 = 1 + pn.e * c; if (d0 > 0.003) r = pn.e * pn.d / d0; }
        else { const d1 = pn.e * c - 1; if (pn.e > 1 && d1 > 0.003) r = pn.e * pn.d / d1; }
        if (r !== null && r < 900) seg.push({ t, x: pn.F.x + r * c, y: pn.F.y + r * s });
        else if (seg.length) { pn.paths[side].push(seg); seg = []; }
      }
      if (seg.length) pn.paths[side].push(seg);
    }
  }

  // θ = t 处的"笔尖"（优先近支；无双支定义时为空 —— 渐近方向之间的禁区）
  const liveAt = (pn, t) => {
    const c = Math.cos(t), s = Math.sin(t);
    const d0 = 1 + pn.e * c;
    if (d0 > 0.02) { const r = Math.min(900, pn.e * pn.d / d0); return V(pn.F.x + r * c, pn.F.y + r * s); }
    const d1 = pn.e * c - 1;
    if (pn.e > 1 && d1 > 0.003) { const r = Math.min(900, pn.e * pn.d / d1); return V(pn.F.x + r * c, pn.F.y + r * s); }
    return null;
  };

  const chips = panels.map(pn => B.chipM(`${pn.name} $|PF|/|PQ|$`));
  const tick = () => {
    st.theta += 0.016;
    if (st.theta >= 2 * Math.PI) { st.theta = 2 * Math.PI; st.playing = false; B.render(); return; }
    B.render(); B.raf(tick);
  };
  B.btn('▶ 重新同步扫描', () => {
    if (st.playing) return;
    B.cancelRaf(); st.theta = 0; st.playing = true; B.raf(tick);
  }, { pri: true });

  B.renderFn = () => {
    panels.forEach((pn, i) => {
      mk('rect', { x: pn.x0, y: 14, width: PW, height: H - 28, fill: 'rgba(139,163,189,.05)', stroke: '#2e3d57', rx: 10 }, B.dyn);
      B.text(V(pn.x0 + PW / 2, 36), `${pn.name} · ${pn.note}`, { fill: '#93a1b5', 'font-size': 13, 'font-weight': 700 });
      const g = mk('g', { 'clip-path': `url(#${pn.uid})` }, B.dyn);
      mk('line', { x1: pn.x0 + 8, y1: CY, x2: pn.x0 + PW - 8, y2: CY, stroke: '#22314a', 'stroke-width': 1.2 }, g);
      mk('line', { x1: pn.lx, y1: 20, x2: pn.lx, y2: H - 20, stroke: '#67e8f9', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' }, g);
      // 完整曲线（扫描中作虚线预告）
      if (st.playing) for (const side of [0, 1]) for (const seg of pn.paths[side]) {
        if (seg.length < 2) continue;
        mk('polyline', { points: seg.map(q => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' '), fill: 'none', stroke: '#2e3d57', 'stroke-width': 1.4, 'stroke-dasharray': '4 5' }, g);
      }
      // 已扫描部分（实线）
      for (const side of [0, 1]) for (const seg of pn.paths[side]) {
        const pts = [];
        for (const q of seg) { if (q.t > st.theta) break; pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`); }
        if (pts.length > 1) mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.6 }, g);
      }
      // 焦点
      mk('circle', { cx: pn.F.x, cy: pn.F.y, r: 5, fill: '#ffd166', stroke: '#fff', 'stroke-width': 1.5 }, g);
      mk('text', { x: pn.F.x, y: pn.F.y + 18, 'text-anchor': 'middle', fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700, text: 'F' }, g);
      // 笔尖与两条等比线段
      if (st.playing) {
        const P = liveAt(pn, st.theta);
        if (P) {
          const Q = V(pn.lx, P.y);
          mk('line', { x1: P.x, y1: P.y, x2: pn.F.x, y2: pn.F.y, stroke: '#ff9e4a', 'stroke-width': 2 }, g);
          mk('line', { x1: P.x, y1: P.y, x2: Q.x, y2: Q.y, stroke: '#5cadff', 'stroke-width': 2 }, g);
          mk('circle', { cx: P.x, cy: P.y, r: 5.5, fill: '#67e8f9', stroke: '#fff', 'stroke-width': 1.5 }, g);
          const ratio = dist(P, pn.F) / Math.max(1e-6, Math.abs(pn.lx - P.x));
          chips[i](`${fmt(ratio, 3)} = e`, Math.abs(ratio - pn.e) < 0.02 ? 'ok' : 'warn');
        } else chips[i]('—（渐近方向禁区）', 'warn');
      } else chips[i](`e = ${fmt(pn.e, 2)}`, 'ok');
    });
    B.hint(st.playing
      ? '同一条法则 r = ed/(1+e·cosθ)、同一条扫描线 —— 只因分母 1+e·cosθ 有没有零点，扫出三种命运'
      : '扫描完成：封闭的是椭圆，一个方向逃走的是抛物线，裂成两支的是双曲线。点「重新同步扫描」重新演示');
  };

  B.render();
  // 自动播放一遍
  st.playing = true; st.theta = 0; B.raf(tick);
  return B;
}
