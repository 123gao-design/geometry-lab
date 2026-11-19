<template>
  <PhysicsCh id="proj3"
    sub="以斜向上的初速度抛出、只受重力的运动叫斜抛运动。水平方向匀速、竖直方向竖直上抛，两条分运动合成出对称的抛物线：飞行时间 T = 2v₀sinθ/g，射高 H = v₀²sin²θ/(2g)，射程 R = v₀²sin2θ/g。同一初速下，抛射角 45° 射程最大，互补的两个抛射角射程相同。"
    :toc="[
      { id: 'p3-cond', t: '斜抛运动的定义与分解' },
      { id: 'p3-formula', t: '飞行时间、射高与射程' },
      { id: 'p3-best', t: '45° 的最大射程' },
      { id: 'p3-sym', t: '斜抛的对称性' },
    ]">
    <div class="note good">
      以与水平方向成 <Katex tex="\theta" /> 角的初速度 <Katex tex="v_0" /> 抛出、抛出后只受重力，这是<strong>斜抛运动</strong>。水平方向初速度为 <Katex tex="v_0\cos\theta" />、不受力，做匀速直线运动；竖直方向初速度为 <Katex tex="v_0\sin\theta" />、只受重力，做竖直上抛。两相结合得到三个常用结论（落回抛出高度时）：飞行时间 <Katex tex="T=\dfrac{2v_0\sin\theta}{g}" />，射高 <Katex tex="H=\dfrac{v_0^2\sin^2\theta}{2g}" />，射程 <Katex tex="R=\dfrac{v_0^2\sin 2\theta}{g}" />。射程在 <Katex tex="\theta=45^\circ" /> 时取最大值 <Katex tex="v_0^2/g" />。
    </div>

    <h3 class="sec" id="p3-cond">斜抛运动的定义与分解</h3>
    <p>斜抛与平抛的差别只在一处：初速度不沿水平方向，而是与水平方向成 <Katex tex="\theta" /> 角。抛出后同样只受重力，所以两个方向的性质不变，变的只是竖直方向有了向上的初速度。</p>
    <p>以抛出点为原点，水平向右为 <Katex tex="x" /> 轴、竖直向上为 <Katex tex="y" /> 轴，初速度分解为</p>
    <p style="text-align:center"><Katex tex="v_{x}=v_0\cos\theta,\qquad v_{y0}=v_0\sin\theta." display /></p>
    <p>于是任一时刻</p>
    <p style="text-align:center"><Katex tex="x=v_0\cos\theta\cdot t,\qquad y=v_0\sin\theta\cdot t-\tfrac12gt^2,\qquad v_y=v_0\sin\theta-gt." display /></p>
    <p>竖直方向是标准的竖直上抛：速度随时间均匀减小，到最高点减为零，此后变为负值，物体落回原高度。水平方向的速度保持不变。消去时间可得轨迹方程</p>
    <p style="text-align:center"><Katex tex="y=x\tan\theta-\frac{g}{2v_0^2\cos^2\theta}\,x^2," display /></p>
    <p>是顶点在最高点、关于过顶点的竖直线对称的抛物线。射高处的竖直分速为零，这是把最高点作为分段的依据。</p>

    <h3 class="sec" id="p3-formula">飞行时间、射高与射程</h3>
    <p><strong>飞行时间</strong>。落回抛出高度时竖直位移为零（取向上为正）：<Katex tex="v_0\sin\theta\cdot T-\tfrac12gT^2=0" />，解得</p>
    <p style="text-align:center"><Katex tex="T=\frac{2v_0\sin\theta}{g}." display /></p>
    <p>上升与下落各占一半。斜抛水平方向也不影响竖直方向，所以这个时间与平抛同高时的结论一致：竖直分运动的初速度是 <Katex tex="v_0\sin\theta" />，飞行时间就是它「上去再下来」所用的时间。</p>
    <p><strong>射高</strong>。最高点的竖直分速为零，由 <Katex tex="v_y^2=v_{y0}^2-2gH" /> 得</p>
    <p style="text-align:center"><Katex tex="H=\frac{v_0^2\sin^2\theta}{2g}." display /></p>
    <p><strong>射程</strong>。把飞行时间代入水平位移：</p>
    <p style="text-align:center"><Katex tex="R=v_0\cos\theta\cdot T=\frac{2v_0^2\sin\theta\cos\theta}{g}=\frac{v_0^2\sin 2\theta}{g}." display /></p>
    <p>三个式子都只含 <Katex tex="v_0" /> 与 <Katex tex="\theta" />，与质量无关。同一初速下，抛射角越大，射高越大、飞行时间越长；射程先增后减，中间有一个极大值。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力15 · <b>斜抛运动</b>：小球以初速 <Katex tex="v_0" />、抛射角 <Katex tex="\theta" /> 抛出，橙色实线是已经走过的部分，虚线是整条轨迹。最高点向下画一道竖虚线作为对称轴，地面上量出射程 <Katex tex="R" />，抛射角的位置画出 θ 弧。球上三根箭头：蓝的水平分速始终不变，橙的竖直分速由正变负（过最高点后翻向下），绿的合速度大小始终等于 <Katex tex="v_0" />。右栏是射程随抛射角变化的曲线 <Katex tex="R=\dfrac{v_0^2\sin2\theta}{g}" />，橙点是当前角，紫圈是互补角 <Katex tex="90^\circ-\theta" />，两点用虚线连起来、高度相同。看点一：把「抛射角 θ」拖到 45°，橙点落在曲线最高处，读数栏的射程取到最大；左右各拖 10°（35° 与 55°），两处射程相等。看点二：拖动「初速度 v0」，整条曲线升降，最大值按 <Katex tex="v_0^2/g" /> 变化，45° 始终是峰位。看点三：观察最高点之后竖直分速变负、合速度仍等于初速——真空里只有重力做功方式的转换，合速度的大小从抛出的那一刻到落回地面始终不变。</p>

    <h3 class="sec" id="p3-best">45° 的最大射程</h3>
    <p>射程式里的变量只剩 <Katex tex="\sin2\theta" />。它的最大值为 1，在 <Katex tex="2\theta=90^\circ" /> 即 <Katex tex="\theta=45^\circ" /> 时取到，此时</p>
    <p style="text-align:center"><Katex tex="R_{\max}=\frac{v_0^2}{g}." display /></p>
    <p>这一结论对落回同一高度的抛体成立。若抛出点与落地点不等高（例如从高台向地面斜抛、斜面上抛），最省力的角度会偏向一侧，射程式要另行推导，45° 的说法不再适用。</p>
    <p>射程关于 <Katex tex="\theta=45^\circ" /> 对称，源于 <Katex tex="\sin2\theta=\sin(180^\circ-2\theta)" />。设两个抛射角之和为 <Katex tex="90^\circ" />，例如 30° 与 60°，则 <Katex tex="\sin 60^\circ=\sin120^\circ" />，两者射程相同。射高与飞行时间并不相同：抛射角大的那个上得更高、飞得更久，只是横向走得一样远。</p>
    <p>两条轨迹画在同一张图上时，射程相同的两发会在出发点与落点相交，两条抛物线围出一个透镜形的区域。炮弹的射击表里，同一距离上常给高低两个射角，就是这个道理。</p>

    <h3 class="sec" id="p3-sym">斜抛的对称性</h3>
    <p>斜抛的轨迹关于过最高点的竖直线对称，运动也随之成对：</p>
    <p><strong>时间对称</strong>。上升到最高点用时 <Katex tex="\dfrac{v_0\sin\theta}{g}" />，与从最高点落回原高度用时相等，合计即飞行时间 <Katex tex="T" />。</p>
    <p><strong>速率对称</strong>。最高点的竖直分速为零，此处合速度最小，等于 <Katex tex="v_0\cos\theta" />。轨迹上同一高度的两点，速率相等、速度方向关于竖直方向对称：一点斜向上 <Katex tex="\theta" />，另一点斜向下 <Katex tex="\theta" />。全过程中合速度的大小从 <Katex tex="v_0" /> 减小到 <Katex tex="v_0\cos\theta" /> 再回升到 <Katex tex="v_0" />。</p>
    <p><strong>速度偏角对称</strong>。最高点两侧同一高度处，速度偏角的大小相同、符号相反。合速度的方向在最高点由斜向上转为斜向下，转折是连续的，因为水平分速始终存在，方向不会突变。</p>
    <p>这三条对称可以合成一句判断：斜抛在任意高度的往返，等价于先竖直上抛到该高度再平抛回来。处理斜面上的斜抛问题、处理「越过高墙」一类问题时，抓住最高点分段，一半的运动算清楚，另一半照对称写出来即可。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：认为抛射角越大射程越远。</strong>射程按 <Katex tex="\sin2\theta" /> 变化，45° 最大；超过 45° 后射程反而减小，垂直上抛（90°）的射程为零。</li>
        <li><strong>提示二：把 45° 最大射程用到不等高的情形。</strong>该结论以上升与下落同高为前提。从高处向低处抛、在斜面上抛，最远的角度另有其值，需要按落点高度重新列式。</li>
        <li><strong>提示三：认为最高点的速度为零。</strong>最高点只有竖直分速为零，水平分速 <Katex tex="v_0\cos\theta" /> 照旧存在，合速度最小但不为零。竖直上抛的结论不能直接搬过来。</li>
        <li><strong>提示四：把飞行时间写成上升时间。</strong>从抛出到落回原高度是完整的往返，<Katex tex="T=\dfrac{2v_0\sin\theta}{g}" />；只到最高点的时间是它的一半。用错一处，射程与水平位移都会差一倍。</li>
      </ul>
    </div>
    <p>回收与预告：从运动的描述到抛体运动，力与运动的关系在「恒力 + 曲线初速」这一情形里走完了一轮：分解、分方向用一维规律、再合成。抛体运动的加速度始终指向地面，而速度方向不断改变，下一组把这一情形推到极致——加速度大小不变、方向时刻垂直速度、指向一个定点，那就是圆周运动。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('proj3');
</script>
