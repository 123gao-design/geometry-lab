<template>
  <ChPage :cur="3" no="线3" base="/calc2/c" :chapters="MC_CHAPTERS"
    title="格林公式"
    sub="平面上一条闭合曲线上的第二类积分，等于它围成的区域上的二重积分。等式的左端只看边界，右端只看内部，格林公式把两件事接成一件事。它也是判断「路径无关」的工具：环流为零当且仅当被积式是某个函数的全微分。"
    :toc="[{ id: 'c3-thm', t: '公式与正向边界' }, { id: 'c3-use', t: '用它算面积与曲线积分' }, { id: 'c3-indep', t: '路径无关的四个等价条件' }, { id: 'c3-pit', t: '四条提示' }]">
    <div class="note good">设闭区域 <Katex tex="D" /> 由分段光滑的闭曲线 <Katex tex="L" /> 围成，<Katex tex="P" />、<Katex tex="Q" /> 在 <Katex tex="D" /> 上有一阶连续偏导数，则 <Katex tex="\oint_LP\,dx+Q\,dy=\iint_D\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)d\sigma" />，其中 <Katex tex="L" /> 取<b>正向</b>：沿边界走时区域始终在左侧，逆时针方向。</div>

    <div class="board-wrap">
      <BoardMount :factory="createGreen" />
      <div class="cap">图 线3 · <b>格林公式机</b>：淡蓝是区域 <Katex tex="D" />，绿色是正向边界 <Katex tex="L" />（逆时针，箭头给出走向），深蓝箭头是场。右栏两根柱分别是边界上的环流与区域上的二重积分，永远等高。三个预设：① 圆域配旋转场 <Katex tex="F=(-y,x)" />，两边都是 <Katex tex="2\pi R^2" />；② 方域配同一个场，两边都是 <Katex tex="8a^2" />——区域形状换成方形，等式照旧；③ 圆域配保守场 <Katex tex="F=(y,x)" />，<Katex tex="Q_x-P_y=0" />，两边同时为零。</div>
    </div>

    <h3 class="sec" id="c3-thm">公式与正向边界</h3>
    <p>右边括号里的 <Katex tex="Q_x-P_y" /> 是这个场的「旋转强度」：场绕一点转得越急，这个量越大。等式说的就是——边界上沿路绕一圈累积的环流，等于内部每一点旋转强度的总和。</p>
    <p>对画板的旋转场 <Katex tex="P=-y" />、<Katex tex="Q=x" />，<Katex tex="Q_x-P_y=2" /> 是常数，于是</p>
    <p style="text-align:center"><Katex display tex="\oint_L-y\,dx+x\,dy=\iint_D2\,d\sigma=2S." /></p>
    <p>圆域的 <Katex tex="S=\pi R^2" /> 给出 <Katex tex="2\pi R^2" />，方域的 <Katex tex="S=4a^2" /> 给出 <Katex tex="8a^2" />。这与上一章路径 ③ 算出的 <Katex tex="\pi R^2" /> 一致（上一章的场是 <Katex tex="(0,x)" />，它的 <Katex tex="Q_x-P_y=1" />，环流等于面积）。</p>
    <p>正向的规定不能省。若把 <Katex tex="L" /> 取成顺时针，每段的 <Katex tex="dx" />、<Katex tex="dy" /> 都反号，等式两边同时变号，公式仍然成立，但若一边取正向、另一边取负向，就差了符号。</p>

    <h3 class="sec" id="c3-use">用它算面积与曲线积分</h3>
    <p>取 <Katex tex="P=-y" />、<Katex tex="Q=x" />，得 <Katex tex="Q_x-P_y=2" />，于是面积有闭曲线的表达式：</p>
    <p style="text-align:center"><Katex display tex="S=\frac12\oint_Lx\,dy-y\,dx." /></p>
    <p>取 <Katex tex="P=0" />、<Katex tex="Q=x" /> 得 <Katex tex="S=\oint_Lx\,dy" />；取 <Katex tex="P=-y" />、<Katex tex="Q=0" /> 得 <Katex tex="S=-\oint_Ly\,dx" />。三条式子等价，选一条好算的：椭圆 <Katex tex="x=a\cos t" />、<Katex tex="y=b\sin t" /> 用第一条得 <Katex tex="S=\pi ab" />。</p>
    <p>反过来也常用：直接算曲线积分很麻烦时，改成区域上的二重积分。例如 <Katex tex="\oint_L e^{x^2}dx+xy\,dy" /> 中的 <Katex tex="e^{x^2}" /> 没有初等原函数，换成 <Katex tex="\iint_D(y-0)\,d\sigma" /> 就避开了。</p>

    <h3 class="sec" id="c3-indep">路径无关的四个等价条件</h3>
    <p>设 <Katex tex="D" /> 是单连通区域（没有洞），<Katex tex="P" />、<Katex tex="Q" /> 有一阶连续偏导数，下面四条互相等价：</p>
    <ul>
      <li><Katex tex="\frac{\partial P}{\partial y}=\frac{\partial Q}{\partial x}" /> 在 <Katex tex="D" /> 上处处成立；</li>
      <li>沿 <Katex tex="D" /> 内任何闭曲线的积分为零；</li>
      <li>积分与路径无关，只与起点、终点有关；</li>
      <li>存在函数 <Katex tex="u(x,y)" />，使 <Katex tex="du=P\,dx+Q\,dy" />。</li>
    </ul>
    <p>证明的方向是：第一条与第二条由格林公式直接互推；第二条推出第三条，是把两条路径拼成一个闭合回路；第三条推出第四条，是沿折线积分定义一个 <Katex tex="u" />，再验证它的两个偏导数；第四条推回第一条，只要求两次偏导。</p>
    <p>单连通这个前提不能丢。经典的 <Katex tex="P=\frac{-y}{x^2+y^2}" />、<Katex tex="Q=\frac{x}{x^2+y^2}" /> 在去掉原点的平面上满足 <Katex tex="P_y=Q_x" />，但绕原点一圈的环流是 <Katex tex="2\pi" />，不为零——因为那个平面有洞，第一条与第二条在这里不等价。</p>

    <h3 class="sec" id="c3-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：区域的方向写反。</strong>正向是逆时针，区域在左侧；顺时针要整体加一个负号。</li>
        <li><strong>提示二：P 与 Q 的偏导对调。</strong>被积式是 <Katex tex="P\,dx+Q\,dy" /> 时用 <Katex tex="Q_x-P_y" />，写成 <Katex tex="P_x-Q_y" /> 是错的；记法是「对 <Katex tex="x" /> 求导的配 <Katex tex="Q" />」。</li>
        <li><strong>提示三：区域有洞时直接套。</strong>多连通区域要把边界分成外圈与内圈，内圈取顺时针，或者切开成单连通再套。</li>
        <li><strong>提示四：曲线不闭合也套。</strong>格林公式只处理闭合边界；开曲线要先补一段简单的路径把它闭合，算完再减掉补的那一段。</li>
      </ul>
    </div>
    <p>回收与预告：格林公式处理平面上的边界与内部。把区域从平面搬到曲面、把边界从曲线搬到闭曲面，对应的两条公式是高斯公式与斯托克斯公式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGreen } from '../../../boards/calc2/curve/green.js';
import { MC_CHAPTERS } from './cnav.js';
</script>
