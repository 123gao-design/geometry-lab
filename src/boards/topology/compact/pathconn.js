/* 图 连2 · 道路连通与正弦曲线
   模式一：两只哑铃盘加一条弯走廊，两块圆盘上的任意两点都有一条道路连着，
   拖「路径进度」把这条道路一段段画出来。
   模式二：拓扑学家的正弦曲线——y=sin(1/x)（x>0）再加竖直线段 x=0。
   整块集合连通，可原点附近那一段抖得没有极限，从原点出发走不到曲线上。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { t: 1, sine: false, p: V(246, 250), q: V(628, 226) };
  const P0 = V(252, 242), Q0 = V(624, 242);

  const cT = B.chipM('道路'), cJ = B.chipM('判读');

  const mSin = B.isoFit(-0.14, 1.08, -1.32, 1.32, [46, 26, 730, 360], 26);

  function pt(t) {
    const u = 1 - t;
    const c1 = V(st.p.x + 92, 176), c2 = V(st.q.x - 92, 176);
    return V(
      u * u * u * st.p.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * st.q.x,
      u * u * u * st.p.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * st.q.y,
    );
  }

  B.renderFn = () => {
    if (!st.sine) {
      // 哑铃：两盘 + 走廊
      B.seg(V(252, 236), V(624, 236), { stroke: '#ffd166', 'stroke-width': 26, 'stroke-opacity': .16, 'stroke-linecap': 'round' });
      B.seg(V(252, 236), V(624, 236), { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-opacity': .5 });
      mk('circle', { cx: P0.x, cy: P0.y, r: 72, fill: '#5cadff', 'fill-opacity': .1, stroke: '#5cadff', 'stroke-width': 1.8 }, B.dyn);
      mk('circle', { cx: Q0.x, cy: Q0.y, r: 72, fill: '#5cadff', 'fill-opacity': .1, stroke: '#5cadff', 'stroke-width': 1.8 }, B.dyn);
      B.tex(V(252, 336), '$X$', { size: 15, color: '#5cadff', anchor: 'mid', w: 40 });

      // 道路：从 P 到 Q 的三次曲线，按进度画
      const N = 90, k = Math.max(1, Math.round(N * st.t));
      let d = '';
      for (let i = 0; i <= k; i++) {
        const p = pt(i / N);
        d += (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ' ';
      }
      mk('path', { d, fill: 'none', stroke: '#4ade80', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, B.dyn);
      const end = pt(k / N);
      B.dot(end, 5, { fill: '#4ade80' });
      B.dot(st.p, 5.5, { fill: '#ff9e4a', stroke: '#12161f', 'stroke-width': 1.4 });
      B.dot(st.q, 5.5, { fill: '#ff9e4a', stroke: '#12161f', 'stroke-width': 1.4 });
      B.tex(V(st.p.x - 4, st.p.y - 14), '$A$', { size: 13, color: '#ff9e4a', anchor: 'mid', w: 30 });
      B.tex(V(st.q.x + 4, st.q.y - 14), '$B$', { size: 13, color: '#ff9e4a', anchor: 'mid', w: 30 });

      B.tex(V(W / 2, H - 92), '把 $A$ 拖到左盘边缘、$B$ 拖到右盘边缘，道路照样画得出来', { size: 12.5, color: '#8fa3bd', w: 560, anchor: 'mid' });
      cT(`$${fmt(st.t * 100, 0)}\\%$`, st.t > .995 ? 'ok' : '');
      cJ(st.t > .995 ? '两点间有道路' : '道路画到这里', st.t > .995 ? 'ok' : '');
    } else {
      B.grid({ ...mSin, sx: .2, sy: .5, lx: .5, ly: .5 });
      // 竖直线段 x=0
      B.seg(V(mSin.px(0), mSin.py(-1)), V(mSin.px(0), mSin.py(1)), { stroke: '#ff9e4a', 'stroke-width': 3, 'stroke-linecap': 'round' });
      // y=sin(1/x)
      B.plot(x => Math.sin(1 / x), mSin, { x0: .0006, x1: 1, n: 2800, stroke: '#5cadff', 'stroke-width': 1.8 });
      B.tex(V(mSin.px(.62), mSin.py(-1.06)), '$y=\\sin\\dfrac1x$', { size: 13, color: '#5cadff', w: 100 });
      B.dot(V(mSin.px(0), mSin.py(0)), 5.5, { fill: '#ff7b8a', stroke: '#12161f', 'stroke-width': 1.4 });
      B.tex(V(mSin.px(0) + 12, mSin.py(0) + 24), '原点：贴着竖线，却接不上曲线', { size: 11.5, color: '#ff7b8a', w: 190 });

      B.tex(V(W / 2, H - 88), '集合是连通的；可原点出发的任何道路都走不进抖动的曲线段', { size: 12.5, color: '#8fa3bd', w: 600, anchor: 'mid' });
      cT('没有道路', 'warn');
      cJ('连通但不道路连通', 'warn');
    }
  };

  const hA = B.handle({
    get: () => st.p, set: q => { st.p = q; }, color: '#ff9e4a', r: 7,
    clamp: q => { const dx = q.x - P0.x, dy = q.y - P0.y, d = Math.hypot(dx, dy) || 1, k = Math.min(1, 54 / d); return V(P0.x + dx * k, P0.y + dy * k); },
  });
  const hB = B.handle({
    get: () => st.q, set: q => { st.q = q; }, color: '#ff9e4a', r: 7,
    clamp: q => { const dx = q.x - Q0.x, dy = q.y - Q0.y, d = Math.hypot(dx, dy) || 1, k = Math.min(1, 54 / d); return V(Q0.x + dx * k, Q0.y + dy * k); },
  });
  B.slider('路径进度', 0, 1, .01, st.t, v => { st.t = v; B.render(); });
  B.toggleBtn('正弦曲线', false, v => {
    st.sine = v; B.render();
    hA.style.display = v ? 'none' : '';
    hB.style.display = v ? 'none' : '';
  });
  B.hintM('先拖 $A$、$B$ 看道路一直存在；再切到正弦曲线——集合整体连通，可道路走不到原点');
  B.render();
  return B;
}
