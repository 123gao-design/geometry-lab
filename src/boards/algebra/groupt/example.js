import { Board, V, mk } from '../../../lib/board.js';

/* 群的定义与例子：Z_4、克莱因四元群 V_4、三次对称群 S_3 的运算表。
   同一张表逐条核验封闭、结合、幺元、逆元；交换性由表是否关于对角线对称看出。 */
const PERM = [[1, 2, 3], [2, 1, 3], [3, 2, 1], [1, 3, 2], [2, 3, 1], [3, 1, 2]];
const S3N = ['e', '(12)', '(13)', '(23)', '(123)', '(132)'];
const GROUPS = [
  { n: 'Z_4', names: ['0', '1', '2', '3'], op: (i, j) => (i + j) % 4, e: 0, note: '模 4 加法' },
  { n: 'V_4', names: ['e', 'a', 'b', 'c'], op: (i, j) => i ^ j, e: 0, note: 'a²=b²=c²=e，两两相乘得第三个' },
  {
    n: 'S_3', names: S3N, e: 0, note: '置换的复合',
    op: (i, j) => {
      const r = PERM[j].map(k => PERM[i][k - 1]);
      return PERM.findIndex(p => p[0] === r[0] && p[1] === r[1] && p[2] === r[2]);
    },
  },
];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { g: 0 };
  const cG = B.chipM('例子');
  const cO = B.chipM('阶');
  const cC = B.chipM('交换群');

  B.renderFn = () => {
    const g = GROUPS[st.g], n = g.names.length, cell = Math.min(50, 300 / n), x0 = 96, y0 = 108;
    B.textM(V(410, 30), `${g.n}：${g.note}`, { 'font-size': 15, fill: '#8fa3bd' });
    g.names.forEach((s, i) => {
      B.text(V(x0 + i * cell + cell / 2, y0 - 22), s.length > 3 ? s.slice(0, 3) : s, { 'font-size': 11, fill: '#67e8f9', 'text-anchor': 'middle' });
      B.text(V(x0 - 30, y0 + i * cell + cell / 2 + 4), s.length > 3 ? s.slice(0, 3) : s, { 'font-size': 11, fill: '#67e8f9', 'text-anchor': 'middle' });
    });
    let asso = true;
    for (let a = 0; a < n && asso; a++) for (let b = 0; b < n && asso; b++) for (let c = 0; c < n; c++)
      if (g.op(g.op(a, b), c) !== g.op(a, g.op(b, c))) { asso = false; break; }
    const abel = [...Array(n).keys()].every(i => [...Array(n).keys()].every(j => g.op(i, j) === g.op(j, i)));
    const inverses = [...Array(n).keys()].map(i => [...Array(n).keys()].find(j => g.op(i, j) === g.e));
    const hasAll = inverses.every(v => v !== undefined) && [...Array(n).keys()].every(i => g.op(g.e, i) === i);

    [...Array(n).keys()].forEach(i => [...Array(n).keys()].forEach(j => {
      const v = g.op(i, j), x = x0 + j * cell, y = y0 + i * cell;
      const isE = v === g.e;
      mk('rect', {
        x, y, width: cell - 2, height: cell - 2, rx: 5,
        fill: isE ? 'rgba(255,209,102,.16)' : abel && i < j ? 'rgba(192,132,252,.10)' : 'rgba(92,173,255,.07)',
        stroke: isE ? 'rgba(255,209,102,.8)' : 'rgba(92,173,255,.22)', 'stroke-width': 1.2,
      }, B.dyn);
      const s = g.names[v];
      B.text(V(x + cell / 2 - 1, y + cell / 2 + 4), s.length > 3 ? s.slice(1, 3) : s, { 'font-size': 11, fill: isE ? '#ffd166' : '#c9d7ea', 'text-anchor': 'middle' });
    }));
    B.text(V(x0, y0 + n * cell + 26), n === 3 ? '金色格 = 结果是幺元' : '金色格 = 结果是幺元；紫格标出与对角对称的另一半', { 'font-size': 12, fill: '#8fa3bd' });

    const rx = 470;
    const items = [
      ['封闭', true, '任意两格都有值'],
      ['结合律', asso, '三重乘积与括号位置无关'],
      ['幺元', hasAll, `${g.e === 0 ? 'e' : g.names[g.e]} 与任何元素相乘都不动它`],
      ['逆元', hasAll, inverses.every(v => v !== undefined) ? '每个元素都能乘回幺元' : '有元素乘不回幺元'],
    ];
    items.forEach(([k, ok, note], i) => {
      B.tex(V(rx, 96 + i * 56), `${k}：${ok ? '成立' : '不成立'}`, { size: 13, color: ok ? '#4ade80' : '#ff7b8a', w: 330 });
      B.tex(V(rx + 14, 118 + i * 56), note, { size: 11, color: '#8fa3bd', w: 310 });
    });
    B.tex(V(rx, 340), `阶 |G| = ${n}；${abel ? '表关于对角线对称，是交换群' : '表不对称，非交换'}`, { size: 13, color: abel ? '#4ade80' : '#ff9e4a', w: 340 });
    B.tex(V(rx, 384), st.g === 2 ? 'S_3 是最小的非交换群，六个元素都能看成三条边的重排' : '同样满足四条公理，结构却各不相同', { size: 12, color: '#c084fc', w: 330 });

    cG(g.n);
    cO(`${n}`);
    cC(abel ? '是' : '否');
  };

  GROUPS.forEach((g, i) => B.btn(g.n, () => { st.g = i; B.render(); }));
  B.hint('三条公理换个例子仍然成立，交换性却不是群的定义要求的');
  B.render();
  return B;
}
