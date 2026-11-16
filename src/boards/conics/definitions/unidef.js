/* 图 D4 · 统一定义（第二定义）：|PF| / d(P, l) = e —— 一个滑块给出三种曲线
   焦点 F 为极点、轴向准线反方向时：r = e·d / (1 + e·cosθ)；
   e > 1 时分母有零点 → 另一支来自 r < 0 的方向（即 cosθ > 1/e 处 r = ed/(e·cosθ − 1)）。 */
import { Board, mk, V, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = new Board(root, W, H);
  const F = V(330, 250), LX = 590, d = LX - F.x; // 焦点到准线的距离
  const st = { e: 0.55, t: 1.8, side: 0 };

  const ed = () => st.e * d;
  // 方向 t 上的候选点（0/1/2 个；半径钳制 430 防止把手飞出画布）
  const cands = t => {
    const c = Math.cos(t), s = Math.sin(t), out = [];
    const d0 = 1 + st.e * c;
    if (d0 > 0.045) { const r = Math.min(430, ed() / d0); out.push({ side: 0, p: V(F.x + r * c, F.y + r * s) }); }
    const d1 = st.e * c - 1;
    if (st.e > 1 && d1 > 0.045) { const r = Math.min(430, ed() / d1); out.push({ side: 1, p: V(F.x + r * c, F.y + r * s) }); }
    return out;
  };
  const curP = () => {
    const cs = cands(st.t), m = cs.find(o => o.side === st.side) || cs[0];
    return m ? m.p : V(F.x, F.y);
  };

  const cType = B.chip('曲线类型'), cRatio = B.chip('|PF| / |PQ|'), cD = B.chip('焦点到准线');
  // e 突变后 P 可能滞留在画布外（把手不可见）：重置到轴上的可见点
  const fixP = () => {
    const p = curP();
    if (p.x < 10 || p.x > W - 10 || p.y < 10 || p.y > H - 10) { st.t = 0; st.side = st.e > 1 ? 1 : 0; }
  };
  const sE = B.slider('离心率 e', 0.3, 2.4, 0.01, st.e, v => { st.e = v; fixP(); B.render(); });
  for (const [lab, v] of [['e=0.55 · 椭圆', 0.55], ['e=1 · 抛物线', 1], ['e=1.6 · 双曲线', 1.6]])
    B.btn(lab, () => { st.e = v; sE.value = v; sE.dispatchEvent(new Event('input')); });

  // 沿 θ 扫描一支曲线，分母接近零或半径过大时抬笔分段
  const traceSide = side => {
    const paths = []; let cur = [];
    for (let t = 0; t <= 2 * Math.PI + 1e-9; t += 0.006) {
      const c = Math.cos(t), s = Math.sin(t);
      let r = null;
      if (side === 0) { const d0 = 1 + st.e * c; if (d0 > 0.004) r = ed() / d0; }
      else { const d1 = st.e * c - 1; if (st.e > 1 && d1 > 0.004) r = ed() / d1; }
      if (r !== null && r < 1600) cur.push(`${(F.x + r * c).toFixed(1)},${(F.y + r * s).toFixed(1)}`);
      else if (cur.length) { paths.push(cur); cur = []; }
    }
    if (cur.length) paths.push(cur);
    return paths;
  };

  B.renderFn = () => {
    const P = curP(), Q = V(LX, P.y);
    // 轴与准线
    B.seg(V(20, F.y), V(W - 20, F.y), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(LX, 18), V(LX, H - 18), { stroke: '#67e8f9', 'stroke-width': 1.8, 'stroke-dasharray': '8 6' });
    B.text(V(LX, 32), '准线 l', { fill: '#67e8f9', 'font-size': 12.5 });
    // 曲线（可能多段多支）
    for (const path of [...traceSide(0), ...traceSide(1)])
      if (path.length > 1) mk('polyline', { points: path.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.6 }, B.dyn);
    // 焦点
    B.dot(F, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(F.x, F.y + 20), 'F', { fill: '#ffd166', 'font-size': 13, 'font-weight': 700 });
    // P 与两条关键线段
    B.seg(P, F, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
    B.seg(P, Q, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.dot(Q, 4.5, { fill: '#5cadff' });
    B.dot(P, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 14), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    const pf = dist(P, F), pq = Math.abs(LX - P.x);
    const tp = Math.abs(st.e - 1) < 0.005 ? '抛物线（e = 1）' : st.e < 1 ? '椭圆（e < 1）' : '双曲线（e > 1）';
    cType(`e = ${fmt(st.e, 2)} → ${tp}`);
    cRatio(pq < 0.5 ? 'P 落在准线上（退化）' : `${fmt(pf, 1)} / ${fmt(pq, 1)} = ${fmt(pf / pq, 3)}`,
      pq > 0.5 && Math.abs(pf / pq - st.e) < 0.02 ? 'ok' : 'warn');
    cD(`d = ${fmt(d, 0)}，半通径 ℓ = e·d = ${fmt(ed(), 1)}`);
    B.hint(Math.abs(st.e - 1) < 0.005
      ? 'e = 1：左顶点趋向无穷远，曲线不再闭合 —— 抛物线'
      : st.e < 1
        ? '把 e 拖向 1：左顶点越走越远；越过 1 的瞬间曲线"炸开"成双曲线'
        : 'e > 1：曲线裂成两支，分母为零的方向正是渐近方向；P 可拖到任一支上');
  };

  B.handle({
    get: curP,
    set: p => {
      const t = Math.atan2(p.y - F.y, p.x - F.x), cs = cands(t);
      if (!cs.length) return; // 双曲线两渐近方向之间的"禁区"：忽略本次移动
      let best = cs[0];
      if (cs.length > 1 && dist(cs[1].p, p) < dist(cs[0].p, p)) best = cs[1];
      st.t = t; st.side = best.side;
    },
    color: '#67e8f9', r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
