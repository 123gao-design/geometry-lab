<template>
  <ChPage :cur="6" title="圆锥曲线上的明珠：Pascal 定理与 Brianchon 定理" sub="内接六边形与外切六边形 —— 一对配极孪生。"
    :toc="[{ id: 'c6-p', t: 'Pascal 定理（图 9）' }, { id: 'c6-b', t: 'Brianchon 定理（图 10）' }]">
    <p>作为完结，请出射影几何中最著名的一对定理。它们是极点极线理论的集中应用，也是前几节所有方法的汇总。</p>
    <div class="note"><strong>Pascal 定理</strong>（1640，作者年仅 16 岁）：圆锥曲线上任取六点 1–2–3–4–5–6 连成内接六边形，则三对对边的交点<br>
      X = (12)∩(45)，Y = (23)∩(56)，Z = (34)∩(61)<br>
      <strong>共线</strong>（这条线称为 Pascal 线）。它对退化情形依然成立：当相邻两点重合，弦退化为切线。</div>
    <div class="board-wrap" id="c6-p">
      <BoardMount :factory="createPascal" />
      <div class="cap">图 9 · <b>Pascal 定理实验</b>：沿椭圆拖动六个点（它们被约束在曲线上）。三个彩色交点 X, Y, Z 无论怎样拖动都趴在白色的 Pascal 线上。把两个相邻点（比如 6 与 1）拖到几乎重合 —— 那条边自动变为<strong>切线</strong>，定理照样成立。“打乱”按钮随机重排六个点，“让点舞动”则让六个点同时巡游。</div>
    </div>
    <p>Pascal 定理的姊妹篇由配极原则直接得到 —— 把内接六边形（六点六弦）对偶地换成外切六边形（六线六切点），点共线翻译成线共点：</p>
    <div class="note"><strong>Brianchon 定理</strong>（1806）：圆锥曲线的六条切线围成外切六边形，顶点为相邻切线的交点 <Katex tex="A_1,\ \ldots,\ A_6" />，则三条“对角线”<strong><Katex tex="A_1A_4" />、<Katex tex="A_2A_5" />、<Katex tex="A_3A_6" /> 共点</strong>（Brianchon 点）。</div>
    <div class="board-wrap" id="c6-b">
      <BoardMount :factory="createBrian" />
      <div class="cap">图 10 · <b>Brianchon 定理实验</b>：拖动六个切点（每条切线由其在曲线上的切点确定），三条白色对角线恒共点于 Brianchon 点。数值徽章显示第三条线到该点的偏差 —— 永远约为 0。把 Pascal 与它的对偶定理并排看：切点弦、La Hire、配极原则，全都在暗中工作。</div>
    </div>
    <p>值得说明的是，从配极的角度看这对定理几乎是同一句话：内接六边形三对对边的交点 X, Y, Z 共线 <Katex tex="\iff" />（对 X, Y, Z 取极线）它们共点于这条 Pascal 线的极点 —— 这恰好又是一个自配极结构。Pascal 线族（六点不同顺序给出的不同 Pascal 线，共 60 条）及其 Steiner、Kirkman 交点的理论至今仍是射影几何的富矿。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPascal } from '../../../boards/conics/projective/pascal.js';
import { createBoard as createBrian } from '../../../boards/conics/projective/brian.js';
</script>
