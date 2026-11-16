<template>
  <ChPage :cur="1" no="复1" base="/vectors/c" :chapters="VC_CHAPTERS"
    title="复数的概念与几何意义"
    sub="在实数里 x²=−1 没有解，添上虚数单位 i 之后就有了解。复数写成 a+bi，两段各管一件事：a 是横坐标，b 是纵坐标，整个复数落在复平面的一个点上。加减、模与共轭都能在这张平面上找到位置。"
    :toc="[{ id: 'c1-i', t: '虚数单位与代数形式' }, { id: 'c1-plane', t: '复平面' }, { id: 'c1-conj', t: '共轭与模' }, { id: 'c1-pit', t: '实虚部、纯虚数与比大小' }]">
    <div class="note good">规定虚数单位 <Katex tex="\mathrm{i}" /> 满足 <Katex tex="\mathrm{i}^2=-1" />。形如 <Katex tex="z=a+b\mathrm{i}" />（<Katex tex="a,b\in\mathbb{R}" />）的数叫做<strong>复数</strong>，<Katex tex="a" /> 叫实部，记作 <Katex tex="\operatorname{Re}z" />；<Katex tex="b" /> 叫虚部，记作 <Katex tex="\operatorname{Im}z" />。注意虚部是实数 <Katex tex="b" />，不是 <Katex tex="b\mathrm{i}" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createComplexPlane" />
      <div class="cap">图 复1 · <b>复平面与共轭</b>：金色向量是 <Katex tex="z" />，横纵虚线把它拆到实轴、虚轴上，长度就是模 <Katex tex="|z|" />；紫色一点是共轭复数，与 <Katex tex="z" /> 关于实轴上下对称。看点：拖动 <Katex tex="Z" /> 沿虚轴走，实部归零、判读变成纯虚数；拖到实轴上，虚部归零，共轭点与自身重合，紫色箭头收进金色箭头里。</div>
    </div>

    <h3 class="sec" id="c1-i">虚数单位与代数形式</h3>
    <p>实数与 <Katex tex="\mathrm{i}" /> 的加减乘除得到的一切数都是复数，标准写法是 <Katex tex="a+b\mathrm{i}" />，其中两项不能合并。实数可以看作虚部为零的复数，虚数指虚部不为零的复数，纯虚数还要再加一条实部为零。</p>
    <p>两个复数相等的判据只有一条：实部与实部相等、虚部与虚部相等。这条判据把一个复数等式拆成两个实数方程，是后面解含参问题的常用手段。复数之间只能谈相等与不相等，不谈大小，因为复平面上的点没有自然的先后顺序。</p>

    <h3 class="sec" id="c1-plane">复平面</h3>
    <p>把实部当作横坐标、虚部当作纵坐标，复数 <Katex tex="a+b\mathrm{i}" /> 就对应平面上的点 <Katex tex="Z(a,b)" />，也对应从原点出发的向量 <Katex tex="\overrightarrow{OZ}" />。这张平面叫<strong>复平面</strong>，横轴叫实轴，纵轴叫虚轴。图 复1 里的金色一支正是这个向量。</p>
    <p>点与向量两种看法各有方便之处：说位置时用点，做加减时用向量。复数的加法与向量的加法完全一致，后面复2 会看到；乘法则多出一层旋转的含义，这是向量所没有的。</p>

    <h3 class="sec" id="c1-conj">共轭与模</h3>
    <p>把虚部换成相反数，得到<strong>共轭复数</strong> <Katex tex="\bar z=a-b\mathrm{i}" />。在图上它是 <Katex tex="Z" /> 关于实轴的镜像点，紫色一支。实数的共轭是自身，纯虚数的共轭是它的相反数。</p>
    <p>原点 <Katex tex="O" /> 到 <Katex tex="Z" /> 的距离叫做复数的<strong>模</strong>，<Katex tex="|z|=\sqrt{a^2+b^2}" />，是勾股定理的直接结果。模是非负实数，与向量长度的地位相同。共轭与模之间还有一条常用关系 <Katex tex="z\bar z=a^2+b^2=|z|^2" />，它把复数乘法变成一个实数，复3 会专门展开。</p>

    <h3 class="sec" id="c1-pit">实虚部、纯虚数与比大小</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：实部与虚部都是实数。</strong>写 <Katex tex="z=a+b\mathrm{i}" /> 时已经默认 <Katex tex="a,b" /> 为实数；题目给出含参式子时，要先说明参数取实数，「虚部」才谈得上。虚部是 <Katex tex="b" />，不是 <Katex tex="b\mathrm{i}" />。</li>
        <li><strong>提示二：纯虚数要两条都满足。</strong>实部为零且虚部不为零，缺一不可。只写「实部为零」会把 <Katex tex="z=0" /> 也放进来，而零是实数。</li>
        <li><strong>提示三：复数不能比大小。</strong>「<Katex tex="z_1>z_2" />」这句话没有意义。只有两个复数都是实数时，才能按实数的大小比较；一般情形只能判断相等或不相等。</li>
        <li><strong>提示四：共轭是逐项换号，不是整体取负。</strong><Katex tex="\bar z=-a-b\mathrm{i}" /> 是错的，正确结果是 <Katex tex="a-b\mathrm{i}" />。图上也能看出来：镜像只翻纵坐标，横坐标不动。</li>
      </ul>
    </div>
    <p>回收与预告：向1 至向3 把向量的画法、坐标与数乘讲完，这一页把复数摆进同一张平面。复2 讲四则运算：加减逐分量，乘法按分配律并记住 <Katex tex="\mathrm{i}^2=-1" />，除法乘共轭把分母化成实数；复3 再把模与共轭的性质系统收拢。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createComplexPlane } from '../../../boards/vectors/complex/complexplane.js';
import { VC_CHAPTERS } from './vcnav.js';
</script>
