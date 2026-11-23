<template>
  <ChPage :cur="1" no="S1" base="/functions/s" :chapters="S_CHAPTERS"
    title="单调性：增减的规则" sub="严格单调性比较的是同一区间内任意两个有序输入的函数值。"
    :toc="[{ id: 's1-def', t: '定义（图 S1）' }, { id: 's1-proof', t: '作差法证明模板' }, { id: 's1-warn', t: '三处易错' }]">
    <div class="note good" id="s1-def"><strong>严格单调递增</strong>：若区间 <Katex tex="I\subseteq D" /> 中任意两个点 <Katex tex="x_1&lt;x_2" /> 都满足 <Katex tex="f(x_1)&lt;f(x_2)" />，则 f 在 I 上严格递增。若函数值的不等号反向，则严格递减。</div>
    <div class="board-wrap">
      <BoardMount :factory="createMonoRead" />
      <div class="cap">图 S1 · <b>单调性的定义</b>。在同一段内拖动两点，再把点放到 1/x 的两支上，对比哪一组能用于判断区间单调性。</div>
    </div>

    <h3 class="sec" id="s1-proof">作差法证明模板</h3>
    <p>证明单调性有一套固定的四步拳：① <strong>任取</strong> <Katex tex="x_1<x_2" />（写明落在区间内）；② <strong>作差</strong> <Katex tex="f(x_1)-f(x_2)" />；③ <strong>变形定号</strong>（因式分解 / 通分 / 配方，目标是差的正负一目了然）；④ <strong>下结论</strong>（回扣定义）。以 <Katex tex="f(x)=\tfrac{1}{x}" /> 在 <Katex tex="(0,+\infty)" /> 上递减为例：</p>
    <Katex tex="f(x_1)-f(x_2)=\frac{1}{x_1}-\frac{1}{x_2}=\frac{x_2-x_1}{x_1x_2}" display />
    <p>由 <Katex tex="0&lt;x_1&lt;x_2" /> 得 <Katex tex="x_2-x_1&gt;0" /> 且 <Katex tex="x_1x_2&gt;0" />，故差恒正，即 <Katex tex="f(x_1)&gt;f(x_2)" /> —— 按定义，递减。再如 <Katex tex="f(x)=x^2" /> 在 <Katex tex="[0,+\infty)" /> 上递增：</p>
    <Katex tex="f(x_1)-f(x_2)=x_1^2-x_2^2=(x_1+x_2)(x_1-x_2)&lt;0" display />
    <p>第三步是全套动作的灵魂：<strong>把差变形到"每个因子的符号都已知"为止</strong>。变形到一半就下结论，是过程分流失最多的地方。</p>

    <h3 class="sec" id="s1-warn">三处易错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：抽查当证明。</strong>图 S1 的徽章永远只说"这对样本支持"——找到一对满足不等式的点，离"任意点都满足"还差一个作差法。</li>
        <li><strong>提示二：单调区间乱并。</strong><Katex tex="x^2" /> 在 (−∞,0) 与 (0,+∞)（更准确写法含端点）上各是减、增，但写成并集 <Katex tex="(-\infty,0)\cup(0,+\infty)" /> 再说"减"就错了 —— 取 <Katex tex="x_1=-1" />、<Katex tex="x_2=1" /> 立刻反例。区间之间隔着"谷"（或缺口），打包必错；单调区间用"和/逗号"分开写，不用 <Katex tex="\cup" />。</li>
        <li><strong>提示三：跨缺口比较。</strong><Katex tex="1/x" /> 在两支上各自递减，但 <Katex tex="x_1=-1" />、<Katex tex="x_2=1" /> 时 <Katex tex="f(x_1)<f(x_2)" /> 看起来"增" —— 因为区间 (−1,1) 根本不在定义域里。单调性的"区间 I"必须整体含在定义域内，这是定义的第一道锁。</li>
      </ul>
    </div>
    <p>回收与预告：C3 的定义域限制在这里是第一道检验；E7 对勾函数 <Katex tex="ax+\frac{b}{x}" /> 的单调区间要在两段上分别作差（均值不等式与导数双证）；下一讲 S2 把这套"任取两点"的直接验证交给导数 —— 弦斜率的极限会替我们把每一点的方向都读出来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMonoRead } from '../../../boards/functions/properties/monoread.js';
import { S_CHAPTERS } from './snav.js';
</script>
