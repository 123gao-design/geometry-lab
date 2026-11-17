<template>
  <ChPage :cur="1" no="形1" base="/fractal/s" :chapters="FX_CHAPTERS"
    title="康托集"
    sub="从单位线段起，每一步挖去每段中间的三分之一。极限集的总长度为零，点数却与整条线段一样多，还是个不可数的闭集。"
    :toc="[{ id: 's1-build', t: '逐层挖空' }, { id: 's1-ternary', t: '三进制刻画' }, { id: 's1-odd', t: '为零的长度，不少的点' }, { id: 's1-tip', t: '四条提示' }]">
    <div class="note good">记 <Katex tex="C_0=[0,1]" />，<Katex tex="C_{n+1}" /> 为把 <Katex tex="C_n" /> 的每个区间挖去中间三分之一后剩下的部分，<Katex tex="C=\bigcap_{n\ge0}C_n" /> 称为<b>三分康托集</b>。它是紧集、无孤立点、完全不连通，勒贝格测度为 0，相似维数为 <Katex tex="\ln2/\ln3\approx0.631" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCantor" />
      <div class="cap">图 形1 · <b>康托集的构造</b>：每一行是一层，红色虚线是这一层新挖掉的中段。看点：① 区间数每层乘 2，总长每层乘 <Katex tex="2/3" />；② 层数推到 5，总长只剩 0.132，还在继续缩；③ 每层留下的每一段，都是上一层某一段的精确缩印——自相似结构在每一行重复。</div>
    </div>

    <h3 class="sec" id="s1-build">逐层挖空</h3>
    <p>第一层挖掉 <Katex tex="(1/3,2/3)" />，剩两段；第二层在每段里再挖掉中间三分之一，剩四段；如此下去。第 <Katex tex="n" /> 层剩 <Katex tex="2^n" /> 段，每段长 <Katex tex="3^{-n}" />，总长</p>
    <p style="text-align:center"><Katex display tex="|C_n|=2^n\cdot 3^{-n}=\left(\frac23\right)^n\to0." /></p>
    <p>挖掉的总长度是 <Katex tex="\tfrac13+\tfrac29+\tfrac4{27}+\cdots=1" />。长度全被挖光，剩下的却不是一个空集：每层至少留着 <Katex tex="2^n" /> 段，极限点一个都没少。</p>
    <p>康托集是闭集：它是闭集 <Katex tex="C_n" /> 的交。它没有孤立点：任取 <Katex tex="x\in C" />，它所在的第 <Katex tex="n" /> 层小段长度 <Katex tex="3^{-n}\to0" />，段内另一个康托点任意接近 <Katex tex="x" />。闭且无孤立点，这样的集合叫<b>完备集</b>。</p>

    <h3 class="sec" id="s1-ternary">三进制刻画</h3>
    <p>把 <Katex tex="[0,1]" /> 中的数写成三进制小数。挖去中间三分之一，就是禁止第一位小数取 1；在每一段里再挖中间三分之一，就是禁止第二位取 1。层层禁止后，</p>
    <p style="text-align:center"><Katex display tex="C=\left\{\sum_{k=1}^{\infty}\frac{a_k}{3^k}\ :\ a_k\in\{0,2\}\right\}." /></p>
    <p>每个三进制位只有两种取法，所以 <Katex tex="C" /> 与二进制串的全体 <Katex tex="\{0,1\}^{\mathbb N}" /> 一一对应。对应映射 <Katex tex="\sum a_k3^{-k}\mapsto\sum (a_k/2)2^{-k}" /> 连续且满射，于是 <Katex tex="C" /> 与 <Katex tex="[0,1]" /> 等势——它是不可数集。</p>
    <p>端点要当心。 <Katex tex="\tfrac13" /> 的三进制写法可以是 <Katex tex="0.1_3" />，也可以是 <Katex tex="0.0222\ldots_3" />；按后一种写法它属于 <Katex tex="C" />。凡是有两种写法的点都落在端点，规定一律取只含 0 与 2 的那种，对应关系就整齐了。</p>

    <h3 class="sec" id="s1-odd">为零的长度，不少的点</h3>
    <p>康托集把两个直觉同时打破。按长度看，它是零测集，几乎「不存在」；按基数看，它与区间等势，点多得不可数。长度与点数不是一回事。</p>
    <p>它也不含任何区间：任何开区间里都夹着某一步挖掉的中段。加上完全不连通（任意两点都能被某个挖空的区间分开），康托集是「点状」的，却又是完备的。</p>
    <p>这种集合还是构造反例的常用零件。把康托集嵌入平面，可造出面积为零、却连接两点的曲线；把各层长度改一改，可造出正测度的「胖康托集」，维数接近 1。变的是比例，不变的是「每层按固定规则挖空」的结构。</p>

    <h3 class="sec" id="s1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：挖掉的总长是 1，但集合不空。</strong>长度可加只对可数多个区间成立，极限集不是区间，不能拿「总长等于 1」推出「什么都不剩」。</li>
        <li><strong>提示二：端点属于康托集。</strong><Katex tex="1/3" />、<Katex tex="2/3" />、<Katex tex="1/9" /> 都在 <Katex tex="C" /> 里。挖去的是开区间，端点保留。</li>
        <li><strong>提示三：三进制不能出现 1。</strong>出现 1 就意味着某一步落在了挖掉的中段。用这条判据比逐层画图快得多。</li>
        <li><strong>提示四：零测不等于可数。</strong>康托集测度为 0，基数却是连续统。测度小和点数少是两个独立的性质。</li>
      </ul>
    </div>
    <p>回收与预告：康托集每次把长度乘 <Katex tex="2/3" />，结构留在点上。把同样的折角动作搬到平面上，让每一步的线段变长而不是变短，就得到处处转折的科赫曲线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCantor } from '../../../boards/fractal/shape/cantor.js';
import { FX_CHAPTERS } from './fxnav.js';
</script>
