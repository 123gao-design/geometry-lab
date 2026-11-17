<template>
  <ChPage :cur="3" no="分3" base="/probability/r" :chapters="RV_CHAPTERS"
    title="连续型随机变量与正态分布"
    sub="取值充满一段区间时，分布列写不完。改用密度曲线，曲线下的面积就是概率；正态分布的密度是一条钟形曲线，由均值与标准差两个数完全决定。"
    :toc="[{ id: 'r3-dens', t: '密度曲线与面积' }, { id: 'r3-normal', t: '正态分布' }, { id: 'r3-sigma', t: '3σ 原则' }, { id: 'r3-pit', t: '密度与概率' }]">
    <div class="note good" id="r3-dens">若存在非负函数 <Katex tex="f(x)" />，使得随机变量 <Katex tex="X" /> 落在区间 <Katex tex="[c,d]" /> 内的概率等于曲线 <Katex tex="y=f(x)" /> 与该区间围出的面积，即
      <Katex tex="P(c\le X\le d)=\int_c^d f(x)\,\mathrm{d}x" />，则称 <Katex tex="X" /> 为<b>连续型随机变量</b>，<Katex tex="f(x)" /> 为它的<b>概率密度函数</b>。整条曲线下的总面积恒为 1。</div>
    <div class="board-wrap">
      <BoardMount :factory="createUniformDens" />
      <div class="cap">图 分3a · <b>连续型随机变量与密度</b>：这里取 [a,b] 上的均匀分布，密度是常数 1/(b−a)，区间外为零。四个滑块分别改分布的左右端点 a、b 与阴影区间的左右端点 c、d。看点：蓝色整块面积始终是 1；金色阴影的面积随区间长度成比例变化，徽章读出的概率恰是「阴影长 ÷ 分布区间长」。把 c、d 拖到分布区间之外，阴影截断，概率按落在 [a,b] 内的部分算。</div>
    </div>

    <h3 class="sec" id="r3-dens">密度曲线与面积</h3>
    <p>连续型随机变量不再有分布列，因为取值不可列。改用密度函数后，概率由面积给出：要算 <Katex tex="P(c\le X\le d)" />，就在曲线下方从 c 到 d 求面积。均匀分布是最简单的例子，密度在 <Katex tex="[a,b]" /> 上恒为 <Katex tex="\dfrac{1}{b-a}" />，面积就是矩形，概率等于长度占比，与几何概型的长度型完全一致。</p>
    <p>由此得到一个与离散情形很不同的结论：单个点的概率为零。点没有宽度，围出的面积是零，所以 <Katex tex="P(X=x_0)=0" />。这也意味着区间端点开闭不影响概率，<Katex tex="P(c\le X\le d)=P(c&lt;X&lt;d)" />，写题时不必纠结取不取等号。</p>
    <p>另外要注意，密度可以大于 1。均匀分布在 <Katex tex="b-a&lt;1" /> 时密度就超过 1，因为约束只要求总面积等于 1，不要求每个函数值都不超过 1。把密度值当成概率是常见的误解，密度只有积分出来才是概率。</p>

    <div class="board-wrap">
      <BoardMount :factory="createNormalDist" />
      <div class="cap">图 分3b · <b>正态分布</b>：密度曲线是钟形，μ 滑块沿横轴平移整条曲线，σ 滑块改变胖瘦。三个按钮切换阴影区间 μ±σ、μ±2σ、μ±3σ。看点：无论怎么拖，金色阴影都分别占 68.27%、95.45%、99.73%；σ 变小时曲线变尖变高，但曲线下总面积仍是 1，阴影比例只由 σ 的倍数决定，与 μ、σ 的具体值无关。</div>
    </div>

    <h3 class="sec" id="r3-normal">正态分布</h3>
    <p>若随机变量 <Katex tex="X" /> 的密度为
      <Katex tex="f(x)=\dfrac{1}{\sigma\sqrt{2\pi}}\mathrm{e}^{-\frac{(x-\mu)^2}{2\sigma^2}},\quad x\in\mathbb{R}" />，
      则称 <Katex tex="X" /> 服从<b>正态分布</b>，记作 <Katex tex="X\sim N(\mu,\sigma^2)" />。曲线关于直线 <Katex tex="x=\mu" /> 对称，在 <Katex tex="x=\mu" /> 处取最大值 <Katex tex="\dfrac{1}{\sigma\sqrt{2\pi}}" />；<Katex tex="\sigma" /> 越小曲线越尖，越大越平。两个拐点位于 <Katex tex="x=\mu\pm\sigma" />。</p>
    <p>正态分布由 <Katex tex="\mu" /> 与 <Katex tex="\sigma" /> 两个参数完全确定。<Katex tex="\mu" /> 决定位置，是分布的中心；<Katex tex="\sigma" /> 决定形状，刻画数据的分散程度。测量误差、同龄人的身高、零件的尺寸、考试成绩，大量实际数据都近似服从正态分布。</p>

    <h3 class="sec" id="r3-sigma">3σ 原则</h3>
    <p>把区间取成 <Katex tex="\mu" /> 的若干倍标准差，面积有固定的比例：<Katex tex="P(\mu-\sigma\le X\le\mu+\sigma)\approx 0.6827" />，<Katex tex="P(\mu-2\sigma\le X\le\mu+2\sigma)\approx 0.9545" />，<Katex tex="P(\mu-3\sigma\le X\le\mu+3\sigma)\approx 0.9973" />。这三个数在统计里反复出现，通常只记 68.3%、95.4%、99.7%。</p>
    <p>3σ 原则的用法是判断异常：一次观测若落在 <Katex tex="\mu\pm3\sigma" /> 之外，概率只有 0.0027，属于小概率事件，可以怀疑它来自别的分布，或者操作、记录出了问题。各类质量控制图设定的界限，基本都取在这条线上。</p>
    <p>一般区间的概率要先标准化：令 <Katex tex="Z=\dfrac{X-\mu}{\sigma}" />，则 <Katex tex="Z\sim N(0,1)" />，<Katex tex="P(a\le X\le b)=P\left(\dfrac{a-\mu}{\sigma}\le Z\le\dfrac{b-\mu}{\sigma}\right)" />。查标准正态分布表即可得到数值，这一步把 μ、σ 各不相同的正态问题统一到同一张表上。</p>

    <h3 class="sec" id="r3-pit">密度与概率</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把密度值当概率。</strong><Katex tex="f(x)" /> 可以大于 1，例如 σ=0.4 时峰值约 1.0，图上超过 1 是正常的。概率是曲线下的面积，不是曲线的高度。</li>
        <li><strong>提示二：认为 <Katex tex="P(X=\mu)" /> 最大。</strong>连续型随机变量取任何单点的概率都是 0，在 <Katex tex="\mu" /> 处也一样。密度最大只说明该点附近单位长度内落点的概率最大。</li>
        <li><strong>提示三：标准化时忘了除以 σ。</strong><Katex tex="Z=\dfrac{X-\mu}{\sigma}" /> 两步都要做：先减均值，再除以标准差。只减不除会把 σ 不同的数据混在一起比较。</li>
        <li><strong>提示四：把正态曲线当成任意钟形曲线。</strong>凡给出 <Katex tex="\mu" /> 与 <Katex tex="\sigma" /> 的正态分布，曲线形状完全确定，不能随手画一条形状不同却标同样参数的钟形线。</li>
      </ul>
    </div>
    <p>回收与预告：图 分3b 的第三条阴影由卡方分布一节还会用到 —— 正态变量的平方和服从卡方分布，而 3σ 原则里的面积换算，正是后面检验取临界值的依据。分4 把卡方分布补上。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createUniformDens } from '../../../boards/probability/rv/uniformdens.js';
import { createBoard as createNormalDist } from '../../../boards/probability/rv/normaldist.js';
import { RV_CHAPTERS } from './rvnav.js';
</script>
