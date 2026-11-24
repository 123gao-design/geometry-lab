<template>
  <ChPage :cur="1" no="Y1" base="/sets/y" :chapters="Y_CHAPTERS"
    title="交集与并集：∩ 与 ∪" sub="两个集合如何「合起来算」：$\cap$ 收录同时属于两边的元素（且），$\cup$ 收录至少属于一边的元素（或）。九个元素点随手拖，区域着色与成员清单实时重算 —— 逻辑连接词 $\wedge$、$\vee$ 从此有了看得见的样子。"
    :toc="[{ id: 'y1-and', t: '∩ 与 ∪：且与或的集合实现' }, { id: 'y1-chain', t: '包含链与差集' }, { id: 'y1-pit', t: '交可以为空' }]">
    <div class="note good" id="y1-law"><strong>交集</strong>：<Katex tex="A\cap B=\{x\mid x\in A\wedge x\in B\}" />（同时属于两边）；<strong>并集</strong>：<Katex tex="A\cup B=\{x\mid x\in A\vee x\in B\}" />（至少属于一边）。<strong>包含链</strong>：<Katex tex="A\cap B\subseteq A\subseteq A\cup B" />，计数上 <Katex tex="n(A\cap B)\le n(A)\le n(A\cup B)\le n(A)+n(B)" />。<strong>差集</strong>：<Katex tex="A\setminus B=\{x\mid x\in A\wedge x\notin B\}" />，且 <Katex tex="A\setminus B\ne B\setminus A" />（差集不交换）。</div>
    <ConicFigure number="Y1" title="交集与并集" head="bottom" :factory="createVenn">
      九个元素点随手拖，四挡模式 <Katex tex="\cap" />、<Katex tex="\cup" />、<Katex tex="A\setminus B" />、<Katex tex="B\setminus A" /> 实时切换 —— 区域着色、成员清单与包含链计数同步重算；⏩ 让 <Katex tex="5" /> 号元素绕「<Katex tex="A" /> 内 → 两边 → <Katex tex="B" /> 内 → 圈外」跑一圈，四种归属逐一显示。
    </ConicFigure>

    <h3 class="sec" id="y1-and"><Katex tex="\cap" /> 与 <Katex tex="\cup" />：且与或的集合实现</h3>
    <p><RouterLink class="xref" to="/sets/j2">集合的表示：列举、描述与图示</RouterLink>里的描述法在这里开始真正发挥作用：<strong>且（<Katex tex="\wedge" />）</strong>写成 <Katex tex="A\cap B" /> —— 两个条件同时过关的元素留下，图 Y1 里 <Katex tex="5" />、<Katex tex="6" /> 号元素站在两圈重叠处，<Katex tex="\cap" /> 只保留它们；<strong>或（<Katex tex="\vee" />）</strong>写成 <Katex tex="A\cup B" /> —— 至少过关一边就保留，<Katex tex="1" /> 到 <Katex tex="6" /> 号全部在并集中。「且」越筛越严、「或」越并越宽，方向恰好相反 —— 但 <Katex tex="7" />、<Katex tex="8" />、<Katex tex="9" /> 号站在两圈之外，<Katex tex="\wedge" />、<Katex tex="\vee" /> 都不保留：两个符号都不是「全部保留」。<strong>符号式读数</strong>把四挡的定义直译成 <Katex tex="\wedge" /> 与 <Katex tex="\vee" /> 的描述法 —— 集合运算的本质就是「给逻辑连接词找一个集合当结果」。这也是<RouterLink class="xref" to="/sets/x1">子集与真子集：⊆、⊊ 与 =</RouterLink>的蕴含式之后的第二块逻辑拼图：<Katex tex="\Rightarrow" /> 管关系（<Katex tex="\subseteq" />）、<Katex tex="\wedge" /> 与 <Katex tex="\vee" /> 管运算，高中逻辑词表至此全部出现。</p>

    <h3 class="sec" id="y1-chain">包含链与差集</h3>
    <p>图 Y1 的包含链读数实时显示：<Katex tex="2\le 4\le 6" /> —— <Katex tex="A\cap B" /> 的 <Katex tex="2" /> 个元素当然个个都在 <Katex tex="A" /> 的 <Katex tex="4" /> 个元素里（交的条件更严），<Katex tex="A" /> 的元素个个都在 <Katex tex="A\cup B" /> 的 <Katex tex="6" /> 个里（并的范围更宽）。由此读出两条<strong>吸收律</strong>：<Katex tex="A\cap(A\cup B)=A" />、<Katex tex="A\cup(A\cap B)=A" /> —— 用自己的集合去跟「自己与别人的合并」取交，结果还是自己。差集模式演示「先圈定、再减去」：<Katex tex="A\setminus B" /> 收 <Katex tex="1" />、<Katex tex="2" /> 号、<Katex tex="B\setminus A" /> 收 <Katex tex="3" />、<Katex tex="4" /> 号 —— 同一对 <Katex tex="A" />、<Katex tex="B" /> 换一个减的顺序结果就变，<strong>差集不交换</strong>，与交、并的可交换（<Katex tex="A\cap B=B\cap A" />）形成鲜明对照。计数的容斥关系 <Katex tex="n(A\cup B)=n(A)+n(B)-n(A\cap B)" /> 也在这条链上直接可见 —— 同属两边的 <Katex tex="2" /> 个元素在直接相加时被算了两次，减回一次。</p>

    <h3 class="sec" id="y1-pit">交可以为空</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：交集可以为空。</strong>把图 Y1 的两个元素点都拖出重叠区，<Katex tex="\cap" /> 这一挡的结果读数立刻变成 <Katex tex="\varnothing" /> —— 「<Katex tex="A\cap B=\varnothing" />」（两集合无公共元素）是合法且常见的结论，不要在选择题里把它当「无解」而漏选。</li>
        <li><strong>提示二：定义域取交。</strong><Katex tex="f\pm g" /> 的定义域 <Katex tex="=D(f)\cap D(g)" />（和差函数处处要两家分母根号都答应），而 <Katex tex="f\cdot g" />、<Katex tex="f/g" /> 还要在交里继续挖零分母 —— <RouterLink class="xref" to="/functions/c3">定义域与值域</RouterLink>的流程在集合语言里就是 <Katex tex="\cap" /> 与 <Katex tex="\setminus" />。</li>
        <li><strong>提示三：容斥的记号。</strong><Katex tex="n(A\cup B)=n(A)+n(B)-n(A\cap B)" /> 是概率加法公式 <Katex tex="P(A\cup B)=P(A)+P(B)-P(A\cap B)" /> 的计数版前身 —— 概率统计模块将把它推广到三集合容斥，届时「加回挖多了的」这套直觉从这里起算。</li>
      </ul>
    </div>
    <p><Katex tex="\cap" /> 与 <Katex tex="\cup" /> 都在「两集合之间」做运算，下一章讨论<strong>全集</strong>：补集 <Katex tex="\complement" /> 是单目运算 —— 但它的结果依赖全集大小，推一下右墙就能看清。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createVenn } from '../../../boards/sets/ops/vennops.js';
import { Y_CHAPTERS } from './ynav.js';
</script>
