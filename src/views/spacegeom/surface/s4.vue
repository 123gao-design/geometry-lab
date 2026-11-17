<template>
  <ChPage :cur="4" no="曲4" base="/spacegeom/s" :chapters="SS_CHAPTERS"
    title="空间曲线"
    sub="空间曲线有两种写法：一种把 x、y、z 都写成同一个参数 t 的函数，叫参数方程；另一种写成两张曲面的联立，叫一般方程。两种写法互相能换——从参数式消去 t 得到曲面组，从曲面组解出 t 得到参数式。螺旋线是参数方程最有代表性的一条曲线，圆柱面与球面的交线则是一般方程最常见的产物。"
    :toc="[{ id: 's4-param', t: '参数方程' }, { id: 's4-proj', t: '投影与消参' }, { id: 's4-cross', t: '两曲面交线' }, { id: 's4-helix', t: '螺旋线' }, { id: 's4-pit', t: '参数范围与投影' }]">
    <div class="note good">空间曲线的一般方程写成两张曲面的联立 <Katex tex="\begin{cases}F(x,y,z)=0\\ G(x,y,z)=0\end{cases}" />，交线上的点同时落在这两张曲面上。参数方程则写成 <Katex tex="x=x(t),\ y=y(t),\ z=z(t)" />，<Katex tex="t" /> 在给定区间上取遍，每取一个值就落下一个点，点连成线。</div>

    <h3 class="sec" id="s4-param">参数方程</h3>
    <p>参数方程的好处是「点随参数动」：给定 <Katex tex="t" /> 立刻有坐标，求切线、求长度、问单调，都可归到一元函数的计算上。这与平面内直线的参数式 <Katex tex="x=x_0+at,\ y=y_0+bt" />、圆的参数式是一路做法，只是多了一个 <Katex tex="z" />。</p>
    <p>参数的选择不唯一。同一条曲线可以用 <Katex tex="t" /> 表示，也可以换成 <Katex tex="t^3" />、换成弧长、换成某个角。换参数只改变点沿曲线跑的节奏，不改变曲线本身——所以参数式要连同定义域一起写，否则同一个式子在定义域之外画出的可能是另一段线。</p>
    <p>空间曲线的参数方程常用三个函数拼成：<Katex tex="x" /> 与 <Katex tex="y" /> 定水平位置，<Katex tex="z" /> 定高度。若 <Katex tex="z" /> 恒为常数，曲线就压在一张水平面内，退化成平面曲线；若 <Katex tex="x,y" /> 只随 <Katex tex="t" /> 绕圆周跑、<Katex tex="z" /> 匀速上升，得到的就是螺旋线。</p>

    <h3 class="sec" id="s4-proj">投影与消参</h3>
    <p>把参数方程中的 <Katex tex="t" /> 消掉，就得到曲线的一组方程。常用的办法是从两个式子中解出 <Katex tex="t" /> 再代入第三个，或者利用 <Katex tex="\sin^2t+\cos^2t=1" /> 这类恒等式直接拼合。</p>
    <p>另一个常问的量是<strong>在坐标面上的投影</strong>。曲线在 <Katex tex="xOy" /> 平面上的投影，就是把它压到 <Katex tex="z=0" /> 上，即只保留 <Katex tex="x(t),y(t)" /> 两个分量所画出的曲线；同理，投影到 <Katex tex="yOz" /> 平面只保留 <Katex tex="y(t),z(t)" />。三条投影曲线分别是三个坐标面上的平面曲线，各是曲线真形的一个侧面。</p>
    <p>消参得到的<strong>投影柱面</strong>和投影曲线不是一回事：把两个方程中消去 <Katex tex="z" /> 得到的是以该曲线为准线、母线平行于 <Katex tex="z" /> 轴的柱面；再与 <Katex tex="z=0" /> 联立，才是投影曲线本身。</p>
    <div class="board-wrap">
      <BoardMount :factory="createSpacecurve" />
      <div class="cap">图 曲4 · <b>空间曲线</b>：① 螺旋线——金色曲线绕 <Katex tex="z" /> 轴盘旋上升，蓝色是它在 <Katex tex="xOy" /> 平面上的投影圆，绿色是它在 <Katex tex="yOz" /> 平面上的投影正弦曲线，紫色虚线把 <Katex tex="P" /> 分别落到两张投影面上。② 球面与柱面——白色细网是球面，蓝色细网是柱面，金色加粗的两个圆是它们的交线。看点：第一档把 <Katex tex="t_0" /> 从 0 推到 12.56（约四整圈），橙点沿螺旋线走两圈，两个投影点同时沿圆与正弦曲线移动——三次读数一一对上；把螺距系数 <Katex tex="c" /> 调小，螺旋压扁；第二档把柱半径推到不小于球半径，金色交线消失，判读直接说明两曲面没有公共点。</div>
    </div>

    <h3 class="sec" id="s4-cross">两曲面交线</h3>
    <p>两张曲面的交线一般仍是一条曲线。圆柱面 <Katex tex="x^2+y^2=r^2" /> 与球面 <Katex tex="x^2+y^2+z^2=R^2" /> 联立，从前一式得 <Katex tex="x^2+y^2=r^2" />，代入后一式得</p>
    <p style="text-align:center"><Katex tex="z^2=R^2-r^2." display /></p>
    <p>于是 <Katex tex="z=\pm\sqrt{R^2-r^2}" /> 是两个固定的高度。曲线连成两个水平圆，半径都是 <Katex tex="r" />，一个在 <Katex tex="z" /> 的正侧、一个在负侧。两式必须同时满足，所以每个圆都落在柱面上，也都落在球面上。</p>
    <p>这个结果要求 <Katex tex="r<R" />：柱面比球面细，才能被球面拦腰截两刀；<Katex tex="r=R" /> 时 <Katex tex="z=0" />，两曲面相切于一个大圆；<Katex tex="r>R" /> 时柱面整个套在球面外面，没有公共点。</p>

    <h3 class="sec" id="s4-helix">螺旋线</h3>
    <p>螺旋线的参数方程是</p>
    <p style="text-align:center"><Katex tex="x=r\cos t,\quad y=r\sin t,\quad z=ct." display /></p>
    <p><Katex tex="x,y" /> 两个分量给出半径恒为 <Katex tex="r" /> 的圆，<Katex tex="z" /> 与 <Katex tex="t" /> 成正比就是匀速上升。<Katex tex="t" /> 增加 <Katex tex="2\pi" /> 时高度上升 <Katex tex="2\pi c" />，这一个 <Katex tex="2\pi c" /> 叫<strong>螺距</strong>。</p>
    <p>消去 <Katex tex="t" /> 得 <Katex tex="x^2+y^2=r^2" /> 与 <Katex tex="y=r\sin(z/c)" />，即螺旋线是圆柱面与一张正弦柱面的交线。它的水平投影是圆、竖直投影是正弦曲线，两个投影合起来正好恢复整条曲线的走向。螺丝的螺纹、盘山公路、弹簧都取这个形状。</p>

    <h3 class="sec" id="s4-pit">参数范围与投影</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：写参数方程漏掉定义域。</strong>没有定义域，「点随参数动」只画出半段。螺旋线要注明 <Katex tex="t\ge0" /> 或 <Katex tex="t\in[0,4\pi]" />，直线的参数式要注明 <Katex tex="t\in\mathbb R" />。</li>
        <li><strong>提示二：把投影柱面当成投影曲线。</strong>消去 <Katex tex="z" /> 得到的是柱面，柱面上过曲线的每一点都有一条与 <Katex tex="z" /> 轴平行的母线。投影曲线还要再与坐标平面联立，两者形状不同、方程也不同。</li>
        <li><strong>提示三：以为两张曲面一定交出曲线。</strong>两曲面可能没有公共点（如 <Katex tex="r>R" /> 的柱面与球面），可能交于一点（相切），也可能交出一整条面（两张曲面重合）。联立前先看有没有公共点。</li>
        <li><strong>提示四：把椭球面的一组截面当成同一条曲线。</strong>曲面在不同高度的截痕是一族不同的曲线，它们各自独立，不是同一条空间曲线的不同位置。空间曲线必须是某一个固定的方程组的解集。</li>
      </ul>
    </div>
    <p>回收与预告：到这里空间解析几何的三块内容——向量、平面与直线、曲面与曲线——都走了一遍。向量给了工具，平面与直线是一次方程的图形，曲面与曲线把二次方程画成了形状。多元函数微积分接着从空间里取函数 <Katex tex="f(x,y)" />，把接下来要研究的曲面都写成 <Katex tex="z=f(x,y)" /> 的形式；向量的内积与叉积在那里的切平面、法向量上还会再用到。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSpacecurve } from '../../../boards/spacegeom/surface/spacecurve.js';
import { SS_CHAPTERS } from './ssnav.js';
</script>
