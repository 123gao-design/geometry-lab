<template>
  <ChPage :cur="2" no="基2" base="/inequalities/g" :chapters="G_CHAPTERS"
    title="用基本不等式求最值" sub="基本不等式把「和定」与「积定」两句话说尽：和为定值则积有上界 $(s/2)^2$、积为定值则和有下界 $2\sqrt p$，两头都落在 $a=b$。于是求最值走上三步：一正、二定、三相等——先确认 a、b 为正，再固定和或积，最后检查等号位置是否落在可行范围内。"
    :toc="[{ id: 'g2-three', t: '一正二定三相等' }, { id: 'g2-sum', t: '和定积最大' }, { id: 'g2-prod', t: '积定和最小' }, { id: 'g2-equ', t: '等号位置与最值' }, { id: 'g2-pit', t: '条件落空' }]">
    <div class="note good" id="g2-law"><Katex tex="a,b>0" /> 且 <Katex tex="a+b=s" />（和定）时 <Katex tex="ab\le\frac{s^2}{4}" />，取等 <Katex tex="a=b=\frac s2" />；<Katex tex="ab=p" />（积定）时 <Katex tex="a+b\ge2\sqrt{p}" />，取等 <Katex tex="a=b=\sqrt p" />。和定看积的上界、积定看和的下界，最值都指向 <Katex tex="a=b" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPO" />
      <div class="cap">图 基2 · <b>和定与积定的最值</b> · 在「和定」模式沿抛物线移动探点，比较积与顶点的高度；在「积定」模式沿曲线寻找谷底。两种极值都在 <Katex tex="a=b"/> 时取得。</div>
    </div>

    <h3 class="sec" id="g2-three">一正二定三相等</h3>
    <p>用基本不等式求最值不是直接代公式，而是先核实三个前置：<strong>一正</strong>，<Katex tex="a,b" /> 须为正数，否则几何均值方向与符号都要重判（负数的情形见下文提示）；<strong>二定</strong>，和或积必须是定值——目标是「在约束下求最值」，约束不成定值，极值横线无从标出；<strong>三相等</strong>，等号条件（<Katex tex="a=b" />）要落在变量的可行范围内——这一点最容易丢，也最影响答案的取舍。</p>

    <h3 class="sec" id="g2-sum">和定积最大</h3>
    <p>给定 <Katex tex="a+b=s" />，把积写成 <Katex tex="b=s-a" /> 后的函数：<Katex tex="ab=a(s-a)" />，一条开口向下的抛物线，顶点在 <Katex tex="a=\frac s2" />，故 <Katex tex="a=b=\frac s2" /> 时积取到 <Katex tex="\frac{s^2}{4}" />。图 基2 模式一里绿点即探点、顶点处积压到横虚线（上界）——这就是「和为定值、两数越接近积越大」的图象呈现；n 个正数和为定值时同理走直接的容量权衡，那是后面放缩章的主题。</p>

    <h3 class="sec" id="g2-prod">积定和最小</h3>
    <p>给定 <Katex tex="ab=p" />，和写成一元函数 <Katex tex="a+\frac{p}{a}" />（图 基2 模式二，对勾曲线），谷底在 <Katex tex="a=\sqrt p" />，和最小 <Katex tex="2\sqrt p" />。最典型的一例是 <Katex tex="x+\frac1x\ge2\ (x&gt;0)" />（预设④，<Katex tex="p=1" />）：积定 1、和的最小是 2，取等在 <Katex tex="x=1" />。对勾曲线在 <Katex tex="a\to0^+" /> 一侧直升无界，也在提醒「积定和最小」只对正数成立——若 <Katex tex="x&lt;0" />，同一曲线分支翻到下方，结论变号而为 <Katex tex="x+\frac1x\le-2" />。</p>

    <h3 class="sec" id="g2-equ">等号位置与最值</h3>
    <p>两条极值横线都切在 <Katex tex="a=b" /> 处，这是解题的收束：求出上界/下界只是得到「界」，乘积最大与和最小必须确认 <Katex tex="a=b" /> 这一取等位置在定义域内，才能把「≤」升级为「最值」。若取等位置越界（如题目限定 <Katex tex="a\ge3" /> 而取等在 <Katex tex="a=1" />），只是得到宽松的界，真正的最值要到区间端点上找（E2 区间最值、V3 极值判定是那一路的工具）。</p>

    <h3 class="sec" id="g2-pit">条件落空</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：一正落空反转符号。</strong>负数时「积定和最小」不成立——<Katex tex="x+\frac1x" /> 在 <Katex tex="x&lt;0" /> 时最小根本没有 2，反而是 <Katex tex="\le -2"/> 的方向。</li>
        <li><strong>提示二：二定落空无从比较。</strong>和或积不是常数时，极值横线不固定，「最大 / 最小」随约束漂移——要先构造出定值的一侧（配凑），常见手法是往表达式中乘 1 或加减同一项。</li>
        <li><strong>提示三：三相等落空只余上下界。</strong>等号位置被题目排除时，界照成立但最值不是它——区间端点另找（见上节），也呼应 V3 极值最值判定「端点并入候选点集」。</li>
      </ul>
    </div>
    <p>一正二定三相等把「用基本不等式求最值」收成三步核对；下一章把常数项扩成整根均值链 <Katex tex="H\le G\le A\le Q"/>。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPO } from '../../../boards/inequalities/basic/pairopt.js';
import { G_CHAPTERS } from './gnav.js';
</script>