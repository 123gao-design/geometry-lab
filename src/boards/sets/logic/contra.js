/* 图 O3 · 逆否等价机：四种命题 —— 原命题、逆命题、否命题、逆否命题
   「若 p 则 q」交换 p、q 得逆命题，两者都否定得否命题，换且否得逆否命题。
   右侧 2×2 组合格：p→q 只在「p 真而 q 假」的组合为假，逆否命题 ¬q→¬p 的假组合恰是同一个 ——
   故原命题与逆否命题永远同真假；逆命题与否命题同理共享另一个假组合。探针拖 x 换组合，实时读反例。
   局部坐标约定：u∈[0,860] 向右、v∈[0,430] 向下；px(v)=70+60(v+6)，数轴 v=282；组合格 u 530..766、v 84..196。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const px = v => 70 + 60 * (v + 6), inv = x => (x - 70) / 60 - 6;
  const snap = v => Math.round(v * 20) / 20;
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');

  const PRE = [
    { pt: 'x>2', qt: 'x>1', pf: x => x > 2, qf: x => x > 1, v: [1, 0, 0, 1], ce: [null, 1.5, 1.5, null] },
    { pt: 'x^2>4', qt: 'x>2', pf: x => x * x > 4, qf: x => x > 2, v: [0, 1, 1, 0], ce: [-3, null, null, -3] },
    { pt: '|x|>1', qt: 'x^2>1', pf: x => Math.abs(x) > 1, qf: x => x * x > 1, v: [1, 1, 1, 1], ce: [null, null, null, null] },
  ];
  const st = { i: 0, v: 2.5, auto: false, dir: 1 };
  const ROWS = ['$p\\Rightarrow q$（原）', '$q\\Rightarrow p$（逆）', '$\\neg p\\Rightarrow\\neg q$（否）', '$\\neg q\\Rightarrow\\neg p$（逆否）'];

  const cO = B.chipM('原命题'), cI = B.chipM('逆命题'), cN = B.chipM('否命题'), cC = B.chipM('逆否命题'), cPr = B.chipM('探针'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const P = PRE[st.i];
    B.tex(V(430, 46), `$p:\\ ${P.pt}\\qquad q:\\ ${P.qt}$`, { size: 16, anchor: 'mid' });
    // 四种命题的真假（左列）
    for (let i = 0; i < 4; i++) {
      const y = 88 + i * 28;
      B.tex(V(150, y), ROWS[i], { size: 15, anchor: 'end' });
      B.tex(V(170, y), P.v[i] ? '真 —— 可证' : `假 —— 反例 x=${f1(P.ce[i])}`,
        { size: 14, anchor: 'start', color: P.v[i] ? '#4ade80' : '#ff7b8a' });
    }
    // 2×2 组合格（右）：p 真假为行、q 真假为列
    B.tex(V(589, 72), '$q$ 真', { size: 13, anchor: 'mid' });
    B.tex(V(707, 72), '$q$ 假', { size: 13, anchor: 'mid' });
    B.tex(V(512, 112), '$p$ 真', { size: 13, anchor: 'end' });
    B.tex(V(512, 168), '$p$ 假', { size: 13, anchor: 'end' });
    const CELL = (pt, qt2) => ({ x: qt2 ? 530 : 648, y: pt ? 84 : 140, w: 118, h: 56 });
    for (const [pt, qt2] of [[1, 1], [1, 0], [0, 1], [0, 0]]) {
      const c = CELL(pt, qt2);
      mk('rect', { x: c.x, y: c.y, width: c.w, height: c.h, fill: 'rgba(139,163,189,.05)', stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn);
      let main, sub, col;
      if (pt && !qt2) { main = 'p→q 唯一为假'; sub = '逆否命题同在此为假'; col = '#ff7b8a'; }
      else if (!pt && qt2) { main = 'q→p 唯一为假'; sub = '否命题同在此为假'; col = '#ff9e4a'; }
      else if (pt && qt2) { main = 'p 真、q 真', sub = '四种命题皆真', col = '#5c6a80'; }
      else { main = 'p 假、q 假', sub = '前提不成立，仍为真', col = '#5c6a80'; }
      if (pt && !qt2 || !pt && qt2) {
        mk('rect', { x: c.x + 1, y: c.y + 1, width: c.w - 2, height: c.h - 2, fill: pt && !qt2 ? 'rgba(255,123,138,.14)' : 'rgba(255,158,74,.12)' }, B.dyn);
      }
      B.text(V(c.x + c.w / 2, c.y + 22), main, { 'font-size': 12.5, fill: col, 'text-anchor': 'middle' });
      B.text(V(c.x + c.w / 2, c.y + 40), sub, { 'font-size': 10.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    }
    // 数轴 + 探针
    B.seg(V(px(-6.4), 282), V(px(6.4) + 12, 282), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `${px(6.4) + 20},282 ${px(6.4) + 10},277.5 ${px(6.4) + 10},286.5`, fill: '#8fa3bd' }, B.dyn);
    for (let t = -6; t <= 6; t++) {
      B.seg(V(px(t), 282), V(px(t), 275), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
      B.text(V(px(t), 302), String(t), { 'font-size': 11, fill: '#5c6a80' });
    }
    B.seg(V(px(st.v), 246), V(px(st.v), 310), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
    B.tex(V(px(st.v), 326), '$x=' + fmt(st.v, 2) + '$', { size: 13, anchor: 'mid', color: '#ffd166' });
    B.text(V(150, 226), 'p、q 的真假随 x 取值变化，拖探针换组合', { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 当前组合高亮
    const pT = P.pf(st.v), qT = P.qf(st.v), c = CELL(pT, qT);
    mk('rect', { x: c.x + 2, y: c.y + 2, width: c.w - 4, height: c.h - 4, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn);
    B.tex(V(c.x + c.w - 8, c.y + c.h - 8), `$x=${f1(st.v)}$`, { size: 11, anchor: 'end', color: '#ffd166' });
    // 徽章
    const vd = (i, chip) => chip(`$${['p\\Rightarrow q', 'q\\Rightarrow p', '\\neg p\\Rightarrow\\neg q', '\\neg q\\Rightarrow\\neg p'][i]}$ —— ${P.v[i] ? '真' : '假：反例 x=' + f1(P.ce[i])}`, P.v[i] ? 'ok' : 'warn');
    vd(0, cO); vd(1, cI); vd(2, cN); vd(3, cC);
    cPr(pT && !qT ? `$x=${f1(st.v)}$：p 真、q 假 —— p→q 在此为假，逆否命题同在此为假（反例组合）`
        : !pT && qT ? `$x=${f1(st.v)}$：p 假、q 真 —— q→p 在此为假，否命题同在此为假；p→q 仍为真`
        : pT && qT ? `$x=${f1(st.v)}$：p 真、q 真 —— 四种命题在此都成立`
                    : `$x=${f1(st.v)}$：p 假、q 假 —— 前提不成立，蕴含式按定义仍为真`,
      pT && !qT ? 'warn' : (!pT && qT ? '' : ''));
    cJ('原命题 ⇔ 逆否命题：共享唯一为假的组合，永远同真假；逆命题 ⇔ 否命题同理', 'ok');
  };

  const preBtns = PRE.map((P, i) => B.btnM('①②③'[i] + ` $p:\\ ${P.pt},\\ q:\\ ${P.qt}$`, () => {
    st.i = i;
    preBtns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const scanBtn = B.btn('⏩ 探针扫轴', () => {
    st.auto = !st.auto; scanBtn.classList.toggle('on', st.auto);
    if (st.auto) {
      const step = () => {
        if (!st.auto) return;
        let nv = st.v + st.dir * .05;
        if (nv >= 6) { nv = 6; st.dir = -1; }
        if (nv <= -6) { nv = -6; st.dir = 1; }
        st.v = snap(nv); B.render();
        B.raf(step);
      };
      B.raf(step);
    }
  });

  B.handle({
    get: () => V(px(st.v), 282), color: '#ffd166', label: 'x',
    set: p => { st.v = snap(Math.max(-6, Math.min(6, inv(p.x)))); },
    clamp: p => V(Math.max(px(-6), Math.min(px(6), p.x)), 282),
  });

  B.hint('拖探针换世界：p 真而 q 假使 p→q 为假 —— 逆否命题在同一组合为假，故两命题永远同真假');
  B.render();
  return B;
}
