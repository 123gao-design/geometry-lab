<template>
  <ChPage :cur="1" title="平行线的交点：无穷远点与消点" sub="在照片里找到平行线的共同方向。"
    :toc="[{ id: 'c1-persp', t: '透视投影' }, { id: 'c1-coord', t: '用齐次坐标记下方向' }]">
    <p>道路的两条边线在地面上平行，照片里的延长线却常常相交。对同一组平行线来说，这个交点只取决于它们的方向和相机的成像设置。射影几何把这个共同方向记作一个<strong>无穷远点</strong>，它落在像平面上的有限位置时就成了<strong>消点</strong>。</p>
    <p>平面里每个方向对应一个无穷远点，方向相反的两根箭头代表同一点。所有方向点组成<strong>无穷远直线</strong> <Katex tex="l_\infty" />。给仿射平面添上它，就得到实射影平面 <Katex tex="\mathbb{RP}^2" />，其中任意两条<strong>不同的直线</strong>恰好交于一点。</p>

    <ConicFigure head="bottom" id="c1-persp" number="1" title="地面方向与消点" :factory="createBoard"
      :legend="[['mint', '地平线', 'dashed'], ['gold', '消点', 'point']]">
      拖动左图的赭色方向把手，观察右图的消点。点「正对相机」把消点带到地平线中间，再点「转到与画面平行」，比较消点在视窗外和消点在无穷远这两种状态。相机高度 <Katex tex="h" /> 控制地平线的高度。
    </ConicFigure>

    <h3 class="sec" id="c1-coord">用齐次坐标记下方向</h3>
    <p>用三个数记一个点 <Katex tex="[X:Y:W]" />。三个数同时乘任意非零常数，仍代表同一点。当 <Katex tex="W\ne0" /> 时，普通坐标是 <Katex tex="(X/W,Y/W)" />。当 <Katex tex="W=0" /> 时，<Katex tex="[X:Y:0]" /> 代表方向 <Katex tex="(X,Y)" />。因此无穷远直线的方程就是 <Katex tex="W=0" />。</p>
    <p>例如，直线 <Katex tex="y=2x+1" /> 和 <Katex tex="y=2x-3" /> 的齐次方程可以写成 <Katex tex="Y-2X=W" /> 与 <Katex tex="Y-2X=-3W" />。联立得 <Katex tex="W=0,\ Y=2X" />，交点就是 <Katex tex="[1:2:0]" />。到了 <ReadingLink to="/conics/ch5" inline aria-label="§5 配极原则与齐次坐标">§5</ReadingLink>，同一种写法还能算出无穷远点的极线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ReadingLink from '../../../components/ReadingLink.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard } from '../../../boards/conics/projective/persp.js';
</script>
