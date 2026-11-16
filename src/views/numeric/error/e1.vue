<template>
  <ChPage :cur="1" no="误1" base="/numeric/e" :chapters="NE_CHAPTERS"
    title="误差与有效数字"
    sub="用 π≈3.14 代替 π，差在哪里、差多少、这三位数字能不能信，是数值计算要先回答的三件事。"
    :toc="[{ id: 'e1-abs', t: '绝对误差与相对误差' }, { id: 'e1-sig', t: '有效数字' }, { id: 'e1-round', t: '四舍五入与截断' }, { id: 'e1-pit', t: '末位与实际精度' }]">

    <div class="note good" id="e1-abs">设 <Katex tex="x" /> 是真值，<Katex tex="x^*" /> 是它的近似值，则 <Katex tex="|x-x^*|" /> 叫<b>绝对误差</b>，<Katex tex="\dfrac{|x-x^*|}{|x|}" /> 叫<b>相对误差</b>。绝对误差带量纲，相对误差是一个比值，常用百分数表示。</div>

    <div class="board-wrap">
      <BoardMount :factory="createErrLab" />
      <div class="cap">图 误1 · <b>误差与有效数字机</b>：数轴被放大到「末位的 1 个单位」，金带是允许限 <Katex tex="\pm0.5" /> 个末位单位，橙线是真值，蓝点是近似值。看点：拖 <Katex tex="k" /> 改保留的小数位数，末位单位随之变小，橙线可能在金带内外来回跨；切到「直接截断」，同样的位数下橙线常常跌出金带，末位就不再算数。</div>
    </div>

    <h3 class="sec" id="e1-abs">绝对误差与相对误差</h3>
    <p><Katex tex="\pi=3.14159265\ldots" />，取 <Katex tex="3.14" /> 作近似值，绝对误差是 <Katex tex="0.00159265\ldots" />，相对误差是 <Katex tex="0.00159265/\pi\approx0.000507" />，即约 <Katex tex="0.05\%" />。同一个近似值，换成 <Katex tex="314" /> 作近似值时绝对误差放大一百倍、相对误差却一模一样——相对误差剔除了量级，两个不同量级的数据放在一起比精度，看的是它。</p>
    <p>绝对误差说明「差多少」，相对误差说明「差多少成」。测一根 10 米的绳子差了 1 厘米，与测一张 10 厘米的纸片差了 1 厘米，前者的相对误差只有千分之一，后者是百分之十，前者精确得多。图 误1 的两条横条把这两个量都读出来：误差条画到末位的百分之几，右栏则给出绝对误差与相对误差的具体数值。</p>
    <p>真值往往事先不知道，否则就不必近似了。能知道的只有<b>误差的界</b>：规定一个 <Katex tex="\varepsilon" />，使 <Katex tex="|x-x^*|\le\varepsilon" /> 一定成立。数值计算里说的「精度」，指的都是这个界，而不是碰巧算出来的差值。</p>

    <h3 class="sec" id="e1-sig">有效数字</h3>
    <p>近似值的数字不是都能信的。<b>有效数字</b>的定义是：若近似值 <Katex tex="x^*" /> 的绝对误差不超过末位的半个单位，则称它精确到这一位，从左起第一个非零数字到这一位为止的数字都叫有效数字。</p>
    <p>用这条定义去数位数最省事。它把「写了多少位」和「误差多大」绑在一起：只要实际误差不超过半个末位单位，写出来的每一位都可靠，位数就是有效数字的个数。误差一旦超过半个末位单位，末位就不可靠，有效数字比写出来的位数少一位。</p>
    <p>图 误1 把这条判据画成了图：金带就是「半个末位单位」，真值落在带内，所保留的每一位都可靠；真值跌出带外，末位作废。此时把数值改成科学记数法写，也能看出位数——<Katex tex="3.0\times10^{2}" /> 只有两位有效数字，末尾的 0 只是占位。</p>
    <p>数有效数字时，左边的 0 不算（<Katex tex="0.0032" /> 只有两位），中间的 0 算（<Katex tex="3.002" /> 是四位），右边末尾的 0 在近似数里算（<Katex tex="3.20" /> 是三位，说明精确到百分位）。</p>

    <h3 class="sec" id="e1-round">四舍五入与截断</h3>
    <p>取位的方法决定了允许限。<b>四舍五入</b>到小数点后 <Katex tex="k" /> 位，误差一定不超过 <Katex tex="0.5\times10^{-k}" />，正好是半个末位单位，所以四舍五入保留的每一位都是有效数字。</p>
    <p><b>直接截断</b>（只管舍、不管进）的误差可以接近 <Katex tex="1\times10^{-k}" />，是四舍五入的两倍。误差超过半个末位单位时，末位就不可靠了：<Katex tex="\pi" /> 截断到 4 位小数得 <Katex tex="3.1415" />，误差 <Katex tex="9.3\times10^{-5}" />，比 <Katex tex="5\times10^{-5}" /> 大，末位那个 5 就信不过，有效数字只有 4 位而不是 5 位。</p>
    <p>这也是计算中「多留一位」的来由：中间结果若四舍五入，允许限是半个末位；留一位余量再舍，舍入误差就不会把有效数字吃掉一位。</p>

    <h3 class="sec" id="e1-pit">末位与实际精度</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：位数多不等于精度高。</strong>把计算机算出的 3.141592653589793 全部抄下来，只是把中间过程的位数搬出来，实际精度仍由输入与算法决定。</li>
        <li><strong>提示二：末位相同的两个数，有效数字未必相同。</strong><Katex tex="3.14" /> 与 <Katex tex="3.140" /> 的误差界不同，后者声称精确到千分位。</li>
        <li><strong>提示三：截断不保证末位。</strong>截断的允许限是一整个末位单位，末位随时可能作废；只有四舍五入才与「写几位就有几位有效数字」一一对应。</li>
        <li><strong>提示四：相对误差才有可比性。</strong>绝对误差 0.01 用在 1 上很糟，用在 10000 上很好，单看绝对误差会误判。</li>
      </ul>
    </div>
    <p>回收与预告：本页只讨论「一个数写错多少」。实际计算要经过好几步运算，前一步的误差会顺着函数传到后一步，放大还是缩小由函数的斜率决定，这是误2 的内容。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createErrLab } from '../../../boards/numeric/error/errlab.js';
import { NE_CHAPTERS } from './enav.js';
</script>
