<template>
  <ChPage :cur="4" no="Y4" base="/sets/y" :chapters="Y_CHAPTERS"
    title="数轴上的运算：解集实战" sub="不等式的解是区间，区间是集合 —— 于是「解不等式组」就是「对集合做交并补」。上下双轴实时核验：交取公共、并取覆盖、补挖两端；端点的实心与空心由「能不能取等」决定，四端开关一拨，开闭规则直接现形。"
    :toc="[{ id: 'y4-real', t: '解集：区间的集合身份' }, { id: 'y4-gap', t: '断口判据与端点开闭' }, { id: 'y4-pit', t: '取等与书写' }]">
    <div class="note good" id="y4-law"><strong>区间即集合</strong>：<Katex tex="[a,b)=\{x\mid a\le x<b\}" />，闭端实心（取得到）、开端空心（取不到）。<strong>运算口诀</strong>：交取公共 —— 两端各取靠内端、同点重合时「开优先」；并取覆盖 —— 重叠或闭端相触即连成一段，<strong>两端都开</strong>的触点才留断口；补 = 在 U 里挖去 A，剩余各段端点开闭对调（闭变开、开变闭）。<strong>不等式组</strong>的解集 = 各不等式解集的交集。</div>
    <ConicFigure number="Y4" title="数轴上的区间运算" head="bottom" :factory="createAxis">
      上轴摆 <Katex tex="A=[-3.5,\ 1.5)" />、<Katex tex="B=(0.5,\ 4]" />，四个把手拖位置、四个开关切端点开闭 —— 下轴实时输出 <Katex tex="A\cap B" /> / <Katex tex="A\cup B" /> / <Katex tex="\complement_U A" />；金探针 <Katex tex="x" /> 顺带验证「这一点在不在结果里」，断口只在两端都开时留下。
    </ConicFigure>

    <h3 class="sec" id="y4-real">解集：区间的集合身份</h3>
    <p>解不等式 <Katex tex="-2\le x<3" />，答案的规范写法是集合（<RouterLink class="xref" to="/sets/j2">集合的表示：列举、描述与图示</RouterLink>的描述法）： <Katex tex="\{x\mid -2\le x<3\}" />，配上区间记号 <Katex tex="[-2,3)" />、再配上数轴图示（<Katex tex="-2" /> 实心、<Katex tex="3" /> 空心）—— 三种语言说同一件事。而<strong>不等式组</strong>的实质是交集：组里每个不等式各交出自己的解集，全部同时成立，就是取交 —— 图 Y4 上轴的 <Katex tex="A" />、<Katex tex="B" /> 各记一个不等式的功劳，下轴交运算输出 <Katex tex="(0.5,\,1.5)" />，正是「既要又要」留下的公共段。反之，「解为 <Katex tex="A\cup B" />」的题面常藏在<strong>绝对值</strong>或<strong>平方式</strong>背后：<Katex tex="|x|>1" /> 的解集 <Katex tex="(-\infty,-1)\cup(1,+\infty)" /> 是两段的并 —— <RouterLink class="xref" to="/functions/e8">绝对值嵌套：三种折叠</RouterLink>正是并集出现最多的地方。</p>

    <h3 class="sec" id="y4-gap">断口判据与端点开闭</h3>
    <p>端点开闭由<strong>能否取等</strong>决定：<Katex tex="\le" />、<Katex tex="\ge" /> 产闭端，<Katex tex="\lt" />、<Katex tex="\gt" /> 产开端 —— 图 Y4 的 <Katex tex="a" />、<Katex tex="b" />、<Katex tex="c" />、<Katex tex="d" /> 四个开关就是四条「取等检验」，一拨之下区间端点实心空心互换，下轴结果的端点开闭跟着按规则重排。三条规则里最微妙的是<strong>并的断口</strong>：<Katex tex="(0,1)\cup(1,2)" /> 不等于 <Katex tex="(0,2)" /> —— 点 <Katex tex="x=1" /> 处左段开端、右段开端，<strong>两端都开</strong>，公共点取不到，断口留下；但 <Katex tex="(0,1]\cup(1,2)=(0,2)" /> —— 左段右端闭、取得到 <Katex tex="1" />，两段就此连成一段。图 Y4 把 <Katex tex="B" /> 的右端从 <Katex tex="4" /> 拖到与 <Katex tex="A" /> 的左端相触再切开闭，断口的生灭直接演示。补集的规则则干净利落：<Katex tex="\complement_U[{-3.5},\,1.5)" /> 在 <Katex tex="U=[-6,6]" /> 上得 <Katex tex="[-6,-3.5)\cup[1.5,6]" /> —— 注意 <Katex tex="1.5" /> 处由开变<strong>闭</strong>：<Katex tex="A" /> 里取不到的 <Katex tex="1.5" />，在补集里恰好取得到。</p>

    <h3 class="sec" id="y4-pit">取等与书写</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：端点不回代检验。</strong>解到边界值时，「能否取等」必须代回原不等式验一遍 —— 分母、根号、绝对值里的端点常因定义域限制而开闭翻转（<RouterLink class="xref" to="/functions/c3">定义域与值域</RouterLink>的流程 + <RouterLink class="xref" to="/functions/e8">绝对值嵌套：三种折叠</RouterLink>的分段点检验都是这套动作）。</li>
        <li><strong>提示二：交集并集方向搞反。</strong>「且」是 <Katex tex="\cap" />、「或」是 <Katex tex="\cup" /> —— 不等式组（且）取交，绝对值外侧（或）取并；图 Y4 两挡输出对调着看一遍即可确认。</li>
        <li><strong>提示三：解集写法不规范。</strong>解集是集合 —— 写成「<Katex tex="-2\lt x\lt3" /> 的范围」不规范，写 <Katex tex="\{x\mid -2<x<3\}" /> 或 <Katex tex="(-2,3)" />；<Katex tex="\cup" /> 形的答案 <Katex tex="(-\infty,-1)\cup(1,+\infty)" /> 不能写成 <Katex tex="-1>x>1" />（小于号方向矛盾，不存在这种「双头不等式」）—— 这正是零点与存在性定理一组的约定：数、式、图三套记号随时互译、绝不混写。</li>
      </ul>
    </div>
    <p>至此「集合」三大主题完结：语言（<RouterLink class="xref" to="/sets/j1">元素与集合：∈ 与 ∉</RouterLink>）、关系（<RouterLink class="xref" to="/sets/x1">子集与真子集：⊆、⊊ 与 =</RouterLink>）、运算（本讲）—— 它们是全站的基础：函数的定义域值域是集合（<RouterLink class="xref" to="/functions/c3">定义域与值域</RouterLink>）、不等式解集是集合运算（本讲）、事件的样本空间还是集合（概率模块）。模块的第四部分「常用逻辑」将沿<RouterLink class="xref" to="/sets/y3">运算律：德摩根与分配</RouterLink>的同构线展开：量词 <Katex tex="\forall" />、<Katex tex="\exists" />、四种命题与否定、充分必要 —— 集合的韦恩图与逻辑的真值表，即将合流。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAxis } from '../../../boards/sets/ops/axisops.js';
import { Y_CHAPTERS } from './ynav.js';
</script>
