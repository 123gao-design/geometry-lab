<template>
  <ChPage :cur="5" title="配极原则：把“共线”翻译成“共点”的机器" sub="点变线、线变点 —— 命题翻译之后，真伪不变。">
    <p>把每个点变成一条线（它的极线），把每条线变回一个点（它的极点）—— 这个映射称为<strong>配极变换</strong> <span class="term">(polarity)</span>。由 La Hire 定理，点在线上 <Katex tex="\iff" /> 线过点，于是“在……上”这个关系被完美地倒了个个儿。立刻得到整个理论中最好用的工具，<strong>配极原则</strong>：</p>
    <div class="note good">若若干点共线于 l，则它们的极线共点于 L —— 其中 L 恰是 l 的极点。反之亦然：<strong>共线 ⟿ 极线共点，共点 ⟿ 极线共线</strong>。它就像一台翻译机：任何关于点与线的射影命题，翻译后得到一个对偶命题，真伪相同。</div>
    <p>这是<strong>对偶原理</strong> <span class="term">(principle of duality)</span> 在圆锥曲线上的具体化身：射影平面里，“点”与“直线”两个词互换，命题依然成立。也正因如此，配极原则成了解决“证明共线 / 共点”类问题的标准引擎 —— 想证三线共点？把每条线换成它的极点，只需证三点共线，而后者常有现成工具。</p>
    <div class="board-wrap">
      <BoardMount :factory="createBoard" />
      <div class="cap">图 8 · <b>共线与共点的对偶</b>：白色直线 l 由两个端把手确定，l 上放了四个点。它们各自的极线是四条彩色直线 —— 拖动 l 或沿 l 滑动这些点：四条极线<strong>永远共点</strong>于白色 L 点（即 l 的极点）。四个点只是随意摆放的，配极原则不需要任何巧合。</div>
    </div>
    <p>一个值得驻足的画面：把直线 l 拖得越来越远（远离椭圆），极点 L 会朝椭圆步步逼近 —— 直线 l 的极限位置 <Katex tex="l_\infty" />（无穷远直线）的极点正是椭圆的中心。直线与点的“远 ↔ 近”在这种意义下互为镜像。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard } from '../../../boards/conics/projective/dual.js';
</script>
