<template>
  <ChPage :cur="3" no="和3" base="/sequences/h" :chapters="HQ_CHAPTERS"
    title="倒序相加、并项与奇偶分论"
    sub="有些数列的正序与倒序能逐项配成常数，两式相加即可；有些数列相邻两项成对抵消，括起来就能求和；还有一类必须先分 n 为奇数、偶数两段，再合并结果。"
    :toc="[{ id: 'h3-rev', t: '倒序相加的条件' }, { id: 'h3-pair', t: '并项：相邻成对' }, { id: 'h3-parity', t: '奇偶分论' }, { id: 'h3-pit', t: '末项与合并' }]">
    <div class="note good">若对一切 <Katex tex="k" /> 都有 <Katex tex="a_k+a_{n+1-k}=C" />（常数），则 <Katex tex="2S_n=nC" />，<Katex tex="S_n=\dfrac{nC}{2}" />。若相邻两项之和恒为常数，则把它们括成对求和。若通项含 <Katex tex="(-1)^n" /> 或分段给出，先按 <Katex tex="n" /> 的奇偶分别求，再合成。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPairParity" />
      <div class="cap">图 和3 · <b>并项求和与奇偶分论</b>：正项画在基线上方（蓝），负项画在下方（橙），相邻两项用绿色括号括成一对，每对的和都是 <Katex tex="-1" />。n 为偶数时正好配完，<Katex tex="S_n=-\dfrac n2" />；n 为奇数时最末一个正项没有配对，要单独加上。拖动 n 看最后一项的处理。</div>
    </div>

    <h3 class="sec" id="h3-rev">倒序相加的条件</h3>
    <p>把 <Katex tex="S_n=a_1+a_2+\dots+a_n" /> 正着写一遍，再倒着写一遍：</p>
    <p style="text-align:center"><Katex tex="S_n=a_n+a_{n-1}+\dots+a_1" display /></p>
    <p>若首尾配对的和恒为同一个数 <Katex tex="C" />，即 <Katex tex="a_k+a_{n+1-k}=C" />，两式相加就把 <Katex tex="n" /> 项变成 <Katex tex="n" /> 个常数：<Katex tex="2S_n=nC" />。等3 的等差数列求和正是这一情形，那里 <Katex tex="C=a_1+a_n" />。</p>
    <p>这一方法的门槛比看上去高：配对和必须对每个 <Katex tex="k" /> 都相等。只在前几项相等而后面对不上，就不能用。检验的办法是写出 <Katex tex="a_k+a_{n+1-k}" /> 的表达式，看它是否与 <Katex tex="k" /> 无关。等差数列、以及形如 <Katex tex="a_k=f(k)+f(n+1-k)" /> 的对称构造满足这个条件。</p>
    <p>倒序相加与裂项相消、错位相减一样，都是「把 n 项压成少数几项」。区别在于压缩的方式：裂项靠相邻两项的尾巴对消，错位相减靠两列错开对消，倒序相加靠首尾配对。</p>

    <h3 class="sec" id="h3-pair">并项：相邻成对</h3>
    <p>若相邻两项之和为常数，即 <Katex tex="a_{2j-1}+a_{2j}=C" />，就把它们括成一对，<Katex tex="n" /> 项变成 <Katex tex="\dfrac n2" /> 对（<Katex tex="n" /> 为偶数时）。</p>
    <p>图 和3 的例子是 <Katex tex="a_k=(-1)^{k+1}k" />：数列为 <Katex tex="1,-2,3,-4,\dots" />，每对的和是 <Katex tex="(2j-1)-2j=-1" />。于是 <Katex tex="n" /> 为偶数时</p>
    <p style="text-align:center"><Katex tex="S_n=-1-1-\dots-1=-\dfrac n2" />（<Katex tex="n" /> 为偶数）</p>
    <p>并项与分组是相反的动作：分组把一项拆成几段，并项把几项合成一段。选哪一种，看通项的结构——通项本身是几段已知数列的和，就分组；相邻两项相加后变简单，就并项。</p>
    <p>并项后还要检查项数：<Katex tex="n" /> 为奇数时最后一项落单，不能硬凑成对。这一项要单独处理，通常正是分奇偶讨论的起点。</p>

    <h3 class="sec" id="h3-parity">奇偶分论</h3>
    <p>通项含 <Katex tex="(-1)^n" /> 或分奇偶给出不同表达式时，<Katex tex="S_n" /> 往往要分两段写。做法是先设 <Katex tex="n=2m" /> 与 <Katex tex="n=2m-1" /> 分别求和，再把结果合成关于 <Katex tex="n" /> 的分段式，条件允许时合并成一个带 <Katex tex="(-1)^n" /> 的式子。</p>
    <p>以图 和3 的数列为例。<Katex tex="n" /> 为偶数时已得 <Katex tex="S_n=-\dfrac n2" />；<Katex tex="n" /> 为奇数时，前 <Katex tex="n-1" /> 项配成 <Katex tex="\dfrac{n-1}{2}" /> 对，末项 <Katex tex="+n" /> 单独留下：</p>
    <p style="text-align:center"><Katex tex="S_n=-\dfrac{n-1}{2}+n=\dfrac{n+1}{2}" />（<Katex tex="n" /> 为奇数）</p>
    <p>两段可以合成 <Katex tex="S_n=\dfrac{(-1)^{n+1}(2n+1)-1}{4}" />，也可以保留分段式。保留分段式更清楚，考场上也不易写错。</p>
    <p>再看一个需要合并的例子：<Katex tex="a_n=n+(-1)^n" />。前 <Katex tex="2m" /> 项中 <Katex tex="(-1)^k" /> 正负各半、和为 0，所以 <Katex tex="S_{2m}=\dfrac{2m(2m+1)}{2}=m(2m+1)" />；前 <Katex tex="2m+1" /> 项多一个 <Katex tex="-1" />，即 <Katex tex="S_{2m+1}=(2m+1)(m+1)-1" />。合成一式是 <Katex tex="S_n=\dfrac{n(n+1)}{2}+\dfrac{(-1)^n-1}{2}" />，代 <Katex tex="n" /> 的奇偶各验一次即可确认。</p>

    <h3 class="sec" id="h3-pit">末项与合并</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：并项后要数清对数。</strong><Katex tex="n" /> 为偶数时有 <Katex tex="\dfrac n2" /> 对；<Katex tex="n" /> 为奇数时有 <Katex tex="\dfrac{n-1}{2}" /> 对再加一个落单项。把奇数情形也写成 <Katex tex="\dfrac n2" /> 对，会凭空多出半项。</li>
        <li><strong>提示二：倒序相加的配对和必须恒定。</strong>先用通项算出 <Katex tex="a_k+a_{n+1-k}" />，确认它与 <Katex tex="k" /> 无关，再相加。否则两式相加后仍是 <Katex tex="k" /> 的函数，没有化简。</li>
        <li><strong>提示三：分段结果不能随手合并。</strong>两段式若在 <Katex tex="n" /> 的奇偶上不同，合并时要用 <Katex tex="(-1)^n" /> 或 <Katex tex="\dfrac{1+(-1)^n}{2}" /> 这类开关因子，并在 <Katex tex="n=1,2" /> 处各验一次。</li>
        <li><strong>提示四：求和之前先写出通项。</strong>只凭前几项猜规律，容易把 <Katex tex="n" /> 为奇数时的落单项漏掉。题目给出递推式时，先求出通项再求和；求不出通项时，才考虑并项或分奇偶。</li>
        <li><strong>提示五：多种手法可以合用。</strong>通项既是「正负交替」又是「等差乘等比」时，先分组或先并项，再用错位相减，顺序不同计算量不同，但结果必须一致。求出结果后代入前两三项验算，是最省事的检查。</li>
      </ul>
    </div>
    <p>回收与预告：倒序相加在 等3 已用于等差数列，本节把它抽成一般条件；并项与奇偶分论把 数1 的「分段」想法用在求和上。数列求和的三章到此结束，接下来 归1 与 归2 讲数学归纳法，用1 与 用2 讲数列在实际问题与不等式中的用法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPairParity } from '../../../boards/sequences/sum/pairparity.js';
import { HQ_CHAPTERS } from './hnav.js';
</script>
