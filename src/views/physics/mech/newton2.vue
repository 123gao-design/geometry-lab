<template>
  <PhysicsCh id="newton2"
    sub="物体的加速度跟合外力成正比、跟质量成反比，方向与合外力相同，写成 F = ma。这条定律把力、质量与加速度连在一起：已知力求运动，或已知运动求力，都从这里出发。"
    :toc="[
      { id: 'n2-two', t: '加速度由什么决定' },
      { id: 'n2-law', t: '牛顿第二定律' },
      { id: 'n2-props', t: '矢量性、瞬时性与同体性' },
      { id: 'n2-use', t: '用 F = ma 解题的步骤' },
    ]">
    <div class="note good">
      物体的加速度跟合外力成正比、跟质量成反比：<Katex tex="a \propto \frac{F}{m}" />，取国际单位制后比例系数为 <Katex tex="1" />，写成 <Katex tex="F=ma" />。式中的 <Katex tex="F" /> 是<strong>合外力</strong>，<Katex tex="a" /> 的方向与合外力相同。力的单位由这条定律定义：使质量为 <Katex tex="1\ \text{kg}" /> 的物体产生 <Katex tex="1\ \text{m/s}^2" /> 加速度的力为 <Katex tex="1\ \text{N}" />。
    </div>

    <h3 class="sec" id="n2-two">加速度由什么决定</h3>
    <p>同样的推力，推空车比推满车启动得快；同样一辆车，推力越大启动越快。日常经验提示两件事：加速度与力有关，也与质量有关。要弄清关系，得一次只变一个量，这就是<strong>控制变量法</strong>。</p>
    <p>保持小车质量不变，用不同的拉力拉动同一辆放在光滑水平面上的小车，测出每次的加速度。数据表明，加速度与拉力成正比：</p>
    <p style="text-align:center"><Katex tex="a \propto F \quad (m \text{ 不变})." display /></p>
    <p>保持拉力不变，改变小车的质量，测出的加速度与质量成反比：</p>
    <p style="text-align:center"><Katex tex="a \propto \frac{1}{m} \quad (F \text{ 不变})." display /></p>
    <p>两条合起来，加速度与 <Katex tex="\frac{F}{m}" /> 成正比，即</p>
    <p style="text-align:center"><Katex tex="a=k\frac{F}{m}." display /></p>
    <p>比例系数 <Katex tex="k" /> 的数值取决于力、质量与加速度各单位之间的约定。只要这三者都用国际单位，<Katex tex="k" /> 就等于 <Katex tex="1" />，式子写成 <Katex tex="F=ma" />。反过来说，这条定律也给出了力的单位：<Katex tex="1\ \text{N} = 1\ \text{kg}\cdot\text{m/s}^2" />。力的单位不是独立定义的，而是由牛顿第二定律从质量、长度与时间导出的。</p>

    <h3 class="sec" id="n2-law">牛顿第二定律</h3>
    <p>定律的内容是：<strong>物体加速度的大小跟它受到的合外力成正比、跟它的质量成反比，加速度的方向跟合外力的方向相同。</strong></p>
    <p style="text-align:center"><Katex tex="F_{\text{合}}=ma." display /></p>
    <p>式中的 <Katex tex="F_{\text{合}}" /> 是物体所受所有外力的合力，不是其中某一个力。合力的求法在力的合成一章里已经给出：多个力作用在同一点时，先合成再代入。</p>
    <p>这条定律把牛顿第一定律包含了进去。合力为零时 <Katex tex="a=0" />，速度不变，这正是第一定律说的情形；合力不为零时，加速度的大小与方向都由合力与质量决定。第一定律指出了力与运动的关系，第二定律把这个关系定量化了。</p>
    <p>由 <Katex tex="F=ma" /> 还可以看出，加速度与合外力是同时变化的：合力一经改变，加速度立刻取新的值，不需要时间积累。速度的变化才需要时间，这一点在解刹车、启动一类问题时很关键。</p>
    <p>三个量之间的关系，下面那块板用同一辆小车演示：左边画着光滑水平面上的小车与两支箭头，右边是把加速度读成斜率的 v-t 图。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力10 · <b>牛顿第二定律</b>：小车放在光滑水平面上，由静止开始被一根恒定的拉力拉动。左边的橙色箭头是拉力 <Katex tex="F" />，绿色箭头是加速度 <Katex tex="a" />，两根箭头的长度分别正比于各自的量值；右边的 v-t 图上，直线过原点，斜率就是加速度，橙色三角形标出的是 <Katex tex="\tfrac{\Delta v}{\Delta t}" />，蓝色面积是位移。看点：把「拉力 F」从 4 N 拖到 8 N，斜率随之加倍，加速度箭头也变长；把「质量 m」从 2 kg 拖到 4 kg，斜率减半。读数栏里 <Katex tex="F/m" />、<Katex tex="ma" /> 与由位移反推的 <Katex tex="2x/t^2" /> 三路算出的加速度始终相等，这就是 <Katex tex="F=ma" /> 的数值验证。</p>

    <h3 class="sec" id="n2-props">矢量性、瞬时性与同体性</h3>
    <p><strong>矢量性。</strong>加速度与合外力都是矢量，方向永远一致。一维情形下把正方向定好，两者带同一组符号；二维情形常用正交分解，把力分解到两条互相垂直的坐标轴上，每个方向的合力只决定该方向的加速度：</p>
    <p style="text-align:center"><Katex tex="F_x=ma_x,\qquad F_y=ma_y." display /></p>
    <p>这就是所谓<strong>独立性</strong>：两个方向各算各的，互不牵制。平抛运动把运动分解成水平匀速与竖直自由落体，依据正在这里。</p>
    <p><strong>瞬时性。</strong>合力、质量与加速度是同一时刻的量。力一撤去，加速度立即为零，速度却保持撤力那一刻的值，不会马上停下。弹簧振子中弹力随位置变化，加速度也随位置变化，可见加速度与力逐点对应。</p>
    <p><strong>同体性。</strong>式中的 <Katex tex="F" />、<Katex tex="m" />、<Katex tex="a" /> 必须属于同一个研究对象。解连接体问题时先确定研究对象，再列式；换研究对象就要重新做受力分析。</p>
    <p><strong>相对性。</strong>定律只在惯性参考系中成立。在加速的车上观察，物体的加速度与所受合力对不上，多出来的部分来自参考系本身，不属于动力学规律。</p>

    <h3 class="sec" id="n2-use">用 F = ma 解题的步骤</h3>
    <p>动力学问题分成两类：已知受力情况求运动，已知运动情况求受力。两类都按同一套步骤走。</p>
    <p><strong>第一步，确定研究对象。</strong>可以是一个物体，也可以是几个物体组成的整体。研究对象一旦选定，后续的力、质量、加速度都只属于它。</p>
    <p><strong>第二步，受力分析。</strong>按重力、弹力、摩擦力、其他的顺序把力逐个找出来，画出力的示意图。</p>
    <p><strong>第三步，规定正方向或建立坐标系。</strong>一维情形取运动方向为正；二维情形让尽可能多的力落在坐标轴上，减少分解的工作量。</p>
    <p><strong>第四步，列方程。</strong>把力分解后求合力，代入 <Katex tex="F_{\text{合}}=ma" />。几个物体就连立几个方程，物体之间再用加速度或作用力的关系联系起来。</p>
    <p><strong>第五步，求解并检验。</strong>解出未知量，检查单位、方向与数量级是否合理，再与题目给的情境对照。</p>
    <p>举一个简单例子。光滑水平面上一个质量 <Katex tex="m" /> 的物块，受到与水平方向成 <Katex tex="\theta" /> 角的斜向上拉力 <Katex tex="F" />。把 <Katex tex="F" /> 分解，竖直分量与支持力、重力平衡，水平分量就是合力，于是</p>
    <p style="text-align:center"><Katex tex="a=\frac{F\cos\theta}{m}." display /></p>
    <p>只有当 <Katex tex="\theta=0" /> 时，加速度才等于 <Katex tex="\frac{F}{m}" />。斜着拉时，一部分力被用在竖直方向上，无法全部用来加速。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把某一个力直接代入 F = ma。</strong>式中的 <Katex tex="F" /> 是合力。受力不止一个时，先合成（或正交分解后分别求合力），再代入。</li>
        <li><strong>提示二：认为加速度与速度同向。</strong>加速度与合外力同向，与速度可以不同向。刹车时加速度与速度反向，物体做减速运动。</li>
        <li><strong>提示三：把 ma 也画进受力图。</strong><Katex tex="ma" /> 是合力作用的效果，不是力。受力图上只画真实的力，每个力都要找得到施力物体。</li>
        <li><strong>提示四：单位不统一就代公式。</strong>只有力用 <Katex tex="\text{N}" />、质量用 <Katex tex="\text{kg}" />、加速度用 <Katex tex="\text{m/s}^2" /> 时系数才为 1。质量用克、力用其他单位时直接代入会差出倍数。</li>
      </ul>
    </div>
    <p>回收与预告：有了 <Katex tex="F=ma" />，只要弄清物体受了哪些力，就能求出它的运动。力从哪来、两个物体彼此施力时有什么规律，是下一章的内容。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('newton2');
</script>
