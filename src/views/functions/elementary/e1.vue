<template>
  <ChPage :cur="1" no="E1" base="/functions/e" :chapters="E_CHAPTERS"
    title="一次函数：斜率与截距" sub="斜率 k 决定直线的倾斜方向和变化率，截距 b 决定纵轴交点。"
    :toc="[{ id: 'e1-k', t: '斜率：坡度的代数（图 E1）' }, { id: 'e1-act', t: 'b 与零点：平移与落轴' }, { id: 'e1-edge', t: '边界与易错点' }]">
    <div class="note good" id="e1-k"><strong>一次函数</strong>：<Katex tex="y=kx+b\ (k\ne 0)" />，定义域、值域都是 <Katex tex="\mathbb{R}" />。<strong>斜率</strong> <Katex tex="k=\tan\alpha" />（<Katex tex="\alpha" /> 为倾斜角，<Katex tex="0\le\alpha<\pi" />）—— 它是每前进 1 个 x、y 的改变量，也就是「平均变化率」在直线上处处相等的值：任取两点 <Katex tex="k=\dfrac{y_2-y_1}{x_2-x_1}" />，答案与两点位置无关。这正是 S2 导数判据最平凡的情形：<strong><Katex tex="f'(x)\equiv k" /></strong>，一条水平线。</div>
    <div class="board-wrap">
      <BoardMount :factory="createScout" />
      <div class="cap">图 E1 · <b>一次函数的斜率</b>。移动探针，观察直角三角形的两条边。横向前进 <Katex tex="1" /> 个单位时，纵向改变量始终等于 <Katex tex="k" />。切到水平直线，再把 <Katex tex="b" /> 调到零，比较两种常值函数的零点集。</div>
    </div>

    <h3 class="sec" id="e1-act">b 与零点：平移与落轴</h3>
    <p><Katex tex="b" /> 是 <strong>y 截距</strong>：x=0 时的函数值，图象与 y 轴交点的纵坐标 —— 它只把直线<strong>上下平移</strong>，不改变坡向（C5：输出端加常数 b，图象整体上下平移）。零点由 <Katex tex="kx+b=0" /> 解得 <Katex tex="x=-\dfrac{b}{k}" />（k≠0）—— 一次函数恰有一个零点，这也是 R1 三语言最简单的实例：f(c)=0、方程 kx+b=0 的根、直线与 x 轴交点的横坐标，说的是同一个数。</p>
    <p>单调性完全由 k 的符号判定：<Katex tex="k>0" /> 时 R 上递增、<Katex tex="k<0" /> 递减 —— 与 f′≡k 的正负严格对应（S2 的染色规则）。比较 <Katex tex="k_1,\ k_2" /> 的大小不必算：横向同样前进一个单位，纵向增量越大，斜率越大。图 E1 的两轴采用相同比例，倾角 <Katex tex="45^\circ" /> 对应 <Katex tex="k=1" />。</p>

    <h3 class="sec" id="e1-edge">边界与易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：k=0 不是一次函数。</strong>y=b 是常数函数，「一次」要求 k≠0 —— 图 E1 的「水平」预设展示这个边界情形。</li>
        <li><strong>提示二：截距不是距离。</strong>b 可正可负可为零，「截距」只是与 y 轴交点的纵坐标，说「截距为 −1」完全合法。</li>
        <li><strong>提示三：竖直线 x=a 没有斜率。</strong>它不是函数（一个 x 配了一串 y），倾角 90° 处 <Katex tex="\tan\alpha" /> 无定义 —— 「一次函数」与「直线」不是一回事：直线还包括竖直线与水平线（后者是 y=b）。</li>
      </ul>
    </div>
    <p>一次函数在各区间上的平均变化率均相同。割线与切线一章将把斜率的概念推广到曲线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createScout } from '../../../boards/functions/elementary/slopescout.js';
import { E_CHAPTERS } from './enav.js';
</script>

<style src="../properties/preset-row.css"></style>
