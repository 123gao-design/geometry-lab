<template>
  <div>
    <div class="chapter-head">
      <h1>不等式</h1>
      <p class="sub">从作差定义与四条变形性质出发，经一元二次、高次分式与绝对值三类解不等式的主体方法，再进入证明不等式的核心工具，最后用半平面与可行域收束；五个子专题 <strong>15 章</strong>——性质与比较、一元二次不等式、基本不等式、放缩与常用不等式、简单线性规划与非线性规划初步。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 15 章</div>
    </div>

    <h3 class="sec">子专题一 · 性质与比较<span class="prog">已读 {{ cnt(ps, '/inequalities/p') }}/{{ ps.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ps" :key="i" class="topic-card" :to="'/inequalities/p' + (i + 1)">
        <span class="tag">性{{ i + 1 }}</span><span v-if="isRead('/inequalities/p' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 一元二次不等式<span class="prog">已读 {{ cnt(qs, '/inequalities/q') }}/{{ qs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in qs" :key="i" class="topic-card" :to="'/inequalities/q' + (i + 1)">
        <span class="tag">次{{ i + 1 }}</span><span v-if="isRead('/inequalities/q' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 基本不等式<span class="prog">已读 {{ cnt(gs, '/inequalities/g') }}/{{ gs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in gs" :key="i" class="topic-card" :to="'/inequalities/g' + (i + 1)">
        <span class="tag">基{{ i + 1 }}</span><span v-if="isRead('/inequalities/g' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 放缩与常用不等式<span class="prog">已读 {{ cnt(fs, '/inequalities/f') }}/{{ fs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in fs" :key="i" class="topic-card" :to="'/inequalities/f' + (i + 1)">
        <span class="tag">放{{ i + 1 }}</span><span v-if="isRead('/inequalities/f' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 简单线性规划与非线性规划初步<span class="prog">已读 {{ cnt(ls, '/inequalities/l') }}/{{ ls.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ls" :key="i" class="topic-card" :to="'/inequalities/l' + (i + 1)">
        <span class="tag">线{{ i + 1 }}</span><span v-if="isRead('/inequalities/l' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 排序不等式与切比雪夫不等式把「同序相加最大、反序最小」写成两个和的大小关系；② 琴生不等式以凸函数为条件，给出函数的平均与平均的函数之差，均值链 <Katex tex="H\le G\le A\le Q" /> 是它在 <Katex tex="\ln x" /> 上的特例；③ 调整法与磨光法处理等号条件一时看不出的对称题；④ 条件极值可交给拉格朗日乘子，变量较多时比逐项放缩直接；⑤ 概率一侧的马尔可夫不等式与切比雪夫不等式，回答「偏离中心多少」能有多大比例。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js'; // 卡片标题/简介支持 '$…$' 公式段
const ps = [
  { t: '不等式的性质', d: '作差定义推出四条常用性质：同加减保序、乘除看符号、传递与运算规则；性质的逆用判断与三处易错（乘负、倒数、同向相乘）。' },
  { t: '比较大小：作差与作商', d: '作差 → 变形 → 定号三步流程；作商只对同号可用、同负时结论反转；分解、配方、有理化三种变形手段。' },
];
const qs = [
  { t: '三个二次：函数、方程、不等式', d: 'Δ 三态定根、根切分数轴定号：a&gt;0 时大于取根外、小于取根内，开口向下全部反转；含参讨论三层面与恒成立的图象条件。' },
  { t: '穿根法：高次与分式', d: '分解为一次因子之积与零比较：符号表逐行读号、穿根曲线奇穿偶不穿；分式移项通分、分母零点除外。' },
  { t: '绝对值不等式', d: '|x−m| 是到 m 的距离：带内带外直接读解；换元 t=ax+b 反解与统一式半宽 c/|a|；双绝对值零点分段、c 的符号先查。' },
];
const gs = [
  { t: '基本不等式', d: '圆图、拼方图与凹凸性三条证明：直径 $AB=a+b$ 与过 C 的垂线交半圆，泰勒斯给直角、射影定理给 $CD^2=ab$，竖弦 $\\sqrt{ab}\\le$ 半径 $(a+b)/2$，取等在 $a=b$。' },
  { t: '用基本不等式求最值', d: '一正二定三相等三前置：和定看抛物线顶点积最大 $(s/2)^2$、积定看对勾谷底和最小 $2\\sqrt p$；取等位置越界时界而非最值。' },
  { t: '均值链 H≤G≤A≤Q', d: '调和、几何、算术、平方四条均值串成链：$Q^2-A^2=(a-b)^2/4$ 与倒数换元接出两头；$a=b$ 四处全取等。' },
];
const fs = [
  { t: '三角不等式：$|a+b|\\le|a|+|b|$', d: '折返与直达：$|a+b|$ 是到原点该走的路、$|a|+|b|$ 先折回再出发；平方差 $2(|ab|-ab)\\ge 0$ 取等在同号，向量版看三角形两短边闭合。' },
  { t: '柯西不等式：$(a^2+b^2)(c^2+d^2)\\ge(ac+bd)^2$', d: '配成向量 $u=(a,b)$、$v=(c,d)$：内积模长不等式 $|u\\cdot v|\\le|u||v|$；缺的 $(ad-bc)^2$ 正是平行四边形面积的平方，取等当两向量共线；n 维形式用于求平方和最值。' },
  { t: '常用放缩：裂项·夹逼·舍项', d: '求不出和的式子三法开路：裂项放大成可错位相消的列 $1/k^2<1/(k-1)k$、逐项夹逼 $S_n$ 界于两相邻分数、二项展开舍非负项取下界 $2$——每法都以等号在哪收口。' },
];
const ls = [
  { t: '二元一次不等式与平面区域', d: '直线把平面分成两个半平面，同一侧 $Ax+By+C$ 同号——代一个点即可定号；不等式组取交集，得到凸多边形可行域，顶点是边界直线的交点。' },
  { t: '简单线性规划：可行域与最优解', d: '目标函数 $z=ax+by$ 的等值线平行移动，凸多边形上的最值必在顶点取得；等值线与某条边平行时整条边都最优，整数解要到可行整点中逐个比较。' },
  { t: '曲线围成的可行域：等值线与边界相切', d: '可行域的边界换成圆、椭圆或抛物线：等值线平移到最后与边界曲线相切，切点就是最优解；切点越界时最值转到角点，区域无界时最大值可能不存在。' },
  { t: '非线性目标函数：斜率与距离', d: '分式 $(y-b)/(x-a)$ 是过定点的直线斜率，平方和 $(x-a)^2+(y-b)^2$ 是到定点的距离平方；距离型的最小值可以落在边的内部垂足，不再总是顶点。' },
];
const cnt = (arr, pfx) => arr.filter((_, i) => READ.set.has(pfx + (i + 1))).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/inequalities/')).length;
</script>
