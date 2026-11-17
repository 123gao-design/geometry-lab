<template>
  <ChPage :cur="1" no="重1" base="/calc2/r" :chapters="MR_CHAPTERS"
    title="二重积分的定义与性质"
    sub="把一块平面区域切成许多小块，每块取一点算函数值、乘面积，再加起来。分得越细，这个和越靠近同一个数——那就是二重积分。它有两个读法：区域上函数值的加权和，或者曲顶柱体的体积。"
    :toc="[{ id: 'r1-def', t: '分割、近似、求和、取极限' }, { id: 'r1-geo', t: '几何意义' }, { id: 'r1-prop', t: '性质' }, { id: 'r1-pit', t: '四条提示' }]">
    <div class="note good">把平面区域 <Katex tex="D" /> 任意分成 <Katex tex="n" /> 个小块 <Katex tex="\Delta\sigma_i" />，在每块上任取一点 <Katex tex="(\xi_i,\eta_i)" />，作和 <Katex tex="\sum_{i=1}^{n}f(\xi_i,\eta_i)\Delta\sigma_i" />。若当所有小块的直径都趋于零时这个和趋于同一个常数 <Katex tex="I" />，就称 <Katex tex="f" /> 在 <Katex tex="D" /> 上可积，<Katex tex="I" /> 为<b>二重积分</b>，记作 <Katex tex="\iint_D f(x,y)\,d\sigma" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDblInt" />
      <div class="cap">图 重1 · <b>二重积分的定义</b>：矩形区域被分成 <Katex tex="n\times n" /> 个小块，越靠右上角的小块函数值越大、颜色越橙；右侧把和 <Katex tex="S_n" /> 随 <Katex tex="n" /> 的变化画成蓝点，绿色虚线是精确值。看点：<Katex tex="n" /> 从 2 推到 16，蓝点迅速贴到绿线上；每加细一次，误差大约是上一次的四分之一——分块细一倍，每块面积变成四分之一，误差也按这个速度缩小。</div>
    </div>

    <h3 class="sec" id="r1-def">分割、近似、求和、取极限</h3>
    <p>四步与一元定积分完全同构，只有「区间分割」换成了「区域分割」。写成极限就是</p>
    <p style="text-align:center"><Katex display tex="\iint_D f(x,y)\,d\sigma=\lim_{\lambda\to0}\sum_{i=1}^{n}f(\xi_i,\eta_i)\Delta\sigma_i," /></p>
    <p>其中 <Katex tex="\lambda" /> 是所有小块直径中的最大者。<b>与分法无关、与每块取点的位置无关</b>，只要极限存在，这个数就唯一确定，所以写作 <Katex tex="d\sigma" /> 而不写具体分法。</p>
    <p>可积的充分条件是 <Katex tex="f" /> 在 <Katex tex="D" /> 上连续（更一般地，有界且间断点落在有限条光滑曲线上）。连续函数在闭区域上连续，闭区域有界，所以教材里的题目基本都满足。</p>
    <p>画板用矩形区域与规则网格演示，是因为规则网格便于数格子；定义里的分法可以是任意的，画板只是选了一种好算的。</p>

    <h3 class="sec" id="r1-geo">几何意义</h3>
    <p>若 <Katex tex="f\ge0" />，每块 <Katex tex="f(\xi_i,\eta_i)\Delta\sigma_i" /> 是一根小柱体的体积：底面积 <Katex tex="\Delta\sigma_i" />、高 <Katex tex="f(\xi_i,\eta_i)" />。全部加起来就是曲面 <Katex tex="z=f(x,y)" /> 与区域 <Katex tex="D" /> 之间那个曲顶柱体的体积。</p>
    <p>若 <Katex tex="f" /> 有正有负，负的部分把体积按符号扣掉，积分读成带符号的体积。若 <Katex tex="f\equiv1" />，积分退化为区域的面积，这是用积分算面积的最简单情形。</p>
    <p>两种读法各有用处：体积的读法帮助建立直觉，加权和的读法便于迁移到质量、质心、转动惯量——下一章与重6 会反复用到。</p>

    <h3 class="sec" id="r1-prop">性质</h3>
    <ul>
      <li><strong>线性。</strong><Katex tex="\iint_D(\alpha f+\beta g)=\alpha\iint_D f+\beta\iint_D g" />。</li>
      <li><strong>区域可加。</strong>把 <Katex tex="D" /> 分成 <Katex tex="D_1" />、<Katex tex="D_2" /> 两块（公共边界不算面积），则积分等于两块之和。</li>
      <li><strong>保序。</strong>若在 <Katex tex="D" /> 上 <Katex tex="f\le g" />，则 <Katex tex="\iint_D f\le\iint_D g" />；由此得 <Katex tex="\left|\iint_D f\right|\le\iint_D|f|" />。</li>
      <li><strong>估值。</strong>若 <Katex tex="m\le f\le M" />，则 <Katex tex="m\,S\le\iint_D f\le M\,S" />，其中 <Katex tex="S" /> 是 <Katex tex="D" /> 的面积。</li>
      <li><strong>中值定理。</strong><Katex tex="f" /> 连续时存在 <Katex tex="(\xi,\eta)\in D" />，使 <Katex tex="\iint_D f=f(\xi,\eta)S" />。</li>
    </ul>
    <p>这几条与定积分一一对应。区域可加是后面「把区域拆开再积」的依据：极坐标下的圆环要拆、直角坐标下换积分次序时要重新定界，靠的都是这一条。</p>

    <h3 class="sec" id="r1-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把 <Katex tex="d\sigma" /> 写成 <Katex tex="dx\,dy" /> 就算了事。</strong>在直角坐标下它确实等于 <Katex tex="dx\,dy" />，换到极坐标是 <Katex tex="r\,dr\,d\theta" />，多出来的 <Katex tex="r" /> 不能丢。</li>
        <li><strong>提示二：积分区域与被积函数混为一谈。</strong>区域决定上下限，函数决定被积式；先把区域画清楚，再写限。</li>
        <li><strong>提示三：以为分法会影响结果。</strong>积分存在时结果与分法、取点都无关；只有当极限不存在时二者才有影响。</li>
        <li><strong>提示四：无界区域直接套定义。</strong>无界区域或函数无界时属于反常二重积分，要先截断再取极限。</li>
      </ul>
    </div>
    <p>回收与预告：定义只说「存在」，没说怎么算。实际的算法是把二重积分化成两次一元积分，这要求先把区域写成两组不等式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDblInt } from '../../../boards/calc2/riemann/dblint.js';
import { MR_CHAPTERS } from './rnav.js';
</script>
