<template>
  <ChPage :cur="1" no="连1" base="/topology/c" :chapters="TCN_CHAPTERS"
    title="连通性"
    sub="连通的直观意思是一整块，不能掰成两半。公理化的写法只有一句否定：不存在把空间分成两块不交非空开集的划分。这句话只谈开集，因此属于拓扑性质。"
    :toc="[{ id: 'c1-def', t: '定义：没有分割' }, { id: 'c1-eq', t: '几条等价说法' }, { id: 'c1-sub', t: '连通子集与连通分支' }, { id: 'c1-ex', t: '一串例子' }, { id: 'c1-tip', t: '四条提示' }]">
    <div class="note good">拓扑空间 <Katex tex="X" /> 叫<b>连通</b>的，若它不能写成两个不交非空开集之并。也就是说，若 <Katex tex="X=U\cup V" /> 且 <Katex tex="U\cap V=\varnothing" />，两个都非空，那么两者之中至少有一个不是开集。子集 <Katex tex="A\subseteq X" /> 连通，指它带着子空间拓扑时连通。</div>

    <div class="board-wrap">
      <BoardMount :factory="createConnected" />
      <div class="cap">图 连1 · <b>连通与分割</b>：两块圆盘拼成空间 <Katex tex="X" />。看点：① 走廊关掉时，左盘 <Katex tex="U" /> 与右盘 <Katex tex="V" /> 各自成一块开集，互不相交，<Katex tex="X=U\cup V" /> 就是一份分割；② 打开走廊，任何一块开集都拆不开它，判读翻成连通；③ 滑块只挪间距，挪得再开也不改变判定，判定只认走廊在不在——连通与否是结构问题，不是远近问题。</div>
    </div>

    <h3 class="sec" id="c1-def">定义：没有分割</h3>
    <p>把「掰成两半」写成集合语言：找到两块不交的非空开集，合起来正好是全体。这样的两块叫一份<b>分割</b>。连通就是不存在分割。</p>
    <p>两块开集不交且并成全空间，那么其中一块的补恰是另一块，所以两块同时是闭集。分割的两半既开又闭。于是连通也可以等价地说成：<Katex tex="X" /> 中既开又闭的子集只有 <Katex tex="\varnothing" /> 与 <Katex tex="X" />。三种说法——没有分割、没有非平凡既开又闭集、从 <Katex tex="X" /> 到两点离散空间 <Katex tex="\{0,1\}" /> 的连续映射只有常值——说的是同一件事。</p>
    <p>最后一种说法在证明里最好用。连续映射保持连通：若 <Katex tex="X" /> 连通而 <Katex tex="f(X)" /> 断开，把断开的两块的原像取出来，就得到 <Katex tex="X" /> 的一份分割，矛盾。这一句是连通性的主要用途。</p>

    <h3 class="sec" id="c1-eq">几条等价说法</h3>
    <p>连通性的等价刻画不少，挑三条记：</p>
    <ul>
      <li>不存在分割；</li>
      <li>没有非平凡的既开又闭子集；</li>
      <li>任意连续映射 <Katex tex="f:X\to\{0,1\}" /> 都是常值映射（<Katex tex="\{0,1\}" /> 取离散拓扑）。</li>
    </ul>
    <p>第三条把连通换成了映射的粒度，常用来证明「某个量在连通集上不变号」：把符号写成映射，若出现正负两个值，映射就不是常值，与连通矛盾。</p>
    <p>闭包也保连通：若 <Katex tex="A" /> 连通且 <Katex tex="A\subseteq B\subseteq\overline{A}" />，则 <Katex tex="B" /> 连通。夹在集合与它闭包之间的任何一层都连成一片，这条是下一章拓扑学家的正弦曲线的关键。</p>

    <h3 class="sec" id="c1-sub">连通子集与连通分支</h3>
    <p>连通子集的并未必连通。两条互不相交的线段各自连通，并起来断开。加上「有公共点」才成立：若一族连通子集两两相交，它们的并连通。</p>
    <p>任意空间都能拆成极大的连通子集之并，这些子集叫<b>连通分支</b>。分支两两不交，覆盖全空间，每个分支自己连通。分支的个数是拓扑不变量：同胚的空间分支个数相同。</p>
    <p>分支不必开。有理数集 <Katex tex="\mathbb Q" /> 的每个分支都是单点——任意两个有理数之间夹着无理数，从中切开就是一份分割。单点分支在此不是开集，所以 <Katex tex="\mathbb Q" /> 的分支多而细碎，一个开区间里就不知有多少个。</p>

    <h3 class="sec" id="c1-ex">一串例子</h3>
    <p><b>实数轴</b>连通。若 <Katex tex="\mathbb R=U\cup V" /> 是分割，取 <Katex tex="u\in U" />、<Katex tex="v\in V" />，不妨 <Katex tex="u<v" />。考虑集合 <Katex tex="S=\{t\in[u,v]:[u,t]\subseteq U\}" />，它有上确界 <Katex tex="s" />。由 <Katex tex="U" /> 开得 <Katex tex="s>u" />，由 <Katex tex="V" /> 开得 <Katex tex="s<v" />，而 <Katex tex="s" /> 两边都不属于，矛盾。这条论证就是介值定理的骨架。</p>
    <p><b>有理数集</b>不连通，理由同上：<Katex tex="\sqrt2" /> 处能下刀。<b>单位圆</b>连通，它是连通区间在连续映射下的像。<b>两个不交开区间</b>不连通，两段本身就是分割。</p>
    <p><b>康托集</b>既不连通，也不是离散的。它有无穷多个点却处处不构成区间，连通分支全部是单点，而单点分支都不是开集。连通与「看起来有没有缝」没有直接关系。</p>

    <h3 class="sec" id="c1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：断开的两半不要求闭，只要求开。</strong>开与不交、并成全空间三条一起用，自动推出两半也闭。证明里只需验证开与不交。</li>
        <li><strong>提示二：连通子集的并未必连通。</strong>必须补上「两两相交」。两条分离的线段各自连通，并起来断开，就是反例。</li>
        <li><strong>提示三：连通不等于道路连通。</strong>连通只说拆不开，不保证任意两点之间有一条路。下一章的正弦曲线是标准反例，两者要分开记。</li>
        <li><strong>提示四：连通是拓扑性质。</strong>同胚保持连通，也保持分支个数。判断两个空间不同胚时，先数连通分支，往往一眼就能分开。</li>
      </ul>
    </div>
    <p>回收与预告：连通只保证整体拆不开，没有回答「两点之间能不能走」。把「走」写成连续映射，就得到连通的一个加强版本——道路连通。它有更好的运算性质，代价是与连通不再等价。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createConnected } from '../../../boards/topology/compact/connected.js';
import { TCN_CHAPTERS } from './cnav.js';
</script>
