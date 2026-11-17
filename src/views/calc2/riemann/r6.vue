<template>
  <ChPage :cur="6" no="重6" base="/calc2/r" :chapters="MR_CHAPTERS"
    title="重积分的应用"
    sub="质量、质心、转动惯量，写法都是「密度乘上某个距离幂，再在区域上积一次」。二重积分用于薄片，三重积分用于实体。这一章把前几章的算法放到具体的量上，顺便说明密度不均匀时质心为什么会离开几何中心。"
    :toc="[{ id: 'r6-mass', t: '质量与面积' }, { id: 'r6-centroid', t: '质心' }, { id: 'r6-inertia', t: '转动惯量' }, { id: 'r6-pit', t: '四条提示' }]">
    <div class="note good">薄片 <Katex tex="D" /> 的面密度为 <Katex tex="\rho(x,y)" />，则质量 <Katex tex="M=\iint_D\rho\,d\sigma" />，质心 <Katex tex="\bar x=\frac{1}{M}\iint_D x\rho\,d\sigma" />、<Katex tex="\bar y=\frac{1}{M}\iint_D y\rho\,d\sigma" />，对原点的转动惯量 <Katex tex="I_O=\iint_D(x^2+y^2)\rho\,d\sigma" />。三重积分把 <Katex tex="d\sigma" /> 换成 <Katex tex="dV" /> 即可。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMassApp" />
      <div class="cap">图 重6 · <b>重积分的应用</b>：区域是半圆 <Katex tex="x^2+y^2\le R^2" />、<Katex tex="y\ge0" />（蓝色边界），面密度 <Katex tex="\rho=1+y" />，颜色越橙越重。红色 <Katex tex="C" /> 是质心，紫色虚线是对称轴。拖半径 <Katex tex="R" />，质量 <Katex tex="M" />、质心高度 <Katex tex="\bar y" /> 与 <Katex tex="I_O" /> 三个读数同时变化。看点：质心始终在对称轴上，但比均匀半圆的 <Katex tex="4R/(3\pi)" /> 高——上半部分更重，质心被抬起来了。</div>
    </div>

    <h3 class="sec" id="r6-mass">质量与面积</h3>
    <p>密度为常数 <Katex tex="\rho_0" /> 时，质量就是 <Katex tex="\rho_0" /> 乘面积。这正是二重积分 <Katex tex="\iint_D d\sigma" /> 等于面积 <Katex tex="S" /> 的读法，所以「求面积」是「求质量」在 <Katex tex="\rho\equiv1" /> 时的特例。</p>
    <p>画板的密度是 <Katex tex="1+y" />，越靠上越重。质量分两部分算：</p>
    <p style="text-align:center"><Katex display tex="M=\iint_D(1+y)\,d\sigma=\frac{\pi R^2}{2}+\iint_D y\,d\sigma=\frac{\pi R^2}{2}+\frac{2R^3}{3}." /></p>
    <p>第一项是均匀半圆的质量，第二项是密度里 <Katex tex="y" /> 的那部分贡献。后一个积分用极坐标算：<Katex tex="\int_0^\pi\sin\theta\,d\theta\int_0^Rr^2dr=2\cdot\frac{R^3}{3}" />。</p>

    <h3 class="sec" id="r6-centroid">质心</h3>
    <p>质心的每一坐标都是「坐标加权的积分除以质量」。写成分量形式：</p>
    <p style="text-align:center"><Katex display tex="\bar x=\frac{\iint_Dx\rho\,d\sigma}{M},\qquad \bar y=\frac{\iint_Dy\rho\,d\sigma}{M}." /></p>
    <p>画板的区域关于 <Katex tex="y" /> 轴对称，密度也与 <Katex tex="x" /> 无关，所以 <Katex tex="\bar x=0" />，质心落在对称轴上。纵坐标要算 <Katex tex="\iint_D y(1+y)\,d\sigma=\frac{2R^3}{3}+\frac{\pi R^4}{8}" />，其中后一项来自 <Katex tex="y^2" />，正是它把质心往上抬。</p>
    <p>可以拿均匀半圆作对照：均匀半圆的质心在 <Katex tex="\bar y=\frac{4R}{3\pi}\approx0.424R" />；本图的密度向上递增，质心被抬到比这更高。画板把这个对照写在判读里，随 <Katex tex="R" /> 同步。</p>
    <p>用质心表达惯性量时还要用到<b>形心</b>：均匀薄片的质心叫形心，只由区域形状决定。密度不均匀时，质心与形心是两个不同的点，这一点在下一小节会反复出现。</p>

    <h3 class="sec" id="r6-inertia">转动惯量</h3>
    <p>转动惯量是「距离平方乘质量元」再积一次。对原点：</p>
    <p style="text-align:center"><Katex display tex="I_O=\iint_D(x^2+y^2)\rho\,d\sigma=\iint_D r^2\rho\,d\sigma." /></p>
    <p>对 <Katex tex="x" /> 轴、<Katex tex="y" /> 轴则是把距离换成 <Katex tex="y^2" /> 与 <Katex tex="x^2" />。三者满足 <Katex tex="I_O=I_x+I_y" />，这是距离平方拆开的结果。</p>
    <p>本图的具体计算：</p>
    <p style="text-align:center"><Katex display tex="I_O=\iint_D(x^2+y^2)\,d\sigma+\iint_D y(x^2+y^2)\,d\sigma=\frac{\pi R^4}{4}+\frac{2R^5}{5}." /></p>
    <p>第一项用极坐标得 <Katex tex="\int_0^\pi d\theta\int_0^Rr^3dr=\frac{\pi R^4}{4}" />；第二项同样换极坐标，<Katex tex="\int_0^\pi\sin\theta\,d\theta\int_0^Rr^4dr=2\cdot\frac{R^5}{5}" />。三项的指数各不相同——质量随 <Katex tex="R^2" /> 增长，一阶矩随 <Katex tex="R^3" />，转动惯量随 <Katex tex="R^4" /> 与 <Katex tex="R^5" />。拖半径时这三个读数的相对变化能直接看出来。</p>
    <p>三重积分的对应式只需把 <Katex tex="d\sigma" /> 换成 <Katex tex="dV" />：实体的质量 <Katex tex="\iiint\rho\,dV" />，对 <Katex tex="z" /> 轴的转动惯量 <Katex tex="\iiint(x^2+y^2)\rho\,dV" />。球体的转动惯量在球面坐标下算最省事。</p>

    <h3 class="sec" id="r6-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：质心与形心混用。</strong>密度不均匀时质心由密度决定，形心只由形状决定；题目问「重心」而未给密度时通常指形心，看清条件再动手。</li>
        <li><strong>提示二：转动惯量的距离取错。</strong>对 <Katex tex="x" /> 轴的转动惯量用 <Katex tex="y^2" />，不是 <Katex tex="x^2" />；对原点的用 <Katex tex="x^2+y^2" />。</li>
        <li><strong>提示三：对称性用错方向。</strong>对称性只能消去奇函数的积分。区域关于 <Katex tex="y" /> 轴对称时 <Katex tex="\iint x\rho=0" /> 成立的前提是 <Katex tex="\rho" /> 也与 <Katex tex="x" /> 无关。</li>
        <li><strong>提示四：忘记除以质量。</strong>质心是「矩除以质量」，只算一阶矩就当成坐标，得到的是带量纲的数，不是位置。</li>
      </ul>
    </div>
    <p>回收与预告：重积分的三种坐标写法到这里就齐了。下面一组把积分的对象从平面区域换成曲线与曲面，面积元要让位给弧长元与面积元。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMassApp } from '../../../boards/calc2/riemann/massapp.js';
import { MR_CHAPTERS } from './rnav.js';
</script>
