<template>
  <PhysicsCh id="mag3"
    sub="安培力是磁场对整段通电导线的作用，把它分摊到每个载流子身上，就是洛伦兹力。这一章先写出单个电荷受力的大小与方向，再由「力始终垂直于速度」推出圆周运动，得到半径与周期的两个式子。"
    :toc="[
      { id: 'm3-size', t: '洛伦兹力的大小与方向' },
      { id: 'm3-circle', t: '为什么是圆周运动' },
      { id: 'm3-radius', t: '半径、周期与频率' },
      { id: 'm3-calc', t: '算一遍' },
    ]">
    <div class="note good">
      运动电荷在磁场中受到的力叫<strong>洛伦兹力</strong>，大小 <Katex tex="F=qvB\sin\theta" />，<Katex tex="\theta" /> 是速度与磁场的夹角；速度与磁场垂直时 <Katex tex="F=qvB" />。方向用左手定则判断，正电荷的四指指向速度方向，负电荷则相反。洛伦兹力始终垂直于速度，只改变运动方向、不做功；在匀强磁场中垂直射入的电荷做匀速圆周运动，半径与周期分别是
      <Katex tex="r=\frac{mv}{qB},\qquad T=\frac{2\pi m}{qB}." />
    </div>

    <h3 class="sec" id="m3-size">洛伦兹力的大小与方向</h3>
    <p>上一章讲了安培力：通电导线在磁场中受力 <Katex tex="F=BIL\sin\theta" />。导线里的电流由大量定向移动的电荷形成，安培力也就是这些电荷各自受力的总和。把一段长 <Katex tex="L" />、电流 <Katex tex="I" /> 的导线看成载有 <Katex tex="N" /> 个电荷、每个电荷以速度 <Katex tex="v" /> 运动，则电流 <Katex tex="I=nqvS" />、导线中的电荷总数 <Katex tex="N=nSL" />，逐个分摊得到</p>
    <p style="text-align:center"><Katex tex="F_{\text{洛}}=\frac{BIL}{N}=\frac{B\,(nqvS)\,L}{nSL}=qvB." display /></p>
    <p>推导时用了 <Katex tex="\theta=90^\circ" /> 的情形，一般式再把夹角补上：</p>
    <p style="text-align:center"><Katex tex="F=qvB\sin\theta." display /></p>
    <p>由此可以分出三档：速度与磁场垂直时力最大 <Katex tex="qvB" />；成夹角时按 <Katex tex="\sin\theta" /> 折减；速度与磁场平行时 <Katex tex="\theta=0^\circ" /> 或 <Katex tex="180^\circ" />，<Katex tex="F=0" />，电荷不受力，沿直线匀速前进。</p>
    <p>方向仍用<strong>左手定则</strong>：伸开左手，让磁感线穿入掌心，四指指向<strong>正电荷运动的方向</strong>，拇指所指就是洛伦兹力方向。若讨论的是电子这样的负电荷，四指要指向速度的<strong>反方向</strong>，或者先用四指指速度、再把结论反过来。这一点与安培力的定则完全一致——安培力的四指指的就是电流方向，而电流方向对负电荷来说正是它运动的反方向。</p>

    <h3 class="sec" id="m3-circle">为什么是圆周运动</h3>
    <p>由左手定则可以看出一条关键性质：洛伦兹力<strong>始终垂直于速度</strong>。速度在纸面内，力就在垂直于纸面的方向上；速度转了方向，力也跟着转，永远与速度成直角。</p>
    <p>垂直于速度的力不做功，这一点在力学里已经用过：功率 <Katex tex="P=Fv\cos90^\circ=0" />。所以洛伦兹力只改变速度的方向，不改变速率，电荷的动能保持不变。</p>
    <p>速率不变、力始终指向一侧且大小不变，这正是<strong>匀速圆周运动</strong>的条件。力指向圆心，充当向心力。于是可以把向心力公式与洛伦兹力公式并排写出来：</p>
    <p style="text-align:center"><Katex tex="qvB=\frac{mv^2}{r}." display /></p>
    <p>两边同除以 <Katex tex="v" /> 再解出 <Katex tex="r" />，就得到半径的式子。下面这块板画的就是这一条：绿箭头是速度，紫箭头是洛伦兹力，两者始终垂直；质子沿逆时针方向转，紫箭头一直指向圆心。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电10a · <b>洛伦兹力与圆周运动</b>：叉号铺满左栏表示磁场垂直纸面向里，橙色圆点是质子，虚线圆是它的轨道，绿箭头是速度、紫箭头是洛伦兹力。看点一：粒子转到哪个位置，紫箭头都与绿箭头成直角、始终指向圆心，力只改变速度的方向。看点二：整圈转下来绿箭头的长度不变，读数栏的速率一行也不动——垂直速度的力不做功，动能守恒，电荷才能一直按同一个圆走下去。看点三：把 B 拖大，轨道按反比收缩，右栏橙点沿曲线向右下方滑；把 v 调大，左栏的圆随之放大（放到画框边上为止），读数栏的 r 一行按正比翻倍，右栏纵轴的上限也跟着换一档。看点四：虚线圆按 r 成比例画出，粒子始终贴着它走，不会越转越偏。屏幕上的圆只作定性示意，真值一律看读数栏。</p>

    <h3 class="sec" id="m3-radius">半径、周期与频率</h3>
    <p>由 <Katex tex="qvB=mv^2/r" /> 解出</p>
    <p style="text-align:center"><Katex tex="r=\frac{mv}{qB}." display /></p>
    <p>半径与速率成正比、与磁感应强度成反比。速率越大轨道越平展，磁场越强轨道越紧。下面这块板右栏的双曲线就是 <Katex tex="r" /> 随 <Katex tex="B" /> 的变化：拖 <Katex tex="B" />，橙点沿曲线滑动；把 <Katex tex="v" /> 调大，曲线上每一点的读数按同一比例变大，读数栏的 <Katex tex="r" /> 一行按正比翻倍，而曲线在框里的形状不变——纵轴的上限是按当前的 <Katex tex="v" /> 现算的。</p>
    <p>再看走完一整圈用的时间。圆周周长 <Katex tex="2\pi r" />，速率 <Katex tex="v" />，所以</p>
    <p style="text-align:center"><Katex tex="T=\frac{2\pi r}{v}=\frac{2\pi}{v}\cdot\frac{mv}{qB}=\frac{2\pi m}{qB}." display /></p>
    <p>速率在分子上被消掉了——<strong>周期与速率无关</strong>。跑得快时半径变大、路程变长，正好抵消。这是一个不常遇到的结论：同一个电荷在同一个磁场里，无论以多大速率射入，绕一圈的时间都一样。频率 <Katex tex="f=1/T=qB/(2\pi m)" /> 也只由荷质比与磁场决定。</p>
    <p>这一点被用来做<strong>回旋加速器</strong>：交变电压的周期要与电荷的转动周期相同，才能每次经过缝隙都被加速。因为 <Katex tex="T" /> 不随速率变，这个同步条件在非相对论范围内一直成立。</p>
    <p>上一节那块板与下面这块板正好是一正一负两档，可以直接对照：电荷变号时 <Katex tex="q" /> 与受力的方向同时反过来，转向相反，但 <Katex tex="r=\dfrac{m|v|}{|q|B}" /> 与 <Katex tex="T" /> 里的 <Katex tex="q" /> 只取大小，两个数都不变。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电10b · <b>负电荷：转向相反，半径与周期不变</b>：磁场、轨道与滑块都和上一块板一样，电荷换成负的，圆点由橙转蓝并标成 −。看点一：绿箭头仍沿切线，紫箭头仍指向圆心，转向却由逆时针变成顺时针——左手定则里四指要先反指速度，力才落到这个方向。看点二：两块的滑块都停在默认值时，读数栏的 r、T、f 三行与上一块板完全相同，只有转向反过来。看点三：把 v 从 3 拖到 6，画面上的圆变大、r 一行翻倍，T 与 f 两行纹丝不动——跑得更快的电荷走更大的圆，绕一圈的时间一样。看点四：读数栏最后两行 <Katex tex="r\cdot B" /> 与 <Katex tex="mv/q" /> 始终相等，拖 B、拖 v 都推不动这一对，这正是 <Katex tex="r=mv/(qB)" /> 两边同乘 B 的结果。</p>

    <h3 class="sec" id="m3-calc">算一遍</h3>
    <p>质子 <Katex tex="m=1.67\times10^{-27}\ \text{kg}" />、<Katex tex="q=1.6\times10^{-19}\ \text{C}" />，以 <Katex tex="v=3.0\times10^{5}\ \text{m/s}" /> 垂直射入 <Katex tex="B=0.50\ \text{T}" /> 的匀强磁场。</p>
    <p>轨道半径</p>
    <p style="text-align:center"><Katex tex="r=\frac{mv}{qB}=\frac{1.67\times10^{-27}\times3.0\times10^{5}}{1.6\times10^{-19}\times0.50}=6.3\times10^{-3}\ \text{m}," display /></p>
    <p>约 6.3 mm。转动周期</p>
    <p style="text-align:center"><Katex tex="T=\frac{2\pi m}{qB}=\frac{2\pi\times1.67\times10^{-27}}{1.6\times10^{-19}\times0.50}=1.3\times10^{-7}\ \text{s}," display /></p>
    <p>约 0.13 μs。把速率加到两倍，半径翻倍、周期不动——上面两块板里把 <Katex tex="v" /> 从 3 拖到 6，画面上的圆直径变大，而读数栏里的 <Katex tex="T" /> 一行纹丝不动。</p>
    <p>读数栏还能逐行核对：它给出 <Katex tex="r" />、<Katex tex="T" />、<Katex tex="f" /> 与 <Katex tex="r\cdot B" />、<Katex tex="mv/q" /> 两行。后两行始终相等，因为由 <Katex tex="r=mv/(qB)" /> 两边乘 <Katex tex="B" /> 就得到 <Katex tex="rB=mv/q" />——把 <Katex tex="B" /> 拖来拖去，它推不动这两行。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把负电荷的四指指成速度方向。</strong>左手定则的四指指的是<strong>正电荷</strong>的运动方向。电子、负离子要先反一次，或者四指反指速度。判断错了，整段圆周的转向就画反了。</li>
        <li><strong>提示二：以为洛伦兹力会改变速率。</strong>力始终垂直于速度，做功为零，速率与动能都不变。凡是「电荷越转越快」「磁场让它加速」的说法都不成立；磁场只改方向。</li>
        <li><strong>提示三：把 <Katex tex="T" /> 也写成随速率变化。</strong>半径正比于速率、周期与速率无关，两者不要一起套。运动更快的电荷走更大的圆，走一圈的时间不变。</li>
        <li><strong>提示四：忽略速度与磁场不垂直的情形。</strong>斜射入时把速度分解成平行与垂直的两个分量：垂直分量提供向心力，做圆周运动；平行分量不受力，保持匀速。两者合成是螺旋线，不是平面上的圆。</li>
      </ul>
    </div>
    <p>回收与预告：本章把安培力分摊到单个电荷，得到洛伦兹力，并用它解释了带电粒子在磁场中为什么做圆周运动。到此「电」与「磁」各自的规律已经齐备。下一部分开始讲两者之间的转化：变化的磁通量会在导体回路里激起电流，这就是电磁感应，第一个要讲的是判定感应电流方向的楞次定律。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('lorentz2');
const DEMO2 = demoOf('lorentz2Neg');
</script>
