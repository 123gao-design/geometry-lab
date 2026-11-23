<template>
  <ChPage :cur="2" no="D2" base="/conics/def" :chapters="DEF_CHAPTERS"
    title="双曲线：距离之差的绝对值" sub="第一定义 $\bigl||PF_1| - |PF_2|\bigr| = 2a$ —— 一支追不上，就裂成两支。"
    :toc="[{ id: 'd2-def', t: '第一定义（图 D2）' }, { id: 'd2-deriv', t: '标准方程的推导' }, { id: 'd2-asym', t: '推论 · 渐近线' }, { id: 'd2-radius', t: '推论 · 焦半径与退化情形' }]">
    <p>椭圆问的是"距离之和为定值"。自然的对偶问题是：<strong>距离之差为定值</strong>呢？经验立刻提醒：<Katex tex="|PF_1| - |PF_2|" /> 可正可负，而"等于 <Katex tex="2a" />"与"等于 <Katex tex="-2a" />"描述的是对称的两半 —— 所以定义里必须带上绝对值，或者说，曲线天生就是<strong>两支</strong>。</p>
    <div class="note good" id="d2-def"><strong>双曲线的第一定义</strong>：平面内到两个定点 <Katex tex="F_1" />、<Katex tex="F_2" /> 的距离之差的绝对值为常数 <Katex tex="2a" />（要求 <Katex tex="0 < 2a < |F_1F_2|" />）的点 P 的轨迹，称为<strong>双曲线</strong> <span class="term">(hyperbola)</span>。<Katex tex="F_1" />、<Katex tex="F_2" /> 为焦点，<Katex tex="|F_1F_2| = 2c" /> 为焦距；离 <Katex tex="F_2" /> 近的那支（右支）上 <Katex tex="|PF_1| - |PF_2| = +2a" />，左支上为 <Katex tex="-2a" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createHypDef" />
      <div class="cap">图 D2 · <b>双曲线的第一定义</b>：拖动 P（拖过 y 轴即换支），底部长度条中蓝橙两条从同一原点出发，端点之差恒等于 2a。虚线是两条渐近线 —— 把 P 拖向远方，曲线与渐近线几乎贴合。滑块 a、c 重塑形状，注意这次要求 c &gt; a，与椭圆恰好相反。</div>
    </div>

    <h3 class="sec" id="d2-deriv">标准方程的推导：同样的两次平方</h3>
    <p>建系方式与椭圆完全相同：<Katex tex="F_1(-c,\ 0)" />、<Katex tex="F_2(c,\ 0)" />。定义写成：</p>
    <Katex tex="\left|\sqrt{(x+c)^2+y^2}-\sqrt{(x-c)^2+y^2}\right|=2a" display />
    <p>去掉绝对值，即根号之差等于 <Katex tex="\pm 2a" />。重复椭圆的"移项平方"流程 —— 妙处在于：<strong><Katex tex="\pm" />号在平方中被吃掉</strong>，所以最终一个方程自动囊括两支。中间步骤与椭圆逐行平行，只是把 <Katex tex="a^2 - c^2" /> 换成 <Katex tex="c^2 - a^2" />：</p>
    <Katex tex="(c^2-a^2)\,x^2-a^2y^2=a^2(c^2-a^2)" display />
    <p>这次 <Katex tex="c > a" />，令 <Katex tex="b^2=c^2-a^2" />，两边同除 <Katex tex="a^2b^2" />：</p>
    <Katex tex="\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1\quad(a>0,\ b>0)" display />
    <p>对照记忆：<strong>椭圆 <Katex tex="b^2 = a^2 - c^2" />（b 是算出来的配角），双曲线 <Katex tex="b^2 = c^2 - a^2" /></strong>。同一个 <Katex tex="c^2 = a^2 + b^2" /> 家族关系，谁减谁，看的是 c 与 a 谁大 —— 也就是离心率 <Katex tex="e = c/a" /> 小于还是大于 1。</p>

    <h3 class="sec" id="d2-asym">推论：渐近线 —— 曲线的"无穷远切线"</h3>
    <p>双曲线独有的景观。从标准方程解出 y：</p>
    <Katex tex="y=\pm\dfrac{b}{a}\,x\,\sqrt{1-\dfrac{a^2}{x^2}}\ \xrightarrow{\ |x|\to\infty\ }\ \ y=\pm\dfrac{b}{a}x" display />
    <p><Katex tex="|x|" /> 越大，根号越接近 1，曲线越贴向直线 <Katex tex="y = \pm(b/a)x" /> —— 这两条直线称为<strong>渐近线</strong> <span class="term">(asymptote)</span>。在图 D2 中把 P 尽量拖远（拖到把手活动范围的边界），青色曲线与灰色虚线的缝隙肉眼难辨。渐近线给出了双曲线的"宏观形状"：画双曲线先画渐近线，是解析几何的标准做法。</p>

    <h3 class="sec" id="d2-radius">推论：焦半径与退化情形</h3>
    <p>推导中间那行（本讲为 <Katex tex="a\sqrt{(x-c)^2+y^2} = cx - a^2" />，注意符号与椭圆相反）同样送出焦半径公式。右支上 <Katex tex="x_0 \ge a" />：</p>
    <Katex tex="|PF_2|=ex_0-a,\qquad |PF_1|=ex_0+a" display />
    <p>左支上符号反转，统一写成 <Katex tex="|PF| = |ex_0 \pm a|" />。无论哪支，作差即得 <Katex tex="\bigl||PF_1| - |PF_2|\bigr| = 2a" />，回到第一定义。</p>
    <ul>
      <li><strong>2a &lt; 2c</strong>：正常的双曲线（三角形两边之差小于第三边）；</li>
      <li><strong><Katex tex="2a = 2c" /></strong>：轨迹退化为<strong>两条射线</strong> —— <Katex tex="F_1F_2" /> 向两头的延长线；</li>
      <li><strong>2a &gt; 2c</strong>：不存在；</li>
      <li><strong><Katex tex="2a \to 0" /></strong>：轨迹趋向 <Katex tex="F_1F_2" /> 的<strong>垂直平分线</strong>（到两点等距）。</li>
    </ul>
    <p>椭圆与双曲线共享"两个焦点"的定义框架，只差一个运算符号。下一讲换一种思路：一个焦点配一条直线。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createHypDef } from '../../../boards/conics/definitions/hypdef.js';
import { DEF_CHAPTERS } from './defnav.js';
</script>
