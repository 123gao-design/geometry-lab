<template>
  <ChPage :cur="2" no="欧2" base="/vectors/e" :chapters="VE_CHAPTERS"
    title="欧拉公式与单位根"
    sub="把三角函数与指数函数接在一起的是欧拉公式 e^{iθ}=cosθ+i sinθ。单位圆上的每一点都有了指数写法，乘除法则退化成指数的加减；方程 z^n=1 的 n 个根均匀排在圆周上，连起来是一个正 n 边形。"
    :toc="[{ id: 'e2-euler', t: '欧拉公式' }, { id: 'e2-exp', t: '指数形式与乘除' }, { id: 'e2-root', t: '单位根' }, { id: 'e2-pit', t: '弧度、根数与求和' }]">
    <div class="note good"><strong>欧拉公式</strong>：对任意实数 <Katex tex="\theta" />，有 <Katex tex="\mathrm{e}^{\mathrm{i}\theta}=\cos\theta+\mathrm{i}\sin\theta" />。右边是单位圆上辐角为 <Katex tex="\theta" /> 的那个点，左边是一个指数。把两者并排放在一起，三角函数与指数函数就有了同一条通道。</div>
    <div class="board-wrap">
      <BoardMount :factory="createEuler" />
      <div class="cap">图 欧2 · <b>欧拉公式与单位根</b>：蓝点是单位圆上的 <Katex tex="P" />，横纵虚线读出 <Katex tex="\cos\theta" /> 与 <Katex tex="\sin\theta" />，橙色弧是辐角。金色点把圆周等分，紫色边连成正 <Katex tex="n" /> 边形，这些分点就是 <Katex tex="z^n=1" /> 的全部根。看点：拖动 <Katex tex="P" /> 走一圈，<Katex tex="\theta" /> 从 <Katex tex="0" /> 增到 <Katex tex="360^\circ" />，坐标在余弦、正弦之间此消彼长；滑块把 <Katex tex="n" /> 从 2 拨到 8，分点数与相邻夹角同时改，<Katex tex="P" /> 落到某个根上时判读会点名是第几个。</div>
    </div>

    <h3 class="sec" id="e2-euler">欧拉公式</h3>
    <p>公式的两边描述同一个点：右边按三角形式给出坐标，左边当作指数来读。把 <Katex tex="\theta=0,\ \pi/2,\ \pi" /> 逐一代入，得到 <Katex tex="\mathrm{e}^{0}=1" />、<Katex tex="\mathrm{e}^{\mathrm{i}\pi/2}=\mathrm{i}" />、<Katex tex="\mathrm{e}^{\mathrm{i}\pi}=-1" />，最后一条换个写法就是 <Katex tex="\mathrm{e}^{\mathrm{i}\pi}+1=0" />，五个常用常数出现在同一个等式里。</p>
    <p>由公式可以直接读出模与辐角：<Katex tex="|\mathrm{e}^{\mathrm{i}\theta}|=1" />，辐角为 <Katex tex="\theta" />，所以 <Katex tex="\mathrm{e}^{\mathrm{i}\theta}" /> 始终落在单位圆上。图 欧2 的蓝点沿圆周走动时，到原点的距离恒为 1，变的只有辐角。</p>

    <h3 class="sec" id="e2-exp">指数形式与乘除</h3>
    <p>任意复数写成 <Katex tex="z=r\mathrm{e}^{\mathrm{i}\theta}" />，称为<strong>指数形式</strong>，与三角形式只差一层记号。乘除在指数形式下变成指数的加减：</p>
    <p style="text-align:center"><Katex tex="r_1\mathrm{e}^{\mathrm{i}\theta_1}\cdot r_2\mathrm{e}^{\mathrm{i}\theta_2}=r_1r_2\,\mathrm{e}^{\mathrm{i}(\theta_1+\theta_2)},\qquad \frac{r_1\mathrm{e}^{\mathrm{i}\theta_1}}{r_2\mathrm{e}^{\mathrm{i}\theta_2}}=\frac{r_1}{r_2}\,\mathrm{e}^{\mathrm{i}(\theta_1-\theta_2)}." /></p>
    <p>取幂与开方同样简化：<Katex tex="(r\mathrm{e}^{\mathrm{i}\theta})^n=r^n\mathrm{e}^{\mathrm{i}n\theta}" />，这正是棣莫弗定理的指数写法。三角形式里要背的和角公式，到这里只是指数相加。</p>

    <h3 class="sec" id="e2-root">单位根</h3>
    <p>解方程 <Katex tex="z^n=1" />。把 <Katex tex="z" /> 写成 <Katex tex="r\mathrm{e}^{\mathrm{i}\theta}" />，则 <Katex tex="r^n\mathrm{e}^{\mathrm{i}n\theta}=1" />，比较模与辐角得 <Katex tex="r=1" />、<Katex tex="n\theta=2k\pi" />，于是</p>
    <p style="text-align:center"><Katex tex="z_k=\mathrm{e}^{2\pi k\mathrm{i}/n},\qquad k=0,1,\dots,n-1." /></p>
    <p>一共 <Katex tex="n" /> 个根，全部落在单位圆上，相邻两根的夹角是 <Katex tex="\dfrac{2\pi}{n}" />，连起来是正 <Katex tex="n" /> 边形。图 欧2 的金色点与紫色边就是这幅图景。其中 <Katex tex="k=0" /> 给出 <Katex tex="z=1" />，所以「<Katex tex="n" /> 个根」并不都是虚数。</p>
    <p>这 <Katex tex="n" /> 个根还有两条常用性质：全部相加为零，</p>
    <p style="text-align:center"><Katex tex="1+\zeta+\zeta^2+\cdots+\zeta^{n-1}=0\quad(\zeta\ne1)," /></p>
    <p>以及它们把 <Katex tex="z^n-1" /> 完整分解成 <Katex tex="z^n-1=\prod_{k=0}^{n-1}(z-z_k)" />。求和为零可以按等比数列算：分子 <Katex tex="\zeta^n-1=0" />，分母 <Katex tex="\zeta-1\ne0" />，商就是零。</p>

    <h3 class="sec" id="e2-pit">弧度、根数与求和</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：指数里的角用弧度。</strong><Katex tex="\mathrm{e}^{\mathrm{i}\theta}" /> 的 <Katex tex="\theta" /> 是实数，按弧度理解；写成 <Katex tex="\mathrm{e}^{\mathrm{i}\cdot30^\circ}" /> 只是记法上的方便，代入数值时必须换成 <Katex tex="\pi/6" />。三角形式里写角度无妨，指数形式里最好统一用弧度。</li>
        <li><strong>提示二：单位根恰好 <Katex tex="n" /> 个。</strong><Katex tex="z^3=1" /> 有三个根（含 <Katex tex="1" />），不是两个；<Katex tex="z^4=1" /> 有四个，其中 <Katex tex="\pm1" /> 两个是实数。数根数时把 <Katex tex="k=0" /> 到 <Katex tex="k=n-1" /> 数一遍，别漏掉实轴上的那两个。</li>
        <li><strong>提示三：求和为零要排除 <Katex tex="\zeta=1" />。</strong>公式 <Katex tex="1+\zeta+\cdots+\zeta^{n-1}=0" /> 对非 1 的根成立；<Katex tex="n" /> 个根全加起来当然也是零，但那是另一件事。用等比求和时先确认分母 <Katex tex="\zeta-1" /> 不为零。</li>
        <li><strong>提示四：<Katex tex="\mathrm{e}^{\mathrm{i}\theta}" /> 是复数。</strong>它的模为 1，一般不等于实数 1。只有当 <Katex tex="\theta" /> 是 <Katex tex="2\pi" /> 的整数倍时才落在实轴正半轴。把 <Katex tex="\mathrm{e}^{\mathrm{i}\theta}" /> 当成实指数函数去比较大小，会得出没有意义的结论。</li>
      </ul>
    </div>
    <p>回收与预告：向1 至向3 给出向量的画法，基1 至基3 把它化成坐标，积1 至积3 补上度量，应1 至应2 拿去解几何与物理题；复1 至复3 把平面上的点写成 <Katex tex="a+b\mathrm{i}" />，欧1 换成三角形式，这一页再压成指数。向量与复数六个子专题 16 章到此全部完成。下一步可以接配套练习：每章的徽章读数与判读都能直接改写成题目。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createEuler } from '../../../boards/vectors/euler/euler.js';
import { VE_CHAPTERS } from './venav.js';
</script>
