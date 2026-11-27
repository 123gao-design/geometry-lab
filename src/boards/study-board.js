import { PlotBoard } from './functions/function-board.js';
import { presetRow } from './functions/properties/preset-row.js';
import '../views/functions/properties/preset-row.css';
import './study-board.css';

export class StudyBoard extends PlotBoard {
  constructor(root, width, height) {
    super(root, width, height);
    root.classList.add('study-board', 'fn-study-board', 'fn-wrap-legend');
    this.choices = [];
    this.marks = [];
  }

  choiceRow(label, items, current, choose) {
    const select = presetRow(this.ctrl, label, items, choose);
    this.choices.push(() => select(current()));
  }

  // 允许滑块、动画和预设互相切换，始终按当前参数标出匹配的例子。
  examples(label, examples, state, choose) {
    this.choiceRow(label, examples, () => examples.findIndex(example =>
      Object.entries(example.values).every(([key, value]) => state[key] === value)),
    i => choose(examples[i].values));
  }

  mark(point, color) {
    this.marks.push([point, this.drawingColors[color] ?? color]);
  }

  render() {
    this.marks.length = 0;
    super.render();
    for (const sync of this.choices) sync();
    this.glowPoints(this.marks);
  }
}

