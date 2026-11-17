<template>
  <div>
    <div class="chapter-head">
      <h1>组合学与二项式定理</h1>
      <p class="sub">数一件事情的几种做法，先分清是选一类还是走一步：分类用加法、分步用乘法。两条原理反复套用，就有了排列与组合；把「取或不取」写成多项式，又得到二项式定理。系数排成三角形可见对称与增减，赋值法把整行系数收成一个数，帕斯卡恒等式与网格路径把计数和图形连在一起。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 9 章</div>
    </div>

    <h3 class="sec">子专题一 · 计数原理<span class="prog">已读 {{ cnt(cs) }}/{{ cs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">计{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 排列与组合<span class="prog">已读 {{ cnt(ps) }}/{{ ps.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ps" :key="i" class="topic-card" :to="c.to">
        <span class="tag">排{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 二项式定理<span class="prog">已读 {{ cnt(bs) }}/{{ bs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in bs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">项{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 组合恒等式与应用<span class="prog">已读 {{ cnt(is) }}/{{ is.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in is" :key="i" class="topic-card" :to="c.to">
        <span class="tag">恒{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 容斥原理把「至少一个」化成若干交集的和，<Katex tex="|A\cup B|=|A|+|B|-|A\cap B|" /> 是它的两项形式；② 递推与生成函数把计数题变成幂级数的系数，卡特兰数 <Katex tex="\frac{1}{n+1}\binom{2n}{n}" /> 因此有了封闭解；③ 鸽巢原理与极端原理用于只问存在性的题；④ 伯恩赛德引理与波利亚计数处理「旋转后相同算一种」的情形；⑤ 卢卡斯定理用二项式系数的模 <Katex tex="p" /> 值处理同余问题。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';

const cs = [
  { to: '/combinatorics/c1', t: '分类加法与分步乘法', d: '两类办法互不重叠、任选一种即可，用加法；几步依次进行、缺一步就完不成，用乘法。' },
  { to: '/combinatorics/c2', t: '排列数与排列', d: '取出 $m$ 个按顺序排成一列，逐位可选数从 $n$ 减到 $n-m+1$，连乘得 $\\mathrm{A}_n^m$；取满时是全排列 $n!$。' },
];
const ps = [
  { to: '/combinatorics/p1', t: '组合数与组合数公式', d: '不计先后取 $m$ 个，每种取法内部有 $m!$ 种排法，故 $\\mathrm{C}_n^m=\\mathrm{A}_n^m/m!$，并且 $\\mathrm{C}_n^m=\\mathrm{C}_n^{\\,n-m}$。' },
  { to: '/combinatorics/p2', t: '捆绑、插空与分组模型', d: '必须相邻就捆成一块再乘块内顺序；不能相邻就插进空档；平均分组的组序要除掉。' },
];
const bs = [
  { to: '/combinatorics/b1', t: '二项式定理与通项', d: '$n$ 个括号各取一个字母，取到 $k$ 个 $b$ 的方式有 $\\mathrm{C}_n^k$ 种；通项 $T_{k+1}=\\mathrm{C}_n^ka^{n-k}b^k$ 用来找指定项。' },
  { to: '/combinatorics/b2', t: '杨辉三角与系数性质', d: '两端为 1，肩上两数相加得下一行；同行对称，中间一项（或两项）最大，整行之和是 $2^n$。' },
  { to: '/combinatorics/b3', t: '赋值法与系数和', d: '令 $x=1$ 得全部系数和 $2^n$，令 $x=-1$ 得交错和 0，两式合并分出偶次项与奇次项各 $2^{n-1}$。' },
];
const is = [
  { to: '/combinatorics/i1', t: '帕斯卡恒等式与网格路径', d: '只能向右向上走到 $(m,n)$，路径数是 $\\mathrm{C}_{m+n}^{\\,m}$；每个格点等于左边加下边，正是帕斯卡恒等式。' },
  { to: '/combinatorics/i2', t: '近似计算与整除性', d: '前两项之外的项全含 $a^2$：$a$ 小就舍去得近似值，$a$ 是整数则舍去部分是 $a^2$ 的倍数。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/combinatorics/')).length;
</script>
