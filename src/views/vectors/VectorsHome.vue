<template>
  <div>
    <div class="chapter-head">
      <h1>向量与复数</h1>
      <p class="sub">向量是既有大小又有方向的量，用有向线段表示，加法沿用三角形与平行四边形两种画法；数乘把方向与长度分开处理。平面向量基本定理与坐标运算把几何合成代数，数量积再补上长度与夹角这两度量，向量积给出面积与法向量。子专题四把这三套工具用到几何证明与物理情境里。复数接着向量的代数形式往下走，三角形式与欧拉公式把乘法读成旋转与伸缩。全模块六个子专题 17 章现已全部上线。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 17 章（全模块已上线）</div>
    </div>

    <h3 class="sec">子专题一 · 平面向量的概念与线性运算<span class="prog">已读 {{ cnt(xs) }}/{{ xs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in xs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">向{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 平面向量基本定理与坐标运算<span class="prog">已读 {{ cnt(bs) }}/{{ bs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in bs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">基{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 数量积与度量<span class="prog">已读 {{ cnt(isv) }}/{{ isv.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in isv" :key="i" class="topic-card" :to="c.to">
        <span class="tag">积{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 向量的应用<span class="prog">已读 {{ cnt(ys) }}/{{ ys.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ys" :key="i" class="topic-card" :to="c.to">
        <span class="tag">应{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 复数<span class="prog">已读 {{ cnt(cs) }}/{{ cs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">复{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 三角形式与欧拉公式<span class="prog">已读 {{ cnt(es) }}/{{ es.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in es" :key="i" class="topic-card" :to="c.to">
        <span class="tag">欧{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">六个子专题 17 章已全部上线，共 18 块画板：向量表示机（拖动终点读坐标与模，绿色一支是平移后的相等向量）、加法法则机（三角形、平行四边形、差向量三档同看一条结果）、数乘与共线机（滑块调 λ 看伸缩与反向，横排判定读共线）、基本定理机（拖动两支基向量，金色折线沿基底走到目标向量的终点，系数随之改变）、向量坐标机（拖动两端点读终点减起点的坐标与模，橙色一支是平移到原点的相等向量）、定比分点机（滑块调 λ，金色分点从内分移到中点、再移到延长线，λ=−1 时不存在）、数量积与投影机（金色线段是 b 在 a 上的投影，长度带符号）、坐标数量积机（逐分量相乘再相加，点积为零补出直角标记）、极化恒等式机（两条对角线分别是和向量与差向量）、向量积机（平面内的有向面积按转向换色，三维里 a×b 垂直于两支向量、模即平行四边形面积）、三角形中线与重心机（三条中线交于一点，红色重心把每条中线按 2:1 分开）、力的正交分解机（合力围成矩形，两个分力随角度一涨一落）、复平面与共轭机（金色点与紫色共轭点关于实轴对称，模是到原点的距离）、复数的运算机（加法看平行四边形对角线，乘法看旋转与伸缩，除法反过来）、模与共轭的性质机（金色积向量、紫色共轭、绿色圆环三点对照，共轭保持乘法）、三角形式与辐角机（虚线圆是模，橙色弧是辐角，横纵虚线拆出余弦与正弦）、欧拉公式与单位根机（单位圆上拖 P 读 e^{iθ}，n 个根均匀连成正 n 边形）。前九章在同一张坐标平面上完成，几何画法、坐标读法与度量运算逐步接上；积4 另开一块三维画板看向量积的方向，随后两章交给几何证明与物理情境，最后五章进入复平面与单位圆。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';

const xs = [
  { to: '/vectors/x1', t: '向量的概念与表示', d: '既有大小又有方向的量；用有向线段画出，模是长度，零向量与单位向量是两个特殊角色。' },
  { to: '/vectors/x2', t: '向量的加法与减法', d: '三角形法则首尾相接，平行四边形法则同起点；$\\vec a-\\vec b$ 由 $\\vec b$ 的终点指向 $\\vec a$ 的终点。' },
  { to: '/vectors/x3', t: '数乘与共线向量', d: '$\\lambda\\vec a$ 的模是 $|\\lambda||\\vec a|$，正负定方向；$\\vec b=\\lambda\\vec a$ 是共线的充要条件。' },
];
const bs = [
  { to: '/vectors/b1', t: '平面向量基本定理', d: '两个不共线的向量撑起整个平面；任一向量写成它们的倍数之和，且系数唯一。坐标之所以成立，全在这条定理。' },
  { to: '/vectors/b2', t: '向量的坐标表示与线性运算', d: '$\\overrightarrow{AB}=(x_2-x_1,\\ y_2-y_1)$；加减与数乘逐分量进行，模由分量平方和开方得到。' },
  { to: '/vectors/b3', t: '共线与定比分点的坐标判定', d: '$x_1y_2-x_2y_1=0$ 即共线；分点由 $\\overrightarrow{AP}=\\lambda\\overrightarrow{PB}$ 解出，中点与内外分都是 λ 的特值。' },
];
const isv = [
  { to: '/vectors/i1', t: '数量积的定义与投影', d: '$\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta$；一个向量的长乘以另一个在它方向上的投影，夹角决定正负。' },
  { to: '/vectors/i2', t: '坐标运算与夹角、垂直', d: '$\\vec a\\cdot\\vec b=x_1x_2+y_1y_2$；余弦由点积与两模之比读出，点积为零即垂直。' },
  { to: '/vectors/i3', t: '极化恒等式与模的运算', d: '$4\\vec a\\cdot\\vec b=|\\vec a+\\vec b|^2-|\\vec a-\\vec b|^2$；两条对角线把点积与长度互换，中线与矩形判据由此打通。' },
  { to: '/vectors/i4', t: '向量积与它的几何意义', d: '$|\\vec a\\times\\vec b|=|\\vec a||\\vec b|\\sin\\theta$；模即平行四边形的面积，方向垂直于两支向量；平面内只剩带符号的 $x_1y_2-x_2y_1$。' },
];
const ys = [
  { to: '/vectors/y1', t: '平面几何中的向量方法', d: '取两个不共线的向量作基底，把图上每条线段写成倍数之和；平行、垂直与长度分别落成数乘、点积为零与平方等式。' },
  { to: '/vectors/y2', t: '向量在物理中的应用', d: '力的合成走平行四边形，正交分解逐方向列式；速度与位移按向量相加，功由数量积算出。' },
];
const cs = [
  { to: '/vectors/c1', t: '复数的概念与几何意义', d: '虚数单位 $\\mathrm{i}^2=-1$；$z=a+b\\mathrm{i}$ 对应复平面上的点，共轭关于实轴镜像，模是到原点的距离。' },
  { to: '/vectors/c2', t: '复数的四则运算', d: '加减逐分量，乘法按分配律并换掉 $\\mathrm{i}^2$，除法乘分母的共轭；乘法在图上就是旋转与伸缩。' },
  { to: '/vectors/c3', t: '复数的模与共轭', d: '$|z_1z_2|=|z_1||z_2|$，$z\\bar z=|z|^2$；共轭与加减乘除都可交换顺序，模的式子常直接翻成距离。' },
];
const es = [
  { to: '/vectors/e1', t: '三角形式与乘除的几何意义', d: '$z=r(\\cos\\theta+\\mathrm{i}\\sin\\theta)$；乘法模相乘、辐角相加，除法反过来，图上就是先伸缩再旋转。' },
  { to: '/vectors/e2', t: '欧拉公式与单位根', d: '$\\mathrm{e}^{\\mathrm{i}\\theta}=\\cos\\theta+\\mathrm{i}\\sin\\theta$；$z^n=1$ 的 $n$ 个根均匀排在单位圆上，连起来是正 $n$ 边形。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/vectors/')).length;
</script>
