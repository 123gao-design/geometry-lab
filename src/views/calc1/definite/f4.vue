<template>
  <ChPage :cur="4" no="定4" base="/calc1/f" :chapters="DF_CHAPTERS"
    title="反常积分"
    sub="区间无限长，或者被积函数在某点无界，定积分的定义就用不上。先把界限截住算一个普通的数，再看这个数有没有极限。"
    :toc="[{ id: 'f4-inf', t: '无穷限积分' }, { id: 'f4-sing', t: '瑕积分' }, { id: 'f4-p', t: 'p 积分是标尺' }, { id: 'f4-cmp', t: '比较判别' }]">

    <div class="note good" id="f4-inf">反常积分不直接定义成面积，而是定义成一个极限：<Katex tex="\int_a^{\infty}f=\lim_{B\to\infty}\int_a^B f" />。极限存在叫收敛，否则叫发散。发散不等于「面积是无穷大」，只是说这个极限不存在。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPIntegral" />
      <div class="cap">图 定4 · <b>反常积分</b>：模式一把上限推到 <Katex tex="B" />，模式二把下限压到 <Katex tex="\varepsilon" />，绿色区域随之伸缩。看点：把 <Katex tex="p" /> 拖到 1 的两侧，同一个拖法下区域是「越拖越收敛」还是「一路长大」，判据只差 <Katex tex="p-1" /> 的符号。</div>
    </div>

    <h3 class="sec" id="f4-inf">无穷限积分</h3>
    <p>三种无穷限积分都归结为同一个做法：先算有限区间上的定积分，再取极限。</p>
    <p style="text-align:center"><Katex display tex="\int_a^{\infty}f=\lim_{B\to\infty}\int_a^B f,\qquad \int_{-\infty}^{b}f=\lim_{A\to-\infty}\int_A^b f" /></p>
    <p>两头都无限时，要拆成 <Katex tex="\int_{-\infty}^{c}+\int_c^{\infty}" />，两边都收敛才算收敛，一边发散就整体发散。这与「极限存在」的严格含义一致，不能靠对称性把一个发散的积分凑成零。</p>
    <p>用牛顿-莱布尼茨公式时，写成 <Katex tex="\left[F(x)\right]_a^{\infty}" />，其含义是 <Katex tex="\lim_{x\to\infty}F(x)-F(a)" />。图 定4 的模式一取 <Katex tex="f=x^{-p}" />、下限为 1，右栏的「截止值」是截到 <Katex tex="B" /> 的数，「极限值」才是反常积分本身。</p>

    <h3 class="sec" id="f4-sing">瑕积分</h3>
    <p>另一种情形是函数在区间内部或端点附近无界，比如 <Katex tex="1/\sqrt{x}" /> 在 0 附近。称这样的点为<b>瑕点</b>，相应的积分也要按极限定义：</p>
    <p style="text-align:center"><Katex display tex="\int_a^b f=\lim_{\varepsilon\to0^+}\int_{a+\varepsilon}^b f" /></p>
    <p>瑕点在中间时，从瑕点处拆成两段，各自取单侧极限，两段都收敛才收敛。图 定4 的模式二把下限压到 <Katex tex="\varepsilon" />，看的就是这条路径。</p>
    <p>要分清「瑕积分」与「定积分」：被积函数无界时，黎曼和本身的极限并不存在，只有按上面这种方式取单侧极限，才能谈收敛。写成 <Katex tex="\int_0^1" /> 而不说明是反常积分，严格说是不完整的。</p>

    <h3 class="sec" id="f4-p">p 积分是标尺</h3>
    <p>两类 p 积分的结果都要记住，后面的判别都拿它们比对：</p>
    <p style="text-align:center"><Katex display tex="\int_1^{\infty}\frac{\mathrm{d}x}{x^p}\ \text{收敛}\iff p>1,\qquad \int_0^1\frac{\mathrm{d}x}{x^p}\ \text{收敛}\iff p<1" /></p>
    <p>两个判据方向相反，原因在「谁更胖」。无穷远处看尾巴的高度，<Katex tex="p" /> 越大衰减越快，面积越容易收得住；<Katex tex="0" /> 附近看竖起来的速度，<Katex tex="p" /> 越大立得越高，面积越容易爆。<Katex tex="p=1" /> 两边都恰好卡在临界：一个得 <Katex tex="\ln B" />，一个得 <Katex tex="\ln(1/\varepsilon)" />，都随界限跑向无穷。</p>
    <p>图 定4 的 <Katex tex="p" /> 滑块就是这条标尺。把 <Katex tex="p" /> 放在 1.6，模式一收敛；按到 0.6，同样拖法下截断值一路增长，判读改口「发散」。切到模式二，则 <Katex tex="p=0.6" /> 收敛、<Katex tex="p=1.6" /> 发散——两条判据正好颠倒。</p>

    <h3 class="sec" id="f4-cmp">比较判别</h3>
    <p>多数积分算不出原函数，只能靠比较。对非负函数，若在无穷远处 <Katex tex="0\le f\le g" />，则 <Katex tex="\int g" /> 收敛推出 <Katex tex="\int f" /> 收敛，<Katex tex="\int f" /> 发散推出 <Katex tex="\int g" /> 发散。</p>
    <p>实际操作常用<b>极限形式</b>：若 <Katex tex="f/g\to c" />（<Katex tex="0<c<\infty" />），则两者收敛性相同。于是只要把 <Katex tex="f" /> 与某个 p 积分比一比，看 <Katex tex="f" /> 在无穷远处相当于几分之一次幂，判据立刻出来。瑕点附近同理，只是把「远」换成「近」、把 <Katex tex="p>1" /> 换成 <Katex tex="p<1" />。</p>
    <p>比较的前提是非负。函数变号时，先看绝对收敛：<Katex tex="\int|f|" /> 收敛则 <Katex tex="\int f" /> 收敛。反过来不成立——条件收敛的情形要到 级2 的交错级数才展开。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：收敛是一个极限存在，不是「面积有限」。</strong>发散也未必是无穷大，只是这个极限不存在，别用「面积无穷」代替定义。</li>
        <li><strong>提示二：两头都无限必须拆开判。</strong><Katex tex="\int_{-\infty}^{\infty}x\,\mathrm{d}x" /> 不能按奇函数直接得 0，两边各自发散，整体发散。</li>
        <li><strong>提示三：瑕点藏在中间时从瑕点拆。</strong>只看两端会漏掉内部的无穷间断点，那种情形常常整体发散。</li>
        <li><strong>提示四：两个 p 判据方向相反。</strong>无穷远处 <Katex tex="p>1" /> 收敛，瑕点附近 <Katex tex="p<1" /> 收敛，记混了整道题的结论就反了。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPIntegral } from '../../../boards/calc1/definite/pintegral.js';
import { DF_CHAPTERS } from './fnav.js';
</script>
