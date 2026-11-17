<template>
  <ChPage :cur="1" no="概1" base="/probability/g" :chapters="SAM_CHAPTERS"
    title="随机事件的关系与运算"
    sub="一次试验的全部可能结果组成样本空间，其中一部分结果组成随机事件。事件之间可以像集合那样取交、取并、取对立，概率便随这些运算拆开计算。"
    :toc="[{ id: 'g1-space', t: '样本空间与随机事件' }, { id: 'g1-ops', t: '事件的关系与运算' }, { id: 'g1-prob', t: '概率的基本性质' }, { id: 'g1-pit', t: '互斥与对立' }]">
    <div class="note good" id="g1-space">随机试验的一切可能结果组成的集合叫<b>样本空间</b> <Katex tex="\Omega" />，其中的每个结果是一个<b>样本点</b>；样本点的子集叫<b>随机事件</b>，只含一个样本点的是基本事件，<Katex tex="\Omega" /> 本身是必然事件，空集是不可能事件。</div>
    <div class="board-wrap">
      <BoardMount :factory="createEventOps" />
      <div class="cap">图 概1 · <b>事件的关系与运算</b>：样本空间里撒下 170 个等可能的样本点，蓝圆是事件 <Katex tex="A" />、橙圆是事件 <Katex tex="B" />，三个滑块分别改两个半径与圆心距。看点：① 档取并，蓝点橙点全亮；② 档取交，只剩两圆重叠处的紫点；③ 档取 <Katex tex="A" /> 的对立事件，圆外的点全亮。下面四枚徽章按点数读概率，可直接核对 <Katex tex="P(A\cup B)=P(A)+P(B)-P(A\cap B)" />；把圆拉到不相交，并的概率恰等于两概率之和。</div>
    </div>

    <h3 class="sec" id="g1-space">样本空间与随机事件</h3>
    <p>掷一枚骰子，样本空间是 <Katex tex="\Omega=\{1,2,3,4,5,6\}" />；「点数为偶数」是事件 <Katex tex="A=\{2,4,6\}" />，「点数大于 4」是事件 <Katex tex="B=\{5,6\}" />。试验的结果每出现一次，落在哪些事件里就逐一确定，所以事件完全可以当集合来用。</p>
    <p>写样本空间时要按同一个标准把结果列全：掷两枚骰子时用有序对 <Katex tex="(x,y)" />，共 36 个样本点；若只关心点数和，样本点就变成和的取值，各有不同的可能性，这时不能再用「个数比」算概率。样本空间怎么写，直接决定了后面能不能按等可能处理。</p>

    <h3 class="sec" id="g1-ops">事件的关系与运算</h3>
    <p>事件之间有与集合逐一对应的关系：<Katex tex="A\subseteq B" /> 表示 <Katex tex="A" /> 发生则 <Katex tex="B" /> 必发生；<Katex tex="A=B" /> 表示两事件含同样的样本点；<Katex tex="A\cap B" />（积事件）表示两事件同时发生；<Katex tex="A\cup B" />（和事件）表示至少有一个发生；<Katex tex="\complement_\Omega A" />（常记 <Katex tex="\overline{A}" />）表示 <Katex tex="A" /> 不发生。</p>
    <p>两个特别的关系要分清。<b>互斥</b>指 <Katex tex="A\cap B=\varnothing" />，两事件不可能同时发生，掷一次骰子时「点数 1」与「点数 2」互斥。<b>对立</b>指 <Katex tex="A\cap B=\varnothing" /> 且 <Katex tex="A\cup B=\Omega" />，除互不相容外还要求把样本空间分完，「点数为偶数」与「点数为奇数」对立。对立即互斥，互斥未必对立。</p>
    <p>图 概1 的三个档位把三种运算各画一遍。并档里两圆内外的点各有颜色；交档只剩重叠处的紫点；对立档把圆外的点全部点亮。拖动圆心距，两圆从相交到分离，交事件的点数一路减到零，对立的只是「圆内」与「圆外」这一对，与另一圆的位置无关。</p>

    <h3 class="sec" id="g1-prob">概率的基本性质</h3>
    <p>概率是给事件赋的一个数，满足三条：<Katex tex="0\le P(A)\le 1" />；<Katex tex="P(\Omega)=1" />；若 <Katex tex="A" />、<Katex tex="B" /> 互斥，则 <Katex tex="P(A\cup B)=P(A)+P(B)" />。由这三条推出常用的几条：<Katex tex="P(\varnothing)=0" />，<Katex tex="P(\overline{A})=1-P(A)" />，<Katex tex="A\subseteq B" /> 时 <Katex tex="P(A)\le P(B)" />。</p>
    <p>两事件不互斥时，可加性要补上重复计算的部分：<Katex tex="P(A\cup B)=P(A)+P(B)-P(A\cap B)" />。图 概1 的四枚徽章把四项都读出来，任意挪动圆的位置都满足这一条；两圆分离时 <Katex tex="P(A\cap B)=0" />，公式退化为直接相加。</p>

    <h3 class="sec" id="g1-pit">互斥与对立</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把互斥当成对立。</strong>互斥只排除同时发生，没有要求「至少有一个发生」。「点数为 1」与「点数为 2」互斥，但都不发生时还有四个结果，所以不对立。判断对立要两条都验证。</li>
        <li><strong>提示二：不互斥却直接相加。</strong><Katex tex="P(A\cup B)=P(A)+P(B)" /> 只在 <Katex tex="A\cap B=\varnothing" /> 时成立，一般情形必须减去交的概率，否则公共部分被算两次。</li>
        <li><strong>提示三：「至少」类事件正面算容易漏。</strong>「至少一次」「至少一人」这类说法用对立事件算：先求一个都没有的概率，再用 1 去减，比按次数分类相加稳妥。</li>
        <li><strong>提示四：「恰有一个」与「至少一个」不是一回事。</strong>前者是两个事件中恰好一个发生，后者还包含两个都发生，两者的样本点集合不同。</li>
      </ul>
    </div>
    <p>回收与预告：这一章的运算与集合的交、并、补完全对应，那几条运算律可以直接搬过来用。剩下的问题是概率值本身从哪里来 —— 概2 给出两条途径：用频率去稳定地估计，或者用长度、面积的比值直接算出来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createEventOps } from '../../../boards/probability/sample/eventops.js';
import { SAM_CHAPTERS } from './samnav.js';
</script>
