<template>
  <div>
    <div class="chapter-head">
      <h1>数列</h1>
      <p class="sub">数列是把正整数集映到实数的一个函数：通项给出第 n 项，递推给出相邻项的关系，前 n 项和给出累加。等差与等比是两种能完整解出的数列，求和各有两种证明，因此各挂两块画板；求和的方法、递推与构造、数学归纳法、建模应用依次展开。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 20 章</div>
    </div>

    <h3 class="sec">子专题一 · 数列的概念与表示<span class="prog">已读 {{ cnt(ss) }}/{{ ss.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ss" :key="i" class="topic-card" :to="c.to">
        <span class="tag">数{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 等差数列<span class="prog">已读 {{ cnt(ds) }}/{{ ds.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ds" :key="i" class="topic-card" :to="c.to">
        <span class="tag">等{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 等比数列<span class="prog">已读 {{ cnt(gs) }}/{{ gs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in gs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">比{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 数列求和的方法<span class="prog">已读 {{ cnt(hs) }}/{{ hs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in hs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">和{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 递推与构造<span class="prog">已读 {{ cnt(rs) }}/{{ rs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in rs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">递{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 数学归纳法<span class="prog">已读 {{ cnt(is) }}/{{ is.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in is" :key="i" class="topic-card" :to="c.to">
        <span class="tag">归{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题七 · 数列的应用<span class="prog">已读 {{ cnt(us) }}/{{ us.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in us" :key="i" class="topic-card" :to="c.to">
        <span class="tag">用{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 生成函数把数列写成幂级数的系数，线性递推的通项可由它一次解出，<Katex tex="\sum a_nx^n" /> 的加法与移位对应数列的相加与错位；② 差分算子把「逐项相减」本身当作运算，高阶等差数列的通项必是 <Katex tex="n" /> 的多项式，求和是它的逆运算；③ 连分数给出实数的有理逼近，佩尔方程 <Katex tex="x^2-Dy^2=1" /> 的解恰是它的渐近分数；④ 递推的极限与不动点相关，蛛网图上的收敛与发散由此判断；⑤ 算法分析里的主定理 <Katex tex="T(n)=aT(n/b)+f(n)" /> 与数列递推是同一套记号。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import Katex from '../../components/Katex.vue';

const ss = [
  { to: '/sequences/s1', t: '数列：定义在正整数集上的函数', d: '有序排列的一列数；序号到项是一个函数 $n\\mapsto a_n$，图象是坐标平面上一串孤立的点。' },
  { to: '/sequences/s2', t: '递推公式：由上一步走到下一步', d: '初始项加上相邻项的关系唯一确定整列数；一阶与二阶、递推与通项的对照。' },
  { to: '/sequences/s3', t: '前 n 项和与通项：Sₙ 与 aₙ 的换算', d: '作差还原通项：$a_1=S_1$，$n\\ge2$ 时 $a_n=S_n-S_{n-1}$；两段是否合并要与 $a_1$ 核对。' },
];
const ds = [
  { to: '/sequences/d1', t: '等差数列：定义、通项与等差中项', d: '定义 $a_{n+1}-a_n=d$；通项 $a_n=a_1+(n-1)d$ 沿序号线性增长，项落在斜率 $d$ 的直线上；中项 $2A=a+b$。' },
  { to: '/sequences/d2', t: '等差数列的性质与判定', d: '下标和相等则项和相等，项关于中心项对称；判定回到定义作差、中项式，或看通项是否为一次式。' },
  { to: '/sequences/d3', t: '前 n 项和：倒序相加与台阶削平（两块画板）', d: '首末配对得 $S_n=\\dfrac{n(a_1+a_n)}{2}$；同一公式再以等高条与矩形面积给出几何解释，$S_n$ 是缺常数项的二次式。' },
];
const gs = [
  { to: '/sequences/g1', t: '等比数列：定义、通项与等比中项', d: '定义 $a_{n+1}/a_n=q$；通项 $a_n=a_1q^{\\,n-1}$ 是指数式，图象落在指数曲线上；中项 $G^2=ab$ 有两个候选。' },
  { to: '/sequences/g2', t: '等比数列的性质与判定', d: '下标和相等则对应项之积相等，$a_{n-k}a_{n+k}=a_n^2$；判定看比值、中项式或通项是否为指数式。' },
  { to: '/sequences/g3', t: '前 n 项和：错位相减与线段填充（两块画板）', d: '$q\\ne1$ 时 $S_n=\\dfrac{a_1(1-q^n)}{1-q}$；错位相减逐列消项，线段填充把各项画成缩短的段，余下空档是 $Lq^n$。' },
];
const hs = [
  { to: '/sequences/h1', t: '分组求和与裂项相消（两块画板）', d: '通项可拆成几列熟知的数列时分别求和；分式通项拆成相邻两项之差，累加时中间项成对抵消。' },
  { to: '/sequences/h2', t: '错位相减：等差乘等比', d: '等差乘等比的通项乘公比后错位相减，每列剩下一段等比项，末项另计，解出 $S_n$。' },
  { to: '/sequences/h3', t: '倒序相加、并项与奇偶分论', d: '首末对称的项成对相加；正负交替的通项按相邻两项并成一组，项数的奇偶分两类收尾。' },
];
const rs = [
  { to: '/sequences/r1', t: '累加法与累乘法', d: '$a_{n+1}-a_n=f(n)$ 逐式相加，$a_{n+1}/a_n=g(n)$ 逐式相乘，中间项抵消后得到通项。' },
  { to: '/sequences/r2', t: '构造法：aₙ₊₁ = paₙ + q', d: '整体平移不动点 $x=\\dfrac{q}{1-p}$，得 $b_{n+1}=pb_n$；平移前后两栏点形状相同，收敛由 $|p|$ 决定。' },
  { to: '/sequences/r3', t: '分式递推与不动点（蛛网图）', d: '把递推看成映射 $a_{n+1}=f(a_n)$；竖到曲线、横到 $y=x$ 的折线收敛于曲线与直线的交点。' },
  { to: '/sequences/r4', t: '特征根法与二阶线性递推', d: '设 $a_n=r^n$ 得特征方程 $r^2-pr-q=0$；两个等比分量叠加，常数由首两项定出，斐波那契的比内公式即由此而来。' },
];
const is = [
  { to: '/sequences/i1', t: '数学归纳法的原理与书写', d: '第一步验证起始项，第二步由 $n=k$ 推出 $n=k+1$；两步齐备，命题对一切正整数成立。' },
  { to: '/sequences/i2', t: '归纳证明与归纳—猜想', d: '由前几项算出结果、猜出通项，再用归纳法证明；归纳步骤把假设代入递推式，化简到目标式。' },
];
const us = [
  { to: '/sequences/u1', t: '增长、折损与分期付款', d: '复利、单利、折损分别是等比、等差与等比；等额分期化为 $B_k=B_{k-1}(1+r)-x$，用构造法解出每期还款额。' },
  { to: '/sequences/u2', t: '数列与函数、不等式的综合', d: '把 $a_n$ 看成定义在正整数集上的函数，作差或作比判单调，比值的穿越处给最大项，$S_n$ 的最值看各项的符号。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/sequences/')).length;
</script>
