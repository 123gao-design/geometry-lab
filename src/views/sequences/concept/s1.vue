<template>
  <ChPage :cur="1" no="数1" base="/sequences/s" :chapters="SQ_CHAPTERS"
    title="数列：定义在正整数集上的函数"
    sub="把数按确定的顺序排成一列，就得到数列。序号 n 与项 aₙ 之间的对应是一个函数，定义域是正整数集；顺序一换，数列就变成另一个。"
    :toc="[{ id: 's1-what', t: '从排队说起' }, { id: 's1-fn', t: '数列是函数' }, { id: 's1-graph', t: '图象：正整数点上的孤立点' }, { id: 's1-pit', t: '顺序、记号与通项' }]">
    <div class="note good" id="s1-def">按一定顺序排列的一列数 <Katex tex="a_1,a_2,\dots,a_n,\dots" /> 叫做<strong>数列</strong>，其中第 <Katex tex="n" /> 项 <Katex tex="a_n" /> 叫做<strong>通项</strong>。若通项与序号的关系能用一个式子 <Katex tex="a_n=f(n)" />（<Katex tex="n\in\mathbb{N}^*" />）表示，这个式子叫做<strong>通项公式</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSeqFunc" />
      <div class="cap">图 数1 · <b>数列散点机</b>：五种通项各成一列点，横轴是序号 <Katex tex="n" />。金色虚线把通项放宽到实数后连成曲线，拖动 n 用投影线读出第 n 项。看点：④ 的一列点越来越贴近 x 轴，始终不超过 <Katex tex="y=1" />；⑤ 随 n 的奇偶在 x 轴上下交替，通项里的 <Katex tex="(-1)^n" /> 只有整数序号才有定义，这列点连不成一条实曲线。</div>
    </div>

    <h3 class="sec" id="s1-what">从排队说起</h3>
    <p>一列数 <Katex tex="1,3,5,7,\dots" /> 与另一列 <Katex tex="3,1,7,5,\dots" /> 含有的数完全一样，却是两个不同的数列。<strong>顺序</strong>是数列的一部分：第 1 项是 1 还是 3，决定了整列数的含义。这一条把数列与集合分开——集合只看元素、不看次序，且元素不重复；数列的项按位置排列，同一个数可以在不同位置出现两次（如 <Katex tex="1,1,2,3,5,\dots" />）。</p>
    <p>数列里每个位置上的数叫做<strong>项</strong>，第一个位置上的 <Katex tex="a_1" /> 叫首项，第 <Katex tex="n" /> 个位置上的 <Katex tex="a_n" /> 叫第 n 项，也统称通项。项数有限的叫有穷数列，项数无限的叫无穷数列；高中阶段讨论的多是无穷数列。</p>

    <h3 class="sec" id="s1-fn">数列是函数</h3>
    <p>序号 <Katex tex="n" /> 取 1, 2, 3, …，每一项 <Katex tex="a_n" /> 由 <Katex tex="n" /> 唯一确定，这正是一个函数的定义：定义域是正整数集 <Katex tex="\mathbb{N}^*" />，对应法则是 <Katex tex="n\mapsto a_n" />，值域是各不相同的项组成的集合。通项公式就是函数的解析式，只是它的自变量只能取正整数。</p>
    <p>把函数的一套语言搬过来，数列立刻有了性质。若对一切 <Katex tex="n" /> 都有 <Katex tex="a_{n+1}>a_n" />，数列<strong>递增</strong>；反之<strong>递减</strong>；各项相等时是<strong>常数列</strong>；正负号随 <Katex tex="n" /> 的奇偶翻转的，叫做<strong>摆动数列</strong>。若存在常数 <Katex tex="M" /> 使 <Katex tex="a_n\le M" /> 对一切 <Katex tex="n" /> 成立，数列有<strong>上界</strong>。图 数1 的判读依次给出这几种情形：② 是递增且无上界，④ 递减而有上界 1，⑤ 是摆动数列且趋近于 0。</p>
    <p>这里与函数模块 C1 的映射是一回事：定义域、对应法则、值域三件套，只是定义域从实数换成了 <Katex tex="\mathbb{N}^*" />。递增性在 S1 里用 <Katex tex="a_{n+1}-a_n" /> 的符号判断，与那里用 <Katex tex="f(x_1)-f(x_2)" /> 判断单调性的作差法完全同源。</p>

    <h3 class="sec" id="s1-graph">图象：正整数点上的孤立点</h3>
    <p>以序号 <Katex tex="n" /> 为横坐标、项 <Katex tex="a_n" /> 为纵坐标，数列的图象就是点集 <Katex tex="\{(n,a_n)\mid n\in\mathbb{N}^*\}" />。这些点彼此隔开，横坐标只取 1, 2, 3, …，点与点之间没有定义——同一个图象若用曲线连起来，连出的部分是函数的图象，不属于数列。</p>
    <p>图 数1 的金色虚线是给数学分析看的：把通项公式里的 <Katex tex="n" /> 换成实数 <Katex tex="x" />，就得到一条函数曲线，数列的点全落在曲线上。曲线的走向提示数列的趋势（④ 趋于 0、③ 越升越陡），但虚线本身不是数列。⑤ 的通项含 <Katex tex="(-1)^n" />，实数的幂没有定义，所以它没有这样一条曲线。</p>

    <h3 class="sec" id="s1-pit">顺序、记号与通项</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：由前几项猜出的通项只是猜想。</strong>给出 <Katex tex="1,2,4,8,\dots" />，通项可以写 <Katex tex="a_n=2^{n-1}" />，第 5 项是 16；也可以构造分段式子让第 5 项等于别的数。有限项永远定不了一个数列，通项公式必须由定义、递推关系或求和关系推出，再由 <Katex tex="n=1,2,3" /> 回代校验。</li>
        <li><strong>提示二：<Katex tex="a_n" /> 与 <Katex tex="\{a_n\}" /> 不是一回事。</strong><Katex tex="a_n" /> 是第 n 项，是一个数；<Katex tex="\{a_n\}" /> 表示整列数。写「<Katex tex="\{a_n\}" /> 递增」说的是整列数的走向，不能只说「<Katex tex="a_n" /> 递增」。</li>
        <li><strong>提示三：通项公式的 n 必须使式子有意义。</strong>若通项是 <Katex tex="a_n=\dfrac{1}{n-1}" />，<Katex tex="n=1" /> 时分母为零，这个数列的定义域实际是 <Katex tex="n\ge2" /> 的正整数，题目须写明序号从几开始。判断某项是否为数列中的项，也先要看该下标是否在定义域内。</li>
        <li><strong>提示四：数列的项可以重复，也可以不单调。</strong>「一列数」不要求互不相同，也不要求递增或递减；判断性质要逐项看，不能凭前几项的样子下结论。</li>
      </ul>
    </div>
    <p>回收与预告：C1 的映射三要素、C2 的「同一函数」判断，在这里换成定义域为 <Katex tex="\mathbb{N}^*" /> 的情形；数2 讲另一种给出数列的方式——递推公式，它不给通项，却同样确定整列数；数3 把这些项累加起来，引出 <Katex tex="S_n" /> 与 <Katex tex="a_n" /> 的换算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSeqFunc } from '../../../boards/sequences/concept/seqfunc.js';
import { SQ_CHAPTERS } from './sqnav.js';
</script>
