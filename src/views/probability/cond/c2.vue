<template>
  <ChPage :cur="2" no="独2" base="/probability/c" :chapters="COND_CHAPTERS"
    title="全概率公式与贝叶斯公式"
    sub="一件事的结果往往由几个互斥的前提之一引起。先按前提分类、各自乘上条件概率再相加，得到总的结果概率；反过来用这个总数作分母，就能把先验改写成后验。"
    :toc="[{ id: 'c2-part', t: '完备事件组' }, { id: 'c2-total', t: '全概率公式' }, { id: 'c2-bayes', t: '贝叶斯公式' }, { id: 'c2-pit', t: '划分、分母与先验' }]">
    <div class="note good" id="c2-part">若事件 <Katex tex="A_1,A_2,\dots,A_n" /> 两两互斥且 <Katex tex="A_1\cup A_2\cup\cdots\cup A_n=\Omega" />，则称它们构成一个<b>完备事件组</b>（划分）。任何事件 <Katex tex="B" /> 都被这组事件切成互斥的几块：<Katex tex="B=(B\cap A_1)\cup(B\cap A_2)\cup\cdots\cup(B\cap A_n)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBayes" />
      <div class="cap">图 独2 · <b>全概率与贝叶斯机</b>：左枝是来源 <Katex tex="A_1" />、右枝是 <Katex tex="A_2" />，每个来源各分成「出现 <Katex tex="B" />」与「不出现」两支，线宽随概率变化。看点：三条路径上的乘积相加就是 <Katex tex="P(B)" />；右侧两根竖条对比 <Katex tex="A_1" /> 的先验与后验，滑动条件概率，后验会被推向条件更有利的那一支。</div>
    </div>

    <h3 class="sec" id="c2-part">完备事件组</h3>
    <p>把样本空间分成互不重叠的几块，每块配一个前提，这是全概率公式的准备。工厂的两条生产线、袋中不同颜色的球、一次射击的甲与乙，都可以充当划分。检验标准只有两条：同一时刻只能落进一块（互斥），所有块合起来覆盖全部结果（并集为 <Katex tex="\Omega" />）。</p>
    <p>划分与分类讨论是同一种做法：按前提把情形拆开，各自算完再合起来。区别在于这里每一块都带一个概率权重 —— 权重是前提本身的概率，它决定这块对总结果贡献多少。</p>

    <h3 class="sec" id="c2-total">全概率公式</h3>
    <p>设 <Katex tex="A_1,A_2,\dots,A_n" /> 是完备事件组且各自概率为正，则 <Katex tex="P(B)=\sum_{i=1}^{n}P(A_i)P(B\mid A_i)" />。证明只用两件事：<Katex tex="B" /> 被切成互斥的 <Katex tex="B\cap A_i" />，以及乘法公式把每块写成前提概率乘条件概率。</p>
    <p>用法是「先分类后相加」。两箱零件、甲箱次品率 2%、乙箱次品率 5%，混在一起时任取一件的次品概率，就要按箱子先分：<Katex tex="P(B)=P(A_1)P(B\mid A_1)+P(A_2)P(B\mid A_2)" />。图 独2 的树形图上，每条从根到 <Katex tex="B" /> 的路径是一段的乘积，全概率就是所有这样路径的和。条件概率给的是「在某个前提下的机会」，要换成「不预先知道前提时的机会」，必须把前提的权重补上。</p>

    <h3 class="sec" id="c2-bayes">贝叶斯公式</h3>
    <p>把全概率代入条件概率的定义，得 <Katex tex="P(A_i\mid B)=\dfrac{P(A_i)P(B\mid A_i)}{\sum_{j}P(A_j)P(B\mid A_j)}" />。分子是「<Katex tex="A_i" /> 且 <Katex tex="B" />」这条路径的概率，分母是所有路径之和，也就是 <Katex tex="P(B)" />。</p>
    <p>这条公式解决的是「由结果反推来源」的问题：看到一件次品，它来自甲箱的机会有多大？<Katex tex="P(A_i)" /> 是没有看到结果之前的判断，叫先验概率；看到 <Katex tex="B" /> 之后修正出的 <Katex tex="P(A_i\mid B)" /> 叫后验概率。图 独2 右侧两根竖条正是这两个量：条件概率越高的来源，后验就越被抬高。当 <Katex tex="P(B\mid A_1)=P(B\mid A_2)" /> 时，后验等于先验 —— 结果不提供任何信息。</p>

    <h3 class="sec" id="c2-pit">划分、分母与先验</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：划分要不重不漏。</strong>两块之间有交集会把某些路径算两次，漏掉一块则总概率偏小。写完 <Katex tex="A_1,\dots,A_n" /> 先验证互斥与并集为 <Katex tex="\Omega" />。</li>
        <li><strong>提示二：贝叶斯的分母是全概率。</strong>分母不是 <Katex tex="P(B\mid A_i)" />，也不是随意挑的 <Katex tex="P(A_j)" />，而是所有路径之和。分母写错时结果可能大于 1，这是自查的信号。</li>
        <li><strong>提示三：先验不是凭空来的。</strong><Katex tex="P(A_i)" /> 来自题目给出的事实（产量比例、人口比例），不能由 <Katex tex="P(B\mid A_i)" /> 反推出来。先验与条件概率各是各的，混用会让后验失真。</li>
        <li><strong>提示四：反向不等于正向。</strong>「次品来自甲箱的概率」与「甲箱产品是次品的概率」是两回事，前者是后验，后者是条件概率，两者用 <Katex tex="P(A_1)" /> 联系，数值一般不同。</li>
      </ul>
    </div>
    <p>回收与预告：全概率与贝叶斯都依赖乘法公式与划分的思想，与集合的「按归属分块」一脉相承。独3 处理特殊情形：当前提对结果没有影响时，乘法公式里的条件概率退化成普通概率，这就是独立。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBayes } from '../../../boards/probability/cond/bayes.js';
import { COND_CHAPTERS } from './condnav.js';
</script>
