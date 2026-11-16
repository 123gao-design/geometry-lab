<template>
  <ChPage :cur="2" no="曲2" base="/polar/q" :chapters="PQ_CHAPTERS"
    title="直线与射线的极坐标方程"
    sub="直线在极坐标里有三种常见写法：过极点的直线写成 θ=α，垂直于极轴的直线写成 ρcosθ=a，平行于极轴的直线写成 ρsinθ=b。三式都由直角坐标方程代入 x=ρcosθ、y=ρsinθ 得到，区别只在直线与极轴的位置关系。"
    :toc="[{ id: 'q2-pole', t: '过极点的直线' }, { id: 'q2-perp', t: '垂直于极轴的直线' }, { id: 'q2-par', t: '平行于极轴的直线' }, { id: 'q2-gen', t: '拓展：一般位置' }, { id: 'q2-pit', t: '射线与直线、a 的符号' }]">
    <div class="note good">过极点、极角为 <Katex tex="\alpha" /> 的直线：<Katex tex="\theta=\alpha" />（<Katex tex="\rho\in\mathbb{R}" />）。垂直于极轴、与极点相距 <Katex tex="a" /> 的直线：<Katex tex="\rho\cos\theta=a" />。平行于极轴、与极轴相距 <Katex tex="b" /> 的直线：<Katex tex="\rho\sin\theta=b" />。三种写法都是直角坐标方程的直接翻译：<Katex tex="y=(\tan\alpha)x" />、<Katex tex="x=a" />、<Katex tex="y=b" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPolarLine" />
      <div class="cap">图 曲2 · <b>直线与射线的极坐标方程</b>：金色直线、橙色极角弧，蓝色虚线与直角标记是极点到直线的垂线段。看点：切换三种位置，方程在 <Katex tex="\theta=\alpha" />、<Katex tex="\rho\cos\theta=a" />、<Katex tex="\rho\sin\theta=b" /> 之间变化；拖动 <Katex tex="P" /> 沿直线走，点在同一枚直线上的极坐标有无穷多组；竖直与水平两种位置下，垂足 <Katex tex="H" /> 到极点的距离就是 <Katex tex="|a|" /> 或 <Katex tex="|b|" />。</div>
    </div>

    <h3 class="sec" id="q2-pole">过极点的直线</h3>
    <p>过极点、倾斜角为 <Katex tex="\alpha" /> 的直线，直角坐标方程是 <Katex tex="y=(\tan\alpha)x" />。代入 <Katex tex="y=\rho\sin\theta" />、<Katex tex="x=\rho\cos\theta" />，得 <Katex tex="\rho\sin\theta=\rho\cos\theta\tan\alpha" />。当 <Katex tex="\rho\ne0" /> 时约去 <Katex tex="\rho" />，得 <Katex tex="\tan\theta=\tan\alpha" />，于是</p>
    <p style="text-align:center"><Katex tex="\theta=\alpha\quad(\rho\in\mathbb{R})." display /></p>
    <p>这里 <Katex tex="\rho" /> 必须允许取负值，式子的含义才是整条直线。<Katex tex="\rho>0" /> 的一半是极角为 <Katex tex="\alpha" /> 的射线，<Katex tex="\rho&lt;0" /> 的一半是它的反向射线，两条射线拼成直线。若题目只允许 <Katex tex="\rho\ge0" />，那么 <Katex tex="\theta=\alpha" /> 只表示一条射线；要表示整条直线，需写成 <Katex tex="\theta=\alpha" /> 或 <Katex tex="\theta=\alpha+180^\circ" /> 两条射线。</p>
    <p>当 <Katex tex="\alpha=90^\circ" /> 时，<Katex tex="\tan\alpha" /> 不存在，直角坐标方程要单独写成 <Katex tex="x=0" />；极坐标方程 <Katex tex="\theta=90^\circ" /> 仍然成立，不受正切无定义的影响。这是极坐标写法的一个方便之处。</p>

    <h3 class="sec" id="q2-perp">垂直于极轴的直线</h3>
    <p>与极点相距 <Katex tex="a" />、垂直于极轴的直线，直角坐标方程是 <Katex tex="x=a" />。代入 <Katex tex="x=\rho\cos\theta" />，直接得到</p>
    <p style="text-align:center"><Katex tex="\rho\cos\theta=a." display /></p>
    <p><Katex tex="a>0" /> 时直线在极点右侧，<Katex tex="a&lt;0" /> 时在左侧，<Katex tex="a=0" /> 时直线过极点，就是 <Katex tex="y" /> 轴，此时方程退化为 <Katex tex="\theta=90^\circ" />。直线到极点的距离是 <Katex tex="|a|" />，垂足为 <Katex tex="H(a,0)" />。图 曲2 的蓝色虚线段就是 <Katex tex="OH" />。</p>
    <p>这条直线不过极点，所以 <Katex tex="\rho" /> 不可能为零。要让 <Katex tex="\rho>0" />，只需 <Katex tex="\cos\theta" /> 与 <Katex tex="a" /> 同号：<Katex tex="a>0" /> 时 <Katex tex="\theta\in(-90^\circ,90^\circ)" />，<Katex tex="a&lt;0" /> 时 <Katex tex="\theta\in(90^\circ,270^\circ)" />。其余角度上的点由负径给出。</p>

    <h3 class="sec" id="q2-par">平行于极轴的直线</h3>
    <p>与极轴相距 <Katex tex="b" />、平行于极轴的直线，直角坐标方程是 <Katex tex="y=b" />。代入 <Katex tex="y=\rho\sin\theta" />，得</p>
    <p style="text-align:center"><Katex tex="\rho\sin\theta=b." display /></p>
    <p><Katex tex="b>0" /> 时直线在极轴上方，<Katex tex="b&lt;0" /> 时在下方，<Katex tex="b=0" /> 时直线就是极轴，方程退化为 <Katex tex="\theta=0^\circ" />。直线到极轴的距离是 <Katex tex="|b|" />，垂足为 <Katex tex="H(0,b)" />。要让 <Katex tex="\rho>0" />，需 <Katex tex="\sin\theta" /> 与 <Katex tex="b" /> 同号：<Katex tex="b>0" /> 时 <Katex tex="\theta\in(0^\circ,180^\circ)" />，<Katex tex="b&lt;0" /> 时 <Katex tex="\theta\in(180^\circ,360^\circ)" />。</p>
    <p>垂直于极轴用余弦，平行于极轴用正弦，两者只差一个投影方向。<Katex tex="\rho\cos\theta" /> 是点在极轴上的投影横坐标，<Katex tex="\rho\sin\theta" /> 是点在垂直方向上的投影纵坐标。</p>

    <h3 class="sec" id="q2-gen">拓展：一般位置</h3>
    <p>不过极点、也不与极轴平行或垂直的直线，可以写成</p>
    <p style="text-align:center"><Katex tex="\rho\cos(\theta-\alpha)=d\quad(d\ge0)." display /></p>
    <p>展开左边：<Katex tex="\rho\cos\theta\cos\alpha+\rho\sin\theta\sin\alpha=x\cos\alpha+y\sin\alpha" />，所以它在直角坐标里是 <Katex tex="x\cos\alpha+y\sin\alpha=d" />。这是一条法线方向为 <Katex tex="\alpha" />、到极点距离为 <Katex tex="d" /> 的直线。<Katex tex="\alpha=0" /> 时回到 <Katex tex="\rho\cos\theta=d" />，<Katex tex="\alpha=90^\circ" /> 时回到 <Katex tex="\rho\sin\theta=d" />。一般位置的直线因此不必另记一套公式，三种常见写法都是它的特例。</p>
    <p>反过来，任意一条不过极点的直线 <Katex tex="Ax+By+C=0" />（<Katex tex="C\ne0" />）都能化成这个形状：把方程除以 <Katex tex="\sqrt{A^2+B^2}" />，令 <Katex tex="\cos\alpha" />、<Katex tex="\sin\alpha" /> 分别为 <Katex tex="A" />、<Katex tex="B" /> 除以该根式，右边就是原点到直线的距离。</p>

    <h3 class="sec" id="q2-pit">射线与直线、a 的符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\theta=\alpha" /> 是直线还是射线，取决于 <Katex tex="\rho" /> 的取值范围。</strong>约定 <Katex tex="\rho\in\mathbb{R}" /> 时，它是整条直线；约定 <Katex tex="\rho\ge0" /> 时，它只是 <Katex tex="\alpha" /> 方向的一条射线。题目若问「过极点、倾斜角为 <Katex tex="\alpha" /> 的直线」，要确认负径是否允许。</li>
        <li><strong>提示二：<Katex tex="\alpha" /> 与 <Katex tex="\alpha+180^\circ" /> 表示同一条直线。</strong>在允许负径的约定下，两式给出的点集完全相同，不能当成两条不同的直线。</li>
        <li><strong>提示三：<Katex tex="a" /> 的符号表示左右，不表示距离。</strong><Katex tex="\rho\cos\theta=-2" /> 是极点左侧、距极点 <Katex tex="2" /> 的直线，不是「距离为负」。距离一律取 <Katex tex="|a|" />。</li>
        <li><strong>提示四：<Katex tex="\alpha=90^\circ" /> 时不能写 <Katex tex="y=(\tan\alpha)x" />。</strong>正切无定义，直角坐标方程要写成 <Katex tex="x=0" />；极坐标方程 <Katex tex="\theta=90^\circ" /> 不受影响。</li>
        <li><strong>提示五：极坐标方程不唯一。</strong>同一条直线可以写成 <Katex tex="\theta=\alpha" />，也可以写成 <Katex tex="\theta=\alpha+180^\circ" />；同一条竖直线可以写成 <Katex tex="\rho\cos\theta=a" />，也可以写成 <Katex tex="\rho\cos(\theta+180^\circ)=-a" />。判断两个方程是否表示同一图形，要看点集，不看写法。</li>
      </ul>
    </div>
    <p>回收与预告：曲1 与曲2 把圆和直线的极坐标方程凑齐，用的都是同一条代入链 <Katex tex="x=\rho\cos\theta" />、<Katex tex="y=\rho\sin\theta" />、<Katex tex="x^2+y^2=\rho^2" />。下一子专题参1 换一个方向：不再用极角表示曲线，而是另取一个参数，把 <Katex tex="x" />、<Katex tex="y" /> 分别写成参数的函数。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarLine } from '../../../boards/polar/curves/polarline.js';
import { PQ_CHAPTERS } from './pqnav.js';
</script>
