/* 图 统1a · 分层抽样与简单随机抽样
   总体按年级分成三层，每层的人数不同。左半是总体，右侧是抽出的样本在各层的构成。
   简单随机抽样从全体里等可能地取，各层人数带随机波动；按比例分层则先把样本量按人数比例分到各层，各层份额与总体一致。 */
import { Board, V, mk } from '../../../lib/board.js';

const mulberry32 = a => () => {
  a |= 0; a = a + 0x6D2B79F5 | 0;
  let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { n: 12, mode: 1, seed: 3 };
  const cN = B.chipM('各层样本数'), cM = B.chipM('抽样方式'), cJ = B.chipM('判读');

  const N = [50, 30, 20], NAME = ['高一年级', '高二年级', '高三年级'];
  const COL = ['#5cadff', '#4ade80', '#ffd166'];
  const NT = 100;
  const PX = 104, PY = 84, GX = 30, GY = 26, PER = 10;

  // 总体点阵：每层各自成块，坐标一次算好
  const pos = [];
  let yy = PY;
  N.forEach((ni, s) => {
    for (let k = 0; k < ni; k++) {
      pos.push({ s, x: PX + (k % PER) * GX, y: yy + Math.floor(k / PER) * GY });
    }
    yy += Math.ceil(ni / PER) * GY + 12;
  });

  const sample = () => {
    const rnd = mulberry32(st.seed * 7919 + st.n * 31 + st.mode);
    const marks = pos.map(() => false);
    if (st.mode === 0) {
      const idx = [...Array(NT).keys()];
      for (let i = NT - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      const pick = new Set(idx.slice(0, st.n));
      pos.forEach((p, i) => { if (pick.has(i)) marks[i] = true; });
      return marks;
    }
    // 按比例分层：先按人数份额分配，余数按小数部分从大到小补齐
    const raw = N.map(ni => st.n * ni / NT);
    const cnt = raw.map(v => Math.floor(v));
    let rest = st.n - cnt.reduce((a, b) => a + b, 0);
    const order = raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
    for (let k = 0; k < rest; k++) cnt[order[k % 3][1]]++;
    let base = 0;
    N.forEach((ni, s) => {
      const idx = [...Array(ni).keys()];
      for (let i = ni - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      idx.slice(0, cnt[s]).forEach(i => { marks[base + i] = true; });
      base += ni;
    });
    return marks;
  };

  B.renderFn = () => {
    const marks = sample();
    const cnt = [0, 0, 0];
    marks.forEach((m, i) => { if (m) cnt[pos[i].s]++; });

    B.text(V(104, 56), '总体  100 人', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });
    B.text(V(470, 56), '样本中各层的人数', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });

    // 层名写在每块点阵的右侧，避开点阵与表头
    let y0 = PY;
    N.forEach((ni, s) => {
      B.text(V(390, y0 + 8), NAME[s], { fill: COL[s], 'font-size': 11.5, 'text-anchor': 'start' });
      y0 += Math.ceil(ni / PER) * GY + 12;
    });

    pos.forEach((p, i) => {
      B.dot(V(p.x, p.y), 8, {
        fill: COL[p.s], 'fill-opacity': marks[i] ? .95 : .3,
        stroke: marks[i] ? '#fff' : 'none', 'stroke-width': 1.8,
      });
    });

    // 右栏：各层在样本中的份额，虚线是总体份额
    const BX = 572, BW = 168;
    [0, 1, 2].forEach(s => {
      const y = 126 + s * 78;
      const share = cnt[s] / st.n, tot = N[s] / NT;
      B.text(V(470, y - 14), `${NAME[s]} · ${cnt[s]} 人`, { fill: COL[s], 'font-size': 11.5, 'text-anchor': 'start' });
      B.dyn.appendChild(mk('rect', { x: BX, y, width: BW, height: 20, rx: 4, fill: 'rgba(139,163,189,.08)', stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
      B.dyn.appendChild(mk('rect', { x: BX, y, width: Math.max(0, share * BW), height: 20, rx: 4, fill: COL[s], 'fill-opacity': .55, stroke: COL[s], 'stroke-width': 1.2 }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: BX + tot * BW, y1: y - 6, x2: BX + tot * BW, y2: y + 26, stroke: '#67e8f9', 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }, B.dyn));
      B.textM(V(BX + BW + 12, y + 14), `$${(share * 100).toFixed(1)}\\%$`, { 'font-size': 11, fill: COL[s], 'text-anchor': 'start' });
    });
    B.text(V(470, 356), '青色虚线：总体中各层的比例', { fill: '#67e8f9', 'font-size': 11, 'text-anchor': 'start' });
    B.text(V(470, 380), '每层按「人数份额 × 样本量」分配', { fill: '#8fa3bd', 'font-size': 11, 'text-anchor': 'start' });

    cN(`$n_1:n_2:n_3=${cnt[0]}:${cnt[1]}:${cnt[2]}$`);
    cM(st.mode === 0 ? '简单随机抽样' : '按比例分层抽样');
    cJ(st.mode === 0
      ? '简单随机抽样各层的份额带随机波动，样本量越大越贴近总体比例'
      : '分层抽样把样本量按人数份额分到各层，各层份额与总体一致');
  };

  B.btn('简单随机', () => { st.mode = 0; B.render(); }, { on: () => st.mode === 0 });
  B.btn('按比例分层', () => { st.mode = 1; B.render(); }, { on: () => st.mode === 1 });
  B.btn('重新抽一次', () => { st.seed++; B.render(); });
  B.slider('样本量 n', 6, 30, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  B.hint('分层抽样的各层份额与总体一致，简单随机抽样的各层份额会上下波动');
  B.render();
  return B;
}
