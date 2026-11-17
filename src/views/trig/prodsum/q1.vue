<template>
  <ChPage :cur="1" no="Q1" base="/trig/q" :chapters="Q_CHAPTERS"
    title="积化和差：加减消元" sub="四个「积」全部由和差公式的两行同加减读出 —— 积化和差不是新公式，是 M1 的消元术。"
    :toc="[{ id: 'q1-derive', t: '两行加减出四个积' }, { id: 'q1-table', t: '四条公式的记法' }, { id: 'q1-use', t: '用途：化乘为加' }, { id: 'q1-pit', t: '½ 漏乘与名称改变' }]">
    <div class="note good" id="q1-law"><strong>积化和差四式</strong>：<Katex tex="\sin\alpha\cos\beta=\tfrac12[\sin(\alpha+\beta)+\sin(\alpha-\beta)]" />；<Katex tex="\cos\alpha\sin\beta=\tfrac12[\sin(\alpha+\beta)-\sin(\alpha-\beta)]" />；<Katex tex="\cos\alpha\cos\beta=\tfrac12[\cos(\alpha+\beta)+\cos(\alpha-\beta)]" />；<Katex tex="\sin\alpha\sin\beta=\tfrac12[\cos(\alpha-\beta)-\cos(\alpha+\beta)]" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createLab" />
      <div class="cap">图 Q1 · <b>和差公式推出积化和差</b>：左侧两行和差公式摆好，按下方四个模式按钮轮看 —— 每个积都能由「① ＋ ②」或「② − ①」直接读出：异名交叉项对消、同名平方项对消，剩下的一块就是积。右侧单位圆挂 α、β 两针供对照验证；拖动滑块，左右两边的数值恒等。</div>
    </div>

    <h3 class="sec" id="q1-derive">两行加减出四个积</h3>
    <p>以 <Katex tex="\sin\alpha\cos\beta"/> 为例：把 M1 的两行 sin 公式并排，直接相加 ——</p>
    <p><Katex display tex="\begin{aligned}①\quad \sin(\alpha+\beta)&=\sin\alpha\cos\beta+\cos\alpha\sin\beta\\②\quad \sin(\alpha-\beta)&=\sin\alpha\cos\beta-\cos\alpha\sin\beta\end{aligned}\;\xrightarrow{\;①+②\;}\;2\sin\alpha\cos\beta=\sin(\alpha+\beta)+\sin(\alpha-\beta)" /></p>
    <p>交叉项 <Katex tex="\cos\alpha\sin\beta"/> 一加一减对消，<Katex tex="\sin\alpha\cos\beta"/> 保留 —— 两边除以 2 即得第一条。②−① 则换成 <Katex tex="\cos\alpha\sin\beta"/> 保留。coscos 与 sinsin 同理，只是拿两行 cos 公式来加。四个积、两种消法，板上模式按钮挨个按一遍：每个积的「消元流程」只有三行字。</p>

    <h3 class="sec" id="q1-table">四条公式的记法</h3>
    <p>不必死背四条 —— 记两条<strong>结构性判读</strong>就够：</p>
    <p>① <strong>结果的名称由「哪一项保留」决定</strong>：sincos、cossin（异名积）消出 <Katex tex="\sin(\alpha\pm\beta)"/>；coscos、sinsin（同名积）消出 <Katex tex="\cos(\alpha\pm\beta)"/>。② <strong>sinsin 是差不是和</strong>：两行 cos 公式里 <Katex tex="\sin\alpha\sin\beta"/> 一减一加，必须用 ②−① 才能消掉 coscos —— 结果是 <Katex tex="\cos(\alpha-\beta)"/> <strong>减</strong> <Katex tex="\cos(\alpha+\beta)"/>（差序固定：小角差式在前）。其余三条都是「和式在前」。板上按到 sinsin 模式即见「② − ①」的黄色提示行。</p>

    <h3 class="sec" id="q1-use">用途：化乘为加</h3>
    <p>三角函数相乘<strong>没法直接算</strong>，加减却可以（诱导公式兜底）。经典场景：求 <Katex tex="\sin75^\circ\cos15^\circ" /> —— 化成 ½[sin90°+sin60°] = ½(1+√3/2) = (2+√3)/4，一列乘法两行加法即得。更远的铺垫：<strong>积分</strong>里 <Katex tex="\int\sin mx\cos nx\,dx" /> 的第一手准备就是积化和差（V8 的后话）；<strong>周期与最值</strong>问题先化乘为加，式子才会「可读」。</p>

    <h3 class="sec" id="q1-pit">½ 漏乘与名称改变</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\tfrac12"/> 漏乘。</strong><Katex tex="2\sin\alpha\cos\beta=\sin(\alpha+\beta)+\sin(\alpha-\beta)"/> —— 左边有个系数 2，记忆时容易把 <Katex tex="\tfrac12"/> 漏掉；记住消元流程「两行相加剩两项」，右边除 2 是最后一步。</li>
        <li><strong>提示二：sinsin 名称改变。</strong>两个 sin 相乘，结果里<strong>没有 sin</strong> —— 是 <Katex tex="\cos(\alpha-\beta)-\cos(\alpha+\beta)"/>；名称跟着「同名积出 cos」的判读走，不是跟着左因子走。</li>
        <li><strong>提示三：α、β 顺序。</strong><Katex tex="\cos(\alpha-\beta)"/> 是偶的（M1 验过），<Katex tex="\sin(\alpha-\beta)"/> 是奇的 —— 写成 <Katex tex="\sin(\beta-\alpha)"/> 时记得变号。</li>
      </ul>
    </div>
    <p>四个积都由消元导出。下一讲把消元<strong>反演</strong>：换元 <Katex tex="\alpha=(A+B)/2"/>、<Katex tex="\beta=(A-B)/2"/> 代回去，得到和差化积；典型应用是两列波 <Katex tex="a\sin x+b\cos x"/> 叠成一列纯 sin 的辅助角。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/prodsum/prodsum.js';
import { Q_CHAPTERS } from './qnav.js';
</script>
