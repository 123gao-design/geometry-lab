<template>
  <div>
    <div class="chapter-head">
      <h1>三角函数与三角形</h1>
      <p class="sub">从任意角与弧度制起步：单位圆给出定义、函数线给出形象、同角关系给出内部表达式；再一路走过诱导公式、图象与变换、和差倍角积和差的全套恒等变换，反三角函数反向求解完成「给值求角」，收束于解三角形与综合应用 —— 全程配可拖动的元素实验台。</p>
      <div class="readall">学习进度：已读 {{ totalRead() }} / 23 章（十一大子专题 · 23 章全部上线）</div>
    </div>

    <h3 class="sec">子专题一 · 任意角与弧度制<span class="prog">已读 {{ cnt(bs, '/trig/b') }}/{{ bs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in bs" :key="i" class="topic-card" :to="'/trig/b' + (i + 1)">
        <span class="tag">B{{ i + 1 }}</span><span v-if="isRead('/trig/b' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题二 · 任意角的三角函数<span class="prog">已读 {{ cnt(us, '/trig/u') }}/{{ us.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in us" :key="i" class="topic-card" :to="'/trig/u' + (i + 1)">
        <span class="tag">U{{ i + 1 }}</span><span v-if="isRead('/trig/u' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题三 · 诱导公式<span class="prog">已读 {{ cnt(is, '/trig/i') }}/{{ is.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in is" :key="i" class="topic-card" :to="'/trig/i' + (i + 1)">
        <span class="tag">I{{ i + 1 }}</span><span v-if="isRead('/trig/i' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题四 · 图象与性质<span class="prog">已读 {{ cnt(ws, '/trig/w') }}/{{ ws.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ws" :key="i" class="topic-card" :to="'/trig/w' + (i + 1)">
        <span class="tag">W{{ i + 1 }}</span><span v-if="isRead('/trig/w' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题五 · 图象变换<span class="prog">已读 {{ cnt(fs, '/trig/f') }}/{{ fs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in fs" :key="i" class="topic-card" :to="'/trig/f' + (i + 1)">
        <span class="tag">F{{ i + 1 }}</span><span v-if="isRead('/trig/f' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题六 · 和差公式<span class="prog">已读 {{ cnt(ms, '/trig/m') }}/{{ ms.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ms" :key="i" class="topic-card" :to="'/trig/m' + (i + 1)">
        <span class="tag">M{{ i + 1 }}</span><span v-if="isRead('/trig/m' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题七 · 倍角与升降幂<span class="prog">已读 {{ cnt(ns, '/trig/n') }}/{{ ns.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ns" :key="i" class="topic-card" :to="'/trig/n' + (i + 1)">
        <span class="tag">N{{ i + 1 }}</span><span v-if="isRead('/trig/n' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题八 · 积化和差与辅助角<span class="prog">已读 {{ cnt(qs, '/trig/q') }}/{{ qs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in qs" :key="i" class="topic-card" :to="'/trig/q' + (i + 1)">
        <span class="tag">Q{{ i + 1 }}</span><span v-if="isRead('/trig/q' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题九 · 反三角函数<span class="prog">已读 {{ cnt(hs, '/trig/h') }}/{{ hs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in hs" :key="i" class="topic-card" :to="'/trig/h' + (i + 1)">
        <span class="tag">H{{ i + 1 }}</span><span v-if="isRead('/trig/h' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题十 · 解三角形<span class="prog">已读 {{ cnt(zs, '/trig/z') }}/{{ zs.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in zs" :key="i" class="topic-card" :to="'/trig/z' + (i + 1)">
        <span class="tag">Z{{ i + 1 }}</span><span v-if="isRead('/trig/z' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <h3 class="sec">子专题十一 · 综合应用<span class="prog">已读 {{ cnt(ks, '/trig/k') }}/{{ ks.length }}</span></h3>
    <div class="chapter-grid">
      <router-link v-for="(c, i) in ks" :key="i" class="topic-card" :to="'/trig/k' + (i + 1)">
        <span class="tag">K{{ i + 1 }}</span><span v-if="isRead('/trig/k' + (i + 1))" class="tag done">✓</span>
        <h3 v-html="texMix(c.t)"></h3>
        <p v-html="texMix(c.d)"></p>
      </router-link>
    </div>

    <div class="note good">阶段一~四 16 章 + 反三角函数 2 章 + 解三角形 3 章 + 综合应用 2 章完结：B 系列立度量（旋转成角、弧长量角），U 系列立定义（坐标定义、函数线、同角对照表），I 系列立化归（镜像五组名不变、互配两组换名），W 系列立图象（正弦滚动展开、余弦平移等价、正切断口），F 系列上旋钮（三旋钮一览、两路顺序与由图反演）；M/N/Q 公式群一条主线 —— 弦长两式推出 cos(α−β)、倍角内接矩形直译、升降幂周期折半、加减消元得积化和差、辅助角两波叠一列；H 系列反向求解 —— 裁主值窗、翻折出 arcsin/arccos/arctan，折叠改判与对偶恒等式完成「给值求角」；Z 系列解三角形完结 —— SSA 铰链数解（比值对照表四条等高即正弦定理）、余弦定理投影分解（修正项的符号由 cosγ 决定）、面积夹角写法与同弦同角对比（S 与 b+c 同在等腰时最大）；K 系列综合完结 —— 方程解机把通解写成「特解+周期·k」的两条通解表达式（|t|&gt;1 超出范围、|t|=1 切线重根、换元收口 [−1,1]）、潮汐建模机四步读参数（残差染色验收、半周期错配使残差显著增大）与辅助角最值（R 管峰高 c 管中线、有界换元是 Z3 达到最大的换元版）。三角模块 23 章至此全部完结，顶栏<strong>速查</strong>总表收录全部核心结论。</div>
  </div>
</template>
<script setup>
import { READ, isRead } from '../../lib/progress.js';
import { texMix } from '../../lib/board.js'; // 卡片标题/简介支持 '$…$' 公式段
const bs = [
  { t: '任意角与终边：正负与 2kπ', d: '旋转成角：逆正顺负；终边相同角 $\\alpha_0+2k\\pi$。' },
  { t: '弧度制：用弧长量角', d: '$\\alpha=s/r$ 与半径无关；$s=\\alpha r$、$S=\\frac{1}{2}\\alpha r^2$。' },
];
const us = [
  { t: '单位圆定义与三角函数线', d: 'P(cos α, sin α)；MP/OM/AT 三条函数线。' },
  { t: '同角三角函数的关系', d: '平方、商数、倒数关系；开方 ± 象限判定。' },
];
const is = [
  { t: '诱导公式：镜像五组', d: '旋转整圈 + 三面镜子：坐标只变号不改名。' },
  { t: '互配两组与奇变偶不变', d: '$\\pi/2\\pm\\alpha$ 坐标对调换名；$k\\pi/2\\pm\\alpha$ 总机一屏拨完。' },
];
const ws = [
  { t: '正弦五点法：单位圆展开', d: '单位圆滚动摊平成波，五点一档。' },
  { t: '余弦：平移等价与五点', d: '$\\cos x=\\sin(x+\\pi/2)$，平移等价。' },
  { t: '正切：断口与周期 π', d: '断口成支，周期 π。' },
];
const fs = [
  { t: '三旋钮：y=Asin(ωx+φ)', d: 'A 管值域、ω 管周期、φ 管起点。' },
  { t: '变换顺序与由图反演', d: '先压缩后平移 vs 先平移后压缩；由图反演。' },
];
const ms = [
  { t: '和差公式：从一根弦说起', d: '弦上两种表达式推出 $\\cos(\\alpha-\\beta)$；sin/tan 派生。' },
];
const ns = [
  { t: '倍角：三形态与面积来源', d: '内接矩形直译 $\\sin 2\\alpha$；$\\cos 2\\alpha$ 一式三面。' },
  { t: '半角与升降幂', d: '降幂周期折半；半角 $\\pm$ 象限判定。' },
];
const qs = [
  { t: '积化和差：加减消元', d: '四积全由和差两行消元读出。' },
  { t: '和差化积与辅助角', d: '两波叠成一列：R 管峰高、φ 管起点。' },
];
const hs = [
  { t: '反函数与主值区间', d: '同高多角 → 裁主值窗，翻折出反函数。' },
  { t: '折叠运算与恒等式', d: 'arcsin∘sin 出窗改判；对偶式合并。' },
];
const zs = [
  { t: '正弦定理与 SSA 解的个数', d: '边比对角正弦恒等；SSA 数解两解互补。' },
  { t: '余弦定理', d: '投影分解；修正项的符号由 $\\cos\\gamma$ 决定。' },
  { t: '面积与范围', d: '$S=\\frac{1}{2}ab\\sin\\gamma$ 达到最大；同弦同角等腰时最大。' },
];
const ks = [
  { t: '已知值求角与三角方程', d: '参考角·象限·写族；通解 = 特解 + 周期·k。' },
  { t: '建模与最值', d: '建模四步读参数；辅助角最值 R 管峰高。' },
];
// 阅读进度角标（响应式：标记后自动刷新）
const cnt = (arr, pfx) => arr.filter((_, i) => READ.set.has(pfx + (i + 1))).length;
const totalRead = () => [...READ.set].filter(p => p.startsWith('/trig/')).length;
</script>
