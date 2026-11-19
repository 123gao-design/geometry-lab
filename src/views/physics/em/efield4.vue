<template>
  <PhysicsCh id="efield4"
    sub="上一章用场强、电势、电势差三件工具描述静电场的空间。这一章把它们落到两类具体问题上：一是导体放进电场后的静电平衡，由此引出电容器和它的电容；二是带电粒子在电场中的加速与偏转，后者是类平抛，把力学里的平抛规律整段搬过来。"
    :toc="[
      { id: 'e4-conduct', t: '静电平衡' },
      { id: 'e4-cap', t: '电容' },
      { id: 'e4-plate', t: '平行板电容器' },
      { id: 'e4-accel', t: '带电粒子的加速' },
      { id: 'e4-deflect', t: '带电粒子的偏转' },
      { id: 'e4-apply', t: '算一遍' },
    ]">
    <div class="note good">
      导体放进电场，自由电荷重新分布，直到内部合场强为零，这叫<strong>静电平衡</strong>：导体内部场强为零，整个导体是等势体，表面场强与表面垂直。两块彼此绝缘的导体构成<strong>电容器</strong>，所带电荷量与两板电压的比值叫<strong>电容</strong>，
      <Katex tex="C=\frac{Q}{U}," />
      平行板电容器的电容由形状与介质决定：
      <Katex tex="C=\frac{\varepsilon_r\varepsilon_0 S}{d}," />
      与正对面积成正比、与板间距成反比。带电粒子在电场中由静止加速，
      <Katex tex="qU=\frac{1}{2}mv^2\ \Longrightarrow\ v=\sqrt{\frac{2qU}{m}};" />
      垂直场线射入平行板时做类平抛，
      <Katex tex="a=\frac{qU}{md},\quad t=\frac{L}{v_0},\quad y=\frac{1}{2}at^2=\frac{qUL^2}{2mdv_0^2}," />
      出射偏转角满足 <Katex tex="\tan\theta=\frac{qUL}{mdv_0^2}" />。
    </div>

    <h3 class="sec" id="e4-conduct">静电平衡</h3>
    <p>把一块金属放进外电场，金属里的自由电子在电场力作用下定向移动，在导体两端堆出电荷，这些电荷又产生一个反向的附加电场。电荷一直移动，直到附加电场与外电场在导体内部互相抵消、合场强处处为零，定向移动才停下来。这个状态叫<strong>静电平衡</strong>。</p>
    <p>由「内部合场强为零」可以直接推出三条常用结论。其一，导体内部场强处处为零——若某处不为零，那里的自由电荷就还会受力移动，与平衡矛盾。其二，整个导体是一个<strong>等势体</strong>，表面是一个等势面——内部场强为零，任意两点之间的电势差 <Katex tex="Ed=0" />。其三，导体表面处的场强方向与表面<strong>垂直</strong>——若不垂直，沿表面就有分量，表面上的电荷仍会移动。</p>
    <p>把这三条合起来还能得到电荷的分布：净电荷只分布在导体的外表面，导体内部没有净电荷；表面上曲率越大的地方电荷越密、场强越强。避雷针做成尖的、高压设备外面套一层金属网做静电屏蔽，用的都是这一条。</p>
    <p>静电平衡是瞬时的：外电场一变，电荷会在极短的时间内重新分布，重新达到平衡。下面讲的电容器，两块极板各自就处在静电平衡状态里。</p>

    <h3 class="sec" id="e4-cap">电容</h3>
    <p>两块彼此靠近又互相绝缘的导体就构成一个<strong>电容器</strong>。把两块板分别接到电源两极，板上带上等量异种电荷，板间出现电场，这个过程叫<strong>充电</strong>；用导线把两板接通，电荷中和，叫<strong>放电</strong>。充电完成后，一块板带 <Katex tex="+Q" />、另一块带 <Katex tex="-Q" />，这里的 <Katex tex="Q" /> 指一块板所带电荷量的绝对值。</p>
    <p>实验发现，对同一个电容器，所带电荷量 <Katex tex="Q" /> 与两板间电压 <Katex tex="U" /> 的比值是一个定值，与充多少电荷无关。这个比值定义为<strong>电容</strong>：</p>
    <p style="text-align:center"><Katex tex="C=\frac{Q}{U}." display /></p>
    <p>电容的单位是法拉，符号 F，<Katex tex="1\ \text{F}=1\ \text{C/V}" />。法拉这个单位太大，常用微法（<Katex tex="\mu\text{F}" />）与皮法（pF），<Katex tex="1\ \mu\text{F}=10^{-6}\ \text{F}" />，<Katex tex="1\ \text{pF}=10^{-12}\ \text{F}" />。</p>
    <p>要注意 <Katex tex="C=Q/U" /> 是<strong>比值定义</strong>：电容由电容器本身的结构决定，与它带多少电荷、加多大电压都无关。这与电阻 <Katex tex="R=U/I" /> 由导体本身决定是同一类关系。加在电容器上的电压不能无限增大，超过某一数值，板间介质会被击穿，这个电压叫击穿电压。</p>

    <h3 class="sec" id="e4-plate">平行板电容器</h3>
    <p>两块正对的平行金属板是最简单的电容器。设正对面积为 <Katex tex="S" />、板间距为 <Katex tex="d" />，板间介质的相对介电常数为 <Katex tex="\varepsilon_r" />，理论推导给出</p>
    <p style="text-align:center"><Katex tex="C=\frac{\varepsilon_r\varepsilon_0 S}{d},\qquad \varepsilon_0=8.85\times10^{-12}\ \text{F/m}." display /></p>
    <p>它与正对面积成正比、与板间距成反比，插入介电常数更大的介质电容会变大。空气的 <Katex tex="\varepsilon_r" /> 约等于 1，所以空气电容器就是这个式子在 <Katex tex="\varepsilon_r=1" /> 时的样子。</p>
    <p>结合 <Katex tex="C=Q/U" /> 与 <Katex tex="E=U/d" />，还可以把板间场强写成</p>
    <p style="text-align:center"><Katex tex="E=\frac{U}{d}=\frac{Q}{Cd}=\frac{4\pi kQ}{\varepsilon_r S}." display /></p>
    <p>这条式子把场强与电压、电荷量两头都连上了，下面两类动态问题都要用它。</p>
    <p><strong>第一类：电容器始终与电源相连。</strong>这时两板电压 <Katex tex="U" /> 由电源决定，保持不变。把板间距 <Katex tex="d" /> 拉大，电容 <Katex tex="C" /> 减小，电荷量 <Katex tex="Q=CU" /> 随之减小，板间场强 <Katex tex="E=U/d" /> 也减小；减小正对面积 <Katex tex="S" /> 的效果相同；插入介质则 <Katex tex="C" /> 增大、<Katex tex="Q" /> 增大，而 <Katex tex="E" /> 不变。</p>
    <p><strong>第二类：充电后断开电源。</strong>这时板上电荷无处可去，<Katex tex="Q" /> 保持不变。把 <Katex tex="d" /> 拉大，电容 <Katex tex="C" /> 减小，电压 <Katex tex="U=Q/C" /> 随之增大；但场强 <Katex tex="E=4\pi kQ/(\varepsilon_r S)" /> 里没有 <Katex tex="d" />，所以<strong>场强保持不变</strong>。这一条最容易被想当然地判错：电压确实变大了，可板间距也同比例变大了，两者相抵。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电4a · <b>平行板电容器的电容</b>：充电过程在左栏，板上的正负号与板间场线随电量一颗颗亮起，顶上一条进度条读 q/Q，充满后停一拍再放电归零。看点一：读数栏的「当前电荷 q(t)」按 <Katex tex="q=CU(1-e^{-t/\tau})" /> 上升、末了渐缓，「q/Q」同步增长，于是 C = Q/U 那个比值在充电过程中一直没变。看点二：把板间距 d 拉大，电容按反比降下去、充满后的电荷量 Q 跟着减少，而读数栏的 C·d 一行不动——这就是 <Katex tex="C=\varepsilon_r\varepsilon_0 S/d" /> 的直接核对。看点三：拖「正对面积 S」与「相对介电常数 εr」，右栏曲线整体抬高或压低、形状不变，两者都只是 C 的正比例因子。看点四：把 d 拉到最大、S 拉到最小，C 降到几十皮法，充电变快、板间场线变稀——同样的电压下，存进去的电荷少了。</p>

    <h3 class="sec" id="e4-accel">带电粒子的加速</h3>
    <p>一个电荷量为 <Katex tex="q" />、质量为 <Katex tex="m" /> 的粒子，从静止开始只受电场力作用，经过电势差为 <Katex tex="U" /> 的两点。电场力做的功是 <Katex tex="qU" />，由动能定理</p>
    <p style="text-align:center"><Katex tex="qU=\frac{1}{2}mv^2-0,\qquad v=\sqrt{\frac{2qU}{m}}." display /></p>
    <p>末速度只由加速电压与粒子的比荷 <Katex tex="q/m" /> 决定，与粒子走过的路径、电场的具体形状都无关。示波管、直线加速器的第一级都按这条式子设计。若粒子初速度不为零，把 <Katex tex="\frac{1}{2}mv_0^2" /> 移到右边即可，形式完全一样。</p>

    <h3 class="sec" id="e4-deflect">带电粒子的偏转</h3>
    <p>电子以速度 <Katex tex="v_0" /> 垂直电场线射入两块平行板之间。板长 <Katex tex="L" />、板间距 <Katex tex="d" />、两板电压 <Katex tex="U" />，板间场强 <Katex tex="E=U/d" />。</p>
    <p>沿场线方向，初速度为零、加速度恒定的匀加速运动；垂直场线方向，不受力，做匀速直线运动。两个方向互不影响，与平抛运动完全同构，所以叫<strong>类平抛</strong>。加速度与板内飞行时间分别是</p>
    <p style="text-align:center"><Katex tex="a=\frac{qE}{m}=\frac{qU}{md},\qquad t=\frac{L}{v_0}." display /></p>
    <p>离开电场时的偏转量与偏转角为</p>
    <p style="text-align:center"><Katex tex="y=\frac{1}{2}at^2=\frac{qUL^2}{2mdv_0^2},\qquad \tan\theta=\frac{v_y}{v_0}=\frac{at}{v_0}=\frac{qUL}{mdv_0^2}." display /></p>
    <p>出射以后电场消失，粒子沿出射方向做匀速直线运动，把出射点的切线方向延长，就得到打在荧光屏上的位置。偏转量正比于偏转电压 <Katex tex="U" />、正比于板长的平方 <Katex tex="L^2" />，反比于入射速度的平方 <Katex tex="v_0^2" /> 与板间距 <Katex tex="d" />——示波管靠调偏转电压把光点移到屏幕上的指定位置，就是用了这个正比关系。</p>
    <p>还有一步不能省：先判断粒子能不能穿出去。若 <Katex tex="y>d/2" />，粒子在板间就撞到极板上，上面的出射公式不再适用，要从撞击点反推它落在哪里。演示里把偏转电压调到 400 V、板长调到 8 cm、入射速度调到最小，就能看到电子提前打在板上。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电4b · <b>带电粒子在平行板间的偏转</b>：电子从左侧以 v0 水平射入，青色轨迹是一段类平抛，出射后转成虚线沿切线走——把那条切线延长，就得到打在荧光屏上的位置。看点一：沿场线方向由静止匀加速、垂直场线方向匀速，两条运动合成这条抛物线，与平抛完全同构。看点二：把偏转电压或板长拖大，轨迹明显向上弯得更多；拖大入射速度，轨迹变平——偏转量正比于 <Katex tex="U" /> 与 <Katex tex="L^2" />、反比于 <Katex tex="v_0^2" />。看点三：读数栏按 a、t、y 分行列出，最后一行 <Katex tex="y\,d\,v_0^2/(UL^2)" /> 拖任何滑块都停在 <Katex tex="q/(2m)=8.8\times10^{10}\ \text{C/kg}" /> 上，它就是电子比荷的一半，可见 y 与 ½at² 是同一个数。看点四：把偏转电压调到 400 V、板长调到 8 cm、入射速度调到最小，电子在板间就撞上极板，轨迹截断、粒子停在那里并标注「电子打到板上」——出射公式不再适用。</p>

    <h3 class="sec" id="e4-apply">算一遍</h3>
    <p>先算电容。正对面积 <Katex tex="S=2.0\times10^{-2}\ \text{m}^2" />（即 200 cm²），板间距 <Katex tex="d=5.0\times10^{-3}\ \text{m}" />，介质 <Katex tex="\varepsilon_r=2.0" />：</p>
    <p style="text-align:center"><Katex tex="C=\frac{2.0\times8.85\times10^{-12}\times2.0\times10^{-2}}{5.0\times10^{-3}}=7.1\times10^{-11}\ \text{F}\approx71\ \text{pF}." display /></p>
    <p>接上 200 V 的电压，电荷量与场强分别是</p>
    <p style="text-align:center"><Katex tex="Q=CU=7.1\times10^{-11}\times200=1.4\times10^{-8}\ \text{C},\qquad E=\frac{U}{d}=4.0\times10^{4}\ \text{V/m}." display /></p>
    <p>再算加速。电子经过 500 V 的加速电压，由 <Katex tex="v=\sqrt{2qU/m}" /> 得</p>
    <p style="text-align:center"><Katex tex="v=\sqrt{\frac{2\times1.6\times10^{-19}\times500}{9.1\times10^{-31}}}=1.3\times10^{7}\ \text{m/s}." display /></p>
    <p>最后算偏转。偏转电压 200 V、板长 5.0 cm、板间距 2.0 cm、入射速度 3.0×10⁷ m/s：</p>
    <p style="text-align:center"><Katex tex="a=\frac{1.6\times10^{-19}\times200}{9.1\times10^{-31}\times2.0\times10^{-2}}=1.8\times10^{15}\ \text{m/s}^2," display /></p>
    <p style="text-align:center"><Katex tex="t=\frac{0.050}{3.0\times10^{7}}=1.7\times10^{-9}\ \text{s},\qquad y=\frac{1}{2}\times1.8\times10^{15}\times(1.7\times10^{-9})^2\approx2.4\ \text{mm}." display /></p>
    <p>偏转量 2.4 mm 小于板间距的一半 10 mm，电子能顺利穿出；出射偏转角约 0.098 rad。演示的读数栏把加速度、板内时间、偏转量、偏转角分行列出，拖任何一根滑块，最后一行 <Katex tex="y\,d\,v_0^2/(UL^2)" /> 都停在 <Katex tex="q/(2m)=8.8\times10^{10}\ \text{C/kg}" /> 上，它正是电子的比荷的一半。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把电容当成电荷量，或认为它与电压成正比。</strong><Katex tex="C=Q/U" /> 是比值定义，电容由正对面积、板间距与介质决定，与充了多少电荷、加多大电压都无关。电压加倍，电荷量同比例加倍，比值不变。</li>
        <li><strong>提示二：两类动态分析的前提搞混。</strong>始终接电源时电压 <Katex tex="U" /> 不变；充电后断开电源时电荷量 <Katex tex="Q" /> 不变。两者的结论常常相反，答题第一步先写真假不变的究竟是哪一个量。</li>
        <li><strong>提示三：以为断开电源后拉开板间距场强变小。</strong>断开电源 <Katex tex="Q" /> 不变，<Katex tex="E=4\pi kQ/(\varepsilon_r S)" /> 里没有 <Katex tex="d" />，场强保持不变；电压 <Katex tex="U=Q/C" /> 确实增大了，它与 <Katex tex="d" /> 同比例增大，两者相抵。</li>
        <li><strong>提示四：不判断是否打在板上就套用出射公式。</strong>先算 <Katex tex="y" /> 并与 <Katex tex="d/2" /> 比较。超过一半，粒子在板间就撞板，出射时的偏转量与偏转角都无从谈起，要从撞击点重新算。</li>
      </ul>
    </div>
    <p>回收与预告：这一章把静电场用到了两处。静电平衡给出导体的三条结论，电容器由此定义出电容，平行板电容器把电容、电压、电荷量、场强四个量连成一组公式；带电粒子在电场中的加速与偏转则把动能定理与类平抛搬进了电场。下一部分转入恒定电流：电荷在导体里定向移动形成电流，电流、电压、电阻之间由欧姆定律联系，串联与并联各有各的规律。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('capacitor');
const DEMO2 = demoOf('capacitorD');
</script>
