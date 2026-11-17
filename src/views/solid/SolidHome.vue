<template>
  <div>
    <div class="chapter-head">
      <h1>立体几何</h1>
      <p class="sub">从平面走进空间。先认几何体：多面体靠面、棱、顶点描述，旋转体靠轴、底面与母线描述；再算度量：柱、锥、台、球的体积与表面积各有公式，台体的式子同时覆盖柱与锥。随后建立空间直角坐标系，把位置关系与度量一律化为三元有序实数组的运算。所有三维图形都支持拖动旋转，各面不同颜色、半透明。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 10 章</div>
    </div>

    <h3 class="sec">子专题一 · 认识空间几何体<span class="prog">已读 {{ cnt(rs) }}/{{ rs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in rs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">体{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 体积与表面积<span class="prog">已读 {{ cnt(ms) }}/3</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ms" :key="i" class="topic-card" :to="c.to">
        <span class="tag">积{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 空间中的位置关系<span class="prog">已读 {{ cnt(ws) }}/2</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ws" :key="i" class="topic-card" :to="c.to">
        <span class="tag">位{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 空间直角坐标系与向量<span class="prog">已读 {{ cnt(cs) }}/3</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in cs" :key="i" class="topic-card" :to="c.to">
        <span class="tag">标{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 空间中的距离与角（点到平面、异面直线、二面角）都可化为向量运算，与「空间向量」模块相接；② 外接球与内切球的球心由到各顶点或各面等距定出，半径常借补形与截面求；③ 截面问题先在平面上画出截线再回到空间，正方体的截面可以是三角形到六边形；④ 祖暅原理「幂势既同则积不容异」是柱锥台体积公式的来源；⑤ 三视图与斜二测直观图把三维图形落到纸上，长对正、高平齐、宽相等是读图的口诀。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import Katex from '../../components/Katex.vue';

const rs = [
  { to: '/solid/r1', t: '多面体', d: '面、棱、顶点三件套；棱柱、棱锥、棱台的定义与性质，简单多面体的 $V-E+F=2$。' },
  { to: '/solid/r2', t: '旋转体', d: '轴、底面、母线三件套；圆柱、圆锥、圆台由矩形、直角三角形、直角梯形旋转而来，球由半圆绕直径旋转而来。' },
];
const ms = [
  { to: '/solid/m1', t: '柱、锥、台的体积与表面积', d: '侧面展开图定侧面积；$V=\\frac{h}{3}(S+S\'+\\sqrt{SS\'})$ 一并覆盖柱、锥、台，棱与圆两套公式并行给出。' },
  { to: '/solid/m2', t: '球的体积、表面积与截面', d: '$S=4\\pi R^2$、$V=\\frac{4}{3}\\pi R^3$；截面圆与球心距离满足 $r^2=R^2-d^2$，外接球与内切球的半径常用结论。' },
  { to: '/solid/m3', t: '组合体、外接球与内切球', d: '拼接与挖切按加减算体积、按外露面算表面积；长方体外接球 $R=\\frac12\\sqrt{a^2+b^2+c^2}$，正四面体两球 $R:r=3:1$。' },
];
const ws = [
  { to: '/solid/w1', t: '平行与垂直', d: '线线、线面、面面的三种位置关系；平行与垂直的判定定理和性质定理，二面角的平面角。正方体之外另配三块平面图示，把判定定理的条件逐条画出来。' },
  { to: '/solid/w2', t: '异面直线与角', d: '异面直线的判定与所成角，平移法与向量法；直线与平面所成的角、最小角定理、点到平面的距离。' },
];
const cs = [
  { to: '/solid/c1', t: '空间直角坐标系与坐标平面', d: '三轴三平面与八个卦限；点的坐标即到三张坐标平面的有向距离，距离公式与中点公式，对称点的写法。' },
  { to: '/solid/c2', t: '平面的方程与法向量', d: '点法式与一般式 $Ax+By+Cz+D=0$；由三点取叉乘得法向量，截距式与三轴围成的三角形。' },
  { to: '/solid/c3', t: '距离与夹角的坐标算法', d: '点到平面的距离 $d=\\frac{|\\overrightarrow{AP}\\cdot\\vec n|}{|\\vec n|}$；线线角、线面角、二面角的余弦与正弦计算。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/solid/')).length;
</script>
