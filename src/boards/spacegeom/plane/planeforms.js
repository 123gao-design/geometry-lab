/* 图 面1 · 平面方程与法向量机
   三档共用一块画板：① 点法式（法向量方向角 θ、φ 与距离 d 三个滑块）；② 三点定平面（三点的高度可调，
   法向量由 AB×AC 现算）；③ 一般式（A、B、C、D 四滑块）。平面一律用 planePoly 与立方体求交，
   法向量从「原点到平面的垂足」画出，四处直角标记说明垂足与法线的关系。 */
import { Board } from '../../../lib/board.js';
import { v3, add3, mul3, len3, dot3, cross3, unit3, sub3, makeCam, Scene, arrow3, rightMark3, orbit, planePoly } from '../../../lib/solid3d.js';

const L = 3.2;

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 248, s: 66 });
  const st = { m: 0, th: 52, ph: 38, pd: 1.5, za: 0.9, zb: 1.7, zc: 1.2, ca: 1, cb: 1, cc: 1, cd: -1.4 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cEq = B.chipM('方程'), cN = B.chipM('法向量 n'), cD = B.chipM('原点到平面'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.34), to, { stroke: col, w: 1.1, op: 0.8 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.9 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, l = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / l * 18, dy: dy / l * 18 + 4, size: 13, fill: col });
  };

  // 把系数按 Ax+By+Cz+D=0 排成一串，零项与系数 1 按习惯省略
  const eqStr = (a, b, c, d) => {
    let s = '';
    const add = (v, sym) => {
      if (Math.abs(v) < 5e-3) return;
      const av = Math.abs(v);
      const co = Math.abs(av - 1) < 5e-3 ? '' : fz(av);
      if (!s) s = (v < 0 ? '-' : '') + co + sym;
      else s += (v > 0 ? '+' : '-') + co + sym;
    };
    add(a, 'x'); add(b, 'y'); add(c, 'z'); add(d, '');
    return s + '=0';
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0;
    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: 14, size: 13, fill: '#8fa3bd' });

    let n = v3(1, 1, 1), Dp = -1.4, eqTxt = '', judge = '', mark = null, fixed = null;

    if (st.m === 0) {
      const th = st.th * Math.PI / 180, ph = st.ph * Math.PI / 180;
      n = v3(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th));
      Dp = -st.pd;
      fixed = mul3(n, st.pd);
      eqTxt = eqStr(n.x, n.y, n.z, Dp);
      judge = `过定点 P₀ 且法向量固定，平面唯一；d 变化时平面沿法线平移`;
    } else if (st.m === 1) {
      const A = v3(1.8, -0.9, st.za), Bp = v3(-1.3, 1.5, st.zb), C = v3(0.2, 1.3, st.zc);
      const ab = sub3(Bp, A), ac = sub3(C, A);
      const cr = cross3(ab, ac);
      if (len3(cr) < 1e-6) {
        n = cr; Dp = 0;
        eqTxt = '三点共线，没有确定的平面';
        judge = 'A、B、C 三点共线，平面不唯一（或不存在）';
      } else {
        n = cr; Dp = -dot3(cr, A);
        eqTxt = eqStr(n.x, n.y, n.z, Dp);
        judge = `n = AB×AC，过 A 的平面由三点唯一确定`;
      }
      mark = [A, Bp, C];
      cs.path([A, Bp], { stroke: '#4ade80', w: 1.4, op: 0.85 });
      cs.path([A, C], { stroke: '#4ade80', w: 1.4, op: 0.85 });
    } else {
      const na = st.ca, nb = st.cb, nc = st.cc;
      n = v3(na, nb, nc); Dp = st.cd;
      if (len3(n) < 1e-6) {
        eqTxt = 'A=B=C=0 不是平面'; judge = '三个一次项系数全为零，方程不是平面';
      } else {
        eqTxt = eqStr(na, nb, nc, st.cd);
        judge = Math.abs(st.cd) < 5e-3 ? 'D=0，平面经过原点' : 'A、B、C 即法向量的三个分量';
      }
    }

    const nl = len3(n);
    if (nl > 1e-9) {
      const poly = planePoly(n.x, n.y, n.z, Dp, L);
      if (poly.length >= 3) {
        cs.poly(poly, { fill: '#5cadff', op: 0.16, stroke: '#5cadff', w: 1.7, lineOp: 0.85 });
        for (let i = 1; i < 4; i++) {
          const q = poly[i % poly.length];
          cs.line(poly[0], q, { stroke: '#5cadff', w: 0.7, op: 0.18 });
        }
      }
      const un = mul3(n, 1 / nl);
      const foot = mul3(n, -Dp / (nl * nl));
      const tip = add3(foot, mul3(un, 1.15));
      const dir = arrow3(cs, foot, tip, { stroke: '#c084fc', w: 2.2 });
      cs.label(tip, 'n', { dx: dir.ux * 18, dy: dir.uy * 18 + 5, size: 14, fill: '#c084fc' });
      cs.dot(foot, 3.6, { fill: '#c084fc' });
      if (Math.abs(Dp / nl) > 0.25) rightMark3(cs, foot, v3(0, 0, 0), tip, 0.17, { stroke: '#ffd166', op: 0.85 });
      if (fixed) {
        cs.dot(fixed, 4.4, { fill: '#ff9e4a' });
        cs.label(fixed, 'P', { dx: 14, dy: -8, size: 13, fill: '#ff9e4a' });
      }
      cD(`$\\frac{|D|}{|\\vec n|}=${fz(Math.abs(Dp) / nl)}$`);
    } else {
      cD('—');
    }

    if (mark) {
      const lab = ['A', 'B', 'C'];
      mark.forEach((p, i) => {
        cs.dot(p, 4.4, { fill: '#4ade80' });
        cs.label(p, lab[i], { dx: i === 1 ? 14 : -14, dy: -8, size: 13, fill: '#4ade80' });
      });
    }

    cEq('$' + eqTxt + '$');
    cN(nl > 1e-9 ? `$(${fz(n.x)},\\ ${fz(n.y)},\\ ${fz(n.z)})$` : '$\\vec 0$');
    cJ(judge);
    cs.flush();
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const upd = () => B.render();
  const sTh = B.slider('方向角 θ°', 10, 70, 1, st.th, v => { st.th = v; upd(v); }, 'th');
  const sPh = B.slider('方位角 φ°', 0, 330, 5, st.ph, v => { st.ph = v; upd(v); }, 'ph');
  const sPd = B.slider('距离 d', 0.6, 2.2, 0.05, st.pd, v => { st.pd = v; upd(v); }, 'pd');
  const sZa = B.slider('A 的高 z_A', 0, 2.2, 0.05, st.za, v => { st.za = v; upd(v); }, 'za');
  const sZb = B.slider('B 的高 z_B', 0, 2.2, 0.05, st.zb, v => { st.zb = v; upd(v); }, 'zb');
  const sZc = B.slider('C 的高 z_C', 0, 2.2, 0.05, st.zc, v => { st.zc = v; upd(v); }, 'zc');
  const sCa = B.slider('系数 A', -1.5, 1.5, 0.05, st.ca, v => { st.ca = v; upd(v); }, 'ca');
  const sCb = B.slider('系数 B', -1.5, 1.5, 0.05, st.cb, v => { st.cb = v; upd(v); }, 'cb');
  const sCc = B.slider('系数 C', -1.5, 1.5, 0.05, st.cc, v => { st.cc = v; upd(v); }, 'cc');
  const sCd = B.slider('常数 D', -2.2, 2.2, 0.05, st.cd, v => { st.cd = v; upd(v); }, 'cd');

  const sliders = [sTh, sPh, sPd, sZa, sZb, sZc, sCa, sCb, sCc, sCd];
  const layout = m => {
    sliders.forEach((s, j) => show(s, (m === 0 && j < 3) || (m === 1 && j >= 3 && j < 6) || (m === 2 && j >= 6)));
  };

  const modes = ['① 点法式', '② 三点定平面', '③ 一般式'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    layout(i); B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  layout(0);
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，紫色法向量始终垂直于蓝色平面');
  B.render();
  return B;
}
