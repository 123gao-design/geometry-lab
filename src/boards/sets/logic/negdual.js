import { V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { axisProbe, axisX, bands, frame, label, logicDiagram, probeHandle } from '../../../lib/logic-diagram.js';

const presets = [
  { domain: 'Z', universal: true, p: 'x^2\\le 4', n: 'x^2>4', test: x => x * x <= 4, yes: 0, no: 3 },
  { domain: 'R', universal: true, p: 'x\\ge 0', n: 'x<0', test: x => x >= 0, cuts: [0], yes: 0, no: -1 },
  { domain: 'R', universal: false, p: 'x^2>4', n: 'x^2\\le 4', test: x => x * x > 4, cuts: [-2, 2], yes: 3, no: 2 },
  { domain: 'N', universal: false, p: 'x^2=x', n: 'x^2\\ne x', test: x => x * x === x, yes: 0, no: 2 },
];
const inDomain = (domain, x) => domain === 'R' || (Number.isInteger(x) && (domain === 'Z' || x >= 0));
const statement = (universal, domain, body) => `$${universal ? '\\forall' : '\\exists'} x\\in\\mathbb{${domain}},\\ ${body}$`;

export function createBoard(root) {
  const B = logicDiagram(root, 'negdual-board', 234, '量词的否定：逐点比较两个谓词');
  const state = { i: 0, v: 3 };
  const original = B.chipM('原命题'), negated = B.chipM('否定式'), wrong = B.chipM('量词未换'), probe = B.chipM('探针');
  B.renderFn = () => {
    const ink = B.diagramColors;
    const P = presets[state.i], v = state.v, inside = inDomain(P.domain, v);
    const s = statement(P.universal, P.domain, P.p), n = statement(!P.universal, P.domain, P.n);
    frame(B);
    label(B, 260, 34, s, 18);
    for (const [y, negate] of [[81, false], [123, true]]) {
      label(B, 35, y, negate ? '$\\neg p$' : '$p$', 16);
      const color = x => (P.test(x) !== negate) ? ink.green : ink.red;
      if (P.cuts) {
        bands(B, y, P.cuts, color);
        // 分界处的实点直接给出这个点自己的真假。
        for (const x of P.cuts) B.dot(V(axisX(x), y), 4, { fill: color(x), stroke: ink.paper, 'stroke-width': 1.3 });
      } else {
        for (let x = -6; x <= 6; x++) {
          if (!inDomain(P.domain, x)) continue;
          const tone = color(x);
          B.dot(V(axisX(x), y), 3.6, { fill: tone === ink.red ? ink.paper : tone, stroke: tone, 'stroke-width': 1.3 });
        }
      }
    }
    axisProbe(B, v, 168, 62);
    if (inside) {
      const y = P.test(v) ? 81 : 123;
      glowDot(B, V(axisX(v), y), ink.green, 7, 3);
    }
    // 四个预设均有满足 p 和不满足 p 的具体元素，故无须用有限采样猜测全称命题。
    original(P.universal ? `${s} 假，反例 $x=${P.no}$` : `${s} 真，见证 $x=${P.yes}$`, P.universal ? 'warn' : 'ok');
    negated(P.universal ? `${n} 真，见证 $x=${P.no}$` : `${n} 假，反例 $x=${P.yes}$`, P.universal ? 'ok' : 'warn');
    wrong(`${statement(P.universal, P.domain, P.n)} 与原命题同${P.universal ? '假' : '真'}`, 'warn');
    probe(inside ? `$x=${v}$ 时，$p$ ${P.test(v) ? '真' : '假'}，$\\neg p$ ${P.test(v) ? '假' : '真'}` : `$x=${v}\\notin\\mathbb{${P.domain}}$，两行留空`);
  };
  const buttons = presets.map((P, i) => B.btnM('①②③④'[i] + ' ' + statement(P.universal, P.domain, P.p), () => {
    state.i = i;
    buttons.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  probeHandle(B, state, 168);
  B.render();
  return B;
}
