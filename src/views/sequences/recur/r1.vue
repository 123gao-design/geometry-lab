<template>
  <ChPage :cur="1" no="递1" base="/sequences/r" :chapters="RQ_CHAPTERS"
    title="累加法与累乘法"
    sub="相邻两项的差或比能写成序号 n 的式子时，把每一步分别写出来再全部相加（相乘），中间项两两相消，只剩下首末两端。"
    :toc="[{ id: 'r1-add', t: '累加法' }, { id: 'r1-mul', t: '累乘法' }, { id: 'r1-which', t: '用哪一个' }, { id: 'r1-pit', t: '项数、范围与验证' }]">
    <div class="note good">若 <Katex tex="a_{n+1}-a_n=f(n)" />，把 <Katex tex="n=1,2,\dots,n" /> 的 <Katex tex="n" /> 个式子相加，得 <Katex tex="a_{n+1}-a_1=\sum_{k=1}^{n}f(k)" />，这一方法叫<strong>累加法</strong>。若 <Katex tex="a_{n+1}/a_n=g(n)" />（各项不为零），把这些式子相乘，得 <Katex tex="a_{n+1}=a_1\prod_{k=1}^{n}g(k)" />，叫<strong>累乘法</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createAddMul" />
      <div class="cap">图 递1 · <b>累加法与累乘法</b>：蓝点是数列各项，金色虚线把它们连起来，绿色竖段是每一步的差（或比值）。预设 ①② 的差分别是 <Katex tex="k" /> 与 <Katex tex="2k-1" />，所有绿段首尾相接正好补齐首项到第 n+1 项的高度差；预设 ③ 把加换成乘，各步的比逐一相乘后分子分母错位相消。拖动 n 看右侧求和式与通项同步改写。</div>
    </div>

    <h3 class="sec" id="r1-add">累加法</h3>
    <p>写开递推式：<Katex tex="a_2-a_1=f(1)" />，<Katex tex="a_3-a_2=f(2)" />，……，<Katex tex="a_{n+1}-a_n=f(n)" />。将左边全部相加，<Katex tex="-a_1+a_1" />、<Katex tex="-a_2+a_2" /> 这样成对抵消，只剩 <Katex tex="a_{n+1}-a_1" />；右边全部相加，得到 <Katex tex="\sum_{k=1}^{n}f(k)" />。于是</p>
    <p style="text-align:center"><Katex tex="a_{n+1}=a_1+\sum_{k=1}^{n}f(k)" display /></p>
    <p>内容就是「等差数列求和公式」的一般化：差为常数时右边是 <Katex tex="nd" />，差为 <Katex tex="k" /> 时右边是 <Katex tex="1+2+\dots+n=\dfrac{n(n+1)}{2}" />，差为 <Katex tex="2k-1" /> 时右边是 <Katex tex="n^2" />。图 递1 的 ①② 正是后两种。</p>
    <p>求和这一步要真的把 <Katex tex="\sum f(k)" /> 算出来，才知道通项。常见的有：<Katex tex="\sum k=\dfrac{n(n+1)}{2}" />、<Katex tex="\sum k^2=\dfrac{n(n+1)(2n+1)}{6}" />、<Katex tex="\sum \dfrac{1}{k(k+1)}=1-\dfrac{1}{n+1}" />（裂项，见 和1）。求不出来时只能写成求和号，得不到闭合的通项。</p>

    <h3 class="sec" id="r1-mul">累乘法</h3>
    <p>写开比值：<Katex tex="\dfrac{a_2}{a_1}=g(1)" />，<Katex tex="\dfrac{a_3}{a_2}=g(2)" />，……，<Katex tex="\dfrac{a_{n+1}}{a_n}=g(n)" />。全部相乘，左边的 <Katex tex="a_2,a_3,\dots,a_n" /> 在分子分母上各出现一次，成对消去，只剩 <Katex tex="\dfrac{a_{n+1}}{a_1}" />，于是</p>
    <p style="text-align:center"><Katex tex="a_{n+1}=a_1\prod_{k=1}^{n}g(k)" display /></p>
    <p>图 递1 的预设 ③ 取 <Katex tex="g(k)=\dfrac{k+1}{k}" />，连乘后右侧是 <Katex tex="\dfrac{2}{1}\cdot\dfrac{3}{2}\cdots\dfrac{n+1}{n}=n+1" />，所以 <Katex tex="a_{n+1}=a_1(n+1)" />，即 <Katex tex="a_n=na_1" />。等比数列是这一式在 <Katex tex="g(k)" /> 恒等于 <Katex tex="q" /> 时的特例，此时连乘给出 <Katex tex="a_n=a_1q^{n-1}" />。</p>
    <p>累乘要求每个 <Katex tex="a_k\ne0" />；一旦某一项为零，比值没有意义，只能把数列从零项处截断后分段讨论，或改用其他方法。</p>

    <h3 class="sec" id="r1-which">用哪一个</h3>
    <p>看递推式的形式：差能被单独分离成 <Katex tex="a_{n+1}-a_n" /> 时用累加，比能被单独分离成 <Katex tex="a_{n+1}/a_n" /> 时用累乘。判断的办法是把式子移到一边，看左边能否化为这两种形式之一。</p>
    <p>例如 <Katex tex="a_{n+1}=a_n+2n+1" /> 移项即得差式，属累加；<Katex tex="a_{n+1}=\dfrac{n+1}{n}a_n" /> 两边除以 <Katex tex="a_n" /> 即得比式，属累乘。若递推式是 <Katex tex="a_{n+1}=2a_n+1" />，两种都分不出来，须先构造（递2）；若是 <Katex tex="a_{n+1}=2a_n+2^{n}" />，可以先除以 <Katex tex="2^{n+1}" /> 再累加，属于「先化形再用」。</p>
    <p>两种方法都属于「逐项写出、整体求和（积）」的思路，与 等3 的倒序相加、比3 的错位相减同出一源：都是利用抵消把 <Katex tex="n" /> 个式子压缩成两三项。</p>

    <h3 class="sec" id="r1-pit">项数、范围与验证</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：求和的上限是 <Katex tex="n" /> 不是 <Katex tex="n+1" />。</strong>累加得到的是 <Katex tex="a_{n+1}-a_1" />，从 <Katex tex="a_1" /> 走到 <Katex tex="a_{n+1}" /> 共 <Katex tex="n" /> 步，求和到 <Katex tex="f(n)" /> 为止。写成 <Katex tex="\sum_{k=1}^{n+1}" /> 就多算了一步。</li>
        <li><strong>提示二：结果的下标要随之减一。</strong>算出 <Katex tex="a_{n+1}" /> 的式子后，把 <Katex tex="n" /> 换成 <Katex tex="n-1" /> 才得 <Katex tex="a_n" />（<Katex tex="n\ge2" />），再单独验证 <Katex tex="n=1" /> 是否也符合。若 <Katex tex="n=1" /> 不合，通项要分段写。</li>
        <li><strong>提示三：累乘须各项非零。</strong>已知 <Katex tex="a_{n+1}=2na_n" /> 且 <Katex tex="a_1=0" /> 时，整列数都是 0，累乘的除法不成立；此时直接由递推式读出答案，不必套公式。</li>
        <li><strong>提示四：差（比）必须是同一形式。</strong>若递推式是 <Katex tex="a_{n+1}-a_n=2^n\cdot n" /> 这类乘积，累加本身仍成立，但求和要用错位相减（和2）；若差式里混着 <Katex tex="a_n" /> 本身（如 <Katex tex="a_{n+1}-a_n=2a_n" />），移项得 <Katex tex="a_{n+1}=3a_n" />，应改用累乘或直接读作等比。</li>
      </ul>
    </div>
    <p>回收与预告：累加、累乘处理的是「差或比只与 n 有关」的情形；递2 处理差（比）里还带着 <Katex tex="a_n" /> 的一次式，靠平移把常数项消掉，化为等比；递3 把递推式看成映射，用蛛网图读收敛；递4 处理二阶线性递推，用特征方程直接解出通项。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAddMul } from '../../../boards/sequences/recur/addmul.js';
import { RQ_CHAPTERS } from './rnav.js';
</script>
