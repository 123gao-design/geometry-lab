<template>
  <div>
    <div class="chapter-head">
      <h1>拓扑学基础</h1>
      <p class="sub">只保留远近与连续，不管长度角度。开集公理把「挨得近」写成三条规则，连续映射与同胚随之定义；连通与紧致回答空间整不整块、能不能被有限盖住；商空间把正方形粘成环面与克莱因瓶。最后两样东西用来分辨形状：欧拉示性数数顶点、棱、面，基本群看闭环路怎么绕洞。</p>
      <div class="readall">已上线 {{ built }} / {{ total }} 章：拓扑空间 5/5，连通与紧致 4/4，不变量初步 3/3</div>
    </div>

    <h3 class="sec">子专题一 · 拓扑空间<span class="prog">已读 {{ cnt(spn) }}/{{ spn.length }} · 5 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in spn" :key="i" class="topic-card" :to="c.to">
        <span class="tag">拓{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 连通与紧致<span class="prog">已读 {{ cnt(con) }}/{{ con.length }} · 4 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in con" :key="i" class="topic-card" :to="c.to">
        <span class="tag">连{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 不变量初步<span class="prog">已读 {{ cnt(inv) }}/{{ inv.length }} · 3 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in inv" :key="i" class="topic-card" :to="c.to">
        <span class="tag">不{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">十二块画板各管一件事。拓扑空间五台：开集与开球机让球在圆盘里进出，判读只认「整颗球在不在集合里」；基与子空间机用网格基球铺满 L 形开集，切到子空间视角后球与直线的交成了相对开集；内部与闭包机拖动一点，内点、边界点、外点依次翻牌，孤立点也在边界上；开区间原像机画出 <Katex tex="f(x)=x^2" /> 在值域开区间下的原像，换成跳断函数，原像端点立刻由空心变实心；度量球机把 <Katex tex="p" />-范数的单位球与 <Katex tex="\varepsilon" /> 邻域并排，点列的尾巴进圈与否由不等式读出。连通与紧致四台：分割机用一条走廊决定空间能否拆成两块开集；道路机把哑铃形空间里的路径一段段画出，切到正弦曲线，整体连通却走不到原点；有限子覆盖机让闭区间与开区间的开覆盖并排，红色缺口永远贴着开区间的端点；粘边机按箭头方向把正方形粘成环面、克莱因瓶与莫比乌斯带。不变量三台：数顶点机在四面体、长方体、环面、双环面之间切换，<Katex tex="V-E+F" /> 从 <Katex tex="2" /> 掉到 <Katex tex="0" /> 再掉到 <Katex tex="-2" />；绕数机把 <Katex tex="\pi_1(S^1)=\mathbb Z" /> 画成层层外扩的螺旋；展开机把实数轴缠到圆周上，直线上的整点全部落进同一枚基点，二次覆叠模式下原像变成两个。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';
import Katex from '../../components/Katex.vue';

const spn = [
  { to: '/topology/s1', t: '开集与拓扑', d: '三条公理只管并与有限交，度量空间的开球是最初的原型，开集决定谁挨得近。' },
  { to: '/topology/s2', t: '基与子空间', d: '一小批基球自由地并，生成整族开集；子集继承相对开集，开与否要带参照空间。' },
  { to: '/topology/s3', t: '闭集、内部与闭包', d: '闭集是开集的补。内部往里收，闭包往外撑，夹在中间的边界含孤立点。' },
  { to: '/topology/s4', t: '连续映射', d: '开集的原像仍是开集，与 $\\varepsilon$-$\\delta$ 是同一句话；双向连续的映射叫同胚。' },
  { to: '/topology/s5', t: '度量空间与序列收敛', d: '距离诱导开球，开球诱导拓扑；收敛写成不等式，柯西列与完备化补上缺的极限点。' },
];
const con = [
  { to: '/topology/c1', t: '连通性', d: '空间拆不成两块不交非空开集就是连通，闭包与连续像都保连通。' },
  { to: '/topology/c2', t: '道路连通', d: '任意两点之间有一条连续道路。它强于连通，正弦曲线把它与连通分开。' },
  { to: '/topology/c3', t: '紧致性', d: '任给开覆盖都能抽出有限子覆盖，闭区间是原型，连续像是紧的。' },
  { to: '/topology/c4', t: '商空间与常见曲面', d: '认点得到商空间，正方形按箭头粘边，粘出环面、克莱因瓶与莫比乌斯带。' },
];
const inv = [
  { to: '/topology/v1', t: '欧拉示性数', d: '$V-E+F$ 与切法无关，可定向闭曲面上等于 $2-2g$，亏格给洞计数。' },
  { to: '/topology/v2', t: '基本群', d: '闭环路按同伦分类，拼接给出群结构，圆周的基本群是整数加群。' },
  { to: '/topology/v3', t: '覆叠空间', d: '局部均匀摊开的多层空间，直线覆叠圆周，覆叠度等于基本群中某子群的指数。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const higher = higherOf('topology');
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const built = spn.length + con.length + inv.length;
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
