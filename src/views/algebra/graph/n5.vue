<template>
  <ChPage :cur="5" no="网5" base="/algebra/n" :chapters="AN_CHAPTERS"
    title="平面图与欧拉公式"
    sub="边只在顶点处相交的图画法叫平面图。连通平面图的顶点数、边数与面数满足 V−E+F=2，外部无界区域也算一个面。由它推出平面图的边数上限，K₅ 与 K₃,₃ 因此都画不到平面上。"
    :toc="[{ id: 'n5-planar', t: '平面图与面' }, { id: 'n5-euler', t: '欧拉公式' }, { id: 'n5-nonplanar', t: '边数上限与非平面图' }, { id: 'n5-tip', t: '四条提示' }]">
    <div class="note good">若图能画在平面上使边只在公共端点处相交，称它为<b>平面图</b>。这种画法把平面分成若干<b>面</b>，外部无界的那块也算一个。连通平面图满足<b>欧拉公式</b> <Katex tex="V-E+F=2" />。对简单平面图（<Katex tex="V\ge3" />）由此得 <Katex tex="E\le3V-6" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPlanar" />
      <div class="cap">图 网5 · <b>面数核验机</b>：正 n 边形从一个顶点向其余顶点引对角线，剖成扇形三角块。看点：① 每加一个顶点，V 增 1、E 增 2、F 增 1；② 各块用浅色分开，外部区域就是那个无界的面；③ 底部 V−E+F 始终保持 2。</div>
    </div>

    <h3 class="sec" id="n5-planar">平面图与面</h3>
    <p>平面性是画法性质，不是图本身的性质。同一个图换一种画法可能边就交叉，但只要存在一种不交叉的画法，它就是平面图。判断时要找的是那种画法。</p>
    <p>面由边围成，外部无界区域也计入。扇形的三角剖分是最省心的例子：每块面都是三角形，面数一眼可数。</p>
    <p>面的边界长度叫面的次数。简单平面图中每个面的次数至少为 3，把各面的次数相加得到 <Katex tex="2E" />，这条与握手定理同构的计数是下一步推出边数上限的关键。</p>

    <h3 class="sec" id="n5-euler">欧拉公式</h3>
    <p>对连通平面图 <Katex tex="V-E+F=2" /> 恒成立。证明走归纳：树的情形 <Katex tex="F=1" />、<Katex tex="E=V-1" />，公式成立；每加入一条不制造新面的边，就是树的情形；加入一条制造新面的边，<Katex tex="E" /> 与 <Katex tex="F" /> 同时加 1，差值不变。</p>
    <p>多连通图要改写：分量数为 <Katex tex="c" /> 时 <Katex tex="V-E+F=1+c" />。画板上是一张连通图，取 <Katex tex="c=1" /> 就回到原式。</p>
    <p>这个公式是拓扑学的入口。曲面上画图时它变成 <Katex tex="V-E+F=\chi" />，球面与平面的示性数都是 2，环面是 0，这一条在拓扑模块里再次出现。</p>

    <h3 class="sec" id="n5-nonplanar">边数上限与非平面图</h3>
    <p>每个面的次数至少为 3，而次数之和为 <Katex tex="2E" />，于是 <Katex tex="3F\le2E" />。代入欧拉公式消去 <Katex tex="F" />，得到 <Katex tex="E\le3V-6" />。</p>
    <p>完全图 <Katex tex="K_5" /> 有五个顶点十条边，<Katex tex="3V-6=9" />，超出上限，所以不是平面图。若图不含三角形，上限收紧为 <Katex tex="E\le2V-4" />，<Katex tex="K_{3,3}" /> 有九条边、六个顶点，恰好超出。</p>
    <p>库拉托夫斯基定理给出完整判据：图是平面图，当且仅当它不含 <Katex tex="K_5" /> 或 <Katex tex="K_{3,3}" /> 的细分。边数上限只是这条定理的一个推论。</p>

    <h3 class="sec" id="n5-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：外部的面也算一个。</strong>漏掉它，公式右边会差 1，这是最常见的错处。</li>
        <li><strong>提示二：公式只对连通图写成 2。</strong>分量数为 c 时要加 c，别把不连通的图直接代入。</li>
        <li><strong>提示三：边数上限是必要不充分条件。</strong>满足 <Katex tex="E\le3V-6" /> 的图未必平面，判否定好用，判肯定不行。</li>
        <li><strong>提示四：三角形情形的上限更紧。</strong>二分图没有三角形，要用 <Katex tex="E\le2V-4" />，用宽的会漏判 <Katex tex="K_{3,3}" />。</li>
      </ul>
    </div>
    <p>回收与预告：平面图不能任意连边，若相邻的顶点必须用不同颜色区分，最少需要几种颜色？四色定理与二部图的两色判据是这一问的两个端点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPlanar } from '../../../boards/algebra/graph/planar.js';
import { AN_CHAPTERS } from './annav.js';
</script>
