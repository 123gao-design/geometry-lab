<template>
  <ChPage :cur="2" no="解2" base="/complexvar/a" :chapters="CW_CHAPTERS"
    title="柯西-黎曼方程"
    sub="把复变函数拆成实部与虚部两个二元函数，可导的条件就落成两组偏导数之间的等式。这组等式把「方向无关」翻译成了能直接验算的形式，也让解析函数与调和函数接上了线。"
    :toc="[{ id: 'a2-eq', t: '方程的来历' }, { id: 'a2-thm', t: '可导的充要条件' }, { id: 'a2-harm', t: '调和函数与共轭调和' }, { id: 'a2-ex', t: '三个例子的对照' }, { id: 'a2-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f(z)=u(x,y)+iv(x,y)" />。若 <Katex tex="f" /> 在 <Katex tex="z_0=x_0+iy_0" /> 处可导，则 <Katex tex="u" />、<Katex tex="v" /> 在 <Katex tex="(x_0,y_0)" /> 处的一阶偏导数存在，且满足 <b>柯西-黎曼方程</b>：<Katex tex="u_x=v_y" />，<Katex tex="u_y=-v_x" />。此时 <Katex tex="f'(z_0)=u_x+iv_x" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createCRLab" />
      <div class="cap">图 解2 · <b>柯西-黎曼方程机</b>：蓝线是 <Katex tex="u" /> 的等值线，橙线是 <Katex tex="v" /> 的等值线，蓝、橙两支箭头分别是 <Katex tex="\nabla u" /> 与 <Katex tex="\nabla v" />，两支用同一比例尺。看点：① <Katex tex="f=z^2" /> 处两支箭头等长且互相垂直，两族等值线正交；② <Katex tex="f=\bar z" /> 的两支梯度都只有一处分量，长度也不等，等值线虽然也是两族直线，却不再正交；③ 拖点走遍平面，<Katex tex="f=e^z" /> 的两支箭头始终等长垂直，长度随 <Katex tex="e^x" /> 一起变。</div>
    </div>

    <h3 class="sec" id="a2-eq">方程的来历</h3>
    <p>可导的定义说差商的极限与方向无关，那就先取两个最简单的方向，把极限算出来。</p>
    <p>沿实轴取 <Katex tex="\Delta z=\Delta x" />，差商是</p>
    <p style="text-align:center"><Katex display tex="\frac{\Delta u+i\Delta v}{\Delta x}\longrightarrow u_x+iv_x." /></p>
    <p>沿虚轴取 <Katex tex="\Delta z=i\Delta y" />，差商是</p>
    <p style="text-align:center"><Katex display tex="\frac{\Delta u+i\Delta v}{i\Delta y}=\frac{\Delta u+i\Delta v}{\Delta y}\cdot\frac1i\longrightarrow v_y-iu_y." /></p>
    <p>两个方向必须给出同一个复数，实部与虚部分别相等：</p>
    <p style="text-align:center"><Katex display tex="u_x=v_y,\qquad v_x=-u_y." /></p>
    <p>这就是柯西-黎曼方程。它只是必要条件——两个方向的差商一致，别的方向还没有验。但复变函数的情形很特殊：这两条一旦成立，别的方向也自动满足。</p>

    <h3 class="sec" id="a2-thm">可导的充要条件</h3>
    <p>完整定理是这样：若 <Katex tex="u" />、<Katex tex="v" /> 在 <Katex tex="(x_0,y_0)" /> 处可微，且满足柯西-黎曼方程，则 <Katex tex="f=u+iv" /> 在 <Katex tex="z_0" /> 处可导，导数为 <Katex tex="u_x+iv_x" />。反过来，可导也能推出这两个偏导数存在并满足方程。</p>
    <p>证明用的是全微分的语言。把增量写成</p>
    <p style="text-align:center"><Katex display tex="\Delta f=\Delta u+i\Delta v=(u_x\Delta x+u_y\Delta y)+i(v_x\Delta x+v_y\Delta y)+o(|\Delta z|)." /></p>
    <p>把柯西-黎曼方程代进去整理，含 <Katex tex="\Delta y" /> 的项恰好能凑成 <Katex tex="i(u_x+iv_x)\Delta y" />，于是</p>
    <p style="text-align:center"><Katex display tex="\Delta f=(u_x+iv_x)(\Delta x+i\Delta y)+o(|\Delta z|), \qquad f'(z_0)=u_x+iv_x." /></p>
    <p>右端只剩一个与方向无关的线性主部，余项比 <Katex tex="|\Delta z|" /> 更小，极限自然与路径无关。这一步是整章的关键：<b>把「所有方向一致」换成了「两条坐标轴上的偏导一致」</b>，验算量立刻从无穷降到四样。</p>
    <p>注意定理里还要求 <Katex tex="u" />、<Katex tex="v" /> 可微。只有偏导数存在、方程成立还不够，那只能保证沿两条轴的差商一致；偏导数不连续时，别的方向上仍可能出岔子。做题时常见的充分条件是：四个偏导数连续且满足方程。</p>

    <h3 class="sec" id="a2-harm">调和函数与共轭调和</h3>
    <p>解析函数的实部与虚部各自都满足拉普拉斯方程。把柯西-黎曼方程再求一次偏导：</p>
    <p style="text-align:center"><Katex display tex="u_{xx}=v_{yx}=v_{xy}=-u_{yy},\qquad u_{xx}+u_{yy}=0." /></p>
    <p>满足 <Katex tex="u_{xx}+u_{yy}=0" /> 的二元函数叫<b>调和函数</b>，物理里的稳定温度场、静电势、无旋流场的势函数都是它。同法可得 <Katex tex="v_{xx}+v_{yy}=0" />。所以：解析函数的实部与虚部都是调和函数。</p>
    <p>反过来，给定一个调和函数 <Katex tex="u" />，能找到一个 <Katex tex="v" /> 使 <Katex tex="u+iv" /> 解析吗？在单连通区域上答案是能，这样的 <Katex tex="v" /> 叫 <Katex tex="u" /> 的<b>共轭调和函数</b>，差一个常数就唯一。求法是把柯西-黎曼方程当作偏微分方程组，一路积分过去再定常数。</p>
    <p>画板上两族等值线正交，正是调和函数的几何表现。<Katex tex="\nabla u" /> 垂直于 <Katex tex="u" /> 的等值线，<Katex tex="\nabla v" /> 垂直于 <Katex tex="v" /> 的等值线；柯西-黎曼方程让 <Katex tex="\nabla v" /> 恰好是 <Katex tex="\nabla u" /> 逆时针转 <Katex tex="90^\circ" /> 的结果，两族曲线于是在交点处互相垂直。</p>

    <h3 class="sec" id="a2-ex">三个例子的对照</h3>
    <p><Katex tex="f=z^2" />：<Katex tex="u=x^2-y^2" />，<Katex tex="v=2xy" />。偏导数是 <Katex tex="u_x=2x" />、<Katex tex="u_y=-2y" />、<Katex tex="v_x=2y" />、<Katex tex="v_y=2x" />，两条方程恒成立，所以处处可导。<Katex tex="u" />、<Katex tex="v" /> 也都是调和的。</p>
    <p><Katex tex="f=\bar z" />：<Katex tex="u=x" />，<Katex tex="v=-y" />。得 <Katex tex="u_x=1" />、<Katex tex="v_y=-1" />，第一条方程就不成立，于是处处不可导。这一个例子也解释了为什么「含共轭」几乎一定不解析。</p>
    <p><Katex tex="f=|z|^2" />：<Katex tex="u=x^2+y^2" />，<Katex tex="v=0" />。方程要求 <Katex tex="2x=0" />、<Katex tex="2y=0" />，只有原点满足。所以它在原点可导、在其他点不可导；又因为原点周围一片都不满足，它在原点不解析。这个例子把可导与解析的差别摆得最清楚。</p>
    <p>把「可导」升级成「解析」，只需把上面对一点的结论换成对一片点。哪个区域里方程恒成立，函数就在哪个区域解析；某个点单独成立不算数。</p>

    <h3 class="sec" id="a2-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：方程里没有 <Katex tex="i" />。</strong><Katex tex="u_x=v_y" />、<Katex tex="u_y=-v_x" /> 都是实等式，右边不出现虚数单位。把 <Katex tex="v" /> 当成复数再套方程，是最常见的错法。</li>
        <li><strong>提示二：偏导存在且满足方程，还差「可微」。</strong>定理的前提是 <Katex tex="u" />、<Katex tex="v" /> 可微。检查四个偏导数是否连续，通常比抠定义更省事，也足够用。</li>
        <li><strong>提示三：一点满足方程只说明这一点可导。</strong><Katex tex="|z|^2" /> 在原点可导而不解析。要谈解析，得看一个区域里方程是否处处成立。</li>
        <li><strong>提示四：导数公式是 <Katex tex="f'=u_x+iv_x" />。</strong>由它还能写出另外三种形式 <Katex tex="f'=v_y-iu_y=u_x-iu_y=v_y+iv_x" />，验算时拿它们互相核对很方便。</li>
      </ul>
    </div>
    <p>回收与预告：有了柯西-黎曼方程，就能判断哪些函数解析，也能算出导数。下一章把解析函数放到一条闭路上积分：条件一加上，闭路上的积分就恒为零——这就是柯西定理，整个复变函数理论从这里转身。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createCRLab } from '../../../boards/complexvar/analytic/crlab.js';
import { CW_CHAPTERS } from './cwnav.js';
</script>
