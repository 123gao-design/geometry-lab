<template>
  <ChPage :cur="6" no="微6" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="泰勒公式"
    sub="用一次多项式近似，只在切点附近像；把多项式的阶数一路加上去，让它在展开点与函数的各阶导数逐一相等，近似就能扩展到一整段区间。"
    :toc="[{ id: 'd6-poly', t: '从切线到多项式' }, { id: 'd6-coef', t: '系数怎么定' }, { id: 'd6-rem', t: '余项的两种形式' }, { id: 'd6-apply', t: '常用展开与应用' }]">

    <div class="note good" id="d6-poly">若 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处有 <Katex tex="n" /> 阶导数，则 <Katex tex="f" /> 可以写成 <Katex tex="f(x)=P_n(x)+R_n(x)" />，其中 <Katex tex="P_n(x)=\sum\limits_{k=0}^{n}\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^k" /> 是 <Katex tex="n" /> 次泰勒多项式，<Katex tex="R_n(x)" /> 是余项，表示多项式与原函数的差。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTaylorLab" />
      <div class="cap">图 微6 · <b>泰勒公式机</b>：蓝线是原函数，金线是它在 <Katex tex="0" /> 处的 <Katex tex="n" /> 阶泰勒多项式，绿色竖段是所选点处的余项 <Katex tex="R_n" />。右栏列出该点的函数值、多项式值与余项。看点：把 <Katex tex="n" /> 一阶一阶加大，金线贴合蓝线的范围随之变宽；把点移近 <Katex tex="0" />，余项迅速变小。</div>
    </div>

    <h3 class="sec" id="d6-poly">从切线到多项式</h3>
    <p>微3 的微分给出了一次近似：<Katex tex="f(x)\approx f(x_0)+f'(x_0)(x-x_0)" />。右边是一次多项式，它的图像就是切线。切线与曲线在 <Katex tex="x_0" /> 处不仅函数值相等，一阶导数也相等；但二阶导数一般不同，所以离开切点稍远，两者就分开。</p>
    <p>要提高精度，就得让近似的多项式也带上弯曲。二次多项式有三个可调系数，可以同时对上函数值、一阶导数与二阶导数。继续往上，<Katex tex="n" /> 次多项式有 <Katex tex="n+1" /> 个系数，正好对上 <Katex tex="0" /> 到 <Katex tex="n" /> 阶共 <Katex tex="n+1" /> 个导数。</p>
    <p>图 微6 的蓝线与金线画的是同一件事的两个阶段：<Katex tex="n=1" /> 时金线就是切线，只在 <Katex tex="0" /> 附近贴住；<Katex tex="n" /> 增大后金线开始弯曲，贴合区间向两侧扩展。正弦曲线的多项式在原点附近很准，到了 <Katex tex="\pm\pi" /> 之外就迅速偏离，这个界限由收敛半径决定，在级数一章会再遇到。</p>

    <h3 class="sec" id="d6-coef">系数怎么定</h3>
    <p>设 <Katex tex="P_n(x)=\sum\limits_{k=0}^{n}a_k(x-x_0)^k" />，要求 <Katex tex="P_n^{(k)}(x_0)=f^{(k)}(x_0)" />（<Katex tex="k=0,1,\dots,n" />）。逐阶求导后代入 <Katex tex="x_0" />，含 <Katex tex="(x-x_0)" /> 的项全部消失，只剩常数项：</p>
    <p style="text-align:center"><Katex display tex="P_n^{(k)}(x_0)=k!\,a_k\ \Longrightarrow\ a_k=\frac{f^{(k)}(x_0)}{k!}" /></p>
    <p>分母上的 <Katex tex="k!" /> 来自逐次求导时指数一路降下来：<Katex tex="(x-x_0)^k" /> 求 <Katex tex="k" /> 次导得 <Katex tex="k!" />。这也解释了为什么正弦的展开里分母是 <Katex tex="1,6,120" /> 这样的阶乘数。</p>
    <p>以 <Katex tex="\sin x" /> 在 <Katex tex="0" /> 处为例，各阶导数为 <Katex tex="\sin x,\cos x,-\sin x,-\cos x" /> 循环，在零点的取值依次是 <Katex tex="0,1,0,-1" />。于是</p>
    <p style="text-align:center"><Katex display tex="\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots+(-1)^m\frac{x^{2m+1}}{(2m+1)!}+\cdots" /></p>
    <p>只出现奇次项，因为偶次导数在零点的值都是零；符号交替出现，因为各阶导数在零点轮流取正负。图中把 <Katex tex="n" /> 从 1 拖到 9，就能看到金线依次补上 <Katex tex="x^3" />、<Katex tex="x^5" /> 这些修正项。</p>

    <h3 class="sec" id="d6-rem">余项的两种形式</h3>
    <p>余项有两种常用写法，用途不同。</p>
    <p><b>佩亚诺余项：</b><Katex tex="R_n(x)=o\left((x-x_0)^n\right)" />。它只说明余项比 <Katex tex="n" /> 次幂更快趋于零，不给出具体数值。求极限时用它最方便，因为只需要知道量级。</p>
    <p><b>拉格朗日余项：</b>若 <Katex tex="f" /> 有 <Katex tex="n+1" /> 阶导数，则</p>
    <p style="text-align:center"><Katex display tex="R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-x_0)^{n+1}" /></p>
    <p>其中 <Katex tex="\xi" /> 介于 <Katex tex="x_0" /> 与 <Katex tex="x" /> 之间。它的形状与下一项完全相同，只是把系数里的导数在 <Katex tex="\xi" /> 处取值。做近似估算时用它，因为可以把 <Katex tex="f^{(n+1)}" /> 在区间上放大，得到一个误差上界。</p>
    <p>图 微6 右栏的 <Katex tex="R_n(x)" /> 就是绿段的实际长度：曲线上的点与多边形线上的点纵坐标之差。拖动 <Katex tex="n" /> 或 <Katex tex="x" />，这个差值的变化正对应两个余项公式给出的量级。</p>

    <h3 class="sec" id="d6-apply">常用展开与应用</h3>
    <p>几个展开式值得记住，它们都取 <Katex tex="x_0=0" />：</p>
    <p style="text-align:center"><Katex display tex="\mathrm{e}^x=1+x+\frac{x^2}{2!}+\cdots+\frac{x^n}{n!}+o(x^n)" /></p>
    <p style="text-align:center"><Katex display tex="\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots+(-1)^{n-1}\frac{x^n}{n}+o(x^n)" /></p>
    <p>第一个对一切 <Katex tex="x" /> 成立，第二个只在 <Katex tex="-1<x\le1" /> 上成立。后者展开到 <Katex tex="n" /> 阶时，通项分母只有 <Katex tex="n" /> 而没有阶乘，收敛慢得多，图 微6 的第三个预设把这一点画了出来：曲线在 <Katex tex="x=1" /> 附近贴合得慢，越过 1 之后开始发散。</p>
    <p>求极限是泰勒公式最常见的用法。例如</p>
    <p style="text-align:center"><Katex display tex="\lim_{x\to0}\frac{\cos x-1+\dfrac{x^2}{2}}{x^4}=\lim_{x\to0}\frac{\dfrac{x^4}{24}+o(x^4)}{x^4}=\frac1{24}" /></p>
    <p>分子上 <Katex tex="1" /> 与 <Katex tex="-\dfrac{x^2}{2}" /> 恰好抵消，剩下的最低次项是 <Katex tex="\dfrac{x^4}{24}" />。若只展开到二阶，分子写成 <Katex tex="o(x^2)" />，与分母的 <Katex tex="x^4" /> 不匹配，就无法定出极限。展开到几阶，要看分母的次数。</p>
    <p>用同样办法可以证明等式与不等式，也可以做数值近似：<Katex tex="\sin 0.1\approx0.1-\dfrac{0.001}{6}" />，误差由拉格朗日余项控制，不超过 <Katex tex="\dfrac{0.1^5}{120}" />，即万分之一以下。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：展开到几阶要看需求。</strong>求极限时展开到与分母同阶，做近似时展开到误差允许的阶。展开不足会得到 <Katex tex="o(x^n)" /> 与分母不匹配的僵局，展开过多只是多算几项。</li>
        <li><strong>提示二：展开点不同，多项式完全不同。</strong>在 <Katex tex="0" /> 处展开与在 <Katex tex="1" /> 处展开得到的两条多项式曲线形状不同、适用的区间也不同。题目未说明时通常指在 <Katex tex="0" /> 处（麦克劳林公式），但要看清条件。</li>
        <li><strong>提示三：余项不能省。</strong>写成 <Katex tex="\sin x=x-\dfrac{x^3}{6}" /> 是错的，等号不成立；正确写法是等号右边再补上 <Katex tex="o(x^3)" /> 或 <Katex tex="R_3(x)" />。丢掉余项就把近似当成了恒等式。</li>
        <li><strong>提示四：展开式有适用范围。</strong><Katex tex="\ln(1+x)" /> 的展开只在 <Katex tex="-1<x\le1" /> 上收敛，超出这个范围，多项式的值与原函数毫无关系。图 微6 第三个预设的窗口特意停在 <Katex tex="1" /> 附近，就是为了不越界。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTaylorLab } from '../../../boards/calc1/deriv/taylorlab.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
