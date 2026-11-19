<template>
  <PhysicsCh id="forcecomb"
    sub="几个力共同作用的效果，可以用一个力来代替，这个力叫合力。求合力的法则是平行四边形定则。反过来把合力拆成分力叫力的分解；物体在共点力作用下保持静止或匀速直线运动时，这些力的合力为零。"
    :toc="[
      { id: 'c-add', t: '力的合成与平行四边形定则' },
      { id: 'c-range', t: '合力的大小范围' },
      { id: 'c-split', t: '力的分解' },
      { id: 'c-balance', t: '共点力平衡' },
      { id: 'c-tips', t: '读题时的几点' },
    ]">
    <div class="note good">
      力是矢量，合成服从<strong>平行四边形定则</strong>：以表示两个分力的线段为邻边作平行四边形，从公共起点出发的对角线就表示合力。设两力夹角为 <Katex tex="\theta" />，则
      <Katex tex="F=\sqrt{F_1^2+F_2^2+2F_1F_2\cos\theta}" />，取值范围是 <Katex tex="|F_1-F_2|\le F\le F_1+F_2" />。共点力平衡的条件是合力为零，正交分解后即 <Katex tex="\sum F_x=0" />、<Katex tex="\sum F_y=0" />。
    </div>

    <h3 class="sec" id="c-add">力的合成与平行四边形定则</h3>
    <p>一个物体往往同时受到几个力的作用。如果某一个力单独作用的效果，跟这几个力共同作用的效果相同，这个力就叫那几个力的<strong>合力</strong>，那几个力叫<strong>分力</strong>。用合力代替分力的过程叫力的合成。所谓「效果相同」，指的是使物体产生的形变与运动状态改变都相同。</p>
    <p>两个共点力的合成法则，可以用实验直接验证：用两条橡皮筋分别拉同一只弹簧秤到某个位置，再用一条橡皮筋把它拉到同一位置，记录三次的力的大小与方向。以两条分力为邻边作平行四边形，对角线恰好与那个合力重合。</p>
    <p>把这条法则写成算式。取 <Katex tex="F_1" /> 沿 <Katex tex="x" /> 轴，<Katex tex="F_2" /> 与它成 <Katex tex="\theta" /> 角，则合力在两个方向上的分量是</p>
    <p style="text-align:center"><Katex tex="F_x=F_1+F_2\cos\theta,\qquad F_y=F_2\sin\theta." display /></p>
    <p>再由勾股定理</p>
    <p style="text-align:center"><Katex tex="F=\sqrt{F_x^2+F_y^2}=\sqrt{F_1^2+F_2^2+2F_1F_2\cos\theta}." display /></p>
    <p>合力与 <Katex tex="F_1" /> 的夹角 <Katex tex="\alpha" /> 满足 <Katex tex="\tan\alpha=\frac{F_2\sin\theta}{F_1+F_2\cos\theta}" />。这个式子与三角形的余弦定理是同一回事，所以力的合成也常写成<strong>三角形定则</strong>：把两个分力首尾相接，从第一个力的起点连到第二个力的终点，这条边就是合力。多个力合成时，把各力首尾相接，从最初的起点连到最后的终点即可。</p>

    <h3 class="sec" id="c-range">合力的大小范围</h3>
    <p>上面那个式子里，<Katex tex="\cos\theta" /> 的取值决定了合力的大小。夹角为零即两力同向时，<Katex tex="\cos\theta=1" />，合力最大，等于 <Katex tex="F_1+F_2" />；夹角为 <Katex tex="180^\circ" /> 即两力反向时，<Katex tex="\cos\theta=-1" />，合力最小，等于 <Katex tex="|F_1-F_2|" />。夹角在两者之间连续变化，合力也随之连续变化，因此</p>
    <p style="text-align:center"><Katex tex="|F_1-F_2|\le F\le F_1+F_2." display /></p>
    <p>由此得到一条常用的判断：夹角增大，合力减小。两个大小不变的力，夹角从 <Katex tex="0^\circ" /> 增大到 <Katex tex="180^\circ" />，合力从最大连续减小到最小。做动态平衡一类题目时，这条趋势常常就是解题的线索。</p>
    <p>下面那块板把这一整段变化画在同一幅图里：两个分力、以它们为邻边的平行四边形、对角线上的合力，再配一支与合力等大反向的第三个力。</p>

    <PhysicsDemo :def="DEMO" />
    <p class="cap">图 力8a · <b>两个共点力的合成与平衡</b>：蓝色、橙色两根箭头是两个分力，绿色箭头是它们的合力，虚线围出的平行四边形以两力为邻边，对角线正是合力。紫色箭头与合力等大反向，是让物体保持平衡所需的第三个力。看点：把夹角 <Katex tex="\theta" /> 从 <Katex tex="0^\circ" /> 拖到 <Katex tex="180^\circ" />，绿色箭头先由长变短再由短变长，读数栏里的合力在下限 <Katex tex="|F_1-F_2|" /> 与上限 <Katex tex="F_1+F_2" /> 之间连续变化；把两个分力调成相等，夹角为 <Katex tex="120^\circ" /> 时合力恰好等于每个分力，这一点常被用来反过来检验公式。</p>

    <h3 class="sec" id="c-split">力的分解</h3>
    <p>力的分解是合成的逆运算，同样服从平行四边形定则，但答案不唯一：同一个力可以分解成无数对分力，夹角与大小都可以不同。要得到确定的分解，必须再加条件。常用的有两类。</p>
    <p><strong>按效果分解。</strong>先想清楚这个力实际起了哪两个作用，再沿着这两个作用的方向拆开。斜面上物体的重力，效果之一是使物体沿斜面下滑，之二是把物体压向斜面，于是分解成沿斜面向下的 <Katex tex="mg\sin\theta" /> 与垂直于斜面向里的 <Katex tex="mg\cos\theta" />。悬挂物体的绳所受力，常沿两根绳的走向拆开。</p>
    <p><strong>正交分解。</strong>建立直角坐标系，把每个力都投影到两条轴上，分别求合力。坐标轴的方向可以自由选取，取在与大部分力重合或垂直的方向上，计算最省。正交分解的好处是把矢量运算变成两次代数加法，力一多就显出优势。</p>
    <p>斜面这个例子最能说明「按效果分解」与「正交分解」是一回事：物块所在的那个位置，取斜面方向为一根轴、垂直斜面方向为另一根轴，沿两轴一投影，得到的就是同一个矩形。下面那块板的左半画着斜面上的物块，橙色箭头是重力，绿色是沿斜面向下的一支，蓝色是压向斜面的一支，虚线把三支箭头补齐成一个矩形。</p>

    <PhysicsDemo :def="SPLIT" />
    <p class="cap">图 力8b · <b>斜面上重力按效果分解</b>：橙色箭头是物块受到的重力 <Katex tex="mg" />，垂直向下；绿色箭头是沿斜面向下的一支 <Katex tex="mg\sin\theta" />，蓝色箭头是压向斜面的一支 <Katex tex="mg\cos\theta" />，两支互相垂直，虚线围出的矩形以重力为对角线。右图画这两个分力随倾角的变化：绿线随 <Katex tex="\theta" /> 增大而升高，蓝线随之下降，两枚实心点标出当前倾角下的取值。看点一：把 <Katex tex="\theta" /> 从 <Katex tex="10^\circ" /> 拖到 <Katex tex="80^\circ" />，绿色箭头越来越长、蓝色箭头越来越短，而橙色那支纹丝不动——分解改变的是两支分力，合起来仍是同一个重力。看点二：<Katex tex="\theta" /> 趋近 <Katex tex="90^\circ" /> 时蓝线趋近于零，斜面接近竖直，物块几乎不再压着斜面。看点三：读数栏里的「两分力平方和」与「<Katex tex="(mg)^2" />」两行始终相等，两个互相垂直的分力满足勾股关系。</p>

    <h3 class="sec" id="c-balance">共点力平衡</h3>
    <p>几个力作用于同一点，或作用线交于同一点，叫<strong>共点力</strong>。物体在共点力作用下保持静止或做匀速直线运动，就说它处于<strong>平衡状态</strong>，条件是合力为零：</p>
    <p style="text-align:center"><Katex tex="\vec F_{\text{合}}=0." display /></p>
    <p>两个力平衡时，两力等大反向。三个力平衡时，任意两个力的合力必与第三个力<strong>等大反向</strong>，三个力的矢量首尾相接能围成一个闭合三角形。这个性质是解三力平衡题的主要工具：先合成两个力，再让合力与第三个力平衡。</p>
    <p>力多时改用正交分解。平衡条件写成两个独立方程：</p>
    <p style="text-align:center"><Katex tex="\sum F_x=0,\qquad \sum F_y=0." display /></p>
    <p>这组方程能解两个未知量。三个力以上的平衡问题，通常就是列这两式再联立。</p>

    <h3 class="sec" id="c-tips">读题时的几点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把合力的大小算成分力之和。</strong>只有两力同向时合力才等于两力之和。一般情况下要按夹角用余弦定理算。</li>
        <li><strong>提示二：认为合力一定大于分力。</strong>夹角大于 <Katex tex="120^\circ" /> 时，两个大小相等的力的合力比每个分力都小。合力是效果上的等效力，不是各力的简单相加。</li>
        <li><strong>提示三：分解时只给一个条件。</strong>分解答案不唯一，没有附加条件就写不出确定的分力。题目里的「沿斜面方向」「使物体匀速」之类，就是那个附加条件。</li>
        <li><strong>提示四：把平衡误当成速度为零。</strong>平衡状态包括静止与匀速直线运动两种。上抛到最高点的物体速度为零，但加速度为 <Katex tex="g" />，并不处于平衡状态。</li>
        <li><strong>提示五：正交分解时把力漏掉。</strong>受力分析要按「重力—接触力—其他力」的顺序逐个检查，列方程前先把每个力的两个分量写全。</li>
      </ul>
    </div>
    <p>回收与预告：本章只回答「力怎样合成、平衡时怎样」，没有回答「力怎样改变运动」。物体受到的合力不为零时，运动状态会怎样变化？下一组牛顿运动定律把合力与加速度联系起来，那里才真正把力与运动接上。</p>
  </PhysicsCh>
</template>

<script setup>
import PhysicsCh from '../../../components/PhysicsCh.vue';
import PhysicsDemo from '../../../components/PhysicsDemo.vue';
import Katex from '../../../components/Katex.vue';
import { demoOf } from '../../../physics/demos/index.js';

const DEMO = demoOf('forceadd');
const SPLIT = demoOf('splitforce');
</script>
