<template>
  <ChPage :cur="3" no="积3" base="/calc1/i" :chapters="IN_CHAPTERS"
    title="分部积分法"
    sub="乘积求导的公式反过来用：一个因式求导变得简单，另一个因式积分仍然会做，就把难题换成更容易的一题。"
    :toc="[{ id: 'i3-geo', t: '面积的拆法' }, { id: 'i3-form', t: '分部积分公式' }, { id: 'i3-pick', t: '先选 u' }, { id: 'i3-loop', t: '循环与递推' }]">

    <div class="note good" id="i3-geo">乘积法则 <Katex tex="(uv)'=u'v+uv'" /> 移项积分，就得到 <Katex tex="\int u\,\mathrm{d}v=uv-\int v\,\mathrm{d}u" />。几何上它说的是：一块矩形面积拆成横切与竖切两半，两半之和等于整块的差。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPartsLab" />
      <div class="cap">图 积3 · <b>分部积分法</b>：模式一的曲线由参数给出，蓝块横着切（<Katex tex="\int u\,\mathrm{d}v" />），橙块竖着切（<Katex tex="\int v\,\mathrm{d}u" />），两块拼起来正好是大矩形减小矩形；模式二把 <Katex tex="\int x\mathrm{e}^x\mathrm{d}x" /> 的两条曲线叠在一处，橙线的斜率处处等于蓝线的高度。</div>
    </div>

    <h3 class="sec" id="i3-geo">面积的拆法</h3>
    <p>取一条从 <Katex tex="(v(a),u(a))" /> 单调上升到 <Katex tex="(v(b),u(b))" /> 的曲线，围出的两块区域各算一种积分：沿横轴切成长条，得到 <Katex tex="\int u\,\mathrm{d}v" />；沿纵轴切成长条，得到 <Katex tex="\int v\,\mathrm{d}u" />。两块合起来正是外框矩形与内框矩形的面积差，也就是 <Katex tex="u(b)v(b)-u(a)v(a)" />。</p>
    <p>图 积3 的模式一取 <Katex tex="u=t" />、<Katex tex="v=t^2" />，两块分别是 <Katex tex="\tfrac23(b^3-a^3)" /> 与 <Katex tex="\tfrac13(b^3-a^3)" />，加起来是 <Katex tex="b^3-a^3" />，与矩形的差一致。右栏三个数随滑块实时变化，两块之和那一栏始终等于矩形差。</p>

    <h3 class="sec" id="i3-form">分部积分公式</h3>
    <p>把几何事实写成算式：</p>
    <p style="text-align:center"><Katex display tex="\int_a^b u\,\mathrm{d}v=\left[uv\right]_a^b-\int_a^b v\,\mathrm{d}u" /></p>
    <p>不定积分形式省去上下限，右边补上常数。公式的价值在于「换掉一个因式」：原来要积 <Katex tex="u\,\mathrm{d}v" />，改积 <Katex tex="v\,\mathrm{d}u" />。选得合适时，后者比前者容易——先把 <Katex tex="u" /> 求导，让多项式降次；把 <Katex tex="\mathrm{d}v" /> 积分，让指数、正弦这类函数形态不变。</p>
    <p>以 <Katex tex="\int x\mathrm{e}^x\mathrm{d}x" /> 为例，取 <Katex tex="u=x" />、<Katex tex="\mathrm{d}v=\mathrm{e}^x\mathrm{d}x" />，则 <Katex tex="\mathrm{d}u=\mathrm{d}x" />、<Katex tex="v=\mathrm{e}^x" />：</p>
    <p style="text-align:center"><Katex display tex="\int x\mathrm{e}^x\mathrm{d}x=x\mathrm{e}^x-\int\mathrm{e}^x\mathrm{d}x=(x-1)\mathrm{e}^x+C" /></p>
    <p>模式二把两边的函数画在一张图上：橙线是结果，蓝线是被积函数，橙线在每一点的切线斜率都等于蓝线的高度，这正是「原函数」的意思。</p>

    <h3 class="sec" id="i3-pick">先选 u</h3>
    <p>选法有惯例可循：反三角、对数、幂、三角、指数，排在前面的一律当 <Katex tex="u" />。理由是这些函数求导后要么变成有理式、要么降次；而指数与三角无论求导还是积分都还是自己，放在 <Katex tex="\mathrm{d}v" /> 里不亏。</p>
    <p>特殊情况有两类。一是 <Katex tex="\int\ln x\,\mathrm{d}x" /> 这种只有一个因式的，把常数 <Katex tex="1" /> 当 <Katex tex="\mathrm{d}v" />，取 <Katex tex="u=\ln x" />、<Katex tex="\mathrm{d}v=\mathrm{d}x" />，立刻得 <Katex tex="x\ln x-x+C" />。二是需要连续用两次以上的，比如 <Katex tex="\int x^2\mathrm{e}^x\mathrm{d}x" />，每用一次幂次降一，直到变成 <Katex tex="\int\mathrm{e}^x\mathrm{d}x" />。</p>

    <h3 class="sec" id="i3-loop">循环与递推</h3>
    <p><Katex tex="\int\mathrm{e}^x\sin x\,\mathrm{d}x" /> 这类积两次就会转回原式。设 <Katex tex="I=\int\mathrm{e}^x\sin x\,\mathrm{d}x" />，分部两次得 <Katex tex="I=\mathrm{e}^x(\sin x-\cos x)/2+C" />——第二次分部后右边出现 <Katex tex="-I" />，移项解出即可。移项时别忘了除以系数。</p>
    <p>另一种用法是造递推式。记 <Katex tex="I_n=\int\sin^n x\,\mathrm{d}x" />，分部一次可以把它与 <Katex tex="I_{n-2}" /> 接上，于是从 <Katex tex="I_0" />、<Katex tex="I_1" /> 一路推上去。递推的好处是不必每次重做，也便于看出奇偶次的不同结局。</p>
    <p>两条都要留意：移项时符号容易错，回代检验是最快的把关；递推的初值要单独算，不能套公式。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\mathrm{d}v" /> 必须能积出来。</strong>把积不出的因式放进 <Katex tex="\mathrm{d}v" />，式子会越走越难。选完先试积一次，积不出就换。</li>
        <li><strong>提示二：一次不够就再来一次。</strong>多项式乘指数或三角，往往要分部到幂次归零。每做一次，幂次降一，进退一目了然。</li>
        <li><strong>提示三：循环型移项后别漏系数。</strong><Katex tex="I=a-I" /> 给出 <Katex tex="I=a/2" />；如果前面带出 <Katex tex="4I" />，就是 <Katex tex="4I=a-I" />，解出 <Katex tex="I=a/5" />。</li>
        <li><strong>提示四：〈反、对、幂、三、指〉是次序不是铁律。</strong>遇上两类都能积的情形，选哪边都能算出，只是繁简不同；拿不准就两边各试一步比较。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPartsLab } from '../../../boards/calc1/integral/partslab.js';
import { IN_CHAPTERS } from './inav.js';
</script>
