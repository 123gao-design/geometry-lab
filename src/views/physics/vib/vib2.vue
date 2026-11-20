<template>
  <PhysicsCh id="vib2"
    sub="上一章的弹簧振子靠弹力把物块拉回原处，回复力与位移严格成正比。这一章换一根细线：单摆的回复力来自重力沿圆弧切线方向的分力，它与摆角的正弦成正比，本来并不与位移成正比；可是摆角很小时正弦与弧度几乎相等，回复力就近似与位移成正比了，单摆因此也是简谐运动。顺着这条路可以得到周期公式，它把摆长与重力加速度连在一起。"
    :toc="[
      { id: 'v2-model', t: '单摆的模型与摆角' },
      { id: 'v2-force', t: '重力沿切线的分力' },
      { id: 'v2-small', t: '小角近似' },
      { id: 'v2-period', t: '周期公式与摆钟' },
    ]">
    <div class="note good">
      细线一端固定、另一端系一个可视为质点的小球，这样的装置叫<strong>单摆</strong>。摆球受重力与绳的拉力，重力沿圆弧切线的分力 <Katex tex="mg\sin\theta" /> 总指向最低点，它就是回复力；绳的拉力沿绳方向、与速度垂直，不做功。摆角很小时
      <Katex tex="\sin\theta\approx\theta=\frac{x}{l}" />，回复力变成
      <Katex tex="F\approx-\frac{mg}{l}x" />，与弹簧振子的 <Katex tex="F=-kx" /> 同形，等效劲度系数 <Katex tex="k=\frac{mg}{l}" />，于是单摆做<strong>简谐运动</strong>，周期为
      <Katex tex="T=2\pi\sqrt{\frac{l}{g}}" />，只由摆长 <Katex tex="l" /> 与当地的重力加速度 <Katex tex="g" /> 决定，与摆球的质量、与振幅都无关。
    </div>

    <h3 class="sec" id="v2-model">单摆的模型与摆角</h3>
    <p>先交代装置。一根不可伸长的细线，上端固定在一个悬点上，下端系一个金属小球；线长比球的半径大得多，球可以看作质点，空气阻力忽略不计。把球从最低点拉开一个不大的角度再放开，它就在最低点两侧沿一段圆弧来回摆动。这样的装置叫<strong>单摆</strong>。</p>
    <p>与弹簧振子的理想化条件一样，这里也有几条前提：线不可伸长、线的质量不计、球视为质点、不计空气阻力。满足这四条之后，摆球在运动中只受两个力——重力 <Katex tex="mg" /> 与绳的拉力 <Katex tex="F_T" />，问题的结构就清楚了。</p>
    <p>单摆的<strong>平衡位置</strong>在悬点正下方。摆球停在最低点时，拉力与重力都沿竖直方向、大小相等，合力为零；这正是振1 那条「平衡位置是合力为零的位置」在单摆上的对应。摆球偏离到任一位置时，绳与竖直方向的夹角叫<strong>摆角</strong>，记作 <Katex tex="\theta" />。</p>
    <p>摆长 <Katex tex="l" /> 是<strong>悬点到球心</strong>的距离，即线长加上球的半径，不是线本身的长度。这一点在实验里尤其要紧，量错了几毫米，算出的 <Katex tex="g" /> 就跟着错。</p>
    <p>摆球的运动轨迹是一段圆弧，半径就是摆长。规定摆角由竖直方向量起、偏向右为正。摆球走过的弧长</p>
    <p style="text-align:center"><Katex tex="x=l\theta" display /></p>
    <p>就取作它相对平衡位置的<strong>位移</strong>，这里的 <Katex tex="\theta" /> 必须以弧度为单位。摆球的速度沿圆弧的切线方向，速率 <Katex tex="v=l\omega" />，其中 <Katex tex="\omega" /> 是摆角变化的快慢。半径方向（沿绳）的加速度就是向心加速度，大小 <Katex tex="v^2/l" />，指向悬点。</p>

    <h3 class="sec" id="v2-force">重力沿切线的分力</h3>
    <p>摆球为什么会自己回到最低点？答案要从受力里找。摆球受两个力，重力和绳的拉力。拉力沿绳指向悬点，与球的速度垂直，所以它不做功，只改变速度的方向，不改变快慢；把球拉回原处的只能是重力在切线方向的那一份。</p>
    <p>于是把重力沿两个方向分解：一个沿绳（法向），一个沿圆弧切线（切向）。由几何关系，绳与竖直方向的夹角是 <Katex tex="\theta" />，重力与绳的夹角也是 <Katex tex="\theta" />，两块分量分别为</p>
    <p style="text-align:center"><Katex tex="mg\cos\theta\ \text{（沿绳）},\qquad mg\sin\theta\ \text{（沿切线）}." display /></p>
    <p>沿切线的这一份总是指向平衡位置：球在右侧时它指向左，在左侧时它指向右。这就是单摆的<strong>回复力</strong>。取切线方向（<Katex tex="\theta" /> 增大方向）为正，写成式子是</p>
    <p style="text-align:center"><Katex tex="F=-mg\sin\theta." display /></p>
    <p>负号的含义与振1 一样——回复力与偏离方向相反。下面那块板里，橙色箭头是重力，紫色箭头就是它沿切线的这一份；可以看到紫色箭头永远指向那条竖直参考线，不论球在左边还是右边。</p>
    <p>沿绳方向的两个力则另有分工。拉力与 <Katex tex="mg\cos\theta" /> 的合力沿绳指向悬点，提供向心力，在摆球经过最低点时</p>
    <p style="text-align:center"><Katex tex="F_T-mg=\frac{mv^2}{l}." display /></p>
    <p>球在最低点时速度最大，所以这一时刻的拉力最大；在两侧最高点速度为零，拉力恰好等于 <Katex tex="mg\cos\theta" />，是最小的时候。这条关系与振动的回复力无关，但它解释了为什么摆线要结实一点。</p>
    <p>这里要分清三样东西：重力 <Katex tex="mg" /> 是实际的力；重力与拉力的<strong>合力</strong>沿绳指向悬点，是向心力；而重力<strong>沿切线</strong>的分力才是回复力。三者不能混为一谈，受力图上画重力与拉力两个实际力就够了，回复力是其中一个的分量。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 振2a · <b>单摆的受力</b>：一根不可伸长的细线挂在支架上，虚线是竖直参考线，绿弧标出摆角 <Katex tex="\theta" />；摆球上画了四支箭头——橙箭头是重力 <Katex tex="mg" />，蓝箭头是绳的拉力 <Katex tex="F_T" />，紫箭头是重力沿切线的分力（即回复力），绿箭头是速度。重力的两侧虚线把它分解成沿绳与沿切线两份，与 <Katex tex="mg" /> 首尾相接成一个矩形。看点一：紫色箭头总指向竖直参考线——球在右侧时它朝左，在左侧时朝右；经过最低点时它缩到零，摆到最高点时它最长，正合「回复力与 <Katex tex="\sin\theta" /> 成正比」。看点二：读数栏的「回复力 F」与「mg sinθ」两行始终相等，紫色箭头与「重力在切线方向的那一份」是同一个东西；「F拉 − mg cosθ」与「向心项 mv²/L」两行也始终相等，沿绳的合力全部用来提供向心力。看点三：拖动摆球质量 <Katex tex="m" />，四支箭头的长短一个都不变（比值 <Katex tex="F_T/(mg)" /> 与质量无关），只有与力有关的几行读数按比例变大，周期一行纹丝不动；把摆长 <Katex tex="L" /> 拖长或重力加速度 <Katex tex="g" /> 调低，摆得慢了，读数栏的周期一行随之变大。</p>

    <h3 class="sec" id="v2-small">小角近似</h3>
    <p>与弹簧振子不同，单摆的回复力与 <Katex tex="\sin\theta" /> 成正比，而不是与摆角本身成正比。正弦是一段弯曲的函数，所以严格说来单摆并不是简谐运动。但它离简谐运动很近，原因在摆角很小的时候。</p>
    <p>把角度用弧度表示。在单位圆里，角度为 <Katex tex="\theta" /> 的弧长就是 <Katex tex="\theta" />，而正弦是对边的长度。角度越小，弧与弦越贴得紧，<Katex tex="\sin\theta" /> 与 <Katex tex="\theta" /> 的差别越小。把正弦展开成级数看得更清楚：</p>
    <p style="text-align:center"><Katex tex="\sin\theta=\theta-\frac{\theta^3}{6}+\frac{\theta^5}{120}-\cdots" display /></p>
    <p>第一项就是 <Katex tex="\theta" />，后面各项在 <Katex tex="\theta" /> 很小时迅速变小。取几个数感受一下量级：<Katex tex="\theta=5^\circ" /> 时 <Katex tex="\theta=0.0873\ \text{rad}" />，而 <Katex tex="\sin\theta=0.0872" />，相差 0.13%；<Katex tex="10^\circ" /> 时相差 0.51%；<Katex tex="15^\circ" /> 时相差 1.15%；拉到 <Katex tex="30^\circ" /> 才相差 4.5%。演示读数栏最后一行的 <Katex tex="\sin\theta_0/\theta_0" /> 就是这个比值：它越接近 1，说明在最大摆角处把 <Katex tex="\sin\theta" /> 换成 <Katex tex="\theta" /> 造成的相对偏差越小。</p>
    <p>于是当摆角很小（通常要求 <Katex tex="\theta\le5^\circ" />）时，可以把 <Katex tex="\sin\theta" /> 换成 <Katex tex="\theta" />：</p>
    <p style="text-align:center"><Katex tex="F=-mg\sin\theta\approx-mg\theta=-mg\cdot\frac{x}{l}=-\frac{mg}{l}x." display /></p>
    <p>这就回到了 <Katex tex="F=-kx" /> 的形式，其中比例系数（等效劲度系数）</p>
    <p style="text-align:center"><Katex tex="k=\frac{mg}{l}." display /></p>
    <p>结论：<strong>摆角很小的时候，单摆的运动可以看作简谐运动</strong>，它的位移随时间也按余弦规律变化，形状、周期、相位的说法全部照搬振1。下面那块板右栏的 <Katex tex="\theta" />–<Katex tex="t" /> 曲线正是这条余弦线：摆角振幅越大，橙色虚线（<Katex tex="\pm\theta_0" />）拉得越开，而曲线的疏密基本不变。</p>

    <PhysicsDemo :def="DEMO2" />
    <p class="cap">图 振2b · <b>摆角—时间曲线与周期</b>：左栏是同一个单摆，它在竖直位置两侧来回摆；右栏是摆角随时间的曲线，淡色细线是整条余弦，蓝色是已经走过的一段，橙色虚线标出 <Katex tex="\pm\theta_0" />，<Katex tex="t=T" /> 处的竖虚线标出一个周期，橙色动点的高度就是左栏此刻的摆角。看点一：曲线最高点的纵坐标就是振幅，相邻两个同向峰之间的水平距离就是周期，读数栏把 <Katex tex="T" /> 与频率 <Katex tex="f" /> 一并写出。看点二：把摆长 <Katex tex="L" /> 拖长，左栏的线画长了，右栏曲线变疏、读数栏周期变大（<Katex tex="L" /> 变成 4 倍，<Katex tex="T" /> 变成 2 倍）；把重力加速度 <Katex tex="g" /> 调低，相当于把摆搬到月球，整套动作一起放慢。看点三：拖动摆球质量 <Katex tex="m" />，左栏与右栏的画面纹丝不动——周期与质量无关；拖动摆角振幅 <Katex tex="\theta_0" />，曲线上下张开而竖虚线的位置不动，这就是等时性。读数栏最后一行的 <Katex tex="\sin\theta_0/\theta_0" /> 给出小角近似在最大摆角处的偏差：<Katex tex="30^\circ" /> 时降到 0.955。</p>

    <h3 class="sec" id="v2-period">周期公式与摆钟</h3>
    <p>既然单摆在小角下是简谐运动，就可以直接借用弹簧振子的周期公式 <Katex tex="T=2\pi\sqrt{m/k}" />，把等效劲度系数代进去：</p>
    <p style="text-align:center"><Katex tex="T=2\pi\sqrt{\frac{m}{mg/l}}=2\pi\sqrt{\frac{l}{g}}." display /></p>
    <p>这个式子值得逐项读一遍。分子上的 <Katex tex="m" /> 与分母里的 <Katex tex="m" /> 恰好抵消，所以<strong>周期与摆球的质量无关</strong>：换一个铁球、换一个木球，只要摆长相同，来回的节奏完全一样。周期里也<strong>没有振幅</strong>（这只在小角近似下成立），摆角从 <Katex tex="3^\circ" /> 改到 <Katex tex="5^\circ" />，周期基本不动。剩下的只有摆长 <Katex tex="l" /> 与重力加速度 <Katex tex="g" />：摆长越长周期越长，<Katex tex="l" /> 变成 4 倍，<Katex tex="T" /> 变成 2 倍；<Katex tex="g" /> 越大周期越短。</p>
    <p>周期与振幅无关这条性质叫<strong>等时性</strong>。伽利略最早从教堂里摆动的吊灯上注意到了它，惠更斯据此做成了摆钟：让摆每摆一次带动齿轮走一格，时间就被量出来了。摆钟的调速靠调节摆长——摆走快了就把摆锤往下挪一点，摆长变长、周期变长，走时便慢回来；走慢了则把它往上挪。同一只摆钟从北京搬到赤道，或者搬到高山、月球上，<Katex tex="g" /> 变了，走时就会不准，这正说明它量的是 <Katex tex="l" /> 与 <Katex tex="g" /> 的搭配。</p>
    <p>把公式反解，可以得到两个常用的变形。已知周期求摆长，<Katex tex="l=\dfrac{gT^2}{4\pi^2}" />；已知摆长与周期求重力加速度，</p>
    <p style="text-align:center"><Katex tex="g=\frac{4\pi^2l}{T^2}." display /></p>
    <p>后一条是实验里测 <Katex tex="g" /> 的原理：量出摆长、测出一段完整摆动的时间再除以次数，代入即可。它比直接让物体自由落体好测得多，因为摆的周期长、计时的相对误差小。这一路的具体操作放在实验部分「用单摆测重力加速度」里讲。</p>
    <p>上一节那块板里三件事可以对照着看。把摆长 <Katex tex="l" /> 拖长，摆幅不变而右栏曲线变疏，读数栏的周期变大；把摆球质量 <Katex tex="m" /> 拖动，画面里什么也不变，曲线的疏密与周期纹丝不动——周期与质量无关；把摆角振幅 <Katex tex="\theta_0" /> 拖动，曲线上下张开的幅度随之改变，而 <Katex tex="t=T" /> 那条竖虚线的位置不动——等时性。再把重力加速度 <Katex tex="g" /> 调低，相当于把摆搬到月球，整套动作一起放慢。</p>
    <p>还有一层更直观的读法：把时间换成距离。设想摆球下端接一支笔，笔尖贴着一条纸带，纸带以恒定速度 <Katex tex="v" /> 在摆的正下方平移。纸带走过的距离 <Katex tex="vt" /> 与时间成正比，于是量纸带上的长度就等于量时间；摆角随时间按余弦规律变化，笔尖在纸上留下的就是一条正弦线。一个周期里纸带走过的距离，正是这条曲线相邻两个同向波峰之间的长度</p>
    <p style="text-align:center"><Katex tex="\lambda=vT." display /></p>
    <p>把纸带加快或放慢，摆的周期并不改变，变的只是这条曲线被拉长还是压短。振7 讲波的方程时用到的波长、波速与频率的关系 <Katex tex="\lambda=vT=v/f" /> 就是同一个式子：那里把纸带换成了介质，把笔尖换成了波源。</p>

    <PhysicsDemo :def="DEMO3" />
    <p class="cap">图 振2c · <b>匀速纸带上的正弦轨迹</b>：摆球下端接一支笔，笔尖贴着一条匀速向里平移的纸带，纸面上的方格随纸带一起移动，看得出纸在走。紫色曲线是笔尖留下的墨迹，末端那一点始终停在摆球的正下方。看点一：橙色双箭头量出相邻两个同向波峰之间纸带走过的距离，读数栏的「空间周期」一行与它相等，也就是 <Katex tex="\lambda=vT" />；把纸带速度 <Katex tex="v" /> 拖快，摆的周期不动、纸上的波长被拉长，拖慢则压短。看点二：墨迹落下之后随纸带退向远处，只有末端一路跟着笔尖画过来，纸上每一个点对应的都是过去某一时刻的摆角；纸带走满一趟就从头重放。看点三：拖摆长 <Katex tex="L" /> 或重力加速度 <Katex tex="g" />，周期与波长一起变；拖摆角振幅 <Katex tex="\theta_0" />，曲线上下张开的幅度是 <Katex tex="L\sin\theta_0" />，峰与峰之间的距离不动。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把线长当成摆长。</strong>摆长是悬点到<strong>球心</strong>的距离，等于线的长度加上摆球的半径。测摆长时先量线长，再量球的直径取一半加上去，否则算出的重力加速度偏小。</li>
        <li><strong>提示二：把回复力当成重力，或当成重力与拉力的合力。</strong>单摆的回复力只是重力沿圆弧切线方向的分力 <Katex tex="mg\sin\theta" />。重力与拉力的合力沿绳指向悬点，提供的是向心力；重力本身竖直向下，与摆角无关。三者方向、大小都不同，受力图上画重力与拉力两个实际力就够。</li>
        <li><strong>提示三：认为摆角大一些照样是简谐运动。</strong>只有摆角很小时 <Katex tex="\sin\theta\approx\theta" /> 才成立，通常要求 <Katex tex="\theta\le5^\circ" />。摆角增大后回复力与位移不再成正比，周期会略微变长，曲线也不是严格的余弦。前面那块板里把摆角拖到 <Katex tex="30^\circ" /> 时，读数栏的比值降到 0.955，周期已经偏离约 1.7%。</li>
        <li><strong>提示四：认为摆球越重周期越长。</strong>周期公式里质量被约掉了，与钟摆的直觉相反，重的球不会摆得更慢。质量同时出现在惯性与重力两边：球越重，回复力越大，要推动的惯性也越大，两者相抵。演示里拖动质量，周期那一格读数一动不动。</li>
      </ul>
    </div>
    <p>回收与预告：振1 的弹簧振子靠弹力提供回复力，回复力与位移严格成正比，是理想的简谐运动；这一章把回复力换成重力沿切线的分力，它在小角下才近似与位移成正比，于是得到单摆这一只准简谐运动。两章的周期公式是同一个式子换了劲度系数：<Katex tex="k" /> 对应 <Katex tex="mg/l" />。前面学过的受力分析、向心力、牛顿第二定律在这里都用上了，只是分工不同——切向那份管振动，法向那份管圆周。真实的摆不会永远摆下去：空气阻力让振幅逐渐减小，这属于阻尼振动；若再加一个周期性的外力，摆最终按外力的频率摆动，振幅由两者频率的接近程度决定。下一章振3 处理这两种情形，并给出共振的条件。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('vib2Force');
const DEMO2 = demoOf('vib2Curve');
const DEMO3 = demoOf('vib2Paper');
</script>
