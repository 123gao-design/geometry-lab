<template>
  <div>
    <div class="chapter-head">
      <h1>复变函数</h1>
      <p class="sub">复数让乘法变成旋转加伸缩，复变函数因此比实函数硬气得多：在一点可导，就能推出处处可导。柯西定理、级数展开与留数定理是这条路上的三个台阶，最后落到用围道积分算实积分。</p>
      <div class="readall">已上线 {{ built }} / {{ total }} 章：复数与复变函数 3/3，解析函数 4/4，级数与留数 5/5</div>
    </div>

    <h3 class="sec">子专题一 · 复数与复变函数<span class="prog">已读 {{ cnt(cplx) }}/{{ cplx.length }} · 3 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cplx" :key="i" class="topic-card" :to="c.to">
        <span class="tag">复{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 解析函数<span class="prog">已读 {{ cnt(ana) }}/{{ ana.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ana" :key="i" class="topic-card" :to="c.to">
        <span class="tag">解{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 级数与留数<span class="prog">已读 {{ cnt(ser) }}/{{ ser.length }} · 5 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ser" :key="i" class="topic-card" :to="c.to">
        <span class="tag">级{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">子专题一的三块画板各管一件事：几何表示机把点、模、辐角、共轭与乘 <Katex tex="i" /> 的旋转摆在同一张复平面上，拖一圈就把四个象限的辐角都看遍；映射机左右两张平面共用一条比例尺，<Katex tex="w=iz+1" /> 保形状、<Katex tex="w=z^2" /> 折半平面、<Katex tex="w=1/z" /> 卷圆族；初等函数机把 <Katex tex="e^z" /> 的横带与 <Katex tex="\operatorname{Log}z" /> 的分支并排摆开，竖线映成圆、横线映成射线。子专题二的四块画板接着把这套几何语言用在微分与积分上：导数机让差商轨迹随方向转满一圈，缩成一点才算可导；柯西-黎曼机把两族等值线与两支梯度箭头叠在同一张平面上；积分机把闭路上每走一步的贡献累成一条曲线，回不回起点一眼可见；积分公式机左右并排，把边界绕一圈与内部一点的值并排读出。子专题三的五块画板收在计算上：泰勒级数机把部分和连成折线，看它是否向 <Katex tex="f(z)" /> 收拢、金圈内外两样结果；洛朗机用条形图画系数，金色条是主部，一根、无穷根、零根分别对应极点、本性奇点与可去奇点；留数机拖动圆路圈住奇点，留数之和与数值积分同栏对照；保角机把同心圆与射线搬到另一张平面，夹角是否保住由读数给出；实积分机上半圆围道圈住一个极点，右图的阴影随半径铺开，截断积分一步步落到留数给出的精确值。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';
import Katex from '../../components/Katex.vue';

const cplx = [
  { to: '/complexvar/c1', t: '复数的几何表示', d: '复数就是点：$|z|$ 是到原点的距离，$\\arg z$ 是从正实轴量起的角，$z=re^{i\\theta}$。' },
  { to: '/complexvar/c2', t: '复变函数与映射', d: '把一个复平面搬到另一个复平面：$w=iz+1$ 保形状，$w=z^2$ 辐角加倍，$w=1/z$ 内翻成外。' },
  { to: '/complexvar/c3', t: '初等复变函数', d: '$e^z=e^x(\\cos y+i\\sin y)$ 的周期是 $2\\pi i$，对数因此多值，幂函数的值的个数由指数定。' },
];
const ana = [
  { to: '/complexvar/a1', t: '复变函数的导数', d: '差商从四面八方逼近同一点，所有方向读出同一个值才算可导；一点可导再升成一片可导，就是解析。' },
  { to: '/complexvar/a2', t: '柯西-黎曼方程', d: '把 $f=u+iv$ 拆开，可导等价于 $u_x=v_y$、$u_y=-v_x$ 两条偏导数的等式，实部与虚部都是调和函数。' },
  { to: '/complexvar/a3', t: '复积分与柯西定理', d: '沿曲线的复积分，解析函数在单连通区域内绕一圈积分为零，路径可以随意变形。' },
  { to: '/complexvar/a4', t: '柯西积分公式', d: '边界上的取值绕一圈，恰好定出内部任一点的值；高阶导数也由同一族积分给出。' },
];
const ser = [
  { to: '/complexvar/s1', t: '复级数与泰勒级数', d: '收敛半径等于到最近奇点的距离：圆盘内解析的函数展开成幂级数，系数组唯一。' },
  { to: '/complexvar/s2', t: '洛朗级数与孤立奇点', d: '环域上允许负幂，主部有几项就把奇点分成可去、极点与本性三类。' },
  { to: '/complexvar/s3', t: '留数定理', d: '闭路上的积分等于 $2\\pi i$ 乘圈内各奇点留数之和，积分问题缩成几处局部计算。' },
  { to: '/complexvar/s4', t: '保角映射', d: '解析且导数非零的映射保持夹角；分式线性变换是一一对应，把圆映成圆。' },
  { to: '/complexvar/s5', t: '用留数计算实积分', d: '上半圆围道配上两条收口引理，有理函数、含指数因子与三角有理式三类实积分都化成求留数。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const higher = higherOf('complexvar');
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const built = cplx.length + ana.length + ser.length;
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
