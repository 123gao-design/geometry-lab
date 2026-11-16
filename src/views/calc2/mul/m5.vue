<template>
  <ChPage :cur="5" no="微5" base="/calc2/m" :chapters="MD_CHAPTERS"
    title="多元函数的极值"
    sub="一元函数在极值点导数为零，二元函数在极值点梯度为零。但驻点只是嫌疑犯：要区分山顶、谷底与鞍点，得看二阶偏导组成的海塞矩阵。"
    :toc="[{ id: 'm5-stat', t: '驻点与必要条件' }, { id: 'm5-hesse', t: '海塞矩阵判别' }, { id: 'm5-case', t: '四种情形' }, { id: 'm5-bound', t: '有界闭区域上的最值' }, { id: 'm5-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f" /> 在 <Katex tex="P_0" /> 的某邻域内有连续的二阶偏导，且 <Katex tex="f_x(P_0)=f_y(P_0)=0" />。记 <Katex tex="A=f_{xx}" />、<Katex tex="B=f_{xy}" />、<Katex tex="C=f_{yy}" />（均在 <Katex tex="P_0" /> 取值），则：<Katex tex="AC-B^2>0" /> 时是极值点，且 <Katex tex="A>0" /> 为极小、<Katex tex="A<0" /> 为极大；<Katex tex="AC-B^2<0" /> 时不是极值点；<Katex tex="AC-B^2=0" /> 时判别式失效，需另想办法。</div>

    <div class="board-wrap">
      <BoardMount :factory="createExtrema2" />
      <div class="cap">图 微5 · <b>多元函数极值机</b>：等值线地图上一簇灰色箭头是梯度，红色圆点是驻点，黄色是拖动的探针 <Katex tex="P" />。看点：① 箭头都从驻点朝外指，是谷底；② 都朝里指，是山顶；③ 一边朝外一边朝里，两条零值线交叉，是鞍点；④ <Katex tex="f=x^2+y^4" /> 的等值线在原点附近被压得很扁，<Katex tex="C=f_{yy}" /> 在原点为零，判别式读不出来，但函数值仍然处处不小于零。</div>
    </div>

    <h3 class="sec" id="m5-stat">驻点与必要条件</h3>
    <p>若 <Katex tex="f" /> 在 <Katex tex="P_0" /> 取极值且两个偏导数存在，则两个偏导数都为零。理由与一元函数相同：固定 <Katex tex="y=y_0" />，一元函数 <Katex tex="f(x,y_0)" /> 在 <Katex tex="x_0" /> 取极值，故 <Katex tex="f_x(x_0,y_0)=0" />；固定 <Katex tex="x" /> 同理。</p>
    <p>于是 <Katex tex="\nabla f(P_0)=\vec0" /> 是极值的必要条件。满足它的点叫<b>驻点</b>。驻点未必是极值点，鞍面上原点就是驻点，沿 <Katex tex="x" /> 轴走函数上升、沿 <Katex tex="y" /> 轴走函数下降，它既不是山峰也不是谷底。</p>
    <p>还要注意偏导数不存在的点也可能是极值点，例如圆锥面 <Katex tex="z=\sqrt{x^2+y^2}" /> 在原点。作极值问题的第一步，应当把「驻点」与「偏导不存在的点」两类嫌疑一起列出。</p>

    <h3 class="sec" id="m5-hesse">海塞矩阵判别</h3>
    <p>把 <Katex tex="f" /> 在驻点处展开到二阶，就得到判别式的来源：</p>
    <p style="text-align:center"><Katex display tex="\Delta f\approx\frac12\left(A\Delta x^2+2B\Delta x\Delta y+C\Delta y^2\right)." /></p>
    <p>括号里是一个二次型，它的正负决定 <Katex tex="\Delta f" /> 的符号。配方得</p>
    <p style="text-align:center"><Katex display tex="A\Delta x^2+2B\Delta x\Delta y+C\Delta y^2=A\left(\Delta x+\frac{B}{A}\Delta y\right)^2+\frac{AC-B^2}{A}\Delta y^2." /></p>
    <p>当 <Katex tex="AC-B^2>0" /> 时，两项同号，整个二次型在 <Katex tex="A>0" /> 时恒正（极小）、<Katex tex="A<0" /> 时恒负（极大）；当 <Katex tex="AC-B^2<0" /> 时，沿两个方向的符号相反，函数值一升一降，是鞍点。矩阵 <Katex tex="\begin{pmatrix}A&B\\B&C\end{pmatrix}" /> 叫<b>海塞矩阵</b>，<Katex tex="AC-B^2" /> 是它的行列式。</p>
    <p><Katex tex="AC-B^2=0" /> 的情形判别式给不出信息，因为二次型有零特征方向，二阶项不足以定性，要回到函数本身估计。第四个预设 <Katex tex="f=x^2+y^4" /> 就是这一种：在原点 <Katex tex="A=2" />、<Katex tex="B=0" />、<Katex tex="C=0" />，判别式为零，但显然 <Katex tex="f\ge0=f(0,0)" />，仍是极小值。</p>

    <h3 class="sec" id="m5-case">四种情形</h3>
    <ul>
      <li><strong>极小。</strong><Katex tex="f=x^2+y^2" />，<Katex tex="A=C=2" />、<Katex tex="B=0" />，判别式为正且 <Katex tex="A>0" />。等值线是一圈圈同心圆，梯度从原点朝外。</li>
      <li><strong>极大。</strong><Katex tex="f=2-x^2-y^2" />，<Katex tex="A=C=-2" />，判别式为正且 <Katex tex="A<0" />。等值线还是圆，但梯度朝里指。</li>
      <li><strong>鞍点。</strong><Katex tex="f=x^2-y^2" />，<Katex tex="A=2" />、<Katex tex="C=-2" />，判别式为负。两条过原点的直线 <Katex tex="y=\pm x" /> 上函数值为零，把平面分成上升与下降两片。</li>
      <li><strong>判别式失效。</strong><Katex tex="f=x^2+y^4" />，判别式为零。它的极小值沿 <Katex tex="x" /> 方向是二次的、沿 <Katex tex="y" /> 方向是四次的，形状比前三种都尖。</li>
    </ul>
    <p>四种情形的共同点是驻点唯一，都在原点。一般题目里驻点可能有好几个，需要逐个代入判别式，再比较各极大值与极小值的大小。</p>

    <h3 class="sec" id="m5-bound">有界闭区域上的最值</h3>
    <p>求有界闭区域 <Katex tex="D" /> 上连续函数的最值，要做三件事：求 <Katex tex="D" /> 内部的所有驻点与偏导不存在的点；求边界上的最值（用下一章的乘数法，或把边界方程代入化成一元问题）；把候选点的函数值放在一起比较，最大者与最小者即为所求。</p>
    <p>三步里最容易漏的是边界。内部驻点只是「局部」候选，最大值完全可能出现在边界上，而边界上的点梯度不为零，不会被驻点条件抓到。</p>
    <p>如果区域无界或函数不连续，最值可能不存在，此时只能谈极值或上确界。前面微1 结尾提到的闭区域连续函数性质，正是为这一步提供保证。</p>

    <h3 class="sec" id="m5-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把驻点直接当成极值点。</strong>驻点只是梯度为零，鞍点同样满足；必须再代入 <Katex tex="AC-B^2" /> 判别。</li>
        <li><strong>提示二：判别式为零时硬套结论。</strong><Katex tex="AC-B^2=0" /> 时三种情形都可能出现，要回到函数值本身作估计，或考虑更高阶的项。</li>
        <li><strong>提示三：判断极大极小时只看 <Katex tex="A" /> 的符号。</strong><Katex tex="A" /> 的符号只在 <Katex tex="AC-B^2>0" /> 时才有意义；判别式为负时谈 <Katex tex="A" /> 的正负没有用处。</li>
        <li><strong>提示四：求闭区域最值时漏掉边界。</strong>边界上梯度一般不为零，驻点法找不到；先把边界单独处理，再与内部候选一起比较。</li>
      </ul>
    </div>
    <p>回收与预告：闭区域最值里的边界问题还可以再推进一步——边界往往写成一个约束方程，目标函数要在「必须落在约束上」的前提下取极值。下一章的拉格朗日乘数法专门处理这种条件极值。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createExtrema2 } from '../../../boards/calc2/mul/extrema2.js';
import { MD_CHAPTERS } from './mnav.js';
</script>
