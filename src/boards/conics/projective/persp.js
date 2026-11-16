/* 图 1 · 透视投影实验台：无穷远点与消点 */
import { Board, mk, V, add, sub, mul, extSeg, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 560);
  const st = { h: 2, theta: 35 * Math.PI / 180, grid: true, lines: true, hl: true, anim: null };
  const D = 5; // 像平面 z=5
  // 俯视图：地面 x∈[-4,4]，z 向上
  const TV = { ox: 140, oz: 470, sx: 32, sz: 44 };
  const tvP = (x, z) => V(TV.ox + x * TV.sx, TV.oz - z * TV.sz);
  // 主视图（像）：u 横、v 竖直向上
  const IM = { cx: 540, by: 515, su: 60, sv: 80 };
  const imP = (u, v) => V(IM.cx + u * IM.su, IM.by - v * IM.sv);
  const proj = (x, z) => ({ u: D * x / z, v: st.h * (z - D) / z }); // 地面点 (x,0,z) 的像

  // 两个子图的独立裁剪：内容一律不许出框
  {
    const d2 = mk('defs', {}, B.svg);
    mk('clipPath', { id: 'pg-tv' }, d2).appendChild(mk('rect', { x: 16, y: 56, width: 250, height: 492, rx: 10 }));
    mk('clipPath', { id: 'pg-im' }, d2).appendChild(mk('rect', { x: 292, y: 64, width: 492, height: 458, rx: 8 }));
  }

  B.handle({ get: () => V(TV.ox + 55 * Math.cos(st.theta), 430 - 55 * Math.sin(st.theta)),
    set: p => { st.theta = Math.atan2(430 - p.y, p.x - TV.ox); },
    color: '#ff9e4a', r: 8, lo: [8, -8] });

  B.slider('相机高度 h', 0.6, 4.5, 0.05, 2, v => { st.h = v; B.render(); });
  const easeTo = t => {
    B.cancelRaf();
    (function step() {
      const d = t - st.theta;
      if (Math.abs(d) < 0.004) { st.theta = t; B.render(); return; }
      st.theta += d * 0.1; B.render(); B.raf(step);
    })();
  };
  B.btn('转到与画面平行', () => easeTo(0.0), { pri: true });
  B.btn('正对相机', () => easeTo(Math.PI / 2));
  B.graphToggles(st, ['grid']);
  B.toggleBtn('平行线族', true, v => { st.lines = v; B.render(); });
  B.toggleBtn('地平线', true, v => { st.hl = v; B.render(); });
  const chip = B.chip('状态');

  B.renderFn = () => {
    const th = st.theta, c = Math.cos(th), s = Math.sin(th);
    // —— 子图装饰（随主题重画）——
    mk('rect', { x: 16, y: 56, width: 250, height: 492, rx: 10, fill: 'none', stroke: '#1f2a3a' }, B.dyn);
    mk('rect', { x: 292, y: 64, width: 492, height: 458, rx: 8, fill: 'none', stroke: '#2b4260', 'stroke-dasharray': '2 4' }, B.dyn);
    mk('text', { x: 141, y: 36, 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' }, B.dyn).textContent = '俯视图：地面（x–z）';
    mk('text', { x: 538, y: 36, 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' }, B.dyn).textContent = '像平面：相机「拍到」的画面';
    mk('circle', { cx: TV.ox, cy: 430, r: 55, fill: 'none', stroke: '#2c3b53', 'stroke-dasharray': '4 5' }, B.dyn);
    mk('text', { x: TV.ox, y: 520, 'font-size': 11.5, fill: '#5c6a80', 'text-anchor': 'middle' }, B.dyn).textContent = '拖动把手 ⇢ 平行线方向';
    // —— 两个裁剪子层 ——
    const outer = B.dyn;
    const gTV = mk('g', { 'clip-path': 'url(#pg-tv)' }, outer);
    const gIM = mk('g', { 'clip-path': 'url(#pg-im)' }, outer);

    // 俯视图
    B.dyn = gTV;
    if (st.grid) {
      for (let k = -4; k <= 4; k++) B.seg(tvP(k, 0.4), tvP(k, 9.6), { stroke: '#22314a', 'stroke-width': 1 });
      for (let m = 1; m <= 9; m++) B.seg(tvP(-4, m), tvP(4, m), { stroke: '#22314a', 'stroke-width': 1 });
    }
    const starts = []; for (let i = -3; i <= 3; i++) starts.push(V(i, 6.4));
    const ends = starts.map(p0 => { const d = V(c, s); return [p0, add(p0, mul(d, 7)), sub(p0, mul(d, 7))]; });
    if (st.lines) {
      B.seg(tvP(-4, 5), tvP(4, 5), { stroke: '#2b6f7f', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
      B.text(V(TV.ox + 70, tvP(0, 5).y - 6), '像平面', { fill: '#67e8f9', 'font-size': 11.5 });
      for (const [p0, a, b] of ends) { B.seg(tvP(a.x, a.y), tvP(b.x, b.y), { stroke: '#ff9e4a', 'stroke-width': 2.5 }); }
      B.dot(tvP(0, 0), 5, { fill: '#5cadff' }); B.text(V(TV.ox + 9, tvP(0, 0).y + 16), 'S', { fill: '#5cadff', 'font-weight': 700 });
      const h0 = B.handles[0], hp = h0.st.get();
      B.seg(V(TV.ox, 430), hp, { stroke: '#ff9e4a', 'stroke-width': 2 });
    }

    // 像平面
    B.dyn = gIM;
    if (st.grid) {
      for (let k = -4; k <= 4; k++) { const p1 = proj(k, 1.2), p2 = proj(k, 9);
        B.seg(imP(p1.u, p1.v), imP(p2.u, p2.v), { stroke: '#22314a', 'stroke-width': 1 }); }
      for (let m = 1; m <= 9; m++) { const p1 = proj(-4, m), p2 = proj(4, m);
        B.seg(imP(p1.u, p1.v), imP(p2.u, p2.v), { stroke: '#22314a', 'stroke-width': 1 }); }
    }
    if (st.hl) {
      B.seg(imP(-4.1, st.h), imP(4.1, st.h), { stroke: '#67e8f9', 'stroke-width': 1.5, 'stroke-dasharray': '7 6' });
      B.text(imP(-3.55, st.h + 0.12), '地平线（高度 = h）', { fill: '#67e8f9', 'font-size': 11.5, 'text-anchor': 'start' });
    }
    if (st.lines) {
      const uV = D * c / s;
      let vp = null;
      if (Math.abs(s) > 1e-4) vp = imP(uV, st.h);
      for (const [p0, a, b] of ends) {
        const pa = proj(a.x, a.y), pb = proj(b.x, b.y), A = imP(pa.u, pa.v), Z = imP(pb.u, pb.v);
        if (vp) {
          const [e1, e2] = extSeg(vp, A);
          B.seg(e1, e2, { stroke: '#a06226', 'stroke-width': 1, 'stroke-dasharray': '3 5', opacity: .5 });
          B.seg(vp, Z, { stroke: '#a06226', 'stroke-width': 1, 'stroke-dasharray': '3 5', opacity: .5 });
        }
        B.seg(A, Z, { stroke: '#ff9e4a', 'stroke-width': 2.5 });
      }
      if (Math.abs(s) < 0.055) {
        B.hint('消点已趋向无穷远 —— 直线族的像恢复平行');
        chip(`θ = ${fmt(th * 180 / Math.PI, 1)}°，消点在无穷远处`, 'warn');
      } else if (vp && Math.abs(uV) > 4.0) {
        B.hint('消点正奔向无穷远…');
        chip(`θ = ${fmt(th * 180 / Math.PI, 1)}°，消点出画布`, '');
      } else if (vp) {
        B.dot(vp, 7, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
        B.text(V(vp.x, vp.y - 13), '消点', { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
        B.hint('');
        chip(`θ = ${fmt(th * 180 / Math.PI, 1)}°，消点 (d·cotθ, h) 在地平线上`, 'ok');
      }
    } else { B.hint(''); chip('已隐藏平行线族'); }
    B.dyn = outer;
  };
  B.render();
  return B;
}
