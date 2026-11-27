<template>
  <ChPage :cur="4" no="E4" base="/functions/e" :chapters="E_CHAPTERS"
    title="指数函数：增速由底数定" sub="指数函数的相对变化率是 ln a。底数大于 1 时递增，介于 0 与 1 之间时递减。"
    :toc="[{ id: 'e4-def', t: '定义与五条性质（图 E4）' }, { id: 'e4-fast', t: '增速由底数定：f′ 与函数值成正比' }, { id: 'e4-beat', t: '指数终胜与排除案' }]">
    <div class="note good" id="e4-def"><strong>指数函数</strong>：<Katex tex="y=a^x\ (a&gt;0,\ a\ne 1)" />（底是常数、指数是自变量 —— 与幂函数恰好「字母换位」）。性质五条：定义域 <Katex tex="\mathbb{R}" />、值域 <Katex tex="(0,+\infty)" />（永远为正！）、恒过 (0,1)、a&gt;1 时 R 上递增 / 0&lt;a&lt;1 时递减、x 轴（y=0）是水平渐近线。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGrow" />
      <div class="cap">图 E4 · <b>指数函数</b>。实线是当前底数的曲线，虚线是对照。先把探针放在 <Katex tex="x=1" />，拖动底数，看实线怎样经过 <Katex tex="(1,a)" />；再移到 <Katex tex="x=-1" />，观察曲线的高低次序如何反转。关闭「对照曲线」可以单独观察当前曲线。</div>
    </div>

    <h3 class="sec" id="e4-fast">增速由底数定：f′ 与函数值成正比</h3>
    <p>横坐标每增加 1，函数值乘以 a，增量为 <Katex tex="(a-1)a^x" />。瞬时变化率是 <Katex tex="f'(x)=a^x\ln a" />，相对变化率为 <Katex tex="\ln a" />。若 a 大于 1，导数为正且递增。若 a 介于 0 与 1 之间，导数为负并向 0 递增。</p>
    <p><Katex tex="0<a<1" /> 时 <Katex tex="\ln a<0" />：<Katex tex="f'<0" /> 但 <strong><Katex tex="|f'|" /> 递减</strong> —— 曲线下降却越降越缓，无限接近 x 轴、趋于 0，但永不真正等于 0（值域 (0,+∞)，水平渐近线）。把 <Katex tex="y=a^x" /> 与 <Katex tex="y=(1/a)^x" /> 画在同框，两者关于 y 轴对称（<Katex tex="a^{-x}=(1/a)^x" />）—— E8 的 <Katex tex="f(|x|)" /> 将把这对镜像折成一帧。</p>

    <h3 class="sec" id="e4-beat">指数终胜与排除案</h3>
    <p>对任意 <Katex tex="a>1" /> 和固定正数 <Katex tex="\alpha" />，<Katex tex="a^x/x^\alpha" /> 随 x 趋于正无穷而趋于无穷。局部大小关系需要分别计算。<Katex tex="2^x" /> 在 x=1 时大于 <Katex tex="x^2" />，在 x=3 时小于它，而到 x=10 时又超过它。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="a=1" /> 排除。</strong><Katex tex="y=1^x=1" /> 是常数函数，「指数函数」要求 <Katex tex="a\ne 1" /> —— 否则五条性质里「增减性」一条失效（图 E4 ④）。</li>
        <li><strong>提示二：底不许取负数或零。</strong>若 <Katex tex="a=-2" />，<Katex tex="(-2)^{1/2}" /> 没有实数意义 —— 定义域将出现大量缺口，所以规定 <Katex tex="a>0" />。</li>
        <li><strong>提示三：把「过 <Katex tex="(0,1)" />」记成「过 <Katex tex="(1,0)" />」。</strong>后者是对数（E5）—— 指数与对数的一切恰好互换，E6 的反演镜会把这条界线画成一条 <Katex tex="45^\circ" /> 的折缝。</li>
      </ul>
    </div>
    <p>回收与预告：S2 导数判据第一次启用 <Katex tex="f'" />，这里 <Katex tex="f'=\ln a\cdot f" /> 是它最典型的一次应用；E3 的幂函数族与本章「字母换位」对照记忆 —— <Katex tex="x^{\alpha}" /> 恒过 <Katex tex="(1,1)" />、<Katex tex="a^x" /> 恒过 <Katex tex="(0,1)" />，不要混淆。E5 将讲对数（E4 的逆运算）；E6 用 <Katex tex="y=x" /> 作镜子说明两者互为反函数；V1 从割线到切线，会把 <Katex tex="\ln a" /> 这个「比例系数」正式认定为导数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGrow } from '../../../boards/functions/elementary/expgrow.js';
import { E_CHAPTERS } from './enav.js';
</script>

<style src="../properties/preset-row.css"></style>
