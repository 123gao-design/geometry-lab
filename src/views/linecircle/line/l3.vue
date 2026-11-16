<template>
  <ChPage :cur="3" no="直3" base="/linecircle/l" :chapters="LN_CHAPTERS"
    title="两条直线的位置关系"
    sub="两条直线要么相交、要么平行、要么重合。看斜率能分辨平行与垂直，看截距能分辨平行与重合；相交时联立方程求交点，平行时用一个公式读出两线间距离。"
    :toc="[{ id: 'l3-rel', t: '平行、垂直与相交' }, { id: 'l3-cross', t: '交点与方程组' }, { id: 'l3-dist', t: '三种距离' }, { id: 'l3-pit', t: '判据的前提' }]">
    <div class="note good">设两条非竖直直线 <Katex tex="l_1:y=k_1x+b_1" />、<Katex tex="l_2:y=k_2x+b_2" />。则 <Katex tex="l_1\parallel l_2" /> 当且仅当 <Katex tex="k_1=k_2" /> 且 <Katex tex="b_1\ne b_2" />；<Katex tex="l_1\perp l_2" /> 当且仅当 <Katex tex="k_1k_2=-1" />；<Katex tex="k_1\ne k_2" /> 时两线相交于唯一一点，交点是方程组的解。若 <Katex tex="k_1=k_2" /> 且 <Katex tex="b_1=b_2" />，两线重合。</div>

    <h3 class="sec" id="l3-rel">平行、垂直与相交</h3>
    <div class="board-wrap">
      <BoardMount :factory="createLineRel" />
      <div class="cap">图 直3 · <b>两条直线的位置关系</b>：金色 <Katex tex="l_1" />、绿色 <Katex tex="l_2" />，四个滑块分别控制两条直线的斜率与截距，橙色点 <Katex tex="P" /> 是交点。看点：把 <Katex tex="k_1" />、<Katex tex="k_2" /> 调成相等，两条线立刻平行，交点消失，距离徽章给出两线间距；把两个斜率调成乘积 <Katex tex="-1" />，交点处出现直角标记。</div>
    </div>
    <p>斜率相等意味着两条直线方向相同。方向相同而位置不同，就是平行；如果截距也相等，两条线完全重合，此时没有「两线之间」可言。斜率的乘积为 <Katex tex="-1" /> 时，两条直线的方向互相垂直，交点处成直角。</p>
    <p>用一般式判断更整齐。设 <Katex tex="l_1:A_1x+B_1y+C_1=0" />、<Katex tex="l_2:A_2x+B_2y+C_2=0" />，则 <Katex tex="l_1\parallel l_2" /> 的条件是 <Katex tex="A_1B_2-A_2B_1=0" /> 且 <Katex tex="B_1C_2-B_2C_1\ne0" />（或对应的 <Katex tex="A" />、<Katex tex="C" /> 行列式不为零）；垂直的条件是 <Katex tex="A_1A_2+B_1B_2=0" />。这两个式子对竖直直线同样有效，不必另开特例。</p>

    <h3 class="sec" id="l3-cross">交点与方程组</h3>
    <p>交点同时满足两条直线的方程，所以把两个方程联立求解即可。代入消元后得到关于 <Katex tex="x" /> 的一元一次方程：系数不为零时有唯一解，对应相交；系数为零而常数项不为零时无解，对应平行；系数与常数项同时为零时有无穷多解，对应重合。</p>
    <p>方程组解的个数与几何位置一一对应，这一点与二次方程判别式的三种情形同构：唯一解、无解、无穷多解，分别对应相交、平行、重合。</p>

    <h3 class="sec" id="l3-dist">三种距离</h3>
    <p><strong>两点间距离。</strong>由勾股定理，<Katex tex="|P_1P_2|=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}" />。</p>
    <p><strong>点到直线的距离。</strong>点 <Katex tex="P(x_0,y_0)" /> 到直线 <Katex tex="Ax+By+C=0" /> 的距离</p>
    <p style="text-align:center"><Katex tex="d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}." display /></p>
    <p>公式的分子把点代进直线方程的左端，分母是系数向量的模。点落在直线上时分子为零，距离为零，与图形一致。</p>
    <p><strong>两条平行线间的距离。</strong>把两条直线都写成一般式，并使 <Katex tex="x" />、<Katex tex="y" /> 的系数对应相等：<Katex tex="Ax+By+C_1=0" /> 与 <Katex tex="Ax+By+C_2=0" />。此时</p>
    <p style="text-align:center"><Katex tex="d=\frac{|C_1-C_2|}{\sqrt{A^2+B^2}}." display /></p>
    <p>若两条直线写成斜截式 <Katex tex="y=kx+b_1" /> 与 <Katex tex="y=kx+b_2" />，先化成 <Katex tex="kx-y+b_1=0" /> 与 <Katex tex="kx-y+b_2=0" />，再代入上式，得 <Katex tex="d=\dfrac{|b_1-b_2|}{\sqrt{1+k^2}}" />，也就是图中距离徽章所用的公式。</p>

    <h3 class="sec" id="l3-pit">判据的前提</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="k_1k_2=-1" /> 对竖直直线不成立。</strong>这个判据要求两条直线的斜率都存在。一条竖直、一条水平的直线同样垂直，但竖直直线没有斜率，乘积无从谈起。遇到含参数的题目，先讨论斜率不存在的情形。</li>
        <li><strong>提示二：<Katex tex="k_1=k_2" /> 只能推出平行或重合。</strong>还要比较截距。漏掉 <Katex tex="b_1\ne b_2" /> 会把重合误判成平行。</li>
        <li><strong>提示三：平行线距离公式没有统一系数。</strong><Katex tex="x+y+1=0" /> 与 <Katex tex="2x+2y+4=0" /> 是平行线，但不能直接取 <Katex tex="|1-4|/\sqrt{1+1}" />。先把第二条化成 <Katex tex="x+y+2=0" />，再用 <Katex tex="|1-2|/\sqrt{2}" />。</li>
        <li><strong>提示四：点到直线距离公式忘记绝对值。</strong>代入后可能得到负数，距离必须取绝对值。分母的根号也不能省，否则得到的是沿坐标轴方向的差，不是垂直距离。</li>
      </ul>
    </div>
    <p>回收与预告：本章的距离公式与位置关系判据会在「直线与圆」里反复使用：判断直线与圆的位置关系，本质上是比较圆心到直线的距离与半径；求弦长时，也用点到直线的距离配合勾股定理。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLineRel } from '../../../boards/linecircle/line/linerel.js';
import { LN_CHAPTERS } from './lnav.js';
</script>
