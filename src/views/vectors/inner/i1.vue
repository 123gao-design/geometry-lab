<template>
  <ChPage :cur="1" no="积1" base="/vectors/i" :chapters="VI_CHAPTERS"
    title="数量积的定义与投影"
    sub="向量的加法与数乘仍得到向量，数量积却把两个向量换成一个数。定义里的 |a||b|cosθ 拆成两段读：一段是 a 的长，一段是 b 在 a 方向上的投影。夹角一变，投影可正可负，数也随之变号。"
    :toc="[{ id: 'i1-def', t: '定义与夹角' }, { id: 'i1-proj', t: '投影' }, { id: 'i1-law', t: '运算律' }, { id: 'i1-pit', t: '数不是向量、夹角与约去' }]">
    <div class="note good" id="i1-def">已知两个非零向量 <Katex tex="\vec a" /> 与 <Katex tex="\vec b" />，它们的夹角为 <Katex tex="\theta" />，则 <Katex tex="|\vec a||\vec b|\cos\theta" /> 叫做 <Katex tex="\vec a" /> 与 <Katex tex="\vec b" /> 的<strong>数量积</strong>（内积），记作 <Katex tex="\vec a\cdot\vec b" />。规定零向量与任一非零向量的数量积为 <Katex tex="0" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createDotProj" />
      <div class="cap">图 积1 · <b>数量积与投影</b>：蓝色、橙色两支的夹角标注在徽章里，金色线段是 <Katex tex="\vec b" /> 在 <Katex tex="\vec a" /> 方向上的投影，紫色虚线是 <Katex tex="\vec b" /> 的终点到这条投影的垂线。看点：② 把 <Katex tex="\vec b" /> 拖成与 <Katex tex="\vec a" /> 垂直，投影缩成一点、数量积归零；③ 拖到钝角一侧，金色线段翻到原点另一侧，投影带负号，数量积也变负。</div>
    </div>

    <h3 class="sec" id="i1-def">定义与夹角</h3>
    <p>两个非零向量的夹角规定在 <Katex tex="[0,\pi]" /> 内：把两支箭头移到同一个起点 <Katex tex="O" />，从 <Katex tex="\vec a" /> 转到 <Katex tex="\vec b" /> 所成的角就是 <Katex tex="\theta" />。这个角与转向无关，<Katex tex="\vec a" /> 与 <Katex tex="\vec b" /> 的夹角和 <Katex tex="\vec b" /> 与 <Katex tex="\vec a" /> 的夹角是同一个角。</p>
    <p>数量积的结果是一个实数，不是向量。它的符号由 <Katex tex="\cos\theta" /> 决定：夹角为锐角时为正，直角时为零，钝角时为负。同向时 <Katex tex="\cos\theta=1" />，数量积等于两个模之积；反向时 <Katex tex="\cos\theta=-1" />，数量积等于两个模之积的相反数。</p>
    <p>模可以用数量积写回来：<Katex tex="\vec a\cdot\vec a=|\vec a|^2\cos 0=|\vec a|^2" />，所以 <Katex tex="|\vec a|=\sqrt{\vec a\cdot\vec a}" />。这条在后面算模时反复用到。</p>

    <h3 class="sec" id="i1-proj">投影</h3>
    <p>把 <Katex tex="\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta" /> 换个读法：<Katex tex="|\vec a|\cdot(|\vec b|\cos\theta)" />。括号里的 <Katex tex="|\vec b|\cos\theta" /> 是 <Katex tex="\vec b" /> 在 <Katex tex="\vec a" /> 方向上的<strong>投影</strong>，它在图上就是图 积1 的金色线段，长度带符号——落在 <Katex tex="\vec a" /> 的反方向时取负。</p>
    <p>反过来读也一样：<Katex tex="\vec a\cdot\vec b" /> 等于 <Katex tex="\vec b" /> 的长乘以 <Katex tex="\vec a" /> 在 <Katex tex="\vec b" /> 方向上的投影。两种读法给出的数相同，交换律由此可见。投影为零等价于 <Katex tex="\vec b" /> 的终点落在过原点的垂线上，也就是两支垂直。</p>

    <h3 class="sec" id="i1-law">运算律</h3>
    <p>数量积满足三条规律：交换律 <Katex tex="\vec a\cdot\vec b=\vec b\cdot\vec a" />；对加法的分配律 <Katex tex="\vec a\cdot(\vec b+\vec c)=\vec a\cdot\vec b+\vec a\cdot\vec c" />；数乘可以提到外面，<Katex tex="(\lambda\vec a)\cdot\vec b=\lambda(\vec a\cdot\vec b)" />。这三条与实数的乘法律形式相同，所以多项式展开的写法在数量积里照用。</p>
    <p>有一条与实数不同：数量积不满足结合律。<Katex tex="(\vec a\cdot\vec b)\cdot\vec c" /> 里括号先算出一个数，再与 <Katex tex="\vec c" /> 数乘，结果与 <Katex tex="\vec a\cdot(\vec b\cdot\vec c)" /> 一般不同。写的时候必须保留括号，也不能把两个点号随意挪位。</p>

    <h3 class="sec" id="i1-pit">数不是向量、夹角与约去</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：数量积是数，不是向量。</strong><Katex tex="\vec a\cdot\vec b" /> 的结果没有方向，不能写成箭头；只有单独一个 <Katex tex="\vec a" /> 才带箭头。判据题里把数当成向量去比较方向，是最常见的错。</li>
        <li><strong>提示二：夹角取 <Katex tex="[0,\pi]" />，不取锐角。</strong>两支向量摆成钝角就是钝角，不能按「直线夹角」折成锐角再算。图 积1 的 ③ 与 ④ 两档正是钝角与反向，投影与数量积都用负号。</li>
        <li><strong>提示三：等式两边不能随意约去向量。</strong>由 <Katex tex="\vec a\cdot\vec b=\vec a\cdot\vec c" /> 只能得到 <Katex tex="\vec a\cdot(\vec b-\vec c)=0" />，即 <Katex tex="\vec a" /> 垂直于 <Katex tex="\vec b-\vec c" />，推不出 <Katex tex="\vec b=\vec c" />。约去的条件是把 <Katex tex="\vec a" /> 也除掉，而向量没有除法。</li>
        <li><strong>提示四：<Katex tex="\vec a\cdot\vec b=0" /> 不等于至少一支是零向量。</strong>两支都非零而互相垂直时，数量积同样是零。反过来，由数量积为零判垂直时，要先确认两支都不是零向量。</li>
      </ul>
    </div>
    <p>回收与预告：向2 的三角形法则给出 <Katex tex="\vec a+\vec b" /> 的画法，向3 的数乘给出伸缩；数量积补上长度与夹角这两个度量。积2 把定义搬到坐标里，逐分量相乘再相加；积3 把数量积与两条对角线连起来，模的运算由此成套。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDotProj } from '../../../boards/vectors/inner/dotproj.js';
import { VI_CHAPTERS } from './vinav.js';
</script>
