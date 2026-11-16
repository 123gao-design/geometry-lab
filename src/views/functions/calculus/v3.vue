<template>
  <ChPage :cur="3" no="V3" base="/functions/v" :chapters="V_CHAPTERS"
    title="极值与最值：导数的判定" sub="$f'=0$ 找驻点、两侧变号定极值、闭区间把端点并入候选集合 —— E2 的「距轴远者」是这套流程在二次函数上的特例，现在推广成一般判定法。"
    :toc="[{ id: 'v3-crit', t: '驻点与变号判据' }, { id: 'v3-glob', t: '闭区间最值：候选点比较' }, { id: 'v3-pit', t: '清零≠极值、不可导点' }]">
    <div class="note good" id="v3-law"><strong>极值判据</strong>：f 在 <Katex tex="x=c"/> 处取得极值，须 f 在 c 附近有定义且存在 <Katex tex="f'(c)=0"/>（或不可导），且 <Katex tex="f'"/> 在 c 两侧<strong>变号</strong>：正变负是极大、负变正是极小。<strong>闭区间最值</strong>：连续函数在 [p,q] 上必有最值（S4 的界墙定理），候选点集 = <Katex tex="\{\text{驻点}\}\cup\{p,\ q\}" /> —— 逐个比较取最大最小。</div>
    <div class="board-wrap">
      <BoardMount :factory="createExt" />
      <div class="cap">图 V3 · <b>极值最值判定机</b>：曲线按 f′ 符号染色，驻点金点出极值、红空圈排除「清零不变号」的假情形；拖区间端点 p、q，看候选点（极值点+端点）怎么比较 —— 端点出界时最值直接改变。</div>
    </div>

    <h3 class="sec" id="v3-crit">驻点与变号判据</h3>
    <p>「<Katex tex="f'=0"/>」只是<strong>入围条件</strong>：极值处切线水平（费马引理），但水平切线不保证得奖。图 V3 的第二原图 <Katex tex="f=x^3" /> 是经典反例：<Katex tex="f'=3x^2\ge 0" />，在 <Katex tex="x=0"/> 清零但两侧同号 —— 曲线在这里只是「歇了口气」继续上升，驻点不是极值。<strong>判据是变号，不是清零</strong>。第三原图 <Katex tex="f=x^4-2x^2" /> 给出更丰盛的场面：三个驻点两极小夹一极大，金点把「左减右增→极小」「左增右减→极大」的读法逐个标在图上。</p>
    <p>流程收成三步：解 <Katex tex="f'=0"/> 得到驻点列表 → 相邻驻点之间看 <Katex tex="f'"/> 符号（染色的曲线直接给答案）→ 列单调表读出极大极小。S2 建立的「<Katex tex="f'"/> 符号是判据」在这里全程适用。</p>

    <h3 class="sec" id="v3-glob">闭区间最值：候选点比较</h3>
    <p>极值是<strong>局部</strong>概念（只跟邻域比），最值是<strong>全局</strong>概念（整个区间比）—— S4 的界墙机早已把「界」与「最」分开讨论。闭区间 [p,q] 上的最值只会出现在两处：内部的极值点，或端点。所以流程是：驻点在区间内的留下 + 两个端点，组成候选集合，f 值逐个比较。<strong>端点不算极值点（邻域不完整），但必进最值候选</strong> —— 图 V3 拖 q 到 2.45 时最大值从极大点移动到右端点，7.36 vs 2.00，判定直接改变。</p>
    <p>回顾 E2：二次函数区间最值机的「轴在区间内时顶点定一端最值，不在时近端点取最值，另一端由距轴较远者决定」正是这套一般流程的二次特例 —— 那时 <Katex tex="f'=2ax-b"/> 是一次式，驻点只有一个，才有「距轴远者」这样的快速判定。一般函数没有速断，只有候选点逐一比较。</p>

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
