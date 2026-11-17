/* ================= 三维画板助手 =================
   正交投影 + 画家算法 + 拖拽旋转（GeoGebra 式的观感）。
   右手系取课本视角：x 指向左前、y 指向右前、z 向上（默认 yaw=45°、pitch≈21°）。
   相机由两个角决定：yaw 绕 z 轴转，pitch 抬高视线；正交投影不做透视，量长读角都不失真。
   Scene 收集面 / 线 / 点 / 标签，flush() 时按深度从远到近落到画板 dyn 层：
   半透明面互相叠压，靠后的先画，于是能透过前面看穿后面。 */
import { mk, V, inkCol } from './board.js';

export const v3 = (x = 0, y = 0, z = 0) => ({ x, y, z });
export const add3 = (a, b) => v3(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub3 = (a, b) => v3(a.x - b.x, a.y - b.y, a.z - b.z);
export const mul3 = (a, k) => v3(a.x * k, a.y * k, a.z * k);
export const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross3 = (a, b) => v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
export const len3 = a => Math.hypot(a.x, a.y, a.z);
export const unit3 = a => mul3(a, 1 / (len3(a) || 1));
export const lerp3 = (a, b, t) => add3(a, mul3(sub3(b, a), t));

/** 相机：cx/cy 为投影中心的屏幕坐标，cz 为投影中心的世界 z，s 为每单位像素数 */
export const makeCam = (o = {}) => ({
  yaw: o.yaw ?? Math.PI / 4, pitch: o.pitch ?? 0.36, s: o.s ?? 60,
  cx: o.cx ?? 430, cy: o.cy ?? 210, cz: o.cz ?? 0,
});

/** 世界点 → 屏幕点；d 为沿视线方向的深度，越大越靠近观察者 */
export function view(p, cam) {
  const ca = Math.cos(cam.yaw), sa = Math.sin(cam.yaw);
  const cb = Math.cos(cam.pitch), sb = Math.sin(cam.pitch);
  const dx = p.x, dy = p.y, dz = p.z - cam.cz;
  const rx = -sa * dx + ca * dy;                       // 右向量 (−sin a, cos a, 0) · p
  const uy = -ca * sb * dx - sa * sb * dy + cb * dz;   // 上向量 (−cos a sin b, −sin a sin b, cos b) · p
  const dp = ca * cb * dx + sa * cb * dy + sb * dz;    // 前向量 (cos a cos b, sin a cos b, sin b) · p
  return { x: cam.cx + cam.s * rx, y: cam.cy - cam.s * uy, d: dp };
}

/** 三维圆：圆心 c，平面内两条正交单位向量 e1/e2，半径 r。
 *  首点补在末尾，整圈首尾相接——只取 n 个点会让折线在起点处留一道缝（球面经线纬线看起来没闭合）。 */
export function circle3(c, e1, e2, r, n = 48) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / n * Math.PI * 2;
    pts.push(add3(c, add3(mul3(e1, r * Math.cos(t)), mul3(e2, r * Math.sin(t)))));
  }
  pts.push(pts[0]);
  return pts;
}

/** 以 O 为顶点、沿 Op1 与 Op2 两条射线张开的圆弧；投影后是一段椭圆弧。返回张角（弧度）。
 *  o = { stroke, w, op, frac }，frac 用于只画一部分（例如标直角则用 rightMark3） */
export function arc3(cs, O, p1, p2, rad, o = {}) {
  const e1 = unit3(sub3(p1, O));
  const raw = unit3(sub3(p2, O));
  let e2 = sub3(raw, mul3(e1, dot3(raw, e1)));
  if (len3(e2) < 1e-9) return 0;
  e2 = unit3(e2);
  const th = Math.acos(Math.max(-1, Math.min(1, dot3(e1, raw))));
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = th * (o.frac ?? 1) * i / 24;
    pts.push(add3(O, add3(mul3(e1, rad * Math.cos(t)), mul3(e2, rad * Math.sin(t)))));
  }
  cs.path(pts, { stroke: o.stroke || '#ffd166', w: o.w ?? 1.5, op: o.op ?? 0.95 });
  return th;
}

/** 直角标记：在 O 处、沿 Op1 与 Op2 方向画一个小正方形，落在两向量张成的平面里 */
export function rightMark3(cs, O, p1, p2, u = 0.15, o = {}) {
  const e1 = unit3(sub3(p1, O)), e2 = unit3(sub3(p2, O));
  cs.path([
    add3(O, mul3(e1, u)),
    add3(O, add3(mul3(e1, u), mul3(e2, u))),
    add3(O, mul3(e2, u)),
  ], { stroke: o.stroke || '#ffd166', w: o.w ?? 1.5, op: o.op ?? 0.95 });
}

export class Scene {
  constructor(B, cam) { this.B = B; this.cam = cam; this.list = []; this.n = 0; }
  P(p) { return view(p, this.cam); }
  push(d, fn) { this.list.push({ d, k: this.n++, fn }); }

  /** 平面多边形：pts 为世界坐标数组。o = { fill 语义色, op 填充不透明度, stroke 描边色（'none' 免描边）,
   *  lineOp 描边不透明度, w 描边宽, dash, attrs 追加属性 } */
  poly(pts, o = {}) {
    if (!pts || pts.length < 3) return;
    const ps = pts.map(p => this.P(p));
    const d = ps.reduce((a, q) => a + q.d, 0) / ps.length;
    const at = {
      points: ps.map(q => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' '),
      fill: o.fill || '#5cadff',
      'fill-opacity': o.op ?? 0.16,
      stroke: o.stroke ?? 'none',
      'stroke-width': o.w ?? 1,
      'stroke-linejoin': 'round',
    };
    if (at.stroke !== 'none') at['stroke-opacity'] = o.lineOp ?? 0.8;
    if (o.dash) at['stroke-dasharray'] = o.dash;
    if (o.attrs) Object.assign(at, o.attrs);
    this.push(d, () => mk('polygon', at, this.B.dyn));
  }

  /** 折线（两点即线段）；深度取两端较近的那个，线段压在近处 */
  path(pts, o = {}) {
    if (!pts || pts.length < 2) return;
    const ps = pts.map(p => this.P(p));
    const d = Math.max(...ps.map(q => q.d));
    const at = {
      d: 'M' + ps.map(q => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' L'),
      fill: 'none', stroke: o.stroke || '#5cadff', 'stroke-width': o.w ?? 1.6,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round',
    };
    if (o.op != null) at['stroke-opacity'] = o.op;
    if (o.dash) at['stroke-dasharray'] = o.dash;
    if (o.attrs) Object.assign(at, o.attrs);
    this.push(d, () => mk('path', at, this.B.dyn));
  }

  line(a, b, o) { this.path([a, b], o); }

  /** 点：o = { fill, stroke 描边（默认深底色）, w, bias 深度微调 } */
  dot(p, r, o = {}) {
    const q = this.P(p);
    const at = { cx: q.x, cy: q.y, r, fill: o.fill || '#ffd166', stroke: o.stroke || '#0a0d14', 'stroke-width': o.w ?? 1.2 };
    if (o.op != null) at['fill-opacity'] = o.op;
    if (o.stroke === 'none') at.stroke = 'none';
    this.push(q.d + (o.bias || 0), () => mk('circle', at, this.B.dyn));
  }

  /** 文字标签：p 为世界坐标锚点，dx/dy 为屏幕偏移；一律最后绘制 */
  label(p, s, o = {}) {
    const q = this.P(p);
    const at = { x: q.x + (o.dx ?? 0), y: q.y + (o.dy ?? 0), 'text-anchor': o.anchor || 'middle', text: s,
      'font-size': o.size ?? 13, fill: o.fill || inkCol(), 'font-weight': o.bold ?? 700 };
    this.push(Infinity, () => mk('text', at, this.B.dyn));
  }

  flush() {
    this.list.sort((a, b) => a.d - b.d || a.k - b.k).forEach(o => o.fn());
    this.list = []; this.n = 0;
  }
}

/** 三维箭头：箭身是线段，箭尖在屏幕空间补一个三角形（paint 之后不会歪）。
 *  返回箭尖方向的屏幕单位向量，方便把标签摆在箭头外侧 */
export function arrow3(cs, a, b, o = {}) {
  const col = o.stroke || '#5cadff';
  cs.line(a, b, { stroke: col, w: o.w ?? 2, op: o.op ?? 0.95 });
  const q0 = cs.P(a), q1 = cs.P(b);
  const dx = q1.x - q0.x, dy = q1.y - q0.y, len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const at = (t, s) => `${(q1.x - ux * 14 * t + nx * 6 * s).toFixed(1)},${(q1.y - uy * 14 * t + ny * 6 * s).toFixed(1)}`;
  cs.push(q1.d + 0.6, () => mk('polygon',
    { points: `${q1.x.toFixed(1)},${q1.y.toFixed(1)} ${at(1, 1)} ${at(1, -1)}`, fill: col, stroke: 'none' }, cs.B.dyn));
  return { ux, uy };
}


/** 拖拽旋转：在整块画板上按下并拖动即可转视角（yaw 跟横移、pitch 跟纵移，pitch 夹在 ±77°）。
 *  redraw() 由各板传入（通常是 () => B.render()）；handles 上的按下不接管，避免和拖动把手抢事件。 */
export function orbit(B, cam, redraw, o = {}) {
  const svg = B.svg, sp = o.speed ?? 0.011;
  B.orbitCam = true; // 告诉画板：svg 上的拖拽归这里转视角，缩放只留 Ctrl+滚轮与双击复原
  let cur = null;
  const down = ev => {
    const tg = ev.target;
    if (tg && tg.classList && (tg.classList.contains('hnd') || tg.classList.contains('hndlbl'))) return;
    cur = { x: ev.clientX, y: ev.clientY };
    if (svg.style) svg.style.cursor = 'grabbing';
    if (svg.setPointerCapture && ev.pointerId != null) { try { svg.setPointerCapture(ev.pointerId); } catch (_) { /* 无指针捕获的环境跳过 */ } }
    if (ev.preventDefault) ev.preventDefault();
  };
  const move = ev => {
    if (!cur) return;
    const dx = ev.clientX - cur.x, dy = ev.clientY - cur.y;
    cur = { x: ev.clientX, y: ev.clientY };
    cam.yaw -= dx * sp;
    cam.pitch = Math.max(-1.35, Math.min(1.35, cam.pitch + dy * sp));
    redraw();
    if (B._camChanged) B._camChanged(); // 视角也是实验状态：交给画板防抖写进分享链接
  };
  const up = () => { cur = null; if (svg.style) svg.style.cursor = 'grab'; };
  svg.addEventListener('pointerdown', down);
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', up);
  svg.addEventListener('pointerleave', up);
  if (svg.style) svg.style.cursor = 'grab';
  // 视角进出 URL：分享链接里带 cam=yaw,pitch，打开时 applyQuery 调 camSet 还原
  B.camGet = () => ({ yaw: cam.yaw, pitch: cam.pitch });
  B.camSet = st => {
    if (!st) return;
    if (isFinite(st.yaw)) cam.yaw = st.yaw;
    if (isFinite(st.pitch)) cam.pitch = Math.max(-1.35, Math.min(1.35, st.pitch));
    redraw();
  };
  return { stop() {
    svg.removeEventListener && svg.removeEventListener('pointerdown', down);
    svg.removeEventListener && svg.removeEventListener('pointermove', move);
    svg.removeEventListener && svg.removeEventListener('pointerup', up);
    svg.removeEventListener && svg.removeEventListener('pointerleave', up);
  } };
}

/** 常见立体的面清单：由顶点与面自动推出不重复的棱（面里相邻两点各取一次） */
export function edgesOf(faces) {
  const seen = new Set(), out = [];
  for (const f of faces) for (let i = 0; i < f.length; i++) {
    const a = f[i], b = f[(i + 1) % f.length], k = a < b ? a + '-' + b : b + '-' + a;
    if (!seen.has(k)) { seen.add(k); out.push([a, b]); }
  }
  return out;
}

/* 供画板统一取的配色：面用这套循环，颜色彼此拉得开且都在 COLOR 表里 */
export const FACE_COLORS = ['#5cadff', '#4ade80', '#ffd166', '#c084fc', '#ff9e4a', '#67e8f9'];
/** 平面 Ax+By+Cz+D=0 与立方体 [−L,L]³ 的交多边形（按绕平面法向的角度排好序）。
 *  画「平面在盒子里」的通用做法：取 12 条棱与平面的交点，去重后绕重心按角度排序；
 *  交点多于 3 个时得到的是凸多边形，直接喂 cs.poly。 */
export function planePoly(nx, ny, nz, D, L) {
  const C = [];
  for (const sx of [-L, L]) for (const sy of [-L, L]) for (const sz of [-L, L]) C.push([sx, sy, sz]);
  const pts = [];
  for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) {
    const a = C[i], b = C[j];
    let diff = 0;
    for (let k = 0; k < 3; k++) if (a[k] !== b[k]) diff++;
    if (diff !== 1) continue;                       // 只取沿坐标轴方向的棱
    const fa = nx * a[0] + ny * a[1] + nz * a[2] + D;
    const fb = nx * b[0] + ny * b[1] + nz * b[2] + D;
    if (fa * fb > 0) continue;
    if (Math.abs(fa - fb) < 1e-12) continue;        // 整条棱落在平面内（退化，跳过）
    const t = fa / (fa - fb);
    pts.push(v3(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t));
  }
  const out = [];
  for (const p of pts) if (!out.some(q => len3(sub3(p, q)) < 1e-6)) out.push(p);
  if (out.length < 3) return out;
  const ctr = mul3(out.reduce((s, p) => add3(s, p), v3(0, 0, 0)), 1 / out.length);
  const e1 = unit3(sub3(out[0], ctr));
  const e2 = cross3(unit3(v3(nx, ny, nz)), e1);
  const ang = p => Math.atan2(dot3(sub3(p, ctr), e2), dot3(sub3(p, ctr), e1));
  return out.slice().sort((p, q) => ang(p) - ang(q));
}

export { V };
