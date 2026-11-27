/* 图 Z2 余弦定理投影分解机：c² = a² + b² − 2ab·cosγ 的几何直译 ——
   把角 γ 顶点 C 摆在原点、b 沿 +x、a 仰角 γ，则对边 AB 恰是直角三角形的斜边：
   水平分量 |b−a·cosγ|、竖直分量 a·sinγ，勾股一勾即得 c²；展开合并后 −2ab·cosγ 就是「修正项」——
   锐角负修正（c²<a²+b²）、直角零修正（勾股）、钝角正修正（c²>a²+b²）。
   左栏版式：基准线做成带刻度与箭头的量轴；投影 a·cosγ 走一条紫色有向尺寸线（钝角时箭头掉头），
   水平直角边 |b−a·cosγ| 走绿色端标尺寸线，高 a·sinγ 走橙色虚线；三项读数沉到底部一行色标。
   右栏沿推导顺序对照两根横条、反求夹角，最后核对实测结果。 */
import { LegendProofBoard } from '../proof-board.js';
import { hEl, mk, texMix, V, fmt } from '../../../lib/board.js';
import '../unit/angle-readings.css';
import './theorem-frames.css';
import frameCSS from './theorem-frames.css?inline';
import './coslaw.css';
import panelCSS from './coslaw.css?inline';
import infoCSS from '../../info-readings.css?inline';

export function createBoard(root) {
  const B = new LegendProofBoard(root, 512, 352, 64);
  root.classList.add('trig-side-board', 'trig-theorem-board', 'cos-law-board');
  B.proof = hEl('section', { class: 'trig-theorem-panel cos-law-panel', 'aria-label': '投影分解与修正项' });
  root.insertBefore(B.proof, B.chipRow);
  B.exportCheckHeight = 130;
  B.exportSize = { width: 854, height: B.h + B.exportCheckHeight };
  B.proofCSS = infoCSS + frameCSS + panelCSS;
  B.groupReadings('公式与数值');
  const st = { a: 4, b: 5, deg: 60, proj: true, labs: true };
  const cFix = B.readout('修正项', 'violet'), cInv = B.readout('反演 $\\gamma$', 'gold');
  const verdict = B.chipM('判读');
  const title = hEl('h4', {}, B.proof);
  title.textContent = '投影分解与修正项';
  const formula = (parent, className, tex) => {
    const el = hEl('div', { class: className }, parent);
    el.innerHTML = texMix(tex);
    return el;
  };
  formula(B.proof, 'cos-law-expansion', '$c^2=(b-a\\cos\\gamma)^2+(a\\sin\\gamma)^2$');
  formula(B.proof, 'cos-law-result', '$c^2=a^2+b^2-2ab\\cos\\gamma$');

  const comparison = hEl('div', { class: 'cos-law-comparison' }, B.proof);
  function comparisonBar(label, tone) {
    const row = hEl('div', { class: 'cos-law-bar' }, comparison);
    row.style.setProperty('--bar-color', 'var(--pj-' + tone + ')');
    const heading = formula(row, 'cos-law-bar-label', label);
    const value = hEl('span', {}, heading);
    const track = hEl('div', { class: 'cos-law-track' }, row);
    const bar = hEl('i', {}, track);
    return (n, width) => {
      value.innerHTML = texMix('$' + fmt(n, 2) + '$');
      bar.style.width = width + '%';
    };
  }
  const sumBar = comparisonBar('$a^2+b^2$', 'blue');
  const oppositeBar = comparisonBar('$c^2$', 'gold');
  const bracket = hEl('div', { class: 'cos-law-bracket' }, comparison);
  const gapLabel = hEl('div', { class: 'cos-law-gap' }, comparison);
  const angle = hEl('div', { class: 'cos-law-angle' }, B.proof);
  const states = hEl('div', { class: 'cos-law-states' }, B.proof);
  const types = ['锐角', '直角', '钝角'].map((name, i) => {
    const item = hEl('div', {}, states);
    hEl('span', {}, item).textContent = name;
    hEl('small', {}, item).textContent = ['负修正', '零修正', '正修正'][i];
    return item;
  });
  const check = hEl('div', { class: 'fn-reading-group', 'data-reading-style': 'info' }, B.proof);
  const measured = B.chipM('$c^2$ 实测');
  check.appendChild(measured.el);
  const aSl = B.slider('边 a', 2, 7, 0.05, st.a, v => { st.a = v; B.render(); }, 'a', n => `边 $a=${n}$`);
  const bSl = B.slider('边 b', 2, 7, 0.05, st.b, v => { st.b = v; B.render(); }, 'b', n => `边 $b=${n}$`);
  const gSl = B.slider('夹角 γ°', 20, 160, 5, st.deg, v => { st.deg = v; B.render(); }, 'g', n => `夹角 $\\gamma=${n}^\\circ$`);
  const examples = [
    { name: '勾股', formula: '$\\gamma=90^\\circ$', deg: 90 },
    { name: '锐角', formula: '$\\gamma=60^\\circ$', deg: 60 },
    { name: '钝角', formula: '$\\gamma=120^\\circ$', deg: 120 },
  ];
  B.choiceRow('选择例题', examples, () => examples.findIndex(e => st.a === 4 && st.b === 5 && st.deg === e.deg), i => {
    st.a = 4; st.b = 5; st.deg = examples[i].deg;
    aSl.sync(st.a); bSl.sync(st.b); gSl.sync(st.deg); B.render();
  });
  B.toggleBtn('投影分解', true, v => { st.proj = v; B.render(); });
  B.graphToggles(st, ['labs']);

  const angArc = (p, r, a0, a1, at) => {
    const n = 26, pts = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + (a1 - a0) * i / n;
      pts.push(`${(p.x + r * Math.cos(t)).toFixed(1)},${(p.y - r * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  // 板内字号由设置页的全局倍率统一钉住（global.css 的 svg text 读 --bd-fs），单条 B.text 再写 font-size 不生效；
  // 所以按两条路排：顶点字母走 B.tex 显式 14px（p 换算成垂直中心），量与注释走 B.textM（p 仍按基线给）。
  const vlab = (p, s) => {
    if (st.labs) B.tex(V(p.x, p.y - 14 * 0.4), `$${s}$`, { size: 14, color: B.diagramColors.ink, anchor: 'mid', w: 48 });
  };
  const lab = (p, s, col) => {
    if (st.labs) B.textM(p, s, { 'font-size': 12, fill: col || B.diagramColors.ink, 'text-anchor': 'middle' });
  };
  // 线段外法向：取背离重心的一侧，推 d 像素
  const outOf = (P, Q, away, d) => {
    let nx = -(Q.y - P.y), ny = Q.x - P.x;
    const nl = Math.hypot(nx, ny) || 1;
    nx /= nl; ny /= nl;
    const mx = (P.x + Q.x) / 2, my = (P.y + Q.y) / 2;
    if (nx * (mx - away.x) + ny * (my - away.y) < 0) { nx = -nx; ny = -ny; }
    return V(mx + nx * d, my + ny * d);
  };

  B.renderFn = () => {
    const a = st.a, b = st.b, g = st.deg * Math.PI / 180;
    const cs = Math.cos(g), sn = Math.sin(g);
    const A = V(b, 0), Bm = V(a * cs, a * sn);
    // 同一组边长随夹角变化时保持比例尺；量轴下留出两道尺寸线的空间。
    const S = Math.min((B.w - 86) / (a + b), (B.plotRect[3] - 120) / a);
    const originX = (B.w - S * (Math.min(0, Bm.x) + Math.max(b, Bm.x))) / 2;
    const X = x => originX + S * x;
    const Y = y => B.plotRect[3] - 84 - S * y;
    const Cp = V(X(0), Y(0)), Ap = V(X(A.x), Y(0)), Bp = V(X(Bm.x), Y(Bm.y)), Dp = V(X(Bm.x), Y(0));
    const c = Math.hypot(b - a * cs, a * sn);
    const a2b2 = a * a + b * b, c2 = c * c, fix = a2b2 - c2;   // fix = 2ab·cosγ；修正项 −2ab·cosγ 是它的反号
    const ct = V((Cp.x + Ap.x + Bp.x) / 3, (Cp.y + Ap.y + Bp.y) / 3);
    const y0 = Y(0), l1 = y0 + 30, l2 = y0 + 54;              // 基准线与两条尺寸线的 y

    /* —— 左栏：底边量轴 —— */
    const axisEnd = B.w - 16;
    B.seg(V(16, y0), V(axisEnd, y0), { stroke: 'rgba(147,161,181,.45)', 'stroke-width': 1 });
    for (let k = Math.ceil((16 - originX) / S); X(k) < axisEnd; k++) {
      if (!k) continue;
      B.seg(V(X(k), y0), V(X(k), y0 + (k % 2 ? 3.5 : 5.5)), { stroke: 'rgba(147,161,181,.33)', 'stroke-width': 1 });
    }
    mk('polygon', {
      points: `${axisEnd},${y0} ${axisEnd - 9},${y0 - 3.2} ${axisEnd - 9},${y0 + 3.2}`,
      fill: 'rgba(147,161,181,.55)', stroke: 'none',
    }, B.dyn);

    /* —— 左栏：两块淡色面（整三角形 + 勾股用的直角三角形） —— */
    mk('polygon', { points: `${Cp.x},${Cp.y} ${Ap.x},${Ap.y} ${Bp.x},${Bp.y}`, fill: 'rgba(92,173,255,.05)', stroke: 'none' }, B.dyn);
    if (st.proj) {
      mk('polygon', { points: `${Dp.x},${Dp.y} ${Bp.x},${Bp.y} ${Ap.x},${Ap.y}`, fill: 'rgba(74,222,128,.06)', stroke: 'none' }, B.dyn);
    }

    /* —— 左栏：三条边（斜边压一层柔光） —— */
    B.seg(Cp, Ap, { stroke: '#5cadff', 'stroke-width': 2.6 });
    B.seg(Cp, Bp, { stroke: '#67e8f9', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
    B.seg(Ap, Bp, { stroke: 'rgba(255,209,102,.16)', 'stroke-width': 10, 'stroke-linecap': 'round' });
    B.seg(Ap, Bp, { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-linecap': 'round' });

    /* —— 左栏：角弧与 γ（标签落在顶点下侧，外侧留给尺寸线） —— */
    angArc(Cp, 34, 0, g, { stroke: '#67e8f9', 'stroke-width': 1.4 });
    lab(V(Cp.x + 30, Cp.y + 18), '$\\gamma$', '#67e8f9');

    /* —— 左栏：投影分解的尺寸线 —— */
    if (st.proj) {
      const faint = { stroke: 'rgba(147,161,181,.42)', 'stroke-width': 1, 'stroke-dasharray': '2 3' };
      B.seg(V(Cp.x, y0 + 7), V(Cp.x, l1 + 4), faint);
      B.seg(V(Dp.x, y0 + 7), V(Dp.x, l2 + 5), faint);
      B.seg(V(Ap.x, y0 + 7), V(Ap.x, l2 + 5), faint);
      // 紫：有向投影 C→D；钝角时箭头朝左，正是「掉头」
      const dx = Dp.x - Cp.x;
      if (Math.abs(dx) > 8) {
        if (Math.abs(dx) > 30) B.arrow(V(Cp.x, l1), V(Dp.x, l1), { stroke: '#c084fc', 'stroke-width': 2, head: 9, wide: 4.5 });
        else {
          B.seg(V(Cp.x, l1), V(Dp.x, l1), { stroke: '#c084fc', 'stroke-width': 2 });
          B.dot(V(Dp.x, l1), 2.6, { fill: '#c084fc' });
        }
      }
      // 绿：水平直角边 D→A，两端带端标
      B.seg(V(Dp.x, l2), V(Ap.x, l2), { stroke: '#4ade80', 'stroke-width': 1.8 });
      B.seg(V(Dp.x, l2 - 5), V(Dp.x, l2 + 5), { stroke: '#4ade80', 'stroke-width': 1.8 });
      B.seg(V(Ap.x, l2 - 5), V(Ap.x, l2 + 5), { stroke: '#4ade80', 'stroke-width': 1.8 });
      // 橙：高 a·sinγ 与垂足直角记号
      B.seg(Dp, Bp, { stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
      const ux = Ap.x >= Dp.x ? 1 : -1, mm = 9;
      mk('polyline', {
        points: `${Dp.x + ux * mm},${Dp.y} ${Dp.x + ux * mm},${Dp.y - mm} ${Dp.x},${Dp.y - mm}`,
        fill: 'none', stroke: 'rgba(147,161,181,.75)', 'stroke-width': 1.2,
      }, B.dyn);
    }

    /* —— 左栏：顶点、垂足与边标（b 走三角形内侧，a / c 沿外法向） —— */
    B.mark(Cp, '#93a1b5');
    B.mark(Ap, '#93a1b5');
    B.mark(Bp, '#ffd166');
    if (st.proj) B.mark(Dp, '#ff9e4a');
    vlab(V(Ap.x + 14, Ap.y + 16), 'A');
    vlab(V(Cp.x - 13, Cp.y + 16), 'C');
    vlab(V(Bp.x, Bp.y - 14), 'B');
    lab(V((Cp.x + Ap.x) / 2, Cp.y - 12), '$b$', '#5cadff');
    lab(outOf(Cp, Bp, ct, 16), '$a$', '#67e8f9');
    lab(outOf(Ap, Bp, ct, 16), `$c=${fmt(c, 2)}$`, '#ffd166');

    if (st.proj) {
      B.note(`$a\\cos\\gamma=${fmt(a * cs, 2)}$`, '#c084fc');
      B.note(`$a\\sin\\gamma=${fmt(a * sn, 2)}$`, '#ff9e4a', 'dashed');
      B.note(`$|b-a\\cos\\gamma|=${fmt(Math.abs(b - a * cs), 2)}$`, '#4ade80');
    } else B.note('对边 $c=AB$', '#ffd166');

    const scale = 100 / (Math.max(a2b2, c2) * 1.08);
    sumBar(a2b2, a2b2 * scale);
    oppositeBar(c2, c2 * scale);
    const rightAngle = Math.abs(cs) < 1e-9;
    bracket.style.marginLeft = Math.min(a2b2, c2) * scale + '%';
    bracket.style.width = Math.abs(fix) * scale + '%';
    bracket.style.visibility = rightAngle ? 'hidden' : 'visible';
    gapLabel.innerHTML = rightAngle ? '零修正：两条一样长' : texMix('缺口 $|2ab\\cos\\gamma|=' + fmt(Math.abs(fix), 2) + '$');
    const inv = Math.acos(Math.max(-1, Math.min(1, (a2b2 - c2) / (2 * a * b)))) * 180 / Math.PI;
    angle.innerHTML = texMix('$\\gamma=\\arccos\\frac{a^2+b^2-c^2}{2ab}=' + fmt(inv, 1) + '^\\circ$');
    const active = rightAngle ? 1 : cs > 0 ? 0 : 2;
    types.forEach((item, i) => item.toggleAttribute('data-current', i === active));
    measured('$' + fmt(c2, 2) + '$，公式值 $' + fmt(a2b2 - 2 * a * b * cs, 2) + '$');

    /* —— 徽章 —— */
    const cor = -fix;                                   // 修正项 −2ab·cosγ
    cFix(`$-2ab\\cos\\gamma\\approx ${fmt(cor, 2)}$`);
    cInv(`$\\gamma\\approx ${fmt(inv, 1)}^\\circ$`);
    verdict(Math.abs(cs) < 1e-9 ? '直角时修正项为零，$c^2=a^2+b^2$。'
      : cor < 0 ? '锐角时修正项为负，$c^2<a^2+b^2$。' : '钝角时修正项为正，$c^2>a^2+b^2$。');
  };
  B.render();
  B.hintM('拖 $\\gamma$ 从锐到钝：紫箭头掉头，两条直角边一长一短；右栏两根横条的缺口即修正项');
  return B;
}
