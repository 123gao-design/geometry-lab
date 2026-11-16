<template>
  <ChPage :cur="2" no="微2" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="求导法则"
    sub="逐个用定义求导太慢。四则运算、复合与反函数各有对应的法则，其中链式法则贯穿全部——把复杂的函数拆成简单函数，逐层求导再相乘。"
    :toc="[{ id: 'd2-arith', t: '四则运算' }, { id: 'd2-prod', t: '乘积法则' }, { id: 'd2-chain', t: '链式法则' }, { id: 'd2-inv', t: '反函数与隐函数' }]">

    <div class="note good" id="d2-arith">基本初等函数的导数由定义逐个算出，其余函数靠法则拼出来：<Katex tex="(u\pm v)'=u'\pm v'" />，<Katex tex="(uv)'=u'v+uv'" />，<Katex tex="\left(\dfrac uv\right)'=\dfrac{u'v-uv'}{v^2}" />，<Katex tex="\big(f(g(x))\big)'=f'(g(x))\,g'(x)" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createProdLab" />
      <div class="cap">图 微2a · <b>乘积法则机</b>：边长 <Katex tex="a" />、<Katex tex="b" /> 的矩形代表乘积 <Katex tex="ab" />。两条边同时伸长 <Katex tex="t" />，多出来的面积是三块：右条 <Katex tex="bt" />、上条 <Katex tex="at" />、角上的 <Katex tex="t^2" />。同除 <Katex tex="t" /> 后令 <Katex tex="t\to0" />，只剩 <Katex tex="a+b" />。</div>
    </div>

    <h3 class="sec" id="d2-arith">四则运算</h3>
    <p>设 <Katex tex="u,v" /> 在 <Katex tex="x" /> 处可导。和与差直接把差商相加相减，取极限就分开：</p>
    <p style="text-align:center"><Katex display tex="(u\pm v)'=\lim_{h\to0}\frac{[u(x+h)\pm v(x+h)]-[u(x)\pm v(x)]}{h}=u'\pm v'" /></p>
    <p>常数因子可以提到极限外面，所以 <Katex tex="(Cu)'=Cu'" />。这两条使多项式逐项求导成为可能：<Katex tex="(x^3-4x+7)'=3x^2-4" />。</p>
    <p>商的法则是 <Katex tex="\left(\dfrac uv\right)'=\dfrac{u'v-uv'}{v^2}" />。它可以从乘积法则与链式法则推出，也可以直接把差商通分后取极限。分母要添上平方，分子的两项相减——顺序不能反，反了就是整体差一个负号。</p>

    <h3 class="sec" id="d2-prod">乘积法则</h3>
    <p>乘积的导数不是导数之积。<Katex tex="(x\cdot x)'=(x^2)'=2x" />，而 <Katex tex="x'\cdot x'=1\cdot1=1" />，两者不等。正确的法则是</p>
    <p style="text-align:center"><Katex display tex="(uv)'=u'v+uv'" /></p>
    <p>证明只要把增量写全。设 <Katex tex="u" />、<Katex tex="v" /> 各增加 <Katex tex="\Delta u" />、<Katex tex="\Delta v" />，乘积的增量是</p>
    <p style="text-align:center"><Katex display tex="\Delta(uv)=(u+\Delta u)(v+\Delta v)-uv=u\,\Delta v+v\,\Delta u+\Delta u\,\Delta v" /></p>
    <p>三块分别对应图 微2a 中的上条、右条与角块。两边同除 <Katex tex="h" />，再令 <Katex tex="h\to0" />：前两块分别给出 <Katex tex="uv'" /> 与 <Katex tex="u'v" />；第三块是 <Katex tex="\dfrac{\Delta u}{h}\cdot\Delta v" />，第一因子有极限 <Katex tex="u'" />，第二因子趋于零，整块消失。留下两项，正是法则的样子。</p>
    <p>角块消失得快，是因为它是两个小量的乘积，比线性那块高一阶。这条理由与微3 中「微分是增量的线性主部」是同一件事。</p>

    <div class="board-wrap">
      <BoardMount :factory="createChainLab" />
      <div class="cap">图 微2b · <b>链式法则机</b>：左边是内层 <Katex tex="u=g(x)" />，右边是外层 <Katex tex="y=f(u)" />，两处各画一条切线读斜率。横轴每走 <Katex tex="1" />，<Katex tex="u" /> 走 <Katex tex="g'(x_0)" />；<Katex tex="u" /> 再每走 <Katex tex="1" />，<Katex tex="y" /> 走 <Katex tex="f'(u_0)" />。两段倍数相乘，就是 <Katex tex="y" /> 对 <Katex tex="x" /> 的变化率，右栏的差值核对该乘积。</div>
    </div>

    <h3 class="sec" id="d2-chain">链式法则</h3>
    <p>复合函数的导数等于外层在对应点的导数，乘以内层的导数：</p>
    <p style="text-align:center"><Katex display tex="\frac{\mathrm{d}y}{\mathrm{d}x}=\frac{\mathrm{d}y}{\mathrm{d}u}\cdot\frac{\mathrm{d}u}{\mathrm{d}x},\qquad \big(f(g(x))\big)'=f'(g(x))\,g'(x)" /></p>
    <p>把 <Katex tex="\dfrac{\mathrm{d}y}{\mathrm{d}u}" /> 想成分数的约分是有风险的——单独一个 <Katex tex="\mathrm{d}y" /> 没有意义。但这个写法恰好点明了结构：两段速率的乘积。走一段 <Katex tex="\Delta x" />，<Katex tex="u" /> 大约变 <Katex tex="g'(x)\Delta x" />；<Katex tex="u" /> 变这么多，<Katex tex="y" /> 大约变 <Katex tex="f'(u)\cdot g'(x)\Delta x" />。两段近似的误差都是高阶小量，乘起来仍是高阶小量。</p>
    <p>法则可以一层层套下去。求 <Katex tex="y=\sin(2x+1)" />：外层是正弦，内层是 <Katex tex="2x+1" />，于是 <Katex tex="y'=\cos(2x+1)\cdot2" />。求 <Katex tex="y=\mathrm{e}^{x^2}" />：<Katex tex="y'=\mathrm{e}^{x^2}\cdot2x" />。复合的层数越多，乘的因子越多，但每一步只处理一层。</p>

    <h3 class="sec" id="d2-inv">反函数与隐函数</h3>
    <p>若 <Katex tex="y=f(x)" /> 在区间内单调且可导、<Katex tex="f'(x)\ne0" />，则它有反函数 <Katex tex="x=f^{-1}(y)" />，且</p>
    <p style="text-align:center"><Katex display tex="\big(f^{-1}\big)'(y)=\frac{1}{f'(x)}" /></p>
    <p>两边的导数互为倒数，因为同一个曲线的斜率，横着量与竖着量正好互为倒数。<Katex tex="(\arcsin x)'=\dfrac{1}{\sqrt{1-x^2}}" /> 就是这样从 <Katex tex="(\sin y)'=\cos y" /> 得来的：分母的 <Katex tex="\cos y" /> 再换成 <Katex tex="\sqrt{1-\sin^2y}=\sqrt{1-x^2}" />，正负号由反函数的值域决定。</p>
    <p>隐函数不写成 <Katex tex="y=f(x)" /> 而藏在方程 <Katex tex="F(x,y)=0" /> 里。这时把 <Katex tex="y" /> 看成 <Katex tex="x" /> 的函数，方程两边同时对 <Katex tex="x" /> 求导，遇到含 <Katex tex="y" /> 的项就按链式法则乘一个 <Katex tex="y'" />。例如 <Katex tex="x^2+y^2=1" /> 两边求导得 <Katex tex="2x+2yy'=0" />，所以 <Katex tex="y'=-\dfrac xy" />，与圆上切线的斜率一致。这个手法在圆锥曲线一章已经用过一次，只是当时没有点出名字。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：乘积法则不能拆成导数相乘。</strong><Katex tex="(uv)'\ne u'v'" />，差的是 <Katex tex="u'v+uv'" /> 两项中的另一项；只有当其中一个是常数时，才退化成常数乘导数。</li>
        <li><strong>提示二：链式法则别漏内层导数。</strong><Katex tex="(\sin 2x)'=2\cos 2x" />，不是 <Katex tex="\cos 2x" />。外层求完导，内层原样保留，再乘内层的导数，这一步最容易漏。</li>
        <li><strong>提示三：商的法则分子两项相减。</strong><Katex tex="\left(\dfrac uv\right)'=\dfrac{u'v-uv'}{v^2}" />，写成 <Katex tex="uv'-u'v" /> 就整体错一个符号。记忆办法：分子是「先导后不导，减去先不导后导」，顺序与乘法一样。</li>
        <li><strong>提示四：反函数求导要换回自变量。</strong>公式给出的是对 <Katex tex="y" /> 的导数，最后要把 <Katex tex="y" /> 换成 <Katex tex="x" />，并用三角恒等式化简根号。正负号由反函数取的主值区间决定，不能一律取正。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createProdLab } from '../../../boards/calc1/deriv/prodlab.js';
import { createBoard as createChainLab } from '../../../boards/calc1/deriv/chainlab.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
