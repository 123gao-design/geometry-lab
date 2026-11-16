<template>
  <ChPage :cur="1" no="和1" base="/sequences/h" :chapters="HQ_CHAPTERS"
    title="分组求和与裂项相消"
    sub="通项能拆成几段已知数列时，分开求和再合并；通项能写成两个相邻式子的差时，逐项相加后中间全部抵消。两种办法都先把「求和对谁做」看清楚。"
    :toc="[{ id: 'h1-group', t: '分组求和' }, { id: 'h1-crack', t: '裂项相消' }, { id: 'h1-forms', t: '常见的裂项式' }, { id: 'h1-pit', t: '项数与系数' }]">
    <div class="note good">求和之前先看通项的结构。若 <Katex tex="a_n=b_n+c_n" />，而 <Katex tex="\{b_n\},\{c_n\}" /> 都能直接求和，则 <Katex tex="S_n=\sum b_k+\sum c_k" />，这叫<strong>分组求和</strong>。若 <Katex tex="a_n=f(n)-f(n+1)" />，则 <Katex tex="S_n=f(1)-f(n+1)" />，中间项两两抵消，这叫<strong>裂项相消</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGroupBar" />
      <div class="cap">图 和1a · <b>分组求和机</b>：每根柱子分两段，蓝段是等差部分 <Katex tex="k" />，橙段是等比部分 <Katex tex="2^{k-1}" />。左图逐列相加得到原数列的和，右栏把两组分别求和再合并，两条路径给出同一个 <Katex tex="S_n" />。拖动 n 看两段的比重此消彼长。</div>
    </div>
    <div class="board-wrap">
      <BoardMount :factory="createCrackLine" />
      <div class="cap">图 和1b · <b>裂项相消机</b>：数轴上依次标出 <Katex tex="1,\dfrac12,\dfrac13,\dots" />，相邻两个刻度之间的那一段长度恰好是 <Katex tex="\dfrac{1}{k(k+1)}" />。这些段首尾相接，从 1 一路排到 <Katex tex="\dfrac{1}{n+1}" />，只有两端的分数留下来。</div>
    </div>

    <h3 class="sec" id="h1-group">分组求和</h3>
    <p>通项里同时出现等差与等比的部分，就把它们拆开各算各的。以 <Katex tex="a_n=n+2^{n-1}" /> 为例：</p>
    <p style="text-align:center"><Katex tex="S_n=\sum_{k=1}^{n}k+\sum_{k=1}^{n}2^{k-1}=\dfrac{n(n+1)}{2}+(2^n-1)" display /></p>
    <p>图 和1a 的柱子把这一步画出来：蓝段高度是 <Katex tex="k" />，橙段高度是 <Katex tex="2^{k-1}" />，合起来是 <Katex tex="a_k" />。蓝段总高是三角形面积式的 <Katex tex="\dfrac{n(n+1)}{2}" />，橙段总高是等比数列的和 <Katex tex="2^n-1" />。</p>
    <p>分组的依据不止「等差加等比」一种。通项是分段函数时，按段分组；通项含奇偶两类时，按奇偶分组；通项里带常数项时，常数单独成一组。共同的判断标准只有一条：<strong>拆开后的每一组都能用已知公式求和</strong>。拆不开就没有意义。</p>
    <p>分组的另一面是「并项」：若不拆开，而是把相邻两项先合并，有时也能得到简单形式（和3 的并项法）。分组与并项是一对相反的动作，选哪一个看通项的结构。</p>

    <h3 class="sec" id="h1-crack">裂项相消</h3>
    <p>若通项能写成 <Katex tex="f(k)-f(k+1)" />，把它逐项写开：</p>
    <p style="text-align:center"><Katex tex="S_n=[f(1)-f(2)]+[f(2)-f(3)]+\dots+[f(n)-f(n+1)]" display /></p>
    <p>中间的 <Katex tex="f(2),f(3),\dots,f(n)" /> 一正一负各出现一次，全部消去，只剩</p>
    <p style="text-align:center"><Katex tex="S_n=f(1)-f(n+1)" display /></p>
    <p>最常用的一例是 <Katex tex="\dfrac{1}{k(k+1)}=\dfrac{1}{k}-\dfrac{1}{k+1}" />；代入上式得 <Katex tex="S_n=1-\dfrac{1}{n+1}" />。图 和1b 把每个 <Katex tex="\dfrac{1}{k(k+1)}" /> 画成数轴上的一段，段的右端是 <Katex tex="\dfrac1k" />，左端是 <Katex tex="\dfrac{1}{k+1}" />：前一段的左端正是后一段的右端，首尾相接，只剩最右的 1 与最左的 <Katex tex="\dfrac{1}{n+1}" />。</p>
    <p>裂项的关键是「拆成两项之差」，而不是任意拆分。像 <Katex tex="\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac{1}{k+1}" /> 这样拆完能相消的才有效；拆成 <Katex tex="\dfrac{1}{k}-\dfrac{1}{k+2}" /> 也能相消，但中间会隔一项，须把系数补对。</p>

    <h3 class="sec" id="h1-forms">常见的裂项式</h3>
    <p>下面几组值得熟记，来源都是「通分后分子为常数」这一事实：</p>
    <p style="text-align:center"><Katex tex="\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac{1}{k+1}" display /></p>
    <p style="text-align:center"><Katex tex="\dfrac{1}{k(k+2)}=\dfrac12\left(\dfrac1k-\dfrac{1}{k+2}\right)" display /></p>
    <p style="text-align:center"><Katex tex="\dfrac{1}{\sqrt{k+1}+\sqrt{k}}=\sqrt{k+1}-\sqrt{k}" display /></p>
    <p style="text-align:center"><Katex tex="\dfrac{k}{(k+1)!}=\dfrac{1}{k!}-\dfrac{1}{(k+1)!}" display /></p>
    <p>第一条的差是 1，系数为 1；第二条分母相差 2，前面要补 <Katex tex="\dfrac12" />；第三条是分母有理化，分子为 1；第四条把 <Katex tex="k=(k+1)-1" /> 拆开后正好错位。判断系数是否补对，代 <Katex tex="k=1" /> 验一次即可：两边都应等于同一个数。</p>
    <p>裂项也可以用于含根号的求和，例如 <Katex tex="\sum_{k=1}^{n}\dfrac{1}{\sqrt{k+1}+\sqrt{k}}=\sqrt{n+1}-1" />。这类题目的通项往往先要分母有理化，才能看出「差」的形式。</p>

    <h3 class="sec" id="h1-pit">项数与系数</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：裂项后剩的是两端，不是一项。</strong><Katex tex="S_n=f(1)-f(n+1)" />，首端与末端都在。只写 <Katex tex="f(1)" /> 或只写 <Katex tex="-f(n+1)" /> 都不对，代 <Katex tex="n=1" /> 验算即可发现。</li>
        <li><strong>提示二：系数要补。</strong><Katex tex="\dfrac{1}{k(k+2)}=\dfrac12\left(\dfrac1k-\dfrac{1}{k+2}\right)" />，前面的 <Katex tex="\dfrac12" /> 不能漏。通分后分子是 2，与原来的 1 差一个因子，系数就是那个因子的倒数。</li>
        <li><strong>提示三：相消的项不一定相邻。</strong>若拆成 <Katex tex="\dfrac1k-\dfrac1{k+2}" />，相消后剩下的是隔一项的两组，求和时要分奇偶或分两段写，不能直接套 <Katex tex="f(1)-f(n+1)" />。</li>
        <li><strong>提示四：分组的每一组都要能求和。</strong>把通项拆成几段只是第一步，若其中一段自己不会求和，分组就没有解决问题。拆之前先确认每一段都有现成公式。</li>
        <li><strong>提示五：求和的上限要跟着通项走。</strong>题给 <Katex tex="a_n" /> 的首项从 <Katex tex="n=2" /> 起算时，裂项后的首端是 <Katex tex="f(2)" /> 而不是 <Katex tex="f(1)" />。先把求和的下标范围写清楚，再套相消。</li>
      </ul>
    </div>
    <p>回收与预告：分组与裂项处理的是「通项能拆」的情形；和2 处理等差乘等比，用错位相减；和3 处理正负交替与需要分奇偶的求和。两种基本手法（分组、裂项）在 递1 的累加法里已经出现过一次，那里相加的是递推式的差，这里是通项本身的差。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGroupBar } from '../../../boards/sequences/sum/groupbar.js';
import { createBoard as createCrackLine } from '../../../boards/sequences/sum/crackline.js';
import { HQ_CHAPTERS } from './hnav.js';
</script>
