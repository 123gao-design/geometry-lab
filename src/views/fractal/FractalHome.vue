<template>
  <div>
    <div class="chapter-head">
      <h1>分形几何</h1>
      <p class="sub">有些集合放大后与原来相似，维数不再是整数。康托集、科赫曲线与谢尔宾斯基三角各有生成规则，相似维数与盒维数量出它们占空间的多少；迭代函数系统与 L 系统把生成规则写成压缩映射与字符串替换，最后回到自然界，用一把会变的尺子去量海岸线。</p>
      <div class="readall">学习进度：已读 {{ readAll }} / {{ total }} 章</div>
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

    <div class="note good">拓展阅读：① 自相似维数由生成规则直接读出（<Katex tex="\ln N/\ln s" />），盒维数对一般集合适用，严格自相似时两者相等；② 迭代函数系与拼贴定理给出「用压缩映射生成图形」的一般办法；③ 曼德博集与朱利亚集把参数平面画出来，边界附近的周期点与连通性相关；④ L 系统以字符串替换描述植物分枝，分形压缩与地形生成是它在工程上的用法；⑤ 多重分形把维数从一个数推广为一串指数，用来描述疏密不均的测度。全站定理总表见顶栏<strong>速查</strong>。</div>
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
const readAll = cnt(dim) + cnt(shape) + cnt(gen);
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
