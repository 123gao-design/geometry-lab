<template>
  <ChPage :cur="1" no="复1" base="/complexvar/c" :chapters="CV_CHAPTERS"
    title="复数的几何表示"
    sub="复数 a+bi 可以看成一个有序数对，也就可以看成平面上的一点。这一看法把加减法变成平移，把乘除法变成旋转与伸缩，复变函数的一切几何直观都从这里出发。"
    :toc="[{ id: 'c1-rep', t: '复平面上的点' }, { id: 'c1-mod', t: '模与辐角' }, { id: 'c1-tri', t: '三角式与指数式' }, { id: 'c1-conj', t: '共轭与它的几何意义' }, { id: 'c1-pit', t: '四条提示' }]">
    <div class="note good">复数 <Katex tex="z=a+bi" /> 与平面上的点 <Katex tex="(a,b)" /> 一一对应：实部 <Katex tex="a" /> 是横坐标，虚部 <Katex tex="b" /> 是纵坐标。这张平面叫<b>复平面</b>，横轴叫实轴，纵轴叫虚轴。加法的规则与向量加法相同，乘法却带来了新的东西——长度相乘、方向相加。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCPlane" />
      <div class="cap">图 复1 · <b>复数的几何表示</b>：拖金色点 <Katex tex="z" /> 走遍四个象限。看点：① 金线段的长度是模 <Katex tex="|z|" />，橙弧从正实轴逆时针量到 <Katex tex="z" />，是辐角；② 两条灰色虚线把 <Katex tex="z" /> 投影到两条轴上，横坐标是实部、纵坐标是虚部；③ 紫点是共轭 <Katex tex="\bar z" />，总在实轴的另一侧；④ 青点 <Katex tex="iz" /> 由 <Katex tex="z" /> 直接转 <Katex tex="90^\circ" /> 得到，模一点没变。</div>
    </div>

    <h3 class="sec" id="c1-rep">复平面上的点</h3>
    <p>把复数写成 <Katex tex="a+bi" />，它由两个实数确定，所以可以放在坐标平面上。<Katex tex="a" /> 叫作实部，记作 <Katex tex="\operatorname{Re}z" />；<Katex tex="b" /> 叫作虚部，记作 <Katex tex="\operatorname{Im}z" />。虚部是实数，不带 <Katex tex="i" />——这是初学者最容易写错的一处。</p>
    <p>有了这张对应，复数的加法就是向量加法：<Katex tex="(a+bi)+(c+di)=(a+c)+(b+d)i" />，横纵坐标各自相加，几何上是一个平行四边形。减法是从一点指向另一点的向量。<Katex tex="z_1-z_2" /> 的模因此就是两点之间的距离，复数的加、减与平面几何的平移、距离是同一件事。</p>
    <p>平面上的直线、圆、区域都能写成含 <Katex tex="z" /> 的式子。例如 <Katex tex="|z-z_0|=r" /> 是以 <Katex tex="z_0" /> 为心、<Katex tex="r" /> 为半径的圆；<Katex tex="|z-z_0|<r" /> 是圆的内部。这类写法在后面判断路径、描述区域时反复出现。</p>
    <p>也要记得：复数没有大小次序。两个复数可以相等或者不等，却谈不上谁大谁小。能比较大小的只有它们的模与辐角，这两样恰好是几何上的长度与方向。</p>

    <h3 class="sec" id="c1-mod">模与辐角</h3>
    <p>复数 <Katex tex="z=a+bi" /> 到原点的距离叫<b>模</b>，记作 <Katex tex="|z|" />：</p>
    <p style="text-align:center"><Katex display tex="|z|=\sqrt{a^2+b^2},\qquad |z|^2=z\bar z." /></p>
    <p>模是实数，且可以比较大小。它与向量的长度同一回事，所以三角不等式照样成立：<Katex tex="|z_1+z_2|\le |z_1|+|z_2|" />。</p>
    <p>从正实轴转到 <Katex tex="z" /> 的角叫<b>辐角</b>，记作 <Katex tex="\operatorname{arg}z" />。辐角不唯一：同一条射线上的角可以差整圈 <Katex tex="2\pi" />。为了让辐角只有一个值，约定取落在 <Katex tex="(-\pi,\pi]" /> 里的那一个，叫作<b>辐角主值</b>，记作 <Katex tex="\operatorname{Arg}z" />。</p>
    <p>画板上橙色弧标的就是主值。第二象限的点辐角在 <Katex tex="\pi/2" /> 与 <Katex tex="\pi" /> 之间，第三象限在 <Katex tex="-2\pi/3" /> 这样的负数上，负实轴的辐角取 <Katex tex="\pi" /> 而不是 <Katex tex="-\pi" />。主值在负实轴上发生跳跃：沿上半平面走到负实轴，辐角是 <Katex tex="\pi" />；沿下半平面走，极限是 <Katex tex="-\pi" />。这个跳跃后面在讨论对数与积分时是一个绕不开的坎。</p>
    <p>用横纵坐标算辐角要用到反正切，但单纯算 <Katex tex="\arctan(b/a)" /> 只覆盖了一半情形，还得按 <Katex tex="a" /> 的符号把答案挪到对的一侧。程序里通常调用 <Katex tex="\operatorname{atan2}(b,a)" />，它直接给出 <Katex tex="(-\pi,\pi]" /> 里的那个角。</p>

    <h3 class="sec" id="c1-tri">三角式与指数式</h3>
    <p>把直角三角形的两条边换成 <Katex tex="r" /> 与 <Katex tex="\theta" />，就得到坐标与模、辐角的关系：</p>
    <p style="text-align:center"><Katex display tex="a=r\cos\theta,\qquad b=r\sin\theta,\qquad z=r(\cos\theta+i\sin\theta)." /></p>
    <p>右边的写法叫<b>三角式</b>。它把「离原点多远」与「朝哪个方向」分开写，正适合做乘法。再借助欧拉公式 <Katex tex="e^{i\theta}=\cos\theta+i\sin\theta" />，三角式可以压成一行：</p>
    <p style="text-align:center"><Katex display tex="z=re^{i\theta}." /></p>
    <p>下面这条乘法规则是全部几何直觉的来源：</p>
    <p style="text-align:center"><Katex display tex="z_1z_2=r_1r_2\,e^{i(\theta_1+\theta_2)}." /></p>
    <p>模相乘、辐角相加。乘一个模为 <Katex tex="r" />、辐角为 <Katex tex="\theta" /> 的复数，就是绕原点转 <Katex tex="\theta" /> 再把长度乘上 <Katex tex="r" />。画板上青点 <Katex tex="iz" /> 是 <Katex tex="z" /> 乘 <Katex tex="i" /> 的结果，而 <Katex tex="i" /> 的模是 <Katex tex="1" />、辐角是 <Katex tex="\pi/2" />，所以只剩一段 <Katex tex="90^\circ" /> 的旋转。乘 <Katex tex="-1" /> 转 <Katex tex="180^\circ" />，乘 <Katex tex="-i" /> 转 <Katex tex="270^\circ" />，这三条在复平面上看得最清楚。</p>
    <p>反复用一次乘法规则，就得到棣莫弗公式：<Katex tex="(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta" />。模为 <Katex tex="1" /> 的复数在乘法下正好描出单位圆，<Katex tex="n" /> 次方让它沿圆周走 <Katex tex="n" /> 步，这正是下一章 <Katex tex="z^n" /> 把圆映成圆的道理。</p>

    <h3 class="sec" id="c1-conj">共轭与它的几何意义</h3>
    <p>把虚部换成相反数，得到<b>共轭复数</b> <Katex tex="\bar z=a-bi" />。几何上就是关于实轴的镜像：模不变，辐角取相反数。画板上紫点始终与金色点关于实轴对称，拖着它上下走时这一点最直观。</p>
    <p>共轭的四条用法：<Katex tex="\overline{z_1+z_2}=\bar z_1+\bar z_2" />、<Katex tex="\overline{z_1z_2}=\bar z_1\bar z_2" />、<Katex tex="z\bar z=|z|^2" />、<Katex tex="z+\bar z=2\operatorname{Re}z" />。第三条最常用：它把模的平方写成一个复数乘它的共轭，除法因此有了标准做法——分子分母同乘分母的共轭，把分母化成实数：</p>
    <p style="text-align:center"><Katex display tex="\frac{z_1}{z_2}=\frac{z_1\bar z_2}{|z_2|^2}." /></p>
    <p>另外两条把实部与虚部单独摘了出来：<Katex tex="\operatorname{Re}z=\dfrac{z+\bar z}{2}" />，<Katex tex="\operatorname{Im}z=\dfrac{z-\bar z}{2i}" />。判断一个表达式是不是实数，只需看它是否等于自己的共轭，这条判据后面会反复用到。</p>

    <h3 class="sec" id="c1-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：虚部是实数。</strong><Katex tex="z=3-2i" /> 的虚部是 <Katex tex="-2" />，不是 <Katex tex="-2i" />。把 <Katex tex="i" /> 写进虚部，后面的判等与共轭都会跟着错。</li>
        <li><strong>提示二：辐角主值的区间是 <Katex tex="(-\pi,\pi]" />，负实轴取 <Katex tex="\pi" />。</strong>换一个约定（例如 <Katex tex="[0,2\pi)" />）结论不变，但中间过程里的加减要跟着改，别把两套约定混用。</li>
        <li><strong>提示三：模与辐角不能直接拆开算加减。</strong><Katex tex="|z_1+z_2|" /> 一般不等于 <Katex tex="|z_1|+|z_2|" />，等号只在两者同向时成立；辐角相加的规则只对乘法成立，加法要回到坐标去算。</li>
        <li><strong>提示四：共轭只管虚部，不管模。</strong><Katex tex="\overline{z_1z_2}=\bar z_1\bar z_2" /> 与 <Katex tex="\overline{z_1/z_2}=\bar z_1/\bar z_2" /> 都成立，但 <Katex tex="\overline{|z|}=|z|" /> ——模本来就是实数，取共轭没有变化。</li>
      </ul>
    </div>
    <p>回收与预告：点、模、辐角、共轭四样东西把复数放进了平面。下一步让点动起来：让 <Katex tex="z" /> 在整个平面上跑，看它经过一个复变函数后落到哪里，这就是映射。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCPlane } from '../../../boards/complexvar/cplx/cplane.js';
import { CV_CHAPTERS } from './cvnav.js';
</script>
