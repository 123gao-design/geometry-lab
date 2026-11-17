<template>
  <ChPage :cur="2" no="积2" base="/vectors/i" :chapters="VI_CHAPTERS"
    title="坐标运算与夹角、垂直"
    sub="取定直角坐标基底，数量积就是对应分量相乘再相加。这条公式把夹角、垂直、模都变成四则运算：余弦由点积与两个模之比读出，垂直就是点积为零。"
    :toc="[{ id: 'i2-def', t: '坐标公式' }, { id: 'i2-ang', t: '夹角与垂直' }, { id: 'i2-mod', t: '模与距离' }, { id: 'i2-pit', t: '分母为零与符号' }]">
    <div class="note good" id="i2-def">设 <Katex tex="\vec a=(x_1,y_1)" />，<Katex tex="\vec b=(x_2,y_2)" />，则 <Katex tex="\vec a\cdot\vec b=x_1x_2+y_1y_2" />。由此 <Katex tex="\cos\theta=\dfrac{x_1x_2+y_1y_2}{\sqrt{x_1^2+y_1^2}\sqrt{x_2^2+y_2^2}}" />，<Katex tex="\vec a\perp\vec b\iff x_1x_2+y_1y_2=0" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createCoordDot" />
      <div class="cap">图 积2 · <b>坐标形式的数量积</b>：徽章逐项列出两个分量之积再相加，夹角由余弦反算。看点：② 拖成垂直，点积归零、原点处补出直角标记；③ 拖成同向平行，余弦为 1、夹角归零；④ 拖到钝角一侧，点积为负、余弦为负。</div>
    </div>

    <h3 class="sec" id="i2-def">坐标公式</h3>
    <p>直角坐标基底 <Katex tex="\vec i,\vec j" /> 满足 <Katex tex="\vec i\cdot\vec i=\vec j\cdot\vec j=1" />、<Katex tex="\vec i\cdot\vec j=0" />。把 <Katex tex="\vec a=x_1\vec i+y_1\vec j" />、<Katex tex="\vec b=x_2\vec i+y_2\vec j" /> 代入分配律，交叉项因 <Katex tex="\vec i\cdot\vec j=0" /> 全部消去，剩下 <Katex tex="x_1x_2+y_1y_2" />。这条推导只用积1 的三条运算律，没有新东西。</p>
    <p>公式的读法是逐分量相乘再相加：横坐标与横坐标乘，纵坐标与纵坐标乘，两积相加。它把夹角这种几何量交给四则运算处理，后面做题先取坐标再算，多半比画图省事。</p>

    <h3 class="sec" id="i2-ang">夹角与垂直</h3>
    <p>把坐标公式代回余弦定义，得到 <Katex tex="\cos\theta=\dfrac{x_1x_2+y_1y_2}{|\vec a||\vec b|}" />。分子是点积，分母是两个模之积，两者都是实数，余弦随之算出。夹角本身用反余弦取回，取值落在 <Katex tex="[0,\pi]" /> 内，恰好与积1 的夹角规定一致。</p>
    <p>垂直的判据最简：<Katex tex="\vec a\cdot\vec b=0" /> 就是两分量乘积之和为零。前提是两支都非零，否则零向量与任何向量都「垂直」，判据失去意义。与它并列的是平行的坐标判据 <Katex tex="x_1y_2-x_2y_1=0" />——基3 已经从共线定理得到过，两条判据一个管角、一个管方向，别混用。</p>

    <h3 class="sec" id="i2-mod">模与距离</h3>
    <p>取 <Katex tex="\vec b=\vec a" />，<Katex tex="\vec a\cdot\vec a=x_1^2+y_1^2" />，于是 <Katex tex="|\vec a|=\sqrt{x_1^2+y_1^2}" />。两点 <Katex tex="A(x_1,y_1)" />、<Katex tex="B(x_2,y_2)" /> 之间的距离就是 <Katex tex="|\overrightarrow{AB}|" />，代入基2 的坐标差即得距离公式。</p>
    <p>两条定理合起来能算角平分线与投影：单位化之后相加得到角平分线方向，点积除以对方模长得到投影长度。这些运算都不必再回到图上作图。</p>

    <h3 class="sec" id="i2-pit">分母为零与符号</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：夹角公式的分母不能为零。</strong>两支中有一支是零向量时，分母为零，余弦没有定义；此时也不能说夹角是 0 或 90°。题目里出现零向量要先单列。</li>
        <li><strong>提示二：垂直判据是点积为零，不是某一个分量为零。</strong><Katex tex="x_1x_2+y_1y_2=0" /> 可以由两个分量都非零而成立，例如 <Katex tex="(1,1)" /> 与 <Katex tex="(1,-1)" />。看图 积2 的 ②：两个分量都非零，点积却是零。</li>
        <li><strong>提示三：钝角的余弦为负，但余弦为负只说明夹角是钝角。</strong>点积为负时不能推出某个坐标为负，符号出自两个乘积之和而非单个分量。把负号归到某一支的某一分量上，是常见误判。</li>
        <li><strong>提示四：平行与垂直的判据不能互换。</strong>平行看交叉差 <Katex tex="x_1y_2-x_2y_1" />，垂直看点积 <Katex tex="x_1x_2+y_1y_2" />。两式的形状相近，一乘一减、一乘一加，写反了整题的结论都反。</li>
      </ul>
    </div>
    <p>回收与预告：基2 的坐标差在这里接上数量积，模、距离、夹角全部化成算术。积3 换一个角度：不直接算点积，而用两条对角线的长度把它反推出来，这一式在求模与证明恒等式时很省事。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCoordDot } from '../../../boards/vectors/inner/codot.js';
import { VI_CHAPTERS } from './vinav.js';
</script>
