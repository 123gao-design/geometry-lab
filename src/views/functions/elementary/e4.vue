<template>
  <ChPage :cur="4" no="E4" base="/functions/e" :chapters="E_CHAPTERS"
    title="指数函数：增速由底数定" sub="$y=a^x$（$a>0$，$a\ne 1$）—— 增长率与函数值成正比：$f'=\ln a\cdot a^x$，增速由底数定：$a>1$ 增、$0<a<1$ 减。"
    :toc="[{ id: 'e4-def', t: '定义与五条性质（图 E4）' }, { id: 'e4-fast', t: '增速由底数定：f′ 与函数值成正比' }, { id: 'e4-beat', t: '指数终胜与排除案' }]">
    <div class="note good" id="e4-def"><strong>指数函数</strong>：<Katex tex="y=a^x\ (a&gt;0,\ a\ne 1)" />（底是常数、指数是自变量 —— 与幂函数恰好「字母换位」）。性质五条：定义域 <Katex tex="\mathbb{R}" />、值域 <Katex tex="(0,+\infty)" />（永远为正！）、恒过 (0,1)、a&gt;1 时 R 上递增 / 0&lt;a&lt;1 时递减、x 轴（y=0）是水平渐近线。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGrow" />
      <div class="cap">图 E4 · <b>指数函数</b>：<Katex tex="y=a^x" /> 单栏全景 —— 探针向两轴作投影垂线直读坐标，徽章里 <Katex tex="f'=\ln a\cdot a^x" /> 与 f 只差常数倍 <Katex tex="\ln a" />（导数不另占一栏）。④ 预设 <Katex tex="a=1" /> 看排除反例；② 减半衰减时 <Katex tex="f'<0" /> 且 <Katex tex="|f'|" /> 趋 0 —— 曲线贴近 x 轴而放平，底数只影响快慢。</div>
    </div>

    <h3 class="sec" id="e4-fast">增速由底数定：f′ 与函数值成正比</h3>
    <p>对 a&gt;1，每右移一个单位，函数值乘上 a：从 x 到 x+1，增量是 <Katex tex="a^{x+1}-a^x=(a-1)\,a^x" /> —— <strong>增量与当前值成正比</strong>。用 S2 的导数语言说：<Katex tex="f'(x)=\ln a\cdot a^x" />，于是 <Katex tex="\dfrac{f'}{f}=\ln a" /> 为定值 —— <strong>增速完全由底数 a 决定</strong>：a&gt;1 时增速递增、0&lt;a&lt;1 时其为负而递减。底数越大、增长越快，增长越快累积越多 —— 这就是 a&gt;1 时越走越陡的全部代数原因，也是图 E4 探针右移时 f′ 读数同步抬升的原因。对比 E3：x^α 的导数 <Katex tex="\alpha x^{\alpha-1}" /> 随 x 衰减（α&lt;1 时）或缓慢增长（α&gt;1 时），增速都不与函数值成正比 —— 这是指数区别于幂函数的本质。</p>
    <p><Katex tex="0<a<1" /> 时 <Katex tex="\ln a<0" />：<Katex tex="f'<0" /> 但 <strong><Katex tex="|f'|" /> 递减</strong> —— 曲线下降却越降越缓，无限接近 x 轴、趋于 0，但永不真正等于 0（值域 (0,+∞)，水平渐近线）。把 <Katex tex="y=a^x" /> 与 <Katex tex="y=(1/a)^x" /> 画在同框，两者关于 y 轴对称（<Katex tex="a^{-x}=(1/a)^x" />）—— E8 的 <Katex tex="f(|x|)" /> 将把这对镜像折成一帧。</p>

    <h3 class="sec" id="e4-beat">指数终胜与排除案</h3>
    <p>「指数爆炸」不是修辞：<Katex tex="x=10" /> 时 <Katex tex="2^{10}=1024&gt;10^2=100" />；<Katex tex="x=30" /> 时 <Katex tex="2^{30}\approx 10" /> 亿，而 <Katex tex="x^2" /> 才 900 —— 任何 <Katex tex="a>1" /> 的 <Katex tex="a^x" /> 最终压倒任何 <Katex tex="x^{\alpha}" />。但注意「终胜」不等于「先胜」：<Katex tex="x&lt;4" /> 时 <Katex tex="x^2" /> 一直大于 <Katex tex="2^x" />，两条曲线在 (4, 16) 与别处还有交点 —— 起点低而增长快，是指数增长的特征。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="a=1" /> 排除。</strong><Katex tex="y=1^x=y=1" /> 是常数函数，「指数函数」要求 <Katex tex="a\ne 1" /> —— 否则五条性质里「增减性」一条失效（图 E4 ④）。</li>
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
