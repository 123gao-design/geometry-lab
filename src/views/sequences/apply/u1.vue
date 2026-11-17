<template>
  <ChPage :cur="1" no="用1" base="/sequences/u" :chapters="UQ_CHAPTERS"
    title="增长、折损与分期付款"
    sub="存款、贷款、折旧都按同一条规则走：每一期的余额由上一期乘一个系数或加一个定额得到。把余额写成数列，通项就是复利、单利或等额还款的公式。"
    :toc="[{ id: 'u1-recur', t: '逐年写递推' }, { id: 'u1-compound', t: '复利与单利' }, { id: 'u1-install', t: '等额分期' }, { id: 'u1-pit', t: '期数、利率与取整' }]">
    <div class="note good">设本金为 <Katex tex="P" />，年利率为 <Katex tex="r" />。复利：<Katex tex="B_k=B_{k-1}(1+r)" />，<Katex tex="B_k=P(1+r)^k" />；单利：<Katex tex="B_k=B_{k-1}+Pr" />，<Katex tex="B_k=P(1+kr)" />；折损：<Katex tex="B_k=B_{k-1}(1-r)" />，<Katex tex="B_k=P(1-r)^k" />。三者都是等比或等差数列。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGrowth" />
      <div class="cap">图 用1 · <b>复利、单利与折损</b>：蓝柱是当年余额，金虚线是对照模式（复利与单利互相参照）。三种模式只差一个运算：复利每年乘 <Katex tex="1+r" />，单利每年加 <Katex tex="Pr" />，折损每年乘 <Katex tex="1-r" />。拖年数看两种增长方式的差距怎样逐年拉大。</div>
    </div>

    <h3 class="sec" id="u1-recur">逐年写递推</h3>
    <p>把每一期末的余额记作 <Katex tex="B_k" />。列递推式只须回答一个问题：从第 <Katex tex="k-1" /> 期到第 <Katex tex="k" /> 期，余额怎样变化？</p>
    <p>复利：上期余额先产生利息，再计入本金，所以 <Katex tex="B_k=B_{k-1}+rB_{k-1}=B_{k-1}(1+r)" />，是公比为 <Katex tex="1+r" /> 的等比数列，通项 <Katex tex="B_k=P(1+r)^k" />。</p>
    <p>单利：只有本金生息，利息不加回本金，所以每期增加同一个数 <Katex tex="Pr" />，<Katex tex="B_k=B_{k-1}+Pr" />，是公差为 <Katex tex="Pr" /> 的等差数列，通项 <Katex tex="B_k=P(1+kr)" />。</p>
    <p>折损：价值每期按固定百分比减少，<Katex tex="B_k=B_{k-1}(1-r)" />，公比为 <Katex tex="1-r" />。折损与复利是同一个模型的两个方向：把 <Katex tex="r" /> 换成 <Katex tex="-r" /> 即可互换。</p>
    <p>这三条都只是把 等1、比1 的通项公式套进具体情境。建模的难点不在求和，而在把文字里的「每年增长 5%」「每年减少 2000」翻译成「乘 1.05」「减 2000」，并确认首项是第 0 期还是第 1 期。</p>

    <h3 class="sec" id="u1-compound">复利与单利</h3>
    <p>同样本金、同样利率，复利的余额始终不低于单利。由二项式展开，<Katex tex="n\ge1" /> 时</p>
    <p style="text-align:center"><Katex tex="(1+r)^n=1+nr+\dfrac{n(n-1)}{2}r^2+\dots\ge 1+nr" display /></p>
    <p>等号只在 <Katex tex="n=1" /> 时成立（<Katex tex="r>0" />）。差额的第一个来源是「利息生利息」这一项 <Katex tex="\dfrac{n(n-1)}{2}r^2" />，它随 <Katex tex="n" /> 的平方增长。图 用1 叠放两条线，年份越久，金虚线与蓝柱之间的间距越大。</p>
    <p>反过来，折损按 <Katex tex="(1-r)^n" /> 衰减，速度也是指数式的：每期剩下的比例固定，绝对减少量却越来越小。若有人把「每年贬值 10%」误写成「每年减值本金的 10%」，就会得到一条直线而非指数曲线，这是建模题中最常见的误读。</p>

    <h3 class="sec" id="u1-install">等额分期</h3>
    <p>贷款 <Katex tex="A" /> 元，每期利率 <Katex tex="r" />，分 <Katex tex="n" /> 期等额还款，每期还 <Katex tex="x" /> 元。记第 <Katex tex="k" /> 期还款后的欠款为 <Katex tex="B_k" />，则</p>
    <p style="text-align:center"><Katex tex="B_k=B_{k-1}(1+r)-x,\qquad B_0=A,\qquad B_n=0" display /></p>
    <p>这正是 递2 的模型 <Katex tex="a_{k+1}=pa_k+q" />：<Katex tex="p=1+r" />，<Katex tex="q=-x" />。不动点为 <Katex tex="\dfrac{-x}{1-(1+r)}=\dfrac{x}{r}" />，平移后得</p>
    <p style="text-align:center"><Katex tex="B_k=\left(A-\dfrac{x}{r}\right)(1+r)^k+\dfrac{x}{r}" display /></p>
    <p>代入 <Katex tex="B_n=0" />，解出每期还款额</p>
    <p style="text-align:center"><Katex tex="x=\dfrac{Ar(1+r)^n}{(1+r)^n-1}" display /></p>
    <p>这个结果也可以从「还款的现值」角度看：第 <Katex tex="k" /> 期还的 <Katex tex="x" /> 元，折算到借款时只值 <Katex tex="\dfrac{x}{(1+r)^k}" />；把 <Katex tex="n" /> 期的现值相加，应等于 <Katex tex="A" />。两种算法得到同一个 <Katex tex="x" />，前者用递推，后者用等比求和。</p>
    <p>期数越多，每期还款越少，但利息总额越大。原因在公式的分母 <Katex tex="(1+r)^n-1" />：<Katex tex="n" /> 增大时分母增大，<Katex tex="x" /> 减小，而乘上 <Katex tex="n" /> 之后的总还款额反而增加。</p>

    <h3 class="sec" id="u1-pit">期数、利率与取整</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：首期是不是第 1 期。</strong><Katex tex="B_0" /> 是借款时的欠款，<Katex tex="B_1" /> 是还了第一期之后的欠款。若题目问「第 5 年末的余额」，要看这一年有没有存款、还款动作，别把 <Katex tex="B_5" /> 与 <Katex tex="B_4" /> 用混。</li>
        <li><strong>提示二：利率要与期数配套。</strong>年利率配年数，月利率配月数。题目给年利率、按月计息时，先除以 12 换成月利率，期数也换成月数，不能一边用年利率一边按月数算。</li>
        <li><strong>提示三：增长率的符号。</strong>增长用 <Katex tex="1+r" />，减少用 <Katex tex="1-r" />。把「下降 8%」写成 <Katex tex="1+0.08" /> 是最常见的符号错，代一年就能验出来。</li>
        <li><strong>提示四：实际问题要按题意取整。</strong>「至少存多少年才能买车」这类问题，解出 <Katex tex="n=4.3" /> 后应向上取整为 5 年；「最多能贷多少」则要向下取整。数学上的等号与实际的可行性往往差一期。</li>
        <li><strong>提示五：分期问题的最后一期。</strong>等额还款的公式假设每期还款额相同、末期恰好还清。若题目规定「最后一期结清余额」，末期金额一般与前面各期不等，要单独算，不能直接套公式。</li>
      </ul>
    </div>
    <p>回收与预告：复利是 比1 的等比数列，单利是 等1 的等差数列，等额分期是 递2 的构造法，三条模型都能追溯到前面的章节。用2 把数列放回函数与不等式的框架，讨论单调性与最值。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGrowth } from '../../../boards/sequences/apply/growth.js';
import { UQ_CHAPTERS } from './unav.js';
</script>
