<template>
  <ChPage :cur="2" no="基2" base="/vectors/b" :chapters="VB_CHAPTERS"
    title="向量的坐标表示与线性运算"
    sub="取定直角坐标基底之后，每个向量都对应一对实数。起点在原点时坐标就是终点坐标；起点不在原点时，用终点坐标减起点坐标。坐标一旦到手，加法、减法、数乘都化成逐分量的算术。"
    :toc="[{ id: 'b2-def', t: '坐标的定义' }, { id: 'b2-op', t: '线性运算逐分量' }, { id: 'b2-basis', t: '从基底到直角坐标' }, { id: 'b2-pit', t: '点与向量、方向与顺序' }]">
    <div class="note good" id="b2-def">在直角坐标系中，以原点 <Katex tex="O" /> 为起点的向量 <Katex tex="\overrightarrow{OP}" />，其终点 <Katex tex="P" /> 的坐标 <Katex tex="(x,y)" /> 就叫做向量 <Katex tex="\overrightarrow{OP}" /> 的<strong>坐标</strong>，记作 <Katex tex="\overrightarrow{OP}=(x,y)" />。一般地，若 <Katex tex="A(x_1,y_1)" />、<Katex tex="B(x_2,y_2)" />，则 <Katex tex="\overrightarrow{AB}=(x_2-x_1,\ y_2-y_1)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCoordVec" />
      <div class="cap">图 基2 · <b>向量的坐标</b>：拖动 A、B 两点，蓝色是 <Katex tex="\overrightarrow{AB}" />；橙色虚线一支把 AB 整个平移到原点，两支箭头等长同向，坐标自然相同。看点：④ 把 A 拖到原点，坐标式里两个减法项都变成 0，读出的正是 B 的坐标；⑤ 把 A、B 合到一点，箭头缩成零向量，坐标与模都归零。</div>
    </div>

    <h3 class="sec" id="b2-def">坐标的定义</h3>
    <p>直角坐标基底 <Katex tex="\vec i=(1,0)" />、<Katex tex="\vec j=(0,1)" /> 下，任一向量写成 <Katex tex="x\vec i+y\vec j" />，系数 <Katex tex="(x,y)" /> 就是它的坐标。横系数是从原点沿 <Katex tex="x" /> 轴走多远，纵系数是沿 <Katex tex="y" /> 轴走多远；两个分量各自管一个方向。</p>
    <p>起点不在原点时，向量仍然只由「终点减起点」决定。图 基2 的橙色一支把蓝色箭头平移到原点，这一平移不改变方向与长度；平移后终点落点 <Katex tex="(x_2-x_1,\ y_2-y_1)" />，这就是 <Katex tex="\overrightarrow{AB}" /> 的坐标。这条规则把「向量与起点无关」写成了算式：<strong>只要两只端点的坐标定了，向量就定了</strong>。</p>

    <h3 class="sec" id="b2-op">线性运算逐分量</h3>
    <p>设 <Katex tex="\vec a=(x_1,y_1)" />，<Katex tex="\vec b=(x_2,y_2)" />，则 <Katex tex="\vec a+\vec b=(x_1+x_2,\ y_1+y_2)" />，<Katex tex="\vec a-\vec b=(x_1-x_2,\ y_1-y_2)" />，<Katex tex="\lambda\vec a=(\lambda x_1,\ \lambda y_1)" />。三条都是把几何运算拆到两个方向上分别做：加法对应两条折线的合成，减法对应差向量，数乘把两个分量一起伸缩。</p>
    <p>这三条与向1、向2、向3 的画法完全一致，只是把作图换成了算数。比如向2 的平行四边形法则，在坐标下就是两个分量各自相加；向3 的共线定理，在坐标下就是两个分量同倍增长。后面处理平面几何题时，先取坐标再算，往往比纯画图省事——坐标法在三角函数模块解三角形一章已经用过一次，这里的坐标是同一套语言。</p>

    <h3 class="sec" id="b2-basis">从基底到直角坐标</h3>
    <p>直角坐标基底是基1 定理的特例：<Katex tex="\vec i" />、<Katex tex="\vec j" /> 不共线，所以每个向量有唯一坐标。它特别方便，因为两个基向量互相垂直且长度都是 1——任意一点到两轴的距离，正好就是它两个坐标的绝对值。</p>
    <p>向量的模也由此可算：<Katex tex="|\overrightarrow{AB}|=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}" />，这正是两点间距离公式。当两个分量中有一个为零时，向量与某条坐标轴平行：纵分量为零是水平向量，横分量为零是竖直向量，图 基2 的 ②、③ 各演一例。</p>

    <h3 class="sec" id="b2-pit">点与向量、方向与顺序</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：点的坐标与向量坐标写法相同，含义不同。</strong><Katex tex="A(2,1)" /> 是平面上的一个位置；<Katex tex="\vec a=(2,1)" /> 是一支箭头。点的坐标随平移改变，向量的坐标不随平移改变。</li>
        <li><strong>提示二：<Katex tex="\overrightarrow{AB}" /> 与 <Katex tex="\overrightarrow{BA}" /> 差一个负号。</strong>前者是终点减起点，后者反过来。<Katex tex="\overrightarrow{AB}=(-4,-3)" /> 与 <Katex tex="\overrightarrow{BA}=(4,3)" /> 长度相等、方向相反，正是向1 的相反向量。</li>
        <li><strong>提示三：求模要用两个分量的平方和。</strong><Katex tex="|\overrightarrow{AB}|\ne|x_2-x_1|+|y_2-y_1|" />，后者是把两段折线的长度相加，只有在向量与坐标轴平行时才与原向量同长。</li>
        <li><strong>提示四：坐标里两个分量的次序不能换。</strong><Katex tex="(x,y)" /> 先横后纵，<Katex tex="(y,x)" /> 是另一个向量。作图时把分量读反，箭头会落到关于直线 <Katex tex="y=x" /> 的对称位置上。</li>
      </ul>
    </div>
    <p>回收与预告：基1 的系数在这里固定成直角基底下的 <Katex tex="(x,y)" />，向1 的「终点在原点时读坐标」也在这里接上：那正是起点为原点的特例。基3 用坐标判共线与定比分点，把「三点是否共线」「分点在哪」都化成一次方程组的求解。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCoordVec } from '../../../boards/vectors/basis/coordvec.js';
import { VB_CHAPTERS } from './vbnav.js';
</script>
