<template>
  <ChPage :cur="4" no="线4" base="/inequalities/l" :chapters="L_CHAPTERS"
    title="非线性目标函数：斜率与距离"
    sub="目标函数不再写成 ax+by 时，等值线也不再是一族平行直线：分式 (y−b)/(x−a) 是一束过定点的直线，平方和 (x−a)²+(y−b)² 是一族同心圆。可行域还是凸多边形，但最优点可能落在边的内部，不再总是顶点。"
    :toc="[{ id: 'l4-types', t: '三类目标：线性、斜率、距离' }, { id: 'l4-slope', t: '斜率型：分式看定点' }, { id: 'l4-dist', t: '距离型：平方和看距离' }, { id: 'l4-vertex', t: '顶点何时仍然够用' }, { id: 'l4-pit', t: '分母为零与点在域内' }]">
    <div class="note good" id="l4-law">设可行域 <Katex tex="D" /> 是凸多边形。目标 <Katex tex="z=\frac{y-b}{x-a}" /> 表示过定点 <Katex tex="P(a,b)" /> 与点 <Katex tex="(x,y)" /> 的直线斜率；目标 <Katex tex="z=(x-a)^2+(y-b)^2" /> 表示点 <Katex tex="(x,y)" /> 到 <Katex tex="P" /> 的距离平方。当 <Katex tex="P" /> 在 <Katex tex="D" /> 外时，斜率的最值在过 <Katex tex="P" /> 的两条切线的接触顶点取得；距离平方的最大值在离 <Katex tex="P" /> 最远的顶点，最小值可以在边的内部一点（垂足）取得。</div>
    <div class="board-wrap">
      <BoardMount :factory="createNL" />
      <div class="cap">图 线4 · <b>非线性目标机</b>：可行域仍是线2 的四边形 <Katex tex="x\ge0,\ y\ge0,\ x+y\le4,\ x+2y\le7" />，橙色点 <Katex tex="P" /> 与青色点 <Katex tex="Q" /> 都可以拖动。斜率型模式画过 <Katex tex="P" /> 的两条边界切线（绿、青）与过 <Katex tex="Q" /> 的当前直线（金色虚线）；距离型模式画以 <Katex tex="P" /> 为圆心的两个圆，分别经过最近点与最远点。看点：拖 P 让最近点从顶点滑到边的内部，观察最小值的位置与顶点法给出的答案不同。</div>
    </div>

    <h3 class="sec" id="l4-types">三类目标：线性、斜率、距离</h3>
    <p>线性规划的目标 <Katex tex="z=ax+by" /> 是线性的，等值线是一族平行直线，方向由系数 <Katex tex="(a,b)" /> 决定。另有两类目标在考试与实际问题里频繁出现，它们的等值线不再是平行的直线。</p>
    <p>第一类是斜率型 <Katex tex="z=\frac{y-b}{x-a}" />，几何意义是过定点 <Katex tex="P(a,b)" /> 的直线斜率；<Katex tex="z" /> 取定值时，等值线是过 <Katex tex="P" /> 的一整条直线，<Katex tex="z" /> 变化时是一束过 <Katex tex="P" /> 的直线。第二类是距离平方型 <Katex tex="z=(x-a)^2+(y-b)^2" />，<Katex tex="z" /> 取定值时等值线是以 <Katex tex="P" /> 为圆心的圆，<Katex tex="z" /> 变化时是一族同心圆。</p>
    <p>判断目标属于哪一类，看它能否整理成 <Katex tex="ax+by" /> 的形式。能整理的是线性型，用线2 的顶点法；出现分式的是斜率型；出现平方和、绝对值或两点距离的是距离型。</p>

    <h3 class="sec" id="l4-slope">斜率型：分式看定点</h3>
    <p>设 <Katex tex="P" /> 在可行域外。从 <Katex tex="P" /> 出发观察整个可行域，看到的是一个张角小于 <Katex tex="\pi" /> 的扇形；斜率 <Katex tex="z" /> 就是这个张角内每条射线的斜率，正切函数在张角内单调或分段单调，所以最值出现在张角的两条边界射线上。这两条射线正是过 <Katex tex="P" /> 与可行域相切的直线，接触点必是顶点——凸多边形的切线只能碰到顶点或整条边。</p>
    <p>图 线4 的默认定点 <Katex tex="P(4.6,1)" /> 在可行域右外侧，绿色直线与可行域相切于顶点 <Katex tex="B(4,0)" />，青色切线与顶点 <Katex tex="C(1,3)" /> 相接，斜率的最小值约为 <Katex tex="-0.56" />、最大值约为 <Katex tex="1.67" />。拖动 <Katex tex="P" />，两条切线随之转动，接触顶点可能从一个跳到另一个；青色探针 <Katex tex="Q" /> 所在直线的斜率实时显示在徽章里。</p>
    <p>如果 <Katex tex="P" /> 落在可行域内部，过 <Katex tex="P" /> 的直线无论什么斜率都会与区域相交，斜率可以取到任意实数，目标既无最大值也无最小值。如果从 <Katex tex="P" /> 看去有竖直方向穿过区域，竖直直线的斜率不存在，斜率在上下两侧分别趋于无穷，同样没有最值。</p>

    <h3 class="sec" id="l4-dist">距离型：平方和看距离</h3>
    <p>目标 <Katex tex="z=(x-a)^2+(y-b)^2" /> 是点 <Katex tex="(x,y)" /> 到 <Katex tex="P" /> 的距离平方。等值线是以 <Katex tex="P" /> 为圆心的圆，<Katex tex="z" /> 增大时圆向外扩张。于是求最大值就是找「把圆扩到刚好罩住整个可行域」时的半径，求最小值就是找「圆缩到刚好碰到可行域」时的半径。</p>
    <p>最大值总在离 <Katex tex="P" /> 最远的顶点取得：距离平方是凸函数，凸函数在凸多边形上的最大值必在某个顶点，这是线2 顶点论证的直接推广。最小值的情形不同：从 <Katex tex="P" /> 向每条边作垂线，垂足若落在边的内部，它就是比两个端点都更近的点。图 线4 的默认 <Katex tex="P(4.6,1)" /> 到边 <Katex tex="BC" /> 的垂足约为 <Katex tex="(3.8,0.2)" />，恰在边的内部，距离平方的最小值约为 <Katex tex="1.28" />，比到两个端点的值都小。</p>
    <p>垂足落在边外时，最近点退化为端点。对每条边分别求垂足：把 <Katex tex="P" /> 投影到边所在直线上，参数落在 <Katex tex="[0,1]" /> 内则取垂足，否则取较近的端点；再在所有候选里取最小。这个「投影—截断」的做法与向量模块的投影公式同源。</p>

    <h3 class="sec" id="l4-vertex">顶点何时仍然够用</h3>
    <p>线2 的顶点法靠的是线性目标可以写成顶点的凸组合：<Katex tex="z(P)=\sum\lambda_i z(P_i)" />，加权平均不超过最大项。这条论证对分式与平方和都不成立，因为 <Katex tex="z" /> 不再线性。于是不能默认最优解在顶点，必须回到目标函数本身的几何意义。</p>
    <p>不过顶点并没有完全退出。斜率型在 <Katex tex="P" /> 位于域外时，极值仍在顶点（切线接触点）；距离平方型的最大值也仍在顶点。真正需要警惕的是距离型的最小值：它可以在边的内部。图 线4 切换两种模式，同一个 <Katex tex="P" /> 下，斜率型的最优点落在顶点，距离型的最小点落在 <Katex tex="BC" /> 边上，这就是两类目标的区别。</p>

    <h3 class="sec" id="l4-pit">分母为零与点在域内</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>分母为零要单独判断。</strong><Katex tex="x=a" /> 时斜率型目标没有定义。若过 <Katex tex="P" /> 的竖直线与可行域相交，斜率在竖直方向两侧分别趋于无穷，目标没有最大值（或最小值）。不能把这种情况当作普通的最值问题处理，也不能用「斜率最小」的结论套上去。</p>
          <p><strong>P 在域内时结论全部改写。</strong>斜率型在 <Katex tex="P" /> 位于域内时没有最值；距离型的最小值变为 <Katex tex="0" />（在 <Katex tex="P" /> 处取得），最大值仍在顶点。动手之前先判断 <Katex tex="P" /> 与可行域的位置关系。</p>
          <p><strong>距离平方不是距离。</strong>目标 <Katex tex="z" /> 是距离的平方，最值位置与距离的最值位置相同，但数值要开方才是距离。题目问「最短距离」时，求出的 <Katex tex="z_{\min}" /> 还要取算术平方根。</p>
          <p><strong>整数解仍需枚举。</strong>分式或距离的最优点一般不是整点，变量要求取整数时，要在最优点附近的可行整点中逐个比较，思路同线2 的整数模式。</p>
    </div>
    <p>线2 的线性型是这里的特例：把 <Katex tex="z=ax+by" /> 看成等值线为平行直线的一族，最值在顶点；线3 把可行域的边界换成曲线，最优点改由相切决定；线4 把目标函数换成非线性式，最优点可能离开顶点。三种情形合起来，覆盖了高中阶段「简单规划」的基本类型。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createNL } from '../../../boards/inequalities/plan/nltarget.js';
import { L_CHAPTERS } from './lnav.js';
</script>
