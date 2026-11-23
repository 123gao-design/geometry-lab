<template>
  <ChPage :cur="1" no="V1" base="/functions/v" :chapters="V_CHAPTERS"
    title="割线与切线：导数的诞生" sub="两点趋向同一点且割线斜率有极限时，这个极限就是导数。"
    :toc="[{ id: 'v1-def', t: '定义与记号：一切由极限定义' }, { id: 'v1-basic', t: '用定义推常见函数的导数' }, { id: 'v1-mean', t: '几何与物理双解说' }, { id: 'v1-pit', t: '0/0、左右与存在性' }]">
    <div class="note good" id="v1-law"><strong>导数定义</strong>：函数 <Katex tex="y=f(x)"/> 在 <Katex tex="x_0"/> 处的导数 <Katex tex="f'(x_0)=\lim_{\Delta x\to 0}\dfrac{f(x_0+\Delta x)-f(x_0)}{\Delta x}" /> —— 当极限存在时，称 f 在 <Katex tex="x_0"/> 处<strong>可导</strong>。平均变化率的极限 = 瞬时变化率；割线斜率的极限 = 切线斜率。</div>
    <div class="board-wrap">
      <BoardMount :factory="createTan" />
      <div class="cap">图 V1 · <b>割线趋于切线</b>。从正负两侧缩小 Δx，对比割线和切线。Δx=0 时割线与差商退出，切线保留作极限参照。</div>
    </div>

    <h3 class="sec" id="v1-def">定义与记号：一切由极限定义</h3>
    <p>以 <Katex tex="f(x)=x^2" /> 和 <Katex tex="x_0=1" /> 为例，对非零的 <Katex tex="\Delta x" />，差商等于 <Katex tex="2+\Delta x" />。当 <Katex tex="\Delta x=0.05" /> 时，割线斜率为 2.05。把横坐标增量从正侧或负侧缩小，差商都趋于 2。</p>
    <p>记号两套并记：<Katex tex="f'(x_0)" />（拉格朗日）与 <Katex tex="\dfrac{\mathrm{d}y}{\mathrm{d}x}\Big|_{x=x_0}" />（莱布尼茨，大学主用）。用定义验算一次最踏实：<Katex tex="f=x^3" /> 在 1 处，比值 <Katex tex="\dfrac{(1+\Delta x)^3-1}{\Delta x}=3+3\Delta x+(\Delta x)^2\to 3" />，与「<Katex tex="f'=3x^2"/> 代入 <Katex tex="x=1"/>」完全重合 —— 图 V1 的第二原图现场核验。</p>

    <h3 class="sec" id="v1-basic">用定义推常见函数的导数</h3>
    <p>定义不是摆设 —— 一批基本函数的导数直接就能推出来，推过一遍，公式就不是死记的，而是由定义直接导出的：</p>
    <p><strong>常数与一次</strong>：<Katex tex="(c)'=\lim_{\Delta x\to0}\dfrac{c-c}{\Delta x}=0" />（纹丝不动）、<Katex tex="(x)'=\lim_{\Delta x\to0}\dfrac{(x+\Delta x)-x}{\Delta x}=1" />（走多快算多快）。</p>
    <p><strong>二次</strong>（图 V1 原图①，<Katex tex="x_0=1"/> 的核验就是它）：<Katex tex="(x^2)'=\lim_{\Delta x\to0}\dfrac{(x+\Delta x)^2-x^2}{\Delta x}=\lim_{\Delta x\to0}(2x+\Delta x)=2x" /> —— 展开约去 <Katex tex="\Delta x"/>，极限只剩<strong>线性主部</strong>（V2 的记录语言提前报到）。</p>
    <p><strong>倒数</strong>（x≠0，通分即可）：<Katex tex="\Bigl(\dfrac{1}{x}\Bigr)'=\lim_{\Delta x\to0}\dfrac{1}{\Delta x}\cdot\dfrac{-\Delta x}{x(x+\Delta x)}=\lim_{\Delta x\to0}\dfrac{-1}{x(x+\Delta x)}=-\dfrac{1}{x^2}" /></p>
    <p><strong>根式</strong>（x&gt;0，关键是分子有理化）：<Katex tex="(\sqrt{x})'=\lim_{\Delta x\to0}\dfrac{\sqrt{x+\Delta x}-\sqrt{x}}{\Delta x}=\lim_{\Delta x\to0}\dfrac{1}{\sqrt{x+\Delta x}+\sqrt{x}}=\dfrac{1}{2\sqrt{x}}" /></p>
    <p>并排看三张结果 —— <Katex tex="x^2\to 2x"/>、<Katex tex="1/x\to -x^{-2}"/>、<Katex tex="\sqrt{x}\to\tfrac{1}{2}x^{-1/2}"/>：导数都是把指数拉下来一格、指数减一。这不是巧合，是幂函数通式 <Katex tex="(x^\alpha)'=\alpha x^{\alpha-1}" /> 的三个现场样本；图 V1 原图②的 <Katex tex="x^3/3" /> 求导得 <Katex tex="x^2"/>，正是通式的逆向使用。</p>
    <p><strong>推不动的怎么办</strong>：<Katex tex="e^x"/>、<Katex tex="\ln x"/>、<Katex tex="\sin x"/> 的导数光靠这套代数推不出来 —— 需要 e 的极限语言（<Katex tex="\lim(1+\tfrac{1}{n})^n" />、<Katex tex="\lim\tfrac{\sin x}{x}" />），高中先按公式使用；V6 讲泰勒展开时会正式给出 e 的两种表达 —— <Katex tex="e^x"/> 的展开系数全为 <Katex tex="1/k!"/>，正因为它求导后形式不变。速查（E4/E5 已见过图象证据，此处合并记录）：<Katex tex="(e^x)'=e^x" />、<Katex tex="(a^x)'=a^x\ln a" />、<Katex tex="(\ln x)'=\dfrac{1}{x}" />、<Katex tex="(\sin x)'=\cos x" />、<Katex tex="(\cos x)'=-\sin x" />。</p>

    <h3 class="sec" id="v1-mean">几何与物理双解说</h3>
    <p><strong>几何解说</strong>：<Katex tex="f'(x_0)"/> = 切线斜率。S2 从第一讲就在用这个事实给曲线染色，现在它得到正式论证 —— S2 的判据「<Katex tex="f'>0\Rightarrow"/> 增」、R4 的牛顿法迭代 <Katex tex="x_{n+1}=x_n-\dfrac{f(x_n)}{f'(x_n)}" />（每步都在切线上找落点）、E4/E5 的「增长率徽章」全部回溯到这一条极限定义。</p>
    <p><strong>物理解说</strong>：位移 s(t) 的平均变化率是平均速度，Δt→0 的极限是瞬时速度 <Katex tex="v(t)=s'(t)" />。伽利略的斜面实验早就暗示了它：越落越快，而「快慢本身」在每一刻都有一个定数 —— 那个数就是导数。平均与瞬时的差距，正是割线与切线的差距。</p>

    <h3 class="sec" id="v1-pit"><Katex tex="0/0"/>、左右与存在性</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把导数当「<Katex tex="\Delta x=0"/> 时代值」。</strong>定义是极限，不是代入 —— 图 V1 拖到 <Katex tex="\Delta x=0"/> 割线直接排除，这正是设计意图。</li>
        <li><strong>提示二：只看一侧。</strong>左极限与右极限不等则导数不存在：<Katex tex="f=|x|"/> 在 0 处左割线斜率 −1、右 +1，图象上是折角 —— <strong>可导 <Katex tex="\Rightarrow"/> 连续，连续不保证可导</strong>（R1 的二重零点、E8 的折叠点都是折角高发区）。</li>
        <li><strong>提示三：切线可以穿过曲线。</strong>切线的定义是「割线的极限」，不是「只碰一下」—— V4 的 <Katex tex="x^3" /> 会演示切线两侧穿越。</li>
      </ul>
    </div>
    <p>下一讲把「一个点的导数」扩展成「一条导函数」，四则运算法则是第一批工具 —— 图 V2 用一块面积的增量分解把乘法法则推出来，不必死背。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTan } from '../../../boards/functions/calculus/sectan.js';
import { V_CHAPTERS } from './vnav.js';
</script>
