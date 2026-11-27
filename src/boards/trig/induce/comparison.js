import { angleReadings } from '../unit/angle-readings.js';
import './comparison.css';

export function angleComparison(board) {
  board.root.classList.add('induction-board');
  const panel = angleReadings(board, '原角 $\\alpha$', '原角与变换角的函数值对照');
  const imageAngle = panel.addAngle('变换角 $\\beta$', 'gold');
  const cosA = panel.number('$\\cos\\alpha$', 'blue'), cosB = panel.number('$\\cos\\beta$', 'gold');
  const sinA = panel.number('$\\sin\\alpha$', 'blue'), sinB = panel.number('$\\sin\\beta$', 'gold');
  const tanA = panel.number('$\\tan\\alpha$', 'blue'), tanB = panel.number('$\\tan\\beta$', 'gold');

  return (a, b, source, image) => {
    panel.angle(a); imageAngle(b);
    cosA(source.x); cosB(image.x);
    sinA(source.y); sinB(image.y);
    tanA(source.x === 0 ? null : source.y / source.x);
    tanB(image.x === 0 ? null : image.y / image.x);
  };
}
