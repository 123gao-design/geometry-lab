<template>
  <ChPage :cur="2" no="W2" base="/trig/w" :chapters="W_CHAPTERS"
    title="余弦：平移等价与五点" sub="cos 不需要自己的滚动仪式：把 sin 左移 $\pi/2$ 即得 —— 诱导公式 $\pi/2+\alpha$ 的图象版。五点 $(0,1)\cdot(\pi/2,0)\cdot(\pi,-1)\cdot(3\pi/2,0)\cdot(2\pi,1)$ 与 sin 恰错四分之一周期。"
    :toc="[{ id: 'w2-shift', t: '平移等价：sin 左移 π/2' }, { id: 'w2-five', t: '五点与偶函数' }, { id: 'w2-pit', t: '左移还是右移' }]">
    <div class="note good" id="w2-law"><strong>平移等价</strong>：<Katex tex="\cos x=\sin\Bigl(x+\tfrac{\pi}{2}\Bigr)" />；<strong>余弦函数</strong>：<Katex tex="y=\cos x" />，定义域 <Katex tex="\mathbb{R}" />，值域 <Katex tex="[-1,1]" />，周期 <Katex tex="T=2\pi" />；<strong>五点骨架</strong>：<Katex tex="(0,1),\ \Bigl(\tfrac{\pi}{2},0\Bigr),\ (\pi,-1),\ \Bigl(\tfrac{3\pi}{2},0\Bigr),\ (2\pi,1)" /> —— 峰、降、谷、升、峰；<strong>偶函数</strong>：<Katex tex="\cos(-x)=\cos x" />。</div>
    <ConicFigure number="W2" title="sin 与 cos 的平移关系" head="bottom" :factory="createWave">「五点法」模式亮出 cos 的五个金点；切「平移等价」—— 蓝色 sin 与橙色 cos 同屏，拖 <Katex tex="x_0"/>：蓝点 <Katex tex="(x_0+\pi/2,\ \sin(x_0+\pi/2))"/> 与橙点 <Katex tex="(x_0,\ \cos x_0)"/> <strong>恒等高</strong>，金色虚线就是「左移 <Katex tex="\pi/2"/>」的平移路径。</ConicFigure>

    <h3 class="sec" id="w2-shift">平移等价：sin 左移 π/2</h3>
    <p><RouterLink class="xref" to="/trig/i2">奇变偶不变</RouterLink>的第一行 <Katex tex="\sin\Bigl(\tfrac{\pi}{2}+x\Bigr)=\cos x" /> 在这里从公式变成画面：<strong><Katex tex="\cos" /> 曲线上的每一点，都是 <Katex tex="\sin" /> 曲线上提前 <Katex tex="\pi/2"/> 的那一点</strong>。图 W2 的「平移核验」读数逐点验证 —— 任取 <Katex tex="x_0"/>，<Katex tex="\sin(x_0+\pi/2)"/> 与 <Katex tex="\cos x_0"/> 两个读数恒相等。方向别记反：自变量写成 <Katex tex="x+\pi/2"/>（输入端加、平移方向与加减号相反），曲线反而向<strong>左</strong>平移 <Katex tex="\pi/2"/>。于是 <Katex tex="\cos" /> 的一切性质都可以从 <Katex tex="\sin" /> 平移着读出来：值域 <Katex tex="[-1,1]"/> 不动、周期 <Katex tex="2\pi"/> 不动（平移不变周期），峰谷零点整体提前 <Katex tex="\pi/2"/>。</p>

    <h3 class="sec" id="w2-five">五点与偶函数</h3>
    <p><Katex tex="\cos" /> 的五点 <Katex tex="(0,1),\ \Bigl(\tfrac{\pi}{2},0\Bigr),\ (\pi,-1),\ \Bigl(\tfrac{3\pi}{2},0\Bigr),\ (2\pi,1)" /> 与 <Katex tex="\sin" /> 的五点<strong>错位四分之一周期</strong>：<Katex tex="\sin" /> 的峰 <Katex tex="(\pi/2,\ 1)" /> 向左移到 <Katex tex="\cos" /> 的峰 <Katex tex="(0,\ 1)" /> —— 橙色曲线就是蓝色曲线的左移像，五点也整体平移。另一条身份来自<RouterLink class="xref" to="/trig/i1">诱导公式</RouterLink>的 <Katex tex="-\alpha" /> 组：<Katex tex="\cos(-\alpha)=\cos\alpha" /> —— <strong>偶函数</strong>，曲线关于 <Katex tex="y" /> 轴对称（沿 <Katex tex="y" /> 轴翻折完全重合，见<RouterLink class="xref" to="/functions/s3">奇偶性：镜像折叠</RouterLink>）。图 W2 取景框特意向左多留半格，<Katex tex="y" /> 轴两侧的对称肉眼可验。还有一处对应关系值得指出：<Katex tex="\cos" /> 的零点恰是 <Katex tex="x=\tfrac{\pi}{2}+k\pi" /> —— 正是 <Katex tex="\tan" /> 的断口（<RouterLink class="xref" to="/trig/u1">单位圆定义与三角函数线</RouterLink>转到 <Katex tex="90^\circ" /> 时 <Katex tex="\tan" /> 无定义）。下一章<RouterLink class="xref" to="/trig/w3">正切：断口与周期 π</RouterLink>将看到：<Katex tex="\tan" /> 曲线恰好「从 <Katex tex="\cos" /> 的零点处断开」。</p>

    <h3 class="sec" id="w2-pit">左移还是右移</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="x+\pi/2"/> 是左移。</strong>图象平移方向与输入端的加减号相反：<Katex tex="f(x+\pi/2)"/> 比 <Katex tex="f(x)"/> 提前到达每个函数值，曲线向左平移。写成 <Katex tex="\cos x=\sin\Bigl(x+\tfrac{\pi}{2}\Bigr)" /> 时别把 <Katex tex="\cos" /> 想成「<Katex tex="\sin" /> 右移 <Katex tex="\pi/2"/>」。</li>
        <li><strong>提示二：平移不改变周期与值域。</strong>「<Katex tex="\sin" /> 左移得 <Katex tex="\cos" />」之后周期仍是 <Katex tex="2\pi"/>、值域仍是 <Katex tex="[-1,1]"/> —— 振幅、周期、对称性这些「整条曲线的名称」不变；会变的只有零点、峰谷的<strong>具体位置</strong>。</li>
        <li><strong>提示三：<Katex tex="\cos" /> 不是「只会平移」。</strong>偶函数身份是它自己的（<Katex tex="\sin" /> 是奇函数，平移不出偶性）—— 平移等价与奇偶是两条独立的性质。</li>
      </ul>
    </div>
    <p><Katex tex="\sin" /> 与 <Katex tex="\cos" /> 的对应关系到此讲完。下一章<strong>正切</strong>：商数关系 <Katex tex="\tan=\sin/\cos" /> 上场 —— 曲线在 <Katex tex="\cos" /> 的零点处断成一支一支，周期也只剩一半。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createWave } from '../../../boards/trig/graph/coswave.js';
import { W_CHAPTERS } from './wnav.js';
</script>
