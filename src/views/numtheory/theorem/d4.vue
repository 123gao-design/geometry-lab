<template>
  <ChPage :cur="4" no="定4" base="/numtheory/d" :chapters="D_CHAPTERS"
    title="中国剩余定理"
    sub="「除以 3 余 2，除以 5 余 3」这样的问题要找一个同时满足两条同余式的数。模数互素时，答案在模乘积的范围内存在且唯一。定理不但断言存在，还给出把各个局部解拼成整体解的构造。"
    :toc="[{ id: 'd4-problem', t: '一组同余式' }, { id: 'd4-unique', t: '互素情形的唯一性' }, { id: 'd4-solve', t: '构造解法' }, { id: 'd4-general', t: '模数不互素时' }, { id: 'd4-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="m_1,m_2,\dots,m_k" /> 两两互素，<Katex tex="a_1,\dots,a_k" /> 为任意整数。则同余组
      <p style="text-align:center;margin:8px 0 0"><Katex tex="x\equiv a_i\pmod{m_i}\quad(i=1,\dots,k)" /></p>
      在模 <Katex tex="M=m_1m_2\cdots m_k" /> 的意义下有唯一解。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCRT" />
      <div class="cap">图 定4 · <b>中国剩余定理机</b>：上面的刻度线是模 m₁ 的余数、下面一条是模 m₂ 的余数，拖动 x 时两条线上的落点一起走；方格表的行是 r₂、列是 r₁，格内写取得这对余数的最小非负 x。看点：① m₁ 与 m₂ 互素时每一格都填上了数，m₁·m₂ 个组合与 m₁·m₂ 个 x 一一对应；② 两模不互素时空格出现，表内数字重复，整体周期缩到最小公倍数；③ 无论怎么拖 x，它落在表里永远只有一格。</div>
    </div>

    <h3 class="sec" id="d4-problem">一组同余式</h3>
    <p>单独一条同余式 <Katex tex="x\equiv a\pmod m" /> 的解就已经确定了一整类数：<Katex tex="a,a+m,a+2m,\dots" />。两条同余式同时给出时，各自的解集要取交，交出来的类通常更稀：周期从 <Katex tex="m_1" /> 与 <Katex tex="m_2" /> 变成它们的公倍数。</p>
    <p>取 <Katex tex="m_1=3" />、<Katex tex="m_2=5" />，要 <Katex tex="x\equiv2\pmod3" /> 且 <Katex tex="x\equiv3\pmod5" />。第一条给出 <Katex tex="2,5,8,11,14,17,20,\dots" />，第二条给出 <Katex tex="3,8,13,18,\dots" />，交集中的最小非负数是 8，此后每隔 15 出现一次。15 正是 <Katex tex="3\times5" />，也就是两者的最小公倍数（模数互素时乘积等于最小公倍数）。</p>
    <p>画板把这件事画成两条并行的刻度线。同一个 <Katex tex="x" /> 在上面一条线上落在 <Katex tex="x\bmod m_1" /> 的位置，在下面一条线上落在 <Katex tex="x\bmod m_2" /> 的位置。问「满足这组余数的 x 是谁」，等价于问「方格表里的这一格填的是哪个 x」。</p>

    <h3 class="sec" id="d4-unique">互素情形的唯一性</h3>
    <p>唯一性最好证明。若 <Katex tex="x" /> 与 <Katex tex="x'" /> 都是解，则对每个 <Katex tex="i" /> 有 <Katex tex="m_i\mid x-x'" />。模数两两互素，而两个互素的数若都整除同一个数，它们的乘积也整除这个数（第二章的互素性质），逐步合并得 <Katex tex="M\mid x-x'" />。</p>
    <p>所以解在模 <Katex tex="M" /> 内至多一个。存在性需要构造，见下一节。两件事合起来，就得到「在 <Katex tex="0\le x<M" /> 内恰有一个解」，也就是 <Katex tex="M" /> 个余数、<Katex tex="M" /> 种组合一一对上。</p>
    <p>这张对应表本身值得一看。以 <Katex tex="m_1=3" />、<Katex tex="m_2=5" /> 为例，15 个 <Katex tex="x" /> 产生 15 对余数，两两不同；反过来说，<Katex tex="3\times5" /> 个组合一个不缺。这就是画板上表格填满的含义：互素时不会有两格填同一个数，也不会有一格空着。</p>
    <p>不互素时这两条都断。取 <Katex tex="m_1=4" />、<Katex tex="m_2=6" />，有 24 种组合，但真正出现的只有 12 种，因为 <Katex tex="x\bmod2" /> 被两个模同时决定，从不独立的组合凑不出来。画板上把两个滑块调到 4 与 6 就能看到空格。</p>

    <h3 class="sec" id="d4-solve">构造解法</h3>
    <p>记 <Katex tex="M_i=M/m_i" />。它与 <Katex tex="m_i" /> 互素，于是存在 <Katex tex="y_i" /> 使</p>
    <p style="text-align:center"><Katex display tex="M_iy_i\equiv1\pmod{m_i}." /></p>
    <p>这个 <Katex tex="y_i" /> 是 <Katex tex="M_i" /> 模 <Katex tex="m_i" /> 的逆元，用辗转相除倒推（裴蜀等式）就能求出。然后把各个局部贡献加起来：</p>
    <p style="text-align:center"><Katex display tex="x\equiv\sum_{i=1}^{k}a_iM_iy_i\pmod M." /></p>
    <p>验证只需逐项看。取第 <Katex tex="j" /> 项，<Katex tex="i\ne j" /> 时 <Katex tex="M_i" /> 含因子 <Katex tex="m_j" />，该项被 <Katex tex="m_j" /> 整除，模 <Katex tex="m_j" /> 为 0；当 <Katex tex="i=j" /> 时 <Katex tex="M_jy_j\equiv1" />，该项化为 <Katex tex="a_j" />。所以整个和在模 <Katex tex="m_j" /> 下等于 <Katex tex="a_j" />，对每个 <Katex tex="j" /> 都成立。</p>
    <p>用前面的例子走一遍。<Katex tex="M=15" />，<Katex tex="M_1=5" />，<Katex tex="M_2=3" />。求 <Katex tex="5y_1\equiv1\pmod3" />，即 <Katex tex="2y_1\equiv1" />，取 <Katex tex="y_1=2" />；求 <Katex tex="3y_2\equiv1\pmod5" />，取 <Katex tex="y_2=2" />。于是</p>
    <p style="text-align:center"><Katex display tex="x\equiv2\times5\times2+3\times3\times2=20+18=38\equiv8\pmod{15}." /></p>
    <p>与逐一列举得到的 8 相符。构造法的代价是多算几次逆元，好处是不必枚举，模数再多、再大也能照做——这正是它在密码学里被反复调用的原因。</p>

    <h3 class="sec" id="d4-general">模数不互素时</h3>
    <p>把互素条件拿掉，结论需要修改。两条同余式的情形最简明：<Katex tex="x\equiv a\pmod m" /> 与 <Katex tex="x\equiv b\pmod n" /> 有公共解，当且仅当</p>
    <p style="text-align:center"><Katex display tex="a\equiv b\pmod{\gcd(m,n)}." /></p>
    <p>必要性是显然的：<Katex tex="\gcd(m,n)" /> 同时整除 <Katex tex="m" /> 与 <Katex tex="n" />，也整除 <Katex tex="x-a" /> 与 <Katex tex="x-b" />，相减得它整除 <Katex tex="a-b" />。充分性可以由构造给出：把两条化成 <Katex tex="x=a+ms=b+nt" />，问题变成解 <Katex tex="ms-nt=b-a" />，由裴蜀等式，右端被 <Katex tex="\gcd(m,n)" /> 整除时才有整数解。</p>
    <p>有解时，解在模 <Katex tex="\operatorname{lcm}(m,n)" /> 内唯一，而不是模 <Katex tex="mn" />。这与画板上的观察一致：两模不互素时周期变短、表内数字重复。多条的场合，只要两两之间的相容条件都能满足，逐对合并也能得到同样的结论。</p>

    <h3 class="sec" id="d4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：写答案要带模。</strong>解不是单独一个数，而是一个剩余类。凡答 <Katex tex="x=8" /> 的场合，都该补上 <Katex tex="\pmod{15}" />，否则意思不完整。</li>
        <li><strong>提示二：模数必须两两互素。</strong>只要求相邻互素不够。三条模数里只要有一对不同互素，<Katex tex="M" /> 就不等于最小公倍数，唯一性的论证随即失效。</li>
        <li><strong>提示三：逆元用裴蜀等式求，别硬试。</strong>模数小的时候逐个试很快，模数大了就要靠扩展欧几里得算法。它与第二章的辗转相除是同一套步骤，只是多带了两列系数。</li>
        <li><strong>提示四：不互素时先验相容条件。</strong>算之前先用 <Katex tex="a\equiv b\pmod{\gcd(m,n)}" /> 检查一遍，不满足就直接答无解，省得白算逆元。</li>
      </ul>
    </div>
    <p>回收与预告：本章解出的同余组，是把大模拆成小模的入口。下一章转向乘法的平方结构——模素数下哪些数是平方剩余，判定它们需要一套新工具。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCRT } from '../../../boards/numtheory/theorem/crtlab.js';
import { D_CHAPTERS } from './dnav.js';
</script>
