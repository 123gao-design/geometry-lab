<template>
  <ChPage :cur="3" no="C3" base="/functions/c" :chapters="C_CHAPTERS"
    title="定义域与值域：解析式自带的限制" sub="定义域是允许的输入集合，值域是函数实际能取到的全部输出。"
    :toc="[{ id: 'c3-dom', t: '定义域从哪来（图 C3）' }, { id: 'c3-ex', t: '多重限制：解不等式组' }, { id: 'c3-methods', t: '求值域的方法阶梯' }, { id: 'c3-warn', t: '反解法的易错点' }]">
    <div class="note good" id="c3-dom"><strong>定义域</strong>：使解析式有意义的自变量取值全体。无实际背景时按「自然限制条件」确定：<strong>分母不为零</strong>、<strong>偶次根号下 <Katex tex="\ge 0" /></strong>、<strong>对数真数 <Katex tex="&gt; 0" /></strong>（底数 <Katex tex="&gt; 0" /> 且 <Katex tex="\ne 1" />）；有实际背景的（重量、人数、时间）还要依题意确定。<strong>值域</strong> <span class="term">(range)</span>：全体函数值构成的集合 —— 它由定义域与法则共同决定，是全部函数值的集合。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRangeSweep" />
      <div class="cap">图 C3 · <b>求函数的值域</b>。移动扫描点，观察函数值向纵轴投影。切换到有理函数，核对纵轴上取不到的 0。</div>
    </div>

    <h3 class="sec" id="c3-ex">多重限制：解不等式组</h3>
    <p>几个限制叠加时，定义域是各限制条件的<strong>交集</strong>。把图 C3 里 ② 和 ④ 的限制叠在一起就是一道经典题：<Katex tex="f(x)=\frac{\sqrt{x+2}}{x-1}" display /></p>
    <p>根号要求 <Katex tex="x+2\ge 0" />，分母要求 <Katex tex="x\ne 1" />，两个条件同时成立：</p>
    <Katex tex="D=\{x\mid x\ge -2,\ x\ne 1\}=[-2,1)\cup(1,+\infty)" display />
    <p>书写规范：结论必须落在数轴语言上（区间或集合），「<Katex tex="x\ge -2" /> 且 <Katex tex="x\ne 1" />」这种文字停在半路，考试要扣分。挖点用小圆圈、区间端点用实心点画在数轴上，是这一节的板书纪律。</p>

    <h3 class="sec" id="c3-methods">求值域的方法阶梯</h3>
    <p>值域没有万能公式，但有一架由低到高的梯子 —— 图 C3 的四个预设各站在一级上：</p>
    <ul>
      <li><strong>观察法</strong>（预设 ③）：分母 <Katex tex="x^2+1\ge 1" /> 立刻得 <Katex tex="0&lt;y\le 1" />。结构简单的式子，先观察再推导；</li>
      <li><strong>配方法</strong>（预设 ①）：<Katex tex="x^2-2x+3=(x-1)^2+2\ge 2" />，二次式化成「平方 + 常数」，下界直接读出；</li>
      <li><strong>反解法</strong>（预设 ④）：把 <Katex tex="x" /> 解成 <Katex tex="y" /> 的函数，定义域换成值域：<Katex tex="y=\frac{1}{x-1}\ \Rightarrow\ x=1+\frac{1}{y}\ \Rightarrow\ y\ne 0" /> —— 新函数的定义域限制就是原函数的值域缺口；</li>
      <li><strong>单调性 / 图象法</strong>：复杂函数先分段判断升降，最高点与最低点定值域 —— 这条方法在<RouterLink class="xref" to="/functions/s1">单调性：增减的规则</RouterLink>里给出，配上<RouterLink class="xref" to="/functions/s2">单调性与导数</RouterLink>的导数判据后，大部分判断都可以交给导数。</li>
    </ul>

    <h3 class="sec" id="c3-warn">反解法的易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：反解时保留所有符合定义域的解。</strong>给定 y，只需判断是否至少存在一个允许的输入 x。例如 <Katex tex="x^2=y" /> 对任意 <Katex tex="y\ge0" /> 都有解，因此值域为 <Katex tex="[0,+\infty)" />。</li>
        <li><strong>提示二：值域不是「图上看到的 y」。</strong>图 C3 的扫描带只在屏幕范围内刷色，真正限制上下界的取不到的端点、无穷缺口，都要靠上面那架梯子算出来。</li>
      </ul>
    </div>
    <p>回顾与预告：<RouterLink class="xref" to="/functions/c2">三要素与同一函数</RouterLink>判「同一函数」时定义域起一半作用，本页给出了完整的检验清单；<RouterLink class="xref" to="/functions/e7">对勾函数：一形两证</RouterLink>里的 <Katex tex="y=ax+\frac{b}{x}" /> 值域要用「分段单调」才能算干净，正是反解法易错点的升级版；零点与存在性定理一组将反复使用「值域端点」的语言 —— 一个函数若在 <Katex tex="[a,\ b]" /> 上值域盖住 <Katex tex="0" /> 两侧，中间必有零点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRangeSweep } from '../../../boards/functions/concept/rangesweep.js';
import { C_CHAPTERS } from './cnav.js';
</script>
