<template>
  <ChPage :cur="3" no="定3" base="/calc1/f" :chapters="DF_CHAPTERS"
    title="定积分的计算"
    sub="换元要换限，分部要带上下限；上手之前先看区间与函数的对称性，往往一半的计算可以省掉。"
    :toc="[{ id: 'f3-sub', t: '换元换限' }, { id: 'f3-part', t: '分部积分' }, { id: 'f3-sym', t: '对称区间' }, { id: 'f3-trick', t: '周期与其他' }]">

    <div class="note good" id="f3-sub">定积分的换元与不定积分只差一件事：换元的同时把上下限一起换掉，算完不必回代。对称区间则更进一步，先判奇偶，有一半的积分直接为零。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSymmetry" />
      <div class="cap">图 定3 · <b>对称区间上的定积分</b>：<Katex tex="[-a,0]" /> 与 <Katex tex="[0,a]" /> 上各画一块有向面积。看点：奇函数的两块一正一负、大小相等，合计恒为零；偶函数的两块完全一样，合计是右半的两倍。四个预设覆盖 <Katex tex="\sin x" />、<Katex tex="x^3" />、<Katex tex="\cos x" />、<Katex tex="x^2" />。</div>
    </div>

    <h3 class="sec" id="f3-sub">换元换限</h3>
    <p>若 <Katex tex="x=\varphi(t)" /> 在 <Katex tex="[\alpha,\beta]" /> 上单调、有连续导数，且 <Katex tex="\varphi(\alpha)=a" />、<Katex tex="\varphi(\beta)=b" />，则</p>
    <p style="text-align:center"><Katex display tex="\int_a^b f(x)\,\mathrm{d}x=\int_\alpha^\beta f(\varphi(t))\,\varphi'(t)\,\mathrm{d}t" /></p>
    <p>与不定积分的差别只在最后一步：这里不必把 <Katex tex="t" /> 换回 <Katex tex="x" />，上下限已经一并改成了 <Katex tex="t" /> 的语言，算出的就是数。反过来若图省事把 <Katex tex="x" /> 的上下限代进 <Katex tex="t" /> 的式子，结果必错。</p>
    <p>图 积2 已经给过换元的几何解释：两段面积由 <Katex tex="\mathrm{d}u=\varphi'(x)\mathrm{d}x" /> 一对一搬过去。定积分只是在这幅画上加了两条边界，搬的手法不变。</p>

    <h3 class="sec" id="f3-part">分部积分</h3>
    <p>把乘积法则在区间上积分，得到带上下限的版本：</p>
    <p style="text-align:center"><Katex display tex="\int_a^b u\,\mathrm{d}v=\left[uv\right]_a^b-\int_a^b v\,\mathrm{d}u" /></p>
    <p>选择 <Katex tex="u" /> 的次序与不定积分一致：反三角、对数、幂、三角、指数，靠前的先求导。区别在于多出来的那一项 <Katex tex="[uv]_a^b" /> 要代入端点，它是具体的数，不是函数。</p>
    <p>例如 <Katex tex="\int_0^1 x\mathrm{e}^x\mathrm{d}x" />，取 <Katex tex="u=x" />、<Katex tex="\mathrm{d}v=\mathrm{e}^x\mathrm{d}x" />，得</p>
    <p style="text-align:center"><Katex display tex="\left[x\mathrm{e}^x\right]_0^1-\int_0^1\mathrm{e}^x\mathrm{d}x=\mathrm{e}-(\mathrm{e}-1)=1" /></p>

    <h3 class="sec" id="f3-sym">对称区间</h3>
    <p>区间关于原点对称时，先看函数的奇偶性。设 <Katex tex="f" /> 在 <Katex tex="[-a,a]" /> 上连续：</p>
    <p style="text-align:center"><Katex display tex="\int_{-a}^{a}f=0\ (f\ \text{奇}),\qquad \int_{-a}^{a}f=2\int_0^a f\ (f\ \text{偶})" /></p>
    <p>图 定3 把这两句话画成了两块面积。奇函数在 <Katex tex="[-a,0]" /> 上与 <Katex tex="[0,a]" /> 上的图形关于原点对称，一块在上、一块在下，大小相同、符号相反，相加为零；偶函数两块关于 <Katex tex="y" /> 轴对称，完全重合，相加是两倍。滑块拖动时两块大小一直变，结论不变。</p>
    <p>不对称但相关的一对公式也常用：对任意连续函数，<Katex tex="\int_{-a}^{a}f(x)\mathrm{d}x=\int_0^a\left[f(x)+f(-x)\right]\mathrm{d}x" />。遇到看不透奇偶的式子，用这一条把负半轴消掉再算。</p>

    <h3 class="sec" id="f3-trick">周期与其他</h3>
    <p>周期函数在任意一个整周期上的积分相同：<Katex tex="\int_a^{a+T}f=\int_0^T f" />。于是一个周期的积分可以挪到最顺手的区间上算，长区间按周期切开后逐段相等。</p>
    <p>还有一个常用的换元结果：<Katex tex="\int_0^{\pi}xf(\sin x)\mathrm{d}x=\frac{\pi}{2}\int_0^{\pi}f(\sin x)\mathrm{d}x" />。它来自令 <Katex tex="x=\pi-t" /> 后把两式相加。这类「令 <Katex tex="x=\pi-t" /> 或 <Katex tex="x=a+b-t" /> 再与原式相加」的做法，是定积分计算里最省力的一招。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：换元必须换限。</strong>上下限跟着 <Katex tex="\varphi" /> 一起变，且要保证 <Katex tex="\varphi" /> 在该区间单调，否则对应关系要分段。</li>
        <li><strong>提示二：分部积分的 <Katex tex="[uv]_a^b" /> 别丢。</strong>只写后半段 <Katex tex="-\int v\,\mathrm{d}u" /> 是这一章最常见的漏项。</li>
        <li><strong>提示三：对称区间先判奇偶。</strong>不看奇偶直接硬算，往往白做一半。看到 <Katex tex="\int_{-a}^{a}" /> 就该停一下。</li>
        <li><strong>提示四：别把定积分算成函数。</strong>结果是一个数，若算到最后还留着变量，检查是不是把某处上限当成了变量。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSymmetry } from '../../../boards/calc1/definite/symmetry.js';
import { DF_CHAPTERS } from './fnav.js';
</script>
