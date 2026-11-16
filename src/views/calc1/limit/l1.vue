<template>
  <ChPage :cur="1" no="极1" base="/calc1/l" :chapters="CL_CHAPTERS"
    title="数列极限"
    sub="「越来越接近」在数学里要写成两个不等式：先给允许的误差，再给从第几项起误差不超过它。"
    :toc="[{ id: 'l1-conv', t: '数列与收敛' }, { id: 'l1-def', t: 'ε-N 定义' }, { id: 'l1-prop', t: '收敛数列的性质' }, { id: 'l1-func', t: '从数列到函数' }]">

    <div class="note good" id="l1-conv">数列是定义在正整数上的函数，第 <Katex tex="n" /> 项记作 <Katex tex="a_n" />。若存在常数 <Katex tex="L" />，使 <Katex tex="n" /> 无限增大时 <Katex tex="a_n" /> 与 <Katex tex="L" /> 的距离可以小于任意给定的正数，就说数列<b>收敛</b>于 <Katex tex="L" />，<Katex tex="L" /> 叫它的<b>极限</b>，记作 <Katex tex="\lim\limits_{n\to\infty}a_n=L" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createSeqLab" />
      <div class="cap">图 极1 · <b>数列极限机</b>：横轴是序号 <Katex tex="n" />，纵轴是项的值；金带是窗口 <Katex tex="|a_n-L|<\varepsilon" />，蓝点在带内、橙点在带外，紫色竖线的位置是最后一个落在带外的序号 <Katex tex="N" />。看点：把 <Katex tex="\varepsilon" /> 拖小，带变窄，橙点只能右移，<Katex tex="N" /> 随之变大；切到 <Katex tex="(-1)^n" />，无论带宽取多大，总有一半的点留在带外，<Katex tex="N" /> 不存在。</div>
    </div>

    <h3 class="sec" id="l1-conv">数列与收敛</h3>
    <p>以 <Katex tex="a_n=1+\dfrac{(-1)^n}{n}" /> 为例，前几项是 <Katex tex="0,\ 1.5,\ 0.667,\ 1.25,\ 0.8,\ 1.167,\ldots" />，在 <Katex tex="1" /> 的两侧来回摆动，摆幅逐次减半。第 <Katex tex="n" /> 项与 <Katex tex="1" /> 的距离恰好是 <Katex tex="\dfrac1n" />。若要求距离小于 <Katex tex="0.1" />，解 <Katex tex="\dfrac1n<0.1" /> 得 <Katex tex="n>10" />，从第 <Katex tex="11" /> 项起全部满足；要求小于 <Katex tex="0.01" />，就要等到第 <Katex tex="101" /> 项。</p>
    <p>每一次要求都能找到一个起点，这正是收敛的含义。图 极1 把这个过程画成一条水平带：带越窄，橙点越往右退，紫色竖线也随之右移。数列的极限只由这种「总能等到」的性质确定，并不需要真的走到无穷。</p>

    <h3 class="sec" id="l1-def">ε-N 定义</h3>
    <p>把上面的对话写成量词，就得到数列极限的精确定义：对任意给定的 <Katex tex="\varepsilon>0" />，总存在正整数 <Katex tex="N" />，使得当 <Katex tex="n>N" /> 时 <Katex tex="|a_n-L|<\varepsilon" /> 成立。写成一行：</p>
    <p><Katex display tex="\forall\,\varepsilon>0,\ \exists\,N\in\mathbb{N}^*,\quad n>N\ \Longrightarrow\ |a_n-L|<\varepsilon" /></p>
    <p>量词的顺序不能交换。定义要求<b>先</b>给 <Katex tex="\varepsilon" />、<b>再</b>找 <Katex tex="N" />，所以 <Katex tex="N" /> 可以依赖 <Katex tex="\varepsilon" />：误差要得越紧，起点就排得越靠后。若把两个量词调过来，成了「存在一个 <Katex tex="N" />，对一切 <Katex tex="\varepsilon>0" /> 都有 <Katex tex="|a_n-L|<\varepsilon" />」，由于 <Katex tex="\varepsilon" /> 可以取任意小，这要求从第 <Katex tex="N+1" /> 项起每一项都恰好等于 <Katex tex="L" />，条件强得多，也就不是极限了。</p>
    <p>定义还规定 <Katex tex="n>N" />，用的是严格大于：<Katex tex="N" /> 之后的部分才受约束，前面有限项取什么值都不影响极限。把数列的前一万项改掉，极限还是同一个数。</p>

    <h3 class="sec" id="l1-prop">收敛数列的性质</h3>
    <p><b>极限唯一。</b>若 <Katex tex="a_n\to L_1" /> 又 <Katex tex="a_n\to L_2" />，设 <Katex tex="L_1<L_2" />，取 <Katex tex="\varepsilon=\dfrac{L_2-L_1}{2}" />，两条带 <Katex tex="|a_n-L_1|<\varepsilon" /> 与 <Katex tex="|a_n-L_2|<\varepsilon" /> 互不重叠，同一项不可能同时落在里面，矛盾。</p>
    <p><b>收敛必有界。</b>取 <Katex tex="\varepsilon=1" />，得 <Katex tex="N" />，其后各项都落在 <Katex tex="(L-1,L+1)" /> 内；前面 <Katex tex="N" /> 项只有有限多个，取出绝对值最大的一项，就能把整列罩住。反过来不成立：<Katex tex="(-1)^n" /> 有界，却在两个值之间摆动，不收敛。</p>
    <p><b>保号性。</b>若 <Katex tex="L>0" />，取 <Katex tex="\varepsilon=\dfrac L2" />，则 <Katex tex="n>N" /> 时 <Katex tex="a_n>L-\dfrac L2=\dfrac L2>0" />。极限的符号会传给尾部，但前有限项可能反号。</p>
    <p>图 极1 的第三个预设 <Katex tex="(n+1)/n+\dfrac{\sin n}{3}" /> 摆动幅度不衰减，却仍在 <Katex tex="1" /> 附近，只要带宽不小于 <Katex tex="\dfrac13" /> 的点都能被罩住，极限仍是 <Katex tex="1" />——收敛与单调无关。</p>

    <h3 class="sec" id="l1-func">从数列到函数</h3>
    <p>数列的自变量只能取正整数，所以 <Katex tex="n\to\infty" /> 只有一条路径。把 <Katex tex="n" /> 换成连续变量 <Katex tex="x" />，趋近的方式就多起来了：<Katex tex="x" /> 可以趋向某个有限点 <Katex tex="x_0" />，可以从左侧、右侧、两侧一起靠近，也可以趋向无穷。函数极限的定义与这里只差一处——把「<Katex tex="n>N" />」换成「<Katex tex="0<|x-x_0|<\delta" />」，这是极2 的内容。</p>
    <p>反过来，数列又是研究函数极限的工具。极5 要证明 <Katex tex="\left(1+\dfrac1n\right)^n" /> 收敛，用的正是「单调有界」这条性质：先证它逐项变大，再证它始终小于 <Katex tex="3" />。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：极限不要求取到。</strong><Katex tex="a_n=\dfrac1n" /> 的任何一项都不等于 <Katex tex="0" />，但它收敛于 <Katex tex="0" />。「趋于」说的是趋势，不是取值。</li>
        <li><strong>提示二：<Katex tex="N" /> 不唯一。</strong>定义只要求这样的 <Katex tex="N" /> 存在。取到 <Katex tex="N" /> 之后再加 <Katex tex="100" /> 仍然合格，谈 <Katex tex="N" /> 的具体大小没有意义。</li>
        <li><strong>提示三：有界不是收敛的理由。</strong><Katex tex="(-1)^n" /> 与 <Katex tex="\sin n" /> 都有界，却都不收敛。有界只能挡住「跑向无穷」，挡不住来回摆动。</li>
        <li><strong>提示四：单调有界是充分条件。</strong><Katex tex="a_n=\dfrac{(-1)^n}{n}" /> 不单调，照样收敛于 <Katex tex="0" />。判收敛的充分条件不止一条，缺少某一条不等于不收敛。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSeqLab } from '../../../boards/calc1/limit/seqlab.js';
import { CL_CHAPTERS } from './lnav.js';
</script>
