<template>
  <ChPage :cur="2" no="综2" base="/linecircle/z" :chapters="ZN_CHAPTERS"
    title="轨迹与综合问题"
    sub="求轨迹方程有三条路：直接设点列条件、认出一个已知图形的定义、用主动点表示从动点。弦的中点是一个典型的例子，它既是弦心距的垂足，又落在以定点与圆心连线为直径的圆上，两句话给出同一条曲线。"
    :toc="[{ id: 'z2-way', t: '轨迹方程的三条路' }, { id: 'z2-chord', t: '弦中点的轨迹' }, { id: 'z2-len', t: '弦长的最值' }, { id: 'z2-pit', t: '范围与判别式' }]">
    <div class="note good">求轨迹方程的常用方法有三种。直接法：设动点 <Katex tex="P(x,y)" />，把题设的几何条件写成含 <Katex tex="x" />、<Katex tex="y" /> 的方程再化简。定义法：先看出动点满足某个已知曲线的定义。相关点法：设主动点 <Katex tex="Q" /> 在已知曲线上，用 <Katex tex="P" /> 的坐标表示 <Katex tex="Q" />，代回已知曲线。轨迹方程必须连同范围一起写，落在曲线某一段上的，不能只给整条曲线。</div>

    <h3 class="sec" id="z2-way">轨迹方程的三条路</h3>
    <p>直接法最通用。题目给出距离相等、斜率乘积为定值、某个角为直角这类条件，把每个量用坐标写出来，化简即得。化简时注意每一步是否等价：两边平方可能引入增根，除以含 <Katex tex="x" /> 或 <Katex tex="y" /> 的式子可能丢掉点，最后要回头检查。</p>
    <p>定义法最快，前提是认得出图形。到定点的距离等于定值，轨迹是圆；到两定点距离之比为定值且不为 <Katex tex="1" />，轨迹也是圆，这个圆叫阿波罗尼斯圆；动点到定点的连线与到另一定点的连线垂直，轨迹是以这两点为直径端点的圆。</p>
    <p>相关点法用于「从动点」问题。设主动点 <Katex tex="Q" /> 在已知曲线上，从动点 <Katex tex="P" /> 由 <Katex tex="Q" /> 按某种规则得到，先把 <Katex tex="Q" /> 的坐标用 <Katex tex="P" /> 的坐标解出来，再代入 <Katex tex="Q" /> 满足的方程。弦的中点、线段的分点、旋转后的点，都适合这条路。</p>

    <h3 class="sec" id="z2-chord">弦中点的轨迹</h3>
    <div class="board-wrap">
      <BoardMount :factory="createChordLocus" />
      <div class="cap">图 综2a · <b>过定点的弦中点轨迹</b>：金色圆、蓝色定点 <Katex tex="A" />、橙色弦 <Katex tex="MN" />，绿色点 <Katex tex="P" /> 是中点。看点：拖动 <Katex tex="A" /> 或改角度，<Katex tex="P" /> 始终落在绿色虚弧上，<Katex tex="OP" /> 与 <Katex tex="PA" /> 之间的直角标记始终成立；把角度调回 <Katex tex="0" />，弦变成直径，中点退到圆心。绿色虚弧只是以 <Katex tex="OA" /> 为直径的圆的一部分，两端到切点为止。</div>
    </div>
    <p>设圆 <Katex tex="O" /> 的半径为 <Katex tex="r" />，定点 <Katex tex="A" /> 在圆外。过 <Katex tex="A" /> 的直线与圆交于 <Katex tex="M" />、<Katex tex="N" />，<Katex tex="P" /> 是 <Katex tex="MN" /> 的中点。</p>
    <p>几何的走法：<Katex tex="P" /> 是弦的中点，<Katex tex="OP" /> 垂直于弦，而弦过 <Katex tex="A" />，所以 <Katex tex="OP\perp AP" />，即 <Katex tex="\angle OPA=90^\circ" />。由圆周角定理的逆命题，<Katex tex="P" /> 落在以 <Katex tex="OA" /> 为直径的圆上。</p>
    <p>坐标的走法：设 <Katex tex="A(d,0)" />，过 <Katex tex="A" /> 的直线斜率为 <Katex tex="k" />，与圆方程联立，由韦达定理得中点坐标 <Katex tex="x=\dfrac{k^2d}{1+k^2}" />、<Katex tex="y=-\dfrac{kd}{1+k^2}" />，消去 <Katex tex="k" /> 得</p>
    <p style="text-align:center"><Katex tex="x^2+y^2-dx=0,\qquad \left(x-\frac{d}{2}\right)^2+y^2=\frac{d^2}{4}." display /></p>
    <p>两种走法得到同一条曲线。范围由直线与圆有公共点给出：<Katex tex="k" /> 取不到使直线相离的值，等价于 <Katex tex="0\le x\le \dfrac{r^2}{d}" />。所以轨迹是以 <Katex tex="OA" /> 为直径的圆夹在原圆内部的那段弧，两端是两个切点，不是整个圆。</p>

    <h3 class="sec" id="z2-len">弦长的最值</h3>
    <div class="board-wrap">
      <BoardMount :factory="createChordOpt" />
      <div class="cap">图 综2b · <b>过定点的弦长最值</b>：金色圆、绿色定点 <Katex tex="P" />、橙色弦 <Katex tex="AB" />，蓝色虚线 <Katex tex="OH" /> 是弦心距。看点：拖动 <Katex tex="θ" /> 转直线，弦长随 <Katex tex="OH" /> 一起变；把直线转到垂直于 <Katex tex="OP" /> 时弦心距最长、弦最短，转到过圆心时弦心距为零、弦最长；拖动 <Katex tex="P" /> 靠近圆心，最短弦随之变长。</div>
    </div>
    <p>圆内过定点 <Katex tex="P" /> 的弦，长度由弦心距决定。设圆心到直线的距离为 <Katex tex="d" />，由垂径定理，</p>
    <p style="text-align:center"><Katex tex="|AB|=2\sqrt{r^2-d^2}." display /></p>
    <p><Katex tex="d" /> 越大，弦越短。<Katex tex="d" /> 是圆心到过 <Katex tex="P" /> 的直线的距离，它不超过 <Katex tex="|OP|" />，当直线垂直于 <Katex tex="OP" /> 时取到最大值。于是最短弦长是 <Katex tex="2\sqrt{r^2-|OP|^2}" />，这条弦与 <Katex tex="OP" /> 垂直；最长弦过圆心，长度为直径 <Katex tex="2r" />，此时直线就是 <Katex tex="OP" /> 所在的直线。</p>
    <p>若不用几何，把直线设成 <Katex tex="y-y_0=k(x-x_0)" />，与圆方程联立，用韦达定理写 <Katex tex="|AB|=\sqrt{1+k^2}\,|x_1-x_2|" />，再对 <Katex tex="k" /> 求最值。运算量比几何方法大，但适用范围更宽，斜率不存在的情形要单独讨论。</p>
    <p>综合题里弦长常与面积、参数范围连在一起。三角形 <Katex tex="OAB" /> 的面积可以写成 <Katex tex="\dfrac12|AB|\cdot d" />，用同一个 <Katex tex="d" /> 表示，最值随之确定；也可写成 <Katex tex="\dfrac12r^2\sin\angle AOB" />，用圆心角处理。两种写法给出的结果一致。</p>

    <h3 class="sec" id="z2-pit">范围与判别式</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：轨迹只写曲线，不写范围。</strong>弦中点的轨迹是圆的一段弧，阿波罗尼斯圆在有额外限制时也可能只剩一段。题目问「轨迹方程」时，坐标的取值范围要一并写出，否则答案多出一大块。</li>
        <li><strong>提示二：联立后忘记判别式。</strong>直线与圆相交要求 <Katex tex="\Delta>0" />。求参数范围时只用了韦达定理的和与积，却漏掉这个前提，会把相离或相切的情形也算进答案。</li>
        <li><strong>提示三：最短弦当成过定点的竖直线。</strong>最短弦的方向由 <Katex tex="OP" /> 决定，不是由坐标轴决定。定点不在 <Katex tex="x" /> 轴上时，垂直于 <Katex tex="OP" /> 的直线既不是竖直也不是水平。</li>
        <li><strong>提示四：相关点法代错方向。</strong>要把主动点 <Katex tex="Q" /> 的坐标用从动点 <Katex tex="P" /> 表示，再代入 <Katex tex="Q" /> 的方程。把 <Katex tex="P" /> 直接代进 <Katex tex="Q" /> 的方程，得到的是另一条曲线。</li>
        <li><strong>提示五：消参时丢掉斜率不存在的情形。</strong>设斜率为 <Katex tex="k" /> 时，竖直直线没有斜率，它是否满足题设要单独检查，往往正是取到最值的那一条。</li>
      </ul>
    </div>
    <p>回收与预告：综1 的对称点、弦1 的圆周角定理、弦4 的圆内接四边形，在这里合成了轨迹与最值的两条主线。直线与圆模块到这一章收尾，后面的圆锥曲线沿用同一套联立与消参的手法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChordLocus } from '../../../boards/linecircle/apply/chordlocus.js';
import { createBoard as createChordOpt } from '../../../boards/linecircle/apply/chordopt.js';
import { ZN_CHAPTERS } from './znav.js';
</script>
