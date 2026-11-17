<template>
  <ChPage :cur="4" no="微4" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="罗尔、拉格朗日与柯西中值定理"
    sub="一条曲线在区间两端的高度差，等于区间内部某一点的导数乘以区间长度；罗尔、拉格朗日、柯西三个定理说的都是这件事，只是把「高度」与「长度」换成了不同的量。"
    :toc="[{ id: 'd4-fermat', t: '费马引理' }, { id: 'd4-rolle', t: '罗尔定理' }, { id: 'd4-lagrange', t: '拉格朗日中值定理' }, { id: 'd4-cauchy', t: '柯西中值定理' }]">

    <div class="note good" id="d4-fermat">若 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上连续、在 <Katex tex="(a,b)" /> 内可导，则存在 <Katex tex="\xi\in(a,b)" /> 使 <Katex tex="f(b)-f(a)=f'(\xi)(b-a)" />。这是拉格朗日中值定理，其余两个定理都由它派生或与它并列。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMeanValue" />
      <div class="cap">图 微4 · <b>罗尔定理与拉格朗日中值定理</b>：蓝线是区间上的曲线，金色虚线连两端 <Katex tex="P" />、<Katex tex="Q" />，橙色是区间内与弦平行的切线。右栏列出两端函数值、弦斜率与切点处的导数。看点：无论换哪条曲线，平行切线总能在区间内部找到；罗尔定理是弦水平的那一档。</div>
    </div>

    <div class="board-wrap">
      <BoardMount :factory="createCauchyLab" />
      <div class="cap">图 微4b · <b>柯西中值定理</b>：把 <Katex tex="x=g(t)" />、<Katex tex="y=f(t)" /> 看成平面上的参数曲线，<Katex tex="t" /> 从 <Katex tex="1" /> 走到 <Katex tex="3" /> 时点沿蓝线从一端走到另一端。金线是弦 <Katex tex="AB" />，橙线是 <Katex tex="t^*" /> 处的切线。看点：切线方向与弦方向相同的时刻落在区间内部，两个变化率之比就等于弦斜率。</div>
    </div>

    <h3 class="sec" id="d4-fermat">费马引理</h3>
    <p>先从极值点说起。若 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处取极值，且在该点可导，则 <Katex tex="f'(x_0)=0" />。理由很直接：极值点两侧的差商符号相反，左侧差商与右侧差商要同时趋于同一个数，那个数只能是零。</p>
    <p>写成式子：若 <Katex tex="x_0" /> 是极大值点，则 <Katex tex="h>0" /> 时 <Katex tex="\dfrac{f(x_0+h)-f(x_0)}{h}\le0" />，<Katex tex="h<0" /> 时该差商 <Katex tex="\ge0" />。两侧极限都存在且等于 <Katex tex="f'(x_0)" />，于是 <Katex tex="f'(x_0)\le0" /> 与 <Katex tex="f'(x_0)\ge0" /> 同时成立，只能是零。</p>
    <p>费马引理给的是必要条件：可导的极值点一定是驻点。反过来不成立，<Katex tex="y=x^3" /> 在原点的导数为零，却既不是极大值点也不是极小值点。这条引理是罗尔定理证明里唯一的工具。</p>

    <h3 class="sec" id="d4-rolle">罗尔定理</h3>
    <p>若 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上连续、在 <Katex tex="(a,b)" /> 内可导，且 <Katex tex="f(a)=f(b)" />，则存在 <Katex tex="\xi\in(a,b)" /> 使 <Katex tex="f'(\xi)=0" />。</p>
    <p>证明分两种情形。若 <Katex tex="f" /> 在闭区间上恒为常数，则每一点的导数都是零，取区间内任一点即可。若不是常数，由闭区间上连续函数的最值定理，<Katex tex="f" /> 在区间上取到最大值 <Katex tex="M" /> 与最小值 <Katex tex="m" />，且 <Katex tex="M>m" />。两端函数值相等，所以 <Katex tex="M" /> 与 <Katex tex="m" /> 至少有一个在区间内部取到：若两端都已经是最小值，最大值必在内部；反之亦然。该内部点即为极值点，由费马引理其导数为零。</p>
    <p>几何上，罗尔定理说：两端等高的曲线，中间必有一处切线水平。图 微4 的「① 罗尔」一档画的就是这个情形，切点落在曲线的顶点上。三个条件缺一不可，后面提示里给出了对应的反例。</p>

    <h3 class="sec" id="d4-lagrange">拉格朗日中值定理</h3>
    <p>把罗尔的「两端等高」去掉，就得到拉格朗日定理：存在 <Katex tex="\xi\in(a,b)" /> 使</p>
    <p style="text-align:center"><Katex display tex="f(b)-f(a)=f'(\xi)(b-a)" /></p>
    <p>证明的办法是把斜的弦「扳平」。令 <Katex tex="k=\dfrac{f(b)-f(a)}{b-a}" />，作辅助函数 <Katex tex="\varphi(x)=f(x)-f(a)-k(x-a)" />。它满足 <Katex tex="\varphi(a)=0" />，且 <Katex tex="\varphi(b)=f(b)-f(a)-k(b-a)=0" />，对 <Katex tex="\varphi" /> 用罗尔定理即得 <Katex tex="\varphi'(\xi)=f'(\xi)-k=0" />。</p>
    <p>定理只管存在，不管怎么找。<Katex tex="\xi" /> 的位置依赖曲线形状，一般无法写出表达式；图 微4 的「② 拉格朗日」一档里有两个切点，说明满足条件的 <Katex tex="\xi" /> 也不必唯一。</p>
    <p>由它可以推出一串常用结论。若在区间上恒有 <Katex tex="f'(x)=0" />，则 <Katex tex="f" /> 为常数：任取两点，差等于某点导数乘以区间长度，为零。若 <Katex tex="f'(x)=g'(x)" />，则两者相差一个常数。若 <Katex tex="f'(x)>0" />，则 <Katex tex="f" /> 单调递增——这正是微7 讨论单调性时用的判据。</p>
    <p>中值定理也是证明不等式的工具。例如对 <Katex tex="\mathrm{e}^x" /> 在 <Katex tex="[0,x]" /> 上用定理，得 <Katex tex="\mathrm{e}^x-1=\mathrm{e}^{\xi}x" />，而 <Katex tex="\mathrm{e}^{\xi}\ge1" />（<Katex tex="x>0" /> 时），于是 <Katex tex="\mathrm{e}^x\ge1+x" />。这条不等式与微3 的线性近似 <Katex tex="f(x_0+\Delta x)\approx f(x_0)+f'(x_0)\Delta x" /> 是同一件事的严格版本。</p>

    <h3 class="sec" id="d4-cauchy">柯西中值定理</h3>
    <p>把拉格朗日定理里的自变量 <Katex tex="x" /> 换成另一个函数 <Katex tex="g(x)" />，就得到柯西定理：若 <Katex tex="f" />、<Katex tex="g" /> 在 <Katex tex="[a,b]" /> 上连续、在 <Katex tex="(a,b)" /> 内可导，且 <Katex tex="g'(x)\ne0" />，则存在 <Katex tex="\xi\in(a,b)" /> 使</p>
    <p style="text-align:center"><Katex display tex="\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(\xi)}{g'(\xi)}" /></p>
    <p>证明仍用辅助函数：<Katex tex="F(x)=[f(b)-f(a)]g(x)-[g(b)-g(a)]f(x)" />。直接验证 <Katex tex="F(a)=F(b)" />，对它用罗尔定理，再整理即得。当 <Katex tex="g(x)=x" /> 时，定理退化为拉格朗日定理。</p>
    <p>几何意义见图 微4b：把 <Katex tex="(g(t),f(t))" /> 看成平面上的一条曲线，<Katex tex="t" /> 从 <Katex tex="a" /> 走到 <Katex tex="b" /> 时曲线从 <Katex tex="A" /> 走到 <Katex tex="B" />。弦 <Katex tex="AB" /> 的斜率是纵坐标之差除以横坐标之差，某点切线的斜率是 <Katex tex="\dfrac{f'(t)}{g'(t)}" />，定理说两者必在区间内某处相等。</p>
    <p>柯西定理的价值在于处理两个同时变化的量。微5 的洛必达法则正是它推出的：把分子分母看成两个函数，比值的极限由两个导数的比值接管。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：三个条件缺一不可。</strong>罗尔定理要求闭区间连续、开区间可导、两端等高。少了连续，可取 <Katex tex="[0,1]" /> 上的分段函数（在 <Katex tex="x=1" /> 处跳到 1）说明；少了可导，可取 <Katex tex="y=|x|" /> 在 <Katex tex="[-1,1]" /> 上说明；少了等高，可取 <Katex tex="y=x" /> 在 <Katex tex="[0,1]" /> 上说明，它处处导数非零。</li>
        <li><strong>提示二：<Katex tex="\xi" /> 在开区间内，不在端点。</strong>定理说的是区间内部存在这样的点。端点处导数可能恰好也等于弦斜率，但那不算定理的内容，也不能拿端点去充当 <Katex tex="\xi" />。</li>
        <li><strong>提示三：定理只保证存在，不给出位置。</strong>做题时求出的 <Katex tex="\xi" /> 是某个满足条件的点，不一定唯一。若题目要「证明存在」，写出定理条件成立即可，不必解出 <Katex tex="\xi" />。</li>
        <li><strong>提示四：柯西定理要求 <Katex tex="g'\ne0" />。</strong>这个条件保证 <Katex tex="g(b)-g(a)\ne0" />，分母不为零；同时由罗尔定理，它也排除了 <Katex tex="g" /> 在两端取相同值的情形，否则结论里的分母为零，式子失去意义。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMeanValue } from '../../../boards/calc1/deriv/meanvalue.js';
import { createBoard as createCauchyLab } from '../../../boards/calc1/deriv/cauchylab.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
