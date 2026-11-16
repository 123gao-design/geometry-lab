<template>
  <ChPage :cur="2" no="计2" base="/combinatorics/c" :chapters="CC_CHAPTERS"
    title="排列数与排列"
    sub="从 n 个不同元素里取出 m 个，按顺序排成一列，叫一个排列。第 1 位有 n 种选法，之后每排一位就少一个元素可选，选法逐位连乘，得到排列数。"
    :toc="[{ id: 'c2-def', t: '排列的定义' }, { id: 'c2-for', t: '排列数公式' }, { id: 'c2-fac', t: '阶乘与全排列' }, { id: 'c2-pit', t: '元素重复与有无顺序' }]">
    <div class="note good" id="c2-def">从 <Katex tex="n" /> 个不同元素中取出 <Katex tex="m" /> 个（<Katex tex="m\leq n" />），按照一定的顺序排成一列，叫做从 <Katex tex="n" /> 个不同元素中取出 <Katex tex="m" /> 个元素的一个<b>排列</b>；所有排列的个数记作 <Katex tex="\mathrm{A}_n^m" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPermLab" />
      <div class="cap">图 计2 · <b>排列数机</b>：上方格子按位编号，格下写着这一位还剩几个元素可选；下方圆片是元素池，金色虚线连出其中一种排法。看点：拖 <Katex tex="m" /> 增减格子，每位可选数从 <Katex tex="n" /> 起逐位减 1；拖 <Katex tex="n" /> 改元素池大小，徽章里排列数与阶乘式同步改写；取满 <Katex tex="m=n" /> 时判读改成全排列，结果是 <Katex tex="n!" />。</div>
    </div>

    <h3 class="sec" id="c2-def">排列的定义</h3>
    <p>「<Katex tex="n" /> 个不同元素」是前提，元素彼此可分辨；「取出 <Katex tex="m" /> 个」意味着不重复取；「按顺序排成一列」是关键——同一批元素换个次序就是另一个排列。例如从甲乙丙中取两个排队，甲乙与乙甲算两种。</p>
    <p>图 计2 把一次排列画成上下两排：格子在上一排表示位置，元素池在下一排。<b>连线标出的只是其中一种具体排法</b>，徽章里数的则是全部排法的个数。</p>

    <h3 class="sec" id="c2-for">排列数公式</h3>
    <p>逐位来数，用的是计1 的乘法原理。第 1 位从 <Katex tex="n" /> 个元素中任取一个，有 <Katex tex="n" /> 种；第 2 位只剩下 <Katex tex="n-1" /> 个可选；如此下去，第 <Katex tex="m" /> 位剩下 <Katex tex="n-m+1" /> 个。每一步都没有重复，所以相乘：</p>
    <p style="text-align:center"><Katex tex="\mathrm{A}_n^m=n(n-1)(n-2)\cdots(n-m+1)" /></p>
    <p>公式里一共 <Katex tex="m" /> 个因子，从 <Katex tex="n" /> 起连乘到 <Katex tex="n-m+1" /> 止。因子个数与取出的元素个数相同，这是最容易数错的地方——写成 <Katex tex="n(n-1)\cdots(n-m)" /> 就多算了一个因子。</p>

    <h3 class="sec" id="c2-fac">阶乘与全排列</h3>
    <p>把公式补全到 1 再除掉多余的因子，得到 <Katex tex="\mathrm{A}_n^m=\dfrac{n!}{(n-m)!}" />。其中 <Katex tex="n!=n(n-1)\cdots2\cdot1" /> 叫 <Katex tex="n" /> 的阶乘，并约定 <Katex tex="0!=1" />。</p>
    <p>取 <Katex tex="m=n" /> 时 <Katex tex="\mathrm{A}_n^n=n!" />，称为全排列：所有元素都排进队列，选法从 <Katex tex="n" /> 逐位降到 1。约定的 <Katex tex="0!=1" /> 正是为了让公式在 <Katex tex="m=n" /> 时也成立，此时分母为 <Katex tex="(n-n)!=1" />，不改变结果。</p>

    <h3 class="sec" id="c2-pit">元素重复与有无顺序</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="m" /> 不能超过 <Katex tex="n" />。</strong>取出数大于元素总数时排列数为零，公式的分母出现负数的阶乘，本身就没有定义。题目给的条件先核对一遍再套公式。</li>
        <li><strong>提示二：元素有重复时不能直接用 <Katex tex="\mathrm{A}_n^m" />。</strong>公式的前提是元素彼此不同。字母 AAB 全排只有 3 种而不是 <Katex tex="3!=6" /> 种，相同的排列被数了两次，要再除以重复元素个数的阶乘。</li>
        <li><strong>提示三：题目没提顺序就别用排列数。</strong>「选出 3 个人组成小组」只要成员，不管排队次序，用的是排1 的组合数。判断方法：把选中的人换个位置，结果算不算另一种做法——算就是排列，不算就是组合。</li>
        <li><strong>提示四：分步的每一步必须独立计数。</strong>有附加条件时（某人不能站首位、两人必须相邻），先处理限制再乘，或者用排2 的捆绑与插空，别在公式外面随手加减。</li>
      </ul>
    </div>
    <p>回收与预告：计1 的乘法原理在这里被反复套用 <Katex tex="m" /> 次，公式只是把这条原理写成一行。排1 撤掉「顺序」这条限制，同一批元素不再区分先后，排列数随之除以 <Katex tex="m!" />，那就是组合数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPermLab } from '../../../boards/combinatorics/counting/permlab.js';
import { CC_CHAPTERS } from './ccnav.js';
</script>
