<template>
  <ChPage :cur="8" no="V8" base="/functions/v" :chapters="V_CHAPTERS"
    title="积分初步：黎曼与基本定理" sub="黎曼和的极限定义定积分，微积分基本定理把累积面积的变化率与被积函数联系起来。"
    :toc="[{ id: 'v8-riemann', t: '黎曼和：以直代曲的加法' }, { id: 'v8-ftc', t: '微积分基本定理' }, { id: 'v8-pit', t: '常数 C 与方向' }]">
    <div class="note good" id="v8-law"><strong>牛顿–莱布尼茨公式</strong>：若 <Katex tex="F'=f" />，则 <Katex tex="\int_a^b f(x)\,\mathrm{d}x=F(b)-F(a)" /> —— 定积分 = 任一原函数在两端点的差。原函数不必唯一：<Katex tex="F(x)+C" /> 代入后常数互相抵消。<strong>面积定义式</strong>：<Katex tex="\int_a^b f=\lim_{n\to\infty}\sum_{i=1}^{n}f(x_i)\,\Delta x" />，<Katex tex="\Delta x=\dfrac{b-a}{n}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRie" />
      <div class="cap">图 V8 · <b>黎曼和逼近面积</b>。上图展示矩形和及探针左侧的累积面积，下图展示面积函数。移动探针，比较下图切线斜率与上图函数值。</div>
    </div>

    <h3 class="sec" id="v8-riemann">黎曼和：以直代曲的加法</h3>
    <p>把 [a,b] 等分成 n 段。每段选一个取样点，将 <Katex tex="f(x_i)\Delta x" /> 相加得到黎曼和。对递增的 x²，左端点和偏低、右端点和偏高。对非单调函数，需根据差值判断误差方向。</p>
    <p>分割加密时，连续函数的黎曼和收敛到定积分。横轴上方的面积记正，横轴下方记负。切换到 <Katex tex="f(x)=x-1" />，可观察正负贡献如何抵消。</p>

    <h3 class="sec" id="v8-ftc">微积分基本定理</h3>
    <p>若 f 连续，令 <Katex tex="F(x)=\int_a^x f(t)\,\mathrm{d}t" />。x 增加一小段 <Katex tex="\Delta x" /> 时，累积量的变化约为 <Katex tex="f(x)\Delta x" />。差商取极限得 <Katex tex="F'(x)=f(x)" />。两图的游标标出同一横坐标处的函数值和累积积分的切线斜率。</p>
    <p>找到一个原函数 G，就可以计算 <Katex tex="\int_a^b f=G(b)-G(a)" />。例如 <Katex tex="\int_0^1x^2\,\mathrm{d}x=[x^3/3]_0^1=1/3" />。原函数增加常数后，端点相减的结果保持不变。</p>

    <h3 class="sec" id="v8-pit">常数 C 与方向</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不定积分丢常数。</strong>f 的原函数是一整族 <Katex tex="F(x)+C" /> —— 用求导逆推时漏写 <Katex tex="+C"/>，等于把一族答案写成一个；好在定积分里常数自相抵消（<Katex tex="F(b)-F(a)"/> 同加同减），这也是「答案与 C 无关」的自检。</li>
        <li><strong>提示二：上下限反了忘变号。</strong><Katex tex="\int_a^b f=-\int_b^a f" />：黎曼和里 <Katex tex="\Delta x=(b-a)/n"/> 直接携带符号，方向反了矩形宽为负 —— 不是几何意义崩了，是记录方向换了。</li>
        <li><strong>提示三：f 在区间上有正有负时，「面积」要分段。</strong><Katex tex="\int"/> 把 x 轴下方的部分记为负值：先按 S2 的符号染色分段，各段分别积分再取绝对值才是几何面积 —— R 系列的「数零点定符号区」在此完成最后一次回收。</li>
      </ul>
    </div>
    <p>继续学习可阅读<router-link to="/calc1/f1">定积分的定义</router-link>与<router-link to="/calc1/f2">微积分基本定理</router-link>。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRie } from '../../../boards/functions/calculus/riemann.js';
import { V_CHAPTERS } from './vnav.js';
</script>
