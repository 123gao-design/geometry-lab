<template>
  <ChPage :cur="3" no="结3" base="/algebra/s" :chapters="AS_CHAPTERS"
    title="同态与同构"
    sub="比较两个代数结构，不必逐个数元素，只要找出一张保持运算的映射。核记录被压成幺元的那些元素，像记录对方实际用到了多少；核平凡又与像重合，两个结构就完全一样。"
    :toc="[{ id: 's3-def', t: '同态的定义' }, { id: 's3-kernel', t: '核与像' }, { id: 's3-iso', t: '同构与等价' }, { id: 's3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="(G,*)" /> 与 <Katex tex="(G',\circ)" /> 是同一类结构，映射 <Katex tex="\varphi\colon G\to G'" /> 若满足 <Katex tex="\varphi(a*b)=\varphi(a)\circ\varphi(b)" />，称为<b>同态</b>。同态把幺元送到幺元、把逆元送到逆元。<b>核</b> <Katex tex="\ker\varphi=\varphi^{-1}(e')" /> 是被压到幺元的元素，<b>像</b>是 <Katex tex="\varphi(G)" />；核平凡且满射时，<Katex tex="\varphi" /> 是<b>同构</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createHom" />
      <div class="cap">图 结3 · <b>同态机</b>：<Katex tex="\mathbb{Z}_{12}\to\mathbb{Z}_m" /> 的取余映射，m 由按钮切换。看点：① 每个整数沿彩色线落到自己的余数；② 金线标出核——这些数全落到 0；③ m=12 时上下两排一一对应，映射成为同构。</div>
    </div>

    <h3 class="sec" id="s3-def">同态的定义</h3>
    <p>一条等式管住整个映射：先在左边运算再映射，与先分别映射再在右边运算，结果相同。有了这一条，指数法则、幂次方都在同态下保持，结构信息因此能搬过去。</p>
    <p>取余映射 <Katex tex="\varphi(x)=x\bmod m" /> 是最常用的例子：<Katex tex="(x+y)\bmod m=((x\bmod m)+(y\bmod m))\bmod m" />，加法被完整保留。</p>
    <p>同态不要求一一对应，也不要求满射。它只要求运算在映射下不出错，像里没被用到的元素与这里无关。</p>

    <h3 class="sec" id="s3-kernel">核与像</h3>
    <p>核是被映射压成幺元的元素集合。它一定包含幺元，一定对运算封闭，也一定吸收两边的乘法，是正规子群（环的情形是理想）。画板上金色的那些整数就是核。</p>
    <p>像衡量映射「覆盖了对方多少」。像也是群（或子环），它的大小等于定义域除以核的大小，这条计数关系是拉格朗日定理的直接推论。</p>
    <p>核越大，映射丢掉的信息越多；核只含幺元时，映射是单射，结构一点没丢。单射的同态把定义域原样嵌进对方。</p>

    <h3 class="sec" id="s3-iso">同构与等价</h3>
    <p>既是同态又是双射的映射叫同构，两个结构此时在代数上不可区分：元素可以改名，运算表完全一致。<Katex tex="\mathbb{Z}_{12}" /> 与 <Katex tex="\mathbb{Z}_{12}" /> 的同构是最平凡的一例，画板把 m 拨到 12 就是这个情形。</p>
    <p>同构把「相等」提升为「结构相同」：二面体群与某些置换群同构，循环群与模 <Katex tex="n" /> 加法群同构。这类对应让不同来源的问题互相借用结论。</p>
    <p>判断同构时看三样：阶是否相同、元素阶的分布是否相同、交换性是否一致。三者有一样不符，就不必再找映射。</p>

    <h3 class="sec" id="s3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：同态的两个运算可能写法不同。</strong>左边是加法、右边是乘法完全合法，等式按各自结构的运算书写。</li>
        <li><strong>提示二：核不是「映射为零的地方」的直观理解。</strong>它由幺元唯一确定：被送到 <Katex tex="e'" /> 的元素才算核，别按数值大小判断。</li>
        <li><strong>提示三：同态不一定保阶。</strong>元素的阶在像里只会变小或不变。<Katex tex="\mathbb{Z}_6\to\mathbb{Z}_3" /> 把阶 2 的元素也压成幺元。</li>
        <li><strong>提示四：同构必须双向。</strong>单有双射不够，还得是保运算的映射；两个大小相同的群未必同构。</li>
      </ul>
    </div>
    <p>回收与预告：同态把两个结构联系起来，也把定义域切成一块块原像。把每块当成一个整体，商结构就出现了；本章的核正是下一章商群的构造起点。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHom } from '../../../boards/algebra/struct/hom.js';
import { AS_CHAPTERS } from './asnav.js';
</script>
