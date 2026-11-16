<template>
  <ChPage :cur="7" no="微7" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="单调性、极值与凹凸性"
    sub="导数的符号决定函数往哪走，二阶导数的符号决定曲线往哪弯。把两栏符号列成表，曲线的形状就定下来了。"
    :toc="[{ id: 'd7-mono', t: '单调性判据' }, { id: 'd7-ex', t: '极值的判定' }, { id: 'd7-concave', t: '凹凸与拐点' }, { id: 'd7-table', t: '列表作图' }]">

    <div class="note good" id="d7-mono">若在一区间上 <Katex tex="f'(x)>0" />，则 <Katex tex="f" /> 在该区间上单调递增；若 <Katex tex="f'(x)<0" />，则单调递减。极值点出现在导数变号处，凹凸性由 <Katex tex="f''" /> 的符号判定，凹凸性的分界点叫拐点。</div>

    <div class="board-wrap">
      <BoardMount :factory="createShapeLab" />
      <div class="cap">图 微7 · <b>单调与极值机</b>：上栏是 <Katex tex="f(x)=\dfrac{x^3}{3}-ax" />，下栏是它的导数 <Katex tex="x^2-a" />，两栏横轴对齐。下栏横轴上的绿色色带表示导数为正、红色表示导数为负。金色点与橙色点分别是极大值点、极小值点，紫色点是拐点。看点：拖动 <Katex tex="a" />，两个驻点同时向外分开；<Katex tex="a" /> 归零时色带连成一片，极值消失。</div>
    </div>

    <h3 class="sec" id="d7-mono">单调性判据</h3>
    <p>拉格朗日中值定理直接给出这条判据：在区间上任取 <Katex tex="x_1<x_2" />，有 <Katex tex="f(x_2)-f(x_1)=f'(\xi)(x_2-x_1)" />。区间长度为正，所以差的符号完全由 <Katex tex="f'(\xi)" /> 的符号决定。若区间上 <Katex tex="f'>0" /> 恒成立，则差恒为正，函数递增；<Katex tex="f'<0" /> 时同理递减。</p>
    <p>反过来，若 <Katex tex="f" /> 在区间上单调递增且可导，则 <Katex tex="f'(x)\ge0" />。这里只能取非负号：<Katex tex="x^3" /> 单调递增，但它在原点的导数为零。导数在个别点为零不影响整段的单调性。</p>
    <p>因此求单调区间的做法是：求出 <Katex tex="f'(x)" />，解 <Katex tex="f'(x)=0" />，再用这些根把定义域切段，在每一段上取一个试值点判断符号。图 微7 下栏的色带画的就是这个结果，根 <Katex tex="\pm\sqrt{a}" /> 正是色带中断的位置。</p>

    <h3 class="sec" id="d7-ex">极值的判定</h3>
    <p><b>必要条件：</b>可导的极值点必为驻点，即 <Katex tex="f'(x_0)=0" />。这是费马引理，反过来不成立。</p>
    <p><b>第一充分条件：</b>若 <Katex tex="f'(x_0)=0" />，且在 <Katex tex="x_0" /> 左右两侧导数变号，则 <Katex tex="x_0" /> 是极值点；由正变负为极大，由负变正为极小；不变号则不是极值点。</p>
    <p><b>第二充分条件：</b>若 <Katex tex="f'(x_0)=0" /> 且 <Katex tex="f''(x_0)\ne0" />，则 <Katex tex="x_0" /> 是极值点，<Katex tex="f''(x_0)<0" /> 为极大，<Katex tex="f''(x_0)>0" /> 为极小。它比第一条件好用，但要求二阶导数存在且非零。</p>
    <p>图 微7 的例子可以把两个条件对上。由 <Katex tex="f'=x^2-a" /> 得驻点 <Katex tex="\pm\sqrt a" />，<Katex tex="f''=2x" /> 在 <Katex tex="-\sqrt a" /> 处为负、在 <Katex tex="\sqrt a" /> 处为正，于是左边是极大、右边是极小。极值分别为 <Katex tex="\pm\dfrac{2}{3}a^{3/2}" />，右栏实时给出。</p>
    <p>求最值时不能只看驻点。闭区间上的最值还要比较端点：若 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上连续，最大值与最小值只可能出现在驻点、不可导点与端点这三类位置中，逐个算出来比较即可。</p>

    <h3 class="sec" id="d7-concave">凹凸与拐点</h3>
    <p>单调性讲的是曲线的走向，凹凸性讲的是弯曲的方向。若曲线在区间上位于任意两点连线（弦）的下方，称函数在该区间上是<b>凹</b>的（也叫凸函数）；若位于弦的上方，称<b>凸</b>的。两种说法在教材里常互换，判断时以 <Katex tex="f''" /> 的符号为准最稳妥。</p>
    <p>判据是：在区间上 <Katex tex="f''(x)>0" />，曲线向上弯，函数为凹；<Katex tex="f''(x)<0" />，曲线向下弯，函数为凸。理由与单调性相同，只是把 <Katex tex="f" /> 换成 <Katex tex="f'" />：<Katex tex="f''>0" /> 说明斜率在增大，曲线越走越陡，自然向上弯。</p>
    <p>凹凸性发生改变的点叫<b>拐点</b>。它必须是 <Katex tex="f''=0" /> 的点或 <Katex tex="f''" /> 不存在的点，且两侧符号确实相反。图 微7 的 <Katex tex="f''=2x" /> 在原点变号，所以原点就是拐点，用紫点标出。</p>
    <p>拐点与极值点是两类不同的点：前者说的是曲线怎么弯，后者说的是函数值在附近最大或最小。同一点可以既是极值点又是拐点吗？对可导函数不行：极值点处 <Katex tex="f'" /> 变号，拐点处 <Katex tex="f''" /> 变号，两者的判据不同。这一点在后面提示里再说明。</p>

    <h3 class="sec" id="d7-table">列表作图</h3>
    <p>把两类信息合到一张表里：横轴分成若干区间，每段填上 <Katex tex="f'" /> 与 <Katex tex="f''" /> 的符号，再写上行情的走向。以 <Katex tex="f(x)=\dfrac{x^3}{3}-\dfrac32x" />（即图中的 <Katex tex="a=\dfrac32" />）为例，驻点为 <Katex tex="\pm\sqrt{1.5}\approx\pm1.22" />，拐点在 <Katex tex="0" />：</p>
    <p style="text-align:center"><Katex display tex="\begin{array}{c|cccccc} x & x<-\sqrt a & -\sqrt a & (-\sqrt a,0) & 0 & (0,\sqrt a) & x>\sqrt a \\ \hline f' & + & 0 & - & - & - & + \\ f'' & - & - & - & 0 & + & + \\ f & \nearrow & \text{极大} & \searrow & \text{拐点} & \searrow & \nearrow \\ \end{array}" /></p>
    <p>表格读法：第一行区间，第二、三行符号，最后一行走向。极大值出现在导数由正转负的驻点，拐点出现在二阶导数变号处，两者的位置与图 微7 上标记的点一一对得上。</p>
    <p>有了这张表，再补上端点值、与坐标轴的交点和渐近线（微8 专门讨论），函数图像就能画出来：每一段知道升降与弯曲方向，转折点知道坐标，远处知道走势。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：驻点不一定是极值点。</strong><Katex tex="y=x^3" /> 在原点的导数为零，但两侧导数都是正的，曲线一直上升。判断极值要看导数是否变号，不能只解 <Katex tex="f'=0" />。</li>
        <li><strong>提示二：极值点也可能不是驻点。</strong><Katex tex="y=|x|" /> 在原点取极小值，但该点不可导。所以找极值要把导数不存在的点一并检查。</li>
        <li><strong>提示三：<Katex tex="f''=0" /> 不一定是拐点。</strong><Katex tex="y=x^4" /> 在原点的二阶导数为零，但两侧都为正，曲线始终向上弯，没有拐点。拐点判据的核心是两侧 <Katex tex="f''" /> 变号。</li>
        <li><strong>提示四：单调区间要分开写。</strong>两段都是递增时，写成 <Katex tex="(-\infty,-1)\cup(-1,+\infty)" /> 是错的。函数在两段之间可能断开或下降，严格的说法是「在 <Katex tex="(-\infty,-1)" /> 上递增，在 <Katex tex="(-1,+\infty)" /> 上也递增」，不能合并。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createShapeLab } from '../../../boards/calc1/deriv/shapelab.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
