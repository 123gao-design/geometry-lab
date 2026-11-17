<template>
  <ChPage :cur="2" no="线2" base="/calc2/c" :chapters="MC_CHAPTERS"
    title="第二类曲线积分"
    sub="力沿曲线做功，累加的不是弧长，而是位移在力方向上的分量。于是被积式写成 P dx+Q dy 的坐标形式：走向反过来，结果变号；同一起点与终点换一条路走，结果通常也不同。"
    :toc="[{ id: 'c2-def', t: '定义与方向' }, { id: 'c2-calc', t: '参数化计算' }, { id: 'c2-path', t: '路径相关与保守场' }, { id: 'c2-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="L" /> 是从 <Katex tex="A" /> 到 <Katex tex="B" /> 的有向光滑曲线，向量场 <Katex tex="F=(P,Q)" />。把 <Katex tex="L" /> 分成小段，每段的位移是 <Katex tex="(\Delta x_i,\Delta y_i)" />，作和 <Katex tex="\sum(P\Delta x_i+Q\Delta y_i)" /> 并取极限，记作 <Katex tex="\int_LP\,dx+Q\,dy" />，称为<b>第二类曲线积分</b>（对坐标的曲线积分）。</div>

    <div class="board-wrap">
      <BoardMount :factory="createLineInt2" />
      <div class="cap">图 线2 · <b>第二类曲线积分</b>：向量场 <Katex tex="F=(0,x)" />（深蓝箭头，方向竖直向上、大小随横坐标变大），金色点是质点 <Katex tex="P" />，绿箭是路径的切向，橙箭是场力。三条路径：① 上半圆 <Katex tex="A\to B" />，功 <Katex tex="\frac{\pi R^2}{2}" />；② 沿 <Katex tex="x" /> 轴的直线段，功为 0；③ 整圆回到 <Katex tex="A" />，功 <Katex tex="\pi R^2" />。看点：终点相同、路径不同，功就不同；绕一圈回来也不为零。</div>
    </div>

    <h3 class="sec" id="c2-def">定义与方向</h3>
    <p>被积式里的 <Katex tex="dx" />、<Katex tex="dy" /> 是坐标增量，带正负号，这就是它与第一类积分的分水岭。走向反过来时每段的 <Katex tex="\Delta x_i" />、<Katex tex="\Delta y_i" /> 全部变号，所以</p>
    <p style="text-align:center"><Katex display tex="\int_{L^-}P\,dx+Q\,dy=-\int_LP\,dx+Q\,dy." /></p>
    <p>物理读法是做功：<Katex tex="F\cdot\tau\,ds" /> 正好等于 <Katex tex="P\,dx+Q\,dy" />，其中 <Katex tex="\tau" /> 是单位切向量。所以第二类积分就是「场力在切向上的投影乘弧长」，投影为负的地方，功是负的。</p>
    <p>画板把三个量都画了出来：橙箭是 <Katex tex="F" />，绿箭是 <Katex tex="\tau" />，两者的夹角决定了当前这一小段是正功还是负功。点「反向走」，质点从另一端出发，全程功立刻变号。</p>

    <h3 class="sec" id="c2-calc">参数化计算</h3>
    <p>把曲线写成 <Katex tex="x=x(t)" />、<Katex tex="y=y(t)" />，<Katex tex="t" /> 从 <Katex tex="\alpha" /> 到 <Katex tex="\beta" />，则</p>
    <p style="text-align:center"><Katex display tex="\int_LP\,dx+Q\,dy=\int_\alpha^\beta\Big[P\,x'(t)+Q\,y'(t)\Big]dt." /></p>
    <p>这时下限 <Katex tex="\alpha" /> 与上限 <Katex tex="\beta" /> 的大小关系照着走向写，不必强行调换——第二类积分对走向敏感，就体现在这一点上。</p>
    <p>以画板的第三条路径为例，速度是 <Katex tex="(-2\pi R\sin2\pi t,\ 2\pi R\cos2\pi t)" />，场是 <Katex tex="(0,\ R\cos2\pi t)" />，两者相乘得</p>
    <p style="text-align:center"><Katex display tex="\int_0^12\pi R^2\cos^2(2\pi t)\,dt=\pi R^2." /></p>
    <p>结果恰好等于圆的面积。这不是巧合：画板的场正是绕原点的旋转场，绕闭合回路积分得到面积，下一章的格林公式会把这件事讲成一般规律。</p>

    <h3 class="sec" id="c2-path">路径相关与保守场</h3>
    <p>把画板的三条路径对照起来看：<Katex tex="A" /> 到 <Katex tex="B" /> 有两条路，功分别是 <Katex tex="\frac{\pi R^2}{2}" /> 与 0，说明这个场的积分<b>与路径有关</b>。</p>
    <p>什么样的场与路径无关？判据是 <Katex tex="\frac{\partial P}{\partial y}=\frac{\partial Q}{\partial x}" />。画板的场 <Katex tex="P=0" />、<Katex tex="Q=x" />，<Katex tex="P_y=0" /> 而 <Katex tex="Q_x=1" />，条件不满足，所以路径相关，闭合回路的积分也不为零。</p>
    <p>满足这个条件的场叫<b>保守场</b>或梯度场：存在势函数 <Katex tex="u" /> 使 <Katex tex="P=u_x" />、<Katex tex="Q=u_y" />，此时</p>
    <p style="text-align:center"><Katex display tex="\int_LP\,dx+Q\,dy=u(B)-u(A)," /></p>
    <p>只由端点决定，绕任何闭合回路的积分为零。重力场、静电场都是保守场；画板这个「越往右越强的竖直力」不是。下一章的格林公式给出这四个等价条件之间的完整链条。</p>

    <h3 class="sec" id="c2-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：沿用第一类的习惯把下限写得比上限小。</strong>第二类积分的上下限要跟走向一致，可以「倒着积」，这时结果照常带符号。</li>
        <li><strong>提示二：忘记换 <Katex tex="dx" />、<Katex tex="dy" />。</strong><Katex tex="dx=x'(t)\,dt" /> 不能写成 <Katex tex="dt" />，否则量纲与数值都不对。</li>
        <li><strong>提示三：把路径相关当成算错。</strong>路径相关是这个场的性质，不是计算失误；判断相关与否看 <Katex tex="P_y" /> 与 <Katex tex="Q_x" />。</li>
        <li><strong>提示四：非闭合曲线也用「绕圈为零」。</strong>闭合回路为零只是保守场的结论，一般的场绕圈会积出非零值——画板的路径 ③ 就是这样。</li>
      </ul>
    </div>
    <p>回收与预告：绕闭合曲线的第二类积分与它围成的区域之间，有一条精确的等式把两者接起来，这就是格林公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLineInt2 } from '../../../boards/calc2/curve/lineint2.js';
import { MC_CHAPTERS } from './cnav.js';
</script>
