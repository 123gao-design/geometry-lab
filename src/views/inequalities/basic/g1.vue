<template>
  <ChPage :cur="1" no="基1" base="/inequalities/g" :chapters="G_CHAPTERS"
    title="基本不等式" sub="把算术均值与几何均值放进同一个半圆：直径 $AB=a+b$，C 把直径分成 a、b 两段，过 C 的垂线交半圆于 D，泰勒斯定理给出直角、射影定理给出 $CD^2=AC\cdot CB=ab$，于是竖弦长就是几何均值 $\sqrt{ab}$、半径长就是算术均值 $(a+b)/2$——而竖弦不可能超过半径。另附三条证明：作差配方、拼方图、ln 与 eˣ 的凹凸性。"
    :toc="[{ id: 'g1-plan', t: '图上安置：直径与垂线' }, { id: 'g1-proj', t: '射影定理与两均值' }, { id: 'g1-gap', t: '差距 A−G 的两种面貌' }, { id: 'g1-diff', t: '作差：恒等式与数值核对' }, { id: 'g1-square', t: '拼方图：4ab 与 (a+b)²' }, { id: 'g1-concave', t: '凹凸性：ln 与 eˣ' }, { id: 'g1-pit', t: '前提与取等' }]">
    <div class="note good" id="g1-law"><Katex tex="a,b>0" /> 时，<Katex tex="\sqrt{ab}\le\dfrac{a+b}{2}" />，等号当且仅当 <Katex tex="a=b" />。左边是几何均值、右边是算术均值，故称均值不等式；取等点在两数相等处，a、b 越悬殊差距越大。</div>
    <div class="board-wrap">
      <BoardMount :factory="createMC" />
      <div class="cap">图 基1 · <b>圆图均值机</b>：拖 a、b 或点预设，蓝橙两段直径被 C 分成 a 与 b，绿竖弦长 <Katex tex="\sqrt{ab}"/>、金半径长 <Katex tex="(a+b)/2"/>。看点：<Katex tex="a\ne b"/> 时 D 沉在弧顶下方，两条水平虚线之间夹着差距 <Katex tex="A-G"/>（右侧花括号读数）；按「⏩」让 b 滑向 a，竖弦缓缓升到半径、两线重合。</div>
    </div>

    <h3 class="sec" id="g1-plan">图上安置：直径与垂线</h3>
    <p>取任意正数 a、b，画直径 <Katex tex="AB=a+b" /> 的半圆，在直径上取 C 使 <Katex tex="AC=a,\ CB=b" />。过 C 作直径的垂线，交半圆于 D。这个安置让两个均值各占一个显眼位置：半径 <Katex tex="OD=\frac{a+b}{2}" /> 是算术均值（圆心把直径一分为二，任一半都是均值）；竖弦 <Katex tex="CD" /> 即将被证明是几何均值。剩下的工作，是把竖弦的长算出来。</p>

    <h3 class="sec" id="g1-proj">射影定理与两均值</h3>
    <p>D 在直径 <Katex tex="AB"/> 对应的半圆上，泰勒斯定理给 <Katex tex="\angle ADB=90^\circ" />；在直角三角形 ADB 中，DC 是斜边上的高，射影定理直接读出 <Katex tex="DC^2=AC\cdot CB=ab" />，故 <Katex tex="CD=\sqrt{ab}" />。弦与半径同在一个直角三角形 ODC 里比长短：<Katex tex="OD" /> 是斜边、<Katex tex="CD" /> 是直角边，斜边总不短于直角边，于是 <Katex tex="\sqrt{ab}\le\frac{a+b}{2}" />；两者相等当且仅当 C 与 O 重合，即 <Katex tex="a=b" />。一图把「几何 <Katex tex="\le"/> 算术」还原为「直角边不超过斜边」这个基本事实。</p>

    <h3 class="sec" id="g1-gap">差距 A−G 的两种面貌</h3>
    <p>记 <Katex tex="A=\frac{a+b}{2},\ G=\sqrt{ab}" />。代数层面，<Katex tex="A-G=\frac{(\sqrt{a}-\sqrt{b})^{2}}{2}" /> —— 差的平方除以二，非负且随两数悬殊增大；几何层面，图 基1 的两条水平虚线分别是过 G 的高度线与过 A 的半径水平线，它们的竖直间距正是这个 <Katex tex="A-G" />。两幅面貌互为翻译：平方差 <Katex tex="(\sqrt{a}-\sqrt{b})^{2}\ge0" /> 是这个图的代数本质。</p>

    <h3 class="sec" id="g1-diff">作差：恒等式与数值核对</h3>
    <p>不用图也能落定。把两个均值相减，凑成完全平方：</p>
    <p style="text-align:center"><Katex tex="\dfrac{a+b}{2}-\sqrt{ab}=\dfrac{a+b-2\sqrt{ab}}{2}=\dfrac{(\sqrt a-\sqrt b)^2}{2}" display /></p>
    <p>右边是平方的一半，对任意实数都不小于零，于是左边的差恒非负；等号只在 <Katex tex="\sqrt a=\sqrt b" />、即 <Katex tex="a=b" /> 时成立。整个过程只用了一条「平方非负」，不必借助任何图形。</p>
    <p>换成 <Katex tex="x=\sqrt a,\ y=\sqrt b" /> 更直白：<Katex tex="\dfrac{a+b}{2}-\sqrt{ab}=\dfrac{x^2+y^2}{2}-xy=\dfrac{(x-y)^2}{2}" />，说的是平方平均不小于乘积。这条恒等式还给出差的精确大小 —— 两数每悬殊一分，差就按 <Katex tex="(\sqrt a-\sqrt b)^2" /> 的形式变大，而不只是「大于零」。</p>
    <p>拿几组数核对一遍：后两列应当逐行相等，中间两列的差随 a、b 靠近而缩小。</p>
    <table>
      <tr><th><Katex tex="a" /></th><th><Katex tex="b" /></th><th><Katex tex="\tfrac{a+b}{2}" /></th><th><Katex tex="\sqrt{ab}" /></th><th><Katex tex="A-G" /></th><th><Katex tex="\tfrac{(\sqrt a-\sqrt b)^2}{2}" /></th></tr>
      <tr><td>1</td><td>9</td><td>5</td><td>3</td><td>2</td><td>2</td></tr>
      <tr><td>2</td><td>8</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
      <tr><td>3</td><td>12</td><td>7.5</td><td>6</td><td>1.5</td><td>1.5</td></tr>
      <tr><td>0.5</td><td>2</td><td>1.25</td><td>1</td><td>0.25</td><td>0.25</td></tr>
      <tr><td>4</td><td>4</td><td>4</td><td>4</td><td>0</td><td>0</td></tr>
    </table>
    <p>表里读到三件事：差恒非负、差有公式、取等只在 <Katex tex="a=b" /> —— 正是上面那行式子逐字说的话。这条路与性2 的作差比零、次1 的配方同源；反过来用就是 E7 反勾函数那套「积定和最小」，把 <Katex tex="a+b\ge 2\sqrt{ab}" /> 当成下界来求最值。</p>

    <h3 class="sec" id="g1-square">拼方图：4ab 与 (a+b)²</h3>
    <div class="board-wrap">
      <BoardMount :factory="createSQ" />
      <div class="cap">图 基1b · <b>拼方图</b>：边长 <Katex tex="a+b"/> 的正方形里，四块蓝橙相间的 <Katex tex="ab"/> 矩形沿边围成一圈，中间空出一块边长 <Katex tex="|a-b|"/> 的正方形。四块面积合计 <Katex tex="4ab"/>，加上中间的 <Katex tex="(a-b)^2"/> 恰好拼满整块。拖 a、b 看中间的空缺伸缩；<Katex tex="a=b"/> 时空缺缩成零，四块正好拼满 —— 取等。</div>
    </div>
    <p>作差证明的核心是「平方非负」，把这个平方摆成面积，就得到一张不必动笔的图：取边长 <Katex tex="a+b"/> 的正方形，四块 <Katex tex="ab"/> 的矩形沿边围一圈，中间空出来的恰好是边长 <Katex tex="|a-b|"/> 的正方形。四块矩形加中间一块拼满整块，于是</p>
    <p style="text-align:center"><Katex tex="(a+b)^2=4ab+(a-b)^2\ \ge\ 4ab" display /></p>
    <p>两边开方、再除以二，就是 <Katex tex="\sqrt{ab}\le\dfrac{a+b}{2}" />。中间那块缩成零面积时（<Katex tex="a=b" />），四块矩形恰好拼满，取等。</p>
    <p>拼方图与作差量的是同一条式子，只是量在不同层：图上看到的是 <Katex tex="(a+b)^2-4ab=(a-b)^2" />，也就是 <Katex tex="4(A^2-G^2)" />；作差量的是 <Katex tex="A-G" /> 本身。两者相差一个因子 <Katex tex="4(A+G)" /> —— 先开方再除，就回到作差那一行。</p>

    <h3 class="sec" id="g1-concave">凹凸性：ln 与 eˣ 的中点高低</h3>
    <div class="board-wrap">
      <BoardMount :factory="createLC" />
      <div class="cap">图 基1c · <b>凹凸性证明机</b>：模式一是上凸的 <Katex tex="y=\ln x"/>，橙弦整段落在蓝曲线下方，横坐标中点处曲线上的绿点 N 高过弦上的金点 M；模式二是下凸的 <Katex tex="y=e^x"/>，弦翻到曲线上方，N 反而低于 M。两种情形下中点的高低差都非负，取指数或开方就落回 <Katex tex="\sqrt{ab}\le\dfrac{a+b}{2}"/>。</div>
    </div>
    <p>第三条路来自函数的凹凸性。对数曲线 <Katex tex="y=\ln x" /> 是上凸（凹）的：曲线上任意两点连成的弦，整段落在曲线下方。取横坐标 <Katex tex="a" /> 与 <Katex tex="b" /> 两点 P、Q，在横坐标中点 <Katex tex="\frac{a+b}{2}" /> 处竖直相比：曲线上的高度是 <Katex tex="\ln\frac{a+b}{2}" />，弦上的高度是两端高度的平均 <Katex tex="\frac{\ln a+\ln b}{2}=\ln\sqrt{ab}" />。弦在下方，于是</p>
    <p style="text-align:center"><Katex tex="\ln\dfrac{a+b}{2}\ \ge\ \dfrac{\ln a+\ln b}{2}=\ln\sqrt{ab}" display /></p>
    <p><Katex tex="\ln" /> 单调递增，两边的对数可以直接去掉，得到 <Katex tex="\frac{a+b}{2}\ge\sqrt{ab}" />。取等对应图上的弦缩成一点：<Katex tex="a=b" /> 时 P、Q 重合，曲线与弦在中点处同高。</p>
    <p>指数曲线 <Katex tex="y=e^x" /> 把这张图整个翻过来：它是下凸的，弦落在曲线上方。取 <Katex tex="x=\ln a,\ y=\ln b" />，中点处弦高 <Katex tex="\frac{a+b}{2}" />、曲线高 <Katex tex="e^{(\ln a+\ln b)/2}=\sqrt{ab}" />，于是 <Katex tex="\sqrt{ab}\le\frac{a+b}{2}" />，一字不差。两张图关于直线 <Katex tex="y=x" /> 互为镜像：曲线上的点 <Katex tex="(u,\ln u)" /> 翻过去就是 <Katex tex="(\ln u,u)" />。</p>
    <p>这条路的价值在于可以照搬：任何凹函数都满足「中点处的函数值不小于两端函数值的平均」，凸函数则反过来。这是琴生不等式最简的情形，也是要专门记住 <Katex tex="\ln" /> 的凹性与 <Katex tex="e^x" /> 的凸性的原因 —— 取对数把乘方摊成加法，取指数把加法抬成乘方，两种手段在同一条不等式上各管一头。</p>

    <h3 class="sec" id="g1-pit">前提与取等</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：前提是 a、b 必须为正。</strong>负数时 <Katex tex="\sqrt{ab}" /> 在实数域无意义（或会反转符号），圆图只对两段正长度成立；作差那条路虽然对任意实数都能写，但开方一步同样要求 <Katex tex="a,b\ge 0" />。</li>
        <li><strong>提示二：取等要在可行范围内。</strong>断言「≥」成立不算完，用该不等式求最值时还要检查 <Katex tex="a=b" /> 是否取得到——等号取不到意味着求出的只是上下界而非最值（见基2 的提示）。</li>
        <li><strong>提示三：四条证明各管一头。</strong>圆图给的是几何直觉，作差给的是可算的差，拼方给的是面积，凹凸性给的是可推广的模板。做题时最省事的是作差，推广到多变量时用凹凸性。</li>
      </ul>
    </div>
    <p>下一章把这条不等式转成求最值的工具：和定求积的最大、积定求和的最小，取等条件就是最值能否取到的判据。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMC } from '../../../boards/inequalities/basic/meancirc.js';
import { createBoard as createSQ } from '../../../boards/inequalities/basic/sqdecomp.js';
import { createBoard as createLC } from '../../../boards/inequalities/basic/logconcave.js';
import { G_CHAPTERS } from './gnav.js';
</script>
