/* 图 位1c · 线面垂直的判定（平面与直线的图示）
   平面 α 内画两条相交于 P 的直线 m、n，直线 l 过 P 且同时垂直于两者，两处直角标记各画一个。
   两条直线「相交」这个条件用 P 点标出来，漏掉它判定定理就不成立。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, rightMark3, orbit } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 800, H = 430;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 203, s: 96, yaw: 0.85, pitch: 0.55, cz: 0.75 });
  const cA = B.chipM('条件'), cB = B.chipM('垂直'), cC = B.chipM('结论'), cD = B.chipM('判读');

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0.75;
    const P = v3(0, 0, 0);

    // 平面 α
    cs.poly([v3(-2.4, -1.6, 0), v3(2.4, -1.6, 0), v3(2.4, 1.6, 0), v3(-2.4, 1.6, 0)],
      { fill: '#5cadff', op: 0.14, stroke: '#5cadff', w: 1.3, lineOp: 0.6 });

    const M1 = v3(-1.7, 0, 0.002), M2 = v3(1.7, 0, 0.002);
    const N1 = v3(0, -1.3, 0.002), N2 = v3(0, 1.3, 0.002);
    const UP = v3(0, 0, 2.0);
    cs.line(M1, M2, { stroke: '#4ade80', w: 2.4, op: 1 });
    cs.line(N1, N2, { stroke: '#c084fc', w: 2.4, op: 1 });
    cs.line(v3(0, 0, -0.5), UP, { stroke: '#ffd166', w: 2.6, op: 1 });
    rightMark3(cs, P, UP, M2, 0.26, { stroke: '#ffd166' });
    rightMark3(cs, P, UP, N2, 0.26, { stroke: '#ffd166' });

    cs.dot(P, 4, { fill: '#fff' });
    cs.label(P, 'P', { dx: -13, dy: 14, size: 13.5 });
    cs.label(v3(1.7, 0, 0.002), 'm', { dx: 12, dy: 6, size: 14, fill: '#4ade80' });
    cs.label(v3(0, 1.3, 0.002), 'n', { dx: 10, dy: 12, size: 14, fill: '#c084fc' });
    cs.label(UP, 'l', { dx: 14, dy: -2, size: 14, fill: '#ffd166' });
    cs.label(v3(-2.05, -1.3, 0), 'α', { dx: -2, dy: 16, size: 14, fill: '#5cadff' });

    cA('$m\\cap n=P$');
    cB('$l\\perp m$，$l\\perp n$');
    cC('$l\\perp\\alpha$');
    cD('两条直线必须相交');
    cs.flush();
  };

  B.btn('重置视角', () => { cam.yaw = 0.85; cam.pitch = 0.55; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转：l 与平面内相交的两条直线都成直角');
  B.render();
  return B;
}
