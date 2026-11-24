<template>
  <ChPage :cur="2" no="Q2" base="/trig/q" :chapters="Q_CHAPTERS"
    title="和差化积与辅助角" sub="消元的反演：换元得和差化积；王牌应用辅助角 —— $a\sin x+b\cos x$ 叠成一列纯 $\sin$，$R$ 与 $\varphi$ 全在直角三角形上读。"
    :toc="[{ id: 'q2-aux', t: '辅助角：直角三角形读 R 与 φ' }, { id: 'q2-prod', t: '和差化积：换元反演' }, { id: 'q2-use', t: '用途与回收' }, { id: 'q2-pit', t: 'φ 的象限与排除' }]">
    <div class="note good" id="q2-law"><strong>辅助角与和差化积</strong>：<Katex tex="a\sin x+b\cos x=\sqrt{a^2+b^2}\,\sin(x+\varphi)" />（其中 <Katex tex="\cos\varphi=\tfrac{a}{\sqrt{a^2+b^2}}" />，<Katex tex="\sin\varphi=\tfrac{b}{\sqrt{a^2+b^2}}" />）；<Katex tex="\sin A+\sin B=2\sin\tfrac{A+B}{2}\cos\tfrac{A-B}{2}" />，<Katex tex="\cos A+\cos B=2\cos\tfrac{A+B}{2}\cos\tfrac{A-B}{2}" />。</div>
    <ConicFigure number="Q2" title="辅助角公式" head="bottom" :factory="createLab">拖系数 <Katex tex="a" />、<Katex tex="b" /> —— 蓝实线（原始叠加 <Katex tex="a\sin x+b\cos x"/>）与金虚线（辅助角写法 <Katex tex="R\sin(x+\varphi)"/>）恒重合；右上直角三角形两直角边 <Katex tex="a" />、<Katex tex="b" />，斜边 <strong><Katex tex="R=\sqrt{a^2+b^2}"/></strong>、夹角 <Katex tex="\varphi" /> 实时联动。探针核验读数在任意 <Katex tex="x_0"/> 处验「两写法同高」；<Katex tex="a=1" />、<Katex tex="b=1" /> 预设即经典的 <Katex tex="\sqrt2\sin(x+\pi/4)"/>。</ConicFigure>

    <h3 class="sec" id="q2-aux">辅助角：直角三角形读 R 与 φ</h3>
    <p>把 <Katex tex="R\sin(x+\varphi)" /> 用<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink>的 <Katex tex="\sin" /> 展开拆开：<Katex tex="R\sin(x+\varphi)=R\cos\varphi\sin x+R\sin\varphi\cos x" />。要它与 <Katex tex="a\sin x+b\cos x" /> 相等，只须</p>
    <p><Katex display tex="R\cos\varphi=a,\qquad R\sin\varphi=b\quad\Longrightarrow\quad R=\sqrt{a^2+b^2},\ \ \tan\varphi=\tfrac ba" /></p>
    <p>这两条恰是一张<strong>直角三角形</strong>的边角关系：横边 <Katex tex="a" />、竖边 <Katex tex="b" />、斜边 <Katex tex="R" />，<Katex tex="\varphi" /> 是 <Katex tex="a" /> 与 <Katex tex="R" /> 的夹角 —— 板上右上角那张小三角形就是它，拖 <Katex tex="a" />、<Katex tex="b" /> 时跟着变形。图象视角则更直观：两列频率相同的波叠加，还是同频率的波 —— <strong>叠不出新形状，只改变峰高与起点</strong>：<Katex tex="R" /> 管峰高、<Katex tex="\varphi" /> 管起点，<RouterLink class="xref" to="/trig/f1"><Katex tex="y=A\sin(\omega x+\varphi)" /></RouterLink>里的两枚直接对应。最值：<Katex tex="|a\sin x+b\cos x|\le R"/>，等号在 <Katex tex="x+\varphi=\tfrac\pi2+k\pi" /> 处取得。</p>

    <h3 class="sec" id="q2-prod">和差化积：换元反演</h3>
    <p>积化和差是「两行相加剩积」，反演只需换元：令 <Katex tex="A=\alpha+\beta,\ B=\alpha-\beta" />，即 <Katex tex="\alpha=\tfrac{A+B}{2},\ \beta=\tfrac{A-B}{2}" />，代回四式即得和差化积四式：</p>
    <p><Katex display tex="\sin A+\sin B=2\sin\tfrac{A+B}{2}\cos\tfrac{A-B}{2},\qquad \sin A-\sin B=2\cos\tfrac{A+B}{2}\sin\tfrac{A-B}{2}" /></p>
    <p><Katex display tex="\cos A+\cos B=2\cos\tfrac{A+B}{2}\cos\tfrac{A-B}{2},\qquad \cos A-\cos B=-2\sin\tfrac{A+B}{2}\sin\tfrac{A-B}{2}" /></p>
    <p>名字判读继承<RouterLink class="xref" to="/trig/q1">积化和差：加减消元</RouterLink>：<Katex tex="\sin" /> 的和差化出 <strong><Katex tex="\sin\cdot\cos"/> / <Katex tex="\cos\cdot\sin"/></strong>（一个看和一半、一个看差一半），<Katex tex="\cos" /> 的和差化出 <strong><Katex tex="\cos\cdot\cos"/></strong>，而 <Katex tex="\cos A-\cos B"/> 出 <strong>负号</strong>（差式换成正弦乘正弦）。<strong>同名才能化和差</strong> —— <Katex tex="\sin A\pm\cos B"/> 不同名，先用辅助角（或诱导公式换名）再化积。</p>

    <h3 class="sec" id="q2-use">用途与回收</h3>
    <p>辅助角是<strong>高中三角大题的常用工具</strong>：<Katex tex="a\sin x+b\cos x"/> 型化简、求最值、判周期、画图象，一步到位。三个经典情形：① <Katex tex="a=b=1" />：<Katex tex="\sin x+\cos x=\sqrt2\sin(x+\tfrac\pi4)" />（<RouterLink class="xref" to="/trig/n1">倍角公式</RouterLink>的特例汇总）；② 求值域：<Katex tex="y=\sin x+\cos x\in[-\sqrt2,\ \sqrt2]"/>，峰高就是斜边；③ 变形 <Katex tex="a\sin^2x+b\sin x\cos x"/> 型，先用<RouterLink class="xref" to="/trig/n2">半角与升降幂</RouterLink>降幂、再用本节辅助角 —— 公式群内部互相衔接。和差化积则常在<strong>证明恒等式</strong>与<strong>解三角方程</strong>时把「两项之和」折成「一项之积」，为因式分解作准备（<RouterLink class="xref" to="/trig/k1">已知值求角与三角方程</RouterLink>再次用到）。</p>

    <h3 class="sec" id="q2-pit">φ 的象限与排除</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\varphi" /> 的象限按 <Katex tex="(a,b)" /> 定。</strong>死记 <Katex tex="\varphi=\arctan\tfrac ba" /> 在 <Katex tex="a\lt0" /> 时差半个 <Katex tex="\pi" /> —— 正确流程是看 <Katex tex="(a,b)" /> 落在直角三角形的哪个象限（板上拖 <Katex tex="a" /> 过零，三角形直接翻向、<Katex tex="\varphi" /> 跳变）。「按点 <Katex tex="(a,b)" /> 定象限」就是 atan2 的课本版。</li>
        <li><strong>提示二：<Katex tex="a=b=0" /> 排除。</strong><Katex tex="R=0" /> 时无波形可谈，辅助角不适用。</li>
        <li><strong>提示三：和差化积只收同名。</strong><Katex tex="\sin A+\cos B" /> 不能直接套 —— 先用<RouterLink class="xref" to="/trig/i1">诱导公式</RouterLink>、<RouterLink class="xref" to="/trig/i2">互配两组与奇变偶不变</RouterLink>把两边换成同名，再化和差。</li>
        <li><strong>提示四：<Katex tex="\cos A-\cos B" /> 的负号。</strong>结果里那个负号漏写是高频事故，记「余弦差、负号出现」。</li>
      </ul>
    </div>
    <p>至此<strong>公式群五连（<RouterLink class="xref" to="/trig/m1">和差公式</RouterLink> → <RouterLink class="xref" to="/trig/n1">倍角公式</RouterLink> → <RouterLink class="xref" to="/trig/n2">半角与升降幂</RouterLink> → <RouterLink class="xref" to="/trig/q1">积化和差：加减消元</RouterLink> → 本讲）完结</strong>：一条弦推出和差，<Katex tex="\beta=\alpha" /> 得倍角，倒行得半角升降幂，加减消元得积化和差，换元反演得和差化积与辅助角 —— 全部公式收在同一张关系表里。下一阶段回到三角形本体：<RouterLink class="xref" to="/trig/z1">正弦定理与 SSA 解的个数</RouterLink>、<RouterLink class="xref" to="/trig/z2">余弦定理</RouterLink>、<RouterLink class="xref" to="/trig/z3">面积与范围</RouterLink>。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLab } from '../../../boards/trig/prodsum/auxilab.js';
import { Q_CHAPTERS } from './qnav.js';
</script>
