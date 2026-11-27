<template>
  <ChPage :cur="1" no="N1" base="/trig/n" :chapters="N_CHAPTERS"
    title="倍角公式" sub="$\beta=\alpha$ 代入和差公式 —— $\sin2\alpha$ 由圆内矩形的面积直译，$\cos2\alpha$ 一式三面，$\tan2\alpha$ 分母为零的预警。"
    :toc="[{ id: 'n1-rect', t: '面积来源：圆内矩形的直译' }, { id: 'n1-three', t: '$\\cos2\\alpha$ 三形态的选形' }, { id: 'n1-tan', t: '$\\tan2\\alpha$ 与分母为零' }, { id: 'n1-pit', t: '非线性外推与三面记混' }]">
    <div class="note good" id="n1-law"><strong>倍角三式</strong>：<Katex tex="\sin2\alpha=2\sin\alpha\cos\alpha" />；<Katex tex="\cos2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha" />；<Katex tex="\tan2\alpha=\dfrac{2\tan\alpha}{1-\tan^2\alpha}" />。全部是<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>中 <Katex tex="\beta=\alpha"/> 的特例 —— 没有任何新原理。</div>
    <ConicFigure number="N1" title="倍角公式的几何来源" head="bottom" :factory="createLab">拖动青色点 <Katex tex="P"/> 改变 <Katex tex="\alpha"/>，金色射线 <Katex tex="OQ"/> 标出 <Katex tex="2\alpha"/> 的终边。第一象限中，矩形（宽 <strong><Katex tex="2\cos\alpha"/></strong>、高 <strong><Katex tex="\sin\alpha"/></strong>）的面积 <strong><Katex tex="2\cos\alpha\cdot\sin\alpha"/></strong> 等于点 <Katex tex="Q"/> 的纵坐标 <Katex tex="\sin 2\alpha"/>。三个读数分别验 <Katex tex="\sin2\alpha"/>、<Katex tex="\cos2\alpha"/> 三形态、<Katex tex="\tan2\alpha"/>，<Katex tex="\alpha=\pi/4"/> 时 <Katex tex="\tan2\alpha"/> 分母为零预警变红。</ConicFigure>

    <h3 class="sec" id="n1-rect">面积来源：圆内矩形的直译</h3>
    <p>在<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>里令 <Katex tex="\beta=\alpha"/>：<Katex tex="\sin(\alpha+\alpha)=\sin\alpha\cos\alpha+\cos\alpha\sin\alpha=2\sin\alpha\cos\alpha" />。板上给这个乘积找了个实物 —— 单位圆内的矩形：顶点 <Katex tex="(\pm\cos\alpha,\ \sin\alpha)"/>，宽 <Katex tex="2\cos\alpha"/>、高 <Katex tex="\sin\alpha"/>，故 <Katex tex="S=2\cos\alpha\sin\alpha" />；而金色 <Katex tex="2\alpha"/> 弧上，正弦线的长恰是 <Katex tex="\sin2\alpha"/>（<RouterLink class="xref" to="/trig/w1">正弦五点法：单位圆展开</RouterLink>滚动纸带上量过的那条高度线）。<strong>矩形的面积数值 = <Katex tex="2\alpha"/> 弧的正弦线长度</strong> —— 这是「<Katex tex="\sin2\alpha=2\sin\alpha\cos\alpha"/>」的面积直译：拖到 <Katex tex="\alpha=\pi/6"/>，面积 <Katex tex="0.866" /> 与 <Katex tex="\sin(\pi/3)"/> 完全重合。</p>
    <p>画板在第一象限展示这个面积模型（<Katex tex="0<\alpha<\pi/2"/>），但恒等式不限 —— <Katex tex="\alpha"/> 越过 <Katex tex="\pi/2"/> 后矩形消失，读数照常核验，公式跟着任意角走（<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>提示三的约定）。</p>

    <h3 class="sec" id="n1-three"><Katex tex="\cos2\alpha"/> 三形态的选形</h3>
    <p><Katex tex="\cos2\alpha"/> 一式三面，做题按「手上有什么」选形：</p>
    <p><Katex display tex="\cos2\alpha=\cos^2\alpha-\sin^2\alpha\quad(\text{对称保底})\qquad=2\cos^2\alpha-1\quad(\text{知}\cos)\qquad=1-2\sin^2\alpha\quad(\text{知}\sin)" /></p>
    <p>三面之间靠<RouterLink class="xref" to="/trig/u2">同角三角函数的关系</RouterLink>的平方关系 <Katex tex="\sin^2\alpha+\cos^2\alpha=1" /> 互相改写。底部「余弦三式」按上式顺序核对三个计算值。例：已知 <Katex tex="\sin\alpha=\tfrac13" />、<Katex tex="\alpha\in(\tfrac\pi2,\pi)" />，求 <Katex tex="\cos2\alpha" /> —— 不必先求 <Katex tex="\cos\alpha" />，直接选第三面：<Katex tex="\cos2\alpha=1-2\cdot\tfrac19=\tfrac79" />。若题目再问 <Katex tex="\cos\alpha" />，才走同角关系的开方（带象限判定取负）。</p>

    <h3 class="sec" id="n1-tan"><Katex tex="\tan2\alpha"/> 与分母为零</h3>
    <p><Katex tex="\tan" /> 的倍角来自<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>相除后的自乘版：分子 <Katex tex="\tan\alpha+\tan\alpha=2\tan\alpha"/>，分母 <Katex tex="1-\tan\alpha\cdot\tan\alpha"/>。分母归零的条件 <Katex tex="\tan^2\alpha=1" /> ⟺ <Katex tex="\alpha=\tfrac\pi4+k\tfrac\pi2" /> ⟺ <Katex tex="2\alpha=\tfrac\pi2+k\pi" /> —— <Katex tex="\tan2\alpha"/> 在自己的断口上排除（<RouterLink class="xref" to="/trig/w3">正切：断口与周期 π</RouterLink>里的同一情形）。板上预设 <Katex tex="\alpha=\pi/4"/> 一键触发红色预警：不是公式错了，是 <strong><Katex tex="\tan2\alpha"/> 本身在 <Katex tex="2\alpha=\pi/2"/> 处无定义</strong>。</p>

    <h3 class="sec" id="n1-pit">非线性外推与三面记混</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：倍角不是线性外推。</strong><Katex tex="\sin2\alpha\neq2\sin\alpha" /> —— 拖到 <Katex tex="\alpha=30^\circ"/>：<Katex tex="\sin60^\circ\approx0.866\ne2\times0.5=1"/>。「角翻倍」作用在角度上，正弦值跟着的是加法定理，不是倍乘。</li>
        <li><strong>提示二：三面记混。</strong>「<Katex tex="2\cos^2-1"/>」与「<Katex tex="1-2\sin^2"/>」易写反 —— 已知余弦用 <Katex tex="2\cos^2\alpha-1"/>，已知正弦用 <Katex tex="1-2\sin^2\alpha"/>。</li>
        <li><strong>提示三：<Katex tex="\tan" /> 排除点漏查。</strong><Katex tex="\alpha=\pi/4+k\pi/2"/> 处分母为零，套公式前先扫一眼。</li>
      </ul>
    </div>
    <p>倍角正着用是「已知单角求倍角」；下一讲倒着用 —— 由 <Katex tex="\cos2\alpha"/> 反解 <Katex tex="\sin\alpha"/>，得到<strong>半角与降幂</strong>：平方被移出三角函数、周期悄悄折半。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/double/doublelab.js';
import { N_CHAPTERS } from './nnav.js';
</script>
