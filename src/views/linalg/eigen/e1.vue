<template>
  <ChPage :cur="1" no="特1" base="/linalg/e" :chapters="EL_CHAPTERS"
    title="特征值与特征向量"
    sub="平面被拉斜时，大多数方向都会转一个角度。偏偏存在一些方向，变换只把它们伸长或缩短，方向原样保留——这些方向叫特征方向，伸缩的倍数叫特征值。它们由一条二次方程全部给出。"
    :toc="[{ id: 'e1-def', t: '定义与特征方程' }, { id: 'e1-geo', t: '几何意义：只伸缩不转向' }, { id: 'e1-calc', t: '求法与两条恒等式' }, { id: 'e1-pit', t: '特征值与方向' }]">

    <div class="note good" id="e1-def">设 <Katex tex="A" /> 是二阶方阵。若存在非零向量 <Katex tex="\vec{v}" /> 与实数 <Katex tex="\lambda" />，使 <Katex tex="A\vec{v}=\lambda\vec{v}" />，则称 <Katex tex="\lambda" /> 是 <Katex tex="A" /> 的<b>特征值</b>，<Katex tex="\vec{v}" /> 是对应于 <Katex tex="\lambda" /> 的<b>特征向量</b>。把式子移项得 <Katex tex="(A-\lambda E)\vec{v}=0" />，它有非零解当且仅当 <Katex tex="|A-\lambda E|=0" />，展开就是<b>特征方程</b> <Katex tex="\lambda^2-\mathrm{tr}(A)\lambda+\det A=0" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createEigen2D" />
      <div class="cap">图 特1 · <b>特征方向机</b>：灰色虚线是单位圆，蓝色曲线是它的像；金、紫两条虚线是特征方向，粗箭头是基向量的像。看点：切到「对角伸缩」档，两条特征方向就是两条坐标轴；切到「一般矩阵」档，两条特征方向斜着摆，而椭圆的两条轴恰好压在它们身上；切到「旋转」档，椭圆与圆同心，判别式小于零，一条实特征方向也没有。</div>
    </div>

    <h3 class="sec" id="e1-def">定义与特征方程</h3>
    <p>式子的含义值得逐字读：<Katex tex="A\vec{v}" /> 是 <Katex tex="\vec{v}" /> 的像，<Katex tex="\lambda\vec{v}" /> 是与 <Katex tex="\vec{v}" /> 同向的向量。两者相等，说明像与自身共线——变换没有改变这个方向，只改变了长度，倍数正是 <Katex tex="\lambda" />。若 <Katex tex="\lambda>0" />，方向不变；若 <Katex tex="\lambda<0" />，方向反向；若 <Katex tex="\lambda=0" />，像缩成原点。</p>
    <p>把 <Katex tex="A\vec{v}=\lambda\vec{v}" /> 改写为齐次方程组 <Katex tex="(A-\lambda E)\vec{v}=0" />。它总以 <Katex tex="\vec{v}=0" /> 为解，而定义要求非零解，于是由 矩3 的结论，系数行列式必须为零。二阶展开：</p>
    <p style="text-align:center"><Katex tex="\begin{vmatrix}a-\lambda&amp;b\\c&amp;d-\lambda\end{vmatrix}=(a-\lambda)(d-\lambda)-bc=\lambda^2-(a+d)\lambda+(ad-bc)=0" display /></p>
    <p>就是 <Katex tex="\lambda^2-\mathrm{tr}\,A\cdot\lambda+\det A=0" />。求特征值从此不必解方程组，只要读迹与行列式。</p>

    <h3 class="sec" id="e1-geo">几何意义：只伸缩不转向</h3>
    <p>把单位圆的所有点按 <Katex tex="A" /> 搬过去，得到的是一条椭圆（退化时是线段或圆）。椭圆的长轴、短轴所在方向，就是两条特征方向：沿单位圆上这两点出发的向量，像仍然落在同一条射线上，长度变成原来的 <Katex tex="|\lambda|" /> 倍。图 特1 里金色与紫色的粗箭头正是这件事——从原点出发的金箭头与金虚线重合。</p>
    <p>于是特征值有两个读法：一是「椭圆半轴的长度」，二是「沿这个方向伸缩的倍数」。前者给出大小，后者给出正负——半轴长度只能非负，符号要回到 <Katex tex="A\vec{v}=\lambda\vec{v}" /> 里看像与 <Katex tex="\vec{v}" /> 同向还是反向。</p>
    <p>如果矩阵是旋转，椭圆与圆重合，每个方向都只能被「转到别处」，没有一条射线是稳定的。这时特征方程无实根，判别式小于零，两个特征值是一对共轭复数——中学阶段只需要知道「无实特征值」这个结论。</p>

    <h3 class="sec" id="e1-calc">求法与两条恒等式</h3>
    <p>求解步骤固定：写出特征方程 → 解出 <Katex tex="\lambda_1,\lambda_2" /> → 对每个特征值解齐次方程组 <Katex tex="(A-\lambda E)\vec{v}=0" />，取一个非零解。特征向量只能定到倍数，所以通常取整数的那个。</p>
    <p>两根与系数之间有两条恒等式，用来验算十分省力：</p>
    <p style="text-align:center"><Katex tex="\lambda_1+\lambda_2=\mathrm{tr}\,A=a+d,\qquad \lambda_1\lambda_2=\det A=ad-bc" display /></p>
    <p>它们与 次1 的韦达定理是同一件事，只是换了对象。第二式还能读出一层几何：<Katex tex="\det A" /> 是面积倍数，而它等于两个伸缩倍数之积——沿两条特征方向各乘 <Katex tex="\lambda_1,\lambda_2" />，面积自然乘上两者之积。这条解释把 空1 的面积倍数与本章接了起来。</p>
    <p>推论：<Katex tex="\det A=0" /> 时至少有一个特征值为零，说明某个方向被压到原点（图 特1 里「剪切」档的判别式为零，出现的是二重根）；<Katex tex="\mathrm{tr}\,A=0" /> 且 <Katex tex="\det A<0" /> 时两特征值一正一负，和为零，平面在某方向上被翻过来。</p>

    <h3 class="sec" id="e1-pit">特征值与方向</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：特征向量必须非零。</strong><Katex tex="\vec{v}=0" /> 对任何 <Katex tex="\lambda" /> 都成立，若允许零向量，特征值就无从定义了。</li>
        <li><strong>提示二：特征向量不唯一。</strong>若 <Katex tex="\vec{v}" /> 是特征向量，则 <Katex tex="k\vec{v}" />（<Katex tex="k\ne0" />）也是。所以所谓「求特征向量」求的是一条方向，不是一个点。图 特1 画出整条虚线，而不只是箭头端点。</li>
        <li><strong>提示三：不同特征值的特征向量线性无关。</strong>反过来不成立：二重特征值也可能只给出一条特征方向（剪切矩阵就是），这种矩阵不能对角化，是 特2 要处理的例外。</li>
        <li><strong>提示四：<Katex tex="A^2" /> 的特征值是 <Katex tex="\lambda^2" />，不是 <Katex tex="2\lambda" />。</strong>由 <Katex tex="A\vec{v}=\lambda\vec{v}" /> 两边同乘 <Katex tex="A" /> 即得。<Katex tex="A+kE" /> 的特征值才是 <Katex tex="\lambda+k" />。</li>
      </ul>
    </div>
    <p>回收与预告：<Katex tex="\det A=\lambda_1\lambda_2" /> 把面积倍数解释成两个伸缩倍数的乘积，行1 与 空1 的结论在这里汇合。下一章把这组特征方向拼成一个矩阵，<Katex tex="A" /> 就被拆成三段，矩阵的幂也随之变得容易。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createEigen2D } from '../../../boards/linalg/eigen/eigen2d.js';
import { EL_CHAPTERS } from './elnav.js';
</script>
