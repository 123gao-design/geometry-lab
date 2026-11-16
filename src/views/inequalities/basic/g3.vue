<template>
  <ChPage :cur="3" no="基3" base="/inequalities/g" :chapters="G_CHAPTERS"
    title="均值链 $H\le G\le A\le Q$" sub="同一对正数有四条均值：调和 $H$、几何 $G$、算术 $A$、平方 $Q$，它们严格排成一串，$a\ne b$ 时全都错开、$a=b$ 时收敛到同一点。相邻两环分别由「平方非负」与「倒数换元」给出，链条可以一步推到底。"
    :toc="[{ id: 'g3-four', t: '四条均值' }, { id: 'g3-link', t: '链条的证明' }, { id: 'g3-equ', t: '取等条件' }, { id: 'g3-chord', t: '链条之外：应用' }]">
    <div class="note good" id="g3-law">对 <Katex tex="a,b>0" />：<Katex tex="H=\frac{2ab}{a+b}\le G=\sqrt{ab}\le A=\frac{a+b}{2}\le Q=\sqrt{\frac{a^2+b^2}{2}}" />，等号四处全在 <Katex tex="a=b" />。几何与算术两环已经在基1 的半圆里证明过；补上 Q 与 H 两环，链条两端接齐。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGT" />
      <div class="cap">图 基3 · <b>均值链机</b>：拖 a、b 或点预设，主轴上四条彩色均值从左到右排开，放大镜聚焦它们所在的窄窗口，一眼认出先后。看点：悬殊时 H 与 Q 相距很远、A、G 居中；a、b 收拢时四个点向 A 挤拢，「趋向相等」按钮把 a、b 同时滑向中点，四条均值叠成一点——链条两头到中点的收缩，正是「a=b」的几何读法。</div>
    </div>

    <h3 class="sec" id="g3-four">四条均值</h3>
    <p><Katex tex="A=\frac{a+b}{2}" /> 算术均值是日常语境的平均数；<Katex tex="G=\sqrt{ab}" /> 几何均值适合等比型数据（倍率叠加）；<Katex tex="H=\frac{2ab}{a+b}" /> 调和均值出现在「两个量以同一时间/同一路程轮换」的情形，如往返均速、并联电阻；<Katex tex="Q=\sqrt{\frac{a^2+b^2}{2}}" /> 平方均值与标准差同源——数据关于其平均的离差越大，平方均值超过算术均值越多（几率章会用它刻画离散）。四条均值公用地保留 <Katex tex="a=b" /> 处重合的性质。</p>

    <h3 class="sec" id="g3-link">链条的证明</h3>
    <p>链条三个环节各凭一件事实：<Katex tex="A\ge G" /> 来自基1 的圆图（或 <Katex tex="(\sqrt a-\sqrt b)^2\ge0" />）；<Katex tex="Q\ge A" /> 来自 <Katex tex="Q^2-A^2=\frac{a^2+b^2}{2}-\frac{(a+b)^2}{4}=\frac{(a-b)^2}{4}\ge0" />，平方非负让平方均值永远不低于算术均值；<Katex tex="G\ge H" /> 则对倒数使用前一环——注意 <Katex tex="\frac1H=\frac12\bigl(\frac1a+\frac1b\bigr)" /> 恰是 <Katex tex="\frac1a,\ \frac1b" /> 的算术均值，由 <Katex tex="A\ge G" /> 得 <Katex tex="\frac1H\ge\sqrt{\frac1{ab}}=\frac1G" />，取倒数即 <Katex tex="H\le G" />。一环叠一环，四个点永远按同一顺序排在数轴上。</p>

    <h3 class="sec" id="g3-equ">取等条件</h3>
    <p>四个环节的取等条件一脉相承：<Katex tex="A=G" /> 在 <Katex tex="a=b" />；<Katex tex="Q=A" /> 在 <Katex tex="(a-b)^2=0" /> 即 <Katex tex="a=b" />；<Katex tex="G=H" /> 也回到 <Katex tex="\frac1a=\frac1b" />。故整条链在 <Katex tex="a=b" /> 处四均值全部相等。这与基1 的竖弦升到半径、基2 的极值横线切到曲线是同一次取等换上的三件外衣。</p>

    <h3 class="sec" id="g3-chord">链条之外：应用</h3>
    <p>均值链不是装饰：证明不等式时挑哪一环作中间量，常常成就一步关键放缩——<Katex tex="x^2+y^2" /> 型谈下界用 <Katex tex="Q^2\ge A" />，倒数型用 H，混合型在两端之间夹。基2 的「积定和最小」就是 <Katex tex="G\le A" /> 的直接摘取；而链的两端各多一分「程度」——不放缩时，用相邻两环同时夹住一个量，就能把它的范围收拢到最紧的一环之间（放缩章的柯西、三角不等式正是这条思路的延伸）。</p>
    <p>三条均值链至此铺满基本不等式的全景：一正二定三相等、半圆里的两条证明线、<Katex tex="H\le G\le A\le Q"/> —— 以圆起、以链收。下一子专题把「不等的程度」推向放缩：柯西与三角不等式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGT } from '../../../boards/inequalities/basic/meanchain.js';
import { G_CHAPTERS } from './gnav.js';
</script>