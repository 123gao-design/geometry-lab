/* 章节画板 → 自由画板（/playground）的出口。
   GeoGebra 命令序列以 JSON 塞进 hash 查询串，页面挂载后按顺序重放。
   命令用 GeoGebra 自己的语法写：f(x)=sin(x)、Circle((1,2),3)、u=(1,2,3)。 */

export function ggbUrl(cmds, mode = 'graphing') {
  const q = new URLSearchParams({ mode, cmds: JSON.stringify(cmds) });
  return '#/playground?' + q.toString();
}

/** 新标签页打开；被浏览器拦截时退回当前页跳转 */
export function openGGB(cmds, mode = 'graphing') {
  const u = ggbUrl(cmds, mode);
  const w = typeof window !== 'undefined' && window.open ? window.open(u, '_blank') : null;
  if (!w && typeof location !== 'undefined') location.hash = u.slice(1);
}

/* 当前页面注册的出口。右侧圆形按钮与 /playground 的「整页」链接都靠它拿命令：
   页面上一页两块板时以最后注册的那块为准；那块板销毁时清掉，免得带到别的页面。 */
let activeOutlet = null;

export function setActiveOutlet(o) { activeOutlet = o; }

export function clearActiveOutlet(board) {
  if (activeOutlet && activeOutlet.board === board) activeOutlet = null;
}

export function getActiveOutlet() { return activeOutlet; }

/** 取当前出口的命令数组，出错或没有出口时给空数组 */
export function outletCommands() {
  const o = activeOutlet;
  if (!o || typeof o.getCmds !== 'function') return { cmds: [], mode: 'classic' };
  try {
    const list = (o.getCmds() || []).filter(x => typeof x === 'string');
    return { cmds: list, mode: o.mode === '3d' ? '3d' : 'classic' };
  } catch (e) {
    return { cmds: [], mode: 'classic' };
  }
}
