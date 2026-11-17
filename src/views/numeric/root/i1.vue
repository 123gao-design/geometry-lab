<template>
  <ChPage :cur="1" no="迭1" base="/numeric/i" :chapters="NI_CHAPTERS"
    title="二分法"
    sub="方程 f(x)=0 的根夹在两端异号的区间里。取中点看符号，把不含根的那一半扔掉，区间一次比一次短一半。"
    :toc="[{ id: 'i1-thm', t: '依据与步骤' }, { id: 'i1-err', t: '误差上界与步数' }, { id: 'i1-why', t: '为什么它最稳' }, { id: 'i1-pit', t: '前提与取舍' }]">

    <div class="note good" id="i1-thm">若 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上连续且 <Katex tex="f(a)f(b)&lt;0" />，则区间内至少有一个根。取中点 <Katex tex="m=\dfrac{a+b}{2}" />：若 <Katex tex="f(m)" /> 与 <Katex tex="f(a)" /> 同号，根在 <Katex tex="[m,b]" />；否则根在 <Katex tex="[a,m]" />。区间换掉一半，重复下去。</div>

    <div class="board-wrap">
      <BoardMount :factory="createBisectLab" />
      <div class="cap">图 迭1 · <b>二分法</b>：蓝带是当前保留的区间，橙色的 a、b 是它的两端，紫色是中点与 <Katex tex="f(m)" />。看点：连点「折半一次」，蓝带迅速收窄，紫色竖线始终在带内；右栏记下每一步的区间；把精度滑块拨到 <Katex tex="10^{-5}" />，需要多折好几下，但每一下都只把误差减半，不会落空。</div>
    </div>

    <h3 class="sec" id="i1-thm">依据与步骤</h3>
    <p>全部依据只有一句话：连续函数在两端异号的区间里必有零点。这条结论保证了无论怎么折，根都还在留下的那一半里，所以二分法不会把根弄丢，也不需要判断根有几个。</p>
    <p>步骤可以机械地执行：算中点、算中点的函数值、看它与左端点是否同号、留下含根的一半。四步循环，没有判断难易，也没有参数可调。图 迭1 里的每一下「折半一次」就是这四步。</p>
    <p>折到 <Katex tex="f(m)=0" /> 是运气，一般不指望。实际做法是折到区间足够短，把中点当近似根交出去，剩下的误差由区间长度控制。</p>

    <h3 class="sec" id="i1-err">误差上界与步数</h3>
    <p>折了 <Katex tex="n" /> 次之后，区间长度是 <Katex tex="\dfrac{b-a}{2^n}" />，取中点作近似值，误差不超过区间的一半：<Katex tex="|x_n-x^*|\le\dfrac{b-a}{2^{\,n+1}}" />。这个界只与初始区间和折的次数有关，与 <Katex tex="f" /> 的形状毫无关系。</p>
    <p>反过来用它定步数。要求误差不超过 <Katex tex="\varepsilon" />，解 <Katex tex="\dfrac{b-a}{2^{\,n+1}}\le\varepsilon" /> 得 <Katex tex="n\ge\log_2\dfrac{b-a}{\varepsilon}-1" />。初值区间长 1、要精确到 <Katex tex="10^{-5}" />，取 <Katex tex="n=16" /> 就够。</p>
    <p>这个界是「一定不超过」，实际误差常常比它小得多。为了保证，宁可多折几下——每多折一次只是再算一个函数值，代价很小。</p>

    <h3 class="sec" id="i1-why">为什么它最稳</h3>
    <p>二分法只用到函数值的<b>符号</b>，不用大小，也不用导数。函数在这里有多陡、有没有剧烈摆动，都不影响区间每次减半，所以它对病态的函数照样有效。</p>
    <p>代价是慢。误差按 <Katex tex="1/2^n" /> 收缩，每折一次只多一位二进制精度，想多一位十进制有效数字要折三到四次。牛顿法在根附近一步就能把误差平方，二分法做不到。</p>
    <p>实际计算里两者常常合用：先用二分法把根圈进一个小区间，保证不跑飞，再换牛顿法快速收敛。二分法负责稳，牛顿法负责快。</p>

    <h3 class="sec" id="i1-pit">前提与取舍</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：两端同号时不能用。</strong>区间内可能仍有根（比如两个），但二分法的第一步就推不下去了。先画图或分析单调性，找到异号的区间。</li>
        <li><strong>提示二：连续是硬条件。</strong><Katex tex="f(x)=1/x" /> 在 <Katex tex="[-1,1]" /> 上两端异号，却没有零点——中间断开了。跳过间断点会让算法收敛到一个假位置。</li>
        <li><strong>提示三：只找到一个根。</strong>区间里有几个根时，二分法收敛到哪一个取决于中点落在谁那边，结果不唯一也不完整。</li>
        <li><strong>提示四：精度不能设得比机器精度还小。</strong>区间短到与浮点数的间隔同量级时，中点算出来可能仍等于端点，循环再也走不动，此时程序要能识别并退出。</li>
      </ul>
    </div>
    <p>回收与预告：二分法每次只用符号，白白扔掉了函数值的大小信息。把这点信息用上——用切线去猜根——就是牛顿法，收敛速度从「每步减半」变成「每步平方」。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBisectLab } from '../../../boards/numeric/root/bisectlab.js';
import { NI_CHAPTERS } from './inav.js';
</script>
