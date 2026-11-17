<template>
  <ChPage :cur="3" no="标3" base="/solid/c" :chapters="SC_CHAPTERS"
    title="距离与夹角的坐标算法"
    sub="位置关系一旦写成坐标，距离与夹角就都变成向量运算。点到平面的距离是投影向量的长度，两条直线的夹角由方向向量的数量积给出，直线与平面的夹角由方向向量与法向量的数量积给出，二面角由两个法向量的数量积给出。四条公式，一条主线：把几何量投影到某个方向上。"
    :toc="[{ id: 'c3-basis', t: '坐标运算回顾' }, { id: 'c3-distance', t: '点到平面的距离' }, { id: 'c3-angle', t: '两条直线、直线与平面' }, { id: 'c3-dihedral', t: '二面角' }, { id: 'c3-pit', t: '正弦与余弦' }]">
    <div class="note good">四条公式的骨架是<strong>投影</strong>。向量 <Katex tex="\vec a" /> 在单位向量 <Katex tex="\vec e" /> 方向上的投影长度是 <Katex tex="\left|\vec a\cdot\vec e\right|" />；夹角是投影与斜边之比。<strong>求距离用投影</strong>，<strong>求夹角用三角比</strong>：线线角与二面角写成余弦，线面角写成正弦，因为法向量与直线垂直，两者的夹角恰好与线面角互余。</div>

    <h3 class="sec" id="c3-basis">坐标运算回顾</h3>
    <p>设 <Katex tex="\vec a=(a_1,a_2,a_3)" />、<Katex tex="\vec b=(b_1,b_2,b_3)" />，则</p>
    <p style="text-align:center"><Katex tex="\vec a\pm\vec b=(a_1\pm b_1,\ a_2\pm b_2,\ a_3\pm b_3),\qquad \lambda\vec a=(\lambda a_1,\lambda a_2,\lambda a_3)," display /></p>
    <p style="text-align:center"><Katex tex="\vec a\cdot\vec b=a_1b_1+a_2b_2+a_3b_3,\qquad \left|\vec a\right|=\sqrt{a_1^2+a_2^2+a_3^2}." display /></p>
    <p>两条直线垂直等价于方向向量点积为零；两条直线平行等价于方向向量成比例。这两条判定把位1 的定理换成了算式，正方体里的大部分证明都可以直接算出来，不必再反复构造辅助线。</p>

    <h3 class="sec" id="c3-distance">点到平面的距离</h3>
    <p>设平面 <Katex tex="\alpha" /> 过点 <Katex tex="A" />、法向量为 <Katex tex="\vec n" />，点 <Katex tex="P" /> 在平面外。把 <Katex tex="\overrightarrow{AP}" /> 投影到法向量方向上，投影的长度就是点 <Katex tex="P" /> 到平面的距离：</p>
    <p style="text-align:center"><Katex tex="d=\frac{\left|\overrightarrow{AP}\cdot\vec n\right|}{\left|\vec n\right|}." display /></p>
    <p>若平面写成 <Katex tex="Ax+By+Cz+D=0" />，点 <Katex tex="P(x_0,y_0,z_0)" /> 到平面的距离公式为</p>
    <p style="text-align:center"><Katex tex="d=\frac{\left|Ax_0+By_0+Cz_0+D\right|}{\sqrt{A^2+B^2+C^2}}." display /></p>
    <p>垂足 <Katex tex="H" /> 的坐标也能一并算出：<Katex tex="H=P-\dfrac{\overrightarrow{AP}\cdot\vec n}{\left|\vec n\right|^2}\vec n" />，再把 <Katex tex="H" /> 代回平面方程验算。正方体中 <Katex tex="A_1(0,0,1)" /> 到平面 <Katex tex="x+y-z=1" /> 的距离是 <Katex tex="\tfrac{|0+0-1-1|}{\sqrt3}=\tfrac{2\sqrt3}{3}\approx1.15" />，垂足为 <Katex tex="\left(\tfrac23,\tfrac23,\tfrac13\right)" />。</p>

    <h3 class="sec" id="c3-angle">两条直线、直线与平面</h3>
    <p>两条异面直线或相交直线所成的角，由方向向量 <Katex tex="\vec u" />、<Katex tex="\vec v" /> 给出：</p>
    <p style="text-align:center"><Katex tex="\cos\theta=\frac{\left|\vec u\cdot\vec v\right|}{\left|\vec u\right|\left|\vec v\right|},\qquad \theta\in\left(0,\frac{\pi}{2}\right]." display /></p>
    <p>绝对值不可省：方向向量可以任意取反向，取反后点积变号，但夹角不变。这也是唯一一处「公式里自带绝对值」的地方。</p>
    <p>直线 <Katex tex="l" /> 的方向向量为 <Katex tex="\vec u" />，平面 <Katex tex="\alpha" /> 的法向量为 <Katex tex="\vec n" />，设直线与平面所成角为 <Katex tex="\theta" />，则 <Katex tex="\vec u" /> 与 <Katex tex="\vec n" /> 的夹角为 <Katex tex="\tfrac{\pi}{2}-\theta" />，于是</p>
    <p style="text-align:center"><Katex tex="\sin\theta=\frac{\left|\vec u\cdot\vec n\right|}{\left|\vec u\right|\left|\vec n\right|},\qquad \theta\in\left[0,\frac{\pi}{2}\right]." display /></p>
    <p>线面角用正弦，是这套公式里最容易被写错的一处。若直线在平面内或与平面平行，<Katex tex="\vec u\cdot\vec n=0" />，<Katex tex="\theta=0" />；若直线垂直于平面，<Katex tex="\vec u" /> 与 <Katex tex="\vec n" /> 平行，正弦取到 <Katex tex="1" />，<Katex tex="\theta=90^\circ" />。</p>

    <h3 class="sec" id="c3-dihedral">二面角</h3>
    <p>两个平面的法向量为 <Katex tex="\vec n_1" />、<Katex tex="\vec n_2" />，二面角的平面角 <Katex tex="\theta" /> 与两个法向量的夹角相等或互补。按数量积算出</p>
    <p style="text-align:center"><Katex tex="\cos\left\langle\vec n_1,\vec n_2\right\rangle=\frac{\vec n_1\cdot\vec n_2}{\left|\vec n_1\right|\left|\vec n_2\right|}" display /></p>
    <p>之后由图形判断二面角是锐角还是钝角：观感为锐角取绝对值，观感为钝角取相反的符号。二面角可以取到 <Katex tex="[0,\pi]" />，这是它与其他角不同的地方。</p>
    <p>用向量证明平行与垂直也是同一套操作：要证线面平行，证方向向量与法向量点积为零，再说明直线不在平面内；要证面面垂直，证两个法向量点积为零。坐标算完之后，最后一步总是回到几何图形上确认位置，向量给出的是必要条件，位置由图形补齐。</p>

    <h3 class="sec" id="c3-pit">正弦与余弦</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：线面角写成余弦。</strong>线面角的正弦才是 <Katex tex="\dfrac{\left|\vec u\cdot\vec n\right|}{\left|\vec u\right|\left|\vec n\right|}" />。把正弦写成余弦，算出的角与实际角互余。</li>
        <li><strong>提示二：线线角忘了取绝对值。</strong>方向向量取反后点积变号，余弦为负，但所成角不会为钝角。公式里的绝对值正是为此而设。</li>
        <li><strong>提示三：二面角直接取法向量夹角。</strong>法向量的夹角与二面角可能互补。先算出余弦，再看图形确定锐钝，最后才写角的度数。</li>
        <li><strong>提示四：点到平面的距离漏掉分母。</strong>公式的分母是 <Katex tex="\sqrt{A^2+B^2+C^2}" />，也就是法向量的模。法向量没有单位化时，这个分母不能丢。</li>
      </ul>
    </div>
    <div class="board-wrap">
      <BoardMount :factory="createVecAngleLab" />
      <div class="cap">图 标3 · <b>距离与夹角的坐标算法</b>：坐标轴钉在正方体的顶点 <Katex tex="A" /> 上，三档分别算点到平面的距离、两条直线所成角、直线与平面所成角。徽章按「向量一、向量二、结果」的顺序给出原始数据与答案：第一档的两个向量是平面内的 <Katex tex="\overrightarrow{BD}" /> 与 <Katex tex="\overrightarrow{BC_1}" />，叉乘得法向量；第二档两个向量都是方向向量，读出余弦；第三档一条是方向向量、一条是法向量，读出的数是正弦。拖动画面旋转，辅助线与垂足的位置不变。</div>
    </div>
    <p>回收：标1 给了坐标系与点的坐标，标2 给了平面方程与法向量，标3 用它们算距离与夹角。立体几何的四个子专题到此收束——认识几何体给出图形，体积与表面积给出度量，位置关系给出判定，坐标系把这些判定与度量统一成算式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createVecAngleLab } from '../../../boards/solid/coords/vecanglelab.js';
import { SC_CHAPTERS } from './cnav.js';
</script>
