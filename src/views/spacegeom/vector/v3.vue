<template>
  <ChPage :cur="3" no="向3" base="/spacegeom/v" :chapters="SV_CHAPTERS"
    title="向量积"
    sub="数量积把两条向量压成一个数，向量积则给出一条新的向量：它同时垂直于原来的两条向量，方向由右手法则确定，模等于它们张成的平行四边形的面积。平面法向量、平行四边形面积与三角形的面积，都从这一条运算里出来。"
    :toc="[{ id: 'v3-def', t: '定义与右手法则' }, { id: 'v3-coord', t: '坐标式' }, { id: 'v3-area', t: '面积与距离' }, { id: 'v3-normal', t: '求平面的法向量' }, { id: 'v3-pit', t: '顺序与判据' }]">
    <div class="note good">设两条非零向量 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 的夹角为 <Katex tex="\theta" />。规定它们的<strong>向量积</strong> <Katex tex="\vec a\times\vec b" /> 是满足下面三条的向量：模为 <Katex tex="|\vec a||\vec b|\sin\theta" />；方向同时垂直于 <Katex tex="\vec a" /> 与 <Katex tex="\vec b" />；指向由右手法则确定——右手四指从 <Katex tex="\vec a" /> 弯向 <Katex tex="\vec b" />，拇指的指向就是结果的方向。</div>

    <h3 class="sec" id="v3-def">定义与右手法则</h3>
    <p>右手法则给出的是<strong>有向</strong>约定，因此向量积不满足交换律，而是反交换：</p>
    <p style="text-align:center"><Katex tex="\vec a\times\vec b=-\ \vec b\times\vec a." display /></p>
    <p>两条向量交换顺序，模不变、方向翻转。这一点与数量积形成对照：数量积可交换，向量积可反交换。运算时先定下顺序，一路用到底，中途颠倒会让结果差一个负号。</p>
    <p>向量积还满足对加法的分配律与数乘结合律，但不满足结合律：<Katex tex="(\vec a\times\vec b)\times\vec c" /> 与 <Katex tex="\vec a\times(\vec b\times\vec c)" /> 一般既不相等也不相反。做三重运算时要先写清括号。</p>
    <p>与自身作向量积得零向量：<Katex tex="\vec a\times\vec a=\vec 0" />。这条式子加上分配律，就得到共线的判据 <Katex tex="\vec a\times\vec b=\vec 0\iff\vec a\parallel\vec b" />（约定零向量与任何向量共线）。</p>

    <h3 class="sec" id="v3-coord">坐标式</h3>
    <p>设 <Katex tex="\vec a=(a_1,a_2,a_3)" />、<Katex tex="\vec b=(b_1,b_2,b_3)" />，则</p>
    <p style="text-align:center"><Katex tex="\vec a\times\vec b=\left(a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1\right)." display /></p>
    <p>三个分量分别对应「划掉第三列」「划掉第一列」「划掉第二列」得到的二阶行列式，符号按 <Katex tex="+,-,+" /> 交替。写成行列式便于记忆：</p>
    <p style="text-align:center"><Katex tex="\vec a\times\vec b=\begin{vmatrix}\vec i&amp;\vec j&amp;\vec k\\ a_1&amp;a_2&amp;a_3\\ b_1&amp;b_2&amp;b_3\end{vmatrix}," display /></p>
    <p>按第一行展开即可，注意这不是一个数——第一行是三个基向量，展开后仍是一个向量。线代模块的行1 讲过行列式与面积的关系，这里出现的正是同一个二阶结构。</p>
    <p>验证一组常见的结果：<Katex tex="\vec i\times\vec j=\vec k" />、<Katex tex="\vec j\times\vec k=\vec i" />、<Katex tex="\vec k\times\vec i=\vec j" />，三个基向量按 <Katex tex="x\to y\to z\to x" /> 的循环顺序相乘得下一个，倒过来就得负号。</p>

    <h3 class="sec" id="v3-area">面积与距离</h3>
    <p>把 <Katex tex="\vec a" /> 作底、<Katex tex="\vec b" /> 的终点向底所在直线作高，高为 <Katex tex="|\vec b|\sin\theta" />，于是平行四边形面积为</p>
    <p style="text-align:center"><Katex tex="S=|\vec a||\vec b|\sin\theta=|\vec a\times\vec b|." display /></p>
    <p>三角形是平行四边形的一半，所以 <Katex tex="S_{\triangle}=\tfrac12|\vec a\times\vec b|" />。这条式子把面积问题变成了算一个坐标——比先求高再相乘省事得多，尤其是空间三角形没有现成的高可直接量。</p>
    <p>用同样的想法可以求点到直线的距离。设直线过 <Katex tex="P_0" />、方向向量为 <Katex tex="\vec s" />，则点 <Katex tex="P" /> 到直线的距离是平行四边形面积除以底：</p>
    <p style="text-align:center"><Katex tex="d=\frac{|\overrightarrow{P_0P}\times\vec s|}{|\vec s|}." display /></p>
    <p>它等价于向2 的「勾股—投影」写法，两者的差别只在计算量。求两条平行线之间的距离也用它：在一条直线上任取一点，算到另一条直线的距离即可。</p>
    <div class="board-wrap">
      <BoardMount :factory="createSpaceCross" />
      <div class="cap">图 向3 · <b>向量积与平行四边形面积</b>：绿色平行四边形由 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 张成，紫色箭头是 <Katex tex="\vec c=\vec a\times\vec b" />（方向按真实单位向量、长度压缩到便于观察），原点的两处直角标记说明 <Katex tex="\vec c" /> 与两条向量都垂直，橙色虚线与直角是平行四边形的高。徽章读面积、向量积坐标与夹角。看点：<Katex tex="\theta" /> 推到 <Katex tex="90^\circ" /> 时面积取到最大 <Katex tex="|\vec a||\vec b|" />；把 <Katex tex="\theta" /> 压到零，平行四边形塌成一条线，向量积缩成零向量、紫色的箭头整条消失；拨动方位角 <Katex tex="\varphi" />，紫色箭头绕着底面垂直方向转动，模始终不变。</div>
    </div>

    <h3 class="sec" id="v3-normal">求平面的法向量</h3>
    <p>平面内任意两条不共线的方向向量 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 的向量积，都垂直于这两条向量，因而垂直于整个平面——这正是法向量。用三点定平面时，取</p>
    <p style="text-align:center"><Katex tex="\vec n=\overrightarrow{P_1P_2}\times\overrightarrow{P_1P_3}." display /></p>
    <p>代回点法式 <Katex tex="\vec n\cdot\overrightarrow{P_1P}=0" /> 就得到平面方程。算出的 <Katex tex="\vec n" /> 可能带分数，把它同乘一个数化成整数即可，方程两边同乘，平面不变。</p>
    <p>向量积还给出了判断三点共线的判据：<Katex tex="\overrightarrow{AB}\times\overrightarrow{AC}=\vec 0" /> 当且仅当三点共线。面4 求异面直线距离时，公垂线的方向也是两条方向向量的向量积。</p>

    <h3 class="sec" id="v3-pit">顺序与判据</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把向量积与数量积的结果混在一起。</strong>数量积得到数，向量积得到向量。写 <Katex tex="\vec a\cdot\vec b\cdot\vec c" /> 这类式子没有意义，先想清楚这一步要的是数还是向量。</li>
        <li><strong>提示二：交换顺序不改号。</strong>右手法则是有向的，<Katex tex="\vec a\times\vec b" /> 与 <Katex tex="\vec b\times\vec a" /> 差一个负号。求法向量时顺序一旦定下，后续代入点法式时就不要再换，否则整个平面会写成另一侧。</li>
        <li><strong>提示三：以为 <Katex tex="\vec a\times\vec b=\vec 0" /> 说明其中一条是零向量。</strong>非零向量也可能共线，此时叉积照样为零向量。判断零向量要看模是否为零，判断共线才用叉积。</li>
        <li><strong>提示四：用向量积算面积时漏掉底。</strong>叉积的模是<strong>平行四边形</strong>的面积，三角形要再取一半；点到直线的距离要再除以底的模 <Katex tex="|\vec s|" />。这两处漏乘漏除最常见。</li>
      </ul>
    </div>
    <p>回收与预告：向量积给出垂直于两条向量的方向，把三条向量凑在一起乘两次，就得到一个数——向4 的混合积，它的绝对值是三向量张成的平行六面体的体积。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSpaceCross } from '../../../boards/spacegeom/vector/spacecross.js';
import { SV_CHAPTERS } from './svnav.js';
</script>
