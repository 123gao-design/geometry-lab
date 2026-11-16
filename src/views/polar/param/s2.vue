<template>
  <ChPage :cur="2" no="参2" base="/polar/s" :chapters="PS_CHAPTERS"
    title="直线与圆的参数方程"
    sub="直线的参数方程把方向写成 (cosα, sinα)，参数 t 就是有向距离；圆的参数方程把半径转到圆心角 θ 上，横纵坐标分别是圆心坐标加上 r cosθ 与 r sinθ。两者都比普通方程多出一层几何含义，用对了能直接读出距离与角度。"
    :toc="[{ id: 's2-line', t: '直线的参数方程' }, { id: 's2-circle', t: '圆的参数方程' }, { id: 's2-t', t: 't 与 θ 的几何意义' }, { id: 's2-pit', t: '单位方向与角度混用' }]">
    <div class="note good">过定点 <Katex tex="P_0(x_0,y_0)" />、倾斜角为 <Katex tex="\alpha" /> 的直线，参数方程写成
      <span style="display:block;text-align:center"><Katex tex="\begin{cases}x=x_0+t\cos\alpha,\\ y=y_0+t\sin\alpha,\end{cases}" /></span>
      其中 <Katex tex="t" /> 是参数，<Katex tex="|t|" /> 等于 <Katex tex="P_0P" /> 的长度，<Katex tex="t" /> 的符号表示 <Katex tex="P" /> 在 <Katex tex="P_0" /> 的哪一侧。圆心为 <Katex tex="C(x_0,y_0)" />、半径为 <Katex tex="r" /> 的圆，参数方程写成 <Katex tex="x=x_0+r\cos\theta" />、<Katex tex="y=y_0+r\sin\theta" />，<Katex tex="\theta" /> 是圆心角。</div>

    <h3 class="sec" id="s2-line">直线的参数方程</h3>
    <div class="board-wrap">
      <BoardMount :factory="createParamLine" />
      <div class="cap">图 参2a · <b>直线的参数方程</b>：蓝色定点 <Katex tex="P_0" />、金色方向线与橙色方向角 <Katex tex="\alpha" />。看点：拖动 <Katex tex="P" /> 沿直线走，右侧徽章实时读出 <Katex tex="t" /> 与 <Katex tex="|t|" />；把 <Katex tex="t" /> 滑到负值，<Katex tex="P" /> 越过 <Katex tex="P_0" /> 落到反向延长线上，金色箭头随之变红，但 <Katex tex="|t|" /> 仍是两点间的距离。</div>
    </div>
    <p>把直线写成参数式，从倾斜角出发最直接。直线上任意一点 <Katex tex="P" /> 相对定点 <Katex tex="P_0" /> 的位移沿方向 <Katex tex="(\cos\alpha,\sin\alpha)" />，长度记作 <Katex tex="t" />，于是</p>
    <p style="text-align:center"><Katex tex="\overrightarrow{P_0P}=t(\cos\alpha,\sin\alpha)." display /></p>
    <p>把坐标拆开就是 <Katex tex="x=x_0+t\cos\alpha" />、<Katex tex="y=y_0+t\sin\alpha" />。方向向量 <Katex tex="(\cos\alpha,\sin\alpha)" /> 的模为 <Katex tex="1" />，所以 <Katex tex="t" /> 不是「若干个方向向量」，而是实实在在的有向长度。</p>
    <p>消去 <Katex tex="t" /> 得普通方程。当 <Katex tex="\alpha\ne90^\circ" /> 时，由第一式得 <Katex tex="t=(x-x_0)/\cos\alpha" />，代入第二式得 <Katex tex="y-y_0=\tan\alpha\,(x-x_0)" />；当 <Katex tex="\alpha=90^\circ" /> 时，<Katex tex="\cos\alpha=0" />，直线为 <Katex tex="x=x_0" />。参数式在两种情形下统一，不必为正切无定义另开一例。</p>

    <h3 class="sec" id="s2-circle">圆的参数方程</h3>
    <div class="board-wrap">
      <BoardMount :factory="createParamCircle" />
      <div class="cap">图 参2b · <b>圆的参数方程</b>：蓝色圆心 <Katex tex="C" />、金色圆周、橙色圆心角 <Katex tex="\theta" />，虚线是半径。看点：拖动 <Katex tex="P" /> 绕圆心转，<Katex tex="\theta" /> 从 <Katex tex="C" /> 指向右侧的方向逆时针量起；半径滑块一改，整条圆随之缩放，而 <Katex tex="\theta" /> 的读数不变。</div>
    </div>
    <p>圆心在 <Katex tex="C(x_0,y_0)" />、半径为 <Katex tex="r" /> 的圆，圆上任一点 <Katex tex="P" /> 可以看成从圆心出发、长度 <Katex tex="r" />、方向角 <Katex tex="\theta" /> 的向量终点：</p>
    <p style="text-align:center"><Katex tex="\overrightarrow{CP}=(r\cos\theta,\ r\sin\theta)." display /></p>
    <p>把圆心坐标加上去，就是 <Katex tex="x=x_0+r\cos\theta" />、<Katex tex="y=y_0+r\sin\theta" />。两式分别减 <Katex tex="x_0" />、<Katex tex="y_0" /> 后平方相加，利用 <Katex tex="\cos^2\theta+\sin^2\theta=1" />，得普通方程 <Katex tex="(x-x_0)^2+(y-y_0)^2=r^2" />。</p>
    <p><Katex tex="\theta" /> 的取值范围通常取 <Katex tex="[0,2\pi)" />。转满一圈，圆闭合；只取半圈，得到半圆。参数范围决定曲线的哪一段，这一点与参1 的结论一致。</p>

    <h3 class="sec" id="s2-t">t 与 θ 的几何意义</h3>
    <p>直线参数式里的 <Katex tex="t" /> 与圆参数式里的 <Katex tex="\theta" /> 都不是「凑出来的中间量」，各自对应一个几何对象。<Katex tex="t" /> 是有向距离：<Katex tex="|t|=|P_0P|" />，符号区分方向；两只点 <Katex tex="P_1" />、<Katex tex="P_2" /> 对应的参数为 <Katex tex="t_1" />、<Katex tex="t_2" /> 时，<Katex tex="|P_1P_2|=|t_1-t_2|" />。这条性质让直线参数式在求弦长、判断中点时格外省事。</p>
    <p>圆的 <Katex tex="\theta" /> 是圆心角：从圆心指向 <Katex tex="x" /> 轴正方向开始，逆时针为正。它与点 <Katex tex="P" /> 的极角一般不同。极角从极点 <Katex tex="O" /> 量起，圆心角从圆心 <Katex tex="C" /> 量起，两者的顶点不同，不能互换。</p>

    <h3 class="sec" id="s2-pit">单位方向与角度混用</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：方向向量不是单位向量时，<Katex tex="t" /> 不再是距离。</strong>把直线写成 <Katex tex="x=x_0+at" />、<Katex tex="y=y_0+bt" />，若 <Katex tex="(a,b)" /> 的模不是 <Katex tex="1" />，则 <Katex tex="|t|" /> 只是方向向量的倍数，真实距离是 <Katex tex="|t|\sqrt{a^2+b^2}" />。要保留「<Katex tex="t" /> 就是距离」这一性质，方向向量必须取 <Katex tex="(\cos\alpha,\sin\alpha)" />。</li>
        <li><strong>提示二：<Katex tex="t" /> 的符号被忽略。</strong><Katex tex="t" /> 可正可负，<Katex tex="|t|" /> 才是长度。两点间距离用 <Katex tex="|t_1-t_2|" />，不是 <Katex tex="t_1-t_2" />；中点对应的参数是 <Katex tex="(t_1+t_2)/2" />，不是 <Katex tex="(|t_1|+|t_2|)/2" />。</li>
        <li><strong>提示三：圆心角当成极角。</strong>圆的参数式里 <Katex tex="\theta" /> 的顶点是圆心，极角的顶点是极点。只有当圆心与极点重合时，两者才一致；圆心一挪，同一个 <Katex tex="\theta" /> 对应的极角就变了。</li>
        <li><strong>提示四：直线参数式里的 <Katex tex="\alpha" /> 与圆参数式里的 <Katex tex="\theta" /> 混为一谈。</strong>前者是直线的倾斜角，后者是圆上的圆心角，取值范围与几何含义都不同。同一题里出现两个角，先分清各自属于哪条曲线。</li>
      </ul>
    </div>
    <p>回收与预告：直线的参数 <Katex tex="t" /> 与圆的参数 <Katex tex="\theta" /> 都有清楚的几何含义，这一点在参3 的圆锥曲线里换成离心角与 <Katex tex="t" />，含义就没有这么直观了。参3 会逐条写出椭圆、双曲线、抛物线的参数式，并指出各自参数的来历。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createParamLine } from '../../../boards/polar/param/paramline.js';
import { createBoard as createParamCircle } from '../../../boards/polar/param/paramcircle.js';
import { PS_CHAPTERS } from './psnav.js';
</script>
