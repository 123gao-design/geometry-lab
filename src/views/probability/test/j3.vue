<template>
  <ChPage :cur="3" no="检3" base="/probability/j" :chapters="TEST_CHAPTERS"
    title="正态分布下的均值检验"
    sub="样本均值本身就带随机性。若总体服从正态分布，它的分布可以精确写出，检验因此变成在一条钟形曲线上量一段面积。"
    :toc="[{ id: 'j3-se', t: '样本均值的分布与标准误' }, { id: 'j3-z', t: 'z 统计量' }, { id: 'j3-side', t: '双侧与单侧' }, { id: 'j3-pit', t: '易错点' }]">
    <div class="note good" id="j3-se">设总体服从 <Katex tex="N(\mu,\sigma^2)" />，从中抽取容量为 <Katex tex="n" /> 的样本，则样本均值 <Katex tex="\bar X" /> 服从 <Katex tex="N\!\left(\mu,\dfrac{\sigma^2}{n}\right)" />。比值 <Katex tex="\dfrac{\sigma}{\sqrt n}" /> 称为<b>标准误</b>。
      检验 <Katex tex="H_0:\mu=\mu_0" /> 时，使用统计量 <Katex tex="z=\dfrac{\bar x-\mu_0}{\sigma/\sqrt n}" />，在 <Katex tex="H_0" /> 成立时它服从标准正态分布。</div>
    <div class="board-wrap">
      <BoardMount :factory="createZTest" />
      <div class="cap">图 检3 · <b>均值检验机</b>：上图是 <Katex tex="H_0" /> 成立时 <Katex tex="z" /> 的分布，红色面积是显著性水平 0.05 对应的拒绝域；下图把观测值 <Katex tex="z" /> 之外的面积涂成金色，就是 p 值。三档切换双侧与单侧，两个滑块控制样本均值与样本量。看点：固定 <Katex tex="\bar x" /> 不变，把样本量从 4 调到 36，标准误缩小到三分之一，<Katex tex="z" /> 随之放大 —— 同一份偏离在更大的样本里更有说服力。换成单侧，拒绝域只占一侧，同样的 <Katex tex="z" /> 更容易显著。</div>
    </div>

    <h3 class="sec" id="j3-se">样本均值的分布与标准误</h3>
    <p>样本均值是对总体均值的估计，它随抽到的样本变化。这个随机变量的期望仍是 <Katex tex="\mu" />，方差却是 <Katex tex="\sigma^2/n" /> —— 样本量越大，均值越稳定地靠近总体均值，这就是「大样本更可靠」的定量表述。</p>
    <p>标准误 <Katex tex="\sigma/\sqrt n" /> 衡量的是「样本均值离总体均值有多远」。它与 <Katex tex="\sqrt n" /> 成反比：样本量翻四倍，标准误减半。这个平方根规律意味着精度的提高越来越贵 —— 要把误差减半，代价是四倍的样本量。</p>
    <p>即使总体不服从正态分布，由中心极限定理，样本量较大时 <Katex tex="\bar X" /> 也近似服从正态分布。所以这套检验在样本量足够大时适用范围相当宽。样本量多大算「足够」，取决于总体分布偏离正态的程度，偏得越厉害需要的样本越多。</p>

    <h3 class="sec" id="j3-z">z 统计量</h3>
    <p>把 <Katex tex="\bar x" /> 减去 <Katex tex="\mu_0" /> 再除以标准误，得到的是标准化的偏离量。标准化的好处是量纲被消掉，不同单位、不同样本量下的偏离都落在同一把尺子上，可以直接和 1.96、1.645 这些固定的数比较。</p>
    <p><Katex tex="z" /> 的含义是「观测到的均值偏离了 <Katex tex="H_0" /> 设定值几个标准误」。由切比雪夫不等式，偏离超过 2 个标准误的概率已不足 0.25，超过 1.96 个标准误的概率恰好是 0.05（正态分布下）。<Katex tex="z" /> 的绝对值越大，数据越不像来自 <Katex tex="H_0" />。</p>
    <p>若总体方差未知而样本量较大，可以用样本标准差 <Katex tex="s" /> 代替 <Katex tex="\sigma" />；样本量较小时这种代替会带来额外误差，需要改用 <Katex tex="t" /> 分布，临界值比正态分布的略大。</p>

    <h3 class="sec" id="j3-side">双侧与单侧</h3>
    <p>双侧检验的拒绝域分在两端，各占 <Katex tex="\alpha/2" />，临界值为 <Katex tex="\pm 1.96" />（<Katex tex="\alpha=0.05" />）。它回答「均值是否等于 <Katex tex="\mu_0" />」，偏离无论朝哪个方向都算证据。</p>
    <p>单侧检验把全部 <Katex tex="\alpha" /> 放在一侧，临界值为 1.645。右侧检验回答「均值是否大于 <Katex tex="\mu_0" />」，左侧检验回答「是否小于」。同样的 <Katex tex="\bar x" />，单侧检验的 p 值正好是双侧的一半，也更容易显著。</p>
    <p>选双侧还是单侧不由数据决定，而由问题本身决定。若事先就知道偏离只可能朝一个方向（例如新工艺只会提高良品率），用单侧；若两个方向都有意义，必须用双侧。看完数据再挑方向，会把第一类错误的实际概率放大到名义值的两倍。</p>

    <h3 class="sec" id="j3-pit">易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：用样本标准差时忘了除以 <Katex tex="\sqrt n" />。</strong>标准误是 <Katex tex="\sigma/\sqrt n" />，不是 <Katex tex="\sigma" />。漏掉 <Katex tex="\sqrt n" />，<Katex tex="z" /> 会被缩小 <Katex tex="\sqrt n" /> 倍，结论偏向「不显著」。</li>
        <li><strong>提示二：把 <Katex tex="z" /> 大当成效应大。</strong><Katex tex="z" /> 同时受偏离与样本量影响。样本量很大时，微不足道的偏离也能给出极大的 <Katex tex="z" />。统计显著不等于实际重要。</li>
        <li><strong>提示三：小样本用正态临界值。</strong>总体方差未知、样本量又小时，用 <Katex tex="s" /> 代替 <Katex tex="\sigma" /> 后统计量服从 <Katex tex="t" /> 分布，尾部比正态更厚。继续用 1.96 会使实际的第一类错误率超过 5%。</li>
        <li><strong>提示四：把「不拒绝」当成「相等」。</strong>样本量小时，标准误大，<Katex tex="z" /> 天然偏小，检验几乎没有能力发现差异。不拒绝只说明数据没给出足够的证据。</li>
      </ul>
    </div>
    <p>回收与预告：至此概率与统计的主干已经走过一遍 —— 从样本空间与事件的运算（概1）到随机变量与分布（分1..分4），从数字特征（数1..数3）到用样本估计与检验（统1..统3、检1..检3）。这条线可以概括成一句：用概率描述随机性，用数据反过来推断概率。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createZTest } from '../../../boards/probability/test/ztest.js';
import { TEST_CHAPTERS } from './testnav.js';
</script>
