<template>
  <ChPage :cur="2" no="逼2" base="/numeric/a" :chapters="NA_CHAPTERS"
    title="插值多项式与龙格现象"
    sub="让多项式穿过给定的每一组数据点，节点越密，多项式次数越高。但对等距节点，次数高到一定程度，端点反而剧烈振荡。"
    :toc="[{ id: 'a2-lag', t: '插值多项式与拉格朗日公式' }, { id: 'a2-runge', t: '龙格现象' }, { id: 'a2-cheb', t: '换节点：切比雪夫' }, { id: 'a2-pit', t: '节点、次数与稳定性' }]">

    <div class="note good" id="a2-lag">给定 <Katex tex="n+1" /> 个互不相同的节点 <Katex tex="x_0,\dots,x_n" /> 与函数值 <Katex tex="y_i=f(x_i)" />，存在唯一的次数不超过 <Katex tex="n" /> 的多项式 <Katex tex="P_n" /> 满足 <Katex tex="P_n(x_i)=y_i" />。它的拉格朗日形式是
      <Katex tex="P_n(x)=\sum_{i=0}^{n} y_i\prod_{j\ne i}\frac{x-x_j}{x_i-x_j}." display="true" />
      每个基函数在属于自己的节点取 1、在其余节点取 0，所以求和之后恰好穿过全部数据点。</div>

    <div class="board-wrap">
      <BoardMount :factory="createRunge" />
      <div class="cap">图 逼2 · <b>插值多项式机</b>：蓝线是 <Katex tex="f(x)=\dfrac{1}{1+25x^2}" />，紫圈是等距节点，金线是穿过全部节点的插值多项式。看点：把区间份数从 4 推到 12，金线在中间贴着曲线，在两端却翘得越来越高，右栏的「最大偏离」随之增大；再打上「切比雪夫节点」，紫圈向两端变密，金线立刻收回曲线附近。</div>
    </div>

    <h3 class="sec" id="a2-lag">插值多项式与拉格朗日公式</h3>
    <p>插值的要求很硬：每个节点上必须严格相等。这与泰勒展开的思路相反——泰勒在一个点对齐尽可能多阶的导数，插值在许多点对齐函数值。</p>
    <p>唯一性的理由简单：如果两个次数不超过 <Katex tex="n" /> 的多项式在 <Katex tex="n+1" /> 个点上取值相同，它们的差是一个不超过 <Katex tex="n" /> 次的多项式却有 <Katex tex="n+1" /> 个零点，只能是零多项式。同样的道理给出插值的误差公式</p>
    <p><Katex tex="f(x)-P_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}\prod_{i=0}^{n}(x-x_i)" display="true" /></p>
    <p>它与泰勒余项长得几乎一样，只把 <Katex tex="(x-x_0)^{n+1}" /> 换成了 <Katex tex="\prod(x-x_i)" />。这个连乘积正是问题的关键：误差不仅取决于函数本身，还强烈依赖节点的分布。</p>

    <h3 class="sec" id="a2-runge">龙格现象</h3>
    <p>直觉上节点越密，插值应当越好。图 逼2 否定了这个直觉：<Katex tex="n" /> 从 4 增到 12，中间部分确实越来越贴合，两端的偏差却越来越大，<Katex tex="n" /> 再大会趋于无穷。这个反例由龙格在 1901 年给出，用的就是 <Katex tex="\dfrac{1}{1+25x^2}" /> 这一族函数。</p>
    <p>原因藏在误差公式的连乘积里。在等距节点下，<Katex tex="\prod(x-x_i)" /> 在区间中部的值很小，在两端的值很大：靠近端点时，<Katex tex="x" /> 到最远那个节点的距离被反复相乘，量级迅速膨胀。同时高阶导数 <Katex tex="f^{(n+1)}" /> 增长得比 <Katex tex="(n+1)!" /> 还快，两方面的不利在端点叠加。</p>
    <p>所以「次数越高越好」是错的。高次多项式在数值上还有第二个麻烦：系数对节点值极其敏感，节点值动一点点，远处整条曲线都会变。</p>

    <h3 class="sec" id="a2-cheb">换节点：切比雪夫</h3>
    <p>既然误差由节点分布决定，就把节点往两端挪。切比雪夫节点的取法是
      <Katex tex="x_i=\cos\frac{2i+1}{2(n+1)}\pi,\qquad i=0,1,\dots,n," display="true" />
      即单位圆上等角分布的点投影到直径上。它们在区间两端明显变密，在中部较疏。</p>
    <p>这种分布的优点是可以定量：连乘积 <Katex tex="\prod(x-x_i)" /> 的最大值按 <Katex tex="2^{-n}" /> 缩小，恰是所有节点取法中使这一项最小的。图 逼2 打开切比雪夫节点后，金线不再甩出，两端与曲线几乎重合。</p>
    <p>结论是：在固定区间上做整体逼近，节点的疏密应当「端点密、中间疏」；想要程序简单、区间大，则宁可分段低阶（如样条），也不要用单个高次多项式。</p>

    <h3 class="sec" id="a2-pit">节点、次数与稳定性</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：加密等距节点并不收敛。</strong>龙格现象是等距节点的固有缺陷，不是计算误差，多算几位小数也救不回来。</li>
        <li><strong>提示二：次数不宜超过实际需要。</strong>穿过 <Katex tex="n+1" /> 个点的最小次数多项式是 <Katex tex="n" /> 次，没有理由再往上加；次数越高，计算越不稳定。</li>
        <li><strong>提示三：插值不等于拟合。</strong>拟合允许点不在曲线上、追求整体偏差小，插值要求点严格在曲线上。数据本身带噪声时，强行插值等于把噪声也照抄进曲线。</li>
        <li><strong>提示四：误差公式里的 <Katex tex="\xi" /> 依赖于 <Katex tex="x" />。</strong>不能拿一个固定的 <Katex tex="\xi" /> 去估整个区间，要估计就得对 <Katex tex="f^{(n+1)}" /> 取上界。</li>
      </ul>
    </div>
    <p>回收与预告：逼1 的误差在展开点附近最小、向外增长；插值的误差呈「中间小、两端大」的形态，两者都归结为同一个连乘因子。逼3 把这套多项式搬进积分：不求近似的函数，只求近似的面积。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRunge } from '../../../boards/numeric/approx/runge.js';
import { NA_CHAPTERS } from './nanav.js';
</script>
