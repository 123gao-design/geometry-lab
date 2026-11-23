<template>
  <ChPage :cur="1" no="定1" base="/calc1/f" :chapters="DF_CHAPTERS"
    title="定积分的定义"
    sub="把区间切细、每段取一个高、把所有小矩形加起来，再看切细的极限 —— 四步得到的数就是定积分。"
    :toc="[{ id: 'f1-step', t: '分割、近似、求和、取极限' }, { id: 'f1-def', t: '定积分的定义' }, { id: 'f1-cond', t: '可积的条件' }, { id: 'f1-prop', t: '基本性质' }]">

    <div class="note good">对可积函数，定积分由积分区间和被积函数决定，细分方式和取样点的选择都给出同一个极限。</div>

    <div class="board-wrap">
      <BoardMount :factory="createRiemannSum" />
      <div class="cap">图 定1 · <b>定积分的定义</b>。选择取样法并增大 <Katex tex="n" />，观察区间加密时近似值趋向积分值。切换到 <Katex tex="y=x" />，用中点取样和偶数份分割观察正负两部分相抵。</div>
    </div>

    <h3 class="sec" id="f1-step">分割、近似、求和、取极限</h3>
    <p>设 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上有界。在区间里插入分点</p>
    <p style="text-align:center"><Katex display tex="a=x_0<x_1<\cdots<x_n=b" /></p>
    <p>把区间切成 <Katex tex="n" /> 段，第 <Katex tex="k" /> 段长 <Katex tex="\Delta x_k=x_k-x_{k-1}" />。在每段里任取一点 <Katex tex="\xi_k" />，将有向矩形面积 <Katex tex="f(\xi_k)\Delta x_k" /> 相加，得到<b>黎曼和</b></p>
    <p style="text-align:center"><Katex display tex="S_n=\sum_{k=1}^{n}f(\xi_k)\,\Delta x_k" /></p>
    <p>图 定1 中金色点是一处取样点，下方标尺对应这段的宽度。横轴上方的矩形计为正，下方的矩形计为负。速度—时间图中的<a href="#/physics/ch/motion2">有向面积与位移</a>也使用同样的符号约定。</p>

    <h3 class="sec" id="f1-def">定积分的定义</h3>
    <p>记最长的一段 <Katex tex="\lambda=\max\Delta x_k" />。若 <Katex tex="\lambda\to0" /> 时 <Katex tex="S_n" /> 趋于一个与分法、也与 <Katex tex="\xi_k" /> 取法都无关的常数 <Katex tex="I" />，就称 <Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上可积，<Katex tex="I" /> 记作</p>
    <p style="text-align:center"><Katex display tex="I=\int_a^b f(x)\,\mathrm{d}x" /></p>
    <p>三处细节值得留意。一是 <Katex tex="\lambda\to0" /> 而不是 <Katex tex="n\to\infty" />：只看段数不看宽度，分点全挤在一处时和数不会收敛。二是要求<b>与取法无关</b>：只要某种取法给出不同的极限，就不可积。三是这里的 <Katex tex="a<b" />，规定 <Katex tex="\int_b^a=-\int_a^b" />、<Katex tex="\int_a^a=0" />。</p>
    <p>图 定1 将黎曼和 <Katex tex="S_n" /> 与精确值 <Katex tex="I" /> 并列。误差 <Katex tex="S_n-I" /> 的符号表示近似值偏高还是偏低，误差的大小随函数和取样法变化。</p>

    <h3 class="sec" id="f1-cond">可积的条件</h3>
    <p>充分条件两条，用起来足够：闭区间上连续的函数可积；闭区间上有界且只有有限个间断点的函数也可积。反过来，可积只要求「不连续的地方测度为零」，这条要到实变函数才说得干净。</p>
    <p>必要条件是<b>有界</b>。若函数无界，总有一段上的函数值无界，改变该段的取样点可使黎曼和超出任何给定界限。端点或区间内部出现无界情形时，可以研究相应的反常积分，见 定4。</p>

    <h3 class="sec" id="f1-prop">基本性质</h3>
    <p>定积分的性质都由和数的性质平移过来：</p>
    <p style="text-align:center"><Katex display tex="\int_a^b(\alpha f+\beta g)=\alpha\int_a^b f+\beta\int_a^b g,\qquad \int_a^b f=\int_a^c f+\int_c^b f" /></p>
    <p>第二条叫区间可加，对 <Katex tex="c" /> 落在区间内外都成立（配合上面关于方向的规定）。此外 <Katex tex="f\ge0" /> 时 <Katex tex="\int_a^b f\ge0" />，由此得保序性 <Katex tex="f\le g\Rightarrow\int f\le\int g" />，以及估值 <Katex tex="m(b-a)\le\int_a^b f\le M(b-a)" />。</p>
    <p>估值式有一个直接的用处：不必算出积分，就能框出它落在哪个数附近。积分中值定理把这件事说得更细——连续时存在 <Katex tex="\xi" /> 使 <Katex tex="\int_a^b f=f(\xi)(b-a)" />，即存在一条同底等高的矩形与原面积相等。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：定积分是数，不定积分是函数族。</strong>两者记号相近，含义相差很远。算完定积分还带 <Katex tex="+C" />，一定是把两件事混了。</li>
        <li><strong>提示二：与积分变量无关。</strong><Katex tex="\int_a^b f(x)\mathrm{d}x" /> 与 <Katex tex="\int_a^b f(t)\mathrm{d}t" /> 是同一个数，换字母不影响结果。</li>
        <li><strong>提示三：交换上下限要变号。</strong><Katex tex="\int_b^a=-\int_a^b" />，这条在区间可加里经常用到，漏掉符号是常见错。</li>
        <li><strong>提示四：有界是可积的前提。</strong>被积函数在区间内无界时，不能直接套用定积分，要走反常积分那一路。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRiemannSum } from '../../../boards/calc1/definite/riemannsum.js';
import { DF_CHAPTERS } from './fnav.js';
</script>
