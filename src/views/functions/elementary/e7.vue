<template>
  <ChPage :cur="7" no="E7" base="/functions/e" :chapters="E_CHAPTERS"
    title="对勾函数：一形两证" sub="在正半轴上，导数判据与均值不等式给出相同的最小值。"
    :toc="[{ id: 'e7-shape', t: '对勾的形状（图 E7）' }, { id: 'e7-proof', t: '一形两证：导数 × 均值' }, { id: 'e7-root', t: '判根与区间最值' }]">
    <div class="note good" id="e7-shape"><strong>对勾函数</strong>：<Katex tex="f(x)=ax+\dfrac{b}{x}" />（a,b&gt;0），定义域 <Katex tex="x\ne 0" />，渐近线 x=0 与斜渐近线 y=ax。<strong>奇函数</strong>（S3）：左支 = 右支绕原点转半圈。右支在 <Katex tex="\left(0,\sqrt{\tfrac{b}{a}}\right]" /> 递减、<Katex tex="\left[\sqrt{\tfrac{b}{a}},+\infty\right)" /> 递增，最小值 <Katex tex="f\left(\sqrt{\tfrac{b}{a}}\right)=2\sqrt{ab}" /> —— 两段一支勾，形状像对勾。</div>
    <div class="board-wrap">
      <BoardMount :factory="createHook" />
      <div class="cap">图 E7 · <b>对勾函数与水平线</b>。在第一例中，把 <Katex tex="c" /> 从 <Katex tex="-3" /> 调到 <Katex tex="3" />。先看左支的两个交点如何合为一个，再观察水平线穿过两支之间的空隙，最后与右支相切、相交。</div>
    </div>

    <h3 class="sec" id="e7-proof">一形两证：导数 × 均值</h3>
    <p><strong>导数证</strong>：<Katex tex="f'(x)=a-\dfrac{b}{x^2}" />，令 f′=0 得 <Katex tex="x^2=\dfrac{b}{a}" />，正根 <Katex tex="x=\sqrt{\tfrac{b}{a}}" />；又 <Katex tex="f''(x)=\dfrac{2b}{x^3}&gt;0" />（x&gt;0），故该点为极小，<Katex tex="f=2\sqrt{ab}" />。<strong>均值证</strong>：x&gt;0 时 ax 与 b/x 皆正，<Katex tex="ax+\dfrac{b}{x}\ge 2\sqrt{ax\cdot\dfrac{b}{x}}=2\sqrt{ab}" />，等号当且仅当 <Katex tex="ax=\dfrac{b}{x}" /> 即 <Katex tex="x=\sqrt{\tfrac{b}{a}}" />。两条路各自独立，却在<strong>同一个 x、同一个值</strong>得出同一结果 —— 这不是巧合：均值不等式的「等号条件」恰好是导数的驻点。一形两证、一证两用：考试里导数是通用方法，均值是快速途径，互相验算是最好的自检。</p>

    <h3 class="sec" id="e7-root">判根与区间最值</h3>
    <p>把方程 <Katex tex="ax+\dfrac{b}{x}=c" /> 两边乘 x：<Katex tex="ax^2-cx+b=0" />（<Katex tex="x\ne 0" /> 天然排除伪根），<Katex tex="\Delta=c^2-4ab" /> —— 于是图 E7 的水平线 <Katex tex="y=c" /> 与对勾的交点数完全由 <Katex tex="\Delta" /> 判定：<Katex tex="|c|&gt;2\sqrt{ab}" /> 两根（<Katex tex="c>0" /> 落右支、<Katex tex="c<0" /> 落左支）、<Katex tex="c=\pm2\sqrt{ab}" /> 相切于顶点、其余无解。这正是 R1 三语言的应用题版：<Katex tex="f(x)=c" /> 的根 = 曲线与水平线的交点横坐标。区间最值则是 E2 的升级：在 [p,q]（<Katex tex="0<p<q" />）上，顶点 <Katex tex="\sqrt{b/a}" /> 在不在区间内，判定随之不同 —— 但「近端点」要换成「沿对勾的走向比较 <Katex tex="f(p)" /> 与 <Katex tex="f(q)" />」，因为对勾不是抛物线，距离语言不再现成（V3 的 <Katex tex="f'" /> 符号表才是通解）。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：均值不等式用在左支。</strong><Katex tex="x<0" /> 时 <Katex tex="ax" /> 与 <Katex tex="b/x" /> 皆负，均值不等式（要求正数）直接失效 —— 左支用奇函数镜像：<Katex tex="f(x)=-(|a||x|+\tfrac{b}{|x|})\le-2\sqrt{ab}" />，最大值 <Katex tex="-2\sqrt{ab}" />。</li>
        <li><strong>提示二：定义域挖了 <Katex tex="x=0" /> 却忘了渐近线。</strong>对勾在 <Katex tex="x\to 0" /> 处趋于 <Katex tex="\pm\infty" />，区间最值若含 <Katex tex="x=0" /> 附近要单独审。</li>
        <li><strong>提示三：均值取等 <Katex tex="\ne" /> 导数为零的混淆。</strong>两者在对勾上恰好同点，但在一般函数上是相互独立的条件 —— 不要把「等号条件」当成万能的驻点条件。</li>
      </ul>
    </div>
    <p>正支有最小值。整个函数为奇函数，因此负支有相应的最大值。限制到某个闭区间时，还需比较端点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHook } from '../../../boards/functions/elementary/hookproof.js';
import { E_CHAPTERS } from './enav.js';
</script>

<style src="../properties/preset-row.css"></style>
