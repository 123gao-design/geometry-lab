<template>
  <PhysicsCh id="ac3"
    sub="发电厂与用户之间隔着几百公里。输电线有电阻，电流一过就要发热，送出的功率因此在路上折掉一部分。这一章把升压、输电、降压连成一条链，算清损耗与电压的关系。"
    :toc="[
      { id: 'a3-loss', t: '输电线上的两笔损失' },
      { id: 'a3-high', t: '为什么用高压输送' },
      { id: 'a3-chain', t: '升压、输送、降压' },
      { id: 'a3-calc', t: '算一遍：两百千瓦送出去' },
    ]">
    <div class="note good">
      输送功率 <Katex tex="P" />、输送电压 <Katex tex="U" />、线路总电阻 <Katex tex="R" /> 三者一旦定下，线路电流就是 <Katex tex="I=P/U" />。线路上有电压损失 <Katex tex="\Delta U=IR" />，也有功率损失 <Katex tex="\Delta P=I^2R=\dfrac{P^2R}{U^2}" />。功率损失与输送电压的平方成反比，这是高压输电的全部根据；到达用户之前还要用降压变压器把电压降回安全值。
    </div>

    <h3 class="sec" id="a3-loss">输电线上的两笔损失</h3>
    <p>输电线不是理想导线，它有电阻 <Katex tex="R" />。电流通过时，线上按焦耳定律发热，这部分功率到不了用户。同时，电流经过电阻会产生电压降，用户端拿到的电压低于发电厂送出的电压。</p>
    <p style="text-align:center"><Katex tex="\Delta U=IR,\qquad \Delta P=I^2R" display /></p>
    <p>两笔损失同出一源，都由线路电流决定：电流越大，线上压降越大，发热也越多。要减小损失，思路只有两条——把导线做粗以减少电阻，或者把电流做小。导线加粗意味着成倍的铜与铁塔承重，工程上代价很高；把电流做小才是根本办法。</p>
    <p>把电流写成输送功率与电压之比 <Katex tex="I=P/U" />，损耗变成</p>
    <p style="text-align:center"><Katex tex="\Delta P=\dfrac{P^2R}{U^2}" display /></p>
    <p>输送功率由用户需求决定，不能随意降低；线路电阻由导线决定。剩下能动的只有 <Katex tex="U" />，而且它在分母上、带平方。</p>

    <h3 class="sec" id="a3-high">为什么用高压输送</h3>
    <p>把输送电压提高到原来的 <Katex tex="k" /> 倍，电流降到 <Katex tex="1/k" />，电压损失随之降到 <Katex tex="1/k" />，功率损失按 <Katex tex="I^2" /> 的关系降到 <Katex tex="1/k^2" />。电压提高十倍，损耗降到百分之一；提高二十倍，损耗降到四百分之一。</p>
    <p>这就是电网采用高压甚至超高压输电的原因。我国常见的输送电压有 110 kV、220 kV、500 kV 几档，长距离大功率的线路用更高的电压。演示的右栏画出损耗比例随输送电压变化的曲线，形状就是一条 <Katex tex="1/U^2" /> 的下降曲线：低压段的下降很陡，电压升到一定程度之后曲线贴着横轴走，再往上加电压的收益越来越小。</p>
    <p>升压本身要靠变压器。发电机发出的电压通常在十几千伏，先经升压变压器升到几百千伏再送出。变压器只能对交流电工作，这也是交流输电成为主流的原因之一。</p>

    <p>需要留意的是，高压降低的是<strong>线路上的功率损失</strong>，不是把输送的功率变小。升压之后线路电流小，导线上的发热少，到达用户的功率反而更接近送出值。把「升压省电」理解成「电压越高输送的功率越多」，方向就错了。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电17 · <b>远距离输电：损耗与电压的平方关系</b>：左上是发电机、升压变压器、两条输电线、降压变压器与用户的示意，绿色小点沿线路流动表示电能的输送方向，线路上那只折线符号是导线电阻 R；左下两根条按同一比例画出输送功率与线上损失；右栏是损耗比例随输送电压变化的曲线，橙点为当前取值。看点一：把输送电压从 10 kV 拖到 110 kV，电流读数降到约十一分之一，损耗比例从百分之几掉到万分之几，绿点在曲线上急降。看点二：把输送功率拖大，电流按正比上升而损耗按平方上升，左下那根粉色条明显变长。看点三：把线路电阻拖大，损耗按正比上升，电压损失同时变大，读数栏的「到达用户的电压」随之下降。看点四：读数栏最后一行 <Katex tex="P^2R/U^2" /> 与「功率损失 ΔP = I²R」两行始终相等，这是同一条式子的两种写法。</p>

    <h3 class="sec" id="a3-chain">升压、输送、降压</h3>
    <p>完整的送电链分四段：发电机发出十几千伏的交流电 → 升压变压器升到高压 → 输电线上长途输送 → 降压变压器逐级降到用户电压。</p>
    <p>为什么到了用户端必须降压？高压对绝缘、安全距离、电器结构都有苛刻要求，家庭与工厂的设备只能在几百伏以内工作。降压级数按距离分配，先降到配电电压（如 10 kV），再降到 220 V 供家庭使用。</p>
    <p>变压器在整条链上每一段都满足 <Katex tex="U_1/U_2=n_1/n_2" />，功率在理想情形下守恒。这条守恒有一个重要的推论：升压侧的电流很小，降压侧的电流很大。升压变压器的线圈可以用较细的导线，降压变压器则要粗得多。</p>
    <p>整条链路的损耗要分开记：升压与降压变压器各有铜损与铁损，输电线有焦耳损耗。题目里只要给线路电阻，通常只算线路这一段，变压器按理想处理。</p>

    <h3 class="sec" id="a3-calc">算一遍：两百千瓦送出去</h3>
    <p>设输送功率 <Katex tex="P=200\ \mathrm{kW}" />，线路总电阻 <Katex tex="R=20\ \Omega" />。先用低压送：<Katex tex="U=10\ \mathrm{kV}" />。</p>
    <p style="text-align:center"><Katex tex="I=\dfrac{P}{U}=\dfrac{2\times10^5}{10^4}=20\ \mathrm A" display /></p>
    <p style="text-align:center"><Katex tex="\Delta U=IR=400\ \mathrm V,\qquad \Delta P=I^2R=8\ \mathrm{kW}" display /></p>
    <p>损耗占输送功率的 4%，电压损失 400 V，两项都不算小。换成 <Katex tex="U=110\ \mathrm{kV}" /> 再算一遍：</p>
    <p style="text-align:center"><Katex tex="I=\dfrac{2\times10^5}{1.1\times10^5}\approx 1.82\ \mathrm A,\qquad \Delta P\approx 66\ \mathrm{W}" display /></p>
    <p>损耗降到 66 W，比例约万分之三。电压提高十一倍，损耗降到约分之一百二十一，正好是平方关系。演示里把输送电压拖到这两档，读数栏给出的数与上面两段计算一致。</p>
    <p>再核一遍效率：<Katex tex="\eta=\dfrac{P-\Delta P}{P}" />。第一档为 96%，第二档为 99.97%。这正是电网宁可架高压线、也不肯把电压压低的原因。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：单位没有统一。</strong><Katex tex="I=P/U" /> 里的功率用瓦、电压用伏。题目给 kW 与 kV 时要同时换成基本单位，否则电流会差出十倍甚至百倍。</li>
        <li><strong>提示二：把功率损失写成 <Katex tex="U^2/R" />。</strong>线上损失的功率用 <Katex tex="I^2R" />，其中 <Katex tex="U" /> 指的是<strong>线路两端的电压损失</strong> <Katex tex="\Delta U" />，不是输送电压。<Katex tex="U^2/R" /> 里的 U 若代入几百千伏，会算出一个荒谬的大数。</li>
        <li><strong>提示三：认为升压之后输送的功率变大。</strong>输送功率由发电与用电两端决定，升压只减小线路电流。电压升高、电流变小，两者的乘积基本不变，变的是路上的损耗。</li>
        <li><strong>提示四：漏掉降压环节。</strong>高压送到用户附近必须先降压。若题目给出升压比与降压比，要分两段各算一次匝数比，再在中间那段线路上算损失。</li>
      </ul>
    </div>
    <p>回收与预告：本章把交流电的产生、有效值与变压器串成一条从发电机到用户的链，也把焦耳定律用在了导线本身。电磁学这一部分到此收束——从静止电荷的库仑力，到电流的磁场，到磁通量变化生出的感应电动势，再到用这套规律送电。下一部分转到光学，从光的直线传播与折射开始。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('transmit');
</script>
