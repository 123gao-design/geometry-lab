<template>
  <ChPage :cur="3" no="连3" base="/topology/c" :chapters="TCN_CHAPTERS"
    title="紧致性"
    sub="紧致说的是一件有限性的事：无论用多少开集去盖住空间，总能只留下有限个就够。闭区间具备它，开区间不具备，差别只在两个端点。这条性质把「取极限」从无限步压成有限步，闭区间上的极值定理就靠它。"
    :toc="[{ id: 'c3-def', t: '开覆盖与有限子覆盖' }, { id: 'c3-heine', t: '闭区间紧致' }, { id: 'c3-func', t: '紧致与连续映射' }, { id: 'c3-metric', t: '度量空间里的判别' }, { id: 'c3-tip', t: '四条提示' }]">
    <div class="note good">拓扑空间 <Katex tex="X" /> 叫<b>紧致</b>的，若它的每个开覆盖都含有一个有限子覆盖：任给一族开集 <Katex tex="\{U_i\}_{i\in I}" /> 满足 <Katex tex="X=\bigcup_{i\in I}U_i" />，都存在有限多个下标 <Katex tex="i_1,\dots,i_n" /> 使 <Katex tex="X=U_{i_1}\cup\cdots\cup U_{i_n}" />。子集 <Katex tex="A\subseteq X" /> 紧致，指带子空间拓扑时紧致。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCompactness" />
      <div class="cap">图 连3 · <b>有限子覆盖机</b>：同一条数轴的闭区间与开区间。看点：① 闭区间这边几个彩色区间摞成一叠，段数一加就盖满，任意一族开覆盖里总能抽出有限个；② 切到开区间 <Katex tex="(0,1)" />，用 <Katex tex="\left(\frac{1}{k+1},\frac{1}{k-1}\right)" /> 一族去盖，红色缺口永远贴着 <Katex tex="0" />；③ 段数再多也只是把缺口往左挪一点，有限个无论如何盖不满——<Katex tex="(0,1)" /> 不紧致。</div>
    </div>

    <h3 class="sec" id="c3-def">开覆盖与有限子覆盖</h3>
    <p>定义里的量词顺序值得留意：先任取一族开覆盖，再断言存在有限个成员盖住全空间。有限个是从这族里挑，不是另找一族。这个顺序被调换，条件立刻变弱，几乎什么空间都满足。</p>
    <p>紧致性是拓扑性质，同胚保持。有限集紧致：任给开覆盖，给每个点挑一个覆盖它的开集，有限个点只要有限个开集。有界开区间不紧致，画板给出了完整的反例——缺口 <Katex tex="\left(0,\frac{1}{m+2}\right)" /> 里总有没被盖住的点。</p>
    <p>紧致的子集在豪斯多夫空间里必定闭。设 <Katex tex="A" /> 紧致、<Katex tex="X" /> 是豪斯多夫空间，任取 <Katex tex="x\notin A" />，对每个 <Katex tex="a\in A" /> 用分离性取一对不交开邻域，这些邻域盖住 <Katex tex="A" />；紧致性把它们压缩成有限个，交出不交的开集把 <Katex tex="x" /> 与 <Katex tex="A" /> 分开，所以补集开。</p>

    <h3 class="sec" id="c3-heine">闭区间紧致</h3>
    <p>闭区间 <Katex tex="[0,1]" /> 紧致，这是海涅—博雷尔定理的一维情形。证明用二分法：假设有一族开覆盖没有有限子覆盖，把 <Katex tex="[0,1]" /> 对半分，至少一半也没有；再对分，继续下去得到一列嵌套闭区间，长度趋于零。</p>
    <p>这列区间有唯一公共点 <Katex tex="c" />。覆盖里有一个开集 <Katex tex="U" /> 含 <Katex tex="c" />，<Katex tex="U" /> 开，所以它把 <Katex tex="c" /> 附近的一小段整段吞下去。而嵌套区间足够靠后时直径小于这段长度、又含 <Katex tex="c" />，就整个落在 <Katex tex="U" /> 里——一个开集盖住了它，与「没有有限子覆盖」矛盾。</p>
    <p>证明只用两条：闭区间的嵌套交非空（完备受限），以及开集在每点附近留有余量。把 <Katex tex="[0,1]" /> 换成 <Katex tex="(0,1)" />，第一条立刻失效——嵌套开区间可以交成空集，二分法就断在这里。</p>

    <h3 class="sec" id="c3-func">紧致与连续映射</h3>
    <p>紧致集在连续映射下的像紧致。设 <Katex tex="f:X\to Y" /> 连续、<Katex tex="X" /> 紧致，任给 <Katex tex="f(X)" /> 的一族开覆盖，把它们拉回成 <Katex tex="X" /> 的开覆盖；紧致性给出有限子覆盖，再映回去就是 <Katex tex="f(X)" /> 的有限子覆盖。</p>
    <p>这条推论就是极值定理。连续函数 <Katex tex="f:[0,1]\to\mathbb R" /> 的像紧致，而在 <Katex tex="\mathbb R" /> 里紧致等价于有界闭，所以像有最大值与最小值。存在最大值的论证常被写成数列：取一列点让函数值趋向上确界，抽收敛子列，再用连续性取极限。抽子列这一步之所以合法，正是紧致性。</p>
    <p>紧致还让连续双射自动成为同胚。若 <Katex tex="f:X\to Y" /> 连续、双射，<Katex tex="X" /> 紧致、<Katex tex="Y" /> 豪斯多夫，则逆映射连续。前一章里圆周参数化那个反例中的定义域 <Katex tex="[0,2\pi)" /> 不紧致，条件不满足，逆不连续就不奇怪了。</p>

    <h3 class="sec" id="c3-metric">度量空间里的判别</h3>
    <p>在 <Katex tex="\mathbb R^n" /> 里，紧致等价于有界闭，这是海涅—博雷尔定理的完整形式。有界是必须的：<Katex tex="\mathbb R" /> 自身闭却无界，用区间 <Katex tex="(-n,n)" /> 去盖就没有有限子覆盖。闭也是必须的：<Katex tex="(0,1)" /> 有界不闭，反例如上。</p>
    <p>度量空间里还有一条序列判别：紧致等价于每个序列都有收敛子列（列紧）。它把紧致换成了「随便取一列，总能捞出一个收敛的子列」，在具体计算里更好上手。注意子列的极限必须落在空间里，这也是闭条件的作用。</p>
    <p>紧致与完备不同。完备只保证柯西列收敛，不保证有界；紧致同时要住得下与收得拢。欧氏空间里的有界闭集两样都有，才等价于紧致。</p>

    <h3 class="sec" id="c3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：有限个要从给定的覆盖里挑。</strong>紧致不允许临时换一族开集。先在给定族里找有限子覆盖，找不到就是反例。</li>
        <li><strong>提示二：有界闭只是欧氏空间里的判别法。</strong>一般拓扑空间没有「有界」可言，得回到开覆盖定义。别把海涅—博雷尔的结论当普适判据。</li>
        <li><strong>提示三：紧致性在连续映射下不丢。</strong>像是紧的，但原像未必。<Katex tex="f(x)=x^2" /> 把闭区间映成闭区间，可 <Katex tex="(-1,1)" /> 的原像仍有界闭，换个函数就不一定。</li>
        <li><strong>提示四：紧致加连续双射才免检逆的连续性。</strong>缺了紧致，逆映射可能不连续。圆周参数化的反例，卡在定义域不紧致上。</li>
      </ul>
    </div>
    <p>回收与预告：连通与紧致回答了空间「整不整块」与「能不能有限盖住」。接下来把正方形、多边形这类平面块的边粘起来，看看能造出哪些曲面，以及这些曲面各自有什么整体特征。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCompactness } from '../../../boards/topology/compact/compactness.js';
import { TCN_CHAPTERS } from './cnav.js';
</script>
