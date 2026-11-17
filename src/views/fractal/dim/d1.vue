<template>
  <ChPage :cur="1" no="维1" base="/fractal/d" :chapters="FS_CHAPTERS"
    title="自相似集"
    sub="把整体缩小若干份，再原样拼回去，得到的是同一个形状。这种「整体是自身的若干缩印」的集合叫自相似集，分形几何从这里起步。"
    :toc="[{ id: 'd1-def', t: '定义与三个例子' }, { id: 'd1-map', t: '压缩映射与不变集' }, { id: 'd1-osc', t: '开集条件' }, { id: 'd1-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="K" /> 是紧集。若存在相似映射 <Katex tex="S_i(x)=r_iOx+b_i" />（<Katex tex="0&lt;r_i&lt;1" />，<Katex tex="O" /> 为正交矩阵，<Katex tex="i=1,\dots,N" />），使 <Katex display tex="K=S_1(K)\cup S_2(K)\cup\cdots\cup S_N(K)," /> 则称 <Katex tex="K" /> 为<b>自相似集</b>，<Katex tex="r_i" /> 为各副本的<b>相似比</b>。各 <Katex tex="r_i" /> 相等为 <Katex tex="r" /> 时，由 <Katex tex="N r^{D}=1" /> 解出的 <Katex tex="D" /> 称为<b>相似维数</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSelfSim" />
      <div class="cap">图 维1 · <b>自相似集</b>：每边分 <Katex tex="k" /> 份，把整体换成一堆缩小的自身。看点：① 线段分 <Katex tex="k" /> 份得 <Katex tex="N=k" /> 个小段，正方形分 <Katex tex="k" /> 份得 <Katex tex="N=k^2" /> 个小方块；② 层数加一，每个副本里又长出一模一样的结构；③ 橙色那格始终是整体的缩印——形状没变，只差一个比例。</div>
    </div>

    <h3 class="sec" id="d1-def">定义与三个例子</h3>
    <p>定义只说了两件事：副本与整体相似，副本拼起来恰好是整体。三个最熟悉的集合都符合。</p>
    <p><b>单位线段</b>：<Katex tex="[0,1]=[0,\tfrac12]\cup[\tfrac12,1]" />，<Katex tex="N=2" />，<Katex tex="r=\tfrac12" />。左右两半都是整条线段的缩印。</p>
    <p><b>单位正方形</b>：四等分成四个半尺寸小方块，<Katex tex="N=4" />，<Katex tex="r=\tfrac12" />。每个小方块都是大正方形的缩印。</p>
    <p><b>三分康托集</b>：把 <Katex tex="[0,1]" /> 的中间三分之一挖掉，剩下左右两段；每一段再挖去中间三分之一，如此不停。极限集满足 <Katex tex="K=\tfrac13K\cup\left(\tfrac13K+\tfrac23\right)" />，<Katex tex="N=2" />，<Katex tex="r=\tfrac13" />。</p>
    <p>三者的 <Katex tex="N" /> 与 <Katex tex="r" /> 各不相同，但都满足同一条拼法。前两个维数是整数 1 和 2，康托集的维数却落在 0 与 1 之间——这正是下一章要算的。</p>

    <h3 class="sec" id="d1-map">压缩映射与不变集</h3>
    <p>把「取副本再拼起来」写成一个算子：</p>
    <p style="text-align:center"><Katex display tex="T(K)=S_1(K)\cup S_2(K)\cup\cdots\cup S_N(K)." /></p>
    <p>每个 <Katex tex="S_i" /> 都把距离乘上 <Katex tex="r_i&lt;1" />，所以 <Katex tex="T" /> 在「紧集配上豪斯多夫距离」的空间里是压缩映射。巴拿赫不动点定理给出两条结论：不动点存在且唯一；从任何紧集出发反复作用 <Katex tex="T" />，都会收敛到这个不动点。</p>
    <p>画板上的逐层替换，做的正是反复作用 <Katex tex="T" />：第 <Katex tex="n" /> 层是 <Katex tex="T^n(K_0)" />，层数一多就贴住不动点。这也说明自相似集与初始形状无关，只由那组映射决定。</p>
    <p>反过来说，随便给一组压缩相似映射，都能造出一个自相似集。第 8 章的迭代函数系统把这件事做成生成算法。</p>

    <h3 class="sec" id="d1-osc">开集条件</h3>
    <p>副本之间如果重叠得厉害，维数就不能只由 <Katex tex="N" /> 与 <Katex tex="r" /> 决定。常用的排除办法是<b>开集条件</b>：存在非空开集 <Katex tex="O" />，使</p>
    <p style="text-align:center"><Katex display tex="\bigcup_{i=1}^{N}S_i(O)\subseteq O,\qquad S_i(O)\ \text{两两不交}." /></p>
    <p>它要求各副本在「放大一点」的版本里互不相碰。康托集的左右两段、科赫曲线的四条小折线都满足；谢尔宾斯基三角的三个小三角只在顶点相触，取稍微内缩的开三角仍可满足。</p>
    <p>满足开集条件的自相似集，相似维数、盒维数、豪斯多夫维数三者相等，都等于 <Katex tex="N r^D=1" /> 的解。后面几章的例子都在这个范围内。</p>

    <h3 class="sec" id="d1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：自相似不等于分形。</strong>正方形、线段都自相似，维数是整数。分形通常指维数非整数、或局部与整体相似的粗糙集合，判断依据是维数，不是「能不能自相似」。</li>
        <li><strong>提示二：<Katex tex="N" /> 是一步的副本数。</strong>第 <Katex tex="n" /> 层的总副本数是 <Katex tex="N^n" />，不是 <Katex tex="N" />。把 <Katex tex="N^n" /> 代进维数公式会得到 <Katex tex="nD" />，差了一整个因子。</li>
        <li><strong>提示三：比例要取同一层的。</strong><Katex tex="r" /> 是单个副本相对整体的缩放比。第 <Katex tex="n" /> 层的小副本比例是 <Katex tex="r^n" />，配套的副本数也得用 <Katex tex="N^n" />，两者必须同时换。</li>
        <li><strong>提示四：开集条件省不得。</strong>映射组若有严重重叠，<Katex tex="N r^D=1" /> 仍能解出一个数，但它未必是集合的维数。算维数前先确认副本基本不重叠。</li>
      </ul>
    </div>
    <p>回收与预告：自相似性把「维数」从整数推广到了分数。下一步把 <Katex tex="N" /> 与 <Katex tex="r" /> 代进公式，算出康托集、科赫曲线这些熟悉例子的具体数值，并处理各副本比例不相等的拼法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSelfSim } from '../../../boards/fractal/dim/selfsim.js';
import { FS_CHAPTERS } from './fsnav.js';
</script>
