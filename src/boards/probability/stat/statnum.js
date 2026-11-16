/* 图 统2 · 样本的数字特征
   一组 10 个数据点在数轴上堆叠，金色那点可以拖动。平均数画成金色竖线，中位数画成紫色竖线。
   下方每一行是一个数据点到平均数的距离，绿色向右、红色向左：方差的平方和就是这些距离平方的总和。 */
import { Board, V, mk } from '../../../lib/board.js';

const FIXED = [1, 2, 2, 3, 3, 4, 4, 5, 9];

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { x: 6 };
  const cM = B.chipM('平均数'), cMd = B.chipM('中位数'), cV = B.chipM('方差与标准差'), cZ = B.chipM('众数'), cJ = B.chipM('判读');

  const X0 = 110, XS = 60, AY = 250;
  const px = x => X0 + x * XS;

  B.renderFn = () => {
    const xs = [...FIXED, st.x];
    const n = xs.length;
    const mean = xs.reduce((a, b) => a + b, 0) / n;
    const sorted = [...xs].sort((a, b) => a - b);
    const median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const D = xs.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
    const sd = Math.sqrt(D);
    const votes = {};
    xs.forEach(v => { votes[v.toFixed(2)] = (votes[v.toFixed(2)] || 0) + 1; });
    const top = Math.max(...Object.values(votes));
    const modes = Object.keys(votes).filter(k => votes[k] === top && top > 1).map(Number);

    // 数轴
    B.dyn.appendChild(mk('line', { x1: X0 - 24, y1: AY, x2: px(10) + 26, y2: AY, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));
    for (let i = 0; i <= 10; i++) {
      B.dyn.appendChild(mk('line', { x1: px(i), y1: AY, x2: px(i), y2: AY + 5, stroke: '#aebdd2', 'stroke-width': 1 }, B.dyn));
      B.textM(V(px(i), AY + 19), `$${i}$`, { 'font-size': 10.5, fill: '#8fa3bd' });
    }

    // 点阵：同值向上叠
    const lv = {};
    const pts = xs.map((v, i) => {
      const key = v.toFixed(2);
      lv[key] = (lv[key] || 0);
      const l = lv[key]++;
      return { v, y: AY - 16 - l * 19, drag: i === n - 1 };
    });
    pts.forEach(p => B.dot(V(px(p.v), p.y), 7, {
      fill: p.drag ? '#ffd166' : '#5cadff', 'fill-opacity': .9,
    }));

    // 平均数、中位数竖线
    B.dyn.appendChild(mk('line', { x1: px(mean), y1: 74, x2: px(mean), y2: AY, stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: px(median), y1: 74, x2: px(median), y2: AY, stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-dasharray': '2 4' }, B.dyn));
    B.textM(V(px(mean) + 6, 66), '$\\bar x$', { 'font-size': 12.5, fill: '#ff9e4a', 'text-anchor': 'start' });
    B.textM(V(px(median) - 6, 66), '$M_e$', { 'font-size': 12.5, fill: '#c084fc', 'text-anchor': 'end' });

    // 偏差条：每行一个点到平均数的有向距离
    xs.forEach((v, i) => {
      const y = AY + 40 + i * 9;
      B.dyn.appendChild(mk('line', { x1: px(mean), y1: y, x2: px(v), y2: y, stroke: v > mean ? '#4ade80' : '#ff7b8a', 'stroke-width': 3, 'stroke-opacity': .55, 'stroke-linecap': 'round' }, B.dyn));
    });
    B.textM(V(px(10) + 34, AY + 70), '$x_i-\\bar x$', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });

    cM(`$${mean.toFixed(3)}$`);
    cMd(`$${median.toFixed(3)}$`);
    cV(`$s^2=${D.toFixed(3)}$，$s=${sd.toFixed(3)}$`);
    cZ(modes.length ? `$${modes.map(v => v.toFixed(1)).join(',\\,')}$` : '没有重复出现的数');
    cJ(st.x > 8.6 ? '把这一点拖到最右端：平均数被拉高不少，中位数只挪了一点'
      : st.x < 1.4 ? '把这一点拖到最左端：平均数被拉低不少，中位数几乎不动'
        : '拖动金色点：平均数随每个数移动，中位数只看中间位置，对极端值不敏感');
  };

  B.handle({
    color: '#ffd166', r: 9, label: 'x',
    get: () => {
      const lv2 = FIXED.filter(v => v.toFixed(2) === st.x.toFixed(2)).length;
      return V(px(st.x), AY - 16 - lv2 * 19);
    },
    set: p => {
      st.x = Math.max(0, Math.min(10, Math.round((p.x - X0) / XS * 10) / 10));
    },
  });

  B.hint('拖动金色点：平均数跟着每个数走，中位数只由中间那个位置决定');
  B.render();
  return B;
}
