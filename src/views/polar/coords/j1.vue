<template>
  <ChPage :cur="1" no="极1" base="/polar/j" :chapters="PJ_CHAPTERS"
    title="极坐标系与点的极坐标"
    sub="极坐标用一枚定点与一个方向来定位：极径是到极点的距离，极角是从极轴逆时针转过的角。平面上每一点都对应无穷多组极坐标，这既是它的方便之处，也是读题时最容易出错的地方。"
    :toc="[{ id: 'j1-set', t: '极坐标系的构成' }, { id: 'j1-point', t: '点的极坐标' }, { id: 'j1-multi', t: '坐标的不唯一' }, { id: 'j1-pit', t: '方向、多值与负径' }]">
    <div class="note good">在平面内取一个定点 <Katex tex="O" />，叫做<strong>极点</strong>；从 <Katex tex="O" /> 出发引一条射线 <Katex tex="Ox" />，叫做<strong>极轴</strong>；再取定长度单位与角的正方向（通常规定逆时针为正），就建立了一个<strong>极坐标系</strong>。对于平面内一点 <Katex tex="P" />，用 <Katex tex="\rho=|OP|" /> 表示它到极点的距离，用 <Katex tex="\theta" /> 表示从极轴转到 <Katex tex="OP" /> 的角，那么 <Katex tex="(\rho,\theta)" /> 就是点 <Katex tex="P" /> 的<strong>极坐标</strong>，<Katex tex="\rho" /> 叫极径，<Katex tex="\theta" /> 叫极角。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPolarGrid" />
      <div class="cap">图 极1 · <b>极坐标系与点的极坐标</b>：浅色的同心圆与等分射线是读数的参照，金色一支是 <Katex tex="OP" />，橙色弧从极轴逆时针转到 <Katex tex="OP" />。看点：拖动 <Katex tex="P" /> 走一圈，极径 <Katex tex="\rho" /> 是到极点的距离，极角 <Katex tex="\theta" /> 在 <Katex tex="0^\circ" /> 到 <Katex tex="360^\circ" /> 之间连续变化；同一枚点还能写成 <Katex tex="\theta+360^\circ" /> 与负径形式，徽章一并列出。</div>
    </div>

    <h3 class="sec" id="j1-set">极坐标系的构成</h3>
    <p>极坐标系只用了两件东西：一枚定点与一条射线。极点定位置，极轴定方向，再配上长度单位与角的正方向，平面上的点就都能读数。与直角坐标系相比，它没有两条互相垂直的坐标轴，取而代之的是「到定点的距离」与「绕定点转过的角」。</p>
    <p>两套坐标适合的场合不同。直角坐标的横纵分量各自独立，做平移与加减最方便；极坐标把距离与方向分开，描述旋转、射线上的点、到定点的远近时更直接。同一个图形在两套坐标里可以有繁有简，选哪一套看图形本身的样子。</p>

    <h3 class="sec" id="j1-point">点的极坐标</h3>
    <p>按常用约定，极径 <Katex tex="\rho\ge 0" />，极角 <Katex tex="\theta" /> 取 <Katex tex="[0^\circ,360^\circ)" /> 内的一个值。极轴上的点极角为 <Katex tex="0^\circ" />；过极点且垂直于极轴的射线上，极角为 <Katex tex="90^\circ" />；极轴的反向延长线上，极角为 <Katex tex="180^\circ" />。极点本身到自己的距离为零，极角没有确定值。</p>
    <p>图 极1 的四条预设分别落在四条半轴与四个象限里，橙色弧的长度随极角变化，金色线段的长随极径变化。极径与极角互相独立，改其中一个不影响另一个，这是极坐标读数清晰的原因。</p>

    <h3 class="sec" id="j1-multi">坐标的不唯一</h3>
    <p>角转过整圈回到原处，所以 <Katex tex="(\rho,\theta)" /> 与 <Katex tex="(\rho,\theta+360^\circ k)" />（<Katex tex="k\in\mathbb{Z}" />）表示同一点。图 极1 的等价表示徽章同时列出 <Katex tex="\theta+360^\circ" /> 一式。</p>
    <p>有些教材进一步允许极径取负值，并约定 <Katex tex="(-\rho,\theta)" /> 与 <Katex tex="(\rho,\theta+180^\circ)" /> 表示同一点：负径落在极角终边的反向延长线上，长度仍按 <Katex tex="|\rho|" /> 计算。徽章里的负径一式就是这条约定。约定不同，同一枚点的坐标写法就不同，做题时要按题目采用的约定来读。</p>
    <p>当 <Katex tex="\rho=0" /> 时，点落在极点上，<Katex tex="\theta" /> 可以取任意值。极点因此没有唯一的极坐标，讨论极点时要单独说明。</p>

    <h3 class="sec" id="j1-pit">方向、多值与负径</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：极角从极轴逆时针量。</strong>顺时针转过 <Katex tex="30^\circ" /> 的角是 <Katex tex="-30^\circ" />，也可以写成 <Katex tex="330^\circ" />，不能记成 <Katex tex="30^\circ" />。方向反了，点会落到极轴的另一侧。</li>
        <li><strong>提示二：同一点的坐标不唯一。</strong>判断两点是否重合，不能只看两组数是否逐项相等。先把极角差化到 <Katex tex="360^\circ" /> 的整数倍上，再比较极径；采用负径约定时还要把 <Katex tex="-\rho" /> 换成 <Katex tex="\rho" /> 并把极角加 <Katex tex="180^\circ" />。</li>
        <li><strong>提示三：极径是距离。</strong>按常用约定 <Katex tex="\rho\ge 0" />。写成 <Katex tex="\rho=-2" /> 时，若题目没有约定负径的含义，这个坐标就没有意义；若采用了负径约定，则它对应 <Katex tex="(2,\theta+180^\circ)" />。</li>
        <li><strong>提示四：极点没有确定的极角。</strong><Katex tex="(0,0^\circ)" />、<Katex tex="(0,90^\circ)" /> 都表示极点，但不能反过来由「极角为零」断定点在极轴上——还要看极径是否为零。</li>
      </ul>
    </div>
    <p>回收与预告：向量的模与方向在这里换了个说法，模成了极径，方向成了极角。极2 把极点放在原点、极轴与 <Katex tex="x" /> 轴正半轴重合，给出两套坐标的互化公式；曲1 再用极坐标写圆的方程。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarGrid } from '../../../boards/polar/coords/polargrid.js';
import { PJ_CHAPTERS } from './pjnav.js';
</script>
