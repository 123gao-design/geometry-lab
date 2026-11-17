<template>
  <ChPage :cur="2" no="数2" base="/probability/n" :chapters="NUM_CHAPTERS"
    title="方差与标准差"
    sub="两个分布的期望可以相同，稳定程度却差得远。方差把「偏离期望的平方」按概率平均，标准差取它的平方根，两者一起度量取值有多分散。"
    :toc="[{ id: 'n2-def', t: '方差的定义' }, { id: 'n2-read', t: 'σ 带与稳定性' }, { id: 'n2-prop', t: '方差的性质' }, { id: 'n2-pit', t: '方差与单位' }]">
    <div class="note good" id="n2-def">设随机变量 <Katex tex="X" /> 的期望为 <Katex tex="E(X)" />，则称
      <Katex tex="D(X)=E\left[(X-E(X))^2\right]=\sum_{i}(x_i-E(X))^2p_i" /> 为 <Katex tex="X" /> 的<b>方差</b>，它的算术平方根 <Katex tex="\sigma(X)=\sqrt{D(X)}" /> 叫<b>标准差</b>。方差越大，取值越分散；标准差与 <Katex tex="X" /> 同单位，读起来更方便。</div>
    <div class="board-wrap">
      <BoardMount :factory="createVarLab" />
      <div class="cap">图 数2 · <b>方差与标准差</b>：取值固定为 0 到 4，权重按「离中心 2 越远越轻」分配，滑块控制这个衰减的速度。柱高是概率，金色带子是 μ±σ。看点：c=0 时五根柱等高，分布最分散，σ 最大；c 增大，外侧两根柱迅速变矮，中间那根升高，金带随之收窄。三个徽章分别读期望、方差与标准差 —— 期望始终是 2，变的只有分散程度。</div>
    </div>

    <h3 class="sec" id="n2-def">方差的定义</h3>
    <p>要刻画「分散」，自然会想到偏离期望的平均：<Katex tex="E(X-E(X))" />。可惜它恒等于零，因为正的偏离与负的偏离互相抵消。把偏离平方后再平均，符号问题就解决了，得到的正是方差。平方还有一个作用：放大了远处的偏离，使少数极端值对结果影响更大。</p>
    <p>实际计算常用另一个等价公式：<Katex tex="D(X)=E(X^2)-E(X)^2" />。它把「先求 <Katex tex="X^2" /> 的期望再减」写成一步，避免了先算每个偏离。用分布列计算时，把 <Katex tex="x_i^2p_i" /> 加起来得 <Katex tex="E(X^2)" />，减去 <Katex tex="E(X)" /> 的平方即可。两种算法结果相同，可作为互相检验。</p>
    <p>几个常见分布的标准结果：二项分布 <Katex tex="X\sim B(n,p)" /> 的方差是 <Katex tex="np(1-p)" />；两点分布（一次伯努利试验）的方差是 <Katex tex="p(1-p)" />；均匀分布 <Katex tex="[a,b]" /> 的方差是 <Katex tex="\frac{(b-a)^2}{12}" />；正态分布 <Katex tex="N(\mu,\sigma^2)" /> 的方差就是 <Katex tex="\sigma^2" />，这也是记号里写平方的原因。</p>

    <h3 class="sec" id="n2-read">σ 带与稳定性</h3>
    <p>标准差给出了「典型偏离」的量级。切比雪夫不等式说明：无论分布形状如何，落在 <Katex tex="\mu\pm2\sigma" /> 之外的概率不超过 <Katex tex="\frac14" />；对正态分布，这个概率只有约 4.55%。无论用哪条界，σ 小都意味着取值围绕期望更紧密。</p>
    <p>图 数2 中把滑块从 0 拖到 1.8，柱形由「五根等高」变成「中间一根独高」，σ 从约 1.41 一路降到 0.3 以下。期望始终在 2，但分布的稳定程度变化很大 —— 这正是只看期望不够的地方。</p>
    <p>实际应用里，方差与标准差用来比较稳定性：两台机器加工的零件尺寸，均值相同则标准差小的更稳定；两名射手的平均环数相同，标准差小的成绩更可靠。比较时先看均值，再看标准差，两个数一起读才有意义。</p>

    <h3 class="sec" id="n2-prop">方差的性质</h3>
    <p>由期望的线性性质可以推出：<Katex tex="D(aX+b)=a^2D(X)" />。加常数 <Katex tex="b" /> 只是整体平移，不改变分散程度；乘系数 <Katex tex="a" /> 把每个偏离放大 <Katex tex="|a|" /> 倍，平方后放大 <Katex tex="a^2" /> 倍。取 <Katex tex="a=-1" /> 可见 <Katex tex="D(-X)=D(X)" />，符号翻转不影响分散程度。</p>
    <p>两个随机变量之和的方差一般不能直接相加：<Katex tex="D(X+Y)=D(X)+D(Y)+2\operatorname{cov}(X,Y)" />，其中多出的一项正是协方差。只有当 <Katex tex="X" /> 与 <Katex tex="Y" /> 相互独立时协方差为零，才有 <Katex tex="D(X+Y)=D(X)+D(Y)" />。这条结论在 数3 会展开。</p>

    <h3 class="sec" id="n2-pit">方差与单位</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把方差与标准差混用。</strong>方差的单位是原单位的平方，量纲上与 <Katex tex="X" /> 不同；标准差与原变量同单位。描述分散程度时，说「标准差为 2 米」是对的，说「方差为 2 米」则不通。</li>
        <li><strong>提示二：以为期望大的方差也大。</strong>两者刻画不同的东西：期望管位置，方差管分散。把一组数据整体加上 100，期望增加 100，方差完全不变。</li>
        <li><strong>提示三：直接相加两个随机变量的方差。</strong><Katex tex="D(X+Y)=D(X)+D(Y)" /> 需要独立这一条件。若两者同向变化，协方差为正，和的方差会大于两者之和。</li>
        <li><strong>提示四：只比较均值就下结论。</strong>平均成绩相同并不说明水平相同，方差大的那组波动更大，极端成绩更多。决策时两个数要一起看，必要时还要看分布的形状。</li>
      </ul>
    </div>
    <p>回收与预告：方差公式里出现的协方差，正是刻画两个随机变量「一起变化」的量。数3 把它定义清楚，再除以两个标准差得到相关系数，从而把「同向或反向变化」的程度压缩到 −1 与 1 之间。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createVarLab } from '../../../boards/probability/num/varlab.js';
import { NUM_CHAPTERS } from './numnav.js';
</script>
