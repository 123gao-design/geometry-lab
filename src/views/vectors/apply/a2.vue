<template>
  <ChPage :cur="2" no="应2" base="/vectors/y" :chapters="VY_CHAPTERS"
    title="向量在物理中的应用"
    sub="力、速度、位移都是既有大小又有方向的量，相加时走平行四边形而不是直接加长度。合成按向量加法算，分解按正交方向拆开，做功则用数量积。物理里的三类问题，对应向量里的三条公式。"
    :toc="[{ id: 'a2-force', t: '力的合成与分解' }, { id: 'a2-motion', t: '速度与位移' }, { id: 'a2-work', t: '功' }, { id: 'a2-pit', t: '合力、分解方向与功的符号' }]">
    <div class="note good">物理量只要既有大小又有方向，并且相加时服从平行四边形法则，就能当作向量来算。力是最典型的一个：两个力作用在同一点，它们的合力是以这两支为邻边的平行四边形的对角线。反过来，一个力也可以沿选定的两个方向拆成几支，拆开后的几支合起来仍等于原来的力。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPhysVec" />
      <div class="cap">图 应2 · <b>力的正交分解机</b>：金色箭头是合力 <Katex tex="\vec F" />，蓝、绿两支是沿两个坐标轴的分力，灰色虚线把合力围成矩形。看点：拖动 <Katex tex="\theta" /> 滑块，水平分力随余弦变、竖直分力随正弦变，两支的数值一涨一落；④ 把 <Katex tex="\theta" /> 推到 90°，水平分力归零，合力全部落到竖直方向。合力大小滑块单独改长度时，两个分力按同一比例伸长，方向不变。</div>
    </div>

    <h3 class="sec" id="a2-force">力的合成与分解</h3>
    <p>两支力 <Katex tex="\vec F_1" />、<Katex tex="\vec F_2" /> 作用在同一点，合力是 <Katex tex="\vec F=\vec F_1+\vec F_2" />，画出来就是平行四边形法则：以两支为邻边作平行四边形，从公共起点出发的对角线即合力。只有两支同向时，合力大小才等于两支大小相加；夹角越大，合力越短。</p>
    <p>分解是合成的逆运算，答案不唯一，选哪两个方向由题目决定。最常用的是<strong>正交分解</strong>：取两条互相垂直的轴，把力拆成</p>
    <p style="text-align:center"><Katex tex="F_x=|\vec F|\cos\theta,\qquad F_y=|\vec F|\sin\theta," /></p>
    <p>其中 <Katex tex="\theta" /> 是 <Katex tex="\vec F" /> 与 <Katex tex="x" /> 轴正方向的夹角。图 应2 的蓝、绿两支就是这两个分量，虚线矩形保证它们的和仍然回到 <Katex tex="\vec F" /> 的终点。正交的好处是两个方向互不影响，列方程时可以逐方向分开写。</p>

    <h3 class="sec" id="a2-motion">速度与位移</h3>
    <p>速度与位移的叠加用的是向量加法。小船渡河时，船相对于水的速度记作 <Katex tex="\vec v_1" />，水流速度记作 <Katex tex="\vec v_2" />，船相对于岸的速度是 <Katex tex="\vec v=\vec v_1+\vec v_2" />；位移同样合成，<Katex tex="\vec s=\vec v\,t" />。</p>
    <p>两个分运动相互独立：渡河时间只由垂直于河岸的那个分速度与河宽决定，水流快慢不改变这个时间；但水流会把船向下游推，登陆点因此偏移。这类题先在图上把速度分解成沿河岸与垂直河岸两支，再对各方向单独列式，比直接画合速度清楚。</p>

    <h3 class="sec" id="a2-work">功</h3>
    <p>恒力做的功是力与位移的数量积：</p>
    <p style="text-align:center"><Katex tex="W=\vec F\cdot\vec s=|\vec F||\vec s|\cos\theta," /></p>
    <p><Katex tex="\theta" /> 是力与位移的夹角。夹角为锐角时 <Katex tex="\cos\theta>0" />，力做正功；直角时数量积为零，这个力不做功；钝角时做负功，比如摩擦力。功是一个数，没有方向，这一点与力、速度都不同，而数量积恰好把两支向量换成一个数。</p>

    <h3 class="sec" id="a2-pit">合力、分解方向与功的符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：合力大小不等于两个力大小相加。</strong>两支成角时要用平行四边形或余弦定理算，<Katex tex="|\vec F_1+\vec F_2|^2=|\vec F_1|^2+|\vec F_2|^2+2\vec F_1\cdot\vec F_2" />。只有夹角为零、方向相同时才有 <Katex tex="|\vec F_1+\vec F_2|=|\vec F_1|+|\vec F_2|" />。</li>
        <li><strong>提示二：正交分解的两个方向必须互相垂直。</strong>沿斜面的题就取沿斜面与垂直斜面，不能取两条成任意角的直线再套余弦、正弦。方向选好后，每个分力都要标清正负，与轴反向的分量带负号。</li>
        <li><strong>提示三：功里的夹角是力与位移的夹角。</strong>不是力与水平方向的夹角，也不是位移与竖直方向的夹角。图 应2 里的 <Katex tex="\theta" /> 是合力与 <Katex tex="x" /> 轴的角度，如果位移沿 <Katex tex="x" /> 轴，它就是功的公式里的那个角；换成别的位移方向要重新找。</li>
        <li><strong>提示四：渡河时间与水流速度无关。</strong>水流只改变合速度的大小与方向，不改变垂直河岸的分速度。把这两件事混在一起，会得出「水越急过河越慢」的错误结论。</li>
      </ul>
    </div>
    <p>回收与预告：向2 的平行四边形法则在这里成了力的合成，积1 的投影与积2 的坐标式在这里成了正交分解与功。子专题四到此收尾。下一子专题走进复数：它把平面上的点写成 <Katex tex="a+b\mathrm{i}" />，加法对应平移，乘法对应旋转与伸缩，向量里学到的坐标运算会原样出现。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPhysVec } from '../../../boards/vectors/apply/physvec.js';
import { VY_CHAPTERS } from './vynav.js';
</script>
