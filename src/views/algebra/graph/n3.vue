<template>
  <ChPage :cur="3" no="网3" base="/algebra/n" :chapters="AN_CHAPTERS"
    title="树"
    sub="连通而无圈的图叫树。它用最少的边把顶点连成一片：n 个顶点恰有 n−1 条边，任意两点之间恰有一条路径。少一条断开，多一条成圈。"
    :toc="[{ id: 'n3-def', t: '树的等价刻画' }, { id: 'n3-count', t: '边数与顶点数' }, { id: 'n3-span', t: '生成树' }, { id: 'n3-tip', t: '四条提示' }]">
    <div class="note good">连通且无圈的图叫<b>树</b>。对 <Katex tex="n" /> 个顶点的图，以下三句等价：它是树；它连通且恰有 <Katex tex="n-1" /> 条边；任意两点之间有唯一一条路径。连通图的<b>生成树</b>是包含全部顶点、边数最少的连通子图。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTree" />
      <div class="cap">图 网3 · <b>树的判定机</b>：顶点排成一圈，边数由滑块控制。看点：① 边数等于 n−1 且连通时判读为树；② 少一条边，有顶点连不上，判读改口；③ 多一条边（红色弦），出现一个圈，不再是树。</div>
    </div>

    <h3 class="sec" id="n3-def">树的等价刻画</h3>
    <p>无圈保证路径不会绕回来，连通保证路径走得通，两条合起来给出「唯一路径」。反过来，任意两点有唯一路径时，图必连通；若存在圈，圈上两点就有两条路径，矛盾。</p>
    <p>树是「最省的连通图」：任何连通图都能删去一些边变成树，删到不能再删为止。这个过程的产物就是生成树。</p>
    <p>叶子是度为 1 的顶点。任何非平凡树至少有两个叶子，因为最长的路径两端不可能再有别的邻点。这条性质常用在归纳证明里。</p>

    <h3 class="sec" id="n3-count">边数与顶点数</h3>
    <p>树的边数由顶点数唯一确定：<Katex tex="|E|=|V|-1" />。连通图的边数不少于这个值，每多一条边至少引入一个圈，圈数由圈秩 <Katex tex="|E|-|V|+1" /> 刻画。</p>
    <p>加上一个顶点要连一条边才保持连通，删去一个叶子只删一条边就仍是树。这两种操作生成全部树，也给出「树都能由小树拼出」的构造。</p>
    <p>画板上把边数拨到 n−1 时判读转绿，两侧各差一条就被判为断开或成圈。判据三条全用上，缺一不可。</p>

    <h3 class="sec" id="n3-span">生成树</h3>
    <p>连通图 <Katex tex="G" /> 的生成树保留全部顶点、只留 <Katex tex="n-1" /> 条边，且保持连通。它把所有顶点连成一片，同时去掉全部多余的回路。</p>
    <p>带权图的最小生成树要总权重最小，克鲁斯卡尔算法按权重从小到大加边、避开成圈，普里姆算法从一个点出发逐步扩张，两者都能得到最优解。</p>
    <p>生成树在电路布线、通信网络、聚类分析里都有直接应用。树的性质保证了「连得通」与「不多花一条线」同时满足。</p>

    <h3 class="sec" id="n3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：n−1 条边加连通才够。</strong>只有边数条件不足以判定树，例如一个三角形加一个孤立点也是 3 条边 4 个顶点，却既断开又有圈。</li>
        <li><strong>提示二：无圈但断开不是树。</strong>森林是若干棵树拼起来，分量数为 <Katex tex="c" /> 时边数是 <Katex tex="n-c" />。</li>
        <li><strong>提示三：叶子至少有两只。</strong>这样才能做归纳；只有一个顶点的平凡树是唯一例外。</li>
        <li><strong>提示四：生成树不唯一。</strong>一个图可以有多棵生成树，最小生成树在权重互不相同时唯一。</li>
      </ul>
    </div>
    <p>回收与预告：树的边不能重复也不能多，那「每条边恰好走一次」的路线该如何判断？奇点的个数给出答案，这是下一章的欧拉回路。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTree } from '../../../boards/algebra/graph/tree.js';
import { AN_CHAPTERS } from './annav.js';
</script>
