<template>
  <ChPage :cur="1" no="Q1" base="/trig/q" :chapters="Q_CHAPTERS"
    title="积化和差：加减消元" sub="四个「积」全部由和差公式的两行同加减读出 —— 积化和差不是新公式，是和差公式的消元术。"
    :toc="[{ id: 'q1-derive', t: '两行加减出四个积' }, { id: 'q1-table', t: '四条公式的记法' }, { id: 'q1-use', t: '用途：化乘为加' }, { id: 'q1-pit', t: '½ 漏乘与名称改变' }]">
    <div class="note good" id="q1-law"><strong>积化和差四式</strong>：<Katex tex="\sin\alpha\cos\beta=\tfrac12[\sin(\alpha+\beta)+\sin(\alpha-\beta)]" />；<Katex tex="\cos\alpha\sin\beta=\tfrac12[\sin(\alpha+\beta)-\sin(\alpha-\beta)]" />；<Katex tex="\cos\alpha\cos\beta=\tfrac12[\cos(\alpha+\beta)+\cos(\alpha-\beta)]" />；<Katex tex="\sin\alpha\sin\beta=\tfrac12[\cos(\alpha-\beta)-\cos(\alpha+\beta)]" />。</div>
    <ConicFigure number="Q1" title="和差公式推出积化和差" head="bottom" :factory="createLab">左图用两条终边标出 <Katex tex="\alpha" /> 和 <Katex tex="\beta" />。选择上方的乘积，右框会列出两条和差公式，说明按什么顺序相加或相减才能消去另一项。拖动滑块，可以在下方核对乘积与和差式的数值。</ConicFigure>

    <h3 class="sec" id="q1-derive">两行加减出四个积</h3>
    <p>以 <Katex tex="\sin\alpha\cos\beta"/> 为例：把<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>的两行 <Katex tex="\sin" /> 公式并排，直接相加 ——</p>
    <p><Katex display tex="\begin{aligned}①\quad \sin(\alpha+\beta)&=\sin\alpha\cos\beta+\cos\alpha\sin\beta\\②\quad \sin(\alpha-\beta)&=\sin\alpha\cos\beta-\cos\alpha\sin\beta\end{aligned}\;\xrightarrow{\;①+②\;}\;2\sin\alpha\cos\beta=\sin(\alpha+\beta)+\sin(\alpha-\beta)" /></p>
    <p>交叉项 <Katex tex="\cos\alpha\sin\beta"/> 一加一减对消，<Katex tex="\sin\alpha\cos\beta"/> 保留 —— 两边除以 2 即得第一条。①−② 则换成 <Katex tex="\cos\alpha\sin\beta"/> 保留。coscos 与 sinsin 同理，改用两条余弦公式相加或相减。四个积、两种消法，板上模式按钮挨个按一遍：每个积的「消元流程」只有三行字。</p>

    <h3 class="sec" id="q1-table">四条公式的记法</h3>
    <p>不必死背四条 —— 记两条<strong>结构性判读</strong>就够：</p>
    <p>① <strong>结果的名称由「哪一项保留」决定</strong>：异名积（正弦乘余弦、余弦乘正弦）消出 <Katex tex="\sin(\alpha\pm\beta)"/>；同名积（余弦乘余弦、正弦乘正弦）消出 <Katex tex="\cos(\alpha\pm\beta)"/>。② <strong>正弦乘正弦是差不是和</strong>：两行 <Katex tex="\cos" /> 公式里 <Katex tex="\sin\alpha\sin\beta"/> 一减一加，必须用 ②−① 才能消掉余弦乘余弦 —— 结果是 <Katex tex="\cos(\alpha-\beta)"/> <strong>减</strong> <Katex tex="\cos(\alpha+\beta)"/>（差序固定：小角差式在前）。其余三条都是「和式在前」。板上按到「正弦乘正弦」那一档即可看到第二式减第一式的推导。</p>

    <h3 class="sec" id="q1-use">用途：化乘为加</h3>
    <p>三角函数相乘<strong>没法直接算</strong>，加减却可以（诱导公式兜底）。经典场景：求 <Katex tex="\sin75^\circ\cos15^\circ" /> —— 化成 <Katex tex="\tfrac12[\sin90^\circ+\sin60^\circ]=\tfrac12\bigl(1+\tfrac{\sqrt3}{2}\bigr)=\tfrac{2+\sqrt3}{4}" />，一列乘法两行加法即得。更远的铺垫：<strong>积分</strong>里 <Katex tex="\int\sin mx\cos nx\,dx" /> 的第一手准备就是积化和差（<RouterLink class="xref" to="/functions/v8">积分初步：黎曼与基本定理</RouterLink>的后话）；<strong>周期与最值</strong>问题先化乘为加，式子才会「可读」。</p>

    <h3 class="sec" id="q1-pit">½ 漏乘与名称改变</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\tfrac12"/> 漏乘。</strong><Katex tex="2\sin\alpha\cos\beta=\sin(\alpha+\beta)+\sin(\alpha-\beta)"/> —— 左边有个系数 2，记忆时容易把 <Katex tex="\tfrac12"/> 漏掉；记住消元流程「两行相加剩两项」，右边除 2 是最后一步。</li>
        <li><strong>提示二：正弦乘正弦，名称改变。</strong>两个 <Katex tex="\sin" /> 相乘，结果里<strong>没有 <Katex tex="\sin" /></strong> —— 是 <Katex tex="\cos(\alpha-\beta)-\cos(\alpha+\beta)"/>；名称跟着「同名积出 <Katex tex="\cos" />」的判读走，不是跟着左因子走。</li>
        <li><strong>提示三：<Katex tex="\alpha" />、<Katex tex="\beta" /> 顺序。</strong><Katex tex="\cos(\alpha-\beta)"/> 是偶的（<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>验过），<Katex tex="\sin(\alpha-\beta)"/> 是奇的 —— 写成 <Katex tex="\sin(\beta-\alpha)"/> 时记得变号。</li>
      </ul>
    </div>
    <p>四个积都由消元导出。下一讲把消元<strong>反演</strong>：换元 <Katex tex="\alpha=(A+B)/2"/>、<Katex tex="\beta=(A-B)/2"/> 代回去，得到和差化积；典型应用是两列波 <Katex tex="a\sin x+b\cos x"/> 叠成一列纯 sin 的辅助角。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/prodsum/prodsum.js';
import { Q_CHAPTERS } from './qnav.js';
</script>
