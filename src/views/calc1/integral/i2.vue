<template>
  <ChPage :cur="2" no="积2" base="/calc1/i" :chapters="IN_CHAPTERS"
    title="换元积分法"
    sub="被积式里藏着一个整体：把 u 换上去，复杂的式子退回到基本积分表，最后把 u 换回 x。"
    :toc="[{ id: 'i2-first', t: '凑微分' }, { id: 'i2-second', t: '三角代换' }, { id: 'i2-back', t: '回代与定限' }, { id: 'i2-choose', t: '怎么挑换元' }]">

    <div class="note good" id="i2-first">换元积分法就是链式法则反过来用。<Katex tex="\mathrm{d}u=\varphi'(x)\,\mathrm{d}x" /> 把原式里的 <Katex tex="\varphi'(x)\,\mathrm{d}x" /> 整块换成 <Katex tex="\mathrm{d}u" />，被积函数随之从 <Katex tex="x" /> 的语言翻成 <Katex tex="u" /> 的语言。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSubstLab" />
      <div class="cap">图 积2 · <b>换元机</b>：模式一左右两幅各画一段面积，左边是 <Katex tex="2x\cos x^2" /> 在 <Katex tex="[a,b]" /> 上的，右边是 <Katex tex="\cos u" /> 在 <Katex tex="[a^2,b^2]" /> 上的，两段一样大；模式二在半径 <Katex tex="a" /> 的圆上读出 <Katex tex="x=a\sin\theta" /> 与 <Katex tex="\sqrt{a^2-x^2}=a\cos\theta" />。</div>
    </div>

    <h3 class="sec" id="i2-first">第一类换元：凑微分</h3>
    <p>若被积式能写成 <Katex tex="f(\varphi(x))\,\varphi'(x)" /> 的形状，令 <Katex tex="u=\varphi(x)" />，就有</p>
    <p style="text-align:center"><Katex display tex="\int f(\varphi(x))\,\varphi'(x)\,\mathrm{d}x=\int f(u)\,\mathrm{d}u" /></p>
    <p>右边往往正是基本积分表里的一行。图 积2 的模式一把这一点画成了两段面积：左边 <Katex tex="\int_a^b 2x\cos(x^2)\,\mathrm{d}x" />，右边 <Katex tex="\int_{a^2}^{b^2}\cos u\,\mathrm{d}u" />。端点由 <Katex tex="u=x^2" /> 一并换算，两边数值相等，因为 <Katex tex="\mathrm{d}u=2x\,\mathrm{d}x" /> 恰好把宽度也换掉了。</p>
    <p>用起来是这样的：</p>
    <p style="text-align:center"><Katex display tex="\int 2x\cos(x^2)\,\mathrm{d}x=\int\cos u\,\mathrm{d}u=\sin u+C=\sin\left(x^2\right)+C" /></p>
    <p>常见的凑法有 <Katex tex="x\,\mathrm{d}x=\tfrac12\mathrm{d}(x^2)" />、<Katex tex="\mathrm{d}x/x=\mathrm{d}(\ln x)" />、<Katex tex="\cos x\,\mathrm{d}x=\mathrm{d}(\sin x)" />。判断的窍门是：式子分成两半后，一半是另一半的导数（或差一个常数倍）。</p>

    <h3 class="sec" id="i2-second">第二类换元：三角代换</h3>
    <p>反过来也行：主动令 <Katex tex="x=\psi(t)" />，把根式换成三角函数。三种根式各配一种代换：</p>
    <p style="text-align:center"><Katex display tex="\sqrt{a^2-x^2}\to x=a\sin t,\qquad \sqrt{a^2+x^2}\to x=a\tan t,\qquad \sqrt{x^2-a^2}\to x=a\sec t" /></p>
    <p>三种代换的共同点是把根号里的式子变成完全平方，从而开得出来。以第一种为例，<Katex tex="a^2-x^2=a^2\cos^2t" />，开方后是 <Katex tex="a\cos t" />，根号消失。图 积2 的模式二把这件事画成一个直角三角形：斜边是半径 <Katex tex="a" />，横向直角边是 <Katex tex="x=a\sin t" />，纵向就是 <Katex tex="\sqrt{a^2-x^2}=a\cos t" />。图上量出的两个数值与公式一致。</p>
    <p>代换时还要换微分：<Katex tex="\mathrm{d}x=a\cos t\,\mathrm{d}t" />。这一步漏掉，积分就只剩一半。</p>

    <h3 class="sec" id="i2-back">回代与定限</h3>
    <p>不定积分算完必须把 <Katex tex="t" /> 换回 <Katex tex="x" />。三角代换的回代靠三角形：由 <Katex tex="\sin t=x/a" /> 作一个直角边为 <Katex tex="x" />、斜边为 <Katex tex="a" /> 的三角形，其余三角函数值直接从图上读。</p>
    <p>若是定积分，就不必回代：算出 <Katex tex="t" /> 的上下限一并代入即可，省掉来回换算，还少出错。换元的两个方向都记一句话：不定积分要回代，定积分要换限，二者选一，不可混着用。</p>

    <h3 class="sec" id="i2-choose">怎么挑换元</h3>
    <p>挑换元没有通用算法，但有次序可循：先看有没有一个整体在其中反复出现（令它为 <Katex tex="u" />）；再看有没有 <Katex tex="\varphi'(x)\,\mathrm{d}x" /> 那样的尾巴；两样都看不出来，再看根式类型，按上面三种代换试。试的方向错了也不要紧，换一步就能看出被积函数有没有变简单。</p>
    <p>还要留意代换本身的范围。<Katex tex="x=a\sin t" /> 只覆盖 <Katex tex="[-a,a]" />；若积分区间超出，得先分段。开方写 <Katex tex="\sqrt{a^2\cos^2t}=a\cos t" /> 时默认 <Katex tex="\cos t\ge0" />，这也是取主值区间的原因。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不要漏掉微分。</strong>令 <Katex tex="u=x^2" /> 就要同时写 <Katex tex="\mathrm{d}u=2x\,\mathrm{d}x" />；只换被积函数、不换 <Katex tex="\mathrm{d}x" />，结果一定不对。</li>
        <li><strong>提示二：凑的常数要补回去。</strong><Katex tex="x\,\mathrm{d}x=\tfrac12\mathrm{d}(x^2)" /> 里那个 <Katex tex="\tfrac12" /> 是硬性要求，不是可省的习惯写法。</li>
        <li><strong>提示三：三角代换注意符号与范围。</strong><Katex tex="\sqrt{a^2-x^2}" /> 开方得非负的 <Katex tex="a\cos t" />，所以 <Katex tex="t" /> 取 <Katex tex="(-\pi/2,\pi/2)" />；超出时开方要变号。</li>
        <li><strong>提示四：换元不是凑巧，是链式法则。</strong>能凑成的式子，其结构必然是「外层函数乘以内层导数」。看不出来时，回头按这个结构对一遍。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSubstLab } from '../../../boards/calc1/integral/substlab.js';
import { IN_CHAPTERS } from './inav.js';
</script>
