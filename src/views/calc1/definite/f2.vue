<template>
  <ChPage :cur="2" no="定2" base="/calc1/f" :chapters="DF_CHAPTERS"
    title="微积分基本定理"
    sub="累计到 x 的那块面积是 x 的函数，它的导数就是被积函数；于是求定积分只需找原函数、代两个端点。"
    :toc="[{ id: 'f2-accum', t: '变上限积分' }, { id: 'f2-ftc', t: '基本定理' }, { id: 'f2-nl', t: '牛顿-莱布尼茨公式' }, { id: 'f2-use', t: '公式的用法' }]">

    <div class="note good" id="f2-accum">定义 <Katex tex="\Phi(x)=\int_a^x f(t)\,\mathrm{d}t" />，它把「从 <Katex tex="a" /> 累计到 <Katex tex="x" /> 的面积」看成 <Katex tex="x" /> 的函数。基本定理说的是 <Katex tex="\Phi'(x)=f(x)" />：面积函数的导数回到被积函数。</div>

    <div class="board-wrap">
      <BoardMount :factory="createAccumLab" />
      <div class="cap">图 定2 · <b>变上限积分与微积分基本定理</b>：蓝线是被积函数，绿块是 <Katex tex="[a,x]" /> 上累计的那块面积，橙线就是这块面积随 <Katex tex="x" /> 变化的曲线。看点：橙线在 <Katex tex="x" /> 处的切线斜率恒等于蓝线在该处的高度。</div>
    </div>

    <h3 class="sec" id="f2-accum">变上限积分</h3>
    <p>被积函数固定、上限变化，得到的是一个新的函数。设 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上连续，对每个 <Katex tex="x\in[a,b]" />，积分 <Katex tex="\int_a^x f" /> 都有确定的值，于是可以定义</p>
    <p style="text-align:center"><Katex display tex="\Phi(x)=\int_a^x f(t)\,\mathrm{d}t" /></p>
    <p>这里把积分变量写成 <Katex tex="t" /> 是为了不与上限 <Katex tex="x" /> 冲突：<Katex tex="t" /> 是积分过程中被扫过的哑变量，<Katex tex="x" /> 是停在哪儿的上限。</p>
    <p>图 定2 把两条曲线画在同一张图上。让 <Katex tex="x" /> 往右挪一点点，绿块多出来一条宽 <Katex tex="\mathrm{d}x" />、高 <Katex tex="f(x)" /> 的窄条，面积增加了 <Katex tex="f(x)\mathrm{d}x" />。窄条面积除以宽度，就是变化率：</p>
    <p style="text-align:center"><Katex display tex="\Phi'(x)=\lim_{\Delta x\to0}\frac{\Phi(x+\Delta x)-\Phi(x)}{\Delta x}=f(x)" /></p>

    <h3 class="sec" id="f2-ftc">基本定理</h3>
    <p>上面这条式子就是微积分基本定理的第一部分，它把两种看似无关的运算接了起来：积分是把无穷多小片加起来，求导是取差商的极限，二者在这里互为逆运算。</p>
    <p>它还有一个推论：<Katex tex="\Phi" /> 是 <Katex tex="f" /> 的一个原函数。既然连续函数一定有原函数（就取 <Katex tex="\Phi" />），那么「求原函数」这件事在连续函数上总有解。这也顺带证明了上一章只能凭经验相信的事实。</p>
    <p>图 定2 右栏的三行读数正是这条定理的现场：<Katex tex="\Phi(x)" /> 一栏是橙线的高度，<Katex tex="f(x)" /> 一栏是蓝线的高度，而 <Katex tex="\Phi'(x)" /> 一栏给出的切斜率与后者相同。<Katex tex="x" /> 拖到哪里都对得上。</p>

    <h3 class="sec" id="f2-nl">牛顿-莱布尼茨公式</h3>
    <p>设 <Katex tex="F" /> 是 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上的任一原函数。由 <Katex tex="\Phi" /> 也是原函数、原函数只差常数，得 <Katex tex="\Phi(x)=F(x)-F(a)" />。取 <Katex tex="x=b" />：</p>
    <p style="text-align:center"><Katex display tex="\int_a^b f(x)\,\mathrm{d}x=F(b)-F(a)\equiv\left[F(x)\right]_a^b" /></p>
    <p>这个公式把定积分的计算整个交给了不定积分：找原函数、代两个端点、相减。图 定1 里那个「精确值」一栏，实际就是这么算出来的。</p>

    <h3 class="sec" id="f2-use">公式的用法</h3>
    <p>用的时候注意三件事。第一，<Katex tex="F" /> 要在整个区间上都是原函数，区间中间有断点时不能直接跨过去，得拆开——<Katex tex="\int_{-1}^{1}\mathrm{d}x/x^2" /> 按公式算得负数，正是没看见 <Katex tex="x=0" /> 处的断点。第二，上下限的次序可以反过来，但要把结果变号。第三，作差的 <Katex tex="F(a)" /> 别丢，只算 <Katex tex="F(b)" /> 等价于默认 <Katex tex="F(a)=0" />，只在 <Katex tex="a=0" /> 且原函数在零点为零时才碰巧对。</p>
    <p>变上限积分还有几种常见变体，都可以由基本定理加上链式法则得到：</p>
    <p style="text-align:center"><Katex display tex="\frac{\mathrm{d}}{\mathrm{d}x}\int_a^{\varphi(x)}f(t)\,\mathrm{d}t=f(\varphi(x))\,\varphi'(x)" /></p>
    <p>上下限都带函数时，拆成两个变上限积分相减即可。这类式子在后续的极限题里很常见，认出「积分号里套变量」的结构，就知道该对上限求导。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：被积函数里不能带上限变量。</strong><Katex tex="\int_0^x xf(t)\mathrm{d}t" /> 里的 <Katex tex="x" /> 是常数，可以提到积分号外写成 <Katex tex="x\int_0^x f" />，再求导。</li>
        <li><strong>提示二：上限是复合函数时别忘链式法则。</strong>对 <Katex tex="\int_0^{x^2}f" /> 求导，结果是 <Katex tex="f(x^2)\cdot2x" />，不是 <Katex tex="f(x^2)" />。</li>
        <li><strong>提示三：区间内有断点要拆开。</strong>公式要求 <Katex tex="F" /> 在整段上都是原函数，跨过无穷间断点直接套用会得出荒谬的负数。</li>
        <li><strong>提示四：变上限积分是函数，可以求导、求极值。</strong>见到 <Katex tex="\Phi" /> 的极值或单调性问题，按普通函数处理即可。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAccumLab } from '../../../boards/calc1/definite/accumlab.js';
import { DF_CHAPTERS } from './fnav.js';
</script>
