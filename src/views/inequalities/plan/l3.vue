<template>
  <ChPage :cur="3" no="线3" base="/inequalities/l" :chapters="L_CHAPTERS"
    title="曲线围成的可行域：等值线与边界相切"
    sub="可行域由圆、椭圆或抛物线围成时，线性目标的最优点不再落在「顶点」上——等值线沿法向平移，最后停在它与边界曲线相切的位置。相切条件给出切点坐标，圆的半径、椭圆的半轴、抛物线的开口各自决定切点在哪里。"
    :toc="[{ id: 'l3-circle', t: '圆域：圆心到等值线的距离' }, { id: 'l3-ellipse', t: '椭圆域：参数化与判别式' }, { id: 'l3-parab', t: '抛物带：最优可能落在曲边' }, { id: 'l3-method', t: '一般方法：相切即最优' }, { id: 'l3-pit', t: '切点越界与无界区域' }]">
    <div class="note good" id="l3-law">设可行域 <Katex tex="D" /> 是闭且有界的平面区域，目标函数 <Katex tex="z=ax+by" /> 连续。若最优点 <Katex tex="Q" /> 落在光滑边界上，则等值线 <Katex tex="ax+by=z" /> 在 <Katex tex="Q" /> 处与边界相切：等值线若与边界相交而不相切，跨过它的一小段里仍有点属于区域，<Katex tex="z" /> 就还能继续增大或减小。于是求最值化为求切点。</div>
    <div class="board-wrap">
      <BoardMount :factory="createConic" />
      <div class="cap">图 线3 · <b>曲线可行域机</b>：三个预设切换可行域 <Katex tex="x^2+y^2\le4" />、<Katex tex="\frac{x^2}{4}+y^2\le1" />、<Katex tex="x^2\le y\le4" />。金色虚线是当前等值线，绿色实线与青色虚线分别是最大值、最小值所在的等值线，接触点标在边界上。看点：拖动 z 让等值线平移；切到抛物带，观察最优点怎样从端点移到曲边切点。</div>
    </div>

    <h3 class="sec" id="l3-circle">圆域：圆心到等值线的距离</h3>
    <p>先看最干净的圆域 <Katex tex="x^2+y^2\le4" />，目标是 <Katex tex="z=ax+by" />。等值线 <Katex tex="ax+by=z" /> 到圆心 <Katex tex="O" /> 的距离是
      <Katex tex="d=\frac{|z|}{\sqrt{a^2+b^2}}" />。
      圆域内点到圆心的距离不超过半径 <Katex tex="2" />，因此 <Katex tex="d\le2" />，也就是
      <Katex tex="|z|\le2\sqrt{a^2+b^2}" />。
      等号在等值线与圆相切时成立，切点位于从圆心指向法向 <Katex tex="(a,b)" /> 的半径上：
      <Katex tex="Q_{\max}=\frac{2}{\sqrt{a^2+b^2}}(a,b)" />，代入得 <Katex tex="z=2\sqrt{a^2+b^2}" />。最小值在对面那条切线上，切点取负号。</p>
    <p>圆没有「顶点」可比较，最优点只能靠相切来找。图 线3 切到圆域，绿色等值线贴住圆周的那一点就是最优点；拖动系数 <Katex tex="a,b" />，切点随法向一起转动，最大值的公式始终是半径乘上法向的模。<Katex tex="a=1,b=1" /> 时最大值为 <Katex tex="2\sqrt2\approx2.83" />。</p>

    <h3 class="sec" id="l3-ellipse">椭圆域：参数化与判别式</h3>
    <p>椭圆域 <Katex tex="\frac{x^2}{4}+y^2\le1" /> 的边界可以写成参数式 <Katex tex="x=2\cos\theta,\ y=\sin\theta" />，代入目标函数：
      <Katex tex="z=2a\cos\theta+b\sin\theta=\sqrt{4a^2+b^2}\,\sin(\theta+\varphi)" />，
      其中 <Katex tex="\tan\varphi=\frac{2a}{b}" />。正弦的取值范围是 <Katex tex="[-1,1]" />，所以
      <Katex tex="z_{\max}=\sqrt{4a^2+b^2}" />，
      在 <Katex tex="\theta+\varphi=\frac{\pi}{2}" /> 时取得，切点为
      <Katex tex="\left(\frac{4a}{\sqrt{4a^2+b^2}},\ \frac{b}{\sqrt{4a^2+b^2}}\right)" />。</p>
    <p>不用参数也可以：把 <Katex tex="ax+by=z" /> 与椭圆方程联立，消去 <Katex tex="y" /> 得到关于 <Katex tex="x" /> 的一元二次方程，相切意味着判别式 <Katex tex="\Delta=0" />。两种做法给出同一个 <Katex tex="z_{\max}" />；参数法适用于系数任意的情形，判别式法在数值上更直接，也是解析几何里处理「直线与曲线相切」的通用手段（见圆锥曲线模块的切线一节）。</p>
    <p>图 线3 的椭圆预设取 <Katex tex="a=b=1" />，最大值为 <Katex tex="\sqrt5\approx2.24" />，切点约为 <Katex tex="(1.79,0.45)" />。椭圆越扁，长轴方向的切点离原点越远，最大值也越大：系数给向长轴时收益最高。</p>

    <h3 class="sec" id="l3-parab">抛物带：最优可能落在曲边</h3>
    <p>抛物带 <Katex tex="x^2\le y\le4" /> 的下边界是抛物线 <Katex tex="y=x^2" />（<Katex tex="-2\le x\le2" />），上边界是水平线 <Katex tex="y=4" />。目标 <Katex tex="z=ax+by" /> 在上下两条边界上的行为不同，最优点要分情况讨论。</p>
    <p>当 <Katex tex="b<0" /> 时，<Katex tex="y" /> 越小目标值越大，最优落在下边界 <Katex tex="y=x^2" /> 上。代入得
      <Katex tex="z=ax+bx^2=b\left(x+\frac{a}{2b}\right)^2-\frac{a^2}{4b}" />。
      这是开口向下的二次函数（<Katex tex="b<0" />），顶点 <Katex tex="x=-\frac{a}{2b}" />。若该点落在 <Katex tex="-2\le x\le2" /> 之内，最优点就是曲边上的切点；否则最值转到端点 <Katex tex="(2,4)" /> 或 <Katex tex="(-2,4)" />。取 <Katex tex="a=1,\ b=-1" />，顶点为 <Katex tex="x=\frac12" />，切点 <Katex tex="(0.5,0.25)" />，<Katex tex="z_{\max}=0.25" />，而此时两个端点的目标值分别是 <Katex tex="-2" /> 与 <Katex tex="-6" />，都更小。</p>
    <p>当 <Katex tex="b>0" /> 时，<Katex tex="y" /> 越大目标值越大，最优落在上边界 <Katex tex="y=4" /> 上，<Katex tex="z=ax+4b" /> 在 <Katex tex="x=\pm2" /> 处取到 <Katex tex="4b+2|a|" />；<Katex tex="a=b=1" /> 时等于 <Katex tex="6" />。此时等值线与上边界平行，接触的是一整条线段，最优解不唯一——线2 里「等值线与边平行」的情形在这里再次出现。</p>

    <h3 class="sec" id="l3-method">一般方法：相切即最优</h3>
    <p>把上面的做法归纳成步骤。第一，画出可行域，确认它有界；第二，写出目标函数的等值线族；第三，在最优点处设等值线与边界相切，用几何条件解出切点——圆用圆心到直线的距离等于半径，椭圆用参数式或联立判别式，抛物线用联立后判别式为零；第四，核验切点确实落在可行域的那段边界上；第五，把所有候选点（曲边切点与角点）代入目标函数比较。</p>
    <p>「相切」的来源是凸性：可行域凸时，若最优点在内部，沿等值线两侧都有区域内的点，目标值可以继续变化，矛盾；因此最优点在边界上。边界光滑处的切线若与等值线不平行，等值线就会穿过边界，同样矛盾。所以光滑边界上的最优点必须相切；边界有角点时，角点不能被相切条件描述，只能单独代入比较。</p>

    <h3 class="sec" id="l3-pit">切点越界与无界区域</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>切点必须落在可行边界弧上。</strong>抛物带的下边界只有 <Katex tex="-2\le x\le2" /> 这一段，解出的 <Katex tex="x=-\frac{a}{2b}" /> 超出范围时，相切点不属于可行域，最值改由端点承担。</p>
          <p><strong>无界区域没有最大值。</strong>若把可行域换成 <Katex tex="y\ge x^2" />，沿抛物线向上走 <Katex tex="y" /> 可以无限增大，目标 <Katex tex="z=y" /> 也就没有最大值。使用相切法之前先确认区域有界，或者确认目标在该方向上有界。</p>
          <p><strong>相切不是充分条件。</strong>等值线与曲线相切，切点也可能落在可行域之外（例如只取抛物线一支时，切点跑到另一侧）。相切只说明这是候选点，是否最优还要看切点是否属于可行域，并与角点比较。</p>
          <p><strong>整数解需要另作处理。</strong>切点坐标通常不是整数，变量要求取整数时，最优整数解要在切点附近的可行整点中逐个比较——方法同线2 的整数模式。</p>
    </div>
    <p>线2 的多边形可行域是这里的一种特殊情形：边界由直线段组成，相切点退化为顶点或整条边。线4 再把目标函数本身换成非线性的分式与距离，可行域仍是多边形，最优点却可能落在边的内部。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createConic } from '../../../boards/inequalities/plan/coniclp.js';
import { L_CHAPTERS } from './lnav.js';
</script>
