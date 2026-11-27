import { V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { axisProbe, axisX, bands, frame, label, logicDiagram, probeHandle } from '../../../lib/logic-diagram.js';

const presets = [
  { p: 'x>2', q: 'x>1', testA: x => x > 2, testB: x => x > 1, a: [2], b: [1], ab: true, ba: false, relation: '充分不必要' },
  { p: 'x>1', q: 'x>2', testA: x => x > 1, testB: x => x > 2, a: [1], b: [2], ab: false, ba: true, relation: '必要不充分' },
  { p: '|x|>1', q: 'x^2>1', testA: x => Math.abs(x) > 1, testB: x => x * x > 1, a: [-1, 1], b: [-1, 1], ab: true, ba: true, relation: '充要' },
  { p: 'x>0', q: '|x|>1', testA: x => x > 0, testB: x => Math.abs(x) > 1, a: [0], b: [-1, 1], ab: false, ba: false, relation: '既不充分也不必要' },
];

export function createBoard(root) {
  const B = logicDiagram(root, 'condi-board', 234, '充分与必要：比较同一数轴上的两个真值集');
  const state = { i: 0, v: 2.5 };
  const forward = B.chipM('正向'), reverse = B.chipM('反向'), result = B.chipM('条件'), probe = B.chipM('探针');
  B.renderFn = () => {
    const ink = B.diagramColors;
    const P = presets[state.i], v = state.v;
    frame(B);
    label(B, 260, 34, `$p:\\ ${P.p}\\qquad q:\\ ${P.q}$`, 18);
    const rows = [[81, 'A', P.a, P.testA, ink.blue], [123, 'B', P.b, P.testB, ink.orange]];
    for (const [y, name, cuts, test, color] of rows) {
      label(B, 35, y, `$${name}$`, 16, color);
      bands(B, y, cuts, x => test(x) && color);
      // 箭头区分伸向无穷的区间和标为空心的有限端点。
      for (const dir of [-1, 1]) {
        if (!test(dir * 6)) continue;
        const tip = axisX(dir * 6) + dir * 5;
        B.seg(V(tip - dir * 7, y - 4), V(tip, y), { stroke: color, 'stroke-width': 1.5 });
        B.seg(V(tip - dir * 7, y + 4), V(tip, y), { stroke: color, 'stroke-width': 1.5 });
      }
    }
    axisProbe(B, v, 168, 62);
    for (const [y, , cuts, test, color] of rows) {
      if (test(v)) glowDot(B, V(axisX(v), y), color, 7, 3);
      for (const x of cuts) B.dot(V(axisX(x), y), 4.5, { stroke: color, fill: ink.paper, 'stroke-width': 1.7 });
    }
    const inA = P.testA(v), inB = P.testB(v);
    forward(P.ab ? '$A\\subseteq B$，$p\\Rightarrow q$ 成立' : '$A\\nsubseteq B$，$p\\Rightarrow q$ 不成立', P.ab ? 'ok' : 'warn');
    reverse(P.ba ? '$B\\subseteq A$，$q\\Rightarrow p$ 成立' : '$B\\nsubseteq A$，$q\\Rightarrow p$ 不成立', P.ba ? 'ok' : 'warn');
    result(`$p$ 是 $q$ 的${P.relation}条件`);
    const where = inA ? (inB ? '\\in A\\cap B' : '\\in A\\setminus B') : (inB ? '\\in B\\setminus A' : '\\notin A\\cup B');
    const direction = inA ? 'p\\Rightarrow q' : 'q\\Rightarrow p';
    probe(`$${v}${where}$，` + (inA !== inB ? `$${direction}$ 的反例` : '双向均真'), inA !== inB ? 'warn' : '');
  };
  const buttons = presets.map((P, i) => B.btnM('①②③④'[i] + ` $p:\\ ${P.p},\\ q:\\ ${P.q}$`, () => {
    state.i = i;
    buttons.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  probeHandle(B, state, 168);
  B.render();
  return B;
}
