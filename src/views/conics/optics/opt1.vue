<template>
  <ChPage :cur="1" no="T1" base="/conics/opt" :chapters="OPT_CHAPTERS"
    title="切线：一条直线的四种求法" sub="判别式法、导数法、偏导法（梯度）、极线公式 —— 四条路通向同一条切线，其中两条还会互相解释。"
    :toc="[{ id: 't1-lab', t: '四种求法总览（图 T1）' }, { id: 't1-d1', t: '求法一 · 判别式法' }, { id: 't1-d2', t: '求法二 · 导数法' }, { id: 't1-d3', t: '求法三 · 偏导法（梯度）' }, { id: 't1-d4', t: '求法四 · 极线公式' }, { id: 't1-table', t: '切线速查表' }]">
    <p>光学性质的主角不是曲线本身，而是曲线上每一点处的<strong>切线</strong> —— 光打在曲面哪一点，就以那一点的切线为"镜面"反射。所以先解决代数问题：给定曲线上一点 <Katex tex="P(x_0,\ y_0)" />，切线方程是什么？</p>

    <h3 class="sec" id="t1-lab">四种求法总览</h3>
    <div class="board-wrap">
      <BoardMount :factory="createTangentLab" />
      <div class="cap">图 T1 · <b>圆锥曲线的切线</b>：切换椭圆 / 双曲线 / 抛物线三种曲线，拖动 P —— 白色切线、紫色法线实时跟随，读数区给出局部坐标下的切线方程与斜率；打开「梯度 ∇F」开关后，金色箭头标出偏导数给出的法向量 <Katex tex="\nabla F" />，它永远与切线垂直。</div>
    </div>

    <h3 class="sec" id="t1-d1">求法一：判别式法（最"初等"）</h3>
    <p>切线是"与曲线恰有一个公共点"的直线（对二次曲线这一定义成立）。设直线 y = kx + m，代入椭圆标准方程：</p>
    <Katex tex="b^2x^2+a^2(kx+m)^2=a^2b^2\ \Longrightarrow\ (a^2k^2+b^2)\,x^2+2a^2km\,x+a^2(m^2-b^2)=0" display />
    <p>相切 <Katex tex="\iff" /> 判别式为零：<Katex tex="\Delta=4a^2b^2\,(a^2k^2+b^2-m^2)=0" />，即</p>
    <Katex tex="m^2=a^2k^2+b^2" display />
    <p>这正是"斜率为 k 的切线"方程的来历（截距 <Katex tex="m = \pm\sqrt{a^2k^2+b^2}" />，两条，平行地贴在椭圆上下两侧）。</p>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <p><strong>判别式法的一个易错点</strong>：它假设了斜率 k 存在。椭圆在 <Katex tex="(\pm a,\ 0)" /> 处的切线是竖直线 <Katex tex="x = \pm a" />，判别式法永远抓不到它们 —— 需要单独补上。考试中先想"竖直切线补了吗"，再动笔。（这个易错点由求法三顺带解决，见下。）</p>
    </div>

    <h3 class="sec" id="t1-d2">求法二：导数法（最"分析"）</h3>
    <p>把切线看作割线的极限。对 <Katex tex="\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1" /> 两边关于 x 求导（y 视为 y(x)）：</p>
    <Katex tex="\frac{2x}{a^2}+\frac{2y\,y'}{b^2}=0\ \Longrightarrow\ k=y'=-\frac{b^2x_0}{a^2y_0}" display />
    <p>再由点斜式写出切线 <Katex tex="y-y_0=k\,(x-x_0)" />，整理后与求法四的公式完全一致。双曲线同理（求导时出现的是 <Katex tex="+b^2" />）。这一方法对任何能用方程隐式定义的曲线都有效，是"数形结合"中代数一方的重要工具。</p>

    <h3 class="sec" id="t1-d3">求法三：偏导法（最"高观点"）—— 把曲线看成等值线</h3>
    <p>换个视角：不把 y 当成 x 的函数，而是把整条曲线看作<strong>二元函数的一条等值线</strong>。令</p>
    <Katex tex="F(x,y)=\frac{x^2}{a^2}+\frac{y^2}{b^2}-1,\qquad \text{椭圆即 } F(x,y)=0" display />
    <p>分别把 y、x 视为常数，各求一次偏导：</p>
    <Katex tex="F_x=\frac{2x}{a^2},\qquad F_y=\frac{2y}{b^2}" display />
    <p>现在沿曲线上动一小步 (dx, dy)，F 的变化量按链式法则是 <Katex tex="dF=F_x\,dx+F_y\,dy" />。既然这条线是 F = 0 的等值线，走多远 F 都不变：dF = 0，于是<strong>切线方向 (dx, dy) 必须满足</strong></p>
    <Katex tex="F_x\,dx+F_y\,dy=0" display />
    <p>这正是"<Katex tex="(dx,\ dy) \perp (F_x,\ F_y)" />"——<strong>梯度方向与等值线垂直</strong>，也就是画板里那支金色 <Katex tex="\nabla F" /> 箭头。所以过 <Katex tex="P(x_0,\ y_0)" /> 的切线是</p>
    <Katex tex="F_x(x_0,y_0)(x-x_0)+F_y(x_0,y_0)(y-y_0)=0" display />
    <p>把两个偏导的值代进去、展开，再用一次 <Katex tex="\frac{x_0^2}{a^2}+\frac{y_0^2}{b^2}=1" />（P 在曲线上），右边自动化为 1：</p>
    <Katex tex="\frac{2x_0}{a^2}\Big(x-x_0\Big)+\frac{2y_0}{b^2}\Big(y-y_0\Big)=0\ \Longrightarrow\ \frac{xx_0}{a^2}+\frac{yy_0}{b^2}=\frac{x_0^2}{a^2}+\frac{y_0^2}{b^2}=1" display />
    <div class="note good">偏导法同时解决两件事：<strong>其一</strong>，全程没有除以 <Katex tex="y_0" /> —— 求法一抓不到的竖直切线 <Katex tex="x = \pm a" /> 自动包含（顶点处 <Katex tex="F_y = 0" />，切线方程退化为 <Katex tex="(x - x_0)\cdot F_x = 0" />）；<strong>其二</strong>，它顺带<strong>推导出了</strong>求法四的极线公式 —— "平方劈一半"不再是口诀，而是等值线在切点处的线性化。</div>
    <p>双曲线换一个符号（<Katex tex="F_x=\tfrac{2x}{a^2},\ F_y=-\tfrac{2y}{b^2}" />），抛物线取 <Katex tex="F=y^2-2px" />（<Katex tex="F_x=-2p,\ F_y=2y" />），同样的两行分别给出 <Katex tex="\tfrac{xx_0}{a^2}-\tfrac{yy_0}{b^2}=1" /> 与 <Katex tex="yy_0=p(x+x_0)" />。这一视角在大学微积分里会长成"梯度最速方向 + 隐函数定理"，在高中阶段，它已经是最省纸的求切线方法。</p>

    <h3 class="sec" id="t1-d4">求法四：极线公式（最"射影"，也最出乎意料）</h3>
    <p>子专题六的图 6 说过：点 P 落在曲线上时，P 的极线退化为<strong>该点处的切线</strong>。把 <Katex tex="P(x_0,\ y_0)" /> 代入极线公式，直接抄出答案：</p>
    <Katex tex="\frac{xx_0}{a^2}+\frac{yy_0}{b^2}=1" display />
    <p>经过求法三，这个公式的形式不再难解 —— 它就是切点处的线性化。四种求法，殊途同归：判别式法在算"重根条件"，导数法在算"一阶逼近"，偏导法在算"等值线的线性化"，极线公式在说"切线 = 曲上点的极线"，四句话在二次曲线上是同一件事。它还立刻回答了一个高频考题：<strong>过曲线外一点 P 的两条切线，其切点的连线（切点弦）恰是 P 的极线</strong> —— 子专题六的整套理论在这里变成了直接套用。</p>

    <h3 class="sec" id="t1-table">切线速查表（切点 <Katex tex="P(x_0,\ y_0)" />，局部坐标）</h3>
    <table>
      <tbody>
        <tr><th>曲线</th><th>F(x, y)</th><th>梯度 ∇F(P)</th><th>切线方程</th><th>切线斜率</th></tr>
        <tr><td>椭圆 <Katex tex="\frac{x^2}{a^2}+\frac{y^2}{b^2}=1" /></td><td><Katex tex="\frac{x^2}{a^2}+\frac{y^2}{b^2}-1" /></td><td><Katex tex="\left(\frac{2x_0}{a^2},\ \frac{2y_0}{b^2}\right)" /></td><td><Katex tex="\frac{xx_0}{a^2}+\frac{yy_0}{b^2}=1" /></td><td><Katex tex="-\frac{b^2x_0}{a^2y_0}" /></td></tr>
        <tr><td>双曲线 <Katex tex="\frac{x^2}{a^2}-\frac{y^2}{b^2}=1" /></td><td><Katex tex="\frac{x^2}{a^2}-\frac{y^2}{b^2}-1" /></td><td><Katex tex="\left(\frac{2x_0}{a^2},\ -\frac{2y_0}{b^2}\right)" /></td><td><Katex tex="\frac{xx_0}{a^2}-\frac{yy_0}{b^2}=1" /></td><td><Katex tex="\frac{b^2x_0}{a^2y_0}" /></td></tr>
        <tr><td>抛物线 <Katex tex="y^2=2px" /></td><td><Katex tex="y^2-2px" /></td><td><Katex tex="(-2p,\ 2y_0)" /></td><td><Katex tex="yy_0=p(x+x_0)" /></td><td><Katex tex="\frac{p}{y_0}" /></td></tr>
      </tbody>
    </table>
    <p>记法：把标准方程里的 <Katex tex="x^2" /> 换成 <Katex tex="xx_0" />、<Katex tex="y^2" /> 换成 <Katex tex="yy_0" />（一次项同理把 y 换成 <Katex tex="(y+y_0)/2" />），即得切线 —— "平方劈一半"；而偏导法告诉我们这一半劈的是<strong>线性化</strong>。这张表是后面三讲光学性质的全部工具：反射定律的"镜面"，就是它。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createTangentLab } from '../../../boards/conics/optics/tangentlab.js';
import { OPT_CHAPTERS } from './optnav.js';
</script>
