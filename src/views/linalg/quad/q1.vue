<template>
  <ChPage :cur="1" no="型1" base="/linalg/q" :chapters="QL_CHAPTERS"
    title="二次型与它的曲线"
    sub="ax² + bxy + cy² 这种只含二次项的式子叫二次型。让它等于 1，等值线画出来就是圆锥曲线的一支；而这条曲线是椭圆、双曲线还是空集，只由二次型矩阵的两个特征值的正负决定。"
    :toc="[{ id: 'q1-def', t: '二次型与它的矩阵' }, { id: 'q1-curve', t: '等值线就是圆锥曲线' }, { id: 'q1-sign', t: '特征值的符号决定形状' }, { id: 'q1-pit', t: '交叉项与分类' }]">

    <div class="note good" id="q1-def">只含二次项的多项式 <Katex tex="f(x,y)=ax^2+bxy+cy^2" /> 称为<b>二次型</b>。取对称矩阵 <Katex tex="A=\begin{bmatrix}a&amp;b/2\\b/2&amp;c\end{bmatrix}" />，则 <Katex tex="f(x,y)=\vec{x}^{T}A\vec{x}" />，其中 <Katex tex="\vec{x}=(x,y)^{T}" />。交叉项系数之所以写成一半，正是为了让两个对角线上方的元素相同、矩阵对称——<Katex tex="2\cdot\dfrac{b}{2}=b" /> 才对得上。</div>

    <div class="board-wrap">
      <BoardMount :factory="createQuadForm" />
      <div class="cap">图 型1 · <b>二次型与它的曲线</b>：蓝色曲线是 <Katex tex="ax^2+bxy+cy^2=1" /> 的等值线，金紫两条虚线是矩阵的两条特征方向，蓝点是把半轴端点标了出来。看点：<Katex tex="a,c" /> 都取正时曲线是闭合椭圆，半轴长度 <Katex tex="1/\sqrt{\lambda}" /> 随特征值增大而缩短；把 <Katex tex="c" /> 拉到负值，曲线断开成两支；切到「两条平行线」档，两个特征值里有一个为零，二次型退化成完全平方，曲线拍平成两条直线；切到「空集」档，两个特征值同为负，视野里什么都画不出来。</div>
    </div>

    <h3 class="sec" id="q1-def">二次型与它的矩阵</h3>
    <p>二次型是「二次齐次」的东西：每一项都是二次，自变量整体放大 <Katex tex="t" /> 倍，函数值放大 <Katex tex="t^2" /> 倍。这个性质使它的等值线形状与大小无关，只有缩放——把 <Katex tex="f" /> 的等高线按比例放大，得到的是同族曲线。</p>
    <p>写成矩阵形式的好处立刻显现：<Katex tex="f(\vec{x})=\vec{x}^{T}A\vec{x}" /> 把二次型变成了 矩2 的乘法，而 <Katex tex="A" /> 对称这一点让后面的对角化成为可能（特2 里对称矩阵的 <Katex tex="P" /> 是正交阵）。任何方阵都能拆成对称与反对称两部分，而 <Katex tex="\vec{x}^{T}(\text{反对称})\vec{x}=0" />——反对称部分对二次型没有贡献，所以可以放心把 <Katex tex="A" /> 取成对称阵。</p>
    <p>图 型1 右栏两个对角元就是 <Katex tex="a" /> 与 <Katex tex="c" />，非对角元是 <Katex tex="b/2" />。把 <Katex tex="b" /> 从 0 拖开，矩阵出现非对角元，曲线随之倾斜——交叉项在几何上表现为「轴不在坐标轴上」。</p>

    <h3 class="sec" id="q1-curve">等值线就是圆锥曲线</h3>
    <p>方程 <Katex tex="ax^2+bxy+cy^2=1" /> 是一条二次曲线。中学的圆锥曲线标准形 <Katex tex="x^2/a^2+y^2/b^2=1" /> 与 <Katex tex="x^2/a^2-y^2/b^2=1" /> 都是它的特例：前者对应 <Katex tex="b=0" /> 且 <Katex tex="a,c" /> 同号，后者对应 <Katex tex="a,c" /> 异号。所以「二次型的等值线」与「圆锥曲线」是同一批图形，只差一个平移与转轴。</p>
    <p>有一处需要说清：本章的二次型是齐次的，没有一次项，因此曲线总是关于原点对称的，只能得到椭圆、双曲线与退化情形，得不到抛物线。抛物型需要方程里带一次项（例如 <Katex tex="y=x^2" /> 写成 <Katex tex="y-x^2=0" />），那时图形不再中心对称。conics 模块里的一般二次方程讨论的就是带一次项的全套情形。</p>
    <p>没有一次项，意味着曲线的中心固定在原点；一次项的作用才是把中心从原点挪走。<Katex tex="f=1" /> 的等值线在 <Katex tex="f" /> 为正定的情形下构成一族同心相似的椭圆——取不同的常数就得到这一族里的不同成员，这与 型2 的标准形是同一条曲线的两种写法。</p>

    <h3 class="sec" id="q1-sign">特征值的符号决定形状</h3>
    <p>把 <Katex tex="A" /> 对角化：<Katex tex="A=PDP^{T}" />，令 <Katex tex="\vec{x}=P\vec{x}'" />（换到特征基），二次型变成 <Katex tex="\lambda_1x'^2+\lambda_2y'^2" />。于是等值线在特征基下就是最朴素的形状：</p>
    <p style="text-align:center"><Katex tex="\lambda_1x'^2+\lambda_2y'^2=1\quad\Longrightarrow\quad \dfrac{x'^2}{1/\lambda_1}+\dfrac{y'^2}{1/\lambda_2}=1" display /></p>
    <p>后半句直接给出半轴：<Katex tex="\sqrt{1/\lambda_1}" /> 与 <Katex tex="\sqrt{1/\lambda_2}" />。判断形状只看两个符号：同为正，两项都加，得到椭圆（正定）；一正一负，一项减一项，得到双曲线（不定）；同为负，左边恒负，凑不出 1（负定，空集）；有一个为零，只剩一项，退化成两条平行直线。</p>
    <p>这三条判据可以合成两个数：乘积 <Katex tex="\lambda_1\lambda_2=\det A" /> 与和 <Katex tex="\lambda_1+\lambda_2=\mathrm{tr}\,A" />。乘积为正说明同号，再看和的正负区分椭圆与空集；乘积为负说明异号，一定是双曲线；乘积为零就是退化。图 型1 右栏的「判别式」正是 <Katex tex="\det A=ac-\dfrac{b^2}{4}" />。</p>

    <h3 class="sec" id="q1-pit">交叉项与分类</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：交叉项系数只取一半进矩阵。</strong><Katex tex="bxy" /> 对应矩阵里的两个 <Katex tex="b/2" />，加起来才是 <Katex tex="b" />。这一半漏掉，特征值就全算错。</li>
        <li><strong>提示二：<Katex tex="\det A>0" /> 不一定是椭圆。</strong>还要看迹的正负。两个特征值同为负时乘积为正，但曲线是空集。</li>
        <li><strong>提示三：本节的二次型没有一次项，得不到抛物线。</strong>看到「抛物型」就要想到方程里必然有一次项，中心已经不在原点。</li>
        <li><strong>提示四：等值线 <Katex tex="=1" /> 与 <Katex tex="=-1" /> 形状相同、位置互换。</strong>把 <Katex tex="f=1" /> 的 <Katex tex="A" /> 换成 <Katex tex="-A" />，得到的是 <Katex tex="f=-1" /> 那条曲线。所以负定的情形并非「什么都没有」，只是取 1 这一层取不到。</li>
      </ul>
    </div>
    <p>回收与预告：特1 说特征方向是只伸缩的方向，这里它变成了椭圆的两条轴——两条线索是同一件事的两面。下一章处理 <Katex tex="b\ne0" /> 带来的倾斜：转过一个角度，把交叉项消掉，标准形与半轴就一起显出来了。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQuadForm } from '../../../boards/linalg/quad/quadform.js';
import { QL_CHAPTERS } from './qlnav.js';
</script>
