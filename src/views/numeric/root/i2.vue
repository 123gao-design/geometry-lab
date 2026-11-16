<template>
  <ChPage :cur="2" no="迭2" base="/numeric/i" :chapters="NI_CHAPTERS"
    title="牛顿迭代与弦截法"
    sub="在当前的近似点作切线，切线与 x 轴的交点作为下一个近似点。根附近每迭代一次，有效数字大致翻倍。"
    :toc="[{ id: 'i2-form', t: '迭代公式与几何来源' }, { id: 'i2-speed', t: '收敛速度' }, { id: 'i2-secant', t: '弦截法' }, { id: 'i2-pit', t: '初值、导数与跑飞' }]">

    <div class="note good" id="i2-form">牛顿迭代公式 <Katex tex="x_{n+1}=x_n-\dfrac{f(x_n)}{f'(x_n)}" />。它来自把 <Katex tex="f" /> 在 <Katex tex="x_n" /> 处展开到一次项：解 <Katex tex="f(x_n)+f'(x_n)(x-x_n)=0" />，得到的就是这个式子。</div>

    <div class="board-wrap">
      <BoardMount :factory="createNewtonLab" />
      <div class="cap">图 迭2 · <b>牛顿迭代机</b>：金色点是当前点，金色直线是这一点的切线，它落到 x 轴上的交点就是下一个近似点（蓝点）。看点：连点「迭代一步」，右栏的误差列从 <Katex tex="10^{-1}" /> 一路掉到 <Katex tex="10^{-8}" /> 附近，位数一次比一次翻倍；把金点拖到 <Katex tex="x" /> 接近 1 的位置再迭代，切线几乎水平，一步就跑到很远。</div>
    </div>

    <h3 class="sec" id="i2-form">迭代公式与几何来源</h3>
    <p>公式里没有解的影子，它只是「用切线代替曲线」这一句话的翻译。曲线与 x 轴的交点不好求，切线与 x 轴的交点却是一元一次方程，随手可解。在根附近曲线与切线几乎重合，所以切线的零点很接近真正的零点。</p>
    <p>把它写成递推就是一件事：拿旧点算函数值和导数值，交出新点，再拿新点重来。每一步只算一个 <Katex tex="f" /> 和一个 <Katex tex="f'" />，比二分法贵一点，但收敛快得多。</p>
    <p>图 迭2 中紫色虚线是当前点的函数值，金色切线从这一点出发，蓝色交点就是 <Katex tex="x_{n+1}" />。迭代几次之后，蓝点会紧紧贴在绿线标出的真根上，肉眼已分不出来。</p>

    <h3 class="sec" id="i2-speed">收敛速度</h3>
    <p>记误差 <Katex tex="e_n=x_n-x^*" />，在根附近展开可以推出 <Katex tex="e_{n+1}\approx\dfrac{f''(x^*)}{2f'(x^*)}e_n^{\,2}" />。误差被<b>平方</b>，所以叫二阶收敛：误差是 <Katex tex="10^{-2}" /> 时下一步约 <Katex tex="10^{-4}" />，再下一步 <Katex tex="10^{-8}" />。有效数字每次翻倍。</p>
    <p>这个结论只在根附近成立。离根远的时候，二阶项不起主导作用，实际下降可能只比线性稍快，甚至变慢或跑飞。</p>
    <p>与二分法相比：二分法每次把区间减半，是稳定的一阶收敛；牛顿法在根附近快得惊人，却没有「一定收敛」的保证。前者的误差界与函数无关，后者的收敛依赖初值取得够近。</p>

    <h3 class="sec" id="i2-secant">弦截法</h3>
    <p>牛顿法需要导数，很多实际问题给不出解析导数，数值差商又会引入误差。弦截法改用两点连线的零点：</p>
    <p><Katex tex="x_{n+1}=x_n-\dfrac{x_n-x_{n-1}}{f(x_n)-f(x_{n-1})}f(x_n)" />。这就是把切线换成割线，斜率由两个已知点现算，不必求导。</p>
    <p>代价是收敛阶从 2 降到约 1.618（黄金比），每步只需一个新函数值，综合起来常常比牛顿法更划算。它需要两个初值，且两点函数值不能太接近，否则割线斜率不稳。</p>

    <h3 class="sec" id="i2-pit">初值、导数与跑飞</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：初值离根太远会跑飞。</strong>切线在远处与曲线相差悬殊，交点可能落到区间之外，甚至越迭代越远。先用二分法把根圈起来，再交给牛顿法。</li>
        <li><strong>提示二：导数为零处不能用。</strong><Katex tex="f'(x_n)=0" /> 时切线水平，与 x 轴无交点，公式除以零。初值恰好落在极值点附近时要换一个。</li>
        <li><strong>提示三：可能死循环。</strong>存在 <Katex tex="x_{n+1}=x_{n-1}" /> 的情形（两个点来回跳），判断收敛时要同时看步长与函数值，并设最大步数。</li>
        <li><strong>提示四：重根会掉到一阶。</strong>根是二重根时 <Katex tex="f'(x^*)=0" />，上面的二阶结论失效，收敛退化成线性，速度与二分法相当。</li>
      </ul>
    </div>
    <p>回收与预告：牛顿法其实是一个不动点迭代的特例——取 <Katex tex="\varphi(x)=x-\dfrac{f(x)}{f'(x)}" />，在根处 <Katex tex="\varphi'(x^*)=0" />，斜率恰好是零，所以收敛特别快。迭3 回到不动点迭代的一般情形，看看斜率怎样决定收敛。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createNewtonLab } from '../../../boards/numeric/root/newtonlab.js';
import { NI_CHAPTERS } from './inav.js';
</script>
