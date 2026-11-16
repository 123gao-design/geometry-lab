<template>
  <ChPage :cur="1" no="弦1" base="/linecircle/t" :chapters="TN_CHAPTERS"
    title="垂径定理与圆周角"
    sub="圆的许多性质来自同一个来源：半径处处相等。垂径定理把弦与过圆心的垂线绑在一起，圆周角定理把圆上的角与圆心的角绑在一起。前者给出弦长与弦心距的换算，后者给出角的传播规则。"
    :toc="[{ id: 't1-perp', t: '垂径定理' }, { id: 't1-central', t: '圆心角与弧' }, { id: 't1-inscribed', t: '圆周角定理' }, { id: 't1-pit', t: '直径与弧' }]">
    <div class="note good">垂直于弦的直径平分这条弦，并且平分弦所对的两条弧。同圆中，同弧所对的圆周角等于它所对圆心角的一半，因此同弧所对的圆周角都相等；直径所对的圆周角是直角。</div>

    <h3 class="sec" id="t1-perp">垂径定理</h3>
    <div class="board-wrap">
      <BoardMount :factory="createChordAngle" />
      <div class="cap">图 弦1 · <b>垂径定理与圆周角</b>：金色圆、橙色弦 <Katex tex="AB" />，蓝色虚线是过圆心的直径，垂足 <Katex tex="M" /> 处标出直角，<Katex tex="AM" />、<Katex tex="MB" /> 上各有一道等长刻度；绿色角是圆周角 <Katex tex="\angle APB" />，橙色角是圆心角 <Katex tex="\angle AOB" />。看点：拖动 <Katex tex="P" /> 沿大弧走，圆周角的读数不变，且始终是圆心角的一半；把弦高滑块推到底，弦变成直径，圆周角恰好是直角。</div>
    </div>
    <p>设 <Katex tex="AB" /> 是圆 <Katex tex="O" /> 的一条弦，过 <Katex tex="O" /> 作 <Katex tex="OM\perp AB" />，垂足为 <Katex tex="M" />。连接 <Katex tex="OA" />、<Katex tex="OB" />，两个直角三角形 <Katex tex="OMA" /> 与 <Katex tex="OMB" /> 有公共直角边 <Katex tex="OM" />，斜边 <Katex tex="OA=OB=r" />。由勾股定理，</p>
    <p style="text-align:center"><Katex tex="AM=BM=\sqrt{r^2-OM^2}." display /></p>
    <p>所以 <Katex tex="AM=MB" />，即垂足就是弦的中点。弦心距 <Katex tex="d=OM" />、半弦长与半径构成直角三角形，三者的关系是</p>
    <p style="text-align:center"><Katex tex="\left(\frac{|AB|}{2}\right)^2+d^2=r^2." display /></p>
    <p>这条关系与圆2 的弦长公式 <Katex tex="|AB|=2\sqrt{r^2-d^2}" /> 是同一个式子。垂径定理提供了它的几何来源：半条弦、弦心距、半径正好是一个直角三角形的三条边。</p>
    <p>逆命题也成立：平分弦（不是直径）的直径垂直于这条弦。若弦本身就是直径，任意一条过圆心的直线都平分它，却不一定垂直，所以逆命题必须排除直径。</p>

    <h3 class="sec" id="t1-central">圆心角与弧</h3>
    <p>顶点在圆心的角叫圆心角。同圆或等圆中，相等的圆心角所对的弧相等，所对的弦相等，弦心距也相等；反过来，相等的弧或相等的弦也给出相等的圆心角。这三组量——圆心角、弧、弦——一一对应，任一组相等都推出另外两组相等。</p>
    <p>记圆心角为 <Katex tex="\theta" />，半径 <Katex tex="r" />，则弧长 <Katex tex="l=r\theta" />（<Katex tex="\theta" /> 用弧度），弦长 <Katex tex="2r\sin\dfrac{\theta}{2}" />，弦心距 <Katex tex="r\cos\dfrac{\theta}{2}" />。三个量由 <Katex tex="\theta" /> 唯一确定，与 trig 模块的弧度制一章接得上。</p>

    <h3 class="sec" id="t1-inscribed">圆周角定理</h3>
    <p>顶点在圆上、两边都与圆相交的角叫圆周角。同弧所对的圆周角等于它所对圆心角的一半。证明按圆心与角的位置分三种情形，第一种情形能直接写出，另外两种化归到第一种。</p>
    <p>情形一：圆心 <Katex tex="O" /> 在角的一边 <Katex tex="PA" /> 上。此时 <Katex tex="OA=OP" />，三角形 <Katex tex="OAP" /> 是等腰三角形，<Katex tex="\angle OAP=\angle OPA" />。圆心角 <Katex tex="\angle AOB" /> 是这个等腰三角形在 <Katex tex="O" /> 处的外角，等于两内角之和，即 <Katex tex="\angle AOB=2\angle APB" />。</p>
    <p>情形二：圆心在角的内部。作直径 <Katex tex="PQ" />，把 <Katex tex="\angle APB" /> 拆成 <Katex tex="\angle APQ+\angle QPB" />，两块各按情形一处理，相加即得 <Katex tex="\angle AOB=2\angle APB" />。情形三：圆心在角的外部，同样作直径后把两块相减。</p>
    <p>由这个定理立刻得到两条推论。其一，同弧所对的圆周角都相等，因为它们都等于同一个圆心角的一半；这条推论把角从一处搬到另一处，是证明四点共圆的主要工具。其二，半圆（或直径）所对的圆周角是直角，因为对应的圆心角是平角。</p>

    <h3 class="sec" id="t1-pit">直径与弧</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：垂径定理的逆命题漏掉「不是直径」。</strong>「平分弦的直径垂直于弦」在弦为直径时不成立。做题时若题目只给「过圆心的直线平分弦」，要先确认这条弦不是直径，才能断言垂直。</li>
        <li><strong>提示二：把圆心角与圆周角对着同一条弦。</strong>两者必须对着同一条弧。对着同一条弦时，圆周角可能对着优弧，也可能对着劣弧，前者等于圆心角的一半，后者等于 <Katex tex="180^\circ" /> 减去那一半。判断时先看 <Katex tex="P" /> 落在哪个弧上。</li>
        <li><strong>提示三：用弦长公式时把直径当半径。</strong><Katex tex="|AB|=2\sqrt{r^2-d^2}" /> 里的 <Katex tex="r" /> 是半径。已知直径时要先除以 <Katex tex="2" />。</li>
        <li><strong>提示四：认为相等的弦一定在同一个圆里。</strong>弦、弧、圆心角的对应关系只适用于同圆或等圆。半径不同的两个圆中，相等的弦对应的圆心角并不相等。</li>
      </ul>
    </div>
    <p>回收与预告：弦2 把圆的切线纳入同一套角的关系，弦切角等于它所夹弧对的圆周角；弦4 用「同弧圆周角相等」的逆命题判定四点共圆。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChordAngle } from '../../../boards/linecircle/theorem/chordangle.js';
import { TN_CHAPTERS } from './tnav.js';
</script>
