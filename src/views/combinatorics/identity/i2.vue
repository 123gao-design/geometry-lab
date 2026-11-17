<template>
  <ChPage :cur="2" no="恒2" base="/combinatorics/i" :chapters="CI_CHAPTERS"
    title="近似计算与整除性"
    sub="(1+a)^n 的前两项是 1+na，从第三项起每一项都带着 a²。a 很小时后面的项小到可以舍去，得到近似值；a 是整数时，舍去的部分是 a² 的倍数。"
    :toc="[{ id: 'i2-layer', t: '展开式按次数分层' }, { id: 'i2-near', t: '近似计算' }, { id: 'i2-div', t: '整除性' }, { id: 'i2-pit', t: '误差与余项' }]">
    <div class="note good" id="i2-layer"><Katex tex="(1+a)^n=1+na+\mathrm{C}_n^2a^2+\cdots+a^n" />，从第三项起每项都含 <Katex tex="a^2" />，后 <Katex tex="n-1" /> 项之和可以写成 <Katex tex="a^2\cdot M" />，其中 <Katex tex="M" /> 是整数（<Katex tex="a" /> 为整数时）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBinomApp" />
      <div class="cap">图 恒2 · <b>近似计算与整除性</b>：各项画成柱，金色几根是保留的部分，其余淡色，柱高按平方根压缩到同一比例尺。看点：① 档 <Katex tex="a" /> 取小数，第三项以后迅速变矮，右上方另开一格把整段余项单独放大并读出量级，徽章给出截断值与真值；② 档 <Katex tex="a" /> 取整数，柱子一根比一根高、吃满画框，舍去的部分是 <Katex tex="a^2" /> 的整数倍，数值徽章把它拆成「前两项 + <Katex tex="a^2" /> 乘一个整数」。指数可取到 12。</div>
    </div>

    <h3 class="sec" id="i2-layer">展开式按次数分层</h3>
    <p>把展开式按 <Katex tex="a" /> 的次数分组：零次项 1，一次项 <Katex tex="na" />，二次及以上的项全归一处。分层的意义在于各层的量级差别：<Katex tex="a=0.01" /> 时一次项在百分位、二次项在万分级，越往后越小，看得见的只有前两三层。</p>
    <p>分层也解释了括号里的常数为什么重要——<Katex tex="(1+a)^n" /> 的形式把所有「主项」归到 1，剩下的全是小量。题目里遇到 <Katex tex="(1+x)^6" /> 或 <Katex tex="(1+0.02)^{10}" />，先化成这个形状再谈近似。</p>

    <h3 class="sec" id="i2-near">近似计算</h3>
    <p>舍去二次以上的项，得 <Katex tex="(1+a)^n\approx1+na" />；再保留二次项，得 <Katex tex="(1+a)^n\approx1+na+\mathrm{C}_n^2a^2" />。以 <Katex tex="(1.01)^5" /> 为例：<Katex tex="1+5\times0.01=1.05" />，加上二次项 <Katex tex="10\times0.0001=0.001" /> 得 1.051，真值 1.051010……，误差在十万分位。</p>
    <p>截断到第几项，由题目要求的精度决定：要求千分位就保留到二次项，要求百分位保留一次项即可。误差的大小有界——舍去的部分不超过首项的一个倍数，按 <Katex tex="a" /> 的量级估算即可。</p>

    <h3 class="sec" id="i2-div">整除性</h3>
    <p><Katex tex="a" /> 取整数时，<Katex tex="(1+a)^n=1+na+a^2M" />，<Katex tex="M" /> 是整数。于是除以 <Katex tex="a^2" /> 的余数与 <Katex tex="1+na" /> 相同；特别地，除以 <Katex tex="a" /> 的余数恒为 1，因为后两项都被 <Katex tex="a" /> 整除。</p>
    <p>经典用法是判断一个大数除以小数的余数：<Katex tex="91^{92}" /> 除以 100 的余数，先把 91 写成 <Katex tex="1-9" /> 或把底数拆成与模数相邻的数，再用二项展开截到需要的次数。<Katex tex="2^{100}" /> 除以 9 的余数则把 2 的幂拆成 <Katex tex="(1+2)^n" /> 一类结构，逐项看余。关键是让底数与模数凑成「差一个 1」的形状。</p>

    <h3 class="sec" id="i2-pit">误差与余项</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：截断要说明误差。</strong>只写近似值不算答完，题目要求近似时要给出精确到哪一位，或给出误差的界。</li>
        <li><strong>提示二：a 不能太大。</strong>近似只在 <Katex tex="|a|" /> 较小时可用，<Katex tex="a=1" /> 时各项同量级，舍一项就错得离谱。</li>
        <li><strong>提示三：整除问题里负的 a 要留符号。</strong><Katex tex="(1-a)^n" /> 的展开式符号交替，余项 <Katex tex="a^2M" /> 中的 <Katex tex="M" /> 可能为负，求余数时要化成非负余数。</li>
        <li><strong>提示四：余数是相对模数而言的。</strong>「除以 9 余 1」与「除以 3 余 1」是两个结论，模数不同不能互相替代。</li>
      </ul>
    </div>
    <p>回收与预告：项1 的通项在这里被拆成主项与余项，赋值法的思想（给字母指定特殊值）在整除问题里再次出现。组合学与二项式定理四个子专题到此收束：计数原理给出加法与乘法，排列组合把它们用到取与排，二项式定理把「取或不取」写成多项式，最后的恒等式与应用把这几样串成一条线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBinomApp } from '../../../boards/combinatorics/identity/binomapp.js';
import { CI_CHAPTERS } from './cinav.js';
</script>
