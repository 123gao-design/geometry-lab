<template>
  <ChPage :cur="3" no="拓3" base="/topology/s" :chapters="TSP_CHAPTERS"
    title="闭集、内部与闭包"
    sub="开集取补得到闭集。一个任意集合落在两者之间：往里收，收到最大的开集叫内部；往外撑，撑到最小的闭集叫闭包；两者之间那圈夹缝就是边界。"
    :toc="[{ id: 's3-closed', t: '闭集与对偶公理' }, { id: 's3-int', t: '内部与闭包' }, { id: 's3-bdy', t: '边界、极限点与孤立点' }, { id: 's3-dense', t: '稠密与稠密子集' }, { id: 's3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="A\subseteq X" />。称 <Katex tex="A" /> 是<b>闭集</b>，若它的补 <Katex tex="X\setminus A" /> 是开集。称 <Katex tex="\operatorname{int}A" /> 为 <Katex tex="A" /> 的<b>内部</b>——它是含于 <Katex tex="A" /> 的最大开集，即所有含于 <Katex tex="A" /> 的开集之并；称 <Katex tex="\overline{A}" /> 为 <Katex tex="A" /> 的<b>闭包</b>——它是包含 <Katex tex="A" /> 的最小闭集，即所有包含 <Katex tex="A" /> 的闭集之交；称 <Katex tex="\partial A=\overline{A}\setminus\operatorname{int}A" /> 为 <Katex tex="A" /> 的<b>边界</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createClosure" />
      <div class="cap">图 拓3 · <b>内部与闭包机</b>：集合 <Katex tex="A" /> 是一块开圆盘再加一枚孤立点 <Katex tex="Q" />，拖动 <Katex tex="P" /> 到各处。看点：① 圆盘内部涂蓝，那是 <Katex tex="A" /> 的内部；圆周描绿，闭包由它兜住；② <Katex tex="P" /> 跨过圆周时判读依次是内点、边界点、外点，球始终半虚半实地贴着两侧；③ 把 <Katex tex="P" /> 拖到 <Katex tex="Q" /> 上：这枚点属于 <Katex tex="A" />，判定仍是边界点——孤立点也在边界里。</div>
    </div>

    <h3 class="sec" id="s3-closed">闭集与对偶公理</h3>
    <p>把开集公理逐条取补，闭集就长出自己的一套：<Katex tex="\varnothing" /> 与 <Katex tex="X" /> 是闭集；任意多个闭集的交是闭集；有限多个闭集的并是闭集。注意并交的位置换了——开集里是「任意并、有限交」，闭集里是「任意交、有限并」。</p>
    <p>闭集不是开集的反面。一个集合可以既开又闭，也可以既不开又不闭。数轴上 <Katex tex="\mathbb R" /> 与 <Katex tex="\varnothing" /> 既开又闭；<Katex tex="(0,1]" /> 既不闭（<Katex tex="1" /> 是它的极限点却不在里面）也不开（<Katex tex="0" /> 的去心邻域跑到了外面）。用「不是开集」代替「是闭集」，是这一章最常见的误判。</p>
    <p>有限个闭集并起来仍闭，这条在无限并上失效：</p>
    <p style="text-align:center"><Katex display tex="\bigcup_{n=1}^{\infty}\left[\frac1n,1\right]=(0,1]," /></p>
    <p>每个 <Katex tex="[\tfrac1n,1]" /> 都闭，并起来漏掉了 <Katex tex="0" />，不再是闭集。</p>

    <h3 class="sec" id="s3-int">内部与闭包</h3>
    <p>内部是「装得下」的最大开集，闭包是「装住它」的最小闭集。两个算子都幂等：<Katex tex="\operatorname{int}(\operatorname{int}A)=\operatorname{int}A" />，<Katex tex="\overline{\overline{A}}=\overline{A}" />。反复收、反复撑，第二次就不动了。</p>
    <p>闭包与内部由取补互相换算：</p>
    <p style="text-align:center"><Katex display tex="X\setminus\overline{A}=\operatorname{int}(X\setminus A),\qquad X\setminus\operatorname{int}A=\overline{X\setminus A}." /></p>
    <p>记住一组就够，另一组取补推出来。若 <Katex tex="A\subseteq B" />，则 <Katex tex="\operatorname{int}A\subseteq\operatorname{int}B" />、<Katex tex="\overline{A}\subseteq\overline{B}" />：两个算子都保包含，方向一致。</p>
    <p>点属于闭包有一句等价说法：<Katex tex="x\in\overline{A}" /> 当且仅当 <Katex tex="x" /> 的每个邻域都与 <Katex tex="A" /> 相交。这句把闭包从「一堆闭集交出来」翻成了可逐个检验的条件，证明里更常用。</p>

    <h3 class="sec" id="s3-bdy">边界、极限点与孤立点</h3>
    <p><Katex tex="x" /> 是 <Katex tex="A" /> 的<b>极限点</b>，若 <Katex tex="x" /> 的每个去心邻域都与 <Katex tex="A" /> 相交。极限点可以不在 <Katex tex="A" /> 里。<Katex tex="\overline{A}" /> 恰好是 <Katex tex="A" /> 与它全部极限点的并。</p>
    <p><Katex tex="x\in A" /> 却不是极限点，叫<b>孤立点</b>：有一圈邻域，除了 <Katex tex="x" /> 自己再没有 <Katex tex="A" /> 的点。画板上的 <Katex tex="Q" /> 就是孤立点。</p>
    <p>孤立点落在边界上，这一点常被漏掉。它是 <Katex tex="A" /> 的点，但它配不出整颗落在 <Katex tex="A" /> 里的球，所以不是内点；它的每个邻域又都碰到 <Katex tex="A" />（有自己）与外部，所以是边界点。离散空间里每个点都孤立，每个点也都是自身的边界。</p>

    <h3 class="sec" id="s3-dense">稠密与稠密子集</h3>
    <p>若 <Katex tex="\overline{D}=X" />，称 <Katex tex="D" /> 在 <Katex tex="X" /> 中<b>稠密</b>。直观说法是：任何非空开集里都藏着 <Katex tex="D" /> 的点。有理数在实数中稠密，任意两个实数之间都有有理数；无理数同样稠密。</p>
    <p>稠密让「连续」有了判别法：若 <Katex tex="f,g" /> 连续且在稠密子集 <Katex tex="D" /> 上取值相同，则 <Katex tex="f=g" /> 处处成立。两个连续函数的差集是闭集，它包含 <Katex tex="D" /> 因而包含 <Katex tex="\overline{D}=X" />。只在有理点上验证过一条恒等式，就能把它推到全体实数，靠的就是这一条。</p>

    <h3 class="sec" id="s3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不是开集不等于闭集。</strong>既不开又不闭的集合很常见，<Katex tex="(0,1]" /> 就是。要判闭集，看补集开不开，别拿「看起来有口子」当依据。</li>
        <li><strong>提示二：有限并、任意交，顺序别记反。</strong>开集是任意并、有限交；闭集是任意交、有限并。无限个闭区间并起来可能漏端点，上面 <Katex tex="\bigcup[1/n,1]" /> 的例子就是。</li>
        <li><strong>提示三：内部与闭包会穿过边界。</strong><Katex tex="\operatorname{int}A" /> 与 <Katex tex="\overline{A}" /> 之间夹着 <Katex tex="\partial A" />。一般 <Katex tex="\overline{A}\ne A" />，<Katex tex="\operatorname{int}A\ne A" />；等号只在 <Katex tex="A" /> 恰为闭集、开集时成立。</li>
        <li><strong>提示四：孤立点属于集合，也属于边界。</strong>它没有极限点作伴，却仍配不出内球。「属于集合」「是内点」「是边界点」是三件事，不能由第一件推出第二件。</li>
      </ul>
    </div>
    <p>回收与预告：开集与闭集都把空间切成了几块。两套结构之间如何对齐，才能说两个空间「形状一样」？答案是靠开集的原像来定义连续，再把可逆的连续映射单独点名——下一章。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createClosure } from '../../../boards/topology/space/closure.js';
import { TSP_CHAPTERS } from './snav.js';
</script>
