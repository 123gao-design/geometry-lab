<template>
  <ChPage :cur="1" no="K1" base="/trig/k" :chapters="K_CHAPTERS"
    title="已知值求角与三角方程：把解写成一支家族" sub="sin x = t 的全部解 = 一窗特解 + 周期延拓：H 的反三角报参考角，I 的诱导改判第二支，U 的象限判定定符号 —— 三步法完成「给值求角」流程。"
    :toc="[{ id: 'k1-steps', t: '三步法：参考角·象限·写族' }, { id: 'k1-geo', t: '图象直译：水平线与曲线相交' }, { id: 'k1-same', t: '同名相等：两支直接写' }, { id: 'k1-sim', t: '联立与换元' }, { id: 'k1-pit', t: '第二支与值域收口' }]">
    <div class="note good" id="k1-def"><strong>三角方程的通解族</strong>：<Katex tex="\sin x=t\ (|t|\le1) \Rightarrow x=\alpha+2k\pi \text{ 或 } x=\pi-\alpha+2k\pi" />（<Katex tex="\alpha=\arcsin t" />）；<Katex tex="\cos x=t \Rightarrow x=\pm\alpha+2k\pi" />（<Katex tex="\alpha=\arccos t" />）；<Katex tex="\tan x=t \Rightarrow x=\alpha+k\pi" />（<Katex tex="\alpha=\arctan t" />，<Katex tex="k\in\mathbb{Z}" />）。图象直译：水平线 <Katex tex="y=t" /> 与曲线相交，每个交点领一支「特解 + 周期·k」的解族。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 K1 · <b>方程解机</b>：<strong>三模式拨 sin/cos/tan</strong>，左栏金色水平线 <Katex tex="y=t"/> 与曲线相交出窗 <Katex tex="[0,2\pi)"/> 全部特解；<strong><Katex tex="|t|>1"/> 超出范围</strong>（红线标出 <Katex tex="\pm1"/>，界外无解）、<strong><Katex tex="|t|=1"/> 切线重根</strong>两支并一；右栏特解列表（<Katex tex="\pi/12"/> 约分）与通解两条通解表达式实时列出。</div>
    </div>

    <h3 class="sec" id="k1-steps">三步法：参考角·象限·写族</h3>
    <p>「给值求角」不是背答案，是流程。第一步<strong>定参考角</strong>：<Katex tex="\arcsin|t|" /> 永远给出一个锐角（H1 的主值窗就是为它裁的），这个角与象限无关；第二步<strong>定象限</strong>：哪个象限里 sin 取这个符号（U2 的象限判定表照抄），cos、tan 各查各的表 —— 一般两个象限合格，各出一支；第三步<strong>写族</strong>：每支特解加周期，sin/cos 加 <Katex tex="2k\pi" />、tan 加 <Katex tex="k\pi" />。三步各回收一章：参考角由 H1 的主值窗给出，象限由 U2 的判定表给出，写族沿用 B1 的终边相同角 <Katex tex="\alpha_0+2k\pi"/>。</p>

    <h3 class="sec" id="k1-geo">图象直译：水平线与曲线相交</h3>
    <p>把方程 <Katex tex="\sin x=t" /> 画出来就是一句话：正弦波上画水平线 <Katex tex="y=t" />，交点即解。值域 [−1,1] 就是解的<strong>存在域</strong> —— |t|&gt;1 时水平线浮在波峰之上，一个交点都没有（板上画成排除虚线）；|t|=1 时水平线恰在波峰（或波谷）<strong>切线重根</strong>：本该两支的解在此并成一支 <Katex tex="x=\tfrac{\pi}{2}+2k\pi" />（t=1）。窗 [0,2π) 内看到的特解只是「代表」，每支解族 = 特解 + 周期·k 沿 x 轴无限延伸 —— W1 的展开图与 H1 的同高多角在此合流：波是压缩的终边，交点是同高的角。</p>

    <h3 class="sec" id="k1-same">同名相等：两支直接写</h3>
    <p>已知角求值的逆题型「<Katex tex="\sin x=\sin\alpha" />」不必先算 t：两支直接写 —— <Katex tex="x=\alpha+2k\pi" />（本尊支）与 <Katex tex="x=\pi-\alpha+2k\pi" />（补角支），这正是 Z1 两解互补 γ₁+γ₂=180° 在自变量上的再现，也是 H2 折叠机「同高改判」的横波版。同理 <Katex tex="\cos x=\cos\alpha \Rightarrow x=\pm\alpha+2k\pi" />（关于 y 轴镜像两支）、<Katex tex="\tan x=\tan\alpha \Rightarrow x=\alpha+k\pi" />（周期 π 一支通吃）。检验口诀：把两支各取 k=0 代回，sin 值必须同高 —— 漏了补角支，解集就缺一半。</p>

    <h3 class="sec" id="k1-sim">联立与换元</h3>
    <p>两类进阶题都在前几章已有铺垫。其一<strong>对称式联立</strong>：已知 <Katex tex="\sin x+\cos x=m" /> 求 sin x·cos x —— 平方得 <Katex tex="1+2\sin x\cos x=m^2" />（U2 的平方关系），m 的范围 <Katex tex="[-\sqrt2,\sqrt2]" /> 由辅助角先收口（Q2）。其二<strong>换元二次</strong>：<Katex tex="2\sin^2x-\sin x-1=0" /> 令 <Katex tex="t=\sin x" /> 得 2t²−t−1=0，两根 t=1、<Katex tex="t=-\tfrac12" /> 各自回到本讲写族 —— 检验在 <strong>t∈[−1,1]</strong>：换元后的方程若有根在界外，那是增根，直接采用就会出错（W3 的禁区带、H1 的超出范围是同一结论）。</p>

    <h3 class="sec" id="k1-pit">第二支与值域收口</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：漏第二支。</strong>写完 <Katex tex="x=\alpha+2k\pi" /> 就结束，忘了 <Katex tex="\pi-\alpha+2k\pi" /> —— sin 方程两支是标配（|t|&lt;1 时），卷面常常只剩一半解。</li>
        <li><strong>提示二：周期用错。</strong>sin/cos 的族距 2π、tan 的族距 π —— tan 方程写成 <Katex tex="\alpha+2k\pi" /> 直接丢一半根。</li>
        <li><strong>提示三：|t|&gt;1 硬解。</strong>asin(|t|&gt;1) 在实数域不存在（H1 超出范围），先查值域再动笔。</li>
        <li><strong>提示四：换元忘收口。</strong>令 t=sin x 后 t 只在 [−1,1] 活动且回程要对回 x 写族 —— 只解 t 不回代、或把界外根照单全收，两头都错。</li>
        <li><strong>提示五：重根当两解。</strong>|t|=1 时判别式视角是二重根，但解族只有一支 —— 写解集按支数报，不按判别式的对照表报。</li>
      </ul>
    </div>
    <p>至此「给值求角」全线贯通。下一章把三角请出考场：实际情境里建模型、配参数、争最值 —— 模块完结。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/synth/solvelab.js';
import { K_CHAPTERS } from './knav.js';
</script>
