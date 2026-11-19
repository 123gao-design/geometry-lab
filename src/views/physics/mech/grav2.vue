<template>
  <PhysicsCh id="grav2"
    sub="任何两个物体之间都存在相互吸引的力，方向沿两者的连线，大小与两个质量的乘积成正比、与两者距离的平方成反比。牛顿把地面上物体的下落与月球的绕地运行放在同一个式子里，月地检验证实了两者服从同一条规律。引力常量由卡文迪什用扭秤测出，此后天体质量都能由观测数据算出。"
    :toc="[
      { id: 'g2-law', t: '定律的表述与方向' },
      { id: 'g2-test', t: '月地检验' },
      { id: 'g2-const', t: '引力常量与称量地球' },
      { id: 'g2-g', t: '重力与万有引力的关系' },
    ]">
    <div class="note good">
      万有引力定律的式子写起来很短：
      <Katex tex="F=G\frac{m_1m_2}{r^2}" />。<Katex tex="m_1" /> 与 <Katex tex="m_2" /> 是两个物体的质量，<Katex tex="r" /> 是两者之间的距离，<Katex tex="G" /> 是对一切物体都相同的常量。<strong>「万有」</strong>两字说的是适用范围：苹果与地球之间、月球与地球之间、两颗恒星之间，用的是同一个 <Katex tex="G" />、同一个平方反比。力19 的三条规律只描述行星怎样运动，这一章给出它们背后的那条力。
    </div>

    <h3 class="sec" id="g2-law">定律的表述与方向</h3>
    <p>牛顿的结论可以分成三层来读。</p>
    <p><strong>第一层是「有」。</strong>任何两个有质量的物体之间都存在相互吸引的力，与它们是否接触、是否同处一个天体系统无关。两个放在桌面上的铅球之间也有引力，只是量级太小，被其他作用盖住了。</p>
    <p><strong>第二层是「多大」。</strong>引力的大小正比于两个质量的乘积，反比于距离的平方：</p>
    <p style="text-align:center"><Katex tex="F=G\frac{m_1m_2}{r^2}." display /></p>
    <p>质量加倍，引力加倍；距离加倍，引力降到四分之一。演示右栏把这条关系画成曲线：横轴是球心距 <Katex tex="r" />，纵轴是引力 <Katex tex="F" />。把 <Katex tex="r" /> 拖到原来的两倍，绿色的「<Katex tex="2r" />：<Katex tex="F/4" />」标记就落在曲线上，纵坐标只有原来的一半再一半。换一组质量，整条曲线整体升降，形状不变；读数栏里的 <Katex tex="F\cdot r^2" /> 在拖动距离时始终是同一个数——这正是「与 <Katex tex="r^2" /> 成反比」的写法。</p>
    <p><strong>第三层是「方向」。</strong>力沿两球的连线指向对方。两球受到的力大小相等、方向相反，是一对作用力与反作用力，分别作用在两个不同的物体上，因此不会相互抵消。演示里两支箭头始终一样长：把 <Katex tex="m_1" /> 拖得再大，箭头不会一边长一边短，只是两边一起变长。</p>
    <p>式中的 <Katex tex="r" /> 是<strong>两质点之间的距离</strong>。两个质量分布均匀的球体，可以证明它们之间的引力等同于把全部质量集中在球心时的引力，于是 <Katex tex="r" /> 取球心距。演示用的是两球心距；把两球靠近到几乎相切时公式仍能算，但真实的球会形变，且球面之间不能再当作质点处理，那时这条规律要按积分重算。</p>
    <p>三层意思画在同一块板上：左半是两球与两支互相吸引的箭头，中间量出球心距，右半是引力随球心距变化的曲线。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力20 · <b>万有引力定律</b>：两球相互吸引，橙色箭头指向 <Katex tex="m_1" />、紫色箭头指向 <Katex tex="m_2" />，两支箭头永远等长反向；两球心之间那条带端线的双箭头是距离 <Katex tex="r" />，两侧的虚线把它和球心对起来。右图画出 <Katex tex="F" /> 随 <Katex tex="r" /> 的变化，橙点是当前状态，绿点是 <Katex tex="2r" /> 处的对照，虚线标出它对应的纵坐标正好是当前的四分之一。看点一：把「球心距 r」从 1 m 拖到 4 m，左栏两球分开、箭头急剧变短，右栏橙点沿曲线向右下滑，读数栏的 <Katex tex="F\cdot r^2" /> 一动不动。看点二：把「质量 m₁」或「m₂」拖大，两支箭头同步变长——一边变大不会让另一边变小，这正是作用力与反作用力。看点三：右栏曲线的形状只由「平方反比」决定，质量只让整条曲线上下平移，绿点与橙点的倍数关系始终是四倍。</p>

    <h3 class="sec" id="g2-test">月地检验</h3>
    <p>牛顿的思路是把月球当成一颗「抛得足够快的苹果」。如果地面上的重力与拉住月球的力是同一种力，那么把地面重力加速度按平方反比缩到月球轨道那里，应该正好等于月球绕地运行的向心加速度。</p>
    <p>月球到地心的距离约为地球半径的 60 倍：</p>
    <p style="text-align:center"><Katex tex="r=60R\approx3.84\times10^{8}\ \text{m}." display /></p>
    <p>按平方反比，月球轨道处的引力加速度应当是地面重力加速度的 <Katex tex="1/60^2" />：</p>
    <p style="text-align:center"><Katex tex="a_{\text{理}}=\frac{g}{60^2}=\frac{9.8}{3600}\approx2.7\times10^{-3}\ \text{m/s}^2." display /></p>
    <p>另一路，从观测数据直接算月球的实际加速度。月球绕地一周约 27.3 天，把它近似看作匀速圆周运动：</p>
    <p style="text-align:center"><Katex tex="a_{\text{实}}=\frac{4\pi^2r}{T^2}
      =\frac{4\pi^2\times3.84\times10^{8}}{(2.36\times10^{6})^2}\approx2.7\times10^{-3}\ \text{m/s}^2." display /></p>
    <p>两条路给出同一个数。这一结果的分量在于：地面上的落体与天上的月球，被同一条规律联系在了一起。「天上」与「地上」不再是两套法则，这是牛顿力学统一性最直接的证据。</p>
    <p>顺带可以得到月球绕地的周期检验：由 <Katex tex="GM/r^2=4\pi^2r/T^2" /> 解出 <Katex tex="T=2\pi\sqrt{r^3/GM}" />，代入地球质量，得到的正是 27 天上下。</p>

    <h3 class="sec" id="g2-const">引力常量与称量地球</h3>
    <p>式中的 <Katex tex="G" /> 不能由理论推出，只能测。1798 年卡文迪什用扭秤完成了这项测量：一根细石英丝吊起一根轻杆，杆两端各挂一个小铅球，再用两个大铅球从两侧靠近。大球对小球的引力使杆转过一个极小的角度，由石英丝的扭转角度算出力矩，进而得到引力。整套装置放在密闭的房间里，为的是排除气流与温度变化带来的干扰。</p>
    <p>现代公认值</p>
    <p style="text-align:center"><Katex tex="G=6.67\times10^{-11}\ \text{N}\cdot\text{m}^2/\text{kg}^2." display /></p>
    <p>这个数的量级说明了为什么日常生活中感觉不到引力：两个各 1 kg 的球相距 1 m，相互引力只有 <Katex tex="6.67\times10^{-11}" /> N，比一粒灰尘的重力还小得多。演示里把质量放大到几十千克、距离缩到几米，读数才勉强到几十纳牛——这已经是实验室里能演示的量级。</p>
    <p>有了 <Katex tex="G" />，天体的质量就可以由观测数据算出来，这一支后来被称为「称量地球」。在地面上，物体受到的重力近似为 <Katex tex="mg" />，而 <Katex tex="mg\approx GMm/R^2" />，消去 <Katex tex="m" />：</p>
    <p style="text-align:center"><Katex tex="M=\frac{gR^2}{G}
      =\frac{9.8\times(6.37\times10^{6})^2}{6.67\times10^{-11}}\approx6.0\times10^{24}\ \text{kg}." display /></p>
    <p>同样的办法用在一个绕地球运行的卫星上，就得到地球质量；用在行星的卫星上，就得到行星质量；用在双星系统上，就得到恒星质量。力21 里 <Katex tex="GM" /> 这个组合会反复出现，它是所有卫星轨道计算的入口参数。</p>

    <h3 class="sec" id="g2-g">重力与万有引力的关系</h3>
    <p>严格地说，地面上物体受到的<strong>重力</strong>并不完全等于地球对它的万有引力。物体随地球自转做圆周运动，需要一份指向地轴的向心力，这份向心力由万有引力的一部分提供，剩下的才是重力。于是 <Katex tex="\vec F_{\text{万}}=\vec G_{\text{重}}+\vec F_{\text{向}}" />。</p>
    <p>这份差别很小：赤道处向心加速度约 <Katex tex="0.034" /> m/s²，是 <Katex tex="g" /> 的千分之三。它的后果是重力加速度随纬度变化——赤道最小（约 9.78 m/s²），两极最大（约 9.83 m/s²）。高中计算里通常忽略自转，取</p>
    <p style="text-align:center"><Katex tex="mg=G\frac{Mm}{R^2}\quad\Longrightarrow\quad g=\frac{GM}{R^2}." display /></p>
    <p>这个式子还有一层用处：它给出了「距地心 <Katex tex="r" /> 处的引力加速度」<Katex tex="g'=GM/r^2" />，随高度按平方反比减小。卫星在高处之所以绕得慢，根子就在这里。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="r" /> 取成两球表面的距离。</strong>式中的 <Katex tex="r" /> 对均匀球体取<strong>球心距</strong>，相当于把整个球的质量压到球心。地上物体与地球之间要用地心距——因此高山上与海平面上的 <Katex tex="g" /> 才有差别，而差别小得几乎测不出来。</li>
        <li><strong>提示二：把 <Katex tex="G" /> 与 <Katex tex="g" /> 混为一谈。</strong><Katex tex="G" /> 是普适常量，与位置、与物体都无关；<Katex tex="g" /> 是特定位置的重力加速度，随纬度与高度变化，两者由 <Katex tex="g=GM/R^2" /> 联系。</li>
        <li><strong>提示三：认为质量大的物体下落得快。</strong>引力与质量成正比，加速度却是 <Katex tex="F/m=GM/r^2" />，质量被约掉了。两个物体之间的引力是一对等大的力，质量小的那个加速度反而大，但落向地球时地球的质量占绝对优势，两个物体的加速度都等于 <Katex tex="g" />。</li>
        <li><strong>提示四：把「重力」与「万有引力」当成同一个东西。</strong>重力是万有引力的一个分力，另一个分力提供随地球自转所需的向心力。忽略自转时两者近似相等，这是高中计算的默认前提，但要清楚它是近似。</li>
      </ul>
    </div>
    <p>回收与预告：本章给出了 <Katex tex="F=Gm_1m_2/r^2" />，并用月地检验说明它同时管着落体与月球；<Katex tex="G" /> 的测量让天体质量成为可以算出的量。力21 把这条引力放到圆轨道的中心：卫星绕地时引力恰好全部用来提供向心力，<Katex tex="G\frac{Mm}{r^2}=m\frac{v^2}{r}" />，由此得到线速度、周期与轨道半径的对应关系，再据此讨论三个宇宙速度、同步卫星与变轨。离开引力，下一组转入「功」与「能」——那是处理变力问题的一套新工具。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('grav2');
</script>
