<template>
  <ChPage :cur="1" no="J1" base="/sets/j" :chapters="J_CHAPTERS"
    title="元素与集合：∈ 与 ∉" sub="集合是把「确定的对象」汇成整体的原点语言：对象叫元素，元素与集合之间只有属于（∈）与不属于（∉）两种关系，没有模糊地带。数系 ℕ⊂ℤ⊂ℚ⊂ℝ 是这套语言第一次出场 —— 圈层嵌套，逐层检验。"
    :toc="[{ id: 'j1-three', t: '集合的三性' }, { id: 'j1-nest', t: '数系嵌套：逐层检验' }, { id: 'j1-pit', t: '0、互异性与近似值' }]">
    <div class="note good" id="j1-law"><strong>属于关系</strong>：a 是集合 A 的元素，记 <Katex tex="a\in A" />；不是则记 <Katex tex="a\notin A" />。<strong>数系嵌套</strong>：<Katex tex="\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}" /> —— 站在 ℝ 的立场看，ℕ、ℤ、ℚ 都是真子集；每个数都能说清自己「从哪一圈起落户」。现行教材 <Katex tex="0\in\mathbb{N}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createNum" />
      <div class="cap">图 J1 · <b>八个数分别属于哪个数集</b>：八个候选数逐一检验：金点滑向所属数集圈的左侧隔层，四项检验逐项核验 —— 3 四项全部通过、<Katex tex="\sqrt 2"/> 仅通过 ℝ 一项；<Katex tex="22/7"/> 常被误当作 <Katex tex="\pi"/>，逐项检验即可分辨。</div>
    </div>

    <h3 class="sec" id="j1-three">集合的三性</h3>
    <p>给「集合」下定义，靠的是三条品性。<strong>确定性</strong>：给定对象 a 与集合 A，<Katex tex="a\in A" /> 与 <Katex tex="a\notin A" /> 必居其一、只居其一 —— 「接近 1 的数」「个子高的同学」都不成集合，因为无法判定。<strong>互异性</strong>：集合里的元素互不相同，<Katex tex="\{1,1,2\}" /> 是非法记号，同一元素写两遍不产生新元素。<strong>无序性</strong>：<Katex tex="\{1,2,3\}=\{3,2,1\}" />，列举的先后不改变集合本身。三性合起来就是图 J1 逐项检验的依据：标准确定（每圈有明确判据）、身份唯一（归属只认最内圈）、次序无关（先问 ℕ 还是先问 ℝ，结论一致）。</p>

    <h3 class="sec" id="j1-nest">数系嵌套：逐层检验</h3>
    <p>图 J1 的四个同心圈把数系嵌套画成嵌套圆圈：每个候选数从最里圈 ℕ 开始检验，过了哪一圈就属于哪一圈 —— 判据不是看「长相」，而是看定义：<strong>整数之比</strong>才是有理数，<Katex tex="\tfrac{1}{2}"/> 与 −2.5（即 <Katex tex="-5/2"/>）都写得出分数之形，属于 ℚ；<strong>写不出整数之比的</strong>（<Katex tex="\sqrt 2"/>、<Katex tex="\pi"/>）在 ℚ 门外止步，只属于 ℝ。这正是 <Katex tex="\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}" /> 的元素视角翻译：小圈的元素必然全是大圈的元素，反向却不成立 —— ∅ 通过任何一圈的检验，所以嵌套链上的每个 ⊂ 都是真子集。</p>

    <h3 class="sec" id="j1-pit">0、互异性与近似值</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：0 的归属。</strong>现行教材 <Katex tex="0\in\mathbb{N}" />，别把 0 挡在 ℕ 门外 —— 它是自然数、当然也是整数与有理数，四层都满足。</li>
        <li><strong>提示二：互异性参数题。</strong>由 <Katex tex="\{a,\,1,\,a^2\}" /> 构成集合求 a，须按互异性排除「写重」的解：若 <Katex tex="a=1" /> 则元素重复、若 <Katex tex="a=a^2" />（即 <Katex tex="a=0"/> 或 1）同样重复 —— 这类题的分类讨论本身就是三性的应用。</li>
        <li><strong>提示三：相近不等于相等。</strong>22/7≈3.142857 只是 π 的近似分数：它是货真价实的有理数，而 π 是无理数 —— 检验只认定义，不认「长得像」。E4 指数增长里「以 22/7 代 π 估算」是工程近似，与集合归属是两回事。</li>
      </ul>
    </div>
    <p>∈ 与 ∉ 说清了「元素与集合」的单线关系；下一步是把集合本身当成对象 —— 用列举、描述与图示三种语言把它写出来、画出来，见下一章。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createNum } from '../../../boards/sets/lang/numsets.js';
import { J_CHAPTERS } from './jnav.js';
</script>
