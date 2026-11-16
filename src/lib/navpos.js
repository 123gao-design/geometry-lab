/* 左栏「章节目录」的两份记忆：折叠表与滚动位置。
   ChPage 在每次翻章时都会跟着路由重建，组件内的 ref 留不住它们，
   所以把记忆放在模块作用域：key 是模块 slug（取不到模块的老页面用 'base:' + 路由前缀），
   值是各子专题的开合布尔表 / 上一次的 scrollTop。 */
export const NAV_OPEN = new Map();
export const NAV_SCROLL = new Map();
