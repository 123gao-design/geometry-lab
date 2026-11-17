<template>
  <ChPage :cur="2" no="积2" base="/solid/m" :chapters="SM_CHAPTERS"
    title="球的体积、表面积与截面"
    sub="球没有展开图，它的两个公式靠分割求和的极限得到：S=4πR²、V=(4/3)πR³。用平面截球，截面永远是圆，球心到截面的距离 d、截面圆半径 r 与球半径 R 组成直角三角形，r²=R²−d²。"
    :toc="[{ id: 'm2-formula', t: '两个公式' }, { id: 'm2-section', t: '截面圆' }, { id: 'm2-tangent', t: '相切、相交与过球心' }, { id: 'm2-apply', t: '外接球与内切球' }, { id: 'm2-pit', t: '半径、距离与相似比' }]">
    <div class="note good">球的半径为 <Katex tex="R" />，则表面积与体积分别是 <Katex tex="S=4\pi R^2" /> 与 <Katex tex="V=\dfrac{4}{3}\pi R^3" />。用平面去截球，截面是一个圆；设球心到截面的距离为 <Katex tex="d" />，截面圆半径为 <Katex tex="r" />，则 <Katex tex="r^2=R^2-d^2" />，当且仅当 <Katex tex="d=0" /> 时截面是过球心的大圆。</div>

    <h3 class="sec" id="m2-formula">两个公式</h3>
    <div class="board-wrap">
      <BoardMount :factory="createSphereCutLab" />
      <div class="cap">图 积2 · <b>球的体积、表面积与截面</b>：<Katex tex="R" /> 滑块改球半径，<Katex tex="d" /> 滑块把紫色截面平面沿轴抬起。金色圆是截面圆，橙色段 <Katex tex="P_0A" /> 是截面圆半径、绿色段 <Katex tex="OA" /> 是球半径、虚线 <Katex tex="OP_0" /> 是球心到截面的距离，<Katex tex="P_0" /> 处画直角标记。看点：把 <Katex tex="d" /> 推向 0，截面圆张成最大的大圆；把 <Katex tex="d" /> 推到 <Katex tex="R" />，截面圆缩成一点；拖动画面旋转，紫色平面与金色圆始终保持为平面与圆。</div>
    </div>
    <p>球的表面积可以用「分割—近似」来理解。把球面切成许多块小曲面，每块足够小时近似为平面小片，以球心为顶点、小片为底面拼成许多个小锥体。每个小锥的高都等于 <Katex tex="R" />，所有小锥的体积之和是 <Katex tex="\tfrac13R\cdot S" />，这个和就是球的体积 <Katex tex="\tfrac43\pi R^3" />，于是 <Katex tex="S=4\pi R^2" />。</p>
    <p>体积公式另一个常见来源是用圆柱与圆锥作差：以 <Katex tex="R" /> 为底半径、以 <Katex tex="R" /> 为高的圆柱挖去两个同样的圆锥，剩下的部分（牟合方盖的截面法）恰好与半球等体积，从而 <Katex tex="V=\tfrac23\pi R^3\times2" />。这两条思路都说明：球的公式是极限结果，不是初等拼补的结果，这也解释了它为什么没有展开图。</p>

    <h3 class="sec" id="m2-section">截面圆</h3>
    <p>设球心为 <Katex tex="O" />，截面圆心为 <Katex tex="P_0" />，<Katex tex="A" /> 是截面圆周上一点。连 <Katex tex="OP_0" />、<Katex tex="P_0A" />、<Katex tex="OA" />。因为 <Katex tex="OP_0" /> 垂直于截面，它垂直于截面内每一条过 <Katex tex="P_0" /> 的直线，所以 <Katex tex="OP_0\perp P_0A" />，三角形 <Katex tex="OP_0A" /> 在 <Katex tex="P_0" /> 处为直角。</p>
    <p style="text-align:center"><Katex tex="r=\sqrt{R^2-d^2},\qquad d=\sqrt{R^2-r^2},\qquad R=\sqrt{r^2+d^2}." display /></p>
    <p>三个量任给其二可求第三个，这是解球与截面问题的核心关系。截面圆的周长与面积随之确定：<Katex tex="2\pi r" /> 与 <Katex tex="\pi r^2=\pi(R^2-d^2)" />。</p>

    <h3 class="sec" id="m2-tangent">相切、相交与过球心</h3>
    <p>平面与球的位置关系由 <Katex tex="d" /> 与 <Katex tex="R" /> 的大小决定。<Katex tex="d<R" /> 时平面与球相交，截面是半径 <Katex tex="\sqrt{R^2-d^2}" /> 的圆；<Katex tex="d=R" /> 时平面与球面相切，只有一个公共点，这个平面叫做球的切平面；<Katex tex="d>R" /> 时平面与球没有公共点。</p>
    <p><Katex tex="d=0" /> 时截面过球心，截面圆半径等于 <Katex tex="R" />，是所有截面中最大的，叫做大圆。地球上的赤道、经线圈都是大圆；把地球仪上的两点沿大圆相连，弧长最短，这正是球面距离的定义：过这两点的大圆在这两点间的劣弧长。</p>

    <h3 class="sec" id="m2-apply">外接球与内切球</h3>
    <p>求几何体的外接球，关键是找球心：球心到各顶点的距离相等，所以它在各条棱的垂直平分面上。几个常用结论：正方体的外接球直径等于它的体对角线 <Katex tex="\sqrt3a" />，内切球直径等于棱长 <Katex tex="a" />；长方体的外接球直径等于体对角线 <Katex tex="\sqrt{a^2+b^2+c^2}" />。</p>
    <p>设长方体的长、宽、高为 <Katex tex="a,b,c" />，则外接球半径 <Katex tex="R=\tfrac12\sqrt{a^2+b^2+c^2}" />，这个式子把标1 的空间两点距离公式与球半径直接连了起来：球心到顶点的距离就是对应对角线的一半。正四面体、正棱柱的外接球球心都在轴上，用「球心到上下底面顶点等距」列一个方程即可解出高度位置。</p>

    <h3 class="sec" id="m2-pit">半径、距离与相似比</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把截面圆半径当成球半径。</strong>截面的圆半径 <Katex tex="r" /> 一般小于 <Katex tex="R" />，只有 <Katex tex="d=0" /> 时两者才相等。题目说「截面圆面积为 <Katex tex="9\pi" />」时得到的是 <Katex tex="r=3" />，还要再借 <Katex tex="d" /> 才能求球的体积。</li>
        <li><strong>提示二：用 <Katex tex="r^2+d^2=R^2" /> 时把 <Katex tex="d" /> 取成截面圆的直径。</strong><Katex tex="d" /> 是球心到截面的<strong>距离</strong>，不是截面圆上的距离，也不是截面圆的半径。</li>
        <li><strong>提示三：两个球半径比 2:1 时把面积与体积的比直接写成 2:1。</strong>表面积按半径的平方缩放，是 <Katex tex="4:1" />；体积按立方缩放，是 <Katex tex="8:1" />。一般地，相似比 <Katex tex="k" /> 的两个几何体，表面积的比是 <Katex tex="k^2" />，体积的比是 <Katex tex="k^3" />。</li>
        <li><strong>提示四：把球的内切球与外接球半径混用。</strong>以正方体为例，内切球 <Katex tex="R=\tfrac a2" />，外接球 <Katex tex="R=\tfrac{\sqrt3a}{2}" />，棱切球 <Katex tex="R=\tfrac{\sqrt2a}{2}" />，三个半径依次增大，对应球与面、顶点、棱相切或相过。</li>
      </ul>
    </div>
    <p>回收与预告：积1 与积2 合起来给出空间几何体的完整度量工具箱。标1 起进入坐标系：把点写成三元有序实数组，距离、中点、截面这些度量全部化为代数计算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSphereCutLab } from '../../../boards/solid/measure/spherecutlab.js';
import { SM_CHAPTERS } from './mnav.js';
</script>
