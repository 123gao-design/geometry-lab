<template>
  <div>
    <div class="chapter-head">
      <h1>初等数论</h1>
      <p class="sub">整数是最熟悉的数，问题却常最不好答。带余除法把整除写成算式，同余把「差为 n 的倍数」归成一类；欧拉定理与中国剩余定理把模运算的周期性用足，二次剩余与不定方程则处理「哪些数能写成平方」这类判定。最后一章把这些工具接成一件事：公钥密码。</p>
      <div class="readall">已上线 {{ built }} / {{ total }} 章：整除与同余 4/4，数论定理 5/5，二次剩余与应用 4/4</div>
    </div>

    <h3 class="sec">子专题一 · 整除与同余<span class="prog">已读 {{ cnt(bas) }}/{{ bas.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in bas" :key="i" class="topic-card" :to="c.to">
        <span class="tag">整{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 数论定理<span class="prog">已读 {{ cnt(thm) }}/{{ thm.length }} · 5 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in thm" :key="i" class="topic-card" :to="c.to">
        <span class="tag">定{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 二次剩余与应用<span class="prog">已读 {{ cnt(res) }}/{{ res.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in res" :key="i" class="topic-card" :to="c.to">
        <span class="tag">剩{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">十三块画板各管一件事。整除与同余四台：带余除法机把 <Katex tex="a=qm+r" /> 画成数轴上的分块，商与余数随手读；欧几里得算法机用正方形铺满矩形，最后一块的边长就是 <Katex tex="\gcd" />，右栏同时倒推出裴蜀等式；同余机把模 m 的余数摆成表盘，两个数落在同一格即同余，差值随指针读出；一次同余方程机在同一张表盘上把解集染金，<Katex tex="d=\gcd(a,m)" /> 与 <Katex tex="d\mid b" /> 的判读决定解有几个。数论定理五台：素数机用筛法给格阵染色，右栏拆出 n 的质因数连乘；欧拉函数机让互素的格子变绿，与 <Katex tex="n\prod(1-1/p)" /> 的算式逐项对照；费马与欧拉定理机从 1 出发反复乘 a，轨道回到 1 的步数就是阶；中国剩余定理机把两个模的余数排成行，交错表格里每一格写着对应的唯一 x；莫比乌斯机在除数双曲线上按 <Katex tex="\mu(d)" /> 上色，右图的柱与部分和把「除数和恒为零」摆出来。二次剩余四台：剩余机列出 1 到 p−1 的平方根，有根的金、无根的灰，欧拉判别式同屏给出；原根机看青线能否一次走遍表盘，指数表随底数改写；不定方程机让格点落在直线上，通解的步长直接读自两点之差；RSA 机把报文送进加密框再送回来，两段模幂与公私钥的绑定关系一目了然。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';
import Katex from '../../components/Katex.vue';

const bas = [
  { to: '/numtheory/z1', t: '整除与带余除法', d: '商与余数唯一：$a=qm+r$，$0\\le r<m$，余数把整数分成有限的类。' },
  { to: '/numtheory/z2', t: '最大公约数与欧几里得算法', d: '辗转相除每步换掉一对数，最后一个非零余数就是 $\\gcd$，倒推得裴蜀等式。' },
  { to: '/numtheory/z3', t: '同余', d: '同余是差为模的倍数，加法乘法与取模可以交换次序，模 $m$ 的剩余类只有 $m$ 个。' },
  { to: '/numtheory/z4', t: '一次同余方程', d: '$ax\\equiv b\\pmod m$ 有解当且仅当 $\\gcd(a,m)\\mid b$，有解时恰有 $d$ 个类。' },
];
const thm = [
  { to: '/numtheory/d1', t: '素数与算术基本定理', d: '每个大于 1 的整数唯一分解成素数连乘，约数个数与约数和由指数读出。' },
  { to: '/numtheory/d2', t: '欧拉函数', d: '$\\varphi(n)$ 数出与 $n$ 互素的个数，按素因子逐个打折：$n\\prod(1-1/p)$。' },
  { to: '/numtheory/d3', t: '费马小定理与欧拉定理', d: '互素时 $a^{\\varphi(m)}\\equiv1$，阶整除 $\\varphi(m)$，大指数可以降幂。' },
  { to: '/numtheory/d4', t: '中国剩余定理', d: '模两两互素时同余组在模乘积内唯一有解，各局部解可以拼装出来。' },
  { to: '/numtheory/d5', t: '数论函数与莫比乌斯反演', d: '除数函数与莫比乌斯函数，和式与单个函数值之间可以来回反演。' },
];
const res = [
  { to: '/numtheory/s1', t: '二次剩余与欧拉判别式', d: '$a^{(p-1)/2}$ 取 1 就有平方根、取 $-1$ 就没有，勒让德符号与互反律接上。' },
  { to: '/numtheory/s2', t: '原根与指数', d: '原根生成全部非零余数，指数把乘法变成加法，反求指数则是离散对数。' },
  { to: '/numtheory/s3', t: '不定方程', d: '$ax+by=c$ 有整数解当且仅当 $\\gcd(a,b)\\mid c$，解沿直线等距排开。' },
  { to: '/numtheory/s4', t: '模运算与密码', d: 'RSA 用两次模幂完成往返，公私钥由 $ed\\equiv1\\pmod{\\varphi(n)}$ 绑定。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const higher = higherOf('numtheory');
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const built = bas.length + thm.length + res.length;
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
