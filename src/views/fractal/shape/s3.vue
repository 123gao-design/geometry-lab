<template>
  <ChPage :cur="3" no="形3" base="/fractal/s" :chapters="FX_CHAPTERS"
    title="谢尔宾斯基三角形与地毯"
    sub="把「挖中间」搬到二维：三角每次挖掉中心倒三角，留 3 个半尺寸副本；方块每次挖掉中心九分之一，留 8 个三分之一副本。两者面积都趋于零，维数都落在 1 与 2 之间。"
    :toc="[{ id: 's3-tri', t: '谢尔宾斯基三角' }, { id: 's3-carpet', t: '谢尔宾斯基地毯' }, { id: 's3-3d', t: '门格尔海绵与高维推广' }, { id: 's3-tip', t: '四条提示' }]">
    <div class="note good"><b>谢尔宾斯基三角</b>：从正三角起，每次连接三边中点、挖去中心倒三角，保留 3 个边长为一半的小三角。极限集由 <Katex tex="N=3" />、<Katex tex="r=\tfrac12" /> 的副本组成，<Katex tex="D=\ln3/\ln2\approx1.585" />。<b>谢尔宾斯基地毯</b>：从正方形起，每次把每边三等分、挖去中心小方块，保留 8 个三分之一方块，<Katex tex="D=\ln8/\ln3\approx1.893" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSier" />
      <div class="cap">图 形3 · <b>谢尔宾斯基三角形与地毯</b>：三角形与地毯两种模式，红色是当前层挖掉的部分。看点：① 三角每层保留块数乘 3、面积乘 <Katex tex="3/4" />；② 地毯每层保留块数乘 8、面积乘 <Katex tex="8/9" />，收缩慢得多，所以维数更接近 2；③ 层数推到 4，红色空洞连成网格，剩下的蓝色只是一层「骨架」。</div>
    </div>

    <h3 class="sec" id="s3-tri">谢尔宾斯基三角</h3>
    <p>第 <Katex tex="n" /> 层由 <Katex tex="3^n" /> 个边长 <Katex tex="2^{-n}" /> 的正三角组成，总面积</p>
    <p style="text-align:center"><Katex display tex="A_n=\left(\frac34\right)^nA_0\to0." /></p>
    <p>面积趋于零，边界长度却在涨：第 <Katex tex="n" /> 层所有小三角的周长之和为 <Katex tex="3\cdot(3/2)^n" />，趋于无穷。极限集本身是一条「没有面积的骨架」，连通，而且道路连通——只是从一个角走到另一个角的路径，要连续挤过层层顶点。</p>
    <p>它满足自相似：整体是 3 个缩到一半的自身的并。开集条件成立（三个小三角只在顶点相触，取内缩的开三角即可），所以相似维数、盒维数都等于 <Katex tex="\ln3/\ln2" />。用 <Katex tex="2^{-k}" /> 的格子去盖，第 <Katex tex="k" /> 层恰好占 <Katex tex="3^k" /> 格，这个数可以手算验证。</p>

    <h3 class="sec" id="s3-carpet">谢尔宾斯基地毯</h3>
    <p>地毯的挖法把正方形分成九宫格，只挖中心一格，保留周围 8 格。第 <Katex tex="n" /> 层保留 <Katex tex="8^n" /> 个小方块，边长 <Katex tex="3^{-n}" />，总面积 <Katex tex="(8/9)^n\to0" />。</p>
    <p>维数 <Katex tex="\ln8/\ln3\approx1.893" />，比三角的 1.585 更接近 2。原因很直观：每层只损失 <Katex tex="1/9" /> 的面积，收缩慢，留下来的结构更「满」。</p>
    <p>地毯是连通的，而且道路连通：任意两点之间可以沿着保留的小方块绕行。它还有一个更强的性质——平面上的万有曲线：任何平面上的紧连通集都同胚于地毯的某个子集。它是拓扑学里构造反例的标准模型。</p>

    <h3 class="sec" id="s3-3d">门格尔海绵与高维推广</h3>
    <p>把挖法推广到三维：把正方体每边三等分，27 个小正方体中挖去每个面的中心格与体心格共 7 个，保留 20 个。极限集叫<b>门格尔海绵</b>，<Katex tex="N=20" />，<Katex tex="r=\tfrac13" />，</p>
    <p style="text-align:center"><Katex display tex="D=\frac{\ln20}{\ln3}\approx2.727." /></p>
    <p>海绵的体积趋于零，表面积却趋于无穷，维数落在 2 与 3 之间。它像一块被钻满孔的海绵：孔洞层层嵌套，任何平面截过去都得到一张地毯。</p>
    <p>一般地，在 <Katex tex="d" /> 维立方体里按固定模式保留 <Katex tex="N" /> 个 <Katex tex="1/m" /> 副本，就得到维数 <Katex tex="\ln N/\ln m" /> 的自相似集。调 <Katex tex="N" /> 与 <Katex tex="m" />，可以让维数取遍 0 到 <Katex tex="d" /> 之间的值。</p>

    <h3 class="sec" id="s3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：面积趋于零不代表集合消失。</strong>三角与地毯的面积都趋于零，但每层保留的块数在增长，极限集仍不可数、仍有复杂的连通结构。</li>
        <li><strong>提示二：保留比例决定维数。</strong>三角每层面积乘 3/4，地毯乘 8/9。收缩越慢，维数越接近 2。把 8 换成 9，地毯就变成整个正方形，维数正好 2。</li>
        <li><strong>提示三：维数相近，连通结构可以差很远。</strong>三角与地毯都连通、都道路连通，但三角的通道只剩顶点，地毯留着整条方格走廊。同维数不意味着同胚。</li>
        <li><strong>提示四：高维推广不是类比，是同一公式。</strong>海绵的 <Katex tex="\ln20/\ln3" /> 与三角的 <Katex tex="\ln3/\ln2" /> 用的是同一条 <Katex tex="N r^D=1" />，只是空间维数换了。</li>
      </ul>
    </div>
    <p>回收与预告：前面三个例子都由「挖空」得到，结构整齐、可以手算。把迭代从几何替换换成复平面上的平方映射，图像立刻变得不可预测——朱利亚集与曼德博集正是这样长出来的。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSier } from '../../../boards/fractal/shape/sierpinski.js';
import { FX_CHAPTERS } from './fxnav.js';
</script>
