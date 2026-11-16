<template>
  <ChPage :cur="2" no="曲2" base="/projgeom/c" :chapters="PRC_CHAPTERS"
    title="二次曲线的射影分类"
    sub="在射影变换下，所有非退化圆锥曲线没有区别，都能变成同一个圆。椭圆、抛物线、双曲线的分类来自另一件事：曲线与无穷远线交了几个点。"
    :toc="[{ id: 'c2-rank', t: '按矩阵秩分类' }, { id: 'c2-inf', t: '与无穷远线的交点' }, { id: 'c2-euclid', t: '欧氏分类与离心率' }, { id: 'c2-tip', t: '四条提示' }]">
    <div class="note good">射影平面上，二次曲线由对称矩阵 <Katex tex="A" /> 的秩分类：秩 3 非退化，秩 2 退化为两条直线，秩 1 为一条二重直线。所有秩 3 的实二次曲线在射影变换下等价。若再固定一条无穷远线，则按曲线与它的实交点数分成<b>椭圆</b>（0 个）、<b>抛物线</b>（1 个，相切）、<b>双曲线</b>（2 个）。</div>

    <div class="board-wrap">
      <BoardMount :factory="createClassify" />
      <div class="cap">图 曲2 · <b>二次曲线分类机</b>：三种标准形切换，滑块改变开口。看点：① 椭圆的无穷远交点为零，抛物线只有一个切点，双曲线有两个；② 三种形状在射影意义下其实是同一条曲线，只是无穷远线的位置不同；③ 开口参数只改大小，不改分类。</div>
    </div>

    <h3 class="sec" id="c2-rank">按矩阵秩分类</h3>
    <p>二次曲线写成 <Katex tex="x^{\mathsf T}Ax=0" />，<Katex tex="A" /> 是对称三阶矩阵。可逆矩阵作变量替换 <Katex tex="x=My" /> 后，新矩阵是 <Katex tex="M^{\mathsf T}AM" />，秩不变。所以秩是射影不变量。</p>
    <p>秩 3：非退化曲线，形状上是一条椭圆或双曲线，射影上全部等价。秩 2：退化为两条相交或平行的直线。秩 1：两条直线重合，方程是一个完全平方。后两类统称退化曲线。</p>
    <p>在复数域上，秩 3 的二次曲线还能按符号差再分，但实射影分类只看秩。椭圆的「封闭」是仿射性质，不是射影性质：射影变换可以把椭圆的一段搬到无穷远，封闭性随之消失。</p>

    <h3 class="sec" id="c2-inf">与无穷远线的交点</h3>
    <p>把无穷远线 <Katex tex="z=0" /> 代入齐次方程，得到关于 <Katex tex="x,y" /> 的二次齐次式。它在实射影直线上的零点个数决定仿射类型：</p>
    <p>椭圆：没有实零点，曲线整体在有限处，封闭。抛物线：一个二重零点，曲线沿一个方向伸向无穷。双曲线：两个不同零点，曲线沿两条渐近方向伸向无穷，两支分开。</p>
    <p>因此三种曲线的差别可以完全归到 <Katex tex="l_\infty" /> 的位置：让无穷远线从曲线外移到相切、再移到相交，椭圆连续变成抛物线、再变成双曲线。第 10 章的画板把这个过程画成一条滑块。</p>

    <h3 class="sec" id="c2-euclid">欧氏分类与离心率</h3>
    <p>再往下加上度量，椭圆还可按离心率细分：<Katex tex="0&lt;e&lt;1" /> 为椭圆，<Katex tex="e=1" /> 为抛物线，<Katex tex="e&gt;1" /> 为双曲线。离心率不是射影不变量，它依赖焦点与准线的距离，属于欧氏几何。</p>
    <p>圆是椭圆的特例，两焦点重合、离心率为 0。在仿射变换下，圆可以变成任意椭圆；在相似变换下，圆只能变成圆。每加一层限制，分类就更细，可用的变换就更少。</p>
    <p>这张分类表与变换群一一对应：射影只看秩，仿射看无穷远交点，相似看离心率以外的形状，欧氏再区分大小与位置。下一专题把这条线索写成爱尔兰根纲领。</p>

    <h3 class="sec" id="c2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：椭圆、双曲线是仿射概念。</strong>在射影变换下它们没有区别。说「射影分类」时，只分非退化与退化，不分椭圆双曲线。</li>
        <li><strong>提示二：秩为零不是曲线。</strong>零矩阵对应的方程恒成立，整个平面都是「解」，不构成曲线。分类从秩 1 开始。</li>
        <li><strong>提示三：无穷远线要看实交点。</strong>复交点总有两个（计重数），分类看的是实交点。用判别式的符号判断，别数复根。</li>
        <li><strong>提示四：离心率不属于射影几何。</strong>它用到焦点与距离，射影变换不保。把离心率当射影不变量，会把分类层级弄混。</li>
      </ul>
    </div>
    <p>回收与预告：圆锥曲线上的点满足一条二次方程，六个点之间因此有很强的约束。帕斯卡定理说，内接六边形三组对边的交点必共线；对偶过去，就是外切六边形的三条对角线共点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createClassify } from '../../../boards/projgeom/conic/classify.js';
import { PRC_CHAPTERS } from './prcnav.js';
</script>
