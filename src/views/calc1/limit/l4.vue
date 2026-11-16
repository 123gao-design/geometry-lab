<template>
  <ChPage :cur="4" no="极4" base="/calc1/l" :chapters="CL_CHAPTERS"
    title="连续与间断"
    sub="连续就是极限值等于函数值；极限与函数值一旦对不上，就按对不上的方式把间断分成四类。"
    :toc="[{ id: 'l4-def', t: '连续的三种说法' }, { id: 'l4-type', t: '间断点的分类' }, { id: 'l4-closed', t: '闭区间上连续函数的性质' }, { id: 'l4-elem', t: '初等函数的连续性' }]">

    <div class="note good" id="l4-def">设 <Katex tex="f" /> 在 <Katex tex="x_0" /> 的某个邻域内有定义。若 <Katex tex="\lim\limits_{x\to x_0}f(x)=f(x_0)" />，就称 <Katex tex="f" /> 在 <Katex tex="x_0" /> 处<b>连续</b>。这个等式要求三件事同时成立：极限存在、函数在 <Katex tex="x_0" /> 处有定义、两者相等。</div>

    <div class="board-wrap">
      <BoardMount :factory="createContLab" />
      <div class="cap">图 极4 · <b>连续与间断分类机</b>：五个预设各摆一个接缝，绿点与紫点从两侧逼近 <Katex tex="x_0" />，右栏逐项读左极限、右极限与 <Katex tex="f(1)" />，空心圈表示曲线在该处缺席，金色实心点是函数值。看点：前两档左右极限相等，差别只在函数值；第三档左右极限不等，分属两个高度；第四档两侧都冲向 <Katex tex="+\infty" />，极限不是有限数；第五档在 <Katex tex="x_0" /> 附近越摆越快，不趋于任何值。</div>
    </div>

    <h3 class="sec" id="l4-def">连续的三种说法</h3>
    <p>第一种是定义式本身：极限值等于函数值。第二种是<b>增量式</b>：把自变量改变量记为 <Katex tex="\Delta x" />，函数改变量记为 <Katex tex="\Delta y=f(x_0+\Delta x)-f(x_0)" />，连续等价于 <Katex tex="\lim\limits_{\Delta x\to0}\Delta y=0" />——自变量的微小改变只引起函数的微小改变，曲线没有断裂。第三种是 <Katex tex="\varepsilon\text{-}\delta" /> 形式：</p>
    <p><Katex display tex="\forall\,\varepsilon>0,\ \exists\,\delta>0,\quad |x-x_0|<\delta\ \Longrightarrow\ |f(x)-f(x_0)|<\varepsilon" /></p>
    <p>与极2 的极限定义相比，这一条把 <Katex tex="0<|x-x_0|" /> 换成了 <Katex tex="|x-x_0|" />：现在 <Katex tex="x=x_0" /> 也被允许，而且此时不等式自然成立。去掉「去心」这一笔，恰好就是从极限过渡到连续的那一步。</p>
    <p>只要求一侧就得到<b>单侧连续</b>。函数在开区间内每点连续称在区间内连续；在闭区间 <Katex tex="[a,b]" /> 上连续，指在 <Katex tex="(a,b)" /> 内每点连续，并在左端点右连续、右端点左连续。</p>
    <p>连续函数对四则运算封闭：两个连续函数的和、差、积、商（分母不为零处）仍连续，复合也连续。这条封闭性是后面所有「求极限直接代入」的做法的基础。</p>

    <h3 class="sec" id="l4-type">间断点的分类</h3>
    <p>若 <Katex tex="f" /> 在 <Katex tex="x_0" /> 的去心邻域内有定义而不连续，则 <Katex tex="x_0" /> 是<b>间断点</b>。按两个单侧极限的状况分成两类。</p>
    <p><b>第一类间断点</b>：左右极限都存在。其中左右极限相等但与函数值不同（或函数在此无定义）的叫<b>可去间断点</b>，只要补上或改掉一个值就能变连续；左右极限不相等的叫<b>跳跃间断点</b>，落差为两个单侧极限之差，补值是补不上的。</p>
    <p><b>第二类间断点</b>：至少有一个单侧极限不存在。趋于无穷的叫<b>无穷间断点</b>，如图 极4 第四档两侧同趋于 <Katex tex="+\infty" />；在某个范围内反复摆动、不趋于任何值的叫<b>振荡间断点</b>，第五档的 <Katex tex="\sin\dfrac{1}{x-1}" /> 在 <Katex tex="x\to1" /> 时摆动得越来越快，就是这一类。</p>
    <p>分类的依据只有一条：<b>左右极限存不存在、相不相等、与函数值是否一致</b>。图 极4 把这三次判断排成右栏的三行读数，滑到哪一档就对哪一档下结论。</p>

    <h3 class="sec" id="l4-closed">闭区间上连续函数的性质</h3>
    <p>函数在一点连续是局部性质。<Katex tex="f" /> 在<b>闭区间</b> <Katex tex="[a,b]" /> 上连续时，局部性质汇成四条整体结论：</p>
    <p><b>有界性定理：</b><Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上有界。<b>最值定理：</b><Katex tex="f" /> 在 <Katex tex="[a,b]" /> 上取到最大值与最小值。<b>介值定理：</b>若 <Katex tex="\mu" /> 介于 <Katex tex="f(a)" /> 与 <Katex tex="f(b)" /> 之间，则存在 <Katex tex="\xi\in[a,b]" /> 使 <Katex tex="f(\xi)=\mu" />。<b>零点定理：</b>若 <Katex tex="f(a)f(b)<0" />，则存在 <Katex tex="\xi\in(a,b)" /> 使 <Katex tex="f(\xi)=0" />。</p>
    <p>这四个条件都用到了「闭」与「连续」两处。开区间上连续不足以保证最值：<Katex tex="f(x)=\dfrac1x" /> 在 <Katex tex="(0,1)" /> 上连续，值域却是 <Katex tex="(1,+\infty)" />，既无界也无最大值。只连续一半也不行：跳跃函数在 <Katex tex="[0,1]" /> 上有界，却可能取不到中间某个值——介值定理靠的正是「曲线不跳」。</p>
    <p>零点定理是二分法的理论依据（数值计算一章的二分法机），也是判断方程有解最简单的手段：只需找到两个异号的端点。</p>

    <h3 class="sec" id="l4-elem">初等函数的连续性</h3>
    <p>基本初等函数在其定义区间内连续，由它们经有限次四则运算与复合而成的初等函数，在定义区间内也连续。于是求初等函数在定义区间内某点的极限，直接代入即可；极2 里「先验存在、再拆开」的那些步骤，对初等函数多半可以省掉。</p>
    <p>要注意的是分段的接缝。分段函数在每一段的内部由初等函数给出，天然连续，接缝处必须按定义单独核验：算左右极限，再与函数值比对。图 极4 的五个接缝全部设在同一处 <Katex tex="x_0=1" />，切档就是依次做五次核验。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：连续是「极限值等于函数值」，不是「函数有极限」。</strong>可去间断点的极限明明存在，函数却仍不连续。</li>
        <li><strong>提示二：无定义处也可能可去。</strong><Katex tex="\dfrac{\sin x}{x}" /> 在 <Katex tex="x=0" /> 无定义，补上 <Katex tex="f(0)=1" /> 后即连续。</li>
        <li><strong>提示三：间断点只对定义域内的聚点讨论。</strong><Katex tex="\sqrt{x}" /> 在 <Katex tex="x=0" /> 处右连续，左侧没有定义，谈不上间断。</li>
        <li><strong>提示四：闭区间上的性质不能搬到开区间。</strong>有界、最值、介值三条都要区间闭合，端点缺失时结论可能失效。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createContLab } from '../../../boards/calc1/limit/contlab.js';
import { CL_CHAPTERS } from './lnav.js';
</script>
