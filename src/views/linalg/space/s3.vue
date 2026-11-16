<template>
  <ChPage :cur="3" no="空3" base="/linalg/s" :chapters="SL_CHAPTERS"
    title="秩、平面与方程组"
    sub="三元一次方程在空间里是一块平面。三条方程联立，就是让求解的点同时落在三块平面上；公共部分只有三种可能：交于一点、交于一条直线、或者根本没有公共点。这三种情形由秩的两个数字分辨。"
    :toc="[{ id: 's3-plane', t: '方程即平面' }, { id: 's3-union', t: '三块平面的公共部分' }, { id: 's3-rank', t: '秩与解的结构' }, { id: 's3-pit', t: '解与公共点' }]">

    <div class="note good" id="s3-plane">方程 <Katex tex="ax+by+cz=d" />（<Katex tex="a,b,c" /> 不全为零）表示一块平面，<Katex tex="\vec{n}=(a,b,c)" /> 是它的法向量。三元线性方程组的解集就是若干块平面的公共部分；把三个方程的系数与常数项排成增广矩阵 <Katex tex="(A|b)" />，比较 <Katex tex="r(A)" /> 与 <Katex tex="r(A|b)" /> 即可判定解的结构。</div>

    <div class="board-wrap">
      <BoardMount :factory="createRankLab" />
      <div class="cap">图 空3 · <b>三平面与解的结构机</b>：蓝、橙、绿三块半透明平面各对应一条方程，金色标记是它们的公共部分。看点：切到「交于一点」档，三个平面在唯一点相遇，秩的两项都读到 3；切到「交于直线」档，第三块平面与第一块重合，公共部分退成一条直线，秩的两项都降到 2；切到「无公共点」档，第三块平面与第一块平行而错开，秩 <Katex tex="r(A|b)" /> 比 <Katex tex="r(A)" /> 大 1。拖「第三个平面常数」滑块，可以让第三块平面连续平移，看到公共部分在这三种情形之间切换。</div>
    </div>

    <h3 class="sec" id="s3-plane">方程即平面</h3>
    <p><Katex tex="ax+by+cz=d" /> 的几何意义在 标2 已经建立：法向量 <Katex tex="\vec{n}=(a,b,c)" /> 垂直于平面内任意两点之差，常数项 <Katex tex="d" /> 决定平面离原点有多远。同一个平面可以写成无穷多种方程——两边乘一个非零数仍然表示它，这与 矩3 的「整行乘非零数不改变解集」是同一件事。</p>
    <p>于是三元方程组有了直接的图像：每一条方程拿出一块平面，满足所有方程的点必须同时落在每一块上。求解不再只是消元，而是在空间里找交集。</p>

    <h3 class="sec" id="s3-union">三块平面的公共部分</h3>
    <p>两块不平行的平面相交于一条直线（图 空3 里蓝橙两块就是这种关系）。第三块平面插进来时，只有三种结局：</p>
    <p><strong>恰好穿过这条直线</strong>——公共部分收缩成一个点，这时三条方程互相独立。<strong>恰好包含这条直线</strong>——公共部分仍是直线，第三块平面没有提供新的约束（在图 空3 里它与第一块重合，属于这种情形的一个特例；两法向量不平行而平面含同一直线的情形也会出现同样结果）。<strong>与这条直线平行且错开</strong>——永远碰不到，方程组无解。</p>
    <p>图 空3 的「无公共点」档就是最后一种：第三块平面与第一块平行，两块的公共集是一条直线，而那条直线整体落在第三块平面的外侧。</p>

    <h3 class="sec" id="s3-rank">秩与解的结构</h3>
    <p>把这三种结局翻译成秩的语言，就得到 矩3 已经写下的判据，只是这次每个数字都有图像：</p>
    <p style="text-align:center"><Katex tex="r(A)=r(A|b)=3\ \Rightarrow\ \text{唯一解};\qquad r(A)=r(A|b)<3\ \Rightarrow\ \text{无穷多解};\qquad r(A)<r(A|b)\ \Rightarrow\ \text{无解}" display /></p>
    <p>秩可以读成「真正独立的约束条数」。三个未知量要定出一个点，需要三条独立约束；能提供的独立约束只有两条，就还剩一个自由度，解集是一条直线；<Katex tex="r(A|b)" /> 比 <Katex tex="r(A)" /> 大，说明常数项那一列带来了系数矩阵无法解释的要求，对应到消元过程就是出现了 <Katex tex="0=\text{非零数}" /> 的矛盾行。</p>
    <p>无穷多解时，解集可以写成一个特解加上齐次解：<Katex tex="\vec{x}=\vec{x}_0+t\vec{\xi}" />，其中 <Katex tex="\vec{\xi}" /> 是那条直线的方向。图 空3 右栏读出的方向向量就是它，<Katex tex="t" /> 每变动一个单位，解沿直线滑过一个方向向量的长度。三条方程互相独立时，恰有一个 <Katex tex="\vec{x}_0" /> 可用。</p>

    <h3 class="sec" id="s3-pit">解与公共点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：两两相交不代表有公共点。</strong>三块平面可以两两交出一条直线，而三条交线互相平行、没有任何公共点。判断要看整体的秩，不能只看每一对。</li>
        <li><strong>提示二：重合的平面不必写成同一个方程。</strong>「两块平面重合」的判据是法向量成比例且常数项同比例，不是方程这一行长得一样。图 空3 的第二档里第三块方程写作 <Katex tex="2x+2y+2z=3" />，与第一块 <Katex tex="x+y+z=1.5" /> 是同一块平面。</li>
        <li><strong>提示三：<Katex tex="r(A)=r(A|b)" /> 只保证有解，不保证解唯一。</strong>唯一解还要 <Katex tex="r(A)" /> 等于未知量个数。少了这一条，会漏掉「无穷多解」这一整类。</li>
        <li><strong>提示四：齐次方程组永远有零解。</strong><Katex tex="r(A)=3" /> 时零解是唯一的解；<Katex tex="r(A)<3" /> 时零解之外还有无穷多个非零解，它们构成一条过原点的直线（或一张过原点的平面）。</li>
      </ul>
    </div>
    <p>回收与预告：秩在 矩3 是阶梯形上的主元个数，在这里是三块平面独立约束的条数，两种读法指的是同一个数。子专题三到此收束——下一章起进入特征值：平面被拉伸时，哪些方向不被转向？</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRankLab } from '../../../boards/linalg/space/ranklab.js';
import { SL_CHAPTERS } from './slnav.js';
</script>
