/* 图 位1b · 线面平行的判定（平面与直线的图示）
   平面 α 内画一条直线 a，平面外画一条与 a 平行的直线 b，两端用虚线把 b 连回 a，
   「b 不在平面内」「b ∥ a」两个条件同时看得见，结论 b ∥ α 才有依据。
   不用正方体，换成一块平面加几条直线，判定定理的每个条件各占一处。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 800, H = 430;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 203, s: 96, yaw: 0.85, pitch: 0.55, cz: 0.7 });
  const cA = B.chipM('条件'), cB = B.chipM('平面'), cC = B.chipM('位置'), cD = B.chipM('结论');

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0.7;

    // 平面 α
    cs.poly([v3(-2.4, -1.6, 0), v3(2.4, -1.6, 0), v3(2.4, 1.6, 0), v3(-2.4, 1.6, 0)],
      { fill: '#5cadff', op: 0.14, stroke: '#5cadff', w: 1.3, lineOp: 0.6 });

    // a 在平面内，b 与 a 平行且在平面外，两条虚线把 b 与 a 的端点连起来
    const P1 = v3(-1.5, -0.5, 0.002), P2 = v3(1.0, -0.5, 0.002);
    const Q1 = v3(-1.5, -0.5, 1.3), Q2 = v3(1.0, -0.5, 1.3);
    cs.line(P1, P2, { stroke: '#4ade80', w: 2.6, op: 1 });
    cs.line(Q1, Q2, { stroke: '#ffd166', w: 2.6, op: 1 });
    cs.line(P1, Q1, { stroke: '#8fa3bd', w: 1.2, op: 0.7, dash: '6 5' });
    cs.line(P2, Q2, { stroke: '#8fa3bd', w: 1.2, op: 0.7, dash: '6 5' });

    cs.label(v3(-0.25, -0.5, 0.002), 'a', { dx: 0, dy: 18, size: 14, fill: '#4ade80' });
    cs.label(v3(-0.25, -0.5, 1.3), 'b', { dx: 0, dy: -12, size: 14, fill: '#ffd166' });
    cs.label(v3(2.05, 1.3, 0), 'α', { dx: 10, dy: 12, size: 14, fill: '#5cadff' });

    cA('$b\\parallel a$');
    cB('$a\\subset\\alpha$');
    cC('$b\\not\\subset\\alpha$');
    cD('$b\\parallel\\alpha$');
    cs.flush();
  };

  B.btn('重置视角', () => { cam.yaw = 0.85; cam.pitch = 0.55; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转：b 悬在平面之上，却与平面内的 a 保持平行');
  B.render();
  return B;
}
