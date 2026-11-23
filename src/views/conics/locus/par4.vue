<template>
  <ChPage :cur="4" no="P4" base="/conics/par" :chapters="PAR_CHAPTERS"
    title="极坐标方程：把焦点放在原点" sub="换个坐标，统一定义被压缩成一行：$\rho(1-e\cos\theta)=ed$。三种曲线共用同一串字符，只有 e 在变 —— 顶点、通径、焦点弦公式全部直接得到。"
    :toc="[{ id: 'p4-lab', t: '极坐标方程（图 P4）' }, { id: 'p4-der', t: '推导 · 统一定义的直译' }, { id: 'p4-rec', t: '回收直角坐标 · 三曲线' }, { id: 'p4-use', t: '焦点弦 · 倒数和恒为常数' }]">
    <div class="note good"><strong>本讲主角</strong>：以焦点 <Katex tex="F" /> 为极点、极轴<strong>背对准线</strong>的极坐标方程。记 <Katex tex="d" /> 为焦点到准线的距离，则圆锥曲线的统一定义 <Katex tex="|PF|=e\cdot d(P,\,l)" /> 逐字翻译成 <Katex tex="\rho(1-e\cos\theta)=ed" />，即 <Katex tex="\rho=\dfrac{ed}{1-e\cos\theta}" />。</div>

    <h3 class="sec" id="p4-lab">极坐标方程</h3>
    <div class="board-wrap">
      <BoardMount :factory="createPolarCon" />
      <div class="cap">图 P4 · <b>圆锥曲线的极坐标方程</b>：拖 θ 看统一定义重现 —— <strong>|PF| 与 P 到准线的垂线段实时读数，比值固定为 e</strong>。滑 e 穿过 1：椭圆 → 抛物线 → 双曲线连续变形（D4 的变化过程换一种坐标重新呈现），中心从极点右侧滑向无穷、再从左侧回来。绿色对径点 Q 与 P 构成焦点弦，右下角倒数和恒为 <Katex tex="\tfrac{2}{ed}" />。</div>
    </div>

    <h3 class="sec" id="p4-der">推导：统一定义的直译</h3>
    <p>极点取在焦点 F，极轴水平、指向<strong>远离准线</strong>的一侧，准线是竖直直线 <Katex tex="x=-d" />。点 <Katex tex="P=(\rho\cos\theta,\ \rho\sin\theta)" /> 在准线的另一侧（曲线所在一侧），于是</p>
    <Katex tex="|PF|=\rho,\qquad d(P,\,l)=\rho\cos\theta+d" display />
    <p>代入 <Katex tex="\rho=e\,(\rho\cos\theta+d)" />，移项即得 —— 没有任何一步超出「统一定义 + 三角函数定义」：</p>
    <Katex tex="\rho\,(1-e\cos\theta)=ed" display />
    <p>三个几何量各就各位：<strong>e 是形状</strong>（画板里拖它决定椭圆还是双曲线）、<strong>d 是尺寸</strong>（等比放大）、<strong>θ 是位置参数</strong>（P1/P2 的 t 换了个名字，从「离心角 / 时间」换成「从焦点看出去的方向」）。</p>

    <h3 class="sec" id="p4-rec">回收直角坐标：三曲线一表归纳</h3>
    <p>令 <Katex tex="x=\rho\cos\theta" />、<Katex tex="y=\rho\sin\theta" />，把 <Katex tex="\rho=\sqrt{x^2+y^2}" /> 代回并平方：</p>
    <Katex tex="(1-e^2)x^2+y^2-2e^2dx-e^2d^2=0" display />
    <table>
      <tbody>
        <tr><th>离心率</th><th>配方后的标准形</th><th>关键读数</th><th>极点的身份</th></tr>
        <tr><td><Katex tex="e&lt;1" />（椭圆）</td><td><Katex tex="\frac{(x-c)^2}{a^2}+\frac{y^2}{b^2}=1" /></td><td><Katex tex="a=\frac{ed}{1-e^2}" />，<Katex tex="b=\frac{ed}{\sqrt{1-e^2}}" /></td><td>左焦点（中心在极点右侧 <Katex tex="c" /> 处）</td></tr>
        <tr><td><Katex tex="e=1" />（抛物线）</td><td><Katex tex="y^2=2d\big(x+\tfrac{d}{2}\big)" /></td><td>顶点在 <Katex tex="x=-\tfrac{d}{2}" />，焦参数 <Katex tex="p=d" /></td><td>焦点（D3 回归）</td></tr>
        <tr><td><Katex tex="e&gt;1" />（双曲线）</td><td><Katex tex="\frac{(x+c)^2}{a^2}-\frac{y^2}{b^2}=1" /></td><td><Katex tex="a=\frac{ed}{e^2-1}" />，中心跑到极点<strong>左侧</strong></td><td>右焦点</td></tr>
      </tbody>
    </table>
    <p>两个速查读数顺便纳入：<strong>顶点</strong> <Katex tex="\rho(0)=\tfrac{ed}{1-e}" /> 与 <Katex tex="\rho(\pi)=\tfrac{ed}{1+e}" />（e&gt;1 时前者为负 —— 负极径正是另一支的顶点，画板里带符号 ρ 自动把第二支画齐）；<strong>通径</strong>端点 <Katex tex="\rho(\pm 90^\circ)=ed" />，故通径恒为 <Katex tex="2ed" /> —— P3 的通径最短结论换个名称重新落户。</p>

    <h3 class="sec" id="p4-use">焦点弦：倒数和恒为常数</h3>
    <p>过焦点的弦与曲线交于 P（方向 θ）与 Q（方向 θ+π），两段焦半径</p>
    <Katex tex="\rho_1=\frac{ed}{1-e\cos\theta},\qquad \rho_2=\frac{ed}{1+e\cos\theta}" display />
    <p>倒数相加，分母恰好对消：</p>
    <Katex tex="\frac{1}{\rho_1}+\frac{1}{\rho_2}=\frac{1}{ed}\Big[(1-e\cos\theta)+(1+e\cos\theta)\Big]=\frac{2}{ed}" display />
    <p><strong>与方向 θ 无关</strong> —— 每条焦点弦都被焦点切成「倒数和恒定」的两段（调和平均）。两个直接推论：<strong>①</strong> 弦长 <Katex tex="L=\rho_1+\rho_2=\tfrac{2ed}{1-e^2\cos^2\theta}" />，P3 焦点弦公式由两行极坐标代数直接得出；<strong>②</strong> 最短在 <Katex tex="\theta=90^\circ" />（通径），P3 的最值结论在此免证。</p>
    <p><strong>回收</strong>：D4 统一定义（同一定义、另一种坐标 —— e 的连续变形在这里尤其直观）、D3 抛物线（e=1 那一行）、P3 焦点弦与通径（公式不用韦达定理）、子专题六的调和点列（倒数和恒定的分割正是调和的度量形式）、P1 参数（θ 是「从焦点看出去」的第三种参数视角）。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarCon } from '../../../boards/conics/locus/polarcon.js';
import { PAR_CHAPTERS } from './parnav.js';
</script>
