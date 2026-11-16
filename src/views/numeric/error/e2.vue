<template>
  <ChPage :cur="2" no="误2" base="/numeric/e" :chapters="NE_CHAPTERS"
    title="误差的传播与条件数"
    sub="输入的误差经过一步运算之后变成输出误差，放大还是缩小由函数在这一点的斜率决定。同一个 Δx 换到不同的函数上，结果的可靠程度可以差出好几倍。"
    :toc="[{ id: 'e2-prop', t: '一步运算的误差' }, { id: 'e2-rule', t: '加减与乘除的算法' }, { id: 'e2-cond', t: '条件数' }, { id: 'e2-pit', t: '相消与病态' }]">

    <div class="note good" id="e2-prop">设 <Katex tex="y=f(x)" />，输入带误差 <Katex tex="\Delta x" />，则输出的误差约为 <Katex tex="|\Delta y|\approx|f'(x_0)|\cdot\Delta x" />。这是把曲线在这一段上换成了切线，误差越小、曲线越平缓，这条近似越准。</div>

    <div class="board-wrap">
      <BoardMount :factory="createErrProp" />
      <div class="cap">图 误2 · <b>误差传播机</b>：蓝带是输入 <Katex tex="x_0" /> 的误差范围，金色虚线是这一点的切线，右侧红条是被函数放大之后的输出范围。看点：换四个函数，同样的 <Katex tex="\Delta x" /> 换来的 <Katex tex="\Delta y" /> 差别很大；把 <Katex tex="x_0" /> 拖向 <Katex tex="x=1" /> 的右边，<Katex tex="x-1" /> 这一档的放大倍数会一路涨上去。</div>
    </div>

    <h3 class="sec" id="e2-prop">一步运算的误差</h3>
    <p>曲线在 <Katex tex="x_0" /> 附近可以用切线代替：<Katex tex="f(x_0+\Delta x)\approx f(x_0)+f'(x_0)\Delta x" />。两边减去 <Katex tex="f(x_0)" />，就是误差的传播公式。它说的是一件很朴素的事——曲线陡的地方，横着动一点，纵着就动很多。</p>
    <p>对这个式子取绝对值，<Katex tex="|\Delta y|\approx|f'(x_0)|\cdot|\Delta x|" />，斜率充当了放大倍数。斜率小于 1 的运算会削弱误差，比如开方；斜率大于 1 的会放大误差，比如平方。</p>
    <p>图 误2 的右侧红条就是按这个倍数画出来的。蓝带越宽、切线越陡，红条就越长。把切线换成曲线本身，红条两端会稍微歪一点，歪多少正是被忽略的二阶项 <Katex tex="\tfrac12f''(x_0)(\Delta x)^2" />。</p>

    <h3 class="sec" id="e2-rule">加减与乘除的算法</h3>
    <p><b>加减法</b>看绝对误差。由 <Katex tex="\Delta(u\pm v)=\Delta u\pm\Delta v" /> 取上界，得 <Katex tex="|\Delta(u\pm v)|\le|\Delta u|+|\Delta v|" />，绝对误差相加，与两个数本身的大小无关。</p>
    <p><b>乘除法</b>看相对误差。由 <Katex tex="\Delta(uv)\approx u\Delta v+v\Delta u" /> 两边除以 <Katex tex="uv" />，得相对误差相加：<Katex tex="\left|\dfrac{\Delta(uv)}{uv}\right|\lesssim\left|\dfrac{\Delta u}{u}\right|+\left|\dfrac{\Delta v}{v}\right|" />。除法只有一处符号变化，结论相同。</p>
    <p>两条规则可以互相换算，但用哪一条更省事取决于运算。一串加减混算的数据，把每一步的绝对误差加起来估总误差；一串乘除，就把相对误差加起来。累加几十项时，相对误差能保持，绝对误差会滚成一大团，这也是取平均值能提高精度的原因——把 <Katex tex="n" /> 个独立的同精度测量取平均，绝对误差缩到 <Katex tex="1/n" />。</p>

    <h3 class="sec" id="e2-cond">条件数</h3>
    <p>把输出的相对误差与输入的相对误差相除，得到 <Katex tex="C=\left|\dfrac{xf'(x)}{f(x)}\right|" />，称为这一步计算的<b>条件数</b>。它只由函数和取值位置决定，与误差本身多大无关，衡量的是这个问题「好不好算」。</p>
    <p>乘方 <Katex tex="x^n" /> 的条件数是 <Katex tex="n" />：平方翻倍、立方变三倍。开方 <Katex tex="\sqrt x" /> 是 <Katex tex="\tfrac12" />，误差减半，开方是难得的能把数据算准的运算。取倒数 <Katex tex="1/x" /> 的条件数是 1，相对误差原样保留——它放大的是绝对误差，因为函数在这一段陡。</p>
    <p>条件数很大时称这个问题是<b>病态</b>的。病态问题的输入稍有扰动，输出就面目全非，再好的算法也救不回来，因为误差在问题本身里就已经被放大了。</p>

    <h3 class="sec" id="e2-pit">相消与病态</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：两个相近的数相减会吃掉有效数字。</strong><Katex tex="1.234567-1.234560=0.000007" />，两个七位有效数字的数一减，结果只剩一位。绝对误差没变，相对误差却放大了上千倍。遇到相消，先变形再算：<Katex tex="\sqrt{x+1}-\sqrt x" /> 写成 <Katex tex="1/(\sqrt{x+1}+\sqrt x)" />，减法就变成了加法。</li>
        <li><strong>提示二：小分母的除法。</strong><Katex tex="1/x" /> 在 <Katex tex="x" /> 靠近 0 时条件数虽仍为 1，同一个 <Katex tex="\Delta x" /> 造成的 <Katex tex="\Delta y" /> 却急剧变大，量级上已经没法用。</li>
        <li><strong>提示三：误差界要按上界累加，不能取平均。</strong>多步运算的误差界是各步放大倍数之积，不会因为「有的步放大、有的步缩小」而互相抵消。</li>
        <li><strong>提示四：条件数大不等于算法错。</strong>病态是问题本身的性质；算法只决定能否达到这个问题的理论精度。判断结果可不可信，先看条件数，再看算法。</li>
      </ul>
    </div>
    <p>回收与预告：有了误差的界，就能给数值方法定一个停止条件。迭1 的二分法每折一次区间就短一半，误差上界与函数的陡缓完全无关，是最稳的一类方法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createErrProp } from '../../../boards/numeric/error/errprop.js';
import { NE_CHAPTERS } from './enav.js';
</script>
