<template>
  <ChPage :cur="1" no="K1" base="/trig/k" :chapters="K_CHAPTERS"
    title="已知值求角与三角方程：把解写成一支家族" sub="$\sin x=t$ 的全部解 = 一窗特解 + 周期延拓：反三角函数报参考角、诱导公式改判第二支、同角关系的象限判定定符号 —— 三步法完成「给值求角」流程。"
    :toc="[{ id: 'k1-steps', t: '三步法：参考角·象限·写族' }, { id: 'k1-geo', t: '图象直译：水平线与曲线相交' }, { id: 'k1-same', t: '同名相等：两支直接写' }, { id: 'k1-sim', t: '联立与换元' }, { id: 'k1-pit', t: '第二支与值域收口' }]">
    <div class="note good" id="k1-def"><strong>三角方程的通解族</strong>：<Katex tex="\sin x=t\ (|t|\le1) \Rightarrow x=\alpha+2k\pi \text{ 或 } x=\pi-\alpha+2k\pi" />（<Katex tex="\alpha=\arcsin t" />）；<Katex tex="\cos x=t \Rightarrow x=\pm\alpha+2k\pi" />（<Katex tex="\alpha=\arccos t" />）；<Katex tex="\tan x=t \Rightarrow x=\alpha+k\pi" />（<Katex tex="\alpha=\arctan t" />，<Katex tex="k\in\mathbb{Z}" />）。图象直译：水平线 <Katex tex="y=t" /> 与曲线相交，每个交点领一支「特解 + 周期·k」的解族。</div>
    <ConicFigure number="K1" title="三角方程的特解与通解" head="bottom" :factory="createLab">用滑块移动水平线 <Katex tex="y=t"/>，交点的横坐标就是方程在 <Katex tex="[0,2\pi)"/> 内的解。正弦与余弦在 <Katex tex="|t|=1"/> 时只有一个窗内解，在 <Katex tex="|t|>1"/> 时无解。切换到正切，观察两个相距 <Katex tex="\pi"/> 的交点如何给出同一支通解。</ConicFigure>

    <h3 class="sec" id="k1-steps">三步法：参考角·象限·写族</h3>
    <p>「给值求角」流程：第一步<strong>定参考角</strong>：<Katex tex="\arcsin|t|" /> 永远给出一个锐角（<RouterLink class="xref" to="/trig/h1">反函数与主值区间</RouterLink>的主值窗就是为它裁的），这个角与象限无关；第二步<strong>定象限</strong>：哪个象限里 <Katex tex="\sin" /> 取这个符号（<RouterLink class="xref" to="/trig/u2">同角三角函数的关系</RouterLink>的象限判定表照抄），<Katex tex="\cos" />、<Katex tex="\tan" /> 各查各的表 —— 一般两个象限合格，各出一支；第三步<strong>写族</strong>：每支特解加周期，<Katex tex="\sin" />、<Katex tex="\cos" /> 加 <Katex tex="2k\pi" />、<Katex tex="\tan" /> 加 <Katex tex="k\pi" />。写族沿用<RouterLink class="xref" to="/trig/b1">任意角与终边</RouterLink>的终边相同角 <Katex tex="\alpha_0+2k\pi"/>。</p>

    <h3 class="sec" id="k1-geo">图象直译：水平线与曲线相交</h3>
    <p>把方程 <Katex tex="\sin x=t" /> 正弦波上画水平线 <Katex tex="y=t" />，交点即解。值域 <Katex tex="[-1,1]" /> 就是解的<strong>存在域</strong> —— <Katex tex="|t|\gt1" /> 时水平线在波峰之上或波谷之下，与曲线没有交点；<Katex tex="|t|=1" /> 时水平线恰在波峰（或波谷）<strong>切线重根</strong>：本该两支的解在此并成一支 <Katex tex="x=\tfrac{\pi}{2}+2k\pi" />（<Katex tex="t=1" />）。窗 <Katex tex="[0,2\pi)" /> 内看到的特解只是「代表」，每支解族 = 特解 + 周期·<Katex tex="k" /> 沿 <Katex tex="x" /> 轴无限延伸 —— <RouterLink class="xref" to="/trig/w1">正弦五点法：单位圆展开</RouterLink>的展开图与<RouterLink class="xref" to="/trig/h1">反函数与主值区间</RouterLink>的同高多角在此合流：波是压缩的终边，交点是同高的角。</p>

    <h3 class="sec" id="k1-same">同名相等：两支直接写</h3>
    <p>已知角求值的逆题型「<Katex tex="\sin x=\sin\alpha" />」不必先算 <Katex tex="t" />：两支直接写 —— <Katex tex="x=\alpha+2k\pi" />（本尊支）与 <Katex tex="x=\pi-\alpha+2k\pi" />（补角支），这正是<RouterLink class="xref" to="/trig/z1">正弦定理与 SSA 解的个数</RouterLink>两解互补 <Katex tex="\gamma_1+\gamma_2=180^\circ" /> 在自变量上的再现，也是<RouterLink class="xref" to="/trig/h2">折叠运算与恒等式</RouterLink>「同高改判」的横波版。同理 <Katex tex="\cos x=\cos\alpha \Rightarrow x=\pm\alpha+2k\pi" />（关于 <Katex tex="y" /> 轴镜像两支）、<Katex tex="\tan x=\tan\alpha \Rightarrow x=\alpha+k\pi" />（周期 <Katex tex="\pi" /> 一支通吃）。检验口诀：把两支各取 <Katex tex="k=0" /> 代回，<Katex tex="\sin" /> 值必须同高 —— 漏了补角支，解集就缺一半。</p>

    <h3 class="sec" id="k1-sim">联立与换元</h3>
    <p>两类进阶题都在前几章已有铺垫。其一<strong>对称式联立</strong>：已知 <Katex tex="\sin x+\cos x=m" /> 求 <Katex tex="\sin x\cdot\cos x" /> —— 平方得 <Katex tex="1+2\sin x\cos x=m^2" />（<RouterLink class="xref" to="/trig/u2">同角三角函数的关系</RouterLink>的平方关系），<Katex tex="m" /> 的范围 <Katex tex="[-\sqrt2,\sqrt2]" /> 由辅助角先收口（<RouterLink class="xref" to="/trig/q2">和差化积与辅助角</RouterLink>）。其二<strong>换元二次</strong>：<Katex tex="2\sin^2x-\sin x-1=0" /> 令 <Katex tex="t=\sin x" /> 得 <Katex tex="2t^2-t-1=0" />，两根 <Katex tex="t=1" />、<Katex tex="t=-\tfrac12" /> 各自回到本讲写族 —— 检验在 <strong><Katex tex="t\in[-1,1]" /></strong>：换元后的方程若有根在界外，那是增根，直接采用就会出错（<RouterLink class="xref" to="/trig/w3">正切：断口与周期 π</RouterLink>的禁区带、<RouterLink class="xref" to="/trig/h1">反函数与主值区间</RouterLink>的超出范围是同一结论）。</p>

    <h3 class="sec" id="k1-pit">第二支与值域收口</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：漏第二支。</strong>写完 <Katex tex="x=\alpha+2k\pi" /> 就结束，忘了 <Katex tex="\pi-\alpha+2k\pi" /> —— <Katex tex="\sin" /> 方程两支是标配（<Katex tex="|t|\lt1" /> 时），卷面常常只剩一半解。</li>
        <li><strong>提示二：周期用错。</strong><Katex tex="\sin" />、<Katex tex="\cos" /> 的族距 <Katex tex="2\pi" />、<Katex tex="\tan" /> 的族距 <Katex tex="\pi" /> —— <Katex tex="\tan" /> 方程写成 <Katex tex="\alpha+2k\pi" /> 直接丢一半根。</li>
        <li><strong>提示三：<Katex tex="|t|\gt1" /> 硬解。</strong><Katex tex="\arcsin(|t|\gt1)" /> 在实数域不存在（<RouterLink class="xref" to="/trig/h1">反函数与主值区间</RouterLink>的超出范围），先查值域再动笔。</li>
        <li><strong>提示四：换元忘收口。</strong>令 <Katex tex="t=\sin x" /> 后 <Katex tex="t" /> 只在 <Katex tex="[-1,1]" /> 活动且回程要对回 <Katex tex="x" /> 写族 —— 只解 <Katex tex="t" /> 不回代、或把界外根照单全收，两头都错。</li>
        <li><strong>提示五：重根当两解。</strong><Katex tex="|t|=1" /> 时判别式视角是二重根，但解族只有一支 —— 写解集按支数报，不按判别式的对照表报。</li>
      </ul>
    </div>
    <p>至此「给值求角」全线贯通。下一章把三角请出考场：实际情境里建模型、配参数、争最值 —— 模块完结。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/synth/solvelab.js';
import { K_CHAPTERS } from './knav.js';
</script>
