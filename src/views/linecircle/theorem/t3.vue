<template>
  <ChPage :cur="3" no="弦3" base="/linecircle/t" :chapters="TN_CHAPTERS"
    title="切线长定理与圆幂定理"
    sub="从圆外一点引两条切线，两条切线长相等，连线过圆心并平分夹角。相交弦、割线、切割线三个乘积式看似三件事，其实都由「切线长」这一个量控制：它就是圆幂。"
    :toc="[{ id: 't3-tan', t: '切线长定理' }, { id: 't3-power', t: '三个乘积式' }, { id: 't3-unify', t: '圆幂与统一式' }, { id: 't3-pit', t: '方向与位置' }]">
    <div class="note good">从圆外一点 <Katex tex="P" /> 引圆的两条切线，切点为 <Katex tex="T_1" />、<Katex tex="T_2" />，则 <Katex tex="PT_1=PT_2" />，且 <Katex tex="OP" /> 平分 <Katex tex="\angle T_1PT_2" />。设点 <Katex tex="P" /> 到圆心的距离为 <Katex tex="d" />、半径为 <Katex tex="r" />，则 <Katex tex="PT^2=d^2-r^2" />。过 <Katex tex="P" /> 的任意一条割线交圆于 <Katex tex="A" />、<Katex tex="B" />，都有 <Katex tex="PA\cdot PB=|d^2-r^2|" />；<Katex tex="P" /> 在圆内时，过 <Katex tex="P" /> 的弦被 <Katex tex="P" /> 分成的两段之积也等于 <Katex tex="r^2-d^2" />。</div>

    <h3 class="sec" id="t3-tan">切线长定理</h3>
    <div class="board-wrap">
      <BoardMount :factory="createPowerTheory" />
      <div class="cap">图 弦3 · <b>切线长定理与圆幂定理</b>：三档共用同一个圆幂，切换按钮改 <Katex tex="P" /> 的位置与图形。看点：第三档中两条紫色切线段等长，虚线 <Katex tex="OP" /> 把夹角分成两半；第二档把割线转到任意方向，两段之积始终等于切线长的平方。</div>
    </div>
    <p>切线长定理的证明用全等三角形。连接 <Katex tex="OT_1" />、<Katex tex="OT_2" />，两条都是半径，在切点处与切线垂直，所以三角形 <Katex tex="OPT_1" /> 与 <Katex tex="OPT_2" /> 都是直角三角形，又有公共斜边 <Katex tex="OP" /> 与相等的直角边 <Katex tex="OT_1=OT_2=r" />。由斜边直角边定理，两个三角形全等，于是 <Katex tex="PT_1=PT_2" />，且 <Katex tex="\angle T_1PO=\angle OP T_2" />。</p>
    <p>由勾股定理进一步得到 <Katex tex="PT_1^2=OP^2-OT_1^2=d^2-r^2" />。这个式子说明切线长只与点 <Katex tex="P" /> 到圆心的距离有关，与选哪一条切线无关。</p>

    <h3 class="sec" id="t3-power">三个乘积式</h3>
    <p><strong>相交弦定理。</strong>圆内两条弦 <Katex tex="AB" />、<Katex tex="CD" /> 交于点 <Katex tex="P" />，则 <Katex tex="PA\cdot PB=PC\cdot PD" />。证明连接 <Katex tex="AC" />、<Katex tex="BD" />，由同弧 <Katex tex="AD" /> 所对的圆周角相等得 <Katex tex="\angle A=\angle D" />，再由对顶角相等得两个三角形相似，对应边成比例，交叉相乘即得乘积式。</p>
    <p><strong>切割线定理。</strong>圆外一点 <Katex tex="P" /> 的割线交圆于 <Katex tex="A" />、<Katex tex="B" />，切线切于 <Katex tex="T" />，则 <Katex tex="PA\cdot PB=PT^2" />。证明连接 <Katex tex="AT" />、<Katex tex="BT" />，由弦切角定理，<Katex tex="\angle PTA" /> 等于 <Katex tex="\angle TBA" />，加上公共角 <Katex tex="\angle P" />，两个三角形相似，比例式交叉相乘即得。</p>
    <p><strong>割线定理。</strong>圆外一点 <Katex tex="P" /> 的两条割线分别交圆于 <Katex tex="A" />、<Katex tex="B" /> 与 <Katex tex="C" />、<Katex tex="D" />，则 <Katex tex="PA\cdot PB=PC\cdot PD" />。它由切割线定理两次得到，把切线长作为中间量消去。</p>

    <h3 class="sec" id="t3-unify">圆幂与统一式</h3>
    <p>记 <Katex tex="k=d^2-r^2" />，其中 <Katex tex="d=OP" />、<Katex tex="r" /> 为半径。这个量叫点 <Katex tex="P" /> 对圆的幂。</p>
    <p><Katex tex="P" /> 在圆外时 <Katex tex="k>0" />，过 <Katex tex="P" /> 的每条割线两段之积都等于 <Katex tex="k" />，切线长 <Katex tex="\sqrt{k}" />；<Katex tex="P" /> 在圆上时 <Katex tex="k=0" />，割线退化为切线；<Katex tex="P" /> 在圆内时 <Katex tex="k&lt;0" />，过 <Katex tex="P" /> 的每条弦两段之积都等于 <Katex tex="-k=r^2-d^2" />。</p>
    <p>三种情形可以合成一句：过点 <Katex tex="P" /> 的任意一条直线与圆交于两点或相切，两段有向长度的乘积恒等于圆幂。用一个数 <Katex tex="k" /> 概括三个定理，是因为三者的证明都归结为相似三角形，而相似的比例式给出的正是同一个乘积。</p>
    <p>在坐标里，圆 <Katex tex="(x-a)^2+(y-b)^2=r^2" /> 的幂写作 <Katex tex="k=(x_0-a)^2+(y_0-b)^2-r^2" />，它就是圆方程的左边在点 <Katex tex="P" /> 处的取值。这个观察把圆幂与直线和圆的交点问题连在一起，也是圆锥曲线里「极线」概念的起点。</p>

    <h3 class="sec" id="t3-pit">方向与位置</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不分内外直接用 <Katex tex="d^2-r^2" />。</strong>圆内点的幂是负数，而线段乘积是正数。写结果时应取绝对值，或分情形写 <Katex tex="r^2-d^2" /> 与 <Katex tex="d^2-r^2" />。</li>
        <li><strong>提示二：把割线的「近点」与「远点」调换。</strong>乘积式里 <Katex tex="PA" /> 与 <Katex tex="PB" /> 分别是到近端与远端的距离。只写 <Katex tex="PA\cdot PB" /> 时顺序无关，但要单独求某一段长度时，顺序决定用哪一个根。</li>
        <li><strong>提示三：相交弦定理用于两条弦的延长线在圆外交点。</strong>交点在圆外时，两条线段都已越出圆，不再是弦，应改用割线定理，结论形式相同但长度取自圆外。</li>
        <li><strong>提示四：把切线长当成切线。</strong>切线是直线，不能求长度。题目问「切线长」时，指的是圆外点到切点的线段。</li>
      </ul>
    </div>
    <p>回收与预告：弦2 的弦切角定理是切割线定理证明的关键一步；弦4 用相似与圆幂处理圆内接四边形与四点共圆。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPowerTheory } from '../../../boards/linecircle/theorem/powertheory.js';
import { TN_CHAPTERS } from './tnav.js';
</script>
