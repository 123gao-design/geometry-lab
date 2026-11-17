<template>
  <ChPage :cur="2" no="线2" base="/inequalities/l" :chapters="L_CHAPTERS"
    title="简单线性规划：可行域与最优解"
    sub="约束围出可行域，目标函数写成一族平行线。把等值线沿法向平移，最后离开可行域的位置就是最优解：凸多边形的性质保证它落在某个顶点上，或与某条边整段重合。"
    :toc="[{ id: 'l2-model', t: '模型：约束与目标' }, { id: 'l2-level', t: '等值线：平行移动' }, { id: 'l2-vertex', t: '为什么最优解在顶点' }, { id: 'l2-int', t: '整数解：顶点之外的答案' }, { id: 'l2-pit', t: '斜率、无解与取整' }]">
    <div class="note good" id="l2-law">在线性规划问题中，约束都是二元一次不等式（组），可行域是凸多边形；目标函数 <Katex tex="z=ax+by" /> 是线性的。若可行域非空且有界，则 <Katex tex="z" /> 的最大值与最小值一定在可行域的顶点取得；当目标等值线与某条边界平行时，该边上的所有点同取最值，最优解不唯一。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLP" />
      <div class="cap">图 线2 · <b>线性规划的最优解</b>：可行域由 <Katex tex="x\ge0,\ y\ge0,\ x+y\le4,\ x+2y\le7" /> 围成，四个顶点标金点；四个预设切换目标函数 <Katex tex="z=ax+by" />，金色虚线是当前等值线 <Katex tex="z" />，绿色实线是最优等值线。右栏逐个列出顶点与目标值。看点：拖动 z 看等值线平移到触顶那一刻；切到整数解，看最优整点是否恰好是顶点。</div>
    </div>

    <h3 class="sec" id="l2-model">模型：约束与目标</h3>
    <p>线性规划问题由两部分组成。第一部分是约束条件：每个约束是一条二元一次不等式，把平面切出一个半平面，全部约束的交集就是可行域——一个凸多边形。第二部分是目标函数 <Katex tex="z=ax+by" />，它是线性的，要在这个可行域上求最大值或最小值。</p>
    <p>建模时先设变量并写清单位（生产两种产品各多少件、用两种原料各多少吨），再逐条列约束（原料总量、工时上限、非负要求），最后写出目标函数（总利润、总成本）。图 线2 的可行域对应四条约束，四个顶点分别是 <Katex tex="A(0,0)" />、<Katex tex="B(4,0)" />、<Katex tex="C(1,3)" />、<Katex tex="D(0,3.5)" />。</p>

    <h3 class="sec" id="l2-level">等值线：平行移动</h3>
    <p>令 <Katex tex="z" /> 取定值，方程 <Katex tex="ax+by=z" /> 是一条直线；<Katex tex="z" /> 取不同值，得到一族互相平行的直线，斜率都是 <Katex tex="-a/b" />（<Katex tex="b\neq0" />），法向是 <Katex tex="(a,b)" />。<Katex tex="z" /> 增大，等值线沿法向 <Katex tex="(a,b)" /> 平移。于是「求 <Katex tex="z" /> 的最大值」等价于「把这条平行线朝法向推到最远，同时还要碰到可行域」。</p>
    <p>图 线2 里拖动 z 滑块，金色虚线扫过可行域；绿色实线是恰好贴住最优位置的等值线。目标函数换成 <Katex tex="z=2x+y" /> 或 <Katex tex="z=x+3y" />，等值线斜率随之改变，最优位置也从一个顶点跳到另一个顶点——这就是「最优解随目标斜率转移」。</p>

    <h3 class="sec" id="l2-vertex">为什么最优解在顶点</h3>
    <p>凸多边形内的任一点都可以写成顶点的凸组合：设顶点为 <Katex tex="P_1,\dots,P_n" />，则 <Katex tex="P=\lambda_1P_1+\dots+\lambda_nP_n" />，其中 <Katex tex="\lambda_i\ge0" /> 且 <Katex tex="\sum\lambda_i=1" />。目标函数是线性的，代入得
      <Katex tex="z(P)=\lambda_1z(P_1)+\dots+\lambda_nz(P_n)" />。
      右边是各顶点目标值的加权平均，不可能超过其中的最大值。所以只要比较全部顶点的 <Katex tex="z" /> 值，就能找到最优解；当且仅当最优值在若干顶点上相同时，这些顶点连线上的点同取最优——等值线与那条边平行，最优解不唯一。</p>
    <p>这条推理只用到了「线性」与「凸」两点，对任意维数都成立，也正是单纯形法在顶点之间移动的理论来源。本题四个顶点，逐个代入比较即可；顶点数多时可借助表格系统列出。</p>

    <h3 class="sec" id="l2-int">整数解：顶点之外的答案</h3>
    <p>实际问题中变量常要求取整数（件数、人数）。此时可行域内的整点才合法，最优整数解不一定在顶点上：顶点坐标可能是分数，恰好落在可行域内部或边界上的整点才可能是答案。图 线2 切到「整数解」模式，灰圈标出可行域内的全部整点，金点是其中目标值最大的那个。</p>
    <p>例如目标函数取 <Katex tex="z=x+3y" /> 时，连续最优在顶点 <Katex tex="D(0,3.5)" /> 取到 <Katex tex="z=10.5" />，但 <Katex tex="D" /> 不是整点；在可行整数点中逐个比较，最优是 <Katex tex="(1,3)" />，<Katex tex="z=10" />。整数规划的一般解法（割平面、分支定界）超出本章范围，但「先解连续问题、再在附近找整点」是常用的起步思路。</p>

    <h3 class="sec" id="l2-pit">斜率、无解与取整</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>斜率决定最优顶点。</strong>等值线斜率 <Katex tex="-a/b" /> 与可行域各边斜率比较：比哪条边更陡，最优顶点就朝哪一侧移动。目标函数换一个系数，最优解可能整个换位置，不能沿用上一题的顶点。</p>
          <p><strong>可行域为空或无界。</strong>约束矛盾时可行域为空，问题无解；可行域无界时最大值可能不存在（沿无界方向目标可以无限增大），须先判断有界性。本板四条约束把区域围成有界多边形，属于有界情形。</p>
          <p><strong>整数解不能四舍五入。</strong>把连续最优解四舍五入得到的点可能根本不在可行域内；正确做法是枚举可行整点比较目标值，或检验取整后的点是否仍满足全部约束。</p>
    </div>
    <p>线1 的半平面判定、线2 的顶点比较，合起来就是线性规划的完整流程：画可行域、列顶点、代目标函数、读出最值。它与基2 的「和定积最大」同属最值问题，区别在于约束是线性的、可行域是多边形，答案落在边界顶点上。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLP } from '../../../boards/inequalities/plan/lpopt.js';
import { L_CHAPTERS } from './lnav.js';
</script>
