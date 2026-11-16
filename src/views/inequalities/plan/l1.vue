<template>
  <ChPage :cur="1" no="线1" base="/inequalities/l" :chapters="L_CHAPTERS"
    title="二元一次不等式与平面区域"
    sub="数轴上，一元不等式把一个区间挑出来；平面上，二元一次不等式把直线一侧的半个平面挑出来。代一个点读出符号，整个半平面的符号随之确定；几条半平面相交，得到的就是线性规划的可行域。"
    :toc="[{ id: 'l1-half', t: '半平面：代点定号' }, { id: 'l1-group', t: '不等式组：区域的交' }, { id: 'l1-convex', t: '可行域为什么是凸的' }, { id: 'l1-vertex', t: '顶点：下一步要用的结论' }, { id: 'l1-pit', t: '边界、开闭与空区域' }]">
    <div class="note good" id="l1-law">在平面上，<Katex tex="Ax+By+C=0" />（<Katex tex="A,B" /> 不同时为 <Katex tex="0" />）是一条直线。它把平面分成两个半平面，在同一个半平面内 <Katex tex="Ax+By+C" /> 的符号处处相同。因此不等式 <Katex tex="Ax+By+C>0" /> 表示其中一个半平面，判定时只需在该侧任取一点代入看符号——习惯上取原点，<Katex tex="C" /> 的符号即答案。</div>
    <div class="board-wrap">
      <BoardMount :factory="createHP" />
      <div class="cap">图 线1 · <b>半平面与可行域机</b>：模式一里拖动 P 点跨越金色边界线，读数 <Katex tex="f=Ax+By+C" /> 的符号当场翻转，蓝区始终是 <Katex tex="f\ge0" /> 的一侧（换边可改为 <Katex tex="f\le0" />）；模式二把四条约束逐条开关，绿色可行域被一条条边界线切小。看点：同侧的点代入同号，跨过边界才变号。</div>
    </div>

    <h3 class="sec" id="l1-half">半平面：代点定号</h3>
    <p>设 <Katex tex="f(x,y)=Ax+By+C" />。它是线性的：把点沿固定方向移动，<Katex tex="f" /> 的值按固定比例变化；沿垂直于直线 <Katex tex="f=0" /> 的方向走，<Katex tex="f" /> 严格单调。因此直线的一侧 <Katex tex="f>0" />，另一侧 <Katex tex="f<0" />，边界上 <Katex tex="f=0" />——平面上不会出现「同一侧符号不同」的情形。图 线1 模式一里，P 点在蓝区时读数为正，拖到金的另一侧读数立即为负。</p>
    <p>判定流程只有一步：在目标一侧任取一点（原点最省事），代入 <Katex tex="f" />。若 <Katex tex="C>0" />，则原点在 <Katex tex="f>0" /> 一侧；若 <Katex tex="C<0" />，原点在 <Katex tex="f<0" /> 一侧；若 <Katex tex="C=0" />，直线过原点，需另取一点（如 <Katex tex="(1,0)" />）。代入值与判定式同号，点就在该侧；异号就在另一侧。</p>

    <h3 class="sec" id="l1-group">不等式组：区域的交</h3>
    <p>几个二元一次不等式同时成立，就是各自半平面的交集。图 线1 模式二用四条约束围出可行域：<Katex tex="x\ge0" /> 与 <Katex tex="y\ge0" /> 先限定第一象限，<Katex tex="x+y\le4" /> 斜切一次，<Katex tex="x+2y\le k" /> 再切一次。每增加一条约束，区域只会变小，不会变大——交集对「加条件」是单调的。拖动 <Katex tex="k" /> 可以看第四条约束的位置变化：<Katex tex="k" /> 越小，斜线越靠近原点，可行域被压得越扁。</p>
    <p>与数轴上的情形对照：一元二次不等式的解集是数轴上的区间（或区间之并），二元一次不等式组的解集是平面上的多边形区域。数轴上的「区间端点」在这里变成「多边形顶点」，数轴上的「开闭端点」变成「边界直线是否含在区域内」。</p>

    <h3 class="sec" id="l1-convex">可行域为什么是凸的</h3>
    <p>一个半平面是凸集：若两点都在 <Katex tex="f\ge0" /> 一侧，则它们连线上的每一点都不越界，因为 <Katex tex="f" /> 在线段上的取值介于两端取值之间，两端都非负，中间也非负。凸集的交集仍是凸集，所以任意多个半平面的交集——可行域——必定是凸多边形（可能退化为空集、一条线段或整个平面）。这条性质是线2 顶点法的依据：凸多边形上的线性函数，最大值一定能在顶点取到。</p>

    <h3 class="sec" id="l1-vertex">顶点：下一步要用的结论</h3>
    <p>可行域的顶点是两条边界直线的交点。把它代入目标函数 <Katex tex="z=ax+by" />，得到一组可比较的数。线2 会证明：线性目标在凸多边形可行域上的最值必在顶点取得（当等值线与某条边平行时，整条边上的点同取最值）。所以求线性规划问题不必扫描整个区域，只枚举有限个顶点即可——这正是「线性」带来的简化。</p>

    <h3 class="sec" id="l1-pit">边界、开闭与空区域</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>边界线的两种画法。</strong>含等号（<Katex tex="\ge,\le" />）时边界线画实线，边界属于区域；不含等号（<Katex tex=">,<" />）时画虚线，边界只作分界、不属于区域。题目写 <Katex tex="x+y<4" /> 时，<Katex tex="x+y=4" /> 上的点不满足，不能算进可行域。</p>
          <p><strong>系数不能同时为零。</strong><Katex tex="A=B=0" /> 时 <Katex tex="f=C" /> 是常数，不表示半平面：<Katex tex="C\ge0" /> 时整个平面都满足，<Katex tex="C<0" /> 时无解。</p>
          <p><strong>区域可能为空。</strong>例如 <Katex tex="x\ge1" /> 与 <Katex tex="x\le0" /> 同时出现，交集为空，线性规划问题无解。建模后先检查可行域是否非空，再谈最值。</p>
    </div>
    <p>半平面是「数轴区间」在平面上的推广；把半平面叠成可行域，就得到线性规划的讨论范围。下一章线2 在这个可行域上移动目标函数的等值线，读出最大值与最优解的位置。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHP } from '../../../boards/inequalities/plan/regionlab.js';
import { L_CHAPTERS } from './lnav.js';
</script>
