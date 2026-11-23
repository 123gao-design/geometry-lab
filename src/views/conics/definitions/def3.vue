<template>
  <ChPage :cur="3" no="D3" base="/conics/def" :chapters="DEF_CHAPTERS"
    title="抛物线：等距离的平衡" sub="|PF| = d(P, l) —— 一个焦点、一条准线，不多不少刚好相等。"
    :toc="[{ id: 'd3-def', t: '抛物线的定义（图 D3）' }, { id: 'd3-deriv', t: '标准方程的推导' }, { id: 'd3-latus', t: '推论 · 焦半径与通径' }, { id: 'd3-four', t: '四种朝向' }]">
    <p>椭圆和双曲线都需要两个焦点。抛物线换了一套配置：<strong>一个定点配一条定直线</strong>，动点到两者的距离精确相等。生活中它无处不在 —— 抛出的篮球、喷泉的水柱、卫星天线锅的剖面，都是这条曲线。</p>
    <div class="note good" id="d3-def"><strong>抛物线的定义</strong>：平面内到一个定点 F 与一条定直线 l（F 不在 l 上）距离相等的点的轨迹，称为<strong>抛物线</strong> <span class="term">(parabola)</span>。F 称为<strong>焦点</strong>，l 称为<strong>准线</strong> <span class="term">(directrix)</span>；F 到 l 的距离记为 p（焦参数），焦点与顶点的距离为 p/2。</div>
    <div class="board-wrap">
      <BoardMount :factory="createParaDef" />
      <div class="cap">图 D3 · <b>抛物线的定义</b>：拖动 P，橙线 |PF| 与蓝线 |PQ|（P 到准线的垂距）永远一样长，差值读数恒为 0。滑块 p 控制开口大小；打开「显示通径」可看过焦点垂直于轴的那条弦 —— 它的长度恰为 2p。</div>
    </div>

    <h3 class="sec" id="d3-deriv">标准方程的推导：只需平方一次</h3>
    <p>取过 F 且垂直于 l 的直线为 x 轴，F 与 l 的垂线段中点为原点（这样曲线顶点恰在原点，方程最简）。设焦参数为 p，则 <Katex tex="F(p/2,\ 0)" />，准线 l：<Katex tex="x = -p/2" />。定义给出：</p>
    <Katex tex="\sqrt{\left(x-\tfrac{p}{2}\right)^2+y^2}=\left|x+\tfrac{p}{2}\right|" display />
    <p>这次只有<strong>一个</strong>根号，平方一次即净：</p>
    <Katex tex="x^2-px+\tfrac{p^2}{4}+y^2=x^2+px+\tfrac{p^2}{4}\ \Longrightarrow\ \boxed{\,y^2=2px\,}" display />
    <p>对照椭圆、双曲线的"两次平方"，抛物线方程只有一项二次 —— 它是二次曲线中唯一的"一次函数型"成员，这也是它介于椭圆与双曲线之间的代数印记（e = 1，D4 详解）。</p>

    <h3 class="sec" id="d3-latus">推论：焦半径与通径</h3>
    <p>由定义，焦半径直接可得：<strong><Katex tex="|PF| = x_0 + p/2" /></strong>（P 到准线的距离）。过焦点且垂直于轴的弦称为<strong>通径</strong> <span class="term">(latus rectum)</span>：把 <Katex tex="x = p/2" /> 代入 <Katex tex="y^2 = 2px" /> 得 <Katex tex="y = \pm p" />，所以</p>
    <Katex tex="\text{通径长}=2p" display />
    <p>通径是抛物线"开口宽度"的天然标尺：在图 D3 中调大 p，通径与开口同步变宽。椭圆的通径长为 <Katex tex="2b^2/a" />（代入 <Katex tex="x = c" /> 可得），双曲线相同 —— 通径公式是三类曲线通用的。</p>

    <h3 class="sec" id="d3-four">四种朝向：标准方程一览</h3>
    <p>焦点可以在准线的右侧、左侧、上侧、下侧，对应四种标准方程。判断口诀：<strong>一次项字母定轴向，系数符号定朝向</strong>。</p>
    <table>
      <tbody>
        <tr><th>方程</th><th>焦点</th><th>准线</th><th>开口</th></tr>
        <tr><td><Katex tex="y^2=2px" /></td><td><Katex tex="(p/2,\ 0)" /></td><td><Katex tex="x = -p/2" /></td><td>向右</td></tr>
        <tr><td><Katex tex="y^2=-2px" /></td><td><Katex tex="(-p/2,\ 0)" /></td><td><Katex tex="x = p/2" /></td><td>向左</td></tr>
        <tr><td><Katex tex="x^2=2py" /></td><td><Katex tex="(0,\ p/2)" /></td><td><Katex tex="y = -p/2" /></td><td>向上</td></tr>
        <tr><td><Katex tex="x^2=-2py" /></td><td><Katex tex="(0,\ -p/2)" /></td><td><Katex tex="y = p/2" /></td><td>向下</td></tr>
      </tbody>
    </table>
    <p>有人把抛物线看作"一个焦点被推到无穷远的椭圆"：固定左焦点与左顶点，把右焦点拖向无穷远，椭圆越来越长，极限就是抛物线。这个直觉在 D4 的统一定义里会被精确化 —— 那就是离心率 e → 1 的极限。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createParaDef } from '../../../boards/conics/definitions/paradef.js';
import { DEF_CHAPTERS } from './defnav.js';
</script>
