<template>
  <ChPage :cur="2" no="微2" base="/calc2/m" :chapters="MD_CHAPTERS"
    title="偏导数与全微分"
    sub="一元函数的导数只有一个，二元函数却可以沿两个坐标轴各作一次差商，得到两个偏导数。两个偏导数都在，并不保证函数能被一张平面局部替身；要做到这一点，还得有全微分。"
    :toc="[{ id: 'm2-part', t: '偏导数' }, { id: 'm2-geo', t: '几何意义' }, { id: 'm2-diff', t: '全微分' }, { id: 'm2-rel', t: '可微、偏导与连续的关系' }, { id: 'm2-pit', t: '四条提示' }]">
    <div class="note good">若固定 <Katex tex="y=y_0" /> 后一元函数 <Katex tex="f(x,y_0)" /> 在 <Katex tex="x_0" /> 处可导，就称此导数为 <Katex tex="f" /> 在 <Katex tex="(x_0,y_0)" /> 处对 <Katex tex="x" /> 的<b>偏导数</b>，记作 <Katex tex="f_x(x_0,y_0)" /> 或 <Katex tex="\dfrac{\partial f}{\partial x}(x_0,y_0)" />；对 <Katex tex="y" /> 的偏导数 <Katex tex="f_y" /> 同理。若函数的增量能写成 <Katex tex="\Delta z=A\Delta x+B\Delta y+o(\rho)" />，其中 <Katex tex="\rho=\sqrt{\Delta x^2+\Delta y^2}" />，则称 <Katex tex="f" /> 在该点<b>可微</b>，<Katex tex="A\Delta x+B\Delta y" /> 叫<b>全微分</b>，此时 <Katex tex="A=f_x" />、<Katex tex="B=f_y" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createPartDeriv" />
      <div class="cap">图 微2 · <b>偏导数与全微分机</b>：曲面 <Katex tex="z=f(x,y)" /> 上取切点 <Katex tex="P_0" />，过它作 <Katex tex="y=y_0" /> 与 <Katex tex="x=x_0" /> 两张竖直截面，绿、橙两条曲线在 <Katex tex="P_0" /> 处的切线斜率就是两个偏导数；两条切线张成金色的切平面。拖 <Katex tex="\Delta x" />、<Katex tex="\Delta y" />：绿点落在切平面上，紫点落在真实曲面上，红线段是 <Katex tex="\Delta z-dz" />。看点：① 抛物面的切平面贴着曲面，红线很短；② 鞍面的一条切线朝上、一条朝下，红线随离 <Katex tex="P_0" /> 的远近变长。</div>
    </div>

    <h3 class="sec" id="m2-part">偏导数</h3>
    <p>定义只改一个地方：对 <Katex tex="x" /> 求偏导时把 <Katex tex="y" /> 当成常数。</p>
    <p style="text-align:center"><Katex display tex="f_x(x_0,y_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x,y_0)-f(x_0,y_0)}{\Delta x}." /></p>
    <p>因此计算上不必另学一套：求 <Katex tex="f_x" /> 时视 <Katex tex="y" /> 为常数，按一元函数求导；求 <Katex tex="f_y" /> 时视 <Katex tex="x" /> 为常数。例如 <Katex tex="f=x^2y+\sin(xy)" />，则 <Katex tex="f_x=2xy+y\cos(xy)" />，<Katex tex="f_y=x^2+x\cos(xy)" />。</p>
    <p>高阶偏导同理。<Katex tex="f_{xx}" /> 是对 <Katex tex="x" /> 求两次，<Katex tex="f_{xy}" /> 是先对 <Katex tex="x" />、再对 <Katex tex="y" />。当两个混合偏导数 <Katex tex="f_{xy}" /> 与 <Katex tex="f_{yx}" /> 都连续时二者相等，这一条让后面的海塞矩阵与全微分公式里的交叉项只有一个值。</p>

    <h3 class="sec" id="m2-geo">几何意义</h3>
    <p><Katex tex="f_x(x_0,y_0)" /> 是曲面与竖直平面 <Katex tex="y=y_0" /> 的交线在 <Katex tex="P_0" /> 处的切线斜率，<Katex tex="f_y" /> 是另一张截面 <Katex tex="x=x_0" /> 上的切线斜率。画板里绿线与橙线正是这两条交线，两条切一上一下，斜率一正一负，鞍面的形状就出来了。</p>
    <p>两条切线相交于 <Katex tex="P_0" />，它们张成一个平面，叫<b>切平面</b>。切平面是曲面在 <Katex tex="P_0" /> 附近最好的平面替身，它的方程是</p>
    <p style="text-align:center"><Katex display tex="z-z_0=f_x(x_0,y_0)(x-x_0)+f_y(x_0,y_0)(y-y_0)." /></p>
    <p>它也可以写成 <Katex tex="f_x\Delta x+f_y\Delta y-\Delta z=0" /> 的形式，看出切平面就是全微分取等号时的那张平面。</p>

    <h3 class="sec" id="m2-diff">全微分</h3>
    <p>切平面上的高度变化 <Katex tex="dz=f_x\Delta x+f_y\Delta y" /> 叫全微分，它是 <Katex tex="\Delta z" /> 的线性主部。可微的定义要求这个近似是<b>一致的</b>：误差 <Katex tex="\Delta z-dz" /> 相对于 <Katex tex="\rho" /> 是高阶无穷小，而不管 <Katex tex="(\Delta x,\Delta y)" /> 沿哪个方向趋于零。</p>
    <p>画板把这一点画得很直接。绿点在切平面上，紫点在曲面上，两者之差就是误差。第一档抛物面的曲面向上弯，切平面在它下方，误差随距离按二次增长，比例系数正是二阶偏导；第二档鞍面沿两个坐标轴方向的弯曲方向相反，误差也随之换号。</p>
    <p>一元函数里可导与可微是一回事，二元函数里不是。<b>可微必可偏导，且全微分系数就是偏导数；但偏导数存在不一定可微</b>。要判断可微，需要验证极限</p>
    <p style="text-align:center"><Katex display tex="\lim_{\rho\to0}\frac{\Delta z-f_x\Delta x-f_y\Delta y}{\rho}=0." /></p>
    <p>实际操作中常用的充分条件是：若 <Katex tex="f_x" />、<Katex tex="f_y" /> 在 <Katex tex="P_0" /> 的某邻域内存在，且在该点连续，则 <Katex tex="f" /> 在 <Katex tex="P_0" /> 可微。这条条件用起来方便，但它只是充分条件。</p>

    <h3 class="sec" id="m2-rel">可微、偏导与连续的关系</h3>
    <p>三条性质的关系可以排成一条链：<b>偏导数连续 <Katex tex="\Rightarrow" /> 可微 <Katex tex="\Rightarrow" /> 连续</b>，以及<b>可微 <Katex tex="\Rightarrow" /> 偏导数存在</b>。反过来一般都不成立。</p>
    <p>「偏导存在却不可微」的例子要用心构造。取 <Katex tex="f(x,y)=\sqrt{|xy|}" />，在原点两个偏导数都是零（沿坐标轴函数恒为零），但 <Katex tex="\Delta z=\sqrt{|\Delta x\Delta y|}" /> 与 <Katex tex="\rho" /> 同阶，误差比值随方向变化，因此不可微。「偏导存在却不连续」的例子是上一章的 <Katex tex="\dfrac{xy}{x^2+y^2}" />，它的偏导数在原点都存在（沿坐标轴函数为零），极限却不存在。</p>
    <p>这些反例说明：偏导数只是沿两条特殊方向的信息，它管不住别的方向。全微分要求所有方向同时被一张平面管住，条件自然更强。这一点在微4 会再次出现——任意方向的变化率由梯度统一给出，而梯度正是由两个偏导数拼成的向量。</p>

    <h3 class="sec" id="m2-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：求偏导时把另一个变量当常数，但别把它也求导。</strong>例如 <Katex tex="\dfrac{\partial}{\partial x}(x^2y)" /> 是 <Katex tex="2xy" />，不是 <Katex tex="2xy+x^2\cdot0" /> 之外的别的东西；写 <Katex tex="f_y" /> 时 <Katex tex="x^2" /> 整体是常数。</li>
        <li><strong>提示二：偏导数存在不等于连续，更不等于可微。</strong>判断连续要用二重极限，判断可微要验证 <Katex tex="\Delta z" /> 与线性主部之差是高阶无穷小。</li>
        <li><strong>提示三：全微分的两个系数就是偏导数，符号不能写反。</strong><Katex tex="dz=f_x\,dx+f_y\,dy" />，其中 <Katex tex="dx" />、<Katex tex="dy" /> 是自变量的增量，与 <Katex tex="\Delta x" />、<Katex tex="\Delta y" /> 在数值上相同。</li>
        <li><strong>提示四：混合偏导相等有前提。</strong><Katex tex="f_{xy}=f_{yx}" /> 要求两个混合偏导都连续；只算得出一侧的值时不能直接断言相等。</li>
      </ul>
    </div>
    <p>回收与预告：偏导数只管坐标轴方向，可现实中函数的自变量往往由别的变量套了一层——<Katex tex="z=f(u,v)" /> 而 <Katex tex="u" />、<Katex tex="v" /> 又是 <Katex tex="t" /> 的函数。下一章把这两层导数接起来。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPartDeriv } from '../../../boards/calc2/mul/partderiv.js';
import { MD_CHAPTERS } from './mnav.js';
</script>
