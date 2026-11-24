/* 图 曲3 常见极坐标曲线（2026-11-24 扩版）——
   左栏：玫瑰线 ρ = a·cos(n(θ−φ))，n 可切 2/3/4/5、φ 可转，ρ>0 蓝、ρ<0 粉（可单隐藏负径）；
         点「▶ 扫掠」让 θ 自动走；图上那枚 θ 把手可以直接拖着转。
   右栏：六档曲线 —— 心形线与圆 / 蚶线 / 双纽线 / 阿基米德螺线 / 对数螺线 / 双曲螺线；
         每档各有比例尺、标题与探针读数，底部状态栏只列当前档。
   坐标：极点在面板中心；左栏 a=1 单位=112 px，右栏比例尺见 MODES[].s。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

const MODES = [
  { k: 'heart', t: '① 心形圆', s: 74, rmax: 2, title: '$\\rho=1+\\cos\\theta$（心形线）与 $\\rho=\\frac12\\cos\\theta$（圆）', rings: [0.5, 1, 1.5] },
  { k: 'lima', t: '② 蚶线', s: 50, rmax: 3, title: '$\\rho=1+2\\cos\\theta$（蚶线，内环由负径画出）', rings: [1, 2, 3] },
  { k: 'lem', t: '③ 双纽线', s: 118, rmax: 1, title: '$\\rho^2=a^2\\cos2\\theta$（双纽线）', rings: [0.5, 1] },
  { k: 'arch', t: '④ 阿基米德', s: 74, rmax: 2, title: '$\\rho=\\theta/2\\pi$（阿基米德螺线，两圈）', rings: [1, 2] },
  { k: 'log', t: '⑤ 对数', s: 47, rmax: 3.1, title: '$\\rho=e^{0.18\\theta}$（对数螺线）', rings: [1, 2, 3] },
  { k: 'hyp', t: '⑥ 双曲', s: 62, rmax: 2.5, title: '$\\rho=0.3/\\theta$（双曲螺线）', rings: [1, 2] },
];

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { deg: 60, phi: 0, n: 2, showNeg: true, mode: 0, labs: true };
  const LC = V(210, 236), RC = V(650, 236);
  const S1 = 112;

  let playing = false;
  let sweepBtn = null;
  let fr = 0;
  // 停扫掠：拖滑块、拖把手、再点一次按钮都走这里——停循环、清掉还挂着的帧、按钮复位
  const stopSweep = () => {
    playing = false;
    B.cancelRaf();
    if (sweepBtn) { sweepBtn.classList.remove('on'); sweepBtn.textContent = '▶ 扫掠'; }
  };
  const startSweep = () => {
    playing = true;
    B.cancelRaf();          // 先清上一轮挂着的帧，反复开关不会叠出两条循环把 θ 越转越快
    sweepBtn.classList.add('on');
    sweepBtn.textContent = '停止扫掠';
    fr = 0;
    advance();              // 点下去立刻走一格，按钮有反应
    B.raf(tick);
  };

  const thSl = B.slider('极角 θ°', 0, 360, 5, st.deg, v => { st.deg = v; stopSweep(); B.render(); }, 'th');
  const phSl = B.slider('旋转 φ°', 0, 90, 5, st.phi, v => { st.phi = v; B.render(); }, 'ph');
  // B.raf 只排一帧，动画循环要自己续帧；隔一帧画一次，免得每帧重排 KaTeX 发滞
  const advance = () => {
    st.deg = (st.deg + 1) % 360;
    thSl.sync(st.deg);
    B.render();
  };
  const tick = () => {
    if (!playing) return;
    if (++fr % 2 === 0) advance();
    B.raf(tick);
  };
  // 扫掠钮紧跟两根滑块，走普通 btn 自管 .on：动画开合不该进 URL，刷新后自己停住
  sweepBtn = B.btn('▶ 扫掠', () => { if (playing) stopSweep(); else startSweep(); });
  const nBtns = [2, 3, 4, 5].map(n => B.btn('n=' + n, () => {
    st.n = n;
    nBtns.forEach((b2, j) => b2.classList.toggle('on', [2, 3, 4, 5][j] === n));
    B.render();
  }, { on: n === 2 }));
  B.toggleBtn('显示负径', true, v => { st.showNeg = v; B.render(); });
  const mBtns = MODES.map((m, i) => B.btn(m.t, () => {
    st.mode = i;
    mBtns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['labs']);

  const P = (c, s, r, t) => V(c.x + s * r * Math.cos(t), c.y - s * r * Math.sin(t));
  const lab = (p, s, col, size, anchor) => {
    if (st.labs) B.textM(p, s, { 'font-size': size || 12, fill: col || '#fff', 'text-anchor': anchor || 'middle' });
  };
  // ext = 半轴长度（单位数）：右栏按各档最大极径给，坐标轴与射线都不会短于曲线
  const grid = (c, s, rings, ext = 1.3) => {
    B.seg(V(c.x - ext * s, c.y), V(c.x + ext * s, c.y), { stroke: 'rgba(147,161,181,.5)', 'stroke-width': 1 });
    B.seg(V(c.x, c.y - ext * s), V(c.x, c.y + ext * s), { stroke: 'rgba(147,161,181,.3)', 'stroke-width': 1 });
    for (const r of rings) mk('circle', { cx: c.x, cy: c.y, r: r * s, fill: 'none', stroke: 'rgba(147,161,181,.24)', 'stroke-width': 1 }, B.dyn);
    for (let k = 0; k < 12; k++) {
      const t = k * Math.PI / 6;
      B.seg(c, V(c.x + ext * 0.97 * s * Math.cos(t), c.y - ext * 0.97 * s * Math.sin(t)),
        { stroke: 'rgba(147,161,181,.13)', 'stroke-width': 1 });
    }
    B.dot(c, 2.6, { fill: '#93a1b5' });
    if (st.labs) B.textM(V(c.x - 9, c.y + 14), '$O$', { 'font-size': 11, fill: '#93a1b5', 'text-anchor': 'end' });
  };

  // 把射线把手挂在左栏外圈；拖动即改 θ
  B.handle({
    get: () => P(LC, S1, 1.3, st.deg * Math.PI / 180),
    set: p => {
      let d = Math.atan2(-(p.y - LC.y), p.x - LC.x) * 180 / Math.PI;
      if (d < 0) d += 360;
      st.deg = Math.round(d / 5) * 5 % 360;
      thSl.sync(st.deg);
      stopSweep();
    },
    color: '#ff9e4a', r: 7, label: 'θ', lo: [10, -10],
  });

  const drawRose = () => {
    const n = st.n, phi = st.phi * Math.PI / 180;
    const posCol = '#5cadff', negCol = '#ff7b8a';
    for (let k = 0; k < 2 * n; k++) {
      const a0 = Math.PI / (2 * n) + k * Math.PI / n;
      const a1 = a0 + Math.PI / n;
      const sign = Math.cos(n * (a0 + Math.PI / (2 * n))) >= 0 ? 1 : -1;
      // n 为奇数时负径只把同一批花瓣重描一遍，不再单独画
      if (sign < 0 && (!st.showNeg || n % 2 === 1)) continue;
      const col = sign > 0 ? posCol : negCol;
      const pts = [];
      for (let i = 0; i <= 36; i++) {
        const u = a0 + (a1 - a0) * i / 36;
        pts.push(P(LC, S1, Math.cos(n * u), u + phi));
      }
      mk('path', {
        d: 'M' + LC.x.toFixed(1) + ' ' + LC.y.toFixed(1) + pts.map(p => 'L' + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('') + 'Z',
        fill: sign > 0 ? 'rgba(92,173,255,.10)' : 'rgba(255,123,138,.10)', stroke: 'none',
      }, B.dyn);
      mk('polyline', { points: pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' '), fill: 'none', stroke: col, 'stroke-width': 2 }, B.dyn);
    }
    // n=2 且不旋转时，保留课本插图上的绿线与两个交点
    if (n === 2 && st.phi === 0) {
      const xv = LC.x + S1 * Math.sqrt(3) / 4;
      B.seg(V(xv, LC.y - 1.18 * S1), V(xv, LC.y + 1.18 * S1), { stroke: '#4ade80', 'stroke-width': 1.6 });
      lab(V(xv + 6, LC.y - 1.02 * S1), '$x=\\frac{\\sqrt3}{4}a$', '#4ade80', 11, 'start');
      [Math.PI / 6, -Math.PI / 6].forEach((t, i) => {
        const p = P(LC, S1, Math.cos(2 * t), t);
        B.dot(p, 4, { fill: '#5cadff' });
        mk('circle', { cx: p.x, cy: p.y, r: 6.5, fill: 'none', stroke: '#ff7b8a', 'stroke-width': 2 }, B.dyn);
        lab(V(p.x + 8, p.y - 8 - i * 2), `$P_{${i + 1}}\\left(\\frac a2,\\ ${i ? '-' : ''}\\frac{\\pi}{6}\\right)$`, '#ff7b8a', 11, 'start');
      });
    }
    // 正径花瓣尖端与负径花瓣尖端各放一枚说明
    lab(V(LC.x + S1 * 1.17 * Math.cos(phi + 0.12), LC.y - S1 * 1.17 * Math.sin(phi + 0.12)), '$r>0$', posCol, 12);
    if (st.showNeg && n % 2 === 0) {
      const tn = phi + Math.PI + Math.PI / n;
      lab(V(LC.x + S1 * 1.1 * Math.cos(tn), LC.y - S1 * 1.1 * Math.sin(tn)), '$r<0$', negCol, 12);
    }
    if (st.labs) B.textM(V(LC.x, 52), `$\\rho=a\\cos${n}(\\theta-\\varphi)$（玫瑰线，${n % 2 ? n + ' 瓣' : 2 * n + ' 瓣'}）`,
      { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' });
  };

  const drawRight = () => {
    const M = MODES[st.mode];
    grid(RC, M.s, M.rings, M.rmax * 1.03);
    if (st.labs) B.textM(V(RC.x, 52), M.title, { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' });
    if (M.k === 'heart') {
      const heart = [];
      for (let i = 0; i <= 120; i++) {
        const t = 2 * Math.PI * i / 120;
        heart.push(P(RC, M.s, 1 + Math.cos(t), t));
      }
      mk('path', { d: 'M' + heart.map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('L') + 'Z', fill: 'rgba(92,173,255,.10)', stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
      const circ = [];
      for (let i = 0; i <= 60; i++) {
        const t = -Math.PI / 2 + Math.PI * i / 60;
        circ.push(P(RC, M.s, 0.5 * Math.cos(t), t));
      }
      mk('path', { d: 'M' + circ.map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('L') + 'Z', fill: 'rgba(103,232,249,.14)', stroke: '#67e8f9', 'stroke-width': 2 }, B.dyn);
      [[2 * Math.PI / 3, 'P_1', 16], [4 * Math.PI / 3, 'P_2', -10]].forEach(([t, nm, dy], i) => {
        const p = P(RC, M.s, 1 + Math.cos(t), t);
        B.dot(p, 4, { fill: '#ff7b8a' });
        const ang = i ? '\\frac{4\\pi}{3}' : '\\frac{2\\pi}{3}';
        lab(V(p.x - 10, p.y + dy), `$${nm}\\left(\\frac12,\\ ${ang}\\right)$`, '#ff7b8a', 11, 'end');
      });
      lab(P(RC, M.s, 1.05, 0.5), '$r>0$', '#5cadff', 12);
      lab(P(RC, M.s, 0.5 * Math.cos(0.6), 0.9), '$r>0$', '#67e8f9', 11);
    } else if (M.k === 'lima') {
      // 蚶线 ρ = 1 + 2cosθ：正径外环、负径内环，按符号分段画
      for (let seg = 0; seg < 2; seg++) {
        const a0 = seg ? 2 * Math.PI / 3 : 4 * Math.PI / 3;
        const a1 = a0 + 2 * Math.PI / 3;
        const sign = seg ? -1 : 1;
        if (sign < 0 && !st.showNeg) continue;
        const pts = [];
        for (let i = 0; i <= 60; i++) {
          const t = a0 + (a1 - a0) * i / 60;
          pts.push(P(RC, M.s, 1 + 2 * Math.cos(t), t));
        }
        const col = sign > 0 ? '#5cadff' : '#ff7b8a';
        mk('path', { d: 'M' + RC.x.toFixed(1) + ' ' + RC.y.toFixed(1) + pts.map(p => 'L' + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('') + 'Z', fill: sign > 0 ? 'rgba(92,173,255,.10)' : 'rgba(255,123,138,.12)', stroke: col, 'stroke-width': 2 }, B.dyn);
      }
      lab(P(RC, M.s, 2.6, 0), '$r>0$', '#5cadff', 12);
      if (st.showNeg) lab(P(RC, M.s, 0.9, Math.PI), '$r<0$', '#ff7b8a', 11);
    } else if (M.k === 'lem') {
      [[-Math.PI / 4, Math.PI / 4], [3 * Math.PI / 4, 5 * Math.PI / 4]].forEach(([b0, b1]) => {
        const pts = [];
        for (let i = 0; i <= 50; i++) {
          const t = b0 + (b1 - b0) * i / 50;
          pts.push(P(RC, M.s, Math.sqrt(Math.max(0, Math.cos(2 * t))), t));
        }
        mk('path', { d: 'M' + RC.x.toFixed(1) + ' ' + RC.y.toFixed(1) + pts.map(p => 'L' + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('') + 'Z', fill: 'rgba(192,132,252,.10)', stroke: '#c084fc', 'stroke-width': 2 }, B.dyn);
      });
      lab(V(RC.x + M.s * 0.55, RC.y - M.s * 0.42), '$r>0$', '#c084fc', 12);
    } else if (M.k === 'arch') {
      const pts = [];
      for (let i = 0; i <= 200; i++) {
        const t = 4 * Math.PI * i / 200;
        pts.push(P(RC, M.s, t / (2 * Math.PI), t));
      }
      mk('polyline', { points: pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2 }, B.dyn);
      lab(P(RC, M.s, 1.5, 2 * Math.PI), '$r>0$', '#ffd166', 11);
    } else if (M.k === 'log') {
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const t = 2 * Math.PI * i / 160;
        pts.push(P(RC, M.s, Math.exp(0.18 * t), t));
      }
      mk('polyline', { points: pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' '), fill: 'none', stroke: '#4ade80', 'stroke-width': 2 }, B.dyn);
      lab(P(RC, M.s, Math.exp(0.18 * Math.PI), Math.PI), '$r=e^{0.18\\theta}$', '#4ade80', 11, 'end');
    } else {
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const t = 0.12 + (2 * Math.PI - 0.12) * i / 160;
        pts.push(P(RC, M.s, 0.3 / t, t));
      }
      mk('polyline', { points: pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' '), fill: 'none', stroke: '#c084fc', 'stroke-width': 2 }, B.dyn);
      lab(P(RC, M.s, 0.3 / 0.6, 0.6), '$\\rho=\\frac{0.3}{\\theta}$', '#c084fc', 11, 'start');
    }
  };

  B.renderFn = () => {
    drawRose();
    drawRight();

    const M = MODES[st.mode];
    const t = st.deg * Math.PI / 180;
    const phi = st.phi * Math.PI / 180;
    // 射线：右栏伸到该档最大极径之外，探针点始终落在这条虚线上
    [[LC, S1, 1.22], [RC, M.s, M.rmax * 1.03]].forEach(([c, s, len]) => {
      B.seg(c, V(c.x + s * len * Math.cos(t), c.y - s * len * Math.sin(t)),
        { stroke: 'rgba(255,158,74,.55)', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
    });
    const r1 = Math.cos(st.n * (t - phi));
    B.dot(P(LC, S1, r1, t), 4.5, { fill: r1 >= 0 ? '#5cadff' : '#ff7b8a' });

    // 右栏读数
    const texts = [];
    let dots = [];
    if (M.k === 'heart') {
      const r2 = 1 + Math.cos(t), r3 = 0.5 * Math.cos(t);
      dots = [{ r: r2, col: '#5cadff', size: 4.5 }, { r: r3, col: '#67e8f9', size: 4 }];
      texts.push({ s: `$\\rho_2=1+\\cos\\theta=${fmt(r2, 2)}$`, c: '#93a1b5' });
      texts.push({ s: `$\\rho_3=\\frac12\\cos\\theta=${fmt(r3, 2)}$`, c: '#67e8f9' });
    } else if (M.k === 'lima') {
      const r2 = 1 + 2 * Math.cos(t);
      dots = [{ r: r2, col: r2 >= 0 ? '#5cadff' : '#ff7b8a', size: 4.5 }];
      texts.push({ s: `$\\rho_2=1+2\\cos\\theta=${fmt(r2, 2)}$`, c: r2 >= 0 ? '#5cadff' : '#ff7b8a' });
      texts.push({ s: r2 < 0 ? '负径：内环' : '正径：外环', c: '#93a1b5' });
    } else if (M.k === 'lem') {
      const c2 = Math.cos(2 * t);
      if (c2 >= 0) {
        const r2 = Math.sqrt(c2);
        dots = [{ r: r2, col: '#c084fc', size: 4.5 }, { r: -r2, col: '#c084fc', size: 4 }];
        texts.push({ s: `$\\rho=\\pm\\sqrt{\\cos2\\theta}=\\pm${fmt(r2, 2)}$`, c: '#c084fc' });
      } else {
        texts.push({ s: '$\\rho$：此处 $\\cos2\\theta<0$，无定义', c: '#93a1b5' });
      }
    } else if (M.k === 'arch') {
      const r2 = t / (2 * Math.PI);
      dots = [{ r: r2, col: '#ffd166', size: 4.5 }];
      texts.push({ s: `$\\rho=\\theta/2\\pi=${fmt(r2, 2)}$`, c: '#ffd166' });
    } else if (M.k === 'log') {
      const r2 = Math.exp(0.18 * t);
      dots = [{ r: r2, col: '#4ade80', size: 4.5 }];
      texts.push({ s: `$\\rho=e^{0.18\\theta}=${fmt(r2, 2)}$`, c: '#4ade80' });
    } else {
      if (t >= 0.12) {
        const r2 = 0.3 / t;
        dots = [{ r: r2, col: '#c084fc', size: 4.5 }];
        texts.push({ s: `$\\rho=0.3/\\theta=${fmt(r2, 2)}$`, c: '#c084fc' });
      } else {
        texts.push({ s: '$\\theta$ 太接近 $0$：$\\rho\\to\\infty$，无有限读数', c: '#93a1b5' });
      }
    }
    dots.forEach(d => B.dot(P(RC, M.s, d.r, t), d.size, { fill: d.col }));

    // 底部状态栏
    mk('rect', { x: 40, y: 452, width: 780, height: 30, rx: 15, fill: 'rgba(147,161,181,.10)', stroke: 'rgba(147,161,181,.22)' }, B.dyn);
    B.textM(V(62, 471), `极角 $\\theta=${st.deg}^\\circ$`, { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
    B.textM(V(232, 471), `玫瑰 $\\rho_1=${fmt(r1, 2)}$`, { 'font-size': 12, fill: r1 >= 0 ? '#5cadff' : '#ff7b8a', 'text-anchor': 'start' });
    let x = 420;
    texts.forEach(tx => {
      B.textM(V(x, 471), tx.s, { 'font-size': 12, fill: tx.c, 'text-anchor': 'start' });
      x += 240;
    });
  };
  B.render();
  B.hintM('左栏换 $n$ 与旋转角看玫瑰家族，点 ▶ 扫掠或拖橙色把手转 $\\theta$；右栏六档曲线各自读极径');
  return B;
}
