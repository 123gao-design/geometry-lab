<template>
  <ChPage :cur="3" no="级3" base="/complexvar/s" :chapters="CY_CHAPTERS"
    title="留数定理"
    sub="洛朗展开里只有 a₋₁ 这一项在绕圈的积分中留了下来，它因此单独得到名字：留数。一条闭曲线上的积分，就变成曲线围住的奇点各自留数之和乘上 2πi。复杂的积分问题被压缩成几处局部计算。"
    :toc="[{ id: 's3-def', t: '留数与它的求法' }, { id: 's3-thm', t: '留数定理' }, { id: 's3-real', t: '用它算实积分' }, { id: 's3-ex', t: '三组积分的对照' }, { id: 's3-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f" /> 在闭曲线 <Katex tex="C" /> 围成的区域内除有限个孤立奇点 <Katex tex="z_1,\dots,z_k" /> 外处处解析，在 <Katex tex="C" /> 上也解析，<Katex tex="C" /> 取逆时针，则 <Katex tex="\oint_C f(z)\,dz=2\pi i\sum_{j=1}^{k}\operatorname{Res}[f,z_j]" />。其中 <Katex tex="\operatorname{Res}[f,z_j]" /> 是 <Katex tex="f" /> 在 <Katex tex="z_j" /> 处的洛朗系数 <Katex tex="a_{-1}" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createResidue" />
      <div class="cap">图 级3 · <b>留数定理机</b>：左图的金色圆路可以拖圆心、拉半径，圈内的奇点亮红并标出留数，圈外的转灰；右栏是留数之和、<Katex tex="2\pi i" /> 乘留数和、沿圆路数值积分的结果与两者的差。看点：① <Katex tex="\dfrac1{z^2+1}" /> 两个留数一正一负，圈住两个就归零；② <Katex tex="\dfrac1{z(z-2)}" /> 只圈住 <Katex tex="z=0" /> 时读 <Katex tex="-\pi i" />，把半径拉过 <Katex tex="2" /> 又归零；③ <Katex tex="\dfrac{z}{z^2+1}" /> 两个留数同为 <Katex tex="\tfrac12" />，圈住两个正好是 <Katex tex="2\pi i" />。</div>
    </div>

    <h3 class="sec" id="s3-def">留数与它的求法</h3>
    <p>把 <Katex tex="f" /> 在以 <Katex tex="z_0" /> 为心、半径足够小的圆上展开成洛朗级数，逐项积分。项 <Katex tex="a_n(z-z_0)^n" /> 沿圆路的积分：<Katex tex="n\ne-1" /> 时为 <Katex tex="2\pi i\,a_n R^{n+1}\cdot\dfrac1{2\pi i}\int_0^{2\pi}e^{i(n+1)\theta}d\theta" />，而 <Katex tex="e^{i(n+1)\theta}" /> 在一整圈上积分为零；只有 <Katex tex="n=-1" /> 时剩下 <Katex tex="2\pi i" />。于是</p>
    <p style="text-align:center"><Katex display tex="\oint_{|z-z_0|=\rho}f(z)\,dz=2\pi i\,a_{-1}\,." /></p>
    <p>这个 <Katex tex="a_{-1}" /> 就叫 <Katex tex="f" /> 在 <Katex tex="z_0" /> 处的<b>留数</b>，记作 <Katex tex="\operatorname{Res}[f,z_0]" />。它是洛朗展开里唯一「留得下来」的系数，名字由此而来。</p>
    <p>三类奇点各有快捷算法。<b>一阶极点</b>：</p>
    <p style="text-align:center"><Katex display tex="\operatorname{Res}[f,z_0]=\lim_{z\to z_0}(z-z_0)f(z)." /></p>
    <p><b><Katex tex="m" /> 阶极点</b>：</p>
    <p style="text-align:center"><Katex display tex="\operatorname{Res}[f,z_0]=\frac{1}{(m-1)!}\lim_{z\to z_0}\frac{d^{m-1}}{dz^{m-1}}\left[(z-z_0)^m f(z)\right]." /></p>
    <p>若 <Katex tex="f=\dfrac{g}{h}" />、<Katex tex="h(z_0)=0" /> 而 <Katex tex="h'(z_0)\ne0" />、<Katex tex="g(z_0)\ne0" />，则 <Katex tex="\operatorname{Res}[f,z_0]=\dfrac{g(z_0)}{h'(z_0)}" />。这条在有理函数里最快：<Katex tex="\dfrac1{z^2+1}" /> 的两个奇点 <Katex tex="\pm i" /> 处，<Katex tex="h'=2z" />，留数分别是 <Katex tex="\dfrac1{2i}" /> 与 <Katex tex="\dfrac1{-2i}" />，即 <Katex tex="-\dfrac i2" /> 与 <Katex tex="\dfrac i2" />。</p>

    <h3 class="sec" id="s3-thm">留数定理</h3>
    <p>把区域用几条小圆分别圈住每个奇点，再补几条割线把它们的边界和大曲线连成一个单连通区域。割线两侧的积分方向相反、数值相消，剩下几段小圆周与整条 <Katex tex="C" />。在「只剩下 <Katex tex="C" /> 与各小圆反向」这个新区域里 <Katex tex="f" /> 处处解析，柯西定理给出</p>
    <p style="text-align:center"><Katex display tex="\oint_C f\,dz=\sum_{j}\oint_{|z-z_j|=\rho_j}f\,dz=2\pi i\sum_j\operatorname{Res}[f,z_j]." /></p>
    <p>定理的分量全在「圈内有哪些奇点」上。同一个函数，换一条曲线、换一个圈法，积分就换一个值——这正是画板上拖圆心、拉半径时读数跟着跳的原因。凡是没被圈住的奇点，不管多近，都不进入结果。</p>
    <p>还有一条对无穷远点成立的配套结论：若 <Katex tex="f" /> 在扩充复平面上只有有限个奇点，则所有有限奇点与无穷远点的留数之和为零。它常用在「圈外的奇点比圈内的好算」的场合。</p>
    <p>画板右栏把三个数并排：留数之和、<Katex tex="2\pi i" /> 乘留数和、沿圆路数值积分。第三个数是直接按定义积出来的，与公式值相差不到 <Katex tex="0.001" />，说明两条路通向同一个答案。</p>

    <h3 class="sec" id="s3-real">用它算实积分</h3>
    <p>留数定理最重要的用途是求实积分。以 <Katex tex="\displaystyle\int_{-\infty}^{\infty}\frac{dx}{1+x^2}" /> 为例：把积分看成上半平面里一条闭合路径的一部分，路径由实轴段 <Katex tex="[-R,R]" /> 与上半平面的半圆弧拼成。当 <Katex tex="R\to\infty" />，弧上的积分趋于零（因为 <Katex tex="|f|\sim\dfrac1{R^2}" /> 而弧长只有 <Katex tex="\pi R" />），于是</p>
    <p style="text-align:center"><Katex display tex="\int_{-\infty}^{\infty}\frac{dx}{1+x^2}=2\pi i\operatorname{Res}[f,i]=2\pi i\cdot\frac1{2i}=\pi." /></p>
    <p>结果与直接求反正切的原函数一致，可这条路能处理原函数写不出来的情形。一般套路是三步：选一条能把实积分包进来的闭路；验证补上的那段积分趋于零；剩下的用留数定理算。</p>
    <p>还有一类含三角函数的积分，<Katex tex="\int_0^{2\pi}R(\cos\theta,\sin\theta)\,d\theta" />，用 <Katex tex="z=e^{i\theta}" /> 把积分搬到单位圆上，<Katex tex="\cos\theta=\dfrac{z+z^{-1}}2" />、<Katex tex="\sin\theta=\dfrac{z-z^{-1}}{2i}" />、<Katex tex="d\theta=\dfrac{dz}{iz}" />，整个积分变成单位圆内有理函数的留数和。这一步和向量的三角形式、欧拉公式是同一套语言。</p>

    <h3 class="sec" id="s3-ex">三组积分的对照</h3>
    <p>画板第一个预设把「一正一负」摆得最清楚：<Katex tex="\dfrac1{z^2+1}" /> 在 <Katex tex="\pm i" /> 的留数是 <Katex tex="-\dfrac i2" /> 与 <Katex tex="\dfrac i2" />，同时圈住时和为 <Katex tex="0" />，积分是 <Katex tex="0" />。若只圈住 <Katex tex="i" />，积分变成 <Katex tex="2\pi i\cdot\left(-\dfrac i2\right)=\pi" />，与上一节的实积分结果对上了。</p>
    <p>第二个预设 <Katex tex="\dfrac1{z(z-2)}" /> 演示「圈住谁」。默认半径 <Katex tex="1.2" /> 只圈住原点，留数 <Katex tex="-\dfrac12" />，积分 <Katex tex="-\pi i" />；把半径拉过 <Katex tex="2" />，两个奇点都进来，和为 <Katex tex="0" />，积分归零。</p>
    <p>第三个预设 <Katex tex="\dfrac{z}{z^2+1}" /> 的两个留数都是 <Katex tex="\dfrac12" />，同时圈住时和为 <Katex tex="1" />，积分 <Katex tex="2\pi i" />。三个预设加起来说明同一件事：积分的值只看圈内的留数之和，与曲线的形状、半径、被积函数在别处长什么样都无关。</p>

    <h3 class="sec" id="s3-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只算圈内的奇点。</strong>圈外的奇点再近也不进结果。画板上把圆心拖过去，红点会随位置变亮变灰，读数跟着跳，就是这个原因。</li>
        <li><strong>提示二：方向取逆时针。</strong>顺时针绕行时结果差一个负号。写成 <Katex tex="\oint_C" /> 时要说明方向，否则公式不能直接套。</li>
        <li><strong>提示三：可去奇点的留数为零。</strong>它没有负幂项，<Katex tex="a_{-1}=0" />。算出来是零并不等于算错，先确认它是不是可去奇点。</li>
        <li><strong>提示四：算实积分要单独验证补段趋于零。</strong>留数定理只负责闭路内那部分，实轴之外补上的弧是否消失，得用积分模估计逐个核过。</li>
      </ul>
    </div>
    <p>回收与预告：留数定理把「积分」变成了「奇点附近的局部信息之和」。这套做法还能换一个角度看函数本身——解析映射在局部把图形旋转并伸缩，方向之间的夹角因此不变，这正是下一章的保角性。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createResidue } from '../../../boards/complexvar/series/residue.js';
import { CY_CHAPTERS } from './cynav.js';
</script>
