<template>
  <ChPage :cur="2" no="整2" base="/numtheory/z" :chapters="Z_CHAPTERS"
    title="最大公约数与欧几里得算法"
    sub="两个数的公共约数里最大的那一个，可以由一次次的带余除法算出来。辗转相除把求最大公约数变成机械的算术，裴蜀等式则说：这个最大的约数一定能写成两数的整数组合。"
    :toc="[{ id: 'z2-gcd', t: '公约数与最大公约数' }, { id: 'z2-euclid', t: '辗转相除' }, { id: 'z2-bezout', t: '裴蜀等式' }, { id: 'z2-cop', t: '互素与最小公倍数' }, { id: 'z2-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="a,b" /> 是不全为零的整数。它们的公共约数中最大的一个叫<b>最大公约数</b>，记作 <Katex tex="\gcd(a,b)" />。若 <Katex tex="a,b" /> 反复做带余除法：
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="a=q_1b+r_1,\quad b=q_2r_1+r_2,\quad\cdots,\quad r_{k-1}=q_{k+1}r_k+0," /></p>
      则最后一个非零余数 <Katex tex="r_k" /> 就是 <Katex tex="\gcd(a,b)" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createGcd" />
      <div class="cap">图 整2 · <b>最大公约数与欧几里得算法机</b>：拖动长边与宽边，看正方形怎样铺满矩形。看点：① 每次沿当前较长的一边排满正方形，剩下一条窄矩形，这正是一步带余除法；② 正方形越来越小，最终不留空隙，最后一块的边长就是 <Katex tex="\gcd" />；③ 右栏把每一步写成 <Katex tex="x=qy+r" />，最后一行是裴蜀等式，两个整数系数由同一套步骤倒推出来。</div>
    </div>

    <h3 class="sec" id="z2-gcd">公约数与最大公约数</h3>
    <p>能同时整除 <Katex tex="a" /> 与 <Katex tex="b" /> 的数叫它们的<b>公约数</b>。公约数总是成对出现——若 <Katex tex="d" /> 整除 <Katex tex="a" /> 与 <Katex tex="b" />，则 <Katex tex="-d" /> 也是。约定只谈正公约数，这样最大的那一个才有唯一的名字。</p>
    <p>最大公约数可以用「列举」来理解：把两数的正约数各列一张表，取交集里最大的元素。例如 <Katex tex="30" /> 的约数是 <Katex tex="1,2,3,5,6,10,15,30" />，<Katex tex="18" /> 的约数是 <Katex tex="1,2,3,6,9,18" />，交集里最大的是 <Katex tex="6" />。这个做法在数小的时候很好用，数一大，列出全部约数就不现实了。</p>
    <p>还有一条实用的判据：<Katex tex="d=\gcd(a,b)" /> 当且仅当 <Katex tex="d" /> 是 <Katex tex="a,b" /> 的公约数，且任何公约数都整除 <Katex tex="d" />。换句话说，最大公约数不是「约数里最大的那个」这么一句量的描述，而是「所有公约数都是它的约数」这一结构性的性质。这条性质在证明里比大小更好用。</p>
    <p>几个直接的结果：<Katex tex="\gcd(a,0)=|a|" />；<Katex tex="\gcd(a,b)=\gcd(b,a)" />；对任意整数 <Katex tex="k" />，<Katex tex="\gcd(a,b)=\gcd(a+kb,b)" />。最后一条是辗转相除的全部依据。</p>

    <h3 class="sec" id="z2-euclid">辗转相除</h3>
    <p>设 <Katex tex="a=qb+r" />，其中 <Katex tex="0\le r<b" />。要证 <Katex tex="\gcd(a,b)=\gcd(b,r)" />，只需说明两者的公约数集合相同：若 <Katex tex="d\mid a" /> 且 <Katex tex="d\mid b" />，由 <Katex tex="r=a-qb" /> 得 <Katex tex="d\mid r" />；反过来，若 <Katex tex="d\mid b" /> 且 <Katex tex="d\mid r" />，由 <Katex tex="a=qb+r" /> 得 <Katex tex="d\mid a" />。两边互相包含，两个集合相等，最大元自然相等。</p>
    <p>于是不断把「大数除以小数」换成「小数除以余数」，数字一路变小，又始终是正整数，必然在有限步后出现余数 <Katex tex="0" />。此时最后一个非零余数就是答案。</p>
    <p>用 <Katex tex="30" /> 与 <Katex tex="18" /> 走一遍：</p>
    <p style="text-align:center"><Katex display tex="30=1\times18+12,\qquad 18=1\times12+6,\qquad 12=2\times6+0." /></p>
    <p>最后的非零余数是 <Katex tex="6" />，所以 <Katex tex="\gcd(30,18)=6" />。画板上矩形被铺满的过程与这三行算式一一对应：先铺 <Katex tex="1" /> 块 <Katex tex="18\times18" /> 的正方形，余下 <Katex tex="12\times18" /> 的一条；再铺 <Katex tex="1" /> 块 <Katex tex="12\times12" />，余下 <Katex tex="12\times6" />；最后正好铺 <Katex tex="2" /> 块 <Katex tex="6\times6" />。</p>
    <p>算法很快。步数大致与数位的五倍成正比，即使两数是上百位的大整数，几十步之内也一定结束。这一点是后面 RSA 能用的前提之一：判断两数互素只需几步，几乎不花时间。</p>

    <h3 class="sec" id="z2-bezout">裴蜀等式</h3>
    <p>把辗转相除的每一步倒过来代，可以把最后的余数写成最初两数的整数组合。以 <Katex tex="30" /> 与 <Katex tex="18" /> 为例：</p>
    <p style="text-align:center"><Katex display tex="6=18-12=18-(30-18)=2\times18-30." /></p>
    <p>一般地，对任意不全为零的整数 <Katex tex="a,b" />，存在整数 <Katex tex="x,y" /> 使得</p>
    <p style="text-align:center"><Katex display tex="ax+by=\gcd(a,b)." /></p>
    <p>这条叫<b>裴蜀等式</b>（也叫贝祖定理）。它的用处不止于算出系数：把右端写成 <Katex tex="d" />，就得到<b>所有</b>整数组合 <Katex tex="ax+by" /> 的集合恰好是 <Katex tex="d" /> 的所有倍数。理由是显然的——每个组合都被 <Katex tex="d" /> 整除，而 <Katex tex="d" /> 本身又能被某个组合凑出来。</p>
    <p>推论：<Katex tex="ax+by=c" /> 有整数解当且仅当 <Katex tex="\gcd(a,b)\mid c" />。这条在下一章解一次同余方程时直接用得上。系数 <Katex tex="x,y" /> 不唯一：若 <Katex tex="(x_0,y_0)" /> 是一组解，则 <Katex tex="(x_0+bt,\ y_0-at)" /> 对任意整数 <Katex tex="t" /> 也都是解。</p>

    <h3 class="sec" id="z2-cop">互素与最小公倍数</h3>
    <p>若 <Katex tex="\gcd(a,b)=1" />，称 <Katex tex="a" /> 与 <Katex tex="b" /> <b>互素</b>。由裴蜀等式，互素等价于存在整数 <Katex tex="x,y" /> 使 <Katex tex="ax+by=1" />。从这条出发可以推出几条常用的结论：</p>
    <ul>
      <li>若 <Katex tex="a\mid bc" /> 且 <Katex tex="\gcd(a,b)=1" />，则 <Katex tex="a\mid c" />。这是「约分」的原理。</li>
      <li>若 <Katex tex="a\mid c" />、<Katex tex="b\mid c" /> 且 <Katex tex="\gcd(a,b)=1" />，则 <Katex tex="ab\mid c" />。两个互素的约数可以合并。</li>
      <li>若 <Katex tex="\gcd(a,m)=\gcd(b,m)=1" />，则 <Katex tex="\gcd(ab,m)=1" />。互素在乘法下保持。</li>
    </ul>
    <p>与最大公约数配套的是<b>最小公倍数</b> <Katex tex="\operatorname{lcm}(a,b)" />，即同时是两数倍数的最小的正整数。两者由一个漂亮的等式连起来：</p>
    <p style="text-align:center"><Katex display tex="\gcd(a,b)\cdot\operatorname{lcm}(a,b)=|ab|." /></p>
    <p>所以求了最大公约数，最小公倍数也就顺手得到。这条等式只对两个数成立，三个数时就乘不起来，例如 <Katex tex="\gcd(2,4,8)\cdot\operatorname{lcm}(2,4,8)=2\times8=16\ne2\cdot4\cdot8" />。</p>

    <h3 class="sec" id="z2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：相除时用较大的数除以较小的数。</strong>反着做虽然等式也成立，余数会变成负数，后续步骤就要额外处理符号，白白添麻烦。</li>
        <li><strong>提示二：答案取最后一个非零余数。</strong>终点是余数 <Katex tex="0" /> 那一步，取它上一步的余数，不要取它的除数以外的东西。</li>
        <li><strong>提示三：裴蜀等式里的系数不唯一。</strong>算出一组 <Katex tex="x,y" /> 即可，别把「唯一」写进结论；另一组解与这组相差 <Katex tex="(b/d,-a/d)" /> 的整数倍。</li>
        <li><strong>提示四：<Katex tex="\gcd" /> 与 <Katex tex="\operatorname{lcm}" /> 的乘积公式只对两个数成立。</strong>三个及以上就要逐对处理，或者用质因数分解里各素数取最小、最大指数的办法。</li>
      </ul>
    </div>
    <p>回收与预告：辗转相除算出了最大公约数，裴蜀等式说所有整数组合正好是它的倍数。把「差是 <Katex tex="m" /> 的倍数」这件事单独拿出来研究，就是同余。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGcd } from '../../../boards/numtheory/basic/gcdlab.js';
import { Z_CHAPTERS } from './znav.js';
</script>
