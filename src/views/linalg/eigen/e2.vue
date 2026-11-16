<template>
  <ChPage :cur="2" no="特2" base="/linalg/e" :chapters="EL_CHAPTERS"
    title="对角化与矩阵的幂"
    sub="把两条特征向量按列拼成一个矩阵，变换就被拆成三步：换到特征基、沿两条轴分别伸缩、再换回来。写成式子就是 A = PDP⁻¹。这个拆法最大的用处，是把矩阵的高次幂化成两个数的幂。"
    :toc="[{ id: 'e2-diag', t: '对角化 A = PDP⁻¹' }, { id: 'e2-basis', t: '换基的几何含义' }, { id: 'e2-pow', t: '矩阵的幂' }, { id: 'e2-pit', t: '可对角化的条件' }]">

    <div class="note good" id="e2-diag">若二阶方阵 <Katex tex="A" /> 有两个线性无关的特征向量 <Katex tex="\vec{v}_1,\vec{v}_2" />，把它们按列拼成 <Katex tex="P=[\vec{v}_1\ \vec{v}_2]" />，则 <Katex tex="P^{-1}AP=\begin{bmatrix}\lambda_1&amp;0\\0&amp;\lambda_2\end{bmatrix}=D" />，等价地 <Katex tex="A=PDP^{-1}" />。这个动作称为把 <Katex tex="A" /> <b>对角化</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createEigenDiag" />
      <div class="cap">图 特2 · <b>对角化机</b>：金色与紫色虚线是两条特征方向，橙色箭头是任取的 <Katex tex="x" />、绿色箭头是它的像 <Katex tex="Ax" />，两条粗折线把 <Katex tex="x" /> 与 <Katex tex="Ax" /> 各自沿特征方向拆成两段。看点：拖 <Katex tex="x" /> 到任意方向，右栏「坐标」一行的两个数就是 <Katex tex="x" /> 在特征基下的分量；变换后同一行的两个数各自乘上 <Katex tex="\lambda_1,\lambda_2" />，交叉项始终为零——这就是 <Katex tex="D" /> 的含意。切到「一个为零」档，绿色像被压到一条直线上。</div>
    </div>

    <h3 class="sec" id="e2-diag">对角化 A = PDP⁻¹</h3>
    <p>把定义式 <Katex tex="A\vec{v}_i=\lambda_i\vec{v}_i" /> 的 <Katex tex="i=1,2" /> 并排写成矩阵形式：</p>
    <p style="text-align:center"><Katex tex="A[\vec{v}_1\ \vec{v}_2]=[\lambda_1\vec{v}_1\ \lambda_2\vec{v}_2]=[\vec{v}_1\ \vec{v}_2]\begin{bmatrix}\lambda_1&amp;0\\0&amp;\lambda_2\end{bmatrix}" display /></p>
    <p>即 <Katex tex="AP=PD" />。只要 <Katex tex="P" /> 可逆（两列线性无关），两边左乘 <Katex tex="P^{-1}" /> 就得到 <Katex tex="P^{-1}AP=D" />。中间那一步之所以能提出来，是因为右端恰好是「每一列各自乘一个数」——这正是对角阵的乘法规则。</p>
    <p>对称矩阵还有一条更强的结论：它的两条特征方向互相垂直，此时 <Katex tex="P" /> 是正交阵，<Katex tex="P^{-1}=P^{T}" />，转置即求逆。图 特2 用的就是这种情形，所以右栏的式子里写的是 <Katex tex="PDP^{T}" />。</p>
    <p>不是所有矩阵都能对角化。判据是「有没有两个线性无关的特征向量」：两个不同特征值一定给出两条不同方向；二重特征值则要独算——剪切矩阵 <Katex tex="\begin{bmatrix}1&amp;1\\0&amp;1\end{bmatrix}" /> 只有一条特征方向，无法对角化。</p>

    <h3 class="sec" id="e2-basis">换基的几何含义</h3>
    <p><Katex tex="A=PDP^{-1}" /> 的三段各有几何身份。<Katex tex="P^{-1}\vec{x}" /> 把点换算到特征基下：得到的是 <Katex tex="\vec{x}" /> 在两条特征方向上的分量长度 <Katex tex="(c_1,c_2)" />，即图 特2 的两条粗折线。<Katex tex="D" /> 在这组坐标里做最省事的动作——两个坐标各自乘一个常数，互不干扰。最后 <Katex tex="P" /> 把这些坐标换回标准基。</p>
    <p>换句话说，同一个变换在不同基下的矩阵不同。在标准基下它是 <Katex tex="A" />，一般有四个非零元素；在特征基下它就是对角阵，只剩下两个数。对角化可以理解为「挑一组让矩阵最简单的基」。</p>
    <p>图 特2 里切到「两轴都伸长」档时 <Katex tex="P" /> 近乎单位阵，<Katex tex="A" /> 本身已经接近对角形；切到「二重根」档，两条特征方向重合，<Katex tex="D" /> 变成纯量阵，此时任何正交方向组都能充当 <Katex tex="P" />——这也是二重根未必能给两条独立方向的另一面。</p>

    <h3 class="sec" id="e2-pow">矩阵的幂</h3>
    <p>对角化的收益立刻体现在幂上。由 <Katex tex="A=PDP^{-1}" /> 连乘：</p>
    <p style="text-align:center"><Katex tex="A^n=(PDP^{-1})(PDP^{-1})\cdots(PDP^{-1})=PD^nP^{-1}=P\begin{bmatrix}\lambda_1^n&amp;0\\0&amp;\lambda_2^n\end{bmatrix}P^{-1}" display /></p>
    <p>中间的 <Katex tex="P^{-1}P" /> 成对消掉，只剩对角阵的幂。求 <Katex tex="A^n" /> 从此只需算两个数的 <Katex tex="n" /> 次方，而不必真的做 <Katex tex="n-1" /> 次矩阵乘法——这正是 矩2 里 <Katex tex="A^k" /> 定义的实际用法。</p>
    <p>举个具体例子：<Katex tex="A=\begin{bmatrix}2&amp;1\\1&amp;2\end{bmatrix}" /> 的特征值是 <Katex tex="3,1" />，特征向量取 <Katex tex="(1,1)" /> 与 <Katex tex="(1,-1)" />，则 <Katex tex="P=\begin{bmatrix}1&amp;1\\1&amp;-1\end{bmatrix}" />、<Katex tex="P^{-1}=\dfrac12\begin{bmatrix}1&amp;1\\1&amp;-1\end{bmatrix}" />，代入即得</p>
    <p style="text-align:center"><Katex tex="A^n=\dfrac12\begin{bmatrix}3^n+1&amp;3^n-1\\3^n-1&amp;3^n+1\end{bmatrix}" display /></p>
    <p>可以代 <Katex tex="n=1,2" /> 验算。<Katex tex="n" /> 很大时对角元 <Katex tex="3^n" /> 压倒常数项，<Katex tex="A^n" /> 的形状趋于 <Katex tex="\dfrac{3^n}{2}\begin{bmatrix}1&amp;1\\1&amp;1\end{bmatrix}" />——剩下的是一个与主特征方向有关的秩一矩阵。这条趋势就是 特3 的内容。</p>

    <h3 class="sec" id="e2-pit">可对角化的条件</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="P" /> 的列是特征向量，不是特征值。</strong>特征值进 <Katex tex="D" /> 的对角线，顺序要与 <Katex tex="P" /> 的列一一对应，写错位整条式子就错。</li>
        <li><strong>提示二：二重根不等于不能对角化。</strong>纯量阵 <Katex tex="2E" /> 有二重根却可以对角化（它本来就是对角阵）；剪切矩阵有二重根却不能。要看特征向量够不够两条。</li>
        <li><strong>提示三：<Katex tex="P^{-1}" /> 不能随手写成 <Katex tex="P^{T}" />。</strong>只有当 <Katex tex="P" /> 的列彼此正交且都是单位向量时才成立，对称矩阵的情形满足，一般矩阵不满足。</li>
        <li><strong>提示四：特征值无实数解时谈不上实对角化。</strong>旋转矩阵的特征值是一对共轭复数，实平面上没有特征方向，<Katex tex="P" /> 无从拼起。</li>
      </ul>
    </div>
    <p>回收与预告：特1 给出两条特征方向，本章把它们拼成 <Katex tex="P" /> 并借它化简幂运算，<Katex tex="\lambda_1^n" /> 与 <Katex tex="\lambda_2^n" /> 的比值决定了长期行为。下一章把这个比值放到图上：反复作用之后，方向为什么必然收敛到主特征方向。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createEigenDiag } from '../../../boards/linalg/eigen/eigendiag.js';
import { EL_CHAPTERS } from './elnav.js';
</script>
