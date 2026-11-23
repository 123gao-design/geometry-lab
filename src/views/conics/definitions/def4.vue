<template>
  <ChPage :cur="4" no="D4" base="/conics/def" :chapters="DEF_CHAPTERS"
    title="统一定义：离心率决定曲线类型" sub="|PF| / d(P, l) = e —— 一个比值 e，区分全部三种曲线。"
    :toc="[{ id: 'd4-def', t: '第二定义（统一定义）' }, { id: 'd4-board', t: 'e 的连续变形（图 D4）' }, { id: 'd4-board2', t: '三曲线同屏对比（图 D4b）' }, { id: 'd4-board3', t: 'e 如何塑形（图 D4c）' }, { id: 'd4-deriv1', t: '推导一 · 从第一定义长出第二定义' }, { id: 'd4-deriv2', t: '推导二 · 极坐标下的统一方程' }]">
    <p>到现在为止三种曲线各有各的定义：椭圆管和、双曲线管差、抛物线管等距。能否用<strong>同一个定义</strong>统一全部三种？可以 —— 把抛物线的定义松开一格："距离相等"改成"距离成定比"，三种曲线立刻统一进同一个定义。</p>
    <div class="note good" id="d4-def"><strong>圆锥曲线的统一定义（第二定义）</strong>：平面内到定点 F 与定直线 l（F 不在 l 上）的距离之比为常数 e 的点的轨迹，称为圆锥曲线。<strong>e &lt; 1 为椭圆，e = 1 为抛物线，e &gt; 1 为双曲线</strong>。e 即离心率，l 即准线。</div>

    <h3 class="sec" id="d4-board">拖动 e，看曲线变身</h3>
    <ConicFigure head="bottom" number="D4" title="固定焦点与准线，改变离心率" :factory="createUniDef"
      :legend="[['mint', '曲线'], ['orange', '焦半径'], ['blue', '到准线的距离']]">
      焦点 F 与准线 l 固定，只有 e 一个滑块。e &lt; 1 时曲线闭合成椭圆；e → 1 时左顶点趋向无穷远，曲线被拉成抛物线；e &gt; 1 时曲线裂成双曲线两支（P 可拖到任一支，两渐近方向之间是"禁区"）。读数区实时验证 |PF| / |PQ| = e。
    </ConicFigure>
    <p>重点观察 e 扫过 1 的那一瞬间：椭圆最左的顶点沿轴趋向无穷远，曲线"断开"；e 再大一点点，那个逃走的顶点<strong>从右边无穷远处绕回来</strong>，成为双曲线的另一支。椭圆与双曲线通过无穷远点首尾相接 —— 这正是子专题六射影几何视角下"圆锥曲线本是一家"的度量版本。</p>

    <h3 class="sec" id="d4-board2">三种曲线同屏对比</h3>
    <p>如果只盯着默认画面，统一定义容易给人留下"椭圆专场"的印象。把三个 e 值并排摆开，用<strong>同一条极坐标法则、同一条扫描线</strong>同时作画，就能比较曲线闭合、伸向无穷和分成两支的区别。</p>
    <ConicFigure head="bottom" number="D4b" title="同一方向在三种曲线上有几个交点" :factory="createTriConic"
      :legend="[['mint', '圆锥曲线'], ['guide', '准线', 'dashed'], ['orange', '焦半径'], ['blue', '到准线的距离']]">
      拖动方向角 θ，三张图用同一个方向发射射线。对双曲线分别点「朝向准线」「垂直于极轴」「背向准线」，对照两个、一个、零个有限交点。读数同时检验每个交点的焦准距离比。
    </ConicFigure>

    <h3 class="sec" id="d4-board3">e 不只分类，还塑形</h3>
    <p>离心率的第二重身份：在同一种曲线内部，它决定<strong>胖瘦与张口</strong>。由 <Katex tex="b^2 = a^2 - c^2" />（椭圆）与 <Katex tex="b^2 = c^2 - a^2" />（双曲线）立刻得到两个形状公式：</p>
    <Katex tex="\text{椭圆：}\ \dfrac{b}{a}=\sqrt{1-e^2}\ ;\qquad \text{双曲线：}\ \dfrac{b}{a}=\sqrt{e^2-1}" display />
    <p>固定 a 只调 e —— 椭圆从圆（<Katex tex="e = 0" />，两焦点重合于圆心）一路压扁成针（<Katex tex="e \to 1" />）；双曲线从窄口急转弯（<Katex tex="e \to 1^+" />）变成近乎两条直线的大张口（e 大），渐近线正是"特征矩形" <Katex tex="2a \times 2b" /> 的对角线：</p>
    <ConicFigure head="bottom" number="D4c" title="固定半轴 a，观察离心率塑形" :factory="createEShape"
      :legend="[['mint', '当前曲线'], ['gold', '焦点', 'point'], ['guide', '形状参照', 'dashed']]">
      椭圆模式下虚线圆是 <Katex tex="e = 0" /> 的参照，焦点随 e 增大而奔向两端；双曲线模式下灰色虚框是特征矩形，其对角线即渐近线，读数给出张口角 <Katex tex="2\cdot\arctan(b/a)" />。可切换两种模式把玩。
    </ConicFigure>

    <h3 class="sec" id="d4-deriv1">推导一：从第一定义长出第二定义</h3>
    <p>第二定义不是新来的外人 —— 它就藏在 D1 推导的中间步骤里。椭圆那行 <Katex tex="a\sqrt{(x-c)^2+y^2}=a^2-cx" />，把左边的根号还原成 <Katex tex="|PF_2|" />，右边提出 <Katex tex="c/a" />：</p>
    <Katex tex="|PF_2|=a-ex_0=\dfrac{c}{a}\left(\dfrac{a^2}{c}-x_0\right)=e\cdot d\!\left(P,\ x=\dfrac{a^2}{c}\right)" display />
    <p>读出来：<strong>椭圆上每一点到右焦点的距离，等于 e 倍到直线 <Katex tex="x = a^2/c" /> 的距离</strong>。这条直线就是椭圆的右准线（由对称性，<Katex tex="x = -a^2/c" /> 配左焦点）。双曲线同理可得：准线同样是 <Katex tex="x = \pm a^2/c" />，只是 <Katex tex="e > 1" /> —— 注意 <Katex tex="a^2/c < a" />，准线夹在中心与顶点之间。抛物线则干脆把"<Katex tex="e = 1" />"当作自己的原始定义。三种曲线全部满足第二定义，证毕。</p>

    <h3 class="sec" id="d4-deriv2">推导二：极坐标下的统一方程</h3>
    <p>以焦点为极点，令极轴指向准线，焦点与准线相距 <Katex tex="d" />。半直线上的点用实际距离 <Katex tex="r\ge0" /> 表示。焦准定义给出 <Katex tex="r=e|d-r\cos\theta|" />。取绝对值时必须区分准线两侧，因此有两个候选式。</p>
    <Katex tex="r_1=\frac{ed}{1+e\cos\theta},\qquad r_2=\frac{ed}{e\cos\theta-1}." display />
    <p>只接受分母为正的解。椭圆每个方向都有一个有限点。抛物线在背向准线的方向上没有有限点。对双曲线，若 <Katex tex="\cos\theta>1/e" />，同一条射线会穿过两支，各得到一个点。若 <Katex tex="\cos\theta\le -1/e" />，这条射线没有有限交点。分母趋于零，正对应渐近方向。</p>
    <p><strong>两个不同的圆极限。</strong> 固定焦准距 <Katex tex="d" />，<Katex tex="e\to0" /> 会使 <Katex tex="ed\to0" />，曲线缩到焦点。若想保留半径，则固定椭圆的长半轴 <Katex tex="a" />，相应地让 <Katex tex="d=a(1-e^2)/e" /> 增大。这时 <Katex tex="ed\to a" />，准线远去，曲线趋向半径为 <Katex tex="a" /> 的圆。图 D4 与图 D4c 固定的量不同，实验所得的形变也不同。</p>
    <p>有符号的极径可以用一个式子覆盖双曲线的两支，详见 <router-link to="/conics/par4">P4 极坐标方程</router-link>。两种写法都把 <Katex tex="ed" /> 读作半通径。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>使用说明</strong>：第二定义处理"到焦点距离"类问题极为顺手 —— 见到 |PF| 与到某直线距离的比值条件，先想统一定义；见到距离之和/之差，回到第一定义。定义之间的切换本身就是解题工具。</p>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createUniDef } from '../../../boards/conics/definitions/unidef.js';
import { createBoard as createTriConic } from '../../../boards/conics/definitions/triconic.js';
import { createBoard as createEShape } from '../../../boards/conics/definitions/eshape.js';
import { DEF_CHAPTERS } from './defnav.js';
</script>
