<template>
  <ChPage :cur="2" no="数2" base="/sequences/s" :chapters="SQ_CHAPTERS"
    title="递推公式：由上一步走到下一步"
    sub="不是每个数列都能写出通项。递推公式给出初始项与相邻项之间的运算关系，整列数就此唯一确定；由前面的项算出后一项，是数列最原始的生成方式。"
    :toc="[{ id: 's2-recur', t: '递推公式的样子' }, { id: 's2-gen', t: '逐项生成' }, { id: 's2-relation', t: '递推与通项' }, { id: 's2-pit', t: '初始项与取值范围' }]">
    <div class="note good" id="s2-def">如果已知数列的第 1 项（或前几项），并且任一项 <Katex tex="a_n" /> 与它前面的项之间的关系可以用一个式子表示，这个式子叫做<strong>递推公式</strong>。初始项与递推公式合在一起，确定唯一的数列：第一项定下，第二项随之定下，第三项又由前两项定下，如此逐项向右推到底。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRecur" />
      <div class="cap">图 数2 · <b>递推生成机</b>：四种递推式逐项生成。橙框是参与这一项的已知项，金框是刚推出的一项，绿色箭头表示一次递推；下列给出数值代入的过程。点「下一步」每按一次多推一项，最多显示 8 项。看点：① 与 ② 只需前一项，③ 要前两项，④ 每次加上的数本身在变大。</div>
    </div>

    <h3 class="sec" id="s2-recur">递推公式的样子</h3>
    <p>递推公式把一个项写成它前面几项的运算结果。最简的是<strong>一阶</strong>递推，只用到前一项：<Katex tex="a_{n+1}=a_n+2" />、<Katex tex="a_{n+1}=2a_n" />、<Katex tex="a_{n+1}=a_n+n" />。右边可以含 <Katex tex="n" />，于是每一次加上（或乘上）的量本身也在变化，图 数2 的 ④ 就是这样：加数依次为 1, 2, 3, …，得到的项是 <Katex tex="1,2,4,7,11,\dots" />。</p>
    <p><strong>二阶</strong>递推要用前两项，典型的是斐波那契数列：<Katex tex="a_1=a_2=1" />，<Katex tex="a_{n+1}=a_n+a_{n-1}" />（<Katex tex="n\ge2" />）。它给出的项是 1, 1, 2, 3, 5, 8, 13, 21, …，每一项等于前两项之和。阶数最高用到前几项，初始条件就要给几项。</p>
    <p>递推公式与通项公式回答的是两个问题：通项公式直接算出第 n 项，递推公式只说明后一项怎样由前项得到。前者是「一览表」，后者是「加工流程」。</p>

    <h3 class="sec" id="s2-gen">逐项生成</h3>
    <p>递推的用法是顺着推。给出 <Katex tex="a_1=1" /> 与 <Katex tex="a_{n+1}=2a_n" />，依次算得 <Katex tex="a_2=2" />、<Katex tex="a_3=4" />、<Katex tex="a_4=8" />、<Katex tex="a_5=16" />；每一步只用到上一步的结果，不需要知道后面发生什么。这种「由已知推未知」的顺序，与数学归纳法里「从 <Katex tex="n" /> 推到 <Katex tex="n+1" />」的传递步骤是同一个动作，归1 会把它写成严格的证明格式。</p>
    <p>为什么递推公式加初始项能唯一确定数列？把每一项看成一次计算：<Katex tex="a_1" /> 由题设给定，<Katex tex="a_2" /> 由 <Katex tex="a_1" /> 算出，<Katex tex="a_3" /> 由前面的项算出……对任意指定的 <Katex tex="n" />，总能在有限步内算到 <Katex tex="a_n" />，且每一步的计算结果唯一。唯一性是<strong>逐项算出来</strong>的，不需要先知道通项。</p>

    <h3 class="sec" id="s2-relation">递推与通项</h3>
    <p>有些递推能解出简洁的通项。等差型 <Katex tex="a_{n+1}=a_n+d" /> 逐项累加，得 <Katex tex="a_n=a_1+(n-1)d" />；等比型 <Katex tex="a_{n+1}=qa_n" /> 逐项累乘，得 <Katex tex="a_n=a_1q^{\,n-1}" />。这两种解法分别叫累加法和累乘法，下一子专题 递1 系统地讲。</p>
    <p>有些递推给不出初等形式的通项。斐波那契数列的通项（比内公式）含无理数 <Katex tex="\sqrt5" />：
      <Katex tex="a_n=\frac{1}{\sqrt5}\left[\left(\frac{1+\sqrt5}{2}\right)^n-\left(\frac{1-\sqrt5}{2}\right)^n\right]" display />，
      它照样成立，只是形式复杂、高中不作要求。要紧的是：<strong>没有简洁通项，不等于数列不确定</strong>——每一项的值仍然唯一。高考里常见的是「给出递推，证明某个由 <Katex tex="a_n" /> 构成的式子为等差或等比」，把陌生递推化归成两种熟悉的递推，这正是 递2 的构造法。</p>

    <h3 class="sec" id="s2-pit">初始项与取值范围</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只给递推式，不给初始项，数列不唯一。</strong><Katex tex="a_{n+1}=2a_n" /> 配上 <Katex tex="a_1=1" /> 得 1, 2, 4, 8, …；配上 <Katex tex="a_1=3" /> 得 3, 6, 12, 24, …。初始项是题目的一部分，抄题时不能漏。</li>
        <li><strong>提示二：递推式的下标范围要写清。</strong><Katex tex="a_{n+1}=a_n+a_{n-1}" /> 在 <Katex tex="n=1" /> 时出现 <Katex tex="a_0" />，没有意义，所以必须注明 <Katex tex="n\ge2" />。一阶递推同样要注明 <Katex tex="n\ge1" />，只是习惯上常省略。</li>
        <li><strong>提示三：从递推式推通项，回代校验第一步。</strong>解出的通项若在 <Katex tex="n=1" /> 处与题目给的 <Katex tex="a_1" /> 不符，须分段写：<Katex tex="a_1" /> 单独给，<Katex tex="n\ge2" /> 用通式。这与数3 里由 <Katex tex="S_n" /> 求 <Katex tex="a_n" /> 的易错点是同一个：作差、累加这类运算往往只在 <Katex tex="n\ge2" /> 成立。</li>
      </ul>
    </div>
    <p>回收与预告：数1 的通项是把序号直接映射到项，数2 的递推是把前项映射到后项，两种方式描述的是同一个数列。数3 从求和的角度再给一条换算：前 n 项和 <Katex tex="S_n" /> 与通项 <Katex tex="a_n" /> 相差一次减法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRecur } from '../../../boards/sequences/concept/recurgen.js';
import { SQ_CHAPTERS } from './sqnav.js';
</script>
