<template>
  <div>
    <div class="chapter-head">
      <h1>函数与微积分初步</h1>
      <p class="sub">从输入与输出的关系出发，用交互图象研究函数的性质、零点和变换，再学习导数与定积分。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 35 章</div>
    </div>

    <h3 class="sec">子专题一 · 从映射到函数<span class="prog">已读 {{ cnt(cs, '/functions/c') }}/{{ cs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cs" :key="i" class="topic-card" :to="'/functions/c' + (i + 1)">
        <span class="tag">C{{ i + 1 }}</span><span v-if="isRead('/functions/c' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 函数的基本性质<span class="prog">已读 {{ cnt(ss, '/functions/s') }}/{{ ss.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ss" :key="i" class="topic-card" :to="'/functions/s' + (i + 1)">
        <span class="tag">S{{ i + 1 }}</span><span v-if="isRead('/functions/s' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 零点与存在性定理<span class="prog">已读 {{ cnt(rs, '/functions/r') }}/{{ rs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in rs" :key="i" class="topic-card" :to="'/functions/r' + (i + 1)">
        <span class="tag">R{{ i + 1 }}</span><span v-if="isRead('/functions/r' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 基本初等函数<span class="prog">已读 {{ cnt(es, '/functions/e') }}/{{ es.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in es" :key="i" class="topic-card" :to="'/functions/e' + (i + 1)">
        <span class="tag">E{{ i + 1 }}</span><span v-if="isRead('/functions/e' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 图象变换<span class="prog">已读 {{ cnt(gs, '/functions/g') }}/{{ gs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in gs" :key="i" class="topic-card" :to="'/functions/g' + (i + 1)">
        <span class="tag">G{{ i + 1 }}</span><span v-if="isRead('/functions/g' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 变化率与导数<span class="prog">已读 {{ cnt(vs, '/functions/v') }}/{{ vs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in vs" :key="i" class="topic-card" :to="'/functions/v' + (i + 1)">
        <span class="tag">V{{ i + 1 }}</span><span v-if="isRead('/functions/v' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">继续学习可进入<router-link to="/sequences">数列</router-link>、<router-link to="/inequalities">不等式</router-link>或<router-link to="/calc1">一元函数微积分</router-link>。<router-link to="/cheatsheet">定理速查</router-link>收录各章的核心结论。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js'; // 卡片标题/简介支持 '$…$' 公式段
const cs = [
  { t: '映射与函数', d: '从 A 到 B 的映射给 A 中每个元素指定唯一的像。' },
  { t: '三要素与同一函数', d: '比较两个函数时，先核对定义域，再比较定义域内每一点的函数值。' },
  { t: '定义域与值域', d: '定义域是允许的输入集合，值域是函数实际能取到的全部输出。' },
  { t: '分段函数与表示法', d: '分段函数在不同区间使用不同表达式，分界点的归属由区间开闭决定。' },
  { t: '机器观与位移', d: '在函数值上加 h 改变纵坐标，在自变量上加 h 改变对应点的横坐标。' },
];
// 阅读进度角标（响应式：标记后自动刷新）
const ss = [
  { t: '单调性：增减的规则', d: '严格单调性比较的是同一区间内任意两个有序输入的函数值。' },
  { t: '单调性与导数', d: '导数的符号给出函数的增减方向，临界点用于划分待检查的区间。' },
  { t: '奇偶性：镜像折叠', d: '偶函数关于 y 轴对称，奇函数关于原点对称，两种判定都要求定义域关于原点对称。' },
  { t: '有界性与最值', d: '上界和下界约束函数值。取到上确界或下确界时，才有相应的最大值或最小值。' },
  { t: '对称性专题：抽象式与翻译', d: '对称点的函数值相等时，图象关于竖直轴对称。对应值互为相反数时，对称中心在横轴上。' },
  { t: '周期性专题：平移重合', d: '周期让定义域和函数值一同复现。对称变换的复合可以产生平移。' },
  { t: '性质综合阅读', d: '在同一张图上核对单调区间、奇偶性、周期和取值范围。' },
];
const rs = [
  { t: '零点：三种说法，一个数', d: '函数零点 c、方程的根和图象横轴交点的横坐标都由 f(c)=0 确定。' },
  { t: '存在性定理：端点异号', d: '连续函数在区间两端异号时，开区间内至少有一个零点。' },
  { t: '二分法：对半缩区间', d: '二分法逐次用中点把异号区间缩短一半，直到达到给定精度。' },
  { t: '牛顿法与弦截：切线一步到位', d: '牛顿法用切线求下一个近似。弦截法用两个近似点之间的割线代替切线。' },
];
const es = [
  { t: '一次函数：斜率与截距', d: '斜率 k 决定直线的倾斜方向和变化率，截距 b 决定纵轴交点。' },
  { t: '二次函数：区间最值与根的分布', d: '闭区间内的二次函数最值取决于顶点和端点。判断根的位置还需检查判别式。' },
  { t: '幂函数：α 曲线族', d: '幂指数决定曲线的形状，也影响负底数能否取幂。' },
  { t: '指数函数：增速由底数定', d: '指数函数的相对变化率是 ln a。底数大于 1 时递增，介于 0 与 1 之间时递减。' },
  { t: '对数函数：增速递减', d: 'a＞1 时，对数函数递增且增速减小。0＜a＜1 时，函数递减并逐渐变平。' },
  { t: '指与对：互为反演', d: '同一底数下，指数函数与对数函数互为反函数，输入与输出对调。' },
  { t: '对勾函数：一形两证', d: '在正半轴上，导数判据与均值不等式给出相同的最小值。' },
  { t: '绝对值嵌套：三种折叠', d: '外层绝对值改变负的函数值，内层绝对值把右半支复制到左侧。' },
];
const gs = [
  { t: '平移：左加右减的代数原理', d: '在 y=f(x−h)+k 中，图象上的每个点横坐标增加 h，纵坐标增加 k。' },
  { t: '伸缩与翻折：横除纵乘', d: '在 y=b f(ax) 中，横坐标除以非零的 a，纵坐标乘以 b。负号对应轴反射。' },
  { t: '变换顺序与由图反演', d: '把 ax−h 写成 a(x−h/a)，即可读出横向伸缩比例与位移。' },
];
const vs = [
  { t: '割线与切线：导数的诞生', d: '两点趋向同一点且割线斜率有极限时，这个极限就是导数。' },
  { t: '运算法则：增量的记录', d: '两个因子的乘积增量由两块一次增量和一块交叉增量组成。' },
  { t: '极值与最值：导数的判定', d: '驻点是极值的候选点。求闭区间上的最值还要检查两端及区间内的不可导点。' },
  { t: '凹凸性与切线放缩', d: '凸性确定切线不等式的适用区间。二阶导数可以用来判断凸性。' },
  { t: '参数综合：大题工作流', d: '参数越过临界值时，驻点数目和零点数目可能改变。' },
  { t: '泰勒展开：从拟合到 e', d: '麦克劳林多项式在 0 处逐阶匹配函数及其导数。级数的收敛范围需单独判断。' },
  { t: '从求和到积分：n² 到 x²', d: '把平方和除以 n³，得到 [0,1] 上 x² 的右端点黎曼和。' },
  { t: '积分初步：黎曼与基本定理', d: '黎曼和的极限定义定积分，微积分基本定理把累积面积的变化率与被积函数联系起来。' },
];
// 阅读进度角标（响应式：标记后自动刷新）
const cnt = (arr, pfx) => arr.filter((_, i) => READ.set.has(pfx + (i + 1))).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/functions/')).length;
</script>
