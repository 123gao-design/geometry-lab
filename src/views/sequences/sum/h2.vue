<template>
  <ChPage :cur="2" no="和2" base="/sequences/h" :chapters="HQ_CHAPTERS"
    title="错位相减：等差乘等比"
    sub="通项是一个等差数列乘一个等比数列时，把 Sₙ 与 qSₙ 错开一列相减，中间各项的差拼成一小段等比数列，末项单独留下。这是比3 错位相减的推广。"
    :toc="[{ id: 'h2-shape', t: '适用形态' }, { id: 'h2-step', t: '三个步骤' }, { id: 'h2-eg', t: '例：n·2ⁿ⁻¹ 的求和' }, { id: 'h2-pit', t: 'q=1、末项与项数' }]">
    <div class="note good">若 <Katex tex="a_n=(An+B)q^{\,n-1}" />（<Katex tex="q\ne1" />），则 <Katex tex="S_n" /> 可写成 <Katex tex="S_n=(Cn+D)q^{\,n}+E" /> 的形式，其中 <Katex tex="C,D,E" /> 由待定或由错位相减直接算出。</div>
    <div class="board-wrap">
      <BoardMount :factory="createShiftArith" />
      <div class="cap">图 和2 · <b>等差乘等比机</b>：每列左右两根柱子，左柱是 <Katex tex="S_n" /> 的项，右柱是 <Katex tex="qS_n" /> 错后一列的对应项，画在同一条基线上。绿色竖段是这一列相减后剩下的 <Katex tex="q^{k-1}" />；这些竖段从前往后拼成一段等比数列，最右一列再减去 <Katex tex="nq^n" />。拖动 q 与 n 看绿色段的变化。</div>
    </div>

    <h3 class="sec" id="h2-shape">适用形态</h3>
    <p>通项是「等差 × 等比」的形式，即 <Katex tex="a_n=(An+B)q^{\,n-1}" />。常见的有 <Katex tex="n\cdot2^{n-1}" />、<Katex tex="(2n-1)\cdot3^{n}" />，以及 <Katex tex="\dfrac{n}{2^{n}}" /> 这类写成 <Katex tex="n\cdot\left(\dfrac12\right)^{n}" /> 的式子。</p>
    <p>为什么不能直接套公式？因为 <Katex tex="\{a_n\}" /> 既不是等差也不是等比：相邻项的比 <Katex tex="\dfrac{a_{n+1}}{a_n}=\dfrac{n+1}{n}q" /> 随 <Katex tex="n" /> 变化，不是常数。但把它看成「等比数列再乘一个 n 的一次式」，就能借用等比求和的抵消办法。</p>
    <p>比3 的错位相减处理的是纯等比数列，相减后只剩两项。这里多乘了一个等差因子，相减后不能全部消掉，每列会剩一个 <Katex tex="q^{k-1}" />，而这些剩余量恰好又是一段等比数列。所以错位相减之后还要再求一次等比的和。</p>

    <h3 class="sec" id="h2-step">三个步骤</h3>
    <p><strong>第一步：写开 <Katex tex="S_n" /> 与 <Katex tex="qS_n" />。</strong>把 <Katex tex="S_n" /> 的每一项写出来，再把整式乘 <Katex tex="q" />，整体右移一列。</p>
    <p style="text-align:center"><Katex tex="S_n=1+2q+3q^2+\dots+nq^{n-1}" display /></p>
    <p style="text-align:center"><Katex tex="qS_n=q+2q^2+\dots+(n-1)q^{n-1}+nq^{n}" display /></p>
    <p><strong>第二步：相减，按列合并。</strong>第 <Katex tex="k" /> 列（<Katex tex="k=2,\dots,n" />）上是 <Katex tex="kq^{k-1}-(k-1)q^{k-1}=q^{k-1}" />，第一列剩 1，第 <Katex tex="n+1" /> 列剩 <Katex tex="-nq^{n}" />：</p>
    <p style="text-align:center"><Katex tex="S_n-qS_n=1+q+q^2+\dots+q^{n-1}-nq^{n}" display /></p>
    <p><strong>第三步：求剩下的等比段，解出 <Katex tex="S_n" />。</strong>前 <Katex tex="n" /> 项是等比的和 <Katex tex="\dfrac{q^n-1}{q-1}" />，于是</p>
    <p style="text-align:center"><Katex tex="S_n=\dfrac{1}{1-q}\left[\dfrac{q^{n}-1}{q-1}-nq^{n}\right]" display /></p>
    <p>图 和2 把第二步画得很直白：每列两根柱子的高差就是 <Katex tex="q^{k-1}" />，绿色竖段把这些高差逐列标出，右侧栏把三步依次写出并给出数值。</p>

    <h3 class="sec" id="h2-eg">例：n·2ⁿ⁻¹ 的求和</h3>
    <p>取 <Katex tex="q=2" />，<Katex tex="a_n=n\cdot2^{n-1}" />。写出两式：</p>
    <p style="text-align:center"><Katex tex="S_n=1+2\cdot2+3\cdot2^2+\dots+n\cdot2^{n-1}" display /></p>
    <p style="text-align:center"><Katex tex="2S_n=2+2\cdot2^2+\dots+(n-1)2^{n-1}+n\cdot2^{n}" display /></p>
    <p>第一式减第二式，中间各列剩下 <Katex tex="2^{k-1}" />：</p>
    <p style="text-align:center"><Katex tex="S_n-2S_n=1+2+2^2+\dots+2^{n-1}-n2^{n}=(2^n-1)-n2^n" display /></p>
    <p>所以 <Katex tex="-S_n=(1-n)2^n-1" />，即</p>
    <p style="text-align:center"><Katex tex="S_n=(n-1)2^{n}+1" display /></p>
    <p>验算：<Katex tex="n=1" /> 时右边 <Katex tex="=1" />，与首项相符；<Katex tex="n=2" /> 时右边 <Katex tex="=5" />，而 <Katex tex="1+4=5" />，相符。结果可以写成 <Katex tex="(n-1)2^n+1" />，正好是「一次式乘 <Katex tex="q^n" /> 再加常数」，与定理陈述的形式一致。</p>
    <p>若通项是 <Katex tex="\dfrac{n}{2^n}" />，把 <Katex tex="q" /> 取作 <Katex tex="\dfrac12" />，按同一流程走一遍：<Katex tex="S_n-\dfrac12S_n" /> 的中间各列剩 <Katex tex="\left(\dfrac12\right)^{k-1}" />，末项是 <Katex tex="-\dfrac{n}{2^{n+1}}" />，最后解出 <Katex tex="S_n=2-\dfrac{n+2}{2^{n}}" />。步骤完全相同，只是 <Katex tex="q" /> 小于 1 时各项递减。</p>

    <h3 class="sec" id="h2-pit">q=1、末项与项数</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="q=1" /> 时不能用。</strong><Katex tex="q=1" /> 时通项退化为 <Katex tex="a_n=An+B" />，本身就是等差数列，直接套 <Katex tex="S_n=\dfrac{n(a_1+a_n)}{2}" />。错位相减的公式里 <Katex tex="q-1" /> 在分母上，<Katex tex="q=1" /> 时没有意义。</li>
        <li><strong>提示二：末项的符号容易错。</strong>两式相减后，最后一列是 <Katex tex="-nq^{n}" />，负号来自「<Katex tex="qS_n" /> 多出这一项而 <Katex tex="S_n" /> 没有」。写成 <Katex tex="+nq^n" /> 会把整个结果弄反，代 <Katex tex="n=2" /> 验算即可发现。</li>
        <li><strong>提示三：等比段是 <Katex tex="n" /> 项，不是 <Katex tex="n-1" /> 项。</strong><Katex tex="1+q+\dots+q^{n-1}" /> 共 <Katex tex="n" /> 项，和为 <Katex tex="\dfrac{q^n-1}{q-1}" />。若通项从 <Katex tex="q^1" /> 起（形如 <Katex tex="(An+B)q^n" />），等比段就少一项，须重新数。</li>
        <li><strong>提示四：要用待定系数时先定形式。</strong>若题目允许用待定系数，可设 <Katex tex="S_n=(Cn+D)q^n+E" />，由 <Katex tex="S_n-S_{n-1}=a_n" /> 比较系数定出 <Katex tex="C,D,E" />。这会绕开逐项相减，但设错形式（漏掉常数项 <Katex tex="E" />）同样会出错。</li>
        <li><strong>提示五：中间各列的高差不是常数。</strong>与纯等比的错位相减不同，这里相减后每列剩下的是 <Katex tex="q^{k-1}" />，随 <Katex tex="k" /> 变化。若把剩下的部分当成两项，就会漏掉中间一大段。</li>
      </ul>
    </div>
    <p>回收与预告：本方法是 比3 错位相减的推广，区别只在中间各列是否完全消掉。和3 处理正负交替与奇偶分论；和1 的分组求和也常与本节合用，例如把通项拆成「等差 × 等比」与另一段分别处理。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createShiftArith } from '../../../boards/sequences/sum/shiftarith.js';
import { HQ_CHAPTERS } from './hnav.js';
</script>
