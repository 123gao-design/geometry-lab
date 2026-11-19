<template>
  <PhysicsCh id="proj2"
    sub="以水平初速度抛出、只受重力的运动叫平抛运动。水平方向不受力，做匀速直线运动；竖直方向初速度为零，做自由落体。两条分运动同步进行，合成出抛物线：轨迹方程 y = gx²/(2v₀²)，飞行时间只由抛出高度决定。"
    :toc="[
      { id: 'p2-cond', t: '平抛运动的定义与条件' },
      { id: 'p2-split', t: '分解为两个方向' },
      { id: 'p2-eq', t: '轨迹方程与速度方向' },
      { id: 'p2-time', t: '飞行时间与落地速度' },
    ]">
    <div class="note good">
      物体以水平初速度 <Katex tex="v_0" /> 抛出，抛出后只受重力（不计空气阻力），这样的运动叫<strong>平抛运动</strong>。按上一章的独立性，把它拆成两个方向：水平方向没有力，速度保持 <Katex tex="v_0" /> 不变，做匀速直线运动，位移 <Katex tex="x=v_0t" />；竖直方向初速度为零、只受重力，做自由落体，位移 <Katex tex="y=\tfrac12gt^2" />。消去时间得轨迹 <Katex tex="y=\dfrac{g}{2v_0^2}x^2" />，是一条抛物线。飞行时间 <Katex tex="t=\sqrt{2h/g}" /> 只由抛出高度决定，与水平初速度无关。
    </div>

    <h3 class="sec" id="p2-cond">平抛运动的定义与条件</h3>
    <p>平抛运动的两个条件是：初速度沿水平方向，抛出后只受重力。只要离开手之后不再受到别的力，抛出的方式并不限于是手推还是水平轨道弹出。空气阻力忽略不计，这是「只受重力」的实际含义。</p>
    <p>严格说来，地球表面重力并不指向一个确定的点，抛出物体的轨迹也不是严格的抛物线；在通常的尺度下，重力看作恒力，方向竖直向下，轨迹取抛物线就足够精确。水平初速度很大（例如几百米每秒）时，地面的弯曲开始起作用，轨道变成一段椭圆的一部分，那是万有引力一章的内容。</p>
    <p>平抛的加速度恒为 <Katex tex="g" />，方向竖直向下，与初速度垂直。加速度恒定而初速度与力垂直，这正是曲线运动最简单的模型：速度方向不断改变，但改变的方式非常有规律。</p>

    <h3 class="sec" id="p2-split">分解为两个方向</h3>
    <p>以抛出点为原点，水平向右为 <Katex tex="x" /> 轴，竖直向下为 <Katex tex="y" /> 轴，取抛出时刻为零。水平方向与竖直方向各自独立发展，同一时刻 <Katex tex="t" /> 的两个位移与两个速度为</p>
    <p style="text-align:center"><Katex tex="x=v_0t,\quad v_x=v_0;\qquad y=\tfrac12gt^2,\quad v_y=gt." display /></p>
    <p>这四行是全章的基础。水平方向的速度始终等于 <Katex tex="v_0" />，没有变化，因为水平方向没有力；竖直方向的速度从零开始随时间均匀增大，说明竖直方向是自由落体。合速度的大小与方向由平行四边形定则给出：</p>
    <p style="text-align:center"><Katex tex="v=\sqrt{v_x^2+v_y^2}=\sqrt{v_0^2+g^2t^2},\qquad \tan\alpha=\frac{v_y}{v_x}=\frac{gt}{v_0}," display /></p>
    <p>其中的 <Katex tex="\alpha" /> 是合速度与水平方向的夹角，叫<strong>速度偏角</strong>。随着时间推移，<Katex tex="v_y" /> 越来越大，<Katex tex="\alpha" /> 越来越大，合速度的方向越来越陡——这正是抛物线越往下越陡的原因。</p>
    <p>竖直方向上的自由落体照样遵守匀变速直线运动的三个基本式，只是初速度为零、加速度为 <Katex tex="g" />：<Katex tex="v_y=gt" />、<Katex tex="y=\tfrac12gt^2" />、<Katex tex="v_y^2=2gy" />。最后这一式常用来跳过时间求竖直速度。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力14 · <b>平抛运动</b>：小球从高台上以水平初速抛出，橙色轨迹越往下越陡。蓝箭头是水平分速度，长度自始至终不变；橙箭头是竖直分速度，从零开始一段段变长；绿箭头是两者的合速度，它的末端总是与轨迹相切。轨迹上每一枚小点相隔同样的时间（每段是全过程的八分之一），横向间隔相等，纵向越往下越密，正好把「水平匀速、竖直加速」两件事画在同一张图上。右栏的 v-t 图把三条速度同时画出：蓝线水平，说明 <Katex tex="v_x" /> 不变；橙线过原点、斜率等于 <Katex tex="g" />；绿线是它们的合成，是一条开口向上的曲线。看点一：拖动「抛出高度 h」，飞行时间、竖直速度、落地速度随之变，轨迹的形状（抛物线张开程度）却不变，因为水平初速没动。看点二：拖动「水平初速 v0」，轨迹变宽或变窄，飞行时间一格不动——时间只认高度。看点三：竖虚线扫过右图，三个动点的高度就是左图三根箭头的长度，同一时刻的读数在读数栏里对得上。</p>

    <h3 class="sec" id="p2-eq">轨迹方程与速度方向</h3>
    <p>把 <Katex tex="t=x/v_0" /> 代入 <Katex tex="y=\tfrac12gt^2" />，消去时间，得到轨迹方程</p>
    <p style="text-align:center"><Katex tex="y=\frac{g}{2v_0^2}\,x^2." display /></p>
    <p>这是一个不含一次项的二次式，顶点在原点，开口朝 <Katex tex="y" /> 轴的正方向（画面上向下），与 <Katex tex="y=ax^2" /> 的形状完全一样，只是系数为 <Katex tex="\dfrac{g}{2v_0^2}" />。系数越小，抛物线越平缓，射程越远。</p>
    <p>轨迹上任一点的速度方向沿该点切线，切线的斜率就是 <Katex tex="\tan\alpha" />。对轨迹方程求导，得 <Katex tex="y'=\dfrac{gx}{v_0^2}" />，与 <Katex tex="\tan\alpha=\dfrac{gt}{v_0}" /> 一致（把 <Katex tex="x=v_0t" /> 代进去即得）。</p>
    <p>另有一个位移偏角 <Katex tex="\beta" />，是抛出点到该点的连线与水平方向的夹角：</p>
    <p style="text-align:center"><Katex tex="\tan\beta=\frac{y}{x}=\frac{gt}{2v_0}=\frac12\tan\alpha." display /></p>
    <p>速度偏角的正切总是位移偏角正切的两倍。这条关系在解题里很省事：把某个时刻的速度方向延长，它与水平轴的交点恰好落在抛出点与该点水平投影的中点，由此可以直接定出位置，不必先求时间。</p>

    <h3 class="sec" id="p2-time">飞行时间与落地速度</h3>
    <p>物体从高度 <Katex tex="h" /> 处平抛，落地时竖直方向下落了 <Katex tex="h" />。由 <Katex tex="h=\tfrac12gt^2" /> 得</p>
    <p style="text-align:center"><Katex tex="t=\sqrt{\frac{2h}{g}},\qquad x=v_0\sqrt{\frac{2h}{g}}." display /></p>
    <p>飞行时间只由高度决定，与水平初速度无关：同高度的平抛，无论抛出快慢，落地的时刻相同。水平射程则与初速度成正比，初速度加倍，射程也加倍。</p>
    <p>落地时的竖直速度由 <Katex tex="v_y^2=2gh" /> 得 <Katex tex="v_y=\sqrt{2gh}" />，结合水平的 <Katex tex="v_0" />，落地速度与其方向为</p>
    <p style="text-align:center"><Katex tex="v=\sqrt{v_0^2+2gh},\qquad \tan\alpha=\frac{\sqrt{2gh}}{v_0}." display /></p>
    <p>同一高度下的平抛，落地速度的大小随初速度增大而增大，但飞行时间不变；<Katex tex="v_0=0" /> 时上述各式退化为自由落体的结论，平抛确实是自由落体与水平匀速的合成。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：认为水平初速越大，落地越晚。</strong>飞行时间由高度决定，<Katex tex="t=\sqrt{2h/g}" />，与 <Katex tex="v_0" /> 无关。初速只影响射程与落地速度的大小和方向。</li>
        <li><strong>提示二：把速度偏角与位移偏角混为一谈。</strong>两者的正切相差一倍。图上「速度方向反向延长过水平位移中点」指的是速度偏角，直接用位移的斜率代进去就错了。</li>
        <li><strong>提示三：给竖直方向也加一个初速度。</strong>平抛的竖直初速度为零，<Katex tex="v_y=gt" /> 从零起算。若题目给的是斜抛或竖直下抛，竖直方向另有初速度，公式要换成 <Katex tex="v_y=v_{y0}+gt" />。</li>
        <li><strong>提示四：忘记重力加速度的方向。</strong>建立坐标系时竖直轴一律向下为正，<Katex tex="g" /> 取正值；若把向下记作负，所有式子的符号都要跟着改，两套混用是最常见的出错来源。</li>
      </ul>
    </div>
    <p>回收与预告：平抛是从抛出点开始、初速度水平的情形，竖直方向只有下落、没有上升。把初速度倾斜着抛出，竖直方向先上升再下落，水平方向仍是匀速，轨迹对称起来——下一章讲这种斜抛运动，射程与初速度、抛射角的关系也在那里给出。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('proj2');
</script>
