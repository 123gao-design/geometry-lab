<template>
  <ChPage :cur="3" no="射3" base="/projgeom/p" :chapters="PRJ_CHAPTERS"
    title="交比"
    sub="四个共线点的交比是一个分式，任何射影变换都不改变它。长度与角度都被破坏之后，交比接手了「量」的角色，成为射影几何唯一的基本不变量。"
    :toc="[{ id: 'p3-def', t: '定义与坐标式' }, { id: 'p3-inv', t: '射影不变性' }, { id: 'p3-harm', t: '调和点列与无穷远' }, { id: 'p3-tip', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="A,B,C,D" /> 是直线上四个不同点，在任一仿射坐标下坐标为 <Katex tex="a,b,c,d" />。定义<b>交比</b> <Katex display tex="(A,B;C,D)=\frac{(c-a)/(c-b)}{(d-a)/(d-b)}=\frac{(c-a)(d-b)}{(c-b)(d-a)}." /> 它在射影变换下不变，与坐标选取无关。若 <Katex tex="(A,B;C,D)=-1" />，称四点<b>调和</b>。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCross" />
      <div class="cap">图 射3 · <b>交比机</b>：上排拖动四个点，下排是它们在同一个分式线性变换下的像。看点：① 四点挪来挪去，上方交比连续变化；② 换「平移」「倒数」「分式」三种变换，像的间距差别很大；③ 两块交比徽章始终显示同一个数——位置变了，交比没变。</div>
    </div>

    <h3 class="sec" id="p3-def">定义与坐标式</h3>
    <p>交比由四个有序点决定，括号里的逗号分组不能省。先算 <Katex tex="C,D" /> 分别相对 <Katex tex="A,B" /> 的比值，再相除。交换其中两个点，交比一般会变，所以 <Katex tex="(A,B;C,D)" /> 与 <Katex tex="(A,C;B,D)" /> 是两个不同的数。</p>
    <p>四个点可以排出 24 种顺序，本质上只有 6 个不同的交比值，它们由 <Katex tex="\lambda" /> 与 <Katex tex="1-\lambda" />、<Katex tex="1/\lambda" /> 等变换互相联系。实际计算时固定一种分组，别中途换顺序。</p>
    <p>交比与坐标无关：换一个仿射坐标 <Katex tex="x\mapsto \alpha x+\beta" />，分子分母同时乘上 <Katex tex="\alpha^2" />，约掉。仿射变换已经不改变交比，射影变换同样不改变。</p>

    <h3 class="sec" id="p3-inv">射影不变性</h3>
    <p>设分式线性变换 <Katex tex="T(x)=\dfrac{\alpha x+\beta}{\gamma x+\delta}" />，<Katex tex="\alpha\delta-\beta\gamma\neq0" />。直接代入可验证</p>
    <p style="text-align:center"><Katex display tex="(T(A),T(B);T(C),T(D))=(A,B;C,D)." /></p>
    <p>关键在 <Katex tex="T(c)-T(a)=\dfrac{(\alpha\delta-\beta\gamma)(c-a)}{(\gamma c+\delta)(\gamma a+\delta)}" />：每个差都多出相同的两个分母因子，四项相除时全部约掉。变换越一般，这个约分越显得神奇，但代数上只是行列式在起作用。</p>
    <p>因此交比是射影不变量。反过来，一条直线上三对对应点就能定出唯一的射影变换；第四对点的像由交比锁定。这正是用交比作「射影坐标」的依据。</p>

    <h3 class="sec" id="p3-harm">调和点列与无穷远</h3>
    <p>交比等于 <Katex tex="-1" /> 的四点叫调和点列。若 <Katex tex="A,B" /> 是线段两端，<Katex tex="C" /> 是内分点、<Katex tex="D" /> 是外分点且分比相同，则 <Katex tex="(A,B;C,D)=-1" />。完全四边形里，对角线与对边的交点自然形成调和点列。</p>
    <p>有个点跑到无穷远时，交比有简洁的极限。若 <Katex tex="D=\infty" />，则</p>
    <p style="text-align:center"><Katex tex="(A,B;C,\infty)=\frac{c-a}{c-b}." /></p>
    <p>这正是 <Katex tex="C" /> 分线段 <Katex tex="AB" /> 的定比分。欧氏几何里的「比值」被射影几何用「与无穷远点的交比」重新表述，长度信息藏进了无穷远点的位置里。</p>

    <h3 class="sec" id="p3-tip">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：顺序不能换。</strong>交比依赖四个点的排列。<Katex tex="(A,B;C,D)" /> 与 <Katex tex="(B,A;C,D)" /> 互为倒数，和原来的数一般不同。</li>
        <li><strong>提示二：用坐标算，不要用距离。</strong>交比是坐标之比，取绝对值会丢掉符号，调和点列的 <Katex tex="-1" /> 就判不出来。距离只在特定位置才与它一致。</li>
        <li><strong>提示三：无穷远点可以代入。</strong>把 <Katex tex="\infty" /> 当极限处理，公式退化成定比分。遇到分母为零，先看是不是某个点跑到了无穷远。</li>
        <li><strong>提示四：交比不变，不代表四点不动。</strong>射影变换可以把内分点搬到外分点，只要四点的交比配对保持不变。位置与交比是两件事。</li>
      </ul>
    </div>
    <p>回收与预告：点与线在射影平面里地位对等，共线的命题与共点的命题成对出现。把这种对称写成一条原理，就是下一章的对偶原理。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCross } from '../../../boards/projgeom/plane/cross.js';
import { PRJ_CHAPTERS } from './prjnav.js';
</script>
