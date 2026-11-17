<template>
  <ChPage :cur="2" no="群2" base="/algebra/g" :chapters="AG_CHAPTERS"
    title="子群与陪集"
    sub="在一个群里挑出一部分元素，它在同样的运算下也能成群，这就是子群。把子群平移一下，得到一块块大小相同的陪集，它们拼满整个群。拼得整整齐齐的代价，是子群的阶必须整除群的阶。"
    :toc="[{ id: 'g2-sub', t: '子群的判定' }, { id: 'g2-coset', t: '陪集与分割' }, { id: 'g2-lagrange', t: '拉格朗日定理' }, { id: 'g2-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="H\subseteq G" /> 在 <Katex tex="G" /> 的运算下自身成群，称 <Katex tex="H" /> 为<b>子群</b>。对 <Katex tex="a\in G" />，集合 <Katex tex="aH=\{ah: h\in H\}" /> 叫 <Katex tex="H" /> 的一个<b>左陪集</b>。<b>拉格朗日定理</b>：<Katex tex="|G|=|H|\cdot[G:H]" />，其中陪集个数 <Katex tex="[G:H]" /> 也整除 <Katex tex="|G|" />。特别地，子群的阶整除群的阶。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCoset" />
      <div class="cap">图 群2 · <b>陪集</b>：<Katex tex="\mathbb{Z}_{12}" /> 的表盘，生成元 k 由滑块选择。看点：① 由 k 生成的子群 <Katex tex="H" /> 用金圈标出；② 同色的点构成一个陪集，各陪集大小都等于 <Katex tex="|H|" />；③ k 换成与 12 互素的值，只剩一个陪集，占满整圈。</div>
    </div>

    <h3 class="sec" id="g2-sub">子群的判定</h3>
    <p>子群只需三条：非空、对运算封闭、对取逆封闭。幺元会自动落在其中，所以不必单独验。判定时最省事的形式是「<Katex tex="a,b\in H" /> 推出 <Katex tex="ab^{-1}\in H" />」，一条顶三条。</p>
    <p>任何群都有两个平凡子群：只含幺元的 <Katex tex="\{e\}" /> 与自身 <Katex tex="G" />。夹在中间的子群才是有信息量的，它们的个数与结构反映群本身的性质。</p>
    <p>循环群的子群特别好算：<Katex tex="\mathbb{Z}_n" /> 的每个子群都由某个元素生成，与 <Katex tex="n" /> 的每个正因数一一对应。画板上拖 k 就是在遍历这些子群。</p>

    <h3 class="sec" id="g2-coset">陪集与分割</h3>
    <p>把子群整体平移 <Katex tex="a" />，得到 <Katex tex="aH" />。平移不改变大小，所以每个陪集与 <Katex tex="H" /> 一样大。不同的陪集要么完全重合，要么不交，任意两个元素要么同属一个陪集、要么分属两个。</p>
    <p>于是整个群被切成若干块等大的碎片，块数就是 <Katex tex="[G:H]" />。这个分割是研究群结构的基本工具，后面的商群正是把每一块当成一个点。</p>
    <p>左陪集与右陪集 <Katex tex="Ha" /> 一般不同。两边处处相同的子群叫正规子群，第 3 章专门处理。</p>

    <h3 class="sec" id="g2-lagrange">拉格朗日定理</h3>
    <p>把分割计数写成一条等式：群的阶等于子群的阶乘以块数。由此得到三条常用推论：子群的阶整除群的阶；元素的阶整除群的阶；素数阶群只有平凡子群，必为循环群。</p>
    <p>反过来不成立：阶整除只是必要条件。8 阶群不一定有三个 4 阶子群，判断存在性还得另想办法。这是拉格朗日定理最常见的误用。</p>
    <p>画板上选 k=3 时子群阶为 4，陪集 3 块；选 k=4 时子群阶为 3，陪集 4 块；选 k=5（与 12 互素）时子群就是整个群。三种情形都满足乘积等于 12。</p>

    <h3 class="sec" id="g2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：子群的运算必须与原群一致。</strong>换一种运算得到的结构不算子群，即使元素集合相同。</li>
        <li><strong>提示二：陪集不是子群。</strong>除 <Katex tex="H" /> 本身以外，其余陪集都不含幺元，因而不成群，只当集合看待。</li>
        <li><strong>提示三：拉格朗日定理只是必要条件。</strong>阶整除不能保证子群存在。用它证「没有某阶子群」可以，证「一定存在」不行。</li>
        <li><strong>提示四：指数与陪集个数是同一个数。</strong><Katex tex="[G:H]" /> 可以先数陪集，也可以直接算 <Katex tex="|G|/|H|" />。</li>
      </ul>
    </div>
    <p>回收与预告：左陪集与右陪集一般不同，若两者处处重合，群的分割就有更好的性质——块与块之间能直接做运算，得到商群。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCoset } from '../../../boards/algebra/groupt/coset.js';
import { AG_CHAPTERS } from './agnav.js';
</script>
