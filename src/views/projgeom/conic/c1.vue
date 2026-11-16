<template>
  <ChPage :cur="1" no="曲1" base="/projgeom/c" :chapters="PRC_CHAPTERS"
    title="配极与极点极线"
    sub="一条圆锥曲线给每个点配一条直线，给每条直线配一个点。点在曲外时极线连接两条切线的切点，点在曲内时极线跑到曲外。极点与极线由同一个二次型算出。"
    :toc="[{ id: 'c1-polar', t: '极线与极点的定义' }, { id: 'c1-tangent', t: '点在圆外、圆内与圆上' }, { id: 'c1-la', t: '拉伊尔定理与对合' }, { id: 'c1-tip', t: '四条提示' }]">
    <div class="note good">设非退化圆锥曲线由对称矩阵 <Katex tex="A" /> 给出：<Katex tex="x^{\mathsf T}Ax=0" />。点 <Katex tex="p" /> 的<b>极线</b>是 <Katex tex="p^{\mathsf T}Ax=0" />；直线 <Katex tex="l" /> 的<b>极点</b>是 <Katex tex="A^{-1}l" />。关联关系对称：<Katex tex="p" /> 在 <Katex tex="q" /> 的极线上，当且仅当 <Katex tex="q" /> 在 <Katex tex="p" /> 的极线上。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPolar" />
      <div class="cap">图 曲1 · <b>配极机</b>：拖动 <Katex tex="P" />，黄色极线随之移动。看点：① <Katex tex="P" /> 在圆外时，紫色虚线是两条切线，切点都落在极线上；② <Katex tex="P" /> 移到圆内，切线变成虚的，极线整体跑到圆外；③ <Katex tex="P" /> 落在圆上，极线正好是过该点的切线——三种位置由同一方程统一。</div>
    </div>

    <h3 class="sec" id="c1-polar">极线与极点的定义</h3>
    <p>把齐次点 <Katex tex="p=(p_1,p_2,p_3)" /> 代入二次型的双线性形式，得到一条直线的系数：<Katex tex="l=A p" />，对应方程 <Katex tex="p^{\mathsf T}Ax=0" />。这一步把点变成线，就是<b>配极</b>。</p>
    <p>反过来，给定直线 <Katex tex="l" />，解 <Katex tex="Ap=l" /> 得 <Katex tex="p=A^{-1}l" />，就是它的极点。<Katex tex="A" /> 可逆（曲线非退化），所以极点唯一。</p>
    <p>对单位圆 <Katex tex="x^2+y^2=1" />，取 <Katex tex="A=\operatorname{diag}(1,1,-1)" />，点 <Katex tex="(a,b)" /> 的极线是 <Katex tex="ax+by=1" />。这个式子与切线方程同形，区别在于 <Katex tex="(a,b)" /> 不必在圆上。</p>

    <h3 class="sec" id="c1-tangent">点在圆外、圆内与圆上</h3>
    <p><Katex tex="P" /> 在圆外时，过 <Katex tex="P" /> 有两条切线，两个切点的连线恰是 <Katex tex="P" /> 的极线。画板上的紫色虚线就是这两条切线，切点落在黄色极线上。</p>
    <p><Katex tex="P" /> 在圆上时，两条切线重合为一条，极线退化成切线本身。方程 <Katex tex="ax+by=1" /> 仍成立，因为 <Katex tex="a^2+b^2=1" />，点 <Katex tex="P" /> 满足方程。</p>
    <p><Katex tex="P" /> 在圆内时，过 <Katex tex="P" /> 作不出实切线，极线跑到圆外。方程仍有实系数、仍是实直线，只是切点变成复点。射影几何不区分「实」与「复」，三种位置在同一公式下统一。</p>
    <p>圆心的极线是无穷远线：把 <Katex tex="p=(0,0,1)" /> 代入得 <Katex tex="-z=0" />。反过来，无穷远线的极点是圆心。配极把「中心」与「无穷远」配成了一对。</p>

    <h3 class="sec" id="c1-la">拉伊尔定理与对合</h3>
    <p><b>拉伊尔定理</b>：点 <Katex tex="P" /> 在点 <Katex tex="Q" /> 的极线上，当且仅当 <Katex tex="Q" /> 在 <Katex tex="P" /> 的极线上。用矩阵写就是 <Katex tex="p^{\mathsf T}Aq=0" /> 的对称性，一眼可见。</p>
    <p>于是极线可以这样用：要证 <Katex tex="Q" /> 在某条极线上，改证 <Katex tex="P" /> 在 <Katex tex="Q" /> 的极线上，常常更容易。完全四边形里三组对边交点共线、三条对角线成调和点列，都可以用配极一次证完。</p>
    <p>配极还在每条不过中心的直线上诱导一个<b>对合</b>：点与其极线与该直线的交点配对，两次配极回到原点。这个对合是射影几何里最基本的二阶对应。</p>

    <h3 class="sec" id="c1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：极线不是切线。</strong>只有极点在曲线上时，极线才是切线。点在曲外时，极线是两切点连线；点在曲内时，极线与曲线相离。</li>
        <li><strong>提示二：配极依赖曲线。</strong>换一条圆锥曲线，同一点的极线就变了。写方程时要把曲线的矩阵 <Katex tex="A" /> 一起带上，不能只记 <Katex tex="ax+by=1" />。</li>
        <li><strong>提示三：点在极线上要判两次。</strong>拉伊尔定理说的是互相关系：<Katex tex="P\in q" /> 与 <Katex tex="Q\in p" /> 等价。只验证一边就下结论，容易漏掉曲线选取。</li>
        <li><strong>提示四：实虚统一。</strong>圆内点的极线与圆相离，切点为复点。不要把「没有实切线」误当成「极线不存在」。</li>
      </ul>
    </div>
    <p>回收与预告：配极把所有圆锥曲线装进同一个矩阵框架。既然如此，椭圆、抛物线、双曲线的差别从哪来？差别不在曲线本身，而在它与无穷远线的相对位置。下一章按这个位置分类。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolar } from '../../../boards/projgeom/conic/polar.js';
import { PRC_CHAPTERS } from './prcnav.js';
</script>
