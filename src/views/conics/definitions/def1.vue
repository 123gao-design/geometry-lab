<template>
  <ChPage :cur="1" no="D1" base="/conics/def" :chapters="DEF_CHAPTERS"
    title="椭圆：把圆心劈成两半" sub="第一定义 $|PF_1| + |PF_2| = 2a$ —— 一根绳子画出的曲线。"
    :toc="[{ id: 'd1-def', t: '第一定义与绳尺作图（图 D1）' }, { id: 'd1-deriv', t: '标准方程的推导' }, { id: 'd1-radius', t: '推论 · 焦半径公式' }, { id: 'd1-degen', t: '退化与边界情形' }]">
    <p>圆的定义只有一句话：到一个定点的距离等于定长。把这句话改动一处 —— 把<strong>一个定点</strong>换成<strong>两个定点</strong>，把<strong>距离</strong>换成<strong>距离之和</strong> —— 就得到了椭圆。这个改动有极强的作图直觉：把一根绳子的两端钉在 <Katex tex="F_1" />、<Katex tex="F_2" /> 两颗图钉上，用笔尖把绳子绷紧，转一圈，笔尖走过的曲线就是椭圆。绳长就是 <Katex tex="2a" />。</p>
    <div class="note good" id="d1-def"><strong>椭圆的第一定义</strong>：平面内到两个定点 <Katex tex="F_1" />、<Katex tex="F_2" /> 的距离之和为常数 <Katex tex="2a" />（要求 <Katex tex="2a>|F_1F_2|" />）的点 P 的轨迹，称为<strong>椭圆</strong> <span class="term">(ellipse)</span>。<Katex tex="F_1" />、<Katex tex="F_2" /> 称为<strong>焦点</strong>，<Katex tex="|F_1F_2| = 2c" /> 称为<strong>焦距</strong>；比值 <Katex tex="e = c/a" /> 称为<strong>离心率</strong>。</div>
    <ConicFigure head="bottom" number="D1" title="焦半径此消彼长，绳长保持不变" :factory="createEllDef"
      :legend="[['mint', '椭圆'], ['blue', '到 F₁ 的距离'], ['orange', '到 F₂ 的距离']]">
      拖动 P 沿椭圆滑动，蓝橙两段绳子长度此消彼长，底部长度条把它们首尾相接 —— 总长纹丝不动地等于 2a。滑块 a、c 重塑椭圆形状；点「绳尺作图」可看笔尖绷紧绳子扫出整条曲线的过程。c 越小椭圆越圆，c → a 时椭圆被拉成一根"针"。
    </ConicFigure>

    <h3 class="sec" id="d1-deriv">标准方程的推导：两次平方，一次改名</h3>
    <p>几何定义要变成可用的工具，必须翻译成代数。取 <Katex tex="F_1F_2" /> 的中点为原点、<Katex tex="F_1F_2" /> 所在直线为 x 轴，则 <Katex tex="F_1(-c,\ 0)" />、<Katex tex="F_2(c,\ 0)" />。设 P(x, y)，第一定义写成：</p>
    <Katex tex="\sqrt{(x+c)^2+y^2}+\sqrt{(x-c)^2+y^2}=2a" display />
    <p>两个根号相加，标准手法是<strong>移一项再平方</strong>：</p>
    <Katex tex="\sqrt{(x+c)^2+y^2}=2a-\sqrt{(x-c)^2+y^2}" display />
    <p>两边平方后 <Katex tex="x^2" />、<Katex tex="c^2" />、<Katex tex="y^2" /> 项全部抵消，剩下的项整理成极其干净的一行：</p>
    <Katex tex="a\sqrt{(x-c)^2+y^2}=a^2-cx" display />
    <p>再平方一次，根号彻底消失：</p>
    <Katex tex="(a^2-c^2)\,x^2+a^2y^2=a^2(a^2-c^2)" display />
    <p>因为 <Katex tex="a > c" />，令 <Katex tex="b^2=a^2-c^2" />（这就是"改名"），两边同除 <Katex tex="a^2b^2" />，得到标准方程：</p>
    <Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1\quad(a>b>0)" display />
    <p>回看图 D1：b 恰是短半轴 —— 当 P 走到上顶点 <Katex tex="B_1" /> 时，<Katex tex="|PF_1| = |PF_2| = a" />，由勾股定理 <Katex tex="b^2+c^2=a^2" />，与改名时引入的 b 完全重合。<strong><Katex tex="b^2 = a^2 - c^2" /> 不是记号游戏，而是顶点处的勾股定理。</strong></p>

    <h3 class="sec" id="d1-radius">推论：焦半径公式 —— 推导路上捡到的礼物</h3>
    <p>别急着翻页。推导中间那行 <Katex tex="a\sqrt{(x-c)^2+y^2}=a^2-cx" /> 本身就值得停留：左边的根号正是 <Katex tex="|PF_2|" />，两边除以 a：</p>
    <Katex tex="|PF_2|=a-ex_0,\qquad |PF_1|=2a-|PF_2|=a+ex_0" display />
    <p>椭圆的<strong>焦半径</strong>（曲线上点到焦点的距离）竟然是横坐标 <Katex tex="x_0" /> 的<strong>一次函数</strong>。立刻得到两个常用结论：焦半径的取值范围是 <Katex tex="[a - c,\ a + c]" />（在左右顶点处取到）；而 <Katex tex="|PF_2| = e\cdot(a^2/c - x_0)" /> 这种写法，已经已经呈现"到焦点距离 = e × 到某条直线距离"的形状 —— 那是 D4 统一定义的铺垫。</p>

    <h3 class="sec" id="d1-degen">退化与边界情形</h3>
    <p>定义中"2a &gt; 2c"的限制值得追问。由三角形两边之和大于第三边：<Katex tex="|PF_1| + |PF_2| \ge |F_1F_2| = 2c" />，等号成立当且仅当 P 落在线段 <Katex tex="F_1F_2" /> 上。于是：</p>
    <ul>
      <li><strong>2a &gt; 2c</strong>：正常的椭圆（图 D1 的情形）；</li>
      <li><strong><Katex tex="2a = 2c" /></strong>：轨迹退化为<strong>线段 <Katex tex="F_1F_2" /></strong>；</li>
      <li><strong>2a &lt; 2c</strong>：没有任何点满足，轨迹不存在；</li>
      <li><strong>c → 0</strong>：两焦点重合，b → a，椭圆变回<strong>圆</strong> —— 圆是离心率 e = 0 的椭圆。</li>
    </ul>
    <p>下一讲把"和"改成"差"，曲线将直接裂开成两支。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createEllDef } from '../../../boards/conics/definitions/elldef.js';
import { DEF_CHAPTERS } from './defnav.js';
</script>
