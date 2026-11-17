<template>
  <ChPage :cur="4" no="面4" base="/spacegeom/p" :chapters="SP_CHAPTERS"
    title="空间距离"
    sub="空间里三种距离都能写成「投影」：点到平面是沿法向的投影长度，点到直线是垂直于方向的投影长度，异面直线是沿公垂线方向的投影长度。公式各不相同，做法只有一条——先找垂直方向，再把连线投影上去。"
    :toc="[{ id: 'd-point', t: '点到平面的距离' }, { id: 'd-line', t: '点到直线的距离' }, { id: 'd-skew', t: '异面直线的距离' }, { id: 'd-app', t: '体积法与两个关系' }, { id: 'd-pit', t: '取绝对值与垂足' }]">
    <div class="note good">设平面 <Katex tex="\pi:Ax+By+Cz+D=0" />，点 <Katex tex="P_0(x_0,y_0,z_0)" />，则 <Katex tex="P_0" /> 到 <Katex tex="\pi" /> 的距离为
      <Katex tex="d=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}." display /></div>

    <h3 class="sec" id="d-point">点到平面的距离</h3>
    <p>公式的来历与面1 的点法式连着：过 <Katex tex="P_0" /> 作平面的垂线，垂足记作 <Katex tex="Q" />，则 <Katex tex="\overrightarrow{QP_0}" /> 与法向量 <Katex tex="\vec n" /> 共线，长度就是 <Katex tex="\overrightarrow{QP_0}" /> 在 <Katex tex="\vec n" /> 方向上的投影：</p>
    <p style="text-align:center"><Katex tex="d=|\overrightarrow{QP_0}|=\frac{|\vec n\cdot\overrightarrow{P_1P_0}|}{|\vec n|}," display /></p>
    <p>其中 <Katex tex="P_1" /> 是平面上任意一点。把 <Katex tex="\vec n\cdot\overrightarrow{P_1P_0}" /> 展开，正好剩 <Katex tex="Ax_0+By_0+Cz_0+D" />——平面上的那部分相消，只剩下点的坐标与常数项。</p>
    <p>绝对值不能省：分子是带符号的「偏离量」，符号说明点落在法向量的哪一侧。求两平行平面之间的距离也可以用它：在一张平面上任取一点，算到另一张平面的距离。</p>
    <div class="board-wrap">
      <BoardMount :factory="createDist3d" />
      <div class="cap">图 面4 · <b>空间距离</b>：三档共用一枚橙色动点 <Katex tex="P" />（三个坐标各一枚滑块）。① 点到平面——法向倾角与方位角给平面，常数 <Katex tex="c" /> 让平面平移，紫色段是 P 沿法向落下的垂线段，绿点 Q 是垂足，Q 处标直角；② 点到直线——方向角与方位角转金色直线，Q 是 P 在直线上的投影，判读同时给出投影长度；③ 异面直线——两条直线的方向与外端点高度可控，紫色段连接两条直线上的最近点，方向为 <Katex tex="\vec s_1\times\vec s_2" />。看点：第一档把 P 的坐标调到平面方程成立的位置，垂线段缩成一点、距离归零；第二档把方向角抬到 <Katex tex="90^\circ" /> 附近，直线趋于竖直，垂足滑向 <Katex tex="P_0" /> 的正下方；第三档让两个方向角相等，公垂线段变成两平行线之间的定长。</div>
    </div>

    <h3 class="sec" id="d-line">点到直线的距离</h3>
    <p>设直线过 <Katex tex="P_0" />、方向向量为 <Katex tex="\vec s" />，点 <Katex tex="P" /> 到它的距离用叉积写成</p>
    <p style="text-align:center"><Katex tex="d=\frac{|\overrightarrow{P_0P}\times\vec s|}{|\vec s|}." display /></p>
    <p>分子是 <Katex tex="\overrightarrow{P_0P}" /> 与 <Katex tex="\vec s" /> 张成的平行四边形的面积，分母是底边长 <Katex tex="|\vec s|" />，商就是高——而这条高正是点到直线的垂线段。这与向3 的面积公式是同一个式子，只是换了一种读法。</p>
    <p>另一个写法先求垂足：把 <Katex tex="\overrightarrow{P_0P}" /> 投影到 <Katex tex="\vec s" /> 上得到垂足 <Katex tex="Q" />，再用两点距离</p>
    <p style="text-align:center"><Katex tex="d=\sqrt{|\overrightarrow{PP_0}|^2-\left(\mathrm{proj}_{\vec s}\overrightarrow{P_0P}\right)^2}." display /></p>
    <p>两种写法各有场合：坐标已知时叉积一步到位，垂足坐标也要时用投影。画板里紫色段与直角标记走的是后一条路径，读数与叉积公式逐位核对。</p>

    <h3 class="sec" id="d-skew">异面直线的距离</h3>
    <p>设两条异面直线分别过 <Katex tex="P_1,P_2" />、方向为 <Katex tex="\vec s_1,\vec s_2" />。公垂线同时垂直于两个方向，方向取 <Katex tex="\vec s_1\times\vec s_2" />；距离是连线 <Katex tex="\overrightarrow{P_1P_2}" /> 在公垂线方向上的投影：</p>
    <p style="text-align:center"><Katex tex="d=\frac{|(\vec s_1\times\vec s_2)\cdot\overrightarrow{P_1P_2}|}{|\vec s_1\times\vec s_2|}." display /></p>
    <p>分子是混合积，绝对值等于两方向与连线张成的平行六面体的体积；分母 <Katex tex="|\vec s_1\times\vec s_2|" /> 是以两方向为边的平行四边形面积。体积除以底面积得高，这条高就是两异面直线之间的距离——向4 的「混合积给体积」在这里正好收口。</p>
    <p>两直线相交时混合积为零，公式给出 <Katex tex="d=0" />，与「相交直线有公共点」一致；两直线平行时叉积为零向量，公式失效，改用两平行线距离的做法：在一条上任取一点，算它到另一条的距离。</p>

    <h3 class="sec" id="d-app">体积法与两个关系</h3>
    <p>在三棱锥里求高时，两种做法会给出同一个数。体积法先用混合积求体积、再除以底面积；距离法先写底面所在平面的方程、再代点得距离。前者不必写出平面方程，后者只做一次代数代入，选哪一种看已知条件。</p>
    <p>点到直线的距离与异面直线距离还有一层关系：把两条异面直线各自平移到过同一点，距离不变；或者把其中一条沿公垂线方向平移，直到与另一条相交。面3 的「位置关系」与本节的距离是同一条链的两端，判定之后才有距离可谈。</p>
    <p>三种距离统一起来的一句话：<strong>点到平面是投影到法向，点到直线是投影到公垂方向，异面直线是投影到两方向的公垂线</strong>。方向找对了，剩下的都是数量积。</p>

    <h3 class="sec" id="d-pit">取绝对值与垂足</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：距离算出负数就改写。</strong>点到平面的公式分子要加绝对值，符号只说明点在法向量的哪一侧。距离恒非负，答案写成负数一律重新核对。</li>
        <li><strong>提示二：点到直线漏掉了除以 <Katex tex="|\vec s|" />。</strong>叉积的模是平行四边形的面积，不是高。方向向量没取成单位向量时，分母的模不能省。</li>
        <li><strong>提示三：异面直线距离的分子写成了 <Katex tex="\vec s_1\cdot\vec s_2" />。</strong>分子是<strong>混合积</strong>，三条向量各取一条：两个方向加一条连线。写成两条方向的内积就没有体积可言。</li>
        <li><strong>提示四：以为垂足一定落在两条线段上。</strong>公式算的是到两条<strong>直线</strong>的距离，垂足可能落在给定线段的延长线外。题目若只问线段之间的最近距离，还要把垂足位置夹回端点比较一次。</li>
      </ul>
    </div>
    <p>回收与预告：点、直线、平面的方程与度量到此齐全。子专题三转到曲面：平面是「一次」曲面，把方程的次数升到二次，就得到柱面、锥面、旋转曲面与二次曲面，它们在立体几何和圆锥曲线两处都已经露过面。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createDist3d } from '../../../boards/spacegeom/plane/dist3d.js';
import { SP_CHAPTERS } from './spnav.js';
</script>
