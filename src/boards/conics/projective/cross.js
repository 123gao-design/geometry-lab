/* 图 2 · 中心投影保交叉比，含无穷远点 */
import { V, fmt } from '../../../lib/board.js';
import { cross3, dot3, projectiveCrossRatio, normalize } from '../../../lib/projective/homogeneous.js';
import { blue, gold, guide, ink, mint, pink, lineStyle, createDiagram, drawLine, mark, pointStatus, toCanvas, toLocal, visible } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 430, '比较共线四点及其投影的交叉比');
  const frame = { cx: 360, cy: 215, a: 240, b: 240 };
  const y = 105;
  const st = {
    A: V(172, y), B: V(534, y), C: V(280, y), D: V(640, y),
    S: V(360, 232), left: V(86, 370), right: V(646, 220),
  };
  const names = ['A', 'B', 'C', 'D'], colors = [pink, mint, blue, gold];
  let locked = false;
  names.forEach((name, i) => B.handle({
    get: () => st[name], set: p => { st[name] = V(p.x, y); }, label: name, color: colors[i],
  }));
  B.handle({ get: () => st.S, set: p => { st.S = p; }, label: 'S', color: ink });
  for (const name of ['left', 'right']) B.handle({
    get: () => st[name], set: p => { st[name] = p; }, color: guide, thin: true,
  });
  const toggle = B.toggleBtn('保持调和', locked, value => { locked = value; B.render(); });
  B.btn('令 C 为中点', () => {
    st.C = V((st.A.x + st.B.x) / 2, y);
    toggle.set(true);
  });
  const upper = B.chipM('$(A,B;C,D)$'), lower = B.chipM("$(A',B';C',D')$"), check = B.chip('投影');
  const shown = B.chip('点的位置');

  B.renderFn = () => {
    const source = names.map(name => toLocal(frame, st[name]));
    const [a, b, c] = source;
    const top = [0, 1, -a[1]];
    const l = cross3(toLocal(frame, st.left), toLocal(frame, st.right));
    const s = toLocal(frame, st.S);
    drawLine(B, frame, top, lineStyle(guide, 1.7), 'l₁');
    drawLine(B, frame, l, lineStyle(guide, 1.7), 'l₂');
    const t = (c[0] - a[0]) / (b[0] - a[0]);
    if (locked) {
      const w = 2 * t - 1;
      source[3] = Number.isFinite(t) ? normalize([a[0] * w + (b[0] - a[0]) * t, a[1] * w, w]) : null;
    }
    const dragD = B.handles[3];
    dragD.lbl.style.display = dragD.c.style.display = locked ? 'none' : '';
    if (locked) mark(B, toCanvas(frame, source[3]), 'D', gold);
    const read = projective => projective == null ? '—' : fmt(projective, 4);
    const cr = source[3] && projectiveCrossRatio(...source.map(p => [p[0], p[2]]));
    upper(read(cr));
    if (!l || Math.abs(dot3(s, top)) < 1e-9 || Math.abs(dot3(s, l)) < 1e-9) {
      lower('—'); check('请让投影中心离开两条直线，并分开 l₂ 的把手', 'warn'); shown('—');
      return;
    }
    const useX = Math.abs(l[1]) >= Math.abs(l[0]);
    const projected = source.map((p, i) => {
      const ray = cross3(s, p), q = cross3(ray, l);
      drawLine(B, frame, ray, { ...lineStyle(colors[i], 1.3, '4 7'), opacity: .56 });
      const canvasPoint = toCanvas(frame, q);
      if (visible(B, canvasPoint, 6)) mark(B, canvasPoint, names[i] + '′', colors[i], 10, 23);
      return q;
    });
    const next = projected.every(Boolean)
      ? projectiveCrossRatio(...projected.map(p => [p[useX ? 0 : 1], p[2]])) : null;
    lower(read(next));
    const info = [source[3], ...projected].flatMap((p, i) => {
      if (!p) return [];
      const status = pointStatus(B, frame, p);
      const name = i ? names[i - 1] + '′' : 'D';
      return status === '视窗内' ? [] : [name + ' ' + status];
    });
    shown(info.join(' · ') || '四点及其像均在视窗内');
    if (cr == null || next == null) check('需要四个互不相同的点', 'warn');
    else if (Math.abs(cr - next) < 1e-8 * Math.max(1, Math.abs(cr))) check('两侧交叉比相同', 'ok');
    else check('构型接近退化', 'warn');
  };
  B.render();
  return B;
}
