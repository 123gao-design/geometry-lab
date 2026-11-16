<template>
  <div>
    <div class="chapter-head">
      <h1>直线与圆</h1>
      <p class="sub">解析几何的起点。直线用一次方程描述，斜率与截距各自承担方向与位置；圆用二次方程描述，圆心定位置、半径定大小。把图形关系翻译成方程关系，再借距离公式与判别式读回几何结论，是后续圆锥曲线的通用手法。全模块四个子专题 13 章已上线。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 13 章（全模块已上线）</div>
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

    <div class="note good">全模块 13 章 16 块画板已上线。子专题一二三的十二块是：倾斜角与斜率机（金色直线绕原点转动，橙色弧是倾斜角，蓝绿虚线给出横走 1、竖走 k 的斜率三角形，α=90° 时斜率不存在）、直线方程的五种形式机（两点确定直线，五个按钮切换点斜、斜截、两点、截距与一般式，徽章同步改写，竖直、水平与过原点的直线让某些形式失效）、两条直线的位置关系机（四条滑块控制两个斜率与两个截距，平行时读两线间距，相交时标出交点与垂直标记）、直线束机（三档切换过定点、平行系与过两直线交点三种直线系，金色线随参数转动，竖直直线与取不到的 l₂ 各有提示）、同解变形机（三档演示平方、同乘含零因式与同除含零因式，拖 Q 落在红虚线上即读到增根或失根）、圆的标准方程与一般方程机（拖动圆心、调半径，两个方程同步改写，配方徽章恒读判别式 4r²）、直线与圆的位置关系机（半径与直线两滑块，蓝色虚线给出圆心到直线的距离，橙色段是弦，相切时垂足落在圆周上）、圆与圆的位置关系机（拖动第二个圆心、改两个半径，圆心距依次跨过两个临界值，五种位置关系随之改写）、垂径定理与圆周角机（弦高滑块让弦上下移动，过圆心的虚线垂直平分弦，橙绿两段弧同读圆心角与圆周角，比值恒为 1/2）、弦切角机（拖切点、拖弦、拖另一段弧上的点，橙色弦切角与紫色圆周角逐位相同）、切线长与圆幂机（三档切换相交弦、切割线与两切线，三条乘积式共用同一个 OP²−R²）、四点共圆机（三个顶点贴圆周走、第四个点可进出圆周，两组对角之和同时为 180° 时第四点必在圆上）。子专题四的四块是：对称与折线最短机（拖定点让 B 越过 x 轴，作对称点与直接连线两种走法自动切换，空心圈标出取等位置）、与圆有关的最值机（定点与定直线两档，圆上点到它们的距离界于两个极值之间）、过定点的弦中点轨迹机（中点沿以 OA 为直径的虚弧滑动，直角标记常在）、过定点的弦长最值机（弦心距最长时弦最短，过圆心时弦最长）。</div>
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
