<template>
  <PhysicsCh id="circ2"
    sub="小球在竖直平面内的圆轨道上运动，速率由能量决定：越往上越慢。任意位置的径向方程是 T − mg cos φ = mv²/r。轻绳只能拉不能推，最高点的张力不能为负，这给出过顶的临界条件 v ≥ √(gr)；轻杆既能拉也能推，最高点的速度可以为零。恰好过顶时，最低点的速度是 √(5gr)、张力是 6mg。"
    :toc="[
      { id: 'c2-model', t: '轻绳与轻杆' },
      { id: 'c2-top', t: '最高点的临界条件' },
      { id: 'c2-any', t: '任意位置的速度与张力' },
      { id: 'c2-app', t: '过山车与水流星' },
    ]">
    <div class="note good">
      竖直平面内的圆周运动与水平面内的不同：重力的方向与半径的夹角一路在变，速率也随之变化，不能再当作匀速圆周运动处理。办法仍是两步——先用机械能守恒（或动能定理）求出各处的速率
      <Katex tex="v^2=v_0^2-2gr\left(1-\cos\varphi\right)" />（<Katex tex="\varphi" /> 从最低点量起），再在径向列牛顿第二定律
      <Katex tex="T-mg\cos\varphi=\frac{mv^2}{r}" />，即 <Katex tex="T=\dfrac{mv^2}{r}+mg\cos\varphi" />。
      约束的差别只在一点：轻绳的张力 <Katex tex="T\ge 0" />，轻杆的力可正可负。最高点 <Katex tex="\varphi=\pi" /> 处 <Katex tex="T=\dfrac{mv^2}{r}-mg" />，于是轻绳过顶要求 <Katex tex="v\ge\sqrt{gr}" />，轻杆只要求 <Katex tex="v\ge 0" />。
    </div>

    <h3 class="sec" id="c2-model">轻绳与轻杆</h3>
    <p>先看两种约束在物理上的区别。轻绳（不可伸长）只能提供沿绳指向固定点的拉力，力的方向只能向内；轻杆（刚性）既可以拉，也可以推，力的方向可以是向内，也可以是向外。轻质圆管、圆环轨道、硬质圆轨道都属于「杆」一类：小球在管内壁上走，内壁可以向外推。</p>
    <p>这个差别在圆的最低点看不出来——那里重力也指向外侧，绳与杆都只需要向上拉。差别出现在圆的上半部分：速率慢到一定成度，重力的分量已经超过所需的向心力，多出来的部分必须由约束向外顶住。绳子顶不住，于是松弛、脱离；杆顶得住，照旧走圆。</p>
    <p>把约束力记作 <Katex tex="T" />（取指向圆心为正），沿径向列式：</p>
    <p style="text-align:center"><Katex tex="T-mg\cos\varphi=\frac{mv^2}{r}," display /></p>
    <p>其中 <Katex tex="\varphi" /> 是从最低点量起的圆心角，<Katex tex="mg\cos\varphi" /> 是重力沿半径指向圆心的分量（最低点为正，最高点为负）。解出</p>
    <p style="text-align:center"><Katex tex="T=\frac{mv^2}{r}+mg\cos\varphi." display /></p>

    <h3 class="sec" id="c2-top">最高点的临界条件</h3>
    <p>最高点 <Katex tex="\varphi=\pi" /> 时 <Katex tex="\cos\varphi=-1" />，约束力最小：</p>
    <p style="text-align:center"><Katex tex="T=\frac{mv_{\text{顶}}^2}{r}-mg." display /></p>
    <p><strong>轻绳</strong>要求 <Katex tex="T\ge 0" />，于是</p>
    <p style="text-align:center"><Katex tex="v_{\text{顶}}\ \ge\ \sqrt{gr}." display /></p>
    <p>取等号时绳的拉力恰好为零，重力独自提供向心力，<Katex tex="mg=\dfrac{mv^2}{r}" />。这是「恰好通过最高点」的临界状态，再慢一点绳子就松弛，小球在到达最高点之前离开圆轨道。</p>
    <p><strong>轻杆</strong>没有这条限制。<Katex tex="v_{\text{顶}}=0" /> 时杆的力是 <Katex tex="T=-mg" />，方向向外，恰好托住小球，此时小球在最高点静止，随后沿轨道下滑。所以轻杆过顶只需</p>
    <p style="text-align:center"><Katex tex="v_{\text{顶}}\ \ge\ 0." display /></p>
    <p>把能量代进去，两种模型对最低点初速的要求分别是</p>
    <p style="text-align:center"><Katex tex="v_0\ \ge\ \sqrt{5gr}\ \text{（轻绳）},\qquad v_0\ \ge\ 2\sqrt{gr}\ \text{（轻杆）}." display /></p>
    <p>两式的来源同一条能量方程 <Katex tex="v_{\text{顶}}^2=v_0^2-4gr" />，只差最高点对速度的要求不同。中间那一段 <Katex tex="2\sqrt{gr}\le v_0<\sqrt{5gr}" /> 最能说明问题：轻绳模型下小球上不到最高点，会在某个角度脱离轨道；轻杆模型下小球能过顶，只是过顶时速度偏小、杆在向外托。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力17 · <b>竖直平面内的圆周运动</b>：顶部的档位按钮切换「轻绳」与「轻杆」。左栏小球从最低点以 <Katex tex="v_0" /> 出发沿虚线圆运动，绿箭头是速度（越往上越短），橙箭头是重力 <Katex tex="mg" />，蓝箭头是沿半径的约束力（标 <Katex tex="T" /> 还是 <Katex tex="N" /> 取决于方向向内还是向外），绿色弧线是已经走过的部分。右栏画张力随角度 <Katex tex="\varphi" /> 变化的曲线：浅色是公式曲线，蓝色只画小球到得了的那一段，粉点是 <Katex tex="T=0" /> 的位置。看点一：把「最低点速度 v₀」拖到 6 m/s（默认 r = 0.8 m，临界值 <Katex tex="\sqrt{5gr}\approx 6.26" /> m/s），轻绳档下小球跑到上半圆某处，蓝箭头缩到零、球变成粉色按抛体飞出，右栏曲线在那里断开——这就是绳失效。看点二：切到「轻杆」档，同一初速下小球照样过顶，只是经过上半圆时蓝箭头指向外侧、标着 <Katex tex="N" />。看点三：读数栏第二行「最高点张力」在轻绳档恰好过顶时为零，第一行「最高点速度」等于 <Katex tex="\sqrt{gr}" />；按 <Katex tex="v_0=\sqrt{5gr}" /> 配好 r 与 v₀，再看小球经过最低点时的「当前张力」，正是 6mg。</p>

    <h3 class="sec" id="c2-any">任意位置的速度与张力</h3>
    <p>取最低点为重力势能零点，小球在角度 <Katex tex="\varphi" /> 处升高了 <Katex tex="r\left(1-\cos\varphi\right)" />，由机械能守恒</p>
    <p style="text-align:center"><Katex tex="\frac12mv_0^2=\frac12mv^2+mgr\left(1-\cos\varphi\right)," display /></p>
    <p>得</p>
    <p style="text-align:center"><Katex tex="v^2=v_0^2-2gr\left(1-\cos\varphi\right)." display /></p>
    <p>代入径向方程，得到张力随角度的完整表达式：</p>
    <p style="text-align:center"><Katex tex="T=m\frac{v_0^2-2gr\left(1-\cos\varphi\right)}{r}+mg\cos\varphi
      =m\frac{v_0^2}{r}-2mg+3mg\cos\varphi." display /></p>
    <p>这条式子说明三件事。其一，<Katex tex="T" /> 随 <Katex tex="\cos\varphi" /> 线性变化，最高点最小、最低点最大。其二，最高点与最低点的张力之差恒为 <Katex tex="6mg" />，与初速无关。其三，若 <Katex tex="T" /> 在某个角度穿过零，该角度满足</p>
    <p style="text-align:center"><Katex tex="\cos\varphi=\frac{2gr-v_0^2}{3gr}," display /></p>
    <p>它总是落在上半圆（<Katex tex="\cos\varphi\le 0" />），这也印证了「绳失效只发生在上半圆」。</p>
    <p>把 <Katex tex="v_0^2=5gr" />（恰好过顶）代入最低点：</p>
    <p style="text-align:center"><Katex tex="v_{\text{底}}=\sqrt{5gr},\qquad T_{\text{底}}=m\frac{5gr}{r}+mg=6mg." display /></p>
    <p>6mg 是轻绳模型能出现的最大张力，设计过山车轨道、绳环一类装置时，强度要按它留余量。</p>

    <h3 class="sec" id="c2-app">过山车与水流星</h3>
    <p><strong>过山车</strong>的竖直圆环可视为轻绳模型：车厢与轨道之间只能压、不能拉，轨道对车厢的支持力必须指向圆心（车厢在内侧行驶），最高点的条件是 <Katex tex="v\ge\sqrt{gr}" />。设计时让车厢靠重力滑行，入口高度必须留出足够余量，使环顶的速度不低于 <Katex tex="\sqrt{gr}" />；考虑摩擦还要再高一些。</p>
    <p><strong>水流星</strong>是同一模型的演示：盛水的杯子在竖直平面内转动，最高点处水不洒出，靠的正是水的重力已经足够提供向心力。杯底对水的压力 <Katex tex="N=\dfrac{mv^2}{r}-mg\ge 0" />，等价于 <Katex tex="v\ge\sqrt{gr}" />，此时水「想要」飞出去做抛体运动、却被杯底挡住，看起来像是水贴在杯底。转得慢了，<Katex tex="v<\sqrt{gr}" />，重力超过所需的向心力，水就离开杯底洒下来。</p>
    <p>桥梁与凹坑是两个相反的例子。汽车通过圆弧形拱桥的顶点时，重力向下、支持力向上，两者之差提供向心力：<Katex tex="mg-N=\dfrac{mv^2}{R}" />，所以 <Katex tex="N<mg" />，速度越大车越「轻」，<Katex tex="v=\sqrt{gR}" /> 时支持力降为零，车要腾空。通过凹形路面最低点时 <Katex tex="N-mg=\dfrac{mv^2}{R}" />，<Katex tex="N>mg" />，轮胎要承受比车重更大的压力。同一个模型，方向不同，结论就相反。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把轻绳模型的条件套到轻杆上。</strong>轻杆最高点允许 <Katex tex="v=0" />，最低点只要 <Katex tex="v_0\ge2\sqrt{gr}" />。判据是「约束能不能向外推」，不是「轨道是不是圆的」。</li>
        <li><strong>提示二：认为小球脱离轨道后仍沿圆运动。</strong>绳张力一旦需要为负，绳立即松弛，此后小球只受重力，做斜抛运动。抛出的位置与速度可由该点的角度与 <Katex tex="T=0" /> 反解出来。</li>
        <li><strong>提示三：忘记径向方程里的重力分量。</strong>最高点是 <Katex tex="T=\dfrac{mv^2}{r}-mg" />，不是 <Katex tex="\dfrac{mv^2}{r}" />；最低点是加号。写成「张力等于向心力」只在水平面内成立。</li>
        <li><strong>提示四：把恰过最高点的最低点速度记成 <Katex tex="\sqrt{gr}" />。</strong><Katex tex="\sqrt{gr}" /> 是最高点的速度，最低点的速度还要加上高度差的能量，是 <Katex tex="\sqrt{5gr}" />。</li>
      </ul>
    </div>
    <p>回收与预告：本节处理的是「供给完全够用」的一侧——绳与杆在每一点都能提供所需的径向力，只是绳的供给有上界。把这个问题反过来问：如果供给有上限，而需要的向心力超过了上限，物体将会怎样运动？这正是力18 的离心现象，转盘上物块滑出、汽车转弯打滑、离心机分离，都是同一件事。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('circ2');
</script>
