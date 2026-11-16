<template>
  <ChPage :cur="1" no="轨1" base="/polar/g" :chapters="PG_CHAPTERS"
    title="参数方程求最值"
    sub="椭圆上的点有两个坐标、一个自由度，把它写成参数式，到一个定点的距离、到一条直线的距离、某个三角形的面积都只剩一个变量 θ。剩下的工作是把 θ 的表达式化成闭区间上一元二次或一元三角函数的最值问题。"
    :toc="[{ id: 'g1-idea', t: '参数式把二元约束降成一元' }, { id: 'g1-dist', t: '椭圆上的点到定点的距离' }, { id: 'g1-interval', t: 'cosθ 的闭区间最值' }, { id: 'g1-pit', t: '换元后的取值范围' }]">
    <div class="note good">曲线上的动点用参数式表示后，含两个坐标的目标式只剩一个参数。若目标式是参数的正弦、余弦的二次式，令 <Katex tex="u=\cos\theta" />（或 <Katex tex="u=\sin\theta" />）即可化成闭区间 <Katex tex="[-1,1]" /> 上的二次函数，再用对称轴与区间的相对位置定最值。对称轴落在区间外时最值在端点；落在区间内时顶点给一头、较远的端点给另一头。</div>

    <h3 class="sec" id="g1-idea">参数式把二元约束降成一元</h3>
    <p>椭圆 <Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1" /> 上的点满足一个二元方程，两个坐标不能独立变动。写成参数式 <Katex tex="x=a\cos\theta" />、<Katex tex="y=b\sin\theta" /> 之后，两个坐标都由同一个 <Katex tex="\theta" /> 决定。目标式里出现 <Katex tex="x" />、<Katex tex="y" /> 的地方一律代入，二元问题就降成一元问题。</p>
    <p>常见的三类目标：到定点的距离或距离平方（<Katex tex="(x-x_0)^2+(y-y_0)^2" />）、到定直线的距离（<Katex tex="|Ax+By+C|/\sqrt{A^2+B^2}" />）、由三点围成的三角形面积。前两类化成 <Katex tex="\theta" /> 的二次式或 <Katex tex="A\sin\theta+B\cos\theta+C" /> 的形状，第三类多含乘积项，通常先用辅助角公式收拢。</p>

    <h3 class="sec" id="g1-dist">椭圆上的点到定点的距离</h3>
    <div class="board-wrap">
      <BoardMount :factory="createParamOpt" />
      <div class="cap">图 轨1 · <b>参数方程求最值</b>：金色椭圆 <Katex tex="x=2\cos\theta,\ y=\sin\theta" />、蓝色定点 <Katex tex="Q(3,0)" />，右栏是 <Katex tex="f(u)=3u^2-12u+10" />（<Katex tex="u=\cos\theta\in[-1,1]" />）的图象。看点：拖动 <Katex tex="P" /> 绕椭圆走一圈，<Katex tex="PQ" /> 的长度先减后增，右栏的动点沿抛物线滑动；<Katex tex="P" /> 到长轴右端点时 <Katex tex="|PQ|=1" />，到左端点时 <Katex tex="|PQ|=5" />，中间各位置都夹在这两个数之间。</div>
    </div>
    <p>取椭圆 <Katex tex="\dfrac{x^2}{4}+y^2=1" /> 上的点 <Katex tex="P(2\cos\theta,\sin\theta)" />，定点 <Katex tex="Q(3,0)" />。距离平方为</p>
    <p style="text-align:center"><Katex tex="|PQ|^2=(2\cos\theta-3)^2+\sin^2\theta=3\cos^2\theta-12\cos\theta+10." display /></p>
    <p>令 <Katex tex="u=\cos\theta" />，则 <Katex tex="u\in[-1,1]" />，目标化为 <Katex tex="f(u)=3u^2-12u+10" />。这是一条开口向上的抛物线，对称轴 <Katex tex="u=2" /> 落在区间 <Katex tex="[-1,1]" /> 的右侧，所以 <Katex tex="f" /> 在区间上单调递减：<Katex tex="u=1" /> 给最小值 <Katex tex="f(1)=1" />，<Katex tex="u=-1" /> 给最大值 <Katex tex="f(-1)=25" />。对应 <Katex tex="|PQ|_{\min}=1" />、<Katex tex="|PQ|_{\max}=5" />，分别在 <Katex tex="P(2,0)" /> 与 <Katex tex="P(-2,0)" /> 处取得。</p>
    <p>最值点都落在长轴端点上，这不是巧合。定点在长轴上时，椭圆上离它最近与最远的点总是长轴的两个端点；若定点偏离长轴，最值点会挪到别处，但换元与判对称轴的流程完全一样。</p>

    <h3 class="sec" id="g1-interval">cosθ 的闭区间最值</h3>
    <p>把 <Katex tex="u=\cos\theta" /> 的取值区间写对，是这类题的关键。<Katex tex="\theta" /> 取遍实数时 <Katex tex="u" /> 取遍 <Katex tex="[-1,1]" />；若题设把 <Katex tex="\theta" /> 限制在某个范围（比如第一象限的离心角），<Katex tex="u" /> 的区间就随之缩小，端点也要换。</p>
    <p>设目标化成 <Katex tex="f(u)=Au^2+Bu+C" />、<Katex tex="u\in[m,n]" />，对称轴 <Katex tex="u_0=-B/(2A)" />。三种情形：</p>
    <p>① <Katex tex="u_0\le m" />：<Katex tex="f" /> 在 <Katex tex="[m,n]" /> 上单调递增，最小值 <Katex tex="f(m)" />、最大值 <Katex tex="f(n)" />。</p>
    <p>② <Katex tex="u_0\ge n" />：<Katex tex="f" /> 单调递减，最小值 <Katex tex="f(n)" />、最大值 <Katex tex="f(m)" />。</p>
    <p>③ <Katex tex="m<u_0<n" />：顶点给最小值（<Katex tex="A>0" /> 时）<Katex tex="f(u_0)" />，最大值取 <Katex tex="f(m)" />、<Katex tex="f(n)" /> 中较大者，比较 <Katex tex="m" />、<Katex tex="n" /> 谁离对称轴更远即可。</p>
    <p>本题属于第 ② 种：<Katex tex="u_0=2>1" />，最小值在 <Katex tex="u=1" />，最大值在 <Katex tex="u=-1" />，两者都落在端点。</p>

    <h3 class="sec" id="g1-pit">换元后的取值范围</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="u=\cos\theta" /> 当成全体实数。</strong>若在 <Katex tex="f(u)" /> 上直接取顶点 <Katex tex="u=2" />，会得到 <Katex tex="f(2)=-2" />，甚至出现负的距离平方。换元必须同时写出新变量的区间，顶点在区间外就不能取。</li>
        <li><strong>提示二：距离与距离平方混用。</strong><Katex tex="f(u)" /> 的最值点是同一个，但最值本身要先开方才是距离。<Katex tex="|PQ|^2" /> 的最小值 <Katex tex="1" /> 对应 <Katex tex="|PQ|" /> 的最小值 <Katex tex="1" />，最大值 <Katex tex="25" /> 对应 <Katex tex="5" />；中间值不能直接开方后当最值使用。</li>
        <li><strong>提示三：含 <Katex tex="\sin\theta\cos\theta" /> 的目标式直接换元。</strong>形如 <Katex tex="\sin\theta\cos\theta" /> 的项在令 <Katex tex="u=\cos\theta" /> 后仍拖着 <Katex tex="\sin\theta" />。这类式子应先化成 <Katex tex="\tfrac12\sin2\theta" />，或整体用辅助角公式收成一个正弦，再按正弦的值域取值。</li>
        <li><strong>提示四：参数范围与曲线段对不上。</strong>椭圆参数式里 <Katex tex="\theta" /> 取 <Katex tex="[0,2\pi)" /> 才画满整条椭圆。题设只要上半椭圆时，<Katex tex="\theta\in[0,\pi]" />，此时 <Katex tex="u=\cos\theta" /> 仍取遍 <Katex tex="[-1,1]" />，但 <Katex tex="\sin\theta\ge0" /> 这一半信息不能丢。</li>
      </ul>
    </div>
    <p>回收与预告：本章把参数式用在求最值上，目标式只含一个参数；轨2 换一个方向，让动点随参数移动，再消去参数得到整条轨迹的方程。两章合起来，参数式的两种用法——「定曲线求最值」与「动点求轨迹」——就齐了。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createParamOpt } from '../../../boards/polar/apply/paramopt.js';
import { PG_CHAPTERS } from './pgnav.js';
</script>
