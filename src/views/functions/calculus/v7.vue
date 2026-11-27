<template>
  <ChPage :cur="7" no="V7" base="/functions/v" :chapters="V_CHAPTERS"
    title="从求和到积分：$n^2$ 到 $x^2$" sub="把平方和除以 n³，得到 [0,1] 上 x² 的右端点黎曼和。"
    :toc="[{ id: 'v7-sum', t: '三个求和公式：差分累加' }, { id: 'v7-scale', t: '缩比：金字塔 ÷ $n^3$' }, { id: 'v7-limit', t: '极限就是面积' }, { id: 'v7-pit', t: '量纲与 $1/(\\alpha+1)$' }]">
    <div class="note good" id="v7-law"><strong>平方和及其缩比极限</strong>：<Katex tex="\sum_{k=1}^{n}k^2=\dfrac{n(n+1)(2n+1)}{6}" />；把 [0,1] 均分 n 份取右端点作矩形和，<Katex tex="R_n=\dfrac{1}{n^3}\sum_{k=1}^{n}k^2=\dfrac{(n+1)(2n+1)}{6n^2}=\dfrac{1}{3}+\dfrac{1}{2n}+\dfrac{1}{6n^2}\ \to\ \dfrac{1}{3}" />，而 <Katex tex="\dfrac{1}{3}=\int_0^1x^2\,\mathrm{d}x" /> —— 离散求和的极限就是积分。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSum" />
      <div class="cap">图 V7 · <b>平方和与定积分</b>。两图按列对齐。上图第 k 根条表示 k²，下图第 k 个矩形面积为 k²/n³。增大 n，观察右端点和如何接近 1/3。</div>
    </div>

    <h3 class="sec" id="v7-sum">三个求和公式：差分累加</h3>
    <p>求和公式是「离散世界的积分表」，高中常用的三个：<Katex tex="\sum_{k=1}^{n}1=n" />、<Katex tex="\sum_{k=1}^{n}k=\dfrac{n(n+1)}{2}" />（高斯配对：首尾相加和不变）、<Katex tex="\sum_{k=1}^{n}k^2=\dfrac{n(n+1)(2n+1)}{6}" />。平方和公式的推导用<strong>差分累加</strong>：注意到 <Katex tex="(k+1)^3-k^3=3k^2+3k+1" />，对 k=1..n 求和，左边望远镜式消项：</p>
    <p><Katex display tex="\sum_{k=1}^{n}\bigl[(k+1)^3-k^3\bigr]=(n+1)^3-1=3\sum k^2+3\sum k+n" />，移项整理即得 <Katex tex="\sum k^2=\dfrac{n(n+1)(2n+1)}{6}" />（代入 n=8 验算：1+4+9+⋯+64=204=8·9·17/6 ✓，图 V7 的求和徽章现场核验）。同一推导再用一次得到推论：<Katex tex="\sum k^3=\Bigl[\dfrac{n(n+1)}{2}\Bigr]^2" /> —— 立方和等于「和的平方」。</p>

    <h3 class="sec" id="v7-scale">缩比：金字塔 ÷ <Katex tex="n^3"/></h3>
    <p>图 V7 上栏是「离散总量」：n 根条，第 k 根高 <Katex tex="k^2"/>。要接进连续世界，先归一化：令 <Katex tex="x=k/n\in[0,1]"/>，条高除以 <Katex tex="n^2"/> 变成 <Katex tex="(k/n)^2"/>，再配上宽度 <Katex tex="1/n"/> —— 于是上栏整体除以 <Katex tex="n^3"/>：</p>
    <p><Katex display tex="R_n=\sum_{k=1}^{n}\dfrac{1}{n}\Bigl(\dfrac{k}{n}\Bigr)^2=\dfrac{1}{n^3}\sum_{k=1}^{n}k^2" /></p>
    <p>金字塔÷<Katex tex="n^3"/> 精确等于下栏右端点矩形面积和，两栏逐列对齐就是这句话的几何解释 —— 同一轮廓，一个在计平方和、一个在量面积。右端点采样的矩形顶高于曲线（<Katex tex="x^2"/> 单增），高估的金边面积恰是 <Katex tex="R_n-\dfrac{1}{3}=\dfrac{1}{2n}+\dfrac{1}{6n^2}" />：n 翻倍、主误差减半，图上金边肉眼可见地消失。</p>

    <h3 class="sec" id="v7-limit">极限就是面积</h3>
    <p>把公式拆成三段：<Katex tex="R_n=\dfrac{1}{3}+\dfrac{1}{2n}+\dfrac{1}{6n^2}" /> —— 后两项是离散化误差，n→∞ 时归零，剩下 1/3。这一步就是<strong>定积分的定义动作</strong>：<Katex tex="\int_0^1x^2\,\mathrm{d}x=\lim_{n\to\infty}\sum_{k=1}^{n}f(x_k)\,\Delta x" />，Δx=1/n。</p>
    <p>同一台机器换函数就能导出通式：<Katex tex="\sum k\div n^2\to\dfrac{1}{2}"/>（对应 <Katex tex="\int_0^1x\,\mathrm{d}x=\dfrac{1}{2}"/>）、<Katex tex="\sum k^3\div n^4\to\dfrac{1}{4}"/>（<Katex tex="\int_0^1x^3\,\mathrm{d}x=\dfrac{1}{4}"/>），一般地 <Katex tex="\dfrac{1}{n^{\alpha+1}}\sum_{k=1}^{n}k^\alpha\to\dfrac{1}{\alpha+1}" />（<Katex tex="\alpha>-1"/>），即 <Katex tex="\int_0^1x^\alpha\,\mathrm{d}x=\dfrac{1}{\alpha+1}" /> —— 极限只保留「最高次项系数 ÷（指数+1）」的结构，与 V8 将给出的原函数 <Katex tex="x^{\alpha+1}/(\alpha+1)"/> 完全重合：求和的极限与求导的逆运算，在同一个数上得出同一结果。</p>

    <h3 class="sec" id="v7-pit">量纲与 <Katex tex="1/(\alpha+1)"/></h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：缩比幂次错位。</strong><Katex tex="\sum k^2"/> 的量级是 <Katex tex="n^3/3"/>（n 根条、每根 <Katex tex="\sim n^2"/>）—— 缩比必须是 <Katex tex="n^3"/>：÷<Katex tex="n^2"/> 会发散（<Katex tex="\to\infty"/>）、÷<Katex tex="n^4"/> 会归零。先数清楚「几条、每条多高」，再定缩比。</li>
        <li><strong>提示二：左右端点不分。</strong>单增函数右端点高估、左端点低估（V8 的对照表复用），但两者极限相同 —— 差只有 <Katex tex="1/n"/> 量级；答题时写清用的哪端。</li>
        <li><strong>提示三：通式越界推广。</strong><Katex tex="\alpha=-1"/> 时 <Katex tex="\sum 1/k"/> 是调和级数（发散），<Katex tex="x^{-1}"/> 在 [0,1] 的积分也不存在 —— 括号里的「<Katex tex="\alpha>-1"/>」是硬约束，不是参考意见。</li>
      </ul>
    </div>
    <p>平方和公式使这个黎曼和可以直接计算。下一讲将用一般连续函数介绍同样的分割方法，并说明如何用原函数计算定积分。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSum } from '../../../boards/functions/calculus/sumsq.js';
import { V_CHAPTERS } from './vnav.js';
</script>

<style src="../properties/preset-row.css"></style>
