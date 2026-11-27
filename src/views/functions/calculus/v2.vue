<template>
  <ChPage :cur="2" no="V2" base="/functions/v" :chapters="V_CHAPTERS"
    title="运算法则：增量的记录" sub="两个因子的乘积增量由两块一次增量和一块交叉增量组成。"
    :toc="[{ id: 'v2-ledger', t: '四则法则' }, { id: 'v2-geo', t: '面积增量板：乘法法则的来源' }, { id: 'v2-pit', t: '符号、顺序与链式' }]">
    <div class="note good" id="v2-law"><strong>四则运算法则</strong>：<Katex tex="(u\pm v)'=u'\pm v'" />、<Katex tex="(cu)'=c\,u'" />、<Katex tex="(uv)'=u'v+uv'" />、<Katex tex="\Bigl(\dfrac{u}{v}\Bigr)'=\dfrac{u'v-uv'}{v^2}\ (v\neq 0)" /> —— 前两条是「记录不混项」，后两条的几何来源都能在图 V2 的面积板上看到。</div>
    <div class="board-wrap">
      <BoardMount :factory="createArea" />
      <div class="cap">图 V2 · <b>乘积法则与矩形面积</b>。原矩形的面积固定为 <Katex tex="uv=2" />。先只拖动一个增量，观察哪几块面积随之变化；再让两个增量一起减半，两条边带的面积各减半，角块的面积变为原来的四分之一。</div>
    </div>

    <h3 class="sec" id="v2-ledger">四则法则</h3>
    <p>和差法则可以直接从定义的两行拆开验证：<Katex tex="\dfrac{(u\pm v)(x_0+\Delta x)-(u\pm v)(x_0)}{\Delta x}=\dfrac{\Delta u}{\Delta x}\pm\dfrac{\Delta v}{\Delta x}" />，取极限后两项分别计算。常数倍乘更平凡：<Katex tex="\dfrac{c\,\Delta u}{\Delta x}=c\,\dfrac{\Delta u}{\Delta x}" />。麻烦在乘积：两个都在变，增量里会出现「你变我也变」的交叉项 —— 这正是图 V2 要展示的内容。</p>
    <p>商法则不必另背几何：把 <Katex tex="\dfrac{u}{v}=u\cdot\dfrac{1}{v}" /> 套乘法法则 + 倒数求导 <Katex tex="\Bigl(\dfrac{1}{v}\Bigr)'=-\dfrac{v'}{v^2}" /> 即得，E5 的对数徽章 <Katex tex="(\log_a x)'=\dfrac{1}{x\ln a}" /> 也可用 <Katex tex="\ln x" /> 的定义式走这条路。幂、指、对的求导公式与 E 系列徽章逐一对上：<Katex tex="(x^n)'=nx^{n-1}" />、<Katex tex="(e^x)'=e^x" />、<Katex tex="(\ln x)'=\dfrac{1}{x}" />。</p>

    <h3 class="sec" id="v2-geo">面积增量板：乘法法则的来源</h3>
    <p>两边分别增加 <Katex tex="\Delta u,\Delta v" /> 时，新增面积为 <Katex tex="u\Delta v+v\Delta u+\Delta u\Delta v" />。若 u、v 都可导，两项增量至多与 <Katex tex="\Delta x" /> 同阶，交叉项除以 <Katex tex="\Delta x" /> 后趋于零。一次项取极限便得到 <Katex tex="(uv)'=u'v+uv'" />。</p>
    <p>这个「二阶小量可弃」的直觉就是微分学的灵魂，后面 V4 的切线放缩（用切线代替曲线、误差定号）与 V8 的黎曼和（矩形代替曲边、n 加密误差归零）都是它的再登场。</p>

    <h3 class="sec" id="v2-pit">符号、顺序与链式</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把乘法法则记成 <Katex tex="(uv)'=u'v'"/>。</strong>用 <Katex tex="f=x\cdot x" /> 一秒验尸：<Katex tex="x'\cdot x'=1" />，而 <Katex tex="(x^2)'=2x" /> —— 面积板告诉你交叉项是被「弃」掉的，不是被「乘」掉的。</li>
        <li><strong>提示二：商法则的分子是 <Katex tex="u'v-uv'"/>，减号容易背反。</strong>取特例 <Katex tex="u=v"/> 校验：<Katex tex="\Bigl(\dfrac{v}{v}\Bigr)'=0" />，而分子代入得 <Katex tex="v'v-vv'=0" /> —— 完全重合；减号一旦背反，这个特例直接失效。</li>
        <li><strong>提示三：复合函数别硬套。</strong>E 系列徽章里 <Katex tex="(a^x)'=a^x\ln a" /> 已含链式雏形；高中阶段记 <Katex tex="[f(ax+b)]'=a\,f'(ax+b)" /> —— 与 G2「横除纵乘」同一句话：内层系数乘在导数前面。</li>
      </ul>
    </div>
    <p>下一讲用这套法则解决实际问题：f′ 找驻点、两侧变号定极值、闭区间把端点并入候选 —— E2 的区间最值机从二次特例升级成一般流程。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createArea } from '../../../boards/functions/calculus/prodarea.js';
import { V_CHAPTERS } from './vnav.js';
</script>

<style src="../properties/preset-row.css"></style>
