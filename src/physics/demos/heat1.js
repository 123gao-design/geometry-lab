/* 热1 分子动理论：盒子里的一群分子与速率分布，另加一档布朗运动。
   分子做匀速直线运动、与器壁弹性碰撞（理想气体近似，分子之间不计碰撞）。
   速率按麦克斯韦分布抽样，右栏画出分布曲线与模拟出来的直方图；
   温度一改，整批速率按 √T 缩放，曲线也随之展宽、峰位右移。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const KB = 1.38e-23;
const MOL = 4.65e-26; // 氮分子质量
const VSCALE = 0.26; // 每 (m/s) 对应多少像素/秒
const R = 2.2; // 分子半径（像素）
const BIGM = 60; // 大颗粒与小分子的质量比

function gauss() {
  let u = 0;
  let v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function create(st) {
  let last = '';
  let t = 0;
  let parts = [];
  let big = null;
  let trail = [];
  let hist = [];
  let tPrev = 300;

  const spawn = (mode, T) => {
    parts = [];
    t = 0;
    trail = [];
    hist = [];
    big = null;
    const sig = Math.sqrt((KB * T) / MOL) * VSCALE;
    const n = mode === 'brown' ? 110 : 90;
    for (let i = 0; i < n; i++) {
      parts.push({
        x: 0,
        y: 0,
        vx: gauss() * sig,
        vy: gauss() * sig,
      });
    }
    if (mode === 'brown') big = { x: 0, y: 0, vx: 0, vy: 0, r: 15 };
  };

  const place = (w, h) => {
    const bx0 = w * 0.04;
    const bx1 = w * 0.5;
    const by0 = h * 0.1;
    const by1 = h * 0.9;
    for (const p of parts) {
      if (p.x < bx0 + R || p.x > bx1 - R) p.x = bx0 + R + Math.random() * Math.max(bx1 - bx0 - 2 * R, 1);
      if (p.y < by0 + R || p.y > by1 - R) p.y = by0 + R + Math.random() * Math.max(by1 - by0 - 2 * R, 1);
    }
    if (big && (big.x === 0 || big.x < bx0 + big.r || big.x > bx1 - big.r || big.y === 0)) {
      big.x = (bx0 + bx1) / 2;
      big.y = (by0 + by1) / 2;
    }
  };

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'brown' ? 'brown' : 'thermal';
    const T = clamp(nn(q.T, 300), 100, 800);

    const key = [mode, T].join('|');
    if (key !== last) {
      const modeChanged = !last || last.split('|')[0] !== mode;
      if (modeChanged) spawn(mode, T);
      else {
        const f = Math.sqrt(T / tPrev);
        for (const p of parts) {
          p.vx *= f;
          p.vy *= f;
        }
        if (big) {
          big.vx *= f;
          big.vy *= f;
        }
      }
      last = key;
      tPrev = T;
      t = 0;
      trail = [];
      hist = [];
    }

    const bx0 = w * 0.04;
    const bx1 = w * 0.5;
    const by0 = h * 0.1;
    const by1 = h * 0.9;
    place(w, h);

    if (dt > 0) {
      t += dt;
      for (const p of parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < bx0 + R) {
          p.x = bx0 + R;
          p.vx = Math.abs(p.vx);
        } else if (p.x > bx1 - R) {
          p.x = bx1 - R;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < by0 + R) {
          p.y = by0 + R;
          p.vy = Math.abs(p.vy);
        } else if (p.y > by1 - R) {
          p.y = by1 - R;
          p.vy = -Math.abs(p.vy);
        }
        // 与布朗颗粒的碰撞
        if (big) {
          const dx = p.x - big.x;
          const dy = p.y - big.y;
          const dist = Math.hypot(dx, dy);
          const rr = big.r + R;
          if (dist > 0 && dist < rr) {
            const nx = dx / dist;
            const ny = dy / dist;
            const vn = p.vx * nx + p.vy * ny;
            if (vn < 0) {
              p.vx -= 2 * vn * nx;
              p.vy -= 2 * vn * ny;
              big.vx += (2 * vn * nx) / BIGM;
              big.vy += (2 * vn * ny) / BIGM;
            }
            const push = rr - dist + 0.5;
            p.x += nx * push;
            p.y += ny * push;
          }
        }
      }
      if (big) {
        const dr = Math.exp(-1.6 * dt);
        big.vx *= dr;
        big.vy *= dr;
        big.x += big.vx * dt;
        big.y += big.vy * dt;
        if (big.x < bx0 + big.r) {
          big.x = bx0 + big.r;
          big.vx = Math.abs(big.vx) * 0.5;
        }
        if (big.x > bx1 - big.r) {
          big.x = bx1 - big.r;
          big.vx = -Math.abs(big.vx) * 0.5;
        }
        if (big.y < by0 + big.r) {
          big.y = by0 + big.r;
          big.vy = Math.abs(big.vy) * 0.5;
        }
        if (big.y > by1 - big.r) {
          big.y = by1 - big.r;
          big.vy = -Math.abs(big.vy) * 0.5;
        }
        trail.push({ x: big.x, y: big.y, t });
        while (trail.length > 2 && trail[0].t < t - 5) trail.shift();
        hist.push({ x: big.x, y: big.y, t });
        while (hist.length > 2 && hist[0].t < t - 12) hist.shift();
      }
    }

    ctx.clearRect(0, 0, w, h);

    // 盒子
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2.4;
    ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);

    // 分子：快的橙色、慢的蓝色
    const sig = Math.sqrt((KB * T) / MOL) * VSCALE;
    for (const p of parts) {
      const sp = Math.hypot(p.vx, p.vy);
      ctx.fillStyle = sp > 1.9 * sig ? pal.orange : pal.blue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
      ctx.fill();
    }

    // 布朗颗粒与轨迹
    if (big) {
      if (trail.length > 1) {
        poly(
          ctx,
          x => x,
          y => y,
          trail.map(p => [p.x, p.y]),
          pal.faint,
          1.4,
        );
      }
      spot(ctx, big.x, big.y, big.r, pal.green, pal.ink);
      label(ctx, '悬浮颗粒', big.x, big.y - big.r - 8, pal.green, 'center', 13);
    }
    label(ctx, mode === 'brown' ? '大量分子撞击悬浮颗粒' : '分子做无规则运动', bx0, by1 + 20, pal.faint, 'left', 13);

    // 三个特征速率：两档读数都要用
    const vp = Math.sqrt((2 * KB * T) / MOL);
    const vmean = Math.sqrt((8 * KB * T) / (Math.PI * MOL));
    const vrms = Math.sqrt((3 * KB * T) / MOL);

    /* 右栏（布朗档）：悬浮颗粒的横、纵位移随时间的变化。
       速率分布那张图属于分子，颗粒的运动要看它在两个方向上怎样漂移，
       所以这一档不画分布，改画它的位移—时间曲线。 */
    if (mode === 'brown') {
      const SPAN = 12; // 滚动窗口，秒
      const UM = 20 / (bx1 - bx0); // 盒子宽记作 20 μm
      const xc = (bx0 + bx1) / 2;
      const yc = (by0 + by1) / 2;
      const half = 1.05 * ((UM * Math.max(bx1 - bx0, by1 - by0)) / 2);
      const gp = { x: w * 0.57, y: h * 0.14, w: w * 0.39, h: h * 0.72 };
      const ta = Math.max(0, t - SPAN);
      const Pg = panel(ctx, gp, [ta, ta + SPAN], [-half, half], pal,
        { xlab: 't / s', ylab: '位移/μm', nx: 4, ny: 6 });
      const cx1 = [];
      const cy1 = [];
      for (const s of hist) {
        cx1.push([s.t, (s.x - xc) * UM]);
        cy1.push([s.t, (s.y - yc) * UM]);
      }
      poly(ctx, Pg.X, Pg.Y, cx1, pal.green, 2);
      poly(ctx, Pg.X, Pg.Y, cy1, pal.cyan, 2);
      if (big) {
        spot(ctx, Pg.X(t), Pg.Y((big.x - xc) * UM), 4, pal.green, pal.bg2);
        spot(ctx, Pg.X(t), Pg.Y((big.y - yc) * UM), 4, pal.cyan, pal.bg2);
      }
      // 纵轴名占着框内左上角，图例从它下面一行起
      label(ctx, '绿 横向 · 蓝 纵向', gp.x + 8, gp.y + 34, pal.mut, 'left', 13);
      label(ctx, '两条线都在零线附近来回，没有周期', gp.x + 8, gp.y + 54, pal.faint, 'left', 13);

      st.readout([
        ['温度 T', fmt(T, 0) + ' K'],
        ['分子平均速率', fmt(vmean, 0) + ' m/s'],
        ['悬浮颗粒速率', fmt(Math.hypot(big.vx, big.vy) / VSCALE, 0) + ' m/s'],
        ['颗粒位移 横向 / 纵向', fmt((big.x - xc) * UM, 1) + ' / ' + fmt((big.y - yc) * UM, 1) + ' μm'],
        ['观测时间', fmt(t, 1) + ' s'],
      ]);
      return;
    }

    /* 右栏（热运动档）：速率分布 */
    // 坐标轴按 T 的两端固定：横轴到 800 K 的最概然速率的 3.2 倍，纵轴到 100 K 的峰高。
    // 若跟着当前 T 现算，整条曲线在框里的位置永远不动，拖温度看不出「右移变宽变矮」。
    const vmax = 3.2 * Math.sqrt((2 * KB * 800) / MOL);
    const fdT = (v, Temp) => {
      const c = 4 * Math.PI * (MOL / (2 * Math.PI * KB * Temp)) ** 1.5;
      return c * v * v * Math.exp((-MOL * v * v) / (2 * KB * Temp));
    };
    const fd = v => fdT(v, T);
    const fmax = fdT(Math.sqrt((2 * KB * 100) / MOL), 100) * 1.08;
    const g = { x: w * 0.57, y: h * 0.14, w: w * 0.39, h: h * 0.72 };
    const P = panel(ctx, g, [0, vmax], [0, fmax], pal, { xlab: 'v / (m/s)', ylab: '占比' });

    // 直方图：把模拟出来的速率按 16 档统计
    const NB = 16;
    const cnt = new Array(NB).fill(0);
    for (const p of parts) {
      const sp = Math.hypot(p.vx, p.vy) / VSCALE;
      const i = Math.floor((sp / vmax) * NB);
      if (i >= 0 && i < NB) cnt[i]++;
    }
    const bw = vmax / NB;
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < NB; i++) {
      if (!cnt[i]) continue;
      const dens = cnt[i] / (parts.length * bw);
      const yy = P.Y(dens);
      ctx.fillRect(P.X(i * bw), yy, P.X((i + 1) * bw) - P.X(i * bw) - 1, P.Y(0) - yy);
    }
    ctx.globalAlpha = 1;

    const cur = [];
    for (let i = 0; i <= 200; i++) {
      const v = (vmax * i) / 200;
      cur.push([v, fd(v)]);
    }
    poly(ctx, P.X, P.Y, cur, pal.orange, 2.2);

    // 最概然速率
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(P.X(vp), P.Y(0));
    ctx.lineTo(P.X(vp), P.Y(fd(vp)));
    ctx.stroke();
    ctx.restore();
    label(ctx, 'v最概然', P.X(vp) + 6, P.Y(fd(vp)) - 6, pal.purple, 'left', 13);

    st.readout([
      ['温度 T', fmt(T, 0) + ' K'],
      ['最概然速率', fmt(vp, 0) + ' m/s'],
      ['平均速率', fmt(vmean, 0) + ' m/s'],
      ['方均根速率', fmt(vrms, 0) + ' m/s'],
    ]);
  }

  return {
    frame,
    reset: () => {
      last = '';
    },
  };
}
