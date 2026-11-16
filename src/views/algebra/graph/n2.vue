<template>
  <ChPage :cur="2" no="网2" base="/algebra/n" :chapters="AN_CHAPTERS"
    title="路径与连通性"
    sub="从一点沿边走，走到的点排成一条路径。两点之间有路径就说它们连通，连通关系把顶点分成若干块。广度优先搜索从起点向外一圈圈铺开，第一次到达时的圈数就是最短距离。"
    :toc="[{ id: 'n2-path', t: '路径、回路与距离' }, { id: 'n2-conn', t: '连通分量' }, { id: 'n2-bfs', t: '广度优先搜索' }, { id: 'n2-tip', t: '四条提示' }]">
    <div class="note good">顶点与边交替出现的序列 <Katex tex="v_0e_1v_1\cdots e_kv_k" /> 若边互不相同，称为<b>路径</b>；首尾重合的叫<b>回路</b>。两顶点间最短路径的长度是它们的<b>距离</b>。若任意两点都有路径相连，图<b>连通</b>；否则顶点按连通关系分成若干<b>连通分量</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPath" />
      <div class="cap">图 网2 · <b>广度优先搜索机</b>：从 <Katex tex="v_1" /> 出发逐层向外，目标顶点由滑块选择。看点：① 顶点上方的数字是到起点的最短距离，灰色标 ∞；② 黄色粗线是到目标的最短路径；③ 目标换到右侧小片，距离读 ∞，那片自成另一个连通分量。</div>
    </div>

    <h3 class="sec" id="n2-path">路径、回路与距离</h3>
    <p>路径可以重复经过顶点，边不重复即可；所有顶点都不重复的路径叫简单路径。讨论最短路时总可以限定在简单路径上，因为绕圈只会增加长度。</p>
    <p>两点间距离满足三条性质：非负、对称、三角不等式。这使它成为真正的距离，虽然取值只能是整数。</p>
    <p>直径是全部距离中的最大值，刻画图的「跨度」。小世界网络的特点是顶点很多而直径很小，这一定义在网络分析里常用。</p>

    <h3 class="sec" id="n2-conn">连通分量</h3>
    <p>「从 <Katex tex="u" /> 能走到 <Katex tex="v" />」是等价关系：自反、对称、传递。等价类就是连通分量，块内任意两点互通，块间没有任何边。</p>
    <p>连通分量把大问题拆成互不干扰的小问题。求最短路径、做遍历、判断平面性，都可以逐块进行。</p>
    <p>删掉一个顶点会让分量数增加，这个顶点叫割点。画板上右侧那片与左边只差一条边，若那条边断开，图立刻分成两块。</p>

    <h3 class="sec" id="n2-bfs">广度优先搜索</h3>
    <p>算法从起点入队，每次取出队首，把它没访问过的邻居依次标记、入队。先被访问的顶点距离小，因此得到的是按距离分层的顺序。</p>
    <p>每个顶点最多入队一次、每条边检查两次，总代价与顶点数加边数同阶。这是图算法里最快的几种之一。</p>
    <p>画板的层级着色就是队列的展开顺序，黄色路径由前驱指针回溯得到。搜索结束仍标 ∞ 的顶点，与起点分属不同分量。</p>

    <h3 class="sec" id="n2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：连通不等于任意两点直接相连。</strong>连通只要求有路径，允许中途经过别的顶点。</li>
        <li><strong>提示二：最短路径可能不唯一。</strong>距离唯一，路径未必。BFS 给出的是按队列顺序选中的一条。</li>
        <li><strong>提示三：无边图每个顶点自成一块。</strong>连通分量数等于顶点数，这是判读的边界情形。</li>
        <li><strong>提示四：有向图要分强连通与弱连通。</strong>本节讨论无向图；有向图里「能走通」与「反向也能走通」不是一回事。</li>
      </ul>
    </div>
    <p>回收与预告：在连通图里如果边数恰好比顶点数少一条，就没有多余的回路。这种最省边的连通图叫树，结构被约束得很紧。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPath } from '../../../boards/algebra/graph/path.js';
import { AN_CHAPTERS } from './annav.js';
</script>
