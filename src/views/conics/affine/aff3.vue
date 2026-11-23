<template>
  <ChPage :cur="3" no="A3" base="/conics/aff" :chapters="AFF_CHAPTERS"
    title="面积 πab 与割圆术" sub="刘徽割圆是 π，割椭圆是 πab —— 面积比不变量把极限过程原样平移；再顺手用仿射秒证三道经典题。"
    :toc="[{ id: 'a3-lab', t: '割椭圆术（图 A3）' }, { id: 'a3-der', t: '推导 · 面积比与 πab' }, { id: 'a3-app', t: '仿射证题实战三例' }, { id: 'a3-edge', t: '边界 · 仿射变换不保持什么' }]">
    <p>圆的面积是 <Katex tex="\pi a^2" />。椭圆的呢？两条路都通向 <Katex tex="\pi ab" />，而第一条路几乎不费力。</p>

    <h3 class="sec" id="a3-lab">割椭圆术</h3>
    <ConicFigure head="bottom" number="A3" title="用同一个多边形逼近圆与椭圆" :factory="createAffineArea"
      :legend="[['blue', '圆内接多边形'], ['mint', '椭圆内接多边形']]">
      圆内接正 n 边形与它的椭圆像。拖大 n，两个读数各自逼近 <Katex tex="\pi a^2" /> 与 <Katex tex="\pi ab" />；而「像 ÷ 原」从头到尾等于 k。刘徽在圆里做的极限，在椭圆里自动重演。
    </ConicFigure>

    <h3 class="sec" id="a3-der">推导：面积比不变量</h3>
    <p><strong>第一步（不变量）</strong>：竖直压缩 <Katex tex="T_k" /> 把每个"水平薄条"的高度乘 k、宽度不变，面积恰好乘 k —— 于是<strong>任意</strong>图形（不只多边形）的面积都被乘 k：S(像) = k·S(原)。多边形情形可以直接剖分成水平三角形来验；一般情形由图形被水平条逼近（图 A3 的动画正在演这件事）。</p>
    <p><strong>第二步（割圆术）</strong>：圆内接正 n 边形由 n 个全等等腰三角形（腰 a、顶角 <Katex tex="\tfrac{2\pi}{n}" />）拼成：</p>
    <Katex tex="S_n=\frac12\,n\,a^2\sin\frac{2\pi}{n}\ \xrightarrow[n\to\infty]{}\ \pi a^2" display />
    <p>它的像（内接于椭圆）面积是 <Katex tex="kS_n" />。两边取极限：</p>
    <Katex tex="S_{\text{椭圆}}=k\cdot\pi a^2=\frac{b}{a}\cdot\pi a^2=\pi ab\qquad\blacksquare" display />
    <div class="note good"><strong>微积分复验</strong>（大学视角预告）：直接积分 <Katex tex="S=4\int_0^ab\sqrt{1-\tfrac{x^2}{a^2}}\,dx=\tfrac{b}{a}\cdot 4\int_0^aa\sqrt{1-\tfrac{x^2}{a^2}}\,dx=\tfrac{b}{a}\pi a^2=\pi ab" />。被积函数整体比圆"矮了一个因子 <Katex tex="b/a" />" —— 积分式里明晃晃写着同一个不变量。k = 1 时回到阿基米德的 <Katex tex="\pi a^2" />。</div>

    <h3 class="sec" id="a3-app">仿射证题实战三例</h3>
    <p><strong>例一（内接平行四边形）</strong>：求证椭圆内接平行四边形的对角线互相平分，且平分点恰为椭圆中心。圆内接平行四边形是矩形（对角互为圆周角互补 + 平行四边形对角相等 <Katex tex="\Rightarrow" /> 每角 <Katex tex="90^\circ" />），其对角线是圆的直径、交于圆心。压扁后：平行四边形 ↦ 平行四边形（平行不变），中心 ↦ 中心（中点不变），对角线互相平分且过椭圆中心。∎ 一行。若直接计算：设四顶点参数 <Katex tex="t_i" />，由平行条件推出 <Katex tex="t_1=t_3+\pi,\ t_2=t_4+\pi" />，对角线中点重合于中心 —— 十行。</p>
    <p><strong>例二（内接三角形最大面积）</strong>：椭圆 <Katex tex="\tfrac{x^2}{a^2}+\tfrac{y^2}{b^2}=1" /> 内接三角形面积的最大值是 <Katex tex="\tfrac{3\sqrt3}{4}ab" />。圆内的最大内接三角形是正三角形（面积 <Katex tex="\tfrac{3\sqrt3}{4}a^2" />，旋转对称性的标准结论）；其像恰为椭圆内接三角形的最大者 —— 因为所有内接三角形的面积<strong>同时</strong>乘 k，大小关系原样保留。∎ 仿射不改变"谁最大"，只改写"大多少"。取到等号的正是圆的正三角形压扁后的"仿射正三角形"（顶点参数 t 间隔 <Katex tex="\tfrac{2\pi}{3}" />）。</p>
    <p><strong>例三（弦中点轨迹）</strong>：斜率为 m 的平行弦族，中点轨迹是过中心的直径 <Katex tex="y=-\tfrac{b^2}{a^2m}x" /> —— A2 的点差法两行即得；仿射视角下它就是圆的垂径直径被压扁。∎</p>

    <h3 class="sec" id="a3-edge">边界：仿射变换不保持什么</h3>
    <p>把清单反过来用：<strong>凡结论涉及长度、角度、垂直、焦点</strong> —— 仿射变换立即失效。最典型的是子专题二的光学性质：圆的"半径 ⊥ 切线"压扁后变成"切线与共轭半径方向的关系"（不是 90°），"圆内光路过圆心"更不会变成"椭圆光路过焦点"（<Katex tex="T_k" /> 把圆心变到中心，不变成焦点！）。焦点、离心率、光学性质都是<strong>度量</strong>概念 —— 它们属于 T 板块的"带尺子的世界"。所以本专题的分工非常清楚：</p>
    <ul>
      <li><strong>仿射世界</strong>（本章）：相切、平行、共线、比例、面积成比例 —— 结论可以圆里证、椭圆里用；</li>
      <li><strong>度量世界</strong>（子专题二）：焦半径、角度、等光程 —— 必须用 D 板块的焦半径公式与极坐标硬证。</li>
    </ul>
    <p>两个世界在 D5 的第三定义处握手（它既是仿射的斜率语言，又通过 <Katex tex="c^2=a^2-b^2" /> 连着焦点）。下一子专题换一套新语言继续追问：让点<strong>随参数跑起来</strong>。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAffineArea } from '../../../boards/conics/affine/affinearea.js';
import { AFF_CHAPTERS } from './affnav.js';
</script>
