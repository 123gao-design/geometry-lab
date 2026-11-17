<template>
  <ChPage :cur="2" no="项2" base="/combinatorics/b" :chapters="CB_CHAPTERS"
    title="杨辉三角与系数性质"
    sub="把每一行的二项式系数排开，两端是 1，中间每个数等于肩上两数之和。三角形的每一行都对称，靠近中间的数最大，整行加起来是 2 的 n 次方。"
    :toc="[{ id: 'b2-build', t: '三角形的生成' }, { id: 'b2-sym', t: '对称与增减' }, { id: 'b2-max', t: '最大系数' }, { id: 'b2-pit', t: '行号与最大项' }]">
    <div class="note good" id="b2-build">第 <Katex tex="n" /> 行依次是 <Katex tex="\mathrm{C}_n^0,\mathrm{C}_n^1,\cdots,\mathrm{C}_n^n" />，两端为 1，中间满足 <Katex tex="\mathrm{C}_n^k=\mathrm{C}_{n-1}^{k-1}+\mathrm{C}_{n-1}^k" />；这一行共 <Katex tex="n+1" /> 项，各项之和为 <Katex tex="2^n" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPascalTri" />
      <div class="cap">图 项2 · <b>杨辉三角与系数性质</b>：0 到 6 行铺开，金色是选中的一项，蓝色是它的对称项。看点：拖 <Katex tex="k" /> 沿本行移动，金色与蓝色同时向两侧对走，两数始终相等；拖 <Katex tex="n" /> 换行，行和翻倍；<Katex tex="n" /> 取偶数时最大项落在正中间，取奇数时正中间两项并列。</div>
    </div>

    <h3 class="sec" id="b2-build">三角形的生成</h3>
    <p>把第 0 行的一个 1 放在顶端，往下逐行写：每行两端补 1，中间的数由上一行相邻两数相加。写出的三角形前几行是 1；1 1；1 2 1；1 3 3 1；1 4 6 4 1。第 <Katex tex="n" /> 行第 <Katex tex="k" /> 个数正是 <Katex tex="\mathrm{C}_n^k" />。</p>
    <p>「肩上两数相加」这条规则就是帕斯卡恒等式，它的组合解释在恒1 给出：从 <Katex tex="n" /> 个元素里取 <Katex tex="k" /> 个，按某个指定元素取没取分成两类，一类 <Katex tex="\mathrm{C}_{n-1}^{k-1}" /> 种、另一类 <Katex tex="\mathrm{C}_{n-1}^{k}" /> 种。图 项2 的每个数都可以这样追到上一行。</p>

    <h3 class="sec" id="b2-sym">对称与增减</h3>
    <p>同一行里 <Katex tex="\mathrm{C}_n^k=\mathrm{C}_n^{\,n-k}" />，三角形左右对称。数值从两端向中间先增后减：两端是 1，往里走每一步乘的因子大于 1，过了中点再走就小于 1。图 项2 拖动 <Katex tex="k" /> 时金色与蓝色两数同步，就是一个直接印证。</p>
    <p>这个增减规律也可以由相邻两项之比看出：<Katex tex="\dfrac{\mathrm{C}_n^{k+1}}{\mathrm{C}_n^k}=\dfrac{n-k}{k+1}" />。比值大于 1 当且仅当 <Katex tex="k" /> 小于 <Katex tex="\dfrac{n-1}{2}" />，所以最大值落在中点附近。</p>

    <h3 class="sec" id="b2-max">最大系数</h3>
    <p><Katex tex="n" /> 为偶数时，中间一项 <Katex tex="\mathrm{C}_n^{n/2}" /> 最大；<Katex tex="n" /> 为奇数时，正中间的两项 <Katex tex="\mathrm{C}_n^{(n-1)/2}" /> 与 <Katex tex="\mathrm{C}_n^{(n+1)/2}" /> 并列最大。例如 <Katex tex="n=6" /> 时最大的是 20，<Katex tex="n=5" /> 时中间两项都是 10。</p>
    <p>注意这里的「最大」指二项式系数。若括号里带倍数或负号，项的系数还要乘上 <Katex tex="a" />、<Katex tex="b" /> 带来的因子，最大项的位置可能偏移，要按相邻两项之比的符号重新判断。</p>

    <h3 class="sec" id="b2-pit">行号与最大项</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：行号从 0 开始。</strong>顶端单独的一个 1 是第 0 行，<Katex tex="(a+b)^n" /> 对应第 <Katex tex="n" /> 行，不是第 <Katex tex="n+1" /> 行。</li>
        <li><strong>提示二：每行项数比行号大 1。</strong>第 6 行有 7 项，写到 6 就停会少一项。</li>
        <li><strong>提示三：奇数行的中间项有两个。</strong>只报一个数字不算答完，两个都要写。</li>
        <li><strong>提示四：行和与项的系数和不是同一件事。</strong>行和 <Katex tex="2^n" /> 是二项式系数之和；项的系数和要看展开式里每个系数，由赋值法给出，见项3。</li>
      </ul>
    </div>
    <p>回收与预告：项1 的展开系数在这里排成行，对称与增减一眼读出。项3 换一条路子求整个三角形的行和——不逐个相加，而是在展开式里给字母赋一个数，一步得到 <Katex tex="2^n" />。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPascalTri } from '../../../boards/combinatorics/binomial/pascaltri.js';
import { CB_CHAPTERS } from './cbnav.js';
</script>
