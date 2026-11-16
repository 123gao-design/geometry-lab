<template>
  <ChPage :cur="4" no="解4" base="/complexvar/a" :chapters="CW_CHAPTERS"
    title="柯西积分公式"
    sub="柯西定理说解析函数绕一圈积分为零。把被积函数里塞进一个 1/(z−z0)，零就没那么整齐了：绕出来的值恰好是圆内那一点上的函数值。边界上的值因此缩短成了一条公式，内部每一点都被边界唯一决定。"
    :toc="[{ id: 'a4-form', t: '公式与推导' }, { id: 'a4-higher', t: '高阶导数' }, { id: 'a4-mean', t: '平均值与最大模' }, { id: 'a4-app', t: '三类应用' }, { id: 'a4-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f" /> 在简单闭曲线 <Katex tex="C" /> 所围闭区域内解析，<Katex tex="z_0" /> 是 <Katex tex="C" /> 内部任一点，<Katex tex="C" /> 取逆时针方向，则 <Katex tex="f(z_0)=\dfrac{1}{2\pi i}\oint_C\dfrac{f(z)}{z-z_0}\,dz" />。被积函数在 <Katex tex="z_0" /> 处不解析，整条公式的分量全在这一点上。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCauchyInt" />
      <div class="cap">图 解4 · <b>柯西积分公式机</b>：左图是 <Katex tex="z" /> 平面上的逆时针圆路与可拖的点 <Katex tex="z_0" />，右图是 <Katex tex="f" /> 在整条圆路上的取值所围成的曲线。看点：① <Katex tex="z_0" /> 在圆内时，框里的「边界积分」与 <Katex tex="f(z_0)" /> 差值为 <Katex tex="0" />；② 把 <Katex tex="z_0" /> 拖到圆外，边界积分立即归零，而 <Katex tex="f(z_0)" /> 本身仍不是零；③ 拖半径 <Katex tex="R" /> 从 <Katex tex="0.6" /> 到 <Katex tex="1.8" />，只要 <Katex tex="z_0" /> 一直在圆内，两栏读数就一起不动。</div>
    </div>

    <h3 class="sec" id="a4-form">公式与推导</h3>
    <p>先把 <Katex tex="z_0" /> 从被积函数里挪开。以 <Katex tex="z_0" /> 为心、<Katex tex="\rho" /> 为半径作一个很小的圆 <Katex tex="C_\rho" />，整个落在 <Katex tex="C" /> 内部。函数 <Katex tex="\dfrac{f(z)}{z-z_0}" /> 在两条圆之间的环形区域里解析，由柯西定理的加强形式，沿 <Katex tex="C" /> 与沿 <Katex tex="C_\rho" /> 的积分相等：</p>
    <p style="text-align:center"><Katex display tex="\oint_C\frac{f(z)}{z-z_0}\,dz=\oint_{C_\rho}\frac{f(z)}{z-z_0}\,dz." /></p>
    <p>小圆上的积分好算，因为 <Katex tex="\rho" /> 可以取到任意小。<Katex tex="z=z_0+\rho e^{i\theta}" />，<Katex tex="dz=i\rho e^{i\theta}d\theta" />，分母恰好是 <Katex tex="\rho e^{i\theta}" />，两者相消：</p>
    <p style="text-align:center"><Katex display tex="\oint_{C_\rho}\frac{f(z)}{z-z_0}\,dz=\int_0^{2\pi}f(z_0+\rho e^{i\theta})\,i\,d\theta=i\int_0^{2\pi}f(z_0+\rho e^{i\theta})\,d\theta." /></p>
    <p>被积函数在 <Katex tex="z_0" /> 连续，<Katex tex="\rho\to0" /> 时整个积分趋于 <Katex tex="2\pi i f(z_0)" />。两边一联立，公式就出来了。</p>
    <p>推导里最关键的一步是「把大圆缩成小圆」。这一步不改变积分值，却把问题从「随便一条曲线」缩到「一个可以取无穷小的圆」，被积函数在小圆上于是退化成常数。<b>奇点越小越好算</b>，这个思路在留数定理那一章会被制度化。</p>

    <h3 class="sec" id="a4-higher">高阶导数</h3>
    <p>公式还能再往下推。把 <Katex tex="f(z_0)" /> 里的 <Katex tex="z_0" /> 当作变量求导，导数符号与积分符号可以交换（积分只涉及 <Katex tex="z" />，与 <Katex tex="z_0" /> 无关），每求一次导，分母多出一次方：</p>
    <p style="text-align:center"><Katex display tex="f^{(n)}(z_0)=\frac{n!}{2\pi i}\oint_C\frac{f(z)}{(z-z_0)^{n+1}}\,dz." /></p>
    <p>这条式子有两个后果。其一，<Katex tex="f" /> 在 <Katex tex="C" /> 内有一阶导数，就自动有无穷阶导数——幂次怎么涨，积分都算得出来。这正是上一章许诺过的那条结论，现在兑现了。其二，它把高阶导数的计算转成了绕圈的积分，反过来，复杂的积分也能用它化成求导。</p>
    <p>拿它算 <Katex tex="\oint_{|z|=2}\dfrac{e^z}{z^3}\,dz" />：取 <Katex tex="f=e^z" />、<Katex tex="z_0=0" />、<Katex tex="n=2" />，得 <Katex tex="\dfrac{2\pi i}{2!}e^0=\pi i" />。被积函数在这条路上没有分母为零的地方之外的麻烦，一步就到。</p>
    <p>由它还能推出柯西不等式：<Katex tex="|f^{(n)}(z_0)|\le\dfrac{n!M}{R^n}" />，其中 <Katex tex="M" /> 是 <Katex tex="|f|" /> 在圆 <Katex tex="|z-z_0|=R" /> 上的最大值。证明只用积分模估计 <Katex tex="\left|\int g\,dz\right|\le ML" />，曲线长度取 <Katex tex="2\pi R" />，恰好把 <Katex tex="2\pi" /> 消掉。</p>

    <h3 class="sec" id="a4-mean">平均值与最大模</h3>
    <p>在公式里取 <Katex tex="C" /> 为圆 <Katex tex="z=z_0+re^{i\theta}" />，参数化后分母消掉，剩下</p>
    <p style="text-align:center"><Katex display tex="f(z_0)=\frac{1}{2\pi}\int_0^{2\pi}f(z_0+re^{i\theta})\,d\theta." /></p>
    <p>这是<b>平均值公式</b>：解析函数在圆心处的值，等于它在圆周上所有取值的算术平均。实函数的平均值公式要加条件（调和函数才有），解析函数则无条件成立。</p>
    <p>平均值公式立刻给出<b>最大模原理</b>：若 <Katex tex="f" /> 在区域内部不恒为常数，则 <Katex tex="|f|" /> 在区域内部取不到最大值。理由很直白——内部某点的模若真是最大，它等于周围一圈的平均，而周围一圈不可能全都比它小又平均出它来，除非整圈一样大，那又逼着 <Katex tex="f" /> 是常数。</p>
    <p>推论是：解析函数在闭区域上的最大模一定在边界上取到。这条性质在数值计算里很有用：要估计函数在区域里有多大，只需检查边界。画板右图的金色点正是把「内部由边界决定」画成了一幅图——边界绕一圈，中心点就定了。</p>

    <h3 class="sec" id="a4-app">三类应用</h3>
    <p><b>其一，算积分。</b>凡是被积函数能拆成 <Katex tex="\dfrac{f(z)}{z-z_0}" /> 且 <Katex tex="f" /> 在围内解析的，积分值直接读 <Katex tex="2\pi i f(z_0)" />。<Katex tex="\oint_{|z|=1}\dfrac{e^z}{z}\,dz=2\pi i" />、<Katex tex="\oint_{|z-1|=1}\dfrac{dz}{z^2-1}" />（此时 <Katex tex="f(z)=\dfrac1{z+1}" />，<Katex tex="z_0=1" />）都是这一型。</p>
    <p><b>其二，判解析函数的性质。</b>用最大模原理可证<b>刘维尔定理</b>：有界的整函数必为常数。证明是拿柯西不等式卡 <Katex tex="|f'(z_0)|\le\dfrac{M}{R}" />，<Katex tex="M" /> 固定而 <Katex tex="R" /> 可以取任意大，于是 <Katex tex="f'=0" />。由刘维尔定理还能顺带证出代数基本定理：若非常数多项式 <Katex tex="P" /> 无零点，则 <Katex tex="1/P" /> 是整函数且在无穷远趋零，因此有界，必为常数，与 <Katex tex="P" /> 非常数矛盾。</p>
    <p><b>其三，估计条件。</b>柯西不等式与最大模原理合起来，提供了「用边界控制内部」的定量工具。具体来说：知道函数在一条圆上的最大值，就能卡住它在这条圆内每一点的高阶导数；反过来，想构造满足特定导数上界的解析函数，也得靠这条不等式说明做不到。</p>

    <h3 class="sec" id="a4-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="z_0" /> 必须在曲线内部。</strong>在圆外时左端按 <Katex tex="0" /> 算，公式里的 <Katex tex="f(z_0)" /> 不能拿来当答案。画板上把点拖出圆外，右栏两行字立刻分开，就是这个道理。</li>
        <li><strong>提示二：方向取逆时针。</strong>若 <Katex tex="C" /> 走顺时针，公式前面多一个负号。写答案前先看一眼积分号下的方向。</li>
        <li><strong>提示三：<Katex tex="f" /> 在围内要处处解析。</strong>被积函数只在 <Katex tex="z_0" /> 一处坏掉，其余地方都得干净。若围内还有别的奇点，得先把它们分开处理，或者等下一章的留数定理。</li>
        <li><strong>提示四：高阶公式里分母的次数是 <Katex tex="n+1" />。</strong>算 <Katex tex="\oint\dfrac{g(z)}{(z-z_0)^3}dz" /> 时取的是 <Katex tex="n=2" />，系数是 <Katex tex="\dfrac{2\pi i}{2!}=\pi i" />。次数与系数的对应写反，结果差一个因子。</li>
      </ul>
    </div>
    <p>回收与预告：柯西积分公式把解析函数的值、导数、平均值三件事都说清楚了，前提是「围内只有 <Katex tex="z_0" /> 一处不解析」。下一章放开这个前提：围内可以有好几个奇点，每个奇点各贡献一份，总和乘以 <Katex tex="2\pi i" /> 就是积分值——这就是留数定理，也是复变函数里最常用的一条计算工具。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCauchyInt } from '../../../boards/complexvar/analytic/cauchyint.js';
import { CW_CHAPTERS } from './cwnav.js';
</script>
