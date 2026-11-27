<template>
  <ChPage :cur="1" no="C1" base="/functions/c" :chapters="C_CHAPTERS"
    title="映射与函数：对应的纪律" sub="从 $A$ 到 $B$ 的映射给 $A$ 中每个元素指定唯一的像。"
    :toc="[{ id: 'c1-map', t: '映射的定义（图 C1）' }, { id: 'c1-req', t: '三要求逐条核验' }, { id: 'c1-fn', t: '函数：数集上的映射' }, { id: 'c1-why', t: '为什么高中要换定义' }]">
    <p>邮资表、分段公式和图象都可以表示函数。判定时检查定义域中的每个输入是否有唯一的输出。</p>
    <div class="note good" id="c1-map"><strong>映射</strong>：设 <Katex tex="A" />、<Katex tex="B" /> 是两个<strong>非空集合</strong>，如果按某个确定的对应法则 <Katex tex="f" />，使得对 <Katex tex="A" /> 中<strong>任意</strong>一个元素 <Katex tex="x" />，在 <Katex tex="B" /> 中都有<strong>唯一确定</strong>的元素 <Katex tex="y" /> 与之对应，那么称 <Katex tex="f" /> 为从集合 <Katex tex="A" /> 到集合 <Katex tex="B" /> 的一个映射 <span class="term">(mapping)</span>，记作 <Katex tex="f:A\to B" />，并写 <Katex tex="x\mapsto y=f(x)" />。<Katex tex="y" /> 叫做 <Katex tex="x" /> 的<strong>像</strong>，<Katex tex="x" /> 叫做 <Katex tex="y" /> 的<strong>原像</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createArrowMap" />
      <div class="cap">图 C1 · <b>映射的四种对应</b>。切换四种对应，拖动输入滑块追踪箭头。检查每个输入是否恰好有一条出发箭头。</div>
    </div>

    <h3 class="sec" id="c1-req">三要求逐条核验</h3>
    <p>定义里加粗的两处 —— 「任意一个元素 <Katex tex="x" />」与「唯一确定的元素 <Katex tex="y" />」—— 正是映射的纪律所在。把它们拆开，对着图 C1 的四个按钮逐条核验：</p>
    <ul>
      <li><strong>完整性</strong>：<Katex tex="A" /> 中每个 <Katex tex="x" /> 都必须有像。图 ④ 里输入 <Katex tex="3" /> 没有像，不满足完整性；</li>
      <li><strong>单值性</strong>：每个 <Katex tex="x" /> 的像<strong>唯一</strong>。图 ③ 里输入 <Katex tex="1" /> 同时配了 <Katex tex="10" /> 和 <Katex tex="20" /> —— 「一个 <Katex tex="x" /> 算出两个 <Katex tex="y" />」，也不满足单值性；</li>
      <li><strong>不要求满</strong>：<Katex tex="B" /> 中允许有元素没人认领（图 ② 的 <Katex tex="30" />、<Katex tex="40" />）。映射管好 <Katex tex="A" /> 到 <Katex tex="B" /> 的方向，不保证把 <Katex tex="B" /> 用完。</li>
    </ul>
    <p>反过来，<Katex tex="B" /> 中两个不同元素可以共享同一个原像吗？不可以 —— 原像必须在 <Katex tex="A" /> 里，而 <Katex tex="A" /> 中每个 <Katex tex="x" /> 只配一个像。图 ② 中 <Katex tex="1" /> 和 <Katex tex="2" /> 都指向 <Katex tex="10" />，这是<strong>两个输入共享一个输出</strong>，完全合法。把「多对一」和「一对多」搞混，是映射判定题的第一大失分点：前者是函数的常见情形，后者连映射都不是。</p>

    <h3 class="sec" id="c1-fn">函数：数集上的映射</h3>
    <p>当 <Katex tex="A" />、<Katex tex="B" /> 都是<strong>非空数集</strong>（实数集的子集）时，这样的映射就叫做<strong>函数</strong> <span class="term">(function)</span>。三要素：<Katex tex="A" /> 是定义域；法则是 <Katex tex="f" />；值域 <Katex tex="C" /> 由法则对整个 <Katex tex="A" /> 扫一遍得出，且只能落在 <Katex tex="B" /> 里：</p>
    <Katex tex="f:A\to B,\qquad x\mapsto y=f(x),\qquad C=\{f(x)\mid x\in A\}\subseteq B" display />
    <p>注意那个「<Katex tex="\subseteq" />」：值域 <Katex tex="C" /> 是 <Katex tex="B" /> 的子集，不是 <Katex tex="B" /> 本身。图 ② 里 <Katex tex="A=\{1,2,3,4\}" />，<Katex tex="B=\{10,20,30,40\}" />，值域却只有 <Katex tex="\{10,20\}" /> —— <Katex tex="B" /> 给得再多，函数只对真正被取到的值负责。「值域 <Katex tex="\subseteq" /> 给定集合 <Katex tex="B" />」这个方向，在判断题里常考。</p>

    <h3 class="sec" id="c1-why">为什么高中要换定义</h3>
    <p>变量说的局限在于「过程」：它默认 <Katex tex="x" /> 连续地变、<Katex tex="y" /> 跟着连续地变。但对应说只关心<strong>配对</strong>，不管连续不连续：出租车计价是阶梯状的对应 —— 是函数；狄利克雷函数 <Katex tex="D(x)=\begin{cases}1&x\in\mathbb{Q}\\0&x\notin\mathbb{Q}\end{cases}" /> 图象根本画不出来、却严格满足对应说 —— 也是函数。定义宽了，能管的函数就多了，这正是对应说被采纳的原因。</p>
    <p>这套「对应」的读法将贯穿整个模块：<RouterLink class="xref" to="/functions/c2">三要素与同一函数</RouterLink>用它审「同一函数」，<RouterLink class="xref" to="/functions/c5">机器观与位移</RouterLink>把 <Katex tex="f" /> 读成一台<strong>机器</strong>（输入 <Katex tex="x" />，输出 <Katex tex="f(x)" />），而到了<RouterLink class="xref" to="/functions/s5">对称性专题：抽象式与翻译</RouterLink>，「<Katex tex="f" /> 把谁映给谁」就是翻译对称句式的通用方法。下一讲先给出判定方法：什么样的两个「函数」其实根本是同一个。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createArrowMap } from '../../../boards/functions/concept/arrowmap.js';
import { C_CHAPTERS } from './cnav.js';
</script>

<style src="../properties/preset-row.css"></style>
