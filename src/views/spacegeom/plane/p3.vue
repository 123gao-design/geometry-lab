<template>
  <ChPage :cur="3" no="面3" base="/spacegeom/p" :chapters="SP_CHAPTERS"
    title="空间中的位置关系"
    sub="两张平面、直线与平面、两条直线，三组关系都能归到「方向向量」与「法向量」的内积、外积上。平行看外积是否为零向量，垂直看内积是否为零，异面看两方向的外积与连线的内积是否为零。判据只有这几条，图形交给画板。"
    :toc="[{ id: 'p3-planes', t: '两平面的位置关系' }, { id: 'p3-lineplane', t: '直线与平面' }, { id: 'p3-lines', t: '两直线与异面直线' }, { id: 'p3-angle', t: '夹角与距离' }, { id: 'p3-pit', t: '判定的四条' }]">
    <div class="note good">设两平面的法向量为 <Katex tex="\vec n_1,\vec n_2" />，直线与平面的方向向量、法向量为 <Katex tex="\vec s,\vec n" />，两直线的方向向量为 <Katex tex="\vec s_1,\vec s_2" />。位置关系全部由三种量读出：外积 <Katex tex="\vec n_1\times\vec n_2" />、<Katex tex="\vec s\times\vec n" />、<Katex tex="\vec s_1\times\vec s_2" /> 是否为零向量；内积是否为零；以及「连线向量」与方向向量的混合积是否为零。</div>

    <h3 class="sec" id="p3-planes">两平面的位置关系</h3>
    <p>两平面的法向量决定一切。若 <Katex tex="\vec n_1\parallel\vec n_2" />，两平面平行或重合，判别方法在面1 已经给出：把两组系数写成 <Katex tex="(A_1,B_1,C_1,D_1)=\lambda(A_2,B_2,C_2,D_2)" />，四元都成同一比例即重合，只有前三元成比例即平行。</p>
    <p>若 <Katex tex="\vec n_1\cdot\vec n_2=0" />，两平面垂直；其余情形相交，交线方向为 <Katex tex="\vec n_1\times\vec n_2" />。这两条判据与平面内两条直线的判据一一对应，只是方向向量换成了法向量：在平面内，两直线平行看方向向量成比例；在空间里，两平面平行看法向量成比例。垂直同样由内积为零判定。</p>
    <p>二面角按法向量夹角的锐角取，公式在下一小节统一给出。</p>

    <h3 class="sec" id="p3-lineplane">直线与平面</h3>
    <p>设直线方向向量为 <Katex tex="\vec s" />、平面法向量为 <Katex tex="\vec n" />，则</p>
    <ul>
      <li><Katex tex="\vec s\cdot\vec n=0" /> 时直线与平面平行，或整条直线落在平面内——再拿直线上一点代进平面方程区分这两种情形。</li>
      <li><Katex tex="\vec s\parallel\vec n" />（即 <Katex tex="\vec s\times\vec n=\vec 0" />）时直线垂直于平面。</li>
      <li>其余情形直线与平面斜交，交点是参数式代入平面方程解出的唯一 <Katex tex="t" />。</li>
    </ul>
    <p>这三种情形与立体几何的判定定理完全对得上：「线面垂直的判定定理」要求直线垂直于平面内两条相交直线，而垂直于两条相交直线等价于平行于它们的法向量；「线面平行的判定定理」要求直线平行于平面内一条直线，而平行于平面内某条直线等价于与法向量垂直。向量判据是这两条定理的坐标版本。</p>
    <div class="board-wrap">
      <BoardMount :factory="createRel3d" />
      <div class="cap">图 面3 · <b>空间位置关系机</b>：三档。① 两平面——两个法向角滑块转动蓝色与绿色平面，第二张平面的偏移另有一枚滑块，徽章读平行、重合或相交，相交时画出金色交线并给出二面角；② 直线与平面——方向角与方位角转直线，法向倾角与方位转平面，斜交时紫色虚线是 <Katex tex="\vec s" /> 在平面内的投影，紫金两线夹角即线面角，垂直时在交点处标出直角；③ 两直线——两条直线的方向可控，徽章区分平行、相交与异面，异面时紫色段即公垂线段并在端点标出直角。看点：第二档把方向角与法向倾角调成相等、方位角也相等，直线立刻转成平面的垂线；第三档把 <Katex tex="P_2" /> 的高度压到某个位置，两条直线从异面变成相交。</div>
    </div>

    <h3 class="sec" id="p3-lines">两直线与异面直线</h3>
    <p>两条直线 <Katex tex="l_1" />（过 <Katex tex="P_1" />、方向 <Katex tex="\vec s_1" />）与 <Katex tex="l_2" />（过 <Katex tex="P_2" />、方向 <Katex tex="\vec s_2" />）的位置关系分三步判断：</p>
    <p><strong>第一步看外积。</strong><Katex tex="\vec s_1\times\vec s_2=\vec 0" /> 时两方向共线，两直线平行或重合——再看 <Katex tex="\overrightarrow{P_1P_2}" /> 是否与 <Katex tex="\vec s_1" /> 共线区分。</p>
    <p><strong>第二步看混合积。</strong>外积不为零时，算 <Katex tex="(\vec s_1\times\vec s_2)\cdot\overrightarrow{P_1P_2}" />。为零说明两条直线落在同一张平面内，必相交；不为零则两方向张成的平面不含连线，两直线<strong>异面</strong>。</p>
    <p><strong>第三步求交点或公垂线。</strong>相交时把 <Katex tex="l_1" />、<Katex tex="l_2" /> 都写成参数式，解二元方程组得交点；异面时公垂线方向为 <Katex tex="\vec s_1\times\vec s_2" />，两个垂足由「最近点对」给出，方法在面4 展开。</p>
    <p>异面直线在立体几何里没有「距离公式」的现成版本，靠向量算是最省力的：混合积给体积、外积的模给底面积，两者相除即高，也就是两异面直线的距离。这条与向4 的「体积除以底面积得高」是同一件事。</p>

    <h3 class="sec" id="p3-angle">夹角与距离</h3>
    <p>三组夹角与两组距离统一写成下表（<Katex tex="\langle\cdot,\cdot\rangle" /> 取锐角，结果落在 <Katex tex="[0,\tfrac\pi2]" /> 或 <Katex tex="[0,\pi]" /> 的相应区间）：</p>
    <ul>
      <li>两直线夹角：<Katex tex="\cos\theta=\dfrac{|\vec s_1\cdot\vec s_2|}{|\vec s_1||\vec s_2|}" />，取锐角或直角。</li>
      <li>直线与平面夹角：<Katex tex="\sin\theta=\dfrac{|\vec s\cdot\vec n|}{|\vec s||\vec n|}" />，取 <Katex tex="[0,\tfrac\pi2]" />。</li>
      <li>两平面二面角：<Katex tex="\cos\theta=\dfrac{|\vec n_1\cdot\vec n_2|}{|\vec n_1||\vec n_2|}" />，取锐角。</li>
      <li>点到平面距离：<Katex tex="d=\dfrac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}" />。</li>
      <li>异面直线距离：<Katex tex="d=\dfrac{|(\vec s_1\times\vec s_2)\cdot\overrightarrow{P_1P_2}|}{|\vec s_1\times\vec s_2|}" />。</li>
    </ul>
    <p>注意第三行与第一行的形式相同、含义不同：直线夹角用方向向量，二面角用法向量。线面角用正弦，因为方向向量与法向量的夹角是线面角的余角。这三处符号最容易写错。</p>

    <h3 class="sec" id="p3-pit">判定的四条</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：由 <Katex tex="\vec s\cdot\vec n=0" /> 直接判直线与平面平行。</strong>还要排除「整条直线在平面内」：代一点进平面方程验算，等式成立时直线落在平面内，此时没有唯一的交点。</li>
        <li><strong>提示二：把异面判据写成两个方向向量不平行。</strong>不平行只说明两方向不共线，两直线仍可能相交。缺的是混合积这一步：连线向量要与两方向共面才算相交。</li>
        <li><strong>提示三：线面角用余弦。</strong>方向向量与法向量的夹角是线面角的余角，余弦给出的通常是另一个角。线面角一律用正弦，或用「先投影再取夹角」的几何写法复核。</li>
        <li><strong>提示四：两直线夹角取到钝角。</strong>直线夹角按定义取 <Katex tex="[0,\tfrac\pi2]" />，公式里必须加绝对值。两平面二面角同理，取法向量夹角的锐角。</li>
      </ul>
    </div>
    <p>回收与预告：位置关系判完之后，最常用的两个数还是距离与夹角。面4 把三种距离拆开算：点到平面、点到直线、异面直线，每一种都对应一条「垂线段」，画板里同屏给出公式与垂足。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createRel3d } from '../../../boards/spacegeom/plane/rel3d.js';
import { SP_CHAPTERS } from './spnav.js';
</script>
