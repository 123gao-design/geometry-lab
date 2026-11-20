<template>
  <PhysicsCh id="mag1"
    sub="电场是电荷周围存在的特殊物质，磁场则是磁体与电流周围存在的特殊物质。这一章先建立磁场的描述方式：用磁感线画出它的分布，用磁感应强度定量刻画它的强弱与方向，再用磁通量描述穿过某个面的多少。"
    :toc="[
      { id: 'm1-field', t: '磁场' },
      { id: 'm1-lines', t: '磁感线' },
      { id: 'm1-B', t: '磁感应强度' },
      { id: 'm1-flux', t: '磁通量' },
      { id: 'm1-calc', t: '算一遍' },
    ]">
    <div class="note good">
      磁体与通电导线周围存在<strong>磁场</strong>，磁场的基本性质是对放入其中的磁体、电流与运动电荷有力的作用。磁场有方向：小磁针静止时 <span style="white-space:nowrap">N 极</span>所指的方向就是该点的磁场方向。用<strong>磁感线</strong>形象地表示磁场：磁体外部从 N 极出发、回到 S 极，内部从 S 极到 N 极，是不相交的闭合曲线，疏密表示强弱。要定量，引入<strong>磁感应强度</strong>：把一段长为 <Katex tex="L" /> 的导线垂直放入磁场，通以电流 <Katex tex="I" />，所受的力为 <Katex tex="F" />，则
      <Katex tex="B=\frac{F}{IL}," />
      单位是特斯拉（T）。穿过某个面的<strong>磁通量</strong>是 <Katex tex="\Phi=BS" />（<Katex tex="B" /> 与面垂直时），单位是韦伯（Wb）。
    </div>

    <h3 class="sec" id="m1-field">磁场</h3>
    <p>把两根磁铁的 <span style="white-space:nowrap">N 极</span>靠近，它们互相排斥；把小磁针放在磁铁旁边，它会转到某个确定的方向。这些作用都不是两物体直接接触产生的，中间一定有某种物质在传递，这就是<strong>磁场</strong>。奥斯特发现通电导线也能让小磁针偏转，说明电流周围同样存在磁场——磁体与电流通过磁场相互作用。</p>
    <p>磁场与电场一样，看不见摸不着，但可以从它的作用上认识它。它的基本性质是：对放入其中的磁体、通电导线与运动电荷施加力的作用。</p>
    <p>磁场有方向。规定<strong>小磁针静止时 <span style="white-space:nowrap">N 极</span>所指的方向</strong>为该点的磁场方向。把许多小磁针放到磁场里，它们的指向各不相同，说明磁场在空间各点的方向不同，它是一个有方向、有强弱的场。</p>

    <h3 class="sec" id="m1-lines">磁感线</h3>
    <p>为了形象地描述磁场，人为地画出一些曲线，<strong>曲线上每一点的切线方向就是该点的磁场方向</strong>，这样的曲线叫磁感线。用铁屑撒在磁铁周围也能看到类似的花样，铁屑就是被磁化后沿着磁场排列成线的。</p>
    <p>磁感线有几条共同特点。其一，磁体<b>外部</b>的磁感线从 N 极出发、回到 S 极，磁体<b>内部</b>又从 S 极回到 N 极，所以每条磁感线都是<strong>闭合曲线</strong>，这一点与电场线不同。其二，磁感线<strong>互不相交</strong>——同一点只能有一个磁场方向。其三，磁感线的<strong>疏密</strong>表示磁场的强弱，密的地方磁场强。</p>
    <p>常见的几种磁场分布要能认出来：条形磁铁两极附近最密，中间最疏；通电直导线周围的磁感线是围绕导线的同心圆，方向和电流方向由安培定则（右手螺旋定则）联系；通电螺线管外部的磁场与条形磁铁的相似，内部的磁感线彼此平行、方向一致，是一个匀强磁场区。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电8a · <b>磁感线与小磁针</b>：右端是 N 极、左端是 S 极的条形磁铁，灰色曲线按两极的磁场叠加积出来，磁铁内部那一段不画，但每条线在概念上闭合。看点一：拖动「小磁针位置」把它挪到磁铁正上方、右端外、左端外，针身始终贴着当地磁感线的切线，暖色一端（N 端）指向磁场方向。看点二：磁极附近线最密，读数栏的相对强弱在那里最大；把磁针挪远，线变疏、相对强弱迅速变小，两个读数一一对应。看点三：读数以磁铁正上方中心处为 1，把磁针挪到磁极正外侧，相对强弱会大于 1。看点四：把磁针从右端一路往左拖，暖色一端先朝右上，靠近正中上方时转平，再翻向左上——磁感线在磁铁外部从 N 极出发、绕过上方回到 S 极，方向一路在转。</p>

    <h3 class="sec" id="m1-B">磁感应强度</h3>
    <p>磁感线只能定性描述，要定量就得有数。把一小段长为 <Katex tex="L" /> 的直导线垂直放入磁场中，通以电流 <Katex tex="I" />，它受到的力 <Katex tex="F" /> 与电流、长度成正比，比值</p>
    <p style="text-align:center"><Katex tex="B=\frac{F}{IL}" display /></p>
    <p>只由磁场本身决定，与放入的导线无关。把这个比值定义为该点的<strong>磁感应强度</strong>。它与电场强度的定义方式一样，都是「力除以某个量」，都是比值定义。</p>
    <p>单位是特斯拉，<Katex tex="1\ \text{T}=1\ \text{N/(A}\cdot\text{m)}" />。常见磁场的磁感应强度：地磁场约 <Katex tex="5\times10^{-5}\ \text{T}" />，永磁体两极附近约 0.1～1 T，医院核磁共振的磁场可达 1～3 T。</p>
    <p>磁感应强度是矢量，方向就是该点的磁场方向，也就是小磁针 N 极的指向。各点磁感应强度大小与方向都相同的区域叫<strong>匀强磁场</strong>，画出来的磁感线是一族等间距的平行直线。下一章讲安培力时会看到，<Katex tex="F=BIL" /> 只在导线与磁场<strong>垂直</strong>时成立；若导线与磁场平行，受力为零。所以用上式定义 <Katex tex="B" /> 时，「垂直放入」这个前提不能省。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电8b · <b>磁感应强度</b>：叉号铺满左上表示匀强磁场垂直纸面向里，通电导线水平放进场中。磁场垂直纸面、电流沿纸面，所以安培力落在纸面内且垂直于导线，靛蓝箭头竖直向上，大小 F = BIL。看点一：拖「电流 I」或「导线长度 L」，导线长短、箭头长短与读数栏的安培力一起变；这个档要看的不是力本身，而是下栏那三行试验——I 与 L 各取一组参照值和当前值，力各不相同，可最后一栏 <Katex tex="F/(IL)" /> 三行读出来都是同一个数，它只由磁场本身决定。看点二：改变「磁感应强度 B」，三行一起按同一比例变，最后一栏整列跟着换成新的 B——这正是比值定义的含义：同一个磁场，换哪根导线去测，比值都不动；换一个磁场，比值才动。看点三：右栏是 F 随 I 的直线，过原点，斜率等于 BL；拖 L，斜率的量程随之改，拖 B 也一样。看点四：把 L 拖到 0.2 m，导线短了、力小了一半以上，而 <Katex tex="F/(IL)" /> 仍是那个 B。</p>

    <h3 class="sec" id="m1-flux">磁通量</h3>
    <p>穿过某个面的磁感线的多少，用<strong>磁通量</strong> <Katex tex="\Phi" /> 描述。当磁场与面垂直时，</p>
    <p style="text-align:center"><Katex tex="\Phi=BS," display /></p>
    <p>其中 <Katex tex="S" /> 是面的面积，单位是韦伯（Wb），<Katex tex="1\ \text{Wb}=1\ \text{T}\cdot\text{m}^2" />。磁通量是标量，但它有正负：规定一个面的法线方向之后，磁感线从这一侧穿入为正、从另一侧穿入为负。</p>
    <p>若磁场与面不垂直，取面在垂直磁场方向上的投影面积 <Katex tex="S\cos\theta" />（<Katex tex="\theta" /> 是磁场与法线的夹角），得到 <Katex tex="\Phi=BS\cos\theta" />。由此也能反过来说：<Katex tex="B=\Phi/S" />，磁感应强度等于单位面积上的磁通量，所以它又叫<strong>磁通密度</strong>。</p>
    <p>磁通量是后面讲电磁感应的核心量：穿过闭合回路的磁通量一旦变化，回路里就会出现感应电动势。</p>

    <PhysicsDemo :def="DEMO3" />
    <p class="cap">图 电8c · <b>磁通量与有效面积</b>：俯视图里匀强磁场由左向右，绿色箭头是真正穿过线圈的那几条磁感线，线圈绕竖直轴转过 θ，法线与磁场的夹角就是 θ。看点一：θ 拖到 0° 时线圈正对磁场，线圈在垂直于磁场方向上的跨度最大、穿过的磁感线最多，读数栏的磁通量取到最大值。看点二：把 θ 往 90° 拖，线圈在画面里越斜、竖直方向的跨度按 <Katex tex="L\cos\theta" /> 缩，绿色箭头一根根退出，读数栏的有效面积与磁通量同步降到零。看点三：越过 90° 之后法线翻到反面，磁通量变负——同一块面积、同一个磁场，只因为磁感线从另一面穿入。看点四：读数栏的 <Katex tex="\Phi/(BS)" /> 一行拖任何角度都等于 <Katex tex="\cos\theta" />，右栏的橙点始终贴在余弦曲线上，这就是 <Katex tex="\Phi=BS\cos\theta" /> 的逐点核对。</p>

    <h3 class="sec" id="m1-calc">算一遍</h3>
    <p>一条通电直导线长 <Katex tex="L=0.60\ \text{m}" />、电流 <Katex tex="I=4.0\ \text{A}" />，垂直放在磁感应强度 <Katex tex="B=0.50\ \text{T}" /> 的匀强磁场中。它受到的安培力是</p>
    <p style="text-align:center"><Katex tex="F=BIL=0.50\times4.0\times0.60=1.2\ \text{N}." display /></p>
    <p>反过来，如果测得同一根导线受力 1.2 N，就能算出该处的磁感应强度 <Katex tex="B=F/(IL)=1.2/(4.0\times0.60)=0.50\ \text{T}" />，这正是磁场自身的性质，换一根导线去测，结果仍是这个值。</p>
    <p>再看磁通量。面积 <Katex tex="S=0.020\ \text{m}^2" /> 的线圈垂直放在同一个磁场里，穿过的磁通量</p>
    <p style="text-align:center"><Katex tex="\Phi=BS=0.50\times0.020=1.0\times10^{-2}\ \text{Wb}." display /></p>
    <p>把线圈转过 60°，磁通量变成 <Katex tex="BS\cos60°=5.0\times10^{-3}\ \text{Wb}" />，转过 90° 时为零。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把磁感线当成真实存在的线。</strong>磁感线是人为画出来描述磁场的曲线，磁场本身充满空间。铁屑排成的线只是被磁化后的现象，不能据此说磁感线「存在」。</li>
        <li><strong>提示二：以为磁感线与电场线一样不闭合。</strong>磁感线是闭合曲线，磁体内部那一段从 S 极回到 N 极；电场线则从正电荷出发、终止于负电荷，两者不能类推。</li>
        <li><strong>提示三：用 B = F/(IL) 时漏掉「垂直」这个条件。</strong>导线与磁场平行时受力为零，此时 <Katex tex="F/(IL)" /> 算出来是零，并不等于该处的 <Katex tex="B" />。只有垂直放入时这条定义式才成立。</li>
        <li><strong>提示四：把磁通量与磁感应强度混为一谈。</strong><Katex tex="B" /> 是某一点的场，与面积无关；<Katex tex="\Phi" /> 是穿过某个面的总量，与面的大小、朝向都有关。同一个 <Katex tex="B" /> 下，面越大、越正对磁场，磁通量越大。</li>
      </ul>
    </div>
    <p>回收与预告：这一章给出磁场的两种描述——定性的磁感线与定量的磁感应强度，再加上穿过面的磁通量。磁场既然对放入的电流有力的作用，下一章就把这个力算出来：安培力的大小 F = BIL、方向由左手定则判断，并处理通电导线在磁场中的平衡与运动。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('magnet');
const DEMO2 = demoOf('magnetDefine');
const DEMO3 = demoOf('flux');
</script>
