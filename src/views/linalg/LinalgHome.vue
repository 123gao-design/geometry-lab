<template>
  <div>
    <div class="chapter-head">
      <h1>线性代数初步</h1>
      <p class="sub">从行列式量面积起步，把矩阵看成一张数的表，再把它看成平面与空间上的变换：矩阵的列就是基向量的落点，行列式是面积（体积）倍数，秩是有效约束的条数。特征方向是变换下只伸缩不转向的方向，把它们拼成矩阵就得到对角形，反复作用后的长期行为由主特征值决定。最后一节把二次型接到圆锥曲线上——椭圆的两条轴，就是二次型矩阵的特征方向。全模块五个子专题 14 章，现已全部上线。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 14 章</div>
    </div>

    <h3 class="sec">子专题一 · 行列式<span class="prog">已读 {{ cnt(det) }}/{{ det.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in det" :key="i" class="topic-card" :to="c.to">
        <span class="tag">行{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 矩阵<span class="prog">已读 {{ cnt(mx) }}/{{ mx.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in mx" :key="i" class="topic-card" :to="c.to">
        <span class="tag">矩{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 矩阵与空间<span class="prog">已读 {{ cnt(sp) }}/{{ sp.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in sp" :key="i" class="topic-card" :to="c.to">
        <span class="tag">空{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 特征值<span class="prog">已读 {{ cnt(eg) }}/{{ eg.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in eg" :key="i" class="topic-card" :to="c.to">
        <span class="tag">特{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 二次型<span class="prog">已读 {{ cnt(qd) }}/{{ qd.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in qd" :key="i" class="topic-card" :to="c.to">
        <span class="tag">型{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">五个子专题共十四块画板：二阶行列式机（两列张成的平行四边形，面积带符号，退化成共线时归零）、三阶行列式机（单位立方体映成平行六面体，体积按底面积乘高读，也可拖视角转着看）、矩阵线性运算机（同型方阵对应元素相加、数乘与转置三档同台）、矩阵乘法机（左矩阵一行乘右矩阵一列，<span v-html="texMix('$AB$')"></span> 与 <span v-html="texMix('$BA$')"></span> 并排对照）、初等变换机（按「下一步」把增广矩阵化成阶梯形，主元个数即秩）、二维变换机（整张格网被拉成平行四边形格网）、三维变换机（立方体映成平行六面体）、三平面机（三块平面的公共部分在点、直线、空之间切换）、特征方向机（单位圆映成椭圆，两条轴压在特征方向上）、对角化机（把点沿两条特征方向分解再各自乘 λ）、迭代方向机（归一后的点一步步滑向主方向）、二次型曲线机（交叉项一半进矩阵，形状由特征值符号定）、转轴机（转过 θ 消掉交叉项，新轴就是特征方向）、分类图机（<span v-html="texMix('$(\\lambda_1,\\lambda_2)$')"></span> 平面四块各对应一种曲线）。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';

const det = [
  { to: '/linalg/d1', t: '二阶行列式与面积', d: '$D=ad-bc$ 是两列张成的平行四边形的有向面积；$D=0$ 时两列共线，图形压成一条线段。' },
  { to: '/linalg/d2', t: '三阶行列式、体积与性质', d: '三阶行列式等于三列张成的平行六面体体积，按底面积乘高算；转置、换行变号、拆和三条性质各有几何解释。' },
];
const mx = [
  { to: '/linalg/m1', t: '矩阵的概念与线性运算', d: '同型矩阵对应元素相加，数乘是每个元素乘同一个数；转置把行写成列，$(A^T)^T=A$。' },
  { to: '/linalg/m2', t: '矩阵乘法与转置', d: '左矩阵一行乘右矩阵一列再求和；结合律成立，交换律、消去律、无零因子三条都不成立，$(AB)^T=B^TA^T$。' },
  { to: '/linalg/m3', t: '逆矩阵、初等变换与秩', d: '$|A|\\ne0$ 时可逆；初等行变换把增广矩阵化成阶梯形，主元个数即秩，两个秩决定方程组解的结构。' },
];
const sp = [
  { to: '/linalg/s1', t: '矩阵与二维线性变换', d: '两列就是 $e_1,e_2$ 的像，整张格网被拉成平行四边形格网，面积乘 $|\\det A|$。' },
  { to: '/linalg/s2', t: '矩阵与三维线性变换', d: '单位立方体映成以三列为棱的平行六面体，体积倍数 $|\\det A|$，符号记录定向是否翻转。' },
  { to: '/linalg/s3', t: '秩、平面与方程组', d: '三元一次方程是一块平面，三块平面的公共部分只有点、直线、空三种；$r(A)$ 与 $r(A|b)$ 一比即知。' },
];
const eg = [
  { to: '/linalg/e1', t: '特征值与特征向量', d: '$A\\vec v=\\lambda\\vec v$ 表示方向不变、长度乘 $\\lambda$；特征方程 $\\lambda^2-\\mathrm{tr}A\\cdot\\lambda+\\det A=0$，两根之和为迹、之积为行列式。' },
  { to: '/linalg/e2', t: '对角化与矩阵的幂', d: '把特征向量按列拼成 $P$，则 $A=PDP^{-1}$，于是 $A^n=PD^nP^{-1}$，高次幂化成两个数的幂。' },
  { to: '/linalg/e3', t: '反复作用与主特征方向', d: '$\\vec x_k=A^k\\vec x_0$ 的方向趋于主特征方向，长度比值趋于 $|\\lambda_1|$；$|\\lambda_2/\\lambda_1|$ 越小靠拢越快。' },
];
const qd = [
  { to: '/linalg/q1', t: '二次型与它的曲线', d: '$ax^2+bxy+cy^2=\\vec x^TA\\vec x$，交叉项一半进矩阵；等值线是圆锥曲线，形状由两个特征值的符号定。' },
  { to: '/linalg/q2', t: '转轴化标准形', d: '$\\tan2\\theta=b/(a-c)$ 消掉交叉项，标准形 $\\lambda_1x\'^2+\\lambda_2y\'^2=1$，半轴 $1/\\sqrt{\\lambda}$。' },
  { to: '/linalg/q3', t: '用特征值给曲线分类', d: '先看 $\\lambda_1\\lambda_2$：为负是双曲线，为零是退化；再看 $\\lambda_1+\\lambda_2$：为正椭圆，为负空集。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/linalg/')).length;
</script>

<style scoped>
.note.good { margin-top: 26px; }
</style>
