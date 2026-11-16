<template>
  <ChPage :cur="3" no="比3" base="/sequences/g" :chapters="GQ_CHAPTERS"
    title="等比数列的前 n 项和"
    sub="求 Sₙ 有两个入口：把 Sₙ 与 qSₙ 错开一列相减，或把一条长为 a₁/(1−q) 的线段逐段截下。前者是代数做法，后者是几何做法，两处得到同一个公式。"
    :toc="[{ id: 'g3-form', t: '错位相减' }, { id: 'g3-area', t: '线段拼法' }, { id: 'g3-struct', t: 'Sₙ 的结构与逆用' }, { id: 'g3-pit', t: 'q=1、项数与 n=1' }]">
    <div class="note good"><Katex tex="q\ne1" /> 时，<Katex tex="S_n=\dfrac{a_1(1-q^n)}{1-q}=\dfrac{a_1-a_nq}{1-q}" />；<Katex tex="q=1" /> 时，<Katex tex="S_n=na_1" />。两个式子不能互相替代，用公式前先看公比是否为 1。</div>
    <div class="board-wrap">
      <BoardMount :factory="createShiftMul" />
      <div class="cap">图 比3a · <b>错位相减机</b>：上排是 <Katex tex="S_n" /> 的各项，下排是 <Katex tex="qS_n" /> 的各项，整体右移一列。绿色列上下等高，相减为零；只剩第 1 列的 <Katex tex="a_1" /> 与第 <Katex tex="n+1" /> 列的 <Katex tex="a_{n+1}" />（金色）。右侧依次写出两式、相减、解出 <Katex tex="S_n" />。</div>
    </div>
    <div class="board-wrap">
      <BoardMount :factory="createSegFill" />
      <div class="cap">图 比3b · <b>线段填充机</b>（<Katex tex="0<q<1" />）：线段总长取 <Katex tex="L=\dfrac{a_1}{1-q}" />，依次截下 <Katex tex="a_1,a_1q,a_1q^2,\dots" />，每一段是前一段的 <Katex tex="q" /> 倍。截完 <Katex tex="n" /> 段后剩下的空档是 <Katex tex="Lq^n" />，所以 <Katex tex="S_n=L-Lq^n" />。拖动 <Katex tex="n" /> 看空档按 <Katex tex="q" /> 倍缩小。</div>
    </div>

    <h3 class="sec" id="g3-form">错位相减</h3>
    <p><Katex tex="q\ne1" /> 时，把 <Katex tex="S_n" /> 写开，再在两边同乘 <Katex tex="q" />：</p>
    <p style="text-align:center"><Katex tex="S_n=a_1+a_1q+a_1q^2+\dots+a_1q^{n-1}" display /></p>
    <p style="text-align:center"><Katex tex="qS_n=a_1q+a_1q^2+\dots+a_1q^{n-1}+a_1q^n" display /></p>
    <p>两式的右边几乎相同，只是一上一下错开了一列。用第一式减第二式，中间的 <Katex tex="a_1q,a_1q^2,\dots,a_1q^{n-1}" /> 逐项消去，只剩首尾两项：</p>
    <p style="text-align:center"><Katex tex="(1-q)S_n=a_1-a_1q^n" display /></p>
    <p>两边除以 <Katex tex="1-q" />，得到 <Katex tex="S_n=\dfrac{a_1(1-q^n)}{1-q}" />。图 比3a 把这个过程画成两排竖条：绿色列是消掉的部分，金色两格是留下来的 <Katex tex="a_1" /> 与 <Katex tex="a_{n+1}" />。</p>
    <p>把 <Katex tex="a_1q^n" /> 认作 <Katex tex="a_nq" />，公式还写成 <Katex tex="S_n=\dfrac{a_1-a_nq}{1-q}" />。这一形式在已知首末两项时更省事：不必先把 <Katex tex="n" /> 代进通项，直接用末项即可。</p>
    <p>「错位相减」这一手法并不只属于等比数列。等差乘等比的求和（和2）也要把两式错开相减，只是相减后剩下的不是两项，而是一小段等比数列。手法相同，剩余部分不同。</p>

    <h3 class="sec" id="g3-area">线段拼法</h3>
    <p>取一条长为 <Katex tex="L=\dfrac{a_1}{1-q}" /> 的线段（这要求 <Katex tex="0<q<1" />，<Katex tex="a_1>0" />，否则 <Katex tex="L" /> 不在正半轴）。按顺序截下长为 <Katex tex="a_1,a_1q,a_1q^2,\dots" /> 的段，每一段都是前一段的 <Katex tex="q" /> 倍。</p>
    <p>截完 <Katex tex="n" /> 段后，余下的空档有多长？直接算：</p>
    <p style="text-align:center"><Katex tex="L-S_n=\dfrac{a_1}{1-q}-\dfrac{a_1(1-q^n)}{1-q}=\dfrac{a_1q^n}{1-q}=Lq^n" display /></p>
    <p>空档恰好是总长的 <Katex tex="q^n" /> 倍。于是 <Katex tex="S_n=L(1-q^n)" />，与错位相减的结果一致。图 比3b 里空档用红色虚线框标出，每按一次 <Katex tex="n" />，它缩到原来的 <Katex tex="q" /> 倍，永远填不满却越来越接近端点 <Katex tex="L" />。</p>
    <p>这个看法解释了公式里的 <Katex tex="q^n" /> 从哪来：<Katex tex="q" /> 是每段相对前一段的缩放比，截了 <Katex tex="n" /> 段，空档就被缩放了 <Katex tex="n" /> 次。也顺带说明为什么 <Katex tex="q>1" /> 时不能照搬这条线段图：那时「总长」在负半轴，线段要反过来画，代数公式仍然成立，但几何直观要换成别的说法。</p>

    <h3 class="sec" id="g3-struct">Sₙ 的结构与逆用</h3>
    <p><Katex tex="q\ne1" /> 时，把公式拆成两项：</p>
    <p style="text-align:center"><Katex tex="S_n=\dfrac{a_1}{1-q}-\dfrac{a_1}{1-q}q^n" display /></p>
    <p>记 <Katex tex="A=\dfrac{a_1}{1-q}" />，则 <Katex tex="S_n=A-Aq^n" />：常数项与指数项系数相反。反过来，若题给的 <Katex tex="S_n" /> 能化成这种形式，就可以断定原数列是等比数列，并读出 <Katex tex="a_1=A(1-q)" />。</p>
    <p>由 <Katex tex="S_n" /> 反求 <Katex tex="a_n" />，按 数3 的办法分两段：</p>
    <p style="text-align:center"><Katex tex="a_1=S_1,\qquad a_n=S_n-S_{n-1}\ (n\ge2)" display /></p>
    <p>代入 <Katex tex="S_n=A-Aq^n" />，<Katex tex="n\ge2" /> 时 <Katex tex="a_n=Aq^{n-1}(1-q)" />；而 <Katex tex="S_1=A(1-q)" /> 与这一式在 <Katex tex="n=1" /> 时的值相同，两段可以合成 <Katex tex="a_n=A(1-q)q^{n-1}" />，公比为 <Katex tex="q" />。若两段算出的首项对不上，通项就必须分段写，不能合并。</p>

    <h3 class="sec" id="g3-pit">q=1、项数与 n=1</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：先判 <Katex tex="q" /> 是否为 1。</strong><Katex tex="q=1" /> 时每项相等，<Katex tex="S_n=na_1" />；公式 <Katex tex="\dfrac{a_1(1-q^n)}{1-q}" /> 的分母为零，不能代。题目含参数时，必须把 <Katex tex="q=1" /> 与 <Katex tex="q\ne1" /> 分开讨论，否则会漏掉一整类解。</li>
        <li><strong>提示二：项数不要数错。</strong>从 <Katex tex="a_1" /> 到 <Katex tex="a_n" /> 共 <Katex tex="n" /> 项，最后一项是 <Katex tex="a_1q^{n-1}" />，公式分子是 <Katex tex="1-q^n" /> 而不是 <Katex tex="1-q^{n-1}" />。图 比3a 的列号从 1 数到 <Katex tex="n+1" />，第 <Katex tex="n+1" /> 列只剩 <Katex tex="a_{n+1}" /> 一格，正是这个指数的来源。</li>
        <li><strong>提示三：<Katex tex="q<0" /> 时各项正负交替。</strong>公式照样成立，但 <Katex tex="q^n" /> 的符号随 <Katex tex="n" /> 的奇偶变化，代入时不要凭感觉把负号丢掉。数列的项本身也可能是负数，求和的结果一般不是单调增大。</li>
        <li><strong>提示四：由 <Katex tex="S_n" /> 求 <Katex tex="a_n" /> 要分 <Katex tex="n=1" />。</strong><Katex tex="a_n=S_n-S_{n-1}" /> 只对 <Katex tex="n\ge2" /> 成立，首项必须用 <Katex tex="a_1=S_1" /> 单独算。两段式子一致才能合并，不一致要写成分段函数。</li>
        <li><strong>提示五：求和前先看它是不是等比。</strong>公式只适用于等比数列。若题目给的是「等差乘等比」这类混合数列，不能直接套 <Katex tex="\dfrac{a_1(1-q^n)}{1-q}" />，要用错位相减另行计算（和2）。</li>
      </ul>
    </div>
    <p>回收与预告：等3 用倒序相加与台阶削平求等差数列的和，这里用错位相减与线段拼接求等比数列的和，两套办法都建立在「把 n 个式子压缩成两三项」上。和1 讲分组与裂项，和2 把错位相减用到等差乘等比，和3 处理并项与奇偶分论。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createShiftMul } from '../../../boards/sequences/geo/shiftmul.js';
import { createBoard as createSegFill } from '../../../boards/sequences/geo/segfill.js';
import { GQ_CHAPTERS } from './gnav.js';
</script>
