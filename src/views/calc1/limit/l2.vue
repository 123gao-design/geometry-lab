<template>
  <ChPage :cur="2" no="极2" base="/calc1/l" :chapters="CL_CHAPTERS"
    title="函数极限与左右极限"
    sub="x 逼近 x₀ 的路不止一条：从左边来、从右边来、从两侧一起靠拢。极限是否存在，要先看两条路是否通向同一个数。"
    :toc="[{ id: 'l2-near', t: '两种趋近方式' }, { id: 'l2-side', t: '单侧极限' }, { id: 'l2-val', t: '极限与函数值无关' }, { id: 'l2-law', t: '无穷远处的极限与运算法则' }]">

    <div class="note good" id="l2-near">设函数 <Katex tex="f" /> 在 <Katex tex="x_0" /> 的去心邻域内有定义。若存在常数 <Katex tex="A" />，当 <Katex tex="x" /> 无限接近 <Katex tex="x_0" />（但不等于 <Katex tex="x_0" />）时 <Katex tex="f(x)" /> 无限接近 <Katex tex="A" />，就说 <Katex tex="f(x)" /> 在 <Katex tex="x_0" /> 处的<b>极限</b>为 <Katex tex="A" />，记作 <Katex tex="\lim\limits_{x\to x_0}f(x)=A" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createTwoSide" />
      <div class="cap">图 极2 · <b>函数的左右极限</b>：绿点从左侧滑向 <Katex tex="x_0=1" />，紫点从右侧滑来，<Katex tex="\delta" /> 滑块控制它们与 <Katex tex="x_0" /> 的距离；空心圈是曲线在该点的缺口，金色实心点是 <Katex tex="f(1)" /> 的实际取值。看点：三个预设依次是连续、可去、跳跃，前两个的两个彩色点落向同一个高度，第三个落向两个不同高度；<Katex tex="f(1)" /> 的位置始终不参与判决。</div>
    </div>

    <h3 class="sec" id="l2-near">两种趋近方式</h3>
    <p>数列只有一条路：序号一路增大。函数的自变量连续取遍一段区间，趋近的方式就分成了两类。一类是 <Katex tex="x\to x_0" />，要求 <Katex tex="x" /> 落在 <Katex tex="x_0" /> 的一个小邻域内；另一类是 <Katex tex="x\to\infty" />，要求 <Katex tex="|x|" /> 足够大。两种情形的定义结构相同，只有最后那个不等式换了对象：</p>
    <p><Katex display tex="\forall\,\varepsilon>0,\ \exists\,\delta>0,\quad 0<|x-x_0|<\delta\ \Longrightarrow\ |f(x)-A|<\varepsilon" /></p>
    <p><Katex display tex="\forall\,\varepsilon>0,\ \exists\,X>0,\quad |x|>X\ \Longrightarrow\ |f(x)-A|<\varepsilon" /></p>
    <p>这里的 <Katex tex="0<|x-x_0|" /> 是<b>去心</b>的意思：<Katex tex="x" /> 可以任意接近 <Katex tex="x_0" />，但取不到 <Katex tex="x_0" /> 本身。这一笔是理解后面全部结论的关键，极限从不使用 <Katex tex="f(x_0)" /> 的值，甚至 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处没有定义也不妨碍极限存在。</p>

    <h3 class="sec" id="l2-side">单侧极限</h3>
    <p>把 <Katex tex="x" /> 限制在 <Katex tex="x_0" /> 的某一侧，就得到<b>单侧极限</b>：<Katex tex="x<x_0" /> 时称为左极限 <Katex tex="\lim\limits_{x\to x_0^-}f(x)" />，<Katex tex="x>x_0" /> 时称为右极限 <Katex tex="\lim\limits_{x\to x_0^+}f(x)" />。定义只把 <Katex tex="0<|x-x_0|<\delta" /> 换成 <Katex tex="-\delta<x-x_0<0" /> 或 <Katex tex="0<x-x_0<\delta" />。</p>
    <p><b>双侧极限存在，当且仅当左右极限都存在并且相等。</b>充分性是显然的：两侧都进带，合起来就是去心邻域全进带。必要性要注意，左右极限都不需要事先假定存在——若 <Katex tex="x\to x_0" /> 时极限为 <Katex tex="A" />，取任一侧的子区间仍是原来的不等式，两个单侧极限必然都等于 <Katex tex="A" />。</p>
    <p>图 极2 的第三个预设就是反面的例子：<Katex tex="x<1" /> 时取 <Katex tex="x+1" />、<Katex tex="x>1" /> 时取 <Katex tex="x+3" />，左极限是 <Katex tex="2" />、右极限是 <Katex tex="4" />。两侧的彩色点分别贴着高度 <Katex tex="2" /> 与 <Katex tex="4" /> 落下去，中间空出高度 <Katex tex="2" /> 的一段——双侧极限不存在。这种落差叫<b>跳跃</b>，落差的大小就是两个单侧极限之差。</p>

    <h3 class="sec" id="l2-val">极限与函数值无关</h3>
    <p>第二个预设是 <Katex tex="f(x)=\dfrac{x^2-1}{x-1}" />。它在 <Katex tex="x=1" /> 处没有定义（分母为零），但约分后 <Katex tex="f(x)=x+1\ (x\ne1)" />，两侧的点都落向高度 <Katex tex="2" />，所以极限是 <Katex tex="2" />。若把这个函数在 <Katex tex="x=1" /> 处补定义为 <Katex tex="f(1)=3" />，曲线在 <Katex tex="(1,2)" /> 处留一个洞，另有一点孤零零地挂在高度 <Katex tex="3" /> 上——左右极限一点没变，仍是 <Katex tex="2" />。</p>
    <p>把第二、第三两个预设并排看：前者左右极限相等而函数值另给，后者左右极限本身就不等。<b>极限刻画的是邻近处的趋势，函数值刻画的是这一点上的取值</b>，两者是两件事。极4 会以「两者是否相等」作为连续与否的判别标准。</p>

    <h3 class="sec" id="l2-law">无穷远处的极限与运算法则</h3>
    <p>把 <Katex tex="x" /> 推向无穷时，常用的一条办法是化归到零：求 <Katex tex="\lim\limits_{x\to\infty}\dfrac{2x^2+1}{x^2-3}" />，分子分母同除 <Katex tex="x^2" /> 得 <Katex tex="\dfrac{2+x^{-2}}{1-3x^{-2}}" />，而 <Katex tex="x^{-2}\to0" />，极限就是 <Katex tex="2" />。这里用到极限的运算法则：若 <Katex tex="\lim f=A" />、<Katex tex="\lim g=B" /> 都存在，则</p>
    <p><Katex display tex="\lim(f\pm g)=A\pm B,\qquad \lim(fg)=AB,\qquad \lim\frac{f}{g}=\frac{A}{B}\ (B\ne0)" /></p>
    <p>这些法则把复杂的极限拆成若干简单极限，前提是拆开后每一块都存在。若出现 <Katex tex="\dfrac{0}{0}" />、<Katex tex="\dfrac{\infty}{\infty}" /> 这样的形式，法则不能直接用，要靠约分、有理化、等价替换（极3）或夹逼（极5）先变形。</p>
    <p>法则还可写成「常数可以提出来」「极限的四则与四则的极限可交换」。复合函数的极限 <Katex tex="\lim\limits_{x\to x_0}f(g(x))=f\Bigl(\lim\limits_{x\to x_0}g(x)\Bigr)" /> 需要 <Katex tex="f" /> 在外层极限处连续，这一条件到极4 才能说清楚。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：极限存在与有定义是两件事。</strong>函数在 <Katex tex="x_0" /> 处无定义，极限仍可能存在；反之极限不存在时，函数值照样可以取到。</li>
        <li><strong>提示二：只算一侧不等于算出极限。</strong><Katex tex="\lim\limits_{x\to0^+}\sqrt{x}=0" />，但从左侧趋近时根号下为负，函数根本没有定义，双侧极限不存在。</li>
        <li><strong>提示三：<Katex tex="\infty" /> 不是数。</strong>不能把 <Katex tex="\lim f=\infty" /> 理解成「极限存在且等于无穷」；按定义这仍属于极限不存在，只是失败的方式有规律。</li>
        <li><strong>提示四：运算法则先验存在。</strong>先确认两块极限都存在，再拆开；直接写 <Katex tex="\lim\dfrac{f}{g}=\dfrac{\lim f}{\lim g}" /> 而分母极限为零，整条推理作废。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTwoSide } from '../../../boards/calc1/limit/twoside.js';
import { CL_CHAPTERS } from './lnav.js';
</script>
