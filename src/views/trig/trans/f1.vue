<template>
  <ChPage :cur="1" no="F1" base="/trig/f" :chapters="F_CHAPTERS"
    title="三旋钮：$y=A\sin(\omega x+\varphi)$" sub="振幅 $A$ 管值域、角频率 $\omega$ 管周期、相位 $\varphi$ 管起点 —— 三个旋钮各管一件事，互不干扰；母波 $\sin x$ 现场被加工。"
    :toc="[{ id: 'f1-knobs', t: '三旋钮各管一件事' }, { id: 'f1-read', t: '值域、周期、起点的现场核验' }, { id: 'f1-g', t: '与 G 系图象变换的回收' }, { id: 'f1-pit', t: '平移量要除以 ω' }]">
    <div class="note good" id="f1-law"><strong>三旋钮一览</strong>：在 <Katex tex="y=A\sin(\omega x+\varphi)" /> 中 —— <strong>A</strong> 定<strong>振幅</strong>，值域 <Katex tex="[-A,\ A]" />；<strong>ω</strong> 定<strong>周期</strong> <Katex tex="T=\tfrac{2\pi}{\omega}" />；<strong>φ</strong> 定<strong>起点</strong>（升段过零点）<Katex tex="x_0=-\tfrac{\varphi}{\omega}" />。三个旋钮各管一件事、互不替代。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 F1 · <b>A、ω、φ 对波形的影响</b>：拖 A、ω、φ 三个滑块 —— <strong>值域带</strong>（y 轴金带）随 A 变宽、<strong>周期段</strong>（x 轴上金虚线）随 ω 伸缩、<strong>五点整体</strong>随 φ 平移；母波 sin x 的灰虚线是「加工前」的对照，三个读数徽章与三件实物一一对应。</div>
    </div>

    <h3 class="sec" id="f1-knobs">三旋钮各管一件事</h3>
    <p><strong>拖 A：波形整体拉高压扁</strong>，周期与起点纹丝不动 —— 值域从 [−1,1] 变成 [−A,A]，峰谷的虚线导轨跟着 A 走。负振幅呢？那是<strong>翻折</strong>（G2 的「负号自带镜像」）：y=−sin x 是 sin x 关于 x 轴的镜像，等价于把相位加上 π（I1 镜像组的回收）—— 本台把 A 限在正数，翻折留给 F2 的反演去验。</p>
    <p><strong>拖 ω：波变密变疏。</strong><Katex tex="\omega>1"/> 周期变短（横坐标压缩为 <Katex tex="1/\omega"/>，正是 G2 的 a 旋钮）；<Katex tex="\omega=2"/> 时一屏挤下两倍频率。「角频率」的名字来自 B2 弧度制：<Katex tex="\omega"/> 是单位时间转过的<strong>弧度数</strong>，<Katex tex="T=2\pi/\omega"/> 就是「转一整圈要多久」—— 分母越大，一圈越快。</p>
    <p><strong>拖 φ：波形整体平移</strong>，形状不变。<Katex tex="\varphi>0"/> 曲线<strong>左移</strong>（G1 的输入端补偿：把 <Katex tex="x=-\varphi/\omega"/> 处的输入读成原来 <Katex tex="x=0"/> 的输出），起点移到 <Katex tex="x_0=-\varphi/\omega"/>。按预设 <Katex tex="y=\sin\bigl(x+\tfrac{\pi}{2}\bigr)" /> 一键复现 W2：余弦 = 起点移到 <Katex tex="-\pi/2"/> 的正弦 —— 板上解析式徽章此时显示的就是它。</p>

    <h3 class="sec" id="f1-read">值域、周期、起点的现场核验</h3>
    <p>板上三个读数与三件实物一一对应：徽章 <Katex tex="T=\tfrac{2\pi}{\omega}" /> ↔ 周期段的长短；<Katex tex="y\in[-A,\ A]" /> ↔ y 轴值域带的宽窄；<Katex tex="x_0=-\tfrac{\varphi}{\omega}" /> ↔ 升段过零点的金点。做题时<strong>由图读参</strong>，走的正是这条核验线的反向：量出峰高 → A；量出周期 → <Katex tex="\omega=\tfrac{2\pi}{T}" />；找出升段过零点 → <Katex tex="\varphi=-\omega x_0" />。F2 的「由图反演」就是这三步的实战演习。</p>
    <p>五点法的回收：W1 的五点骨架在 F1 里被三旋钮<strong>整体加工</strong> —— 五点从 <Katex tex="(0,0)"/>、<Katex tex="(\pi/2,\ 1)"/>、<Katex tex="(\pi,\ 0)"/>、<Katex tex="(3\pi/2,\ -1)"/>、<Katex tex="(2\pi,\ 0)"/> 变成 <Katex tex="(x_0,0),\ \bigl(x_0+\tfrac{T}{4},A\bigr),\ \bigl(x_0+\tfrac{T}{2},0\bigr),\ \bigl(x_0+\tfrac{3T}{4},-A\bigr),\ (x_0+T,0)" />，一档走势「升、峰、降、谷、升」原样保留。画 <Katex tex="y=A\sin(\omega x+\varphi)"/> 的草图，就是先把五点「平移 + 伸缩」再连线。</p>

    <h3 class="sec" id="f1-g">与 G 系图象变换的回收</h3>
    <p>G1 平移读写机的「输入端补偿」在这里现形：φ 旋钮就是 <Katex tex="x+h"/>（<Katex tex="h=\varphi/\omega"/>，加在输入上、曲线反而左移）；G2 伸缩翻折机的 <Katex tex="b\,f(ax)" /> 在这里拆成两个旋钮 —— <Katex tex="A"/> 是纵向的 <Katex tex="b"/>、<Katex tex="\omega"/> 是横向的 <Katex tex="1/a"/>。三角函数的图象变换<strong>不是一套新规则</strong>，是 G 系规则套上周期原图。唯一的新事务：底波是周期的，所以「本质位移」要按周期折算 —— <Katex tex="\sin(x+\pi)" /> 与 <Katex tex="\sin x"/> 平移了半圈周期，图上完全重合（I1 旋转整圈的极端版）。</p>

    <h3 class="sec" id="f1-pit">平移量要除以 ω</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：平移量必须看 x 的系数。</strong><Katex tex="y=\sin\bigl(2x+\tfrac{\pi}{3}\bigr)" /> 的起点是 <Katex tex="-\tfrac{\pi}{6}" />（把 2 提进括号：<Katex tex="\sin\bigl(2(x+\tfrac{\pi}{6})\bigr)" />），不是 <Katex tex="-\pi/3"/> —— <Katex tex="\varphi"/> 是「相位」，不是「平移量」；平移量 <Katex tex="=\varphi/\omega"/>。</li>
        <li><strong>提示二：A 与 T 无关。</strong>常见错觉「振幅大周期长」—— 板上拖 A，周期段纹丝不动；振幅管高矮、周期管疏密，两套度量互不相干。</li>
        <li><strong>提示三：起点认「升段」。</strong><Katex tex="x_0"/> 指波形<strong>上升时</strong>穿过 x 轴的点；取成降段零点，<Katex tex="\varphi"/> 会差一个 <Katex tex="\pi"/> —— 板上五点中的起点金点始终取升段。</li>
      </ul>
    </div>
    <p>三旋钮各就各位。下一讲处理真正的刺头：<strong>变换的顺序</strong> —— 同一个 φ，先压缩后平移与先平移后压缩，平移量不同；以及反过来，从一张图把 A、ω、φ 全部「读」出来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/trans/sinlab.js';
import { F_CHAPTERS } from './fnav.js';
</script>
