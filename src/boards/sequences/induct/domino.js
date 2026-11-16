/* 图 归1 · 递推链机
   把命题 P(1),P(2),… 画成一排卡片。数学归纳法只有两步：
   ① 第一张成立；② 任意一张成立都能推出下一张。两步齐备，整排卡片逐个倒下。
   局部坐标：卡片 x 从 90 起、间距 78，卡面 y∈[150,214]。 */
import { Board, mk, V } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 380;
  const B = new Board(root, W, H);
  const st = { k: 1 };
  const N = 9;
  const c1 = B.chipM('已证到'), c2 = B.chipM('正在推'), cJ = B.chipM('判读');
  const cx = i => 90 + (i - 1) * 78;

  B.renderFn = () => {
    const k = st.k;
    // 卡面
    for (let i = 1; i <= N; i++) {
      const x = cx(i), done = i <= k, next = i === k + 1;
      mk('rect', { x, y: 150, width: 64, height: 64, rx: 8,
        fill: done ? '#4ade80' : next ? '#ffd166' : '#93a1b5',
        'fill-opacity': done ? .28 : next ? .2 : .08,
        stroke: done ? '#4ade80' : next ? '#ffd166' : '#93a1b5',
        'stroke-width': next ? 2.2 : 1.2 }, B.dyn);
      B.tex(V(x + 32, 182), `$P(${i})$`, { size: 12, anchor: 'mid',
        color: done ? '#4ade80' : next ? '#ffd166' : '#93a1b5', w: 60 });
    }
    // 推理箭头：只画当前这一步
    const x1 = cx(k) + 64, x2 = cx(k + 1);
    B.arrow(V(x1 + 2, 182), V(x2 - 2, 182), { stroke: '#ffd166', 'stroke-width': 1.8, head: 8, wide: 4 });
    B.tex(V((x1 + x2) / 2, 132), '推出', { size: 10.5, anchor: 'mid', color: '#ffd166', w: 50 });
    // 顶部说明
    B.text(V(60, 40), '第一张卡片成立，并且每一张成立都能推出下一张', { 'font-size': 13.5, fill: '#93a1b5' });
    B.tex(V(60, 84), '① $P(1)$ 成立　② 若 $P(k)$ 成立，则 $P(k+1)$ 成立', { size: 13.5, anchor: 'start', w: 760 });
    // 底部读数
    B.tex(V(90, 258), `已证：$P(1)$ 到 $P(${k})$　正在推：$P(${k})\\Rightarrow P(${k + 1})$`, { size: 12.5, anchor: 'start', color: '#93a1b5', w: 640 });
    B.tex(V(90, 300), k === N
      ? '链条推到了最后一张：对一切正整数 $n$，$P(n)$ 成立'
      : `再走一步，$P(${k + 1})$ 也归入已证`, { size: 13.5, anchor: 'start', color: '#ffd166', w: 640 });
    B.text(V(90, 340), '两步缺一不可：没有起点，推不出任何一张；没有递推，起点只能管自己', { 'font-size': 12, fill: '#93a1b5' });
    // 徽章
    c1(`$P(1)$ 至 $P(${k})$ 已证`);
    c2(`$P(${k})\\Rightarrow P(${k + 1})$`);
    cJ(k === N ? '整条链成立' : `下一步：$P(${k + 1})$`);
  };

  const slK = B.slider('已证到 k =', 1, 8, 1, 1, v => { st.k = v; B.render(); });
  B.btn('推进一步', () => {
    st.k = Math.min(8, st.k + 1);
    slK.sync(st.k);
    B.render();
  });

  B.hint('每一步只做一件事：把「若 P(k) 则 P(k+1)」接在已证的链尾上');
  B.render();
  return B;
}
