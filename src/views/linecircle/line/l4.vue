<template>
  <ChPage :cur="4" no="直4" base="/linecircle/l" :chapters="LN_CHAPTERS"
    title="直线系与同解变形"
    sub="具有共同性质的直线可以写成一族方程，过定点与过交点都只是其中的一个参数。方程两边同加、同乘会保持解集，平方与乘除含未知数的式子却会改变解集，增根与失根都要回头核验。"
    :toc="[{ id: 'l4-bundle', t: '直线系与直线束' }, { id: 'l4-para', t: '平行系与垂直系' }, { id: 'l4-pencil', t: '过交点的直线系' }, { id: 'l4-equiv', t: '同解变形' }, { id: 'l4-pit', t: '漏线、增根与失根' }]">
    <div class="note good">具有某一共同性质的直线的集合称为<strong>直线系</strong>。过定点 <Katex tex="P(x_0,y_0)" /> 的直线束写成 <Katex tex="y-y_0=k(x-x_0)" />，其中不含竖直直线 <Katex tex="x=x_0" />。设 <Katex tex="l_1:A_1x+B_1y+C_1=0" />、<Katex tex="l_2:A_2x+B_2y+C_2=0" /> 相交于点 <Katex tex="P" />，则 <Katex tex="f_1+\lambda f_2=0" />（<Katex tex="\lambda\in\mathbb{R}" />）表示过 <Katex tex="P" /> 的一族直线，随 <Katex tex="\lambda" /> 转动，但取不到 <Katex tex="l_2" /> 本身。方程两边同加同一个整式、同乘同一个非零常数，解集不变，称为<strong>同解变形</strong>；两边平方、同乘或同除含未知数的式子，可能增根或失根。</div>

    <h3 class="sec" id="l4-bundle">直线系与直线束</h3>
    <div class="board-wrap">
      <BoardMount :factory="createLineFamily" />
      <div class="cap">图 直4a · <b>直线束机</b>：三档共用一张平面。第一档拖动束心 <Katex tex="P" />，灰色细线是同束的其余直线，金色线随斜率滑块转动，竖直的 <Katex tex="x=x_0" /> 是一条单独画出的虚线；第二档把斜率固定，截距逐个取值，细线互相平行；第三档给出相交的 <Katex tex="l_1" />、<Katex tex="l_2" />，金色组合线随 <Katex tex="\lambda" /> 转动而始终穿过交点 <Katex tex="P(2,1)" />。</div>
    </div>
    <p>直线系是「方向或位置受一个共同条件约束」的直线集合。按约束的不同，常见的有三类：过定点的束、方向相同的平行系、过两条已知直线交点的束。写成带参数的方程后，一个参数就代替了原来要通过两个条件才能确定的直线，待定系数法可以少解一个未知量。</p>
    <p>过定点 <Katex tex="P(x_0,y_0)" /> 的直线用点斜式写成一族：<Katex tex="y-y_0=k(x-x_0)" />，<Katex tex="k" /> 取遍实数，直线绕 <Katex tex="P" /> 转一圈。这条式子对竖直直线无效，因为竖直直线的斜率不存在。要把整束写全，须补上 <Katex tex="x=x_0" />。</p>
    <p>另一种写法用两条相交直线作骨架。若 <Katex tex="l_1" />、<Katex tex="l_2" /> 相交，则 <Katex tex="f_1+\lambda f_2=0" /> 是一族过交点的直线；两个方程的一般式相加减、乘系数再相加，得到的仍是一次方程，图形仍是直线。</p>

    <h3 class="sec" id="l4-para">平行系与垂直系</h3>
    <p>与已知直线 <Katex tex="Ax+By+C=0" /> 平行的直线，方向相同，只有位置在变。把常数项换成待定参数：</p>
    <p style="text-align:center"><Katex tex="Ax+By+m=0\quad(m\ne C)." display /></p>
    <p>要求「平行」而不是「重合」，就要排除 <Katex tex="m=C" />。实际解题时先设成这个形式，代入一个已知点定出 <Katex tex="m" />，再检查 <Katex tex="m\ne C" />。</p>
    <p>垂直的直线系要换方向。直线 <Katex tex="Ax+By+C=0" /> 的法向量是 <Katex tex="(A,B)" />，垂直直线的法向量与它垂直，可取 <Katex tex="(B,-A)" />，于是垂直系写成</p>
    <p style="text-align:center"><Katex tex="Bx-Ay+n=0." display /></p>
    <p>这两个系都不用讨论斜率是否存在，对竖直直线同样有效。已知一条直线和一个点，用平行系或垂直系设出方程，再代点求参数，比先求斜率再写点斜式省一步。</p>

    <h3 class="sec" id="l4-pencil">过交点的直线系</h3>
    <p>设两直线交于 <Katex tex="P_0(x_0,y_0)" />，则 <Katex tex="f_1(P_0)=f_2(P_0)=0" />。对任意实数 <Katex tex="\lambda" />，</p>
    <p style="text-align:center"><Katex tex="f_1(P_0)+\lambda f_2(P_0)=0," display /></p>
    <p>所以 <Katex tex="f_1+\lambda f_2=0" /> 表示的直线一定过 <Katex tex="P_0" />。反过来，任取一条过 <Katex tex="P_0" /> 且不是 <Katex tex="l_2" /> 的直线，在它上面另取一点 <Katex tex="Q" />。由 <Katex tex="f_2(Q)\ne0" /> 令</p>
    <p style="text-align:center"><Katex tex="\lambda=-\frac{f_1(Q)}{f_2(Q)}," display /></p>
    <p>则 <Katex tex="Q" /> 满足组合方程。一条直线由 <Katex tex="P_0" /> 与 <Katex tex="Q" /> 两点确定，所以这条直线就是该 <Katex tex="\lambda" /> 对应的成员。这说明除 <Katex tex="l_2" /> 外，过交点的每条直线都在族里。</p>
    <p><Katex tex="\lambda=0" /> 给出 <Katex tex="l_1" />；<Katex tex="\lambda" /> 趋于无穷时直线趋向 <Katex tex="l_2" />，但任何有限 <Katex tex="\lambda" /> 都得不到 <Katex tex="l_2" />。解题时若所求直线恰好是 <Katex tex="l_2" /> 的方向，须先把它代回题目检验，不能只靠 <Katex tex="\lambda" /> 的取值。两直线平行时 <Katex tex="f_1+\lambda f_2=0" /> 仍是一族平行线，不表示过交点的束。</p>

    <h3 class="sec" id="l4-equiv">同解变形</h3>
    <p>两个方程（或方程组）的解集相同，称它们<strong>同解</strong>。把方程变成同解方程的过程叫同解变形。判断是否同解，只看解集，不看形式；两边同时乘一个数、移项、合并同类项，形式变了，解集可能没有变。</p>
    <p>保持解集的变形有：两边同加同一个数或整式；两边同乘同一个不为零的常数；移项、合并同类项；方程组中把一个方程的非零倍加到另一个方程上。这几种操作在等式两边做的是同一个可逆动作，原来成立的点仍然成立，原来不成立的点仍然不成立。</p>
    <p>改变解集的变形有三种常见来源。两边平方：若一边可能为负，平方后会多出使两边互为相反数的点，这是增根。两边乘含未知数的式子：乘式为零的地方，原方程未必成立，却也满足变形后的方程，同样是增根。两边除以含未知数的式子：除式为零的地方，原方程可能成立，变形后不再成立，这是失根。</p>
    <p>几何上可以看得更清楚。圆的方程 <Katex tex="x^2+y^2=r^2" /> 由 <Katex tex="|OP|=r" /> 平方得到，两边都非负，平方前后同解。把 <Katex tex="y=\sqrt{r^2-x^2}" /> 平方，得到的是整个圆；下半圆上的点满足平方后的方程，却不满足原方程，这一支就是平方带进来的增根。联立两条直线时，把两式相加减得到组合方程，与原方程组同解（组合的系数行列式不为零时）；直线系 <Katex tex="f_1+\lambda f_2=0" /> 与 <Katex tex="f_1=0" /> 联立，解仍然是原交点。过交点能写成一族参数直线，依据正是这一点。</p>
    <div class="board-wrap">
      <BoardMount :factory="createEqEquiv" />
      <div class="cap">图 直4b · <b>同解变形机</b>：紫色点 <Katex tex="Q" /> 可拖。第一档蓝色上半圆是 <Katex tex="y=\sqrt{4-x^2}" /> 的解集，金色整圆是平方后的解集，红色虚线的下半圆是增根；第二档把 <Katex tex="x-1=0" /> 两边乘 <Katex tex="(y-2)" />，红色虚线的 <Katex tex="y=2" /> 随之多出；第三档把 <Katex tex="x(x-1)=0" /> 两边除以 <Katex tex="x" />，红色虚线的 <Katex tex="x=0" /> 被丢掉。把 <Katex tex="Q" /> 拖到红虚线上，两个徽章的成立情况会给出相反的结论。</div>
    </div>
    <p>写解答时，凡是做了平方、去分母、两边乘除含未知数的式子，最后都要回到原方程核验。增根要舍去，失根要补回。几何题里这一步常被省略，因为交点通常能直接看出在曲线上；但参数范围题、轨迹题里漏掉这一核验，答案就会多一支或少一支。</p>

    <h3 class="sec" id="l4-pit">漏线、增根与失根</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：用点斜式写整束，漏掉竖直直线。</strong><Katex tex="y-y_0=k(x-x_0)" /> 只覆盖斜率存在的直线。题目要求的直线可能恰好竖直，设方程时要单独讨论 <Katex tex="x=x_0" />，或者改用 <Katex tex="A(x-x_0)+B(y-y_0)=0" /> 这种含两个系数的形式。</li>
        <li><strong>提示二：<Katex tex="f_1+\lambda f_2=0" /> 取不到 <Katex tex="l_2" />。</strong>求出 <Katex tex="\lambda" /> 后要回头检查所求直线是不是 <Katex tex="l_2" />。若题目条件与 <Katex tex="l_2" /> 相容，须把它单独作为一个解写出来。</li>
        <li><strong>提示三：平方后不回代。</strong>把 <Katex tex="y=\sqrt{r^2-x^2}" /> 平方成整圆，或把含根号的方程两边平方，都可能带进使原式一边为负的点。解完必须代回原方程，确认两边的符号。</li>
        <li><strong>提示四：同乘含零因式、同除含零因式不讨论。</strong>乘以 <Katex tex="(y-2)" /> 会多出 <Katex tex="y=2" />；除以 <Katex tex="x" /> 会丢掉 <Katex tex="x=0" />。乘除之前先看这个式子能不能为零，能为零就分情况讨论。</li>
        <li><strong>提示五：平行系里取到了原直线。</strong>设 <Katex tex="Ax+By+m=0" /> 时，<Katex tex="m=C" /> 会退回已知直线，与「平行」的条件冲突。求出 <Katex tex="m" /> 后要检查这一条。</li>
      </ul>
    </div>
    <p>回收与预告：直线系把「过某点」写成一个参数，这与待定系数法同源，后面的曲线系 <Katex tex="f+\lambda g=0" /> 沿用的是同一条思路。同解变形的判断则贯穿整个解析几何：联立、消元、配方、平方，每一步都要知道解集有没有变。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLineFamily } from '../../../boards/linecircle/line/linefamily.js';
import { createBoard as createEqEquiv } from '../../../boards/linecircle/line/eqequiv.js';
import { LN_CHAPTERS } from './lnav.js';
</script>
