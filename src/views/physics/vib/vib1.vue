<template>
  <PhysicsCh id="vib1"
    sub="前面的力学研究的都是「从一处到另一处」的过程：给定初、末两个状态，用牛顿定律或功、能量、动量算过程中的量。另有一类运动在某个位置附近来回往复——荡秋千、摆钟、挂在弹簧上的物块——它们没有终点，每隔相同的时间就重复一次。这一章以弹簧振子为模型，先说明物体为什么总被拉回原处，再给出简谐运动的定义、位移随时间的表达式与各描述量，最后用参考圆把周期和劲度系数、质量连起来。"
    :toc="[
      { id: 'v1-spring', t: '弹簧振子与平衡位置' },
      { id: 'v1-force', t: '回复力与简谐运动' },
      { id: 'v1-desc', t: '振幅、周期与相位' },
      { id: 'v1-circle', t: '参考圆与周期公式' },
    ]">
    <div class="note good">
      物体在平衡位置附近的往复运动叫<strong>机械振动</strong>。指向平衡位置、使物体回到原处的合力叫<strong>回复力</strong>，它由某个实际的力充当。若回复力与偏离平衡位置的位移成正比且方向相反，
      <Katex tex="F=-kx" />，这样的振动叫<strong>简谐运动</strong>，其位移随时间按
      <Katex tex="x=A\cos(\omega t+\varphi)" /> 变化，是一条余弦（正弦）曲线。<strong>振幅</strong> <Katex tex="A" /> 是位移的最大值，<strong>周期</strong> <Katex tex="T" /> 是完成一次全振动的时间，频率 <Katex tex="f=1/T" />，角频率 <Katex tex="\omega=2\pi/T" />。弹簧振子的周期为
      <Katex tex="T=2\pi\sqrt{m/k}" />，只由振子本身的劲度系数与质量决定，与振幅无关。
    </div>

    <h3 class="sec" id="v1-spring">弹簧振子与平衡位置</h3>
    <p>先看一个具体的装置。一根轻弹簧水平放置，左端固定在墙上，右端连一个质量为 <Katex tex="m" /> 的物块，物块搁在光滑水平面上。把物块从静止的位置向右拉开一段再松手，它就在原来的位置两侧来回运动：向右的位移越来越小、速度越来越快，经过原处时最快，再向右压缩弹簧、越来越慢，到某一位置停下，随后又反向重复。若没有摩擦，这样的往返会一直继续。</p>
    <p>把这个装置叫<strong>弹簧振子</strong>。它建立在几条理想化的条件上：弹簧的质量忽略不计，物块看作质点，水平面光滑（摩擦力为零），弹簧始终在弹性限度内。这几条加起来，物体受的力就只剩弹簧的弹力，问题变得可以算清。</p>
    <p>物块停住不动时所在的位置叫<strong>平衡位置</strong>。对水平弹簧振子，它就是弹簧处于<strong>原长</strong>时物块所在的那一点：此时弹力为零，合力为零。这里要分清两件事——平衡位置是<strong>合力为零</strong>的位置，不是速度为零的位置。物块到达最大位移处时速度确实为零，但那里弹力最大、合力不为零，物块随即被拉回来；反之，经过平衡位置时合力为零，速度却最大。</p>
    <p>物体在平衡位置附近所做的往复运动叫<strong>机械振动</strong>，简称振动。振动的描述与前面的运动学不同：不追究从哪里来、到哪里去，而是问它在原处附近怎样重复。为此把坐标原点取在平衡位置，沿运动方向建一条 <Katex tex="x" /> 轴，物体的位置就用<strong>相对平衡位置的位移</strong> <Katex tex="x" /> 表示，向右为正、向左为负。这样定义之后，位移的正负直接对应偏离的方向，后面的公式也都以它为基准。</p>
    <p>还有一个术语要交代。<strong>一次全振动</strong>指振子从某一状态出发，第一次回到完全相同的状态——位置相同、速度的大小和方向也相同。以弹簧振子为例，从最右端由静止出发，向左经平衡位置、到最左端、再向右回到最右端，这才是一次全振动；只走到最左端就返回，只算半个振动。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 振1a · <b>弹簧振子与平衡位置</b>：一根水平弹簧左端固定在墙上、右端连着物块 <Katex tex="m" />，物块在光滑水平面上沿平衡位置 O 两侧往复；橙色虚线标出两侧的振幅位置 <Katex tex="\pm A" />，轨道下方那条橙色带箭头的线段量出此刻相对 O 的位移 <Katex tex="x" />。看点一：物块经过 O 时弹簧处于原长，虚线标出的位移缩成一点，读数栏的 <Katex tex="x" /> 一行归零；到达 <Katex tex="\pm A" /> 时物块正贴着两侧的橙色虚线，那里位移最大。看点二：平衡位置是合力为零的位置，不是速度为零的位置——读数栏的速度一行在 O 处最大、在两端的 <Katex tex="\pm A" /> 处为零。看点三：把振幅滑块拖大，两侧橙色虚线一起向外张开，物块来回的路程变长，读数栏的周期 T 却不动；拖劲度系数 <Katex tex="k" /> 或质量 <Katex tex="m" />，来回的节奏随之变快或变慢。</p>

    <h3 class="sec" id="v1-force">回复力与简谐运动</h3>
    <p>物块为什么会自己回到原处？因为一旦偏离，弹簧就被拉伸或压缩，弹力总把物块往原长那一端推。这个使物体回到平衡位置的力叫<strong>回复力</strong>。对水平弹簧振子，回复力就是弹力。设物块相对平衡位置的位移为 <Katex tex="x" />，弹簧的形变量也正好是 <Katex tex="|x|" />，由胡克定律，弹力大小</p>
    <p style="text-align:center"><Katex tex="F=k\,|x|." display /></p>
    <p>方向的判断更关键：物块在原点右侧（<Katex tex="x>0" />）时弹簧被拉长，弹力向左；在原点左侧（<Katex tex="x<0" />）时弹簧被压缩，弹力向右。两种情形都是弹力与位移<strong>反向</strong>。把方向与大小合成一条式子，就是</p>
    <p style="text-align:center"><Katex tex="F=-kx." display /></p>
    <p>式中的负号不是计算上的习惯，它正是「总指向平衡位置」这句话的数学写法：<Katex tex="x" /> 为正时 <Katex tex="F" /> 为负，<Katex tex="x" /> 为负时 <Katex tex="F" /> 为正，物块偏离得越远，被拉回的力越大。再代入牛顿第二定律，得到加速度</p>
    <p style="text-align:center"><Katex tex="a=-\frac{k}{m}x." display /></p>
    <p>这说明加速度与位移也总是反向，大小与位移成正比。由此可以立刻推出几个结论：在平衡位置 <Katex tex="x=0" />，加速度为零而速度最大；在最大位移处，加速度最大而速度为零；物块从最大位移处向平衡位置运动时，加速度与速度同向，做加速运动；从平衡位置向外运动时两者反向，做减速运动。下面那块板左栏画在物块上方的两支箭头就是这两条：绿箭头是速度，橙箭头是回复力，橙箭头永远指向中点 O，绿箭头则随运动方向翻换。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 振1b · <b>回复力与 F–x 直线</b>：左栏还是上一块板那个弹簧振子，物块上方两支箭头分别标出此刻的速度 <Katex tex="v" />（绿）与回复力 <Katex tex="F" />（橙）；右栏是 <Katex tex="F" />–<Katex tex="x" /> 图，一条过原点、斜率为 <Katex tex="-k" /> 的直线，橙点标出此刻的 <Katex tex="(x,\,F)" />。看点一：物块在 O 右侧时 <Katex tex="x>0" />、<Katex tex="F<0" />，橙箭头朝左；在 O 左侧时反过来——箭头永远指向平衡位置。看点二：读数栏里「回复力 F」与「−kx」两行始终相等，橙点始终落在直线上，这正是 <Katex tex="F=-kx" /> 的逐帧核验。看点三：把劲度系数 <Katex tex="k" /> 拖大，右栏直线随之变陡，同样的位移对应的回复力更大，橙箭头也更长；拖振幅 <Katex tex="A" /> 只把橙点沿直线滑到更远的地方，直线的斜度不动。</p>
    <p>把这类运动单独命名。若物体所受的回复力与它偏离平衡位置的位移大小成正比、方向总指向平衡位置，即满足 <Katex tex="F=-kx" /> 的关系，这样的振动叫<strong>简谐运动</strong>。它是振动中最基本的一种，也是唯一能用初等函数写出位移时间关系的一种。判定一个振动是不是简谐运动，按三步走：先找出平衡位置；再以它为原点、沿运动方向建轴，写出位移；最后写出合力的表达式，看能不能整理成 <Katex tex="F=-kx" /> 的形式。<Katex tex="k" /> 不必是弹簧的劲度系数，任何与位移成正比的回复力都可以写成这个形式，<Katex tex="k" /> 只是那个比例系数。</p>
    <p>回复力是按<strong>作用效果</strong>命名的力，和向心力一样，它不是一种新的性质力。实际的受力分析里，它由某个具体的力（弹簧弹力、重力沿圆弧切线的分力、浮力与重力的合力等）充当，画受力图时画的是那个具体的力，不能再把「回复力」另画一支，否则同一个力被算了两遍。</p>

    <h3 class="sec" id="v1-desc">振幅、周期、频率与相位</h3>
    <p>由 <Katex tex="F=-kx" /> 与 <Katex tex="a=-(k/m)x" /> 可以证明，简谐运动的位移随时间按余弦规律变化：</p>
    <p style="text-align:center"><Katex tex="x=A\cos(\omega t+\varphi)." display /></p>
    <p>这条式子里有四个量，各有各的名字与意义。<Katex tex="A" /> 是<strong>振幅</strong>，即位移的最大值，它衡量振动的强弱，单位是米。<Katex tex="\omega" /> 是<strong>角频率</strong>，<Katex tex="\omega t+\varphi" /> 叫<strong>相位</strong>，<Katex tex="\varphi" /> 叫<strong>初相</strong>，即 <Katex tex="t=0" /> 时的相位。相位决定振子在某一时刻处在什么状态：位置由 <Katex tex="\cos(\omega t+\varphi)" /> 定，速度方向由 <Katex tex="-\sin(\omega t+\varphi)" /> 的正负定，所以相位一变，状态随之变。</p>
    <p>相位每增加 <Katex tex="2\pi" />，余弦值回到原样，振子回到同一状态，这中间经历的时间就是<strong>周期</strong> <Katex tex="T" />。由 <Katex tex="\omega T=2\pi" /> 得</p>
    <p style="text-align:center"><Katex tex="\omega=\frac{2\pi}{T}=2\pi f,\qquad f=\frac{1}{T}." display /></p>
    <p>频率 <Katex tex="f" /> 是单位时间内完成全振动的次数，单位是赫兹（Hz），<Katex tex="1\ \text{Hz}=1\ \text{s}^{-1}" />。周期与频率互为倒数，说哪一个都行。</p>
    <p>振幅与位移要分清。<strong>位移</strong>是某一时刻相对平衡位置的偏离，随时间变化，可正可负；<strong>振幅</strong>是位移的最大值，对一次确定的振动是定值，且只取正值。题目里说「位移为 4 cm」与「振幅为 4 cm」，含义完全不同。另外，半个周期里振子走过的路程正好是 <Katex tex="2A" />，一个周期里是 <Katex tex="4A" />，这与位移不同——一个周期后位移回到原值，路程却已经累积了 <Katex tex="4A" />。</p>
    <p>把这些量画到图上就一目了然。下面那块板的横轴是时间，纵轴是位移，画出的是一条余弦曲线。曲线最高点的纵坐标就是 <Katex tex="A" />；相邻两个同向峰（或相邻两个同向过零点）之间的水平距离就是 <Katex tex="T" />；<Katex tex="t=0" /> 处的纵坐标是 <Katex tex="A\cos\varphi" />，由它可以反读出初相。拖动初相滑块，整条曲线左右平移而形状不变，这正是「相位只决定从哪里开始」的含义。</p>

    <PhysicsDemo :def="DEMO3" />
    <p class="cap">图 振1c · <b>位移—时间曲线</b>：横轴是时间 <Katex tex="t" />（0 到 6 s），纵轴是位移 <Katex tex="x" />；淡色细线是整条 <Katex tex="x=A\cos(\omega t+\varphi)" />，蓝色是已经走过的一段，橙色虚线标出 <Katex tex="\pm A" />，蓝色动点标出当前时刻。看点一：曲线最高点的纵坐标就是振幅，读数栏的「振幅 A」一行与之对应；相邻两个同向峰之间的水平距离就是周期，读数栏把 <Katex tex="T" /> 与频率 <Katex tex="f" /> 一并写出。看点二：拖振幅滑块，曲线只上下变高，疏密一点不动——周期与振幅无关。看点三：拖劲度系数 <Katex tex="k" /> 或质量 <Katex tex="m" />，曲线的疏密随之改变：<Katex tex="k" /> 变成 4 倍周期减半，<Katex tex="m" /> 变成 4 倍周期加倍。看点四：拖初相 <Katex tex="\varphi_0" />，整条曲线左右平移、形状不变，<Katex tex="t=0" /> 处的高度由 <Katex tex="A" /> 变成 <Katex tex="A\cos\varphi_0" />。</p>

    <h3 class="sec" id="v1-circle">参考圆与周期公式</h3>
    <p>余弦曲线的来历，可以用一个几何图形说清。在平面上画一个半径为 <Katex tex="A" /> 的圆，圆心记作 <Katex tex="O" />；圆上一点 <Katex tex="P" /> 以角速度 <Katex tex="\omega" /> 匀速转动，<Katex tex="t=0" /> 时半径 <Katex tex="OP" /> 与 <Katex tex="x" /> 轴的夹角为 <Katex tex="\varphi" />。到时刻 <Katex tex="t" />，夹角变成 <Katex tex="\omega t+\varphi" />，由三角函数的定义，<Katex tex="P" /> 的横坐标</p>
    <p style="text-align:center"><Katex tex="x_P=A\cos(\omega t+\varphi)." display /></p>
    <p>这与简谐运动的位移式逐字相同。也就是说，<strong>匀速圆周运动在一条直径上的投影就是简谐运动</strong>：圆上的点转一圈，投影点在直径上来回一次。这个圆叫<strong>参考圆</strong>，下面那块板左半边画的就是它——紫色半径绕圆心匀速转动，橙色小点是它在水平直径上的投影，投影到圆心的距离就是此刻的位移 <Katex tex="x" />。</p>
    <p>参考圆不止能说明形状，还能把周期算出来。<Katex tex="P" /> 做匀速圆周运动，向心加速度大小为 <Katex tex="\omega^2 A" />，方向指向圆心。把这个加速度沿 <Katex tex="x" /> 轴分解，分量大小为 <Katex tex="\omega^2" /> 乘 <Katex tex="P" /> 到圆心的水平距离，而那个距离就是 <Katex tex="|x|" />，方向与 <Katex tex="x" /> 相反，于是</p>
    <p style="text-align:center"><Katex tex="a=-\omega^2 x." display /></p>
    <p>另一边，弹簧振子的加速度由牛顿第二定律给出，<Katex tex="a=-(k/m)x" />。同一个运动，两条式子必须给出同一个加速度，比较系数得</p>
    <p style="text-align:center"><Katex tex="\omega^2=\frac{k}{m},\qquad \omega=\sqrt{\frac{k}{m}},\qquad T=2\pi\sqrt{\frac{m}{k}}." display /></p>
    <p>这就是弹簧振子的周期公式。它值得多读两遍：周期里只有 <Katex tex="k" /> 与 <Katex tex="m" />，<strong>没有振幅，也没有初相</strong>。换句话说，同一个弹簧振子，拉开 2 cm 放开与拉开 5 cm 放开，来回的节奏完全一样，只是走过的距离不同。这条性质叫<strong>等时性</strong>，是伽利略从摆的观察中最早注意到的。从式子看它的道理也直观：振幅变大时，物块要走的距离变长，但途中受到的回复力也按比例变大、加速度随之变大，两者恰好抵消。</p>
    <p>两根滑块各自管一件事。<Katex tex="k" /> 变大，弹簧更「硬」，同样偏离一点就被拉得更用力，来回更快，周期变短；<Katex tex="m" /> 变大，惯性更大，同样的力只能换来更小的加速度，周期变长。<Katex tex="k" /> 变成 4 倍，周期减半；<Katex tex="m" /> 变成 4 倍，周期加倍。下面那块板里把这两根滑块拖动，右半边的曲线疏密随之改变，而上下高度由振幅单独决定——三条线索各管一个量，互不干扰。</p>
    <p>最后补一句能量。简谐运动中只有回复力做功，而回复力是保守力（弹力），机械能守恒。动能与势能此消彼长，总和为</p>
    <p style="text-align:center"><Katex tex="E=\tfrac12 kA^2." display /></p>
    <p>总能量只由振幅与劲度系数决定，与时刻无关；振幅不变，能量就不变。这也从另一个角度解释了等时性：同样的能量在更长的路程上分摊，每一段的平均速度就更小；两种效应正好相抵，周期保持不变。下一章把回复力换成重力沿圆弧切线的分力，同样的分析会给出单摆的周期。</p>

    <PhysicsDemo :def="DEMO4" />
    <p class="cap">图 振1d · <b>参考圆与周期</b>：左半边是一个圆，紫色半径以角速度 <Katex tex="\omega" /> 绕圆心匀速转动，橙色小点是半径端点在水平直径上的投影，投影到圆心的距离就是此刻的位移 <Katex tex="x" />——屏幕上的圆半径按当前的振幅 <Katex tex="A" /> 定标，振幅越大圆画得越大；右半边是同一时刻的 <Katex tex="x" />–<Katex tex="t" /> 曲线。看点一：半径转过的圆心角就是相位 <Katex tex="\omega t+\varphi" />，投影的横坐标 <Katex tex="A\cos(\omega t+\varphi)" /> 与右半边曲线上那一刻的高度逐点相等。看点二：半径转一圈，投影在直径上来回一次，右半边的曲线正好走完一个周期——圆的周期与振动的周期是同一个 <Katex tex="T" />。看点三：拖劲度系数 <Katex tex="k" /> 或质量 <Katex tex="m" />，半径转得快慢与曲线的疏密一起变，读数栏的周期一行跟着变；拖振幅则半径与曲线高度一起缩放，周期一行纹丝不动。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把平衡位置当成速度为零的位置。</strong>平衡位置的定义是<strong>合力为零</strong>，不是速度为零。弹簧振子经过平衡位置时速度最大，而在最大位移处速度为零、合力却最大。判断某个位置是不是平衡位置，看的是受力，不是运动状态。</li>
        <li><strong>提示二：把回复力当成一种新的力。</strong>回复力是按作用效果命名的，实际由弹簧弹力、重力沿切线的分力等充当。画受力图时画那些具体的力，不能再补一支「回复力」，否则同一个力被重复计入，合力算错。</li>
        <li><strong>提示三：振幅与位移混用。</strong>位移随时间变化，可正可负；振幅是位移的最大值，是定值且只取正值。一次全振动的路程是 <Katex tex="4A" />，一个周期后的位移却是零。题目问「经过平衡位置时的位移」应回答零，问「振幅」才答最大值。</li>
        <li><strong>提示四：认为振幅越大周期越长。</strong>弹簧振子的周期只由 <Katex tex="k" /> 与 <Katex tex="m" /> 决定，与振幅、初相都无关。把振幅拖大，物块走的路程变长，但回复力也按比例变大、速度在途中升得更快，两者相抵，周期纹丝不动。上面 x–t 曲线那块板里拖动振幅时曲线的疏密不变，正是这一条。</li>
      </ul>
    </div>
    <p>回收与预告：力27 处理的是「作用时间极短」的碰撞，用动量守恒把首末两态连起来；这一章换了一个问法，研究的是一个随时间不断重复的过程，于是出场的不再是守恒量与首末之差，而是位移随时间的函数、周期与相位。此前学过的受力分析、牛顿第二定律在这里照旧使用，只是合力现在与位移成正比。下一章振2 把弹簧换成一根细线挂的小球：单摆的回复力不再是弹力，而是重力沿圆弧切线的分力，但它在摆角很小时同样近似与位移成正比，于是还是简谐运动，周期为 <Katex tex="T=2\pi\sqrt{l/g}" />——与振幅无关、与摆球质量无关，这一条正是摆钟能计时的依据。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('vib1Spring');
const DEMO2 = demoOf('vib1Force');
const DEMO3 = demoOf('vib1Xt');
const DEMO4 = demoOf('vib1Circ');
</script>
