<template>
  <ChPage :cur="5" no="级5" base="/calc1/s" :chapters="SN_CHAPTERS"
    title="傅里叶级数初步"
    sub="任何有周期的波形都能拆成一串正弦余弦；方波的例子最清楚：只取奇次谐波，就能把它描出轮廓。"
    :toc="[{ id: 's5-coef', t: '系数怎么算' }, { id: 's5-square', t: '方波的展开' }, { id: 's5-gibbs', t: '跳变处的超调' }, { id: 's5-link', t: '与泰勒、帕塞瓦尔' }]">

    <div class="note good" id="s5-idea">若 <Katex tex="f" /> 以 <Katex tex="2\pi" /> 为周期且可展开，则 <Katex tex="f(x)=\dfrac{a_0}{2}+\sum\limits_{n=1}^{\infty}\left(a_n\cos nx+b_n\sin nx\right)" />。这串三角函数的周期都是 <Katex tex="2\pi" /> 的整数分之一，把它们按不同权重叠起来，就能拼出各种波形。展开中的每一项叫一次<b>谐波</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createFourier" />
      <div class="cap">图 级5 · <b>傅里叶级数</b>：蓝虚线是方波本身，金色实线是截到第 <Katex tex="K" /> 次谐波的部分和，橙点标出当前的峰值。<b>看点</b>：每添一对奇次谐波，直角的棱角就更清楚一分，可跳变附近的尖峰始终高出方波一截，项数再多也不消失。</div>
    </div>

    <h3 class="sec" id="s5-coef">系数怎么算</h3>
    <p>系数由积分给出。用 <Katex tex="\cos mx" /> 乘两边再在一个周期上积分，三角函数的正交性把其余项全部消去，只剩 <Katex tex="a_m" /> 那一项：</p>
    <p style="text-align:center"><Katex display tex="a_n=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos nx\,\mathrm{d}x,\qquad b_n=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin nx\,\mathrm{d}x" /></p>
    <p>正交性说的是：不同频率的正弦（或余弦）在一个周期上的乘积积分为零，同频率的乘积积分为 <Katex tex="\pi" />。这条性质与向量正交分解的结构完全一样——把函数看成无穷维空间里的向量，<Katex tex="a_n" />、<Katex tex="b_n" /> 就是它在各个基方向上的投影系数。</p>
    <p>这也解释了为什么正弦与余弦要分开算：两者的正交性不同，各自捕捉函数中「关于原点对称」与「关于 y 轴对称」的成分。奇函数的展开只有正弦项，偶函数的展开只有常数项与余弦项，省下一半积分。</p>

    <h3 class="sec" id="s5-square">方波的展开</h3>
    <p>取 <Katex tex="f(x)=-1" />（<Katex tex="-\pi<x<0" />）与 <Katex tex="f(x)=1" />（<Katex tex="0<x<\pi" />）。它是奇函数，所有 <Katex tex="a_n=0" />；<Katex tex="b_n=\dfrac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin nx\,\mathrm{d}x=\dfrac{4}{n\pi}" />（<Katex tex="n" /> 为奇数），偶数项为零。</p>
    <p style="text-align:center"><Katex display tex="f(x)=\frac{4}{\pi}\left(\sin x+\frac{\sin 3x}{3}+\frac{\sin 5x}{5}+\cdots\right)" /></p>
    <p>图 级5 初始只取基波，是一条光滑正弦；加上三次、五次谐波后，曲线在中间段变平、在两端变陡，逐渐逼近方波。这串系数按 <Katex tex="1/n" /> 衰减，所以方波的展开收敛得并不快，想要边角锐利就要取很多项。</p>
    <p>这也提示了系数衰减速度与函数光滑程度之间的关系：函数越光滑，系数衰减越快；方波有跳变，系数只能按 <Katex tex="1/n" /> 走；若是连续但导数不连续（如三角波），系数按 <Katex tex="1/n^2" /> 走，几项就能贴住。</p>

    <h3 class="sec" id="s5-gibbs">跳变处的超调</h3>
    <p>把项数一路加大，方波的主体部分越描越准，跳变点附近却始终留着两道尖峰，峰值约高出方波 <Katex tex="9\%" /> 的高度。加多少项，这个比例都不变，只是尖峰被挤得更窄——这就是<b>吉布斯现象</b>。</p>
    <p>它说明这里的一致收敛不成立：部分和的最大偏差不趋于零，尽管在每一处固定点上部分和都收敛到函数值。要让它一致收敛，需要额外加一项平滑处理（如费耶平均），或者在均方意义下讨论。</p>
    <p>这与级3 的莱布尼茨估计是两回事：那里误差被下一项压住，这里误差的上界是一道常数的百分比。<Katex tex="1/n" /> 型系数带来的正是这种「点态收敛、一致不收敛」的局面。</p>

    <h3 class="sec" id="s5-link">与泰勒级数、帕塞瓦尔等式</h3>
    <p>傅里叶级数与泰勒级数都是「用一族简单函数逼近给定函数」，但选基不同：泰勒用 <Katex tex="x^n" />，只在展开点附近有效；傅里叶用 <Katex tex="\sin nx" />、<Katex tex="\cos nx" />，在整个周期上都能用。基的选择由函数的性质决定，对周期函数用幂级数就不合适了。</p>
    <p>把两边平方再积分，得到帕塞瓦尔等式：<Katex tex="\dfrac{1}{\pi}\int_{-\pi}^{\pi}f^2\,\mathrm{d}x=\dfrac{a_0^2}{2}+\sum(a_n^2+b_n^2)" />。它说的是能量守恒——函数在一个周期上的平方积分等于各次谐波的能量之和。这与向量长度等于各坐标平方和是同一件事，正交分解的想法在这里又出现了一次。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：奇偶性先看，能省一半积分。</strong>奇函数的余弦系数与常数项都是零，偶函数的正弦系数都是零。</li>
        <li><strong>提示二：周期要先统一。</strong>函数的周期若不是 <Katex tex="2\pi" />，须先做伸缩换元，把周期折成 <Katex tex="2\pi" /> 再套公式。</li>
        <li><strong>提示三：跳变点上的收敛值是两侧的平均。</strong>方波在 <Katex tex="x=0" /> 处部分和收敛到 0，而函数在那里左值 −1、右值 1，取值按两侧平均处理。</li>
        <li><strong>提示四：系数衰减速度看光滑度。</strong>有跳变的函数系数按 <Katex tex="1/n" /> 衰减，连续函数更快；想要少取几项，函数得先足够光滑。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFourier } from '../../../boards/calc1/series/fourier.js';
import { SN_CHAPTERS } from './snav.js';
</script>
