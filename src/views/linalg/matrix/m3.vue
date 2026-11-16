<template>
  <ChPage :cur="3" no="矩3" base="/linalg/m" :chapters="LM_CHAPTERS"
    title="逆矩阵、初等变换与秩"
    sub="初等行变换不改变方程组的解，却能把增广矩阵化成阶梯形；阶梯形上的主元个数就是秩，它一句话说清方程组是有唯一解、无穷多解还是无解。可逆矩阵则是方阵里「能还原」的那一类。"
    :toc="[{ id: 'm3-inv', t: '逆矩阵与可逆判据' }, { id: 'm3-gauss', t: '初等变换与消元' }, { id: 'm3-rank', t: '秩与解的结构' }, { id: 'm3-pit', t: '变换与秩' }]">

    <div class="note good" id="m3-inv"><b>逆矩阵</b>：若方阵 <Katex tex="A" /> 存在方阵 <Katex tex="B" /> 使 <Katex tex="AB=BA=E" />，则称 <Katex tex="A" /> 可逆，<Katex tex="B" /> 唯一，记作 <Katex tex="A^{-1}" />。判据是 <Katex tex="|A|\ne0" />；此时 <Katex tex="A^{-1}=\dfrac{1}{|A|}A^{*}" />，其中 <Katex tex="A^{*}" /> 是代数余子式转置排成的伴随矩阵。</div>

    <div class="board-wrap">
      <BoardMount :factory="createGauss" />
      <div class="cap">图 矩3 · <b>初等变换机</b>：增广矩阵 <Katex tex="(A|b)" /> 的三行四列，主元格标金、正在被改的那一行标蓝。看点：按「下一步」逐次消元，蓝行是怎么被上一行「减掉一个倍数」的；切到「无穷多解」档，阶梯形最后一行整行为零，主元只有两个；切到「无解」档，最后一行变成 <Katex tex="0=1" />，系数全零而常数不为零。</div>
    </div>

    <h3 class="sec" id="m3-inv">逆矩阵与可逆判据</h3>
    <p>数的倒数把乘法还原，矩阵的逆做同一件事：<Katex tex="A^{-1}(Ax)=x" />。可逆与否看行列式——<Katex tex="A^{-1}" /> 存在当且仅当 <Katex tex="|A|\ne0" />。这一点在 行1 已经有了几何解释：行列式是面积（体积）倍数，等于零意味着变换把平面压到了低一维的集合上，压掉的信息无法找回。</p>
    <p>二阶的逆有现成公式：<Katex tex="\begin{bmatrix}a&amp;b\\c&amp;d\end{bmatrix}^{-1}=\dfrac{1}{ad-bc}\begin{bmatrix}d&amp;-b\\-c&amp;a\end{bmatrix}" />，口诀是「主对角互换、副对角变号、除以行列式」。三阶及以上一般不套公式，改用初等变换：把 <Katex tex="(A|E)" /> 化成 <Katex tex="(E|A^{-1})" />，右半边就自动变成逆矩阵。图 矩3 做的正是这套动作，只是右半边换成了常数项。</p>
    <p>逆矩阵的运算规律：<Katex tex="(A^{-1})^{-1}=A" />、<Katex tex="(AB)^{-1}=B^{-1}A^{-1}" />（顺序颠倒，同转置）、<Katex tex="(A^{T})^{-1}=(A^{-1})^{T}" />。第一条说明可逆关系是对称的，第二条与 矩2 的转置穿乘法规则是同一套顺序。</p>

    <h3 class="sec" id="m3-gauss">初等变换与消元</h3>
    <p>三种<b>初等行变换</b>：交换两行、某行乘一个非零数、某行的倍数加到另一行。它们各自都可通过另一种同样类型的变换还原，因此不改变方程组的解集；写成矩阵语言就是「左乘一个可逆的初等矩阵」。</p>
    <p>用三号变换把主元下方的元素逐个消成零，得到<b>行阶梯形</b>：每行第一个非零元素（主元）所在列严格右移，主元下方全为零。再从下往上回代或继续向上消元，得到行最简形，每个主元都是 1 且所在列其余元素为零。</p>
    <p>图 矩3 的每一步都在说明同一件事：变换只是把「哪一个方程减去哪一个方程的几倍」写成矩阵的整行操作。注意「某行乘非零数」这一条里的「非零」不能少——乘零会把整行抹掉，解集随之改变。</p>

    <h3 class="sec" id="m3-rank">秩与解的结构</h3>
    <p>行阶梯形里主元的个数叫矩阵的<b>秩</b>，记作 <Katex tex="r(A)" />，它等于线性无关的行（或列）的最大个数，也等于非零子式的最高阶数。秩刻画矩阵「有效信息的维数」，是行变换下的不变量。</p>
    <p>对 <Katex tex="n" /> 元线性方程组 <Katex tex="Ax=b" />，比较 <Katex tex="r(A)" /> 与 <Katex tex="r(A|b)" /> 就能读出解的结构：<Katex tex="r(A)<r(A|b)" /> 时无解（出现 <Katex tex="0=1" /> 型的矛盾行）；相等且等于 <Katex tex="n" /> 时唯一解；相等且小于 <Katex tex="n" /> 时无穷多解，自由未知量有 <Katex tex="n-r(A)" /> 个。齐次方程组 <Katex tex="Ax=0" /> 永远有零解，<Katex tex="r(A)=n" /> 时只有零解。</p>
    <p>方阵情形可以合并成一句话：<Katex tex="n" /> 阶方阵 <Katex tex="A" /> 可逆 <Katex tex="\iff r(A)=n\iff|A|\ne0\iff Ax=0" /> 只有零解。四个说法互为等价，分别从逆矩阵、秩、行列式、方程组的角度描述同一件事。图 矩3 的三个预设正好对应「秩等于 3」「秩小于 3 且相容」「秩小于 3 且矛盾」三种情形。</p>

    <h3 class="sec" id="m3-pit">变换与秩</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只有行变换不改变解集。</strong>列变换不保持解集（它对应未知量的重新组合），求逆与消元只能做行变换。</li>
        <li><strong>提示二：「乘零」不是初等变换。</strong>某行乘零会把方程抹掉，方程组随之少一个约束，解集变大。乘的数必须非零。</li>
        <li><strong>提示三：秩相同不等于方程同解。</strong>两个方程组可以有相同的秩而解集不同，同解要靠增广矩阵的秩与自由未知量的位置一起判断。</li>
        <li><strong>提示四：<Katex tex="A" /> 可逆时才能两边左乘 <Katex tex="A^{-1}" />。</strong><Katex tex="Ax=b" /> 的解写成 <Katex tex="x=A^{-1}b" /> 需要一个前提：<Katex tex="|A|\ne0" />。不可逆时解要么没有，要么有无穷多个。</li>
      </ul>
    </div>
    <p>回收与预告：本页把矩阵的三种身份串在一条线上——方程组的系数表（矩1）、变换的复合（矩2）、可逆与否由行列式判定（行1、行2）。空1 开始把这三种身份搬到几何图形上，看矩阵如何把方格网拉成平行四边形。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGauss } from '../../../boards/linalg/matrix/gauss.js';
import { LM_CHAPTERS } from './mlnav.js';
</script>
