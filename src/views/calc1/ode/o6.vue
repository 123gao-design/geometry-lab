<template>
  <ChPage :cur="6" no="方6" base="/calc1/o" :chapters="ON_CHAPTERS"
    title="微分方程的应用"
    sub="增长、振动、电路，三类现象的数学骨架是同一个：先写清相关变化率，再连立解出函数。"
    :toc="[{ id: 'o6-step', t: '建模四步' }, { id: 'o6-exp', t: '增长与衰减' }, { id: 'o6-osc', t: '简谐振动' }, { id: 'o6-rl', t: 'RL 电路' }]">

    <div class="note good" id="o6-step">用微分方程描述一个过程，走四步：设出状态量并写清它的含义；由物理或几何规律写出一句话的变化率关系；把这句话译成含导数的方程并补上初始条件；解方程，再把解拿回原情境里核对量纲与走势。</div>

    <div class="board-wrap">
      <BoardMount :factory="createOdemodel" />
      <div class="cap">图 方6 · <b>微分方程建模</b>：三档依次是指数增长、简谐振动与 RL 电路的暂态。金点是 <Katex tex="t" /> 时刻的状态值，虚线连到时间轴。<b>看点</b>：三档的滑块含义随档切换，拖一拖能看到「参数只管陡缓、方程定形状」这件事在三种现象里都成立。</div>
    </div>

    <h3 class="sec" id="o6-exp">指数增长与衰减</h3>
    <p>一批个体的数量按当前规模成比例地增加或减少，写成一句话就是「变化率与当前数量成正比」：</p>
    <p style="text-align:center"><Katex display tex="\frac{\mathrm{d}N}{\mathrm{d}t}=kN,\qquad N(0)=N_0" /></p>
    <p>这是可分离方程，解得 <Katex tex="N=N_0\mathrm{e}^{kt}" />。<Katex tex="k>0" /> 时曲线越走越陡，<Katex tex="k<0" /> 时曲线压向横轴却始终为正。<Katex tex="k" /> 只管陡缓，管不了形状：所有解的图像经过水平伸缩后重合，这是「相对速率固定」的直接结果。</p>
    <p>说「增长与当前数量成正比」时，隐含了一个前提：资源不受限、个体相互独立。一旦群体接近环境容量，比例关系就要改成与「剩余空间」成正比，于是得到方2 的逻辑斯蒂方程。图 方6 的第一档只画了纯粹的指数形态，把 <Katex tex="k" /> 拖成负值，同一条曲线立刻改读为衰减。</p>

    <h3 class="sec" id="o6-osc">简谐振动</h3>
    <p>弹簧上的物块，回复力与位移成正比、方向相反，由牛顿第二定律得</p>
    <p style="text-align:center"><Katex display tex="x''+\omega^2x=0,\qquad x(0)=1,\ x'(0)=0" /></p>
    <p>特征方程 <Katex tex="\lambda^2+\omega^2=0" /> 给出一对纯虚根 <Katex tex="\pm\omega\mathrm{i}" />，按方5 的第三种情形，解为 <Katex tex="x=\cos\omega t" />。振幅始终是一，摆动永不衰减，因为方程里没有阻尼项，能量在动能与势能之间来回转移、总量守恒。</p>
    <p><Katex tex="\omega" /> 是角频率，周期为 <Katex tex="2\pi/\omega" />。图 方6 第二档拖动滑块时，曲线只是挤密或拉疏，峰高不变。若在方程左边补一个 <Katex tex="cx'" /> 的阻尼项，特征方程的根就带上负实部，解多了方5 里那条指数包络，摆动逐渐收敛——这正是从第二档过渡到第三档的形状。</p>

    <h3 class="sec" id="o6-rl">RL 电路的暂态</h3>
    <p>电阻与电感串联接上恒定电压源，回路方程由基尔霍夫定律给出：电源电动势等于电阻压降与电感压降之和。以电流 <Katex tex="I" /> 为未知量，得</p>
    <p style="text-align:center"><Katex display tex="L\frac{\mathrm{d}I}{\mathrm{d}t}+RI=E,\qquad I(0)=0" /></p>
    <p>两边同除 <Katex tex="L" />，这是标准形的一阶线性方程，<Katex tex="P=R/L" />、<Katex tex="Q=E/L" />。解为</p>
    <p style="text-align:center"><Katex display tex="I=\frac{E}{R}\left(1-\mathrm{e}^{-Rt/L}\right)" /></p>
    <p>开关合上瞬间 <Katex tex="I=0" />，电流不能突变，这是电感的基本性质；随后电流按指数规律逼近稳态值 <Katex tex="E/R" />。<Katex tex="R/L" /> 越大，爬升越慢，时间常数 <Katex tex="L/R" /> 也就越长。把 <Katex tex="R/L" /> 换成 <Katex tex="1/\tau" />，这条式子与方3 预设 ① 的 <Katex tex="y=1+C\mathrm{e}^{-x}" /> 完全同形，只是符号换了一套。</p>
    <p>稳态部分 <Katex tex="E/R" /> 是方程的一个特解，暂态部分 <Katex tex="-\dfrac{E}{R}\mathrm{e}^{-Rt/L}" /> 是齐次解配出来的项。三类现象的解都能拆成「稳态 + 暂态」，这一结构在本模块反复出现，解决的是同一件事：给定初始条件，看它怎样被方程拉向长期行为。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：自变量与状态量别混。</strong>增长问题里自变量是时间 <Katex tex="t" />、状态量是数量 <Katex tex="N" />；把 <Katex tex="N" /> 当自变量会写错变化率。</li>
        <li><strong>提示二：量纲要过一遍。</strong><Katex tex="k" /> 的单位是「时间的倒数」，<Katex tex="R/L" /> 也是；若算出的单位不对，多半是某个系数漏除或代错。</li>
        <li><strong>提示三：初始条件来自「瞬间不能突变」。</strong>电流在电感上不能突变、位移在速度有限时不能突变，这些物理事实就是初值的来源，不能凭感觉给。</li>
        <li><strong>提示四：解的长期行为要单独看。</strong>把 <Katex tex="t\to+\infty" /> 代进去，看解落到哪里：落到有限值说明有稳态，趋于无穷说明无界，摆动不衰减说明缺阻尼。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createOdemodel } from '../../../boards/calc1/ode/odemodel.js';
import { ON_CHAPTERS } from './onav.js';
</script>
