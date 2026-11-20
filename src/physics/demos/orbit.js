/* 三维演示的转视角。演示模块拿它建一台正交相机，把返回对象里的 orbit 一处交给外壳：
   外壳见到 api.orbit，就把「按住画面拖动」从平移改成转视角（缩放仍走 Ctrl + 滚轮），
   双击复原。orbit 上带 active() 时（只有某一档才是三维的那种板），外壳先问一句再决定。

   约定：世界坐标 x 向右、y 向上、z 朝读者（与 ampere.js 的叉乘口径一致）。
   yaw 绕竖轴转、pitch 把视线抬高（0 是平视，越大越俯视）。投影
       X = x·cos yaw − z·sin yaw
       U = x·sin yaw·sin pitch + y·cos pitch + z·cos yaw·sin pitch
   proj() 给出 [X, U]，U 朝上，画成画布坐标时取负。 */
import { clamp } from '../gfx.js';

export function makeOrbit(o = {}) {
  const y0 = Number.isFinite(o.yaw) ? o.yaw : -0.55;
  const p0 = Number.isFinite(o.pitch) ? o.pitch : 0.42;
  const ylim = Number.isFinite(o.ylim) ? o.ylim : 1.3;
  const pmin = Number.isFinite(o.pmin) ? o.pmin : 0.12;
  const pmax = Number.isFinite(o.pmax) ? o.pmax : 1.15;
  const s = { yaw: y0, pitch: p0 };
  let touched = false;

  const orb = {
    y0,
    p0,
    yaw: () => s.yaw,
    pitch: () => s.pitch,
    /* 用户自己转过没有：没转过时，演示可以自行摆一点视角做提示 */
    touched: () => touched,
    set(y, p) {
      s.yaw = clamp(y, -ylim, ylim);
      if (Number.isFinite(p)) s.pitch = clamp(p, pmin, pmax);
    },
    /* 拖动 dx / dy（屏幕像素）：横向转 yaw、纵向改 pitch */
    drag(dx, dy) {
      touched = true;
      s.yaw = clamp(s.yaw - dx * 0.0075, -ylim, ylim);
      s.pitch = clamp(s.pitch + dy * 0.005, pmin, pmax);
    },
    reset() {
      s.yaw = y0;
      s.pitch = p0;
      touched = false;
    },
    proj(x, y, z) {
      const ca = Math.cos(s.yaw), sa = Math.sin(s.yaw);
      const cp = Math.cos(s.pitch), sp = Math.sin(s.pitch);
      return [x * ca - z * sa, x * sa * sp + y * cp + z * ca * sp];
    },
  };
  return orb;
}
