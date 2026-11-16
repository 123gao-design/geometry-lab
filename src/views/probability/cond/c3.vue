<template>
  <ChPage :cur="3" no="独3" base="/probability/c" :chapters="COND_CHAPTERS"
    title="相互独立与独立重复试验"
    sub="一个事件发生与否不影响另一个事件的概率，两个事件就相互独立，同时发生的概率可以直接相乘。把这件事重复做 n 次，就得到独立重复试验的算法。"
    :toc="[{ id: 'c3-def', t: '相互独立的定义' }, { id: 'c3-prop', t: '独立的性质与判定' }, { id: 'c3-rep', t: '独立重复试验' }, { id: 'c3-pit', t: '互斥与独立、两两与相互' }]">
    <div class="note good" id="c3-def">若 <Katex tex="P(A\cap B)=P(A)P(B)" />，称事件 <Katex tex="A" /> 与 <Katex tex="B" /> 相互独立。等价地，<Katex tex="P(A)>0" /> 时 <Katex tex="P(B\mid A)=P(B)" /> —— 知道 <Katex tex="A" /> 发生不改变 <Katex tex="B" /> 的概率。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRepeatLab" />
      <div class="cap">图 独3 · <b>独立与重复试验机</b>：① 档用单位正方形，横竖两刀把它分成四格，四格面积正是「都中、只中一人、都不中」的概率，两个滑块分别改甲、乙命中的概率；② 档把同一件事重复 <Katex tex="n" /> 次，金色曲线是「至少中一次」，蓝色是「一次都不中」。看点：两刀滑动时四格面积始终是各自概率相乘；② 档里每加一次，蓝线乘以 <Katex tex="1-p" />，金线也就抬一截。</div>
    </div>

    <h3 class="sec" id="c3-def">相互独立的定义</h3>
    <p>甲、乙两人各自投篮，甲的命中率是 0.7，乙的是 0.5，两人互不知情、互不干扰。此时甲命中不影响乙命中的机会，同时命中的概率就是 <Katex tex="0.7\times0.5=0.35" />。图 独3 的 ① 档把这个模型画成正方形：横向按甲的概率切一刀、纵向按乙的概率切一刀，四块面积就是四种结果的概率，独立在这里表现为「面积可拆」。</p>
    <p>定义 <Katex tex="P(A\cap B)=P(A)P(B)" /> 是判断独立的依据，也可以由实际背景直接认定：有放回抽样、各装置独立工作、不同次投掷。由背景认定独立后，再用乘法算交事件的概率；若背景不独立，则要回到条件概率去算。</p>

    <h3 class="sec" id="c3-prop">独立的性质与判定</h3>
    <p>若 <Katex tex="A" /> 与 <Katex tex="B" /> 独立，则 <Katex tex="A" /> 与 <Katex tex="\overline{B}" />、<Katex tex="\overline{A}" /> 与 <Katex tex="B" />、<Katex tex="\overline{A}" /> 与 <Katex tex="\overline{B}" /> 也都独立。原因是「甲中乙不中」的概率 <Katex tex="P(A)(1-P(B))" /> 仍然可写成各自概率之积，把对立事件换成新的两刀，四格面积照样可拆。</p>
    <p>独立可以推广到多个事件：<Katex tex="A,B,C" /> 相互独立要求三个两两独立之外，还要 <Katex tex="P(ABC)=P(A)P(B)P(C)" />。两组独立的事件拼在一起也独立，例如「甲中且乙中」与「丙中」相互独立。</p>

    <h3 class="sec" id="c3-rep">独立重复试验</h3>
    <p>同样的试验重复 <Katex tex="n" /> 次、每次之间相互独立、每次成功的概率都是 <Katex tex="p" />，这叫独立重复试验（伯努利试验）。恰好成功 <Katex tex="k" /> 次的概率为 <Katex tex="\mathrm{C}_n^kp^k(1-p)^{n-k}" />：选哪 <Katex tex="k" /> 次成功是组合数，每次成功配 <Katex tex="p" />、其余配 <Katex tex="1-p" />。</p>
    <p>「至少成功一次」用对立事件最快：一次都不中的概率是 <Katex tex="(1-p)^n" />，所以至少一次为 <Katex tex="1-(1-p)^n" />。图 独3 的 ② 档画的正是这两条曲线：随 <Katex tex="n" /> 增大，蓝线指数下降、金线爬向 1。每加一次，全不中的机会乘以 <Katex tex="1-p" />，这是「乘法公式」在重复试验里的直接体现。随机变量与二项分布一章会把这个分布完整展开。</p>

    <h3 class="sec" id="c3-pit">互斥与独立、两两与相互</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：互斥与独立几乎不能同时成立。</strong>若 <Katex tex="P(A)>0" />、<Katex tex="P(B)>0" /> 且 <Katex tex="A" />、<Katex tex="B" /> 互斥，则 <Katex tex="P(A\cap B)=0" /> 而 <Katex tex="P(A)P(B)>0" />，两者不独立。互斥说的是不能同时发生，独立说的是互不影响，概念方向相反。</li>
        <li><strong>提示二：两两独立不保证相互独立。</strong>三个事件两两独立时，仍可能 <Katex tex="P(ABC)\ne P(A)P(B)P(C)" />。判断多个事件的独立性要逐条验证，不能只查两两。</li>
        <li><strong>提示三：条件概率相同才算独立。</strong><Katex tex="P(B\mid A)=P(B)" /> 与 <Katex tex="P(A\mid B)=P(A)" /> 只要一个成立另一个也成立（前提是概率都为正），但都不能与 <Katex tex="P(B\mid A)=P(A\mid B)" /> 混为一谈。</li>
        <li><strong>提示四：「独立」不能由直觉认定。</strong>「抽到红球」与「抽到 K」看似无关，实际不独立：<Katex tex="P(\text{红}K)=1/52" />，而 <Katex tex="P(\text{红})P(K)=13/52\times4/52\ne1/52" />。有无放回、是否相互影响，必须按定义核实。</li>
      </ul>
    </div>
    <p>回收与预告：独立把乘法公式中的条件概率化简为普通概率，是乘法公式的一个特例；独立重复试验则是二项分布的原型。分1 起进入随机变量：把试验结果映射成数，写出它的分布列。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRepeatLab } from '../../../boards/probability/cond/repeatlab.js';
import { COND_CHAPTERS } from './condnav.js';
</script>
