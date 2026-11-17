<template>
  <ChPage :cur="4" no="向4" base="/spacegeom/v" :chapters="SV_CHAPTERS"
    title="混合积"
    sub="先作向量积，再与第三条向量作数量积，得到的数叫混合积。它的绝对值等于三条向量张成的平行六面体的体积，符号说明第三条向量落在底面的哪一侧。体积为零就说明三向量共面——四点共面的判据由此一次算出。"
    :toc="[{ id: 'v4-def', t: '混合积的定义' }, { id: 'v4-vol', t: '体积与共面' }, { id: 'v4-det', t: '行列式写法' }, { id: 'v4-app', t: '四点共面与应用' }, { id: 'v4-pit', t: '符号与退化' }]">
    <div class="note good">设 <Katex tex="\vec a" />、<Katex tex="\vec b" />、<Katex tex="\vec c" /> 是三条向量，称 <Katex tex="(\vec a\times\vec b)\cdot\vec c" /> 为它们的<strong>混合积</strong>，记作 <Katex tex="[\vec a\,\vec b\,\vec c]" />。它是一个实数，绝对值等于以这三条向量为棱的平行六面体的体积。</div>

    <h3 class="sec" id="v4-def">混合积的定义</h3>
    <p>先算 <Katex tex="\vec a\times\vec b" />，这个向量垂直于底面并且模等于底面积；再与 <Katex tex="\vec c" /> 作数量积，等于把 <Katex tex="\vec c" /> 投影到法线方向，再乘上底面积：</p>
    <p style="text-align:center"><Katex tex="[\vec a\,\vec b\,\vec c]=(\vec a\times\vec b)\cdot\vec c=|\vec a\times\vec b|\cdot|\vec c|\cos\varphi," display /></p>
    <p>其中 <Katex tex="\varphi" /> 是 <Katex tex="\vec c" /> 与法向量的夹角。而 <Katex tex="|\vec c|\cos\varphi" /> 正是平行六面体的<strong>高</strong>（带符号），所以混合积就是「底面积乘高」，只是把符号一并记了下来。</p>
    <p>混合积对三条向量是轮换对称的：</p>
    <p style="text-align:center"><Katex tex="[\vec a\,\vec b\,\vec c]=[\vec b\,\vec c\,\vec a]=[\vec c\,\vec a\,\vec b]," display /></p>
    <p>任意交换两条向量则变号。这条轮换性质让「先叉后点」的三组括号写法可以随便挑，只要保持循环顺序。</p>

    <h3 class="sec" id="v4-vol">体积与共面</h3>
    <p>底面积 <Katex tex="|\vec a\times\vec b|" /> 恒非负，高是带符号的 <Katex tex="|\vec c|\cos\varphi" />，于是</p>
    <p style="text-align:center"><Katex tex="V=\left|[\vec a\,\vec b\,\vec c]\right|." display /></p>
    <p>混合积的符号只有一层意思：<Katex tex="\vec c" /> 落在 <Katex tex="\vec a\times\vec b" /> 的哪一侧。同侧为正、异侧为负，与体积无关——体积一律取绝对值。</p>
    <p>高为零时体积为零，此时 <Katex tex="\vec c" /> 整条落进 <Katex tex="\vec a" />、<Katex tex="\vec b" /> 张成的平面内，三向量<strong>共面</strong>。反过来，三向量共面时第三条总能写成前两条的线性组合，混合积必为零。于是</p>
    <p style="text-align:center"><Katex tex="\vec a,\ \vec b,\ \vec c\ \text{共面}\iff[\vec a\,\vec b\,\vec c]=0." display /></p>
    <p>这条判据是平面几何「三向量共面」与立体几何「四点共面」之间的桥：把四点写成三组差向量，共面问题就变成一个数是否为零。</p>
    <div class="board-wrap">
      <BoardMount :factory="createSpaceMix" />
      <div class="cap">图 向4 · <b>混合积与平行六面体的体积</b>：底面由金色 <Katex tex="\vec a" /> 与蓝色 <Katex tex="\vec b" /> 张成，紫色 <Katex tex="\vec c" /> 由棱长与倾角 <Katex tex="\theta" /> 两个滑块给出，六个面各自半透明着色，前后棱互相叠压。徽章读混合积、体积与底面积。看点：把 <Katex tex="\theta" /> 从 <Katex tex="0^\circ" /> 推到 <Katex tex="90^\circ" />，紫色棱逐渐倒向底面，体积按余弦规律缩到零，混合积同时归零；把底面夹角 <Katex tex="\varphi" /> 收小，底面积随之缩小，体积与它同比例变化；拖动画面旋转，六个面按深度自然叠压，靠后的面先画。</div>
    </div>

    <h3 class="sec" id="v4-det">行列式写法</h3>
    <p>把三条向量的坐标排成三行，混合积就是三阶行列式：</p>
    <p style="text-align:center"><Katex tex="[\vec a\,\vec b\,\vec c]=\begin{vmatrix}a_1&amp;a_2&amp;a_3\\ b_1&amp;b_2&amp;b_3\\ c_1&amp;c_2&amp;c_3\end{vmatrix}." display /></p>
    <p>行列式的三条初等性质在这里都有几何解释：交换两行变号，对应两条向量交换后体积的符号翻转；两行成比例时行列式为零，对应两条向量共线、底面压扁；把一行的若干倍加到另一行行列式不变，对应「把底面的斜棱推平」不改变体积。</p>
    <p>线代模块的 d1、d2 已经讲过「行列式的绝对值是面积与体积的比例系数」，这里的三阶行列式就是同一件事在三条棱上的展开。两种写法各有用途：坐标已知时用行列式一步算出，几何条件已知时按「底面积乘高」分步算更清楚。</p>

    <h3 class="sec" id="v4-app">四点共面与应用</h3>
    <p>判断四点 <Katex tex="A" />、<Katex tex="B" />、<Katex tex="C" />、<Katex tex="D" /> 是否共面，取同一顶点出发的三条向量</p>
    <p style="text-align:center"><Katex tex="\overrightarrow{AB},\quad \overrightarrow{AC},\quad \overrightarrow{AD}," display /></p>
    <p>算它们的混合积：为零则四点共面（四点落在一个平面内），不为零则构成四面体，其体积为 <Katex tex="\tfrac16\left|[\overrightarrow{AB}\,\overrightarrow{AC}\,\overrightarrow{AD}]\right|" />——三棱锥是平行六面体的六分之一。</p>
    <p>另一类常见用法是「求高」。已知三棱锥的四个顶点，先用混合积算出体积，再由底面积反解高：</p>
    <p style="text-align:center"><Katex tex="h=\frac{3V}{S_{\text{底}}}." display /></p>
    <p>这比先求平面方程、再算点到平面的距离少走一步，是立体几何里求体积与高的常用捷径。面4 会给出点到平面距离的公式，两相对照可以看出它们其实是同一件事。</p>

    <h3 class="sec" id="v4-pit">符号与退化</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把混合积当成体积。</strong>混合积可正可负，体积非负。写答案时体积要加绝对值，符号另有含义（第三条向量在底面的哪一侧）。</li>
        <li><strong>提示二：行列式写成了 <Katex tex="3\times3" /> 的转置却说结果不同。</strong>转置不改变行列式的值，三条向量按行还是按列排都可以。但<strong>交换</strong>两行一定要变号，别把位置随意调换。</li>
        <li><strong>提示三：算四面体体积忘了除以 6。</strong>三棱锥是平行六面体的六分之一；求三棱柱的体积时则取二分之一。这两个系数按图形对号，不要凭印象写。</li>
        <li><strong>提示四：用「共面」去判定任意四点退化。</strong>四点中有三点共线时混合积也为零，这时四点「共面」的说法成立但图形退化成一个三角形或一条直线，答案要注明情形。</li>
      </ul>
    </div>
    <p>回收与预告：三积讲完，向量的运算工具箱就齐了。面1 起用这套工具把平面与直线写成方程——法向量来自向量积，方向向量来自两点之差，距离与夹角全部化为数量积与混合积。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createSpaceMix } from '../../../boards/spacegeom/vector/spacemix.js';
import { SV_CHAPTERS } from './svnav.js';
</script>
