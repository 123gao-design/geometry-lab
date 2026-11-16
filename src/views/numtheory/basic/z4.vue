<template>
  <ChPage :cur="4" no="整4" base="/numtheory/z" :chapters="Z_CHAPTERS"
    title="一次同余方程"
    sub="形如 ax≡b (mod m) 的方程，解的个数由 a 与 m 的最大公约数决定：不整除 b 就无解，整除则恰有 d 个解。求出其中一个，全部解也就写出来了。"
    :toc="[{ id: 'z4-exist', t: '解的存在性' }, { id: 'z4-count', t: '为什么恰有 d 个解' }, { id: 'z4-solve', t: '求解的方法' }, { id: 'z4-linear', t: '与不定方程的联系' }, { id: 'z4-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="m" /> 是正整数，<Katex tex="d=\gcd(a,m)" />。同余方程
      <p style="text-align:center;margin:6px 0"><Katex display tex="ax\equiv b\ (\mathrm{mod}\ m)" /></p>
      在 <Katex tex="d\nmid b" /> 时无解；在 <Katex tex="d\mid b" /> 时恰有 <Katex tex="d" /> 个模 <Katex tex="m" /> 互不同余的解，它们是
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="x\equiv x_0\ \left(\mathrm{mod}\ \frac{m}{d}\right)," /></p>
      在 <Katex tex="0,1,\dots,m-1" /> 中取出的 <Katex tex="d" /> 个代表。</div>

    <div class="board-wrap">
      <BoardMount :factory="createLinearCong" />
      <div class="cap">图 整4 · <b>一次同余方程机</b>：表盘有 <Katex tex="m" /> 个刻度，金色刻度就是解。看点：① 把 <Katex tex="b" /> 调到 <Katex tex="\gcd(a,m)" /> 除不尽的值，金色刻度全部消失；② <Katex tex="d\mid b" /> 时金色刻度恰有 <Katex tex="d" /> 个，彼此等间隔排开；③ 把 <Katex tex="a" /> 换成与 <Katex tex="m" /> 互素的数，只剩一个解，此时翻遍表盘也只落一格。</div>
    </div>

    <h3 class="sec" id="z4-exist">解的存在性</h3>
    <p>把方程写成 <Katex tex="m\mid(ax-b)" />，即存在整数 <Katex tex="k" /> 使 <Katex tex="ax-b=mk" />，也就是</p>
    <p style="text-align:center"><Katex display tex="ax-mk=b." /></p>
    <p>这是一个关于 <Katex tex="x,k" /> 的一次不定方程。上一章的裴蜀等式说：<Katex tex="ax-mk=b" /> 有整数解，当且仅当 <Katex tex="\gcd(a,m)\mid b" />。于是同余方程有解的条件立刻得到。</p>
    <p>这条判据的另一半同样重要：若 <Katex tex="d\nmid b" />，那么对一切整数 <Katex tex="x" />，<Katex tex="ax\equiv b" /> 都不成立，表盘上没有一格是金色。没有「部分解」这种中间状态。</p>
    <p>当 <Katex tex="d=1" /> 时条件是 <Katex tex="1\mid b" />，永远满足，所以只要 <Katex tex="a" /> 与 <Katex tex="m" /> 互素，方程必有唯一解。这一档叫「可逆」的情形，<Katex tex="a" /> 在模 <Katex tex="m" /> 下有逆元，解写成 <Katex tex="x\equiv a^{-1}b" />。</p>

    <h3 class="sec" id="z4-count">为什么恰有 d 个解</h3>
    <p>先看一个具体例子：<Katex tex="4x\equiv8\ (\mathrm{mod}\ 12)" />。这里 <Katex tex="d=\gcd(4,12)=4" />，而 <Katex tex="4\mid8" />，所以有解。逐个试 <Katex tex="x=0,1,\dots,11" />，成立的只有 <Katex tex="2,5,8,11" />，恰好四个。</p>
    <p>原因在于 <Katex tex="4x" /> 在模 <Katex tex="12" /> 下只取得到 <Katex tex="0,4,8" /> 三种值——它永远落在 <Katex tex="4" /> 的倍数上，而且不同的 <Katex tex="x" /> 会重复。具体地，<Katex tex="x" /> 每增加 <Katex tex="3" />，<Katex tex="4x" /> 就增加 <Katex tex="12" />，落回同一格。所以 <Katex tex="12" /> 个 <Katex tex="x" /> 被压进 <Katex tex="3" /> 格，每格 <Katex tex="4" /> 个。</p>
    <p>一般情形就是这样：<Katex tex="ax" /> 的取值只能是 <Katex tex="d" /> 的倍数，那些不是 <Katex tex="d" /> 的倍数的 <Katex tex="b" /> 就落不到；落在 <Katex tex="d" /> 的倍数上的每一格，都被 <Katex tex="d" /> 个不同的 <Katex tex="x" /> 共享。于是有解时解的个数恰为 <Katex tex="d" />，且这 <Katex tex="d" /> 个解相隔 <Katex tex="m/d" />。</p>
    <p>这个间隔值得记住：模 <Katex tex="m" /> 下有 <Katex tex="d" /> 个解，换到模 <Katex tex="m/d" /> 下就只剩一个。约去公因子 <Katex tex="d" /> 把方程变成 <Katex tex="\frac{a}{d}x\equiv\frac{b}{d}\ (\mathrm{mod}\ \frac{m}{d})" />，此时系数与模互素，解唯一。</p>

    <h3 class="sec" id="z4-solve">求解的方法</h3>
    <p>先算 <Katex tex="d=\gcd(a,m)" /> 并检验整除。若 <Katex tex="d\mid b" />，把方程两边与模同时除以 <Katex tex="d" />：</p>
    <p style="text-align:center"><Katex display tex="\frac{a}{d}x\equiv\frac{b}{d}\ \left(\mathrm{mod}\ \frac{m}{d}\right)." /></p>
    <p>新方程的系数 <Katex tex="a/d" /> 与模 <Katex tex="m/d" /> 互素，有唯一解。求这个解可以有两种做法。</p>
    <p><b>做法一：求逆元。</b>用扩展欧几里得算法求出 <Katex tex="u" /> 使 <Katex tex="\frac{a}{d}u\equiv1" />，则 <Katex tex="x_0\equiv u\cdot\frac{b}{d}" />。以 <Katex tex="4x\equiv8\ (\mathrm{mod}\ 12)" /> 为例，约去 <Katex tex="4" /> 得 <Katex tex="x\equiv2\ (\mathrm{mod}\ 3)" />，系数已是 <Katex tex="1" />，直接读出 <Katex tex="x_0=2" />。再在 <Katex tex="[0,12)" /> 里取 <Katex tex="2,5,8,11" />。</p>
    <p><b>做法二：枚举小模。</b>新模 <Katex tex="m/d" /> 通常小了很多，逐个代入即可。这是考试里最省时的办法，也是理解解集结构的途径——把剩下的 <Katex tex="d-1" /> 个解每次加 <Katex tex="m/d" /> 就得到。</p>
    <p>最后要检查解集是否写全。模 <Katex tex="m" /> 下应有 <Katex tex="d" /> 个互不同余的解；只写 <Katex tex="x\equiv x_0\ (\mathrm{mod}\ m)" /> 会漏掉其余 <Katex tex="d-1" /> 个，因为那个同余式只给出一类。</p>

    <h3 class="sec" id="z4-linear">与不定方程的联系</h3>
    <p>同余方程与二元一次不定方程是同一件事的两种写法。<Katex tex="ax\equiv b\ (\mathrm{mod}\ m)" /> 的每一个解 <Katex tex="x" /> 都对应一个 <Katex tex="k" />，使 <Katex tex="ax-mk=b" />；反过来，不定方程的一组 <Katex tex="(x,k)" /> 也给出同余方程的一个解 <Katex tex="x" />。</p>
    <p>所以两边的结论可以互相搬运。不定方程 <Katex tex="ax+by=c" /> 的通解是 <Katex tex="x=x_0+\frac{b}{d}t" />、<Katex tex="y=y_0-\frac{a}{d}t" />，其中 <Katex tex="d=\gcd(a,b)" />；同余方程里「解每隔 <Katex tex="m/d" /> 重复一次」正是这条参数式的另一种说法。</p>
    <p>把参数 <Katex tex="t" /> 限制在非负整数，就得到「非负整数解」的问题；再加不等式限制，就是线性规划里的整数解。数论与规划在这里接上，后面中国剩余定理还会把多个同余方程拼在一起。</p>

    <h3 class="sec" id="z4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：先算 <Katex tex="\gcd(a,m)" /> 再动手。</strong>除以 <Katex tex="d" /> 不整除 <Katex tex="b" /> 时，后面一切都是白算。判据放在第一步，可以省掉大量无效推导。</li>
        <li><strong>提示二：约分时模要一起除。</strong><Katex tex="4x\equiv8\ (\mathrm{mod}\ 12)" /> 约成 <Katex tex="x\equiv2\ (\mathrm{mod}\ 3)" /> 而不是 <Katex tex="x\equiv2\ (\mathrm{mod}\ 12)" />，否则会丢掉 <Katex tex="5,8,11" /> 三个解。</li>
        <li><strong>提示三：解集要写全 <Katex tex="d" /> 个。</strong>同余解是一组代表，不是单独一个数。题目问「模 <Katex tex="m" /> 下的解」，答案应列到 <Katex tex="d" /> 个为止。</li>
        <li><strong>提示四：不能用普通除法「除以 <Katex tex="a" />」。</strong>同余式里没有除法，只有乘逆元。只有在 <Katex tex="\gcd(a,m)=1" /> 时 <Katex tex="a" /> 才有逆元，这一步才合法。</li>
      </ul>
    </div>
    <p>回收与预告：同余方程的个数结论来自 <Katex tex="\gcd" />，而 <Katex tex="ax" /> 能取到的值都是 <Katex tex="d" /> 的倍数。下一章转向素数——它们是全部整数的乘性骨架，也是把模运算的周期性用足的地方。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLinearCong } from '../../../boards/numtheory/basic/linearcong.js';
import { Z_CHAPTERS } from './znav.js';
</script>
