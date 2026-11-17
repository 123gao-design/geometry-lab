<template>
  <div>
    <div class="chapter-head">
      <h1>数值计算</h1>
      <p class="sub">真值算不出时才谈误差：先量出「写错多少、能不能信」，再让误差顺着函数的斜率走到下一步。求根是这套想法最直白的练习——二分法只扔一半区间，牛顿法拿切线去猜，不动点迭代把方程改成递推。数据拟合与函数逼近把它用在另一头：前者从散点里找一条最省事的曲线，后者用多项式与分段面积去替代算不动的函数。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 10 章</div>
    </div>

    <h3 class="sec">子专题一 · 误差<span class="prog">已读 {{ cnt(es) }}/{{ es.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in es" :key="i" class="topic-card" :to="c.to">
        <span class="tag">误{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 方程求根<span class="prog">已读 {{ cnt(ins) }}/{{ ins.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ins" :key="i" class="topic-card" :to="c.to">
        <span class="tag">迭{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 数据拟合<span class="prog">已读 {{ cnt(fits) }}/{{ fits.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in fits" :key="i" class="topic-card" :to="c.to">
        <span class="tag">拟{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 函数逼近<span class="prog">已读 {{ cnt(apx) }}/{{ apx.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in apx" :key="i" class="topic-card" :to="c.to">
        <span class="tag">逼{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 拉格朗日插值与牛顿插值把「过 n 个点的多项式」写成显式，龙格现象说明节点越多未必越准，切比雪夫节点是补救办法；② 数值积分（梯形、辛普森）的误差阶由求积公式的代数精度决定，龙贝格积分在其上做加速；③ 二分法必收敛但慢，牛顿法二阶收敛却依赖初值，收敛阶可用于比较；④ 病态问题与条件数衡量输入的小扰动被放大多少，是判断结果能不能用的依据；⑤ 最小二乘的正规方程 <Katex tex="A^{T}Ax=A^{T}b" /> 把拟合写成线性方程组，与线性代数模块相接。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';

const es = [
  { to: '/numeric/e1', t: '误差与有效数字', d: '绝对误差 $|x-x^*|$ 带量纲，相对误差是比值；误差不超过半个末位单位时，写出的每一位都算有效数字，截断则不一定。' },
  { to: '/numeric/e2', t: '误差的传播与条件数', d: '$|\\Delta y|\\approx|f\'(x_0)|\\Delta x$：斜率放大误差。加减看绝对误差相加，乘除看相对误差相加，条件数 $|xf\'/f|$ 衡量问题好不好算。' },
];
const ins = [
  { to: '/numeric/i1', t: '二分法', d: '两端异号、函数连续就必有根。折 $n$ 次后误差不超过 $(b-a)/2^{n+1}$，与函数形状无关，最稳但也最慢。' },
  { to: '/numeric/i2', t: '牛顿迭代与弦截法', d: '$x_{n+1}=x_n-f(x_n)/f\'(x_n)$ 用切线代替曲线，根附近误差平方下降；弦截法用割线斜率代替导数。' },
  { to: '/numeric/i3', t: '不动点迭代与压缩映射', d: '把方程写成 $x=\\varphi(x)$ 再迭代。$|\\varphi\'|<1$ 时收敛到唯一的根，蛛网图朝不动点收拢，误差按 $L^n$ 缩小。' },
];
const fits = [
  { to: '/numeric/f1', t: '最小二乘与线性拟合', d: '$\\hat a=\\sum(x_i-\\bar x)(y_i-\\bar y)/\\sum(x_i-\\bar x)^2$，直线过样本中心，残差之和为零，$R^2=1-S/S_0$ 衡量解释力。' },
  { to: '/numeric/f2', t: '非线性拟合与线性化', d: '指数型纵轴取对数、幂函数型双对数，都变成直线。斜率给 $b$，截距取指数还原 $A$。' },
];
const apx = [
  { to: '/numeric/a1', t: '泰勒多项式与余项界', d: '逐阶对齐导数的多项式，误差由拉格朗日余项给出：$|R_n|\\le M|x-x_0|^{n+1}/(n+1)!$。' },
  { to: '/numeric/a2', t: '插值多项式与龙格现象', d: '穿过所有节点的唯一多项式；等距节点加密时两端振荡发散，切比雪夫节点（端点密）能压住。' },
  { to: '/numeric/a3', t: '数值积分：梯形与辛普森', d: '梯形误差 $\\sim h^2$、辛普森 $\\sim h^4$；段数翻倍，误差分别降到 1/4 与 1/16。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/numeric/')).length;
</script>

<style scoped>
.note.good { margin-top: 26px; }
</style>
