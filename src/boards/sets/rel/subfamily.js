/* 图 X2 · 子集家族机：n 个元素的 2ⁿ 个子集全部展示
   toggle 条逐个决定每个元素的「留/去」，网格按元素个数 k 分行陈列全部子集（C(n,k) 计数 → 杨辉三角 1 4 6 4 1）；
   点卡片选定对应子集，A 圈里的元素点金/空核验。四口径计数（2ⁿ / 真子集 / 非空 / 非空真子集）实时核验。
   局部坐标约定：u∈[0,860] 向右、v∈[0,580] 向下（SVG 原生方向）。 */
import { Board, mk, V } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 580;
  const B = new Board(root, W, H);
  const ELL = { cx: 300, cy: 130, rx: 150, ry: 85 };            // 母集 A 的圈
  const POS = [[220, 105], [300, 80], [380, 110], [300, 180]];  // 元素 a b c d 的位置
  const st = { n: 3, mask: 0b101, auto: false, tick: 0 };

  const cS = B.chipM('当前子集'), cCnt = B.chipM('家族核验'), cV = B.chipM('判读');

  // 全部子集：按 |S| 分组、组内按数值序
  const subsets = n => {
    const out = [];
    for (let m = 0; m < (1 << n); m++) out.push(m);
    return out.sort((p, q) => {
      const bp = p.toString(2).replace(/0/g, '').length, bq = q.toString(2).replace(/0/g, '').length;
      return bp - bq || p - q;
    });
  };
  const bits = (m, n) => [...Array(n).keys()].filter(i => m >> i & 1);
  const cardLab = (m, n) => { const b = bits(m, n); return b.length ? b.map(i => 'abcd'[i]).join('') : '∅'; };

  B.renderFn = () => {
    const n = st.n, S = subsets(n), cur = st.mask & ((1 << n) - 1);
    const curBits = new Set(bits(cur, n));
    // 母集圈 A + 元素点（选中的金色实心，未选的空心）
    mk('ellipse', { cx: ELL.cx, cy: ELL.cy, rx: ELL.rx, ry: ELL.ry, fill: '#5cadff', 'fill-opacity': .07, stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.tex(V(ELL.cx, ELL.cy - ELL.ry - 16), '$A=\\{a,b,c,d\\}$ 截取前 ' + n + ' 个', { size: 14, anchor: 'mid', color: '#5cadff' });
    for (let i = 0; i < n; i++) {
      const on = curBits.has(i);
      B.dot(V(POS[i][0], POS[i][1]), 8, on ? { fill: '#ffd166' } : { fill: '#0a0d14', stroke: '#93a1b5', 'stroke-width': 1.6 });
      B.text(V(POS[i][0], POS[i][1] - 14), 'abcd'[i], { 'font-size': 14, fill: on ? '#ffd166' : '#93a1b5' });
    }
    // toggle 条：点元素名切「留/去」
    B.text(V(120, 252), '留/去 ▸', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
    for (let i = 0; i < n; i++) {
      const on = curBits.has(i);
      const bx = mk('rect', { x: 196 + i * 76, y: 238, width: 26, height: 26, rx: 5, 'data-bit': i, fill: on ? '#ffd166' : '#0a0d14', stroke: on ? '#ffd166' : '#93a1b5', 'stroke-width': 1.6 }, B.dyn);
      bx.addEventListener('click', () => { st.mask ^= 1 << i; st.auto = false; autoBtn.classList.remove('on'); B.render(); });
      B.text(V(209 + i * 76, 255), 'abcd'[i], { 'font-size': 13, fill: on ? '#0a0d14' : '#93a1b5' });
    }
    // 家族网格：行 k = 元素个数，卡片 = 每个子集
    const CW = 58, CH = 30, GAP = 6, ROWH = 52;
    for (let k = 0; k <= n; k++) {
      const row = S.filter(m => bits(m, n).length === k), y = 316 + k * ROWH;
      B.tex(V(150, y + 15), 'k=' + k + '：' + row.length + ' 个', { size: 12, anchor: 'end' });
      const wTot = row.length * (CW + GAP) - GAP, x0 = 430 - wTot / 2;
      row.forEach((m, j) => {
        const hit = m === cur, x = x0 + j * (CW + GAP);
        const rc = mk('rect', { x, y, width: CW, height: CH, rx: 6, 'data-card': m, fill: hit ? 'rgba(255,209,102,.55)' : '#22314a', stroke: hit ? '#ffd166' : '#3f5f8f', 'stroke-width': hit ? 2 : 1 }, B.dyn);
        rc.addEventListener('click', () => { st.mask = m; st.auto = false; autoBtn.classList.remove('on'); B.render(); });
        B.text(V(x + CW / 2, y + CH / 2 + 4), cardLab(m, n), { 'font-size': 12, fill: hit ? '#ffd166' : '#93a1b5' });
        if (hit) mk('rect', { x: x - 2, y: y - 2, width: CW + 4, height: CH + 4, rx: 7, fill: 'none', stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, B.dyn);
      });
    }
    // 徽章
    cS(bits(cur, n).length ? '$S=\\{' + bits(cur, n).map(i => 'abcd'[i]).join(',') + '\\}$' : '$S=\\varnothing$', '');
    const tot = 1 << n;
    cCnt('$2^' + n + '=' + tot + '$ 个子集 · 真子集 ' + (tot - 1) + ' · 非空 ' + (tot - 1) + ' · 非空真子集 ' + (tot - 2), '');
    if (cur === (1 << n) - 1 && n > 0) cV('这是 $A$ 本身：从 $2^' + n + '$ 里减去它才是真子集口径（' + (tot - 1) + ' 个）', 'warn');
    else if (cur === 0) cV('空集 $\\varnothing$：讨论「非空」口径时要减去它 —— 但 $\\varnothing\\subseteq A$ 恒成立', 'warn');
    else cV('每个元素独立「留/去」2 种：$2\\times2\\times\\cdots\\times2=' + tot + '$ —— 乘法原理', 'ok');
  };

  const nSl = B.slider('元素个数 n', 1, 4, 1, 3, v => { st.n = v; st.mask &= (1 << v) - 1; B.render(); });

  const autoBtn = B.btn('⏩ 家族巡游', () => {
    st.auto = !st.auto; st.tick = 0; autoBtn.classList.toggle('on', st.auto);
    if (st.auto) {
      const step = () => {
        st.tick++;
        if (st.tick >= 30) { st.tick = 0; st.mask = (st.mask + 1) & ((1 << st.n) - 1); B.render(); }
        if (st.auto) B.raf(step);
      };
      B.raf(step);
    }
  });
  B.btn('🎲 随机选卡', () => {
    st.auto = false; autoBtn.classList.remove('on');
    st.mask = Math.floor(Math.random() * (1 << st.n));
    B.render();
  });

  B.hintM('点元素名切「留/去」、点卡片选定：$2^n$ 个子集全部列出 —— 注意「真子集 / 非空 / 非空真子集」三个口径各减各的');
  B.render();
  return B;
}
