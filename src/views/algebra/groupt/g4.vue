<template>
  <ChPage :cur="4" no="群4" base="/algebra/g" :chapters="AG_CHAPTERS"
    title="群同态基本定理"
    sub="同态把定义域压到像上，压成幺元的那些元素组成核。把核整块抹掉，剩下的结构与像完全一样。一条等式把同态、核、商群、像串在一起。"
    :toc="[{ id: 'g4-map', t: '整数到剩余类的同态' }, { id: 'g4-thm', t: '基本定理的陈述' }, { id: 'g4-use', t: '计数与判断' }, { id: 'g4-tip', t: '四条提示' }]">
    <div class="note good"><b>群同态基本定理</b>：设 <Katex tex="\varphi\colon G\to G'" /> 是群同态，<Katex tex="\ker\varphi" /> 是正规子群，则 <Katex tex="G/\ker\varphi\cong\operatorname{im}\varphi" />，同构由 <Katex tex="g\ker\varphi\mapsto\varphi(g)" /> 给出。它把「定义域模掉核」与「像」这两样东西认成了同一个群。</div>

    <div class="board-wrap">
      <BoardMount :factory="createFundhom" />
      <div class="cap">图 群4 · <b>取余同态机</b>：整数沿彩色线送到 <Katex tex="\mathbb{Z}_n" />，模数由滑块控制。看点：① 金色整数是核 <Katex tex="n\mathbb{Z}" />，全部压到 0；② 同余的整数落到同一列；③ 核的大小与商群阶都等于 n，像也是 <Katex tex="\mathbb{Z}_n" />。</div>
    </div>

    <h3 class="sec" id="g4-map">整数到剩余类的同态</h3>
    <p><Katex tex="\varphi(x)=x\bmod n" /> 把整数映到 <Katex tex="\mathbb{Z}_n" />，加法被完整保留。它是满射：0 到 <Katex tex="n-1" /> 每个剩余类都取到。</p>
    <p>核是全部倍数 <Katex tex="n\mathbb{Z}=\{\dots,-n,0,n,2n,\dots\}" />。这些整数彼此相差 <Katex tex="n" />，正好构成一个子群，也正好是同态丢掉的全部信息。</p>
    <p>商群 <Katex tex="\mathbb{Z}/n\mathbb{Z}" /> 的每个元素是一整列倍数，与 <Katex tex="\mathbb{Z}_n" /> 的一个剩余类一一对应。两边加法一致，这就是同构。</p>

    <h3 class="sec" id="g4-thm">基本定理的陈述</h3>
    <p>定理分三步：核正规、商群存在、映射 <Katex tex="g\ker\varphi\mapsto\varphi(g)" /> 是同构。前两步上一章已经解决，关键在第三步——这张映射良定义、保运算、双射。</p>
    <p>良定义来自核的性质：同一陪集里两个元素相差一个核元素，映射后值相同。保运算来自 <Katex tex="\varphi" /> 本身。单射来自核被完全压平，满射来自像的定义。四条一一对上。</p>
    <p>定理的另一半是反过来的：每个正规子群都给出一个商同态，其核恰是这个正规子群。于是正规子群与满同态的核构成一一对应。</p>

    <h3 class="sec" id="g4-use">计数与判断</h3>
    <p>由同构得 <Katex tex="|G|=|\ker\varphi|\cdot|\operatorname{im}\varphi|" />，同态两端的大小关系一眼可算。这也是拉格朗日定理在同态上的形式。</p>
    <p>判断两个结构是否同构，可以先找一个自然的同态，再看核是否平凡、像是否占满。两条都成立时，同构立刻到手，不必再构造逆映射。</p>
    <p>常见例子：行列式是矩阵乘法群到数乘群的同态，核是特殊线性群；符号映射 <Katex tex="S_n\to\{\pm1\}" /> 的核是交错群，指数为 2。</p>

    <h3 class="sec" id="g4-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：核是定义域的子群，像在陪域里。</strong>两者在不同的群里，不能直接比较大小以外的性质。</li>
        <li><strong>提示二：商群与像同构，不是相等。</strong>元素的形式不同，一条明确的映射把两边对应起来才叫同构。</li>
        <li><strong>提示三：核平凡才有单射。</strong>同态若把非幺元压成幺元，映射就不可能是单射，商群会非平凡。</li>
        <li><strong>提示四：循环群的商群仍是循环群。</strong>同态像也循环。由基本定理可知，<Katex tex="\mathbb{Z}/n\mathbb{Z}\cong\mathbb{Z}_n" /> 直接从这边得到。</li>
      </ul>
    </div>
    <p>回收与预告：所有有限群都能塞进某个置换群，这是凯莱定理。下一章把置换写成轮换，用箭头图看它们怎么挪动元素。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createFundhom } from '../../../boards/algebra/groupt/fundhom.js';
import { AG_CHAPTERS } from './agnav.js';
</script>
