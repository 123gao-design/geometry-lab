<template>
  <ChPage :cur="1" no="恒1" base="/combinatorics/i" :chapters="CI_CHAPTERS"
    title="帕斯卡恒等式与网格路径"
    sub="在方格纸上从一角走到对角，每步只许向右或向上，走的条数就是组合数。每个格点上的数等于左边与下边两个数之和，帕斯卡恒等式因此成了一张加法表。"
    :toc="[{ id: 'i1-path', t: '路径与组合数' }, { id: 'i1-grid', t: '格点上的加法' }, { id: 'i1-use', t: '恒等式的两种用法' }, { id: 'i1-pit', t: '步数与下标' }]">
    <div class="note good" id="i1-path">从 <Katex tex="(0,0)" /> 走到 <Katex tex="(m,n)" />，每步只向右或向上，共 <Katex tex="m+n" /> 步，其中 <Katex tex="m" /> 步向右。选定哪几步向右即确定一条路径，故路径数为 <Katex tex="\mathrm{C}_{m+n}^{\,m}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPascalId" />
      <div class="cap">图 恒1 · <b>帕斯卡恒等式与网格路径</b>：格点上的数是从原点走到该点的路径条数，金色折线是其中一条具体走法。看点：到终点前的一个格点标蓝，终点的数由这两个蓝数相加得到；拖 <Katex tex="m" />、<Katex tex="n" /> 改变网格大小，加法关系一直成立。</div>
    </div>

    <h3 class="sec" id="i1-path">路径与组合数</h3>
    <p>一条路径由「右」和「上」两种步拼成，总步数固定为 <Katex tex="m+n" />，向右的步数固定为 <Katex tex="m" />。路径与「哪些步向右」的选择一一对应，所以条数是组合数。这也解释了为什么 <Katex tex="\mathrm{C}_{m+n}^{m}=\mathrm{C}_{m+n}^{\,n}" />：数向右的步与数向上的步是同一件事。</p>
    <p>反过来，很多组合问题能画成这种网格。例如从 5 名男生、3 名女生中依次选出若干人，或者一个数列的递增条件与坐标增量对应，都能把计数转成数路径。</p>

    <h3 class="sec" id="i1-grid">格点上的加法</h3>
    <p>走到 <Katex tex="(m,n)" /> 的最后一步只有两种可能：从左边 <Katex tex="(m-1,n)" /> 向右迈进，或从下边 <Katex tex="(m,n-1)" /> 向上迈进。两条来路不重叠，路径数相加，于是每个格点上的数等于左边与下边两数之和。这就是帕斯卡恒等式 <Katex tex="\mathrm{C}_n^k=\mathrm{C}_{n-1}^{k-1}+\mathrm{C}_{n-1}^k" />，换个说法而已。</p>
    <p>把这张表整个写出来，就是杨辉三角斜着摆开。图 恒1 的终点点亮金色、两个前驱点亮蓝色，三个数相加的关系一眼可见；网格扩到 5×5 时，中间的数已经长到 252。</p>

    <h3 class="sec" id="i1-use">恒等式的两种用法</h3>
    <p>顺着用：由小规模的结果推出大规模的结果。杨辉三角逐行推、组合数逐项算，都是这条恒等式的反复应用。手算 <Katex tex="\mathrm{C}_{10}^{5}" /> 时，用肩上两数相加往往比连乘更快。</p>
    <p>逆着用：把一项拆成两项之和，用于化简与证明。要证某个和式等于一个组合数，通常把右边拆开，凑出递推结构，再用归纳收尾。拆的方向按「指定的一个元素取没取」决定，两项分别对应取与不取。</p>

    <h3 class="sec" id="i1-pit">步数与下标</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：总步数是 m+n，不是 m·n。</strong>两条边的长度相加才是步数，网格面积与步数无关。</li>
        <li><strong>提示二：组合数下标取总步数。</strong><Katex tex="\mathrm{C}_{m+n}^{m}" /> 的下标是 <Katex tex="m+n" />，上标取任意一个方向的步数，取 <Katex tex="m" /> 或 <Katex tex="n" /> 都行。</li>
        <li><strong>提示三：只能向右或向上，不能回头。</strong>允许向左或向下时路径数不有限制，组合数公式失效；只能走一格、不许跳时，网格的格点连接方式要先画清楚。</li>
        <li><strong>提示四：障碍格要扣除。</strong>网格里挖掉一个点，路径数不再是一个组合数，得用容斥或分段计数，别硬套公式。</li>
      </ul>
    </div>
    <p>回收与预告：项2 的杨辉三角在这里找到了几何解释，加法关系从数字变成了走路的条数。恒2 转向展开式的另一头：把后面的项当作余项舍去或除以模数，得到近似值与整除结论。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPascalId } from '../../../boards/combinatorics/identity/pascalid.js';
import { CI_CHAPTERS } from './cinav.js';
</script>
