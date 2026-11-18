<template>
  <PhysicsCh id="motion3"
    sub="加速度保持不变的直线运动叫匀变速直线运动。它的 v-t 图是一条倾斜的直线，斜率为加速度，图线下的梯形面积为位移。把这两个几何事实写成式子，就得到三个基本公式，此后所有匀变速问题都从它们入手。"
    :toc="[
      { id: 'm3-derive', t: '由图像推出三个基本式' },
      { id: 'm3-use', t: '三个基本式的用法' },
      { id: 'm3-more', t: '平均速度与两个推论' },
      { id: 'm3-brake', t: '刹车问题' },
    ]">
    <div class="note good">
      加速度恒定的直线运动叫<strong>匀变速直线运动</strong>。取初速度方向为正，三个基本公式是
      <Katex tex="v=v_0+at" />、<Katex tex="x=v_0t+\frac12at^2" />、<Katex tex="v^2-v_0^2=2ax" />。
      匀变速运动中还成立 <Katex tex="\bar v=\frac{v_0+v}{2}" />，以及相邻相等时间间隔内位移之差为 <Katex tex="aT^2" />。
    </div>

    <h3 class="sec" id="m3-derive">由图像推出三个基本式</h3>
    <p>匀变速运动的加速度恒定，v-t 图是一条直线：<Katex tex="t=0" /> 时速度为 <Katex tex="v_0" />，<Katex tex="t" /> 时速度为 <Katex tex="v" />。直线的斜率等于加速度，于是</p>
    <p style="text-align:center"><Katex tex="a=\frac{v-v_0}{t}\ \Longrightarrow\ v=v_0+at." display /></p>
    <p>这就是第一个基本式，它说明匀变速运动中速度随时间线性变化。位移等于图线与时间轴围成的面积。图线从 <Katex tex="v_0" /> 升到 <Katex tex="v" />，围出的图形是梯形，上底 <Katex tex="v_0" />、下底 <Katex tex="v" />、高 <Katex tex="t" />，面积为</p>
    <p style="text-align:center"><Katex tex="x=\frac{v_0+v}{2}\,t." display /></p>
    <p>把第一个式子的 <Katex tex="v=v_0+at" /> 代入，得到</p>
    <p style="text-align:center"><Katex tex="x=\frac{v_0+(v_0+at)}{2}\,t=v_0t+\frac12at^2." display /></p>
    <p>这是第二个基本式。三个式子中 <Katex tex="v" />、<Katex tex="v_0" />、<Katex tex="a" />、<Katex tex="x" />、<Katex tex="t" /> 共五个量，各自都带符号。<Katex tex="v_0" /> 与 <Katex tex="a" /> 同号时速度增大，异号时速度减小；<Katex tex="a=0" /> 时退化为匀速直线运动 <Katex tex="x=v_0t" />。</p>
    <p>若问题不涉及时间，可以从第一式解出 <Katex tex="t=\frac{v-v_0}{a}" /> 代入第二式，消去 <Katex tex="t" />：</p>
    <p style="text-align:center"><Katex tex="x=\frac{v^2-v_0^2}{2a}\ \Longrightarrow\ v^2-v_0^2=2ax." display /></p>
    <p>这是第三个基本式。它的优点是不含时间，凡是给出或要求速度与位移而不提时间的问题，用它最省事。</p>

    <h3 class="sec" id="m3-use">三个基本式的用法</h3>
    <p>三个式子中每个都含有四个量，而 <Katex tex="v_0" />、<Katex tex="v" />、<Katex tex="a" />、<Katex tex="x" />、<Katex tex="t" /> 一共五个量。已知其中三个，就能由一个式子求出第四个，再由另一个式子求剩下的。做题时先列一张「已知—所求」的清单，看缺少的是哪一个量，再挑不含这个量的式子，可以少走弯路。</p>
    <p>方向的处理有两种做法。其一，规定正方向，把各矢量按方向写成带正负号的数，代入公式代数运算，结果的正负自然带出方向。其二，分段取正方向，上升段与下降段分别处理。前者更省事，也更不容易在折返处出错，建议始终用它。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力3 · <b>x-t 图与三个基本式</b>：蓝色抛物线是位置随时间的变化，橙色虚线是当前时刻的切线，切线斜率就是这一刻的速度。读数栏把三个式子逐项算给同一组数看，<Katex tex="v^2-v_0^2" /> 与 <Katex tex="2ax" /> 两项始终相等。看点：把 a 拖成负值，抛物线开口向下，图线出现最高点，此后物体折返；把 a 调为零，抛物线退化成直线，斜率处处相同，这就是匀速运动。</p>

    <h3 class="sec" id="m3-more">平均速度与两个推论</h3>
    <p>匀变速运动中，平均速度等于初末速度的算术平均：</p>
    <p style="text-align:center"><Katex tex="\bar v=\frac{x}{t}=\frac{v_0+v}{2}." display /></p>
    <p>它在 v-t 图上就是梯形中位线的含义。这条式子<strong>只对匀变速运动成立</strong>，变速运动中速度随时间不是线性变化的，平均速度不等于初末速度的平均。由它还能得到<strong>中间时刻速度</strong>：一段匀变速运动用时 <Katex tex="t" />，中间时刻 <Katex tex="\frac t2" /> 的速度为</p>
    <p style="text-align:center"><Katex tex="v_{t/2}=v_0+a\cdot\frac t2=\frac{v_0+v}{2}=\bar v." display /></p>
    <p>即某段时间内的平均速度，等于这段时间中间时刻的瞬时速度。用它求纸带上的速度很方便：相邻两个计时点的间距除以时间间隔，得到的是这两点之间中间时刻的速度。</p>
    <p>第二个推论来自第二个基本式。把运动分成若干个相等的时间间隔 <Katex tex="T" />，第 <Katex tex="n" /> 个间隔内的位移记为 <Katex tex="x_n" />，则</p>
    <p style="text-align:center"><Katex tex="x_n=v_0\,(nT)+\frac12a(nT)^2-\left[v_0(n-1)T+\frac12a\big((n-1)T\big)^2\right]." display /></p>
    <p>展开并合并同类项，两项相减得</p>
    <p style="text-align:center"><Katex tex="x_n=v_0T+\frac12aT^2(2n-1),\qquad x_{n+1}-x_n=aT^2." display /></p>
    <p><Katex tex="x_{n+1}-x_n=aT^2" /> 称为<strong>逐差公式</strong>，它说明匀变速运动中相邻相等时间间隔的位移差是常量，与 <Katex tex="n" /> 无关。实验中由纸带求加速度，用的就是这个式子；反过来，若纸带上各段位移之差近似相等，也说明这段运动近似是匀变速的。</p>
    <p>初速度为零时，公式简化为 <Katex tex="x=\frac12at^2" />，位移与时间的平方成正比。由此得到两组常用的比例：从开始起，第 1 个 <Katex tex="T" /> 内、第 2 个 <Katex tex="T" /> 内、第 3 个 <Katex tex="T" /> 内的位移之比为 <Katex tex="1:3:5:\cdots" />；到第 1 个 <Katex tex="T" /> 末、第 2 个 <Katex tex="T" /> 末、第 3 个 <Katex tex="T" /> 末的累计位移之比为 <Katex tex="1:4:9:\cdots" />。</p>

    <h3 class="sec" id="m3-brake">刹车问题</h3>
    <p>刹车时加速度与初速度反向，速度减到零之后物体停下，不会倒着开回去。而公式描述的是永不停歇的匀变速运动：把超过停止时刻的 <Katex tex="t" /> 代进去，算出的位移会让物体「退回」，与实际不符。因此刹车类问题要先求停止所需的时间：</p>
    <p style="text-align:center"><Katex tex="t_0=\frac{0-v_0}{a}=\frac{|v_0|}{|a|}." display /></p>
    <p>若题目给定的时间 <Katex tex="t\le t_0" />，直接代公式；若 <Katex tex="t>t_0" />，实际运动时间只能取 <Katex tex="t_0" />，位移为刹车距离</p>
    <p style="text-align:center"><Katex tex="x=\frac{v_0^2}{2|a|}=\frac{v_0}{2}\,t_0." display /></p>
    <p>求解两车不相撞的最小安全距离也是这一类问题：后车从发现情况到开始刹车有一段反应时间，这段时间内做匀速运动，之后做匀减速运动，两段位移相加才是总的停车距离。判断是否相撞，比较的是两车的位移与初始间距，而不是各自的速度大小。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：刹车时间超限仍直接代公式。</strong>先算 <Katex tex="t_0" />，再与题目给的时间比较。超过就按 <Katex tex="t_0" /> 计算，这是最常见的失分点。</li>
        <li><strong>提示二：把逐差公式用在不等的时间间隔上。</strong><Katex tex="x_{n+1}-x_n=aT^2" /> 要求各段的 <Katex tex="T" /> 相同。时间间隔不等时，要先把它们化成相同的间隔，或用 <Katex tex="\Delta x=aT^2" /> 的推广形式。</li>
        <li><strong>提示三：以为平均速度式处处成立。</strong><Katex tex="\bar v=\frac{v_0+v}{2}" /> 只在匀变速运动中成立。变速运动中求平均速度一律用 <Katex tex="\frac{x}{t}" />。</li>
        <li><strong>提示四：符号处理前后不一。</strong>规定正方向后，<Katex tex="v_0" />、<Katex tex="a" />、<Katex tex="x" /> 都要按方向带符号，中途不要换正方向。折返问题里位移为负是正常结果，说明末位置在出发点之前。</li>
      </ul>
    </div>
    <p>回收与预告：令 <Katex tex="a=g" />、<Katex tex="v_0=0" />，三个基本式退化为自由落体的一组公式；令 <Katex tex="a=-g" />，则描述竖直上抛。下一章把这两个特例单独拿出来，讨论它们的对称性。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('uniform');
</script>
