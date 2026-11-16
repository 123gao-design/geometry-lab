<template>
  <ChPage :cur="2" no="归2" base="/sequences/i" :chapters="IQ_CHAPTERS"
    title="归纳证明与归纳—猜想"
    sub="数列题常先算出前几项，猜出通项，再用归纳法证明。猜测提供方向，证明补上严密性；两步之中，第二步是把猜测的式子代入递推关系化简。"
    :toc="[{ id: 'i2-guess', t: '先算几项，再猜' }, { id: 'i2-step', t: '归纳步骤怎么走' }, { id: 'i2-eg', t: '两个例子' }, { id: 'i2-pit', t: '猜错、假设闲置与代错' }]">
    <div class="note good">归纳—猜想的流程：算出前若干项 → 观察规律并写出猜测 <Katex tex="a_n=f(n)" /> → 用数学归纳法证明。证明分两步：验证 <Katex tex="n=1" />（或起点）；假设 <Katex tex="a_k=f(k)" />，把它代入递推式，化简出 <Katex tex="a_{k+1}=f(k+1)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGuessProve" />
      <div class="cap">图 归2 · <b>归纳证明机</b>：左栏逐项计算 <Katex tex="a_{n+1}=\dfrac{a_n}{1+3a_n}" />，与公式 <Katex tex="\dfrac{1}{3n-2}" /> 并列对照，六项全部相符后下猜测；右栏做归纳步骤，把假设 <Katex tex="a_k=\dfrac{1}{3k-2}" /> 代入递推式，化简到 <Katex tex="\dfrac{1}{3(k+1)-2}" />。拖动 k，看右边的分母怎样随假设同步改写。</div>
    </div>

    <h3 class="sec" id="i2-guess">先算几项，再猜</h3>
    <p>给出递推式与首项时，通项往往不显然。先用递推式算前几项：以 <Katex tex="a_1=1" />、<Katex tex="a_{n+1}=\dfrac{a_n}{1+3a_n}" /> 为例，</p>
    <p style="text-align:center"><Katex tex="a_1=1,\quad a_2=\dfrac14,\quad a_3=\dfrac17,\quad a_4=\dfrac1{10}" display /></p>
    <p>分母 <Katex tex="1,4,7,10" /> 每次加 3，是以 1 为首项、3 为公差的等差数列，所以猜测</p>
    <p style="text-align:center"><Katex tex="a_n=\dfrac{1}{3n-2}" display /></p>
    <p>猜测的来源是有限项，有限项永远不能充当证明：前六项相符而第七项开始不符的数列是存在的。所以下一步必须用归纳法把猜测对「一切 <Katex tex="n" />」坐实。</p>
    <p>猜的形式也可以从 <Katex tex="S_n" /> 入手。若 <Katex tex="S_n=n^2" /> 一类形式明显，就先求 <Katex tex="a_n=S_n-S_{n-1}" /> 再猜；若通项是「等差乘等比」，可猜 <Katex tex="a_n=(An+B)q^{n-1}" />，用前几项定 <Katex tex="A,B" />。猜得准，归纳步骤就短。</p>

    <h3 class="sec" id="i2-step">归纳步骤怎么走</h3>
    <p>归纳步骤的目标是证出 <Katex tex="a_{k+1}=f(k+1)" />。做法是从递推式出发，把假设 <Katex tex="a_k=f(k)" /> 代进去，朝目标式化简。以上面的例子为例：</p>
    <p style="text-align:center"><Katex tex="a_{k+1}=\dfrac{a_k}{1+3a_k}=\dfrac{\dfrac{1}{3k-2}}{1+\dfrac{3}{3k-2}}=\dfrac{1}{3k+1}=\dfrac{1}{3(k+1)-2}" display /></p>
    <p>最后一步把 <Katex tex="3k+1" /> 改写为 <Katex tex="3(k+1)-2" />，正好是目标式在 <Katex tex="n=k+1" /> 时的样子。至此「<Katex tex="P(k)\Rightarrow P(k+1)" />」成立。再补上奠基 <Katex tex="a_1=1=\dfrac{1}{3\times1-2}" />，两步齐备，猜测成立。</p>
    <p>书写时把「目标」放在显眼处：先在草稿上写出 <Katex tex="f(k+1)" /> 的样子，再动笔化简。这样每一步变形都有的放矢，不会出现「化简到底却不知道要化成什么」的情况。</p>

    <h3 class="sec" id="i2-eg">两个例子</h3>
    <p><strong>例一：奇数求和。</strong>证明 <Katex tex="1+3+5+\dots+(2n-1)=n^2" />。奠基：<Katex tex="n=1" /> 时左边 <Katex tex="=1" />，右边 <Katex tex="=1" />。归纳：假设前 <Katex tex="k" /> 个奇数之和为 <Katex tex="k^2" />，则前 <Katex tex="k+1" /> 个之和为</p>
    <p style="text-align:center"><Katex tex="k^2+(2k+1)=(k+1)^2" display /></p>
    <p>命题对 <Katex tex="n=k+1" /> 成立。这一步只用到假设与新增的一项 <Katex tex="2(k+1)-1=2k+1" />，没有别的技巧。</p>
    <p><strong>例二：分式递推。</strong>即图 归2 的例子。奠基 <Katex tex="a_1=1=\dfrac{1}{3-2}" />；归纳步骤是把 <Katex tex="a_k=\dfrac{1}{3k-2}" /> 代入 <Katex tex="a_{k+1}=\dfrac{a_k}{1+3a_k}" />，化简后得到 <Katex tex="\dfrac{1}{3(k+1)-2}" />。两个例子的骨架相同：验起点、代假设、化到目标式。</p>
    <p>若递推式是 <Katex tex="a_{n+1}=2a_n+1" />，可先算几项 <Katex tex="1,3,7,15,\dots" />，猜 <Katex tex="a_n=2^n-1" />，再用归纳法证明：<Katex tex="a_{k+1}=2(2^k-1)+1=2^{k+1}-1" />。这个递推也可用 递2 的构造法直接求通项，两条路互相对照。</p>

    <h3 class="sec" id="i2-pit">猜错、假设闲置与代错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：猜测要有依据，且必须证明。</strong>猜错时归纳步骤会卡住——化简不到目标式，正好说明猜测有问题，回头重算前几项。猜对而漏了证明，则整个解答不完整。</li>
        <li><strong>提示二：假设必须真的代进去。</strong>归纳步骤里若没有出现 <Katex tex="a_k=f(k)" />，说明这一步与假设无关，通常是直接用了通项公式或用了别的结论，属于循环论证。</li>
        <li><strong>提示三：递推式要按原式代入。</strong>把 <Katex tex="a_{n+1}=\dfrac{a_n}{1+3a_n}" /> 写成 <Katex tex="a_{k+1}=\dfrac{a_{k+1}}{1+3a_{k+1}}" /> 一类的错位，会让化简无从下手。代入前先把递推式的下标对齐到 <Katex tex="k" />。</li>
        <li><strong>提示四：奠基的下标要与递推式对得上。</strong>若递推式只对 <Katex tex="n\ge2" /> 成立（首项由递推式推不出），奠基要验到能启动递推的那一项，必要时验两项。</li>
        <li><strong>提示五：猜出的公式要检查定义域。</strong>分式通项要确认分母不为零；含根号的要确认被开方式非负。归纳法证出的是「若各项有定义，则公式成立」，存在性还要另行说明（通常由递推式与首项保证）。</li>
      </ul>
    </div>
    <p>回收与预告：归纳法与 递2 的构造法处理同一类递推，一个给公式、一个证公式；与 递4 的特征根法也相通，那里用解方程直接写通项，这里用归纳验证猜测。数列模块的最后一组是用1 与 用2，讲增长、分期与不等式中的数列问题。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGuessProve } from '../../../boards/sequences/induct/guessprove.js';
import { IQ_CHAPTERS } from './inav.js';
</script>
