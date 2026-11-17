<template>
  <div>
    <div class="chapter-head">
      <h1>概率与统计</h1>
      <p class="sub">概率从样本空间讲起：事件取交、并、对立，概率随运算拆开；条件概率把样本空间缩到已知事件之内，乘出全概率，再倒推出后验。独立性把乘法化简为直接相乘，重复试验给出二项分布。后半程把结果映射成随机变量，写分布列、算期望与方差，再看抽样、回归与检验。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 18 章</div>
    </div>

    <h3 class="sec">子专题一 · 随机事件与概率<span class="prog">已读 {{ cnt(gs) }}/{{ gs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in gs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">概{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 条件概率与独立性<span class="prog">已读 {{ cnt(cs) }}/{{ cs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">独{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 随机变量与分布<span class="prog">已读 {{ cnt(rs) }}/{{ rs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in rs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">分{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 数字特征<span class="prog">已读 {{ cnt(ns) }}/{{ ns.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ns" :key="i" class="topic-card" :to="c.to">
        <span class="tag">数{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 统计<span class="prog">已读 {{ cnt(ts) }}/{{ ts.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ts" :key="i" class="topic-card" :to="c.to">
        <span class="tag">统{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 统计推断与检验<span class="prog">已读 {{ cnt(js) }}/{{ js.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in js" :key="i" class="topic-card" :to="c.to">
        <span class="tag">检{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 大数定律说明频率趋于概率，中心极限定理说明大量独立小扰动之和近似正态，样本量足够时二项分布可直接查正态表；② 泊松分布是二项分布在 <Katex tex="n" /> 大、<Katex tex="p" /> 小时的极限，单位时间内的到达次数常用它建模；③ 条件期望与全期望公式按变量逐层加权，把全概率的想法搬到期望上，递归计算由此成立；④ 马尔可夫链用转移矩阵描述「只与上一步有关」的过程，长期份额趋于稳态分布；⑤ 蒙特卡洛方法用随机抽样估计积分与期望，是概率与数值计算的接口。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import Katex from '../../components/Katex.vue';

const gs = [
  { to: '/probability/g1', t: '随机事件的关系与运算', d: '事件就是样本点的集合：并、交、对立与互斥各对应一种运算，概率按 $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$ 拆开。' },
  { to: '/probability/g2', t: '频率与几何概型', d: '频率随试验次数稳定到概率；古典概型数样本点，几何概型用长度或面积之比算概率。' },
];
const cs = [
  { to: '/probability/c1', t: '条件概率与乘法公式', d: '已知 $A$ 发生后样本空间缩到 $A$ 内，$P(B\\mid A)=\\frac{P(AB)}{P(A)}$；反过来把同时发生拆成两步相乘。' },
  { to: '/probability/c2', t: '全概率公式与贝叶斯公式', d: '按完备事件组分类、各自乘以条件概率再相加得 $P(B)$；用它作分母就把先验改写成后验。' },
  { to: '/probability/c3', t: '相互独立与独立重复试验', d: '$P(AB)=P(A)P(B)$ 时两事件独立；重复 $n$ 次时至少一次为 $1-(1-p)^n$。' },
];
const rs = [
  { to: '/probability/r1', t: '随机变量与分布列', d: '把试验结果映射成数；分布列两条性质：每个概率非负、全部加起来为 $1$。' },
  { to: '/probability/r2', t: '二项分布与超几何分布', d: '独立重复试验的成功次数服从 $B(n,p)$；不放回抽取服从超几何分布，分界在放回与否。' },
  { to: '/probability/r3', t: '连续型随机变量与正态分布', d: '密度曲线下的面积就是概率；正态分布由 $\\mu$ 与 $\\sigma$ 决定，$\\mu\\pm\\sigma$ 三档给出 68.27%、95.45%、99.73%。' },
  { to: '/probability/r4', t: '卡方分布与其他分布', d: '标准正态的平方和服从 $\\chi^2(k)$，右偏且均值等于自由度；上侧面积就是检验中的 $p$ 值。' },
];
const ns = [
  { to: '/probability/n1', t: '数学期望', d: '以概率为权重的平均，是分布的重心；$E(aX+b)=aE(X)+b$，二项分布 $E(X)=np$。' },
  { to: '/probability/n2', t: '方差与标准差', d: '偏离期望的平方按概率平均，$D(X)=E(X^2)-E(X)^2$，$D(aX+b)=a^2D(X)$。' },
  { to: '/probability/n3', t: '协方差与相关系数', d: '两个变量同向或反向变化的程度，$\\rho\\in[-1,1]$，只度量线性关系。' },
];
const ts = [
  { to: '/probability/t1', t: '抽样方法与频率分布直方图', d: '简单随机、分层与系统抽样；直方图的纵轴是频率除以组距，面积之和恒为 $1$。' },
  { to: '/probability/t2', t: '样本的数字特征', d: '平均数用上每一个数，中位数只看位置；$s^2=\\frac{1}{n}\\sum(x_i-\\bar x)^2$。' },
  { to: '/probability/t3', t: '一元线性回归', d: '最小二乘取残差平方和最小的直线，过样本中心点，$\\hat b=\\frac{\\sum(x_i-\\bar x)(y_i-\\bar y)}{\\sum(x_i-\\bar x)^2}$。' },
];
const js = [
  { to: '/probability/j1', t: '假设检验的基本思想与两类错误', d: '小概率原理反着用；$\\alpha$ 是弃真、$\\beta$ 是取伪，样本量固定时此消彼长。' },
  { to: '/probability/j2', t: '独立性检验', d: '列联表算 $\\chi^2=\\frac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}$，与 3.841、6.635 比较。' },
  { to: '/probability/j3', t: '正态分布下的均值检验', d: '$\\bar X\\sim N(\\mu,\\sigma^2/n)$，标准化后与 $\\pm1.96$ 比较，p 值越小越不像来自 $H_0$。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;const totalRead = () => [...READ.set].filter(p => p.startsWith('/probability/')).length;
</script>
