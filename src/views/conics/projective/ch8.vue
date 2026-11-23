<template>
  <ChPage :cur="8" title="用配极解定点与轨迹题" sub="从题目给出的动点或动弦出发，找到固定对象，再确定实切线允许的取值范围。"
    :toc="[{ id: 'c8-fixed', t: '切点弦过定点' }, { id: 'c8-locus', t: '切线交点的轨迹' }, { id: 'c8-focus', t: '焦点弦与准线' }]">
    <h3 class="sec" id="c8-fixed">动点在定直线上，为什么切点弦过定点？</h3>
    <p>在椭圆 <Katex tex="E:x^2/4+y^2=1" /> 外取动点 <Katex tex="P=(1,t)" />。从 P 引两条切线，切点为 A、B。求直线 AB 恒过的点。</p>
    <ConicFigure head="bottom" number="13" title="移动外点，观察切点弦经过定点" :factory="createFixed">
      拖动 P 沿虚线移动，观察两条切线与金色切点弦。经过椭圆边界时，两个切点先合并，再消失。
    </ConicFigure>
    <p>题设给了两个切点，却只问它们的连线。设任一切点为 <Katex tex="T=(u,v)" />，它的切线是 <Katex tex="ux/4+vy=1" />。把 P 代入，得到 <Katex tex="u/4+tv=1" />。A、B 都满足这个一次条件，于是可以直接写出切点弦：</p>
    <Katex tex="AB:\quad x/4+ty=1." display />
    <p>要找一个对所有 t 都成立的点，只需令 t 的系数 <Katex tex="y=0" />，再解出 <Katex tex="x=4" />。故定点为 <Katex tex="Q=(4,0)" />。从配极看，P 的轨迹所在直线 <Katex tex="x=1" /> 正是 Q 的极线；由互易关系，P 的极线 AB 恒过 Q。两条实切线存在的条件是 <Katex tex="1/4+t^2>1" />，即 <Katex tex="|t|>\sqrt3/2" />。</p>

    <h3 class="sec" id="c8-locus">把定点当成已知，轨迹是一整条直线吗？</h3>
    <p>现在反过来，过 <Katex tex="Q=(4,0)" /> 作割线交椭圆于 A、B，求两端切线的交点 P 的轨迹。</p>
    <ConicFigure head="bottom" number="14" title="转动割线，观察交点的两段轨迹" :factory="createLocus">
      拖动割线上的小点，使金色直线绕 Q 转动。红色开射线给出 P 的全部有限位置，空心端点不取。点「水平割线」可观察两条平行切线。
    </ConicFigure>
    <p><strong>先找候选直线。</strong> AB 是 P 的极线，又经过 Q，所以 P 在 Q 的极线 <Katex tex="x=1" /> 上。两端切线互异，交点必在椭圆外。于是得到两条开射线：</p>
    <Katex tex="x=1,\qquad y>\sqrt3/2\quad\text{或}\quad y<-\sqrt3/2." display />
    <p><strong>再验证每一点都能取到。</strong> 任取射线上的点 <Katex tex="P=(1,t)" />。它是椭圆外点，能引出两条不同的实切线。由上一题，两切点的连线一定经过 Q，正是一条符合题设的割线。两个端点对应切点合并，故不取。另有一条过 Q 和椭圆中心的割线，其两端切线平行，在仿射平面中没有有限交点。</p>
    <p>这两道题可以共用同一幅草图。已知 P 在定直线上，就对这条线取极点来找 AB 的定点。已知 AB 过定点，就对这个点取极线来找 P 的候选轨迹，再用实切线的条件和逆向构造确定范围。</p>

    <h3 class="sec" id="c8-focus">换成抛物线，焦点弦给出什么轨迹？</h3>
    <p>设抛物线 <Katex tex="y^2=4ax\ (a>0)" /> 的焦点为 <Katex tex="F=(a,0)" />。一条过 F 的直线截出两个不同的有限点 A、B。证明两端切线的交点在准线上，并判断这两条切线的夹角。</p>
    <ConicFigure head="bottom" number="15" title="焦点弦、准线与两切线的直角" :factory="createFocalChord">
      图中取 a = 1。拖动准线上的 P，观察弦 AB 始终经过 F。点「通径」使弦垂直于对称轴。
    </ConicFigure>
    <p>设切线交点为 <Katex tex="P=(h,k)" />。它的切点弦方程是 <Katex tex="ky=2a(x+h)" />。弦过 F，代入即得 <Katex tex="h=-a" />，恰是准线的横坐标。因此焦点与准线互为极点、极线。</p>
    <p>要确定夹角，可接着用参数。曲线上一点 <Katex tex="(as^2,2as)" /> 的切线是 <Katex tex="x-sy+as^2=0" />。任取准线上一点 <Katex tex="P=(-a,k)" />，过 P 的切线参数满足</p>
    <Katex tex="as^2-ks-a=0,\qquad s_1s_2=-1." display />
    <p>判别式 <Katex tex="k^2+4a^2>0" />，故每个准线点都对应两个不同的实切点。切线方向向量可取 <Katex tex="(s_1,1),(s_2,1)" />，点积为零，所以两条切线垂直。两切点的连线经过 F，这也验证了交点的轨迹是整条准线。</p>
  </ChPage>
</template>

<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import { createFixed, createLocus, createFocalChord } from '../../../boards/conics/projective/polarProblems.js';
import Katex from '../../../components/Katex.vue';
</script>
