<template>
  <ChPage :cur="5" no="E5" base="/functions/e" :chapters="E_CHAPTERS"
    title="对数函数：增速递减" sub="a＞1 时，对数函数递增且增速减小。0＜a＜1 时，函数递减并逐渐变平。"
    :toc="[{ id: 'e5-def', t: '定义与五条性质（图 E5）' }, { id: 'e5-slow', t: '慢的定量：f′ 递减与「慢过一切幂」' }, { id: 'e5-ops', t: '运算律与换底公式' }]">
    <div class="note good" id="e5-def"><strong>对数函数</strong>：<Katex tex="y=\log_a x\ (a&gt;0,\ a\ne 1)" />，当 <Katex tex="a^y=x" /> 时称 y 为「以 a 为底 x 的对数」。性质五条（与指数函数的五条性质整列互换）：定义域 <Katex tex="(0,+\infty)" />、值域 <Katex tex="\mathbb{R}" />、恒过 (1,0)、a&gt;1 时递增 / 0&lt;a&lt;1 时递减、y 轴（x=0）是竖直渐近线。<strong>真数必须为正</strong> —— 零和负数取不了对数，这是定义域的首要限制。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSlow" />
      <div class="cap">图 E5 · <b>对数函数</b>。实线随底数滑块变化，虚线用于对照。先把探针放在 <Katex tex="x=2" />，比较 <Katex tex="\log_2 x" /> 与 <Katex tex="\ln x" /> 的高低；再移到 <Katex tex="x=1/2" />，观察次序如何反转。切换到倒数底，还可以看到 <Katex tex="\log_{1/2} x=-\log_2 x" /> 的两条曲线关于横轴对称。</div>
    </div>

    <h3 class="sec" id="e5-slow">慢的定量：f′ 递减与「慢过一切幂」</h3>
    <p>导数为 <Katex tex="f'(x)=1/(x\ln a)" />。若 <Katex tex="a>1" />，导数为正且逐渐减小，函数值仍可增长到任意大。对任意 <Katex tex="\alpha>0" />，比值 <Katex tex="\ln x/x^\alpha" /> 在 x 趋于正无穷时趋于零。</p>
    <p>当 <Katex tex="0<a<1" /> 时，导数为负并向 0 增大，函数值本身趋于负无穷。两种底数对应的曲线都以 <Katex tex="x=0" /> 为竖直渐近线。</p>

    <h3 class="sec" id="e5-ops">运算律与换底公式</h3>
    <p>对数把乘法降维成加法：<Katex tex="\log_a(MN)=\log_a M+\log_a N" />、<Katex tex="\log_a\dfrac{M}{N}=\log_a M-\log_a N" />、<Katex tex="\log_a M^n=n\log_a M" />（M,N&gt;0）—— 它们是指数律 <Katex tex="a^{s+t}=a^s a^t" /> 的逆运算（E6 将把这台「互逆机器」画成镜面）。换底公式 <Katex tex="\log_b c=\dfrac{\log_a c}{\log_a b}" /> 让不同底的对数互相换算；特别地 <Katex tex="\lg N=\dfrac{\ln N}{\ln 10}" />。指对恒等式 <Katex tex="a^{\log_a x}=x" />（x&gt;0）是「先正运算再逆运算，回到原地」的代数表述。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：真数必须 <Katex tex="&gt;0" />。</strong><Katex tex="\log_a x" /> 在 <Katex tex="x\le 0" /> 处无定义 —— C3 的分母限制、R1 的 <Katex tex="1/x" /> 先例，在对数函数上复发。</li>
        <li><strong>提示二：底数要求 <Katex tex="0<a" /> 且 <Katex tex="a\ne 1" />。</strong>因为 <Katex tex="1^y=1" />，真数等于 1 时指数无法唯一确定，其他真数则没有对应的实数指数。</li>
        <li><strong>提示三：把运算律当分配律。</strong><Katex tex="\log_a(M+N)\ne\log_a M+\log_a N" /> —— 对数管乘除不管加减；<Katex tex="\log_a x^2" /> 是 <Katex tex="2\log_a|x|" />（真数展开要带绝对值），写成 <Katex tex="2\log_a x" /> 会凭空丢掉 <Katex tex="x&lt;0" /> 的解。</li>
      </ul>
    </div>
    <p>回收与预告：E4 的五条性质与本章逐项互换 —— E6 的反演镜会揭示这不是巧合而是「定义域值域对调」的必然；C3 定义域限制、S2 的导数判据（f′ 递减却恒正，增速递减）继续适用。V 系列里 ln 将成为变化率的通用语言（f′=ln a·a^x 的 ln a、对数导数公式 1/x 都在那时出现）。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSlow } from '../../../boards/functions/elementary/logslow.js';
import { E_CHAPTERS } from './enav.js';
</script>

<style src="../properties/preset-row.css"></style>
