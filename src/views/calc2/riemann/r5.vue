<template>
  <ChPage :cur="5" no="重5" base="/calc2/r" :chapters="MR_CHAPTERS"
    title="柱面坐标与球面坐标"
    sub="空间里两套常用的广义坐标。柱面坐标把底面上的极坐标再加上高度，适合绕 z 轴绕成的区域；球面坐标用「到原点的距离、与 z 轴的夹角、方位角」三个数定位，适合球体与锥体。两套坐标各带一个体积元因子，本质都是雅可比。"
    :toc="[{ id: 'r5-cyl', t: '柱面坐标' }, { id: 'r5-sph', t: '球面坐标' }, { id: 'r5-case', t: '什么时候换坐标' }, { id: 'r5-pit', t: '四条提示' }]">
    <div class="note good">柱面坐标 <Katex tex="(r,\theta,z)" />：<Katex tex="x=r\cos\theta" />、<Katex tex="y=r\sin\theta" />、<Katex tex="z=z" />，体积元 <Katex tex="dV=r\,dr\,d\theta\,dz" />。球面坐标 <Katex tex="(\rho,\varphi,\theta)" />：<Katex tex="x=\rho\sin\varphi\cos\theta" />、<Katex tex="y=\rho\sin\varphi\sin\theta" />、<Katex tex="z=\rho\cos\varphi" />，体积元 <Katex tex="dV=\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCoord3d" />
      <div class="cap">图 重5 · <b>柱面坐标与球面坐标</b>：① 柱面坐标下 P 由 <Katex tex="r" />、<Katex tex="\theta" />、<Katex tex="z" /> 三个数定位，金色折线从原点走到 P，橙色小格是 P 附近的一块，边长分别沿径向、切向与竖直方向；② 球面坐标下 P 由 <Katex tex="\rho" />、<Katex tex="\varphi" />、<Katex tex="\theta" /> 定位，三条大圆是半径为 <Katex tex="\rho" /> 的球面与三张坐标面的交线，橙色弧是 <Katex tex="\varphi" />、紫色弧是 <Katex tex="\theta" />。切到第二档并把 <Katex tex="\varphi" /> 拖到 90° 附近，看体积元因子里 <Katex tex="\sin\varphi" /> 的变化。</div>
    </div>

    <h3 class="sec" id="r5-cyl">柱面坐标</h3>
    <p>柱面坐标是把平面极坐标直接抬到空间：底面上用 <Katex tex="(r,\theta)" />，高度用 <Katex tex="z" />。它的坐标面有三族：<Katex tex="r" /> 为常数是圆柱面，<Katex tex="\theta" /> 为常数是过 <Katex tex="z" /> 轴的半平面，<Katex tex="z" /> 为常数是水平面。三族面在 P 处互相垂直。</p>
    <p>体积元来自两个方向：底面上那一小块面的面积是 <Katex tex="r\,dr\,d\theta" />，再乘上高度 <Katex tex="dz" />，就是</p>
    <p style="text-align:center"><Katex display tex="dV=r\,dr\,d\theta\,dz." /></p>
    <p>画板的橙色小格把它们具体画了出来：径向边长是 <Katex tex="dr" />，切向边长是 <Katex tex="r\,d\theta" />，竖直边长是 <Katex tex="dz" />。把半径 <Katex tex="r" /> 拖到 0 附近，切向边长跟着缩短到零，这就是 <Katex tex="r" /> 因子的来源。</p>
    <p>典型的例子是圆柱 <Katex tex="r\le a" />、<Katex tex="0\le z\le h" />：体积等于 <Katex tex="\int_0^{2\pi}d\theta\int_0^a r\,dr\int_0^h dz=\pi a^2h" />，三层限全是常数。</p>

    <h3 class="sec" id="r5-sph">球面坐标</h3>
    <p>球面坐标用三个数定一个点：<Katex tex="\rho" /> 是到原点的距离，取值非负；<Katex tex="\varphi" /> 是 <Katex tex="OP" /> 与 <Katex tex="z" /> 轴正向的夹角，取值 <Katex tex="[0,\pi]" />；<Katex tex="\theta" /> 是 P 在 <Katex tex="xOy" /> 面上的投影的极角，取值 <Katex tex="[0,2\pi]" /> 或 <Katex tex="[-\pi,\pi]" />。</p>
    <p>它的坐标面是：<Katex tex="\rho" /> 为常数是球面，<Katex tex="\varphi" /> 为常数是以 <Katex tex="z" /> 轴为轴的圆锥面，<Katex tex="\theta" /> 为常数是过 <Katex tex="z" /> 轴的半平面。三族面同样两两垂直。</p>
    <p>体积元的构成分三步：径向方向走 <Katex tex="d\rho" />；沿子午线方向走 <Katex tex="\rho\,d\varphi" />；沿纬线方向走，那一圈的半径是 <Katex tex="\rho\sin\varphi" />，所以弧长是 <Katex tex="\rho\sin\varphi\,d\theta" />。三者相乘得</p>
    <p style="text-align:center"><Katex display tex="dV=\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta." /></p>
    <p>赤道附近 <Katex tex="\varphi\approx90^\circ" />，<Katex tex="\sin\varphi" /> 接近 1，体积元最大；靠近 <Katex tex="z" /> 轴时 <Katex tex="\sin\varphi\to0" />，体积元缩到零。画板第二档把 <Katex tex="\varphi" /> 拖到两端就能看到这个行为。</p>

    <h3 class="sec" id="r5-case">什么时候换坐标</h3>
    <p>判断的依据是<b>区域的边界方程在哪套坐标下最简</b>。边界写成常数的坐标，就是合适的坐标。</p>
    <p>圆柱、圆锥、旋转抛物面围成的区域，边界在柱面坐标下是常数或简单方程，用柱面坐标。球、半球、球与圆锥围成的扇形体，边界在球面坐标下是常数，用球面坐标。</p>
    <p>两个典型结果：球的体积 <Katex tex="\iiint_{\rho\le R}dV=\int_0^{2\pi}d\theta\int_0^{\pi}\sin\varphi\,d\varphi\int_0^R\rho^2d\rho=\frac{4}{3}\pi R^3" />；球的上半部分的体积是它的一半。这两个积分在直角坐标下都要写一大段根号。</p>

    <h3 class="sec" id="r5-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把球面坐标的 <Katex tex="\varphi" /> 与平面极角的 <Katex tex="\theta" /> 弄反。</strong><Katex tex="\varphi" /> 从 <Katex tex="z" /> 轴量起，<Katex tex="\theta" /> 在水平面内量；两套记号在不同教材里偶有互换，做题时先确认。</li>
        <li><strong>提示二：<Katex tex="\rho" /> 与平面上的 <Katex tex="r" /> 混用。</strong><Katex tex="\rho" /> 是空间距离，<Katex tex="r" /> 是水平投影长度，两者满足 <Katex tex="r=\rho\sin\varphi" />。</li>
        <li><strong>提示三：漏写 <Katex tex="\rho^2\sin\varphi" /> 里的 <Katex tex="\sin\varphi" />。</strong>只写 <Katex tex="\rho^2d\rho\,d\varphi\,d\theta" /> 会把体积算大，纬度越高偏差越大。</li>
        <li><strong>提示四：<Katex tex="\varphi" /> 的范围写成 <Katex tex="[0,2\pi]" />。</strong><Katex tex="\varphi" /> 只到 <Katex tex="\pi" />，超过的部分与 <Katex tex="\theta" /> 加 <Katex tex="\pi" /> 重复。</li>
      </ul>
    </div>
    <p>回收与预告：有了质量与体积的算法，就可以把它们用到具体量上——质量、质心、转动惯量，这些物理量都是密度加权的积分。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCoord3d } from '../../../boards/calc2/riemann/coord3d.js';
import { MR_CHAPTERS } from './rnav.js';
</script>
