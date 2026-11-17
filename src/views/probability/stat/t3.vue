<template>
  <ChPage :cur="3" no="统3" base="/probability/t" :chapters="STAT_CHAPTERS"
    title="一元线性回归"
    sub="把两个变量的数据点画在平面上，若它们有一起变化的趋势，就用一条直线去概括。直线的取法不止一种，最小二乘法给出唯一的一条。"
    :toc="[{ id: 't3-scatter', t: '散点图与相关关系' }, { id: 't3-ls', t: '最小二乘法' }, { id: 't3-use', t: '回归方程的使用' }, { id: 't3-pit', t: '易错点' }]">
    <div class="note good" id="t3-scatter">把成对的数据 <Katex tex="(x_i,y_i)" /> 画在平面直角坐标系中，得到的图形称为<b>散点图</b>。若散点大致分布在一条直线附近，就称两个变量有<b>线性相关关系</b>。这条用来近似代替散点趋势的直线称为<b>回归直线</b>，它的方程称为<b>回归方程</b>。
      设回归方程为 <Katex tex="\hat y=\hat b x+\hat a" />，最小二乘法取使 <Katex tex="\sum(y_i-\hat y_i)^2" /> 最小的 <Katex tex="\hat a" /> 与 <Katex tex="\hat b" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRegress" />
      <div class="cap">图 统3 · <b>一元线性回归</b>：平面上 9 个点，金色点可以拖动，金色直线是回归直线，红色虚线是每个点的竖直残差。看点：拖动金色点，回归直线整体跟着转动，右侧的残差平方和随之改变 —— 无论怎么拖，直线总停在使这个和最小的位置。青色小点是样本中心 <Katex tex="(\bar x,\bar y)" />，回归直线始终经过它，这条性质在后面求系数时直接用到。</div>
    </div>

    <h3 class="sec" id="t3-scatter">散点图与相关关系</h3>
    <p>散点图先看整体形状：点群是否沿一条直线伸展、伸展得多紧、方向是上升还是下降。上升对应正相关，下降对应负相关。这种关系不同于函数关系 —— 给定 <Katex tex="x" /> 并不能唯一确定 <Katex tex="y" />，只能说 <Katex tex="y" /> 的平均水平随 <Katex tex="x" /> 变化。</p>
    <p>相关关系的强弱可以用相关系数 <Katex tex="r" /> 度量（见 数3）。<Katex tex="|r|" /> 接近 1 时点群紧贴直线，接近 0 时点群散成一团。但 <Katex tex="r" /> 只反映线性相关的程度，曲线关系下它可能很小，所以散点图始终要看一眼。</p>

    <h3 class="sec" id="t3-ls">最小二乘法</h3>
    <p>用直线 <Katex tex="\hat y=\hat b x+\hat a" /> 去贴近散点，每个点的偏差是 <Katex tex="y_i-\hat y_i" />。偏差有正有负，直接相加会互相抵消，取绝对值又不便于计算。取平方后求最小值，得到的直线唯一，这种方法称为<b>最小二乘法</b>。</p>
    <p>求导并令导数为零，得到系数的公式：
      <Katex tex="\hat b=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2}=\dfrac{\sum x_iy_i-n\bar x\bar y}{\sum x_i^2-n\bar x^2}" />，
      <Katex tex="\hat a=\bar y-\hat b\bar x" />。第二个式子由「直线过样本中心点」直接得来：把点 <Katex tex="(\bar x,\bar y)" /> 代入 <Katex tex="\hat y=\hat bx+\hat a" /> 就解出 <Katex tex="\hat a" />。这也说明了回归直线为何必然经过这个点。</p>
    <p>两个式子各有便利之处：第一个式子含义清晰（协方差除以自变量的方差），第二个式子计算省事（只需五个和）。用任一个算出 <Katex tex="\hat b" /> 都应得到同一个数，可以互相校验。</p>

    <h3 class="sec" id="t3-use">回归方程的使用</h3>
    <p>回归方程的两个系数各有含义。<Katex tex="\hat b" /> 是自变量的取值每增加一个单位时，因变量的平均水平改变的量；<Katex tex="\hat a" /> 是自变量为零时的预测值，这个数在很多时候没有实际意义（例如身高为零），只作方程的一部分。</p>
    <p>用回归方程作预测，应只限于样本数据覆盖的范围。把 <Katex tex="x" /> 推得很远，直线会给出一个数，但这个数没有任何依据支撑 —— 样本没有提供那段范围内的信息，线性趋势是否延续完全未知。超出样本范围作预测称为外推，风险随距离增大。</p>
    <p>残差平方和与总平方和之比 <Katex tex="R^2=1-\dfrac{\sum(y_i-\hat y_i)^2}{\sum(y_i-\bar y)^2}" /> 度量直线解释了因变量多大比例的波动。一元线性回归中 <Katex tex="R^2=r^2" />，所以相关系数的平方就是这条直线的拟合优度。</p>

    <h3 class="sec" id="t3-pit">易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把回归方程当成函数关系。</strong>回归方程给的是平均水平的预测，个别点与直线有偏差是常态。用方程算出 60 分的学生 75 分，并不意味着这位学生就考 75 分。</li>
        <li><strong>提示二：把相关的方向当成因果的方向。</strong>回归系数大只说明两个变量一起变化，谁引起谁、是否有第三个变量同时影响两者，回归方程都不回答。</li>
        <li><strong>提示三：随意交换自变量与因变量。</strong>把 <Katex tex="y" /> 对 <Katex tex="x" /> 回归和把 <Katex tex="x" /> 对 <Katex tex="y" /> 回归得到的是两条不同的直线（除非所有点共线）。作预测时因变量要选真正想预测的那个。</li>
        <li><strong>提示四：用回归方程外推。</strong>样本只覆盖了一段区间，区间外的趋势没有数据支持。人口、销量这类数据在远处常见转折，直线外推给出的数往往离谱。</li>
      </ul>
    </div>
    <p>回收与预告：从数据算出系数之后，还要判断这个结论是否可靠 —— 观测到的相关会不会只是随机波动的结果。这就是检1 假设检验要回答的问题：先假设两者无关，再看数据造成的偏差有多难用随机波动解释。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRegress } from '../../../boards/probability/stat/regress.js';
import { STAT_CHAPTERS } from './statnav.js';
</script>
