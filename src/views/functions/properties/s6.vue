<template>
  <ChPage :cur="6" no="S6" base="/functions/s" :chapters="S_CHAPTERS"
    title="周期性专题：平移重合与对称换算" sub="周期让定义域和函数值一同复现。对称变换的复合可以产生平移。"
    :toc="[{ id: 's6-def', t: '定义与验收（图 S6）' }, { id: 's6-thm', t: '对称换算两条定理' }, { id: 's6-ext', t: '延拓机与最小正周期' }]">
    <div class="note good" id="s6-def"><strong>周期</strong>：设 <Katex tex="T\ne0" />。若定义域平移 T 后保持相同，且对每个允许的 x 都有 <Katex tex="f(x+T)=f(x)" />，则 T 是一个周期。非零整数倍 kT 也是周期。最小正周期存在时记作 <Katex tex="T_0" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPeriodCopy" />
      <div class="cap">图 S6 · <b>函数的周期性</b>。拖动平移量，对比半周期和整周期时的图象。切换双轴与轴心示例，检查对称间距与周期的关系。</div>
    </div>

    <h3 class="sec" id="s6-thm">对称换算两条定理</h3>
    <p><strong>两条对称轴。</strong>若对称轴为 <Katex tex="x=a" /> 和 <Katex tex="x=a+d" />，且 <Katex tex="d\ne0" />，则 <Katex tex="2d" /> 是一个周期。在等式中依次用两条轴的反射关系：</p>
    <Katex tex="f(x+2d)=f(2a-x)=f(x)" display />
    <p><strong>一条对称轴和一个对称中心。</strong>若对称轴为 <Katex tex="x=a" />，对称中心为 <Katex tex="(a+d,0)" />，且 <Katex tex="d\ne0" />，一次轴反射和一次中心反射给出 <Katex tex="f(x+2d)=-f(x)" />。再平移一次可得 <Katex tex="f(x+4d)=f(x)" />，所以 <Katex tex="4d" /> 是一个周期。两条定理得到的周期是否最小，需要另外证明。</p>

    <h3 class="sec" id="s6-ext">延拓机与最小正周期</h3>
    <p>把实轴上的每个 x 平移到一个长度为周期 T 的基本区间，即可读取同一个函数值。证明某个 T 是最小正周期还需排除所有更短的正平移，检查半周期只验证其中一个候选。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示：把「有对称轴」当成「有周期」。</strong>一条对称轴只给对称、不给周期 —— 定理一要<strong>两条</strong>轴、定理二要轴心<strong>成对</strong>；<Katex tex="f(x)=x^2" /> 关于 y 轴对称却没有周期（没有第二条轴）。另一个方向也不通：有周期不代表有对称轴（④ 的周期延拓故意用不对称的基本段）。周期与对称是两种重合方式 —— 平移与翻折 —— 谁也不包含谁，只能互相换算。</li>
      </ul>
    </div>
    <p>定义在整个实轴上的连续周期函数，可以在长度为一个周期的闭区间内取得最大值和最小值。由周期性，这两个值也是全域的最值。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPeriodCopy } from '../../../boards/functions/properties/periodcopy.js';
import { S_CHAPTERS } from './snav.js';
</script>
