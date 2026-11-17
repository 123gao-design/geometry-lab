<template>
  <ChPage :cur="7" no="S7" base="/functions/s" :chapters="S_CHAPTERS"
    title="性质综合阅读：四项检验" sub="单调、奇偶、周期、有界 —— 四件性质不是彼此独立，而是互相联系的一组：全局折叠（对称/周期）缩小讨论范围，局部读段（单调）理清走向，界墙（确界/最值）给出范围。"
    :toc="[{ id: 's7-flow', t: '检验流程：全局 → 局部 → 界（图 S7）' }, { id: 's7-net', t: '关系网：性质互相推出' }, { id: 's7-use', t: '大题里的用法' }]">
    <div class="note good" id="s7-flow">拿到陌生函数，按固定次序检验：<strong>① 全局折叠</strong> —— 先查对称（奇偶式、对称式）与周期（平移式），一旦成立，讨论范围立即缩成「一半」或「一个基本段」；<strong>② 局部读段</strong> —— 在剩下的范围里用 <Katex tex="f'" /> 符号（S2）读出单调区间与临界点；<strong>③ 界墙定界</strong> —— 单调读出值域走向后，用确界与最值（S4）确定上下。次序不能反：先用全局性质缩小范围，局部讨论才最省力。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCheckup" />
      <div class="cap">图 S7 · <b>函数的性质</b>：三个检验函数 <Katex tex="\times" /> 四个开关。开关与检验项一一对应：单调分段（绿增红减）、奇偶镜像（金虚线=偶假设 <Katex tex="f(-x)" />、橙虚线=奇假设 <Katex tex="-f(-x)" />，逐点验证谁重合）、周期平移（紫虚线 <Katex tex="f(x-T)" />，拖候选 T）、确界线（青虚线；取到的界=最值）。① <Katex tex="x^3-3x" />：奇、无界、无周期 —— 临界点 <Katex tex="\pm 1" /> 是单调转折处；② <Katex tex="1/(x^2+1)" />：偶、有界、最大值取到但下确界 0 取不到；③ S6② 的双轴检验函数：非奇非偶、周期 4，基本段连续所以最值必取到 —— 周期函数也可以又「有界又取满」。</div>
    </div>

    <h3 class="sec" id="s7-net">关系网：性质互相推出</h3>
    <p>几条最常用的「互相推出的结论」：<strong>奇函数在对称区间上单调性一致</strong>——<Katex tex="f" /> 奇且在 <Katex tex="[0,a]" /> 增，则在 <Katex tex="[-a,a]" /> 增（图 S7 ① 开镜像验收后，两侧单调同构）；<strong>偶函数恰相反</strong>——对称区间增减相反（S1 ① 的等高回折）；<strong>连续周期函数必有界</strong>——基本段是闭的就有最值（③ 的检验结果，对照 ① 的无界：周期与有界互不蕴含，但「周期+连续」保证有界）；<strong>奇函数若有上界必有下界</strong>（S3 结尾提出的问题在这里解决：上界 M 给出下界 <Katex tex="-M" />，反过来同理）；<strong>对称轴推周期</strong>需要两条轴（S6 定理一），一条轴只给出对称。</p>
    <p>这些条款的证明全是「一句话翻译」：奇 + 上界 <Katex tex="f(x)\le M" /> 平移到 <Katex tex="-f(-x)\le M" /> 再换字母 —— 翻折后上界变下界。性质证明的母法与 S1 一致：<strong>定义式 + 代入</strong>，其余都是它的方言。</p>

    <h3 class="sec" id="s7-use">大题里的用法</h3>
    <p>压轴题里函数性质的解题流程是「先验后算」：<strong>第一步永远先验对称与周期</strong>——把 <Katex tex="x" /> 换成 <Katex tex="-x" /> 看式子（奇偶），把 <Katex tex="x" /> 换成 <Katex tex="x+T" /> 看是否复原（周期）；<strong>验证后就缩小讨论范围</strong>——奇偶减一半、周期缩成一个基本段，然后才在剩余区间里求导、比大小、定最值。最值报告要带取等点（S4 的口径）：「最大值 1，在 <Katex tex="x=0" /> 取到」而不是「<Katex tex="\le 1" />」；区间端点开闭决定界能不能取到（S4 ② 的差一点）。图 S7 的四张判定表就是这套流程的模板 —— 三个例子把「奇偶×有界×周期」的八种组合里最容易混淆的三种并列展示。</p>
    <p>回收与预告：本章汇总 S1–S6 的结论 —— 单调（S1/S2）、奇偶（S3）、有界（S4）、对称（S5）、周期（S6）在此汇成统一的阅读流程；往下走，子专题三 R 系列把「界」变成「根」：单调 + 端点异号 <Katex tex="\Longrightarrow" /> 唯一零点（存在性定理），检验徽章的读数就是零点位置的记录。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCheckup } from '../../../boards/functions/properties/checkup.js';
import { S_CHAPTERS } from './snav.js';
</script>
