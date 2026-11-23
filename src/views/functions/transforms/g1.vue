<template>
  <ChPage :cur="1" no="G1" base="/functions/g" :chapters="G_CHAPTERS"
    title="平移：左加右减的代数原理" sub="在 y=f(x−h)+k 中，图象上的每个点横坐标增加 h，纵坐标增加 k。"
    :toc="[{ id: 'g1-law', t: '平移定理与方向记录（图 G1）' }, { id: 'g1-why', t: '为什么横移要反着写' }, { id: 'g1-pit', t: '一字之差与易错点' }]">
    <div class="note good" id="g1-law"><strong>平移定理</strong>：函数 <Katex tex="y=f(x)" /> 的图象向右平移 <Katex tex="h" /> 个单位、再向上平移 <Katex tex="k" /> 个单位，所得新图象的解析式是 <Katex tex="y=f(x-h)+k" />（<Katex tex="h,k" /> 可正可负，负号自动改方向）。图上每个点 <Katex tex="(x_0,y_0)" /> 都移到 <Katex tex="(x_0+h,\ y_0+k)" /> —— 特殊点（顶点、起笔点、渐近线）随图象整体平移，是读图定位的第一锚。</div>
    <div class="board-wrap">
      <BoardMount :factory="createShift" />
      <div class="cap">图 G1 · <b>图象的平移</b>。拖动 h、k，沿两段位移找到 P 对应的 P′。换成指数函数后，观察渐近线如何移动。</div>
    </div>

    <h3 class="sec" id="g1-why">为什么横移要反着写</h3>
    <p>竖移好懂：<Katex tex="f(x)+k" /> 给每个输出加 k，是<strong>输出端</strong>的事，图象整体升降。横移别扭的地方在于 <Katex tex="f(x+h)" /> 反而向<strong>左</strong>移 —— 因为它改的是<strong>输入端</strong>：要在新的 <Katex tex="x=-h" /> 处才输入出原来的 <Katex tex="x=0" />。C5 的机器观早就说过：输出端是升降机（加多少升多少），输入端是传送带（往里多塞 h，画面反而往左退 h）。所以「左加右减」不是规定，是<strong>补偿</strong>：想让画面右移 h，就得让机器提前 h 处开工 —— <Katex tex="f(x-h)" />。换点验证最快：<Katex tex="y=(x-2)^2" /> 在 x=2 处取到 <Katex tex="x^2" /> 在 x=0 的值 0 —— 抛物线顶点移到了 (2,0)，确实右移。</p>
    <p>图象与解析式可以互推（G3 的「由图反演」基础版）：看到金线是蓝线整体右 2 上 1，立刻写出 <Katex tex="y=f(x-2)+1" />；反过来看到 <Katex tex="y=\sqrt{x+3}-1" />，立刻读出「左 3 下 1」。记录口诀只有一句：<strong>横移看括号里的整体，竖移看函数外的加减</strong>。</p>

    <h3 class="sec" id="g1-pit">一字之差与易错点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：f(x+1) 与 f(x)+1 一字之差。</strong>前者向左移 1（输入端），后者向上移 1（输出端）—— 位置、方向全不同。</li>
        <li><strong>提示二：「左加右减」只对括号整体成立。</strong><Katex tex="f(2x+1)" /> 不能读成「左移 1」：括号里是 <Katex tex="2x" /> 不是 <Katex tex="x" />，得先提因子（G3 的核心内容）。</li>
        <li><strong>提示三：平移不改变形状。</strong>坡度、开口、对称性原样保留 —— 被平移的只有位置；E8 的折缝（x 轴、y 轴）与本章的平移是两类变换，别混。</li>
      </ul>
    </div>
    <p>平移使定义域整体移动 h，值域整体移动 k。伸缩的坐标关系也可以通过对应点推导。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createShift } from '../../../boards/functions/transforms/shiftlab.js';
import { G_CHAPTERS } from './gnav.js';
</script>
