<template>
  <ChPage :cur="1" no="空1" base="/linalg/s" :chapters="SL_CHAPTERS"
    title="矩阵与二维线性变换"
    sub="矩阵不只是数的方阵。把平面上的每个点都按同一套规则搬到另一个位置，就得到平面到自身的线性变换；这套规则完全由两根基向量各自落到哪里决定，而两列的坐标恰好写成一个矩阵。"
    :toc="[{ id: 's1-def', t: '线性变换与矩阵的列' }, { id: 's1-geo', t: '格网被拉成平行四边形' }, { id: 's1-det', t: '行列式即面积倍数' }, { id: 's1-pit', t: '变换与坐标' }]">

    <div class="note good" id="s1-def">设 <Katex tex="T" /> 是平面到自身的映射，若对任意向量 <Katex tex="\vec{u},\vec{v}" /> 与实数 <Katex tex="\lambda" /> 都有 <Katex tex="T(\vec{u}+\vec{v})=T(\vec{u})+T(\vec{v})" />、<Katex tex="T(\lambda\vec{u})=\lambda T(\vec{u})" />，则称 <Katex tex="T" /> 为<b>线性变换</b>。此时 <Katex tex="T" /> 完全由 <Katex tex="T(e_1)" /> 与 <Katex tex="T(e_2)" /> 决定，把它们按列排起来得到的方阵 <Katex tex="A=[T(e_1)\ T(e_2)]" /> 称为 <Katex tex="T" /> 的矩阵，且 <Katex tex="T(\vec{x})=A\vec{x}" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createGridMap" />
      <div class="cap">图 空1 · <b>二维线性变换</b>：灰色虚线是原来的整数格网，蓝青细线是它的像，金色虚线是原来的单位正方形，蓝（或橙）色块是那个正方形的像。看点：拖 <Katex tex="a,b,c,d" /> 四个元素，两条基向量的像跟着走，整张格网随之被拉斜；切到「投影」档，第二列退化为零向量，面积倍数与行列式一起归零，格网被压成一条直线。</div>
    </div>

    <h3 class="sec" id="s1-def">线性变换与矩阵的列</h3>
    <p>「线性」的两条要求，一条管加法、一条管数乘，合起来就是：<Katex tex="T" /> 保持线性组合。于是任意向量 <Katex tex="\vec{x}=x e_1+y e_2" /> 的像可以直接算出来：</p>
    <p style="text-align:center"><Katex tex="T(\vec{x})=x\,T(e_1)+y\,T(e_2)" display /></p>
    <p>这条式子是整章的枢纽。它说 <Katex tex="T" /> 在每一点上的作用都不需要单独规定——只要知道两根基向量各自的落点，其余点由线性性自动确定。把落点写成列，<Katex tex="T(e_1)=(a,c)" />、<Katex tex="T(e_2)=(b,d)" />，就得到矩阵 <Katex tex="A=\begin{bmatrix}a&amp;b\\c&amp;d\end{bmatrix}" />，而 <Katex tex="A\vec{x}" /> 的乘法规则恰是上式右端。</p>
    <p>反过来，任意一个 <Katex tex="2\times2" /> 矩阵都给出一个线性变换：<Katex tex="\vec{x}\mapsto A\vec{x}" /> 自动满足那两条要求。所以「二阶方阵」与「平面线性变换」是同一批对象的两套写法。图 空1 把它画成了可以拖动的东西：两列就是两根基向量的像，其余全由它们生成。</p>
    <p>几个常见矩阵的几何身份：<Katex tex="\begin{bmatrix}\cos\theta&amp;-\sin\theta\\\sin\theta&amp;\cos\theta\end{bmatrix}" /> 是绕原点旋转 <Katex tex="\theta" />；<Katex tex="\begin{bmatrix}1&amp;k\\0&amp;1\end{bmatrix}" /> 沿 <Katex tex="x" /> 方向剪切；<Katex tex="\begin{bmatrix}s&amp;0\\0&amp;t\end{bmatrix}" /> 沿两轴分别伸缩；<Katex tex="\begin{bmatrix}1&amp;0\\0&amp;0\end{bmatrix}" /> 把整个平面压到 <Katex tex="x" /> 轴上。</p>

    <h3 class="sec" id="s1-geo">格网被拉成平行四边形</h3>
    <p>格网的每一条竖线 <Katex tex="x=k" /> 是「定点加上方向 <Katex tex="e_2" /> 的直线」，线性变换把它送到「像点加上方向 <Katex tex="T(e_2)" /> 的直线」，仍是直线；格线的等距排列也因线性性而保持成等距排列。因此整张方格网必定被映成另一张由两组平行线组成的网，每个小方格映成一个同样大小的平行四边形——这就是图 空1 里蓝青两族线的来源。</p>
    <p>平移不是线性变换：<Katex tex="\vec{x}\mapsto\vec{x}+\vec{b}" /> 把原点搬走了，不满足 <Katex tex="T(0)=0" />。这一条区分了「线性」与「仿射」，也解释了为什么线性变换总把原点固定住。</p>
    <p>复合与乘法在这里对上号：先做 <Katex tex="B" /> 再做 <Katex tex="A" />，结果是 <Katex tex="A(B\vec{x})=(AB)\vec{x}" />。复合的书写顺序与作用顺序相反，正是 矩2 里「不能交换」的几何来源。</p>

    <h3 class="sec" id="s1-det">行列式即面积倍数</h3>
    <p>单位正方形的像是以 <Katex tex="(a,c)" />、<Katex tex="(b,d)" /> 为邻边的平行四边形，它的面积由 行1 已经算过：</p>
    <p style="text-align:center"><Katex tex="S=|ad-bc|=|\det A|" display /></p>
    <p>因为整张格网由单位正方形拼成，任意图形被变换后的面积都乘上同一个常数 <Katex tex="|\det A|" />。图 空1 右栏的「面积倍数」就是它。<Katex tex="\det A>0" /> 时定向保持，<Katex tex="\det A<0" /> 时平面翻了一面（像块画成橙色），两种情形面积都取绝对值。</p>
    <p><Katex tex="\det A=0" /> 意味着两列的像共线，平行四边形退化成一条线段，整个平面被压到一条直线上。这时不同的点可能落到同一处，逆变换不存在——与 矩3 的「<Katex tex="|A|=0" /> 不可逆」是同一句几何话。</p>

    <h3 class="sec" id="s1-pit">变换与坐标</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：矩阵的列不是矩阵的行。</strong>变换把 <Katex tex="e_1" /> 送到第一列 <Katex tex="(a,c)" />，不是第一行 <Katex tex="(a,b)" />。写反了整张格网的方向就错。</li>
        <li><strong>提示二：<Katex tex="A\vec{x}" /> 与 <Katex tex="\vec{x}A" /> 不是一回事。</strong>前者是矩阵作用在列向量上，后者要求 <Katex tex="\vec{x}" /> 写成行向量并在右侧相乘，得到的是行向量的线性组合。中学阶段一律用左乘列向量。</li>
        <li><strong>提示三：面积倍数取绝对值，不取符号。</strong>负的行列式表示翻面，不是负面积。只有在计算有向面积时才带符号。</li>
        <li><strong>提示四：线性变换一定固定原点。</strong>图形整体挪位是平移，不是线性变换，它的矩阵写法要么不存在，要么得用齐次坐标多带一维。</li>
      </ul>
    </div>
    <p>回收与预告：行1 用行列式量面积，这里把它接上了变换；矩2 的复合在这里变成了格网的连续拉斜。下一个问题更具体——平面被拉斜时，有没有一些方向只被伸缩、不被转向？这样的方向叫特征方向，是 特1 的主题；而三维版本就在 空2。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGridMap } from '../../../boards/linalg/space/gridmap.js';
import { SL_CHAPTERS } from './slnav.js';
</script>
