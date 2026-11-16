<template>
  <ChPage :cur="2" no="维2" base="/fractal/d" :chapters="FS_CHAPTERS"
    title="相似维数"
    sub="N 个缩到 r 倍的副本拼成整体，维数由 N 与 r 一起定：D=ln N/ln(1/r)。这条公式把维数从整数推到分数，康托集、科赫曲线、谢尔宾斯基三角各得一个数。"
    :toc="[{ id: 'd2-law', t: '幂律与维数公式' }, { id: 'd2-form', t: '三个标准例子的数值' }, { id: 'd2-uneq', t: '比例不相等的情形' }, { id: 'd2-tip', t: '四条提示' }]">
    <div class="note good">设自相似集 <Katex tex="K" /> 由 <Katex tex="N" /> 个相似比为 <Katex tex="r" /> 的副本组成，且满足开集条件。则 <Katex tex="K" /> 的相似维数为 <Katex display tex="D=\frac{\ln N}{\ln(1/r)}," /> 它是方程 <Katex tex="N r^{D}=1" /> 的唯一解。各副本比例 <Katex tex="r_1,\dots,r_N" /> 不全相等时，<Katex tex="D" /> 由 <Katex tex="\sum_{i=1}^{N}r_i^{D}=1" /> 唯一确定。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSimDim" />
      <div class="cap">图 维2 · <b>相似维数机</b>：每边分成 <Katex tex="m" /> 份，保留 <Katex tex="N" /> 格。看点：① 徽章 <Katex tex="D" /> 随 <Katex tex="N" /> 与 <Katex tex="m" /> 实时变化；② 校验徽章 <Katex tex="N r^{D}" /> 恒等于 1，公式不是拟合出来的；③ 四个预设按钮对应四种常见自相似集，读数与教科书的数值一致。</div>
    </div>

    <h3 class="sec" id="d2-law">幂律与维数公式</h3>
    <p>取 <Katex tex="K" /> 的一个 <Katex tex="r" /> 倍副本，它的「大小」应当按 <Katex tex="r^{D}" /> 缩水。整体由 <Katex tex="N" /> 个这样的副本无缝拼成，总大小不变，于是</p>
    <p style="text-align:center"><Katex display tex="N\cdot r^{D}=1\quad\Longrightarrow\quad D=\frac{\ln N}{\ln(1/r)}." /></p>
    <p>这就是相似维数。它与尺度的选取无关：把 <Katex tex="r" /> 换成 <Katex tex="r^k" />、<Katex tex="N" /> 换成 <Katex tex="N^k" />，比值不变。所以维数刻画的是「副本怎么填满整体」，而不是某一次具体测量。</p>
    <p>对整数维的集合，公式退化成熟悉的结果：线段 <Katex tex="N=k" />、<Katex tex="r=1/k" /> 给出 1；正方形 <Katex tex="N=k^2" /> 给出 2；立方体 <Katex tex="N=k^3" /> 给出 3。维数等于独立方向数。</p>

    <h3 class="sec" id="d2-form">三个标准例子的数值</h3>
    <p><b>三分康托集</b>：<Katex tex="N=2" />，<Katex tex="r=\tfrac13" />，<Katex tex="D=\ln2/\ln3\approx0.631" />。</p>
    <p><b>科赫曲线</b>：<Katex tex="N=4" />，<Katex tex="r=\tfrac13" />，<Katex tex="D=\ln4/\ln3\approx1.262" />。</p>
    <p><b>谢尔宾斯基三角</b>：<Katex tex="N=3" />，<Katex tex="r=\tfrac12" />，<Katex tex="D=\ln3/\ln2\approx1.585" />。</p>
    <p><b>谢尔宾斯基地毯</b>：<Katex tex="N=8" />，<Katex tex="r=\tfrac13" />，<Katex tex="D=\ln8/\ln3\approx1.893" />。</p>
    <p>四个数都不是整数。康托集的 0.631 说明它比点「胖」、比线段「瘦」；科赫曲线的 1.262 说明它比普通曲线更曲折；地毯的 1.893 已经接近平面，却仍未填满二维面积。</p>
    <p>再看一个常识：点集 <Katex tex="\{0\}" /> 的 <Katex tex="N=1" />，公式给出 0；整个正方形给出 2。0 与 2 正好是维数区间的两端。</p>

    <h3 class="sec" id="d2-uneq">比例不相等的情形</h3>
    <p>副本大小不同时，把公式写成求和：<Katex tex="\sum r_i^{D}=1" />。左边关于 <Katex tex="D" /> 严格递减，从 <Katex tex="N" /> 降到 0，所以解存在且唯一，用二分法就能算。</p>
    <p>取两段比例分别为 <Katex tex="\tfrac12" /> 与 <Katex tex="\tfrac14" /> 的自相似集，方程是</p>
    <p style="text-align:center"><Katex display tex="\left(\frac12\right)^{D}+\left(\frac14\right)^{D}=1." /></p>
    <p>令 <Katex tex="x=2^{-D}" />，得 <Katex tex="x+x^2=1" />，<Katex tex="x=\tfrac{\sqrt5-1}{2}" />，于是 <Katex tex="D=\log_2\tfrac{1+\sqrt5}{2}\approx0.694" />。黄金比例在这里冒出来，是因为两个缩放比刚好差一倍。</p>

    <h3 class="sec" id="d2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：公式有前提。</strong>只对满足开集条件的自相似集成立。若副本大面积重叠，<Katex tex="N r^{D}=1" /> 只是一条形式方程，解出来的数未必是维数。</li>
        <li><strong>提示二：<Katex tex="N" /> 与 <Katex tex="r" /> 必须配套。</strong>一步的 <Katex tex="N" /> 配一步的 <Katex tex="r" />，<Katex tex="n" /> 步的 <Katex tex="N^n" /> 配 <Katex tex="r^n" />。混着用会把答案放大或缩小整数倍。</li>
        <li><strong>提示三：维数不是测度。</strong><Katex tex="D" /> 只说「多快变稠」，不说「有多少」。康托集维数 0.631，长度却是 0；两个维数相同的集合，大小可以差得很远。</li>
        <li><strong>提示四：分数维不是算错了。</strong>看到 0.631、1.262 不要怀疑除错了，它们正是这些集合与普通线段、曲面的区别所在。</li>
      </ul>
    </div>
    <p>回收与预告：相似维数依赖「严格自相似」这个前提。遇到不自相似、或副本重叠的集合，需要一把更通用的尺子——不管集合怎么摆，都用方格网去盖，数出相交的格子数。这就是盒维数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSimDim } from '../../../boards/fractal/dim/simdim.js';
import { FS_CHAPTERS } from './fsnav.js';
</script>
