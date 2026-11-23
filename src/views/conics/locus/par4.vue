<template>
  <ChPage :cur="4" no="P4" base="/conics/par" :chapters="PAR_CHAPTERS"
    title="极坐标方程：把焦点放在原点" sub="换个坐标，统一定义被压缩成一行：$\rho(1-e\cos\theta)=ed$。三种曲线共用同一串字符，只有 e 在变 —— 顶点、通径、焦点弦公式全部直接得到。"
    :toc="[{ id: 'p4-lab', t: '极坐标方程（图 P4）' }, { id: 'p4-der', t: '推导 · 统一定义的直译' }, { id: 'p4-rec', t: '回收直角坐标 · 三曲线' }, { id: 'p4-use', t: '焦点弦 · 倒数和恒为常数' }]">
    <div class="note good"><strong>本讲主角</strong>：以焦点 <Katex tex="F" /> 为极点、极轴<strong>背对准线</strong>的极坐标方程。记 <Katex tex="d" /> 为焦点到准线的距离，则圆锥曲线的统一定义 <Katex tex="|PF|=e\cdot d(P,\,l)" /> 逐字翻译成 <Katex tex="\rho(1-e\cos\theta)=ed" />，即 <Katex tex="\rho=\dfrac{ed}{1-e\cos\theta}" />。</div>

    <h3 class="sec" id="p4-lab">极坐标方程</h3>
    <ConicFigure head="bottom" number="P4" title="带符号极径与焦点直线的两个交点" :factory="createPolarCon"
      :legend="[['mint', '圆锥曲线'], ['blue', 'θ 对应的点', 'point'], ['green', 'θ+π 对应的点', 'point'], ['orange', '到准线的垂距', 'dashed']]">
      滑动 θ 和 e。先点「通径方向」，再把 e 调到大于 1 并点「沿极轴」。注意负极径把端点画到反向，两个端点可能处在焦点同一侧。点「对准无穷远方向」可精确到达分母为零的位置。
    </ConicFigure>

    <h3 class="sec" id="p4-der">推导：统一定义的直译</h3>
    <p>准线是 <Katex tex="x=-d" />，极轴指向远离准线的一侧。用极径 <Katex tex="\rho" /> 表示点 <Katex tex="(\rho\cos\theta,\rho\sin\theta)" />，焦准定义始终是</p>
    <Katex tex="|\rho|=e\,|d+\rho\cos\theta|." display />
    <p>如果规定 <Katex tex="\rho" /> 可以带符号，并把负值画到 <Katex tex="\theta" /> 的反方向，那么可取有向方程 <Katex tex="\rho=e(d+\rho\cos\theta)" />。这给出 <Katex tex="\rho(1-e\cos\theta)=ed" />。负极径对应准线另一侧的支，实际距离仍为 <Katex tex="|\rho|" />。要按固定<strong>半直线</strong>统计交点，可改用 <router-link to="/conics/def4">D4 的两候选式</router-link>，把负极径按反向归入相应射线。</p>
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
    <p>倒数相加总得到 <Katex tex="2/(ed)" />。不过，<Katex tex="\rho_1,\rho_2" /> 是<strong>有符号</strong>的极径，读成几何距离前要先看符号。</p>
    <ul>
      <li><strong>两个极径都为正。</strong> 焦点在两端之间，弦长为 <Katex tex="\rho_1+\rho_2" />。两段距离的调和平均等于半通径。椭圆、抛物线的有限焦点弦，以及双曲线的同支焦点弦，都属于这种情况。</li>
      <li><strong>有一个极径为负。</strong> 双曲线两端分属不同的支，却都落在焦点的同一侧。弦长等于两段距离之差的绝对值。统一地写，有限弦长为 <Katex tex="|\rho_1+\rho_2|=2ed/|1-e^2\cos^2\theta|" />。</li>
      <li><strong>一个分母为零。</strong> 位于这条方向上的端点进入无穷远，直线上只剩另一个有限交点。读数中的无穷远和视窗外的有限点要分开理解。</li>
    </ul>
    <p>例如 <Katex tex="e=2" /> 时，沿轴的异支弦长为 <Katex tex="4d/3" />，小于通径 <Katex tex="4d" />。所以 <router-link to="/conics/par3">P3 的通径最短结论</router-link> 对双曲线要注明「同支」。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarCon } from '../../../boards/conics/locus/polarcon.js';
import { PAR_CHAPTERS } from './parnav.js';
</script>
