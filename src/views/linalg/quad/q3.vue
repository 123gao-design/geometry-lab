<template>
  <ChPage :cur="3" no="型3" base="/linalg/q" :chapters="QL_CHAPTERS"
    title="用特征值给曲线分类"
    sub="把两个特征值当成平面上的一个点，整张平面被坐标轴分成四块，每块对应一种曲线。分类从此不必逐个配方，只需读出两个特征值的符号；反过来，给定了曲线类型，也就知道两个特征值该落在哪一块。"
    :toc="[{ id: 'q3-map', t: '特征值平面上的四块' }, { id: 'q3-order', t: '判断顺序' }, { id: 'q3-conics', t: '接回圆锥曲线' }, { id: 'q3-pit', t: '边界与退化的含义' }]">

    <div class="note good" id="q3-map">对二次型 <Katex tex="ax^2+bxy+cy^2" />，记两个特征值为 <Katex tex="\lambda_1,\lambda_2" />。以 <Katex tex="(\lambda_1,\lambda_2)" /> 为坐标，平面被两条坐标轴分成四块：两块都在第一象限内——第一象限给出椭圆，第二、四象限给出双曲线，第三象限给出空集。两条坐标轴本身对应退化情形（两条平行直线或空集）。</div>

    <div class="board-wrap">
      <BoardMount :factory="createConicType" />
      <div class="cap">图 型3 · <b>分类图机</b>：左栏是 <Katex tex="(\lambda_1,\lambda_2)" /> 平面，四块区域各标出一种曲线；右栏是当前点对应曲线 <Katex tex="\lambda_1x'^2+\lambda_2y'^2=1" /> 的实际形状，金紫两条虚线是两条特征方向。看点：把金色点拖过 <Katex tex="\lambda_2=0" /> 这条轴，椭圆突然断开成两支；再看从第一象限拖进第三象限，蓝线先缩成一点、随后整条消失；点停到坐标轴上时两个特征值里有一个为零，右栏换成一对平行直线，那正是退化的那一档。</div>
    </div>

    <h3 class="sec" id="q3-map">特征值平面上的四块</h3>
    <p>四块的划分来自乘积的符号与和的符号，也就是 <Katex tex="\det A" /> 与 <Katex tex="\mathrm{tr}\,A" /> 的符号：</p>
    <p style="text-align:center"><Katex tex="\det A>0,\ \mathrm{tr}\,A>0\ \Rightarrow\ \text{椭圆};\qquad \det A>0,\ \mathrm{tr}\,A<0\ \Rightarrow\ \text{空集};\qquad \det A<0\ \Rightarrow\ \text{双曲线}" display /></p>
    <p>右边那条判据里，双曲线不需要再看迹：乘积为负已经保证一正一负，无论哪个是正号，曲线都是两支。<Katex tex="\det A>0" /> 的两种情形才需要第二个数字——同号之下，两个都正才能把左边的取值凑到 1，两个都负则永远凑不到。</p>
    <p>图形上，第一象限对应「沿两个方向都放大」的二次型，等值线被围在中间，是闭合的椭圆；第二、四象限对应「一个方向放大、另一个方向翻转」，等值线因此断开成两支，沿正号那条轴向外张开；第三象限对应「两个方向都翻转」，等值线照样闭合，只是落在 <Katex tex="f=-1" /> 那一层上，取 <Katex tex="f=1" /> 时取不到。</p>

    <h3 class="sec" id="q3-order">判断顺序</h3>
    <p>实际做题按两步走最省事。第一步算 <Katex tex="\det A=ac-\dfrac{b^2}{4}" />：为负直接判双曲线，为正进入第二步，为零判退化。第二步算 <Katex tex="\mathrm{tr}\,A=a+c" />：为正判椭圆，为负判空集。两步至多一次乘减，不必求特征值本身。</p>
    <p>如果题目要求写出标准形，才需要 <Katex tex="\lambda_{1,2}" /> 的具体值：<Katex tex="\lambda=\dfrac{a+c}{2}\pm\sqrt{\left(\dfrac{a-c}{2}\right)^2+\dfrac{b^2}{4}}" />。这个式子与 特1 的特征方程是同一个求根公式，只是把 <Katex tex="\mathrm{tr}" /> 与 <Katex tex="\det" /> 换成了写法。</p>
    <p>判断顺序之所以能这样压缩，是因为分类只关心符号，而符号信息在迹与行列式里已经齐全。若要进一步问「椭圆多扁」，就必须求具体数值，再算半轴之比；这一步与 型2 的标准形是同一件事。</p>

    <h3 class="sec" id="q3-conics">接回圆锥曲线</h3>
    <p>这套分类与 conics 模块里的一般二次方程讨论完全接得上。那边用判别式 <Katex tex="B^2-4AC" /> 判断类型，这里用 <Katex tex="\det A=AC-\dfrac{B^2}{4}" />——两者只差一个常数因子 <Katex tex="-\dfrac14" />，符号判断因此完全一致：<Katex tex="B^2-4AC<0" /> 等价于 <Katex tex="\det A>0" />。</p>
    <p>椭圆的标准形 <Katex tex="\dfrac{x'^2}{a^2}+\dfrac{y'^2}{b^2}=1" /> 里，长短半轴之比决定离心率 <Katex tex="e=\sqrt{1-\dfrac{b^2}{a^2}}" />（设 <Katex tex="a\ge b" />）。用特征值表示就是 <Katex tex="\sqrt{1-\lambda_{\text{大}}/\lambda_{\text{小}}}" />——大特征值方向是短轴，这与 型1 的画面一致。离心率越接近 1，椭圆越扁，也说两个特征值的差距越大。</p>
    <p>双曲线同理：正特征值方向给实轴，负特征值方向给虚轴，<Katex tex="e=\sqrt{1+\dfrac{b^2}{a^2}}" />。退化情形（某个特征值为零）对应圆锥曲线里的「两条相交直线」之外的另一类——本节的二次型没有一次项，退化曲线只能是两条平行直线或空集，不会出现两条相交直线。</p>

    <h3 class="sec" id="q3-pit">边界与退化的含义</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：边界不是「介于两者之间」。</strong>特征值取到零时曲线不是「扁到极限的椭圆」，而是直接换了一类对象——两条平行直线（或空集）。分类在边界上不连续。</li>
        <li><strong>提示二：第三象限不是「另一种椭圆」。</strong><Katex tex="\lambda" /> 都为负时，<Katex tex="f=1" /> 取不到，但 <Katex tex="f=-1" /> 是个椭圆。若把方程右边改成 <Katex tex="-1" />，第三象限就变成椭圆、第一象限变成空集。</li>
        <li><strong>提示三：判别式与二次方程判别式是两个东西。</strong>这里用的是 <Katex tex="\det A" />，管曲线类型；<Katex tex="\Delta=\mathrm{tr}^2-4\det" /> 管特征值是否为实数。两者名字相近，作用不同。</li>
        <li><strong>提示四：分类不依赖坐标轴怎么摆。</strong>转轴只改变 <Katex tex="P" />，不改变 <Katex tex="\lambda_1,\lambda_2" />，因此四块的分区与图形朝向无关。图 型3 右栏固定按 <Katex tex="25^\circ" /> 摆放，只是为了看出轴的倾斜。</li>
      </ul>
    </div>
    <p>回收与预告：型1 从系数读曲线，型2 用转轴写标准形，本章把两个特征值画成一张分类图，三条路指的是同一件事。线性代数初步到此收束——从行列式量面积（行1、行2）到矩阵运算（矩1..矩3），从平面与空间的变换（空1..空3）到特征方向（特1..特3），最后落到二次型与圆锥曲线（型1..型3）。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createConicType } from '../../../boards/linalg/quad/conictype.js';
import { QL_CHAPTERS } from './qlnav.js';
</script>
