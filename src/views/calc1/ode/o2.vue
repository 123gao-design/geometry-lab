<template>
  <ChPage :cur="2" no="方2" base="/calc1/o" :chapters="ON_CHAPTERS"
    title="可分离变量方程"
    sub="把含 y 的项与含 x 的项分别归到等号两边，两边各积一次，通解就出来了。"
    :toc="[{ id: 'o2-sep', t: '分离变量' }, { id: 'o2-int', t: '两边积分' }, { id: 'o2-const', t: '常数与初值' }, { id: 'o2-logi', t: '逻辑斯蒂方程' }]">

    <div class="note good" id="o2-sep">若一阶方程可以写成 <Katex tex="y'=g(x)h(y)" />，即右端是 x 的函数与 y 的函数的乘积，就称它为<b>可分离变量方程</b>。把 <Katex tex="\mathrm{d}y/\mathrm{d}x" /> 当成两个微分的商移项，得 <Katex tex="\dfrac{\mathrm{d}y}{h(y)}=g(x)\,\mathrm{d}x" />，两边各求一次不定积分即可。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSeplab" />
      <div class="cap">图 方2 · <b>可分离变量的方程</b>：右栏是分离与积分两步，蓝线是 <Katex tex="C" /> 定下的那一条解，橙色细线是同族的其他曲线。<b>看点</b>：<Katex tex="C" /> 一拖整族换高度，而每条曲线在 <Katex tex="x_0" /> 处的斜率始终与方程给的值一致。</div>
    </div>

    <h3 class="sec" id="o2-int">两边积分与通解</h3>
    <p>预设 ① 的 <Katex tex="y'=2xy" /> 是最典型的形状。分离得 <Katex tex="\dfrac{\mathrm{d}y}{y}=2x\,\mathrm{d}x" />，两边积分得 <Katex tex="\ln|y|=x^2+C_1" />，取指数并把常数重新记作 <Katex tex="C" />，得 <Katex tex="y=C\mathrm{e}^{x^2}" />。第三步只是把 <Katex tex="\mathrm{e}^{C_1}" /> 收进一个新常数，这一步不必拘谨，它是这套做法里唯一可以随意的化简。</p>
    <p>验算很直接：对 <Katex tex="y=C\mathrm{e}^{x^2}" /> 求导得 <Katex tex="y'=2xC\mathrm{e}^{x^2}=2xy" />，与原方程相同。图 方2 的同族曲线正是把 <Katex tex="C" /> 换成几个不同数值画出来的，它们形状一致、上下错开，与方向场里那些互不相交的短线吻合。</p>
    <p>预设 ② 的 <Katex tex="y'=y^2" /> 稍不同：分离后 <Katex tex="\mathrm{d}y/y^2=\mathrm{d}x" />，积分得 <Katex tex="-1/y=x+C_1" />，即 <Katex tex="y=1/(C-x)" />。这里有一个容易忽略的解 <Katex tex="y\equiv0" />：分离时两边同除了 <Katex tex="y" />，除掉的恰是使分母为零的那种情形。凡是分离时做了除法，都要回头单独检查被除式为零的解。</p>

    <h3 class="sec" id="o2-const">常数由初值定</h3>
    <p>通解里的 <Katex tex="C" /> 是一个待定的数。若题目给出 <Katex tex="y(x_0)=y_0" />，把它代进通解解出 <Katex tex="C" />，就得到过该点的唯一一条解曲线。图 方2 里 <Katex tex="C" /> 滑块与 <Katex tex="x_0" /> 滑块配合，可以看着 <Katex tex="C" /> 决定哪一条曲线、<Katex tex="x_0" /> 决定在曲线上读哪一点。</p>
    <p>几何上，定 <Katex tex="C" /> 相当于在方向场的一族曲线里划过某点的那一条。这也解释了为什么初值问题的解在局部唯一：方向场每点只有一个斜率，过点的曲线只有一条走得通。</p>
    <p>若初值取在使 <Katex tex="h(y_0)=0" /> 的位置，分离那一步就失效了，此时应先看 <Katex tex="y\equiv y_0" /> 是不是解。方程 <Katex tex="y'=y^2" /> 的 <Katex tex="y\equiv0" /> 就是这情形：它是有解，却不在通解公式里。</p>

    <h3 class="sec" id="o2-logi">逻辑斯蒂方程与它有界的解</h3>
    <p>预设 ③ 的 <Katex tex="y'=y(1-y)" /> 常用来描述增长受到上限约束的过程。分离并部分分式展开得 <Katex tex="\ln\left|\dfrac{y}{1-y}\right|=x+C_1" />，解出 <Katex tex="y=\dfrac{1}{1+C\mathrm{e}^{-x}}" />。这个解的图像从 0 附近平缓起步，到中间最陡，随后压着水平线 <Katex tex="y=1" /> 走——方向场里 <Katex tex="y=1" /> 以上的斜率全为负、以下全为正，曲线被推着靠向这条线，却始终不穿过它。</p>
    <p><Katex tex="y=0" /> 与 <Katex tex="y=1" /> 都是常数解，在这两条线上的 <Katex tex="y'=0" />，曲线一旦落在上面就停住不动。它们把平面切成三条带，带内的解各自被困在自己的带里，这就是图像上多条曲线平行走向、互不交叉的原因。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：除过的因子要补查零解。</strong>分离时两边除以 <Katex tex="h(y)" />，就要回头单独看 <Katex tex="h(y)=0" /> 给出的常数解是否遗漏。</li>
        <li><strong>提示二：只对同一条积分曲线分离。</strong><Katex tex="\mathrm{d}y/\mathrm{d}x" /> 当商看待只是记号上的方便，真正在用的是一阶微分形式；写开时变量归属要一致，不能一边留下 <Katex tex="x" /> 一边留下 <Katex tex="y" />。</li>
        <li><strong>提示三：对数式要带绝对值再化开。</strong><Katex tex="\ln|y|" /> 化为 <Katex tex="y=C\mathrm{e}^{x^2}" /> 时，<Katex tex="C" /> 可以取负值，这一点不要因为初等写法而漏掉。</li>
        <li><strong>提示四：解的区间要跟着公式走。</strong><Katex tex="y=1/(C-x)" /> 的定义域被 <Katex tex="x=C" /> 切成两段，初值在哪一段，解就只能延伸到那一段。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSeplab } from '../../../boards/calc1/ode/seplab.js';
import { ON_CHAPTERS } from './onav.js';
</script>
