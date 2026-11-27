import { mk, V } from '../../../lib/board.js';
import { axisProbe, frame, label, logicDiagram, probeHandle, wash } from '../../../lib/logic-diagram.js';

export function createBoard(root) {
  const B = logicDiagram(root, 'contra-board', 305, '逆否等价：探针的真假组合与四种全称命题');
  const PRE = [
    { pt: 'x>2', qt: 'x>1', pf: x => x > 2, qf: x => x > 1, v: [1, 0, 0, 1], ce: [null, 1.5, 1.5, null] },
    { pt: 'x^2>4', qt: 'x>2', pf: x => x * x > 4, qf: x => x > 2, v: [0, 1, 1, 0], ce: [-3, null, null, -3] },
    { pt: '|x|>1', qt: 'x^2>1', pf: x => Math.abs(x) > 1, qf: x => x * x > 1, v: [1, 1, 1, 1], ce: [null, null, null, null] },
  ];
  const st = { i: 0, v: 2.5, auto: false, dir: 1 };
  const formulas = ['p\\Rightarrow q', 'q\\Rightarrow p', '\\neg p\\Rightarrow\\neg q', '\\neg q\\Rightarrow\\neg p'];
  const names = ['原命题', '逆命题', '否命题', '逆否命题'];
  // 将等价的两式排在同一行。
  const order = [0, 3, 1, 2];
  const verdicts = order.map(i => B.chipM(names[i]));
  const probe = B.readout('当前取值');
  B.renderFn = () => {
    const ink = B.diagramColors;
    const P = PRE[st.i], p = P.pf(st.v), q = P.qf(st.v);
    frame(B);
    label(B, 260, 32, `$p:\\ ${P.pt}\\qquad q:\\ ${P.qt}$`, 17);
    for (const qt of [true, false]) label(B, qt ? 191 : 381, 67, qt ? '$q$ 真' : '$q$ 假', 14);
    for (const pt of [true, false]) {
      const y = pt ? 85 : 149;
      label(B, 55, y + 27, pt ? '$p$ 真' : '$p$ 假', 14);
      for (const qt of [true, false]) {
        const x = qt ? 100 : 290, active = pt === p && qt === q;
        const color = pt === qt ? ink.guide : pt ? ink.red : ink.orange;
        mk('rect', { x, y, width: 182, height: 54, rx: 8, fill: color, 'fill-opacity': pt === qt ? wash(B) / 2 : wash(B),
          stroke: active ? ink.gold : ink.axis, 'stroke-width': active ? 2.4 : 1 }, B.dyn);
        if (active) B.dot(V(x + 12, y + 12), 3, { fill: ink.gold });
        const here = pt === qt ? '四式皆真' : pt ? '原、逆否为假' : '逆、否为假';
        const possible = pt === qt || (pt ? !P.v[0] : !P.v[1]);
        label(B, x + 91, y + 20, here, 15, color);
        label(B, x + 91, y + 39, active ? '当前取值' : possible ? '本例可取' : '本例无此取值', 13, ink.guide);
      }
    }
    axisProbe(B, st.v, 239, 218);
    order.forEach((row, i) => {
      verdicts[i](`$${formulas[row]}$ ` + (P.v[row] ? '恒成立' : `假，反例 $x=${P.ce[row]}$`), P.v[row] ? 'ok' : 'warn');
    });
    const verdict = p === q ? '四式皆真' : p ? '原、逆否皆假' : '逆、否皆假';
    probe(`$x=${st.v}$，${verdict}`, p === q ? '' : 'warn');
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
        st.v = Math.round(nv * 20) / 20; B.render();
        B.raf(step);
      };
      B.raf(step);
    }
  });

  probeHandle(B, st, 239);
  B.render();
  return B;
}
