<template>
  <ChPage :cur="1" no="W1" base="/trig/w" :chapters="W_CHAPTERS"
    title="正弦五点法：单位圆展开" sub="把单位圆竖着滚过坐标纸：纵坐标 $MP$ 逐点被摊到右纸上，$(\alpha,\sin\alpha)$ 连成正弦波。五个点定一档走势 —— 升、峰、降、谷、升。"
    :toc="[{ id: 'w1-roll', t: '单位圆滚动展开' }, { id: 'w1-five', t: '五点法与一档走势' }, { id: 'w1-pit', t: '曲线不是折线' }]">
    <div class="note good" id="w1-law"><strong>正弦函数</strong>：<Katex tex="y=\sin x" />，定义域 <Katex tex="\mathbb{R}" />，值域 <Katex tex="[-1,1]" />，周期 <Katex tex="T=2\pi" />；<strong>五点骨架</strong>：<Katex tex="(0,0),\ \Bigl(\tfrac{\pi}{2},1\Bigr),\ (\pi,0),\ \Bigl(\tfrac{3\pi}{2},-1\Bigr),\ (2\pi,0)" /> —— 升、峰、降、谷、升，一档走势尽在五点。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRoll" />
      <div class="cap">图 W1 · <b>正弦滚动展开机</b>：左圆右纸<strong>共用同一比例尺</strong>（圆半径 = 坐标纸的单位长，圆心与纸的零线等高）—— 拖 P 或 ⏵ 滚动，纵坐标 <Katex tex="MP"/> 沿金色虚线被「摊」到右纸上，<Katex tex="(\alpha,\sin\alpha)"/> 逐点连成金色正弦波；五个金点即五点法骨架，「五点判读」徽章随档位换词。</div>
    </div>

    <h3 class="sec" id="w1-roll">单位圆滚动展开</h3>
    <p>曲线上的每个点都来自单位圆：<Katex tex="P(\cos\alpha,\ \sin\alpha)"/> 的<strong>纵坐标</strong>就是 <Katex tex="\sin\alpha"/>（U1 坐标定义的回收），右纸的横轴记角 <Katex tex="\alpha"/>（弧度制，B2 的回收：用弧长量角），纵轴记这个纵坐标。图 W1 的关键设计是<strong>等高平移</strong>：左圆与右纸共用比例尺，金色虚线恒为水平 —— P 走到哪，右纸 <Katex tex="(\alpha,\ \sin\alpha)"/> 的高度就与 <Katex tex="MP"/> 一模一样，肉眼可验。P 转满一圈（<Katex tex="\alpha"/> 从 0 到 <Katex tex="2\pi"/>），波形恰好走完一个完整周期、回到 <Katex tex="(2\pi,\ 0)"/> —— 再转一圈，波形原样重复。这正是 I1 旋转整圈组 <Katex tex="\sin(\alpha+2k\pi)=\sin\alpha" /> 在图象上的体现：<strong>横着平移 <Katex tex="2\pi"/>，曲线与自己重合</strong>，所以周期 <Katex tex="T=2\pi"/>（S6 的平移验收，这里由定义直接看见）。</p>

    <h3 class="sec" id="w1-five">五点法与一档走势</h3>
    <p>画正弦草图不必逐点计算：<strong>五个点定一档</strong> —— 起点 <Katex tex="(0,0)"/>、峰 <Katex tex="(\pi/2,\ 1)"/>、中点 <Katex tex="(\pi,\ 0)"/>、谷 <Katex tex="(3\pi/2,\ -1)"/>、终点 <Katex tex="(2\pi,\ 0)"/>。走势口诀「升、峰、降、谷、升」：单调增区间 <Katex tex="\Bigl(-\tfrac{\pi}{2}+2k\pi,\ \tfrac{\pi}{2}+2k\pi\Bigr)" />、单调减区间 <Katex tex="\Bigl(\tfrac{\pi}{2}+2k\pi,\ \tfrac{3\pi}{2}+2k\pi\Bigr)" />，峰谷恰在 <Katex tex="\sin=\pm1"/> 处 —— 也是 U2b 禁区带 <Katex tex="|y|<1"/> 的内缘：<Katex tex="|\sin|\le1"/>，曲线永远出不了那条带。为什么峰在 <Katex tex="\pi/2"/>？单位圆上一眼可见：<Katex tex="\alpha=\pi/2"/> 时纵坐标最长（<Katex tex="=1"/>），此后终边往左转、纵坐标开始缩短 —— 单调性与最值都不必背，圆上现看。五个点之外再加一个检查点（如 <Katex tex="\pi/6"/> 处 <Katex tex="\sin=1/2"/>），波形走样立刻现形。</p>

    <h3 class="sec" id="w1-pit">曲线不是折线</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：五点之间不是直线段。</strong>五点法只定骨架，波形在峰谷附近是<strong>平缓</strong>的（切线放平，V1 变化率视角：峰谷处变化率为 0），连成折线只是草图的记法，不是实际形状。</li>
        <li><strong>提示二：别把 <Katex tex="[0,\pi]"/> 上的拱当半圆。</strong>半圆的顶是尖的、正弦的峰是平的 —— 图 W1 左右共用比例尺，把圆和曲线并排看，一眼可辨。</li>
        <li><strong>提示三：横轴认弧度。</strong><Katex tex="\sin x\approx x"/>（小角近似）只在弧度制下成立；横轴用度时，一切周期换算都会多出 180 的因子（B2 弧度制的便利）。</li>
      </ul>
    </div>
    <p>正弦曲线就此立起。下一章<strong>余弦</strong> —— 它不需要自己的滚动仪式：把正弦曲线<strong>左移 <Katex tex="\pi/2"/></strong> 即得，这是诱导公式 <Katex tex="\sin\Bigl(\tfrac{\pi}{2}+x\Bigr)=\cos x" /> 在图象上的体现。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRoll } from '../../../boards/trig/graph/sineroll.js';
import { W_CHAPTERS } from './wnav.js';
</script>
