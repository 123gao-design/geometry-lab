<template>
  <ChPage :cur="1" no="积1" base="/solid/m" :chapters="SM_CHAPTERS"
    title="柱、锥、台的体积与表面积"
    sub="表面积由侧面积与底面积拼成，侧面积的算法来自侧面展开图；体积则统一写成 V=h(S+S′+√(SS′))/3，S′=S 时是柱，S′=0 时是锥。棱柱、棱锥、棱台与圆柱、圆锥、圆台八个体积表面积公式，都可以从这两条主线推出来。"
    :toc="[{ id: 'm1-unfold', t: '表面积：展开图' }, { id: 'm1-prism', t: '柱体' }, { id: 'm1-pyramid', t: '锥体' }, { id: 'm1-frustum', t: '台体与统一形式' }, { id: 'm1-pit', t: '斜高、母线与其他' }]">
    <div class="note good">表面积 = 侧面积 + 各底面积。求侧面积的通法是<strong>把侧面展开成平面图形</strong>：棱柱展开成矩形，正棱锥展开成若干个全等的等腰三角形，正棱台展开成若干个全等的等腰梯形，圆柱展开成矩形，圆锥展开成扇形，圆台展开成扇环。体积的通用形式是 <Katex tex="V=\dfrac{h}{3}\left(S+S'+\sqrt{SS'}\right)" />，其中 <Katex tex="h" /> 是高，<Katex tex="S" />、<Katex tex="S'" /> 是下、上底面积。</div>

    <h3 class="sec" id="m1-unfold">表面积：展开图</h3>
    <div class="board-wrap">
      <BoardMount :factory="createMeasureLab" />
      <div class="cap">图 积1 · <b>柱、锥、台的体积与表面积</b>：三档切换正棱柱、正棱锥、正棱台，边数 <Katex tex="n" /> 从 3 推到 8，底面边长 <Katex tex="a" />、高 <Katex tex="h" />、上底边长 <Katex tex="a_2" /> 各自成滑块。底面金色、上底绿色、侧面按面分色。看点：把 <Katex tex="n" /> 往上推，侧面积徽章逐渐逼近圆柱的 <Katex tex="2\pi rh" />；切换三档时 <Katex tex="a_2=a" /> 与 <Katex tex="a_2\to0" /> 两种极限在体积徽章上直接显形；拖动画面可以转到背面，核对每个面都算进了侧面积。</div>
    </div>
    <p>侧面展开的关键是找到「展开后每条边的长度」。棱柱的侧面展开后是一个矩形，宽是底面周长 <Katex tex="c" />、高是 <Katex tex="h" />；正棱锥的侧面展开后是以底面边长为底、斜高 <Katex tex="h'" /> 为高的等腰三角形，<Katex tex="n" /> 个拼起来是 <Katex tex="\tfrac12ch'" />。圆柱沿一条母线剪开摊平，侧面是长 <Katex tex="2\pi r" />、宽 <Katex tex="h" /> 的矩形。</p>
    <p>圆锥的展开图是扇形，弧长等于底面周长 <Katex tex="2\pi r" />，半径等于母线 <Katex tex="l" />，所以扇形面积 <Katex tex="\tfrac12\cdot2\pi r\cdot l=\pi rl" />。圆台展开成扇环，面积等于两底周长之和的一半乘母线：<Katex tex="\pi(r+r')l" />。</p>

    <h3 class="sec" id="m1-prism">柱体</h3>
    <p>设直棱柱的底面周长为 <Katex tex="c" />、底面积为 <Katex tex="S" />、高为 <Katex tex="h" />，则</p>
    <p style="text-align:center"><Katex tex="S_{\text{侧}}=ch,\qquad S_{\text{表}}=2S+ch,\qquad V=Sh." display /></p>
    <p>圆柱的底面半径为 <Katex tex="r" />、高为 <Katex tex="h" />，把 <Katex tex="c=2\pi r" />、<Katex tex="S=\pi r^2" /> 代入即得</p>
    <p style="text-align:center"><Katex tex="S_{\text{侧}}=2\pi rh,\qquad S_{\text{表}}=2\pi r^2+2\pi rh=2\pi r(r+h),\qquad V=\pi r^2h." display /></p>
    <p>柱体体积公式的几何含义是「底面积乘高」：与棱柱同底等高的斜棱柱，可以切成无穷多片薄柱再错动拼成直棱柱，体积不变。因此斜棱柱的体积同样用 <Katex tex="Sh" />，只是求侧面积不能再用底面周长乘高。</p>

    <h3 class="sec" id="m1-pyramid">锥体</h3>
    <p>设正棱锥的底面周长为 <Katex tex="c" />、底面积为 <Katex tex="S" />、高为 <Katex tex="h" />、斜高为 <Katex tex="h'" />，则</p>
    <p style="text-align:center"><Katex tex="S_{\text{侧}}=\tfrac12ch',\qquad S_{\text{表}}=S+\tfrac12ch',\qquad V=\tfrac13Sh." display /></p>
    <p>圆锥的底面半径为 <Katex tex="r" />、母线为 <Katex tex="l" />、高为 <Katex tex="h" />，且 <Katex tex="l^2=r^2+h^2" />，则</p>
    <p style="text-align:center"><Katex tex="S_{\text{侧}}=\pi rl,\qquad S_{\text{表}}=\pi r(r+l),\qquad V=\tfrac13\pi r^2h." display /></p>
    <p>锥体体积的 <Katex tex="\tfrac13" /> 来自「三个同底等高的锥恰好拼满一个柱」：把柱体沿一组对角线切成三个等体积的锥，可以严格验证。斜棱锥与斜圆锥同样适用 <Katex tex="\tfrac13Sh" />，只要 <Katex tex="h" /> 取顶点到底面的距离。</p>

    <h3 class="sec" id="m1-frustum">台体与统一形式</h3>
    <p>设正棱台的下、上底面周长分别为 <Katex tex="c" />、<Katex tex="c'" />，下、上底面积分别为 <Katex tex="S" />、<Katex tex="S'" />，高为 <Katex tex="h" />、斜高为 <Katex tex="h'" />，则</p>
    <p style="text-align:center"><Katex tex="S_{\text{侧}}=\tfrac12(c+c')h',\qquad S_{\text{表}}=S+S'+\tfrac12(c+c')h',\qquad V=\tfrac{h}{3}\left(S+S'+\sqrt{SS'}\right)." display /></p>
    <p>圆台的下、上底半径分别为 <Katex tex="r" />、<Katex tex="r'" />，母线为 <Katex tex="l" />、高为 <Katex tex="h" />，且 <Katex tex="l^2=h^2+(r-r')^2" />，则</p>
    <p style="text-align:center"><Katex tex="S_{\text{侧}}=\pi(r+r')l,\qquad S_{\text{表}}=\pi\left(r^2+r'^2+(r+r')l\right),\qquad V=\tfrac{\pi h}{3}\left(r^2+rr'+r'^2\right)." display /></p>
    <p>把 <Katex tex="S'=S" /> 代入台体体积公式，得 <Katex tex="\tfrac{h}{3}(S+S+S)=Sh" />，正是柱体；把 <Katex tex="S'=0" /> 代入，得 <Katex tex="\tfrac{Sh}{3}" />，正是锥体。圆台一档同样成立：<Katex tex="r'=r" /> 给出 <Katex tex="\pi r^2h" />，<Katex tex="r'=0" /> 给出 <Katex tex="\tfrac13\pi r^2h" />。一个公式覆盖三种几何体，是这套公式最值得记住的结构。</p>
    <p>正棱台的斜高与高、底面边心距之差构成直角三角形：<Katex tex="h'^2=h^2+(\rho-\rho')^2" />，其中 <Katex tex="\rho" />、<Katex tex="\rho'" /> 是下、上底面中心到边的距离。图中斜高线正落在这个三角形的一条边上。</p>

    <h3 class="sec" id="m1-pit">斜高、母线与其他</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把斜高当成高。</strong>正棱锥的斜高是侧面三角形的高，它落在侧面上；高是顶点到底面的距离，落在几何体内部。两者由边心距勾连，<Katex tex="h'^2=h^2+\rho^2" />，直接混用会让侧面积偏大。</li>
        <li><strong>提示二：把圆锥的母线当成高。</strong>同理，<Katex tex="l^2=r^2+h^2" />。题目给半径与高求侧面积时，必须先算出母线再乘 <Katex tex="\pi r" />。</li>
        <li><strong>提示三：用「底面周长乘高」求斜棱柱的侧面积。</strong>只有直棱柱（含圆柱）能这么做。斜棱柱的侧面是平行四边形，逐面求或先求截面周长再乘侧棱长才是正确做法。</li>
        <li><strong>提示四：把台体体积写成上下底面积的算术平均。</strong>正确形式含 <Katex tex="\sqrt{SS'}" />，不是 <Katex tex="\tfrac12(S+S')" />。取 <Katex tex="S=4" />、<Katex tex="S'=9" />、<Katex tex="h=3" /> 验算，正确值是 <Katex tex="\tfrac{3}{3}(4+9+6)=19" />，而算术平均会给出 <Katex tex="19.5" />。</li>
      </ul>
    </div>
    <p>回收与预告：积1 给出柱锥台的完整公式表，积2 补上球的两个公式，并用截面把球半径、截面圆半径与球心到截面的距离连成勾股关系。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMeasureLab } from '../../../boards/solid/measure/measurelab.js';
import { SM_CHAPTERS } from './mnav.js';
</script>
