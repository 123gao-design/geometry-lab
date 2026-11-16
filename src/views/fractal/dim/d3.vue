<template>
  <ChPage :cur="3" no="维3" base="/fractal/d" :chapters="FS_CHAPTERS"
    title="盒维数"
    sub="拿边长 ε 的方格网去盖集合，数与它相交的格子数 N(ε)。ε 越小格子数涨得越快，ln N(ε) 与 ln(1/ε) 的比值极限就是盒维数——不必先知道集合怎么自相似。"
    :toc="[{ id: 'd3-def', t: '数格子定维数' }, { id: 'd3-count', t: '三个例子的计数' }, { id: 'd3-haus', t: '与豪斯多夫维数的关系' }, { id: 'd3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="N(\varepsilon)" /> 为覆盖集合 <Katex tex="K" /> 所需的边长 <Katex tex="\varepsilon" /> 的方格最少个数（等价地，与 <Katex tex="K" /> 相交的格子数）。定义 <Katex display tex="\underline{\dim}_B K=\liminf_{\varepsilon\to0}\frac{\ln N(\varepsilon)}{\ln(1/\varepsilon)},\qquad \overline{\dim}_B K=\limsup_{\varepsilon\to0}\frac{\ln N(\varepsilon)}{\ln(1/\varepsilon)}." /> 两者相等时称共同值为<b>盒维数</b> <Katex tex="\dim_B K" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createBoxDim" />
      <div class="cap">图 维3 · <b>盒维数机</b>：方格网逐层变细，蓝色是盖住集合的格子。看点：① 康托集每细一层，相交格数恰好翻倍；② 科赫曲线每细一层，格数约乘 4；③ 谢尔宾斯基三角每细一层，格数乘 3——三个乘数分别对应 ln2/ln3、ln4/ln3、ln3/ln2。</div>
    </div>

    <h3 class="sec" id="d3-def">数格子定维数</h3>
    <p>把平面划成边长 <Katex tex="\varepsilon" /> 的方格，数出与 <Katex tex="K" /> 相交的格子数 <Katex tex="N(\varepsilon)" />。若集合是普通曲线，<Katex tex="N(\varepsilon)" /> 大约按 <Katex tex="1/\varepsilon" /> 增长；若是平面区域，按 <Katex tex="1/\varepsilon^2" /> 增长。指数就是维数：</p>
    <p style="text-align:center"><Katex display tex="N(\varepsilon)\approx c\,\varepsilon^{-D}\quad\Longleftrightarrow\quad D\approx\frac{\ln N(\varepsilon)}{\ln(1/\varepsilon)}." /></p>
    <p>取极限就得到定义。极限可能不存在，于是分上盒维与下盒维；大多数常见分形两者相等，笼统说「盒维数」即可。</p>
    <p>盒维数只用到「用多大的格子能盖住」，不要求集合自相似，也不要求它有严格的乘积结构。这是它比相似维数好用的地方：手头只有一个图形或一张图像，也能按格子数估维数。</p>

    <h3 class="sec" id="d3-count">三个例子的计数</h3>
    <p><b>三分康托集</b>：用边长 <Katex tex="3^{-k}" /> 的格子。第 <Katex tex="k" /> 层剩下 <Katex tex="2^k" /> 段，每段恰好占一格，所以 <Katex tex="N(3^{-k})=2^k" />，</p>
    <p style="text-align:center"><Katex display tex="D=\frac{\ln 2^k}{\ln 3^k}=\frac{\ln2}{\ln3}\approx0.631." /></p>
    <p><b>谢尔宾斯基三角</b>：用边长 <Katex tex="2^{-k}" /> 的格子，第 <Katex tex="k" /> 层有 <Katex tex="3^k" /> 个小三角，各占一格，<Katex tex="D=\ln3/\ln2\approx1.585" />。</p>
    <p><b>科赫曲线</b>：用 <Katex tex="3^{-k}" /> 的格子，相交格数与 <Katex tex="4^k" /> 同阶，<Katex tex="D=\ln4/\ln3\approx1.262" />。曲线斜着穿过格子，格数不会精确等于 <Katex tex="4^k" />，但比值仍收敛到同一个数。</p>
    <p>三个例子与相似维数公式算出的结果一致。这不是巧合：满足开集条件的自相似集，盒维数等于相似维数。盒维数提供了另一条独立的路，可以互相验算。</p>

    <h3 class="sec" id="d3-haus">与豪斯多夫维数的关系</h3>
    <p>盒维数总不小于豪斯多夫维数：<Katex tex="\dim_H K\le\underline{\dim}_B K\le\overline{\dim}_B K" />。对自相似集两者相等，所以前面的计算没有歧义。</p>
    <p>但盒维数有两个毛病。其一，它不满足可数稳定性：可数个盒维为 0 的集合并起来，盒维可能不为 0。其二，它对稠密集合过于敏感：<Katex tex="[0,1]" /> 中的有理数集是可数集，豪斯多夫维为 0，盒维却是 1——因为任何格子都碰到有理点。</p>
    <p>所以在测度论里，豪斯多夫维数是更基本的量；盒维数胜在好算、好估计。图像分析、材料断口测量里用的「盒计数法」，量的正是这个数。</p>

    <h3 class="sec" id="d3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：格子要越来越小。</strong>盒维数是 <Katex tex="\varepsilon\to0" /> 的极限。只在两三个尺度上量一量，得到的斜率受格子与图形的相对位置影响，误差可以很大。</li>
        <li><strong>提示二：相交格数不等于覆盖格数。</strong>两者只差常数倍，取对数后不影响极限。算哪个方便用哪个，别在常数上纠结。</li>
        <li><strong>提示三：盒维可能大于相似维。</strong>副本重叠严重、或集合在某个尺度上特别稠密时，盒维会偏高。两者相等需要开集条件这类前提。</li>
        <li><strong>提示四：可数集的盒维可以不是 0。</strong>有理数在 <Katex tex="[0,1]" /> 中稠密，盒维为 1。盒维衡量的是「分布有多满」，不是「点有多少」。</li>
      </ul>
    </div>
    <p>回收与预告：维数的三套算法已经齐了——相似维数靠副本结构，盒维数靠数格子，豪斯多夫维数靠测度。接下来换到具体图形：先看最经典的三分康托集，它把「长度为零、点却不少」演到极致。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBoxDim } from '../../../boards/fractal/dim/boxdim.js';
import { FS_CHAPTERS } from './fsnav.js';
</script>
