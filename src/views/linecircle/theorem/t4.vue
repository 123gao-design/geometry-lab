<template>
  <ChPage :cur="4" no="弦4" base="/linecircle/t" :chapters="TN_CHAPTERS"
    title="四点共圆与圆内接四边形"
    sub="四个点落在同一个圆上，等价于它们组成的四边形对角互补。这条判据源于圆周角定理：同弧所对的圆周角相等，倒过来看就是共圆的标志。判定四点共圆之后，圆幂与相似比例可以互用。"
    :toc="[{ id: 't4-cycle', t: '圆内接四边形的性质' }, { id: 't4-crit', t: '四点共圆的判定' }, { id: 't4-use', t: '共圆之后的工具' }, { id: 't4-pit', t: '顺序与补充' }]">
    <div class="note good">圆内接四边形的对角互补：<Katex tex="\angle A+\angle C=180^\circ" />，<Katex tex="\angle B+\angle D=180^\circ" />。圆内接四边形的外角等于它的内对角。反过来，若四边形的对角互补，则四点共圆。</div>

    <h3 class="sec" id="t4-cycle">圆内接四边形的性质</h3>
    <div class="board-wrap">
      <BoardMount :factory="createConcyclic" />
      <div class="cap">图 弦4 · <b>四点共圆与圆内接四边形</b>：橙色四边形的四个顶点中，<Katex tex="A" />、<Katex tex="B" />、<Katex tex="C" /> 贴着金色圆周移动，紫色点 <Katex tex="D" /> 可以拖到圆内、圆外；每个顶角旁有一小段同色弧，徽章分别读出两组对角之和与 <Katex tex="D" /> 处的外角。看点：把 <Katex tex="D" /> 拖离圆周，两组对角之和同时偏离 <Katex tex="180^\circ" />；拖回圆周，两个和一起复原。</div>
    </div>
    <p>设 <Katex tex="ABCD" /> 内接于圆 <Katex tex="O" />。由圆周角定理，<Katex tex="\angle A" /> 与 <Katex tex="\angle C" /> 分别对着弧 <Katex tex="BCD" /> 与弧 <Katex tex="BAD" />，两段弧合起来是整个圆周，所以对应的圆心角之和是周角 <Katex tex="360^\circ" />，两个圆周角之和就是 <Katex tex="180^\circ" />。同理 <Katex tex="\angle B+\angle D=180^\circ" />。</p>
    <p>把 <Katex tex="CD" /> 延长到 <Katex tex="E" />，外角 <Katex tex="\angle ADE" /> 与内角 <Katex tex="\angle ADC" /> 互补，而 <Katex tex="\angle ADC" /> 与 <Katex tex="\angle ABC" /> 也互补，所以 <Katex tex="\angle ADE=\angle ABC" />。这就是「外角等于内对角」。</p>

    <h3 class="sec" id="t4-crit">四点共圆的判定</h3>
    <p>判断四点是否共圆，常用三条判据。</p>
    <p>其一，对角互补：若四边形的一组对角之和为 <Katex tex="180^\circ" />，则四点共圆。证明用反证法：设过 <Katex tex="A" />、<Katex tex="B" />、<Katex tex="C" /> 的圆与 <Katex tex="AD" /> 交于 <Katex tex="D'" />，则由性质 <Katex tex="\angle AD'C=180^\circ-\angle B=\angle ADC" />，两条射线 <Katex tex="DC" /> 与 <Katex tex="D'C" /> 重合，从而 <Katex tex="D=D'" />。</p>
    <p>其二，同侧张角相等：若 <Katex tex="C" />、<Katex tex="D" /> 在直线 <Katex tex="AB" /> 的同侧，且 <Katex tex="\angle ACB=\angle ADB" />，则四点共圆。这是「同弧所对圆周角相等」的逆用，也是作图与作辅助圆时最常用的一条。</p>
    <p>其三，圆幂互推：若两条线段 <Katex tex="AB" />、<Katex tex="CD" /> 所在直线交于点 <Katex tex="P" />，且 <Katex tex="PA\cdot PB=PC\cdot PD" />，则四点共圆。它把弦3 的乘积式倒过来用。</p>

    <h3 class="sec" id="t4-use">共圆之后的工具</h3>
    <p>判定共圆之后，可以反过来调用圆上的全部结论：同弧所对的圆周角相等、弦切角等于所夹弧对的圆周角、圆幂的三个乘积式。许多几何题的关键一步就是先证共圆，把分散的角与线段搬到一个圆上。</p>
    <p>常见用法有三种。证明两角相等时，先找它们是否对着同一条弦；求线段乘积时，先找它们是否构成相交弦或割线；出现定角与定线段时，考虑「定弦对定角」——点对定线段张角不变，则点的轨迹是一段圆弧。最后一条与参数方程一章的轨迹问题相通。</p>
    <p>圆内接四边形的对角互补还可以推广为「圆内接 <Katex tex="n" /> 边形」的角关系，但高中阶段主要用四边形。正方形的四个顶点共圆、矩形的四个顶点共圆，都是这条判据的直接结果。</p>

    <h3 class="sec" id="t4-pit">顺序与补充</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：四点顺序没有按圆周顺序排列。</strong>对角互补的前提是 <Katex tex="A" />、<Katex tex="B" />、<Katex tex="C" />、<Katex tex="D" /> 依圆周顺序围成一个凸四边形。若四点交叉排列，组成的是自交四边形，「对角」不再是几何意义上的相对顶点。</li>
        <li><strong>提示二：同侧张角相等漏掉「同侧」。</strong>若 <Katex tex="C" />、<Katex tex="D" /> 在 <Katex tex="AB" /> 的异侧，相等的角对应的是互补关系而非共圆。判断共圆前先确认两点在同一侧。</li>
        <li><strong>提示三：把「对角互补」推广成「任意两角互补」。</strong>只有对角才互补，邻角没有这个关系。写条件时应明确给出顶点对。</li>
        <li><strong>提示四：用圆幂判共圆时不检查点在直线上的位置。</strong><Katex tex="PA\cdot PB=PC\cdot PD" /> 中的 <Katex tex="A" />、<Katex tex="B" /> 须在交点 <Katex tex="P" /> 的同一条直线上成对出现。取错配对会得到错误的圆。</li>
      </ul>
    </div>
    <p>回收与预告：弦1 的圆周角定理是本章全部结论的来源；弦3 的圆幂给出第三条判据。子专题四转到解析层面：用坐标处理对称、最值与轨迹。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createConcyclic } from '../../../boards/linecircle/theorem/concyclic.js';
import { TN_CHAPTERS } from './tnav.js';
</script>
