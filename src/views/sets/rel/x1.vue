<template>
  <ChPage :cur="1" no="X1" base="/sets/x" :chapters="X_CHAPTERS"
    title="子集与真子集：⊆、⊊ 与 =" sub="$\in$ 是元素对集合的单线关系，$\subseteq$ 是集合对集合的整体关系 —— 但判定标准仍然是元素：$A$ 的每个元素都在 $B$ 里，才写 $A\subseteq B$。圈画得再出界、元素一个没跟出去就不算反例；反之只要找到一个「在 $A$ 不在 $B$」的元素，$A\nsubseteq B$ 即被推翻。"
    :toc="[{ id: 'x1-def', t: '定义：一个蕴含式' }, { id: 'x1-ext', t: '外延性：相等即互含' }, { id: 'x1-pit', t: '空集与记号' }]">
    <div class="note good" id="x1-law"><strong>子集定义</strong>：<Katex tex="A\subseteq B\iff\forall x\,(x\in A\Rightarrow x\in B)" />。<strong>真子集</strong>：<Katex tex="A\subseteq B" /> 且 <Katex tex="B" /> 中至少有一个元素不在 <Katex tex="A" /> 里，记 <Katex tex="A\subsetneq B" />。<strong>外延性（相等）</strong>：<Katex tex="A=B\iff A\subseteq B\ \text{且}\ B\subseteq A" /> —— 两个集合元素完全相同就是同一个集合。<strong>空集</strong>：<Katex tex="\varnothing\subseteq A" /> 对任何 <Katex tex="A" /> 恒成立（反例元素根本找不到）。</div>
    <ConicFigure number="X1" title="子集" head="bottom" :factory="createSub">
      拖金圈 <Katex tex="A" /> 靠近、压上、越过蓝圈 <Katex tex="B" /> —— 元素点实时变色：全被 <Katex tex="B" /> 罩住是 <Katex tex="A\subseteq B" />，元素跟出去一个就是反例；四个预设演足 <Katex tex="\subsetneq" />、<Katex tex="=" />、<Katex tex="\nsubseteq" />、<Katex tex="\varnothing" /> 四种结局，<Katex tex="A\setminus A" /> 的「剩余」同步核验。
    </ConicFigure>

    <h3 class="sec" id="x1-def">定义：一个蕴含式</h3>
    <p>把 <Katex tex="A\subseteq B" /> 的定义读成一句话：「<strong>任取</strong>一个 <Katex tex="x" />，只要 <Katex tex="x\in A" />，就有 <Katex tex="x\in B" />」—— 这就是数学里第一次正式出场的蕴含式 <Katex tex="P\Rightarrow Q" />。它的判定方式是<strong>单向</strong>的：证 <Katex tex="A\subseteq B" /> 要从 <Katex tex="A" /> 里任取元素验到 <Katex tex="B" />（图 X1 里金圈的元素全变绿，一个不漏）；推翻它却只需<strong>一个反例</strong> —— 找到一个 <Katex tex="x\in A" /> 但 <Katex tex="x\notin B" /> 的元素，结论立即被推翻。图 X1 的 ③ 预设把圈画到左上角，圈的大部分落在 <Katex tex="B" /> 外 —— 但板上判读不看圈的面积，只认元素 <Katex tex="8" /> 跟了出去。顺带一提：蕴含式对「前件为假」的 <Katex tex="x" /> 自动成立 —— <Katex tex="A" /> 里的元素若根本不存在（<Katex tex="A=\varnothing" />），「任取」无从取起，空集便无差别地成为任何集合的子集。</p>

    <h3 class="sec" id="x1-ext">外延性：相等即互含</h3>
    <p>「两个集合相等」不需要新定义：<Katex tex="A\subseteq B" /> 说 <Katex tex="A" /> 的元素 <Katex tex="B" /> 全有，<Katex tex="B\subseteq A" /> 说 <Katex tex="B" /> 的元素 <Katex tex="A" /> 全有 —— 两个方向合起来，元素完全一致，按外延性公理就是同一个集合。图 X1 的 ② 预设把金圈放大到与蓝圈重合，读数显示「互相包含」：这既是判定相等的操作流程（双向验证），也是证明两集合相等的标准写法 —— 先证 <Katex tex="A\subseteq B" />、再证 <Katex tex="B\subseteq A" />，两步各走一个 <Katex tex="\forall x" /> 蕴含式。反过来，「<Katex tex="A\subseteq B" /> 且 <Katex tex="B\subseteq A" />」却推不出真子集 —— 真子集要求 <Katex tex="B" /> 里<strong>还有剩余</strong>，即 <Katex tex="B\setminus A\ne\varnothing" />；图 X1 的核验读数把这块「剩余」（<Katex tex="B\setminus A" /> 的元素）列了出来，正是 <Katex tex="\subsetneq" /> 与 <Katex tex="=" /> 的分界线。</p>

    <h3 class="sec" id="x1-pit">空集与记号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：含参题先查空集。</strong>「<Katex tex="\{x\mid x^2<a\}\subseteq \mathbb{R}" /> 对一切 <Katex tex="a" /> 成立」这类题里，参数 <Katex tex="a\le0" /> 时集合为空 —— 而 <Katex tex="\varnothing\subseteq B" /> 恒成立，这一支解绝不能丢；先查 <Katex tex="A=\varnothing" /> 是否满足条件，是含参子集题的第一动作。</li>
        <li><strong>提示二：<Katex tex="\subseteq" /> 与 <Katex tex="\subset" /> 的记号约定。</strong>本站按现行教材记 <Katex tex="\subseteq" /> 为子集（含相等）、<Katex tex="\subsetneq" /> 为真子集；部分旧资料用 <Katex tex="\subset" /> 兼指两者 —— 读题先统一口径。</li>
        <li><strong>提示三：图不是证。</strong>韦恩图里圈的位置只是示意，圈画出界不要紧（元素视角是判定依据）；反过来圈完全套住、元素却因空心端点差一个 —— <RouterLink class="xref" to="/sets/j2">集合的表示：列举、描述与图示</RouterLink>的开闭端点在集合关系里同样致命。</li>
      </ul>
    </div>
    <p>关系判定完结，下一章清点子集个数：一个 <Katex tex="n" /> 元集合到底有多少个子集、真子集 —— 乘法原理给出干净的 <Katex tex="2^n"/>，四个口径各减各的。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSub } from '../../../boards/sets/rel/subslab.js';
import { X_CHAPTERS } from './xnav.js';
</script>
