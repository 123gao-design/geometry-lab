/* 图 性1 · 保序变形机：不等式的性质 —— 变形后方向是否保持
   给 a、b 两数与实数 c，考察「同加 / 同减 / 同乘 / 同除」四种变形：
   同加减任意实数方向不变（两点整体平移，次序保持）；同乘除时 c 的符号起决定作用：
   c>0 保序、c=0 两边归零（不等号退化为等号）、c<0 方向反转（两点按比例缩放、穿过原点而互换）。
   局部坐标约定：u∈[0,860] 向右、v∈[0,340] 向下；px(v)=70+40(v+10)，数轴 v=206。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 340;
  const B = new Board(root, W, H);
  const px = v => 70 + 40 * (v + 10);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const MODES = [
    { key: 'add', name: '同加 c', op: (x, c) => x + c,
      prop: '可加性：$a>b\\ \\Rightarrow\\ a+c>b+c$ —— 平移把两点一起搬动，次序保持' },
    { key: 'sub', name: '同减 c', op: (x, c) => x - c,
      prop: '减去 c 即加上 $-c$，仍属可加性 —— 次序保持' },
    { key: 'mul', name: '同乘 c', op: (x, c) => x * c,
      prop: '可乘性：$c>0$ 保序、$c<0$ 反向 —— 符号起决定作用' },
    { key: 'div', name: '同除 c', op: (x, c) => x / c,
      prop: '除以 c 即乘 $1/c$ —— $c<0$ 反向、$c=0$ 无定义' },
  ];
  const st = { i: 2, a: 2, b: -1, c: 1, auto: false, dir: 1 };
  const rel = (u, v) => (Math.abs(u - v) < 1e-9 ? '=' : u > v ? '>' : '<');
  const cR = B.chipM('原关系'), cO = B.chipM('变形后'), cJ = B.chipM('判定'), cP = B.chipM('性质');

  B.renderFn = () => {
    const M = MODES[st.i];
    const div0 = M.key === 'div' && Math.abs(st.c) < 1e-9;
    const a2 = div0 ? null : M.op(st.a, st.c), b2 = div0 ? null : M.op(st.b, st.c);
    B.tex(V(430, 44), `$a=${f1(st.a)},\\quad b=${f1(st.b)},\\quad c=${f1(st.c)}$`, { size: 16, anchor: 'mid' });
    B.textM(V(430, 74), `变形：两边${M.name} —— 看 $a'$ 与 $b'$ 的左右次序`, { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 数轴
    B.seg(V(px(-10), 206), V(px(10) + 12, 206), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `${px(10) + 21},206 ${px(10) + 11},201.5 ${px(10) + 11},210.5`, fill: '#8fa3bd' }, B.dyn);
    for (let t = -10; t <= 10; t += 2) {
      B.seg(V(px(t), 206), V(px(t), 199), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
      B.text(V(px(t), 226), String(t), { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
    }
    const dot = (v, col, lab, dy) => {
      if (Math.abs(v) > 10) return;
      B.dot(V(px(v), 206), 6, { fill: col });
      B.tex(V(px(v), 206 + dy), lab, { size: 12.5, anchor: 'mid', color: col });
    };
    dot(st.a, '#ffd166', '$a$', -24); dot(st.b, '#5cadff', '$b$', 42);
    if (a2 !== null) {
      if (Math.abs(a2) <= 10 && Math.abs(st.a) <= 10 && Math.abs(a2 - st.a) > .04)
        B.seg(V(px(st.a), 194), V(px(a2), 194), { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      if (Math.abs(b2) <= 10 && Math.abs(st.b) <= 10 && Math.abs(b2 - st.b) > .04)
        B.seg(V(px(st.b), 218), V(px(b2), 218), { stroke: '#ff7b8a', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      dot(a2, '#ff9e4a', `$a'$`, -44); dot(b2, '#ff7b8a', `$b'$`, 62);
    }
    // 徽章
    const r0 = rel(st.a, st.b);
    cR(`$a=${f1(st.a)},\\ b=${f1(st.b)}$ —— ${r0 === '=' ? 'a = b（拖滑块使两数不等）' : `a ${r0} b`}`);
    if (div0) cO('除以 0：变形无定义', 'warn');
    else {
      const r2 = rel(a2, b2);
      cO(`$a'=${f1(a2)},\\ b'=${f1(b2)}$ —— ${r2 === '=' ? 'a′ = b′（不等号变等号）' : `a′ ${r2} b′`}`);
    }
    if (div0) cJ('除数为 0，变形本身不成立 —— 任何时候都须排除', 'warn');
    else if (M.key === 'add' || M.key === 'sub') cJ('方向保持 —— 两点整体平移，间距不变', 'ok');
    else if (Math.abs(st.c) < 1e-9) cJ('c = 0：两边同变为 0 —— 不等号退化为等号，原不等式的信息失去', 'warn');
    else if (st.c > 0) cJ(`同乘（除）正数 c=${f1(st.c)}：方向保持`, 'ok');
    else cJ(`同乘（除）负数 c=${f1(st.c)}：方向反转 —— a′ 与 b′ 交换了左右位置`, 'warn');
    cP(M.prop);
  };

  B.slider('a =', -4, 4, .1, 2, v => { st.a = v; B.render(); });
  B.slider('b =', -4, 4, .1, -1, v => { st.b = v; B.render(); });
  const sC = B.slider('c =', -3, 3, .1, 1, v => { st.c = v; B.render(); });
  const modeBtns = MODES.map((M, i) => B.btnM(M.name, () => {
    st.i = i; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 2 }));
  const scanBtn = B.btn('⏩ c 扫过零', () => {
    st.auto = !st.auto; scanBtn.classList.toggle('on', st.auto);
    const step = () => {
      if (!st.auto) return;
      st.c = Math.round((st.c + st.dir * .05) * 100) / 100;
      if (st.c >= 3) { st.c = 3; st.dir = -1; }
      if (st.c <= -3) { st.c = -3; st.dir = 1; }
      sC.sync(st.c); B.render(); B.raf(step);
    };
    if (st.auto) B.raf(step);
  });

  B.hint('选变形、拖 c 穿过零：同加减方向不变，同乘负数 a′ 与 b′ 交换左右');
  B.render();
  return B;
}
