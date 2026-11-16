<template>
  <ChPage :cur="1" no="向1" base="/spacegeom/v" :chapters="SV_CHAPTERS"
    title="空间直角坐标与向量"
    sub="把平面直角坐标系添上一条竖直的 z 轴，空间里的每一个点就有一组三元有序实数组与之对应。向量平移之后坐标不变，于是加法、数乘、模与方向余弦全部化为三个分量的运算。这一段与立体几何标1、标2 的坐标法是同一套工具，只是把推导补齐。"
    :toc="[{ id: 'v1-axes', t: '空间直角坐标系' }, { id: 'v1-coords', t: '向量的坐标' }, { id: 'v1-mod', t: '模与方向余弦' }, { id: 'v1-pit', t: '坐标运算的三条' }]">
    <div class="note good">在空间里取一点 <Katex tex="O" /> 与三条两两垂直的数轴，就得到<strong>空间直角坐标系</strong>。空间任意一点 <Katex tex="P" /> 与三元有序实数组 <Katex tex="(x,y,z)" /> 一一对应；有序实数组<strong>既能写成点，也能写成向量</strong> <Katex tex="\overrightarrow{OP}" />，这两件事在解析几何里总是同时出现。</div>

    <h3 class="sec" id="v1-axes">空间直角坐标系</h3>
    <p>三条数轴分别叫 <Katex tex="x" /> 轴、<Katex tex="y" /> 轴、<Katex tex="z" /> 轴，统称坐标轴；两两确定的三个平面叫<strong>坐标平面</strong>，记作 <Katex tex="xOy" />、<Katex tex="yOz" />、<Katex tex="zOx" /> 平面。三个坐标平面把空间分成八个<strong>卦限</strong>，第一卦限内三个坐标都为正。</p>
    <p>过点 <Katex tex="P" /> 分别作三个坐标平面的垂线，垂足在三条轴上对应的数依次是 <Katex tex="x" />、<Katex tex="y" />、<Katex tex="z" />，称为 <Katex tex="P" /> 的<strong>坐标</strong>。反过来，给定有序实数组 <Katex tex="(x,y,z)" />，在三条轴上取对应点并各作坐标平面的平行面，三面的交点唯一，于是点与数组一一对应。</p>
    <p>坐标平面上的点有一个坐标为零，坐标轴上的点有两个坐标为零，原点的三个坐标全为零。这几条退化情形要能一眼认出，后面写平面方程、判断点落在线或面上时经常用到。</p>

    <h3 class="sec" id="v1-coords">向量的坐标</h3>
    <p>向量 <Katex tex="\overrightarrow{P_1P_2}" /> 的坐标等于终点坐标减起点坐标：</p>
    <p style="text-align:center"><Katex tex="\overrightarrow{P_1P_2}=(x_2-x_1,\ y_2-y_1,\ z_2-z_1)." display /></p>
    <p>这条式子说明<strong>向量的坐标与起点的位置无关</strong>：把向量平移，起点与终点同时平移，差不变。因此可以先把任意一条向量的起点搬到原点，用终点的坐标当作它的坐标，画板里就是这样做的。</p>
    <p>设 <Katex tex="\vec a=(a_1,a_2,a_3)" />、<Katex tex="\vec b=(b_1,b_2,b_3)" />、<Katex tex="\lambda\in\mathbb R" />，则</p>
    <p style="text-align:center"><Katex tex="\vec a\pm\vec b=(a_1\pm b_1,\ a_2\pm b_2,\ a_3\pm b_3),\qquad \lambda\vec a=(\lambda a_1,\ \lambda a_2,\ \lambda a_3)." display /></p>
    <p>共线的判据也与平面内相同：<Katex tex="\vec a\parallel\vec b" /> 当且仅当存在 <Katex tex="\lambda" /> 使 <Katex tex="\vec a=\lambda\vec b" />，写成坐标就是三对数成比例（分母为零时按分量单独核对，不写成 <Katex tex="\tfrac{a_1}{0}" />）。</p>
    <div class="board-wrap">
      <BoardMount :factory="createSpaceCoords" />
      <div class="cap">图 向1 · <b>空间坐标与向量机</b>：三个滑块各给一个坐标，紫色向量 <Katex tex="\overrightarrow{OP}" /> 的终点就是点 <Katex tex="P" />，长方体的棱把三个分量拆到三条轴上，轴上的粗线段长度正是分量的绝对值。徽章读坐标、模与方向余弦。看点：把 <Katex tex="z" /> 推到零，点落进 <Katex tex="xOy" /> 平面，竖直的棱全部消失；两个坐标推到零，点退到轴上，方向余弦里只剩一个 1；拖动画面旋转，三条棱始终贴着各自的轴。</div>
    </div>

    <h3 class="sec" id="v1-mod">模与方向余弦</h3>
    <p>向量的模由两次勾股定理得到：先在 <Katex tex="xOy" /> 平面上算底面矩形的对角线 <Katex tex="\sqrt{x^2+y^2}" />，再与竖直分量 <Katex tex="z" /> 合成，于是</p>
    <p style="text-align:center"><Katex tex="|\vec a|=\sqrt{a_1^2+a_2^2+a_3^2}." display /></p>
    <p>向量与三条坐标轴正方向的夹角 <Katex tex="\alpha" />、<Katex tex="\beta" />、<Katex tex="\gamma" /> 叫<strong>方向角</strong>，它们的余弦叫<strong>方向余弦</strong>。由直角三角形直接读出</p>
    <p style="text-align:center"><Katex tex="\cos\alpha=\frac{a_1}{|\vec a|},\qquad \cos\beta=\frac{a_2}{|\vec a|},\qquad \cos\gamma=\frac{a_3}{|\vec a|}." display /></p>
    <p>三个方向余弦满足恒等式 <Katex tex="\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1" />，因为右边是三个分量平方和除以模的平方。这条恒等式说明方向角不能随意取，也说明单位向量的三个分量正是三个方向余弦——把向量除以自己的模，就得到一个与它同向的单位向量。</p>
    <p>模为零的只有零向量。零向量没有确定的方向，方向角与方向余弦对它都没有意义，遇到时要单独说明。</p>

    <h3 class="sec" id="v1-pit">坐标运算的三条</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把点的坐标直接当成向量的坐标。</strong>只有起点在原点时两者才相同。从点 <Katex tex="A" /> 到点 <Katex tex="B" /> 的向量要用<strong>终点减起点</strong>，顺序颠倒得到的是反向量。</li>
        <li><strong>提示二：写比例式时出现分母为零。</strong>两向量共线写成 <Katex tex="\tfrac{a_1}{b_1}=\tfrac{a_2}{b_2}=\tfrac{a_3}{b_3}" /> 只在三个分母都不为零时成立。分量有零时改用「存在 <Katex tex="\lambda" /> 使逐分量成比例」的说法，或直接核对二阶小行列式。</li>
        <li><strong>提示三：方向余弦与方向角混用。</strong>方向余弦是三个具体的数，方向角是它们对应的角。求角时要再取反余弦，并且注意 <Katex tex="\arccos" /> 的值域是 <Katex tex="[0,\pi]" />，正好覆盖 <Katex tex="0^\circ" /> 到 <Katex tex="180^\circ" />。</li>
        <li><strong>提示四：以为坐标系只有一种取法。</strong>同一个点换一套坐标系坐标就变，但向量之间的夹角与线段长度不变。解析几何里选坐标系要看对称性，把它摆在对称轴或对称中心上，计算最省。</li>
      </ul>
    </div>
    <p>回收与预告：向2 把模与夹角合成一个数——数量积 <Katex tex="|\vec a||\vec b|\cos\theta" />，从此「垂直」和「夹角」都能用坐标直接算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSpaceCoords } from '../../../boards/spacegeom/vector/spacecoords.js';
import { SV_CHAPTERS } from './svnav.js';
</script>
