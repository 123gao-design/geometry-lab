<template>
  <ChPage :cur="3" no="W3" base="/trig/w" :chapters="W_CHAPTERS"
    title="正切：断口与周期 $\pi$" sub="$\tan=\sin/\cos$（U2 商数关系）：$\cos=0$ 处排除成断口、竖直渐近线，曲线断笔成支永不连线；每支 $-\infty\to+\infty$ 单调升；$\pi+\alpha$ 组 $\tan(\pi+\alpha)=\tan\alpha$ —— 周期只有 $\pi$。"
    :toc="[{ id: 'w3-gap', t: '断口：排除点与渐近线' }, { id: 'w3-per', t: '周期 π 与奇函数' }, { id: 'w3-pit', t: '整条曲线不单调' }]">
    <div class="note good" id="w3-law"><strong>正切函数</strong>：<Katex tex="y=\tan x" />，定义域 <Katex tex="\Bigl\{x\ \Big|\ x\neq\tfrac{\pi}{2}+k\pi\Bigr\}" />，值域 <Katex tex="\mathbb{R}" />，周期 <Katex tex="T=\pi" />；<strong>奇函数</strong>：<Katex tex="\tan(-x)=-\tan x" />；<strong>每支</strong>：在 <Katex tex="\Bigl(-\tfrac{\pi}{2}+k\pi,\ \tfrac{\pi}{2}+k\pi\Bigr)" /> 内从 −∞ 单调升至 +∞。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGap" />
      <div class="cap">图 W3 · <b>正切的渐近线</b>：紫色竖直渐近线 <Katex tex="x=\pi/2+k\pi"/> 就是 cos 的零点（排除处）；开「周期 π」拖 <Katex tex="x_0"/> —— 两枚金点恒等高，平移 <Katex tex="\pi"/> 完全重合；探针逼近断口时，读数溢出、左右两支各自奔向 <Katex tex="\infty"/>。</div>
    </div>

    <h3 class="sec" id="w3-gap">断口：排除点与渐近线</h3>
    <p>tan 的曲线是<strong>逐段生成的</strong>：商数关系 <Katex tex="\tan x=\sin x/\cos x" /> 在 cos=0 处排除（U1 转 90° 无定义的原地复现），所以 x 轴上 <Katex tex="x=\tfrac{\pi}{2}+k\pi" /> 每隔 π 一个断口，曲线在那里断笔成一支 —— 逼近断口时一支趋于 +∞、另一支自 −∞ 上升，<strong>中间永不连线</strong>（断笔成支是作图的规范，也是判断题的常考点）。竖直渐近线与 U2b 的 sec 断口同址 —— sec=1/cos 与 tan=sin/cos 共用同一个排除点。奇偶性由 I1 的 −α 组直接读出：sin 变号、cos 不变，商 <strong>变号</strong> —— tan 是奇函数，曲线绕原点转半圈与自己重合（S3 验收），原点也是对称中心。</p>

    <h3 class="sec" id="w3-per">周期 π 与奇函数</h3>
    <p>周期减半同样从诱导公式直接得到：I1 的 <Katex tex="\pi+\alpha"/> 组里 sin、cos <strong>同时变号</strong>，商不变 —— <Katex tex="\tan(\pi+\alpha)=\tan\alpha" />，所以 <Katex tex="T=\pi"/>（更小的周期找不到了：S6 的思想 —— 若还有更小正周期 <Katex tex="T'"/>，<Katex tex="\pi/n"/> 的分解对不上）。图 W3 的「周期核验」徽章把这条等式做成平移验收：两枚金点 <Katex tex="(x_0,\ \tan x_0)"/> 与 <Katex tex="(x_0+\pi,\ \tan x_0)"/> 恒等高，相邻两支平移 <Katex tex="\pi"/> <strong>完全重合</strong>。这也解释了图象的「一支一支」为什么长得全同：整条曲线就是同一支的无限平移复制。零点在 <Katex tex="k\pi"/>、断口在 <Katex tex="\pi/2+k\pi"/> —— 零点与断口交错排布，恰好各占半个周期；与 cot 的排布（U2b 提示五：cot 断在 <Katex tex="k\pi"/>）互为镜像。</p>

    <h3 class="sec" id="w3-pit">整条曲线不单调</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：「tan 单调递增」有前提。</strong>每支内 −∞→+∞ 单调升没错，但整条曲线<strong>不单调</strong>：跨过断口，函数值从 +∞ 跳回 −∞（S1 的缺口：单调性不允许跳变）。做题时「tan 在定义域上单调增」是经典错句。</li>
        <li><strong>提示二：周期是 π 不是 2π。</strong>sin、cos 除以 cos，恰好差出半个周期 —— 别把母函数的周期照抄给商。</li>
        <li><strong>提示三：渐近线处「函数值不是 ∞」。</strong>断口处 tan <strong>无定义</strong>（排除），不是「等于无穷大」—— ∞ 不是数（U2b 提示：倒数趋于无穷说的是趋势，不是取值）。</li>
      </ul>
    </div>
    <p>三条主曲线（sin、cos、tan）就此同框完毕，W 系列收束。下一子专题<strong>图象变换</strong>（F1）：<Katex tex="y=A\sin(\omega x+\varphi)"/> 把振幅、周期、相位三个滑块一起拉响 —— G 系列的平移伸缩在这里与三角曲线合流，由图反演的看图题也从那里开工。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGap } from '../../../boards/trig/graph/tangap.js';
import { W_CHAPTERS } from './wnav.js';
</script>
