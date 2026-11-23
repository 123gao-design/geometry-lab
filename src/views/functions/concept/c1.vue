<template>
  <ChPage :cur="1" no="C1" base="/functions/c" :chapters="C_CHAPTERS"
    title="映射与函数：对应的纪律" sub="从 A 到 B 的映射给 A 中每个元素指定唯一的像。"
    :toc="[{ id: 'c1-map', t: '映射的定义（图 C1）' }, { id: 'c1-req', t: '三要求逐条核验' }, { id: 'c1-fn', t: '函数：数集上的映射' }, { id: 'c1-why', t: '为什么高中要换定义' }]">
    <p>邮资表、分段公式和图象都可以表示函数。判定时检查定义域中的每个输入是否有唯一的输出。</p>
    <div class="note good" id="c1-map"><strong>映射</strong>：设 A、B 是两个<strong>非空集合</strong>，如果按某个确定的对应法则 f，使得对 A 中<strong>任意</strong>一个元素 x，在 B 中都有<strong>唯一确定</strong>的元素 y 与之对应，那么称 f 为从集合 A 到集合 B 的一个映射 <span class="term">(mapping)</span>，记作 <Katex tex="f:A\to B" />，并写 <Katex tex="x\mapsto y=f(x)" />。y 叫做 x 的<strong>像</strong>，x 叫做 y 的<strong>原像</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createArrowMap" />
      <div class="cap">图 C1 · <b>映射的四种对应</b>。切换四种对应，拖动输入滑块追踪箭头。检查每个输入是否恰好有一条出发箭头。</div>
    </div>

    <h3 class="sec" id="c1-req">三要求逐条核验</h3>
    <p>定义里加粗的两处 —— "任意一个元素 x"与"唯一确定的元素 y"—— 正是映射的纪律所在。把它们拆开，对着图 C1 的四个按钮逐条核验：</p>
    <ul>
      <li><strong>完整性</strong>：A 中每个 x 都必须有像。图 ④ 里输入 3 没有像，不满足完整性；</li>
      <li><strong>单值性</strong>：每个 x 的像<strong>唯一</strong>。图 ③ 里输入 1 同时配了 10 和 20 —— "一个 x 算出两个 y"，也不满足单值性；</li>
      <li><strong>不要求满</strong>：B 中允许有元素没人认领（图 ② 的 30、40）。映射管好 A 到 B 的方向，不保证把 B 用完。</li>
    </ul>
    <p>反过来，B 中两个不同元素可以共享同一个原像吗？不可以 —— 原像必须在 A 里，而 A 中每个 x 只配一个像。图 ② 中 1 和 2 都指向 10，这是<strong>两个输入共享一个输出</strong>，完全合法。把"多对一"和"一对多"搞混，是映射判定题的第一大失分点：前者是函数的日常，后者连映射都不是。</p>

    <h3 class="sec" id="c1-fn">函数：数集上的映射</h3>
    <p>当 A、B 都是<strong>非空数集</strong>（实数集的子集）时，这样的映射就叫做<strong>函数</strong> <span class="term">(function)</span>。三要素：A 是定义域；法则是 f；值域 C 由法则对整个 A 扫一遍得出，且只能落在 B 里：</p>
    <Katex tex="f:A\to B,\qquad x\mapsto y=f(x),\qquad C=\{f(x)\mid x\in A\}\subseteq B" display />
    <p>注意那个"⊆"：值域 C 是 B 的子集，不是 B 本身。图 ② 里 A = {1,2,3,4}，B = {10,20,30,40}，值域却只有 {10,20} —— B 给得再多，函数只对真正被取到的值负责。"值域 ⊆ 给定值域集合 B"这个方向，在判断题里常考。</p>

    <h3 class="sec" id="c1-why">为什么高中要换定义</h3>
    <p>变量说的局限在于"过程"：它默认 x 连续地变、y 跟着连续地变。但对应说只关心<strong>配对</strong>，不管连续不连续：出租车计价是阶梯状的对应 —— 是函数；狄利克雷函数 <Katex tex="D(x)=\begin{cases}1&x\in\mathbb{Q}\\0&x\notin\mathbb{Q}\end{cases}" /> 图象根本画不出来、却严格满足对应说 —— 也是函数。定义宽了，能管的函数就多了，这正是对应说被采纳的原因。</p>
    <p>这套"对应"的读法将贯穿整个模块：C2 用它审"同一函数"，C5 把 f 读成一台<strong>机器</strong>（喂进 x，吐出 f(x)），而到了 S5 的对称性专题，"f 把谁变给谁"就是翻译对称句式的通用方法。下一讲先给出判定方法：什么样的两个"函数"其实根本是同一个。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createArrowMap } from '../../../boards/functions/concept/arrowmap.js';
import { C_CHAPTERS } from './cnav.js';
</script>
