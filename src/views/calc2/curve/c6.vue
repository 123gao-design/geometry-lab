<template>
  <ChPage :cur="6" no="线6" base="/calc2/c" :chapters="MC_CHAPTERS"
    title="高斯公式与斯托克斯公式"
    sub="两条公式都在说「边界上的积分等于内部的积分」。高斯公式把闭曲面上的通量换成区域内的散度积分，斯托克斯公式把空间曲线上的环流换成曲面上的旋度通量。加上格林公式，三条公式对应三种维度的边界。"
    :toc="[{ id: 'c6-gauss', t: '高斯公式：散度与通量' }, { id: 'c6-stokes', t: '斯托克斯公式：旋度与环流' }, { id: 'c6-use', t: '用法与三条公式的对应' }, { id: 'c6-pit', t: '四条提示' }]">
    <div class="note good">高斯公式：设 <Katex tex="\Omega" /> 由分片光滑的闭合曲面 <Katex tex="S" />（取外侧）围成，<Katex tex="P" />、<Katex tex="Q" />、<Katex tex="R" /> 在 <Katex tex="\Omega" /> 上有一阶连续偏导数，则 <Katex tex="\iint_SP\,dydz+Q\,dzdx+R\,dxdy=\iiint_\Omega\left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\right)dV" />。斯托克斯公式：设 <Katex tex="\Gamma" /> 是曲面 <Katex tex="\Sigma" /> 的边界，方向与法向成右手关系，则 <Katex tex="\oint_\Gamma P\,dx+Q\,dy+R\,dz=\iint_\Sigma\left|\begin{matrix}dydz & dzdx & dxdy\\ \partial_x & \partial_y & \partial_z\\ P & Q & R\end{matrix}\right|" />。</div>

    <div class="board-wrap">
      <BoardMount :factory="createGauss" />
      <div class="cap">图 线6a · <b>高斯公式机</b>：闭合球面上画出外法向（紫箭）与场（橙箭）。场 <Katex tex="F=(x,y,z)" /> 从原点向外辐射，处处与法向同向，散度恒为 3。拖半径，通量按 <Katex tex="4\pi R^3" /> 变化，与 <Katex tex="\iiint_\Omega3\,dV" /> 逐位相同。</div>
    </div>

    <div class="board-wrap">
      <BoardMount :factory="createStokes" />
      <div class="cap">图 线6b · <b>斯托克斯公式机</b>：曲面是上半球面，绿色圆环是它的边界（方向与朝上的法向成右手关系），紫箭是旋度 <Katex tex="\nabla\times F=(0,0,2)" />。场 <Katex tex="F=(-y,x,0)" /> 绕 <Katex tex="z" /> 轴打转。沿绿环的环量与旋度穿过曲面的通量都是 <Katex tex="2\pi R^2" />。看点是：紫箭全是竖直的，而曲面鼓起来这件事不改变它们的总量——只要边界不变，换成任何张在这条环上的曲面，结果都一样。</div>
    </div>

    <h3 class="sec" id="c6-gauss">高斯公式：散度与通量</h3>
    <p>括号里的 <Katex tex="P_x+Q_y+R_z" /> 叫<b>散度</b>，记作 <Katex tex="\nabla\cdot F" />。它量的是「这一点是否在向外冒」：正的地方像源泉，负的地方像汇。高斯公式说的就是——闭曲面上的总通量，等于内部各点冒出量的总和。</p>
    <p>用画板的辐射场验证：<Katex tex="P=x" />、<Katex tex="Q=y" />、<Katex tex="R=z" />，散度是 <Katex tex="1+1+1=3" />，于是</p>
    <p style="text-align:center"><Katex display tex="\iint_SF\cdot n\,dS=\iiint_\Omega3\,dV=3\cdot\frac{4}{3}\pi R^3=4\pi R^3." /></p>
    <p>换个场试试：<Katex tex="F=(x,0,0)" /> 的散度是 1，通量 <Katex tex="\frac{4}{3}\pi R^3" />；<Katex tex="F=(0,0,z^2)" /> 的散度是 <Katex tex="2z" />，在球上积出零（球关于 <Katex tex="z=0" /> 对称，<Katex tex="2z" /> 是奇函数）。通量为零不代表场不存在，而是穿进去的和穿出来的正好抵消。</p>

    <h3 class="sec" id="c6-stokes">斯托克斯公式：旋度与环流</h3>
    <p>公式右端的行列式读作<b>旋度</b> <Katex tex="\nabla\times F" /> 与曲面法向的内积，再在曲面上积一次。旋度量的是「这一点附近场绕轴打转的强度与方向」。斯托克斯公式说的是——沿边界的环量，等于内部旋度穿过曲面的总量。</p>
    <p>画板的场 <Katex tex="F=(-y,x,0)" /> 旋度处处是 <Katex tex="(0,0,2)" />，竖直向上。上半球面朝上的法向与它同向，而投影到赤道圆盘上的面积是 <Katex tex="\pi R^2" />，于是</p>
    <p style="text-align:center"><Katex display tex="\oint_\Gamma F\cdot dr=\iint_\Sigma2\cos\gamma\,dS=2\cdot\pi R^2=2\pi R^2." /></p>
    <p>这和直接沿赤道圆参数化算环量得到的结果一致。曲面鼓起来会改变 <Katex tex="\cos\gamma" />，但它与 <Katex tex="dS" /> 的乘积正好折回投影面积，总量不变。</p>

    <h3 class="sec" id="c6-use">用法与三条公式的对应</h3>
    <p>这三条公式是同一件事在三个维度上的样子。格林公式处理平面区域：边界是曲线、内部是面；斯托克斯公式处理空间曲面：边界是曲线、内部是面，只是面弯在空间里；高斯公式处理空间区域：边界是闭曲面、内部是体。格林公式其实是斯托克斯公式在 <Katex tex="z=0" /> 平面上的特例。</p>
    <p>实际用法有两种方向。<b>化简</b>：曲面上的通量不好算时，若曲面闭合，改成对散度做三重积分；环流不好算时，换成旋度的通量。<b>补面</b>：曲面不闭合（比如半球面），补上赤道圆盘凑成闭合曲面，用高斯公式算出总量，再减去补的那一片。</p>
    <p>补面时两侧的朝向要一致。闭合曲面默认取外侧，那么半球面取外侧、补上的圆盘就要取朝下的一侧，否则减的时候符号会错。</p>

    <h3 class="sec" id="c6-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：曲面不闭合也套高斯公式。</strong>高斯公式的左边必须是闭合曲面；开曲面要先补面，或用斯托克斯。</li>
        <li><strong>提示二：散度与旋度算混。</strong>散度是三项偏导相加、结果是数；旋度是行列式、结果是向量。</li>
        <li><strong>提示三：边界方向与法向不配。</strong>斯托克斯公式要求右手关系：右手四指沿边界方向，拇指指向法向。</li>
        <li><strong>提示四：三重积分的体积元漏了因子。</strong>换到柱面或球面坐标时，<Katex tex="r" /> 与 <Katex tex="\rho^2\sin\varphi" /> 必须写进去，否则散度积完还是错的。</li>
      </ul>
    </div>
    <p>回收与预告：多元函数微积分的三条主线到此接上——微分学给出梯度与海森矩阵，重积分给出体积与质量，曲线曲面积分把边界与内部用三条公式连起来。接下来是复变函数与级数，边界与内部的关系在那里会以柯西积分定理的形式再出现一次。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGauss } from '../../../boards/calc2/curve/gauss.js';
import { createBoard as createStokes } from '../../../boards/calc2/curve/stokes.js';
import { MC_CHAPTERS } from './cnav.js';
</script>
