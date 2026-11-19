<template>
  <PhysicsCh id="circuit3"
    sub="电流通过用电器时消耗电能，这份电能可以变成内能，也可以变成机械能、化学能。电功与电功率描述消耗了多少、快不快；焦耳定律单独描述其中变成内能的那部分。两套式子在一类用电器上重合，在另一类上必须分开。"
    :toc="[
      { id: 'c3-work', t: '电功与电功率' },
      { id: 'c3-joule', t: '焦耳定律' },
      { id: 'c3-pure', t: '纯电阻与非纯电阻' },
      { id: 'c3-calc', t: '算一遍' },
    ]">
    <div class="note good">
      电流做功的多少叫<strong>电功</strong>，<Katex tex="W=UIt," />
      表示用电器消耗了多少电能，单位是焦。单位时间内电流做的功叫<strong>电功率</strong>，
      <Katex tex="P=\frac{W}{t}=UI." />
      电流通过导体时产生热量的规律由<strong>焦耳定律</strong>给出：
      <Katex tex="Q=I^2Rt," />
      对应的热功率是 <Katex tex="P_{\text{热}}=I^2R" />。对<strong>纯电阻</strong>用电器（电炉、白炽灯、电阻丝），电能全部变成内能，
      <Katex tex="W=Q,\qquad P=UI=I^2R=\frac{U^2}{R}," />
      欧姆定律也成立。对<strong>非纯电阻</strong>用电器（电动机、电解槽），电能分成两部分，
      <Katex tex="W=Q+E_{\text{其他}},\qquad P_{\text{电}}=P_{\text{热}}+P_{\text{机}}," />
      这时 <Katex tex="U>IR" />，欧姆定律不再成立，<Katex tex="P=UI" /> 与 <Katex tex="P=I^2R" /> 算的是两回事。
    </div>

    <h3 class="sec" id="c3-work">电功与电功率</h3>
    <p>一段电路两端电压为 <Katex tex="U" />，通过的电流为 <Katex tex="I" />，在时间 <Katex tex="t" /> 内通过的电荷量是 <Katex tex="q=It" />。电场力把这些电荷从一端移到另一端，做的功是 <Katex tex="qU" />，于是</p>
    <p style="text-align:center"><Katex tex="W=UIt." display /></p>
    <p>这就是<strong>电功</strong>：电流做功的过程，就是电能转化为其他形式能的过程，电功的多少等于消耗的电能。单位是焦（J），<Katex tex="1\ \text{J}=1\ \text{V}\cdot\text{A}\cdot\text{s}" />。生活中用电能表计量，单位是千瓦时（度），<Katex tex="1\ \text{kW}\cdot\text{h}=3.6\times10^{6}\ \text{J}" />。</p>
    <p><strong>电功率</strong>是单位时间内电流做的功，</p>
    <p style="text-align:center"><Katex tex="P=\frac{W}{t}=UI." display /></p>
    <p>单位是瓦（W）。这条式子对任何用电器都成立，不论它把电能转成什么。用电器铭牌上标的「220 V　1000 W」指的是额定电压与额定功率：在额定电压下工作，电功率就是额定功率；电压变了，实际功率也跟着变。</p>

    <h3 class="sec" id="c3-joule">焦耳定律</h3>
    <p>电流通过导体时，自由电荷在电场力作用下加速、又与导体里的粒子碰撞，把定向移动的动能交给导体粒子，宏观上就表现为导体发热。焦耳用实验测出：电流通过导体产生的热量与电流的平方、导体的电阻、通电时间都成正比，</p>
    <p style="text-align:center"><Katex tex="Q=I^2Rt." display /></p>
    <p>对应的热功率是 <Katex tex="P_{\text{热}}=I^2R" />。推导可以走「纯电阻」这一条路：若电能全部变成内能，<Katex tex="W=Q" />，由 <Katex tex="UIt=I^2Rt" /> 与欧姆定律 <Katex tex="U=IR" /> 就直接得到。但实验表明，即使电能没有全部变成内能，发热量仍按 <Katex tex="I^2Rt" /> 算，所以焦耳定律是独立于欧姆定律的一条实验规律。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电7a · <b>电流的热效应（纯电阻）</b>：左栏电阻丝通电后发着橙光，外面一圈光晕随温度呼吸，上方三条热气流往上飘。看点一：纯电阻上电流由 <Katex tex="I=U/R" /> 现算，拖大电压电流变大、拖大电阻电流变小，小点流的快慢跟着变。看点二：读数栏的 P − I²R 一行拖任何滑块都是零——电能全部变成内能，电功率与热功率是同一个数。看点三：把电压加倍，电流也加倍，读数栏的 P 与 I²R 一起翻到四倍，10 s 内的电热同样按四倍走，这就是「功率与电流的平方成正比」。看点四：把电阻拖大，电流按反比减小，热功率反而跟着降下来，电阻丝的光晕也淡下去。</p>

    <h3 class="sec" id="c3-pure">纯电阻与非纯电阻</h3>
    <p><strong>纯电阻用电器</strong>指把电能全部转化为内能的元件，白炽灯、电炉、电饭锅、电阻丝都是。对它们，<Katex tex="W=Q" />，于是</p>
    <p style="text-align:center"><Katex tex="P=UI=I^2R=\frac{U^2}{R}," display /></p>
    <p>三个式子可以互换使用，欧姆定律 <Katex tex="I=U/R" /> 也成立。哪一个方便就用哪一个：已知 <Katex tex="U" /> 与 <Katex tex="R" /> 时用 <Katex tex="U^2/R" />，已知 <Katex tex="I" /> 与 <Katex tex="R" /> 时用 <Katex tex="I^2R" />。</p>
    <p><strong>非纯电阻用电器</strong>指电能会转成其他形式能的元件，电动机转成机械能，电解槽转成化学能。对它们，电能分成两部分，</p>
    <p style="text-align:center"><Katex tex="W=Q+E_{\text{其他}},\qquad P_{\text{电}}=P_{\text{热}}+P_{\text{机}}." display /></p>
    <p>这时 <Katex tex="UIt>I^2Rt" />，两边同除 <Katex tex="It" /> 得 <Katex tex="U>IR" />。所以电动机的电压不能写成 <Katex tex="IR" />，比它多出的那一部分叫<strong>反电动势</strong>：电动机转动时自己也切割磁感线，产生一个与电流方向相反的电动势，抵掉一部分电压。转得越快，反电动势越大，通过的电流越小，这是电动机「空转电流小、卡住电流大」的原因。</p>
    <p>对非纯电阻，电功与电热必须分开算：<Katex tex="W=UIt" />、<Katex tex="Q=I^2Rt" />，两者之差就是转化出的机械能或化学能。<Katex tex="P=U^2/R" /> 在这里不能用，它算出来的既不是总功率也不是热功率。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电7b · <b>电动机：电功率分成机械功率与热功率</b>：转子按提升速度转动，旁边一支绿箭头标出提升速度 <Katex tex="v=P_{\text{机}}/(mg)" />。看点一：功率条按电功率分成绿色机械段与粉色热段，两段之和始终是总功率；拖大线圈电阻 R，粉段变宽、绿段变窄，效率那一栏跟着降。看点二：把电流 I 拖大，热功率按 <Katex tex="I^2R" /> 涨得比电功率按 <Katex tex="UI" /> 涨得快，绿段迅速缩掉。看点三：电流拖过 <Katex tex="U/R" /> 这个值，绿段消失、转子停转并标注「电流过大，电机卡住不转」，读数栏的反电动势 <Katex tex="U-IR" /> 变成负的——这组参数下电机已经带不动了。看点四：读数栏的 <Katex tex="P_{\text{电}}=P_{\text{机}}+P_{\text{热}}" /> 一行与下面两项相加始终相等，与上一块板的 P − I²R ≡ 0 正好成对照。</p>

    <h3 class="sec" id="c3-calc">算一遍</h3>
    <p>一根电阻丝接在 <Katex tex="U=12\ \text{V}" /> 的电源上，电阻 <Katex tex="R=6.0\ \Omega" />，是纯电阻。电流、功率与 10 s 内的电热分别是</p>
    <p style="text-align:center"><Katex tex="I=\frac{U}{R}=2.0\ \text{A},\quad P=UI=24\ \text{W},\quad Q=I^2Rt=240\ \text{J}," display /></p>
    <p>电功与电热相等，都对得上 <Katex tex="24\ \text{W}\times10\ \text{s}=240\ \text{J}" />。</p>
    <p>换成一只电动机：电压 12 V、电流 2.0 A、线圈电阻 2.0 Ω。电功率、热功率与机械功率分别是</p>
    <p style="text-align:center"><Katex tex="P_{\text{电}}=UI=24\ \text{W},\quad P_{\text{热}}=I^2R=8.0\ \text{W},\quad P_{\text{机}}=24-8.0=16\ \text{W}," display /></p>
    <p>效率 <Katex tex="\eta=16/24\approx67\%" />，反电动势 <Katex tex="U-IR=12-4.0=8.0\ \text{V}" />。若用它提升 2.0 kg 的重物，提升速度由 <Katex tex="P_{\text{机}}=mgv" /> 给出，</p>
    <p style="text-align:center"><Katex tex="v=\frac{16}{2.0\times9.8}\approx0.82\ \text{m/s}." display /></p>
    <p>上面两块板正好对应这两个例子：纯电阻板读数栏的 <Katex tex="P-I^2R" /> 恒为零，电动机板的功率条把电功率分成绿色机械段与粉色热段，拖动线圈电阻就能看到两段此消彼长。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：对非纯电阻套用 P = U²/R 或 I = U/R。</strong>电动机、电解槽不满足欧姆定律，<Katex tex="U>IR" />。<Katex tex="U^2/R" /> 算出来的数既不是总功率也不是热功率，遇到这类元件先把电功与电热分开写。</li>
        <li><strong>提示二：认为焦耳定律只对纯电阻成立。</strong><Katex tex="Q=I^2Rt" /> 对任何用电器都成立，它是一条独立的实验规律。对电动机，热功率仍然按 <Katex tex="I^2R" /> 算，只是它不等于总功率。</li>
        <li><strong>提示三：把额定功率当成实际功率。</strong>铭牌上的功率是在额定电压下的值。电压变了，纯电阻的实际功率按 <Katex tex="U^2/R" /> 变；非纯电阻的变化更复杂，不能直接按平方比推算。</li>
        <li><strong>提示四：千瓦时与焦换算时少乘一个零。</strong><Katex tex="1\ \text{kW}\cdot\text{h}=1000\ \text{W}\times3600\ \text{s}=3.6\times10^{6}\ \text{J}" />，不是 <Katex tex="3.6\times10^{3}" />。题目问「多少度电」时，先把瓦换成千瓦、秒换成小时再乘。</li>
      </ul>
    </div>
    <p>回收与预告：这一章把电能的两条去处分开——全部变内能的是纯电阻，分成内能与别的形式能的是非纯电阻，两套功率式各管一段。恒定电流到这里讲完：欧姆定律、闭合电路、电功与电热。下一部分转入磁场：电流周围有磁场，磁场又对电流与运动电荷施力，这些规律会把电与磁连到一起，也为后面讲电磁感应铺路。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('power');
const DEMO2 = demoOf('powerMotor');
</script>
