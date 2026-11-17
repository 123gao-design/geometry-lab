<template>
  <ChPage :cur="3" no="积3" base="/vectors/i" :chapters="VI_CHAPTERS"
    title="极化恒等式与模的运算"
    sub="把 a 与 b 的加减平移到同一个平行四边形上，两条对角线长度的平方差与平方和各自对应一个恒等式。前者把点积换回长度，后者把四条边的平方和与两条对角线连起来。"
    :toc="[{ id: 'i3-id', t: '两个恒等式' }, { id: 'i3-mid', t: '中线与平行四边形' }, { id: 'i3-use', t: '模的运算' }, { id: 'i3-pit', t: '模不能相加' }]">
    <div class="note good" id="i3-id">对任意两个向量 <Katex tex="\vec a,\vec b" />，有 <Katex tex="\vec a\cdot\vec b=\dfrac{|\vec a+\vec b|^2-|\vec a-\vec b|^2}{4}" />；又有 <Katex tex="|\vec a+\vec b|^2+|\vec a-\vec b|^2=2(|\vec a|^2+|\vec b|^2)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPolarId" />
      <div class="cap">图 积3 · <b>极化恒等式</b>：金色一支是 <Katex tex="\vec a+\vec b" />，紫色一支是 <Katex tex="\vec a-\vec b" />，两者正是平行四边形 OACB 的两条对角线。看点：② 把两支拖成互相垂直，两条对角线等长，平行四边形变成矩形；③、④ 拖到共线，其中一条对角线缩成零，恒等式退化为模的加减。</div>
    </div>

    <h3 class="sec" id="i3-id">两个恒等式</h3>
    <p>展开 <Katex tex="|\vec a+\vec b|^2=(\vec a+\vec b)\cdot(\vec a+\vec b)=|\vec a|^2+2\vec a\cdot\vec b+|\vec b|^2" />；同理 <Katex tex="|\vec a-\vec b|^2=|\vec a|^2-2\vec a\cdot\vec b+|\vec b|^2" />。两式相减，平方项全部消去，只剩 <Katex tex="4\vec a\cdot\vec b" />；两式相加，交叉项全部消去，得到 <Katex tex="2(|\vec a|^2+|\vec b|^2)" />。两个恒等式就这么从展开里出来，没有额外假设。</p>
    <p>相减那一条叫极化恒等式：它用两条对角线的长度表示点积，不经过夹角与余弦。当两支的坐标不易读、但两条对角线的长度好求时，这一式最省事。相加那一条给出的是平行四边形四边平方和与对角线和的关系，古代把它写成「四边平方和等于两对角线平方和」。</p>

    <h3 class="sec" id="i3-mid">中线与平行四边形</h3>
    <p>相加式换个看法就是中线公式。在 <Katex tex="\triangle OAB" /> 中，取 <Katex tex="AB" /> 的中点为 <Katex tex="M" />，则 <Katex tex="\overrightarrow{OM}=\dfrac{\vec a+\vec b}{2}" />、<Katex tex="\overrightarrow{AB}=\vec a-\vec b" />。代进相加式得 <Katex tex="4|\overrightarrow{OM}|^2+|\overrightarrow{AB}|^2=2(|\vec a|^2+|\vec b|^2)" />，即中线长的平方加上半底边的平方等于两腰平方和的一半。</p>
    <p>图 积3 里两条对角线的交点正是 <Katex tex="AB" /> 的中点，也是 <Katex tex="OC" /> 的中点。两支向量与对角线之间的这层对应，让向量式与平面几何里的中线、矩形判定接得上：对角线相等推出矩形，对角线互相垂直推出菱形，两条都能从这里的两个恒等式翻出来。</p>

    <h3 class="sec" id="i3-use">模的运算</h3>
    <p>模的平方展开写成 <Katex tex="|\vec a+\vec b|^2=|\vec a|^2+|\vec b|^2+2\vec a\cdot\vec b" />，其中 <Katex tex="\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta" />。夹角一变，交叉项从 <Katex tex="2|\vec a||\vec b|" /> 变到 <Katex tex="-2|\vec a||\vec b|" />，所以同向时和向量最长、反向时最短，垂直时取中间值。</p>
    <p>要求的若是 <Katex tex="|\lambda\vec a+\mu\vec b|" />，照平方展开即可，交叉项的符号由两系数的乘积决定。含参数的模最值题多半先平方成一个关于参数的二次式，再配方求顶点——这条路子在不等式模块的二次函数最值里已经练过。</p>

    <h3 class="sec" id="i3-pit">模不能相加</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="|\vec a+\vec b|\ne|\vec a|+|\vec b|" />。</strong>等号只在同向时成立，其余情形都小于右边。图 积3 的 ② 两支垂直，<Katex tex="|\vec a+\vec b|" /> 只有 <Katex tex="\sqrt{|\vec a|^2+|\vec b|^2}" />。</li>
        <li><strong>提示二：平方展开的交叉项是两倍点积，不是两倍模之积。</strong>写成 <Katex tex="|\vec a+\vec b|^2=|\vec a|^2+|\vec b|^2+2|\vec a||\vec b|" /> 只在同向时对；一般情况下要保留 <Katex tex="2\vec a\cdot\vec b" />。</li>
        <li><strong>提示三：极化恒等式分母是 4，不是 2。</strong>由 <Katex tex="|\vec a+\vec b|^2-|\vec a-\vec b|^2=4\vec a\cdot\vec b" /> 解出点积时要除 4。图 积3 的参数徽章同时列出 <Katex tex="\vec a\cdot\vec b" /> 与 <Katex tex="4\vec a\cdot\vec b" />，可以对照。</li>
        <li><strong>提示四：两条对角线对应的是和向量与差向量，不是两条邻边。</strong>金色一支从公共起点出发，指向 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 的终点平移而成的那一点；紫色一支接在 <Katex tex="\vec b" /> 的终点与 <Katex tex="\vec a" /> 的终点之间。把邻边当成对角线代入恒等式，结果全错。</li>
      </ul>
    </div>
    <p>回收与预告：积1 的定义、积2 的坐标式在这里合到同一个平面上，模与点积可以互推。数量积与度量到此告一段落，下一子专题取向量的应用：用基向量表示各边，把平行、垂直与长度条件换成数乘关系与点积方程。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarId } from '../../../boards/vectors/inner/polarid.js';
import { VI_CHAPTERS } from './vinav.js';
</script>
