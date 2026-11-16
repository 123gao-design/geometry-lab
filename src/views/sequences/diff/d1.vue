<template>
  <ChPage :cur="1" no="等1" base="/sequences/d" :chapters="DQ_CHAPTERS"
    title="等差数列：定义、通项与等差中项"
    sub="相邻两项的差恒定，这样的数列叫等差数列。通项由此一次算出，所有的项落在一条直线上，斜率就是公差。"
    :toc="[{ id: 'd1-def', t: '定义与公差' }, { id: 'd1-fn', t: '通项是一次函数' }, { id: 'd1-mid', t: '等差中项' }, { id: 'd1-pit', t: '公差、序号与项数' }]">
    <div class="note good">如果一个数列从第 2 项起，每一项与它的前一项的差都等于同一个常数，这个数列叫做<strong>等差数列</strong>，这个常数叫做<strong>公差</strong>，通常记作 <Katex tex="d" />。用式子写就是 <Katex tex="a_{n+1}-a_n=d" />（<Katex tex="n\in\mathbb{N}^*" />），等价于 <Katex tex="a_{n+1}=a_n+d" />。由首项与公差可以逐项写出整列数：<Katex tex="a_n=a_1+(n-1)d" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createDiffSeq" />
      <div class="cap">图 等1 · <b>等差序列机</b>：上栏是各项在坐标平面上的位置，金色虚线把通项放宽到实数，所成的直线斜率就是公差；下栏把相邻两项的差逐对画成点，全部落在同一条水平线上。拖动「公差 d」：d 的正负改变直线的升降，d=0 时全部项重合为一条水平线。拖动「n」用投影线读出第 n 项。</div>
    </div>

    <h3 class="sec" id="d1-def">定义与公差</h3>
    <p>定义只要求「差恒定」，没有限制差的符号。公差为正，数列递增；公差为负，数列递减；公差为零，各项相等，是常数列。这三类在图 等1 的预设 ①②③ 中各占一格，下栏的差分点都停在同一条水平线上，只是高度不同。</p>
    <p>公差由任意相邻两项作差算出：<Katex tex="d=a_{n+1}-a_n" />。用两项不一定相邻的项算，须先除以间隔的项数：<Katex tex="d=\dfrac{a_m-a_n}{m-n}" />（<Katex tex="m\ne n" />）。这一步与一次函数求斜率是同一个除法，后面 等1 的第二节就是从这个角度看的。</p>

    <h3 class="sec" id="d1-fn">通项是一次函数</h3>
    <p>把递推式逐次代入：<Katex tex="a_2=a_1+d" />，<Katex tex="a_3=a_1+2d" />，……，一般有 <Katex tex="a_n=a_1+(n-1)d" />。整理成 <Katex tex="a_n=dn+(a_1-d)" />，右边是序号 <Katex tex="n" /> 的一次式。记 <Katex tex="k=d" />，<Katex tex="b=a_1-d" />，则 <Katex tex="a_n=kn+b" />。</p>
    <p>反过来，任何形如 <Katex tex="a_n=kn+b" /> 的数列都是等差数列，公差就是 <Katex tex="k" />。理由：<Katex tex="a_{n+1}-a_n=k(n+1)+b-(kn+b)=k" />，差与 <Katex tex="n" /> 无关。所以在坐标平面上，等差数列的项全落在直线 <Katex tex="y=dx+(a_1-d)" /> 上，图 等1 的金色虚线正是这条直线。</p>
    <p>这条线与函数模块 E1 的一次函数是同一个对象，定义域从全体实数缩到正整数。斜率、截距、升降这些性质随之搬过来：<Katex tex="d>0" /> 对应递增，<Katex tex="d<0" /> 对应递减。不同的只有定义域，所以图象是一列孤立的点，而不是整条线。</p>

    <h3 class="sec" id="d1-mid">等差中项</h3>
    <p>若 <Katex tex="a,A,b" /> 三数成等差数列，则 <Katex tex="A" /> 叫做 <Katex tex="a" /> 与 <Katex tex="b" /> 的<strong>等差中项</strong>。由 <Katex tex="A-a=b-A" /> 得 <Katex tex="2A=a+b" />，即 <Katex tex="A=\dfrac{a+b}{2}" />。任取等差数列中下标连续的三个项，中间一项总是前后两项的算术平均：<Katex tex="2a_{n}=a_{n-1}+a_{n+1}" />。</p>
    <p>中项不必是整数，也不要求为正：<Katex tex="2" /> 与 <Katex tex="5" /> 的等差中项是 <Katex tex="3.5" />，<Katex tex="-1" /> 与 <Katex tex="4" /> 的等差中项是 <Katex tex="1.5" />。两个数有且只有一个等差中项，这一点与等比中项不同（后者有正负两个候选，还要排除 0）。</p>

    <h3 class="sec" id="d1-pit">公差、序号与项数</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：通项里的 <Katex tex="n-1" /> 不能写成 <Katex tex="n" />。</strong>首项是 <Katex tex="a_1" />，从第 1 项走到第 <Katex tex="n" /> 项共跨 <Katex tex="n-1" /> 步，每步加一个 <Katex tex="d" />。写 <Katex tex="a_n=a_1+nd" /> 相当于把首项当成 <Katex tex="a_0" />，回代 <Katex tex="n=1" /> 立刻能验出不符。</li>
        <li><strong>提示二：公差可以是分数、负数、零。</strong>题目给「公差为 2」与「递减数列」并不矛盾——后者只说 <Katex tex="d<0" />。另外，由 <Katex tex="a_1,a_3,a_5" /> 三项判定时也要先确认它们确为同一个数列的项，不能把下标差当成项数差。</li>
        <li><strong>提示三：首项不一定是正数。</strong>「递增」与「各项为正」是两件事：<Katex tex="-3,-1,1,3,\dots" /> 公差为 2 而在前两项为负，判断符号性质要逐项看，不能凭公差的正负下结论。</li>
        <li><strong>提示四：用两项求公差要除以项数差。</strong>已知 <Katex tex="a_2=5" />、<Katex tex="a_6=17" />，公差是 <Katex tex="\dfrac{17-5}{6-2}=3" />；若直接写 <Katex tex="17-5=12" /> 就把它当成了 12，代回通项即错。</li>
      </ul>
    </div>
    <p>回收与预告：这一章把等差数列还原成了一次函数，定义域换成正整数；下一章讲由「下标和相等」引出的性质，以及判定一个数列为等差数列的三种办法；等3 把这些项加起来，用倒序相加与面积两块画板给出求和公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDiffSeq } from '../../../boards/sequences/diff/diffseq.js';
import { DQ_CHAPTERS } from './dnav.js';
</script>
