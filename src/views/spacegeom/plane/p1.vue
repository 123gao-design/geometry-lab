<template>
  <ChPage :cur="1" no="面1" base="/spacegeom/p" :chapters="SP_CHAPTERS"
    title="平面方程与法向量"
    sub="平面在空间里由一个点与一条法向量确定。把「平面内任一点与定点的连线垂直于法向量」写成数量积为零，就得到点法式；展开后是一般式，截距不为零时还写成截距式。三张写法的背后是同一条式子，换的只是表达几何条件的方式。"
    :toc="[{ id: 'p1-point', t: '点法式' }, { id: 'p1-general', t: '一般式与截距式' }, { id: 'p1-three', t: '三点定平面' }, { id: 'p1-pos', t: '平面的位置与判定' }, { id: 'p1-pit', t: '法向量与方程的四条' }]">
    <div class="note good">设平面过点 <Katex tex="P_0(x_0,y_0,z_0)" />，法向量为 <Katex tex="\vec n=(A,B,C)\ne\vec 0" />，则点 <Katex tex="P(x,y,z)" /> 落在该平面内的充要条件是 <Katex tex="\vec n\cdot\overrightarrow{P_0P}=0" />，即
      <Katex tex="A(x-x_0)+B(y-y_0)+C(z-z_0)=0." display /></div>

    <h3 class="sec" id="p1-point">点法式</h3>
    <p>把条件写开：<Katex tex="\overrightarrow{P_0P}" /> 是平面内的方向，<Katex tex="\vec n" /> 垂直于平面，也就垂直于平面内每一条向量，于是数量积为零。这条判据由向2 的垂直条件直接搬来，不需要另立新公式。</p>
    <p>反过来说，满足 <Katex tex="\vec n\cdot\overrightarrow{P_0P}=0" /> 的点 <Katex tex="P" /> 只能落在一张平面上——这些点的轨迹就是过 <Katex tex="P_0" /> 且以 <Katex tex="\vec n" /> 为法向量的平面。所以点法式的两件要素缺一不可：定点的位置决定平面平移到哪里，法向量决定平面朝哪个方向偏。</p>
    <p>法向量可以随意伸缩：<Katex tex="2\vec n" /> 与 <Katex tex="\vec n" /> 给出同一张平面，方程两边同乘一个非零数也一样。解题时把法向量化成整数、让首项系数为正，是常用的整理习惯。</p>
    <div class="board-wrap">
      <BoardMount :factory="createPlaneForms" />
      <div class="cap">图 面1 · <b>平面方程与法向量</b>：三档共用一张画板。① 点法式——方向角 <Katex tex="\theta" />、方位角 <Katex tex="\varphi" /> 两个滑块转动法向量，距离 <Katex tex="d" /> 让平面沿法线平移，橙色点是定点 <Katex tex="P_0" />；② 三点定平面——A、B、C 三点的高度各自可调，法向量由 <Katex tex="\overrightarrow{AB}\times\overrightarrow{AC}" /> 现算，三点压到一条线上时平面不再确定；③ 一般式——四个系数独立拨动，<Katex tex="D=0" /> 时平面穿过原点。徽章读方程、法向量与原点到平面的距离；紫色箭头从垂足画出，四处直角标记说明垂足与法线的关系。看点：三档之间切换，同一张平面会用三种写法读出来；<Katex tex="\varphi" /> 转过半圈，法向量方向翻转，平面绕原点自动换到另一侧。</div>
    </div>

    <h3 class="sec" id="p1-general">一般式与截距式</h3>
    <p>把点法式展开并合并常数项，得到<strong>一般式</strong></p>
    <p style="text-align:center"><Katex tex="Ax+By+Cz+D=0\quad(A,B,C\text{ 不同时为零})." display /></p>
    <p>反过来，任给一组不全为零的 <Katex tex="A,B,C" />，方程 <Katex tex="Ax+By+Cz+D=0" /> 都表示一张平面，它的法向量就是 <Katex tex="(A,B,C)" />。这条「系数即法向量」的读法要练熟，后面求夹角、判平行全用得上。</p>
    <p>几个特殊系数对应特殊位置：<Katex tex="D=0" /> 时平面过原点；<Katex tex="C=0" /> 时法向量平行于 <Katex tex="xOy" /> 平面，平面垂直于 <Katex tex="xOy" /> 平面（含 <Katex tex="z" /> 轴方向）；只有 <Katex tex="A\ne 0" /> 且 <Katex tex="B=C=0" /> 时，方程退化成 <Katex tex="x=-\tfrac DA" />，是一张平行于 <Katex tex="yOz" /> 平面的平面。</p>
    <p>当三个截距 <Katex tex="a,b,c" /> 都不为零时，平面与三条坐标轴各有交点，方程可改写成<strong>截距式</strong></p>
    <p style="text-align:center"><Katex tex="\frac xa+\frac yb+\frac zc=1." display /></p>
    <p>它与立体几何里的「三视图」关系最近：截距式的三个分母就是平面与三条轴的交点坐标，画草图时直接定位三个截点即可。截距为零的情形不能写成截距式（分母为零），这时仍用一般式。</p>

    <h3 class="sec" id="p1-three">三点定平面</h3>
    <p>不共线的三点确定一张平面。给定 <Katex tex="P_1,P_2,P_3" />，先由向3 的向量积取法向量</p>
    <p style="text-align:center"><Katex tex="\vec n=\overrightarrow{P_1P_2}\times\overrightarrow{P_1P_3}," display /></p>
    <p>再代回点法式 <Katex tex="\vec n\cdot\overrightarrow{P_1P}=0" /> 即得方程。三点共线时叉积为零向量，方程不存在——这正是「向量积为零即共线」的判据在本节直接派上用场的地方。</p>
    <p>画板第二档把三点的高度做成滑块，第三点抬高时平面绕前两点的连线转动，法向量随之倾斜。三点的 <Katex tex="z" /> 都调到同一高度，平面变成水平面，法向量竖直向上。</p>

    <h3 class="sec" id="p1-pos">平面的位置与判定</h3>
    <p>两张平面 <Katex tex="\pi_1:A_1x+B_1y+C_1z+D_1=0" />、<Katex tex="\pi_2:A_2x+B_2y+C_2z+D_2=0" /> 的位置关系由法向量决定：</p>
    <ul>
      <li>平行或重合：<Katex tex="\vec n_1\parallel\vec n_2" />，即两组系数成比例 <Katex tex="\tfrac{A_1}{A_2}=\tfrac{B_1}{B_2}=\tfrac{C_1}{C_2}" />（分母为零时按分量单独核对）。系数比例之外常数项也成同一比例则<strong>重合</strong>，否则<strong>平行</strong>。</li>
      <li>垂直：<Katex tex="\vec n_1\cdot\vec n_2=0" />，即 <Katex tex="A_1A_2+B_1B_2+C_1C_2=0" />。</li>
      <li>斜交：其余情形，交线方向为 <Katex tex="\vec n_1\times\vec n_2" />，二面角取法向量夹角的锐角。</li>
    </ul>
    <p>这三条判据与平面内两条直线的判据形式一致，只是把斜率换成了法向量——平面内的「平行」看方向向量的比例，空间里的「平行」看法向量的比例，两者是同一套向量语言。面3 会把它们整理成一张对照表。</p>

    <h3 class="sec" id="p1-pit">法向量与方程的四条</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="(A,B,C)" /> 当成平面上的点。</strong>一般式里的三个系数是<strong>法向量</strong>的分量，不是平面经过的点。平面经过的点要把坐标代进方程验算，否则无从谈起。</li>
        <li><strong>提示二：写点法式时用错了差向量的顺序。</strong><Katex tex="\vec n\cdot\overrightarrow{P_0P}=0" /> 与 <Katex tex="\vec n\cdot\overrightarrow{PP_0}=0" /> 等价（差一个负号），两种都行；但把 <Katex tex="(x_0,y_0,z_0)" /> 当成未知点、把 <Katex tex="(x,y,z)" /> 当成定点，方程就整个反了。</li>
        <li><strong>提示三：三点定平面时没有先核对三点是否共线。</strong>叉积为零向量时分母、比例式全部失去意义，写出的方程会把空间里无穷多张平面算成一张。求法向量之前先算 <Katex tex="\overrightarrow{AB}\times\overrightarrow{AC}" /> 是否为非零向量。</li>
        <li><strong>提示四：用 <Katex tex="\tfrac{A_1}{A_2}=\tfrac{B_1}{B_2}" /> 判平行时忽略了零系数。</strong><Katex tex="A_2=0" /> 时比例式无意义，须改写成分量与常数项成同一倍数 <Katex tex="(A_1,B_1,C_1,D_1)=\lambda(A_2,B_2,C_2,D_2)" />。</li>
      </ul>
    </div>
    <p>回收与预告：平面用点与法向量写成方程之后，直线也能用同一种语言写出来——只差把法向量换成方向向量。面2 给出点向式、参数式，以及两平面交线的写法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPlaneForms } from '../../../boards/spacegeom/plane/planeforms.js';
import { SP_CHAPTERS } from './spnav.js';
</script>
