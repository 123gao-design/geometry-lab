<template>
  <PhysicsCh id="circ1"
    sub="质点沿圆周运动时，弧长、圆心角、线速度、角速度、周期与转速各描述一面，核心关系是 v = ωr。速率可以不变，速度方向却时刻在变，速度的变化量指向圆心，由此得到向心加速度 a = v²/r = ω²r，以及向心力 F = mv²/r = mω²r。向心力是效果力，由具体的某个力或某几个力的合力提供。"
    :toc="[
      { id: 'c1-desc', t: '描述圆周运动的物理量' },
      { id: 'c1-acc', t: '速度的变化与向心加速度' },
      { id: 'c1-force', t: '向心力与供需关系' },
      { id: 'c1-trans', t: '传动关系' },
    ]">
    <div class="note good">
      质点沿圆周运动时，走过的弧长与半径之比是转过的圆心角：<Katex tex="s=r\theta" />。把这个比例对时间取变化率，得到线速度与角速度的关系
      <Katex tex="v=\omega r" />，再加上周期 <Katex tex="T=\dfrac{2\pi}{\omega}" /> 与频率 <Katex tex="f=\dfrac1T" />，圆弧上的运动就描述完了。
      匀速圆周运动的「匀速」只指速率不变，速度的方向一刻不停地改。速度既然在变，就必有加速度：把两个时刻的速度平移到同一起点，速度增量 <Katex tex="\Delta \mathbf{v}" /> 沿半径指向圆心，于是
      <Katex tex="a=\dfrac{v^2}{r}=\omega^2 r=\dfrac{4\pi^2 r}{T^2}" />，方向指向圆心，称为<strong>向心加速度</strong>。由牛顿第二定律，
      <Katex tex="F=\dfrac{mv^2}{r}=m\omega^2 r" />，称为<strong>向心力</strong>。
    </div>

    <h3 class="sec" id="c1-desc">描述圆周运动的物理量</h3>
    <p>研究圆周运动先要把「走得多快」与「转得多快」分开。质点沿半径为 <Katex tex="r" /> 的圆周走过弧长 <Katex tex="s" />，对应的圆心角为 <Katex tex="\theta" />（单位用弧度），两者的比例恒为半径：</p>
    <p style="text-align:center"><Katex tex="s=r\theta." display /></p>
    <p>对时间求变化率，左边是弧长的变化率即线速度 <Katex tex="v" />，右边是角度的变化率即角速度 <Katex tex="\omega" />：</p>
    <p style="text-align:center"><Katex tex="v=\omega r." display /></p>
    <p>这条式子把两种「快」接起来：同一个圆上各点的角速度相同，半径越大的点线速度越大。转一圈对应的圆心角是 <Katex tex="2\pi" />，弧长是周长 <Katex tex="2\pi r" />，所以</p>
    <p style="text-align:center"><Katex tex="T=\frac{2\pi}{\omega}=\frac{2\pi r}{v},\qquad f=\frac1T=\frac{\omega}{2\pi},\qquad n=f." display /></p>
    <p>周期、频率、转速是同一件事的三种说法：转一圈用时 <Katex tex="T" />，每秒转 <Katex tex="f=\frac1T" /> 圈。工程上的转速常用「转每分」作单位，换算时乘 <Katex tex="\frac{1}{60}" /> 即可。</p>
    <p>速率恒定、方向均匀改变的圆周运动叫<strong>匀速圆周运动</strong>。它是变速运动——只要方向变，速度就变；但它不是匀变速运动，因为加速度的方向也在变。</p>

    <h3 class="sec" id="c1-acc">速度的变化与向心加速度</h3>
    <p>判断一个运动有没有加速度，看速度矢量有没有变，不看速率。匀速圆周运动中的速度大小不变、方向在转，把时刻 <Katex tex="t" /> 与 <Katex tex="t+\Delta t" /> 的速度矢量平移到同一个起点，两个箭头等长、夹角为转过的圆心角 <Katex tex="\Delta \theta" />，它们的差 <Katex tex="\Delta \mathbf{v}" /> 就是速度增量。</p>
    <p>在这段极短的时间里，<Katex tex="\Delta \theta" /> 很小，等腰三角形退化成直角三角形，弦长近似等于弧长：</p>
    <p style="text-align:center"><Katex tex="\left|\Delta \mathbf{v}\right|\approx v\,\Delta\theta." display /></p>
    <p>除以 <Katex tex="\Delta t" />，并用 <Katex tex="\omega=\dfrac{\Delta\theta}{\Delta t}" /> 代换：</p>
    <p style="text-align:center"><Katex tex="a=\frac{\left|\Delta \mathbf{v}\right|}{\Delta t}\approx v\,\omega=\frac{v^2}{r}=\omega^2r." display /></p>
    <p>时间取得越短，弦与弧的差别越小，等号越严格。方向要单独看：<Katex tex="\Delta \mathbf{v}" /> 由旧速度的末端指向新速度的末端，在极限情形下与半径方向重合，指向圆心。所以匀速圆周运动的加速度大小不变、方向时刻指向圆心，它的作用只是改变速度的方向，不改变速率。</p>
    <p>三个等价写法各有用处：<Katex tex="\dfrac{v^2}{r}" /> 适合作矢量分解时用，<Katex tex="\omega^2r" /> 适合角速度已知（同轴转动的各点）时用，<Katex tex="\dfrac{4\pi^2r}{T^2}" /> 适合天体、周期类问题。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力16 · <b>圆周运动</b>：左栏质点沿虚线圆匀速转动，走过的弧线着绿色，速度箭头（绿）沿切线，加速度箭头（橙）沿半径指向圆心，紫弧是已经转过的圆心角 <Katex tex="\theta" />，青色虚线是半径 <Katex tex="r" />。右栏把两个时刻的速度箭头平移到同一个起点，紫箭头 <Katex tex="\Delta \mathbf{v}" /> 从旧速度末端指向新速度末端，灰色虚线是两者的角平分方向——它就是半径方向。看点一：把「角速度 ω」拖大，右栏两个速度的夹角 <Katex tex="\Delta\theta" /> 变大、<Katex tex="\Delta \mathbf{v}" /> 也随之变长，读数里的 <Katex tex="a=\omega^2r" /> 迅速上升，而速度箭头的长度始终一致。看点二：单独拖「半径 r」，线速度与向心加速度一并变大，<Katex tex="\Delta \mathbf{v}" /> 的方向仍指向圆心。看点三：把「角速度 ω」与「半径 r」各拖一遍，读数栏的 <Katex tex="v=\omega r" />、<Katex tex="a=\omega^2r" />、<Katex tex="F=m\omega^2r" /> 三行始终自洽，右栏那行「Δv ≈ v·Δθ」正是把速度增量换算成加速度的中间一步。</p>

    <h3 class="sec" id="c1-force">向心力与供需关系</h3>
    <p>由牛顿第二定律，使物体产生向心加速度的合力必须指向圆心，大小</p>
    <p style="text-align:center"><Katex tex="F=ma=\frac{mv^2}{r}=m\omega^2r=m\frac{4\pi^2}{T^2}r." display /></p>
    <p>要强调的是：向心力不是一种新的力，它是按效果命名的。<strong>重力、弹力、摩擦力、绳的拉力、杆的支持力都可能充当向心力</strong>，分析时不必在受力图上另添一个「向心力」，而应找出这些实际的力中沿半径指向圆心的分量，令其等于所需的 <Katex tex="\dfrac{mv^2}{r}" />。</p>
    <p>教科书中常见的几种情形可以对照记忆：绳系小球在光滑水平面转动，绳的拉力提供向心力；圆锥摆中重力与拉力的合力提供；汽车在水平路面转弯，静摩擦提供；绕地球飞行的卫星，万有引力提供。</p>
    <p>把提供向心力的力记为 <Katex tex="F_{\text{供}}" />、需要的向心力记为 <Katex tex="F_{\text{需}}=\dfrac{mv^2}{r}" />，两者的比较给出运动的走向：</p>
    <p style="text-align:center"><Katex tex="F_{\text{供}}=F_{\text{需}}\ \text{做圆周运动},\qquad F_{\text{供}}>F_{\text{需}}\ \text{做近心运动},\qquad F_{\text{供}}<F_{\text{需}}\ \text{做离心运动}." display /></p>
    <p>这里说的「供」指该位置实际能提供的最大径向力，与半径方向垂直的力不计入。三种情形中，圆周运动只是恰好相等的那一种，另外两种是把力与运动关系摆正之后自然得到的结果，力18 会专门讨论。</p>

    <h3 class="sec" id="c1-trans">传动关系</h3>
    <p>多个轮子连在一起转动时，先分清是哪一种连接，再决定哪个量相同：</p>
    <p><strong>同轴转动</strong>（皮带轮与它的轴、齿轮与它的轴）：各点随同一个轴一起转，角速度相同，<Katex tex="\omega_1=\omega_2" />。由于 <Katex tex="v=\omega r" />，半径大的位置线速度大，轮缘的速度比轮心附近大。</p>
    <p><strong>皮带传动、齿轮啮合</strong>（轮缘之间不打滑接触）：接触处没有相对滑动，边缘的线速度相同，<Katex tex="v_1=v_2" />。由于 <Katex tex="\omega=\dfrac{v}{r}" />，半径小的轮转得快，与自行车大链轮带小飞轮时后轮转得更快是同一件事。</p>
    <p>这两种关系是解传动问题的全部依据。一套装置里常常两种连接并存：后轮与飞轮同轴、飞轮与链轮皮带传动，按顺序把共同量写出来，未知量一路推下去即可。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把向心力另算成一个力。</strong>向心力是效果力，受力图上多画一条「向心力」箭头，就把同一个效果算了两遍。正确做法是只画真实存在的力，再取它们沿半径的分量。</li>
        <li><strong>提示二：认为匀速圆周运动是匀速运动或匀变速运动。</strong>它的速率不变、方向在变，速度是变的；加速度大小不变、方向在变，所以是变加速运动，不能用匀变速直线运动的公式。</li>
        <li><strong>提示三：传动问题中凭直觉选「相同量」。</strong>同轴看角速度，皮带与齿轮看线速度。选错一个，<Katex tex="v=\omega r" /> 一用，半径的比值就翻成倒数，答案整体偏离。</li>
        <li><strong>提示四：把向心加速度的方向记成速度方向。</strong>向心加速度始终垂直速度、指向圆心，它只改变方向；若加速度与速度同向，速率会变大，向心加速度没有这个效果。</li>
      </ul>
    </div>
    <p>回收与预告：本节把圆周运动的描述与动力学基础搭好——各物理量的换算关系、速度增量的方向、向心力的来源与供需判据。接下来把它放到竖直平面里：同一根绳子上，小球在最高点能不能过顶，取决于所需的向心力与重力之间的关系；这既是本章结论的直接应用，也是力17 要处理的核心问题。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('circ1');
</script>
