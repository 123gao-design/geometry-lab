<template>
  <div>
    <div class="chapter-head">
      <h1>分形几何</h1>
      <p class="sub">有些集合放大后与原来相似，维数不再是整数。康托集、科赫曲线与谢尔宾斯基三角各有生成规则，相似维数与盒维数量出它们占空间的多少；迭代函数系统与 L 系统把生成规则写成压缩映射与字符串替换，最后回到自然界，用一把会变的尺子去量海岸线。</p>
      <div class="readall">已上线 {{ built }} / {{ total }} 章：自相似与维数 4/4，典型分形 4/4，生成与应用 3/3</div>
    </div>

    <h3 class="sec">子专题一 · 自相似与维数<span class="prog">已读 {{ cnt(dim) }}/{{ dim.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in dim" :key="i" class="topic-card" :to="c.to">
        <span class="tag">维{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 典型分形<span class="prog">已读 {{ cnt(shape) }}/{{ shape.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in shape" :key="i" class="topic-card" :to="c.to">
        <span class="tag">形{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 生成与应用<span class="prog">已读 {{ cnt(gen) }}/{{ gen.length }} · 3 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in gen" :key="i" class="topic-card" :to="c.to">
        <span class="tag">生{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">十一块画板各管一件事。维数四台：自相似机逐层替换线段与正方形，颜色按顶层副本分配；相似维数机拖动 <Katex tex="N" /> 与 <Katex tex="m" /> 实时算出 <Katex tex="\ln N/\ln m" />，校验徽章恒等于 1；盒维数机让方格网逐层变细，康托、科赫、谢尔宾斯基的相交格数分别按 2、4、3 倍增长；豪斯多夫机把康托集逐层塔与 <Katex tex="F_k(s)=\sum\delta^{s}" /> 的对数直线并排，拖指数越过 <Katex tex="\log2/\log3" /> 看测度由无穷翻成零。典型分形四台：逐层挖空机把康托集的每一层平铺成行，红色虚线标出新挖掉的中段；科赫折线机拖动层数看折角细化，切到雪花看闭合版本；谢尔宾斯基挖空机在三角与地毯之间切换；复迭代机拖动参数 <Katex tex="c" />，朱利亚图与曼德博图互为切片。生成三台：混沌游戏用固定种子随机落点，三种吸引子与手画的一致；L 系统龟行机把字符串读成枝条；海岸线量尺机用不同尺长去量同一条科赫海岸，双对数图拟合出维数。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';
import Katex from '../../components/Katex.vue';

const dim = [
  { to: '/fractal/d1', t: '自相似集', d: '整体由若干缩小的自身拼成，比例与份数决定结构。' },
  { to: '/fractal/d2', t: '相似维数', d: '由 $N r^D=1$ 解出 $D$，康托集得 0.631，科赫曲线得 1.262。' },
  { to: '/fractal/d3', t: '盒维数', d: '用边长 $\\varepsilon$ 的方格网去盖，数相交格数，再取对数之比的极限。' },
  { to: '/fractal/d4', t: '豪斯多夫维数', d: '覆盖可以大小混搭，看直径的 $s$ 次方之和在哪一点从无穷掉到零。' },
];
const shape = [
  { to: '/fractal/s1', t: '康托集', d: '逐层挖去中间三分之一，长度为零，点却与整个区间一样多。' },
  { to: '/fractal/s2', t: '科赫曲线', d: '每段折成四段，周长发散，围出的面积却收敛到有限值。' },
  { to: '/fractal/s3', t: '谢尔宾斯基三角形与地毯', d: '挖掉中心，留下自相似的骨架，维数 1.585 与 1.893。' },
  { to: '/fractal/s4', t: '朱利亚集与曼德博集', d: '复迭代 $z\\mapsto z^2+c$ 的逃逸边界，参数决定连通还是破碎。' },
];
const gen = [
  { to: '/fractal/g1', t: '迭代函数系统', d: '一组压缩映射有唯一吸引子，混沌游戏的随机落点也能画出来。' },
  { to: '/fractal/g2', t: 'L 系统与分枝', d: '字符串并行重写，龟行解释把规则长成植物。' },
  { to: '/fractal/g3', t: '分形与自然', d: '海岸线长度随尺子变短而增长，幂律指数里读出维数。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const higher = higherOf('fractal');
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const built = dim.length + shape.length + gen.length;
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
