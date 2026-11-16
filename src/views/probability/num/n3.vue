<template>
  <ChPage :cur="3" no="数3" base="/probability/n" :chapters="NUM_CHAPTERS"
    title="协方差与相关系数"
    sub="两个随机变量常常一起变化。协方差把「同时偏离各自期望」的乘积按概率平均，相关系数再把协方差归一，只留下方向与强弱。"
    :toc="[{ id: 'n3-cov', t: '协方差的定义' }, { id: 'n3-quad', t: '四个象限与符号' }, { id: 'n3-rho', t: '相关系数' }, { id: 'n3-pit', t: '不相关不等于独立' }]">
    <div class="note good" id="n3-cov">设 <Katex tex="X" />、<Katex tex="Y" /> 是两个随机变量，则称
      <Katex tex="\operatorname{cov}(X,Y)=E\left[(X-E(X))(Y-E(Y))\right]" /> 为它们的<b>协方差</b>。若 <Katex tex="\operatorname{cov}(X,Y)>0" />，两者有同向变化的倾向；小于零则反向；等于零称<b>不相关</b>。相关系数定义为
      <Katex tex="\rho(X,Y)=\dfrac{\operatorname{cov}(X,Y)}{\sigma(X)\sigma(Y)}" />，它的取值范围是 <Katex tex="[-1,1]" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCovLab" />
      <div class="cap">图 数3 · <b>协方差与相关系数机</b>：平面上撒着 140 组取值，青色虚线是各自的均值线。滑块控制两组数据的相关参数。看点：落在第一、三象限的点「同时偏大」或「同时偏小」，乘积为正，画成金色；落在第二、四象限的点乘积为负，画成蓝色。金色多则协方差为正，蓝色多则为负。右侧两条刻度的圆点位置分别读出协方差与相关系数 —— 协方差随波动大小伸缩，相关系数始终落在 −1 与 1 之间，ρ 接近 ±1 时点几乎排成一条直线。</div>
    </div>

    <h3 class="sec" id="n3-cov">协方差的定义</h3>
    <p>协方差把「同时偏离」写成一个乘积：一个变量高于均值、另一个也高于均值时乘积为正，一高一低时为负。所有情形的乘积再按概率加权平均，正负相抵之后剩下的数就是它们一起变化的程度。展开后得到常用的计算式：
      <Katex tex="\operatorname{cov}(X,Y)=E(XY)-E(X)E(Y)" />。</p>
    <p>由此立即可得：两个变量独立时 <Katex tex="E(XY)=E(X)E(Y)" />，协方差为零。反过来不成立 —— 不相关只说明没有线性关系，变量之间仍可能通过非线性关系联系（见提示二）。</p>
    <p>协方差在方差公式里的角色已经出现过：<Katex tex="D(X+Y)=D(X)+D(Y)+2\operatorname{cov}(X,Y)" />。同向变化时协方差为正，和的波动被放大；反向变化时为负，和的波动反而被抵消。这也是分散投资能降低风险的原理。</p>

    <h3 class="sec" id="n3-quad">四个象限与符号</h3>
    <p>过均值点 <Katex tex="(\bar x,\bar y)" /> 作两条平行于坐标轴的直线，平面被分成四个象限。第一、三象限里的点，两个变量同为正偏离或同为负偏离，乘积为正，对协方差的贡献为正；第二、四象限里的点贡献为负。协方差的符号只取决于哪一类点多、权重更大。</p>
    <p>图 数3 用金色与蓝色把这两类点分开。把滑块推到正的一端，金色点明显占优，点群沿右上到左下的方向拉长；推到负的一端，蓝色点占优，点群沿左上到右下的方向拉长。接近 0 时，两类点数量相当，点群散成一团圆。</p>

    <h3 class="sec" id="n3-rho">相关系数</h3>
    <p>协方差有一个不便之处：它的数值随变量的单位与波动大小改变。把 <Katex tex="X" /> 的单位从米换成厘米，协方差放大 100 倍，可两者的相关程度没有任何变化。除以两个标准差正好消去这种尺度影响：
      <Katex tex="\rho(X,Y)=\dfrac{\operatorname{cov}(X,Y)}{\sigma(X)\sigma(Y)}=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2}\sqrt{\sum(y_i-\bar y)^2}}" />。</p>
    <p><Katex tex="|\rho|\le 1" /> 可由柯西不等式直接得到 —— 把两组偏离看作向量，内积不超过模长之积，等号当且仅当两组偏离成比例时成立。所以 <Katex tex="\rho=\pm1" /> 意味着所有点严格落在一条直线上，<Katex tex="\rho=0" /> 意味着没有线性相关的迹象。</p>
    <p>相关系数是「线性相关」的度量：它只看点是否排成直线，不反映斜率的大小，也不反映曲线关系。一组点沿抛物线整齐排列，相关系数可能接近 0，但两者显然不是毫无关系。</p>

    <h3 class="sec" id="n3-pit">不相关与独立</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把不相关当成独立。</strong>独立必然不相关，不相关却未必独立。例如 <Katex tex="X" /> 在 <Katex tex="[-1,1]" /> 上均匀取值、<Katex tex="Y=X^2" />，算得协方差为零，但 <Katex tex="Y" /> 完全由 <Katex tex="X" /> 决定，绝不独立。</li>
        <li><strong>提示二：用相关系数判断任意关系。</strong><Katex tex="\rho" /> 只度量线性关系。曲线关系下 <Katex tex="\rho" /> 可能很小，不能据此说两变量无关。散点图始终要看一眼。</li>
        <li><strong>提示三：认为相关就是因果。</strong>相关系数大只说明两组数据同步变化，谁引起谁、是否还有第三个变量在起作用，都不由这个数回答。这是统计里最常见的误读。</li>
        <li><strong>提示四：混用总体与样本的记号。</strong>样本相关系数常用 <Katex tex="r" /> 表示，总体用 <Katex tex="\rho" />。样本值只是总体值的估计，样本量小时 r 的波动可以很大。</li>
      </ul>
    </div>
    <p>回收与预告：相关系数为正且接近 1 时，点群沿一条上升的直线分布，这条直线的方程可由最小二乘法求出 —— 这就是 统3 的一元线性回归。协方差为零则回归直线水平，预测值不再随自变量改变。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCovLab } from '../../../boards/probability/num/covlab.js';
import { NUM_CHAPTERS } from './numnav.js';
</script>
