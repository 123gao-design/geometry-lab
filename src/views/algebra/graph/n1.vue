<template>
  <ChPage :cur="1" no="网1" base="/algebra/n" :chapters="AN_CHAPTERS"
    title="图的基本概念"
    sub="把对象画成点、把关系画成线，就得到图。顶点的度数是与它相连的边的条数，所有度数加起来恰是边数的两倍，这是图论里最常用的一条计数。"
    :toc="[{ id: 'n1-def', t: '顶点、边与度' }, { id: 'n1-hand', t: '握手定理' }, { id: 'n1-special', t: '完全图与二分图' }, { id: 'n1-tip', t: '四条提示' }]">
    <div class="note good">图 <Katex tex="G=(V,E)" /> 由顶点集与非有序点对组成的边集构成。顶点 <Katex tex="v" /> 的<b>度</b> <Katex tex="\deg v" /> 是含 <Katex tex="v" /> 的边的条数。<b>握手定理</b>：<Katex tex="\sum_{v\in V}\deg v=2|E|" />；由此奇数度顶点的个数必为偶数。无重边、无自环的图叫简单图。</div>

    <div class="board-wrap">
      <BoardMount :factory="createBasic" />
      <div class="cap">图 网1 · <b>度数与握手定理</b>：边数由滑块控制，六个顶点里的数字是各自的度数。看点：① 每加一条边，两端圆里的度数各加 1，总和加 2；② 橙色圆圈标出奇数度顶点，它们的个数始终是偶数；③ 加到最后一条边时，所有顶点的度数都变成奇数。</div>
    </div>

    <h3 class="sec" id="n1-def">顶点、边与度</h3>
    <p>图的本质是两个集合加一个关联关系，画法可以随意：顶点摆成圆、摆成树、摆成任何形状，只要相连关系不变，就是同一个图。这种「画法无关」的性质叫同构。</p>
    <p>度数是局部信息，把各点度数排成一列叫度序列。度序列相同不一定同构，反过来的结论倒是有：两个图同构，度序列必相同。</p>
    <p>边可以有方向（有向图）或带权重（加权图），也有重边与自环的推广。本模块只讨论简单无向图，除非特别说明。</p>

    <h3 class="sec" id="n1-hand">握手定理</h3>
    <p>每条边贡献两个端点，各计 1 度，所以度数总和是边数的两倍。这条等式把局部读数与整体参数绑在一起，几乎所有计数题都从这里开头。</p>
    <p>推论一：奇数度顶点的个数为偶数。把所有顶点分成奇数度与偶数度两组，奇数度之和必为偶数，故奇数度的个数为偶。</p>
    <p>推论二：若每个顶点的度都不小于 2，图中必有圈。沿着边走到底，度数足够保证不回头，最终只能撞上走过的点。</p>

    <h3 class="sec" id="n1-special">完全图与二分图</h3>
    <p>每对顶点都相连的简单图叫完全图 <Katex tex="K_n" />，边数 <Katex tex="n(n-1)/2" />，每个顶点的度都是 <Katex tex="n-1" />。它是同样顶点数下边最多的图。</p>
    <p>顶点能分成两组、边只跨两组的图叫二分图。判断二分图的办法是二着色：从一点染色出发逐层交替，遇到同色相邻就说明不是二分图，等价于图中存在奇圈。</p>
    <p>完全二分图 <Katex tex="K_{m,n}" /> 的两组各两两相连，边数为 <Katex tex="mn" />。<Katex tex="K_{3,3}" /> 与 <Katex tex="K_5" /> 是后面判定非平面图的两个样本。</p>

    <h3 class="sec" id="n1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：自环算两度。</strong>若允许自环，一条自环对端点的度数贡献为 2，握手定理仍成立。</li>
        <li><strong>提示二：度数和是边数的两倍，不是相等。</strong>把 2 漏掉是最常见的算错，检查时先看奇偶。</li>
        <li><strong>提示三：同构图未必画得像。</strong>判断同构看邻接关系，不看顶点位置。顶点数、边数、度序列是必要检查。</li>
        <li><strong>提示四：二分图等价于无奇圈。</strong>二着色失败的位置一定落在奇圈上，这是最快的判据。</li>
      </ul>
    </div>
    <p>回收与预告：有了顶点与边，下一步自然是「从一点走到另一点」。广度优先搜索给出最短路径，走不到的顶点另外归成一块，连通性由此有了精确含义。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBasic } from '../../../boards/algebra/graph/basic.js';
import { AN_CHAPTERS } from './annav.js';
</script>
