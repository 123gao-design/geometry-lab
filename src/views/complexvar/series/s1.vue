<template>
  <ChPage :cur="1" no="级1" base="/complexvar/s" :chapters="CY_CHAPTERS"
    title="复级数与泰勒级数"
    sub="把函数写成幂级数，等于把它在一点附近的全部信息压进一列系数。实函数要专门验算余项，解析函数不用：只要点到奇点的距离限制住收敛半径，级数自己就收敛到函数上。"
    :toc="[{ id: 's1-num', t: '复数项级数' }, { id: 's1-pow', t: '幂级数与收敛圆' }, { id: 's1-taylor', t: '泰勒定理' }, { id: 's1-uniq', t: '系数的唯一性' }, { id: 's1-pit', t: '四条提示' }]">
    <div class="note good">若 <Katex tex="f" /> 在圆盘 <Katex tex="|z-z_0|<R" /> 内解析，则在这圆盘内 <Katex tex="f(z)=\sum_{n=0}^{\infty}\dfrac{f^{(n)}(z_0)}{n!}(z-z_0)^n" />，且右端在 <Katex tex="|z-z_0|<R" /> 内绝对收敛。收敛半径至少是 <Katex tex="R" />，而取成「到最近奇点的距离」时恰好等于它。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTaylor" />
      <div class="cap">图 级1 · <b>泰勒级数机</b>：左图金圈是收敛圆、红点是函数的奇点，点 <Katex tex="z" /> 可以拖进拖出；右图把前 <Katex tex="N+1" /> 个部分和依次连成一条折线，金色点是 <Katex tex="f(z)" />。看点：① <Katex tex="\dfrac1{1-z}" /> 在圈内折线向金点收拢，拖到圈外折线越走越远；② <Katex tex="e^z" /> 没有奇点，金圈退场，任何位置都收；③ <Katex tex="\dfrac1{1+z^2}" /> 的奇点落在 <Katex tex="\pm i" />，离原点正好一个单位，所以半径是 <Katex tex="1" />。</div>
    </div>

    <h3 class="sec" id="s1-num">复数项级数</h3>
    <p>复数项级数 <Katex tex="\sum_{n=1}^{\infty}z_n" /> 的收敛，照定义走：部分和 <Katex tex="S_N=z_1+\cdots+z_N" /> 有极限就算收敛，极限叫级数的和。把 <Katex tex="z_n=x_n+iy_n" /> 拆开，<Katex tex="S_N" /> 的实部与虚部各自是一个实级数的部分和，于是</p>
    <p style="text-align:center"><Katex display tex="\sum z_n\ \text{收敛}\iff\sum x_n\ \text{与}\sum y_n\ \text{都收敛}." /></p>
    <p>若 <Katex tex="\sum|z_n|" /> 收敛，就说原级数<b>绝对收敛</b>。绝对收敛的级数一定收敛，因为 <Katex tex="|x_n|\le|z_n|" />、<Katex tex="|y_n|\le|z_n|" />，正项级数的比较判别法把两个实级数一并压住。反过来不成立：<Katex tex="\sum\dfrac{(-1)^n}{n}" /> 收敛而不绝对收敛。</p>
    <p>必要条件与实级数一样：收敛则 <Katex tex="z_n\to0" />。这条只用来否定，例如 <Katex tex="\sum\left(\dfrac{1+i}{2}\right)^n" /> 的通项趋于零，级数确实收敛；而 <Katex tex="\sum\dfrac{n}{n+1}i^n" /> 的通项不趋于零，级数发散。</p>
    <p>幂级数的收敛性比一般级数整齐，因为各项都带同一个底数 <Katex tex="(z-z_0)^n" />，比值的模就决定了一切。</p>

    <h3 class="sec" id="s1-pow">幂级数与收敛圆</h3>
    <p>形如 <Katex tex="\sum_{n=0}^{\infty}a_n(z-z_0)^n" /> 的级数叫幂级数。<Katex tex="|z-z_0|=\rho" /> 上的项是 <Katex tex="a_n\rho^n" />，与辐角无关，所以收敛与否只取决于到 <Katex tex="z_0" /> 的距离。结论是：存在 <Katex tex="0\le R\le\infty" />，使 <Katex tex="|z-z_0|<R" /> 内绝对收敛、<Katex tex="|z-z_0|>R" /> 外发散；<Katex tex="R" /> 叫<b>收敛半径</b>。圆周上各点要逐个另判。</p>
    <p>求 <Katex tex="R" /> 用柯西-阿达马公式，或者更常用的比值法：</p>
    <p style="text-align:center"><Katex display tex="\frac1R=\limsup_{n\to\infty}\sqrt[n]{|a_n|},\qquad R=\lim_{n\to\infty}\left|\frac{a_n}{a_{n+1}}\right|." /></p>
    <p>两个式子只涉及系数，与 <Katex tex="z" /> 无关——这正是「收敛域是一个圆盘」的代数表现。画板左图的金圈就是这条圆周，拖动点只看它与圆心的距离。</p>
    <p>圆盘内幂级数可以逐项求导、逐项积分，收敛半径不变。这条性质把幂级数变成了一个「可以随便动」的对象，后面全靠它。</p>

    <h3 class="sec" id="s1-taylor">泰勒定理</h3>
    <p>解析函数的收敛半径有一个几何解释：等于 <Katex tex="z_0" /> 到 <Katex tex="f" /> 的最近奇点的距离。理由不难看出来。设 <Katex tex="f" /> 在 <Katex tex="z_0" /> 解析，最近的奇点为 <Katex tex="\zeta" />，距离 <Katex tex="d=|\zeta-z_0|" />。在 <Katex tex="|z-z_0|<d" /> 内以 <Katex tex="z_0" /> 为心作小圆，用柯西积分公式把 <Katex tex="\dfrac1{z-\zeta}" /> 展开成几何级数，逐项积分就得到幂级数；而圆外的奇点使级数不可能再往外收敛。</p>
    <p>三个例子把这条几何判据摆在画板上：<Katex tex="\dfrac1{1-z}" /> 的奇点在 <Katex tex="z=1" />，距原点 <Katex tex="1" />；<Katex tex="\dfrac1{1+z^2}" /> 的奇点在 <Katex tex="\pm i" />，距离也是 <Katex tex="1" />，尽管它在实轴上处处光滑；<Katex tex="e^z" /> 没有奇点，半径无穷。</p>
    <p>第二个例子值得停一下。<Katex tex="\dfrac1{1+x^2}" /> 在整条实轴上光滑得无可挑剔，可它的泰勒级数只在 <Katex tex="|x|<1" /> 内收敛。只看实轴找不出原因，抬到复平面就一目了然：奇点躲在虚轴上，不在实轴上。</p>
    <p>把 <Katex tex="z_0" /> 取成 <Katex tex="0" />，得到麦克劳林级数速查：<Katex tex="e^z=\sum\dfrac{z^n}{n!}" />、<Katex tex="\sin z=\sum\dfrac{(-1)^kz^{2k+1}}{(2k+1)!}" />、<Katex tex="\cos z=\sum\dfrac{(-1)^kz^{2k}}{(2k)!}" />、<Katex tex="\dfrac1{1-z}=\sum z^n" />、<Katex tex="\ln(1+z)=\sum\dfrac{(-1)^{n-1}z^n}{n}" />。最后一式的收敛半径是 <Katex tex="1" />，奇点在 <Katex tex="z=-1" />。</p>

    <h3 class="sec" id="s1-uniq">系数的唯一性</h3>
    <p>同一个函数在同一个圆盘内只有一个幂级数展开。若 <Katex tex="\sum a_n(z-z_0)^n=\sum b_n(z-z_0)^n" /> 在一个邻域内处处成立，逐项求 <Katex tex="n" /> 阶导再令 <Katex tex="z=z_0" />，得 <Katex tex="n!a_n=n!b_n" />，系数依次相等。所以「找出一组系数」就等于「找到了全部」。</p>
    <p>这条唯一性把级数运算变成了代数运算：两个级数相加、相乘，只需按幂次合并系数；求导、积分也在系数上逐项进行。画板上的部分和正是按这组唯一系数算出来的。</p>
    <p>还有一个推论：解析函数的零点若在一个有极限点的集合上全为零，则函数恒为零。理由是零点的集聚点变成一个「不是奇点的奇点」，泰勒系数被逐层压成零。这条结论后面在解析延拓里会用到——两个在某个小区域上相等的解析函数，在公共的解析区域上就必须处处相等。</p>
    <p>画板上把 <Katex tex="N" /> 拖大，误差单调变小；这个「变小的速度」也有用处，泰勒定理的余项估计与它同源。</p>

    <h3 class="sec" id="s1-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：收敛半径由最近奇点定，不由实轴上的光滑程度定。</strong><Katex tex="\dfrac1{1+x^2}" /> 在实轴上处处光滑，半径仍是 <Katex tex="1" />，因为奇点在 <Katex tex="\pm i" />。</li>
        <li><strong>提示二：圆周上要另判。</strong>半径只说圆内圆外，圆周上的点可能收敛也可能发散，例如 <Katex tex="\sum\dfrac{z^n}{n}" /> 在 <Katex tex="z=1" /> 发散、在 <Katex tex="z=-1" /> 收敛。</li>
        <li><strong>提示三：部分和是一条折线，不是一个点。</strong>每多取一项，就在前一项的基础上加一个 <Katex tex="a_nz^n" />。看它收不收，要看整条折线是否向 <Katex tex="f(z)" /> 聚拢。</li>
        <li><strong>提示四：展开中心换位置，系数全换。</strong>以 <Katex tex="z_0" /> 为中心的级数只在该点的圆盘内有效，换个中心要重算系数，不能把旧系数搬过去。</li>
      </ul>
    </div>
    <p>回收与预告：泰勒级数要求圆盘内处处解析。若展开区域是一个去掉圆心的环带，圆内有一个奇点，正幂项就不够用了，得允许负幂——这正是洛朗级数的来历。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTaylor } from '../../../boards/complexvar/series/taylor.js';
import { CY_CHAPTERS } from './cynav.js';
</script>
