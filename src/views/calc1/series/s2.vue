<template>
  <ChPage :cur="2" no="级2" base="/calc1/s" :chapters="SN_CHAPTERS"
    title="正项级数的审敛法"
    sub="各项非负时部分和单调不减，收敛与否就变成了一个问题：它有没有上界。"
    :toc="[{ id: 's2-mono', t: '正项级数的判据' }, { id: 's2-comp', t: '比较判别法' }, { id: 's2-ratio', t: '比值与根值' }, { id: 's2-p', t: 'p 级数' }]">

    <div class="note good" id="s2-mono">若 <Katex tex="a_n\ge0" />，则部分和数列 <Katex tex="\{S_n\}" /> 单调不减。单调有界准则给出：<b>正项级数收敛当且仅当部分和有上界</b>。于是判断收敛不必求出和，只要给部分和配一个上界即可。</div>

    <div class="board-wrap">
      <BoardMount :factory="createRatiotest" />
      <div class="cap">图 级2 · <b>比值判别法</b>：蓝点是相邻两项之比的数列，红线 <Katex tex="\rho=1" /> 是分界，绿虚线是它的极限。<b>看点</b>：比值极限落在红线左侧必收敛，落在右侧必发散，正落在红线上时判别法失效——四档里有一档就是这种情形。</div>
    </div>

    <h3 class="sec" id="s2-comp">比较判别法</h3>
    <p>若 <Katex tex="0\le a_n\le b_n" />，则 <Katex tex="\sum b_n" /> 收敛可推出 <Katex tex="\sum a_n" /> 收敛，<Katex tex="\sum a_n" /> 发散可推出 <Katex tex="\sum b_n" /> 发散。理由只在部分和的上界：小的被大的压住，大的一旦有界，小的自然也有界。</p>
    <p>实际用法多是「抓主要项」：<Katex tex="\dfrac{1}{n^2+n}" /> 与 <Katex tex="\dfrac{1}{n^2}" /> 同阶，前者小于后者，故收敛；<Katex tex="\dfrac{1}{\sqrt{n+1}}" /> 大于 <Katex tex="\dfrac{1}{\sqrt{n}+\sqrt{n+1}}" /> 这种能直接看出走向的量。比较的对象通常是等比级数或下一小节的 p 级数。</p>
    <p>比较法要预先知道一个级数的敛散性才能用。极限形式的比较法省掉了这一步：若 <Katex tex="a_n/b_n\to c" /> 且 <Katex tex="0<c<+\infty" />，则两级数同敛散，只要算出比值极限落在哪个区间，就能把待判级数归到熟悉的级数上去。</p>

    <h3 class="sec" id="s2-ratio">比值与根值判别法</h3>
    <p>对正项级数，记 <Katex tex="\rho=\lim\limits_{n\to\infty}\dfrac{a_{n+1}}{a_n}" />。若 <Katex tex="\rho<1" />，级数收敛；<Katex tex="\rho>1" /> 或 <Katex tex="\rho=+\infty" />，级数发散；<Katex tex="\rho=1" /> 时判别法失效，须另找办法。图 级2 的四档正好把三种情形都覆盖了一遍。</p>
    <p>道理在于 <Katex tex="\rho" /> 是「后项是前项的几分之几」：小于 1 时越往后项缩得越快，整体被一个收敛的等比级数压住；大于 1 时通项不趋于零。根值判别法把同样的想法换成 <Katex tex="\rho=\lim\sqrt[n]{a_n}" />，对含 <Katex tex="n" /> 次方的通项更方便。</p>
    <p><Katex tex="\rho=1" /> 时两个方向都可能出现：<Katex tex="\sum1/n" /> 发散而 <Katex tex="\sum1/n^2" /> 收敛，两者的比值极限都是 1。所以比值判别法失效不是「算错了」，而是这一尺度看不出差别，要换更细的尺子。</p>

    <h3 class="sec" id="s2-p">p 级数：一把常用的尺子</h3>
    <p>级数 <Katex tex="\sum\limits_{n=1}^{\infty}\dfrac{1}{n^p}" /> 在 <Katex tex="p>1" /> 时收敛，<Katex tex="p\le1" /> 时发散。这条结论可以拿积分判别法看：<Katex tex="\sum 1/n^p" /> 与反常积分 <Katex tex="\int_1^{+\infty}x^{-p}\,\mathrm{d}x" /> 同敛散，而后者在定4 里已经判过——<Katex tex="p>1" /> 时面积有上限，<Katex tex="p\le1" /> 时没有。</p>
    <p>至此三把尺子到齐：等比级数看比值、p 级数看幂次、比较法把待判级数挂到前两者上。碰到通项是有理式的情形，先看分子分母的最高次，差决定 p，结果几乎立刻可写。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：比值判据只对正项级数直接用。</strong>有负项时须先取绝对值，或者转到交错级数那一套，不能直接照搬。</li>
        <li><strong>提示二：比较的方向不能反。</strong>「小于一个发散级数」说明不了任何事；只有当上界本身收敛时，判断才成立。</li>
        <li><strong>提示三：比值极限为 1 时要换方法。</strong>这不是失败，是尺度不够细；p 级数、积分判别法都能接上。</li>
        <li><strong>提示四：极限形式比大小形式省事。</strong>只要比值趋于有限正数，两级数同敛散，不必逐项去凑不等式。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRatiotest } from '../../../boards/calc1/series/ratiotest.js';
import { SN_CHAPTERS } from './snav.js';
</script>
