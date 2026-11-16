<template>
  <ChPage :cur="2" no="排2" base="/combinatorics/p" :chapters="CP_CHAPTERS"
    title="捆绑、插空与分组模型"
    sub="带附加条件的排列，先看条件长什么样：必须相邻就捆成一块，不能相邻就插空，分成几组则要看清两组是否等量——等量时组的顺序要除掉。"
    :toc="[{ id: 'p2-bind', t: '捆绑法' }, { id: 'p2-gap', t: '插空法' }, { id: 'p2-grp', t: '分组问题' }, { id: 'p2-pit', t: '内部顺序与组的顺序' }]">
    <div class="note good" id="p2-bind">三人排队、其中两人必须相邻：把两人捆成一块，与其余人一起排，再乘块内两人的顺序，共 <Katex tex="(n-1)!\times2!" /> 种；若要求两人不能相邻，先排其余人，再把两人放进不同的空档。</div>
    <div class="board-wrap">
      <BoardMount :factory="createModelLab" />
      <div class="cap">图 排2 · <b>限制条件的三种画法</b>：① 档金色方块把甲乙框在一起，块下方的 2! 是块内顺序；② 档虚线是空档，甲乙插进两个不同的空档；③ 档把元素分进两个方框，等量时两组互换不产生新分法。看点：拖人数滑块，三种计数结果同步改写；③ 档人数取奇数时判读改口，不必除以 2。</div>
    </div>

    <h3 class="sec" id="p2-bind">捆绑法</h3>
    <p>甲乙必须相邻。把两人看成一块，这块与其余 <Katex tex="n-2" /> 人排成一列，对象总数变成 <Katex tex="n-1" /> 个，排法 <Katex tex="(n-1)!" />；块内两人还有两种站位，块外每种排法都要乘上这 2 种。以 5 人为例，共 <Katex tex="4!\times2=48" /> 种。</p>
    <p>捆绑法的适用条件是「相邻」这一类可以整块搬运的要求。若要求三人互相相邻，就捆成一块、块内乘 <Katex tex="3!" />；若其中某两人之间还要求顺序固定，块内不再是 3! 而是 <Katex tex="\mathrm{C}_3^2\times 1\times1" /> 一类的数，得单独数。</p>

    <h3 class="sec" id="p2-gap">插空法</h3>
    <p>甲乙不能相邻。先把其余 <Katex tex="n-2" /> 人排好，排法 <Katex tex="(n-2)!" />；这排人之间连同两端一共 <Katex tex="n-1" /> 个空档，甲乙各占一个不同空档，谁在哪个空档也要分，共 <Katex tex="\mathrm{A}_{n-1}^{2}=(n-1)(n-2)" /> 种。以 5 人为例，<Katex tex="3!\times4\times3=72" /> 种。</p>
    <p>两种算法可以互相校验：不相邻的排法等于全部排法减去相邻的排法，<Katex tex="5!-4!\times2=120-48=72" />，与插空的结果一致。空档数总比已排人数多一，这是插空法唯一容易记错的地方。</p>

    <h3 class="sec" id="p2-grp">分组问题</h3>
    <p>把 <Katex tex="n" /> 个不同元素分成两组：选定一组，另一组自动确定，共 <Katex tex="\mathrm{C}_n^k" /> 种选法。关键看两组人数是否相同。人数不同时（如 5 人分成 3 人与 2 人），每种选法给出不同分组，<Katex tex="\mathrm{C}_5^3=10" /> 就是答案。</p>
    <p>人数相同时（如 6 人平均分成两组），选定第一组与选定它剩下的第 3 人合起来是同一分组，<Katex tex="\mathrm{C}_6^3=20" /> 种选法两两重合，实为 10 种。平均分成三组同理，要除以 <Katex tex="3!" />。若分好之后再交给不同的人或不同的位置，组与组重新可辨，就不必除。</p>

    <h3 class="sec" id="p2-pit">内部顺序与组的顺序</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：捆绑之后别忘块内。</strong>只写 <Katex tex="(n-1)!" /> 是「甲乙算一个人」的答案，块内两种站位漏掉一半的做法。</li>
        <li><strong>提示二：插空时两个元素不同。</strong>甲乙是两个不同的人，放进两个空档要计先后，用 <Katex tex="\mathrm{A}_{n-1}^{2}" /> 而不是 <Katex tex="\mathrm{C}_{n-1}^{2}" />；若换成两个完全相同的东西，才用组合数。</li>
        <li><strong>提示三：等量分组的商不能漏。</strong>平均分成两组除以 <Katex tex="2!" />、三组除以 <Katex tex="3!" />，因为组本身没有标号。不等量分组一律不除。</li>
        <li><strong>提示四：先区分再乘。</strong>带多个条件时按「分类相加、分步相乘」逐个处理，别把相邻与顺序两类限制混在一个式子里加减。</li>
      </ul>
    </div>
    <p>回收与预告：三种画法都建立在计1 的乘法原理上，组合数只在分组时出场。至此排列与组合两种计数工具齐了；项1 转向另一个方向，把「取或不取」的选择写成多项式，二项式定理的系数正是组合数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createModelLab } from '../../../boards/combinatorics/permcomb/modellab.js';
import { CP_CHAPTERS } from './cpnav.js';
</script>
