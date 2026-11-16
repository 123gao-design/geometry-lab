<template>
  <ChPage :cur="5" no="定5" base="/calc1/f" :chapters="DF_CHAPTERS"
    title="定积分的应用"
    sub="把待求的量切成小片，写出每一小片的近似，再积分累加 —— 面积、体积、弧长、侧面积都走这一条路。"
    :toc="[{ id: 'f5-area', t: '平面图形的面积' }, { id: 'f5-vol', t: '旋转体的体积' }, { id: 'f5-arc', t: '弧长与侧面积' }, { id: 'f5-elem', t: '微元法' }]">

    <div class="note good" id="f5-area">应用的题都长一个样：先找自变量与它的范围，再写出「宽 <Katex tex="\mathrm{d}x" /> 的一小条有多大」，最后积分。这一小条叫微元，写对微元，题就做完了。</div>

    <div class="board-wrap">
      <BoardMount :factory="createAreaApp" />
      <div class="cap">图 定5 · <b>定积分的应用机</b>：模式一画两条曲线之间的一块，积分是「上减下」；模式二把 <Katex tex="y=\sqrt{x}" /> 绕 <Katex tex="x" /> 轴转，在若干 <Katex tex="x" /> 处切出圆盘，每片体积 <Katex tex="\pi f^2\mathrm{d}x" />。看点：拖右界 <Katex tex="b" />，面积与体积两栏都跟着长，且长的速度正是被积函数。</div>
    </div>

    <h3 class="sec" id="f5-area">平面图形的面积</h3>
    <p>两条曲线 <Katex tex="y=f(x)" />（上）与 <Katex tex="y=g(x)" />（下）围出的面积，按竖条切分，每一竖条高 <Katex tex="f(x)-g(x)" />、宽 <Katex tex="\mathrm{d}x" />：</p>
    <p style="text-align:center"><Katex display tex="S=\int_a^b\left[f(x)-g(x)\right]\mathrm{d}x" /></p>
    <p>两线有交点时，先把交点求出来分段，免得「上」「下」的角色在某段里对调。图 定5 的模式一取 <Katex tex="y=2-x" /> 与 <Katex tex="y=x^2" />，右界拖到交点 <Katex tex="(1,1)" /> 处，绿色区域正好合拢。</p>
    <p>以 <Katex tex="y" /> 为自变量时，横条切分同样有效：<Katex tex="S=\int_c^d[x_{\text{右}}-x_{\text{左}}]\mathrm{d}y" />。抛物线、摆线这类横向更简单的图形，换成 <Katex tex="y" /> 作积分变量往往省一半力气。</p>

    <h3 class="sec" id="f5-vol">旋转体的体积</h3>
    <p>把曲边梯形绕 <Katex tex="x" /> 轴转一圈，每一竖条扫出一片薄圆盘，半径 <Katex tex="f(x)" />、厚 <Katex tex="\mathrm{d}x" />，体积 <Katex tex="\pi f^2\mathrm{d}x" />。累加得</p>
    <p style="text-align:center"><Katex display tex="V_x=\pi\int_a^b f^2(x)\,\mathrm{d}x" /></p>
    <p>绕 <Katex tex="y" /> 轴转时，竖条扫出的是薄圆柱壳：半径 <Katex tex="x" />、周长 <Katex tex="2\pi x" />、高 <Katex tex="f(x)" />，于是 <Katex tex="V_y=2\pi\int_a^b xf(x)\mathrm{d}x" />。圆盘法与柱壳法没有本质差别，选哪个只看切片方向与旋转轴的关系。</p>
    <p>两曲线之间的区域旋转时，圆盘中间有洞，用大半径平方减小半径平方：<Katex tex="V=\pi\int\left[f^2-g^2\right]\mathrm{d}x" />。图 定5 的模式二给出的是最简单的圆盘，右栏体积与 <Katex tex="\pi b^2/2" /> 实时对上。</p>

    <h3 class="sec" id="f5-arc">弧长与侧面积</h3>
    <p>曲线上取一小段，横向跨 <Katex tex="\mathrm{d}x" />、纵向跨 <Katex tex="f'\mathrm{d}x" />，弦长按勾股定理是</p>
    <p style="text-align:center"><Katex display tex="L=\int_a^b\sqrt{1+f'^2(x)}\,\mathrm{d}x" /></p>
    <p>参数方程 <Katex tex="x=x(t),y=y(t)" /> 给出 <Katex tex="L=\int\sqrt{x'^2+y'^2}\,\mathrm{d}t" />，极坐标给出 <Katex tex="L=\int\sqrt{\rho^2+\rho'^2}\,\mathrm{d}\theta" />。三种写法其实是同一句话在不同坐标下的样子。</p>
    <p>让这条曲线绕 <Katex tex="x" /> 轴转，那一小段扫出的侧面积是 <Katex tex="2\pi f(x)\sqrt{1+f'^2}\mathrm{d}x" />，累加即得侧面积公式。注意根号不能省：侧面积对弧长加权，而弧长并不等于 <Katex tex="\mathrm{d}x" />。</p>

    <h3 class="sec" id="f5-elem">微元法</h3>
    <p>四类应用的共同结构是微元法：选好自变量并确定范围；在范围内取一小段 <Katex tex="[x,x+\mathrm{d}x]" />；写出这一小段上所求量的近似 <Katex tex="\mathrm{d}Q" />，它必须是 <Katex tex="\mathrm{d}x" /> 的线性项，丢掉的高阶小量不影响积分；最后把 <Katex tex="\mathrm{d}Q" /> 从 <Katex tex="a" /> 积到 <Katex tex="b" />。</p>
    <p>写出微元的诀窍是把小块画出来，用已知的平面或立体公式算它。写成「近似」时可以忽略 <Katex tex="\mathrm{d}x^2" /> 量级，但主导项一次也不能少——弧长里的根号、圆盘里的平方，都是主导项。</p>
    <p>图 定5 的两档正好各演示一种切法：面积按竖条切，旋转体按圆盘切。换一个切法，微元随之改写，积分结果不变。挑切法的标准只有一条：让每一小块的面积或体积有现成公式可套。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：先画图，再定上下界。</strong>哪条在上、哪条在下，交点在哪里不会被漏，图上一看就清楚。</li>
        <li><strong>提示二：旋转体里半径是 <Katex tex="f(x)" />，体积元是 <Katex tex="\pi f^2" />。</strong>漏掉平方或漏掉 π，是最常见的两处笔误。</li>
        <li><strong>提示三：侧面积要乘根号。</strong>把曲线拉长了的因子 <Katex tex="\sqrt{1+f'^2}" /> 不能省，它与面积公式的差别就在这里。</li>
        <li><strong>提示四：微元只保留线性项。</strong>高次小量积分后仍然是高阶小量，写进去徒增计算；但主导项一个都不能漏。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAreaApp } from '../../../boards/calc1/definite/areaapp.js';
import { DF_CHAPTERS } from './fnav.js';
</script>
