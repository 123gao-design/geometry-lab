<template>
  <ChPage :cur="7" no="群7" base="/algebra/g" :chapters="AG_CHAPTERS"
    title="群作用与轨道-稳定子"
    sub="前面几章把群当成一个自带运算的集合，群元素只是些字母。这一章让它动起来：把群元素当作对某个集合的变换，看一个点能被送到哪些地方、又有哪些元素把它留在原地。两个数一乘恰好等于群的阶，这条等式把抽象的阶数与具体的计数接上，顺手解决「几种本质不同的染色」这类问题。"
    :toc="[{ id: 'g7-act', t: '群作用的定义' }, { id: 'g7-orb', t: '轨道与稳定子' }, { id: 'g7-thm', t: '轨道-稳定子定理' }, { id: 'g7-burn', t: '伯恩赛德引理' }, { id: 'g7-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="G" /> 是群，<Katex tex="X" /> 是非空集，映射 <Katex tex="G\times X\to X" />，<Katex tex="(g,x)\mapsto g\cdot x" /> 满足 <Katex tex="e\cdot x=x" /> 与 <Katex tex="(gh)\cdot x=g\cdot(h\cdot x)" />，称 <Katex tex="G" /> 作用在 <Katex tex="X" /> 上。此时对每个 <Katex tex="x" />，<Katex tex="\operatorname{Orb}(x)=\{g\cdot x:g\in G\}" /> 叫轨道，<Katex tex="\operatorname{Stab}(x)=\{g:g\cdot x=x\}" /> 叫稳定子，后者是 <Katex tex="G" /> 的子群。</div>

    <div class="board-wrap">
      <BoardMount :factory="createGAction" />
      <div class="cap">图 群7 · <b>群作用机</b>：左图是一个正方形与它的四顶点着色，八个按钮是正方形的全部对称变换；右图把十六种两色着色排成 <Katex tex="4\times4" />，金框圈出与当前着色同一轨道的成员。看点：① 依次按 <Katex tex="r" />、<Katex tex="s" />、<Katex tex="sr" />，左图的着色在换，右图的金框始终框住同一批卡片，一张也没出去；② 把编号拖到四顶点同色的两张，金框只剩自己一张，稳定子一栏跳到 <Katex tex="8" />；③ 随便挑一张，读数栏的「轨道 × 稳定子」恒等于 <Katex tex="8" />。</div>
    </div>

    <h3 class="sec" id="g7-act">群作用的定义</h3>
    <p>群作用就是把「群元素是变换」这句话写成两条规则。幺元什么也不动；两个元素相继作用，等于先作用一次再作用一次。只要这两条成立，群就真的在集合上「活动」起来了，而不再只是抽象符号之间的乘法表。</p>
    <p>例子到处都是。正方形的对称群作用在四个顶点上：旋转把顶点按环序推动，反射把它们成对交换。同一个群也作用在「顶点着色」的集合上，这时被搬动的不再是点，而是整张着色图案。画板右图的十六张卡片就是这个集合，群元素作用在这十六张卡片上。</p>
    <p>另一些常见的：一般线性群作用在向量空间上；群作用在自己的元素上（左乘），这时轨道就是左陪集；共轭作用 <Katex tex="g\cdot x=gxg^{-1}" /> 的轨道是共轭类，稳定子是中心化子。同一套定义，把陪集、共轭、对称全部收进来了。</p>

    <h3 class="sec" id="g7-orb">轨道与稳定子</h3>
    <p>一点 <Katex tex="x" /> 被全群搬过一遍，落点集就是轨道；把它留在原地的元素构成稳定子。两者回答的是互补的两个问题：能到哪儿去，谁不动它。</p>
    <p>轨道把集合切成互不相交的块：若 <Katex tex="\operatorname{Orb}(x)" /> 与 <Katex tex="\operatorname{Orb}(y)" /> 有公共点，则两轨道相等。理由很直接，若 <Katex tex="g\cdot x=h\cdot y" />，那么用 <Katex tex="g^{-1}" /> 作用，<Katex tex="y" /> 就落进了 <Katex tex="x" /> 的轨道，两边互含。于是集合被分成若干轨道，每条轨道内部彼此可达。</p>
    <p>稳定子是子群，验证只需两条：幺元显然固定 <Katex tex="x" />；若 <Katex tex="g,h" /> 都固定它，则 <Katex tex="gh^{-1}" /> 也固定它。它是 <Katex tex="G" /> 里「看不出 <Katex tex="x" /> 被动过」的那部分。画板左图按一个变换，若着色原样返回，这个变换就属于它的稳定子。</p>

    <h3 class="sec" id="g7-thm">轨道-稳定子定理</h3>
    <p>两个数之间有确定的乘积关系。把 <Katex tex="g\cdot x" /> 看成从 <Katex tex="G" /> 到 <Katex tex="\operatorname{Orb}(x)" /> 的映射，它是一个满射，并且 <Katex tex="g" /> 与 <Katex tex="h" /> 落点相同，当且仅当 <Katex tex="h^{-1}g\in\operatorname{Stab}(x)" />。也就是说，每个落点的原像都是一个左陪集，大小都等于 <Katex tex="|\operatorname{Stab}(x)|" />。于是</p>
    <p style="text-align:center"><Katex display tex="|G|=|\operatorname{Orb}(x)|\cdot|\operatorname{Stab}(x)|." /></p>
    <p>这条等式是拉格朗日定理的精细化。拉格朗日只给出子群的阶整除群的阶，这里把这个整除说成了一个具体的商：轨道大小。画板上八种变换作用在十六张卡片上，任取一张，轨道大小与稳定子大小的乘积永远是八。</p>
    <p>推论很实用：轨道大小整除群的阶，而且轨道上每一点的稳定子大小相同——虽然在不同的点处，稳定子的元素可以完全不同。共轭作用给出的推论是共轭类的大小整除群的阶，这一条在讨论有限群结构时反复用到。</p>

    <h3 class="sec" id="g7-burn">伯恩赛德引理</h3>
    <p>轨道的个数常被叫作「本质不同的方案数」，因为它把只差一个对称的变化视为同一种。数这个个数有一个巧办法：把注意力从轨道转到每个元素的不动点集上，</p>
    <p style="text-align:center"><Katex display tex="|\text{orbits}|=\frac{1}{|G|}\sum_{g\in G}|\operatorname{Fix}(g)|,\qquad \operatorname{Fix}(g)=\{x\in X:g\cdot x=x\}." /></p>
    <p>推导只用一次双重计数：数出满足 <Katex tex="g\cdot x=x" /> 的点对 <Katex tex="(g,x)" /> 的个数。按 <Katex tex="g" /> 数，得到右端的和；按点对所在的轨道数，同一轨道内各点被固定的元素个数相同，加起来恰好是 <Katex tex="|G|" />。两边相等，结论就出来了。</p>
    <p>正方形四顶点两色染色的例子里，十六张卡片被分成六条轨道。逐项核对不动点：幺元固定全部十六张；两个转角 <Katex tex="\pi/2" /> 的旋转只固定整片同色的两张；转 <Katex tex="\pi" /> 固定四张；四个反射各固定八张、八张、四张、四张。合起来 <Katex tex="16+2+2+4+8+8+4+4=48" />，除以八得 <Katex tex="6" />。画板右图的金框一共有六种，就是这六条轨道。</p>
    <p>换成三种颜色，同样一条公式给出 <Katex tex="(81+3+3+9+27+27+9+9)/8=21" />。做珠子项链、圆桌排位、棋盘染色这类题时，先找对称群，再数不动点，剩下的就是算术。</p>

    <h3 class="sec" id="g7-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：轨道-稳定子说的是同一点。</strong>轨道与稳定子必须对应同一个 <Katex tex="x" />。换到轨道上的另一点，两边都会变，但乘积不变。</li>
        <li><strong>提示二：稳定子是子群，轨道一般不是。</strong>轨道只是集合，通常没有群结构。把轨道当成商群来算，是概念上的错位。</li>
        <li><strong>提示三：伯恩赛德数的是轨道，不是不动点。</strong>公式里的不动点只是手段。最后除以群的阶，得到的才是「本质不同」的方案数。</li>
        <li><strong>提示四：群的阶要按整个对称群算。</strong>正方形的对称群有八个元素，四个旋转加四个反射。只数旋转时，两色染色的答案 <Katex tex="(16+2+4+2)/4" /> 恰好也等于 <Katex tex="6" />；换成三色，两者就分开，漏项立刻现形。</li>
      </ul>
    </div>
    <p>回收与预告：群作用把陪集、共轭、计数三件事统一在「轨道」这个词下，轨道-稳定子定理给出了阶数与轨道大小之间的确切关系。下一章换一种研究对象：把元素与元素之间的关系画成点与线，图论用度、路径、连通这些说法，去回答「能不能一笔画完」「最少几种颜色染得开」这类问题。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGAction } from '../../../boards/algebra/groupt/gaction.js';
import { AG_CHAPTERS } from './agnav.js';
</script>
