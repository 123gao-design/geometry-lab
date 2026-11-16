<template>
  <ChPage :cur="6" no="S6" base="/functions/s" :chapters="S_CHAPTERS"
    title="周期性专题：平移重合与对称换算" sub="f(x+T)=f(x) 说的是「平移后完全重合」—— 不是对半折。对称信息可与周期互相换算：两条对称轴换一个周期，一条对称轴加一个对称中心也换一个周期。"
    :toc="[{ id: 's6-def', t: '定义与验收（图 S6）' }, { id: 's6-thm', t: '对称换算两条定理' }, { id: 's6-ext', t: '延拓机与最小正周期' }]">
    <div class="note good" id="s6-def"><strong>周期</strong>：设 f(x) 定义域为 D，若存在 <Katex tex="T\ne 0" />，使得对任意 <Katex tex="x\in D" /> 都有 <Katex tex="x+T\in D" /> 且 <Katex tex="f(x+T)=f(x)" />，则 T 是 f 的一个周期。两个口径与 S1/S3 一脉相承：<strong>任意 x</strong>（不是抽查几个点），且 <strong>x+T 也得落回定义域</strong>（定义域须在平移下不变 —— 只在 [0,+∞) 上定义的函数不可能是周期函数）。若 T 是周期，则 kT（<Katex tex="k\in\mathbb{Z}" />，k≠0）全是周期；若存在最小的正周期，记作 <Katex tex="T_0" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPeriodCopy" />
      <div class="cap">图 S6 · <b>周期延拓机</b>：四个预设各验一项。① 平移重合验收：拖 s 看平移像 <Katex tex="f(x-s)" /> —— <Katex tex="s=2" /> 时谷对峰、完全错位，<Katex tex="s=4" /> 完全重合：<strong>周期说的是重合，不是对半折</strong>；② 双轴推周期：检验函数故意选不对称的形状（排除「周期其实是 2」的错觉），两条对称轴相距 <Katex tex="d=2" /> <Katex tex="\Longrightarrow" /> <Katex tex="T=2d=4" />；③ 轴+中心推周期：三角波轴心交替、相距 <Katex tex="d=1" /> <Katex tex="\Longrightarrow" /> <Katex tex="T=4d=4" />；④ 周期延拓：只给基本段 [0,2)，<Katex tex="f(x)=f(x-2k)" /> 把全轴延拓出来 —— 探针直接演示化归链 <Katex tex="x_0\to x_0-2k" /> → 基本段。</div>
    </div>

    <h3 class="sec" id="s6-thm">对称换算两条定理</h3>
    <p><strong>定理一（轴→轴）</strong>：若图象有两条对称轴 <Katex tex="x=a" /> 与 <Katex tex="x=a+d" />（<Katex tex="d\ne 0" />），则 f 以 <Katex tex="2d" /> 为周期。推导是一条漂亮的翻折链：对任意 x，</p>
    <Katex tex="f(x+2d)\ \overset{\text{轴}\,x=a+d}{=}\ f(2a+2d-x)\ \overset{\text{轴}\,x=a}{=}\ f(2a-x)\ \overset{\text{轴}\,x=a}{=}\ f(x)" display />
    <p>翻两次折 = 平移 <Katex tex="2d" /> —— 图 S6 ② 的探针验证 <Katex tex="f(u+4)=f(u)" /> 就是这条链的数值版。<strong>定理二（轴→心）</strong>：若图象有一条对称轴 <Katex tex="x=a" /> 与一个对称中心 <Katex tex="(a+d,\ 0)" />，则 f 以 <Katex tex="4d" /> 为周期 —— 轴翻 + 心转 = 平移 <Katex tex="4d" />，图 S6 ③ 的轴心交替阵列把 d=1 ⟹ T=4 实时演示。两条定理给的都是「一个周期」，<strong>不保证最小</strong>：要判 <Katex tex="T_0" />，得看更小的候选（② 的检验函数在 T=2 处立即显现，就是为了这一步）。</p>

    <h3 class="sec" id="s6-ext">延拓机与最小正周期</h3>
    <p>「只给一段、画出全轴」是周期函数的核心性质：取基本段（长为一个周期 <Katex tex="T_0" />），其余全部由 <Katex tex="f(x)=f(x-kT_0)" /> 复制 —— 图 S6 ④ 的探针把 x₀ 一路减到落回 [0,2) 再查表，这条化归链就是「查表函数」的构造方式（三角、取整、狄利克雷都是这么造的）。反过来读图找 <Katex tex="T_0" />：看<strong>重复单元的长度</strong>，再验证「单元内不再重复」—— ① 的波形单元长 4 且半单元 2 处不重合，所以 <Katex tex="T_0=4" />；若半单元也重合（如 ③ 的三角波按定理一读出 T=2d=2 的更小候选），就继续缩小候选，缩到不重合为止。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示：把「有对称轴」当成「有周期」。</strong>一条对称轴只给对称、不给周期 —— 定理一要<strong>两条</strong>轴、定理二要轴心<strong>成对</strong>；<Katex tex="f(x)=x^2" /> 关于 y 轴对称却没有周期（没有第二条轴）。另一个方向也不通：有周期不代表有对称轴（④ 的周期延拓故意用不对称的基本段）。周期与对称是两种重合方式 —— 平移与翻折 —— 谁也不包含谁，只能互相换算。</li>
      </ul>
    </div>
    <p>回收与预告：S5 的抽象式在本章得到推广 —— f(a+x)=f(b−x) 翻两次折变成 f(x+2d)=f(x)；S3 的「偶函数若有上界必有下界」在周期版中同样成立：连续周期函数必有界（基本段连续必有最值 —— S7 ③ 的检验）；下一讲 S7 把 S1–S6 的四个结论拼成一套完整的阅读流程。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPeriodCopy } from '../../../boards/functions/properties/periodcopy.js';
import { S_CHAPTERS } from './snav.js';
</script>
