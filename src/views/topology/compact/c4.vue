<template>
  <ChPage :cur="4" no="连4" base="/topology/c" :chapters="TCN_CHAPTERS"
    title="商空间与常见曲面"
    sub="把集合里的一些点认成同一点，商集就诞生了。给商集配上「最细的、使投影映射连续」的拓扑，它就成了商空间。平面上的正方形按不同方式粘边，粘出环面、克莱因瓶与莫比乌斯带——同一块料，全看粘法。"
    :toc="[{ id: 'c4-quot', t: '商拓扑' }, { id: 'c4-glue', t: '粘边构造' }, { id: 'c4-surface', t: '三类曲面' }, { id: 'c4-class', t: '曲面的分类' }, { id: 'c4-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="X" /> 是拓扑空间，<Katex tex="\sim" /> 是 <Katex tex="X" /> 上的等价关系，<Katex tex="q:X\to X/{\sim}" /> 是自然投影。在商集上规定 <Katex tex="U\subseteq X/{\sim}" /> 开，当且仅当 <Katex tex="q^{-1}(U)" /> 在 <Katex tex="X" /> 中开。这样得到的拓扑叫<b>商拓扑</b>，<Katex tex="X/{\sim}" /> 叫<b>商空间</b>。它是使 <Katex tex="q" /> 连续的所有拓扑中最细的一个。</div>

    <div class="board-wrap">
      <BoardMount :factory="createQuotient" />
      <div class="cap">图 连4 · <b>粘边机</b>：左边一张正方形，箭头标出哪两条边粘、朝哪边粘。看点：① 两对边各自同向粘，两个方向都闭合成圈，右边长成环面；② 一对同向、一对反向，得到克莱因瓶，脖子得穿过瓶身，三维里放不下不自交的版本；③ 只粘一对还反着粘，接口转了半圈，走过一圈就翻到背面，得到莫比乌斯带。</div>
    </div>

    <h3 class="sec" id="c4-quot">商拓扑</h3>
    <p>商拓扑的定义是一条 ≤ 关系：让 <Katex tex="q" /> 连续的拓扑有不少，商拓扑取其中最细的。最细意味着开集尽可能多，这样商空间才留得住信息；再细下去，<Katex tex="q" /> 就不连续了。</p>
    <p>商映射有一条通用性质：<Katex tex="f:X/{\sim}\to Y" /> 连续，当且仅当 <Katex tex="f\circ q" /> 连续。要验证商空间上的映射，把定义域抬回 <Katex tex="X" /> 上去验就行。这条性质是商构造在几何里好用起来的根源。</p>
    <p>商映射不一定开、也不一定闭。投影 <Katex tex="\mathbb R\to\mathbb R/\mathbb Z" /> 是开的，但把闭区间两端粘起来得到圆周的投影，把开集 <Katex tex="(0,0.6)" /> 映成圆周上一段「跨过接口」的弧，仍是开集；换个例子就可能失效。所以判断商空间的闭集要单独做，不能从「像是闭的」直接推。</p>

    <h3 class="sec" id="c4-glue">粘边构造</h3>
    <p>最基本的曲面都由多边形粘边得到。取一张正方形，四条边两两配对，每对按箭头方向认同。粘完之后，四个角落成一点，每条配对边成一整圈，中间剩一块面。</p>
    <p>这种构造正是商映射的实例：正方形是 <Katex tex="X" />，等价关系只把配对边上的点两两认同，商空间就是曲面。前面算欧拉示性数的 <Katex tex="V-E+F" />，量的就是这样一张粘好的多边形——顶点数按粘完的结果算，不是原图上的角数。</p>
    <p>粘之前要先弄清方向。同向粘与反向粘，出来的曲面完全不同；箭头画错一笔，商空间就从可定向滑到不可定向。画板左边标出的 <Katex tex="a" /> 与 <Katex tex="a^{-1}" /> 就是方向记号，上标 <Katex tex="-1" /> 表示反着粘。</p>

    <h3 class="sec" id="c4-surface">三类曲面</h3>
    <p><b>环面</b>：两对边同向粘。两个方向都成了独立的圈，可以嵌进三维空间摆成甜甜圈。它的欧拉示性数为 <Katex tex="0" />，基本群是 <Katex tex="\mathbb Z\times\mathbb Z" />。</p>
    <p><b>克莱因瓶</b>：一对同向、一对反向。它在小范围里和平面没有区别，整体却只有一个面：顺着一个方向走一圈，回来时上下颠倒了。它不能无自交地放进三维空间，需要四维才摆得平。欧拉示性数也是 <Katex tex="0" />，基本群比环面复杂。</p>
    <p><b>莫比乌斯带</b>：只粘一对，并且反向。它带一条边界，只有一个面。把一条纸带扭转半圈再接头，就得到它。它是理解不可定向曲面的入门样本，克莱因瓶可以看成两条莫比乌斯带沿边界粘起来。</p>
    <p>还有一类：球面。正方形四条边全部粘成一点，或者把整个多边形边界收成一点，得到球面。它是唯一一个没有洞的闭曲面，欧拉示性数 <Katex tex="2" />。</p>

    <h3 class="sec" id="c4-class">曲面的分类</h3>
    <p>闭曲面（紧致、无边界、连通）可以分类：每一张都同胚于某个球面接上若干个环柄，或者接上若干个交叉帽。环柄的个数叫<b>亏格</b> <Katex tex="g" />。可定向的情形只有球面与 <Katex tex="g" /> 个环柄的曲面，欧拉示性数满足</p>
    <p style="text-align:center"><Katex display tex="\chi=2-2g." /></p>
    <p>不可定向的闭曲面由交叉帽的个数决定，欧拉示性数为 <Katex tex="2-k" />。交叉帽可以想成把莫比乌斯带的边界收成一点，这个概念把不可定向的情形也纳入了同一套计数。</p>
    <p>分类定理有两层意义。其一，判断两张闭曲面是否同胚，只需算两个量：可定向性与亏格。其二，所有的闭曲面都能由一张多边形粘边得到，所以前面的 <Katex tex="V-E+F" /> 与这里的方向记号，是同一件事的两种写法。</p>

    <h3 class="sec" id="c4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：商拓扑是最细的那个。</strong>「开集多」是相对使投影连续的拓扑而言。把商拓扑换成更粗的，投影仍连续，但商空间的结构丢了。</li>
        <li><strong>提示二：粘边之前先看箭头。</strong>同向与反向粘出来是两类曲面，可定向性不同。箭头方向是粘合数据的一部分，不能省。</li>
        <li><strong>提示三：克莱因瓶放不进三维。</strong>任何把它放进三维空间的尝试都会自交。自交的图只是示意，曲面上那两处其实是分开的。</li>
        <li><strong>提示四：分类只看两个量。</strong>闭曲面同胚当且仅当可定向性相同、亏格相同。别拿「看起来都有洞」当依据，洞的个数要按亏格数。</li>
      </ul>
    </div>
    <p>回收与预告：曲面造出来了，接下来要判断两张曲面是不是同一张。连通分支、紧致性这些性质太粗，分不开环面与球面。需要更精细的不变量：先在多面体上数顶点、棱、面，得到欧拉示性数，再看闭环路怎么绕洞。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createQuotient } from '../../../boards/topology/compact/quotient.js';
import { TCN_CHAPTERS } from './cnav.js';
</script>
