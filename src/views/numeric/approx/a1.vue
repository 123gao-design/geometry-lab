<template>
  <ChPage :cur="1" no="逼1" base="/numeric/a" :chapters="NA_CHAPTERS"
    title="泰勒多项式与余项界"
    sub="用多项式在一点处逐阶对齐函数的导数，就得到泰勒多项式；剩下的差由拉格朗日余项给出上界。逼近好不好，看的是这个界而不是感觉。"
    :toc="[{ id: 'a1-build', t: '怎样逐阶对齐' }, { id: 'a1-rest', t: '余项与误差界' }, { id: 'a1-range', t: '阶数与区间' }, { id: 'a1-pit', t: '收敛半径与展开点' }]">

    <div class="note good" id="a1-build">若 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处有 <Katex tex="n" /> 阶导数，则它的 <Katex tex="n" /> 阶泰勒多项式为
      <Katex tex="P_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k" display="true" />
      余项 <Katex tex="R_n(x)=f(x)-P_n(x)" /> 满足拉格朗日形式 <Katex tex="R_n(x)=\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-x_0)^{n+1}" />，其中 <Katex tex="\xi" /> 介于 <Katex tex="x_0" /> 与 <Katex tex="x" /> 之间。取 <Katex tex="x_0=0" /> 时称为麦克劳林公式。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTaylorApprox" />
      <div class="cap">图 逼1 · <b>泰勒逼近机</b>：上板蓝线是 <Katex tex="\cos x" />，金线是 <Katex tex="n" /> 阶麦克劳林多项式；下板红线是两者的差，紫色虚线是余项上界 <Katex tex="|x|^{n+1}/(n+1)!" />。看点：把 <Katex tex="n" /> 从 0 拖到 10，上板的贴合区间以 0 为中心向外扩张，下板的红线始终被紫线压住；红点标在 <Katex tex="x=2" /> 处，右栏的四个读数跟着变。</div>
    </div>

    <h3 class="sec" id="a1-build">怎样逐阶对齐</h3>
    <p>一次逼近的条件是「函数值与一阶导数都相同」，几何上就是曲线与多项式在 <Katex tex="x_0" /> 处相切。再加二阶导数相同，两者的弯曲程度也一致；继续加下去，直到 <Katex tex="n" /> 阶导数全部对齐。</p>
    <p>对齐的写法就是让 <Katex tex="P_n" /> 的 <Katex tex="k" /> 阶导数在 <Katex tex="x_0" /> 处等于 <Katex tex="f^{(k)}(x_0)" />。把 <Katex tex="P_n" /> 写成 <Katex tex="\sum c_k(x-x_0)^k" />，逐次求导代入，恰好得到 <Katex tex="c_k=f^{(k)}(x_0)/k!" />。系数里出现的阶乘正是「求 <Katex tex="k" /> 次导会带出 <Katex tex="k!" />」的结果。</p>
    <p>图 逼1 取 <Katex tex="\cos x" /> 的偶数项：<Katex tex="1" />、<Katex tex="1-\dfrac{x^2}{2}" />、<Katex tex="1-\dfrac{x^2}{2}+\dfrac{x^4}{24}" />……奇次项系数为零，所以 <Katex tex="n" /> 从偶数增到下一个奇数时图形不变。这条规律在拖动阶数时看得很清楚：金线每次都要跨过两级才出现新样子。</p>

    <h3 class="sec" id="a1-rest">余项与误差界</h3>
    <p>拉格朗日余项把误差写成「第 <Katex tex="n+1" /> 阶导数在某个中间点 <Katex tex="\xi" /> 的值」乘上一个幂次。这个 <Katex tex="\xi" /> 无法确定，但只要知道导数的上界 <Katex tex="M" />，就得到
      <Katex tex="|R_n(x)|\le\dfrac{M}{(n+1)!}|x-x_0|^{n+1}." display="true" /></p>
    <p>对 <Katex tex="\cos x" />，所有阶导数的绝对值都不超过 <Katex tex="1" />，于是 <Katex tex="|R_n(x)|\le\dfrac{|x|^{n+1}}{(n+1)!}" />。这正是图 逼1 下板中紫线的表达式，红线（实际误差）始终落在它下面，但两者的走势一致：都在 <Katex tex="x=0" /> 处为零，都向外单调上升。</p>
    <p>另一条常用形式是佩亚诺余项 <Katex tex="R_n(x)=o\big((x-x_0)^n\big)" />。它只说明误差比 <Katex tex="n" /> 次幂高阶，给不出具体数值；要估计数值，仍要用拉格朗日形式或直接算出下一项。</p>

    <h3 class="sec" id="a1-range">阶数与区间</h3>
    <p>固定 <Katex tex="n" />，误差随 <Katex tex="|x|" /> 增大而增大，而且增长极快：<Katex tex="|x|"/> 翻倍，上界至少放大 <Katex tex="2^{n+1}" /> 倍。所以「几阶多项式够用」这个问题离不开区间：同一条 6 阶多项式，在 <Katex tex="|x|\le 1" /> 上可以精确到 <Katex tex="10^{-4}" /> 量级，在 <Katex tex="x=4" /> 附近却毫无用处。</p>
    <p>固定区间而提高阶数则完全是另一回事：<Katex tex="(n+1)!" /> 增长得比任何幂都快，所以只要 <Katex tex="x" /> 落在收敛范围内，阶数一高误差就迅速掉到底。图 逼1 中把 <Katex tex="n" /> 推到 8 以上，<Katex tex="x=2" /> 处的读数会从 <Katex tex="10^{-1}" /> 直接掉到小数点后六位。</p>
    <p>这件事有一个实用推论：想要一个在整个区间上一致准确的近似，应当把区间切小、在每个小块内用低阶多项式，而不是硬提高阶数。分段低阶正是各类数值库的做法。</p>

    <h3 class="sec" id="a1-pit">收敛半径与展开点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：多项式逼近只在展开点附近有效。</strong>展开点选在哪里，误差就以哪里为中心向外增长。要在 <Katex tex="x=3" /> 附近用，就该在 <Katex tex="x_0=3" /> 处展开，而不是搬 <Katex tex="x_0=0" /> 的结果过去。</li>
        <li><strong>提示二：不是所有函数都能无限展开。</strong>例如 <Katex tex="\dfrac{1}{1-x}" /> 的展开只在 <Katex tex="|x|<1" /> 内收敛，超出这个范围，阶数再高也不收敛。收敛范围与函数在复平面上的奇点位置有关。</li>
        <li><strong>提示三：余项界要求导数有界。</strong>拉格朗日形式里的 <Katex tex="M" /> 是 <Katex tex="f^{(n+1)}" /> 在区间上的上界。导数在高阶无界时，这个界失去意义，需要换别的估计。</li>
        <li><strong>提示四：相减会损失有效数字。</strong>用 <Katex tex="P_n" /> 计算接近零的值时，项与项之间可能大数相消，误差被放大。这与误2 的条件数是同一件事。</li>
      </ul>
    </div>
    <p>回收与预告：functions 模块 V6 从「让导数逐个对齐」的角度推过麦克劳林展开，V4 的切线放缩 <Katex tex="e^x\ge 1+x" /> 就是一阶泰勒多项式给下界。逼2 换一种逼近方式：不在一点展开，而是让多项式穿过多组给定的数据点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTaylorApprox } from '../../../boards/numeric/approx/taylapprox.js';
import { NA_CHAPTERS } from './nanav.js';
</script>
