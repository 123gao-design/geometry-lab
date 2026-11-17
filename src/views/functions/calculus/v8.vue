<template>
  <ChPage :cur="8" no="V8" base="/functions/v" :chapters="V_CHAPTERS"
    title="积分初步：黎曼与基本定理" sub="把「求导」反过来的运算：曲边面积先切成矩形累加，再让份数 n 趋于无穷 —— 黎曼和的极限是定积分；而微积分基本定理说这个极限不必直接计算，找一个 F 让 $F'=f$ 即可。"
    :toc="[{ id: 'v8-riemann', t: '黎曼和：以直代曲的加法' }, { id: 'v8-ftc', t: '微积分基本定理' }, { id: 'v8-pit', t: '常数 C 与方向' }]">
    <div class="note good" id="v8-law"><strong>牛顿–莱布尼茨公式</strong>：若 <Katex tex="F'=f" />，则 <Katex tex="\int_a^b f(x)\,\mathrm{d}x=F(b)-F(a)" /> —— 定积分 = 任一原函数在两端点的差。原函数不必唯一：<Katex tex="F(x)+C" /> 代入后常数互相抵消。<strong>面积定义式</strong>：<Katex tex="\int_a^b f=\lim_{n\to\infty}\sum_{i=1}^{n}f(x_i)\,\Delta x" />，<Katex tex="\Delta x=\dfrac{b-a}{n}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRie" />
      <div class="cap">图 V8 · <b>黎曼和逼近面积</b>：上栏蓝色矩形条逐段累加逼近曲边面积（右端点采样偏高、左端点偏低），下栏绿色面积曲线 F 同步生长 —— 探针处的切线斜率恰好等于上栏当前高度。n 加倍误差约减半，「和滑向面积」直接可验。</div>
    </div>

    <h3 class="sec" id="v8-riemann">黎曼和：以直代曲的加法</h3>
    <p>「抛物线下的曲边梯形面积」—— 初等几何的求积公式在这里全部失效。黎曼的办法分两步：<strong>先切再取极限</strong>。把 [a,b] 均分 n 份，每份宽 <Katex tex="\Delta x=(b-a)/n"/>；每小段上用矩形代替曲边（采样点取左端点或右端点），n 个矩形面积相加就是黎曼和 <Katex tex="S_n=\sum_{i=1}^{n}f(x_i)\,\Delta x" />。图 V8 上栏把它做成对照表：以 <Katex tex="f=x^2"/>、[0,2.2] 为例，<Katex tex="n=6"/> 右端点和 4.99 比精确值 3.55 偏高 40.6% —— 单增函数右端点采样把矩形顶抬过了曲线，切到「左端点」立刻翻成偏低，一高一低正好把精确值夹在中间。V7 刚算过的 [0,1] 是最干净的一档：右端点和恰是 <Katex tex="1/3+1/(2n)+1/(6n^2)"/>，金边就是那两项离散化误差。</p>
    <p>关键的第三步是 <strong>n→∞</strong>：图 V8 的 n 滑到 48，误差跌进 2% 以内 —— 每加倍一次，Δx 减半，台阶与曲线之间的缝隙按 Δx 速度收拢。这正是 V2 红角结论的延伸：<strong>「以直代曲」的误差是高阶小量，累加后在极限中消去</strong>。极限存在时，我们就把这个数定义为定积分 —— 它不是「近似面积的极限」，它<strong>就是</strong>面积（按定义）。</p>

    <h3 class="sec" id="v8-ftc">微积分基本定理</h3>
    <p>黎曼和逐个计算太慢：每个 n 都要重算一遍和式。图 V8 下栏给出一条更直接的路径：让上限动起来，定义 <Katex tex="F(x)=\int_a^x f(t)\,\mathrm{d}t" /> —— 「从 a 累到 x」的面积曲线。探针拖到任意 x，F 在那里的切线斜率恰好等于 f(x)：因为 x 再推进一点点 Δx，面积恰好多出 ≈f(x)·Δx（一个窄矩形），Δx→0 后比值严格趋于 f(x) —— <Katex tex="F'=f" />。<strong>求面积的增长率，等于读回原函数的高度</strong>：积分与微分互为逆运算。</p>
    <p>于是定积分有了直接的计算途径：只要找到一个 F 使 <Katex tex="F'=f"/>（<Katex tex="x^2"/> 的原函数是 <Katex tex="x^3/3"/>、<Katex tex="\sin x"/> 的是 <Katex tex="1-\cos x"/>），立刻 <Katex tex="\int_a^b f=F(b)-F(a)" />，不必再碰黎曼和 —— V7 猜出的 <Katex tex="\int_0^1x^\alpha=1/(\alpha+1)"/> 在这里得到严格证明（原函数 <Katex tex="x^{\alpha+1}/(\alpha+1)"/> 代 1 减代 0）。图 V8 的三个例子全部验证一致：<Katex tex="x^2"/> 得 3.55、<Katex tex="\sin x"/> 在 [0,π] 得 2.00、<Katex tex="\sqrt{x}" /> 得 2.43 —— 与 <Katex tex="n=48"/> 的矩形和只差最后一点逼近误差。微分学的整套机器（V1–V5）就此成为积分学的工具：找原函数 = 解一道求导的逆题。</p>

    <h3 class="sec" id="v8-pit">常数 C 与方向</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不定积分丢常数。</strong>f 的原函数是一整族 <Katex tex="F(x)+C" /> —— 用求导逆推时漏写 <Katex tex="+C"/>，等于把一族答案写成一个；好在定积分里常数自相抵消（<Katex tex="F(b)-F(a)"/> 同加同减），这也是「答案与 C 无关」的自检。</li>
        <li><strong>提示二：上下限反了忘变号。</strong><Katex tex="\int_a^b f=-\int_b^a f" />：黎曼和里 <Katex tex="\Delta x=(b-a)/n"/> 直接携带符号，方向反了矩形宽为负 —— 不是几何意义崩了，是记录方向换了。</li>
        <li><strong>提示三：f 在区间上有正有负时，「面积」要分段。</strong><Katex tex="\int"/> 把 x 轴下方的部分记为负值：先按 S2 的符号染色分段，各段分别积分再取绝对值才是几何面积 —— R 系列的「数零点定符号区」在此完成最后一次回收。</li>
      </ul>
    </div>
    <p>高中阶段到此为「拓展下放」：定积分的严格定义（黎曼和的 <Katex tex="\varepsilon\text{-}\delta"/> 语言）与换元法、分部积分是大学微积分的正课，但「以直代曲 + 取极限」的骨架、<Katex tex="F'=f"/> 的互逆关系，在这块板上已经完整走了一遍 —— 从 V1 的割线极限、V7 的缩比极限，到本讲的和式极限收尾，微积分的两扇门在同一个「极限」上开合。函数与微积分初步模块八章到此完结，全站速查页把 35 章的定理收进一张总表。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRie } from '../../../boards/functions/calculus/riemann.js';
import { V_CHAPTERS } from './vnav.js';
</script>
