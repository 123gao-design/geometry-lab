<template>
  <ChPage :cur="3" no="R3" base="/functions/r" :chapters="R_CHAPTERS"
    title="二分法：对半缩区间" sub="二分法逐次用中点把异号区间缩短一半，直到达到给定精度。"
    :toc="[{ id: 'r3-alg', t: '算法与显微镜（图 R3）' }, { id: 'r3-err', t: '误差与步数：对数关系' }, { id: 'r3-scope', t: '适用范围与易错点' }]">
    <div class="note good" id="r3-alg"><strong>二分法</strong>：设 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上连续且 <Katex tex="f(a)f(b)<0" />。循环四步 —— ① 取中点 <Katex tex="m=\dfrac{a+b}{2}" />；② 算 <Katex tex="f(m)" />（若恰为 0，零点就是 m，直接完成）；③ 判定：<Katex tex="f(m)" /> 与 <Katex tex="f(a)" /> 异号则零点在 <Katex tex="[a,m]" />、同号则在 <Katex tex="[m,b]" />；④ 留下变号的那半，回到 ①。每一步的依据都来自 R2 的定理：<strong>留下的半区间端点依旧异号、函数依旧连续，所以零点一定还在里面</strong> —— 二分法是存在性定理的算法化。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBisect" />
      <div class="cap">图 R3 · <b>二分法</b>。点「二分一步」，比较每次保留的区间和中点的符号。左图金色线段是保留区间；右图放大该区间，金色点标出本次检验的中点。</div>
    </div>

    <h3 class="sec" id="r3-err">误差与步数：对数关系</h3>
    <p>经过 <Katex tex="n" /> 步二分，区间宽度为 <Katex tex="w_n=(b_0-a_0)/2^n" />。取当前区间的中点作为近似根，误差至多为 <Katex tex="w_n/2" />。画板的精度滑块设定的是区间宽度目标 <Katex tex="w_n\le\varepsilon" />，所需的最少步数为</p>
    <Katex tex="n=\max\!\left(0,\left\lceil\log_2\frac{b_0-a_0}{\varepsilon}\right\rceil\right)" display />
    <p>初始区间宽度为 <Katex tex="1" /> 时，要将宽度缩到 <Katex tex="0.05" /> 以内，需要二分 <Katex tex="5" /> 步；缩到 <Katex tex="10^{-6}" /> 以内，需要 <Katex tex="20" /> 步。若题目给出的是中点误差目标 <Katex tex="\delta" />，让区间宽度不超过 <Katex tex="2\delta" /> 即可。</p>

    <h3 class="sec" id="r3-scope">适用范围与易错点</h3>
    <p>二分法需要函数在保留区间上连续且两端异号。偶重根两侧可以同号，仅靠端点变号可能漏掉这种零点。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：误差写错半个宽度。</strong>取<strong>区间中点</strong>近似时误差 <Katex tex="\le\text{宽}/2"/>，取<strong>区间内任一点</strong>才能说 <Katex tex="\le\text{宽}"/> —— 答题先声明取法。</li>
        <li><strong>提示二：忘验初始异号。</strong>端点同号就开始二分，每一步都没有定理保证（图 R3 的判定徽章开局先查这一条）。</li>
        <li><strong>提示三：说「二分法能求所有零点」。</strong>它只保证找到变号零点；偶数重零点（触轴不穿轴）与区间外零点都不在其适用范围。</li>
        <li><strong>提示四：精度与步数换算——</strong>「宽 <Katex tex="<\varepsilon"/>」和「误差 <Katex tex="<\varepsilon"/>」差一个因子 2，读题看清要哪个。</li>
      </ul>
    </div>
    <p>回收与预告：R2 的定理每一步都在重新应用一次；R1 的无理根（探针拖不上的 0.347…）在这里被机械地缩到精度之内；E2 的 <Katex tex="x^2-2"/> 给了 <Katex tex="\sqrt{2}"/> 一个可计算的逼近。二分稳但不快 —— 下一讲 R4 引入导数：切线一步抵好几步，代价是需要防它失效（③ 循环反例）。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createBisect } from '../../../boards/functions/zeros/bisect.js';
import { R_CHAPTERS } from './znav.js';
</script>

<style src="../properties/preset-row.css"></style>
<style src="./zero-boards.css"></style>
