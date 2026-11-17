<template>
  <ChPage :cur="1" no="数1" base="/probability/n" :chapters="NUM_CHAPTERS"
    title="数学期望"
    sub="分布列写全以后，仍需一个数来概括「平均会得到什么」。数学期望就是按概率加权的平均，也就是分布列的重心。"
    :toc="[{ id: 'n1-def', t: '期望的定义' }, { id: 'n1-balance', t: '重心与平衡' }, { id: 'n1-prop', t: '期望的线性性质' }, { id: 'n1-pit', t: '期望不是必然结果' }]">
    <div class="note good" id="n1-def">设离散型随机变量 <Katex tex="X" /> 的分布列为 <Katex tex="P(X=x_i)=p_i\ (i=1,2,\dots,n)" />，则称
      <Katex tex="E(X)=x_1p_1+x_2p_2+\cdots+x_np_n" /> 为 <Katex tex="X" /> 的<b>数学期望</b>，简称期望。它是一列「取值 × 概率」之和，本质是以概率为权重的平均。</div>
    <div class="board-wrap">
      <BoardMount :factory="createExpectLab" />
      <div class="cap">图 数1 · <b>数学期望</b>：横梁上挂着四块重物，位置是取值 0、1、2、3，重量是各自的概率。四个滑块改权重，概率按「该项权重 ÷ 总权重」归一化。看点：金色三角支点自动落在 <Katex tex="E(X)" /> 处，两侧「概率 × 距离」之和始终相抵，横梁才能水平；把权重全压到右侧，支点跟着右移；把中间的权重加大，支点向中间收拢。期望落在两个取值之间是常事，不必是分布列里的某个数。</div>
    </div>

    <h3 class="sec" id="n1-def">期望的定义</h3>
    <p>一个随机变量可以取很多值，把每个取值乘上它出现的概率再相加，得到的数就是「长期反复取值时的平均值」。掷一枚均匀骰子，<Katex tex="E(X)=\frac16(1+2+3+4+5+6)=3.5" />，骰子当然掷不出 3.5，但掷足够多次后点数的算术平均会稳定在 3.5 附近。这就是期望与普通平均数的联系：前者是理论值，后者是它的实测近似。</p>
    <p>对二项分布 <Katex tex="X\sim B(n,p)" />，期望有简洁的形式 <Katex tex="E(X)=np" />。验证的方法是把 <Katex tex="k\binom{n}{k}=n\binom{n-1}{k-1}" /> 代入定义，再用二项式定理求和。直观上也说得通：n 次试验每次成功的概率都是 p，加起来平均成功 np 次。超几何分布的期望是 <Katex tex="E(X)=n\cdot\frac{M}{N}" />，与「放回抽取」的二项分布同形。</p>
    <p>连续型随机变量的期望换成积分：<Katex tex="E(X)=\int_{-\infty}^{+\infty}xf(x)\,\mathrm{d}x" />。均匀分布 <Katex tex="[a,b]" /> 的期望是区间中点 <Katex tex="\frac{a+b}{2}" />；正态分布 <Katex tex="N(\mu,\sigma^2)" /> 的期望就是 <Katex tex="\mu" />。</p>

    <h3 class="sec" id="n1-balance">重心与平衡</h3>
    <p>把分布列想成一根无重量的横梁，在取值 <Katex tex="x_i" /> 处挂上重量 <Katex tex="p_i" />。支点放在 <Katex tex="E(X)" /> 处时，两侧的力矩相等：<Katex tex="\sum_i p_i(x_i-E(X))=0" />。左边恰是定义式乘以 1 后移项的结果。所以期望就是分布的重心 —— 这与物理学里的质心公式完全一致，只是质量换成了概率。</p>
    <p>图 数1 把这个平衡画成了实物。拖动四个权重时，支点位置随之移动：哪一侧的重物更沉，支点就向哪一侧偏；四块一样重时支点落在正中 1.5。注意概率之和恒为 1，所以横梁的总重量不变，只有分布的位置在变。</p>

    <h3 class="sec" id="n1-prop">期望的线性性质</h3>
    <p>期望最重要的性质是线性的：对任意常数 <Katex tex="a,b" />，有 <Katex tex="E(aX+b)=aE(X)+b" />。两个随机变量的和也满足 <Katex tex="E(X+Y)=E(X)+E(Y)" />，这一条不需要 <Katex tex="X" /> 与 <Katex tex="Y" /> 独立，是期望好用之处。</p>
    <p>由线性性质可以快速处理变形后的随机变量。若 <Katex tex="X\sim B(n,p)" /> 且 <Katex tex="Y=2X+1" />，则 <Katex tex="E(Y)=2np+1" />，不必重新列 <Katex tex="Y" /> 的分布列。多次试验的成功次数也可以拆成 n 个 0-1 变量之和再相加，这正是 <Katex tex="E(X)=np" /> 的另一种推导。</p>
    <p>要注意的是，乘积的期望不能随便拆开。<Katex tex="E(XY)=E(X)E(Y)" /> 只在 <Katex tex="X" /> 与 <Katex tex="Y" /> 独立时成立，这一点在 数3 讨论协方差时还会再遇到。</p>

    <h3 class="sec" id="n1-pit">期望不是必然结果</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把期望当作一定取到的值。</strong>期望 3.5 的骰子掷不出 3.5，期望 0.6 的命中次数也不会出现 0.6 次。期望是对长期平均的描述，不是对单次结果的预言。</li>
        <li><strong>提示二：忘记按概率加权。</strong>直接把各取值相加再除以个数，得到的是「各取值等可能」时的平均。若分布列不均匀，必须逐项乘概率，否则与真实期望差得很远。</li>
        <li><strong>提示三：期望相同就认为分布相同。</strong><Katex tex="E(X)" /> 只概括了位置，不反映分散程度。两个分布的期望可以都等于 2，却一个集中、一个分散，区别要靠 数2 的方差补上。</li>
        <li><strong>提示四：对非线性的变形照搬线性性质。</strong><Katex tex="E(X^2)" /> 通常不等于 <Katex tex="E(X)^2" />，两者相差一个方差。涉及平方、倒数、分式的期望，都要回到分布列逐项计算。</li>
      </ul>
    </div>
    <p>回收与预告：期望给出了分布的位置，却没有说明它有多集中。数2 把「偏离期望的平方」按概率平均，得到方差；方差开方就是标准差，它与期望一起构成描述随机变量的两个最基本的数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createExpectLab } from '../../../boards/probability/num/expectlab.js';
import { NUM_CHAPTERS } from './numnav.js';
</script>
