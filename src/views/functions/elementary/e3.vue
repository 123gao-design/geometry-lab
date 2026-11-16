<template>
  <ChPage :cur="3" no="E3" base="/functions/e" :chapters="E_CHAPTERS"
    title="幂函数：α 曲线族" sub="$y=x^{\alpha}$ —— 一个 $\alpha$ 走遍全族：抛物线、直线、根式、常数、双曲线五种类型，全部在 $(1,1)$ 交汇；负底数开不出偶次方，是定义域的首要限制。"
    :toc="[{ id: 'e3-family', t: '五档分类与恒过点（图 E3）' }, { id: 'e3-neg', t: '负底数：定义域的首要限制' }, { id: 'e3-cmp', t: '(1,1) 交点：曲线高低的次序规律' }]">
    <div class="note good" id="e3-family"><strong>幂函数</strong>：<Katex tex="y=x^{\alpha}" />（形如「底是自变量、指数是常数」）。全族无论 <Katex tex="\alpha" /> 取多少，都<strong>恒过 <Katex tex="(1,1)" /></strong>；<Katex tex="\alpha>0" /> 的还过 <Katex tex="(0,0)" />。按 <Katex tex="\alpha" /> 分五档：<Katex tex="\alpha>1" /> 抛物线型（越走越陡）、<Katex tex="\alpha=1" /> 直线（<Katex tex="45^\circ" />）、<Katex tex="0<\alpha<1" /> 根式型（起步陡、越走越缓）、<Katex tex="\alpha=0" /> 常数 <Katex tex="y=1" />（<Katex tex="x\ne 0" />）、<Katex tex="\alpha<0" /> 双曲线型（x 越大越贴 0，双渐近线 <Katex tex="x=0" />、<Katex tex="y=0" />）。在 (0,+∞) 上：<Katex tex="\alpha>0" /> 全体递增、<Katex tex="\alpha<0" /> 递减。</div>
    <div class="board-wrap">
      <BoardMount :factory="createFamily" />
      <div class="cap">图 E3 · <b>幂函数曲线族</b>：单栏全景，每条 α 曲线一个身份色 —— 拖滑块 α 变形，选中成员加粗亮出本命色。滑块 α 连续变形（⅓ 用立方根才有左支），「曲线族」开关淡显 α=−2…3 的八位成员；α&lt;0 时渐近线现身。</div>
    </div>

    <h3 class="sec" id="e3-neg">负底数：定义域的首要限制</h3>
    <p>幂函数的定义域由「负底数能不能开方」决定：<strong>整数指数</strong>（如 <Katex tex="\alpha=2,\ 3,\ -1" />）对一切 <Katex tex="x" /> 都有意义（<Katex tex="(-2)^3=-8" /> 合法）；<strong>分母为奇数的最简分数指数</strong>（如 <Katex tex="\alpha=\tfrac{1}{3}" />）也可以（<Katex tex="(-8)^{1/3}=-2" />，立方根对负数有定义）；其余 —— <Katex tex="\alpha=\tfrac{1}{2}" />（平方根）、<Katex tex="\alpha=-\tfrac{1}{2}" />、以及一切无理指数 —— 在 <Katex tex="x<0" /> 处<strong>无定义</strong>（<Katex tex="(-4)^{1/2}" /> 没有实数答案）。图 E3 拖 <Katex tex="\alpha" /> 走过 0.5 与 <Katex tex="\tfrac{1}{3}" />，看左半轴一支有一支无。这又是 C3 的限制清单在指数位上的重演：定义域不对称，奇偶性（S3）便不再适用。</p>

    <h3 class="sec" id="e3-cmp">(1,1) 交点：曲线高低的次序规律</h3>
    <p>全族都过 (1,1)，于是<strong>交点两侧次序相反</strong>：当 0&lt;x&lt;1 时，α 越大曲线越<strong>低</strong>（如 <Katex tex="0.5^{2.5} &lt; 0.5^2 &lt; \sqrt{0.5}" />）；当 x&gt;1 时，α 越大越<strong>高</strong>（<Katex tex="3^{2.5} &gt; 3^2 &gt; \sqrt{3}" />）。图 E3 的分色正是为了看清曲线族如何从 (1,1) 向左右两侧展开。比较大小题因此有了通用画法：把两个函数画进同一张图比次序 —— 这比死记「指数大者大」安全得多，因为那句口诀在交点左侧恰好反序。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="x^{1/2}" /> 与 <Katex tex="x^{1/3}" /> 的定义域混为一谈。</strong>前者只在 <Katex tex="[0,+\infty)" />，后者是 R —— 「三分之一次方」对负数合法。</li>
        <li><strong>提示二：<Katex tex="\alpha=0" /> 时 <Katex tex="y=1" /> 且 <Katex tex="x\ne 0" />。</strong>0 的 0 次方没有定义，曲线在 <Katex tex="x=0" /> 处要挖一个洞（图 E3 的空心点）。</li>
        <li><strong>提示三：负指数在 <Katex tex="x=0" /> 处无定义。</strong><Katex tex="\alpha<0" /> 时 <Katex tex="x=0" /> 是竖直渐近线，「恒过 <Katex tex="(0,0)" />」只属于 <Katex tex="\alpha>0" /> 的成员。</li>
      </ul>
    </div>
    <p>回收与预告：C3 的定义域限制、S3 的奇偶判据都在本章复发（整数与奇分母指数的情形才可能具有对称性）；E2 的根分布主角 <Katex tex="y=x^2" /> 只是 <Katex tex="\alpha=2" /> 的特例。往前看：E4、E5 则把底数固定下来 —— <Katex tex="x^{\alpha}" /> 与 <Katex tex="a^x" /> 一字之差，一个指数动、一个底数动，性质截然不同；<Katex tex="x^{\alpha}" /> 对 <Katex tex="\alpha" /> 的连续变形在 <Katex tex="\alpha=0" /> 处断开，V 系列的 <Katex tex="\ln x" /> 正是从这一断开处引入的。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFamily } from '../../../boards/functions/elementary/powerfamily.js';
import { E_CHAPTERS } from './enav.js';
</script>
