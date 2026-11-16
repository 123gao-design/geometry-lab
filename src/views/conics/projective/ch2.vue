<template>
  <ChPage :cur="2" title="投影保留下来的东西：交叉比与调和点列" sub="中心投影摧毁长度与角度，却放走了一个数。"
    :toc="[{ id: 'c2-exp', t: '实验 · 交叉比不变性（图 2）' }, { id: 'c2-harm', t: '交叉比 −1：调和点列' }]">
    <p>中心投影几乎摧毁了所有熟悉的量：线段长度变了、角度变了、圆也可能不再是圆。它到底<strong>保留了什么</strong>？除了“点在直线上”这类结合关系，还有唯一一个实数值在投影下纹丝不动 —— 共线四点的<strong>交叉比</strong> <span class="term">(cross-ratio)</span>。</p>
    <p>设 A, B, C, D 是共线四点，定义（长度都带符号）：</p>
    <Katex tex="(A,\,B;\,C,\,D)\;=\;\dfrac{CA/CB}{DA/DB}" display />
    <p>一个关键事实（这是射影几何的基础之一）：<strong>任何中心投影都不改变交叉比的值。</strong>下面把这条定理直接交到你手里 —— 上下两条直线由中心 S 相连，上线的四个点被中心投影映射到下线。随便拖：拖四个点、拖投影中心 S、甚至拖动下线的两个端把手，你会看到两边的数值<strong>始终逐位相等</strong>。</p>

    <div class="board-wrap" id="c2-exp">
      <BoardMount :factory="createBoard" />
      <div class="cap">图 2 · <b>交叉比不变性实验</b>：上线上的 A, B, C, D 经中心 S 投到下线得 A′, B′, C′, D′。两个白色数值盒实时显示两边的交叉比 —— 无论怎样拖动，它们始终相同。按钮“调成调和”会把点 D 移到使交叉比等于 −1 的位置。</div>
    </div>

    <h3 class="sec" id="c2-harm">当交叉比等于 −1：调和点列</h3>
    <p>交叉比的值千千万，唯有一个值获得了专属名字：<strong>(A, B; C, D) = −1 时，称四点构成调和点列</strong> <span class="term">(harmonic range)</span>，C 与 D 互称对方关于 A, B 的<strong>调和共轭点</strong>。按一下上图中的“调成调和”按钮，然后注意一个漂亮的细节：<strong>把 C 拖到 AB 的正中间，D 会立刻“没有位置可站”</strong> —— 计算表明，线段中点的调和共轭点正是这条直线上的无穷远点。</p>
    <Katex tex="M\ \text{为}\ AB\ \text{的中点}\;\Longleftrightarrow\;(A,\,B;\,M,\,P_\infty)=-1" display />
    <p>这正是 §1 无穷远点思想的延续：调和点列把“中点”和“无穷远点”联结成一对。值得注意的是，调和共轭与圆的反演也有精确联系 —— 如果 U, V 是 P 关于圆的一条割线的两个交点，P 与 P′ 调和共轭，那么把 P′ 沿所有可能的割线方向扫一遍，它的<strong>轨迹是一条直线</strong>。这条“由调和共轭点确定的直线”，就是 §4 的主角：<em>极线</em>。它为什么会是一条直线？§3 会先给出“生成调和点列”的构造。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard } from '../../../boards/conics/projective/cross.js';
</script>
