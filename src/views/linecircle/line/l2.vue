<template>
  <ChPage :cur="2" no="直2" base="/linecircle/l" :chapters="LN_CHAPTERS"
    title="直线方程的五种形式"
    sub="同一条直线可以写成点斜式、斜截式、两点式、截距式与一般式。五种写法各有适用的条件：竖直、水平与过原点的直线会让其中几种失效，辨认条件比记住公式更要紧。"
    :toc="[{ id: 'l2-point', t: '点斜式与斜截式' }, { id: 'l2-two', t: '两点式与截距式' }, { id: 'l2-gen', t: '一般式与互化' }, { id: 'l2-pit', t: '截距与分母' }]">
    <div class="note good">过点 <Katex tex="(x_0,y_0)" />、斜率为 <Katex tex="k" /> 的直线：点斜式 <Katex tex="y-y_0=k(x-x_0)" />；在 <Katex tex="y" /> 轴上截距为 <Katex tex="b" /> 时，斜截式 <Katex tex="y=kx+b" />。过两点 <Katex tex="(x_1,y_1)" />、<Katex tex="(x_2,y_2)" />（<Katex tex="x_1\ne x_2" />，<Katex tex="y_1\ne y_2" />）的两点式 <Katex tex="\dfrac{y-y_1}{y_2-y_1}=\dfrac{x-x_1}{x_2-x_1}" />；在两轴上截距分别为 <Katex tex="a" />、<Katex tex="b" />（均非零）的截距式 <Katex tex="\dfrac{x}{a}+\dfrac{y}{b}=1" />。一般式 <Katex tex="Ax+By+C=0" />（<Katex tex="A" />、<Katex tex="B" /> 不同时为 <Katex tex="0" />）囊括所有直线。</div>

    <h3 class="sec" id="l2-point">点斜式与斜截式</h3>
    <div class="board-wrap">
      <BoardMount :factory="createLineForms" />
      <div class="cap">图 直2 · <b>直线方程的五种形式</b>：蓝色点 <Katex tex="A" />、绿色点 <Katex tex="B" /> 确定直线，下方五个按钮切换方程形式，徽章同步改写。看点：把 <Katex tex="A" />、<Katex tex="B" /> 拖成同一高度，斜率为零，五种形式里有几种随之退化；把直线拖过原点，截距式的两个截距都变成零，该形式失效。</div>
    </div>
    <p>点斜式由斜率的定义直接得到。直线上任意一点 <Katex tex="P(x,y)" /> 与定点 <Katex tex="P_0(x_0,y_0)" /> 连线的斜率恒等于 <Katex tex="k" />，即 <Katex tex="\dfrac{y-y_0}{x-x_0}=k" />，两边乘以 <Katex tex="x-x_0" /> 就是点斜式。它要求直线不竖直，因为竖直时斜率不存在。</p>
    <p>把 <Katex tex="P_0" /> 取在 <Katex tex="y" /> 轴上，即 <Katex tex="(0,b)" />，点斜式化为 <Katex tex="y=kx+b" />。这就是斜截式，<Katex tex="b" /> 是直线与 <Katex tex="y" /> 轴交点的纵坐标。斜截式同样不能表示竖直直线。</p>

    <h3 class="sec" id="l2-two">两点式与截距式</h3>
    <p>两点式把两点的坐标直接填入。它由两个点斜式相除得到，等价于「三组差商相等」。两点式要求 <Katex tex="x_1\ne x_2" /> 且 <Katex tex="y_1\ne y_2" />：竖直直线分母 <Katex tex="x_2-x_1=0" />，水平直线分母 <Katex tex="y_2-y_1=0" />，都不能用。</p>
    <p>截距式把直线与两轴的交点作为已知。令 <Katex tex="y=0" /> 得 <Katex tex="x=a" />，令 <Katex tex="x=0" /> 得 <Katex tex="y=b" />，两点式化简即 <Katex tex="\dfrac{x}{a}+\dfrac{y}{b}=1" />。两个截距都必须存在且非零：竖直直线没有 <Katex tex="y" /> 轴截距，水平直线没有 <Katex tex="x" /> 轴截距，过原点的直线两个截距都为 <Katex tex="0" />，三种情形一律不能写截距式。</p>
    <p>截距是坐标，不是距离。截距可以为负，写成 <Katex tex="\dfrac{x}{-2}+\dfrac{y}{3}=1" /> 合法；若把它读成「到两轴的距离分别是 <Katex tex="2" /> 与 <Katex tex="3" />」，就把符号丢了。</p>

    <h3 class="sec" id="l2-gen">一般式与互化</h3>
    <p>一般式 <Katex tex="Ax+By+C=0" /> 对直线没有任何额外限制（只要 <Katex tex="A" />、<Katex tex="B" /> 不同时为 <Katex tex="0" />），竖直直线取 <Katex tex="B=0" />、<Katex tex="A\ne0" /> 即可。其余四种形式都能化成一般式：去分母、移项、合并同类项。</p>
    <p>反过来的条件是 <Katex tex="B\ne0" />：由一般式解出 <Katex tex="y=-\dfrac{A}{B}x-\dfrac{C}{B}" />，斜率 <Katex tex="k=-\dfrac{A}{B}" />，纵截距 <Katex tex="b=-\dfrac{C}{B}" />。若 <Katex tex="B=0" />，直线为 <Katex tex="x=-\dfrac{C}{A}" />，竖直，没有斜率。</p>
    <p>五种形式之间可以互相改写，选择哪一种取决于已知条件：给一点与斜率用点斜式，给两点用两点式，给两个截距用截距式，需要统一讨论时用一般式。</p>

    <h3 class="sec" id="l2-pit">截距与分母</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：截距式漏掉过原点与平行于轴的情形。</strong>设直线在两轴上的截距分别为 <Katex tex="a" />、<Katex tex="b" />，必须写明 <Katex tex="ab\ne0" />。若题目只说过原点，直接写截距式会得到 <Katex tex="0=1" /> 的矛盾。</li>
        <li><strong>提示二：把截距当距离。</strong>截距带符号，距离不带。求「在两轴上截距相等」的直线时，截距同为 <Katex tex="0" /> 的过原点直线也要算进去，不能只解 <Katex tex="a=b\ne0" />。</li>
        <li><strong>提示三：两点式忘记排除竖直与水平。</strong>两点式分母含 <Katex tex="y_2-y_1" /> 与 <Katex tex="x_2-x_1" />，任一为零都不能用。竖直直线写 <Katex tex="x=x_1" />，水平直线写 <Katex tex="y=y_1" />，各自单列。</li>
        <li><strong>提示四：一般式两边随意约分。</strong>把 <Katex tex="2x+4y-2=0" /> 约成 <Katex tex="x+2y-1=0" /> 是等价变形，但把 <Katex tex="x+2y-1=0" /> 再「约去」常数项就会得到不同的直线。只有各项系数的公因数可以约，常数项不能单独处理。</li>
      </ul>
    </div>
    <p>回收与预告：直1 的斜率在五种形式里反复出现；直3 用一般式的系数直接判断两条直线的位置关系，并给出点到直线的距离公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLineForms } from '../../../boards/linecircle/line/lineforms.js';
import { LN_CHAPTERS } from './lnav.js';
</script>
