<template>
  <PhysicsCh id="momentum1"
    sub="上一组把「力在空间上的累积」做成了功，用动能定理结算。还有一个方向可以累积：力在时间上的累积。这一章把 Ft 定义成冲量，把 mv 定义成动量，得到 I = Δp —— 合外力的冲量等于动量的变化。它与牛顿第二定律等价，却把一个复杂过程压成首末两个状态的差，处理碰撞、打击这类力随时间剧烈变化的问题时尤其顺手。"
    :toc="[
      { id: 'm1-impulse', t: '冲量与动量' },
      { id: 'm1-theorem', t: '动量定理的推导' },
      { id: 'm1-buffer', t: '缓冲与平均作用力' },
      { id: 'm1-use', t: '应用与解题' },
    ]">
    <div class="note good">
      力 <Katex tex="F" /> 作用时间 <Katex tex="t" />，积累出<strong>冲量</strong> <Katex tex="I=Ft" />；质量 <Katex tex="m" /> 的物体以速度 <Katex tex="v" /> 运动，携带着<strong>动量</strong> <Katex tex="p=mv" />。两者之间的关系是
      <Katex tex="I=\Delta p" />，写成首末两态即 <Katex tex="F\,t=mv_2-mv_1" />。冲量与动量都是矢量，方向与力、速度一致；<Katex tex="\Delta p" /> 是矢量差而不是大小之差。当力随时间变化时，冲量取 <Katex tex="F\text{-}t" /> 图象与时间轴围成的面积，定理照旧成立。
    </div>

    <h3 class="sec" id="m1-impulse">冲量与动量</h3>
    <p>先从一个常见的疑问开始。同样大小的力推一辆车，推一秒与推十秒，效果显然不同；同样速度滚来的两只球，重的比轻的难拦下。前一件事说明<strong>力要起作用，必须经过一段时间</strong>，后一件事说明<strong>运动的「难停下程度」不只是速度，还与质量有关</strong>。物理上把这两个量各起一个名字，正好配对。</p>
    <p>力 <Katex tex="F" /> 作用时间 <Katex tex="t" /> 的累积量叫冲量：</p>
    <p style="text-align:center"><Katex tex="I=F\,t." display /></p>
    <p>冲量是矢量，方向与力的方向相同；单位是牛·秒，记作 <Katex tex="\text{N}\cdot\text{s}" />。上式只对恒力成立。若力在过程中不断变化，就把整个过程切成许多极短的时间段，每一段内力近似不变，本段的冲量是 <Katex tex="F_i\Delta t_i" />，全体加起来即总冲量。落到图象上，这一步的意思很直白：<strong><Katex tex="F\text{-}t" /> 图象中力曲线与时间轴之间围成的面积（按力的正负取有向面积），就是这段时间内的冲量</strong>。恒力对应一块矩形，面积 <Katex tex="Ft" />；变力对应一块形状不规则的图块，面积照旧代表冲量。</p>
    <p>质量与速度的乘积叫动量：</p>
    <p style="text-align:center"><Katex tex="p=mv." display /></p>
    <p>动量也是矢量，方向与速度相同，单位是千克·米每秒 <Katex tex="\text{kg}\cdot\text{m/s}" />，与牛·秒是同一个量纲。定量的理由要等下一节才显出来，这里先交代它与动能的区别：动能 <Katex tex="E_k=\tfrac12mv^2" /> 是标量，取正不取负；动量是矢量，方向就是运动方向。两者的数值由同一个 <Katex tex="m" /> 与 <Katex tex="v" /> 决定，可以互推，</p>
    <p style="text-align:center"><Katex tex="p=\sqrt{2mE_k}," display /></p>
    <p>但它们在物理上回答的是不同的问题：动能衡量「运动能做多少功」，动量衡量「运动要花多少时间与力才能被改变」。两个物体的动量大小相等时，质量大的那个速度小、动能也小；反过来也一样。<strong>不能把动量与动能互相替代</strong>，一道题问什么，就选与之配对的那一条定理。</p>
    <p>动量的变化量是矢量差 <Katex tex="\Delta p=p_2-p_1" />，这一点最容易出错。设小球以速率 <Katex tex="v" /> 垂直撞墙后原速弹回，取初速度方向为正，则 <Katex tex="v_1=+v" />、<Katex tex="v_2=-v" />，于是 <Katex tex="\Delta p=m(-v)-mv=-2mv" />，大小为 <Katex tex="2mv" />，而不是零。速度大小没变，方向反了，动量就变了整整 2 倍。若按「大小之差」去算，会得到零，也就得不出墙对球施加了冲量这个结论。</p>

    <h3 class="sec" id="m1-theorem">动量定理的推导</h3>
    <p>把牛顿第二定律在时间上累积一步，就得到这一章的主结论。设物体质量 <Katex tex="m" /> 恒定，受恒定的合外力 <Katex tex="F" />，做直线运动，经过时间 <Katex tex="t" /> 速度由 <Katex tex="v_1" /> 变为 <Katex tex="v_2" />。牛顿第二定律给出加速度 <Katex tex="a=(v_2-v_1)/t" />，代入 <Katex tex="F=ma" />：</p>
    <p style="text-align:center"><Katex tex="F=m\frac{v_2-v_1}{t}." display /></p>
    <p>两边同乘 <Katex tex="t" />，就得到</p>
    <p style="text-align:center"><Katex tex="F\,t=mv_2-mv_1," display /></p>
    <p>即<strong>合外力的冲量等于动量的变化</strong>：</p>
    <p style="text-align:center"><Katex tex="I_{\text{合}}=\Delta p." display /></p>
    <p>这条式子叫动量定理。推导时用了两个条件——恒力、直线运动——但结论比推导过程宽得多。变力时把过程切成小段，每段内近似恒力，逐段写式再相加：每段的冲量 <Katex tex="F_i\Delta t_i" /> 相加就是总冲量，每段的动量变化相加，中间各项两两抵消，只剩首末两态之差。曲线运动同理，把速度按方向拆开处理，两边的矢量加法都成立。所以动量定理的普遍形式是</p>
    <p style="text-align:center"><Katex tex="\sum F_i\Delta t_i=\Delta p," display /></p>
    <p>也就是「力的冲量的矢量和等于动量的变化」。平面内的二维问题可以拆成两条标量式，两个方向各写一遍、各带各的符号，最后再合成。</p>
    <p>把动量定理与牛顿第二定律放在一起看，会发现它们说的是同一件事。<Katex tex="F=ma" /> 描述的是<strong>每一时刻</strong>力与加速度的对应关系，要把运动算出来必须逐时刻推下去；动量定理把它沿时间积分一遍，<strong>过程被压缩成首末两个状态之差</strong>，中间的加速度怎么变、路径怎么走，全都不必知道。代价是它只告诉你首末速度的关系，告诉不了任意时刻的速度。两种工具各有各的用处：要描述运动细节用牛顿定律，只关心「变了多少」用动量定理。</p>
    <p>演示把这条定理摆成了上下两张图。上面的 <Katex tex="F\text{-}t" /> 图里，恒力持续作用 <Katex tex="T" /> 秒，曲线下的矩形边推边长，它的面积就是此刻的冲量 <Katex tex="I=Ft" />；下面的 <Katex tex="p\text{-}t" /> 图里，动量沿一条直线上升，斜率正是合力 <Katex tex="F" />，作用结束后水平延续。一条竖虚线贯穿两图，读数栏的最后一行 <Katex tex="I-\Delta p" /> 在整段动画里恒为 0 —— 上面长出来的面积，与下面抬起来的高度，一直是同一个数（准确地说，是同一个量在两种图象上的显示）。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力26a · <b>冲量与动量定理</b>：上方是光滑水平面上的一只小球，橙色箭头是推力 <Katex tex="F" />，绿色箭头是此刻的速度，长度随速率变化；被推的这段路上球一路加速，停止受力后匀速前进，走到头从头重放。下方两张图共用一条时间轴：上图是 <Katex tex="F\text{-}t" /> 曲线，恒力持续 <Katex tex="T" /> 秒后归零，橙色矩形是已经累积的冲量 <Katex tex="I=Ft" />；下图是 <Katex tex="p\text{-}t" /> 曲线，斜率为 <Katex tex="F" />，紫色双箭头量出动量的抬升 <Katex tex="\Delta p" />，青色虚线标出 <Katex tex="p_1" /> 与 <Katex tex="p_2" /> 两条水平位置。看点一：竖虚线扫过时，上面矩形一点点变宽，下面曲线一点点升高，读数栏的「冲量 I」与「动量变化 Δp」两行数字始终相同，最末一行 <Katex tex="I-\Delta p" /> 恒为 0。看点二：力撤去后上面面积不再增加、下面曲线转为水平，两条图线同时停住——没有冲量就没有动量变化。看点三：把推力 F 拖大，上图矩形变高、下图的线变陡，两处一起变；把质量 m 拖大，下图斜率纹丝不动，只是同一段时间里球跑得更慢（速度箭头的读数比动量的读数涨得慢）——<Katex tex="p\text{-}t" /> 的斜率只认合力。</p>

    <h3 class="sec" id="m1-buffer">缓冲与平均作用力</h3>
    <p>碰撞、打击、落地这些过程中，力随时间剧烈变化，峰值可以是平均值的许多倍，逐时刻去描述没有意义。动量定理在这里给出一个能把问题算下去的办法：把变力换成一个<strong>平均作用力</strong> <Katex tex="\bar F" />，要求它在同样的时间内的冲量与真实冲量相等，即</p>
    <p style="text-align:center"><Katex tex="\bar F\,\Delta t=\Delta p,\qquad \bar F=\frac{\Delta p}{\Delta t}." display /></p>
    <p>这条式子把一件事说得很清楚：<strong>动量变化一定时，作用时间越长，平均作用力越小</strong>。凡是用来「拖长时间」的装置，都是这个道理——安全气囊把司机前冲的速度在零点几秒内逐步减到零，跳高垫、体操垫让落地过程从瞬间拉长到半秒，包装泡沫让玻璃杯在几厘米的压缩里慢慢停下，人从高处跳下时屈膝下蹲也是同一回事。反过来的用法同样成立：锤子敲钉子，铁锤硬、接触时间短，平均力大，钉子才进得去；换成橡胶锤，接触时间变长、平均力变小，只能把钉子拍歪。</p>
    <p>一个算例。质量 <Katex tex="0.2\ \text{kg}" /> 的球以 <Katex tex="10\ \text{m/s}" /> 垂直撞墙，原速弹回，接触时间 <Katex tex="0.01\ \text{s}" />。取初速度方向为正，则 <Katex tex="p_1=0.2\times 10=2.0" />，<Katex tex="p_2=0.2\times(-10)=-2.0" />，</p>
    <p style="text-align:center"><Katex tex="\bar F=\frac{-2.0-2.0}{0.01}=-400\ \text{N}." display /></p>
    <p>负号表示墙对球的平均作用力与初速度方向相反，大小为 <Katex tex="400\ \text{N}" />，是球重的两百倍。若接触时间拉长到 <Katex tex="0.1\ \text{s}" />（比如撞在软垫上），同样的动量变化只需要 <Katex tex="40\ \text{N}" />。动量变化由前后速度定死，谁也没法改；能改的只有时间，于是平均力随时间的拉长而成比例下降。</p>
    <p>算平均力时还要交代一件事：<strong>这段时间里哪些力要算进来</strong>。上面的算例只写了墙的力，是因为在 <Katex tex="0.01\ \text{s}" /> 内重力的冲量只有 <Katex tex="0.2\times 9.8\times 0.01\approx 0.02\ \text{N}\cdot\text{s}" />，与墙给的 <Katex tex="4\ \text{N}\cdot\text{s}" /> 相比可以忽略。凡是「碰撞时间极短、瞬时力极大」的场合，重力、摩擦这类有限的力常常可以略去；但若过程持续较久（比如球在沙坑里滚了 2 秒才停），重力就不能再丢了。忽略之前先估一估量级，这一步不能省。</p>
    <p>下面那块板把撞墙的过程画成了两张图：左边小球撞向墙上的软垫、原速弹回，软垫越厚表示接触时间越长；右边是接触期间的 <Katex tex="F\text{-}t" /> 曲线——曲线下的面积就是冲量，青色虚线是等高线的平均作用力。</p>

    <PhysicsDemo :def="BUF" />
    <p class="cap">图 力26b · <b>缓冲与平均作用力</b>：小球 <Katex tex="m" /> 以速率 <Katex tex="v" /> 垂直撞向墙上的软垫、原速弹回。左栏是墙与软垫（厚度随接触时间 <Katex tex="\Delta t" /> 变），紫箭头是接近时的速度、绿箭头是弹回时的速度，接触期间球被压扁、橙色箭头是垫子给的作用力；右栏是接触期间的 <Katex tex="F\text{-}t" /> 曲线（半个正弦），橙色面积随过程一点点填满，青色虚线是等高的平均作用力 <Katex tex="\bar F=\Delta p/\Delta t" />。看点一：橙色面积随接触过程一点点填满，填满那一刻它的总面积正是 <Katex tex="\Delta p=2mv" />，与读数栏「动量变化 <Katex tex="\Delta p" />」那一行相等。看点二：把接触时间 <Katex tex="\Delta t" /> 从 <Katex tex="10\ \text{ms}" /> 拖到 <Katex tex="200\ \text{ms}" />：左栏软垫一点点变厚，右栏的曲线变矮变宽，青色虚线随之下移，而「动量变化 <Katex tex="\Delta p" />」一行纹丝不动——同样的动量变化，摊到越长的时间里，平均作用力就越小。看点三：改质量 <Katex tex="m" /> 或碰前速率 <Katex tex="v" />，<Katex tex="\Delta p" /> 跟着变、整块面积的高低与宽窄一起变，而「峰值力 <Katex tex="F_p=\pi\bar F/2" />」与平均力的比值始终是同一个数——真实作用力随时间起伏，平均力是把它压成一条等高线后的等效值。</p>

    <h3 class="sec" id="m1-use">应用与解题</h3>
    <p><strong>解题的四步。</strong>一是选定研究对象与过程，明确初、末两个状态以及过程持续的时间 <Katex tex="\Delta t" />；二是规定正方向（一般取初速度方向为正，或取要求的那个力的方向为正），此后所有的速度、力、冲量都带符号写；三是写出初、末动量 <Katex tex="mv_1" />、<Katex tex="mv_2" /> 与合外力的冲量——把 <Katex tex="\Delta t" /> 内作用在物体上的力逐个列出，冲量为零的（如与运动方向垂直的支持力）不必写，可忽略的要说明理由；四是代入 <Katex tex="I_{\text{合}}=mv_2-mv_1" /> 求解，最后检查符号与数量级。</p>
    <p><strong>连续流问题。</strong>水流冲击墙面、气体从喷口喷出、传送带连续落下沙子，这类问题里「研究对象」不是一个现成的物体。办法是取一小段时间 <Katex tex="\Delta t" />，把这段时间内流过某截面的那一部分流体当作研究对象：体积 <Katex tex="S v\Delta t" />，质量 <Katex tex="\Delta m=\rho S v\Delta t" />，它的动量从 <Katex tex="\Delta m\cdot v" /> 变成零（或反过来），于是冲击力 <Katex tex="F=\Delta m\,v/\Delta t=\rho S v^2" />。这类题的共同点是把「一段流体」换成「一个物体」，之后照四步走。</p>
    <p><strong>与动能定理怎么分工。</strong>功是力在<strong>空间</strong>上的累积，对应动能的变化；冲量是力在<strong>时间</strong>上的累积，对应动量的变化。题目涉及位移、问「能做多少功」「滑多远」，走动能定理；涉及时间、问「作用了多久」「平均力多大」「速度变了多少」，走动量定理。两者并不互斥，很多题目需要联立：先用动量定理求出末速度，再用动能定理求位移；或者反过来。</p>
    <p>回到讲动量定理的那块板（图 力26a），<Katex tex="F\text{-}t" /> 图上的面积与 <Katex tex="p\text{-}t" /> 图上的抬升是同一个量，这一点可以逐项核对。把推力 <Katex tex="F" /> 调大一倍，两图的纵轴同时被拉高：面积加倍，斜率也加倍。把作用时间 <Katex tex="T" /> 拖长，矩形的宽变宽、斜线的长度变长，两者一起变。改变质量 <Katex tex="m" /> 时有一件值得留意的现象：<Katex tex="p\text{-}t" /> 线的<strong>斜率不变</strong>。因为斜率是 <Katex tex="\mathrm{d}p/\mathrm{d}t=F" />，只由合力决定，与物体的质量无关；质量变大，变的是同一段时间里速度涨得慢一些，动量涨得一样多。这一条正是「动量是 <Katex tex="mv" /> 而不是 <Katex tex="v" />」的理由：与冲量直接配对的，是动量。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="\Delta p" /> 当成大小之差。</strong>动量是矢量，<Katex tex="\Delta p=p_2-p_1" /> 是矢量差。球撞墙原速弹回，<Katex tex="\Delta p" /> 的大小是 <Katex tex="2mv" /> 而不是 0；斜向撞击时还要按两个方向分别作差再合成。凡是速度方向发生反转或偏转的过程，都要先画出首末两个动量矢量再相减。</li>
        <li><strong>提示二：不先规定正方向。</strong>动量定理的标量形式里，速度与力都带符号。规定正方向后，反向的速度写成负值、反向的力写成负值，代入后符号自然正确；不规定方向就动笔，十有八九会把反弹的速度也写成正值，算出的冲量小了一半。</li>
        <li><strong>提示三：把某个力的冲量当成合力冲量，或漏掉该算的力。</strong>定理左边是<strong>合外力</strong>的冲量。碰撞、打击这类极短过程可以略去重力，但要估一下量级并写明理由；过程较长（在沙坑里停下、在粗糙面上滑行几秒）时，重力与摩擦力的冲量往往比所求的力还大，漏掉就全错。</li>
        <li><strong>提示四：把动量定理与动能定理混着用。</strong>动量定理里不能出现功，动能定理里不能出现冲量；<Katex tex="p=\sqrt{2mE_k}" /> 只用来在两套结果之间换算，不能拿它把一个定理的式子改写成另一个定理。另一个常见混用是：题目问「滑行多远」，却用动量定理算出速度就当作位移，两者还差一个时间因子。</li>
      </ul>
    </div>
    <p>回收与预告：力22 到力25 处理的是力在空间上的累积，得到了功、动能与能量守恒；这一章换一个方向，把力在时间上累积，得到冲量与动量定理。两套工具的分工在力学里一直延续下去：求位移走能量，求时间走动量。下一个问题是，当几个物体互相作用时，动量会怎样分配——如果系统所受的合外力冲量为零，那么系统内部无论怎样碰撞、挤压、炸开，总动量都不改变。力27 讲动量守恒与碰撞。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('momentum1');
const BUF = demoOf('buffering');
</script>
