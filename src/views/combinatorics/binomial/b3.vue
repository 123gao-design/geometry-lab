<template>
  <ChPage :cur="3" no="项3" base="/combinatorics/b" :chapters="CB_CHAPTERS"
    title="赋值法与系数和"
    sub="在 (1+x)^n 的展开式里给 x 赋特殊值，整行系数就收成一个数：x=1 得 2^n，x=−1 得 0，两式合并便分出奇偶两半。"
    :toc="[{ id: 'b3-idea', t: '赋值法的思路' }, { id: 'b3-all', t: '全部系数之和' }, { id: 'b3-half', t: '奇偶项之和' }, { id: 'b3-pit', t: '赋值对象与符号' }]">
    <div class="note good" id="b3-idea">记 <Katex tex="f(x)=(1+x)^n" />，则 <Katex tex="f(1)=2^n" /> 是全部系数之和，<Katex tex="f(-1)=0" /> 是偶数项与奇数项系数之差；两式相加除以 2 得偶次项和，相减除以 2 得奇次项和。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCoefSumLab" />
      <div class="cap">图 项3 · <b>赋值法与系数和机</b>：每一项系数画成一根柱，偶次项蓝色、奇次项金色，柱高按平方根压缩。看点：拖 <Katex tex="n" /> 看整行柱子的和翻倍，蓝金两半的高矮始终一样多；下方的两行读数正是 <Katex tex="x=1" /> 与 <Katex tex="x=-1" /> 两个赋值的结果。</div>
    </div>

    <h3 class="sec" id="b3-idea">赋值法的思路</h3>
    <p>展开式是一个恒等式，对 <Katex tex="x" /> 的任何取值都成立。既然如此，给 <Katex tex="x" /> 挑一个好算的数代进去，恒等式就退化成一个关于系数的等式。挑 <Katex tex="x=1" /> 时所有 <Katex tex="x" /> 的幂都变成 1，系数自动相加；挑 <Katex tex="x=-1" /> 时幂的正负交替，奇偶项的符号一正一负。</p>
    <p>这套动作的前提是系数参与运算的形式要统一，所以先把式子整理成「系数乘以 <Katex tex="x" /> 的幂」的样子，再赋值。若括号里本身带常数，先写成 <Katex tex="(a+bx)^n" /> 的形式再定赋什么值。</p>

    <h3 class="sec" id="b3-all">全部系数之和</h3>
    <p>令 <Katex tex="x=1" />，<Katex tex="(1+1)^n=\mathrm{C}_n^0+\mathrm{C}_n^1+\cdots+\mathrm{C}_n^n=2^n" />。这正是杨辉三角第 <Katex tex="n" /> 行的和，与项2 的结论一致，但这里没有逐项相加。</p>
    <p>更一般地，对 <Katex tex="f(x)=a_0+a_1x+\cdots+a_nx^n" />，系数和恒等于 <Katex tex="f(1)" />。求 <Katex tex="(2x-1)^5" /> 的系数和，只需代入 <Katex tex="x=1" /> 得 <Katex tex="(2-1)^5=1" />，不必展开。</p>

    <h3 class="sec" id="b3-half">奇偶项之和</h3>
    <p>再令 <Katex tex="x=-1" />，得到 <Katex tex="\mathrm{C}_n^0-\mathrm{C}_n^1+\mathrm{C}_n^2-\cdots=0" />，即偶次项系数之和等于奇次项系数之和。两式相加得偶次项和为 <Katex tex="2^{n-1}" />，相减得奇次项和也为 <Katex tex="2^{n-1}" />。</p>
    <p>若只问「偶数项的系数和」而括号里带倍数，按同样的两式合并即可：<Katex tex="\dfrac{f(1)+f(-1)}{2}" /> 取偶数项，<Katex tex="\dfrac{f(1)-f(-1)}{2}" /> 取奇数项。图 项3 的蓝金两半正好对应这两式。</p>

    <h3 class="sec" id="b3-pit">赋值对象与符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：赋的是整理后的未知数。</strong><Katex tex="(1-2x)^n" /> 的系数和代入的是 <Katex tex="x=1" />，得 <Katex tex="(-1)^n" />；直接把 <Katex tex="x" /> 赋成 0 只会得到常数项。</li>
        <li><strong>提示二：奇偶项按指数分，不按位置分。</strong>「偶次项」指 <Katex tex="x" /> 的偶次幂那一项，若展开式里缺某些幂，位置序号与指数会错开。</li>
        <li><strong>提示三：系数和与二项式系数和不同。</strong><Katex tex="2^n" /> 是 <Katex tex="\mathrm{C}_n^k" /> 的和；带倍数括号的系数和另算，两者只在括号内字母系数为 1 时相等。</li>
        <li><strong>提示四：绝对值之和要另取。</strong>系数有正有负时，系数和可能是 0，绝对值之和却不是；后者相当于把负系数翻正，通常要按项的符号分段处理。</li>
      </ul>
    </div>
    <p>回收与预告：赋值法把「求和」化成「代一个数」，与数列里求和的整体代换是一条思路。恒1 换个场景，把二项式系数摆到网格上，用走路的条数重新解释帕斯卡恒等式；恒2 再把展开式用到近似与整除两头。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCoefSumLab } from '../../../boards/combinatorics/binomial/coefsumlab.js';
import { CB_CHAPTERS } from './cbnav.js';
</script>
