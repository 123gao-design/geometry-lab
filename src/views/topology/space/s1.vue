<template>
  <ChPage :cur="1" no="拓1" base="/topology/s" :chapters="TSP_CHAPTERS"
    title="开集与拓扑"
    sub="拓扑学只留一件事：哪些点算「挨得近」。回答它的不是距离，而是一族叫开集的子集。三条公理一立，长度、角度、面积全部退场，剩下的是远近的骨架。"
    :toc="[{ id: 's1-axiom', t: '三条公理' }, { id: 's1-metric', t: '开球给出的原型' }, { id: 's1-example', t: '几族常见的开集' }, { id: 's1-compare', t: '粗细与比较' }, { id: 's1-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="X" /> 是非空集合，<Katex tex="\mathcal{T}" /> 是 <Katex tex="X" /> 的一族子集。若满足
      <ul>
        <li><Katex tex="\varnothing\in\mathcal{T}" />，<Katex tex="X\in\mathcal{T}" />；</li>
        <li>任意多个成员的并仍在 <Katex tex="\mathcal{T}" /> 里；</li>
        <li>有限多个成员的交仍在 <Katex tex="\mathcal{T}" /> 里，</li>
      </ul>
      就称 <Katex tex="\mathcal{T}" /> 是 <Katex tex="X" /> 上的一个<b>拓扑</b>，<Katex tex="\mathcal{T}" /> 里的每个集合叫<b>开集</b>，<Katex tex="(X,\mathcal{T})" /> 叫<b>拓扑空间</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createOpenSet" />
      <div class="cap">图 拓1 · <b>开集与开球机</b>：圆盘 <Katex tex="A" /> 里拖着一点 <Katex tex="P" />，球半径由滑块控制。看点：① 球整颗落在 <Katex tex="A" /> 里时描边转黄，跨出边界就转粉，判读跟着翻；② 圆周边上那枚粉点说明边界点的处境——它的任何小球都会同时碰到 <Katex tex="A" /> 与外部；③ 把 <Katex tex="P" /> 一点点推向圆周，能塞进球里的最大半径越缩越小，但总还有正的一点余量，这就是「开」字的含义。</div>
    </div>

    <h3 class="sec" id="s1-axiom">三条公理</h3>
    <p>拓扑的定义只有三条，内容都关于「并」与「交」。前两条要求全集与空集是开集、开集随便并仍开；第三条只允许有限个开集相交。为什么不是任意交？数轴上把开区间一层层交下去：</p>
    <p style="text-align:center"><Katex display tex="\bigcap_{n=1}^{\infty}\left(-\frac1n,\frac1n\right)=\{0\}," /></p>
    <p>右边是单点集。单点在通常的直线上不是开集——它里面的点挪一点点就出去了。一旦允许无限交，开集族会收缩到不该收的地步，所以第三条只能管有限个。</p>
    <p>有限交这一条常常被写成等价的局部形式：任意两个开集的交是开集。有了它，两个、三个、任意有限多个都能归纳着做下去，公理不必重复陈述。</p>

    <h3 class="sec" id="s1-metric">开球给出的原型</h3>
    <p>最常见的拓扑来自距离。设 <Katex tex="(X,d)" /> 是度量空间，把「开球」</p>
    <p style="text-align:center"><Katex display tex="B(x,r)=\{\,y\in X:\ d(x,y)<r\,\}" /></p>
    <p>能拼出的集合都算开集：<Katex tex="U" /> 是开集，指 <Katex tex="U" /> 里每一点 <Katex tex="x" /> 都配得上一颗球 <Katex tex="B(x,r)\subseteq U" />，半径可以随点变。这样的集族满足三条公理，叫<b>度量拓扑</b>。画板上的判读就是这句话：球塞得进去，<Katex tex="P" /> 就是内点。</p>
    <p>同一条公理在数轴上退化成熟悉的样子：开集是若干开区间的并。闭区间 <Katex tex="[0,1]" /> 不是开集，因为端点 <Katex tex="0" /> 配不出球；<Katex tex="(0,1)" /> 是开集，每一点都能往两边各让出一点。注意「开」说的是集合本身，不是它的边界看上去有没有口子。</p>

    <h3 class="sec" id="s1-example">几族常见的开集</h3>
    <p>任意集合 <Katex tex="X" /> 上都至少能装两族拓扑：</p>
    <ul>
      <li><b>平凡拓扑</b> <Katex tex="\{\varnothing,X\}" />。开集只有两个，任何两点都分不开，几乎所有点都挤在一起。</li>
      <li><b>离散拓扑</b> <Katex tex="\mathcal{T}=2^X" />，所有子集都开。每一点都孤零零的，球可以小到只装自己。</li>
    </ul>
    <p>这两个极端说明：拓扑是人为选定的结构，不是集合自带的。同一批点换一族开集，就成了另一个空间，远近关系完全变了。</p>
    <p>还有一族值得记住：<b>余有限拓扑</b>。规定空集与「补集为有限集」的子集是开集。它满足公理，却不是任何度量给出的拓扑——任意两个非空开集都相交，空间里没有两颗互不相交的球。这说明拓扑比距离宽，度量只是它的一类特例。</p>

    <h3 class="sec" id="s1-compare">粗细与比较</h3>
    <p>同一个集合上可以有好几族拓扑。若 <Katex tex="\mathcal{T}_1\subseteq\mathcal{T}_2" />，就说 <Katex tex="\mathcal{T}_2" /> 更细、<Katex tex="\mathcal{T}_1" /> 更粗。细的意思是可分的点更多，粗的意思是粘连得更厉害。离散拓扑最细，平凡拓扑最粗，中间的拓扑按包含关系排成一个偏序。</p>
    <p>比较两族拓扑时容易只看单个集合开不开，忘了看整族。正确的问题是：谁的开集更多。两个拓扑的并通常不是拓扑（有限的并与交不一定封闭），交倒还是拓扑，这个交叫它们的下确界。</p>

    <h3 class="sec" id="s1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：开集不是「看上去开口的集合」。</strong>判断依据只有一条——集合里每一点都能配一颗整颗落在里面的球。<Katex tex="(0,1]\cup(2,3)" /> 左端开右端闭，它不是开集，也不是闭集。</li>
        <li><strong>提示二：空集与全集必须是开集。</strong>这两条不是凑数的。没有它们，「开集的并仍是开集」在空并上就无从谈起，很多证明的第一步会立刻断掉。</li>
        <li><strong>提示三：第三条只管有限交。</strong>把「有限」改成「任意」，通常的直线拓扑立刻不满足，数轴上的开区间会被交成单点。</li>
        <li><strong>提示四：拓扑由人选，不由集合定。</strong>同一个 <Katex tex="X" /> 上可以装许多族开集。说「<Katex tex="X" /> 是拓扑空间」时，必须同时指明用的是哪族拓扑。</li>
      </ul>
    </div>
    <p>回收与预告：公理只说开集族要封闭，没说必须一次给出全部开集。实际做拓扑时，往往先挑一小批集合，再让它们自由地并、有限地交，把整族生成出来——这一小批就是下一章的「基」。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createOpenSet } from '../../../boards/topology/space/openset.js';
import { TSP_CHAPTERS } from './snav.js';
</script>
