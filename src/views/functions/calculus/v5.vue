<template>
  <ChPage :cur="5" no="V5" base="/functions/v" :chapters="V_CHAPTERS"
    title="参数综合：大题工作流" sub="含参数的导数大题没有新定理，只有一条规则：先分类、再画表。$f=x^3-3tx$ 一条曲线走完 $t<0$、$t=0$、$t>0$ 三档 —— 极值深度联动零点个数，参数讨论的必要性直接可见。"
    :toc="[{ id: 'v5-flow', t: '分类讨论四步走' }, { id: 'v5-zero', t: '极值深度联动零点' }, { id: 'v5-pit', t: '漏类、漏验与假对称' }]">
    <div class="note good" id="v5-law"><strong>参数大题工作流</strong>：① 求参数范围内的 f′ 并解零点 → ② 按零点个数<strong>分类</strong>（临界值单独成档）→ ③ 每档列单调表、定极值 → ④ 结论回验（端点、排除态、闭区间）。流程与 E2 动轴最值、E2 根分布同源：参数动了，就按「档」说话。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCase" />
      <div class="cap">图 V5 · <b>含参函数的分类讨论</b>：<Katex tex="f=x^3-3tx"/>，t 扫过 0 —— 两个金点相遇成红空圈（<Katex tex="t=0"/> 驻点不变号）再消失（<Katex tex="t<0"/> 全程单增）；零点计数同步显示：<Katex tex="t>0"/> 三个（含 <Katex tex="x=0"/>）、<Katex tex="t=0"/> 三重、<Katex tex="t<0"/> 只剩一个。分类讨论对应曲线形态随参数的切换。</div>
    </div>

    <h3 class="sec" id="v5-flow">分类讨论四步走</h3>
    <p>以图 V5 原图为例走全程：<Katex tex="f'=3(x^2-t)" />，零点是否存在由 t 定 —— 于是天然三档。<strong>档一 t&lt;0</strong>：<Katex tex="f'=3(x^2+|t|)>0" /> 恒成立，全程单增，无极值；<strong>档二 t=0</strong>：<Katex tex="f'=3x^2\ge 0" />，驻点 x=0 清零不变号（V3 的排除判据当班）；<strong>档三 t&gt;0</strong>：驻点 <Katex tex="x=\pm\sqrt{t}" />，极大 <Katex tex="2t^{3/2}" />、极小 <Katex tex="-2t^{3/2}" /> —— 互为相反数，因为 f 是奇函数（S3 的镜像在参数家族里原样保留）。</p>
    <p>这套「f′ 的零点个数 → 分类」的逻辑正是 E2 根分布的镜像：E2 按「根的位置」分类，这里按「根的存在性」分类。临界情形（t=0）永远单独成列 —— 它不是两侧情形的拼接，而是形态切换的瞬间，图 V5 把这一瞬间做成了可拖的演示。</p>

    <h3 class="sec" id="v5-zero">极值深度联动零点</h3>
    <p><Katex tex="t>0"/> 时零点可以直接解：<Katex tex="x(x^2-3t)=0\Rightarrow x=0,\ \pm\sqrt{3t}" />。但更有价值的是「联动」读法：f 是奇函数 <Katex tex="\Rightarrow x=0"/> 必是零点；极大 <Katex tex="2t^{3/2}>&gt;0" />、极小为负 <Katex tex="\Rightarrow"/> 右支先下穿轴再上穿轴（极小在轴下方，端点升回轴上）—— 每一段的存在性由 R2 的端点异号定理逐区间保证，不用解方程就能数出三个零点。t 缩向 0，<Katex tex="\pm\sqrt{3t}"/> 与 <Katex tex="\pm\sqrt{t}"/> 一同缩回原点并成三重零点；<Katex tex="t<0"/> 后极值消失，只剩唯一的 <Katex tex="x=0"/>。<strong>零点个数随极值深度改变而改变</strong> —— 这是「R 系列 × V 系列」联合演练的经典题型。</p>

    <h3 class="sec" id="v5-pit">漏类、漏验与假对称</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：漏掉临界情形。</strong>t&lt;0 与 t&gt;0 之间必须单列 t=0 —— 图 V5 红空圈那一帧就是漏掉它的后果；「t≠0」的笼统写法会漏掉三重零点态。</li>
        <li><strong>提示二：极值结论直接当最值用。</strong>极值是局部的（V3），闭区间题还须把端点纳入比较。</li>
        <li><strong>提示三：奇函数结论越界使用。</strong>「极大极小互为相反数」依赖奇函数结构；换成 <Katex tex="f=x^3-3tx+1" />（加常数 1，S3 讲过平移破坏奇偶），零点与极值的联动全盘重算 —— 图 G1 的平移记录在这里复发。</li>
      </ul>
    </div>
    <p>至此导数主线完结：V1 定义 → V2 法则 → V3 极值最值 → V4 恒成立 → V5 综合工作流。下一讲换一种「以直代曲」的方法：让多项式在 0 处逐阶匹配函数的各阶导数 —— 泰勒展开把切线推广成「无限次逼近」的曲线，顺便把 e 的两种表达（级数与复利极限）正式给出。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCase } from '../../../boards/functions/calculus/paramcase.js';
import { V_CHAPTERS } from './vnav.js';
</script>
