<template>
  <ChPage :cur="3" no="重3" base="/calc2/r" :chapters="MR_CHAPTERS"
    title="极坐标下的二重积分"
    sub="圆形、扇形、圆环这类区域，用极坐标写出来的边界是常数或简单的三角函数，直角坐标下的根号全部消失。代价是面积元不再是 dr dθ：同一段 dθ 在离极点越远的地方扫出的弧越长，多出来的因子 r 必须写进去。"
    :toc="[{ id: 'r3-elem', t: '面积元为什么多一个 r' }, { id: 'r3-region', t: '极坐标下区域的写法' }, { id: 'r3-case', t: '三类常见区域' }, { id: 'r3-pit', t: '四条提示' }]">
    <div class="note good">在极坐标下 <Katex tex="x=r\cos\theta" />、<Katex tex="y=r\sin\theta" />，面积元 <Katex tex="d\sigma=r\,dr\,d\theta" />，于是 <Katex tex="\iint_D f(x,y)\,d\sigma=\iint_{D'}f(r\cos\theta,r\sin\theta)\,r\,dr\,d\theta" />。若区域写成 <Katex tex="\alpha\le\theta\le\beta" />、<Katex tex="r_1(\theta)\le r\le r_2(\theta)" />，则化成 <Katex tex="\int_\alpha^\beta d\theta\int_{r_1(\theta)}^{r_2(\theta)}f\cdot r\,dr" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPolarDbl" />
      <div class="cap">图 重3 · <b>极坐标下的二重积分</b>：淡蓝是积分区域，浅灰是极坐标网格（同心圆与等分射线），橙色小格是 <Katex tex="(r,\theta)" /> 附近的一小块，两条边长分别是 <Katex tex="\Delta r" /> 与 <Katex tex="r\,\Delta\theta" />。三个预设：① 圆 <Katex tex="r\le2\cos\theta" />，面积 <Katex tex="\pi" />；② 半圆环 <Katex tex="1\le r\le2" />、<Katex tex="0\le\theta\le\pi" />，面积 <Katex tex="1.5\pi" />；③ 心形线 <Katex tex="r\le1+\cos\theta" />，面积 <Katex tex="1.5\pi" />。拖 <Katex tex="r" /> 让橙色小格向外移，看它的弧边长如何变长。</div>
    </div>

    <h3 class="sec" id="r3-elem">面积元为什么多一个 r</h3>
    <p>把 <Katex tex="(r,\theta)" /> 附近的一小块拿出来看。径向方向走过去 <Katex tex="\Delta r" /> 是直线段，长度就是 <Katex tex="\Delta r" />；角向方向走过 <Katex tex="\Delta\theta" />，扫过的却是一段弧，长度是 <Katex tex="r\,\Delta\theta" />——半径越大，同样的转角走得越远。</p>
    <p>这块在 <Katex tex="\Delta r" />、<Katex tex="\Delta\theta" /> 都很小时近似成矩形，于是</p>
    <p style="text-align:center"><Katex display tex="\Delta\sigma\approx r\,\Delta r\,\Delta\theta." /></p>
    <p>画板右栏的徽章给的是这块小扇环的精确面积 <Katex tex="\frac{(\Delta r)^2+2r\Delta r}{2}\Delta\theta" />，与 <Katex tex="r\,\Delta r\,\Delta\theta" /> 只差一个二阶小量。取极限后剩下的正是 <Katex tex="r\,dr\,d\theta" />。</p>
    <p>另一种看待方式来自雅可比行列式：换元 <Katex tex="(r,\theta)\mapsto(x,y)" /> 的雅可比 <Katex tex="\left|\partial(x,y)/\partial(r,\theta)\right|=r" />，二重积分换元后的面积元要乘上它。一般换元都要乘雅可比，极坐标只是最常用的一个特例。</p>

    <h3 class="sec" id="r3-region">极坐标下区域的写法</h3>
    <p>极坐标下的区域也写成两组不等式，顺序与直角坐标相反：外层是角度，内层是半径。通常写成</p>
    <p style="text-align:center"><Katex display tex="\alpha\le\theta\le\beta,\qquad r_1(\theta)\le r\le r_2(\theta)." /></p>
    <p>写限的步骤是：从极点引一条射线，看它以哪个方向、在哪个区间内能穿过区域，这就是 <Katex tex="\theta" /> 的范围；在每条射线上看它进入与离开区域的半径，这就是 <Katex tex="r" /> 的上下限。</p>
    <p>与直角坐标的 X 型、Y 型对应，极坐标也有「先 <Katex tex="r" /> 后 <Katex tex="\theta" />」与「先 <Katex tex="\theta" /> 后 <Katex tex="r" />」两种。大部分区域用前者，因为大部分常见边界的 <Katex tex="r" /> 能解成 <Katex tex="\theta" /> 的函数。</p>

    <h3 class="sec" id="r3-case">三类常见区域</h3>
    <p><b>圆心在极点的圆。</b><Katex tex="r\le a" />、<Katex tex="0\le\theta\le2\pi" />，<Katex tex="\iint_D d\sigma=\int_0^{2\pi}d\theta\int_0^a r\,dr=\pi a^2" />。换到直角坐标要写 <Katex tex="\int_{-a}^a dx\int_{-\sqrt{a^2-x^2}}^{\sqrt{a^2-x^2}}dy" />，两种写法的差别一目了然。</p>
    <p><b>过极点的圆。</b><Katex tex="r\le2a\cos\theta" /> 是圆心在 <Katex tex="(a,0)" />、半径 <Katex tex="a" /> 的圆；<Katex tex="\theta" /> 从 <Katex tex="-\pi/2" /> 到 <Katex tex="\pi/2" />。它的面积 <Katex tex="\int_{-\pi/2}^{\pi/2}\frac{(2a\cos\theta)^2}{2}d\theta=\pi a^2" />。画板的预设 ① 取 <Katex tex="a=1" />。</p>
    <p><b>圆环与心形线。</b>圆环 <Katex tex="1\le r\le2" /> 的 <Katex tex="\theta" /> 范围由所取的那一段决定；心形线 <Katex tex="r=1+\cos\theta" /> 的 <Katex tex="\theta" /> 走满一圈，面积 <Katex tex="\frac12\int_0^{2\pi}(1+\cos\theta)^2d\theta=\frac{3\pi}{2}" />。这两个边界在直角坐标下都不是函数图象，极坐标是它们最自然的写法。</p>

    <h3 class="sec" id="r3-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：漏写面积元里的 <Katex tex="r" />。</strong>这是这一章最常见的一处遗漏，结果会系统性地偏小，且偏小的比例随半径变化。</li>
        <li><strong>提示二：角度范围按整圈算。</strong>过极点的圆只覆盖半个角度范围，写成 <Katex tex="0\le\theta\le2\pi" /> 会把同一点算两遍。</li>
        <li><strong>提示三：负径不管。</strong>极坐标允许 <Katex tex="r<0" />，遇到 <Katex tex="r\le2\cos\theta" /> 在 <Katex tex="\theta" /> 超出 <Katex tex="[-\pi/2,\pi/2]" /> 的部分时，负径会补出另一段曲线；对圆、心形线而言这段与正径部分重合，要一并想清楚是否重复计数。</li>
        <li><strong>提示四：被积函数里的 <Katex tex="x" />、<Katex tex="y" /> 忘了换。</strong>换元是整体换，函数也要用 <Katex tex="r\cos\theta" />、<Katex tex="r\sin\theta" /> 写出来。</li>
      </ul>
    </div>
    <p>回收与预告：二重积分之后是三重积分。区域从平面变成空间后，与直角坐标并行的还有柱面坐标与球面坐标，多出来的因子分别是 <Katex tex="r" /> 与 <Katex tex="\rho^2\sin\varphi" />。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarDbl } from '../../../boards/calc2/riemann/polardbl.js';
import { MR_CHAPTERS } from './rnav.js';
</script>
