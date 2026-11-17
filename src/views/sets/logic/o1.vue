<template>
  <ChPage :cur="1" no="O1" base="/sets/o" :chapters="O_CHAPTERS"
    title="全称量词与存在量词：∀ 与 ∃" sub="命题是能判断真假的陈述句；量词把开句变成命题 —— 全称量词 ∀ 断言每一个都成立，存在量词 ∃ 断言至少有一个成立。真假判据不对称：全称命题要真须证明一切，要假只须一个反例；存在命题要真只须一个见证，要假须论证无解。"
    :toc="[{ id: 'o1-def', t: '命题与量词' }, { id: 'o1-judge', t: '真假的判定：反例与见证' }, { id: 'o1-m', t: '前置集合 M 的限定' }, { id: 'o1-pit', t: '都、找不到与开句' }]">
    <div class="note good" id="o1-law"><strong>全称量词命题</strong>：<Katex tex="\forall x\in M,\ p(x)" /> —— 「对 M 内<strong>每一个</strong> x，p(x) 都成立」；<strong>存在量词命题</strong>：<Katex tex="\exists x\in M,\ p(x)" /> —— 「M 内<strong>至少有一个</strong> x 使 p(x) 成立」。全称命题为真 <Katex tex="\iff"/> M 内无反例；存在命题为真 <Katex tex="\iff"/> M 内有见证。</div>
    <div class="board-wrap">
      <BoardMount :factory="createQL" />
      <div class="cap">图 O1 · <b>全称命题与存在命题</b>：数轴上方是满足情况带 —— 绿=满足、红=不满足、M 外留空；拖金探针逐点读数或点 ⏩ 扫轴看全带，再点「换量词」对照真假。看点：红处即反例（全称命题由一个点推翻）、绿处即见证（存在命题由一个点成立），而「真」的论证靠证明不靠数。</div>
    </div>

    <h3 class="sec" id="o1-def">命题与量词</h3>
    <p>「<Katex tex="x>2" />」不是命题 —— x 没有指定时无法判断真假，这样的式子叫<strong>开句</strong>（谓词）。给它挂上量词才成为命题：<Katex tex="\forall x\in\mathbb{R},\ x>2" />（假）与 <Katex tex="\exists x\in\mathbb{R},\ x>2" />（真）是两个不同的命题。同一个开句配不同的量词，真假可以完全不同 —— 量词是命题的组成部分，不是装饰。中文对应词也要认识：∀ 读作「任意」「每一个」，∃ 读作「存在」「至少有一个」。</p>

    <h3 class="sec" id="o1-judge">真假的判定：反例与见证</h3>
    <p>两条判据在方向上<strong>不对称</strong>，这是本节最容易忽略的地方：</p>
    <p><strong>全称命题</strong> <Katex tex="\forall x\in M,\ p(x)" /> —— 要证明它为真，须对一切 x 论证（图 O1 的带子只能逐点看，而点数不完，所以「全绿」只是证据不是证明）；要指出它为假，只须找<strong>一个反例</strong> x₀ 使 <Katex tex="p(x_0)" /> 不成立。预设 ② <Katex tex="\forall x\in\mathbb{R},\ x^2>x" />：x=0 处 <Katex tex="0^2=0" /> 并不大于 0，红带一出现，命题即为假 —— 这与 X1 子集判定「一个反例元素就推翻 ⊆」是同一条原理。<strong>存在命题</strong> <Katex tex="\exists x\in M,\ p(x)" /> —— 要证明它为真，只须找到<strong>一个见证</strong>（预设 ⑤ 中 x=0 使 <Katex tex="0^2=0" />，命题即立）；要指出它为假，却须论证 M 内<strong>无解</strong>：预设 ④ <Katex tex="\exists x\in\mathbb{Z},\ x^2=2" />，由平方根为 <Katex tex="\pm\sqrt2" /> 且其非整数，整条带全红才敢断言为假。</p>
    <p>「换量词」按钮直接对照：<Katex tex="\forall x\in\mathbb{R},\ x^2>x" /> 假而 <Katex tex="\exists x\in\mathbb{R},\ x^2>x" /> 真（x=2 即见证），<Katex tex="\exists x\in\mathbb{R},\ x^2=x" /> 真而 <Katex tex="\forall x\in\mathbb{R},\ x^2=x" /> 假 —— 换量词就是换命题，真假须重新判定。</p>

    <h3 class="sec" id="o1-m">前置集合 M 的限定</h3>
    <p>量词只管前置集合 M 之内的元素 —— M 是讨论范围，M 外的位置带子留空、命题不作断言（这正是 J2 描述法三部件里的「前置集合」）。换 M 就是换命题：预设 ③ <Katex tex="\forall x\in\mathbb{N},\ x^2\ge x" /> 为真（x≥1 时 <Katex tex="x^2-x=x(x-1)\ge 0" />），而把 M 放宽到 ℝ 就成了假命题 —— 0 与 1 之间的任何实数都是反例。读题时先看清量词挂在哪个集合上，是这类题目的第一步。</p>

    <h3 class="sec" id="o1-pit">都、找不到与开句</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：「都」字决定量词。</strong>「M 内的元素都满足 p」是全称命题，「M 内有元素满足 p」是存在命题 —— 一字之差，真假判据完全相反；把「都」读丢，反例与见证的用法也就反了。</li>
        <li><strong>提示二：找不到 ≠ 不存在。</strong>存在命题要断言为假，必须论证 M 内无解（预设 ④ 的 <Katex tex="\sqrt2\notin\mathbb{Z}" />）；「我没找到」不是证明 —— 扫轴扫一遍也只是示意，不是论证。</li>
        <li><strong>提示三：开句不是命题。</strong>「<Katex tex="x^2=2" />」本身无真假可言；写结论时必须带上量词与集合，如 <Katex tex="\exists x\in\mathbb{R},\ x^2=2" />（真）。</li>
      </ul>
    </div>
    <p>量词命题有了真假，下一步是<strong>否定</strong>：把 ∀ 换成 ∃、结论取反 —— 两条带子逐点颜色互补，正是 Y3 集合 ⟷ 逻辑词典的下一行。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQL } from '../../../boards/sets/logic/quants.js';
import { O_CHAPTERS } from './onav.js';
</script>
