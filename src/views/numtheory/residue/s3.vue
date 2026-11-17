<template>
  <ChPage :cur="3" no="剩3" base="/numtheory/s" :chapters="S_CHAPTERS"
    title="不定方程"
    sub="未知数多于方程个数时，解通常有无穷多；但限制在整数范围里，问题就变得有结构：有解时解排成等差的一列，无解时可以一句话说清原因。二元一次的情形完全由最大公约数决定。"
    :toc="[{ id: 's3-linear', t: '二元一次不定方程' }, { id: 's3-solve', t: '通解与它的结构' }, { id: 's3-pyth', t: '勾股数组' }, { id: 's3-method', t: '无限下降与无解判据' }, { id: 's3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="a,b" /> 不全为零，<Katex tex="d=\gcd(a,b)" />。方程
      <p style="text-align:center;margin:8px 0 0"><Katex display tex="ax+by=c" /></p>
      有整数解当且仅当 <Katex tex="d\mid c" />。有解时，若 <Katex tex="(x_0,y_0)" /> 是一组解，则全部整数解为
      <p style="text-align:center;margin:6px 0 0"><Katex display tex="x=x_0+\frac{b}{d}t,\qquad y=y_0-\frac{a}{d}t\qquad(t\in\mathbb{Z})." /></p></div>

    <div class="board-wrap">
      <BoardMount :factory="createDiophant" />
      <div class="cap">图 剩3 · <b>二元一次不定方程</b>：蓝线是方程的实直线，金点是它的整数解。看点：① 解存在时，金点沿直线等距排开，相邻两点横坐标之差正是 b/d、纵坐标之差是 −a/d；② 把 a、b 改成有公因子的组合，直线照旧，格点却只落在 c 也含这个因子的场合；③ 右栏给出特解与通解的两个分量，取任意整数 t 都能落回某个金点。</div>
    </div>

    <h3 class="sec" id="s3-linear">二元一次不定方程</h3>
    <p>先看一个整数事实：对任何整数 <Katex tex="x,y" />，<Katex tex="ax+by" /> 一定是 <Katex tex="d" /> 的倍数。所以 <Katex tex="d\nmid c" /> 时方程必然无解，这一半是显然的。</p>
    <p>反过来要难一些：若 <Katex tex="d\mid c" />，是否一定有解？把 <Katex tex="c" /> 写成 <Katex tex="c=d\cdot c'" />。由裴蜀等式，存在整数 <Katex tex="u,v" /> 使 <Katex tex="au+bv=d" />；两边乘 <Katex tex="c'" /> 得 <Katex tex="a(uc')+b(vc')=c" />，于是 <Katex tex="(uc',vc')" /> 就是一组解。存在性得证，而且这组解可以直接由辗转相除的倒推过程算出。</p>
    <p>所以判据只有一条：<Katex tex="\gcd(a,b)\mid c" />。注意它是充分必要条件，不需要再检查别的。这与第一章「所有整数组合 <Katex tex="ax+by" /> 的集合恰是 <Katex tex="d" /> 的倍数集合」是同一句话的两种说法。</p>
    <p>画板上把 a、b 拖到 4 与 6 时 <Katex tex="d=2" />，c 为偶数就有金点、为奇数就一个也没有。直线一直存在，变的只是它落在格点上的频率。</p>

    <h3 class="sec" id="s3-solve">通解与它的结构</h3>
    <p>已知一组解 <Katex tex="(x_0,y_0)" />，其余解由它平移得到。设 <Katex tex="(x_1,y_1)" /> 是另一组解，两式相减得 <Katex tex="a(x_1-x_0)+b(y_1-y_0)=0" />，于是 <Katex tex="a(x_1-x_0)=-b(y_1-y_0)" />。两边同除 <Katex tex="d" />：</p>
    <p style="text-align:center"><Katex display tex="\frac{a}{d}(x_1-x_0)=-\frac{b}{d}(y_1-y_0)." /></p>
    <p>现在 <Katex tex="a/d" /> 与 <Katex tex="b/d" /> 互素。前者整除右端，而它与后者互素，所以它整除 <Katex tex="y_1-y_0" />，即 <Katex tex="y_1-y_0=-\dfrac{a}{d}t" />；代回得 <Katex tex="x_1-x_0=\dfrac{b}{d}t" />。这正是通解公式的来历，而它也说明所有解两两相差一组固定步长的整数倍。</p>
    <p>想要最小正整数解时，把 <Katex tex="t" /> 调到使 <Katex tex="x" /> 落入 <Katex tex="[0,b/d)" /> 即可。这个区间恰好能容下 <Katex tex="d" /> 个解，所以在 <Katex tex="0\le x<b/d" /> 内解是唯一的（若解存在）。</p>
    <p>三元及以上的方程一次只能消去一个未知数，最终落到二元的情形。例如 <Katex tex="x+y+z=10" /> 与 <Katex tex="2x+3y+5z=30" /> 联立，可先解出 <Katex tex="x" /> 与 <Katex tex="y" /> 的一个二元关系，再按 z 的取值分类。步骤略长，用的仍是同一套判据。</p>

    <h3 class="sec" id="s3-pyth">勾股数组</h3>
    <p>方程 <Katex tex="x^2+y^2=z^2" /> 的正整数解称为<b>勾股数组</b>，它是二次不定方程里结构最清楚的一类。若 <Katex tex="\gcd(x,y)=1" /> 称为本原的。本原解可以完全参数化：恰好是</p>
    <p style="text-align:center"><Katex display tex="x=m^2-n^2,\qquad y=2mn,\qquad z=m^2+n^2," /></p>
    <p>其中 <Katex tex="m>n\ge1" />，<Katex tex="\gcd(m,n)=1" />，且 <Katex tex="m,n" /> 一奇一偶。取 <Katex tex="(m,n)=(2,1)" /> 得 <Katex tex="(3,4,5)" />；取 <Katex tex="(3,2)" /> 得 <Katex tex="(5,12,13)" />。</p>
    <p>能这样写，是因为把式子移项成 <Katex tex="x^2=(z-y)(z+y)" />，再用互素与奇偶性把两个因式分配出去。这条参数化在几何里对应单位圆的有理参数化：圆周上过 <Katex tex="(-1,0)" /> 的直线，斜率取有理数时另一个交点也是有理点。</p>
    <p>勾股数组的推广是费马大定理：<Katex tex="x^{n}+y^{n}=z^{n}" /> 在 <Katex tex="n\ge3" /> 时没有正整数解。这个问题从费马写下注记到怀尔斯完成证明用了三百多年，工具远远超出了初等数论的范围。它说明了不定方程的一般情形有多难：整数条件看似简单，解的结构却可能极其顽固。</p>

    <h3 class="sec" id="s3-method">无限下降与无解判据</h3>
    <p>证明一个不定方程无解，常用<b>无限下降法</b>：假设有解，从解里构造出一组更小的解，再对这组更小的解重复同样的步骤。正整数不能无限下降，于是矛盾。费马用它证明了 <Katex tex="x^4+y^4=z^2" /> 无正整数解。</p>
    <p>另一条路是模算术：取一个适当的模，证明方程在这个模下根本没有解。例如 <Katex tex="x^2+y^2=3z^2" /> 可以用模 3 排除：平方数模 3 只能是 0 或 1，两个平方数之和模 3 为 0 时，两者都必须为 0，于是 3 整除 <Katex tex="x,y" />，进而 9 整除左端，推出 3 整除 <Katex tex="z" />。两边同时可除 3，得到一个无穷下降。</p>
    <p>两条路各有适用范围。模法适合「没有解」，下降法适合证明「最小的解也不存在」。而像 <Katex tex="ax+by=c" /> 这类具体方程，判据已经完备，不必动用这两种工具。</p>

    <h3 class="sec" id="s3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：先算 <Katex tex="\gcd(a,b)" /> 再动笔。</strong>不整除右端就直接写无解，不必求特解。整除时再用裴蜀等式求一组解，顺序颠倒会白算。</li>
        <li><strong>提示二：通解的两个步长是 <Katex tex="b/d" /> 与 <Katex tex="-a/d" />，不是 b 与 −a。</strong>忘记除以 d 会让解集变大，多出不属于原方程的项。用一组具体数代回去验一次即可发现。</li>
        <li><strong>提示三：解集是一个剩余类，不是一个数。</strong>回答时带上参数 <Katex tex="t" /> 并注明 <Katex tex="t" /> 取整数，或者写出 <Katex tex="x" /> 的模类。只写一个解不算答完。</li>
        <li><strong>提示四：平方数的余数是一把好用的筛子。</strong>平方数模 4 只能是 0 或 1，模 8 只能是 0、1、4，模 3 为 0 或 1。判断无解时先取一个小模试一试，往往一步就出结果。</li>
      </ul>
    </div>
    <p>回收与预告：本章的判据都建立在裴蜀等式与素数性质上，而欧拉定理又给了另一类工具——它能把大指数压成小指数。把这两类工具合起来，就是公开密钥密码：用模幂加密，用分解出的私钥解密。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDiophant } from '../../../boards/numtheory/residue/diophant.js';
import { S_CHAPTERS } from './snav.js';
</script>
