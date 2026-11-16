import { Board, V, mk } from '../../../lib/board.js';

/* L 系统：把初始串按规则反复替换，再把结果当指令交给「龟」走一遍。
   F 前进并画线，+ 左转，- 右转，[ 存下当前位置与朝向，] 取回 —— 方括号让枝条能分叉后各走各的。 */
const PRESETS = [
  { name: '雪花曲线', axiom: 'F--F--F', rules: { F: 'F+F--F+F' }, ang: 60 },
  { name: '分形草', axiom: 'F', rules: { F: 'F[+F]F[-F]F' }, ang: 25 },
  { name: '二叉分枝', axiom: 'X', rules: { X: 'F[+X]F[-X]+X', F: 'FF' }, ang: 20 },
];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { kind: 1, n: 3 };
  const cN = B.chipM('层数 $n$');
  const cP = B.chipM('线段数');
  const cA = B.chipM('转角');

  function rewrite(n) {
    const pr = PRESETS[st.kind];
    let s = pr.axiom;
    for (let l = 0; l < n; l++) {
      let t = '';
      for (const ch of s) t += pr.rules[ch] ?? ch;
      s = t;
    }
    return s;
  }
  function turtle(s, angDeg) {
    const segs = [];
    let x = 0, y = 0, a = Math.PI / 2;
    const stack = [];
    const da = angDeg * Math.PI / 180;
    for (const ch of s) {
      if (ch === 'F') {
        const nx = x + Math.cos(a), ny = y + Math.sin(a);
        segs.push([V(x, y), V(nx, ny)]);
        x = nx; y = ny;
      } else if (ch === 'f') {
        x += Math.cos(a); y += Math.sin(a);
      } else if (ch === '+') a += da;
      else if (ch === '-') a -= da;
      else if (ch === '[') stack.push([x, y, a]);
      else if (ch === ']') { const p = stack.pop(); if (p) { x = p[0]; y = p[1]; a = p[2]; } }
    }
    return segs;
  }

  B.renderFn = () => {
    const pr = PRESETS[st.kind];
    const segs = turtle(rewrite(st.n), pr.ang);
    let xm = Infinity, xM = -Infinity, ym = Infinity, yM = -Infinity;
    for (const [a, b] of segs) {
      xm = Math.min(xm, a.x, b.x); xM = Math.max(xM, a.x, b.x);
      ym = Math.min(ym, a.y, b.y); yM = Math.max(yM, a.y, b.y);
    }
    if (!segs.length) { xm = 0; xM = 1; ym = 0; yM = 1; }
    const m = B.isoFit(xm, xM, ym, yM, [170, 58, 480, 330], 14);
    B.tex(V(410, 30), pr.name, { size: 17, anchor: 'mid', w: 260 });
    const sw = segs.length > 2000 ? .5 : segs.length > 500 ? .8 : 1.3;
    for (const [a, b] of segs) {
      B.seg(V(m.px(a.x), m.py(a.y)), V(m.px(b.x), m.py(b.y)),
        { stroke: st.kind === 2 ? '#4ade80' : '#5cadff', 'stroke-width': sw, 'stroke-linecap': 'round' });
    }
    B.text(V(410, 414), '同一条规则替换五次，枝条就长成了树冠', { 'font-size': 12, fill: '#8fa3bd' });
    cN(`${st.n}`);
    cP(`${segs.length}`);
    cA(`$${pr.ang}^\\circ$`);
  };

  B.btn('雪花曲线', () => { st.kind = 0; st.n = 3; nS.sync(3); B.render(); });
  B.btn('分形草', () => { st.kind = 1; st.n = 3; nS.sync(3); B.render(); });
  B.btn('二叉分枝', () => { st.kind = 2; st.n = 3; nS.sync(3); B.render(); });
  const nS = B.slider('层数 n', 0, 5, 1, st.n, v => { st.n = v; B.render(); });
  B.hintM('一串字符长成植物 —— 重写规则就是它的基因');
  B.render();
  return B;
}
