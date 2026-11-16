<template>
  <ChPage :cur="1" no="微1" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="导数与切线"
    sub="曲线上两点连一条割线，让第二点向第一点靠拢，割线的极限位置就是切线；这条切线的斜率叫导数。"
    :toc="[{ id: 'd1-quot', t: '差商与割线' }, { id: 'd1-def', t: '导数的定义' }, { id: 'd1-smooth', t: '可导与连续' }, { id: 'd1-mean', t: '两种读法' }]">

    <div class="note good" id="d1-quot">函数 <Katex tex="y=f(x)" /> 在点 <Katex tex="x_0" /> 处的<b>导数</b>是差商的极限：<Katex tex="f'(x_0)=\lim\limits_{h\to0}\dfrac{f(x_0+h)-f(x_0)}{h}" />。差商是割线的斜率，取极限之后是切线的斜率。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTanLine" />
      <div class="cap">图 微1 · <b>切线斜率机</b>：蓝线是曲线，<Katex tex="P" /> 固定、<Katex tex="Q" /> 随 <Katex tex="h" /> 移动，橙色是割线 <Katex tex="PQ" />，金色虚线是该点的切线。右栏列出 <Katex tex="f(x_0+h)" />、<Katex tex="f(x_0)" />、差商与 <Katex tex="f'(x_0)" /> 的数值。看点：把 <Katex tex="h" /> 一路拖小，割线绕 <Katex tex="P" /> 转动，最后一差归零。</div>
    </div>

    <h3 class="sec" id="d1-quot">差商与割线</h3>
    <p>过曲线 <Katex tex="y=f(x)" /> 上两点 <Katex tex="P(x_0,f(x_0))" /> 与 <Katex tex="Q(x_0+h,f(x_0+h))" /> 作直线，这条直线叫<b>割线</b>。它的斜率由两点纵坐标之差除以横坐标之差得到：</p>
    <p style="text-align:center"><Katex display tex="k=\dfrac{f(x_0+h)-f(x_0)}{h}" /></p>
    <p>这个比值叫<b>差商</b>，量的是 <Katex tex="x" /> 每变动一个单位、<Katex tex="y" /> 平均变动多少。它的含义是「平均」：整段区间上的平均变化率。</p>
    <p>让 <Katex tex="h" /> 变小，<Katex tex="Q" /> 沿曲线滑向 <Katex tex="P" />，割线跟着绕 <Katex tex="P" /> 转动。转动有一个极限位置——在这一点与曲线相切的那条直线。<Katex tex="h" /> 取不到零（分母不能为零），所以切线不是某一条割线，而是割线族的极限。<Katex tex="h" /> 越小，割线与切线的夹角越小；图 微1 右栏的「还差」一栏就是两个斜率之差，它随 <Katex tex="h" /> 一起缩小。</p>
    <p>以 <Katex tex="y=x^2" />、<Katex tex="x_0=1" /> 为例，差商化简后是 <Katex tex="2+h" />，与 <Katex tex="h" /> 无关的那部分 <Katex tex="2" /> 留了下来。这一步化简是求导的常用手法：先约掉分母上的 <Katex tex="h" />，再令它为零。</p>

    <h3 class="sec" id="d1-def">导数的定义</h3>
    <p>把「割线斜率的极限」写成式子，就得到导数的定义：</p>
    <p style="text-align:center"><Katex display tex="f'(x_0)=\lim_{h\to0}\frac{f(x_0+h)-f(x_0)}{h}=\lim_{x\to x_0}\frac{f(x)-f(x_0)}{x-x_0}" /></p>
    <p>两个式子是同一个极限的两种写法，前者把增量记作 <Katex tex="h" />，后者让动点直接趋向 <Katex tex="x_0" />。记号另有 <Katex tex="y'|_{x=x_0}" />、<Katex tex="\dfrac{\mathrm{d}y}{\mathrm{d}x}\Big|_{x=x_0}" /> 几种，含义相同。</p>
    <p>定义要求这个极限存在且有限。存在时称 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处<b>可导</b>，并把该极限值记作 <Katex tex="f'(x_0)" />。若对区间内每一点都可导，就得到一个新的函数 <Katex tex="f'(x)" />，叫<b>导函数</b>，简称导数。求导这个动作本身，就是从一个函数造出另一个函数。</p>
    <p>单侧极限也可以只取一侧，得到左导数 <Katex tex="f'_-(x_0)" /> 与右导数 <Katex tex="f'_+(x_0)" />。与两侧极限的道理一样，导数存在当且仅当左右导数都存在且相等。</p>

    <h3 class="sec" id="d1-smooth">可导与连续</h3>
    <p>可导比连续强。若 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处可导，则</p>
    <p style="text-align:center"><Katex display tex="f(x_0+h)-f(x_0)=\frac{f(x_0+h)-f(x_0)}{h}\cdot h\to f'(x_0)\cdot0=0" /></p>
    <p>即 <Katex tex="h\to0" /> 时函数值趋于 <Katex tex="f(x_0)" />，所以 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处连续。反过来不成立：<Katex tex="y=|x|" /> 在 <Katex tex="0" /> 处连续，但左侧差商恒为 <Katex tex="-1" />、右侧恒为 <Katex tex="1" />，左右导数不相等，故不可导。图形上表现为一个尖角，割线从两侧逼近时停在两个不同方向。</p>
    <p>还有一类更隐蔽的情形：曲线在一点有竖直切线，例如 <Katex tex="y=\sqrt[3]{x}" /> 在 <Katex tex="0" /> 处。这时差商趋于无穷，切线确实存在，但斜率不是有限数，按定义仍算不可导。可导要求切线既不竖直、也不出现尖角。</p>
    <p>与极3 的说法一致：不可导的点只可能是三类——尖角、竖直切线、间断点。处处可导的函数，图形一定是光滑的。</p>

    <h3 class="sec" id="d1-mean">两种读法</h3>
    <p><b>几何读法：</b>导数是切线的斜率。切线是曲线在一点附近的线性近似，斜率大的地方曲线陡，斜率为零的地方曲线水平，斜率变号的地方出现极值。</p>
    <p><b>物理读法：</b>若 <Katex tex="s(t)" /> 是位置，差商是这段时间内的平均速度，导数是瞬时速度。同样的结构可以换成任何一对「总量与它的变化率」：位移与速度、电量与电流、人口与增长率。极5 里 <Katex tex="\dfrac{\sin x}{x}\to1" /> 那条结论，到这里才显出用处：它保证了 <Katex tex="(\sin x)'=\cos x" /> 这项基本求导公式。</p>
    <p>两条读法在同一张图上：图 微1 里把 <Katex tex="x" /> 轴想成时间、<Katex tex="y" /> 轴想成路程，切线斜率就是该时刻的速度。后面几章讨论的单调性、极值、凹凸性，都是从这里读出来的形状。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：差商不能直接令 <Katex tex="h=0" />。</strong>分母为零式子没有意义。正确做法是先化简、约掉 <Katex tex="h" />，再取极限；直接代入得到的 <Katex tex="\dfrac00" /> 只是提示这里可能有极限，本身不是一个数。</li>
        <li><strong>提示二：导数是一个数，导函数是一个函数。</strong><Katex tex="f'(x_0)" /> 是点 <Katex tex="x_0" /> 处的导数；<Katex tex="f'(x)" /> 是整个区间上的导函数。做题时写「求 <Katex tex="f'(1)" />」与「求 <Katex tex="f'(x)" />」是两件事。</li>
        <li><strong>提示三：连续推不出可导。</strong>尖角与竖直切线是两类反例，都连续但不可导。判断可导必须真的算左右差商的极限，不能看图「看着挺顺」就下结论。</li>
        <li><strong>提示四：切线可能穿过曲线。</strong>「切线只与曲线有一个交点」是圆的特有性质，对一般曲线不成立。<Katex tex="y=x^3" /> 在原点的切线是 <Katex tex="x" /> 轴，它与曲线还相交于别处。切线的定义靠极限，不靠交点个数。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTanLine } from '../../../boards/calc1/deriv/tanline.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
