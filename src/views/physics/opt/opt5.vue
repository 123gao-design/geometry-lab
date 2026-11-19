<template>
  <PhysicsCh id="opt5"
    sub="光在同一种介质里沿直线传播，这是几何光学的前提；一旦遇到与波长尺度相当的窄缝或障碍物，光就会绕进几何阴影区，屏上出现明暗相间的条纹。衍射与干涉本质上是同一件事：缝上的每一点都发出子波，子波在屏上叠加。偏振则从振动方向这一面说明光是横波。"
    :toc="[
      { id: 'o5-single', t: '单缝衍射：光怎样绕出缝外' },
      { id: 'o5-width', t: '中央亮纹的宽度与缝宽' },
      { id: 'o5-grating', t: '圆孔衍射与衍射光栅' },
      { id: 'o5-pol', t: '偏振与马吕斯定律' },
    ]">
    <div class="note good">
      光遇到与波长可比拟的障碍时，会偏离直线传播、绕进几何阴影区，这种现象叫衍射。单缝衍射的强度是 <Katex tex="I=I_0\left(\dfrac{\sin\alpha}{\alpha}\right)^2" />，其中 <Katex tex="\alpha=\dfrac{\pi a\sin\theta}{\lambda}" />；暗纹出现在 <Katex tex="a\sin\theta=k\lambda" /> 处，中央亮纹的宽度为 <Katex tex="\dfrac{2L\lambda}{a}" />，是两侧各条亮纹的两倍。光栅的主极大满足 <Katex tex="d\sin\theta=k\lambda" />，条纹又细又亮，用来精确测波长。偏振说明光是横波：自然光过偏振片后强度减半，再经过与它成 <Katex tex="\theta" /> 的检偏器，透射强度按 <Katex tex="I=\dfrac{I_0}{2}\cos^2\theta" /> 变化。
    </div>

    <h3 class="sec" id="o5-single">单缝衍射：光怎样绕出缝外</h3>
    <p>按几何光学，光穿过一条缝之后应当老老实实沿直线前进，屏上留下一条与缝同宽的亮带，其余地方全黑。实验却不是这样：缝足够窄时，亮带向外蔓延成一片明暗相间的条纹，连几何阴影里也有光。这就是衍射。</p>
    <p>解释它要用到惠更斯原理：波面上的每一点都可以看作新的子波源，各子波在后面的空间里传播、叠加。缝口那一窄条上只有这个区域能透光，但这个区域上的每一点都在向外发子波，屏上任意一点收到的，是这无数个子波的和。</p>
    <p>沿某个方向 <Katex tex="\theta" /> 看过去，缝口不同位置到屏上该点的路程不同，缝的两端到该点的光程差是 <Katex tex="a\sin\theta" />（<Katex tex="a" /> 是缝宽）。把这个光程差按半个波长一份切开，缝就被分成若干条「半波带」：相邻两条带对应的光程差是 <Katex tex="\lambda/2" />，相位正好相反，在屏上互相抵消。</p>
    <p>于是三种情形依次出现。<Katex tex="\theta=0" /> 时光程差为零，缝上所有子波同相，屏中心最亮；光程差增到 <Katex tex="\lambda" /> 时，缝正好分成两条半波带，两两相消，屏上出现第一处暗纹；光程差再增到 <Katex tex="2\lambda" />，缝分成四条带，同样两两相消，出现第二处暗纹。暗纹的位置因此是</p>
    <p style="text-align:center"><Katex tex="a\sin\theta=k\lambda,\qquad k=\pm1,\pm2,\dots" display /></p>
    <p>相邻两条暗纹之间是一处亮纹。把这些半波带的贡献写成积分，就得到衍射图样的强度分布</p>
    <p style="text-align:center"><Katex tex="I=I_0\left(\dfrac{\sin\alpha}{\alpha}\right)^2,\qquad \alpha=\dfrac{\pi a\sin\theta}{\lambda}" display /></p>
    <p><Katex tex="\alpha\to0" /> 时 <Katex tex="\sin\alpha/\alpha\to1" />，是中央极大；<Katex tex="\alpha=k\pi" /> 时分子为零，正好落在 <Katex tex="a\sin\theta=k\lambda" /> 的暗纹上。</p>
    <p>两侧的次极大远弱于中央：第一级只有中央的百分之四到五，第二级不到百分之二。所以图样看上去是一条很宽很亮的中央亮纹，两侧各跟几条窄而暗的条纹，越往外越暗。</p>

    <h3 class="sec" id="o5-width">中央亮纹的宽度与缝宽</h3>
    <p>中央亮纹的两条边界就是左右第一极小。由 <Katex tex="a\sin\theta=\lambda" /> 得第一极小的偏角，小角近似下 <Katex tex="\sin\theta\approx\tan\theta=y/L" />，于是屏上第一极小到中心的距离</p>
    <p style="text-align:center"><Katex tex="y_1=\dfrac{L\lambda}{a}" display /></p>
    <p>中央亮纹的宽度是两侧第一极小之间的距离 <Katex tex="2L\lambda/a" />；两侧其余亮纹的宽度都约为 <Katex tex="L\lambda/a" />，只有中央的一半。这与观察到的「中央条纹特别宽」对得上。</p>
    <p>这个式子把衍射的两个特征一次说清。缝宽 <Katex tex="a" /> 越小，<Katex tex="y_1" /> 越大，条纹张得越开，衍射越明显；波长 <Katex tex="\lambda" /> 越长，条纹也越宽。红光比紫光散得开，原因正在这里，与棱镜把白光散开是同一类波长依赖，只是机制不同。</p>
    <p>反过来看，如果缝宽远大于波长，<Katex tex="y_1=L\lambda/a" /> 只有零点几毫米，几条条纹挤成一片，宏观上看不出明暗，光就表现得像沿直线传播。几何光学不是与波动光学对立的另一套理论，而是波长趋于零时波动光学的极限：只要障碍物的尺度远大于波长，衍射就可以忽略。</p>
    <p>双缝实验里每条缝本身也在衍射，这层影响常被忽略。单缝的强度包络把双缝的干涉条纹整体压低：中央附近条纹亮，越往外越暗，到单缝第一极小处干涉条纹被完全压没。光4 的图样只在中段清楚、靠外一片模糊，原因就在这里。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 光5 · <b>单缝衍射：缝一窄，光就散开</b>：左栏是光路，一串竖直波前从左射向挡板上的单缝（缝宽按可见比例画大），缝后各方向的光线铺成一片扇形；右栏是屏上的光强分布与它下面的彩色条纹，两条淡虚线标出第一极小。看点一：默认 λ = 550 nm、a = 60 μm、L = 1 m，第一极小落在约 9.2 mm 处，中央亮纹宽约 18 mm。看点二：把缝宽 a 拖大，中央亮纹收紧、两侧亮纹一条条挤进画面，读数栏最后一行从「可观察」翻成「很弱，光近似沿直线传播」——几何光学的极限就在这里。看点三：把 a 拖到最小、或把波长拖向红端，条纹迅速张满整个屏，次极大的位置随之一条条往外推。看点四：切到偏振档，两块偏振片之间是竖直振动的线偏振光，转过检偏器，右侧振动记号的长度与颜色深浅按 |cosθ| 缩短，右栏的马吕斯曲线跟着走，θ = 90° 时透射光归零。</p>

    <h3 class="sec" id="o5-grating">圆孔衍射与衍射光栅</h3>
    <p>把单缝换成圆孔，图样变成中央一个亮斑加一圈圈暗环。中央亮斑叫艾里斑，角半径为 <Katex tex="\theta=1.22\dfrac{\lambda}{D}" />，<Katex tex="D" /> 是圆孔直径。望远镜与显微镜的分辨本领由它决定：两个点光源的角距离小于这个值时，它们的艾里斑重叠得分辨不开。口径越大、波长越短，艾里斑越小，能分辨的细节越细。天文望远镜把口径做得很粗，射电望远镜甚至用阵列拼接口径，都是为了这一条。</p>
    <p>把许多条等宽等距的缝并排排开，就得到衍射光栅。相邻两缝到屏上同一点的光程差是 <Katex tex="d\sin\theta" />，<Katex tex="d" /> 是缝间距，也叫光栅常数。缝数越多，只有满足</p>
    <p style="text-align:center"><Katex tex="d\sin\theta=k\lambda" display /></p>
    <p>的方向上各缝的光才全部同相、叠加成主极大，其余方向上各缝的贡献几乎完全相消。于是光栅的亮纹极细极亮，两条亮纹之间大片是暗的。</p>
    <p>条纹细、位置可以量得准，光栅因此成为测波长的精密元件：已知光栅常数 <Katex tex="d" />，量出第 <Katex tex="k" /> 级亮纹的偏角 <Katex tex="\theta" />，就有 <Katex tex="\lambda=d\sin\theta/k" />。白光通过光栅时，各色光的亮纹按波长排开，级次越高分得越开，这就是光栅光谱，也是光谱分析的基础。</p>
    <p>圆孔衍射与光栅是一对极端：孔越大艾里斑越小、分辨得越开；缝越多条纹越细、测得越准。两者出自同一套叠加原理，只是参与叠加的波源一个是连续分布的一片，一个是分立的许多条。</p>

    <h3 class="sec" id="o5-pol">偏振与马吕斯定律</h3>
    <p>干涉与衍射说明光是波，偏振进一步说明光是横波：光矢量的振动方向垂直于传播方向，而不像声波那样沿着传播方向振动。自然光里各个方向的振动都有，且随时间快速无规则地变化，没有一个方向占优。</p>
    <p>偏振片只让沿某一方向（透振方向）的振动通过，其余方向被吸收。自然光通过第一块偏振片后，成为沿透振方向振动的线偏振光。自然光的能量在各方向上均匀分布，通过后只剩一半，所以</p>
    <p style="text-align:center"><Katex tex="I_1=\dfrac{I_0}{2}" display /></p>
    <p>再放第二块偏振片（检偏器），与第一块成 <Katex tex="\theta" /> 角。通过第一块后的振动可以分解成沿检偏器透振方向与垂直方向的两份，只有沿透振方向的那一份能通过，振幅是原来的 <Katex tex="\cos\theta" />。强度与振幅平方成正比，于是</p>
    <p style="text-align:center"><Katex tex="I_2=I_1\cos^2\theta=\dfrac{I_0}{2}\cos^2\theta" display /></p>
    <p><Katex tex="\theta=0" /> 时全部通过，<Katex tex="\theta=90^\circ" /> 时完全被挡住。转动检偏器，透射光每转过 <Katex tex="90^\circ" /> 明暗交替一次，最亮与最暗的差别是全部与零。这条规律叫马吕斯定律。</p>
    <p>应用随处可见。偏光太阳镜滤掉水面、路面与雪面反射的偏振光，眩光明显减弱；立体电影用两片透振方向互相垂直的偏振片，让左右眼各看到一幅画面，两眼视差交给大脑合成立体；液晶显示靠电场改变液晶分子的排列，从而改变透过光的偏振态，再配一片偏振片控制每个像素的明暗；摄影用的偏振镜压暗天空，因为天空的散射光是部分偏振的。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把衍射与干涉当成两套机制。</strong>缝上每一点都是子波源，屏上的明暗仍是子波叠加的结果，单缝衍射就是缝内无数子波的干涉；区别只在参与叠加的波源是连续一片还是分立的几条缝。</li>
        <li><strong>提示二：认为缝越窄亮纹越窄。</strong>由 <Katex tex="y_1=\dfrac{L\lambda}{a}" />，缝越窄第一极小离中心越远，条纹反而越宽。「缝窄了透过的光少、图样变小」把光强与条纹宽度混在了一起。</li>
        <li><strong>提示三：把中央亮纹的宽度记成 <Katex tex="\dfrac{L\lambda}{a}" />。</strong>那是从中心到第一极小的半宽，两侧第一极小之间的总宽是 <Katex tex="\dfrac{2L\lambda}{a}" />，恰好是两侧其他亮纹的两倍。</li>
        <li><strong>提示四：认为两块偏振片成 <Katex tex="90^\circ" /> 时光强减半。</strong>马吕斯定律给出 <Katex tex="\cos^2 90^\circ=0" />，光完全被挡住；强度减半只发生在自然光通过第一块偏振片的那一步。</li>
      </ul>
    </div>
    <p>回收与预告：本章把波动光学收口——干涉处理分立光源的叠加，衍射处理连续波前的叠加，偏振处理振动方向。下一部分进入近代物理：热辐射的研究引出了能量量子，光电效应又把光的粒子性摆上台面。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('diffract');
</script>
