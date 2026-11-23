<template>
  <ChPage :cur="1" no="L1" base="/conics/lin" :chapters="LIN_CHAPTERS"
    title="判别式一览：相交、相切、相离（与第四态）" sub="解析几何的主力流程：联立消元 → 判别式定状态 → 韦达定读数。本讲把「直线与圆锥曲线」的三种位置关系一表归纳，并指出判别式失效的第四态 —— 双曲线的渐近线方向与抛物线的对称轴方向。"
    :toc="[{ id: 'l1-lab', t: '判别式与位置关系（图 L1）' }, { id: 'l1-der', t: '推导 · 消元与 Δ' }, { id: 'l1-4', t: '第四态 · 双曲线与抛物线' }, { id: 'l1-table', t: '结论表与回收' }]">
    <div class="note good"><strong>本讲主角</strong>：直线与圆锥曲线的位置关系，一块画板就能全部读出。把直线写成 <Katex tex="y=kx+m" /> 代入曲线方程，消元得一个二次方程 <Katex tex="At^2+Bt+C=0" /> —— <strong>Δ 的符号就是位置关系的判据</strong>：Δ&gt;0 相交（两点）、Δ=0 相切（一点）、Δ&lt;0 相离（零点）。整个子专题六就是围绕这条流程的三道步骤：判别式（本讲）→ 韦达定理与弦长（L2）→ 点位与极线（L3）。</div>

    <h3 class="sec" id="l1-lab">判别式与位置关系</h3>
    <ConicFigure head="bottom" number="L1" title="判别式、交点与无穷远方向" :factory="createLineConic"
      :legend="[['mint', '圆锥曲线'], ['orange', '待检直线'], ['gold', '画面内的交点', 'point'], ['guide', '渐近线', 'dashed']]">
      拖动 P₀ 改变直线的位置，用滑块改变方向。依次点「接近渐近方向」「平行于渐近线」「沿渐近线」，比较画不下的有限点、无穷远交点和无穷远切点。
    </ConicFigure>
    <p>值得盯住的一件事：椭圆模式里无论怎么调，A 永远是 <Katex tex="b^2+a^2k^2>0" /> —— 椭圆没有第四态。双曲线的 A 是 <Katex tex="b^2-a^2k^2" />，会在 <Katex tex="k=\pm\tfrac{b}{a}" />（渐近线方向）归零；抛物线的 A 是 <Katex tex="k^2" />，在 k=0（对称轴方向）归零。第四态不是刁难，是「无穷远」在敲门。</p>

    <h3 class="sec" id="l1-der">推导：消元与 Δ</h3>
    <p>以椭圆为例，把 <Katex tex="y=kx+m" /> 代入 <Katex tex="\tfrac{x^2}{a^2}+\tfrac{y^2}{b^2}=1" />，通分即得</p>
    <Katex tex="(b^2+a^2k^2)\,x^2+2a^2km\,x+(a^2m^2-a^2b^2)=0" display />
    <p>判别式展开后惊人地干净：</p>
    <Katex tex="\Delta=4a^2b^2\,\big(b^2+a^2k^2-m^2\big)" display />
    <p>于是 <strong>相切 <Katex tex="\iff m^2=a^2k^2+b^2" /></strong> —— 把它写回直线，正是 T1 速查表里那条斜率为 k 的切线公式 <Katex tex="y=kx\pm\sqrt{a^2k^2+b^2}" />。也就是说：<strong>T1 的「判别式来源」不是巧合，是判别式结论的直接推论</strong>。画板里把直线拖到恰好相切，读数区会看到 <Katex tex="\Delta" /> 归零的那一瞬。</p>

    <h3 class="sec" id="l1-4">第四态：双曲线与抛物线</h3>
    <p>把同一条直线代入双曲线 <Katex tex="\tfrac{x^2}{a^2}-\tfrac{y^2}{b^2}=1" />，二次项变成 <Katex tex="b^2-a^2k^2" />：</p>
    <Katex tex="b^2-a^2k^2=0\iff k=\pm\frac{b}{a}\iff \text{方向平行于渐近线}" display />
    <p>若直线与渐近线平行且不重合，代入后确实是<strong>一次方程</strong>。它给出一个有限交点，另一个交点在无穷远。若直线就是渐近线，二次项和一次项都会消失，因此无有限交点。抛物线同理：代入 <Katex tex="y^2=2px" /> 得 <Katex tex="k^2x^2+(2km-2p)x+m^2=0" />，k=0（水平线，平行于对称轴）时退化一次方程，恒交一点 —— 这就是「与抛物线只有一个公共点的直线」里除切线外的另一族。</p>
    <p>把直线参数写成齐次坐标 <Katex tex="[t:w]" />，交点方程是 <Katex tex="At^2+Btw+Cw^2=0" />。<Katex tex="A=0" /> 时方程含因子 <Katex tex="w" />，对应无穷远点。若 <Katex tex="A=B=0" />、<Katex tex="C\ne0" />，它含因子 <Katex tex="w^2" />，无穷远点成为二重交点，直线就是该点的切线。这与 <router-link to="/conics/ch5">配极实验中的渐近线</router-link> 是同一个结论。若 <Katex tex="A" /> 只是非常小，两个实根仍可能都有限，读数会把出视窗的根单独计数。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：「直线与双曲线只有一个公共点」⇏ 相切。</strong>正确分类是相切（Δ=0）<em>或</em> 与渐近线平行且不重合（A=0）—— 两种成因，答案要分情况。</li>
        <li><strong>提示二：抛物线的情形同理。</strong>「与抛物线只有一个公共点」= 切线 <em>或</em> 平行于对称轴的直线。</li>
        <li><strong>提示三：先看系数再算判别式。</strong>凡用 Δ，先检查二次项系数是否为零。</li>
      </ul>
    </div>

    <h3 class="sec" id="l1-table">结论表与回收</h3>
    <table>
      <tbody>
        <tr><th>曲线</th><th>消元后二次项系数</th><th>第四态（A=0）</th><th>「只有一个公共点」的两种原因</th></tr>
        <tr><td>椭圆</td><td><Katex tex="b^2+a^2k^2>0" />（恒二次）</td><td>无</td><td>只有相切</td></tr>
        <tr><td>双曲线</td><td><Katex tex="b^2-a^2k^2" /></td><td><Katex tex="k=\pm\tfrac{b}{a}" />（渐近方向）</td><td>相切，或与渐近线平行且不重合</td></tr>
        <tr><td>抛物线</td><td><Katex tex="k^2" /></td><td><Katex tex="k=0" />（对称轴方向）</td><td>相切，或平行于对称轴</td></tr>
      </tbody>
    </table>
    <p><strong>回收</strong>：T1 的判别式来源与本讲的相切条件 <Katex tex="m^2=a^2k^2+b^2" /> 逐字一致；D2 的渐近线在这里以「判别式失效处」的角色重现；P3 的焦点弦是 Δ 应用的主要例子（下一讲由韦达定理直接算出）。下一讲把流程的第二道步骤补齐：韦达定理与弦长公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLineConic } from '../../../boards/conics/lines/lineconic.js';
import { LIN_CHAPTERS } from './linnav.js';
</script>
