<template>
  <ChPage :cur="4" no="重4" base="/calc2/r" :chapters="MR_CHAPTERS"
    title="三重积分"
    sub="三重积分就是把区域切成小立方块，每块用体积加权。化成一元积分时有两种顺序：沿一个方向穿一根线先积一个变量（先一后二），或者在某个高度横切一片先积两个变量（先二后一）。两种顺序算出同一个数。"
    :toc="[{ id: 'r4-def', t: '定义与两种顺序' }, { id: 'r4-one-two', t: '先一后二：穿线' }, { id: 'r4-two-one', t: '先二后一：切片' }, { id: 'r4-pit', t: '四条提示' }]">
    <div class="note good">把空间区域 <Katex tex="\Omega" /> 分成小块 <Katex tex="\Delta V_i" />，在每块上任取一点作和 <Katex tex="\sum f(\xi_i,\eta_i,\zeta_i)\Delta V_i" />，当所有小块的直径趋于零时若和趋于同一常数，就记作 <Katex tex="\iiint_\Omega f\,dV" />。在直角坐标下 <Katex tex="dV=dx\,dy\,dz" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTriplInt" />
      <div class="cap">图 重4 · <b>三重积分</b>：区域是圆柱 <Katex tex="x^2+y^2\le1" />、<Katex tex="0\le z\le2" />，被积函数 <Katex tex="1+z" />。① 在底面圆盘上拖一点，金色竖线沿 <Katex tex="z" /> 方向穿过整个柱体，内层 <Katex tex="\int_0^2(1+z)dz=4" />，再对底面圆盘积一次得 <Katex tex="4\pi" />；② 青色圆盘是高度 <Katex tex="z" /> 处的横切面，先对它积得 <Katex tex="\pi(1+z)" />，再对 <Katex tex="z" /> 从 0 积到 2，结果同为 <Katex tex="4\pi\approx12.57" />。</div>
    </div>

    <h3 class="sec" id="r4-def">定义与两种顺序</h3>
    <p>三重积分的定义与二重积分同构，只是小块从面积变成体积。它同样有线性、区域可加、保序、估值、中值几条性质，读法也很直接：<Katex tex="f\equiv1" /> 时是体积，<Katex tex="f" /> 是密度时是质量。</p>
    <p>计算的核心是把三层积分按某种顺序写成三次一元积分。三维空间的选择比二维多：先对哪个变量积，剩下的两个变量构成的区域是什么形状，这些决定了哪一种顺序写起来最省事。</p>
    <p>把区域投影到 <Katex tex="xOy" /> 面，得到平面区域 <Katex tex="D" />。过 <Katex tex="D" /> 内每一点作平行于 <Katex tex="z" /> 轴的直线，若它与 <Katex tex="\Omega" /> 的边界恰好交于两点，就得到两个曲面 <Katex tex="z_1(x,y)" />、<Katex tex="z_2(x,y)" />。这就是先一后二的条件。</p>

    <h3 class="sec" id="r4-one-two">先一后二：穿线</h3>
    <p>按 <Katex tex="x" />、<Katex tex="y" />、<Katex tex="z" /> 的次序积：</p>
    <p style="text-align:center"><Katex display tex="\iiint_\Omega f\,dV=\iint_D d\sigma\int_{z_1(x,y)}^{z_2(x,y)}f(x,y,z)\,dz." /></p>
    <p>内层对 <Katex tex="z" /> 积，把 <Katex tex="x" />、<Katex tex="y" /> 当常数，几何上就是沿一根竖线走完整个高度；积完得到只含 <Katex tex="x" />、<Katex tex="y" /> 的函数，再在投影区域 <Katex tex="D" /> 上做二重积分。画板的第一档演示的就是这条路线：竖线的起点与终点分别落在下底与上底。</p>
    <p>本图的具体计算是</p>
    <p style="text-align:center"><Katex display tex="\iint_D d\sigma\int_0^2(1+z)\,dz=\iint_D 4\,d\sigma=4\pi." /></p>
    <p>内层结果与 <Katex tex="x" />、<Katex tex="y" /> 无关，是常数的情形最省事：外层积分退化成「常数乘面积」。</p>

    <h3 class="sec" id="r4-two-one">先二后一：切片</h3>
    <p>换一个顺序，先对截面 <Katex tex="D_z" /> 做二重积分，再对 <Katex tex="z" /> 积：</p>
    <p style="text-align:center"><Katex display tex="\iiint_\Omega f\,dV=\int_{z_a}^{z_b}dz\iint_{D_z}f(x,y,z)\,d\sigma." /></p>
    <p>在高度 <Katex tex="z" /> 处横切一刀，得到平面区域 <Katex tex="D_z" />；内层在这个切片上积分，结果只含 <Katex tex="z" />；外层再把各高度的切片值累加起来。</p>
    <p>本图每一片都是圆盘，面积 <Katex tex="\pi" />，被积函数在这一片上取常值 <Katex tex="1+z" />，所以</p>
    <p style="text-align:center"><Katex display tex="\int_0^2\pi(1+z)\,dz=\pi\left[z+\frac{z^2}{2}\right]_0^2=4\pi." /></p>
    <p>两种顺序的取舍很明确：<b>投影区域简单、竖线穿过的上下曲面好写</b>时用先一后二；<b>截面形状规整、面积好算、被积函数含 <Katex tex="z" /> 或只依赖 <Katex tex="z" /></b> 时用先二后一。画板两个档各演示一种。</p>

    <h3 class="sec" id="r4-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：投影区域画错。</strong>投影 <Katex tex="D" /> 不是区域在 <Katex tex="xOy" /> 面上随便画的一个影子，而是所有竖线底端的集合；上下底不平的区域要按最高与最低处分别判断。</li>
        <li><strong>提示二：竖线穿过两次。</strong>若竖线与边界交点多于两点，比如区域是环状或弯曲的，就要分段，或者换一个方向穿线。</li>
        <li><strong>提示三：先二后一的切片不是区域。</strong>切片必须落在 <Katex tex="\Omega" /> 内部，<Katex tex="z" /> 超出 <Katex tex="[z_a,z_b]" /> 处没有截面，写限时别覆盖到外面。</li>
        <li><strong>提示四：换了次序忘了改被积式的作用域。</strong>内层积完的变量不能再出现在外层限里；一旦出现，说明限写错了。</li>
      </ul>
    </div>
    <p>回收与预告：柱体、球体这类区域在直角坐标下投影是圆，写限要带根号。把投影面换成极坐标、或者整体换成球面坐标，限会变成常数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTriplInt } from '../../../boards/calc2/riemann/triplint.js';
import { MR_CHAPTERS } from './rnav.js';
</script>
