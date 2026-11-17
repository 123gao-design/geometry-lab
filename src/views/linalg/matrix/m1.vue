<template>
  <ChPage :cur="1" no="矩1" base="/linalg/m" :chapters="LM_CHAPTERS"
    title="矩阵的概念与线性运算"
    sub="矩阵是一张按行列排好的数表。它既可以是方程组的系数表，也可以是一个把平面拉到另一个位置的变换。加法与数乘是最浅一层的运算：格子对格子，形状必须一样。"
    :toc="[{ id: 'm1-def', t: '矩阵与它的形状' }, { id: 'm1-add', t: '加法与数乘' }, { id: 'm1-sq', t: '方阵、单位阵与转置' }, { id: 'm1-pit', t: '形状与顺序' }]">

    <div class="note good" id="m1-def">由 <Katex tex="m\times n" /> 个数排成的 <Katex tex="m" /> 行 <Katex tex="n" /> 列的数表叫 <Katex tex="m\times n" /> 矩阵，记作 <Katex tex="A=(a_{ij})" />，其中 <Katex tex="a_{ij}" /> 是第 <Katex tex="i" /> 行第 <Katex tex="j" /> 列的元素。两个矩阵相等，当且仅当它们同型且对应位置的元素全部相等。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMatAdd" />
      <div class="cap">图 矩1 · <b>矩阵的线性运算</b>：蓝框是 <Katex tex="A" />、橙框是 <Katex tex="B" />、绿框是结果，细虚线连起对应的格子。看点：切到 <Katex tex="A+B" /> 与 <Katex tex="A-B" />，只有格子里的数在变，位置一律不动；切到 <Katex tex="\lambda A" /> 后拖 <Katex tex="\lambda" />，整张表同时缩放，<Katex tex="\lambda" /> 取负时每个元素连符号一起翻；切到 <Katex tex="A^{T}" />，连线变成「行列对调」的交叉。</div>
    </div>

    <h3 class="sec" id="m1-def">矩阵与它的形状</h3>
    <p>矩阵的大小写成「行数 × 列数」，只与行列数有关，与里面的数无关。<Katex tex="2\times3" /> 矩阵有 2 行 3 列，共 6 个元素。行数与列数相等的矩阵叫方阵，<Katex tex="n" /> 阶方阵有 <Katex tex="n^2" /> 个元素。</p>
    <p>同一个数表可以有两种读法，这两种读法后面都会反复用到。一是<b>数据表</b>：第 <Katex tex="i" /> 行第 <Katex tex="j" /> 列的元素代表「第 <Katex tex="i" /> 个对象在第 <Katex tex="j" /> 项上的取值」，比如成绩表、列联表（第 独立性检验 一章的两行两列表就是 <Katex tex="2\times2" /> 矩阵）。二是<b>方程组的系数表</b>：<Katex tex="m" /> 个方程 <Katex tex="n" /> 个未知量的系数正好排成 <Katex tex="m\times n" /> 矩阵，右端常数另成一列，拼起来就是增广矩阵。</p>
    <p>还有一种读法要到 空1 才展开：矩阵是一个把向量送到向量的规则，第 <Katex tex="j" /> 列就是基向量 <Katex tex="e_j" /> 的像。这种看法让矩阵有了几何身份，也是特征值与二次型的出发点。</p>

    <h3 class="sec" id="m1-add">加法与数乘</h3>
    <p><b>加法</b>只对同型矩阵定义：<Katex tex="(A+B)_{ij}=a_{ij}+b_{ij}" />，逐格相加。加法满足交换律与结合律，有零矩阵 <Katex tex="O" /> 作为零元，有 <Katex tex="-A" /> 作为相反元，于是矩阵的加法构成一个可交换的群。<b>数乘</b>是每个元素同乘一个数：<Katex tex="(\lambda A)_{ij}=\lambda a_{ij}" />，形状不变、整表缩放。</p>
    <p>两条运算合起来叫<b>线性运算</b>，满足八条规律：加法的交换、结合、零元、负元，数乘的单位元、结合、以及两条分配律。这八条不需要死记，它们与实数、与向量的运算法则完全同构（第 向1 的加法法则机画的也是同一个结构）。</p>
    <p>线性运算的形状限制要看清：<Katex tex="2\times3" /> 矩阵不能与 <Katex tex="3\times2" /> 矩阵相加，哪怕元素个数相同。形状不同就没有「对应位置」这回事。</p>

    <h3 class="sec" id="m1-sq">方阵、单位阵与转置</h3>
    <p>把矩阵的行写成列、列写成行，得到的 <Katex tex="n\times m" /> 矩阵叫 <Katex tex="A" /> 的<b>转置</b>，记作 <Katex tex="A^{T}" />，即 <Katex tex="(A^{T})_{ij}=a_{ji}" />。几何上看是把整张表沿主对角线翻过去：第 1 行变成第 1 列，第 3 行第 2 列的元素跑到第 2 行第 3 列。两次转置回到原矩阵，<Katex tex="(A^{T})^{T}=A" />。</p>
    <p>方阵里最特殊的是<b>单位阵</b> <Katex tex="E" />（也写作 <Katex tex="I" />）：主对角线全是 1，其余全是 0。它满足 <Katex tex="AE=EA=A" />，作用相当于乘法里的 1。对角线上元素全不为零的对角阵 <Katex tex="\operatorname{diag}(\lambda_1,\dots,\lambda_n)" /> 只在各个方向上独立缩放，第 特2 的对角化就是要把一般矩阵化成这个形状。</p>
    <p>方阵的两个常用记号：<b>迹</b> <Katex tex="\operatorname{tr}A=\sum_i a_{ii}" />（对角元之和）与<b>行列式</b> <Katex tex="|A|" />（行1、行2 已经算过）。这两个数在 特1 与 型3 里由特征值给出新的解释：迹等于特征值之和，行列式等于特征值之积。</p>

    <h3 class="sec" id="m1-pit">形状与顺序</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：形状不对就不能加。</strong><Katex tex="2\times3" /> 与 <Katex tex="3\times2" /> 元素个数相同却不能相加；转置之后形状才对得上。</li>
        <li><strong>提示二：数乘不是乘方。</strong><Katex tex="\lambda A" /> 是每个元素乘 <Katex tex="\lambda" />；<Katex tex="A^2" /> 是 <Katex tex="A" /> 与自己相乘，两者完全不同（<Katex tex="A^2" /> 见 矩2）。</li>
        <li><strong>提示三：<Katex tex="(A+B)^{T}=A^{T}+B^{T}" />，但乘法要换序。</strong>转置能穿过加法，穿过乘法时顺序颠倒：<Katex tex="(AB)^{T}=B^{T}A^{T}" />。这条在 矩2 会再验一次。</li>
        <li><strong>提示四：零矩阵不是数零。</strong>零矩阵的每个元素都是零，它与任何同型矩阵相加都不变；但零矩阵乘上别的矩阵，形状还要满足乘法规则。</li>
      </ul>
    </div>
    <p>回收与预告：本页的加法与数乘是「格子对格子」。真正的乘法要复杂一步——左矩阵的一行乘右矩阵的一列再求和，形状对不上就根本乘不起来。这是 矩2 的内容，也是线性变换复合的代数版本。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMatAdd } from '../../../boards/linalg/matrix/matadd.js';
import { LM_CHAPTERS } from './mlnav.js';
</script>
