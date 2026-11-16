<template>
  <ChPage :cur="3" no="积3" base="/solid/m" :chapters="SM_CHAPTERS"
    title="组合体、外接球与内切球"
    sub="把几个几何体拼在一起或挖去一块，体积按加减处理，表面积则要把每一块外露的面都数进来。球与多面体的关系只有两种问法：球在多面体外面穿过所有顶点，叫外接球；球在多面体里面贴着所有面，叫内切球。两类问题的核心都是找球心——外接球的球心到各顶点等距，内切球的球心到各面等距。"
    :toc="[{ id: 'm3-union', t: '拼接与挖切' }, { id: 'm3-box', t: '长方体与正方体的球' }, { id: 'm3-tetra', t: '正四面体的两球' }, { id: 'm3-ratio', t: '相似与倍数关系' }, { id: 'm3-pit', t: '球心与半径' }]">
    <div class="note good">组合体的两句话：<strong>体积按加减</strong>，一个大几何体挖去一块就相减，拼上几块就相加；<strong>表面积数外露面</strong>，同时别忘挖空之后新出现的曲面。外接球的判定只有一条：球心到所有顶点的距离相等；内切球的判定只有一条：球心到所有面的距离相等。题面给出「所有棱都相切时」，那叫棱切球，半径另算。</div>

    <h3 class="sec" id="m3-union">拼接与挖切</h3>
    <p>组合体的体积等于各部分的体积之和，挖切时用整体减部分。棱长为 <Katex tex="a" /> 的正方体挖去内切球，剩下部分的体积是</p>
    <p style="text-align:center"><Katex tex="V=a^3-\frac{4}{3}\pi\left(\frac{a}{2}\right)^3=a^3\left(1-\frac{\pi}{6}\right)." display /></p>
    <p>表面积要把外表面与新露出的内表面都记上。正方体的六个面还在，挖球之后多出一个球面，于是</p>
    <p style="text-align:center"><Katex tex="S=6a^2+4\pi\left(\frac{a}{2}\right)^2=6a^2+\pi a^2." display /></p>
    <p>拼接与挖切都能拆成「大块减小块、外表面加内表面」两步。若挖去的部分与边界相交，敞口处的截面要扣掉，这时最好先把每一块面的面积单独算再相加，不在脑子里做加减。</p>
    <div class="board-wrap">
      <BoardMount :factory="createMixLab" />
      <div class="cap">图 积3 · <b>组合体与外接球内切球机</b>：三档。第一档在正方体里挖去内切球，球的半径 <Katex tex="\tfrac{a}{2}" />，余下体积与表面积按上面两式实时读；第二档画出长方体的外接球与体对角线，球心在体对角线中点；第三档画正四面体的外接球与内切球，两球同心，半径比 <Katex tex="3:1" />。拖动画面旋转，第二、三档里球与顶点、球与面的接触位置看得最清楚。</div>
    </div>

    <h3 class="sec" id="m3-box">长方体与正方体的球</h3>
    <p>长方体外接球的球心是体对角线的中点，直径就是体对角线，于是</p>
    <p style="text-align:center"><Katex tex="2R=\sqrt{a^2+b^2+c^2},\qquad R=\frac12\sqrt{a^2+b^2+c^2}." display /></p>
    <p>正方体是 <Katex tex="a=b=c" /> 的情形，<Katex tex="R=\tfrac{\sqrt3}{2}a" />。正方体的内切球贴着六个面，球心在中心，半径 <Katex tex="r=\tfrac{a}{2}" />；棱切球与十二条棱相切，半径是 <Katex tex="\tfrac{\sqrt2}{2}a" />。三个半径之比 <Katex tex="1:\sqrt2:\sqrt3" />，都落在体对角线上。</p>
    <p>由这条体对角线还能反推：已知长方体的三条棱求外接球体积，先算 <Katex tex="R" /> 再代 <Katex tex="\tfrac43\pi R^3" />；已知外接球半径与两条棱求第三条棱，把公式平方后移项即可。把 <Katex tex="R" /> 与 <Katex tex="a" /> 用同一套符号写清楚，是这一类题的起点。</p>
    <p>圆柱的内切球比较特殊：球贴着上下两个底面与侧面，半径等于圆柱底面半径，也等于圆柱高的一半，因此只有 <Katex tex="h=2r" /> 的圆柱才有内切球。</p>

    <h3 class="sec" id="m3-tetra">正四面体的两球</h3>
    <p>棱长为 <Katex tex="a" /> 的正四面体，外接球与内切球同心，球心在顶点与底面中心的连线上，落在高的 <Katex tex="\tfrac34" /> 处（从顶点算起）。两个半径分别是</p>
    <p style="text-align:center"><Katex tex="R=\frac{\sqrt6}{4}a,\qquad r=\frac{\sqrt6}{12}a,\qquad R=3r." display /></p>
    <p>推法值得记。正四面体的高 <Katex tex="h=\tfrac{\sqrt6}{3}a" />，底面外接圆半径 <Katex tex="\rho=\tfrac{\sqrt3}{3}a" />。设球心到底面的距离为 <Katex tex="r" />（内切球半径），球心到顶点的距离为 <Katex tex="R" />（外接球半径），则 <Katex tex="R+r=h" />；又球心到底面中心的距离为 <Katex tex="r" />，到底面某个顶点的距离为 <Katex tex="R" />，得到 <Katex tex="R^2=r^2+\rho^2" />。两式联立解出上面那组值。</p>
    <p>「<Katex tex="R=3r" />」这条比值可以直接用：题目只问半径比时不必套公式。正四面体还有第三种球——与六条棱都相切的棱切球，半径 <Katex tex="\tfrac{\sqrt2}{4}a" />，正好是外接球与内切球半径的几何平均。</p>

    <h3 class="sec" id="m3-ratio">相似与倍数关系</h3>
    <p>两个相似几何体的对应长度比为 <Katex tex="k" />，则面积比为 <Katex tex="k^2" />，体积比为 <Katex tex="k^3" />。这条结论对棱柱、棱锥、球都成立，也是台体体积公式里 <Katex tex="\sqrt{SS'}" /> 的来源：<Katex tex="S" /> 与 <Katex tex="S'" /> 是相似图形，面积比开方就是线性比。</p>
    <p>球的表面积与体积都只由半径决定，所以半径扩大 <Katex tex="k" /> 倍时，表面积扩大 <Katex tex="k^2" /> 倍，体积扩大 <Katex tex="k^3" /> 倍。反过来，已知两个球的表面积之比为 <Katex tex="4:9" />，则半径之比为 <Katex tex="2:3" />，体积之比为 <Katex tex="8:27" />。这类题只做一次开方、一次立方，不必先求半径的具体数值。</p>

    <h3 class="sec" id="m3-pit">球心与半径</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把内切球半径当成棱长的一半套用到所有多面体。</strong><Katex tex="r=\tfrac{a}{2}" /> 只对正方体成立。正四面体的内切球半径是 <Katex tex="\tfrac{\sqrt6}{12}a" />，比 <Katex tex="\tfrac{a}{2}" /> 小得多。</li>
        <li><strong>提示二：外接球的球心随手取在几何体中心。</strong>只有正方体、长方体、正四面体这类对称的几何体，球心才在几何中心或体对角线中点。一般三棱锥要先找外心，再用垂直平分面定位。</li>
        <li><strong>提示三：组合体的表面积只算外表面。</strong>挖空之后出现的内表面同样是表面。正方体挖去内切球后的表面积是 <Katex tex="6a^2+\pi a^2" />，比 <Katex tex="6a^2" /> 大。</li>
        <li><strong>提示四：把「棱切球」当成内切球。</strong>与面都相切的是内切球，与棱都相切的是棱切球，两者的半径不同。正方体的棱切球半径是 <Katex tex="\tfrac{\sqrt2}{2}a" />，内切球是 <Katex tex="\tfrac{a}{2}" />。</li>
      </ul>
    </div>
    <p>回收：积3 把柱、锥、台、球的公式用于多块拼合的情形。至此立体几何的度量部分收束，位1 起转入位置关系，标1 起把位置关系与度量都写成坐标运算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createMixLab } from '../../../boards/solid/measure/mixlab.js';
import { SM_CHAPTERS } from './mnav.js';
</script>
