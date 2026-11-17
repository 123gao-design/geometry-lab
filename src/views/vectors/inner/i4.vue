<template>
  <ChPage :cur="4" no="积4" base="/vectors/i" :chapters="VI_CHAPTERS"
    title="向量积与它的几何意义"
    sub="数量积把两支向量压成一个数，向量积再给出一支新向量：它垂直于原来的两支，模等于它们张成的平行四边形的面积。平面内向量的向量积只剩一个分量，这个分量的绝对值是面积，符号记录从 a 转到 b 的方向。空间里向量积直接充当法向量，平面的方程、点到平面的距离与平行六面体的体积都由它读出。"
    :toc="[{ id: 'i4-def', t: '定义与右手定则' }, { id: 'i4-2d', t: '二维：有向面积' }, { id: 'i4-3d', t: '三维：法向量与面积' }, { id: 'i4-prop', t: '性质与坐标式' }, { id: 'i4-pit', t: '方向与符号' }]">
    <div class="note good">对两个向量 <Katex tex="\vec a" />、<Katex tex="\vec b" />，向量积 <Katex tex="\vec a\times\vec b" /> 是一个向量，它的模为 <Katex tex="|\vec a||\vec b|\sin\theta" />，方向垂直于 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 所确定的平面，指向由右手定则给出。二维情形下这支向量只能沿 <Katex tex="z" /> 轴，于是只剩一个带符号的分量 <Katex tex="x_1y_2-x_2y_1" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCross2D" />
      <div class="cap">图 积4a · <b>向量积与有向面积</b>：蓝、橙两支向量张成平行四边形，<Katex tex="\theta" /> 处的金色短弧带箭头，标出从 <Katex tex="\vec a" /> 转到 <Katex tex="\vec b" /> 的方向。看点：逆时针转时色块为蓝、有向面积为正；顺时针转时色块变为橙色、有向面积为负；两支拖到共线，色块消失，有向面积归零。面积徽章把 <Katex tex="|\vec a||\vec b|\sin\theta" /> 的三项乘积逐项列出，可与有向面积的绝对值对照。</div>
    </div>

    <h3 class="sec" id="i4-def">定义与右手定则</h3>
    <p>设 <Katex tex="\theta" /> 是 <Katex tex="\vec a" /> 与 <Katex tex="\vec b" /> 的夹角，规定</p>
    <p style="text-align:center"><Katex tex="|\vec a\times\vec b|=|\vec a||\vec b|\sin\theta,\qquad \vec a\times\vec b\perp\vec a,\quad \vec a\times\vec b\perp\vec b." display /></p>
    <p>方向用右手定则判定：右手四指从 <Katex tex="\vec a" /> 弯向 <Katex tex="\vec b" />，拇指所指的一侧就是 <Katex tex="\vec a\times\vec b" /> 的方向。两支向量不共线时，过同一点作 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 唯一确定一个平面，向量积垂直于这个平面，方向有两种可能，右手定则从中选一种。</p>
    <p>交换两支向量，右手四指改为从 <Katex tex="\vec b" /> 弯向 <Katex tex="\vec a" />，拇指指向相反，所以 <Katex tex="\vec a\times\vec b=-\vec b\times\vec a" />。向量积不满足交换律，这是它与数量积最显眼的区别。两支共线时 <Katex tex="\sin\theta=0" />，向量积为零向量；<Katex tex="\vec a\times\vec a=\vec 0" /> 是它的特例。</p>
    <div class="board-wrap">
      <BoardMount :factory="createCross3D" />
      <div class="cap">图 积4b · <b>向量积</b>：两支向量落在水平面内，金色箭头是 <Katex tex="\vec a\times\vec b" />，两处直角标记说明它同时垂直于 <Katex tex="\vec a" /> 与 <Katex tex="\vec b" />。看点：拖动两支向量的端点，金色箭头始终垂直于水平面，长度随平行四边形的面积一起增减；把 <Katex tex="\vec b" /> 拖到 <Katex tex="\vec a" /> 的另一侧，转向反过来，箭头改指平面下方。徽章里的坐标式只留下 <Katex tex="z" /> 分量，正是二维的有向面积。</div>
    </div>

    <h3 class="sec" id="i4-2d">二维：有向面积</h3>
    <p>把平面向量写成 <Katex tex="\vec a=(x_1,y_1)" />、<Katex tex="\vec b=(x_2,y_2)" />，并把它们看作空间里 <Katex tex="z=0" /> 平面上的向量，则</p>
    <p style="text-align:center"><Katex tex="\vec a\times\vec b=(0,\ 0,\ x_1y_2-x_2y_1)." display /></p>
    <p>这个唯一的非零分量记作 <Katex tex="D=x_1y_2-x_2y_1" />，叫作两支向量的<strong>有向面积</strong>。它的绝对值等于以 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 为邻边的平行四边形的面积：<Katex tex="S=|\vec a||\vec b|\sin\theta=|x_1y_2-x_2y_1|" />。三角形 <Katex tex="OAB" /> 只占平行四边形的一半，面积是 <Katex tex="\tfrac12|D|" />。</p>
    <p>符号的含义是转向。当 <Katex tex="\vec b" /> 在 <Katex tex="\vec a" /> 的逆时针一侧时 <Katex tex="D>0" />，向量积指向 <Katex tex="z" /> 轴正方向；顺时针一侧时 <Katex tex="D<0" />，指向 <Katex tex="z" /> 轴负方向。图 积4a 的色块按符号换色，正是把这件事画出来。子专题二里判定共线的式子 <Katex tex="x_1y_2-x_2y_1=0" />，在这里就是「向量积为零向量、平行四边形退化」。</p>
    <p>二维的向量积常直接当作一个数使用，因为它的方向只有正负两种。这时它与二阶行列式是同一个东西：<Katex tex="\begin{vmatrix}x_1&amp;y_1\\x_2&amp;y_2\end{vmatrix}=x_1y_2-x_2y_1" />。行列式的绝对值给面积，符号给定向，两条性质在同一行里。</p>

    <h3 class="sec" id="i4-3d">三维：法向量与面积</h3>
    <p>设 <Katex tex="\vec a=(a_1,a_2,a_3)" />、<Katex tex="\vec b=(b_1,b_2,b_3)" />，向量积的坐标式是</p>
    <p style="text-align:center"><Katex tex="\vec a\times\vec b=(a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1)." display /></p>
    <p>三项各是另外两个坐标的交叉差，次序固定：第一项缺 <Katex tex="a_1" />、<Katex tex="b_1" />，第二项缺第二坐标，第三项缺第三坐标，且每一项都是「前下标的后坐标乘以后下标的前坐标」在前。模的平方可以按分量算，也可以按恒等式算：</p>
    <p style="text-align:center"><Katex tex="|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2-(\vec a\cdot\vec b)^2." display /></p>
    <p>模的几何意义仍然是面积：<Katex tex="|\vec a\times\vec b|" /> 等于平行四边形的面积。方向的意义是法向量：只要 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 不共线，<Katex tex="\vec a\times\vec b" /> 就是它们所确定平面的一个法向量。立体几何的标2 用平面上两个方向向量作叉积求平面方程，走的就是这一步。</p>
    <p>再添一支向量 <Katex tex="\vec c" />，混合积 <Katex tex="(\vec a\times\vec b)\cdot\vec c" /> 的绝对值等于以 <Katex tex="\vec a" />、<Katex tex="\vec b" />、<Katex tex="\vec c" /> 为棱的平行六面体的体积：底面是以 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 为邻边的平行四边形，高是 <Katex tex="\vec c" /> 在法向量上的投影。三支向量共面时混合积为零，与「三个向量线性相关」是同一句话。</p>

    <h3 class="sec" id="i4-prop">性质与坐标式</h3>
    <p>向量积满足对加法的分配律与数乘的结合律：</p>
    <p style="text-align:center"><Katex tex="\vec a\times(\vec b+\vec c)=\vec a\times\vec b+\vec a\times\vec c,\qquad (\lambda\vec a)\times\vec b=\lambda(\vec a\times\vec b)." display /></p>
    <p>但不满足交换律，也不满足结合律：<Katex tex="\vec a\times\vec b=-\vec b\times\vec a" />，而 <Katex tex="(\vec a\times\vec b)\times\vec c" /> 与 <Katex tex="\vec a\times(\vec b\times\vec c)" /> 一般连方向都不同。遇到连续两次叉积，按坐标式逐项算，不要凭交换次序化简。</p>
    <p>数量积与向量积的对照可以排成一张表。数量积的结果是数，用 <Katex tex="\cos\theta" />，等于零表示垂直；向量积的结果是向量，用 <Katex tex="\sin\theta" />，等于零向量表示共线。两者的模满足拉格朗日恒等式 <Katex tex="|\vec a\times\vec b|^2+(\vec a\cdot\vec b)^2=|\vec a|^2|\vec b|^2" />，恰好是 <Katex tex="\sin^2\theta+\cos^2\theta=1" /> 的向量版。</p>

    <h3 class="sec" id="i4-pit">方向与符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把向量积写成数。</strong>三维里 <Katex tex="\vec a\times\vec b" /> 是向量，只报模长会丢掉方向；二维里它确实只剩一个数，那是取了 <Katex tex="z" /> 分量，不是向量积没有方向。</li>
        <li><strong>提示二：右手定则左右手混用。</strong>换左手，<Katex tex="\vec a\times\vec b" /> 会指到平面另一侧，与 <Katex tex="\vec b\times\vec a" /> 混淆。判定时四指从第一个向量弯向第二个向量，顺序不能反。</li>
        <li><strong>提示三：<Katex tex="z" /> 分量的符号写反。</strong>平面向量的向量积第三分量是 <Katex tex="a_1b_2-a_2b_1" />，不是 <Katex tex="a_2b_1-a_1b_2" />。写反了面积照样对，转向全错。</li>
        <li><strong>提示四：面积取成带符号的量。</strong>面积是 <Katex tex="|x_1y_2-x_2y_1|" />，非负；有向面积才带符号。求三角形面积时先取绝对值，再除以 2。</li>
        <li><strong>提示五：以为 <Katex tex="\vec a\times\vec b" /> 与 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 都垂直就唯一确定。</strong>垂直于一个平面的方向有正反两种，还要靠右手定则（或题设的取向）定下是哪一支。</li>
      </ul>
    </div>
    <p>回收与预告：积1、积2 的数量积读夹角与投影，这里的向量积读面积与法向量，两套度量合起来覆盖了长度、夹角、面积与体积。下一子专题取向量的应用：用基底把几何条件写成向量式，平行与垂直分别落到数乘与点积为零上，面积与距离则交给向量积。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCross2D } from '../../../boards/vectors/inner/cross2d.js';
import { createBoard as createCross3D } from '../../../boards/vectors/inner/cross3d.js';
import { VI_CHAPTERS } from './vinav.js';
</script>
