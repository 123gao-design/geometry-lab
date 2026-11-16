<template>
  <ChPage :cur="1" no="方1" base="/calc1/o" :chapters="ON_CHAPTERS"
    title="微分方程的概念与方向场"
    sub="方程里的未知量是函数，连它的导数也一起出现。不给公式、只给斜率，也能把解的形状一片片拼出来。"
    :toc="[{ id: 'o1-def', t: '什么是微分方程' }, { id: 'o1-order', t: '阶与解' }, { id: 'o1-field', t: '方向场' }, { id: 'o1-euler', t: '折线逼近' }]">

    <div class="note good" id="o1-def">含有未知函数及其导数的方程叫<b>微分方程</b>。使方程成为恒等式的函数叫它的<b>解</b>；解中任意常数的个数与阶数相同时称为<b>通解</b>，加上初始条件定出常数后称为<b>特解</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDifffield" />
      <div class="cap">图 方1 · <b>方向场机</b>：每格画一小段短线，斜率等于方程在该点规定的值。拖动 <Katex tex="(x_0,y_0)" /> 换起点，蓝色曲线沿短线走出解。<b>看点</b>：曲线不必求解公式也能画准——它只是处处与短线相切。</div>
    </div>

    <h3 class="sec" id="o1-order">方程、阶与解</h3>
    <p>把未知函数记作 <Katex tex="y=y(x)" />，导数记作 <Katex tex="y'" />、<Katex tex="y''" />。<Katex tex="y'=2x" /> 是一个最简单的微分方程，它的解是 <Katex tex="y=x^2+C" />：求一次积分就得到一个任意常数，所有解排成一族抛物线。方程里出现的最高阶导数决定方程的<b>阶</b>，也决定通解里任意常数的个数。</p>
    <p>母语里说的「解方程」是找一个数，这里找的是一整族函数。把 <Katex tex="y=x^2+C" /> 代回 <Katex tex="y'=2x" />，等式对定义域内每个 <Katex tex="x" /> 都成立，这才是这里「解」的含义。待定的常数由附加条件定：给一条曲线过某点的位置叫初值条件，给两个端点值叫边值条件。</p>
    <p style="text-align:center"><Katex display tex="y'=f(x,y),\qquad y(x_0)=y_0" /></p>
    <p>这种一阶、且导数已被解出的形式叫<b>标准形</b>。<Katex tex="f(x,y)" /> 只与当前位置有关，与解的历史无关，这一点让后面的几何读法成为可能。</p>

    <h3 class="sec" id="o1-field">方向场：把方程画成一张斜率图</h3>
    <p>标准形 <Katex tex="y'=f(x,y)" /> 的含义是：过点 <Katex tex="(x,y)" /> 的解曲线，在那里的切线斜率必须是 <Katex tex="f(x,y)" />。于是在平面的每个点上画一小段倾角为 <Katex tex="\arctan f(x,y)" /> 的线段，就得到方程的<b>方向场</b>。图 方1 的三个预设分别给 <Katex tex="y'=y" />、<Katex tex="y'=-x/y" />、<Katex tex="y'=x-y" />，短线随之铺满画框。</p>
    <p>方向场的读法有三条。其一，同一条水平线上的短线斜率若只随 <Katex tex="x" /> 变，说明 <Katex tex="f" /> 与 <Katex tex="y" /> 无关，解曲线彼此是竖直平移关系。其二，斜率恒为某常数的曲线叫<b>等倾线</b>，它把平面分成几片，每片里短线方向落在同一小范围内。其三，<Katex tex="y'=0" /> 的等倾线上短线水平，解在这条线上的点取到极值，这给了不求解就能判断增减与最值的办法。</p>
    <p>预设 ② 的 <Katex tex="y'=-x/y" /> 还有一层几何意思：解曲线与过原点的半径垂直，于是解是以原点为圆心的圆。代入验证，<Katex tex="x^2+y^2=C" /> 求导得 <Katex tex="2x+2yy'=0" />，正是原方程。方向场里那一圈圈与半径正交的短线，画的就是这件事。</p>

    <h3 class="sec" id="o1-euler">从一点出发，沿短线走</h3>
    <p>给定起点 <Katex tex="(x_0,y_0)" />，沿着该点的短线走一小步，到达新点后再按新点处的斜率改正方向，如此反复，就得到一条折线。把步长取得足够小，折线收敛到真正的解曲线；这套做法叫欧拉折线法，图 方1 用四阶龙格—库塔公式实现，向前向后各走一遍，于是起点两侧都有曲线。</p>
    <p>这一步的意义不在于算得多准，而在于说明：方向场的连续性与光滑性保证了穿过的解曲线存在而且唯一。两条解曲线若相交，交点的斜率就得同时满足两个不同的值，矛盾。所以画面上那么多曲线彼此不相交，正是唯一性的图像表现。</p>
    <p>把起点拖到等倾线 <Katex tex="y'=0" /> 上，蓝色曲线在那一处的切线变平，曲线的峰谷就出现在那里。这条「先看斜率再看形状」的路子，后面几章的解式验证都会回来用它。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：解是函数，不是数。</strong>作答时写成 <Katex tex="y=x^2+C" /> 这样的一族，漏掉任意常数或把 <Katex tex="C" /> 当成已知量，都是常见错误。</li>
        <li><strong>提示二：阶数决定常数的个数。</strong>二阶方程的通解带两个常数，要两条初始条件才定得下来；只给一个是定不住的。</li>
        <li><strong>提示三：方向场里不能有交叉。</strong>若画出的「解曲线」彼此相交，说明采样或补间出了问题，真正过同一点的解只有一条。</li>
        <li><strong>提示四：初值条件要落在解的定义区间内。</strong><Katex tex="y'=y^2" /> 的解 <Katex tex="y=1/(C-x)" /> 在 <Katex tex="x=C" /> 处断开，初始点选在那里，方程本身就没有意义。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDifffield } from '../../../boards/calc1/ode/difffield.js';
import { ON_CHAPTERS } from './onav.js';
</script>
