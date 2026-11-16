<template>
  <ChPage :cur="3" no="极3" base="/calc1/l" :chapters="CL_CHAPTERS"
    title="无穷小与无穷大"
    sub="无穷小是极限为零的变量，不是很小的数；两个无穷小谁消失得快，用两者的比值来判断。"
    :toc="[{ id: 'l3-def', t: '无穷小的定义' }, { id: 'l3-op', t: '无穷小的运算' }, { id: 'l3-order', t: '阶的比较与等价无穷小' }, { id: 'l3-sub', t: '等价替换的边界' }, { id: 'l3-inf', t: '无穷大与无界' }]">

    <div class="note good" id="l3-def">若 <Katex tex="\lim\limits_{x\to x_0}\alpha(x)=0" />，就称 <Katex tex="\alpha(x)" /> 是 <Katex tex="x\to x_0" /> 时的<b>无穷小</b>。无穷小的定义依附于趋近过程：同一个函数在一个过程中是无穷小，换一个过程就未必。</div>

    <div class="board-wrap">
      <BoardMount :factory="createOrdLab" />
      <div class="cap">图 极3 · <b>无穷小阶的比较机</b>：三条曲线 <Katex tex="y=\sin x" />、<Katex tex="y=x" />、<Katex tex="y=1-\cos x" /> 都落在原点，绿虚线是 <Katex tex="y=\dfrac{x^2}{2}" />。看点：把 <Katex tex="x" /> 拖向 <Katex tex="0" />，蓝色比值 <Katex tex="\dfrac{\sin x}{x}" /> 稳定在 <Katex tex="1" />，绿色比值 <Katex tex="\dfrac{1-\cos x}{x^2}" /> 稳定在 <Katex tex="\dfrac12" />；<Katex tex="y=1-\cos x" /> 贴着绿虚线走，与 <Katex tex="y=x" /> 的距离却在缩小，说明它比 <Katex tex="x" /> 消失得更快。</div>
    </div>

    <h3 class="sec" id="l3-def">无穷小的定义</h3>
    <p>判断一个量是不是无穷小，只看它的极限是不是零，与它此刻的大小无关。<Katex tex="10^{-100}" /> 是一个很小的正数，作为常量它的极限是它自己，不是无穷小；而 <Katex tex="\dfrac{1}{\ln n}" /> 在 <Katex tex="n=10^{100}" /> 时还有 <Katex tex="0.0043" /> 那么大，却随着 <Katex tex="n\to\infty" /> 趋于零，是无穷小。图 极3 里三条曲线上的点离开原点都不远，真正决定身份的是它们往原点收拢的趋势。</p>
    <p>无穷小与极限的关系可以写成一条等式：<Katex tex="\lim f(x)=A" /> 等价于 <Katex tex="f(x)=A+\alpha(x)" />，其中 <Katex tex="\alpha" /> 是同一过程中的无穷小。这条等价把「趋近于 <Katex tex="A" />」拆成「等于 <Katex tex="A" /> 加上一个误差」，后面的误差估计都从这里起步。</p>

    <h3 class="sec" id="l3-op">无穷小的运算</h3>
    <p>有限个无穷小之和、之积仍是无穷小，这一点由极限运算法则直接得到。更常用的是这一条：<b>有界函数与无穷小之积仍是无穷小</b>。例如 <Katex tex="\lim\limits_{x\to0}x\sin\dfrac1x=0" />——<Katex tex="\sin\dfrac1x" /> 在 <Katex tex="x\to0" /> 时来回振荡，没有极限，但它的绝对值不超过 <Katex tex="1" />，乘上 <Katex tex="x" /> 之后被压到零。</p>
    <p>「有限个」三个字不能省。无穷多个无穷小之和未必是无穷小，<Katex tex="\underbrace{\dfrac1n+\dfrac1n+\cdots+\dfrac1n}_{n\ \text{项}}=1" /> 就是反例。无穷多写法的处理要交给数列与级数（极1 与无穷级数一章）另行判断。</p>
    <p>商的结论要加条件：两个无穷小之商可能趋于零、趋于某个非零常数、趋于无穷，也可能振荡。正因为商的结果不定，才有必要给它们分阶。</p>

    <h3 class="sec" id="l3-order">阶的比较与等价无穷小</h3>
    <p>设 <Katex tex="\alpha" />、<Katex tex="\beta" /> 是同一过程中的无穷小，且 <Katex tex="\alpha\ne0" />，考察比值 <Katex tex="\dfrac{\beta}{\alpha}" />：</p>
    <p><Katex display tex="\lim\frac{\beta}{\alpha}=0\ \Rightarrow\ \beta=o(\alpha)\ (\text{高阶});\qquad \lim\frac{\beta}{\alpha}=c\ne0\ \Rightarrow\ \text{同阶}" /></p>
    <p><Katex display tex="\lim\frac{\beta}{\alpha}=1\ \Rightarrow\ \beta\sim\alpha\ (\text{等价无穷小})" /></p>
    <p>「阶」说的是消失的快慢：<Katex tex="\beta" /> 是高阶无穷小，意味着它比 <Katex tex="\alpha" /> 更快地趋于零。图 极3 中 <Katex tex="\dfrac{1-\cos x}{x^2}\to\dfrac12" />，故 <Katex tex="1-\cos x" /> 与 <Katex tex="x^2" /> 同阶，按定义可写成</p>
    <p><Katex display tex="1-\cos x\sim\frac{x^2}{2}\qquad(x\to0)" /></p>
    <p>常用的一组等价关系如下，它们都可以用图 极3 那样的比值极限直接验证：</p>
    <p><Katex display tex="\sin x\sim x,\quad \tan x\sim x,\quad \arcsin x\sim x,\quad \ln(1+x)\sim x,\quad e^x-1\sim x,\quad (1+x)^{\mu}-1\sim\mu x" /></p>

    <h3 class="sec" id="l3-sub">等价替换的边界</h3>
    <p>若 <Katex tex="\alpha\sim\alpha'" />、<Katex tex="\beta\sim\beta'" />，则 <Katex tex="\lim\dfrac{\beta}{\alpha}=\lim\dfrac{\beta'}{\alpha'}" />。这条定理允许把乘除因子换成更简单的等价无穷小，是求极限最省力的一步。</p>
    <p>限制在于「乘除因子」。加减项不能各自替换，因为相减之后首项可能抵消，剩下的低阶部分才是答案。看一个例子：</p>
    <p><Katex display tex="\tan x-\sin x=\tan x\,(1-\cos x)\sim x\cdot\frac{x^2}{2}=\frac{x^3}{2}" /></p>
    <p>若在差式里把 <Katex tex="\tan x" /> 与 <Katex tex="\sin x" /> 都换成 <Katex tex="x" />，差变成 <Katex tex="0" />，与实际的 <Katex tex="\dfrac{x^3}{2}" /> 完全不同——替换丢掉的正是两个等价式之间的差。稳妥的做法是先把差化成积，再对每一因子替换。</p>

    <h3 class="sec" id="l3-inf">无穷大与无界</h3>
    <p>若对任意大的 <Katex tex="M>0" />，当 <Katex tex="x" /> 足够接近 <Katex tex="x_0" /> 时都有 <Katex tex="|f(x)|>M" />，就称 <Katex tex="f(x)" /> 是该过程中的<b>无穷大</b>，记作 <Katex tex="\lim\limits_{x\to x_0}f(x)=\infty" />。按定义这仍算极限不存在，只是失败的方式可以描述。</p>
    <p>无穷大与无穷小互为倒数：若 <Katex tex="f" /> 是无穷大，则 <Katex tex="\dfrac1f" /> 是无穷小，反之在 <Katex tex="f\ne0" /> 时也成立。图 极4 的第四个预设里，曲线在 <Katex tex="x_0" /> 两侧一起冲向 <Katex tex="+\infty" />，正是这种情形。</p>
    <p><b>无界不等于无穷大。</b><Katex tex="f(x)=x\sin x" /> 在 <Katex tex="(0,+\infty)" /> 上无界，因为可以取到任意大的值；但它反复回到零，并不满足「足够大之后一直很大」，所以不是无穷大。无穷大要求的是持续地大，不只是偶尔地大。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：无穷小不是数。</strong>不能比较两个无穷小谁更小，只能说谁趋于零更快。写成 <Katex tex="\alpha<\beta" /> 没有意义，写成 <Katex tex="\alpha=o(\beta)" /> 才有。</li>
        <li><strong>提示二：零是唯一的数形式的无穷小。</strong>恒为零的函数是无穷小；任何非零常数都不是。</li>
        <li><strong>提示三：等价关系要注明过程。</strong><Katex tex="\sin x\sim x" /> 只在 <Katex tex="x\to0" /> 时成立，<Katex tex="x\to1" /> 时不成立。</li>
        <li><strong>提示四：加减里替换要留神。</strong>两个同阶无穷小相减，首项抵消，结果由更高阶的项决定；此时替换等于把答案抹掉。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createOrdLab } from '../../../boards/calc1/limit/ordlab.js';
import { CL_CHAPTERS } from './lnav.js';
</script>
