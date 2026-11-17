<template>
  <ChPage :cur="1" no="行1" base="/linalg/d" :chapters="LD_CHAPTERS"
    title="二阶行列式与面积"
    sub="二阶行列式是一张 2×2 表格按对角线相减得到的一个数。它的绝对值是两支向量张成的平行四边形面积，符号记录转向，所以它同时承担「面积」与「定向」两件事。"
    :toc="[{ id: 'd1-def', t: '定义与展开' }, { id: 'd1-geo', t: '面积与符号' }, { id: 'd1-map', t: '单位正方形的像' }, { id: 'd1-pit', t: '符号与零值' }]">

    <div class="note good" id="d1-def">把四个数按行列排成 <Katex tex="\begin{vmatrix}a_1&amp;b_1\\a_2&amp;b_2\end{vmatrix}" />，规定它的值为主对角线之积减去副对角线之积：<Katex tex="D=a_1b_2-a_2b_1" />。这一条第 5 章向量积里已经见过——<Katex tex="x_1y_2-x_2y_1" /> 就是向量积的二维分量。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDet2D" />
      <div class="cap">图 行1 · <b>二阶行列式与面积</b>：蓝橙两支列向量 <Katex tex="a" />、<Katex tex="b" />，它们张成的平行四边形就是金色单位正方形的像。看点：拖动任一支向量的端点，右栏的行列式与面积同步变化；把 <Katex tex="b" /> 拖到 <Katex tex="a" /> 的另一侧，面积不变而符号翻负；把两支拖成共线，平行四边形压成线段，<Katex tex="D" /> 归零。</div>
    </div>

    <h3 class="sec" id="d1-def">定义与展开</h3>
    <p>行列式的读法是把四个数分成两条对角线，主对角线（左上到右下）取正、副对角线取负。展开的结果是一次的（每项各取一个行一个列），所以行列式对每一行都是线性的：<Katex tex="\begin{vmatrix}a_1+\lambda c_1&amp;b_1\\a_2+\lambda c_2&amp;b_2\end{vmatrix}=\begin{vmatrix}a_1&amp;b_1\\a_2&amp;b_2\end{vmatrix}+\lambda\begin{vmatrix}c_1&amp;b_1\\c_2&amp;b_2\end{vmatrix}" />。</p>
    <p>这条线性性把行列式拆成了两件独立的事：求值（一个数）和运算规律（对行线性、两行互换变号、两行成比例为零）。前者靠定义直接算，后者第 行2 会统一处理。</p>
    <p>与它对应的方程视角也要记住：<Katex tex="D\ne0" /> 时二元一次方程组 <Katex tex="a_1x+b_1y=c_1,\ a_2x+b_2y=c_2" /> 有唯一解，解法写成行列式之比（克拉默法则），<Katex tex="x=\dfrac{\begin{vmatrix}c_1&amp;b_1\\c_2&amp;b_2\end{vmatrix}}{D}" />。分母为零意味着两条直线平行或重合，解的个数随之为零或无穷。</p>

    <h3 class="sec" id="d1-geo">面积与符号</h3>
    <p>以原点为公共起点，两支向量 <Katex tex="a=(a_1,a_2)" />、<Katex tex="b=(b_1,b_2)" /> 张成平行四边形。把它沿 <Katex tex="a" /> 方向切开、补到另一侧，得到一个底为 <Katex tex="|a|" />、高为 <Katex tex="|b|\sin\theta" /> 的矩形，面积是 <Katex tex="|a||b|\sin\theta" />，而 <Katex tex="a_1b_2-a_2b_1" /> 恰好等于这个乘积——与第 积4a 的向量积模长同一个式子。</p>
    <p>符号的含义由转向给出：从 <Katex tex="a" /> 逆时针转到 <Katex tex="b" /> 时 <Katex tex="\theta\in(0,\pi)" />，<Katex tex="\sin\theta>0" />，行列式为正；顺时针转为负。所以严格的说法是<b>有向面积</b>：<Katex tex="S_{\text{有向}}=a_1b_2-a_2b_1" />，普通面积取绝对值。</p>
    <p>三种退化情形对应三个特殊值：两支共线时 <Katex tex="D=0" />；一支为零向量时 <Katex tex="D=0" />；两支互换位置时 <Katex tex="D" /> 只变号。图 行1 的「退化」预设把第二种摆出来——<Katex tex="b" /> 恰好是 <Katex tex="a" /> 的一半，平行四边形压成一条线段。</p>

    <h3 class="sec" id="d1-map">单位正方形的像</h3>
    <p>把 <Katex tex="a" />、<Katex tex="b" /> 当作矩阵的两列，组成 <Katex tex="A=\begin{bmatrix}a_1&amp;b_1\\a_2&amp;b_2\end{bmatrix}" />。这个矩阵作用在坐标向量上，把 <Katex tex="e_1=(1,0)" /> 送到第一列 <Katex tex="a" />，把 <Katex tex="e_2=(0,1)" /> 送到第二列 <Katex tex="b" />。单位正方形的四个顶点 <Katex tex="(0,0),(1,0),(1,1),(0,1)" /> 于是被送到 <Katex tex="(0,0),a,a+b,b" />——正是同一个平行四边形。</p>
    <p>这就是图 行1 里金色虚线小方块与蓝色平行四边形的对应关系。它把行列式的几何意义压缩成一句话：<b>二阶行列式是线性变换的面积放大倍数</b>。面积为一的单位正方形，被映成了面积为 <Katex tex="|D|" /> 的平行四边形；任何图形的面积都按同一个倍数变化，这是仿射变换的结论（第 仿射变换 一章的 A4 已经用过）。</p>
    <p>倍数小于 1 时面积缩小，等于 0 时整个平面被压到一条直线上——此时矩阵不可逆，因为压扁的信息无法还原。这条判据会在矩阵、秩、方程组解的结构里反复出现。</p>

    <h3 class="sec" id="d1-pit">符号与零值</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：正负不是「比大小」。</strong><Katex tex="D=-5" /> 不代表面积是负的。面积恒为非负，符号单独携带定向信息，两者要分开读。</li>
        <li><strong>提示二：行列式为零不等于没有图形。</strong>两支向量共线时平行四边形退化成线段，图形还在，只是面积为零、无法用两条独立方向描述整个平面。</li>
        <li><strong>提示三：交换两行变号，交换两列也变号。</strong>写成 <Katex tex="\begin{vmatrix}a_1&amp;a_2\\b_1&amp;b_2\end{vmatrix}" /> 与原来的值相反，做题时先看清是按行还是按列排的。</li>
        <li><strong>提示四：数值相近不等于行列式为零。</strong>两支向量夹角很小时面积很小但不为零，判断是否共线要看是否严格成比例。</li>
      </ul>
    </div>
    <p>回收与预告：本页把二阶行列式读成一个数、一块面积、一个面积倍数。三阶的情形把这三件事搬到空间：底面积乘上高就是体积，而符号记录三支向量构成右手系还是左手系，这是 行2 的内容。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDet2D } from '../../../boards/linalg/det/det2d.js';
import { LD_CHAPTERS } from './ldnav.js';
</script>
