<template>
  <div>
    <div class="chapter-head">
      <h1>极坐标与参数方程</h1>
      <p class="sub">坐标系的另一套语言。极坐标用极径与极角定位，把「到定点的距离」与「绕定点转过的角」分成两个独立读数；参数方程用一个参数同时驱动横纵坐标，把曲线上的点写成关于参数的一对式子。两套写法都与直角坐标互通，遇到圆、旋转与轨迹时往往比 <Katex tex="y=f(x)" /> 省事。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / {{ js.length + qs.length + ss.length + gs.length }} 章</div>
    </div>

    <h3 class="sec">子专题一 · 极坐标系与互化<span class="prog">已读 {{ cnt(js) }}/{{ js.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in js" :key="i" class="topic-card" :to="c.to">
        <span class="tag">极{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 曲线的极坐标方程<span class="prog">已读 {{ cnt(qs) }}/{{ qs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in qs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">曲{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 参数方程<span class="prog">已读 {{ cnt(ss) }}/{{ ss.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ss" :key="i" class="topic-card" :to="c.to">
        <span class="tag">参{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 参数方程的应用<span class="prog">已读 {{ cnt(gs) }}/{{ gs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in gs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">轨{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 圆锥曲线在极坐标下写成 <Katex tex="r=\dfrac{ep}{1-e\cos\theta}" />，<Katex tex="e" /> 取定，椭圆、抛物线与双曲线同出一式；② 玫瑰线 <Katex tex="r=a\cos k\theta" />、双纽线与心形线由 k 与常数的取值分辨，对称性可直接从方程读出；③ 摆线与旋轮线说明用参数写曲线的必要，最速降线问题由它提出；④ 极坐标下的面积由 <Katex tex="\frac{1}{2}\int r^2\,d\theta" /> 得到，被积的正是扇形面积的一半；⑤ 曲率与渐屈线描述曲线弯得多快，圆是曲率为常数的曲线。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import Katex from '../../components/Katex.vue';

const js = [
  { to: '/polar/j1', t: '极坐标系与点的极坐标', d: '极点、极轴与极径、极角四个词定下一套坐标系；同一枚点有无穷多组极坐标，负径是一种约定。' },
  { to: '/polar/j2', t: '极坐标与直角坐标互化', d: '$x=\\rho\\cos\\theta$、$y=\\rho\\sin\\theta$；反求极角时正切只给参考值，象限决定最终的角度。' },
];
const qs = [
  { to: '/polar/q1', t: '圆的极坐标方程', d: '圆心在极点写 $\\rho=a$，在极轴上写 $\\rho=2a\\cos\\theta$，在垂直线上写 $\\rho=2a\\sin\\theta$；负径补齐另半个圆。' },
  { to: '/polar/q2', t: '直线与射线的极坐标方程', d: '$\\theta=\\alpha$ 给过极点的直线，$\\rho\\cos\\theta=a$ 与 $\\rho\\sin\\theta=b$ 给垂直、平行于极轴的直线；射线与直线只差 $\\rho$ 的取值范围。' },
  { to: '/polar/q3', t: '常见极坐标曲线', d: '玫瑰线、心形线、双纽线与螺线同屏：负径把玫瑰的四瓣分成正负两组，状态栏逐条读出有符号极径。' },
];
const ss = [
  { to: '/polar/s1', t: '参数方程与消参', d: '参数每取一值给出一枚点；代入、平方相加、借恒等式三种消参手法，参数范围决定曲线留下哪一段。' },
  { to: '/polar/s2', t: '直线与圆的参数方程', d: '直线用 $x=x_0+t\\cos\\alpha$、$y=y_0+t\\sin\\alpha$，$|t|$ 是有向距离；圆用圆心角 $\\theta$ 作参数。' },
  { to: '/polar/s3', t: '圆锥曲线的参数方程', d: '椭圆用离心角，双曲线用 $\\sec\\theta$ 与 $\\tan\\theta$，抛物线用 $t$；三种参数含义各不相同。' },
];
const gs = [
  { to: '/polar/g1', t: '参数方程求最值', d: '椭圆上的点写成参数式，距离平方化成 $\\cos\\theta$ 的二次式，再按对称轴与 $[-1,1]$ 的位置读最值。' },
  { to: '/polar/g2', t: '参数方程与轨迹', d: '参数法写 $x(\\theta)$、$y(\\theta)$ 再消参，相关点法把已知曲线上的点代回；轨迹方程之后还要补范围。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/polar/')).length;
</script>
