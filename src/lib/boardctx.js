/* 画板上下文（给 AI 助手用）：这一页每块板此刻的滑块、开关、徽章读数与三维视角。
   为什么单独一个文件：ChatDock 是常驻组件，若它直接 import board.js，整个画板引擎
   （连同 katex）会被拖回首屏包。所以这里只留一个取值槽，board.js 在模块初始化时把
   「怎么取」登记进来，两边都不必互相 import。 */

let PROVIDER = null;

export function setBoardContextProvider(fn) { PROVIDER = typeof fn === 'function' ? fn : null; }

/** 当前页画板状态的一小段纯文本；没有板或读不到时返回 ''。 */
export function boardContext() {
  if (!PROVIDER) return '';
  try {
    const s = PROVIDER();
    return typeof s === 'string' ? s.slice(0, 900) : '';
  } catch (_) { return ''; }
}
