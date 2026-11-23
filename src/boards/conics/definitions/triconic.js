/* 图 D4b · 用同一个射线方向比较三个焦点–准线系统 */
import { mk, V, dist, fmt, TAU } from '../../../lib/board.js';
import { createConicLab, plotInk, plotWindow } from '../../../lib/conic-diagram.js';

const solutions = (e, d, cosine) => [1 + e * cosine, e * cosine - 1]
  .map(den => den > 1e-10 ? e * d / den : null);

export function createBoard(root) {
  const W = 860, H = 372;
  const B = createConicLab(root, W, H);
  const panels = [
    { e: .55, d: 108, name: '椭圆', offset: 150 },
    { e: 1, d: 82, name: '抛物线', offset: 130 },
    { e: 2.2, d: 62, name: '双曲线', offset: 112 },
  ].map((config, i) => {
    const x = 17 + i * 281, y = 50, width = 264, height = 294;
    const F = V(x + config.offset, y + height / 2);
    const draw = plotWindow(B, { x, y, width, height }, 'ray-' + i);
    const read = B.chip(config.name);
    const paths = [[], []];
    for (let side = 0; side < 2; side++) {
      let run = [];
      for (let k = 0; k <= 720; k++) {
        const t = TAU * k / 720, c = Math.cos(t), s = Math.sin(t);
        const r = solutions(config.e, config.d, c)[side];
        if (r != null && r < 1050) run.push([F.x + r * c, F.y + r * s].map(v => v.toFixed(1)).join(','));
        else if (run.length) { paths[side].push(run.join(' ')); run = []; }
      }
      if (run.length) paths[side].push(run.join(' '));
    }
    return { ...config, x, y, width, height, F, draw, read, paths };
  });

  let angle = 18;
  const setAngle = value => { angle = value; B.render(); };
  const slider = B.slider('射线方向 θ°', 0, 360, 1, angle, v => { B.cancelRaf(); setAngle(v); });
  function select(value) { B.cancelRaf(); slider.sync(value); setAngle(value); }
  B.btn('朝向准线', () => select(0));
  B.btn('垂直于极轴', () => select(90));
  B.btn('背向准线', () => select(180));
  B.btn('重新同步扫描', () => {
    B.cancelRaf();
    let from;
    const tick = now => {
      from ??= now;
      const value = Math.min(360, (now - from) * .078);
      slider.sync(value); setAngle(value);
      if (value < 360) B.raf(tick);
      else B.cancelRaf();
    };
    B.raf(tick);
  }, { pri: true });

  B.renderFn = () => {
    const t = angle * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    for (const pane of panels) {
      const { e, d, name, x, y, width, height, F } = pane;
      const directrix = F.x + d;
      B.text(V(x + width / 2, 32), name + '   e = ' + e, { 'font-weight': 700, 'font-size': 16 });
      const values = solutions(e, d, c).filter(r => r != null);
      const points = values.map(r => V(F.x + r * c, F.y + r * s));
      pane.draw(() => {
        B.seg(V(x, F.y), V(x + width, F.y), { stroke: plotInk.axis, 'stroke-width': 1.2 });
        B.seg(V(directrix, y + 8), V(directrix, y + height - 8), {
          stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '6 6',
        });
        B.text(V(directrix - 8, y + 23), 'ℓ');
        for (const paths of pane.paths) for (const path of paths) {
          mk('polyline', { points: path, fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.1 }, B.dyn);
        }
        // 细灰射线只显示方向，主点的射影测量线用两种颜色分开。
        B.seg(F, V(F.x + c * 620, F.y + s * 620), {
          stroke: plotInk.guide, 'stroke-width': 1, 'stroke-dasharray': '3 5',
        });
        points.forEach((P, i) => {
          const inPane = P.x >= x + 6 && P.x <= x + width - 6 && P.y >= y + 6 && P.y <= y + height - 6;
          if (!inPane) return;
          B.seg(F, P, { stroke: plotInk.copper, 'stroke-width': i ? 1.35 : 2.25 });
          B.seg(P, V(directrix, P.y), { stroke: plotInk.blue, 'stroke-width': 1.45, 'stroke-dasharray': '4 4' });
          B.dot(P, 4.7, { fill: plotInk.copper, stroke: plotInk.ink });
          B.text(V(P.x + 4, P.y < y + 25 ? P.y + 17 : P.y - 11), points.length === 1 ? 'P' : i ? 'P₂' : 'P₁');
        });
        B.dot(F, 4.5, { fill: plotInk.amber, stroke: plotInk.ink });
        B.text(V(F.x - 10, F.y + 17), 'F');
      });
      const ratios = points.map(P => fmt(dist(F, P) / Math.abs(directrix - P.x), 2)).join(' / ');
      pane.read(points.length ? points.length + ' 个有限点 · 距离比 ' + ratios : '该射线无有限交点',
        points.length ? 'ok' : '');
    }
  };
  B.render();
  return B;
}
