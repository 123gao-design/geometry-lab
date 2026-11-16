<template>
  <div>
    <div class="chapter-head">
      <h1>抽象代数</h1>
      <p class="sub">一个集合配上二元运算，满足哪几条就叫半群、群、环、域，同态则把两个结构对齐。群论部分从定义与例子出发，走过子群、陪集、正规子群、同态基本定理，落到置换群与正多边形的对称。最后一部分换成图的结构：顶点、边与度，路径与连通，树、欧拉回路、平面图，以及着色与匹配。</p>
      <div class="readall">已上线 {{ built }} / {{ total }} 章：代数结构 4/4，群论 7/7，图论 6/6</div>
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

    <div class="note good">十七块画板各管一件事。代数结构四台：运算表机在模 <Katex tex="n" /> 加法、模 <Katex tex="n" /> 乘法与减法之间切换，结合律是否成立由表中两行两列的对照读出来；环与域机把 <Katex tex="\mathbb Z_n" /> 的乘法表铺开，零因子染红、可逆元染绿，<Katex tex="n" /> 为素数时整张表只剩绿色；同态机让 <Katex tex="\varphi:\mathbb Z_{12}\to\mathbb Z_m" /> 的核与像同时显示，<Katex tex="m" /> 整除 12 时像才完整；多项式环机拖动除数 <Katex tex="x-a" />，余式 <Katex tex="p(a)" /> 与商同步改写，落到根上时余式归零。群论七台：例子机把 <Katex tex="\mathbb Z_4" />、<Katex tex="V_4" />、<Katex tex="S_3" /> 的乘法表并排，四条公理逐条勾选；陪集机让一个生成元在 <Katex tex="\mathbb Z_{12}" /> 的表盘上反复转，子群与各条陪集按颜色分开；正规子群机比较 <Katex tex="S_3" /> 的左陪集与右陪集，<Katex tex="H=\langle(12)\rangle" /> 两边不一致，<Katex tex="A_3" /> 一致且商群阶为 2；同态基本定理机把整数按模 <Katex tex="n" /> 的余数分组，核 <Katex tex="n\mathbb Z" /> 与商群 <Katex tex="\mathbb Z/n\mathbb Z" /> 同台；置换机用三枚箭头画出置换的复合，复合次数走到阶时回到原位；对称机让正 <Katex tex="n" /> 边形旋转与翻转，群阶 <Katex tex="2n" /> 随边数变化；群作用机让正方形的八个对称变换轮番作用在顶点着色上，右图的金框圈出一条轨道，轨道与稳定子相乘恒为 8。图论六台：度数与握手机让边数逐条增加，度数总和始终是边数的两倍；广度优先搜索机从起点向外逐层铺开，目标换到孤立那片时距离读 <Katex tex="\infty" />；树的判定机把边数拨到 <Katex tex="n-1" /> 才转绿，少一条断开、多一条成圈；一笔画判定机对柯尼斯堡七桥给出四个奇点、对五边形给出零个；面数核验机把正 <Katex tex="n" /> 边形剖成扇形三角块，<Katex tex="V-E+F" /> 恒为 2；染色与匹配机给三类图贪心染色，绿色粗边给出完美匹配。</div>
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
const built = str.length + grp.length + net.length;
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
