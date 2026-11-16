/* 图 G3 · 变形顺序机：f(ax±b) 的提因子规则 + 由图反演的读图三步。
   双模式：
   模式一「顺序对比」—— 金线 = 正确读法 y=b·f(a(x−h))+k，红虚线 = 误读 y=b·f(ax−h)+k（把 h
   当平移量、忘了先提因子）：两线起笔点 (h,k) vs (h/a,k) 直接分离；a=1 时两线重合、误读不再显现。
   模式二「由图反演」—— 出题按钮发一条金目标曲线（四参数藏起），拖 a/h/b/k 把橙变形线贴上去，
   最大偏差 < 0.06 判求解。读图三步：起笔点定 h、k → 特征点定 a、b → 形状复核。
   原图固定 √x（不对称、起笔 (0,0)、过 (1,1)），坐标约定见 isoFit。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new Board(root, W, H);

  const f = x => Math.sqrt(x);
  const st = { mode: 0, a: 2, h: 1, b: 1, k: 0, qi: 0, solved: false, grid: true, labs: true };
  const M = B.isoFit(-2.5, 6.5, -2.5, 5.5);
  const px = x => M.px(x), py = y => M.py(y);
  // 题库（四参数都在滑块量程内）：出题按钮按序轮换
  const QUIZ = [
    { a: 2, h: 1, b: 1, k: 1 }, { a: 0.5, h: 2, b: 2, k: 0 },
    { a: 1.5, h: -1, b: 0.5, k: 1 }, { a: 1, h: 3, b: 1, k: -1 },
  ];

  const cE = B.chipM('正确读法'), cM = B.chipM('误读核验'), cD = B.chipM('顺序判读'), cS = B.chipM('一句记法');

  /** 参数化变形曲线 y=bb·f(aa(x−hh))+kk；锚点：起笔与特征像 */
  function drawC(aa, hh, bb, kk, at, anchors) {
    const g = x => bb * f(aa * (x - hh)) + kk;
    B.plot(g, M, { step: .03, anchors, ...at });
    return g;
  }

  B.renderFn = () => {
    const { a, h, b, k } = st;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    drawC(1, 0, 1, 0, { stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .5 }, [0, 1, 4]);   // 原图蓝淡
    const anchors = [h, h + 1 / a, st.mode === 0 ? h / a : QUIZ[st.qi].h];
    if (st.mode === 0) {
      const gp = drawC(a, h, b, k, { stroke: '#ffd166', 'stroke-width': 2.4 }, anchors);   // 正确读法（金）
      drawC(a, h / a, b, k, { stroke: '#ff7b8a', 'stroke-width': 1.6, 'stroke-dasharray': '6 5', 'stroke-opacity': .85 }, [h / a]);   // 误读（红虚）
      // 起笔点核验：正确 (h,k) 金实、误读 (h/a,k) 红空
      if (h > M.X0 && h < M.X1 && k > M.Y0 && k < M.Y1) B.dot(V(px(h), py(k)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      const hx = h / a;
      if (hx > M.X0 && hx < M.X1 && k > M.Y0 && k < M.Y1) B.dot(V(px(hx), py(k)), 5, { fill: '#0a0d14', stroke: '#ff7b8a', 'stroke-width': 1.8 });
      B.tex(V(14, 18), `模式一 · 顺序对比：金线提因子 vs 红虚线误读`, { size: 13, color: '#93a1b5', anchor: 'start', w: 300 });
      cE(`提因子：括号内 $=${fmt(a, 2)}x ${a * h >= 0 ? '-' : '+'} ${fmt(Math.abs(a * h), 2)}$，真平移量 $h=${fmt(h, 2)}$（右为正）`, 'ok');
      cM(`误读线其实 $=f(${fmt(a, 2)}(x ${h / a >= 0 ? '-' : '+'} ${fmt(Math.abs(h / a), 2)}))$：真平移 ${fmt(h / a, 2)} —— 把 $h$ 直接当平移量，差了 $a$ 倍`, Math.abs(a - 1) < 1e-9 ? 'warn' : '');
      cD(Math.abs(a - 1) < 1e-9
        ? 'a=1：两线此刻重合 —— 误读不显现，差异只在 a≠1 时显现'
        : `a≠1：金线与红虚线分离，误读显现 —— 两种正确读法同一式：先右移 $h$ 再横向压 $\\dfrac{1}{a}$ = 先压再右移 $\\dfrac{h}{a}=${fmt(h / a, 2)}$，顺序可换、平移量必换算`, Math.abs(a - 1) < 1e-9 ? 'warn' : 'ok');
      cS('见 $f(ax\\pm b)$ 一律先提因子：$ax-ah=a(x-h)$ —— 平移量只能在提因子之后读，乘法里不许直接读加法', '');
    } else {
      const q = QUIZ[st.qi];
      const gt = drawC(q.a, q.h, q.b, q.k, { stroke: '#ffd166', 'stroke-width': 2.4 }, [q.h, q.h + 1 / q.a]);   // 目标（金）
      const gp = drawC(a, h, b, k, { stroke: '#ff9e4a', 'stroke-width': 2.4 }, [h, h + 1 / a]);                    // 玩家（橙）
      if (q.h > M.X0 && q.h < M.X1 && q.k > M.Y0 && q.k < M.Y1) B.dot(V(px(q.h), py(q.k)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      if (h > M.X0 && h < M.X1 && k > M.Y0 && k < M.Y1) B.dot(V(px(h), py(k)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
      // 求解判定：公共定义域上最大偏差
      let diff = 0;
      const x0 = Math.max(h, q.h) + 0.05, x1 = Math.min(M.X1 - 0.2, 5.2);
      if (x1 > x0) for (let i = 0; i <= 24; i++) {
        const u = x0 + (x1 - x0) * i / 24;
        const yp = b * f(a * (u - h)) + k, yt = q.b * f(q.a * (u - q.h)) + q.k;
        if (isFinite(yp) && isFinite(yt)) diff = Math.max(diff, Math.abs(yp - yt));
      }
      st.solved = diff < 0.06;
      B.tex(V(14, 18), `模式二 · 由图反演（第 ${st.qi + 1} 题）：拖橙线贴金线`, { size: 13, color: '#93a1b5', anchor: 'start', w: 300 });
      cE(`目标金线：$a=?$，$h=?$，$b=?$，$k=?$ —— ${st.solved ? `求解！最大偏差 ${fmt(diff, 3)} —— 四参数全部对上` : `还差 ${fmt(diff, 2)} —— 参数概不透露`}`, st.solved ? 'ok' : 'warn');
      cM('读图三步：① 起笔点 $(0,0)\\to(h,k)$ 先定 h、k ② 特征点 $(1,1)\\to(h+\\dfrac{1}{a},\\ k+b)$ 再定 a、b ③ 形状走向复核', '');
      cD(st.solved ? '四参数全部对上 —— 读图三步的完整走法，再来一题巩固' : '先对起笔点定 h、k，再对第二个特征点定 a、b —— 橙金两线贴住才算数', st.solved ? 'ok' : 'warn');
      cS(st.solved ? `答案揭晓：$a=${fmt(q.a, 2)}$，$h=${fmt(q.h, 2)}$，$b=${fmt(q.b, 2)}$，$k=${fmt(q.k, 2)}$ —— 按下一题继续练` : '未求解不给出答案 —— 拖滑块让橙线与金线重合', st.solved ? 'ok' : '');
    }
  };

  // 模式切换
  const mb = ['顺序对比', '由图反演'].map((t, i) => B.btnM(t, () => {
    st.mode = i;
    mb.forEach((b2, j) => b2.classList.toggle('on', j === i));
    for (const btn of pb) btn.style.display = i === 0 ? '' : 'none';    // 预设只在模式一
    qb.style.display = i === 1 ? '' : 'none';                            // 出题只在模式二
    B.render();
  }, { on: i === 0 }));
  // 模式一预设：三道经典提因子题
  const pb = [
    ['① $f(2(x-1))$', 2, 1, 1, 0],
    ['② $f(\\dfrac{1}{2}(x-2))$', 0.5, 2, 1, 0],
    ['③ $a=1$ 两线重合', 1, 1, 1, 0],
  ].map(([n, a, h, b, k], i) => B.btnM(n, () => {
    st.a = a; st.h = h; st.b = b; st.k = k;
    [slA, slH, slB, slK].forEach((s, j) => s.sync([a, h, b, k][j]));
    B.render();
  }, { pri: i === 0, on: i === 0 }));
  const qb = B.btnM('出题 $\\to$ 下一题', () => {
    st.qi = (st.qi + 1) % QUIZ.length;
    B.render();
  });
  qb.style.display = 'none';
  const slA = B.slider('横向缩放 a', 0.25, 3, 0.05, 2, v => { st.a = v; B.render(); });
  const slH = B.slider('平移 h', -3, 3, 0.05, 1, v => { st.h = v; B.render(); });
  const slB = B.slider('纵向缩放 b', 0.25, 3, 0.05, 1, v => { st.b = v; B.render(); });
  const slK = B.slider('竖移 k', -2, 3, 0.05, 0, v => { st.k = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('模式一：金线（提因子）vs 红虚线（直接读加法）看起笔点分离；模式二：先读起笔点、再对特征点，橙线贴上金线即求解');
  B.render();
  return B;
}
