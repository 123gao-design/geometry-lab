<template>
  <ChPage :cur="3" no="R3" base="/functions/r" :chapters="R_CHAPTERS"
    title="二分法：对半缩区间" sub="维护一个异号区间，每步取中点判定、留下变号的那半 —— n 步后 $\text{宽}=\text{初始宽}\times 2^{-n}$，误差随步数指数递减，不挑函数、不需求导。"
    :toc="[{ id: 'r3-alg', t: '算法与显微镜（图 R3）' }, { id: 'r3-err', t: '误差与步数：对数关系' }, { id: 'r3-scope', t: '适用范围与易错点' }]">
    <div class="note good" id="r3-alg"><strong>二分法</strong>：设 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上连续且 <Katex tex="f(a)f(b)<0" />。循环四步 —— ① 取中点 <Katex tex="m=\dfrac{a+b}{2}" />；② 算 <Katex tex="f(m)" />（若恰为 0，零点就是 m，直接完成）；③ 判定：<Katex tex="f(m)" /> 与 <Katex tex="f(a)" /> 异号则零点在 <Katex tex="[a,m]" />、同号则在 <Katex tex="[m,b]" />；④ 留下变号的那半，回到 ①。每一步的依据都来自 R2 的定理：<strong>留下的半区间端点依旧异号、函数依旧连续，所以零点一定还在里面</strong> —— 二分法是存在性定理的算法化。</div>
    <div class="board-wrap">
      <BoardMount :factory="createBisect" />
      <div class="cap">图 R3 · <b>二分显微镜</b>：左栏全景金带 = 当前异号区间，右栏显微镜自动放大它 —— 看中点 m 与 <Katex tex="f(m)"/> 的符号判定、金线一步步贴近灰点（真零点）。① 求出 <Katex tex="\sqrt{2}"/>；② 求 R1 ② 的无理根 0.347…；③ 求 R2 ④ 的唯一零点 0.682…。「二分一步」单步看判定，「连续二分」自动跑到精度 ε，步数徽章实时记着 <Katex tex="\text{宽}=\text{初始宽}\times 2^{-n}"/>。</div>
    </div>

    <h3 class="sec" id="r3-err">误差与步数：对数关系</h3>
    <p>第 n 步后区间宽 <Katex tex="w_n=\dfrac{b_0-a_0}{2^n}" />；拿区间里任一点（习惯取中点）当零点近似，误差不超过 <Katex tex="\dfrac{w_n}{2}" />。反过来问「要误差 &lt; ε 需二分几步」：</p>
    <Katex tex="n\ \ge\ \log_2\dfrac{b_0-a_0}{\varepsilon}" display />
    <p>这是<strong>对数关系</strong>：ε 每缩小 10 倍，步数只多约 3.3 步（<Katex tex="\log_2 10\approx 3.32" />）。区间宽 1 缩到 0.05 要 5 步；缩到百万分之一也只要 21 步 —— 收敛虽慢、步数增长极缓。图 R3 的步数徽章把这条对数曲线实时呈现：ε 滑块越拖越小，「还差约 k 步」增长极为缓慢。</p>

    <h3 class="sec" id="r3-scope">适用范围与易错点</h3>
    <p>二分法的<strong>前提</strong>只要「连续 + 异号」：不用导数、不用公式、不挑函数复杂程度 —— R4 的牛顿法快得多，但依赖函数与初值的选择；二分法适用范围最广。代价是它只认<strong>变号零点</strong>：R1 ④ 的二重零点两侧同号，f(a)f(b)&lt;0 永不成立，二分法无法进行 —— 这类零点要用因式分解或 V 系列的极值工具处理。</p>
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
