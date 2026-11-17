<template>
  <ChPage :cur="2" no="剩2" base="/numtheory/s" :chapters="S_CHAPTERS"
    title="原根与指数"
    sub="模素数 p 的乘法把非零余数连成一个圈。若某个数反复自乘能走遍全部 p−1 个非零余数，它就是原根。原根存在时，每个非零余数都能写成它的幂，指数因此可以像对数一样制表，乘法随之变成指数的加法。"
    :toc="[{ id: 's2-order', t: '阶与原根' }, { id: 's2-exist', t: '原根的存在与个数' }, { id: 's2-index', t: '指数表与运算' }, { id: 's2-dlog', t: '离散对数与它的困难' }, { id: 's2-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="p" /> 为素数，<Katex tex="\gcd(g,p)=1" />。若 <Katex tex="g" /> 对模 <Katex tex="p" /> 的阶等于 <Katex tex="p-1" />，即 <Katex tex="g,g^2,\dots,g^{p-1}" /> 恰好取遍全部非零余数，称 <Katex tex="g" /> 为模 <Katex tex="p" /> 的<b>原根</b>。模素数 <Katex tex="p" /> 的原根共有 <Katex tex="\varphi(p-1)" /> 个。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPrimRoot" />
      <div class="cap">图 剩2 · <b>原根与指数</b>：表盘上有 0 到 p−1 各格，从 1 出发反复乘 g，青色细线依次串起落点。看点：① 只有原根能让这条轨道一次走遍全部非零余数，其他底数会提前闭合、只覆盖一个子群；② 右栏读出阶，它必然整除 p−1；③ 原根存在时，底下的指数表给出 k 到 g^k 的对应，这张表就是「离散对数表」。</div>
    </div>

    <h3 class="sec" id="s2-order">阶与原根</h3>
    <p>对每个与 <Katex tex="p" /> 互素的 <Katex tex="g" />，幂序列 <Katex tex="1,g,g^2,\dots" /> 在有限的余数里必然循环，回到 1 的最小步数就是阶。阶最大能到 <Katex tex="p-1" />，因为那段序列本身只有 <Katex tex="p-1" /> 个可用的值。取到最大值的 <Katex tex="g" /> 就是原根。</p>
    <p>阶有一个基本性质：<Katex tex="g^{k}\equiv1" /> 当且仅当阶整除 <Katex tex="k" />。由欧拉定理 <Katex tex="g^{p-1}\equiv1" />，立刻得到「阶整除 <Katex tex="p-1" />」。这条整除关系不只是一个读数，它把「哪些幂等于 1」简化成数论里的整除判断。</p>
    <p>由此还能数出有多少个原根。若 <Katex tex="g" /> 是原根，则 <Katex tex="g^{k}" /> 的阶是 <Katex tex="(p-1)/\gcd(k,p-1)" />，它等于 <Katex tex="p-1" /> 当且仅当 <Katex tex="\gcd(k,p-1)=1" />。满足条件的 <Katex tex="k" /> 有 <Katex tex="\varphi(p-1)" /> 个，所以原根的个数就是 <Katex tex="\varphi(p-1)" />。画板右栏的读数正是按这条式子算的。</p>
    <p>例：<Katex tex="p=11" />，<Katex tex="\varphi(10)=4" />，原根有 4 个。逐个试下来是 <Katex tex="2,6,7,8" />；以 <Katex tex="2" /> 为例，<Katex tex="2,4,8,5,10,9,7,3,6,1" /> 十步走遍，阶为 10。</p>

    <h3 class="sec" id="s2-exist">原根的存在与个数</h3>
    <p>模素数原根总是存在，但这句话需要证明。一个常用路线是数方程的解的个数：若 <Katex tex="d\mid p-1" />，方程 <Katex tex="x^{d}\equiv1" /> 在模 <Katex tex="p" /> 下至多 <Katex tex="d" /> 个解——多项式次数为 <Katex tex="d" />，而模素数下次数为 <Katex tex="d" /> 的多项式不会有超过 <Katex tex="d" /> 个根。</p>
    <p>另一方面，把除 1 以外的 <Katex tex="p-1" /> 个余数按阶分类，阶必定整除 <Katex tex="p-1" />。设阶恰为 <Katex tex="d" /> 的元素有 <Katex tex="N(d)" /> 个。可以验证：<Katex tex="N(d)" /> 要么是 0，要么恰为 <Katex tex="\varphi(d)" />；而 <Katex tex="\sum_{d\mid p-1}\varphi(d)=p-1" />（这个恒等式在第二章证过）。两边的总和都等于 <Katex tex="p-1" />，又不能有哪一项「不足」被别项超额补上，于是每项都必须取满，特别地 <Katex tex="N(p-1)=\varphi(p-1)>0" />。</p>
    <p>模素数如此；模一般的 <Katex tex="m" /> 就不一定。模 8 没有原根：<Katex tex="1,3,5,7" /> 的阶全是 2，谁也走不到 <Katex tex="\varphi(8)=4" />。判据是模 <Katex tex="m" /> 有原根当且仅当 <Katex tex="m=2,4,p^{a},2p^{a}" />（<Katex tex="p" /> 为奇素数）。这个结论在下一章的密码应用里用得到，因为 RSA 用的正是合数模。</p>

    <h3 class="sec" id="s2-index">指数表与运算</h3>
    <p>固定一个原根 <Katex tex="g" /> 后，每个与 <Katex tex="p" /> 互素的 <Katex tex="a" /> 都能唯一写成 <Katex tex="a\equiv g^{k}" />，其中 <Katex tex="0\le k<p-1" />。这个 <Katex tex="k" /> 称为 <Katex tex="a" /> 对 <Katex tex="g" /> 的<b>指数</b>，也写作 <Katex tex="\operatorname{ind}_g a" />。它与实数的对数满足同一套规律：</p>
    <p style="text-align:center"><Katex display tex="\operatorname{ind}(ab)\equiv\operatorname{ind}a+\operatorname{ind}b\pmod{p-1},\qquad \operatorname{ind}(a^{n})\equiv n\operatorname{ind}a\pmod{p-1}." /></p>
    <p>两条式子都可以直接用 <Katex tex="g^{i}g^{j}=g^{i+j}" /> 与 <Katex tex="(g^{i})^{n}=g^{in}" /> 验证。指数和按 <Katex tex="p-1" /> 取模，是因为 <Katex tex="g^{p-1}\equiv1" />——这正是阶决定周期的地方。</p>
    <p>要做乘法，查两张表即可：由 <Katex tex="a,b" /> 查出两个指数，相加后对 <Katex tex="p-1" /> 取模，再反查回余数。手算时这比直接乘再取余快得多。<Katex tex="p" /> 稍大就把指数表抄成两列，一张按余数查指数、一张按指数查余数。</p>
    <p>同一个数对不同原根的指数会变，但相加取模的规律不变。所以指数表必须写明用的是哪个原根；不然读出来的 <Katex tex="k" /> 没有意义。</p>

    <h3 class="sec" id="s2-dlog">离散对数与它的困难</h3>
    <p>指数表可以正着查，反过来就难了：给定 <Katex tex="g" /> 与 <Katex tex="g^{k}\bmod p" /> 求 <Katex tex="k" />，这就是<b>离散对数问题</b>。与实数里的对数相比，它没有连续结构可借，最快的通用算法也只到亚指数级复杂度。</p>
    <p>计算方便与反算困难，这两点合在一起，就构成了一类密码协议的基础。Diffie–Hellman 密钥交换让双方各取一个私密的指数、公开 <Katex tex="g^{k}" /> 的余数，共同的密钥由对方公开值再取一次幂得到；窃听者手里只有两个余数，要算出共同的密钥就得先解离散对数。</p>
    <p>选 <Katex tex="p" /> 时还有一条额外要求：<Katex tex="p-1" /> 应含一个大素因子，否则可以借 Pohlig–Hellman 方法把问题拆成若干小问题分别求解，安全性大幅下降。这类细节说明，数论定理的结论与它在密码里的用法之间，还隔着工程上的取舍。</p>

    <h3 class="sec" id="s2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：阶整除 p−1，原根的阶等于 p−1。</strong>只验 <Katex tex="g^{p-1}\equiv1" /> 不足以说明是原根（每个互素的 g 都满足）；要证原根，得排除所有真因子 <Katex tex="(p-1)/q" />（q 取 p−1 的素因子）。</li>
        <li><strong>提示二：指数运算的模是 p−1。</strong>指数相加、数乘之后都要对 <Katex tex="p-1" /> 取模，而不是对 p 取模。混淆这两者会得到查不到的值。</li>
        <li><strong>提示三：原根只在特定模下存在。</strong>模 8、模 12 都没有。遇到合数模，先按 <Katex tex="2,4,p^{a},2p^{a}" /> 检查，不要默认存在。</li>
        <li><strong>提示四：指数表依赖所选原根。</strong>换一个原根，整张表的指数全部改写，而「指数相加」的规律不变。抄表时连同原根一起记下。</li>
      </ul>
    </div>
    <p>回收与预告：原根让模素数的乘法成了一个循环群，欧拉判别式也因此有了第二种证明。下一章离开同余，去看等式——方程 <Katex tex="ax+by=c" /> 的整数解，以及勾股数这类更一般的整数方程。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPrimRoot } from '../../../boards/numtheory/residue/primroot.js';
import { S_CHAPTERS } from './snav.js';
</script>
