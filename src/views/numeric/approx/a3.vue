<template>
  <ChPage :cur="3" no="逼3" base="/numeric/a" :chapters="NA_CHAPTERS"
    title="数值积分：梯形与辛普森"
    sub="把积分区间切成若干段，每段用矩形、梯形或抛物线去盖住曲线，面积加起来就得到近似值。误差随分段数的下降速度由公式本身决定。"
    :toc="[{ id: 'a3-riemann', t: '从黎曼和出发' }, { id: 'a3-trap', t: '梯形公式' }, { id: 'a3-simp', t: '辛普森公式' }, { id: 'a3-pit', t: '光滑度与分段' }]">

    <div class="note good" id="a3-riemann">把 <Katex tex="[a,b]" /> 等分成 <Katex tex="n" /> 段，步长 <Katex tex="h=\dfrac{b-a}{n}" />，节点 <Katex tex="x_i=a+ih" />。几种常用公式：
      <Katex tex="\text{梯形：}\ T_n=\frac{h}{2}\Big[f(a)+f(b)+2\sum_{i=1}^{n-1}f(x_i)\Big]," display="true" />
      <Katex tex="\text{辛普森：}\ S_n=\frac{h}{3}\Big[f(a)+f(b)+4S_{\text{奇}}+2S_{\text{偶}}\Big]" display="true" />
      其中 <Katex tex="S_{\text{奇}}=\sum_{i\ \text{奇}}f(x_i)" />、<Katex tex="S_{\text{偶}}=\sum_{i\ \text{偶}}f(x_i)" /> 分别是对奇数号与偶数号节点的求和；辛普森公式要求 <Katex tex="n" /> 为偶数，它把每两段合成一条抛物线。</div>

    <div class="board-wrap">
      <BoardMount :factory="createQuadNum" />
      <div class="cap">图 逼3 · <b>数值积分</b>：被积函数 <Katex tex="\dfrac{1}{1+x^2}" /> 在 <Katex tex="[0,1]" /> 上的积分等于 <Katex tex="\dfrac{\pi}{4}" />，真值已知，所以误差能直接读出。金色是矩形或梯形的填色，绿色是辛普森用的抛物线。看点：固定分段数切换四个公式，右栏的误差从 <Katex tex="10^{-1}" /> 一路降到 <Katex tex="10^{-7}" />；再推动分段数，看右栏「误差降到 1/几」这一行怎么变。</div>
    </div>

    <h3 class="sec" id="a3-riemann">从黎曼和出发</h3>
    <p>定积分定义为黎曼和的极限，数值积分就是把这个极限截断：<Katex tex="n" /> 取有限值，把和算出来。最朴素的取法是每段取左端点的高度，误差来自曲线在一段之内的起伏。</p>
    <p>误差的大小可以从单段的展开看出来：在长度为 <Katex tex="h" /> 的一段上，<Katex tex="f" /> 与常数（或直线）的差约等于 <Katex tex="\dfrac{f'}{2}h^2" /> 量级，整段面积差约 <Katex tex="\dfrac{f'}{2}h^3" />；<Katex tex="n" /> 段相加，总误差约 <Katex tex="\dfrac{f'}{2}h^2(b-a)" />，即与 <Katex tex="h^2" /> 同阶。</p>
    <p>图 逼3 的矩形模式把这个误差看得很清楚：曲线下降，左端点的高度永远偏高，所有小矩形都盖在外面，误差同号不抵消，所以左端点矩形是一阶公式，比中点与梯形差一档。</p>

    <h3 class="sec" id="a3-trap">梯形公式</h3>
    <p>把每段的顶部换成一条直线，面积就是一个梯形：<Katex tex="\dfrac{h}{2}\big[f(x_i)+f(x_{i+1})\big]" />。相邻两段共用一条竖边，合并求和就得到上面的 <Katex tex="T_n" />，中间的节点系数都是 2，只有端点系数是 1。</p>
    <p>梯形公式的误差有一个漂亮的形式：<Katex tex="\displaystyle\int_a^b f-\ T_n=-\frac{(b-a)h^2}{12}f''(\xi)" />（<Katex tex="\xi" /> 在区间内）。这说明误差与二阶导数成正比：曲线越弯，误差越大；<Katex tex="f" /> 是一次函数时梯形公式精确。</p>
    <p>由于误差里 <Katex tex="h" /> 是平方，段数翻倍就使误差降到约四分之一。图 逼3 右栏的「阶数约为 2」正是这个结论的数值验证。</p>

    <h3 class="sec" id="a3-simp">辛普森公式</h3>
    <p>每两段用一个二次多项式穿过三个点，把梯形换成「梯形加一块抛物形的修正」。合并后的系数是 1、4、2、4、…、4、1，除以 3 乘 <Katex tex="h" />。</p>
    <p>它的误差是 <Katex tex="\displaystyle\int_a^b f-\ S_n=-\frac{(b-a)h^4}{180}f^{(4)}(\xi)" />。因为误差从二阶导数跳到四阶导数，低于三次的多项式都被它精确积分——这一点常被用来检验程序：拿一个三次函数试，辛普森应当给出精确值。</p>
    <p>误差按 <Katex tex="h^4" /> 缩小，段数翻倍降到约十六分之一。代价是要求 <Katex tex="n" /> 为偶数，且对高阶导数不光滑的函数不再占优。图 逼3 切到辛普森后，分段数只要 4 就已精确到小数点后五位。</p>

    <h3 class="sec" id="a3-pit">光滑度与分段</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：公式的阶数建立在光滑性上。</strong>误差公式里的 <Katex tex="f''" />、<Katex tex="f^{(4)}" /> 要求存在且有界。被积函数有尖点或导数中断时，理论阶数不再成立，实际误差可能只按 <Katex tex="h^2" /> 甚至 <Katex tex="h" /> 下降。</li>
        <li><strong>提示二：间断点不能硬跨。</strong>区间内有不连续点时，应当先分段再积分，让每个子区间内部光滑。</li>
        <li><strong>提示三：辛普森要求偶数段。</strong>分段数为奇数时最后一个区间只能退化成梯形处理，图 逼3 已把奇数自动折成偶数。</li>
        <li><strong>提示四：细分有下限。</strong>段数大到一定程度后，舍入误差开始盖过截断误差，再细化反而变差。误差随 <Katex tex="n" /> 的曲线是「先降后升」，最优段数在两者平衡处。</li>
      </ul>
    </div>
    <p>回收与预告：functions 模块 V8 从黎曼和与微积分基本定理出发讲过积分，本章只回答「算不出来的时候怎么估」。三个子专题到此走完——误差怎么量、方程怎么解、数据怎么拟合、函数怎么贴近，四条线在数值计算里彼此勾连。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQuadNum } from '../../../boards/numeric/approx/quadnum.js';
import { NA_CHAPTERS } from './nanav.js';
</script>
