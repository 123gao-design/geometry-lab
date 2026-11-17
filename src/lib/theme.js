/* ================= 配色主题与背景光影 =================
   单独成文件的理由：main.js 与 App.vue 只用到主题这几样，若仍从 board.js 取，
   整个画板引擎（math / ggb / record / labelstore / katex）会被一并拖进首屏包。
   画板引擎需要「换主题后重绘」时，用 onThemeChange 挂一个回调即可。 */

export const THEMES = [
  { id: 'dark', name: '暗夜', icon: '🌙', board: '#0a0d14', ink: '#e8eef7', dark: true, sw: '#0a0d14' },
  { id: 'dusk', name: '暮夜', icon: '🌆', board: '#0d1126', ink: '#e6e9f5', dark: true, sw: 'linear-gradient(140deg,#101736,#2a1a4a)' },
  { id: 'light', name: '纸面', icon: '📜', board: '#fdfcf8', ink: '#20293a', sw: '#f4f1e8' },
  { id: 'sky', name: '青蓝', icon: '🧊', board: '#f8fafc', ink: '#1e293b', sw: 'linear-gradient(140deg,#eef2f7,#d9e7f9)' },
  { id: 'sand', name: '暖沙', icon: '🌾', board: '#fffdf4', ink: '#3f3a28', sw: 'linear-gradient(140deg,#faf6ec,#f6ead0)' },
  { id: 'mint', name: '薄荷', icon: '🌿', board: '#f4fdf8', ink: '#1d3b31', sw: 'linear-gradient(140deg,#ecf8f1,#d2eede)' },
  { id: 'sakura', name: '樱粉', icon: '🌸', board: '#fdf1f5', ink: '#42283a', sw: 'linear-gradient(140deg,#fdf2f6,#f8d9ea)' },
  { id: 'lav', name: '云紫', icon: '🔮', board: '#f6f2fc', ink: '#332a4a', sw: 'linear-gradient(140deg,#f4f0fb,#e0d6f4)' },
];
export const themeOf = t => THEMES.find(x => x.id === t) || THEMES[0];

export function currentTheme() { return document.documentElement.dataset.theme || 'dark'; }
export function isLight() { return !themeOf(currentTheme()).dark; }

const THEME_KEY = 'gl-theme';

/* 换主题后的重绘回调：画板引擎、三维层等在这个钩子上登记 */
const THEME_HOOKS = [];
export function onThemeChange(fn) { if (typeof fn === 'function') THEME_HOOKS.push(fn); }

export function applyTheme(t, persist = true) {
  const th = themeOf(t);
  document.documentElement.classList.toggle('light', !th.dark);
  document.documentElement.dataset.theme = th.id;
  if (persist) try { localStorage.setItem(THEME_KEY, th.id); } catch (_) { /* 隐私模式下忽略 */ }
  syncThemeButton();
  for (const fn of THEME_HOOKS) {
    try { fn(th); } catch (_) { /* 某块板画崩了不影响其余 */ }
  }
}

export function initTheme() { // 须在任何画板构造前调用
  let t = null;
  try { t = localStorage.getItem(THEME_KEY); } catch (_) { /* ignore */ }
  if (!THEMES.some(x => x.id === t)) t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  document.documentElement.classList.toggle('light', !themeOf(t).dark);
}

/* ---------- 背景光影：三团主题色柔光缓慢漂移（默认开，选单底部可关，打印自动关） ---------- */
const ANIM_KEY = 'gl-anim';
export function animEnabled() { return !document.documentElement.classList.contains('no-anim'); }
export function setAnim(on) {
  document.documentElement.classList.toggle('no-anim', !on);
  try { localStorage.setItem(ANIM_KEY, on ? '1' : '0'); } catch (_) { /* 隐私模式下忽略 */ }
}
export function initAnim() { // 须在页面挂载前调用；默认开
  let on = true;
  try { const v = localStorage.getItem(ANIM_KEY); if (v !== null) on = v !== '0'; } catch (_) { /* ignore */ }
  document.documentElement.classList.toggle('no-anim', !on);
}

export function mountThemeButton(btn) { // 点 🎨 展开圆角面板：圆形色卡横向网格任选 + 背景光影开关
  if (!btn) return;
  THEME_BTN = btn;
  const menu = document.createElement('div');
  menu.className = 'theme-menu';
  menu.style.display = 'none';
  const items = [];
  THEMES.forEach(t => {
    const it = document.createElement('button');
    it.className = 'theme-item';
    it.setAttribute('type', 'button');
    it.title = t.icon + ' ' + t.name;
    const sw = document.createElement('i');
    sw.className = 'sw';
    sw.setAttribute('style', 'background:' + t.sw);   // 圆形色卡：纯色或渐变
    it.appendChild(sw);
    const lab = document.createElement('span');
    lab.textContent = t.name;                         // 圆圈下面只写名字，icon 留在按钮上
    it.appendChild(lab);
    it.addEventListener('click', () => { applyTheme(t.id); menu.style.display = 'none'; });
    items.push(it);
    menu.appendChild(it);
  });
  const row = document.createElement('button');       // 底部横跨整行：背景光影开关
  row.className = 'mrow' + (animEnabled() ? ' on' : '');
  row.setAttribute('type', 'button');
  row.title = '页面背景的缓动光影（点此开/关）';
  const rl = document.createElement('span');
  rl.textContent = '✨ 背景光影';
  row.appendChild(rl);
  const tgl = document.createElement('i');
  tgl.className = 'tgl';
  row.appendChild(tgl);
  row.addEventListener('click', e => {
    if (e && e.stopPropagation) e.stopPropagation();
    const on = !animEnabled();
    setAnim(on);
    row.classList.toggle('on', on);
  });
  menu.appendChild(row);
  // 挂到 body：导航条 .in 有 overflow-x:auto（overflow-y 被规范连带置为 auto），
  // 挂在里面的绝对定位选单会被裁成贴边的一条；改 fixed + 开菜单时现算坐标贴靠按钮
  (document.body || document.documentElement).appendChild(menu);
  THEME_MENU = { menu, items, row };
  const close = () => { menu.style.display = 'none'; };
  const place = () => {   // 贴靠按钮：滚动/换页后重开依然对得上
    if (!btn.getBoundingClientRect) return;
    const r = btn.getBoundingClientRect();
    const w = menu.offsetWidth || 300;
    const vw = window.innerWidth || 1200;
    let left = r.right - w;
    if (left + w > vw - 8) left = vw - w - 8;
    if (left < 8) left = 8;
    menu.style.left = Math.round(left) + 'px';
    menu.style.top = Math.round(r.bottom + 8) + 'px';
  };
  btn.addEventListener('click', e => {
    if (e && e.stopPropagation) e.stopPropagation();   // 别让冒泡到 document 的监听顺手把刚开的选单又关上
    if (menu.style.display === 'none') { menu.style.display = ''; place(); }
    else menu.style.display = 'none';
  });
  if (document.addEventListener) {
    document.addEventListener('click', e => {   // 点选单外任意处收起
      if (menu.style.display === 'none') return;
      const p = e && e.target;
      if (p && p !== btn && !(menu.contains && menu.contains(p))) close();
    });
    document.addEventListener('keydown', e => { if (e && e.key === 'Escape') close(); });
    if (window.addEventListener) window.addEventListener('scroll', close, { passive: true });   // 页面滚动时收起，避免脱锚
  }
  syncThemeButton();
}
let THEME_BTN = null, THEME_MENU = null;
function syncThemeButton() {
  if (!THEME_BTN) return;
  const th = themeOf(currentTheme());
  THEME_BTN.textContent = th.icon + ' ' + th.name;
  THEME_BTN.title = `配色：${th.name}（点击展开选单更换）`;
  if (THEME_MENU) {
    THEME_MENU.items.forEach((it, i) => it.classList.toggle('on', THEMES[i].id === th.id));
    if (THEME_MENU.row) THEME_MENU.row.classList.toggle('on', animEnabled());
  }
}
