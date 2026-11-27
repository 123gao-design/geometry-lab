import { mk, hEl } from '../../lib/board.js';
import { TrigBoard, TrigLegendBoard } from './trig-board.js';

const PLOT_WIDTH = 512;
const PROOF_WIDTH = 318;

export class ProofBoard extends TrigBoard {
  exportSize = { width: PLOT_WIDTH + PROOF_WIDTH + 24, height: 464 };

  async _svgXML() {
    return exportProof(this, await super._svgXML());
  }
}

export class LegendProofBoard extends TrigLegendBoard {
  async _svgXML() {
    return exportProof(this, await super._svgXML());
  }
}

// 页面用 HTML 排版。导出时把当前提示、结论和步骤放回独立 SVG，复用原有纸面与 KaTeX 字体。
export function exportProof(board, xml) {
  const plot = new DOMParser().parseFromString(xml, 'image/svg+xml').documentElement;
  const { width, height, plotWidth = PLOT_WIDTH } = board.exportSize;
  const panelHeight = height - (board.exportCheckHeight ?? 0);
  const drawing = mk('svg', {
    width, height, viewBox: '0 0 ' + width + ' ' + height,
  });
  for (const [name, color] of Object.entries(board.diagramColors)) drawing.style.setProperty('--pj-' + name, color);
  const { paper, ink } = board.diagramColors;
  plot.setAttribute('width', plotWidth);
  plot.setAttribute('height', panelHeight);
  const background = plot.querySelector(':scope > rect');
  if (background) {
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
  }
  mk('rect', { width: '100%', height: '100%', fill: paper }, drawing);
  drawing.appendChild(plot);
  mk('style', {}, drawing).textContent = board.proofCSS;
  const area = mk('foreignObject', { x: plotWidth, y: 0, width: width - plotWidth - 10, height: panelHeight }, drawing);
  const frame = hEl('div', { style: 'height:100%;display:flex;align-items:center;color:' + ink
    + ';font-family:system-ui,sans-serif' }, area);
  frame.classList.add('board', 'fn-board');
  frame.style.setProperty('--font-song', board.legendFont);
  frame.appendChild(board.proof.cloneNode(true));
  if (board.exportCheckHeight) {
    const footer = mk('foreignObject', { x: 12, y: panelHeight, width: width - 24, height: board.exportCheckHeight }, drawing);
    const checks = board.chipRow.cloneNode(true);
    if (checks.dataset.readingStyle === 'info') {
      const wrapper = hEl('div', { class: 'board fn-board' }, footer);
      wrapper.style.setProperty('--font-song', board.legendFont);
      checks.className = 'ctrl chips proof-export-checks';
      wrapper.appendChild(checks);
    } else {
      checks.className = 'proof-export-checks';
      footer.appendChild(checks);
    }
  }
  return new XMLSerializer().serializeToString(drawing);
}
