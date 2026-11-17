<template>
  <ChPage :cur="5" no="定5" base="/numtheory/d" :chapters="D_CHAPTERS"
    title="数论函数与莫比乌斯反演"
    sub="τ(n) 数除数、σ(n) 数除数之和、φ(n) 数互素的个数，这三个函数的取值都只看 n 的素因子分解。它们都能写成「对全部除数求和」的形式，于是有了一个共同的问题：知道和式的值，能不能把原函数反推出来？莫比乌斯函数就是专门干这件事的一把钥匙。"
    :toc="[{ id: 'd5-fn', t: '数论函数与积性' }, { id: 'd5-mu', t: '莫比乌斯函数' }, { id: 'd5-inv', t: '反演公式' }, { id: 'd5-app', t: '两个用法' }, { id: 'd5-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f,g" /> 是定义在正整数上的函数。若 <Katex tex="g(n)=\sum_{d\mid n}f(d)" /> 对一切 <Katex tex="n" /> 成立，则 <Katex tex="f(n)=\sum_{d\mid n}\mu\!\left(\frac{n}{d}\right)g(d)" />，其中 <Katex tex="\mu" /> 是莫比乌斯函数。这条式子与「和式求导的反向操作」同构，只是把导数换成了 <Katex tex="\mu" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMobius" />
      <div class="cap">图 定5 · <b>莫比乌斯反演</b>：左图是 <Katex tex="n" /> 的除数双曲线，曲线 <Katex tex="d\cdot e=n" /> 上的整点就是全部除数对，颜色按 <Katex tex="\mu(d)" /> 分成绿、红、灰三类；右图把同一个 <Katex tex="n" /> 的除数排成一列，柱高是 <Katex tex="\mu(d)" />，柱顶上方的数字是从第一个除数累到当前的部分和。看点：① 拖 <Katex tex="n" /> 从 <Katex tex="2" /> 走到 <Katex tex="48" />，「除数上的 <Katex tex="\mu" /> 和」始终是 <Katex tex="0" />，部分和一路上下摆，最后一定落回零；② 点 ① 号预设取 <Katex tex="n=1" />，除数列里只剩一个 <Katex tex="1" />，和才变成 <Katex tex="1" />；③ 切到 ③ 号预设 <Katex tex="n=36" />，凡带平方因子的除数一律涂灰，柱高为 <Katex tex="0" />。</div>
    </div>

    <h3 class="sec" id="d5-fn">数论函数与积性</h3>
    <p>数论函数指定义域为正整数、取值为数的一类函数。最常用的三个都由除数给出：</p>
    <p style="text-align:center"><Katex display tex="\tau(n)=\sum_{d\mid n}1,\qquad \sigma(n)=\sum_{d\mid n}d,\qquad \varphi(n)=\#\{1\le k\le n:\gcd(k,n)=1\}." /></p>
    <p>三者的共同点是<b>积性</b>：只要 <Katex tex="\gcd(m,n)=1" />，就有 <Katex tex="f(mn)=f(m)f(n)" />。验证起来都很快，因为互素时 <Katex tex="mn" /> 的每个除数唯一拆成 <Katex tex="m" /> 的除数与 <Katex tex="n" /> 的除数之积，求和随之拆成两个和相乘。于是把一个数分解成 <Katex tex="p_1^{a_1}\cdots p_r^{a_r}" /> 之后，函数值只要在素数幂上算一遍：</p>
    <p style="text-align:center"><Katex display tex="\tau(n)=\prod_{i=1}^{r}(a_i+1),\qquad \sigma(n)=\prod_{i=1}^{r}\frac{p_i^{a_i+1}-1}{p_i-1},\qquad \varphi(n)=n\prod_{i=1}^{r}\left(1-\frac{1}{p_i}\right)." /></p>
    <p>拿 <Katex tex="n=12=2^{2}\cdot3" /> 验证：<Katex tex="\tau=3\cdot2=6" />，除数确实是 <Katex tex="1,2,3,4,6,12" />；<Katex tex="\sigma=7\cdot4=28" />；<Katex tex="\varphi=12\cdot\tfrac12\cdot\tfrac23=4" />，只有 <Katex tex="1,5,7,11" /> 与它互素。画板右栏三个读数随 <Katex tex="n" /> 一起变，算的就是这三条公式。</p>
    <p>注意积性与「完全积性」的区别。<Katex tex="\tau" /> 对不互素的因子不成立：<Katex tex="\tau(4)=3" />，而 <Katex tex="\tau(2)\tau(2)=4" />。凡公式里出现「互素」这个前提，就不能随手拆开。</p>

    <h3 class="sec" id="d5-mu">莫比乌斯函数</h3>
    <p>莫比乌斯函数只关心素因子的指数，不看大小：</p>
    <p style="text-align:center"><Katex display tex="\mu(n)=\begin{cases}1, & n=1,\\ (-1)^{k}, & n=p_1p_2\cdots p_k\ \text{distinct primes},\\ 0, & n\ \text{has a square factor}.\end{cases}" /></p>
    <p>它的取值只有 <Katex tex="1,-1,0" /> 三种。前二十个里，<Katex tex="\mu(1)=1" />、<Katex tex="\mu(2)=\mu(3)=-1" />、<Katex tex="\mu(4)=0" />、<Katex tex="\mu(6)=1" />、<Katex tex="\mu(12)=0" />（<Katex tex="12" /> 含 <Katex tex="4" />）。画板左图按颜色给出同样三种取值：绿点表示素因子个数为偶，红点表示奇数，灰点表示带平方因子。</p>
    <p>它之所以有用，全在一条恒等式上：</p>
    <p style="text-align:center"><Katex display tex="\sum_{d\mid n}\mu(d)=\begin{cases}1, & n=1,\\ 0, & n>1.\end{cases}" /></p>
    <p>证明不复杂。设 <Katex tex="n" /> 有 <Katex tex="k" /> 个互异素因子，非零的 <Katex tex="\mu(d)" /> 只出现在 <Katex tex="d" /> 由其中若干个素数相乘的时候，从 <Katex tex="k" /> 个里挑 <Katex tex="j" /> 个有 <Katex tex="\binom{k}{j}" /> 种，于是总和是 <Katex tex="(1-1)^{k}" />。这正是一个容斥系数：<Katex tex="k" /> 个集合的容斥公式里，每一项前面的符号恰好是 <Katex tex="(-1)^{j}" />。</p>
    <p>画板右图就是这条恒等式的逐项展开：柱高是每一项 <Katex tex="\mu(d)" />，柱顶的数字是累到这一项的部分和，最后一项落下时总和归零。<Katex tex="n=1" /> 是唯一的例外，因为它的除数只有 <Katex tex="1" /> 自己。</p>

    <h3 class="sec" id="d5-inv">反演公式</h3>
    <p>有了这条恒等式，反演只是一次换序求和。设 <Katex tex="g(n)=\sum_{d\mid n}f(d)" />，把 <Katex tex="f" /> 当作未知，两边乘 <Katex tex="\mu(n/d)" /> 后对 <Katex tex="d" /> 求和：</p>
    <p style="text-align:center"><Katex display tex="\sum_{d\mid n}\mu\!\left(\frac{n}{d}\right)g(d)=\sum_{d\mid n}\mu\!\left(\frac{n}{d}\right)\sum_{e\mid d}f(e)=\sum_{e\mid n}f(e)\sum_{d:\,e\mid d\mid n}\mu\!\left(\frac{n}{d}\right)." /></p>
    <p>内层令 <Katex tex="d=e\,c" />，则 <Katex tex="c" /> 跑遍 <Katex tex="n/e" /> 的除数，内层和变成 <Katex tex="\sum_{c\mid (n/e)}\mu(c)" />。它只在 <Katex tex="n/e=1" /> 时等于 <Katex tex="1" />，其余全为零。于是整串和只剩 <Katex tex="e=n" /> 那一项，恰好是 <Katex tex="f(n)" />。反向同理，两条方向互为逆运算。</p>
    <p>写的时候有两种等价形式，别把它们混成一条：</p>
    <p style="text-align:center"><Katex display tex="f(n)=\sum_{d\mid n}\mu(d)\,g\!\left(\frac{n}{d}\right)=\sum_{d\mid n}\mu\!\left(\frac{n}{d}\right)g(d)." /></p>
    <p>第一个式子把 <Katex tex="\mu" /> 落在 <Katex tex="d" /> 上，第二个落在 <Katex tex="n/d" /> 上。因为 <Katex tex="d" /> 与 <Katex tex="n/d" /> 一一代换，两者其实是同一个和式换了求和顺序。</p>

    <h3 class="sec" id="d5-app">两个用法</h3>
    <p><b>其一，把 <Katex tex="\varphi" /> 写成反演形式。</b>按定义，<Katex tex="n" /> 的每个数都对应 <Katex tex="\gcd(k,n)" /> 这个 <Katex tex="n" /> 的除数，而被某个 <Katex tex="d" /> 整除的 <Katex tex="k" /> 一共 <Katex tex="n/d" /> 个。于是 <Katex tex="n=\sum_{d\mid n}\varphi(d)" />。用反演把 <Katex tex="\varphi" /> 解出来：</p>
    <p style="text-align:center"><Katex display tex="\varphi(n)=\sum_{d\mid n}\mu(d)\frac{n}{d}." /></p>
    <p>代 <Katex tex="n=12" />：<Katex tex="12-6-4+0+2+0=4" />，与上一节的乘积公式一致。这条式子是容斥的直接翻译，把「减去被 2 整除的、减去被 3 整除的、加回被 6 整除的」写成了一个和。</p>
    <p><b>其二，数互素对。</b>求 <Katex tex="\sum_{i,j\le N}[\gcd(i,j)=1]" /> 时，先用 <Katex tex="\sum_{d\mid\gcd(i,j)}\mu(d)" /> 替换示性函数，再交换求和次序：</p>
    <p style="text-align:center"><Katex display tex="\sum_{i,j\le N}[\gcd(i,j)=1]=\sum_{d\le N}\mu(d)\left\lfloor\frac{N}{d}\right\rfloor^{2}." /></p>
    <p>右端把两重循环降成了一重，<Katex tex="N" /> 很大时差别极其明显。这类「示性函数换 <Katex tex="\mu" />、再换序」的套路，是莫比乌斯反演在算法竞赛与解析数论里最常见的用法。</p>

    <h3 class="sec" id="d5-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\mu" /> 只认无平方因子的数。</strong><Katex tex="\mu(8)=\mu(12)=\mu(18)=0" />，不必再算素因子的个数。分解时看到某个素数出现两次以上，直接判零。</li>
        <li><strong>提示二：反演的变量位置要看清楚。</strong>两种写法 <Katex tex="\mu(d)g(n/d)" /> 与 <Katex tex="\mu(n/d)g(d)" /> 数值相同，但代入具体数时别把 <Katex tex="d" /> 和 <Katex tex="n/d" /> 对调后再套错公式。</li>
        <li><strong>提示三：积性只在互素时可用。</strong><Katex tex="\varphi(4)=2" />，而 <Katex tex="\varphi(2)\varphi(2)=1" />。只有 <Katex tex="\gcd(m,n)=1" /> 才能把 <Katex tex="f(mn)" /> 拆成乘积。</li>
        <li><strong>提示四：反演之前先确认和式的形状。</strong>公式针对的是 <Katex tex="\sum_{d\mid n}f(d)" /> 这种「除数型」和式。若和号跑的是 <Katex tex="d\le n" /> 而不是整除，先换元或改用别的方法。</li>
      </ul>
    </div>
    <p>回收与预告：数论函数这一章补上了初等数论里「函数与和式」这一块，<Katex tex="\mu" /> 与反演把容斥写成了公式。下一章离开有限运算，换成集合上的「远近」：什么都不量、只留下开集，能说的性质还剩哪些，这是拓扑学的入口。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMobius } from '../../../boards/numtheory/theorem/mobius.js';
import { D_CHAPTERS } from './dnav.js';
</script>
