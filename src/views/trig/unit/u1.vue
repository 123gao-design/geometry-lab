<template>
  <ChPage :cur="1" no="U1" base="/trig/u" :chapters="U_CHAPTERS"
    title="单位圆定义与三角函数线" sub="把角放进单位圆：终边交点 P 的横、纵坐标直接定义为 cos α 与 sin α —— 锐角的「对边比斜边」推广成任意角的「坐标」，三条有向线段让三个函数值直接可读。"
    :toc="[{ id: 'u1-def', t: '从直角三角形到单位圆' }, { id: 'u1-line', t: '三角函数线' }, { id: 'u1-pit', t: '记号与无定义' }]">
    <div class="note good" id="u1-law"><strong>坐标定义</strong>：角 α 的终边交单位圆于 <Katex tex="P(\cos\alpha,\sin\alpha)" />（横 cos、纵 sin），<Katex tex="\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}\ (\cos\alpha\neq0)" />。<strong>有界</strong>：<Katex tex="|\sin\alpha|\le1,\ |\cos\alpha|\le1" />（P 在圆上）。<strong>象限符号</strong>：一全正、二正弦、三正切、四余弦。</div>
    <ConicFigure number="U1" title="单位圆上的三条函数线" head="bottom" :factory="createUnit">拖动 <Katex tex="P"/>，从横、纵坐标读出余弦和正弦，从切线上的有向位移读出正切。读数中每行的两个函数在都有定义时互为倒数。选 <Katex tex="90^\circ"/>，观察为什么正切无定义，而余切等于零。</ConicFigure>

    <h3 class="sec" id="u1-def">从直角三角形到单位圆</h3>
    <p>锐角三角函数靠直角三角形：<Katex tex="\sin" /> = 对边 ÷ 斜边。但三角形画不出 <Katex tex="120^\circ" />、更画不出 <Katex tex="-330^\circ" /> —— 要推广，先<strong>统一斜边</strong>：把角放进半径为 <Katex tex="1" /> 的单位圆（<RouterLink class="xref" to="/trig/b2">弧度制</RouterLink>一节已建立：弧长等于角的弧度数值），终边交点 <Katex tex="P" /> 的坐标就是现成的邻边与对边 ——<strong>横坐标即 <Katex tex="\cos" />、纵坐标即 <Katex tex="\sin" /></strong>，锐角情形自动对齐、任意角情形自动衔接：<Katex tex="P" /> 转进第二象限，纵坐标还在、横坐标变负，<Katex tex="\sin" /> 正 <Katex tex="\cos" /> 负全部自动成立，不需要任何新规则。两条有界性也直接可见：<Katex tex="P" /> 固定在圆上，坐标永远在 <Katex tex="[-1,1]" /> 里（界是 <Katex tex="1" />，且 <Katex tex="\pm1" /> 都取得到，与<RouterLink class="xref" to="/functions/s4">有界性与最值</RouterLink>同一条判据）。<Katex tex="\tan" /> 则是比值 <Katex tex="y/x" /> —— 下一节给它专属的几何形象。</p>

    <h3 class="sec" id="u1-line">三角函数线</h3>
    <p>三条<strong>有向线段</strong>把三个函数画成看得见的长度：<strong>正弦线 <Katex tex="MP" /></strong>（竖，蓝）、<strong>余弦线 <Katex tex="OM" /></strong>（横，橙）、<strong>正切线 <Katex tex="AT" /></strong>（过 <Katex tex="A(1,0)" /> 竖线上的绿段，<Katex tex="T" /> 是终边所在直线与该竖线的交点）。<Katex tex="AT" /> 的作用有两点：其一，它解释 <Katex tex="\tan" /> <strong>为什么无界</strong> —— <Katex tex="P" /> 靠近 <Katex tex="90^\circ" /> 时终边几乎竖直，与切线的交点 <Katex tex="T" /> 远出视野，<Katex tex="|\tan\alpha|" /> 可以任意大（图 U1 转到 <Katex tex="90^\circ" /> 附近看无定义）；其二，它提前写好 <Katex tex="\tan" /> 的<strong>周期是 <Katex tex="\pi" /></strong> —— 终边转半圈回到同一条直线上，<Katex tex="T" /> 原地不动。符号也不必死背口诀：第二象限 <Katex tex="MP" /> 朝上（<Katex tex="\sin\alpha\gt0" />）、<Katex tex="OM" /> 朝左（<Katex tex="\cos\alpha\lt0" />），「一全正、二正弦、三正切、四余弦」全部从图上读出 —— 口诀只是压缩记忆，图才是依据。</p>

    <h3 class="sec" id="u1-pit">记号与无定义</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="P(\cos\alpha,\sin\alpha)" /> 横纵别写反。</strong>横坐标是 <Katex tex="\cos" />、纵坐标是 <Katex tex="\sin" /> —— 与习惯的 <Katex tex="(x,y)" /> 对应 <Katex tex="(x,y)=(\cos\alpha,\sin\alpha)" />。</li>
        <li><strong>提示二：无定义不等于无穷大。</strong><Katex tex="\tan\frac{\pi}{2}" /> 处 <Katex tex="\cos=0" />，除法不成立 —— 不能写「<Katex tex="=\infty" />」（<Katex tex="\infty" /> 不是数；「=」两侧须是同一类对象，见<RouterLink class="xref" to="/sets/x1">子集与真子集：⊆、⊊ 与 =</RouterLink>）；正确说法是「在 <Katex tex="x\neq\frac{\pi}{2}+k\pi" /> 处才有定义」。</li>
        <li><strong>提示三：特殊角表要熟记。</strong><Katex tex="0,\ \tfrac{\pi}{6},\ \tfrac{\pi}{4},\ \tfrac{\pi}{3},\ \tfrac{\pi}{2}" /> 处 <Katex tex="\sin" /> 依次为 <Katex tex="\tfrac{\sqrt{0}}{2},\tfrac{\sqrt{1}}{2},\tfrac{\sqrt{2}}{2},\tfrac{\sqrt{3}}{2},\tfrac{\sqrt{4}}{2}" />（根号数列记忆），<Katex tex="\cos" /> 倒序。</li>
        <li><strong>提示四：函数线是有向线段。</strong>长度记录方向：<Katex tex="AT" /> 朝下取负、<Katex tex="OM" /> 朝左取负 —— 别当普通线段量绝对值。</li>
      </ul>
    </div>
    <p>三个函数已经定义，下一章看它们互相之间的<strong>内部表达式</strong>：平方关系与商数关系 —— 两条恒等式把 <Katex tex="\sin" />、<Katex tex="\cos" />、<Katex tex="\tan" /> 联结成一张三角形的勾股对照表。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createUnit } from '../../../boards/trig/unit/unitline.js';
import { U_CHAPTERS } from './unav.js';
</script>
