<template>
  <ChPage :cur="2" no="重2" base="/calc2/r" :chapters="MR_CHAPTERS"
    title="二重积分的计算"
    sub="二重积分化成一元积分的办法是「先一后另一」：先固定一个变量扫一条线，内层积出一个只含另一个变量的函数，再对它积一次。两种先后对应竖条与横条，同一个区域有时只有一种顺序好写。"
    :toc="[{ id: 'r2-quad', t: '区域的两种写法' }, { id: 'r2-x', t: '先对 y、后对 x' }, { id: 'r2-y', t: '先对 x、后对 y' }, { id: 'r2-switch', t: '换序的技巧' }, { id: 'r2-pit', t: '四条提示' }]">
    <div class="note good">若区域 <Katex tex="D" /> 可写成 <Katex tex="\varphi_1(x)\le y\le\varphi_2(x)" />、<Katex tex="a\le x\le b" />（X 型），则 <Katex tex="\iint_D f\,d\sigma=\int_a^b dx\int_{\varphi_1(x)}^{\varphi_2(x)}f(x,y)\,dy" />；若可写成 <Katex tex="\psi_1(y)\le x\le\psi_2(y)" />、<Katex tex="c\le y\le d" />（Y 型），则 <Katex tex="\iint_D f\,d\sigma=\int_c^d dy\int_{\psi_1(y)}^{\psi_2(y)}f(x,y)\,dx" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDblCalc" />
      <div class="cap">图 重2 · <b>二重积分的计算机</b>：区域 <Katex tex="D" /> 由 <Katex tex="y=x^2" /> 与 <Katex tex="y=2-x^2" /> 围成，被积函数 <Katex tex="x^2+y" />。① 竖条的下端是抛物线 <Katex tex="y=x^2" />、上端是 <Katex tex="y=2-x^2" />，内层一次写完；② 横条在 <Katex tex="y=1" /> 处换了一对边界，紫色虚线标出分界，同一个区域要拆成两块。两个方向算出的结果都是 3.20。</div>
    </div>

    <h3 class="sec" id="r2-quad">区域的两种写法</h3>
    <p>X 型区域的意思是：竖着切一刀，交线恰好两条，且下边界与上边界各自是一条曲线。Y 型则横着切。判断的方法很直接——拿一把竖尺从左扫到右，看每条竖线与边界的交点是不是始终两个。</p>
    <p>画板这个区域是 X 型的典型：下边界 <Katex tex="y=x^2" />、上边界 <Katex tex="y=2-x^2" />，两条曲线在 <Katex tex="x=\pm1" /> 相交。同一区域若按 Y 型写，<Katex tex="x" /> 的范围在 <Katex tex="y<1" /> 时由 <Katex tex="-\sqrt y\le x\le\sqrt y" /> 给出，在 <Katex tex="y\ge1" /> 时却换成了 <Katex tex="-\sqrt{2-y}\le x\le\sqrt{2-y}" />，要拆成两块。</p>
    <p>所以「先画图、再判断用哪一种写法」是计算的起点。区域对称、边界在坐标轴上的题，两种写法往往都行；边界是抛物线、圆、直线的组合时，通常只有一种省事。</p>

    <h3 class="sec" id="r2-x">先对 y、后对 x</h3>
    <p>内层把 <Katex tex="x" /> 当作常数：</p>
    <p style="text-align:center"><Katex display tex="A(x)=\int_{x^2}^{2-x^2}(x^2+y)\,dy=\left[x^2y+\frac{y^2}{2}\right]_{x^2}^{2-x^2}=2-2x^4." /></p>
    <p>结果只含 <Katex tex="x" />，这正是「先积掉一个变量」的含义。再对 <Katex tex="x" /> 积一遍：</p>
    <p style="text-align:center"><Katex display tex="\int_{-1}^{1}(2-2x^4)\,dx=\left[2x-\frac{2x^5}{5}\right]_{-1}^{1}=\frac{16}{5}=3.2." /></p>
    <p>画板拖动竖条时，徽章里的 <Katex tex="A(x)" /> 随 <Katex tex="x" /> 变化，两端分别落在上下边界上。它的几何意义是「这一条竖条上的积分」，把所有竖条的值加起来就是整个区域上的积分。</p>

    <h3 class="sec" id="r2-y">先对 x、后对 y</h3>
    <p>换成横条，内层对 <Katex tex="x" /> 积：</p>
    <p style="text-align:center"><Katex display tex="B(y)=\int_{-a(y)}^{a(y)}(x^2+y)\,dx=\frac{2a(y)^3}{3}+2a(y)y," /></p>
    <p>其中 <Katex tex="a(y)" /> 在 <Katex tex="0\le y\le1" /> 时是 <Katex tex="\sqrt y" />，在 <Katex tex="1\le y\le2" /> 时是 <Katex tex="\sqrt{2-y}" />。于是</p>
    <p style="text-align:center"><Katex display tex="\iint_D f\,d\sigma=\int_0^1B(y)\,dy+\int_1^2B(y)\,dy." /></p>
    <p>两项分别对应 <Katex tex="y=1" /> 以下与以上的两块。这解释了为什么「换一个次序」有时等于「换一种拆法」：区域的形状没有变，变的只是扫描的方向。</p>

    <h3 class="sec" id="r2-switch">换序的技巧</h3>
    <p>有些题目按给定次序积不出来，内层积分没有初等原函数，换成另一种次序却能积。这时要做的不是硬算，而是<b>先画出区域，再重新写限</b>。</p>
    <p>画图时把区域的两条边界都画出来，找出它们的交点。交点是分段的位置：横条在交点处换边界，竖条在交点处换上下界。写限时从「最外侧的那个变量」开始，它的范围是两个常数；内侧变量的上下限是外侧变量的函数。</p>
    <p>例如 <Katex tex="\int_0^1dx\int_x^1 e^{y^2}dy" /> 按原次序内层积不出来，画图后发现区域是三角形 <Katex tex="0\le x\le y\le1" />，换成先对 <Katex tex="x" /> 积：<Katex tex="\int_0^1dy\int_0^y e^{y^2}dx=\int_0^1 y e^{y^2}dy=\frac{e-1}{2}" />。换序不是技巧，而是把区域换一种写法。</p>

    <h3 class="sec" id="r2-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：内层积分的上下限写成了常数。</strong>内层限一般含外层变量；写成常数意味着把区域当成了矩形。</li>
        <li><strong>提示二：上下界的顺序颠倒。</strong>下限必须是较小的那个边界，否则结果差一个负号。</li>
        <li><strong>提示三：换序时不重新画图。</strong>直接把两个限交换是最常见的错误，正确做法是重画区域、重写两组不等式。</li>
        <li><strong>提示四：区域要拆时忘了拆。</strong>横条越过交点后边界换了曲线，必须分段积分，否则内层限写错。</li>
      </ul>
    </div>
    <p>回收与预告：圆、扇形、圆环这类区域在直角坐标下写限很别扭，边界是根号，内层积分也常常积不出来。把坐标换成极坐标，边界会变成常数或简单的三角函数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDblCalc } from '../../../boards/calc2/riemann/dblcalc.js';
import { MR_CHAPTERS } from './rnav.js';
</script>
