/* 纸面预设表：数学画板与物理画板共用一张（2026-11-20）。

   起初只给物理实验页用，后来数学画板的「▤ 外观」也要同一套纸色，就搬到 lib/ 下：
   画板引擎反过来 import 物理模块那个方向是反的，两边都从这里取。
   纯数据，没有任何依赖，谁引都不会多拉别的模块。

   每一档自带一整套令牌：纸面、渐变、方格、细框、墨色，以及画布用到的语义色。
   浅色纸配深墨、深色纸配浅墨，所以暗色主题下选浅纸也不会把字画糊；
   反过来浅色主题下选深纸，图形与读数也仍然压得住。

   物理那边：令牌写成 --pb-*，跟着内联样式挂在画板根上——外壳的标题条、读数条、
   gfx.js 的 readPal(host) 都从同一处取，选完当场换色，不需要重建演示。
   数学那边：取 paper（纸色）与 ink（墨色）两栏，另按档位是浅纸还是深纸决定
   COLOR 表取亮/暗哪一家族（board.js 的 TINTS / _famLight）。
   theme 档不在这里定义细节——它沿用各画板自己的默认令牌（跟着主题家族走）。 */

const LIGHT_INK = {
  ink: '#26303d', mut: '#5b6b80', faint: '#8794a7',
  card: 'rgba(255, 255, 255, .9)',
};
const DARK_INK = {
  ink: '#e8eef7', mut: '#9aa8bd', faint: '#6f7c90',
  card: 'rgba(24, 32, 44, .92)',
};

export const PAPERS = [
  { id: 'theme', t: '跟随主题', sw: ['#0d1218', '#fbf6ea'] },

  /* ── 浅色纸面：原来是白底加淡蓝渐变的那个样子，另外补三档 ── */
  {
    id: 'paper', t: '纸白 · 浅蓝', sw: ['#ffffff', '#dce9fc'],
    paper: '#f7fbff',
    skin: 'linear-gradient(158deg, #ffffff 0%, #f1f8ff 46%, #e2eeff 100%)',
    grid: 'rgba(70, 108, 158, .085)', rule: 'rgba(70, 108, 158, .24)',
    ...LIGHT_INK,
    line: 'rgba(70, 108, 158, .3)',
    indigo: '#2f68a8', sienna: '#b4652f', graphite: '#46566a', alert: '#b5443f',
    blue: '#2f68a8', orange: '#b4652f', green: '#2f7d55',
    purple: '#6a4fa0', pink: '#b64a6a', cyan: '#1f7f92',
  },
  {
    id: 'sand', t: '暖沙 · 米黄', sw: ['#fffdf7', '#f3e6cc'],
    paper: '#fbf6ea',
    skin: 'linear-gradient(160deg, #fffdf8 0%, #f9f0dd 58%, #f2e3c6 100%)',
    grid: 'rgba(140, 106, 64, .09)', rule: 'rgba(140, 106, 64, .26)',
    ...LIGHT_INK,
    ink: '#332b22', mut: '#6d6252', faint: '#95896f',
    line: 'rgba(140, 106, 64, .32)',
    indigo: '#3d6ea8', sienna: '#a75f35', graphite: '#5d5548', alert: '#b4514f',
    blue: '#3d6ea8', orange: '#a75f35', green: '#4a7c4e',
    purple: '#7a5490', pink: '#b4516f', cyan: '#2b7c86',
  },
  {
    id: 'mint', t: '青瓷 · 薄荷', sw: ['#fbfefc', '#dcefe4'],
    paper: '#f3f9f5',
    skin: 'linear-gradient(160deg, #fbfefc 0%, #edf6f0 55%, #ddeee4 100%)',
    grid: 'rgba(60, 116, 88, .085)', rule: 'rgba(60, 116, 88, .24)',
    ...LIGHT_INK,
    ink: '#233029', mut: '#55685d', faint: '#7f9187',
    line: 'rgba(60, 116, 88, .3)',
    indigo: '#2b6a95', sienna: '#b06a35', graphite: '#4a5c50', alert: '#b0473f',
    blue: '#2b6a95', orange: '#b06a35', green: '#2f7d55',
    purple: '#6a5498', pink: '#b34d70', cyan: '#1d7d86',
  },
  {
    id: 'sakura', t: '樱粉 · 淡桃', sw: ['#fffdfd', '#f7dfe7'],
    paper: '#fdf5f6',
    skin: 'linear-gradient(160deg, #fffdfd 0%, #fceef2 55%, #f6dfe8 100%)',
    grid: 'rgba(150, 90, 110, .075)', rule: 'rgba(150, 90, 110, .22)',
    ...LIGHT_INK,
    ink: '#362a30', mut: '#6f5a63', faint: '#97808b',
    line: 'rgba(150, 90, 110, .28)',
    indigo: '#3f6b9e', sienna: '#b0624a', graphite: '#5f4d57', alert: '#b0404b',
    blue: '#3f6b9e', orange: '#b0624a', green: '#497a59',
    purple: '#7b4f8e', pink: '#b24a72', cyan: '#2a7888',
  },

  /* ── 深色纸面：原来的深板岩一档，另补墨蓝、林深、紫夜 ── */
  {
    id: 'slate', t: '深板岩', sw: ['#16202c', '#0b1016'],
    paper: '#10161f',
    skin: 'linear-gradient(165deg, #141c28 0%, #0f151d 55%, #0b1016 100%)',
    grid: 'rgba(198, 216, 244, .05)', rule: 'rgba(214, 226, 246, .17)',
    ...DARK_INK,
    line: 'rgba(160, 180, 210, .3)',
    indigo: '#8db4e8', sienna: '#d9976a', graphite: '#93a3ba', alert: '#e08585',
    blue: '#8db4e8', orange: '#d9976a', green: '#7fc99a',
    purple: '#b69ae0', pink: '#e08aa8', cyan: '#79c8d8',
  },
  {
    id: 'abyss', t: '墨蓝', sw: ['#0f2036', '#070d16'],
    paper: '#0a1220',
    skin: 'linear-gradient(160deg, #0d1a2c 0%, #091220 52%, #0b1b30 100%)',
    grid: 'rgba(120, 170, 240, .055)', rule: 'rgba(140, 185, 240, .18)',
    ...DARK_INK,
    line: 'rgba(130, 175, 230, .3)',
    indigo: '#7fb0f0', sienna: '#dfa06a', graphite: '#8fa4c0', alert: '#e28a8a',
    blue: '#7fb0f0', orange: '#dfa06a', green: '#79c9a0',
    purple: '#b49ae8', pink: '#e28aa6', cyan: '#74c6dc',
  },
  {
    id: 'forest', t: '林深', sw: ['#15271e', '#091310'],
    paper: '#0d1712',
    skin: 'linear-gradient(160deg, #13241b 0%, #0c1711 55%, #0a130e 100%)',
    grid: 'rgba(130, 200, 165, .05)', rule: 'rgba(150, 205, 175, .16)',
    ...DARK_INK,
    line: 'rgba(140, 195, 165, .28)',
    indigo: '#82c4dd', sienna: '#d9a06a', graphite: '#93ab9c', alert: '#e08b7f',
    blue: '#82c4dd', orange: '#d9a06a', green: '#86cc9c',
    purple: '#a8a0e0', pink: '#dd8fa0', cyan: '#7cc8c8',
  },
  {
    id: 'plum', t: '紫夜', sw: ['#221a38', '#0f0b17'],
    paper: '#14101d',
    skin: 'linear-gradient(160deg, #1e1733 0%, #141020 55%, #1a1330 100%)',
    grid: 'rgba(190, 160, 240, .05)', rule: 'rgba(200, 175, 245, .16)',
    ...DARK_INK,
    line: 'rgba(196, 170, 240, .28)',
    indigo: '#a48ae0', sienna: '#d99c78', graphite: '#a49ab8', alert: '#e08fa0',
    blue: '#a48ae0', orange: '#d99c78', green: '#88c79e',
    purple: '#c0a2f0', pink: '#e292b4', cyan: '#7fc4da',
  },
];

/* 老档位（cool / warm / green / mono）只在这次改版前存过偏好的本机才知道，
   读档时按这张表归到新档，设置页里也不会出现点不亮的按钮 */
export const PAPER_ALIAS = {
  cool: 'abyss', warm: 'sand', green: 'forest', mono: 'slate',
};

const BY_ID = {};
for (const p of PAPERS) BY_ID[p.id] = p;

export function paperOf(id) {
  return BY_ID[id] || BY_ID[PAPER_ALIAS[id]] || BY_ID.theme;
}

/** 一档纸面 → 挂在画板根上的内联 CSS 变量；theme 档返回空对象（用组件 CSS 的默认两套） */
export function paperVars(id) {
  const p = paperOf(id);
  if (p.id === 'theme') return {};
  return {
    '--pb-paper': p.paper,
    '--pb-skin': p.skin || 'none',
    '--pb-grid': p.grid,
    '--pb-rule': p.rule,
    '--pb-ink': p.ink,
    '--pb-mut': p.mut,
    '--pb-faint': p.faint,
    '--pb-line': p.line,
    '--pb-indigo': p.indigo,
    '--pb-sienna': p.sienna,
    '--pb-graphite': p.graphite,
    '--pb-alert': p.alert,
    '--pb-blue': p.blue,
    '--pb-orange': p.orange,
    '--pb-green': p.green,
    '--pb-purple': p.purple,
    '--pb-pink': p.pink,
    '--pb-cyan': p.cyan,
    '--pb-card': p.card,
  };
}
