<template>
  <PhysicsCh id="friction"
    sub="摩擦力产生在两个相互接触并挤压、且有相对运动或相对运动趋势的物体之间。物体仍旧静止时，静摩擦的大小由平衡条件给出；物体滑起来之后，滑动摩擦由 f = μN 给出。两者在最大静摩擦处接上。"
    :toc="[
      { id: 'f-static', t: '静摩擦' },
      { id: 'f-kinetic', t: '滑动摩擦' },
      { id: 'f-dir', t: '方向与作用效果' },
      { id: 'f-tips', t: '读题时的几点' },
    ]">
    <div class="note good">
      静摩擦与滑动摩擦是两种不同的模型。静摩擦的大小由平衡条件定，满足
      <Katex tex="0\le f\le f_{\max}" />，最大静摩擦 <Katex tex="f_{\max}=\mu N" />；滑动摩擦由
      <Katex tex="f=\mu N" /> 直接给出。两式的 <Katex tex="N" /> 都是<strong>正压力</strong>，不一定等于重力。摩擦力的方向与<strong>相对运动（或相对运动趋势）</strong>的方向相反，与物体的运动方向可以相同。
    </div>

    <h3 class="sec" id="f-static">静摩擦</h3>
    <p>用力推一只放在地上的箱子，箱子没有动。它在水平方向上只受两个力：推力和地面对它的摩擦力，两者等大反向，合力为零。这个摩擦力叫<strong>静摩擦力</strong>，它产生的原因是箱子与地面之间存在相对运动的趋势，而接触面又把这种趋势挡住了。</p>
    <p>静摩擦的特点是：它的大小不是由公式算出来的，而是由<strong>平衡条件</strong>或牛顿第二定律定出来的。推力多大，静摩擦就多大，直到某个上限为止。这个上限叫<strong>最大静摩擦力</strong>：</p>
    <p style="text-align:center"><Katex tex="f_{\max}=\mu N," display /></p>
    <p>式中 <Katex tex="\mu" /> 是静摩擦因数，<Katex tex="N" /> 是接触面间的正压力。因此静摩擦的取值范围是</p>
    <p style="text-align:center"><Katex tex="0\le f\le f_{\max}." display /></p>
    <p>推力一旦超过 <Katex tex="f_{\max}" />，箱子就开始滑动。实验表明，最大静摩擦力略大于滑动摩擦力，中学阶段常把两者看作相等，取同一个 <Katex tex="\mu" />。</p>

    <h3 class="sec" id="f-kinetic">滑动摩擦</h3>
    <p>物体在另一个物体表面滑动时受到的摩擦力叫<strong>滑动摩擦力</strong>。它的大小与正压力成正比：</p>
    <p style="text-align:center"><Katex tex="f=\mu N," display /></p>
    <p>其中 <Katex tex="\mu" /> 是动摩擦因数，由两个接触面的材料和粗糙程度决定，没有单位。滑动摩擦力与接触面积的大小无关，与相对滑动的速度也近似无关——把同一块木料侧放、竖放，滑动时的摩擦力相同。</p>
    <p><Katex tex="N" /> 要按具体情况算，不是一律取 <Katex tex="mg" />。放在水平面上的物体，<Katex tex="N=mg" />；放在倾角为 <Katex tex="\theta" /> 的斜面上，<Katex tex="N=mg\cos\theta" />；若物体还受到斜向上的拉力，正压力会进一步减小。这是本章最容易出错的一处。</p>
    <p>把拉力从零慢慢加大，两种摩擦的接续过程就完整地露出来了。下面那块板的左半画着水平拉地上的木块，右半把摩擦力随拉力的变化画成一条折线。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力7 · <b>静摩擦与滑动摩擦</b>：木块放在水平地面上，水平拉力 <Katex tex="F" /> 由滑块给出，右图画摩擦力 <Katex tex="f" /> 随 <Katex tex="F" /> 的变化。拉力较小时木块不动，静摩擦与拉力等大，图线沿 45° 上升；拉力越过 <Katex tex="\mu N" /> 之后拐成水平，摩擦力不再增大，多出来的那部分合力使木块加速。看点：把 <Katex tex="\mu" /> 调大，拐点右移、水平段抬高；把质量调大，正压力变大，拐点也随之上移。左下的状态文字同步显示木块是静止还是已经起步。</p>

    <h3 class="sec" id="f-dir">方向与作用效果</h3>
    <p>摩擦力的方向与<strong>相对运动或相对运动趋势的方向相反</strong>，而不是与物体的运动方向相反。这一点在传送带上最清楚：传送带匀速前进，把一只箱子轻轻放上去，箱子相对传送带向后滑动，受到向前的滑动摩擦力，于是被带着加速。此时摩擦力是<strong>动力</strong>，方向与运动方向相同。</p>
    <p>判断方向分两步走：先看两个接触面之间<em>谁相对谁</em>在动，再看摩擦力的方向与这个相对运动方向相反。静摩擦则看相对运动趋势——假设接触面光滑，物体会往哪个方向动，静摩擦就指向相反的方向。</p>

    <h3 class="sec" id="f-tips">读题时的几点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把正压力当成重力。</strong><Katex tex="N" /> 是接触面间的压力。斜面上要分解重力，有斜向拉力时还要扣掉拉力的竖直分量。</li>
        <li><strong>提示二：认为静摩擦等于 <Katex tex="\mu N" />。</strong><Katex tex="\mu N" /> 是静摩擦的上限。物体没动时，静摩擦由平衡条件定，通常小于这个值。</li>
        <li><strong>提示三：把摩擦力一律当作阻力。</strong>摩擦力阻碍的是相对运动，不是运动。传送带上的箱子、从静止开始加速的汽车，靠的都是摩擦力作动力。</li>
        <li><strong>提示四：认为滑动摩擦与接触面积有关。</strong>公式里没有面积。同样的正压力与动摩擦因数，接触面大小不影响摩擦力，只影响压强。</li>
        <li><strong>提示五：混淆运动方向与相对运动方向。</strong>两物体同向同速时，彼此之间没有相对运动，也就没有滑动摩擦。判断摩擦力要先选定参照的一方。</li>
      </ul>
    </div>
    <p>回收与预告：重力、弹力、摩擦力是高中阶段最先遇到的三类力。物体受到的力往往不止一个，接下来要把多个力合到一起，用平行四边形定则求合力，再用共点力平衡的条件处理静止与匀速的情形。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('friction');
</script>
