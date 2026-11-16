/* 图 体2 · 旋转体机
   四档：① 圆柱 ② 圆锥 ③ 圆台 ④ 球。
   曲面用一圈细窄条铺成并带透明，轴与母线虚线辅助；拖动画面旋转视角，r / h / r₂ 三个滑块实时改形。
   ④ 球的经纬线可以切成虚线，看清球心与半径。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3, add3 } from '../../../lib/solid3d.js';

const N = 40;                     // 圆环分段数
const X = v3(1, 0, 0), Y = v3(0, 1, 0);

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 215, s: 90, cz: 1.0 });
  const st = { mode: 0, r: 1.2, h: 1.8, r2: 0.7, dash: false };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('半径'), cB = B.chipM('上底半径'), cC = B.chipM('高'), cD = B.chipM('母线'), cE = B.chipM('判读');

  const ring = (z, rad) => circle3(v3(0, 0, z), X, Y, rad, N);

  /* 一圈竖条围成的曲面：z1 处半径 r1、z2 处半径 r2；r2=0 时收成锥面 */
  const band = (cs, z1, r1, z2, r2, col) => {
    const A = ring(z1, r1);
    if (r2 < 1e-6) {
      const ap = v3(0, 0, z2);
      for (let i = 0; i < N; i++) cs.poly([A[i], A[(i + 1) % N], ap], { fill: col, op: 0.055 });
      return;
    }
    const Bn = ring(z2, r2);
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      cs.poly([A[i], A[j], Bn[j], Bn[i]], { fill: col, op: 0.055 });
    }
  };

  const disk = (cs, z, rad, col) =>
    cs.poly(ring(z, rad), { fill: col, op: 0.15, stroke: col, w: 1.3, lineOp: 0.85 });

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const { r, h, r2 } = st;
    const mode = st.mode;
    cam.cz = mode === 3 ? 0 : h / 2;

    if (mode === 3) {
      // 球：轮廓圆 + 经纬线
      const R = r;
      cs.dot(v3(0, 0, 0), R * cam.s, { fill: '#5cadff', op: 0.07, stroke: '#5cadff', w: 1.4 });
      const dsh = st.dash ? '5 4' : undefined;
      for (const t of [-60, -30, 0, 30, 60]) {
        const z = R * Math.sin(t * Math.PI / 180), rr = R * Math.cos(t * Math.PI / 180);
        cs.path(ring(z, rr), { stroke: '#5cadff', w: 1.1, op: 0.55, dash: dsh });
      }
      for (let k = 0; k < 6; k++) {
        const a = k / 6 * Math.PI;
        const e1 = v3(Math.cos(a), Math.sin(a), 0), e2 = v3(0, 0, 1);
        cs.path(circle3(v3(0, 0, 0), e1, e2, R, N), { stroke: '#5cadff', w: 1.1, op: 0.4, dash: dsh });
      }
      cs.path([v3(0, 0, -R), v3(0, 0, R)], { stroke: '#8fa3bd', w: 1.2, op: 0.8, dash: '6 5' });
      cs.label(v3(0, 0, R), 'R', { dx: 12, dy: 4, size: 13, fill: '#ffd166' });
      cA(`$R=${fz(R)}$`);
      cB('—');
      cC(`$${fz(2 * R)}$`);
      cD('—');
      cE('球面上任一点到球心的距离都是 R');
      cs.flush();
      return;
    }

    const cone = mode === 1, frustum = mode === 2;
    const rt = frustum ? Math.min(r2, r * 1.05) : (cone ? 0 : r);
    // 轴
    cs.path([v3(0, 0, -0.35), v3(0, 0, h + 0.35)], { stroke: '#8fa3bd', w: 1.2, op: 0.75, dash: '6 5' });
    // 侧面
    band(cs, 0, r, h, rt, '#5cadff');
    // 上下底
    disk(cs, 0, r, '#ffd166');
    if (!cone) disk(cs, h, rt, '#4ade80');
    // 圈边
    cs.path(ring(0, r), { stroke: '#ffd166', w: 1.6, op: 0.9 });
    if (!cone) cs.path(ring(h, rt), { stroke: '#4ade80', w: 1.6, op: 0.9 });
    // 母线（正前方那条，加粗另标）
    const p0 = v3(r, 0, 0), p1 = cone ? v3(0, 0, h) : v3(rt, 0, h);
    cs.line(p0, p1, { stroke: '#ff9e4a', w: 2.2, op: 1 });
    cs.dot(p0, 4, { fill: '#ff9e4a' });
    cs.dot(p1, 4, { fill: '#ff9e4a' });
    cs.label(add3(p0, v3(0, 0, 0)), 'r', { dx: 14, dy: 8, size: 12.5, fill: '#ffd166' });
    cs.label(v3(0, 0, h), 'h', { dx: 13, dy: 0, size: 12.5, fill: '#8fa3bd' });
    const mid = v3((p0.x + p1.x) / 2, 0, h / 2);
    cs.label(mid, 'l', { dx: 12, dy: -2, size: 12.5, fill: '#ff9e4a' });

    const l = cone ? Math.hypot(h, r) : (frustum ? Math.hypot(h, Math.abs(r - rt)) : h);
    cA(`$r=${fz(r)}$`);
    cB(frustum ? `$r_2=${fz(rt)}$` : '—');
    cC(`$h=${fz(h)}$`);
    cD(`$l=${fz(l)}$`);
    cE(cone ? '母线是顶点到底面圆周的连线，三个量满足 l²=h²+r²'
      : frustum ? '两底半径不同，母线倾斜；两底半径相等时退化为圆柱'
        : '母线垂直于两底，母线长就等于高');
    cs.flush();
  };

  const btnNames = ['① 圆柱', '② 圆锥', '③ 圆台', '④ 球'];
  const btns = btnNames.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  let sr, sh, sr2, bDash;
  const par = e => e && (e.parentNode || e.parent);
  const setMode = i => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    if (par(sr)) par(sr).style.display = '';
    if (par(sh)) par(sh).style.display = i === 3 ? 'none' : '';
    if (par(sr2)) par(sr2).style.display = i === 2 ? '' : 'none';
    // 按钮直接挂在控制行里，隐藏只改按钮自己；滑块是 input，父节点才是它自己的 label 壳
    if (bDash) bDash.style.display = i === 3 ? '' : 'none';
    B.render();
  };
  sr = B.slider('半径 r', 0.6, 2.0, 0.05, st.r, v => { st.r = v; B.render(); }, 'r');
  sh = B.slider('高 h', 0.8, 2.8, 0.05, st.h, v => { st.h = v; B.render(); }, 'h');
  sr2 = B.slider('上底半径 r₂', 0.1, 1.6, 0.05, st.r2, v => { st.r2 = v; B.render(); }, 'r2');
  bDash = B.btn('经纬线：实线', () => {
    st.dash = !st.dash;
    bDash.textContent = st.dash ? '经纬线：虚线' : '经纬线：实线';
    bDash.classList.toggle('on', st.dash);
    B.render();
  });
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，看上下两个底面变成什么形状');
  setMode(0);
  return B;
}
