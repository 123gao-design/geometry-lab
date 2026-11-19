<template>
  <PhysicsCh id="circuit1"
    sub="静电场里电荷是静止的，这一章让它动起来。导线里电荷的定向移动形成电流，电流、电压、电阻三个量由欧姆定律串起来。先弄清一段导体里的规律，再把几段导体接成串联或并联，看总电阻、电压与电流怎样分配。"
    :toc="[
      { id: 'c1-current', t: '电流' },
      { id: 'c1-resist', t: '电阻与欧姆定律' },
      { id: 'c1-series', t: '串联电路' },
      { id: 'c1-parallel', t: '并联电路' },
      { id: 'c1-calc', t: '算一遍' },
    ]">
    <div class="note good">
      电荷的定向移动形成<strong>电流</strong>，大小由单位时间内通过横截面的电荷量定义，
      <Katex tex="I=\frac{q}{t}," />
      方向规定为正电荷移动的方向。导体对电流的阻碍作用叫<strong>电阻</strong>，
      <Katex tex="R=\frac{U}{I}," />
      它是比值定义，由导体本身决定。当温度一定、导体是纯电阻时，电流与电压成正比，这就是<strong>欧姆定律</strong>：
      <Katex tex="I=\frac{U}{R}." />
      串联时电流处处相等，<Katex tex="R=R_1+R_2," />
      电压按电阻正比分配；并联时各支路电压相同，
      <Katex tex="\frac{1}{R}=\frac{1}{R_1}+\frac{1}{R_2}," />
      电流按电阻反比分配，总电阻比任一条支路都小。
    </div>

    <h3 class="sec" id="c1-current">电流</h3>
    <p>把导体接在电源两端，导体内部的自由电荷在电场力作用下做定向移动，宏观上就有了电流。电流的强弱用<strong>电流</strong> <Katex tex="I" /> 描述：单位时间内通过导体某一横截面的电荷量，</p>
    <p style="text-align:center"><Katex tex="I=\frac{q}{t}." display /></p>
    <p>单位是安培，符号 A，<Katex tex="1\ \text{A}=1\ \text{C/s}" />。常用的还有毫安与微安，<Katex tex="1\ \text{mA}=10^{-3}\ \text{A}" />，<Katex tex="1\ \mu\text{A}=10^{-6}\ \text{A}" />。</p>
    <p>电流有方向。习惯上把<strong>正电荷</strong>定向移动的方向规定为电流的方向，所以在金属导体里，电流的方向与自由电子实际移动的方向相反。电流是标量，它没有沿导线「指向某处」的矢量性质，但在一段导线里说「电流从左流向右」仍然有意义，指的是电荷通过横截面的流向。</p>
    <p>从微观上看，设导体单位体积内有 <Katex tex="n" /> 个自由电荷，每个电荷量为 <Katex tex="q" />，定向移动的平均速率为 <Katex tex="v" />，导体的横截面积为 <Katex tex="S" />，那么在 <Katex tex="t" /> 时间内通过横截面的电荷量为 <Katex tex="nqSvt" />，于是</p>
    <p style="text-align:center"><Katex tex="I=nqSv." display /></p>
    <p>这条式子说明，同一段导线里电流处处相同，横截面小的地方电荷定向移动得就快。金属中自由电子的定向移动速率其实很慢，只有 10⁻⁴ m/s 量级，而电场的建立接近光速，所以一合闸，整条回路几乎同时有电流。</p>

    <PhysicsDemo :def="DEMO0" />
    <p class="cap">图 电5a · <b>电流的微观图像</b>：导体画成一条带子，小圆点是其中的自由电荷，橙色一条竖带是横截面 <Katex tex="S" />，绿色一层是 <Katex tex="t" /> 时间内将要穿过 <Katex tex="S" /> 的电荷。看点一：绿色那一层的长度就是 <Katex tex="v t" />，层内电荷量为 <Katex tex="nqSv t" />，它们全部穿过 <Katex tex="S" /> 恰好用去时间 <Katex tex="t" />，所以 <Katex tex="I=q/t=nqSv" />。看点二：拖「定向移动速率 v」，小点流得快、绿层变长；拖「载流子数密度 n」，小点变密；拖「横截面积 S」，导体变粗、截面变宽——三个因子各管一处，电流都按正比变。看点三：右栏是 <Katex tex="I" /> 随 <Katex tex="v" /> 的直线，过原点、斜率正是 <Katex tex="nqS" />，改 n 或改 S 直线整体变陡或变平，改 v 只让工作点沿直线滑动。看点四：读数栏把「10 ms 内通过 <Katex tex="S" /> 的电荷量」与「电流 × 时间」并排列出，两数逐位相同，与 <Katex tex="nqSv t" /> 一栏之差为 0。n 取铜的 8.5×10²⁸ m⁻³、S 取 1 mm²、v 取 0.1 mm/s，电流约 1.36 A——定向速率不到每秒一毫米，电流却有一安培量级，靠的是参与导电的电子数目极大。</p>

    <h3 class="sec" id="c1-resist">电阻与欧姆定律</h3>
    <p>同一段导体，两端加的电压越大，通过的电流越大；换一段更细更长的导体，同样的电压下电流会变小。导体对电流的这种阻碍作用用<strong>电阻</strong> <Katex tex="R" /> 描述，定义式为</p>
    <p style="text-align:center"><Katex tex="R=\frac{U}{I}." display /></p>
    <p>单位是欧姆，符号 Ω，<Katex tex="1\ \Omega=1\ \text{V/A}" />。这是<strong>比值定义</strong>：电阻由导体本身的材料、长度、横截面积与温度决定，与加多大的电压、通多大的电流都无关。与电容 <Katex tex="C=Q/U" /> 是同一种定义方式。</p>
    <p>实验发现，对一段金属导体，在温度不变时，导体中的电流与它两端的电压成正比。这就是<strong>欧姆定律</strong>：</p>
    <p style="text-align:center"><Katex tex="I=\frac{U}{R}." display /></p>
    <p>把电压作横轴、电流作纵轴，欧姆定律给出的是一条过原点的直线，斜率为 <Katex tex="1/R" />。这样的元件叫<strong>线性元件</strong>；有些元件（如灯丝、二极管）的这条曲线不是直线，叫非线性元件，对它们仍可以定义电阻，但欧姆定律不再成立。</p>
    <p>欧姆定律的适用条件要记清：<strong>纯电阻</strong>电路、<strong>温度不变</strong>。电动机把电能主要转化成机械能，电解槽把电能转成化学能，它们都不是纯电阻，<Katex tex="I=U/R" /> 不能直接用。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电5b · <b>欧姆定律</b>：左栏一只电阻接在电源上，右栏是它的 I–U 直线。看点一：导线上的小圆点是定向移动的电荷，拖大「电源电压 U」，小点流得快、电流读数跟着变大；拖大「电阻 R」，小点慢下来。看点二：右栏直线过原点，斜率是 <Katex tex="1/R" />；拖 R 整条直线绕原点转，R 越小越陡——欧姆定律给的就是一条过原点的直线。看点三：读数栏的 U/I 一行拖任何一根滑块都不动，始终等于电阻 R，这正是「电阻由导体本身决定」的直接核对。看点四：把 R 从 1 Ω 拖到 10 Ω，同样是 6 V 的电压，电流按反比降到十分之一。</p>

    <h3 class="sec" id="c1-series">串联电路</h3>
    <p>把几只电阻首尾相接，只有一条通路，这叫<strong>串联</strong>。串联电路有三条基本关系。</p>
    <p>其一，电流处处相等。电荷不会在导线里堆积，同一时间内通过任何横截面的电荷量都相同，所以 <Katex tex="I=I_1=I_2" />。</p>
    <p>其二，总电压等于各部分电压之和。沿电流方向走一圈，各段电势降落累加起来就是总降落，</p>
    <p style="text-align:center"><Katex tex="U=U_1+U_2." display /></p>
    <p>其三，总电阻等于各电阻之和。把 <Katex tex="U_1=IR_1" />、<Katex tex="U_2=IR_2" /> 代入上式并除以 <Katex tex="I" />，得到</p>
    <p style="text-align:center"><Katex tex="R=R_1+R_2." display /></p>
    <p>由 <Katex tex="U_1=IR_1" /> 与 <Katex tex="U_2=IR_2" /> 还能看出电压的分配：电流相同，电压与电阻成正比，</p>
    <p style="text-align:center"><Katex tex="\frac{U_1}{U_2}=\frac{R_1}{R_2}." display /></p>
    <p>电阻大的那一段分到的电压多。串联电路的总电阻比其中任何一个都大，因为长度变长了；同时它把总电压分掉一部分，起分压作用。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电5c · <b>串联电路</b>：两只电阻首尾相接，只有一条通路，导线上的小点处处同速。看点一：拖「电阻 R₁」或「电阻 R₂」，两段导线上的小点始终一样快，读数栏的电流只有一行——串联处处等电流。看点二：右栏上下两条是电压条与电阻条，用同一个分界点竖向对齐，电压按电阻正比分配；把 R₁ 拖大，分界点向 R₁ 那一侧移，两段的电压与电阻同比例变。看点三：读数栏的「U₁ + U₂」一行拖任何滑块都等于电源电压，总电阻一栏等于 R₁ + R₂，比任一段都大。看点四：把 R₁ 拖到 10 Ω、R₂ 留在 4 Ω，电压比读到 10 : 4，正是两段电阻之比。</p>

    <h3 class="sec" id="c1-parallel">并联电路</h3>
    <p>把几只电阻并排接在同一对节点上，电流在节点处分开、又在另一节点汇合，这叫<strong>并联</strong>。并联电路的三条关系与串联正好成对。</p>
    <p>其一，各支路电压相同。两支路接在同一对节点上，两端的电势差一样，<Katex tex="U=U_1=U_2" />。</p>
    <p>其二，总电流等于各支路电流之和。节点是「汇」的所在，进多少出多少，</p>
    <p style="text-align:center"><Katex tex="I=I_1+I_2." display /></p>
    <p>其三，总电阻的倒数等于各电阻倒数之和。把 <Katex tex="I_1=U/R_1" />、<Katex tex="I_2=U/R_2" /> 代入上式并除以 <Katex tex="U" />，</p>
    <p style="text-align:center"><Katex tex="\frac{1}{R}=\frac{1}{R_1}+\frac{1}{R_2},\qquad R=\frac{R_1R_2}{R_1+R_2}." display /></p>
    <p>总电阻比任一条支路都小：并联相当于把导体的横截面加宽了，阻碍作用反而变小，这一点与串联刚好相反。电流的分配由电压相同直接读出，</p>
    <p style="text-align:center"><Katex tex="\frac{I_1}{I_2}=\frac{R_2}{R_1}," display /></p>
    <p>电阻小的支路分到的电流大。并联起分流作用，生活中各家各户的用电器都是并联的：电压都是 220 V，各用电器互不影响，开关一只不影响其他。</p>

    <PhysicsDemo :def="DEMO3" />
    <p class="cap">图 电5d · <b>并联电路</b>：两只电阻并排接在同一对节点上，两条竖直支路各走一路电流。看点一：两条支路两端接在同一对节点上，电压相同；电阻小的那条支路上小点流得快、箭头更长，电流读数也就更大。看点二：右栏总电流条按 <Katex tex="R_2:(R_1+R_2)" /> 分成两段，拖 R₁ 或 R₂ 分界点跟着移，两条支路的电流之比恒为电阻的反比。看点三：三根电阻条分别排开 R₁、R₂ 与总电阻 R，R 那根最短，比任一条支路都短——并联等于把横截面加宽。看点四：读数栏的 I₁ + I₂ 一行拖任何滑块都等于总电流，总电阻一栏与并联公式算出的数相同。</p>

    <h3 class="sec" id="c1-calc">算一遍</h3>
    <p>两只电阻 <Katex tex="R_1=2.0\ \Omega" />、<Katex tex="R_2=4.0\ \Omega" />，接在 <Katex tex="U=6.0\ \text{V}" /> 的电源上。</p>
    <p>串联时，总电阻与电流为</p>
    <p style="text-align:center"><Katex tex="R=R_1+R_2=6.0\ \Omega,\qquad I=\frac{U}{R}=1.0\ \text{A}," display /></p>
    <p>两段电压按电阻正比分配：</p>
    <p style="text-align:center"><Katex tex="U_1=IR_1=2.0\ \text{V},\qquad U_2=IR_2=4.0\ \text{V}," display /></p>
    <p>合起来正好 6.0 V。并联时，总电阻与总电流为</p>
    <p style="text-align:center"><Katex tex="R=\frac{2.0\times4.0}{2.0+4.0}=1.33\ \Omega,\qquad I=\frac{U}{R}=4.5\ \text{A}," display /></p>
    <p>两路电流分别为 <Katex tex="I_1=U/R_1=3.0\ \text{A}" />、<Katex tex="I_2=U/R_2=1.5\ \text{A}" />，合起来 4.5 A，电阻小的那一条分的电流是另一条的两倍。同样两只电阻，串联的总电阻 6.0 Ω 比两者都大，并联的 1.33 Ω 比两者都小，差出四倍多。</p>
    <p>这两种接法各有自己的一块板，读数栏按 <Katex tex="R" />、<Katex tex="I" />、<Katex tex="U_1" />、<Katex tex="U_2" />（并联板换成 <Katex tex="I_1" />、<Katex tex="I_2" />）分行列出，最后一行是各部分之和，拖滑块它始终等于电源电压或总电流。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把电阻当成由电压或电流决定。</strong><Katex tex="R=U/I" /> 是比值定义，电阻由导体本身决定。加在两端的电压变大，电流同比例变大，比值不变；只有换成另一段导体，电阻才变。</li>
        <li><strong>提示二：对非纯电阻元件套用 I = U/R。</strong>电动机、电解槽把电能转成机械能与化学能，欧姆定律不成立。判断之前先问一句：这些电能是不是全部变成了内能。</li>
        <li><strong>提示三：把串联与并联的分压、分流记反。</strong>串联电流相同，电压按电阻<strong>正比</strong>分配；并联电压相同，电流按电阻<strong>反比</strong>分配。两者的「相同」是哪一个量，先写下来再算。</li>
        <li><strong>提示四：以为并联后总电阻变大。</strong>并联等于加宽横截面，总电阻比任一条支路都小。若结果是 <Katex tex="R>R_1" />，一定是式中把倒数拍平了，回头检查 <Katex tex="1/R" /> 那一步。</li>
      </ul>
    </div>
    <p>回收与预告：这一章给出电流与电阻的定义，由欧姆定律把三个量连起来，再把几段导体接成串、并联求总电阻。前面用的电源都当作电压恒定、内阻不计的理想电源，实际的电源有内阻，接上外电路之后路端电压会随电流变化——下一章把电源内阻算进去，得到闭合电路的欧姆定律。</p>
    <div class="lab-jump">
      <div class="lj-txt">
        <span class="lj-name">电路实验室</span>
        <span class="lj-d">这一章的三种接法可以自己摆一遍：把电池、电阻、灯泡与开关放到格线上，用导线连成回路，改阻值就看各处电流怎样变。</span>
      </div>
      <router-link class="lj-go" to="/physics/lab/circuit">进实验室<span class="lj-ar">→</span></router-link>
    </div>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO0 = demoOf('micro');
const DEMO = demoOf('ohm');
const DEMO2 = demoOf('ohmSeries');
const DEMO3 = demoOf('ohmPar');
</script>

<style scoped>
/* 章末引到电路实验室的跳转卡：左侧一道橙线，右侧一枚按钮，整块可点 */
.lab-jump {
  display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
  margin: 26px 0 8px; padding: 16px 18px 16px 20px;
  border: 1px solid var(--line); border-left: 3px solid var(--orange);
  border-radius: 14px; background: var(--card);
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.lab-jump:hover { border-color: color-mix(in srgb, var(--orange) 45%, var(--line)); box-shadow: 0 6px 20px rgba(0, 0, 0, .10); }
.lj-txt { flex: 1 1 320px; min-width: 0; }
.lj-name { display: block; font-size: 15px; font-weight: 600; color: var(--ink); letter-spacing: .3px; }
.lj-d { display: block; margin-top: 5px; font-size: 13px; line-height: 1.8; color: var(--mut); }
.lj-go {
  flex: 0 0 auto; display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: 99px; font-size: 13.5px; text-decoration: none;
  color: #fff; background: var(--orange); transition: filter .18s, transform .18s;
}
.lj-go:hover { filter: brightness(1.08); transform: translateX(2px); }
.lj-ar { font-size: 14px; }
@media (prefers-reduced-motion: reduce) { .lab-jump, .lj-go { transition: none; } }
</style>
