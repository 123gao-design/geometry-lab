<template>
  <ChPage :cur="2" no="比2" base="/sequences/g" :chapters="GQ_CHAPTERS"
    title="等比数列的性质与判定"
    sub="下标和相等，项积就相等；这条性质把相邻项的乘法关系推到相隔任意远的两项。判定一个数列是等比，可以看比值、看中项，也可以看通项是不是指数式。"
    :toc="[{ id: 'g2-prop', t: '下标和与项积' }, { id: 'g2-op', t: '乘除与片段和' }, { id: 'g2-judge', t: '判定三法' }, { id: 'g2-pit', t: '条件与符号' }]">
    <div class="note good">若 <Katex tex="m+n=p+q" />（<Katex tex="m,n,p,q\in\mathbb{N}^*" />），则 <Katex tex="a_ma_n=a_pa_q" />。特例是 <Katex tex="a_{n-k}a_{n+k}=a_n^2" />：以第 <Katex tex="n" /> 项为轴，左右等距的两项之积恒等于轴项的平方。这条性质与等差数列的下标和性质（等2）一一对应，只把「和」换成了「积」。</div>
    <div class="board-wrap">
      <BoardMount :factory="createIndexProd" />
      <div class="cap">图 比2 · <b>下标积性质</b>：上栏是各项，蓝色一对是 <Katex tex="a_{c-1}" /> 与 <Katex tex="a_{c+1}" />，橙色一对是 <Katex tex="a_{c-2}" /> 与 <Katex tex="a_{c+2}" />，金色是中心项 <Katex tex="a_c" />。下栏把两对的乘积与 <Katex tex="a_c^2" /> 画成三根条，三根始终等高。拖动 c 换中心，两条乘积随下标移动，等高线不动。</div>
    </div>

    <h3 class="sec" id="g2-prop">下标和与项积</h3>
    <p>用通项把两边都写开。左边 <Katex tex="a_ma_n=a_1q^{m-1}\cdot a_1q^{n-1}=a_1^2q^{m+n-2}" />，右边 <Katex tex="a_pa_q=a_1^2q^{p+q-2}" />。条件是 <Katex tex="m+n=p+q" />，两边指数相同，等式成立。</p>
    <p>取 <Katex tex="p=n-k,\ q=n+k" />，下标和是 <Katex tex="2n" />，与 <Katex tex="a_n\cdot a_n" /> 的下标和相同，于是</p>
    <p style="text-align:center"><Katex tex="a_{n-k}a_{n+k}=a_n^2" display /></p>
    <p>图 比2 上栏把这两对点画在以 <Katex tex="a_c" /> 为中线的两侧：项本身并不对称（等比数列的项按倍数缩放，远端更大或更小），对称的是<strong>乘积</strong>。这也是等比与等差在几何直观上的差别：等差数列对称的是项本身的高度，等比数列对称的是项的对数高度，乘积相等在数值上表现为三根条等高。</p>
    <p>逆用这条性质可以简化计算。例如已知 <Katex tex="a_2a_8=16" />，求 <Katex tex="a_5" />：下标和 <Katex tex="2+8=10=5+5" />，所以 <Katex tex="a_5^2=16" />，<Katex tex="a_5=\pm4" />。符号不能直接定为正：若公比为负，<Katex tex="a_5" /> 可能是负数，需要由其他条件（如各项为正）排除。</p>

    <h3 class="sec" id="g2-op">乘除与片段和</h3>
    <p>两个等比数列逐项相乘、相除，结果仍是等比数列。设 <Katex tex="\{a_n\}" /> 的公比为 <Katex tex="q_1" />，<Katex tex="\{b_n\}" /> 的公比为 <Katex tex="q_2" />，则</p>
    <p style="text-align:center">两列数逐项相乘，公比是 <Katex tex="q_1q_2" />；逐项相除，公比是 <Katex tex="\dfrac{q_1}{q_2}" />。</p>
    <p>同理 <Katex tex="\{a_n^2\}" /> 的公比是 <Katex tex="q^2" />，<Katex tex="\left\{\dfrac{1}{a_n}\right\}" /> 的公比是 <Katex tex="\dfrac1q" />。这些结论都只须把通项代进去验算一次，不必单记。</p>
    <p>还有一条常用的<strong>片段和</strong>性质：把等比数列每 <Katex tex="k" /> 项分成一组，各组之和仍是等比数列，公比为 <Katex tex="q^k" />。即 <Katex tex="S_k,\ S_{2k}-S_k,\ S_{3k}-S_{2k},\dots" /> 成等比。理由是把第二组每一项都提出 <Katex tex="q^k" />，剩下的正是第一组。使用前要确认 <Katex tex="q\ne-1" /> 且 <Katex tex="S_k\ne0" />，否则某一组之和为零，比值无意义。</p>

    <h3 class="sec" id="g2-judge">判定三法</h3>
    <p><strong>定义法。</strong>验证 <Katex tex="\dfrac{a_{n+1}}{a_n}" /> 是同一常数。这是最直接的方法，也最不容易出错；用之前先确认每一项都不为零。</p>
    <p><strong>中项法。</strong>验证 <Katex tex="a_{n+1}^2=a_na_{n+2}" /> 对一切 <Katex tex="n" /> 成立（且各项非零）。由它得 <Katex tex="\dfrac{a_{n+2}}{a_{n+1}}=\dfrac{a_{n+1}}{a_n}" />，比值恒定，与定义等价。</p>
    <p><strong>通项法。</strong>看通项能否写成 <Katex tex="a_n=c\,q^{\,n}" />（<Katex tex="c\ne0,\ q\ne0" />）的形式。凡是能化成「常数乘指数幂」的数列都是等比数列，且 <Katex tex="q" /> 就是公比。这类判定在给出 <Katex tex="S_n" /> 的题目里好用：若 <Katex tex="S_n=Aq^n-A" />（<Katex tex="A\ne0,\ q\ne1" />），则 <Katex tex="\{a_n\}" /> 是等比数列。</p>
    <p>三种方法殊途同归：定义看相邻两项，中项法看三项，通项法看整体形式。考试中给出递推式时用定义法，给出 <Katex tex="a_n" /> 的表达式时用通项法，给出三项关系时用中项法。</p>

    <h3 class="sec" id="g2-pit">条件与符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：下标和性质要求四项都是同一数列的项。</strong>把 <Katex tex="a_m a_n" /> 与 <Katex tex="a_p a_q" /> 比较时，四个下标都要在定义范围内。求 <Katex tex="a_{n-k}a_{n+k}" /> 还要 <Katex tex="n-k\ge1" />，端点附近的项不能配对。</li>
        <li><strong>提示二：开方后要判符号。</strong>由 <Katex tex="a_n^2=a_ma_p" /> 得 <Katex tex="a_n=\pm\sqrt{a_ma_p}" />，正负取决于公比的符号。只有题目明确各项为正，才能只取正根。</li>
        <li><strong>提示三：中项法要求各项非零。</strong>若数列中含有零项，<Katex tex="a_{n+1}^2=a_na_{n+2}" /> 可能成立而数列不是等比（例如 <Katex tex="1,0,0,0,\dots" />）。先确认各项非零，判定才有效。</li>
        <li><strong>提示四：片段和性质的附加条件。</strong><Katex tex="S_k,S_{2k}-S_k,\dots" /> 成等比的说法在 <Katex tex="q=-1" /> 且 <Katex tex="k" /> 为偶数时失效，因为此时 <Katex tex="S_k=0" />，比值没有定义。做题时先看 <Katex tex="q" /> 是否为 <Katex tex="-1" />，再看 <Katex tex="S_k" /> 是否为零。</li>
        <li><strong>提示五：两个数列之积的「项」不是两个项之积。</strong><Katex tex="\{(a_nb_n)\}" /> 的第 <Katex tex="n" /> 项是 <Katex tex="a_nb_n" />，不是 <Katex tex="a_pb_q" />。做下标运算时先明确每个数属于哪一列。</li>
      </ul>
    </div>
    <p>回收与预告：下标和性质是 等2「下标和」的乘法版本；等比数列前 <Katex tex="n" /> 项和见 比3，那里的错位相减正是把「相邻项相差一个 q 倍」这条性质用在了求和上。判定三法与 等1 的等差判定可以对照阅读。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createIndexProd } from '../../../boards/sequences/geo/indexprod.js';
import { GQ_CHAPTERS } from './gnav.js';
</script>
