/* 图 D4 · 统一定义（第二定义）：|PF| / d(P, l) = e —— 一个滑块给出三种曲线
   以焦点为极点、指向准线为极轴；准线两侧分别解 r = e |d − r cosθ|。 */
import { Board, mk, V, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = new Board(root, W, H);
  const F = V(298, 250), LX = 458, d = LX - F.x;
  const st = { e: 0.55, t: 1.8, side: 0 };

  const ed = () => st.e * d;
  const pointAt = (t, side) => {
    const c = Math.cos(t);
    const den = side === 0 ? 1 + st.e * c : st.e * c - 1;
    if (den <= 0) return null;
    const r = ed() / den;
    return V(F.x + r * c, F.y + r * Math.sin(t));
  };
  const visible = p => p && p.x >= 18 && p.x <= W - 18 && p.y >= 45 && p.y <= H - 42;
  const cands = t => [0, 1].map(side => ({ side, p: pointAt(t, side) })).filter(o => visible(o.p));
  const curP = () => pointAt(st.t, st.side);

  const cType = B.chip('曲线类型'), cRatio = B.chip('|PF| / |PQ|'), cD = B.chip('焦点到准线');
  // 轴向近顶点始终可见。远支顶点进入视窗后才允许把手切换过去。
  const fixP = () => {
    if (visible(curP())) return;
    if (visible(pointAt(0, st.side))) { st.t = 0; return; }
    st.t = 0;
    st.side = 0;
  };
  const sE = B.slider('离心率 e', 0.3, 2.4, 0.01, st.e, v => { st.e = v; fixP(); B.render(); }, 'e');
  for (const [lab, v] of [['e=0.55 · 椭圆', 0.55], ['e=1 · 抛物线', 1], ['e=1.6 · 双曲线', 1.6]])
    B.btn(lab, () => { sE.value = v; sE.dispatchEvent(new Event('input')); });

  // 沿 θ 扫描一支曲线，分母接近零或半径过大时抬笔分段
  const traceSide = side => {
    const paths = []; let cur = [];
    for (let i = 0; i <= 1048; i++) {
      const t = 2 * Math.PI * i / 1048;
      const p = pointAt(t, side);
      if (p && dist(p, F) < 1600) cur.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      else if (cur.length) { paths.push(cur); cur = []; }
    }
    if (cur.length) paths.push(cur);
    return paths;
  };

  B.renderFn = () => {
    const P = curP(), Q = V(LX, P.y);
    // 轴与准线
    B.seg(V(20, F.y), V(W - 20, F.y), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(LX, 44), V(LX, H - 32), { stroke: '#5c6a80', 'stroke-width': 1.7, 'stroke-dasharray': '7 6' });
    B.text(V(LX, 31), '准线 ℓ', { fill: '#93a1b5' });
    B.text(V(24, 31), '焦点与准线固定', { fill: '#93a1b5', 'text-anchor': 'start' });
    // 曲线（可能多段多支）
    const clipId = B.uid + '-conic-plot';
    const clip = mk('clipPath', { id: clipId }, B.dyn);
    mk('rect', { x: 12, y: 42, width: W - 24, height: H - 77 }, clip);
    const curves = mk('g', { 'clip-path': `url(#${clipId})` }, B.dyn);
    for (const path of [...traceSide(0), ...traceSide(1)])
      if (path.length > 1) mk('polyline', { points: path.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 3.2 }, curves);
    // 焦点
    B.dot(F, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(F.x, F.y + 20), 'F', { fill: '#ffd166', 'font-size': 13, 'font-weight': 700 });
    // P 与两条关键线段
    B.seg(P, F, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
    B.seg(P, Q, { stroke: '#67e8f9', 'stroke-width': 2.4, 'stroke-dasharray': '6 4' });
    const corner = 9 * Math.sign(P.x - Q.x);
    B.seg(V(Q.x + corner, Q.y), V(Q.x + corner, Q.y + 9), { stroke: '#67e8f9' });
    B.seg(V(Q.x + corner, Q.y + 9), V(Q.x, Q.y + 9), { stroke: '#67e8f9' });
    B.dot(Q, 3.5, { fill: '#67e8f9' });
    B.text(V(Q.x + (P.x < Q.x ? 14 : -14), Q.y - 7), 'Q', { fill: '#67e8f9' });
    B.text(V((P.x + F.x) / 2, (P.y + F.y) / 2 - 9), 'PF', { fill: '#ff9e4a' });
    B.text(V((P.x + Q.x) / 2, P.y + 18), 'PQ', { fill: '#67e8f9' });
    const pf = dist(P, F), pq = Math.abs(LX - P.x);
    const tp = Math.abs(st.e - 1) < 0.005 ? '抛物线（e = 1）' : st.e < 1 ? '椭圆（e < 1）' : '双曲线（e > 1）';
    cType(`e = ${fmt(st.e, 2)} → ${tp}`);
    cRatio(`${fmt(pf, 1)} / ${fmt(pq, 1)} ≈ ${fmt(pf / pq, 3)}`, 'ok');
    cD(`d = ${fmt(d, 0)}，半通径 ℓ = e·d = ${fmt(ed(), 1)}`);
    B.hint(Math.abs(st.e - 1) < 0.005
      ? 'e = 1：拖动 P，观察两段距离相等'
      : st.e < 1
        ? 'e < 1：拖动 P，观察焦点距离小于准线距离'
        : visible(pointAt(0, 1)) ? 'e > 1：拖动 P 可在两条可见分支间切换'
          : 'e > 1：另一条分支位于当前视窗之外');
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
    color: '#5cadff', r: 8, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
