<template>
  <ChPage :cur="1" no="U1" base="/trig/u" :chapters="U_CHAPTERS"
    title="单位圆定义与三角函数线" sub="把角放进单位圆：终边交点 P 的横、纵坐标直接定义为 cos α 与 sin α —— 锐角的「对边比斜边」推广成任意角的「坐标」，三条有向线段让三个函数值直接可读。"
    :toc="[{ id: 'u1-def', t: '从直角三角形到单位圆' }, { id: 'u1-line', t: '三角函数线' }, { id: 'u1-pit', t: '记号与无定义' }]">
    <div class="note good" id="u1-law"><strong>坐标定义</strong>：角 α 的终边交单位圆于 <Katex tex="P(\cos\alpha,\sin\alpha)" />（横 cos、纵 sin），<Katex tex="\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}\ (\cos\alpha\neq0)" />。<strong>有界</strong>：<Katex tex="|\sin\alpha|\le1,\ |\cos\alpha|\le1" />（P 在圆上）。<strong>象限符号</strong>：一全正、二正弦、三正切、四余弦。</div>
    <div class="board-wrap">
      <BoardMount :factory="createUnit" />
      <div class="cap">图 U1 · <b>单位圆上的三条函数线</b>：拖 P 转圈 —— 蓝线 MP=sin、橙线 OM=cos、绿线 AT=tan 三条函数线实时读数；七个预设角给出精确值，⏩ 巡游看符号随象限翻转、转到 90° 看 tan 无定义。</div>
    </div>

    <h3 class="sec" id="u1-def">从直角三角形到单位圆</h3>
    <p>锐角三角函数靠直角三角形：sin = 对边/斜边。但三角形画不出 120°、更画不出 −330° —— 要推广，先<strong>统一斜边</strong>：把角放进半径 1 的单位圆（B2 的铺垫：弧长=角度数值），终边交点 P 的坐标就是现成的邻边与对边 ——<strong>横坐标即 cos、纵坐标即 sin</strong>，锐角情形自动对齐、任意角情形自动衔接：P 转进第二象限，纵坐标还在、横坐标变负，sin 正 cos 负全部自动成立，不需要任何新规则。两条有界性也直接可见：P 固定在圆上，坐标永远在 <Katex tex="[-1,1]" /> 里（回收 S4 有界性：界是 1，且 ±1 都取得到）。tan 则是比值 <Katex tex="y/x" /> —— 下一节给它专属的几何形象。</p>

    <h3 class="sec" id="u1-line">三角函数线</h3>
    <p>三条<strong>有向线段</strong>把三个函数画成看得见的长度：<strong>正弦线 MP</strong>（竖，蓝）、<strong>余弦线 OM</strong>（横，橙）、<strong>正切线 AT</strong>（过 A(1,0) 竖线上的绿段，T 是终边所在直线与该竖线的交点）。AT 的作用有两点：其一，它解释 <strong>tan 为什么无界</strong> —— P 靠近 90° 时终边几乎竖直，与切线的交点 T 远出视野，|tan| 可以任意大（图 U1 转到 90° 附近看无定义）；其二，它提前写好 tan 的<strong>周期是 π</strong> —— 终边转半圈回到同一条直线上，T 原地不动。符号也不必死背口诀：第二象限 MP 朝上（sin +）、OM 朝左（cos −），「一全正、二正弦、三正切、四余弦」全部从图上读出 —— 口诀只是压缩记忆，图才是依据。</p>

    <h3 class="sec" id="u1-pit">记号与无定义</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：P(cos α, sin α) 横纵别写反。</strong>横坐标是 cos、纵坐标是 sin —— 与习惯的 (x, y) 对应 <Katex tex="(x,y)=(\cos\alpha,\sin\alpha)" />。</li>
        <li><strong>提示二：无定义不等于无穷大。</strong><Katex tex="\tan\frac{\pi}{2}" /> 处 cos=0，除法不成立 —— 不能写「=∞」（∞ 不是数，回收 X1 式的外延讲究）；正确说法是「在 <Katex tex="x\neq\frac{\pi}{2}+k\pi" /> 处才有定义」。</li>
        <li><strong>提示三：特殊角表是硬通货。</strong><Katex tex="0,\ \tfrac{\pi}{6},\ \tfrac{\pi}{4},\ \tfrac{\pi}{3},\ \tfrac{\pi}{2}" /> 处 sin 依次为 <Katex tex="\tfrac{\sqrt{0}}{2},\tfrac{\sqrt{1}}{2},\tfrac{\sqrt{2}}{2},\tfrac{\sqrt{3}}{2},\tfrac{\sqrt{4}}{2}" />（根号数列记忆），cos 倒序。</li>
        <li><strong>提示四：函数线是有向线段。</strong>长度记录方向：AT 朝下取负、OM 朝左取负 —— 别当普通线段量绝对值。</li>
      </ul>
    </div>
    <p>三个函数已经定义，下一章看它们互相之间的<strong>内部表达式</strong>：平方关系与商数关系 —— 两条恒等式把 sin、cos、tan 联结成一张三角形的勾股对照表。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createUnit } from '../../../boards/trig/unit/unitline.js';
import { U_CHAPTERS } from './unav.js';
</script>
