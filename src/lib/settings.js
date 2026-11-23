// 全站界面偏好：存在 localStorage（'gl-prefs'），组件直接读这里的 reactive 对象。
// 2026-11-12 扩充：左栏默认折叠、页面切换动画、聊天小窗方向与尺寸、笔记默认格式。
// 2026-11-13 扩充：背景动画开关与类型（glow = 原来的 CSS 柔光，其余五种是混沌吸引子）、右侧旋转多面体开关。
import { reactive } from 'vue';

const KEY = 'gl-prefs';

// 每一项的取值白名单：读档与 setPref 都照它校验，脏数据一律回落到默认值
export const CHOICES = {
  drawerSide: ['left', 'right'],   // 章节目录抽屉
  dockSide: ['left', 'right'],     // 画板小窗
  chatSide: ['left', 'right'],     // 聊天小窗
  chatSize: ['half', 'full'],      // 聊天默认尺寸
  navOpen: ['cur', 'all', 'none'], // 左栏进页时的折叠方式
  pageAnim: ['fade', 'up', 'zoom', 'slide', 'blur', 'none'], // 切页动画
  noteFormat: ['md', 'tex'],       // 新建笔记的默认格式
  visitCap: ['5', '8', '12', '20'], // 面包屑缓存多少个页面（硬上限 20）
  bgMotionOn: ['on', 'off'],       // 背景动画总开关
  bgScene: ['glow', 'lorenz', 'rossler', 'aizawa', 'thomas', 'clifford', 'ns'], // 背景画什么
  bgSolidOn: ['on', 'off'],        // 左侧空白处的旋转线框多面体
  bgSolidPos: ['br', 'left', 'right'], // 多面体摆哪儿：右下角 / 左侧留白 / 右侧留白
  lblPin: ['on', 'off'],           // 板内拖过的文字位置记在本机（默认开）
  dlPos: ['in', 'left', 'right'],  // 画板操作条：板内悬浮右上 / 板上靠左 / 板上靠右
  noteAuto: ['on', 'off'],         // 笔记停手后自动写进所选文件夹（默认开）
  searchBox: ['inline', 'popup'],  // 全站搜索：顶栏直接展开 / 屏幕中间弹窗
  canvasSide: ['left', 'right'],   // 半屏画布从哪边出
  inkBar: ['auto', 'pin'],         // 画布工具条：点空白自动收回 / 常驻不收回
  inkTip: ['toast', 'off'],        // 批注操作提示：画板下方弹一条 / 不提示
  inkSelMode: ['cut', 'whole'],    // 套索选择：圈到哪段选哪段（跨界剪开）/ 整条选
  physInfo: ['on', 'off'],         // 物理实验的受力分析：常显 / 只在鼠标停到物体上时显示
  physIntro: ['on', 'off'],        // 物理实验顶部中间的简介框：显示 / 收起
  physHold: ['on', 'off'],         // 鼠标停到物体上时把实验定格（方便看受力）
  // 物理画板纸面：跟随主题 / 四档浅纸 / 四档深纸（预设表在 lib/papers.js）
  physPaper: ['theme', 'paper', 'sand', 'mint', 'sakura', 'slate', 'abyss', 'forest', 'plum'],
  // 物理画板背景方格：自动（有坐标网格时收起）/ 始终显示 / 隐藏
  physGrid: ['auto', 'on', 'off'],
  // 数学画板背景方格：不画 / 自动（板上有坐标网格时收起）/ 方格 / 点阵 / 横线
  boardGrid: ['off', 'auto', 'square', 'dots', 'lines'],
  // 数学画板纸面：跟随主题 / 四档浅纸 / 四档深纸（与物理画板共用 lib/papers.js 那张表）
  boardPaper: ['theme', 'paper', 'sand', 'mint', 'sakura', 'slate', 'abyss', 'forest', 'plum'],
};

// 「跟随主题」之外允许自带 '#rrggbb' 的项，白名单表达不了，单独校验
const HEX = /^#[0-9a-fA-F]{6}$/;
const FREE = {
  cardInk: v => v === 'theme' || HEX.test(v), // 首页卡片悬停亮线颜色
  bgInk: v => v === 'auto' || HEX.test(v),   // 背景混沌线条颜色
  bgAlpha: v => typeof v === 'number' && v >= 0.3 && v <= 2.5, // 背景线条浓度倍数
  physSpeed: v => typeof v === 'number' && v >= 0.1 && v <= 3,  // 物理实验播放速度倍率
  physScale: v => typeof v === 'number' && v >= 0.5 && v <= 1.8, // 物理实验物体大小倍率
  physFont: v => typeof v === 'number' && v >= 0.8 && v <= 1.6,  // 画板内字号倍率
  physLineW: v => typeof v === 'number' && v >= 0.6 && v <= 2.5, // 画板线条粗细倍率
  physAxisW: v => typeof v === 'number' && v >= 0.6 && v <= 3,   // 坐标轴线宽倍率（绝对）
  boardFont: v => typeof v === 'number' && v >= 0.8 && v <= 1.6,  // 数学画板字号倍率
  boardLineW: v => typeof v === 'number' && v >= 0.6 && v <= 2.5, // 数学画板线条粗细倍率
  boardAxisW: v => typeof v === 'number' && v >= 0.6 && v <= 3,   // 数学画板坐标轴线宽倍率（绝对）
};
const ok = (k, v) => (CHOICES[k] ? CHOICES[k].includes(v) : FREE[k] ? FREE[k](v) : true);

// 2026-11-20 纸面改版：旧的 cool / warm / green / mono 四档已并进新的九档预设，
// 按这张表归位（与 lib/papers.js 的 PAPER_ALIAS 一致，这里不引它，免得读档时多拉一个模块）
const PAPER_ALIAS = { cool: 'abyss', warm: 'sand', green: 'forest', mono: 'slate' };

const DEFAULTS = {
  drawerSide: 'left',
  dockSide: 'right',
  chatSide: 'right',
  chatSize: 'half',
  navOpen: 'cur',
  pageAnim: 'fade',
  noteFormat: 'md',
  visitCap: '8',
  bgMotionOn: 'on',
  bgScene: 'glow',
  bgSolidOn: 'on',
  bgSolidPos: 'br',
  lblPin: 'on',
  dlPos: 'left',                   // 操作条默认放到板上方靠左（'in' 可改回板内悬浮）
  noteAuto: 'on',                  // 笔记停手后自动写进所选文件夹；没选目录时这一项不起作用
  searchBox: 'inline',             // 搜索框默认直接长在顶栏上（用户 2026-11-17 定的）
  canvasSide: 'right',             // 半屏画布默认贴右边
  inkBar: 'auto',                  // 画布工具条默认自动收回（点画布空白收成一个小钮）
  inkTip: 'toast',                 // 批注操作提示默认用画板里的小条
  inkSelMode: 'cut',               // 套索默认「圈到哪段选哪段」（用户 2026-11-17 指定，原来的整条选可切回）
  cardInk: 'theme',                // 卡片悬停亮线颜色：默认跟主题走，也可存 '#rrggbb' 自定义
  bgInk: 'auto',                   // 背景混沌线条颜色：默认冷蓝色带，或 '#rrggbb'
  bgAlpha: 0.3,                    // 背景线条浓度倍数（0.3–2.5，默认 30%，用户 2026-11-16 拍板）
  lblPath: 'lbl-default.json', // 默认文字位置文件（相对站点根目录，放在 public/ 下）
  physInfo: 'off',              // 物理实验默认只在鼠标停到物体上时显示受力与速度
  physIntro: 'on',              // 实验简介框默认摆出来（右下「简介」与框角的 × 都能收起，记在本机）
  physSpeed: 1,                 // 播放速度倍率（0.1–3，滑块给；0.25 一类慢速用来细看碰撞与落地）
  physScale: 1,                 // 物体大小倍率（0.5–1.8，滑块给；小屏或看全局时缩一档）
  physHold: 'off',              // 默认不停格；开了以后指针碰到物体，实验就停住
  physPaper: 'theme',           // 物理画板纸面默认跟随主题（深色家族深板岩、浅色家族暖米）
  physGrid: 'auto',             // 背景方格默认「自动」：演示里有坐标网格时先收起来，免得两套网格打架
  physFont: 1.1,                // 画板内字号倍率（0.8–1.6）；读数、刻度、公式标签一起放大
  physLineW: 1.25,              // 画板线条粗细倍率（0.6–2.5）；500 多处硬编码线宽统一乘它
  physAxisW: 1.2,               // 坐标轴线宽倍率（0.6–3，绝对宽度，不跟线条倍率叠乘）
  boardFont: 1,                 // 数学画板字号倍率（0.8–1.6）；默认 1，旧板版面与原来一致
  boardLineW: 1,                // 数学画板线条粗细倍率（0.6–2.5）；mk() 里统一乘，墨迹层不吃
  boardAxisW: 1,                // 数学画板坐标轴线宽倍率（0.6–3，绝对宽度）
  boardGrid: 'off',             // 数学画板背景方格默认不画：旧板版面保持原样，要纸面纹理在设置里选
  boardPaper: 'theme',          // 数学画板纸面默认跟随主题（深色家族深纸、浅色家族浅纸，与原来一致）
};

export const PREFS = reactive({ ...DEFAULTS });

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved && typeof saved === 'object') {
    for (const k of Object.keys(DEFAULTS)) {
      // 早期存过的纸面档名先归位，别让白名单把整项判成脏数据、悄悄退回「跟随主题」
      let val = saved[k];
      if (k === 'physPaper' && PAPER_ALIAS[val]) val = PAPER_ALIAS[val];
      // 没有白名单的项（如 lblPath）是自由字符串，别让 undefined 的 includes 抛错中断整轮读档
      if (ok(k, val)) PREFS[k] = val;
    }
  }
} catch (e) { /* 隐私模式读不到就按默认值来 */ }

// 自定义亮线颜色写成 html 上的 --gl-sweep-ink（global.css 的扫边与悬停填充都读它）；
// 跟随主题时删掉这条内联变量，CSS 里的 var(--blue) 自己会随主题换色
function applyCardInk() {
  try {
    if (typeof document === 'undefined') return;
    const st = document.documentElement.style;
    if (PREFS.cardInk === 'theme') st.removeProperty('--gl-sweep-ink');
    else st.setProperty('--gl-sweep-ink', PREFS.cardInk);
  } catch (e) { /* 忽略 */ }
}
applyCardInk();

export function setPref(k, v) {
  if (!(k in DEFAULTS)) return;
  if (!ok(k, v)) return;
  PREFS[k] = v;
  if (k === 'cardInk') applyCardInk();
  persist();
}

export function resetPrefs() {
  Object.assign(PREFS, DEFAULTS);
  applyCardInk();
  persist();
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify({ ...PREFS })); } catch (e) { /* 忽略 */ }
}
