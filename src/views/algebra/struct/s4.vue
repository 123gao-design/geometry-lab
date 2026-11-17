<template>
  <ChPage :cur="4" no="结4" base="/algebra/s" :chapters="AS_CHAPTERS"
    title="多项式环"
    sub="多项式按加乘构成环，除法得到的余式是一次以下的常数。余数定理把「除以 x−a 的余式」变成一句代值：余式就是 p(a)。余式为零，因式就出现。"
    :toc="[{ id: 's4-ring', t: '多项式构成环' }, { id: 's4-rem', t: '余数定理与综合除法' }, { id: 's4-factor', t: '因式与根' }, { id: 's4-tip', t: '四条提示' }]">
    <div class="note good">系数取自域 <Katex tex="\mathbb{F}" /> 的多项式全体 <Katex tex="\mathbb{F}[x]" /> 按通常的加法与乘法构成交换环。对 <Katex tex="p(x)" /> 与一次式 <Katex tex="x-a" />，存在唯一的商 <Katex tex="q(x)" /> 与常数 <Katex tex="r" /> 使 <Katex tex="p(x)=(x-a)q(x)+r" />，且 <b>r = p(a)</b>。特别地，<Katex tex="x-a" /> 整除 <Katex tex="p(x)" /> 当且仅当 <Katex tex="p(a)=0" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPoly" />
      <div class="cap">图 结4 · <b>余式与根</b>：蓝色曲线是 <Katex tex="p(x)=x^3-3x+2" />，黄色竖线与金点标出 <Katex tex="x=a" /> 处的高度。看点：① 拖动 a，金点沿曲线滑动，余式读数同步变化；② 金点落到 x 轴上，余式归零、整除成立；③ 紫色空圈是 p(x)=0 的根，其中 x=1 是重根，曲线在这里与轴相切。</div>
    </div>

    <h3 class="sec" id="s4-ring">多项式构成环</h3>
    <p>加法按同类项合并，乘法按分配律展开，两者相容，于是 <Katex tex="\mathbb{F}[x]" /> 是交换环。整数环与多项式环结构相似：都能做带余除法，都有唯一分解，这也是两者常被放在一起讲的原因。</p>
    <p>多项式相等指系数逐项相等，而不是在某几个点上取值相同。两个不同的多项式可以在一两个点重合，不能因此认为它们相等。</p>
    <p>次数给出一个层级：零多项式的次数约定为负无穷，非零多项式相乘次数相加。<Katex tex="\mathbb{F}[x]" /> 中的可逆元只有非零常数，与整数中只有 <Katex tex="\pm1" /> 可逆相对应。</p>

    <h3 class="sec" id="s4-rem">余数定理与综合除法</h3>
    <p>带余除法把被除式写成「除式乘商加余式」，余式次数低于除式。除式是一次式时，余式只能是常数，把 <Katex tex="x=a" /> 代入整条等式，<Katex tex="(a-a)q(a)" /> 一项消失，剩下的正是 <Katex tex="r=p(a)" />。</p>
    <p>计算上不必真的做除法：金点的高度就是余式。画板上 <Katex tex="p(x)=x^3-3x+2" /> 除以 <Katex tex="x-a" />，商是 <Katex tex="x^2+ax+(a^2-3)" />，余式 <Katex tex="a^3-3a+2" />，三项系数都随 <Katex tex="a" /> 现算。</p>
    <p>综合除法把这一过程排成一张表：系数降幂排列，交替乘 <Katex tex="a" /> 再相加，最后一格即余式。表比竖式省地方，验算也快。</p>

    <h3 class="sec" id="s4-factor">因式与根</h3>
    <p>余式为零等价于 <Katex tex="x-a" /> 是 <Katex tex="p(x)" /> 的因式，也等价于 <Katex tex="a" /> 是方程的根。三句话是同一件事的三种说法，做题时可以按方便挑一句用。</p>
    <p><Katex tex="n" /> 次多项式在复数域上恰有 <Katex tex="n" /> 个根（计重数），这是代数基本定理。画板上的三次多项式有三个根，其中 <Katex tex="x=1" /> 是二重的，曲线与轴相切而不穿过。</p>
    <p>有理根判别给出候选集：常数项因数除以首项系数因数。候选有限，逐个代入验余式即可筛出全部有理根。</p>

    <h3 class="sec" id="s4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：余式是一次以下的常数。</strong>除式是 <Katex tex="x-a" /> 时余式不能含 <Katex tex="x" />，否则说明除法没做完。</li>
        <li><strong>提示二：p(a)=0 只是必要条件的一半。</strong>它同时是充分条件，因式与根一一对应，不要只证一边就收笔。</li>
        <li><strong>提示三：重根要看导数。</strong>光滑地碰到轴而不穿过，说明 <Katex tex="p'(a)=0" />；只看函数值无法区分重数。</li>
        <li><strong>提示四：系数所在域影响可分解性。</strong><Katex tex="x^2+1" /> 在实数上不可约，在复数上分成两个一次式。谈因式分解先说明在哪个域上。</li>
      </ul>
    </div>
    <p>回收与预告：环、域的框架到这里告一段落。下一章换到群，从最小的例子出发：模 n 加法、克莱因四元群与置换群，用运算表逐条核对四条公理。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPoly } from '../../../boards/algebra/struct/poly.js';
import { AS_CHAPTERS } from './asnav.js';
</script>
