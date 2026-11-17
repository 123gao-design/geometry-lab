<template>
  <ChPage :cur="3" no="解3" base="/complexvar/a" :chapters="CW_CHAPTERS"
    title="复积分与柯西定理"
    sub="复积分沿一条曲线把函数值与弧长增量乘起来再累加。解析函数在这件事上格外听话：只要曲线围住的区域里处处解析，绕一圈的积分就是零。这条结论把「内部」与「边界」第一次接上。"
    :toc="[{ id: 'a3-def', t: '复积分的定义' }, { id: 'a3-calc', t: '参数化计算' }, { id: 'a3-cauchy', t: '柯西定理' }, { id: 'a3-deform', t: '变形与路径无关' }, { id: 'a3-pit', t: '四条提示' }]">
    <div class="note good">设曲线 <Katex tex="C" /> 光滑，<Katex tex="f" /> 在 <Katex tex="C" /> 上有定义。把 <Katex tex="C" /> 分成小段，在每段上任取一点 <Katex tex="\zeta_k" />，作和 <Katex tex="\sum f(\zeta_k)\Delta z_k" />，当分点越来越密、每段长度都趋于零时，若这个和趋于一个与分法和取点都无关的数，就叫它 <Katex tex="f" /> 沿 <Katex tex="C" /> 的<b>复积分</b>，记作 <Katex tex="\int_C f(z)\,dz" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createIntPath" />
      <div class="cap">图 解3 · <b>复积分与柯西定理</b>：左图是一条逆时针圆路，半径可调；右图是「积分走到哪里」的累计曲线——沿路每走一小步，就把 <Katex tex="f(z)\Delta z" /> 加进累计和。看点：① <Katex tex="f=z^2" /> 解析，累计曲线走满一圈又落回起点，闭路积分为 <Katex tex="0" />；② <Katex tex="f=1/z" /> 在圆内有奇点，累计曲线恰好绕一圈，终点是 <Katex tex="2\pi i" />，拖半径不动分毫；③ <Katex tex="f=\bar z" /> 非解析，累计曲线不闭合，终点随半径按 <Katex tex="2\pi iR^2" /> 变。</div>
    </div>

    <h3 class="sec" id="a3-def">复积分的定义</h3>
    <p>定义与实函数的定积分同构：分段、取点、作和、取极限。差别在于每一项都是复数乘法，方向因此带进了结果——同一段曲线反着走，积分变号。曲线有向，这是复积分与第一类曲线积分的根本区别。</p>
    <p>把 <Katex tex="f=u+iv" /> 与 <Katex tex="dz=dx+i\,dy" /> 代进去展开，复积分化成两个实的第二类曲线积分：</p>
    <p style="text-align:center"><Katex display tex="\int_C f(z)\,dz=\int_C(u\,dx-v\,dy)+i\int_C(v\,dx+u\,dy)." /></p>
    <p>这条式子把复积分接回了高等数学里的线积分，格林公式、路径无关这些工具因此都能借过来用。不过大多数时候不必绕这一圈，直接用参数化更快。</p>
    <p>两条基本性质随手可用：线性性 <Katex tex="\int_C(af+bg)\,dz=a\int_Cf\,dz+b\int_Cg\,dz" />；方向性 <Katex tex="\int_{-C}f\,dz=-\int_Cf\,dz" />。还有一条积分模估计 <Katex tex="\left|\int_Cf\,dz\right|\le ML" />，其中 <Katex tex="M" /> 是 <Katex tex="|f|" /> 在 <Katex tex="C" /> 上的最大值、<Katex tex="L" /> 是曲线长度，证不等式时常用。</p>

    <h3 class="sec" id="a3-calc">参数化计算</h3>
    <p>曲线写成 <Katex tex="z(t)=x(t)+iy(t)" />（<Katex tex="\alpha\le t\le\beta" />），则 <Katex tex="dz=z'(t)\,dt" />，积分变成一元定积分：</p>
    <p style="text-align:center"><Katex display tex="\int_Cf(z)\,dz=\int_\alpha^\beta f(z(t))\,z'(t)\,dt." /></p>
    <p>圆 <Katex tex="|z|=R" /> 逆时针走一圈，参数式取 <Katex tex="z=Re^{i\theta}" />、<Katex tex="\theta" /> 从 <Katex tex="0" /> 到 <Katex tex="2\pi" />，<Katex tex="dz=iRe^{i\theta}d\theta" />。用它算 <Katex tex="f=z^2" />：</p>
    <p style="text-align:center"><Katex display tex="\int_{|z|=R}z^2\,dz=\int_0^{2\pi}R^2e^{2i\theta}\,iRe^{i\theta}d\theta=iR^3\int_0^{2\pi}e^{3i\theta}d\theta=0," /></p>
    <p>因为 <Katex tex="e^{3i\theta}" /> 在一整圈上的平均为零。同一个参数式算 <Katex tex="f=\bar z" />：</p>
    <p style="text-align:center"><Katex display tex="\int_{|z|=R}\bar z\,dz=\int_0^{2\pi}Re^{-i\theta}\,iRe^{i\theta}d\theta=iR^2\int_0^{2\pi}d\theta=2\pi iR^2." /></p>
    <p>两相对照就能看出：结果为零不是因为「绕了一圈」，而是因为函数解析。<Katex tex="\bar z" /> 同样绕了一圈，积分不为零，还随半径增长。</p>

    <h3 class="sec" id="a3-cauchy">柯西定理</h3>
    <p>若 <Katex tex="f" /> 在单连通区域 <Katex tex="D" /> 内解析，<Katex tex="C" /> 是 <Katex tex="D" /> 内的一条闭曲线，则</p>
    <p style="text-align:center"><Katex display tex="\oint_C f(z)\,dz=0." /></p>
    <p>「单连通」这个条件是实的：区域的内部不许有洞，曲线围住的每一块都要留在区域里。画板第二个预设 <Katex tex="f=1/z" /> 恰好在原点有一个洞，圆路把洞围在里面，积分就不是零。</p>
    <p>证明的思路是把复积分拆成两个线积分，再用格林公式。由柯西-黎曼方程，两个线积分里的偏导数组合正好相消，格林公式给出的二重积分被积函数为零，于是闭路积分是零。整条证明只用了上一章的两条等式。</p>
    <p>定理还有加强版：若 <Katex tex="C" /> 只要求逐段光滑、<Katex tex="f" /> 在 <Katex tex="C" /> 所围闭区域内解析，结论不变。推论同样有用：解析函数沿区域内任意两条起点终点相同的路径积分相等，路径可以随意变形，只要变形过程中不扫过奇点。</p>

    <h3 class="sec" id="a3-deform">变形与路径无关</h3>
    <p>用柯西定理把一条曲线连续地拉到另一条，扫过的区域里只要处处解析，两头的积分就相等。这条「变形不变」的性质让许多积分可以挪到算起来最省事的位置：算圆环上的积分时把外圈往里缩，碰到奇点就停。</p>
    <p>最标准的例子是 <Katex tex="\oint_{|z|=R}\dfrac{dz}{z}=2\pi i" />，对任何 <Katex tex="R>0" /> 都成立。参数化一算就出：<Katex tex="\displaystyle\int_0^{2\pi}\frac{iRe^{i\theta}}{Re^{i\theta}}d\theta=2\pi i" />。这个数与半径无关，正是「积分只看围住哪些奇点」的第一个证据。</p>
    <p>画板上把半径从 <Katex tex="0.4" /> 拖到 <Katex tex="1.9" />，<Katex tex="1/z" /> 的读数停在 <Katex tex="6.283i" /> 不动，<Katex tex="\bar z" /> 的读数却跟着 <Katex tex="R^2" /> 涨。两条曲线的终点拉开了距离，这就是「解析」二字在积分上的分量。</p>
    <p>反过来，若闭路积分不为零，路上围住的区域里必有奇点。这条反用法在下一章会变成留数定理：积分值恰好等于 <Katex tex="2\pi i" /> 乘以围住的奇点各自的贡献之和。</p>

    <h3 class="sec" id="a3-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：曲线有方向，反向变号。</strong>圆路默认逆时针为正，写 <Katex tex="\oint_{|z|=1}" /> 时要把方向说清楚，否则结果差一个负号。</li>
        <li><strong>提示二：柯西定理要求区域单连通、函数处处解析。</strong><Katex tex="1/z" /> 在去掉原点的平面上解析，可这个区域不是单连通的；绕原点的闭路积分不为零，定理并不矛盾。</li>
        <li><strong>提示三：参数化时别漏掉 <Katex tex="z'(t)" />。</strong>把 <Katex tex="dz" /> 直接写成 <Katex tex="d\theta" /> 是最常见的错误。圆路上它等于 <Katex tex="iRe^{i\theta}d\theta" />，那个 <Katex tex="i" /> 常常是答案里唯一保住结果的因子。</li>
        <li><strong>提示四：积分为零不等于被积函数恒为零。</strong><Katex tex="z^2" /> 在圆路上积分是零，可它在路上处处不为零。零的是「正负方向的贡献相消之后的和」。</li>
      </ul>
    </div>
    <p>回收与预告：柯西定理说解析函数的闭路积分为零，那么被积函数里带一个 <Katex tex="\dfrac1{z-z_0}" /> 时会怎样？奇点把零撬开一个口子，口子里剩下的数恰好是 <Katex tex="f(z_0)" /> 乘以 <Katex tex="2\pi i" /> ——下一章的柯西积分公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createIntPath } from '../../../boards/complexvar/analytic/intpath.js';
import { CW_CHAPTERS } from './cwnav.js';
</script>
