<template>
  <ChPage :cur="3" no="V3" base="/functions/v" :chapters="V_CHAPTERS"
    title="极值与最值：导数的判定" sub="驻点是极值的候选点。求闭区间上的最值还要检查两端及区间内的不可导点。"
    :toc="[{ id: 'v3-crit', t: '驻点与变号判据' }, { id: 'v3-glob', t: '闭区间最值：候选点比较' }, { id: 'v3-pit', t: '清零≠极值、不可导点' }]">
    <div class="note good" id="v3-law"><strong>极值判据</strong>：f 在 <Katex tex="x=c"/> 处取得极值，须 f 在 c 附近有定义且存在 <Katex tex="f'(c)=0"/>（或不可导），且 <Katex tex="f'"/> 在 c 两侧<strong>变号</strong>：正变负是极大、负变正是极小。<strong>闭区间最值</strong>：连续函数在 [p,q] 上必有最值（S4 的界墙定理），候选点集 = <Katex tex="\{\text{驻点}\}\cup\{p,\ q\}" /> —— 逐个比较取最大最小。</div>
    <div class="board-wrap">
      <BoardMount :factory="createExt" />
      <div class="cap">图 V3 · <b>极值与最值</b>。拖动区间端点，观察最大值和最小值由哪个点取得。切到 x³，检查导数为零而方向保持的情形。</div>
    </div>

    <h3 class="sec" id="v3-crit">驻点与变号判据</h3>
    <p>「<Katex tex="f'=0"/>」只是<strong>入围条件</strong>：极值处切线水平（费马引理），但水平切线不保证得奖。图 V3 的第二原图 <Katex tex="f=x^3" /> 是经典反例：<Katex tex="f'=3x^2\ge 0" />，在 <Katex tex="x=0"/> 清零但两侧同号 —— 曲线在这里只是「歇了口气」继续上升，驻点不是极值。<strong>判据是变号，不是清零</strong>。第三原图 <Katex tex="f=x^4-2x^2" /> 给出更丰盛的场面：三个驻点两极小夹一极大，金点把「左减右增→极小」「左增右减→极大」的读法逐个标在图上。</p>
    <p>流程收成三步：解 <Katex tex="f'=0"/> 得到驻点列表 → 相邻驻点之间看 <Katex tex="f'"/> 符号（染色的曲线直接给答案）→ 列单调表读出极大极小。S2 建立的「<Katex tex="f'"/> 符号是判据」在这里全程适用。</p>

    <h3 class="sec" id="v3-glob">闭区间最值：候选点比较</h3>
    <p>极值是<strong>局部</strong>概念（只跟邻域比），最值是<strong>全局</strong>概念（整个区间比）—— S4 的界墙机早已把「界」与「最」分开讨论。闭区间 [p,q] 上的最值只会出现在两处：内部的极值点，或端点。所以流程是：驻点在区间内的留下 + 两个端点，组成候选集合，f 值逐个比较。<strong>端点不算极值点（邻域不完整），但必进最值候选</strong> —— 图 V3 拖 q 到 2.45 时最大值从极大点移动到右端点，7.36 vs 2.00，判定直接改变。</p>
    <p>二次函数 <Katex tex="f(x)=ax^2+bx+c" /> 的导数为 <Katex tex="2ax+b" />。内部候选点只有顶点，因此图 E2 可以借助到对称轴的距离迅速比较函数值。一般函数应逐一比较内部候选与区间端点。</p>

    <h3 class="sec" id="v3-pit">清零≠极值、不可导点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="f'=0"/> 就断定极值。</strong><Katex tex="x^3" /> 在 0 清零不变号 —— 必须查两侧符号（列表、染色都要落实到点）。</li>
        <li><strong>提示二：极值点未必是驻点。</strong><Katex tex="f=|x|" /> 在 0 取最小值，但那里 <Katex tex="f'"/> 不存在（折角）—— 完整的候选点集是「驻点 ∪ 不可导点 ∪ 端点」。</li>
        <li><strong>提示三：区间外驻点混进候选。</strong>驻点落在 [p,q] 之外就不参与比较，图 V3 的围栏虚线就是范围判定线。</li>
      </ul>
    </div>
    <p>下一讲把「极值」变成工具：差函数在切点处恰好取 0、导数也取 0 —— 「恒成立」问题被翻译成「差函数的最小值 <Katex tex="\ge 0"/>」，切线成为判定的边界。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createExt } from '../../../boards/functions/calculus/extremum.js';
import { V_CHAPTERS } from './vnav.js';
</script>
