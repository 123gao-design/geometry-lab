<template>
  <PhysicsCh id="circuit2"
    sub="上一章的电源都当作电压恒定、内阻不计的理想电源。实际的电源要靠内部的非静电力把电荷「搬」上去，这个本领用电动势衡量；搬的过程里电源自己也要发热，这就是内阻。把外电路接上，电动势、内阻与外电阻一起决定电流，也决定路端电压比电动势小多少。"
    :toc="[
      { id: 'c2-emf', t: '电动势' },
      { id: 'c2-law', t: '闭合电路欧姆定律' },
      { id: 'c2-term', t: '路端电压' },
      { id: 'c2-power', t: '功率与效率' },
      { id: 'c2-calc', t: '算一遍' },
    ]">
    <div class="note good">
      电源靠内部的<strong>非静电力</strong>把正电荷从负极搬到正极，这个本领用<strong>电动势</strong>衡量：
      <Katex tex="\varepsilon=\frac{W_{\text{非}}}{q}," />
      单位是伏。电源同时有<strong>内阻</strong> <Katex tex="r" />，与电动势一起画在电源符号的虚线圈里。外电阻为 <Katex tex="R" /> 时，
      <Katex tex="I=\frac{\varepsilon}{R+r}," />
      这就是<strong>闭合电路欧姆定律</strong>。路端电压比电动势小一截，
      <Katex tex="U=IR=\varepsilon-Ir," />
      外电阻越大、电流越小，路端电压越接近电动势。
      <Katex tex="P_{\text{总}}=\varepsilon I=P_{\text{出}}+P_{\text{内}}," />
      效率 <Katex tex="\eta=\frac{U}{\varepsilon}=\frac{R}{R+r}." />
    </div>

    <h3 class="sec" id="c2-emf">电动势</h3>
    <p>导体里只有静电场时，正电荷从高电势向低电势移动，一旦两端电势相等，移动就停了。要让电流持续流动，必须有某种力量把正电荷从低电势的一端「搬」回高电势的一端，这种力不是静电力，统称<strong>非静电力</strong>。干电池里靠化学作用，发电机里靠电磁作用，它们做的功就是把其他形式的能转化为电能。</p>
    <p>不同电源搬电荷的本领不同。为衡量这个本领，引入<strong>电动势</strong>：非静电力把电荷量为 <Katex tex="q" /> 的正电荷从负极搬到正极所做的功 <Katex tex="W_{\text{非}}" /> 与 <Katex tex="q" /> 的比值，</p>
    <p style="text-align:center"><Katex tex="\varepsilon=\frac{W_{\text{非}}}{q}." display /></p>
    <p>单位与电压相同，也是伏。但两者含义不同：电压是两点之间电势差，描述电场力做功的本领；电动势由电源本身决定，描述非静电力做功、把其他形式的能转成电能的本领。一节干电池的电动势约 1.5 V，蓄电池约 2 V，无论接多大的外电阻，电动势都不变。</p>
    <p>闭合电路分成两部分：电源外部的导线与用电器叫<strong>外电路</strong>，电源内部叫<strong>内电路</strong>。电流在内电路里也要经过一段导体，这段导体同样有电阻，叫<strong>内阻</strong> <Katex tex="r" />。电源在电路图里画成一个长板、一个短板，外面套一圈虚线框，框里标 <Katex tex="\varepsilon" /> 与 <Katex tex="r" />。</p>

    <h3 class="sec" id="c2-law">闭合电路欧姆定律</h3>
    <p>把电动势为 <Katex tex="\varepsilon" />、内阻为 <Katex tex="r" /> 的电源与阻值为 <Katex tex="R" /> 的外电阻接成闭合回路，电流为 <Katex tex="I" />。在一段时间 <Katex tex="t" /> 内，非静电力做的功是 <Katex tex="\varepsilon I t" />，这些电能全部转化成内能：外电路发热 <Katex tex="I^2Rt" />，内电路发热 <Katex tex="I^2rt" />。由能量守恒</p>
    <p style="text-align:center"><Katex tex="\varepsilon It=I^2Rt+I^2rt\ \Longrightarrow\ I=\frac{\varepsilon}{R+r}." display /></p>
    <p>这就是<strong>闭合电路欧姆定律</strong>：闭合电路里的电流，与电源电动势成正比，与内、外电阻之和成反比。上一章的 <Katex tex="I=U/R" /> 只是 <Katex tex="r\to0" /> 时的特殊情况。</p>
    <p>把它改写成电压的形式：两边同乘 <Katex tex="R+r" /> 再整理，得到</p>
    <p style="text-align:center"><Katex tex="\varepsilon=IR+Ir=U+Ir." display /></p>
    <p>电动势等于外电路电压与内电路电压之和。外电路电压 <Katex tex="U=IR" /> 就是电源两极之间的电压，叫<strong>路端电压</strong>；内电路电压 <Katex tex="Ir" /> 是电源内部损失掉的那一截。</p>

    <h3 class="sec" id="c2-term">路端电压</h3>
    <p>由 <Katex tex="U=\varepsilon-Ir" /> 可以直接读出三条结论。</p>
    <p>其一，外电阻 <Katex tex="R" /> 增大，电流 <Katex tex="I" /> 减小，<Katex tex="Ir" /> 减小，路端电压升高；<Katex tex="R" /> 减小，路端电压降低。其二，断路时 <Katex tex="I=0" />，路端电压等于电动势 <Katex tex="\varepsilon" />——用电压表直接量电源两极，量到的略小于电动势，正是因为电压表本身也是外电路。其三，短路时 <Katex tex="R=0" />，电流 <Katex tex="I=\varepsilon/r" /> 达到最大，路端电压为零，全部电能在电源内部变成热，电流过大还会烧坏电源，所以不允许把电源两极直接短接。</p>
    <p>把 <Katex tex="U=\varepsilon-Ir" /> 画成图：以 <Katex tex="I" /> 为横轴、<Katex tex="U" /> 为纵轴，是一条斜向下的直线，纵截距是 <Katex tex="\varepsilon" />，斜率是 <Katex tex="-r" />，横截距是短路电流 <Katex tex="\varepsilon/r" />。改变外电阻 <Katex tex="R" />，工作点只沿这条直线移动，直线本身不动——它由电源自己决定。所以测出这条直线，就能同时得到电动势与内阻，这正是下一部分实验里「测电源电动势与内阻」的原理。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电6a · <b>闭合电路与路端电压</b>：左栏电源外面套着一圈虚线框，那就是内阻所在之处；导线上的小点按电流快慢流动。看点一：把外电阻 R 拖大，小点明显慢下来，读数栏的电流变小、路端电压升高；把 R 拖到最小，电流最大而路端电压落到最低。看点二：右栏 U–I 直线不动，拖 R 只让橙色工作点沿直线滑动，纵截距始终是电动势 ε、斜率始终是 −r。看点三：把内阻 r 拖大，直线整体变陡，短路电流 ε/r 变小；读数栏的 I(R+r) 一行拖任何滑块都等于电动势。看点四：把 R 一路拖大，工作点贴近纵轴，路端电压向电动势靠拢——断路时两者相等，这正是电压表量电源两极所读到的那一截。</p>

    <h3 class="sec" id="c2-power">功率与效率</h3>
    <p>电源的总功率是 <Katex tex="P_{\text{总}}=\varepsilon I" />。其中一部分消耗在外电路，叫输出功率 <Katex tex="P_{\text{出}}=UI=I^2R" />；另一部分消耗在内阻上，叫内耗功率 <Katex tex="P_{\text{内}}=I^2r" />。三者满足</p>
    <p style="text-align:center"><Katex tex="P_{\text{总}}=\varepsilon I=P_{\text{出}}+P_{\text{内}}." display /></p>
    <p>输出功率与总功率之比叫电源的<strong>效率</strong>，</p>
    <p style="text-align:center"><Katex tex="\eta=\frac{P_{\text{出}}}{P_{\text{总}}}=\frac{U}{\varepsilon}=\frac{R}{R+r}." display /></p>
    <p>外电阻越大、内阻越小，效率越高。把 <Katex tex="P_{\text{出}}=I^2R=\dfrac{\varepsilon^2R}{(R+r)^2}" /> 对 <Katex tex="R" /> 求极值，可以发现：当 <Katex tex="R=r" /> 时输出功率最大，最大值为 <Katex tex="\varepsilon^2/(4r)" />，但这时的效率只有 50%。工程上并不追求最大输出功率，而追求高效率，所以输电、供电都尽量把外电阻做大、内阻做小。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电6b · <b>功率与效率</b>：右栏上半是一根总功率条，绿色一段是输出功率、粉色一段是内耗，两段的分界按输出占的比例移动；下半是效率随外电阻变化的曲线。看点一：把外电阻 R 拖大，粉段越来越窄、绿段越来越宽，效率曲线向右上方逼近 100%。看点二：把 R 拖到与内阻 r 相等，读数栏的输出功率达到峰值，而效率那一栏恰好是 50%——输出功率的最大值与效率的最大值不在一处。看点三：把内阻 r 拖大，同样外电阻下粉段明显变宽、效率整体下移，输出功率的峰值也跟着变小。看点四：读数栏的输出功率与内耗功率两栏相加，始终等于总功率那一栏。</p>

    <h3 class="sec" id="c2-calc">算一遍</h3>
    <p>电动势 <Katex tex="\varepsilon=6.0\ \text{V}" />、内阻 <Katex tex="r=1.0\ \Omega" /> 的电源，接上 <Katex tex="R=5.0\ \Omega" /> 的外电阻。</p>
    <p>电流与路端电压为</p>
    <p style="text-align:center"><Katex tex="I=\frac{\varepsilon}{R+r}=\frac{6.0}{6.0}=1.0\ \text{A},\qquad U=IR=5.0\ \text{V}." display /></p>
    <p>三部分功率分别是</p>
    <p style="text-align:center"><Katex tex="P_{\text{总}}=\varepsilon I=6.0\ \text{W},\quad P_{\text{出}}=UI=5.0\ \text{W},\quad P_{\text{内}}=I^2r=1.0\ \text{W}," display /></p>
    <p>合起来正好 6.0 W；效率 <Katex tex="\eta=5.0/6.0\approx83\%" />。若把外电阻换成与内阻相等的 1.0 Ω，电流变成 3.0 A，输出功率 <Katex tex="I^2R=9.0\ \text{W}" />，比 5.0 W 大，但内耗也是 9.0 W，效率掉到 50%。</p>
    <p>演示的读数栏把电流、路端电压与 <Katex tex="I(R+r)" /> 分行列出，最后一行拖任何滑块都等于电动势；功率那块板再给出三条功率与效率，输出一栏加上内耗一栏正好是总功率那一栏。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把电动势与路端电压混为一谈。</strong>电动势由电源本身决定，与外电路无关；路端电压是电源两极之间的电压，等于 <Katex tex="\varepsilon-Ir" />，外电阻越大越接近电动势，只有断路时才相等。</li>
        <li><strong>提示二：算电流时漏掉内阻。</strong>闭合电路里 <Katex tex="I=\varepsilon/(R+r)" />，分母是内外电阻之和。上一章的 <Katex tex="I=U/R" /> 只在 <Katex tex="r" /> 可以忽略时成立。</li>
        <li><strong>提示三：认为输出功率随外电阻一直增大。</strong><Katex tex="P_{\text{出}}=I^2R" /> 随 <Katex tex="R" /> 先增后减，<Katex tex="R=r" /> 时最大，此时效率只有 50%。效率与输出功率不是一回事，两个极值点不在一起。</li>
        <li><strong>提示四：把电压表读数当成电动势。</strong>电压表本身有电阻，与电源构成闭合电路，量到的是路端电压 <Katex tex="\varepsilon-Ir" />。要更准确地测电动势，应选内阻很大的电压表，或在 <Katex tex="I" /> 很小的条件下外推。</li>
      </ul>
    </div>
    <p>回收与预告：这一章把内阻算进来，得到闭合电路欧姆定律与路端电压的变化规律，也把电源内部与外部两部分的能量分开算清。电能还能转成机械能、化学能，而不只是内能——下一章把电功与电热分开，处理非纯电阻元件，并把功率、效率放到实际情况里算。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('closed');
const DEMO2 = demoOf('closedEff');
</script>
