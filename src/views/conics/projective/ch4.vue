<template>
  <ChPage :cur="4" title="极点与极线：由调和点列构造出来" sub="极线 = 调和共轭点的轨迹 —— 一条由无数个 −1 确定的直线。"
    :toc="[{ id: 'c4-def', t: '极线的调和定义' }, { id: 'c4-t1', t: '实验一 · 扫描出极线（图 4）' }, { id: 'c4-t2', t: '实验二 · 完全四点形造极线（图 5）' }, { id: 'c4-t3', t: '实验三 · 极线全景（图 6）' }, { id: 'c4-lh', t: 'La Hire 定理（图 7）' }]">
    <p>现在可以回答标题里的问题了：<strong>极线到底是什么？它是从哪里“变”出来的？</strong>答案只有一句话，而且 §2 的一切都为它做好了铺垫：</p>
    <div class="note good" id="c4-def"><strong>极线的定义（调和版本）</strong>：给定二次曲线 C 与一点 P。过 P 引一条动割线，交 C 于 U, V；在这条割线上取 P 关于 U, V 的调和共轭点 P′ —— 即 (U, V; P, P′) = −1。当割线方向转过所有可能时，P′ 描出的轨迹就是 P 的<strong>极线</strong> <span class="term">(polar)</span>，P 则称为这条线关于曲线的<strong>极点</strong> <span class="term">(pole)</span>。</div>
    <p>这个定义里没有出现任何度量操作：求交点、找调和共轭，全是射影的。它天然有两个值得亲手验证的问题 —— 轨迹真的是直线吗？这条直线长什么样？下面两个实验台依次回答。</p>

    <h3 class="sec" id="c4-t1">实验一：亲自把极线“扫”出来</h3>
    <div class="board-wrap">
      <BoardMount :factory="createTrace" />
      <div class="cap">图 4 · <b>扫描出极线</b>：拖动 P，再点“开始扫描” —— 割线绕 P 匀速转动，黄色调和共轭点 P′ 一粒一粒落下。当点连成线，打开“显示理论极线”对照：轨迹与蓝色虚线完全重合。拖动 P 逼近圆心，极线奔向无穷远 —— 圆心恰好是圆的极线 <Katex tex="l_\infty" /> 的极点。</div>
    </div>
    <p>扫出这条直线后，它和圆心 O 的关系水落石出。设 P 与圆心距离为 d（<Katex tex="d>0" />），则 P 的极线垂直于 OP，且与 O 的距离恰为 <Katex tex="r^2/d" /> —— 也就是：</p>
    <Katex tex="d\cdot d'=r^2" display />
    <p>其中 <Katex tex="d'" /> 是 O 到极线的距离。这正是<strong>反演</strong> <span class="term">(inversion)</span> 的公式：极线在 OP 上的垂足 <Katex tex="P^*" />，就是 P 关于圆的反演像。在图 4 中拖动 P，注意角落里那个乘积读数 —— d 与 <Katex tex="d'" /> 的乘积恒等于 <Katex tex="r^2" />。度量视角与调和视角在此合流：一条直线，同时是“调和共轭点的轨迹”与“反演像的垂线”。</p>

    <h3 class="sec" id="c4-t2">实验二：用完全四点形构造极线（不依赖任何度量）</h3>
    <p>极线也可以完全用 §3 的机器造出来：<strong>过 P 作两条割线</strong>，分别交椭圆于 A, B 与 C, D。于是 P = AB∩CD 本身就是一个对角点；令 Q = AC∩BD、R = AD∩BC 为另外两个对角点 —— 那么直线 QR 就是 P 的极线。这就是<strong>自配极三角形</strong> <span class="term">(self-polar triangle)</span>：对角三角形的每个顶点的极线，恰是它对面的那条边。</p>
    <div class="board-wrap">
      <BoardMount :factory="createQuadPolar" />
      <div class="cap">图 5 · <b>完全四点形造极线</b>：拖动 P 上的两个箭头把手，任意旋转两条割线 —— 粉色直线（QR，即 P 的极线）纹丝不动。这一“怎么转都不动”正是定理的内容。叠加的蓝色虚线是公式算出的极线，两者重合。拖动 P 本身，极线则随之移动。</div>
    </div>
    <p>请注意这个构造的纯射影特征：全程只有“连线、求交”，不涉及长度。这解释了为什么极点极线理论能严格建立在射影几何框架内，也预示了它的用法 —— 后面 Pascal 定理的配极证明走的正是这条路。</p>

    <h3 class="sec" id="c4-t3">实验三：极线的全景（内、上、外）与切点弦</h3>
    <p>对椭圆 <Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1" />，点 P = (x₀, y₀) 的极线有统一的公式（对圆即 <Katex tex="xx_0+yy_0=r^2" />）：</p>
    <Katex tex="\dfrac{xx_0}{a^2}+\dfrac{yy_0}{b^2}=1" display />
    <p>在下面的实验台里拖动 P 巡视三个区域，右侧状态行会实时给出该区域的几何含义：</p>
    <div class="board-wrap">
      <BoardMount :factory="createPoleLab" />
      <div class="cap">图 6 · <b>极点极线全景实验台</b>：P 在曲线<strong>外</strong>时，极线是两条真实切线的<strong>切点弦</strong>（这也是极线最常见的应用题型）；P 在曲线<strong>上</strong>时，极线退化为该点处的切线；P 在曲线<strong>内</strong>时切线不存在（方程无实根，即“虚切线”），但极线依然真实存在 —— 调和定义不依赖切线是否可见。顶部的方程读数即上面公式。</div>
    </div>

    <h3 class="sec" id="c4-lh">La Hire 定理：极点与极线互为镜像</h3>
    <p>配极理论的核心对称性由 <strong>La Hire 定理</strong> <span class="term">(La Hire's theorem)</span> 给出：</p>
    <div class="note good"><strong>Q 落在 P 的极线上 &nbsp;<Katex tex="\iff" />&nbsp; P 落在 Q 的极线上。</strong>这样的点对称为关于曲线的<strong>共轭</strong>点对。判定“点在谁的极线上”可以双向进行 —— 这正是配极能把“共线”翻译成“共点”的原因（§5）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLaHire" />
      <div class="cap">图 7 · <b>La Hire 定理实验</b>：拖动 P, Q 两个点。判定框实时检查“Q ∈ p”与“P ∈ q” —— 两个判定永远同时通过。交点 M = p∩q：打开“显示 M 的极线”，它是恰好穿过 P 和 Q 的那条直线 —— 交点的极线是连线，这就是对偶性的具体体现。</div>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTrace } from '../../../boards/conics/projective/trace.js';
import { createBoard as createQuadPolar } from '../../../boards/conics/projective/quadpolar.js';
import { createBoard as createPoleLab } from '../../../boards/conics/projective/polelab.js';
import { createBoard as createLaHire } from '../../../boards/conics/projective/lahire.js';
</script>
