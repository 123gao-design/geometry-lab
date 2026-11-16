<template>
  <ChPage :cur="6" no="微6" base="/calc2/m" :chapters="MD_CHAPTERS"
    title="拉格朗日乘数法"
    sub="条件极值要求目标函数只能在一条曲线上取点。曲线上的可行方向与约束的梯度垂直，极值点处目标函数的梯度必须与约束的梯度平行——把这件事写成一个乘子 λ，就得到拉格朗日乘数法。"
    :toc="[{ id: 'm6-idea', t: '条件极值的几何想法' }, { id: 'm6-method', t: '乘数法的步骤' }, { id: 'm6-ex', t: '三个例子' }, { id: 'm6-extra', t: '多约束与几点补充' }, { id: 'm6-pit', t: '四条提示' }]">
    <div class="note good">求 <Katex tex="f(x,y)" /> 在约束 <Katex tex="\varphi(x,y)=0" /> 下的极值：构造 <Katex tex="L(x,y,\lambda)=f(x,y)+\lambda\varphi(x,y)" />，令 <Katex tex="L_x=0" />、<Katex tex="L_y=0" />、<Katex tex="L_\lambda=0" />，即 <Katex tex="f_x+\lambda\varphi_x=0" />、<Katex tex="f_y+\lambda\varphi_y=0" />、<Katex tex="\varphi=0" />。解出的点即条件极值的候选点。</div>

    <div class="board-wrap">
      <BoardMount :factory="createLagrange" />
      <div class="cap">图 微6 · <b>拉格朗日乘数机</b>：金线是约束 <Katex tex="\varphi=0" />，底色是目标函数的等值线地图，红点是切点，绿线是过切点的那条等值线，紫虚线是两条曲线在切点处的公切线；蓝色与青色分别是 <Katex tex="\nabla f" /> 与 <Katex tex="\nabla\varphi" />，它们始终在同一直线上。看点：① 拖动半径，切点沿圆走，<Katex tex="\lambda" /> 恒为 <Katex tex="1/2" />；② 椭圆上离 <Katex tex="(3,0)" /> 最近与最远的两点都在 <Katex tex="x" /> 轴上；③ 直线约束下切点落在 <Katex tex="(c/2,c/2)" />。</div>
    </div>

    <h3 class="sec" id="m6-idea">条件极值的几何想法</h3>
    <p>无条件极值要求 <Katex tex="\nabla f=0" />，因为点是自由移动的，任何方向都可以试。条件极值不同：点被约束在曲线 <Katex tex="\varphi=0" /> 上，只允许沿曲线的切向挪动。若 <Katex tex="\nabla f" /> 在切向上有分量，沿切向走一小步，函数值还会变，那这个点就不是极值点。所以极值点处 <Katex tex="\nabla f" /> 必须与切向垂直。</p>
    <p>另一方面，约束曲线的法向就是 <Katex tex="\nabla\varphi" />（隐函数求导一章的结论：等值线的法向取梯度）。法向只有一个方向，于是 <Katex tex="\nabla f" /> 与 <Katex tex="\nabla\varphi" /> 平行：</p>
    <p style="text-align:center"><Katex display tex="\nabla f=\lambda\nabla\varphi,\qquad \varphi(x,y)=0." /></p>
    <p>两个方程、两个未知数 <Katex tex="(x,y)" /> 加一个 <Katex tex="\lambda" />，恰好配上。几何上这句话说的是：<b>目标函数的等值线与约束曲线在极值点相切</b>。画板里绿线与金线相切，红点就是切点。</p>

    <h3 class="sec" id="m6-method">乘数法的步骤</h3>
    <p>第一步，写出拉格朗日函数 <Katex tex="L=f+\lambda\varphi" />。第二步，令 <Katex tex="L" /> 的三个偏导都为零，得到方程组。第三步，解方程组，把 <Katex tex="x" />、<Katex tex="y" /> 用 <Katex tex="\lambda" /> 表示（或消去 <Katex tex="\lambda" />），代回约束方程。第四步，比较各候选点的函数值，最大与最小即为所求。</p>
    <p>解方程时有两条常用路子。其一是从两个偏导方程里把 <Katex tex="\lambda" /> 消掉，得到只含 <Katex tex="x" />、<Katex tex="y" /> 的关系，再与约束联立；其二是把 <Katex tex="\lambda" /> 保留到最后，先算出 <Katex tex="(x,y)" />，再回代读 <Katex tex="\lambda" />。题目里有明显对称性时，第二条更省事。</p>
    <p><Katex tex="\lambda" /> 本身不需要求出来，但它在经济学里有一个解释：约束右端放松一个单位时，最优值大约增加 <Katex tex="\lambda" />。画板把 <Katex tex="\lambda" /> 显示在徽章里，拖约束参数时可以看它随约束的变化。</p>

    <h3 class="sec" id="m6-ex">三个例子</h3>
    <p><b>例一：圆上的乘积。</b>求 <Katex tex="f=xy" /> 在 <Katex tex="x^2+y^2=R^2" /> 上的最值。</p>
    <p style="text-align:center"><Katex display tex="y+2\lambda x=0,\qquad x+2\lambda y=0,\qquad x^2+y^2=R^2." /></p>
    <p>两式相除得 <Katex tex="x^2=y^2" />，即 <Katex tex="y=\pm x" />。代入约束得四个候选点，函数值分别是 <Katex tex="\pm R^2/2" />。最大值为 <Katex tex="R^2/2" />，在 <Katex tex="(R/\sqrt2,R/\sqrt2)" /> 与对径点取到；最小值为 <Katex tex="-R^2/2" />。此处 <Katex tex="\lambda=\mp1/2" />，与 <Katex tex="R" /> 无关。</p>
    <p><b>例二：椭圆上的最近与最远。</b>求 <Katex tex="f=(x-3)^2+y^2" /> 在 <Katex tex="\dfrac{x^2}{a^2}+y^2=1" /> 上的最值。约束的梯度在 <Katex tex="x" /> 轴上只有 <Katex tex="x" /> 分量，目标函数的梯度也在 <Katex tex="x" /> 轴上，两处平行只可能发生在 <Katex tex="y=0" />，候选点是 <Katex tex="(\pm a,0)" />。函数值分别是 <Katex tex="(a-3)^2" /> 与 <Katex tex="(a+3)^2" />，最小与最大随之确定。</p>
    <p><b>例三：直线上的最小距离。</b>求 <Katex tex="f=x^2+y^2" /> 在 <Katex tex="x+y=c" /> 上的最小值。两个梯度分别是 <Katex tex="(2x,2y)" /> 与 <Katex tex="(1,1)" />，平行要求 <Katex tex="x=y" />；代入约束得 <Katex tex="(c/2,c/2)" />，最小值为 <Katex tex="c^2/2" />。这个点正是原点在直线上的垂足，与点到直线的距离公式一致。</p>

    <h3 class="sec" id="m6-extra">多约束与几点补充</h3>
    <p>有两个约束时，把乘子写成 <Katex tex="\mu" />、<Katex tex="\nu" />：<Katex tex="L=f+\lambda\varphi+\mu\psi" />，梯度条件变成 <Katex tex="\nabla f" /> 落在 <Katex tex="\nabla\varphi" />、<Katex tex="\nabla\psi" /> 张成的平面里。空间曲线的条件极值就是这样处理的。</p>
    <p>乘数法给的是<b>必要条件</b>，与无条件的驻点一样，解出来的点只是候选。充分性要另外判断，常见做法是看约束曲线附近的等值线密度：由外向内看，等值线先靠近再远离的那个点就是极值点。实际题目里候选点往往只有几个，直接比较函数值即可。</p>
    <p>与无条件极值的联系值得记一笔：把 <Katex tex="\varphi" /> 也看成变量，拉格朗日函数的高阶判别仍可用海塞矩阵，只是要在约束方向的子空间里看。这一点在多元函数的最优化里展开成一个独立话题，此处只需知道结论的方向。</p>

    <h3 class="sec" id="m6-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：把乘号写成了减号。</strong><Katex tex="L=f+\lambda\varphi" /> 与 <Katex tex="L=f-\lambda\varphi" /> 得到的 <Katex tex="\lambda" /> 符号相反，候选点不变；但混用两种写法去回代，容易算错 <Katex tex="\lambda" />。</li>
        <li><strong>提示二：只解出方程，忘了约束。</strong>两个梯度平行的方程只说明方向，点还得落在 <Katex tex="\varphi=0" /> 上；三个方程必须一起解。</li>
        <li><strong>提示三：漏掉 <Katex tex="\nabla\varphi=0" /> 的点。</strong>约束曲线有尖点或自交点时，<Katex tex="\nabla\varphi" /> 可能为零，那里不会出现乘子方程的解，却仍可能是极值，要单独检查。</li>
        <li><strong>提示四：以为乘数法给的是等号两侧的完整最值。</strong>它给出候选点，还要比较函数值；约束曲线不封闭时，最值可能不存在，只有上确界。</li>
      </ul>
    </div>
    <p>回收与预告：微分学到这里告一段落。下一部分换一个方向，把一元函数的定积分推广到平面与空间区域，先问「一块区域上的和」怎么写，再问怎么算。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createLagrange } from '../../../boards/calc2/mul/lagrange.js';
import { MD_CHAPTERS } from './mnav.js';
</script>
