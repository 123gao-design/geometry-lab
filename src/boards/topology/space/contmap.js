/* 图 拓4 · 连续映射：开区间拉到开集
   左图画出 f(x)=x²，右侧给一段值域开区间 (a,b)（橙色横带）。
   它的原像画成绿色竖带：两段开区间。上下沿一拖，原像跟着伸缩，
   但始终是开集——这就是连续性「开集的原像还是开集」。
   开关切到「跳断函数」：y=x（x<1）与 y=x+1（x≥1）拼起来。
   值域里一段开区间，原像却带一个实心端点 [1,1.5)，
   连续性就在这一端丢掉了。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const m = B.isoFit(-2.4, 2.4, -0.7, 4.7, [34, 22, 532, 384], 24);
  const st = { a: 1, b: 2.4, jump: false, grid: true, labs: true };

  const cA = B.chipM('值域区间'), cP = B.chipM('原像'), cJ = B.chipM('判读');

  const fCont = x => x * x;
  const fJump = x => (x < 1 ? x : x + 1);

  // 原像：返回 {segs:[{x0,x1,lopen,ropen}], note}
  function preimage() {
    const { a, b } = st;
    const X0 = m.X0, X1 = m.X1;
    if (!st.jump) {
      const lo = Math.sqrt(Math.max(0, a));
      const hi = Math.sqrt(Math.max(0, b));
      const segs = [];
      if (lo <= 1e-6) segs.push({ x0: Math.max(X0, -hi), x1: Math.min(X1, hi), lopen: true, ropen: true });
      else {
        segs.push({ x0: Math.max(X0, -hi), x1: -lo, lopen: true, ropen: true });
        segs.push({ x0: lo, x1: Math.min(X1, hi), lopen: true, ropen: true });
      }
      return { segs, note: segs.length > 1 ? '两段开区间之并，是开集' : '一段开区间', ok: true };
    }
    // 跳断：左支 y=x（x<1），右支 y=x+1（x≥1）
    const segs = [];
    const l1 = Math.min(b, 1);
    if (l1 > a + 1e-9) segs.push({ x0: a, x1: l1, lopen: true, ropen: b > 1 });
    const r0 = Math.max(a - 1, 1);
    const r1 = b - 1;
    if (r1 > r0 + 1e-9) segs.push({ x0: r0, x1: r1, lopen: !(a - 1 < 1), ropen: true });
    const closed = segs.some(s => !s.lopen);
    return { segs, note: closed ? '原像带了实心端点，不是开集' : '这一段恰好还是开集', ok: !closed };
  }

  B.renderFn = () => {
    const pm = { ...m, grid: st.grid, labs: st.labs };
    B.grid(pm);

    // 值域开区间 (a,b)：橙色横带
    const yA = m.py(st.b), yB = m.py(st.a);
    mk('rect', { x: m.px(m.X0), y: yA, width: m.px(m.X1) - m.px(m.X0), height: Math.max(1, yB - yA), fill: '#ff9e4a', 'fill-opacity': .13 }, B.dyn);
    B.seg(V(m.px(m.X0), yA), V(m.px(m.X1), yA), { stroke: '#ff9e4a', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
    B.seg(V(m.px(m.X0), yB), V(m.px(m.X1), yB), { stroke: '#ff9e4a', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
    B.tex(V(m.px(m.X1) - 6, yA + 15), '$(a,b)$', { size: 12.5, color: '#ff9e4a', w: 60, anchor: 'end' });

    // 原像：绿色竖带 + 轴上的粗段
    const pr = preimage();
    for (const sg of pr.segs) {
      const xa = m.px(Math.max(m.X0, sg.x0)), xb = m.px(Math.min(m.X1, sg.x1));
      mk('rect', { x: xa, y: m.py(m.Y1), width: Math.max(0, xb - xa), height: m.py(m.Y0) - m.py(m.Y1), fill: '#4ade80', 'fill-opacity': .1 }, B.dyn);
      B.seg(V(xa, m.py(0)), V(xb, m.py(0)), { stroke: '#4ade80', 'stroke-width': 6, 'stroke-opacity': .8, 'stroke-linecap': 'round' });
      // 端点：空心 = 不含，实心 = 含
      const e1 = V(xa, m.py(0)), e2 = V(xb, m.py(0));
      if (sg.lopen) mk('circle', { cx: e1.x, cy: e1.y, r: 4.6, fill: '#12161f', stroke: '#4ade80', 'stroke-width': 2 }, B.dyn);
      else B.dot(e1, 4.6, { fill: '#4ade80', stroke: '#12161f', 'stroke-width': 1.4 });
      if (sg.ropen) mk('circle', { cx: e2.x, cy: e2.y, r: 4.6, fill: '#12161f', stroke: '#4ade80', 'stroke-width': 2 }, B.dyn);
      else B.dot(e2, 4.6, { fill: '#4ade80', stroke: '#12161f', 'stroke-width': 1.4 });
    }

    // 函数曲线
    if (!st.jump) {
      B.plot(fCont, m, { stroke: '#5cadff', 'stroke-width': 2.4 });
      B.tex(V(m.px(1.75), m.py(1.75 * 1.75) - 14), '$f(x)=x^2$', { size: 13, color: '#5cadff', w: 110 });
    } else {
      B.plot(fJump, m, { stroke: '#5cadff', 'stroke-width': 2.4, dom: x => x < 1 });
      B.plot(fJump, m, { stroke: '#5cadff', 'stroke-width': 2.4, dom: x => x >= 1 });
      mk('circle', { cx: m.px(1), cy: m.py(1), r: 4.6, fill: '#12161f', stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
      B.dot(V(m.px(1), m.py(2)), 4.6, { fill: '#5cadff' });
      B.tex(V(m.px(1.12), m.py(1.9)), '断点', { size: 12, color: '#ff7b8a', w: 60 });
    }

    B.tex(V(618, 96), st.jump ? '跳断函数' : '连续映射', { size: 15, color: '#e8eef7', w: 160 });
    B.tex(V(618, 148), pr.note, { size: 12.5, color: pr.ok ? '#4ade80' : '#ff7b8a', w: 170 });
    B.tex(V(618, 210), '$f^{-1}(a,b)$ 的端点：空心不含、实心含', { size: 11.5, color: '#8fa3bd', w: 170 });

    B.tex(V(W / 2, H - 84), pr.ok ? '值域取开区间，原像仍是开集' : '值域取开区间，原像却含端点——在 $x=1$ 处断了', { size: 12.5, color: pr.ok ? '#4ade80' : '#ff7b8a', w: 560, anchor: 'mid' });

    cA(`$(${fmt(st.a, 2)}, ${fmt(st.b, 2)})$`, '');
    cP(`${pr.segs.length} 段${pr.segs.some(s => !s.lopen) ? '（含端点）' : ''}`, pr.ok ? 'ok' : 'warn');
    cJ(pr.ok ? '原像是开集' : '原像不是开集', pr.ok ? 'ok' : 'warn');
  };

  B.slider('下沿 a', 0, 3.4, .05, st.a, v => { st.a = Math.min(v, st.b - .2); B.render(); });
  B.slider('上沿 b', .4, 4.5, .05, st.b, v => { st.b = Math.max(v, st.a + .2); B.render(); });
  B.toggleBtn('跳断函数', false, v => { st.jump = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hintM('把橙色横带整个拖到 $y=1$ 以下再看跳断函数：原像被切成两段，靠近断点的那一端变成实心');
  B.render();
  return B;
}
