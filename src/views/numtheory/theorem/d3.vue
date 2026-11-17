<template>
  <ChPage :cur="3" no="定3" base="/numtheory/d" :chapters="D_CHAPTERS"
    title="费马小定理与欧拉定理"
    sub="一个与模互素的数反复自乘，幂的余数会绕成一个圈，最终回到 1。回到 1 需要的步数叫它的阶，而阶必定整除欧拉函数。费马小定理与欧拉定理说的都是「一定回得来」这件事，前者是模为素数时的特例。"
    :toc="[{ id: 'd3-order', t: '幂的循环与阶' }, { id: 'd3-fermat', t: '费马小定理' }, { id: 'd3-euler', t: '欧拉定理' }, { id: 'd3-app', t: '降幂与快速幂' }, { id: 'd3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="\gcd(a,m)=1" />。满足 <Katex tex="a^{k}\equiv1\pmod m" /> 的最小正整数 <Katex tex="k" /> 称为 <Katex tex="a" /> 对模 <Katex tex="m" /> 的<b>阶</b>，记作 <Katex tex="\operatorname{ord}_m(a)" />。则有
      <p style="text-align:center;margin:8px 0 0"><Katex tex="a^{\varphi(m)}\equiv1\pmod m" />（欧拉定理），&nbsp; 特别地 <Katex tex="a^{p-1}\equiv1\pmod p" />（<Katex tex="p" /> 为素数，费马小定理）。</p>
      并且 <Katex tex="\operatorname{ord}_m(a)\mid\varphi(m)" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createFermat" />
      <div class="cap">图 定3 · <b>费马小定理与欧拉定理</b>：表盘上是模 m 的各余数，从 1 出发反复乘 a，青色细线依次串起 1, a, a², … 的落点。看点：① 互素时这条轨道一定回到金色的 1，回不到 1 就说明 a 与 m 不互素；② 回到 1 的步数即阶，它总能整除右栏的 φ(m)；③ 把 m 换成素数，φ(m)=m−1，欧拉定理就退化成费马小定理。</div>
    </div>

    <h3 class="sec" id="d3-order">幂的循环与阶</h3>
    <p>模 <Katex tex="m" /> 的余数只有 <Katex tex="m" /> 个，把它看成表盘上的 <Katex tex="m" /> 个格。从 1 出发，每乘一次 <Katex tex="a" /> 就跳到一格：<Katex tex="1,a,a^2,a^3,\dots" />。格子有限，序列迟早重复；一旦出现 <Katex tex="a^{i}\equiv a^{j}" />（<Katex tex="i<j" />），在两边同乘 <Katex tex="a" /> 的逆元就得到 <Katex tex="a^{j-i}\equiv1" />。</p>
    <p>这里用到了逆元，也就是 <Katex tex="\gcd(a,m)=1" /> 这个前提。不互素时逆元不存在，序列可能停在一个非 1 的数上反复兜圈，永远回不到 1。画板上把底数调成与 m 共享因子的数，青色轨道就会自己粘住，判读随之改口。</p>
    <p>回到 1 的最小步数就是阶，记作 <Katex tex="\operatorname{ord}_m(a)" />。此后序列以它为周期重复：<Katex tex="a^{k}\equiv1" /> 当且仅当阶整除 <Katex tex="k" />。这条判据把「幂等于 1」的问题化成了「整除」的问题，是后面所有降幂运算的基础。</p>
    <p>举一个例。<Katex tex="m=7" />，<Katex tex="a=3" />：<Katex tex="3,2,6,4,5,1" />，六步回到 1，阶为 6，正好等于 <Katex tex="\varphi(7)=6" />。换成 <Katex tex="a=2" />：<Katex tex="2,4,1" />，阶为 3，而 <Katex tex="\varphi(7)=6" />。可见阶不一定等于 <Katex tex="\varphi(m)" />，但一定整除它。</p>

    <h3 class="sec" id="d3-fermat">费马小定理</h3>
    <p>设 <Katex tex="p" /> 为素数，<Katex tex="p\nmid a" />，则</p>
    <p style="text-align:center"><Katex display tex="a^{p-1}\equiv1\pmod p." /></p>
    <p>两边乘 <Katex tex="a" /> 得更常用的形式 <Katex tex="a^{p}\equiv a\pmod p" />，这一形式对 <Katex tex="p\mid a" /> 也成立（两边同为 0），所以不必附加条件。</p>
    <p>证明看 <Katex tex="a,2a,3a,\dots,(p-1)a" /> 这 <Katex tex="p-1" /> 个数。它们都不被 <Katex tex="p" /> 整除；两两不同余，因为 <Katex tex="ia\equiv ja" /> 两边乘逆元即得 <Katex tex="i\equiv j" />。所以它们模 <Katex tex="p" /> 的余数恰好是 <Katex tex="1,2,\dots,p-1" /> 的一个排列，乘积同余：</p>
    <p style="text-align:center"><Katex display tex="a^{p-1}(p-1)!\equiv(p-1)!\pmod p." /></p>
    <p>而 <Katex tex="(p-1)!" /> 与 <Katex tex="p" /> 互素，可以约去，得 <Katex tex="a^{p-1}\equiv1" />。整个证明只用了「乘以 a 是余数集合到自身的一一对应」这一句话。</p>
    <p>逆命题不成立：<Katex tex="a^{n-1}\equiv1\pmod n" /> 并不能保证 <Katex tex="n" /> 是素数。<Katex tex="n=341=11\times31" /> 时 <Katex tex="2^{340}\equiv1\pmod{341}" />，但 341 是合数。这类数叫<b>伪素数</b>，说明费马小定理可以作为排除合数的初步检验，却不能单凭它断言素数。</p>

    <h3 class="sec" id="d3-euler">欧拉定理</h3>
    <p>把费马小定理里的素数换成一般正整数，<Katex tex="p-1" /> 就要换成 <Katex tex="\varphi(m)" />。设 <Katex tex="\gcd(a,m)=1" />，则</p>
    <p style="text-align:center"><Katex display tex="a^{\varphi(m)}\equiv1\pmod m." /></p>
    <p>证明与上一节完全平行，只是把 <Katex tex="1,\dots,p-1" /> 换成与 <Katex tex="m" /> 互素的那些剩余类，记它们的集合为 <Katex tex="U" />，其中共有 <Katex tex="\varphi(m)" /> 个元素。取 <Katex tex="r\in U" />，因为 <Katex tex="a" /> 也与 <Katex tex="m" /> 互素，乘积 <Katex tex="ar" /> 仍与 <Katex tex="m" /> 互素，落在 <Katex tex="U" /> 内。映射 <Katex tex="r\mapsto ar" /> 有逆映射 <Katex tex="r\mapsto a^{-1}r" />，故为 <Katex tex="U" /> 上的双射。于是 <Katex tex="U" /> 的所有元素与它们各自乘 <Katex tex="a" /> 后的结果，是同一个集合的两种排列，两边相乘：</p>
    <p style="text-align:center"><Katex display tex="a^{\varphi(m)}\prod_{r\in U}r\equiv\prod_{r\in U}r\pmod m." /></p>
    <p>乘积与 <Katex tex="m" /> 互素，可以约去，得 <Katex tex="a^{\varphi(m)}\equiv1" />。<Katex tex="m" /> 为素数时 <Katex tex="U" /> 就是 <Katex tex="1,\dots,p-1" />，<Katex tex="\varphi(m)=m-1" />，立刻退回费马小定理。</p>
    <p>这条定理与「阶整除 <Katex tex="\varphi(m)" />」是同一件事：因为 <Katex tex="a^{\varphi(m)}\equiv1" />，而阶是使幂等于 1 的最小正整数，由 <Katex tex="a^{k}\equiv1\iff\operatorname{ord}\mid k" /> 即得 <Katex tex="\operatorname{ord}\mid\varphi(m)" />。</p>

    <h3 class="sec" id="d3-app">降幂与快速幂</h3>
    <p>定理最直接的用途是降幂。要算 <Katex tex="a^{K}\bmod m" />（<Katex tex="\gcd(a,m)=1" />），只需把指数对 <Katex tex="\varphi(m)" /> 取余：</p>
    <p style="text-align:center"><Katex display tex="a^{K}\equiv a^{K\bmod\varphi(m)}\pmod m." /></p>
    <p>例如算 <Katex tex="3^{100}\bmod 7" />。<Katex tex="\varphi(7)=6" />，<Katex tex="100=6\times16+4" />，于是 <Katex tex="3^{100}\equiv3^{4}=81\equiv4\pmod7" />。指数从三位数缩到一位数，中间不必真的乘一百次。</p>
    <p>另一种常用手法是<b>二进制快速幂</b>：把指数写成二进制，反复平方并按位相乘，<Katex tex="n" /> 次乘法就能算到 <Katex tex="a^{2^n}" /> 量级。这两种方法配合使用，使得模幂运算在上千位整数上也只需毫秒级的时间。RSA 的加密与解密全部建立在此。</p>
    <p>要注意前提。降幂公式要求 <Katex tex="\gcd(a,m)=1" />；不互素时指数不能随意对 <Katex tex="\varphi(m)" /> 取余。更一般的结论要借助中国剩余定理逐素数幂处理，下一章会给出工具。</p>

    <h3 class="sec" id="d3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：指数取余的模是 <Katex tex="\varphi(m)" />，不是 <Katex tex="m" />。</strong>「底数对 m 取余、指数对 φ(m) 取余」是两条不同的规则，混用会算错。<Katex tex="3^{100}\bmod 7" /> 用模 6 降幂，不是模 7。</li>
        <li><strong>提示二：降幂前先确认互素。</strong><Katex tex="\gcd(a,m)=1" /> 是欧拉定理的条件。不互素时 <Katex tex="a^{k}" /> 可能永远不为 1，取余降幂没有依据。</li>
        <li><strong>提示三：阶整除 <Katex tex="\varphi(m)" />，但不是总有阶等于 <Katex tex="\varphi(m)" />。</strong>这样的 <Katex tex="a" /> 存在与否取决于模，它就是下一章的「原根」，并非每个模都有。</li>
        <li><strong>提示四：费马小定理的逆命题不成立。</strong>判断素数要用更细的检验（例如多次换底数试探、或者米勒—拉宾检验），不能只验一次 <Katex tex="a^{n-1}\equiv1" /> 就下结论。</li>
      </ul>
    </div>
    <p>回收与预告：欧拉定理给出了单个同余式的降幂办法。若手上有一组同余式，各自模数互素，可以先把它们分别解出，再拼成一个模为乘积的解——这是中国剩余定理。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFermat } from '../../../boards/numtheory/theorem/fermatlab.js';
import { D_CHAPTERS } from './dnav.js';
</script>
