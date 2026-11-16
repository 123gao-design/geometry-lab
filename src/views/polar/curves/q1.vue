<template>
  <ChPage :cur="1" no="曲1" base="/polar/q" :chapters="PQ_CHAPTERS"
    title="圆的极坐标方程"
    sub="圆心在极点时，圆写成 ρ=a 这样一句；圆心挪到极轴上或过极点垂直于极轴的直线上时，方程变成 ρ=2a cosθ 与 ρ=2a sinθ。三种写法都从直角坐标方程出发，把 x、y 换成 ρcosθ、ρsinθ 得到。"
    :toc="[{ id: 'q1-pole', t: '圆心在极点' }, { id: 'q1-axis', t: '圆心在极轴上且过极点' }, { id: 'q1-perp', t: '圆心在垂直线上且过极点' }, { id: 'q1-conv', t: '与直角坐标方程互化' }, { id: 'q1-pit', t: '约去 ρ、θ 范围与 2a' }]">
    <div class="note good">极坐标方程 <Katex tex="\rho=f(\theta)" /> 描述的是「极径随极角变化」的曲线。圆的极坐标方程有三种常见位置：圆心在极点时 <Katex tex="\rho=a" />；圆心在 <Katex tex="(a,0)" />、半径为 <Katex tex="a" /> 且过极点时 <Katex tex="\rho=2a\cos\theta" />；圆心在 <Katex tex="(0,a)" />、半径为 <Katex tex="a" /> 且过极点时 <Katex tex="\rho=2a\sin\theta" />。三式里的 <Katex tex="a" /> 都是半径。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPolarCircle" />
      <div class="cap">图 曲1 · <b>圆的极坐标方程</b>：金色圆周、蓝色直径 <Katex tex="OA" />、橙色极角弧。看点：切换三种圆心位置，方程随之改变；拖动 <Katex tex="P" /> 沿圆周走，<Katex tex="P" /> 与直径两端连成的 <Katex tex="\angle OPA" /> 始终是直角，这正是 <Katex tex="\rho=2a\cos\theta" /> 的几何来源。末一枚徽章把极角代回方程，说明什么时候 <Katex tex="\rho" /> 为正、什么时候要改用反向射线。</div>
    </div>

    <h3 class="sec" id="q1-pole">圆心在极点</h3>
    <p>圆心在极点、半径为 <Katex tex="a" /> 的圆，圆周上每一点到极点的距离都等于 <Katex tex="a" />。极径不随极角变化，方程就是</p>
    <p style="text-align:center"><Katex tex="\rho=a." display /></p>
    <p>这是极坐标里最简单的一种方程：<Katex tex="\theta" /> 取遍 <Katex tex="[0^\circ,360^\circ)" />，<Katex tex="\rho" /> 恒为 <Katex tex="a" />。换成直角坐标，也就是 <Katex tex="x^2+y^2=a^2" />。图 曲1 的第三种位置对应的就是这一式。</p>

    <h3 class="sec" id="q1-axis">圆心在极轴上且过极点</h3>
    <p>设圆心为 <Katex tex="C(a,0)" />，半径为 <Katex tex="a" />。圆过极点，直径是 <Katex tex="OA" />，其中 <Katex tex="A(2a,0)" />。先写直角坐标方程：</p>
    <p style="text-align:center"><Katex tex="(x-a)^2+y^2=a^2\quad\Longrightarrow\quad x^2+y^2=2ax." display /></p>
    <p>把 <Katex tex="x=\rho\cos\theta" />、<Katex tex="x^2+y^2=\rho^2" /> 代入，得 <Katex tex="\rho^2=2a\rho\cos\theta" />，即</p>
    <p style="text-align:center"><Katex tex="\rho(\rho-2a\cos\theta)=0." display /></p>
    <p>第一个因式给出极点。极点在圆上，而第二个因式在 <Katex tex="\theta=\pm90^\circ" /> 时也取 <Katex tex="\rho=0" />，已把极点包含在内，所以圆的方程可以只写第二个因式：</p>
    <p style="text-align:center"><Katex tex="\rho=2a\cos\theta." display /></p>
    <p>这里必须约定 <Katex tex="\rho" /> 可取负值，方程才画得出整个圆。若只允许 <Katex tex="\rho\ge0" />，则 <Katex tex="\cos\theta\ge0" />，<Katex tex="\theta\in[-90^\circ,90^\circ]" />，只得到极轴右侧的半个圆；左半圆上的点要用 <Katex tex="\theta+180^\circ" /> 与负径来表示。图 曲1 的判读徽章把这两种情形分开写出。</p>
    <p>几何上，<Katex tex="OA" /> 是直径，<Katex tex="P" /> 在圆上，所以 <Katex tex="\angle OPA=90^\circ" />。在直角三角形 <Katex tex="OPA" /> 中，<Katex tex="|OP|=|OA|\cos\theta" />，即 <Katex tex="\rho=2a\cos\theta" />。代数推导与几何读法在这里给出同一式。</p>

    <h3 class="sec" id="q1-perp">圆心在垂直线上且过极点</h3>
    <p>把圆绕极点转 <Katex tex="90^\circ" />，圆心落到 <Katex tex="C(0,a)" />，直径端点变成 <Katex tex="A(0,2a)" />。直角坐标方程为 <Katex tex="x^2+(y-a)^2=a^2" />，即 <Katex tex="x^2+y^2=2ay" />。同样代入 <Katex tex="y=\rho\sin\theta" />，得</p>
    <p style="text-align:center"><Katex tex="\rho=2a\sin\theta." display /></p>
    <p>此时 <Katex tex="\sin\theta\ge0" /> 对应极轴上方的半圆，<Katex tex="\theta\in[0^\circ,180^\circ]" />；下半圆由负径给出。两式只差一个三角函数：圆心在极轴上用余弦，圆心在过极点且垂直于极轴的直线上用正弦。</p>
    <p>更一般地，若圆心在极角为 <Katex tex="\alpha" /> 的方向上、半径为 <Katex tex="a" /> 且过极点，方程写成 <Katex tex="\rho=2a\cos(\theta-\alpha)" />。把坐标轴转到 <Katex tex="\alpha" /> 方向，就回到 <Katex tex="\rho=2a\cos\theta" /> 的情形。</p>

    <h3 class="sec" id="q1-conv">与直角坐标方程互化</h3>
    <p>极坐标化直角坐标，用 <Katex tex="x=\rho\cos\theta" />、<Katex tex="y=\rho\sin\theta" /> 直接代入；直角坐标化极坐标，多用 <Katex tex="\rho^2=x^2+y^2" /> 与 <Katex tex="\rho\cos\theta=x" />、<Katex tex="\rho\sin\theta=y" /> 三条关系。以 <Katex tex="\rho=2a\cos\theta" /> 为例，两边同乘 <Katex tex="\rho" />：</p>
    <p style="text-align:center"><Katex tex="\rho^2=2a\rho\cos\theta\quad\Longrightarrow\quad x^2+y^2=2ax\quad\Longrightarrow\quad(x-a)^2+y^2=a^2." display /></p>
    <p>乘 <Katex tex="\rho" /> 这一步不丢点：原方程在 <Katex tex="\theta=\pm90^\circ" /> 处给出极点，乘后仍然过极点。反过来，从 <Katex tex="x^2+y^2=2ax" /> 出发，代入 <Katex tex="x=\rho\cos\theta" /> 后约去一个 <Katex tex="\rho" />，要说明被约去的 <Katex tex="\rho=0" /> 已包含在所得方程里。</p>

    <h3 class="sec" id="q1-pit">约去 ρ、θ 范围与 2a</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：约去 <Katex tex="\rho" /> 时丢点。</strong>由 <Katex tex="\rho^2=2a\rho\cos\theta" /> 约去 <Katex tex="\rho" />，默认 <Katex tex="\rho\ne0" />，极点被排除在外。只有当所得方程也能取到极点时，才能直接写 <Katex tex="\rho=2a\cos\theta" />；否则要补上极点。</li>
        <li><strong>提示二：<Katex tex="\theta" /> 的范围随 <Katex tex="\rho" /> 的符号约定改变。</strong>允许负径时，<Katex tex="\theta" /> 取遍一周，方程画出整个圆；规定 <Katex tex="\rho\ge0" /> 时，只有 <Katex tex="\cos\theta\ge0" /> 的一段有效，另半个圆要另写。读题先看约定。</li>
        <li><strong>提示三：<Katex tex="2a" /> 是直径。</strong><Katex tex="\rho=2a\cos\theta" /> 里的 <Katex tex="a" /> 是半径，<Katex tex="2a" /> 是直径 <Katex tex="OA" /> 的长。把 <Katex tex="2a" /> 当成半径，圆会大一倍。</li>
        <li><strong>提示四：<Katex tex="a" /> 的符号。</strong>若 <Katex tex="a&lt;0" />，圆心落在极轴的反向延长线上，方程仍写成 <Katex tex="\rho=2a\cos\theta" /> 也能画出圆，只是半径要取 <Katex tex="|a|" />。通常约定 <Katex tex="a&gt;0" />，把符号交给圆心坐标。</li>
      </ul>
    </div>
    <p>回收与预告：曲1 的三式与直角坐标里的圆方程一一对应，互化只用到 <Katex tex="x=\rho\cos\theta" />、<Katex tex="y=\rho\sin\theta" /> 与 <Katex tex="\rho^2=x^2+y^2" />。曲2 把同样的代入法用到直线上，得到 <Katex tex="\theta=\alpha" />、<Katex tex="\rho\cos\theta=a" />、<Katex tex="\rho\sin\theta=b" /> 三种写法；参1 再把这些曲线改写成含参数的方程。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarCircle } from '../../../boards/polar/curves/polarcircle.js';
import { PQ_CHAPTERS } from './pqnav.js';
</script>
