<template>
  <ChPage :cur="1" no="体1" base="/solid/r" :chapters="SR_CHAPTERS"
    title="多面体"
    sub="由若干个平面多边形围成的几何体叫多面体。围成它的每个多边形是面，两个面的公共边是棱，棱与棱的公共端点是顶点。棱柱、棱锥、棱台是最基本的三类，它们的顶点数、棱数与面数满足同一个等式。"
    :toc="[{ id: 'r1-def', t: '面、棱、顶点' }, { id: 'r1-prism', t: '棱柱' }, { id: 'r1-pyramid', t: '棱锥与棱台' }, { id: 'r1-euler', t: '欧拉公式' }, { id: 'r1-pit', t: '命名与图形' }]">
    <div class="note good">由若干个平面多边形围成的几何体叫做<strong>多面体</strong>。围成多面体的各个多边形叫做多面体的<strong>面</strong>，相邻两个面的公共边叫做多面体的<strong>棱</strong>，棱与棱的公共端点叫做多面体的<strong>顶点</strong>。把多面体的任何一个面伸展为平面，如果所有其他各面都在这个平面的同侧，这样的多面体叫做<strong>凸多面体</strong>；中学讨论的立体图形都是凸多面体。</div>

    <h3 class="sec" id="r1-def">面、棱、顶点</h3>
    <div class="board-wrap">
      <BoardMount :factory="createPolyhedronLab" />
      <div class="cap">图 体1 · <b>多面体机</b>：五档切换三棱柱、长方体、三棱锥、四棱锥与四棱台，每个面一种颜色、带透明，前后两面能同时看见。看点：在画面上按住拖动即可转动视角，转到背面时原本被挡住的棱露出来；徽章始终读出顶点数、棱数与面数，并把三个数代进欧拉公式核验。</div>
    </div>
    <p>多面体是空心的「壳」，它的形状由面的清单决定。同一条棱由两个面共有，数棱时不能重复计数；每个顶点至少聚着三条棱，三个顶点确定一个面之外的空间位置。把这三类对象数清楚，就抓住了多面体的全部组合信息。</p>
    <p>与平面图形不同，立体图形的形状不能只靠一张图说清：图中虚线表示被挡住的棱，实线表示能看见的棱，这个约定在三维旋转后会失效，因此本课程把每条棱都画成实线，用半透明的面把前后关系交代出来。</p>

    <h3 class="sec" id="r1-prism">棱柱</h3>
    <p>有两个面互相平行，其余各面都是四边形，并且每相邻两个四边形的公共边都互相平行，由这些面所围成的多面体叫做<strong>棱柱</strong>。两个互相平行的面叫做棱柱的底面，其余各面叫做侧面，相邻侧面的公共边叫做侧棱。</p>
    <p>棱柱的侧棱互相平行且相等，侧面都是平行四边形；两个底面是全等的多边形。侧棱垂直于底面的棱柱叫做<strong>直棱柱</strong>，此时侧面都是矩形，侧棱长就等于高；底面是正多边形的直棱柱叫做<strong>正棱柱</strong>。按底面多边形的边数，棱柱分为三棱柱、四棱柱、五棱柱等。</p>
    <p>一个 <Katex tex="n" /> 棱柱有 <Katex tex="2n" /> 个顶点、<Katex tex="3n" /> 条棱、<Katex tex="n+2" /> 个面。长方体是四棱柱的特例：它的六个面都是矩形，十二条棱可以分成三组，每组四条互相平行且相等，分别叫做长、宽、高。</p>

    <h3 class="sec" id="r1-pyramid">棱锥与棱台</h3>
    <p>有一个面是多边形，其余各面都是有一个公共顶点的三角形，由这些面所围成的多面体叫做<strong>棱锥</strong>。这个多边形叫做棱锥的底面，其余各面叫做侧面，各侧面的公共顶点叫做棱锥的顶点，顶点到底面的距离叫做棱锥的高。</p>
    <p>底面是正多边形，并且顶点在底面的射影是底面中心的棱锥叫做<strong>正棱锥</strong>。正棱锥的侧面是全等的等腰三角形，等腰三角形底边上的高叫做斜高；斜高、高与底面正多边形的边心距组成直角三角形，满足 <Katex tex="l^2=h^2+\rho^2" />，其中 <Katex tex="\rho" /> 是底面中心到边的距离。</p>
    <p>用平行于棱锥底面的平面去截棱锥，底面与截面之间的部分叫做<strong>棱台</strong>。原棱锥的底面与截面分别叫做棱台的下底面与上底面，其余各面叫做侧面。棱台的侧棱延长后交于一点（原棱锥的顶点），侧面都是梯形；由正棱锥截得的棱台叫做正棱台，它的侧面是全等的等腰梯形。上底面缩成一个点时棱台退化为棱锥，上、下底面全等时退化为棱柱——这一点在积1 的体积公式里会再出现。</p>

    <h3 class="sec" id="r1-euler">欧拉公式</h3>
    <p>设简单多面体的顶点数为 <Katex tex="V" />、棱数为 <Katex tex="E" />、面数为 <Katex tex="F" />，则</p>
    <p style="text-align:center"><Katex tex="V-E+F=2." display /></p>
    <p>这个等式与多面体的具体形状无关：把三棱柱捏成长方体，只要不撕裂、不粘合，三个数一起变，差 <Katex tex="V-E+F" /> 始终是 <Katex tex="2" />。用棱柱与棱锥的通项代入即可验证：<Katex tex="n" /> 棱柱是 <Katex tex="2n-3n+(n+2)=2" />，<Katex tex="n" /> 棱锥是 <Katex tex="(n+1)-2n+(n+1)=2" />，<Katex tex="n" /> 棱台是 <Katex tex="2n-3n+(n+2)=2" />。</p>
    <p>反过来，欧拉公式可以当作检查图是否数对的判据：数出的三个数代进去不等于 <Katex tex="2" />，说明某条棱或某个面被重复计算，或者被漏掉了。</p>

    <h3 class="sec" id="r1-pit">命名与图形</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把棱柱的侧面当成矩形。</strong>只有直棱柱的侧面才是矩形，斜棱柱的侧面是平行四边形。求侧面积时用「底面周长乘侧棱长」得到的只是斜棱柱的侧面积的一部分，正确做法是每个侧面分别求再相加。</li>
        <li><strong>提示二：把棱台当成「上面切掉一块的棱柱」。</strong>棱台的两条侧棱延长后必须交于一点。把一个长方体斜着切掉一角，得到的多面体侧棱并不共点，不是棱台，它的体积也不能直接套棱台公式。</li>
        <li><strong>提示三：数棱时把同一条棱数两次。</strong>一条棱由两个面共有，按面逐个统计会把每条棱算两遍，得到 <Katex tex="2E" />。用欧拉公式回代是最快的自查。</li>
        <li><strong>提示四：认为欧拉公式对所有多面体都成立。</strong>公式要求多面体是简单多面体（表面能连续变形为球面）。中间带穿孔的环状多面体 <Katex tex="V-E+F" /> 的值是 <Katex tex="0" />，不在本课程范围内。</li>
      </ul>
    </div>
    <p>回收与预告：面、棱、顶点是立体的骨架，接下来体2 换一类由旋转生成的几何体，它们没有棱与顶点，靠轴、底面与母线来描述；积1 再给这些几何体配上体积与表面积公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolyhedronLab } from '../../../boards/solid/recog/polyhedronlab.js';
import { SR_CHAPTERS } from './rnav.js';
</script>
