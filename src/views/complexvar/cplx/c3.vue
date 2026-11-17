<template>
  <ChPage :cur="3" no="复3" base="/complexvar/c" :chapters="CV_CHAPTERS"
    title="初等复变函数"
    sub="把实指数函数换到复数上，第一步就会发现它多了一个虚方向：沿着虚轴走，函数值绕着原点转圈。转一圈回到原处，于是周期出现了，对数函数也跟着变成了多值。"
    :toc="[{ id: 'c3-exp', t: '指数函数' }, { id: 'c3-log', t: '对数函数' }, { id: 'c3-pow', t: '幂函数与根式' }, { id: 'c3-tri', t: '三角与双曲函数' }, { id: 'c3-pit', t: '四条提示' }]">
    <div class="note good">定义 <Katex tex="e^z=e^x(\cos y+i\sin y)" />，其中 <Katex tex="z=x+iy" />。它在整个复平面上都有定义，实部是 <Katex tex="e^x\cos y" />，虚部是 <Katex tex="e^x\sin y" />。当 <Katex tex="y=0" /> 时它退化成实指数函数 <Katex tex="e^x" />，所以这个定义是把实函数「接着」写下去，而不是另起炉灶。</div>

    <div class="board-wrap">
      <BoardMount :factory="createElemCplx" />
      <div class="cap">图 复3 · <b>初等复变函数</b>：左图 <Katex tex="z" /> 平面，右图 <Katex tex="w" /> 平面。看点：① 横带 <Katex tex="-\pi<y<\pi" /> 被 <Katex tex="e^z" /> 卷成整个去掉了负实轴与原点的地方——竖线 <Katex tex="x=c" /> 映成半径 <Katex tex="e^c" /> 的圆（蓝），横线 <Katex tex="y=c" /> 映成张角 <Katex tex="c" /> 的射线（橙）；② 带的上、下边缘都映到负实轴上，所以带的宽度 <Katex tex="2\pi" /> 就是周期；③ 切到对数，紫虚线是分支的分界，换 <Katex tex="k" /> 整条带沿虚轴挪 <Katex tex="2\pi" />，同一个 <Katex tex="z" /> 因此有无穷多个对数。</div>
    </div>

    <h3 class="sec" id="c3-exp">指数函数</h3>
    <p>指数函数的三条性质逐条对照实函数看：</p>
    <p style="text-align:center"><Katex display tex="e^{z_1+z_2}=e^{z_1}e^{z_2},\qquad e^0=1,\qquad \frac{d}{dz}e^z=e^z." /></p>
    <p>前两条与实指数函数完全一样，乘法的规则照搬。第三条要到下一章才谈得上，这里先记下结论：复指数函数的导数还是它自己。</p>
    <p>多出来的性质是<b>周期性</b>。<Katex tex="e^{z+2\pi i}=e^z(\cos2\pi+i\sin2\pi)=e^z" />，所以 <Katex tex="2\pi i" /> 是它的一个周期，与实指数函数没有周期正好相反。画板把这一点摆得最明白：横带的上边缘 <Katex tex="y=\pi" /> 和下边缘 <Katex tex="y=-\pi" /> 都落在负实轴上，同一条射线被走了两遍。</p>
    <p>另一条与实函数不同的是<b>取值不取零</b>。模是 <Katex tex="e^x>0" />，永远到不了 <Katex tex="0" />；反过来，任何非零复数 <Katex tex="w=\rho e^{i\varphi}" /> 都能写成 <Katex tex="e^z" />，只要取 <Katex tex="x=\ln\rho" />、<Katex tex="y=\varphi+2k\pi" />。所以 <Katex tex="e^z" /> 的像集是去掉原点的整个平面，只是每个非零值都被取到无穷多次。</p>
    <p>把「无穷多次」压成「一次」，就得把 <Katex tex="z" /> 平面切成一条宽 <Katex tex="2\pi" /> 的横带。在带内 <Katex tex="e^z" /> 是单叶的，像是一条沿负实轴剖开的平面。这正是画板合适的取景，也是后面取对数分支的依据。</p>

    <h3 class="sec" id="c3-log">对数函数</h3>
    <p>对数是指数的反函数：满足 <Katex tex="e^w=z" /> 的 <Katex tex="w" /> 都叫 <Katex tex="z" /> 的对数。设 <Katex tex="z=re^{i\theta}" />，解出来是</p>
    <p style="text-align:center"><Katex display tex="w=\ln r+i(\theta+2k\pi),\qquad k=0,\pm1,\pm2,\dots" /></p>
    <p>每一个整数 <Katex tex="k" /> 给一个值，相邻两个差 <Katex tex="2\pi i" />。画板第二个预设里，紫色虚线标的就是分支的分界；<Katex tex="k" /> 一换，整条带平移 <Katex tex="2\pi" />，同一个 <Katex tex="z" /> 在带上的落点换了一层。</p>
    <p>取定 <Katex tex="k=0" />、把辐角限制在 <Katex tex="(-\pi,\pi]" />，得到<b>对数主值</b> <Katex tex="\operatorname{Log}z=\ln|z|+i\operatorname{Arg}z" />。它在去掉负实轴与原点后的平面上有定义、也连续，称为对数主值分支。负实轴去不掉：沿着它上下两侧走，辐角主值一个趋近 <Katex tex="\pi" />、一个趋近 <Katex tex="-\pi" />，对数在这里跳了 <Katex tex="2\pi i" />，所以这条轴是分支的<b>割线</b>。</p>
    <p>对数的三条运算规则要打折扣：<Katex tex="\operatorname{Log}(z_1z_2)" /> 与 <Katex tex="\operatorname{Log}z_1+\operatorname{Log}z_2" /> 一般相差一个 <Katex tex="2k\pi i" />。写成多值等式 <Katex tex="\operatorname{Ln}(z_1z_2)=\operatorname{Ln}z_1+\operatorname{Ln}z_2" /> 才对；一旦取了主值，等号就只在特定位置成立。</p>

    <h3 class="sec" id="c3-pow">幂函数与根式</h3>
    <p>有了对数，任意复数幂都能定义：</p>
    <p style="text-align:center"><Katex display tex="z^\alpha=e^{\alpha\operatorname{Ln}z}=e^{\alpha(\ln|z|+i(\arg z+2k\pi))}." /></p>
    <p>指数 <Katex tex="\alpha" /> 是整数时，<Katex tex="e^{2k\pi i\alpha}=1" />，多值性消失，<Katex tex="z^n" /> 与中学的写法一致。指数是分数 <Katex tex="1/n" /> 时，<Katex tex="e^{2k\pi i/n}" /> 只取 <Katex tex="n" /> 个不同值，恰好是单位圆内接正 <Katex tex="n" /> 边形的 <Katex tex="n" /> 个顶点——这就是 <Katex tex="n" /> 次方根的几何意义。指数是无理数或复数时，值的个数变成无穷，多值性又回来了。</p>
    <p>由此看出一个规律：<Katex tex="\alpha" /> 的分母决定了值的个数。写 <Katex tex="\alpha=p/q" />（既约），共有 <Katex tex="q" /> 个值；<Katex tex="\alpha" /> 为无理数时有无穷多个值。计算时先把 <Katex tex="z" /> 写成指数式，再把 <Katex tex="\alpha" /> 乘到模与辐角上，最后把可能的 <Katex tex="2k\pi\alpha" /> 逐个列出来。</p>

    <h3 class="sec" id="c3-tri">三角与双曲函数</h3>
    <p>由欧拉公式 <Katex tex="e^{i\theta}=\cos\theta+i\sin\theta" /> 反解出正弦与余弦的指数式，再把 <Katex tex="\theta" /> 换成复变量：</p>
    <p style="text-align:center"><Katex display tex="\sin z=\frac{e^{iz}-e^{-iz}}{2i},\qquad \cos z=\frac{e^{iz}+e^{-iz}}{2}." /></p>
    <p>它们在复平面上处处有定义，加减角公式、平方关系照旧成立。不同的是有界性没了：<Katex tex="\cos(iy)=\cosh y" />，虚轴上取值能任意大。零点仍只在实轴上，分别是 <Katex tex="k\pi" /> 与 <Katex tex="\pi/2+k\pi" />。</p>
    <p>双曲函数同样由指数定义：<Katex tex="\sinh z=\dfrac{e^z-e^{-z}}{2}" />、<Katex tex="\cosh z=\dfrac{e^z+e^{-z}}{2}" />。它们与三角函数之间只差一个 <Katex tex="i" />：<Katex tex="\sin(iz)=i\sinh z" />、<Katex tex="\cos(iz)=\cosh z" />。因此在复平面上，两族函数其实是同一族的两个方向。</p>
    <p>最后记一条负指数：<Katex tex="\sin^2z+\cos^2z=1" /> 仍然成立，但 <Katex tex="|\sin z|\le1" /> 不再成立。遇到含 <Katex tex="\sin" />、<Katex tex="\cos" /> 的不等式时，把 <Katex tex="z=x+iy" /> 代进去、化成双曲函数再看范围，是最稳妥的做法。</p>

    <h3 class="sec" id="c3-pit">四条提示</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：<Katex tex="e^z" /> 没有周期之外的特殊点，但有周期。</strong>「处处有定义」不等于「处处单叶」。单叶只能在宽 <Katex tex="2\pi" /> 的横带里谈，换一条带就换一套反函数。</li>
        <li><strong>提示二：对数不是函数，是函数族。</strong>写 <Katex tex="\operatorname{Ln}" /> 表示多值，写 <Katex tex="\operatorname{Log}" /> 表示主值，两者不可混用。运算等式只对多值写法无条件成立。</li>
        <li><strong>提示三：辐角主值的跳跃点就是对数的割线。</strong>负实轴上 <Katex tex="\operatorname{Arg}z" /> 从 <Katex tex="\pi" /> 跳到 <Katex tex="-\pi" />，对数在这里不连续。要研究导数，就把这条轴挖掉。</li>
        <li><strong>提示四：复数幂的值的个数看指数。</strong>整数指数单值、既约分数 <Katex tex="p/q" /> 有 <Katex tex="q" /> 个值、无理指数无穷多值。先判指数，再动笔算。</li>
      </ul>
    </div>
    <p>回收与预告：指数、对数、幂、三角函数都摆好了，复变函数的「初等」部分到此齐备。下一章开始问一个实函数里没有的问题：一个复变函数在一点可导，是什么意思？答案会让大部分实函数出局，留下来的那一小类，性质好得出奇。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createElemCplx } from '../../../boards/complexvar/cplx/elemcplx.js';
import { CV_CHAPTERS } from './cvnav.js';
</script>
