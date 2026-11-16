<template>
  <ChPage :cur="1" no="欧1" base="/vectors/e" :chapters="VE_CHAPTERS"
    title="三角形式与乘除的几何意义"
    sub="复数除了 a+bi，还能用模 r 与辐角 θ 写成 r(cosθ+i sinθ)。换一种写法，乘除法的规则立刻变得简单：积的模等于模之积、辐角等于辐角之和。几何上这就是先伸缩再旋转，除法反过来。"
    :toc="[{ id: 'e1-polar', t: '模与辐角' }, { id: 'e1-mul', t: '乘除的三角法则' }, { id: 'e1-geo', t: '旋转与伸缩' }, { id: 'e1-pit', t: '辐角多值、角要一致' }]">
    <div class="note good">把复数 <Katex tex="z=a+b\mathrm{i}" /> 对应到点 <Katex tex="Z" />，原点到 <Katex tex="Z" /> 的距离是模 <Katex tex="r=|z|" />，实轴正方向逆时针转到 <Katex tex="\overrightarrow{OZ}" /> 的角是辐角 <Katex tex="\theta" />。于是 <Katex tex="a=r\cos\theta" />、<Katex tex="b=r\sin\theta" />，复数写成<strong>三角形式</strong> <Katex tex="z=r(\cos\theta+\mathrm{i}\sin\theta)" />。</div>
    <div class="board-wrap">
      <BoardMount :factory="createPolarForm" />
      <div class="cap">图 欧1 · <b>三角形式与辐角</b>：金色向量是 <Katex tex="z" />，虚线圆半径就是模 <Katex tex="r" />，橙色弧是辐角 <Katex tex="\theta" />，横纵虚线给出 <Katex tex="r\cos\theta" /> 与 <Katex tex="r\sin\theta" />。看点：拖动 <Katex tex="Z" /> 绕原点转，<Katex tex="r" /> 不变时点沿虚线圆走，只有 <Katex tex="\theta" /> 在改；往里拖，圆缩小、模随之变小。<Katex tex="\theta" /> 扫过四个象限，余弦与正弦的符号按象限依次翻转。</div>
    </div>

    <h3 class="sec" id="e1-polar">模与辐角</h3>
    <p>三角形式把复数拆成两个实数：模 <Katex tex="r\ge0" /> 与辐角 <Katex tex="\theta" />。模用勾股定理算，<Katex tex="r=\sqrt{a^2+b^2}" />；辐角由 <Katex tex="\tan\theta=\dfrac{b}{a}" /> 与象限共同确定，只看正切会把角限定在半个周期里，第二、三象限的点就会判错。</p>
    <p>辐角不唯一：<Katex tex="\theta" /> 与 <Katex tex="\theta+2k\pi" /> 表示同一个方向上的点。习惯上取 <Katex tex="[0,2\pi)" /> 内的那个值作为辐角的主值，写三角形式时用它。图 欧1 的橙色弧按逆时针从实轴正方向量起，所以角度总是非负的。</p>

    <h3 class="sec" id="e1-mul">乘除的三角法则</h3>
    <p>设 <Katex tex="z_1=r_1(\cos\theta_1+\mathrm{i}\sin\theta_1)" />，<Katex tex="z_2=r_2(\cos\theta_2+\mathrm{i}\sin\theta_2)" />。把两个式子相乘，用和角公式整理可得</p>
    <p style="text-align:center"><Katex tex="z_1z_2=r_1r_2\big[\cos(\theta_1+\theta_2)+\mathrm{i}\sin(\theta_1+\theta_2)\big]," /></p>
    <p style="text-align:center"><Katex tex="\frac{z_1}{z_2}=\frac{r_1}{r_2}\big[\cos(\theta_1-\theta_2)+\mathrm{i}\sin(\theta_1-\theta_2)\big]\ (z_2\ne0)." /></p>
    <p>两式合起来一句话：乘法模相乘、辐角相加，除法模相除、辐角相减。复2 里「乘 <Katex tex="\mathrm{i}" /> 就是转九十度」正是这条法则的特例，因为 <Katex tex="\mathrm{i}" /> 的模为 1、辐角为 <Katex tex="90^\circ" />。</p>
    <p>反复相乘得到<strong>棣莫弗定理</strong>：</p>
    <p style="text-align:center"><Katex tex="\big[r(\cos\theta+\mathrm{i}\sin\theta)\big]^n=r^n(\cos n\theta+\mathrm{i}\sin n\theta)." /></p>
    <p>它把求幂化成模的乘方与角的倍数，是单位根与三角恒等式的一把钥匙。</p>

    <h3 class="sec" id="e1-geo">旋转与伸缩</h3>
    <p>乘法在图上做两件事：先把 <Katex tex="z_1" /> 的长度按 <Katex tex="r_2" /> 伸缩，再逆时针转 <Katex tex="\theta_2" />。两件事的先后次序不影响结果，因为伸缩不改变角度、旋转不改变长度。</p>
    <p>模为 1 的复数只负责旋转，称为纯旋转因子；辐角为零的复数只负责伸缩，就是一个正实数。任意复数乘法都能拆成这样两步，这也是复2 里「旋转加伸缩」那句话的来源。</p>

    <h3 class="sec" id="e1-pit">辐角多值、角要一致</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：辐角不唯一，写主值要说明范围。</strong><Katex tex="30^\circ" /> 与 <Katex tex="390^\circ" /> 是同一个方向，但三角形式里写哪个都合法，只是主值通常取 <Katex tex="[0,2\pi)" />。化简结果时把角折回主值，答案才与标准形式一致。</li>
        <li><strong>提示二：两项的角必须相同。</strong><Katex tex="r(\cos\theta+\mathrm{i}\sin\varphi)" /> 在 <Katex tex="\theta\ne\varphi" /> 时已不是三角形式，不能直接套乘法法则。先合并回 <Katex tex="a+b\mathrm{i}" />，再重新求模与辐角。</li>
        <li><strong>提示三：模要非负。</strong>写成 <Katex tex="r(\cos\theta+\mathrm{i}\sin\theta)" /> 时约定 <Katex tex="r>0" />。算出负的「模」说明角多转了 <Katex tex="180^\circ" />，把负号并进角里：<Katex tex="-r(\cos\theta+\mathrm{i}\sin\theta)=r\big[\cos(\theta+\pi)+\mathrm{i}\sin(\theta+\pi)\big]" />。</li>
        <li><strong>提示四：乘法后辐角可能超过一圈。</strong><Katex tex="\theta_1+\theta_2" /> 大于 <Katex tex="2\pi" /> 时减掉 <Katex tex="2\pi" /> 再写主值；减法得到负角时加回 <Katex tex="2\pi" />。数值不变，写出来的主值要落在约定范围内。</li>
      </ul>
    </div>
    <p>回收与预告：复2 的乘法法则在直角坐标下要展开四项，换成三角形式只剩「模相乘、角相加」一句，这就是换写法的收益。欧2 再把三角形式压缩成指数 <Katex tex="\mathrm{e}^{\mathrm{i}\theta}" />：欧拉公式把余弦与正弦收进一个符号，乘除法则变成指数的加减，方程 <Katex tex="z^n=1" /> 的根则均匀排在单位圆上。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarForm } from '../../../boards/vectors/euler/polarform.js';
import { VE_CHAPTERS } from './venav.js';
</script>
