<template>
  <PhysicsCh id="heat2"
    sub="上一章把气体拆成大量分子，说明温度是分子平均动能的标志、压强来自分子撞击器壁。这一章换一个方向：不去数分子，只盯住气体的三个宏观量——压强、体积与温度，看它们之间有什么定量的联系。办法是把其中一个量按住不动，考察另外两个量怎样互相牵制，于是得到三条实验定律。三条定律最后可以合成一条式子，气体的一切状态变化都写在它里面。"
    :toc="[
      { id: 'h2-state', t: '气体的状态参量' },
      { id: 'h2-boyle', t: '等温变化：玻意耳定律' },
      { id: 'h2-isobar', t: '等压变化：盖-吕萨克定律' },
      { id: 'h2-isochor', t: '等容变化：查理定律' },
      { id: 'h2-graphs', t: '三种变化的图线' },
      { id: 'h2-combine', t: '三条定律合起来' },
    ]">
    <div class="note good">
      描述一定质量的气体需要三个<strong>状态参量</strong>：压强 <Katex tex="p" />、体积 <Katex tex="V" />、热力学温度 <Katex tex="T" />。把其中一个按住不变，另外两个之间就有一条定量关系：<strong>玻意耳定律</strong>（<Katex tex="m" />、<Katex tex="T" /> 一定）给出 <Katex tex="pV=\text{常量}" />，<strong>盖-吕萨克定律</strong>（<Katex tex="m" />、<Katex tex="p" /> 一定）给出 <Katex tex="\dfrac{V}{T}=\text{常量}" />，<strong>查理定律</strong>（<Katex tex="m" />、<Katex tex="V" /> 一定）给出 <Katex tex="\dfrac{p}{T}=\text{常量}" />。三条合起来就是
      <Katex tex="\frac{pV}{T}=\text{常量}." />
      这里的温度一律用<strong>热力学温度</strong>，以开尔文为单位。
    </div>

    <h3 class="sec" id="h2-state">气体的状态参量</h3>
    <p>气体装在容器里，它占了多大地方、把器壁压得多紧、有多热，这三件事合起来就把它的状态说尽了。对应的三个量分别是体积 <Katex tex="V" />、压强 <Katex tex="p" /> 与温度 <Katex tex="T" />，叫气体的<strong>状态参量</strong>。</p>
    <p>体积指气体所能充满的那部分空间，也就是容器的容积，单位是立方米。一定质量的气体总能充满整个容器，所以它的体积由容器决定，不是分子自身体积之和——这一点上一章讲过，气体分子之间的空隙远大于分子本身。</p>
    <p>压强来自分子对器壁的持续撞击。把气体封闭在气缸里，缸内的分子不停地撞活塞与缸壁，这些撞击的宏观效果就是气体对器壁的压力。压强等于单位面积上的压力，单位是帕斯卡，<Katex tex="1\ \text{atm}=1.013\times10^{5}\ \text{Pa}" />。</p>
    <p>温度必须用<strong>热力学温度</strong> <Katex tex="T" />，单位是开尔文。热力学温度与熟悉的摄氏温度 <Katex tex="t" /> 只差一个零点：</p>
    <p style="text-align:center"><Katex tex="T=t+273.15\ \text{K}." display /></p>
    <p>为什么要换温标？后面的定律里会出现「体积与温度成正比」这类话，正比关系要求零点选得对。摄氏温度的零点是冰水混合物的温度，不是「没有热」的地方；只有从热力学温度的零点量起，<Katex tex="V" /> 与 <Katex tex="T" /> 之间才是一条过原点的直线。演示里的温度滑块给的就是热力学温度。</p>

    <h3 class="sec" id="h2-boyle">等温变化：玻意耳定律</h3>
    <p>先按住温度不动。把一定质量的气体封在气缸里，让活塞缓慢地推入或拉出，同时维持温度不变——推拉得足够慢，气体来得及与外界交换热量，温度就不会因为压缩而升高。这时体积变小，压强随之变大。</p>
    <p>实验测下来，压强与体积的乘积几乎不随压缩而变。这就是<strong>玻意耳定律</strong>：一定质量的气体，在温度不变时，</p>
    <p style="text-align:center"><Katex tex="pV=\text{常量},\qquad p_1V_1=p_2V_2." display /></p>
    <p>写成反比的形式更直观：<Katex tex="p=C/V" />，压强与体积成反比。体积减半，压强加倍；体积缩小到三分之一，压强变成三倍。把活塞推到底，缸内分子被挤在一小块地方，撞到器壁的机会成倍增加，橙色那支压强箭头随之变长，而读数栏最后一行 <Katex tex="pV/T" /> 一直停在原处。下面这块板画的就是这一条：温度按住不动，活塞来回走一遍，右栏的橙色点始终落在同一条双曲线上。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 热2a · <b>等温变化：玻意耳定律</b>：左栏一只带活塞的气缸，蓝色小点是缸内分子，活塞顶上那支橙色箭头表示气体对活塞的压强；右栏是 p–V 图，橙色点是此刻的气体状态，两条淡虚线把它投影到两个轴上。看点一：活塞缓慢压下，体积从 42 L 缩到 14 L，橙色箭头随之变长，右栏的点沿双曲线向左上方滑，体积缩到三分之一，压强正好变成三倍。看点二：活塞来回走一整遍，读数栏的温度一行纹丝不动、最后一行 <Katex tex="pV/T" /> 停在 0.0821——乘积 <Katex tex="pV" /> 不变，这就是玻意耳定律。看点三：把温度滑块拖高，整条曲线向外移，同一个体积下压强变大；拖低则向内收。看点四：曲线两端都贴着坐标轴却始终不相交，压缩得再紧也不会与纵轴交叉。</p>
    <p>乘积 <Katex tex="pV" /> 的大小由温度与气体质量决定：温度越高、气体越多，这个常量越大。所以在同一张 <Katex tex="p" />–<Katex tex="V" /> 图上，不同的温度对应不同的曲线，越靠右上方的曲线温度越高。</p>

    <h3 class="sec" id="h2-isobar">等压变化：盖-吕萨克定律</h3>
    <p>换一个量按住：让活塞自由上下，缸内压强始终等于外界大气压，这样压强不变。此时给气体加热，体积随之膨胀；冷却则收缩。</p>
    <p>实验给出的是摄氏温度下的线性关系：以 <Katex tex="0\ ^\circ\text{C}" /> 时的体积 <Katex tex="V_0" /> 为基准，温度为 <Katex tex="t" /> 时的体积为</p>
    <p style="text-align:center"><Katex tex="V_t=V_0\left(1+\frac{t}{273}\right)." display /></p>
    <p>把括号里的式子通分，<Katex tex="1+t/273=(273+t)/273=T/T_0" />，其中 <Katex tex="T_0=273\ \text{K}" /> 正好是 <Katex tex="0\ ^\circ\text{C}" /> 对应的热力学温度。于是上式变成 <Katex tex="V_t=V_0\cdot\dfrac{T}{T_0}" />，也就是体积与热力学温度成正比：</p>
    <p style="text-align:center"><Katex tex="\frac{V}{T}=\text{常量},\qquad \frac{V_1}{T_1}=\frac{V_2}{T_2}." display /></p>
    <p>这就是<strong>盖-吕萨克定律</strong>：一定质量的气体，在压强不变时，体积与热力学温度成正比。摄氏式里那个 <Katex tex="273" /> 的来历也在这一步交代清楚了——它实际上是 <Katex tex="T_0" /> 换算成摄氏度时的数值，并非另行约定的常数。下面这块板把这条正比关系画了出来：活塞背着大气压自由上下，温度一升，右栏的橙色点就沿一条过原点的直线向右上方走。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 热2b · <b>等压变化：盖-吕萨克定律</b>：气缸与上一块板相同，这一块的活塞自由浮动，缸内压强由压强滑块给定、保持不变；右栏换成 V–T 图。看点一：温度升高，体积沿一条过原点的直线上升，两条淡虚线把橙色点投影到两轴，读数栏的 <Katex tex="V" /> 与 <Katex tex="T" /> 正是虚线端点的数。看点二：直线左端正好落在原点，把温度一路降下去，体积按 <Katex tex="V=(R/p)T" /> 同步缩到零——换成摄氏温度，这条直线就不过原点了。看点三：拖压强滑块，整条直线变陡或变缓：压强越大，同样温度下的体积越小，线越平；过原点这一点始终不动。看点四：压强一行无论怎么拖都是滑块给的数，读数栏最后一行 <Katex tex="pV/T" /> 仍停在 0.0821。</p>

    <h3 class="sec" id="h2-isochor">等容变化：查理定律</h3>
    <p>最后一种固定法：把活塞锁死，让体积不变。给气体加热，缸内分子跑得更快、撞得更狠，压强随之升高。</p>
    <p>与上一条完全平行，摄氏式先写成</p>
    <p style="text-align:center"><Katex tex="p_t=p_0\left(1+\frac{t}{273}\right)," display /></p>
    <p>同样通分换成热力学温度，得到<strong>查理定律</strong>：一定质量的气体，在体积不变时，</p>
    <p style="text-align:center"><Katex tex="\frac{p}{T}=\text{常量},\qquad \frac{p_1}{T_1}=\frac{p_2}{T_2}." display /></p>
    <p>这块板里活塞位置由体积滑块锁死，温度升高时缸内分子跑得更快，橙色压强箭头一点点变长，而读数栏的体积一行纹丝不动。温度升，右栏的橙色点沿过原点的直线向上爬。把这条直线延长下去，温度降到零时压强也降到零；真实的气体到不了那一步——它早已液化，定律不再适用。</p>

    <PhysicsDemo :def="DEMO3" />
    <p class="cap">图 热2c · <b>等容变化：查理定律</b>：活塞被锁死，体积由滑块给定；右栏换成 p–T 图。看点一：加热时温度升高，压强沿一条过原点的直线上升，橙色箭头随之变长，缸内分子也跑得更快，读数栏的体积一行始终不动。看点二：拖体积滑块，直线的陡缓跟着变——体积越小，同样温度下压强越大、直线越陡；无论哪一条，都从原点出发。看点三：读数栏最后一行 <Katex tex="pV/T" /> 仍是 0.0821，与上面两块板一字不差——三条定律是同一个式子在不同固定条件下的样子。</p>

    <h3 class="sec" id="h2-graphs">三种变化的图线</h3>
    <p>把三条定律各自画到对应的图上，形状一目了然，而且两条正比关系都体现为<strong>过原点的直线</strong>。</p>
    <p><Katex tex="p" />–<Katex tex="V" /> 图上，<Katex tex="p=C/V" /> 是一条双曲线。压缩时状态点沿曲线向左上方爬，体积变小、压强变大，曲线两端都与坐标轴越来越近却不相交。<Katex tex="V" />–<Katex tex="T" /> 图上，<Katex tex="V=kT" /> 是一条过原点的直线；<Katex tex="p" />–<Katex tex="T" /> 图上同样是一条直线。后两张图里，同一条直线上的所有点对应同一个压强（或同一个体积），不同的直线对应不同的压强（或体积）。</p>
    <p>上面三块板各画了一张这样的图：橙色点就是缸内气体此刻的状态，两条淡虚线把它投影到两个轴上，读数栏里此刻的 <Katex tex="V" />、<Katex tex="p" />、<Katex tex="T" /> 就在这两条虚线的端点处。三块板的驱动量都在自动往复，点沿曲线或直线走一遍，整条关系线也就跟着看全了；再拖各自那根滑块，曲线或直线就换成族里另一条。</p>

    <h3 class="sec" id="h2-combine">三条定律合起来</h3>
    <p>把三条定律摆在一起，会发现它们只差一个被固定的量。要合成一条式子，取一个中间状态：设气体从初态 <Katex tex="(p_1,V_1,T_1)" /> 出发，先等温地变成 <Katex tex="(p',V_2,T_1)" />，再等容地变成末态 <Katex tex="(p_2,V_2,T_2)" />。第一步温度不变，用玻意耳定律：</p>
    <p style="text-align:center"><Katex tex="p_1V_1=p'V_2;" display /></p>
    <p>第二步体积不变，用查理定律：</p>
    <p style="text-align:center"><Katex tex="\frac{p'}{T_1}=\frac{p_2}{T_2},\qquad p'=\frac{p_2T_1}{T_2}." display /></p>
    <p>把第二式代进第一式，整理得</p>
    <p style="text-align:center"><Katex tex="\frac{p_1V_1}{T_1}=\frac{p_2V_2}{T_2}." display /></p>
    <p>两端的状态可以任意取，所以对一定质量的气体，<Katex tex="pV/T" /> 在一切状态下都取同一个值。</p>
    <p style="text-align:center"><Katex tex="\frac{pV}{T}=C." display /></p>
    <p>这条式子把三条定律收在了一处：<Katex tex="T" /> 不变时它退化成 <Katex tex="pV=C" />，<Katex tex="p" /> 不变时退化成 <Katex tex="V/T=C/p" />，<Katex tex="V" /> 不变时退化成 <Katex tex="p/T=C/V" />。上面三块板的读数栏最后一行都是这个 <Katex tex="pV/T" />，活塞怎么拖、各自的滑块怎么改，它都停在 <Katex tex="0.0821" /> 上——三块板给出的是同一个常量，这正是三条定律能合成一条式子的原因。那是 <Katex tex="1\ \text{mol}" /> 气体在这个演示所取单位下的常数。</p>
    <p>常量 <Katex tex="C" /> 与气体种类和质量有关。下一章把它换成更通用的形式 <Katex tex="pV=nRT" />，并说明 <Katex tex="R" /> 为什么是一个与气体种类无关的普适常量。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：温度用了摄氏度。</strong>三条定律里的温度一律是<strong>热力学温度</strong>。把 <Katex tex="27\ ^\circ\text{C}" /> 直接当 <Katex tex="27" /> 代进 <Katex tex="V_1/T_1=V_2/T_2" />，结果会错得离谱：正确做法是先换成 <Katex tex="300\ \text{K}" />。等温与等压、等容这三条里，只有前者不出现温度比，摄氏温度碰巧不影响乘积，但那条也要按温度不变来理解。</li>
        <li><strong>提示二：以为定律对任何温度与压强都成立。</strong>三条定律都是<strong>实验规律</strong>，只在「温度不太低、压强不太大」的范围内足够准。温度逼近气体的液化温度、压强高到几十个大气压时，实测值会明显偏离，真实气体不是理想气体。演示里把压强箭头拉得很长、温度拖得很低，都只是示意，不代表定律真的延伸到那里。</li>
        <li><strong>提示三：忽略了「一定质量」这个前提。</strong>三条定律与合成式的前提都是气体的<strong>质量不变</strong>。漏气、充气、两团气体混合时，<Katex tex="pV/T" /> 的常量本身就会变，这时代进比例式必然出错，必须分别处理各部分气体。</li>
        <li><strong>提示四：把等压变化当成体积与摄氏温度成正比。</strong>体积与热力学温度成正比，与摄氏温度却是 <Katex tex="V_t=V_0(1+t/273)" /> 这样的线性关系，截距不为零。图线上画在 <Katex tex="V" />–<Katex tex="t" /> 坐标系里的是一条不经过原点的斜线，延长后与横轴交于 <Katex tex="-273\ ^\circ\text{C}" />；画在 <Katex tex="V" />–<Katex tex="T" /> 坐标系里才过原点。</li>
      </ul>
    </div>
    <p>回收与预告：上一章从分子图像推出了「温度是分子平均动能的标志」「压强来自分子撞击器壁」，这一章回过头来只用宏观量说话，把这三者的联系写成三条实验定律，并合成一条 <Katex tex="pV/T=\text{常量}" />。两条路在这里还接不上：一条起点是分子，一条起点是实验。下一章补上这一步——用分子撞击器壁的模型把压强算出来，说明 <Katex tex="pV/T" /> 那个常量为什么对一切气体都一样，从而得到理想气体状态方程。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('gaslawsBoyle');
const DEMO2 = demoOf('gaslawsIsobar');
const DEMO3 = demoOf('gaslawsIsochor');
</script>
