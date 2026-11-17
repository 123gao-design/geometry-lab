<template>
  <ChPage :cur="3" no="基3" base="/vectors/b" :chapters="VB_CHAPTERS"
    title="共线与定比分点的坐标判定"
    sub="有了坐标，共线就成了一个行列式是否为零的判断题，分点就成了一个一次方程组的解。两个公式都能从「一个向量是另一个的倍数」出发，用两行算术推出来。"
    :toc="[{ id: 'b3-coll', t: '共线的坐标判定' }, { id: 'b3-line', t: '三点共线' }, { id: 'b3-ratio', t: '定比分点公式' }, { id: 'b3-pit', t: 'λ=−1、外分与顺序' }]">
    <div class="note good" id="b3-def">设 <Katex tex="\vec a=(x_1,y_1)" />，<Katex tex="\vec b=(x_2,y_2)" />，且 <Katex tex="\vec a\ne\vec 0" />，则 <Katex tex="\vec a\parallel\vec b" /> 的充要条件是 <Katex tex="x_1y_2-x_2y_1=0" />。若 <Katex tex="A(x_1,y_1)" />、<Katex tex="B(x_2,y_2)" />，点 <Katex tex="P" /> 在直线 <Katex tex="AB" /> 上且满足 <Katex tex="\overrightarrow{AP}=\lambda\overrightarrow{PB}" />，则 <Katex tex="P\left(\dfrac{x_1+\lambda x_2}{1+\lambda},\ \dfrac{y_1+\lambda y_2}{1+\lambda}\right)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createRatioPoint" />
      <div class="cap">图 基3 · <b>定比分点</b>：绿色、橙色两点是端点 A、B，金色点是分点 P。看点：λ 从 2 滑到 1，金色点从 2:1 的内分点移到 AB 中点；切到 ③，λ=−2，金色点跑到 AB 的延长线上，成了外分点；切到 ④，λ=−1，分母为零，金色点消失，分点不存在。</div>
    </div>

    <h3 class="sec" id="b3-coll">共线的坐标判定</h3>
    <p>向3 说过：<Katex tex="\vec a\ne\vec 0" /> 时，<Katex tex="\vec b" /> 与 <Katex tex="\vec a" /> 共线当且仅当存在 <Katex tex="\lambda" /> 使 <Katex tex="\vec b=\lambda\vec a" />。按分量写开，就是 <Katex tex="x_2=\lambda x_1" />、<Katex tex="y_2=\lambda y_1" />。两式交叉相乘再相减消去 <Katex tex="\lambda" />，得到 <Katex tex="x_1y_2-x_2y_1=0" />。这个式子不必求出 <Katex tex="\lambda" />，只要算一个差就能判定，图 基1 的系数徽章用的也是同一个行列式。</p>
    <p>判定的方向要看清：差为零判的是<strong>共线</strong>，同向与反向都算；要分同向反向，还须回到倍数 <Katex tex="\lambda" /> 的正负。另外，<Katex tex="\vec a=\vec 0" /> 时差恒为零，此时任何 <Katex tex="\vec b" /> 都「与零向量共线」，倍率却不唯一——前提里那句 <Katex tex="\vec a\ne\vec 0" /> 不能省。</p>

    <h3 class="sec" id="b3-line">三点共线</h3>
    <p>判断 <Katex tex="A,B,C" /> 三点是否共线，只需看 <Katex tex="\overrightarrow{AB}" /> 与 <Katex tex="\overrightarrow{AC}" /> 是否共线：算出这两个向量的坐标，交叉相乘相减，差为零即共线。这只用到减法与乘法，比画图可靠。</p>
    <p>另一个常用的等价形式是从一个公共起点出发：<Katex tex="A,B,C" /> 三点共线，当且仅当存在 <Katex tex="x,y" /> 使 <Katex tex="\overrightarrow{OC}=x\overrightarrow{OA}+y\overrightarrow{OB}" /> 且 <Katex tex="x+y=1" />。这条与下面的定比分点公式是同一件事——把 <Katex tex="\overrightarrow{OC}" /> 写成 <Katex tex="\overrightarrow{OA}" /> 与 <Katex tex="\overrightarrow{AB}" /> 的组合再整理，系数和自然为一。</p>

    <h3 class="sec" id="b3-ratio">定比分点公式</h3>
    <p>设点 <Katex tex="P" /> 在直线 <Katex tex="AB" /> 上，且 <Katex tex="\overrightarrow{AP}=\lambda\overrightarrow{PB}" />。把它写成坐标：<Katex tex="P-A=\lambda(B-P)" />，整理得 <Katex tex="(1+\lambda)P=A+\lambda B" />，于是 <Katex tex="P=\dfrac{A+\lambda B}{1+\lambda}" />，两个分量各算一次就得到公式里的横纵坐标。</p>
    <p>几个特殊位置值得记住。<Katex tex="\lambda=1" /> 时 <Katex tex="P" /> 是 <Katex tex="AB" /> 的中点，公式退化为 <Katex tex="\left(\dfrac{x_1+x_2}{2},\dfrac{y_1+y_2}{2}\right)" />；<Katex tex="\lambda>0" /> 时 <Katex tex="P" /> 落在 <Katex tex="A" />、<Katex tex="B" /> 之间，是<strong>内分点</strong>，<Katex tex="\lambda" /> 越大越靠近 <Katex tex="B" />；<Katex tex="\lambda<0" /> 时 <Katex tex="P" /> 落在延长线上，是<strong>外分点</strong>；<Katex tex="\lambda=0" /> 时 <Katex tex="P" /> 与 <Katex tex="A" /> 重合。</p>

    <h3 class="sec" id="b3-pit">λ=−1、外分与顺序</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="\lambda=-1" /> 时分点不存在。</strong>此时公式分母为零，方程 <Katex tex="\overrightarrow{AP}=-\overrightarrow{PB}" /> 也就是 <Katex tex="\overrightarrow{AP}=\overrightarrow{BP}" />，两个不同的点做不到。图 基3 的 ④ 把这一档单独列出。</li>
        <li><strong>提示二：外分点的 λ 是负数，不是倒数。</strong>外分不是「把内分反过来算」。只要 <Katex tex="\lambda<0" /> 且 <Katex tex="\lambda\ne-1" />，<Katex tex="P" /> 就在延长线上；<Katex tex="\lambda" /> 越靠近 −1，分点跑得越远。</li>
        <li><strong>提示三：<Katex tex="\overrightarrow{AP}=\lambda\overrightarrow{PB}" /> 的两端顺序固定。</strong>写成 <Katex tex="\overrightarrow{PA}=\lambda\overrightarrow{BP}" /> 或把 <Katex tex="A,B" /> 对调，都会得到另一个分点。用公式前先确认是从 <Katex tex="A" /> 指到 <Katex tex="P" />、再从 <Katex tex="P" /> 指到 <Katex tex="B" />。</li>
        <li><strong>提示四：共线判定不区分内外。</strong>差为零只说三点在同一直线上，<Katex tex="P" /> 在内还是在外、在哪一侧，都要由 <Katex tex="\lambda" /> 的符号与大小另判。</li>
      </ul>
    </div>
    <p>回收与预告：向3 的共线定理在坐标下成了一个乘法减法式，基1 的行列式在这里第二次出现；定比分点把「线段按比例分割」写成一次方程组，中点公式只是 <Katex tex="\lambda=1" /> 的特例。下一子专题取数量积，给两个向量再配一个数——长度与夹角由此进入坐标运算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRatioPoint } from '../../../boards/vectors/basis/ratiopoint.js';
import { VB_CHAPTERS } from './vbnav.js';
</script>
