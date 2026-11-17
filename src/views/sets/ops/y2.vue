<template>
  <ChPage :cur="2" no="Y2" base="/sets/y" :chapters="Y_CHAPTERS"
    title="补集与全集：∁ 与差集" sub="补集是第一个「单目」集合运算：只对一个集合 A 进行运算，结果为「U 里除它之外的一切」。但结果依赖全集 —— U 不写明，补集就没有意义。推一推右墙、看着圈外元素从「不参与运算」变成「补集成员」，这个依赖关系就直观呈现了。"
    :toc="[{ id: 'y2-stage', t: '全集：补集的前提' }, { id: 'y2-id', t: '恒等式：差集的两种身份' }, { id: 'y2-pit', t: '换全集忘换答案' }]">
    <div class="note good" id="y2-law"><strong>补集</strong>：<Katex tex="\complement_U A=\{x\in U\mid x\notin A\}" /> —— 双重身份缺一不可：先在 U 内、再不在 A。<strong>差集恒等式</strong>：<Katex tex="A\setminus B=A\cap\complement_U B" /> —— 差集就是「跟 B 的补集取交」。<strong>双重否定</strong>：<Katex tex="\complement_U(\complement_U A)=A" />。同一个 A 配不同的 U，补集不同：<Katex tex="\complement_{\mathbb{Q}}\{0\}\ne\complement_{\mathbb{R}}\{0\}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createComp" />
      <div class="cap">图 Y2 · <b>补集</b>：推「右墙 u」滑块 —— 圈外 6、7、8、9 号元素从虚影变成实点、逐个纳入全集，补集的成员清单跟着变；三挡模式 ∁U A、A∖B、∁U(∁U A) 各配一条恒等式徽章。</div>
    </div>

    <h3 class="sec" id="y2-stage">全集：补集的前提</h3>
    <p>「A 之外的一切」是个危险的短语 —— 之外到哪为止？图 Y2 用一堵可推的右墙回答：墙外有 6、7、8、9 四个圈外元素，<strong>在墙外时它们根本不参与运算</strong>（虚影示警），墙推过谁，谁立刻纳入全集、补集成员增加一个。这就是 <Katex tex="\complement_U A" /> 里下标 U 的含义：补集不是「A 的固有属性」，是「A 相对于 U 的关系」。做题时 U 常被默认成 <Katex tex="\mathbb{R}" />（不等式的解集、定义域都默认在实数里讨论），但只要题干写明 <Katex tex="U=\{1,2,\ldots,10\}" />，答案就完全不同 —— <strong>先定全集、再谈补集</strong>，顺序不能反。</p>

    <h3 class="sec" id="y2-id">恒等式：差集的两种身份</h3>
    <p>图 Y2 的第二挡亮出差集最实用的改写：<Katex tex="A\setminus B=A\cap\complement_U B" /> —— 「在 A 且不在 B」与「A 交上 B 的补集」一字不差。这条恒等式的价值在于<strong>换视角</strong>：Y1 里差集「先圈定再减去」的减法直觉，在这里改写成「先造 B 的补集、再跟 A 取交」的乘法直觉 —— 解不等式组时「x&lt;3 减掉 x≤1」常改写成「(−∞,3)∩(1,+∞)」，走的就是这条路。第三挡的 <Katex tex="\complement_U(\complement_U A)=A" /> 是双重否定律的集合版：挖去再挖去，回到本身 —— 「不是不在 A」就是「在 A」。三条恒等式在图 Y2 上都有着色区域直接核验，左右两式永远同真同假。</p>

    <h3 class="sec" id="y2-pit">换全集忘换答案</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：补集不标 U。</strong>「<Katex tex="A=\{x\mid x>3\}" />，求 <Katex tex="\complement_U A" />」若 U 取 ℝ、取 <Katex tex="\mathbb{Z}" />、取 <Katex tex="\{x\mid 0\le x\le 5\}" />，三个答案三个样 —— U 不明说就不要动笔。</li>
        <li><strong>提示二：换元后忘换全集。</strong>令 <Katex tex="t=x^2" /> 后全集从 ℝ 变成 <Katex tex="[0,+\infty)" />，新问题的补集要在新全集里求 —— 图 Y2 推墙的动画就是这个易错点的可视化。</li>
        <li><strong>提示三：补集法解题不用验。</strong>「恒成立」问题取反面（存在一个反例即不成立）再取补，E2、R 系列的「带参恒成立」题里补集法是最快的路径，但反面 <strong>必须写出等价否定</strong>（且换或、全称换存在）—— 这一步的正确性由下一章德摩根律正式保证。</li>
      </ul>
    </div>
    <p>单目补集配上双目 ∩∪，运算家族齐了 —— 下一章看它们组合出的恒等式：德摩根律说「补集可以穿过括号、且或互换」，八元素核验机直接验收。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createComp } from '../../../boards/sets/ops/complab.js';
import { Y_CHAPTERS } from './ynav.js';
</script>
