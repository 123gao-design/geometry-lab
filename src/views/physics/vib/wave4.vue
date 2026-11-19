<template>
  <PhysicsCh id="wave4"
    sub="波1 用波长、周期、频率与波速四个量把波描述清楚了，波2 说明了两张图各自怎么读，波3 用相位差解释了干涉的加强与减弱。这一章把这几个量收进一条式子，回答一个更基本的问题：距离波源 x 处的质点，此刻究竟在重复波源的哪一段运动。答案是它落后了 Δt = x/v，由此得到 y = A sin(ωt − kx)。方程写出来之后，波数、相位差、同相与反相、传播方向的符号、两张图的读法、质点速度与波形斜率的关系，都能由它直接读出，最后落到波动方程上。"
    :toc="[
      { id: 'w4-lag', t: '相位滞后' },
      { id: 'w4-k', t: '波数与方程的标准形' },
      { id: 'w4-eq', t: '相位与它决定的状态' },
      { id: 'w4-phase', t: '相位差、同相与反相' },
      { id: 'w4-dir', t: '传播方向藏在符号里' },
      { id: 'w4-graph', t: '一条方程，两张图' },
      { id: 'w4-vel', t: '质点速度与波形斜率' },
      { id: 'w4-wave', t: '波动方程' },
      { id: 'w4-calc', t: '算一遍' },
    ]">
    <div class="note good">
      <strong>沿 x 轴正方向传播的简谐波，方程写作</strong>
      <Katex tex="y=A\sin(\omega t-kx)" />，其中 <Katex tex="\omega=2\pi f" />、<Katex tex="k=2\pi/\lambda" />、<Katex tex="v=\omega/k=\lambda f" />。
      括号里的整体 <Katex tex="\omega t-kx" /> 叫<strong>相位</strong>：随 <Katex tex="t" /> 增大，它描述这一点沿自己的振动循环往前走；随 <Katex tex="x" /> 增大，它变小，说的是<strong>离波源越远的点相位越落后</strong>。
      相距 <Katex tex="\Delta x" /> 的两点相位差为 <Katex tex="\Delta\varphi=2\pi\Delta x/\lambda" />：距离是 <Katex tex="\lambda" /> 的整数倍时同相，是半波长的奇数倍时反相。
      质点的振动速度 <Katex tex="v_y=\partial y/\partial t=-v\,\partial y/\partial x" />，与波速 <Katex tex="v" /> 是两回事；把方程对 <Katex tex="t" />、对 <Katex tex="x" /> 各求两次偏导，就得到<strong>波动方程</strong> <Katex tex="\partial^2y/\partial t^2=v^2\,\partial^2y/\partial x^2" />。
    </div>

    <h3 class="sec" id="w4-lag">相位滞后</h3>
    <p>取一根足够长的绳，左端由人手上下抖动，右端伸向远处。把波源所在的位置取作 <Katex tex="x=0" />，设它在竖直方向按</p>
    <p style="text-align:center"><Katex tex="y(0,t)=A\sin\omega t" display /></p>
    <p>振动，其中 <Katex tex="A" /> 是振幅、<Katex tex="\omega" /> 是角频率。波沿绳向右传播，速度是 <Katex tex="v" />。现在问：坐标 <Katex tex="x" /> 处的那一小段绳，此刻在做什么？</p>
    <p>它所做的，正是波源在 <Katex tex="x/v" /> 秒之前做过的那一下。振动从波源传到那里需要时间</p>
    <p style="text-align:center"><Katex tex="\Delta t=\frac{x}{v}，" display /></p>
    <p>这段时间里，波源已经又走过了自己振动的一段。等振动到达 <Katex tex="x" /> 处，那里的小段才开始做波源早就做过的那段运动。因此 <Katex tex="x" /> 处此刻的位移，等于波源在 <Katex tex="t-\Delta t" /> 时刻的位移：</p>
    <p style="text-align:center"><Katex tex="y(x,t)=y(0,\,t-\Delta t)=A\sin\left[\omega\left(t-\frac{x}{v}\right)\right]." display /></p>
    <p>这个式子把波1 的两条结论一并写进了数学里。<strong>振幅处处都是 <Katex tex="A" /></strong>：每个质点做的是同一份振动，只是起步有先后（这里略去介质对振动的吸收）。<strong>角频率处处都是 <Katex tex="\omega" /></strong>，与 <Katex tex="x" /> 无关：频率由波源决定，波传到多远，那里就跟到多快。</p>
    <p>图像上说得更清楚。<strong>把波源的位移—时间图整条向右平移 <Katex tex="\Delta t" />，就得到 <Katex tex="x" /> 处质点的位移—时间图</strong>——形状一模一样，只是所有事情都晚发生一段时间。下面那块板右上的两条曲线正是这样：橙色虚线是波源，绿色实线是点 P，两条曲线横向错开 <Katex tex="\Delta t=x_0/v" />，纵向读出的位移与斜率完全对应。读数栏里「P 的位移」与「波源在 <Katex tex="t-\Delta t" /> 的位移」两行，就是为了逐帧核验这个等式。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 波4a · <b>波的方程</b>：左栏是某一时刻的稳态波形，橙色为波源（<Katex tex="x=0" />），绿色为查看点 P（<Katex tex="x=x_0" />），绿色竖虚线固定住 P 的位置，P 处的绿箭头是它此刻的振动速度，紫色双箭头量出一个波长。右上把波源（橙虚线）与 P（绿实线）的位移—时间曲线叠在一起：两条曲线形状相同，横向错开 <Katex tex="\Delta t=x_0/v" />，紫色双箭头量出的正是这段滞后。右下是相位差随距离的直线，斜率即波数 <Katex tex="k" />，绿点是同相点 <Katex tex="n\lambda" />、紫点是反相点 <Katex tex="(n+\frac{1}{2})\lambda" />，橙点标出当前的 <Katex tex="x_0" />。看点一：拖动查看点，右上的两条曲线缝宽跟着变，右下的橙点沿直线移动，读数栏里「相位差 <Katex tex="kx_0" />」与「<Katex tex="2\pi x_0/\lambda" />」两行始终相等。看点二：把 <Katex tex="x_0" /> 拖到绿点处，两条振动曲线完全重合，相位差是 <Katex tex="2\pi" /> 的整数倍；拖到紫点处，两条曲线正好上下相反，相位差是 <Katex tex="\pi" /> 的奇数倍。看点三：读数栏里「P 的位移」与「波源在 <Katex tex="t-\Delta t" /> 的位移」逐帧相等，这就是 <Katex tex="y(x,t)=y(0,t-x/v)" />。看点四：「<Katex tex="v_y" />」「波形斜率」「<Katex tex="-v\cdot(\partial y/\partial x)" />」三行中第三行始终等于第一行，拖动任何滑块都不破坏，这就是 <Katex tex="v_y=-v\,\partial y/\partial x" />。</p>

    <p>若波源起振时并不在平衡位置，比如 <Katex tex="y(0,t)=A\sin(\omega t+\varphi_0)" />，同样的推理给出 <Katex tex="y=A\sin(\omega t-kx+\varphi_0)" />，结构没变，只是多了一个初相。<Katex tex="\varphi_0" /> 由波源起振的时机决定，与介质、与 <Katex tex="x" /> 都无关。本章其余部分取 <Katex tex="\varphi_0=0" />，相当于把计时起点选在波源经过平衡位置、向正方向运动的时刻。</p>

    <h3 class="sec" id="w4-k">波数与方程的标准形</h3>
    <p>把上一节的括号展开：</p>
    <p style="text-align:center"><Katex tex="\omega\left(t-\frac{x}{v}\right)=\omega t-\frac{\omega}{v}\,x." display /></p>
    <p>系数 <Katex tex="\omega/v" /> 在波的问题里反复出现，单独给它一个名字。代入 <Katex tex="\omega=2\pi/T" /> 与 <Katex tex="v=\lambda/T" />：</p>
    <p style="text-align:center"><Katex tex="k=\frac{\omega}{v}=\frac{2\pi/T}{\lambda/T}=\frac{2\pi}{\lambda}." display /></p>
    <p><Katex tex="k" /> 叫<strong>波数</strong>（有的教材叫角波数），单位是 <Katex tex="\text{rad/m}" />。它的含义是沿传播方向每走 <Katex tex="1\ \text{m}" />，相位落后的弧度数。走一个完整的波长 <Katex tex="\lambda" /> 时相位落后 <Katex tex="k\lambda=2\pi" />，正好是一个整循环，波形回到原样——这与 <Katex tex="k" /> 的定义一致。</p>
    <p>于是方程写成最常见的形状：</p>
    <p style="text-align:center"><Katex tex="y=A\sin(\omega t-kx)." display /></p>
    <p>如果不用角频率与波数，改用周期与波长直接写，同一个式子是</p>
    <p style="text-align:center"><Katex tex="y=A\sin 2\pi\left(\frac{t}{T}-\frac{x}{\lambda}\right)." display /></p>
    <p>两条写法完全等价：把 <Katex tex="\omega=2\pi/T" />、<Katex tex="k=2\pi/\lambda" /> 代进后一条，就回到前一条。哪一种方便就用哪一种——题目给出周期与波长时用后一条，给出角频率与波速时用前一条。上面第一块板的读数栏把 <Katex tex="\lambda" />、<Katex tex="T" />、<Katex tex="\omega" />、<Katex tex="k" /> 四行并列给出，拖动任意一根滑块，四行与 <Katex tex="v=\omega/k=\lambda f" /> 始终对得上。</p>
    <p>到这里可以看清：<strong>前几章反复用到的几个量，正是方程的系数</strong>。<Katex tex="A" /> 是振幅，<Katex tex="\omega=2\pi f" /> 由频率定出、频率由波源决定，<Katex tex="k=2\pi/\lambda" /> 由波长定出，<Katex tex="v=\omega/k" /> 由介质决定。改振动频率只动 <Katex tex="\omega" />，改介质只动 <Katex tex="v" /> 与随之而来的 <Katex tex="k" />，这是下一节讨论相位差时的基本依据。</p>

    <h3 class="sec" id="w4-eq">相位与它决定的状态</h3>
    <p>方程里 <Katex tex="\omega t-kx" /> 是一个整体，记作</p>
    <p style="text-align:center"><Katex tex="\varphi=\omega t-kx." display /></p>
    <p>它叫<strong>相位</strong>，相当于把这一点在自己的振动循环里走到了哪里。质点此刻的全部状态都由相位决定：位移是 <Katex tex="y=A\sin\varphi" />；振动速度是 <Katex tex="v_y=A\omega\cos\varphi" />，其符号告诉你向上还是向下、大小告诉你快慢。两个点若相位相同，它们的位移相同，振动速度的大小与方向也相同——不只是某一瞬间碰巧位移相等，而是整个状态重合。</p>
    <p>相位随两个变量变化，方向相反：</p>
    <p>固定 <Katex tex="x" />，相位每秒增加 <Katex tex="\omega" />，这一点就沿自己的振动循环走一圈用 <Katex tex="T=2\pi/\omega" /> 秒；固定 <Katex tex="t" />，相位沿 <Katex tex="x" /> 方向每米减少 <Katex tex="k" />，也就是<strong>越远的点相位越小</strong>。式中的负号就是「落后」二字：远处质点在重复波源较早的运动。</p>
    <p>这就确定了传播方向：相位 <Katex tex="\omega t-kx" /> 取固定值的那些点，随时间推移不断向 <Katex tex="+x" /> 方向移动，所以 <Katex tex="y=A\sin(\omega t-kx)" /> 描述的是沿 <Katex tex="+x" /> 传播的波。上面第一块板左栏的波形整体向右移动，箭头标出的就是这条传播方向。</p>
    <p>两条附带的说明。其一，方程里的 <Katex tex="x" /> 是质点平衡位置的坐标，不是质点的位移；质点的位移只有 <Katex tex="y" /> 一个分量，它不随波迁移，这一点波1 已经讲透。其二，正弦与余弦可以互相改写，<Katex tex="\sin\theta=\cos(\theta-\pi/2)" />，两种写法只差一个 <Katex tex="\pi/2" /> 的初相，读出的物理内容完全相同。</p>

    <h3 class="sec" id="w4-phase">相位差、同相与反相</h3>
    <p>取 <Katex tex="x_1" />、<Katex tex="x_2" /> 两点，在同一时刻比较它们的相位：</p>
    <p style="text-align:center"><Katex tex="\varphi_1-\varphi_2=(\omega t-kx_1)-(\omega t-kx_2)=k(x_2-x_1)." display /></p>
    <p>时间项消掉了，相位差只由距离决定。取这个差的大小（严格说是落后量），记为</p>
    <p style="text-align:center"><Katex tex="\Delta\varphi=k\,\Delta x=\frac{2\pi\,\Delta x}{\lambda}." display /></p>
    <p>换算的办法只有一句：<strong>一个波长对应 <Katex tex="2\pi" /> 弧度</strong>。所以 <Katex tex="\Delta x/\lambda" /> 就是「隔了几个波长」，乘 <Katex tex="2\pi" /> 即得弧度。上面第一块板的右下把这条关系画成一条过原点的直线，横轴是距离、纵轴是相位差，斜率正是 <Katex tex="k" />；橙色点是当前的 <Katex tex="x_0" />，它的纵坐标与读数栏「相位差 <Katex tex="kx_0" />」「<Katex tex="2\pi x_0/\lambda" />」两行相等。</p>
    <p>两种最常考的情形：</p>
    <p><strong>同相</strong>：<Katex tex="\Delta\varphi=2n\pi" />，即 <Katex tex="\Delta x=n\lambda" />（<Katex tex="n=1,2,3,\dots" />）。两点状态始终相同，一个到波峰，另一个也到波峰。上面第一块板右下图的绿点标出的就是这些位置。</p>
    <p><strong>反相</strong>：<Katex tex="\Delta\varphi=(2n+1)\pi" />，即 <Katex tex="\Delta x=\left(n+\tfrac{1}{2}\right)\lambda" />。两点位移始终等大反向，一个到波峰，另一个正好到波谷。上面第一块板右下图的紫点标出的就是这些位置。</p>
    <p>把 <Katex tex="x_0" /> 拖到某个绿点附近，读数栏的相位差会靠近 <Katex tex="2\pi" /> 的整数倍；拖到紫点附近，会靠近 <Katex tex="\pi" /> 的奇数倍。同相与反相不是两种孤立的点，而是相位差这条直线上的两类刻度，中间的位置两点既不重合也不相反。</p>
    <p>这条关系也解释了波3 的干涉条件。两个同相波源到某点的路程差为 <Katex tex="\Delta r" /> 时，两列波在该点的相位差就是 <Katex tex="2\pi\Delta r/\lambda" />；路程差是波长的整数倍，相位差是 <Katex tex="2\pi" /> 的整数倍，两列波同相叠加，该点振动加强；路程差是半波长的奇数倍，两列波反相，该点振动减弱。干涉的加强与减弱，就是这一章这条相位差式子的直接后果。</p>

    <h3 class="sec" id="w4-dir">传播方向藏在符号里</h3>
    <p>若波沿 <Katex tex="-x" /> 方向传播，远处的点反而先动，<Katex tex="x" /> 处的相位比 <Katex tex="x=0" /> 处更靠前，方程里的减号要改成加号：</p>
    <p style="text-align:center"><Katex tex="y=A\sin(\omega t+kx)." display /></p>
    <p>检查一下：相位取固定值的点满足 <Katex tex="\omega t+kx=\text{常量}" />，两边对 <Katex tex="t" /> 求导得 <Katex tex="\mathrm{d}x/\mathrm{d}t=-\omega/k=-v" />，确实沿 <Katex tex="-x" /> 方向走。用同样办法检查 <Katex tex="\omega t-kx" />，得 <Katex tex="+\omega/k=+v" />。两式只差一个符号，这个符号就是传播方向。</p>
    <p>判据可以写成一句话：<strong>括号里 <Katex tex="\omega t" /> 与 <Katex tex="kx" /> 异号，波沿 <Katex tex="+x" /> 传播；同号，沿 <Katex tex="-x" /> 传播</strong>。更一般地，<Katex tex="\omega t\mp kx+\varphi_0" /> 中的上下符号决定方向，与 <Katex tex="\varphi_0" /> 无关。</p>
    <p>这里有一个容易看错的地方：写成 <Katex tex="y=A\sin(kx-\omega t)" /> 时，<Katex tex="x" /> 的系数为正，但这条波仍然沿 <Katex tex="+x" /> 传播。因为由三角函数的奇偶性，<Katex tex="\sin(kx-\omega t)=-\sin(\omega t-kx)" />，它与标准形只差一个整体的负号，相当于相位多了 <Katex tex="\pi" />，也就是把每个质点的位移左右翻了个面，传播方向没有改变。判断方向要看 <Katex tex="\omega t" /> 与 <Katex tex="kx" /> 是否<strong>异号</strong>，而不是单看 <Katex tex="kx" /> 前面有没有负号。</p>
    <p>下面那块板把三种写法放在同一根绳上一档一档地看。按钮切换括号里的形式，绿色小点始终跟住一个波峰，读数栏报出这个波峰此刻的位置与它往哪一边移动：第一档与第三档的波峰都向右，只有第二档向左；而第三档的整条曲线与标准形上下对翻，波峰恰好落在标准形的波谷上。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 波4b · <b>传播方向与符号</b>：一根 6 m 长的绳，三档按钮分别取 <Katex tex="\omega t-kx" />、<Katex tex="\omega t+kx" /> 与 <Katex tex="kx-\omega t" />。左上写出当前档的方程，右上箭头标出传播方向，绿色小点是相位取 <Katex tex="\pi/2" /> 的那个点即一个波峰。看点一：切到 <Katex tex="\omega t+kx" /> 档，箭头翻向左，波峰随之向左跑，读数栏「波峰移动」一栏改成「向左」——这是唯一沿 <Katex tex="-x" /> 传播的一档。看点二：切到 <Katex tex="kx-\omega t" /> 档，箭头仍朝右，波峰仍向右跑，背后多出一条淡色虚线画的是标准形 <Katex tex="\omega t-kx" />；两条曲线在每一处高度相反，绿色波峰正落在虚线的波谷上，这就是 <Katex tex="\sin(kx-\omega t)=-\sin(\omega t-kx)" />。看点三：三个档位共用同一组振幅、频率与波速滑块，读数栏的 <Katex tex="\lambda" />、<Katex tex="T" />、<Katex tex="v" /> 在换档时纹丝不动，变的只是符号与方向。</p>

    <h3 class="sec" id="w4-graph">一条方程，两张图</h3>
    <p>同一个方程能画两张图，这正是它比一句话描述好用的地方。</p>
    <p><strong>固定 <Katex tex="x" />，例如只盯住 <Katex tex="x=x_0" /> 那一点</strong>，方程变成 <Katex tex="y=A\sin(\omega t-kx_0)" />，横轴是时间，得到的是这一点的<strong>振动图</strong>。它是一条正弦曲线，周期 <Katex tex="T=2\pi/\omega" />；从图上能读出任意时刻的位移与振动方向，还能读出这一点比波源落后多少。</p>
    <p><strong>固定 <Katex tex="t" />，相当于在某一时刻给整根绳拍一张照片</strong>，方程变成 <Katex tex="y=A\sin(\omega t-kx)" />，横轴是位置，得到的是<strong>波形图</strong>。它也是一条正弦曲线，空间周期即波长 <Katex tex="\lambda=2\pi/k" />；从图上能读出各点此刻的位移，以及任意两点之间的相位关系。</p>
    <p>两张图形状一样，横轴的含义完全不同，读出的周期量也不同：一个是时间上的 <Katex tex="T" />，一个是空间上的 <Katex tex="\lambda" />，而两者由 <Katex tex="\lambda=vT" /> 联系。上面第一块板把两者摆在同一块板里：左栏是波形图，右上是波源与 P 的振动图，两条曲线横向错开的距离就是 <Katex tex="\Delta t=x_0/v" />。</p>
    <p>由波形图判断某点的振动方向，有一个不必算导数的办法。<strong>把整条波形沿传播方向平移一小段</strong>，就看该点此刻的高度与稍后时刻的高度，从而知道它往上还是往下。上面第一块板左栏的波形每帧都在向右移，盯住绿色 P 点上下走的方向，与这条平移法给出的判断一致。下一节会看到，这个办法与 <Katex tex="v_y=-v\,\partial y/\partial x" /> 是同一件事。</p>
    <p>方程还能直接回答两个常考的问题。<strong>一是波传到某点要多久</strong>：<Katex tex="t=\Delta x/v" />，离得越远等得越久。<strong>二是某点何时起振、向哪个方向起振</strong>：波前到达的那一刻它才开始动，第一下动作照搬波源起振的第一下，所以<strong>起振方向与波源起振方向相同</strong>。上面第一块板画的是稳态波形，波前已经走过整根绳，这两条要回到波1 的波前图上去看。</p>

    <h3 class="sec" id="w4-vel">质点速度与波形斜率</h3>
    <p>质点只在 <Katex tex="y" /> 方向动，它的速度是方程对时间的偏导数：</p>
    <p style="text-align:center"><Katex tex="v_y=\frac{\partial y}{\partial t}=A\omega\cos(\omega t-kx)." display /></p>
    <p>同一时刻波形在该处的斜率，是方程对 <Katex tex="x" /> 的偏导数：</p>
    <p style="text-align:center"><Katex tex="\frac{\partial y}{\partial x}=-Ak\cos(\omega t-kx)." display /></p>
    <p>两条相除，余弦与 <Katex tex="A" /> 都约掉：</p>
    <p style="text-align:center"><Katex tex="v_y=-v\,\frac{\partial y}{\partial x}." display /></p>
    <p>这条关系把「质点的振动」与「波形的形状」连在一起，也给出了上一节平移法的解析版本：沿传播方向看，波形上坡处（<Katex tex="\partial y/\partial x>0" />）质点向下运动，下坡处质点向上运动。上面第一块板读数栏的「波形斜率」与「<Katex tex="-v\cdot(\partial y/\partial x)" />」两行，与「<Katex tex="v_y" />」那一行始终相等——拖动画面上的滑块，三行一起变，但那条等式不动。</p>
    <p>要分清两个速度。<strong>波速 <Katex tex="v" /></strong> 是波形整体向前推进的速度，方向沿传播方向，大小只由介质决定，不随时间、不随位置改变。<strong>质点速度 <Katex tex="v_y" /></strong> 是单个质点上下振动的速度，方向在竖直线上来回翻转，大小在零与 <Katex tex="A\omega" /> 之间变化。两者方向互相垂直，数量级也没有固定关系。<Katex tex="v_y" /> 的最大值是 <Katex tex="A\omega=2\pi Af" />，只与振幅和频率有关——把频率拖大，质点上下动得更快，而波速纹丝不动。</p>

    <h3 class="sec" id="w4-wave">波动方程</h3>
    <p>把方程再求一次偏导：</p>
    <p style="text-align:center"><Katex tex="\frac{\partial^2 y}{\partial t^2}=-\omega^2A\sin(\omega t-kx)=-\omega^2y,\qquad \frac{\partial^2 y}{\partial x^2}=-k^2A\sin(\omega t-kx)=-k^2y." display /></p>
    <p>两个二阶导数都与 <Katex tex="y" /> 成正比，比值是常数 <Katex tex="\omega^2/k^2" />。由 <Katex tex="v=\omega/k" /> 得</p>
    <p style="text-align:center"><Katex tex="\frac{\partial^2 y}{\partial t^2}=v^2\frac{\partial^2 y}{\partial x^2}." display /></p>
    <p>这条式子叫<strong>波动方程</strong>（一维）。推导时只用到 <Katex tex="y=A\sin(\omega t-kx)" /> 这一条形式，没有用到绳、空气或电磁场中的任何一种具体机理。反过来说，凡是位移满足这条方程的运动，扰动都以速度 <Katex tex="v" /> 向前传播，所以它描述的是「波」这一整类现象：绳上的横波、空气中的声波、水面的波纹、电磁波，各自的分量都服从同一形式的方程，只是 <Katex tex="v" /> 的表达式不同——弦上的 <Katex tex="v=\sqrt{F/\mu}" />（<Katex tex="F" /> 是张力、<Katex tex="\mu" /> 是线密度），空气中的声速由温度与气体性质决定。</p>
    <p>由此也能反过来理解波1 的两条决定因素。方程里的 <Katex tex="v" /> 是介质给出的参数，与波源的振动方式无关，所以波速由介质决定；而 <Katex tex="\omega" /> 只出现在时间项里，改它不会改 <Katex tex="v" />，频率由波源决定；波长则由 <Katex tex="k=2\pi/\lambda" /> 与 <Katex tex="v=\omega/k" /> 一同定出，<Katex tex="\lambda=v/f" />。高中阶段要求会写 <Katex tex="y=A\sin(\omega t-kx)" /> 并读出其中的量，记住这条更一般的式子，是为了明白为什么 <Katex tex="\lambda" />、<Katex tex="T" />、<Katex tex="v" /> 的关系对一切波都成立。</p>

    <h3 class="sec" id="w4-calc">算一遍</h3>
    <p>一列简谐横波沿 <Katex tex="+x" /> 方向传播，振幅 <Katex tex="A=2.0\ \text{cm}" />，波长 <Katex tex="\lambda=1.2\ \text{m}" />，波速 <Katex tex="v=2.4\ \text{m/s}" />，波源在 <Katex tex="t=0" /> 时开始振动且起振方向向上。求周期、频率、角频率与波数，写出方程；再求 <Katex tex="x=0.30\ \text{m}" /> 与 <Katex tex="x=0.90\ \text{m}" /> 两点的相位差，以及前者起振的时刻。</p>
    <p>周期与频率由 <Katex tex="v=\lambda/T" /> 与 <Katex tex="f=1/T" /> 给出：</p>
    <p style="text-align:center"><Katex tex="T=\frac{\lambda}{v}=\frac{1.2}{2.4}=0.50\ \text{s},\qquad f=\frac{1}{T}=2.0\ \text{Hz}." display /></p>
    <p>再算 <Katex tex="\omega" /> 与 <Katex tex="k" />：</p>
    <p style="text-align:center"><Katex tex="\omega=2\pi f=4\pi\approx12.6\ \text{rad/s},\qquad k=\frac{2\pi}{\lambda}=\frac{2\pi}{1.2}\approx5.24\ \text{rad/m}." display /></p>
    <p>波沿 <Katex tex="+x" /> 传播，两个系数异号；取波源初相为零，方程即</p>
    <p style="text-align:center"><Katex tex="y=0.020\sin\left(4\pi t-5.24x\right)\ \ (\text{m})." display /></p>
    <p>这条方程在 <Katex tex="t\ge x/v" /> 时成立：波前还没走到的地方仍是静止的，硬把 <Katex tex="x" /> 代入会算出一个本不该有的位移。</p>
    <p>两点相距 <Katex tex="0.60\ \text{m}" />，是半个波长，相位差为</p>
    <p style="text-align:center"><Katex tex="\Delta\varphi=\frac{2\pi\,\Delta x}{\lambda}=\frac{2\pi\times0.60}{1.20}=\pi," display /></p>
    <p>恰好是 <Katex tex="\pi" /> 的奇数倍，两点反相：一个到波峰时另一个到波谷。前者的起振时刻是波前走到那里的时间：</p>
    <p style="text-align:center"><Katex tex="t=\frac{x}{v}=\frac{0.30}{2.4}=0.125\ \text{s}，" display /></p>
    <p>起振方向与波源相同，也是向上。最后估一下质点速度的量级：</p>
    <p style="text-align:center"><Katex tex="v_{y,\max}=A\omega=0.020\times12.6\approx0.25\ \text{m/s}," display /></p>
    <p>只有波速的十分之一左右——波向前跑得快，质点上下动得慢，这正是两个速度不能混用的直接例子。</p>
    <p>题目里的数与第一块板滑块的取值范围不同，但每一步用的都是同一套式子。把第一块板的振幅、频率、波速与查看点位置摆成一组数，读数栏给出的 <Katex tex="\lambda" />、<Katex tex="T" />、<Katex tex="k" />、<Katex tex="\omega" />、相位差、滞后时间与位移，都可以照上面这六步逐项核对。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把距离直接当成相位差。</strong>相位差要按 <Katex tex="\Delta\varphi=2\pi\Delta x/\lambda" /> 换算，距离本身不是角度。只有距离恰好是 <Katex tex="\lambda" /> 的整数倍时才同相，是半波长的奇数倍时才反相；两点在某一瞬间位移偶然相等，并不等于它们同相。</li>
        <li><strong>提示二：判传播方向时看错符号。</strong>要看括号里 <Katex tex="\omega t" /> 与 <Katex tex="kx" /> 是否异号，而不是单看 <Katex tex="kx" /> 前面有没有负号。<Katex tex="\sin(kx-\omega t)" /> 与 <Katex tex="\sin(\omega t-kx)" /> 只差一个整体负号，两者都沿 <Katex tex="+x" /> 传播；第二块板的第三档把这两条曲线叠在同一根绳上，上下对翻而波峰同向移动。</li>
        <li><strong>提示三：漏掉初相或把它的符号写反。</strong>若波源从最大位移处起振，方程要写成 <Katex tex="y=A\sin(\omega t-kx+\pi/2)" />，写成 <Katex tex="y=A\sin(\omega t-kx)" /> 就等于把它当成了从平衡位置起振。「<Katex tex="t=0" /> 时某点在波峰」这类条件都是用来定 <Katex tex="\varphi_0" /> 的，不能省。</li>
        <li><strong>提示四：把质点速度当成波速。</strong>波速是波形推进的速度，方向沿传播方向，大小由介质决定；质点速度是上下振动的速度，方向竖直、大小在零与 <Katex tex="A\omega" /> 之间变化。两者垂直、数量级也可以差很多，不能互相代替。</li>
        <li><strong>提示五：认为波传到哪里，哪里就和波源同相。</strong>传到之处只是开始振动得晚，它重复的是波源 <Katex tex="\Delta t=x/v" /> 之前的运动，相位落后 <Katex tex="kx" />。同相只发生在 <Katex tex="\Delta x=n\lambda" /> 的那些点上。</li>
        <li><strong>提示六：起振方向判错。</strong>某点起振时照搬的是波源起振的第一下动作，所以起振方向与波源起振方向相同，与该点的位置、与该时刻波前附近其他点都不必相同。板与例题里都按这一条取值。</li>
        <li><strong>提示七：把方程里的 <Katex tex="x" /> 当成质点的位移。</strong><Katex tex="x" /> 是质点平衡位置的坐标，质点本身并不随波迁移，它的位移只有 <Katex tex="y" /> 一个分量。混用这两个量，后面的 <Katex tex="\partial y/\partial x" /> 也就没法理解了。</li>
      </ul>
    </div>
    <p>回收与预告：波1 用波长、周期、频率与波速四个量把波描述清楚，波2 把波形图与振动图摆在一起对照，波3 用相位差说明干涉为什么有加强与减弱——路程差是波长整数倍时两列波同相，这正是本章 <Katex tex="\Delta\varphi=2\pi\Delta r/\lambda" /> 的特例。这一章把这几个量收进一条方程，相位滞后、波数、相位差、传播方向、两张图的读法、质点速度与波形斜率、波动方程，都由它推出来。机械波这一组到此结束，机械振动与机械波这一部分也随之讲完。下一部分转入热学：从大量分子的无规则运动讲起，把温度、压强这些熟悉的名词换成微观的图像，再用气体实验定律把它们连成一条式子。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('waveeq');
const DEMO2 = demoOf('waveeqDir');
</script>
