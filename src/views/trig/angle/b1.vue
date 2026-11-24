<template>
  <ChPage :cur="1" no="B1" base="/trig/b" :chapters="B_CHAPTERS"
    title="任意角与终边：正负与 $2k\pi$" sub="三角函数的第一步不是函数，是角本身：把「一条射线绕端点旋转」定义为角 —— 逆时针为正、顺时针为负、转多少圈都记录。终边相同角 $\alpha+2k\pi$ 是全部三角符号系统的起点。"
    :toc="[{ id: 'b1-why', t: '角为什么要推广' }, { id: 'b1-same', t: '终边相同角：2kπ 的对照表' }, { id: 'b1-pit', t: '象限角与轴线角' }]">
    <div class="note good" id="b1-law"><strong>任意角</strong>：射线绕端点旋转所成的角，<strong>始边</strong>、<strong>终边</strong>与<strong>旋转方向</strong>三要素齐 —— 逆时针转为正角、顺时针转为负角、转过的圈数照单全收。<strong>终边相同</strong>：<Katex tex="\beta=\alpha+2k\pi\ (k\in\mathbb{Z})" /> —— 终边重合的角相差周角的整数倍，一差就是一整族。</div>
    <ConicFigure number="B1" title="角的终边与累计旋转" head="bottom" :factory="createRotor">拖动圆上把手旋转，转过一圈读数继续累加，金色螺旋扫痕把走过的角度记录下来；①..④ 四个预设把「<Katex tex="30^\circ" /> 的相关角」一次摆齐 —— 终边重合、角度不同。</ConicFigure>

    <h3 class="sec" id="b1-why">角为什么要推广</h3>
    <p>初中只认 <Katex tex="0^\circ" /> 到 <Katex tex="360^\circ" />，够量三角形内角，不够量<strong>转</strong>：车轮转两圈、螺丝拧一圈半、体操转体 <Katex tex="1080^\circ" />、时钟倒拨 —— 都是真实的角度，却都在 <Katex tex="360^\circ" /> 之外或 <Katex tex="0^\circ" /> 之下。图 B1 把「角」还原成本来的样子：<strong>一段旋转量</strong>，不是一副静止的图形。拖动把手转圈，角度读数一直涨 —— <Katex tex="390^\circ" /> 真实地比 <Katex tex="30^\circ" /> 多转了一整圈，尽管终边看起来重合；反向拖动则记为负值，<Katex tex="-330^\circ" /> 是顺时针转了 <Katex tex="330^\circ" />。螺旋扫痕一圈圈向内缩进，就是为了把「转过几圈」这件事画在图上。</p>

    <h3 class="sec" id="b1-same">终边相同角：2kπ 的对照表</h3>
    <p>预设 ②③④ 是同一条终边上的三个角：<Katex tex="390^\circ=30^\circ+360^\circ" />、<Katex tex="-330^\circ=30^\circ-360^\circ" />、<Katex tex="750^\circ=30^\circ+2\times360^\circ" /> —— 转角读数把它们统一记成「<Katex tex="k" /> 个整圈 + 余 <Katex tex="30^\circ" />」。写成集合语言（描述法见<RouterLink class="xref" to="/sets/j2">集合的表示：列举、描述与图示</RouterLink>）：与 30° 终边相同的角全体是 <Katex tex="\{\beta\mid\beta=30^\circ+k\cdot360^\circ,\ k\in\mathbb{Z}\}" /> —— 终边定得住，角却有无穷多个。由此得到判断<strong>象限角</strong>的通用步骤：先减整圈化回 <Katex tex="[0^\circ,360^\circ))" /> 的余数，再判断终边落在第几象限 —— <Katex tex="750^\circ" /> 减两个整圈余 <Katex tex="30^\circ" />，第一象限；不必直接用 <Katex tex="750" /> 相除。注意反方向的关系同样成立：负角 <Katex tex="-330^\circ" /> 加一个 <Katex tex="360^\circ" /> 立刻回到 <Katex tex="30^\circ" />，「先化正、再判象限」是负角的标准步骤。</p>

    <h3 class="sec" id="b1-pit">象限角与轴线角</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：轴线角不属于任何象限。</strong><Katex tex="90^\circ,180^\circ,270^\circ,0^\circ" /> 的终边压在坐标轴上，板上判读写明「不属于任何象限」—— 选择题里「第二象限角」不含 <Katex tex="90^\circ" /> 本身，端点处单独处理（区间开闭的判法见<RouterLink class="xref" to="/sets/y4">数轴上的运算：解集实战</RouterLink>）。</li>
        <li><strong>提示二：「小于 <Katex tex="90^\circ" /> 的角」不是「锐角」。</strong>锐角限 <Katex tex="(0^\circ,90^\circ)" />，而任意角世界里 <Katex tex="-30^\circ" />、<Katex tex="-300^\circ" /> 都小于 <Katex tex="90^\circ" />。</li>
        <li><strong>提示三：顺时针为负。</strong>时钟、方向盘倒打都是负角——分针一小时走 <Katex tex="-360^\circ" />（下一章换算成 <Katex tex="-2\pi" />）。</li>
        <li><strong>提示四：判象限先减整圈，别用 <Katex tex="750" /> 直接比。</strong>「终边相同」是唯一合法的化简依据，直觉比较数值大小会出错。</li>
      </ul>
    </div>
    <p>角已经可以从零一直记到任意远，下一章给这些角换一套更自然的<strong>度量衡</strong>：不再把圆切成 360 份，而是用弧长本身量角 —— 弧度制。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRotor } from '../../../boards/trig/angle/rotator.js';
import { B_CHAPTERS } from './bnav.js';
</script>
