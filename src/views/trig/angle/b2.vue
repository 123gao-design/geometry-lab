<template>
  <ChPage :cur="2" no="B2" base="/trig/b" :chapters="B_CHAPTERS"
    title="弧度制：用弧长量角" sub="度是把圆硬切成 360 份的人为约定；弧度用「弧长比半径」量角 —— 与圆的大小无关、与十进制/角度制换算无关，是让三角公式最干净的那套度量衡。"
    :toc="[{ id: 'b2-why', t: '弧度是什么' }, { id: 'b2-formula', t: '三个公式与互化' }, { id: 'b2-pit', t: '单位与换算' }]">
    <div class="note good" id="b2-law"><strong>弧度制定义</strong>：<Katex tex="|\alpha|=\dfrac{s}{r}" />（弧长比半径，与半径无关）；<strong>换算</strong>：<Katex tex="180^\circ=\pi" />（周角 <Katex tex="2\pi" />）。弧度制的便利：<Katex tex="s=\alpha r" />、<Katex tex="S=\dfrac{1}{2}\alpha r^2=\dfrac{1}{2}sr" /> —— 公式里不再出现 <Katex tex="\tfrac{\pi}{180}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createSector" />
      <div class="cap">图 B2 · <b>弧长展开机</b>：拖 α 与 r 实时记录弧长与面积；⏩ 把弧摊平成直尺 —— 尺上每格恰一个半径，格数正是弧度数；r×2 看弧长加倍而弧度纹丝不动。</div>
    </div>

    <h3 class="sec" id="b2-why">弧度是什么</h3>
    <p>「1 度」是把圆等分 360 份的<strong>人为</strong>约定 —— 360 可被很多数整除，但和圆本身的几何毫无关系。「1 弧度」则是<strong>天然</strong>的：弧长恰好等于半径的弧，圆心角就是 1 rad。图 B2 的展开动作把这个定义演给你看：弧被摊平成直尺后，尺上刻度每格恰一个半径长，<strong>格数就是弧度数</strong> —— α 越大弧越长，摊平后尺越长，表达式分毫不差。这就是弧度的本质：<Katex tex="\alpha=s/r" /> 是一个<strong>比值</strong>，无量纲 —— 所以换一个半径不同的圆，弧长跟着伸缩，比值却不动。点一下 r×2：弧长徽章翻倍，s÷r 徽章纹丝不动 —— 弧度与半径无关，是「角」这个量本身的属性。</p>

    <h3 class="sec" id="b2-formula">三个公式与互化</h3>
    <p>扇形面积走占比：圆面积的 <Katex tex="\tfrac{\alpha}{2\pi}" /> 倍，即 <Katex tex="S=\dfrac{\alpha}{2\pi}\cdot\pi r^2=\dfrac{1}{2}\alpha r^2" />；再把 <Katex tex="s=\alpha r" /> 代回去得 <Katex tex="S=\dfrac{1}{2}sr" /> —— 面积是「弧为底、半径为高」的三角形公式。互化只需记一条：<Katex tex="180^\circ=\pi" />，于是 <Katex tex="30^\circ=\tfrac{\pi}{6},\ 45^\circ=\tfrac{\pi}{4},\ 60^\circ=\tfrac{\pi}{3},\ 90^\circ=\tfrac{\pi}{2},\ 270^\circ=\tfrac{3\pi}{2}" /> —— 图 B2 的圆心角徽章会对每个 15° 的倍数自动给出这类精确分数。此外还有一层铺垫：在<strong>单位圆</strong>（r=1）上，弧长的数值就等于弧度数 —— 「角」与「弧长」两种语言在单位圆上完全对齐，下一章三角函数线全部以此为基础。</p>

    <h3 class="sec" id="b2-pit">单位与换算</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：弧度常省单位，但 <Katex tex="\pi"/> 不能丢。</strong>「<Katex tex="\alpha=3"/>」指 3 rad 而不是 <Katex tex="3^\circ"/>——3 rad 已近半圈的 <Katex tex="171.9^\circ" />。</li>
        <li><strong>提示二：换算方向别反。</strong>度化弧度乘 <Katex tex="\tfrac{\pi}{180}" />、弧度化度乘 <Katex tex="\tfrac{180}{\pi}" />；自检：度变弧度数值应变小（<Katex tex="\pi\approx3.14<180"/>）。</li>
        <li><strong>提示三：公式 <Katex tex="s=\alpha r"/> 只认弧度。</strong><Katex tex="\alpha"/> 若以度代入，必须先写成 <Katex tex="s=\dfrac{n\pi r}{180}" />，混单位是应用题头号失分点。</li>
        <li><strong>提示四：时钟是负角工厂。</strong>分针一小时 <Katex tex="-2\pi" />、时针一小时 <Katex tex="-\tfrac{\pi}{6}" />（顺时针，回收 B1 的方向约定）——「时针转 x 弧度」先定符号再谈大小。</li>
      </ul>
    </div>
    <p>弧度制建立后，下一章把角放上单位圆：终边与圆的交点坐标，将成为整个三角函数的起点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSector } from '../../../boards/trig/angle/sector.js';
import { B_CHAPTERS } from './bnav.js';
</script>
