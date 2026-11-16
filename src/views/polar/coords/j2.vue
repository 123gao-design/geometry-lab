<template>
  <ChPage :cur="2" no="极2" base="/polar/j" :chapters="PJ_CHAPTERS"
    title="极坐标与直角坐标互化"
    sub="把极点放在原点、极轴与 x 轴正半轴重合，两套坐标就落在同一张平面上。互化只有两组式子，难点在由直角坐标反求极角：tanθ 只给方向，象限才定最终的值。"
    :toc="[{ id: 'j2-set', t: '建系约定' }, { id: 'j2-p2c', t: '极坐标化直角坐标' }, { id: 'j2-c2p', t: '直角坐标化极坐标' }, { id: 'j2-pit', t: '象限、原点与单位' }]">
    <div class="note good">把极点与直角坐标系的原点重合，极轴与 <Katex tex="x" /> 轴正半轴重合，两种坐标就落在同一张平面上。此时对任意点 <Katex tex="(\rho,\theta)" /> 与 <Katex tex="(x,y)" />，有 <Katex tex="x=\rho\cos\theta,\quad y=\rho\sin\theta" />；反过来 <Katex tex="\rho^2=x^2+y^2" />，<Katex tex="\tan\theta=\dfrac{y}{x}" />（<Katex tex="x\ne 0" />）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPolarTrans" />
      <div class="cap">图 极2 · <b>极坐标与直角坐标互化</b>：金色一支是 <Katex tex="OP" />，橙色弧是极角，横纵虚线是 <Katex tex="P" /> 到两轴的投影，两条投影的长正是 <Katex tex="\rho\cos\theta" /> 与 <Katex tex="\rho\sin\theta" />。看点：拖动 <Katex tex="P" /> 走遍四个象限，互化徽章逐项列出 <Katex tex="x" /> 与 <Katex tex="y" /> 的代入过程，判读会给出该象限下由 <Katex tex="\tan\theta" /> 反求极角的写法；拖到坐标轴上，判读换成无意义的 <Katex tex="\tan\theta" /> 那一支。</div>
    </div>

    <h3 class="sec" id="j2-set">建系约定</h3>
    <p>互化的前提是两套坐标系对得上：极点与原点重合，极轴与 <Katex tex="x" /> 轴正半轴重合，长度单位一致，极角的正方向取逆时针。四条都满足时，图 极2 里的投影关系才成立。</p>
    <p>在这套约定下，点 <Katex tex="P" /> 的横坐标是 <Katex tex="OP" /> 在 <Katex tex="x" /> 轴上的投影，纵坐标是它在 <Katex tex="y" /> 轴上的投影。直角三角形 <Katex tex="OP" /> 与两轴构成的图形里，斜边是 <Katex tex="\rho" />，邻边与对边分别是 <Katex tex="x" /> 与 <Katex tex="y" />，正弦与余弦的定义直接给出互化公式。</p>

    <h3 class="sec" id="j2-p2c">极坐标化直角坐标</h3>
    <p>由 <Katex tex="(\rho,\theta)" /> 求 <Katex tex="(x,y)" /> 只需代入 <Katex tex="x=\rho\cos\theta" /> 与 <Katex tex="y=\rho\sin\theta" />，不需要判断象限，也不会出现多解。例如 <Katex tex="(2,60^\circ)" /> 化为 <Katex tex="x=2\cos60^\circ=1" />、<Katex tex="y=2\sin60^\circ=\sqrt3" />，即 <Katex tex="(1,\sqrt3)" />。</p>
    <p>采用负径约定时，先把 <Katex tex="(-\rho,\theta)" /> 换成 <Katex tex="(\rho,\theta+180^\circ)" /> 再代入，符号自然落进余弦与正弦里。直接代负值也可以，结果相同。</p>

    <h3 class="sec" id="j2-c2p">直角坐标化极坐标</h3>
    <p>反方向要分两步。先由 <Katex tex="\rho=\sqrt{x^2+y^2}" /> 求出极径，取非负值；再由 <Katex tex="\tan\theta=\dfrac{y}{x}" /> 求出极角的参考值，最后按点所在的象限定角。</p>
    <p>四个象限对应四条写法：第一象限 <Katex tex="\theta=\arctan\dfrac{y}{x}" />；第二象限 <Katex tex="\theta=180^\circ-\arctan\dfrac{|y|}{|x|}" />；第三象限 <Katex tex="\theta=180^\circ+\arctan\dfrac{|y|}{|x|}" />；第四象限 <Katex tex="\theta=360^\circ-\arctan\dfrac{|y|}{|x|}" />。图 极2 的判读按象限现场给出这些式子。</p>
    <p>坐标轴上的点要单独处理：<Katex tex="x=0" /> 时 <Katex tex="\tan\theta" /> 无意义，<Katex tex="y>0" /> 取 <Katex tex="90^\circ" />，<Katex tex="y<0" /> 取 <Katex tex="270^\circ" />；<Katex tex="y=0" /> 时 <Katex tex="x>0" /> 取 <Katex tex="0^\circ" />，<Katex tex="x<0" /> 取 <Katex tex="180^\circ" />；原点处 <Katex tex="\rho=0" />，极角任取。</p>

    <h3 class="sec" id="j2-pit">象限、原点与单位</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：只写 <Katex tex="\tan\theta=\dfrac{y}{x}" /> 会丢掉象限。</strong>正切以 <Katex tex="180^\circ" /> 为周期，同一个正切值对应两个方向相反的点。求出参考角后必须回看 <Katex tex="x" />、<Katex tex="y" /> 的符号，确定 <Katex tex="\theta" /> 落在哪一象限。</li>
        <li><strong>提示二：极径取非负。</strong><Katex tex="\rho=\sqrt{x^2+y^2}" /> 开方取算术根。若写成 <Katex tex="\rho=\pm\sqrt{x^2+y^2}" />，一对坐标会派生出两组极坐标，与常用约定不符。</li>
        <li><strong>提示三：坐标轴与原点不要套正切。</strong><Katex tex="x=0" /> 时分母为零，公式失效；原点处极径为零，极角没有确定值。这两类点按上一节的分支单独写。</li>
        <li><strong>提示四：两套坐标的原点与单位要一致。</strong>若题目把极点放在别处，或长度单位不同，先平移、再换算，不能直接套 <Katex tex="x=\rho\cos\theta" />。互化公式只对「极点即原点、极轴即 <Katex tex="x" /> 轴正半轴」这一套约定成立。</li>
      </ul>
    </div>
    <p>回收与预告：向2 的坐标表示与这里的投影是同一条勾股关系，只是把两条轴换成了距离与角。曲1 把互化用到曲线上：圆的方程在极坐标下可以写成只含 <Katex tex="\rho" /> 与 <Katex tex="\theta" /> 的一行式子，直角坐标下的平方和则要展开成两项。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarTrans } from '../../../boards/polar/coords/polartrans.js';
import { PJ_CHAPTERS } from './pjnav.js';
</script>
