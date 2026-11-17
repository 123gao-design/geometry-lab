<template>
  <ChPage :cur="3" no="C3" base="/functions/c" :chapters="C_CHAPTERS"
    title="定义域与值域：解析式自带的限制" sub="定义域是函数的首要前提，值域是全部函数值 —— 一个由限制条件决定，一个要算不能猜。"
    :toc="[{ id: 'c3-dom', t: '定义域从哪来（图 C3）' }, { id: 'c3-ex', t: '多重限制：解不等式组' }, { id: 'c3-methods', t: '求值域的方法阶梯' }, { id: 'c3-warn', t: '反解法的易错点' }]">
    <div class="note good" id="c3-dom"><strong>定义域</strong>：使解析式有意义的自变量取值全体。无实际背景时按"自然限制条件"确定：<strong>分母不为零</strong>、<strong>偶次根号下 <Katex tex="\ge 0" /></strong>、<strong>对数真数 <Katex tex="&gt; 0" /></strong>（底数 <Katex tex="&gt; 0" /> 且 <Katex tex="\ne 1" />）；有实际背景的（重量、人数、时间）还要依题意确定。<strong>值域</strong> <span class="term">(range)</span>：全体函数值构成的集合 —— 它由定义域与法则共同决定，是全部函数值的集合。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRangeSweep" />
      <div class="cap">图 C3 · <b>求函数的值域</b>：四个预设各带一种定义域限制 —— ① 配方法型、② 根号限定下界、③ 观察法的渐近缺口、④ 分母挖点。绿色带画在 x 轴上是定义域；拖"扫描 x"（或按 ▶ 自动扫描），扫描点把 f(x) 沿虚线投影到 y 轴，刷出金色的"已取到的值"。看点：③ 的金带始终刷不到 0 —— 那个下界 0 是<strong>算出来</strong>的（分母 ≥ 1 ⟹ 0 &lt; y ≤ 1），不是扫出来的；④ 越过 x=1 时扫描点从 −∞ 侧跳到 +∞ 侧，0 恰是整个值域唯一的缺口。</div>
    </div>

    <h3 class="sec" id="c3-ex">多重限制：解不等式组</h3>
    <p>几个限制叠加时，定义域是各限制条件的<strong>交集</strong>。把图 C3 里 ② 和 ④ 的限制叠在一起就是一道经典题：<Katex tex="f(x)=\frac{\sqrt{x+2}}{x-1}" display /></p>
    <p>根号要求 <Katex tex="x+2\ge 0" />，分母要求 <Katex tex="x\ne 1" />，两个条件同时成立：</p>
    <Katex tex="D=\{x\mid x\ge -2,\ x\ne 1\}=[-2,1)\cup(1,+\infty)" display />
    <p>书写规范：结论必须落在数轴语言上（区间或集合），"<Katex tex="x\ge -2" /> 且 <Katex tex="x\ne 1" />" 这种文字停在半路，考试要扣分。挖点用小圆圈、区间端点用实心点画在数轴上，是这一节的板书纪律。</p>

    <h3 class="sec" id="c3-methods">求值域的方法阶梯</h3>
    <p>值域没有万能公式，但有一架由低到高的梯子 —— 图 C3 的四个预设各站在一级上：</p>
    <ul>
      <li><strong>观察法</strong>（预设 ③）：分母 <Katex tex="x^2+1\ge 1" /> 立刻得 <Katex tex="0&lt;y\le 1" />。结构简单的式子，先观察再推导；</li>
      <li><strong>配方法</strong>（预设 ①）：<Katex tex="x^2-2x+3=(x-1)^2+2\ge 2" />，二次式化成"平方 + 常数"，下界自己浮出来；</li>
      <li><strong>反解法</strong>（预设 ④）：把 x 解成 y 的函数，定义域换成值域：<Katex tex="y=\frac{1}{x-1}\ \Rightarrow\ x=1+\frac{1}{y}\ \Rightarrow\ y\ne 0" /> —— 新函数的"定义域限制"就是原函数的值域缺口；</li>
      <li><strong>单调性 / 图象法</strong>：复杂函数先分段判断升降，最高点与最低点定值域 —— 这件装备在 S1 单调性里发，配 S2 的导数判据后连二次以下的判断都可以交给机器。</li>
    </ul>

    <h3 class="sec" id="c3-warn">反解法的易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：反解 x 只在「一一对应」时可靠。</strong>比如 <Katex tex="y=x^2" /> 反解得 <Katex tex="x=\pm\sqrt{y}" /> —— 一个 y 配了两个 x，x 已经不是 y 的函数了。正确做法：先按单调性分区间（<Katex tex="x\ge 0" /> 与 <Katex tex="x&lt;0" />），各自反解，最后把两段值域<strong>取并集</strong>。</li>
        <li><strong>提示二：值域不是「图上看到的 y」。</strong>图 C3 的扫描带只在屏幕范围内刷色，真正限制上下界的取不到的端点、无穷缺口，都要靠上面那架梯子算出来。</li>
      </ul>
    </div>
    <p>回收与预告：C2 判"同一函数"时定义域起一半作用，本页给出了完整的检验清单；E7 的对勾函数 <Katex tex="y=ax+\frac{b}{x}" /> 值域要用"分段单调"才能算干净，正是反解法易错点的升级版；R2 的零点存在性定理将反复使用"值域端点"的语言 —— 一个函数若在 [a, b] 上值域盖住 0 两侧，中间必有零点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRangeSweep } from '../../../boards/functions/concept/rangesweep.js';
import { C_CHAPTERS } from './cnav.js';
</script>
