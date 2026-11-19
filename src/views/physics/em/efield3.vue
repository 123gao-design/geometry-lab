<template>
  <PhysicsCh id="efield3"
    sub="上一章用电场强度描述电场的「力」的一面：单位电荷受多大的力。这一章换一个角度，用电场力做功与路径无关这一点，引入电势能，再由电势能定义电势。场强与电势从力与能量两个侧面描述同一块空间，二者由「沿场线走一段距离，电势降落多少」联系起来。"
    :toc="[
      { id: 'e3-work', t: '电场力做功' },
      { id: 'e3-ep', t: '电势能' },
      { id: 'e3-v', t: '电势' },
      { id: 'e3-surface', t: '等势面' },
      { id: 'e3-u', t: '电势差与 U = Ed' },
      { id: 'e3-apply', t: '算一遍' },
    ]">
    <div class="note good">
      电场力做功与路径无关，只由起点与终点的位置决定。因此可以像重力那样引入<strong>电势能</strong> <Katex tex="E_p" />：电场力做的功等于电势能的减少量，
      <Katex tex="W_{AB}=E_{pA}-E_{pB}." />
      把电势能除以电荷量，得到只与场本身有关的量，叫<strong>电势</strong>：
      <Katex tex="V=\frac{E_p}{q}," />
      点电荷的电势为 <Katex tex="V=kQ/r" />。两点之间电势的差叫<strong>电势差</strong>，
      <Katex tex="U_{AB}=V_A-V_B=\frac{W_{AB}}{q}," />
      匀强电场中沿场线走一段距离 <Katex tex="d" />，电势差为 <Katex tex="U=Ed" />。
    </div>

    <h3 class="sec" id="e3-work">电场力做功</h3>
    <p>把电荷放进电场，电场力就会对它做功。在匀强电场里，电荷沿场线方向移动距离 <Katex tex="d" />，电场力 <Katex tex="F=qE" /> 与位移同向，做功 <Katex tex="W=qEd" />。若移动方向与场线成 <Katex tex="\theta" /> 角，只有沿场线的那一段有贡献，做功仍是 <Katex tex="qE\,d\cos\theta" />，其中 <Katex tex="d\cos\theta" /> 是沿场线的位移。</p>
    <p>关键在于：<strong>电场力做功与路径无关</strong>。从 A 到 B，不管沿直线走、沿折线走还是沿曲线走，只要起点与终点不变，做功就一样。点电荷的电场不是匀强的，这个结论照样成立，可以从库仑力是平方反比的中心力出发证明。这与重力做功只跟高度差有关，是同一类性质。这类力叫保守力，只有保守力才能定义相应的势能。</p>
    <p>由此可以像处理重力势能那样处理电势能：把某一条路径上的功算清楚，就得到了所有路径上的功；而势能的变化只与两端有关，不必关心中间过程。</p>

    <h3 class="sec" id="e3-ep">电势能</h3>
    <p>电荷在电场中具有的势能叫<strong>电势能</strong>，记作 <Katex tex="E_p" />。电场力做正功，电势能减少；电场力做负功（克服电场力做功），电势能增加。写成式子：</p>
    <p style="text-align:center"><Katex tex="W_{AB}=E_{pA}-E_{pB}." display /></p>
    <p>电势能是<strong>标量</strong>，有正负，但它的绝对值没有意义，必须先指定一个零势能位置。通常取无穷远处或大地为零，也可以按方便取某一点（比如带电板的负极板）为零。只有同一次计算中取同一个零点，比较才有意义。</p>
    <p>正电荷顺着场强方向移动，电场力做正功，电势能减少；逆着场强方向移动，电场力做负功，电势能增加。负电荷的情形正好反过来：顺着场强方向移动时电场力做负功，电势能增加。</p>
    <p>把电势能与重力势能对照，可以少犯不少错：两者的变化都只由起点与终点决定；都是外界做功与势能变化反号；都要先指定零点。区别在于电荷有正负，同一个点上，正电荷与负电荷的电势能符号相反。</p>

    <h3 class="sec" id="e3-v">电势</h3>
    <p>同一个点上，放不同的电荷，电势能不同，但电势能与电荷量的比值是确定的，与试探电荷无关。这个比值叫该点的<strong>电势</strong>：</p>
    <p style="text-align:center"><Katex tex="V=\frac{E_p}{q}." display /></p>
    <p>电势是<strong>标量</strong>，单位是伏特，符号 V，<Katex tex="1\ \text{V}=1\ \text{J/C}" />。与电势能一样，电势也有零点：通常取无穷远处为零，或取大地为零。点电荷在距离 <Katex tex="r" /> 处的电势为</p>
    <p style="text-align:center"><Katex tex="V=k\frac{Q}{r}." display /></p>
    <p>这个式子不带绝对值：正电荷周围的电势为正，越远越低，趋于零；负电荷周围的电势为负，越远越高，趋于零。电势沿场强方向<strong>降低</strong>，这句话对正负电荷都成立，是判断电势高低最常用的一条。</p>
    <p>场强描述的是「单位电荷受多大的力」，电势描述的是「单位电荷有多少电势能」；前者是矢量，后者是标量。场强为零的地方电势不一定为零，电势为零的地方场强也不一定为零——两者是不同层面的描述，不能互相替代。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电3a · <b>点电荷的电势与电势能</b>：青色虚线圆是一族等势面，同心排开、越靠近电荷越密；紫色空心圈是试探电荷松手时的位置 P，所在的那条圆就是它的等势面。看点一：松手后试探电荷沿连线运动——同号被推开、异号被吸过去，电势能转成动能，绿箭头由短变长。看点二：读数栏的 Ep 一路减少、Ek 一路增加，而「Ep + Ek」一行滑到哪儿都不变，这就是只有电场力做功时的能量守恒。看点三：拖「试探电荷 q₀」过零，电势 V 不动、电势能 Ep 变号，运动方向随之反过来；拖到 0 时电荷停在原处，不参与运动。看点四：拖「距离 r」，P 落在另一条等势面上，V 按 1/r 减小而 V·r 一行不动；把场源电荷拖成负值，V 与 Ep 一起变号，等势面的疏密分布倒过来。</p>

    <h3 class="sec" id="e3-surface">等势面</h3>
    <p>电场中电势相同的点连成的面叫<strong>等势面</strong>。等势面有三条常用性质：其一，等势面上任意两点之间的电势差为零，电荷沿等势面移动时电场力不做功；其二，电场线与等势面<strong>处处垂直</strong>，否则场强沿等势面就有分量，沿等势面移动就会有做功；其三，等势面密的地方场强强，疏的地方场强弱——这与电场线的疏密是一回事。</p>
    <p>孤立点电荷的等势面是以电荷为中心的同心球面，在平面图上画出来就是一族同心圆。匀强电场的等势面是一族与场线垂直的平行平面。画等势面时只画其中几个有代表意义的，并标出电势值。</p>
    <p>实际应用中，等势面比电场线更容易画：用导体做一个面，静电平衡时导体表面就是等势面。所以常见电场的等势面图，很多是用导体探测出来的。</p>

    <h3 class="sec" id="e3-u">电势差与 U = Ed</h3>
    <p>电场中两点电势的差值叫<strong>电势差</strong>，也叫电压：</p>
    <p style="text-align:center"><Katex tex="U_{AB}=V_A-V_B." display /></p>
    <p>把电荷 <Katex tex="q" /> 从 A 移到 B，电场力做的功等于 <Katex tex="qU_{AB}" />；反过来，已知功与电荷量就能求电势差，<Katex tex="U_{AB}=W_{AB}/q" />。注意方向：<Katex tex="U_{AB}=V_A-V_B" />，从高电势到低电势时为正。</p>
    <p>在匀强电场中，沿场线方向相距 <Katex tex="d" /> 的两点之间的电势差为</p>
    <p style="text-align:center"><Katex tex="U=Ed." display /></p>
    <p>这条式子是场强与电势之间的桥梁。把它改写成 <Katex tex="E=U/d" />，就得到场强的另一种单位：<Katex tex="1\ \text{V/m}=1\ \text{N/C}" />。可见场强既可以理解为「单位电荷受的力」，也可以理解为「沿场强方向单位长度上电势降落的多少」，两种说法等价。</p>
    <p>使用 <Katex tex="U=Ed" /> 时要注意，<Katex tex="d" /> 必须是沿<strong>场强方向</strong>的距离；若两点连线与场线成 <Katex tex="\theta" /> 角，就要取 <Katex tex="d\cos\theta" /> 这个投影。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电3b · <b>匀强电场中的电势差与做功</b>：两块平行极板之间是一族等间距的场线，从上板到下板电势一路均匀降落，所以每隔同样的距离电势降落的量也相同——这正是「匀强」。看点一：电荷从 A（q₀ &gt; 0）或 B（q₀ &lt; 0）由静止出发、沿场线匀加速，走出距离 s 时 U(s) = Es、W = q₀U(s)，右栏绿点沿过原点的直线滑过去。看点二：读数栏的 U/d 一行恒等于场强 E——同一条式子换个读法，就是场强的第二个单位 V/m。看点三：把 q₀ 拖成负值，电荷改从另一头出发、功的符号翻转，走过的距离与电势差之间的关系不变。看点四：拖「场强 E」与「沿场线距离 d」，U = Ed 两项一起变；把 d 拖成零，U 也归零，两点落在同一等势面上。</p>

    <h3 class="sec" id="e3-apply">算一遍</h3>
    <p>先算点电荷的电势。场源电荷 <Katex tex="Q=3.0\ \mu\text{C}" />，求距离 0.20 m 处的电势：</p>
    <p style="text-align:center"><Katex tex="V=9.0\times10^{9}\times\frac{3.0\times10^{-6}}{0.20}=1.35\times10^{5}\ \text{V}." display /></p>
    <p>在同一点放一个 <Katex tex="q_0=2.0\times10^{-6}\ \text{C}" /> 的试探电荷，它的电势能是</p>
    <p style="text-align:center"><Katex tex="E_p=q_0V=2.0\times10^{-6}\times1.35\times10^{5}=0.27\ \text{J}." display /></p>
    <p>把 <Katex tex="q_0" /> 换成等量的负电荷，电势仍是 1.35×10⁵ V，电势能变成 −0.27 J；可见电势由场决定、电势能还取决于放进去的电荷。读数栏的「V·r」一项拖距离时不变，等于 <Katex tex="kQ" />。</p>
    <p>再算匀强电场。场强 <Katex tex="E=2.0\times10^{3}\ \text{V/m}" />，从 A 沿场线走到 B，距离 <Katex tex="d=0.10\ \text{m}" />，电势差是</p>
    <p style="text-align:center"><Katex tex="U=Ed=2.0\times10^{3}\times0.10=200\ \text{V}." display /></p>
    <p>同一个 <Katex tex="q_0=2.0\ \mu\text{C}" /> 从 A 移到 B，电场力做功</p>
    <p style="text-align:center"><Katex tex="W=q_0U=2.0\times10^{-6}\times200=4.0\times10^{-4}\ \text{J}." display /></p>
    <p>把 <Katex tex="q_0" /> 拖成负值，功的符号随之改变：负电荷顺着场线移动，电场力做负功，电势能增加。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不指定零点就谈电势与电势能。</strong>两者都是相对的，必须先取一个零位置（无穷远、大地或某块极板）。同一题里所有点取同一个零点，比较才有意义；换零点时所有电势同时平移同一个量，电势差不变。</li>
        <li><strong>提示二：把电势的正负与电荷的正负混为一谈。</strong>电势由场源电荷决定，与放进去的电荷无关；电势能 <Katex tex="E_p=qV" /> 还取决于试探电荷的正负。正电荷在高电势处电势能大，负电荷在高电势处电势能反而小。</li>
        <li><strong>提示三：以为场强为零处电势也为零。</strong>等量同种电荷连线的中点场强为零，但电势不为零（两个正电荷时为正）；两块等量异种电荷板的中垂面上电势为零，场强却不为零。两者是不同层面的描述。</li>
        <li><strong>提示四：用 U = Ed 时把斜向距离直接代进去。</strong><Katex tex="U=Ed" /> 里的 d 必须沿场强方向。两点连线与场线成角时，要取 <Katex tex="d\cos\theta" />；电场线是曲线时这条式子只对一小段近似成立。</li>
      </ul>
    </div>
    <p>回收与预告：这一章用「做功与路径无关」引出了电势能，再由电势能定义电势，最后把场强与电势用电势差串起来：沿场线走一段，电势降落 <Katex tex="Ed" />。下一章处理导体与电容器：导体放在电场里会发生什么，两块平行的导体板加上电压能存多少电荷，带电粒子穿过平行板时又如何偏转。这三件事分别对应静电平衡、电容与带电粒子的偏转。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('potential');
const DEMO2 = demoOf('potentialU');
</script>
