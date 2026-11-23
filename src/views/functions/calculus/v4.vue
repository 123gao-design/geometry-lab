<template>
  <ChPage :cur="4" no="V4" base="/functions/v" :chapters="V_CHAPTERS"
    title="凹凸性与切线放缩" sub="凸性确定切线不等式的适用区间。二阶导数可以用来判断凸性。"
    :toc="[{ id: 'v4-second', t: '二阶导数：斜率怎么转' }, { id: 'v4-tangent', t: '切线放缩：区间版不等式' }, { id: 'v4-heng', t: '恒成立：相切即临界' }, { id: 'v4-pit', t: '出区间与忘验凸性' }]">
    <div class="note good" id="v4-law"><strong>凹凸性与切线放缩（区间版）</strong>：若 f 在区间 I 上满足 <Katex tex="f''\ge 0"/>（下凸），则对 I 内<strong>任意</strong> x、<Katex tex="x_0"/>：<Katex tex="f(x)\ \ge\ f(x_0)+f'(x_0)(x-x_0)" /> —— 曲线不低于 I 内的任何一条切线；<Katex tex="f''\le 0"/>（上凸）时不等号反向。两个典型例子：<Katex tex="e^x\ge x+1" />（<Katex tex="x_0=0"/>）、<Katex tex="\ln x\le x-1" />（<Katex tex="x_0=1"/>）。</div>
    <div class="board-wrap">
      <BoardMount :factory="createGate" />
      <div class="cap">图 V4 · <b>切线与曲线的位置关系</b>。移动切点，绿色表示曲线在切线上方，红色表示下方。用三次函数观察跨出同一凸性区间后可能发生的变化。</div>
    </div>

    <h3 class="sec" id="v4-second">二阶导数：斜率怎么转</h3>
    <p>把 S2 的单调判据请到 <Katex tex="f'"/> 头上，就得到凹凸判据：<Katex tex="f''>0\Rightarrow f'"/> 递增 <Katex tex="\Rightarrow"/> 切线越走越翘、曲线像碗底（<strong>下凸</strong>）；<Katex tex="f''<0\Rightarrow f'"/> 递减 <Katex tex="\Rightarrow"/> 曲线像拱顶（<strong>上凸</strong>）。图 V4 的「二阶判读」徽章把这套判词逐点读出：<Katex tex="e^x"/> 处处 <Katex tex="f''=e^x>0"/>、<Katex tex="\ln x"/> 处处 <Katex tex="f''=-1/x^2<0"/>、<Katex tex="x^3"/> 的 <Katex tex="f''=6x"/> 在原点变号 —— <strong>拐点</strong>：凹凸在此换向，曲线与切线的上下关系互换。</p>
    <p>「导数的导数」不是记号的重复：f′ 管升降（V3 的极值判据），f″ 管弯向 —— 一阶读增减走势，二阶读弯曲方向。物理里 f″ 是加速度，读的是「速度的变化率」；E5 讲对数增长「增速一直减小」，这正是 ln x 上凸的图象依据。f 与 f′ 的上下双面板是 S2 的专属版式，本章一律走徽章读数 —— 例③的 x³：f″=6x 从负翻正，拐点恰在原点。</p>

    <h3 class="sec" id="v4-tangent">切线放缩：区间版不等式</h3>
    <p>下凸 <Katex tex="\Rightarrow"/> <Katex tex="f'"/> 递增。取定切点 <Katex tex="x_0"/>，令差函数 <Katex tex="g(x)=f(x)-[f(x_0)+f'(x_0)(x-x_0)]"/>（曲线减切线）：<Katex tex="g(x_0)=0"/>、<Katex tex="g'(x_0)=0"/>；<Katex tex="x>x_0"/> 时 <Katex tex="g'=f'-f'(x_0)\ge 0"/>，<Katex tex="x<x_0"/> 时 <Katex tex="g'\le 0"/> <Katex tex="\Rightarrow"/> <Katex tex="x_0"/> 是 g 的最小值点 <Katex tex="\Rightarrow"/> <Katex tex="g\ge 0"/>。一句话：<strong>下凸函数的任何一条切线都是支撑线</strong>，上凸则切线全是「压顶线」。注意证明只用了「f′ 在整个区间上递增」—— 所以放缩的通行范围是<strong>凹凸区间</strong>，不是全定义域。</p>
    <p>指数函数在实轴上凸，对数函数在正半轴上凹：<Katex tex="x_0=0"/> 给 <Katex tex="e^x\ge 1+x" />，<Katex tex="x_0=1"/> 给 <Katex tex="\ln x\le x-1" />。它们还是逐级放缩的标准起点 —— 证 <Katex tex="x\ge 0"/> 时 <Katex tex="e^x\ge 1+x+\tfrac{x^2}{2}" />：令 <Katex tex="g=e^x-1-x-x^2/2"/>，则 <Katex tex="g'=e^x-1-x\ge 0"/>（正是 <Katex tex="e^x\ge 1+x"/>），又 <Katex tex="g(0)=0"/> <Katex tex="\Rightarrow"/> <Katex tex="g\ge 0"/>。上一条放缩作为引理推出下一条 —— 这正是泰勒展开逐项推进的雏形，V6 将给出完整图景。</p>
    <p>三次函数减去在 <Katex tex="x_0" /> 处的切线，等于 <Katex tex="(x-x_0)^2(x+2x_0)" />。当 <Katex tex="x_0=1" /> 时，差值在 x=−2 处变号。凸性保证切线不等式在包含切点的凸区间内成立，区间外需另行判断。</p>

    <h3 class="sec" id="v4-heng">恒成立：相切即临界</h3>
    <p>「对一切 <Katex tex="x\in D"/>，<Katex tex="f(x)\ge ax+b"/> 恒成立，求 a 的范围」—— 差函数 <Katex tex="g(x)=f(x)-ax-b"/> 要求最小值 <Katex tex="\ge 0"/>。临界时刻：参数直线恰好是切线 —— 联立 <Katex tex="f(x_0)=ax_0+b" /> 与 <Katex tex="f'(x_0)=a" />（相切 = 公共点 + 公共斜率，T1 切线四法的判别式路线在这里复用）。解出临界参数后，再由凸性决定哪一侧成立：下凸曲线永远在切线上方 <Katex tex="\Rightarrow"/> 切线位置的参数就是「最紧」的位置。</p>
    <p>临界直线若在定义域内点接触，可以用相切条件求参数。边界也可能由定义域端点决定，或仅对应无穷远处的极限，因此需要回到原不等式检查。</p>

    <h3 class="sec" id="v4-pit">出区间与忘验凸性</h3>
    <div class="note warn tip">
      <div class="tip-t"><span class="tip-ic">💡</span>提示</div>
      <ul class="tip-list">
        <li><strong>提示一：超出凸性区间时重新判断。</strong>曲线与切线可能继续保持原来的高低关系，也可能相交。用差函数确定符号变化点。</li>
        <li><strong>提示二：不验凸性就把切线不等式当万能。</strong>「<Katex tex="f\ge"/> 切线」没有凸性保证根本不成立 —— V1 讲过切线可以穿过曲线：<Katex tex="x^3"/> 的每条非拐点切线都穿曲线（拐点处曲线穿过切线）。先验 <Katex tex="f''"/> 的符号区间，再使用不等式。</li>
        <li><strong>提示三：临界解出后忘验端点与排除态。</strong>参数取到边界时直线可能退化为切线本身，务必回代检验。</li>
      </ul>
    </div>
    <p>下一讲把四讲工具串成完整大题工作流：分类讨论按参数分档、每档走「f′→驻点→极值→最值」、结论回验 —— 参数综合是导数的主场完结。</p>
  </ChPage>
</template>
<script setup>
import ChPage from '../../../components/ChPage.vue';
import BoardMount from '../../../components/BoardMount.vue';
import Katex from '../../../components/Katex.vue';
import { createBoard as createGate } from '../../../boards/functions/calculus/tangentineq.js';
import { V_CHAPTERS } from './vnav.js';
</script>
