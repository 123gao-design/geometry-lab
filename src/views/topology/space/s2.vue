<template>
  <ChPage :cur="2" no="拓2" base="/topology/s" :chapters="TSP_CHAPTERS"
    title="基与子空间"
    sub="一次写清整族开集太笨重。挑一小批集合当底料，让它们自由地并，整族拓扑就长出来了。底料叫基。子空间则是把一套现成的拓扑搬到子集上，讲究的是相对。"
    :toc="[{ id: 's2-basis', t: '基的定义与判据' }, { id: 's2-ball', t: '开球是最自然的基' }, { id: 's2-gen', t: '由基生成拓扑' }, { id: 's2-sub', t: '子空间与相对开集' }, { id: 's2-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="(X,\mathcal{T})" /> 是拓扑空间。<Katex tex="\mathcal{B}\subseteq\mathcal{T}" /> 若满足：每个开集都是 <Katex tex="\mathcal{B}" /> 里若干成员的并，就称 <Katex tex="\mathcal{B}" /> 是拓扑 <Katex tex="\mathcal{T}" /> 的一个<b>基</b>。等价地说：对任意开集 <Katex tex="U" /> 与任意 <Katex tex="x\in U" />，都存在 <Katex tex="B\in\mathcal{B}" /> 使 <Katex tex="x\in B\subseteq U" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createBasis" />
      <div class="cap">图 拓2 · <b>基与子空间</b>：L 形开集 <Katex tex="A" /> 上铺满网格，每格中心放一颗基球。看点：① 半径调大时跨出边界的球变虚，蓝球只剩完全落在 <Katex tex="A" /> 内部的那批；② 每颗蓝球都落在 <Katex tex="A" /> 里，而 <Katex tex="A" /> 里每一点都落在某颗蓝球里，两层包含合起来说明 <Katex tex="A" /> 由基球并成；③ 切到子空间视角，球与直线 <Katex tex="Y" /> 的交被染成绿段，<Katex tex="Y" /> 里的开集正是这些交。</div>
    </div>

    <h3 class="sec" id="s2-basis">基的定义与判据</h3>
    <p>基的作用是把「开」这件事拆成两步：先认小块的基成员，再把它们并起来。定义不要求基成员彼此不交，重叠是常态；也不要求基本身对并、交封闭，封闭的是由它并出来的整族。</p>
    <p>反过来，随手给一族子集，什么时候能当基？两条判据：</p>
    <ul>
      <li><b>覆盖</b>：每个 <Katex tex="x\in X" /> 都落在某个基成员里；</li>
      <li><b>细化</b>：若 <Katex tex="x" /> 同时落在 <Katex tex="B_1" />、<Katex tex="B_2" /> 里，就存在基成员 <Katex tex="B_3" /> 使 <Katex tex="x\in B_3\subseteq B_1\cap B_2" />。</li>
    </ul>
    <p>第二条常被误读成「基对交封闭」。它只要求交集里每一点都能找到一颗更小的基成员兜住它，并不要求 <Katex tex="B_1\cap B_2" /> 本身在基里。开球族正是这样：两颗球相交成透镜形，透镜里每一点都能再画一颗小得多的球，仍在透镜里。</p>

    <h3 class="sec" id="s2-ball">开球是最自然的基</h3>
    <p>度量空间里，全体开球 <Katex tex="\{B(x,r):x\in X,\ r>0\}" /> 构成度量拓扑的基。证明只用三角不等式：设 <Katex tex="y\in B(x,r)" />，取 <Katex tex="\rho=r-d(x,y)>0" />，则对任意 <Katex tex="z\in B(y,\rho)" /> 有</p>
    <p style="text-align:center"><Katex display tex="d(x,z)\le d(x,y)+d(y,z)<d(x,y)+\rho=r," /></p>
    <p>所以 <Katex tex="B(y,\rho)\subseteq B(x,r)" />。这颗小球就是判据里的 <Katex tex="B_3" />。</p>
    <p>半径只取正有理数也行。任意实数半径的球，都能写成半径更小的有理半径球的并——这就是「可数基」的来路，它把整族开集的问题压缩到可数多个小块上。</p>

    <h3 class="sec" id="s2-gen">由基生成拓扑</h3>
    <p>反过来，先有基、后有拓扑。给定满足两条判据的族 <Katex tex="\mathcal{B}" />，规定</p>
    <p style="text-align:center"><Katex display tex="\mathcal{T}=\left\{\,\bigcup_{i\in I}B_i:\ B_i\in\mathcal{B}\,\right\}\cup\{\varnothing\}," /></p>
    <p>即 <Katex tex="\mathcal{B}" /> 的任意并，再补上空集。这样得到的 <Katex tex="\mathcal{T}" /> 满足三条公理，且以 <Katex tex="\mathcal{B}" /> 为基。并的并还是并，所以第一条公理里「任意并」自动成立；有限交则靠细化判据一点点缩小到单颗基成员里去。</p>
    <p>同样的思路可以再退一步：先给一族不作要求的集合（叫子基），规定拓扑是「包含这族集合的最粗拓扑」，具体做法是先把它们两两求有限交得到基，再取并。数轴上的开区间、平面上的开圆盘，都可以从更简单的半直线、半平面出发生成。</p>

    <h3 class="sec" id="s2-sub">子空间与相对开集</h3>
    <p>有了拓扑，子集就能继承一份。设 <Katex tex="Y\subseteq X" />，规定</p>
    <p style="text-align:center"><Katex display tex="\mathcal{T}_Y=\{\,U\cap Y:\ U\in\mathcal{T}\,\}," /></p>
    <p>即把每个开集与 <Katex tex="Y" /> 相交，得到的族叫<b>子空间拓扑</b>，成员叫 <Katex tex="Y" /> 中的<b>相对开集</b>。画板第二幕演示了这件事：<Katex tex="Y" /> 是一条直线，球与它的交是开区间，端点不在交里。</p>
    <p>相对开集未必在 <Katex tex="X" /> 中开。闭区间 <Katex tex="[0,1]" /> 作为 <Katex tex="\mathbb R" /> 的子空间，<Katex tex="[0,\tfrac12)" /> 是相对开集——它是 <Katex tex="(-\tfrac12,\tfrac12)\cap[0,1]" />；可它在直线上不是开集。所以在子空间里说「开」，必须问清相对于谁。</p>
    <p>子空间还带来一条传递性：若 <Katex tex="Y\subseteq Z\subseteq X" />，先在 <Katex tex="X" /> 中取 <Katex tex="Z" /> 的子空间、再取 <Katex tex="Y" /> 的子空间，与直接从 <Katex tex="X" /> 取 <Katex tex="Y" /> 的子空间，结果一样。相对来相对去，最终只看 <Katex tex="Y" /> 与最外层空间的关系。</p>

    <h3 class="sec" id="s2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：基成员是开集，开集不必是基成员。</strong>基只管生成，不负责穷尽。开集可以是无限多颗基球并出来的，往往写不成一颗球。</li>
        <li><strong>提示二：细化判据不是交封闭。</strong>要求 <Katex tex="B_1\cap B_2" /> 本身在基里，条件太强，开球族当场出局。只需在交集里配一颗更小的基成员。</li>
        <li><strong>提示三：子空间里的开集要带前缀。</strong>写「<Katex tex="[0,\tfrac12)" /> 是开集」是错的，正确说法是「在 <Katex tex="[0,1]" /> 中相对开」。缺了参照空间，这句话没有真假。</li>
        <li><strong>提示四：相对开集与相对闭集可以同时成立。</strong>在 <Katex tex="[0,1]" /> 里，单点 <Katex tex="\{0\}" /> 既相对开又相对闭。子空间越挤，这种「又开又闭」的集合越多。</li>
      </ul>
    </div>
    <p>回收与预告：开集的对偶是补集。把「开集的补」全部收进来，就得到闭集族；开集与闭集之间的那道缝，由内部、闭包、边界三样东西量出来——下一章逐个交代。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBasis } from '../../../boards/topology/space/basis.js';
import { TSP_CHAPTERS } from './snav.js';
</script>
