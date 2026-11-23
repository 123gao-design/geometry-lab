<template>
  <ChPage :cur="4" title="极点与极线" sub="固定一个极点，每条实割线都给出一个调和共轭点。"
    :toc="[{ id: 'c4-def', t: '二次曲线为什么产生调和' }, { id: 'c4-t1', t: '在圆上看见极线' }, { id: 'c4-t2', t: '用四点形作图' }, { id: 'c4-t3', t: '内点、曲线上与外点' }, { id: 'c4-lh', t: 'La Hire 互易' }]">
    <h3 class="sec" id="c4-def">二次曲线为什么自然产生调和点对？</h3>
    <p>§2 给出了一条直线上的配对方法，§3 给出了一种作图。对一条非退化二次曲线 <Katex tex="\mathcal C" />，实割线与曲线的两个不同交点 <Katex tex="U,V" />，就为这条线选定了调和的基点。固定一个不在曲线上的点 <Katex tex="P" />，换不同割线、得到不同的 <Katex tex="U,V" />，为什么各自算出的共轭点 <Katex tex="P'" /> 还能连成一条线？</p>
    <p><strong>先把曲线限制在一条割线上。</strong> 用齐次坐标表示，由 <Katex tex="U,V" /> 确定的点可写成 <Katex tex="sU+tV" />。设曲线方程为 <Katex tex="F(X)=0" />。由于 <Katex tex="U,V" /> 都在曲线上，<Katex tex="F(sU+tV)" /> 展开后，<Katex tex="s^2,t^2" /> 两项的系数都是零，只剩 <Katex tex="st" /> 的交叉项。</p>
    <p><strong>再把一个点的两个系数拆开比较。</strong> 定义 <Katex tex="B(P,X)=\tfrac12\bigl(F(P+X)-F(P)-F(X)\bigr)" />，也就是二次式里从 <Katex tex="P,X" /> 各取一次的那一部分的一半。交换两个点，<Katex tex="B" /> 的值不变。若 <Katex tex="P=sU+tV,\ X=uU+vV" />，则两项分别取自 <Katex tex="U,V" /> 的组合给出</p>
    <Katex tex="B(P,X)=(sv+tu)\,B(U,V)." display />
    <p><Katex tex="B(U,V)\ne0" />，否则交叉项也为零，整条割线都会落在曲线上。因此 <Katex tex="B(P,X)=0" /> 要求 <Katex tex="sv+tu=0" />，唯一的解是 <Katex tex="[u:v]=[s:-t]" />。由 §2，这恰好就是 <Katex tex="P" /> 关于 <Katex tex="U,V" /> 的调和共轭。</p>
    <div class="note good"><strong>回到整个平面。</strong> 固定 <Katex tex="P" /> 后，<Katex tex="B(P,X)=0" /> 是关于 <Katex tex="X" /> 的同一个线性方程。曲线非退化保证它给出一条直线，称为 <Katex tex="P" /> 的<strong>极线</strong>。在任一条过 <Katex tex="P" /> 的实割线上，极线的交点就是该割线确定的调和共轭。反过来，要找这个共轭点，只需求割线与极线的交点。</div>
    <p>实割线能采到极线的哪一段，取决于极点的位置。例如圆外点的实割线只采到切点弦内部，切点由割线趋于切线时的极限得到。若 <Katex tex="P" /> 本身在曲线上，极线就是该点的切线，图 4 可以直接比较圆内点与圆外点扫出的范围。</p>

    <ProjectiveFigure id="c4-t1" number="4" title="逐点扫描极线" :factory="createTrace"
      :legend="[['guide', '割线 UV', 'dashed'], ['gold', '调和共轭点 P′', 'point'], ['blue', '理论极线 p', 'dashed']]">
      转动割线把手，或点「开始扫描」。打开「显示理论极线」检查赭色采样点的位置。试试「圆外点」，再点「圆心」观察所有 <Katex tex="P'" /> 如何成为方向点。
    </ProjectiveFigure>

    <p>对以原点为圆心的圆，<Katex tex="B(P,X)=0" /> 也可以用韦达定理直接算出来。令割线上的点写成 <Katex tex="\mathbf p+t\mathbf u" />，其中 <Katex tex="\mathbf p=\overrightarrow{OP}" />，<Katex tex="\mathbf u" /> 是单位方向。两个交点的参数根 <Katex tex="t_1,t_2" /> 之和为 <Katex tex="-2\mathbf p\cdot\mathbf u" />，乘积为 <Katex tex="\|\mathbf p\|^2-r^2" />。将 <Katex tex="(t_1,t_2;0,t^{\prime})=-1" /> 展开，共轭点参数为 <Katex tex="t'=2t_1t_2/(t_1+t_2)" />。代入得到</p>
    <Katex tex="\mathbf p\cdot(\mathbf p+t'\mathbf u)=r^2." display />
    <p>这正是一直线方程。<Katex tex="P\ne O" /> 时，它垂直于 <Katex tex="OP" />，垂足 <Katex tex="P^*" /> 满足 <Katex tex="OP\cdot OP^*=r^2" />，因此 <Katex tex="P^*" /> 是 <Katex tex="P" /> 的圆反演像。若根之和为零，<Katex tex="P'" /> 是割线方向的无穷远点。对圆心 <Katex tex="P=O" />，每条割线都有这项性质，所以极线是 <Katex tex="l_\infty" />。</p>

    <h3 class="sec" id="c4-t2">用两条割线作出极线</h3>
    <p>过 <Katex tex="P" /> 的两条实割线分别交椭圆于 <Katex tex="A,B" /> 和 <Katex tex="C,D" />，四点互不相同。令 <Katex tex="Q=AC\cap BD,\ R=AD\cap BC" />。由 §3，直线 <Katex tex="QR" /> 与 <Katex tex="AB,\ CD" /> 的交点分别是 <Katex tex="P" /> 关于 <Katex tex="A,B" /> 和 <Katex tex="C,D" /> 的调和共轭点。因此 <Katex tex="QR" /> 就是 <Katex tex="P" /> 的极线。把同一个论证用在 <Katex tex="Q,R" /> 上，便得到<strong>自配极三角形</strong>：每个顶点的极线都是对边。</p>
    <ProjectiveFigure number="5" title="旋转两条割线，保留同一条极线" :factory="createQuadPolar"
      :legend="[['gold', '两条割线', 'dashed'], ['pink', '作图得到的 QR'], ['blue', '公式极线', 'dashed']]">
      固定 <Katex tex="P" />、转动任一赭色把手，观察 <Katex tex="Q,R" /> 的位置。点「中心构造」可看到两组对边平行时，<Katex tex="Q,R" /> 同在无穷远直线上。
    </ProjectiveFigure>

    <h3 class="sec" id="c4-t3">同一条极线的三种表现</h3>
    <p>用 <Katex tex="u=x/a,\ v=y/b" /> 将椭圆缩放成单位圆，圆的公式立刻给出椭圆 <Katex tex="x^2/a^2+y^2/b^2=1" /> 关于 <Katex tex="P=(x_0,y_0)" /> 的极线：</p>
    <Katex tex="\frac{x_0x}{a^2}+\frac{y_0y}{b^2}=1." display />
    <p>对曲线上一点 <Katex tex="T" />，沿方向 <Katex tex="D" /> 展开 <Katex tex="F(T+tD)" />。常数项为零，若一次项 <Katex tex="2tB(T,D)" /> 也为零，交点参数 <Katex tex="t=0" /> 就是重根。这给出切线条件 <Katex tex="B(T,D)=0" />，对应的直线恰好是 <Katex tex="T" /> 的极线。于是 <Katex tex="T" /> 是过 <Katex tex="P" /> 的切点，当且仅当 <Katex tex="T" /> 同时在曲线和 <Katex tex="P" /> 的极线上。</p>
    <table><thead><tr><th>P 的位置</th><th>过 P 的实切线</th><th>极线的表现</th></tr></thead><tbody>
      <tr><td>椭圆外</td><td>2 条</td><td>经过两个切点，是切点弦所在直线</td></tr>
      <tr><td>椭圆上</td><td>1 条</td><td>P 处的切线</td></tr>
      <tr><td>椭圆内</td><td>0 条</td><td>极线与椭圆无实交点，中心的极线为无穷远直线</td></tr>
    </tbody></table>
    <ProjectiveFigure number="6" title="极点跨过曲线时，两个切点如何变化" :factory="createPoleLab"
      :legend="[['ink', '极点 P', 'point'], ['blue', '极线 p'], ['gold', '过 P 的两条切线段']]">
      先点「外点」，再拖动 <Katex tex="P" /> 靠近曲线，观察两切点如何合并。四个预设可以直接到达曲线上、曲线内和中心等特殊位置。方程读数采用归一化坐标 <Katex tex="u,v" />。
    </ProjectiveFigure>

    <p><strong>把三种观点用在同一个例子里。</strong> 对椭圆 <Katex tex="x^2/4+y^2=1" />，取 <Katex tex="P=(4,0)" />。极线公式给出 <Katex tex="x=1" />，与椭圆联立得到两个切点 <Katex tex="T_\pm=(1,\pm\sqrt3/2)" />。再看过 <Katex tex="P" /> 的水平割线，它在椭圆上截出 <Katex tex="U=(-2,0),V=(2,0)" />。按 §2 的中点乘积公式，<Katex tex="P" /> 的共轭点横坐标满足 <Katex tex="4x=2^2" />，同样落在 <Katex tex="x=1" /> 上。</p>

    <h3 class="sec" id="c4-lh">La Hire 定理：极点和极线的互易关系</h3>
    <p>记 <Katex tex="p=\operatorname{polar}(P),\ q=\operatorname{polar}(Q)" />。前面证明中的 <Katex tex="B(P,Q)=B(Q,P)" /> 说明 <Katex tex="Q" /> 在 <Katex tex="p" /> 上与 <Katex tex="P" /> 在 <Katex tex="q" /> 上是同一个条件。对椭圆，取两个有限点的齐次坐标末项为 1，就得到</p>
    <Katex tex="\begin{gathered}Q\in p\ \iff\ B(P,Q)=0\ \iff\ P\in q\\[2pt] B(P,Q)=\frac{x_Px_Q}{a^2}+\frac{y_Py_Q}{b^2}-1.\end{gathered}" display />
    <p>两个命题同真或同假。成立时称 <Katex tex="P,Q" /> 为<strong>共轭点</strong>。若两条极线相交于 <Katex tex="M" />，对 <Katex tex="M\in p" /> 和 <Katex tex="M\in q" /> 各用一次互易定理，就知道 <Katex tex="M" /> 的极线同时经过 <Katex tex="P,Q" />。</p>
    <ProjectiveFigure number="7" title="让两个关联判定同真或同假" :factory="createLaHire"
      :legend="[['blue', 'P 与极线 p'], ['gold', 'Q 与极线 q', 'dashed'], ['mint', 'M 的极线 PQ', 'dashed']]">
      依次选择「共轭点对」与「非共轭点对」，比较两个命题和代入值。打开「显示 M 与 PQ」，再点「两极线平行」，此时 <Katex tex="M" /> 位于无穷远处，它的极线仍是 <Katex tex="PQ" />。
    </ProjectiveFigure>
    <p>对一个交点用两次互易，就能得到一条连线。下一节把同一思路推广到一整束弦或切线，直接解决定点与轨迹问题。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ProjectiveFigure from '../../../components/ProjectiveFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTrace } from '../../../boards/conics/projective/trace.js';
import { createBoard as createQuadPolar } from '../../../boards/conics/projective/quadpolar.js';
import { createBoard as createPoleLab } from '../../../boards/conics/projective/polelab.js';
import { createBoard as createLaHire } from '../../../boards/conics/projective/lahire.js';
</script>
