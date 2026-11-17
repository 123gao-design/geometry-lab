<template>
  <ChPage :cur="1" no="积1" base="/calc1/i" :chapters="IN_CHAPTERS"
    title="原函数与不定积分"
    sub="把求导倒过来问：哪条曲线求导以后得到 f？答案不止一条，它们上下平移，差一个常数。"
    :toc="[{ id: 'i1-def', t: '原函数' }, { id: 'i1-fam', t: '原函数族' }, { id: 'i1-table', t: '基本积分表' }, { id: 'i1-lin', t: '线性性质' }]">

    <div class="note good" id="i1-def">若 <Katex tex="F'(x)=f(x)" /> 在区间 <Katex tex="I" /> 上处处成立，就称 <Katex tex="F" /> 是 <Katex tex="f" /> 在 <Katex tex="I" /> 上的一个<b>原函数</b>。求导与求原函数互为逆运算：一个给变化率，一个把变化率还原成函数本身。</div>

    <div class="board-wrap">
      <BoardMount :factory="createAntideriv" />
      <div class="cap">图 积1 · <b>原函数族与不定积分</b>：蓝线是 <Katex tex="f" />，橙色一族是各个 <Katex tex="F(x)+C" />。看点：<Katex tex="C" /> 一拖，整族曲线一起上下平移，而每条曲线在 <Katex tex="x_0" /> 处的切线斜率始终等于蓝色的高度。</div>
    </div>

    <h3 class="sec" id="i1-def">从求导倒着问</h3>
    <p>导数回答的是「已知函数，它的变化率是什么」。积分回答反过来的问题：已知变化率，把函数本身找回来。位移求导得速度，速度求导得加速度，反过来，速度的原函数就是位移（差一个初值），加速度的原函数就是速度。</p>
    <p>原函数不是唯一的。常数求导为零，所以只要 <Katex tex="F" /> 是 <Katex tex="f" /> 的原函数，<Katex tex="F(x)+C" /> 对任意常数 <Katex tex="C" /> 也都是。图 积1 把这一点画了出来：同一族曲线形状完全一致、只差高度，因为它们在同一个横坐标处的切线斜率由 <Katex tex="f" /> 决定，与 <Katex tex="C" /> 无关。</p>

    <h3 class="sec" id="i1-fam">原函数族与积分常数</h3>
    <p>若 <Katex tex="F" /> 与 <Katex tex="G" /> 都是 <Katex tex="f" /> 在区间 <Katex tex="I" /> 上的原函数，则 <Katex tex="(F-G)'=0" />，于是 <Katex tex="F-G" /> 恒为常数。这说明 <Katex tex="f" /> 的<b>全部</b>原函数就是 <Katex tex="F(x)+C" />，一个不多一个不少。「一个区间上」这几个字不能省：<Katex tex="\ln|x|" /> 的两支各自差常数，合起来不能写成同一个 <Katex tex="\ln x+C" />。</p>
    <p>全体原函数记作</p>
    <p style="text-align:center"><Katex display tex="\int f(x)\,\mathrm{d}x=F(x)+C" /></p>
    <p>右边是函数族，不是一个数，所以那个 <Katex tex="+C" /> 必须写。求不定积分得到的是一整族曲线；要指定其中一条，需要另加条件，比如「过点 <Katex tex="(0,1)" />」，那时 <Katex tex="C" /> 才被定下来。</p>

    <h3 class="sec" id="i1-table">基本积分表</h3>
    <p>积分表由求导表倒着读，不需要另背。下面几行最常用，右边一列是求导核验：</p>
    <p style="text-align:center"><Katex display tex="\int x^{a}\,\mathrm{d}x=\frac{x^{a+1}}{a+1}+C\quad(a\neq-1),\qquad \int \frac{\mathrm{d}x}{x}=\ln|x|+C" /></p>
    <p style="text-align:center"><Katex display tex="\int \mathrm{e}^x\mathrm{d}x=\mathrm{e}^x+C,\qquad \int \cos x\,\mathrm{d}x=\sin x+C,\qquad \int \sin x\,\mathrm{d}x=-\cos x+C" /></p>
    <p style="text-align:center"><Katex display tex="\int \frac{\mathrm{d}x}{1+x^2}=\arctan x+C,\qquad \int \frac{\mathrm{d}x}{\sqrt{1-x^2}}=\arcsin x+C" /></p>
    <p>注意 <Katex tex="a=-1" /> 那一格的特殊：公式 <Katex tex="x^{a+1}/(a+1)" /> 在 <Katex tex="a=-1" /> 时分母为零，于是单独成一行。这条「例外」正是后面换元与分部积分反复出现的形状源头——凡是幂次差一点就积不出来的地方，多半要凑成对数。</p>

    <h3 class="sec" id="i1-lin">线性性质</h3>
    <p>积分与求导一样，对加法与数乘封闭：</p>
    <p style="text-align:center"><Katex display tex="\int\left[\alpha f(x)+\beta g(x)\right]\mathrm{d}x=\alpha\int f(x)\,\mathrm{d}x+\beta\int g(x)\,\mathrm{d}x" /></p>
    <p>这一条把多项式、以及拆得开的和式都变成了逐项积。但乘积与商没有对应的拆法，<Katex tex="\int fg" /> 一般不等于 <Katex tex="\int f\cdot\int g" />。处理乘积要换元或分部积分，这正是后两章的内容。</p>
    <p>图 积1 的四个预设可以对着看：<Katex tex="2x" /> 的原函数是 <Katex tex="x^2+C" />，<Katex tex="\cos x" /> 的原函数是 <Katex tex="\sin x+C" />，<Katex tex="1/x" /> 的原函数是 <Katex tex="\ln x+C" />（只画右支），<Katex tex="\mathrm{e}^x" /> 的原函数仍是 <Katex tex="\mathrm{e}^x+C" />——指数函数在求导下形状不变，所以它在积分下也不变。</p>

    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：不定积分的结果是函数族。</strong>漏写 <Katex tex="+C" /> 是这一章最常见的错。即便题目后面要代入初始条件，也该先带着 <Katex tex="C" /> 再定值。</li>
        <li><strong>提示二：积分没有「乘积法则」。</strong><Katex tex="\int x\cos x\,\mathrm{d}x" /> 不能拆成 <Katex tex="\int x\cdot\int\cos x" />。看到乘积就想换元或分部。</li>
        <li><strong>提示三：定义域要分段看。</strong>被积函数有断点时，原函数在每一段上各带一个常数，不能用一个 <Katex tex="C" /> 通吃。</li>
        <li><strong>提示四：验算只要求导。</strong>积分做完，把结果求导看是否回到被积函数；这一步只要几十秒，却能拦住绝大多数符号错误。</li>
      </ul>
    </div>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createAntideriv } from '../../../boards/calc1/integral/antideriv.js';
import { IN_CHAPTERS } from './inav.js';
</script>
