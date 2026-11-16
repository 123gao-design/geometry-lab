<template>
  <ChPage :cur="2" no="空2" base="/linalg/s" :chapters="SL_CHAPTERS"
    title="矩阵与三维线性变换"
    sub="三维的情形与平面完全平行地展开：三阶方阵的三列就是三根基向量的像，单位立方体被映成一个平行六面体，行列式是它的有向体积。多出来的一件事是视角——立体图形得转着看才看得清。"
    :toc="[{ id: 's2-cube', t: '单位立方体的像' }, { id: 's2-vol', t: '行列式与有向体积' }, { id: 's2-kind', t: '拉伸、剪切与压扁' }, { id: 's2-pit', t: '三维变换' }]">

    <div class="note good" id="s2-cube">设 <Katex tex="A" /> 是三阶方阵，则 <Katex tex="\vec{x}\mapsto A\vec{x}" /> 是空间到自身的线性变换。三列分别是 <Katex tex="e_1,e_2,e_3" /> 的像；单位立方体 <Katex tex="[0,1]^3" /> 被映成以这三列为棱的平行六面体，其有向体积等于 <Katex tex="\det A" />，体积等于 <Katex tex="|\det A|" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createMap3D" />
      <div class="cap">图 空2 · <b>三维变换机</b>：灰色虚线是原来的单位立方体，六个彩色面是它的像，蓝、橙、绿三支箭头是矩阵三列的方向。看点：拖动画板可绕原点旋转，从不同角度确认像确实是个平行六面体；把「<Katex tex="z" /> 轴倍数」压到 0.1，六个面塌成一块薄片，体积倍数同步趋近于零；「剪切」档里立方体被推斜，而底面积与体积都不变。</div>
    </div>

    <h3 class="sec" id="s2-cube">单位立方体的像</h3>
    <p>与 空1 同理，<Katex tex="T(\vec{x})=x\,T(e_1)+y\,T(e_2)+z\,T(e_3)" /> 说明整个变换由三个落点决定。三个像向量作为棱张成的平行六面体，正是单位立方体的像；反过来，空间里任意一个以原点为顶点的平行六面体，都唯一确定一个三阶方阵。</p>
    <p>图 空2 取的是上三角矩阵 <Katex tex="A=\begin{bmatrix}s_1&amp;k&amp;0\\0&amp;s_2&amp;0\\0&amp;0&amp;s_3\end{bmatrix}" />，它已经够说明问题：<Katex tex="s_1,s_2,s_3" /> 是三个方向的伸缩，<Katex tex="k" /> 是把 <Katex tex="x" /> 往 <Katex tex="y" /> 方向推的剪切量。一般矩阵的像只是把这个平行六面体再整体倾斜一次，棱的条数、面数、平行的对应关系都不变。</p>
    <p>正方体的八个顶点 <Katex tex="(\varepsilon_1,\varepsilon_2,\varepsilon_3)" />（<Katex tex="\varepsilon_i\in\{0,1\}" />）映成八个顶点，十二条棱映成十二条棱。所以「点线面的组合关系」在线性变换下是完整的——这正是立体几何里可以放心对坐标做线性替换的根据。</p>

    <h3 class="sec" id="s2-vol">行列式与有向体积</h3>
    <p>三阶行列式的绝对值就是三个行（或列）向量张成的平行六面体体积，这一点在 行2 已经按「底面积 × 高」算过。于是与二维完全对应：</p>
    <p style="text-align:center"><Katex tex="V_{\text{像}}=|\det A|\cdot V_{\text{原}}" display /></p>
    <p>因为空间可以由单位立方体拼成，任意立体的体积被变换后都乘上同一倍数 <Katex tex="|\det A|" />。符号仍然记录定向：<Katex tex="\det A>0" /> 时右手系仍是右手系，<Katex tex="\det A<0" /> 时空间被照镜子翻了面。图 空2 右栏同时给出按对角线算出的行列式与按混合积 <Katex tex="|p_1\cdot(p_2\times p_3)|" /> 独立复核的体积，两个数应当一致——这条复核在 积4 的向量积一章有完整说明。</p>
    <p><Katex tex="\det A=0" /> 时三列共面，平行六面体压成一块平面薄片，体积为零。此时变换把整个空间压到一张平面上，不同点会重合，逆变换不存在。</p>

    <h3 class="sec" id="s2-kind">拉伸、剪切与压扁</h3>
    <p>三种基本动作各有对应：对角阵 <Katex tex="\mathrm{diag}(s_1,s_2,s_3)" /> 沿三个坐标方向分别伸缩，体积倍数就是三个对角元之积；上三角阵里的 <Katex tex="k" /> 只推斜不改变体积（剪切的行列式仍为 1，图 空2 的「剪切」档可以直接核对数字）；把某个方向压到零则得到降维的变换。</p>
    <p>旋转矩阵在三阶也有：绕 <Katex tex="z" /> 轴转 <Katex tex="\theta" /> 就是把前两行按二阶旋转阵改写、第三行取 <Katex tex="(0,0,1)" />。旋转的行列式恒为 1——转动既不放大也不缩小体积，这一点与平面情形相同。</p>
    <p>复合仍是乘法：先做 <Katex tex="B" /> 再做 <Katex tex="A" /> 等于 <Katex tex="AB" />，且 <Katex tex="\det(AB)=\det A\cdot\det B" />——两次变换的体积倍数相乘，这正是 行2 里那条乘法公式的几何含义。</p>

    <h3 class="sec" id="s2-pit">三维变换</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：体积倍数不带符号。</strong><Katex tex="\det A<0" /> 不是负体积，而是定向翻转。求体积一律取绝对值。</li>
        <li><strong>提示二：三列共面才降维，两列共线还不够。</strong>体积为零的条件是 <Katex tex="\det A=0" />，等价于三列线性相关，而不只是其中两支平行。</li>
        <li><strong>提示三：平行六面体的高要对准底面法向。</strong>按「底面积 × 高」算体积时，高必须垂直于底面，不能取某条棱在竖直方向的投影——用混合积 <Katex tex="p_1\cdot(p_2\times p_3)" /> 能绕开这个易错点。</li>
        <li><strong>提示四：看到的图形有透视错觉。</strong>正交投影下两条空间中不平行的线在屏幕上可能相交。判断位置关系要读坐标，不能只凭屏幕上的交点。这一点与 位2 的异面直线是同一个提醒。</li>
      </ul>
    </div>
    <p>回收与预告：行2 的行列式在这里成了体积倍数，矩2 的乘法在这里成了变换的复合，积4 的混合积成了体积的直接算法——三条线索在三维图里合到一处。下一章把「秩」也搬到图上：三块平面的公共部分只可能是点、直线或空，而这件事由秩的两个数字决定。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMap3D } from '../../../boards/linalg/space/map3d.js';
import { SL_CHAPTERS } from './slnav.js';
</script>
