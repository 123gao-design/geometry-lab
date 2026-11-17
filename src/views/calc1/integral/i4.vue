<template>
  <ChPage :cur="4" no="积4" base="/calc1/i" :chapters="IN_CHAPTERS"
    title="有理函数的积分"
    sub="两个多项式的商总可以积出来：先拆成部分分式，每一项都落在幂函数与对数这类基本形上。"
    :toc="[{ id: 'i4-form', t: '真分式与部分分式' }, { id: 'i4-four', t: '四类最简分式' }, { id: 'i4-improper', t: '假分式先除' }, { id: 'i4-step', t: '求待定系数' }]">

    <div class="note good" id="i4-form">有理函数 <Katex tex="P(x)/Q(x)" /> 的积分有固定套路：分子次数低于分母时，把分母分解成一次与二次因式，写成若干个最简分式之和，逐项积分。<Katex tex="\ln" /> 与 <Katex tex="\arctan" /> 就是在这一步出现的。</div>

    <div class="board-wrap">
      <BoardMount :factory="createRatLab" />
      <div class="cap">图 积4 · <b>有理函数的积分</b>：蓝线是原式，橙紫两条虚线是拆出来的每一项。看点：两条虚线逐点相加始终回到蓝线，右栏的「逐项和」与「原式」两栏在任何 <Katex tex="x_0" /> 上都一致，差值一栏恒为零。</div>
    </div>

    <h3 class="sec" id="i4-form">真分式与部分分式</h3>
    <p>分子次数小于分母次数的叫<b>真分式</b>，否则叫假分式。真分式总可以写成有限个下面四类最简分式之和：</p>
    <p style="text-align:center"><Katex display tex="\frac{A}{x-a},\quad \frac{A}{(x-a)^k},\quad \frac{Bx+C}{x^2+px+q},\quad \frac{Bx+C}{(x^2+px+q)^k}" /></p>
    <p>其中二次因式要保证 <Katex tex="p^2-4q<0" />，即在实数范围内不能再分解。分解的依据是「两个多项式相等，当且仅当对应项系数相等」，因此把右边通分后与左边逐项比对，就能定出待定系数。</p>
    <p>图 积4 的模式一是 <Katex tex="\dfrac{1}{x^2-1}=\dfrac{1/2}{x-1}-\dfrac{1/2}{x+1}" />。分母分解成两个一次因式，右端就设两个一次分式，通分后比对常数项与一次项，解出两个 <Katex tex="\tfrac12" />。两条虚线相加回到蓝线，说明分解是恒等变形，不是近似。</p>

    <h3 class="sec" id="i4-four">四类最简分式怎么积</h3>
    <p>第一类直接得对数：<Katex tex="\int\dfrac{A\,\mathrm{d}x}{x-a}=A\ln|x-a|+C" />。第二类多一个负幂次：<Katex tex="\int\dfrac{A\,\mathrm{d}x}{(x-a)^k}=\dfrac{A}{(1-k)(x-a)^{k-1}}+C" />。</p>
    <p>第三类要配方。令 <Katex tex="x^2+px+q=(x+p/2)^2+r^2" />，其中 <Katex tex="r^2=q-p^2/4>0" />，把分子凑成「分母的导数 + 常数」两块：</p>
    <p style="text-align:center"><Katex display tex="\int\frac{Bx+C}{x^2+px+q}\,\mathrm{d}x=\frac{B}{2}\ln\left(x^2+px+q\right)+\frac{2C-Bp}{2r}\arctan\frac{2x+p}{2r}+C" /></p>
    <p>前半是凑微分，后半是反正切。第四类在此基础上再用一次换元 <Katex tex="x+p/2=r\tan t" />，把高次幂化成 <Katex tex="\cos" /> 的偶次幂再降幂。这一类计算量大，中学与考研题里通常只出一、二次幂。</p>

    <h3 class="sec" id="i4-improper">假分式先除</h3>
    <p>分子次数不低于分母时，第一步是多项式除法，把假分式写成「多项式 + 真分式」：</p>
    <p style="text-align:center"><Katex display tex="\frac{x^2+1}{x-1}=x+1+\frac{2}{x-1}" /></p>
    <p>多项式那部分直接积，剩下的真分式再按上面的套路处理。图 积4 的模式三画的就是这一档：蓝线在原式那一侧，橙线 <Katex tex="x+1" /> 是斜渐近线，紫线 <Katex tex="2/(x-1)" /> 是剩下的尾巴，两条虚线相加仍是蓝线。</p>
    <p>这一步不能省。硬把假分式设成部分分式，未知量的个数会多出一批，通分比对时方程互相牵连，算起来更繁，也更容易错。</p>

    <h3 class="sec" id="i4-step">求待定系数</h3>
    <p>设好形式后有两种定法。一是通分后比较同次项系数，列出线性方程组；二是给 <Katex tex="x" /> 代入特殊值，每一步消去一批未知量。后者更快：分母的每个一次因式的根都代一次，往往一步就定下一个系数。</p>
    <p>两种方法可以混用——先代值定下简单的，再用比较系数补齐其余的。定完务必核验一次：把结果通分回去，与左端逐项对照，或者取一个随机的 <Katex tex="x_0" /> 数值比对（图 积4 的「差值」一栏做的就是这件事）。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：重因式要写全。</strong>分母有 <Katex tex="(x-a)^2" /> 时，要设 <Katex tex="\dfrac{A}{x-a}+\dfrac{B}{(x-a)^2}" /> 两项，只设一项定不出解。</li>
        <li><strong>提示二：不可约二次因式的分子是一次式。</strong>写成常数 <Katex tex="A" /> 会漏掉一个自由度，通分后必对不上。</li>
        <li><strong>提示三：假分式先做除法。</strong>分子次数不低于分母时，直接设部分分式会多出未知量，徒增计算。</li>
        <li><strong>提示四：结果里该出现 <Katex tex="\ln" /> 与 <Katex tex="\arctan" />。</strong>若算出来的只有幂函数，多半是配方或凑微分的环节出了错，回去看分母的判别式符号。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRatLab } from '../../../boards/calc1/integral/ratlab.js';
import { IN_CHAPTERS } from './inav.js';
</script>
