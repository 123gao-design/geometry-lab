<template>
  <ChPage :cur="2" no="用2" base="/sequences/u" :chapters="UQ_CHAPTERS"
    title="数列与函数、不等式的综合"
    sub="数列是定义在正整数集上的函数，单调性、最值都能用函数的方法处理：作差看符号，作比与 1 比较，比值的穿越处就是最大项。求 Sₙ 的最值则要看各项何时由正变负。"
    :toc="[{ id: 'u2-func', t: '数列是函数' }, { id: 'u2-mono', t: '作差与作比' }, { id: 'u2-max', t: '最大项与 Sₙ 最值' }, { id: 'u2-pit', t: '正项、并列与下标' }]">
    <div class="note good">数列 <Katex tex="a_n=f(n)" /> 的单调性：<Katex tex="a_{n+1}-a_n>0" /> 时递增，<Katex tex="<0" /> 时递减。各项为正时也可作比：<Katex tex="\dfrac{a_{n+1}}{a_n}>1" /> 递增，<Katex tex="<1" /> 递减。比值由大于 1 变为小于 1 的位置，就是最大项所在。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSeqIneq" />
      <div class="cap">图 用2 · <b>数列最值机</b>：上栏是 <Katex tex="a_n=\dfrac{n^2}{c^{\,n}}" /> 的各项，金色柱是最大项；下栏是相邻项之比，绿点高于 <Katex tex="y=1" />、红点低于它。比值穿过 1 的位置与最大项的位置一一对应。拖动 c，看最大项向左或向右移动。</div>
    </div>

    <h3 class="sec" id="u2-func">数列是函数</h3>
    <p>数列的通项 <Katex tex="a_n=f(n)" /> 把正整数映到实数，所以数1 说它是「定义在正整数集上的函数」。函数那一套工具——单调性、最值、图象——都能搬过来，只是定义域从区间换成了孤立的整数点。</p>
    <p>函数的单调性可以借来用，但要留意条件：若 <Katex tex="f(x)" /> 在 <Katex tex="[1,+\infty)" /> 上单调递增，则 <Katex tex="\{a_n\}" /> 单调递增；反过来，<Katex tex="\{a_n\}" /> 递增不能推出 <Katex tex="f(x)" /> 在区间上递增。连续函数只是数列的一个「插值版本」，用导数判断数列单调性时，得到的是充分条件。</p>
    <p>图 用2 的上栏就是这样的孤立点图：横坐标取整数，柱子高度是 <Katex tex="a_n" />。它看起来像一条先升后降的曲线，但只有整数位置上有值。最大项落在哪一根柱子上，是离散的问题，不能用「求导得极值点」直接回答，还要比较相邻两项。</p>

    <h3 class="sec" id="u2-mono">作差与作比</h3>
    <p><strong>作差。</strong>计算 <Katex tex="a_{n+1}-a_n" />，判断符号。若差是 <Katex tex="n" /> 的一次或二次式，符号容易读；若是分式，先通分再判分子。</p>
    <p><strong>作比。</strong>各项为正时，计算 <Katex tex="\dfrac{a_{n+1}}{a_n}" /> 并与 1 比较。比值中常出现 <Katex tex="\dfrac{n+1}{n}" /> 这类因子，与 1 比较时约去公因子，剩下的部分往往只含 <Katex tex="n" /> 的一次式。</p>
    <p>以 <Katex tex="a_n=\dfrac{n^2}{2^n}" /> 为例，作比得</p>
    <p style="text-align:center"><Katex tex="\dfrac{a_{n+1}}{a_n}=\dfrac{(n+1)^2}{2n^2}" display /></p>
    <p>它大于 1 等价于 <Katex tex="(n+1)^2>2n^2" />，即 <Katex tex="n^2-2n-1<0" />，解得 <Katex tex="n<1+\sqrt2\approx2.41" />。所以 <Katex tex="n=1,2" /> 时递增（<Katex tex="a_1<a_2<a_3" />），<Katex tex="n\ge3" /> 时递减，最大项是 <Katex tex="a_3=\dfrac98" />。图 用2 的下栏把每个比值画成点，绿点段增、红点段减，分界正落在 <Katex tex="y=1" /> 上。</p>
    <p>图 用2 的底数 <Katex tex="c" /> 换成 3 时，阈值变成 <Katex tex="\dfrac{1}{\sqrt3-1}\approx1.37" />，只有 <Katex tex="n=1" /> 处递增，最大项左移到 <Katex tex="a_2" />。阈值随 <Katex tex="c" /> 增大而左移，这正是滑块的作用。</p>

    <h3 class="sec" id="u2-max">最大项与 Sₙ 最值</h3>
    <p>最大项由相邻两项的比较确定：若 <Katex tex="a_1\le a_2\le\dots\le a_m" /> 且 <Katex tex="a_m\ge a_{m+1}\ge\dots" />，则 <Katex tex="a_m" /> 是最大项。用比值法时，就是找比值由大于 1 变为小于 1 的位置；若某一对比值恰等于 1，则两项并列最大。</p>
    <p><Katex tex="S_n" /> 的最值是另一件事。<Katex tex="S_n-S_{n-1}=a_n" />，所以 <Katex tex="S_n" /> 的增减由 <Katex tex="a_n" /> 的符号决定：<Katex tex="a_n>0" /> 时 <Katex tex="S_n" /> 增大，<Katex tex="a_n<0" /> 时减小。于是 <Katex tex="S_n" /> 在「各项由正转负」的位置取得最大值，在「由负转正」的位置取得最小值。</p>
    <p>例如 <Katex tex="a_n=9,6,3,0,-3,\dots" />（<Katex tex="a_n=12-3n" />）：<Katex tex="S_1=9" />，<Katex tex="S_2=15" />，<Katex tex="S_3=18" />，<Katex tex="S_4=18" />，此后逐项减小。最大值是 <Katex tex="18" />，在 <Katex tex="n=3" /> 与 <Katex tex="n=4" /> 两处取得——<Katex tex="a_4=0" /> 不改变和，所以相邻两个 <Katex tex="S_n" /> 并列。若只写一个 <Katex tex="n" />，会漏掉另一个。</p>
    <p>与不等式的综合通常有两类。其一是比较：证明 <Katex tex="a_n<b_n" />，作差或作比后化为熟悉的不等式。其二是估计：用放缩把 <Katex tex="S_n" /> 夹在两个可求和的数列之间（放1..放3）。涉及「对一切正整数成立」的命题，则常用数学归纳法（归2）。</p>

    <h3 class="sec" id="u2-pit">正项、并列与下标</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：作比要求各项为正。</strong>若数列含零或负项，比值与 1 的大小不能直接翻译成增减（负项时不等号方向反转）。含负项时改用作差，或先取绝对值再分别讨论。</li>
        <li><strong>提示二：最大项可能并列。</strong>比值等于 1 时相邻两项相等，最大值在两处同时取得。<Katex tex="S_n" /> 的极值也可能在两处并列（中间那项为零时）。答题时把两个下标都写出来。</li>
        <li><strong>提示三：增区间要按整数写。</strong>解出 <Katex tex="n<2.41" /> 后，应写「<Katex tex="n=1,2" /> 时递增」，而不是「<Katex tex="n<2.41" /> 时递增」。数列只在整数处有定义。</li>
        <li><strong>提示四：<Katex tex="a_n" /> 的最大项不等于 <Katex tex="S_n" /> 的最大值。</strong>求 <Katex tex="S_n" /> 的最值要看 <Katex tex="a_n" /> 的符号变化，不是看 <Katex tex="a_n" /> 本身的大小。两件事的下标一般不同。</li>
        <li><strong>提示五：连续化的单调性只是充分条件。</strong>把 <Katex tex="a_n" /> 写成 <Katex tex="f(n)" /> 后用导数判断，若 <Katex tex="f'(x)" /> 在区间上恒正，可以下结论；若导数变号，只能说明函数不单调，数列仍可能在整数点上单调，须回到作差作比逐个比较。</li>
      </ul>
    </div>
    <p>回收与预告：本节把 数1 的「数列是函数」、等1 与 比1 的单调性、和3 的 <Katex tex="S_n" /> 讨论合成一个整体。数列模块到此完结，七个子专题覆盖了概念、等差、等比、求和、递推、归纳与应用。下一步可进入 向量与复数 模块。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSeqIneq } from '../../../boards/sequences/apply/seqineq.js';
import { UQ_CHAPTERS } from './unav.js';
</script>
