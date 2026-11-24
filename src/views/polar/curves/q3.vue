<template>
  <ChPage :cur="3" no="曲3" base="/polar/q" :chapters="PQ_CHAPTERS"
    title="常见极坐标曲线"
    sub="玫瑰线 $\rho=a\cos n\theta$、心形线 $\rho=a(1+\cos\theta)$、圆 $\rho=2a\cos\theta$、双纽线 $\rho^2=a^2\cos2\theta$、螺线 $\rho=a\theta$ —— 一条极径随极角变化的曲线，画法与读法都在图 曲3 上。"
    :toc="[{ id: 'q3-rose', t: '玫瑰线与瓣数' }, { id: 'q3-heart', t: '心形线、蚶线与圆' }, { id: 'q3-neg', t: '负极径：反向射线' }, { id: 'q3-more', t: '双纽线与两类螺线' }, { id: 'q3-pit', t: '读图与作图要点' }, { id: 'q3-quiz', t: '小练习' }]">
    <div class="note good" id="q3-def"><strong>常见极坐标方程一览</strong>：<Katex tex="\rho=a\cos2\theta" />（四叶玫瑰）、<Katex tex="\rho=a(1+\cos\theta)" />（心形线）、<Katex tex="\rho=2a\cos\theta" />（过极点、圆心在极轴上的圆）、<Katex tex="\rho^2=a^2\cos2\theta" />（双纽线）、<Katex tex="\rho=a\theta" />（阿基米德螺线）。判断形状先看两件事：<strong>极径随 θ 怎么变</strong>、<strong>ρ 什么时候取负</strong> —— 负的那一段画在反向射线上，颜色与形状都会跟着翻。</div>

    <ConicFigure number="曲3" title="玫瑰线、心形线与圆" head="bottom" :factory="createPolarFam">左栏 <Katex tex="\rho=a\cos n(\theta-\varphi)" />：按钮切 <Katex tex="n=2,3,4,5" />、滑块转 <Katex tex="\varphi" />，<Katex tex="\rho>0" /> 的瓣画蓝、<Katex tex="\rho<0" /> 的瓣画粉（「显示负径」可单隐藏粉色一半）；拖橙色 <Katex tex="\theta" /> 把手或点「▶ 扫掠」让射线自己转。右栏用六个按钮切 <strong>心形圆 / 蚶线 / 双纽线 / 阿基米德螺线 / 对数螺线 / 双曲螺线</strong>，每档自换比例尺与读数；底部状态栏读出当前 <Katex tex="\theta" /> 下各曲线的有符号极径。</ConicFigure>

    <h3 class="sec" id="q3-rose">玫瑰线与瓣数</h3>
    <p>玫瑰线写作 <Katex tex="\rho=a\cos n\theta" />（或 <Katex tex="\sin" /> 版，只是整体转过一个角）。它的形状由 <Katex tex="n" /> 的奇偶决定：</p>
    <table>
      <tr><td>方程</td><td>瓣数</td><td>花瓣尖端</td></tr>
      <tr><td><Katex tex="\rho=a\cos2\theta" /></td><td><Katex tex="4" /> 瓣</td><td>距极点 <Katex tex="a" />，指向 <Katex tex="0,\ \frac{\pi}{2},\ \pi,\ \frac{3\pi}{2}" /></td></tr>
      <tr><td><Katex tex="\rho=a\cos3\theta" /></td><td><Katex tex="3" /> 瓣</td><td><Katex tex="n" /> 为奇数时瓣数就是 <Katex tex="n" /></td></tr>
      <tr><td><Katex tex="\rho=a\cos4\theta" /></td><td><Katex tex="8" /> 瓣</td><td><Katex tex="n" /> 为偶数时瓣数是 <Katex tex="2n" /></td></tr>
    </table>
    <p>图 曲3 左栏取 <Katex tex="n=2" />：<Katex tex="\theta" /> 从 <Katex tex="0" /> 走到 <Katex tex="2\pi" />，<Katex tex="\rho" /> 变号四次，四个花瓣里两个由正极径画出、两个由负极径画出 —— 这就是玫瑰线「<Katex tex="n" /> 为偶数时瓣数翻倍」的来历。绿线 <Katex tex="x=\frac{\sqrt3}{4}a" /> 与曲线交出 <Katex tex="P_1\left(\frac a2,\ \frac{\pi}{6}\right)" />、<Katex tex="P_2\left(\frac a2,\ -\frac{\pi}{6}\right)" />：两点极径相同、极角对称，横坐标自然相同，落在同一条竖直线上。</p>
    <p>板上左栏可以继续把玩：四个 <Katex tex="n" /> 按钮切换瓣数（<Katex tex="n=3" /> 时变三瓣、<Katex tex="n=4" /> 时八瓣），「旋转 <Katex tex="\varphi" />」滑块把整朵花绕极点转过去；「显示负径」关掉后粉色一半消失，正径那一半会露出被遮盖的不完整形状。拖动画板上的橙色 <Katex tex="\theta" /> 把手，或点「▶ 扫掠」让射线自己转，都能看到极径在正负之间切换的瞬间。</p>

    <h3 class="sec" id="q3-heart">心形线、蚶线与圆</h3>
    <p><Katex tex="\rho=1+\cos\theta" /> 是心形线：<Katex tex="\theta=0" /> 时 <Katex tex="\rho=2" /> 最远，<Katex tex="\theta=\pi" /> 时 <Katex tex="\rho=0" /> 回到极点，尖就收在这里。它是「一固定焦点、离心率恰为 1」的圆锥曲线，因此也写作 <Katex tex="\rho=\frac{p}{1-\cos\theta}" /> 的那一族极限。</p>
    <p><Katex tex="\rho=\frac12\cos\theta" /> 是一条过极点、圆心在极轴上、直径 <Katex tex="\frac12" /> 的圆（<RouterLink class="xref" to="/polar/q1">圆的极坐标方程</RouterLink> 里的 <Katex tex="\rho=2a\cos\theta" /> 取 <Katex tex="a=\frac14" />）。圆与心形线的区别正好落在极径的符号上：圆的 <Katex tex="\rho" /> 只在 <Katex tex="\theta\in\left(-\frac{\pi}{2},\frac{\pi}{2}\right)" /> 上为正，其余方向要取负值，几何上就跑到反向去；心形线的 <Katex tex="\rho=1+\cos\theta\ge0" /> 恒不为负。</p>
    <p>把常数项与 <Katex tex="\cos" /> 的系数分开，得到一族<strong>蚶线</strong> <Katex tex="\rho=a+b\cos\theta" />：<Katex tex="b<a" /> 是外凸的蜗线，<Katex tex="b=a" /> 退成心形线，<Katex tex="b>a" /> 时负径把一段曲线画到极点另一侧，形成<strong>内环</strong>。板子右栏第 ② 档取 <Katex tex="\rho=1+2\cos\theta" />：<Katex tex="\cos\theta<-\frac12" /> 的方向上极径为负，粉色内环保围出来 —— 与玫瑰的粉瓣是同一套约定。</p>

    <h3 class="sec" id="q3-neg">负极径：反向射线</h3>
    <p>极坐标允许 <Katex tex="\rho<0" />。约定是：<Katex tex="(\rho,\theta)" /> 与 <Katex tex="(-\rho,\ \theta+\pi)" /> 表示同一点 —— 负的极径就是把点画到 <Katex tex="\theta" /> 的反向射线上。图 曲3 的粉色花瓣全部由此而来；拖动 <Katex tex="\theta" /> 到 <Katex tex="90^\circ" /> 附近，状态栏的 <Katex tex="\rho_1=\cos2\theta" /> 读数为负，蓝点与粉点在同一条直线上但分居极点两侧。</p>
    <p>读图时要分清两个「负」：<strong>方程给出的负值</strong>（必须画到反向）与<strong>图形看上去在第三象限</strong>（那可能只是 <Katex tex="\theta" /> 取在别处的结果）。判断某点属不属于曲线，标准做法只有一条：把它的极径、极角代回方程，等式成立就算在曲线上。</p>

    <h3 class="sec" id="q3-more">双纽线与两类螺线</h3>
    <p>另外两类常用曲线，性质各记一条就够：</p>
    <table>
      <tr><td>曲线</td><td>方程</td><td>要点</td></tr>
      <tr><td>双纽线</td><td><Katex tex="\rho^2=a^2\cos2\theta" /></td><td>只在 <Katex tex="\cos2\theta\ge0" /> 的方向有定义；两瓣关于极点对称，最远点 <Katex tex="\rho=a" />（<Katex tex="\theta=0,\ \pi" />）；过极点处的切线是两条互相垂直的直线。</td></tr>
      <tr><td>阿基米德螺线</td><td><Katex tex="\rho=a\theta\quad(\theta\ge0)" /></td><td>极径与极角成正比，转一圈向外推进 <Katex tex="2\pi a" />；过极点后每一圈都平行于前一圈，永不相交。</td></tr>
      <tr><td>三叶玫瑰</td><td><Katex tex="\rho=a\cos3\theta" /></td><td><Katex tex="n" /> 为奇数时瓣数等于 <Katex tex="n" />；三瓣互成 <Katex tex="120^\circ" />，没有「反色」的那一半。</td></tr>
      <tr><td>对数螺线</td><td><Katex tex="\rho=e^{a\theta}" /></td><td>极径按等比增长：转过相同角度，<Katex tex="\rho" /> 乘以同一个倍数，曲线越转越松、永不相交。</td></tr>
      <tr><td>心形变体</td><td><Katex tex="\rho=a(1-\cos\theta)" /></td><td>把 <Katex tex="\cos" /> 前换成负号，尖指向相反一侧；换成 <Katex tex="\sin" /> 则整体绕极点转 <Katex tex="90^\circ" />。</td></tr>
    </table>
    <p>图 曲3 右栏的第 ④ 档画的是 <Katex tex="\rho=\frac{\theta}{2\pi}" />，它就是把 <Katex tex="a=\frac{1}{2\pi}" /> 的阿基米德螺线取来量两圈；第 ③ 档的双纽线只在 <Katex tex="\cos2\theta\ge0" /> 的四个方向段上有定义，其余方向状态栏会直接标「无定义」；第 ⑤ 档 <Katex tex="\rho=e^{0.18\theta}" /> 是对数螺线，同样的转角对应同样的倍数，放大后与自身重合；第 ⑥ 档 <Katex tex="\rho=\frac{0.3}{\theta}" /> 是双曲螺线，<Katex tex="\theta\to0^+" /> 时极径趋于无穷，画面上只能看到它绕着极点打转、永远靠不近。</p>
    <p>这两条与玫瑰、心形线的差别在于<strong>定义域</strong>：双纽线要 <Katex tex="\cos2\theta\ge0" />，螺线通常只取 <Katex tex="\theta\ge0" />。画图前先把 <Katex tex="\theta" /> 的有效范围写出来，比事后修图省力得多。</p>
    <details class="deriv">
      <summary>展开：三条曲线换成直角坐标是什么样子</summary>
      <p><strong>圆</strong> <Katex tex="\rho=2a\cos\theta" />：两边乘 <Katex tex="\rho" /> 得 <Katex tex="\rho^2=2a\rho\cos\theta" />，代入 <Katex tex="\rho^2=x^2+y^2" />、<Katex tex="\rho\cos\theta=x" />，即 <Katex tex="x^2+y^2=2ax" />。</p>
      <p><strong>双纽线</strong> <Katex tex="\rho^2=a^2\cos2\theta" />：右端用 <Katex tex="\cos2\theta=\cos^2\theta-\sin^2\theta" /> 并乘 <Katex tex="\rho^2" />，得 <Katex tex="\rho^4=a^2(x^2-y^2)" />，即 <Katex tex="(x^2+y^2)^2=a^2(x^2-y^2)" /> —— 一条四次曲线。</p>
      <p><strong>心形线</strong> <Katex tex="\rho=1+\cos\theta" />：两边乘 <Katex tex="\rho" /> 得 <Katex tex="\rho^2=\rho+x" />，移项平方消去 <Katex tex="\rho" />，得 <Katex tex="(x^2+y^2-x)^2=x^2+y^2" />。</p>
      <p>看得出：极坐标方程简洁的曲线，直角坐标下往往是高次方程 —— 这正是遇到旋转与对称时优先用极坐标的原因。</p>
    </details>

    <h3 class="sec" id="q3-pit">读图与作图要点</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：先定 <Katex tex="\theta" /> 的范围再描点。</strong>玫瑰线、双纽线、螺线的定义域各不相同；范围没定就逐点描图，容易把曲线画重或漏画一段。</li>
        <li><strong>提示二：<Katex tex="\rho<0" /> 不是「无解」。</strong>它表示点在反向射线上；把负值直接丢掉，玫瑰线会只剩两瓣、圆会缺一半。</li>
        <li><strong>提示三：对称性先看方程。</strong><Katex tex="\rho(-\theta)=\rho(\theta)" /> 关于极轴对称；<Katex tex="\rho(\theta+\pi)=\rho(\theta)" /> 关于极点对称。利用对称性只画一半，另一半点对称复制。</li>
        <li><strong>提示四：与直角坐标互化别约掉 <Katex tex="\rho" />。</strong>由 <Katex tex="\rho^2=2a\rho\cos\theta" /> 得到圆时，<Katex tex="\rho=0" /> 的点（极点）不能丢；两边同除 <Katex tex="\rho" /> 前先说明它不为零，或者事后把极点补回。</li>
      </ul>
    </div>
    <p>圆与直线的极坐标方程已在前两节讲完，这一节补上曲线家族里最常见的几种。下一子专题换一套写法：用参数同时驱动横纵坐标，把曲线写成 <Katex tex="x=x(t),\ y=y(t)" /> 的一对式子。</p>

    <h3 class="sec" id="q3-quiz">小练习</h3>
    <ol class="quiz">
      <li><Katex tex="\rho=a\cos6\theta" /> 有几个花瓣？<details><summary>答案</summary><p><Katex tex="n=6" /> 为偶数，瓣数是 <Katex tex="2n=12" />。</p></details></li>
      <li>点 <Katex tex="\left(1,\ \frac{\pi}{3}\right)" /> 在不在曲线 <Katex tex="\rho=2\cos\theta" /> 上？<details><summary>答案</summary><p>代入：<Katex tex="2\cos\frac{\pi}{3}=1" />，与给定极径相等，在曲线上。</p></details></li>
      <li>双纽线 <Katex tex="\rho^2=a^2\cos2\theta" /> 在 <Katex tex="\theta=\frac{\pi}{2}" /> 方向上有定义吗？<details><summary>答案</summary><p>没有。<Katex tex="\cos\left(2\cdot\frac{\pi}{2}\right)=-1<0" />，右侧为负、开方无实数解。</p></details></li>
    </ol>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import ConicFigure from '../../../components/ConicFigure.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createPolarFam } from '../../../boards/polar/curves/polarfam.js';
import { PQ_CHAPTERS } from './pqnav.js';
</script>
<style scoped>
.deriv { margin: 12px 0 4px; border: 1px solid var(--line); border-radius: 10px; background: var(--bg2); padding: 6px 14px; }
.deriv summary { cursor: pointer; font-size: 13px; color: var(--mut); padding: 4px 0; list-style: none; }
.deriv summary::-webkit-details-marker { display: none; }
.deriv summary::before { content: '▸'; display: inline-block; margin-right: 6px; font-size: 10px;
  color: var(--faint); transition: transform .16s ease; }
.deriv[open] summary::before { transform: rotate(90deg); }
.deriv p { margin: .45em 0; font-size: 14px; line-height: 1.8; color: var(--ink); }
.quiz { padding-left: 1.4em; }
.quiz li { margin: .5em 0; }
.quiz details { margin: 4px 0 0; }
.quiz summary { cursor: pointer; font-size: 12.5px; color: var(--blue); }
.quiz p { margin: .35em 0 0; color: var(--mut); font-size: 13.5px; }
</style>
