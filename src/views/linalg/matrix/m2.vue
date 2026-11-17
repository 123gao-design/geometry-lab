<template>
  <ChPage :cur="2" no="矩2" base="/linalg/m" :chapters="LM_CHAPTERS"
    title="矩阵乘法与转置"
    sub="矩阵乘法不是逐格相乘，而是「左矩阵的一行乘右矩阵的一列再求和」。这条规则让矩阵对应线性变换的复合，也带来三件反直觉的事：不能交换、不能消去、两个非零矩阵相乘可能是零。"
    :toc="[{ id: 'm2-def', t: '乘法的定义' }, { id: 'm2-law', t: '运算律与新规矩' }, { id: 'm2-t', t: '转置与乘法' }, { id: 'm2-pit', t: '三条反直觉' }]">

    <div class="note good" id="m2-def">设 <Katex tex="A" /> 是 <Katex tex="m\times s" /> 矩阵、<Katex tex="B" /> 是 <Katex tex="s\times n" /> 矩阵，则乘积 <Katex tex="AB" /> 是 <Katex tex="m\times n" /> 矩阵，其第 <Katex tex="i" /> 行第 <Katex tex="j" /> 列的元素为 <Katex tex="c_{ij}=\sum_{k=1}^{s}a_{ik}b_{kj}" />。左矩阵的列数必须等于右矩阵的行数，乘法才有意义。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMatMul" />
      <div class="cap">图 矩2 · <b>矩阵乘法</b>：上方算 <Katex tex="AB" />，被选中的行染蓝、被选中的列染橙，落点在 <Katex tex="C" /> 里被绿框圈出；下方对同一对矩阵算出 <Katex tex="BA" />。看点：拖 <Katex tex="k" /> 扫过四个元素，每次只看一行一列，乘加两步就得到一个格子；切到「单位阵」档，<Katex tex="AE=EA=A" />；切回「一般」档，<Katex tex="BA" /> 与 <Katex tex="AB" /> 的同一个位置一般不同。</div>
    </div>

    <h3 class="sec" id="m2-def">乘法的定义</h3>
    <p>规则可以背成「行乘列」：结果的第 <Katex tex="i" /> 行第 <Katex tex="j" /> 列，是左矩阵第 <Katex tex="i" /> 行的 <Katex tex="s" /> 个数与右矩阵第 <Katex tex="j" /> 列的 <Katex tex="s" /> 个数逐项相乘再相加。这个和式的下标 <Katex tex="k" /> 被两侧共用，形状上的限制就来自它：只有列数等于行数，公共下标才有意义。</p>
    <p>为什么这样定义？因为它正好对应线性变换的复合。把 <Katex tex="B" /> 看成先作用的变换、<Katex tex="A" /> 看成后作用的变换，向量先被 <Katex tex="B" /> 送到 <Katex tex="Bx" />，再被 <Katex tex="A" /> 送到 <Katex tex="A(Bx)" />，而这个结果恰好等于 <Katex tex="(AB)x" />。复合里的「后作用者写在左边」正是乘法不可交换的几何来源，空1 会把这件事画出来。</p>
    <p>几个立即成立的特例：单位阵 <Katex tex="AE=EA=A" />；零矩阵乘任何矩阵得零矩阵；对角阵相乘是把对应位置的对角元相乘。</p>

    <h3 class="sec" id="m2-law">运算律与新规矩</h3>
    <p>矩阵乘法满足<b>结合律</b> <Katex tex="(AB)C=A(BC)" /> 与<b>分配律</b> <Katex tex="A(B+C)=AB+AC" />、<Katex tex="(A+B)C=AC+BC" />，与数乘也相容：<Katex tex="\lambda(AB)=(\lambda A)B=A(\lambda B)" />。这些规律和数的乘法一样，所以矩阵可以像多项式那样展开、提取公因式。</p>
    <p>不成立的规律有三条，恰好是数的乘法里最随手的：<b>交换律</b>一般不成立，<Katex tex="AB\ne BA" />；<b>消去律</b>不成立，<Katex tex="AB=AC" /> 推不出 <Katex tex="B=C" />；<b>无零因子</b>不成立，<Katex tex="A\ne O" />、<Katex tex="B\ne O" /> 而 <Katex tex="AB=O" />。图 矩2 的「一般」档就能看到前一条：换序之后四个格子几乎逐个不同。</p>
    <p>方阵的幂由此定义：<Katex tex="A^2=AA" />、<Katex tex="A^{k+1}=A^kA" />，注意 <Katex tex="A^0=E" />。<Katex tex="A^k" /> 就是同一个变换作用 <Katex tex="k" /> 次，特2、特3 用它讨论长期行为——特征值决定反复作用后是放大、缩小还是转向。</p>

    <h3 class="sec" id="m2-t">转置与乘法</h3>
    <p>转置穿过加法不换序，穿过乘法就要换序：<Katex tex="(AB)^{T}=B^{T}A^{T}" />。取一个元素验证：左边第 <Katex tex="i" /> 行第 <Katex tex="j" /> 列等于 <Katex tex="AB" /> 的第 <Katex tex="j" /> 行第 <Katex tex="i" /> 列，即 <Katex tex="\sum_k a_{jk}b_{ki}" />；右边对应位置是 <Katex tex="B^{T}" /> 的第 <Katex tex="i" /> 行与 <Katex tex="A^{T}" /> 的第 <Katex tex="j" /> 列之积，也就是 <Katex tex="\sum_k b_{ki}a_{jk}" />，两个和式逐项相同。</p>
    <p>形状上也必须换序：<Katex tex="A" /> 是 <Katex tex="m\times s" />、<Katex tex="B" /> 是 <Katex tex="s\times n" /> 时，<Katex tex="AB" /> 是 <Katex tex="m\times n" />，它的转置是 <Katex tex="n\times m" />；<Katex tex="B^{T}" /> 是 <Katex tex="n\times s" />、<Katex tex="A^{T}" /> 是 <Katex tex="s\times m" />，正好能乘出 <Katex tex="n\times m" />，而写成 <Katex tex="A^{T}B^{T}" /> 连形状都对不上。</p>
    <p>对称矩阵指 <Katex tex="A^{T}=A" /> 的方阵，反对称矩阵指 <Katex tex="A^{T}=-A" />。任意方阵都能拆成一个对称阵与一个反对称阵之和：<Katex tex="A=\dfrac{A+A^{T}}{2}+\dfrac{A-A^{T}}{2}" />。这个拆法在 型1 会把二次型的矩阵取成对称阵，从而让交叉项只有一个系数。</p>

    <h3 class="sec" id="m2-pit">三条反直觉</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：顺序不能换。</strong><Katex tex="(A+B)^2=A^2+AB+BA+B^2" />，一般不等于 <Katex tex="A^2+2AB+B^2" />；只有 <Katex tex="A" />、<Katex tex="B" /> 可交换时才能合并成一项。</li>
        <li><strong>提示二：没有消去律。</strong><Katex tex="AB=AC" /> 只能推出 <Katex tex="A(B-C)=O" />。要消去 <Katex tex="A" />，必须额外知道 <Katex tex="|A|\ne0" />（此时有逆矩阵，见 矩3）。</li>
        <li><strong>提示三：两个非零矩阵相乘可能为零。</strong>例：<Katex tex="\begin{bmatrix}0&amp;1\\0&amp;0\end{bmatrix}^2=O" />。这说明存在非零矩阵没有乘法逆元，与「<Katex tex="|A|=0" /> 时不可逆」是同一件事。</li>
        <li><strong>提示四：转置的位置别写反。</strong><Katex tex="(ABC)^{T}=C^{T}B^{T}A^{T}" />，整体倒序，不是只把首尾对调。</li>
      </ul>
    </div>
    <p>回收与预告：乘法把「先做哪个变换」的顺序编码进了矩阵。这引出一个问题——有没有一组方向，使得变换在这些方向上只伸缩、不转向？那就是特征方向，是 特1 的内容；能把这些方向凑成一组基时，矩阵就被压成对角形。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMatMul } from '../../../boards/linalg/matrix/matmul.js';
import { LM_CHAPTERS } from './mlnav.js';
</script>
