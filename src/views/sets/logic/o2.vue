<template>
  <ChPage :cur="2" no="O2" base="/sets/o" :chapters="O_CHAPTERS"
    title="量词命题的否定：真假互补" sub="否定一个命题，就是把它的真假反过来 —— 所以否定式必须与原命题一真一假。对量词命题，这要求两件事同时做：量词翻转（$\forall$ 换 $\exists$、$\exists$ 换 $\forall$）、结论取反。只否结论而量词不动，写出来的式子在多数场合与原命题同真同假，根本不是否定。"
    :toc="[{ id: 'o2-law', t: '否定式：两行推导' }, { id: 'o2-iso', t: '与补集的同一结构' }, { id: 'o2-wrong', t: '误写剖析：量词不换' }, { id: 'o2-pit', t: '否定与取反面' }]">
    <div class="note good" id="o2-law"><strong>量词的否定对偶</strong>：<Katex tex="\neg(\forall x\in M,\ p(x))=\exists x\in M,\ \neg p(x)" />、<Katex tex="\neg(\exists x\in M,\ p(x))=\forall x\in M,\ \neg p(x)" /> —— 量词互换，结论取反。</div>
    <ConicFigure number="O2" title="量词的否定" head="bottom" :factory="createND">
      上带是 <Katex tex="p(x)" /> 的满足情况、下带是 <Katex tex="\neg p(x)" /> 的 —— 两带逐点颜色互补；四个预设各给出原命题、否定式与误写三支的实时判定。看点：否定式永远与原命题一真一假，而量词没换的误写在红绿相间的带子上与原命题同真同假 —— 当场失去否定的资格。
    </ConicFigure>

    <h3 class="sec" id="o2-law">否定式：两行推导</h3>
    <p>「否定」的检验标准只有一条：<strong>一真一假</strong>。全称命题 <Katex tex="\forall x\in M,\ p(x)" /> 为假，意思是 <Katex tex="M" /> 内<strong>存在</strong>使 <Katex tex="p" /> 不成立的 <Katex tex="x" /> —— 逐字翻译就是 <Katex tex="\exists x\in M,\ \neg p(x)" />，这正是它的否定式；存在命题为假，意思是 <Katex tex="M" /> 内<strong>每一个</strong> <Katex tex="x" /> 都使 <Katex tex="p" /> 不成立，翻译得 <Katex tex="\forall x\in M,\ \neg p(x)" />。两条推导结构相同：命题为假的直接读法，就是否定式本身 —— 所以否定式与原命题真假必然相反。</p>

    <h3 class="sec" id="o2-iso">与补集的同一结构</h3>
    <p>把 <Katex tex="M" /> 内使 <Katex tex="p" /> 成立的元素收集成真值集 <Katex tex="A=\{x\in M\mid p(x)\}" />，则 <Katex tex="\complement_M A=\{x\in M\mid \neg p(x)\}" /> —— <RouterLink class="xref" to="/sets/y2">补集与全集：∁ 与差集</RouterLink>的补集正是<RouterLink class="xref" to="/sets/y3">运算律：德摩根与分配</RouterLink>词典里 <Katex tex="\neg" /> 的集合实现。图 O2 的上下两条带因此逐点颜色互补：上带的绿处下带必红，上带的红处下带必绿（<Katex tex="M" /> 外两带同时留空）。否定一个量词命题，几何上就是把真值集换成它在 <Katex tex="M" /> 内的补集 —— 挖掉的部分恰好补上，与<RouterLink class="xref" to="/sets/y2">补集与全集：∁ 与差集</RouterLink>里的双重否定 <Katex tex="\complement_U(\complement_U A)=A" /> 也对上了。</p>

    <h3 class="sec" id="o2-wrong">误写剖析：量词不换</h3>
    <p>预设 ① 的原命题 <Katex tex="\forall x\in\mathbb{Z},\ x^2\le 4" /> 为假，正确的否定式 <Katex tex="\exists x\in\mathbb{Z},\ x^2>4" /> 为真（<Katex tex="x=3" /> 即见证）；而误写 <Katex tex="\forall x\in\mathbb{Z},\ x^2>4" /> 仍为假 —— 与原命题<strong>同假</strong>，没有把真假反过来。原因看带子就清楚：<Katex tex="p" /> 在 <Katex tex="M" /> 内红绿相间（部分成立）时，「全不成立」与「都成立」当然可以同时为假。误写只在 <Katex tex="p" /> 处处成立或处处不成立时碰巧与原命题一真一假 —— 那是巧合，不是否定成立的依据。结论：量词必须翻转，这一步不能省。</p>

    <h3 class="sec" id="o2-pit">否定与取反面</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：命题的否定 ≠ 否命题。</strong>「否命题」是<RouterLink class="xref" to="/sets/o3">四种命题：互为逆否</RouterLink>里的概念（条件、结论<strong>都</strong>否定后的 <Katex tex="\neg p\Rightarrow\neg q" />），作用于「若 <Katex tex="p" /> 则 <Katex tex="q" />」型命题；「命题的否定」只把真假反过来。两者名字相近，对象不同，考试按定义各算各的。</li>
        <li><strong>提示二：结论取反要彻底。</strong>「<Katex tex="x^2\le 4" />」的否定是「<Katex tex="x^2>4" />」—— <Katex tex="\le" /> 的反面是 <Katex tex="\gt" />，不是 <Katex tex="\ge" />；端点处的取等归到反面，与<RouterLink class="xref" to="/sets/y4">数轴上的运算：解集实战</RouterLink>区间端点开闭的取等检验同一条原理。</li>
        <li><strong>提示三：全称真命题的否定是真存在命题。</strong>「都对」的否定是「存在一个不对」，不是「都不对」—— 方向想反，答案就成反向的极端。</li>
      </ul>
    </div>
    <p>否定的对象是单个命题；下一章把命题 p 与 q 排成「若 p 则 q」，看交换、否定它们各得到什么命题，哪两个永远同真假。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createND } from '../../../boards/sets/logic/negdual.js';
import { O_CHAPTERS } from './onav.js';
</script>
