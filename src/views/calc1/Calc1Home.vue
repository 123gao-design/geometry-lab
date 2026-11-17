<template>
  <div>
    <div class="chapter-head">
      <h1>一元函数微积分</h1>
      <p class="sub">极限先给「越来越接近」一个确切的写法，连续再把极限与函数值接上；有了极限，切线斜率才能写成差商的极限，中值定理再把局部导数与整体增量接上；积分一路倒着走回来，先找原函数，再谈定积分；微分方程把求导的关系反过来当成条件，无穷级数则把加法做到无穷多项。</p>
      <div class="readall">学习进度：已读 {{ readAll }} / {{ total }} 章</div>
    </div>

    <h3 class="sec">子专题一 · 极限与连续<span class="prog">已读 {{ cnt(lim) }}/{{ lim.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in lim" :key="i" class="topic-card" :to="c.to">
        <span class="tag">极{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 导数与微分<span class="prog">已读 {{ cnt(der) }}/{{ der.length }} · 8 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in der" :key="i" class="topic-card" :to="c.to">
        <span class="tag">微{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 不定积分<span class="prog">已读 {{ cnt(int) }}/{{ int.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in int" :key="i" class="topic-card" :to="c.to">
        <span class="tag">积{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 定积分<span class="prog">已读 {{ cnt(def) }}/{{ def.length }} · 5 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in def" :key="i" class="topic-card" :to="c.to">
        <span class="tag">定{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 常微分方程<span class="prog">已读 {{ cnt(ode) }}/{{ ode.length }} · 6 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ode" :key="i" class="topic-card" :to="c.to">
        <span class="tag">方{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 无穷级数<span class="prog">已读 {{ cnt(ser) }}/{{ ser.length }} · 5 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ser" :key="i" class="topic-card" :to="c.to">
        <span class="tag">级{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <template v-for="(g, gi) in plan" :key="gi">      <h3 class="sec">{{ g.cn }} · {{ g.name }}<span class="prog">{{ g.items.length }} 章 · 规划中</span></h3>
      <div class="chapter-grid">
        <div v-for="(c, i) in g.items" :key="i" class="topic-card dim">
          <span class="tag">{{ g.pre }}{{ (g.off || 0) + i + 1 }}</span>
          <h3>{{ c.t }}</h3>
          <p>{{ c.d }}</p>
        </div>
      </div>
    </template>

    <div class="note good">拓展阅读：① 中值定理的罗尔、拉格朗日、柯西三个版本与泰勒公式是同一件事的不同精度，洛必达法则由柯西版本推出；② 反常积分用比较判别，p 积分与级数的 p 判别是同一把尺；③ 级数可补绝对收敛与条件收敛、幂级数的收敛半径与逐项求导；④ 微分方程可接二阶常系数线性方程与数值解法（欧拉法、龙格—库塔）；⑤ 傅里叶级数把「用多项式逼近」换成「用三角函数逼近」，与无穷级数一节接得最紧。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';

const lim = [
  { to: '/calc1/l1', t: '数列极限', d: '$\\varepsilon$-$N$ 定义：先给误差，再找起点；收敛只由尾部决定，前有限项无关紧要。' },
  { to: '/calc1/l2', t: '函数极限与左右极限', d: '从两侧分别逼近 $x_0$：两个单侧极限都存在且相等，极限才存在；与 $f(x_0)$ 取什么值无关。' },
  { to: '/calc1/l3', t: '无穷小与无穷大', d: '无穷小是极限为零的变量，不是很小的数；比较 $\\sin x$、$x$、$1-\\cos x$ 的阶，乘除里可作等价替换。' },
  { to: '/calc1/l4', t: '连续与间断', d: '连续就是极限值等于函数值；间断按左右极限分成可去、跳跃、无穷、振荡四类，闭区间连续函数有四条整体性质。' },
  { to: '/calc1/l5', t: '两个重要极限', d: '$\\sin x/x\\to1$ 由单位圆里的面积夹逼给出；$(1+1/n)^n\\to e$ 靠单调有界。' },
];
const der = [
  { to: '/calc1/d1', t: '导数与切线', d: '差商的极限给出切线斜率，也给出瞬时速度；可导必连续，反之不成立。' },
  { to: '/calc1/d2', t: '求导法则', d: '四则、复合、反函数与隐函数求导，一条链式法则贯穿；乘积法则由矩形面积三块拼出。' },
  { to: '/calc1/d3', t: '高阶导数与微分', d: '二阶导数读曲线的弯向，微分是增量的线性主部，余项按平方缩。' },
  { to: '/calc1/d4', t: '罗尔、拉格朗日与柯西中值定理', d: '从费马引理起步，三个定理把区间两端的差与内部某点的导数接上。' },
  { to: '/calc1/d5', t: '洛必达法则与未定式', d: '0/0 与 ∞/∞ 由导数之比接管，其余型式先取对数或通分化归。' },
  { to: '/calc1/d6', t: '泰勒公式', d: '多项式逐阶对齐导数，余项给出误差量级，求极限与作近似都靠它。' },
  { to: '/calc1/d7', t: '单调性、极值与凹凸性', d: '一阶、二阶导数的符号切开区间，列表即可读出整条曲线的形状。' },
  { to: '/calc1/d8', t: '渐近线与函数作图', d: '先除一次拆出整式，水平、垂直与斜渐近线随之确定，五步画出全图。' },
];
const int = [
  { to: '/calc1/i1', t: '原函数与不定积分', d: '原函数族只差一个常数，积分表由求导表倒着读。' },
  { to: '/calc1/i2', t: '换元积分法', d: '第一类凑微分、第二类换元，三角代换处理根式。' },
  { to: '/calc1/i3', t: '分部积分法', d: '乘积求导反用，选 $u$ 与 $dv$ 有先后。' },
  { to: '/calc1/i4', t: '有理函数的积分', d: '部分分式拆成多项式与简单分式，逐项积出。' },
];
const def = [
  { to: '/calc1/f1', t: '定积分的定义', d: '分割、近似、求和、取极限；定积分是一个数，与分法与取点无关。' },
  { to: '/calc1/f2', t: '微积分基本定理', d: '变上限积分求导得回 $f$，定积分由原函数在两端的差算出。' },
  { to: '/calc1/f3', t: '定积分的计算', d: '换元与分部在定积分下的写法，换元要同时换上下限。' },
  { to: '/calc1/f4', t: '反常积分', d: '无穷限与瑕积分：先算截断值再取极限，$p$ 积分给出收敛判据。' },
  { to: '/calc1/f5', t: '定积分的应用', d: '平面面积与旋转体体积，微元法写清「割、近似、求和、取极限」四步。' },
];
const ode = [
  { to: '/calc1/o1', t: '微分方程的概念与方向场', d: '未知量是函数；斜率图铺满平面，过一点的解处处与短线相切。' },
  { to: '/calc1/o2', t: '可分离变量方程', d: '变量各归一边再积分；除过的因子要回头补查零解。' },
  { to: '/calc1/o3', t: '一阶线性方程', d: '乘积分因子把左边收成一个导数；通解等于齐次解加一个特解。' },
  { to: '/calc1/o4', t: '可降阶的高阶方程', d: '缺谁省谁：缺 $y$ 直接积两次，缺 $x$ 令 $p=y\'$ 降成一阶。' },
  { to: '/calc1/o5', t: '二阶常系数线性方程', d: '特征方程的三种根对应单调衰减、临界与振荡，判别式是分界。' },
  { to: '/calc1/o6', t: '微分方程的应用', d: '增长、振动、电路三类现象，解都拆成稳态与暂态两部分。' },
];
const ser = [
  { to: '/calc1/s1', t: '常数项级数的概念与性质', d: '收敛由部分和数列的极限定义；通项趋于零只是必要条件。' },
  { to: '/calc1/s2', t: '正项级数的审敛法', d: '部分和单调，有上界即收敛；比较、比值、根值三种尺子。' },
  { to: '/calc1/s3', t: '交错级数与绝对收敛', d: '莱布尼茨判据与截断误差；条件收敛的级数换序会换和。' },
  { to: '/calc1/s4', t: '幂级数与泰勒展开', d: '收敛半径划出能用的那一段，系数由各阶导数读出。' },
  { to: '/calc1/s5', t: '傅里叶级数初步', d: '方波拆成奇次谐波；跳变处的超调不随项数消失。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const CN = ['一', '二', '三', '四', '五', '六'];
const higher = higherOf('calc1');
const plan = higher.groups.slice(6).map((g, i) => ({ ...g, cn: CN[i + 6] }));
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const readAll = cnt(lim) + cnt(der) + cnt(int) + cnt(def) + cnt(ode) + cnt(ser);
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
