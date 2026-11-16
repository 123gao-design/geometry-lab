/* 图 Y4 · 数轴运算机：带开闭端点的区间交、并、补
   上下两条数轴：上轴 A、B 两个区间（a/b/c/d 四个把手可拖、四个开关切端点开闭），
   下轴实时输出 A∩B / A∪B / ∁U A —— 区间代数：交取公共（同点相接、开优先）、
   并取覆盖（两端都开的触点才留断口）、补把端点开闭对调。
   局部坐标约定：u∈[0,860] 向右、v∈[0,430] 向下；px(v)=70+60(v+6)，上轴 v=160、下轴 v=320，
   结果带走下轴下方独立轨道 v=332（不盖轴线），刻度数字在 v=348。端点圆：空心=开、实心=闭。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const px = v => 70 + 60 * (v + 6), inv = x => (x - 70) / 60 - 6;
  const snap = v => Math.round(v * 20) / 20;
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');           // 1.50→1.5、3.00→3
  const pi = p => (p.ol ? '(' : '[') + f1(p.l) + ', ' + f1(p.r) + (p.orr ? ')' : ']');
  const Uu = { l: -6, r: 6, ol: false, orr: false };

  const st = {
    m: 0, auto: false, dir: 1, v: 1.2,
    A: { l: -3.5, r: 1.5, ol: false, orr: true },             // [−3.5, 1.5)
    Bv: { l: 0.5, r: 4, ol: true, orr: false },                // (0.5, 4]
  };

  // ---- 区间代数 ----
  const iCap = (A, Bv) => {
    const l = Math.max(A.l, Bv.l), r = Math.min(A.r, Bv.r);
    const ol = A.l > Bv.l ? A.ol : Bv.l > A.l ? Bv.ol : A.ol || Bv.ol;      // 同点：开优先
    const orr = A.r < Bv.r ? A.orr : Bv.r < A.r ? Bv.orr : A.orr || Bv.orr;
    if (l > r + 1e-9) return [];
    if (Math.abs(l - r) < 1e-9) return ol || orr ? [] : [{ l, r, ol: false, orr: false }];
    return [{ l, r, ol, orr }];
  };
  const iCup = (A, Bv) => {
    const ps = [{ ...A }, { ...Bv }].sort((p, q) => p.l - q.l);
    const out = [ps[0]];
    for (let i = 1; i < ps.length; i++) {
      const cur = out[out.length - 1], nx = ps[i];
      const overlap = nx.l < cur.r - 1e-9;
      const touch = Math.abs(nx.l - cur.r) < 1e-9 && (!nx.ol || !cur.orr);  // 有闭端才并得上
      if (overlap || touch) { if (nx.r > cur.r + 1e-9) { cur.r = nx.r; cur.orr = nx.orr; } }
      else out.push(nx);
    }
    return out;
  };
  const iComp = A => {
    const ps = [];
    if (A.l > Uu.l + 1e-9) ps.push({ l: Uu.l, r: A.l, ol: false, orr: !A.ol });  // 端点开闭对调
    if (A.r < Uu.r - 1e-9) ps.push({ l: A.r, r: Uu.r, ol: !A.orr, orr: false });
    return ps;
  };
  const contains = (p, v) =>
    (v > p.l + 1e-9 || Math.abs(v - p.l) < 1e-9 && !p.ol) &&
    (v < p.r - 1e-9 || Math.abs(v - p.r) < 1e-9 && !p.orr);

  const MODES = [
    { t: '$A\\cap B$', run: () => iCap(st.A, st.Bv) },
    { t: '$A\\cup B$', run: () => iCup(st.A, st.Bv) },
    { t: '$\\complement_U A$', run: () => iComp(st.A) },
  ];

  const cA = B.chipM('A'), cB = B.chipM('B'), cR = B.chipM('结果'), cV = B.chipM('判读'), cPr = B.chipM('探针');

  B.renderFn = () => {
    const M = MODES[st.m], pieces = M.run();
    // 端点圆：开=空心（只描边不填充）、闭=实心（彩色填充）
    const END = (open, col) => open ? { fill: 'none', stroke: col, 'stroke-width': 2.2 } : { fill: col };
    // 两条数轴
    for (const [ay, num] of [[160, false], [320, true]]) {
      B.seg(V(px(-6.4), ay), V(px(6.4) + 12, ay), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
      mk('polygon', { points: `${px(6.4) + 20},${ay} ${px(6.4) + 10},${ay - 4.5} ${px(6.4) + 10},${ay + 4.5}`, fill: '#8fa3bd' }, B.dyn);
      for (let t = -6; t <= 6; t++) {
        B.seg(V(px(t), ay), V(px(t), ay - 7), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
        if (num) B.text(V(px(t), ay + 28), String(t), { 'font-size': 11, fill: '#5c6a80' });
      }
    }
    B.tex(V(790, 118), '$U=[-6,\\ 6]$', { size: 14, anchor: 'end' });
    // 上轴：A、B 区间带（闭端实心、开端空心）
    B.tex(V(62, 154), '$A$', { size: 15, anchor: 'end', color: '#5cadff' });
    B.tex(V(62, 176), '$B$', { size: 15, anchor: 'end', color: '#ff9e4a' });
    for (const [iv, col, y] of [[st.A, '#5cadff', 154], [st.Bv, '#ff9e4a', 176]]) {
      mk('rect', { x: px(iv.l), y: y - 6, width: Math.max(0, px(iv.r) - px(iv.l)), height: 12, fill: col, 'fill-opacity': .4 }, B.dyn);
      B.dot(V(px(iv.l), y), 6.5, END(iv.ol, col));
      B.dot(V(px(iv.r), y), 6.5, END(iv.orr, col));
    }
    // 下轴：结果带走轴下方独立轨道 v=326..338，不盖轴线也不碰刻度数字
    B.tex(V(62, 332), M.t, { size: 15, anchor: 'end', color: '#4ade80' });
    if (!pieces.length) B.tex(V(px(0), 332), '$\\varnothing$', { size: 15, anchor: 'mid' });
    for (const p of pieces) {
      mk('rect', { x: px(p.l), y: 326, width: Math.max(0, px(p.r) - px(p.l)), height: 12, fill: '#4ade80', 'fill-opacity': .5 }, B.dyn);
      B.dot(V(px(p.l), 332), 6.5, END(p.ol, '#4ade80'));
      B.dot(V(px(p.r), 332), 6.5, END(p.orr, '#4ade80'));
    }
    // 探针（下轴）：竖直参考线贯通轴线即可，不越过结果轨道
    B.seg(V(px(st.v), 132), V(px(st.v), 320), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
    B.tex(V(px(st.v), 396), '$x=' + fmt(st.v, 2) + '$', { size: 14, anchor: 'mid', color: '#ffd166' });
    // 徽章
    cA('$A=' + pi(st.A) + '$', '');
    cB('$B=' + pi(st.Bv) + '$', '');
    const txt = pieces.length ? pieces.map(pi).join('\\cup') : '\\varnothing';
    cR(M.t.slice(0, -1) + '=' + txt + '$', pieces.length ? 'ok' : 'warn');
    if (st.m === 0) cV(pieces.length ? '交取公共：两端各取靠内端、同点相接、开优先 —— 口只会更严' : '无公共元素 → ∅：交集可以为空', pieces.length ? 'ok' : 'warn');
    else if (st.m === 1) cV(pieces.length > 1 ? '并取覆盖：这两段没并上 —— 两端都开的触点才留断口' : '并取覆盖：重叠（或闭端相触）就连成一段', pieces.length > 1 ? 'warn' : 'ok');
    else cV('补 = 在 U 里挖去 A：剩余各段端点开闭对调（闭变开、开变闭）', 'ok');
    const inside = pieces.some(p => contains(p, st.v));
    cPr('$x=' + fmt(st.v, 2) + '$：' + (inside ? '∈ 结果 ✓' : '∉ 结果 ✗'), inside ? 'ok' : '');
  };

  const btns = MODES.map((M, i) => B.btnM(M.t, () => {
    st.m = i; btns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));

  // 四个端点开关：a 端 = A 左端，其余类推（开/闭互换）
  const mkTog = (lab, obj, key) => {
    const b = B.btn(lab + (obj[key] ? ' 开' : ' 闭'), () => {
      obj[key] = !obj[key];
      b.textContent = lab + (obj[key] ? ' 开' : ' 闭');
      b.classList.toggle('on', !obj[key]);
      B.render();
    }, { on: !obj[key] });
  };
  mkTog('a 端', st.A, 'ol');
  mkTog('b 端', st.A, 'orr');
  mkTog('c 端', st.Bv, 'ol');
  mkTog('d 端', st.Bv, 'orr');

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

  // 把手：a b c d（上轴，越界互锁）+ 探针（下轴）
  const eH = (obj, key, y, lab) => B.handle({
    get: () => V(px(obj[key]), y), color: '#ffd166', label: lab, thin: true,
    set: p => {
      const v = snap(Math.max(-6, Math.min(6, inv(p.x))));
      if (key === 'l') obj.l = Math.min(v, obj.r - .1); else obj.r = Math.max(v, obj.l + .1);
    },
    clamp: p => V(Math.max(px(-6), Math.min(px(6), p.x)), y),
  });
  eH(st.A, 'l', 154, 'a'); eH(st.A, 'r', 154, 'b');
  eH(st.Bv, 'l', 176, 'c'); eH(st.Bv, 'r', 176, 'd');
  B.handle({
    get: () => V(px(st.v), 320), color: '#ffd166', label: 'x',
    set: p => { st.v = snap(Math.max(-6, Math.min(6, inv(p.x)))); },
    clamp: p => V(Math.max(px(-6), Math.min(px(6), p.x)), 320),
  });

  B.hint('拖 a、b、c、d 四个把手再切端点开闭：下轴实时重算 —— 交取公共、并取覆盖、补挖两端，断口只在两端都开时留下');
  B.render();
  return B;
}
