/* 图 1 · 透视投影实验台：无穷远点与消点 */
import { mk, V, add, sub, mul, lerp, extSeg, fmt } from '../../../lib/board.js';
import { createDiagram, blue, gold, guide, mint, paper, lineStyle } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 800, 560, '转动地面方向把手，对照俯视图与像平面上的消点');
  const st = { h: 2, theta: 62 * Math.PI / 180, grid: true, lines: true, hl: true };
  const D = 5; // 像平面 z=5
  // 俯视图：地面 x∈[-4,4]，z 向上
  const TV = { ox: 140, oz: 470, sx: 32, sz: 44 };
  const tvP = (x, z) => V(TV.ox + x * TV.sx, TV.oz - z * TV.sz);
  // 主视图（像）：u 横、v 竖直向上
  const IM = { cx: 540, by: 515, su: 60, sv: 80 };
  const imP = (u, v) => V(IM.cx + u * IM.su, IM.by - v * IM.sv);
  const proj = (x, z) => ({ u: D * x / z, v: st.h * (z - D) / z }); // 地面点 (x,0,z) 的像

  // 两个子图各用自己的裁剪窗口。
  const topClip = B.uid + '-ground', imageClip = B.uid + '-image';
  {
    const d2 = mk('defs', {}, B.svg);
    mk('clipPath', { id: topClip }, d2).appendChild(mk('rect', { x: 16, y: 56, width: 250, height: 492, rx: 10 }));
    mk('clipPath', { id: imageClip }, d2).appendChild(mk('rect', { x: 292, y: 64, width: 492, height: 458, rx: 8 }));
  }

  B.handle({ get: () => V(TV.ox + 55 * Math.cos(st.theta), 430 - 55 * Math.sin(st.theta)),
    set: p => { st.theta = Math.atan2(430 - p.y, p.x - TV.ox); },
    color: gold, lo: [8, -8] });

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
    mk('rect', { x: 16, y: 56, width: 250, height: 492, rx: 10, fill: 'none', stroke: guide, 'stroke-opacity': .35 }, B.dyn);
    mk('rect', { x: 292, y: 64, width: 492, height: 458, rx: 8, fill: 'none', stroke: guide, 'stroke-opacity': .38, 'stroke-dasharray': '2 4' }, B.dyn);
    mk('text', { x: 141, y: 36, 'font-size': 13, fill: guide, 'text-anchor': 'middle' }, B.dyn).textContent = '俯视图：地面（x–z）';
    mk('text', { x: 538, y: 36, 'font-size': 13, fill: guide, 'text-anchor': 'middle' }, B.dyn).textContent = '像平面：相机「拍到」的画面';
    mk('circle', { cx: TV.ox, cy: 430, r: 55, fill: 'none', stroke: guide, 'stroke-opacity': .38, 'stroke-dasharray': '4 5' }, B.dyn);
    mk('text', { x: TV.ox, y: 520, 'font-size': 11.5, fill: guide, 'text-anchor': 'middle' }, B.dyn).textContent = '拖动把手 ⇢ 平行线方向';
    // —— 两个裁剪子层 ——
    const outer = B.dyn;
    const gTV = mk('g', { 'clip-path': `url(#${topClip})` }, outer);
    const gIM = mk('g', { 'clip-path': `url(#${imageClip})` }, outer);

    // 俯视图
    B.dyn = gTV;
    if (st.grid) {
      for (let k = -4; k <= 4; k++) B.seg(tvP(k, 0.4), tvP(k, 9.6), { ...lineStyle(guide, 1), opacity: .23 });
      for (let m = 1; m <= 9; m++) B.seg(tvP(-4, m), tvP(4, m), { ...lineStyle(guide, 1), opacity: .23 });
    }
    const starts = []; for (let i = -3; i <= 3; i++) starts.push(V(i, 6.4));
    const ends = starts.map(p0 => { const d = V(c, s); return [p0, add(p0, mul(d, 7)), sub(p0, mul(d, 7))]; });
    if (st.lines) {
      B.seg(tvP(-4, 5), tvP(4, 5), { stroke: mint, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
      B.text(V(TV.ox + 70, tvP(0, 5).y - 6), '像平面', { fill: mint, 'font-size': 11.5 });
      for (const [p0, a, b] of ends) { B.seg(tvP(a.x, a.y), tvP(b.x, b.y), { stroke: gold, 'stroke-width': 2.5 }); }
      B.dot(tvP(0, 0), 5, { fill: blue }); B.text(V(TV.ox + 9, tvP(0, 0).y + 16), 'S', { fill: blue, 'font-weight': 700 });
      const h0 = B.handles[0], hp = h0.st.get();
      B.seg(V(TV.ox, 430), hp, { stroke: gold, 'stroke-width': 2 });
    }

    // 像平面
    B.dyn = gIM;
    if (st.grid) {
      for (let k = -4; k <= 4; k++) { const p1 = proj(k, 1.2), p2 = proj(k, 9);
        B.seg(imP(p1.u, p1.v), imP(p2.u, p2.v), { ...lineStyle(guide, 1), opacity: .23 }); }
      for (let m = 1; m <= 9; m++) { const p1 = proj(-4, m), p2 = proj(4, m);
        B.seg(imP(p1.u, p1.v), imP(p2.u, p2.v), { ...lineStyle(guide, 1), opacity: .23 }); }
    }
    if (st.hl) {
      B.seg(imP(-4.1, st.h), imP(4.1, st.h), { stroke: mint, 'stroke-width': 1.5, 'stroke-dasharray': '7 6' });
      B.text(imP(-3.55, st.h + 0.12), '地平线（高度 = h）', { fill: mint, 'font-size': 11.5, 'text-anchor': 'start' });
    }
    if (st.lines) {
      const uV = D * c / s;
      let vp = null;
      if (Math.abs(s) > 1e-10) vp = imP(uV, st.h);
      for (let [, a, b] of ends) {
        // 只投影相机前方的部分，避免把穿过 z=0 的轨迹连成假线段。
        if (a.y < .6) a = lerp(a, b, (.6 - a.y) / (b.y - a.y));
        if (b.y < .6) b = lerp(b, a, (.6 - b.y) / (a.y - b.y));
        const pa = proj(a.x, a.y), pb = proj(b.x, b.y), A = imP(pa.u, pa.v), Z = imP(pb.u, pb.v);
        if (vp) {
          const [e1, e2] = extSeg(vp, A);
          B.seg(e1, e2, { stroke: gold, 'stroke-width': 1, 'stroke-dasharray': '3 5', opacity: .5 });
          B.seg(vp, Z, { stroke: gold, 'stroke-width': 1, 'stroke-dasharray': '3 5', opacity: .5 });
        }
        B.seg(A, Z, { stroke: gold, 'stroke-width': 2.5 });
      }
      if (Math.abs(s) <= 1e-10) {
        B.hint('消点已趋向无穷远 —— 直线族的像恢复平行');
        chip(`θ = ${fmt(th * 180 / Math.PI, 1)}°，消点在无穷远处`, 'warn');
      } else if (vp && Math.abs(uV) > 4.0) {
        B.hint('方向接近平行于像平面时，消点离开视窗');
        chip(`θ = ${fmt(th * 180 / Math.PI, 1)}°，消点出画布`, '');
      } else if (vp) {
        B.dot(vp, 4.8, { fill: gold, stroke: paper, 'stroke-width': 1.4 });
        B.text(V(vp.x, vp.y - 13), '消点', { fill: gold, 'font-size': 12.5, 'font-weight': 700 });
        B.hint('');
        chip(`θ = ${fmt(th * 180 / Math.PI, 1)}°，消点 (d·cotθ, h) 在地平线上`, 'ok');
      }
    } else { B.hint(''); chip('已隐藏平行线族'); }
    B.dyn = outer;
  };
  B.render();
  return B;
}
