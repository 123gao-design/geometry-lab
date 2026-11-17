<template>
  <ChPage :cur="3" no="等3" base="/sequences/d" :chapters="DQ_CHAPTERS"
    title="等差数列的前 n 项和"
    sub="把正序与倒序两列数按位相加，每一对的和都相同，求和公式随即得到；把每一项画成竖条，台阶又能拼成矩形，同一个公式还有面积一路的读法。"
    :toc="[{ id: 'd3-alg', t: '倒序相加' }, { id: 'd3-area', t: '台阶拼成的矩形' }, { id: 'd3-quad', t: 'Sₙ 是二次函数' }, { id: 'd3-pit', t: '项数、公式选择与条件' }]">
    <div class="note good">等差数列前 <Katex tex="n" /> 项的和有两个常用写法：<Katex tex="S_n=\dfrac{n(a_1+a_n)}{2}" />，以及 <Katex tex="S_n=na_1+\dfrac{n(n-1)}{2}d" />。前者由倒序相加得到，已知首末两项时用；后者由通项代入前者得到，已知首项与公差时用。两者的关系是 <Katex tex="a_n=a_1+(n-1)d" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createReverseAdd" />
      <div class="cap">图 等3a · <b>倒序相加</b>：每一列下方是 <Katex tex="a_k" />（蓝），上方是 <Katex tex="a_{n+1-k}" />（橙），两段拼起来的高度都是 <Katex tex="a_1+a_n" />（金色虚线）。右侧把正序、倒序两式与逐列相加的结果依次写出。拖动「第 k 列」：选中列的上下两段随 k 变化，总高度不变。</div>
    </div>

    <h3 class="sec" id="d3-alg">倒序相加</h3>
    <p>设 <Katex tex="S_n=a_1+a_2+\dots+a_n" />。把同一串数倒着再写一遍：<Katex tex="S_n=a_n+a_{n-1}+\dots+a_1" />。两式按位相加，第 <Katex tex="k" /> 位是 <Katex tex="a_k+a_{n+1-k}" />，由 等2 的下标和性质，每一对都等于 <Katex tex="a_1+a_n" />。共有 <Katex tex="n" /> 对，于是 <Katex tex="2S_n=n(a_1+a_n)" />，<Katex tex="S_n=\dfrac{n(a_1+a_n)}{2}" />。</p>
    <p>图 等3a 的每一列就是其中一「位」：下段取正序的第 <Katex tex="k" /> 项，上段取倒序的同位项，所有列顶齐在金色虚线上，正是「每一对的和相同」的图形版。把 <Katex tex="a_n=a_1+(n-1)d" /> 代入，展开得 <Katex tex="S_n=\dfrac{n[2a_1+(n-1)d]}{2}=na_1+\dfrac{n(n-1)}{2}d" />，这是第二个公式。</p>
    <p>这个推导只用到「配对的两项和相同」，所以它对首末对称配对的数列都成立。等比数列的对应推导要乘而不是加，见 比3 的错位相减。</p>

    <h3 class="sec" id="d3-area">台阶拼成的矩形</h3>
    <div class="board-wrap">
      <BoardMount :factory="createStepLevel" />
      <div class="cap">图 等3b · <b>倒序相加：台阶削平</b>：每一项画成一列竖条，金色矩形的高度取平均高度 <Katex tex="m=\dfrac{a_1+a_n}{2}" />、宽度为 <Katex tex="n" />。竖条高出矩形的部分（绿）与对称位置不足的部分（红）等量，削平后正好填满矩形，面积 <Katex tex="n\cdot m" /> 就是 <Katex tex="S_n" />。拖动「n」与「公差 d」：红绿两块始终等面积。</div>
    </div>
    <p>把每一项画成宽度为 1 的竖条，从左到右排开，条顶连成的折线是台阶形。台阶的面积就是 <Katex tex="S_n" />。取平均高度 <Katex tex="m=\dfrac{a_1+a_n}{2}" /> 作水平线，第 <Katex tex="k" /> 条高出 <Katex tex="m" /> 的部分，与第 <Katex tex="n+1-k" /> 条低于 <Katex tex="m" /> 的部分高度相同，一块凸一块凹，正好互相填平。</p>
    <p>填平以后，台阶变成高 <Katex tex="m" />、宽 <Katex tex="n" /> 的矩形，面积是 <Katex tex="n\cdot\dfrac{a_1+a_n}{2}" />。这与倒序相加是同一件事的两种画法：一个把两列数按位拼成等高条，一个把一列数削成等高条。图 等3a 与图 等3b 并排看，正好互为镜像。</p>

    <h3 class="sec" id="d3-quad">Sₙ 是二次函数</h3>
    <p>把 <Katex tex="S_n=na_1+\dfrac{n(n-1)}{2}d" /> 整理成关于 <Katex tex="n" /> 的多项式：</p>
    <p style="text-align:center"><Katex :tex="'S_n=\\dfrac{d}{2}n^2+\\left(a_1-\\dfrac{d}{2}\\right)n'" display /></p>
    <p>这是 <Katex tex="n" /> 的二次函数，且<strong>常数项为零</strong>。公差 <Katex tex="d>0" /> 时开口向上，<Katex tex="d<0" /> 时向下，<Katex tex="d=0" /> 时退化为一次式 <Katex tex="S_n=na_1" />。反过来，若某个数列的前 n 项和是 <Katex tex="S_n=An^2+Bn" />（无常数项），则该数列为等差数列，公差是 <Katex tex="2A" />，这可以由数3 的作差关系看出：<Katex tex="a_n=S_n-S_{n-1}=2An+(B-A)" />，正是一次式。</p>
    <p>与 E2 二次函数对照：<Katex tex="S_n" /> 的图象是过原点的一列点，落在抛物线 <Katex tex="y=\dfrac{d}{2}x^2+\left(a_1-\dfrac{d}{2}\right)x" /> 上。最值问题只在定义域 <Katex tex="n\in\mathbb{N}^*" /> 上讨论：开口向上求最小、取最近的整数下标，开口向下求最大。这与函数模块里「二次函数在闭区间上求最值」是同一套讨论，只是定义域离散。</p>

    <h3 class="sec" id="d3-pit">项数、公式选择与条件</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：项数是 <Katex tex="n" /> 而不是 <Katex tex="n-1" />。</strong><Katex tex="\dfrac{n(n-1)}{2}" /> 里的 <Katex tex="n-1" /> 来自「首项之外的步数」，前面的 <Katex tex="n" /> 是项数。写 <Katex tex="\dfrac{n(n+1)}{2}" /> 是从 1 加到 n 的和，恰在 <Katex tex="a_1=1,d=1" /> 时对，换个首项就错。</li>
        <li><strong>提示二：两个公式的前提不同。</strong>已知 <Katex tex="a_1" /> 与 <Katex tex="a_n" /> 用第一个，且须先确认 <Katex tex="a_n" /> 的下标正是项数；已知 <Katex tex="a_1" /> 与 <Katex tex="d" /> 用第二个。已知的是某一项（比如 <Katex tex="a_5" />）与公差时，要先回代求出 <Katex tex="a_1" />，不能直接套。</li>
        <li><strong>提示三：<Katex tex="S_n" /> 为二次函数时要求 <Katex tex="d\ne0" /> 与常数项为零。</strong>若题目给出 <Katex tex="S_n=n^2+3" />，常数项不为零，这个 <Katex tex="S_n" /> 对应的数列从第 2 项起才是等差数列，<Katex tex="a_1=S_1=4" /> 与作差得出的首项不一致，须分段处理（数3 已讨论过同一现象）。</li>
        <li><strong>提示四：最值取整数下标。</strong>抛物线顶点在 <Katex tex="n" /> 非整数处时，最值在最近的两个整数下标之一取得，要分别代 <Katex tex="S_n" /> 比较，不能直接把顶点坐标当成答案。</li>
      </ul>
    </div>
    <p>回收与预告：倒序相加的配对思路在 和1 的裂项相消里换成「首尾相消」，在 比3 里换成错位相减；<Katex tex="S_n" /> 与 <Katex tex="a_n" /> 的互相换算已在 数3 建立，这里补上了二次函数这一层。下一子专题 等比数列会把「差恒定」换成「比恒定」，通项从一次函数变成指数式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createReverseAdd } from '../../../boards/sequences/diff/reverseadd.js';
import { createBoard as createStepLevel } from '../../../boards/sequences/diff/steplevel.js';
import { DQ_CHAPTERS } from './dnav.js';
</script>
