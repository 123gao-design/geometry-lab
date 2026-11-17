<template>
  <ChPage :cur="4" no="线4" base="/calc2/c" :chapters="MC_CHAPTERS"
    title="第一类曲面积分"
    sub="把曲面切成小片，每片的面积乘上该处的函数值，加起来就是第一类曲面积分。它与曲线的弧长积分是同一路思路：对面积加权、不涉及方向。计算的关键是把曲面小片投影到坐标面上，弄清投影面积与真实面积之间的放大倍数。"
    :toc="[{ id: 'c4-def', t: '定义与面积元' }, { id: 'c4-proj', t: '投影法' }, { id: 'c4-case', t: '球面与柱面的写法' }, { id: 'c4-pit', t: '四条提示' }]">
    <div class="note good">把光滑曲面 <Katex tex="S" /> 分成小片 <Katex tex="\Delta S_i" />，在第 <Katex tex="i" /> 片上取一点 <Katex tex="(\xi_i,\eta_i,\zeta_i)" />，若 <Katex tex="\sum_{i=1}^{n}f(\xi_i,\eta_i,\zeta_i)\Delta S_i" /> 的极限存在，就记作 <Katex tex="\iint_Sf(x,y,z)\,dS" />，称为<b>第一类曲面积分</b>（对面积的曲面积分）。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSurfInt1" />
      <div class="cap">图 线4 · <b>第一类曲面积分</b>：曲面是抛物面 <Katex tex="z=1-\frac{x^2+y^2}{2}" /> 在单位圆盘上方的那一片，淡灰虚线框是 <Katex tex="P" /> 处小片在 <Katex tex="xOy" /> 面上的投影。紫色箭头是曲面法向，淡蓝虚线是小片四角到投影的连线。看点：把 <Katex tex="r" /> 拖大，小片越来越斜，同样的投影面积摊出的曲面面积变大——放大因子正是 <Katex tex="\sqrt{1+x^2+y^2}" />。整片曲面的面积约 3.83。</div>
    </div>

    <h3 class="sec" id="c4-def">定义与面积元</h3>
    <p>与第一类曲线积分一样，这里的 <Katex tex="dS" /> 是<b>面积元</b>，不带方向，也没有正负号。曲面给定后，第一类积分的值就定了，与「从哪一面看」无关；这一点在下一章换成第二类时会改变。</p>
    <p>若 <Katex tex="f\equiv1" />，积分退化为曲面的面积 <Katex tex="\iint_SdS" />；若 <Katex tex="f" /> 是面密度，它就是薄壳的质量。曲面关于某张坐标面对称时，奇函数的积分可以按对称性消去，与二重积分同理。</p>

    <h3 class="sec" id="c4-proj">投影法</h3>
    <p>曲面写成 <Katex tex="z=z(x,y)" />，<Katex tex="(x,y)\in D" />。在 <Katex tex="(x,y)" /> 处取一小块 <Katex tex="dx\,dy" />，它在曲面上对应的小片与它在水平面上的夹角是法向与竖直方向的夹角 <Katex tex="\gamma" />，于是</p>
    <p style="text-align:center"><Katex display tex="dS=\frac{dx\,dy}{\cos\gamma}=\sqrt{1+z_x^2+z_y^2}\,dx\,dy." /></p>
    <p>画板的小片把这三个量都摆在眼前：曲面小片是橙色四边形，投影是淡蓝虚线框，两者的面积之比就是 <Katex tex="\sqrt{1+x^2+y^2}" />。离轴越远，曲面越斜，这个倍数越大；在原点处它是 1，曲面水平，投影不打折。</p>
    <p>积分因此化成投影区域上的二重积分：</p>
    <p style="text-align:center"><Katex display tex="\iint_Sf(x,y,z)\,dS=\iint_Df\big(x,y,z(x,y)\big)\sqrt{1+z_x^2+z_y^2}\,dx\,dy." /></p>
    <p>画板的整片面积是 <Katex tex="\iint_D\sqrt{1+x^2+y^2}\,dx\,dy=2\pi\int_0^1r\sqrt{1+r^2}\,dr=\frac{2\pi(2\sqrt2-1)}{3}\approx3.83" />，其中定向的极坐标把根号积成了一个干净的数。</p>

    <h3 class="sec" id="c4-case">球面与柱面的写法</h3>
    <p>曲面在直角坐标下不好写成 <Katex tex="z=z(x,y)" /> 时（比如球面是双值函数），换参数是更省事的路。用两个参数 <Katex tex="(u,v)" /> 刻画曲面，面积元是</p>
    <p style="text-align:center"><Katex display tex="dS=\sqrt{EG-F^2}\,du\,dv," /></p>
    <p>其中 <Katex tex="E=|r_u|^2" />、<Katex tex="F=r_u\cdot r_v" />、<Katex tex="G=|r_v|^2" />。球面用球面坐标时 <Katex tex="r_u" /> 与 <Katex tex="r_v" /> 正交，<Katex tex="F=0" />，直接得</p>
    <p style="text-align:center"><Katex display tex="dS=R^2\sin\varphi\,d\varphi\,d\theta." /></p>
    <p>于是整球面积 <Katex tex="R^2\int_0^{2\pi}d\theta\int_0^{\pi}\sin\varphi\,d\varphi=4\pi R^2" />。柱面用 <Katex tex="(\theta,z)" /> 参数化时 <Katex tex="dS=R\,d\theta\,dz" />，因为沿圆周方向走 <Katex tex="Rd\theta" />、沿母线走 <Katex tex="dz" />，两者垂直。</p>

    <h3 class="sec" id="c4-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="dS" /> 直接当成 <Katex tex="dx\,dy" />。</strong>只有曲面水平时两者相等，倾斜时差一个放大因子，斜得越厉害差得越多。</li>
        <li><strong>提示二：放大因子漏了根号。</strong>因子是 <Katex tex="\sqrt{1+z_x^2+z_y^2}" />，不是 <Katex tex="1+z_x^2+z_y^2" />。</li>
        <li><strong>提示三：投影到错误的坐标面。</strong>曲面在竖直方向是双值（如球面）时，投影到 <Katex tex="xOy" /> 面要把曲面分成上下两片；也可以改投到 <Katex tex="yOz" /> 或 <Katex tex="zOx" /> 面。</li>
        <li><strong>提示四：除以 <Katex tex="\cos\gamma" /> 时忘了取绝对值。</strong>夹角按锐角算，<Katex tex="\cos\gamma>0" />；把法向反过来写会得到一个负的面积。</li>
      </ul>
    </div>
    <p>回收与预告：把「对面积加权」换成「对通量加权」，被积式里会出现曲面的法向分量，这就是第二类曲面积分；曲面的朝向从那时起开始起作用。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSurfInt1 } from '../../../boards/calc2/curve/surfint1.js';
import { MC_CHAPTERS } from './cnav.js';
</script>
