<template>
  <ChPage :cur="4" no="递4" base="/sequences/r" :chapters="RQ_CHAPTERS"
    title="特征根法与二阶线性递推"
    sub="斐波那契数列由前两项逐项相加得到，通项却含 √5 与无理数的 n 次幂。特征根法把「猜一个等比解」变成「解一个一元二次方程」，再从两个等比成分拼出整列数。"
    :toc="[{ id: 'r4-guess', t: '为什么猜 aₙ = rⁿ' }, { id: 'r4-eq', t: '特征方程与两个根' }, { id: 'r4-sum', t: '叠加：两个解拼出全部解' }, { id: 'r4-cases', t: '重根与共轭复根' }, { id: 'r4-fib', t: '斐波那契与比内公式' }, { id: 'r4-pit', t: '适用范围与系数' }]">
    <div class="note good">二阶线性递推 <Katex tex="a_{n+2}=pa_{n+1}+qa_n" />（<Katex tex="p,q" /> 为常数）对应<strong>特征方程</strong> <Katex tex="r^2-pr-q=0" />。设它的两根为 <Katex tex="r_1,r_2" />。<Katex tex="r_1\ne r_2" /> 时通项为 <Katex tex="a_n=C_1r_1^n+C_2r_2^n" />；<Katex tex="r_1=r_2=r" /> 时为 <Katex tex="a_n=(C_1+C_2n)r^n" />。常数 <Katex tex="C_1,C_2" /> 由 <Katex tex="a_1,a_2" /> 确定。这一方法叫<strong>特征根法</strong>。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCharRoot" />
      <div class="cap">图 递4 · <b>特征根法机</b>：蓝点是由递推式逐项算出的 <Katex tex="a_n" />，绿点是第一分量 <Katex tex="C_1r_1^n" />，紫点是第二分量 <Katex tex="C_2r_2^n" />，紫虚线把绿点接到蓝点（长度就是紫点的值）。右侧从「设 <Katex tex="a_n=r^n" />」一路推到两个系数。预设 ① 是斐波那契，② 是两个不等的根，③ 是重根；把 p、q 调到 <Katex tex="p=0,q=-1" /> 还能看到共轭复根，此时紫圈是包络线，蓝点在两条包络之间来回摆动。</div>
    </div>

    <h3 class="sec" id="r4-guess">为什么猜 <Katex tex="a_n=r^n" /></h3>
    <p>递推式对每一项都施加同一个动作：把前两项分别乘 <Katex tex="p" />、<Katex tex="q" /> 再相加。能满足「乘一个固定的倍数后形状不变」的数列，只有等比数列：若 <Katex tex="a_n=r^n" />，三项依次是 <Katex tex="r^n,r^{n+1},r^{n+2}" />，每后一项都是前一项的 <Katex tex="r" /> 倍。</p>
    <p>把它代入递推式：<Katex tex="r^{n+2}=pr^{n+1}+qr^n" />。只要 <Katex tex="r\ne0" />，两边同时约去 <Katex tex="r^n" />，得到</p>
    <p style="text-align:center"><Katex tex="r^2=pr+q" display /></p>
    <p>这个式子不含 <Katex tex="n" />：原本要求「对一切 <Katex tex="n" /> 都成立的递推关系」，被压缩成一个只关于 <Katex tex="r" /> 的方程。于是「找一个满足递推的等比数列」等价于「解一个一元二次方程」。这一步的意图很具体：<strong>把逐项递推的困难换成解方程的困难</strong>。若 <Katex tex="r" /> 是该方程的根，<Katex tex="r^n" /> 就是递推式的一个解，代回任一项都能验证。</p>
    <p>等比数列不是唯一能约掉 <Katex tex="n" /> 的形式吗？在「常系数、线性、齐次」这三条限制下，<Katex tex="r^n" /> 是唯一可行的基本形状：系数的常数性保证了每一项的倍数相同，齐次性保证右边的项能不用加常数，线性保证没有 <Katex tex="n" /> 的幂次出现。斐波那契这样的递推恰好满足这三条。</p>

    <h3 class="sec" id="r4-eq">特征方程与两个根</h3>
    <p>把方程写成标准形式 <Katex tex="r^2-pr-q=0" />，由求根公式</p>
    <p style="text-align:center"><Katex tex="r_{1,2}=\dfrac{p\pm\sqrt{p^2+4q}}{2}" display /></p>
    <p>判别式 <Katex tex="\Delta=p^2+4q" /> 决定两根的类型：<Katex tex="\Delta>0" /> 得两个不相等的实根，<Katex tex="\Delta=0" /> 得重根，<Katex tex="\Delta<0" /> 得一对共轭复根。三种情形在图 递4 的预设与滑块中都能调到。</p>
    <p>以斐波那契为例，<Katex tex="p=1,q=1" />，特征方程是 <Katex tex="r^2-r-1=0" />，两根 <Katex tex="\varphi=\dfrac{1+\sqrt5}{2}\approx1.618" />、<Katex tex="\psi=\dfrac{1-\sqrt5}{2}\approx-0.618" />。代回验算：<Katex tex="\varphi^2=\varphi+1" />，<Katex tex="\psi^2=\psi+1" />，两边乘 <Katex tex="\varphi^n" /> 即得 <Katex tex="\varphi^{n+2}=\varphi^{n+1}+\varphi^n" />。这说明 <Katex tex="\varphi^n" /> 与 <Katex tex="\psi^n" /> 各自满足斐波那契的递推式——但它们都不是斐波那契数列：<Katex tex="\varphi^1\ne1" />，首项就对不上。</p>
    <p>这正是要引入两个常数 <Katex tex="C_1,C_2" /> 的原因：单个等比解只管往后的递推关系，管不了最初的 <Katex tex="a_1,a_2" />。两个根给出两个等比解，把它们按不同比例混合，才能让首两项也对上。</p>

    <h3 class="sec" id="r4-sum">叠加：两个解拼出全部解</h3>
    <p>设 <Katex tex="\{x_n\}" />、<Katex tex="\{y_n\}" /> 都满足 <Katex tex="a_{n+2}=pa_{n+1}+qa_n" />。任取常数 <Katex tex="C_1,C_2" />，考察 <Katex tex="z_n=C_1x_n+C_2y_n" />，代入递推式：</p>
    <p style="text-align:center"><Katex tex="C_1(x_{n+2}-px_{n+1}-qx_n)+C_2(y_{n+2}-py_{n+1}-qy_n)=0+0=0" display /></p>
    <p>所以线性组合仍是解。<Katex tex="r_1^n" /> 与 <Katex tex="r_2^n" /> 是两个解，任意叠加 <Katex tex="C_1r_1^n+C_2r_2^n" /> 也是解。剩下的问题是：这样得到的解是否<strong>已经包含全部</strong>？</p>
    <p>回答要从解的个数说起。递推式由 <Katex tex="a_1,a_2" /> 两项决定：给定首两项，往后每一项都被唯一算出。所以「所有数列」与「所有可能的首两项对」一一对应，解的集合是二维的——每个解恰好由两个独立的数确定。而 <Katex tex="C_1r_1^n+C_2r_2^n" /> 也由两个独立的数 <Katex tex="C_1,C_2" /> 确定，只要 <Katex tex="r_1\ne r_2" />，不同的 <Katex tex="(C_1,C_2)" /> 给出不同的 <Katex tex="(a_1,a_2)" />，这一族就占满整个二维空间。于是它就是全部解。</p>
    <p>求系数只须把 <Katex tex="n=1,2" /> 代入，解二元一次方程组：</p>
    <p style="text-align:center"><Katex tex="C_1r_1+C_2r_2=a_1,\qquad C_1r_1^2+C_2r_2^2=a_2" display /></p>
    <p>图 递4 的右侧栏把这条推导链连同系数 <Katex tex="C_1,C_2" /> 的数值一起列出；左图的绿点、紫点分别是两个分量，它们相加正好落在蓝点上，紫虚线就是相加的差量。</p>

    <h3 class="sec" id="r4-cases">重根与共轭复根</h3>
    <p><strong>重根。</strong><Katex tex="\Delta=0" /> 时 <Katex tex="r_1=r_2=r=\dfrac{p}{2}" />，叠加式退化成 <Katex tex="(C_1+C_2)r^n" />，两个常数合成一个，只剩一维，凑不出全部解。第二个解要换成 <Katex tex="nr^n" />。直接验算：令 <Katex tex="a_n=nr^n" />，则</p>
    <p style="text-align:center"><Katex tex="a_{n+2}-pa_{n+1}-qa_n=r^n\big[n(r^2-pr-q)+r(2r-p)\big]" display /></p>
    <p>重根满足 <Katex tex="r^2-pr-q=0" /> 与 <Katex tex="2r=p" />，括号内两项都是零，验算通过。于是 <Katex tex="a_n=(C_1+C_2n)r^n" />。图 递4 的预设 ③ 取 <Katex tex="p=4,q=-4" />，<Katex tex="r=2" />，首两项为 1 与 4 时通项恰是 <Katex tex="a_n=n\cdot2^{n-1}" />，紫色分量与蓝点重合，绿点全落在 0 上。</p>
    <p><strong>共轭复根。</strong><Katex tex="\Delta<0" /> 时 <Katex tex="r=\dfrac{p}{2}\pm\dfrac{\sqrt{-\Delta}}{2}i" />，写成三角形式 <Katex tex="r=\rho(\cos\theta\pm i\sin\theta)" />，其中 <Katex tex="\rho=\sqrt{-q}" />（由 <Katex tex="r_1r_2=-q" />），<Katex tex="\theta" /> 由 <Katex tex="\cos\theta=\dfrac{p}{2\rho}" /> 定出。由棣莫弗公式 <Katex tex="r^n=\rho^n(\cos n\theta\pm i\sin n\theta)" />，取实部与虚部的实线性组合，得到实数解</p>
    <p style="text-align:center"><Katex tex="a_n=\rho^n(A\cos n\theta+B\sin n\theta)" display /></p>
    <p>括号里的<b>三角式会变号</b>，所以项的正负来回翻转，图 递4 里蓝点在两条对称的紫圈（包络线 <Katex tex="\pm\rho^n\sqrt{A^2+B^2}" />）之间摆动。幅度随 <Katex tex="\rho" /> 的大小伸缩：<Katex tex="\rho>1" /> 越摆越大，<Katex tex="\rho<1" /> 越摆越小。这一情形已超出高中要求，作为方法的完整性列出。</p>

    <h3 class="sec" id="r4-fib">斐波那契与比内公式</h3>
    <p>斐波那契数列 <Katex tex="1,1,2,3,5,8,\dots" /> 满足 <Katex tex="a_{n+2}=a_{n+1}+a_n" />（<Katex tex="p=q=1" />）。特征方程 <Katex tex="r^2-r-1=0" /> 的两根是 <Katex tex="\varphi,\psi" />，由前两项定系数：</p>
    <p style="text-align:center"><Katex tex="C_1\varphi+C_2\psi=1,\qquad C_1\varphi^2+C_2\psi^2=1" display /></p>
    <p>利用 <Katex tex="\varphi^2=\varphi+1" />、<Katex tex="\psi^2=\psi+1" /> 与 <Katex tex="\varphi+\psi=1" />、<Katex tex="\varphi\psi=-1" />，解得 <Katex tex="C_1=\dfrac{1}{\sqrt5}" />，<Katex tex="C_2=-\dfrac{1}{\sqrt5}" />。于是</p>
    <p style="text-align:center"><Katex tex="a_n=\dfrac{1}{\sqrt5}\left[\left(\dfrac{1+\sqrt5}{2}\right)^n-\left(\dfrac{1-\sqrt5}{2}\right)^n\right]" display /></p>
    <p>这就是<strong>比内公式</strong>。回代检验前两项：<Katex tex="n=1" /> 时分子是 <Katex tex="\varphi-\psi=\sqrt5" />，值为 1；<Katex tex="n=2" /> 时分子是 <Katex tex="\varphi^2-\psi^2=(\varphi-\psi)(\varphi+\psi)=\sqrt5" />，值也是 1。第三项 <Katex tex="n=3" /> 得 <Katex tex="\dfrac{\varphi^3-\psi^3}{\sqrt5}=\dfrac{2\sqrt5}{\sqrt5}=2" />，与递推一致。</p>
    <p>公式里满是 <Katex tex="\sqrt5" /> 与无理数的幂，结果却始终是整数。原因在 <Katex tex="\varphi" /> 与 <Katex tex="\psi" /> 的共轭关系：两者相加得 1、相乘得 <Katex tex="-1" />，它们的幂之差总能凑成 <Katex tex="\sqrt5" /> 的整数倍。验算时若出现确定的小数，应回头检查系数是否算对。</p>
    <p>比内公式还给出连续两项之比：因为 <Katex tex="\left|\dfrac{\psi}{\varphi}\right|<1" />，<Katex tex="\left(\dfrac{\psi}{\varphi}\right)^n\to0" />，所以 <Katex tex="\dfrac{a_{n+1}}{a_n}\to\varphi" />。第 10 项与第 11 项之比已是 <Katex tex="\dfrac{89}{55}\approx1.618" />。这正是 递3 中连分数收敛到的同一个数，两个来源在 <Katex tex="\varphi" /> 处会合。</p>

    <h3 class="sec" id="r4-pit">适用范围与系数</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只适用于常系数线性齐次递推。</strong>递推式必须是 <Katex tex="a_{n+2}=pa_{n+1}+qa_n" /> 的形式：系数 <Katex tex="p,q" /> 是常数，右边没有常数项，也没有 <Katex tex="n" /> 的函数。若出现 <Katex tex="a_{n+2}=a_{n+1}+a_n+1" />（非齐次）或 <Katex tex="a_{n+2}=na_{n+1}+a_n" />（变系数），须先化形或改用其他方法，特征方程不能直接套。</li>
        <li><strong>提示二：重根时第二解是 <Katex tex="nr^n" />。</strong><Katex tex="\Delta=0" /> 时把通项写成 <Katex tex="C_1r^n+C_2r^n" /> 等于只用一个常数，解不完整；正确的形式是 <Katex tex="(C_1+C_2n)r^n" />，漏掉的 <Katex tex="n" /> 不能省。</li>
        <li><strong>提示三：两个常数由首两项定，不能由其他项随意指定。</strong>通项确定后 <Katex tex="a_1,a_2" /> 的值固定；若题目另给 <Katex tex="a_1,a_3" />，也要先由递推式算出 <Katex tex="a_2" />（需要时），或者直接用两组初始条件解方程，不能混用不同下标。</li>
        <li><strong>提示四：不要把两个根的幂直接当成通项。</strong><Katex tex="\varphi^n" /> 与 <Katex tex="\psi^n" /> 都满足递推式，但只有它们的特定线性组合才是所给的数列。做题时先写 <Katex tex="C_1r_1^n+C_2r_2^n" />，再代入初值，不要拿单个根去凑。</li>
        <li><strong>提示五：<Katex tex="r=0" /> 是退化情形。</strong>若特征方程有零根（<Katex tex="q=0" />），约去 <Katex tex="r^n" /> 那一步对 <Katex tex="r=0" /> 不成立，通项退化为 <Katex tex="a_n=pa_{n-1}" /> 一类的等比，须单独讨论（图 递4 把这一情形直接标出）。</li>
      </ul>
    </div>
    <p>回收与预告：特征根法把 递2 的「平移成等比」推广到二阶——那里找一个等比成分（不动点），这里找两个（两个特征根）；递3 的不动点是曲线与直线的交点，这里的特征根是方程的两个根，三者都是「把递推关系换成解方程」。数列模块接下来讲求和的方法（和1..和3），再讲数学归纳法与应用。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCharRoot } from '../../../boards/sequences/recur/charroot.js';
import { RQ_CHAPTERS } from './rnav.js';
</script>
