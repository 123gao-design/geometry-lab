<template>
  <div>
    <div class="chapter-head">
      <h1>空间解析几何</h1>
      <p class="sub">把平面几何抬到三维：向量先把方向与长度写成坐标，数量积、向量积与混合积各读一个量；平面与直线由法向量与方向向量定出，距离与夹角一律化为向量运算；曲面与曲线把方程画成形状，用截痕一层层读出来。</p>
      <div class="readall">学习进度：已读 {{ readAll }} / {{ total }} 章</div>
    </div>

    <h3 class="sec">子专题一 · 空间向量<span class="prog">已读 {{ cnt(vec) }}/{{ vec.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in vec" :key="i" class="topic-card" :to="c.to">
        <span class="tag">向{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 平面与直线<span class="prog">已读 {{ cnt(pla) }}/{{ pla.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in pla" :key="i" class="topic-card" :to="c.to">
        <span class="tag">面{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 曲面与曲线<span class="prog">已读 {{ cnt(sur) }}/{{ sur.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in sur" :key="i" class="topic-card" :to="c.to">
        <span class="tag">曲{{ i + 1 }}</span><span v-if="isRead(c.to)" class="tag done">✓</span>
        <h3>{{ c.t }}</h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">拓展阅读：① 点到平面的距离 <Katex tex="\dfrac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}" /> 与异面直线的公垂线都由投影给出；② 两直线的夹角取方向向量，线面角取方向向量与法向量的余角；③ 旋转曲面、柱面与锥面可由母线绕轴或沿准线平移生成，方程中缺少的变量正是轴向；④ 柱坐标与球坐标是极坐标的两种三维推广，对称性明显的区域用它计算更省事；⑤ 二次曲面按二次型的符号分类（椭球、双曲面、抛物面），与线性代数模块的二次型相接。全站定理总表见顶栏<strong>速查</strong>。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js';

const vec = [
  { to: '/spacegeom/v1', t: '空间直角坐标与向量', d: '三条坐标轴把空间分成八个卦限，向量写成坐标之后，加减与数乘都按分量进行。' },
  { to: '/spacegeom/v2', t: '数量积', d: '$\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta$，夹角与投影都从它读出，垂直当且仅当点积为零。' },
  { to: '/spacegeom/v3', t: '向量积', d: '方向由右手法则定，模等于两条向量张成的平行四边形面积，垂直于两者。' },
  { to: '/spacegeom/v4', t: '混合积', d: '等于平行六面体的体积，三向量共面当且仅当混合积为零。' },
];
const pla = [
  { to: '/spacegeom/p1', t: '平面方程与法向量', d: '点法式定平面，一般式读法向量，截距式看三个轴上的落点。' },
  { to: '/spacegeom/p2', t: '空间直线的方程', d: '定点加方向向量写成对称式，参数式让点随 $t$ 移动；两张平面的交线也是一条直线。' },
  { to: '/spacegeom/p3', t: '空间中的位置关系', d: '平行、垂直、相交与异面各有判据，夹角一律由方向向量或法向量算出。' },
  { to: '/spacegeom/p4', t: '空间距离', d: '点到平面、点到直线、异面直线三类距离，各归于一次向量运算。' },
];
const sur = [
  { to: '/spacegeom/s1', t: '柱面与锥面', d: '曲线沿方向平移得柱面，过定点收缩得锥面；缺变量的方程是柱面，齐次方程是锥面。' },
  { to: '/spacegeom/s2', t: '旋转曲面', d: '母线绕轴转出纬圆，方程里出现 $x^2+y^2$ 这一整块就说明它绕 $z$ 轴而生。' },
  { to: '/spacegeom/s3', t: '二次曲面', d: '椭球、单叶与双叶双曲面、两种抛物面，按平方项的符号分类，用截痕法读形状。' },
  { to: '/spacegeom/s4', t: '空间曲线', d: '参数方程给点随参数动，一般方程写成两张曲面的联立，投影落到三个坐标面上。' },
];
const cnt = arr => arr.filter(c => READ.set.has(c.to)).length;
const readAll = cnt(vec) + cnt(pla) + cnt(sur);
const total = vec.length + pla.length + sur.length;
</script>
<style scoped>
.note.good { margin-top: 26px; }
</style>
