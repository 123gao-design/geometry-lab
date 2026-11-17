<template>
  <ChPage :cur="1" no="整1" base="/numtheory/z" :chapters="Z_CHAPTERS"
    title="整除与带余除法"
    sub="整数之间的除法并不总能除尽，但商与余数一定存在且唯一。带余除法把这一件事写成一条恒等式，此后所有同余、约数与分解的讨论都从它出发。"
    :toc="[{ id: 'z1-div', t: '带余除法' }, { id: 'z1-uniq', t: '商与余数唯一' }, { id: 'z1-exact', t: '整除与它的等价说法' }, { id: 'z1-class', t: '按余数分类' }, { id: 'z1-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="a" /> 是整数、<Katex tex="m" /> 是正整数。一定存在唯一的整数 <Katex tex="q" /> 与 <Katex tex="r" />，使得
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="a=mq+r,\qquad 0\le r<m." /></p>
      其中 <Katex tex="q" /> 叫商，<Katex tex="r" /> 叫余数。<Katex tex="r=0" /> 时称 <Katex tex="m" /> 整除 <Katex tex="a" />，记作 <Katex tex="m\mid a" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createDivMod" />
      <div class="cap">图 整1 · <b>整除与带余除法</b>：拖动两个滑块改变被除数与除数。看点：① 蓝块是排满的每一组 <Katex tex="m" />，橙块是最后一组不足 <Katex tex="m" /> 的部分，它的长度就是余数；② 数轴上的绿色竖线是 <Katex tex="m" /> 的倍数，<Katex tex="a" /> 永远落在相邻两条绿线之间；③ 把 <Katex tex="m" /> 调大，商变小而余数的范围 <Katex tex="[0,m)" /> 跟着变宽。</div>
    </div>

    <h3 class="sec" id="z1-div">带余除法</h3>
    <p>带余除法的操作就是小学的竖式除法：从 <Katex tex="a" /> 里一次次减去 <Katex tex="m" />，减到不够再减为止。减去的次数是商 <Katex tex="q" />，剩下的数是余数 <Katex tex="r" />。写成算式：</p>
    <p style="text-align:center"><Katex display tex="a=\underbrace{m+m+\cdots+m}_{q}+r." /></p>
    <p>这条式子把除法拆成两件事：<Katex tex="m" /> 能「装进」<Katex tex="a" /> 多少次，以及装完以后还剩多少。余数的范围 <Katex tex="0\le r<m" /> 是硬性约定——余数不能是负数，也不能等于 <Katex tex="m" />，否则商还可以再进一位。</p>
    <p>对负数要小心。按上面的约定，<Katex tex="-7" /> 除以 <Katex tex="3" /> 写成 <Katex tex="-7=3\times(-3)+2" />，商是 <Katex tex="-3" />、余数是 <Katex tex="2" />；写成 <Katex tex="-7=3\times(-2)-1" /> 虽然等式成立，但余数 <Katex tex="-1" /> 不在 <Katex tex="[0,3)" /> 里，不合约定。负数取余一律「向负无穷取整」，这一点在程序语言里对应 Python 的 <code>%</code>，而 C 语言与 JavaScript 的 <code>%</code> 取的是截断余数，两者在负数上不同。</p>

    <h3 class="sec" id="z1-uniq">商与余数唯一</h3>
    <p>唯一性并不显然，但证起来只有一句话。假设有两组写法：</p>
    <p style="text-align:center"><Katex display tex="a=mq_1+r_1=mq_2+r_2,\qquad 0\le r_1,r_2<m." /></p>
    <p>两式相减得 <Katex tex="m(q_1-q_2)=r_2-r_1" />，于是 <Katex tex="m\mid (r_2-r_1)" />。而 <Katex tex="r_1" /> 与 <Katex tex="r_2" /> 都在 <Katex tex="[0,m)" /> 里，它们的差落在 <Katex tex="(-m,m)" /> 内，能被 <Katex tex="m" /> 整除的只剩 <Katex tex="0" />。所以 <Katex tex="r_1=r_2" />，进而 <Katex tex="q_1=q_2" />。</p>
    <p>存在性则用良序性：集合 <Katex tex="\{\,a-mk: k\in\mathbb Z,\ a-mk\ge 0\,\}" /> 是非负整数集，必有最小元，取它为 <Katex tex="r" />，则 <Katex tex="r<m" />（否则 <Katex tex="r-m" /> 更小且仍非负）。</p>

    <h3 class="sec" id="z1-exact">整除与它的等价说法</h3>
    <p><Katex tex="m\mid a" /> 表示存在整数 <Katex tex="k" /> 使 <Katex tex="a=mk" />。这一句话可以换成几种说法，用哪一种取决于题目：</p>
    <ul>
      <li>带余除法里余数为零：<Katex tex="a=mq+0" />。</li>
      <li><Katex tex="a" /> 是 <Katex tex="m" /> 的倍数，<Katex tex="m" /> 是 <Katex tex="a" /> 的约数（因数）。</li>
      <li>在模 <Katex tex="m" /> 的意义下 <Katex tex="a" /> 与 <Katex tex="0" /> 同余，下一章会把这个记号写出来。</li>
    </ul>
    <p>整除有几条常用性质：若 <Katex tex="m\mid a" />、<Katex tex="m\mid b" />，则 <Katex tex="m\mid (a\pm b)" />；若 <Katex tex="m\mid a" />，则对任意整数 <Katex tex="k" /> 有 <Katex tex="m\mid ka" />；整除可以传递，<Katex tex="m\mid n" />、<Katex tex="n\mid a" /> 给出 <Katex tex="m\mid a" />。这三条合起来说明：<Katex tex="m" /> 的所有倍数构成一个对加减与数乘封闭的集合。</p>
    <p>还有一条容易被忽略：<Katex tex="m\mid a" /> 与 <Katex tex="m\mid -a" /> 等价，与 <Katex tex="|m|\mid |a|" /> 也等价。约数的正负不影响「能不能整除」这件事，所以讨论约数时通常只取正数。</p>

    <h3 class="sec" id="z1-class">按余数分类</h3>
    <p>把 <Katex tex="a" /> 换成不同的值，余数 <Katex tex="r" /> 只能取 <Katex tex="0,1,\dots,m-1" /> 这 <Katex tex="m" /> 个值。于是全部整数被分成 <Katex tex="m" /> 类：余数为 <Katex tex="r" /> 的所有整数组成一类，叫模 <Katex tex="m" /> 的一个<b>剩余类</b>。</p>
    <p>画板上的绿色竖线就是这些类的分界。同一个类里的数相差整数个 <Katex tex="m" />，它们在数轴上按 <Katex tex="m" /> 等间隔重复出现。模 <Katex tex="2" /> 分出奇偶两类，模 <Katex tex="7" /> 分出「星期」的七类，模 <Katex tex="10" /> 只留下个位数字——这些都是同一种分法。</p>
    <p>分类的好处是把无限多个整数压成有限个盒子。要证明「对一切整数 <Katex tex="n" /> 都有某性质」，可以只对 <Katex tex="m" /> 个余数逐一检验；余数只有有限个，这就把无限的问题变成了有限次检查。</p>

    <h3 class="sec" id="z1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：余数必须非负且小于除数。</strong><Katex tex="-7=3\times(-2)-1" /> 的右端虽然是 <Katex tex="-7" />，但余数 <Katex tex="-1" /> 不合格，正确的写法是 <Katex tex="-7=3\times(-3)+2" />。</li>
        <li><strong>提示二：除数不能为 0。</strong>带余除法要求 <Katex tex="m" /> 是正整数。除以 0 时商无从谈起，余数也无从谈起。</li>
        <li><strong>提示三：整除的写法是 <Katex tex="m\mid a" />，不是 <Katex tex="m/a" />。</strong>前者是一个判断真假的命题，后者是一个数。两者不能互换，答题时写错会被判为概念错误。</li>
        <li><strong>提示四：余数为零才叫整除。</strong><Katex tex="a" /> 除以 <Katex tex="m" /> 的余数是 <Katex tex="r" />，<Katex tex="m\mid a" /> 与 <Katex tex="r=0" /> 是同一件事；余数不为零时只能说「不整除」，不能把商当作除法的结果。</li>
      </ul>
    </div>
    <p>回收与预告：带余除法给出了商与余数这一对数。下一步追问：两个数的公共约数里最大的是谁，怎样把它算出来——把除法反复做下去，矩形就能被正方形铺满。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDivMod } from '../../../boards/numtheory/basic/divmodlab.js';
import { Z_CHAPTERS } from './znav.js';
</script>
