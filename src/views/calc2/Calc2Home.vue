<template>
  <div>
    <div class="chapter-head">
      <h1>多元函数微积分</h1>
      <p class="sub">一元函数只有一个自变量，沿一条线走；多元函数的点在平面或空间里，脚下有一整片方向。微分学部分先给极限与连续，再沿坐标轴取偏导、把偏导拼成梯度，用海塞矩阵区分山顶谷底，最后用拉格朗日乘数法处理只能沿曲线走的条件极值。积分学部分把定积分推广到平面与空间区域，曲线与曲面积分再让积分沿着弯的、斜的东西走。</p>
      <div class="readall">学习进度：已读 {{ readAll }} / {{ total }} 章</div>
    </div>

    <h3 class="sec">子专题一 · 多元函数微分学<span class="prog">已读 {{ cnt(mul) }}/{{ mul.length }} · 6 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in mul" :key="i" class="topic-card" :to="c.to">
        <span class="tag">微{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 重积分<span class="prog">已读 {{ cnt(rim) }}/{{ rim.length }} · 6 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in rim" :key="i" class="topic-card" :to="c.to">
        <span class="tag">重{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 曲线与曲面积分<span class="prog">已读 {{ cnt(curves) }}/{{ curves.length }} · 6 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in curves" :key="i" class="topic-card" :to="c.to">
        <span class="tag">线{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <template v-for="(g, gi) in plan" :key="gi">
      <h3 class="sec">{{ g.cn }} · {{ g.name }}<span class="prog">{{ g.items.length }} 章 · 规划中</span></h3>
      <div class="chapter-grid">
        <div v-for="(c, i) in g.items" :key="i" class="topic-card dim">
          <span class="tag">{{ g.pre }}{{ (g.off || 0) + i + 1 }}</span>
          <h3>{{ c.t }}</h3>
          <p>{{ c.d }}</p>
        </div>
      </div>
    </template>

    <div class="note good">拓展阅读：① 变量替换的面积元由雅可比行列式给出，极坐标下的 <Katex tex="r" /> 是它的特例；② 格林公式、高斯公式与斯托克斯公式把三类积分互相换算，定向往边界的方向上走；③ 隐函数定理给「由方程确定的函数」一个存在且可导的条件，切线竖直处正是 <Katex tex="F_y=0" /> 的临界情形；④ 场论以梯度、散度、旋度统一上述公式，旋度为零则势函数存在；⑤ 拉格朗日乘子可推广到多个约束，条件是各约束的梯度线性无关。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';
import Katex from '../../components/Katex.vue';

const mul = [
  { to: '/calc2/m1', t: '二重极限与连续', d: '所有路径都通向同一个高度，二重极限才存在；沿 $y=kx$ 与沿 $y=x^2$ 是两类常见反例。' },
  { to: '/calc2/m2', t: '偏导数与全微分', d: '偏导数固定另一个变量沿坐标轴求变化率；全微分要求增量被一张切平面一致地逼近。' },
  { to: '/calc2/m3', t: '复合函数与隐函数求导', d: '链式法则沿树上的每条路相乘再相加；隐函数斜率 $dy/dx=-F_x/F_y$，要求 $F_y\\ne0$。' },
  { to: '/calc2/m4', t: '方向导数与梯度', d: '方向导数是梯度在该方向的投影，梯度指向最陡上升的一侧，且垂直于等值线。' },
  { to: '/calc2/m5', t: '多元函数的极值', d: '驻点之外还要用海塞矩阵的 $AC-B^2$ 区分极大、极小与鞍点，判别式为零时另作估计。' },
  { to: '/calc2/m6', t: '拉格朗日乘数法', d: '约束曲线的切向不许有梯度分量，于是 $\\nabla f$ 与 $\\nabla\\varphi$ 平行，等值线与约束相切。' },
];
const rim = [
  { to: '/calc2/r1', t: '二重积分的定义与性质', d: '分割、近似、求和、取极限；分法与取点都不影响结果，连续函数一定可积。' },
  { to: '/calc2/r2', t: '二重积分的计算', d: '先一后另一，竖条与横条两种扫法；内层限含外层变量，区域要拆时得分段。' },
  { to: '/calc2/r3', t: '极坐标下的二重积分', d: '面积元是 $r\\,dr\\,d\\theta$，多出来的 $r$ 来自弧长 $r\\,\\Delta\\theta$。' },
  { to: '/calc2/r4', t: '三重积分', d: '穿线（先一后二）与切片（先二后一）两种顺序，三次一元积分算出同一个数。' },
  { to: '/calc2/r5', t: '柱面坐标与球面坐标', d: '体积元分别是 $r\\,dr\\,d\\theta\\,dz$ 与 $\\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$，本质都是雅可比。' },
  { to: '/calc2/r6', t: '重积分的应用', d: '质量、质心与转动惯量都是密度加权的积分；密度不均匀时质心离开形心。' },
];
const curves = [
  { to: '/calc2/c1', t: '第一类曲线积分', d: '对弧长加权，$ds=\\sqrt{x\'^2+y\'^2}\\,dt$；换走向读数不变。' },
  { to: '/calc2/c2', t: '第二类曲线积分', d: '对坐标加权，$\\int P\\,dx+Q\\,dy$ 读作做功；走向反过来结果变号。' },
  { to: '/calc2/c3', t: '格林公式', d: '闭曲线上的环流等于区域内 $Q_x-P_y$ 的积分，路径无关有四个等价条件。' },
  { to: '/calc2/c4', t: '第一类曲面积分', d: '面积元 $dS=\\sqrt{1+z_x^2+z_y^2}\\,dx\\,dy$，投影面积要乘放大因子。' },
  { to: '/calc2/c5', t: '第二类曲面积分', d: '通量 $\\iint F\\cdot n\\,dS$，曲面定向换了侧就换号。' },
  { to: '/calc2/c6', t: '高斯公式与斯托克斯公式', d: '散度把闭曲面的通量换成三重积分；旋度把环流换成曲面的通量。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const CN = ['一', '二', '三', '四', '五', '六'];
const higher = higherOf('calc2');
const plan = higher.groups.slice(3).map((g, i) => ({ ...g, cn: CN[i + 3] }));
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const readAll = cnt(mul) + cnt(rim) + cnt(curves);
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
