<template>
  <ChPage :cur="2" no="递2" base="/sequences/r" :chapters="RQ_CHAPTERS"
    title="构造法：aₙ₊₁ = paₙ + q"
    sub="递推式里拖着常数项 q，逐项算得通项很难。把整列数平移一个数 x，常数项消失，剩下的就是等比数列。"
    :toc="[{ id: 'r2-fix', t: '找平衡点' }, { id: 'r2-shift', t: '平移成等比' }, { id: 'r2-solve', t: '通项与收敛' }, { id: 'r2-pit', t: 'p=1、x 的算法与回代' }]">
    <div class="note good">对 <Katex tex="a_{n+1}=pa_n+q" />（<Katex tex="p\ne1" />），方程 <Katex tex="x=px+q" /> 的解 <Katex tex="x=\dfrac{q}{1-p}" /> 叫这个递推的<strong>不动点</strong>。令 <Katex tex="b_n=a_n-x" />，则 <Katex tex="b_{n+1}=pb_n" />，<Katex tex="\{b_n\}" /> 是公比为 <Katex tex="p" /> 的等比数列，于是 <Katex tex="a_n=x+(a_1-x)p^{n-1}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createConstr" />
      <div class="cap">图 递2 · <b>构造法机</b>：上栏是原数列 <Katex tex="a_n" />，金色虚线是平衡点 <Katex tex="x" />；下栏是平移后的 <Katex tex="b_n=a_n-x" />。两栏的点形状完全相同，只是整体差一个 <Katex tex="x" />，下栏的比恒为 <Katex tex="p" />。拖动 p：<Katex tex="|p|<1" /> 时下栏的点向 0 收缩，<Katex tex="|p|>1" /> 时向外散开，<Katex tex="p<0" /> 时正负交替；把 p 拖到 1 看退化情形。</div>
    </div>

    <h3 class="sec" id="r2-fix">找平衡点</h3>
    <p>先看递推式停在什么地方：如果数列从某一项起不再变化，即 <Katex tex="a_{n+1}=a_n=x" />，代回递推式得 <Katex tex="x=px+q" />。<Katex tex="p\ne1" /> 时它有唯一解 <Katex tex="x=\dfrac{q}{1-p}" />。</p>
    <p>这个解是「平衡位置」：项比 <Katex tex="x" /> 大，下一项会向 <Katex tex="x" /> 靠近还是远离，取决于 <Katex tex="p" /> 的大小；项恰等于 <Katex tex="x" /> 时，整列数就停在这个值上。图 递2 上栏的金色虚线就是这条水平线，下栏的 0 线与它对应。</p>
    <p>求 <Katex tex="x" /> 只须解一次方程，不必记忆公式：把 <Katex tex="a_{n+1}" />、<Katex tex="a_n" /> 都写成 <Katex tex="x" /> 即可。这与 递3 的分式递推用同一个思路，只是那里的不动点方程是二次的。</p>

    <h3 class="sec" id="r2-shift">平移成等比</h3>
    <p>令 <Katex tex="b_n=a_n-x" />。由 <Katex tex="a_{n+1}=pa_n+q" /> 与 <Katex tex="x=px+q" /> 两式相减：</p>
    <p style="text-align:center"><Katex tex="a_{n+1}-x=p(a_n-x)" display /></p>
    <p>即 <Katex tex="b_{n+1}=pb_n" />。<Katex tex="q" /> 被彻底消掉，<Katex tex="\{b_n\}" /> 是以 <Katex tex="b_1=a_1-x" /> 为首项、<Katex tex="p" /> 为公比的等比数列。图 递2 的两栏因此形状一样，只差竖直方向的平移量 <Katex tex="x" />。</p>
    <p>这一步把「一次递推」换成了等比，等比数列的通项已在 比1 建立：<Katex tex="b_n=b_1p^{n-1}" />。再移回去，<Katex tex="a_n=x+b_1p^{n-1}" />。整个过程没有算任何一项，只是换了个零点。</p>

    <h3 class="sec" id="r2-solve">通项与收敛</h3>
    <p>通项公式：</p>
    <p style="text-align:center"><Katex tex="a_n=x+(a_1-x)p^{n-1}=\dfrac{q}{1-p}+\left(a_1-\dfrac{q}{1-p}\right)p^{n-1}" display /></p>
    <p>它由两部分组成：常数项 <Katex tex="x" /> 与含 <Katex tex="p^{n-1}" /> 的项。走势完全由 <Katex tex="p" /> 决定：<Katex tex="|p|<1" /> 时 <Katex tex="p^{n-1}\to0" />，数列趋近 <Katex tex="x" />；<Katex tex="|p|>1" /> 时这一项无限增大，数列远离 <Katex tex="x" />；<Katex tex="p=-1" /> 时在 <Katex tex="a_1" /> 与 <Katex tex="2x-a_1" /> 之间来回摆动；<Katex tex="p=1" /> 时退化为等差数列。</p>
    <p>图 递2 的上栏把这一结论画成点：预设 ② 的 <Katex tex="p=1/2" /> 让点逐项贴近金色虚线，预设 ① 的 <Katex tex="p=2" /> 让点逐项远离，预设 ③ 的 <Katex tex="p=-1" /> 在虚线两侧交替。下栏的比在各预设中都是常数，正是「平移后是等比」的直接证据。</p>

    <h3 class="sec" id="r2-pit">p=1、x 的算法与回代</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="p=1" /> 时不能套公式。</strong>此时 <Katex tex="a_{n+1}=a_n+q" />，是公差为 <Katex tex="q" /> 的等差数列，通项 <Katex tex="a_n=a_1+(n-1)q" />；平衡点方程 <Katex tex="0=q" /> 无解（<Katex tex="q\ne0" />）或处处成立（<Katex tex="q=0" />），平移法失效。用公式前先看 <Katex tex="p" /> 是否为 1。</li>
        <li><strong>提示二：<Katex tex="x" /> 的符号容易算错。</strong>由 <Katex tex="x=px+q" /> 得 <Katex tex="x(1-p)=q" />，所以 <Katex tex="x=\dfrac{q}{1-p}" />，不是 <Katex tex="\dfrac{q}{p-1}" />。代入 <Katex tex="p=2,q=1" /> 检查：<Katex tex="x=-1" />，代回 <Katex tex="2\times(-1)+1=-1" /> 成立。</li>
        <li><strong>提示三：<Katex tex="b_1" /> 要按定义算。</strong><Katex tex="b_1=a_1-x" />，不是 <Katex tex="a_1" />。写成 <Katex tex="b_n=a_1p^{n-1}" /> 会漏掉平移量，代 <Katex tex="n=1" /> 立刻能验出。</li>
        <li><strong>提示四：题目给的是变形后的递推式时要先化形。</strong>如 <Katex tex="a_{n+1}=2a_n+3" /> 直接可套；若是 <Katex tex="a_{n+1}+1=2(a_n+1)" />，已经化好了形，直接把 <Katex tex="a_n+1" /> 当等比；若是 <Katex tex="a_{n+1}=3a_n+2^{n}" />，常数项含 <Katex tex="n" />，平移法不适用，要除以 <Katex tex="2^{n+1}" /> 后凑等差。</li>
      </ul>
    </div>
    <p>回收与预告：平移法的实质是「换坐标原点」，让递推式的常数项消失；递3 把同一个想法用在分式递推上，用蛛网图把迭代过程画出来；递4 面对的是二阶递推，一次平移已不够，要同时找两个「等比成分」，用特征根把它们分开。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createConstr } from '../../../boards/sequences/recur/constr.js';
import { RQ_CHAPTERS } from './rnav.js';
</script>
