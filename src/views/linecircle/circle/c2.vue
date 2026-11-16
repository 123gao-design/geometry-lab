<template>
  <ChPage :cur="2" no="圆2" base="/linecircle/c" :chapters="CN_CHAPTERS"
    title="直线与圆的位置关系"
    sub="直线与圆有三种位置关系，判断方法不止一种：可以联立方程数解的个数，也可以比较圆心到直线的距离与半径。后者不必解二次方程，在含参问题里更省力。相交时弦长由半径、弦心距与半弦构成的直角三角形给出。"
    :toc="[{ id: 'c2-dist', t: '距离判据' }, { id: 'c2-chord', t: '弦长与半弦' }, { id: 'c2-tangent', t: '切线方程' }, { id: 'c2-pit', t: '距离与判别式' }]">
    <div class="note good">圆 <Katex tex="C" /> 的半径为 <Katex tex="r" />，圆心到直线 <Katex tex="l" /> 的距离为 <Katex tex="d" />。则 <Katex tex="d&lt;r" /> 时直线与圆相交，<Katex tex="d=r" /> 时相切，<Katex tex="d>r" /> 时相离。相交时弦长 <Katex tex="|AB|=2\sqrt{r^2-d^2}" />。相切时切线与过切点的半径垂直。</div>

    <h3 class="sec" id="c2-dist">距离判据</h3>
    <div class="board-wrap">
      <BoardMount :factory="createLineCircle" />
      <div class="cap">图 圆2 · <b>直线与圆的位置关系</b>：金色圆、绿色直线，蓝色虚线是圆心到直线的垂线段 <Katex tex="CH" />，橙色段是整条弦。看点：把截距滑块推过半径位置，距离 <Katex tex="d" /> 先小于 <Katex tex="r" />、再等于、再大于，交点从两个变成一个再消失；相切那一刻垂足恰好落在圆周上。</div>
    </div>
    <p>设圆心 <Katex tex="C(a,b)" />、半径 <Katex tex="r" />，直线 <Katex tex="Ax+By+C_0=0" />。由点到直线的距离公式，<Katex tex="d=\dfrac{|Aa+Bb+C_0|}{\sqrt{A^2+B^2}}" />。判据直接比较 <Katex tex="d" /> 与 <Katex tex="r" />：垂足到圆心的距离小于半径，说明垂足落在圆内，直线必然穿过圆；等于半径，垂足在圆周上，直线与圆只有一个公共点；大于半径，整条直线都在圆外。</p>
    <p>另一种判据是联立消元。把直线方程代入圆方程，得到一个一元二次方程，判别式 <Katex tex="\Delta>0" />、<Katex tex="=0" />、<Katex tex="&lt;0" /> 分别对应相交、相切、相离。两种判据结论一致，但距离判据只做一次除法，不必展开二次式，含参时根与参数的关系也更清楚。</p>
    <p>本题板中直线写成斜截式 <Katex tex="y=kx+b" />，圆心在原点，于是 <Katex tex="d=\dfrac{|b|}{\sqrt{1+k^2}}" />。斜率改变时距离随之改变，即使截距不动，直线也可能从相交转到相离。</p>

    <h3 class="sec" id="c2-chord">弦长与半弦</h3>
    <p>相交时，设两个交点为 <Katex tex="A" />、<Katex tex="B" />，垂足为 <Katex tex="H" />。由垂径定理，<Katex tex="H" /> 是弦 <Katex tex="AB" /> 的中点，且 <Katex tex="CH\perp AB" />。在直角三角形 <Katex tex="CHA" /> 中，斜边 <Katex tex="CA=r" />，一条直角边 <Katex tex="CH=d" />，另一直角边即半弦 <Katex tex="AH=\sqrt{r^2-d^2}" />。</p>
    <p style="text-align:center"><Katex tex="|AB|=2AH=2\sqrt{r^2-d^2}." display /></p>
    <p>这个关系说明：圆心到直线的距离越小，弦越长；直线过圆心时 <Katex tex="d=0" />，弦就是直径，长度为 <Katex tex="2r" />。反过来，已知弦长与半径，也能反求弦心距 <Katex tex="d=\sqrt{r^2-\left(\dfrac{|AB|}{2}\right)^2}" />。</p>

    <h3 class="sec" id="c2-tangent">切线方程</h3>
    <p>过圆 <Katex tex="x^2+y^2=r^2" /> 上一点 <Katex tex="P(x_0,y_0)" /> 的切线方程是 <Katex tex="x_0x+y_0y=r^2" />。这条式子的来源是「切线与半径垂直」：半径 <Katex tex="OP" /> 的方向向量为 <Katex tex="(x_0,y_0)" />，切线上任一点 <Katex tex="(x,y)" /> 与 <Katex tex="P" /> 的连线与它垂直，点积为零，即 <Katex tex="x_0(x-x_0)+y_0(y-y_0)=0" />，展开并用 <Katex tex="x_0^2+y_0^2=r^2" /> 即得上式。</p>
    <p>过圆外一点 <Katex tex="Q" /> 作圆的切线，一般有两条。设切线的斜率为 <Katex tex="k" />，写出过 <Katex tex="Q" /> 的点斜式，再用「圆心到直线的距离等于 <Katex tex="r" />」解出 <Katex tex="k" />。若解出的 <Katex tex="k" /> 只有一个，另一条切线是竖直的，斜率不存在，需要单独补上。</p>

    <h3 class="sec" id="c2-pit">距离与判别式</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：用距离判据时忘记直线要写成一般式。</strong>点到直线的距离公式针对 <Katex tex="Ax+By+C_0=0" />，斜截式 <Katex tex="y=kx+b" /> 要先移项成 <Katex tex="kx-y+b=0" />，此时 <Katex tex="A=k" />、<Katex tex="B=-1" />、<Katex tex="C_0=b" />，分母是 <Katex tex="\sqrt{k^2+1}" />。</li>
        <li><strong>提示二：过圆外一点求切线漏掉竖直的一条。</strong>设斜率为 <Katex tex="k" /> 只能覆盖不竖直的直线。求出 <Katex tex="k" /> 只一个解时，另一条一定是 <Katex tex="x=x_Q" />。求完应检查 <Katex tex="Q" /> 到这条竖直线的距离是否恰为 <Katex tex="r" />。</li>
        <li><strong>提示三：联立后把 <Katex tex="\Delta" /> 的符号与交点个数记反。</strong><Katex tex="\Delta>0" /> 是两个交点，<Katex tex="\Delta=0" /> 是一个，<Katex tex="\Delta&lt;0" /> 是没有。弦长公式 <Katex tex="\sqrt{1+k^2}\,|x_1-x_2|" /> 里的 <Katex tex="|x_1-x_2|" /> 用韦达定理写成 <Katex tex="\dfrac{\sqrt{\Delta}}{|a|}" />，别与判别式本身的符号混淆。</li>
        <li><strong>提示四：切点写成「只有一个公共点」就当成相切。</strong>相交时也可能因计算区间被截断而只看到一个交点。判断是否相切，看 <Katex tex="d" /> 与 <Katex tex="r" /> 是否严格相等，或看 <Katex tex="\Delta" /> 是否为零。</li>
      </ul>
    </div>
    <p>回收与预告：圆1 的配方法在这里把一般方程读成圆心与半径，才能算距离；圆3 把两个圆方程相减，公共弦所在直线正是两圆方程的差。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLineCircle } from '../../../boards/linecircle/circle/linecircle.js';
import { CN_CHAPTERS } from './cnav.js';
</script>
