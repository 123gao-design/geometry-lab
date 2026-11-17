<template>
  <div>
    <div class="chapter-head">
      <h1>直线与圆</h1>
      <p class="sub">解析几何的起点。直线用一次方程描述，斜率与截距各自承担方向与位置；圆用二次方程描述，圆心定位置、半径定大小。把图形关系翻译成方程关系，再借距离公式与判别式读回几何结论，是后续圆锥曲线的通用手法。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 13 章</div>
    </div>

    <h3 class="sec">子专题一 · 直线的方程<span class="prog">已读 {{ cnt(ls) }}/{{ ls.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ls" :key="i" class="topic-card" :to="c.to">
        <span class="tag">直{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 圆的方程<span class="prog">已读 {{ cnt(cs) }}/{{ cs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">圆{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 圆的性质与定理<span class="prog">已读 {{ cnt(ts) }}/{{ ts.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ts" :key="i" class="topic-card" :to="c.to">
        <span class="tag">弦{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 综合应用<span class="prog">已读 {{ cnt(as) }}/{{ as.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in as" :key="i" class="topic-card" :to="c.to">
        <span class="tag">综{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：直线与圆是解析几何的起点，往后有几条自然的路 —— ① 圆系把过两圆交点的圆写成 <Katex tex="C_1+\lambda C_2=0" />，两式相减即得根轴，三圆的根轴交于一点；② 反演变换以定点为心、定长平方为幂，把不过中心的圆仍变成圆、过中心的圆变成直线，是与圆有关问题的常用手段；③ 到定点与定直线距离之比为常数 <Katex tex="e" /> 的点集给出圆锥曲线的统一式，<Katex tex="e=1" /> 即抛物线；④ 极坐标与参数方程下的圆、直线方程更短，切线长与弦长的读法与直角坐标互为补充；⑤ 点关于直线的对称与折线最短路，可推广到两定点与一动点在圆上的一般情形。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import Katex from '../../components/Katex.vue';

const ls = [
  { to: '/linecircle/l1', t: '倾斜角与斜率', d: '倾斜角 $\\alpha\\in[0^\\circ,180^\\circ)$ 定方向，$k=\\tan\\alpha$ 把方向变成一个数；竖直直线斜率不存在。' },
  { to: '/linecircle/l2', t: '直线方程的五种形式', d: '点斜式、斜截式、两点式、截距式与一般式；竖直、水平与过原点的直线会让其中几种失效。' },
  { to: '/linecircle/l3', t: '两条直线的位置关系', d: '$k_1=k_2$ 判平行或重合，$k_1k_2=-1$ 判垂直；相交联立求交点，平行用距离公式。' },
  { to: '/linecircle/l4', t: '直线系与同解变形', d: '过定点的束、平行系与过交点的 $f_1+\\lambda f_2=0$；平方与乘除含零因式会改变解集，增根与失根要回代核验。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/linecircle/')).length;

const cs = [
  { to: '/linecircle/c1', t: '圆的标准方程与一般方程', d: '由圆心与半径写标准方程 $(x-a)^2+(y-b)^2=r^2$，展开得一般方程；配方读回圆心与半径，判别式定图形。' },
  { to: '/linecircle/c2', t: '直线与圆的位置关系', d: '比较圆心到直线的距离 $d$ 与半径 $r$ 判相交、相切、相离；相交时弦长 $2\\sqrt{r^2-d^2}$。' },
  { to: '/linecircle/c3', t: '圆与圆的位置关系', d: '用圆心距与半径和、差比较五种位置；两圆相交时公共弦所在直线由两方程相减得到。' },
];

const ts = [
  { to: '/linecircle/t1', t: '垂径定理与圆周角', d: '垂直于弦的直径平分弦与弧；同弧所对的圆周角等于圆心角的一半，直径所对的圆周角为直角。' },
  { to: '/linecircle/t2', t: '切线的判定与性质', d: '过半径外端且垂直于半径的直线是切线；弦切角等于它所夹弧对的圆周角。' },
  { to: '/linecircle/t3', t: '切线长定理与圆幂定理', d: '圆外一点的切线长相等；相交弦、切割线与割线三个乘积式统一为圆幂 $OP^2-r^2$。' },
  { to: '/linecircle/t4', t: '四点共圆与圆内接四边形', d: '圆内接四边形对角互补、外角等于内对角；反过来对角互补即四点共圆。' },
];

const as = [
  { to: '/linecircle/z1', t: '对称与最值', d: '点关于直线的对称要同时满足垂直与中点；折线最短用对称点拉直，圆上点到定点或定直线的距离界于两个极值之间。' },
  { to: '/linecircle/z2', t: '轨迹与综合问题', d: '直接法、定义法与相关点法求轨迹；弦中点落在以 $OA$ 为直径的圆上，弦长随弦心距变化，最短当且仅当弦垂直于 $OP$。' },
];
</script>
