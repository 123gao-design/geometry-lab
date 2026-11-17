<template>
  <ChPage :cur="2" no="结2" base="/algebra/s" :chapters="AS_CHAPTERS"
    title="群、环、域"
    sub="一个集合上挂两种运算，性质会互相牵连。加法成群、加法乘法由分配律接起来，得到环；乘法除了零元以外也成群，才升格为域。模 n 的结构正好把这两档都演一遍。"
    :toc="[{ id: 's2-ring', t: '环：两个运算的和' }, { id: 's2-zero', t: '零因子与约分的失效' }, { id: 's2-field', t: '域：素数模数' }, { id: 's2-tip', t: '四条提示' }]">
    <div class="note good">集合 <Katex tex="R" /> 上定义加法与乘法：<Katex tex="(R,+)" /> 是交换群，乘法满足结合律，两者由分配律相连，则称 <Katex tex="R" /> 为<b>环</b>。若乘法还是交换的、有幺元，且每个非零元都有乘法逆元，则称 <Katex tex="R" /> 为<b>域</b>。域是环的加强版，条件全部集中在乘法上。</div>

    <div class="board-wrap">
      <BoardMount :factory="createRrf" />
      <div class="cap">图 结2 · <b>环与域</b>：模 n 乘法的运算表，红格是两个非零元乘出 0，绿格是乘出 1。看点：① n 取合数时红格成片出现，非零元之间能乘出零；② n 换成素数，红格全部消失；③ 右侧三行对照加法群、环、域的条件，绿的才成立。</div>
    </div>

    <h3 class="sec" id="s2-ring">环：两个运算的和</h3>
    <p>整数、多项式、矩阵都构成环。共同点是加法足够好（可减、可交换），乘法只要求结合，两者靠分配律衔接：<Katex tex="a(b+c)=ab+ac" />。环不要求乘法有逆，也不要求乘法交换。</p>
    <p>模 <Katex tex="n" /> 的剩余类在加法与乘法下自动成为交换环。加法群部分与前一章的群完全一致：幺元是 0，逆元是 <Katex tex="n-a" />。</p>
    <p>从环出发还可以谈理想与商环，这一套推广在数论与代数几何里都用得上。本模块只停在环与域的分界线上，重点是看清乘法上缺什么。</p>

    <h3 class="sec" id="s2-zero">零因子与约分的失效</h3>
    <p><Katex tex="n" /> 是合数时，两个非零元可能乘出 0：模 6 下 <Katex tex="2\times 3=0" />，模 4 下 <Katex tex="2\times 2=0" />。这样的元素叫<b>零因子</b>，画板上用红格标出。</p>
    <p>零因子一旦出现，约分就不成立：<Katex tex="2\times 1\equiv 2\times 4 \pmod 6" />，两边同除 2 会得到 <Katex tex="1\equiv 4" /> 的错误结论。方程 <Katex tex="ax=b" /> 也可能有多个解。</p>
    <p>可逆元是另一侧：<Katex tex="a" /> 与 <Katex tex="n" /> 互素时才有乘法逆元，个数等于欧拉函数 <Katex tex="\varphi(n)" />。零因子与非可逆元在合数模下同时存在，这正是环与域的分界线。</p>

    <h3 class="sec" id="s2-field">域：素数模数</h3>
    <p>当 <Katex tex="n" /> 是素数，每个非零元都与 <Katex tex="n" /> 互素，因而都可逆。乘法在非零元上成群，整个结构升格为域，记 <Katex tex="\mathbb{F}_n" />。</p>
    <p>域的除法畅通，线性方程组的解法、多项式的因式分解都能照搬。有限域的元素个数必为素数幂，<Katex tex="\mathbb{F}_p" /> 是最简单的一族。</p>
    <p>画板把两档摆在一起：把模数从 6 拨到 7，红格消失、徽章从「环」改成「域」。判据只有一条：有没有非零零因子，等价于模数是不是素数。</p>

    <h3 class="sec" id="s2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：环的乘法可以不交换。</strong>矩阵环就是例子。判断域时别忘先确认乘法交换。</li>
        <li><strong>提示二：零不能有逆元。</strong>域里只要求非零元可逆；把 0 也算进逆元条件，任何结构都过不了。</li>
        <li><strong>提示三：零因子不是「等于零的元素」。</strong>它是两个非零元的乘积为零的那个因子，本身非零。</li>
        <li><strong>提示四：有限整环自动是域。</strong>没有零因子的有限交换幺环，乘法在非零元上成群，这是本节判据的一般形式。</li>
      </ul>
    </div>
    <p>回收与预告：两个结构之间怎么比较？不必逐元素对照，只要找一个保持运算的映射。这就是下一章的同态，它的核与像把两个结构差在哪儿量了出来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRrf } from '../../../boards/algebra/struct/rrf.js';
import { AS_CHAPTERS } from './asnav.js';
</script>
