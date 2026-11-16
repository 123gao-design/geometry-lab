/* 图 V6 · 泰勒拟合机：麦克劳林展开的「长成」过程 —— 在 0 处逐阶对齐导数。
   蓝曲线=目标函数，金曲线=部分和 P_n（拖「阶数」一项项长上来），灰虚=各项单独曲线（虚线逐项）；
   检验点 x_q 竖线量误差：e^x/sin 收敛飞快，ln(1+x) 越过收敛半径 1 直接发散。
   各原图量级不同，按 E4/E7 先例各用比例尺（mapFit）；网格步长 gx/gy 按原图传给 B.grid。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  const fact = k => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
  const PRESETS = [
    {
      name: '① $f=e^x$', f: x => Math.exp(x), nMax: 6, ghostFrom: 0,
      xa: -2.3, xb: 2.3, ya: -1.5, yb: 9.5, qlo: -2.2, qhi: 2.2,
      gx: 0.5, gy: 1, lx: 1, ly: 2,
      terms: k => x => Math.pow(x, k) / fact(k),
      corner: '$e=\\sum 1/k!=\\lim(1+1/n)^n\\approx 2.71828$',
    },
    {
      name: '② $f=\\sin x$', f: x => Math.sin(x), nMax: 6, ghostFrom: 0,
      xa: -3.6, xb: 3.6, ya: -2.4, yb: 2.4, qlo: -3.5, qhi: 3.5,
      gx: 0.5, gy: 0.5, lx: 1, ly: 1,
      terms: k => x => (k % 2 === 0 ? 1 : -1) * Math.pow(x, 2 * k + 1) / fact(2 * k + 1),
      corner: '$\\sin x$ 奇函数：展开只含奇次幂 —— S3 的代数影子',
    },
    {
      name: '③ $f=\\ln(1+x)$', f: x => Math.log(1 + x), nMax: 6, ghostFrom: 1, dom: -0.995,
      xa: -0.92, xb: 1.75, ya: -2.6, yb: 1.6, qlo: -0.9, qhi: 1.6,
      gx: 0.25, gy: 0.5, lx: 0.5, ly: 1,
      terms: k => (k === 0 ? () => 0 : x => (k % 2 === 1 ? 1 : -1) * Math.pow(x, k) / k),
      corner: '$\\ln(1+x)$ 收敛半径 $1$：$|x|<1$ 才保证贴合',
    },
  ];
  /** 各向比例尺取景（E4/E7 先例）：不回传 sx/sy（B.grid 把它们读作步长） */
  const MAPS = PRESETS.map(P => B.mapFit(P.xa, P.xb, P.ya, P.yb));
  const st = { p: 0, n: 3, xq: 1, ghost: false, grid: true, labs: true };

  const cX = B.chipM('展开式'), cE = B.chipM('检验点误差'), cC = B.chipM('收敛判读');

  const sumAt = (P, n, x) => { let s = 0; for (let k = 0; k <= n; k++) s += P.terms(k)(x); return s; };
  const frac = (a, b) => `\\dfrac{x^{${a}}}{${b}}`;
  const termText = (P, n) => {
    const i = PRESETS.indexOf(P);
    if (i === 0) {   // e^x：1+x+x²/2+…
      if (n === 0) return '$P_0(x)=1$';
      if (n === 1) return '$P_1(x)=1+x$';
      let t = '$P_2(x)=1+x+\\dfrac{x^2}{2}';
      for (let k = 3; k <= n; k++) t += `+${frac(k, k + '!')}`;
      return t + '$';
    }
    if (i === 1) {   // sin：x−x³/3!+x⁵/5!−…
      if (n === 0) return '$P_0(x)=x$';
      let t = '$P_1(x)=x-\\dfrac{x^3}{3!}';
      for (let k = 2; k <= n; k++) t += `${k % 2 === 0 ? '+' : '-'}${frac(2 * k + 1, 2 * k + 1 + '!')}`;
      return t + '$';
    }
    if (n === 0) return '$P_0(x)=0$';   // ln(1+x)：x−x²/2+x³/3−…
    if (n === 1) return '$P_1(x)=x$';
    let t = '$P_2(x)=x-\\dfrac{x^2}{2}';
    for (let k = 3; k <= n; k++) t += `${k % 2 === 1 ? '+' : '-'}${frac(k, k)}`;
    return t + '$';
  };

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    B.grid({ ...M, grid: st.grid, labs: st.labs, sx: P.gx, sy: P.gy, lx: P.lx, ly: P.ly });
    B.tex(V(20, 28), P.corner, { size: 13.5, color: '#93a1b5', anchor: 'start', w: 380 });

    const inDom = P.dom == null || st.xq > P.dom;
    // 目标曲线（蓝）：分段折线，出定义域断笔
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.04) xs.push(x);
    const drawFn = (fn, at, skipDom) => {
      let d = '', pen = false;
      for (const x of xs) {
        if (skipDom && (P.dom != null && x <= P.dom)) { pen = false; continue; }
        const y = fn(x);
        if (isFinite(y) && y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
        pen = false;
      }
      mk('path', { d, fill: 'none', ...at }, B.dyn);
    };
    drawFn(P.f, { stroke: '#5cadff', 'stroke-width': 2.2 }, true);
    // 虚线逐项：各项单独曲线（灰虚）—— 看每一项自己的图象（ln 的第 0 项恒为 0，跳过）
    if (st.ghost) for (let k = P.ghostFrom; k <= st.n; k++)
      drawFn(P.terms(k), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-opacity': .5, 'stroke-dasharray': '5 4' }, true);
    // 部分和 P_n（金，粗）：多项式一项项长上来
    drawFn(x => sumAt(P, st.n, x), { stroke: '#ffd166', 'stroke-width': 2.2 }, false);
    // 检验点：竖线 + 两点连线（橙=误差棒、金=多项式读数、绿=真值）
    if (st.xq > M.X0 && st.xq < M.X1) {
      const yP = sumAt(P, st.n, st.xq), yF = P.f(st.xq);
      B.seg(V(M.px(st.xq), 40), V(M.px(st.xq), H - 40), { stroke: '#3f5f8f', 'stroke-dasharray': '4 5', 'stroke-width': 1.1 });
      if (inDom && isFinite(yF) && yF > M.Y0 && yF < M.Y1) {
        if (isFinite(yP) && yP > M.Y0 && yP < M.Y1) {
          B.seg(V(M.px(st.xq), M.py(yP)), V(M.px(st.xq), M.py(yF)), { stroke: '#ff9e4a', 'stroke-width': 2 });
          B.dot(V(M.px(st.xq), M.py(yP)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
        }
        B.dot(V(M.px(st.xq), M.py(yF)), 5, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1.5 });
      }
    }

    // 徽章
    cX(termText(P, st.n) + ` —— $0$ 处对齐到第 $${st.n}$ 阶导数`, '');
    const err = Math.abs(sumAt(P, st.n, st.xq) - P.f(st.xq));
    cE(inDom && isFinite(err) ? `$|P_{${st.n}}(${fmt(st.xq, 2)})-f(${fmt(st.xq, 2)})|=${fmt(err, 4)}$` : '检验点越过定义域 —— 拖回曲线的领地', inDom ? '' : 'warn');
    let cTxt, cCls;
    if (!inDom) { cTxt = '检验点必须在定义域内'; cCls = 'warn'; }
    else if (st.p === 2 && st.xq > 1.02) { cTxt = `$x_q=${fmt(st.xq, 2)}>1$：越出收敛半径 —— 各项不降反增，再多阶也救不回来（$|x|<1$ 内才贴合）`; cCls = 'warn'; }
    else if (st.p === 2 && st.xq > 0.55) { cTxt = `半径之内但很慢（交错级数）：误差 ${fmt(err, 4)} —— $x_q$ 越贴近 $1$ 越费阶数`; cCls = err < 0.005 ? 'ok' : ''; }
    else if (err < 0.005) { cTxt = `误差 ${fmt(err, 4)}：检验点上已看不出差别 —— 多项式长成了函数（离 $0$ 越远需要的阶数越多）`; cCls = 'ok'; }
    else { cTxt = `误差 ${fmt(err, 4)}：阶数每加一误差骤减 —— 拖大 n 看它缩（离 $0$ 越远收敛越慢）`; cCls = ''; }
    cC(cTxt, cCls);
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    st.xq = Math.max(p.qlo, Math.min(p.qhi, st.xq));
    slQ.setAttribute('min', p.qlo); slQ.setAttribute('max', p.qhi); slQ.sync(st.xq);
    st.n = Math.min(st.n, p.nMax); sl.sync(st.n);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  let autoOn = false, autoBtn = null, fr = 0;
  const tick = () => {
    if (!autoOn) return;
    fr++;
    if (fr % 12 === 0) {
      st.n = Math.min(st.n + 1, PRESETS[st.p].nMax);
      sl.sync(st.n); B.render();
      if (st.n >= PRESETS[st.p].nMax) { autoOn = false; autoBtn.set(false); }
    }
    B.raf(tick);
  };
  autoBtn = B.toggleBtn('⏩ 阶数加一', false, on => { autoOn = on; fr = 0; if (on) B.raf(tick); });
  const sl = B.slider('阶数 n', 0, 6, 1, 3, v => { st.n = Math.round(v); B.render(); });
  const slQ = B.slider('检验点 x', -2.2, 2.2, 0.05, 1, v => { st.xq = v; B.render(); });
  B.toggleBtn('虚线逐项', false, on => { st.ghost = on; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖「阶数」看金多项式一项项长成蓝曲线：0 处每多对齐一阶导数，检验点误差骤减');
  B.render();
  return B;
}
