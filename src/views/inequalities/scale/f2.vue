<template>
  <ChPage :cur="2" no="放2" base="/inequalities/f" :chapters="F_CHAPTERS"
    title="柯西不等式：$(a^2+b^2)(c^2+d^2)\ge(ac+bd)^2$"
    sub="把四个数两两配成向量 $u=(a,b)$、$v=(c,d)$：内积的绝对值不超过两模长之积，两边平方即得柯西不等式。差额 $(ac+bd)^2$ 与 $(a^2+b^2)(c^2+d^2)$ 之间，缺的正是 u、v 张成平行四边形的面积——差 $(ad-bc)^2$。"
    :toc="[{ id: 'f2-vec', t: '向量读法：内积与投影' }, { id: 'f2-id', t: '恒等式：$(ad-bc)^2$ 的面积意义' }, { id: 'f2-eq', t: '取等：两向量共线' }, { id: 'f2-dim', t: 'n 维形式与求最值' }, { id: 'f2-pit', t: '方向与取等' }]">
    <div class="note good" id="f2-law">对任意实数，<Katex tex="(a^2+b^2)(c^2+d^2)\ge(ac+bd)^2" />，等号当且仅当 <Katex tex="ad=bc" />，即两数对 (a,b) 与 (c,d) 成比例。向量形式更见筋骨：<Katex tex="|\vec u\cdot\vec v|\le|\vec u|\,|\vec v|" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCB" />
      <div class="cap">图 放2 · <b>柯西不等式</b>：拖 a/b/c/d 或点四个预设，粉色四边形是 u、v 张开的带符号面积 <Katex tex="|ad-bc|"/>，青色虚线是 v 在 u 上的投影。看点：拖到③共线取等时四边形塌成一条直线、面积归零，内积读数攀到两模长之积——取等与面积同现；②正交例面积最大、内积最小。</div>
    </div>

    <h3 class="sec" id="f2-vec">向量读法：内积与投影</h3>
    <p>令 <Katex tex="\vec u=(a,b),\ \vec v=(c,d)" />。内积 <Katex tex="\vec u\cdot\vec v=ac+bd" />，模长平方 <Katex tex="|\vec u|^2=a^2+b^2" />（同理 v）。由 <Katex tex="|\cos\theta|\le1" /> 得 <Katex tex="|\vec u\cdot\vec v|=|\vec u|\,|\vec v||\cos\theta|\le|\vec u|\,|\vec v|" />，两边平方便是柯西不等式。几何上，v 在 u 方向上的投影长度为 <Katex tex="|ac+bd|/\sqrt{a^2+b^2}" />，它总不超过 v 的模长——图 放2 青色虚线即这段投影，长度一眼可读。</p>

    <h3 class="sec" id="f2-id">恒等式：<Katex tex="(ad-bc)^2"/> 的面积意义</h3>
    <p>直接展开即得配方法：</p>
    <Katex tex="(a^2+b^2)(c^2+d^2)-(ac+bd)^2=a^2d^2-2abcd+b^2c^2=(ad-bc)^2\ge0" display />
    <p>而 <Katex tex="ad-bc" /> 恰是向量 u、v 张成平行四边形的带符号面积（两向量交叉相乘之差），也是 u、v 为基的 <Katex tex="2\times2" /> 行列式。于是柯西不等式断言：两模长之积被内积平方「追上」后，缺口的正是平行四边形面积——零面积即两向量共线。图 放2 的粉四边形实时显示这块面积，函数两式的读数差距恒等于面积平方。</p>

    <h3 class="sec" id="f2-eq">取等：两向量共线</h3>
    <p>等号条件 <Katex tex="ad=bc" /> 即二维行列式为零，等价于 <Katex tex="\vec u,\vec v" /> 共线（成比例；含退化——某量为零向量时两式均为零仍取等）。图 放2 预设③（1,2,2,4）让 <Katex tex="\vec v=2\vec u" />，四边形塌成线段、投影与 v 重合；预设②（1,2,−4,2）让 <Katex tex="\vec u\perp\vec v" />，内积为零、面积取到最大。</p>

    <h3 class="sec" id="f2-dim">n 维形式与求最值</h3>
    <p>对两组数 <Katex tex="a_1,\ldots,a_n" /> 与 <Katex tex="b_1,\ldots,b_n" />：<Katex tex="(a_1^2+\cdots+a_n^2)(b_1^2+\cdots+b_n^2)\ge(a_1b_1+\cdots+a_nb_n)^2" />，n=2 即本图，n=3 对应三维向量。它常用来求最值——约束 <Katex tex="ax+by=k" />（两个一次式的线性组合定值）时求 <Katex tex="x^2+y^2" /> 的下界：由柯西 <Katex tex="(x^2+y^2)(a^2+b^2)\ge(ax+by)^2" /> 得 <Katex tex="x^2+y^2\ge\frac{k^2}{a^2+b^2}" />，取等 <Katex tex="(x,y)\parallel(a,b)" />。例如 2x+3y=6 时 x²+y² 的最小值是 36/13，取等 <Katex tex="(x,y)=\frac{6}{13}(2,3)" />。这正是线1 线性规划里「目标函数沿可行域平移」的数原型。</p>

    <h3 class="sec" id="f2-pit">方向与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只给了一个方向的界。</strong>柯西给 <Katex tex="|ac+bd|\le\sqrt{a^2+b^2}\sqrt{c^2+d^2}" />，求 <Katex tex="ac+bd" /> 的最大值用它，最小值还要带负号 <Katex tex="\ge-\sqrt{\cdots}" />，别只写一半。</li>
        <li><strong>提示二：取等是共线不是相等。</strong>「a=c 且 b=d」只对等向量成立，柯西取等在成比例（ad−bc=0），与基本不等式「两数相等」的取等不是一回事（见基1）。</li>
        <li><strong>提示三：退化别漏。</strong>某向量为零时两式同为零仍取等，预设与含参题里要单列。</li>
        <li><strong>提示四：方向勿反用。</strong>「和定（积定）求最值」在柯西这里是组合定值求平方和，套反了方向会把上界当下界。</li>
      </ul>
    </div>
    <p>均值链里的平方均值与算术均值之差，本质也是这类「差为平方和」的缺口——柯西把它从一维配对抬到 n 维配对。下一章放3 把放缩变得日常：求不出的和，放大或夹逼成求得出的。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCB } from '../../../boards/inequalities/scale/cauchy.js';
import { F_CHAPTERS } from './fnav.js';
</script>