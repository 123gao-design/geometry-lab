<template>
  <ChPage :cur="1" no="参1" base="/polar/s" :chapters="PS_CHAPTERS"
    title="参数方程与消参"
    sub="参数方程把横纵坐标分别写成同一个参数的函数：参数每取一个值，给出一枚点；参数走遍定义域，点连成曲线。消去参数得到普通方程，但参数的定义域往往留下限制，直接写普通方程容易把范围放大。"
    :toc="[{ id: 's1-what', t: '从参数到点' }, { id: 's1-elim', t: '消参的常用手法' }, { id: 's1-range', t: '定义域与范围' }, { id: 's1-pit', t: '范围放大与参数混用' }]">
    <div class="note good">在取定的坐标系中，如果曲线上任意一点的坐标 <Katex tex="x" />、<Katex tex="y" /> 都可以表示为某个变量 <Katex tex="t" /> 的函数
      <span style="display:block;text-align:center"><Katex tex="\begin{cases}x=f(t),\\ y=g(t),\end{cases}" /></span>
      并且对于 <Katex tex="t" /> 的每一个允许值，由这组式子确定的点 <Katex tex="(x,y)" /> 都在这条曲线上，那么这组式子叫做曲线的<strong>参数方程</strong>，<Katex tex="t" /> 叫<strong>参数</strong>。参数不一定有直观含义，它的作用是把两个坐标的取值绑在同一个变量上。</div>
    <div class="board-wrap">
      <BoardMount :factory="createParamTrace" />
      <div class="cap">图 参1 · <b>参数方程与消参</b>：浅色曲线是整条轨迹，金色实线是参数已经走过的部分，橙色小字是当前的 <Katex tex="t" />。看点：切换直线、圆、抛物线三种参数方程，拖动 <Katex tex="M" />，参数每走一步就落下一枚点；右侧徽章同时给出参数方程、普通方程与当前坐标，三种曲线的消参手法一眼可比。</div>
    </div>

    <h3 class="sec" id="s1-what">从参数到点</h3>
    <p>普通方程 <Katex tex="y=f(x)" /> 把 <Katex tex="y" /> 直接写成 <Katex tex="x" /> 的函数，曲线上每个 <Katex tex="x" /> 只能对应一个 <Katex tex="y" />。参数方程不受这条限制：<Katex tex="x" /> 与 <Katex tex="y" /> 各自随参数变化，同一个 <Katex tex="x" /> 可以对应多个 <Katex tex="y" />，圆与椭圆因此都能写成一行式子。</p>
    <p>以图 参1 的直线为例，参数方程是 <Katex tex="x=1+t" />、<Katex tex="y=2t-1" />。取 <Katex tex="t=0" /> 得点 <Katex tex="(1,-1)" />，取 <Katex tex="t=1" /> 得点 <Katex tex="(2,1)" />，取 <Katex tex="t=-1" /> 得点 <Katex tex="(0,-3)" />。参数每取一个值，横纵坐标同时被确定，点的位置随之确定。</p>
    <p>参数方程与普通方程描述同一条曲线，只是组织方式不同。普通方程便于判断点是否在曲线上，参数方程便于让点动起来：把参数看成时间，曲线就是点的运动轨迹。</p>

    <h3 class="sec" id="s1-elim">消参的常用手法</h3>
    <p>消参的目标是从 <Katex tex="x=f(t)" />、<Katex tex="y=g(t)" /> 中消去 <Katex tex="t" />，得到只含 <Katex tex="x" />、<Katex tex="y" /> 的方程。常用手法有三种。</p>
    <p><strong>代入消参。</strong>从一个式子解出 <Katex tex="t" />，代入另一个式子。直线 <Katex tex="x=1+t" />、<Katex tex="y=2t-1" /> 中，由第一式得 <Katex tex="t=x-1" />，代入第二式得 <Katex tex="y=2(x-1)-1=2x-3" />。抛物线 <Katex tex="x=t^2" />、<Katex tex="y=2t" /> 中，由第二式得 <Katex tex="t=y/2" />，代入第一式得 <Katex tex="x=y^2/4" />，即 <Katex tex="y^2=4x" />。</p>
    <p><strong>平方相加或相减。</strong>圆 <Katex tex="x=2\cos t" />、<Katex tex="y=2\sin t" /> 中，两式平方相加，利用 <Katex tex="\cos^2t+\sin^2t=1" />，得 <Katex tex="x^2+y^2=4" />。椭圆与双曲线也用这一招，只是系数不同、相减而非相加。</p>
    <p><strong>借用恒等式。</strong>双曲线 <Katex tex="x=a\sec\theta" />、<Katex tex="y=b\tan\theta" /> 用 <Katex tex="\sec^2\theta-\tan^2\theta=1" />，得到 <Katex tex="x^2/a^2-y^2/b^2=1" />。抛物线用 <Katex tex="t" /> 的一次式反解，再代回二次式。</p>

    <h3 class="sec" id="s1-range">定义域与范围</h3>
    <p>消参只保证「参数方程给出的点都在普通方程表示的曲线上」，不保证「普通方程曲线上的点都能由参数方程给出」。参数的允许值范围会限制曲线的一部分。</p>
    <p>图 参1 的抛物线 <Katex tex="x=t^2" />、<Katex tex="y=2t" />，消参后写成 <Katex tex="y^2=4x" />。这条普通方程里 <Katex tex="x\ge0" /> 自动成立，正好与 <Katex tex="x=t^2\ge0" /> 一致，范围没有损失。若把参数改成 <Katex tex="x=t^2" />、<Katex tex="y=2t" /> 且限定 <Katex tex="t\ge0" />，则只剩抛物线的上半支，普通方程仍是 <Katex tex="y^2=4x" />，但曲线少了一半，范围必须另加 <Katex tex="y\ge0" />。</p>
    <p>圆与椭圆的参数角 <Katex tex="\theta" /> 通常取 <Katex tex="[0,2\pi)" />，转满一圈正好闭合；若只取 <Katex tex="\theta\in[0,\pi]" />，得到的是上半圆或上半椭圆。写参数方程时把参数范围一并写出，是避免范围放大的第一步。</p>

    <h3 class="sec" id="s1-pit">范围放大与参数混用</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：消参后范围变大。</strong>平方会带来增根，反解会丢掉符号。圆的参数方程平方相加后没有增根，因为 <Katex tex="\cos^2+\sin^2=1" /> 对任意 <Katex tex="\theta" /> 都成立；但把普通方程 <Katex tex="x^2+y^2=4" /> 改回参数方程时，若写成 <Katex tex="x=2\cos t" />、<Katex tex="y=2\sin t" />，<Katex tex="t" /> 必须走满一周才不丢点。</li>
        <li><strong>提示二：参数范围没写。</strong>不写范围的参数方程默认参数取使式子有意义的全部值。双曲线的 <Katex tex="\theta" /> 不能取 <Katex tex="90^\circ" /> 与 <Katex tex="270^\circ" />，因为 <Katex tex="\sec\theta" /> 在那里无定义；抛物线的 <Katex tex="t" /> 若被题目限定为正，曲线只剩上半支。</li>
        <li><strong>提示三：参数不是极角。</strong>椭圆 <Katex tex="x=a\cos\theta" />、<Katex tex="y=b\sin\theta" /> 里的 <Katex tex="\theta" /> 是离心角，不是点 <Katex tex="M" /> 的极角。离心角相同的点，极角一般不同；把两者混用，算出的距离与斜率都会出错。</li>
        <li><strong>提示四：同一个字母表示不同的参数。</strong>题目里若一条曲线用 <Katex tex="t" />、另一条用 <Katex tex="\theta" />，联立时不能把两个参数当成同一个。先统一成同一参数，或分别消参后再联立。</li>
      </ul>
    </div>
    <p>回收与预告：参1 只给出参数方程的一般写法与消参的三种手法。参2 把参数方程落到直线与圆上：直线的参数 <Katex tex="t" /> 就是有向距离，圆的参数 <Katex tex="\theta" /> 就是圆心角，两者都有清楚的几何含义；参3 再把椭圆、双曲线、抛物线逐条写成参数式。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createParamTrace } from '../../../boards/polar/param/paramtrace.js';
import { PS_CHAPTERS } from './psnav.js';
</script>
