<template>
  <ChPage :cur="1" no="剩1" base="/numtheory/s" :chapters="S_CHAPTERS"
    title="二次剩余与欧拉判别式"
    sub="模素数 p 下，一个数能不能写成某个数的平方，并不平等：能写成平方的恰有一半。判断这件事有一个只做一次幂运算的判据——欧拉判别式，它把「有没有解」压缩成一个取值为 ±1 的指数。"
    :toc="[{ id: 's1-def', t: '平方与二次剩余' }, { id: 's1-euler', t: '欧拉判别式' }, { id: 's1-count', t: '个数与 −1 的归属' }, { id: 's1-recip', t: '二次互反律' }, { id: 's1-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="p" /> 为奇素数，<Katex tex="p\nmid a" />。若同余方程 <Katex tex="x^2\equiv a\pmod p" /> 有解，称 <Katex tex="a" /> 为模 <Katex tex="p" /> 的<b>二次剩余</b>，否则称为<b>二次非剩余</b>。欧拉判别式给出
      <p style="text-align:center;margin:8px 0 0"><Katex tex="a^{\frac{p-1}{2}}\equiv1\pmod p" /> 当 <Katex tex="a" /> 是二次剩余，&nbsp; <Katex tex="a^{\frac{p-1}{2}}\equiv-1\pmod p" /> 当 <Katex tex="a" /> 不是。</p></div>

    <div class="board-wrap">
      <BoardMount :factory="createQuad" />
      <div class="cap">图 剩1 · <b>二次剩余与欧拉判别式机</b>：把 1 到 p−1 逐个列开，金色是二次剩余、灰色不是，每格下方写着它的平方根。看点：① 有根的格子恰好是两个数，且两数之和为 p，即 x 与 p−x；② 非剩余一根也没有，格子下写「无根」；③ 拖动 a 滑块，描金边的那一格立刻给出它的解，下方同时算出 a^{(p−1)/2}，取值 1 与 −1 正好对应有解与无解。</div>
    </div>

    <h3 class="sec" id="s1-def">平方与二次剩余</h3>
    <p>把 <Katex tex="1^2,2^2,\dots,(p-1)^2" /> 逐个算出来看余数，会得到若干重复的值。重复的原因很清楚：<Katex tex="x^2\equiv(p-x)^2" />，所以 <Katex tex="x" /> 与 <Katex tex="p-x" /> 落在同一格上。除这两者之外不会再有第三个：若 <Katex tex="x^2\equiv y^2" />，则 <Katex tex="(x-y)(x+y)\equiv0" />，而 <Katex tex="p" /> 是素数，故 <Katex tex="x\equiv\pm y" />。</p>
    <p>于是 <Katex tex="p-1" /> 个非零数分成 <Katex tex="(p-1)/2" /> 对，每对映到同一个平方，平方值两两不同。结论是：模 <Katex tex="p" /> 的二次剩余恰好 <Katex tex="(p-1)/2" /> 个，非剩余也是 <Katex tex="(p-1)/2" /> 个。画板上金色与灰色的格子数因此总是相等。</p>
    <p>有解时解的个数总是两个，且互为相反数。<Katex tex="p" /> 为偶数时不成立（<Katex tex="p=2" /> 时 <Katex tex="1=-1" />，只有一个根），所以下面的讨论都要求 <Katex tex="p" /> 为奇素数。</p>
    <p>还有一个用起来很方便的观察：二次剩余的乘积仍是二次剩余，非剩余乘非剩余也是二次剩余，两者相乘则为非剩余。逐个验证同余式即可，这与正负号的乘法表同构。</p>

    <h3 class="sec" id="s1-euler">欧拉判别式</h3>
    <p>由费马小定理，<Katex tex="a^{p-1}\equiv1" />，把左端写成平方：<Katex tex="\left(a^{(p-1)/2}\right)^2\equiv1" />。于是 <Katex tex="a^{(p-1)/2}" /> 只能是 1 或 −1（模素数下 <Katex tex="t^2\equiv1" /> 只有这两个根）。判别式说的就是：取 1 当且仅当 <Katex tex="a" /> 是二次剩余。</p>
    <p>两个方向都不难。若 <Katex tex="a\equiv x^2" />，则 <Katex tex="a^{(p-1)/2}\equiv x^{p-1}\equiv1" />，又一次费马小定理。反过来，取模 <Katex tex="p" /> 的一个原根 <Katex tex="g" />，把 <Katex tex="a" /> 写成 <Katex tex="g^{k}" />，则 <Katex tex="a^{(p-1)/2}\equiv g^{k(p-1)/2}" />，它在 <Katex tex="k" /> 为偶数时等于 1、为奇数时等于 −1。而 <Katex tex="g^{k}" /> 是平方当且仅当 <Katex tex="k" /> 是偶数（平方后指数翻倍）。两条线索对上了。</p>
    <p>把判别式写成符号就是<b>勒让德符号</b>：</p>
    <p style="text-align:center"><Katex display tex="\left(\frac{a}{p}\right)=a^{\frac{p-1}{2}}\bmod p\in\{1,-1\}." /></p>
    <p>它有三条便于计算的性质：<Katex tex="\left(\frac{ab}{p}\right)=\left(\frac{a}{p}\right)\left(\frac{b}{p}\right)" />（完全可乘）；<Katex tex="\left(\frac{a^2}{p}\right)=1" />（平方因子可以提出去）；<Katex tex="a\equiv b" /> 时两符号相同。有这三条，判断一个数是否剩余就变成拆因子的事。</p>

    <h3 class="sec" id="s1-count">个数与 −1 的归属</h3>
    <p>−1 是不是二次剩余，是两类素数的分界。由欧拉判别式，<Katex tex="(-1)^{(p-1)/2}" /> 在 <Katex tex="p\equiv1\pmod4" /> 时指数为偶数、取值 1；在 <Katex tex="p\equiv3\pmod4" /> 时指数为奇数、取值 −1。所以</p>
    <p style="text-align:center"><Katex tex="x^2\equiv-1\pmod p" /> 有解 <Katex tex="\iff p\equiv1\pmod4" />。</p>
    <p>画板上把 p 设为 13（<Katex tex="13\equiv1\pmod4" />），把 a 调到 12 就会看到两个根 5 与 8；换成 p=11，a 调到 10 则无论如何找不到根。这一条在下一章的阶与群结构里会再出现一次。</p>
    <p>2 的归属也有简洁判据：<Katex tex="\left(\frac{2}{p}\right)=1" /> 当且仅当 <Katex tex="p\equiv\pm1\pmod8" />。而 3、5 等小素数则没有这么短的规则，需要用互反律换算。</p>

    <h3 class="sec" id="s1-recip">二次互反律</h3>
    <p>判断 <Katex tex="\left(\frac{q}{p}\right)" />（两个不同奇素数）时，有一条把上下互换的定理：</p>
    <p style="text-align:center"><Katex display tex="\left(\frac{p}{q}\right)\left(\frac{q}{p}\right)=(-1)^{\frac{p-1}{2}\cdot\frac{q-1}{2}}." /></p>
    <p>右端的符号只在 <Katex tex="p" />、<Katex tex="q" /> 都 ≡3 (mod 4) 时取 −1，其余情形取 1。它把「模大素数」的判定换成「模小素数」的判定，于是可以一路递降，配合前面两条补充律算出任何勒让德符号。</p>
    <p>看一个例子：判断 5 是不是模 29 的二次剩余。<Katex tex="29\equiv1\pmod4" />，所以 <Katex tex="\left(\frac{5}{29}\right)=\left(\frac{29}{5}\right)=\left(\frac{4}{5}\right)=1" />，是剩余。直接验算 <Katex tex="11^2=121\equiv5\pmod{29}" />，两条路一致。</p>
    <p>这条定理是高斯在十九岁时给出的第一个证明，此后他给出了多个不同版本。它把「平方」这一局部性质与素数的同余类联系起来，是初等数论中最深的结果之一，也是二次互反律在整个代数数论里被推广的起点。</p>

    <h3 class="sec" id="s1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：「有解」与「有几个解」是两回事。</strong>二次剩余都有两个解，不会只有一个（模 2 例外）。写答案时若只给一个根，就漏了 p−x。</li>
        <li><strong>提示二：判别式要求 p 为奇素数。</strong><Katex tex="a^{(p-1)/2}" /> 里的指数在 p=2 时是分数，式子失效。复合数模也不能直接用，要先按中国剩余定理拆到各个素数幂上。</li>
        <li><strong>提示三：勒让德符号先约化再算。</strong>指数很大时不要硬做幂运算，先用 <Katex tex="a\equiv b" /> 化简、提出平方因子，再用互反律把模数换小。</li>
        <li><strong>提示四：−1 的归属看 p mod 4，不要记成「总是剩余」。</strong>两类素数各占一半，混淆这一点会让后面的阶与平方根公式连锁出错。</li>
      </ul>
    </div>
    <p>回收与预告：欧拉判别式的证明借用了「模 p 的原根」。原根这个概念本身需要单独讨论——它何时存在、有几个、怎样用一张指数表把乘法变成加法，是下一章的内容。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQuad } from '../../../boards/numtheory/residue/quadres.js';
import { S_CHAPTERS } from './snav.js';
</script>
