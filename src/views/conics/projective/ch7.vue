<template>
  <ChPage :cur="7" title="Pascal 与 Brianchon 的自对偶推广"
    sub="把用来配极的曲线与六边形所依附的曲线分开，共线、共点、内接和外切依然彼此等价。"
    :toc="[{ id: 'c7-polar', t: '配极六边形' }, { id: 'c7-chain', t: '四个等价条件' }, { id: 'c7-proof', t: '用多项式证明' }, { id: 'c7-conjugate', t: '共轭曲线与包络' }, { id: 'c7-general', t: '一般二次曲线' }]">
    <p>第六节的经典构图用同一条曲线取极线、作切线。Hungerbühler 与 Pohle 的论文把这两个角色拆开。先固定非退化二次曲线 <Katex tex="E" /> 作为配极的基准，再允许六个点落在另一条曲线 <Katex tex="D" /> 上。论文把用「极线与极点」替换「切线与切点」的做法称为<strong>极化</strong>。替换之后的新命题需要重新证明。</p>
    <p><ReadingLink to="/conics/ch6" chapter="§6" back>回看经典构图</ReadingLink></p>

    <h3 class="sec" id="c7-polar">每个对边交点对偶于一条主对角线</h3>
    <p>按顺序取六个不同的点 <Katex tex="P_1,\ldots,P_6" />，记 <Katex tex="H_2=P_1\cdots P_6" />。所有下标按 6 循环。对 <Katex tex="E" /> 取极，令 <Katex tex="p_i=\operatorname{polar}_E(P_i)" />，由这六条边组成配极六边形 <Katex tex="H_1" />。以下讨论一般位置的构型，六点中任意三点不共线，等价地，六条极线中任意三条不共点。</p>
    <ol>
      <li>左边的边是 <Katex tex="e_i=P_iP_{i+1}" />。由 La Hire 互易，右边相邻极线的交点 <Katex tex="A_i=p_i\cap p_{i+1}" /> 正是 <Katex tex="e_i" /> 的极点。</li>
      <li>左边的对边交点 <Katex tex="X_i=e_i\cap e_{i+3}" /> 同时在这两条边上。因此它的极线同时经过这两条边的极点，即右边的主对角线 <Katex tex="A_iA_{i+3}" />。</li>
      <li>若 <Katex tex="X_1,X_2,X_3" /> 都在直线 <Katex tex="h" /> 上，它们的极线都经过 <Katex tex="h" /> 的极点 <Katex tex="B" />。反过来，若三条主对角线都过 <Katex tex="B" />，取极就得到 <Katex tex="X_1,X_2,X_3\in\operatorname{polar}_E(B)" />。</li>
    </ol>
    <ConicFigure head="bottom" number="11" title="配极六边形的共线与共点" :factory="createSelfdual"
      :legend="[['ink', '共线轴 h／共点 B'], ['violet', '内接与外切的曲线 D、C'], ['ink', '配极基准 E', 'dashed']]">
      选一组编号，就能对照左边同色的两条对边、交点与右边的主对角线。拖动左图小点改变构型。「令 P₆ 离开 D」会同时打破两项性质，但每个交点与对应对角线仍互为极点、极线。「中心对称」把三个交点送到无穷远，右图的三条对角线则在圆心汇合。
    </ConicFigure>
    <p>上述三步只用点线关联。换成任意偶数 <Katex tex="2n" /> 边形，把 <Katex tex="i+3" /> 换成 <Katex tex="i+n" />，同样得到「一侧的对边交点共线」等价于「另一侧的主对角线共点」。论文把这层对应分别写在命题 2.1 和 2.2 中。</p>

    <h3 class="sec" id="c7-chain">四个条件为何等价</h3>
    <p><strong>自对偶六边形定理。</strong>同一基准曲线 <Katex tex="E" /> 下的两个配极六边形满足以下等价关系（论文定理 2.4）。</p>
    <div class="selfdual-chain">
      <div><strong><Katex tex="H_2" /> 内接于 <Katex tex="D" /></strong><span>六个顶点在同一圆锥曲线上</span></div>
      <div><strong><Katex tex="X_1,X_2,X_3" /> 共线</strong><span>左图的三对对边求交</span></div>
      <div><strong>三条主对角线共点</strong><span>右图的三对对顶点连线</span></div>
      <div><strong><Katex tex="H_1" /> 外切于 <Katex tex="C" /></strong><span>六条边是同一圆锥曲线的切线</span></div>
    </div>
    <p>第一、二项由 Pascal 定理及其逆命题相连。第二、三项正是上面的配极推导。第三、四项是 Brianchon 定理及其逆命题。「外切」在这里指六条边所在直线都切于 <Katex tex="C" />，构图也允许交叉的六边形。对偶交换内接点与切线，也交换共线轴与共点中心，因此整条等价链在对偶后仍成立。</p>
    <ul>
      <li><strong>极化的 Brianchon（2.6）。</strong>从 <Katex tex="D" /> 上的六点出发，对任意非退化 <Katex tex="E" /> 取极线，所得六边形的三条主对角线共点。取 <Katex tex="E=D" /> 时，极线正好是原六点的切线。</li>
      <li><strong>极化的 Pascal（2.8）。</strong>从 <Katex tex="C" /> 的六条切线出发，对任意非退化 <Katex tex="E" /> 取极点，所得六边形的三个对边交点共线。取 <Katex tex="E=C" /> 时，极点正好是原六条切线的切点。</li>
    </ul>
    <p>这个共线判据也能用于作图。若给定同一条二次曲线上的五点，并指定第六点应落在过 <Katex tex="P_5" /> 的某条割线上，前两组对边交点已由这条割线和五点确定。作出它们的连线，与 <Katex tex="P_3P_4" /> 交于 <Katex tex="X_3" />，再将 <Katex tex="P_1X_3" /> 与指定割线相交，即得第六点。这里假设所需的交点和连线唯一，且第六点与已知五点不同。</p>

    <h3 class="sec" id="c7-proof">只用弦方程和多项式的证明</h3>
    <p>下面从直线方程出发证明 Pascal 的两个方向。配极随后把这两个方向转成 Brianchon 的两个方向。</p>
    <details class="selfdual-proof">
      <summary>展开证明 · 六点在同一二次曲线上，推出三点共线</summary>
      <p>选取射影坐标，把圆锥曲线写成 <Katex tex="YW=X^2" />，并让六点都在 <Katex tex="W=1" /> 的仿射窗口。做法是在曲线上另选一点 <Katex tex="R" />，令其切线为 <Katex tex="W=0" />，并取 <Katex tex="R=[0:1:0]" />。一般二次式于是只含 <Katex tex="YW,X^2,XW,W^2" /> 四项，前两项系数非零。令 <Katex tex="W=1" /> 后，解出 <Katex tex="y" />，对右端配方并变换坐标即可得到 <Katex tex="y=x^2" />。可逆的齐次线性换元保持直线和交点关系。</p>
      <p>把六点写成 <Katex tex="P_i=(t_i,t_i^2)" />。弦 <Katex tex="P_iP_j" /> 的方程可取为 <Katex tex="L_{ij}=y-(t_i+t_j)x+t_it_j=0" />，代入 <Katex tex="(x,y)=(t,t^2)" />，它就变成 <Katex tex="(t-t_i)(t-t_j)" />。将交替出现的三条边分别相乘，记作 <Katex tex="F,G" />。</p>
      <Katex tex="F=L_{12}L_{34}L_{56},\qquad G=L_{23}L_{45}L_{61}" display />
      <p>各组恰好用到六个点各一次，所以 <Katex tex="F(t,t^2)=G(t,t^2)=\prod_{i=1}^6(t-t_i)" />。于是 <Katex tex="F-G" /> 含因子 <Katex tex="y-x^2" />。可以把 <Katex tex="F-G" /> 看成关于 <Katex tex="y" /> 的多项式，除以 <Katex tex="y-x^2" />，余数就是代入 <Katex tex="y=x^2" /> 的结果。两组直线不同，<Katex tex="F-G" /> 非零且总次数至多为三。齐次化后，剩下的因子 <Katex tex="h" /> 是一次齐次式。</p>
      <Katex tex="F_{\mathrm{hom}}-G_{\mathrm{hom}}=(YW-X^2)\,h(X,Y,W)" display />
      <p>每个对边交点同时令 <Katex tex="F_{\mathrm{hom}}" /> 和 <Katex tex="G_{\mathrm{hom}}" /> 为零。每一条弦与圆锥曲线只有自己的两个端点，所以对边交点只能令因子 <Katex tex="h" /> 为零。三个交点于是全在 <Katex tex="h=0" /> 上。这一步也涵盖平行对边的交点。如果仿射商为非零常数，齐次化后得到的正是 <Katex tex="h=0\iff W=0" />。</p>
    </details>
    <details class="selfdual-proof">
      <summary>展开逆命题 · 三个交点共线，推出六点在同一二次曲线上</summary>
      <p>从任意六个一般位置的点出发，仍用交替三边的齐次直线方程构造两个三次式 <Katex tex="F,G" />。若三个对边交点在直线 <Katex tex="h=0" /> 上，那么限制到这条直线后，<Katex tex="F,G" /> 有三个相同且互异的根。可以在直线上选一个参数，让这三点都有有限参数值。三点互异来自一般位置。比如 <Katex tex="X_1=X_2" /> 会迫使公共点等于 <Katex tex="P_2" />，而 <Katex tex="P_2" /> 不可能落在它的对边 <Katex tex="P_4P_5" /> 上。</p>
      <p>这条直线也不会是六边形的某条边。若它等于 <Katex tex="e_i" />，下一组交点 <Katex tex="X_{i+1}" /> 就只能是相邻两边的公共顶点，却又必须在 <Katex tex="e_{i+4}" /> 上，违背一般位置。因此两组乘积在直线上都给出非零多项式，且各有同样三个根，必相差一个非零常数倍 <Katex tex="\lambda" />。</p>
      <p>于是 <Katex tex="F-\lambda G=hQ" />，其中 <Katex tex="Q" /> 是非零的二次齐次式。因式分解可以通过取 <Katex tex="h" /> 为一个坐标来验证。每个顶点使 <Katex tex="F=G=0" />，且 <Katex tex="h" /> 避开所有顶点，因为它与任一边只交于该边的对边交点。故六点都满足 <Katex tex="Q=0" />。若这个二次式退化，取其奇点为 <Katex tex="[0:0:1]" />，方程便只剩关于前两个坐标的二次齐次式，实点集至多是两条直线或一个点。六点任意三点不共线排除了这些情况。</p>
      <p>把上述两个方向中的点换成线、连线换成交点，就得到 Brianchon 及其逆命题。具体地，可先用任一基准圆锥曲线取极。对偶侧的六点落在一条圆锥曲线上，原来的六条线便切于它的共轭曲线。下面给出这个点集与切线族的完整对应。</p>
    </details>

    <h3 class="sec" id="c7-conjugate">极线为什么会包络另一条圆锥曲线</h3>
    <p>定理 2.4 给出了内接曲线 <Katex tex="D" /> 和外切曲线 <Katex tex="C" /> 同时存在的条件。论文定理 3.10 更进一步。给定 <Katex tex="E,D" />，让点 <Katex tex="P" /> 遍历 <Katex tex="D" />，所有 <Katex tex="P" /> 的极线恰好组成另一条非退化圆锥曲线 <Katex tex="C" /> 的切线族。若极线切于 <Katex tex="Q" />，则 <Katex tex="Q" /> 的极线又恰好在 <Katex tex="P" /> 处切回 <Katex tex="D" />。因此 <Katex tex="C,D" /> 关于 <Katex tex="E" /> <strong>互为共轭</strong>。</p>
    <p>取 <Katex tex="E:x^2+y^2=1" />，原椭圆 <Katex tex="D:x^2/a^2+y^2/b^2=1" />。设 <Katex tex="P=(a\cos t,b\sin t)" />，则它关于单位圆的极线为 <Katex tex="a\cos t\,x+b\sin t\,y=1" />。令 <Katex tex="u=ax,\ v=by" />，极线变成 <Katex tex="u\cos t+v\sin t=1" />。两个单位向量的点积等于 1 当且仅当两向量相同。因此这条线只在 <Katex tex="(u,v)=(\cos t,\sin t)" /> 与单位圆相切。换回原坐标就得到共轭椭圆和切点。</p>
    <Katex tex="C:\ a^2x^2+b^2y^2=1,\qquad Q=\left(\frac{\cos t}{a},\frac{\sin t}{b}\right)" display />
    <p>因此共轭椭圆的两个半轴分别是原半轴的倒数。把 <Katex tex="a,b" /> 换成它们的倒数再做一次同样的推导，就得到 <Katex tex="Q" /> 的极线在 <Katex tex="P" /> 处切回原椭圆。</p>
    <ConicFigure head="bottom" number="12" title="两条椭圆的共轭与切线包络" :factory="createConjugate"
      :legend="[['blue', '原椭圆 D／Q 的极线'], ['mint', '共轭椭圆 C／P 的极线'], ['ink', '单位圆 E', 'dashed']]">
      拖动蓝点 P，青点 Q 与两条切线会跟着移动。打开「显示切线族」，可以看见 P 在原椭圆上改变位置时，极线如何围出共轭椭圆。调节两个半轴可观察 P 和 Q 的轨迹同时变形。
    </ConicFigure>

    <h3 class="sec" id="c7-general">一般二次曲线的公式</h3>
    <p>用 <Katex tex="M,S" /> 分别表示 <Katex tex="E,D" /> 的可逆对称矩阵。已知点 <Katex tex="P\in D" />，即 <Katex tex="P^{\mathsf T}SP=0" />。其关于 <Katex tex="E" /> 的极线系数向量为 <Katex tex="MP" />。设共轭曲线矩阵为 <Katex tex="N" />，在其上取点 <Katex tex="Q" />。<Katex tex="Q" /> 处的切线系数应为 <Katex tex="NQ" />。为使这条切线正好是 <Katex tex="MP" />，可取下式。</p>
    <Katex tex="N=MS^{-1}M,\qquad Q=M^{-1}SP" display />
    <p>矩阵 <Katex tex="N" /> 对称且可逆，定义了一条非退化曲线。代入即得 <Katex tex="NQ=MP" />，且 <Katex tex="Q^{\mathsf T}NQ=P^{\mathsf T}SP=0" />，所以 <Katex tex="Q" /> 确实在这条曲线上。切线公式来自二次式的展开。沿一条过 <Katex tex="Q" /> 的直线写 <Katex tex="X=Q+tV" />，代入二次式后常数项为零，一次项为 <Katex tex="2tQ^{\mathsf T}NV" />。若整条线满足 <Katex tex="Q^{\mathsf T}NX=0" />，一次项也消失，交点 <Katex tex="t=0" /> 就是二重根。另一方面 <Katex tex="MQ=SP" />，恰为原曲线在 <Katex tex="P" /> 处的切线。再取一次共轭，<Katex tex="MN^{-1}M=S" />。</p>
    <p><strong>唯一性从切线方程得到。</strong>非退化二次曲线 <Katex tex="X^{\mathsf T}NX=0" /> 的切线系数 <Katex tex="\ell" /> 恰好满足 <Katex tex="\ell^{\mathsf T}N^{-1}\ell=0" />，因为切点的坐标是 <Katex tex="N^{-1}\ell" />。取 <Katex tex="P=M^{-1}\ell" />，由 <Katex tex="N^{-1}=M^{-1}SM^{-1}" /> 可知 <Katex tex="P^{\mathsf T}SP=0" />。这样每条切线都来自 <Katex tex="D" /> 上的一点。</p>
    <p>若另一条曲线也包含这一切线族，它的系数二次式就在同一批点 <Katex tex="\ell" /> 上为零。把 <Katex tex="\ell^{\mathsf T}N^{-1}\ell=0" /> 改写为前面的抛物线，另一二次式代入 <Katex tex="(t,t^2)" /> 后次数至多为四，却有无穷多个根，故恒为零。由因式分解，两式只差常数倍，反求矩阵后便得到同一条共轭曲线。</p>
    <details class="selfdual-proof">
      <summary>展开论文中的几何推导 · 用五条切线锁定共轭曲线</summary>
      <p>先在 <Katex tex="D" /> 上固定五点，取它们关于 <Katex tex="E" /> 的极线。这五条线确定唯一的外切二次曲线。这里用的是「一般位置的五点确定唯一二次曲线」的对偶。五点给二次式的六个系数施加五个齐次线性条件，且一般位置排除退化。唯一性也只需要前面的多项式方法，把另一二次式代入标准抛物线，五个互异根就足以让次数至多为四的式子恒为零。</p>
      <p>任取第六点 <Katex tex="P" />，由定理 2.4，六条极线一起切于某条圆锥曲线。前五条已经固定了这条曲线，所以 <Katex tex="P" /> 的极线一定切于同一个 <Katex tex="C" />。若切点为 <Katex tex="Q" />，La Hire 互易说明 <Katex tex="Q" /> 的极线经过 <Katex tex="P" />。假如它还在 <Katex tex="D" /> 上截出第二个点，这个第二点的极线也会经过 <Katex tex="Q" />，并且也切于 <Katex tex="C" />。曲线上一点的切线唯一，极线的极点也唯一，所以这个第二点只能是 <Katex tex="P" />。因此 <Katex tex="Q" /> 的极线在 <Katex tex="P" /> 处相切。</p>
    </details>
    <p>这个结论把 La Hire 的直线情形推广到了曲线。原来的结果是直线上的点取极后形成过同一极点的线束。现在点在非退化二次曲线上移动，所得线族改为包络另一条二次曲线。论文把这种从退化构型走向非退化构型的做法称为<strong>正则化</strong>，并以从 Pappus 的两条直线到 Pascal 的一条圆锥曲线为类比。</p>

    <aside class="selfdual-source" aria-label="论文出处">
      <p><cite>A Selfdual Generalization of the Theorems of Pascal and Brianchon</cite></p>
      <p>Norbert Hungerbühler、Clemens Pohle，2025，<i>Creative Mathematics and Informatics</i> 34(2)，213–220。</p>
      <div class="selfdual-source-links">
        <ReadingLink href="https://doi.org/10.37193/CMI.2025.02.04">论文与 DOI</ReadingLink>
        <ReadingLink href="https://www.math.ch/norbert.hungerbuehler/publications/A_selfdual_generalization_of_the_Theorems_of_Pascal_and_Brianchon.pdf">作者提供的 PDF</ReadingLink>
      </div>
    </aside>
  </ChPage>
</template>

<script setup>
import ChPage from '../../../components/ChPage.vue';
import ReadingLink from '../../../components/ReadingLink.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createConjugate, createSelfdual } from '../../../boards/conics/projective/selfdual.js';
</script>

<style scoped>
.selfdual-chain {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin: 16px 0;
}
.selfdual-chain > div {
  position: relative;
  display: grid;
  align-content: center;
  gap: 4px;
  min-height: 76px;
  padding: 8px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: var(--card);
}
.selfdual-chain > div + div::before {
  position: absolute;
  content: '⇔';
  left: -18px;
  top: 50%;
  width: 16px;
  transform: translateY(-50%);
  color: var(--mut);
}
.selfdual-chain span { font-size: 12px; color: var(--mut); }
.selfdual-proof {
  margin: 10px 0;
  padding: 11px 13px;
  border: 1px solid var(--line);
  border-radius: 6px;
}
.selfdual-proof > summary { cursor: pointer; font-weight: 650; }
.selfdual-source {
  margin-top: 24px;
  padding-top: 13px;
  border-top: 1px solid var(--line);
  font-size: 14px;
  color: var(--mut);
}
.selfdual-source p { margin: 0 0 4px; }
.selfdual-source cite { color: var(--ink); }
.selfdual-source-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 11px; }
@media (max-width: 640px) {
  .conic-figure { --selfdual-label-boost: 4px; }
  .selfdual-chain { grid-template-columns: 1fr; }
  .selfdual-chain > div { min-height: 0; }
  .selfdual-chain > div + div::before {
    content: '⇕';
    left: calc(50% - 8px);
    top: -18px;
    transform: none;
  }
}
</style>
