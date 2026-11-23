<template>
  <ChPage :cur="6" title="Pascal 与 Brianchon 定理" sub="同一组六点，一幅图找共线，另一幅图找共点。"
    :toc="[{ id: 'c6-p', t: 'Pascal 线' }, { id: 'c6-b', t: 'Brianchon 点' }, { id: 'c6-proof', t: '逐步取极' }, { id: 'c6-limit', t: '切线与无穷远' }]">
    <h3 class="sec" id="c6-p">Pascal：三对对边的交点共线</h3>
    <p>取非退化圆锥曲线上的六个不同点 <Katex tex="T_1,\dots,T_6" />，按编号连成六边形。编号可以按圆周顺序排列，也可以得到交叉六边形。记 <Katex tex="e_i=T_iT_{i+1}" />，下标按 6 循环。<strong>Pascal 定理</strong>断言：</p>
    <Katex tex="X=e_1\cap e_4,\qquad Y=e_2\cap e_5,\qquad Z=e_3\cap e_6" display />
    <p>这三点共线。这条线称为 <strong>Pascal 线</strong> <Katex tex="p" />。</p>
    <ProjectiveFigure number="9" title="三对对边如何确定 Pascal 线" :factory="createPascal"
      :legend="[['blue', '第一对 → X'], ['gold', '第二对 → Y'], ['mint', '第三对 → Z'], ['ink', 'Pascal 线 p']]">
      颜色相同的两条边组成一对，虚线是边的延长线。拖动编号顶点并观察三个交点。点「一组对边平行」，观察无穷远点 X 如何决定 Pascal 线的方向。
    </ProjectiveFigure>

    <h3 class="sec" id="c6-b">Brianchon：三条主对角线共点</h3>
    <p>令 <Katex tex="t_i" /> 为 <Katex tex="T_i" /> 处的切线，相邻切线交于 <Katex tex="A_i=t_i\cap t_{i+1}" />。<strong>Brianchon 定理</strong>断言，切线六边形的三条主对角线</p>
    <Katex tex="A_1A_4,\qquad A_2A_5,\qquad A_3A_6" display />
    <p>共点。这个点称为 <strong>Brianchon 点</strong> <Katex tex="B" />。</p>
    <ProjectiveFigure number="10" title="三条主对角线如何汇交" :factory="createBrian"
      :legend="[['blue', 'A₁A₄'], ['gold', 'A₂A₅'], ['mint', 'A₃A₆'], ['ink', 'Brianchon 点 B', 'point']]">
      两幅图提供同一组预设。分别点「交叉六边形」或「中心对称」，就能逐一对照同色的 Pascal 交点与 Brianchon 对角线。
    </ProjectiveFigure>

    <h3 class="sec" id="c6-proof">从 Pascal 推出 Brianchon</h3>
    <ol>
      <li><strong>先取边的极点。</strong> <Katex tex="e_i=T_iT_{i+1}" /> 的极点是这两个端点的极线交点，即 <Katex tex="A_i=t_i\cap t_{i+1}" />。</li>
      <li><strong>再取交点的极线。</strong> <Katex tex="X=e_1\cap e_4" /> 的极线经过 <Katex tex="e_1,e_4" /> 的极点，恰为 <Katex tex="A_1A_4" />。同理，<Katex tex="Y,Z" /> 的极线对应另外两条主对角线。</li>
      <li><strong>最后交换共线与共点。</strong> 由 Pascal 定理，<Katex tex="X,Y,Z" /> 共线于 <Katex tex="p" />，所以三条极线共点于 <Katex tex="p" /> 的极点 <Katex tex="B" />。</li>
    </ol>

    <h3 class="sec" id="c6-limit">切线极限与无穷远构型</h3>
    <ul>
      <li><strong>相邻两点合并。</strong> 在两幅图点「让 6 和 1 重合」。图 9 中 <Katex tex="e_6" /> 变为 <Katex tex="T_1" /> 处的切线。图 10 中两条相邻切线重合，原来的交点 <Katex tex="A_6" /> 按极限取为切点 <Katex tex="T_1" />。</li>
      <li><strong>中心对称。</strong> 若 <Katex tex="T_{i+3}" /> 是 <Katex tex="T_i" /> 的中心对称点，三对对边各自平行。图 9 的三个交点都在 <Katex tex="l_\infty" /> 上，Pascal 线就是 <Katex tex="l_\infty" />。图 10 的三条主对角线汇交于椭圆中心，恰好是 <Katex tex="l_\infty" /> 的极点。</li>
    </ul>
    <p>进阶阅读可看 Hungerbühler 与 Pohle 对两条定理及其推广的论文。<a href="https://www.math.ch/norbert.hungerbuehler/publications/A_selfdual_generalization_of_the_Theorems_of_Pascal_and_Brianchon.pdf" target="_blank" rel="noopener noreferrer">Pascal 与 Brianchon 定理的自对偶推广</a></p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ProjectiveFigure from '../../../components/ProjectiveFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPascal } from '../../../boards/conics/projective/pascal.js';
import { createBoard as createBrian } from '../../../boards/conics/projective/brian.js';
</script>
