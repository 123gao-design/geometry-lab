<template>
  <ChPage :cur="1" no="级1" base="/calc1/s" :chapters="SN_CHAPTERS"
    title="常数项级数的概念与性质"
    sub="把无穷多个数加起来，得到的不一定是无穷大：收敛与否，全看部分和数列有没有极限。"
    :toc="[{ id: 's1-def', t: '级数与部分和' }, { id: 's1-geo', t: '等比级数' }, { id: 's1-need', t: '收敛的必要条件' }, { id: 's1-prop', t: '基本性质' }]">

    <div class="note good" id="s1-def">给定数列 <Katex tex="\{a_n\}" />，式子 <Katex tex="\sum_{n=1}^{\infty}a_n" /> 叫<b>常数项级数</b>，<Katex tex="S_n=a_1+a_2+\cdots+a_n" /> 叫它的<b>部分和</b>。若部分和数列 <Katex tex="\{S_n\}" /> 存在有限极限 <Katex tex="S" />，就说级数<b>收敛</b>且和为 <Katex tex="S" />；否则说它<b>发散</b>。级数本身没有直接的加法，收敛性一律通过部分和来定义。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSerieslab" />
      <div class="cap">图 级1 · <b>部分和机</b>：蓝点连成部分和数列，绿虚线画出它的极限，金点是当前 <Katex tex="n" /> 的位置。<b>看点</b>：四档通项里有两档部分和停住、一档一路往上爬——每一项都在变小，和却可以没有上限。</div>
    </div>

    <h3 class="sec" id="s1-geo">等比级数：能算清的那一类</h3>
    <p>等比级数 <Katex tex="\sum_{n=1}^{\infty}aq^{n-1}" /> 的部分和有闭式：<Katex tex="S_n=\dfrac{a(1-q^n)}{1-q}" />（<Katex tex="q\neq1" />）。当 <Katex tex="|q|<1" /> 时 <Katex tex="q^n\to0" />，于是 <Katex tex="S_n\to\dfrac{a}{1-q}" />，级数收敛；当 <Katex tex="|q|\ge1" /> 时部分和无界，级数发散。图 级1 的第三档取 <Katex tex="a=1/2" />、<Katex tex="q=1/2" />，部分和贴着 1 走。</p>
    <p>这条结论的用法不止于求和一个等比级数：把待判的级数各项放大或缩小到一个收敛的等比级数之下，就能断言它收敛；放大到一个发散的等比级数之上，并不能断言它发散，这一侧的论证需要另想办法。这套「拿等比级数当尺子」的路子，就是下一章比较判别法的雏形。</p>

    <h3 class="sec" id="s1-need">收敛的必要条件</h3>
    <p>若级数收敛，则 <Katex tex="a_n=S_n-S_{n-1}\to S-S=0" />。也就是说，<b>通项趋于零是收敛的必要条件</b>。这个条件只挡不收敛，不给收敛：图 级1 的第二档调和级数 <Katex tex="\sum 1/n" /> 的每一项都趋于零，部分和却按 <Katex tex="\ln n" /> 缓慢上升，始终没有上限。</p>
    <p>调和级数的发散可以用分组证明：把项按 <Katex tex="1,\ \frac12,\ \frac13+\frac14,\ \frac15+\cdots+\frac18,\dots" /> 分组，每一组的和都大于 <Katex tex="1/2" />，无穷多组相加就不可能收敛。这条证明不依赖任何计算技巧，只用到了「组内项数翻倍、每项都不小于组末那一项」这一点。</p>
    <p>反过来用更好使：一旦发现 <Katex tex="a_n" /> 不趋于零，立刻断定发散，不必再算部分和。这一点在级3 的第三档里会再出现一次，那里的通项趋于 1。</p>

    <h3 class="sec" id="s1-prop">收敛级数的基本性质</h3>
    <p>收敛级数保留了有限和的多数性质。若 <Katex tex="\sum a_n" /> 与 <Katex tex="\sum b_n" /> 都收敛，则 <Katex tex="\sum(a_n\pm b_n)" /> 收敛且和等于两和之加减；乘一个常数 <Katex tex="k" /> 也不改变收敛性，和乘 <Katex tex="k" />。</p>
    <p>去掉或补上有限多项不改变收敛性，只可能改变和的值。这条让「级数只看尾部」的判断方式合法：前面有限项怎么改，收敛与否都不受影响。图 级1 的第四档 <Katex tex="\sum\frac{1}{n(n+1)}" /> 就是裂项之后中间项全部抵消，只剩 <Katex tex="1-\frac{1}{n+1}" />，和趋于 1。</p>
    <p>两个发散级数的和却可能收敛，例如 <Katex tex="\sum 1/n" /> 与 <Katex tex="\sum(-1/n)" /> 相加恒为零。所以「发散 + 发散」不能沿用有限和的加法规则，判断级数的加减必须在各自收敛的前提下进行。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：通项趋于零不保证收敛。</strong>调和级数是标准的反例；只有通项不趋于零时，才能直接判发散。</li>
        <li><strong>提示二：级数不能随意重排。</strong>只有绝对收敛的级数才允许任意交换求和次序，条件收敛的级数重排后可能得到任何和，甚至发散。</li>
        <li><strong>提示三：部分和是唯一判据。</strong>说「无穷多个数相加等于 S」之前，先确认 <Katex tex="S_n" /> 有极限；写 <Katex tex="\sum_{n=1}^\infty a_n" /> 只是记号的简写。</li>
        <li><strong>提示四：加了括号不等于原级数。</strong>收敛级数加括号仍收敛且和不变，但加括号后收敛并不能反推原级数收敛，例如 <Katex tex="(1-1)+(1-1)+\cdots" />。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSerieslab } from '../../../boards/calc1/series/serieslab.js';
import { SN_CHAPTERS } from './snav.js';
</script>
