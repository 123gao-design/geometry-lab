<template>
  <ChPage :cur="3" no="方3" base="/calc1/o" :chapters="ON_CHAPTERS"
    title="一阶线性方程"
    sub="未知函数与它的一阶导数都是一次的，同乘一个积分因子就能把左边收成一个乘积的导数。"
    :toc="[{ id: 'o3-form', t: '标准形' }, { id: 'o3-mu', t: '积分因子' }, { id: 'o3-struct', t: '通解结构' }, { id: 'o3-half', t: '解的走势' }]">

    <div class="note good" id="o3-form">形如 <Katex tex="y'+P(x)y=Q(x)" /> 的方程叫<b>一阶线性方程</b>。<Katex tex="Q(x)\equiv0" /> 时叫齐次线性方程，否则叫非齐次。<Katex tex="P" />、<Katex tex="y" />、<Katex tex="y'" /> 都以一次的方式出现，未知函数不出现平方、乘积，也不出现在分母或函数符号里。</div>

    <div class="board-wrap">
      <BoardMount :factory="createLinearlab" />
      <div class="cap">图 方3 · <b>一阶线性方程机</b>：紫虚线是齐次解 <Katex tex="C\mathrm{e}^{-\int P}" />，橙虚线是方程的一个特解，蓝实线是两者相加的通解。<b>看点</b>：拖 <Katex tex="C" /> 时紫线与蓝线平移同一段距离，两者的差恒为那条橙线。</div>
    </div>

    <h3 class="sec" id="o3-mu">积分因子：把左边收成一个导数</h3>
    <p>直接积分积不动，因为左边不是一个函数的导数。若两边同乘 <Katex tex="\mu(x)=\mathrm{e}^{\int P(x)\mathrm{d}x}" />，则 <Katex tex="\mu'" /> <Katex tex="=\mu P" />，左边恰好是 <Katex tex="(\mu y)'" />：</p>
    <p style="text-align:center"><Katex display tex="\mu y'+P\mu y=(\mu y)'=\mu Q\quad\Longrightarrow\quad \mu y=\int \mu Q\,\mathrm{d}x+C" /></p>
    <p>于是通解为</p>
    <p style="text-align:center"><Katex display tex="y=\mathrm{e}^{-\int P\mathrm{d}x}\left[\int Q\,\mathrm{e}^{\int P\mathrm{d}x}\mathrm{d}x+C\right]" /></p>
    <p>公式不必硬背，记住「乘一个因子把左边收成导数」这条动作即可。<Katex tex="\mu" /> 的求法只是解一个最简单的可分离方程 <Katex tex="\mu'=P\mu" />，这正是上一章预设 ① 的形状，两条线索在这里接上。</p>
    <p>三个预设各有一条因子：<Katex tex="y'+y=1" /> 的 <Katex tex="\mu=\mathrm{e}^{x}" />；<Katex tex="y'-y=\mathrm{e}^{2x}" /> 的 <Katex tex="\mu=\mathrm{e}^{-x}" />；<Katex tex="y'+y/x=1" /> 的 <Katex tex="\mu=x" />。第三个的因子不是指数，因为 <Katex tex="\int \mathrm{d}x/x=\ln x" />，代进 <Katex tex="\mathrm{e}^{\ln x}=x" />。</p>

    <h3 class="sec" id="o3-struct">通解 = 齐次通解 + 一个特解</h3>
    <p>把通解式拆开看，第一项 <Katex tex="C\mathrm{e}^{-\int P}" /> 是齐次方程 <Katex tex="y'+Py=0" /> 的通解，第二项 <Katex tex="\mathrm{e}^{-\int P}\int \mu Q" /> 是一个不含任意常数的特解。图 方3 把这条结构画成三条曲线：紫线随 <Katex tex="C" /> 变，橙线不动，蓝线是两者之和。</p>
    <p>为什么非齐次方程的通解一定是这种形状？设 <Katex tex="y_1" />、<Katex tex="y_2" /> 都是它的解，则差 <Katex tex="y_1-y_2" /> 满足 <Katex tex="(y_1-y_2)'+P(y_1-y_2)=0" />，即差是齐次解。反过来，任一解加上任一齐次解仍是解。两条合起来，非齐次的全部解就是「某个特解 + 齐次通解」，一条不多一条不少。</p>
    <p>这条结构在二阶方程里会原样重现（方5 的三种情形、方6 的受迫振动），现在的三条曲线就是最简的一次预演。</p>

    <h3 class="sec" id="o3-half">解的走势：靠近还是远离</h3>
    <p>预设 ① 的 <Katex tex="P=1>0" />，齐次解 <Katex tex="C\mathrm{e}^{-x}" /> 随 <Katex tex="x" /> 增大而趋于零，于是所有解都被拉向特解 <Katex tex="y=1" />，蓝线渐近于水平线。预设 ② 的 <Katex tex="P=-1<0" />，齐次解 <Katex tex="C\mathrm{e}^{x}" /> 发散，解随 <Katex tex="x" /> 增大而离开特解，两条曲线越走越远。</p>
    <p>判断走势只看 <Katex tex="P" /> 的符号：<Katex tex="P>0" /> 时 <Katex tex="\mathrm{e}^{-\int P}" /> 衰减，初值的影响被冲淡；<Katex tex="P<0" /> 时放大，初值的影响越滚越大。这与方向场里短线把曲线往外推还是往内收是同一件事。若 <Katex tex="P" /> 会在区间内变号，就要分段讨论，解可能在一段里靠近、在另一段里离开。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：先化标准形再套公式。</strong>方程写成 <Katex tex="xy'+y=x" /> 这类形式时，要两边同除首项系数，把 <Katex tex="y'" /> 的系数变成 1，否则 <Katex tex="P" /> 会取错。</li>
        <li><strong>提示二：因子乘上去前先确认线性。</strong><Katex tex="y'+y^2=Q" /> 与 <Katex tex="yy'=Q" /> 都不是线性的，积分因子这套动作对它们无效。</li>
        <li><strong>提示三：积分限与常数不要混。</strong><Katex tex="\int P\,\mathrm{d}x" /> 只取一个原函数，任意常数统一并进最后那个 <Katex tex="C" />，中途再添常数会让式子重复。</li>
        <li><strong>提示四：定义域断开时 <Katex tex="\mu" /> 可能变号。</strong><Katex tex="\mu=x" /> 在负半轴为负，同乘时分母符号要一起带过去，通解公式本身不受影响。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLinearlab } from '../../../boards/calc1/ode/linearlab.js';
import { ON_CHAPTERS } from './onav.js';
</script>
