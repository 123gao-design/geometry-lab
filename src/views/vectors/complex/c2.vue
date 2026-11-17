<template>
  <ChPage :cur="2" no="复2" base="/vectors/c" :chapters="VC_CHAPTERS"
    title="复数的四则运算"
    sub="复数的加减逐分量进行，与向量加法同一套；乘法按分配律展开再合并同类项，遇到 i² 换成 −1；除法先乘分母的共轭，把分母化成实数再分项。运算规则只有这几条，几何意义却各不相同：加法是平移叠加，乘法是旋转与伸缩。"
    :toc="[{ id: 'c2-add', t: '加减与乘法' }, { id: 'c2-geo', t: '乘除的几何意义' }, { id: 'c2-divo', t: '除法与分母实数化' }, { id: 'c2-pit', t: 'i²、共轭与分母' }]">
    <div class="note good">设 <Katex tex="z_1=a+b\mathrm{i}" />，<Katex tex="z_2=c+d\mathrm{i}" />（<Katex tex="a,b,c,d\in\mathbb{R}" />）。加减与乘法都只用到分配律、交换律与 <Katex tex="\mathrm{i}^2=-1" />；除法多一步，把分子分母同乘分母的共轭。四则运算的结果仍是复数，实部与虚部分开写在两段里。</div>
    <div class="board-wrap">
      <BoardMount :factory="createComplexOps" />
      <div class="cap">图 复2 · <b>复数的运算</b>：蓝色 <Katex tex="z_1" />、橙色 <Katex tex="z_2" /> 两支固定为输入，金色一支是运算结果。看点：加法档把两支按平行四边形合成，虚线补出另外两条边；乘法档换成 ②，<Katex tex="z_2=\mathrm{i}" />，金色结果正好是蓝色箭头逆时针转过 90°、长度不变；③ 取一对共轭复数相乘，积落回实轴。除法档 ④ 的商为 <Katex tex="\mathrm{i}" />，虚轴上的金点就是答案。</div>
    </div>

    <h3 class="sec" id="c2-add">加减与乘法</h3>
    <p>加减法逐分量做：</p>
    <p style="text-align:center"><Katex tex="z_1\pm z_2=(a\pm c)+(b\pm d)\mathrm{i}." /></p>
    <p>实部与实部相加减、虚部与虚部相加减，两项各自合并。这一步与向量坐标加减的形式完全相同，因为复平面上的点和向量是同一回事。</p>
    <p>乘法按多项式展开，再把 <Katex tex="\mathrm{i}^2" /> 换成 <Katex tex="-1" />：</p>
    <p style="text-align:center"><Katex tex="z_1z_2=(a+b\mathrm{i})(c+d\mathrm{i})=ac+ad\mathrm{i}+bc\mathrm{i}+bd\,\mathrm{i}^2=(ac-bd)+(ad+bc)\mathrm{i}." /></p>
    <p>展开时把 <Katex tex="\mathrm{i}" /> 当作字母，只在最后一步做替换。「实部乘实部减虚部乘虚部、交叉项相加」这条口诀就是上式的读法，不必单背。</p>

    <h3 class="sec" id="c2-geo">乘除的几何意义</h3>
    <p>乘法在复平面上是<strong>旋转加伸缩</strong>。若 <Katex tex="z_1" /> 的模为 <Katex tex="r_1" />、辐角为 <Katex tex="\theta_1" />，<Katex tex="z_2" /> 的模为 <Katex tex="r_2" />、辐角为 <Katex tex="\theta_2" />，则乘积的模是 <Katex tex="r_1r_2" />、辐角是 <Katex tex="\theta_1+\theta_2" />，即</p>
    <p style="text-align:center"><Katex tex="|z_1z_2|=|z_1||z_2|,\qquad \arg(z_1z_2)=\arg z_1+\arg z_2." /></p>
    <p>图 复2 的 ② 档最能说明这一点：乘 <Katex tex="\mathrm{i}" /> 的模为 1、辐角为 <Katex tex="90^\circ" />，于是任何复数乘 <Katex tex="\mathrm{i}" /> 都只是逆时针转九十度。除法是乘法的逆运算，模相除、辐角相减，图上就是把 <Katex tex="z_1" /> 按 <Katex tex="z_2" /> 的模反向伸缩、再转回去。</p>

    <h3 class="sec" id="c2-divo">除法与分母实数化</h3>
    <p>除法要把分母从复数变成实数，办法是分子分母同乘分母的共轭：</p>
    <p style="text-align:center"><Katex tex="\frac{z_1}{z_2}=\frac{(a+b\mathrm{i})(c-d\mathrm{i})}{(c+d\mathrm{i})(c-d\mathrm{i})}=\frac{(ac+bd)+(bc-ad)\mathrm{i}}{c^2+d^2}." /></p>
    <p>分母 <Katex tex="(c+d\mathrm{i})(c-d\mathrm{i})=c^2+d^2" /> 是一个正实数（除非 <Katex tex="z_2=0" />），于是实部与虚部可以各自除以它，商写成标准形式。图 复2 的 ④ 档算出的商正好是 <Katex tex="\mathrm{i}" />，可以按上式逐项核对一遍。</p>

    <h3 class="sec" id="c2-pit">i²、共轭与分母</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\mathrm{i}^2=-1" /> 要替换到底。</strong>展开后剩下的 <Katex tex="\mathrm{i}^2" /> 项必须换成 <Katex tex="-1" /> 并并入实部，不能留在答案里。答案里只允许出现 <Katex tex="a+b\mathrm{i}" /> 这种形式，出现 <Katex tex="\mathrm{i}^2" />、<Katex tex="\mathrm{i}^3" /> 都算没有化到最简。</li>
        <li><strong>提示二：除法的共轭只乘分母的共轭，分子同步乘。</strong>分子漏乘是最常见的错。写成两步更稳：先把 <Katex tex="\dfrac{z_1}{z_2}" /> 改写成 <Katex tex="\dfrac{z_1\bar z_2}{z_2\bar z_2}" />，再分别算分子与分母。</li>
        <li><strong>提示三：复数的乘法不是向量数量积。</strong>数量积是一个数，复数乘法仍是复数，两者式子完全不同。向量里点积为零判垂直，复数里乘积为实数另有含义（虚部为零），不要混用。</li>
        <li><strong>提示四：分母实数化之后别忘了除。</strong><Katex tex="\dfrac{(ac+bd)+(bc-ad)\mathrm{i}}{c^2+d^2}" /> 的实部是 <Katex tex="\dfrac{ac+bd}{c^2+d^2}" />，不是 <Katex tex="ac+bd" />。分母是正实数，实虚两部分都要除以它。</li>
      </ul>
    </div>
    <p>回收与预告：复1 把复数安到复平面上，这一页让它在平面上动起来。复3 收拢模与共轭的性质：乘积的模等于模的乘积、<Katex tex="z\bar z=|z|^2" />、共轭对加减乘除都保持运算，这几条在化简与求模时反复出现。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createComplexOps } from '../../../boards/vectors/complex/complexops.js';
import { VC_CHAPTERS } from './vcnav.js';
</script>
