<template>
  <ChPage :cur="1" no="定1" base="/numtheory/d" :chapters="D_CHAPTERS"
    title="素数与算术基本定理"
    sub="素数是不能再分解的整数，合数都可以分解成素数的连乘。算术基本定理说：这个分解不但存在，而且本质上只有一种。整个数论建立在这一点上——讨论约数与倍数时，可以把每个数拆成素因子逐个处理。"
    :toc="[{ id: 'd1-sieve', t: '素数与筛法' }, { id: 'd1-unique', t: '算术基本定理' }, { id: 'd1-dist', t: '素数的分布' }, { id: 'd1-app', t: '约数个数与约数和' }, { id: 'd1-tip', t: '四条提示' }]">
    <div class="note good">大于 <Katex tex="1" /> 的整数 <Katex tex="p" />，如果只有 <Katex tex="1" /> 与 <Katex tex="p" /> 两个正约数，称为<b>素数</b>；否则称为<b>合数</b>。大于 <Katex tex="1" /> 的每个整数都能唯一地写成
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="n=p_1^{a_1}p_2^{a_2}\cdots p_k^{a_k},\qquad p_1<p_2<\cdots<p_k," /></p>
      其中 <Katex tex="p_i" /> 是素数、<Katex tex="a_i" /> 是正整数，这组素数与指数由 <Katex tex="n" /> 唯一确定。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPrime" />
      <div class="cap">图 定1 · <b>素数与算术基本定理机</b>：拖动「上界 n」，看 1 到 n 的整数按筛法染成金色与灰色。看点：① 金色格是素数，灰格是合数，它一定能被某个更小的素数整除；② 合数一旦在更小的素数处被划掉，此后就不会再是金色——这正是筛法能一次划到底的原因；③ 右栏把 n 本身拆成素因子连乘，指数为 1 的因子不写上标。</div>
    </div>

    <h3 class="sec" id="d1-sieve">素数与筛法</h3>
    <p>判一个数是否素数，最直接的办法是试除：依次用 <Katex tex="2,3,4,\dots" /> 去除它，只要有一次整除就说明是合数。<Katex tex="n" /> 若为合数，可写成 <Katex tex="n=ab" />，其中 <Katex tex="1<a\le b<n" />，于是 <Katex tex="a\le\sqrt n" />。所以试除只需试到 <Katex tex="\lfloor\sqrt n\rfloor" />：若这里没有约数，<Katex tex="n" /> 就是素数。</p>
    <p>要在较大范围内列出全部素数，用<b>埃拉托色尼筛法</b>更快。把 <Katex tex="2,3,\dots,n" /> 全排开，从最小的未划去的数 <Katex tex="2" /> 开始，划去它的全部倍数（<Katex tex="2" /> 本身除外）；再取下一个未划去的数 <Katex tex="3" />，同样划去它的倍数；如此下去，剩下的就是素数。画板上每一格的颜色就是这个过程的结果。</p>
    <p>筛法只需做到 <Katex tex="\sqrt n" /> 为止。理由与试除相同：任何合数 <Katex tex="n=ab" /> 都有 <Katex tex="a\le\sqrt n" />，所以它一定被某个不超过 <Katex tex="\sqrt n" /> 的素因子划掉，轮不到更大的素数动手。</p>
    <p>画板上还有一点值得留意：把上界从 30 拖到 60，新露出来的格子里仍然只有素数染金。这说明筛法的结论与范围无关，每扩大一段就多筛出一段，不需要回头修改前面已经确定的部分。</p>

    <h3 class="sec" id="d1-unique">算术基本定理</h3>
    <p>定理包含两个部分：<b>存在性</b>与<b>唯一性</b>。</p>
    <p>存在性用反证。若存在不能分解成素数连乘的整数，取其中最小的一个记为 <Katex tex="n" />。它本身不能是素数（素数的分解就是自己），所以 <Katex tex="n=ab" />，<Katex tex="1<a,b<n" />。由 <Katex tex="n" /> 的最小性，<Katex tex="a" /> 与 <Katex tex="b" /> 都能分解成素数连乘，乘起来就是 <Katex tex="n" /> 的分解，矛盾。</p>
    <p>唯一性依赖一条引理：<b>若素数 <Katex tex="p\mid ab" />，则 <Katex tex="p\mid a" /> 或 <Katex tex="p\mid b" /></b>。证明用裴蜀等式：若 <Katex tex="p\nmid a" />，则 <Katex tex="\gcd(p,a)=1" />，存在 <Katex tex="x,y" /> 使 <Katex tex="px+ay=1" />；两边乘 <Katex tex="b" /> 得 <Katex tex="pbx+aby=b" />，左端两项都被 <Katex tex="p" /> 整除，故 <Katex tex="p\mid b" />。这条引理从两个因式推广到任意多个：素数若整除一个乘积，就至少整除其中一个因子。</p>
    <p>有了引理，唯一性就好办了。设 <Katex tex="n" /> 有两种分解，则某个 <Katex tex="p" /> 在第一种里出现，它整除第二种的乘积，于是整除其中某个 <Katex tex="q" />。两者都是素数，只能相等。两边对消掉这个素因子再重复这一步，最终两种分解完全一致。</p>
    <p>唯一性不是可以省略的细节。在更大的数系里它会失效，例如 <Katex tex="6=2\times3=(1+\sqrt{-5})(1-\sqrt{-5})" />，两种写法都不含可再分解的因子。整数系之所以特殊，就在于这条定理成立——后面所有的约数与同余讨论都默认这一点。</p>

    <h3 class="sec" id="d1-dist">素数的分布</h3>
    <p>素数有无限多个。欧几里得的证明只用了唯一分解：假设素数只有 <Katex tex="p_1,\dots,p_k" /> 这有限个，考虑 <Katex tex="N=p_1p_2\cdots p_k+1" />。它大于 1，必有素因子；而这个素因子不能是任何 <Katex tex="p_i" />，因为 <Katex tex="N" /> 除以 <Katex tex="p_i" /> 余 1。于是得到一个新的素数，与假设矛盾。</p>
    <p>素数虽无限，分布却很不均匀。小于 <Katex tex="x" /> 的素数个数记为 <Katex tex="\pi(x)" />，素数定理给出 <Katex tex="\pi(x)\sim x/\ln x" />：素数的平均间隔约为 <Katex tex="\ln x" />，随 <Katex tex="x" /> 缓慢增长。画板上把上界设为 60 时 <Katex tex="\pi(60)=17" />，密度约三成；到了上千，密度就不到两成了。</p>
    <p>相邻素数之间的间隔可以任意大：<Katex tex="n!+2,n!+3,\dots,n!+n" /> 是 <Katex tex="n-1" /> 个连续的合数，分别被 <Katex tex="2,3,\dots,n" /> 整除。另一方面，相差 2 的素数对（孪生素数）是否有无限多，至今仍是未解问题。可见分布规律与局部构造之间，还有很大的空白。</p>

    <h3 class="sec" id="d1-app">约数个数与约数和</h3>
    <p>把 <Katex tex="n=p_1^{a_1}\cdots p_k^{a_k}" /> 摆出来之后，约数就不再需要一个个列举。设 <Katex tex="d\mid n" />，则 <Katex tex="d" /> 的每个素因子必在 <Katex tex="n" /> 的素因子之中，且指数不超过 <Katex tex="n" /> 的对应指数：<Katex tex="d=p_1^{b_1}\cdots p_k^{b_k}" />，<Katex tex="0\le b_i\le a_i" />。每个 <Katex tex="b_i" /> 独立地有 <Katex tex="a_i+1" /> 种取法，由分步乘法原理</p>
    <p style="text-align:center"><Katex display tex="\tau(n)=\prod_{i=1}^{k}(a_i+1)." /></p>
    <p>例如 <Katex tex="24=2^3\cdot3" />，<Katex tex="\tau(24)=(3+1)(1+1)=8" />，确实共有 <Katex tex="1,2,3,4,6,8,12,24" /> 这八个约数。素数幂的情形最直观：<Katex tex="\tau(p^a)=a+1" />。</p>
    <p>全体约数之和也有类似的乘积式。展开 <Katex tex="(1+p_1+\cdots+p_1^{a_1})(1+p_2+\cdots+p_2^{a_2})\cdots" />，每一项恰好对应一种选取 <Katex tex="b_1,\dots,b_k" />，也就恰好对应一个约数，所以</p>
    <p style="text-align:center"><Katex display tex="\sigma(n)=\prod_{i=1}^{k}\frac{p_i^{a_i+1}-1}{p_i-1}." /></p>
    <p>仍以 <Katex tex="24" /> 为例，<Katex tex="\sigma(24)=\dfrac{2^4-1}{1}\cdot\dfrac{3^2-1}{2}=15\times4=60" />，与 <Katex tex="1+2+3+4+6+8+12+24=60" /> 相符。这两个函数在完全数与亲和数的问题里都要用到。</p>

    <h3 class="sec" id="d1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="1" /> 既不是素数也不是合数。</strong>它是唯一只有单个正约数的正整数。若把 <Katex tex="1" /> 算作素数，唯一分解的写法就不再唯一（可以随意乘上若干个 <Katex tex="1" />），定理也就废了。</li>
        <li><strong>提示二：唯一的含义是「素因子与指数都相同」。</strong>顺序不同不算两种分解，所以写法里约定按 <Katex tex="p_1<p_2<\cdots" /> 排列；指数为 <Katex tex="1" /> 时省略不写。</li>
        <li><strong>提示三：最大公约数与最小公倍数都能读分解式。</strong><Katex tex="\gcd" /> 取各素因子的<b>最小</b>指数，<Katex tex="\operatorname{lcm}" /> 取<b>最大</b>指数。这一读法对多个数同样有效，比两两相除省事。</li>
        <li><strong>提示四：分解大整数是慢的。</strong>判素可以用快速算法在短时间完成，但给定一个上千位的大合数，把它拆成两个素因子至今没有实用算法。RSA 的安全性正建立在这一点上。</li>
      </ul>
    </div>
    <p>回收与预告：素因子分解给出了整数的「坐标」。接下来把每个素数对应的指数记录成一个数，就能数出与 <Katex tex="n" /> 互素的整数的个数——这就是欧拉函数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPrime } from '../../../boards/numtheory/theorem/primelab.js';
import { D_CHAPTERS } from './dnav.js';
</script>
