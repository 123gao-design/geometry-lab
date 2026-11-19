<template>
  <PhysicsCh id="heat4"
    sub="上一章把气体的状态定死了：p、V、T 由 pV = nRT 互相约束，但没说状态为什么会变。改变状态的途径只有两条——外界对气体做功，以及气体与外界交换热量。这一章先把内能说清，再看这两条途径各改了什么，最后合成热力学第一定律 ΔU = Q + W。"
    :toc="[
      { id: 'h4-energy', t: '内能' },
      { id: 'h4-work', t: '做功改变内能' },
      { id: 'h4-heat', t: '热传递与热量' },
      { id: 'h4-first', t: '热力学第一定律' },
      { id: 'h4-proc', t: '四种典型过程' },
      { id: 'h4-apply', t: '算一遍：等压加热' },
    ]">
    <div class="note good">
      一定质量的理想气体，内能只由温度决定；改变内能有两条途径，做功 W 与热传递 Q。二者与内能变化之间的关系是<strong>热力学第一定律</strong>
      <Katex tex="\Delta U=Q+W," />
      其中 <Katex tex="Q" /> 是气体<strong>吸收</strong>的热量、<Katex tex="W" /> 是<strong>外界对气体</strong>做的功，两者都按代数值代入：吸热为正、放热为负，外界做功为正、气体对外做功为负。它把能量守恒落到了热现象上。
    </div>

    <h3 class="sec" id="h4-energy">内能</h3>
    <p>分子永不停息地运动，每个分子都有动能；分子之间又有相互作用，靠近、远离都要克服引力和斥力，于是还有一份与相对位置有关的势能。物体内所有分子的动能与势能之和，叫物体的<strong>内能</strong>。</p>
    <p>对理想气体来说，分子之间除碰撞外没有相互作用，势能可以略去，内能就只剩分子动能之和。温度升高，分子平均动能增大，内能随之增大；温度降低则相反。气体被压缩或膨胀时分子数没有变，改变的只是分子之间的距离，而理想气体的势能本来就不计，所以<strong>一定质量的理想气体，内能只由温度决定</strong>：温度不变，内能就不变；温度变多少，内能就变多少，与中间走了哪条路无关。</p>
    <p>这一点与状态参量 p、V 不同。内能与温度、压强、体积一样，是描述气体所处状态的量，叫<strong>状态量</strong>；而做功与热传递都发生在状态改变的过程之中，过程停了它们也就没有了，叫<strong>过程量</strong>。说「气体含有多少热量」是不成立的，只能说它在某个过程中吸收或放出了多少热量。</p>

    <h3 class="sec" id="h4-work">做功改变内能</h3>
    <p>取一只带活塞的气缸，里面封着气体。压活塞时，外界对气体做功；松手让它膨胀，气体对外界做功。做功的多少可以用 p–V 图直接量出来。</p>
    <p>活塞面积为 <Katex tex="S" />、气体压强为 <Katex tex="p" />，气体对活塞的压力是 <Katex tex="pS" />。活塞移动一小段 <Katex tex="\Delta x" />，气体做的功是</p>
    <p style="text-align:center"><Katex tex="W_{\text{气}}=pS\,\Delta x=p\,\Delta V." display /></p>
    <p>压强不变时，把整个过程的体积变化累加起来，就是 <Katex tex="W_{\text{气}}=p\,\Delta V" />：在 p–V 图上正好是图线下方那块矩形的面积。压强在变时，图线是一条曲线，把它切成许多窄条，每条的宽是 <Katex tex="\Delta V" />、高是该处的 <Katex tex="p" />，加起来仍是曲线下方的面积。于是有一条可以一直用下去的话：<strong>p–V 图上过程曲线与横轴之间围出的面积，就是气体对外做的功</strong>；气体膨胀时面积为正、对外做正功，被压缩时面积为负，等价于外界对气体做正功。</p>
    <p>本章统一用 <Katex tex="W" /> 表示<strong>外界对气体</strong>做的功，于是 <Katex tex="W=-p\,\Delta V" />（等压过程）：气体膨胀 <Katex tex="\Delta V>0" />，<Katex tex="W<0" />；气体被压缩 <Katex tex="\Delta V<0" />，<Katex tex="W>0" />。这个符号只是记账方向的选择，换一种约定就要整条式子跟着换，中途不能变。</p>
    <p>做功改变内能的证据很直接：快速压下打气筒的活塞，筒壁会发烫。迅速压缩时气体来不及与外界交换热量，体积减小做的功全部变成内能，温度随之上升。下面这块板把 p–V 图上的面积画了出来：压强按住的等压过程，线下的矩形就是气体对外做的功，同一时刻读数栏里 Q、W、ΔU 三行数字逐项对得上。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 热4a · <b>等压加热：矩形面积就是气体对外做的功</b>：左栏一只气缸，缸内的蓝色小点是气体分子，温度越高跑得越快；缸底一块橙色加热板与三簇火苗表示正在送入热量，左侧一支向上的橙色箭头标着 <Katex tex="Q" />。右栏是 p–V 图，蓝线是一条水平线，压强钉在 12.5 kPa 不动。看点一：横线从 20 L 一路向右延伸，线下那块蓝色矩形的宽是 <Katex tex="\Delta V" />、高是 <Katex tex="p" />，面积就是气体对外做的功。看点二：读数栏里 <Katex tex="Q" /> 从 0 涨到 300 J，<Katex tex="\Delta U" /> 是 180 J、外界对气体做的功 <Katex tex="W" /> 是 −120 J——吸进来的热量六成变成内能、四成拿去做功，最后一行 <Katex tex="\Delta U-(Q+W)" /> 恒为 0。看点三：拖「吸收的热量 Q」滑块，矩形的面积与末温一起变，<Katex tex="\Delta U" /> 与 <Katex tex="W" /> 始终按三比二分开。看点四：过程走完停在末态一会儿，再从初态重放，活塞一步步升上去，横线的高度由初态定下、不随 Q 移动。</p>

    <h3 class="sec" id="h4-heat">热传递与热量</h3>
    <p>把一壶冷水放在火上，水的温度升高，这是热传递。两个温度不同的物体相互接触时，热量从高温物体传向低温物体，直到温度相同为止。热传递的三种方式是传导、对流和辐射，方向都由温度差决定，不需要任何宏观位移。</p>
    <p>热传递传递的是<strong>能量</strong>，不是温度，也不是「热质」。物体吸收热量后温度通常升高，但升温多少还取决于物体的质量与比热容：</p>
    <p style="text-align:center"><Katex tex="Q=cm\,\Delta t," display /></p>
    <p>其中 <Katex tex="c" /> 是比热容、<Katex tex="m" /> 是质量、<Katex tex="\Delta t" /> 是温度变化量。水的比热容是 <Katex tex="4.2\times10^{3}\ \text{J/(kg}\cdot{}^\circ\text{C)}" />，意思是 1 kg 水温度升高 <Katex tex="1\ ^\circ\text{C}" /> 要吸收 <Katex tex="4.2\times10^{3}\ \text{J}" /> 的热量；这个值在常见物质里偏大，所以海边昼夜温差比内陆小。</p>
    <p>还有一类过程既不放热也不吸热，叫<strong>绝热过程</strong>。真空夹层的保温瓶、用厚棉被裹住的冰棍，都是尽量把热传递掐断；而快速压缩或快速膨胀气体时，过程短到来不及传热，也可以按绝热处理。本章末「算一遍」一节里那块绝热压缩的板就是一例：缸壁套上保温层，气体与外界没有热交换，只有外界做功这一条路能改它的内能。</p>

    <h3 class="sec" id="h4-first">热力学第一定律</h3>
    <p>做功与热传递都能改变内能，而且它们不是独立的两种「内能来源」：能量只是从一处搬到另一处。把两条途径合起来记一笔，就是<strong>热力学第一定律</strong>：</p>
    <p style="text-align:center"><Katex tex="\Delta U=Q+W." display /></p>
    <p>右边两项都可正可负：吸热 <Katex tex="Q>0" />、放热 <Katex tex="Q<0" />；外界对气体做功 <Katex tex="W>0" />、气体对外做功 <Katex tex="W<0" />。左边 <Katex tex="\Delta U" /> 是内能的增量，增加为正、减少为负。三种「零」的情形最值得记住：</p>
    <p>绝热过程 <Katex tex="Q=0" />，于是 <Katex tex="\Delta U=W" />——内能的改变完全由做功给出，这就是打气筒发烫的原因；体积不变时 <Katex tex="W=0" />，于是 <Katex tex="\Delta U=Q" />——等容加热、等容冷却时热量全部变成内能的增减；理想气体温度不变时 <Katex tex="\Delta U=0" />，于是 <Katex tex="Q=-W" />——气体等温膨胀所做的功恰好等于它吸收的热量。</p>
    <p>定律的实质是能量守恒：内能不会凭空产生，也不会凭空消失，它只在物体之间、在功与热之间转移和转化。第一定律只讲「有多少能量变了、从哪儿来、到哪儿去」，不讲过程能不能自发发生——后者是下一章的任务。</p>

    <h3 class="sec" id="h4-proc">四种典型过程</h3>
    <p>把第一定律套到上一章那几种过程上，每种过程的样子立刻清楚。</p>
    <p><strong>等容过程</strong>：体积不变，<Katex tex="W=0" />，<Katex tex="\Delta U=Q" />。吸热就升温，放热就降温，热量全部用于改变内能。高压锅密封加热时气体体积基本不变，压强与温度一起升高，走的就是这条路。</p>
    <p><strong>等压过程</strong>：压强不变，体积随温度变，<Katex tex="W=-p\,\Delta V" />。气体吸热后一部分用来升温、一部分用来对外做功，所以同样升温 <Katex tex="\Delta T" />，等压比等容要多吸一些热。上面那块等压加热的板画的正是这一档。</p>
    <p><strong>等温过程</strong>：温度不变，<Katex tex="\Delta U=0" />，于是 <Katex tex="Q=-W" />：吸进来的热量一点不留，全部变成对外做的功。反过来，等温压缩时外界做的功全部以热量形式放出。</p>
    <p><strong>绝热过程</strong>：不吸热也不放热，<Katex tex="\Delta U=W" />。绝热压缩升温、绝热膨胀降温，柴油机靠绝热压缩把空气压到几百度、让喷入的柴油自行着火，用的就是这一条。</p>
    <p>四种过程可以放在一张表里对照：看的是哪个量被按住不动、哪个量为零，再由第一定律推出剩下的关系。判断过程类型时，先问「体积变不变」，再看「有没有热交换」，两问一定，式子就定下来了。</p>

    <h3 class="sec" id="h4-apply">算一遍：等压加热</h3>
    <p>取 0.1 mol 的理想气体，初态温度 300 K、体积 20 L。在等压下缓慢加热，吸收 300 J 热量。先算它升温多少。</p>
    <p>演示里的内能按 <Katex tex="U=\tfrac{3}{2}nRT" /> 计，于是 <Katex tex="\Delta U=\tfrac{3}{2}nR\,\Delta T" />；等压下气体对外做功 <Katex tex="W_{\text{气}}=nR\,\Delta T" />，由第一定律</p>
    <p style="text-align:center"><Katex tex="Q=\Delta U+W_{\text{气}}=\tfrac{5}{2}nR\,\Delta T." display /></p>
    <p>代入 <Katex tex="n=0.1\ \text{mol}" />、<Katex tex="R=8.31\ \text{J/(mol}\cdot\text{K)}" />、<Katex tex="Q=300\ \text{J}" />，算得</p>
    <p style="text-align:center"><Katex tex="\Delta T=\frac{Q}{2.5\,nR}=\frac{300}{2.5\times0.1\times8.31}\approx 144\ \text{K}." display /></p>
    <p>温度升到 444 K。其中进到内能的是 <Katex tex="\Delta U=\tfrac{3}{2}nR\,\Delta T\approx 180\ \text{J}" />，变成对外做功的是 <Katex tex="W_{\text{气}}\approx 120\ \text{J}" />，两块加起来 300 J，与吸热对得上。换成记账方向，外界对气体做的功是 <Katex tex="W=-120\ \text{J}" />，读数栏的 <Katex tex="\Delta U-(Q+W)" /> 一栏正是 0。</p>
    <p>演示的第二档换成绝热压缩：缸壁保温，<Katex tex="Q=0" />，活塞压下去把体积压到原来的 <Katex tex="1/k" />。单原子理想气体的绝热关系是</p>
    <p style="text-align:center"><Katex tex="TV^{\gamma-1}=\text{常量},\qquad \gamma=\frac{5}{3}," display /></p>
    <p>即 <Katex tex="T=T_0\,k^{2/3}" />，温度随压缩比单调上升；外界做的功全部进入内能，<Katex tex="\Delta U=W" />，p–V 图上那块曲线下面的面积就是它的数值。下面这块板把这一步画出来：缸壁换成保温层，Q 一栏归零，曲线下的橙色面积整个变成内能的增量。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 热4b · <b>绝热压缩：曲线下的面积全部进入内能</b>：缸壁换成橙色的一层保温层、两侧补上隔热的虚线短划，缸底不再加热；活塞杆右侧一支向下的绿色箭头 <Katex tex="W" /> 表示外界正把活塞压下去。右栏 p–V 图换成一条向下弯的曲线，橙色面积从曲线一直填到横轴。看点一：压缩比从 1 走到 2，体积从 20 L 缩到 10 L，压强从 12.5 kPa 升到约 40 kPa，曲线越往左上越陡。看点二：读数栏的 <Katex tex="Q" /> 一栏始终是 0，<Katex tex="\Delta U" /> 与 <Katex tex="W" /> 两行数字相同——没有热交换，内能的增加全部来自外界做的功。看点三：温度从 300 K 升到约 476 K，缸内分子明显跑得更快，曲线下的面积就是这份内能的增量。看点四：把压缩比拖到 2.5，曲线更陡、面积更大、末温更高；拖回 1.3 则一切变小——柴油机把空气压到几百度、让喷进去的柴油自行着火，靠的就是这一条。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：W 的正负按「外界对气体」记。</strong>本章与课本一样，W 取外界对气体做的功。气体膨胀时 W 为负，读数栏「外界做功」那一栏就会出现负号。做题时先确认题目用的是哪套约定，整套式子跟着它走，别中途换口径。</li>
        <li><strong>提示二：把热量当成状态量。</strong>「气体含有 300 J 热量」这种说法不成立——内能、温度是状态量，热量与功是过程量。同一初末态之间可以吸收 300 J 做 300 J 功，也可以吸 100 J 做 100 J 功，只要内能变化相同。</li>
        <li><strong>提示三：以为体积不变就没有能量交换。</strong>等容过程 <Katex tex="W=0" />，但 <Katex tex="\Delta U=Q" /> 仍然成立：加热密闭容器，压强与温度一起升高，热量照样全进内能。反过来，绝热压缩时没有热传递，内能也照样变。</li>
        <li><strong>提示四：把 <Katex tex="\Delta U" /> 与温度变化割开。</strong>理想气体的内能只由温度决定，等温过程 <Katex tex="\Delta U=0" />，吸的热全部转成对外做功；温度一变，内能必变，与体积是胀是缩无关。先判温度怎么变，再判内能怎么变，最后才回去分 Q 与 W。</li>
      </ul>
    </div>
    <p>回收与预告：这一章先把内能定在「分子动能与势能之和」上，再让做功与热传递两条途径各自改它，最后合成 ΔU = Q + W，并把它套到等容、等压、等温、绝热四种过程上。第一定律回答的是「能量变了多少、从哪儿来」；它并不禁止任何方向的过程——热可以从冷物体流向热物体吗，第二类永动机为什么造不出来，这些留给下一章的热力学第二定律。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('firstlawIso');
const DEMO2 = demoOf('firstlawAdi');
</script>
