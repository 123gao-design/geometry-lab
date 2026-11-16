<template>
  <ChPage :cur="3" no="圆3" base="/linecircle/c" :chapters="CN_CHAPTERS"
    title="圆与圆的位置关系"
    sub="两个圆的位置由圆心距与两个半径的和、差共同决定。五种关系中，外切与内切只看是否取等，外离与内含看圆心距落在区间的哪一侧，相交落在中间。相交时两圆方程相减，就得到公共弦所在的直线。"
    :toc="[{ id: 'c3-five', t: '五种位置关系' }, { id: 'c3-chord', t: '公共弦与两式相减' }, { id: 'c3-tangent', t: '相切时的切点' }, { id: 'c3-pit', t: '包含与重合' }]">
    <div class="note good">设两圆半径分别为 <Katex tex="r_1" />、<Katex tex="r_2" />，圆心距为 <Katex tex="d" />。则 <Katex tex="d>r_1+r_2" /> 时外离，<Katex tex="d=r_1+r_2" /> 时外切，<Katex tex="|r_1-r_2|&lt;d&lt;r_1+r_2" /> 时相交，<Katex tex="d=|r_1-r_2|" /> 时内切，<Katex tex="d&lt;|r_1-r_2|" /> 时内含。相交时两圆的公共弦所在直线可由两圆方程相减得到。</div>

    <h3 class="sec" id="c3-five">五种位置关系</h3>
    <div class="board-wrap">
      <BoardMount :factory="createCircleRel" />
      <div class="cap">图 圆3 · <b>圆与圆的位置关系</b>：金色圆 <Katex tex="C_1" /> 固定在原点，绿色圆 <Katex tex="C_2" /> 的圆心可以拖动，两个半径各有一枚滑块。看点：拖动 <Katex tex="C_2" /> 向外，圆心距依次跨过 <Katex tex="r_1+r_2" /> 与 <Katex tex="|r_1-r_2|" /> 两个临界值，位置关系随之改写；相交时橙色弦两端是交点，弦长随圆心距变化。</div>
    </div>
    <p>把两个圆都写成标准方程，圆心距 <Katex tex="d=|C_1C_2|" /> 由两点间距离公式算出。判断的依据是两个临界值：半径之和 <Katex tex="r_1+r_2" /> 与半径之差 <Katex tex="|r_1-r_2|" />。</p>
    <p>圆心距大于半径之和时，两个圆各自落在对方的连心线延长线外侧，没有公共点，称外离。圆心距等于半径之和时，两圆在连心线上的一点相接，称外切。圆心距落在两个临界值之间时，两圆交于两点，称相交。圆心距等于半径之差时，小圆从内部与大切于一点，称内切。圆心距小于半径之差时，小圆整体落在大圆内部，没有公共点，称内含。</p>
    <p>五种关系可以按公共点个数归成三类：外离与内含零个，外切与内切一个，相交两个。两个判据的取值把区间切成了五段，每段对应一种关系，边界点单独成一种。</p>

    <h3 class="sec" id="c3-chord">公共弦与两式相减</h3>
    <p>设两圆方程分别为 <Katex tex="x^2+y^2+D_1x+E_1y+F_1=0" /> 与 <Katex tex="x^2+y^2+D_2x+E_2y+F_2=0" />。因为二次项系数相同，两式相减，二次项消去，剩下</p>
    <p style="text-align:center"><Katex tex="(D_1-D_2)x+(E_1-E_2)y+(F_1-F_2)=0." display /></p>
    <p>这是一个一次方程，表示一条直线。两圆的公共点同时满足两个圆方程，自然满足它们的差，所以公共点都在这条直线上；反过来，两个圆有两个公共点时，这条直线正是公共弦所在的直线。</p>
    <p>相减能得到直线，靠的是两圆方程二次项系数完全相同。若其中一个圆写成 <Katex tex="2x^2+2y^2+\cdots=0" />，必须先两边除以 <Katex tex="2" /> 再相减，否则差里仍留着二次项，不再是直线。</p>
    <p>求出公共弦所在直线后，把它与其中一个圆联立，或直接用圆2 的弦长公式，就能算出公共弦的长度。</p>

    <h3 class="sec" id="c3-tangent">相切时的切点</h3>
    <p>外切时，切点落在连心线上，且把连心线按 <Katex tex="r_1:r_2" /> 分开。由定比分点公式，切点坐标为 <Katex tex="\left(\dfrac{r_2x_1+r_1x_2}{r_1+r_2},\ \dfrac{r_2y_1+r_1y_2}{r_1+r_2}\right)" />，其中 <Katex tex="(x_1,y_1)" />、<Katex tex="(x_2,y_2)" /> 是两个圆心。内切时切点也在连心线上，但落在小圆的外侧，比例换成 <Katex tex="r_1:(-r_2)" /> 的分法。</p>
    <p>相切时两圆的公切线有一条（内切，切点处）或三条（外切，含两圆之间的一条）。做题时若只问切点，用连心线的比例最快；若问公切线，先求出切点，再用圆2 的切线方程。</p>

    <h3 class="sec" id="c3-pit">包含与重合</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把「没有公共点」当成外离。</strong>没有公共点有两种情形：外离与内含。只看交点个数不足以区分，必须比较 <Katex tex="d" /> 与 <Katex tex="r_1+r_2" /> 的大小，或与 <Katex tex="|r_1-r_2|" /> 的大小。</li>
        <li><strong>提示二：内切与外切都写 <Katex tex="d=r_1+r_2" />。</strong>外切对应 <Katex tex="d=r_1+r_2" />，内切对应 <Katex tex="d=|r_1-r_2|" />。写错一个符号，整题的切点位置都会跟着错。</li>
        <li><strong>提示三：忘记半径相等的特殊情况。</strong>两圆半径相等时 <Katex tex="|r_1-r_2|=0" />，内切退化为两圆重合，此时 <Katex tex="d=0" /> 且半径相等。重合不是内切，公共点无穷多，两圆方程相减得到的是恒等式，不是直线。</li>
        <li><strong>提示四：两圆相减后不检查是否相交。</strong>两圆外离或内含时，它们方程相减仍得到一条直线，但这只是「根轴」，直线上没有公共点。判断公共弦是否存在，必须先确认两圆相交。</li>
      </ul>
    </div>
    <p>回收与预告：圆2 的弦长公式在这里算公共弦长；圆1 的配方法把一般方程读成圆心与半径，是算圆心距的前提。子专题三接着讨论圆自身的性质：垂径定理、圆周角、切线与弦切角。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCircleRel } from '../../../boards/linecircle/circle/circlerel.js';
import { CN_CHAPTERS } from './cnav.js';
</script>
