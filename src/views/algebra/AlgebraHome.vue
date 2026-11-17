<template>
  <div>
    <div class="chapter-head">
      <h1>抽象代数</h1>
      <p class="sub">一个集合配上二元运算，满足哪几条就叫半群、群、环、域，同态则把两个结构对齐。群论部分从定义与例子出发，走过子群、陪集、正规子群、同态基本定理，落到置换群与正多边形的对称。最后一部分换成图的结构：顶点、边与度，路径与连通，树、欧拉回路、平面图，以及着色与匹配。</p>
      <div class="readall">学习进度：已读 {{ readAll }} / {{ total }} 章</div>
    </div>

    <h3 class="sec">子专题一 · 代数结构<span class="prog">已读 {{ cnt(str) }}/{{ str.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in str" :key="i" class="topic-card" :to="c.to">
        <span class="tag">结{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 群论<span class="prog">已读 {{ cnt(grp) }}/{{ grp.length }} · 7 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in grp" :key="i" class="topic-card" :to="c.to">
        <span class="tag">群{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 图论<span class="prog">已读 {{ cnt(net) }}/{{ net.length }} · 6 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in net" :key="i" class="topic-card" :to="c.to">
        <span class="tag">网{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 群论往后是拉格朗日定理与西罗定理，子群的个数由此成为可计算的量；② 环与域在群之上再添一种运算，理想与商环把「模掉一个关系」写成统一的构造，域扩张则把三等分角与倍立方的不可能性归结为次数；③ 图论可补生成树（Kruskal 与 Prim 都是在边权上做贪心）、欧拉图与哈密顿图、平面图的 <Katex tex="V-E+F=2" />；④ 邻接矩阵把图交回线性代数，谱半径与连通性、二部性相关；⑤ 群表示论把抽象的群落成矩阵，特征标表是它的入口。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';
import Katex from '../../components/Katex.vue';

const str = [
  { to: '/algebra/s1', t: '二元运算与半群', d: '封闭、结合、幺元、逆元四条逐级加码，减法在整数上给出结合律失效的样本。' },
  { to: '/algebra/s2', t: '群、环、域', d: '群只留一种运算，环有两种且加法成群，域再要求非零元可除。$\\mathbb Z_n$ 何时成域由 $n$ 是否为素数决定。' },
  { to: '/algebra/s3', t: '同态与同构', d: '保运算的映射把结构对齐。核衡量丢失的信息，像给出保留下来的那部分。' },
  { to: '/algebra/s4', t: '多项式环', d: '多项式按加法与乘法成环，带余除法由次数作欧几里得；余式 $p(a)$ 与根一一对应。' },
];
const grp = [
  { to: '/algebra/g1', t: '群的定义与例子', d: '四条公理导出幺元唯一、逆元唯一；$\mathbb Z_4$、$V_4$、$S_3$ 给出循环、交换与非交换的样本。' },
  { to: '/algebra/g2', t: '子群与陪集', d: '拉格朗日定理说子群的阶整除群的阶，陪集把群切成等大的几块。' },
  { to: '/algebra/g3', t: '正规子群与商群', d: '左陪集与右陪集重合才叫正规，商群的存在性正卡在这一条上。' },
  { to: '/algebra/g4', t: '群同态基本定理', d: '核是正规子群，商群与像同构。所有同态都化成一个自然投影。' },
  { to: '/algebra/g5', t: '置换群与凯莱定理', d: '置换按复合成群，轮换分解给出阶；凯莱定理把任何有限群嵌进对称群。' },
  { to: '/algebra/g6', t: '群与对称', d: '正多边形的旋转与翻转构成二面体群，群阶 $2n$ 量化对称程度。' },
  { to: '/algebra/g7', t: '群作用与轨道-稳定子', d: '群把元素送到别的元素上去，轨道与稳定子的大小相乘等于群的阶；伯恩赛德引理数出本质不同的方案。' },
];
const net = [
  { to: '/algebra/n1', t: '图的基本概念', d: '顶点、边与度，握手定理把度数总和与边数绑在一起，奇度顶点必为偶数个。' },
  { to: '/algebra/n2', t: '路径与连通性', d: '连通关系是等价关系，连通分量由此分出；广度优先搜索给最短距离。' },
  { to: '/algebra/n3', t: '树', d: '连通无圈，$n$ 个顶点恰有 $n-1$ 条边，任意两点之间路径唯一。' },
  { to: '/algebra/n4', t: '欧拉回路与哈密顿回路', d: '一笔画只看奇点个数；经过每个顶点恰好一次则是另一回事，没有简单判据。' },
  { to: '/algebra/n5', t: '平面图与欧拉公式', d: '$V-E+F=2$ 推出 $E\\le3V-6$，$K_5$ 与 $K_{3,3}$ 因此画不到平面上。' },
  { to: '/algebra/n6', t: '图的着色与匹配', d: '团给色数下界、贪心给上界；二分图的两色判据与霍尔定理落在同一套语言里。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const higher = higherOf('algebra');
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const readAll = cnt(str) + cnt(grp) + cnt(net);
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
