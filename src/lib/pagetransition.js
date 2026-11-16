// 切页动画：把入场 class 重新挂到 <main> 上（章节页是多根节点，<Transition> 用不了）。
// 具体放哪种动画由 global.css 里 main[data-anim=…] 决定，取值见 settings.js 的 pageAnim。
export function playPageAnim() {
  if (typeof document === 'undefined') return;
  const m = document.querySelector('main');
  if (!m) return;
  m.classList.remove('page-in');
  void m.offsetWidth;   // 强制 reflow，动画才能重放
  m.classList.add('page-in');
}
