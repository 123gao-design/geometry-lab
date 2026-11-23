// 系数应先按曲线的自然尺度归一化。容差只吸收浮点消去误差。
export function lineRoots(a, b, c) {
  const eps = 32 * Number.EPSILON;
  if (Math.abs(a) <= eps) {
    if (Math.abs(b) <= eps) return { kind: 'constant', roots: [] };
    return { kind: 'linear', roots: [-c / b] };
  }
  const delta = b * b - 4 * a * c;
  const uncertainty = eps * (b * b + Math.abs(4 * a * c));
  if (delta < -uncertainty) return { kind: 'empty', delta, roots: [] };
  if (Math.abs(delta) <= uncertainty) return { kind: 'tangent', delta: 0, roots: [-b / (2 * a)] };
  // 用乘积求另一个根，避免第二个交点很远时减去两个相近的大数。
  const q = -.5 * (b + (b < 0 ? -1 : 1) * Math.sqrt(delta));
  return { kind: 'secant', delta, roots: [q / a, c / q].sort((x, y) => x - y) };
}
