<template>
  <ChPage :cur="7" title="总结与延伸" sub="一条主线：调和点列 → 极线 → 对偶。">
    <p>这一篇走过的路，可以压成一句话：<strong>极线不是被“定义”出来的，它是调和点列的轨迹 —— 而调和点列由完全四点形这台纯射影机器量产。</strong>顺着这条线回顾：</p>
    <table><tbody>
      <tr><td>§1 无穷远点</td><td>平行线交于无穷远点，全体无穷远点构成 <Katex tex="l_\infty" />；欧氏平面 + <Katex tex="l_\infty" /> = 射影平面 <Katex tex="P^2" />。消点是无穷远点的像。</td></tr>
      <tr><td>§2 交叉比</td><td>中心投影下唯一不变的数量。交叉比 = −1 定义调和点列 (A,B;C,D)；中点与无穷远点调和共轭。</td></tr>
      <tr><td>§3 三台调和机器</td><td>完全四点形：四点六边三对角点，纯射影；内外角平分线与 Apollonius 圆：两种度量形式（k=1 时退化为垂直平分线）。殊途同归于 −1。</td></tr>
      <tr><td>§4 极点极线</td><td>极线 = 调和共轭点的轨迹；对圆有 <Katex tex="d\cdot d'=r^2" />（反演）；外点的极线是切点弦；La Hire：<Katex tex="Q\in p\iff P\in q" />。</td></tr>
      <tr><td>§5 配极原则</td><td>点 ↔ 线的对偶翻译机：共线 ⟺ 极线共点。这是对偶原理在二次曲线上的化身。</td></tr>
      <tr><td>§6 Pascal / Brianchon</td><td>内接六边形三对对边交点共线；其配极对偶为外切六边形三对角线共点。</td></tr>
    </tbody></table>
    <h3 class="sec">再往前走几步</h3>
    <p><strong>Desargues 定理</strong>：两三角形对应顶点连线共点 <Katex tex="\iff" /> 对应边交点共线 —— 平面情形的证明本身就需要出平面到三维（或借助配极），是射影几何真正的“公理级”事实。<strong>Klein 的 Erlangen 纲领</strong>（1872）则把整门课重新解说为：“一种几何 = 它所允许的变换群之下保持不变的性质”；欧氏几何 ⊂ 仿射几何 ⊂ 射影几何，外圈变换更大、保持的量更少，但定理更普适 —— 圆、椭圆、抛物线、双曲线在射影几何里是<strong>同一条曲线</strong>（只因与 <Katex tex="l_\infty" /> 的关系不同而呈现四种形态），这正是 Pascal 定理对一切“圆锥曲线”一视同仁的深层原因。</p>
    <p style="color:var(--mut);font-size:14.5px">延伸阅读建议：任意一本《高等几何》教材（梅向明等编，或周国新 — 沈纯理等）的射影平面、射影变换、二次曲线配极理论三章，与本篇 §1–§6 严格对应；对偶原理与 Desargues 定理的更多细节可读上述教材第一章。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import Katex from '../../../components/Katex.vue';
</script>
