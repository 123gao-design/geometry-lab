<template>
  <ChPage :cur="1" no="结1" base="/algebra/s" :chapters="AS_CHAPTERS"
    title="二元运算与半群"
    sub="把加法、乘法这类规则抽出来，只留下一条：任取两个元素，按规则得到集合里唯一的一个元素。封闭加上结合律，得到的就是半群；再加幺元与逆元，才轮到群出场。"
    :toc="[{ id: 's1-op', t: '二元运算与运算表' }, { id: 's1-assoc', t: '结合律的分量' }, { id: 's1-ladder', t: '半群、幺半群、群' }, { id: 's1-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="S" /> 非空，映射 <Katex tex="*\colon S\times S\to S" /> 称为 <Katex tex="S" /> 上的<b>二元运算</b>。若对任意 <Katex tex="a,b,c" /> 有 <Katex tex="(a*b)*c=a*(b*c)" />，称运算满足<b>结合律</b>，<Katex tex="(S,*)" /> 构成<b>半群</b>；存在 <Katex tex="e" /> 使 <Katex tex="e*a=a*e=a" /> 时称 <Katex tex="e" /> 为幺元，半群升为<b>幺半群</b>；再要求每个元素有逆元，得到<b>群</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createOp" />
      <div class="cap">图 结1 · <b>运算表机</b>：模 n 加法、模 n 乘法、模 n 减法三张表，n 由滑块调整。看点：① 表里每格都有值，封闭性一眼可见；② 金色格是结果等于幺元的位置；③ 换到减法，橙色框标出结合律失效的那组输入。</div>
    </div>

    <h3 class="sec" id="s1-op">二元运算与运算表</h3>
    <p>有限集上的运算可以用一张表写全：行标取左元素、列标取右元素，交叉格填结果。表的每一格都必须落在集合内，这就是封闭性；只要有一个格空着或越过边界，运算就不成立。</p>
    <p>模 <Katex tex="n" /> 加法是最顺手的例子：<Katex tex="a*b=(a+b)\bmod n" />，结果永远落在 <Katex tex="\{0,1,\dots,n-1\}" /> 里。模 <Katex tex="n" /> 乘法同样如此，两者都满足交换律与结合律。</p>
    <p>减法也是封闭的，写起来与加法只差一个符号，性质却不同：<Katex tex="(a-b)-c" /> 与 <Katex tex="a-(b-c)" /> 一般不等，结合律失效。这张表把两个运算的区别直接摆了出来。</p>

    <h3 class="sec" id="s1-assoc">结合律的分量</h3>
    <p>结合律说括号怎么加都不影响结果，于是写 <Katex tex="a*b*c" /> 时不必说明先算哪一边。它是最基本的一条约束，乘法口诀表能用、矩阵连乘能用，都靠这一条。</p>
    <p>验证结合律要检查所有三元组。对 <Katex tex="n" /> 个元素，共有 <Katex tex="n^3" /> 组，画板上逐一试过并给出第一个反例。对一般的运算，证法通常是把两边都化到同一个表达式。</p>
    <p>交换律是另一条独立的规律：<Katex tex="a*b=b*a" />。矩阵乘法不交换但仍满足结合律，说明两条规律互不推导。画板上的表关于对角线对称与否，正好对应交换律成立与否。</p>

    <h3 class="sec" id="s1-ladder">半群、幺半群、群</h3>
    <p>三层的差别可以按「缺哪个条件」来记：只有封闭与结合是半群；补上幺元是幺半群；再补上逆元是群。自然数加法是半群兼幺半群（幺元为 0），去掉 0 后的正整数加法连幺元也没有，只是半群。</p>
    <p>逆元要求左右两边同时乘回幺元。只满足 <Katex tex="a*b=e" /> 一边不够，必须 <Katex tex="a*b=b*a=e" />。有限集上若左右逆元都存在，二者自动相等。</p>
    <p>画板的徽章按「先找结合律、再找幺元、最后查逆元」的顺序读。任一条断了，层级就停在对应位置，后面的条件不必再查。</p>

    <h3 class="sec" id="s1-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：运算要「任意两个」都有结果。</strong>只能对部分元素相乘的规则不算封闭，例如除法在整数上就出界。</li>
        <li><strong>提示二：结果必须唯一。</strong>一个输入只能对一个输出。多值规则（如开平方给两个结果）不是二元运算。</li>
        <li><strong>提示三：结合律与交换律互不蕴含。</strong>矩阵乘法结合但不交换；某些自定义运算交换但不结合。判断时分别检验。</li>
        <li><strong>提示四：幺元只有一个。</strong>若 <Katex tex="e" /> 与 <Katex tex="e'" /> 都是幺元，则 <Katex tex="e=e*e'=e'" />。逆元在幺元确定后也不重复。</li>
      </ul>
    </div>
    <p>回收与预告：在同一张表上再补一条要求——每个元素都能乘回幺元——就得到群。下一章把这条要求放进模 n 的结构，比较群、环、域三层。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createOp } from '../../../boards/algebra/struct/op.js';
import { AS_CHAPTERS } from './asnav.js';
</script>
