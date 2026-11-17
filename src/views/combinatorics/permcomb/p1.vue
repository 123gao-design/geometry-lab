<template>
  <ChPage :cur="1" no="排1" base="/combinatorics/p" :chapters="CP_CHAPTERS"
    title="组合数与组合数公式"
    sub="从 n 个不同元素里取出 m 个，不计先后，叫一种组合。把每种取法内部的元素任意排开，恰好铺出 m! 个排列，于是组合数就是排列数除以 m!。"
    :toc="[{ id: 'p1-def', t: '组合的定义' }, { id: 'p1-for', t: '组合数公式' }, { id: 'p1-sym', t: '对称性' }, { id: 'p1-pit', t: '顺序、范围与约分' }]">
    <div class="note good" id="p1-def">从 <Katex tex="n" /> 个不同元素中取出 <Katex tex="m" /> 个（<Katex tex="m\leq n" />）合成一组，叫做一个<b>组合</b>；所有组合的个数记作 <Katex tex="\mathrm{C}_n^m" />，并且 <Katex tex="\mathrm{C}_n^m=\dfrac{\mathrm{A}_n^m}{m!}=\dfrac{n!}{m!\,(n-m)!}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCombLab" />
      <div class="cap">图 排1 · <b>组合数与组合数公式</b>：每个小格是一种排列，同一列的 <Katex tex="m!" /> 格只差元素顺序，算同一种取法，列数才是组合数。看点：拖 <Katex tex="m" /> 看一列的格数从 1 涨到 6、列数随之减少；徽章里组合数与排列数并列，两数之比恒为 <Katex tex="m!" />。取 1 个时两者相等。</div>
    </div>

    <h3 class="sec" id="p1-def">组合的定义</h3>
    <p>「从 5 人里选 3 人排队」与「从 5 人里选 3 人成组」用的是同一批人，区别在于排队还论先后：甲乙丙、甲丙乙是两支队伍，却是同一个小组。前一种是排列，后一种是组合。判断口径仍是计2 末尾那一句：把选中的人换个位置，算不算另一种做法。</p>
    <p>图 排1 把这个区别摆成一个方阵：横着一列是一种取法，竖着的每一格是这种取法的一种内部排法。<b>列数就是组合数，格子的总数是排列数</b>，两者之比正是每列的格数 <Katex tex="m!" />。</p>

    <h3 class="sec" id="p1-for">组合数公式</h3>
    <p>先数排列再摊平。任取 <Katex tex="m" /> 个元素，它们内部能排出 <Katex tex="m!" /> 种顺序，这些顺序在排列数里被分别计入，在组合里只算一次。所以每种取法都被数了 <Katex tex="m!" /> 遍，排列数除以它就得到组合数：</p>
    <p style="text-align:center"><Katex tex="\mathrm{C}_n^m=\dfrac{n(n-1)\cdots(n-m+1)}{m!}=\dfrac{n!}{m!\,(n-m)!}" /></p>
    <p>两个式子的算法不同：分子分母逐项约分适合手算，阶乘式适合推导与证明。数值上要留意分子分母的因子可以跨位约去，例如 <Katex tex="\mathrm{C}_{10}^{3}=\dfrac{10\times9\times8}{3\times2\times1}" />，用 3 约 9、用 2 约 8，剩 <Katex tex="10\times3\times4=120" />。</p>

    <h3 class="sec" id="p1-sym">对称性</h3>
    <p><Katex tex="\mathrm{C}_n^m=\mathrm{C}_n^{\,n-m}" />：选出 <Katex tex="m" /> 个，等于把剩下的 <Katex tex="n-m" /> 个留给别人。取法与留下的补集一一对应，个数自然相等。这条性质在 <Katex tex="m" /> 接近 <Katex tex="n" /> 时最有用，把大数换成小数再算。</p>
    <p>两端取值 <Katex tex="\mathrm{C}_n^0=\mathrm{C}_n^n=1" />：一个都不取、全部取走，各只有一种方式。由对称性还能读出 <Katex tex="\mathrm{C}_n^1=\mathrm{C}_n^{\,n-1}=n" />。</p>

    <h3 class="sec" id="p1-pit">顺序、范围与约分</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：别把组合数当排列数。</strong>「选 3 人成组」用 <Katex tex="\mathrm{C}" />，「选 3 人排队」用 <Katex tex="\mathrm{A}" />。两个符号只差一个下标，数值差 <Katex tex="m!" /> 倍，选错就整题作废。</li>
        <li><strong>提示二：<Katex tex="m" /> 与 <Katex tex="n-m" /> 可以互换。</strong>算 <Katex tex="\mathrm{C}_{10}^{8}" /> 时先换成 <Katex tex="\mathrm{C}_{10}^{2}" />，分子只乘两项，省事且不易错。</li>
        <li><strong>提示三：约分要成对。</strong>分子有几个因子、分母有几个因子，先数清再约，约掉一半的因子是常见失误。</li>
        <li><strong>提示四：分组类问题不能直接套一次组合数。</strong>分成两组、三组时，组与组之间的顺序要不要计入，得另外处理，排2 用图把这件事说明白。</li>
      </ul>
    </div>
    <p>回收与预告：计2 的排列数在这里被「摊平」，组合数就是排列数除以内心的顺序数。排2 接着处理带限制的排法与分组，那里还会再见到 <Katex tex="m!" />——分出的组若等量，组的顺序要一并除掉。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCombLab } from '../../../boards/combinatorics/permcomb/comblab.js';
import { CP_CHAPTERS } from './cpnav.js';
</script>
