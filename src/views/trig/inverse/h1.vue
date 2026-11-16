<template>
  <ChPage :cur="1" no="H1" base="/trig/h" :chapters="H_CHAPTERS"
    title="反三角函数：裁出单调段才有反函数" sub="水平线检验出多值 → 裁出单调主值窗 → 关于 y=x 翻折 —— arcsin、arccos、arctan 三个函数的主值区间、定义域与图象一次对齐。"
    :toc="[{ id: 'h1-why', t: '水平线检验：多值不配反函数' }, { id: 'h1-window', t: '三个主值窗的对照' }, { id: 'h1-graph', t: '翻折图象与定义域值域互换' }, { id: 'h1-domain', t: '恒等式：sin(arcsin x)' }, { id: 'h1-pit', t: '记号、排除与主值区间' }]">
    <div class="note good" id="h1-def"><strong>反三角函数三步走</strong>：① <strong>检验</strong> —— sin、cos、tan 的整条波过不了水平线检验（一个高度相交得到多个角），多值，不配反函数；② <strong>裁剪</strong> —— 各裁一段单调段作<strong>主值区间</strong>：arcsin 取 <Katex tex="[-\tfrac\pi2,\ \tfrac\pi2]" />、arccos 取 <Katex tex="[0,\ \pi]" />、arctan 取 <Katex tex="(-\tfrac\pi2,\ \tfrac\pi2)" />；③ <strong>翻折</strong> —— 主值段关于 <Katex tex="y=x" /> 的镜像就是反函数图象，定义域与值域互换。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 H1 · <b>主值区间机</b>：拖探针 t —— 左栏水平线 y=t 在全波上相交得到的每个交点都是一个「同高角」，主值窗（金带）内的金点才是 arcsin 认可的那个；右栏主值段关于 y=x 翻折出反函数曲线，蓝带压<strong>定义域</strong>、金带压<strong>值域</strong>。三个模式按钮切换三个函数；|t|&gt;1 时探针现场<strong>排除</strong>，arctan 的定义域是全体实数、永不排除。</div>
    </div>

    <h3 class="sec" id="h1-why">水平线检验：多值不配反函数</h3>
    <p>C1 立过规矩：函数要求<strong>单值</strong> —— 一个输入只准有一个输出。反着走（给输出问输入）同样要单值：<Katex tex="\sin0.6=\sin(\pi-0.6)" />，输出 0.6 有两个候选输入，逆对照表就「一对多」了。几何上这正是一条水平线与正弦波相交得到多个交点 —— 板上探针拖到 t=0.6，左栏全波同高两点（窗内 0.64、窗外 2.50），多值现形。<strong>严格单调的函数才拥有反函数</strong>（S1 的判据在此反向使用）：单调段上一个高度只相交一个点，逆对照表才能重排成函数。</p>

    <h3 class="sec" id="h1-window">三个主值窗的对照</h3>
    <table>
      <tr><td>反函数</td><td>主值区间（值域）</td><td>单调性</td><td>定义域</td></tr>
      <tr><td>y = arcsin x</td><td><Katex tex="[-\tfrac\pi2,\ \tfrac\pi2]" /></td><td>升</td><td><Katex tex="[-1,\ 1]" /></td></tr>
      <tr><td>y = arccos x</td><td><Katex tex="[0,\ \pi]" /></td><td>降</td><td><Katex tex="[-1,\ 1]" /></td></tr>
      <tr><td>y = arctan x</td><td><Katex tex="(-\tfrac\pi2,\ \tfrac\pi2)" /></td><td>升</td><td><Katex tex="\mathbb{R}" /></td></tr>
    </table>
    <p>窗口这样选有三条理由：<strong>覆盖</strong>（[-1,1] 里的每个值都要有对应的角，段不能裁短）、<strong>连续</strong>（段内不能有间断）、<strong>约定</strong>（取包含锐角、贴近原点的一段）。cos 的窗不对称是「约定俗成」的典型例子 —— cos 在 [0, π] 单调降、覆盖 [-1,1]，换别段也自洽，但统一约定为 [0, π]。arctan 的窗端点取不到：那是两条渐近线 <Katex tex="y=\pm\tfrac\pi2" />，曲线无限接近、永远取不到（W3 断口翻折后的像）。</p>

    <h3 class="sec" id="h1-graph">翻折图象与定义域值域互换</h3>
    <p>主值段上每点 <Katex tex="(x,\ \sin x)" /> 的镜像是 <Katex tex="(\sin x,\ x)" /> —— 横纵对调，这正是 E6 指对反演镜的同一条金折缝。翻折带来一组对调关系：<strong>母函数的值域 = 反函数的定义域</strong>（sin 的输出 [-1,1] 变成 arcsin 的输入），<strong>主值区间 = 反函数的值域</strong>。板上右栏两条色带把这组关系标在坐标轴上：蓝带压 x 轴（定义域）、金带压 y 轴（值域），arctan 模式下蓝带拉通全幅 —— 定义域是 ℝ。</p>

    <h3 class="sec" id="h1-domain">恒等式：sin(arcsin x)</h3>
    <p>从 x 出发正向代入：<Katex tex="\alpha=\arcsin x" /> 意思是「窗内那个正弦等于 x 的角」，再代入 sin 自然返回原值：<Katex tex="\sin(\arcsin x)=x\quad(x\in[-1,1])" />。板上「正向核验」徽章实时验证这步；<strong>|x|&gt;1 时该式不成立</strong> —— x 根本不在定义域里，徽章显示排除。反方向 <Katex tex="\arcsin(\sin\theta)=\theta" /> 却不总成立 —— 那是下一讲的主题。</p>

    <h3 class="sec" id="h1-pit">记号、排除与主值区间</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\sin^{-1}x"/> 的记号歧义。</strong>教材里的 <Katex tex="\sin^{-1}x"/> 是 arcsin x，不是 <Katex tex="\tfrac{1}{\sin x}" />（那是 csc x —— U2 倒数函数的内容）；怕歧义一律写 arcsin。</li>
        <li><strong>提示二：先查定义域。</strong><Katex tex="|x|>1"/> 直接排除，无需再算 —— 板上探针拉过 1 就显示排除。</li>
        <li><strong>提示三：主值区间用错。</strong>arccos 的主值窗是 <Katex tex="[0,\ \pi]"/>（单调降），不要误写成对称区间；arctan 是开区间，端点永远取不到。</li>
        <li><strong>提示四：计算器单位。</strong>DEG/RAD 先对准 —— 主值区间里的数字全按弧度记录（B2 的约定）。</li>
      </ul>
    </div>
    <p>反函数立好规矩后，下一讲把 <Katex tex="\arcsin(\sin\theta)" /> 拖到窗外受审 —— 镜像改判、整圈平移，折叠波把整条正弦波压成一条三角波。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/inverse/arcgate.js';
import { H_CHAPTERS } from './hnav.js';
</script>
