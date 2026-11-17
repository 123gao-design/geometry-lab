<template>
  <ChPage :cur="2" no="L2" base="/conics/lin" :chapters="LIN_CHAPTERS"
    title="韦达定理与弦长公式" sub="联立之后别急着求根：对称多项式 $x_1+x_2$、$x_1x_2$ 把「根」整包取走 —— 弦长、中点、面积全都不需要知道根本身。流程第二道步骤。"
    :toc="[{ id: 'l2-lab', t: '弦长机实验（图 L2）' }, { id: 'l2-der', t: '推导 · 韦达四件套与弦长' }, { id: 'l2-mid', t: '中点与点差法' }, { id: 'l2-use', t: '速用三则' }]">
    <div class="note good"><strong>本讲主角</strong>：联立消元得 <Katex tex="Ax^2+Bx+C=0" /> 后，韦达定理立刻奉上 <Katex tex="x_1+x_2=-\tfrac{B}{A}" /> 与 <Katex tex="x_1x_2=\tfrac{C}{A}" />。凡目标式对称（只含 <Katex tex="x_1+x_2" />、<Katex tex="x_1x_2" />），就不必求根 —— 这是整条解析几何流程最省力的一步。</div>

    <h3 class="sec" id="l2-lab">弦长机实验</h3>
    <div class="board-wrap">
      <BoardMount :factory="createChordLen" />
      <div class="cap">图 L2 · <b>弦长公式</b>：拖直线扫过椭圆，弦 AB、中点 M 实时读数。读数区把两套弦长公式并排亮出：<strong>实测弦长 <Katex tex="=\tfrac{\sqrt{\Delta}}{|A|}" />（沿线参数）<Katex tex="=\sqrt{1+k^2}\cdot|x_1-x_2|" /></strong>，中点读数则实时验证 <strong><Katex tex="k_{\text{chord}}\cdot k_{OM}=-\tfrac{b^2}{a^2}" /></strong>（A2 的点差法在此 live）。</div>
    </div>

    <h3 class="sec" id="l2-der">推导：韦达四件套与弦长</h3>
    <p>弦长公式的关键在一个平方差里：</p>
    <Katex tex="|x_1-x_2|=\sqrt{(x_1+x_2)^2-4x_1x_2}=\frac{\sqrt{\Delta}}{|A|}" display />
    <p>再把斜放的长度摆正 —— 直线上两点距离按水平投影放大 <Katex tex="\sqrt{1+k^2}" /> 倍：</p>
    <Katex tex="L=\sqrt{1+k^2}\cdot|x_1-x_2|=\sqrt{1+k^2}\cdot\frac{\sqrt{\Delta}}{|A|}" display />
    <p>两条注脚：<strong>竖直线</strong>（k→∞）改用 <Katex tex="L=|y_1-y_2|" />，或干脆把直线设成 <Katex tex="x=my+n" /> 一步避开；<strong>抛物线 y²=2px</strong> 常设 <Katex tex="x=my+n" /> 代入 —— 消元后是 y 的一元二次，永不退化（对照 L1 的第四态：x=my+n 永远不平行对称轴）。</p>

    <h3 class="sec" id="l2-mid">中点与点差法</h3>
    <p>弦的中点坐标就是韦达的平均：<Katex tex="x_0=\tfrac{x_1+x_2}{2}" />、<Katex tex="y_0=\tfrac{y_1+y_2}{2}" />。在椭圆上，中点 M 与弦斜率立刻被 A2 的<strong>共轭</strong>关系唯一确定：</p>
    <Katex tex="k_{\text{chord}}\cdot k_{OM}=-\frac{b^2}{a^2}" display />
    <p>画板里无论怎么拖，这个乘积纹丝不动 —— A2 的点差法（差两下、相减）与本讲的中点公式（韦达、求和）是<strong>同一件事的减法版与加法版</strong>。要警惕的也一致：点差法只给必要条件，M 若在椭圆外，算出的"弦"并无实根（Δ&lt;0），务必回验。</p>

    <h3 class="sec" id="l2-use">速用三则</h3>
    <p><strong>① 通径最短</strong>：过焦点的弦里通径最短 —— 用弦长公式算一次即知（P3 的 <Katex tex="L=2ed/(1-e^2\cos^2\theta)" /> 正是本讲公式代入焦点条件后的成品）。<strong>② 面积</strong>：<Katex tex="S=\tfrac12|AB|\cdot d(F,\ l)" />，弦长 × 点线距离，两个都已在手。<strong>③ 抛物线焦点弦的特产</strong>：联立后韦达直接给 <Katex tex="y_1y_2=-p^2" />、<Katex tex="x_1x_2=\tfrac{p^2}{4}" /> —— 两个对称常数，是 P3 经典题清单的核心素材。</p>
    <p><strong>回收</strong>：A2 点差法（中点公式加法版）、P3 焦点弦（弦长公式的焦点特供）、T1 切线（<Katex tex="\Delta=0" /> 特例）、L1 判别式（<Katex tex="\sqrt{\Delta}" /> 的来源）。下一讲把讨论对象从线转向点：点位判内外，极线的三个角色。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createChordLen } from '../../../boards/conics/lines/chordlen.js';
import { LIN_CHAPTERS } from './linnav.js';
</script>
