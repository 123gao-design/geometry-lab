<template>
  <div>
    <div class="chapter-head">
      <h1>高等几何（射影几何）</h1>
      <p class="sub">把平行线看成在无穷远处相交，射影平面就多了一条无穷远线。齐次坐标让点与线共用一套三元组，射影变换保持共线与交比；点线互换得到对偶原理，二次曲线则给每点配一条极线。帕斯卡定理把六个点的位置锁定成一条直线，最后用变换群把射影、仿射与欧氏排成一列——群越大，能说的话越少。</p>
      <div class="readall">已上线 {{ built }} / {{ total }} 章：射影平面 5/5，二次曲线 3/3，变换群与几何 3/3</div>
    </div>

    <h3 class="sec">子专题一 · 射影平面<span class="prog">已读 {{ cnt(pln) }}/{{ pln.length }} · 5 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in pln" :key="i" class="topic-card" :to="c.to">
        <span class="tag">射{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 二次曲线<span class="prog">已读 {{ cnt(con) }}/{{ con.length }} · 3 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in con" :key="i" class="topic-card" :to="c.to">
        <span class="tag">曲{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 变换群与几何<span class="prog">已读 {{ cnt(grp) }}/{{ grp.length }} · 3 章</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in grp" :key="i" class="topic-card" :to="c.to">
        <span class="tag">换{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">十一块画板各管一件事。射影平面五台：齐次坐标机拖动仿射点，滑块缩放 <Katex tex="\lambda" />，切到无穷远档后平行线在箭头处会合；射影变换机把方格网与单位正方形一起拉成梯形，灭点位置随参数滑动；交比机上下两排各放四个点，换平移、倒数、分式三种变换，两块徽章始终显示同一个数；对偶机左右并排放一张四点六线图与一张四线六点图，按组对照；德萨格与帕普斯机左右分置，拖顶点与中心看共线轴不动，再拖交叉点看帕普斯线转，共线行列式恒为零。二次曲线三台：配极机拖动 <Katex tex="P" />，黄色极线与两条紫色切线同步移动，<Katex tex="P" /> 进到圆内极线就跑到圆外；分类机在椭圆、抛物线、双曲线之间切换，右侧读与无穷远线的交点数；帕斯卡机拖动六个角滑块，黄色帕斯卡线始终穿过三个交点，一切到对偶版就是外切六边形的三线共点。变换群三台：变换群机拿字母 F 做被试，八个按钮读出元素、阶与逆元；分层机让同一个正方形在四级变换下依次变形；无穷远线位置机拖动一条红线，同一条圆锥曲线在椭圆与双曲线之间连续改口。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';
import { higherOf } from '../../lib/higherplan.js';
import Katex from '../../components/Katex.vue';

const pln = [
  { to: '/projgeom/p1', t: '齐次坐标', d: '$(x,y,z)$ 与 $(\\lambda x,\\lambda y,\\lambda z)$ 是同一点，$z=0$ 收下所有无穷远点。' },
  { to: '/projgeom/p2', t: '射影变换', d: '保持共线的可逆线性变换，矩阵只定到相差一个倍数，平行线在灭点会合。' },
  { to: '/projgeom/p3', t: '交比', d: '四点坐标之比，在射影变换下不变，长度与角度都失效之后接手「量」的角色。' },
  { to: '/projgeom/p4', t: '对偶原理', d: '点与线整体互换，共线与共点成对出现，一条定理自动带出一条对偶定理。' },
  { to: '/projgeom/p5', t: '德萨格定理与帕普斯定理', d: '透视三角形推共线轴，交叉六点推帕普斯线；两条定理定出射影平面的强弱。' },
];
const con = [
  { to: '/projgeom/c1', t: '配极与极点极线', d: '二次曲线把每点配成一条极线、每条线配成一个极点，关联关系对称。' },
  { to: '/projgeom/c2', t: '二次曲线的射影分类', d: '按矩阵的秩分成非退化与退化，再按与无穷远线的实交点数分成三类。' },
  { to: '/projgeom/c3', t: '帕斯卡定理与布里安雄定理', d: '内接六边形三组对边的交点共线；对偶过去是外切六边形三线共点。' },
];
const grp = [
  { to: '/projgeom/g1', t: '变换群', d: '可逆变换对复合封闭、有幺元与逆元，几何研究群作用下的不变量与轨道。' },
  { to: '/projgeom/g2', t: '爱尔兰根纲领', d: '一门几何对应一个变换群，射影、仿射、相似、欧氏逐层加限制。' },
  { to: '/projgeom/g3', t: '从射影到欧氏', d: '指定一条无穷远线得到仿射层级，它的位置决定圆锥曲线的仿射类型。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const higher = higherOf('projgeom');
const total = higher.groups.reduce((s, g) => s + g.items.length, 0);
const built = pln.length + con.length + grp.length;
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
