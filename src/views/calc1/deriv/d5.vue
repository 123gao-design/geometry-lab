<template>
  <ChPage :cur="5" no="微5" base="/calc1/d" :chapters="DV_CHAPTERS"
    title="洛必达法则与未定式"
    sub="分子分母同时趋于零或同时趋于无穷时，商的极限无法直接读出。洛必达法则说：这时两个导数之比接管了这个极限。"
    :toc="[{ id: 'd5-type', t: '两种基本未定式' }, { id: 'd5-rule', t: '洛必达法则' }, { id: 'd5-other', t: '其余型式的化归' }, { id: 'd5-usage', t: '使用要点' }]">

    <div class="note good" id="d5-type">若 <Katex tex="\lim f(x)=\lim g(x)=0" />（或同为无穷大），且 <Katex tex="\lim\dfrac{f'(x)}{g'(x)}" /> 存在，则 <Katex tex="\lim\dfrac{f(x)}{g(x)}=\lim\dfrac{f'(x)}{g'(x)}" />。这就是洛必达法则，适用于 <Katex tex="\dfrac00" /> 型与 <Katex tex="\dfrac{\infty}{\infty}" /> 型。</div>

    <div class="board-wrap">
      <BoardMount :factory="createHopital" />
      <div class="cap">图 微5 · <b>洛必达法则</b>：左图把 <Katex tex="f" />（蓝）与 <Katex tex="g" />（绿）画在一起，两者在 <Katex tex="x\to0" /> 时都趋于零；右图改画两条比值曲线，橙色是 <Katex tex="f/g" />，紫色是 <Katex tex="f'/g'" />，金虚线是它们的公共极限 <Katex tex="L" />。右栏列出当前 <Katex tex="x" /> 处的四个读数。看点：拖 <Katex tex="x" /> 靠近零，两条比值曲线一起贴向 <Katex tex="L" />。</div>
    </div>

    <h3 class="sec" id="d5-type">两种基本未定式</h3>
    <p>把 <Katex tex="x\to0" /> 代入 <Katex tex="\dfrac{\sin x}{x}" />，分子分母都是零，商没有定义，但极限可能存在。这类式子叫 <Katex tex="\dfrac00" /> 型未定式。「未定」是说单看分子分母各自的极限为零，还无法决定商的极限，必须进一步比较两者趋于零的快慢。</p>
    <p>同样的情形出现在无穷大上。<Katex tex="\dfrac{\ln x}{x}" /> 在 <Katex tex="x\to+\infty" /> 时分子分母都趋于无穷，商却趋于零，因为对数增长得比一次函数慢。这类叫 <Katex tex="\dfrac{\infty}{\infty}" /> 型。</p>
    <p>极3 用无穷小的阶比较过这类极限，那一套方法在多项式与简单函数之间很有效。洛必达法则给的是一条通用的路：把比较两个函数换成比较它们的导数。图 微5 的三个例子都属于 <Katex tex="\dfrac00" /> 型，右图的紫色曲线正是 <Katex tex="f'/g'" /> 的比值。</p>

    <h3 class="sec" id="d5-rule">洛必达法则</h3>
    <p>法则是柯西中值定理的直接推论。设 <Katex tex="f" />、<Katex tex="g" /> 在 <Katex tex="x_0" /> 的某去心邻域内可导，<Katex tex="g'(x)\ne0" />，且</p>
    <p style="text-align:center"><Katex display tex="\lim_{x\to x_0}f(x)=\lim_{x\to x_0}g(x)=0,\qquad \lim_{x\to x_0}\frac{f'(x)}{g'(x)}=L" /></p>
    <p>则 <Katex tex="\lim\dfrac{f(x)}{g(x)}=L" />。证明时在 <Katex tex="x_0" /> 处补充定义 <Katex tex="f(x_0)=g(x_0)=0" />（补充定义不改变极限），在 <Katex tex="[x_0,x]" /> 上用柯西定理得 <Katex tex="\dfrac{f(x)}{g(x)}=\dfrac{f'(\xi)}{g'(\xi)}" />，其中 <Katex tex="\xi" /> 在 <Katex tex="x_0" /> 与 <Katex tex="x" /> 之间。当 <Katex tex="x\to x_0" /> 时 <Katex tex="\xi\to x_0" />，右边趋于 <Katex tex="L" />。</p>
    <p><Katex tex="\dfrac{\infty}{\infty}" /> 型的证明要绕一点，结论不变，条件也照样是「导数之比的极限存在」。法则可以连续使用：若 <Katex tex="f'/g'" /> 仍是未定式，只要条件满足，可以再求一次导。</p>
    <p>以图 微5 的第二个例子为例：</p>
    <p style="text-align:center"><Katex display tex="\lim_{x\to0}\frac{1-\cos x}{x^2}=\lim_{x\to0}\frac{\sin x}{2x}=\lim_{x\to0}\frac{\cos x}{2}=\frac12" /></p>
    <p>第一步求导后仍是 <Katex tex="\dfrac00" /> 型，第二步再求一次导，比值不再是未定式，直接代入即得。图中橙色曲线与紫色曲线都收向 <Katex tex="0.5" />。</p>

    <h3 class="sec" id="d5-other">其余型式的化归</h3>
    <p>除了两种基本型，还有 <Katex tex="0\cdot\infty" />、<Katex tex="\infty-\infty" />、<Katex tex="0^0" />、<Katex tex="1^\infty" />、<Katex tex="\infty^0" /> 五种。它们都能化成基本型：</p>
    <p><b>积型 <Katex tex="0\cdot\infty" />：</b>把其中一个因子搬到分母上，<Katex tex="f g=\dfrac{f}{1/g}" /> 变为 <Katex tex="\dfrac00" />，或 <Katex tex="fg=\dfrac{g}{1/f}" /> 变为 <Katex tex="\dfrac{\infty}{\infty}" />。例如 <Katex tex="\lim\limits_{x\to0^+}x\ln x=\lim\limits_{x\to0^+}\dfrac{\ln x}{1/x}=\lim\limits_{x\to0^+}\dfrac{1/x}{-1/x^2}=0" />。</p>
    <p><b>差型 <Katex tex="\infty-\infty" />：</b>通分或提出公因子，化成商。例如 <Katex tex="\dfrac{1}{\sin x}-\dfrac1x=\dfrac{x-\sin x}{x\sin x}" />，在 <Katex tex="x\to0" /> 时为 <Katex tex="\dfrac00" /> 型。</p>
    <p><b>幂型：</b>一律先取对数。设 <Katex tex="y=u(x)^{v(x)}" />，则 <Katex tex="\ln y=v(x)\ln u(x)" />，右边是积型。算出 <Katex tex="\ln y" /> 的极限 <Katex tex="A" /> 后，原极限为 <Katex tex="\mathrm{e}^A" />。</p>
    <p>以 <Katex tex="\lim\limits_{x\to\infty}\left(1+\dfrac1x\right)^x" /> 为例：<Katex tex="\ln y=x\ln\left(1+\dfrac1x\right)=\dfrac{\ln(1+1/x)}{1/x}" />，化为 <Katex tex="\dfrac00" /> 型，求导得 <Katex tex="\dfrac{1}{1+1/x}\to1" />，故原极限为 <Katex tex="\mathrm{e}" />。这与极5 用单调有界准则得到的结论一致，两条路互相印证。</p>

    <h3 class="sec" id="d5-usage">使用要点</h3>
    <p><b>先验证再使用。</b>法则的前提是未定式。若分子分母的极限一为零一非零，商的极限是无穷或零，根本不是未定式，直接读即可，用洛必达反而会算错。</p>
    <p><b>用完要检查。</b>法则只说「导数之比的极限存在时，两极限相等」，并未保证导数之比一定存在。若导数之比的极限不存在（包括振荡），原极限仍可能存在，此时法则失效，不能反过来说原极限不存在。<Katex tex="\lim\limits_{x\to\infty}\dfrac{x+\sin x}{x}" /> 就是一例：原极限为 <Katex tex="1" />，求导后的比值是 <Katex tex="1+\cos x" />，在无穷远处振荡无极限。</p>
    <p><b>能用等价无穷小就别求导。</b>乘除结构里的因子先替换成等价无穷小，可以省去多次求导。极3 的 <Katex tex="\sin x\sim x" />、<Katex tex="1-\cos x\sim\dfrac{x^2}{2}" /> 在这里直接可用。</p>
    <p><b>不是商的求导法则。</b>法则操作的对象是整个商，得到的是 <Katex tex="\dfrac{f'}{g'}" />，而不是 <Katex tex="\left(\dfrac fg\right)'" />。写成后者是常见笔误，两者毫无关系。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：未定式的判定要在取极限之后。</strong>先看分子分母各自的极限。同为 0 或同为无穷才是基本型；一个为 0 一个非零时，商的极限是确定的，不必也不能用洛必达。</li>
        <li><strong>提示二：法则失效不等于极限不存在。</strong>导数之比的极限不存在时，原极限仍可能是存在的。遇到振荡情形应当改用夹逼或其它方法，不能凭洛必达算出无极限就下结论。</li>
        <li><strong>提示三：幂型必须先取对数。</strong><Katex tex="1^\infty" /> 不是 <Katex tex="1" />：底数在变，指数也在变。<Katex tex="(1+1/x)^x" /> 与 <Katex tex="1" /> 的差别随 <Katex tex="x" /> 增大而减小，但极限是 <Katex tex="\mathrm{e}" /> 而不是 1。</li>
        <li><strong>提示四：求导次数要适可而止。</strong>每求一次导，式子往往更复杂。若一次求导后已能直接读出极限，就停手；反复求导既容易算错，也可能把简单的结构毁掉。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHopital } from '../../../boards/calc1/deriv/hopital.js';
import { DV_CHAPTERS } from './dnav.js';
</script>
