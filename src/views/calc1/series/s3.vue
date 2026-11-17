<template>
  <ChPage :cur="3" no="级3" base="/calc1/s" :chapters="SN_CHAPTERS"
    title="交错级数与绝对收敛"
    sub="正负相间的项把部分和夹在两支之间：两支一靠拢，级数就收敛；各停一处，就发散。"
    :toc="[{ id: 's3-two', t: '两支部分和' }, { id: 's3-err', t: '截断误差' }, { id: 's3-abs', t: '绝对收敛与条件收敛' }, { id: 's3-cond', t: '条件收敛的代价' }]">

    <div class="note good" id="s3-leibniz">若数列 <Katex tex="\{a_n\}" /> 单调递减且 <Katex tex="a_n\to0" />，则交错级数 <Katex tex="\sum(-1)^{n-1}a_n" /> 收敛，且其和 <Katex tex="S" /> 夹在任意一对相邻部分和之间。<Katex tex="|S-S_n|\le a_{n+1}" />，这就是<b>莱布尼茨判据</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createAltseries" />
      <div class="cap">图 级3 · <b>交错级数</b>：橙点是奇数项部分和，紫点是偶数项部分和，灰线把两者按顺序连起来。<b>看点</b>：前两档的两支点列从两侧一起靠向绿虚线；第三档的两支各停一处，距离不再缩小——只因通项趋于 1 而不趋于零。</div>
    </div>

    <h3 class="sec" id="s3-two">两支部分和</h3>
    <p>把部分和按奇偶分成两列。<Katex tex="S_{2k}-S_{2k-2}=a_{2k-1}-a_{2k}\ge0" />，偶数项部分和单调不减；<Katex tex="S_{2k+1}-S_{2k-1}=-a_{2k}+a_{2k+1}\le0" />，奇数项部分和单调不增。而 <Katex tex="S_{2k}-S_{2k-1}=-a_{2k}\le0" />，两支之间只隔着一项的宽度，这一项趋于零，于是两支挤向同一个值。</p>
    <p>图 级3 的第一档 <Katex tex="\sum(-1)^{n-1}/n" /> 收敛到 <Katex tex="\ln2" />，第二档 <Katex tex="\sum(-1)^{n-1}/n^2" /> 收敛到 <Katex tex="\pi^2/12" />。两档的区别只在项缩小得快慢：平方的项缩得快，两支靠得更迅速。</p>
    <p>收敛不要求两支从同侧逼近，也不要求和的数值好算。这里用的只有单调与趋于零两条，比起比值判别法更宽松，代价是只能对交错的形状使用。</p>

    <h3 class="sec" id="s3-err">截断误差由下一项控制</h3>
    <p>莱布尼茨判据还附送一个估计：截到第 <Katex tex="n" /> 项，误差不超过下一项的绝对值 <Katex tex="a_{n+1}" />。这条估计在数值计算里非常实用——想要几位小数，算出下一项小于那个量级停手即可，不必知道级数的和是多少。</p>
    <p>图 级3 右栏的误差行随 <Katex tex="n" /> 更新。把 <Katex tex="n" /> 加大，误差行单调地变小，但收敛速度由 <Katex tex="a_n" /> 决定：调和型只给 <Katex tex="1/n" /> 的精度，平方型给 <Katex tex="1/n^2" />。</p>

    <h3 class="sec" id="s3-abs">绝对收敛与条件收敛</h3>
    <p>若 <Katex tex="\sum|a_n|" /> 收敛，称 <Katex tex="\sum a_n" /> <b>绝对收敛</b>；若 <Katex tex="\sum a_n" /> 收敛而 <Katex tex="\sum|a_n|" /> 发散，称它<b>条件收敛</b>。绝对收敛可推出收敛，反过来不成立：<Katex tex="\sum 1/n" /> 本身就发散，而交错调和级数 <Katex tex="\sum(-1)^{n-1}/n" /> 收敛。</p>
    <p>绝对收敛的级数可以任意重排、可以逐项乘、可以拆成两列正负项分别求和，这些操作都以「绝对收敛」为前提。条件收敛的级数重排之后和会改变，甚至可以重排成发散，所以在条件收敛的级数上做代数变形要格外小心。</p>
    <p>判断顺序建议这样走：先看 <Katex tex="\sum|a_n|" /> 收敛与否，用正项级数那一套（比值、比较、p 级数）直接判；不收敛再看是否交错，是否能套莱布尼茨；两条都不成立才另找办法。</p>

    <h3 class="sec" id="s3-cond">条件收敛的代价</h3>
    <p>条件收敛的级数靠正负相消才勉强收敛，一旦改变相加的次序，抵消的比例就变了。黎曼重排定理指出：条件收敛级数重排后可以得到任意指定的实数，也可以重排成发散到无穷。交错调和级数正是这样的例子——它本身收敛到 <Katex tex="\ln2" />，但把正项与负项各自按住、换一种交错方式，和就能挪到任意处。</p>
    <p>这条事实把「无穷和可以随便重排」这个直觉彻底推翻。有限和与无限和之间不是量的差别，而是性质上的差别。凡是涉及交换求和次序的推导，都要先确认绝对收敛，否则结论只在保序重排下成立。</p>
    <p>图 级3 的第二档也有同样的提醒：平方型的项衰减够快，取绝对值后 <Katex tex="\sum1/n^2" /> 收敛，它就是绝对收敛的，重排不受影响。把两档放在一起对照，能看出「收敛」与「稳定地收敛」是两件不同的事。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：单调递减这一条不能省。</strong>通项趋于零但摆动不规则的变号级数，不能直接套莱布尼茨判据。</li>
        <li><strong>提示二：误差界是对绝对值而言的。</strong><Katex tex="|S-S_n|\le a_{n+1}" /> 给的是绝对误差的上界，符号方向要自己判断。</li>
        <li><strong>提示三：绝对收敛与条件收敛不可混用。</strong>重排、逐项乘、分组这些操作只对绝对收敛的级数无条件成立。</li>
        <li><strong>提示四：条件收敛的级数换序会换和。</strong>交错调和级数重排后可以凑出任意给定的和，这不是计算失误，而是级数本身的性质。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAltseries } from '../../../boards/calc1/series/altseries.js';
import { SN_CHAPTERS } from './snav.js';
</script>
