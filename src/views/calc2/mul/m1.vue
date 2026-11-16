<template>
  <ChPage :cur="1" no="微1" base="/calc2/m" :chapters="MD_CHAPTERS"
    title="二重极限与连续"
    sub="一元函数的自变量只有左右两条路可走，二元函数的点可以在平面上从任何方向、沿任何曲线靠近。极限存在要求所有路径通向同一个高度；只要有一条路通向别处，极限就不存在。"
    :toc="[{ id: 'm1-def', t: '二元函数的极限' }, { id: 'm1-path', t: '路径与反例' }, { id: 'm1-calc', t: '求二重极限的常用办法' }, { id: 'm1-cont', t: '连续与闭区域上的性质' }, { id: 'm1-pit', t: '四条提示' }]">
    <div class="note good">设函数 <Katex tex="f(x,y)" /> 在点 <Katex tex="P_0(x_0,y_0)" /> 的某个去心邻域内有定义。若存在常数 <Katex tex="A" />，使得当 <Katex tex="(x,y)" /> 以任何方式无限接近 <Katex tex="P_0" /> 时，<Katex tex="f(x,y)" /> 都无限接近 <Katex tex="A" />，就说 <Katex tex="f" /> 在 <Katex tex="P_0" /> 处的<b>二重极限</b>为 <Katex tex="A" />，记作 <Katex tex="\lim\limits_{(x,y)\to(x_0,y_0)}f(x,y)=A" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDoubleLim" />
      <div class="cap">图 微1 · <b>二重极限机</b>：左图四条路径同时向原点收拢，右侧把沿每条路径的函数值画成 <Katex tex="r" /> 的函数。看点：① 四条曲线都压向同一个高度 <Katex tex="0" />，又与 <Katex tex="f(0,0)=0" /> 接上；② 沿 <Katex tex="y=x" /> 停在 <Katex tex="0.5" />、沿 <Katex tex="y=2x" /> 停在 <Katex tex="0.4" />，两条直线就分开了；③ 三条直线都趋于 <Katex tex="0" />，只有沿抛物线 <Katex tex="y=x^2" /> 的那条升到 <Katex tex="0.5" />——只查直线会漏掉这种情形。</div>
    </div>

    <h3 class="sec" id="m1-def">二元函数的极限</h3>
    <p>二重极限的严格写法用一轮小球：对任意 <Katex tex="\varepsilon>0" />，存在 <Katex tex="\delta>0" />，只要 <Katex tex="0<\sqrt{(x-x_0)^2+(y-y_0)^2}<\delta" />，就有 <Katex tex="|f(x,y)-A|<\varepsilon" />。与一元函数的定义相比，只有一处换了：<Katex tex="0<|x-x_0|<\delta" /> 变成了「到点的距离小于 <Katex tex="\delta" />」。</p>
    <p>这一处换法带来的差别很大。一元函数里 <Katex tex="x\to x_0" /> 只有左右两侧，两侧极限相等就够了；平面上的点可以从无穷多个方向靠近 <Katex tex="P_0" />，还可以沿着弯弯曲曲的路径靠近。<b>定义里那句「以任何方式」正是全部难点所在</b>：它要求每一条路都通向 <Katex tex="A" />，而不能只验几条。</p>
    <p>因此证明极限存在要比证明不存在费事得多，两者用的是两种相反的做法。要说明极限不存在，只需找出两条路径，让它们通向两个不同的高度；要说明极限存在，则要给出一个对所有路径都成立的不等式估计，路径的多样性在这一步被一个统一的界吸收掉。</p>

    <h3 class="sec" id="m1-path">路径与反例</h3>
    <p>画板第二个预设是 <Katex tex="f(x,y)=\dfrac{xy}{x^2+y^2}" />。沿直线 <Katex tex="y=kx" /> 代入得</p>
    <p style="text-align:center"><Katex display tex="f(x,kx)=\frac{kx^2}{(1+k^2)x^2}=\frac{k}{1+k^2}." /></p>
    <p>这个值与 <Katex tex="x" /> 无关，只由斜率决定：沿 <Katex tex="y=x" /> 是 <Katex tex="1/2" />，沿 <Katex tex="y=2x" /> 是 <Katex tex="2/5" />，沿 <Katex tex="y=-x" /> 是 <Katex tex="-1/2" />。路径不同，落点就不同，所以二重极限不存在。画板右图四条曲线在原点附近分开成几个不同高度，正是这件事的图象。</p>
    <p>只查直线仍然不够。第三个预设 <Katex tex="f(x,y)=\dfrac{x^2y}{x^4+y^2}" /> 沿任何一条直线 <Katex tex="y=kx" /> 都有</p>
    <p style="text-align:center"><Katex display tex="f(x,kx)=\frac{kx^3}{x^4+k^2x^2}=\frac{kx}{x^2+k^2}\to0," /></p>
    <p>沿 <Katex tex="x" /> 轴、<Katex tex="y" /> 轴也都是 <Katex tex="0" />。可是沿抛物线 <Katex tex="y=x^2" /> 代入，<Katex tex="f(x,x^2)=\dfrac{x^4}{x^4+x^4}=\dfrac12" />，是一个不为零的常数。可见「所有直线都通向 <Katex tex="A" />」推不出极限存在，直线的斜率再密也覆盖不了抛物线那样的弯曲路径。</p>
    <p>常用的反例路径除了直线与抛物线，还有 <Katex tex="y=kx^2" />、<Katex tex="x=ky^2" /> 以及极坐标形式 <Katex tex="y=x\tan\theta" />。看一个分式在原点附近的表现时，先比较分子与分母的次数：次数相等时分式沿直线趋于一个依赖方向的常数，往往就是极限不存在的信号。</p>

    <h3 class="sec" id="m1-calc">求二重极限的常用办法</h3>
    <p>第一条是<b>夹逼</b>。第一个预设 <Katex tex="f=\dfrac{x^2y}{x^2+y^2}" /> 满足 <Katex tex="\left|\dfrac{x^2y}{x^2+y^2}\right|\le|y|\cdot\dfrac{x^2}{x^2+y^2}\le|y|" />，当 <Katex tex="(x,y)\to(0,0)" /> 时右端趋于零，所以极限为零。这里用的是 <Katex tex="\dfrac{x^2}{x^2+y^2}\le1" /> 这条不依赖路径的界。</p>
    <p>第二条是<b>极坐标化</b>。令 <Katex tex="x=\rho\cos\theta" />、<Katex tex="y=\rho\sin\theta" />，则 <Katex tex="(x,y)\to(0,0)" /> 等价于 <Katex tex="\rho\to0^+" />，而 <Katex tex="\theta" /> 可以任意。</p>
    <p style="text-align:center"><Katex display tex="f(\rho\cos\theta,\rho\sin\theta)=g(\rho,\theta)." /></p>
    <p>若能证明 <Katex tex="|g(\rho,\theta)|\le\varphi(\rho)" />，其中 <Katex tex="\varphi(\rho)\to0" /> 且与 <Katex tex="\theta" /> 无关，则极限为零。以 <Katex tex="\dfrac{xy}{x^2+y^2}" /> 为例，极坐标下是 <Katex tex="\dfrac{\rho^2\sin\theta\cos\theta}{\rho^2}=\dfrac12\sin2\theta" />，与 <Katex tex="\rho" /> 无关却随 <Katex tex="\theta" /> 变化，于是立即看出极限不存在。</p>
    <p>第三条是<b>等价替换与四则运算</b>。若 <Katex tex="f" />、<Katex tex="g" /> 的极限都存在，则和、差、积、商（分母极限非零）的极限等于极限的和、差、积、商。出现 <Katex tex="\dfrac00" /> 型时先用因式分解、有理化或一元函数里的等价无穷小把式子变形，再取极限。</p>

    <h3 class="sec" id="m1-cont">连续与闭区域上的性质</h3>
    <p>若 <Katex tex="\lim\limits_{(x,y)\to(x_0,y_0)}f(x,y)=f(x_0,y_0)" />，就说 <Katex tex="f" /> 在 <Katex tex="P_0" /> 处<b>连续</b>。三条要求连在一起：函数在 <Katex tex="P_0" /> 有定义、极限存在、极限值等于函数值。多项式与有理函数在分母不为零的地方连续，两个连续函数的和、差、积、商（分母不为零）以及复合都连续。</p>
    <p>不连续的点叫间断点。二元函数的间断比一元函数花样更多：除了可去、跳跃、无穷这几类，还多出一种——沿不同路径趋于不同的值，极限本身不存在。画板第二个预设的函数在原点的情形正是这一种，它补不上也改不掉。</p>
    <p>在有界闭区域上连续的函数有三条结论：有界、取到最大值与最小值、介值性（在两点之间取遍中间值）。这三条与一元函数的情形相同，证明思路也一样，只是把一维的区间换成了平面上的闭区域。下一章的多变量最值问题，第一步往往就是确认区域封闭有界、函数连续，从而保证最值确实存在。</p>

    <h3 class="sec" id="m1-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：沿几条路径的极限相同，不能推出二重极限存在。</strong>路径有无数条，验过再多也只是一部分。要下「存在」的结论，必须给出不依赖路径的估计。</li>
        <li><strong>提示二：两次一元极限都存在，也不等于二重极限存在。</strong><Katex tex="\lim\limits_{x\to0}\lim\limits_{y\to0}f" /> 与 <Katex tex="\lim\limits_{y\to0}\lim\limits_{x\to0}f" /> 是先后取极限，路径被限制在两条坐标轴上，二者相等仍可能漏掉别的方向。</li>
        <li><strong>提示三：极坐标化后只看 <Katex tex="\rho\to0" /> 不够。</strong>必须确认余下的式子对 <Katex tex="\theta" /> 一致地小。若 <Katex tex="g(\rho,\theta)" /> 里还留着 <Katex tex="\theta" />，就说明不同方向走向不同的值。</li>
        <li><strong>提示四：分母为零处先化简再谈极限。</strong>约分只能约去公因子，不能把分母整体当作零处理；约分后如果仍含 <Katex tex="\dfrac00" /> 型，改用夹逼或极坐标。</li>
      </ul>
    </div>
    <p>回收与预告：极限解决「靠近时趋于什么」，接下来要解决「靠近时变化多快」。一元函数用差商定义一个导数，二元函数有两个方向可以分别作差商，得到两个偏导数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDoubleLim } from '../../../boards/calc2/mul/doublelim.js';
import { MD_CHAPTERS } from './mnav.js';
</script>
