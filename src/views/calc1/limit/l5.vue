<template>
  <ChPage :cur="5" no="极5" base="/calc1/l" :chapters="CL_CHAPTERS"
    title="两个重要极限"
    sub="一个由单位圆里的面积夹逼给出，一个由单调有界给出；前者管三角函数，后者定义了常数 e。"
    :toc="[{ id: 'l5-first', t: 'sin x / x 与面积夹逼' }, { id: 'l5-use', t: '由它导出的几个极限' }, { id: 'l5-second', t: '(1+1/n)ⁿ 与单调有界' }, { id: 'l5-e', t: '常数 e 的两种形式' }]">

    <div class="note good" id="l5-first">第一个重要极限是 <Katex tex="\lim\limits_{x\to0}\dfrac{\sin x}{x}=1" />。它不能由代入得到——把 <Katex tex="x=0" /> 代进去是 <Katex tex="\dfrac00" />；也不能由等价替换得到——那等于用结论证明结论。可靠的办法是把 <Katex tex="\dfrac{\sin x}{x}" /> 夹在两个已知极限之间。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTwoLim" />
      <div class="cap">图 极5 · <b>两个重要极限</b>：第一档画单位圆，<Katex tex="P=(\cos x,\sin x)" /> 在圆周上、<Katex tex="T=(1,\tan x)" /> 在 <Katex tex="A" /> 处的切线上，金色是 <Katex tex="\triangle OAP" />、蓝色是扇形 <Katex tex="OAP" />、绿色是 <Katex tex="\triangle OAT" />，三块面积从小到大依次是 <Katex tex="\dfrac12\sin x" />、<Katex tex="\dfrac12x" />、<Katex tex="\dfrac12\tan x" />；第二档画数列 <Katex tex="a_n=\left(1+\dfrac1n\right)^n" /> 的点与 <Katex tex="y=e" /> 的水平虚线。看点：第一档把 <Katex tex="x" /> 拖小，上下两个比值同时收到 <Katex tex="1" />；第二档把 <Katex tex="n" /> 拖大，点逐个抬高、始终压在虚线下方。</div>
    </div>

    <h3 class="sec" id="l5-first">sin x / x 与面积夹逼</h3>
    <p>设 <Katex tex="0<x<\dfrac{\pi}{2}" />，在单位圆中取 <Katex tex="A=(1,0)" />、<Katex tex="P=(\cos x,\sin x)" />，过 <Katex tex="A" /> 作圆的切线交 <Katex tex="OP" /> 的延长线于 <Katex tex="T=(1,\tan x)" />。三块图形的面积依次是</p>
    <p><Katex display tex="S_{\triangle OAP}=\frac12\sin x,\qquad S_{\text{扇形}\,OAP}=\frac12x,\qquad S_{\triangle OAT}=\frac12\tan x" /></p>
    <p>后两块包含前一块，第一块又包含在第二块中（弦 <Katex tex="AP" /> 把扇形切去一块弓形，这块弓形在三角形 <Katex tex="OAT" /> 之内），所以 <Katex tex="\dfrac12\sin x<\dfrac12x<\dfrac12\tan x" />，约去 <Katex tex="\dfrac12" />：</p>
    <p><Katex display tex="\sin x<x<\tan x\quad\left(0<x<\frac{\pi}{2}\right)" /></p>
    <p>同除以 <Katex tex="\sin x" />（在此区间内为正），得 <Katex tex="1<\dfrac{x}{\sin x}<\dfrac{1}{\cos x}" />。右端在 <Katex tex="x\to0^+" /> 时趋于 <Katex tex="1" />，两端都向 <Katex tex="1" /> 收拢，中间的量只能被夹到 <Katex tex="1" />。取倒数即得 <Katex tex="\dfrac{\sin x}{x}\to1" />。</p>
    <p>左侧的情形由偶性给出：<Katex tex="\dfrac{\sin(-x)}{-x}=\dfrac{\sin x}{x}" />，所以 <Katex tex="x\to0^-" /> 时的极限也是 <Katex tex="1" />。两侧相等，双侧极限存在且等于 <Katex tex="1" />。注意此处 <Katex tex="x" /> 取的是<b>弧度</b>——弧度制下弧长才等于 <Katex tex="x" />，扇形的面积才是 <Katex tex="\dfrac12x" />，换成角度制这条推导就不成立了。</p>

    <h3 class="sec" id="l5-use">由它导出的几个极限</h3>
    <p>第一个重要极限相当于 <Katex tex="\sin x\sim x" />，极3 的那组等价关系里它是最基本的一条。由它可以直接得到</p>
    <p><Katex display tex="\lim_{x\to0}\frac{\tan x}{x}=1,\qquad \lim_{x\to0}\frac{1-\cos x}{x^2}=\frac12,\qquad \lim_{x\to0}\frac{\arcsin x}{x}=1" /></p>
    <p>第二式把 <Katex tex="1-\cos x" /> 写成 <Katex tex="\dfrac{\sin^2x}{1+\cos x}" />，再用 <Katex tex="\sin x\sim x" />，即得 <Katex tex="\dfrac{x^2}{1+1}=\dfrac{x^2}{2}" />。图 极3 的三个比值正是这三条关系。</p>
    <p>复合形式同样可用：<Katex tex="\lim\limits_{x\to0}\dfrac{\sin 3x}{x}=3" />，因为 <Katex tex="\dfrac{\sin3x}{x}=3\cdot\dfrac{\sin3x}{3x}" />，括号里在 <Katex tex="x\to0" /> 时趋于 <Katex tex="1" />。推广到商：<Katex tex="\lim\limits_{x\to0}\dfrac{\sin ax}{\sin bx}=\dfrac ab" />（<Katex tex="b\ne0" />）。这类题的共同做法是把不匹配的系数配成 <Katex tex="\dfrac{\sin\square}{\square}" /> 的形状。</p>

    <h3 class="sec" id="l5-second">(1+1/n)ⁿ 与单调有界</h3>
    <p>第二个重要极限从数列开始。把 <Katex tex="a_n=\left(1+\dfrac1n\right)^n" /> 按二项式定理展开：</p>
    <p><Katex display tex="a_n=1+1+\frac{1}{2!}\left(1-\frac1n\right)+\frac{1}{3!}\left(1-\frac1n\right)\left(1-\frac2n\right)+\cdots+\frac{1}{n!}\prod_{k=1}^{n-1}\left(1-\frac kn\right)" /></p>
    <p>比较 <Katex tex="a_n" /> 与 <Katex tex="a_{n+1}" />：每一项的括号因子都变大（分母从 <Katex tex="n" /> 换成 <Katex tex="n+1" />），而且 <Katex tex="a_{n+1}" /> 末尾还多出一个正项。因此 <Katex tex="a_{n+1}>a_n" />，数列单调递增。</p>
    <p>再找上界。把每个括号都放大成 <Katex tex="1" />，得</p>
    <p><Katex display tex="a_n<2+\frac{1}{2!}+\frac{1}{3!}+\cdots+\frac{1}{n!}<2+\frac12+\frac14+\cdots+\frac{1}{2^{n-1}}<3" /></p>
    <p>单调递增且有上界的数列必收敛（极1 的性质），于是极限存在，记为 <Katex tex="e" />。它的大小也能夹出来：<Katex tex="a_n" /> 从 <Katex tex="2" /> 起步一路爬向 <Katex tex="2.71828\ldots" />，永远取不到。图 极5 第二档的点列与金色虚线 <Katex tex="y=e" /> 之间始终留着一道缝。</p>

    <h3 class="sec" id="l5-e">常数 e 的两种形式</h3>
    <p>把数列极限换成连续变量，得到同一个数：<Katex tex="\lim\limits_{x\to+\infty}\left(1+\dfrac1x\right)^x=e" />。再作代换 <Katex tex="t=\dfrac1x" />，<Katex tex="x\to\infty" /> 对应 <Katex tex="t\to0" />，就得到更常用的一副面孔：</p>
    <p><Katex display tex="\lim_{t\to0}(1+t)^{\frac1t}=e" /></p>
    <p>形式不同，用法相同：凑出「<Katex tex="1+" /> 小量」的底与它的倒数的指数。例如 <Katex tex="\lim\limits_{x\to\infty}\left(1+\dfrac2x\right)^x" /> 写成 <Katex tex="\left[\left(1+\dfrac2x\right)^{x/2}\right]^2" />，方括号里趋于 <Katex tex="e" />，答案是 <Katex tex="e^2" />。</p>
    <p><Katex tex="e" /> 的来历是复利：本金 <Katex tex="1" />、年利率 <Katex tex="1" /> 时，按 <Katex tex="n" /> 次复利计息，年底本息合计恰为 <Katex tex="\left(1+\dfrac1n\right)^n" />。计息越频繁，总额越高，却始终不超过 <Katex tex="e" />——把计息次数推到无穷，得到的正是连续复利 <Katex tex="e^r" />。这条线索在导数与积分两章还会用到：<Katex tex="e^x" /> 的导数仍是 <Katex tex="e^x" />，正因为这个常数的定义就藏在 <Katex tex="\left(1+\dfrac1n\right)^n" /> 里。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：角度制下第一个极限不成立。</strong><Katex tex="\lim\limits_{x\to0}\dfrac{\sin x^\circ}{x}=\dfrac{\pi}{180}" />。面积夹逼用的是弧度，结论也只能在弧度制下使用。</li>
        <li><strong>提示二：<Katex tex="\dfrac{\sin x}{x}" /> 的极限是 <Katex tex="1" />，不是 <Katex tex="\sin x" /> 的极限。</strong><Katex tex="\sin x" /> 在 <Katex tex="x\to0" /> 时趋于 <Katex tex="0" />，两者不可混为一谈。</li>
        <li><strong>提示三：第二极限的底必须真的趋于 <Katex tex="1" />。</strong><Katex tex="\lim\limits_{n\to\infty}\left(2+\dfrac1n\right)^n" /> 是无穷大，与 <Katex tex="e" /> 无关；套公式前先核对底。</li>
        <li><strong>提示四：指数与底要配成倒数。</strong>凑形时要让「<Katex tex="1+" /> 小量」的指数成为该小量的倒数，差一个常数因子就把它提成外层指数。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTwoLim } from '../../../boards/calc1/limit/twolim.js';
import { CL_CHAPTERS } from './lnav.js';
</script>
