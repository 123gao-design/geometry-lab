<template>
  <ChPage :cur="2" no="标2" base="/solid/c" :chapters="SC_CHAPTERS"
    title="平面的方程与法向量"
    sub="平面可以由一个点与一条法向量确定，也可以由不在一条直线上的三个点确定。法向量把「垂直」翻译成「点积为零」，于是平面在坐标里写成一次方程 Ax+By+Cz+D=0，方程的三个系数恰好就是法向量的坐标。平面的位置关系、夹角与距离，从此都可以用法向量的运算来判断。"
    :toc="[{ id: 'c2-normal', t: '法向量' }, { id: 'c2-point', t: '点法式与一般式' }, { id: 'c2-intercept', t: '截距式' }, { id: 'c2-three', t: '三点定平面与叉乘' }, { id: 'c2-pit', t: '系数与法向量' }]">
    <div class="note good">一条直线由一个点与一个<strong>方向向量</strong>确定，一个平面由一个点与一个<strong>法向量</strong>确定。方向向量与直线平行，法向量与平面垂直——这两个「向量」是解析几何里反复出现的搭档。平面的方程一定是一次方程，反过来任何三元一次方程都表示一个平面。</div>

    <h3 class="sec" id="c2-normal">法向量</h3>
    <p>如果向量 <Katex tex="\vec n" /> 与平面 <Katex tex="\alpha" /> 垂直，就称 <Katex tex="\vec n" /> 是平面 <Katex tex="\alpha" /> 的一个<strong>法向量</strong>。一个平面的法向量有无穷多个，它们彼此平行，长度可以任意选取。取法向量时只关心方向，因此常把它化成整数坐标或单位向量。</p>
    <p>法向量把垂直关系写成了数量积：若 <Katex tex="\vec n\perp\alpha" />，则平面内任意一条直线的方向向量 <Katex tex="\vec a" /> 都满足 <Katex tex="\vec n\cdot\vec a=0" />。判定一条直线是否与平面垂直，只需验证它与平面内两条相交直线的方向向量点积都为零，这与位1 的判定定理是同一句话。</p>
    <p>求法向量最常用的两步：先在平面内取两个不共线的向量 <Katex tex="\vec a" />、<Katex tex="\vec b" />，再求它们的叉乘</p>
    <p style="text-align:center"><Katex tex="\vec n=\vec a\times\vec b,\qquad \vec n\cdot\vec a=0,\qquad \vec n\cdot\vec b=0." display /></p>
    <p>叉乘的坐标公式为</p>
    <p style="text-align:center"><Katex tex="\vec a\times\vec b=\left(a_2b_3-a_3b_2,\ a_3b_1-a_1b_3,\ a_1b_2-a_2b_1\right)." display /></p>

    <h3 class="sec" id="c2-point">点法式与一般式</h3>
    <p>设平面过点 <Katex tex="P_0(x_0,y_0,z_0)" />，法向量为 <Katex tex="\vec n=(A,B,C)" />。平面上的动点 <Katex tex="P(x,y,z)" /> 满足 <Katex tex="\overrightarrow{P_0P}\cdot\vec n=0" />，展开得<strong>点法式</strong></p>
    <p style="text-align:center"><Katex tex="A(x-x_0)+B(y-y_0)+C(z-z_0)=0." display /></p>
    <p>把常数项合并，就得到<strong>一般式</strong></p>
    <p style="text-align:center"><Katex tex="Ax+By+Cz+D=0,\qquad \vec n=(A,B,C)." display /></p>
    <p>一般式的几个特例值得记牢：<Katex tex="D=0" /> 时平面过原点；<Katex tex="C=0" /> 时法向量在 <Katex tex="xOy" /> 平面内，平面平行于 <Katex tex="z" /> 轴；<Katex tex="A=B=0" /> 时法向量沿 <Katex tex="z" /> 轴，平面平行于 <Katex tex="xOy" /> 平面，方程退化为 <Katex tex="z=" /> 常数。</p>
    <p>两个平面的位置关系只看它们的法向量：法向量平行则两平面平行或重合，法向量垂直则两平面垂直。判断重合要再代一个点进去，判断平行只需比较 <Katex tex="\vec n_1" /> 与 <Katex tex="\vec n_2" /> 是否成比例，且常数项不成同一比例。</p>

    <h3 class="sec" id="c2-intercept">截距式</h3>
    <p>平面与三条坐标轴分别交于 <Katex tex="A(a,0,0)" />、<Katex tex="B(0,b,0)" />、<Katex tex="C(0,0,c)" />，且三个截距都不为零时，平面可以写成</p>
    <p style="text-align:center"><Katex tex="\frac{x}{a}+\frac{y}{b}+\frac{z}{c}=1." display /></p>
    <p>把它化成一般式，得 <Katex tex="bc\,x+ac\,y+ab\,z=abc" />，于是法向量可以取 <Katex tex="\vec n=(bc,ac,ab)" />。原点到平面的距离为</p>
    <p style="text-align:center"><Katex tex="d=\frac{abc}{\sqrt{b^2c^2+a^2c^2+a^2b^2}}=\frac{1}{\sqrt{\dfrac{1}{a^2}+\dfrac{1}{b^2}+\dfrac{1}{c^2}}}." display /></p>
    <p>截距式只在不经过原点、且不与任何一条坐标轴平行时成立。三个截距相等时，平面截三条轴得到等长的线段，三角形 <Katex tex="ABC" /> 是正三角形，此时平面上任意一点的三个坐标之和为定值，方程就是 <Katex tex="x+y+z=a" />。</p>
    <div class="board-wrap">
      <BoardMount :factory="createPlaneEqLab" />
      <div class="cap">图 标2 · <b>平面方程与法向量</b>：平面由三条轴上的截距 <Katex tex="a" />、<Katex tex="b" />、<Katex tex="c" /> 给出，三个滑块各自改一个截距。紫色箭头是从三角形重心画出的法向量，徽章读截距式、法向量坐标与原点到平面的距离。看点：把三个截距推成相等，三角形变成正三角形；只推大 <Katex tex="c" /> 时平面绕 <Katex tex="AB" /> 转，法向量的第三个分量随之变小；拖动画面旋转，法向量与三条截距线始终垂直。</div>
    </div>

    <h3 class="sec" id="c2-three">三点定平面与叉乘</h3>
    <p>不在一条直线上的三个点确定一个平面。设三点为 <Katex tex="P_1" />、<Katex tex="P_2" />、<Katex tex="P_3" />，取 <Katex tex="\vec a=\overrightarrow{P_1P_2}" />、<Katex tex="\vec b=\overrightarrow{P_1P_3}" />，则 <Katex tex="\vec n=\vec a\times\vec b" /> 就是平面的法向量，再代点 <Katex tex="P_1" /> 写出点法式即可。</p>
    <p>用正方体的例子算一遍：取 <Katex tex="B(1,0,0)" />、<Katex tex="D(0,1,0)" />、<Katex tex="C_1(1,1,1)" />，则 <Katex tex="\overrightarrow{BD}=(-1,1,0)" />、<Katex tex="\overrightarrow{BC_1}=(0,1,1)" />，叉乘得 <Katex tex="\vec n=(1,1,-1)" />。代 <Katex tex="B" /> 得平面方程</p>
    <p style="text-align:center"><Katex tex="(x-1)+y-z=0,\qquad\text{即}\quad x+y-z=1." display /></p>
    <p>这条平面在正方体里切出一个三角形 <Katex tex="BDC_1" />，三个顶点是三条棱的中点之外的三个顶点，标3 会用它的法向量算点 <Katex tex="A_1" /> 到平面的距离。叉乘算出的法向量可能带分数，最后把它同乘一个数化成整数即可，方程的等号右边随之同乘。</p>

    <h3 class="sec" id="c2-pit">系数与法向量</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把一般式里的系数顺序搞错。</strong>方程 <Katex tex="Ax+By+Cz+D=0" /> 的法向量是 <Katex tex="(A,B,C)" />，不是 <Katex tex="(A,B,D)" />，常数项 <Katex tex="D" /> 不参与法向量。</li>
        <li><strong>提示二：把「法向量平行」直接当成「平面平行」。</strong>法向量平行时两平面还可能重合。判断重合要代点验证：把其中一个平面上的点代入另一个方程，等号成立就是重合。</li>
        <li><strong>提示三：截距式漏掉条件。</strong>截距式要求三个截距都不为零。平面经过原点或与某条坐标轴平行时，截距式不成立，必须用一般式。</li>
        <li><strong>提示四：叉乘的顺序随意调换。</strong><Katex tex="\vec a\times\vec b=-\vec b\times\vec a" />，顺序颠倒只改法向量的方向，不改变平面。写方程时两种顺序都对，但同一个题里前后要一致。</li>
      </ul>
    </div>
    <p>回收与预告：标2 把平面写成了方程，标3 用这套方程与法向量计算距离和夹角。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPlaneEqLab } from '../../../boards/solid/coords/planeeqlab.js';
import { SC_CHAPTERS } from './cnav.js';
</script>
