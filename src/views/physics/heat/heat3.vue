<template>
  <PhysicsCh id="heat3"
    sub="上一章只用宏观量与实验现象说话，把三条定律合成 pV/T 为常量的一条式子；这个常量还与气体有多少有关，没有说清。这一章补上这一步：把质量换成物质的量，常量就写成 nR，于是得到理想气体状态方程 pV = nRT。它把三条定律收在一条式子里，也把打气、抽气这类质量在变的问题放进了同一个框架。"
    :toc="[
      { id: 'h3-model', t: '理想气体' },
      { id: 'h3-const', t: '一定质量：pV/T 为常量' },
      { id: 'h3-mole', t: '物质的量与摩尔气体常量' },
      { id: 'h3-eq', t: '理想气体状态方程' },
      { id: 'h3-var', t: '变质量问题的处理' },
      { id: 'h3-unit', t: '单位与常数的对照' },
    ]">
    <div class="note good">
      描述气体的三个状态参量满足
      <Katex tex="\dfrac{pV}{T}=nR,\qquad pV=nRT," />
      其中 <Katex tex="n" /> 是气体的<strong>物质的量</strong>（单位 mol），<Katex tex="R=8.31\ \text{J/(mol}\cdot\text{K)}" /> 是<strong>摩尔气体常量</strong>。质量不变时 <Katex tex="n" /> 不变，这条式子退成上一章的 <Katex tex="pV/T=" /> 常量；打气、抽气使气体变多或变少时，只要把 <Katex tex="n" /> 改成变化后的值，式子照样成立。
    </div>

    <h3 class="sec" id="h3-model">理想气体</h3>
    <p>真实气体的分子有大小、彼此之间有相互作用力。可是在温度不太低、压强不太大的通常条件下，分子之间的平均距离远大于分子本身的直径，分子撞上器壁之前几乎感觉不到别的分子；这时若把分子看成没有大小的质点、只计碰撞中交换的动量，算出的压强与体积关系与实际符合得相当好。这样的模型叫<strong>理想气体</strong>。</p>
    <p>理想气体是一个模型，不是某种具体的气体。它有三条约定：分子本身的大小可以忽略；除碰撞的瞬间外，分子之间没有相互作用；分子与器壁的碰撞是完全弹性的。温度越低、压强越大，气体越接近液化，分子间距缩小、相互作用显现，这三条约定越不成立，实际气体与理想气体的偏离越大。本章与上一章的定律，都以理想气体为对象。</p>

    <h3 class="sec" id="h3-const">一定质量：pV/T 为常量</h3>
    <p>上一章末尾做过一次合成。设气体从初态 <Katex tex="(p_1,V_1,T_1)" /> 出发，先等温地变成中间状态 <Katex tex="(p',V_2,T_1)" />，再等容地变成末态 <Katex tex="(p_2,V_2,T_2)" />。第一步用玻意耳定律，第二步用查理定律，两式联立消去 <Katex tex="p'" />，得到</p>
    <p style="text-align:center"><Katex tex="\frac{p_1V_1}{T_1}=\frac{p_2V_2}{T_2}." display /></p>
    <p>初态与末态是任意取的两个状态，所以对一定质量的某种气体，<Katex tex="pV/T" /> 在一切状态下都取同一个值。这里要留意的只有一点：中间那个等温、等容的过程只是为了推导，实际的气体可以从初态直接变到末态，<Katex tex="pV/T" /> 不变依旧成立。</p>
    <p>不过这个常量到底等于多少，上一章没有回答。实验显示它随气体的多少而变：同样的温度与压强下，气体的量加倍，体积也加倍，<Katex tex="pV/T" /> 跟着加倍。也就是说，这个常量是由<strong>气体的量</strong>决定的。下面这块板把一定质量下的这一族曲线画了出来：活塞来回走，点始终落在同一条双曲线上；拖 <Katex tex="n" /> 或 <Katex tex="T" />，曲线换成族里另一条。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 热3a · <b>一定质量：点沿同一条双曲线走</b>：左栏是一只带活塞的气缸，蓝点越多表示物质的量越大、跑得越快表示温度越高，活塞顶上那支橙色箭头表示压强；右栏是 p–V 图，橙色点是此刻的状态，两条淡虚线把它投影到两个轴上。看点一：活塞来回走一遍，体积在 14 L 与 42 L 之间往复，点沿同一条双曲线滑动，读数栏最后一行 <Katex tex="pV/(nT)" /> 停在 0.0821——那就是 <Katex tex="R" />。看点二：拖 n 滑块，缸里的分子数与曲线上点的位置一起变，读数栏的 p 按正比跟着变，而 <Katex tex="pV/(nT)" /> 这一行纹丝不动——常量随 n 线性增长，除掉 n 就回到 R。看点三：拖温度滑块，整条曲线上移或下移，同一个体积处压强按 T 的比例变化。看点四：n 越大，曲线越靠右上方，与「同样条件下气体越多、压强越大」一条一条对得上。</p>

    <h3 class="sec" id="h3-mole">物质的量与摩尔气体常量</h3>
    <p>为了把「气体的多少」写进式子，先约定一个计量单位。1 mol 任何物质都含有 <Katex tex="N_A=6.02\times10^{23}\ \text{mol}^{-1}" /> 个分子，这个数叫<strong>阿伏加德罗常量</strong>。于是气体的分子数 <Katex tex="N" /> 与物质的量 <Katex tex="n" /> 之间有</p>
    <p style="text-align:center"><Katex tex="n=\frac{N}{N_A}." display /></p>
    <p>接下来回答常量与 <Katex tex="n" /> 的关系。实验发现：<strong>同温同压</strong>下，相同体积的任何气体含有相同数目的分子。这条结论叫<strong>阿伏加德罗定律</strong>。取两个体积相同、温度相同、压强也相同的气体，它们的 <Katex tex="pV/T" /> 相等；由这条定律，它们的分子数相等，物质的量也相等，所以 <Katex tex="pV/T" /> 相等的充要条件就是物质的量相等。常量因此与气体的种类无关，只与 <Katex tex="n" /> 成正比：</p>
    <p style="text-align:center"><Katex tex="\frac{pV}{T}=nR." display /></p>
    <p>比例系数 <Katex tex="R" /> 对所有气体都一样，叫<strong>摩尔气体常量</strong>。它的数值可以拿标准状况下的 1 mol 气体算出来：<Katex tex="0\ ^\circ\text{C}" /> 时的热力学温度 <Katex tex="T=273.15\ \text{K}" />，压强 <Katex tex="p=1.013\times10^{5}\ \text{Pa}" />，1 mol 气体的体积 <Katex tex="V=22.4\ \text{L}=22.4\times10^{-3}\ \text{m}^3" />，代入得</p>
    <p style="text-align:center"><Katex tex="R=\frac{pV}{nT}=\frac{1.013\times10^{5}\times22.4\times10^{-3}}{1\times273.15}\approx 8.31\ \text{J/(mol}\cdot\text{K)}." display /></p>
    <p>注意它的单位。压强用帕、体积用立方米时，<Katex tex="pV" /> 的单位是焦耳，<Katex tex="nT" /> 的单位是 <Katex tex="\text{mol}\cdot\text{K}" />，合起来正是 <Katex tex="\text{J/(mol}\cdot\text{K)}" />。若压强改用标准大气压、体积改用升，同一个常量的数值换成 <Katex tex="0.0821\ \text{L}\cdot\text{atm/(mol}\cdot\text{K)}" />。两者是同一个 <Katex tex="R" />，只是单位不同，用哪一个要看其余各量取什么单位。</p>

    <h3 class="sec" id="h3-eq">理想气体状态方程</h3>
    <p>把比例式两边同乘 <Katex tex="T" />，就得到<strong>理想气体状态方程</strong>：</p>
    <p style="text-align:center"><Katex tex="pV=nRT." display /></p>
    <p>三个状态参量里任意给定两个，第三个就由它定下来；气体的物质的量改变时，把新的 <Katex tex="n" /> 代进去即可。上面那块板的读数栏最后一行 <Katex tex="pV/(nT)" /> 就是 <Katex tex="R" />，拖 n、拖 T 都推不动它，这条方程就在那一行上被反复核对。</p>
    <p>上一章的三条定律都是它在某种固定条件下的样子：<Katex tex="T" /> 不变时 <Katex tex="pV=nRT" /> 右边是常量，退成玻意耳定律；<Katex tex="p" /> 不变时 <Katex tex="V/T=nR/p" /> 为常量，退成盖-吕萨克定律；<Katex tex="V" /> 不变时 <Katex tex="p/T=nR/V" /> 为常量，退成查理定律。</p>
    <p>把 <Katex tex="n=m/M" />（<Katex tex="m" /> 为质量、<Katex tex="M" /> 为摩尔质量）代进去，方程还能写成质量的形式：</p>
    <p style="text-align:center"><Katex tex="pV=\frac{m}{M}RT." display /></p>
    <p>两边同除以 <Katex tex="V" />，左端就是密度 <Katex tex="\rho=m/V" />，于是</p>
    <p style="text-align:center"><Katex tex="\rho=\frac{pM}{RT}." display /></p>
    <p>这个式子说明：同温同压下，气体的密度与摩尔质量成正比。空气的平均摩尔质量约 <Katex tex="29\ \text{g/mol}" />，氢气的只有 <Katex tex="2\ \text{g/mol}" />，同样条件下氢气的密度不到空气的十四分之一，这就是氢气球能升空的道理。</p>

    <h3 class="sec" id="h3-var">变质量问题的处理</h3>
    <p>上一章反复强调「一定质量」，因为三条定律里的常量都跟着质量变。状态方程把 <Katex tex="n" /> 写成了显式的量，质量变化时不必再绕开，只要把变化前后的 <Katex tex="n" /> 分别写出来。处理的办法有两条。</p>
    <p>第一条是把<strong>参与变化的所有气体</strong>当成一个整体。向储气罐里打气，罐里原有的气体与打进去的气体合在一起，物质的总量 <Katex tex="n=n_0+k\,n_1" />（打进 <Katex tex="k" /> 次、每次 <Katex tex="n_1" />）；温度与罐的容积都不变，于是</p>
    <p style="text-align:center"><Katex tex="p=\frac{(n_0+k\,n_1)RT}{V}." display /></p>
    <p>压强随打气次数按一次函数上升，图线是一条直线。下面这块板画的就是这一步：储气罐固定 20 L，原有 0.5 mol，打气筒每压一下打进 0.1 mol，罐内的蓝点随之变密，右栏的橙色点沿一条直线向右上方走，读数栏里 <Katex tex="n" /> 与 <Katex tex="p" /> 一起增加，而 <Katex tex="pV/(nT)" /> 停在 0.0821 不动。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 热3b · <b>打气：把 n 写成显式的量</b>：左栏上面是打气筒、下面是储气罐，罐内的蓝色小点是已经进去的分子；右栏横轴是打气次数、纵轴是压强，蓝线画的是 p 随打气次数的变化。看点一：打气筒每压一下，就有 0.1 mol 气体被送进罐内，罐里的蓝点随之变密，<Katex tex="n" /> 从 0.5 mol 涨到 1.7 mol，读数栏的 n 一行跟着走。看点二：橙点沿一条不过原点的直线向右上走——罐内原有的 0.5 mol 已经给出不为零的起点，每多打一次就在直线上挪出等距的一小段，这正是 <Katex tex="p=(n_0+k\,n_1)RT/V" /> 的一次函数。看点三：打满 12 次以后停一会儿，再从 0.5 mol 重打一遍，最后一行 <Katex tex="pV/(nT)" /> 始终是 0.0821，与上一块板一字不差——质量在变，把变化后的 n 代进状态方程，它照样成立。看点四：拖温度滑块，纵轴的刻度整体换一档、每打一次压强增加的量也随之改变，但直线相对画框的形状与位置不动——温度改的是数值大小，不改变「p 与打气次数成一次函数」这一条。</p>
    <p>第二条是<strong>分部分列式</strong>。两部分气体在混合前后的状态各自写一条状态方程，再按「总物质的量等于各部分之和」相加。抽气、气体混合、两部分气体经活塞连通，都可以这样处理。两条办法的实质相同：状态方程对<strong>每一部分气体</strong>都成立，只要把它的 <Katex tex="n" /> 写对，就不必担心质量变没变。</p>

    <h3 class="sec" id="h3-unit">单位与常数的对照</h3>
    <p>代入数值之前，先核对单位。状态方程两边都是能量量纲：<Katex tex="pV" /> 是焦耳，<Katex tex="nRT" /> 中 <Katex tex="n" />、<Katex tex="R" />、<Katex tex="T" /> 乘起来也是焦耳。两种常用配法如下。</p>
    <p>国际单位制：压强用帕、体积用立方米、温度用开尔文，<Katex tex="R=8.31\ \text{J/(mol}\cdot\text{K)}" />。生活与工程里：压强用标准大气压、体积用升，<Katex tex="R=0.0821\ \text{L}\cdot\text{atm/(mol}\cdot\text{K)}" />。两种配法各自自洽，但不可交叉：把帕与升放在一起，体积少乘了一千倍，算出的 <Katex tex="pV" /> 会小三个数量级。</p>
    <p>温度一律用热力学温度。摄氏温度只在查表、读题的场合出现，代进式子之前要先加 <Katex tex="273.15" />。演示里的温度滑块给的就是热力学温度，右栏读数与它同一套单位。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：温度用摄氏度。</strong>状态方程里的 <Katex tex="T" /> 是热力学温度，零点是 <Katex tex="-273.15\ ^\circ\text{C}" />。把 <Katex tex="27\ ^\circ\text{C}" /> 的 <Katex tex="27" /> 直接代进 <Katex tex="pV=nRT" />，结果只有正确值的一成左右。凡给出摄氏温度，第一步一律换算成 <Katex tex="T=t+273.15" />。</li>
        <li><strong>提示二：单位交叉使用。</strong>帕配立方米、大气压配升，两套各自自洽。把大气压与立方米、或帕与升混着用，就是少乘或多乘了一千倍；换算完成之前不要急着代数字。</li>
        <li><strong>提示三：变质量问题仍套 <Katex tex="pV/T=" /> 常量。</strong>漏气、打气、两部分气体混合时，常量本身已经变了，直接套比例式必然出错。办法是把参与变化的气体当作一个整体，或分部分各列一条状态方程——看的是 <Katex tex="n" /> 怎么变，不是硬记一条比例式。</li>
        <li><strong>提示四：把阿伏加德罗定律读成「质量相同」。</strong>同温同压同体积，相同的是<strong>分子数</strong>（因而物质的量相同），质量并不相同：氧气的摩尔质量是氢气的十六倍，同样一瓶氧气的质量就是同样一瓶氢气的十六倍。密度公式 <Katex tex="\rho=pM/(RT)" /> 说的正是这件事。</li>
      </ul>
    </div>
    <p>回收与预告：这一章把上一章的三条实验定律收进 <Katex tex="pV=nRT" />，并交代了常量 <Katex tex="R" /> 为什么对一切气体都一样——因为气体的量由分子数计量，同温同压同体积就同分子数。到这里，气体的状态已经能用一条式子算清楚。下一章换一个角度：气体被压缩、被加热时，外界对它做功、它与外界交换热量，这些能量与内能之间是什么关系，由热力学第一定律回答。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('idealgasState');
const DEMO2 = demoOf('idealgasPump');
</script>
