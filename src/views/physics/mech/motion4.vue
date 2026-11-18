<template>
  <PhysicsCh id="motion4"
    sub="只在重力作用下、从静止开始下落的运动叫自由落体。取竖直向下为正，它就是 a = g、v0 = 0 的匀变速直线运动。竖直上抛取竖直向上为正，a = −g，上升与下落在同一高度上速率相同、用时相同。两章合起来，是匀变速公式在两个具体场合的应用。"
    :toc="[
      { id: 'm4-free', t: '自由落体运动' },
      { id: 'm4-g', t: '重力加速度' },
      { id: 'm4-up', t: '竖直上抛运动' },
      { id: 'm4-sym', t: '上升与下落的对称性' },
    ]">
    <div class="note good">
      只在重力作用下、初速度为零的下落叫<strong>自由落体运动</strong>，它是匀加速直线运动，加速度为重力加速度 <Katex tex="g" />：<Katex tex="v=gt" />、<Katex tex="h=\frac12gt^2" />、<Katex tex="v^2=2gh" />。
      竖直上抛运动取竖直向上为正、<Katex tex="a=-g" />，<Katex tex="v=v_0-gt" />、<Katex tex="h=v_0t-\frac12gt^2" />，上升时间与下落时间相等，最高点高度为 <Katex tex="\frac{v_0^2}{2g}" />。
    </div>

    <h3 class="sec" id="m4-free">自由落体运动</h3>
    <p>把一片羽毛和一枚硬币同时从同一高度释放，羽毛下落得慢得多；若把空气抽走，两者下落得一样快。这说明日常经验中的差异来自空气阻力，去掉这一影响之后，所有物体下落的规律相同。</p>
    <p>只受重力、初速度为零的下落叫<strong>自由落体运动</strong>。真实的落体要严格满足这两个条件很难，通常只有阻力远小于重力时才近似成立：石块在空气中的下落可以按自由落体处理，羽毛、纸片则不能。</p>
    <p>自由落体是初速度为零、加速度为 <Katex tex="g" /> 的匀加速直线运动。把 <Katex tex="v_0=0" />、<Katex tex="a=g" /> 代入上一章的三个基本式，得到</p>
    <p style="text-align:center"><Katex tex="v=gt,\qquad h=\frac12gt^2,\qquad v^2=2gh." display /></p>
    <p>下落高度与时间的平方成正比，这是自由落体最要紧的特征。若从静止开始，第 1 秒内下落约 4.9 m，前 2 秒内约 19.6 m，前 3 秒内约 44.1 m，三段之比为 <Katex tex="1:4:9" />；而第 1 秒、第 2 秒、第 3 秒内各自的下落量之比为 <Katex tex="1:3:5" />。两组比例都由 <Katex tex="h=\frac12gt^2" /> 直接算出，与上一章的推论一致。</p>

    <h3 class="sec" id="m4-g">重力加速度</h3>
    <p>同一地点，一切物体自由下落的加速度都相同，这个加速度叫<strong>重力加速度</strong>，用 <Katex tex="g" /> 表示。它的方向竖直向下，大小随地点变化：赤道附近约为 <Katex tex="9.78\ \text{m/s}^2" />，两极附近约为 <Katex tex="9.83\ \text{m/s}^2" />，海平面上的平均值取 <Katex tex="9.8\ \text{m/s}^2" />。随海拔升高，<Katex tex="g" /> 略微减小。</p>
    <p><Katex tex="g" /> 的数值可以用实验测定，单摆实验是常见的方法之一，测量原理在<strong>机械振动</strong>一章的单摆一节里给出。粗略的计算中常取 <Katex tex="g=10\ \text{m/s}^2" />，取 <Katex tex="10" /> 还是 <Katex tex="9.8" /> 要看题目要求，同一道题里不要混用。</p>
    <p>「<Katex tex="g" /> 与物体质量无关」这一结论与生活直觉不符——重的物体似乎落得更快。原因是空气阻力的大小与物体的形状、截面积有关，在同样的重力下，阻力对轻而大的物体影响更大。加上阻力之后，落体运动不再是匀加速的，速度会趋于一个极限值；这就是雨滴不会因越落越快而伤人、跳伞要打开伞的原因。</p>

    <h3 class="sec" id="m4-up">竖直上抛运动</h3>
    <p>把物体以初速度 <Katex tex="v_0" /> 竖直向上抛出，抛出后只受重力作用，它的运动叫<strong>竖直上抛运动</strong>。取竖直向上为正方向，初速度为正，加速度为 <Katex tex="-g" />，代入基本式得</p>
    <p style="text-align:center"><Katex tex="v=v_0-gt,\qquad h=v_0t-\frac12gt^2." display /></p>
    <p>速度随时间减小，到零时物体到达最高点。令 <Katex tex="v=0" /> 解出到达最高点的时间，再代回高度公式：</p>
    <p style="text-align:center"><Katex tex="t_{\text{上}}=\frac{v_0}{g},\qquad H=\frac{v_0^2}{2g}." display /></p>
    <p>最高点之后物体开始下落，速度变为负值，表示方向向下，而加速度仍为 <Katex tex="-g" />，大小与方向都没有改变。这一点常被误解：最高点并不是「受力平衡」的位置，物体在最高点仍然只受重力，加速度依旧是 <Katex tex="g" />，只是此刻速度为零。</p>
    <p>下面的演示分三档查看。点「自由落体」，画面上只有一只蓝球从抛出高度静止放开；点「竖直上抛」，只有一只橙球以 <Katex tex="v_0" /> 向上抛出；点「一起看」，两球同高度同时出发，谁先落地一眼可比。右栏的高度—时间图在上、速度—时间图在下，两张图共用同一条横轴，一条竖虚线上下贯穿，图里的球、两张图上的点与读数栏的数值都取自同一时刻。以上抛那一档为例：<Katex tex="y\text{-}t" /> 抛物线在 <Katex tex="t_{\text{上}}" /> 处取到顶点，左右两段关于这条竖直线对称；<Katex tex="v\text{-}t" /> 是一条斜率为 <Katex tex="-g" /> 的直线，横轴上方那块面积是上升高度，下方那块是回落的高度，两块等大。初始高度 <Katex tex="H" /> 可以拖到 <Katex tex="0" />：取零时自由落体就是贴地释放，竖直上抛就是从地面向上抛出，两张图的起点都落在时间轴上。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力4 · <b>自由落体与竖直上抛</b>：上方的三枚按钮切换查看对象——自由落体只留蓝球，竖直上抛只留橙球，一起看则两球同高度同时出发。左栏一根竖直标尺，绿箭头是速度、长度与速率成正比；右栏高度—时间图在上、速度—时间图在下，共用同一条时间轴，一条竖虚线上下贯穿，同一时刻的两个读数对得起来。看点：橙球先升到最高点（橙色横线）再落回，落地总比蓝球晚；y-t 图上上升与下落两段关于 t上 对称，回到抛出高度的时刻正好是 2t上；v-t 图上是一条斜率 −g 的直线，横轴上下的两块面积等大——上升多少，回落就多少。只点自由落体时，两张图各只剩一条蓝线，即 y = H − ½gt² 与 v = −gt。</p>

    <h3 class="sec" id="m4-sym">上升与下落的对称性</h3>
    <p>竖直上抛运动只有一个加速度 <Katex tex="-g" />，上升段与下落段是同一条抛物线轨迹的两半，因此具有对称性。设抛出点为原点，某高度 <Katex tex="h" /> 处的速度满足</p>
    <p style="text-align:center"><Katex tex="v^2=v_0^2-2gh." display /></p>
    <p><Katex tex="v^2" /> 只依赖 <Katex tex="h" />，所以物体在上升与下落两次经过同一高度时，速率相等、方向相反。由 <Katex tex="h=v_0t-\frac12gt^2" /> 解出经过高度 <Katex tex="h" /> 的两个时刻，它们关于最高点时刻对称，两次经过的时间之和恒为 <Katex tex="\frac{2v_0}{g}" />。</p>
    <p>回到抛出点的高度 <Katex tex="h=0" /> 时，由 <Katex tex="v_0t-\frac12gt^2=0" /> 得 <Katex tex="t=0" />（抛出时刻）与 <Katex tex="t=\frac{2v_0}{g}" />（落回时刻），后者是前者的两倍。此时 <Katex tex="v=v_0-g\cdot\frac{2v_0}{g}=-v_0" />，速度与抛出时等大反向。这一组结论可以整体使用：竖直上抛的全过程，除最高点外，同一高度处的速率都相等。</p>
    <p>解题时推荐整体法：始终取向上为正，<Katex tex="v" /> 与 <Katex tex="h" /> 带符号代入同一组公式。位移为负表示物体落在抛出点下方，速度为负表示正在下落，不需要中途改变公式。分段法把上升与下落分开列式，思路直观，但两段的正方向与初速度都要重新规定，容易在衔接处出错。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：认为最高点加速度为零。</strong>最高点只是速度为零，受力仍然只有重力，加速度为 <Katex tex="g" />、方向向下。速度为零与加速度为零是两件事。</li>
        <li><strong>提示二：把竖直上抛当成分段运动分别套公式。</strong>整体法用一个正方向就能覆盖全程。只有问「经过某高度几次」「何时在某高度」这类问题时，才需要由二次方程的两个根分别讨论。</li>
        <li><strong>提示三：自由落体的时间算错。</strong>自由落体要求初速度为零。若物体有向下的初速度，它是匀加速直线运动而不是自由落体，公式中的 <Katex tex="v_0" /> 不能省。</li>
        <li><strong>提示四：忽略空气阻力。</strong>轻小物体、下落距离长或速度大时，空气阻力不可忽略，实际的落体不再是匀加速。题目若未说明「不计空气阻力」，结论只能定性使用。</li>
      </ul>
    </div>
    <p>回收与预告：把竖直上抛的公式与匀变速公式对照，可以看到它们只在 <Katex tex="v_0" /> 与 <Katex tex="a" /> 的取值上不同。下一章换一个角度，从图像读运动，处理两物体之间的追及与相遇。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('freefall');
</script>
