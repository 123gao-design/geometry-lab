<template>
  <ChPage :cur="1" no="线1" base="/calc2/c" :chapters="MC_CHAPTERS"
    title="第一类曲线积分"
    sub="把曲线切成小弧段，每段的质量是线密度乘弧长，加起来就是曲线积分。它对弧长加权，所以只与曲线的形状和密度有关，与从哪里走到哪里无关。计算的办法是把曲线参数化，把弧长元换成一元积分里的 dt。"
    :toc="[{ id: 'c1-def', t: '弧长元与定义' }, { id: 'c1-calc', t: '参数化计算' }, { id: 'c1-app', t: '质量、质心与转动惯量' }, { id: 'c1-pit', t: '四条提示' }]">
    <div class="note good">设曲线 <Katex tex="C" /> 的弧长为 <Katex tex="s" />，在其上定义函数 <Katex tex="f(x,y)" />。把 <Katex tex="C" /> 分成 <Katex tex="n" /> 段，第 <Katex tex="i" /> 段的弧长 <Katex tex="\Delta s_i" />，在其上任取一点 <Katex tex="(\xi_i,\eta_i)" />，若 <Katex tex="\sum_{i=1}^{n}f(\xi_i,\eta_i)\Delta s_i" /> 当各段弧长趋于零时趋向同一个数，就记作 <Katex tex="\int_C f(x,y)\,ds" />，称为<b>第一类曲线积分</b>（对弧长的曲线积分）。</div>

    <div class="board-wrap">
      <BoardMount :factory="createLineInt1" />
      <div class="cap">图 线1 · <b>第一类曲线积分机</b>：曲线是四分之一圆弧 <Katex tex="x^2+y^2=R^2" />，线密度 <Katex tex="\rho=1+y" />，颜色越橙越重。金色小弧段是 <Katex tex="P" /> 附近的一段 <Katex tex="ds" />；右栏把 <Katex tex="\rho" /> 沿弧长 <Katex tex="s" /> 画出来，阴影面积就是这段曲线的总质量。看点：点一下「换走向」，左图的走向箭头反过来，而四个读数一个都不变。</div>
    </div>

    <h3 class="sec" id="c1-def">弧长元与定义</h3>
    <p>定义里的 <Katex tex="ds" /> 是<b>弧长元</b>，不是坐标增量。曲线用参数方程 <Katex tex="x=x(t)" />、<Katex tex="y=y(t)" />（<Katex tex="\alpha\le t\le\beta" />）给出时，</p>
    <p style="text-align:center"><Katex display tex="ds=\sqrt{x'(t)^2+y'(t)^2}\,dt." /></p>
    <p>这个式子来自「切线段近似小弧段」：把参数增量 <Katex tex="dt" /> 对应的位移 <Katex tex="(x'\,dt,\ y'\,dt)" /> 取长度，就是 <Katex tex="ds" />。于是</p>
    <p style="text-align:center"><Katex display tex="\int_C f\,ds=\int_\alpha^\beta f\big(x(t),y(t)\big)\sqrt{x'^2+y'^2}\,dt." /></p>
    <p>注意下限 <Katex tex="\alpha" /> 必须小于上限 <Katex tex="\beta" />：弧长元 <Katex tex="ds>0" />，积分与走向无关。这与第二类曲线积分正好相反。</p>

    <h3 class="sec" id="c1-calc">参数化计算</h3>
    <p>以画板的四分之一圆弧为例：<Katex tex="x=R\cos\theta" />、<Katex tex="y=R\sin\theta" />，<Katex tex="0\le\theta\le\pi/2" />，此时 <Katex tex="\sqrt{x'^2+y'^2}=R" />，<Katex tex="ds=R\,d\theta" />。</p>
    <p style="text-align:center"><Katex display tex="\int_C(1+y)\,ds=\int_0^{\pi/2}(1+R\sin\theta)R\,d\theta=\frac{\pi R}{2}+R^2." /></p>
    <p>两项来源不同：<Katex tex="\frac{\pi R}{2}" /> 是弧长本身（密度取 1 时的积分），<Katex tex="R^2" /> 是密度中 <Katex tex="y" /> 那一部分的贡献，由 <Katex tex="\int_0^{\pi/2}R^2\sin\theta\,d\theta" /> 给出。</p>
    <p>曲线若用 <Katex tex="y=y(x)" /> 给出，则 <Katex tex="ds=\sqrt{1+y'^2}\,dx" />；曲线若用极坐标 <Katex tex="r=r(\theta)" /> 给出，则 <Katex tex="ds=\sqrt{r^2+r'^2}\,d\theta" />。三种写法是同一件事，按曲线的给法选一种。</p>

    <h3 class="sec" id="c1-app">质量、质心与转动惯量</h3>
    <p>把 <Katex tex="f" /> 读成线密度 <Katex tex="\rho" />，第一类曲线积分就是曲线的质量：<Katex tex="M=\int_C\rho\,ds" />。重复重积分一章的做法，质心与转动惯量写成</p>
    <p style="text-align:center"><Katex display tex="\bar x=\frac{1}{M}\int_Cx\rho\,ds,\qquad I_x=\int_Cy^2\rho\,ds," /></p>
    <p>下标换成 <Katex tex="y" /> 时用 <Katex tex="x^2" />，与平面薄片的公式逐项对应。画板右栏的阴影面积读的就是 <Katex tex="\int_C\rho\,ds" />，把点 <Katex tex="P" /> 拖到弧的末端，累加出来的正是总质量。</p>
    <p>空间曲线的情形只是多加一项：<Katex tex="ds=\sqrt{x'^2+y'^2+z'^2}\,dt" />，其余写法不变。</p>

    <h3 class="sec" id="c1-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="ds" /> 写成 <Katex tex="dx" /> 或 <Katex tex="dy" />。</strong>弧长元带根号，换错会丢掉曲线的长度信息，结果与曲线形状无关了。</li>
        <li><strong>提示二：下限大于上限。</strong>第一类积分要求 <Katex tex="\alpha<\beta" />；从 <Katex tex="\beta" /> 积到 <Katex tex="\alpha" /> 不会变号，但会算出一个负数，暴露了次序写错。</li>
        <li><strong>提示三：参数化后忘了换被积函数。</strong><Katex tex="x" />、<Katex tex="y" /> 都要换成参数的表达式，留在原式里就没法积。</li>
        <li><strong>提示四：把第一类与第二类混着用。</strong>第一类对弧长加权、与走向无关；第二类对坐标加权、走向反过来变号。两者的参数化长相相似，积分对象不同。</li>
      </ul>
    </div>
    <p>回收与预告：力沿曲线做功时，起作用的不是弧长，而是位移在力方向上的分量。<Katex tex="dx" />、<Katex tex="dy" /> 重新回到被积式里，这就是第二类曲线积分。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLineInt1 } from '../../../boards/calc2/curve/lineint1.js';
import { MC_CHAPTERS } from './cnav.js';
</script>
