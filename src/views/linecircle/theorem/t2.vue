<template>
  <ChPage :cur="2" no="弦2" base="/linecircle/t" :chapters="TN_CHAPTERS"
    title="切线的判定与性质"
    sub="切线是「与圆只有一个公共点」的直线，但判定它不必去找交点。圆心到直线的距离等于半径、或直线过半径的外端且与半径垂直，都能判定相切。切线与弦组成的弦切角，与它所夹弧对的圆周角相等，这把切线的角纳入圆周角定理。"
    :toc="[{ id: 't2-crit', t: '切线的三种判定' }, { id: 't2-prop', t: '切线的性质' }, { id: 't2-chord', t: '弦切角定理' }, { id: 't2-pit', t: '垂直与切点' }]">
    <div class="note good">经过半径的外端并且垂直于这条半径的直线是圆的切线。切线垂直于过切点的半径。弦切角等于它所夹的弧对的圆周角。</div>

    <h3 class="sec" id="t2-crit">切线的三种判定</h3>
    <div class="board-wrap">
      <BoardMount :factory="createTangentChord" />
      <div class="cap">图 弦2 · <b>切线的判定与弦切角</b>：金色圆、橙色切线，蓝色半径 <Katex tex="OT" /> 与切线在 <Katex tex="T" /> 处垂直（灰色直角标记），绿色弦 <Katex tex="TC" />，紫色线连出圆周角 <Katex tex="\angle TDC" />。看点：拖动 <Katex tex="T" /> 切点沿圆周走，切线跟着转但始终与半径垂直；拖动 <Katex tex="D" /> 沿另一段弧滑动，紫色圆周角的读数不变，橙色弦切角也跟着不动。</div>
    </div>
    <p>判定一条直线是圆的切线，常用三种说法，它们彼此等价。</p>
    <p>其一，定义：直线与圆只有一个公共点。这条判定在作图时直观，在计算中不好用，因为要先求出交点。</p>
    <p>其二，数量：圆心到直线的距离等于半径。设圆心 <Katex tex="O" />、半径 <Katex tex="r" />、直线 <Katex tex="l" />，若 <Katex tex="d(O,l)=r" />，则 <Katex tex="l" /> 与圆相切。这条判定与圆2 的距离判据是同一件事，含参题里最常用。</p>
    <p>其三，图形：直线过半径的外端，且与这条半径垂直。这条判定把垂直关系直接当作切线的标志，几何证明里最常用。</p>

    <h3 class="sec" id="t2-prop">切线的性质</h3>
    <p>切线垂直于过切点的半径。证明用反证法：若切线不垂直于半径 <Katex tex="OT" />，则过 <Katex tex="O" /> 向切线上另作一条垂线，垂足 <Katex tex="H" /> 与 <Katex tex="T" /> 不重合，且 <Katex tex="OH&lt;OT=r" />。这说明切线上有一个点到圆心的距离小于半径，该点在圆内，于是直线与圆有两个公共点，与相切矛盾。</p>
    <p>由这条性质派生出两个常用结论。经过圆心且垂直于切线的直线必过切点；经过切点且垂直于切线的直线必过圆心。两者合起来说明：切点、圆心、切线的垂足三点重合，切线在切点处与半径互相垂直。</p>
    <p>从圆外一点引圆的两条切线，这一点与圆心的连线平分两条切线的夹角，这是弦3 的切线长定理，这里先记下结论。</p>

    <h3 class="sec" id="t2-chord">弦切角定理</h3>
    <p>顶点在圆上，一边与圆相交、另一边与圆相切的角叫弦切角。弦切角等于它所夹的弧对的圆周角。</p>
    <p>证明分两步。设切点为 <Katex tex="T" />，弦为 <Katex tex="TC" />，<Katex tex="D" /> 是弦 <Katex tex="TC" /> 另一段弧上的点，弦切角就是切线与 <Katex tex="TC" /> 的夹角。过 <Katex tex="T" /> 作直径 <Katex tex="TE" />：切线垂直于半径 <Katex tex="TE" />，所以切线与 <Katex tex="TC" /> 的夹角等于 <Katex tex="90^\circ-\angle ETC" />；又由直径所对的圆周角是直角，<Katex tex="\angle ECT=90^\circ" />，在直角三角形 <Katex tex="ECT" /> 中有 <Katex tex="\angle ETC=90^\circ-\angle TEC" />。两式相减得弦切角等于 <Katex tex="\angle TEC" />，而 <Katex tex="\angle TEC" /> 与 <Katex tex="\angle TDC" /> 对同一条弧 <Katex tex="TC" />，由圆周角定理两者相等。</p>
    <p>这个定理把切线纳入了圆周角的体系：切线与弦的夹角不再是一个新的量，它就是那条弦所对圆周角的另一种写法。证明中常用的手法是「过切点作直径」，把切线问题化归为直径与圆周角。</p>

    <h3 class="sec" id="t2-pit">垂直与切点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把「垂直于半径」当成充分条件。</strong>垂直于半径的直线不一定与圆相切，还要过半径的外端。若直线垂直于半径但垂足在圆内，它是割线；垂足在圆外，它与圆相离。</li>
        <li><strong>提示二：切线长与切线段混淆。</strong>切线是直线，没有长度；切线长是圆外一点到切点的线段长度。说「切线等于某值」时，实际指的是切线长。</li>
        <li><strong>提示三：弦切角取错那一支。</strong>切线与弦的夹角有两个，一个是弦切角，另一个与它互补。弦切角取在所夹弧的那一侧，判断方法与弦1 的「对着哪段弧」相同。</li>
        <li><strong>提示四：证明切线时默认切点已给出。</strong>题目只说「过圆上一点 <Katex tex="A" /> 的直线」，<Katex tex="A" /> 就是切点，证明垂直即可；题目说「过圆外一点 <Katex tex="P" /> 作直线」，切点未知，应先设切点、连半径，再证垂直，或直接用距离判据。</li>
      </ul>
    </div>
    <p>回收与预告：弦1 的圆周角定理在这里用于替换 <Katex tex="\angle TEC" />；弦3 把两条切线的长度与圆幂的三个乘积式一起处理。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTangentChord } from '../../../boards/linecircle/theorem/tangentchord.js';
import { TN_CHAPTERS } from './tnav.js';
</script>
