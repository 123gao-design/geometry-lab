<template>
  <ChPage :cur="4" no="D4" base="/conics/def" :chapters="DEF_CHAPTERS"
    title="统一定义：离心率决定曲线类型" sub="|PF| / d(P, l) = e —— 一个比值 e，区分全部三种曲线。"
    :toc="[{ id: 'd4-def', t: '第二定义（统一定义）' }, { id: 'd4-board', t: '实验一 · e 的连续变形（图 D4）' }, { id: 'd4-board2', t: '实验二 · 三曲线同屏对比（图 D4b）' }, { id: 'd4-board3', t: '实验三 · e 如何塑形（图 D4c）' }, { id: 'd4-deriv1', t: '推导一 · 从第一定义长出第二定义' }, { id: 'd4-deriv2', t: '推导二 · 极坐标下的统一方程' }]">
    <p>到现在为止三种曲线各有各的定义：椭圆管和、双曲线管差、抛物线管等距。能否用<strong>同一个定义</strong>统一全部三种？可以 —— 把抛物线的定义松开一格："距离相等"改成"距离成定比"，三种曲线立刻统一进同一个定义。</p>
    <div class="note good" id="d4-def"><strong>圆锥曲线的统一定义（第二定义）</strong>：平面内到定点 F 与定直线 l（F 不在 l 上）的距离之比为正常数 e 的点的轨迹，称为圆锥曲线。<strong>0 &lt; e &lt; 1 为椭圆，e = 1 为抛物线，e &gt; 1 为双曲线</strong>。e 即离心率，l 即准线。</div>

    <h3 class="sec" id="d4-board">实验一：固定焦点与准线</h3>
    <div class="board-wrap">
      <BoardMount :factory="createUniDef" />
      <div class="cap">图 D4 · <b>圆锥曲线的统一定义</b>。拖动曲线上的 P，橙色实线是焦点距离，青色虚线是垂直于准线的距离。两段线的长度随 P 改变，读数区的比值始终等于当前离心率 e。</div>
    </div>
    <p>固定焦点和准线，令 e 从 1 的两侧趋近于 1。在任一固定的有限视窗中，可见曲线趋近抛物线。椭圆的远端顶点向左移出视窗，双曲线远支的顶点在 e 刚超过 1 时位于右侧视窗之外。</p>

    <h3 class="sec" id="d4-board2">实验二：三种曲线同屏对比</h3>
    <p>如果只盯着默认画面，统一定义容易给人留下"椭圆专场"的印象。把三个 e 值并排摆开，用<strong>同一条极坐标法则、同一条扫描线</strong>同时作画，三种命运的对照就一目了然了：</p>
    <div class="board-wrap">
      <BoardMount :factory="createTriConic" />
      <div class="cap">图 D4b · <b>三种圆锥曲线的对比</b>：三个面板各有一对"焦点 + 准线"，e 分别取 0.55、1、2.2。点「重新同步扫描」，三条曲线被同一个转动的方向角同时画出 —— 椭圆闭合，抛物线在一个方向上去而不返，双曲线裂成两支且两个渐近方向之间出现"禁区"。每个面板的读数实时验证 |PF| / |PQ| ≡ e。</div>
    </div>

    <h3 class="sec" id="d4-board3">实验三：e 不只分类，还塑形</h3>
    <p>离心率也决定半轴之比。由 <Katex tex="b^2 = a^2 - c^2" />（椭圆）与 <Katex tex="b^2 = c^2 - a^2" />（双曲线）得到</p>
    <Katex tex="\text{椭圆：}\ \dfrac{b}{a}=\sqrt{1-e^2}\ ;\qquad \text{双曲线：}\ \dfrac{b}{a}=\sqrt{e^2-1}" display />
    <p>固定椭圆的长半轴 a 时，<Katex tex="e=0" /> 给出半径为 a 的圆，<Katex tex="e\to1^-" /> 时短半轴趋于零，椭圆收缩为长轴线段。双曲线的渐近线沿特征矩形 <Katex tex="2a \times 2b" /> 的对角线方向。固定实半轴 a 时，e 越大，右支对应的两条渐近射线之间的角越大。</p>
    <div class="board-wrap">
      <BoardMount :factory="createEShape" />
      <div class="cap">图 D4c · <b>离心率对曲线形状的影响</b>。点击「对照 e → 1」，用同一个 e 比较两种固定条件。虚线分别标出有限视窗内的极限抛物线和固定长半轴时的极限线段。</div>
    </div>

    <h3 class="sec" id="d4-deriv1">推导一：从第一定义长出第二定义</h3>
    <p>第二定义不是新来的外人 —— 它就藏在 D1 推导的中间步骤里。椭圆那行 <Katex tex="a\sqrt{(x-c)^2+y^2}=a^2-cx" />，把左边的根号还原成 <Katex tex="|PF_2|" />，右边提出 <Katex tex="c/a" />：</p>
    <Katex tex="|PF_2|=a-ex_0=\dfrac{c}{a}\left(\dfrac{a^2}{c}-x_0\right)=e\cdot d\!\left(P,\ x=\dfrac{a^2}{c}\right)" display />
    <p>读出来：<strong>椭圆上每一点到右焦点的距离，等于 e 倍到直线 <Katex tex="x = a^2/c" /> 的距离</strong>。这条直线就是椭圆的右准线（由对称性，<Katex tex="x = -a^2/c" /> 配左焦点）。双曲线同理可得：准线同样是 <Katex tex="x = \pm a^2/c" />，只是 <Katex tex="e > 1" /> —— 注意 <Katex tex="a^2/c < a" />，准线夹在中心与顶点之间。抛物线则干脆把"<Katex tex="e = 1" />"当作自己的原始定义。三种曲线全部满足第二定义，证毕。</p>

    <h3 class="sec" id="d4-deriv2">推导二：极坐标下的统一方程</h3>
    <p>以 F 为极点、垂直于准线且<strong>指向准线</strong>的一侧为极轴，记 F 到 l 的距离为 d。设 P 的极坐标为 <Katex tex="(r,\theta)" />，且 <Katex tex="r\ge0" />。P 到准线的距离为 <Katex tex="|d-r\cos\theta|" />。当 P 和 F 在准线同侧时，距离等于 <Katex tex="d-r\cos\theta" />，由定义得到</p>
    <Katex tex="r=\dfrac{ed}{1+e\cos\theta}" display />
    <p>三种曲线的全部区别，只在于分母 <Katex tex="1 + e\cos\theta" /> 有没有、有几个零点：</p>
    <ul>
      <li><strong>0 &lt; e &lt; 1</strong>。分母恒正，r 有界，得到封闭的椭圆。</li>
      <li><strong>e = 1</strong>。θ 趋近 π 时，分母趋于零且 r 趋于无穷，得到抛物线。</li>
      <li><strong><Katex tex="e > 1" /></strong>。分母有两个零点，对应渐近方向。双曲线的另一支与焦点分居准线两侧，此时解得 <Katex tex="r=ed/(e\cos\theta-1)" />，其中 <Katex tex="e\cos\theta>1" />。</li>
    </ul>
    <p>分子 <Katex tex="ed" /> 是<strong>半通径</strong>，即过焦点且垂直于轴的半弦长。在 d 固定的条件下，<Katex tex="e\to0^+" /> 时 r 一致趋于零，轨迹收缩到焦点。图 D4c 中的圆来自固定长半轴的条件。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>使用说明</strong>：第二定义处理"到焦点距离"类问题极为顺手 —— 见到 |PF| 与到某直线距离的比值条件，先想统一定义；见到距离之和/之差，回到第一定义。定义之间的切换本身就是解题工具。</p>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createUniDef } from '../../../boards/conics/definitions/unidef.js';
import { createBoard as createTriConic } from '../../../boards/conics/definitions/triconic.js';
import { createBoard as createEShape } from '../../../boards/conics/definitions/eshape.js';
import { DEF_CHAPTERS } from './defnav.js';
</script>
