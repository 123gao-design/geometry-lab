<template>
  <PhysicsCh id="ac1"
    sub="前面几章处理的是方向不变的感应电流。把线圈放进匀强磁场里匀速转动，磁通量按余弦规律起伏，感应电动势也跟着按正弦规律起伏，方向周期性反转——这就是交流电。读有效值、算发热、看相位，都从这条正弦曲线上来。"
    :toc="[
      { id: 'a1-gen', t: '线圈转动如何给出正弦电动势' },
      { id: 'a1-peak', t: '峰值与瞬时值' },
      { id: 'a1-rms', t: '有效值' },
      { id: 'a1-phase', t: '相位、频率与相位差' },
    ]">
    <div class="note good">
      面积为 <Katex tex="S" /> 的线圈共 <Katex tex="N" /> 匝，在磁感应强度为 <Katex tex="B" /> 的匀强磁场中绕垂直于磁场的轴以角速度 <Katex tex="\omega" /> 匀速转动。取线圈平面与磁场方向垂直的时刻为计时起点，则磁通量 <Katex tex="\Phi=BS\cos\omega t" />，感应电动势 <Katex tex="e=NBS\omega\sin\omega t" />。峰值 <Katex tex="E_0=NBS\omega" />，有效值 <Katex tex="E=E_0/\sqrt 2" />，周期 <Katex tex="T=2\pi/\omega" />、频率 <Katex tex="f=\omega/(2\pi)" />。
    </div>

    <h3 class="sec" id="a1-gen">线圈转动如何给出正弦电动势</h3>
    <p>把线圈看成一块可以转动的矩形面，从正上方俯视，它是一条绕中心匀速转动的线段。磁场水平向右，线圈平面与磁场方向的夹角随时间线性变化，于是穿过线圈的磁通量随转角按余弦变化：</p>
    <p style="text-align:center"><Katex tex="\Phi=BS\cos\theta,\qquad \theta=\omega t" display /></p>
    <p>感应电动势由法拉第定律给出，需要的是磁通量的<strong>变化率</strong>，不是磁通量本身：</p>
    <p style="text-align:center"><Katex tex="e=-N\dfrac{\Delta\Phi}{\Delta t}=NBS\omega\sin\omega t" display /></p>
    <p>两条曲线的相位差了四分之一周期：磁通量最大时，变化率为零，电动势为零；磁通量为零时，曲线正穿过零点，斜率的绝对值最大，电动势取到峰值。线圈平面与磁场垂直的那个位置习惯上叫<strong>中性面</strong>，线圈每经过一次中性面，电流方向就反转一次。</p>
    <p>线圈转一圈，感应电动势完成一次完整的变化：从中性面出发时电动势为零，转过四分之一圈到最大值，再转过四分之一圈回到零，然后反向重复一次。每转一圈，电流方向改变两次——这就是交流电名称的由来。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电15 · <b>交流电的产生：磁通量与电动势的相位差</b>：左栏是俯视的匀强磁场与线圈，线圈绕中心匀速转动，两枚绿色小箭头标出此刻的电流方向；右栏是连画两个周期的 e–t 曲线，橙点是此刻的电动势。看点一：线圈转到与磁场垂直的位置（磁通量最大）时橙点落在零点，转到与磁场平行（磁通量为零）时橙点落在峰值上，两者的时刻正好错开四分之一周期。看点二：紫虚线是峰值 ±E₀，青虚线是有效值 ±E₀/√2，橙点在任何时刻都不越过紫线。看点三：把转速 f 拖大，曲线在一个画面里的周期数变多、峰值一起按正比升高，周期 T = 1/f 的读数同步变小。看点四：把匝数、磁感应强度或线圈面积拖大，曲线形状不变、整体按正比升高，读数栏的峰值与有效值同步变化。</p>

    <h3 class="sec" id="a1-peak">峰值与瞬时值</h3>
    <p>峰值是电动势能取到的最大数值，把上面那条式子里的正弦因子取到 1 就得到它：</p>
    <p style="text-align:center"><Katex tex="E_0=NBS\omega=2\pi NBS f" display /></p>
    <p>四个量里任何一个变大，峰值都按正比升高。其中 <Katex tex="\omega" /> 最容易被人忽略：转速加倍，峰值加倍，频率也加倍，两件事一起发生。读数栏把 <Katex tex="E_0" /> 与 <Katex tex="f" /> 分成两行列出，拖转速滑块时可以看到两者同时变化。</p>
    <p>瞬时值写成时间的函数，具体用正弦还是余弦，取决于计时起点的选法。从中性面开始计时用 <Katex tex="e=E_0\sin\omega t" />；从线圈平面与磁场平行的位置开始计时，磁通量本身就是零、变化率最大，用 <Katex tex="e=E_0\cos\omega t" />。两种写法只差一个初相，描述的是同一条曲线。</p>
    <p>要求某一时刻的电动势，先把该时刻的转角算出来再代进式子，不能拿峰值代替瞬时值。比如从中性面算起转过 30° 时 <Katex tex="e=E_0\sin 30^\circ=E_0/2" />，转过 90° 时才取到峰值。</p>

    <h3 class="sec" id="a1-rms">有效值</h3>
    <p>交流电的瞬时值一直在变，说「这个电压是多少」需要换一个等价的量。有效值的定义取自发热：让交流电与某个直流电分别通过相同的电阻，在相同时间内产生相同的热量，那个直流电的数值就叫交流电的有效值。</p>
    <p>按这个定义算正弦交流电，得到</p>
    <p style="text-align:center"><Katex tex="E=\dfrac{E_0}{\sqrt 2}\approx 0.707E_0,\qquad U=\dfrac{U_0}{\sqrt 2},\qquad I=\dfrac{I_0}{\sqrt 2}" display /></p>
    <p>推导的关键在一个周期里 <Katex tex="\sin^2\omega t" /> 的平均值等于 <Katex tex="1/2" />：热功率与电流的平方成正比，平方之后的平均值降到一半，开方回到有效值。注意开方之后是 <Katex tex="1/\sqrt 2" /> 而不是 <Katex tex="1/2" />。</p>
    <p>家用电压写成 220 V、频率 50 Hz，这个 220 V 是有效值，对应的峰值约 311 V。用电器铭牌上的额定电压、电流表与电压表的读数，一律是有效值；计算发热、功率、电表读数都用有效值，只有讨论绝缘耐压、电容耐压时才用峰值。</p>
    <p>还有一个容易混淆的量是<strong>平均值</strong>。<Katex tex="\bar E=N\Delta\Phi/\Delta t" /> 指的是某个时间段里电动势的平均大小，求通过回路的电荷量 <Katex tex="q=\bar I\,\Delta t" /> 时用它。正弦交流电在半个周期里的平均值是 <Katex tex="\bar E=2E_0/\pi\approx 0.637E_0" />，与有效值 <Katex tex="0.707E_0" /> 并不相等。求发热用有效值，求电荷量用平均值，两者不能互换。</p>

    <h3 class="sec" id="a1-phase">相位、频率与相位差</h3>
    <p>正弦式交流电的一般写法是</p>
    <p style="text-align:center"><Katex tex="e=E_0\sin(\omega t+\varphi_0)" display /></p>
    <p>其中 <Katex tex="\omega t+\varphi_0" /> 叫相位，<Katex tex="\varphi_0" /> 叫初相，由计时起点的选法决定。两个频率相同的交流电之间的相位之差 <Katex tex="\Delta\varphi" /> 叫相位差，它不随时间变化，描述的是两条曲线在时间轴上错开多少。相位差为 <Katex tex="\pi" /> 时两量同时达到正向峰值又同时达到负向峰值，叫反相；相位差为四分之一周期时，一个取峰值另一个正在过零。</p>
    <p>角速度、周期与频率之间的关系是 <Katex tex="\omega=2\pi/T=2\pi f" />。我国的市电频率为 50 Hz，周期 0.02 s，电流方向每秒改变 100 次。变压器两侧的电压频率相同，改变的只是峰值——这一点下一章要用。</p>
    <p>把磁通量与电动势写在一起看，<Katex tex="\Phi" /> 按余弦变化、<Katex tex="e" /> 按正弦变化，两者的相位差正是 <Katex tex="\pi/2" />。这条关系在本章开头就由求导给出，是交流电路中「电压与磁通量不同相」的根源，电感上的电流与电压相差四分之一周期也是同一个道理。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把峰值当成有效值代入。</strong>铭牌上写 220 V 是有效值，峰值约 311 V。题目说「接在 220 V 电源上」，代进 <Katex tex="U^2/R" /> 的是 220，不是 311；问电容耐压、绝缘要求时才用峰值。</li>
        <li><strong>提示二：求电荷量时用了有效值。</strong>电荷量由 <Katex tex="q=n\Delta\Phi/R" /> 给出，这里起作用的是一段时间内的磁通量变化总量，与平均值对应；有效值只用于求发热与功率。两者混用会得到没有物理意义的数。</li>
        <li><strong>提示三：正弦与余弦的起点弄反。</strong>从中性面开始计时用 <Katex tex="\sin" />，从线圈平面与磁场平行处开始计时用 <Katex tex="\cos" />。判断起点看的是「此刻磁通量是最大还是零」，不是线圈画在图上的位置。</li>
        <li><strong>提示四：把 <Katex tex="E_0/\sqrt 2" /> 用在任何交流电上。</strong>这个系数只对正弦式交流电成立。方波、三角波、整流后的脉动电流要按定义用积分算 <Katex tex="\sqrt{\overline{e^2}}" />，不能套同一个数。</li>
      </ul>
    </div>
    <p>回收与预告：本章把「磁通量变化」装进一个匀速转动的线圈，得到按正弦变化的电动势，又用发热等价的办法把起伏的曲线折算成一个有效值。下一章把这条正弦电压接到另一侧线圈上：两个线圈共用一个铁芯，电压按匝数比升高或降低，功率却几乎不变——这就是变压器。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('acgen');
</script>
