<template>
  <ChPage :cur="2" no="S2" base="/functions/s" :chapters="S_CHAPTERS"
    title="单调性与导数：导数判据" sub="f′ 的符号定增减 —— 上栏 f 按 f′ 符号分色，下栏 f′ 同框对照，同一 x 处可直接读切线斜率。"
    :toc="[{ id: 's2-claim', t: '判据（图 S2）' }, { id: 's2-bridge', t: '从定义到判据的桥' }, { id: 's2-steps', t: '求单调区间三步' }, { id: 's2-warn', t: '两处易错' }]">
    <div class="note good" id="s2-claim"><strong>导数判据</strong>：设 f(x) 在区间 I 上可导 —— 若在 I 上恒有 <Katex tex="f'(x)&gt;0" />，则 f 在 I 上单调递增；若恒有 <Katex tex="f'(x)&lt;0" />，则单调递减。几何读法：<Katex tex="f'(x)" /> 是切线斜率 —— 每一点的方向都朝上（或朝下），整段图象就只升（或只降）。图 S2 把这句话画成上下两栏图象对照：f 的<strong>绿段 = <Katex tex="f'>0" />，红段 = <Katex tex="f'<0" /></strong>，临界点金色标记，下栏 <Katex tex="f'" /> 曲线与之逐点对应。</div>
    <div class="board-wrap">
      <BoardMount :factory="createDerSign" />
      <div class="cap">图 S2 · <b>导数判据阅读机</b>：上栏 f 的图象按 f′ 的符号分色（绿增红减、临界点金色），下栏 f′ 的图象同框对照 —— 一根扫描线贯穿上下两栏、对应同一 x：切线斜率、f′ 曲线上的落点、分色换段，三件事同步。① 看一个临界点换段；② x³−3x 看两处换段；③ 1/x 两支全红、f′ 全在 x 轴下方 —— S1 的跨缺口陷阱在此有了判据表述。看点：拖切点穿过临界点的一瞬，切线转过水平、f′ 穿过零、颜色换段，三件事同时发生。</div>
    </div>

    <h3 class="sec" id="s2-bridge">从定义到判据的桥</h3>
    <p>S1 的定义要"任取两点作差"，判据却只看一个点 —— 桥是<strong>弦斜率</strong>。对任意 <Katex tex="x_1<x_2" />：</p>
    <Katex tex="\frac{f(x_2)-f(x_1)}{x_2-x_1}" display />
    <p>是连接两点的弦的斜率；增 <Katex tex="\iff" /> 一切弦斜率为正。让 <Katex tex="x_2" /> 无限靠近 <Katex tex="x_1" />，弦的极限位置就是切线，弦斜率的极限就是导数：</p>
    <Katex tex="f'(x)=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h}" display />
    <p>于是"f′ 处处为正"继承了"一切弦斜率为正"，判据成立。极限的严格手续在 V1 补齐 —— 这里先直接使用它，导数在这门课里的角色是<strong>工具</strong>：替"任取两点"的直接验证提供机械化手段。</p>

    <h3 class="sec" id="s2-steps">求单调区间三步</h3>
    <ul>
      <li><strong>第一步：确定定义域。</strong>判据的结论最后要写回定义域内的区间，跳过这一步，③ 类函数全盘皆输；</li>
      <li><strong>第二步：求 <Katex tex="f'" />，解不等式。</strong>解 <Katex tex="f'(x)>0" /> 与 <Katex tex="f'(x)<0" />（通常是解一元二次或简单不等式，临界点就是 <Katex tex="f'" /> 的零点）；</li>
      <li><strong>第三步：写区间、标注临界点。</strong>端点处 <Katex tex="f'=0" /> 一般可并入（不改变单调性），临界点在图上就是转折点 —— 图 S2 的金点。</li>
    </ul>

    <h3 class="sec" id="s2-warn">两处易错</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="f'=0" /> 不等于"在此转折"。</strong><Katex tex="f(x)=x^3" /> 在 <Katex tex="x=0" /> 处 <Katex tex="f'(0)=0" />，但 <Katex tex="f'" /> 在 0 两侧同为正，全轴递增，0 处并没有转折 —— 判据看的是<strong>符号区间</strong>，不是孤立的零点。反方向也不成立：增函数可以有 <Katex tex="f'=0" /> 的点。</li>
        <li><strong>提示二：定义域优先于判据。</strong><Katex tex="1/x" /> 的 <Katex tex="f'(x)=-1/x^2" /> 恒负，直接写"f 在 R 上递减"就错 —— 判据只能在定义域的区间上说话，结论必须按支写。此外 <Katex tex="f'\ge 0" /> 只保证"不减"（如常数函数），要证"增"需要 <Katex tex="f'>0" /> 或"<Katex tex="f'\ge 0" /> 且零点不充满区间"。</li>
      </ul>
    </div>
    <p>回收与预告：S1 的定义与本章判据是同一件事的两个口径 —— 大题里"用定义证明"与"用导数证明"都是得分做法，后者在 V1 之后成为主要方法；E7 对勾函数极值将用判据与均值不等式双证（两证互相印证）；R4 的牛顿法用切线替弦去找零点 —— 本章的切线在后面还会反复使用。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDerSign } from '../../../boards/functions/properties/dersign.js';
import { S_CHAPTERS } from './snav.js';
</script>
