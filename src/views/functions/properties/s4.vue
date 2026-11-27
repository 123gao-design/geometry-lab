<template>
  <ChPage :cur="4" no="S4" base="/functions/s" :chapters="S_CHAPTERS"
    title="有界性与最值" sub="上界和下界约束函数值。取到上确界或下确界时，才有相应的最大值或最小值。"
    :toc="[{ id: 's4-def', t: '定义（图 S4）' }, { id: 's4-thm', t: '最值定理与确界' }, { id: 's4-warn', t: '三处易错' }]">
    <div class="note good" id="s4-def">若对每个 <Katex tex="x\in D" /> 都有 <Katex tex="f(x)\le M" />，则 <Katex tex="M" /> 是<strong>上界</strong>；若都有 <Katex tex="f(x)\ge m" />，则 <Katex tex="m" /> 是<strong>下界</strong>。两种界都存在时，称函数<strong>有界</strong>。最小的上界叫<strong>上确界</strong>，最大的下界叫<strong>下确界</strong>。若某个 <Katex tex="x_0\in D" /> 的函数值恰好等于上确界或下确界，这个值就是相应的最大值或最小值。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBoundWall" />
      <div class="cap">图 S4 · <b>函数的有界性与最值</b>。用滑块移动金色界线，或切换上界、下界。红点给出越过界线的反例。打开「确界线」，观察曲线与虚线相接处是实心点还是空心点。</div>
    </div>

    <h3 class="sec" id="s4-thm">最值定理与确界的区分</h3>
    <p><strong>最值定理</strong>保证连续函数在闭区间 <Katex tex="[a,b]" /> 上能取到最大值和最小值。例①的 <Katex tex="x^2" /> 在 <Katex tex="x=0" /> 取最小值，在两个端点取最大值。例②和例③的定义区间都有缺失的端点，结果却不同：例②两端的函数值都趋于有限数；例③在 <Katex tex="x\to0^+" /> 时函数值趋于正无穷。</p>
    <p>求最值时，可以先用单调性缩小范围，再比较区间内的临界点与已包含的端点。对没有包含的端点，要检查单侧极限，并确认该极限值是否在区间内的其他位置取到。</p>

    <h3 class="sec" id="s4-warn">三处易错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>有界的函数也可能没有最值。</strong>例②中，对每个 <Katex tex="x\in(0,1)" /> 都有 <Katex tex="0&lt;f(x)&lt;1" />。上下确界分别是 <Katex tex="1" /> 和 <Katex tex="0" />，两个值都取不到。</li>
        <li><strong>同一个最值可以在多处取到。</strong>把例①的定义域改成 <Katex tex="(-2,2]" />，虽然去掉了左端点，右端点仍满足 <Katex tex="f(2)=4" />。若再去掉右端点，<Katex tex="4" /> 才只剩上确界；两次修改都保留了最小值 <Katex tex="f(0)=0" />。</li>
        <li><strong>分别检验上下两侧。</strong>例③中，<Katex tex="x\to0^+" /> 时 <Katex tex="1/x^2\to+\infty" />，所以没有上界；另一侧则有 <Katex tex="f(x)\ge\tfrac14" />，且 <Katex tex="f(2)=\tfrac14" />，因此存在最小值。</li>
      </ul>
    </div>
    <p>闭区间上的连续函数一定取到最大值和最小值。开区间上的函数是否取到界，则需要检查达到界的输入是否属于定义域。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBoundWall } from '../../../boards/functions/properties/boundwall.js';
import { S_CHAPTERS } from './snav.js';
</script>

<style src="../concept/function-picker.css"></style>
