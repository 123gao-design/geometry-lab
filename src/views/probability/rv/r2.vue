<template>
  <ChPage :cur="2" no="分2" base="/probability/r" :chapters="RV_CHAPTERS"
    title="二项分布与超几何分布"
    sub="同一件事重复做 n 次，成功次数服从二项分布；从有限总体中不放回地抽，抽到的某类个数服从超几何分布。两者公式不同，分界只在「放回不放回」。"
    :toc="[{ id: 'r2-binom', t: '独立重复试验与二项分布' }, { id: 'r2-shape', t: '二项分布的形状' }, { id: 'r2-hyper', t: '超几何分布' }, { id: 'r2-diff', t: '两类分布的分界' }]">
    <div class="note good" id="r2-binom">在相同条件下重复做 <Katex tex="n" /> 次试验，每次只有「成功」与「不成功」两种结果，各次相互独立，成功概率都是 <Katex tex="p" />。这样的试验叫 <Katex tex="n" /> 次<b>独立重复试验</b>（伯努利试验）。若 <Katex tex="X" /> 表示成功次数，则
      <Katex tex="P(X=k)=\binom{n}{k}p^k(1-p)^{n-k},\quad k=0,1,\dots,n" />，称 <Katex tex="X" /> 服从<b>二项分布</b>，记作 <Katex tex="X\sim B(n,p)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBinomDist" />
      <div class="cap">图 分2a · <b>二项分布</b>：n 次独立重复试验，每根柱子是恰有 k 次成功的概率。滑块改试验次数 n、单次概率 p 与观察的 k。看点：p=0.5 时柱形左右对称，峰落在 n/2；p 偏离 0.5，峰就偏向一侧；n 变大时柱子更密也更窄，最高的柱子对应的成功次数约为 (n+1)p。金色柱读出当前 k 的概率，青色描边标出最可能的成功次数。</div>
    </div>

    <h3 class="sec" id="r2-binom">独立重复试验与二项分布</h3>
    <p>公式的来历就是乘法原理与组合：n 次中恰有 k 次成功，先选出是哪 k 次，有 <Katex tex="\binom{n}{k}" /> 种选法；每种选法对应的概率都是 <Katex tex="p^k(1-p)^{n-k}" />，因为这些情形互斥，相加即得。取 <Katex tex="k" /> 为 0 与 n，两端分别是「一次都不成功」与「每次都成功」，概率为 <Katex tex="(1-p)^n" /> 与 <Katex tex="p^n" />。</p>
    <p>把 k 从 0 到 n 遍历，概率之和为 1，这正是二项式定理：<Katex tex="\sum_{k=0}^{n}\binom{n}{k}p^k(1-p)^{n-k}=(p+(1-p))^n=1" />。「二项分布」的名字也由此而来。这给出一个常用的检验：把算出的各个概率相加，若不为 1，必是某一项漏了或某一项乘错了。</p>
    <p>使用时先核对三个条件：试验次数固定为 n；每次只有两种结果；各次相互独立且成功概率不变。射击命中、产品合格、种子发芽都是常见场景。若每抽一次就少一个球，各次就不再独立，不能用二项分布。</p>

    <h3 class="sec" id="r2-shape">二项分布的形状</h3>
    <p>相邻两项之比 <Katex tex="\dfrac{P(X=k+1)}{P(X=k)}=\dfrac{n-k}{k+1}\cdot\dfrac{p}{1-p}" />。这个比值大于 1 时概率上升，小于 1 时下降，等于 1 时相邻两项相等。令比值等于 1 解出 <Katex tex="k=(n+1)p-1" />，可知概率在 <Katex tex="k" /> 接近 <Katex tex="(n+1)p" /> 时达到最大，最可能的成功次数就是不超过 <Katex tex="(n+1)p" /> 的最大整数。</p>
    <p>p=0.5 时比值化简为 <Katex tex="\dfrac{n-k}{k+1}" />，关于 <Katex tex="n/2" /> 对称，图 分2a 的柱形左右镜像。p&lt;0.5 时峰向左偏，右端迅速变矮；p&gt;0.5 时反过来。n 越大，柱子的分布越集中，概率高度随之降低 —— 总面积为 1，柱子变多只能变矮。</p>

    <div class="board-wrap">
      <BoardMount :factory="createHyperGeom" />
      <div class="cap">图 分2b · <b>超几何分布</b>：袋中 N 个球里有 M 个红球，一次抽出 n 个且不放回，柱子是恰抽到 k 个红球的概率。三个滑块分别改 N、M、n。看点：取值从 max(0, n−(N−M)) 到 min(n, M)，两端被红球数与蓝球数同时卡住；M 变大时整条柱形右移，n 接近 N 时几乎能确定抽到多少红球，柱子收窄成一根。</div>
    </div>

    <h3 class="sec" id="r2-hyper">超几何分布</h3>
    <p>从含 <Katex tex="M" /> 个红球的 <Katex tex="N" /> 个球中不放回地抽出 <Katex tex="n" /> 个，红球个数 <Katex tex="X" /> 的分布列为
      <Katex tex="P(X=k)=\dfrac{\binom{M}{k}\binom{N-M}{n-k}}{\binom{N}{n}}" />，其中 <Katex tex="k" /> 取遍使两个组合数都有意义的值。分子是「从 M 个红球中取 k 个、从 N−M 个蓝球中取 n−k 个」的取法数，分母是全部取法数。称 <Katex tex="X" /> 服从<b>超几何分布</b>。</p>
    <p>取值的上下限由图 分2b 的两个滑块共同决定：至少要抽 n−(N−M) 个红球，因为蓝球不够时可以一个都抽不到红球；至多抽到 min(n,M) 个。这两个边界在柱图上表现为两端突然截断，不会出现「概率为 0 的柱子」。</p>

    <h3 class="sec" id="r2-diff">两类分布的分界</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不放回却套二项公式。</strong>二项分布要求各次独立、成功概率恒定。不放回抽样时，每抽走一个红球，剩下的红球比例就变了，下次抽到的概率随之改变。图 分2b 中把 n 逐步加大，柱形与同参数的二项分布会明显分开。</li>
        <li><strong>提示二：总体很大时两式几乎一样。</strong>当 N 远大于 n 时，不放回造成的比例变化很小，超几何分布可以用二项分布近似（取 p=M/N）。这不是公式错误，而是近似条件，答题时若要说明应写清。</li>
        <li><strong>提示三：把「至少」直接代入。</strong><Katex tex="P(X\ge 1)" /> 不能套 <Katex tex="k=1" /> 的公式，它等于 <Katex tex="1-P(X=0)" />，或用 k 从 1 到上限逐项相加。</li>
        <li><strong>提示四：超几何的取值不连续地全取 0..n。</strong>蓝球不够时小 k 取不到，红球不够时大 k 取不到，逐项相加时要把这些项排除，否则和会小于 1。</li>
      </ul>
    </div>
    <p>回收与预告：两类分布各自给出了一整列概率，但实际比较两个分布时常只需要一两个数：平均能成功多少次、偏离平均值有多远。分3 转向连续型随机变量与正态分布，数1 与 数2 则给离散型分布配上期望与方差。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBinomDist } from '../../../boards/probability/rv/binomdist.js';
import { createBoard as createHyperGeom } from '../../../boards/probability/rv/hypergeom.js';
import { RV_CHAPTERS } from './rvnav.js';
</script>
