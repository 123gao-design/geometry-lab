<template>
  <ChPage :cur="4" no="微4" base="/calc2/m" :chapters="MD_CHAPTERS"
    title="方向导数与梯度"
    sub="从一个点出发，方向不止两个。沿单位方向 l 走一步的变化率叫方向导数，它等于梯度在 l 上的投影。梯度是这些方向导数里最大的那一个，方向就是等值线的法向。"
    :toc="[{ id: 'm4-dir', t: '方向导数' }, { id: 'm4-grad', t: '梯度' }, { id: 'm4-prop', t: '性质与计算' }, { id: 'm4-geo', t: '等值线与最速上升' }, { id: 'm4-pit', t: '四条提示' }]">
    <div class="note good">设 <Katex tex="f(x,y)" /> 在点 <Katex tex="P_0" /> 可微，<Katex tex="l" /> 是一个方向，单位向量 <Katex tex="\vec e_l=(\cos\alpha,\cos\beta)" />。沿 <Katex tex="l" /> 的<b>方向导数</b>为 <Katex tex="\dfrac{\partial f}{\partial l}=f_x\cos\alpha+f_y\cos\beta" />。称向量 <Katex tex="(f_x,f_y)" /> 为 <Katex tex="f" /> 在 <Katex tex="P_0" /> 的<b>梯度</b>，记作 <Katex tex="\nabla f" /> 或 <Katex tex="\operatorname{grad}f" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createGradField" />
      <div class="cap">图 微4 · <b>方向导数与梯度</b>：暖橙是高处、冷蓝是低处，灰线是等值线；蓝箭头是梯度 <Katex tex="\nabla f" />，橙箭头是任取的方向 <Katex tex="l" />，绿色是梯度在 <Katex tex="l" /> 上的投影，其长度就是 <Katex tex="\dfrac{\partial f}{\partial l}" />。看点：把方向角转到与梯度同向，绿段最长；转到与等值线相切，绿段缩成一点，读数为零；再转过去变负，说明沿这个方向函数在减小。第三档 <Katex tex="f=x^2+4y^2" /> 的等值线是压扁的椭圆，梯度与等值线垂直，但不再指向原点。</div>
    </div>

    <h3 class="sec" id="m4-dir">方向导数</h3>
    <p>方向导数的定义仍是差商的极限，只是差分的落点换成了一条射线上：</p>
    <p style="text-align:center"><Katex display tex="\frac{\partial f}{\partial l}\Big|_{P_0}=\lim_{t\to0^+}\frac{f(P_0+t\vec e_l)-f(P_0)}{t}." /></p>
    <p>它量的是「从 <Katex tex="P_0" /> 沿 <Katex tex="l" /> 走一小段，函数值升得多快」。由于 <Katex tex="t" /> 只能为正，这是单侧的；把 <Katex tex="l" /> 换成反方向 <Katex tex="-l" />，方向导数就变号。</p>
    <p>若 <Katex tex="l" /> 取 <Katex tex="x" /> 轴正方向 <Katex tex="(1,0)" />，方向导数就是 <Katex tex="f_x" />；取 <Katex tex="y" /> 轴正方向就是 <Katex tex="f_y" />。所以偏导数是方向导数的两个特例，而方向导数把方向扩展到整圈。</p>
    <p>公式 <Katex tex="f_x\cos\alpha+f_y\cos\beta" /> 要求 <Katex tex="(\cos\alpha,\cos\beta)" /> 是<b>单位</b>向量。方向角取错或忘记单位化，算出来的值会大出一个倍数。</p>

    <h3 class="sec" id="m4-grad">梯度</h3>
    <p>把方向导数的公式写成内积：</p>
    <p style="text-align:center"><Katex display tex="\frac{\partial f}{\partial l}=\nabla f\cdot\vec e_l=|\nabla f|\,\cos\theta," /></p>
    <p>其中 <Katex tex="\theta" /> 是梯度与 <Katex tex="l" /> 的夹角。这个式子把方向导数的全部信息压进了一步：<b>方向导数就是梯度在 <Katex tex="l" /> 上的投影</b>。画板里绿段的长度正是这个投影，橙箭头转动，绿段随之伸缩。</p>
    <p>由此立即读出一串结论。因为 <Katex tex="\cos\theta\le1" />，方向导数在 <Katex tex="l" /> 与梯度同向时取最大值 <Katex tex="|\nabla f|" />；反向时取最小值 <Katex tex="-|\nabla f|" />；垂直时为零。梯度为零向量的点，所有方向的方向导数都是零。</p>
    <p>这些结论在三维也成立，只是梯度多一个分量：<Katex tex="\nabla f=(f_x,f_y,f_z)" />，方向余弦有三个，投影公式不变。</p>

    <h3 class="sec" id="m4-prop">性质与计算</h3>
    <p>梯度与求导运算满足线性的那套规则：<Katex tex="\nabla(f\pm g)=\nabla f\pm\nabla g" />，<Katex tex="\nabla(cf)=c\nabla f" />，乘积有 <Katex tex="\nabla(fg)=f\nabla g+g\nabla f" />。这些都可以由各分量的求导法则逐条验证。</p>
    <p>计算时先写出一阶偏导，再把点的坐标代进去。得到的梯度是一个<b>点上的向量</b>，不是整张场；换一个点就要重算。画板里拖动 <Katex tex="P" /> 时蓝箭头随之改变，正说明这一点。</p>
    <p>方向导数则要再多一步：把方向单位化，与梯度作内积。<Katex tex="\vec e_l" /> 的分量有一个简单记法——二维时 <Katex tex="\vec e_l=(\cos\alpha,\sin\alpha)" />，三维时三个分量平方和为 1。</p>

    <h3 class="sec" id="m4-geo">等值线与最速上升</h3>
    <p>梯度垂直于等值线，这一点来自隐函数求导：等值线 <Katex tex="f(x,y)=c" /> 在 <Katex tex="P_0" /> 处的切线方向 <Katex tex="(1,y')" /> 满足 <Katex tex="f_x+f_y y'=0" />，也就是与 <Katex tex="(f_x,f_y)" /> 垂直。既然梯度垂直于等值线，沿着等值线走时方向导数自然为零——函数值不变，正是等值线的意思。</p>
    <p>垂直于等值线有两个朝向，梯度取的是函数值增大的那一侧。把地形图上的等高线想成台阶，梯度就是指向最近一级更高台阶的方向，其长度是台阶的陡峭程度。爬山时沿梯度走每一小步最快升高，沿负梯度走最快下降，这就是梯度下降法只用 <Katex tex="-\nabla f" /> 的原因。</p>
    <p>第三档 <Katex tex="f=x^2+4y^2" /> 是一个值得多看一眼的例子。等值线是长短轴之比为 <Katex tex="2:1" /> 的椭圆，在 <Katex tex="(x_0,y_0)" /> 处梯度是 <Katex tex="(2x_0,8y_0)" />，方向并不沿原点的连线，除非点在坐标轴上。等值线越密的方向，梯度越大，这也是等高线图能读出陡缓的原因。</p>

    <h3 class="sec" id="m4-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：方向没有单位化。</strong>给定方向向量 <Katex tex="(3,4)" /> 时，单位向量是 <Katex tex="(3/5,4/5)" />，方向导数要拿它去作内积；直接代 <Katex tex="(3,4)" /> 会得到五倍的结果。</li>
        <li><strong>提示二：把方向导数与偏导数混为一谈。</strong>偏导数是沿坐标轴的两个特例，方向导数是任意方向；只有沿坐标轴时数值才相等。</li>
        <li><strong>提示三：以为梯度指向函数值最大的点。</strong>梯度指的是「上升最快的方向」，沿着它走一小步上升最多，但它并不指向远处的最大值所在。</li>
        <li><strong>提示四：可微是公式的前提。</strong>不可微的点上，方向导数可能不存在，或者存在却不等于 <Katex tex="\nabla f\cdot\vec e_l" />；使用公式前先确认可微。</li>
      </ul>
    </div>
    <p>回收与预告：梯度为零的点是驻点，那里所有方向的方向导数都为零。驻点可能是山峰、谷底，也可能是鞍点，要区分它们，得看二阶偏导组成的海塞矩阵。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGradField } from '../../../boards/calc2/mul/gradfield.js';
import { MD_CHAPTERS } from './mnav.js';
</script>
