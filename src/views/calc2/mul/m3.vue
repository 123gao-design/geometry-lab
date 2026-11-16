<template>
  <ChPage :cur="3" no="微3" base="/calc2/m" :chapters="MD_CHAPTERS"
    title="复合函数与隐函数求导"
    sub="变量常常是套着的：z 依赖 u、v，而 u、v 又依赖 t 或 x、y。链式法则把两层导数按路径乘起来再相加。隐函数则是曲线藏在方程 F(x,y)=0 里，斜率由 F 的两个偏导数相除给出。"
    :toc="[{ id: 'm3-chain', t: '链式法则' }, { id: 'm3-one', t: '一元中间变量' }, { id: 'm3-many', t: '多元中间变量' }, { id: 'm3-impl', t: '隐函数求导' }, { id: 'm3-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="z=f(u,v)" /> 可微，<Katex tex="u=u(t)" />、<Katex tex="v=v(t)" /> 可导，则 <Katex tex="z=f(u(t),v(t))" /> 对 <Katex tex="t" /> 可导，且 <Katex tex="\dfrac{dz}{dt}=f_u\dfrac{du}{dt}+f_v\dfrac{dv}{dt}" />。设 <Katex tex="F(x,y)" /> 在点 <Katex tex="P_0" /> 的邻域内有连续偏导且 <Katex tex="F_y(P_0)\ne0" />，则方程 <Katex tex="F(x,y)=0" /> 在 <Katex tex="P_0" /> 附近确定唯一的连续可导函数 <Katex tex="y=y(x)" />，且 <Katex tex="\dfrac{dy}{dx}=-\dfrac{F_x}{F_y}" />。</div>

    <h3 class="sec" id="m3-chain">链式法则</h3>
    <p>一元复合函数的链式法则是「外层导数乘内层导数」。多元情形多了一层结构：终点的变化可以由好几条路径传来，每条路径各乘一遍，最后相加。把变量画成一张树状图，从 <Katex tex="z" /> 到 <Katex tex="t" /> 有几条路，公式里就有几项。</p>
    <p>以 <Katex tex="z=f(u,v)" />、<Katex tex="u=u(t)" />、<Katex tex="v=v(t)" /> 为例，树上有两条路：<Katex tex="z\to u\to t" /> 与 <Katex tex="z\to v\to t" />。沿第一条路乘 <Katex tex="f_u u'" />，沿第二条路乘 <Katex tex="f_v v'" />，两项相加得 <Katex tex="\dfrac{dz}{dt}" />。这里 <Katex tex="f_u" /> 在 <Katex tex="(u(t),v(t))" /> 处取值，是「站在当前点、沿 <Katex tex="u" /> 方向的变化率」。</p>
    <p>画板左图把这两项画成了两个箭头：蓝色是梯度 <Katex tex="(f_u,f_v)" />，橙色是路径切向 <Katex tex="(u',v')" />，绿色是梯度在切向上的投影。右图曲线的切线斜率正好等于这个投影的长度，也就是 <Katex tex="\dfrac{dz}{dt}" />。拖动 <Katex tex="t" />，两条箭头同时转动，两者的配比与右图斜率同步变化。</p>

    <div class="board-wrap">
      <BoardMount :factory="createChainComp" />
      <div class="cap">图 微3a · <b>复合函数求导机</b>：左图是 <Katex tex="z=u^2v" /> 的等值线与路径 <Katex tex="u=t" />、<Katex tex="v=t^2" />，右图是 <Katex tex="z(t)=t^4" />。看点：无论 <Katex tex="t" /> 取何值，右图切线的斜率都等于左图绿色投影的长度；<Katex tex="t" /> 小的时候梯度与切向的夹角大，投影短，斜率也小。</div>
    </div>

    <h3 class="sec" id="m3-one">一元中间变量</h3>
    <p>上面这个公式可以直接验算。取 <Katex tex="f(u,v)=u^2v" />，<Katex tex="u=t" />，<Katex tex="v=t^2" />，则 <Katex tex="z=t^4" />，<Katex tex="\dfrac{dz}{dt}=4t^3" />。按链式法则算：<Katex tex="f_u=2uv=2t^3" />，<Katex tex="f_v=u^2=t^2" />，<Katex tex="u'=1" />，<Katex tex="v'=2t" />，于是</p>
    <p style="text-align:center"><Katex display tex="\frac{dz}{dt}=2t^3\cdot1+t^2\cdot2t=4t^3," /></p>
    <p>两种算法一致。这类题目容易出错的地方不是公式，而是<b>把 <Katex tex="f_u" /> 当成常数</b>。它其实随 <Katex tex="t" /> 在变，因为 <Katex tex="u" />、<Katex tex="v" /> 都在变。画板里蓝箭头的长度与方向一直在变，正是这件事。</p>
    <p>若内层是三个变量 <Katex tex="u=u(t)" />、<Katex tex="v=v(t)" />、<Katex tex="w=w(t)" />，公式就是三项相加。树上几条路，就写几项，没有别的窍门。</p>

    <h3 class="sec" id="m3-many">多元中间变量</h3>
    <p>内层也可以是多变量。设 <Katex tex="z=f(u,v)" />，<Katex tex="u=u(x,y)" />，<Katex tex="v=v(x,y)" />，则 <Katex tex="z" /> 是 <Katex tex="x" />、<Katex tex="y" /> 的函数，两个偏导为</p>
    <p style="text-align:center"><Katex display tex="\frac{\partial z}{\partial x}=f_u\frac{\partial u}{\partial x}+f_v\frac{\partial v}{\partial x},\qquad \frac{\partial z}{\partial y}=f_u\frac{\partial u}{\partial y}+f_v\frac{\partial v}{\partial y}." /></p>
    <p>结构仍然是「沿路相乘、汇合相加」。此时树有三层：<Katex tex="z" /> 底下一层是 <Katex tex="u" />、<Katex tex="v" />，再底下一层是 <Katex tex="x" />、<Katex tex="y" />。求 <Katex tex="\dfrac{\partial z}{\partial x}" /> 只走能到达 <Katex tex="x" /> 的那两条路。</p>
    <p>考试里常见的形式还有 <Katex tex="z=f(x,y)" /> 且 <Katex tex="y=y(x)" />，此时 <Katex tex="\dfrac{dz}{dx}=f_x+f_y y'" />。这时 <Katex tex="x" /> 同时以两种身份出现——既是外层的第一自变量，又是 <Katex tex="y" /> 的自变量。写公式时把两条路分开，就不会漏掉 <Katex tex="f_x" /> 这一项。</p>

    <div class="board-wrap">
      <BoardMount :factory="createImplicit" />
      <div class="cap">图 微3b · <b>隐函数求导机</b>：金线是 <Katex tex="F(x,y)=0" /> 的曲线，蓝箭头是梯度 <Katex tex="(F_x,F_y)" />（曲线的法向），绿线是切线，斜率 <Katex tex="dy/dx=-F_x/F_y" />。看点：② 是过原点的圆，拖到 <Katex tex="x" /> 轴上时 <Katex tex="F_y=0" />，切线竖直，此时 <Katex tex="y" /> 在这一点的邻域内写不成 <Katex tex="x" /> 的函数。</div>
    </div>

    <h3 class="sec" id="m3-impl">隐函数求导</h3>
    <p>方程 <Katex tex="F(x,y)=0" /> 可能确定一条曲线，却解不出 <Katex tex="y" /> 的显式表达式。这时不必解，把 <Katex tex="y" /> 看成 <Katex tex="x" /> 的函数 <Katex tex="y(x)" />，对等式两边同时求导即可。</p>
    <p>设 <Katex tex="F" /> 有连续偏导且 <Katex tex="F_y\ne0" />，在 <Katex tex="F(x,y(x))=0" /> 两边对 <Katex tex="x" /> 求导，用链式法则得 <Katex tex="F_x+F_y y'=0" />，于是</p>
    <p style="text-align:center"><Katex display tex="\frac{dy}{dx}=-\frac{F_x}{F_y}." /></p>
    <p>几何上这条式子说的是：切线的方向与梯度垂直，而梯度是 <Katex tex="(F_x,F_y)" />，所以切线的斜率是 <Katex tex="-F_x/F_y" />。画板里蓝箭头与绿线始终垂直，正因为它们一个是法向、一个是切向。</p>
    <p>条件 <Katex tex="F_y\ne0" /> 不是摆设。第二个预设的圆 <Katex tex="(x-1)^2+y^2=1" /> 过原点，在原点处 <Katex tex="F_x=-2" />、<Katex tex="F_y=0" />，曲线有竖直切线，<Katex tex="y" /> 在原点附近不能写成 <Katex tex="x" /> 的单值函数（同一个 <Katex tex="x" /> 附近有两个 <Katex tex="y" />）。但此时 <Katex tex="F_x\ne0" />，反过来可以把 <Katex tex="x" /> 写成 <Katex tex="y" /> 的函数，公式换成 <Katex tex="\dfrac{dx}{dy}=-\dfrac{F_y}{F_x}" />。</p>
    <p>这个条件与隐函数存在定理的内容一致：偏导连续、<Katex tex="F_y\ne0" />，则局部存在唯一的可导解。定理给的是「附近」与「唯一」，所以结论只在 <Katex tex="P_0" /> 的一个小邻域内成立，不能推到整条曲线上。</p>

    <h3 class="sec" id="m3-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：忘记「先乘后加」里的「加」。</strong>路径有两条时要写两项，只写 <Katex tex="f_u u'" /> 会漏掉另一个中间变量的贡献。</li>
        <li><strong>提示二：把偏导数当成常数。</strong><Katex tex="f_u" /> 仍在中间变量处取值，中间变量随 <Katex tex="t" /> 变，它也跟着变；不要把 <Katex tex="f_u" /> 提到求导号外。</li>
        <li><strong>提示三：隐函数求导时漏掉负号。</strong><Katex tex="\dfrac{dy}{dx}=-\dfrac{F_x}{F_y}" /> 前面的负号来自 <Katex tex="F_x+F_yy'=0" /> 的移项，代入具体点计算时最容易丢。</li>
        <li><strong>提示四：不检查 <Katex tex="F_y" /> 是否为零。</strong>分母为零时公式失效，要换一个变量作因变量，或直接由图形判断切线是否竖直。</li>
      </ul>
    </div>
    <p>回收与预告：链式法则让「沿一条路径的变化率」可以算出来。若把路径选成任意方向的射线，得到的就是方向导数；这些方向导数里最大的那个，由梯度给出。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChainComp } from '../../../boards/calc2/mul/chaincomp.js';
import { createBoard as createImplicit } from '../../../boards/calc2/mul/implicit.js';
import { MD_CHAPTERS } from './mnav.js';
</script>
