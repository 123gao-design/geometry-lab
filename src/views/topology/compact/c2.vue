<template>
  <ChPage :cur="2" no="连2" base="/topology/c" :chapters="TCN_CHAPTERS"
    title="道路连通"
    sub="把「从一点走到另一点」写成连续映射，连通就有了一个能动手检验的版本。道路连通比连通强，却不与它等价：拓扑学家的正弦曲线整体连成一片，可有些点之间根本无路可走。"
    :toc="[{ id: 'c2-def', t: '道路与道路连通' }, { id: 'c2-impl', t: '道路连通推出连通' }, { id: 'c2-sine', t: '正弦曲线：连通而无路' }, { id: 'c2-comp', t: '道路分支与运算性质' }, { id: 'c2-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="x,y\in X" />。一条从 <Katex tex="x" /> 到 <Katex tex="y" /> 的<b>道路</b>是连续映射 <Katex tex="\gamma:[0,1]\to X" />，满足 <Katex tex="\gamma(0)=x" />、<Katex tex="\gamma(1)=y" />。若任意两点之间都有道路，称 <Katex tex="X" /> <b>道路连通</b>。固定基点 <Katex tex="x_0" /> 时，「从 <Katex tex="x_0" /> 出发又回到 <Katex tex="x_0" /> 的道路」叫<b>闭环路</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPathConn" />
      <div class="cap">图 连2 · <b>道路连通</b>：哑铃形空间里拖着两个端点，绿色曲线是一条真实的道路。看点：① 拖「路径进度」把道路一段段画出来，两端拖到圆盘任何位置，道路都画得出来；② 切到正弦曲线，<Katex tex="y=\sin\frac1x" /> 在原点附近抖得越来越密，整块集合仍然连通；③ 原点贴着竖线段，却接不上抖动的曲线——从它出发画不出任何一条走进曲线的道路。</div>
    </div>

    <h3 class="sec" id="c2-def">道路与道路连通</h3>
    <p>道路定义在闭区间上，参数是 <Katex tex="[0,1]" /> 上的实数。连续由上一节的开集原像保证；由于 <Katex tex="[0,1]" /> 紧致，道路的像也紧致，因而是有界闭集，这限制了道路能伸到多远。</p>
    <p>两条道路可以接起来。若 <Katex tex="\gamma" /> 从 <Katex tex="x" /> 到 <Katex tex="y" />、<Katex tex="\delta" /> 从 <Katex tex="y" /> 到 <Katex tex="z" />，拼接</p>
    <p style="text-align:center"><Katex display tex="(\gamma\cdot\delta)(t)=\begin{cases}\gamma(2t),&0\le t\le\tfrac12,\\[2pt]\delta(2t-1),&\tfrac12\le t\le1\end{cases}" /></p>
    <p>仍连续（两段在 <Katex tex="t=\tfrac12" /> 处都等于 <Katex tex="y" />），是从 <Katex tex="x" /> 到 <Katex tex="z" /> 的道路。倒着走也还是道路：<Katex tex="t\mapsto\gamma(1-t)" />。这三件事合起来说明，道路连通在拼接下封闭。</p>

    <h3 class="sec" id="c2-impl">道路连通推出连通</h3>
    <p>道路连通的空间一定连通。设 <Katex tex="X=U\cup V" /> 是分割，取 <Katex tex="x\in U" />、<Katex tex="y\in V" />，命一条道路 <Katex tex="\gamma" /> 连起它们。把 <Katex tex="[0,1]" /> 按 <Katex tex="\gamma^{-1}(U)" /> 与 <Katex tex="\gamma^{-1}(V)" /> 分开，两者不交、非空、相并是 <Katex tex="[0,1]" />，又都是开集（<Katex tex="\gamma" /> 连续），构成闭区间的一份分割。闭区间连通，矛盾。</p>
    <p>证明的关键是「道路的像连通」。任意一条道路的像都连通，所以它整条落在某一块里，不可能从 <Katex tex="U" /> 跨进 <Katex tex="V" /> 而不碰分界。这条论证也解释了为什么道路连通是一个更强的条件：它对每一对点都要求一条完整的像。</p>

    <h3 class="sec" id="c2-sine">正弦曲线：连通而无路</h3>
    <p>反过来不成立。取</p>
    <p style="text-align:center"><Katex display tex="S=\left\{\left(x,\sin\frac1x\right):0<x\le1\right\}\cup\left(\{0\}\times[-1,1]\right)," /></p>
    <p>第一块是抖动的曲线，它的闭包添上了整条竖线段。曲线自身与闭区间同胚，连通；它的闭包再并上曲线本身，夹在集合与闭包之间，也连通。所以 <Katex tex="S" /> 连通。</p>
    <p>可 <Katex tex="S" /> 不道路连通。取竖线段上的原点 <Katex tex="(0,0)" /> 与曲线上一点，设有一条道路 <Katex tex="\gamma" /> 相连。道路在 <Katex tex="t" /> 小的时候纵坐标必须接近 <Katex tex="0" />，而曲线在原点附近每个小区间里都扫过 <Katex tex="[-1,1]" /> 的全部高度，横坐标 <Katex tex="x(t)" /> 就被逼得来回跑，无法连续。用映像的紧致性可以把这个矛盾写严：任何一条落进曲线的道路，都会在某处被迫跳过中间值。</p>

    <h3 class="sec" id="c2-comp">道路分支与运算性质</h3>
    <p>「两点之间有道路」是等价关系：自反（停在原地）、对称（倒着走）、传递（拼接）。它的等价类叫<b>道路分支</b>，每个分支道路连通，分支之间无路可通。道路分支总是含在连通分支里，前者可能更细。</p>
    <p>道路连通比连通更好用，因为它对乘积与连续像都封闭：道路连通空间的乘积道路连通（分量各自走一条路），连续像道路连通（把道路复合过去）。连通性对乘积也成立，但证明要绕一层，用道路连通更直接。</p>
    <p>还有一档折中的条件叫<b>局部道路连通</b>：每一点都有道路连通的开邻域。加上它以后，连通分支与道路分支重合，正弦曲线那类反例被排除在外。多数几何里遇到的空间——流形、多面体、曲面——都满足这一条。</p>

    <h3 class="sec" id="c2-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：道路是映射，不是像。</strong>同一条曲线可以用不同速度走完，映射不同，道路不同。讨论同伦时比的正是映射，而不是它们画出来的图形。</li>
        <li><strong>提示二：道路连通强于连通，别倒过来说。</strong>连通不推出道路连通，正弦曲线是标准反例。考试里写「连通故有道路」是硬错。</li>
        <li><strong>提示三：拼接点必须对上。</strong>两条道路能拼，前提是第一条的终点等于第二条的起点。拼接后的参数要重新平分 <Katex tex="[0,1]" />，不能直接相加。</li>
        <li><strong>提示四：紧致性能否掉某些道路。</strong>道路的像紧致，所以「走到无穷远再回来」这种事办不到。判断无路时常从紧致性下手。</li>
      </ul>
    </div>
    <p>回收与预告：连通管「拆不拆得开」，道路管「走不走得到」。还有一条性质管「能不能被有限个小块盖住」，它与连续映射、闭区间上的极值定理关系密切——下一章的紧致性。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPathConn } from '../../../boards/topology/compact/pathconn.js';
import { TCN_CHAPTERS } from './cnav.js';
</script>
