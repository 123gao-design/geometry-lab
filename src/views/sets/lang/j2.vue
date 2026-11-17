<template>
  <ChPage :cur="2" no="J2" base="/sets/j" :chapters="J_CHAPTERS"
    title="集合的表示：列举、描述与图示" sub="有限集用列举、无限集用描述、几何对象用图示 —— 三种语言各有分工。描述法是重点：把「代表元 + 前置集合 + 条件」拆开看，集合就一目了然；数轴图示则把端点开闭画成看得见的实心与空心。"
    :toc="[{ id: 'j2-desc', t: '描述法解剖：三部件' }, { id: 'j2-three', t: '三种语言的分工' }, { id: 'j2-pit', t: '三种记法别认错' }]">
    <div class="note good" id="j2-law"><strong>描述法格式</strong>：<Katex tex="A=\{x\in U\mid P(x)\}" /> —— 三部件：<strong>代表元</strong> x（在讨论什么对象）、<strong>前置集合</strong> <Katex tex="x\in U" />（从哪个大集合里选）、<strong>条件</strong> P(x)（还须满足什么）。不写前置时默认 <Katex tex="x\in\mathbb{R}" />。<strong>列举法</strong> <Katex tex="\{-2,-1,0,1,2\}" /> 只适合有限集；无限集用描述法或数轴图示。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRep" />
      <div class="cap">图 J2 · <b>列举法、描述法与数轴图示</b>：四个预设集合各自上轴，拖金探针 x —— 先过「前置集合」这关、再验条件；吸附网格让探针精确踩上端点 3 与 −1，开闭直接核验。列举法、描述法、数轴图示三种语言实时互译。</div>
    </div>
    <div class="board-wrap">
      <BoardMount id="ps" :factory="createPs" />
      <div class="cap">图 J2 附 · <b>描述法不止落在数轴上</b>：描述法的主体同样可以是平面上的点集 —— 把代表元换成点 (x,y)、前置集合换成 <Katex tex="\mathbb{R}^{2}" />。直线用等式约束、区域用不等式约束；不带等号的不等号，边界是空的（上半平面不含 x 轴）。空间中再加一维：<Katex tex="\{(x,y,z)\mid x^{2}+y^{2}+z^{2}=1\}" /> 就是单位球面。</div>
    </div>

    <h3 class="sec" id="j2-desc">描述法解剖：三部件</h3>
    <p>图 J2 的探针把描述法拆成两个步骤。第一步是<strong>前置集合</strong>：<Katex tex="A=\{x\in\mathbb{Z}\mid -2\le x<3\}" /> 里，探针落在 2.5 时区间条件尚未检验 —— 「不是整数」先被 <Katex tex="x\in\mathbb{Z}" /> 排除，前置集合先检验。第二步才是<strong>条件</strong>：通过前置检验的整数再验 <Katex tex="-2\le x<3" />，右端 x=3 因「<」不含等号而被排除。两步都通过才判定 ∈。这个「先圈定范围、再验条件」的两步结构，正是下一章子集判定的雏形 —— 前置集合本身就是一个小型的 <Katex tex="\forall x" /> 量词。</p>

    <h3 class="sec" id="j2-three">三种语言的分工</h3>
    <p><strong>列举法</strong>直观，但只在有限集可行 —— 图 J2 的 ② <Katex tex="B=\{x\mid -1<x\le 2\}" /> 一上线，列举机就打出「无限集：打不完」的警告；偶数集 <Katex tex="C=\{x\mid x=2k,\ k\in\mathbb{Z}\}" /> 用省略号 <Katex tex="\{\ldots,-4,-2,0,2,4,\ldots\}" /> 勉强示意，但「省略号合法」的前提是规律唯一。<strong>描述法</strong>是对无限集唯一的严谨书写。<strong>图示法</strong>（数轴、韦恩图）不负责严谨、负责看见：区间端点实心 = 闭（含端点）、空心 = 开（不含端点）——图 J2 探针踩上 x=−1 时徽章亮出「左端开着」，端点不在线上。C3 定义域里「分母不为零、根号下非负」翻译成集合语言，走的正是这条描述法流程。</p>
    <p><strong>几何对象集</strong>也用描述法，只是前置集合按对象类别继承：平面点集取 <Katex tex="\mathbb{R}^{2}" />，空间点集取 <Katex tex="\mathbb{R}^{3}" /> —— 代表元是点 (x,y) 或 (x,y,z)，竖线左边从「数 x」升级为「点」。直线是等式约束 <Katex tex="\{(x,y)\in\mathbb{R}^{2}\mid y=x\}" />，区域是不等式约束 <Katex tex="\{(x,y)\in\mathbb{R}^{2}\mid x^{2}+y^{2}\le 1\}" />（单位圆盘）或 <Katex tex="\{(x,y)\in\mathbb{R}^{2}\mid y>0\}" />（上半平面，x 轴空心）；空间里 <Katex tex="\{(x,y,z)\mid x^{2}+y^{2}+z^{2}=1\}" /> 是单位球面。规则不变：代表元一旦换成点，集合元素就成群了，<strong>不能再用「数轴上的位置」来画</strong>，只能回到描述法或区域图。</p>

    <h3 class="sec" id="j2-pit">三种记法别认错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：代表元决定集合。</strong>同一个 <Katex tex="y=x^2" /> 能造出三个完全不同的集合 —— ① <Katex tex="\{x\mid y=x^2\}" />：代表元是 x，集合 = <strong>x 的取值范围</strong>（定义域 <Katex tex="\mathbb{R}" />）；② <Katex tex="\{y\mid y=x^2\}" />：代表元是 y，集合 = <strong>y 的取值范围</strong>（值域 <Katex tex="[0,+\infty)" />，正是 C3 值域投影的雏形）；③ <Katex tex="\{(x,y)\mid y=x^2\}" />：代表元是点 (x,y)，集合 = <strong>抛物线上的点全体</strong>（一条曲线）。</li>
        <li><strong>提示二：先读竖线左边。</strong>代表元换了，讨论的对象就换了 —— 读描述法先读竖线左边，这是唯一可靠的判断依据。</li>
        <li><strong>提示三：默认数集是 ℝ。</strong><Katex tex="\{x\mid x^2=3\}" /> 与 <Katex tex="\{x\in\mathbb{R}\mid x^2=3\}" /> 相同，但 <Katex tex="\{x\in\mathbb{Z}\mid x^2=3\}" /> 为空集 —— 图 J2 的 ④ 关掉 ℝ 前置立变 ∅。</li>
      </ul>
    </div>
    <p>集合写出来了，下一章开始讨论「集合与集合」的关系：谁包含谁、谁是谁的子集 —— 元素视角的 ∈ 升级为全称视角的 ⊆。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRep } from '../../../boards/sets/lang/replab.js';
import { createBoard as createPs } from '../../../boards/sets/lang/psets.js';
import { J_CHAPTERS } from './jnav.js';
</script>
