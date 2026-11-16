/* 图 数1 · 数学期望
   把分布列画成挂在横梁上的四块重物，重物的重量就是概率。
   横梁在期望 E(X) 处支起一个支点：支点左右两侧的「重量 × 力臂」恰好相等，整条梁才平衡。
   期望就是分布的重心 —— 加权平均，权重是概率。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { w1: 3, w2: 2, w3: 1, w4: 1 };
  const cE = B.chipM('E(X)'), cS = B.chipM('分布列和'), cJ = B.chipM('判读');

  const f3 = v => v.toFixed(3);

  B.renderFn = () => {
    const ws = [st.w1, st.w2, st.w3, st.w4];
    const S = ws.reduce((a, b) => a + b, 0);
    const ps = ws.map(w => w / S);
    const E = ps.reduce((a, p, i) => a + i * p, 0);

    const Y = 268, PX = i => 168 + i * 152;
    const MX = PX(E);

    // 横梁
    B.dyn.appendChild(mk('rect', {
      x: 96, y: Y - 7, width: 660, height: 14, rx: 4,
      fill: 'rgba(139,163,189,.12)', stroke: '#aebdd2', 'stroke-width': 1.2,
    }, B.dyn));
    B.text(V(112, 64), '概率就是压在横梁上的重量', { fill: '#5c6a80', 'font-size': 11.5, 'text-anchor': 'start' });

    // 立在横梁上的重物
    ps.forEach((p, i) => {
      const h = Math.max(6, p * 176);
      B.dyn.appendChild(mk('rect', {
        x: PX(i) - 27, y: Y - 7 - h, width: 54, height: h, rx: 5,
        fill: '#5cadff', 'fill-opacity': .45, stroke: '#5cadff', 'stroke-width': 1.4,
      }, B.dyn));
      B.textM(V(PX(i), Y - 7 - h - 14), `$${f3(p)}$`, { 'font-size': 11, fill: '#8fa3bd' });
      B.textM(V(PX(i), Y + 54), `$${i}$`, { 'font-size': 12.5, fill: '#aebdd2' });
    });

    // 支点
    B.dyn.appendChild(mk('polygon', {
      points: `${MX},${Y + 7} ${MX - 13},${Y + 36} ${MX + 13},${Y + 36}`,
      fill: '#ffd166', 'fill-opacity': .85, stroke: '#ffd166', 'stroke-width': 1.4,
    }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: MX, y1: 92, x2: MX, y2: Y - 7, stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' }, B.dyn));
    B.textM(V(MX, 86), `$E(X)=${f3(E)}$`, { 'font-size': 13, fill: '#ffd166' });

    // 力臂标尺
    ps.forEach((p, i) => {
      B.dyn.appendChild(mk('line', {
        x1: PX(i), y1: Y - 20, x2: MX, y2: Y - 20, stroke: '#67e8f9', 'stroke-width': 1, 'stroke-opacity': .35, 'stroke-dasharray': '3 3',
      }, B.dyn));
    });
    B.text(V(96 + 330, 44), '支点两侧「概率 × 距离」之和相抵，横梁才水平', { fill: '#67e8f9', 'font-size': 12 });

    cE(`$0\\cdot${f3(ps[0])}+1\\cdot${f3(ps[1])}+2\\cdot${f3(ps[2])}+3\\cdot${f3(ps[3])}=${f3(E)}$`);
    cS(`$${f3(ps.reduce((a, b) => a + b, 0))}$`);
    cJ(Math.abs(E - Math.round(E)) < 1e-9
      ? `期望恰好落在 ${Math.round(E)} 上，但期望是加权平均，不一定等于某个可能取值`
      : '期望落在两个取值之间，横梁仍能在这一点平衡 —— 重心未必是分布列里的哪个数');
  };

  B.slider('取值 0 的权重 w1', 1, 6, 1, st.w1, v => { st.w1 = v; B.render(); }, 'w1');
  B.slider('取值 1 的权重 w2', 1, 6, 1, st.w2, v => { st.w2 = v; B.render(); }, 'w2');
  B.slider('取值 2 的权重 w3', 1, 6, 1, st.w3, v => { st.w3 = v; B.render(); }, 'w3');
  B.slider('取值 3 的权重 w4', 1, 6, 1, st.w4, v => { st.w4 = v; B.render(); }, 'w4');

  B.hint('把重物全压到一侧，支点就跟着往那边挪：期望是分布的重心');
  B.render();
  return B;
}
