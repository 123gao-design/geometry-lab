<template>
  <ChPage :cur="2" no="J2" base="/sets/j" :chapters="J_CHAPTERS"
    title="集合的表示：列举、描述与图示" sub="有限集用列举、无限集用描述、几何对象用图示 —— 三种语言各有分工。描述法是重点：把「代表元 + 前置集合 + 条件」拆开看，集合就一目了然；数轴图示则把端点开闭画成看得见的实心与空心。"
    :toc="[{ id: 'j2-desc', t: '描述法解剖：三部件' }, { id: 'j2-three', t: '三种语言的分工' }, { id: 'j2-pit', t: '三种记法别认错' }]">
    <div class="note good" id="j2-law"><strong>描述法格式</strong>：<Katex tex="A=\{x\in U\mid P(x)\}" /> —— 三部件：<strong>代表元</strong> <Katex tex="x" />（在讨论什么对象）、<strong>前置集合</strong> <Katex tex="x\in U" />（从哪个大集合里选）、<strong>条件</strong> <Katex tex="P(x)" />（还须满足什么）。不写前置时默认 <Katex tex="x\in\mathbb{R}" />。<strong>列举法</strong> <Katex tex="\{-2,-1,0,1,2\}" /> 只适合有限集；无限集用描述法或数轴图示。</div>
    <ConicFigure number="J2" title="列举法、描述法与数轴图示" head="bottom" :factory="createRep">
      四个预设集合各自上轴，拖金探针 <Katex tex="x" /> —— 先过「前置集合」这关、再验条件；吸附网格让探针精确踩上端点 <Katex tex="3" /> 与 <Katex tex="-1" />，开闭直接核验。列举法、描述法、数轴图示三种语言实时互译。
    </ConicFigure>
    <ConicFigure number="J2 附" title="描述法不止落在数轴上" head="bottom" id="ps" :factory="createPs">
      描述法的主体同样可以是平面上的点集 —— 把代表元换成点 <Katex tex="(x,y)" />、前置集合换成 <Katex tex="\mathbb{R}^{2}" />。直线用等式约束、区域用不等式约束；不带等号的不等号，边界是空的（上半平面不含 <Katex tex="x" /> 轴）。空间中再加一维：<Katex tex="\{(x,y,z)\mid x^{2}+y^{2}+z^{2}=1\}" /> 就是单位球面。
    </ConicFigure>

    <h3 class="sec" id="j2-desc">描述法解剖：三部件</h3>
    <p>图 J2 的探针把描述法拆成两个步骤。第一步是<strong>前置集合</strong>：<Katex tex="A=\{x\in\mathbb{Z}\mid -2\le x<3\}" /> 里，探针落在 <Katex tex="2.5" /> 时区间条件尚未检验 —— 「不是整数」先被 <Katex tex="x\in\mathbb{Z}" /> 排除，前置集合先检验。第二步才是<strong>条件</strong>：通过前置检验的整数再验 <Katex tex="-2\le x<3" />，右端 <Katex tex="x=3" /> 因「<Katex tex="<" />」不含等号而被排除。两步都通过才判定 <Katex tex="\in" />。这个「先圈定范围、再验条件」的两步结构，正是下一章子集判定的雏形 —— 前置集合本身就是一个小型的 <Katex tex="\forall x" /> 量词。</p>

    <h3 class="sec" id="j2-three">三种语言的分工</h3>
    <p><strong>列举法</strong>直观，但只在有限集可行 —— 图 J2 的 ② <Katex tex="B=\{x\mid -1<x\le 2\}" /> 一上线，板上就显示「无限集：打不完」的警告；偶数集 <Katex tex="C=\{x\mid x=2k,\ k\in\mathbb{Z}\}" /> 用省略号 <Katex tex="\{\ldots,-4,-2,0,2,4,\ldots\}" /> 勉强示意，但「省略号合法」的前提是规律唯一。<strong>描述法</strong>是对无限集唯一的严谨书写。<strong>图示法</strong>（数轴、韦恩图）不负责严谨、负责看见：区间端点实心 = 闭（含端点）、空心 = 开（不含端点）——图 J2 探针踩上 <Katex tex="x=-1" /> 时读数显示「左端开着」，端点不在线上。<RouterLink class="xref" to="/functions/c3">定义域与值域</RouterLink>里「分母不为零、根号下非负」翻译成集合语言，走的正是这条描述法流程。</p>
    <p><strong>几何对象集</strong>也用描述法，只是前置集合按对象类别继承：平面点集取 <Katex tex="\mathbb{R}^{2}" />，空间点集取 <Katex tex="\mathbb{R}^{3}" /> —— 代表元是点 <Katex tex="(x,y)" /> 或 <Katex tex="(x,y,z)" />，竖线左边从「数 <Katex tex="x" />」换成「点」。直线是等式约束 <Katex tex="\{(x,y)\in\mathbb{R}^{2}\mid y=x\}" />，区域是不等式约束 <Katex tex="\{(x,y)\in\mathbb{R}^{2}\mid x^{2}+y^{2}\le 1\}" />（单位圆盘）或 <Katex tex="\{(x,y)\in\mathbb{R}^{2}\mid y>0\}" />（上半平面，x 轴空心）；空间里 <Katex tex="\{(x,y,z)\mid x^{2}+y^{2}+z^{2}=1\}" /> 是单位球面。规则不变：代表元一旦换成点，集合元素就成群了，<strong>不能再用「数轴上的位置」来画</strong>，只能回到描述法或区域图。</p>

    <h3 class="sec" id="j2-pit">三种记法别认错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：代表元决定集合。</strong>同一个 <Katex tex="y=x^2" /> 能造出三个完全不同的集合 —— ① <Katex tex="\{x\mid y=x^2\}" />：代表元是 <Katex tex="x" />，集合 = <strong><Katex tex="x" /> 的取值范围</strong>（定义域 <Katex tex="\mathbb{R}" />）；② <Katex tex="\{y\mid y=x^2\}" />：代表元是 <Katex tex="y" />，集合 = <strong><Katex tex="y" /> 的取值范围</strong>（值域 <Katex tex="[0,+\infty)" />，正是<RouterLink class="xref" to="/functions/c3">定义域与值域</RouterLink>里值域投影的雏形）；③ <Katex tex="\{(x,y)\mid y=x^2\}" />：代表元是点 <Katex tex="(x,y)" />，集合 = <strong>抛物线上的点全体</strong>（一条曲线）。</li>
        <li><strong>提示二：先读竖线左边。</strong>代表元换了，讨论的对象就换了 —— 读描述法先读竖线左边，这是唯一可靠的判断依据。</li>
        <li><strong>提示三：默认数集是 <Katex tex="\mathbb{R}" />。</strong><Katex tex="\{x\mid x^2=3\}" /> 与 <Katex tex="\{x\in\mathbb{R}\mid x^2=3\}" /> 相同，但 <Katex tex="\{x\in\mathbb{Z}\mid x^2=3\}" /> 为空集 —— 图 J2 的 ④ 关掉 <Katex tex="\mathbb{R}" /> 前置立变 <Katex tex="\varnothing" />。</li>
      </ul>
    </div>
    <p>集合写出来了，下一章开始讨论「集合与集合」的关系：谁包含谁、谁是谁的子集 —— 元素视角的 <Katex tex="\in" /> 换成全称视角的 <Katex tex="\subseteq" />。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRep } from '../../../boards/sets/lang/replab.js';
import { createBoard as createPs } from '../../../boards/sets/lang/psets.js';
import { J_CHAPTERS } from './jnav.js';
</script>

<style>
/* 图 J2：整板柔光 / 细网格（「外观」里切换），配色由 conic-diagram 的 --pj-* 提供；
   这里只限定在 .board.replab-board 上，正文与页面主题一概不动。 */
.board.replab-board {
  --replab-accent: var(--pj-accent, var(--blue));
  --replab-glow: color-mix(in srgb, var(--replab-accent) 12%, transparent);
  --replab-band: color-mix(in srgb, var(--replab-accent) 6%, transparent);
  --replab-faint: color-mix(in srgb, var(--replab-accent) 2.4%, transparent);
  background-color: var(--pj-paper, var(--bg2));
  background-image:
    radial-gradient(ellipse 46% 72% at 34% 40%, var(--replab-glow), var(--replab-faint) 46%, transparent 100%),
    radial-gradient(ellipse 66% 96% at 42% 46%, transparent 26%, var(--replab-band) 62%, transparent 100%),
    radial-gradient(ellipse 88% 124% at 50% 58%, transparent 34%, var(--replab-faint) 56%, var(--replab-band) 78%, transparent 100%),
    var(--bd-skin, none);
}
html.light .board.replab-board {
  --replab-glow: color-mix(in srgb, var(--replab-accent) 9%, transparent);
  --replab-band: color-mix(in srgb, var(--replab-accent) 4.5%, transparent);
}
.board.replab-board[data-texture="grid"] {
  --replab-grid-line: color-mix(in srgb, var(--pj-blue) 12%, transparent);
  background-image:
    linear-gradient(to right, var(--replab-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--replab-grid-line) 1px, transparent 1px),
    var(--bd-skin, none);
  background-size: 22px 22px, 22px 22px, auto;
}
/* 上下结构：下载条与预设按钮在板顶，主图居中，判读框排在主图下方（不再与图左右分栏）。 */
.board.replab-board:not(.bd-float) { display: flex; flex-direction: column; }
.board.replab-board > .dlbar {
  position: static; order: -2; flex: none; justify-content: flex-end; flex-wrap: wrap; padding: 6px 10px;
}
.board.replab-board > .ctrl:not(.chips) {
  order: -1; flex: none; gap: 5px; padding: 8px 12px;
  border-top: 0; border-bottom: 1px solid var(--pj-axis);
}
/* 预设 / 扫轴按钮：选中时常亮一圈外发光，点击瞬间再散开一道辉光（.btn-pulse）。
   颜色取画板当前方案的强调色 --pj-accent，换主题与纸面时一起换。 */
.board.replab-board > .ctrl:not(.chips) .btn { position: relative; }
.board.replab-board > .ctrl:not(.chips) .btn.on {
  border-color: color-mix(in srgb, var(--pj-accent) 72%, var(--pj-paper));
  background: color-mix(in srgb, var(--pj-accent) 14%, var(--pj-paper));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--pj-accent) 52%, transparent),
    0 0 12px color-mix(in srgb, var(--pj-accent) 34%, transparent),
    0 0 22px color-mix(in srgb, var(--pj-accent) 14%, transparent);
}
.board.replab-board > .ctrl:not(.chips) .btn:hover {
  box-shadow: 0 0 10px color-mix(in srgb, var(--pj-accent) 22%, transparent);
}
.board.replab-board > .ctrl:not(.chips) .btn.btn-pulse::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 9px;
  pointer-events: none;
  animation: rep-btn-glow .75s ease-out forwards;
}
@keyframes rep-btn-glow {
  0% {
    opacity: 1;
    box-shadow:
      0 0 0 0 color-mix(in srgb, var(--pj-accent) 55%, transparent),
      0 0 10px color-mix(in srgb, var(--pj-accent) 45%, transparent);
  }
  70% { opacity: .55; }
  100% {
    opacity: 0;
    box-shadow:
      0 0 0 9px transparent,
      0 0 22px transparent;
  }
}
.board.replab-board > .chips {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px; padding: 10px 14px 12px !important;
  border-top: 1px solid var(--pj-axis) !important;
}
/* 两条工具行都透明，整板光晕从图一直铺到判读区（判读格子自己带淡底） */
.board.replab-board > .ctrl:not(.chips),
.board.replab-board > .ctrl.chips { background: transparent; }
.board.replab-board > .chips .chip {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  margin: 0;
  padding: 5px 9px;
  border-color: var(--pj-axis);
  background: color-mix(in srgb, var(--pj-paper) 80%, transparent);
  font-size: 12px;
  line-height: 1.45;
}
.board.replab-board > .chips .chip b { font-family: inherit; white-space: nowrap; }
.board.replab-board > .chips .chip > span { min-width: 0; overflow-wrap: anywhere; }
.board.replab-board > .chips .chip.ok { color: var(--pj-mint); border-inline-start-color: var(--pj-mint); }
.board.replab-board > .chips .chip.warn { color: var(--pj-red); border-inline-start-color: var(--pj-red); }
.board.replab-board > .chips .chip:last-child {
  font-size: 13px;
  background: var(--pj-goldWash);
}
/* 数轴刻度与集合点：文字默认被 .conic-board 的规则压成墨色，这两类单独放行 */
.board.replab-board svg text.rep-tick { fill: var(--pj-guide); }
.board.replab-board svg text.rep-set { fill: var(--pj-blue); }

/* 图 J2 附：静态示意板，同一套纸面与光晕；没有控件，空的工具行收起来 */
.board.psets-board {
  --psets-accent: var(--pj-accent, var(--blue));
  --psets-glow: color-mix(in srgb, var(--psets-accent) 11%, transparent);
  --psets-band: color-mix(in srgb, var(--psets-accent) 5.5%, transparent);
  --psets-faint: color-mix(in srgb, var(--psets-accent) 2.2%, transparent);
  background-color: var(--pj-paper, var(--bg2));
  background-image:
    radial-gradient(ellipse 46% 72% at 34% 40%, var(--psets-glow), var(--psets-faint) 46%, transparent 100%),
    radial-gradient(ellipse 66% 96% at 42% 46%, transparent 26%, var(--psets-band) 62%, transparent 100%),
    radial-gradient(ellipse 88% 124% at 50% 58%, transparent 34%, var(--psets-faint) 56%, var(--psets-band) 78%, transparent 100%),
    var(--bd-skin, none);
}
html.light .board.psets-board {
  --psets-glow: color-mix(in srgb, var(--psets-accent) 8%, transparent);
  --psets-band: color-mix(in srgb, var(--psets-accent) 4%, transparent);
}
.board.psets-board[data-texture="grid"] {
  --psets-grid-line: color-mix(in srgb, var(--pj-blue) 11%, transparent);
  background-image:
    linear-gradient(to right, var(--psets-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--psets-grid-line) 1px, transparent 1px),
    var(--bd-skin, none);
  background-size: 22px 22px, 22px 22px, auto;
}
.board.psets-board > .ctrl { display: none; }
.board.psets-board svg text.ps-tick { fill: var(--pj-guide); }
@media (prefers-reduced-motion: reduce) {
  .board.replab-board > .ctrl:not(.chips) .btn.btn-pulse::after { animation: none; opacity: 0; }
}
@media print {
  .board.replab-board > .ctrl:not(.chips) { display: none; }
}
</style>
