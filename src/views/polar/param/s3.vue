<template>
  <ChPage :cur="3" no="参3" base="/polar/s" :chapters="PS_CHAPTERS"
    title="圆锥曲线的参数方程"
    sub="椭圆用离心角，双曲线用正割与正切，抛物线用一个实数 t。三种参数式都由对应的普通方程变形而来，参数的含义各不相同：椭圆的 θ 是离心角，不是极角；双曲线的 θ 要避开两条渐近线方向；抛物线的 t 可以取负，上下两支由它分。"
    :toc="[{ id: 's3-ellipse', t: '椭圆的参数方程' }, { id: 's3-hyperbola', t: '双曲线的参数方程' }, { id: 's3-parabola', t: '抛物线的参数方程' }, { id: 's3-pit', t: '离心角、无定义点与参数式不唯一' }]">
    <div class="note good">椭圆 <Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1" /> 的参数方程为 <Katex tex="x=a\cos\theta" />、<Katex tex="y=b\sin\theta" />，<Katex tex="\theta\in[0,2\pi)" />。双曲线 <Katex tex="\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1" /> 的参数方程为 <Katex tex="x=a\sec\theta" />、<Katex tex="y=b\tan\theta" />，<Katex tex="\theta\ne90^\circ,270^\circ" />。抛物线 <Katex tex="y^2=2px" /> 的参数方程为 <Katex tex="x=2pt^2" />、<Katex tex="y=2pt" />，<Katex tex="t\in\mathbb{R}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createParamConic" />
      <div class="cap">图 参3 · <b>圆锥曲线的参数方程</b>：金色曲线、蓝色虚线是原点到 <Katex tex="M" /> 的连线，双曲线另画两条灰色渐近线。看点：切换椭圆、双曲线、抛物线，滑块与手柄给出三种参数；双曲线把 <Katex tex="\theta" /> 拨到 <Katex tex="90^\circ" /> 时 <Katex tex="M" /> 消失，徽章说明正割与正切在这里无定义；抛物线的 <Katex tex="t" /> 越过 <Katex tex="0" />，点从下支穿到上支。</div>
    </div>

    <h3 class="sec" id="s3-ellipse">椭圆的参数方程</h3>
    <p>把椭圆方程左边看成一个平方和，令两个平方项分别等于 <Katex tex="\cos^2\theta" /> 与 <Katex tex="\sin^2\theta" />：</p>
    <p style="text-align:center"><Katex tex="\frac{x^2}{a^2}=\cos^2\theta,\qquad \frac{y^2}{b^2}=\sin^2\theta." display /></p>
    <p>取正根就得到 <Katex tex="x=a\cos\theta" />、<Katex tex="y=b\sin\theta" />。两式平方后分别除以 <Katex tex="a^2" />、<Katex tex="b^2" /> 再相加，回到原方程，说明参数方程给出的点都在椭圆上；反过来，椭圆上每一点也能找到对应的 <Katex tex="\theta" />，所以两者表示同一条曲线。</p>
    <p><Katex tex="\theta" /> 叫<strong>离心角</strong>，不是点 <Katex tex="M" /> 的极角。它的几何来源是：以原点为圆心、<Katex tex="a" /> 为半径作辅助圆，<Katex tex="\theta" /> 是辅助圆上一点 <Katex tex="(a\cos\theta,a\sin\theta)" /> 的圆心角；把该点的纵坐标按 <Katex tex="b/a" /> 压缩，就落到椭圆上的 <Katex tex="M(a\cos\theta,b\sin\theta)" />。图 参3 拖动 <Katex tex="M" /> 时，<Katex tex="\theta" /> 与 <Katex tex="M" /> 的极角并不相等，原因就在这里。</p>
    <p><Katex tex="\theta" /> 取 <Katex tex="[0,2\pi)" /> 时，椭圆闭合且不重复；只取 <Katex tex="[0,\pi]" /> 得到上半椭圆，只取 <Katex tex="[\pi,2\pi)" /> 得到下半椭圆。</p>

    <h3 class="sec" id="s3-hyperbola">双曲线的参数方程</h3>
    <p>双曲线的平方差对应正割与正切的平方差。令</p>
    <p style="text-align:center"><Katex tex="\frac{x}{a}=\sec\theta,\qquad \frac{y}{b}=\tan\theta," display /></p>
    <p>则 <Katex tex="x=a\sec\theta" />、<Katex tex="y=b\tan\theta" />。利用恒等式 <Katex tex="\sec^2\theta-\tan^2\theta=1" />，两式平方相减即得双曲线的普通方程。反过来，双曲线上的点也都能写成这个形状，只是 <Katex tex="\theta" /> 不唯一。</p>
    <p><Katex tex="\theta" /> 不能取 <Katex tex="90^\circ" /> 与 <Katex tex="270^\circ" />，因为这两处 <Katex tex="\cos\theta=0" />，正割与正切都无定义。当 <Katex tex="\theta" /> 从两侧趋近 <Katex tex="90^\circ" /> 时，<Katex tex="\sec\theta" /> 与 <Katex tex="\tan\theta" /> 的绝对值同时增大，点沿渐近线远去；但渐近线上的点本身不在双曲线上，参数方程也不会给出它们。</p>
    <p><Katex tex="\theta" /> 在 <Katex tex="(-90^\circ,90^\circ)" /> 内时 <Katex tex="\cos\theta>0" />，<Katex tex="x>0" />，点落在右支；在 <Katex tex="(90^\circ,270^\circ)" /> 内时 <Katex tex="\cos\theta<0" />，<Katex tex="x<0" />，点落在左支。一支对应一个 <Katex tex="180^\circ" /> 的参数区间，与椭圆的整圈不同。</p>

    <h3 class="sec" id="s3-parabola">抛物线的参数方程</h3>
    <p>抛物线 <Katex tex="y^2=2px" />（<Katex tex="p>0" />）中，令 <Katex tex="y=2pt" />，代入解出 <Katex tex="x=2pt^2" />，得到</p>
    <p style="text-align:center"><Katex tex="x=2pt^2,\qquad y=2pt\quad(t\in\mathbb{R})." display /></p>
    <p>消参时由第二式得 <Katex tex="t=y/(2p)" />，代入第一式得 <Katex tex="x=y^2/(2p)" />，即 <Katex tex="y^2=2px" />。这里不用开方，也不会因为开方丢掉负的一半：<Katex tex="t" /> 取负值时 <Katex tex="y" /> 为负，点落在下半支；<Katex tex="t=0" /> 时落在顶点。整条抛物线由 <Katex tex="t\in\mathbb{R}" /> 一次给出。</p>
    <p>与椭圆、双曲线不同，抛物线的参数 <Katex tex="t" /> 没有「角度」的意思，它只是 <Katex tex="y" /> 坐标按 <Katex tex="2p" /> 缩放后的结果。<Katex tex="x=2pt^2\ge0" /> 自动保证点落在右半平面，与抛物线开口向右一致。</p>

    <h3 class="sec" id="s3-pit">离心角、无定义点与参数式不唯一</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把离心角当极角。</strong>椭圆参数式里的 <Katex tex="\theta" /> 与点 <Katex tex="M" /> 的极角一般不同。求 <Katex tex="|OM|" /> 时不能写成 <Katex tex="a\cos\theta" /> 或 <Katex tex="b\sin\theta" />，要先把 <Katex tex="M" /> 的坐标算出来再求距离：<Katex tex="|OM|=\sqrt{a^2\cos^2\theta+b^2\sin^2\theta}" />。</li>
        <li><strong>提示二：双曲线在 <Katex tex="90^\circ" />、<Katex tex="270^\circ" /> 处取参数。</strong>这两处正割与正切无定义，参数方程没有对应的点。题目给出 <Katex tex="\theta" /> 的范围时，要先排除这两个值；用参数式求最值时，也要检查最优点是否落在这两处。</li>
        <li><strong>提示三：抛物线参数式不唯一。</strong><Katex tex="x=2pt^2" />、<Katex tex="y=2pt" /> 对应 <Katex tex="y^2=2px" />；若写成 <Katex tex="x=t^2" />、<Katex tex="y=2t" />，对应的是 <Katex tex="y^2=4x" />。同一个字母 <Katex tex="t" /> 在不同写法里含义不同，换用前先核对普通方程。</li>
        <li><strong>提示四：参数范围丢了。</strong>椭圆只取半圈、双曲线只取一支、抛物线只取上半支，都会让曲线少一部分。参数方程与参数范围要一起写，消参后的普通方程不能自动记住这些限制。</li>
      </ul>
    </div>
    <p>回收与预告：三种圆锥曲线的参数式都已写出，参数的含义各不相同。下一子专题轨1 把参数当成自变量，求椭圆上点到定点的距离、三角形面积一类的最值；轨2 让参数驱动动点，消参后得到轨迹方程。参数方程在这里从「表示曲线」转向「处理动点」。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createParamConic } from '../../../boards/polar/param/paramconic.js';
import { PS_CHAPTERS } from './psnav.js';
</script>
