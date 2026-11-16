/* 图 位1d · 面面平行与面面垂直的判定（两块平面的图示）
   ① 面面平行：两个平面各画两条相交直线，α 内的 a、b 与 β 内的 a′、b′ 两两平行。
   ② 面面垂直：竖直平面 β 过水平平面 α 的一条垂线 a，两平面的交线 l 上用直角标记点明垂直。
   换档看「一个平面靠什么去担保它与另一个平面的关系」。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, rightMark3, orbit } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 800, H = 430;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 212, s: 88, yaw: 0.85, pitch: 0.55, cz: 0.95 });
  const st = { mode: 0 };
  const cA = B.chipM('条件'), cB = B.chipM('交线'), cC = B.chipM('结论'), cD = B.chipM('判读');

  const alphaPlane = cs => cs.poly(
    [v3(-2.4, -1.6, 0), v3(2.4, -1.6, 0), v3(2.4, 1.6, 0), v3(-2.4, 1.6, 0)],
    { fill: '#5cadff', op: 0.14, stroke: '#5cadff', w: 1.3, lineOp: 0.6 });

  B.renderFn = () => {
    const cs = new Scene(B, cam);

    if (st.mode === 0) {
      cam.cz = 0.9;
      cam.s = 86;
      alphaPlane(cs);
      // β：与 α 平行的另一块平面
      cs.poly([v3(-2.4, -1.6, 1.7), v3(2.4, -1.6, 1.7), v3(2.4, 1.6, 1.7), v3(-2.4, 1.6, 1.7)],
        { fill: '#4ade80', op: 0.12, stroke: '#4ade80', w: 1.3, lineOp: 0.55 });

      // α 内两条相交直线 a、b；β 内与它们分别平行的 a′、b′
      cs.line(v3(-1.5, 0, 0.002), v3(1.5, 0, 0.002), { stroke: '#ff9e4a', w: 2.3, op: 1 });
      cs.line(v3(0, -1.2, 0.002), v3(0, 1.2, 0.002), { stroke: '#c084fc', w: 2.3, op: 1 });
      cs.line(v3(-1.5, 0, 1.702), v3(1.5, 0, 1.702), { stroke: '#ff9e4a', w: 2.0, op: 0.9 });
      cs.line(v3(0, -1.2, 1.702), v3(0, 1.2, 1.702), { stroke: '#c084fc', w: 2.0, op: 0.9 });
      cs.dot(v3(0, 0, 0.002), 3.6, { fill: '#ff9e4a' });
      cs.dot(v3(0, 0, 1.702), 3.6, { fill: '#ff9e4a' });

      cs.label(v3(1.5, 0, 0.002), 'a', { dx: 11, dy: 8, size: 14, fill: '#ff9e4a' });
      cs.label(v3(0, 1.2, 0.002), 'b', { dx: 10, dy: 12, size: 14, fill: '#c084fc' });
      cs.label(v3(1.5, 0, 1.702), 'a′', { dx: 13, dy: 4, size: 14, fill: '#ff9e4a' });
      cs.label(v3(0, 1.2, 1.702), 'b′', { dx: 11, dy: 10, size: 14, fill: '#c084fc' });
      cs.label(v3(-2.2, -1.45, 0), 'α', { dx: 10, dy: 6, size: 14, fill: '#5cadff' });
      cs.label(v3(-2.2, 1.45, 1.7), 'β', { dx: 10, dy: -4, size: 14, fill: '#4ade80' });

      cA('$a\\parallel a\'$，$b\\parallel b\'$');
      cB('$a\\cap b=P$');
      cC('$\\alpha\\parallel\\beta$');
      cD('两条相交直线缺一不可');
    } else {
      cam.cz = 0.85;
      cam.s = 88;
      alphaPlane(cs);
      // β：竖直平面 y=0，含 α 的垂线 a
      cs.poly([v3(-2.2, 0, 0), v3(2.2, 0, 0), v3(2.2, 0, 2.0), v3(-2.2, 0, 2.0)],
        { fill: '#c084fc', op: 0.16, stroke: '#c084fc', w: 1.3, lineOp: 0.6 });

      const O = v3(0, 0, 0);
      cs.line(v3(-2.2, 0, 0.002), v3(2.2, 0, 0.002), { stroke: '#ffd166', w: 2.2, op: 1 });
      cs.line(O, v3(0, 0, 2.0), { stroke: '#ffd166', w: 2.6, op: 1 });
      rightMark3(cs, O, v3(0, 0, 1), v3(1.4, 0, 0), 0.26, { stroke: '#ffd166' });

      cs.label(v3(2.2, 0, 0.002), 'l', { dx: 12, dy: 6, size: 14, fill: '#ffd166' });
      cs.label(v3(0, 0, 2.0), 'a', { dx: 14, dy: -2, size: 14, fill: '#ffd166' });
      cs.label(v3(-2.1, -1.4, 0), 'α', { dx: 8, dy: 12, size: 14, fill: '#5cadff' });
      cs.label(v3(1.9, 0, 1.75), 'β', { dx: 12, dy: -2, size: 14, fill: '#c084fc' });

      cA('$a\\subset\\beta$，$a\\perp\\alpha$');
      cB('$l=\\alpha\\cap\\beta$');
      cC('$\\alpha\\perp\\beta$');
      cD('平面 β 过 α 的一条垂线');
    }
    cs.flush();
  };

  const names = ['① 面面平行', '② 面面垂直'];
  const btns = names.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  };
  B.btn('重置视角', () => { cam.yaw = 0.85; cam.pitch = 0.55; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转：平行看两面的间距，垂直看 a 与 α 的直角');
  setMode(0);
  return B;
}
