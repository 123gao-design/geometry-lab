/* 图 连3 · 紧致：开覆盖与有限子覆盖
   同一条数轴上的两块空间：闭区间 [0,1] 与开区间 (0,1)。
   闭区间这边，无论切出多少段开区间去盖，总能只用其中有限个；
   开区间这边用 (1/(k+1), 1/(k−1)) 一族去盖，尾巴越贴 0 越盖不住——
   任取有限个，靠近 0 的一段永远空着。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { closed: true, n: 4, m: 5 };

  const cN = B.chipM('开区间数'), cC = B.chipM('覆盖');

  const X0 = 110, X1 = 744, yL = 320;
  const px = x => X0 + x * (X1 - X0);

  B.renderFn = () => {
    // 数轴与空间
    B.seg(V(X0 - 26, yL), V(X1 + 26, yL), { stroke: '#2b3b53', 'stroke-width': 2 });
    B.seg(V(X0, yL), V(X1, yL), { stroke: '#e8eef7', 'stroke-width': 4, 'stroke-linecap': 'round' });
    if (st.closed) {
      B.dot(V(px(0), yL), 5.5, { fill: '#e8eef7', stroke: '#12161f', 'stroke-width': 1.4 });
      B.dot(V(px(1), yL), 5.5, { fill: '#e8eef7', stroke: '#12161f', 'stroke-width': 1.4 });
    } else {
      mk('circle', { cx: px(0), cy: yL, r: 5.5, fill: '#12161f', stroke: '#ff7b8a', 'stroke-width': 2 }, B.dyn);
      mk('circle', { cx: px(1), cy: yL, r: 5.5, fill: '#12161f', stroke: '#e8eef7', 'stroke-width': 2 }, B.dyn);
      B.tex(V(px(0) - 4, yL + 32), '0 不在', { size: 11.5, color: '#ff7b8a', anchor: 'mid', w: 80 });
    }
    B.tex(V(px(0), yL - 20), '0', { size: 11.5, color: '#5c6a80', anchor: 'mid', w: 30 });
    B.tex(V(px(1), yL - 20), '1', { size: 11.5, color: '#5c6a80', anchor: 'mid', w: 30 });
    B.tex(V(px(.5), yL + 40), st.closed ? '$X=[0,1]$' : '$X=(0,1)$', { size: 14, color: '#e8eef7', anchor: 'mid', w: 120 });

    if (st.closed) {
      const n = st.n, hw = .62 / Math.max(1, n - 1);
      for (let i = 0; i < n; i++) {
        const c = n === 1 ? .5 : i / (n - 1);
        const a = Math.max(-.06, c - hw), b = Math.min(1.06, c + hw);
        const y = 268 - i * 26;
        const col = i % 2 ? '#67e8f9' : '#5cadff';
        mk('rect', { x: px(a), y, width: px(b) - px(a), height: 16, rx: 8, fill: col, 'fill-opacity': .17, stroke: col, 'stroke-width': 1.3 }, B.dyn);
        B.text(V(px(a) + 6, y + 12), `(${fmt(a, 2)}, ${fmt(b, 2)})`, { fill: col, 'font-size': 10.5 });
      }
      B.tex(V(X1 - 158, 262 - n * 13), `有限 ${n} 个`, { size: 12, color: '#4ade80', w: 80 });
      B.tex(V(W / 2, H - 92), '闭区间上任给一族开区间去盖，都能从中抽出有限个盖满', { size: 12.5, color: '#8fa3bd', w: 580, anchor: 'mid' });
      cN(`$${n}$`, 'ok');
      cC('有限个盖满 $[0,1]$', 'ok');
    } else {
      const m = st.m;
      for (let k = 2; k <= m + 1; k++) {
        const a = 1 / (k + 1), b = k === 2 ? 1.04 : 1 / (k - 1);
        const y = 268 - (k - 2) * 30;
        const col = k % 2 ? '#67e8f9' : '#5cadff';
        mk('rect', { x: px(a), y, width: Math.max(2, px(b) - px(a)), height: 18, rx: 9, fill: col, 'fill-opacity': .17, stroke: col, 'stroke-width': 1.3 }, B.dyn);
        B.text(V(px(a) + 6, y + 13), `(${fmt(a, 2)}, ${fmt(b, 2)})`, { fill: col, 'font-size': 10.5 });
      }
      const gap = 1 / (m + 2);
      mk('rect', { x: px(0), y: yL - 26, width: Math.max(2, px(gap) - px(0)), height: 52, fill: '#ff7b8a', 'fill-opacity': .2 }, B.dyn);
      B.tex(V(px(gap) + 64, yL - 46), `$(0,\\frac{1}{${m + 2}})$ 盖不住`, { size: 11.5, color: '#ff7b8a', w: 200 });
      B.tex(V(W / 2, H - 92), '再添几段也只是把缺口往 0 挪——任取有限个都盖不满 $(0,1)$', { size: 12.5, color: '#ff7b8a', w: 600, anchor: 'mid' });
      cN(`$${m}$ 段`, 'warn');
      cC(`缺 $(0,\\frac{1}{${m + 2}})$`, 'warn');
    }
  };

  B.slider('覆盖段数', 2, 8, 1, st.n, v => { st.n = v; B.render(); });
  B.slider('无限族取前几段', 2, 8, 1, st.m, v => { st.m = v; B.render(); });
  B.toggleBtn('开区间 (0,1)', false, v => { st.closed = !v; B.render(); });
  B.hintM('闭区间这边段数一加就盖满；切到开区间，段数再加，红色缺口永远贴着 0');
  B.render();
  return B;
}
