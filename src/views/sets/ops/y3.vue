<template>
  <ChPage :cur="3" no="Y3" base="/sets/y" :chapters="Y_CHAPTERS"
    title="运算律：德摩根与分配" sub="恒等式的证明不必背图 —— 只需让元素逐一检验：「属于左式」与「属于右式」永远同成立或同不成立，恒等式就成立了。左右双面板各搭各的区域，八个元素逐一验证；顺便看清集合运算律与逻辑等价式是同一结构的两种表达。"
    :toc="[{ id: 'y3-elem', t: '元素观点：逐个核验' }, { id: 'y3-logic', t: '与逻辑的同构' }, { id: 'y3-pit', t: '穿过括号要翻转' }]">
    <div class="note good" id="y3-law"><strong>德摩根律</strong>：<Katex tex="\complement_U(A\cap B)=\complement_UA\cup\complement_UB" />、<Katex tex="\complement_U(A\cup B)=\complement_UA\cap\complement_UB" /> —— 补集穿过括号，∩∪ 互换。<strong>分配律</strong>：<Katex tex="A\cap(B\cup C)=(A\cap B)\cup(A\cap C)" />、<Katex tex="A\cup(B\cap C)=(A\cup B)\cap(A\cup C)" />（交对并、并对交都成立）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createDM" />
      <div class="cap">图 Y3 · <b>德摩根验证机</b>：左面板按定义直译搭区域、右面板按恒等式右端搭 —— 八个元素各自判属，两式同时命中、同时落空；四组恒等式（德摩根两式 + 分配律两式）逐组验收，🎲 随机撒点也拆不散这对双胞胎。</div>
    </div>

    <h3 class="sec" id="y3-elem">元素观点：逐个核验</h3>
    <p>证明 <Katex tex="\complement_U(A\cap B)=\complement_UA\cup\complement_UB" /> 的标准动作只有一行：<strong>任取 x</strong> —— 左边说「x 在 U 内且不同时在 A、B 里」，右边说「x 在 U 内且不在 A，或在 U 内且不在 B」—— 「不同在 A、B」与「至少缺一边」一字不差，所以两边的元素清单完全一致，由外延性（X1 的 <Katex tex="A=B\iff"/> 互相包含）恒等式成立。图 Y3 把这套「逐个核验」做成双面板：左式按定义直译搭区域、右式按右端搭，八个元素两边各自判属 —— <strong>怎么搭不重要</strong>，命中清单永远相同（① 组 7 命中、② 组 3 命中、③ 组 2 命中、④ 组 3 命中）。点 🎲 随机撒点，左右照样同步 —— 因为恒等式的成立靠的是「任取 x」的推理，与这八个元素落在哪里无关。</p>

    <h3 class="sec" id="y3-logic">与逻辑的同构</h3>
    <p>把集合语言按词典翻译成逻辑语言 —— ∩ 换 ∧、∪ 换 ∨、<Katex tex="\complement_U" /> 换 ¬、∈ 换真值 —— 德摩根律立即变成逻辑等价式：<Katex tex="\neg(p\wedge q)=\neg p\vee\neg q" />、<Katex tex="\neg(p\vee q)=\neg p\wedge\neg q" />。「不同时为真」就是「至少一个为假」—— Y2 提示三里「恒成立取反面」的每一步（且换成或、全称换存在），支撑这一点的正是这两条。分配律同样有逻辑孪生：<Katex tex="p\wedge(q\vee r)=(p\wedge q)\vee(p\wedge r)" />。这不是巧合而是<strong>同构</strong>：集合的成员关系与命题的真值关系服从同一套代数规则 —— 模块的第四部分「常用逻辑」（量词、否定与推理）将沿着这条对角线正式开讲，谓词逻辑的一切推演规则都能在这台核验机上预先演示。</p>

    <h3 class="sec" id="y3-pit">穿过括号要翻转</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：补集穿括号忘翻转。</strong><Katex tex="\complement_U(A\cap B)" /> 常被错写成 <Katex tex="\complement_UA\cap\complement_UB" /> —— 补集穿过括号，∩ 必须换成 ∪（图 Y3 的 ① 组左右对照正是为这一错而设）；同理 <Katex tex="A\setminus(B\cap C)\ne A\setminus B\cap A\setminus C" />，差集展开同样要按德摩根走。</li>
        <li><strong>提示二：直觉出错。</strong>「A∪B 挖去 A」直觉上想剩 B，实际 <Katex tex="(A\cup B)\setminus A=B\setminus A" /> —— 差集运算不满足交换律，先圈定谁、再减去谁，顺序要写清楚。</li>
        <li><strong>提示三：证明用图代替推理。</strong>用图去「验证」恒等式只在教学上成立，书写证明时必须落回元素观点的「任取 x，⟺ 链」—— 图 Y3 的核验是直觉脚手架，证明完成后即拆除。</li>
      </ul>
    </div>
    <p>恒等式得到验证，最后一章把整套运算放到数轴上实际应用 —— 不等式组的解集 = 各解集之交，端点开闭由「能否取等」直接判定。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDM } from '../../../boards/sets/ops/demorgan.js';
import { Y_CHAPTERS } from './ynav.js';
</script>
