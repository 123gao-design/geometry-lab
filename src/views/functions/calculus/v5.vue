<template>
  <ChPage :cur="5" no="V5" base="/functions/v" :chapters="V_CHAPTERS"
    title="参数综合：大题工作流" sub="参数越过临界值时，驻点数目和零点数目可能改变。"
    :toc="[{ id: 'v5-flow', t: '分类讨论四步走' }, { id: 'v5-zero', t: '极值深度联动零点' }, { id: 'v5-pit', t: '漏类、漏验与假对称' }]">
    <div class="note good" id="v5-law"><strong>参数大题工作流</strong>：① 求参数范围内的 f′ 并解零点 → ② 按零点个数<strong>分类</strong>（临界值单独成档）→ ③ 每档列单调表、定极值 → ④ 结论回验（端点、排除态、闭区间）。流程与 E2 动轴最值、E2 根分布同源：参数动了，就按「档」说话。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCase" />
      <div class="cap">图 V5 · <b>含参函数的分类讨论</b>。将 t 从负值拖到正值，观察 x³−3tx 的两个极值点何时出现。t=0 时原点是三重根。</div>
    </div>

    <h3 class="sec" id="v5-flow">分类讨论四步走</h3>
    <p>以图 V5 原图为例走全程：<Katex tex="f'=3(x^2-t)" />，驻点数目由 t 决定 —— 于是天然三档。<strong>档一 t&lt;0</strong>：<Katex tex="f'=3(x^2+|t|)>0" /> 恒成立，全程单增，无极值；<strong>档二 t=0</strong>：<Katex tex="f'=3x^2\ge 0" />，驻点 x=0 清零不变号（V3 的排除判据当班）；<strong>档三 t&gt;0</strong>：驻点 <Katex tex="x=\pm\sqrt{t}" />，极大 <Katex tex="2t^{3/2}" />、极小 <Katex tex="-2t^{3/2}" /> —— 互为相反数，因为 f 是奇函数（S3 的镜像在参数家族里原样保留）。</p>
    <p>这套「f′ 的零点个数 → 分类」的逻辑正是 E2 根分布的镜像：E2 按「根的位置」分类，这里按「根的存在性」分类。临界情形（t=0）永远单独成列 —— 它不是两侧情形的拼接，而是形态切换的瞬间，图 V5 把这一瞬间做成了可拖的演示。</p>

    <h3 class="sec" id="v5-zero">极值深度联动零点</h3>
    <p><Katex tex="t>0"/> 时零点可以直接解：<Katex tex="x(x^2-3t)=0\Rightarrow x=0,\ \pm\sqrt{3t}" />。但更有价值的是「联动」读法：f 是奇函数 <Katex tex="\Rightarrow x=0"/> 必是零点；极大 <Katex tex="2t^{3/2}>&gt;0" />、极小为负 <Katex tex="\Rightarrow"/> 曲线从原点向右先降至极小值，再增大并穿过横轴—— 每一段的存在性由 R2 的端点异号定理逐区间保证，不用解方程就能数出三个零点。t 缩向 0，<Katex tex="\pm\sqrt{3t}"/> 与 <Katex tex="\pm\sqrt{t}"/> 一同缩回原点并成三重零点；<Katex tex="t<0"/> 后极值消失，只剩唯一的 <Katex tex="x=0"/>。<strong>零点个数随极值深度改变而改变</strong> —— 这是「R 系列 × V 系列」联合演练的经典题型。</p>

    <h3 class="sec" id="v5-pit">漏类、漏验与假对称</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：单独检查临界值。</strong>把滑块移到 <Katex tex="t=0" />，三个零点合并到原点。此时 <Katex tex="f(x)=x^3" /> 在原点有水平切线，并穿过横轴。</li>
        <li><strong>提示二：极值结论直接当最值用。</strong>极值是局部的（V3），闭区间题还须把端点纳入比较。</li>
        <li><strong>提示三：奇函数结论越界使用。</strong>「极大极小互为相反数」依赖奇函数结构；换成 <Katex tex="f=x^3-3tx+1" />（加常数 1，S3 讲过平移破坏奇偶），零点与极值的联动全盘重算 —— 图 G1 的平移记录在这里复发。</li>
      </ul>
    </div>
    <p>这个例子把导数、极值和零点联系起来。参数越过临界值时，应当单独核对等号情形。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCase } from '../../../boards/functions/calculus/paramcase.js';
import { V_CHAPTERS } from './vnav.js';
</script>

<style src="../properties/preset-row.css"></style>
