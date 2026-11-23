<template>
  <ChPage :cur="4" no="S4" base="/functions/s" :chapters="S_CHAPTERS"
    title="有界性与最值" sub="上界和下界约束函数值。取到上确界或下确界时，才有相应的最大值或最小值。"
    :toc="[{ id: 's4-def', t: '定义（图 S4）' }, { id: 's4-thm', t: '最值定理与确界' }, { id: 's4-warn', t: '三处易错' }]">
    <div class="note good" id="s4-def"><strong>上界</strong>：存在常数 <Katex tex="M" />，使得对定义域 D 内<strong>任意</strong> <Katex tex="x" /> 都有 <Katex tex="f(x)\le M" />（下界把不等号反过来）。既有上界又有下界称 f <strong>有界</strong>。<strong>最大值</strong>：存在 <Katex tex="x_0\in D" /> 使 <Katex tex="f(x_0)\ge f(x)" /> 对任意 <Katex tex="x\in D" /> 成立 —— 关键在 <Katex tex="x_0" /> <strong>真的取到</strong>。最小上界叫<strong>上确界</strong>：取到了，上确界就是最大值；取不到，就只有界没有最值。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBoundWall" />
      <div class="cap">图 S4 · <b>函数的有界性与最值</b>。拖动水平界线，对比闭区间的实心端点和开区间的空心端点，再观察无上界的倒数平方函数。</div>
    </div>

    <h3 class="sec" id="s4-thm">最值定理与确界的区分</h3>
    <p><strong>最值定理（闭区间连续函数）</strong>：f 在闭区间 [a,b] 上连续，则必存在最大值与最小值。条件拆开看 —— <strong>闭</strong>保证端点包含在区间内（② 的 (0,1) 两端全开，界取不到）；<strong>连续</strong>保证图象不断档（图 R 系要演的「跳变绕过零点」就是断档的代价）；<strong>区间</strong>保证活动范围有边（③ 无上界）。三个条件各保证一件事，图 S4 三个预设恰好各去掉一件。</p>
    <p>求最值的两条主路：<strong>单调性路线</strong> —— 单调函数的最值只在区间端点（② 若改成 <Katex tex="[0,1]" /> 立刻两端取到）；<strong>临界点路线</strong> —— 先找 <Katex tex="f'=0" /> 的临界点（图 S2 的金点），再与端点值比较取最大最小（① 的 <Katex tex="x=0" /> 与 <Katex tex="x=\pm 2" /> 三点核验）。E2 二次函数区间最值、V3 极值判定，走的都是这两条路。</p>

    <h3 class="sec" id="s4-warn">三处易错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：有界 ≠ 有最值。</strong>② 的 f(x)=x 在 (0,1) 上被 1 拦得死死的（有上界、有下界），但最大值最小值都不存在 —— 「任意接近」不等于「取到」。答案里写「最大值 1」就是把上确界错认成最大值，图 S4 的空心端点就是扣分现场。</li>
        <li><strong>提示二：区间开闭直接决定最值是否存在。</strong>① 的 <Katex tex="[-2,2]" /> 改成 <Katex tex="(-2,2]" />：最大值立刻消失（<Katex tex="x=\pm 2" /> 取不到了），最小值还在（<Katex tex="x=0" /> 在范围内）。端点是否闭，比函数表达式本身更关键 —— 读题先画端点实心/空心，图 C4 的约定在这里复发。</li>
        <li><strong>提示三：无上界时硬找最大值。</strong>③ 的 <Katex tex="1/x^2" /> 在 <Katex tex="(0,2]" /> 上，图象沿渐近线 <Katex tex="x=0" /> 趋于无穷 —— 最大值不存在；但下界 <Katex tex="1/4" /> 恰在 <Katex tex="x=2" /> 取到。<strong>有上界、有下界、有最值是三件独立的事</strong>，不要合并成「有界所以有最值」。</li>
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
