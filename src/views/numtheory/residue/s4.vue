<template>
  <ChPage :cur="4" no="剩4" base="/numtheory/s" :chapters="S_CHAPTERS"
    title="模运算与密码"
    sub="把前面几章的工具合起来，可以搭出一台加密机器：公钥负责加密，私钥负责解密，两者互逆的依据是欧拉定理。它的安全性不依赖算法的保密，只依赖一个计算事实——分解大整数很难。"
    :toc="[{ id: 's4-rsa', t: 'RSA 的三步' }, { id: 's4-why', t: '为什么能解密' }, { id: 's4-sec', t: '安全性从哪来' }, { id: 's4-more', t: '数论的其他用场' }, { id: 's4-tip', t: '四条提示' }]">
    <div class="note good">取两个不同的大素数 <Katex tex="p,q" />，记 <Katex tex="n=pq" />，<Katex tex="\varphi(n)=(p-1)(q-1)" />。选一个与 <Katex tex="\varphi(n)" /> 互素的 <Katex tex="e" />，求出满足
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="ed\equiv1\pmod{\varphi(n)}" /></p>
      的 <Katex tex="d" />。公钥是 <Katex tex="(n,e)" />，私钥是 <Katex tex="d" />。加密 <Katex tex="c\equiv m^{e}\pmod n" />，解密 <Katex tex="c^{d}\equiv m\pmod n" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createRSA" />
      <div class="cap">图 剩4 · <b>RSA 加密与解密机</b>：报文先进黄色框、再进紫色框，最后在绿色框里被还原。看点：① 公钥里的 e 与私钥 d 由 <Katex tex="ed\equiv1\ (\mathrm{mod}\ \varphi(n))" /> 绑定，两者各自做一次模幂就回到原数；② 用到的模运算只有快速幂与求逆元，与前面几章的方法一致；③ 拖动报文或换一对素数，绿色框里的数始终与黄色框相同——只要 <Katex tex="\varphi(n)" /> 算对了。</div>
    </div>

    <h3 class="sec" id="s4-rsa">RSA 的三步</h3>
    <p><b>第一步，生成密钥。</b>随机取两个大素数 <Katex tex="p,q" />，算出 <Katex tex="n=pq" /> 与 <Katex tex="\varphi(n)=(p-1)(q-1)" />。选公钥指数 <Katex tex="e" />，通常取 65537，它足够大又是素数，且只含两个 1 的二进制位，求幂时乘法次数最少。再用扩展欧几里得算法求出 <Katex tex="d\equiv e^{-1}\pmod{\varphi(n)}" />。公开 <Katex tex="(n,e)" />，销毁 <Katex tex="p,q,\varphi(n)" />。</p>
    <p><b>第二步，加密。</b>把报文按字节切成小于 <Katex tex="n" /> 的整数块 <Katex tex="m" />，逐块算 <Katex tex="c\equiv m^{e}\pmod n" />。这一步只需要公钥，任何人都能做。</p>
    <p><b>第三步，解密。</b>持有私钥的一方算 <Katex tex="m\equiv c^{d}\pmod n" />。同样是一次模幂，复杂度与加密相当。</p>
    <p>实际使用中还要求 <Katex tex="m" /> 与 <Katex tex="n" /> 互素，否则加密不成立。这一条几乎总是成立：<Katex tex="n" /> 只有 <Katex tex="p,q" /> 两个素因子，而报文块是随机取的，撞上因子的概率小到可以忽略。严格起见，实现时会先检查，撞上就换一块。</p>

    <h3 class="sec" id="s4-why">为什么能解密</h3>
    <p>把两步连起来：<Katex tex="c^{d}\equiv(m^{e})^{d}=m^{ed}" />。需要说明 <Katex tex="m^{ed}\equiv m\pmod n" />。</p>
    <p>由 <Katex tex="ed\equiv1\pmod{\varphi(n)}" />，有 <Katex tex="ed=1+k\varphi(n)" />。若 <Katex tex="\gcd(m,n)=1" />，欧拉定理给出 <Katex tex="m^{\varphi(n)}\equiv1" />，于是 <Katex tex="m^{ed}=m\cdot(m^{\varphi(n)})^{k}\equiv m" />。互素的情形到此结束。</p>
    <p>不互素时欧拉定理不适用，要分开看。设 <Katex tex="p\mid m" />、<Katex tex="q\nmid m" />，则在模 <Katex tex="p" /> 下两边同为 0；在模 <Katex tex="q" /> 下 <Katex tex="m" /> 与 <Katex tex="q" /> 互素，而 <Katex tex="\varphi(n)" /> 含因子 <Katex tex="q-1" />，用费马小定理得 <Katex tex="m^{ed}\equiv m\pmod q" />。两个模都对上，由中国剩余定理，模 <Katex tex="n=pq" /> 也对上。这就是为什么本章前面几节都要放在一起讲：欧拉定理给主论证，费马小定理与剩余定理补边界情形。</p>

    <h3 class="sec" id="s4-sec">安全性从哪来</h3>
    <p>公钥公开了 <Katex tex="n" /> 与 <Katex tex="e" />。想求 <Katex tex="d" />，需要先算 <Katex tex="\varphi(n)=(p-1)(q-1)" />，而这等价于把 <Katex tex="n" /> 分解成 <Katex tex="p,q" />。目前没有已知的多项式时间分解算法，最有效的一般方法（数域筛法）也是亚指数复杂度。选 2048 位的 <Katex tex="n" />，分解的代价在今天仍不可行。</p>
    <p>「安全性等于分解难度」这句话有一个前提：不存在绕过分解直接求 <Katex tex="d" /> 的算法。已知求 <Katex tex="d" /> 与分解 <Katex tex="n" /> 在计算上等价，所以这个前提目前是站得住的。</p>
    <p>工程上还要防另一类攻击：不针对数学结构，而针对实现。同一份报文用不同公钥加密、解密时的耗时有差异、填充方案不完整，都可能被利用。所以实际协议里总要加随机填充（如 OAEP），不能直接加密裸报文。数学上的可证明安全与实现上的安全，是两件需要分别对待的事。</p>
    <p>另外，计算私钥时可以不走大模幂：把 <Katex tex="c^{d}" /> 拆成模 <Katex tex="p" /> 与模 <Katex tex="q" /> 两个小模幂，再用中国剩余定理拼回去，速度约为四倍。这条优化在上一章已经给过完整的构造。</p>

    <h3 class="sec" id="s4-more">数论的其他用场</h3>
    <p>素数与模运算不止用于加密。哈希表的规模常取素数，是为了让取模分布更均匀；错误校验码（CRC、Reed–Solomon）建立在有限域的多项式运算上；伪随机数发生器常借模幂构造；连音乐调律里的五度循环，都可以看成模 12 的剩余类问题。</p>
    <p>这些应用的共同点是：把问题搬到某个模下，让「相等」变成「同余」，从而把无穷的整数压缩到有限的格子里。本章与前一章的判据、定理，看上去是抽象练习，实际都在做这件压缩的事。</p>
    <p>数论还有大量没有解决的基本问题：孪生素数对是否有无限多、哥德巴赫猜想、是否存在无穷多形如 <Katex tex="n^2+1" /> 的素数。它们表述简单而工具尚缺，这也是这门学科至今仍活跃的原因之一。</p>

    <h3 class="sec" id="s4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\varphi(n)" /> 用 <Katex tex="(p-1)(q-1)" />，不是 <Katex tex="n-1" />。</strong>只有 <Katex tex="p" /> 为素数时 <Katex tex="\varphi(p)=p-1" />。合数模要按素因子打折，这一步算错，私钥就不对。</li>
        <li><strong>提示二：e 必须与 <Katex tex="\varphi(n)" /> 互素。</strong>否则逆元不存在，<Katex tex="d" /> 求不出来。求逆元用扩展欧几里得算法，不要硬猜。</li>
        <li><strong>提示三：模数只能公开 n，不能公开 p、q。</strong>知道 <Katex tex="p,q" /> 就能算 <Katex tex="\varphi(n)" /> 与 <Katex tex="d" />，整套私钥随之失效。生成密钥后 <Katex tex="p,q" /> 应当销毁。</li>
        <li><strong>提示四：不要自己实现密码协议。</strong>数学公式只是一部分，填充、侧信道、随机数来源都会决定安全与否。教学演示可以手算，实际系统请用经过审查的库。</li>
      </ul>
    </div>
    <p>回收与预告：这一章回到第一章的素数、第二章的欧拉函数、第三章的欧拉定理与中国剩余定理，把它们串成一条可用的链条。数论模块到此收束，后续专题（代数结构、密码学）会在此基础上继续展开。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRSA } from '../../../boards/numtheory/residue/rsalab.js';
import { S_CHAPTERS } from './snav.js';
</script>
