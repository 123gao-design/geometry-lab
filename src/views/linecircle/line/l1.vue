<template>
  <ChPage :cur="1" no="直1" base="/linecircle/l" :chapters="LN_CHAPTERS"
    title="倾斜角与斜率"
    sub="一条直线相对 x 轴倾斜多少，用倾斜角 α 度量，取值范围是 [0°,180°)；倾斜角的正切给出斜率 k，刻画出直线每向右走一个单位上升或下降多少。竖直直线的倾斜角仍是 90°，但正切没有定义，斜率不存在。"
    :toc="[{ id: 'l1-ang', t: '倾斜角的定义' }, { id: 'l1-slope', t: '斜率 k=tanα' }, { id: 'l1-two', t: '由两点求斜率' }, { id: 'l1-pit', t: '倾斜角与斜率的边界' }]">
    <div class="note good">直线 <Katex tex="l" /> 与 <Katex tex="x" /> 轴相交时，把 <Katex tex="x" /> 轴绕交点按逆时针方向转到与 <Katex tex="l" /> 重合所成的最小正角，叫做直线 <Katex tex="l" /> 的倾斜角；直线与 <Katex tex="x" /> 轴平行或重合时，规定倾斜角为 <Katex tex="0^\circ" />。倾斜角的取值范围是 <Katex tex="[0^\circ,180^\circ)" />。倾斜角 <Katex tex="\alpha\ne90^\circ" /> 时，<Katex tex="k=\tan\alpha" /> 叫做直线的斜率；<Katex tex="\alpha=90^\circ" /> 时斜率不存在。</div>

    <h3 class="sec" id="l1-ang">倾斜角的定义</h3>
    <div class="board-wrap">
      <BoardMount :factory="createInclineSlope" />
      <div class="cap">图 直1 · <b>倾斜角与斜率</b>：金色直线绕原点转动，橙色弧是倾斜角 <Katex tex="\alpha" />，蓝绿虚线是「横走 1、竖走 <Katex tex="k" />」的斜率三角形。看点：把方向点拖到 <Katex tex="90^\circ" />，直线立成竖直，斜率徽章改读「不存在」，而倾斜角仍是 <Katex tex="90^\circ" />；越过 <Katex tex="90^\circ" /> 继续拖，斜率由正变负，直线由上升改为下降。</div>
    </div>
    <p>倾斜角刻画的是方向，不是位置。同一方向的所有平行直线拥有同一个倾斜角，位置由截距另行给出。把 <Katex tex="x" /> 轴正向作为起点逆时针量角，得到的角在 <Katex tex="0^\circ" /> 到 <Katex tex="180^\circ" /> 之间；转到 <Katex tex="180^\circ" /> 时直线已经与 <Katex tex="x" /> 轴再次重合，与 <Katex tex="0^\circ" /> 是同一条直线，因此右端点不取。</p>
    <p><Katex tex="\alpha=0^\circ" /> 对应水平直线，<Katex tex="0^\circ<\alpha<90^\circ" /> 对应从左下到右上的直线，<Katex tex="\alpha=90^\circ" /> 对应竖直直线，<Katex tex="90^\circ<\alpha<180^\circ" /> 对应从左上到右下的直线。四种情形合起来覆盖了平面上所有方向。</p>

    <h3 class="sec" id="l1-slope">斜率 k=tanα</h3>
    <p>斜率是倾斜角的正切。在直线上任取两点，横坐标每增加 <Katex tex="1" />，纵坐标的增加量恰好是 <Katex tex="k" />：把直角三角形画在直线下方，横边取 <Katex tex="1" />、竖边取 <Katex tex="k" />，斜边就贴着直线。图中蓝绿两条虚线与金色直线围成的正是这个三角形。</p>
    <p>正切函数在 <Katex tex="[0^\circ,90^\circ)" /> 上从 <Katex tex="0" /> 增到正无穷，在 <Katex tex="(90^\circ,180^\circ)" /> 上从负无穷增到 <Katex tex="0" />。因此 <Katex tex="k>0" /> 对应上升，<Katex tex="k<0" /> 对应下降，<Katex tex="k=0" /> 对应水平；<Katex tex="k" /> 的绝对值越大，直线越陡。竖直直线没有「陡度」可言，正切在 <Katex tex="90^\circ" /> 处无定义，斜率也就不存在。</p>
    <p>过原点的直线方程可以直接写成 <Katex tex="y=kx" />；竖直直线是 <Katex tex="x=0" />，它不能写成 <Katex tex="y=kx" /> 的形式。一般位置的直线在直3 与直2 展开。</p>

    <h3 class="sec" id="l1-two">由两点求斜率</h3>
    <p>已知直线上两点 <Katex tex="P_1(x_1,y_1)" />、<Katex tex="P_2(x_2,y_2)" />，且 <Katex tex="x_1\ne x_2" />，斜率</p>
    <p style="text-align:center"><Katex tex="k=\frac{y_2-y_1}{x_2-x_1}." display /></p>
    <p>这个比值与两点的选取无关：换一对点，分子分母同比例变化，商不变。若 <Katex tex="x_1=x_2" />，分母为零，直线竖直，斜率不存在；若 <Katex tex="y_1=y_2" />，分子为零，<Katex tex="k=0" />，直线水平。</p>
    <p>由斜率可以反求倾斜角。已知 <Katex tex="k" /> 且 <Katex tex="k>0" /> 时 <Katex tex="\alpha=\arctan k" />；<Katex tex="k<0" /> 时先取 <Katex tex="\arctan|k|" />，再用 <Katex tex="180^\circ" /> 减去它。斜率的符号与倾斜角落在哪个区间，是一一对应的。</p>

    <h3 class="sec" id="l1-pit">倾斜角与斜率的边界</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：倾斜角取到 <Katex tex="180^\circ" />。</strong>倾斜角的范围是 <Katex tex="[0^\circ,180^\circ)" />，右端不取。写 <Katex tex="\alpha\in[0^\circ,180^\circ]" /> 会把与 <Katex tex="0^\circ" /> 重复的方向算两次。</li>
        <li><strong>提示二：把「斜率不存在」当成「斜率为 0」。</strong>前者是竖直直线，后者的方程是 <Katex tex="y=b" />（水平）。两者的图形、方程与倾斜角都不同，不能混写。</li>
        <li><strong>提示三：由 <Katex tex="k" /> 求 <Katex tex="\alpha" /> 时丢掉钝角解。</strong>正切以 <Katex tex="180^\circ" /> 为周期，<Katex tex="\arctan" /> 只给 <Katex tex="(-90^\circ,90^\circ)" /> 内的值。当 <Katex tex="k<0" /> 时，倾斜角是钝角，要写 <Katex tex="180^\circ+\arctan k" />（结果为钝角），不能直接照抄计算器上的负角。</li>
        <li><strong>提示四：用斜率相等判断平行时漏掉竖直直线。</strong><Katex tex="k_1=k_2" /> 只能说明两条非竖直直线平行或重合；两条竖直直线同样平行，但它们都没有斜率，不能纳入这个判据。</li>
      </ul>
    </div>
    <p>回收与预告：斜率把方向变成一个数，直2 用它写出直线的五种方程；直3 再用两个斜率判断两条直线平行、垂直还是相交。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createInclineSlope } from '../../../boards/linecircle/line/inclineslope.js';
import { LN_CHAPTERS } from './lnav.js';
</script>
