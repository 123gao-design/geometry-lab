<template>
  <ChPage :cur="1" no="次1" base="/inequalities/q" :chapters="Q_CHAPTERS"
    title="二次函数、方程与不等式" sub="二次函数的图象、二次方程的根、二次不等式的解集是同一事实的三种读法：图象与 x 轴的位置关系（Δ 三态）决定根的存在，根的位置切分数轴、每段符号恒定，解集由此读出。标准流程：化标准形 → 算 Δ 与两根 → 按开口画示意图 → 从图上读解集 —— 图不离手，是这一章的全部要领。"
    :toc="[{ id: 'q1-delta', t: 'Δ 三态与根' }, { id: 'q1-read', t: '解集读法：根外与根内' }, { id: 'q1-param', t: '含参讨论的三个层面' }, { id: 'q1-always', t: '恒成立与图象条件' }, { id: 'q1-pit', t: '漏开口、漏判别式、漏端点' }]">
    <div class="note good" id="q1-law"><Katex tex="a>0" /> 时：<Katex tex="f(x)>0\iff x<x_1\ \text{或}\ x>x_2" />（根外），<Katex tex="f(x)<0\iff x_1<x<x_2" />（根内）；<Katex tex="a<0" /> 时全部反转。<Katex tex="\Delta=0" />：解集退化为一点（≤）或除一点外的全体（&gt;）。<Katex tex="\Delta<0" />：解集只有 <Katex tex="\mathbb{R}" /> 与 <Katex tex="\varnothing" /> 两态。</div>
    <div class="board-wrap">
      <BoardMount :factory="createQS" />
      <div class="cap">图 次1 · <b>二次不等式的解集</b> · 切换四种不等号，观察根处的空心与实心端点。选「重根」比较 <Katex tex="f(x)>0"/> 和 <Katex tex="f(x)\ge0"/>，两幅图只相差轴上的一个点。</div>
    </div>

    <h3 class="sec" id="q1-delta">Δ 三态与根</h3>
    <p><Katex tex="\Delta>0" />：抛物线与 x 轴交于两点，两不等实根；<Katex tex="\Delta=0" />：相切于一点，重根；<Katex tex="\Delta<0" />：相离，无实根。方程的根即函数的零点（R1 零点三语言在二次情形的具体化），而根的核心作用是<strong>切分数轴</strong>：相邻两根之间 f(x) 符号恒定（连续函数的介点性质，S2 单调染色用过同一事实）。解不等式就是把这个符号分布读出来。</p>

    <h3 class="sec" id="q1-read">解集读法：根外与根内</h3>
    <p><Katex tex="a>0" />、<Katex tex="\Delta>0" /> 时：开口向上、两根之外图象在 x 轴上方 —— <Katex tex="f(x)>0" /> 取根外两段、<Katex tex="f(x)<0" /> 夹在根内一段；<Katex tex="a<0" /> 时图象倒扣，结论全部反转 —— 或者先把两边同乘 −1 化成 <Katex tex="a>0" />（乘负反序，性1 的规则在此正确使用）。<Katex tex="\Delta=0" />（a&gt;0）：f 恒非负、仅在根处取 0 —— 「&gt;」的解集是「除一点外的全体」，「≤」退化为一点。<Katex tex="\Delta<0" />（<Katex tex="a>0"/>）：f 恒正，「<Katex tex=">"/>」与「<Katex tex="\ge"/>」解集为 <Katex tex="\mathbb{R}"/>，「<Katex tex="<"/>」与「<Katex tex="\le"/>」为 <Katex tex="\varnothing"/>。图 次1 的金带与空心 / 实心根把四种不等号一并演示。</p>

    <h3 class="sec" id="q1-param">含参讨论的三个层面</h3>
    <p>含参二次不等式的讨论固定在三个层面展开：① 二次项系数 a 是否为零（形如 <Katex tex="ax^2+(a-1)x-a>0" /> 的题先查 a=0 的一次退化）；② Δ 的符号（根的存在与个数）；③ 两根的大小次序（解集区间的左右端点）。例：<Katex tex="x^2-(2a+1)x+a^2+a<0" /> 分解为 <Katex tex="(x-a)\bigl(x-(a+1)\bigr)<0" />，两根天然有序，解集 <Katex tex="a<x<a+1" /> 免讨论；反例 <Katex tex="x^2-ax+1<0" /> 须按 <Katex tex="\Delta=a^2-4" /> 分三类（无解 / 一点 / 区间）。含参讨论是本章综合性的集中体现。</p>

    <h3 class="sec" id="q1-always">恒成立与图象条件</h3>
    <p>「<Katex tex="f(x)>0" /> 对一切 <Katex tex="x\in\mathbb{R}" /> 恒成立」⟺ <Katex tex="a>0" /> 且 <Katex tex="\Delta<0" />（图象整条悬在 x 轴上方，图 次1 预设③）；「在区间 [m,n] 上恒成立」则化为区间最值问题 —— E2 的二次区间最值：闭区间上只须比较端点与顶点的值。反向题型「已知解集求参数」用韦达定理把解集端点翻译成 <Katex tex="x_1+x_2=-\tfrac ba" />、<Katex tex="x_1x_2=\tfrac ca" /> 两式。这一节是 V 系列「由不等式反求参数」大题的方法库。</p>

    <h3 class="sec" id="q1-pit">漏开口、漏判别式、漏端点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：忘开口方向套口诀。</strong>「大于取两边」只对 <Katex tex="a>0" /> 成立 —— 图 次1 预设④ 开口向下时全部反转。</li>
        <li><strong>提示二：解集为 ℝ / ∅ 时漏搭配条件。</strong>「<Katex tex="f(x)>0" /> 恒成立」须 <strong>同时</strong>验 <Katex tex="a>0" /> 与 <Katex tex="\Delta<0" />，只验其一就会把 a&lt;0、Δ&lt;0（恒负）误判成恒正。</li>
        <li><strong>提示三：端点开闭。</strong><Katex tex="f(x)=0" /> 的点在「<Katex tex=">"/>」下不可取、在「<Katex tex="\ge"/>」下可取（Y4 端点开闭的同一检验）—— 严格与不严格一字之差，端点两种归属。</li>
      </ul>
    </div>
    <p>根切分数轴、每段定号 —— 把这个事实从二次推广到任意次与分式，就是下一章的穿根法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQS } from '../../../boards/inequalities/quad/quadsolve.js';
import { Q_CHAPTERS } from './qnav.js';
</script>
