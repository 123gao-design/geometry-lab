<template>
  <ChPage :cur="8" no="微8" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="渐近线与函数作图"
    sub="曲线走向无穷远时，常常贴住某条直线；这类直线叫渐近线。先除一次，把分式拆成整式与余项，渐近线就写出来了，函数的整体形状也随之确定。"
    :toc="[{ id: 'd8-vert', t: '垂直渐近线' }, { id: 'd8-far', t: '水平与斜渐近线' }, { id: 'd8-steps', t: '作图步骤' }, { id: 'd8-case', t: '一个完整例子' }]">

    <div class="note good" id="d8-vert">若 <Katex tex="x\to c" /> 时 <Katex tex="|f(x)|\to\infty" />，直线 <Katex tex="x=c" /> 是<b>垂直渐近线</b>；若 <Katex tex="x\to\pm\infty" /> 时 <Katex tex="f(x)\to b" />，直线 <Katex tex="y=b" /> 是<b>水平渐近线</b>；若 <Katex tex="f(x)-(kx+b)\to0" />，直线 <Katex tex="y=kx+b" /> 是<b>斜渐近线</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createAsymLab" />
      <div class="cap">图 微8 · <b>渐近线与作图机</b>：蓝线是曲线，紫色虚线是竖直渐近线 <Katex tex="x=c" />，金色虚线是另一条渐近线。右栏写出把分式拆成整式与余项的恒等式，以及两条渐近线的方程。看点：先把假分式除一次，商给出渐近线，余项说明曲线为什么始终贴着它走；切换两档，看斜渐近线与水平渐近线各自由哪一个量决定。</div>
    </div>

    <h3 class="sec" id="d8-vert">垂直渐近线</h3>
    <p>垂直渐近线出现在函数无定义或趋于无穷的点。对分式函数，分母的零点就是候选位置，但要确认分子在该点不为零，否则两边约分后可能只是一个可去间断。例如 <Katex tex="\dfrac{x^2-1}{x-1}" /> 在 <Katex tex="x=1" /> 处约成 <Katex tex="x+1" />，那里没有渐近线。</p>
    <p>判断时分别看两侧的极限：<Katex tex="x\to c^+" /> 与 <Katex tex="x\to c^-" /> 可能都趋于无穷，也可能一侧趋于正无穷、另一侧趋于负无穷。图 微8 的第一档里，余项 <Katex tex="\dfrac{c^2+a}{x-c}" /> 的符号随 <Katex tex="x-c" /> 改变，所以曲线在竖线两侧分向上下两端，这与图中两支曲线的走势一致。</p>
    <p>除了分式，对数与正切也会出现垂直渐近线：<Katex tex="\ln x" /> 在 <Katex tex="x=0^+" /> 处趋于负无穷，<Katex tex="\tan x" /> 在 <Katex tex="x=\dfrac{\pi}{2}" /> 附近趋于无穷。它们的判据与分式相同：看某个有限点一侧的极限。</p>

    <h3 class="sec" id="d8-far">水平与斜渐近线</h3>
    <p>水平渐近线看的是 <Katex tex="x\to\infty" /> 时的极限值。它最多有两条，分别对应正、负两个方向；图 微8 的第二档把函数写成</p>
    <p style="text-align:center"><Katex display tex="\frac{ax+b}{x-c}=a+\frac{ac+b}{x-c}" /></p>
    <p>当 <Katex tex="x\to\pm\infty" /> 时余项趋于零，函数值趋于 <Katex tex="a" />，所以水平渐近线是 <Katex tex="y=a" />。分子的次数低于分母时水平渐近线是 <Katex tex="x" /> 轴；次数相等时由最高次项系数之比给出，正是这里的 <Katex tex="a" />。</p>
    <p>斜渐近线出现在分子比次数高一次的情形。图 微8 的第一档：</p>
    <p style="text-align:center"><Katex display tex="\frac{x^2+a}{x-c}=x+c+\frac{c^2+a}{x-c}" /></p>
    <p>商是一次式 <Katex tex="x+c" />，它就是斜渐近线。一般做法是设 <Katex tex="y=kx+b" />，由 <Katex tex="k=\lim\limits_{x\to\infty}\dfrac{f(x)}{x}" /> 与 <Katex tex="b=\lim\limits_{x\to\infty}\left[f(x)-kx\right]" /> 两个极限求系数。对多项式商的情形，直接把假分式除开更快，一次除法同时得到 <Katex tex="k" /> 与 <Katex tex="b" />。</p>
    <p>同一条曲线上，正负两个方向的渐近线可以不同。例如 <Katex tex="\sqrt{x^2+1}" /> 在 <Katex tex="x\to+\infty" /> 时贴近 <Katex tex="y=x" />，在 <Katex tex="x\to-\infty" /> 时贴近 <Katex tex="y=-x" />。判断时要两个方向分别看。</p>

    <h3 class="sec" id="d8-steps">作图步骤</h3>
    <p>把前面几章的工具串起来，作图的固定流程是：</p>
    <p><b>第一步，定义域。</b>找出函数有意义的范围，标出不连续点与不可导点，这些位置往往是渐近线或极值的所在。</p>
    <p><b>第二步，奇偶性与周期性。</b>有对称性只画一半；有周期性只画一个周期。</p>
    <p><b>第三步，导数与表格。</b>求 <Katex tex="f'" /> 与 <Katex tex="f''" />，解出驻点与拐点候选，按微7 的表格列出单调区间、极值、凹凸区间。</p>
    <p><b>第四步，渐近线。</b>按上面的三个极限找出竖直、水平、斜渐近线，标出曲线在远处的走势。</p>
    <p><b>第五步，特殊点。</b>算出与坐标轴的交点、极值点的坐标、拐点的坐标，把这些点先画在图上。</p>
    <p>最后按表格把各段曲线连起来，注意在垂直渐近线两侧趋向不同方向，在斜渐近线附近逐步贴近。图 微8 的两档就是按这套流程画出来的，只是把表格与特殊点略去了。</p>

    <h3 class="sec" id="d8-case">一个完整例子</h3>
    <p>作 <Katex tex="f(x)=\dfrac{x^2+1}{x-1}" /> 的图像。</p>
    <p><b>定义域：</b><Katex tex="x\ne1" />。除一次得 <Katex tex="f(x)=x+1+\dfrac{2}{x-1}" />，所以 <Katex tex="x=1" /> 是垂直渐近线，<Katex tex="y=x+1" /> 是斜渐近线。</p>
    <p><b>导数：</b></p>
    <p style="text-align:center"><Katex display tex="f'(x)=\frac{x^2-2x-1}{(x-1)^2},\qquad f''(x)=\frac{4}{(x-1)^3}" /></p>
    <p>驻点由 <Katex tex="x^2-2x-1=0" /> 给出，即 <Katex tex="x=1\pm\sqrt2" />。在 <Katex tex="(1-\sqrt2,\,1)" /> 与 <Katex tex="(1,\,1+\sqrt2)" /> 上导数为负，在其余两段为正；<Katex tex="f''" /> 在 <Katex tex="x<1" /> 时为负、<Katex tex="x>1" /> 时为正，没有拐点（<Katex tex="x=1" /> 不在定义域内）。</p>
    <p><b>取值：</b><Katex tex="f(1-\sqrt2)=1-2\sqrt2\approx-1.83" /> 为极大值，<Katex tex="f(1+\sqrt2)=1+2\sqrt2\approx3.83" /> 为极小值。与 <Katex tex="y" /> 轴交于 <Katex tex="(0,-1)" />，与 <Katex tex="x" /> 轴没有交点，因为 <Katex tex="x^2+1" /> 恒正。</p>
    <p><b>连线：</b>左支从斜渐近线下方起，升到极大值后下降，在 <Katex tex="x\to1^-" /> 时趋向负无穷；右支从 <Katex tex="x\to1^+" /> 的正无穷落下，经过极小值后上升，最后贴到斜渐近线上方。左右两支都在 <Katex tex="x=1" /> 附近转向竖直方向，与紫色虚线相切地接近。</p>
    <p>把这套流程用于任意有理函数都成立。图 微8 的第一档正好是 <Katex tex="a=1" />、<Katex tex="c=1" /> 的情形，可以与上面的结果逐项对照。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：曲线可以与渐近线相交。</strong>渐近线描述的是无穷远处的走势，不是不能越过的边界。<Katex tex="\dfrac{\sin x}{x}" /> 与 <Katex tex="x" /> 轴有无数个交点，却仍以 <Katex tex="x" /> 轴为水平渐近线。</li>
        <li><strong>提示二：分母零点不一定是垂直渐近线。</strong>先约分再判断。<Katex tex="\dfrac{x^2-1}{x-1}" /> 在 <Katex tex="x=1" /> 处只是可去间断，函数值补上 2 之后处处连续，没有渐近线。</li>
        <li><strong>提示三：同一侧不能同时有水平与斜渐近线。</strong>若 <Katex tex="x\to+\infty" /> 时函数趋于常数，斜率 <Katex tex="k" /> 的极限就是零，斜渐近线退化为水平渐近线，两者是同一条。不同方向可以各有一条，例如前面提到的 <Katex tex="\sqrt{x^2+1}" />。</li>
        <li><strong>提示四：渐近线要用极限验证，不能只看次数。</strong>次数关系只能提示可能出现哪种渐近线，具体位置仍要算极限或做除法。含根号、含对数的函数尤其如此，次数的高低在变形之后往往看不出来。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAsymLab } from '../../../boards/calc1/deriv/asymlab.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
