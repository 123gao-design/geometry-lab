<template>
  <SubjectTabs active="math" />

  <div class="card hero" style="margin-top:26px">
    <div class="hero-row">
      <svg class="home-logo" viewBox="0 0 48 48" aria-hidden="true">
        <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#5cadff"/><stop offset="1" stop-color="#67e8f9"/>
        </linearGradient></defs>
        <rect x="2" y="2" width="44" height="44" rx="11" fill="url(#hg)"/>
        <ellipse cx="24" cy="24" rx="15.5" ry="9.5" fill="none" stroke="#fff" stroke-width="2.2"/>
        <path d="M17.5 24 L24 16.4 L30.5 24" fill="none" stroke="#ffd166" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="17.5" cy="24" r="2.6" fill="#fff"/><circle cx="30.5" cy="24" r="2.6" fill="#fff"/>
      </svg>
      <h1 style="margin:0;font-size:clamp(26px,4vw,36px)">几何演示实验室</h1>
    </div>
    <p class="sub">把课本里的定理做成可以拖动、可以实时读数的实验台 —— 每一张图，都是一个活的证明。</p>
  </div>

  <h3 class="sec">一 · 初等数学<span class="prog">14 个模块 · 全部上线</span></h3>
  <div class="topic-grid home-grid">
    <router-link class="topic-card" to="/sets">
      <span class="tag">已上线</span>
      <h3>集合与常用逻辑</h3>
      <p>元素与集合的三种表示、子集与 <Katex tex="2^n"/> 家族、交并补与数轴运算；量词的真假、四种命题与充分必要条件。</p>
      <span class="prog-box">已读 {{ setsRead() }} / 12</span>
    </router-link>
    <router-link class="topic-card" to="/functions">
      <span class="tag">已上线</span>
      <h3>函数与微积分初步</h3>
      <p>映射与函数概念、单调性与奇偶性、对称与周期、零点与二分法、幂指对与对勾函数、图象变换；导数、泰勒展开与积分。</p>
      <span class="prog-box">已读 {{ fnRead() }} / 35</span>
    </router-link>
    <router-link class="topic-card" to="/inequalities">
      <span class="tag">已上线</span>
      <h3>不等式</h3>
      <p>不等式的性质与比较、三个二次与穿根法、绝对值不等式、基本不等式与均值链、放缩与柯西不等式、线性规划与非线性规划。</p>
      <span class="prog-box">已读 {{ ineqRead() }} / 15</span>
    </router-link>
    <router-link class="topic-card" to="/trig">
      <span class="tag">已上线</span>
      <h3>三角函数与三角形</h3>
      <p>任意角与弧度制、单位圆定义与诱导公式、图象与变换、和差倍角与积化和差、辅助角、反三角函数、解三角形。</p>
      <span class="prog-box">已读 {{ trigRead() }} / 23</span>
    </router-link>
    <router-link class="topic-card" to="/vectors">
      <span class="tag">已上线</span>
      <h3>向量与复数</h3>
      <p>向量的线性运算、基本定理与坐标、数量积与极化恒等式、向量积与它的几何意义、几何与物理应用；复数、三角形式与欧拉公式。</p>
      <span class="prog-box">已读 {{ vecRead() }} / 17</span>
    </router-link>
    <router-link class="topic-card" to="/sequences">
      <span class="tag">已上线</span>
      <h3>数列</h3>
      <p>通项、递推与前 <Katex tex="n"/> 项和、等差数列与等比数列、求和的方法、递推与构造、数学归纳法、增长与分期付款。</p>
      <span class="prog-box">已读 {{ seqRead() }} / 20</span>
    </router-link>
    <router-link class="topic-card" to="/linecircle">
      <span class="tag">已上线</span>
      <h3>直线与圆</h3>
      <p>倾斜角与斜率、直线方程的五种形式、两直线位置关系与三种距离；圆的方程、直线与圆、圆与圆；垂径、圆周角、切线、圆幂与四点共圆；直线系、对称、最值与轨迹。</p>
      <span class="prog-box">已读 {{ lcRead() }} / 13</span>
    </router-link>
    <router-link class="topic-card" to="/polar">
      <span class="tag">已上线</span>
      <h3>极坐标与参数方程</h3>
      <p>极径与极角、极坐标与直角坐标互化、圆与直线的极坐标方程；参数方程与消参、直线的参数、圆锥曲线的参数、参数求最值与轨迹。</p>
      <span class="prog-box">已读 {{ polarRead() }} / 9</span>
    </router-link>
    <router-link class="topic-card" to="/conics">
      <span class="tag">已上线</span>
      <h3>圆锥曲线</h3>
      <p>五种定义与标准方程、光学性质与切线、仿射变换、参数方程与轨迹、直线与圆锥曲线、极点极线与配极理论。</p>
      <span class="prog-box">已读 {{ conicsRead() }} / 32</span>
    </router-link>
    <router-link class="topic-card" to="/solid">
      <span class="tag">已上线</span>
      <h3>立体几何</h3>
      <p>多面体与旋转体、柱锥台球的体积与表面积、组合体与外接球；平行与垂直、异面直线与角、最小角定理；空间直角坐标系、平面方程与法向量、距离与夹角的坐标算法。</p>
      <span class="prog-box">已读 {{ solidRead() }} / 10</span>
    </router-link>
    <router-link class="topic-card" to="/combinatorics">
      <span class="tag">已上线</span>
      <h3>组合与二项式定理</h3>
      <p>分类加法与分步乘法、排列数与组合数、捆绑插空与分组模型；二项式定理与通项、杨辉三角与系数性质、赋值法求系数和；帕斯卡恒等式与网格路径、近似计算与整除性。</p>
      <span class="prog-box">已读 {{ cbRead() }} / 9</span>
    </router-link>
    <router-link class="topic-card" to="/probability">
      <span class="tag">已上线</span>
      <h3>概率与统计</h3>
      <p>样本空间与事件的运算、频率与几何概型；条件概率、全概率与贝叶斯；分布列、二项与超几何、正态与卡方分布；期望方差与协方差；抽样与直方图、线性回归；假设检验与独立性检验。</p>
      <span class="prog-box">已读 {{ probRead() }} / 18</span>
    </router-link>
    <router-link class="topic-card" to="/numeric">
      <span class="tag">已上线</span>
      <h3>数值计算</h3>
      <p>误差与有效数字；二分法、牛顿迭代、不动点迭代；最小二乘与线性化；泰勒余项、龙格现象与数值积分。</p>
      <span class="prog-box">已读 {{ numRead() }} / 10</span>
    </router-link>
    <router-link class="topic-card" to="/linalg">
      <span class="tag">已上线</span>
      <h3>线性代数初步</h3>
      <p>行列式与面积体积；矩阵运算、逆与秩；平面与空间的线性变换；特征值与对角化、反复作用；二次型转轴与圆锥曲线分类。</p>
      <span class="prog-box">已读 {{ lgRead() }} / 14</span>
    </router-link>
  </div>

  <h3 class="sec">二 · 高等数学<span class="prog">9 个模块 · 全部上线</span></h3>
  <div class="topic-grid home-grid">
    <router-link class="topic-card" to="/calc1">
      <span class="tag">已上线</span>
      <h3>一元函数微积分</h3>
      <p>极限、导数、不定积分、定积分、常微分方程、无穷级数六块全部上线，36 台画板。</p>
      <span class="prog-box">已读 {{ c1Read() }} / 33</span>
    </router-link>
    <router-link class="topic-card" to="/spacegeom">
      <span class="tag">已上线</span>
      <h3>空间解析几何</h3>
      <p>空间向量与三积、平面与直线的方程、柱面锥面与二次曲面、空间曲线，12 台三维画板可拖拽旋转。</p>
      <span class="prog-box">已读 {{ sgRead() }} / 12</span>
    </router-link>
    <router-link class="topic-card" to="/calc2">
      <span class="tag">已上线</span>
      <h3>多元函数微积分</h3>
      <p>极限、偏导与全微分、方向导数与梯度、极值与拉格朗日乘数法，重积分与坐标变换，曲线曲面积分与三条公式，20 台画板。</p>
      <span class="prog-box">已读 {{ c2Read() }} / 18</span>
    </router-link>
    <router-link class="topic-card" to="/complexvar">
      <span class="tag">已上线</span>
      <h3>复变函数</h3>
      <p>复数的几何表示与映射、初等复变函数；导数与柯西-黎曼方程、复积分与柯西定理、柯西积分公式；泰勒与洛朗级数、留数定理、保角映射、用留数计算实积分，12 台画板。</p>
      <span class="prog-box">已读 {{ cvRead() }} / 12</span>
    </router-link>
    <router-link class="topic-card" to="/numtheory">
      <span class="tag">已上线</span>
      <h3>初等数论</h3>
      <p>带余除法与欧几里得算法、同余与一次同余方程；素数分解、欧拉函数、费马与欧拉定理、中国剩余定理、数论函数与莫比乌斯反演；二次剩余、原根与指数、不定方程、RSA，13 台画板。</p>
      <span class="prog-box">已读 {{ ntRead() }} / 13</span>
    </router-link>
    <router-link class="topic-card" to="/topology">
      <span class="tag">已上线</span>
      <h3>拓扑学基础</h3>
      <p>开集公理与基、闭包与连续映射、同胚、度量空间与序列收敛；连通、道路连通与紧致，商空间粘出环面与克莱因瓶；欧拉示性数、基本群与覆叠空间，12 台画板。</p>
      <span class="prog-box">已读 {{ tpRead() }} / 12</span>
    </router-link>
    <router-link class="topic-card" to="/fractal">
      <span class="tag">已上线</span>
      <h3>分形几何</h3>
      <p>自相似与相似维数、盒维数、豪斯多夫维数；康托集、科赫曲线、谢尔宾斯基图形、朱利亚集与曼德博集；迭代函数系统、L 系统与海岸线量尺，11 台画板。</p>
      <span class="prog-box">已读 {{ frRead() }} / 11</span>
    </router-link>
    <router-link class="topic-card" to="/projgeom">
      <span class="tag">已上线</span>
      <h3>高等几何（射影几何）</h3>
      <p>齐次坐标与无穷远线、射影变换与交比、对偶原理、德萨格与帕普斯定理；配极与极点极线、二次曲线的射影分类、帕斯卡定理；变换群与爱尔兰根纲领，11 台画板。</p>
      <span class="prog-box">已读 {{ pjRead() }} / 11</span>
    </router-link>
    <router-link class="topic-card" to="/algebra">
      <span class="tag">已上线</span>
      <h3>抽象代数</h3>
      <p>二元运算与半群、群环域、同态与多项式环；子群与陪集、正规子群与商群、同态基本定理、置换群与二面体群、群作用与轨道-稳定子；图论六章，17 台画板。</p>
      <span class="prog-box">已读 {{ algRead() }} / 17</span>
    </router-link>
    <router-link v-for="m in planned" :key="m.slug" class="topic-card plan-card" :to="'/' + m.slug">
      <span class="tag">规划中</span>
      <h3>{{ m.t }}</h3>
      <p>{{ m.card }}</p>
      <span class="prog-box">共 {{ chapterCount(m) }} 章 · 待开写</span>
    </router-link>
  </div>

  <div class="tool-row">
    <router-link class="tool-link" to="/playground">
      <span class="tag">工具</span>
      <strong>自由画板 · GeoGebra</strong>
      <span>整包自托管，断网可用；讲解页右下角的圆形按钮随时开半屏</span>
    </router-link>
    <router-link class="tool-link" to="/cheatsheet">
      <span class="tag">工具</span>
      <strong>定理速查</strong>
      <span>全站结论一页收纳，卡片即内链，可打印当考前小抄</span>
    </router-link>
    <router-link class="tool-link" to="/calendar">
      <span class="tag">工具</span>
      <strong>日历 · 待办</strong>
      <span>按月排学习计划，点某一天记下要做的事；数据留在本机，可备份成 JSON</span>
    </router-link>
  </div>
</template>
<script setup>
import { READ } from '../lib/progress.js';
import { HIGHER, chapterCount } from '../lib/higherplan.js';
import Katex from '../components/Katex.vue';
import SubjectTabs from '../components/SubjectTabs.vue';
const planned = HIGHER.filter(m => !['calc1', 'spacegeom', 'calc2', 'complexvar', 'numtheory', 'topology', 'fractal', 'projgeom', 'algebra'].includes(m.slug));
const c1Read = () => [...READ.set].filter(p => p.startsWith('/calc1/')).length;
const sgRead = () => [...READ.set].filter(p => p.startsWith('/spacegeom/')).length;
const c2Read = () => [...READ.set].filter(p => p.startsWith('/calc2/')).length;
const cvRead = () => [...READ.set].filter(p => p.startsWith('/complexvar/')).length;
const ntRead = () => [...READ.set].filter(p => p.startsWith('/numtheory/')).length;
const tpRead = () => [...READ.set].filter(p => p.startsWith('/topology/')).length;
const frRead = () => [...READ.set].filter(p => p.startsWith('/fractal/')).length;
const pjRead = () => [...READ.set].filter(p => p.startsWith('/projgeom/')).length;
const algRead = () => [...READ.set].filter(p => p.startsWith('/algebra/')).length;
const conicsRead = () => [...READ.set].filter(p => p.startsWith('/conics/')).length;
const fnRead = () => [...READ.set].filter(p => p.startsWith('/functions/')).length;
const ineqRead = () => [...READ.set].filter(p => p.startsWith('/inequalities/')).length;
const lcRead = () => [...READ.set].filter(p => p.startsWith('/linecircle/')).length;
const polarRead = () => [...READ.set].filter(p => p.startsWith('/polar/')).length;
const solidRead = () => [...READ.set].filter(p => p.startsWith('/solid/')).length;
const setsRead = () => [...READ.set].filter(p => p.startsWith('/sets/')).length;
const seqRead = () => [...READ.set].filter(p => p.startsWith('/sequences/')).length;
const trigRead = () => [...READ.set].filter(p => p.startsWith('/trig/')).length;
const vecRead = () => [...READ.set].filter(p => p.startsWith('/vectors/')).length;
const cbRead = () => [...READ.set].filter(p => p.startsWith('/combinatorics/')).length;
const probRead = () => [...READ.set].filter(p => p.startsWith('/probability/')).length;
const numRead = () => [...READ.set].filter(p => p.startsWith('/numeric/')).length;
const lgRead = () => [...READ.set].filter(p => p.startsWith('/linalg/')).length;
</script>
<style scoped>
/* 高等数学一栏的卡片：标签描边改虚线、取橙色，与已上线的实线蓝标签分开 */
.plan-card .tag { color: var(--orange); border-style: dashed; }
</style>
