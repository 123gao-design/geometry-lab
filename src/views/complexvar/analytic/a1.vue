<template>
  <ChPage :cur="1" no="解1" base="/complexvar/a" :chapters="CW_CHAPTERS"
    title="复变函数的导数"
    sub="实函数的差商只有左右两个方向可以靠拢，复变函数的差商却可以从四面八方来。要求所有方向读到同一个值，这个条件比实函数严得多，能满足的函数因此少得多，性质也好得多。"
    :toc="[{ id: 'a1-def', t: '差商与它的方向依赖' }, { id: 'a1-ana', t: '解析函数' }, { id: 'a1-rule', t: '求导规则' }, { id: 'a1-mean', t: '可导与连续、与实函数的分界' }, { id: 'a1-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="w=f(z)" /> 在点 <Katex tex="z_0" /> 的某个邻域内有定义。若差商 <Katex tex="\dfrac{f(z_0+\Delta z)-f(z_0)}{\Delta z}" /> 当 <Katex tex="\Delta z\to0" /> 时存在与趋近方式无关的极限，就说 <Katex tex="f" /> 在 <Katex tex="z_0" /> 处<b>可导</b>，这个极限记作 <Katex tex="f'(z_0)" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDerivC" />
      <div class="cap">图 解1 · <b>复变函数的导数与解析性</b>：左图从 <Katex tex="z_0" /> 引出两个小位移，红色沿实轴、橙色沿可调的方向角；右图把差商 <Katex tex="\dfrac{\Delta w}{\Delta h}" /> 画成点，并让位移方向转满一圈。看点：① <Katex tex="f=z^2" /> 的差商轨迹缩成一个点，两个方向的读数完全一样，导数存在；② <Katex tex="f=\bar z" /> 的差商轨迹是整条单位圆，方向一变读数就变，极限不存在；③ <Katex tex="f=|z|^2" /> 的轨迹是半径 <Katex tex="|z_0|" /> 的圆，只有把点拖到原点才缩成一点。</div>
    </div>

    <h3 class="sec" id="a1-def">差商与它的方向依赖</h3>
    <p>导数定义的式子与实函数一字不差，差别全在「<Katex tex="\Delta z\to0" />」上。实轴上 <Katex tex="\Delta z" /> 只能左右走，左右两个极限相等就够了；平面上 <Katex tex="\Delta z" /> 可以沿任何一条曲线靠近 <Katex tex="0" />，每一条路径都给出一个差商值，要求这些值全部相等。</p>
    <p>把位移写成 <Katex tex="\Delta z=\rho e^{i\varphi}" />，方向角 <Katex tex="\varphi" /> 就成了差商式子里显式的参数。若差商的极限与 <Katex tex="\varphi" /> 有关，极限就不存在。画板右图的差商轨迹正是把这件事画出来：轨迹缩成一点，说明方向没有影响；轨迹是一整条曲线，说明换方向换读数。</p>
    <p>举一个最简单的反例：<Katex tex="f(z)=\bar z" />。取 <Katex tex="\Delta z=\rho e^{i\varphi}" />，差商是</p>
    <p style="text-align:center"><Katex display tex="\frac{\overline{z_0+\Delta z}-\bar z_0}{\Delta z}=\frac{\overline{\Delta z}}{\Delta z}=e^{-2i\varphi}." /></p>
    <p>这个值只与方向有关，与 <Katex tex="\rho" /> 无关。沿实轴走过去得 <Katex tex="1" />，沿虚轴走过去得 <Katex tex="-1" />，两个方向就足以推翻极限的存在。所以共轭函数在复平面上处处不可导。</p>
    <p>再看 <Katex tex="f(z)=|z|^2" />。同样代进去整理：</p>
    <p style="text-align:center"><Katex display tex="\frac{|z_0+\Delta z|^2-|z_0|^2}{\Delta z}=\bar z_0+z_0e^{-2i\varphi}+\overline{\Delta z}." /></p>
    <p>最后一项随 <Katex tex="\rho\to0" /> 消失，剩下的部分仍含 <Katex tex="\varphi" />，除非 <Katex tex="z_0=0" />。所以它在原点可导、导数为 <Katex tex="0" />，在其他点都不可导。画板上把点拖到原点，轨迹才缩成一点。</p>

    <h3 class="sec" id="a1-ana">解析函数</h3>
    <p>一点可导还不足以撑起整套理论。把条件放宽一点：若 <Katex tex="f" /> 在 <Katex tex="z_0" /> 的某个邻域内处处可导，就说 <Katex tex="f" /> 在 <Katex tex="z_0" /> 处<b>解析</b>。在区域 <Katex tex="D" /> 内处处解析的函数，就叫 <Katex tex="D" /> 上的解析函数。</p>
    <p>「邻域内处处可导」比「一点可导」强得多。上面 <Katex tex="|z|^2" /> 在原点可导，可原点周围一片都不可导，所以它在原点不解析。这一类例子说明：可导是一个孤立的性质，解析则要求一整片。</p>
    <p>解析函数的全体恰好是后面几章的主角：它们沿闭路的积分为零（柯西定理），能展开成幂级数（泰勒定理），边界上的值决定内部的值（柯西积分公式）。这三条都不是硬加的条件，而是「一整片都可导」这个条件自己长出来的。</p>
    <p>多项式 <Katex tex="z^n" />、有理函数（分母不为零处）、<Katex tex="e^z" />、<Katex tex="\sin z" />、<Katex tex="\cos z" /> 都是解析函数。含 <Katex tex="\bar z" />、<Katex tex="|z|" />、<Katex tex="\operatorname{Re}z" /> 的式子一般不是，除非它们退化成常数。</p>

    <h3 class="sec" id="a1-rule">求导规则</h3>
    <p>可导的定义与实函数相同，四则运算、复合、反函数的求导法则也就原样成立：</p>
    <p style="text-align:center"><Katex display tex="(f\pm g)'=f'\pm g',\quad (fg)'=f'g+fg',\quad \left(\frac fg\right)'=\frac{f'g-fg'}{g^2}," /></p>
    <p style="text-align:center"><Katex display tex="\frac{d}{dz}f(g(z))=f'(g(z))\,g'(z),\qquad \left(f^{-1}\right)'(w)=\frac{1}{f'(z)}." /></p>
    <p>几个基本导数也照搬：<Katex tex="(z^n)'=nz^{n-1}" />、<Katex tex="(e^z)'=e^z" />、<Katex tex="(\sin z)'=\cos z" />、<Katex tex="(\cos z)'=-\sin z" />。反函数公式要求 <Katex tex="f'(z)\ne0" />，这条要求后面在保角映射里还会出现。</p>
    <p>用规则算几个：<Katex tex="(z^2)'=2z" />，在 <Katex tex="z_0=1+i" /> 处等于 <Katex tex="2+2i" />，与画板第一个预设的读数一致；<Katex tex="\left(\dfrac1z\right)'=-\dfrac{1}{z^2}" />，在去掉原点的平面上处处有定义；<Katex tex="(e^z)'=e^z" />，复指数函数是整个复平面上唯一「导数等于自己」的函数。</p>
    <p>共轭方向上的规则要当心：<Katex tex="\overline{f(z)}" /> 的导数一般不等于 <Katex tex="\overline{f'(z)}" /> 之外的东西。更稳妥的判据来自下一章：先把 <Katex tex="f=u+iv" /> 拆开，看 <Katex tex="u" />、<Katex tex="v" /> 是否满足一组偏微分方程。</p>

    <h3 class="sec" id="a1-mean">可导与连续、与实函数的分界</h3>
    <p>与实函数一样，可导必连续：差商极限存在时，<Katex tex="f(z_0+\Delta z)-f(z_0)=\Delta z\cdot\dfrac{\Delta f}{\Delta z}\to0" />。反过来不成立，<Katex tex="f(z)=\bar z" /> 连续却处处不可导，与实函数里的 <Katex tex="|x|" /> 在原点的情形同类。</p>
    <p>实函数里「处处连续、处处不可导」的例子要专门构造，例如魏尔斯特拉斯函数；复变函数里随手就能写出一个：<Katex tex="\bar z" />、<Katex tex="|z|" />、<Katex tex="\operatorname{Re}z" /> 都连续，也都处处不可导。原因仍是方向太多——只有一种「刚性」的函数才能扛住所有方向。</p>
    <p>这种刚性还带来一条实函数没有的性质：解析函数可导，就自动无穷次可导。实函数 <Katex tex="f(x)=x^2\sin(1/x)" /> 一点可导而导数不连续，复变函数里不会有这种事。这条结论要到柯西积分公式那一章才证得了，先记住这个对比。</p>
    <p>最后分清三种说法的范围：<b>可导</b>说的是一个点；<b>解析</b>说的是一个邻域；<b>整函数</b>说的是整个复平面。层层加强，用途也不同——柯西定理要求区域解析，公式里的高阶导数要求点解析。</p>

    <h3 class="sec" id="a1-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：可导要求所有方向读数相同。</strong>验过两个方向、四个方向都不算数。要证明不可导，找出两个给出不同值的方向就够；要证明可导，得回到定义做统的一估计。</li>
        <li><strong>提示二：一点可导不等于解析。</strong><Katex tex="|z|^2" /> 在原点可导，但在原点不解析，因为它周围一片都不可导。写「在区域 <Katex tex="D" /> 内解析」时，必须是整片 <Katex tex="D" />。</li>
        <li><strong>提示三：可导必连续，连续不必可导。</strong>复平面上的连续函数里，不可导的占绝大多数。<Katex tex="\bar z" /> 是最好的对照。</li>
        <li><strong>提示四：求导法则成立，但要先确认函数是解析的。</strong>把 <Katex tex="z^2" /> 换成 <Katex tex="\bar z^2" /> 之后，四则法则仍可形式地写，可形式写出的式子未必是导数。判定的落脚点还是下一章的柯西-黎曼方程。</li>
      </ul>
    </div>
    <p>回收与预告：差商的方向依赖只用到了「所有方向都要一样」这一句话，还没把它化成可以计算的式子。把 <Katex tex="f=u+iv" /> 拆成两个实函数，沿两条坐标轴分别取差商，就能得到一组偏导数的等式——柯西-黎曼方程。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDerivC } from '../../../boards/complexvar/analytic/derivc.js';
import { CW_CHAPTERS } from './cwnav.js';
</script>
