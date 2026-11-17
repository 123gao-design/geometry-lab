<template>
  <ChPage :cur="1" no="比1" base="/sequences/g" :chapters="GQ_CHAPTERS"
    title="等比数列：定义、通项与等比中项"
    sub="每一项乘同一个数得到下一项，这样的数列叫等比数列。通项是 a₁ 乘上 q 的幂，图象落在一条指数曲线上；相邻两项之间插入的数叫等比中项，有两个候选。"
    :toc="[{ id: 'g1-def', t: '定义与公比' }, { id: 'g1-exp', t: '通项是指数式' }, { id: 'g1-mid', t: '等比中项' }, { id: 'g1-pit', t: 'q≠0 与两解' }]">
    <div class="note good">从第二项起，每一项与前一项的比都等于同一个常数 <Katex tex="q" />，这个数列叫<strong>等比数列</strong>，<Katex tex="q" /> 叫<strong>公比</strong>。定义写作 <Katex tex="\dfrac{a_{n+1}}{a_n}=q" />（<Katex tex="n\in\mathbb{N}^*" />），等价于 <Katex tex="a_{n+1}=qa_n" />。通项 <Katex tex="a_n=a_1q^{n-1}" />，其中 <Katex tex="a_1\ne0,\ q\ne0" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGeoSeq" />
      <div class="cap">图 比1 · <b>等比数列的项</b>：蓝点是各项，金色虚线是通项曲线（<Katex tex="q>0" /> 时可连成实曲线，<Katex tex="q<0" /> 时正负交替、只连折线）。下栏把相邻两项的比画成一排绿点，全部停在 <Katex tex="y=q" /> 的水平线上——比恒为常数，正是定义。预设 ①②③④ 分别是增大、减小、正负交替、常数列四种走向，拖 q 越过 0 与 1 可以看到它们之间的过渡。</div>
    </div>

    <h3 class="sec" id="g1-def">定义与公比</h3>
    <p>等比数列的定义只有一条：后项除以前项的商恒定。写成式子就是</p>
    <p style="text-align:center"><Katex tex="\dfrac{a_{n+1}}{a_n}=q\quad(n=1,2,3,\dots)" display /></p>
    <p>两个地方要留意。其一，商要能算，所以每一项都不能为零，公比也不能为零；一旦某一项为 0，后续各项按定义都成了 0，去讨论比值就没有意义。其二，<Katex tex="q" /> 可以为负：<Katex tex="q<0" /> 时相邻两项异号，整列数正负交替，图 比1 的预设 ③ 就是这种走向。</p>
    <p>判断一个数列是不是等比，只看「后项比前项」是否为同一个常数，不必先猜通项。反过来，知道某两项与公比，也能确定整列数：等比数列由 <Katex tex="a_1" /> 与 <Katex tex="q" /> 两个量完全确定，这和等差数列由首项与公差确定是同一格局。</p>

    <h3 class="sec" id="g1-exp">通项是指数式</h3>
    <p>由定义逐项乘下去：<Katex tex="a_2=a_1q" />，<Katex tex="a_3=a_1q^2" />，……，得到通项</p>
    <p style="text-align:center"><Katex tex="a_n=a_1q^{\,n-1}" display /></p>
    <p>把它改写为 <Katex tex="a_n=\dfrac{a_1}{q}\cdot q^{\,n}" />，就是「常数乘 <Katex tex="q" /> 的 <Katex tex="n" /> 次幂」。所以等比数列的图象是<strong>指数曲线上的孤立点</strong>：横坐标取正整数，纵坐标按固定倍数缩放。等差数列的图象落在一条直线上（等1），等比数列落在一条指数曲线上，两者恰好对应「加法」与「乘法」两种增长。</p>
    <p>由此可以读出单调性。<Katex tex="a_1>0" /> 时，<Katex tex="q>1" /> 各项递增，<Katex tex="0<q<1" /> 各项递减并趋近 0，<Katex tex="q=1" /> 各项相等，<Katex tex="q<0" /> 正负交替；<Katex tex="a_1<0" /> 时上述增减方向整体反过来。图 比1 下栏的绿点始终在同一高度，上栏点的走向则由 <Katex tex="q" /> 决定：比是常数，只是「按同一个倍数缩放」，缩放倍数大于 1 就越来越大，小于 1 就越来越小。</p>
    <p>通项还有一条常用的变形：<Katex tex="a_n=a_mq^{\,n-m}" />。已知任意一项与公比，都能跳到另一项；已知两项 <Katex tex="a_m,a_n" />，则 <Katex tex="q^{\,n-m}=\dfrac{a_n}{a_m}" />，先定公比再回代。这一式在 比2 的下标运算中反复使用。</p>

    <h3 class="sec" id="g1-mid">等比中项</h3>
    <p>若 <Katex tex="a,G,b" /> 三个数成等比数列，则 <Katex tex="G^2=ab" />，<Katex tex="G" /> 叫 <Katex tex="a" /> 与 <Katex tex="b" /> 的<strong>等比中项</strong>。解这个式子得</p>
    <p style="text-align:center"><Katex tex="G=\pm\sqrt{ab}\quad(ab>0)" display /></p>
    <p>与等差中项对照：等差中项是 <Katex tex="\dfrac{a+b}{2}" />，唯一；等比中项是 <Katex tex="\pm\sqrt{ab}" />，一般有两个，且要求 <Katex tex="ab>0" />。若 <Katex tex="a,b" /> 异号，平方根没有实数解，此时不存在等比中项——这是等比与等差在「中间插数」上的实质差别。</p>
    <p>为什么会有两个？因为公比可正可负：<Katex tex="a,G,b" /> 与 <Katex tex="a,-G,b" /> 的公比互为相反数，两列数都满足「后项比前项恒定」。做题时若题目说「插入一个数使三数成等比」，要连负号一起考虑；若限定「各项为正」，才只取正根。</p>

    <h3 class="sec" id="g1-pit">q≠0 与两解</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：公比不能为 0。</strong>定义中的比是除法，<Katex tex="q=0" /> 时从第二项起全为 0，比值无意义。题目给出「等比数列」时，默认各项非零、公比非零；自己设元时也要把 <Katex tex="q\ne0" /> 写进条件。</li>
        <li><strong>提示二：等比中项是两个数。</strong>由 <Katex tex="G^2=ab" /> 只得到 <Katex tex="|G|" />，正负两解都要保留，除非题目另有符号限制。只写 <Katex tex="\sqrt{ab}" /> 会漏解，这是与等差中项最容易混的一处。</li>
        <li><strong>提示三：首项与公比要一起定。</strong>通项 <Katex tex="a_n=a_1q^{n-1}" /> 有两个待定常数，需要两个条件。只用一项求不出公比；用两项求公比时，<Katex tex="q" /> 的符号由两项的符号决定（同号取正、异号取负），开方时不要只取正根。</li>
        <li><strong>提示四：由 <Katex tex="S_n" /> 求 <Katex tex="a_n" /> 要分 <Katex tex="n=1" />。</strong>等比数列的前 <Katex tex="n" /> 项和公式在 <Katex tex="q=1" /> 时分母为零，须单独写成 <Katex tex="S_n=na_1" />；由 <Katex tex="a_n=S_n-S_{n-1}" /> 反求通项时，这一式只对 <Katex tex="n\ge2" /> 成立，<Katex tex="a_1=S_1" /> 要另行核对，见 比3。</li>
      </ul>
    </div>
    <p>回收与预告：等比数列由「乘法」生成，通项是指数式；比2 讨论下标和与项积的对称性质以及判定方法；比3 求前 <Katex tex="n" /> 项和，用错位相减与线段拼接两种方式给出同一个公式。等差数列的对应内容见 等1 与 等3。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGeoSeq } from '../../../boards/sequences/geo/geoseq.js';
import { GQ_CHAPTERS } from './gnav.js';
</script>
