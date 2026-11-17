<template>
  <ChPage :cur="2" no="F2" base="/trig/f" :chapters="F_CHAPTERS"
    title="变换顺序与由图反演" sub="先压缩后平移 $\pi/6$、先平移后压缩 $\pi/3$ —— 中间产物不同、终点相同；由图反演三步：峰高定 $A$、峰距定 $T$、升段零点定 $\varphi$。"
    :toc="[{ id: 'f2-two', t: '两路演算与中间产物' }, { id: 'f2-rev', t: '由图反演三步' }, { id: 'f2-g', t: '与 G3 变换顺序的回收' }, { id: 'f2-pit', t: '易错点与口诀' }]">
    <div class="note good" id="f2-law"><strong>两路都通，平移量不同</strong>：从 sin x 到 <Katex tex="\sin\bigl(2x+\tfrac{\pi}{3}\bigr)" /> —— 先伸缩后平移走 <Katex tex="\sin x\to\sin 2x\to\sin\bigl(2(x+\tfrac{\pi}{6})\bigr)" />，实际平移 <Katex tex="\tfrac{\pi}{6}" />；先平移后伸缩走 <Katex tex="\sin x\to\sin\bigl(x+\tfrac{\pi}{3}\bigr)\to\sin\bigl(2x+\tfrac{\pi}{3}\bigr)" />，实际平移 <Katex tex="\tfrac{\pi}{3}" />。中间产物不同，终点相同。<strong>由图反演三步</strong>：峰高定 A、峰距定 T（<Katex tex="\omega=\tfrac{2\pi}{T}" />）、升段过零点定 x₀（<Katex tex="\varphi=-\omega x_0" />）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createWave" />
      <div class="cap">图 F2 · <b>先压缩后平移与先平移后压缩</b>：甲（蓝）先压缩后平移、乙（橙）先平移后压缩，两条路同时演算 —— <Katex tex="t=1"/> 时中间产物分离（<Katex tex="\sin 2x"/> 与 <Katex tex="\sin(x+\pi/3)"/> 显然是两条不同的波），<Katex tex="t=2"/> 在金虚目标 <Katex tex="\sin\bigl(2x+\tfrac{\pi}{3}\bigr)" /> 汇合；切「由图反演」模式求解：🎯 出题给一条金线，三滑块把蓝线贴上去。</div>
    </div>

    <h3 class="sec" id="f2-two">两路演算与中间产物</h3>
    <p>按 ⏵ 演算（或拖 t 滑块）：t 从 0 走到 1 时，甲做<strong>压缩</strong>（<Katex tex="\omega: 1\to 2"/>）、乙做<strong>平移</strong>（<Katex tex="\varphi: 0\to\pi/3"/>）；t 从 1 走到 2 时轮到对方 —— 甲做平移（<Katex tex="\varphi"/> 加在 <Katex tex="2x"/> 上，实际平移只有 <Katex tex="\pi/6"/>）、乙做压缩。<Katex tex="t=1"/> 的<strong>分离</strong>是本图的核心：同一个终点，可以经过两个完全不同的中间站 —— 中间表达式不同，最终结果相同。</p>
    <p>考试问「<Katex tex="\sin 2x" /> 左移多少得到 <Katex tex="\sin\bigl(2x+\tfrac{\pi}{3}\bigr)" />」答 <Katex tex="\tfrac{\pi}{6}" />；问「<Katex tex="\sin x"/> 先左移多少、再把横坐标压为一半，得到 <Katex tex="\sin\bigl(2x+\tfrac{\pi}{3}\bigr)" />」答 <Katex tex="\tfrac{\pi}{3}" /> —— 同一个终点，两条路给出的平移量不同。<strong>为什么会这样</strong>：平移量永远除以「此刻 <Katex tex="x"/> 前面的系数」—— 甲路的平移发生在压缩之后，<Katex tex="x"/> 前面是 2，<Katex tex="\varphi=\pi/3"/> 对应实际平移 <Katex tex="(\pi/3)\div 2=\pi/6"/>；乙路的平移发生在压缩之前，系数是 1，实际平移 <Katex tex="\pi/3"/>。平移量的大小由 <Katex tex="x"/> 前面的系数决定。</p>

    <h3 class="sec" id="f2-rev">由图反演三步</h3>
    <p>切「由图反演」、按 🎯 出题：一条金线 <Katex tex="y=A\sin(\omega x+\varphi)" /> 出场，三滑块把蓝线贴上去，最大偏差 &lt; 0.06 判<strong>求解</strong>。三步读图，每步回收一章：<strong>① 峰高定 A</strong> —— 金线最高点就是 A（F1 的值域带、W1 的峰）；<strong>② 相邻峰距定 T</strong>，换 <Katex tex="\omega=\tfrac{2\pi}{T}" />（W3 的周期观点；相邻同向零点的距离也是 T）；<strong>③ 升段过零点定 x₀</strong>，换 <Katex tex="\varphi=-\omega x_0" />（F1 的起点）。顺序讲究：前两步不依赖原点位置、稳；第三步依赖原点、最易错 —— 把它放到最后，用前两步的结果兜住。题库四道轮换，求解后答案在徽章里揭晓。</p>

    <h3 class="sec" id="f2-g">与 G3 变换顺序的回收</h3>
    <p>G3 模式一的金线 <Katex tex="b\,f\bigl(a(x-h)\bigr)+k" /> 与红虚误读线 <Katex tex="b\,f(ax-h)+k" /> 之争，三角版就是「先提系数（甲）还是先平移（乙）」：<Katex tex="\sin\bigl(2(x+\tfrac{\pi}{6})\bigr)" /> 的记法把平移量写在系数之后，图上直接可见；把 φ 直接当平移量，就会多平移一倍 —— G3 红虚线的「差 a 倍」在此处是「差 ω 倍」。记忆锚点：F1 的起点公式 <Katex tex="x_0=-\tfrac{\varphi}{\omega}" /> 本身就在提醒 —— 平移量是<strong>除以 ω 后</strong>的结果。</p>

    <h3 class="sec" id="f2-pit">易错点与口诀</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：起点 <Katex tex="\ne"/> 相位。</strong>把 <Katex tex="\sin\bigl(2x+\tfrac{\pi}{3}\bigr)" /> 的起点写成 <Katex tex="-\pi/3"/>（忘了除以 <Katex tex="\omega=2"/>）是最常见错 —— 板上演算到 <Katex tex="t=2"/>，看甲线的起点落在哪：是 <Katex tex="-\pi/6"/>。</li>
        <li><strong>提示二：两条路的量混用。</strong>口诀「<strong>先平移后压缩不缩量，先压缩后平移要除 <Katex tex="\omega"/></strong>」—— 做题先默念题目给的是哪条路，再取对应的量。</li>
        <li><strong>提示三：反演先找起点。</strong>起点依赖原点位置，一旦读错满盘皆输 —— 按峰高 → 周期 → 起点的顺序读，前两步不受原点影响。</li>
      </ul>
    </div>
    <p>至此<strong>阶段三（图象与性质 + 图象变换）5 章完结</strong>：W 系列立起三条主曲线，F 系列给曲线装上三个旋钮、理清两条路。下一阶段 <strong>M1 和差公式</strong> 开工 —— 届时 <Katex tex="\sin\bigl(x+\tfrac{\pi}{2}\bigr)=\cos x" /> 不再是「背来的」，而是<strong>算出来的</strong>。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createWave } from '../../../boards/trig/trans/ordwave.js';
import { F_CHAPTERS } from './fnav.js';
</script>
