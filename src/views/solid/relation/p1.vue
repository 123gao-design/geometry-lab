<template>
  <ChPage :cur="1" no="位1" base="/solid/w" :chapters="SW_CHAPTERS"
    title="平行与垂直"
    sub="空间中的位置关系只有三种：平行、相交、异面。判定平行与垂直的通法是把空间问题化归到平面上去——要找线面平行，先在平面内找一条与它平行的直线；要证线面垂直，必须在平面内找到两条相交直线都与之垂直。本节把判定与性质的几条定理排成表，先用正方体逐条看位置关系，再用平面与直线的图示把每条判定定理的条件拆开来画。"
    :toc="[{ id: 'w1-rel', t: '三种位置关系' }, { id: 'w1-parallel', t: '平行的判定与性质' }, { id: 'w1-perp', t: '垂直的判定与性质' }, { id: 'w1-dihedral', t: '二面角与面面垂直' }, { id: 'w1-pit', t: '漏条件与用错定理' }]">
    <div class="note good">位置关系看<strong>公共点的个数</strong>：两条直线相交于一点，平行时没有公共点，异面时既不相交也不平行；直线与平面相交于一点、平行时没有公共点；两个平面相交于一条直线、平行时没有公共点。判定定理与性质定理成对出现：判定定理用来<strong>由低维推高维</strong>（线线推线面、线面推面面），性质定理反过来<strong>由高维推低维</strong>。</div>

    <h3 class="sec" id="w1-rel">三种位置关系</h3>
    <p>先看直线与直线。两条不重合的直线，若共面，则相交或平行；若不共面，就称为异面直线。异面的含义是「不同在任何一个平面内」，因此它们既没有公共点，也不平行。正方体的棱 <Katex tex="A_1B" /> 与 <Katex tex="BC" /> 相交，<Katex tex="AB" /> 与 <Katex tex="A_1B_1" /> 平行，<Katex tex="AB" /> 与 <Katex tex="CC_1" /> 异面。</p>
    <table>
      <tr><th>对象</th><th>位置关系</th><th>公共点</th></tr>
      <tr><td>直线与直线</td><td>相交、平行、异面</td><td>一个、零个、零个（且不共面）</td></tr>
      <tr><td>直线与平面</td><td>直线在平面内、相交、平行</td><td>无穷多个、一个、零个</td></tr>
      <tr><td>平面与平面</td><td>相交、平行</td><td>一条直线上的所有点、零个</td></tr>
    </table>
    <p>直线在平面内也记作 <Katex tex="a\subset\alpha" />，它与「平行于平面」的差别在于公共点：前者的所有点都在平面内，后者一个也没有。写判定定理时漏掉 <Katex tex="a\not\subset\alpha" />，就会把平面内的直线误判成平行。</p>
    <div class="board-wrap">
      <BoardMount :factory="createParPerpLab" />
      <div class="cap">图 位1 · <b>平行与垂直的判定</b>：单位正方体当骨架，四档分别高亮线面平行、线面垂直、面面平行与面面垂直。金色实线是被判定的对象，半透明色块是参与判定的平面，垂直处画直角标记，面面垂直一档还画出二面角的平面角。看点：拖动画面转到任意角度，位置关系都不改变；换档时观察<strong>参与判定的线落在哪个平面内</strong>——这正是判定定理的第二个条件。</div>
    </div>

    <h3 class="sec" id="w1-parallel">平行的判定与性质</h3>
    <p><strong>线面平行的判定</strong>：平面外一条直线与此平面内的一条直线平行，则该直线与此平面平行。</p>
    <p style="text-align:center"><Katex tex="a\parallel b,\quad b\subset\alpha,\quad a\not\subset\alpha\ \Longrightarrow\ a\parallel\alpha." display /></p>
    <p><strong>线面平行的性质</strong>：一条直线与一个平面平行，若过这条直线的平面与此平面相交，则该直线与交线平行。</p>
    <p style="text-align:center"><Katex tex="a\parallel\alpha,\quad a\subset\beta,\quad \alpha\cap\beta=b\ \Longrightarrow\ a\parallel b." display /></p>
    <p><strong>面面平行的判定</strong>：若一个平面内的两条相交直线都平行于另一个平面，则两个平面平行。条件是「两条相交直线」，缺一不可——两条平行直线确定的平面可以与目标平面相交。</p>
    <p style="text-align:center"><Katex tex="a\subset\alpha,\ b\subset\alpha,\ a\cap b=P,\ a\parallel\beta,\ b\parallel\beta\ \Longrightarrow\ \alpha\parallel\beta." display /></p>
    <p><strong>面面平行的性质</strong>：两个平行平面被第三个平面所截，截得的两条交线平行；夹在两个平行平面之间的平行线段相等；一条直线垂直于两个平行平面中的一个，必垂直于另一个。</p>
    <p style="text-align:center"><Katex tex="\alpha\parallel\beta,\quad \gamma\cap\alpha=a,\quad \gamma\cap\beta=b\ \Longrightarrow\ a\parallel b." display /></p>
    <p>判定与性质的接力链条是「线线平行 <Katex tex="\Rightarrow" /> 线面平行 <Katex tex="\Rightarrow" /> 面面平行」，反方向则是性质定理。画板的第一档正是这条链的第一环：<Katex tex="A_1B\parallel D_1C" />，而 <Katex tex="D_1C" /> 在平面 <Katex tex="DCC_1D_1" /> 内，于是 <Katex tex="A_1B\parallel" /> 平面 <Katex tex="DCC_1D_1" />。</p>
    <div class="board-wrap">
      <BoardMount :factory="createJudgePara" id="judgepara" />
      <div class="cap">图 位1b · <b>线面平行的判定</b>：一块平面 <Katex tex="\alpha" /> 铺在下方，绿色直线 <Katex tex="a" /> 落在平面内，金色直线 <Katex tex="b" /> 与它平行却位于平面之上，两端虚线把两条线的端点连起来。判定定理的两个条件各占一处——<Katex tex="b\parallel a" /> 与 <Katex tex="b\not\subset\alpha" />，结论 <Katex tex="b\parallel\alpha" /> 才有依据。拖动画面转到侧面，<Katex tex="b" /> 到平面的距离看得最清楚。</div>
    </div>

    <h3 class="sec" id="w1-perp">垂直的判定与性质</h3>
    <p><strong>线面垂直的判定</strong>：一条直线与平面内的两条相交直线都垂直，则该直线与此平面垂直。两条相交直线缺一不可，这也是判定定理里最常被漏掉的条件。</p>
    <p style="text-align:center"><Katex tex="m\subset\alpha,\ n\subset\alpha,\ m\cap n=P,\ l\perp m,\ l\perp n\ \Longrightarrow\ l\perp\alpha." display /></p>
    <p><strong>线面垂直的性质</strong>：若一条直线垂直于一个平面，则它垂直于平面内的任意一条直线；垂直于同一个平面的两条直线互相平行。</p>
    <p style="text-align:center"><Katex tex="l\perp\alpha,\ a\subset\alpha\ \Longrightarrow\ l\perp a;\qquad l\perp\alpha,\ m\perp\alpha\ \Longrightarrow\ l\parallel m." display /></p>
    <p><strong>面面垂直的判定</strong>：一个平面过另一个平面的一条垂线，则这两个平面垂直。</p>
    <p style="text-align:center"><Katex tex="a\perp\beta,\quad a\subset\alpha\ \Longrightarrow\ \alpha\perp\beta." display /></p>
    <p><strong>面面垂直的性质</strong>：两个平面垂直，则一个平面内垂直于交线的直线垂直于另一个平面。</p>
    <p style="text-align:center"><Katex tex="\alpha\perp\beta,\quad \alpha\cap\beta=l,\quad a\subset\alpha,\quad a\perp l\ \Longrightarrow\ a\perp\beta." display /></p>
    <p>性质定理的用法很固定：先找交线，再在其中一个面内作交线的垂线。画板的第二档把 <Katex tex="AA_1" /> 与平面 <Katex tex="ABCD" /> 的两条相交直线 <Katex tex="AB" />、<Katex tex="AD" /> 一起画出，两条直角标记同时成立，判定定理的两个条件就都落地了。</p>
    <div class="board-wrap">
      <BoardMount :factory="createJudgePerp" id="judgeperp" />
      <div class="cap">图 位1c · <b>线面垂直的判定</b>：平面 <Katex tex="\alpha" /> 内两条直线 <Katex tex="m" />、<Katex tex="n" /> 交于点 <Katex tex="P" />，金色直线 <Katex tex="l" /> 过 <Katex tex="P" /> 且与两者都成直角，两处直角标记分画在两个平面里。去掉「相交」这个条件，两条平行直线无论 <Katex tex="l" /> 怎样垂直，都确定不了平面——这正是判定定理里最常被漏掉的一处。拖动画面旋转，两处直角各自所在的平面会分开。</div>
    </div>

    <h3 class="sec" id="w1-dihedral">二面角与面面垂直</h3>
    <p>从一条直线出发的两个半平面所组成的图形叫做<strong>二面角</strong>，这条直线叫做二面角的棱，两个半平面叫做二面角的面，记作 <Katex tex="\alpha-l-\beta" />。度量二面角要在棱上取一点 <Katex tex="O" />，在两个面内分别作垂直于棱的射线，两条射线所成的角叫做二面角的<strong>平面角</strong>。平面角的大小与 <Katex tex="O" /> 的位置无关，范围是 <Katex tex="[0,\pi]" />。</p>
    <p>二面角的平面角为 <Katex tex="90^\circ" /> 时，就说这两个平面垂直。画板的第四档以 <Katex tex="AD" /> 为棱，在平面 <Katex tex="ADD_1A_1" /> 内取 <Katex tex="AA_1" />、在平面 <Katex tex="ABCD" /> 内取 <Katex tex="AB" />，两条射线都垂直于棱 <Katex tex="AD" />，它们成 <Katex tex="90^\circ" />，于是平面 <Katex tex="ADD_1A_1\perp" /> 平面 <Katex tex="ABCD" />。</p>
    <p>注意二面角的平面角与异面直线所成的角不同：前者可以取钝角，后者只取锐角或直角。</p>
    <div class="board-wrap">
      <BoardMount :factory="createJudgeFace" id="judgeface" />
      <div class="cap">图 位1d · <b>面面平行与面面垂直的判定</b>：两档共用两块平面的画法。① 面平行：<Katex tex="\alpha" /> 内的 <Katex tex="a" />、<Katex tex="b" /> 相交于 <Katex tex="P" />，<Katex tex="\beta" /> 内的 <Katex tex="a'" />、<Katex tex="b'" /> 与它们分别平行，两个平面的关系就由这两组平行线确定；把其中一组换成平行线，平面可以斜着穿过去，结论不再成立。② 面垂直：竖直平面 <Katex tex="\beta" /> 里放一条垂直于 <Katex tex="\alpha" /> 的直线 <Katex tex="a" />，直角标记落在交线 <Katex tex="l" /> 上，两个平面就垂直。拖动画面旋转，<Katex tex="a" /> 与交线的直角在任意视角都成立。</div>
    </div>

    <h3 class="sec" id="w1-pit">漏条件与用错定理</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把「平行于平面内的一条直线」直接当成「平行于平面」。</strong>判定线面平行必须加上 <Katex tex="a\not\subset\alpha" />。若 <Katex tex="a" /> 恰在平面内，它与平面内的无数条直线平行，却与平面不平行。</li>
        <li><strong>提示二：判定线面垂直只找到一条垂线。</strong>平面内与 <Katex tex="l" /> 垂直的直线可以彼此平行，它们无法确定平面。必须是两条<strong>相交</strong>直线。</li>
        <li><strong>提示三：判定面面平行用两条平行直线。</strong>两条平行直线确定的平面可以与目标平面相交，结论不成立。同样必须相交。</li>
        <li><strong>提示四：面面垂直的性质定理不先找交线。</strong>「在其中一个面内作一条垂线」不够，这条垂线必须垂直于<strong>交线</strong>，否则它可能与另一个平面斜交。</li>
      </ul>
    </div>
    <p>回收与预告：位1 处理「有没有公共点、垂不垂直」，位的判定全部由平面内的线来担保；位2 处理角度与距离，把两条异面直线搬到同一个顶点上量角。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createParPerpLab } from '../../../boards/solid/relation/parperplab.js';
import { createBoard as createJudgePara } from '../../../boards/solid/relation/judgepara.js';
import { createBoard as createJudgePerp } from '../../../boards/solid/relation/judgeperp.js';
import { createBoard as createJudgeFace } from '../../../boards/solid/relation/judgeface.js';
import { SW_CHAPTERS } from './wnav.js';
</script>
