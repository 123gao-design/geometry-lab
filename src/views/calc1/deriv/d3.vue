<template>
  <ChPage :cur="3" no="微3" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="高阶导数与微分"
    sub="导数再求导得到二阶导数，它读的是曲线的弯向；把增量拆成「线性主部 + 高阶小量」，线性那部分叫微分。"
    :toc="[{ id: 'd3-d2', t: '二阶导数的意义' }, { id: 'd3-high', t: '高阶导数' }, { id: 'd3-diff', t: '微分的定义' }, { id: 'd3-form', t: '形式不变性' }]">

    <div class="note good" id="d3-d2">一阶导数给变化率，二阶导数给变化率的变化率。<Katex tex="y=f(x)" /> 在 <Katex tex="x_0" /> 处的<b>微分</b>是 <Katex tex="\mathrm{d}y=f'(x_0)\,\mathrm{d}x" />，它与真增量 <Katex tex="\Delta y" /> 相差一个 <Katex tex="\mathrm{d}x" /> 的高阶无穷小。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDiffLab" />
      <div class="cap">图 微3 · <b>微分</b>：从 <Katex tex="P" /> 走横距 <Katex tex="dx" />，蓝段是沿切线量出的 <Katex tex="dy" />，橙段是沿曲线量出的真增量 <Katex tex="\Delta y" />，绿段是两者之差。右栏列出三个数值与 <Katex tex="f''(x_0)" />。看点：把 <Katex tex="dx" /> 拖小，绿段按平方缩，蓝橙两段几乎重合。</div>
    </div>

    <h3 class="sec" id="d3-d2">二阶导数的意义</h3>
    <p>导函数 <Katex tex="f'(x)" /> 本身还是函数，可以对它再求导。<Katex tex="f'(x)" /> 的导数记作 <Katex tex="f''(x)" />，叫<b>二阶导数</b>。记号 <Katex tex="\dfrac{\mathrm{d}^2y}{\mathrm{d}x^2}" /> 也是这个意思，分母写两次是因为求了两次导。</p>
    <p>二阶导数描述曲线的弯曲方向。以 <Katex tex="y=x^2" /> 为例，<Katex tex="y'=2x" /> 从左到右由负变正，斜率一路增大，曲线向上弯；<Katex tex="y''=2>0" /> 正说明了这一点。反过来 <Katex tex="y=-x^2" /> 的 <Katex tex="y''=-2<0" />，斜率一路减小，曲线向下弯。</p>
    <p>把它放到物理里：位置 <Katex tex="s(t)" /> 的一阶导是速度，二阶导是加速度。加速度为正，速度在增大，这就是「向上弯」的那一侧。图 微3 右栏的 <Katex tex="f''(x_0)" /> 一栏，同时也是绿色误差段的近似系数：误差约为 <Katex tex="\tfrac12f''(x_0)\,\mathrm{d}x^2" />。</p>

    <h3 class="sec" id="d3-high">高阶导数</h3>
    <p>三阶、四阶乃至 <Katex tex="n" /> 阶导数依次定义为上一阶导数的导数，记作 <Katex tex="f'''(x)" />、<Katex tex="f^{(4)}(x)" />、<Katex tex="f^{(n)}(x)" />。三阶以上一律写成带括号的上标，避免与乘方混淆——<Katex tex="f^{(4)}" /> 不是 <Katex tex="f" /> 的四次方。</p>
    <p>几个常见的规律：<Katex tex="(\mathrm{e}^x)^{(n)}=\mathrm{e}^x" />，一直不变；<Katex tex="(\sin x)^{(n)}=\sin\left(x+\dfrac{n\pi}{2}\right)" />，每求一次导相当于相位前进四分之一圈；<Katex tex="(x^m)^{(n)}" /> 在 <Katex tex="n>m" /> 时恒为零，因为次数被一路降下来了。</p>
    <p>莱布尼茨公式给出乘积的高阶导数：</p>
    <p style="text-align:center"><Katex display tex="(uv)^{(n)}=\sum_{k=0}^{n}\binom{n}{k}u^{(k)}v^{(n-k)}" /></p>
    <p>它的形状与二项式展开完全一样，系数就是组合数。这不是巧合：求一次导相当于在 <Katex tex="u" />、<Katex tex="v" /> 之间分配一次「求导」，分配 <Katex tex="n" /> 次，方案数正是 <Katex tex="\binom nk" />。</p>

    <h3 class="sec" id="d3-diff">微分的定义</h3>
    <p>若函数的增量可以写成</p>
    <p style="text-align:center"><Katex display tex="\Delta y=A\,\Delta x+o(\Delta x)" /></p>
    <p>其中 <Katex tex="A" /> 不依赖 <Katex tex="\Delta x" />，就说 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处可微，并称 <Katex tex="A\,\Delta x" /> 为<b>微分</b>，记作 <Katex tex="\mathrm{d}y" />。可以证明 <Katex tex="A" /> 只能是 <Katex tex="f'(x_0)" />，所以</p>
    <p style="text-align:center"><Katex display tex="\mathrm{d}y=f'(x_0)\,\mathrm{d}x,\qquad \Delta y=\mathrm{d}y+o(\Delta x)" /></p>
    <p>自变量自身的微分规定为 <Katex tex="\mathrm{d}x=\Delta x" />，于是 <Katex tex="\mathrm{d}y=f'(x)\,\mathrm{d}x" />，这也解释了导数记号的来历：它真的是两个微分之比。</p>
    <p>一阶导数存在与可微是同一件事。但到二阶就不一样了：可微只用到了线性主部，而二阶导数还要求 <Katex tex="f'" /> 自己可导。图 微3 画的是这条分解——蓝色是主部，绿色是余项，余项比主部小一阶。</p>

    <h3 class="sec" id="d3-form">形式不变性</h3>
    <p>若 <Katex tex="y=f(u)" /> 而 <Katex tex="u" /> 又是 <Katex tex="x" /> 的函数，微分仍然写成 <Katex tex="\mathrm{d}y=f'(u)\,\mathrm{d}u" />。形式与 <Katex tex="u" /> 是自变量时完全一样，这叫<b>微分形式不变性</b>。</p>
    <p>把 <Katex tex="\mathrm{d}u=u'\,\mathrm{d}x" /> 代进去，就回到链式法则：<Katex tex="\mathrm{d}y=f'(u)u'\,\mathrm{d}x" />。所以形式不变性不是新定理，只是链式法则换了一种写法；但在积分一章里它很好用——凑微分正是把 <Katex tex="f'(u)\,\mathrm{d}u" /> 读成一整块。</p>
    <p>用微分作近似，就是丢掉余项：当 <Katex tex="\Delta x" /> 很小时，<Katex tex="f(x_0+\Delta x)\approx f(x_0)+f'(x_0)\Delta x" />。误差的量级是 <Katex tex="\Delta x^2" />，右栏的绿段就是它的实测长度。微6 的泰勒公式把这条近似继续往下展开，用更高次的多项式把余项压得更小。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="f''" /> 不是 <Katex tex="(f')^2" />。</strong>二阶导数是再求一次导，平方是同一个导函数自乘，两者完全不同。写 <Katex tex="\sin^2x" /> 与 <Katex tex="\sin''x" /> 也要分清：前者是函数值的平方，后者是对正弦求两次导。</li>
        <li><strong>提示二：微分不是增量。</strong><Katex tex="\mathrm{d}y" /> 是切线上的那段，<Katex tex="\Delta y" /> 是曲线上的那段。两者之差虽小，但性质不同：作近似时丢掉的正是一个二阶小量，不能用等号。</li>
        <li><strong>提示三：<Katex tex="\mathrm{d}x" /> 与 <Katex tex="\Delta x" /> 相等只对自变量成立。</strong>对中间变量 <Katex tex="u" /> 来说，<Katex tex="\mathrm{d}u" /> 是 <Katex tex="u" /> 的线性主部，一般不等于 <Katex tex="\Delta u" />。</li>
        <li><strong>提示四：凹凸性与二阶导数的关系要用在区间上。</strong>一点的 <Katex tex="f''(x_0)>0" /> 只说明该点附近向上弯，不能断言整段都凸。判整段的凹凸，必须在整个区间上讨论 <Katex tex="f''" /> 的符号。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDiffLab } from '../../../boards/calc1/deriv/difflab.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
