<template>
  <ChPage :cur="1" no="项1" base="/combinatorics/b" :chapters="CB_CHAPTERS"
    title="二项式定理与通项"
    sub="(a+b)^n 是 n 个括号相乘，每个括号取一个字母，取到 k 个 b 的方式有 C(n,k) 种。把这些方式合并成一项，展开式与通项就都出来了。"
    :toc="[{ id: 'b1-thm', t: '定理的内容' }, { id: 'b1-term', t: '通项与指定项' }, { id: 'b1-coef', t: '两类系数' }, { id: 'b1-pit', t: '下标、符号与系数' }]">
    <div class="note good" id="b1-thm">对任意正整数 <Katex tex="n" />，<Katex tex="(a+b)^n=\mathrm{C}_n^0a^n+\mathrm{C}_n^1a^{n-1}b+\cdots+\mathrm{C}_n^kb^{\,k}a^{n-k}+\cdots+\mathrm{C}_n^nb^n" />，共 <Katex tex="n+1" /> 项；其中第 <Katex tex="k+1" /> 项即通项 <Katex tex="T_{k+1}=\mathrm{C}_n^ka^{n-k}b^k" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBinomialLab" />
      <div class="cap">图 项1 · <b>二项式定理与通项</b>：n 对括号并排，每对各取一个字母，金色是真正取走的那一个。看点：拖 <Katex tex="k" /> 改取到的 b 的个数，金色随之从左向右蔓延，通项下标与系数同步改写；拖 <Katex tex="n" /> 加减括号对数；③ 档取 <Katex tex="k=0" />，全部取 a，首项系数为 1。</div>
    </div>

    <h3 class="sec" id="b1-thm">定理的内容</h3>
    <p>把 <Katex tex="(a+b)^n" /> 写成 <Katex tex="n" /> 个 <Katex tex="(a+b)" /> 连乘。展开时每个括号都要取出一项，因此每一项都是若干个 <Katex tex="a" /> 与若干个 <Katex tex="b" /> 的乘积，且 <Katex tex="a" /> 与 <Katex tex="b" /> 的指数之和恒为 <Katex tex="n" />。</p>
    <p>取到 <Katex tex="k" /> 个 <Katex tex="b" /> 意味着在 <Katex tex="n" /> 个括号里选定 <Katex tex="k" /> 个，选法有 <Katex tex="\mathrm{C}_n^k" /> 种。这些选法得到的是同类项，合并后系数就是 <Katex tex="\mathrm{C}_n^k" />。图 项1 把每种取法都画了出来——金色的格子就是每个括号里真正取走的那一个，前 <Katex tex="k" /> 个括号取 b。</p>
    <p>展开式一共 <Katex tex="n+1" /> 项，因为 <Katex tex="k" /> 可以从 0 取到 <Katex tex="n" />。两项的指数按「<Katex tex="a" /> 降、<Katex tex="b" /> 升」排开，从 <Katex tex="a^n" /> 一直走到 <Katex tex="b^n" />。</p>

    <h3 class="sec" id="b1-term">通项与指定项</h3>
    <p>通项 <Katex tex="T_{k+1}=\mathrm{C}_n^ka^{n-k}b^k" /> 是求指定项的唯一工具。要 <Katex tex="b" /> 的 3 次项，就令 <Katex tex="k=3" />；要 <Katex tex="a" /> 的指数为 2 的项，由 <Katex tex="n-k=2" /> 解出 <Katex tex="k" />。指数解出来不是整数，说明展开式里没有这一项，直接答不存在。</p>
    <p>通项自带下标偏移：<Katex tex="k" /> 从 0 起算，所以第 <Katex tex="k+1" /> 项对应 <Katex tex="k" /> 个 <Katex tex="b" />。问「第 4 项」就取 <Katex tex="k=3" />，问「含 <Katex tex="b^3" /> 的项」也取 <Katex tex="k=3" />，两种问法恰好一致，但问「第 <Katex tex="k" /> 项」时下标要减一。</p>

    <h3 class="sec" id="b1-coef">两类系数</h3>
    <p><b>二项式系数</b>指 <Katex tex="\mathrm{C}_n^k" /> 这一串数，只与 <Katex tex="n" />、<Katex tex="k" /> 有关；<b>项的系数</b>还要算上括号里自带数字的影响。例如 <Katex tex="(2x+1)^5" /> 中 <Katex tex="x^3" /> 的项：通项给出 <Katex tex="\mathrm{C}_5^2(2x)^3\cdot1^2" />，系数是 <Katex tex="\mathrm{C}_5^2\times2^3=80" />，而二项式系数只有 10。</p>
    <p>括号里带负号时同理，符号要跟着数字一起进括号。求「常数项」「有理项」这类问题，都是先写通项、再按指数条件解 <Katex tex="k" />，最后回代。</p>

    <h3 class="sec" id="b1-pit">下标、符号与系数</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：通项的下标比 <Katex tex="k" /> 大 1。</strong>第 <Katex tex="k" /> 项是 <Katex tex="T_k" />，对应 <Katex tex="k-1" /> 个 <Katex tex="b" />。写「第 5 项」却代入 <Katex tex="k=5" />，得到的是第 6 项。</li>
        <li><strong>提示二：负号不能丢。</strong><Katex tex="(a-b)^n" /> 的通项是 <Katex tex="\mathrm{C}_n^ka^{n-k}(-b)^k" />，符号随 <Katex tex="k" /> 的奇偶交替，展开式里奇数项为负、偶数项为正。</li>
        <li><strong>提示三：二项式系数与项的系数不是一回事。</strong>括号前的系数、括号内的倍数都要乘进去，只有 <Katex tex="\mathrm{C}_n^k" /> 才叫二项式系数。</li>
        <li><strong>提示四：指数之和必须是 n。</strong>写完一项先验算两个指数相加是否为 <Katex tex="n" />，凑不上说明取错了括号。</li>
      </ul>
    </div>
    <p>回收与预告：展开式的系数逐个看就是排1 的组合数，定理把计数与多项式合成了一件事。项2 把这些系数按行排开，得到一个三角形，行内的对称与增减一眼可见。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBinomialLab } from '../../../boards/combinatorics/binomial/binomiallab.js';
import { CB_CHAPTERS } from './cbnav.js';
</script>
