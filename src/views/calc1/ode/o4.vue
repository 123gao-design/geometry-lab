<template>
  <ChPage :cur="4" no="方4" base="/calc1/o" :chapters="ON_CHAPTERS"
    title="可降阶的高阶方程"
    sub="二阶方程里若缺了某个字母，换元就能把它降成一阶；积出来的每个常数，最后都交给初始条件去定。"
    :toc="[{ id: 'o4-type', t: '两类可降阶' }, { id: 'o4-dy', t: '缺 y 型' }, { id: 'o4-dx', t: '缺 x 型' }, { id: 'o4-init', t: '初始条件定常数' }]">

    <div class="note good" id="o4-type">二阶方程 <Katex tex="F(x,y,y',y'')=0" /> 若右端只含 <Katex tex="x" /> 与 <Katex tex="y''" />，即 <Katex tex="y''=f(x)" />，连积两次即可；若方程里显式地缺 <Katex tex="x" />，用 <Katex tex="p=y'" /> 把方程降成一阶。两种情形都靠「缺谁省谁」这条线索辨认。</div>

    <div class="board-wrap">
      <BoardMount :factory="createReduceorder" />
      <div class="cap">图 方4 · <b>可降阶的高阶方程</b>：蓝线是解 <Katex tex="y" />，绿虚线是它的导数 <Katex tex="y'" />。拖 <Katex tex="C_1" />、<Katex tex="C_2" /> 两个滑块，能看到常数各自只管一件事。<b>看点</b>：<Katex tex="C_2" /> 只让蓝线上下平移，<Katex tex="C_1" /> 同时改变斜率与高度。</div>
    </div>

    <h3 class="sec" id="o4-dy">缺 y 型：直接积两次</h3>
    <p><Katex tex="y''=6x" /> 不看别处，直接积分得 <Katex tex="y'=3x^2+C_1" />，再积一次得 <Katex tex="y=x^3+C_1x+C_2" />。每积一次多一个任意常数，二阶方程的通解带两个常数，这条规律在方1 已经说过，这里是它最直白的体现。</p>
    <p>图 方4 的预设 ① 把两条曲线同台画出：绿虚线是 <Katex tex="y'=3x^2+C_1" />，蓝线是 <Katex tex="y=x^3+C_1x+C_2" />。蓝线在 <Katex tex="x_0" /> 处的斜率恰好等于绿线在 <Katex tex="x_0" /> 处的高度，两个滑块各拧一下，这条对应关系始终成立。</p>
    <p>若方程是 <Katex tex="y''=f(y')" /> 或 <Katex tex="y''=f(y)" />，则不能直接积。前一种令 <Katex tex="p=y'" /> 后掉成 <Katex tex="p'=f(p)" />，是可分离方程；后一种要令 <Katex tex="p(y)=y'" />，把 <Katex tex="y''=p\,\mathrm{d}p/\mathrm{d}y" /> 代进去，同样掉成一阶。</p>

    <h3 class="sec" id="o4-dx">缺 x 型：令 p = y′</h3>
    <p>预设 ② 的 <Katex tex="y''=2y'" /> 里没有单独的 <Katex tex="x" />。令 <Katex tex="p=y'" />，则 <Katex tex="y''=p'" />，方程变成 <Katex tex="p'=2p" />，这是方2 里见过的可分离方程，解得 <Katex tex="p=C_2\mathrm{e}^{2x}" />。再积一次得</p>
    <p style="text-align:center"><Katex display tex="y=C_1+\frac{C_2}{2}\mathrm{e}^{2x}" /></p>
    <p>注意降阶后只引入了一个新函数 <Katex tex="p" />，原来的二阶方程变成关于 <Katex tex="p" /> 的一阶方程，积分两次后仍回到两个常数。若方程里缺的是 <Katex tex="y" /> 而非 <Katex tex="x" />，也是同一条思路，只是把 <Katex tex="y'" /> 看作 <Katex tex="x" /> 的函数即可。</p>
    <p>缺 <Katex tex="x" /> 型的另一个常见写法是令 <Katex tex="y'=p(y)" />，此时 <Katex tex="y''=p\cdot\dfrac{\mathrm{d}p}{\mathrm{d}y}" />，方程对 <Katex tex="p" /> 与 <Katex tex="y" /> 成一阶。选哪种写法，看方程里剩下的字母是哪个：剩下 <Katex tex="y" /> 就令 <Katex tex="p(y)" />，剩下什么也不剩就令 <Katex tex="p(x)" />。</p>

    <h3 class="sec" id="o4-init">初始条件如何定下两个常数</h3>
    <p>通解带两个常数，要两条初始条件：<Katex tex="y(x_0)=y_0" /> 与 <Katex tex="y'(x_0)=v_0" />。图 方4 的右栏把 <Katex tex="y(x_0)" />、<Katex tex="y'(x_0)" /> 与 <Katex tex="y''(x_0)" /> 一起列出，前两个交给条件去配，第三个由方程本身给出，不需要另定。</p>
    <p>预设 ① 里，<Katex tex="y'(x_0)=3x_0^2+C_1" /> 只含 <Katex tex="C_1" />，所以速度条件先定出 <Katex tex="C_1" />；再代入位置条件定 <Katex tex="C_2" />。这种「先速度后位置」的顺序并非规定，只是解线性方程组的自然结果。若换成预设 ②，两个条件会同时出现在两个常数里，需要联立求解。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：降阶后别把 p 丢在答案里。</strong>解出 <Katex tex="p" /> 之后必须再积一次回到 <Katex tex="y" />，只写 <Katex tex="p=C_2\mathrm{e}^{2x}" /> 是没做完。</li>
        <li><strong>提示二：缺哪个字母才省哪个。</strong>方程里有 <Katex tex="x" /> 却没有 <Katex tex="y" /> 时，令 <Katex tex="p=y'" /> 仍然有效；有 <Katex tex="y" /> 却没有 <Katex tex="x" /> 时，要用 <Katex tex="p(y)" /> 的写法。</li>
        <li><strong>提示三：常数个数始终与阶数一致。</strong>降阶只是把方程拆成两次一阶，通解的常数总量不变，多写或少写都说明中间某步出错。</li>
        <li><strong>提示四：初始条件的两个值要独立。</strong>只给同一个点的高度与另一个点的高度，也能定两个常数；但若两条条件描述的是同一件事（例如都由 <Katex tex="y(x_0)" /> 推出），就定不住，解不唯一。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createReduceorder } from '../../../boards/calc1/ode/reduceorder.js';
import { ON_CHAPTERS } from './onav.js';
</script>
