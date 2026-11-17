<template>
  <ChPage :cur="4" no="级4" base="/calc1/s" :chapters="SN_CHAPTERS"
    title="幂级数与泰勒展开"
    sub="把 x 当变量，级数就成了一条曲线族。收敛半径划出它能用的那一段，泰勒公式给出系数的算法。"
    :toc="[{ id: 's4-radius', t: '收敛半径与收敛区间' }, { id: 's4-alg', t: '幂级数的运算性质' }, { id: 's4-taylor', t: '泰勒级数' }, { id: 's4-apply', t: '展开的用处' }]">

    <div class="note good" id="s4-radius">形如 <Katex tex="\sum a_n(x-x_0)^n" /> 的级数叫<b>幂级数</b>。它的收敛点构成一个以 <Katex tex="x_0" /> 为中心的区间，半长 <Katex tex="R" /> 叫<b>收敛半径</b>:<Katex tex="|x-x_0|<R" /> 时绝对收敛，<Katex tex="|x-x_0|>R" /> 时发散，端点处另行判断。<Katex tex="R" /> 由系数算出：<Katex tex="R=1/\lim|a_{n+1}/a_n|" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPowerlab" />
      <div class="cap">图 级4a · <b>幂级数的收敛半径</b>：上条数轴上的绿色带是收敛区间，金点是当前取的 <Katex tex="x" />；下框画部分和随 <Katex tex="n" /> 的变化。<b>看点</b>：金点走进绿带，部分和很快稳住；走出绿带，部分和往画框外跑。第三档的绿带缩成一点，第四档的两端是空心圈——端点不在收敛域内。</div>
    </div>

    <h3 class="sec" id="s4-alg">收敛半径从哪里来</h3>
    <p>把幂级数当作正项级数处理，对 <Katex tex="\sum|a_nx^n|" /> 用比值判别法：后项比前项趋于 <Katex tex="|x|\lim|a_{n+1}/a_n|" />。要让这个极限小于 1，就要求 <Katex tex="|x|<1/\lim|a_{n+1}/a_n|" />。于是收敛半径 <Katex tex="R" /> 恰是那个倒数值；极限为零时 <Katex tex="R=+\infty" />，极限为无穷时 <Katex tex="R=0" />。</p>
    <p>图 级4a 的四档正对应这几种情形：<Katex tex="\sum x^n/n" /> 的比值趋于 1，故 <Katex tex="R=1" />；<Katex tex="\sum x^n/n!" /> 的比值趋于零，整条数轴都收敛；<Katex tex="\sum n!x^n" /> 的比值趋于无穷，只有原点能收敛；<Katex tex="\sum x^n" /> 同样 <Katex tex="R=1" />。</p>
    <p>端点必须单独检验，因为比值判别法在比值等于 1 时失效。<Katex tex="\sum x^n" /> 在 <Katex tex="x=\pm1" /> 处通项不趋于零，两级数都发散；<Katex tex="\sum x^n/n" /> 在 <Katex tex="x=1" /> 处是调和级数（发散），在 <Katex tex="x=-1" /> 处是交错调和级数（收敛）。同一个半径，两端可能一个收敛一个发散，这是幂级数最常见的细节。</p>

    <h3 class="sec" id="s4-alg">幂级数的运算性质</h3>
    <p>在收敛区间内部，幂级数可以逐项求导、逐项积分，收敛半径不变。这条性质把幂级数变成了一件灵活的工具：想求 <Katex tex="\sum nx^{n-1}" /> 的和，直接把 <Katex tex="\sum x^n" /> 逐项求导即可；想求 <Katex tex="\sum x^{n+1}/(n+1)" />，把 <Katex tex="\sum x^n" /> 逐项积分即可。</p>
    <p>两个幂级数在公共收敛区间内可以逐项相加、相乘，结果仍以较大半径中较小的那个为界。这些运算之所以合法，靠的是幂级数在区间内部绝对收敛——上一章末尾说的那条前提，在这里第一次派上大用场。</p>
    <p>逐项求导和逐项积分在端点处可能改变收敛性：<Katex tex="\sum x^n/n" /> 在 <Katex tex="x=-1" /> 收敛，逐项求导得 <Katex tex="\sum x^{n-1}" />，在 <Katex tex="x=-1" /> 发散。区间内部是安全的，端点要重新验。</p>

    <h3 class="sec" id="s4-taylor">泰勒级数：系数由导数读出</h3>
    <p>若 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处有各阶导数，它的<b>泰勒级数</b>为</p>
    <p style="text-align:center"><Katex display tex="f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n" /></p>
    <p>系数里出现 <Katex tex="n!" /> 和 <Katex tex="f^{(n)}(x_0)" />，来源是让多项式与原函数在 <Katex tex="x_0" /> 处的各阶导数逐一相等：截到 <Katex tex="n" /> 次的多项式，前 <Katex tex="n" /> 阶导数都与 <Katex tex="f" /> 相同，于是两曲线在该点附近贴合得越来越紧。</p>

    <div class="board-wrap">
      <BoardMount :factory="createTaylorseries" />
      <div class="cap">图 级4b · <b>幂级数展开与泰勒级数</b>：蓝线是原函数，橙虚线是截到第 <Katex tex="n" /> 项的多项式，金点与竖直虚线段是当前 <Katex tex="x" /> 处的偏差。<b>看点</b>：<Katex tex="n" /> 每加一项，橙线就在原点附近多贴一段；离原点越远，需要的项数越多。第四档在 <Katex tex="x=1" /> 附近整条橙线都跟不上。</div>
    </div>

    <h3 class="sec" id="s4-apply">展开的用处</h3>
    <p>常见的麦克劳林展开要背熟几条：<Katex tex="\mathrm{e}^x=1+x+\frac{x^2}{2!}+\cdots" />，<Katex tex="\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots" />，<Katex tex="\ln(1+x)=x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots" />，<Katex tex="\frac{1}{1-x}=1+x+x^2+\cdots" />。它们的收敛区间各不相同，用之前先看 <Katex tex="x" /> 落在哪一段。</p>
    <p>展开最常见的三个用途：求未定式的极限（把每一项展开到够用的阶，低阶项相消后剩下的就是答案）、估计函数值（取几项就能达到要求的精度）、求高阶导数（把函数展开后比对系数，<Katex tex="f^{(n)}(0)=n!\,a_n" />）。这三件事在导数与微分那一章已经各自出现过一次，现在有了统一的工具。</p>
    <p>泰勒级数不保证收敛到原函数本身，还需要余项趋于零。图 级4b 第三档的 <Katex tex="\ln(1+x)" /> 在 <Katex tex="x>1" /> 处展开式发散，第四档在 <Katex tex="x=1" /> 处函数本身断裂，这两处都提示：展开式只是在收敛区间内代表原函数。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：端点要单独验。</strong>收敛半径只管开区间，两端各验一次，可能一端收敛另一端发散。</li>
        <li><strong>提示二：逐项求导在端点可能失效。</strong>端点收敛的级数，求导后未必仍收敛，区间内部的结论不能直接搬到端点上。</li>
        <li><strong>提示三：展开前先看收敛区间。</strong>把 <Katex tex="\ln(1+x)" /> 的展开式用到 <Katex tex="x=2" /> 上，得到的是发散的级数，不是原函数的值。</li>
        <li><strong>提示四：截断误差要配余项。</strong>取前 <Katex tex="n" /> 项近似，必须给出余项的界；只写「取几项就够」而没有误差估计，严格来说没有完成论证。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPowerlab } from '../../../boards/calc1/series/powerlab.js';
import { createBoard as createTaylorseries } from '../../../boards/calc1/series/taylorseries.js';
import { SN_CHAPTERS } from './snav.js';
</script>
