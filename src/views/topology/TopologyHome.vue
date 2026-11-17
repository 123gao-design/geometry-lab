<template>
  <div>
    <div class="chapter-head">
      <h1>拓扑学基础</h1>
      <p class="sub">只保留远近与连续，不管长度角度。开集公理把「挨得近」写成三条规则，连续映射与同胚随之定义；连通与紧致回答空间整不整块、能不能被有限盖住；商空间把正方形粘成环面与克莱因瓶。最后两样东西用来分辨形状：欧拉示性数数顶点、棱、面，基本群看闭环路怎么绕洞。</p>
      <div class="readall">学习进度：已读 {{ readAll }} / {{ total }} 章</div>
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

    <div class="note good">拓展阅读：① 商空间把「粘合」写成映射，环面、克莱因瓶与射影平面都由正方形的粘边方式决定；② 基本群记录闭环路绕洞的方式，<Katex tex="\pi_1(S^1)=\mathbb Z" /> 是最简单的一例；③ 闭曲面分类给出「可定向按亏格、不可定向按交叉帽数」的完整清单，欧拉示性数是判别量；④ 布劳威尔不动点定理与压缩映射原理说明连续本身就能保证存在性；⑤ 海涅—博雷尔定理把「紧致」与「有界闭」在欧氏空间里等同起来。全站定理总表见顶栏<strong>速查</strong>。</div>
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
const readAll = cnt(spn) + cnt(con) + cnt(inv);
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
