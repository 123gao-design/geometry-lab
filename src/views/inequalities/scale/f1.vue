<template>
  <ChPage :cur="1" no="放1" base="/inequalities/f" :chapters="F_CHAPTERS"
    title="三角不等式：$|a+b|\le|a|+|b|$"
    sub="两个数先相加再取绝对值，总不超过各自取绝对值再相加。数轴上看是「折返与直达」：从 0 到 a 再从 0 到 b 绕了一圈，直接走到 a+b 反而更短；向量上看是三角形的三边——折线 O→U→W 不比弦 O→W 短。"
    :toc="[{ id: 'f1-plan', t: '数轴模式：折返与直达' }, { id: 'f1-vec', t: '向量模式：三角形三边' }, { id: 'f1-proof', t: '平方与取等' }, { id: 'f1-band', t: '上下界双向不等式' }, { id: 'f1-pit', t: '方向与取等' }]">
    <div class="note good" id="f1-law">对任意实数 <Katex tex="a,b" />，<Katex tex="|a+b|\le|a|+|b|" />，等号当且仅当 <Katex tex="ab\ge0" />（两数同号或其一为零）。这是绝对值运算中最常用的一条，也是复数与向量模长的三角形不等式的实轴版本。</div>
    <div class="board-wrap">
      <BoardMount :factory="createTI" />
      <div class="cap">图 放1 · <b>三角不等式</b>：数轴模式把 a、b 看作从 0 出发的两段位移，「折返」路径 <Katex tex="|a|+|b|" />（蓝带 |a| + 红带 |b| 折回原点）与「直达」<Katex tex="|a+b|" />（金带）同轴比长；向量模式固定 u 沿 x 轴长 3、v 可转可伸缩，折线 O→U→W 与闭合边 O→W 同台。看点：θ=0° 或 a、b 同号时折返与直达重合（取等），θ=180° 或异号时直达最短。</div>
    </div>

    <h3 class="sec" id="f1-plan">数轴模式：折返与直达</h3>
    <p>把 a、b 各自看成从原点出发的一段位移。「折返」路径是先从 0 走到 a、回到 0、再走到 b，总长为 <Katex tex="|a|+|b|" />；「直达」路径是直接从 0 位移到 a+b，只需 <Katex tex="|a+b|" />。折返先绕回原点再出发，除非两段位移首尾朝同一方向连成一条直线段，否则长于直达——同号时恰好连成一条，于是 <Katex tex="|a|+|b|=|a+b|" /> 取等；异号时多走的部分恰是两倍短段，<Katex tex="|a|+|b|=|a+b|+2\min\{|a|,|b|\}" />。图 放1 的三条色带长度如实反映这段差距。</p>

    <h3 class="sec" id="f1-vec">向量模式：三角形三边</h3>
    <p>换上向量模长同样成立：<Katex tex="|\vec u+\vec v|\le|\vec u|+|\vec v|" />。u、v 首尾相接成折线 O→U→W，和向量 u+v 是从 O 到 W 的闭合边——折线正是三角形的两条边，闭合边是第三边，三角形任意两边之和不小于第三边。θ=0° 时两边同向拉直，取上界 <Katex tex="|\vec u|+|\vec v|" />；θ 张开后闭合边渐短；θ=180° 反向拉直，闭合边取到 <Katex tex="\bigl||\vec u|-|\vec v|\bigr|" />。</p>

    <h3 class="sec" id="f1-proof">平方与取等</h3>
    <p>两式皆非负，平方再比：</p>
    <Katex tex="(|a|+|b|)^2=a^2+2|ab|+b^2,\quad (a+b)^2=a^2+2ab+b^2" display />
    <p>前者比后者多出的正是 <Katex tex="2(|ab|-ab)\ge0" />，故 <Katex tex="(|a|+|b|)^2\ge(a+b)^2" />，开平方即 <Katex tex="|a+b|\le|a|+|b|" />。取等读自 <Katex tex="|ab|=ab" />：<Katex tex="ab\ge0"/>，即两数同号或其一为零。这个平方手法在放2 柯西、放3 裂项处反复出现——凡找这样的不等式，先看「平方之差是否非负」。</p>

    <h3 class="sec" id="f1-band">上下界双向不等式</h3>
    <p>反手把 b 换成 −b，得 <Katex tex="|a-b|\le|a|+|b|" />；再由恒等 <Katex tex="|a|=|a+b-b|\le|a+b|+|b|" /> 移项可证反向形式 <Katex tex="|a|-|b|\le|a+b|" />，对称地 <Katex tex="|b|-|a|\le|a+b|" />。合起来写成双向形式
      <Katex tex="\bigl||a|-|b|\bigr|\ \le\ |a+b|\ \le\ |a|+|b|" />。
      上界同号取等，下界异号取等。放缩题里它成对使用——给 <Katex tex="|a+b|" /> 定上限用右边，给 <Katex tex="|a+b|" /> 与某量之差定下限用左边；图 放1 向量模式的反向拉直正是下界 <Katex tex="|3-L|" /> 的体现。</p>

    <h3 class="sec" id="f1-pit">方向与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：方向不能写反。</strong><Katex tex="|a|+|b|\le|a+b|" /> 一般不成立——和取模不能向「模的和」以下放。</li>
        <li><strong>提示二：差式连着放。</strong><Katex tex="|a-b|\le|a|+|b|" /> 是它的另一面，题目只给 <Katex tex="|a|-|b|" /> 时不要直接跳到绝对值的差。</li>
        <li><strong>提示三：取等需检验。</strong>同号才取上界、异号才取下界，问「何时取等」要落到 <Katex tex="ab\ge0" /> 或 <Katex tex="ab\le0" /> 的判据，不能默认两方向都够得到。</li>
      </ul>
    </div>
    <p>绝对值把数与距离挂钩，故三角不等式与次3 绝对值不等式、E8 绝对值嵌套家族共用同一套「距离 vs 封闭区间」的眼光；向量与复数模块的模长也沿同一趟路线。下一章放2 的柯西不等式，把「模」从加法运到乘法。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTI } from '../../../boards/inequalities/scale/triangleineq.js';
import { F_CHAPTERS } from './fnav.js';
</script>