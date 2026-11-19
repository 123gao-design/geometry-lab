<template>
  <PhysicsCh id="ind4"
    sub="前面三章讲的是「磁场变化产生电流」。把这件事装进一个可以算的模型里，就成了导体棒与导轨：棒动则磁通量变，磁通量变则生电流，电流在磁场中又受力，力反过来改运动。一条链子首尾相接，力学与电磁学的规律在这里汇到一处。"
    :toc="[
      { id: 'i4-chain', t: '模型与三条定律的接力' },
      { id: 'i4-given', t: '给初速度：速度的指数衰减' },
      { id: 'i4-force', t: '恒力拉动：收尾速度' },
      { id: 'i4-energy', t: '能量从哪里来、到哪里去' },
    ]">
    <div class="note good">
      一根长为 <Katex tex="L" /> 的导体棒横放在两条平行导轨上，导轨左端接电阻 <Katex tex="R" />，整个装置处在与导轨平面垂直的匀强磁场 <Katex tex="B" /> 中。棒以速度 <Katex tex="v" /> 运动时有 <Katex tex="E=BLv" />、<Katex tex="I=BLv/R" />、<Katex tex="F_A=B^2L^2v/R" />，安培力的方向恒与运动方向相反。给初速度时速度按 <Katex tex="v=v_0e^{-t/\tau}" /> 衰减，<Katex tex="\tau=mR/(B^2L^2)" />；恒力拉动时速度按 <Katex tex="v=v_t(1-e^{-t/\tau})" /> 上升，收尾速度 <Katex tex="v_t=FR/(B^2L^2)" />。
    </div>

    <h3 class="sec" id="i4-chain">模型与三条定律的接力</h3>
    <p>这套装置之所以值得单独列一章，在于它把一个物理量交给下一个物理量，环环相扣，每一步用一条已经学过的定律：</p>
    <p>① <strong>法拉第定律</strong>：棒切割磁感线，回路面积以 <Katex tex="Lv" /> 的速率变化，电动势 <Katex tex="E=BLv" />；② <strong>闭合电路欧姆定律</strong>：回路电流 <Katex tex="I=E/R=BLv/R" />，方向由楞次定律判断；③ <strong>安培力公式</strong>：通电棒在磁场中受力 <Katex tex="F_A=BIL=B^2L^2v/R" />，方向由左手定则判断。</p>
    <p>前两步给出「电」，第三步把电送回「力」。楞次定律保证了 <Katex tex="F_A" /> 始终与 <Katex tex="v" /> 反向——一旦它同向，棒就会自己越跑越快，能量凭空产生。这一步不需要再验算，楞次定律本身就交代了方向。</p>
    <p>把安培力代进牛顿第二定律，就得到这个模型的两条运动方程：给初速度时 <Katex tex="ma=-F_A" />，恒力拉动时 <Katex tex="ma=F-F_A" />。两条方程的右边都是速度的一次函数，解出来都是指数规律，时间常数同为 <Katex tex="\tau=mR/(B^2L^2)" />。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电14 · <b>导体棒在导轨上：力与电的往返</b>：左栏是导轨、导体棒与左端电阻，叉号表示磁场垂直纸面向里，绿色小点是回路电流，棒上方的绿箭头是速度、下方的橙箭头是安培力。看点一：第一档中棒一起跑，电流立刻出现、安培力立刻指向左侧，速度逐渐衰减，电流与安培力跟着一起衰减，绿点越来越慢直至停住。看点二：第二档中棒从静止起步，安培力由零增大，与恒力 F 的差值越来越小，加速度随之减小；右栏的紫色虚线标出收尾速度。看点三：读数栏的「感应电动势」「电流」「安培力」三行始终严格按 <Katex tex="BLv" />、<Katex tex="BLv/R" />、<Katex tex="B^2L^2v/R" /> 变化，拖这几根滑块可以逐项核对。看点四：把磁感应强度拖大，两个档的变化都变快、收尾速度变小；把棒的质量拖大，两个档都变得迟钝，时间常数变长。</p>

    <h3 class="sec" id="i4-given">给初速度：速度的指数衰减</h3>
    <p>先看没有外力的情形：棒在某一时刻已经具有速度 <Katex tex="v_0" />，此后只受安培力。运动方程是</p>
    <p style="text-align:center"><Katex tex="m\dfrac{\Delta v}{\Delta t}=-\dfrac{B^2L^2}{R}v" display /></p>
    <p>这是一个标准的指数衰减方程，解为 <Katex tex="v=v_0e^{-t/\tau}" />，时间常数 <Katex tex="\tau=\dfrac{mR}{B^2L^2}" />。速度不会突变到零，而是越衰减越慢地把余下的位移走完。</p>
    <p>把速度对时间积分，得到总位移 <Katex tex="s=v_0\tau=\dfrac{mRv_0}{B^2L^2}" />。这个结果很值得留意：从起跑点到停下的距离是<strong>有限</strong>的，与初速度成正比。磁感应强度越大、回路电阻越小，棒越快停下来、滑得越近。</p>
    <p>棒停下之后，回路里没有电流，安培力消失，一切归于静止。整个过程中初动能全部变成电阻里的焦耳热，可以用能量守恒核一遍：<Katex tex="\tfrac12mv_0^2=\int I^2R\,\mathrm dt" />，两边的值相等。</p>

    <h3 class="sec" id="i4-force">恒力拉动：收尾速度</h3>
    <p>再看另一端：棒从静止开始，受到一个恒定的外力 <Katex tex="F" /> 向右拉，同时受安培力向左。运动方程是</p>
    <p style="text-align:center"><Katex tex="m\dfrac{\Delta v}{\Delta t}=F-\dfrac{B^2L^2}{R}v" display /></p>
    <p>速度越高，安培力越大，合力越小，加速度越小。当安培力增大到与 <Katex tex="F" /> 相等时，合力为零，速度不再增加——这就是<strong>收尾速度</strong>，由 <Katex tex="F=\dfrac{B^2L^2}{R}v_t" /> 解出</p>
    <p style="text-align:center"><Katex tex="v_t=\dfrac{FR}{B^2L^2}" display /></p>
    <p>解的完整形式是 <Katex tex="v=v_t\left(1-e^{-t/\tau}\right)" />，与电容充电、自感电流上升的形状完全相同——三者都是「一个量与它自己的阻碍成比例」的一阶过程，数学上是一回事。</p>
    <p>收尾之后棒做匀速运动，外力做的功全部变成电阻里的焦耳热，机械能不再增加。此时电功率 <Katex tex="P=Fv_t=\dfrac{F^2R}{B^2L^2}" />，与 <Katex tex="I^2R" /> 一致。</p>

    <h3 class="sec" id="i4-energy">能量从哪里来、到哪里去</h3>
    <p>这套模型最容易出错的地方在能量，而不在公式。安培力对棒做负功，棒把机械能交出去；这部分能量变成回路的电能，最终在电阻上化作焦耳热。链条是：机械能 → 电能 → 内能。</p>
    <p>给初速度的档里，整条链条从初动能开始，到停止时全部变成热；恒力档里，外力做的功一部分变成棒的动能、一部分变成焦耳热，收尾之后全部变成热。两种情形的账都可以用 <Katex tex="W_F=\Delta E_k+Q" /> 统一记账。</p>
    <p>另一个容易混淆的说法是「安培力做功等于电流做的功」。安培力对棒做负功，其绝对值恰好等于回路里的电功，两者大小相等、符号相反。把这一点写清楚，能量账就不会错。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把棒的速度当成恒定来算。</strong>只有收尾之后速度才恒定，此前 <Katex tex="E" />、<Katex tex="I" />、<Katex tex="F_A" /> 都在变。要求某一时刻的值，先由 <Katex tex="v(t)" /> 求出该时刻的速度，再逐项代入。</li>
        <li><strong>提示二：认为安培力与速度无关。</strong><Katex tex="F_A=B^2L^2v/R" /> 与速度成正比，正是这个「随速度增大」的性质让恒力档存在收尾速度、让初速度档存在有限的滑行距离。</li>
        <li><strong>提示三：忘记 <Katex tex="\tau" /> 里面积与电阻的位置。</strong><Katex tex="\tau=mR/(B^2L^2)" />，分子是质量与电阻，分母是 <Katex tex="B" /> 与 <Katex tex="L" /> 的平方。量纲上 <Katex tex="(\text{kg}\cdot\Omega)/\text{T}^2\text{m}^2" /> 应为秒，可以自行核验。</li>
        <li><strong>提示四：把收尾速度当成「最大速度」写进所有题目。</strong>只有在恒定外力、恒定磁场的条件下才有稳态的收尾速度；外力撤去后棒一定停下，不存在继续匀速的可能。</li>
      </ul>
    </div>
    <p>回收与预告：本章把前面几章串成了一条完整的链，从磁通量变化一路算到运动与能量。下一章换一个方向：让线圈在匀强磁场里匀速转动，磁通量按正弦变化，感应电动势也跟着按正弦变化——这就是交流电的产生。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('railrod');
</script>
