<template>
  <ChPage :cur="4" no="分4" base="/probability/r" :chapters="RV_CHAPTERS"
    title="卡方分布与其他分布"
    sub="正态变量的平方和不再是正态的，它服从卡方分布。这条右偏的曲线在独立性检验里反复出现，图上的上侧面积就是检验中所说的 p 值。"
    :toc="[{ id: 'r4-def', t: '卡方分布的定义' }, { id: 'r4-shape', t: '自由度与密度形状' }, { id: 'r4-tail', t: '上侧面积与临界值' }, { id: 'r4-pit', t: '自由度的算法' }]">
    <div class="note good" id="r4-def">设 <Katex tex="Z_1,Z_2,\dots,Z_k" /> 相互独立且都服从标准正态分布 <Katex tex="N(0,1)" />，则
      <Katex tex="\chi^2=Z_1^2+Z_2^2+\cdots+Z_k^2" /> 服从自由度为 <Katex tex="k" /> 的<b>卡方分布</b>，记作 <Katex tex="\chi^2\sim\chi^2(k)" />。它的密度为
      <Katex tex="f(x)=\dfrac{1}{2^{k/2}\Gamma(k/2)}x^{\frac{k}{2}-1}\mathrm{e}^{-\frac{x}{2}},\quad x&gt;0" />，曲线只在正半轴上，右偏。</div>
    <div class="board-wrap">
      <BoardMount :factory="createChisqDist" />
      <div class="cap">图 分4 · <b>卡方分布机</b>：自由度 k 滑块改变整条曲线的形状与位置，分位点 x₀ 滑块把金色阴影的上侧面积实时读出。看点：k=1 时曲线在原点附近冲向无穷，k=2 时从 0.5 出发严格单调下降，k&gt;2 时出现峰，峰在 x=k−2 处；k 越大曲线越往右挪、越接近对称，中心与均值都为 k。阴影面积就是 P(χ²&gt;x₀)，检验时与显著性水平比大小。</div>
    </div>

    <h3 class="sec" id="r4-def">卡方分布的定义</h3>
    <p>正态变量取平方后仍是非负的，若干个相互独立的平方相加，就得到卡方变量。自由度 k 的直观含义是「独立的信息有几个」：每加一个平方项，自由度加 1。在拟合优度检验与独立性检验中，自由度由数据的类别数决定，见 检2。</p>
    <p>k=1 的情形可以与标准正态直接对照：<Katex tex="\Phi" /> 的正负两支被压到正半轴，密度在原点趋于无穷。k=2 时密度化为 <Katex tex="\tfrac12\mathrm{e}^{-x/2}" />，恰好是指数分布，所以从 0.5 开始单调下降；从 k=3 起才出现单个峰，峰的位置在 <Katex tex="k-2" />。</p>

    <h3 class="sec" id="r4-shape">自由度与密度形状</h3>
    <p>卡方分布的均值与方差有一个简洁的形式：<Katex tex="E(\chi^2)=k" />，<Katex tex="D(\chi^2)=2k" />。均值随自由度线性增长，说明 k 越大整条曲线越往右挪；图 分4 的青色刻度标出的就是均值位置，可以看着它与峰的位置相差 2。</p>
    <p>形状随 k 的变化是渐进的：k 小时严重右偏，重心偏左；k 增大后偏度减小，曲线越来越像对称的钟形。这与中心极限定理一致 —— 平方和是大量独立项之和，k 足够大时按正态律分布。实际查表用的 k 一般不过几十，右偏仍然明显。</p>

    <h3 class="sec" id="r4-tail">上侧面积与临界值</h3>
    <p>卡方分布只关心右尾。给定显著性水平 <Katex tex="\alpha" />，把满足 <Katex tex="P(\chi^2\ge\chi^2_\alpha)=\alpha" /> 的点 <Katex tex="\chi^2_\alpha" /> 叫上侧 <Katex tex="\alpha" /> 分位点，也叫临界值。图 分4 中把 x₀ 拖到临界值处，金色阴影的面积就等于 <Katex tex="\alpha" />。</p>
    <p>检验的判据由此而来：如果由样本算出的卡方值落在阴影里（大于临界值），说明「样本与假设相符」这件事发生的机会不足 <Katex tex="\alpha" />，于是在显著性水平 <Katex tex="\alpha" /> 下拒绝原假设；反之不拒绝。这一步的具体做法与两类错误的讨论留给 检1 与 检2。</p>
    <p>常用的临界值只记几个：自由度 1、显著性水平 0.05 时约 3.841；自由度 2 时约 5.991；自由度 4 时约 9.488。3.841 这个数在 2×2 列联表的独立性检验里出现得最多。</p>

    <h3 class="sec" id="r4-pit">自由度的算法</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把类别数当自由度。</strong>2×2 列联表的卡方统计量自由度是 <Katex tex="(2-1)(2-1)=1" />，不是 4，也不是 2。r×c 表的自由度一律是 <Katex tex="(r-1)(c-1)" />。</li>
        <li><strong>提示二：把卡方值直接当概率。</strong>卡方值是统计量，概率是曲线下 x₀ 右侧的面积，两者差一个积分。图 分4 两个滑块分别控制它们，可以看清这一点。</li>
        <li><strong>提示三：k=1、k=2 的曲线形态判断错。</strong>k=1 时密度在原点附近无穷，k=2 时没有峰、从 0.5 单调下降；只有 k&gt;2 才有峰，峰在 k−2。这三档在图 分4 上可以直接切换核对。</li>
        <li><strong>提示四：样本量小时套用卡方近似。</strong>独立性检验要求每个格子的期望频数不太小（通常要求不小于 5），否则卡方统计量的分布偏离 <Katex tex="\chi^2(k)" />，查出的临界值不可靠。</li>
      </ul>
    </div>
    <p>回收与预告：卡方分布把正态分布与检验连了起来。至此随机变量的轮廓已经齐全：离散型靠分布列，连续型靠密度曲线，卡方是正态平方和的产物。数1、数2 给出分布的两个数字特征 —— 期望与方差，数3 再把两个随机变量放在一起，讨论协方差与相关系数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChisqDist } from '../../../boards/probability/rv/chisqdist.js';
import { RV_CHAPTERS } from './rvnav.js';
</script>
