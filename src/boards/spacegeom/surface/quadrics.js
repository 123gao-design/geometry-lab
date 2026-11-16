/* 图 曲3 · 二次曲面机
   五种二次曲面共用一枚「截痕高度」滑块：曲面用一组水平截痕（椭圆或双曲线）与两条子午线铺出，
   金色就是高度 z₀ 处那一层。① 椭球 ② 单叶双曲面 ③ 双叶双曲面 ④ 椭圆抛物面 ⑤ 双曲抛物面（两族直母线）。
   2026-11-16：曲面改走 WebGL 层（lib/gl3d.js）——真三角形网格 + 深度遮挡，转视角时背面的网格线会被
   正面挡住，才看得出是实体而不是一团线；金色截痕、标签仍由 SVG 画。坐标框按 MATLAB 三维图的画法：
   十二条棱 + 背向相机的三面铺单位网格 + 三根带刻度和数字的轴，框的大小跟着当前曲面的外接尺寸走。
   环境不支持 WebGL 时自动退回原来的截痕线网（见 useGL 分支）。 */
import { Board, mk, inkCol } from '../../../lib/board.js';
import { v3, makeCam, Scene, arrow3, orbit } from '../../../lib/solid3d.js';
import { attachGL } from '../../../lib/gl3d.js';

const TAU = Math.PI * 2;

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 252, s: 60 });
  const st = { m: 0, a: 1.6, b: 1.2, c: 1.0, z0: 0.6 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cN = B.chipM('曲面'), cE = B.chipM('标准方程'), cS = B.chipM('截痕'), cJ = B.chipM('判读');
  // WebGL 曲面层：three 就绪后回调里重画一次，把截痕线网换成网格；
  // 「曲面实体」关掉或环境不给 WebGL 时，renderFn 走 useGL = false 的老路
  let glOn = true;
  const gl = attachGL(B, { cam, onReady: () => B.render() });

  /* 坐标框（MATLAB 三维图那种画法）：整幅图装在一个盒子里——
     十二条棱画淡线，背向相机的三面铺单位网格，三根轴穿过原点通到框边，轴上按单位打刻度、标数字。
     盒子的半边长 bx/by/bz 由调用处按当前曲面的外接尺寸给，换档或拖半轴时框跟着面走。
     轴依旧先垫一道深色粗线再压彩色细线：曲面是半透明的亮面，细彩线直接画上去会糊在面里，
     加一圈暗边（跟文字的底色光晕一个道理）就总能分得清轴和面。 */
  const frame = (cs, bx, by, bz) => {
    const ink = inkCol();
    const edge = { stroke: ink, w: 0.9, op: 0.17 };
    const grill = { stroke: ink, w: 0.7, op: 0.09 };
    // 相机前向量的三个分量决定哪三张墙在背面：只有背向相机的墙才铺网格，正面的不画
    const ca = Math.cos(cam.yaw), sa = Math.sin(cam.yaw);
    const cb = Math.cos(cam.pitch), sb = Math.sin(cam.pitch);
    const wx = ca * cb > 0 ? -bx : bx;
    const wy = sa * cb > 0 ? -by : by;
    const wz = sb > 0 ? -bz : bz;
    // 十二条棱：沿 x、沿 y、沿 z 各四条
    for (const y of [-by, by]) for (const z of [-bz, bz]) cs.line(v3(-bx, y, z), v3(bx, y, z), edge);
    for (const x of [-bx, bx]) for (const z of [-bz, bz]) cs.line(v3(x, -by, z), v3(x, by, z), edge);
    for (const x of [-bx, bx]) for (const y of [-by, by]) cs.line(v3(x, y, -bz), v3(x, y, bz), edge);
    // 三张远墙的单位网格
    for (let k = Math.ceil(-by); k <= by; k++) cs.line(v3(wx, k, -bz), v3(wx, k, bz), grill);
    for (let k = Math.ceil(-bz); k <= bz; k++) cs.line(v3(wx, -by, k), v3(wx, by, k), grill);
    for (let k = Math.ceil(-bx); k <= bx; k++) cs.line(v3(k, wy, -bz), v3(k, wy, bz), grill);
    for (let k = Math.ceil(-bz); k <= bz; k++) cs.line(v3(-bx, wy, k), v3(bx, wy, k), grill);
    for (let k = Math.ceil(-bx); k <= bx; k++) cs.line(v3(k, -by, wz), v3(k, by, wz), grill);
    for (let k = Math.ceil(-by); k <= by; k++) cs.line(v3(-bx, k, wz), v3(bx, k, wz), grill);

    const axis = (dir, len, col, lab) => {
      const from = v3(-dir.x * len, -dir.y * len, -dir.z * len);
      const to = v3(dir.x * len, dir.y * len, dir.z * len);
      cs.line(from, to, { stroke: '#0a0d14', w: 4.4, op: 0.38 });
      arrow3(cs, from, to, { stroke: col, w: 2.0, op: 0.95 });
      const p0 = cs.P(from), p1 = cs.P(to);
      const ux = p1.x - p0.x, uy = p1.y - p0.y, l = Math.hypot(ux, uy) || 1;
      const nx = -uy / l, ny = ux / l;
      for (let k = Math.ceil(-len); k <= len; k++) {
        if (k === 0) continue;                 // 原点另有 O 标
        const p = v3(dir.x * k, dir.y * k, dir.z * k);
        const q = cs.P(p);
        if (Math.hypot(q.x - p1.x, q.y - p1.y) < 15) continue;   // 贴近箭尖的刻度省掉，免得跟轴名挤在一起
        // 刻度用屏幕空间的一小段横线：世界坐标的长度到了侧视会缩成一点，数字也会被挤压
        cs.push(q.d + 0.5, () => mk('line', {
          x1: (q.x - nx * 3.6).toFixed(1), y1: (q.y - ny * 3.6).toFixed(1),
          x2: (q.x + nx * 3.6).toFixed(1), y2: (q.y + ny * 3.6).toFixed(1),
          stroke: col, 'stroke-width': 1.3, 'stroke-opacity': 0.85,
        }, cs.B.dyn));
        cs.label(p, String(k), { dx: nx * 12, dy: ny * 12 + 3.5, size: 10, fill: col });
      }
      cs.label(to, lab, { dx: ux / l * 16, dy: uy / l * 16 + 4, size: 13, fill: col, bold: 700 });
    };
    axis(v3(1, 0, 0), bx, '#ff7b8a', 'x');
    axis(v3(0, 1, 0), by, '#67e8f9', 'y');
    axis(v3(0, 0, 1), bz, '#ffd166', 'z');
  };
  // 水平椭圆环（半径 rx、ry，高度 z）
  const ring = (z, rx, ry, n = 56) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = i / n * TAU;
      pts.push(v3(rx * Math.cos(t), ry * Math.sin(t), z));
    }
    pts.push(pts[0]);
    return pts;
  };
  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0;
    const { a, b, c } = st;
    // 双曲抛物面的矩形片按半轴走：半宽 ±1.55a、半长 ±1.55b（四角高度恒为 ±2.4，滑块怎么拖都不出画框）
    const hx = a * 1.55, hy = b * 1.55;
    // 坐标框的半边长：各档曲面的外接半尺寸（跟下面各分支里写死的取景一一对应，改取景时这里要跟着改）。
    // 单叶、双叶的 z 向另按截痕滑块的量程兜底——截痕高度到得了的地方，框也得包住
    const ext = st.m === 0 ? [a, b, c]
      : st.m === 1 ? [a * 1.803, b * 1.803, Math.max(1.5 * c, 2.45)]
      : st.m === 2 ? [a * 1.96, b * 1.96, Math.max(2.2 * c, 2.45)]
      : st.m === 3 ? [a * Math.SQRT2, b * Math.SQRT2, 2.0]
      : [hx, hy, 2.4];
    frame(cs, ext[0] * 1.04, ext[1] * 1.04, ext[2] * 1.04);
    cs.dot(v3(0, 0, 0), 2.4, { fill: inkCol(), stroke: 'none', op: 0.7 });
    cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: 14, size: 12, fill: '#8fa3bd' });
    let name = '', eq = '', slice = '', note = '', gold = null;
    const useGL = glOn && gl.ready();
    if (!useGL) gl.clear();

    // 曲面本体：立体档交给 GPU（每个曲面参数一改才重建顶点，转视角只重画）
    if (useGL) {
      gl.build(st.m + '|' + a + '|' + b + '|' + c, (add) => {
        if (st.m === 0) {
          add((u, v) => {
            const th = u * TAU, ph = v * Math.PI;
            return v3(a * Math.sin(ph) * Math.cos(th), b * Math.sin(ph) * Math.sin(th), c * Math.cos(ph));
          }, { nu: 64, nv: 32, opacity: 0.56, wu: 24, wv: 12, wireColor: '#9ad4ff', wireOpacity: 0.50, wireBack: 0.45 });
        } else if (st.m === 1) {
          add((u, v) => {
            const th = u * TAU, z = c * (v * 2 - 1) * 1.5, s = Math.sqrt(1 + (z / c) ** 2);
            return v3(a * s * Math.cos(th), b * s * Math.sin(th), z);
          }, { nu: 60, nv: 24, opacity: 0.48, wu: 20, wv: 10, wireOpacity: 0.45, wireBack: 0.32 });
        } else if (st.m === 2) {
          for (const sg of [1, -1]) {
            add((u, v) => {
              // 两叶各画到 |z| = 2.2c（半径 a·√(2.2²−1)）：再高就撑出坐标框了
              const th = u * TAU, z = sg * c * (1 + 1.2 * v);
              const s = Math.sqrt(Math.max(0, (z / c) ** 2 - 1));
              return v3(a * s * Math.cos(th), b * s * Math.sin(th), z);
            }, { nu: 60, nv: 18, opacity: 0.48, wu: 20, wv: 8, wireOpacity: 0.45, wireBack: 0.30 });
          }
        } else if (st.m === 3) {
          add((u, v) => {
            const th = u * TAU, z = 2 * v, r = Math.sqrt(z);
            return v3(a * r * Math.cos(th), b * r * Math.sin(th), z);
          }, { nu: 60, nv: 24, opacity: 0.50, wu: 20, wv: 10, up: true, wireOpacity: 0.45 });
        } else {
          // 马鞍：片开到 ±1.55 半轴，四角正好顶到坐标框的上下沿；
          // 两族直母线分色——它的 u 向、v 向参数线正是那两族母线，画成一色就看不出「族」来
          add((u, v) => {
            const x = (u * 2 - 1) * hx, y = (v * 2 - 1) * hy;
            return v3(x, y, x * y / (a * b));
          }, { nu: 40, nv: 40, wu: 16, wv: 16, opacity: 0.50, up: true,
            wireOpacity: 0.42, wireColor: '#5cadff', wireColor2: '#67e8f9' });
        }
      });
    }

    if (st.m === 0) {
      name = '椭球面';
      eq = `$\\frac{x^2}{${fz(a * a)}}+\\frac{y^2}{${fz(b * b)}}+\\frac{z^2}{${fz(c * c)}}=1$`;
      if (!useGL) {
        for (let i = 1; i <= 7; i++) {
          const z = c * (i / 4 - 1);
          const s = Math.sqrt(Math.max(0, 1 - (z / c) ** 2));
          if (s < 0.03) continue;
          cs.path(ring(z, a * s, b * s), { stroke: '#5cadff', w: 0.85, op: 0.24 });
        }
        const mer = [];
        for (let i = 0; i <= 40; i++) { const z = c * (i / 20 - 1); mer.push(v3(a * Math.sqrt(Math.max(0, 1 - (z / c) ** 2)), 0, z)); }
        cs.path(mer, { stroke: '#5cadff', w: 1.0, op: 0.45 });
        cs.path(mer.map(p => v3(-p.x, 0, p.z)), { stroke: '#5cadff', w: 1.0, op: 0.45 });
      }
      const zs = Math.max(-c, Math.min(c, st.z0));
      const s0 = Math.sqrt(Math.max(0, 1 - (zs / c) ** 2));
      gold = ring(zs, a * s0, b * s0, 64);
      slice = `$z=${fz(zs)}$ 处是椭圆，半轴 $${fz(a * s0)}$ 与 $${fz(b * s0)}$`;
      note = '三个半轴都有限，曲面封闭；任一方向截得的都是椭圆';
    } else if (st.m === 1) {
      name = '单叶双曲面';
      eq = `$\\frac{x^2}{${fz(a * a)}}+\\frac{y^2}{${fz(b * b)}}-\\frac{z^2}{${fz(c * c)}}=1$`;
      if (!useGL) {
        for (let i = -3; i <= 3; i++) {
          const z = c * i / 2;
          const s = Math.sqrt(1 + (z / c) ** 2);
          cs.path(ring(z, a * s, b * s), { stroke: '#5cadff', w: 0.85, op: 0.24 });
        }
        const mer = [];
        for (let i = -15; i <= 15; i++) { const z = c * i / 10; mer.push(v3(a * Math.sqrt(1 + (z / c) ** 2), 0, z)); }
        cs.path(mer, { stroke: '#5cadff', w: 1.0, op: 0.42 });
        cs.path(mer.map(p => v3(-p.x, 0, p.z)), { stroke: '#5cadff', w: 1.0, op: 0.42 });
      }
      cs.path(ring(0, a, b, 64), { stroke: '#c084fc', w: 1.4, op: 0.7 });
      // 截痕高度收在曲面画到的范围内：滑过头时截痕停在边缘，不要悬在空中
      const zs = Math.max(-1.5 * c, Math.min(1.5 * c, st.z0));
      const s0 = Math.sqrt(1 + (zs / c) ** 2);
      gold = ring(zs, a * s0, b * s0, 64);
      slice = Math.abs(zs - st.z0) > 1e-9
        ? `截痕高度超出曲面画到的范围，停在边缘 $z=${fz(zs)}$，半轴 $${fz(a * s0)}$`
        : `$z=${fz(zs)}$ 处是椭圆，半轴随高度增大（现为 $${fz(a * s0)}$）`;
      note = '水平截痕全是椭圆，最细的一圈在 $z=0$，曲面连通且不封闭';
    } else if (st.m === 2) {
      name = '双叶双曲面';
      eq = `$\\frac{x^2}{${fz(a * a)}}+\\frac{y^2}{${fz(b * b)}}-\\frac{z^2}{${fz(c * c)}}=-1$`;
      if (!useGL) {
        for (const sgn of [1, -1]) {
          for (let i = 0; i <= 4; i++) {
            const z = sgn * c * (1 + i * 0.3);          // 到 |z| = 2.2c，与立体档同高
            const s = Math.sqrt(Math.max(0, (z / c) ** 2 - 1));
            cs.path(ring(z, a * s, b * s), { stroke: '#5cadff', w: 0.85, op: 0.22 });
          }
          const mer = [];
          for (let i = 0; i <= 12; i++) { const z = sgn * c * (1 + i / 10); mer.push(v3(a * Math.sqrt((z / c) ** 2 - 1), 0, z)); }
          cs.path(mer, { stroke: '#5cadff', w: 1.0, op: 0.42 });
          cs.path(mer.map(p => v3(-p.x, 0, p.z)), { stroke: '#5cadff', w: 1.0, op: 0.42 });
        }
      }
      const zs = Math.max(-2.2 * c, Math.min(2.2 * c, st.z0));
      if (Math.abs(zs) <= c) {
        slice = '该高度落在两叶之间的空隙里，没有截痕';
        note = '曲面分成上下两叶，$|z|<c$ 的部分是空的';
      } else {
        const s0 = Math.sqrt((zs / c) ** 2 - 1);
        gold = ring(zs, a * s0, b * s0, 64);
        slice = Math.abs(zs - st.z0) > 1e-9
          ? `截痕高度超出曲面画到的范围，停在边缘 $z=${fz(zs)}$，半轴 $${fz(a * s0)}$`
          : `$z=${fz(zs)}$ 处是椭圆，半轴 $${fz(a * s0)}$`;
        note = '曲面分成上下两叶，$|z|<c$ 的部分是空的';
      }
    } else if (st.m === 3) {
      name = '椭圆抛物面';
      eq = `$z=\\frac{x^2}{${fz(a * a)}}+\\frac{y^2}{${fz(b * b)}}$`;
      if (!useGL) {
        for (let i = 1; i <= 5; i++) {
          const z = 2.0 * i / 5;
          cs.path(ring(z, a * Math.sqrt(z), b * Math.sqrt(z)), { stroke: '#5cadff', w: 0.85, op: 0.24 });
        }
        for (const sg of [1, -1]) {
          const mer = [];
          for (let i = 0; i <= 24; i++) { const z = 2.0 * i / 24; mer.push(v3(sg * a * Math.sqrt(z), 0, z)); }
          cs.path(mer, { stroke: '#5cadff', w: 1.0, op: 0.45 });
        }
      }
      const zs = Math.max(0.05, Math.min(2.0, st.z0));
      gold = ring(zs, a * Math.sqrt(zs), b * Math.sqrt(zs), 64);
      slice = `$z=${fz(zs)}$ 处是椭圆，半轴 $${fz(a * Math.sqrt(zs))}$`;
      note = '顶点在原点，开口朝上；竖直截痕是抛物线';
    } else {
      name = '双曲抛物面';
      eq = `$z=\\frac{xy}{${fz(a * b)}}$`;
      const k = 1 / (a * b);
      if (!useGL) {
        for (let i = -3; i <= 3; i++) {
          const p1 = [], p2 = [];
          for (let j = 0; j <= 16; j++) {          // y = i/3·b 的一条母线
            const x = (j / 8 - 1) * hx, y = i / 3 * hy;
            p1.push(v3(x, y, k * x * y));
          }
          for (let j = 0; j <= 16; j++) {          // x = i/3·a 的一条母线
            const y = (j / 8 - 1) * hy, x = i / 3 * hx;
            p2.push(v3(x, y, k * x * y));
          }
          cs.path(p1, { stroke: '#5cadff', w: 0.85, op: 0.32 });
          cs.path(p2, { stroke: '#67e8f9', w: 0.85, op: 0.32 });
        }
      }
      // 面上两条抛物线：竖直面 y = ±(b/a)x 截出来的，从片的一角穿原点到对角，一条开口朝上、
      // 一条朝下，马鞍「一头升一头降」就由它们给出。这一档不画金色截痕
      const ky = hy / hx;
      const par = sgn => {
        const p = [];
        for (let i = 0; i <= 48; i++) {
          const x = (i / 24 - 1) * hx, y = sgn * ky * x;
          p.push(v3(x, y, k * x * y));
        }
        return p;
      };
      cs.path(par(1), { stroke: '#4ade80', w: 1.9, op: 0.95 });
      cs.path(par(-1), { stroke: '#4ade80', w: 1.9, op: 0.95 });
      slice = '两个竖直截痕是一对开口相反的抛物线';
      note = '两族直母线都落在曲面上，形状像马鞍';
    }

    if (gold) cs.path(gold, { stroke: '#4ade80', w: 1.9, op: 0.95 });
    cN(name);
    cE(eq);
    cS(slice);
    cJ(note);
    cs.flush();
    gl.draw();
  };

  const update = () => B.render();
  const sA = B.slider('半轴 a', 0.8, 2.2, 0.05, st.a, v => { st.a = v; update(); }, 'qa');
  const sB = B.slider('半轴 b', 0.6, 1.8, 0.05, st.b, v => { st.b = v; update(); }, 'qb');
  const sC = B.slider('半轴 c', 0.5, 1.6, 0.05, st.c, v => { st.c = v; update(); }, 'qc');
  const sZ = B.slider('截痕高度 z₀', -2.4, 2.4, 0.05, st.z0, v => { st.z0 = v; update(); }, 'qz');

  const modes = ['① 椭球', '② 单叶双曲面', '③ 双叶双曲面', '④ 椭圆抛物面', '⑤ 双曲抛物面'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    // 马鞍档不按高度切，截痕高度这一枚跟着收起来（其余四档都靠它）
    if (sZ.parentNode) sZ.parentNode.style.display = i === 4 ? 'none' : '';
    B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });
  // 立体档与老线网可以来回切：环境不支持 WebGL 时这枚开关点了也不变样子
  B.toggleBtn('曲面实体', true, on => { glOn = on; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('绿色截痕随滑块移动；马鞍档画的是两条过原点的抛物线。按住画板拖动是换视角，曲面拖不走');
  B.render();
  return B;
}
