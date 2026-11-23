<template>
  <ChPage :cur="5" title="配极原则与齐次坐标" sub="从共线与共点的互换，推导三种圆锥曲线共用的公式。"
    :toc="[{ id: 'c5-dual', t: '共线如何变为共点' }, { id: 'c5-matrix', t: '矩阵配极公式' }, { id: 'c5-infinity', t: '无穷远处的配极' }, { id: 'c5-harm', t: '固定弦束与交点轨迹' }]">
    <h3 class="sec" id="c5-dual">共线如何变为共点</h3>
    <p>设直线 <Katex tex="l" /> 的极点为 <Katex tex="L" />。若 <Katex tex="P_i\in l" />，La Hire 定理就给出 <Katex tex="L\in\operatorname{polar}(P_i)" />。所以同一条直线上的点，对应一束经过同一点的极线。反过来，若一束直线都经过一点，它们的极点就在这个点的极线上。</p>
    <ConicFigure head="bottom" number="8" title="从一列点到一束线" :factory="createDual"
      :legend="[['ink', '直线 l 与极点 L', 'dashed'], ['blue', 'P₁ 的极线'], ['gold', 'P₂ 的极线'], ['mint', 'P₃ 的极线'], ['pink', 'P₄ 的极线']]">
      拖动直线的两端或沿线拖动彩色点，再点「过椭圆中心」。四条极线这时互相平行，在射影平面里仍经过同一个无穷远点。
    </ConicFigure>

    <h3 class="sec" id="c5-matrix">用一个矩阵算极线与极点</h3>
    <p>将点写成齐次列向量 <Katex tex="X=(x,y,w)^{\mathsf T}" />。把 §4 的二次式写成矩阵形式，曲线方程为 <Katex tex="X^{\mathsf T}AX=0" />，其中 <Katex tex="A" /> 是对称可逆矩阵，§4 的 <Katex tex="B(P,X)" /> 就是 <Katex tex="X^{\mathsf T}AP" />。直线 <Katex tex="ax+by+cw=0" /> 用列向量 <Katex tex="\ell=(a,b,c)^{\mathsf T}" /> 表示。配极公式是</p>
    <Katex tex="P\ \longmapsto\ \ell=AP,\qquad \ell\ \longmapsto\ P=A^{-1}\ell." display />
    <p>点与直线各自可以整体乘以非零常数。两次配极返回原对象，且 <Katex tex="Q^{\mathsf T}AP=P^{\mathsf T}AQ" />，所以只需检验同一个数是否为零，就能判断 La Hire 互易里的两个关联。</p>
    <table><thead><tr><th>曲线</th><th>有限点 <Katex tex="P=(x_0,y_0)" /> 的极线</th></tr></thead><tbody>
      <tr><td><Katex tex="x^2/a^2+y^2/b^2=1" /></td><td><Katex tex="x_0x/a^2+y_0y/b^2=1" /></td></tr>
      <tr><td><Katex tex="x^2/a^2-y^2/b^2=1" /></td><td><Katex tex="x_0x/a^2-y_0y/b^2=1" /></td></tr>
      <tr><td><Katex tex="y^2=2px\ (p>0)" /></td><td><Katex tex="y_0y=p(x+x_0)" /></td></tr>
    </tbody></table>
    <p>例如抛物线的齐次方程为 <Katex tex="y^2-2pxw=0" />。交叉项 <Katex tex="-2pxw" /> 在对称矩阵里拆成两项，于是 <Katex tex="AP=(-pw_0,y_0,-px_0)^{\mathsf T}" />。若 <Katex tex="w_0=1" />，马上得到表中的极线方程。</p>

    <h3 class="sec" id="c5-infinity">同一公式也适用于无穷远</h3>
    <ConicFigure head="bottom" number="8b" title="用矩阵比较椭圆、双曲线与抛物线" :factory="createMatrixLab"
      :legend="[['blue', '极线 p'], ['gold', '极点 P 或无穷远方向', 'point'], ['guide', '坐标轴与渐近线']]">
      切换曲线后拖动 <Katex tex="P" />，再用预设代入曲线上或无穷远处的点。出现「视窗外」时，极线仍是有限仿射直线。出现 <Katex tex="w=0" /> 时，它是无穷远直线。
    </ConicFigure>
    <ul>
      <li><strong>椭圆。</strong> <Katex tex="l_\infty" /> 的极点为中心。椭圆上没有实的无穷远点。</li>
      <li><strong>双曲线。</strong> <Katex tex="l_\infty" /> 的极点也为中心。对 <Katex tex="x^2/4-y^2=1" />，曲线上的两个无穷远点为 <Katex tex="[2:\pm1:0]" />，它们的极线正是两条渐近线。</li>
      <li><strong>抛物线。</strong> 对 <Katex tex="y^2=2px" />，唯一的无穷远点为 <Katex tex="[1:0:0]" />。它既在曲线上，又是 <Katex tex="l_\infty" /> 的极点，所以 <Katex tex="l_\infty" /> 在该点与抛物线相切。</li>
    </ul>

    <p><strong>用无穷远点找平行弦的中点。</strong> 在椭圆里，任何一族方向为 <Katex tex="(u,v)" /> 的平行弦都经过同一个无穷远点 <Katex tex="D=[u:v:0]" />。每条弦的中点都与 <Katex tex="D" /> 调和共轭，因此这些中点都在 <Katex tex="D" /> 的极线 <Katex tex="ux/a^2+vy/b^2=0" /> 上。这个结论把 §2 的中点性质直接变成了平行弦中点共线的证明。当 <Katex tex="a=b" /> 时，所得直径与弦垂直，正是圆的垂径定理。</p>
    <p><ReadingLink to="/conics/aff2" chapter="A2">用点差法看同一个结论</ReadingLink></p>

    <h3 class="sec" id="c5-harm">应用：固定一束弦，追踪两端切线的交点</h3>
    <p>接着用 §4 的椭圆 <Katex tex="x^2/4+y^2=1" />。上一节从 <Katex tex="P=(4,0)" /> 得到切点弦 <Katex tex="x=1" />。现在把弦固定在点 <Katex tex="M=(1,0)" /> 上，让它绕 <Katex tex="M" /> 转动。每条弦截出两个端点，在这两个端点作切线，它们的交点 <Katex tex="P" /> 会往哪里走？</p>
    <p>每条弦本身就是对应交点 <Katex tex="P" /> 的极线。因为所有弦都经过 <Katex tex="M" />，它们的极点 <Katex tex="P" /> 都在 <Katex tex="M" /> 的极线上。把 <Katex tex="M=(1,0)" /> 代入公式，得到轨迹 <Katex tex="x=4" />。反过来，<Katex tex="x=4" /> 上每个有限点都在椭圆外，所以都能取出一条过 <Katex tex="M" /> 的实切点弦。于是有限轨迹就是整条 <Katex tex="x=4" />。水平弦的两端切线平行，对应这条轨迹上的竖直方向点。</p>
    <p>同一套对应还可以反着读：如果切线的交点沿一条直线移动，对应的切点弦就经过一个固定点。到了 §6，我们把同样的「共线与共点互换」用在六边形上。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ReadingLink from '../../../components/ReadingLink.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDual } from '../../../boards/conics/projective/dual.js';
import { createBoard as createMatrixLab } from '../../../boards/conics/projective/matrixlab.js';
</script>
