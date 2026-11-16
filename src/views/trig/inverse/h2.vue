<template>
  <ChPage :cur="2" no="H2" base="/trig/h" :chapters="H_CHAPTERS"
    title="折叠运算与恒等式：反向代入只认窗内" sub="$\sin(\arcsin x)$ 域内恒真；$\arcsin(\sin\theta)$ 只认主值窗 —— 窗外的角按镜像与整圈平移改判；对偶恒等式 $\arcsin x+\arccos x=\pi/2$ 一行合并。"
    :toc="[{ id: 'h2-back', t: '反向代入恒等式' }, { id: 'h2-fold', t: '周期折叠与三角波' }, { id: 'h2-dual', t: '对偶恒等式' }, { id: 'h2-use', t: '应用：设角与方程求解' }, { id: 'h2-pit', t: '顺手等号与象限端点' }]">
    <div class="note good" id="h2-def"><strong>两个方向不对等</strong>：窗内 <Katex tex="\arcsin(\sin\theta)=\theta" /> 与域内 <Katex tex="\sin(\arcsin x)=x" /> 都恒真；θ 出窗后，<Katex tex="\arcsin(\sin\theta)" /> 按<strong>镜像与整圈平移改判</strong>。对偶恒等式 <Katex tex="\arcsin x+\arccos x=\tfrac\pi2" /> 把两者的关系并成一行。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 H2 · <b>周期折叠机</b>：拖 θ —— 横线 <Katex tex="y=\sin\theta"/> 上同高的角逐个亮出：窗内金点原样返回，窗外空心点全部排除改判；金色<strong>折叠波</strong>把整条正弦波压成 <Katex tex="[-\pi/2,\ \pi/2]"/> 内的三角波（折点恰在 <Katex tex="\pi/2"/> 与 <Katex tex="3\pi/2"/>）。四个预设按钮一键复演「窗内 / 镜像 / 下半岸 / 整圈」四种判读。</div>
    </div>

    <h3 class="sec" id="h2-back">反向代入恒等式</h3>
    <p>先立恒真的一侧：对 <Katex tex="x\in[-1,1]" />，令 <Katex tex="\alpha=\arcsin x" />，则 α 是窗内正弦等于 x 的角，代回 sin 必然吐回原值：</p>
    <p><Katex display tex="\sin(\arcsin x)=x\quad(x\in[-1,1]);\qquad \tan(\arctan x)=x\quad(x\in\mathbb{R})" /></p>
    <p>arctan 的恒等式在全实数范围有效 —— 它的定义域本来就是 ℝ。该式讲「先反代再正代」，回到原值；下面看反方向 —— 先正代再反代 —— 为什么会失效。</p>

    <h3 class="sec" id="h2-fold">周期折叠与三角波</h3>
    <p><Katex tex="\theta\in[-\tfrac\pi2,\ \tfrac\pi2]" /> 时 <Katex tex="\arcsin(\sin\theta)=\theta" /> 原样返回；出窗就得改判 —— 判读三步：<strong>① 找同高候选</strong>（水平线交点，板上逐个亮出）→ <strong>② 只认窗内那个</strong> → <strong>③ 写改判式</strong>（I2 诱导公式当引擎）：</p>
    <p><Katex display tex="\arcsin\!\bigl(\sin\tfrac{2\pi}{3}\bigr)=\pi-\tfrac{2\pi}{3}=\tfrac{\pi}{3}" />（镜像）；<Katex display tex="\arcsin\!\bigl(\sin\tfrac{7\pi}{6}\bigr)=\pi-\tfrac{7\pi}{6}=-\tfrac{\pi}{6}" />（下半岸镜像）；<Katex display tex="\arcsin\!\bigl(\sin\tfrac{5\pi}{3}\bigr)=\tfrac{5\pi}{3}-2\pi=-\tfrac{\pi}{3}" />（整圈平移）</p>
    <p>把每个 θ 都这样过一遍，得到<strong>折叠波</strong> <Katex tex="y=\arcsin(\sin x)" />：周期仍是 2π，但整条被压进 [−π/2, π/2] —— 正弦波折成三角波，W1 的五点法在此变形成「折点法」，折点恰在正弦的峰谷 π/2 与 3π/2 上。同高改判用的恒等式 <Katex tex="\sin(\pi-\theta)=\sin\theta" />、<Katex tex="\sin(\theta-2\pi)=\sin\theta" /> 全是 I2 镜像五组的已有公式。</p>

    <h3 class="sec" id="h2-dual">对偶恒等式</h3>
    <p>arcsin 与 arccos 分同一个定义域 [-1,1]，主值窗拼起来恰是半圆 —— 两者的关系可以并成一行：</p>
    <p><Katex display tex="\arcsin x+\arccos x=\tfrac{\pi}{2}\quad(x\in[-1,1])" /></p>
    <p>推导：令 <Katex tex="\beta=\arccos x\in[0,\pi]" />，则 <Katex tex="\sin(\tfrac\pi2-\beta)=\cos\beta=x" />，且 <Katex tex="\tfrac\pi2-\beta\in[-\tfrac\pi2,\ \tfrac\pi2]" /> 正落在 arcsin 的主值窗内，于是 <Katex tex="\tfrac\pi2-\beta=\arcsin x" />。∎ —— 注意论证里两次用到主值区间：一次判定归属（落在窗内才等于 arcsin），一次定号。</p>
    <p>arctan 有一支带号的对偶：<Katex tex="\tan(\tfrac\pi2-\alpha)=\cot\alpha=\tfrac{1}{\tan\alpha}" />（U2 商数关系的倒数面），于是</p>
    <p><Katex display tex="\arctan x+\arctan\tfrac{1}{x}=\begin{cases}\tfrac{\pi}{2}, & x>0\\[2pt] -\tfrac{\pi}{2}, & x<0\end{cases}" /></p>
    <p><Katex tex="x=0"/> 时 <Katex tex="1/x"/> 排除 —— 恒等式跟着排除；<Katex tex="x<0"/> 取 <Katex tex="-\pi/2"/> 是「落回主值窗」判定的：两角都是负锐角，和只能是负的。</p>

    <h3 class="sec" id="h2-use">应用：设角与方程求解</h3>
    <p><strong>设角不设值</strong>：求 <Katex tex="\tan(\arcsin 0.6)" /> —— 设 <Katex tex="\alpha=\arcsin 0.6" />，则 <Katex tex="\sin\alpha=0.6" />、α∈(0, π/2)，直角三角形现读 <Katex tex="\cos\alpha=0.8" />，故 <Katex tex="\tan\alpha=\tfrac{0.6}{0.8}=0.75" />。复合求值一律设角解三角形，别试图「算出 arcsin 再查表」。</p>
    <p><strong>对偶式一行</strong>：<Katex tex="\arcsin(-\tfrac12)+\arccos(-\tfrac12)=\tfrac\pi2" /> —— 不必分别求值。<strong>解方程的出发点</strong>：<Katex tex="\sin x=\tfrac12" /> 的全部解是 <Katex tex="x=\arcsin\tfrac12+2k\pi" /> 或 <Katex tex="x=\pi-\arcsin\tfrac12+2k\pi" /> —— arcsin 只给「窗内特解」，一族解由镜像与整圈平移生成（本板的改判规则）。这套方法在 K 章综合应用里正式使用。</p>

    <h3 class="sec" id="h2-pit">顺手等号与象限端点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：顺手等号。</strong><Katex tex="\arcsin(\sin\theta)=\theta" /> 只在窗内成立 —— 板上预设 <Katex tex="\theta=2\pi/3"/> 一键验证（得 <Katex tex="\pi/3"/>）。</li>
        <li><strong>提示二：arctan 对偶的号。</strong><Katex tex="x<0"/> 时和是 <Katex tex="-\pi/2"/> 不是 <Katex tex="\pi/2"/>；<Katex tex="x=0"/> 排除。</li>
        <li><strong>提示三：<Katex tex="\sin^{-1}x"/> 再提示一次。</strong>写在分位是倒数 csc x，写在函数位才是 arcsin x —— 语境不清就全写 arcsin。</li>
        <li><strong>提示四：两套值域别混。</strong>折叠波的 <Katex tex="[-\pi/2,\ \pi/2]"/> 是<strong>角</strong>的Range，正弦的 <Katex tex="[-1,1]"/> 是<strong>比值</strong>的Range —— 横轴纵轴是两个不同的量（B2 弧度制的提醒）。</li>
      </ul>
    </div>
    <p>讲完反三角函数，三角函数的方法齐备：给角求值（U/W/F）、给值求角（H）、恒等变形（I/M/N/Q）。下一阶段 Z 解三角形把这套方法用于任意三角形 —— 正弦定理与余弦定理的推导开始。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/inverse/arcfold.js';
import { H_CHAPTERS } from './hnav.js';
</script>
