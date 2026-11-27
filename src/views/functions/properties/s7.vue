<template>
  <ChPage :cur="7" no="S7" base="/functions/s" :chapters="S_CHAPTERS"
    title="性质综合阅读：四项检验" sub="综合判断函数性质，并从内层与外层的增减判断复合函数的单调性。"
    :toc="[{ id: 's7-flow', t: '检验流程：全局 → 局部 → 界（图 S7）' }, { id: 's7-composition', t: '复合函数的单调性（图 S7b）' }, { id: 's7-net', t: '关系网：性质互相推出' }, { id: 's7-use', t: '大题里的用法' }]">
    <div class="note good" id="s7-flow">拿到陌生函数，按固定次序检验：<strong>① 全局折叠</strong> —— 先查对称（奇偶式、对称式）与周期（平移式），一旦成立，讨论范围立即缩成「一半」或「一个基本段」；<strong>② 局部读段</strong> —— 在剩下的范围里用 <Katex tex="f'" /> 符号（S2）读出单调区间与临界点；<strong>③ 界墙定界</strong> —— 单调读出值域走向后，用确界与最值（S4）确定上下。次序不能反：先用全局性质缩小范围，局部讨论才最省力。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCheckup" />
      <div class="cap">图 S7 · <b>函数的性质</b>。绿段递增，红段递减，金色光点标出增减方向改变的位置。打开「周期平移」后拖动滑块，观察紫色曲线何时与原图重合。</div>
    </div>

    <h3 class="sec" id="s7-composition">复合函数的单调性</h3>
    <p>设 <Katex tex="h(x)=f(g(x))" />。先选输入区间 <Katex tex="I" />，确认内层函数在整个 <Katex tex="I" /> 上有定义。再找出内层的取值范围 <Katex tex="g(I)" />，确认它包含在外层函数的某个单调区间 <Katex tex="J" /> 内。</p>
    <p><strong>从定义判断。</strong>任取 <Katex tex="x_1,x_2\in I" /> 且 <Katex tex="x_1&lt;x_2" />，令 <Katex tex="u_1=g(x_1),\ u_2=g(x_2)" />。内层递增时 <Katex tex="u_1&lt;u_2" />，内层递减时 <Katex tex="u_1&gt;u_2" />。外层递增会保持这一次序，外层递减会反转它。例如两层都严格递减时，内层给出 <Katex tex="u_2&lt;u_1" />，代入外层得 <Katex tex="f(u_2)&gt;f(u_1)" />，即 <Katex tex="h(x_1)&lt;h(x_2)" />。这对任意一对这样的输入都成立，正是严格递增的定义。</p>
    <p>因此，在上述区间条件下，<strong>两层同增或同减，复合函数严格递增；一增一减，复合函数严格递减。</strong>这里的增减均指严格单调。</p>
    <div class="board-wrap">
      <BoardMount :factory="createComposition" />
      <div class="cap">图 S7b · <b>两次比较决定复合函数的方向</b>。蓝色虚线是内层函数，橙色实线是复合函数。滑动两个输入，在图下按顺序比较输入、内层输出和外层输出。切到「内减 · 外减」，观察大小关系如何反转两次。</div>
    </div>
    <p><strong>什么时候需要分段？</strong>取 <Katex tex="g(x)=2x+1" /> 和 <Katex tex="f(u)=u^2" />。若输入遍及实数，内层取值会跨过外层的转折点 <Katex tex="u=0" />。解 <Katex tex="2x+1=0" /> 得分界点 <Katex tex="x=-1/2" />。左侧内增外减，右侧内增外增，因此 <Katex tex="(2x+1)^2" /> 在 <Katex tex="(-\infty,-1/2]" /> 上严格递减，在 <Katex tex="[-1/2,+\infty)" /> 上严格递增。</p>

    <h3 class="sec" id="s7-net">关系网：性质互相推出</h3>
    <p>几条最常用的「互相推出的结论」：<strong>奇函数在对称区间上单调性一致</strong>——<Katex tex="f" /> 奇且在 <Katex tex="[0,a]" /> 增，则在 <Katex tex="[-a,a]" /> 增（图 S7 ① 开镜像验收后，两侧单调同构）；<strong>偶函数恰相反</strong>——对称区间增减相反（S1 ① 的等高回折）；<strong>连续周期函数必有界</strong>——基本段是闭的就有最值（③ 的检验结果，对照 ① 的无界：周期与有界互不蕴含，但「周期+连续」保证有界）；<strong>奇函数若有上界必有下界</strong>（S3 结尾提出的问题在这里解决：上界 M 给出下界 <Katex tex="-M" />，反过来同理）；<strong>对称轴推周期</strong>需要两条轴（S6 定理一），一条轴只给出对称。</p>
    <p>这些条款的证明全是「一句话翻译」：奇 + 上界 <Katex tex="f(x)\le M" /> 平移到 <Katex tex="-f(-x)\le M" /> 再换字母 —— 翻折后上界变下界。性质证明的母法与 S1 一致：<strong>定义式 + 代入</strong>，其余都是它的方言。</p>

    <h3 class="sec" id="s7-use">大题里的用法</h3>
    <p>压轴题里函数性质的解题流程是「先验后算」：<strong>第一步永远先验对称与周期</strong>——把 <Katex tex="x" /> 换成 <Katex tex="-x" /> 看式子（奇偶），把 <Katex tex="x" /> 换成 <Katex tex="x+T" /> 看是否复原（周期）；<strong>验证后就缩小讨论范围</strong>——奇偶减一半、周期缩成一个基本段，然后才在剩余区间里求导、比大小、定最值。最值报告要带取等点（S4 的口径）：「最大值 1，在 <Katex tex="x=0" /> 取到」而不是「<Katex tex="\le 1" />」；区间端点开闭决定界能不能取到（S4 ② 的差一点）。图 S7 的四张判定表就是这套流程的模板 —— 三个例子把「奇偶×有界×周期」的八种组合里最容易混淆的三种并列展示。</p>
    <p>若函数在闭区间上连续且端点异号，区间内至少有一个零点。再加上严格单调条件，零点唯一。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCheckup } from '../../../boards/functions/properties/checkup.js';
import { createBoard as createComposition } from '../../../boards/functions/properties/composition.js';
import { S_CHAPTERS } from './snav.js';
</script>

<style src="./preset-row.css"></style>
<style>
.properties-checkup .fn-preset-row { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.properties-checkup.fn-board .chip > span { overflow: visible; }
.board.fn-board.properties-checkup.bd-float { overflow-y: auto; }
.board.fn-board.properties-checkup.bd-float > .ctrl.chips { max-height: none; overflow: visible; }
</style>
