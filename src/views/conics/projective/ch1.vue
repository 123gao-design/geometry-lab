<template>
  <ChPage :cur="1" title="平行线的“交点”：无穷远点与消点" sub="照片里的平行线为何相交？—— 因为它们本来就相交。">
    <p>先观察一张透视照片里发生了什么：地面的砖缝本是<strong>互相平行</strong>的，但在像片上，它们分明汇交于同一点。中心投影（也就是“打灯光、拍照”）不保持长度、不保持角度、更不保持平行性 —— 平行这件事，在投影下<strong>失效</strong>了。</p>
    <p>射影几何的应对方式干脆利落：<strong>既然平行线的像总要交于一点，那就干脆承认它们本来就相交 —— 交在一个新添出来的点上。</strong> 我们约定：</p>
    <div class="note">每一族平行直线共用<strong>一个无穷远点</strong>（方向决定族，族决定点）；两条不同直线要么交于普通点，要么平行 —— 而平行不过就是“相交于自己的无穷远点”。平面上所有无穷远点组成一条<strong>无穷远直线 <Katex tex="l_\infty" /></strong>。欧氏（仿射）平面添上这条直线，就得到<strong>射影平面 <Katex tex="P^2" /></strong>：在这里，<em>任何两条直线都恰好交于一点</em>，平行与相交被统一成一个陈述。</div>
    <p>无穷远点被中心投影“拍”到像平面上的普通位置，就成了画透视画时的<strong>消点</strong> <span class="term">(vanishing point)</span>。下面的实验台里，你在左侧俯视图拖动橙色箭头改变地面平行线族的方向，右侧画布是相机“拍”到的像 —— 注视橙色直线族的像：<strong>它们永远汇交于一点</strong>，且这个点恰好落在所有水平方向共有的那条<strong>地平线</strong>上。</p>

    <div class="board-wrap">
      <BoardMount :factory="createBoard" />
      <div class="cap">图 1 · <b>透视投影</b>：左为地面俯视图（含平行线方向把手与相机 S 的位置），右为竖直像平面上的像。拖动方向把手，观察消点如何沿地平线滑动；把方向转到与像平面平行时，消点趋向无穷远，像中的直线族恢复平行。相机高度 h 决定地平线的高度。</div>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard } from '../../../boards/conics/projective/persp.js';
</script>
