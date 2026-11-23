<template>
  <PhysicsCh id="mag3"
    sub="安培力是磁场对整段通电导线的作用，把它分摊到每个载流子身上，就是洛伦兹力。这一章先写出单个电荷受力的大小与方向，再由「力始终垂直于速度」推出圆周运动，得到半径与周期的两个式子；最后把「洛伦兹力不做功」与「安培力做功」这两句看似相反的话放在同一块板上拆开核对。"
    :toc="[
      { id: 'm3-size', t: '洛伦兹力的大小与方向' },
      { id: 'm3-circle', t: '为什么是圆周运动' },
      { id: 'm3-radius', t: '半径、周期与频率' },
      { id: 'm3-work', t: '洛伦兹力不做功，安培力为什么做功' },
      { id: 'm3-calc', t: '算一遍' },
      { id: 'm3-helix', t: '速度与磁场不垂直：螺旋线' },
    ]">
    <div class="note good">
      运动电荷在磁场中受到的力叫<strong>洛伦兹力</strong>，大小 <Katex tex="F=qvB\sin\theta" />，<Katex tex="\theta" /> 是速度与磁场的夹角；速度与磁场垂直时 <Katex tex="F=qvB" />。方向用左手定则判断，正电荷的四指指向速度方向，负电荷则相反。洛伦兹力始终垂直于速度，只改变运动方向、不做功；在匀强磁场中垂直射入的电荷做匀速圆周运动，半径与周期分别是
      <Katex tex="r=\frac{mv}{qB},\qquad T=\frac{2\pi m}{qB}." />
    </div>

    <h3 class="sec" id="m3-size">洛伦兹力的大小与方向</h3>
    <p>上一章讲了安培力：通电导线在磁场中受力 <Katex tex="F=BIL\sin\theta" />。导线里的电流由大量定向移动的电荷形成，安培力也就是这些电荷各自受力的总和。把一段长 <Katex tex="L" />、电流 <Katex tex="I" /> 的导线看成载有 <Katex tex="N" /> 个电荷、每个电荷以速度 <Katex tex="v" /> 运动，则电流 <Katex tex="I=nqvS" />、导线中的电荷总数 <Katex tex="N=nSL" />，逐个分摊得到</p>
    <p style="text-align:center"><Katex tex="F_{\text{洛}}=\frac{BIL}{N}=\frac{B\,(nqvS)\,L}{nSL}=qvB." display /></p>
    <p>推导时用了 <Katex tex="\theta=90^\circ" /> 的情形，一般式再把夹角补上：</p>
    <p style="text-align:center"><Katex tex="F=qvB\sin\theta." display /></p>
    <p>由此可以分出三档：速度与磁场垂直时力最大 <Katex tex="qvB" />；成夹角时按 <Katex tex="\sin\theta" /> 折减；速度与磁场平行时 <Katex tex="\theta=0^\circ" /> 或 <Katex tex="180^\circ" />，<Katex tex="F=0" />，电荷不受力，沿直线匀速前进。</p>
    <p>方向仍用<strong>左手定则</strong>：伸开左手，让磁感线穿入掌心，四指指向<strong>正电荷运动的方向</strong>，拇指所指就是洛伦兹力方向。若讨论的是电子这样的负电荷，四指要指向速度的<strong>反方向</strong>，或者先用四指指速度、再把结论反过来。这一点与安培力的定则完全一致——安培力的四指指的就是电流方向，而电流方向对负电荷来说正是它运动的反方向。</p>

    <h3 class="sec" id="m3-circle">为什么是圆周运动</h3>
    <p>由左手定则可以看出一条关键性质：洛伦兹力<strong>始终垂直于速度</strong>。速度在纸面内，力就在垂直于纸面的方向上；速度转了方向，力也跟着转，永远与速度成直角。</p>
    <p>垂直于速度的力不做功，这一点在力学里已经用过：功率 <Katex tex="P=Fv\cos90^\circ=0" />。所以洛伦兹力只改变速度的方向，不改变速率，电荷的动能保持不变。</p>
    <p>速率不变、力始终指向一侧且大小不变，这正是<strong>匀速圆周运动</strong>的条件。力指向圆心，充当向心力。于是可以把向心力公式与洛伦兹力公式并排写出来：</p>
    <p style="text-align:center"><Katex tex="qvB=\frac{mv^2}{r}." display /></p>
    <p>两边同除以 <Katex tex="v" /> 再解出 <Katex tex="r" />，就得到半径的式子。下面这块板画的就是这一条：绿箭头是速度，紫箭头是洛伦兹力，两者始终垂直；质子沿逆时针方向转，紫箭头一直指向圆心。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 电10a · <b>洛伦兹力与圆周运动</b>：叉号铺满左栏表示磁场垂直纸面向里，橙色圆点是质子，虚线圆是它的轨道，绿箭头是速度、紫箭头是洛伦兹力。看点一：粒子转到哪个位置，紫箭头都与绿箭头成直角、始终指向圆心，力只改变速度的方向。看点二：整圈转下来绿箭头的长度不变，读数栏的速率一行也不动——垂直速度的力不做功，动能守恒，电荷才能一直按同一个圆走下去。看点三：把 B 拖大，轨道按反比收缩，右栏橙点沿曲线向右下方滑；把 v 调大，左栏的圆随之放大（放到画框边上为止），读数栏的 r 一行按正比翻倍，右栏纵轴的上限也跟着换一档。看点四：虚线圆按 r 成比例画出，粒子始终贴着它走，不会越转越偏。屏幕上的圆只作定性示意，真值一律看读数栏。</p>

    <h3 class="sec" id="m3-radius">半径、周期与频率</h3>
    <p>由 <Katex tex="qvB=mv^2/r" /> 解出</p>
    <p style="text-align:center"><Katex tex="r=\frac{mv}{qB}." display /></p>
    <p>半径与速率成正比、与磁感应强度成反比。速率越大轨道越平展，磁场越强轨道越紧。下面这块板右栏的双曲线就是 <Katex tex="r" /> 随 <Katex tex="B" /> 的变化：拖 <Katex tex="B" />，橙点沿曲线滑动；把 <Katex tex="v" /> 调大，曲线上每一点的读数按同一比例变大，读数栏的 <Katex tex="r" /> 一行按正比翻倍，而曲线在框里的形状不变——纵轴的上限是按当前的 <Katex tex="v" /> 现算的。</p>
    <p>再看走完一整圈用的时间。圆周周长 <Katex tex="2\pi r" />，速率 <Katex tex="v" />，所以</p>
    <p style="text-align:center"><Katex tex="T=\frac{2\pi r}{v}=\frac{2\pi}{v}\cdot\frac{mv}{qB}=\frac{2\pi m}{qB}." display /></p>
    <p>速率在分子上被消掉了——<strong>周期与速率无关</strong>。跑得快时半径变大、路程变长，正好抵消。这是一个不常遇到的结论：同一个电荷在同一个磁场里，无论以多大速率射入，绕一圈的时间都一样。频率 <Katex tex="f=1/T=qB/(2\pi m)" /> 也只由荷质比与磁场决定。</p>
    <p>这一点被用来做<strong>回旋加速器</strong>：交变电压的周期要与电荷的转动周期相同，才能每次经过缝隙都被加速。因为 <Katex tex="T" /> 不随速率变，这个同步条件在非相对论范围内一直成立。</p>
    <p>这两个式子里的 <Katex tex="q" />、<Katex tex="v" /> 都只取大小：电荷变号时受力方向随之反过来，转向相反，而半径与周期两个数不变。下面这块板把两件事摆在一起——单个电荷受的洛伦兹力为什么不做功，整段导线受的安培力为什么又做功。</p>

    <h3 class="sec" id="m3-work">洛伦兹力不做功，安培力为什么做功</h3>
    <p>上一章算过：通电导线在磁场中受安培力，导线一动它就做功，电动机正是靠这一支力转起来的。可本章又刚说洛伦兹力垂直于速度、功率恒为零。两句话都对，中间少的那一环是<strong>电荷的真实速度到底指向哪里</strong>。</p>
    <p>把一根导体棒横放在两根竖直导轨之间，电流由左向右，磁场垂直纸面向里。由左手定则，安培力 <Katex tex="F=BIL" /> 沿导轨向上，与棒的运动方向相同，这一支做正功，功率为 <Katex tex="Fv_{\text{杆}}" />。</p>
    <p>再看棒里一个正电荷。它相对棒以速度 <Katex tex="v_{\text{漂}}" /> 向右漂移，而棒本身正带着它以 <Katex tex="v_{\text{杆}}" /> 向上走，两者合成一个斜向右上的真实速度 <Katex tex="\mathbf{v}" />。洛伦兹力垂直于的是这个<strong>合速度</strong>，不是单纯向右的漂移速度，所以它的方向既不沿棒、也不垂直于棒，而是斜向左上。把它沿导线分解，得到两支：</p>
    <p style="text-align:center"><Katex tex="F_{\parallel}=qBv_{\text{杆}},\qquad F_{\perp}=qBv_{\text{漂}}." display /></p>
    <p><Katex tex="F_{\parallel}" /> 沿导线、指向与电流相反，与漂移速度反向，功率 <Katex tex="-qBv_{\text{杆}}v_{\text{漂}}" />，是负的；<Katex tex="F_{\perp}" /> 垂直导线、指向与棒的运动相同，功率 <Katex tex="+qBv_{\text{漂}}v_{\text{杆}}" />，是正的。两支的功率<strong>大小相等、符号相反</strong>，合计为零——洛伦兹力对单个电荷做的总功确实恒为零，前几节的结论没有动摇。</p>
    <p>关键在于这两支并不停留在电荷身上。纵向支 <Katex tex="F_{\parallel}" /> 由棒对电荷的支持力抵消，它做的负功最终落在电源上：棒切割磁感线产生感应电动势 <Katex tex="\varepsilon=BLv_{\text{杆}}" />，方向与电流相反，电源必须多供 <Katex tex="\varepsilon I" /> 的功率，这笔输入恰好等于被扣掉的那一支。</p>
    <p>横向支 <Katex tex="F_{\perp}" /> 则对这段导线里的全部载流子求和：<Katex tex="nSL" /> 个电荷、每个 <Katex tex="qBv_{\text{漂}}" />，乘起来正是 <Katex tex="BIL" />。换言之，<strong>安培力就是洛伦兹力的横向分量</strong>，「安培力做的功」只是洛伦兹力两个分量里做正功的那一支，另一支由电源补上。机械能与电能经由这两支互相转移，洛伦兹力本身既不产生也不消耗能量。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 电10b · <b>洛伦兹力不做功，安培力却做功</b>：导体棒横放在两根竖直导轨之间，电流由左向右，磁场垂直纸面向里（叉号），安培力沿导轨向上，棒以不变速率上移。看点一：棒里的橙点一边沿棒向右漂、一边被棒带着上移，真实速度是对角线方向；右栏上格把这个合速度画成 <Katex tex="\mathbf{v}=\mathbf{v}_{\text{漂}}+\mathbf{v}_{\text{杆}}" /> 的平行四边形。看点二：右栏下格把洛伦兹力拆成两支——沿导线的 <Katex tex="F_{\parallel}" /> 逆着电流、做负功，垂直导线的 <Katex tex="F_{\perp}" /> 顺着运动方向、做正功，两支的功率大小相等、符号相反，合计为零。看点三：读数栏的「安培力做功的功率」与「电源多供的功率 <Katex tex="\varepsilon I" />」两行始终相等，拖 B、I、L、<Katex tex="v_{\text{杆}}" /> 四个滑块都推不动这一对——横向分量就是安培力，纵向分量的负功由电源补上。</p>

    <h3 class="sec" id="m3-calc">算一遍</h3>
    <p>质子 <Katex tex="m=1.67\times10^{-27}\ \text{kg}" />、<Katex tex="q=1.6\times10^{-19}\ \text{C}" />，以 <Katex tex="v=3.0\times10^{5}\ \text{m/s}" /> 垂直射入 <Katex tex="B=0.50\ \text{T}" /> 的匀强磁场。</p>
    <p>轨道半径</p>
    <p style="text-align:center"><Katex tex="r=\frac{mv}{qB}=\frac{1.67\times10^{-27}\times3.0\times10^{5}}{1.6\times10^{-19}\times0.50}=6.3\times10^{-3}\ \text{m}," display /></p>
    <p>约 6.3 mm。转动周期</p>
    <p style="text-align:center"><Katex tex="T=\frac{2\pi m}{qB}=\frac{2\pi\times1.67\times10^{-27}}{1.6\times10^{-19}\times0.50}=1.3\times10^{-7}\ \text{s}," display /></p>
    <p>约 0.13 μs。把速率加到两倍，半径翻倍、周期不动——图 电10a 那块板里把 <Katex tex="v" /> 从 3 拖到 6，画面上的圆直径变大，而读数栏里的 <Katex tex="T" /> 一行纹丝不动。</p>
    <p>读数栏还能逐行核对：它给出 <Katex tex="r" />、<Katex tex="T" />、<Katex tex="f" /> 与 <Katex tex="r\cdot B" />、<Katex tex="mv/q" /> 两行。后两行始终相等，因为由 <Katex tex="r=mv/(qB)" /> 两边乘 <Katex tex="B" /> 就得到 <Katex tex="rB=mv/q" />——把 <Katex tex="B" /> 拖来拖去，它推不动这两行。</p>

    <h3 class="sec" id="m3-helix">速度与磁场不垂直：螺旋线</h3>
    <p>前面几节都假定速度与磁场垂直。若质子以速度 <Katex tex="v" /> 斜着射入匀强磁场、与磁场方向成 <Katex tex="\alpha" /> 角，处理办法仍是分解，只是这次按磁场方向与垂直磁场的方向来分：</p>
    <p style="text-align:center"><Katex tex="v_{\parallel}=v\cos\alpha,\qquad v_{\perp}=v\sin\alpha." display /></p>
    <p>平行分量与磁场同向，<Katex tex="F=qv_{\parallel}B\sin0^\circ=0" />，不受洛伦兹力，沿磁感线保持匀速；垂直分量照旧受 <Katex tex="qv_{\perp}B" /> 的力，在垂直于磁场的平面里做匀速圆周运动。两者的分解互相独立，叠在一起就是一条<strong>螺旋线</strong>。圆的半径由垂直分量决定：</p>
    <p style="text-align:center"><Katex tex="r=\frac{mv_{\perp}}{qB}=\frac{mv\sin\alpha}{qB}," display /></p>
    <p>周期 <Katex tex="T=2\pi m/(qB)" /> 里只剩荷质比与磁场，斜射入时也是它。转完一圈的这段时间里，粒子沿磁场方向前进了</p>
    <p style="text-align:center"><Katex tex="p=v_{\parallel}T=\frac{2\pi m v\cos\alpha}{qB}," display /></p>
    <p>这个距离叫<strong>螺距</strong>。两式相除得 <Katex tex="p/r=2\pi\cot\alpha" />：螺距与半径的比只由夹角决定，磁场强弱与速度大小只把整条螺旋整体缩放——磁场越强，圈越紧越小；速度越大，圈与圈的间距一起舒展。</p>
    <p>两端的退化情形把前面的结论接了回来：<Katex tex="\alpha=90^\circ" /> 时 <Katex tex="v_{\parallel}=0" />，螺距为零，螺旋退成平面上的圆；<Katex tex="\alpha=0^\circ" /> 时 <Katex tex="v_{\perp}=0" />，半径为零，粒子沿磁感线走直线、不受力。中间的角度给出介于两者之间的螺旋。地磁场困住带电粒子形成辐射带，质谱仪与磁约束装置里把束流导向目标，用的都是这条轨迹。</p>

    <PhysicsDemo :def="DEMO3" />
    <p class="cap">图 电10c · <b>洛伦兹力的螺旋线</b>：紫色小点沿蓝色螺旋线前进，灰色箭头是沿轴向的磁场 <Katex tex="\mathbf{B}" />，青色虚线是起点处的圆截面，橙色双箭头量出一圈前进的螺距 <Katex tex="p" />。粒子处画三支箭头：橙是沿磁场的 <Katex tex="v_{\parallel}" />、青是垂直磁场的 <Katex tex="v_{\perp}" />（两者垂直，随粒子一起转），绿是合速度 <Katex tex="\mathbf{v}" />，始终与螺旋线相切；青色虚线半径由轴线量到粒子。看点一：把「与 B 的夹角 α」往 90° 拖，螺距迅速缩短、圈变得扁平，往小拖则螺旋被拉长——读数栏的 <Katex tex="r" />、<Katex tex="p" /> 与画面上的比例同步变。看点二：拖「磁感应强度 B」或「速度 v」，读数栏的半径、周期、螺距一起按比例缩放，而画面形状不变，因为 <Katex tex="p/r" /> 只由 α 决定；粒子在画面上一圈所用的时间也不变，它只是示意用的时钟。看点三：读数栏最后一行把 <Katex tex="r\cdot B" /> 与 <Katex tex="mv_{\perp}/q" /> 并排列出，拖 B 时两数一起变、始终相等，正是半径公式的逐行核验。看点四：按住画面拖动可以转视角，正对磁场方向看时螺旋缩成圆，从侧面看时螺距才展得开。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把负电荷的四指指成速度方向。</strong>左手定则的四指指的是<strong>正电荷</strong>的运动方向。电子、负离子要先反一次，或者四指反指速度。判断错了，整段圆周的转向就画反了。</li>
        <li><strong>提示二：以为洛伦兹力会改变速率。</strong>力始终垂直于速度，做功为零，速率与动能都不变。凡是「电荷越转越快」「磁场让它加速」的说法都不成立；磁场只改方向。它虽然不做功，但它的横向分量可以充当安培力、把机械能与电能互相搬运，这一点图 电10b 已把两支的功率逐项对过。</li>
        <li><strong>提示三：把 <Katex tex="T" /> 也写成随速率变化。</strong>半径正比于速率、周期与速率无关，两者不要一起套。运动更快的电荷走更大的圆，走一圈的时间不变。</li>
        <li><strong>提示四：忽略速度与磁场不垂直的情形。</strong>斜射入时把速度分解成平行与垂直的两个分量：垂直分量提供向心力，做圆周运动；平行分量不受力，保持匀速。两者合成是螺旋线，不是平面上的圆。</li>
      </ul>
    </div>
    <p>回收与预告：本章把安培力分摊到单个电荷，得到洛伦兹力，并用它解释了带电粒子在磁场中为什么做圆周运动。到此「电」与「磁」各自的规律已经齐备。下一部分开始讲两者之间的转化：变化的磁通量会在导体回路里激起电流，这就是电磁感应，第一个要讲的是判定感应电流方向的楞次定律。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('lorentz2');
const DEMO2 = demoOf('lorentzwork');
const DEMO3 = demoOf('helix');
</script>
