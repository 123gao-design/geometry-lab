<template>
  <ChPage :cur="1" no="J1" base="/sets/j" :chapters="J_CHAPTERS"
    title="元素与集合：∈ 与 ∉" sub="集合是把「确定的对象」汇成整体的原点语言：对象叫元素，元素与集合之间只有属于（$\in$）与不属于（$\notin$）两种关系，没有模糊地带。数系 $\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}$ 是这套语言第一次出场 —— 圈层嵌套，逐层检验。"
    :toc="[{ id: 'j1-three', t: '集合的三性' }, { id: 'j1-nest', t: '数系嵌套：逐层检验' }, { id: 'j1-pit', t: '0、互异性与近似值' }]">
    <div class="note good" id="j1-law"><strong>属于关系</strong>：<Katex tex="a" /> 是集合 <Katex tex="A" /> 的元素，记 <Katex tex="a\in A" />；不是则记 <Katex tex="a\notin A" />。<strong>数系嵌套</strong>：<Katex tex="\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}" /> —— 站在 <Katex tex="\mathbb{R}" /> 的立场看，<Katex tex="\mathbb{N}" />、<Katex tex="\mathbb{Z}" />、<Katex tex="\mathbb{Q}" /> 都是真子集；每个数都能说清自己从哪一层起属于哪一类。现行教材 <Katex tex="0\in\mathbb{N}" />。</div>
    <ConicFigure class="numsets-figure" number="J1" title="八个数分别属于哪个数集" head="bottom" :factory="createNum">
      选一个数，琥珀色圆点会滑到它所属的最内一层，判读区依次列出四层结果。比较 <Katex tex="\frac{22}{7}" /> 和 <Katex tex="\pi" />，看它们分别从哪一层起成立。
    </ConicFigure>

    <h3 class="sec" id="j1-three">集合的三性</h3>
    <p><strong>确定性。</strong> 给定对象 <Katex tex="a" /> 与集合 <Katex tex="A" />，<Katex tex="a\in A" /> 与 <Katex tex="a\notin A" /> 恰有一个成立。「接近 <Katex tex="1" /> 的数」需要先规定多近，才能判定归属。<strong>互异性。</strong> 列举集合时，每个元素只计一次。同一个数可以同时属于多个集合。<strong>无序性。</strong> 交换列举顺序，集合仍然相同，例如 <Katex tex="\{1,2,3\}=\{3,2,1\}" />。图 J1 按内圈到外圈检验，调换检验顺序也会得到同样的归属。</p>

    <h3 class="sec" id="j1-nest">数系嵌套：逐层检验</h3>
    <p>图 J1 用四个嵌套椭圆表示数集。一个数属于某一层，也就属于它外侧的每一层。能写成整数之比的数属于有理数，例如 <Katex tex="\tfrac12" /> 和 <Katex tex="-2.5=-\tfrac52" />。<Katex tex="-7\in\mathbb{Z}\setminus\mathbb{N}" />、<Katex tex="\tfrac12\in\mathbb{Q}\setminus\mathbb{Z}" />、<Katex tex="\sqrt2\in\mathbb{R}\setminus\mathbb{Q}" /> 分别落在相邻两圈之间，说明 <Katex tex="\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}" /> 的三处包含都是真包含。</p>

    <h3 class="sec" id="j1-pit">0、互异性与近似值</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="0" /> 的归属。</strong>现行教材 <Katex tex="0\in\mathbb{N}" />，别把 <Katex tex="0" /> 排除在 <Katex tex="\mathbb{N}" /> 之外 —— 它是自然数、当然也是整数与有理数，四层都满足。</li>
        <li><strong>提示二：互异性参数题。</strong>由 <Katex tex="\{a,\,1,\,a^2\}" /> 构成集合求 <Katex tex="a" />，须按互异性排除「写重」的解：若 <Katex tex="a=1" /> 则元素重复、若 <Katex tex="a=a^2" />（即 <Katex tex="a=0"/> 或 <Katex tex="a=1" />）同样重复 —— 这类题的分类讨论本身就是三性的应用。</li>
        <li><strong>提示三：相近不等于相等。</strong><Katex tex="22/7\approx3.142857" /> 只是 <Katex tex="\pi" /> 的近似分数：它是货真价实的有理数，而 <Katex tex="\pi" /> 是无理数 —— 检验只认定义，不认「长得像」。<RouterLink class="xref" to="/functions/e4">指数函数：增速由底数定</RouterLink>里「以 <Katex tex="22/7" /> 代 <Katex tex="\pi" /> 估算」是工程近似，与集合归属是两回事。</li>
      </ul>
    </div>
    <p>∈ 与 ∉ 说清了「元素与集合」的单线关系；下一步是把集合本身当成对象 —— 用列举、描述与图示三种语言把它写出来、画出来，见下一章。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createNum } from '../../../boards/sets/lang/numsets.js';
import { J_CHAPTERS } from './jnav.js';
</script>

<style>
.board.numsets-board {
  --numsets-halo-accent: var(--blue, var(--pj-blue));
  --numsets-glow-position: 34% 43%;
  --numsets-halo-opacity: 13%;
  --numsets-band-opacity: 7%;
  --numsets-spark: color-mix(in srgb, var(--numsets-halo-accent) 36%, transparent);
  --numsets-glint: color-mix(in srgb, var(--numsets-halo-accent) 62%, transparent);
  --numsets-glow: color-mix(in srgb, var(--numsets-halo-accent) var(--numsets-halo-opacity), transparent);
  --numsets-band: color-mix(in srgb, var(--numsets-halo-accent) var(--numsets-band-opacity), transparent);
  --numsets-faint: color-mix(in srgb, var(--numsets-halo-accent) 2.5%, transparent);
  --numsets-outer: color-mix(in srgb, var(--numsets-band) 58%, transparent);
  background-color: var(--pj-paper, var(--bg2));
  background-image: var(--numsets-stars, none),
    radial-gradient(ellipse 43% 65% at var(--numsets-glow-position), var(--numsets-glow),
      var(--numsets-band) 36%, var(--numsets-faint) 69%, transparent 100%),
    radial-gradient(ellipse 60% 88% at 40% 40%, transparent 25%, var(--numsets-faint) 43%,
      var(--numsets-band) 61%, var(--numsets-faint) 84%, transparent 100%),
    radial-gradient(ellipse 83% 119% at 48% 56%, transparent 32%, var(--numsets-faint) 53%,
      var(--numsets-outer) 75%, transparent 100%),
    var(--bd-skin, none);
}
html.light .board.numsets-board {
  --numsets-halo-opacity: 10%;
  --numsets-band-opacity: 5.5%;
}
html[data-theme="dusk"] .board.numsets-board { --numsets-halo-accent: var(--purple) }
html[data-theme="sand"] .board.numsets-board { --numsets-halo-accent: var(--orange) }
.board.numsets-board[data-texture="grid"] {
  --numsets-grid-line: color-mix(in srgb, var(--pj-blue) 13%, transparent);
  background-image: linear-gradient(to right, var(--numsets-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--numsets-grid-line) 1px, transparent 1px), var(--bd-skin, none);
  background-size: 22px 22px, 22px 22px, auto;
}
.board.numsets-board > .ctrl { background: transparent }
.board.numsets-board > .tint-pop { max-width: calc(100% - 16px) }
.board.numsets-board > .tint-pop .tint-papers { width: min(300px, 100%) }
.board.numsets-board:not(.bd-float) { display: flex; flex-wrap: wrap; align-items: stretch }
.board.numsets-board:not(.bd-float) > svg {
  flex: 3 1 345px; width: 0; min-width: 0; align-self: center;
}
.board.numsets-board:not(.bd-float) > .ctrl:not(.chips) {
  order: -1; flex: 0 0 100%; border-top: 0; border-bottom: 1px solid var(--pj-axis);
}
.board.numsets-board:not(.bd-float) > .dlbar {
  position: static; order: -2; flex: 0 0 100%; justify-content: flex-end; flex-wrap: wrap; padding: 6px 10px;
}
.board.numsets-board > .ctrl:not(.chips) { gap: 5px; padding: 8px 12px }
.board.numsets-board > .ctrl > .btn { min-width: 36px; padding: 4px 8px; font-variant-numeric: tabular-nums }
.board.numsets-board > .ctrl > .numsets-auto { margin-inline-start: auto }
.board.numsets-board > .chips {
  display: grid; flex: 1 1 210px; min-width: 0; align-content: center;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr)); gap: 5px;
  padding: 10px 12px 12px !important;
}
.board.numsets-board > .chips .chip {
  display: flex; justify-content: space-between; gap: 6px; min-width: 0; margin: 0;
  padding: 5px 9px; border-color: var(--pj-axis); font-size: 12px; line-height: 1.45;
  background: color-mix(in srgb, var(--pj-paper) 76%, transparent);
}
.board.numsets-board > .chips .chip b { font-family: inherit; white-space: nowrap }
.board.numsets-board > .chips .chip.ok { color: var(--pj-mint); border-inline-start-color: var(--pj-mint) }
.board.numsets-board > .chips .chip.warn { color: var(--pj-red); border-inline-start-color: var(--pj-red) }
.board.numsets-board > .chips [data-readout] { grid-column: 1 / -1 }
.board.numsets-board > .chips [data-readout="answer"] { background: var(--pj-goldWash); color: var(--pj-gold) }
.board.numsets-board > .chips [data-readout="answer"] > span { font-size: 19px }
.board.numsets-board > .chips [data-readout="reason"] {
  display: grid; gap: 2px; padding-block: 7px; overflow-wrap: anywhere;
}
@media screen {
  .board.numsets-board.bd-float {
    --numsets-float-height: var(--bd-panel-height);
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(204px, 30%, 320px);
    grid-template-rows: auto auto minmax(0, 1fr);
  }
  .board.numsets-board.bd-half {
    --numsets-half-width: min(56vw, 940px);
    --numsets-float-height: min(var(--bd-panel-height), calc(var(--numsets-half-width) * .5 + 112px));
    height: var(--numsets-float-height);
  }
  .board.numsets-board.bd-float > .dlbar { grid-row: 1; grid-column: 1 / -1 }
  .board.numsets-board.bd-float > .ctrl:not(.chips) {
    grid-row: 2; grid-column: 1 / -1; border-top: 0; border-bottom: 1px solid var(--pj-axis);
  }
  .board.numsets-board.bd-float > svg { grid-area: 3 / 1; width: 100%; height: 100%; min-width: 0 }
  .board.numsets-board.bd-float > .chips {
    grid-area: 3 / 2; align-self: center; align-content: start; max-height: 100%;
  }
}
@media screen and (max-width: 900px) {
  .board.numsets-board.bd-half { --numsets-half-width: calc(100vw - 20px) }
}
@media screen and (min-width: 1000px) and (min-height: 560px) {
  .board.numsets-board.bd-full > .chips .chip { padding: 7px 12px; font-size: 14px }
  .board.numsets-board.bd-full > .chips .chip b { font-size: 14px }
  .board.numsets-board.bd-full > .chips [data-readout="answer"] > span { font-size: 24px }
}
@media screen and (max-width: 640px) {
  .board.numsets-board.bd-float {
    --numsets-glow-position: 45% 33%;
    /* 窄屏半屏按面板的实际高度给主图留出空间。 */
    --bd-controls-height: max(0px, calc(var(--numsets-float-height) - var(--bd-bar-height, 32px) - min(38dvh, 160px) - 2px));
    display: flex;
  }
  .board.numsets-board.bd-half {
    --numsets-float-height: min(var(--bd-panel-height), calc(var(--numsets-half-width) * .73 + 270px));
  }
  .board.numsets-board.bd-float > .dlbar { order: -2 }
  .board.numsets-board.bd-float > .ctrl:not(.chips) { order: -1 }
  .board.numsets-board.bd-float > svg { flex: 0 1 auto; height: auto }
  .board.numsets-board.bd-float > .chips {
    align-self: stretch; max-height: min(34dvh, calc(var(--bd-controls-height) / 2));
  }
}
@media (max-width: 480px) {
  .board.numsets-board { --numsets-glow-position: 45% 33% }
  /* 正文两侧的浮动工具留出读数和图注的文字空间。 */
  .board.numsets-board:not(.bd-float) > .chips { padding-inline: 32px 55px !important }
  .numsets-figure .cap { padding-inline: 32px 55px }
}
@media print { .board.numsets-board:not(.bd-float) > .ctrl:not(.chips), .board.numsets-board > .dlbar { display: none } }
</style>
