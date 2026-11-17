<template>
  <ChPage :cur="2" no="定2" base="/numtheory/d" :chapters="D_CHAPTERS"
    title="欧拉函数"
    sub="欧拉函数 φ(n) 数的是 1 到 n 之间与 n 互素的整数。它的计算公式并不复杂：把 n 的每个素因子 p 都划去 1/p 的比例，剩下的就是答案。这条公式把乘法结构翻译成计数。"
    :toc="[{ id: 'd2-def', t: '定义与互素计数' }, { id: 'd2-formula', t: '计算公式与积性' }, { id: 'd2-sum', t: '约数求和公式' }, { id: 'd2-app', t: '一些具体值' }, { id: 'd2-tip', t: '四条提示' }]">
    <div class="note good">对正整数 <Katex tex="n" />，记 <Katex tex="\varphi(n)" /> 为 <Katex tex="1\le k\le n" /> 中与 <Katex tex="n" /> 互素的 <Katex tex="k" /> 的个数，称为<b>欧拉函数</b>。若 <Katex tex="n=p_1^{a_1}\cdots p_k^{a_k}" />，则
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="\varphi(n)=n\prod_{i=1}^{k}\left(1-\frac{1}{p_i}\right)." /></p></div>

    <div class="board-wrap">
      <BoardMount :factory="createPhi" />
      <div class="cap">图 定2 · <b>欧拉函数</b>：把 1 到 n 排成格阵，与 n 互素的格子染绿。看点：① 绿色的个数就是 <Katex tex="\varphi(n)" />；② 共享因子的格子按素因子成排出现，2 的倍数是一整列、3 的倍数是一整列；③ 右栏按分解式 <Katex tex="n\prod(1-1/p)" /> 逐项算出同一个数，两种算法始终一致。</div>
    </div>

    <h3 class="sec" id="d2-def">定义与互素计数</h3>
    <p>定义里的范围是 <Katex tex="1\le k\le n" />。为什么不是 <Katex tex="0\le k<n" />？两种写法的个数相同，因为 <Katex tex="\gcd(k,n)=\gcd(k+n,n)" />。约定从 1 起算，是为了让 <Katex tex="\varphi(1)=1" /> 读起来自然：1 到 1 之间与 1 互素的数只有一个。</p>
    <p>按定义直接数，例如 <Katex tex="\varphi(10)=4" />，互素的数是 <Katex tex="1,3,7,9" />。<Katex tex="\varphi(12)=4" />，互素的数是 <Katex tex="1,5,7,11" />。可以看出一点：与 <Katex tex="n" /> 互素的数总是成对出现，<Katex tex="k" /> 与 <Katex tex="n-k" /> 同时互素或同时不互素。这一配对在 <Katex tex="n>2" /> 时给出 <Katex tex="\varphi(n)" /> 是偶数的结论。</p>
    <p>素数的情形最简单：<Katex tex="\varphi(p)=p-1" />，因为 <Katex tex="1,\dots,p-1" /> 都不被 <Katex tex="p" /> 整除。素数幂稍麻烦一些：<Katex tex="1" /> 到 <Katex tex="p^a" /> 中不与 <Katex tex="p^a" /> 互素的恰是 <Katex tex="p" /> 的倍数，共 <Katex tex="p^{a-1}" /> 个，于是</p>
    <p style="text-align:center"><Katex display tex="\varphi(p^a)=p^a-p^{a-1}=p^{a-1}(p-1)." /></p>

    <h3 class="sec" id="d2-formula">计算公式与积性</h3>
    <p>一般公式用容斥原理推。把 <Katex tex="n" /> 的素因子记作 <Katex tex="p_1,\dots,p_k" />，<Katex tex="1" /> 到 <Katex tex="n" /> 中被 <Katex tex="p_i" /> 整除的数有 <Katex tex="n/p_i" /> 个，被 <Katex tex="p_i" /> 与 <Katex tex="p_j" /> 同时整除的有 <Katex tex="n/(p_ip_j)" /> 个，依此类推。容斥展开后逐项合并：</p>
    <p style="text-align:center"><Katex display tex="\varphi(n)=n-\sum\frac{n}{p_i}+\sum\frac{n}{p_ip_j}-\cdots=n\prod_{i=1}^{k}\left(1-\frac{1}{p_i}\right)." /></p>
    <p>公式有个好读的解释：从 <Katex tex="n" /> 出发，每遇到一个素因子 <Katex tex="p" /> 就划掉其中 <Katex tex="1/p" /> 的比例，剩 <Katex tex="1-1/p" />；各个素因子的划除互不干扰，比例相乘即可。注意每个素因子只需出现一次，指数不影响比例——<Katex tex="\varphi(p^a)=p^a(1-1/p)" /> 正是上面的素数幂公式。</p>
    <p>由此得到一条重要的乘法性质：若 <Katex tex="\gcd(m,n)=1" />，则</p>
    <p style="text-align:center"><Katex display tex="\varphi(mn)=\varphi(m)\varphi(n)." /></p>
    <p>因为 <Katex tex="m" /> 与 <Katex tex="n" /> 没有公共素因子，公式里的乘积正好分成两段。这条叫<b>积性</b>。它把求 <Katex tex="\varphi" /> 的问题拆成各个素数幂上的问题，再乘起来。例如 <Katex tex="\varphi(36)=\varphi(4)\varphi(9)=2\times6=12" />。</p>
    <p>反过来，积性可以当作检验手段：若 <Katex tex="\gcd(m,n)=1" /> 而算出 <Katex tex="\varphi(mn)\ne\varphi(m)\varphi(n)" />，必有计算错误。</p>

    <h3 class="sec" id="d2-sum">约数求和公式</h3>
    <p>把 <Katex tex="n" /> 的所有正约数对应的 <Katex tex="\varphi" /> 加起来，结果恰好是 <Katex tex="n" /> 本身：</p>
    <p style="text-align:center"><Katex display tex="\sum_{d\mid n}\varphi(d)=n." /></p>
    <p>证明按分母分类。考虑 <Katex tex="1" /> 到 <Katex tex="n" /> 的分数 <Katex tex="\dfrac{k}{n}" />，约分后分母必是 <Katex tex="n" /> 的约数 <Katex tex="d" />。分母恰为 <Katex tex="d" /> 的分数，分子 <Katex tex="j" /> 满足 <Katex tex="\gcd(j,d)=1" /> 且 <Katex tex="1\le j\le d" />，这样的 <Katex tex="j" /> 有 <Katex tex="\varphi(d)" /> 个。所有分数共 <Katex tex="n" /> 个，按分母分组求和即得该式。</p>
    <p>验算一遍：<Katex tex="n=6" /> 的约数是 <Katex tex="1,2,3,6" />，<Katex tex="\varphi(1)+\varphi(2)+\varphi(3)+\varphi(6)=1+1+2+2=6" />。这条恒等式在证明原根存在、以及构造模 <Katex tex="n" /> 的单位群时反复出现。</p>

    <h3 class="sec" id="d2-app">一些具体值</h3>
    <p>常见数值列成一张表更便于对照：</p>
    <ul>
      <li><Katex tex="\varphi(1)=1" />，<Katex tex="\varphi(2)=1" />，<Katex tex="\varphi(3)=2" />，<Katex tex="\varphi(4)=2" />，<Katex tex="\varphi(5)=4" />，<Katex tex="\varphi(6)=2" />；</li>
      <li><Katex tex="\varphi(10)=4" />，<Katex tex="\varphi(12)=4" />，<Katex tex="\varphi(24)=8" />，<Katex tex="\varphi(30)=8" />；</li>
      <li><Katex tex="\varphi(p)=p-1" />，<Katex tex="\varphi(2p)=p-1" />（<Katex tex="p" /> 为奇素数，因为 <Katex tex="\gcd(2,p)=1" />）。</li>
    </ul>
    <p>从表里能读出两点。其一 <Katex tex="\varphi(n)" /> 一般小于 <Katex tex="n" />，只有在 <Katex tex="n=1,2" /> 时取等。其二函数值在取素数时最大，<Katex tex="\varphi(p)=p-1" /> 离 <Katex tex="p" /> 只差一个；素因子越多、指数越大，打折的比例就越重。</p>
    <p>还有一个常用估计：对 <Katex tex="n\ge3" />，<Katex tex="\varphi(n)" /> 是偶数，并且不小于 <Katex tex="\sqrt{n/2}" />。后者在讨论原根的个数时会用到，它说明互素的剩余类并不稀少。</p>

    <h3 class="sec" id="d2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：公式里每个素因子只乘一次。</strong>写成 <Katex tex="\prod(1-1/p_i)" /> 之后不要再按指数连乘。若 <Katex tex="n=12=2^2\cdot3" />，公式是 <Katex tex="12\times\frac12\times\frac23=4" />，不是乘三次。</li>
        <li><strong>提示二：积性只在互素时成立。</strong><Katex tex="\varphi(4\cdot6)=\varphi(24)=8" />，而 <Katex tex="\varphi(4)\varphi(6)=2\times2=4" />，两者不等，因为 <Katex tex="\gcd(4,6)=2" />。正确拆法是按素数幂拆：<Katex tex="\varphi(8)\varphi(3)=4\times2=8" />。</li>
        <li><strong>提示三：<Katex tex="\varphi(1)=1" /> 是约定，不是推导。</strong>定义范围内只有一个数 <Katex tex="1" />，<Katex tex="\gcd(1,1)=1" />，所以计 1 个。这条约定让积性公式在 <Katex tex="n=1" /> 时也成立。</li>
        <li><strong>提示四：<Katex tex="\varphi(n)" /> 是剩余类的个数。</strong>模 <Katex tex="n" /> 的剩余类中去掉与 <Katex tex="n" /> 不互素的那些，剩下的类恰好 <Katex tex="\varphi(n)" /> 个，它们在乘法下封闭并构成一个群。下一章欧拉定理的依据就在这里。</li>
      </ul>
    </div>
    <p>回收与预告：<Katex tex="\varphi(n)" /> 数出了模 <Katex tex="n" /> 的互素类。把这些类相乘，指数累加到 <Katex tex="\varphi(n)" /> 时必然回到 1——这是欧拉定理，也是费马小定理的推广。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPhi } from '../../../boards/numtheory/theorem/philab.js';
import { D_CHAPTERS } from './dnav.js';
</script>
