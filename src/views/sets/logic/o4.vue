<template>
  <ChPage :cur="4" no="O4" base="/sets/o" :chapters="O_CHAPTERS"
    title="充分条件与必要条件" sub="若 $p\Rightarrow q$，则称 p 是 q 的充分条件、q 是 p 的必要条件。把两个条件都写成真值集，推出关系就变成包含关系：$p\Rightarrow q\iff A\subseteq B$ —— 集合模块的子集判定（X1）与逻辑模块的推出关系（O3）在真值集上合流，四种条件类型按包含关系一一对号。"
    :toc="[{ id: 'o4-def', t: '定义与四类' }, { id: 'o4-set', t: '真值集观点：合流' }, { id: 'o4-flow', t: '判定流程与必要性的读法' }, { id: 'o4-pit', t: '方向与取等' }]">
    <div class="note good" id="o4-law">若 <Katex tex="p\Rightarrow q" />：p 是 q 的<strong>充分条件</strong>，q 是 p 的<strong>必要条件</strong>。四类：<strong>充分不必要</strong>（p⇒q 且 q⇏p）、<strong>必要不充分</strong>（q⇒p 且 p⇏q）、<strong>充要</strong>（<Katex tex="p\iff q" />）、<strong>既不充分也不必要</strong>（互推都不成立）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCD" />
      <div class="cap">图 O4 · <b>充要判定机</b>：蓝带画 p 的真值集 A、橙带画 q 的真值集 B，四个预设即四类条件各一例；拖探针到 A∖B 或 B∖A 的位置，对应方向的「反例元素」当场读出。看点：小范围推出大范围 —— 两条带谁含住谁，箭头就指向谁，判定四类型只须比较包含关系。</div>
    </div>

    <h3 class="sec" id="o4-def">定义与四类</h3>
    <p>「充分」与「必要」说的是同一件事的两面：<Katex tex="p\Rightarrow q" /> 成立时，有 p <strong>足够</strong>保证 q（充分），而 p 成立<strong>离不开</strong> q（q 是 p 的必要条件 —— 逆否观点 <Katex tex="\neg q\Rightarrow\neg p" />：q 不成立则 p 也不成立，O3 的改证逆否在此直接用上）。四类条件就是 <Katex tex="p\Rightarrow q" /> 与 <Katex tex="q\Rightarrow p" /> 两个方向的真假组合：图 O4 的预设 ①<Katex tex="x>2" /> 对 <Katex tex="x>1" /> 是充分不必要（② 交换后即必要不充分），③ <Katex tex="|x|>1" /> 与 <Katex tex="x^2>1" /> 互推成立是充要，④ <Katex tex="x>0" /> 对 <Katex tex="|x|>1" /> 互推都不成立。</p>

    <h3 class="sec" id="o4-set">真值集观点：合流</h3>
    <p>设 <Katex tex="A=\{x\mid p(x)\}" />、<Katex tex="B=\{x\mid q(x)\}" />（J2 描述法三部件再次出场）。<Katex tex="p\Rightarrow q" /> 说「凡 p 成立处 q 都成立」，逐字翻译成集合语言就是「A 的元素都在 B 里」—— <Katex tex="p\Rightarrow q\iff A\subseteq B" />。于是四种条件类型各对应一种包含关系：充分不必要是 <Katex tex="A\subsetneq B" />（小圈在大圈内），必要不充分是 <Katex tex="B\subsetneq A" />，充要是 <Katex tex="A=B"/>，既不充分也不必要是两个方向都含不住。判定「<Katex tex="p\nRightarrow q"/>」也与 X1 完全一致：只须一个反例元素 —— 探针拖进 <Katex tex="A\setminus B"/>，<Katex tex="p\Rightarrow q"/> 即被推翻。集合与逻辑两条线在这里正式合上：J 的语言、X 的关系、Y 的运算、O 的推理，说的是同一个结构。</p>

    <h3 class="sec" id="o4-flow">判定流程与必要性的读法</h3>
    <p>操作流程三步：① 把 p、q 各自化简，写出真值集 A、B；② 比较 A⊆B 与 B⊆A 两向；③ 按上表对号入座。「必要」的直觉读法要过关：q 必要 = 缺 q 不行 = <Katex tex="\neg q\Rightarrow\neg p" /> = q 真值集含住 p 真值集。容易混乱时直接画两条带：箭尾（充分条件）的带必须<strong>窄</strong>，箭头（必要条件）的带必须<strong>宽</strong> —— 窄带推出宽带，不会反。</p>

    <h3 class="sec" id="o4-pit">方向与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：充分、必要说反。</strong>「x&gt;2 是 x&gt;1 的充分条件」与「x&gt;1 是 x&gt;2 的必要条件」是同一句话 —— 充分条件在箭尾、必要条件在箭头；答「谁是谁的什么条件」时，先固定箭头方向再作答。</li>
        <li><strong>提示二：端点取等决定类型。</strong><Katex tex="x\ge 2" /> 与 <Katex tex="x>2" /> 的真值集差一个点 2：后者对前者是充分不必要；端点能否取等（≤ 还是 &lt;）直接改变 A⊆B 是否成立 —— 与 Y4 的取等检验同源。</li>
        <li><strong>提示三：不验证反向就报「充要」。</strong>充要须 <strong>两个方向都</strong>验证（A⊆B 且 B⊆A）；只验单向就下结论，是把充分条件冒充充要条件 —— 大题里按双向分别作答给分，缺一向就丢分。</li>
      </ul>
    </div>
    <p>至此集合与常用逻辑模块收官：集合给出语言与关系，逻辑给出量词与推理，而 <Katex tex="A\subseteq B\iff p\Rightarrow q" /> 把两者钉在一起。后续每一步 —— 函数定义域值域（C3）、不等式解集、概率的样本空间 —— 都用这套语言书写；全站结论总表见顶栏<strong>速查</strong>。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCD } from '../../../boards/sets/logic/condi.js';
import { O_CHAPTERS } from './onav.js';
</script>
