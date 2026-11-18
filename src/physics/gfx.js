/* 物理实验室的公共绘图件：取主题色、世界坐标 → 屏幕坐标的相机、网格与文字。
   实验模块都是框架无关的纯 JS，只拿一个 canvas 2D 上下文与宽高，不碰 Vue。 */

/** 从站点 CSS 变量里取一套颜色，主题切换后重新取一次即可 */
export function readPal() {
  const cs = getComputedStyle(document.documentElement);
  const v = k => cs.getPropertyValue(k).trim() || '#888';
  return {
    ink: v('--ink'), mut: v('--mut'), faint: v('--faint'), line: v('--line'),
    blue: v('--blue'), orange: v('--orange'), green: v('--green'),
    purple: v('--purple'), pink: v('--pink'), cyan: v('--cyan'),
    card: v('--card'), bg2: v('--bg2'),
  };
}

/* 外壳的缩放与平移：z 是缩放倍数，x / y 是整幅画面的屏幕像素位移（世界原点与图形都不动，
   全在相机里叠），所以各实验的绘制代码不用为缩放写任何分支。 */
export const VIEW = { z: 1, x: 0, y: 0 };
export function resetView() { VIEW.z = 1; VIEW.x = 0; VIEW.y = 0; }

/** 世界坐标范围 → 屏幕坐标：等比缩放并居中，四周留 pad 比例的边；
    再叠加 VIEW（o.fixed 为真时忽略，留给不跟随视野的小图）。 */
export function camera2d(w, h, xmin, xmax, ymin, ymax, pad = 0.06, o) {
  const v = o && o.fixed ? { z: 1, x: 0, y: 0 } : VIEW;
  const s = Math.min(w / (xmax - xmin), h / (ymax - ymin)) * (1 - pad) * v.z;
  const sx = w / 2 + v.x - ((xmin + xmax) / 2) * s;
  const sy = h / 2 + v.y + ((ymin + ymax) / 2) * s;
  return {
    s, sx, sy,
    X: x => sx + x * s,
    Y: y => sy - y * s,
    wx: px => (px - sx) / s,
    wy: py => (sy - py) / s,
    len: n => n / s,
  };
}

/** 铺一层淡网格，step 是世界坐标里的间距 */
export function grid2d(ctx, cam, w, h, step = 1, color = '#8882') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const wx0 = Math.floor(cam.wx(0) / step) * step;
  const wx1 = cam.wx(w);
  for (let x = wx0; x <= wx1; x += step) {
    const px = Math.round(cam.X(x)) + 0.5;
    ctx.moveTo(px, 0); ctx.lineTo(px, h);
  }
  const wy1 = Math.ceil(cam.wy(0) / step) * step;
  const wy0 = cam.wy(h);
  for (let y = wy0; y <= wy1; y += step) {
    const py = Math.round(cam.Y(y)) + 0.5;
    ctx.moveTo(0, py); ctx.lineTo(w, py);
  }
  ctx.stroke();
  ctx.restore();
  return { x0: cam.X(0), y0: cam.Y(0) };
}

/** 带一点底色的圆点 */
export function dot(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

/* 板内文字可以拖动：与数学画板同一条习惯——标注重叠时按住在画面里挪开，双击复原。
   每一帧画标签时把它的框登记进 LBL.frame，外壳拿指针坐标（已去掉缩放平移）去命中；
   偏移记的是**相对自然位置的位移**，单位是绘制坐标，所以缩放后标签仍跟着图形走。
   键是「演示名#本帧第几个标签」：同一台演示每帧的绘制次序固定，重画后偏移照样带着走；
   刻度数字（12px）不登记，免得按住画面平移时误抓到一枚序号。 */
export const LBL = { g: '', n: 0, frame: [], off: {} };

/** 外壳在每帧调 frame() 之前调一次：换演示名、序号归零、清掉上一帧的框 */
export function lblBegin(g) {
  LBL.g = g || '';
  LBL.n = 0;
  LBL.frame.length = 0;
}

export const lblKey = i => LBL.g + '#' + i;

/** 命中最上面的那个标签（后画的压在上面），x / y 是绘制坐标 */
export function lblAt(x, y) {
  const f = LBL.frame;
  for (let i = f.length - 1; i >= 0; i--) {
    const b = f[i];
    if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) return b;
  }
  return null;
}

/** 小字标签：左对齐或居中都走这里。
    不叠描边光晕——中文与数字被 3px 的黑边一包，笔画首尾咬在一起，整行看着发糊；
    画板底色本来就淡，直接填色就够清楚。坐标落在半像素格上，DPR 缩放下字缘不发灰。
    默认 15px：画框铺满窗口后 13px 看上去仍偏小，读数与量值一律走这个尺寸。 */
export function label(ctx, text, x, y, color, align = 'left', size = 15) {
  const i = LBL.n++;
  const o = LBL.off[lblKey(i)];
  const px = Math.round((x + (o ? o[0] : 0)) * 2) / 2;
  const py = Math.round((y + (o ? o[1] : 0)) * 2) / 2;
  ctx.save();
  ctx.font = `${size}px system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, px, py);
  if (LBL.g && size >= 13) {
    const tw = ctx.measureText(text).width;
    const x0 = align === 'center' ? px - tw / 2 : align === 'right' ? px - tw : px;
    LBL.frame.push({
      i, key: lblKey(i), text,
      x0: x0 - 3, y0: py - size * 0.74, x1: x0 + tw + 3, y1: py + size * 0.74,
    });
  }
  ctx.restore();
}

/** 箭头（速度、力向量用） */
export function arrow(ctx, x1, y1, x2, y2, color, width = 2) {
  const dx = x2 - x1, dy = y2 - y1;
  const L = Math.hypot(dx, dy);
  if (L < 1) return;
  const ux = dx / L, uy = dy / L;
  const head = Math.min(14, L * 0.4);
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ux * head * 0.7, y2 - uy * head * 0.7); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - ux * head - uy * head * 0.45, y2 - uy * head + ux * head * 0.45);
  ctx.lineTo(x2 - ux * head + uy * head * 0.45, y2 - uy * head - ux * head * 0.45);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** 从世界坐标 (x, y) 画一根世界向量 (vx, vy) 乘 k；返回箭头末端的屏幕坐标，便于挂标签 */
export function vec(ctx, cam, x, y, vx, vy, k, color, width = 2.5) {
  const x2 = cam.X(x + vx * k), y2 = cam.Y(y + vy * k);
  arrow(ctx, cam.X(x), cam.Y(y), x2, y2, color, width);
  return { x: x2, y: y2 };
}

/** 指针是否停在世界坐标 (x, y) 附近，r 用世界单位给 */
export function hover(ui, cam, x, y, r) {
  if (!ui || !ui.in) return false;
  return Math.hypot(cam.wx(ui.x) - x, cam.wy(ui.y) - y) <= r;
}

/** 分析图层要不要画：开关常显，或指针停在物体上 */
export function showInfo(ui, onObject) {
  return !!ui && (!!ui.always || !!onObject);
}

/** 悬停定格：开了这一档且指针停在这个物体上，调用方就把这一帧的 step 置 0 */
export function holdFor(ui, onObject) {
  return !!ui && !!ui.hold && !!onObject;
}

/** 物体大小倍率：右下「物体」滑块给的 0.5–1.8，乘在各实验的刚体几何上。
    几何同时进碰撞体与密度，所以倍率一变，模块要重搭一次世界。 */
export function objScale(ui) {
  const v = ui && ui.scale;
  return Number.isFinite(v) ? clamp(v, 0.5, 1.8) : 1;
}


export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const fmt = (v, n = 2) => (Number.isFinite(v) ? v.toFixed(n) : '—');
