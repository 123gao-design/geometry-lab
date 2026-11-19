<template>
  <PhysicsCh id="ind2"
    sub="上一章把感应电流的方向定了下来，这一章给它的强弱一个数。磁通量变化得越快、线圈匝数越多，感应电动势就越大；把这条规律用到导体棒切割磁感线的情形，得到高中最常用的一条式子 E = BLv。"
    :toc="[
      { id: 'i2-def', t: '法拉第电磁感应定律' },
      { id: 'i2-avg', t: '平均电动势与瞬时电动势' },
      { id: 'i2-motion', t: '动生电动势 E = BLv' },
      { id: 'i2-charge', t: '由变化率求电荷量' },
    ]">
    <div class="note good">
      感应电动势的大小由<strong>磁通量的变化率</strong>决定，写成 <Katex tex="E=n\dfrac{\Delta\Phi}{\Delta t}" />，这就是<strong>法拉第电磁感应定律</strong>。式中的 <Katex tex="n" /> 是线圈匝数，<Katex tex="\Delta\Phi" /> 是单匝线圈的磁通量变化量，<Katex tex="\Delta t" /> 是完成这一变化所用的时间。方向仍由上一章的楞次定律判断，本章只讨论大小。当变化由导体棒切割磁感线引起时，这条式子化为 <Katex tex="E=BLv" />；把它对时间累积，还能直接得到一段时间内通过回路的电荷量 <Katex tex="q=n\Delta\Phi/R" />，与过程快慢无关。
    </div>

    <h3 class="sec" id="i2-def">法拉第电磁感应定律</h3>
    <p>上一章见过这样的现象：磁通量变化得越剧烈，指针偏得越远，感应电流越强。法拉第把这一类实验归结成一条定量规律：回路中感应电动势的大小，与穿过回路的磁通量的变化率成正比，与线圈匝数成正比。</p>
    <p style="text-align:center"><Katex tex="E=n\dfrac{\Delta\Phi}{\Delta t}" display /></p>
    <p>式中 <Katex tex="n" /> 为线圈匝数，<Katex tex="\Delta\Phi" /> 为穿过单匝线圈的磁通量的变化量（单位韦伯，Wb），<Katex tex="\Delta t" /> 为发生变化所用的时间（单位秒，s），<Katex tex="E" /> 的单位是伏特，V。</p>
    <p>量纲上也可以核一遍：<Katex tex="1\;\text{V}\cdot\text{s}=1\;\text{Wb}" />，即 1 韦伯每 1 秒的变化对应 1 伏特。教材里常把这条式子写成 <Katex tex="E=\dfrac{\Delta\Phi}{\Delta t}" /> 只管一匝，使用时别忘了乘匝数——n 匝线圈首尾相接，每一匝的变化率相同，电动势按匝数叠加。</p>
    <p>还要强调：<Katex tex="\Delta\Phi" /> 取的是<strong>变化量</strong>，不是磁通量本身。回路闭合时磁通量再大，只要不动就不产生电动势；回路不闭合时，电动势照旧按上式算，只是没有电流通过。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电12 · <b>垂直纸面的磁场：电动势与变化率</b>：左栏是 n 匝线圈处在垂直纸面向里的匀强磁场中，叉号的大小与疏密随磁感应强度变化，绿色箭头标出感应电流的绕行方向。看点一：磁场匀速增强时电流逆时针、匀速减弱时顺时针，变化率符号一换，方向就翻。看点二：磁场升到顶、开始下降的那一刻，变化率为零，绿色箭头与电流计指针同时归零，但此时磁通量正处在最大值——电动势看的是斜率不是高度。看点三：右栏把总磁通量 <Katex tex="n\Phi" /> 随时间的折线画出来，橙色升、青色降，两段斜率等值反号，斜率的大小就是读数栏的电动势。看点四：把「磁场变化率」拖大一倍，折线变陡、电动势与电流按比例翻倍；把「匝数」拖大，电动势随之变大、方向不变；把「电阻」拖大，电流变小而电动势不动。</p>

    <h3 class="sec" id="i2-avg">平均电动势与瞬时电动势</h3>
    <p>式中 <Katex tex="\Delta t" /> 若取一段时间间隔，得到的是一段时间内的<strong>平均电动势</strong>；若取无限短的时间间隔，<Katex tex="\Delta\Phi/\Delta t" /> 的极限就是某一时刻的<strong>瞬时电动势</strong>。两种读法的关系与运动学里平均速度、瞬时速度完全同构：<Katex tex="\bar E=n\Delta\Phi/\Delta t" /> 对应 <Katex tex="\bar v=\Delta x/\Delta t" />，<Katex tex="E=n\,\mathrm d\Phi/\mathrm dt" /> 对应 <Katex tex="v=\mathrm dx/\mathrm dt" />。</p>
    <p>在 <Katex tex="\Phi\text{–}t" /> 图像上，平均电动势是一条割线的斜率乘匝数，瞬时电动势是某点切线的斜率乘匝数。演示里磁感应强度按三角波变化，折线的两段都是直线，斜率处处相同，所以这段时间内平均电动势与任一时刻的瞬时电动势恰好相等；换成正弦变化时两者就不再相同，峰值出现在磁通量过零处，与上一章「磁通量为零时电流最强」的说法一致。</p>
    <p>应用这条式子的场合里，如果题目没有特别指明「某时刻」，一般按平均电动势处理，用初末两个状态的磁通量差值除以时间即可，不必追究中间的细节。要求某一瞬间的电动势，则需先写出 <Katex tex="\Phi(t)" /> 的函数式再求导，或者从「变化最快的时刻」定性判断。</p>

    <h3 class="sec" id="i2-motion">动生电动势 E = BLv</h3>
    <p>把上式用到最常见的模型上：一根长为 <Katex tex="L" /> 的导体棒，垂直放在两条平行光滑导轨上，整个装置处在磁感应强度为 <Katex tex="B" /> 的匀强磁场中，磁场与导轨平面垂直。导体棒以速度 <Katex tex="v" /> 沿导轨滑行，它与导轨围成的回路面积在变。</p>
    <p>取一段很短的时间 <Katex tex="\Delta t" />，棒走过 <Katex tex="v\Delta t" /> 的距离，回路面积增加 <Katex tex="\Delta S=Lv\Delta t" />，磁通量增加 <Katex tex="\Delta\Phi=B\Delta S=BLv\Delta t" />。代入法拉第定律，单匝的情形给出</p>
    <p style="text-align:center"><Katex tex="E=n\dfrac{\Delta\Phi}{\Delta t}=nBLv" display /></p>
    <p>只有一匝时就是常见的 <Katex tex="E=BLv" />。这里的 <Katex tex="v" /> 是导体棒垂直于磁场方向的速度分量；若速度与磁场不垂直，取垂直分量即可。三条量都取国际单位时，<Katex tex="E" /> 得伏特。</p>
    <p>动生电动势的另一个角度看得出它的来源：随着棒运动，棒中的自由电荷随之一起运动，每个电荷都受到洛伦兹力 <Katex tex="F=qvB" />，沿棒方向把正电荷推向一端、负电荷推向另一端，棒的两端于是出现电势差。稳定的两端电压满足 <Katex tex="qU=qBvL" />，同样得到 <Katex tex="U=BLv" />。两种推导互相印证：一个从磁通量看，一个从载流子的受力看。</p>
    <p>若回路不闭合，棒中电荷只是向两端聚集，电流为零，但两端之间的电动势照样是 <Katex tex="BLv" />，这就是「有电动势不等于有电流」的具体例证。</p>

    <h3 class="sec" id="i2-charge">由变化率求电荷量</h3>
    <p>把法拉第定律与闭合电路欧姆定律合起来，可以算出一段时间内通过回路的电荷量。设回路总电阻为 <Katex tex="R" />，电流为 <Katex tex="I=E/R" />；在一段很短的时间 <Katex tex="\Delta t" /> 内通过的电荷量是 <Katex tex="I\Delta t" />。把 <Katex tex="E=n\Delta\Phi/\Delta t" /> 代进去，</p>
    <p style="text-align:center"><Katex tex="q=I\,\Delta t=\dfrac{n\,\Delta\Phi}{R\,\Delta t}\cdot\Delta t=\dfrac{n\,\Delta\Phi}{R}" display /></p>
    <p><Katex tex="\Delta t" /> 被约掉了，说明通过回路的电荷量只由磁通量的总变化量和回路电阻决定，与变化进行得快慢无关。磁铁快插和慢插进同一线圈，通过的电荷量相同，区别只在电流大小与通电时间的长短。</p>
    <p>这一结论在测量磁通量变化时很有用：用冲击电流计（或与电容串联的电压表）测出通过的总电荷量，再由 <Katex tex="\Delta\Phi=qR/n" /> 反推磁通量的变化量。实验里也常借此说明「电荷量这一量与过程速度无关」。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把磁通量与变化率混为一谈。</strong>磁通量最大时变化率常常为零（曲线过峰处切线水平），电动势反而最小；磁通量过零时变化率最大，电动势最强。读数栏与右栏曲线对照着看，这一点会变得很清楚。</li>
        <li><strong>提示二：忘记乘匝数。</strong><Katex tex="E=\Delta\Phi/\Delta t" /> 只对单匝回路成立。n 匝线圈的绕法让每匝产生的电动势串联相加，电动势按 n 倍叠加；反过来用 <Katex tex="\Delta\Phi=qR/n" /> 反推时要除掉 n。</li>
        <li><strong>提示三：把 <Katex tex="E=BLv" /> 当成独立公式。</strong>它是法拉第定律在「导体棒垂直切割磁感线」这一特定情形下的推论，v 必须是垂直磁场方向的分量，L 是有效长度。斜着切割时把 v 换成 <Katex tex="v\sin\theta" />。</li>
        <li><strong>提示四：把算出的电动势直接当成路端电压。</strong>回路闭合时，电动势要扣除内阻上的压降才是路端电压。只有回路断开、电流为零时，两端电压才等于电动势。</li>
      </ul>
    </div>
    <p>回收与预告：本章给感应电动势配上了定量式子，上一章的楞次定律则始终负责方向，两句合起来才完整描述了电磁感应。下一章转向一类特殊情形：回路本身的电流发生变化时，它自己产生的磁场也在变，回路里会因此出现自感电动势；铁芯里的涡流也属于同一类「电磁感应由自身引起」的现象。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('faraday');
</script>
