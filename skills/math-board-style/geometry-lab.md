# Geometry Lab 落地示例

## 找到入口

从仓库根目录打开 `src/router.js`，用章节路由找到页面组件，再沿 `ConicFigure` 或 `BoardMount` 的 `factory` 找到画板。改其他章节时先核对该章实际使用的实现。

| 文件 | 作用 |
| --- | --- |
| `src/views/sets/…` | 章节、图注、图卡的响应式规则；J1/J2 另有自己的板级样式 |
| `src/boards/sets/…` | 画板逻辑与绘制；版式、柔光、掩膜都在这层 |
| `src/lib/conic-diagram.js` | `createDiagram`、`plotInk`、`glowDot`、按纸面明暗算出的 `--pj-*` 色板 |
| `src/lib/board.js` | 画板引擎：控件、把手、分享链接、浮层、SVG 序列化 |
| `src/styles/global.css` | 共享画板样式；`.board.atlas-board` 与换主题过渡在文件末尾 |
| `docs/visualization-review.md` | 逐轮改动与验收记录；新板完成后补一条 |

## 现行规范（2026-11-26，优先于旧 J1 写法）

旧版 J1 文档里的「`<radialGradient>` 画光晕」已废弃：渐变或 `url(#…)` 解析失败会退回黑色，用户称之为「黑光」。现在统一用 `glowDot`。

### 取色

- 画板用 `createDiagram` 建，色板由 `setPalette` 按当前主题 / 预设纸面算出 `--pj-*`；不要在板里写死 hex。
- 需要绝对稳定的颜色（光晕、关键点）时，把变量读成实色：

```js
const v = getComputedStyle(B.root).getPropertyValue('--pj-gold').trim();
const gold = /^#[0-9a-f]{6}$/i.test(v) ? v : '#d5a77f';
```

- 深纸 / 浅纸的填充率不同：用纸色亮度判断（`paperIsDark()`），深纸把按钮、卡片、区带的不透明度提高，浅纸收回去。
- 默认两档（暗夜、纸面）保持原色板；其余六套主题与八档纸面各用自己的语义色。

### 版式与外框

- 共享类 `.board.atlas-board`（`global.css` 末尾）：控件在上、主图居中、读数列贴在图下且**不画分隔线**；读数列两列起排，窄屏单列。
- 整图套圆角虚线外框，颜色取方案强调色：

```js
mk('rect', { x: 20, y: 12, width: 820, height: 184, rx: 16, fill: 'none',
  stroke: plotInk.accent, 'stroke-opacity': .75, 'stroke-width': 1.4, 'stroke-dasharray': '7 6' }, B.dyn);
```

- 局部读数排布在该板自己的 `<style>` 里覆盖，例如「断言、探针一行，判定占整行」：

```css
.board.atlas-board.quants-board > .ctrl.chips {
  border-top: 0 !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.board.atlas-board.quants-board > .ctrl.chips .chip:nth-child(3) { grid-column: 1 / -1; }
```

- 否定状态用红色（全局 `chip.warn` 是黄色）：

```css
.board.atlas-board.quants-board > .ctrl.chips .chip.warn {
  border-color: var(--pj-red);
  border-inline-start-color: var(--pj-red);
  color: var(--pj-red);
  background: color-mix(in srgb, var(--pj-red) 10%, transparent);
}
```

### 发光点

```js
import { createDiagram, plotInk, glowDot } from '../../../lib/conic-diagram.js';

// 命中当前运算 / 被选中的元素：8 个画板单位的柔光 + 3.5 个单位的实心芯
if (mem) glowDot(B, p, plotInk.green, 8, 3.5);
else B.dot(p, 3, { fill: plotInk.guide, 'fill-opacity': .4 });
```

- `glowDot` 内部先把 `plotInk` 的 `var(--pj-*)` 读成实色，再画六层同心圆；不要再自己写 `<radialGradient>`。
- 函数画板的 `FunctionBoard.handle` 已提供无描边光芯和透明拖动热区，使用代表该点的主题色即可。
- 探针同理：`glowDot(B, probe, plotInk.gold, 9, 4)`（J1/J2 为 `amber`）。

### 图内文字

- 只留点名、刻度、命题式、公式与表格数据；长句、操作提示、重复读数移到徽章或图注。
- `k=`、个数等数字用 LaTeX 混排（`$k=2$：$6$ 个`）。
- 字母标注加 `pointer-events:none`，点击才能落到下面的矩形上（按钮、卡片）。
- 按钮 / 卡片里的字另加内联 `stroke:none`：全站 `svg text` 的纸色描边会在金底上把字糊成一团。

### 掩膜与 defs

- 掩膜里的 `#ffffff` / `#000000` 是亮度合成原始色，保持不动。
- `buildMasks()` 会清空 defs（Y2 右墙、Y3 换预设）：任何依赖 defs 的效果都要在重建函数末尾补回。
- 全站 `svg text` 有 3px 纸色描边；不希望有光晕的字（金底上的字母）要显式 `stroke:none`。

## 验证顺序

1. 打开实际章节（如 `/#/sets/o1`）。点预设、拖探针/把手、切换留去、点字母区域，核对读数与落点。
2. **强刷页面**（Ctrl+Shift+R）：Vite 热更新不会重建已挂载的画板，旧 renderFn 会一直留着。必要时重启 dev 服务器；用 `curl localhost:5173/src/boards/…` 确认服务端模块是新版。
3. 主题：暗夜、纸面、暖沙、樱粉、薄荷/云紫各看一遍；纸面浅、深各一档。重点看深底上的填充、光晕与红色状态。
4. 宽度：1440 与 393；半屏、全屏、退出浮层各一次，确认不叠字、不跳版。
5. 导出 PNG 与页面一致；控制台无报错。

## 已知问题

- `plotInk` 的键名：有 `amber` 与 `gold`（别名）；写错键会让颜色变 `undefined`，表现为白点 + 黑光晕。
- `dist/` 会被构建清空，参考图与 skill 副本要另存。
- 掩膜重建、主题切换都会重绘，别在 `renderFn` 外缓存会过期的颜色值；需要缓存时带上「色号 + 底色 + 主题」作键。
