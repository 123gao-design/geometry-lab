// 画板上的两处「图形推导」：电流小点的排布，与灯泡伏安特性曲线。
// 都只吃参数、吐纯数据（点坐标 / 路径串），不碰 DOM。

import { f2, num } from './util.js';
import { bulbRAt } from './solve.js';

/** 电流小点：直流匀速平移一格，交流在原地来回摆（摆幅即峰值电流）。
    点位一律摆在每格的中点上、平移量取 ±半格，扫过的一端正好落在节点上，
    负方向的电流也不会有点滑出线段外。 */
export function flowOf(p, q, dcI, acI, freq) {
  const L = Math.hypot(q.x - p.x, q.y - p.y) || 1;
  const ux = (q.x - p.x) / L;
  const uy = (q.y - p.y) / L;
  const dAbs = Math.abs(dcI);
  const aAbs = Math.abs(acI);
  if (aAbs > 0.02) {
    const cnt = Math.max(2, Math.round(L / 44));
    const step = L / cnt;
    const amp = Math.min(step * 0.5, 5 + 9 * Math.min(2.5, aAbs));
    const dots = [];
    for (let i = 0; i < cnt; i++) {
      dots.push({ x: p.x + ux * ((i + 0.5) * step), y: p.y + uy * ((i + 0.5) * step) });
    }
    const k = Math.max(5, Math.min(200, freq || 50));
    const dur = Math.max(0.9, Math.min(5, 2.4 * Math.pow(50 / k, 0.35)));
    return { dots, dur, ox: 0, oy: 0, fx: ux * amp, fy: uy * amp, ac: true };
  }
  if (dAbs > 0.008) {
    const cnt = Math.max(2, Math.round(L / 26));
    const step = L / cnt;
    const dots = [];
    for (let i = 0; i < cnt; i++) {
      dots.push({ x: p.x + ux * ((i + 0.5) * step), y: p.y + uy * ((i + 0.5) * step) });
    }
    const vel = 58 + 92 * Math.min(2, dAbs);
    const dur = step / vel;
    const dir = dcI > 0 ? 1 : -1;
    return {
      dots, dur, ac: false,
      ox: -ux * step * dir / 2, oy: -uy * step * dir / 2,
      fx: ux * step * dir, fy: uy * step * dir,
    };
  }
  return null;
}

/** 灯泡的伏安特性：按灯丝电阻曲线逐点取样，横轴电压、纵轴电流，
    空心圈是额定点、实心点是此刻的工作点。opU / opI 是此刻的工作点读数。 */
export function bulbPlotOf(p, opU, opI) {
  const Ur = Math.max(0.5, num(p.Ur, 6));
  const Pr = Math.max(0.1, num(p.Pr, 3));
  const Ih = Pr / Ur;
  const Rh = Ur * Ur / Pr;
  const Umax = Math.max(Ur * 1.3, opU * 1.25, 1.5);
  // 曲线右端可能比额定点高得多（凸特性尤其明显），纵轴上限要把它一起框进来
  const Imax = Math.max(Ih * 1.05, opI * 1.2, Umax / bulbRAt(p, Umax) * 1.05, 0.05);
  const X = u => 30 + (u / Umax) * 192;
  const Y = i => 98 - (i / Imax) * 88;
  const N = 48;
  let d = '';
  for (let n = 0; n <= N; n++) {
    const u = (n / N) * Umax;
    const i = u / bulbRAt(p, u);
    d += (n ? 'L' : 'M') + X(u).toFixed(2) + ' ' + Y(i).toFixed(2) + ' ';
  }
  return {
    d: d.trim(),
    rx: X(Ur), ry: Y(Ih),
    ox: X(Math.min(opU, Umax)), oy: Y(Math.min(opI, Imax)),
    uTxt: f2(Ur), iTxt: f2(Ih), iHTxt: f2(Ih), rHTxt: f2(Rh),
    opTxt: `${f2(opU)} V / ${f2(opI)} A`,
  };
}
